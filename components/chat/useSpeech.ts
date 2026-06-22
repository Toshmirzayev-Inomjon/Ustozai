"use client";

// Web Speech API — ovozni matnga (STT) va matnni ovozga (TTS).
// O'zbek tili hamma brauzerda bo'lmasligi mumkin — best-effort, mavjud bo'lmasa yaqin tilga tushadi.
import { useCallback, useEffect, useRef, useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */

export function useSpeech() {
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const recRef = useRef<any>(null);

  const sttSupported =
    typeof window !== "undefined" &&
    Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  const ttsSupported = typeof window !== "undefined" && "speechSynthesis" in window;

  const speak = useCallback(
    (text: string, lang = "uz-UZ") => {
      if (!ttsSupported) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang;
      u.rate = 0.98;
      u.onstart = () => setSpeaking(true);
      u.onend = () => setSpeaking(false);
      const voices = window.speechSynthesis.getVoices();
      const match =
        voices.find((v) => v.lang?.toLowerCase().startsWith("uz")) ||
        voices.find((v) => v.lang?.toLowerCase().startsWith("ru")) ||
        voices.find((v) => v.lang?.toLowerCase().startsWith("en"));
      if (match) u.voice = match;
      window.speechSynthesis.speak(u);
    },
    [ttsSupported],
  );

  const stopSpeaking = useCallback(() => {
    if (ttsSupported) window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [ttsSupported]);

  const listen = useCallback(
    (onResult: (text: string) => void, lang = "uz-UZ") => {
      if (!sttSupported) return;
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SR();
      rec.lang = lang;
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      rec.onresult = (e: any) => {
        const text = e.results?.[0]?.[0]?.transcript ?? "";
        if (text) onResult(text);
      };
      rec.onend = () => setListening(false);
      rec.onerror = () => setListening(false);
      recRef.current = rec;
      setListening(true);
      rec.start();
    },
    [sttSupported],
  );

  const stopListening = useCallback(() => {
    recRef.current?.stop?.();
    setListening(false);
  }, []);

  useEffect(() => {
    return () => {
      recRef.current?.stop?.();
      if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  return { listening, speaking, sttSupported, ttsSupported, speak, stopSpeaking, listen, stopListening };
}
