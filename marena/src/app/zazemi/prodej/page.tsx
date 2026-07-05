"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Icon } from "@/components/Icons";
import { Modal } from "@/components/Modal";
import { PayQr } from "@/components/PayQr";
import { parseAccount } from "@/lib/payment";
import { fmtCZK, fmtDateTime, todayISO } from "@/lib/format";
import { uid } from "@/lib/id";
import { isAdmin } from "@/lib/admin";
import { flash } from "@/components/Flash";
import type { Cashbox, MerchOrder, MerchProduct } from "@/lib/types";

// Prodej — jednotná pokladna pro celý festival (vzor z restauračních a
// festivalových POS). Nahoře jen to, co obsluha potřebuje k prodeji:
// stánek → dlaždice → účtenka → QR/hotově. Dole „Přehled dne": tržby,
// denní kasa na hotovost a účet pro QR. Do financí se zapisuje až PO
// zaplacení, po kategoriích (merch/bar/kuchyně/kasa) + kdo a jak platil.

type Kind = "merch" | "bar" | "kuchyne" | "custom";
type Stand = "vse" | "merch" | "bar" | "kuchyne" | "ostatni";

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
  { id: "vse", label: "Vše" },
  { id: "merch", label: "🛍️ Merch" },
  { id: "bar", label: "🍸 Bar" },
  { id: "kuchyne", label: "🍳 Kuchyně" },
  { id: "ostatni", label: "➕ Ostatní" },
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
  const [stand, setStand] = useState<Stand>("vse");
  const [lines, setLines] = useState<Line[]>([]);
  const [lastSale, setLastSale] = useState<Line[] | null>(null);
  const [tally, setTally] = useState<Record<string, number>>({});
  const [picker, setPicker] = useState<{ productId: string; size?: string; color?: string } | null>(null);
  const [qrOpen, setQrOpen] = useState(false);
  const [payOrder, setPayOrder] = useState<MerchOrder | null>(null);
  const [busy, setBusy] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customPrice, setCustomPrice] = useState("");
  // Režim úprav nabídky (jen správce): dlaždice se místo markování mažou.
  const [editNabidka, setEditNabidka] = useState(false);
  const year = currentYear;
  const admin = isAdmin(me);

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
  ].filter((g) => (stand === "vse" ? true : g.kind === stand));
  const showCustom = stand === "vse" || stand === "ostatni";
  // Přepínač úprav bydlí u první neprázdné sekce nabídky.
  const firstNonEmpty = grids.findIndex((g) => g.items.length > 0);

  // Čekající objednávky merche (z webu i odložené) — platí se tady:
  // QR se jménem objednatele, nebo hotově jedním ťuknutím.
  const pendingOrders =
    stand === "vse" || stand === "merch"
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

  // Dnešní tržby z prodeje — celkem + QR vs. hotově (kolik hotovosti má
  // sedět v kase) + rozpad po kategoriích.
  const today = todayISO();
  const posCats = new Set(["merch", "bar", "kuchyně", "kasa"]);
  const todaySales = (year.finances ?? []).filter(
    (f) => f.kind === "prijem" && (f.date ?? f.createdAt.slice(0, 10)) === today && posCats.has(f.category ?? ""),
  );
  const sumBy = (pred: (note: string) => boolean) => todaySales.filter((f) => pred(f.note ?? "")).reduce((s, f) => s + f.amount, 0);
  const todayTotal = todaySales.reduce((s, f) => s + f.amount, 0);
  const todayQr = sumBy((n) => n.includes("QR platba"));
  const todayCash = sumBy((n) => n.includes("hotově"));
  const todayByCat = [...posCats]
    .map((c) => ({ cat: c, sum: todaySales.filter((f) => f.category === c).reduce((s, f) => s + f.amount, 0) }))
    .filter((x) => x.sum > 0);

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
  function addCustom() {
    const price = Math.round(Number(customPrice.replace(",", ".")));
    if (!customName.trim() || !Number.isFinite(price) || price <= 0) return;
    addLine("custom", customName.trim(), price);
    setCustomName("");
    setCustomPrice("");
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
      flash(`Zaplaceno ${fmtCZK(orderTotal(order, year.merch ?? []))} (${howText}) — objednávka ${order.name} vyřízena`, "💰");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4 tabular-nums">
      <div>
        <div className="flex items-center justify-between gap-3">
          <h1 className="font-display text-[28px] font-bold tracking-tight">Prodej</h1>
          {/* Jednotná kasa pro celý prodej: otevřít → přes den → uzavřít */}
          <KasaControl year={{ id: year.id, cashboxes: year.cashboxes ?? [] }} todayCash={todayCash} />
        </div>
        <p className="mt-0.5 text-sm text-ink-soft">1) vyber stánek · 2) ťukej položky · 3) QR nebo hotově</p>
      </div>

      {/* Výběr stánku — zařízení si volbu pamatuje */}
      <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-0.5">
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
          <p className="mt-0.5 text-xs text-ink-soft">Objednávky z webu — při vyzvednutí ukaž QR, nebo vezmi hotovost.</p>
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
                      onClick={() => settleExistingOrder(o, "hotove")}
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
            {editNabidka && gi === firstNonEmpty && (
              <p className="mt-1 text-xs text-red-600">Ťuknutím položku smažeš z nabídky (potvrdí se dotazem).</p>
            )}
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {g.items.map((i) => (
                <button
                  key={i.id}
                  onClick={() => (editNabidka ? removeItem(g.kind, i) : tapItem(g.kind, i))}
                  className={`flex min-h-12 items-center justify-between gap-2 rounded-lg border-l-4 px-3 py-2.5 text-left transition active:scale-[0.98] ${
                    editNabidka
                      ? "bg-red-50 ring-1 ring-red-200 hover:bg-red-100"
                      : `bg-paper2 hover:bg-gold-100 ${KIND_BORDER[g.kind]}`
                  } ${editNabidka ? "border-l-red-400" : ""}`}
                >
                  <span className="min-w-0 truncate text-[15px] font-semibold">{i.name}</span>
                  {editNabidka ? (
                    <span className="shrink-0 text-sm font-bold text-red-600">✕ Smazat</span>
                  ) : (
                    <span className="shrink-0 text-sm font-bold text-ink-soft">{fmtCZK(i.price)}</span>
                  )}
                </button>
              ))}
            </div>
          </section>
        ) : stand !== "vse" ? (
          <section key={g.kind} className="card grid place-items-center gap-2 p-6 text-center">
            <p className="text-sm text-ink-soft">{EMPTY_HINT[g.kind].text} S cenou se tu objeví sama.</p>
            <Link href={EMPTY_HINT[g.kind].href} className="btn-secondary">
              {EMPTY_HINT[g.kind].cta} →
            </Link>
          </section>
        ) : null,
      )}
      {stand === "vse" && grids.every((g) => g.items.length === 0) && (
        <section className="card grid place-items-center gap-2 p-6 text-center">
          <p className="text-sm text-ink-soft">
            Nabídka je zatím prázdná. Přidej produkty s prodejní cenou — objeví se tu samy.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/zazemi/merch" className="btn-secondary">Přidat merch →</Link>
            <Link href="/zazemi/kuchyne" className="btn-secondary">Přidat jídlo a pití →</Link>
          </div>
        </section>
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

      {/* Vlastní položka (vstupné, kelímek…) */}
      {showCustom && (
        <section className="card space-y-2 p-4">
          <h2 className="font-display text-[20px] font-semibold">➕ Vlastní položka</h2>
          <div className="flex flex-wrap items-center gap-2">
            <input className="input min-w-[140px] flex-1" placeholder="Co prodáváš?" value={customName} onChange={(e) => setCustomName(e.target.value)} />
            <input className="input w-28" placeholder="Kč" inputMode="numeric" value={customPrice} onChange={(e) => setCustomPrice(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addCustom()} />
            <button className="btn-secondary px-4" onClick={addCustom} disabled={!customName.trim() || !customPrice.trim()}>
              + Přidat
            </button>
          </div>
        </section>
      )}

      {/* Účtenka */}
      <section className="card p-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-[20px] font-semibold">Účtenka</h2>
          {lines.length === 0 && lastSale && (
            <button className="btn-secondary" onClick={() => setLines(lastSale)}>
              ↻ Zopakovat poslední
            </button>
          )}
        </div>
        {lines.length === 0 ? (
          <p className="mt-2 text-sm text-ink-soft">Zatím prázdná — ťukni nahoře na položky.</p>
        ) : (
          <div className="mt-2 divide-y divide-ink/[0.06]">
            {lines.map((l) => (
              <div key={l.key} className="flex min-h-11 items-center gap-2 py-1.5">
                <span className="min-w-0 flex-1 truncate text-[15px] font-medium">{lineLabel(l)}</span>
                <span className="text-sm text-ink-soft">{fmtCZK(l.price)}</span>
                <div className="flex items-center gap-1">
                  <button className="grid h-9 w-9 place-items-center rounded-full bg-paper2 text-lg leading-none hover:bg-ink/10" onClick={() => bump(l.key, -1)} aria-label="Ubrat">
                    −
                  </button>
                  <span className="w-7 text-center text-[15px] font-semibold">{l.qty}</span>
                  <button className="grid h-9 w-9 place-items-center rounded-full bg-paper2 text-lg leading-none hover:bg-ink/10" onClick={() => bump(l.key, 1)} aria-label="Přidat">
                    +
                  </button>
                </div>
                <span className="w-20 text-right text-[15px] font-semibold">{fmtCZK(l.price * l.qty)}</span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-3 flex items-center justify-between border-t border-ink/10 pt-3">
          <span className="text-[15px] font-medium text-ink-soft">Celkem</span>
          <span className="font-display text-[28px] font-bold tracking-tight">{fmtCZK(total)}</span>
        </div>

        {/* Vždy se volí, jak se platilo: QR, nebo hotově */}
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="btn-primary min-h-12 flex-1 text-base" disabled={total <= 0 || !accountOk || busy} onClick={() => setQrOpen(true)}>
            <Icon name="vote" className="h-4 w-4" /> QR platba
          </button>
          <button className="btn-secondary min-h-12 flex-1 text-base" disabled={total <= 0 || busy} onClick={() => settle("hotove")}>
            💵 Hotově — zapsat
          </button>
          {lines.length > 0 && (
            <button className="btn-ghost" onClick={() => setLines([])}>
              Vyčistit
            </button>
          )}
        </div>
        {total > 0 && !accountOk && (
          <p className="mt-2 text-xs text-ink-soft">QR platba se odemkne, jakmile správce dole nastaví účet.</p>
        )}
      </section>

      {/* ---------- Přehled dne (tržby, kasa, účet) ---------- */}
      <h2 className="pt-2 text-xs font-semibold uppercase tracking-wider text-ink-soft/70">Přehled dne</h2>

      {/* Dnešní tržby — QR vs. hotovost (tolik má sedět v kase) */}
      <section className="card p-4">
        <h3 className="font-display text-[20px] font-semibold">📊 Dnešní tržby</h3>
        {todayTotal === 0 ? (
          <p className="mt-1 text-sm text-ink-soft">Zatím nic — první prodej se tu hned ukáže.</p>
        ) : (
          <>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-5 gap-y-1">
              <span className="font-display text-[28px] font-bold tracking-tight">{fmtCZK(todayTotal)}</span>
              <span className="text-sm text-ink-soft">
                QR <strong className="text-ink">{fmtCZK(todayQr)}</strong>
              </span>
              <span className="text-sm text-ink-soft">
                💵 hotově <strong className="text-ink">{fmtCZK(todayCash)}</strong>
              </span>
            </div>
            {todayByCat.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {todayByCat.map((x) => (
                  <span key={x.cat} className="chip">
                    {x.cat} {fmtCZK(x.sum)}
                  </span>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* Účet pro QR platby (jen správce) */}
      {isAdmin(me) && <AccountSettings account={account} yearId={year.id} />}
      {!accountOk && !isAdmin(me) && (
        <p className="card p-3 text-sm text-amber-700">⚠️ Správce zatím nenastavil účet pro QR platby — zatím vybírej hotově.</p>
      )}

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
    </div>
  );
}

// Jednotná kasa na hotovost pro celý prodej — ovládá se vpravo nahoře:
// otevře se s ranním vkladem, přes den tlačítko ukazuje, kolik má být
// v šuplíku, večer se spočítá a uzavře. Markovaná hotovost už ve
// financích je, takže se při uzavření zapíše jen rozdíl — peníze se
// nepočítají dvakrát.
function KasaControl({ year, todayCash }: { year: { id: string; cashboxes: Cashbox[] }; todayCash: number }) {
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
        🧰 {openBox ? `V kase ${fmtCZK(expected)}` : "Otevřít kasu"}
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

// Nastavení účtu (jen správce) — přijme český formát i IBAN, hned ověří součty.
function AccountSettings({ account, yearId }: { account: string; yearId: string }) {
  const { dispatch } = useStore();
  const [value, setValue] = useState(account);
  const [saved, setSaved] = useState(false);
  const parsed = value.trim() ? parseAccount(value) : null;

  async function save() {
    if (!parsed || "error" in parsed) return;
    if (!(await dispatch({ type: "updateYear", yearId, patch: { paymentAccount: value.trim() } }))) {
      flash("Účet se nepodařilo uložit — zkontroluj připojení", "⚠️");
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    flash("Účet pro platby uložen", "🏦");
  }

  return (
    <section className="card space-y-2 p-4">
      <h3 className="font-display text-[20px] font-semibold">🏦 Účet pro QR platby</h3>
      <div className="flex flex-wrap items-center gap-2">
        <input
          className="input min-w-[220px] flex-1"
          placeholder="123456789/0800 nebo IBAN CZ…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button className="btn-primary px-4" onClick={save} disabled={!parsed || "error" in parsed}>
          {saved ? "✓ Uloženo" : "Uložit"}
        </button>
      </div>
      {parsed && ("error" in parsed ? (
        <p className="text-sm text-red-600">{parsed.error}</p>
      ) : (
        <p className="text-sm text-leaf-700">✓ Platný účet · IBAN {parsed.iban}</p>
      ))}
      {!value.trim() && <p className="text-sm text-ink-soft">Zadej účet, na který mají chodit platby z prodeje i online objednávek merche.</p>}
    </section>
  );
}
