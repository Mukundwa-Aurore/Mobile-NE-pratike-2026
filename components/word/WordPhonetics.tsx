import { StyleSheet, Text, View } from 'react-native';

import { LexiconTypography } from '@/constants/lexicon-theme';
import { useAppTheme } from '@/context/ThemeContext';

interface WordPhoneticsProps {
  phonetics: string[];
}

export function WordPhonetics({ phonetics }: WordPhoneticsProps) {
  const { colors } = useAppTheme();

  if (phonetics.length === 0) {
    return (
      <View style={styles.block}>
        <Text style={[styles.missing, { color: colors.outline }]}>
          Phonetic spelling not available
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.block}>
      {phonetics.map((text, index) => (
        <Text
          key={`${text}-${index}`}
          style={[styles.phonetic, { color: colors.onSurfaceVariant }]}>
          {phonetics.length > 1 ? `${index + 1}. ${text}` : text}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    width: '100%',
    gap: 4,
  },
  phonetic: {
    ...LexiconTypography.phonetic,
    fontSize: 15,
    lineHeight: 22,
    fontFamily: 'Inter_400Regular',
    fontStyle: 'italic',
  },
  missing: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Inter_400Regular',
    fontStyle: 'italic',
  },
});
