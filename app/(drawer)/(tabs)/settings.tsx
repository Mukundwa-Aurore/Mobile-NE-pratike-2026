import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/ui/AppHeader';
import { APP_NAME, APP_TAGLINE, APP_VERSION } from '@/constants/app';
import { ROUTES } from '@/constants/routes';
import { LexiconRadius, LexiconSpacing } from '@/constants/lexicon-theme';
import type { AppThemeColors, ThemeMode } from '@/constants/themes';
import { useAppTheme } from '@/context/ThemeContext';
import { useSavedWords } from '@/context/SavedWordsContext';
import { useSearchHistory } from '@/context/SearchHistoryContext';
import { useResponsive } from '@/hooks/useResponsive';

const ABOUT_FEATURES = [
  { icon: 'search' as const, title: 'Instant Lookup', desc: 'Search any English word in seconds.' },
  { icon: 'volume-up' as const, title: 'Pronunciation', desc: 'Listen to audio when available.' },
  { icon: 'bookmark' as const, title: 'Save Words', desc: 'Build your personal vocabulary list.' },
];

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, mode, setMode, isDark } = useAppTheme();
  const { contentMaxWidth, horizontalPadding, tabBarSpace } = useResponsive();
  const { history } = useSearchHistory();
  const { savedWords } = useSavedWords();

  const selectTheme = useCallback((next: ThemeMode) => setMode(next), [setMode]);

  const menuItems = [
    {
      icon: 'bookmark' as const,
      label: 'Saved Words',
      desc: `${savedWords.length} bookmarked`,
      onPress: () => router.push(ROUTES.saved),
    },
    {
      icon: 'help-outline' as const,
      label: 'Help & Support',
      desc: 'Contact LexiTech Solutions',
      onPress: () =>
        Alert.alert(
          'Help & Support',
          `${APP_NAME} is built by ${APP_TAGLINE} in Kigali, Rwanda.\n\nFor assistance, reach out to your course instructor or project team.`
        ),
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.background }]}>
      <AppHeader showSearch onSearchPress={() => router.push(ROUTES.search)} />

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
        <Animated.View entering={FadeInDown.springify()}>
          <View
            style={[
              styles.themeSection,
              { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder },
            ]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIcon, { backgroundColor: colors.surfaceContainer }]}>
                <MaterialIcons name="palette" size={18} color={colors.primary} />
              </View>
              <View>
                <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>Appearance</Text>
                <Text style={[styles.sectionHint, { color: colors.onSurfaceVariant }]}>
                  Pick a theme comfortable for reading.
                </Text>
              </View>
            </View>
            <View style={styles.themeRow}>
              <ThemeOption
                label="Light"
                icon="light-mode"
                active={mode === 'light'}
                previewColor="#f9f9ff"
                accentColor="#00355f"
                onPress={() => selectTheme('light')}
                colors={colors}
              />
              <ThemeOption
                label="Dark"
                icon="dark-mode"
                active={mode === 'dark'}
                previewColor="#0b1219"
                accentColor="#a0c9ff"
                onPress={() => selectTheme('dark')}
                colors={colors}
              />
            </View>
          </View>
        </Animated.View>

        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatCard
              colors={colors}
              value={history.length}
              label="Searches"
              icon="menu-book"
            />
            <StatCard
              colors={colors}
              value={savedWords.length}
              label="Bookmarks"
              icon="bookmark"
            />
          </View>
          <View
            style={[
              styles.streakCard,
              {
                backgroundColor: isDark ? colors.secondaryContainer + '30' : colors.secondaryContainer + '55',
                borderColor: colors.secondary + '44',
              },
            ]}>
            <View style={styles.streakLeft}>
              <View style={[styles.streakIcon, { backgroundColor: colors.secondary }]}>
                <MaterialIcons name="cloud" size={20} color={colors.onSecondary} />
              </View>
              <View style={styles.streakText}>
                <Text style={[styles.streakTitle, { color: colors.onSecondaryContainer }]}>
                  Free Dictionary API
                </Text>
                <Text style={[styles.streakSub, { color: colors.onSecondaryContainer }]}>
                  Definitions, pronunciations, and examples powered by dictionaryapi.dev.
                </Text>
              </View>
            </View>
            <MaterialIcons name="verified" size={22} color={colors.secondary} />
          </View>
        </View>

        <Text style={[styles.menuHeading, { color: colors.onSurfaceVariant }]}>Quick Access</Text>
        <View style={styles.menu}>
          {menuItems.map((item, index) => (
            <Animated.View key={item.label} entering={FadeInDown.delay(80 + index * 50).springify()}>
              <Pressable
                onPress={item.onPress}
                style={({ pressed }) => [
                  styles.menuItem,
                  {
                    backgroundColor: pressed ? colors.surfaceContainerHigh : colors.cardBackground,
                    borderColor: colors.cardBorder,
                  },
                ]}>
                <View style={[styles.menuIconWrap, { backgroundColor: colors.surfaceContainer }]}>
                  <MaterialIcons name={item.icon} size={20} color={colors.primary} />
                </View>
                <View style={styles.menuText}>
                  <Text style={[styles.menuLabel, { color: colors.onSurface }]}>{item.label}</Text>
                  <Text style={[styles.menuDesc, { color: colors.onSurfaceVariant }]}>{item.desc}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color={colors.outline} />
              </Pressable>
            </Animated.View>
          ))}
        </View>

        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <AboutHeroCard colors={colors} isDark={isDark} />
        </Animated.View>

        <Text style={[styles.version, { color: colors.onSurfaceVariant }]}>
          {APP_NAME} v{APP_VERSION} · Built for Scholars
        </Text>
      </ScrollView>
    </View>
  );
}

function AboutHeroCard({ colors, isDark }: { colors: AppThemeColors; isDark: boolean }) {
  return (
    <View
      style={[
        styles.aboutCard,
        {
          backgroundColor: colors.primaryContainer,
          borderColor: isDark ? colors.outlineVariant : colors.primary + '22',
        },
      ]}>
      <View style={[styles.aboutGlow, { backgroundColor: colors.secondary + (isDark ? '18' : '28') }]} />
      <View style={styles.aboutTop}>
        <View style={[styles.aboutIconBox, { backgroundColor: colors.secondaryContainer }]}>
          <MaterialIcons name="info-outline" size={26} color={colors.onSecondaryContainer} />
        </View>
        <View style={styles.aboutTitles}>
          <Text style={[styles.aboutLabel, { color: colors.onPrimaryContainer }]}>About</Text>
          <Text style={[styles.aboutName, { color: colors.onPrimary }]}>{APP_NAME}</Text>
        </View>
      </View>
      <Text style={[styles.aboutBody, { color: colors.onPrimaryContainer }]}>
        A modern dictionary app by {APP_TAGLINE}, Kigali — helping you discover word meanings,
        pronunciations, and usage examples anytime, anywhere.
      </Text>
      <View style={styles.featureList}>
        {ABOUT_FEATURES.map((feature) => (
          <View
            key={feature.title}
            style={[styles.featureRow, { backgroundColor: colors.surface + (isDark ? '18' : '55') }]}>
            <MaterialIcons name={feature.icon} size={16} color={colors.secondary} />
            <View style={styles.featureText}>
              <Text style={[styles.featureTitle, { color: colors.onPrimary }]}>{feature.title}</Text>
              <Text style={[styles.featureDesc, { color: colors.onPrimaryContainer }]}>{feature.desc}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function StatCard({
  colors,
  value,
  label,
  icon,
}: {
  colors: AppThemeColors;
  value: number;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}) {
  return (
    <View style={[styles.statCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
      <MaterialIcons name={icon} size={18} color={colors.secondary} style={styles.statIcon} />
      <Text style={[styles.statValue, { color: colors.primary }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.onSurfaceVariant }]}>{label}</Text>
    </View>
  );
}

function ThemeOption({
  label,
  icon,
  active,
  previewColor,
  accentColor,
  onPress,
  colors,
}: {
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  active: boolean;
  previewColor: string;
  accentColor: string;
  onPress: () => void;
  colors: AppThemeColors;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.themeOption,
        {
          borderColor: active ? colors.secondary : colors.outlineVariant,
          backgroundColor: active ? colors.surfaceContainerLow : colors.surfaceContainerLowest,
        },
      ]}>
      <View style={[styles.themePreview, { backgroundColor: previewColor }]}>
        <View style={[styles.themePreviewDot, { backgroundColor: accentColor }]} />
      </View>
      <MaterialIcons name={icon} size={15} color={active ? colors.secondary : colors.onSurfaceVariant} />
      <Text style={[styles.themeOptionLabel, { color: active ? colors.onSurface : colors.onSurfaceVariant }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingTop: LexiconSpacing.stackMd, gap: LexiconSpacing.stackMd },
  aboutCard: {
    borderRadius: LexiconRadius.xl,
    borderWidth: 1,
    padding: LexiconSpacing.gutterCard,
    overflow: 'hidden',
    gap: 12,
    marginTop: 4,
  },
  aboutGlow: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  aboutTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  aboutIconBox: {
    width: 48,
    height: 48,
    borderRadius: LexiconRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aboutTitles: { gap: 2 },
  aboutLabel: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    opacity: 0.85,
  },
  aboutName: { fontSize: 22, fontFamily: 'Inter_700Bold' },
  aboutBody: {
    fontSize: 13,
    lineHeight: 20,
    fontFamily: 'Inter_400Regular',
    opacity: 0.92,
  },
  featureList: { gap: 8, marginTop: 4 },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 10,
    borderRadius: LexiconRadius.md,
  },
  featureText: { flex: 1, gap: 1 },
  featureTitle: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  featureDesc: { fontSize: 12, fontFamily: 'Inter_400Regular', opacity: 0.9 },
  statsGrid: { gap: 10 },
  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: {
    flex: 1,
    padding: 14,
    borderRadius: LexiconRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
  },
  statIcon: { marginBottom: 4 },
  statValue: { fontSize: 22, fontFamily: 'Inter_700Bold' },
  statLabel: { fontSize: 11, fontFamily: 'Inter_500Medium', marginTop: 2, textAlign: 'center' },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: LexiconRadius.lg,
    borderWidth: 1,
  },
  streakLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  streakIcon: { padding: 8, borderRadius: LexiconRadius.md },
  streakText: { flex: 1 },
  streakTitle: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  streakSub: { fontSize: 12, fontFamily: 'Inter_400Regular', opacity: 0.85, marginTop: 2 },
  themeSection: {
    padding: LexiconSpacing.gutterCard,
    borderRadius: LexiconRadius.lg,
    borderWidth: 1,
    gap: 12,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: LexiconRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  sectionHint: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 1 },
  themeRow: { flexDirection: 'row', gap: 10 },
  themeOption: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    padding: 10,
    borderRadius: LexiconRadius.lg,
    borderWidth: 2,
  },
  themePreview: {
    width: '100%',
    height: 32,
    borderRadius: LexiconRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themePreviewDot: { width: 18, height: 18, borderRadius: 9 },
  themeOptionLabel: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  menuHeading: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 4,
    marginBottom: -4,
  },
  menu: { gap: 8 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: LexiconRadius.lg,
    borderWidth: 1,
  },
  menuIconWrap: {
    width: 40,
    height: 40,
    borderRadius: LexiconRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: { flex: 1, gap: 2 },
  menuLabel: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  menuDesc: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  version: {
    textAlign: 'center',
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    opacity: 0.5,
    marginTop: 8,
  },
});
