import AsyncStorage from '@react-native-async-storage/async-storage';

import type { DictionaryEntry } from '@/types/dictionary';

const CACHE_KEY = '@lexitech_dictionary_cache';
const MAX_ENTRIES = 40;

type CacheMap = Record<string, DictionaryEntry[]>;

async function readCache(): Promise<CacheMap> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    if (!raw) {
      return {};
    }
    return JSON.parse(raw) as CacheMap;
  } catch {
    return {};
  }
}

export async function getCachedDefinition(word: string): Promise<DictionaryEntry[] | null> {
  const key = word.trim().toLowerCase();
  const cache = await readCache();
  return cache[key] ?? null;
}

export async function setCachedDefinition(word: string, entries: DictionaryEntry[]): Promise<void> {
  const key = word.trim().toLowerCase();
  const cache = await readCache();
  cache[key] = entries;

  const keys = Object.keys(cache);
  if (keys.length > MAX_ENTRIES) {
    const trimmed = keys.slice(keys.length - MAX_ENTRIES);
    const next: CacheMap = {};
    for (const entryKey of trimmed) {
      next[entryKey] = cache[entryKey];
    }
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(next));
    return;
  }

  await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}
