import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { LexiconRadius, LexiconSpacing } from '@/constants/lexicon-theme';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { useAppTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import type { PronunciationVariant } from '@/types/dictionary';
import { lightTap } from '@/utils/haptics';

interface PronunciationSectionProps {
  primaryPhonetic: string | null;
  variants: PronunciationVariant[];
}

export function PronunciationSection({ primaryPhonetic, variants }: PronunciationSectionProps) {
  const { colors } = useAppTheme();
  const { isCompact, isVerySmall } = useResponsive();
  const { play, pause, stop, playbackState, activeUrl } = useAudioPlayer();

  const hasMultiple = variants.length > 1;
  const singleVariant = variants.length === 1 ? variants[0] : null;
  const hasAudio = variants.some((variant) => variant.audioUrl);
  const isActive = playbackState !== 'idle';
  const isPlaying = playbackState === 'playing';
  const isPaused = playbackState === 'paused';

  const playSize = isCompact ? 36 : 40;
  const iconSize = isCompact ? 18 : 20;

  const renderPlayButton = (
    url: string,
    label: string,
    playing: boolean,
    size = playSize,
  ) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={playing}
      onPress={() => {
        lightTap();
        void play(url);
      }}
      style={({ pressed }) => [
        styles.playCircle,
        { width: size, height: size, borderRadius: size / 2 },
        {
          backgroundColor: playing ? colors.secondaryContainer : colors.secondary,
        },
        pressed && styles.pressed,
      ]}>
      <MaterialIcons
        name={playing ? 'volume-up' : 'play-arrow'}
        size={iconSize}
        color={playing ? colors.onSecondaryContainer : colors.onPrimary}
      />
    </Pressable>
  );

  const renderTransportControls = (compact = isCompact) => (
    <View style={[styles.transportRow, compact && styles.transportRowCompact]}>
      <Pressable
        accessibilityLabel="Pause pronunciation"
        disabled={!isActive || isPaused}
        onPress={() => pause()}
        style={({ pressed }) => [
          styles.transportButton,
          compact && styles.transportButtonCompact,
          { borderColor: colors.outlineVariant, backgroundColor: colors.surfaceContainerLowest },
          (!isActive || isPaused) && styles.controlDisabled,
          pressed && styles.pressed,
        ]}>
        <MaterialIcons name="pause" size={compact ? 16 : 18} color={colors.secondary} />
        {!compact ? (
          <Text style={[styles.transportLabel, { color: colors.onSurface }]}>Pause</Text>
        ) : null}
      </Pressable>

      <Pressable
        accessibilityLabel="Stop pronunciation"
        disabled={!isActive}
        onPress={() => stop()}
        style={({ pressed }) => [
          styles.transportButton,
          compact && styles.transportButtonCompact,
          { borderColor: colors.outlineVariant, backgroundColor: colors.surfaceContainerLowest },
          !isActive && styles.controlDisabled,
          pressed && styles.pressed,
        ]}>
        <MaterialIcons name="stop" size={compact ? 14 : 16} color={colors.error} />
        {!compact ? (
          <Text style={[styles.transportLabel, { color: colors.onSurface }]}>Stop</Text>
        ) : null}
      </Pressable>

      {isActive ? (
        <Text
          style={[styles.status, { color: colors.secondary }, compact && styles.statusCompact]}
          numberOfLines={1}>
          {isPlaying ? 'Playing' : 'Paused'}
        </Text>
      ) : null}
    </View>
  );

  return (
    <View style={styles.section}>
      {!hasMultiple && singleVariant ? (
        <View
          style={[
            styles.singleRow,
            {
              backgroundColor: colors.surfaceContainerLow,
              borderColor: colors.outlineVariant + '55',
            },
            isCompact && styles.singleRowCompact,
          ]}>
          <View style={styles.singleText}>
            {primaryPhonetic ? (
              <Text
                style={[
                  styles.primaryPhonetic,
                  { color: colors.secondary },
                  isCompact && styles.primaryPhoneticCompact,
                ]}
                numberOfLines={2}
                adjustsFontSizeToFit
                minimumFontScale={0.85}>
                {primaryPhonetic}
              </Text>
            ) : (
              <Text style={[styles.missing, { color: colors.outline }]}>Phonetic spelling not available</Text>
            )}
          </View>

          {singleVariant.audioUrl ? (
            renderPlayButton(
              singleVariant.audioUrl,
              'Play pronunciation',
              activeUrl === singleVariant.audioUrl && isPlaying,
            )
          ) : (
            <View
              style={[
                styles.playCircle,
                styles.playCircleDisabled,
                {
                  width: playSize,
                  height: playSize,
                  borderRadius: playSize / 2,
                  backgroundColor: colors.surfaceContainerHigh,
                },
              ]}>
              <MaterialIcons name="volume-off" size={iconSize - 2} color={colors.outline} />
            </View>
          )}
        </View>
      ) : (
        <>
          {primaryPhonetic ? (
            <Text
              style={[
                styles.primaryPhonetic,
                { color: colors.secondary },
                isCompact && styles.primaryPhoneticCompact,
              ]}
              numberOfLines={2}>
              {primaryPhonetic}
            </Text>
          ) : (
            <Text style={[styles.missing, { color: colors.outline }]}>Phonetic spelling not available</Text>
          )}
        </>
      )}

      {!hasMultiple && singleVariant?.audioUrl ? renderTransportControls() : null}

      {!hasMultiple && singleVariant && !singleVariant.audioUrl && !primaryPhonetic ? (
        <Text style={[styles.missing, { color: colors.outline }]}>Pronunciation audio not available</Text>
      ) : null}

      {hasMultiple ? (
        <>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIcon, { backgroundColor: colors.secondaryContainer }]}>
              <MaterialIcons name="mic" size={14} color={colors.onSecondaryContainer} />
            </View>
            <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>Pronunciations</Text>
          </View>

          <View style={styles.cardList}>
            {variants.map((variant, index) => {
              const isVariantPlaying = Boolean(
                variant.audioUrl && activeUrl === variant.audioUrl && isPlaying,
              );
              const isVariantActive = Boolean(
                variant.audioUrl && activeUrl === variant.audioUrl && isActive,
              );

              return (
                <View
                  key={variant.id}
                  style={[
                    styles.card,
                    isCompact && styles.cardCompact,
                    {
                      backgroundColor: colors.cardBackground,
                      borderColor: isVariantActive ? colors.secondary : colors.cardBorder,
                    },
                    index === 0 &&
                      !isVariantActive && { borderColor: colors.secondary + '44' },
                  ]}>
                  {variant.audioUrl ? (
                    renderPlayButton(
                      variant.audioUrl,
                      `Play ${variant.label}`,
                      isVariantPlaying,
                      isCompact ? 34 : 38,
                    )
                  ) : (
                    <View
                      style={[
                        styles.playCircle,
                        styles.playCircleDisabled,
                        {
                          width: isCompact ? 34 : 38,
                          height: isCompact ? 34 : 38,
                          borderRadius: isCompact ? 17 : 19,
                          backgroundColor: colors.surfaceContainerHigh,
                        },
                      ]}>
                      <MaterialIcons name="volume-off" size={16} color={colors.outline} />
                    </View>
                  )}

                  <View style={styles.cardText}>
                    <Text
                      style={[styles.cardLabel, { color: colors.onSurface }, isVerySmall && styles.cardLabelSmall]}
                      numberOfLines={1}>
                      {variant.label}
                    </Text>
                    <Text
                      style={[styles.cardPhonetic, { color: colors.onSurfaceVariant }]}
                      numberOfLines={2}>
                      {variant.text}
                    </Text>
                    {!variant.audioUrl ? (
                      <Text style={[styles.noAudioHint, { color: colors.outline }]}>Audio not available</Text>
                    ) : null}
                  </View>
                </View>
              );
            })}
          </View>

          {hasAudio ? renderTransportControls(true) : (
            <Text style={[styles.missing, { color: colors.outline }]}>Pronunciation audio not available</Text>
          )}
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    width: '100%',
    gap: LexiconSpacing.stackSm,
  },
  singleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: LexiconRadius.lg,
    borderWidth: 1,
  },
  singleRowCompact: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    gap: 8,
  },
  singleText: {
    flex: 1,
    minWidth: 0,
  },
  primaryPhonetic: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: 'Inter_500Medium',
    fontStyle: 'italic',
  },
  primaryPhoneticCompact: {
    fontSize: 16,
    lineHeight: 22,
  },
  missing: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Inter_400Regular',
    fontStyle: 'italic',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  sectionIcon: {
    width: 24,
    height: 24,
    borderRadius: LexiconRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Inter_600SemiBold',
  },
  cardList: {
    gap: LexiconSpacing.stackSm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: LexiconRadius.lg,
    borderWidth: 1,
  },
  cardCompact: {
    padding: 10,
    gap: 8,
  },
  playCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  playCircleDisabled: {
    opacity: 0.75,
  },
  cardText: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
  cardLabel: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  cardLabelSmall: {
    fontSize: 12,
  },
  cardPhonetic: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Inter_400Regular',
    fontStyle: 'italic',
  },
  noAudioHint: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    marginTop: 1,
  },
  transportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  transportRowCompact: {
    gap: 6,
    marginTop: 0,
  },
  transportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: LexiconRadius.full,
    borderWidth: 1,
  },
  transportButtonCompact: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 36,
    justifyContent: 'center',
  },
  transportLabel: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  controlDisabled: {
    opacity: 0.4,
  },
  status: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    marginLeft: 2,
    flexShrink: 1,
  },
  statusCompact: {
    fontSize: 11,
    marginLeft: 0,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.97 }],
  },
});
