"use client";

import { useEffect, useRef, useState } from "react";
import StarLogo from "@/components/StarLogo";
import { useAuth } from "@/lib/auth";
import { askTutor, detectMood, type ChatMessage } from "@/lib/tutor";
import { useSpeech } from "./useSpeech";

type Bubble = { id: number; role: "user" | "assistant"; content: string };
let counter = 0;
const nextId = () => ++counter;

export default function ChatPanel({
  subject,
  title,
  subtitle,
}: {
  subject?: string;
  title: string;
  subtitle: string;
}) {
  const { user } = useAuth();
  const { listening, sttSupported, ttsSupported, speak, listen, stopListening } = useSpeech();

  const greeting = subject
    ? `Salom${user ? ", " + user.ism : ""}! Kel, ${subject} fanidan birga ishlaymiz. Qaysi mavzu qiyin tuyulyapti?`
    : `Salom${user ? ", " + user.ism : ""}! Men Ustoz AI — do‘sting va ustozing. Bugun nima o‘rganamiz?`;

  const [messages, setMessages] = useState<Bubble[]>([{ id: nextId(), role: "assistant", content: greeting }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [voice, setVoice] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const voiceRef = useRef(voice);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    voiceRef.current = voice;
  }, [voice]);

  const send = async (text: string) => {
    const t = text.trim();
    if (!t || typing) return;
    const mood = detectMood(t);
    const updated = [...messages, { id: nextId(), role: "user" as const, content: t }];
    setMessages(updated);
    setInput("");
    setTyping(true);

    const history: ChatMessage[] = updated.map((m) => ({ role: m.role, content: m.content }));
    const result = await askTutor(history, { ism: user?.ism, kasb: user?.kasb, subject, mood });
    setTyping(false);

    if (result.ok) {
      setMessages((p) => [...p, { id: nextId(), role: "assistant", content: result.content }]);
      if (voiceRef.current && ttsSupported) speak(result.content);
    } else {
      setMessages((p) => [...p, { id: nextId(), role: "assistant", content: `⚠️ ${result.error}` }]);
    }
  };

  const onMic = () => {
    if (listening) return stopListening();
    listen((text) => send(text));
  };

  const suggestions = subject
    ? [`${subject} nimadan boshlanadi?`, "Menga bitta misol ber", "Bu menga nega kerak?"]
    : ["Bugun nimani o‘rganay?", "Menga savol ber", "Qiyin mavzu bor"];

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[20px] border border-border bg-surface shadow-soft">
      {/* header */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cobalt">
          <StarLogo size={24} color="#fff" />
        </div>
        <div className="flex-1">
          <p className="font-bold leading-tight">{title}</p>
          <p className="flex items-center gap-1.5 text-xs text-muted">
            <span className="h-2 w-2 rounded-full bg-teal" /> {subtitle}
          </p>
        </div>
        {ttsSupported && (
          <button
            onClick={() => setVoice((v) => !v)}
            title="Ovozli o'qish"
            className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${
              voice ? "bg-cobalt-50" : "bg-bg"
            }`}
          >
            {voice ? "🔊" : "🔈"}
          </button>
        )}
      </div>

      {/* messages */}
      <div ref={scrollRef} className="no-scrollbar flex-1 space-y-3 overflow-y-auto bg-bg p-4">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} items-end gap-2`}>
            {m.role === "assistant" && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cobalt">
                <StarLogo size={16} color="#fff" />
              </div>
            )}
            <div
              className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-[15px] leading-relaxed ${
                m.role === "user"
                  ? "rounded-br-md bg-cobalt text-white"
                  : "rounded-bl-md border border-border bg-surface text-ink"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex items-end gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cobalt">
              <StarLogo size={16} color="#fff" />
            </div>
            <div className="flex gap-1 rounded-2xl rounded-bl-md border border-border bg-surface px-4 py-3.5">
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-2 w-2 animate-bounce rounded-full bg-muted" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* suggestions */}
      {messages.length <= 1 && !typing && (
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pt-3">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="shrink-0 rounded-full bg-cobalt-50 px-3.5 py-2 text-sm font-semibold text-cobalt"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* input */}
      <div className="flex items-end gap-2 border-t border-border p-3">
        {sttSupported && (
          <button
            onClick={onMic}
            title="Ovozli kiritish"
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg ${
              listening ? "animate-pulse bg-clay text-white" : "bg-bg"
            }`}
          >
            🎤
          </button>
        )}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
          rows={1}
          placeholder="Savolingni yoz..."
          className="max-h-32 flex-1 resize-none rounded-xl bg-bg px-4 py-3 text-[15px] outline-none"
        />
        <button
          onClick={() => send(input)}
          disabled={!input.trim() || typing}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cobalt text-white disabled:opacity-50"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
