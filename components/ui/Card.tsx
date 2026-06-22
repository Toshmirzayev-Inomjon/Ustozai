import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[20px] border border-border bg-surface p-6 shadow-soft ${className}`}
    >
      {children}
    </div>
  );
}
