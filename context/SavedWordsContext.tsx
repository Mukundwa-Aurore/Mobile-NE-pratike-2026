import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { SAVED_KEY } from '@/constants/app';
import type { DictionaryEntry } from '@/types/dictionary';
import { getFirstMeaningPreview } from '@/services/dictionaryApi';

export interface SavedWordItem {
  word: string;
  partOfSpeech: string;
  preview: string;
  savedAt: number;
}

interface SavedWordsContextValue {
  savedWords: SavedWordItem[];
  isSaved: (word: string) => boolean;
  toggleSaved: (entry: DictionaryEntry) => Promise<void>;
  removeSaved: (word: string) => Promise<void>;
  isReady: boolean;
}

const SavedWordsContext = createContext<SavedWordsContextValue | null>(null);

export function SavedWordsProvider({ children }: { children: React.ReactNode }) {
  const [savedWords, setSavedWords] = useState<SavedWordItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(SAVED_KEY)
      .then((stored) => {
        if (stored) {
          setSavedWords(JSON.parse(stored) as SavedWordItem[]);
        }
      })
      .catch(() => setSavedWords([]))
      .finally(() => setIsReady(true));
  }, []);

  const persist = useCallback(async (items: SavedWordItem[]) => {
    setSavedWords(items);
    await AsyncStorage.setItem(SAVED_KEY, JSON.stringify(items));
  }, []);

  const isSaved = useCallback(
    (word: string) => savedWords.some((item) => item.word.toLowerCase() === word.toLowerCase()),
    [savedWords]
  );

  const toggleSaved = useCallback(
    async (entry: DictionaryEntry) => {
      const word = entry.word.toLowerCase();
      const exists = savedWords.some((item) => item.word === word);

      if (exists) {
        await persist(savedWords.filter((item) => item.word !== word));
        return;
      }

      const { partOfSpeech, preview } = getFirstMeaningPreview(entry);
      await persist([
        { word, partOfSpeech, preview, savedAt: Date.now() },
        ...savedWords,
      ]);
    },
    [persist, savedWords]
  );

  const removeSaved = useCallback(
    async (word: string) => {
      await persist(savedWords.filter((item) => item.word !== word.toLowerCase()));
    },
    [persist, savedWords]
  );

  const value = useMemo(
    () => ({ savedWords, isSaved, toggleSaved, removeSaved, isReady }),
    [savedWords, isSaved, toggleSaved, removeSaved, isReady]
  );

  return <SavedWordsContext.Provider value={value}>{children}</SavedWordsContext.Provider>;
}

export function useSavedWords() {
  const context = useContext(SavedWordsContext);
  if (!context) {
    throw new Error('useSavedWords must be used within SavedWordsProvider');
  }
  return context;
}
