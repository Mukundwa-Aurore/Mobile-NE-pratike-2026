import Animated, { FadeInDown } from 'react-native-reanimated';
import { StyleSheet, Text, View } from 'react-native';

import { LexiconRadius, LexiconSpacing } from '@/constants/lexicon-theme';
import { useAppTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import type { DictionaryMeaning } from '@/types/dictionary';

interface DefinitionSectionProps {
  meaning: DictionaryMeaning;
  index: number;
}

export function DefinitionSection({ meaning, index }: DefinitionSectionProps) {
  const { colors, isDark } = useAppTheme();
  const { isCompact } = useResponsive();
  const partLabel = meaning.partOfSpeech.charAt(0).toUpperCase() + meaning.partOfSpeech.slice(1);

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 80).springify()}
      style={[
        styles.card,
        isCompact && styles.cardCompact,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.cardBorder,
        },
      ]}>
      <View style={[styles.chip, { backgroundColor: colors.secondaryContainer }]}>
        <Text style={[styles.chipText, { color: colors.onSecondaryContainer }]}>{partLabel}</Text>
      </View>

      {meaning.definitions.map((def, defIndex) => (
        <View key={`${meaning.partOfSpeech}-${defIndex}`} style={styles.definitionRow}>
          <Text style={[styles.indexLabel, { color: colors.secondary }]}>{defIndex + 1}.</Text>
          <View style={styles.definitionContent}>
            <Text style={[styles.definition, { color: colors.onSurface }]}>{def.definition}</Text>
            {def.example ? (
              <View style={[styles.exampleBox, { backgroundColor: colors.surfaceContainerLow }]}>
                <Text style={[styles.example, { color: colors.onSurfaceVariant }]}>
                  &ldquo;{def.example}&rdquo;
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      ))}

      {(meaning.synonyms.length > 0 || meaning.antonyms.length > 0) && (
        <View style={styles.relationsRow}>
          {meaning.synonyms.length > 0 ? (
            <View
              style={[
                styles.relationCard,
                {
                  backgroundColor: isDark ? colors.primaryContainer + '44' : colors.primaryContainer + '14',
                  borderColor: isDark ? colors.primary + '55' : colors.primary + '22',
                },
              ]}>
              <Text style={[styles.relationTitle, { color: colors.primary }]}>Synonyms</Text>
              <Text style={[styles.relationText, { color: colors.onSurfaceVariant }]}>
                {meaning.synonyms.join(', ')}
              </Text>
            </View>
          ) : null}
          {meaning.antonyms.length > 0 ? (
            <View
              style={[
                styles.relationCard,
                { backgroundColor: colors.surfaceContainerHigh },
              ]}>
              <Text style={[styles.relationTitle, { color: colors.primary }]}>Antonyms</Text>
              <Text style={[styles.relationText, { color: colors.onSurfaceVariant }]}>
                {meaning.antonyms.join(', ')}
              </Text>
            </View>
          ) : null}
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: LexiconRadius.lg,
    padding: LexiconSpacing.gutterCard,
    gap: 12,
    borderWidth: 1,
  },
  cardCompact: {
    padding: 12,
    gap: 10,
  },
  chip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: LexiconRadius.full,
  },
  chipText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  definitionRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  indexLabel: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    marginTop: 2,
    minWidth: 18,
  },
  definitionContent: {
    flex: 1,
    gap: 8,
  },
  definition: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: 'Inter_400Regular',
  },
  exampleBox: {
    borderRadius: LexiconRadius.md,
    padding: 10,
  },
  example: {
    fontSize: 13,
    lineHeight: 19,
    fontStyle: 'italic',
    fontFamily: 'Inter_400Regular',
  },
  relationsRow: {
    flexDirection: 'row',
    gap: LexiconSpacing.stackSm,
    flexWrap: 'wrap',
  },
  relationCard: {
    flex: 1,
    minWidth: '45%',
    padding: 10,
    borderRadius: LexiconRadius.md,
    borderWidth: 1,
  },
  relationTitle: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 4,
  },
  relationText: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Inter_400Regular',
  },
});
