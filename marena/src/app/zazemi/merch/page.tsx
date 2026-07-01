"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { Icon } from "@/components/Icons";
import { Modal } from "@/components/Modal";
import { DeleteButton } from "@/components/DeleteButton";
import { compressImage, saveReceipt, loadReceipt, deleteReceipt } from "@/lib/receipts";
import { fmtCZK, fmtDateTime } from "@/lib/format";
import { uid } from "@/lib/id";
import { canSeeMerch } from "@/lib/merch";
import { isAdmin } from "@/lib/admin";
import { flash } from "@/components/Flash";
import type { MerchProduct, MerchOrder } from "@/lib/types";

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
  const year = currentYear;
  if (!year) return null;

  // Merch vidí každý; spravovat (přidávat/měnit) může role Merch a správce, mazat objednávky jen správce.
  const canManage = canSeeMerch(year, me) && canEditCurrentYear;
  const canDeleteOrders = isAdmin(me) && canEditCurrentYear;

  const products = year.merch ?? [];
  const orders = [...(year.merchOrders ?? [])].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const pending = orders.filter((o) => !o.done).length;
  const doneCount = orders.length - pending;
  const totalQty = orders.reduce((s, o) => s + o.items.reduce((q, it) => q + it.qty, 0), 0);
  const revenue = orders.reduce((s, o) => s + orderTotal(o, products), 0);
  const doneRevenue = orders.filter((o) => o.done).reduce((s, o) => s + orderTotal(o, products), 0);
  // Prodáno na produkt — pro „skladem / zbývá" přímo u karty.
  const soldByProduct = new Map<string, number>();
  for (const o of orders) for (const it of o.items) soldByProduct.set(it.productId, (soldByProduct.get(it.productId) ?? 0) + it.qty);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Merch</h1>
        <p className="text-sm text-ink-soft">
          {canManage ? "Nahraj fotky nabídky, sdílej QR kód a sleduj objednávky." : "Nabídka merche a QR kód k objednání."}
        </p>
      </div>

      {/* Nabídka (fotky merche) */}
      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold">Nabídka</h2>
        {canManage ? (
          <AddProduct yearId={year.id} />
        ) : canSeeMerch(year, me) ? (
          <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            🔒 Tento ročník je uzamčený — nabídku jde jen prohlížet.
          </p>
        ) : (
          <div className="flex items-start gap-2 rounded-2xl border border-marigold-200 bg-marigold-50 px-4 py-3 text-sm text-marigold-800">
            <Icon name="merch" className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Nabídku může spravovat jen role <strong>Merch</strong> a správce. Ty máš jen náhled.
            </span>
          </div>
        )}
        {products.length === 0 ? (
          <div className="card grid place-items-center p-8 text-center text-sm text-ink-soft">
            {canManage ? "Zatím žádný merch. Nahraj první kousek." : "Zatím tu není žádný merch."}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} yearId={year.id} editable={canManage} sold={soldByProduct.get(p.id) ?? 0} />
            ))}
          </div>
        )}
      </section>

      {/* Objednávky + QR */}
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <section className="space-y-3">
          <h2 className="flex flex-wrap items-center gap-2 font-display text-lg font-semibold">
            Objednávky
            <span className="grid h-8 min-w-8 place-items-center rounded-full bg-marigold-600 px-2.5 font-display text-base font-bold text-white">
              {orders.length}
            </span>
            {pending > 0 && (
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">{pending} čeká</span>
            )}
          </h2>
          {orders.length === 0 ? (
            <div className="card grid place-items-center p-8 text-center text-sm text-ink-soft">
              Zatím žádné objednávky. Lidi objednávají přes QR kód vedle.
            </div>
          ) : (
            <div className="space-y-2">
              {orders.map((o) => (
                <OrderRow key={o.id} order={o} yearId={year.id} canManage={canManage} canDelete={canDeleteOrders} total={orderTotal(o, products)} />
              ))}
            </div>
          )}
        </section>

        <aside className="space-y-4">
          {/* Souhrn / propočty */}
          <div className="card p-4">
            <h2 className="mb-2 font-display text-lg font-semibold">Souhrn</h2>
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
              <div className="flex justify-between gap-2 border-t border-black/10 pt-1.5">
                <dt className="text-ink-soft">Tržba celkem</dt>
                <dd className="font-display text-base font-bold text-marigold-700">{fmtCZK(revenue)}</dd>
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
  const [sizes, setSizes] = useState("");
  const [colors, setColors] = useState("");
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

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
      await dispatch({
        type: "addMerchProduct",
        yearId,
        name,
        price: Number.isFinite(priceNum) ? priceNum : undefined,
        blobId,
        sizes: parseList(sizes),
        colors: parseList(colors),
        note,
      });
      setName("");
      setPrice("");
      setSizes("");
      setColors("");
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
      <div className="grid gap-2 sm:grid-cols-2">
        <input className="input" placeholder="Název (např. Tričko Mařena 2026)" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="input" inputMode="numeric" placeholder="Cena (Kč)" value={price} onChange={(e) => setPrice(e.target.value)} />
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <input className="input" placeholder="Velikosti přes čárku (S, M, L, XL)" value={sizes} onChange={(e) => setSizes(e.target.value)} />
        <input className="input" placeholder="Barvy přes čárku (černá, bílá)" value={colors} onChange={(e) => setColors(e.target.value)} />
      </div>
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

function ProductCard({ product, yearId, editable, sold }: { product: MerchProduct; yearId: string; editable: boolean; sold: number }) {
  const { dispatch, configured } = useStore();
  const remaining = product.stock != null ? product.stock - sold : null;
  const soldOut = remaining != null && remaining <= 0;
  const [img, setImg] = useState<string | null>(null);
  const [viewing, setViewing] = useState(false);
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

  return (
    <div className="card overflow-hidden">
      <button className="block w-full" onClick={() => img && setViewing(true)} aria-label="Zvětšit foto">
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
            <p className="break-words font-semibold">{product.name}</p>
            {product.price != null && <p className="text-sm text-ink-soft">{fmtCZK(product.price)}</p>}
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
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-black/[0.05] pt-2 text-xs text-ink-soft">
          {editable ? (
            <span className="flex items-center gap-1">
              Skladem <StockInput product={product} yearId={yearId} />
            </span>
          ) : product.stock != null ? (
            <span>Skladem: {product.stock}</span>
          ) : (
            <span>Skladem: neomezeně</span>
          )}
          <span>prodáno: {sold}</span>
          {soldOut ? (
            <span className="rounded-full bg-red-100 px-2 py-0.5 font-bold text-red-700">Vyprodáno</span>
          ) : remaining != null ? (
            <span className="rounded-full bg-leaf/15 px-2 py-0.5 font-semibold text-leaf-700">zbývá {remaining}</span>
          ) : null}
        </div>
      </div>

      {editing && <EditProductModal product={product} yearId={yearId} onClose={() => setEditing(false)} />}

      <Modal open={viewing} onClose={() => setViewing(false)} title={product.name}>
        {img && (
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img} alt={product.name} className="max-h-[64vh] w-full rounded-xl object-contain" />
            <div className="mt-3 flex justify-center">
              <button
                onClick={() => setViewing(false)}
                aria-label="Zavřít"
                className="grid h-11 w-11 place-items-center rounded-full bg-black/5 text-ink-soft transition hover:bg-black/10 hover:text-ink"
              >
                <Icon name="close" className="h-6 w-6" />
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function EditProductModal({ product, yearId, onClose }: { product: MerchProduct; yearId: string; onClose: () => void }) {
  const { dispatch } = useStore();
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price != null ? String(product.price) : "");
  const [sizes, setSizes] = useState((product.sizes ?? []).join(", "));
  const [colors, setColors] = useState((product.colors ?? []).join(", "));
  const [stock, setStock] = useState(product.stock != null ? String(product.stock) : "");
  const [note, setNote] = useState(product.note ?? "");

  async function save() {
    const priceNum = parseInt(price.replace(/\s/g, ""), 10);
    const stockNum = parseInt(stock.replace(/\s/g, ""), 10);
    await dispatch({
      type: "updateMerchProduct",
      yearId,
      productId: product.id,
      patch: {
        name: name.trim() || product.name,
        price: Number.isFinite(priceNum) ? priceNum : undefined,
        sizes: parseList(sizes),
        colors: parseList(colors),
        stock: Number.isFinite(stockNum) ? stockNum : undefined,
        note,
      },
    });
    onClose();
  }

  return (
    <Modal open onClose={onClose} title={`Upravit: ${product.name}`}>
      <div className="space-y-3">
        <div>
          <label className="label">Název</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
        </div>
        <div>
          <label className="label">Cena (Kč)</label>
          <input className="input" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <div>
          <label className="label">Velikosti (přes čárku)</label>
          <input className="input" placeholder="S, M, L, XL" value={sizes} onChange={(e) => setSizes(e.target.value)} />
        </div>
        <div>
          <label className="label">Barvy (přes čárku)</label>
          <input className="input" placeholder="černá, bílá" value={colors} onChange={(e) => setColors(e.target.value)} />
        </div>
        <div>
          <label className="label">Skladem (ks) — prázdné = neomezeně</label>
          <input className="input" inputMode="numeric" placeholder="např. 50" value={stock} onChange={(e) => setStock(e.target.value)} />
        </div>
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

function OrderRow({
  order,
  yearId,
  canManage,
  canDelete,
  total,
}: {
  order: MerchOrder;
  yearId: string;
  canManage: boolean;
  canDelete: boolean;
  total: number;
}) {
  const { dispatch } = useStore();
  const itemsText = order.items
    .map((it) => `${it.qty}× ${it.name}${[it.size, it.color].filter(Boolean).length ? ` (${[it.size, it.color].filter(Boolean).join(" · ")})` : ""}`)
    .join(", ");

  return (
    <div className={`card px-3 py-2 ${order.done ? "bg-leaf/[0.06]" : ""}`}>
      {/* Řádek 1: jméno · telefon · e-mail · datum a čas · stav · smazat */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="font-semibold">{order.name}</span>
        {order.phone && (
          <a href={`tel:${order.phone}`} className="text-xs text-ink-soft hover:text-ink">
            📞 {order.phone}
          </a>
        )}
        {order.email && (
          <a href={`mailto:${order.email}`} className="text-xs text-ink-soft hover:text-ink">
            ✉️ {order.email}
          </a>
        )}
        <span className="text-xs text-ink-soft/70">{fmtDateTime(order.createdAt)}</span>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          {canManage ? (
            <button
              onClick={() => dispatch({ type: "toggleMerchOrderDone", yearId, orderId: order.id })}
              className={`rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                order.done ? "bg-leaf/15 text-leaf-700 hover:bg-leaf/25" : "bg-amber-100 text-amber-800 hover:bg-amber-200"
              }`}
              title="Přepnout stav"
            >
              {order.done ? "✓ Vyřízeno" : "⏳ Čeká"}
            </button>
          ) : (
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                order.done ? "bg-leaf/15 text-leaf-700" : "bg-amber-100 text-amber-800"
              }`}
            >
              {order.done ? "✓ Vyřízeno" : "⏳ Čeká"}
            </span>
          )}
          {canDelete && <DeleteButton onConfirm={() => dispatch({ type: "removeMerchOrder", yearId, orderId: order.id })} />}
        </div>
      </div>

      {/* Řádek 2: jaký merch a jeho počet (+ poznámka a cena) */}
      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-black/[0.05] pt-1 text-sm">
        <span>{itemsText}</span>
        {order.note && <span className="text-xs text-ink-soft">· pozn.: {order.note}</span>}
        {total > 0 && <span className="ml-auto font-display font-bold text-ink">{fmtCZK(total)}</span>}
      </div>
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
      className="w-16 rounded-lg border border-black/10 bg-white px-2 py-1 text-xs"
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
      <h2 className="font-display text-lg font-semibold">QR k objednání</h2>
      <p className="text-xs text-ink-soft">Naskenuj nebo sdílej odkaz — kdokoli si přes něj objedná z nabídky.</p>
      <div className="grid place-items-center">
        {qr ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={qr} alt="QR kód na objednávku merche" className="h-44 w-44 rounded-xl border border-black/10 bg-white p-2" />
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
