"use client";

import { useEffect, useState } from "react";
import { PageTitle } from "@/components/PageTitle";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Modal } from "@/components/Modal";
import { PayQr } from "@/components/PayQr";
import { parseAccount } from "@/lib/payment";
import { fmtCZK, fmtDateTime, todayISO } from "@/lib/format";
import { uid } from "@/lib/id";
import { isAdmin } from "@/lib/admin";
import { canEditProdej } from "@/lib/access";
import { sameName } from "@/lib/names";
import { variantKey } from "@/lib/merch";
import { flash } from "@/components/Flash";
import { ReadOnlyBanner } from "@/components/ReadOnlyBanner";
import { POS_CATS, posStats, posOrders, OrderHistory, PayBreakdown, DayCard, boxDayFinances } from "@/lib/pos";
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

// POS statistiky, historie objednávek i denní karta jsou sdílené s Financemi
// (viz @/lib/pos), ať je kasa evidovaná všude stejně.

// Cena a rozpis objednávky merche — cena ze snapshotu v položce,
// jinak z aktuální nabídky (kvůli starším objednávkám).
const orderTotal = (order: MerchOrder, products: MerchProduct[]) =>
  order.items.reduce((sum, it) => sum + (it.price ?? products.find((p) => p.id === it.productId)?.price ?? 0) * it.qty, 0);
const orderItemsText = (order: MerchOrder) =>
  order.items
    .map((it) => `${it.qty}× ${it.name}${[it.size, it.color].filter(Boolean).length ? ` (${[it.size, it.color].filter(Boolean).join(" · ")})` : ""}`)
    .join(", ");

export default function ProdejPage() {
  const { currentYear, me, canEditCurrentYear } = useStore();
  if (!currentYear) return null;
  if (!canEditCurrentYear) {
    return (
      <div className="card p-6 text-center text-sm text-ink-soft">
        Prodej je jen pro aktuální ročník — uzamčené ročníky se prohlížejí.
      </div>
    );
  }
  // Prodej obsluhuje jen správce a lidé s rolí „jen Prodej"; ostatní jen náhled.
  if (!canEditProdej(currentYear, me)) {
    return <ProdejReadOnly key={currentYear.id} />;
  }
  // key: při přepnutí ročníku se rozmarkovaná účtenka zahodí.
  return <Pos key={currentYear.id} />;
}

// Náhled prodeje pro členy bez práv (nemají roli „jen Prodej" ani nejsou správce).
// Ovládat kasu nemůžou, ale vidí, jak se prodává: dnešní tržbu, objednávky dne
// a uzavřené dny. Úplně nahoře červená blikající lišta, že jde jen o náhled.
function ProdejReadOnly() {
  const { currentYear } = useStore();
  const year = currentYear;
  if (!year) return null;
  const cashboxes = year.cashboxes ?? [];
  const finances = year.finances ?? [];
  const openBox = cashboxes.find((c) => !c.closedAt);
  const closed = [...cashboxes]
    .filter((c) => c.closedAt)
    .sort((a, b) => (b.closedAt ?? "").localeCompare(a.closedAt ?? ""));
  const openFin = openBox ? boxDayFinances(finances, openBox, cashboxes) : [];
  const openStats = openBox ? posStats(openFin) : null;

  return (
    <div className="mx-auto max-w-3xl space-y-4 tabular-nums">
      <ReadOnlyBanner>
        Prodej máš jen k náhledu — kasu obsluhuje jen správce a lidé s rolí „jen Prodej“.
      </ReadOnlyBanner>
      <PageTitle>Prodej</PageTitle>

      {/* Dnešní prodej — jen čísla, bez markování */}
      {openBox && openStats ? (
        <section className="card p-4">
          <h2 className="eyebrow">Dnešní prodej</h2>
          <p className="mt-1 font-display text-2xl font-bold tracking-tight text-leaf-700">+{fmtCZK(openStats.takings)}</p>
          <div className="mt-2">
            <PayBreakdown qr={openStats.qr} cash={openStats.cash} count={openStats.count} />
          </div>
          {posOrders(openFin).length > 0 && (
            <div className="mt-3">
              <OrderHistory orders={posOrders(openFin)} label="Objednávky dne" defaultOpen topBorder canDelete={false} yearId={year.id} />
            </div>
          )}
        </section>
      ) : (
        <p className="card p-4 text-sm text-ink-soft">Právě není otevřený žádný prodejní den.</p>
      )}

      {/* Uzavřené dny — statistiky, jen ke čtení */}
      <h2 className="pt-2 eyebrow">Uzavřené dny</h2>
      {closed.length === 0 ? (
        <p className="card p-4 text-sm text-ink-soft">Zatím žádný uzavřený den.</p>
      ) : (
        closed.map((c) => {
          const dayFin = boxDayFinances(finances, c, cashboxes);
          return <DayCard key={c.id} box={c} stats={posStats(dayFin)} orders={posOrders(dayFin)} yearId={year.id} admin={false} />;
        })
      )}
    </div>
  );
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
  // Režim „Vyprodáno" (kdokoli u kasy): ťuknutím se položka vyprodá/odblokuje.
  const [soldMode, setSoldMode] = useState(false);
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
      title: "Merch",
      items: (year.merch ?? []).filter((p) => p.price != null && p.price > 0).map((p) => ({ id: p.id, name: p.name, price: p.price! })).sort(bySold),
    },
    {
      kind: "bar" as const,
      title: "Pití",
      items: (year.bar ?? [])
        .filter((d) => (d.place ?? "bar") === "bar" && d.price != null && d.price > 0)
        .map((d) => ({ id: d.id, name: d.name, price: d.price! }))
        .sort(bySold),
    },
    {
      kind: "kuchyne" as const,
      title: "Jídlo",
      items: (year.bar ?? [])
        .filter((d) => (d.place ?? "bar") === "kuchyne" && d.price != null && d.price > 0)
        .map((d) => ({ id: d.id, name: d.name, price: d.price! }))
        .sort(bySold),
    },
  ].filter((g) => g.kind === stand);
  // Přepínač úprav bydlí u první neprázdné sekce nabídky.
  const firstNonEmpty = grids.findIndex((g) => g.items.length > 0);

  // Vyprodáno: ručně (jen pro tuto kasu/den) nebo automaticky u merche podle
  // skladu (stock − prodáno ≤ 0). Prodané kusy merche počítáme z vyřízených
  // objednávek. Vyprodaná dlaždice je přeškrtnutá a nejde markovat.
  const soldOutManual = new Set(openBox.soldOut ?? []);
  const merchSold = new Map<string, number>();
  for (const o of year.merchOrders ?? []) {
    if (!o.done) continue;
    for (const it of o.items) merchSold.set(it.productId, (merchSold.get(it.productId) ?? 0) + it.qty);
  }
  // Kolik kusů merche už leží v účtence (i nezaplacené) — počítá se proti skladu,
  // ať se nedá namarkovat víc, než je skladem.
  const inCart = new Map<string, number>();
  for (const l of lines) if (l.kind === "merch" && l.productId) inCart.set(l.productId, (inCart.get(l.productId) ?? 0) + l.qty);
  // Zbývá skladem (merch se zadaným skladem): stock − prodáno − v účtence.
  // null = neomezeně (produkt bez skladu).
  function merchLeft(id: string): number | null {
    const p = (year!.merch ?? []).find((x) => x.id === id);
    if (!p || p.stock == null) return null;
    return p.stock - (merchSold.get(id) ?? 0) - (inCart.get(id) ?? 0);
  }
  // Sklad po variantách (velikost·barva): prodáno + v účtence po variantě.
  const soldVar = new Map<string, number>(); // `${productId}::velikost|barva` → prodáno
  for (const o of year.merchOrders ?? []) if (o.done) for (const it of o.items) {
    const kk = `${it.productId}::${variantKey(it.size, it.color)}`;
    soldVar.set(kk, (soldVar.get(kk) ?? 0) + it.qty);
  }
  const cartVar = new Map<string, number>();
  for (const l of lines) if (l.kind === "merch" && l.productId) {
    const kk = `${l.productId}::${variantKey(l.size, l.color)}`;
    cartVar.set(kk, (cartVar.get(kk) ?? 0) + l.qty);
  }
  // Zbývá konkrétní varianty (null = varianta bez skladu → neomezeně).
  function variantLeft(product: MerchProduct, size?: string, color?: string): number | null {
    if (!product.variantStock) return null;
    const k = variantKey(size, color);
    const kk = `${product.id}::${k}`;
    return (product.variantStock[k] ?? 0) - (soldVar.get(kk) ?? 0) - (cartVar.get(kk) ?? 0);
  }
  function isSoldOut(kind: Exclude<Kind, "custom">, id: string): boolean {
    if (soldOutManual.has(id)) return true;
    if (kind === "merch") {
      const left = merchLeft(id);
      if (left != null && left <= 0) return true;
    }
    return false;
  }
  async function toggleSoldOut(id: string) {
    if (busy) return;
    setBusy(true);
    try {
      const ok = await dispatch({ type: "toggleSoldOut", yearId: year!.id, cashboxId: openBox!.id, itemId: id });
      if (!ok) flash("Nepodařilo se uložit — zkontroluj připojení", "⚠️");
    } finally {
      setBusy(false);
    }
  }

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
    // Pojistka: vyprodané / na skladě už nic (i s ohledem na účtenku) se nepřidá.
    if (kind !== "custom" && isSoldOut(kind, item.id)) return;
    const product = kind === "merch" ? (year!.merch ?? []).find((p) => p.id === item.id) : undefined;
    if (product && ((product.sizes?.length ?? 0) > 0 || (product.colors?.length ?? 0) > 0)) {
      setPicker({ productId: product.id });
      return;
    }
    addLine(kind, item.name, item.price, item.id);
  }
  function confirmPicker() {
    if (!picker || !pickerProduct) return;
    // Pojistka na sklad: po variantě i celkově — víc než je skladem nejde přidat.
    const vLeft = variantLeft(pickerProduct, picker.size, picker.color);
    const left = vLeft != null ? vLeft : merchLeft(pickerProduct.id);
    if (left != null && left <= 0) {
      setPicker(null);
      flash("Vyprodáno — této varianty už není skladem", "📦");
      return;
    }
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
          <PageTitle>Prodej</PageTitle>
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
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-ink-soft">🧾 Účtenka je prázdná — ťukni na položky</span>
              {lastSale && (
                <button className="btn-secondary px-3 py-1.5 text-sm" onClick={() => setLines(lastSale)}>
                  ↻ Zopakovat poslední
                </button>
              )}
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
          <h2 className="flex items-center gap-2">
            <span className="eyebrow">Objednávky k zaplacení</span>
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
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="eyebrow">{g.title}</h2>
              {gi === firstNonEmpty && (
                <div className="flex items-center gap-1.5">
                  {/* Vyprodáno (kdokoli u kasy): ťuknutím se položka vyprodá/odblokuje — jen pro tento den */}
                  <button
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                      soldMode ? "bg-ink text-white hover:bg-ink/90" : "bg-paper2 text-ink-soft hover:bg-gold-100"
                    }`}
                    aria-pressed={soldMode}
                    onClick={() => {
                      setSoldMode((v) => !v);
                      setEditNabidka(false);
                    }}
                  >
                    {soldMode ? "Hotovo" : "🚫 Vyprodáno"}
                  </button>
                  {/* Úprava nabídky (jen správce): v režimu Upravit dlaždice mažou */}
                  {admin && (
                    <button
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                        editNabidka ? "bg-red-600 text-white hover:bg-red-500" : "bg-paper2 text-ink-soft hover:bg-gold-100"
                      }`}
                      aria-pressed={editNabidka}
                      onClick={() => {
                        setEditNabidka((v) => !v);
                        setSoldMode(false);
                      }}
                    >
                      {editNabidka ? "Hotovo" : "Upravit nabídku"}
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {g.items.map((i) => {
                const sold = isSoldOut(g.kind, i.id);
                const manualSold = soldOutManual.has(i.id);
                const stockSold = sold && !manualSold; // vyprodáno skladem (merch) — ručně nejde vrátit
                const left = g.kind === "merch" ? merchLeft(i.id) : null; // zbývá skladem (null = neomezeně)
                return (
                  <button
                    key={i.id}
                    onClick={() =>
                      editNabidka ? removeItem(g.kind, i) : soldMode ? toggleSoldOut(i.id) : tapItem(g.kind, i)
                    }
                    disabled={soldMode ? stockSold || busy : editNabidka ? false : sold}
                    className={`flex min-h-14 flex-col items-start justify-center gap-0.5 rounded-lg border-l-4 px-3 py-2 text-left transition active:scale-[0.97] disabled:active:scale-100 ${
                      editNabidka
                        ? "border-l-red-400 bg-red-50 ring-1 ring-red-200 hover:bg-red-100"
                        : sold
                          ? "border-l-ink/20 bg-paper2/50 opacity-60"
                          : `bg-paper2 hover:bg-gold-100 ${KIND_BORDER[g.kind]}`
                    } ${soldMode ? "ring-1 ring-ink/15" : ""}`}
                  >
                    {/* Hlavní je NÁZEV (přes celou šířku); cena a „zbývá" jsou malé pod ním. */}
                    <span className={`w-full truncate text-[15px] font-semibold leading-tight ${sold ? "text-ink-soft line-through" : ""}`}>{i.name}</span>
                    {editNabidka ? (
                      <span className="text-xs font-bold text-red-600">✕ Smazat z nabídky</span>
                    ) : soldMode ? (
                      <span className={`text-xs font-bold ${stockSold ? "text-ink-soft" : manualSold ? "text-leaf-700" : "text-ink-soft"}`}>
                        {stockSold ? "📦 sklad 0" : manualSold ? "↩︎ Vrátit" : "🚫 Vyprodat"}
                      </span>
                    ) : sold ? (
                      <span className="text-xs font-bold text-ink-soft">✕ Vyprodáno</span>
                    ) : (
                      <span className="flex w-full items-center gap-2 text-xs">
                        <span className="font-semibold text-ink-soft">+ {fmtCZK(i.price)}</span>
                        {left != null && <span className="ml-auto font-medium text-ink-soft/80">zbývá {left}</span>}
                      </span>
                    )}
                  </button>
                );
              })}
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

      {/* Doptání na velikost/barvu (merch s variantami) — u varianty se skladem
          se ukazuje „zbývá N" a vyprodané varianty nejdou vybrat. */}
      {picker && pickerProduct && (() => {
        const p = pickerProduct;
        const szs = p.sizes ?? [];
        const cols = p.colors ?? [];
        const hasVS = !!p.variantStock;
        // Zbývá pro velikost (s ohledem na zvolenou barvu / součet přes barvy).
        const sizeLeft = (s: string): number | null =>
          !hasVS ? null : cols.length === 0 ? variantLeft(p, s, undefined) : picker.color ? variantLeft(p, s, picker.color) : cols.reduce((a, c) => a + (variantLeft(p, s, c) ?? 0), 0);
        const colorLeft = (c: string): number | null =>
          !hasVS ? null : szs.length === 0 ? variantLeft(p, undefined, c) : picker.size ? variantLeft(p, picker.size, c) : szs.reduce((a, s) => a + (variantLeft(p, s, c) ?? 0), 0);
        const selLeft = variantLeft(p, picker.size, picker.color);
        const sizeMissing = szs.length > 0 && !picker.size;
        const colorMissing = cols.length > 0 && !picker.color;
        const soldSel = !sizeMissing && !colorMissing && selLeft != null && selLeft <= 0;
        return (
          <div className="card border border-gold-300 bg-gold-50 p-4">
            <p className="text-sm font-semibold">{p.name}</p>
            {szs.length > 0 && (
              <>
                <p className="mt-2 text-xs font-medium text-ink-soft">Velikost</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {szs.map((s) => {
                    const left = sizeLeft(s);
                    const off = left != null && left <= 0;
                    return (
                      <button
                        key={s}
                        disabled={off}
                        onClick={() => setPicker((pp) => pp && { ...pp, size: pp.size === s ? undefined : s })}
                        className={`min-h-9 rounded-full px-3 text-sm font-semibold transition ${
                          off ? "bg-paper2 text-ink-soft/50 line-through" : picker.size === s ? "bg-gold-500 text-[#1d1d1f]" : "bg-paper2 hover:bg-gold-100"
                        }`}
                      >
                        {s}{left != null && ` · ${Math.max(0, left)}`}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
            {cols.length > 0 && (
              <>
                <p className="mt-2 text-xs font-medium text-ink-soft">Barva</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {cols.map((c) => {
                    const left = colorLeft(c);
                    const off = left != null && left <= 0;
                    return (
                      <button
                        key={c}
                        disabled={off}
                        onClick={() => setPicker((pp) => pp && { ...pp, color: pp.color === c ? undefined : c })}
                        className={`min-h-9 rounded-full px-3 text-sm font-semibold transition ${
                          off ? "bg-paper2 text-ink-soft/50 line-through" : picker.color === c ? "bg-gold-500 text-[#1d1d1f]" : "bg-paper2 hover:bg-gold-100"
                        }`}
                      >
                        {c}{left != null && ` · ${Math.max(0, left)}`}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
            {selLeft != null && !sizeMissing && !colorMissing && (
              <p className={`mt-2 text-xs font-semibold ${soldSel ? "text-red-600" : "text-leaf-700"}`}>
                {soldSel ? "Tato varianta je vyprodaná" : `Zbývá skladem: ${selLeft}`}
              </p>
            )}
            <div className="mt-2 flex gap-2">
              <button className="btn-primary flex-1" onClick={confirmPicker} disabled={sizeMissing || colorMissing || soldSel || busy}>
                Přidat na účtenku
              </button>
              <button className="btn-ghost" onClick={() => setPicker(null)}>
                Zrušit
              </button>
            </div>
          </div>
        );
      })()}

      {/* ---------- Přehled dne ---------- */}
      <h2 className="pt-2 eyebrow">Přehled dne</h2>

      {/* U otevřené kasy jen historie objednávek — čísla (statistiky dne) jsou
          ve Financích a v archivu uzavřených dnů, ať obsluhu nerozptylují. */}
      <section className="card p-4">
        {posOrders(dayFinances).length === 0 ? (
          <>
            <h3 className="eyebrow">Objednávky dne</h3>
            <p className="mt-1 text-sm text-ink-soft">Zatím žádná objednávka — první prodej se tu hned ukáže.</p>
          </>
        ) : (
          <OrderHistory orders={posOrders(dayFinances)} label="Objednávky dne" defaultOpen topBorder={false} canDelete={admin} yearId={year.id} />
        )}
      </section>

      {/* Stánky (mobil) — svítící žlutá bublina nad hlavní lištou; pomocník
          u stánku lištu nemá, takže bublina sedí přímo dole na jejím místě */}
      <div
        className={`fixed inset-x-3 z-40 md:hidden ${
          posOnly ? "bottom-[calc(0.75rem+env(safe-area-inset-bottom))]" : "bottom-[calc(5.1rem+env(safe-area-inset-bottom))]"
        }`}
      >
        <div className="mx-auto max-w-3xl">
          <div className="drop-in-bounce grid grid-cols-3 gap-1 rounded-[28px] border-2 border-gold-500 bg-paper/95 p-1.5 shadow-lg backdrop-blur">
            {STANDS.map((s) => (
              <button
                key={s.id}
                onClick={() => pickStand(s.id)}
                className={`${posOnly ? "min-h-14 text-base" : "min-h-11 text-[15px]"} rounded-full font-semibold transition ${
                  stand === s.id ? "bg-gold-100 text-ink" : "text-ink-soft active:scale-[0.97]"
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
      <div className="space-y-4 tabular-nums">
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
        <PageTitle>Prodej</PageTitle>
        <div className="mt-1">
          <AccountChip admin={admin} account={account} accountOk={accountOk} yearId={yearId} />
        </div>
      </div>

      {/* Založení nového dne — teprve pak se prodává */}
      <section className="card border-l-4 border-l-gold-500 p-4">
        <h2 className="eyebrow">Založit nový den</h2>
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
      <h2 className="pt-2 eyebrow">Uzavřené dny</h2>
      {closed.length === 0 ? (
        <p className="card p-4 text-sm text-ink-soft">Zatím žádný uzavřený den — po uzavření kasy se tu objeví statistiky.</p>
      ) : (
        closed.map((c) => {
          const dayFin = boxDayFinances(finances, c, cashboxes);
          return <DayCard key={c.id} box={c} stats={posStats(dayFin)} orders={posOrders(dayFin)} yearId={yearId} admin={admin} />;
        })
      )}
    </div>
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
      >
        🧰 {openBox ? "Uzavřít kasu" : "Otevřít kasu"}
      </button>

      <Modal open={modal} onClose={() => setModal(false)} title={openBox ? "Kasa — uzavření" : "Kasa — otevření"}>
        {openBox ? (
          <div className="space-y-3 tabular-nums">
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
