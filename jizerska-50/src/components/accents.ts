// Statické mapy tříd — Tailwind v4 JIT musí vidět celé názvy tříd v kódu,
// proto je NELZE skládat dynamicky. Klíč = barevný token z dat.

export interface Accent {
  text: string;
  bgSoft: string;
  bgSolid: string;
  border: string;
  dot: string;
  ring: string;
}

export const ACCENT: Record<string, Accent> = {
  sky: {
    text: "text-sky-600",
    bgSoft: "bg-sky-050",
    bgSolid: "bg-sky",
    border: "border-sky",
    dot: "bg-sky",
    ring: "ring-sky",
  },
  leaf: {
    text: "text-leaf",
    bgSoft: "bg-leaf-050",
    bgSolid: "bg-leaf",
    border: "border-leaf",
    dot: "bg-leaf",
    ring: "ring-leaf",
  },
  violet: {
    text: "text-violet",
    bgSoft: "bg-violet-050",
    bgSolid: "bg-violet",
    border: "border-violet",
    dot: "bg-violet",
    ring: "ring-violet",
  },
  marigold: {
    text: "text-marigold",
    bgSoft: "bg-marigold-050",
    bgSolid: "bg-marigold",
    border: "border-marigold",
    dot: "bg-marigold",
    ring: "ring-marigold",
  },
  amber: {
    text: "text-amber",
    bgSoft: "bg-amber-050",
    bgSolid: "bg-amber",
    border: "border-amber",
    dot: "bg-amber",
    ring: "ring-amber",
  },
  cyan: {
    text: "text-cyan",
    bgSoft: "bg-cyan-050",
    bgSolid: "bg-cyan",
    border: "border-cyan",
    dot: "bg-cyan",
    ring: "ring-cyan",
  },
  ink: {
    text: "text-ink",
    bgSoft: "bg-paper2",
    bgSolid: "bg-ink",
    border: "border-ink-soft",
    dot: "bg-ink-soft",
    ring: "ring-ink-soft",
  },
};

export function accent(key: string): Accent {
  return ACCENT[key] ?? ACCENT.ink;
}
