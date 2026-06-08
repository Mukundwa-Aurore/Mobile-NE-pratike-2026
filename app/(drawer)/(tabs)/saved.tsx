import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/ui/AppHeader';
import { LexiconRadius, LexiconSpacing, LexiconTypography } from '@/constants/lexicon-theme';
import { useAppTheme } from '@/context/ThemeContext';
import { useDictionary } from '@/context/DictionaryContext';
import { useSavedWords } from '@/context/SavedWordsContext';
import { useResponsive } from '@/hooks/useResponsive';
import { lightTap } from '@/utils/haptics';

export default function SavedScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const { contentMaxWidth, horizontalPadding, tabBarSpace } = useResponsive();
  const { savedWords, removeSaved } = useSavedWords();
  const { searchWord } = useDictionary();

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.background }]}>
      <AppHeader />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingHorizontal: horizontalPadding,
            paddingBottom: tabBarSpace + insets.bottom,
            maxWidth: contentMaxWidth,
            alignSelf: 'center',
            width: '100%',
          },
        ]}
        showsVerticalScrollIndicator={false}>
        <Text style={[styles.pageTitle, { color: colors.primary }]}>Saved Words</Text>
        <Text style={[styles.pageSubtitle, { color: colors.onSurfaceVariant }]}>
          Bookmark words from the detail screen to build your personal vocabulary list.
        </Text>

        {savedWords.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="bookmark-border" size={48} color={colors.outline} />
            <Text style={[styles.emptyTitle, { color: colors.onSurface }]}>No saved words</Text>
            <Text style={[styles.emptyBody, { color: colors.onSurfaceVariant }]}>
              Tap the bookmark icon on any word detail page to save it here.
            </Text>
          </View>
        ) : (
          savedWords.map((item) => (
            <View
              key={item.word}
              style={[
                styles.savedItem,
                { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder },
              ]}>
              <Pressable
                onPress={() => {
                  lightTap();
                  searchWord(item.word);
                }}
                accessibilityRole="button"
                accessibilityLabel={`Look up ${item.word}`}
                style={({ pressed }) => [
                  styles.savedText,
                  pressed && { opacity: 0.85 },
                ]}>
                <Text style={[styles.savedWord, { color: colors.primary }]}>{item.word}</Text>
                <Text style={[styles.savedMeta, { color: colors.secondary }]} numberOfLines={2}>
                  {item.partOfSpeech}
                  {item.preview ? ` • ${item.preview}` : ''}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  lightTap();
                  removeSaved(item.word);
                }}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={`Remove ${item.word} from saved words`}
                style={[styles.removeButton, { backgroundColor: colors.surfaceContainerHigh }]}>
                <MaterialIcons name="close" size={20} color={colors.onSurfaceVariant} />
              </Pressable>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    paddingTop: LexiconSpacing.stackMd,
  },
  pageTitle: {
    ...LexiconTypography.headlineLg,
    fontFamily: 'Inter_700Bold',
    marginBottom: LexiconSpacing.stackSm,
  },
  pageSubtitle: {
    ...LexiconTypography.bodyMd,
    fontFamily: 'Inter_400Regular',
    marginBottom: LexiconSpacing.stackLg,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 8,
  },
  emptyTitle: {
    ...LexiconTypography.labelMd,
    fontFamily: 'Inter_600SemiBold',
  },
  emptyBody: {
    ...LexiconTypography.bodyMd,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  savedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: LexiconRadius.lg,
    padding: LexiconSpacing.stackMd,
    marginBottom: LexiconSpacing.stackSm,
    gap: 8,
  },
  savedText: {
    flex: 1,
    minWidth: 0,
  },
  savedWord: {
    ...LexiconTypography.labelMd,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    textTransform: 'capitalize',
  },
  savedMeta: {
    ...LexiconTypography.labelSm,
    fontFamily: 'Inter_500Medium',
    marginTop: 2,
  },
  removeButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: LexiconRadius.full,
  },
});
