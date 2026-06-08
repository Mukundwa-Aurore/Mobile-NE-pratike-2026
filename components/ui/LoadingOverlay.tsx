import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native';

import { LexiconTypography } from '@/constants/lexicon-theme';
import { useAppTheme } from '@/context/ThemeContext';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export function LoadingOverlay({ visible, message = 'Looking up word...' }: LoadingOverlayProps) {
  const { colors } = useAppTheme();

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.backdrop}>
        <View style={[styles.card, { backgroundColor: colors.surfaceContainerLowest }]}>
          <ActivityIndicator size="large" color={colors.secondary} />
          <Text style={[styles.message, { color: colors.onSurfaceVariant }]}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(17, 28, 45, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    gap: 16,
    minWidth: 200,
  },
  message: {
    ...LexiconTypography.bodyMd,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
});
