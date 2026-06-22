"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import StarLogo from "@/components/StarLogo";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import LocationPicker, { type LocationValue } from "@/components/LocationPicker";
import { useAuth } from "@/lib/auth";
import { PROFESSION_LIST, knownSubjectsFor } from "@/lib/professions";
import { generateSubjects } from "@/lib/tutor";

type Role = "student" | "parent";

export default function RegisterPage() {
  const router = useRouter();
  const { registerStudent, registerParent } = useAuth();
  const [role, setRole] = useState<Role>("student");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  // umumiy
  const [ism, setIsm] = useState("");
  const [familiya, setFamiliya] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [parol, setParol] = useState("");
  // o'quvchi
  const [yosh, setYosh] = useState("");
  const [loc, setLoc] = useState<LocationValue>({ viloyat: "", manzil: "", lat: null, lng: null });
  const [kasb, setKasb] = useState("");
  const [customKasb, setCustomKasb] = useState("");
  // ota-ona
  const [childUsername, setChildUsername] = useState("");

  const chosenKasb = (customKasb.trim() || kasb).trim();

  const submit = async () => {
    setErr("");
    if (!ism.trim() || !familiya.trim()) return setErr("Ism va familiyani kirit.");
    if (!tel.trim()) return setErr("Telefon raqamingni kirit.");
    if (username.trim().length < 3) return setErr("Foydalanuvchi nomi kamida 3 ta belgi.");
    if (parol.length < 4) return setErr("Parol kamida 4 ta belgi.");

    setBusy(true);
    if (role === "student") {
      if (!yosh.trim()) { setBusy(false); return setErr("Yoshingni kirit."); }
      if (!loc.viloyat) { setBusy(false); return setErr("Viloyatni tanla."); }
      if (!chosenKasb) { setBusy(false); return setErr("Kasbingni tanla yoki yoz."); }

      let subjects = knownSubjectsFor(chosenKasb);
      if (!subjects) {
        const gen = await generateSubjects(chosenKasb);
        subjects = gen.ok ? gen.subjects : ["Matematika", "Ona tili", "Ingliz tili", "Tarix"];
      }
      const res = registerStudent(
        {
          ism: ism.trim(), familiya: familiya.trim(), yosh: yosh.trim(),
          viloyat: loc.viloyat, manzil: loc.manzil.trim(), lat: loc.lat, lng: loc.lng,
          tel: tel.trim(), email: email.trim(), kasb: chosenKasb, subjects,
        },
        username.trim(), parol,
      );
      setBusy(false);
      if (!res.ok) return setErr(res.error);
      router.push("/bosh");
    } else {
      const res = registerParent(
        { ism: ism.trim(), familiya: familiya.trim(), tel: tel.trim(), email: email.trim(), childUsername: childUsername.trim() },
        username.trim(), parol,
      );
      setBusy(false);
      if (!res.ok) return setErr(res.error);
      router.push("/bosh");
    }
  };

  return (
    <div className="mx-auto max-w-xl px-5 py-10">
      <Link href="/" className="mb-6 flex items-center gap-2.5">
        <StarLogo size={32} />
        <span className="font-head text-xl font-bold">Ustoz AI</span>
      </Link>

      <h1 className="font-head text-3xl font-bold">Ro‘yxatdan o‘tish</h1>
      <p className="mt-1 text-muted">Hisob turini tanla va ma’lumotlaringni kirit.</p>

      {/* Rol tanlash */}
      <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl bg-cobalt-50 p-1">
        {(["student", "parent"] as Role[]).map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            className={`rounded-xl py-2.5 text-sm font-bold transition ${
              role === r ? "bg-cobalt text-white shadow-cobalt" : "text-cobalt"
            }`}
          >
            {r === "student" ? "O‘quvchi" : "Ota-ona"}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3.5">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Ism" value={ism} onChange={(e) => setIsm(e.target.value)} placeholder="Aziz" />
          <Field label="Familiya" value={familiya} onChange={(e) => setFamiliya(e.target.value)} placeholder="Karimov" />
        </div>

        {role === "student" && (
          <>
            <Field label="Yosh" value={yosh} onChange={(e) => setYosh(e.target.value)} placeholder="17" inputMode="numeric" />
            <LocationPicker value={loc} onChange={setLoc} />
          </>
        )}

        <Field label="Telefon raqam" value={tel} onChange={(e) => setTel(e.target.value)} placeholder="+998 90 123 45 67" />
        <Field label="Email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@misol.uz" />

        {role === "student" && (
          <div>
            <p className="mb-1.5 text-sm font-semibold text-ink">Kasbing (maqsadli soha)</p>
            <p className="mb-2 text-xs text-muted">Tanlagan kasbingga mos fanlar avtomatik biriktiriladi.</p>
            <div className="flex flex-wrap gap-2">
              {PROFESSION_LIST.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => { setKasb(p); setCustomKasb(""); }}
                  className={`rounded-full border-2 px-3.5 py-1.5 text-sm font-bold transition ${
                    kasb === p && !customKasb ? "border-cobalt bg-cobalt text-white" : "border-border bg-surface text-ink"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <Field
              label="Yoki o‘z kasbingni yoz"
              className="mt-3"
              value={customKasb}
              onChange={(e) => setCustomKasb(e.target.value)}
              placeholder="Masalan: Uchuvchi"
            />
          </div>
        )}

        {role === "parent" && (
          <Field
            label="Farzanding foydalanuvchi nomi (ixtiyoriy)"
            value={childUsername}
            onChange={(e) => setChildUsername(e.target.value)}
            placeholder="farzand nomi"
          />
        )}

        <div className="border-t border-border pt-3.5">
          <Field label="Foydalanuvchi nomi" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="aziz07" />
          <Field label="Parol" type="password" className="mt-3.5" value={parol} onChange={(e) => setParol(e.target.value)} placeholder="Kamida 4 ta belgi" />
        </div>

        {err && <p className="text-sm font-semibold text-clay">{err}</p>}

        <Button onClick={submit} disabled={busy} className="w-full">
          {busy ? "Tayyorlanmoqda..." : "Ro‘yxatdan o‘tish"}
        </Button>
        <p className="text-center text-sm text-muted">
          Hisobing bormi?{" "}
          <Link href="/kirish" className="font-bold text-cobalt">Kirish</Link>
        </p>
      </div>
    </div>
  );
}
