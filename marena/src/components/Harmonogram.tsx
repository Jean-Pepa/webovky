import type { Lang } from "@/lib/homepage";
import { SCHEDULE, KIND_CLASS, KIND_LABEL, UI, fmtDay, pick, type SlotKind } from "@/lib/schedule";

// Harmonogram čtvrtek → čtvrtek pod nadpisem „Co tě na Mařeně čeká" (obě témata
// webu). Dny jako karty, program jako barevné štítky podle legendy; finálový
// čtvrtek zvýrazněný + upozornění na lístky na Flédu.
export function Harmonogram({ lang }: { lang: Lang }) {
  const legend = (Object.keys(KIND_LABEL) as SlotKind[]).filter((k) => k !== "volno");
  return (
    <div className="mt-6">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ink-soft">{UI.range[lang]}</p>
      <ol className="mt-3 grid gap-3 md:grid-cols-2">
        {SCHEDULE.map((d) => (
          <li
            key={d.day}
            className={`rounded-2xl p-4 ring-1 ${d.finale ? "bg-amber-50 ring-amber-400 md:col-span-2" : "bg-white ring-ink/10"}`}
          >
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-display text-2xl font-bold text-ink">{d.dow[lang]}</span>
              <span className="text-ink-soft">{fmtDay(d.day, lang)}</span>
              {d.finale && (
                <span className="ml-auto rounded-full bg-amber-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">{UI.finale[lang]}</span>
              )}
            </div>
            <ul className="mt-3 flex flex-wrap gap-2">
              {d.slots.map((s, i) => (
                <li
                  key={i}
                  className={`inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-0.5 rounded-full px-3 py-1.5 text-sm font-medium ${KIND_CLASS[s.kind]}`}
                >
                  {s.from && <span className="tabular-nums opacity-80">{s.to ? `${s.from}–${s.to}` : `${UI.from[lang]} ${s.from}`}</span>}
                  <span>{pick(s.title, lang)}</span>
                  {s.must && (
                    <span className="rounded-full bg-white/95 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-red-700">{UI.must[lang]}</span>
                  )}
                </li>
              ))}
            </ul>
            {d.slots.some((s) => s.note) && (
              <p className="mt-2 text-xs text-ink-soft">{d.slots.map((s) => s.note?.[lang]).filter(Boolean).join(" · ")}</p>
            )}
            {d.finale && <p className="mt-3 rounded-xl bg-amber-500/15 px-3 py-2 text-sm font-semibold text-amber-900">🎟️ {UI.tickets[lang]}</p>}
          </li>
        ))}
      </ol>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-semibold uppercase tracking-wide text-ink-soft">{UI.legend[lang]}:</span>
        {legend.map((k) => (
          <span key={k} className={`rounded-full px-2.5 py-1 font-medium ${KIND_CLASS[k]}`}>
            {KIND_LABEL[k][lang]}
          </span>
        ))}
      </div>
    </div>
  );
}
