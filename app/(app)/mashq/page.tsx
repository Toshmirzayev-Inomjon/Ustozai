"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth";
import { generateQuiz, type QuizQuestion } from "@/lib/tutor";

type Phase = "loading" | "error" | "playing" | "done";

function QuizInner() {
  const { user, recordAnswer } = useAuth();
  const sp = useSearchParams();
  const subject = sp.get("fan") || user?.subjects?.[0] || "Matematika";

  const [phase, setPhase] = useState<Phase>("loading");
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const load = async () => {
    setPhase("loading");
    const res = await generateQuiz(subject, user?.kasb ?? "umumiy", 5);
    if (res.ok && res.questions.length) {
      setQuestions(res.questions);
      setIndex(0);
      setSelected(null);
      setScore(0);
      setPhase("playing");
    } else {
      setError(res.ok ? "Savol topilmadi." : res.error);
      setPhase("error");
    }
  };

  useEffect(() => {
    queueMicrotask(() => {
      void load();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject]);

  const q = questions[index];
  const answered = selected !== null;
  const isCorrect = answered && selected === q.correctIndex;

  const choose = (i: number) => {
    if (answered) return;
    setSelected(i);
    const correct = i === q.correctIndex;
    if (correct) setScore((s) => s + 1);
    recordAnswer(subject, correct);
  };

  const next = () => {
    if (index + 1 >= questions.length) setPhase("done");
    else {
      setIndex((i) => i + 1);
      setSelected(null);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-5 py-8">
      <div className="flex items-center justify-between">
        <h1 className="font-head text-2xl font-bold">{subject} · Test</h1>
      </div>

      {phase === "loading" && (
        <div className="mt-16 text-center text-muted">AI savollar tayyorlayapti...</div>
      )}

      {phase === "error" && (
        <div className="mt-16 text-center">
          <p className="text-4xl">😕</p>
          <p className="mt-2 text-ink">{error}</p>
          <Button onClick={load} className="mt-4">Qayta urinish</Button>
        </div>
      )}

      {phase === "playing" && q && (
        <div className="mt-5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-bold">Savol {index + 1} / {questions.length}</span>
            <span className="font-bold text-teal">{score} to‘g‘ri</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-bg">
            <div className="h-full rounded-full bg-cobalt" style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
          </div>

          <div className="mt-5 rounded-[20px] border border-border bg-surface p-6 shadow-soft">
            <p className="text-xs font-bold uppercase tracking-wide text-muted">Savol</p>
            <p className="mt-2 text-lg font-semibold">{q.prompt}</p>
          </div>

          <div className="mt-4 space-y-3">
            {q.options.map((opt, i) => {
              const correct = answered && i === q.correctIndex;
              const wrong = answered && i === selected && !isCorrect;
              return (
                <button
                  key={i}
                  disabled={answered}
                  onClick={() => choose(i)}
                  className={`flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left transition ${
                    correct ? "border-teal bg-teal-50" : wrong ? "border-clay bg-clay-50" : "border-border bg-surface hover:border-cobalt/40"
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bold ${
                      correct ? "bg-teal text-white" : wrong ? "bg-clay text-white" : "bg-bg text-ink"
                    }`}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="font-semibold">{opt}</span>
                </button>
              );
            })}
          </div>

          {answered && (
            <div className={`mt-5 rounded-2xl p-4 ${isCorrect ? "bg-teal-50" : "bg-clay-50"}`}>
              <p className={`font-bold ${isCorrect ? "text-teal" : "text-clay"}`}>
                {isCorrect ? "✅ Barakalla, to‘g‘ri!" : "❌ Noto‘g‘ri"}
              </p>
              <p className="mt-1 text-ink">{q.explanation || "Keyingi savolga o‘tamiz."}</p>
            </div>
          )}

          {answered && (
            <Button onClick={next} className="mt-5 w-full">
              {index + 1 >= questions.length ? "Yakunlash" : "Keyingi savol"}
            </Button>
          )}
        </div>
      )}

      {phase === "done" && (
        <div className="mt-16 text-center">
          <p className="text-6xl">{score >= questions.length / 2 ? "🎉" : "💪"}</p>
          <p className="mt-3 font-head text-4xl font-bold text-cobalt">{score} / {questions.length}</p>
          <p className="mt-2 text-muted">
            {score >= questions.length / 2 ? "Zo‘r natija! Sen uddalaysan." : "Yaxshi urinish — mashq qilsang yaxshilanadi!"}
          </p>
          <Button onClick={load} className="mt-6">Yana bir bor</Button>
        </div>
      )}
    </div>
  );
}

export default function MashqPage() {
  return (
    <Suspense fallback={<div className="p-8 text-muted">Yuklanmoqda...</div>}>
      <QuizInner />
    </Suspense>
  );
}
