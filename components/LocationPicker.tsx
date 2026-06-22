"use client";

import { useState } from "react";
import { REGIONS } from "@/lib/professions";

export type LocationValue = {
  viloyat: string;
  manzil: string;
  lat: number | null;
  lng: number | null;
};

// Joylashuvni tanlash: viloyat + manzil + "Mening joylashuvim" (geolokatsiya).
// OpenStreetMap'dan bepul reverse-geocode (Nominatim, kalit shart emas) + xarita preview.
// TODO(map): xohlasangiz Leaflet bilan interaktiv xarita qo'shish mumkin.
export default function LocationPicker({
  value,
  onChange,
}: {
  value: LocationValue;
  onChange: (v: LocationValue) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setMsg("Brauzer geolokatsiyani qo‘llab-quvvatlamaydi.");
      return;
    }
    setLoading(true);
    setMsg("");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        let manzil = value.manzil;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=uz`,
          );
          const data = await res.json();
          if (data?.display_name) manzil = String(data.display_name).split(",").slice(0, 3).join(",");
        } catch {
          /* manzilni qo'lda kiritadi */
        }
        onChange({ ...value, lat: latitude, lng: longitude, manzil });
        setLoading(false);
      },
      () => {
        setMsg("Joylashuvga ruxsat berilmadi.");
        setLoading(false);
      },
    );
  };

  return (
    <div className="space-y-3">
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-ink">Viloyat</span>
        <select
          value={value.viloyat}
          onChange={(e) => onChange({ ...value, viloyat: e.target.value })}
          className="w-full rounded-xl border-2 border-border bg-surface px-3.5 py-3 text-[15px] outline-none focus:border-cobalt/50"
        >
          <option value="">Tanla...</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-ink">Manzil (ko‘cha, mahalla)</span>
        <input
          value={value.manzil}
          onChange={(e) => onChange({ ...value, manzil: e.target.value })}
          placeholder="Masalan: Samarqand, Registon ko‘chasi"
          className="w-full rounded-xl border-2 border-border bg-surface px-3.5 py-3 text-[15px] outline-none focus:border-cobalt/50"
        />
      </label>

      <button
        type="button"
        onClick={useMyLocation}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-xl bg-cobalt-50 px-4 py-2.5 text-sm font-bold text-cobalt disabled:opacity-60"
      >
        📍 {loading ? "Aniqlanmoqda..." : "Mening joylashuvim"}
      </button>
      {msg && <p className="text-sm text-clay">{msg}</p>}

      {value.lat != null && value.lng != null && (
        <div className="overflow-hidden rounded-xl border border-border">
          <iframe
            title="Xarita"
            className="h-44 w-full"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${value.lng - 0.02}%2C${
              value.lat - 0.02
            }%2C${value.lng + 0.02}%2C${value.lat + 0.02}&marker=${value.lat}%2C${value.lng}`}
          />
        </div>
      )}
    </div>
  );
}
