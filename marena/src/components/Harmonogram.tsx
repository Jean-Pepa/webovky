import Link from "next/link";
import type { Lang } from "@/lib/homepage";
import { SCHEDULE, KIND_CLASS, KIND_LABEL, UI, fmtDay, groupSlots, pick, placeOf } from "@/lib/schedule";

// Harmonogram čt → čt: každý den jako karta („bublina") s černým rámečkem,
// program pod sebou jako barevné štítky — vždy začátek–konec, název a místo
// (aula / dvůr / Fléda). Sousední položky stejného typu mají malý štítek typu
// jen jednou nad sebou. Finálový čtvrtek výrazně zvýrazněný; věta o lístkách
// samostatně pod harmonogramem jako blikající červený neon (odkaz na merch).
export function Harmonogram({ lang }: { lang: Lang }) {
  return (
    <div className="mt-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-ink-soft">{UI.heading[lang]}</p>
      <ol className="mt-2 grid gap-3 md:grid-cols-2">
        {SCHEDULE.map((d) => {
          const groups = groupSlots(d.slots);
          return (
            <li
              key={d.day}
              className={`rounded-2xl p-4 ${
                d.finale
                  ? "border-[3px] border-amber-500 bg-amber-50 shadow-[0_0_0_4px_rgba(245,158,11,0.22)] md:col-span-2"
                  : "border-2 border-ink bg-white"
              }`}
            >
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className={`font-display font-bold leading-none text-ink ${d.finale ? "text-3xl" : "text-xl"}`}>{d.dow[lang]}</span>
                <span className={`text-ink-soft ${d.finale ? "text-base font-semibold" : "text-sm"}`}>{fmtDay(d.day, lang, d.dayTo)}</span>
                {d.finale && (
                  <span className="ml-auto rounded-full bg-amber-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-[0_0_12px_rgba(245,158,11,0.7)]">
                    {UI.finale[lang]}
                  </span>
                )}
              </div>
              <div className="mt-2 space-y-2">
                {groups.map((g, gi) => {
                  // podnadpis (so/ne ve víkendu) + typ programu
                  const label = [g.sub?.[lang], KIND_LABEL[g.kind]?.[g.slots.length > 1 ? 1 : 0][lang]].filter(Boolean).join(" · ");
                  return (
                    <div key={gi}>
                      {/* štítek typu — jen jednou nad blokem; u „volno" žádný */}
                      {label && <div className="text-[11px] leading-4 text-ink-soft">{label}</div>}
                      <ul className="mt-0.5 flex flex-col items-start gap-1">
                        {g.slots.map((s, i) => {
                          const place = placeOf(s);
                          return (
                            <li
                              key={i}
                              className={`inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-0.5 rounded-full px-3 py-1 text-sm ${KIND_CLASS[s.kind]}`}
                            >
                              {s.from && (
                                <span className="whitespace-nowrap tabular-nums opacity-80">{s.to ? `${s.from}–${s.to}` : `${UI.from[lang]} ${s.from}`}</span>
                              )}
                              <span className="font-medium">{pick(s.title, lang)}</span>
                              {place && (
                                <span className="rounded-full bg-white/35 px-1.5 py-px text-[10px] font-bold uppercase tracking-wide">{place[lang]}</span>
                              )}
                              {s.must && (
                                <span className="rounded-full bg-white/95 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-700">{UI.must[lang]}</span>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
              </div>
              {d.slots.some((s) => s.note) && (
                <p className="mt-2 text-xs text-ink-soft">{d.slots.map((s) => s.note?.[lang]).filter(Boolean).join(" · ")}</p>
              )}
            </li>
          );
        })}
      </ol>
      {/* Lístky — samostatně pod harmonogramem, velké, na střed, blikající červený neon */}
      <Link
        href="/merch"
        className="neon-red-blink mt-6 block text-center font-display text-2xl font-extrabold uppercase tracking-wide sm:text-3xl"
      >
        🎟️ {UI.tickets[lang]}
      </Link>
    </div>
  );
}
