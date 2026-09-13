import Link from "next/link";
import type { Lang } from "@/lib/homepage";
import { SCHEDULE, KIND_CLASS, KIND_LABEL, UI, fmtDay, groupSlots, pick, placeOf } from "@/lib/schedule";

// Harmonogram čt → čt: každý den jako karta („bublina") s tenkým světlým rámečkem,
// program pod sebou jako štítky s barevným rámečkem — vždy začátek–konec, název a místo
// (aula / dvůr / Fléda). Sousední položky stejného typu mají malý štítek typu
// jen jednou nad sebou. Finálový čtvrtek výrazně zvýrazněný; věta o lístkách
// samostatně pod harmonogramem jako blikající červený neon (odkaz na merch).
export function Harmonogram({ lang }: { lang: Lang }) {
  return (
    <div className="mt-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-ink-soft">{UI.heading[lang]}</p>
      <ol className="mt-2 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
        {SCHEDULE.map((d) => {
          const groups = groupSlots(d.slots);
          return (
            <li
              key={d.day}
              className={`rounded-xl p-3 ${
                d.finale
                  ? "border-[3px] border-gold-500 bg-gold-50 shadow-[0_0_0_4px_rgba(244,183,31,0.25)] md:col-span-2 lg:col-span-3"
                  : "border border-ink/15 bg-white"
              }`}
            >
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className={`font-display font-bold leading-none text-ink ${d.finale ? "text-2xl" : "text-lg"}`}>{d.dow[lang]}</span>
                <span className={`text-ink-soft ${d.finale ? "text-sm font-semibold" : "text-xs"}`}>{fmtDay(d.day, lang, d.dayTo)}</span>
                {d.finale && (
                  <span className="ml-auto rounded-full bg-gradient-to-r from-[#ff2ea6] to-[#a020f0] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white shadow-[0_0_12px_rgba(255,46,166,0.6)]">
                    {UI.finale[lang]}
                  </span>
                )}
              </div>
              <div className="mt-1.5 space-y-1.5">
                {groups.map((g, gi) => {
                  // podnadpis (so/ne ve víkendu) + typ programu
                  const label = [g.sub?.[lang], KIND_LABEL[g.kind]?.[g.slots.length > 1 ? 1 : 0][lang]].filter(Boolean).join(" · ");
                  return (
                    <div key={gi}>
                      {/* štítek typu — jen jednou nad blokem; u „volno" žádný */}
                      {label && <div className="text-[10px] leading-4 text-ink-soft">{label}</div>}
                      <ul className="flex flex-col items-start gap-1">
                        {g.slots.map((s, i) => {
                          const place = placeOf(s);
                          return (
                            <li
                              key={i}
                              className={`inline-flex max-w-full flex-wrap items-center gap-x-1.5 gap-y-0.5 rounded-full border-2 bg-white px-2.5 py-0.5 text-xs text-ink ${KIND_CLASS[s.kind]}`}
                            >
                              {s.from && (
                                <span className="whitespace-nowrap tabular-nums text-ink-soft">{s.to ? `${s.from}–${s.to}` : `${UI.from[lang]} ${s.from}`}</span>
                              )}
                              <span className="font-medium">{pick(s.title, lang)}</span>
                              {place && (
                                <span className="rounded-full bg-paper2 px-1.5 py-px text-[9px] font-bold uppercase tracking-wide text-ink-soft">{place[lang]}</span>
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
                <p className="mt-1.5 text-[11px] text-ink-soft">{d.slots.map((s) => s.note?.[lang]).filter(Boolean).join(" · ")}</p>
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
