import { MaterialIcons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_NAME } from '@/constants/app';
import { LexiconRadius } from '@/constants/lexicon-theme';
import { useAppTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';

interface AppHeaderProps {
  variant?: 'menu' | 'back';
  onBack?: () => void;
  showSearch?: boolean;
  onSearchPress?: () => void;
  rightActions?: React.ReactNode;
}

export function AppHeader({
  variant = 'menu',
  onBack,
  showSearch = false,
  onSearchPress,
  rightActions,
}: AppHeaderProps) {
  const navigation = useNavigation();
  const { colors } = useAppTheme();
  const { isCompact, horizontalPadding } = useResponsive();

  const handleLeftPress = () => {
    if (variant === 'back' && onBack) {
      onBack();
      return;
    }
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View
      style={[
        styles.header,
        isCompact && styles.headerCompact,
        {
          backgroundColor: colors.headerBackground,
          borderBottomColor: colors.surfaceContainerHigh,
          paddingHorizontal: horizontalPadding,
        },
      ]}>
      <Pressable
        onPress={handleLeftPress}
        style={styles.iconButton}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={variant === 'back' ? 'Go back' : 'Open search history'}>
        <MaterialIcons
          name={variant === 'back' ? 'arrow-back' : 'menu'}
          size={24}
          color={colors.primary}
        />
      </Pressable>

      <Text
        style={[styles.title, { color: colors.primary }, isCompact && styles.titleCompact]}
        numberOfLines={1}
        adjustsFontSizeToFit>
        {APP_NAME}
      </Text>

      {rightActions ? (
        <View style={styles.rightActions}>{rightActions}</View>
      ) : showSearch ? (
        <Pressable
          onPress={onSearchPress}
          style={styles.iconButton}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Go to search">
          <MaterialIcons name="search" size={24} color={colors.primary} />
        </Pressable>
      ) : (
        <View style={styles.iconButton} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerCompact: {
    height: 50,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: LexiconRadius.full,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    flexShrink: 1,
    textAlign: 'center',
  },
  titleCompact: {
    fontSize: 18,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
