import type { ElementCategory } from "@/lib/store";
import { ELEMENT_CATEGORIES, ELEMENT_CATEGORY_COLORS, ELEMENT_CATEGORY_ORDER } from "@/lib/elements";

// Vrstvy půdorysu (elektro, voda, topení…) — barva, počet prvků, zapnout / vypnout
export function LayerToggles({
  counts,
  hidden,
  onToggle,
  onShowAll,
  className = "",
}: {
  counts: Record<ElementCategory, number>;
  hidden: ElementCategory[];
  onToggle: (cat: ElementCategory) => void;
  onShowAll: () => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Vrstvy půdorysu">
        {ELEMENT_CATEGORY_ORDER.map((cat) => {
          const on = !hidden.includes(cat);
          const color = ELEMENT_CATEGORY_COLORS[cat];
          const n = counts[cat] ?? 0;
          return (
            <button
              key={cat}
              type="button"
              aria-pressed={on}
              onClick={() => onToggle(cat)}
              title={on ? `Skrýt vrstvu ${ELEMENT_CATEGORIES[cat]}` : `Zobrazit vrstvu ${ELEMENT_CATEGORIES[cat]}`}
              className={`inline-flex min-h-10 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition ${
                on
                  ? "border-stone-300 bg-white text-stone-800 hover:bg-stone-50"
                  : "border-stone-200 bg-stone-50 text-stone-400 hover:bg-stone-100"
              } ${n === 0 && on ? "opacity-70" : ""}`}
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: on ? color : "transparent", border: `2px solid ${color}` }}
                aria-hidden
              />
              <span className={on ? "" : "line-through"}>{ELEMENT_CATEGORIES[cat]}</span>
              <span className={on ? "text-stone-400" : "text-stone-300"}>{n}</span>
            </button>
          );
        })}
        {hidden.length > 0 && (
          <button
            type="button"
            onClick={onShowAll}
            className="btn-ghost btn-sm min-h-10 text-teal-700"
          >
            Zobrazit vše
          </button>
        )}
      </div>
    </div>
  );
}
