"use client";

import { motion } from "framer-motion";
import StarLogo from "@/components/StarLogo";

type State = "idle" | "listening" | "speaking";

const WAVE = [16, 30, 48, 26, 60, 38, 70, 34, 52, 24, 44, 18];

export default function VoiceOrb({
  size = 220,
  state = "idle",
}: {
  size?: number;
  state?: State;
}) {
  const active = state !== "idle";
  return (
    <div className="flex flex-col items-center gap-7">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: size - i * 36,
              height: size - i * 36,
              background: i === 2 ? "#2A4BC4" : "rgba(42,75,196,0.10)",
            }}
            animate={
              active
                ? { scale: [1, 1.06, 1], opacity: [0.9, 1, 0.9] }
                : { scale: 1, opacity: 1 }
            }
            transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.2 }}
          >
            {i === 2 && (
              <div className="flex h-full w-full items-center justify-center">
                <StarLogo size={size * 0.32} color="#fff" />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="flex h-16 items-center gap-1.5">
        {WAVE.map((h, i) => (
          <motion.span
            key={i}
            className="w-1.5 rounded-full bg-saffron"
            style={{ height: h }}
            animate={active ? { scaleY: [0.3, 1, 0.3] } : { scaleY: 0.4 }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.06 }}
          />
        ))}
      </div>
    </div>
  );
}
