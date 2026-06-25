"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { applyAction } from "@/lib/actions";
import { loadReceipt } from "@/lib/receipts";
import { fmtCZK } from "@/lib/format";
import type { DB } from "@/lib/types";

const LS_DB = "marena_db"; // demo režim (localStorage) — stejný klíč jako ve store

interface PubProduct {
  id: string;
  name: string;
  price: number | null;
  note: string | null;
  image: string | null;
}

type Status = "loading" | "ready" | "notfound" | "error";

export default function MerchOrderPage() {
  const { yearId } = useParams<{ yearId: string }>();
  const [status, setStatus] = useState<Status>("loading");
  const [mode, setMode] = useState<"server" | "demo">("server");
  const [label, setLabel] = useState("");
  const [products, setProducts] = useState<PubProduct[]>([]);
  const [qty, setQty] = useState<Record<string, number>>({});

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
    (async () => {
      // 1) zkus sdílený backend (produkce)
      try {
        const res = await fetch(`/api/merch/${yearId}`, { cache: "no-store" });
        if (res.ok) {
          const j = (await res.json()) as { label: string; products: PubProduct[] };
          if (!cancelled) {
            setMode("server");
            setLabel(j.label);
            setProducts(j.products);
            setStatus("ready");
          }
          return;
        }
        if (res.status === 404) {
          if (!cancelled) setStatus("notfound");
          return;
        }
        // 503 → backend není nastavený → demo režim níže
      } catch {
        /* síť selhala → demo režim */
      }
      // 2) demo režim — data z localStorage tohoto prohlížeče
      try {
        const raw = localStorage.getItem(LS_DB);
        const db = raw ? (JSON.parse(raw) as DB) : null;
        const year = db?.years.find((y) => y.id === yearId);
        if (!year) {
          if (!cancelled) setStatus("notfound");
          return;
        }
        const list = await Promise.all(
          (year.merch ?? []).map(async (p) => ({
            id: p.id,
            name: p.name,
            price: p.price ?? null,
            note: p.note ?? null,
            image: p.blobId ? await loadReceipt(p.blobId, false) : null,
          })),
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

  const setItemQty = (id: string, n: number) =>
    setQty((q) => ({ ...q, [id]: Math.max(0, Math.min(99, n)) }));

  const selections = products.map((p) => ({ ...p, qty: qty[p.id] || 0 })).filter((p) => p.qty > 0);
  const total = selections.reduce((sum, p) => sum + (p.price ?? 0) * p.qty, 0);

  async function submit() {
    setErr(null);
    if (!name.trim()) return setErr("Vyplň prosím jméno.");
    if (!phone.trim() && !email.trim()) return setErr("Vyplň telefon nebo e-mail, ať tě umíme kontaktovat.");
    if (selections.length === 0) return setErr("Vyber aspoň jednu věc z nabídky.");

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
            selections: selections.map((s) => ({ productId: s.id, qty: s.qty })),
          }),
        });
        if (!res.ok) {
          setErr("Objednávku se nepodařilo odeslat. Zkus to prosím znovu.");
          setSubmitting(false);
          return;
        }
      } else {
        // demo režim — zapiš do localStorage
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
          items: selections.map((s) => ({ productId: s.id, name: s.name, qty: s.qty })),
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
                    {products.map((p) => (
                      <div key={p.id} className="card overflow-hidden">
                        {p.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.image} alt={p.name} className="h-44 w-full bg-paper2 object-contain" />
                        ) : (
                          <div className="grid h-44 w-full place-items-center bg-paper2 text-ink-soft">bez fotky</div>
                        )}
                        <div className="p-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="break-words font-semibold">{p.name}</p>
                              {p.price != null && <p className="text-sm text-ink-soft">{fmtCZK(p.price)}</p>}
                            </div>
                          </div>
                          {p.note && <p className="mt-1 text-xs text-ink-soft">{p.note}</p>}
                          <div className="mt-3 flex items-center gap-2">
                            <button
                              className="grid h-8 w-8 place-items-center rounded-full bg-black/5 text-lg hover:bg-black/10"
                              onClick={() => setItemQty(p.id, (qty[p.id] || 0) - 1)}
                              aria-label="Méně"
                            >
                              −
                            </button>
                            <span className="w-8 text-center font-semibold">{qty[p.id] || 0}</span>
                            <button
                              className="grid h-8 w-8 place-items-center rounded-full bg-black/5 text-lg hover:bg-black/10"
                              onClick={() => setItemQty(p.id, (qty[p.id] || 0) + 1)}
                              aria-label="Více"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="card space-y-3 p-4">
                  <h2 className="font-display text-lg font-semibold">Objednávka</h2>
                  {selections.length > 0 ? (
                    <ul className="space-y-1 text-sm">
                      {selections.map((s) => (
                        <li key={s.id} className="flex justify-between gap-2">
                          <span>
                            {s.qty}× {s.name}
                          </span>
                          {s.price != null && <span className="text-ink-soft">{fmtCZK(s.price * s.qty)}</span>}
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
                    <p className="text-sm text-ink-soft">Zatím nic nevybráno — nahoře přidej množství u věcí, které chceš.</p>
                  )}

                  <div className="grid gap-2 sm:grid-cols-2">
                    <input className="input" placeholder="Jméno a příjmení" value={name} onChange={(e) => setName(e.target.value)} />
                    <input className="input" placeholder="Telefon" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    <input className="input sm:col-span-2" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input className="input sm:col-span-2" placeholder="Poznámka (velikost, barva…)" value={note} onChange={(e) => setNote(e.target.value)} />
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
