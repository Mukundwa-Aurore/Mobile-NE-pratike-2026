import { MaterialIcons } from '@expo/vector-icons';
import {
  DrawerContentScrollView,
  type DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { APP_NAME, APP_TAGLINE } from '@/constants/app';
import { ROUTES } from '@/constants/routes';
import { LexiconRadius, LexiconSpacing, LexiconTypography } from '@/constants/lexicon-theme';
import { useAppTheme } from '@/context/ThemeContext';
import { useDictionary } from '@/context/DictionaryContext';
import { useSearchHistory } from '@/context/SearchHistoryContext';
import { lightTap } from '@/utils/haptics';
import { getWordTitleStyle } from '@/utils/wordDisplay';

export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useAppTheme();
  const { history, clearHistory } = useSearchHistory();
  const { searchWord } = useDictionary();
  const [confirmClear, setConfirmClear] = useState(false);
  const [clearing, setClearing] = useState(false);

  const handleSelectWord = async (word: string) => {
    lightTap();
    props.navigation.closeDrawer();
    router.push(ROUTES.search);
    await searchWord(word);
  };

  const handleConfirmClear = async () => {
    setClearing(true);
    try {
      await clearHistory();
      lightTap();
      setConfirmClear(false);
    } finally {
      setClearing(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.surfaceContainerHigh }]}>
        <MaterialIcons name="menu-book" size={28} color={colors.primary} />
        <View>
          <Text style={[styles.brand, { color: colors.primary }]}>{APP_NAME}</Text>
          <Text style={[styles.subtitle, { color: colors.onSurfaceVariant }]}>{APP_TAGLINE}</Text>
        </View>
      </View>

      <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollContent}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <MaterialIcons name="history" size={18} color={colors.onSurfaceVariant} />
            <Text style={[styles.sectionTitle, { color: colors.onSurfaceVariant }]}>Search History</Text>
          </View>
          {history.length > 0 && !confirmClear ? (
            <Pressable
              onPress={() => setConfirmClear(true)}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Clear search history">
              <Text style={[styles.clearText, { color: colors.primary }]}>Clear all</Text>
            </Pressable>
          ) : null}
        </View>

        {confirmClear ? (
          <View
            style={[
              styles.confirmBox,
              {
                backgroundColor: colors.errorContainer,
                borderColor: colors.error + '44',
              },
            ]}>
            <Text style={[styles.confirmTitle, { color: colors.onErrorContainer }]}>
              Clear all search history?
            </Text>
            <Text style={[styles.confirmBody, { color: colors.onErrorContainer }]}>
              This cannot be undone. Saved bookmarks are not affected.
            </Text>
            <View style={styles.confirmActions}>
              <Pressable
                onPress={() => setConfirmClear(false)}
                disabled={clearing}
                style={[styles.confirmButton, { backgroundColor: colors.surfaceContainerLowest }]}>
                <Text style={[styles.confirmButtonText, { color: colors.onSurface }]}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleConfirmClear}
                disabled={clearing}
                style={[styles.confirmButton, { backgroundColor: colors.error }]}>
                {clearing ? (
                  <ActivityIndicator size="small" color={colors.onError} />
                ) : (
                  <Text style={[styles.confirmButtonText, { color: colors.onError }]}>Clear all</Text>
                )}
              </Pressable>
            </View>
          </View>
        ) : null}

        {history.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="search-off" size={32} color={colors.outline} />
            <Text style={[styles.emptyTitle, { color: colors.onSurface }]}>No searches yet</Text>
            <Text style={[styles.emptyBody, { color: colors.onSurfaceVariant }]}>
              Words you look up will appear here for quick access.
            </Text>
          </View>
        ) : (
          history.map((item) => (
            <Pressable
              key={`${item.word}-${item.searchedAt}`}
              onPress={() => handleSelectWord(item.word)}
              accessibilityRole="button"
              accessibilityLabel={`Search for ${item.word}`}
              style={({ pressed }) => [
                styles.historyItem,
                {
                  backgroundColor: pressed ? colors.surfaceContainerLow : colors.cardBackground,
                  borderColor: pressed ? colors.secondary : colors.cardBorder,
                },
              ]}>
              <View style={styles.historyText}>
                <Text
                  style={[styles.historyWord, { color: colors.primary }, getWordTitleStyle(item.word)]}
                  numberOfLines={2}>
                  {item.word}
                </Text>
                {item.partOfSpeech ? (
                  <Text style={[styles.historyMeta, { color: colors.secondary }]} numberOfLines={1}>
                    {item.partOfSpeech}
                    {item.preview ? ` • ${item.preview}` : ''}
                  </Text>
                ) : null}
              </View>
              <MaterialIcons name="chevron-right" size={20} color={colors.outlineVariant} />
            </Pressable>
          ))
        )}
      </DrawerContentScrollView>

      <View style={[styles.footer, { borderTopColor: colors.surfaceContainerHigh, paddingBottom: insets.bottom + 12 }]}>
        <Pressable
          onPress={() => {
            lightTap();
            props.navigation.closeDrawer();
            router.push(ROUTES.search);
          }}
          accessibilityRole="button"
          accessibilityLabel="Start a new search"
          style={[styles.footerButton, { backgroundColor: colors.secondaryContainer }]}>
          <MaterialIcons name="search" size={20} color={colors.primary} />
          <Text style={[styles.footerButtonText, { color: colors.onSecondaryContainer }]}>New Search</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: LexiconSpacing.marginPage,
    paddingVertical: LexiconSpacing.stackMd,
    borderBottomWidth: 1,
  },
  brand: {
    ...LexiconTypography.headlineMd,
    fontFamily: 'Inter_600SemiBold',
  },
  subtitle: {
    ...LexiconTypography.labelSm,
    fontFamily: 'Inter_500Medium',
  },
  scrollContent: {
    paddingHorizontal: LexiconSpacing.marginPage,
    paddingTop: LexiconSpacing.stackMd,
    paddingBottom: LexiconSpacing.stackLg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: LexiconSpacing.stackMd,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    ...LexiconTypography.labelMd,
    fontFamily: 'Inter_600SemiBold',
  },
  clearText: {
    ...LexiconTypography.labelSm,
    fontFamily: 'Inter_600SemiBold',
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  confirmBox: {
    borderRadius: LexiconRadius.lg,
    borderWidth: 1,
    padding: LexiconSpacing.stackMd,
    marginBottom: LexiconSpacing.stackMd,
    gap: 8,
  },
  confirmTitle: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  confirmBody: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'Inter_400Regular',
  },
  confirmActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  confirmButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: LexiconRadius.full,
    minHeight: 40,
  },
  confirmButtonText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  emptyTitle: {
    ...LexiconTypography.labelMd,
    fontFamily: 'Inter_600SemiBold',
  },
  emptyBody: {
    ...LexiconTypography.labelSm,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: LexiconRadius.lg,
    padding: LexiconSpacing.stackMd,
    marginBottom: LexiconSpacing.stackSm,
  },
  historyText: {
    flex: 1,
    minWidth: 0,
    marginRight: 8,
  },
  historyWord: {
    ...LexiconTypography.labelMd,
    fontFamily: 'Inter_600SemiBold',
  },
  historyMeta: {
    ...LexiconTypography.labelSm,
    fontFamily: 'Inter_500Medium',
    marginTop: 2,
  },
  footer: {
    borderTopWidth: 1,
    paddingHorizontal: LexiconSpacing.marginPage,
    paddingTop: LexiconSpacing.stackMd,
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: LexiconRadius.full,
  },
  footerButtonText: {
    ...LexiconTypography.labelMd,
    fontFamily: 'Inter_600SemiBold',
  },
});
