import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "white";
type Common = { variant?: Variant; className?: string; children: ReactNode };

const base =
  "inline-flex items-center justify-center gap-2 rounded-2xl px-6 h-12 font-bold text-[15px] transition active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary: "bg-cobalt text-white shadow-cobalt hover:brightness-110",
  secondary: "bg-cobalt-50 text-cobalt hover:bg-cobalt-50/70",
  ghost: "border-2 border-border text-ink hover:bg-cobalt-50/40",
  white: "bg-white text-cobalt shadow-soft hover:brightness-95",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...rest
}: Common & ComponentProps<"button">) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  className = "",
  children,
  ...rest
}: Common & ComponentProps<typeof Link>) {
  return (
    <Link className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </Link>
  );
}
