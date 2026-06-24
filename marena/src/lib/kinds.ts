import type { EventKind } from "./types";

// Druhy událostí v kalendáři — barva tečky, štítku i podbarvení políčka v mřížce.
export const KINDS: Record<EventKind, { label: string; emoji: string; dot: string; chip: string; cell: string }> = {
  schuzka: { label: "Schůzka", emoji: "💬", dot: "bg-sky", chip: "bg-sky/10 text-sky", cell: "bg-sky/10" },
  deadline: { label: "Deadline", emoji: "⏰", dot: "bg-red-500", chip: "bg-red-100 text-red-700", cell: "bg-red-50" },
  prednaska: { label: "Přednáška", emoji: "🎓", dot: "bg-marigold-500", chip: "bg-marigold-100 text-marigold-800", cell: "bg-marigold-100" },
  program: { label: "Program", emoji: "🎭", dot: "bg-leaf", chip: "bg-leaf/15 text-leaf-700", cell: "bg-leaf/12" },
  pruvod: { label: "Průvod", emoji: "🚩", dot: "bg-marigold-700", chip: "bg-marigold-100 text-marigold-800", cell: "bg-marigold-200/60" },
  fleda: { label: "Fléda", emoji: "🌟", dot: "bg-sky", chip: "bg-sky/10 text-sky", cell: "bg-sky/12" },
  jine: { label: "Jiné", emoji: "📍", dot: "bg-ink-soft", chip: "bg-black/5 text-ink-soft", cell: "bg-black/[0.04]" },
};

export const KIND_ORDER: EventKind[] = ["schuzka", "deadline", "prednaska", "program", "pruvod", "fleda", "jine"];
