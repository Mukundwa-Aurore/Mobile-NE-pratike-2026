export type ThemeMode = 'light' | 'dark';

export interface AppThemeColors {
  background: string;
  surface: string;
  surfaceContainerLow: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;
  surfaceContainerLowest: string;
  surfaceVariant: string;
  onSurface: string;
  onSurfaceVariant: string;
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  outline: string;
  outlineVariant: string;
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;
  headerBackground: string;
  tabBarBackground: string;
  cardBackground: string;
  cardBorder: string;
}

export const lightTheme: AppThemeColors = {
  background: '#f9f9ff',
  surface: '#f9f9ff',
  surfaceContainerLow: '#f0f3ff',
  surfaceContainer: '#e7eeff',
  surfaceContainerHigh: '#dee8ff',
  surfaceContainerHighest: '#d8e3fb',
  surfaceContainerLowest: '#ffffff',
  surfaceVariant: '#d8e3fb',
  onSurface: '#111c2d',
  onSurfaceVariant: '#42474f',
  primary: '#00355f',
  onPrimary: '#ffffff',
  primaryContainer: '#0f4c81',
  onPrimaryContainer: '#8ebdf9',
  secondary: '#006b5f',
  onSecondary: '#ffffff',
  secondaryContainer: '#62fae3',
  onSecondaryContainer: '#007165',
  outline: '#727780',
  outlineVariant: '#c2c7d1',
  error: '#ba1a1a',
  onError: '#ffffff',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',
  headerBackground: 'rgba(249, 249, 255, 0.92)',
  tabBarBackground: 'rgba(255, 255, 255, 0.96)',
  cardBackground: '#ffffff',
  cardBorder: '#dee8ff',
};

export const darkTheme: AppThemeColors = {
  background: '#0b1219',
  surface: '#111c2d',
  surfaceContainerLow: '#152232',
  surfaceContainer: '#1a2838',
  surfaceContainerHigh: '#223044',
  surfaceContainerHighest: '#2a3a52',
  surfaceContainerLowest: '#0f1724',
  surfaceVariant: '#2a3a52',
  onSurface: '#ecf1ff',
  onSurfaceVariant: '#b8c0cc',
  primary: '#a0c9ff',
  onPrimary: '#001c37',
  primaryContainer: '#0f4c81',
  onPrimaryContainer: '#d2e4ff',
  secondary: '#3cddc7',
  onSecondary: '#00201c',
  secondaryContainer: '#005047',
  onSecondaryContainer: '#62fae3',
  outline: '#8a9199',
  outlineVariant: '#42474f',
  error: '#ffb4ab',
  onError: '#690005',
  errorContainer: '#93000a',
  onErrorContainer: '#ffdad6',
  headerBackground: 'rgba(17, 28, 45, 0.95)',
  tabBarBackground: 'rgba(17, 28, 45, 0.96)',
  cardBackground: '#1a2838',
  cardBorder: '#2a3a52',
};

export function getThemeColors(mode: ThemeMode): AppThemeColors {
  return mode === 'dark' ? darkTheme : lightTheme;
}
