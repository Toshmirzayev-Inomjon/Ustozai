"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { paletteFor } from "@/lib/professions";

export default function BoshPage() {
  const { user } = useAuth();
  if (!user) return null;

  const accuracy = user.totalAnswered ? Math.round((user.totalCorrect / user.totalAnswered) * 100) : 0;
  const subjects = user.subjects ?? [];
  const progressOf = (name: string) => {
    const s = user.subjectStats[name];
    return s && s.answered ? s.correct / s.answered : 0;
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-muted">Assalomu alaykum,</p>
          <h1 className="font-head text-3xl font-bold">{user.ism} 👋</h1>
          {user.role === "student" && user.kasb && (
            <p className="mt-1 text-sm font-bold text-cobalt">{user.kasb} yo‘nalishi</p>
          )}
        </div>
        <span className="rounded-full bg-saffron-50 px-4 py-2 text-sm font-bold text-saffron">
          🔥 {user.streak} kun
        </span>
      </div>

      {user.role === "parent" ? (
        <div className="mt-6 rounded-[20px] border border-border bg-surface p-6 shadow-soft">
          <h2 className="text-xl font-bold">Ota-ona paneli</h2>
          <p className="mt-2 text-muted">
            {user.childUsername
              ? `Farzanding (@${user.childUsername}) natijalarini kuzatish tez orada qo‘shiladi.`
              : "Farzandingni profil orqali bog‘lab, natijalarini kuzatishing mumkin (tez orada)."}
          </p>
          <Link href="/ustoz" className="mt-4 inline-flex rounded-xl bg-cobalt px-5 py-2.5 font-bold text-white">
            AI ustoz bilan tanishish
          </Link>
        </div>
      ) : (
        <>
          {/* CTA */}
          <Link
            href="/ustoz"
            className="mt-6 flex items-center gap-4 rounded-[20px] bg-cobalt p-5 text-white shadow-cobalt"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-2xl">⭐</div>
            <div>
              <p className="text-lg font-bold">Ustoz bilan gaplash</p>
              <p className="text-sm text-white/80">Birga o‘ylaymiz, birga yechamiz →</p>
            </div>
          </Link>

          {/* stats */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { v: user.totalAnswered, l: "savol" },
              { v: `${accuracy}%`, l: "aniqlik" },
              { v: user.streak, l: "kun" },
            ].map((s) => (
              <div key={s.l} className="rounded-[20px] border border-border bg-surface p-4 text-center shadow-soft">
                <p className="font-head text-2xl font-bold text-cobalt">{s.v}</p>
                <p className="text-xs text-muted">{s.l}</p>
              </div>
            ))}
          </div>

          {/* subjects */}
          <h2 className="mt-8 font-head text-2xl font-bold">Fanlarim</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((name, i) => {
              const pal = paletteFor(i);
              const prog = progressOf(name);
              return (
                <Link
                  key={name}
                  href={`/fanlar/${encodeURIComponent(name)}`}
                  className="rounded-[20px] border border-border bg-surface p-5 shadow-soft transition hover:-translate-y-1"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: pal.bg }}>
                    <span className="h-3.5 w-3.5 rounded" style={{ background: pal.color }} />
                  </div>
                  <p className="mt-3 font-bold">{name}</p>
                  <p className="text-sm font-bold" style={{ color: pal.color }}>{Math.round(prog * 100)}%</p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-bg">
                    <div className="h-full rounded-full" style={{ width: `${prog * 100}%`, background: pal.color }} />
                  </div>
                </Link>
              );
            })}
          </div>

          {subjects[0] && (
            <Link
              href="/mashq"
              className="mt-6 flex items-center gap-4 rounded-[20px] bg-saffron-50 p-5"
            >
              <span className="text-3xl">🎯</span>
              <div className="flex-1">
                <p className="font-bold">Bilimingni sina</p>
                <p className="text-sm text-muted">AI tayyorlagan test — {subjects[0]}</p>
              </div>
              <span className="text-2xl text-saffron">→</span>
            </Link>
          )}
        </>
      )}
    </div>
  );
}
