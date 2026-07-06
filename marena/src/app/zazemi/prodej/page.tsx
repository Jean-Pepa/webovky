"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Modal } from "@/components/Modal";
import { PayQr } from "@/components/PayQr";
import { DeleteButton } from "@/components/DeleteButton";
import { parseAccount } from "@/lib/payment";
import { fmtCZK, fmtDate, fmtDateTime, todayISO } from "@/lib/format";
import { uid } from "@/lib/id";
import { isAdmin } from "@/lib/admin";
import { sameName } from "@/lib/names";
import { flash } from "@/components/Flash";
import type { Cashbox, FinanceItem, MerchOrder, MerchProduct } from "@/lib/types";

// Prodej — jednotná pokladna pro celý festival (vzor z restauračních a
// festivalových POS). Nahoře jen to, co obsluha potřebuje k prodeji:
// stánek → dlaždice → účtenka → QR/hotově. Dole „Přehled dne": tržby,
// denní kasa na hotovost a účet pro QR. Do financí se zapisuje až PO
// zaplacení, po kategoriích (merch/bar/kuchyně/kasa) + kdo a jak platil.

type Kind = "merch" | "bar" | "kuchyne" | "custom";
type Stand = "merch" | "bar" | "kuchyne";

type Line = {
  key: string;
  kind: Kind;
  productId?: string;
  name: string;
  size?: string;
  color?: string;
  price: number;
  qty: number;
};

const STANDS: { id: Stand; label: string }[] = [
  { id: "merch", label: "🛍️ Merch" },
  { id: "bar", label: "🍸 Bar" },
  { id: "kuchyne", label: "🍳 Kuchyně" },
];

// Slovo do zprávy pro banku, kategorie financí a barva dlaždic (obsluha
// hledá barvou dřív než čtením — vzor z barových POS).
const KIND_WORD: Record<Kind, string> = { merch: "MERCH", bar: "BAR", kuchyne: "JIDLO", custom: "KASA" };
const KIND_CATEGORY: Record<Exclude<Kind, "merch">, string> = { bar: "bar", kuchyne: "kuchyně", custom: "kasa" };
const KIND_BORDER: Record<Kind, string> = {
  merch: "border-l-gold-500",
  bar: "border-l-sky-500",
  kuchyne: "border-l-emerald-500",
  custom: "border-l-zinc-400",
};

// Kam přidat položky, když je nabídka stánku prázdná.
const EMPTY_HINT: Record<Exclude<Kind, "custom">, { text: string; href: string; cta: string }> = {
  merch: { text: "Zatím žádný merch s prodejní cenou.", href: "/zazemi/merch", cta: "Přidat merch" },
  bar: { text: "Zatím žádné pití s prodejní cenou.", href: "/zazemi/kuchyne", cta: "Přidat drink" },
  kuchyne: { text: "Zatím žádné jídlo s prodejní cenou.", href: "/zazemi/kuchyne", cta: "Přidat jídlo" },
};

const LS_STAND = "marena_pos_stand";
const LS_TALLY = "marena_pos_tally";

const lineLabel = (l: Line) =>
  `${l.name}${[l.size, l.color].filter(Boolean).length ? ` (${[l.size, l.color].filter(Boolean).join(" · ")})` : ""}`;

// Kategorie financí, které patří prodeji.
const POS_CATS = new Set(["merch", "bar", "kuchyně", "kasa"]);

// Statistiky nad zápisy z prodeje: tržba (příjmy − výdaje, tedy včetně
// případného manka z kasy), QR vs. hotovost, kategorie, počet prodejů
// a nejprodávanější položky (z rozpisu v poznámkách).
function posStats(list: FinanceItem[]) {
  let total = 0;
  let qr = 0;
  let cash = 0;
  let count = 0;
  const byCat = new Map<string, number>();
  const items = new Map<string, number>();
  for (const f of list) {
    const sign = f.kind === "vydaj" ? -1 : 1;
    total += sign * f.amount;
    const cat = f.category ?? "";
    byCat.set(cat, (byCat.get(cat) ?? 0) + sign * f.amount);
    const note = f.note ?? "";
    if (sign > 0 && note.includes("QR platba")) qr += f.amount;
    else if (sign > 0 && note.includes("hotově")) cash += f.amount;
    if (sign > 0 && note.includes("×")) {
      count++;
      for (const part of note.split(" · ")[0].split(", ")) {
        const m = part.match(/^(\d+)× (.+)$/);
        if (m) items.set(m[2], (items.get(m[2]) ?? 0) + Number(m[1]));
      }
    }
  }
  const top = [...items.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, qty]) => ({ name, qty }));
  return {
    total,
    qr,
    cash,
    count,
    top,
    byCat: [...byCat.entries()].filter(([, v]) => v !== 0).map(([cat, sum]) => ({ cat, sum })),
  };
}

// Historie objednávek dne — jednotlivé prodeje (zápisy s rozpisem „×")
// od nejnovějšího. Slouží do rolovacího seznamu ve statistikách i archivu.
type PosOrder = { id: string; at: string; cat: string; items: string; amount: number; how: string };
function posOrders(list: FinanceItem[]): PosOrder[] {
  return list
    .filter((f) => f.kind === "prijem" && (f.note ?? "").includes("×"))
    .map((f) => {
      const note = f.note ?? "";
      const items = note.split(" · ")[0];
      const how = note.includes("QR platba") ? "QR" : note.includes("hotově") ? "hotově" : "";
      return { id: f.id, at: f.createdAt, cat: f.category ?? "", items, amount: f.amount, how };
    })
    .sort((a, b) => b.at.localeCompare(a.at));
}

const hhmm = (iso: string) => {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "" : `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

// Rolovací historie objednávek — po ťuknutí na tlačítko se rozbalí
// seznam všech prodejů dne (čas · položky · kategorie · způsob · částka).
function OrderHistory({
  orders,
  label = "Historie objednávek",
  defaultOpen = false,
  topBorder = true,
}: {
  orders: PosOrder[];
  label?: string;
  defaultOpen?: boolean;
  topBorder?: boolean;
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
          {orders.map((o) => (
            <li key={o.id} className="flex items-center gap-2 rounded-lg bg-paper2/60 px-2.5 py-1.5 text-sm">
              <span className="shrink-0 tabular-nums text-xs text-ink-soft">{hhmm(o.at)}</span>
              <span className="min-w-0 flex-1 truncate">{o.items}</span>
              {o.cat && <span className="chip shrink-0 text-[11px]">{o.cat}</span>}
              {o.how && <span className="shrink-0 text-xs text-ink-soft">{o.how === "QR" ? "QR" : "💵"}</span>}
              <span className="shrink-0 font-semibold tabular-nums">{fmtCZK(o.amount)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Cena a rozpis objednávky merche — cena ze snapshotu v položce,
// jinak z aktuální nabídky (kvůli starším objednávkám).
const orderTotal = (order: MerchOrder, products: MerchProduct[]) =>
  order.items.reduce((sum, it) => sum + (it.price ?? products.find((p) => p.id === it.productId)?.price ?? 0) * it.qty, 0);
const orderItemsText = (order: MerchOrder) =>
  order.items
    .map((it) => `${it.qty}× ${it.name}${[it.size, it.color].filter(Boolean).length ? ` (${[it.size, it.color].filter(Boolean).join(" · ")})` : ""}`)
    .join(", ");

export default function ProdejPage() {
  const { currentYear, canEditCurrentYear } = useStore();
  if (!currentYear) return null;
  if (!canEditCurrentYear) {
    return (
      <div className="card p-6 text-center text-sm text-ink-soft">
        Prodej je jen pro aktuální ročník — uzamčené ročníky se prohlížejí.
      </div>
    );
  }
  // key: při přepnutí ročníku se rozmarkovaná účtenka zahodí.
  return <Pos key={currentYear.id} />;
}

function Pos() {
  const { currentYear, me, dispatch } = useStore();
  const [stand, setStand] = useState<Stand>("merch");
  const [lines, setLines] = useState<Line[]>([]);
  const [lastSale, setLastSale] = useState<Line[] | null>(null);
  const [tally, setTally] = useState<Record<string, number>>({});
  const [picker, setPicker] = useState<{ productId: string; size?: string; color?: string } | null>(null);
  const [qrOpen, setQrOpen] = useState(false);
  const [cashOpen, setCashOpen] = useState(false); // hotovost za účtenku (kolik dal → kolik vrátit)
  const [payOrder, setPayOrder] = useState<MerchOrder | null>(null);
  const [cashOrder, setCashOrder] = useState<MerchOrder | null>(null); // hotovost za čekající objednávku
  const [busy, setBusy] = useState(false);
  // Režim úprav nabídky (jen správce): dlaždice se místo markování mažou.
  const [editNabidka, setEditNabidka] = useState(false);
  const year = currentYear;
  const admin = isAdmin(me);
  // Pomocník u stánku nemá spodní navigaci — stánky sedí na jejím místě.
  const posOnly = !admin && !!currentYear?.members.find((m) => sameName(m.name, me))?.posOnly;

  // Stánek: z odkazu (?stand=merch) nebo z minula — zařízení u baru
  // zůstává barem (vzor „zamčeného terminálu" z festivalových pokladen).
  useEffect(() => {
    // Odloženě (mimo tělo efektu), ať se stav nemění synchronně při renderu.
    const t = setTimeout(() => {
      const fromUrl = new URLSearchParams(window.location.search).get("stand");
      const stored = localStorage.getItem(LS_STAND);
      const pick = [fromUrl, stored].find((s) => STANDS.some((x) => x.id === s));
      if (pick) setStand(pick as Stand);
      try {
        setTally(JSON.parse(localStorage.getItem(LS_TALLY) ?? "{}"));
      } catch {
        /* poškozený záznam — začne se od nuly */
      }
    }, 0);
    return () => clearTimeout(t);
  }, []);
  function pickStand(s: Stand) {
    setStand(s);
    localStorage.setItem(LS_STAND, s);
  }

  if (!year) return null;

  const account = year.paymentAccount ?? "";
  const accountOk = !!account && !("error" in parseAccount(account));

  // Nadstavba dne: bez otevřené kasy se neprodává. Nejdřív se založí
  // nový den (vklad do kasy), po uzavření se den uzamkne a zůstanou
  // z něj statistiky — brána je i archivem uzavřených dnů.
  const openBox = (year.cashboxes ?? []).find((c) => !c.closedAt);
  if (!openBox) {
    return (
      <DayGate
        yearId={year.id}
        cashboxes={year.cashboxes ?? []}
        finances={year.finances ?? []}
        admin={admin}
        account={account}
        accountOk={accountOk}
      />
    );
  }

  // Nabídka po druzích; nejprodávanější dlaždice první (podle prodejů
  // z tohoto zařízení — barový vzor „top sellers first"). Nové položky
  // s prodejní cenou se tu objeví samy.
  const bySold = (a: { id: string }, b: { id: string }) => (tally[b.id] ?? 0) - (tally[a.id] ?? 0);
  const grids: { kind: Exclude<Kind, "custom">; title: string; items: { id: string; name: string; price: number }[] }[] = [
    {
      kind: "merch" as const,
      title: "🛍️ Merch",
      items: (year.merch ?? []).filter((p) => p.price != null && p.price > 0).map((p) => ({ id: p.id, name: p.name, price: p.price! })).sort(bySold),
    },
    {
      kind: "bar" as const,
      title: "🍸 Pití",
      items: (year.bar ?? [])
        .filter((d) => (d.place ?? "bar") === "bar" && d.price != null && d.price > 0)
        .map((d) => ({ id: d.id, name: d.name, price: d.price! }))
        .sort(bySold),
    },
    {
      kind: "kuchyne" as const,
      title: "🍳 Jídlo",
      items: (year.bar ?? [])
        .filter((d) => (d.place ?? "bar") === "kuchyne" && d.price != null && d.price > 0)
        .map((d) => ({ id: d.id, name: d.name, price: d.price! }))
        .sort(bySold),
    },
  ].filter((g) => g.kind === stand);
  // Přepínač úprav bydlí u první neprázdné sekce nabídky.
  const firstNonEmpty = grids.findIndex((g) => g.items.length > 0);

  // Čekající objednávky merche (z webu i odložené) — platí se tady:
  // QR se jménem objednatele, nebo hotově jedním ťuknutím.
  const pendingOrders =
    stand === "merch"
      ? [...(year.merchOrders ?? [])].filter((o) => !o.done).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      : [];

  const pickerProduct = picker ? (year.merch ?? []).find((p) => p.id === picker.productId) : undefined;
  const total = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const kinds = [...new Set(lines.map((l) => l.kind))];
  const kindsWord =
    kinds.length === 1
      ? KIND_WORD[kinds[0]]
      : kinds.every((k) => k === "bar" || k === "kuchyne")
        ? "JIDLO A PITI"
        : "KASA";
  const qrMessage = `MARENA ${kindsWord} ${lines.map((l) => `${l.qty}X ${lineLabel(l)}`).join(", ")}`;

  // Statistiky dne — den je jedna otevřená kasa, počítá se všechno
  // od jejího založení (i online objednávky zaplacené během dne).
  const dayFinances = (year.finances ?? []).filter((f) => POS_CATS.has(f.category ?? "") && f.createdAt >= openBox.openedAt);
  const stats = posStats(dayFinances);

  // Klíč řádku nese id, variantu i cenu — stejně pojmenované položky
  // s jinou cenou se nesmí slít do jedné.
  function addLine(kind: Kind, name: string, price: number, productId?: string, size?: string, color?: string) {
    setLines((prev) => {
      const key = `${kind}|${productId ?? name}|${size ?? ""}|${color ?? ""}|${price}`;
      const i = prev.findIndex((l) => l.key === key);
      if (i >= 0) return prev.map((l, j) => (j === i ? { ...l, qty: l.qty + 1 } : l));
      return [...prev, { key, kind, productId, name, size, color, price, qty: 1 }];
    });
  }
  function bump(key: string, delta: number) {
    setLines((prev) =>
      prev.flatMap((l) => (l.key === key ? (l.qty + delta <= 0 ? [] : [{ ...l, qty: l.qty + delta }]) : [l])),
    );
  }
  // Ťuknutí na dlaždici: merch s velikostmi/barvami se doptá (chipy),
  // všechno ostatní letí rovnou do účtenky.
  function tapItem(kind: Kind, item: { id: string; name: string; price: number }) {
    const product = kind === "merch" ? (year!.merch ?? []).find((p) => p.id === item.id) : undefined;
    if (product && ((product.sizes?.length ?? 0) > 0 || (product.colors?.length ?? 0) > 0)) {
      setPicker({ productId: product.id });
      return;
    }
    addLine(kind, item.name, item.price, item.id);
  }
  function confirmPicker() {
    if (!picker || !pickerProduct) return;
    addLine("merch", pickerProduct.name, pickerProduct.price!, pickerProduct.id, picker.size, picker.color);
    setPicker(null);
  }
  // Smazání položky z nabídky (jen správce, v režimu Upravit) — maže se
  // přímo produkt/položka menu, takže zmizí i v Merchi / Kuchyně & bar.
  async function removeItem(kind: Exclude<Kind, "custom">, item: { id: string; name: string }) {
    if (!year || busy) return;
    if (!window.confirm(`Smazat „${item.name}“ z nabídky? Zmizí i v sekci ${kind === "merch" ? "Merch" : "Kuchyně & bar"}.`)) return;
    setBusy(true);
    try {
      const ok = await dispatch(
        kind === "merch"
          ? { type: "removeMerchProduct", yearId: year.id, productId: item.id }
          : { type: "removeDrink", yearId: year.id, drinkId: item.id },
      );
      if (!ok) {
        flash("Smazání se nepodařilo uložit — zkontroluj připojení", "⚠️");
        return;
      }
      flash(`„${item.name}“ smazáno z nabídky`, "🗑️");
    } finally {
      setBusy(false);
    }
  }
  // Zápis prodeje po zaplacení. Hlídá výsledek každého uložení: co se
  // nezapsalo, zůstává na účtence (po výpadku sítě jde zkusit znovu a nic
  // se nezapíše dvakrát). Merch → uzamčená zaplacená objednávka (sklad +
  // finance kategorie merch), zbytek → finance po kategoriích.
  async function settle(how: "qr" | "hotove") {
    if (!year || lines.length === 0 || busy) return;
    setBusy(true);
    try {
      const howText = how === "hotove" ? "hotově" : "QR platba";
      const merch = lines.filter((l) => l.kind === "merch");
      const written = new Set<string>();
      let ok = true;

      if (merch.length > 0) {
        const orderId = uid("mo_");
        ok = await dispatch({
          type: "addMerchOrder",
          yearId: year.id,
          id: orderId,
          name: "Prodej na místě",
          note: `markoval(a): ${me} · ${howText}`,
          items: merch.map((l) => ({ productId: l.productId!, name: l.name, size: l.size, color: l.color, price: l.price, qty: l.qty })),
        });
        if (ok) ok = await dispatch({ type: "settleMerchOrder", yearId: year.id, orderId, how: howText });
        if (ok) merch.forEach((l) => written.add(l.key));
      }
      for (const kind of ["bar", "kuchyne", "custom"] as const) {
        if (!ok) break;
        const group = lines.filter((l) => l.kind === kind);
        if (group.length === 0) continue;
        ok = await dispatch({
          type: "addFinance",
          yearId: year.id,
          kind: "prijem",
          label: "Prodej na místě",
          amount: group.reduce((s, l) => s + l.price * l.qty, 0),
          category: KIND_CATEGORY[kind],
          who: me,
          paid: true,
          date: todayISO(),
          note: group.map((l) => `${l.qty}× ${lineLabel(l)}`).join(", ") + ` · ${howText}`,
        });
        if (ok) group.forEach((l) => written.add(l.key));
      }

      if (!ok) {
        setLines((prev) => prev.filter((l) => !written.has(l.key)));
        flash("Nezapsáno — zkontroluj připojení a zkus to znovu", "⚠️");
        return;
      }

      // „Top sellers first": započítej prodané kusy pro řazení dlaždic.
      const t = { ...tally };
      for (const l of lines) if (l.productId) t[l.productId] = (t[l.productId] ?? 0) + l.qty;
      setTally(t);
      localStorage.setItem(LS_TALLY, JSON.stringify(t));

      setLastSale(lines);
      setLines([]);
      setQrOpen(false);
      setCashOpen(false);
      flash(`Zaplaceno ${fmtCZK(total)} (${howText}) — zapsáno`, "💰");
    } finally {
      setBusy(false);
    }
  }

  // Zaplacení čekající objednávky (z webu / odložené): uzamkne ji jako
  // zaplacenou a tržba se propíše do financí (kategorie merch).
  async function settleExistingOrder(order: MerchOrder, how: "qr" | "hotove") {
    if (!year || busy) return;
    setBusy(true);
    try {
      const howText = how === "hotove" ? "hotově" : "QR platba";
      if (!(await dispatch({ type: "settleMerchOrder", yearId: year.id, orderId: order.id, how: howText }))) {
        flash("Nezapsáno — zkontroluj připojení a zkus to znovu", "⚠️");
        return;
      }
      setPayOrder(null);
      setCashOrder(null);
      flash(`Zaplaceno ${fmtCZK(orderTotal(order, year.merch ?? []))} (${howText}) — objednávka ${order.name} vyřízena`, "💰");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4 pb-16 tabular-nums md:pb-0">
      <div>
        <div className="flex items-center justify-between gap-3">
          <h1 className="font-display text-[28px] font-bold tracking-tight">Prodej</h1>
          {/* Jednotná kasa pro celý prodej: otevřít → přes den → uzavřít */}
          <KasaControl year={{ id: year.id, cashboxes: year.cashboxes ?? [] }} cashMarked={stats.cash} />
        </div>
        {/* Účet pro QR — malý, ať nepřekáží; správce ho upraví ťuknutím */}
        <div className="mt-1">
          <AccountChip admin={admin} account={account} accountOk={accountOk} yearId={year.id} />
        </div>
      </div>

      {/* Účtenka — kompaktní, hned pod nadpisem; vidět od začátku (i prázdná).
          Prázdná ukazuje vizuální návod „co ťuknout" ve třech krocích. */}
      <section className="card p-3">
          {lines.length === 0 ? (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-ink-soft">🧾 Účtenka je prázdná</span>
                {lastSale && (
                  <button className="btn-secondary px-3 py-1.5 text-sm" onClick={() => setLines(lastSale)}>
                    ↻ Zopakovat poslední
                  </button>
                )}
              </div>
              {/* Tři kroky prodeje — obsluha hned vidí, co ťuknout (1. krok svítí zlatě) */}
              <ol className="flex flex-wrap items-center gap-1.5 text-xs font-medium">
                <li className="inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-2.5 py-1 text-ink">
                  <span className="grid h-4 w-4 place-items-center rounded-full bg-gold-500 text-[10px] font-bold text-[#1d1d1f]">1</span>
                  Ťukni na položky ↓
                </li>
                <span aria-hidden className="text-ink-soft/40">→</span>
                <li className="inline-flex items-center gap-1.5 rounded-full bg-paper2 px-2.5 py-1 text-ink-soft">
                  <span className="grid h-4 w-4 place-items-center rounded-full bg-ink/10 text-[10px] font-bold">2</span>
                  Vyber QR / hotově
                </li>
                <span aria-hidden className="text-ink-soft/40">→</span>
                <li className="inline-flex items-center gap-1.5 rounded-full bg-paper2 px-2.5 py-1 text-ink-soft">
                  <span className="grid h-4 w-4 place-items-center rounded-full bg-ink/10 text-[10px] font-bold">3</span>
                  Zaplaceno ✓
                </li>
              </ol>
            </div>
          ) : (
            <>
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-ink-soft">🧾 Účtenka · {lines.reduce((s, l) => s + l.qty, 0)} ks</span>
                <button
                  className="rounded-full px-2.5 py-1 text-xs font-medium text-ink-soft transition hover:bg-ink/[0.06] hover:text-ink"
                  onClick={() => setLines([])}
                  aria-label="Vyčistit účtenku"
                >
                  Vyčistit ✕
                </button>
              </div>
              <div className="divide-y divide-ink/[0.06]">
                {lines.map((l) => (
                  <div key={l.key} className="flex min-h-9 items-center gap-2 py-1 text-sm">
                    <span className="min-w-0 flex-1 truncate font-medium">{lineLabel(l)}</span>
                    <div className="flex items-center gap-0.5">
                      <button className="grid h-7 w-7 place-items-center rounded-full bg-paper2 leading-none hover:bg-ink/10" onClick={() => bump(l.key, -1)} aria-label="Ubrat">
                        −
                      </button>
                      <span className="w-6 text-center font-semibold">{l.qty}</span>
                      <button className="grid h-7 w-7 place-items-center rounded-full bg-paper2 leading-none hover:bg-ink/10" onClick={() => bump(l.key, 1)} aria-label="Přidat">
                        +
                      </button>
                    </div>
                    <span className="w-16 text-right font-semibold">{fmtCZK(l.price * l.qty)}</span>
                  </div>
                ))}
              </div>
              {/* Platba — velká částka + dvě velká tlačítka vedle sebe, ať je jasné,
                  co ťuknout dál (QR pro kartu / hotově pro peníze). */}
              <div className="mt-2 border-t border-ink/10 pt-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-ink-soft">Celkem</span>
                  <span className="font-display text-2xl font-bold tracking-tight">{fmtCZK(total)}</span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button className="btn-primary min-h-12 text-[15px]" disabled={total <= 0 || !accountOk || busy} onClick={() => setQrOpen(true)}>
                    QR platba
                  </button>
                  <button className="btn-secondary min-h-12 text-[15px]" disabled={total <= 0 || busy} onClick={() => setCashOpen(true)}>
                    💵 Hotově
                  </button>
                </div>
                {total > 0 && !accountOk && (
                  <p className="mt-1.5 text-center text-xs text-ink-soft">QR platba se odemkne, jakmile správce nahoře nastaví účet.</p>
                )}
              </div>
            </>
          )}
      </section>

      {/* Výběr stánku (desktop) — na mobilu je dole ve žluté bublině */}
      <div className="hidden gap-1.5 md:flex">
        {STANDS.map((s) => (
          <button
            key={s.id}
            onClick={() => pickStand(s.id)}
            className={`min-h-10 shrink-0 rounded-full px-4 text-[15px] font-semibold transition ${
              stand === s.id ? "bg-gold-500 text-[#1d1d1f] shadow-sm" : "bg-paper2 text-ink-soft hover:bg-gold-100"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Čekající objednávky merche — QR platba se jménem objednatele */}
      {pendingOrders.length > 0 && (
        <section className="card border-l-4 border-l-amber-400 p-4">
          <h2 className="flex items-center gap-2 font-display text-[20px] font-semibold">
            🧾 Objednávky k zaplacení
            <span className="grid h-7 min-w-7 place-items-center rounded-full bg-gold-500 px-2 font-display text-sm font-bold text-[#1d1d1f]">
              {pendingOrders.length}
            </span>
          </h2>
          <div className="mt-1 divide-y divide-ink/[0.06]">
            {pendingOrders.map((o) => {
              const t = orderTotal(o, year.merch ?? []);
              return (
                <div key={o.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-semibold">{o.name}</p>
                    <p className="truncate text-xs text-ink-soft">{orderItemsText(o)}</p>
                  </div>
                  <span className="text-[15px] font-semibold">{fmtCZK(t)}</span>
                  <div className="flex shrink-0 gap-1.5">
                    {t > 0 && accountOk && (
                      <button
                        className="min-h-9 rounded-full bg-gold-500 px-3.5 text-sm font-semibold text-[#1d1d1f] transition hover:bg-gold-400"
                        disabled={busy}
                        onClick={() => setPayOrder(o)}
                      >
                        QR
                      </button>
                    )}
                    <button
                      className="min-h-9 rounded-full bg-paper2 px-3.5 text-sm font-semibold transition hover:bg-gold-100"
                      disabled={busy}
                      onClick={() => setCashOrder(o)}
                    >
                      💵 Hotově
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Nabídka stánku — nové položky s cenou se tu objeví samy */}
      {grids.map((g, gi) =>
        g.items.length > 0 ? (
          <section key={g.kind} className="card p-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display text-[20px] font-semibold">{g.title}</h2>
              {/* Úprava nabídky (jen správce): v režimu Upravit dlaždice mažou */}
              {admin && gi === firstNonEmpty && (
                <button
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    editNabidka ? "bg-red-600 text-white hover:bg-red-500" : "bg-paper2 text-ink-soft hover:bg-gold-100"
                  }`}
                  aria-pressed={editNabidka}
                  onClick={() => setEditNabidka((v) => !v)}
                >
                  {editNabidka ? "Hotovo" : "Upravit nabídku"}
                </button>
              )}
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {g.items.map((i) => (
                <button
                  key={i.id}
                  onClick={() => (editNabidka ? removeItem(g.kind, i) : tapItem(g.kind, i))}
                  className={`flex min-h-14 items-center justify-between gap-2 rounded-lg border-l-4 px-3 py-2.5 text-left transition active:scale-[0.97] ${
                    editNabidka
                      ? "border-l-red-400 bg-red-50 ring-1 ring-red-200 hover:bg-red-100"
                      : `bg-paper2 hover:bg-gold-100 ${KIND_BORDER[g.kind]}`
                  }`}
                >
                  <span className="min-w-0 truncate text-[15px] font-semibold">{i.name}</span>
                  {editNabidka ? (
                    <span className="shrink-0 text-sm font-bold text-red-600">✕ Smazat</span>
                  ) : (
                    // Cena jako zdvižená „přidávací" pilulka s +, ať je jasné, že ťuknutí položku přidá.
                    <span className="shrink-0 rounded-full bg-surface px-2.5 py-1 text-sm font-bold text-ink shadow-sm ring-1 ring-ink/5">
                      + {fmtCZK(i.price)}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </section>
        ) : (
          <section key={g.kind} className="card grid place-items-center gap-2 p-6 text-center">
            <p className="text-sm text-ink-soft">{EMPTY_HINT[g.kind].text} S cenou se tu objeví sama.</p>
            <Link href={EMPTY_HINT[g.kind].href} className="btn-secondary">
              {EMPTY_HINT[g.kind].cta} →
            </Link>
          </section>
        ),
      )}

      {/* Doptání na velikost/barvu (merch s variantami) */}
      {picker && pickerProduct && (
        <div className="card border border-gold-300 bg-gold-50 p-4">
          <p className="text-sm font-semibold">{pickerProduct.name}</p>
          {(pickerProduct.sizes?.length ?? 0) > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {pickerProduct.sizes!.map((s) => (
                <button
                  key={s}
                  onClick={() => setPicker((p) => p && { ...p, size: p.size === s ? undefined : s })}
                  className={`min-h-9 rounded-full px-3 text-sm font-semibold transition ${
                    picker.size === s ? "bg-gold-500 text-[#1d1d1f]" : "bg-paper2 hover:bg-gold-100"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          {(pickerProduct.colors?.length ?? 0) > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {pickerProduct.colors!.map((c) => (
                <button
                  key={c}
                  onClick={() => setPicker((p) => p && { ...p, color: p.color === c ? undefined : c })}
                  className={`min-h-9 rounded-full px-3 text-sm font-semibold transition ${
                    picker.color === c ? "bg-gold-500 text-[#1d1d1f]" : "bg-paper2 hover:bg-gold-100"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
          <div className="mt-2 flex gap-2">
            <button className="btn-primary flex-1" onClick={confirmPicker} disabled={(pickerProduct.sizes?.length ?? 0) > 0 && !picker.size}>
              Přidat na účtenku
            </button>
            <button className="btn-ghost" onClick={() => setPicker(null)}>
              Zrušit
            </button>
          </div>
        </div>
      )}

      {/* ---------- Přehled dne ---------- */}
      <h2 className="pt-2 text-xs font-semibold uppercase tracking-wider text-ink-soft/70">Přehled dne</h2>

      {/* Statistiky (čísla) jen správci; ostatní vidí jen historii objednávek. */}
      {admin ? (
        <section className="card p-4">
          <h3 className="font-display text-[20px] font-semibold">📊 Statistiky dne</h3>
          {stats.total === 0 ? (
            <p className="mt-1 text-sm text-ink-soft">Zatím nic — první prodej se tu hned ukáže.</p>
          ) : (
            <>
              <div className="mt-2 flex flex-wrap items-baseline gap-x-5 gap-y-1">
                <span className="font-display text-[28px] font-bold tracking-tight">{fmtCZK(stats.total)}</span>
                <span className="text-sm text-ink-soft">
                  QR <strong className="text-ink">{fmtCZK(stats.qr)}</strong>
                </span>
                <span className="text-sm text-ink-soft">
                  💵 hotově <strong className="text-ink">{fmtCZK(stats.cash)}</strong>
                </span>
                <span className="text-sm text-ink-soft">{stats.count}× prodej</span>
              </div>
              {stats.byCat.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {stats.byCat.map((x) => (
                    <span key={x.cat} className="chip">
                      {x.cat} {fmtCZK(x.sum)}
                    </span>
                  ))}
                </div>
              )}
              {stats.top.length > 0 && (
                <p className="mt-2 text-sm text-ink-soft">
                  Nejprodávanější: {stats.top.map((t) => `${t.qty}× ${t.name}`).join(" · ")}
                </p>
              )}
              <OrderHistory orders={posOrders(dayFinances)} />
            </>
          )}
        </section>
      ) : (
        <section className="card p-4">
          {posOrders(dayFinances).length === 0 ? (
            <>
              <h3 className="font-display text-[20px] font-semibold">🧾 Objednávky dne</h3>
              <p className="mt-1 text-sm text-ink-soft">Zatím žádná objednávka — první prodej se tu hned ukáže.</p>
            </>
          ) : (
            <OrderHistory orders={posOrders(dayFinances)} label="Objednávky dne" defaultOpen topBorder={false} />
          )}
        </section>
      )}

      {/* Stánky (mobil) — svítící žlutá bublina nad hlavní lištou; pomocník
          u stánku lištu nemá, takže bublina sedí přímo dole na jejím místě */}
      <div
        className={`fixed inset-x-3 z-40 md:hidden ${
          posOnly ? "bottom-[calc(0.75rem+env(safe-area-inset-bottom))]" : "bottom-[calc(5.1rem+env(safe-area-inset-bottom))]"
        }`}
      >
        <div className="mx-auto max-w-3xl">
          <div className="grid grid-cols-3 gap-1 rounded-[28px] bg-gold-500 p-1.5 shadow-[0_0_24px_rgba(244,183,31,0.65)]">
            {STANDS.map((s) => (
              <button
                key={s.id}
                onClick={() => pickStand(s.id)}
                className={`${posOnly ? "min-h-14 text-base" : "min-h-11 text-[15px]"} rounded-full font-semibold transition ${
                  stand === s.id ? "bg-[#1d1d1f] text-gold-300" : "text-[#1d1d1f] active:scale-[0.97]"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* QR platba čekající objednávky — se jménem objednatele ve zprávě */}
      <Modal open={!!payOrder} onClose={() => setPayOrder(null)} title={payOrder ? `Platba — ${payOrder.name}` : ""}>
        {payOrder && (
          <div className="space-y-4">
            <PayQr
              account={account}
              amount={orderTotal(payOrder, year.merch ?? [])}
              message={`MARENA MERCH ${orderItemsText(payOrder)} — ${payOrder.name}`}
            />
            <p className="text-center text-xs text-ink-soft">
              „Zaplaceno“ ťukni, až přijde notifikace tvé banky — obrazovka zákazníka není důkaz.
            </p>
            <div className="flex gap-2">
              <button className="btn-primary flex-1" disabled={busy} onClick={() => settleExistingOrder(payOrder, "qr")}>
                ✓ Zaplaceno — zapsat
              </button>
              <button className="btn-ghost" onClick={() => setPayOrder(null)}>
                Zrušit
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* QR platba — zákazník skenuje, obsluha po zaplacení potvrdí. */}
      <Modal open={qrOpen} onClose={() => setQrOpen(false)} title="Zaplať naskenováním">
        <div className="space-y-4">
          <PayQr account={account} amount={total} message={qrMessage} />
          <p className="text-center text-xs text-ink-soft">
            „Zaplaceno“ ťukni, až přijde notifikace tvé banky — obrazovka zákazníka není důkaz.
          </p>
          <div className="flex gap-2">
            <button className="btn-primary flex-1" disabled={busy} onClick={() => settle("qr")}>
              ✓ Zaplaceno — zapsat
            </button>
            <button className="btn-ghost" onClick={() => setQrOpen(false)}>
              Zrušit
            </button>
          </div>
        </div>
      </Modal>

      {/* Hotovost za účtenku — kolik dal zákazník → kolik vrátit */}
      {cashOpen && <CashModal amount={total} busy={busy} onConfirm={() => settle("hotove")} onClose={() => setCashOpen(false)} />}
      {/* Hotovost za čekající objednávku */}
      {cashOrder && (
        <CashModal
          amount={orderTotal(cashOrder, year.merch ?? [])}
          busy={busy}
          onConfirm={() => settleExistingOrder(cashOrder, "hotove")}
          onClose={() => setCashOrder(null)}
        />
      )}
    </div>
  );
}

// Platba hotově — stejné okno jako u QR: velká částka, pole „kolik dal
// zákazník" a hned spočítané vrácení; potvrzuje se „Zaplaceno — zapsat".
function CashModal({ amount, busy, onConfirm, onClose }: { amount: number; busy: boolean; onConfirm: () => void; onClose: () => void }) {
  const [given, setGiven] = useState("");
  const n = Math.round(Number(given.replace(/\s/g, "").replace(",", ".")));
  const hasGiven = given.trim() !== "" && Number.isFinite(n);
  const change = hasGiven ? n - amount : null;
  // Rychlé bankovky: „přesně" + nejbližší papírky nad částkou.
  const notes = [100, 200, 500, 1000, 2000].filter((v) => v > amount).slice(0, 3);

  return (
    <Modal open onClose={onClose} title="Platba hotově">
      <div className="space-y-4">
        <p className="text-center font-display text-3xl font-bold tracking-tight">{fmtCZK(amount)}</p>
        <div>
          <label className="label">Kolik dal zákazník? (Kč)</label>
          <input
            className="input"
            inputMode="numeric"
            placeholder={`např. ${amount}`}
            value={given}
            onChange={(e) => setGiven(e.target.value)}
            autoFocus
          />
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <button type="button" className="chip hover:bg-gold-100" onClick={() => setGiven(String(amount))}>
              Přesně
            </button>
            {notes.map((v) => (
              <button key={v} type="button" className="chip hover:bg-gold-100" onClick={() => setGiven(String(v))}>
                {v} Kč
              </button>
            ))}
          </div>
        </div>
        {hasGiven &&
          (change! >= 0 ? (
            <p className="rounded-xl bg-leaf/10 px-3 py-3 text-center font-display text-xl font-bold text-leaf-700">
              Vrátit {fmtCZK(change!)}
            </p>
          ) : (
            <p className="rounded-xl bg-red-50 px-3 py-2.5 text-center text-sm font-semibold text-red-600">
              Chybí {fmtCZK(-change!)} — zákazník dal málo
            </p>
          ))}
        <div className="flex gap-2">
          <button className="btn-primary flex-1" disabled={busy || (hasGiven && change! < 0)} onClick={onConfirm}>
            ✓ Zaplaceno — zapsat
          </button>
          <button className="btn-ghost" onClick={onClose}>
            Zrušit
          </button>
        </div>
      </div>
    </Modal>
  );
}

// Brána dne: bez otevřené kasy se neprodává. Založí nový den (ranní
// vklad do kasy) a pod tím ukazuje uzamčené (uzavřené) dny se
// statistikami prodeje — tržby, QR vs. hotovost, kategorie, top položky.
function DayGate({
  yearId,
  cashboxes,
  finances,
  admin,
  account,
  accountOk,
}: {
  yearId: string;
  cashboxes: Cashbox[];
  finances: FinanceItem[];
  admin: boolean;
  account: string;
  accountOk: boolean;
}) {
  const { dispatch } = useStore();
  const [opening, setOpening] = useState("");
  const [busy, setBusy] = useState(false);
  const closed = cashboxes.filter((c) => c.closedAt).sort((a, b) => b.openedAt.localeCompare(a.openedAt));

  async function openDay() {
    const n = Math.round(Number(opening.replace(/\s/g, "").replace(",", ".")));
    if (opening.trim() === "" || !Number.isFinite(n) || n < 0 || busy) return;
    setBusy(true);
    try {
      if (!(await dispatch({ type: "openCashbox", yearId, opening: n }))) {
        flash("Den se nepodařilo založit — zkontroluj připojení", "⚠️");
        return;
      }
      flash(`Den založen — kasa otevřena s vkladem ${fmtCZK(n)}`, "🌞");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4 tabular-nums">
      <div>
        <h1 className="font-display text-[28px] font-bold tracking-tight">Prodej</h1>
        <p className="mt-0.5 text-sm text-ink-soft">Nový den začíná založením kasy — po uzavření se den uzamkne do statistik.</p>
        <div className="mt-1">
          <AccountChip admin={admin} account={account} accountOk={accountOk} yearId={yearId} />
        </div>
      </div>

      {/* Založení nového dne — teprve pak se prodává */}
      <section className="card border-l-4 border-l-gold-500 p-4">
        <h2 className="font-display text-[20px] font-semibold">🌞 Založit nový den</h2>
        <p className="mt-1 text-sm text-ink-soft">Vlož základ do kasy na vracení (klidně 0 Kč) a otevři den — pak se prodává.</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input
            className="input w-44"
            inputMode="numeric"
            placeholder="Ranní vklad (Kč)"
            value={opening}
            onChange={(e) => setOpening(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && openDay()}
          />
          <button className="btn-primary" onClick={openDay} disabled={!opening.trim() || busy}>
            Otevřít den
          </button>
        </div>
      </section>

      {/* Archiv: uzamčené dny se statistikami */}
      <h2 className="pt-2 text-xs font-semibold uppercase tracking-wider text-ink-soft/70">Uzavřené dny</h2>
      {closed.length === 0 ? (
        <p className="card p-4 text-sm text-ink-soft">Zatím žádný uzavřený den — po uzavření kasy se tu objeví statistiky.</p>
      ) : (
        closed.map((c, i) => {
          // Den = od otevření kasy do otevření té další (i platby přijaté
          // po uzavření, třeba QR u vyzvednutí, tak zůstanou u svého dne).
          const until = closed[i - 1]?.openedAt ?? "￿";
          const dayFin = finances.filter((f) => POS_CATS.has(f.category ?? "") && f.createdAt >= c.openedAt && f.createdAt < until);
          const stats = posStats(dayFin);
          return <DayCard key={c.id} box={c} stats={stats} orders={posOrders(dayFin)} yearId={yearId} admin={admin} />;
        })
      )}
    </div>
  );
}

// Uzamčený den: statistiky prodeje + vyúčtování kasy. Smazat den může
// jen správce — odstraní kasu dne a její zápis rozdílu ve financích
// (samotné prodeje ve financích zůstávají).
function DayCard({ box, stats, orders, yearId, admin }: { box: Cashbox; stats: ReturnType<typeof posStats>; orders: PosOrder[]; yearId: string; admin: boolean }) {
  const { dispatch } = useStore();
  const rozdil = (box.closing ?? 0) - box.opening - (box.alreadyRecorded ?? 0);
  return (
    <section className="card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-base font-semibold">📅 {fmtDate(box.openedAt)}</h3>
        <div className="flex items-center gap-2">
          <span className="chip">🔒 uzamčeno</span>
          {admin && (
            <DeleteButton
              what={`den ${fmtDate(box.openedAt)} (prodeje ve financích zůstanou)`}
              onConfirm={() => dispatch({ type: "removeCashbox", yearId, cashboxId: box.id })}
            />
          )}
        </div>
      </div>
      <div className="mt-2 flex flex-wrap items-baseline gap-x-5 gap-y-1">
        <span className="font-display text-[22px] font-bold tracking-tight">{fmtCZK(stats.total)}</span>
        <span className="text-sm text-ink-soft">
          QR <strong className="text-ink">{fmtCZK(stats.qr)}</strong>
        </span>
        <span className="text-sm text-ink-soft">
          💵 hotově <strong className="text-ink">{fmtCZK(stats.cash)}</strong>
        </span>
        <span className="text-sm text-ink-soft">{stats.count}× prodej</span>
      </div>
      {stats.byCat.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {stats.byCat.map((x) => (
            <span key={x.cat} className="chip">
              {x.cat} {fmtCZK(x.sum)}
            </span>
          ))}
        </div>
      )}
      <p className="mt-2 border-t border-ink/[0.06] pt-2 text-sm text-ink-soft">
        Kasa: vklad {fmtCZK(box.opening)} → večer {fmtCZK(box.closing ?? 0)}
        {rozdil === 0 ? (
          <span className="text-leaf-700"> · sedí ✓</span>
        ) : (
          <span className={rozdil > 0 ? "text-leaf-700" : "text-red-600"}>
            {" "}
            · rozdíl {rozdil > 0 ? "+" : "−"}{fmtCZK(Math.abs(rozdil))}
          </span>
        )}
      </p>
      {stats.top.length > 0 && (
        <p className="mt-1 text-sm text-ink-soft">Nejprodávanější: {stats.top.map((t) => `${t.qty}× ${t.name}`).join(" · ")}</p>
      )}
      <OrderHistory orders={orders} />
    </section>
  );
}

// Jednotná kasa na hotovost pro celý prodej — ovládá se vpravo nahoře:
// otevře se s ranním vkladem, přes den tlačítko ukazuje, kolik má být
// v šuplíku, večer se spočítá a uzavře. Markovaná hotovost už ve
// financích je, takže se při uzavření zapíše jen rozdíl — peníze se
// nepočítají dvakrát.
function KasaControl({ year, cashMarked }: { year: { id: string; cashboxes: Cashbox[] }; cashMarked: number }) {
  const todayCash = cashMarked;
  const { dispatch } = useStore();
  const [modal, setModal] = useState(false);
  const [opening, setOpening] = useState("");
  const [closing, setClosing] = useState("");
  const [busy, setBusy] = useState(false);
  const openBox = year.cashboxes.find((c) => !c.closedAt);
  const today = todayISO();
  const closedToday = year.cashboxes.find((c) => c.closedAt && c.closedAt.slice(0, 10) === today);
  const expected = openBox ? openBox.opening + todayCash : 0;

  async function open() {
    const n = Math.round(Number(opening.replace(/\s/g, "").replace(",", ".")));
    if (!Number.isFinite(n) || n <= 0 || busy) return;
    setBusy(true);
    try {
      if (!(await dispatch({ type: "openCashbox", yearId: year.id, opening: n }))) {
        flash("Kasu se nepodařilo uložit — zkontroluj připojení", "⚠️");
        return;
      }
      setOpening("");
      setModal(false);
      flash(`Kasa otevřena s vkladem ${fmtCZK(n)}`, "🧰");
    } finally {
      setBusy(false);
    }
  }

  async function close() {
    if (!openBox || busy) return;
    const n = Math.round(Number(closing.replace(/\s/g, "").replace(",", ".")));
    if (closing.trim() === "" || !Number.isFinite(n)) return;
    setBusy(true);
    try {
      if (!(await dispatch({ type: "closeCashbox", yearId: year.id, cashboxId: openBox.id, closing: n, alreadyRecorded: todayCash }))) {
        flash("Uzavření se nepodařilo uložit — zkontroluj připojení", "⚠️");
        return;
      }
      setClosing("");
      setModal(false);
      const diff = n - expected;
      flash(diff === 0 ? "Kasa uzavřena — sedí přesně ✓" : `Kasa uzavřena — rozdíl ${diff > 0 ? "+" : "−"}${fmtCZK(Math.abs(diff))} zapsán do financí`, "🧰");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setModal(true)}
        className={`flex min-h-11 items-center gap-2 rounded-full px-4 text-[15px] font-semibold transition ${
          openBox ? "bg-leaf/15 text-leaf-700 hover:bg-leaf/25" : "bg-paper2 text-ink hover:bg-gold-100"
        }`}
        title={openBox ? "Kasa je otevřená — ťukni pro uzavření" : "Otevřít kasu s ranním vkladem"}
      >
        🧰 {openBox ? "Uzavřít kasu" : "Otevřít kasu"}
      </button>

      <Modal open={modal} onClose={() => setModal(false)} title={openBox ? "Kasa — uzavření" : "Kasa — otevření"}>
        {openBox ? (
          <div className="space-y-3">
            <p className="text-sm text-ink-soft">
              Otevřena {fmtDateTime(openBox.openedAt)} · vklad <strong className="text-ink">{fmtCZK(openBox.opening)}</strong>
            </p>
            <p className="text-sm">
              V kase má být: vklad {fmtCZK(openBox.opening)} + hotově z prodeje {fmtCZK(todayCash)} ={" "}
              <strong className="font-display text-base">{fmtCZK(expected)}</strong>
            </p>
            <div>
              <label className="label">Spočítaný stav (Kč)</label>
              <input
                className="input"
                inputMode="numeric"
                placeholder="např. 2200"
                value={closing}
                onChange={(e) => setClosing(e.target.value)}
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && close()}
              />
            </div>
            <p className="text-xs text-ink-soft">
              Markovaná hotovost už ve financích je — při uzavření se zapíše jen případný rozdíl.
            </p>
            <div className="flex gap-2 pt-1">
              <button className="btn-primary flex-1" onClick={close} disabled={!closing.trim() || busy}>
                Uzavřít kasu
              </button>
              <button className="btn-ghost" onClick={() => setModal(false)}>
                Zavřít
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {closedToday && (
              <p className="text-sm text-leaf-700">
                ✓ Dnešní kasa už byla uzavřena ({fmtCZK(closedToday.opening)} → {fmtCZK(closedToday.closing ?? 0)}).
              </p>
            )}
            <p className="text-sm text-ink-soft">
              Kasa je jednotná pro celý prodej. Vlož základ na vracení a otevři ji — večer ji tu uzavřeš.
            </p>
            <div>
              <label className="label">Ranní vklad (Kč)</label>
              <input
                className="input"
                inputMode="numeric"
                placeholder="např. 2000"
                value={opening}
                onChange={(e) => setOpening(e.target.value)}
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && open()}
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button className="btn-primary flex-1" onClick={open} disabled={!opening.trim() || busy}>
                Otevřít kasu
              </button>
              <button className="btn-ghost" onClick={() => setModal(false)}>
                Zavřít
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

// Účet pro QR platby — nahoře jako drobný štítek, ať nepřekáží. Správci
// se ťuknutím otevře úprava (český formát i IBAN, kontrolní součty).
function AccountChip({ admin, account, accountOk, yearId }: { admin: boolean; account: string; accountOk: boolean; yearId: string }) {
  const { dispatch } = useStore();
  const [modal, setModal] = useState(false);
  const [value, setValue] = useState(account);
  const parsed = value.trim() ? parseAccount(value) : null;
  const current = accountOk ? parseAccount(account) : null;
  const short = current && !("error" in current) ? `…${current.iban.slice(-4)}` : "";
  const label = accountOk ? `🏦 účet ${short} ✓` : "⚠️ účet pro QR nenastaven";

  async function save() {
    if (!parsed || "error" in parsed) return;
    if (!(await dispatch({ type: "updateYear", yearId, patch: { paymentAccount: value.trim() } }))) {
      flash("Účet se nepodařilo uložit — zkontroluj připojení", "⚠️");
      return;
    }
    setModal(false);
    flash("Účet pro platby uložen", "🏦");
  }

  if (!admin) {
    return (
      <span className={`text-xs ${accountOk ? "text-ink-soft/80" : "text-amber-700"}`}>
        {label}
        {!accountOk && " — vybírej hotově"}
      </span>
    );
  }
  return (
    <>
      <button
        className={`rounded-full px-2.5 py-1 text-xs transition ${
          accountOk ? "bg-paper2 text-ink-soft hover:bg-gold-100" : "bg-amber-100 font-semibold text-amber-800 hover:bg-amber-200"
        }`}
        onClick={() => {
          setValue(account);
          setModal(true);
        }}
      >
        {label} · upravit
      </button>
      <Modal open={modal} onClose={() => setModal(false)} title="🏦 Účet pro QR platby">
        <div className="space-y-3">
          <p className="text-sm text-ink-soft">
            Sem chodí platby z prodeje i online objednávek merche. Zahraniční účet (IBAN, třeba Revolut) potřebuje na konci{" "}
            <strong className="text-ink">+BIC</strong> — jinak ho česká banka v QR nenačte.
          </p>
          <input
            className="input w-full"
            placeholder="123456789/0800 · IBAN CZ… · nebo LT34…5656+REVOLT21"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
          />
          {parsed && ("error" in parsed ? (
            <p className="text-sm text-red-600">{parsed.error}</p>
          ) : (
            <>
              <p className="text-sm text-leaf-700">
                ✓ Platný účet · IBAN {parsed.iban}
                {parsed.bic ? ` · BIC ${parsed.bic}` : ""}
              </p>
              {parsed.warning && (
                <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800 ring-1 ring-amber-200">⚠️ {parsed.warning}</p>
              )}
            </>
          ))}
          <div className="flex gap-2 pt-1">
            <button className="btn-primary flex-1" onClick={save} disabled={!parsed || "error" in parsed}>
              Uložit
            </button>
            <button className="btn-ghost" onClick={() => setModal(false)}>
              Zavřít
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
