import Link from "next/link";
import { Icon } from "@/components/Icons";
import type { Lang } from "@/lib/homepage";
import { SCHEDULE, KIND_CLASS, KIND_LABEL, UI, fmtDay, groupSlots, pick, placeOf } from "@/lib/schedule";

// Harmonogram čt → čt: každý den jako karta („bublina") s tenkým světlým rámečkem,
// karty se střídají zlatavá / bílá (čtvrtek začíná zlatavou); program pod sebou jako štítky s barevným rámečkem — vždy začátek–konec, název a místo
// (aula / dvůr / Fléda). Sousední položky stejného typu mají malý štítek typu
// jen jednou nad sebou. Finálový čtvrtek výrazně zvýrazněný; věta o lístkách
// samostatně pod harmonogramem jako stejné tlačítko, jaké je nahoře u merche
// (pulzující, odkaz na merch) — vzhled podle tématu webu (vegas / normální).
export function Harmonogram({ lang, vegas = false }: { lang: Lang; vegas?: boolean }) {
  return (
    <div className="mt-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-ink-soft">{UI.heading[lang]}</p>
      <ol className="mt-2 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
        {SCHEDULE.map((d, di) => {
          const groups = groupSlots(d.slots);
          return (
            <li
              key={d.day}
              className={`rounded-xl p-3 ${
                d.finale
                  ? "border-[5px] border-gold-500 bg-gold-50 shadow-[0_0_0_6px_rgba(244,183,31,0.25)] md:col-span-2 lg:col-span-3"
                  : `border border-ink/30 ${di % 2 ? "bg-white" : "bg-gold-50"}`
              }`}
            >
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className={`font-display font-bold leading-none text-ink ${d.finale ? "text-2xl" : "text-lg"}`}>{d.dow[lang]}</span>
                <span className={`text-ink-soft ${d.finale ? "text-sm font-semibold" : "text-xs"}`}>{fmtDay(d.day, lang, d.dayTo)}</span>
              </div>
              {d.finale && (
                <div className="mt-1">
                  {/* velký nápis VELKÉ FINÁLE — v neon přechodu jako štítek na kartě Křest na Flédě */}
                  <p
                    className={`font-display text-3xl font-extrabold uppercase leading-none tracking-tight sm:text-4xl ${
                      vegas ? "bg-gradient-to-r from-[#ff2ea6] to-[#a020f0] bg-clip-text text-transparent" : "text-marigold-600"
                    }`}
                  >
                    {UI.finale[lang]}
                  </p>
                  <p className="mt-1.5 text-sm font-semibold text-ink sm:text-base">{UI.finaleNote[lang]}</p>
                </div>
              )}
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
      {/* Lístky — samostatně pod harmonogramem, na střed, stejné tlačítko jako „Kup si lístek a merch" nahoře */}
      <div className="mt-6 flex justify-center [text-shadow:none]">
        <Link
          href="/merch"
          className={
            vegas
              ? "merch-pulse vegas-btn inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff2ea6] to-[#a020f0] px-7 py-3.5 text-center font-display text-xl font-extrabold text-white ring-2 ring-white/40 hover:from-[#ff49b6] hover:to-[#b53aff] sm:text-2xl"
              : "merch-pulse inline-flex items-center gap-2 rounded-full bg-marigold-600 px-8 py-4 text-center font-display text-2xl font-extrabold text-white shadow-2xl ring-2 ring-white/40 hover:bg-marigold-700 sm:text-3xl"
          }
        >
          <Icon name="cart" className="h-6 w-6 shrink-0 text-white sm:h-7 sm:w-7" /> {UI.tickets[lang]}
        </Link>
      </div>
    </div>
  );
}
