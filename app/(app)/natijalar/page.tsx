"use client";

import { useAuth } from "@/lib/auth";
import { colors } from "@/lib/theme";

export default function NatijalarPage() {
  const { user } = useAuth();
  if (!user) return null;

  const accuracy = user.totalAnswered ? Math.round((user.totalCorrect / user.totalAnswered) * 100) : 0;
  const subjects = user.subjects ?? [];

  const badges = [
    { e: "🔥", t: "3 kun ketma-ket", on: user.streak >= 3 },
    { e: "🎯", t: "10 savol", on: user.totalAnswered >= 10 },
    { e: "⭐", t: "50 savol", on: user.totalAnswered >= 50 },
    { e: "🧠", t: "80% aniqlik", on: user.totalAnswered >= 10 && accuracy >= 80 },
    { e: "🚀", t: "7 kun streak", on: user.streak >= 7 },
    { e: "🏆", t: "100 savol", on: user.totalAnswered >= 100 },
  ];

  return (
    <div className="mx-auto max-w-3xl px-5 py-8">
      <h1 className="font-head text-3xl font-bold">Natijalarim</h1>

      <div className="mt-6 flex items-center gap-4 rounded-[20px] bg-saffron p-6 text-white shadow-soft">
        <span className="text-5xl">🔥</span>
        <div>
          <p className="font-head text-3xl font-bold">{user.streak} kun</p>
          <p className="text-white/90">ketma-ket o‘qiyapsan!</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          { v: user.totalAnswered, l: "savol" },
          { v: user.totalCorrect, l: "to‘g‘ri" },
          { v: `${accuracy}%`, l: "aniqlik" },
        ].map((s) => (
          <div key={s.l} className="rounded-[20px] border border-border bg-surface p-5 text-center shadow-soft">
            <p className="font-head text-2xl font-bold text-cobalt">{s.v}</p>
            <p className="text-xs text-muted">{s.l}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-8 font-head text-xl font-bold">Fanlar bo‘yicha</h2>
      <div className="mt-4 space-y-4 rounded-[20px] border border-border bg-surface p-6 shadow-soft">
        {subjects.length === 0 && <p className="text-muted">Hali fan yo‘q.</p>}
        {subjects.map((name) => {
          const s = user.subjectStats[name];
          const val = s && s.answered ? s.correct / s.answered : 0;
          const color = val > 0.7 ? colors.teal : val > 0.45 ? colors.cobalt : colors.saffron;
          return (
            <div key={name}>
              <div className="flex justify-between text-sm">
                <span className="font-semibold">{name}</span>
                <span className="text-muted">{s?.answered ? `${Math.round(val * 100)}%` : "hali yo‘q"}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-bg">
                <div className="h-full rounded-full" style={{ width: `${val * 100}%`, background: color }} />
              </div>
            </div>
          );
        })}
      </div>

      <h2 className="mt-8 font-head text-xl font-bold">Yutuqlar</h2>
      <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-6">
        {badges.map((b) => (
          <div key={b.t} className="text-center">
            <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-3xl ${b.on ? "bg-cobalt-50" : "bg-bg opacity-40"}`}>
              {b.e}
            </div>
            <p className="mt-2 text-xs">{b.t}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
