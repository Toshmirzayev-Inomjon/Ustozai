"use client";

import { motion } from "framer-motion";
import StarLogo from "@/components/StarLogo";

const BUBBLES = [
  { me: false, text: "Salom Aziz! Bugun qaysi fandan boshlaymiz?" },
  { me: true, text: "Matematika qiyin..." },
  { me: false, text: "Hechqisi yo‘q, birga yechamiz! 7 × 8 nechchi bo‘ladi, ayt-chi?" },
  { me: true, text: "56!" },
  { me: false, text: "Barakalla! 🎉 Endi 56 ni 8 ga bo‘lsak-chi?" },
];

export default function PhonePreview() {
  return (
    <div className="relative mx-auto w-[280px]">
      <div className="rounded-[2.4rem] border-[10px] border-ink/90 bg-bg shadow-soft">
        <div className="overflow-hidden rounded-[1.7rem]">
          {/* header */}
          <div className="flex items-center gap-2.5 bg-surface px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cobalt">
              <StarLogo size={20} color="#fff" />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">Ustoz AI</p>
              <p className="text-[11px] text-teal">doim onlayn</p>
            </div>
          </div>
          {/* chat */}
          <div className="flex flex-col gap-2 bg-bg px-3 py-4">
            {BUBBLES.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.5, duration: 0.4 }}
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-[12.5px] ${
                  b.me
                    ? "self-end rounded-br-md bg-cobalt text-white"
                    : "self-start rounded-bl-md border border-border bg-surface text-ink"
                }`}
              >
                {b.text}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
