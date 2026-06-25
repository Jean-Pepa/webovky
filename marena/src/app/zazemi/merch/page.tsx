"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { Icon } from "@/components/Icons";
import { Modal } from "@/components/Modal";
import { DeleteButton } from "@/components/DeleteButton";
import { compressImage, saveReceipt, loadReceipt, deleteReceipt } from "@/lib/receipts";
import { fmtCZK, fmtDate } from "@/lib/format";
import { uid } from "@/lib/id";
import { canSeeMerch } from "@/lib/merch";
import type { MerchProduct, MerchOrder } from "@/lib/types";

export default function MerchPage() {
  const { currentYear, me, canEditCurrentYear } = useStore();
  const year = currentYear;
  if (!year) return null;

  if (!canSeeMerch(year, me)) {
    return (
      <div className="mx-auto max-w-md">
        <div className="card p-8 text-center">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-paper2">
            <Icon name="merch" className="h-6 w-6 text-ink-soft" />
          </div>
          <h1 className="font-display text-xl font-semibold">Merch</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Tato sekce je jen pro správce a člověka s rolí <strong>Merch</strong>. Roli si přiřadíš v sekci Tým a role.
          </p>
        </div>
      </div>
    );
  }

  const products = year.merch ?? [];
  const orders = [...(year.merchOrders ?? [])].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Merch</h1>
        <p className="text-sm text-ink-soft">Nahraj fotky nabídky, sdílej QR kód a sleduj objednávky.</p>
      </div>

      {/* Nabídka (fotky merche) */}
      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold">Nabídka</h2>
        {canEditCurrentYear ? (
          <AddProduct yearId={year.id} />
        ) : (
          <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            🔒 Tento ročník je uzamčený — nabídku jde jen prohlížet.
          </p>
        )}
        {products.length === 0 ? (
          <div className="card grid place-items-center p-8 text-center text-sm text-ink-soft">
            Zatím žádný merch. Nahraj první kousek.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} yearId={year.id} editable={canEditCurrentYear} />
            ))}
          </div>
        )}
      </section>

      {/* Objednávky + QR */}
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <section className="space-y-3">
          <h2 className="font-display text-lg font-semibold">
            Objednávky <span className="text-sm font-normal text-ink-soft">({orders.length})</span>
          </h2>
          {orders.length === 0 ? (
            <div className="card grid place-items-center p-8 text-center text-sm text-ink-soft">
              Zatím žádné objednávky. Lidi objednávají přes QR kód vedle.
            </div>
          ) : (
            <div className="space-y-2">
              {orders.map((o) => (
                <OrderRow key={o.id} order={o} yearId={year.id} />
              ))}
            </div>
          )}
        </section>

        <aside>
          <QrCard yearId={year.id} />
        </aside>
      </div>
    </div>
  );
}

function AddProduct({ yearId }: { yearId: string }) {
  const { dispatch, configured } = useStore();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
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
        note,
      });
      setName("");
      setPrice("");
      setNote("");
      setFile(null);
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
      <input className="input" placeholder="Poznámka (velikosti, barvy…)" value={note} onChange={(e) => setNote(e.target.value)} />
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

function ProductCard({ product, yearId, editable }: { product: MerchProduct; yearId: string; editable: boolean }) {
  const { dispatch, configured } = useStore();
  const [img, setImg] = useState<string | null>(null);
  const [viewing, setViewing] = useState(false);

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
          {editable && <DeleteButton onConfirm={remove} />}
        </div>
        {product.note && <p className="mt-1 text-xs text-ink-soft">{product.note}</p>}
      </div>

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

function OrderRow({ order, yearId }: { order: MerchOrder; yearId: string }) {
  const { dispatch } = useStore();
  return (
    <div className="card p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold">{order.name}</p>
          <p className="text-xs text-ink-soft">{fmtDate(order.createdAt)}</p>
        </div>
        <DeleteButton onConfirm={() => dispatch({ type: "removeMerchOrder", yearId, orderId: order.id })} />
      </div>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {order.items.map((it, i) => (
          <span key={i} className="chip">
            {it.qty}× {it.name}
          </span>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
        {order.phone && (
          <a href={`tel:${order.phone}`} className="text-ink-soft hover:text-ink">
            📞 {order.phone}
          </a>
        )}
        {order.email && (
          <a href={`mailto:${order.email}`} className="text-ink-soft hover:text-ink">
            ✉️ {order.email}
          </a>
        )}
      </div>
      {order.note && <p className="mt-1 text-xs text-ink-soft">Pozn.: {order.note}</p>}
    </div>
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
