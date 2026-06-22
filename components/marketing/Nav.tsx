"use client";

import Link from "next/link";
import { useState } from "react";
import StarLogo from "@/components/StarLogo";
import { ButtonLink } from "@/components/ui/Button";

const LINKS = [
  { href: "#imkoniyatlar", label: "Imkoniyatlar" },
  { href: "#qanday", label: "Qanday ishlaydi" },
  { href: "#ovoz", label: "Ovozli suhbat" },
  { href: "/kirish", label: "Kirish" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5">
        <Link href="/" className="flex items-center gap-2.5">
          <StarLogo size={34} />
          <span className="font-head text-xl font-bold">Ustoz AI</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-3.5 py-2 text-sm font-bold text-muted transition hover:bg-cobalt-50 hover:text-cobalt"
            >
              {l.label}
            </Link>
          ))}
          <ButtonLink href="#yuklab-olish" className="ml-2 h-10 px-5 text-sm">
            APK yuklash
          </ButtonLink>
        </nav>

        <button
          className="rounded-lg p-2 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menyu"
        >
          <div className="space-y-1.5">
            <span className="block h-0.5 w-6 bg-ink" />
            <span className="block h-0.5 w-6 bg-ink" />
            <span className="block h-0.5 w-6 bg-ink" />
          </div>
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-border px-5 py-3 md:hidden">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 font-semibold text-ink hover:bg-cobalt-50"
            >
              {l.label}
            </Link>
          ))}
          <ButtonLink href="#yuklab-olish" onClick={() => setOpen(false)} className="mt-1">
            APK yuklash
          </ButtonLink>
        </nav>
      )}
    </header>
  );
}
