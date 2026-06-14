import type { Badge } from "@/data/catalog";

const STYLES: Record<Badge, { label: string; className: string }> = {
  akce: { label: "Akce", className: "bg-[var(--color-accent)] text-white" },
  novinka: { label: "Novinka", className: "bg-blue-600 text-white" },
  top: { label: "TOP", className: "bg-[var(--color-steel-800)] text-white" },
  doprodej: { label: "Doprodej", className: "bg-amber-500 text-white" },
};

export default function Badges({ badges }: { badges?: Badge[] }) {
  if (!badges || badges.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1">
      {badges.map((b) => (
        <span
          key={b}
          className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide ${STYLES[b].className}`}
        >
          {STYLES[b].label}
        </span>
      ))}
    </div>
  );
}

export function discountPercent(price: number, original?: number): number | null {
  if (!original || original <= price) return null;
  return Math.round((1 - price / original) * 100);
}
