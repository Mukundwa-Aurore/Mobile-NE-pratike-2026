import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { LexiconRadius } from '@/constants/lexicon-theme';
import { useAppTheme } from '@/context/ThemeContext';
import type { SearchHistoryItem } from '@/types/dictionary';

interface SearchSuggestionsProps {
  suggestions: SearchHistoryItem[];
  query: string;
  onSelect: (word: string) => void;
  visible: boolean;
}

export function SearchSuggestions({ suggestions, query, onSelect, visible }: SearchSuggestionsProps) {
  const { colors } = useAppTheme();

  if (!visible || suggestions.length === 0) {
    return null;
  }

  const trimmed = query.trim().toLowerCase();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceContainerLowest,
          borderColor: colors.surfaceContainerHigh,
          shadowColor: colors.primary,
        },
      ]}>
      <View style={[styles.header, { borderBottomColor: colors.surfaceContainerHigh }]}>
        <MaterialIcons name="history" size={14} color={colors.onSurfaceVariant} />
        <Text style={[styles.headerText, { color: colors.onSurfaceVariant }]}>
          {trimmed ? 'Matching searches' : 'Recent searches'}
        </Text>
      </View>

      {suggestions.map((item, index) => (
        <Pressable
          key={item.word}
          accessibilityRole="button"
          accessibilityLabel={`Search for ${item.word}`}
          onPress={() => onSelect(item.word)}
          style={({ pressed }) => [
            styles.item,
            index < suggestions.length - 1 && {
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderBottomColor: colors.surfaceContainerHigh,
            },
            pressed && { backgroundColor: colors.surfaceContainerLow },
          ]}>
          <MaterialIcons name="search" size={16} color={colors.secondary} />
          <View style={styles.itemText}>
            <Text style={[styles.word, { color: colors.primary }]} numberOfLines={1}>
              {highlightMatch(item.word, trimmed, colors.secondary)}
            </Text>
            {item.partOfSpeech ? (
              <Text style={[styles.meta, { color: colors.onSurfaceVariant }]} numberOfLines={1}>
                {item.partOfSpeech}
                {item.preview ? ` · ${item.preview}` : ''}
              </Text>
            ) : null}
          </View>
          <MaterialIcons name="north-west" size={16} color={colors.outlineVariant} />
        </Pressable>
      ))}
    </View>
  );
}

function highlightMatch(word: string, query: string, accentColor: string) {
  if (!query) {
    return word;
  }

  const lowerWord = word.toLowerCase();
  const index = lowerWord.indexOf(query);

  if (index === -1) {
    return word;
  }

  const before = word.slice(0, index);
  const match = word.slice(index, index + query.length);
  const after = word.slice(index + query.length);

  return (
    <Text>
      {before}
      <Text style={{ color: accentColor, fontFamily: 'Inter_700Bold' }}>{match}</Text>
      {after}
    </Text>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 6,
    borderRadius: LexiconRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  itemText: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  word: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'capitalize',
  },
  meta: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
});
