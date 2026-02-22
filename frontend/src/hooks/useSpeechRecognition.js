import { useCallback, useEffect, useRef, useState } from "react";

export default function useSpeechRecognition({ language = "en-US", onTranscript }) {
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const isSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const start = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch {
      // Browser may throw if already started.
    }
  }, []);

  useEffect(() => {
    if (!isSupported) {
      return undefined;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript.toLowerCase())
        .join("");
      onTranscript?.(transcript);
    };

    recognition.onerror = (event) => {
      if (event.error === "no-speech" && isListening) {
        setTimeout(() => {
          try {
            recognition.start();
          } catch {
            // Ignore restart errors.
          }
        }, 1000);
      }
    };

    recognition.onend = () => {
      if (isListening) {
        try {
          recognition.start();
        } catch {
          // Ignore restart errors.
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, [isListening, isSupported, language, onTranscript]);

  useEffect(() => {
    if (!recognitionRef.current) return;
    recognitionRef.current.lang = language;
    if (isListening) {
      recognitionRef.current.stop();
      setTimeout(() => {
        try {
          recognitionRef.current?.start();
        } catch {
          // Ignore restart errors.
        }
      }, 100);
    }
  }, [isListening, language]);

  return {
    isListening,
    isSupported,
    start,
    stop,
    toggle: isListening ? stop : start,
  };
}
