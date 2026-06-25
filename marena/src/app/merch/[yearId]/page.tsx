"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { applyAction } from "@/lib/actions";
import { loadReceipt } from "@/lib/receipts";
import { fmtCZK } from "@/lib/format";
import { Icon } from "@/components/Icons";
import type { DB } from "@/lib/types";

const LS_DB = "marena_db"; // demo režim (localStorage) — stejný klíč jako ve store

interface PubProduct {
  id: string;
  name: string;
  price: number | null;
  sizes: string[];
  colors: string[];
  note: string | null;
  image: string | null;
}

interface CartLine {
  key: string;
  productId: string;
  name: string;
  price: number | null;
  size?: string;
  color?: string;
  qty: number;
}

type Status = "loading" | "ready" | "notfound" | "error";

const variantLabel = (l: { size?: string; color?: string }) => [l.size, l.color].filter(Boolean).join(" · ");

export default function MerchOrderPage() {
  const { yearId } = useParams<{ yearId: string }>();
  const [status, setStatus] = useState<Status>("loading");
  const [mode, setMode] = useState<"server" | "demo">("server");
  const [label, setLabel] = useState("");
  const [products, setProducts] = useState<PubProduct[]>([]);
  const [sel, setSel] = useState<Record<string, { size?: string; color?: string }>>({});
  const [cart, setCart] = useState<CartLine[]>([]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!yearId) return;
    let cancelled = false;
    const norm = (p: Partial<PubProduct>): PubProduct => ({
      id: p.id as string,
      name: p.name as string,
      price: p.price ?? null,
      sizes: p.sizes ?? [],
      colors: p.colors ?? [],
      note: p.note ?? null,
      image: p.image ?? null,
    });
    (async () => {
      try {
        const res = await fetch(`/api/merch/${yearId}`, { cache: "no-store" });
        if (res.ok) {
          const j = (await res.json()) as { label: string; products: Partial<PubProduct>[] };
          if (!cancelled) {
            setMode("server");
            setLabel(j.label);
            setProducts(j.products.map(norm));
            setStatus("ready");
          }
          return;
        }
        if (res.status === 404) {
          if (!cancelled) setStatus("notfound");
          return;
        }
      } catch {
        /* síť selhala → demo režim */
      }
      try {
        const raw = localStorage.getItem(LS_DB);
        const db = raw ? (JSON.parse(raw) as DB) : null;
        const year = db?.years.find((y) => y.id === yearId);
        if (!year) {
          if (!cancelled) setStatus("notfound");
          return;
        }
        const list = await Promise.all(
          (year.merch ?? []).map(async (p) =>
            norm({
              id: p.id,
              name: p.name,
              price: p.price ?? null,
              sizes: p.sizes ?? [],
              colors: p.colors ?? [],
              note: p.note ?? null,
              image: p.blobId ? await loadReceipt(p.blobId, false) : null,
            }),
          ),
        );
        if (!cancelled) {
          setMode("demo");
          setLabel(year.label);
          setProducts(list);
          setStatus("ready");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [yearId]);

  function addToCart(p: PubProduct) {
    const s = sel[p.id] || {};
    const size = p.sizes.length ? s.size ?? p.sizes[0] : undefined;
    const color = p.colors.length ? s.color ?? p.colors[0] : undefined;
    const key = `${p.id}|${size ?? ""}|${color ?? ""}`;
    setCart((prev) => {
      const i = prev.findIndex((l) => l.key === key);
      if (i >= 0) return prev.map((l, j) => (j === i ? { ...l, qty: l.qty + 1 } : l));
      return [...prev, { key, productId: p.id, name: p.name, price: p.price, size, color, qty: 1 }];
    });
  }
  const removeLine = (key: string) => setCart((prev) => prev.filter((l) => l.key !== key));
  const total = cart.reduce((sum, l) => sum + (l.price ?? 0) * l.qty, 0);

  async function submit() {
    setErr(null);
    if (!name.trim()) return setErr("Vyplň prosím jméno.");
    if (!phone.trim() && !email.trim()) return setErr("Vyplň telefon nebo e-mail, ať tě umíme kontaktovat.");
    if (cart.length === 0) return setErr("Košík je prázdný — přidej aspoň jednu věc z nabídky.");

    setSubmitting(true);
    try {
      if (mode === "server") {
        const res = await fetch(`/api/merch/${yearId}/order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            phone,
            email,
            note,
            selections: cart.map((l) => ({ productId: l.productId, qty: l.qty, size: l.size, color: l.color })),
          }),
        });
        if (!res.ok) {
          setErr("Objednávku se nepodařilo odeslat. Zkus to prosím znovu.");
          setSubmitting(false);
          return;
        }
      } else {
        const raw = localStorage.getItem(LS_DB);
        const db = raw ? (JSON.parse(raw) as DB) : null;
        if (!db) {
          setErr("Demo data nejsou k dispozici.");
          setSubmitting(false);
          return;
        }
        const next = applyAction(db, {
          type: "addMerchOrder",
          yearId,
          name,
          phone,
          email,
          note,
          items: cart.map((l) => ({ productId: l.productId, name: l.name, size: l.size, color: l.color, qty: l.qty })),
        });
        localStorage.setItem(LS_DB, JSON.stringify(next));
      }
      setDone(true);
    } catch {
      setErr("Něco se pokazilo. Zkus to prosím znovu.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-paper">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6 text-center">
          <div className="font-display text-3xl font-bold tracking-[0.12em]">
            {"MAŘENA".split("").map((ch, i) => (
              <span key={i} className="marena-letter" style={{ animationDelay: `${i * -0.06}s` }}>
                {ch}
              </span>
            ))}
          </div>
          <p className="mt-1 text-sm text-ink-soft">Merch{label ? ` · ${label}` : ""}</p>
        </div>

        {status === "loading" && <p className="text-center text-sm text-ink-soft">Načítám nabídku…</p>}
        {status === "notfound" && (
          <div className="card p-8 text-center text-sm text-ink-soft">Tahle nabídka merche není dostupná.</div>
        )}
        {status === "error" && (
          <div className="card p-8 text-center text-sm text-red-600">Nepodařilo se načíst nabídku.</div>
        )}

        {status === "ready" && done && (
          <div className="card p-8 text-center">
            <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-leaf/15 text-2xl">✅</div>
            <h1 className="font-display text-xl font-semibold">Děkujeme, objednávka odeslána!</h1>
            <p className="mt-1 text-sm text-ink-soft">Ozveme se ti na zadaný kontakt ohledně vyzvednutí a platby.</p>
          </div>
        )}

        {status === "ready" && !done && (
          <div className="space-y-6">
            {products.length === 0 ? (
              <div className="card p-8 text-center text-sm text-ink-soft">Nabídka se právě připravuje. Kdyžtak to zkus později.</div>
            ) : (
              <>
                <section className="space-y-3">
                  <h1 className="font-display text-lg font-semibold">Vyber si z nabídky</h1>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {products.map((p) => {
                      const curSize = p.sizes.length ? sel[p.id]?.size ?? p.sizes[0] : undefined;
                      const curColor = p.colors.length ? sel[p.id]?.color ?? p.colors[0] : undefined;
                      return (
                        <div key={p.id} className="card overflow-hidden">
                          {p.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.image} alt={p.name} className="h-44 w-full bg-paper2 object-contain" />
                          ) : (
                            <div className="grid h-44 w-full place-items-center bg-paper2 text-ink-soft">bez fotky</div>
                          )}
                          <div className="p-3">
                            <p className="break-words font-semibold">{p.name}</p>
                            {p.price != null && <p className="text-sm text-ink-soft">{fmtCZK(p.price)}</p>}
                            {p.note && <p className="mt-1 text-xs text-ink-soft">{p.note}</p>}

                            {p.sizes.length > 0 && (
                              <div className="mt-2.5">
                                <p className="mb-1 text-xs font-medium text-ink-soft">Velikost</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {p.sizes.map((sz) => {
                                    const on = curSize === sz;
                                    return (
                                      <button
                                        key={sz}
                                        type="button"
                                        onClick={() => setSel((s) => ({ ...s, [p.id]: { ...s[p.id], size: sz } }))}
                                        className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                                          on ? "bg-marigold-600 text-white" : "bg-paper2 text-ink-soft ring-1 ring-black/10 hover:bg-black/5"
                                        }`}
                                      >
                                        {sz}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {p.colors.length > 0 && (
                              <div className="mt-2.5">
                                <p className="mb-1 text-xs font-medium text-ink-soft">Barva</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {p.colors.map((col) => {
                                    const on = curColor === col;
                                    return (
                                      <button
                                        key={col}
                                        type="button"
                                        onClick={() => setSel((s) => ({ ...s, [p.id]: { ...s[p.id], color: col } }))}
                                        className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                                          on ? "bg-marigold-600 text-white" : "bg-paper2 text-ink-soft ring-1 ring-black/10 hover:bg-black/5"
                                        }`}
                                      >
                                        {col}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            <button
                              onClick={() => addToCart(p)}
                              className="btn-primary mt-3 w-full justify-center"
                              aria-label="Přidat do košíku"
                            >
                              <Icon name="cart" className="h-5 w-5" /> Do košíku
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section className="card space-y-3 p-4">
                  <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
                    <Icon name="cart" className="h-5 w-5 text-marigold-600" /> Košík
                  </h2>
                  {cart.length > 0 ? (
                    <ul className="space-y-1.5 text-sm">
                      {cart.map((l) => (
                        <li key={l.key} className="flex items-center justify-between gap-2">
                          <span className="min-w-0">
                            <span className="font-medium">
                              {l.qty}× {l.name}
                            </span>
                            {variantLabel(l) && <span className="text-ink-soft"> · {variantLabel(l)}</span>}
                          </span>
                          <span className="flex shrink-0 items-center gap-2">
                            {l.price != null && <span className="text-ink-soft">{fmtCZK(l.price * l.qty)}</span>}
                            <button
                              onClick={() => removeLine(l.key)}
                              className="text-ink-soft/60 hover:text-red-600"
                              aria-label="Odebrat z košíku"
                              title="Odebrat"
                            >
                              ✕
                            </button>
                          </span>
                        </li>
                      ))}
                      {total > 0 && (
                        <li className="flex justify-between gap-2 border-t border-black/10 pt-1 font-semibold">
                          <span>Celkem</span>
                          <span>{fmtCZK(total)}</span>
                        </li>
                      )}
                    </ul>
                  ) : (
                    <p className="text-sm text-ink-soft">Košík je prázdný — nahoře vyber velikost/barvu a klikni na 🛒 Do košíku.</p>
                  )}

                  <div className="grid gap-2 pt-1 sm:grid-cols-2">
                    <input className="input" placeholder="Jméno a příjmení" value={name} onChange={(e) => setName(e.target.value)} />
                    <input className="input" placeholder="Telefon" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    <input className="input sm:col-span-2" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input className="input sm:col-span-2" placeholder="Poznámka (nepovinné)" value={note} onChange={(e) => setNote(e.target.value)} />
                  </div>

                  {err && <p className="text-sm text-red-600">{err}</p>}
                  <button className="btn-primary w-full justify-center" onClick={submit} disabled={submitting}>
                    {submitting ? "Odesílám…" : "Objednat"}
                  </button>
                  <p className="text-center text-[11px] text-ink-soft">Objednávka je nezávazná rezervace — tým Mařeny se ti ozve.</p>
                </section>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
