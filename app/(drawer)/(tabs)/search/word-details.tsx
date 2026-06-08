import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DefinitionSection } from '@/components/word/DefinitionSection';
import { PronunciationSection } from '@/components/word/PronunciationSection';
import { AppHeader } from '@/components/ui/AppHeader';
import { ROUTES } from '@/constants/routes';
import { LexiconRadius, LexiconSpacing } from '@/constants/lexicon-theme';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { useAppTheme } from '@/context/ThemeContext';
import { useDictionary } from '@/context/DictionaryContext';
import { useSavedWords } from '@/context/SavedWordsContext';
import { useResponsive } from '@/hooks/useResponsive';
import { getPrimaryPhonetic, getPronunciationVariants } from '@/services/dictionaryApi';
import { lightTap, successTap } from '@/utils/haptics';
import { getWordTitleStyle } from '@/utils/wordDisplay';

export default function WordDetailsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useAppTheme();
  const { contentMaxWidth, horizontalPadding, tabBarSpace, isCompact } = useResponsive();
  const { entries, sessionReady } = useDictionary();
  const { isSaved, toggleSaved } = useSavedWords();
  const { stop: stopAudio } = useAudioPlayer();

  useEffect(() => () => {
    stopAudio();
  }, [stopAudio]);

  if (!sessionReady) {
    return (
      <View style={[styles.emptyContainer, { paddingTop: insets.top, backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!entries || entries.length === 0) {
    return (
      <View style={[styles.emptyContainer, { paddingTop: insets.top, backgroundColor: colors.background }]}>
        <Text style={[styles.emptyText, { color: colors.onSurfaceVariant }]}>No word data available.</Text>
        <Pressable onPress={() => router.push(ROUTES.search)}>
          <Text style={[styles.backLink, { color: colors.primary }]}>Go to Home</Text>
        </Pressable>
      </View>
    );
  }

  const entry = entries[0];
  const pronunciationVariants = getPronunciationVariants(entry);
  const primaryPhonetic = getPrimaryPhonetic(entry);
  const saved = isSaved(entry.word);
  const totalDefinitions = entry.meanings.reduce((sum, m) => sum + m.definitions.length, 0);
  const wordTitleStyle = getWordTitleStyle(entry.word, isCompact);

  const handleBookmark = async () => {
    lightTap();
    await toggleSaved(entry);
    if (!saved) {
      successTap();
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.background }]}>
      <AppHeader
        variant="back"
        onBack={() => router.back()}
        rightActions={
          <Pressable
            onPress={handleBookmark}
            style={styles.iconButton}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={saved ? `Remove ${entry.word} from saved words` : `Save ${entry.word}`}>
            <MaterialIcons
              name={saved ? 'bookmark' : 'bookmark-border'}
              size={22}
              color={saved ? colors.secondary : colors.onSurfaceVariant}
            />
          </Pressable>
        }
      />

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
        <Animated.View
          entering={FadeIn.duration(400)}
          style={[
            styles.wordHeader,
            isCompact && styles.wordHeaderCompact,
            { borderBottomColor: colors.surfaceContainerHigh },
          ]}>
          <Text
            style={[styles.word, { color: colors.onSurface }, wordTitleStyle]}
            numberOfLines={4}
            adjustsFontSizeToFit
            minimumFontScale={0.75}>
            {entry.word}
          </Text>

          <Text style={[styles.meta, { color: colors.secondary }, isCompact && styles.metaCompact]}>
            {entry.meanings.length} part{entry.meanings.length !== 1 ? 's' : ''} of speech ·{' '}
            {totalDefinitions} definition{totalDefinitions !== 1 ? 's' : ''}
          </Text>

          <PronunciationSection primaryPhonetic={primaryPhonetic} variants={pronunciationVariants} />
        </Animated.View>

        <View style={styles.meanings}>
          {entry.meanings.map((meaning, index) => (
            <DefinitionSection
              key={`${meaning.partOfSpeech}-${index}`}
              meaning={meaning}
              index={index}
            />
          ))}
        </View>

        {entry.sourceUrls && entry.sourceUrls.length > 0 ? (
          <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.etymology}>
            <Text style={[styles.etymologyTitle, { color: colors.primary }]}>Etymology</Text>
            <Text style={[styles.etymologyText, { color: colors.onSurfaceVariant }]}>
              Derived from:{' '}
              {entry.sourceUrls[0].replace('https://en.wiktionary.org/wiki/', '').replace(/_/g, ' ')}
            </Text>
          </Animated.View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  backLink: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: LexiconRadius.full,
  },
  scroll: {
    paddingTop: LexiconSpacing.stackMd,
    gap: LexiconSpacing.stackMd,
  },
  wordHeader: {
    gap: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    marginBottom: 4,
    width: '100%',
  },
  wordHeaderCompact: {
    gap: 8,
    paddingBottom: 6,
    marginBottom: 2,
  },
  word: {
    fontFamily: 'Inter_700Bold',
    width: '100%',
    flexShrink: 0,
  },
  meta: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'Inter_500Medium',
  },
  metaCompact: {
    fontSize: 11,
    lineHeight: 16,
  },
  meanings: {
    gap: 12,
  },
  etymology: {
    paddingTop: 4,
    paddingBottom: LexiconSpacing.stackSm,
  },
  etymologyTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 6,
  },
  etymologyText: {
    fontSize: 13,
    lineHeight: 20,
    fontFamily: 'Inter_400Regular',
    textTransform: 'capitalize',
  },
});
