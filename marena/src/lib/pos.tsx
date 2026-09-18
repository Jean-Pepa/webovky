"use client";

// Sdílené prvky pokladny (POS) — používá je Prodej (archiv uzavřených dnů)
// i Finance (pohled Kasy), aby byla denní kasa evidovaná všude stejně:
// tržba, QR vs. hotovost vedle sebe, kategorie, nejprodávanější a rolovací
// historie objednávek. Správce může jednotlivý prodej i celou kasu smazat.

import { useState, type ReactNode } from "react";
import { useStore } from "@/lib/store";
import { DeleteButton } from "@/components/DeleteButton";
import { Modal } from "@/components/Modal";
import { fmtCZK, fmtDate, fmtDateTime } from "@/lib/format";
import { copyText } from "@/components/CopyContact";
import { flash } from "@/components/Flash";
import type { Cashbox, Drink, FinanceItem, MerchOrder, MerchProduct } from "@/lib/types";
import { normName } from "@/lib/names";
import { isTicketName } from "@/lib/merch";

// Kategorie financí, které patří prodeji (denní kase).
export const POS_CATS = new Set(["merch", "bar", "kuchyně", "kasa"]);

// Statistiky nad zápisy z prodeje: tržba (příjmy − výdaje, tedy včetně
// případného manka z kasy), QR vs. hotovost, kategorie, počet prodejů
// a nejprodávanější položky (z rozpisu v poznámkách).
// Nákupní cena položky podle názvu — u pití/jídla součet surovin z Kuchyně & baru,
// u merche nákupní cena produktu. Prodeje mají v poznámce jen názvy, tak se páruje
// podle názvu (bez diakritiky a velikosti písmen; varianta v závorce se ignoruje).
export type CostLookup = (name: string) => number | undefined;
export function makeCostLookup(year: { bar?: Drink[]; merch?: MerchProduct[] }): CostLookup {
  const map = new Map<string, number>();
  for (const d of year.bar ?? []) map.set(normName(d.name), d.ingredients.reduce((sum, i) => sum + (i.cost || 0), 0));
  for (const m of year.merch ?? []) if (m.cost != null) map.set(normName(m.name), m.cost);
  return (name) => map.get(normName(name.replace(/\s*\(.*\)\s*$/, "")));
}

// Lístky zvlášť: z prodeje merche vytáhne část, která jsou vstupenky (podle názvu
// produktu) — přes navázanou objednávku (ceny po položkách), u vlastní částky
// „Lístek…" celou částku. Zůstává v kase, jen se ukáže odděleně.
export type TicketSplit = (f: FinanceItem) => { revenue: number; cost: number; qty: number };
export function makeTicketSplit(year: { merch?: MerchProduct[]; merchOrders?: MerchOrder[] }): TicketSplit {
  const byFinance = new Map<string, MerchOrder>();
  for (const o of year.merchOrders ?? []) if (o.financeId) byFinance.set(o.financeId, o);
  const products = new Map((year.merch ?? []).map((p) => [p.id, p]));
  return (f) => {
    if (f.kind !== "prijem" || (f.category ?? "") !== "merch") return { revenue: 0, cost: 0, qty: 0 };
    const order = byFinance.get(f.id);
    if (order) {
      let revenue = 0, cost = 0, qty = 0;
      for (const it of order.items) {
        const p = products.get(it.productId);
        if (!isTicketName(it.name) && !(p && isTicketName(p.name))) continue;
        const price = it.price ?? p?.price ?? 0;
        revenue += price * it.qty;
        cost += (p?.cost ?? 0) * it.qty;
        qty += it.qty;
      }
      return { revenue, cost, qty };
    }
    // bez objednávky (vlastní částka): když jsou všechny položky lístky, je to celé lístek
    const parts = (f.note ?? "").split(" · ")[0].split(", ").map((x) => x.match(/^(\d+)× (.+)$/)).filter(Boolean) as RegExpMatchArray[];
    if (parts.length > 0 && parts.every((m) => isTicketName(m[2]))) {
      return { revenue: f.amount, cost: 0, qty: parts.reduce((s, m) => s + Number(m[1]), 0) };
    }
    return { revenue: 0, cost: 0, qty: 0 };
  };
}

export function posStats(list: FinanceItem[], costOf?: CostLookup, ticketOf?: TicketSplit) {
  let total = 0; // všechny příjmy z prodeje (bez nákupů), včetně rekonciliace kasy
  let food = 0; // tržba jídlo & pití (bar + kuchyně) — hlavní číslo kasy
  let foodCost = 0;
  let merch = 0; // merch bez lístků
  let merchCost = 0;
  let ticketRevenue = 0; // lístky zvlášť
  let ticketCost = 0;
  let ticketQty = 0;
  let unknownQty = 0; // prodané kusy bez známé nákupní ceny
  let qr = 0;
  let cash = 0;
  let count = 0;
  let kasaAdj = 0; // rekonciliace kasy (kategorie „kasa" — manko/přebytek), NENÍ tržba
  let purchases = 0; // nákupy zboží (výdaje bar / kuchyně / merch) — NEJSOU tržba, jen se ukážou
  const byCat = new Map<string, number>();
  const items = new Map<string, number>();
  for (const f of list) {
    const sign = f.kind === "vydaj" ? -1 : 1;
    // Výdaj mimo rekonciliaci kasy = nákup zboží (pivo, jídlo, merch do skladu).
    // Platil se z účtu / balíku, ne ze šuplíku — do tržby dne nepatří.
    if (sign < 0 && (f.category ?? "") !== "kasa") {
      purchases += f.amount;
      continue;
    }
    total += sign * f.amount;
    const cat = f.category ?? "";
    byCat.set(cat, (byCat.get(cat) ?? 0) + sign * f.amount);
    if (cat === "kasa") {
      kasaAdj += sign * f.amount;
      continue;
    }
    const note = f.note ?? "";
    if (note.includes("QR platba")) qr += f.amount;
    else if (note.includes("hotově")) cash += f.amount;
    // Náklady zápisu: prodané kusy × nákupní cena (z poznámky „2× Pivo, 1× Chleba")
    let entryCost = 0;
    if (note.includes("×")) {
      count++;
      for (const part of note.split(" · ")[0].split(", ")) {
        const m = part.match(/^(\d+)× (.+)$/);
        if (!m) continue;
        const qty = Number(m[1]);
        items.set(m[2], (items.get(m[2]) ?? 0) + qty);
        if (costOf) {
          const c = costOf(m[2]);
          if (c != null) entryCost += qty * c;
          else unknownQty += qty;
        }
      }
    }
    if (cat === "merch") {
      // Lístky se z merche vyčlení (podle objednávky); zbytek je merch.
      const t = ticketOf ? ticketOf(f) : { revenue: 0, cost: 0, qty: 0 };
      ticketRevenue += t.revenue;
      ticketCost += t.cost;
      ticketQty += t.qty;
      merch += f.amount - t.revenue;
      merchCost += Math.max(0, entryCost - t.cost);
    } else {
      food += f.amount;
      foodCost += entryCost;
    }
  }
  const top = [...items.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, qty]) => ({ name, qty }));
  return {
    total,
    // Tržba kasy = jen jídlo & pití (bar + kuchyně). Lístky a merch jsou zvlášť níže.
    takings: food,
    // Všechno, co prošlo kasou (jídlo & pití + lístky + merch), bez rekonciliace.
    allRevenue: total - kasaAdj,
    qr,
    cash,
    count,
    top,
    purchases,
    // Náklady a zisk (jídlo & pití) podle nákupních cen položek — jen když je předaný ceník.
    withCosts: !!costOf,
    cost: foodCost,
    profit: food - foodCost,
    unknownQty,
    // Lístky zvlášť (podle názvu produktu, rozpad přes objednávku).
    withTickets: !!ticketOf,
    ticketRevenue,
    ticketCost,
    ticketQty,
    ticketProfit: ticketRevenue - ticketCost,
    // Merch bez lístků.
    merchRevenue: merch,
    merchCost,
    merchProfit: merch - merchCost,
    byCat: [...byCat.entries()].filter(([, v]) => v !== 0).map(([cat, sum]) => ({ cat, sum })),
  };
}

// Historie objednávek dne — jednotlivé prodeje (zápisy s rozpisem „×")
// od nejnovějšího. Slouží do rolovacího seznamu ve statistikách i archivu.
export type PosOrder = { id: string; at: string; cat: string; items: string; amount: number; how: string; saleId?: string; who?: string };
export function posOrders(list: FinanceItem[]): PosOrder[] {
  return list
    .filter((f) => f.kind === "prijem" && (f.note ?? "").includes("×"))
    .map((f) => {
      const note = f.note ?? "";
      const items = note.split(" · ")[0];
      const how = note.includes("QR platba") ? "QR" : note.includes("hotově") ? "hotově" : "";
      return { id: f.id, at: f.createdAt, cat: f.category ?? "", items, amount: f.amount, how, saleId: f.saleId, who: f.who };
    })
    .sort((a, b) => b.at.localeCompare(a.at));
}

// Jedna účtenka = víc zápisů (rozdělené po kategoriích: bar + kuchyně + merch).
// Spojí je do skupiny: nové zápisy podle saleId, starší (bez saleId) podle
// stejné platby, stejného prodejce a času do 20 s. Řádky musí být seřazené podle času.
export function groupSales<T extends { id: string; at: string; how: string; saleId?: string; who?: string }>(rows: T[]): T[][] {
  const groups: T[][] = [];
  for (const r of rows) {
    const g = groups[groups.length - 1];
    const prev = g?.[g.length - 1];
    const same =
      !!prev &&
      (r.saleId && prev.saleId
        ? r.saleId === prev.saleId
        : !r.saleId && !prev.saleId && r.how === prev.how && (r.who ?? "") === (prev.who ?? "") && Math.abs(Date.parse(r.at) - Date.parse(prev.at)) <= 20_000);
    if (same) g.push(r);
    else groups.push([r]);
  }
  return groups;
}

// Žlutý rámeček kolem zápisů jedné účtenky (víc kategorií v jedné objednávce).
export function SaleGroupFrame({ total, how, children }: { total: number; how: string; children: ReactNode }) {
  return (
    <li className="rounded-xl bg-gold-50/60 p-1 ring-2 ring-gold-400">
      <div className="flex items-center justify-between gap-2 px-1.5 pb-1 pt-0.5 text-[11px] font-semibold text-gold-800">
        <span>🧾 jedna objednávka</span>
        <span>
          {how === "QR" ? "QR" : how === "hotově" ? "💵" : ""} celkem {fmtCZK(total)}
        </span>
      </div>
      <ul className="space-y-1">{children}</ul>
    </li>
  );
}

// Zápisy prodeje pro daný den (kasu): od otevření kasy do otevření další
// kasy (i platby přijaté po uzavření, třeba QR u vyzvednutí, tak patří ke
// svému dni). Používá Prodej i Finance, ať sedí stejně.
export function boxDayFinances(finances: FinanceItem[], box: Cashbox, boxes: Cashbox[]): FinanceItem[] {
  const to = boxes
    .filter((c) => c.id !== box.id && c.openedAt > box.openedAt)
    .reduce((min, c) => (c.openedAt < min ? c.openedAt : min), "￿");
  return finances.filter((f) => POS_CATS.has(f.category ?? "") && f.createdAt >= box.openedAt && f.createdAt < to);
}

export const hhmm = (iso: string) => {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "" : `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

// Rolovací historie objednávek — po ťuknutí na tlačítko se rozbalí seznam
// všech prodejů dne (čas · položky · kategorie · způsob · částka). Správce
// může jednotlivý prodej smazat (✕ s potvrzením).
export function OrderHistory({
  orders,
  label = "Historie objednávek",
  defaultOpen = false,
  topBorder = true,
  canDelete = false,
  yearId,
}: {
  orders: PosOrder[];
  label?: string;
  defaultOpen?: boolean;
  topBorder?: boolean;
  canDelete?: boolean;
  yearId?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  if (orders.length === 0) return null;
  return (
    <div className={topBorder ? "mt-3 border-t border-ink/[0.06] pt-2" : ""}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 rounded-lg py-1 text-sm font-semibold text-ink-soft transition hover:text-ink"
        aria-expanded={open}
      >
        <span>🧾 {label} ({orders.length})</span>
        <span className={`text-xs transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
      {open && (
        <ul className="mt-2 max-h-72 space-y-1 overflow-y-auto pr-1">
          {groupSales(orders).map((g) =>
            g.length === 1 ? (
              <OrderRow key={g[0].id} o={g[0]} canDelete={canDelete && !!yearId} yearId={yearId} />
            ) : (
              <SaleGroupFrame key={g[0].id} total={g.reduce((s, o) => s + o.amount, 0)} how={g[0].how}>
                {g.map((o) => (
                  <OrderRow key={o.id} o={o} canDelete={canDelete && !!yearId} yearId={yearId} />
                ))}
              </SaleGroupFrame>
            ),
          )}
        </ul>
      )}
    </div>
  );
}

function OrderRow({ o, canDelete, yearId }: { o: PosOrder; canDelete: boolean; yearId?: string }) {
  const { dispatch } = useStore();
  const [ask, setAsk] = useState(false);
  return (
    <li className="flex items-center gap-2 rounded-lg bg-paper2/60 px-2.5 py-1.5 text-sm">
      <span className="shrink-0 tabular-nums text-xs text-ink-soft">{hhmm(o.at)}</span>
      <span className="min-w-0 flex-1 truncate">{o.items}</span>
      {o.cat && <span className="chip shrink-0 text-[11px]">{o.cat}</span>}
      {o.how && <span className="shrink-0 text-xs text-ink-soft">{o.how === "QR" ? "QR" : "💵"}</span>}
      <span className="shrink-0 font-semibold tabular-nums">{fmtCZK(o.amount)}</span>
      {canDelete && yearId && (
        <>
          <button
            onClick={() => setAsk(true)}
            className="shrink-0 rounded-full px-1 leading-none text-ink-soft/70 transition hover:text-red-600"
            aria-label="Smazat prodej"
            title="Smazat prodej"
          >
            ✕
          </button>
          <Modal open={ask} onClose={() => setAsk(false)} title="Smazat prodej?">
            <p className="text-sm text-ink-soft">
              Smazat prodej <strong className="text-ink">{o.items}</strong> ({fmtCZK(o.amount)})? Odečte se z tržeb a nejde to vrátit.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <button
                className="btn-primary flex-1"
                onClick={() => {
                  dispatch({ type: "removeSales", yearId, financeIds: [o.id] });
                  setAsk(false);
                }}
              >
                Ano, smazat
              </button>
              <button className="btn-ghost" onClick={() => setAsk(false)}>
                Ne
              </button>
            </div>
          </Modal>
        </>
      )}
    </li>
  );
}

// Dvojice platebních „pilulek" QR + hotově vedle sebe — kompaktní a čitelné.
export function PayBreakdown({ qr, cash, count }: { qr: number; cash: number; count: number }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-paper2 px-2.5 py-1 text-sm">
        <span className="text-xs font-medium text-ink-soft">QR</span>
        <strong className="text-ink">{fmtCZK(qr)}</strong>
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-paper2 px-2.5 py-1 text-sm">
        <span className="text-xs">💵</span>
        <strong className="text-ink">{fmtCZK(cash)}</strong>
      </span>
      <span className="text-xs text-ink-soft">{count}× prodej</span>
    </div>
  );
}

// Uzamčený den (kasa) — evidence prodeje: tržba + QR/hotově vedle sebe,
// kategorie, vyúčtování kasy, nejprodávanější a historie objednávek.
// Smazat den může jen správce (odstraní kasu i všechny prodeje toho dne).
// Textový výpis dne pro zkopírování (do zprávy, tabulky, e-mailu): souhrn +
// každá objednávka; zápisy jedné účtenky (bar + kuchyně…) jsou pod sebou s celkem.
export function dayReportText(box: Cashbox, stats: ReturnType<typeof posStats>, orders: PosOrder[]): string {
  const lines: string[] = [];
  lines.push(`Kasa ${fmtDate(box.openedAt)}${box.label ? ` · ${box.label}` : ""}${box.closedAt ? " · uzavřeno" : " · otevřeno"}`);
  const sgn = (n: number) => `${n >= 0 ? "+" : "−"}${fmtCZK(Math.abs(n))}`;
  lines.push(`Tržba jídlo & pití ${fmtCZK(stats.takings)}${stats.withCosts ? ` · náklady −${fmtCZK(stats.cost)} · zisk ${sgn(stats.profit)}` : ""}${stats.unknownQty > 0 ? ` (${stats.unknownQty} ks bez nákupní ceny)` : ""}`);
  if (stats.ticketQty > 0) lines.push(`Lístky: ${stats.ticketQty} ks · tržba ${fmtCZK(stats.ticketRevenue)}${stats.withCosts ? ` · zisk ${sgn(stats.ticketProfit)}` : ""}`);
  if (stats.merchRevenue > 0) lines.push(`Merch: tržba ${fmtCZK(stats.merchRevenue)}${stats.withCosts ? ` · zisk ${sgn(stats.merchProfit)}` : ""}`);
  lines.push(`Kasou prošlo celkem ${fmtCZK(stats.allRevenue)} (QR ${fmtCZK(stats.qr)} · hotově ${fmtCZK(stats.cash)} · ${stats.count}× prodej)`);
  if (box.closedAt && box.closing != null) {
    const rozdil = box.closing - box.opening - (box.alreadyRecorded ?? 0);
    lines.push(`Vklad ${fmtCZK(box.opening)} → večer ${fmtCZK(box.closing)} · rozdíl ${rozdil >= 0 ? "+" : "−"}${fmtCZK(Math.abs(rozdil))}`);
  } else {
    lines.push(`Vklad ${fmtCZK(box.opening)} (otevřeno ${fmtDateTime(box.openedAt)})`);
  }
  lines.push("");
  lines.push(`Objednávky (${orders.length}):`);
  // chronologicky; skupiny (jedna účtenka) drží pohromadě
  const desc = [...orders].sort((a, b) => b.at.localeCompare(a.at));
  for (const g of groupSales(desc).reverse()) {
    const items = [...g].reverse();
    if (items.length === 1) {
      const o = items[0];
      lines.push(`${hhmm(o.at)}  ${o.items}  [${o.cat}]  ${o.how === "QR" ? "QR" : o.how === "hotově" ? "hotově" : "—"}  ${fmtCZK(o.amount)}`);
    } else {
      const total = items.reduce((s, o) => s + o.amount, 0);
      lines.push(`${hhmm(items[0].at)}  jedna objednávka · ${items[0].how === "QR" ? "QR" : "hotově"} · celkem ${fmtCZK(total)}`);
      for (const o of items) lines.push(`        ${o.items}  [${o.cat}]  ${fmtCZK(o.amount)}`);
    }
  }
  return lines.join("\n");
}

// Pod tržbou (jídlo & pití): lístky zvlášť, merch zvlášť a kolik celkem prošlo kasou.
export function TicketSplitLine({ stats }: { stats: ReturnType<typeof posStats> }) {
  if (stats.ticketQty === 0 && stats.merchRevenue === 0) return null;
  const sgn = (n: number) => `${n >= 0 ? "+" : "−"}${fmtCZK(Math.abs(n))}`;
  return (
    <div className="mt-1.5 grid gap-0.5 rounded-lg bg-paper2/60 px-2.5 py-1.5 text-sm">
      {stats.ticketQty > 0 && (
        <p className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
          <span className="font-semibold">🎟️ Lístky</span>
          <span className="text-ink-soft">{stats.ticketQty} ks</span>
          <span className="text-ink-soft">
            tržba <strong className="text-leaf-700">+{fmtCZK(stats.ticketRevenue)}</strong>
          </span>
          {stats.withCosts && (
            <span className="text-ink-soft">
              zisk <strong className={stats.ticketProfit >= 0 ? "text-leaf-700" : "text-red-600"}>{sgn(stats.ticketProfit)}</strong>
            </span>
          )}
        </p>
      )}
      {stats.merchRevenue > 0 && (
        <p className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
          <span className="font-semibold">🛍️ Merch</span>
          <span className="text-ink-soft">
            tržba <strong className="text-leaf-700">+{fmtCZK(stats.merchRevenue)}</strong>
          </span>
          {stats.withCosts && (
            <span className="text-ink-soft">
              zisk <strong className={stats.merchProfit >= 0 ? "text-leaf-700" : "text-red-600"}>{sgn(stats.merchProfit)}</strong>
            </span>
          )}
        </p>
      )}
      <p className="text-xs text-ink-soft">Kasou prošlo celkem {fmtCZK(stats.allRevenue)} (QR + hotově výše) — lístky a merch se do tržby jídla & pití nepočítají.</p>
    </div>
  );
}

// Tlačítko „kopírovat" u nadpisu kasy — zkopíruje celý výpis dne do schránky.
export function CopyDayButton({ box, stats, orders }: { box: Cashbox; stats: ReturnType<typeof posStats>; orders: PosOrder[] }) {
  return (
    <button
      type="button"
      className="chip transition hover:bg-gold-100"
      title="Zkopírovat souhrn a všechny objednávky dne"
      onClick={async () => {
        const ok = await copyText(dayReportText(box, stats, orders));
        flash(ok ? `Zkopírováno: ${orders.length} objednávek` : "Kopírování se nepovedlo", ok ? "📋" : "⚠️");
      }}
    >
      📋 Kopírovat
    </button>
  );
}

// Náklady a zisk dne — pod tržbou; náklad = prodané kusy × nákupní cena položky
// (suroviny u pití/jídla, nákupní cena u merche). Kusy bez nákupní ceny se hlásí.
export function ProfitLine({ stats }: { stats: ReturnType<typeof posStats> }) {
  if (!stats.withCosts || stats.count === 0) return null;
  const up = stats.profit >= 0;
  return (
    <p className="mt-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-0.5 text-sm">
      <span className="text-ink-soft">
        Náklady <strong className="font-display text-ink">−{fmtCZK(stats.cost)}</strong>
      </span>
      <span className="text-ink-soft">
        Zisk{" "}
        <strong className={`font-display ${up ? "text-leaf-700" : "text-red-600"}`}>
          {up ? "+" : "−"}
          {fmtCZK(Math.abs(stats.profit))}
        </strong>
      </span>
      {stats.unknownQty > 0 && (
        <span className="text-xs text-amber-800" title="Doplň nákupní cenu (suroviny) u položky v Kuchyni & baru nebo u merche">
          ⚠️ {stats.unknownQty} ks bez nákupní ceny
        </span>
      )}
    </p>
  );
}

export function DayCard({
  box,
  stats,
  orders,
  yearId,
  admin,
  compact = false,
}: {
  box: Cashbox;
  stats: ReturnType<typeof posStats>;
  orders: PosOrder[];
  yearId: string;
  admin: boolean;
  compact?: boolean; // jen datum + „uzamčeno" (prodejci a ostatní bez správce nevidí tržby)
}) {
  const { dispatch } = useStore();
  const rozdil = (box.closing ?? 0) - box.opening - (box.alreadyRecorded ?? 0);
  if (compact) {
    return (
      <section className="card flex flex-wrap items-center justify-between gap-2 p-4">
        <h3 className="font-display text-base font-semibold">
          📅 {fmtDate(box.openedAt)}
          {box.label ? <span className="ml-1.5 font-normal text-ink-soft">· {box.label}</span> : null}
        </h3>
        <span className="chip">🔒 uzamčeno</span>
      </section>
    );
  }
  return (
    <section className="card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-base font-semibold">
          📅 {fmtDate(box.openedAt)}
          {box.label ? <span className="ml-1.5 font-normal text-ink-soft">· {box.label}</span> : null}
        </h3>
        <div className="flex items-center gap-2">
          <CopyDayButton box={box} stats={stats} orders={orders} />
          <span className="chip">🔒 uzamčeno</span>
          {admin && (
            <DeleteButton
              what={`den ${fmtDate(box.openedAt)} — smaže i všechny prodeje toho dne (všude)`}
              onConfirm={() => dispatch({ type: "removeCashbox", yearId, cashboxId: box.id })}
            />
          )}
        </div>
      </div>

      {/* Tržba vlevo (zeleně — kolik se vydělalo), platby (QR + hotově) vpravo */}
      <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <span className="flex items-baseline gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-ink-soft">Tržba jídlo & pití</span>
          <span className="font-display text-[22px] font-bold tracking-tight text-leaf-700">{fmtCZK(stats.takings)}</span>
        </span>
        <PayBreakdown qr={stats.qr} cash={stats.cash} count={stats.count} />
      </div>
      <ProfitLine stats={stats} />
      <TicketSplitLine stats={stats} />

      <p className="mt-2 border-t border-ink/[0.06] pt-2 text-sm text-ink-soft">
        Kasa: vklad {fmtCZK(box.opening)} → večer {fmtCZK(box.closing ?? 0)}
        {rozdil === 0 ? (
          <span className="text-leaf-700"> · sedí ✓</span>
        ) : (
          <span className={rozdil > 0 ? "text-leaf-700" : "text-red-600"}>
            {" "}
            · rozdíl {rozdil > 0 ? "+" : "−"}
            {fmtCZK(Math.abs(rozdil))}
          </span>
        )}
      </p>

      {stats.top.length > 0 && (
        <p className="mt-1 text-sm text-ink-soft">Nejprodávanější: {stats.top.map((t) => `${t.qty}× ${t.name}`).join(" · ")}</p>
      )}

      <OrderHistory orders={orders} canDelete={admin} yearId={yearId} />
    </section>
  );
}
