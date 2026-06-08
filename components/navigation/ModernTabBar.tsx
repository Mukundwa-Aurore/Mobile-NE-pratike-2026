import { MaterialIcons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LexiconRadius } from '@/constants/lexicon-theme';
import { useAppTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { lightTap } from '@/utils/haptics';

const TAB_CONFIG: Record<string, { icon: keyof typeof MaterialIcons.glyphMap; label: string }> = {
  search: { icon: 'home', label: 'Home' },
  saved: { icon: 'bookmark', label: 'Saved' },
  settings: { icon: 'settings', label: 'Settings' },
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function TabButton({
  focused,
  icon,
  label,
  onPress,
  onLongPress,
  compact,
  colors,
}: {
  focused: boolean;
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
  onLongPress: () => void;
  compact: boolean;
  colors: ReturnType<typeof useAppTheme>['colors'];
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityState={{ selected: focused }}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={() => {
        scale.value = withSpring(0.9, { damping: 15, stiffness: 300 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      }}
      style={[styles.tabButton, animatedStyle]}>
      <View
        style={[
          styles.tabPill,
          compact && styles.tabPillCompact,
          focused && { backgroundColor: colors.secondaryContainer },
        ]}>
        <MaterialIcons
          name={icon}
          size={compact ? 18 : 20}
          color={focused ? colors.onSecondaryContainer : colors.onSurfaceVariant}
        />
        {!compact ? (
          <Text
            style={[
              styles.tabLabel,
              { color: focused ? colors.onSecondaryContainer : colors.onSurfaceVariant },
            ]}
            numberOfLines={1}>
            {label}
          </Text>
        ) : null}
      </View>
    </AnimatedPressable>
  );
}

export function ModernTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const { isSmall, isVerySmall, width } = useResponsive();
  const compact = isSmall || isVerySmall || width < 380;

  return (
    <View
      style={[
        styles.wrapper,
        compact && styles.wrapperCompact,
        { paddingBottom: Math.max(insets.bottom, compact ? 6 : 8) },
      ]}>
      <View
        style={[
          styles.bar,
          {
            backgroundColor: colors.tabBarBackground,
            borderColor: colors.surfaceContainerHigh,
          },
        ]}>
        {state.routes
          .filter((route) => route.name in TAB_CONFIG)
          .map((route) => {
            const focused = state.routes[state.index]?.name === route.name;
            const config = TAB_CONFIG[route.name];

            return (
              <TabButton
                key={route.key}
                focused={focused}
                icon={config.icon}
                label={config.label}
                compact={compact}
                colors={colors}
              onPress={() => {
                lightTap();
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!focused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}
                onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
              />
            );
          })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 12,
    paddingTop: 6,
  },
  wrapperCompact: {
    paddingHorizontal: 8,
    paddingTop: 4,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: LexiconRadius.xl,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 4,
    shadowColor: '#00355f',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 14,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
  },
  tabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: LexiconRadius.full,
    maxWidth: '100%',
  },
  tabPillCompact: {
    paddingHorizontal: 10,
  },
  tabLabel: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
  },
});
