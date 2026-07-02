import type { EventKind } from "./types";

// Druhy událostí v kalendáři — barva tečky, štítku i podbarvení políčka v mřížce.
// Paleta v duchu FA VUT (šedá / černá / červená) + modrá a zelená pro odlišení.
export const KINDS: Record<EventKind, { label: string; emoji: string; dot: string; chip: string; cell: string }> = {
  schuzka: { label: "Schůzka", emoji: "💬", dot: "bg-ink-soft", chip: "bg-ink/5 text-ink-soft", cell: "bg-ink/[0.04]" },
  deadline: { label: "Deadline", emoji: "⏰", dot: "bg-marigold-600", chip: "bg-marigold-600 text-white", cell: "bg-marigold-50" },
  prednaska: { label: "Přednáška", emoji: "🎓", dot: "bg-plum-700", chip: "bg-plum-100 text-plum-700", cell: "bg-plum-100" },
  program: { label: "Program", emoji: "🎭", dot: "bg-leaf", chip: "bg-leaf/15 text-leaf-700", cell: "bg-leaf/12" },
  pruvod: { label: "Průvod", emoji: "🚩", dot: "bg-marigold-700", chip: "bg-marigold-700 text-white", cell: "bg-marigold-200/60" },
  fleda: { label: "Fléda", emoji: "🌟", dot: "bg-sky", chip: "bg-sky/10 text-sky", cell: "bg-sky/12" },
  jine: { label: "Jiné", emoji: "📍", dot: "bg-plum-400", chip: "bg-paper2 text-ink-soft", cell: "bg-paper2" },
};

export const KIND_ORDER: EventKind[] = ["schuzka", "deadline", "prednaska", "program", "pruvod", "fleda", "jine"];
