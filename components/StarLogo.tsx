import { colors } from "@/lib/theme";

type Props = {
  size?: number;
  color?: string;
  className?: string;
};

/**
 * Ustoz AI logosi — 8 qirrali yulduz: ikkita ustma-ust dumaloq kvadrat
 * (biri 45° burilgan). Samarqand koshinidan ilhomlangan.
 */
export default function StarLogo({ size = 48, color = colors.cobalt, className }: Props) {
  const s = 64;
  const offset = (100 - s) / 2;
  const r = 16;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-hidden="true">
      <rect x={offset} y={offset} width={s} height={s} rx={r} ry={r} fill={color} />
      <g transform="rotate(45 50 50)">
        <rect x={offset} y={offset} width={s} height={s} rx={r} ry={r} fill={color} opacity={0.85} />
      </g>
    </svg>
  );
}
