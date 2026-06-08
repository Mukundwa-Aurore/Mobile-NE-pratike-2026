import { MaterialIcons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { LexiconRadius } from '@/constants/lexicon-theme';
import { useAppTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSearch?: () => void;
  onFocusChange?: (focused: boolean) => void;
  placeholder?: string;
  error?: boolean;
  loading?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function SearchInput({
  value,
  onChangeText,
  onSearch,
  onFocusChange,
  placeholder = 'Search word or phrase...',
  error,
  loading,
}: SearchInputProps) {
  const { colors } = useAppTheme();
  const { isSmall, scale } = useResponsive();
  const [focused, setFocused] = useState(false);
  const scaleAnim = useSharedValue(1);

  const sizes = useMemo(
    () => ({
      minHeight: Math.round(48 * scale),
      iconSize: Math.round((isSmall ? 18 : 20) * scale),
      searchIconSize: Math.round((isSmall ? 20 : 22) * scale),
      buttonSize: Math.round((isSmall ? 38 : 42) * scale),
      fontSize: Math.round((isSmall ? 14 : 15) * scale),
      paddingLeft: Math.round(12 * scale),
      paddingRight: Math.round(4 * scale),
    }),
    [isSmall, scale]
  );

  const searchButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
  }));

  const canSearch = value.trim().length > 0 && !loading;

  const dynamicStyles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: colors.surfaceContainer,
          borderColor: error
            ? colors.error
            : focused
              ? colors.primary
              : value.length > 0
                ? colors.secondary
                : colors.outlineVariant,
          minHeight: sizes.minHeight,
          paddingLeft: sizes.paddingLeft,
          paddingRight: sizes.paddingRight,
        },
        focused: {
          backgroundColor: colors.surfaceContainerLowest,
        },
        error: {
          backgroundColor: colors.errorContainer,
        },
        input: {
          color: colors.onSurface,
          fontSize: sizes.fontSize,
        },
        searchButton: {
          width: sizes.buttonSize,
          height: sizes.buttonSize,
          borderRadius: sizes.buttonSize / 2,
          backgroundColor: colors.primary,
        },
        searchButtonDisabled: {
          backgroundColor: colors.outline,
        },
      }),
    [colors, error, focused, sizes, value.length]
  );

  return (
    <View style={[styles.container, dynamicStyles.container, focused && dynamicStyles.focused, error && dynamicStyles.error]}>
      <MaterialIcons name="search" size={sizes.iconSize} color={colors.secondary} style={styles.leadingIcon} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.outline}
        style={[styles.input, dynamicStyles.input]}
        returnKeyType="search"
        onSubmitEditing={canSearch ? onSearch : undefined}
        onFocus={() => {
          setFocused(true);
          onFocusChange?.(true);
        }}
        onBlur={() => {
          setFocused(false);
          onFocusChange?.(false);
        }}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <AnimatedPressable
        accessibilityLabel="Search word"
        disabled={!canSearch}
        onPress={onSearch}
        onPressIn={() => {
          scaleAnim.value = withSpring(0.88, { damping: 15, stiffness: 400 });
        }}
        onPressOut={() => {
          scaleAnim.value = withSpring(1, { damping: 15, stiffness: 400 });
        }}
        style={[
          styles.searchButton,
          dynamicStyles.searchButton,
          !canSearch && dynamicStyles.searchButtonDisabled,
          !canSearch && styles.searchButtonDisabledOpacity,
          searchButtonStyle,
        ]}>
        {loading ? (
          <ActivityIndicator size="small" color={colors.onPrimary} />
        ) : (
          <MaterialIcons name="search" size={sizes.searchIconSize} color={colors.onPrimary} />
        )}
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: LexiconRadius.xl,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  leadingIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    lineHeight: 22,
    fontFamily: 'Inter_400Regular',
    paddingVertical: 10,
  },
  searchButton: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  searchButtonDisabledOpacity: {
    opacity: 0.45,
  },
});
