import type { EventKind } from "./types";

// Druhy událostí v kalendáři — barva + štítek.
export const KINDS: Record<EventKind, { label: string; emoji: string; dot: string; chip: string }> = {
  schuzka: { label: "Schůzka", emoji: "💬", dot: "bg-sky", chip: "bg-sky/10 text-sky" },
  deadline: { label: "Deadline", emoji: "⏰", dot: "bg-plum-500", chip: "bg-plum-100 text-plum-700" },
  prednaska: { label: "Přednáška", emoji: "🎓", dot: "bg-marigold-500", chip: "bg-marigold-100 text-marigold-800" },
  program: { label: "Program", emoji: "🎭", dot: "bg-leaf", chip: "bg-leaf/15 text-leaf-700" },
  pruvod: { label: "Průvod", emoji: "🚩", dot: "bg-marigold-700", chip: "bg-marigold-100 text-marigold-800" },
  fleda: { label: "Fléda", emoji: "🌟", dot: "bg-plum-600", chip: "bg-plum-100 text-plum-700" },
  jine: { label: "Jiné", emoji: "📍", dot: "bg-ink-soft", chip: "bg-black/5 text-ink-soft" },
};

export const KIND_ORDER: EventKind[] = ["schuzka", "deadline", "prednaska", "program", "pruvod", "fleda", "jine"];
