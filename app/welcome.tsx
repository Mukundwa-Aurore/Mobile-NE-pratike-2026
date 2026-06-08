import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { APP_NAME, ONBOARDING_KEY } from '@/constants/app';
import { ROUTES } from '@/constants/routes';
import { ScreenAssets } from '@/constants/screen-assets';
import { LexiconColors, LexiconRadius, LexiconSpacing, LexiconTypography } from '@/constants/lexicon-theme';

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleGetStarted = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    router.replace(ROUTES.search);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + 24 }]}>
      <View style={styles.blobTop} />
      <View style={styles.blobBottom} />

      <View style={styles.content}>
        <Text style={styles.brand}>{APP_NAME}</Text>

        <View style={styles.heroWrapper}>
          <View style={styles.heroGlow} />
          <Image
            source={ScreenAssets.welcome}
            style={styles.heroImage}
            contentFit="cover"
            accessibilityLabel="LexiTech welcome illustration"
          />
          <View style={styles.floatingBadge}>
            <MaterialIcons name="translate" size={28} color={LexiconColors.onSecondaryContainer} />
          </View>
        </View>

        <Text style={styles.title}>Master your vocabulary.</Text>
        <Text style={styles.subtitle}>
          Join the Kigali scholar community and explore the depth of language.
        </Text>
      </View>

      <View style={styles.footer}>
        <PrimaryButton label="Get Started" icon="arrow-forward" onPress={handleGetStarted} />
        <Pressable onPress={() => router.push(ROUTES.createAccount)} style={styles.accountRow}>
          <Text style={styles.accountText}>
            Want a scholar profile? <Text style={styles.accountLink}>Create account</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LexiconColors.background,
    paddingHorizontal: LexiconSpacing.marginPage,
    justifyContent: 'space-between',
  },
  blobTop: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(98, 250, 227, 0.12)',
  },
  blobBottom: {
    position: 'absolute',
    bottom: 40,
    left: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(0, 53, 95, 0.06)',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    ...LexiconTypography.headlineMd,
    fontFamily: 'Inter_700Bold',
    color: LexiconColors.primary,
    marginBottom: LexiconSpacing.stackLg,
  },
  heroWrapper: {
    width: 260,
    height: 260,
    marginBottom: LexiconSpacing.stackLg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroGlow: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: LexiconRadius.xl,
    backgroundColor: 'rgba(15, 76, 129, 0.06)',
  },
  heroImage: {
    width: 220,
    height: 220,
    borderRadius: LexiconRadius.xl,
    shadowColor: LexiconColors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  floatingBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 56,
    height: 56,
    borderRadius: LexiconRadius.lg,
    backgroundColor: LexiconColors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: LexiconColors.surface,
    transform: [{ rotate: '12deg' }],
  },
  title: {
    ...LexiconTypography.headlineLg,
    fontFamily: 'Inter_700Bold',
    color: LexiconColors.primary,
    textAlign: 'center',
    marginBottom: LexiconSpacing.stackSm,
  },
  subtitle: {
    ...LexiconTypography.bodyMd,
    fontFamily: 'Inter_400Regular',
    color: LexiconColors.onSurfaceVariant,
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 24,
  },
  footer: {
    gap: LexiconSpacing.stackMd,
  },
  accountRow: {
    alignItems: 'center',
  },
  accountText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: LexiconColors.onSurfaceVariant,
    textAlign: 'center',
  },
  accountLink: {
    fontFamily: 'Inter_700Bold',
    color: LexiconColors.primary,
  },
});
