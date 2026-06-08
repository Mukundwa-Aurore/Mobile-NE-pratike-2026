import type { SearchHistoryItem } from '@/types/dictionary';

export function getSearchSuggestions(
  query: string,
  history: SearchHistoryItem[],
  limit = 6
): SearchHistoryItem[] {
  const trimmed = query.trim().toLowerCase();

  if (history.length === 0) {
    return [];
  }

  if (!trimmed) {
    return history.slice(0, limit);
  }

  const matches = history.filter((item) => {
    const word = item.word.trim().toLowerCase();
    return word.startsWith(trimmed) || word.includes(trimmed);
  });

  const seen = new Set<string>();
  const unique: SearchHistoryItem[] = [];

  for (const item of matches) {
    const key = item.word.trim().toLowerCase();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    unique.push(item);
    if (unique.length >= limit) {
      break;
    }
  }

  return unique;
}
