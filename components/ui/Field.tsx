import type { ComponentProps } from "react";

type Props = ComponentProps<"input"> & { label: string };

export function Field({ label, className = "", ...rest }: Props) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-ink">{label}</span>
      <input
        className={`w-full rounded-xl border-2 border-border bg-surface px-3.5 py-3 text-[15px] text-ink outline-none transition focus:border-cobalt/50 focus:ring-4 focus:ring-cobalt-50 ${className}`}
        {...rest}
      />
    </label>
  );
}
