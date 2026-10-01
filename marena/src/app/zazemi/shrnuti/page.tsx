"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { PageTitle } from "@/components/PageTitle";
import { useStore } from "@/lib/store";
import { isAdmin } from "@/lib/admin";
import { buildYearSummary, summaryText, type YearSummary } from "@/lib/summary";
import { DonutChart, SplitBar, SignedBars, StatTiles, ColumnChart, BarList, VIZ, VIZ_ORD, VIZ_OTHER } from "@/components/Charts";
import { fmtCZK, fmtDate } from "@/lib/format";
import { copyText } from "@/components/CopyContact";
import { flash } from "@/components/Flash";
import { ArchiveModal } from "@/components/ArchiveModal";
import { Icon } from "@/components/Icons";
import type { AnalyticsSummary } from "@/lib/analytics";
import { isTicketName } from "@/lib/merch";

// Závěrečné shrnutí ročníku — všechna čísla na jedné stránce, jen pro správce.
// Výpočty jsou v lib/summary.ts (stejné pomocníky jako Finance a Lístky & merch).

const nf = (n: number) => Math.round(n).toLocaleString("cs-CZ");
const sgn = (n: number) => `${n >= 0 ? "+" : "−"}${fmtCZK(Math.abs(n))}`;
const pct = (a: number, b: number) => (b > 0 ? `${Math.round((a / b) * 100)} %` : "—");
const shortDay = (iso: string) => `${Number(iso.slice(8, 10))}.${Number(iso.slice(5, 7))}.`;
const CAT_LABEL: Record<string, string> = { merch: "🎟️ Lístky & merch", bar: "🍺 Bar", kuchyně: "🍽️ Kuchyně", kasa: "🧰 Rozdíl kas", vyber: "💰 Výběr" };
const catLabel = (c: string) => CAT_LABEL[c] ?? c;

function Section({ id, title, sub, children }: { id: string; title: string; sub?: string; children: ReactNode }) {
  return (
    <section id={id} className="card scroll-mt-24 p-4 sm:p-5">
      <div className="mb-3">
        <h2 className="eyebrow">{title}</h2>
        {sub && <p className="mt-0.5 text-xs text-ink-soft">{sub}</p>}
      </div>
      {children}
    </section>
  );
}

function Hero({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: "good" | "bad" }) {
  return (
    <div className="card p-4">
      <p className="eyebrow">{label}</p>
      <p className={`mt-1 font-display text-3xl font-bold leading-tight ${tone === "good" ? "text-leaf-700" : tone === "bad" ? "text-red-600" : "text-ink"}`}>{value}</p>
      {sub && <p className="text-xs text-ink-soft">{sub}</p>}
    </div>
  );
}

export default function ShrnutiPage() {
  const { me, currentYear, db } = useStore();
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [web, setWeb] = useState<AnalyticsSummary | null>(null);
  const s = useMemo(() => (currentYear ? buildYearSummary(currentYear) : null), [currentYear]);
  // Předchozí ročník pro meziroční srovnání (jen když má nějaká data).
  const prev = useMemo(() => {
    if (!db || !currentYear) return null;
    const older = db.years.filter((y) => y.id < currentYear.id).sort((a, b) => b.id.localeCompare(a.id))[0];
    if (!older || (!(older.finances ?? []).length && !(older.merchOrders ?? []).length)) return null;
    return buildYearSummary(older);
  }, [db, currentYear]);

  useEffect(() => {
    let alive = true;
    fetch("/api/analytics/summary?days=400", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => alive && j && setWeb(j as AnalyticsSummary))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  if (!isAdmin(me)) {
    return (
      <div className="space-y-4">
        <PageTitle>Závěrečné shrnutí</PageTitle>
        <div className="empty-state">Tahle sekce je jen pro správce.</div>
      </div>
    );
  }
  if (!currentYear || !s) return <div className="empty-state">Žádný ročník.</div>;

  const t = s.tickets;
  const kinds = [
    { label: "🎟️ Lístky", value: s.sales.pos.ticketRevenue, profit: s.sales.pos.ticketProfit, color: VIZ[0] },
    { label: "🍽️ Jídlo", value: s.sales.days.reduce((a, d) => a + d.food, 0), profit: 0, color: VIZ[1] },
    { label: "🍺 Pití", value: s.sales.days.reduce((a, d) => a + d.drink, 0), profit: 0, color: VIZ[2] },
    { label: "🛍️ Merch", value: s.sales.pos.merchRevenue, profit: s.sales.pos.merchProfit, color: VIZ[3] },
  ];
  const nav = [
    ["finance", "💰 Finance"],
    ["prodej", "🧾 Prodej"],
    ["listky", "🎟️ Lístky"],
    ["kasy", "🧰 Kasy"],
    ["merch", "🛍️ Merch"],
    ["tym", "👥 Tým"],
    ["program", "📅 Program"],
    ["web", "🌐 Web"],
    ...(prev ? [["mezirocne", "📈 Meziročně"]] : []),
  ];
  const emoji = (name: string, cat: string) => (cat === "merch" ? (isTicketName(name) ? "🎟️" : "🛍️") : cat === "kuchyně" ? "🍽️" : cat === "bar" ? "🍺" : "🧾");

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <PageTitle>Závěrečné shrnutí</PageTitle>
          <p className="mt-1 text-sm text-ink-soft">
            {s.year.label}
            {s.year.theme ? ` · ${s.year.theme}` : ""}
            {s.year.fledaDate ? ` · Fléda ${fmtDate(s.year.fledaDate)}` : ""} — všechna čísla ročníku na jednom místě.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            className="btn-secondary"
            onClick={async () => {
              const ok = await copyText(summaryText(s));
              flash(ok ? "Souhrn zkopírován" : "Kopírování se nepovedlo", ok ? "📋" : "⚠️");
            }}
          >
            📋 Kopírovat souhrn
          </button>
          <button className="btn-primary" onClick={() => setArchiveOpen(true)}>
            <Icon name="download" className="h-4 w-4" /> PDF archiv
          </button>
        </div>
      </div>

      {/* Rozcestník sekcí */}
      <div className="flex flex-wrap gap-1.5">
        {nav.map(([id, label]) => (
          <a key={id} href={`#${id}`} className="chip hover:bg-gold-100">
            {label}
          </a>
        ))}
      </div>

      {/* Hlavní čísla */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Hero label="Bilance ročníku" value={sgn(s.finance.bilance)} sub={`příjmy ${fmtCZK(s.finance.prijmy)} · výdaje ${fmtCZK(s.finance.vydaje)}`} tone={s.finance.bilance >= 0 ? "good" : "bad"} />
        <Hero label="Tržba z prodeje" value={fmtCZK(s.sales.total)} sub={`zisk ${sgn(s.sales.profit)} · marže ${pct(s.sales.profit, s.sales.total)}`} />
        <Hero label="Lístků prodáno" value={`${nf(t.total)} ks`} sub={`${t.web.people} lidí s rezervací · ${t.places.onsiteBar.qty + t.places.onsiteFleda.qty} bez rezervace`} />
        <Hero label="Účtenek" value={nf(s.sales.count)} sub={`průměr ${fmtCZK(s.sales.avg)} · ${s.sales.days.length} ${s.sales.days.length === 1 ? "den" : s.sales.days.length < 5 ? "dny" : "dní"} prodeje`} />
      </div>

      {/* ---------- FINANCE ---------- */}
      <Section id="finance" title="💰 Finance celkem" sub="Stejná čísla jako Finance → Všechny finance: příjmy včetně nevráceného výběru, výdaje z pokladní knihy.">
        <StatTiles
          stats={[
            { label: "Příjmy", value: fmtCZK(s.finance.prijmy), sub: `z toho výběr v balíku ${fmtCZK(s.finance.vyber.inPool)}` },
            { label: "Výdaje", value: fmtCZK(s.finance.vydaje) },
            { label: "Bilance", value: sgn(s.finance.bilance), tone: s.finance.bilance >= 0 ? "good" : "bad" },
            { label: "Výběr vybráno", value: fmtCZK(s.finance.vyber.total), sub: `${s.finance.vyber.paidCount}/${s.finance.vyber.count} lidí zaplatilo` },
            { label: "Vráceno z výběru", value: fmtCZK(s.finance.vyber.returned) },
            { label: "Rozdíl kas", value: sgn(s.sales.cashDiff), sub: "přebytky a manka z uzávěrek", tone: s.sales.cashDiff < 0 ? "bad" : undefined },
          ]}
        />
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <DonutChart title="Příjmy podle kategorie" format={fmtCZK} items={s.finance.incomeByCat.map((c) => ({ label: catLabel(c.label), value: c.value }))} note="Zapsané příjmy v pokladní knize (bez výběru)." />
          <DonutChart title="Výdaje podle kategorie" format={fmtCZK} items={s.finance.expenseByCat.map((c) => ({ label: catLabel(c.label), value: c.value }))} />
        </div>
      </Section>

      {/* ---------- PRODEJ ---------- */}
      <Section id="prodej" title="🧾 Prodej (kasa, bar, kuchyně, lístky, merch)" sub="Z účtenek v Prodeji. Zisk = tržba − prodané kusy × nákupka; položky bez nákupky zisk nadsazují.">
        <StatTiles
          stats={[
            { label: "Tržba", value: fmtCZK(s.sales.total) },
            { label: "Zisk", value: sgn(s.sales.profit), sub: `náklady −${fmtCZK(s.sales.cost)}`, tone: s.sales.profit >= 0 ? "good" : "bad" },
            { label: "Marže", value: pct(s.sales.profit, s.sales.total), sub: s.sales.unknownQty > 0 ? `${s.sales.unknownQty} ks bez nákupky` : "z tržby" },
            { label: "QR / hotově", value: `${pct(s.sales.qr, s.sales.qr + s.sales.cash)} / ${pct(s.sales.cash, s.sales.qr + s.sales.cash)}`, sub: `${fmtCZK(s.sales.qr)} / ${fmtCZK(s.sales.cash)}` },
            { label: "Prodaných kusů", value: nf(s.sold.qty), sub: `${s.sold.rows.length} položek` },
            { label: "Nejsilnější den", value: s.sales.busiestDay ? shortDay(s.sales.busiestDay.day) : "—", sub: s.sales.busiestDay ? `${fmtCZK(s.sales.busiestDay.total)} · špička ${s.sales.busiestHour}–${s.sales.busiestHour + 1} h` : undefined },
          ]}
        />
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <ColumnChart
            title="Tržba po dnech"
            format={fmtCZK}
            categories={s.sales.days.map((d) => shortDay(d.day))}
            series={[
              { key: "tickets", label: "Lístky", color: VIZ[0] },
              { key: "food", label: "Jídlo", color: VIZ[1] },
              { key: "drink", label: "Pití", color: VIZ[2] },
              { key: "merch", label: "Merch", color: VIZ[3] },
            ]}
            data={s.sales.days.map((d) => [d.tickets, d.food, d.drink, d.merch])}
          />
          <ColumnChart
            title="Prodej podle hodiny"
            format={fmtCZK}
            categories={s.sales.byHour.map((_, h) => `${h}h`)}
            series={[
              { key: "qr", label: "QR", color: VIZ[0] },
              { key: "cash", label: "Hotově", color: VIZ[1] },
            ]}
            data={s.sales.byHour.map((h) => [h.qr, h.cash])}
            labelEvery={3}
            note="Součet přes všechny dny podle času zápisu prodeje."
          />
          <DonutChart title="Tržba podle druhu" format={fmtCZK} sort={false} items={kinds.map((k) => ({ label: k.label, value: k.value, color: k.color }))} />
          <SignedBars
            title="Zisk podle druhu"
            format={(n) => sgn(n)}
            rows={[
              { label: "🎟️ Lístky", value: s.sales.pos.ticketProfit },
              { label: "🍽️🍺 Jídlo & pití", value: s.sales.pos.profit - s.sales.pos.cashDiff },
              { label: "🛍️ Merch", value: s.sales.pos.merchProfit },
            ]}
            note="Jídlo & pití = tržba baru a kuchyně − suroviny podle receptur."
          />
          <BarList title="Top položky podle tržby" format={fmtCZK} rows={s.sold.rows.map((r) => ({ label: `${emoji(r.name, r.cat)} ${r.name}`, value: r.revenue, sub: r.unitCost != null ? `zisk ${sgn(r.profit)}` : "bez nákupky" }))} />
          <BarList title="Top položky podle kusů" unit="ks" rows={s.sold.rows.map((r) => ({ label: `${emoji(r.name, r.cat)} ${r.name}`, value: r.qty, sub: fmtCZK(r.revenue) }))} />
          <ColumnChart
            title="Účtenek po dnech"
            unit="účtenek"
            categories={s.sales.days.map((d) => shortDay(d.day))}
            series={[{ key: "n", label: "Účtenky", color: VIZ[2] }]}
            data={s.sales.days.map((d) => [d.count])}
          />
          <SplitBar
            title="QR vs. hotově"
            format={fmtCZK}
            parts={[
              { label: "QR platba", value: s.sales.qr, color: VIZ[0] },
              { label: "Hotově", value: s.sales.cash, color: VIZ[1] },
              { label: "Bez uvedení", value: Math.max(0, s.sales.total - s.sales.qr - s.sales.cash), color: VIZ_OTHER },
            ]}
          />
        </div>
        {/* Všechny prodané položky */}
        {s.sold.rows.length > 0 && (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] font-medium uppercase tracking-wide text-ink-soft">
                  <th className="py-1 font-medium">Položka</th>
                  <th className="py-1 text-right font-medium">Prodáno</th>
                  <th className="py-1 text-right font-medium">Tržba</th>
                  <th className="py-1 text-right font-medium">Nákupka/ks</th>
                  <th className="py-1 text-right font-medium">Zisk</th>
                </tr>
              </thead>
              <tbody>
                {s.sold.rows.map((r) => (
                  <tr key={r.name} className="border-t border-ink/[0.06]">
                    <td className="py-1 pr-2">
                      {emoji(r.name, r.cat)} {r.name}
                    </td>
                    <td className="whitespace-nowrap py-1 text-right tabular-nums">{r.qty} ks</td>
                    <td className="whitespace-nowrap py-1 text-right tabular-nums">{fmtCZK(r.revenue)}</td>
                    <td className="whitespace-nowrap py-1 text-right tabular-nums text-ink-soft">{r.unitCost != null ? fmtCZK(r.unitCost) : "—"}</td>
                    <td className={`whitespace-nowrap py-1 text-right font-semibold tabular-nums ${r.unitCost == null ? "text-ink-soft" : r.profit >= 0 ? "text-leaf-700" : "text-red-600"}`}>{r.unitCost == null ? "—" : sgn(r.profit)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-ink/10 font-semibold">
                  <td className="py-1">Celkem</td>
                  <td className="py-1 text-right tabular-nums">{s.sold.qty} ks</td>
                  <td className="py-1 text-right tabular-nums">{fmtCZK(s.sold.revenue)}</td>
                  <td />
                  <td className={`py-1 text-right tabular-nums ${s.sold.profit >= 0 ? "text-leaf-700" : "text-red-600"}`}>{sgn(s.sold.profit)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </Section>

      {/* ---------- LÍSTKY ---------- */}
      <Section id="listky" title="🎟️ Lístky" sub="Rezervace z webu a prodej na místě. Místo a způsob podle zápisu platby.">
        <StatTiles
          stats={[
            { label: "Lístků celkem", value: `${nf(t.total)} ks`, sub: `${t.orders} objednávek · průměr ${t.avg.toFixed(2).replace(".", ",")}` },
            { label: "Rezervace z webu", value: `${t.web.people} lidí`, sub: `${t.web.qty} ks · zaplaceno ${t.web.paid} · čeká ${t.web.pending}` },
            { label: "Vyzvednuto", value: pct(t.web.paid, t.web.qty), sub: `${t.web.pendingPeople} lidí nepřišlo / nezaplatilo`, tone: t.web.qty > 0 && t.web.paid / t.web.qty >= 0.8 ? "good" : undefined },
            { label: "Bez rezervace", value: `${t.places.onsiteBar.qty + t.places.onsiteFleda.qty} ks`, sub: `na baru ${t.places.onsiteBar.qty} · na Flédě ${t.places.onsiteFleda.qty}` },
            { label: "Až na Flédě", value: `${t.late.qty} ks`, sub: `${t.late.people} lidí vyzvedlo po odpočtu` },
            { label: "Holky / kluci", value: `${t.gender.f} / ${t.gender.m}`, sub: `odhad podle jména${t.gender.unknown ? ` · ${t.gender.unknown} nejasné` : ""}` },
          ]}
        />
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <DonutChart
            title="Prodané lístky podle místa"
            unit="ks"
            sort={false}
            items={[
              { label: "Na baru · bez rezervace", value: t.places.onsiteBar.qty, color: VIZ[0] },
              { label: "Na baru · s rezervací", value: t.places.resBar.qty, color: VIZ[1] },
              { label: "Na Flédě · s rezervací", value: t.places.resFleda.qty, color: VIZ[2] },
              { label: "Na Flédě · bez rezervace", value: t.places.onsiteFleda.qty, color: VIZ[3] },
            ]}
          />
          <DonutChart
            title="Lístků na jednu objednávku"
            unit="obj."
            sort={false}
            items={[
              { label: "1 lístek", value: t.buckets["1"], color: VIZ_ORD[0] },
              { label: "2 lístky", value: t.buckets["2"], color: VIZ_ORD[1] },
              { label: "3 lístky", value: t.buckets["3"], color: VIZ_ORD[2] },
              { label: "4+ lístky", value: t.buckets["4+"], color: VIZ_ORD[3] },
            ]}
          />
          <ColumnChart
            title="Nové rezervace po dnech"
            unit="ks"
            categories={t.resByDay.map(([d]) => shortDay(d))}
            series={[{ key: "res", label: "Rezervované lístky", color: VIZ[0] }]}
            data={t.resByDay.map(([, v]) => [v.tickets])}
            note="Den vytvoření rezervace na webu."
          />
          <ColumnChart
            title="Zaplacené lístky po dnech"
            unit="ks"
            categories={t.paidByDay.map(([d]) => shortDay(d))}
            series={[
              { key: "web", label: "Vyzvednuté rezervace", color: VIZ[0] },
              { key: "bar", label: "Na baru bez rezervace", color: VIZ[1] },
              { key: "fleda", label: "Na Flédě bez rezervace", color: VIZ[2] },
            ]}
            data={t.paidByDay.map(([, v]) => [v.web, v.bar, v.fleda])}
            note="Den zaplacení (zápis ve financích)."
          />
          <SplitBar
            title="Rezervace z webu · zaplaceno vs. čeká"
            unit="ks"
            parts={[
              { label: "Zaplaceno", value: t.web.paid, color: VIZ[2] },
              { label: "Čeká / nepřišlo", value: t.web.pending, color: VIZ[3] },
            ]}
          />
          <DonutChart
            title="Jak dlouho od rezervace k zaplacení"
            unit="ks"
            sort={false}
            items={[
              { label: "Tentýž den", value: t.lead.d0, color: VIZ_ORD[0] },
              { label: "1–3 dny", value: t.lead.d1, color: VIZ_ORD[1] },
              { label: "4–7 dní", value: t.lead.d4, color: VIZ_ORD[2] },
              { label: "8 a více dní", value: t.lead.d8, color: VIZ_ORD[3] },
            ]}
          />
        </div>
      </Section>

      {/* ---------- KASY ---------- */}
      <Section id="kasy" title="🧰 Kasy po dnech" sub="Ranní vklad, večerní stav, hotovost namarkovaná v Prodeji a rozdíl (přebytek / manko se počítá do zisku dne).">
        {s.cashboxes.length === 0 ? (
          <p className="text-sm text-ink-soft">Žádná kasa.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] font-medium uppercase tracking-wide text-ink-soft">
                  <th className="py-1 font-medium">Den</th>
                  <th className="py-1 text-right font-medium">Vklad</th>
                  <th className="py-1 text-right font-medium">Markováno hotově</th>
                  <th className="py-1 text-right font-medium">Večer v kase</th>
                  <th className="py-1 text-right font-medium">Rozdíl</th>
                </tr>
              </thead>
              <tbody>
                {s.cashboxes.map((c) => (
                  <tr key={c.id} className="border-t border-ink/[0.06]">
                    <td className="py-1">
                      {fmtDate(c.day)}
                      {c.label ? ` · ${c.label}` : ""}
                      {!c.closed && <span className="ml-1.5 text-xs text-amber-800">otevřená</span>}
                    </td>
                    <td className="py-1 text-right tabular-nums">{fmtCZK(c.opening)}</td>
                    <td className="py-1 text-right tabular-nums">{c.closed ? fmtCZK(c.marked) : "—"}</td>
                    <td className="py-1 text-right tabular-nums">{c.closed && c.closing != null ? fmtCZK(c.closing) : "—"}</td>
                    <td className={`py-1 text-right font-semibold tabular-nums ${c.diff == null ? "text-ink-soft" : c.diff < 0 ? "text-red-600" : "text-leaf-700"}`}>{c.diff == null ? "—" : sgn(c.diff)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {/* ---------- MERCH ---------- */}
      <Section id="merch" title="🛍️ Nabídka lístků a merche" sub="Prodáno z vyřízených objednávek (web i na místě), zbývá = sklad − prodáno.">
        {s.merchProducts.length === 0 ? (
          <p className="text-sm text-ink-soft">Žádné položky.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] font-medium uppercase tracking-wide text-ink-soft">
                  <th className="py-1 font-medium">Položka</th>
                  <th className="py-1 text-right font-medium">Cena</th>
                  <th className="py-1 text-right font-medium">Nákupka</th>
                  <th className="py-1 text-right font-medium">Prodáno</th>
                  <th className="py-1 text-right font-medium">Tržba</th>
                  <th className="py-1 text-right font-medium">Zbývá</th>
                </tr>
              </thead>
              <tbody>
                {s.merchProducts.map((p) => (
                  <tr key={p.id} className="border-t border-ink/[0.06]">
                    <td className="py-1 pr-2">
                      {p.ticket ? "🎟️" : "🛍️"} {p.name}
                    </td>
                    <td className="py-1 text-right tabular-nums">{p.price != null ? fmtCZK(p.price) : "—"}</td>
                    <td className="py-1 text-right tabular-nums text-ink-soft">{p.cost != null ? fmtCZK(p.cost) : "—"}</td>
                    <td className="py-1 text-right tabular-nums">{p.sold} ks</td>
                    <td className="py-1 text-right tabular-nums">{fmtCZK(p.revenue)}</td>
                    <td className={`py-1 text-right tabular-nums ${p.left != null && p.left <= 0 ? "text-amber-800" : ""}`}>{p.left == null ? "∞" : `${p.left} ks`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {/* ---------- TÝM ---------- */}
      <Section id="tym" title="👥 Tým a práce" sub="Lidé v týmu, obsazení rolí, úkoly, směny a prváci.">
        <StatTiles
          stats={[
            { label: "Lidí v týmu", value: nf(s.team.members), sub: s.team.approved < s.team.members ? `${s.team.members - s.team.approved} čeká na schválení` : "všichni schváleni" },
            { label: "Role obsazené", value: `${s.team.rolesFilled} / ${s.team.rolesTotal}`, sub: pct(s.team.rolesFilled, s.team.rolesTotal) },
            { label: "Úkoly hotové", value: `${s.team.tasksDone} / ${s.team.tasks}`, sub: pct(s.team.tasksDone, s.team.tasks), tone: s.team.tasks > 0 && s.team.tasksDone === s.team.tasks ? "good" : undefined },
            { label: "Směny obsazené", value: `${s.team.shiftPeople} / ${s.team.shiftCapacity}`, sub: `${s.team.shifts} směn · ${pct(s.team.shiftPeople, s.team.shiftCapacity)}` },
            { label: "Prváků v seznamu", value: nf(s.team.freshmen) },
            { label: "Plánovaný počet lidí", value: s.year.plannedPeople != null ? nf(s.year.plannedPeople) : "—", sub: s.year.plannedPeople ? `skutečně lístků ${t.total}` : undefined },
          ]}
        />
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <SplitBar title="Úkoly" unit="úkolů" parts={[{ label: "Hotové", value: s.team.tasksDone, color: VIZ[2] }, { label: "Nehotové", value: s.team.tasks - s.team.tasksDone, color: VIZ[3] }]} />
          <SplitBar title="Směny" unit="míst" parts={[{ label: "Obsazené", value: s.team.shiftPeople, color: VIZ[2] }, { label: "Volné", value: Math.max(0, s.team.shiftCapacity - s.team.shiftPeople), color: VIZ[3] }]} />
        </div>
      </Section>

      {/* ---------- PROGRAM & ORGANIZACE ---------- */}
      <Section id="program" title="📅 Program a organizace" sub="Kalendář, hosté, sponzoři, výzdoba, nákupy, nástěnka a ankety.">
        <StatTiles
          stats={[
            { label: "Událostí v kalendáři", value: nf(s.program.events) },
            { label: "Hosté (program)", value: `${s.program.invites.yes} potvrzeno`, sub: `${s.program.invites.total} osloveno · ${s.program.invites.waiting} čeká · ${s.program.invites.no} ne` },
            { label: "Sponzoři", value: `${s.program.sponsors.confirmed} potvrzeno`, sub: `${s.program.sponsors.total} celkem · ${s.program.sponsors.waiting} čeká · ${s.program.sponsors.declined} odmítlo` },
            { label: "Výzdoba", value: `${s.program.decor.done} / ${s.program.decor.total}`, sub: `hotovo · ${s.program.decor.searching} shání · ${s.program.decor.idea} nápad` },
            { label: "Nákupy", value: `${s.program.shopping.bought} / ${s.program.shopping.total}`, sub: "koupeno" },
            { label: "Nabídka", value: `${s.program.drinks} + ${s.program.dishes}`, sub: "drinků + jídel v ceníku" },
            { label: "Nástěnka", value: nf(s.program.posts), sub: `příspěvků · ${s.program.announcements} oznámení` },
            { label: "Ankety", value: nf(s.program.polls), sub: `${s.program.pollVotes} hlasů · ${s.program.pollsClosed} uzavřeno` },
            { label: "Kontakty a odkazy", value: nf(s.program.links) },
          ]}
        />
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {s.program.eventsByKind.length > 0 && <DonutChart title="Události podle druhu" unit="udál." items={s.program.eventsByKind.map((e) => ({ label: e.label, value: e.count }))} />}
          {s.program.sponsors.total > 0 && (
            <DonutChart
              title="Sponzoři podle stavu"
              unit="firem"
              sort={false}
              items={[
                { label: "Potvrzeno", value: s.program.sponsors.confirmed, color: VIZ[2] },
                { label: "Čeká", value: s.program.sponsors.waiting, color: VIZ[3] },
                { label: "Oslovit", value: s.program.sponsors.toContact, color: VIZ[0] },
                { label: "Odmítl", value: s.program.sponsors.declined, color: VIZ[1] },
              ]}
            />
          )}
        </div>
      </Section>

      {/* ---------- WEB ---------- */}
      <Section id="web" title="🌐 Web a návštěvnost" sub="Za posledních 400 dní; podrobnosti ve Statistikách.">
        {!web ? (
          <p className="text-sm text-ink-soft">Načítám statistiky webu…</p>
        ) : !web.enabled ? (
          <p className="text-sm text-ink-soft">Statistiky webu běží jen na produkci s Redisem.</p>
        ) : (
          <>
            <StatTiles
              stats={[
                { label: "Zobrazení stránek", value: nf(web.pageviews) },
                { label: "Unikátních lidí", value: nf(web.uniquesInPeriod), sub: `${nf(web.loggedInUniques)} tým · ${nf(web.visitorUniques)} návštěvníci` },
                { label: "Lidé vs. boti", value: `${pct(web.humans, web.humans + web.bots)} lidé`, sub: `${nf(web.bots)} zobrazení boty` },
                { label: "Konverze merche", value: web.funnel[0]?.count ? pct(web.funnel[web.funnel.length - 1]?.count ?? 0, web.funnel[0].count) : "—", sub: web.funnel[0]?.count ? `${nf(web.funnel[web.funnel.length - 1]?.count ?? 0)} z ${nf(web.funnel[0].count)} dokončilo` : undefined },
                { label: "Nejsilnější den", value: web.series.length ? shortDay(web.series.reduce((b, x) => (x.pv > b.pv ? x : b), web.series[0]).date) : "—", sub: web.series.length ? `${nf(Math.max(...web.series.map((x) => x.pv)))} zobrazení` : undefined },
                { label: "Měsíc (MAU)", value: nf(web.mau), sub: "unikátních za 30 dní" },
              ]}
            />
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <ColumnChart
                title="Zobrazení po dnech"
                unit="zobr."
                categories={web.series.map((x) => shortDay(x.date))}
                series={[
                  { key: "human", label: "Lidé", color: VIZ[0] },
                  { key: "bot", label: "Boti", color: VIZ[1] },
                ]}
                data={web.series.map((x) => [x.human ?? x.pv, x.bot ?? 0])}
              />
              <BarList title="Nejnavštěvovanější stránky" unit="zobr." rows={web.topPages.map((p) => ({ label: p.label, value: p.count }))} />
              <DonutChart title="Zařízení" unit="zobr." items={web.devices.map((d) => ({ label: d.label, value: d.count }))} />
              <DonutChart title="Prohlížeč" unit="zobr." items={web.browsers.map((d) => ({ label: d.label, value: d.count }))} />
            </div>
          </>
        )}
      </Section>

      {/* ---------- MEZIROČNĚ ---------- */}
      {prev && (
        <Section id="mezirocne" title={`📈 Meziročně: ${prev.year.label} → ${s.year.label}`} sub="Srovnání hlavních čísel s předchozím ročníkem.">
          <Compare a={prev} b={s} />
        </Section>
      )}

      <p className="text-center text-[11px] text-ink-soft">Shrnutí se počítá živě z dat ročníku. Pro archiv použij PDF nahoře.</p>
      <ArchiveModal open={archiveOpen} onClose={() => setArchiveOpen(false)} />
      <p className="text-center text-xs">
        <Link href="/zazemi" className="text-ink-soft underline">
          ← Zpět na nástěnku
        </Link>
      </p>
    </div>
  );
}

function Compare({ a, b }: { a: YearSummary; b: YearSummary }) {
  const rows: { label: string; a: number; b: number; money?: boolean }[] = [
    { label: "Tržba z prodeje", a: a.sales.total, b: b.sales.total, money: true },
    { label: "Zisk z prodeje", a: a.sales.profit, b: b.sales.profit, money: true },
    { label: "Bilance ročníku", a: a.finance.bilance, b: b.finance.bilance, money: true },
    { label: "Lístků prodáno", a: a.tickets.total, b: b.tickets.total },
    { label: "Lidí s rezervací", a: a.tickets.web.people, b: b.tickets.web.people },
    { label: "Účtenek", a: a.sales.count, b: b.sales.count },
    { label: "Lidí v týmu", a: a.team.members, b: b.team.members },
    { label: "Úkolů", a: a.team.tasks, b: b.team.tasks },
    { label: "Událostí", a: a.program.events, b: b.program.events },
  ];
  const f = (r: (typeof rows)[number], v: number) => (r.money ? fmtCZK(v) : nf(v));
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-[10px] font-medium uppercase tracking-wide text-ink-soft">
          <th className="py-1 font-medium">Ukazatel</th>
          <th className="py-1 text-right font-medium">{a.year.id}</th>
          <th className="py-1 text-right font-medium">{b.year.id}</th>
          <th className="py-1 text-right font-medium">Změna</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => {
          const d = r.b - r.a;
          return (
            <tr key={r.label} className="border-t border-ink/[0.06]">
              <td className="py-1">{r.label}</td>
              <td className="py-1 text-right tabular-nums text-ink-soft">{f(r, r.a)}</td>
              <td className="py-1 text-right font-semibold tabular-nums">{f(r, r.b)}</td>
              <td className={`py-1 text-right tabular-nums ${d > 0 ? "text-leaf-700" : d < 0 ? "text-red-600" : "text-ink-soft"}`}>
                {d === 0 ? "—" : `${d > 0 ? "+" : "−"}${f(r, Math.abs(d))}${r.a ? ` (${d > 0 ? "+" : "−"}${Math.round((Math.abs(d) / Math.abs(r.a)) * 100)} %)` : ""}`}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
