"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import StarLogo from "@/components/StarLogo";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { useAuth } from "@/lib/auth";

type Tab = "user" | "admin";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [tab, setTab] = useState<Tab>("user");
  const [username, setUsername] = useState("");
  const [parol, setParol] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const submit = async () => {
    setErr("");
    if (!username.trim() || !parol) return setErr("Foydalanuvchi nomi va parolni kirit.");
    setBusy(true);

    if (tab === "admin") {
      // Admin auth backend (env) ga qarshi tekshiriladi — frontendda parol yo'q.
      try {
        const res = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: username.trim(), password: parol }),
        });
        const data = await res.json().catch(() => ({}));
        setBusy(false);
        if (!data.ok) return setErr(data.error || "Foydalanuvchi nomi yoki parol noto‘g‘ri.");
        sessionStorage.setItem("ustozAdmin", data.token || "1");
        router.push("/admin");
      } catch {
        setBusy(false);
        setErr("Serverga ulanib bo‘lmadi.");
      }
      return;
    }

    const res = login(username.trim(), parol);
    setBusy(false);
    if (!res.ok) return setErr(res.error);
    router.push("/bosh");
  };

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-5 py-10">
      <Link href="/" className="mb-8 flex items-center justify-center gap-2.5">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-cobalt-50">
          <StarLogo size={40} />
        </div>
      </Link>
      <h1 className="text-center font-head text-3xl font-bold">Xush kelibsan!</h1>
      <p className="mt-1 text-center text-muted">Hisobingga kir va davom et</p>

      <div className="mt-6 grid grid-cols-2 gap-2 rounded-2xl bg-cobalt-50 p-1">
        {(["user", "admin"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setErr(""); }}
            className={`rounded-xl py-2.5 text-sm font-bold transition ${
              tab === t ? "bg-cobalt text-white shadow-cobalt" : "text-cobalt"
            }`}
          >
            {t === "user" ? "O‘quvchi / Ota-ona" : "Admin"}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3.5">
        <Field label="Foydalanuvchi nomi" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="foydalanuvchi_nomi" />
        <Field label="Parol" type="password" value={parol} onChange={(e) => setParol(e.target.value)} placeholder="parol" />
        {err && <p className="text-sm font-semibold text-clay">{err}</p>}
        <Button onClick={submit} disabled={busy} className="w-full">
          {busy ? "Tekshirilmoqda..." : "Kirish"}
        </Button>
      </div>

      {tab === "user" && (
        <p className="mt-6 text-center text-sm text-muted">
          Hisobing yo‘qmi?{" "}
          <Link href="/royxat" className="font-bold text-cobalt">Ro‘yxatdan o‘tish</Link>
        </p>
      )}
    </div>
  );
}
