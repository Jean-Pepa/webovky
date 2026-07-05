"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Modal } from "@/components/Modal";
import { PayQr } from "@/components/PayQr";
import { parseAccount } from "@/lib/payment";
import { fmtCZK, todayISO } from "@/lib/format";
import { uid } from "@/lib/id";
import { flash } from "@/components/Flash";

// „+ Objednávka" — objednávka na místě přes appku, ve dvou krocích jako
// v restauraci: (1) obsluha nakliká položky, (2) ukáže QR na svém mobilu
// a po zaplacení odklikne. Merch vytvoří skutečnou objednávku (jde nechat
// i nezaplacenou a QR ukázat později ze seznamu), jídlo a pití se po
// zaplacení propíše rovnou do financí po kategoriích (bar / kuchyně).
type Mode = "merch" | "gastro";
type Kind = "merch" | "bar" | "kuchyne";

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

const KIND_WORD: Record<Kind, string> = { merch: "MERCH", bar: "BAR", kuchyne: "JIDLO" };

const lineLabel = (l: Line) =>
  `${l.name}${[l.size, l.color].filter(Boolean).length ? ` (${[l.size, l.color].filter(Boolean).join(" · ")})` : ""}`;

export function NewOrderButton({ mode }: { mode: Mode }) {
  const { currentYear, me, dispatch, canEditCurrentYear } = useStore();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"pick" | "pay">("pick");
  const [lines, setLines] = useState<Line[]>([]);
  const [customer, setCustomer] = useState("");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [picker, setPicker] = useState<{ productId: string; size?: string; color?: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const year = currentYear;
  if (!year || !canEditCurrentYear) return null;

  const account = year.paymentAccount ?? "";
  const accountOk = !!account && !("error" in parseAccount(account));

  const grids: { kind: Kind; title: string; items: { id: string; name: string; price: number }[] }[] =
    mode === "merch"
      ? [
          {
            kind: "merch",
            title: "Merch",
            items: (year.merch ?? []).filter((p) => p.price != null && p.price > 0).map((p) => ({ id: p.id, name: p.name, price: p.price! })),
          },
        ]
      : [
          {
            kind: "kuchyne",
            title: "Jídlo (kuchyně)",
            items: (year.bar ?? [])
              .filter((d) => (d.place ?? "bar") === "kuchyne" && d.price != null && d.price > 0)
              .map((d) => ({ id: d.id, name: d.name, price: d.price! })),
          },
          {
            kind: "bar",
            title: "Pití (bar)",
            items: (year.bar ?? [])
              .filter((d) => (d.place ?? "bar") === "bar" && d.price != null && d.price > 0)
              .map((d) => ({ id: d.id, name: d.name, price: d.price! })),
          },
        ];
  if (grids.every((g) => g.items.length === 0)) return null;

  const pickerProduct = picker ? (year.merch ?? []).find((p) => p.id === picker.productId) : undefined;
  const total = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const kinds = [...new Set(lines.map((l) => l.kind))];
  const kindsWord =
    kinds.length === 1
      ? KIND_WORD[kinds[0]]
      : kinds.every((k) => k === "bar" || k === "kuchyne")
        ? "JIDLO A PITI"
        : "KASA";
  const qrMessage = `MARENA ${kindsWord} ${lines.map((l) => `${l.qty}X ${lineLabel(l)}`).join(", ")}${
    mode === "merch" && customer.trim() ? ` — ${customer.trim()}` : ""
  }`;

  // Klíč řádku nese i cenu — dvě stejně pojmenované položky s jinou cenou
  // (druhé „Pivo" na baru) se nesmí slít do jedné.
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

  function reset() {
    setLines([]);
    setCustomer("");
    setOrderId(null);
    setPicker(null);
    setStep("pick");
  }

  // Merch: objednávka vznikne už při přechodu na QR — dá se nechat
  // i nezaplacená a vyřídit později ze seznamu objednávek. Vrací null,
  // když se založení nepodařilo uložit (výpadek sítě).
  async function ensureOrder(): Promise<string | null> {
    if (orderId) return orderId;
    const id = uid("mo_");
    const ok = await dispatch({
      type: "addMerchOrder",
      yearId: year!.id,
      id,
      name: customer.trim() || "Prodej na místě",
      note: `markoval(a): ${me}`,
      items: lines.map((l) => ({ productId: l.productId!, name: l.name, size: l.size, color: l.color, price: l.price, qty: l.qty })),
    });
    if (!ok) return null;
    setOrderId(id);
    return id;
  }

  async function toPay() {
    if (lines.length === 0 || busy) return;
    setBusy(true);
    try {
      if (mode === "merch" && !(await ensureOrder())) {
        flash("Objednávku se nepodařilo uložit — zkontroluj připojení", "⚠️");
        return;
      }
      setStep("pay");
    } finally {
      setBusy(false);
    }
  }

  // Zápis prodeje. Hlídá výsledek každého uložení: co se nezapsalo, zůstává
  // v objednávce, ať se dá po výpadku sítě zkusit znovu (a nic není dvakrát).
  async function settle(how: "qr" | "hotove") {
    if (lines.length === 0 || busy) return;
    const howText = how === "hotove" ? "hotově" : "QR platba";
    setBusy(true);
    try {
      if (mode === "merch") {
        const id = await ensureOrder();
        if (!id) {
          flash("Objednávku se nepodařilo uložit — zkontroluj připojení", "⚠️");
          return;
        }
        if (!(await dispatch({ type: "settleMerchOrder", yearId: year!.id, orderId: id, how: howText }))) {
          flash("Objednávka je založená, ale platba se nezapsala — zkus to znovu", "⚠️");
          return;
        }
      } else {
        // Jídlo a pití → příjem po kategoriích, ať ve financích sedí
        // součty za bar i kuchyni zvlášť.
        const written = new Set<string>();
        let ok = true;
        for (const kind of ["bar", "kuchyne"] as const) {
          const group = lines.filter((l) => l.kind === kind);
          if (group.length === 0) continue;
          ok = await dispatch({
            type: "addFinance",
            yearId: year!.id,
            kind: "prijem",
            label: "Prodej na místě",
            amount: group.reduce((s, l) => s + l.price * l.qty, 0),
            category: kind === "bar" ? "bar" : "kuchyně",
            who: me,
            paid: true,
            date: todayISO(),
            note: group.map((l) => `${l.qty}× ${l.name}`).join(", ") + ` · ${howText}`,
          });
          if (!ok) break;
          group.forEach((l) => written.add(l.key));
        }
        if (!ok) {
          setLines((prev) => prev.filter((l) => !written.has(l.key)));
          flash("Nezapsáno — zkontroluj připojení a zkus to znovu", "⚠️");
          return;
        }
      }
      flash(`Zaplaceno ${fmtCZK(total)} — zapsáno`, "💰");
      reset();
      setOpen(false);
    } finally {
      setBusy(false);
    }
  }

  // Merch: rozmyslel si to u QR → objednávku zrušíme, položky zůstanou.
  async function cancelOrder() {
    if (!orderId || busy) return;
    setBusy(true);
    try {
      if (!(await dispatch({ type: "removeMerchOrder", yearId: year!.id, orderId }))) {
        flash("Zrušení se nepodařilo uložit — zkontroluj připojení", "⚠️");
        return;
      }
      setOrderId(null);
      setStep("pick");
    } finally {
      setBusy(false);
    }
  }

  function close() {
    if (mode === "merch" && step === "pay" && orderId) {
      flash("Objednávka čeká nezaplacená — QR najdeš u ní v seznamu", "🧾");
      reset();
    }
    setPicker(null);
    setStep("pick");
    setOpen(false);
  }

  return (
    <>
      <button className="btn-primary" onClick={() => setOpen(true)}>
        + Objednávka
      </button>
      <Modal open={open} onClose={close} title={step === "pick" ? "Nová objednávka" : `Platba — ${fmtCZK(total)}`}>
        {step === "pick" ? (
          <div className="space-y-4">
            {grids.map(
              (g) =>
                g.items.length > 0 && (
                  <div key={g.kind}>
                    {grids.filter((x) => x.items.length > 0).length > 1 && (
                      <h3 className="mb-1.5 text-sm font-semibold text-ink-soft">{g.title}</h3>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      {g.items.map((i) => (
                        <button
                          key={i.id}
                          onClick={() => tapItem(g.kind, i)}
                          className="flex min-h-11 items-center justify-between gap-2 rounded-lg bg-paper2 px-3 py-2.5 text-left transition hover:bg-gold-100 active:scale-[0.98]"
                        >
                          <span className="min-w-0 truncate text-[15px] font-medium">{i.name}</span>
                          <span className="shrink-0 text-sm font-semibold text-ink-soft">{fmtCZK(i.price)}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ),
            )}

            {/* Doptání na velikost/barvu (jen merch s variantami) */}
            {picker && pickerProduct && (
              <div className="rounded-lg border border-gold-300 bg-gold-50 p-3">
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
                  <button
                    className="btn-primary flex-1"
                    onClick={confirmPicker}
                    disabled={(pickerProduct.sizes?.length ?? 0) > 0 && !picker.size}
                  >
                    Přidat do objednávky
                  </button>
                  <button className="btn-ghost" onClick={() => setPicker(null)}>
                    Zrušit
                  </button>
                </div>
              </div>
            )}

            {/* Účtenka */}
            <div className="border-t border-ink/10 pt-3">
              {lines.length === 0 ? (
                <p className="text-sm text-ink-soft">Zatím prázdné — ťukni nahoře na položky.</p>
              ) : (
                <div className="divide-y divide-ink/[0.06]">
                  {lines.map((l) => (
                    <div key={l.key} className="flex min-h-11 items-center gap-2 py-1.5 tabular-nums">
                      <span className="min-w-0 flex-1 truncate text-[15px] font-medium">{lineLabel(l)}</span>
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

              {mode === "merch" && (
                <input
                  className="input mt-3 w-full"
                  placeholder="Jméno zákazníka (nepovinné)"
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                />
              )}

              <div className="mt-3 flex items-center justify-between border-t border-ink/10 pt-3 tabular-nums">
                <span className="text-[15px] font-medium text-ink-soft">Celkem</span>
                <span className="font-display text-[28px] font-bold tracking-tight">{fmtCZK(total)}</span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button className="btn-primary flex-1" disabled={total <= 0 || !accountOk || busy} onClick={toPay}>
                  QR platba
                </button>
                <button className="btn-secondary flex-1" disabled={total <= 0 || busy} onClick={() => settle("hotove")}>
                  💵 Hotově
                </button>
              </div>
              {total > 0 && !accountOk && (
                <p className="mt-2 text-xs text-ink-soft">QR platba se odemkne, jakmile správce nastaví účet v Kase.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <PayQr account={account} amount={total} message={qrMessage} />
            <div className="flex flex-col gap-2">
              <button className="btn-primary" disabled={busy} onClick={() => settle("qr")}>
                ✓ Zaplaceno — uzavřít
              </button>
              <button className="btn-secondary" disabled={busy} onClick={() => settle("hotove")}>
                💵 Nakonec hotově — uzavřít
              </button>
              {mode === "merch" ? (
                <div className="flex gap-2">
                  <button className="btn-ghost flex-1" onClick={close}>
                    Nechat nezaplacené
                  </button>
                  <button className="btn-ghost flex-1 text-red-600" disabled={busy} onClick={cancelOrder}>
                    Zrušit objednávku
                  </button>
                </div>
              ) : (
                <button className="btn-ghost" onClick={() => setStep("pick")}>
                  ← Zpět na položky
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
