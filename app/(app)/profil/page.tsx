"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth";
import { PROFESSION_LIST, knownSubjectsFor } from "@/lib/professions";
import { generateSubjects } from "@/lib/tutor";

export default function ProfilPage() {
  const router = useRouter();
  const { user, logout, changeProfession } = useAuth();
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  if (!user) return null;

  const apply = async (kasb: string) => {
    const chosen = kasb.trim();
    if (!chosen) return;
    setBusy(true);
    let subjects = knownSubjectsFor(chosen);
    if (!subjects) {
      const gen = await generateSubjects(chosen);
      subjects = gen.ok ? gen.subjects : user.subjects ?? [];
    }
    changeProfession(chosen, subjects);
    setBusy(false);
    setOpen(false);
    setCustom("");
    setMsg(`Kasbing "${chosen}" ga o‘zgartirildi. Fanlaring yangilandi.`);
  };

  const info: [string, string][] = [
    ["Ism", `${user.ism} ${user.familiya}`],
    ["Rol", user.role === "student" ? "O‘quvchi" : "Ota-ona"],
    ...(user.role === "student" ? ([["Yosh", user.yosh || "—"], ["Viloyat", user.viloyat || "—"], ["Manzil", user.manzil || "—"], ["Kasb", user.kasb || "—"]] as [string, string][]) : []),
    ["Telefon", user.tel],
    ["Email", user.email || "—"],
    ["Foydalanuvchi nomi", user.username],
  ];

  return (
    <div className="mx-auto max-w-2xl px-5 py-8">
      <h1 className="font-head text-3xl font-bold">Profil</h1>

      <div className="mt-6 flex flex-col items-center rounded-[20px] border border-border bg-surface p-8 shadow-soft">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-cobalt font-head text-3xl font-bold text-white">
          {user.ism.charAt(0).toUpperCase()}
        </div>
        <p className="mt-3 text-xl font-bold">{user.ism} {user.familiya}</p>
        {user.kasb && <p className="text-muted">{user.kasb} yo‘nalishi</p>}
        <div className="mt-3 flex gap-2">
          <span className="rounded-full bg-saffron-50 px-3 py-1 text-sm font-bold text-saffron">🔥 {user.streak} kun</span>
          <span className="rounded-full bg-teal-50 px-3 py-1 text-sm font-bold text-teal">{user.totalAnswered} savol</span>
        </div>
      </div>

      {msg && <p className="mt-4 rounded-xl bg-teal-50 px-4 py-3 font-semibold text-teal">{msg}</p>}

      <h2 className="mt-6 font-head text-xl font-bold">Ma’lumotlarim</h2>
      <div className="mt-3 divide-y divide-border rounded-[20px] border border-border bg-surface px-5 shadow-soft">
        {info.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 py-3.5">
            <span className="font-semibold text-muted">{k}</span>
            <span className="truncate text-right">{v}</span>
          </div>
        ))}
      </div>

      {user.role === "student" && (
        <button onClick={() => setOpen(true)} className="mt-4 w-full rounded-xl bg-cobalt-50 py-3 font-bold text-cobalt">
          🎓 Kasbni o‘zgartirish
        </button>
      )}

      <Button variant="ghost" onClick={() => { logout(); router.push("/"); }} className="mt-3 w-full">
        Chiqish
      </Button>

      {/* Kasb modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-md rounded-t-3xl bg-surface p-6 sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-head text-xl font-bold">Kasbni tanla</h3>
            <div className="mt-4 flex max-h-64 flex-wrap gap-2 overflow-y-auto">
              {PROFESSION_LIST.map((p) => (
                <button key={p} disabled={busy} onClick={() => apply(p)} className="rounded-full bg-cobalt-50 px-3.5 py-2 text-sm font-bold text-cobalt disabled:opacity-50">
                  {p}
                </button>
              ))}
            </div>
            <input
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="Yoki o‘z kasbingni yoz..."
              className="mt-4 w-full rounded-xl border-2 border-border bg-bg px-3.5 py-3 outline-none focus:border-cobalt/50"
            />
            <Button onClick={() => apply(custom)} disabled={busy} className="mt-3 w-full">
              {busy ? "Saqlanmoqda..." : "Saqlash"}
            </Button>
            <button onClick={() => setOpen(false)} className="mt-2 w-full py-2 text-sm font-semibold text-muted">Bekor qilish</button>
          </div>
        </div>
      )}
    </div>
  );
}
