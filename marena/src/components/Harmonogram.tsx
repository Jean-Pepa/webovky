import type { Lang } from "@/lib/homepage";
import { SCHEDULE, KIND_DOT, UI, fmtDay, pick } from "@/lib/schedule";

// Kompaktní harmonogram čt → čt: jeden řádek na den, jen začátky, barevná tečka
// podle typu programu. Finálový čtvrtek zvýrazněný (povinné pasování + lístky).
export function Harmonogram({ lang }: { lang: Lang }) {
  return (
    <ol className="mt-5 divide-y divide-ink/10 overflow-hidden rounded-2xl bg-white ring-1 ring-ink/10">
      {SCHEDULE.map((d) => (
        <li
          key={d.day}
          className={`flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:gap-4 ${d.finale ? "bg-amber-50" : ""}`}
        >
          <div className="flex shrink-0 items-baseline gap-2 sm:w-24">
            <span className="font-display text-lg font-bold text-ink">{d.dow[lang]}</span>
            <span className="text-sm text-ink-soft">{fmtDay(d.day, lang)}</span>
          </div>
          <div className="min-w-0 text-sm leading-relaxed text-ink">
            {d.finale && (
              <span className="mr-2 rounded-full bg-amber-500 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">{UI.finale[lang]}</span>
            )}
            {d.slots.map((s, i) => (
              <span key={i}>
                {i > 0 && <span className="mx-1.5 text-ink-soft/50">·</span>}
                {/* tečka + čas drží pohromadě (zalomení až před názvem) */}
                <span className="whitespace-nowrap">
                  <span className={`mr-1 inline-block h-2 w-2 rounded-full align-middle ${KIND_DOT[s.kind]}`} />
                  {s.from && <span className="mr-1 tabular-nums text-ink-soft">{s.from}</span>}
                </span>
                <span className={s.must ? "font-semibold" : ""}>{pick(s.title, lang)}</span>
                {s.must && (
                  <span className="ml-1 rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">{UI.must[lang]}</span>
                )}
              </span>
            ))}
            {d.slots.some((s) => s.note) && (
              <div className="mt-0.5 text-xs text-ink-soft">{d.slots.map((s) => s.note?.[lang]).filter(Boolean).join(" · ")}</div>
            )}
            {d.finale && <div className="mt-1 text-xs font-semibold text-amber-900">🎟️ {UI.tickets[lang]}</div>}
          </div>
        </li>
      ))}
    </ol>
  );
}
