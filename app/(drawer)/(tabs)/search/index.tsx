import { MaterialIcons } from '@expo/vector-icons';
import { useMemo, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/ui/AppHeader';
import { SearchInput } from '@/components/ui/SearchInput';
import { SearchSuggestions } from '@/components/ui/SearchSuggestions';
import { LexiconRadius, LexiconSpacing } from '@/constants/lexicon-theme';
import { useAppTheme } from '@/context/ThemeContext';
import { useDictionary } from '@/context/DictionaryContext';
import { useSearchHistory } from '@/context/SearchHistoryContext';
import { useResponsive } from '@/hooks/useResponsive';
import { lightTap } from '@/utils/haptics';
import { getSearchSuggestions } from '@/utils/searchSuggestions';
import { validateSearchWord } from '@/utils/validation';
import { getWordOfDay } from '@/utils/wordOfDay';

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const { contentMaxWidth, horizontalPadding, tabBarSpace, isCompact } = useResponsive();
  const { searchWord, loading, error, clearError } = useDictionary();
  const { history } = useSearchHistory();
  const [query, setQuery] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wordOfDay = useMemo(() => getWordOfDay(), []);

  const suggestions = useMemo(
    () => getSearchSuggestions(query, history),
    [query, history]
  );

  const handleSearch = async (word?: string) => {
    const term = (word ?? query).trim();
    const result = validateSearchWord(term);
    if (!result.valid) {
      setValidationMessage(result.message);
      return;
    }
    setQuery(term);
    setValidationMessage('');
    setShowSuggestions(false);
    clearError();
    Keyboard.dismiss();
    lightTap();
    await searchWord(term);
  };

  const handleFocusChange = (focused: boolean) => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }

    setInputFocused(focused);

    if (focused) {
      setShowSuggestions(true);
      return;
    }

    blurTimeoutRef.current = setTimeout(() => {
      setShowSuggestions(false);
    }, 180);
  };

  const handleSuggestionSelect = async (word: string) => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }
    setShowSuggestions(false);
    await handleSearch(word);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
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
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Animated.View
            entering={FadeInDown.springify()}
            style={[styles.heroSection, isCompact && styles.heroSectionCompact]}>
            <View style={[styles.heroIconWrapper, isCompact && styles.heroIconWrapperCompact]}>
              <View
                style={[
                  styles.heroIconBg,
                  isCompact && styles.heroIconBgCompact,
                  { backgroundColor: colors.secondaryContainer },
                ]}
              />
              <View
                style={[
                  styles.heroIcon,
                  isCompact && styles.heroIconCompact,
                  { backgroundColor: colors.primary },
                ]}>
                <MaterialIcons name="auto-stories" size={isCompact ? 32 : 40} color={colors.onPrimary} />
              </View>
            </View>
            <Text style={[styles.heroTitle, { color: colors.primary }, isCompact && styles.heroTitleCompact]}>
              Unlock Language
            </Text>
            <Text
              style={[
                styles.heroSubtitle,
                { color: colors.onSurfaceVariant },
                isCompact && styles.heroSubtitleCompact,
              ]}>
              Your professional companion for precise linguistic data and modern vocabulary.
            </Text>
          </Animated.View>

          <View style={styles.searchSection}>
            <SearchInput
              value={query}
              onChangeText={(text) => {
                setQuery(text);
                if (validationMessage) setValidationMessage('');
                if (inputFocused) setShowSuggestions(true);
              }}
              onSearch={() => handleSearch()}
              onFocusChange={handleFocusChange}
              error={Boolean(validationMessage)}
              loading={loading}
            />
            <SearchSuggestions
              suggestions={suggestions}
              query={query}
              visible={showSuggestions && !loading && history.length > 0}
              onSelect={handleSuggestionSelect}
            />
            {validationMessage ? (
              <Text style={[styles.validationText, { color: colors.error }]}>{validationMessage}</Text>
            ) : null}
            {error && error.type !== 'not_found' ? (
              <View style={[styles.errorBox, { backgroundColor: colors.errorContainer }]}>
                <MaterialIcons name="error-outline" size={18} color={colors.error} />
                <Text style={[styles.errorText, { color: colors.onErrorContainer }]}>{error.message}</Text>
                <Pressable onPress={() => handleSearch()} accessibilityRole="button" accessibilityLabel="Retry search">
                  <Text style={[styles.retryText, { color: colors.error }]}>Retry</Text>
                </Pressable>
              </View>
            ) : null}
          </View>

          <View
            style={[
              styles.wordOfDay,
              isCompact && styles.wordOfDayCompact,
              { backgroundColor: colors.primaryContainer },
            ]}>
            <MaterialIcons
              name="lightbulb"
              size={isCompact ? 40 : 48}
              color={colors.onPrimaryContainer}
              style={styles.wordOfDayIcon}
            />
            <Text style={[styles.wordOfDayLabel, { color: colors.onPrimaryContainer }]}>Word of the Day</Text>
            <Text style={[styles.wordOfDayWord, { color: colors.onPrimaryContainer }]}>{wordOfDay}</Text>
            <Text style={[styles.wordOfDayBody, { color: colors.onPrimaryContainer }]}>
              Tap explore to look up today&apos;s featured word.
            </Text>
            <Pressable
              style={[styles.wordOfDayButton, { backgroundColor: colors.secondaryContainer }]}
              accessibilityRole="button"
              accessibilityLabel={`Explore word of the day: ${wordOfDay}`}
              onPress={() => {
                setQuery(wordOfDay);
                searchWord(wordOfDay);
              }}>
              <Text style={[styles.wordOfDayButtonText, { color: colors.onSecondaryContainer }]}>Explore</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
  },
  scroll: {
    paddingTop: 8,
  },
  heroSection: {
    alignItems: 'center',
    marginTop: LexiconSpacing.stackMd,
    marginBottom: LexiconSpacing.stackLg,
  },
  heroSectionCompact: {
    marginTop: LexiconSpacing.stackSm,
    marginBottom: LexiconSpacing.stackMd,
  },
  heroIconWrapper: {
    width: 96,
    height: 96,
    marginBottom: LexiconSpacing.stackMd,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroIconWrapperCompact: {
    width: 76,
    height: 76,
    marginBottom: LexiconSpacing.stackSm,
  },
  heroIconBg: {
    position: 'absolute',
    width: 88,
    height: 88,
    borderRadius: LexiconRadius.xl,
    opacity: 0.35,
    transform: [{ rotate: '6deg' }],
  },
  heroIconBgCompact: {
    width: 70,
    height: 70,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: LexiconRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-3deg' }],
  },
  heroIconCompact: {
    width: 64,
    height: 64,
  },
  heroTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontFamily: 'Inter_700Bold',
    marginBottom: 6,
  },
  heroTitleCompact: {
    fontSize: 20,
    lineHeight: 26,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    maxWidth: 280,
  },
  heroSubtitleCompact: {
    fontSize: 13,
    lineHeight: 18,
    maxWidth: '100%',
    paddingHorizontal: 4,
  },
  searchSection: {
    gap: 8,
    marginBottom: LexiconSpacing.stackLg,
  },
  validationText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    marginLeft: 4,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: LexiconRadius.lg,
    flexWrap: 'wrap',
  },
  errorText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    flex: 1,
  },
  retryText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  wordOfDay: {
    borderRadius: LexiconRadius.xl,
    padding: LexiconSpacing.stackLg,
    overflow: 'hidden',
    minHeight: 140,
  },
  wordOfDayCompact: {
    padding: LexiconSpacing.stackMd,
    minHeight: 120,
  },
  wordOfDayIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
    opacity: 0.12,
  },
  wordOfDayLabel: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 4,
    opacity: 0.85,
  },
  wordOfDayWord: {
    fontSize: 24,
    lineHeight: 30,
    fontFamily: 'Inter_700Bold',
    textTransform: 'capitalize',
    marginBottom: 6,
  },
  wordOfDayBody: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    opacity: 0.9,
    marginBottom: LexiconSpacing.stackMd,
    maxWidth: '80%',
  },
  wordOfDayButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: LexiconRadius.full,
  },
  wordOfDayButtonText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
});
