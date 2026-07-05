"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Icon } from "@/components/Icons";
import { Modal } from "@/components/Modal";
import { PayQr } from "@/components/PayQr";
import { parseAccount } from "@/lib/payment";
import { fmtCZK, todayISO } from "@/lib/format";
import { uid } from "@/lib/id";
import { flash } from "@/components/Flash";

// Prodej na místě — markovací box s QR platbou. Bydlí přímo tam, kde se
// prodává (Merch → merch, Kuchyně & bar → jídlo a pití, Kasa → cokoliv
// vlastního). Do financí se zapisuje až po zaplacení (QR i hotově):
//  • merch → objednávka rovnou vyřízená a uzamčená jako zaplacená (sama
//    vytvoří příjem ve financích a odečte se ze skladu),
//  • jídlo/pití/vlastní → příjem ve financích po kategoriích s rozpisem.
type SaleKind = "merch" | "bar" | "kuchyne" | "custom";
export type SaleSource = Exclude<SaleKind, "custom">;

type SaleLine = {
  key: string;
  kind: SaleKind;
  productId?: string;
  name: string;
  price: number;
  qty: number;
};

// Slovo do zprávy pro banku (za co se platí) a kategorie pro finance.
const KIND_WORD: Record<SaleKind, string> = { merch: "MERCH", bar: "BAR", kuchyne: "JIDLO", custom: "KASA" };
const KIND_CATEGORY: Record<Exclude<SaleKind, "merch">, string> = { bar: "bar", kuchyne: "kuchyně", custom: "kasa" };

export function SaleBox({
  sources,
  allowCustom = false,
  label,
  collapsible = false,
}: {
  sources: SaleSource[];
  allowCustom?: boolean;
  label: string; // jméno objednávky merche / popisek příjmu ve financích
  collapsible?: boolean; // na stránkách sekcí je box sbalený, ať nepřekáží
}) {
  const { currentYear, me, dispatch, canEditCurrentYear } = useStore();
  const [open, setOpen] = useState(!collapsible);
  const [lines, setLines] = useState<SaleLine[]>([]);
  const [qrOpen, setQrOpen] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customPrice, setCustomPrice] = useState("");
  const year = currentYear;
  if (!year || !canEditCurrentYear) return null;

  const account = year.paymentAccount ?? "";
  const accountOk = !!account && !("error" in parseAccount(account));

  const grids: { kind: SaleSource; title: string; items: { id: string; name: string; price: number }[] }[] = [];
  if (sources.includes("merch"))
    grids.push({
      kind: "merch",
      title: "Merch",
      items: (year.merch ?? []).filter((p) => p.price != null && p.price > 0).map((p) => ({ id: p.id, name: p.name, price: p.price! })),
    });
  if (sources.includes("bar"))
    grids.push({
      kind: "bar",
      title: "Pití (bar)",
      items: (year.bar ?? [])
        .filter((d) => (d.place ?? "bar") === "bar" && d.price != null && d.price > 0)
        .map((d) => ({ id: d.id, name: d.name, price: d.price! })),
    });
  if (sources.includes("kuchyne"))
    grids.push({
      kind: "kuchyne",
      title: "Jídlo (kuchyně)",
      items: (year.bar ?? [])
        .filter((d) => (d.place ?? "bar") === "kuchyne" && d.price != null && d.price > 0)
        .map((d) => ({ id: d.id, name: d.name, price: d.price! })),
    });

  // Není co markovat (žádné položky s cenou) → box se vůbec neukazuje.
  if (!allowCustom && grids.every((g) => g.items.length === 0)) return null;

  const total = lines.reduce((s, l) => s + l.price * l.qty, 0);

  // Zpráva pro příjemce v QR: za co se platí (MERCH / BAR / JIDLO / KASA)
  // + položky. Banka ji ukáže ve výpisu, takže je hned vidět účel platby.
  const kinds = [...new Set(lines.map((l) => l.kind))];
  const qrMessage = `MARENA ${kinds.length === 1 ? KIND_WORD[kinds[0]] : "KASA"} ${lines.map((l) => `${l.qty}X ${l.name}`).join(", ")}`;

  function add(kind: SaleKind, name: string, price: number, productId?: string) {
    setLines((prev) => {
      const key = `${kind}|${productId ?? name}`;
      const i = prev.findIndex((l) => l.key === key);
      if (i >= 0) return prev.map((l, j) => (j === i ? { ...l, qty: l.qty + 1 } : l));
      return [...prev, { key, kind, productId, name, price, qty: 1 }];
    });
  }
  function bump(key: string, delta: number) {
    setLines((prev) =>
      prev.flatMap((l) => (l.key === key ? (l.qty + delta <= 0 ? [] : [{ ...l, qty: l.qty + delta }]) : [l])),
    );
  }
  function addCustom() {
    const price = Math.round(Number(customPrice.replace(",", ".")));
    if (!customName.trim() || !Number.isFinite(price) || price <= 0) return;
    add("custom", customName.trim(), price);
    setCustomName("");
    setCustomPrice("");
  }

  async function settle(how: "qr" | "hotove") {
    if (!year || lines.length === 0) return;
    const howText = how === "hotove" ? "hotově" : "QR platba";
    const merch = lines.filter((l) => l.kind === "merch");

    if (merch.length > 0) {
      const orderId = uid("mo_");
      await dispatch({
        type: "addMerchOrder",
        yearId: year.id,
        id: orderId,
        name: label,
        note: `markoval(a): ${me} · ${howText}`,
        items: merch.map((l) => ({ productId: l.productId!, name: l.name, price: l.price, qty: l.qty })),
      });
      await dispatch({ type: "settleMerchOrder", yearId: year.id, orderId, how: howText });
    }
    // Jídlo, pití a vlastní položky → příjem po kategoriích (bar / kuchyně / kasa),
    // ať ve financích sedí součty za jednotlivé stánky.
    for (const kind of ["bar", "kuchyne", "custom"] as const) {
      const group = lines.filter((l) => l.kind === kind);
      if (group.length === 0) continue;
      await dispatch({
        type: "addFinance",
        yearId: year.id,
        kind: "prijem",
        label,
        amount: group.reduce((s, l) => s + l.price * l.qty, 0),
        category: KIND_CATEGORY[kind],
        who: me,
        paid: true,
        date: todayISO(),
        note: group.map((l) => `${l.qty}× ${l.name}`).join(", ") + ` · ${howText}`,
      });
    }
    setLines([]);
    setQrOpen(false);
    flash(`Zaplaceno ${fmtCZK(total)} — zapsáno do systému`, "💰");
  }

  return (
    <section className="card p-4 tabular-nums">
      {collapsible ? (
        <button className="flex w-full items-center justify-between gap-2 text-left" onClick={() => setOpen((o) => !o)}>
          <h2 className="font-display text-[20px] font-semibold">🛒 Prodej na místě</h2>
          <span className="rounded-full bg-paper2 px-3 py-1 text-sm font-medium text-ink-soft">{open ? "Skrýt" : "Namarkovat"}</span>
        </button>
      ) : (
        <h2 className="font-display text-[20px] font-semibold">🛒 Prodej na místě</h2>
      )}
      {!open ? (
        <p className="mt-1 text-sm text-ink-soft">Namarkuj, ukaž QR, po zaplacení zapiš — zapíše se to samo do financí.</p>
      ) : (
        <div className="mt-3 space-y-4">
          {!accountOk && (
            <p className="text-sm text-amber-700">⚠️ Správce zatím nenastavil účet pro QR platby (v Kase) — zatím vybírej hotově.</p>
          )}

          {grids.map(
            (g) =>
              g.items.length > 0 && (
                <div key={g.kind}>
                  {grids.filter((x) => x.items.length > 0).length > 1 && (
                    <h3 className="mb-1.5 text-sm font-semibold text-ink-soft">{g.title}</h3>
                  )}
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {g.items.map((i) => (
                      <button
                        key={i.id}
                        onClick={() => add(g.kind, i.name, i.price, g.kind === "merch" ? i.id : undefined)}
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

          {allowCustom && (
            <div className="flex flex-wrap items-center gap-2">
              <input className="input min-w-[140px] flex-1" placeholder="Co prodáváš?" value={customName} onChange={(e) => setCustomName(e.target.value)} />
              <input className="input w-28" placeholder="Kč" inputMode="numeric" value={customPrice} onChange={(e) => setCustomPrice(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addCustom()} />
              <button className="btn-secondary px-4" onClick={addCustom} disabled={!customName.trim() || !customPrice.trim()}>
                + Přidat
              </button>
            </div>
          )}

          {/* Účtenka */}
          <div className="border-t border-ink/10 pt-3">
            {lines.length === 0 ? (
              <p className="text-sm text-ink-soft">Účtenka je zatím prázdná — ťukni nahoře na položky.</p>
            ) : (
              <div className="divide-y divide-ink/[0.06]">
                {lines.map((l) => (
                  <div key={l.key} className="flex min-h-11 items-center gap-2 py-1.5">
                    <span className="min-w-0 flex-1 truncate text-[15px] font-medium">{l.name}</span>
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

            <div className="mt-3 flex flex-wrap gap-2">
              <button className="btn-primary flex-1" disabled={total <= 0 || !accountOk} onClick={() => setQrOpen(true)}>
                <Icon name="vote" className="h-4 w-4" /> QR k platbě
              </button>
              <button className="btn-secondary flex-1" disabled={total <= 0} onClick={() => settle("hotove")}>
                💵 Hotově — zapsat
              </button>
              {lines.length > 0 && (
                <button className="btn-ghost" onClick={() => setLines([])}>
                  Vyčistit
                </button>
              )}
            </div>
            {total > 0 && !accountOk && (
              <p className="mt-2 text-xs text-ink-soft">QR platba se odemkne, jakmile správce nastaví účet v Kase.</p>
            )}
          </div>
        </div>
      )}

      {/* QR platba — zákazník skenuje, prodejce po zaplacení potvrdí zápis. */}
      <Modal open={qrOpen} onClose={() => setQrOpen(false)} title="Zaplať naskenováním">
        <div className="space-y-4">
          <PayQr account={account} amount={total} message={qrMessage} />
          <div className="flex gap-2">
            <button className="btn-primary flex-1" onClick={() => settle("qr")}>
              ✓ Zaplaceno — zapsat
            </button>
            <button className="btn-ghost" onClick={() => setQrOpen(false)}>
              Zrušit
            </button>
          </div>
        </div>
      </Modal>
    </section>
  );
}
