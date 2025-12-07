import { createContext, useContext, useState, useRef, useEffect, useCallback, ReactNode } from "react";
import { 
  subscribeToRadioMetadata, 
  subscribeToListenerCount, 
  trackListener, 
  RadioMetadata 
} from "./firebase";

interface RadioTrack {
  title: string;
  artist: string;
  coverUrl?: string;
  showName?: string;
  hostName?: string;
}

interface RadioContextType {
  isPlaying: boolean;
  volume: number;
  currentTrack: RadioTrack | null;
  isLive: boolean;
  isExpanded: boolean;
  progress: number;
  duration: number;
  listenerCount: number;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  setExpanded: (expanded: boolean) => void;
  setCurrentTrack: (track: RadioTrack) => void;
  seek: (time: number) => void;
}

const RadioContext = createContext<RadioContextType | undefined>(undefined);

const STREAM_URL = "https://stream.zeno.fm/yn65fsaurfhvv";

export function RadioProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [isExpanded, setExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [listenerCount, setListenerCount] = useState(127);
  const [currentTrack, setCurrentTrack] = useState<RadioTrack | null>({
    title: "JoyJam Radio",
    artist: "Live Stream",
    coverUrl: undefined,
  });
  const [isLive] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(STREAM_URL);
    audioRef.current.volume = volume;
    
    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setProgress(audioRef.current.currentTime);
        setDuration(audioRef.current.duration || 0);
      }
    };

    audioRef.current.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const unsubscribeMetadata = subscribeToRadioMetadata((metadata: RadioMetadata) => {
      setCurrentTrack({
        title: metadata.title || "JoyJam Radio",
        artist: metadata.artist || "Live Stream",
        coverUrl: metadata.coverUrl,
        showName: metadata.showName,
        hostName: metadata.hostName,
      });
    });

    const unsubscribeListeners = subscribeToListenerCount((count) => {
      setListenerCount(count);
    });

    return () => {
      unsubscribeMetadata();
      unsubscribeListeners();
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      const untrack = trackListener();
      return () => untrack();
    }
  }, [isPlaying]);

  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current && !isLive) {
      audioRef.current.currentTime = time;
    }
  }, [isLive]);

  return (
    <RadioContext.Provider
      value={{
        isPlaying,
        volume,
        currentTrack,
        isLive,
        isExpanded,
        progress,
        duration,
        listenerCount,
        play,
        pause,
        togglePlay,
        setVolume,
        setExpanded,
        setCurrentTrack,
        seek,
      }}
    >
      {children}
    </RadioContext.Provider>
  );
}

export function useRadio() {
  const context = useContext(RadioContext);
  if (!context) {
    throw new Error("useRadio must be used within a RadioProvider");
  }
  return context;
}
