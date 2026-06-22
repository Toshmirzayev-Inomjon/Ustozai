"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import StarLogo from "@/components/StarLogo";
import { loadAccounts } from "@/lib/storage";
import type { User } from "@/lib/types";

export default function AdminPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      // TODO(backend): sessiyani serverdan tekshirish (cookie/JWT). Hozircha sessionStorage.
      const token = sessionStorage.getItem("ustozAdmin");
      if (!token) {
        router.replace("/kirish");
        return;
      }
      setAuthed(true);
      setUsers(loadAccounts());
    });
    return () => {
      active = false;
    };
  }, [router]);

  if (!authed) return <div className="flex min-h-dvh items-center justify-center"><StarLogo size={48} /></div>;

  const students = users.filter((u) => u.role === "student");
  const parents = users.filter((u) => u.role === "parent");
  const totalAnswered = users.reduce((a, u) => a + (u.totalAnswered || 0), 0);

  const logout = () => {
    sessionStorage.removeItem("ustozAdmin");
    router.push("/kirish");
  };

  return (
    <div className="min-h-dvh">
      <header className="flex items-center justify-between border-b border-border bg-surface px-5 py-3.5">
        <Link href="/" className="flex items-center gap-2.5">
          <StarLogo size={30} />
          <span className="font-head text-lg font-bold">Ustoz AI · Admin</span>
        </Link>
        <button onClick={logout} className="text-sm font-bold text-clay">Chiqish</button>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-8">
        {/* TODO(backend): bu ma'lumotlar hozir shu brauzer localStorage'idan. FastAPI + DB bilan markazlashtiriladi. */}
        <p className="rounded-xl bg-saffron-50 px-4 py-2.5 text-sm text-saffron">
          Eslatma: hozir foydalanuvchilar shu brauzerda saqlanadi (MVP). Backend ulangach markazlashadi.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { v: users.length, l: "Foydalanuvchi" },
            { v: students.length, l: "O‘quvchi" },
            { v: parents.length, l: "Ota-ona" },
            { v: totalAnswered, l: "Jami savol" },
          ].map((s) => (
            <div key={s.l} className="rounded-[20px] border border-border bg-surface p-5 text-center shadow-soft">
              <p className="font-head text-2xl font-bold text-cobalt">{s.v}</p>
              <p className="text-xs text-muted">{s.l}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-8 font-head text-xl font-bold">Foydalanuvchilar</h2>
        <div className="mt-3 overflow-x-auto rounded-[20px] border border-border bg-surface shadow-soft">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border text-xs uppercase text-muted">
              <tr>
                <th className="px-4 py-3">Ism</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3">Kasb</th>
                <th className="px-4 py-3">Telefon</th>
                <th className="px-4 py-3">Savol</th>
                <th className="px-4 py-3">Streak</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-6 text-muted">Hozircha foydalanuvchi yo‘q.</td></tr>
              )}
              {users.map((u) => (
                <tr key={u.username} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-semibold">{u.ism} {u.familiya}<br /><span className="text-xs text-muted">@{u.username}</span></td>
                  <td className="px-4 py-3">{u.role === "student" ? "O‘quvchi" : "Ota-ona"}</td>
                  <td className="px-4 py-3">{u.kasb || "—"}</td>
                  <td className="px-4 py-3">{u.tel}</td>
                  <td className="px-4 py-3">{u.totalAnswered}</td>
                  <td className="px-4 py-3">{u.streak}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
