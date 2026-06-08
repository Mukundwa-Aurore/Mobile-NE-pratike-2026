import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { LexiconRadius, LexiconTypography } from '@/constants/lexicon-theme';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { useAppTheme } from '@/context/ThemeContext';

interface PhoneticAudioEntry {
  text?: string;
  url: string;
}

interface PronunciationButtonProps {
  audioEntries: PhoneticAudioEntry[];
  size?: 'large' | 'small';
  align?: 'start' | 'end';
  fullWidth?: boolean;
}

function formatSpeed(rate: number) {
  return Number.isInteger(rate) ? `${rate}×` : `${rate}×`;
}

function getStatusLabel(state: 'idle' | 'playing' | 'paused') {
  if (state === 'playing') {
    return 'Playing';
  }
  if (state === 'paused') {
    return 'Paused';
  }
  return null;
}

function getAltLabel(entry: PhoneticAudioEntry, index: number) {
  if (entry.text) {
    return entry.text.length > 18 ? `${entry.text.slice(0, 16)}…` : entry.text;
  }
  return `Alt ${index + 2}`;
}

export function PronunciationButton({
  audioEntries,
  size = 'large',
  align = 'end',
  fullWidth = false,
}: PronunciationButtonProps) {
  const {
    play,
    pause,
    stop,
    playbackState,
    activeUrl,
    playbackRate,
    cyclePlaybackRate,
  } = useAudioPlayer();
  const { colors } = useAppTheme();

  if (audioEntries.length === 0) {
    return null;
  }

  const primaryUrl = audioEntries[0].url;
  const alternateEntries = audioEntries.slice(1);
  const isActive = playbackState !== 'idle';
  const isPlaying = playbackState === 'playing';
  const isPaused = playbackState === 'paused';
  const isPrimaryPlaying = activeUrl === primaryUrl && isPlaying;
  const buttonSize = size === 'large' ? 44 : 38;
  const iconSize = size === 'large' ? 22 : 18;
  const statusLabel = isActive ? getStatusLabel(playbackState) : null;

  return (
    <View
      style={[
        styles.wrapper,
        align === 'start' && styles.wrapperStart,
        fullWidth && styles.wrapperFull,
      ]}>
      <View
        style={[
          styles.controlsRow,
          align === 'start' && styles.controlsRowStart,
          fullWidth && styles.controlsRowFull,
        ]}>
        <Pressable
          accessibilityLabel="Play pronunciation"
          disabled={isPrimaryPlaying}
          onPress={() => play(primaryUrl)}
          style={({ pressed }) => [
            styles.circleButton,
            {
              width: buttonSize,
              height: buttonSize,
              borderRadius: buttonSize / 2,
              backgroundColor: isPrimaryPlaying ? colors.secondaryContainer : colors.secondary,
              shadowColor: colors.secondary,
            },
            pressed && styles.pressed,
          ]}>
          <MaterialIcons name="volume-up" size={iconSize} color={colors.onPrimary} />
        </Pressable>

        <Pressable
          accessibilityLabel="Pause pronunciation"
          disabled={!isActive || isPaused}
          onPress={() => pause()}
          style={({ pressed }) => [
            styles.circleButton,
            {
              width: buttonSize,
              height: buttonSize,
              borderRadius: buttonSize / 2,
              backgroundColor: colors.surfaceContainerLowest,
              borderWidth: 1.5,
              borderColor: isPaused ? colors.secondary : colors.outlineVariant,
            },
            (!isActive || isPaused) && styles.buttonDisabled,
            pressed && styles.pressed,
          ]}>
          <MaterialIcons name="pause" size={iconSize} color={colors.secondary} />
        </Pressable>

        <Pressable
          accessibilityLabel="Stop pronunciation"
          disabled={!isActive}
          onPress={() => stop()}
          style={({ pressed }) => [
            styles.circleButton,
            {
              width: buttonSize,
              height: buttonSize,
              borderRadius: buttonSize / 2,
              backgroundColor: colors.surfaceContainerLowest,
              borderWidth: 1.5,
              borderColor: colors.outlineVariant,
            },
            !isActive && styles.buttonDisabled,
            pressed && styles.pressed,
          ]}>
          <MaterialIcons name="stop" size={iconSize - 2} color={colors.error} />
        </Pressable>

        {statusLabel ? (
          <Text style={[styles.status, { color: colors.onSurface }]}>{statusLabel}</Text>
        ) : null}

        <Pressable
          accessibilityLabel={`Playback speed ${formatSpeed(playbackRate)}. Tap to change.`}
          onPress={() => cyclePlaybackRate()}
          style={({ pressed }) => [
            styles.speedChip,
            {
              backgroundColor: colors.surfaceContainerHigh,
              borderColor: colors.outlineVariant,
            },
            pressed && styles.pressed,
          ]}>
          <Text style={[styles.speedText, { color: colors.primary }]}>{formatSpeed(playbackRate)}</Text>
        </Pressable>
      </View>

      {alternateEntries.length > 0 ? (
        <View style={[styles.altRow, align === 'start' && styles.altRowStart]}>
          {alternateEntries.map((entry, index) => {
            const isActive = activeUrl === entry.url && playbackState !== 'idle';
            const altPlaying = activeUrl === entry.url && playbackState === 'playing';
            const label = getAltLabel(entry, index);

            return (
              <Pressable
                key={entry.url}
                accessibilityLabel={`Play alternate pronunciation: ${label}`}
                onPress={() => play(entry.url)}
                style={[
                  styles.altChip,
                  {
                    backgroundColor: isActive
                      ? colors.secondaryContainer
                      : colors.surfaceContainerHigh,
                  },
                ]}>
                <MaterialIcons
                  name={altPlaying ? 'volume-up' : 'record-voice-over'}
                  size={14}
                  color={colors.onSecondaryContainer}
                />
                <Text style={[styles.altLabel, { color: colors.onSecondaryContainer }]} numberOfLines={1}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'flex-end',
    gap: 8,
  },
  wrapperStart: {
    alignItems: 'flex-start',
  },
  wrapperFull: {
    width: '100%',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  controlsRowStart: {
    justifyContent: 'flex-start',
  },
  controlsRowFull: {
    alignSelf: 'stretch',
    justifyContent: 'flex-start',
  },
  circleButton: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  status: {
    ...LexiconTypography.labelMd,
    fontFamily: 'Inter_600SemiBold',
    marginLeft: 2,
  },
  speedChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: LexiconRadius.full,
    borderWidth: 1,
  },
  speedText: {
    ...LexiconTypography.labelSm,
    fontFamily: 'Inter_600SemiBold',
  },
  pressed: {
    transform: [{ scale: 0.92 }],
    opacity: 0.9,
  },
  altRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'flex-end',
    alignSelf: 'stretch',
  },
  altRowStart: {
    justifyContent: 'flex-start',
  },
  altChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: LexiconRadius.full,
  },
  altLabel: {
    ...LexiconTypography.labelSm,
    fontFamily: 'Inter_500Medium',
  },
});
