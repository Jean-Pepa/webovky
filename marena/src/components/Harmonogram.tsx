import Link from "next/link";
import { Icon } from "@/components/Icons";
import { FinaleVideo } from "@/components/FinaleVideo";
import type { Lang } from "@/lib/homepage";
import { SCHEDULE, KIND_CLASS, KIND_LABEL, UI, fmtDay, groupSlots, pick, placeOf } from "@/lib/schedule";

// Harmonogram čt → čt: každý den jako karta („bublina") s tenkým světlým rámečkem,
// karty se střídají zlatavá / bílá (čtvrtek začíná zlatavou); program pod sebou jako štítky s barevným rámečkem — vždy začátek–konec, název a místo
// (aula / dvůr / Fléda). Sousední položky stejného typu mají malý štítek typu
// jen jednou nad sebou. Finálový čtvrtek: světle zlatá karta (gold-400 o 30 % světlejší)
// a videem světelných čar na pozadí (FinaleVideo, černá → zlatá); věta o lístkách
// samostatně pod harmonogramem jako stejné tlačítko, jaké je nahoře u merche
// (pulzující, odkaz na merch) — vzhled podle tématu webu (vegas / normální).
// `finaleBadge` / `finaleTitle` = stejné texty jako na kartě „Křest na Flédě" (jdou přepsat ve Správě webu).
export function Harmonogram({
  lang,
  vegas = false,
  finaleBadge,
  finaleTitle,
}: {
  lang: Lang;
  vegas?: boolean;
  finaleBadge: string;
  finaleTitle: string;
}) {
  return (
    <div id="harmonogram" className="mt-8 scroll-mt-6">
      {/* nadpis HARMONOGRAM — ve Vegas tématu hnědozlatý přechod jako „Jak týden probíhá" */}
      <p className={`text-sm font-bold uppercase tracking-wide ${vegas ? "vegas-ink-gold" : "text-ink-soft"}`}>{UI.heading[lang]}</p>
      <ol className="mt-2 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
        {SCHEDULE.map((d, di) => {
          const groups = groupSlots(d.slots);
          return (
            <li
              key={d.day}
              className={`rounded-xl p-3 ${
                d.finale
                  ? "relative isolate overflow-hidden border border-ink/30 bg-[#f8d370] md:col-span-2 lg:col-span-3"
                  : `border border-ink/30 ${di % 2 ? "bg-white" : "bg-gold-50"}`
              }`}
            >
              {d.finale && <FinaleVideo />}
              <div className="relative flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className={`font-display font-bold leading-none text-ink ${d.finale ? "text-2xl" : "text-lg"}`}>{d.dow[lang]}</span>
                <span className={`text-ink-soft ${d.finale ? "text-sm font-semibold" : "text-xs"}`}>{fmtDay(d.day, lang, d.dayTo)}</span>
              </div>
              {d.finale && (
                <div className="relative mt-2">
                  {/* stejný štítek a nadpis jako na kartě „Křest na Flédě" výš na stránce */}
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white ${
                      vegas ? "bg-gradient-to-r from-[#ff2ea6] to-[#a020f0] shadow-[0_0_14px_rgba(255,46,166,0.7)]" : "bg-marigold-600"
                    }`}
                  >
                    {finaleBadge}
                  </span>
                  <h3 className={`mt-2 flex items-center gap-2 font-display text-3xl font-bold tracking-tight sm:text-4xl ${vegas ? "vegas-ink-gold" : "text-ink"}`}>
                    <Icon name="star" className={`h-7 w-7 shrink-0 sm:h-8 sm:w-8 ${vegas ? "text-gold-600" : ""}`} /> {finaleTitle}
                  </h3>
                  <p className="mt-1.5 text-sm font-semibold text-ink sm:text-base">{UI.finaleNote[lang]}</p>
                </div>
              )}
              <div className="relative mt-1.5 space-y-1.5">
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
