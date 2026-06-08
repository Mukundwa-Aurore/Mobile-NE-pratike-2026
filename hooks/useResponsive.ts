import { useWindowDimensions } from 'react-native';

const BASE_WIDTH = 390;

export function useResponsive() {
  const { width, height } = useWindowDimensions();
  const isVerySmall = width < 340;
  const isSmall = width < 360;
  const isCompact = width < 400 || height < 700;
  const isTablet = width >= 768;
  const scale = Math.min(Math.max(width / BASE_WIDTH, 0.82), 1.15);
  const contentMaxWidth = isTablet ? 480 : Math.min(width - (isCompact ? 24 : 32), 420);
  const horizontalPadding = isVerySmall ? 12 : isSmall ? 14 : isTablet ? 32 : isCompact ? 16 : 20;
  const tabBarSpace = isCompact ? 78 : 92;

  return {
    width,
    height,
    isVerySmall,
    isSmall,
    isCompact,
    isTablet,
    scale,
    contentMaxWidth,
    horizontalPadding,
    tabBarSpace,
  };
}
