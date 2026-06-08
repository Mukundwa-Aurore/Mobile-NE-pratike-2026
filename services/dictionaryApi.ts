import axios, { AxiosError, isAxiosError } from 'axios';

import { getCachedDefinition, setCachedDefinition } from '@/services/dictionaryCache';
import type { DictionaryEntry, DictionaryError, PronunciationVariant } from '@/types/dictionary';

const BASE_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en';

export function normalizeAudioUrl(audio?: string): string | null {
  if (!audio || audio.trim() === '') {
    return null;
  }
  if (audio.startsWith('//')) {
    return `https:${audio}`;
  }
  return audio;
}

export function getPhoneticText(entry: DictionaryEntry): string {
  if (entry.phonetic) {
    return entry.phonetic;
  }
  const withText = entry.phonetics.find((p) => p.text);
  return withText?.text ?? '';
}

export function getAllPhoneticTexts(entry: DictionaryEntry): string[] {
  const texts = entry.phonetics
    .map((p) => p.text?.trim())
    .filter((text): text is string => Boolean(text));

  if (entry.phonetic && !texts.includes(entry.phonetic)) {
    texts.unshift(entry.phonetic);
  }

  return [...new Set(texts)];
}

export function getAudioUrls(entry: DictionaryEntry): string[] {
  return getPhoneticAudioEntries(entry).map((entry) => entry.url);
}

export function getPhoneticAudioEntries(
  entry: DictionaryEntry
): { text?: string; url: string }[] {
  return getPronunciationVariants(entry)
    .filter((variant): variant is PronunciationVariant & { audioUrl: string } => Boolean(variant.audioUrl))
    .map((variant) => ({ text: variant.text, url: variant.audioUrl }));
}

function inferPronunciationLabel(sourceUrl: string | undefined, index: number): string {
  if (!sourceUrl) {
    return `Pronunciation ${index + 1}`;
  }

  const lower = sourceUrl.toLowerCase();
  if (lower.includes('us') || lower.includes('-us') || lower.includes('american')) {
    return 'US Pronunciation';
  }
  if (lower.includes('uk') || lower.includes('-uk') || lower.includes('gb') || lower.includes('british')) {
    return 'UK Pronunciation';
  }
  if (lower.includes('au') || lower.includes('australia')) {
    return 'Australian Pronunciation';
  }

  return `Pronunciation ${index + 1}`;
}

export function getPronunciationVariants(entry: DictionaryEntry): PronunciationVariant[] {
  const variants: PronunciationVariant[] = [];
  const seenAudio = new Set<string>();
  const seenKeys = new Set<string>();
  let labelIndex = 0;

  for (const phonetic of entry.phonetics) {
    const text = phonetic.text?.trim();
    const audioUrl = normalizeAudioUrl(phonetic.audio) ?? undefined;
    const key = `${text ?? ''}|${audioUrl ?? ''}`;

    if (seenKeys.has(key)) {
      continue;
    }

    if (!text && !audioUrl) {
      continue;
    }

    seenKeys.add(key);
    if (audioUrl) {
      seenAudio.add(audioUrl);
    }

    variants.push({
      id: audioUrl ?? `text-${text ?? labelIndex}`,
      label: inferPronunciationLabel(phonetic.sourceUrl, labelIndex),
      text: text ?? entry.phonetic ?? 'Phonetic spelling not available',
      audioUrl,
    });
    labelIndex += 1;
  }

  if (variants.length === 0 && entry.phonetic) {
    variants.push({
      id: `primary-${entry.phonetic}`,
      label: 'Primary',
      text: entry.phonetic,
    });
  }

  return variants;
}

export function getPrimaryPhonetic(entry: DictionaryEntry): string | null {
  const variants = getPronunciationVariants(entry);
  const first = variants.find((variant) => variant.text && variant.text !== 'Phonetic spelling not available');
  return first?.text ?? entry.phonetic ?? null;
}

export function isSuccessfulDictionaryEntry(entry: DictionaryEntry | undefined): entry is DictionaryEntry {
  return Boolean(
    entry &&
      entry.word.trim().length > 0 &&
      Array.isArray(entry.meanings) &&
      entry.meanings.length > 0
  );
}

export function getFirstMeaningPreview(entry: DictionaryEntry): {
  partOfSpeech: string;
  preview: string;
} {
  const firstMeaning = entry.meanings[0];
  const firstDefinition = firstMeaning?.definitions[0];

  return {
    partOfSpeech: firstMeaning?.partOfSpeech ?? '',
    preview: firstDefinition?.definition ?? '',
  };
}

function parseDictionaryError(error: unknown, word: string): DictionaryError {
  if (isAxiosError(error)) {
    const axiosError = error as AxiosError;

    if (!axiosError.response) {
      return {
        type: 'network',
        message: 'Unable to connect. Please check your internet connection and try again.',
        word,
      };
    }

    if (axiosError.response.status === 404) {
      return {
        type: 'not_found',
        message: `We couldn't find "${word}" in our dictionary. Check the spelling or try a different term.`,
        word,
      };
    }
  }

  return {
    type: 'unknown',
    message: 'Something went wrong while fetching the word. Please try again.',
    word,
  };
}

export async function fetchWordDefinition(
  word: string,
  options?: { skipCache?: boolean }
): Promise<DictionaryEntry[]> {
  const trimmed = word.trim().toLowerCase();

  if (!trimmed) {
    throw {
      type: 'unknown',
      message: 'Please enter a word to search.',
      word: trimmed,
    } satisfies DictionaryError;
  }

  if (!options?.skipCache) {
    const cached = await getCachedDefinition(trimmed);
    if (cached) {
      return cached;
    }
  }

  try {
    const response = await axios.get<DictionaryEntry[]>(`${BASE_URL}/${encodeURIComponent(trimmed)}`, {
      timeout: 15000,
      headers: { Accept: 'application/json' },
    });

    if (!Array.isArray(response.data) || response.data.length === 0) {
      throw {
        type: 'unknown',
        message: 'Received an unexpected response from the dictionary service.',
        word: trimmed,
      } satisfies DictionaryError;
    }

    await setCachedDefinition(trimmed, response.data);
    return response.data;
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'type' in error) {
      throw error;
    }
    throw parseDictionaryError(error, trimmed);
  }
}

export function isDictionaryError(error: unknown): error is DictionaryError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'type' in error &&
    'message' in error &&
    'word' in error
  );
}
