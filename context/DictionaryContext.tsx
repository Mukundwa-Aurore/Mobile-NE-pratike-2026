import { useRouter } from 'expo-router';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { ROUTES } from '@/constants/routes';
import { useSearchHistory } from '@/context/SearchHistoryContext';
import {
  fetchWordDefinition,
  isDictionaryError,
  isSuccessfulDictionaryEntry,
} from '@/services/dictionaryApi';
import {
  clearDictionarySession,
  loadDictionarySession,
  saveDictionarySession,
} from '@/services/sessionStore';
import type { DictionaryEntry, DictionaryError } from '@/types/dictionary';

interface DictionaryContextValue {
  entries: DictionaryEntry[] | null;
  loading: boolean;
  error: DictionaryError | null;
  lastQuery: string;
  sessionReady: boolean;
  searchWord: (word: string) => Promise<void>;
  clearError: () => void;
  clearResults: () => void;
}

const DictionaryContext = createContext<DictionaryContextValue | null>(null);

export function DictionaryProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { addToHistory } = useSearchHistory();
  const [entries, setEntries] = useState<DictionaryEntry[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<DictionaryError | null>(null);
  const [lastQuery, setLastQuery] = useState('');
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    loadDictionarySession()
      .then((session) => {
        if (session) {
          setEntries(session.entries);
          setLastQuery(session.lastQuery);
        }
      })
      .finally(() => setSessionReady(true));
  }, []);

  const searchWord = useCallback(
    async (word: string) => {
      const trimmed = word.trim();

      if (!trimmed) {
        setError({
          type: 'unknown',
          message: 'Please enter a word before searching.',
          word: '',
        });
        return;
      }

      setLoading(true);
      setError(null);
      setEntries(null);
      setLastQuery(trimmed);

      try {
        const data = await fetchWordDefinition(trimmed);
        const entry = data[0];

        if (!isSuccessfulDictionaryEntry(entry)) {
          throw {
            type: 'unknown',
            message: 'Received an unexpected response from the dictionary service.',
            word: trimmed,
          } satisfies DictionaryError;
        }

        setEntries(data);
        await saveDictionarySession(data, trimmed);
        await addToHistory(entry);
        router.push(ROUTES.wordDetails);
      } catch (err) {
        setEntries(null);
        await clearDictionarySession();

        if (isDictionaryError(err)) {
          setError(err);
          if (err.type === 'not_found') {
            router.push({
              pathname: ROUTES.notFound,
              params: { word: trimmed },
            } as Parameters<typeof router.push>[0]);
          }
        } else {
          setError({
            type: 'unknown',
            message: 'An unexpected error occurred. Please try again.',
            word: trimmed,
          });
        }
      } finally {
        setLoading(false);
      }
    },
    [addToHistory, router]
  );

  const clearError = useCallback(() => setError(null), []);
  const clearResults = useCallback(() => {
    setEntries(null);
    setError(null);
    void clearDictionarySession();
  }, []);

  const value = useMemo(
    () => ({
      entries,
      loading,
      error,
      lastQuery,
      sessionReady,
      searchWord,
      clearError,
      clearResults,
    }),
    [entries, loading, error, lastQuery, sessionReady, searchWord, clearError, clearResults]
  );

  return <DictionaryContext.Provider value={value}>{children}</DictionaryContext.Provider>;
}

export function useDictionary() {
  const context = useContext(DictionaryContext);
  if (!context) {
    throw new Error('useDictionary must be used within DictionaryProvider');
  }
  return context;
}
