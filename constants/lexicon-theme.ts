import { lightTheme } from '@/constants/themes';

/** @deprecated Prefer `useAppTheme().colors` for theme-aware UI. */
export const LexiconColors = {
  background: lightTheme.background,
  surface: lightTheme.surface,
  surfaceContainerLow: lightTheme.surfaceContainerLow,
  surfaceContainer: lightTheme.surfaceContainer,
  surfaceContainerHigh: lightTheme.surfaceContainerHigh,
  surfaceContainerHighest: lightTheme.surfaceContainerHighest,
  surfaceContainerLowest: lightTheme.surfaceContainerLowest,
  surfaceVariant: lightTheme.surfaceVariant,
  onSurface: lightTheme.onSurface,
  onSurfaceVariant: lightTheme.onSurfaceVariant,
  primary: lightTheme.primary,
  onPrimary: lightTheme.onPrimary,
  primaryContainer: lightTheme.primaryContainer,
  onPrimaryContainer: lightTheme.onPrimaryContainer,
  secondary: lightTheme.secondary,
  onSecondary: lightTheme.onSecondary,
  secondaryContainer: lightTheme.secondaryContainer,
  onSecondaryContainer: lightTheme.onSecondaryContainer,
  outline: lightTheme.outline,
  outlineVariant: lightTheme.outlineVariant,
  error: lightTheme.error,
  onError: lightTheme.onError,
  errorContainer: lightTheme.errorContainer,
  onErrorContainer: lightTheme.onErrorContainer,
} as const;

export const LexiconSpacing = {
  marginPage: 20,
  gutterCard: 16,
  stackSm: 8,
  stackMd: 16,
  stackLg: 24,
} as const;

export const LexiconRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const LexiconTypography = {
  headlineLg: { fontSize: 28, lineHeight: 36, fontWeight: '700' as const },
  headlineMd: { fontSize: 24, lineHeight: 32, fontWeight: '600' as const },
  bodyMd: { fontSize: 16, lineHeight: 24, fontWeight: '400' as const },
  bodyLg: { fontSize: 18, lineHeight: 28, fontWeight: '400' as const },
  labelMd: { fontSize: 14, lineHeight: 20, fontWeight: '600' as const },
  labelSm: { fontSize: 12, lineHeight: 16, fontWeight: '500' as const },
  phonetic: { fontSize: 18, lineHeight: 24, fontWeight: '400' as const },
};
