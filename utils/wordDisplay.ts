import type { TextStyle } from 'react-native';

const LONG_WORD_THRESHOLD = 18;
const VERY_LONG_WORD_THRESHOLD = 28;

export function isLongWord(word: string) {
  return word.trim().length > LONG_WORD_THRESHOLD;
}

export function getWordTitleStyle(word: string, compact = false): TextStyle {
  const length = word.trim().length;
  const delta = compact ? 2 : 0;

  if (length > VERY_LONG_WORD_THRESHOLD) {
    return { fontSize: 16 - delta, lineHeight: 22 - delta, flexShrink: 0 };
  }
  if (length > LONG_WORD_THRESHOLD) {
    return { fontSize: 20 - delta, lineHeight: 26 - delta, flexShrink: 0 };
  }
  if (length > 12) {
    return { fontSize: 22 - delta, lineHeight: 28 - delta, flexShrink: 0 };
  }

  return { fontSize: 26 - delta, lineHeight: 32 - delta, flexShrink: 0 };
}

export function getWordChipStyle(word: string): TextStyle {
  const length = word.trim().length;

  if (length > VERY_LONG_WORD_THRESHOLD) {
    return { fontSize: 12, lineHeight: 16 };
  }
  if (length > LONG_WORD_THRESHOLD) {
    return { fontSize: 13, lineHeight: 18 };
  }

  return { fontSize: 14, lineHeight: 20 };
}
