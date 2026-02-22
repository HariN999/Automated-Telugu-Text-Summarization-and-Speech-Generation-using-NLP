import { useCallback, useEffect, useRef, useState } from "react";

export default function useAudioPlayback({ language = "te-IN", defaultRate = 0.9 }) {
  const utteranceRef = useRef(null);
  const audioRef = useRef(typeof Audio !== "undefined" ? new Audio() : null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  }, []);

  const playUrl = useCallback(
    ({ url, onEnd, onError }) => {
      if (!url || !audioRef.current) return;

      window.speechSynthesis.cancel();
      const player = audioRef.current;
      player.pause();
      player.src = url;
      player.currentTime = 0;
      player.muted = isMuted;

      player.onended = () => {
        setIsPlaying(false);
        onEnd?.();
      };
      player.onerror = (event) => {
        setIsPlaying(false);
        onError?.(event);
      };

      setIsPlaying(true);
      void player.play().catch((event) => {
        setIsPlaying(false);
        onError?.(event);
      });
    },
    [isMuted],
  );

  const speak = useCallback(
    ({ text, rate, onEnd, onError }) => {
      if (!text?.trim()) return;

      window.speechSynthesis.cancel();
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = rate ?? defaultRate;
      utterance.pitch = 1.0;
      utterance.volume = isMuted ? 0 : 1;

      utterance.onend = () => {
        setIsPlaying(false);
        onEnd?.();
      };

      utterance.onerror = (event) => {
        setIsPlaying(false);
        onError?.(event);
      };

      utteranceRef.current = utterance;
      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
    },
    [defaultRate, isMuted, language],
  );

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (utteranceRef.current) {
        utteranceRef.current.volume = next ? 0 : 1;
      }
      if (audioRef.current) {
        audioRef.current.muted = next;
      }
      return next;
    });
  }, []);

  useEffect(
    () => () => {
      window.speechSynthesis.cancel();
      if (audioRef.current) {
        audioRef.current.pause();
      }
    },
    [],
  );

  return {
    isPlaying,
    setIsPlaying,
    isMuted,
    playUrl,
    speak,
    stop,
    toggleMute,
  };
}
