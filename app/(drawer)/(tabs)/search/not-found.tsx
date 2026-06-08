import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/ui/AppHeader';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ROUTES } from '@/constants/routes';
import { ScreenAssets } from '@/constants/screen-assets';
import { LexiconRadius, LexiconSpacing, LexiconTypography } from '@/constants/lexicon-theme';
import { useAppTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { getWordChipStyle } from '@/utils/wordDisplay';

export default function NotFoundScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const navigation = useNavigation();
  const { colors, isDark } = useAppTheme();
  const { contentMaxWidth, horizontalPadding, scale, isSmall, tabBarSpace } = useResponsive();
  const { word } = useLocalSearchParams<{ word: string }>();

  const displayWord = word ?? 'that word';
  const imageSize = Math.round((isSmall ? 200 : 220) * scale);

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.background }]}>
      <AppHeader showSearch onSearchPress={() => router.push(ROUTES.search)} />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingHorizontal: horizontalPadding,
            paddingBottom: tabBarSpace + insets.bottom + 16,
            maxWidth: contentMaxWidth,
            alignSelf: 'center',
            width: '100%',
          },
        ]}
        showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.duration(500)} style={styles.hero}>
          <View
            style={[
              styles.glowOuter,
              {
                width: imageSize + 48,
                height: imageSize + 48,
                borderRadius: (imageSize + 48) / 2,
                backgroundColor: isDark ? colors.secondary + '14' : colors.secondaryContainer + '66',
              },
            ]}
          />
          <View
            style={[
              styles.glowInner,
              {
                width: imageSize + 20,
                height: imageSize + 20,
                borderRadius: (imageSize + 20) / 2,
                backgroundColor: isDark ? colors.surfaceContainerHigh : colors.surfaceContainer,
                borderColor: isDark ? colors.outlineVariant : colors.secondary + '33',
              },
            ]}
          />
          <View
            style={[
              styles.imageFrame,
              {
                width: imageSize,
                height: imageSize,
                borderRadius: imageSize / 2,
                backgroundColor: isDark ? '#2a3038' : '#e8eaed',
                shadowColor: colors.primary,
              },
            ]}>
            <Image
              source={ScreenAssets.wordNotFound}
              style={styles.illustration}
              contentFit="cover"
              accessibilityLabel="Word not found illustration"
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(120).springify()} style={styles.copy}>
          <View style={[styles.wordChip, { backgroundColor: colors.surfaceContainerHigh, borderColor: colors.secondary + '44' }]}>
            <MaterialIcons name="search-off" size={16} color={colors.secondary} />
            <Text
              style={[styles.wordChipText, { color: colors.primary }, getWordChipStyle(displayWord)]}
              numberOfLines={2}
              adjustsFontSizeToFit
              minimumFontScale={0.75}>
              {displayWord}
            </Text>
          </View>

          <Text style={[styles.title, { color: colors.primary }]}>We couldn&apos;t find that word</Text>
          <Text style={[styles.message, { color: colors.onSurfaceVariant }]}>
            It isn&apos;t in our database yet. Double-check the spelling or try a different term.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.actions}>
          <PrimaryButton label="Try Again" icon="refresh" onPress={() => router.replace(ROUTES.search)} />
          <PrimaryButton
            label="View Recent Searches"
            icon="history"
            variant="outline"
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(280).springify()} style={styles.tips}>
          <View style={[styles.tipCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
            <View style={[styles.tipIcon, { backgroundColor: colors.surfaceContainer }]}>
              <MaterialIcons name="spellcheck" size={20} color={colors.secondary} />
            </View>
            <Text style={[styles.tipTitle, { color: colors.onSurface }]}>Check Spelling</Text>
            <Text style={[styles.tipBody, { color: colors.onSurfaceVariant }]}>Avoid typos and extra spaces.</Text>
          </View>
          <View style={[styles.tipCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
            <View style={[styles.tipIcon, { backgroundColor: colors.surfaceContainer }]}>
              <MaterialIcons name="lightbulb" size={20} color={colors.secondary} />
            </View>
            <Text style={[styles.tipTitle, { color: colors.onSurface }]}>Try Synonyms</Text>
            <Text style={[styles.tipBody, { color: colors.onSurfaceVariant }]}>Use a similar common word.</Text>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: LexiconSpacing.stackLg,
    gap: LexiconSpacing.stackLg,
  },
  hero: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  glowOuter: {
    position: 'absolute',
  },
  glowInner: {
    position: 'absolute',
    borderWidth: 1,
  },
  imageFrame: {
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  illustration: {
    width: '100%',
    height: '100%',
  },
  copy: {
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: LexiconSpacing.stackSm,
  },
  wordChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: LexiconRadius.full,
    borderWidth: 1,
    maxWidth: '100%',
    width: '100%',
  },
  wordChipText: {
    ...LexiconTypography.labelMd,
    fontFamily: 'Inter_600SemiBold',
    flexShrink: 1,
    flex: 1,
  },
  title: {
    ...LexiconTypography.headlineLg,
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    lineHeight: 30,
    textAlign: 'center',
  },
  message: {
    ...LexiconTypography.bodyMd,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
  },
  actions: {
    width: '100%',
    gap: LexiconSpacing.stackMd,
  },
  tips: {
    flexDirection: 'row',
    gap: LexiconSpacing.stackMd,
    width: '100%',
  },
  tipCard: {
    flex: 1,
    padding: LexiconSpacing.stackMd,
    borderRadius: LexiconRadius.lg,
    borderWidth: 1,
    gap: 6,
  },
  tipIcon: {
    width: 36,
    height: 36,
    borderRadius: LexiconRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipTitle: {
    ...LexiconTypography.labelSm,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
  },
  tipBody: {
    ...LexiconTypography.labelSm,
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    lineHeight: 15,
  },
});
