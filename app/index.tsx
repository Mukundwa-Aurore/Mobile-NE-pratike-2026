import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { ONBOARDING_KEY } from '@/constants/app';
import { ROUTES } from '@/constants/routes';
import { useAppTheme } from '@/context/ThemeContext';
import { useSavedWords } from '@/context/SavedWordsContext';
import { useSearchHistory } from '@/context/SearchHistoryContext';

export default function BootstrapScreen() {
  const { colors, isReady: themeReady } = useAppTheme();
  const { isReady: historyReady } = useSearchHistory();
  const { isReady: savedReady } = useSavedWords();
  const [destination, setDestination] = useState<typeof ROUTES.welcome | typeof ROUTES.search | null>(null);

  useEffect(() => {
    let mounted = true;

    AsyncStorage.getItem(ONBOARDING_KEY)
      .then((value) => {
        if (!mounted) return;
        setDestination(value === 'true' ? ROUTES.search : ROUTES.welcome);
      })
      .catch(() => {
        if (mounted) {
          setDestination(ROUTES.welcome);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const storageReady = themeReady && historyReady && savedReady;

  if (!destination || !storageReady) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return <Redirect href={destination} />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
