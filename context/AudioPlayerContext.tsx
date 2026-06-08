import { Audio, type AVPlaybackStatus } from 'expo-av';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export type PlaybackState = 'idle' | 'playing' | 'paused';

export const PLAYBACK_SPEEDS = [0.75, 1, 1.25, 1.5] as const;
export type PlaybackSpeed = (typeof PLAYBACK_SPEEDS)[number];

interface AudioPlayerContextValue {
  playbackState: PlaybackState;
  activeUrl: string | null;
  playbackRate: PlaybackSpeed;
  play: (url: string) => Promise<void>;
  pause: () => Promise<void>;
  stop: () => Promise<void>;
  toggle: (url: string) => Promise<void>;
  setPlaybackRate: (rate: PlaybackSpeed) => Promise<void>;
  cyclePlaybackRate: () => Promise<void>;
  isPlaying: boolean;
  isPaused: boolean;
  isIdle: boolean;
}

const AudioPlayerContext = createContext<AudioPlayerContextValue | null>(null);

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const playbackStateRef = useRef<PlaybackState>('idle');
  const activeUrlRef = useRef<string | null>(null);
  const playbackRateRef = useRef<PlaybackSpeed>(1);
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [activeUrl, setActiveUrl] = useState<string | null>(null);
  const [playbackRate, setPlaybackRateState] = useState<PlaybackSpeed>(1);

  const applyPlaybackRate = useCallback(async (sound: Audio.Sound) => {
    await sound.setRateAsync(playbackRateRef.current, true);
  }, []);

  const syncState = useCallback((state: PlaybackState, url: string | null) => {
    playbackStateRef.current = state;
    activeUrlRef.current = url;
    setPlaybackState(state);
    setActiveUrl(url);
  }, []);

  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    }).catch(() => undefined);

    return () => {
      soundRef.current?.unloadAsync().catch(() => undefined);
      soundRef.current = null;
    };
  }, []);

  const onPlaybackStatusUpdate = useCallback(
    (status: AVPlaybackStatus) => {
      if (!status.isLoaded) {
        return;
      }
      if (status.didJustFinish) {
        syncState('idle', null);
        soundRef.current?.unloadAsync().catch(() => undefined);
        soundRef.current = null;
        return;
      }
      if (status.isPlaying) {
        syncState('playing', activeUrlRef.current);
      } else if (playbackStateRef.current === 'playing') {
        syncState('paused', activeUrlRef.current);
      }
    },
    [syncState]
  );

  const stop = useCallback(async () => {
    const sound = soundRef.current;
    if (sound) {
      try {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          await sound.stopAsync();
        }
        await sound.unloadAsync();
      } catch {
        // Sound may already be unloaded.
      }
      soundRef.current = null;
    }
    syncState('idle', null);
  }, [syncState]);

  const pause = useCallback(async () => {
    const sound = soundRef.current;
    if (!sound || playbackStateRef.current !== 'playing') {
      return;
    }
    try {
      await sound.pauseAsync();
      syncState('paused', activeUrlRef.current);
    } catch {
      await stop();
    }
  }, [stop, syncState]);

  const setPlaybackRate = useCallback(
    async (rate: PlaybackSpeed) => {
      playbackRateRef.current = rate;
      setPlaybackRateState(rate);
      const sound = soundRef.current;
      if (!sound) {
        return;
      }
      try {
        await applyPlaybackRate(sound);
      } catch {
        // Sound may have been unloaded.
      }
    },
    [applyPlaybackRate]
  );

  const cyclePlaybackRate = useCallback(async () => {
    const currentIndex = PLAYBACK_SPEEDS.indexOf(playbackRateRef.current);
    const nextRate = PLAYBACK_SPEEDS[(currentIndex + 1) % PLAYBACK_SPEEDS.length];
    await setPlaybackRate(nextRate);
  }, [setPlaybackRate]);

  const play = useCallback(
    async (url: string) => {
      if (!url) {
        return;
      }

      if (activeUrlRef.current === url && playbackStateRef.current === 'paused' && soundRef.current) {
        try {
          await applyPlaybackRate(soundRef.current);
          await soundRef.current.playAsync();
          syncState('playing', url);
        } catch {
          await stop();
        }
        return;
      }

      await stop();

      try {
        const { sound } = await Audio.Sound.createAsync(
          { uri: url },
          { shouldPlay: true, rate: playbackRateRef.current, shouldCorrectPitch: true },
          onPlaybackStatusUpdate
        );
        soundRef.current = sound;
        syncState('playing', url);
      } catch {
        await stop();
      }
    },
    [applyPlaybackRate, onPlaybackStatusUpdate, stop, syncState]
  );

  const toggle = useCallback(
    async (url: string) => {
      if (activeUrlRef.current === url && playbackStateRef.current === 'playing') {
        await pause();
        return;
      }
      await play(url);
    },
    [pause, play]
  );

  const value = useMemo(
    () => ({
      playbackState,
      activeUrl,
      playbackRate,
      play,
      pause,
      stop,
      toggle,
      setPlaybackRate,
      cyclePlaybackRate,
      isPlaying: playbackState === 'playing',
      isPaused: playbackState === 'paused',
      isIdle: playbackState === 'idle',
    }),
    [playbackState, activeUrl, playbackRate, play, pause, stop, toggle, setPlaybackRate, cyclePlaybackRate]
  );

  return <AudioPlayerContext.Provider value={value}>{children}</AudioPlayerContext.Provider>;
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within AudioPlayerProvider');
  }
  return context;
}
