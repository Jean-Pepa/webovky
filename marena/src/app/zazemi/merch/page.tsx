"use client";

import { useEffect, useMemo, useState } from "react";
import { PageTitle } from "@/components/PageTitle";
import { useStore } from "@/lib/store";
import { Icon } from "@/components/Icons";
import { Modal } from "@/components/Modal";
import { ImageViewer } from "@/components/ImageViewer";
import { CopyContact, copyText } from "@/components/CopyContact";
import { SearchClear } from "@/components/SearchBox";
import Link from "next/link";
import { PayQr } from "@/components/PayQr";
import { parseAccount } from "@/lib/payment";
import { DeleteButton } from "@/components/DeleteButton";
import { compressImage, saveReceipt, loadReceipt, deleteReceipt } from "@/lib/receipts";
import { fmtCZK, fmtDate, fmtDateTime } from "@/lib/format";
import { uid } from "@/lib/id";
import { canSeeMerch, variantKey, productVariants, isTicketName } from "@/lib/merch";
import { ReadOnlyBanner } from "@/components/ReadOnlyBanner";
import { isAdmin } from "@/lib/admin";
import { normName, guessGender } from "@/lib/names";
import { flash } from "@/components/Flash";
import type { MerchProduct, MerchOrder, FinanceItem } from "@/lib/types";

// Marže na kus = prodejní − nákupní cena (+ procento z prodejní). Vrací null,
// pokud některá cena chybí — pak se marže nezobrazí.
function margin(price: number, cost: number): { value: number; pct: number | null } | null {
  if (!Number.isFinite(price) || !Number.isFinite(cost)) return null;
  const value = price - cost;
  return { value, pct: price > 0 ? Math.round((value / price) * 100) : null };
}

// Sklad po variantách (velikost × barva) — mřížka číselných polí. Rodič drží
// textové vstupy, při uložení je přes collectVariantStock převede na čísla.
function VariantStockGrid({
  sizes,
  colors,
  value,
  onChange,
}: {
  sizes: string[];
  colors: string[];
  value: Record<string, string>;
  onChange: (key: string, v: string) => void;
}) {
  const variants = productVariants({ sizes, colors });
  if (variants.length === 0) return null;
  const total = variants.reduce((s, v) => s + (parseInt((value[v.key] ?? "").replace(/\s/g, ""), 10) || 0), 0);
  return (
    <div>
      <label className="label">Skladem po velikostech / barvách (ks)</label>
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
        {variants.map((v) => (
          <label key={v.key} className="flex items-center gap-1.5 rounded-lg bg-paper2 px-2 py-1.5">
            <span className="min-w-0 flex-1 truncate text-xs font-medium">{v.label}</span>
            <input
              className="w-12 shrink-0 rounded-md border border-ink/15 bg-surface px-1.5 py-1 text-center text-sm outline-none focus:border-gold-500"
              inputMode="numeric"
              placeholder="0"
              value={value[v.key] ?? ""}
              onChange={(e) => onChange(v.key, e.target.value)}
            />
          </label>
        ))}
      </div>
      <p className="mt-1 text-xs text-ink-soft">
        Celkem skladem <strong className="text-ink">{total} ks</strong> · prázdné = 0 kusů. Nech vše prázdné = neomezeně.
      </p>
    </div>
  );
}

// Textové vstupy mřížky → číselný objekt skladu (jen vyplněné/platné).
function collectVariantStock(sizes: string[], colors: string[], value: Record<string, string>): Record<string, number> | undefined {
  const out: Record<string, number> = {};
  for (const v of productVariants({ sizes, colors })) {
    const n = parseInt((value[v.key] ?? "").replace(/\s/g, ""), 10);
    if (Number.isFinite(n) && n >= 0) out[v.key] = n;
  }
  return Object.keys(out).length ? out : undefined;
}

// Cena objednávky = součet (cena za kus × počet). Cena se bere ze snapshotu
// v položce, jinak z aktuální nabídky (kvůli starším objednávkám).
function orderTotal(order: MerchOrder, products: MerchProduct[]): number {
  return order.items.reduce((sum, it) => {
    const price = it.price ?? products.find((p) => p.id === it.productId)?.price ?? 0;
    return sum + price * it.qty;
  }, 0);
}

export default function MerchPage() {
  const { currentYear, me, canEditCurrentYear } = useStore();
  // Formulář „přidat do nabídky" je schovaný, dokud ho správce nerozbalí (zabíral půl obrazovky).
  const [addOpen, setAddOpen] = useState(false);
  // Hledání v objednávkách — jméno, telefon, e-mail.
  const [q, setQ] = useState("");
  const year = currentYear;
  if (!year) return null;

  // Merch vidí každý; spravovat (přidávat/měnit) může role Merch a správce, mazat objednávky jen správce.
  const canManage = canSeeMerch(year, me) && canEditCurrentYear;
  const canDeleteOrders = isAdmin(me) && canEditCurrentYear;

  const products = year.merch ?? [];
  const orders = [...(year.merchOrders ?? [])].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  // Hledání: jméno / telefon / e-mail (bez diakritiky a velikosti písmen).
  const needle = normName(q);
  const filteredOrders = needle ? orders.filter((o) => normName(`${o.name} ${o.phone ?? ""} ${o.email ?? ""}`).includes(needle)) : orders;
  const pending = orders.filter((o) => !o.done).length;
  // Objednávky vs. lístky: jedna objednávka může mít víc lístků (nebo žádný — jen merch).
  const isTicketItem = (it: MerchOrder["items"][number]) => isTicketName(it.name) || isTicketName(products.find((p) => p.id === it.productId)?.name ?? "");
  const ticketQty = (list: MerchOrder[]) => list.reduce((s, o) => s + o.items.filter(isTicketItem).reduce((q, it) => q + it.qty, 0), 0);
  const tickets = { total: ticketQty(orders), paid: ticketQty(orders.filter((o) => o.done)), pending: ticketQty(orders.filter((o) => !o.done)) };
  const ticketOrderList = orders.filter((o) => o.items.some(isTicketItem));
  const ticketOrders = ticketOrderList.length;
  // Lístky prodané na místě (stánek „Lístky na místě" v Prodeji) — položka nese „(na místě)".
  const onsiteQty = orders.reduce((s, o) => s + o.items.filter((it) => isTicketItem(it) && /\(na místě\)\s*$/.test(it.name)).reduce((q, it) => q + it.qty, 0), 0);
  // Kontakty lidí s lístkem na hromadnou zprávu — e-maily (skrytá kopie), telefony (SMS)
  // a jména (seznam na vstup). Bez duplicit; zvlášť „všichni" a „jen nezaplacené".
  const phoneKey = (t: string) => t.replace(/\D/g, "").replace(/^(00420|420)(?=\d{9}$)/, "");
  const contactsOf = (list: MerchOrder[]) => ({
    emails: [...new Set(list.map((o) => (o.email ?? "").trim().toLowerCase()).filter((e) => e.includes("@")))],
    noEmail: list.filter((o) => !(o.email ?? "").includes("@")).length,
    // stejné číslo s +420 i bez se počítá jednou, jinak jak bylo zadané
    phones: [...new Map(list.map((o) => (o.phone ?? "").trim()).filter((t) => phoneKey(t).length >= 9).map((t) => [phoneKey(t), t])).values()],
    noPhone: list.filter((o) => phoneKey(o.phone ?? "").length < 9).length,
    // abecedně, u víc lístků v jedné objednávce „×2"
    names: list
      .map((o) => ({ name: o.name.trim(), qty: o.items.filter(isTicketItem).reduce((q, it) => q + it.qty, 0) }))
      .filter((n) => n.name)
      .sort((a, b) => normName(a.name).localeCompare(normName(b.name), "cs"))
      .map((n) => (n.qty > 1 ? `${n.name} ×${n.qty}` : n.name)),
  });
  const allC = contactsOf(ticketOrderList);
  const unpaidC = contactsOf(ticketOrderList.filter((o) => !o.done));
  const ticketEmails = allC.emails;
  const ticketNoEmail = allC.noEmail;
  const ticketPhones = allC.phones;
  const ticketNoPhone = allC.noPhone;
  const ticketNames = allC.names;
  // Zkopíruje seznam a ohlásí to.
  const copyList = async (items: string[], sep: string, what: string, emoji: string) => {
    const ok = await copyText(items.join(sep));
    flash(ok ? `Zkopírováno ${items.length} ${what}` : "Kopírování se nepovedlo", ok ? emoji : "⚠️");
  };
  // Holky / kluci — odhad podle jména (příjmení -ová/-á, křestní -a…). Jen orientačně.
  const gender = ticketOrderList.reduce(
    (acc, o) => {
      const g = guessGender(o.name);
      acc[g].all += 1;
      if (o.done) acc[g].paid += 1;
      return acc;
    },
    { f: { all: 0, paid: 0 }, m: { all: 0, paid: 0 }, "?": { all: 0, paid: 0 } },
  );
  const doneCount = orders.length - pending;
  const totalQty = orders.reduce((s, o) => s + o.items.reduce((q, it) => q + it.qty, 0), 0);
  const revenue = orders.reduce((s, o) => s + orderTotal(o, products), 0);
  const doneRevenue = orders.filter((o) => o.done).reduce((s, o) => s + orderTotal(o, products), 0);
  // Prodáno na produkt (a po variantách) — pro „skladem / zbývá" přímo u karty.
  const soldByProduct = new Map<string, number>();
  const soldByVariant = new Map<string, Map<string, number>>();
  // Kolik OBJEDNÁVEK produkt obsahuje — „prodáno" jsou kusy (jedna objednávka
  // může mít 2 lístky), tak se ukazuje obojí, ať čísla nematou.
  const ordersByProduct = new Map<string, number>();
  for (const o of orders)
    for (const it of o.items) {
      soldByProduct.set(it.productId, (soldByProduct.get(it.productId) ?? 0) + it.qty);
      if (!o.items.slice(0, o.items.indexOf(it)).some((x) => x.productId === it.productId)) {
        ordersByProduct.set(it.productId, (ordersByProduct.get(it.productId) ?? 0) + 1);
      }
      const m = soldByVariant.get(it.productId) ?? new Map<string, number>();
      const k = variantKey(it.size, it.color);
      m.set(k, (m.get(k) ?? 0) + it.qty);
      soldByVariant.set(it.productId, m);
    }

  return (
    <div className="space-y-6 tabular-nums">
      {/* Upozornění „jen náhled" úplně nahoře, červeně (uzamčený ročník řeší
          globální proužek v layoutu). */}
      {canEditCurrentYear && !canManage && (
        <ReadOnlyBanner>Lístky & merch máš jen k náhledu — spravovat nabídku může jen role Merch a správce.</ReadOnlyBanner>
      )}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <PageTitle>Lístky & merch</PageTitle>
        </div>
        {/* Prodej na místě probíhá v jednotné pokladně (předvolí merch);
            zaplacený prodej se sem vrátí jako uzamčená objednávka. */}
        {canEditCurrentYear && (
          <Link href="/zazemi/prodej?stand=merch" className="btn-primary">
            🛒 Prodat na místě
          </Link>
        )}
      </div>

      {/* Nabídka (fotky merche) */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="eyebrow">Nabídka</h2>
          {canManage && (
            <button
              type="button"
              onClick={() => setAddOpen((v) => !v)}
              aria-expanded={addOpen}
              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${addOpen ? "bg-paper2 text-ink-soft hover:bg-gold-100" : "bg-gold-grad text-[#1d1d1f] shadow-sm"}`}
            >
              {addOpen ? "Skrýt přidávání" : "+ Přidat do nabídky"}
            </button>
          )}
        </div>
        {canManage && addOpen && <AddProduct yearId={year.id} />}
        {products.length === 0 ? (
          <div className="empty-state">
            {canManage ? "Zatím žádný merch. Nahraj první kousek." : "Zatím tu není žádný merch."}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} yearId={year.id} editable={canManage} sold={soldByProduct.get(p.id) ?? 0} orderCount={ordersByProduct.get(p.id) ?? 0} soldVariant={soldByVariant.get(p.id)} />
            ))}
          </div>
        )}
      </section>

      {/* Objednávky + QR */}
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <section className="space-y-3">
          <h2 className="flex flex-wrap items-center gap-2 eyebrow">
            Objednávky
            <span className="grid h-8 min-w-8 place-items-center rounded-full bg-gold-500 px-2.5 font-display text-base font-bold text-[#1d1d1f]">
              {orders.length}
            </span>
            {pending > 0 && (
              <span className="badge bg-amber-100 text-amber-800">{pending} čeká</span>
            )}
          </h2>
          {/* Objednávky vs. lístky — ať je jasné, kolik lidí vs. kolik vstupenek */}
          {tickets.total > 0 && (
            <div className="grid grid-cols-2 gap-2 rounded-xl border border-ink/[0.06] bg-surface p-3 text-sm sm:grid-cols-4">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wide text-ink-soft">Objednávek s lístkem</p>
                <p className="font-display text-lg font-bold">{ticketOrders}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wide text-ink-soft">Lístků celkem</p>
                <p className="font-display text-lg font-bold">
                  🎟️ {tickets.total} ks
                  {onsiteQty > 0 && <span className="ml-1.5 rounded-full bg-fuchsia-100 px-2 py-0.5 text-xs font-semibold text-fuchsia-800">🎫 na místě {onsiteQty}</span>}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wide text-ink-soft">Zaplaceno</p>
                <p className="font-display text-lg font-bold text-leaf-700">{tickets.paid} ks</p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wide text-ink-soft">Čeká na zaplacení</p>
                <p className={`font-display text-lg font-bold ${tickets.pending > 0 ? "text-amber-800" : ""}`}>{tickets.pending} ks</p>
              </div>
              {/* Kdo kupuje — holky / kluci podle jména (orientační; příjmení -ová/-á, křestní -a…) */}
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wide text-ink-soft">👩 Holky</p>
                <p className="font-display text-lg font-bold">
                  {gender.f.all} <span className="text-xs font-normal text-ink-soft">zaplaceno {gender.f.paid}</span>
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wide text-ink-soft">👨 Kluci</p>
                <p className="font-display text-lg font-bold">
                  {gender.m.all} <span className="text-xs font-normal text-ink-soft">zaplaceno {gender.m.paid}</span>
                </p>
              </div>
              <p className="col-span-2 -mt-1 text-[11px] text-ink-soft sm:col-span-4">
                odhad podle jména, počítá lidi (objednávky s lístkem)
                {gender["?"].all > 0 && ` · ${gender["?"].all} nejasné`}
              </p>
              {/* Hromadná zpráva všem s lístkem: telefony (SMS), jména (seznam), e-maily (skrytá kopie).
                  U každého i varianta „jen nezaplacené" — třeba upomínka lidem, co ještě nezaplatili. */}
              <div className="col-span-2 space-y-2 border-t border-ink/[0.06] pt-2 sm:col-span-4">
                {[
                  {
                    key: "phones",
                    icon: "📱",
                    label: "Kopírovat telefony k lístkům",
                    what: "telefonů k lístkům",
                    sep: ", ",
                    all: ticketPhones,
                    unpaid: unpaidC.phones,
                    hint: `na hromadnou SMS${ticketNoPhone > 0 ? ` · ${ticketNoPhone} obj. bez telefonu` : ""}`,
                    title: "Zkopíruje telefony všech, kdo mají v objednávce lístek (zaplacené i čekající) — na hromadnou SMS",
                  },
                  {
                    key: "names",
                    icon: "👤",
                    label: "Kopírovat jména k lístkům",
                    what: "jmen k lístkům",
                    sep: "\n",
                    all: ticketNames,
                    unpaid: unpaidC.names,
                    hint: "abecedně, každé na řádek · seznam na vstup",
                    title: "Zkopíruje jména všech, kdo mají v objednávce lístek — abecedně, každé na řádek, u víc lístků ×počet",
                  },
                  {
                    key: "emails",
                    icon: "📧",
                    label: "Kopírovat e-maily k lístkům",
                    what: "e-mailů k lístkům",
                    sep: ", ",
                    all: ticketEmails,
                    unpaid: unpaidC.emails,
                    hint: `na hromadnou zprávu · vlož do skryté kopie${ticketNoEmail > 0 ? ` · ${ticketNoEmail} obj. bez e-mailu` : ""}`,
                    title: "Zkopíruje e-maily všech, kdo mají v objednávce lístek (zaplacené i čekající) — vlož je do skryté kopie hromadného e-mailu",
                  },
                ].map((row) => (
                  <div key={row.key} className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <button
                      type="button"
                      className="chip transition hover:bg-gold-100 disabled:opacity-50"
                      disabled={row.all.length === 0}
                      title={row.title}
                      onClick={() => copyList(row.all, row.sep, row.what, row.icon)}
                    >
                      {row.icon} {row.label}
                      <span className="rounded-full bg-ink/[0.06] px-1.5 text-[11px] tabular-nums">{row.all.length}</span>
                    </button>
                    {/* jen lidé, co ještě nezaplatili (objednávka čeká) */}
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 transition hover:bg-amber-200 disabled:opacity-50"
                      disabled={row.unpaid.length === 0}
                      title="Jen lidé s lístkem, kteří ještě nezaplatili (objednávka čeká)"
                      onClick={() => copyList(row.unpaid, row.sep, `${row.what} (jen nezaplacené)`, row.icon)}
                    >
                      ⏳ jen nezaplacené
                      <span className="rounded-full bg-amber-200/70 px-1.5 text-[11px] tabular-nums">{row.unpaid.length}</span>
                    </button>
                    <span className="text-xs text-ink-soft">{row.hint}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Analytika lístků: kolik lístků má jedna objednávka, odkud jsou, čím se platily, po dnech */}
          {tickets.total > 0 && <TicketAnalytics orders={orders} finances={year.finances ?? []} isTicketItem={isTicketItem} />}
          {orders.length > 0 && (
            <div className="relative">
              <input
                type="search"
                className={`w-full rounded-2xl border-2 border-ink/10 bg-white px-5 py-3 text-base shadow-sm outline-none transition placeholder:text-ink-soft/60 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 ${q ? "pr-14" : ""}`}
                placeholder="🔎 Hledat jméno, telefon, e-mail…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              {q && <SearchClear onClear={() => setQ("")} className="absolute right-4 top-1/2 h-6 w-6 -translate-y-1/2" />}
            </div>
          )}
          {orders.length === 0 ? (
            <div className="empty-state">
              Zatím žádné objednávky. Lidi objednávají přes QR kód vedle.
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="empty-state">Nikdo takový v objednávkách není.</div>
          ) : (
            <div className="card divide-y divide-ink/10 overflow-hidden">
              {filteredOrders.map((o) => (
                <OrderRow key={o.id} order={o} yearId={year.id} canManage={canManage} canDelete={canDeleteOrders} canUnlock={canDeleteOrders} total={orderTotal(o, products)} account={year.paymentAccount} />
              ))}
            </div>
          )}
        </section>

        <aside className="space-y-4">
          {/* Souhrn / propočty */}
          <div className="card p-4">
            <h2 className="mb-2 eyebrow">Souhrn</h2>
            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-ink-soft">Objednávek</dt>
                <dd className="font-semibold">{orders.length}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-ink-soft">Kusů celkem</dt>
                <dd className="font-semibold">{totalQty}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-ink-soft">Čeká / Vyřízeno</dt>
                <dd className="font-semibold">
                  <span className="text-amber-700">{pending}</span> / <span className="text-leaf-700">{doneCount}</span>
                </dd>
              </div>
              <div className="flex justify-between gap-2 border-t border-ink/10 pt-1.5">
                <dt className="text-ink-soft">Tržba celkem</dt>
                <dd className="font-display text-base font-bold text-gold-700">{fmtCZK(revenue)}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-ink-soft">Z toho vyřízeno</dt>
                <dd className="font-semibold text-leaf-700">{fmtCZK(doneRevenue)}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-ink-soft">Čeká na vyřízení</dt>
                <dd className="font-semibold text-amber-700">{fmtCZK(revenue - doneRevenue)}</dd>
              </div>
            </dl>
          </div>

          <QrCard yearId={year.id} />
        </aside>
      </div>
    </div>
  );
}

// "S, M, L" → ["S","M","L"]
const parseList = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);

function AddProduct({ yearId }: { yearId: string }) {
  const { dispatch, configured } = useStore();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [cost, setCost] = useState("");
  const [sizes, setSizes] = useState("");
  const [colors, setColors] = useState("");
  const [vstock, setVstock] = useState<Record<string, string>>({});
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const marginHint = margin(parseInt(price.replace(/\s/g, ""), 10), parseInt(cost.replace(/\s/g, ""), 10));
  const sizeList = parseList(sizes);
  const colorList = parseList(colors);

  async function add() {
    if (!name.trim()) {
      setErr("Doplň název.");
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      let blobId: string | undefined;
      if (file) {
        const dataUrl = await compressImage(file);
        blobId = uid("mp_");
        const ok = await saveReceipt(blobId, dataUrl, configured);
        if (!ok) {
          setErr("Fotku se nepodařilo nahrát.");
          setBusy(false);
          return;
        }
      }
      const priceNum = parseInt(price.replace(/\s/g, ""), 10);
      const costNum = parseInt(cost.replace(/\s/g, ""), 10);
      await dispatch({
        type: "addMerchProduct",
        yearId,
        name,
        price: Number.isFinite(priceNum) ? priceNum : undefined,
        cost: Number.isFinite(costNum) ? costNum : undefined,
        blobId,
        sizes: sizeList,
        colors: colorList,
        variantStock: collectVariantStock(sizeList, colorList, vstock),
        note,
      });
      setName("");
      setPrice("");
      setCost("");
      setSizes("");
      setColors("");
      setVstock({});
      setNote("");
      setFile(null);
      flash("Produkt přidán", "👕");
    } catch {
      setErr("Něco se pokazilo.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card space-y-2 p-4">
      <input className="input" placeholder="Název (např. Tričko Mařena 2026)" value={name} onChange={(e) => setName(e.target.value)} />
      <div className="grid gap-2 sm:grid-cols-2">
        <input className="input" inputMode="numeric" placeholder="Prodejní cena (Kč)" value={price} onChange={(e) => setPrice(e.target.value)} />
        <input className="input" inputMode="numeric" placeholder="Nákupní cena (Kč) — pro marži" value={cost} onChange={(e) => setCost(e.target.value)} />
      </div>
      {marginHint && (
        <p className={`text-xs font-medium ${marginHint.value >= 0 ? "text-leaf-700" : "text-red-600"}`}>
          Marže {marginHint.value >= 0 ? "+" : "−"}{fmtCZK(Math.abs(marginHint.value))}
          {marginHint.pct != null ? ` (${marginHint.pct} %)` : ""} na kus
        </p>
      )}
      <div className="grid gap-2 sm:grid-cols-2">
        <input className="input" placeholder="Velikosti přes čárku (S, M, L, XL)" value={sizes} onChange={(e) => setSizes(e.target.value)} />
        <input className="input" placeholder="Barvy přes čárku (černá, bílá)" value={colors} onChange={(e) => setColors(e.target.value)} />
      </div>
      {(sizeList.length > 0 || colorList.length > 0) && (
        <VariantStockGrid sizes={sizeList} colors={colorList} value={vstock} onChange={(k, v) => setVstock((s) => ({ ...s, [k]: v }))} />
      )}
      <input className="input" placeholder="Poznámka (materiál apod. — nepovinné)" value={note} onChange={(e) => setNote(e.target.value)} />
      <div className="flex flex-wrap items-center gap-3">
        <label className="btn-secondary cursor-pointer">
          <Icon name="image" className="h-4 w-4" />
          {file ? "Foto vybráno" : "Vybrat foto"}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </label>
        {file && <span className="text-xs text-ink-soft">{file.name}</span>}
        <button className="btn-primary ml-auto" onClick={add} disabled={busy}>
          {busy ? "Přidávám…" : "Přidat do nabídky"}
        </button>
      </div>
      {err && <p className="text-sm text-red-600">{err}</p>}
    </div>
  );
}

function ProductCard({
  product,
  yearId,
  editable,
  sold,
  orderCount,
  soldVariant,
}: {
  product: MerchProduct;
  yearId: string;
  editable: boolean;
  sold: number;
  orderCount: number;
  soldVariant?: Map<string, number>;
}) {
  const { dispatch, configured, currentYear } = useStore();
  // Čekající objednávky, kde je položka za jinou cenu než je teď v nabídce
  // (např. lístek objednaný za 350 Kč, teď stojí 300) → nabídnout sjednocení.
  const stale = (currentYear?.merchOrders ?? [])
    .filter((o) => !o.done)
    .flatMap((o) => o.items.filter((it) => it.productId === product.id && product.price != null && it.price != null && it.price !== product.price));
  const staleQty = stale.reduce((sum, it) => sum + it.qty, 0);
  const stalePrices = [...new Set(stale.map((it) => it.price as number))].sort((x, y) => x - y);
  const remaining = product.stock != null ? product.stock - sold : null;
  const soldOut = remaining != null && remaining <= 0;
  // Zbývá po variantách (velikost·barva): sklad varianty − prodáno varianty.
  const variantRemaining = product.variantStock
    ? productVariants(product).map((v) => ({ label: v.label, left: (product.variantStock?.[v.key] ?? 0) - (soldVariant?.get(v.key) ?? 0) }))
    : [];
  const [img, setImg] = useState<string | null>(null);
  const [viewIdx, setViewIdx] = useState<number | null>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    let on = true;
    if (product.blobId) loadReceipt(product.blobId, configured).then((u) => on && setImg(u));
    return () => {
      on = false;
    };
  }, [product.blobId, configured]);

  async function remove() {
    if (product.blobId) await deleteReceipt(product.blobId, configured);
    await dispatch({ type: "removeMerchProduct", yearId, productId: product.id });
  }

  // Na webu / jen na baru — veřejný obchod ukáže jen položky s onWeb (chybí = ano u starších).
  const onWeb = product.onWeb !== false;
  async function toggleWeb() {
    if (await dispatch({ type: "updateMerchProduct", yearId, productId: product.id, patch: { onWeb: !onWeb } })) {
      flash(onWeb ? `${product.name}: skryto z webu, prodává se jen na baru` : `${product.name}: zobrazeno v obchodě na webu`, onWeb ? "🙈" : "🌐");
    }
  }

  return (
    <div className="card overflow-hidden">
      <button className="block w-full" onClick={() => img && setViewIdx(0)} aria-label="Zvětšit foto">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt={product.name} className="h-40 w-full bg-paper2 object-contain" />
        ) : (
          <div className="grid h-40 w-full place-items-center bg-paper2 text-ink-soft">
            <Icon name="image" className="h-7 w-7" />
          </div>
        )}
      </button>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="break-words font-semibold">
              {product.name}
              {!onWeb && <span className="ml-1.5 align-middle rounded-full bg-paper2 px-2 py-0.5 text-[11px] font-medium text-ink-soft">jen na baru</span>}
            </p>
            {product.price != null && (
              <p className="text-sm">
                <span className="font-semibold text-leaf-700">{fmtCZK(product.price)}</span>
                {product.cost != null && <span className="text-ink-soft"> · nákup {fmtCZK(product.cost)}</span>}
              </p>
            )}
            {(() => {
              const m = product.price != null && product.cost != null ? margin(product.price, product.cost) : null;
              return m ? (
                <p className={`text-xs font-medium ${m.value >= 0 ? "text-leaf-700" : "text-red-600"}`}>
                  marže {m.value >= 0 ? "+" : "−"}{fmtCZK(Math.abs(m.value))}{m.pct != null ? ` (${m.pct} %)` : ""} / ks
                </p>
              ) : null;
            })()}
            {editable && product.price != null && staleQty > 0 && (
              <div className="mt-2 rounded-xl bg-amber-50 p-2 text-xs text-amber-900">
                <p>
                  {staleQty} ks v čekajících objednávkách za {stalePrices.map(fmtCZK).join(" / ")}.
                </p>
                <button
                  className="mt-1 rounded-full bg-amber-500 px-2.5 py-1 font-semibold text-white transition hover:bg-amber-600"
                  onClick={async () => {
                    if (await dispatch({ type: "repriceMerchOrders", yearId, productId: product.id, price: product.price! })) {
                      flash(`Cena sjednocena na ${fmtCZK(product.price!)} u čekajících objednávek`, "✅");
                    }
                  }}
                >
                  Sjednotit na {fmtCZK(product.price)}
                </button>
              </div>
            )}
          </div>
          {editable && (
            <div className="flex shrink-0 items-center gap-1">
              <button className="btn-ghost px-2 py-1 text-xs" onClick={() => setEditing(true)}>
                Upravit
              </button>
              <DeleteButton onConfirm={remove} />
            </div>
          )}
        </div>
        {((product.sizes?.length ?? 0) > 0 || (product.colors?.length ?? 0) > 0) && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {product.sizes?.map((s) => (
              <span key={`s-${s}`} className="chip">
                {s}
              </span>
            ))}
            {product.colors?.map((c) => (
              <span key={`c-${c}`} className="chip bg-paper2">
                {c}
              </span>
            ))}
          </div>
        )}
        {product.note && <p className="mt-1 text-xs text-ink-soft">{product.note}</p>}

        {/* Sklad přímo u produktu: nastavení + prodáno/zbývá/vyprodáno */}
        <div className="mt-2 border-t border-ink/[0.05] pt-2 text-xs text-ink-soft">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {product.variantStock ? (
              <span>Skladem: {product.stock ?? 0}{editable ? " (uprav po variantách)" : ""}</span>
            ) : editable ? (
              <span className="flex items-center gap-1">
                Skladem <StockInput product={product} yearId={yearId} />
              </span>
            ) : product.stock != null ? (
              <span>Skladem: {product.stock}</span>
            ) : (
              <span>Skladem: neomezeně</span>
            )}
            <span>
              prodáno: {sold} ks
              {orderCount > 0 && orderCount !== sold && <span className="text-ink-soft/80"> · {orderCount} obj.</span>}
            </span>
            {soldOut ? (
              <span className="rounded-full bg-red-100 px-2 py-0.5 font-bold text-red-700">Vyprodáno</span>
            ) : remaining != null ? (
              <span className="rounded-full bg-leaf/15 px-2 py-0.5 font-semibold text-leaf-700">zbývá {remaining}</span>
            ) : null}
          </div>
          {/* Zbývá po velikostech/barvách */}
          {variantRemaining.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {variantRemaining.map((v) => (
                <span
                  key={v.label}
                  className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${v.left <= 0 ? "bg-red-100 text-red-700" : "bg-leaf/12 text-leaf-700"}`}
                >
                  {v.label}: {v.left <= 0 ? "0" : v.left}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Web: tlačítkem správce položku pustí do obchodu na webu (QR stránka) nebo ji z něj stáhne.
            Prodej na místě (Prodat na místě / Prodej) funguje vždy. */}
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-ink/[0.05] pt-2">
          <span className="text-xs text-ink-soft">{onWeb ? "🌐 Zobrazuje se v obchodě na webu" : "🙈 Na webu není vidět, prodává se jen na baru"}</span>
          {editable && (
            <button
              type="button"
              onClick={toggleWeb}
              title={onWeb ? "Skrýt z obchodu na webu" : "Zobrazit v obchodě na webu"}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                onWeb ? "bg-leaf/12 text-leaf-700 hover:bg-leaf/20" : "bg-gold-grad text-[#1d1d1f] shadow-sm hover:brightness-105"
              }`}
            >
              {onWeb ? "Na webu ✓ · skrýt" : "🌐 Zobrazit na webu"}
            </button>
          )}
        </div>
      </div>

      {editing && <EditProductModal product={product} yearId={yearId} onClose={() => setEditing(false)} />}

      <ImageViewer images={img ? [img] : []} index={viewIdx} onIndex={setViewIdx} title={product.name} />
    </div>
  );
}

function EditProductModal({ product, yearId, onClose }: { product: MerchProduct; yearId: string; onClose: () => void }) {
  const { dispatch, currentYear } = useStore();
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price != null ? String(product.price) : "");
  // Nová cena se dá rovnou propsat i do čekajících objednávek (vyřízené se nemění).
  const [applyToOrders, setApplyToOrders] = useState(true);
  const priceNow = parseInt(price.replace(/\s/g, ""), 10);
  const pendingQty = Number.isFinite(priceNow)
    ? (currentYear?.merchOrders ?? [])
        .filter((o) => !o.done)
        .flatMap((o) => o.items.filter((it) => it.productId === product.id && it.price !== priceNow))
        .reduce((sum, it) => sum + it.qty, 0)
    : 0;
  const [cost, setCost] = useState(product.cost != null ? String(product.cost) : "");
  const [sizes, setSizes] = useState((product.sizes ?? []).join(", "));
  const [colors, setColors] = useState((product.colors ?? []).join(", "));
  const [stock, setStock] = useState(product.stock != null ? String(product.stock) : "");
  const [vstock, setVstock] = useState<Record<string, string>>(
    Object.fromEntries(Object.entries(product.variantStock ?? {}).map(([k, v]) => [k, String(v)])),
  );
  const [note, setNote] = useState(product.note ?? "");
  const sizeList = parseList(sizes);
  const colorList = parseList(colors);
  const hasVar = sizeList.length > 0 || colorList.length > 0;

  async function save() {
    const priceNum = parseInt(price.replace(/\s/g, ""), 10);
    const costNum = parseInt(cost.replace(/\s/g, ""), 10);
    const stockNum = parseInt(stock.replace(/\s/g, ""), 10);
    await dispatch({
      type: "updateMerchProduct",
      yearId,
      productId: product.id,
      patch: {
        name: name.trim() || product.name,
        price: Number.isFinite(priceNum) ? priceNum : undefined,
        cost: Number.isFinite(costNum) ? costNum : undefined,
        sizes: sizeList,
        colors: colorList,
        // Varianty → sklad po variantách (celkový sklad dopočítá reducer); bez
        // variant → jeden celkový sklad, varianty se vyčistí.
        ...(hasVar
          ? { variantStock: collectVariantStock(sizeList, colorList, vstock) }
          : { variantStock: undefined, stock: Number.isFinite(stockNum) ? stockNum : undefined }),
        note,
      },
    });
    if (applyToOrders && Number.isFinite(priceNum) && pendingQty > 0) {
      await dispatch({ type: "repriceMerchOrders", yearId, productId: product.id, price: priceNum });
    }
    onClose();
  }

  return (
    <Modal open onClose={onClose} title={`Upravit: ${product.name}`}>
      <div className="space-y-3">
        <div>
          <label className="label">Název</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="label">Prodejní cena (Kč)</label>
            <input className="input" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
          <div>
            <label className="label">Nákupní cena (Kč)</label>
            <input className="input" inputMode="numeric" placeholder="pro marži" value={cost} onChange={(e) => setCost(e.target.value)} />
          </div>
        </div>
        {(() => {
          const m = margin(parseInt(price.replace(/\s/g, ""), 10), parseInt(cost.replace(/\s/g, ""), 10));
          return m ? (
            <p className={`text-xs font-medium ${m.value >= 0 ? "text-leaf-700" : "text-red-600"}`}>
              Marže {m.value >= 0 ? "+" : "−"}{fmtCZK(Math.abs(m.value))}{m.pct != null ? ` (${m.pct} %)` : ""} na kus
            </p>
          ) : null;
        })()}
        {pendingQty > 0 && (
          <label className="flex items-start gap-2 rounded-xl bg-amber-50 p-2 text-xs text-amber-900">
            <input type="checkbox" className="mt-0.5" checked={applyToOrders} onChange={(e) => setApplyToOrders(e.target.checked)} />
            <span>
              Použít cenu {fmtCZK(priceNow)} i u čekajících objednávek ({pendingQty} ks). Vyřízené a zaplacené objednávky se nemění.
            </span>
          </label>
        )}
        <div>
          <label className="label">Velikosti (přes čárku)</label>
          <input className="input" placeholder="S, M, L, XL" value={sizes} onChange={(e) => setSizes(e.target.value)} />
        </div>
        <div>
          <label className="label">Barvy (přes čárku)</label>
          <input className="input" placeholder="černá, bílá" value={colors} onChange={(e) => setColors(e.target.value)} />
        </div>
        {hasVar ? (
          <VariantStockGrid sizes={sizeList} colors={colorList} value={vstock} onChange={(k, v) => setVstock((s) => ({ ...s, [k]: v }))} />
        ) : (
          <div>
            <label className="label">Skladem (ks) — prázdné = neomezeně</label>
            <input className="input" inputMode="numeric" placeholder="např. 50" value={stock} onChange={(e) => setStock(e.target.value)} />
          </div>
        )}
        <div>
          <label className="label">Poznámka</label>
          <input className="input" value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
        <div className="flex items-center gap-2 pt-1">
          <button className="btn-primary flex-1" onClick={save}>
            Uložit
          </button>
          <button className="btn-ghost" onClick={onClose}>
            Zrušit
          </button>
        </div>
      </div>
    </Modal>
  );
}

// Cena položky čekající objednávky — kliknutím se dá přepsat (sleva, výjimka).
function ItemPrice({ value, onChange }: { value?: number; onChange: (price?: number) => void }) {
  const [editing, setEditing] = useState(false);
  const [v, setV] = useState("");
  if (!editing) {
    return (
      <button
        type="button"
        className="rounded-full bg-paper2 px-1.5 py-px text-xs text-ink-soft transition hover:bg-gold-100 hover:text-ink"
        title="Upravit cenu za kus"
        onClick={() => {
          setV(value != null ? String(value) : "");
          setEditing(true);
        }}
      >
        {value != null ? fmtCZK(value) : "bez ceny"} ✎
      </button>
    );
  }
  const commit = () => {
    const n = parseInt(v.replace(/\s/g, ""), 10);
    onChange(Number.isFinite(n) ? n : undefined);
    setEditing(false);
  };
  return (
    <span className="inline-flex items-center gap-1">
      <input
        className="input h-7 w-20 px-2 py-0 text-xs"
        inputMode="numeric"
        value={v}
        autoFocus
        onChange={(e) => setV(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") setEditing(false);
        }}
      />
      <button type="button" className="rounded-full bg-gold-500 px-2 py-0.5 text-xs font-semibold text-[#1d1d1f]" onClick={commit}>
        OK
      </button>
      <button type="button" className="text-xs text-ink-soft hover:text-ink" onClick={() => setEditing(false)}>
        zrušit
      </button>
    </span>
  );
}

// Správce: úprava celé rezervace — jméno, telefon, e-mail, poznámka a položky
// (produkt, velikost / barva, cena za kus, počet). U vyřízené / zaplacené objednávky
// se přepíše i zápis ve financích (částka, jméno, rozpis).
type EditItem = { key: string; productId: string; name: string; size: string; color: string; price: string; qty: string };
function EditOrderModal({ order, yearId, onClose }: { order: MerchOrder; yearId: string; onClose: () => void }) {
  const { dispatch, currentYear } = useStore();
  const products = currentYear?.merch ?? [];
  const [name, setName] = useState(order.name);
  const [phone, setPhone] = useState(order.phone ?? "");
  const [email, setEmail] = useState(order.email ?? "");
  const [note, setNote] = useState(order.note ?? "");
  const [items, setItems] = useState<EditItem[]>(
    order.items.map((it, i) => ({
      key: `${i}`,
      productId: it.productId,
      name: it.name,
      size: it.size ?? "",
      color: it.color ?? "",
      price: it.price != null ? String(it.price) : "",
      qty: String(it.qty),
    })),
  );
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const patchItem = (key: string, patch: Partial<EditItem>) => setItems((prev) => prev.map((it) => (it.key === key ? { ...it, ...patch } : it)));
  const num = (v: string) => {
    const n = parseInt(v.replace(/\s/g, ""), 10);
    return Number.isFinite(n) ? n : undefined;
  };
  const total = items.reduce((sum, it) => sum + (num(it.price) ?? products.find((p) => p.id === it.productId)?.price ?? 0) * (num(it.qty) ?? 0), 0);

  function addItem() {
    const p = products[0];
    setItems((prev) => [
      ...prev,
      { key: `n${Date.now()}`, productId: p?.id ?? "", name: p?.name ?? "", size: "", color: "", price: p?.price != null ? String(p.price) : "", qty: "1" },
    ]);
  }

  async function save() {
    setErr(null);
    if (!name.trim()) return setErr("Vyplň jméno.");
    if (items.length === 0) return setErr("Rezervace musí mít aspoň jednu položku.");
    if (items.some((it) => !it.name.trim() || (num(it.qty) ?? 0) < 1)) return setErr("Každá položka potřebuje název a počet aspoň 1.");
    setBusy(true);
    try {
      const ok = await dispatch({
        type: "updateMerchOrder",
        yearId,
        orderId: order.id,
        patch: {
          name,
          phone,
          email,
          note,
          items: items.map((it) => ({ productId: it.productId, name: it.name, size: it.size || undefined, color: it.color || undefined, price: num(it.price), qty: num(it.qty) ?? 1 })),
        },
      });
      if (!ok) return setErr("Nepodařilo se uložit — zkontroluj připojení.");
      flash(`Rezervace ${name.trim()} upravena`, "✏️");
      onClose();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open onClose={onClose} title="Upravit rezervaci">
      <div className="space-y-3">
        {order.done && (
          <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-900">
            Objednávka je už vyřízená{order.paid ? " a zaplacená" : ""} — nová částka, jméno a rozpis se přepíšou i ve financích.
          </p>
        )}
        <div className="grid gap-2 sm:grid-cols-2">
          <input className="input sm:col-span-2" placeholder="Jméno a příjmení" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="input" type="tel" inputMode="tel" placeholder="Telefon" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <input className="input" type="email" inputMode="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="input sm:col-span-2" placeholder="Poznámka" value={note} onChange={(e) => setNote(e.target.value)} />
        </div>

        <div className="space-y-2">
          <p className="eyebrow">Položky</p>
          {items.map((it) => {
            const product = products.find((p) => p.id === it.productId);
            return (
              <div key={it.key} className="space-y-1.5 rounded-xl border border-ink/10 bg-paper2/40 p-2">
                <div className="flex gap-2">
                  {/* produkt z nabídky (název se převezme); ručně zadaný název jde přepsat */}
                  <select
                    className="input min-w-0 flex-1"
                    value={products.some((p) => p.id === it.productId) ? it.productId : ""}
                    onChange={(e) => {
                      const p = products.find((x) => x.id === e.target.value);
                      if (p) patchItem(it.key, { productId: p.id, name: p.name, price: p.price != null ? String(p.price) : it.price });
                    }}
                  >
                    {!products.some((p) => p.id === it.productId) && <option value="">— mimo nabídku —</option>}
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="shrink-0 rounded-full px-2 text-ink-soft/70 transition hover:text-red-600"
                    aria-label="Odebrat položku"
                    title="Odebrat položku"
                    onClick={() => setItems((prev) => prev.filter((x) => x.key !== it.key))}
                  >
                    ✕
                  </button>
                </div>
                <input className="input" placeholder="Název položky" value={it.name} onChange={(e) => patchItem(it.key, { name: e.target.value })} />
                <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                  {product?.sizes?.length ? (
                    <select className="input" value={it.size} onChange={(e) => patchItem(it.key, { size: e.target.value })}>
                      <option value="">velikost</option>
                      {product.sizes.map((sz) => (
                        <option key={sz} value={sz}>
                          {sz}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input className="input" placeholder="Velikost" value={it.size} onChange={(e) => patchItem(it.key, { size: e.target.value })} />
                  )}
                  {product?.colors?.length ? (
                    <select className="input" value={it.color} onChange={(e) => patchItem(it.key, { color: e.target.value })}>
                      <option value="">barva</option>
                      {product.colors.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input className="input" placeholder="Barva" value={it.color} onChange={(e) => patchItem(it.key, { color: e.target.value })} />
                  )}
                  <label className="flex items-center gap-1 text-xs text-ink-soft">
                    <input className="input" inputMode="numeric" placeholder="Cena / ks" aria-label="Cena za kus (Kč)" value={it.price} onChange={(e) => patchItem(it.key, { price: e.target.value })} />
                    Kč
                  </label>
                  <label className="flex items-center gap-1 text-xs text-ink-soft">
                    <input className="input" inputMode="numeric" placeholder="Počet" aria-label="Počet kusů" value={it.qty} onChange={(e) => patchItem(it.key, { qty: e.target.value })} />
                    ks
                  </label>
                </div>
              </div>
            );
          })}
          <button type="button" className="btn-ghost text-sm" onClick={addItem}>
            + Přidat položku
          </button>
        </div>

        <p className="text-right text-sm text-ink-soft">
          Celkem <strong className="font-display text-base text-ink">{fmtCZK(total)}</strong>
        </p>
        {err && <p className="text-sm text-red-600">{err}</p>}
        <div className="flex items-center gap-2">
          <button className="btn-primary flex-1" onClick={save} disabled={busy}>
            {busy ? "Ukládám…" : "Uložit změny"}
          </button>
          <button className="btn-ghost" onClick={onClose}>
            Zrušit
          </button>
        </div>
      </div>
    </Modal>
  );
}

// Analytika lístků — odpovídá na: kolik lístků má jedna objednávka, odkud lístky jsou
// (rezervace z webu vs. prodej na místě), čím se zaplatily a jak rezervace a platby
// přibývaly po dnech. Počítá se z objednávek a navázaných zápisů ve financích.
function TicketAnalytics({
  orders,
  finances,
  isTicketItem,
}: {
  orders: MerchOrder[];
  finances: FinanceItem[];
  isTicketItem: (it: MerchOrder["items"][number]) => boolean;
}) {
  const [open, setOpen] = useState(false);
  const a = useMemo(() => {
    const localDay = (iso: string) => {
      const d = new Date(iso);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    };
    const finById = new Map(finances.map((f) => [f.id, f]));
    const isOnsite = (it: MerchOrder["items"][number]) => /\(na místě\)\s*$/.test(it.name);
    const buckets: Record<string, { orders: number; tickets: number }> = { "1": { orders: 0, tickets: 0 }, "2": { orders: 0, tickets: 0 }, "3": { orders: 0, tickets: 0 }, "4+": { orders: 0, tickets: 0 } };
    let webTotal = 0, webPaid = 0, webPending = 0, onsite = 0, qr = 0, cash = 0, other = 0, ordersWithTicket = 0, ticketsTotal = 0;
    const byDay = new Map<string, { reservedOrders: number; reservedTickets: number; paidTickets: number; onsiteTickets: number }>();
    const day = (k: string) => {
      const cur = byDay.get(k) ?? { reservedOrders: 0, reservedTickets: 0, paidTickets: 0, onsiteTickets: 0 };
      byDay.set(k, cur);
      return cur;
    };
    for (const o of orders) {
      const tItems = o.items.filter(isTicketItem);
      const qty = tItems.reduce((q, it) => q + it.qty, 0);
      if (qty === 0) continue;
      ordersWithTicket++;
      ticketsTotal += qty;
      const b = qty >= 4 ? "4+" : String(qty);
      buckets[b].orders++;
      buckets[b].tickets += qty;
      const onsiteQty = tItems.filter(isOnsite).reduce((q, it) => q + it.qty, 0);
      const webQty = qty - onsiteQty;
      onsite += onsiteQty;
      webTotal += webQty;
      if (webQty > 0) {
        const d = day(localDay(o.createdAt));
        d.reservedOrders++;
        d.reservedTickets += webQty;
        if (o.done) webPaid += webQty;
        else webPending += webQty;
      }
      const fin = o.financeId ? finById.get(o.financeId) : undefined;
      if (fin) {
        const note = fin.note ?? "";
        if (note.includes("QR platba")) qr += qty;
        else if (note.includes("hotově")) cash += qty;
        else other += qty;
        const d = day(fin.date || localDay(fin.createdAt));
        if (onsiteQty > 0) d.onsiteTickets += onsiteQty;
        if (webQty > 0) d.paidTickets += webQty;
      }
    }
    const days = [...byDay.entries()].sort((x, y) => y[0].localeCompare(x[0]));
    return { buckets, webTotal, webPaid, webPending, onsite, qr, cash, other, ordersWithTicket, ticketsTotal, days, avg: ordersWithTicket ? ticketsTotal / ordersWithTicket : 0 };
  }, [orders, finances, isTicketItem]);

  const maxOrders = Math.max(1, ...Object.values(a.buckets).map((b) => b.orders));
  const summary = `1 lístek: ${a.buckets["1"].orders} obj. · 2: ${a.buckets["2"].orders} · 3: ${a.buckets["3"].orders} · 4+: ${a.buckets["4+"].orders} · na místě ${a.onsite} ks`;

  return (
    <div className="card p-4">
      <button type="button" className="flex w-full items-center justify-between gap-2 text-left" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <span>
          <span className="eyebrow">📊 Analytika lístků</span>
          {!open && <span className="mt-0.5 block text-xs text-ink-soft">{summary}</span>}
        </span>
        <span className={`text-xs transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
      {open && (
        <div className="mt-3 space-y-4 text-sm">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-ink-soft">Kolik lístků má jedna objednávka</p>
            <div className="mt-1 space-y-1">
              {(["1", "2", "3", "4+"] as const).map((k) => (
                <div key={k} className="flex items-center gap-2">
                  <span className="w-14 shrink-0 tabular-nums">{k === "1" ? "1 lístek" : `${k} lístky`}</span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-paper2">
                    <div className="h-full rounded-full bg-gold-400" style={{ width: `${(a.buckets[k].orders / maxOrders) * 100}%` }} />
                  </div>
                  <span className="w-36 shrink-0 text-right text-xs tabular-nums text-ink-soft">
                    <strong className="text-ink">{a.buckets[k].orders}</strong> obj. · {a.buckets[k].tickets} ks
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-1 text-xs text-ink-soft">
              Průměrně <strong className="text-ink">{a.avg.toFixed(2).replace(".", ",")}</strong> lístku na objednávku · {a.ordersWithTicket} objednávek · {a.ticketsTotal} lístků
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-xl bg-paper2/60 p-3">
              <p className="text-[10px] font-medium uppercase tracking-wide text-ink-soft">Odkud lístky jsou</p>
              <p className="mt-1">
                🌐 Rezervace z webu <strong>{a.webTotal} ks</strong>
                <span className="text-xs text-ink-soft"> (zaplaceno {a.webPaid} · čeká {a.webPending})</span>
              </p>
              <p>
                🎫 Prodáno na místě <strong>{a.onsite} ks</strong>
              </p>
            </div>
            <div className="rounded-xl bg-paper2/60 p-3">
              <p className="text-[10px] font-medium uppercase tracking-wide text-ink-soft">Čím se zaplacené lístky platily</p>
              <p className="mt-1">
                QR <strong>{a.qr} ks</strong> · hotově <strong>{a.cash} ks</strong>
                {a.other > 0 && <span className="text-xs text-ink-soft"> · bez uvedení {a.other} ks (přepnuto „Vyřízeno“ bez platby)</span>}
              </p>
            </div>
          </div>
          {a.days.length > 0 && (
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wide text-ink-soft">Po dnech</p>
              <table className="mt-1 w-full text-xs tabular-nums">
                <thead>
                  <tr className="text-left text-ink-soft">
                    <th className="py-1 font-medium">Den</th>
                    <th className="py-1 text-right font-medium">Rezervováno</th>
                    <th className="py-1 text-right font-medium">Zaplaceno z webu</th>
                    <th className="py-1 text-right font-medium">Na místě</th>
                  </tr>
                </thead>
                <tbody>
                  {a.days.map(([d, v]) => (
                    <tr key={d} className="border-t border-ink/[0.06]">
                      <td className="py-1">{fmtDate(d)}</td>
                      <td className="py-1 text-right">{v.reservedTickets > 0 ? `${v.reservedTickets} ks · ${v.reservedOrders} obj.` : "—"}</td>
                      <td className="py-1 text-right">{v.paidTickets > 0 ? `${v.paidTickets} ks` : "—"}</td>
                      <td className="py-1 text-right">{v.onsiteTickets > 0 ? `${v.onsiteTickets} ks` : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-1 text-[11px] text-ink-soft">Rezervováno = den vytvoření rezervace na webu. Zaplaceno / na místě = den zaplacení (zápis ve financích).</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function OrderRow({
  order,
  yearId,
  canManage,
  canDelete,
  canUnlock,
  total,
  account,
}: {
  order: MerchOrder;
  yearId: string;
  canManage: boolean;
  canDelete: boolean;
  canUnlock: boolean;
  total: number;
  account?: string;
}) {
  const { dispatch } = useStore();
  const [qrOpen, setQrOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false); // správce: úprava celé rezervace
  // QR ukazuje prodávající při předání — jen u nevyřízených objednávek s cenou.
  const canQr = canManage && !order.done && total > 0 && !!account && !("error" in parseAccount(account));
  const itemsText = order.items
    .map((it) => `${it.qty}× ${it.name}${[it.size, it.color].filter(Boolean).length ? ` (${[it.size, it.color].filter(Boolean).join(" · ")})` : ""}`)
    .join(", ");

  return (
    <div className={`px-4 py-3 ${order.done ? "bg-leaf/[0.06]" : ""}`}>
      {/* Řádek 1: jméno · telefon · e-mail · datum a čas · stav · smazat */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="font-semibold">{order.name}</span>
        {order.phone && <CopyContact value={order.phone} kind="phone" className="text-xs text-ink-soft hover:text-ink" />}
        {order.email && <CopyContact value={order.email} kind="email" className="text-xs text-ink-soft hover:text-ink" />}
        <span className="text-xs text-ink-soft/70">{fmtDateTime(order.createdAt)}</span>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          {canQr && (
            <button
              onClick={() => setQrOpen(true)}
              className="rounded-full bg-gold-500 px-2.5 py-1 text-xs font-semibold text-[#1d1d1f] transition hover:bg-gold-400"
            >
              QR platba
            </button>
          )}
          {order.paid ? (
            // Zaplaceno na místě → objednávka je uzamčená; odemkne jen správce.
            canUnlock ? (
              <button
                onClick={() => {
                  if (window.confirm("Objednávka je zaplacená a uzamčená. Opravdu vrátit na „čeká“? Smaže se i zápis ve financích.")) {
                    dispatch({ type: "toggleMerchOrderDone", yearId, orderId: order.id });
                  }
                }}
                className="rounded-full bg-leaf/15 px-2.5 py-1 text-xs font-semibold text-leaf-700 transition hover:bg-leaf/25"
                title="Zaplaceno a uzamčeno — odemknout může jen správce"
              >
                🔒 Zaplaceno
              </button>
            ) : (
              <span className="badge bg-leaf/15 text-leaf-700" title="Zaplaceno a uzamčeno">
                🔒 Zaplaceno
              </span>
            )
          ) : canManage ? (
            <button
              onClick={() => dispatch({ type: "toggleMerchOrderDone", yearId, orderId: order.id })}
              className={`rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                order.done ? "bg-leaf/15 text-leaf-700 hover:bg-leaf/25" : "bg-amber-100 text-amber-800 hover:bg-amber-200"
              }`}
            >
              {order.done ? "✓ Vyřízeno" : "⏳ Čeká"}
            </button>
          ) : (
            <span
              className={`badge ${
                order.done ? "bg-leaf/15 text-leaf-700" : "bg-amber-100 text-amber-800"
              }`}
            >
              {order.done ? "✓ Vyřízeno" : "⏳ Čeká"}
            </span>
          )}
          {/* Správce může upravit veškeré údaje rezervace (kontakt, položky, ceny) */}
          {canUnlock && (
            <button className="btn-ghost px-2 py-1 text-xs" onClick={() => setEditOpen(true)} title="Upravit rezervaci (jméno, kontakt, položky, ceny)">
              Upravit
            </button>
          )}
          {canDelete && <DeleteButton onConfirm={() => dispatch({ type: "removeMerchOrder", yearId, orderId: order.id })} />}
        </div>
      </div>
      {editOpen && <EditOrderModal order={order} yearId={yearId} onClose={() => setEditOpen(false)} />}

      {/* Řádek 2: jaký merch a jeho počet (+ poznámka a cena) */}
      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-ink/[0.05] pt-1 text-sm">
        {canManage && !order.done ? (
          // u čekající objednávky jde cena každé položky přepsat (sleva, stará cena…)
          <span className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
            {order.items.map((it, i) => (
              <span key={i} className="inline-flex flex-wrap items-center gap-1">
                <span>
                  {i > 0 ? ", " : ""}
                  {/* víc kusů v jedné objednávce zvýraznit — ať je vidět, proč je „prodáno" víc než objednávek */}
                  {it.qty > 1 ? <span className="rounded bg-amber-100 px-1 font-bold text-amber-800">{it.qty}×</span> : `${it.qty}×`} {it.name}
                  {[it.size, it.color].filter(Boolean).length ? ` (${[it.size, it.color].filter(Boolean).join(" · ")})` : ""}
                </span>
                <ItemPrice value={it.price} onChange={(p) => dispatch({ type: "setMerchOrderItemPrice", yearId, orderId: order.id, index: i, price: p })} />
              </span>
            ))}
          </span>
        ) : (
          <span>{itemsText}</span>
        )}
        {order.note && <span className="text-xs text-ink-soft">· pozn.: {order.note}</span>}
        {total > 0 && <span className="ml-auto font-display font-bold text-ink">{fmtCZK(total)}</span>}
      </div>

      {/* QR pro zaplacení při předání — potvrzením se objednávka uzamkne
          jako zaplacená a tržba se propíše do financí. */}
      {canQr && (
        <Modal open={qrOpen} onClose={() => setQrOpen(false)} title={`Platba — ${order.name}`}>
          <div className="space-y-4">
            <PayQr account={account!} amount={total} message={`MARENA MERCH ${itemsText} — ${order.name}`} />
            <p className="text-center text-xs text-ink-soft">
              „Zaplaceno“ ťukni, až přijde notifikace tvé banky — obrazovka zákazníka není důkaz.
            </p>
            <div className="flex gap-2">
              <button
                className="btn-primary flex-1"
                onClick={() => {
                  dispatch({ type: "settleMerchOrder", yearId, orderId: order.id, how: "QR platba" });
                  setQrOpen(false);
                }}
              >
                ✓ Zaplaceno — zapsat
              </button>
              <button className="btn-ghost" onClick={() => setQrOpen(false)}>
                Zavřít
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function StockInput({ product, yearId }: { product: MerchProduct; yearId: string }) {
  const { dispatch } = useStore();
  const [val, setVal] = useState(product.stock != null ? String(product.stock) : "");
  function save() {
    const n = parseInt(val.replace(/\s/g, ""), 10);
    dispatch({ type: "updateMerchProduct", yearId, productId: product.id, patch: { stock: Number.isFinite(n) ? n : undefined } });
  }
  return (
    <input
      className="w-16 rounded-lg border border-ink/10 bg-white px-2 py-1 text-xs"
      inputMode="numeric"
      value={val}
      onChange={(e) => setVal(e.target.value)}
      onBlur={save}
      onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
      placeholder="ks"
    />
  );
}

function QrCard({ yearId }: { yearId: string }) {
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrigin(window.location.origin);
  }, []);

  const link = origin ? `${origin}/merch/${yearId}` : "";
  const qr = link ? `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(link)}` : "";

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="card space-y-3 p-4 text-center">
      <h2 className="eyebrow">QR k objednání</h2>
      <p className="text-xs text-ink-soft">Naskenuj nebo sdílej odkaz — kdokoli si přes něj objedná z nabídky.</p>
      <div className="grid place-items-center">
        {qr ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={qr} alt="QR kód na objednávku merche" className="h-44 w-44 rounded-xl border border-ink/10 bg-[#fff] p-2" />
        ) : (
          <div className="grid h-44 w-44 place-items-center rounded-xl bg-paper2 text-xs text-ink-soft">Generuji…</div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <a href={link || "#"} target="_blank" rel="noreferrer" className="btn-secondary justify-center">
          <Icon name="globe" className="h-4 w-4" /> Otevřít stránku
        </a>
        <button className="btn-ghost justify-center" onClick={copy}>
          {copied ? "Zkopírováno ✓" : "Zkopírovat odkaz"}
        </button>
      </div>
      <p className="break-all text-[11px] text-ink-soft">{link}</p>
    </div>
  );
}
