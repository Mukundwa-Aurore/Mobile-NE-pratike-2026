import AsyncStorage from '@react-native-async-storage/async-storage';

import { SESSION_KEY } from '@/constants/app';
import type { DictionaryEntry } from '@/types/dictionary';

interface DictionarySession {
  entries: DictionaryEntry[];
  lastQuery: string;
  savedAt: number;
}

export async function saveDictionarySession(
  entries: DictionaryEntry[],
  lastQuery: string
): Promise<void> {
  const payload: DictionarySession = {
    entries,
    lastQuery,
    savedAt: Date.now(),
  };
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(payload));
}

export async function loadDictionarySession(): Promise<DictionarySession | null> {
  try {
    const raw = await AsyncStorage.getItem(SESSION_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as DictionarySession;
    if (!Array.isArray(parsed.entries) || parsed.entries.length === 0) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export async function clearDictionarySession(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_KEY);
}
