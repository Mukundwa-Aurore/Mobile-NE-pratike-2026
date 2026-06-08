export interface DictionaryLicense {
  name: string;
  url: string;
}

export interface DictionaryPhonetic {
  text?: string;
  audio?: string;
  sourceUrl?: string;
  license?: DictionaryLicense;
}

export interface DictionaryDefinition {
  definition: string;
  synonyms: string[];
  antonyms: string[];
  example?: string;
}

export interface DictionaryMeaning {
  partOfSpeech: string;
  definitions: DictionaryDefinition[];
  synonyms: string[];
  antonyms: string[];
}

export interface DictionaryEntry {
  word: string;
  phonetic?: string;
  phonetics: DictionaryPhonetic[];
  meanings: DictionaryMeaning[];
  license?: DictionaryLicense;
  sourceUrls?: string[];
}

export interface PronunciationVariant {
  id: string;
  label: string;
  text: string;
  audioUrl?: string;
}

export interface SearchHistoryItem {
  word: string;
  partOfSpeech: string;
  preview: string;
  searchedAt: number;
}

export type DictionaryErrorType = 'not_found' | 'network' | 'unknown';

export interface DictionaryError {
  type: DictionaryErrorType;
  message: string;
  word: string;
}
