"use client";

import { useRef, useState } from "react";
import VoiceOrb from "@/components/chat/VoiceOrb";
import { useSpeech } from "@/components/chat/useSpeech";
import { useAuth } from "@/lib/auth";
import { askTutor, detectMood, type ChatMessage } from "@/lib/tutor";

export default function OvozliPage() {
  const { user } = useAuth();
  const { listening, speaking, sttSupported, ttsSupported, speak, listen, stopListening } = useSpeech();
  const [thinking, setThinking] = useState(false);
  const [lastUser, setLastUser] = useState("");
  const [lastAi, setLastAi] = useState("Salom! Mikrofonni bos va men bilan gaplash. Bugun nimani o‘rganamiz?");
  const historyRef = useRef<ChatMessage[]>([]);

  const handle = async (text: string) => {
    setLastUser(text);
    setThinking(true);
    const mood = detectMood(text);
    const history = [...historyRef.current, { role: "user" as const, content: text }];
    const res = await askTutor(history, { ism: user?.ism, kasb: user?.kasb, mood });
    setThinking(false);
    if (res.ok) {
      historyRef.current = [...history, { role: "assistant" as const, content: res.content }].slice(-20);
      setLastAi(res.content);
      if (ttsSupported) speak(res.content);
    } else {
      setLastAi(`⚠️ ${res.error}`);
    }
  };

  const onMic = () => {
    if (listening) return stopListening();
    listen((t) => handle(t));
  };

  const state = speaking ? "speaking" : listening ? "listening" : "idle";
  const statusText = thinking
    ? "O‘ylayapman..."
    : listening
      ? "Eshityapman... gapir"
      : speaking
        ? "Javob beryapman..."
        : "Mikrofonni bos va gapir";

  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center px-5 py-10 text-center">
      <h1 className="font-head text-2xl font-bold">Ovozli ustoz</h1>
      <p className="mt-1 text-muted">{user?.kasb ? `${user.kasb} · jonli suhbat` : "jonli suhbat"}</p>

      <div className="my-8">
        <VoiceOrb size={220} state={state} />
      </div>

      <p className="font-bold text-cobalt">{statusText}</p>

      {/* oxirgi almashinuv */}
      <div className="mt-6 w-full space-y-3">
        {lastUser && (
          <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-cobalt px-4 py-2.5 text-left text-white">
            {lastUser}
          </div>
        )}
        <div className="mr-auto max-w-[90%] rounded-2xl rounded-bl-md border border-border bg-surface px-4 py-2.5 text-left">
          {lastAi}
        </div>
      </div>

      {!sttSupported ? (
        <p className="mt-8 rounded-xl bg-saffron-50 px-4 py-3 text-sm text-saffron">
          Brauzering ovozli kiritishni qo‘llab-quvvatlamaydi. Chrome brauzerida yaxshi ishlaydi.
        </p>
      ) : (
        <button
          onClick={onMic}
          disabled={thinking}
          className={`mt-8 flex h-20 w-20 items-center justify-center rounded-full text-3xl text-white shadow-cobalt transition disabled:opacity-50 ${
            listening ? "animate-pulse bg-clay" : "bg-cobalt"
          }`}
        >
          🎤
        </button>
      )}
    </div>
  );
}
