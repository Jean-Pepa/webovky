import type { Lang } from "@/lib/homepage";
import { SCHEDULE, KIND_CLASS, KIND_LABEL, UI, fmtDay, groupSlots, pick } from "@/lib/schedule";

// Harmonogram čt → čt: jeden řádek na den, program jako malé barevné štítky
// (pilulky) podle typu. Sousední položky stejného typu tvoří blok s malým
// štítkem typu nad sebou (přednášky, kapely, djs…) — bez legendy. Finálový
// čtvrtek zvýrazněný + výzva na lístky.
export function Harmonogram({ lang }: { lang: Lang }) {
  return (
    <ol className="mt-5 divide-y divide-ink/10 overflow-hidden rounded-2xl bg-white ring-1 ring-ink/10">
      {SCHEDULE.map((d) => {
        const groups = groupSlots(d.slots);
        return (
          <li key={d.day} className={`flex flex-col gap-1.5 px-3 py-2.5 sm:flex-row sm:gap-4 ${d.finale ? "bg-amber-50" : ""}`}>
            <div className="flex shrink-0 flex-wrap items-baseline gap-x-2 gap-y-1 sm:w-24 sm:pt-4">
              <span className="font-display text-lg font-bold leading-none text-ink">{d.dow[lang]}</span>
              <span className="text-sm text-ink-soft">{fmtDay(d.day, lang)}</span>
              {d.finale && (
                <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[11px] font-bold uppercase leading-none tracking-wide text-white">{UI.finale[lang]}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                {groups.map((g, gi) => {
                  const label = KIND_LABEL[g.kind]?.[g.slots.length > 1 ? 1 : 0][lang];
                  return (
                    <div key={gi} className="min-w-0 max-w-full">
                      {/* štítek typu — jen jednou nad blokem; u „volno" žádný */}
                      <div className="text-[11px] leading-4 text-ink-soft">{label ?? "\u00A0"}</div>
                      <ul className="flex flex-wrap gap-1">
                        {g.slots.map((s, i) => (
                          <li
                            key={i}
                            className={`inline-flex max-w-full flex-wrap items-center gap-x-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${KIND_CLASS[s.kind]}`}
                          >
                            {s.from && (
                              <span className="whitespace-nowrap tabular-nums opacity-80">{s.to ? `${s.from}–${s.to}` : `${UI.from[lang]} ${s.from}`}</span>
                            )}
                            <span>{pick(s.title, lang)}</span>
                            {s.must && (
                              <span className="rounded-full bg-white/95 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-700">{UI.must[lang]}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
              {d.slots.some((s) => s.note) && (
                <div className="mt-1 text-xs text-ink-soft">{d.slots.map((s) => s.note?.[lang]).filter(Boolean).join(" · ")}</div>
              )}
              {d.finale && <div className="mt-1.5 text-xs font-semibold text-amber-900">🎟️ {UI.tickets[lang]}</div>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
