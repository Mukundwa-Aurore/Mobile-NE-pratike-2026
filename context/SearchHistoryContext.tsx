import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import type { DictionaryEntry } from '@/types/dictionary';
import { getFirstMeaningPreview, isSuccessfulDictionaryEntry } from '@/services/dictionaryApi';
import type { SearchHistoryItem } from '@/types/dictionary';

import { HISTORY_KEY } from '@/constants/app';

interface SearchHistoryContextValue {
  history: SearchHistoryItem[];
  addToHistory: (entry: DictionaryEntry) => Promise<void>;
  clearHistory: () => Promise<void>;
  isReady: boolean;
}

const SearchHistoryContext = createContext<SearchHistoryContextValue | null>(null);

export function SearchHistoryProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(HISTORY_KEY)
      .then((stored) => {
        if (stored) {
          setHistory(JSON.parse(stored) as SearchHistoryItem[]);
        }
      })
      .catch(() => {
        setHistory([]);
      })
      .finally(() => setIsReady(true));
  }, []);

  const addToHistory = useCallback(
    async (entry: DictionaryEntry) => {
      if (!isSuccessfulDictionaryEntry(entry)) {
        return;
      }

      const { partOfSpeech, preview } = getFirstMeaningPreview(entry);
      const word = entry.word.trim().toLowerCase();

      setHistory((prev) => {
        const filtered = prev.filter((item) => item.word.trim().toLowerCase() !== word);
        const next: SearchHistoryItem[] = [
          {
            word,
            partOfSpeech,
            preview,
            searchedAt: Date.now(),
          },
          ...filtered,
        ].slice(0, 50);

        AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(next)).catch(() => undefined);
        return next;
      });
    },
    []
  );

  const clearHistory = useCallback(async () => {
    setHistory([]);
    try {
      await AsyncStorage.removeItem(HISTORY_KEY);
    } catch {
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify([]));
    }
  }, []);

  const value = useMemo(
    () => ({ history, addToHistory, clearHistory, isReady }),
    [history, addToHistory, clearHistory, isReady]
  );

  return <SearchHistoryContext.Provider value={value}>{children}</SearchHistoryContext.Provider>;
}

export function useSearchHistory() {
  const context = useContext(SearchHistoryContext);
  if (!context) {
    throw new Error('useSearchHistory must be used within SearchHistoryProvider');
  }
  return context;
}
