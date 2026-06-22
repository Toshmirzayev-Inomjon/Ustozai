"use client";

import { useState } from "react";

const PLANS = [
  { id: "free", name: "Bepul", price: "0 so‘m", features: ["AI ustoz bilan suhbat", "Kasbga mos fanlar", "Kunlik testlar"], cta: "Joriy tarif", highlight: false },
  { id: "premium", name: "Premium", price: "29 000 so‘m / oy", features: ["Cheksiz AI suhbat", "Ovozli ustoz", "Chuqur testlar", "Shaxsiy reja"], cta: "To‘lash", highlight: true },
  { id: "pro", name: "Pro (oila)", price: "49 000 so‘m / oy", features: ["Premium imkoniyatlari", "3 tagacha hisob", "Ota-ona hisoboti"], cta: "To‘lash", highlight: false },
];

export default function TariflarPage() {
  const [msg, setMsg] = useState("");
  return (
    <div className="mx-auto max-w-4xl px-5 py-8">
      <h1 className="font-head text-3xl font-bold">Tariflar</h1>
      <p className="mt-1 text-muted">O‘zingga mos rejani tanla</p>

      {msg && <p className="mt-4 rounded-xl bg-cobalt-50 px-4 py-3 font-semibold text-cobalt">{msg}</p>}

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {PLANS.map((p) => (
          <div
            key={p.id}
            className={`rounded-[20px] border p-6 shadow-soft ${p.highlight ? "border-cobalt bg-cobalt text-white" : "border-border bg-surface"}`}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{p.name}</h2>
              {p.highlight && <span className="rounded-full bg-saffron px-3 py-1 text-xs font-bold text-white">Ommabop</span>}
            </div>
            <p className={`mt-2 text-lg font-bold ${p.highlight ? "text-white" : "text-cobalt"}`}>{p.price}</p>
            <ul className={`mt-4 space-y-2 text-[15px] ${p.highlight ? "text-white/90" : "text-ink"}`}>
              {p.features.map((f) => <li key={f}>✓ {f}</li>)}
            </ul>
            {p.id === "free" ? (
              <div className="mt-6 rounded-xl border border-border py-3 text-center font-bold text-muted">{p.cta}</div>
            ) : (
              <button
                onClick={() => setMsg("To‘lov hozircha mavjud emas. Tez orada qo‘shiladi! 🙌")}
                className={`mt-6 w-full rounded-xl py-3 font-bold ${p.highlight ? "bg-white text-cobalt" : "bg-cobalt text-white"}`}
              >
                {p.cta}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
