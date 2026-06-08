import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { THEME_KEY } from '@/constants/app';
import { getThemeColors, type AppThemeColors, type ThemeMode } from '@/constants/themes';

interface ThemeContextValue {
  mode: ThemeMode;
  colors: AppThemeColors;
  isDark: boolean;
  setMode: (mode: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<void>;
  isReady: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('light');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY)
      .then((stored) => {
        if (stored === 'light' || stored === 'dark') {
          setModeState(stored);
        }
      })
      .finally(() => setIsReady(true));
  }, []);

  const setMode = useCallback(async (next: ThemeMode) => {
    setModeState(next);
    await AsyncStorage.setItem(THEME_KEY, next);
  }, []);

  const toggleTheme = useCallback(async () => {
    await setMode(mode === 'light' ? 'dark' : 'light');
  }, [mode, setMode]);

  const colors = useMemo(() => getThemeColors(mode), [mode]);

  const value = useMemo(
    () => ({
      mode,
      colors,
      isDark: mode === 'dark',
      setMode,
      toggleTheme,
      isReady,
    }),
    [mode, colors, setMode, toggleTheme, isReady]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within AppThemeProvider');
  }
  return context;
}
