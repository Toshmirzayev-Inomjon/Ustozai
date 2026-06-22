"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { paletteFor } from "@/lib/professions";

export default function FanlarPage() {
  const { user } = useAuth();
  if (!user) return null;
  const subjects = user.subjects ?? [];
  const progressOf = (name: string) => {
    const s = user.subjectStats[name];
    return s && s.answered ? s.correct / s.answered : 0;
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-8">
      <h1 className="font-head text-3xl font-bold">Fanlarim</h1>
      <p className="mt-1 text-muted">
        {user.kasb ? `${user.kasb} uchun tanlangan fanlar` : "Kasb tanlanmagan"}
      </p>

      {subjects.length === 0 ? (
        <div className="mt-6 rounded-[20px] border border-border bg-surface p-6 text-muted shadow-soft">
          Hali fan biriktirilmagan. Profil orqali kasbingni tanla.
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {subjects.map((name, i) => {
            const pal = paletteFor(i);
            const prog = progressOf(name);
            return (
              <div key={name} className="flex flex-wrap items-center gap-4 rounded-[20px] border border-border bg-surface p-5 shadow-soft">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: pal.bg }}>
                  <span className="h-4 w-4 rounded" style={{ background: pal.color }} />
                </div>
                <div className="min-w-[160px] flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold">{name}</p>
                    <p className="text-sm font-bold" style={{ color: pal.color }}>{Math.round(prog * 100)}%</p>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-bg">
                    <div className="h-full rounded-full" style={{ width: `${prog * 100}%`, background: pal.color }} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/fanlar/${encodeURIComponent(name)}`} className="rounded-full bg-cobalt px-4 py-2 text-sm font-bold text-white">
                    Dars o‘tish
                  </Link>
                  <Link href={`/mashq?fan=${encodeURIComponent(name)}`} className="rounded-full bg-cobalt-50 px-4 py-2 text-sm font-bold text-cobalt">
                    Test
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
