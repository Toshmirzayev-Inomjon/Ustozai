"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import StarLogo from "@/components/StarLogo";
import { useAuth } from "@/lib/auth";

const NAV = [
  { href: "/bosh", label: "Bosh sahifa", icon: "🏠" },
  { href: "/ustoz", label: "AI ustoz", icon: "⭐" },
  { href: "/ovozli", label: "Ovozli suhbat", icon: "🎙️" },
  { href: "/fanlar", label: "Fanlar", icon: "📚" },
  { href: "/mashq", label: "Mashq", icon: "🎯" },
  { href: "/natijalar", label: "Natijalar", icon: "📊" },
  { href: "/tariflar", label: "Tariflar", icon: "💎" },
  { href: "/profil", label: "Profil", icon: "👤" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const onLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <aside className="flex w-full shrink-0 flex-col gap-1 border-border bg-surface md:h-dvh md:w-64 md:border-r md:p-4">
      {/* desktop brand */}
      <Link href="/bosh" className="mb-2 hidden items-center gap-2.5 px-2 py-2 md:flex">
        <StarLogo size={32} />
        <span className="font-head text-xl font-bold">Ustoz AI</span>
      </Link>

      {/* nav — mobile: horizontal scroll, desktop: vertical */}
      <nav className="no-scrollbar flex gap-1 overflow-x-auto border-b border-border p-2 md:flex-col md:overflow-visible md:border-0 md:p-0">
        {NAV.map((n) => {
          const active = pathname === n.href || pathname.startsWith(n.href + "/");
          return (
            <Link
              key={n.href}
              href={n.href}
              className={`flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-bold transition ${
                active ? "bg-cobalt text-white shadow-cobalt" : "text-ink hover:bg-cobalt-50"
              }`}
            >
              <span>{n.icon}</span>
              <span>{n.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto hidden md:block">
        <div className="rounded-xl bg-bg p-3">
          <p className="truncate text-sm font-bold">{user?.ism} {user?.familiya}</p>
          <p className="truncate text-xs text-muted">@{user?.username}</p>
          <button onClick={onLogout} className="mt-2 text-sm font-semibold text-clay">
            Chiqish
          </button>
        </div>
      </div>
    </aside>
  );
}
