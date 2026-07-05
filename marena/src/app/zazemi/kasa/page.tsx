"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Icon } from "@/components/Icons";
import { Modal } from "@/components/Modal";
import { PayQr } from "@/components/PayQr";
import { parseAccount } from "@/lib/payment";
import { fmtCZK, todayISO } from "@/lib/format";
import { uid } from "@/lib/id";
import { isAdmin } from "@/lib/admin";
import { flash } from "@/components/Flash";

// Položka markovaná na kase. Merch si nese productId (kvůli skladu a zápisu
// objednávky), jídlo/pití a vlastní položky se zapisují rovnou do financí.
type SaleLine = {
  key: string;
  kind: "merch" | "bar" | "kuchyne" | "custom";
  productId?: string;
  name: string;
  price: number;
  qty: number;
};

export default function KasaPage() {
  const { currentYear, me, dispatch, canEditCurrentYear } = useStore();
  const [lines, setLines] = useState<SaleLine[]>([]);
  const [qrOpen, setQrOpen] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customPrice, setCustomPrice] = useState("");
  const year = currentYear;
  if (!year) return null;

  const account = year.paymentAccount ?? "";
  const accountOk = account && !("error" in parseAccount(account));

  const merchItems = (year.merch ?? []).filter((p) => p.price != null && p.price > 0);
  const barItems = (year.bar ?? []).filter((d) => (d.place ?? "bar") === "bar" && d.price != null && d.price > 0);
  const foodItems = (year.bar ?? []).filter((d) => (d.place ?? "bar") === "kuchyne" && d.price != null && d.price > 0);

  const total = lines.reduce((s, l) => s + l.price * l.qty, 0);

  // Zpráva pro příjemce v QR: za co se platí (MERCH / BAR / JIDLO / KASA) + položky.
  // Banka to pak ukáže ve výpisu, takže je hned vidět, čeho se platba týká.
  const kindWord: Record<SaleLine["kind"], string> = { merch: "MERCH", bar: "BAR", kuchyne: "JIDLO", custom: "KASA" };
  const kinds = [...new Set(lines.map((l) => l.kind))];
  const qrMessage = `MARENA ${kinds.length === 1 ? kindWord[kinds[0]] : "KASA"} ${lines.map((l) => `${l.qty}X ${l.name}`).join(", ")}`;

  function add(kind: SaleLine["kind"], name: string, price: number, productId?: string) {
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

  // Po zaplacení (QR i hotově) se prodej zapíše do systému:
  //  • merch → objednávka rovnou označená „vyřízeno" (sama vytvoří příjem
  //    ve financích a odečte se ze skladu),
  //  • jídlo/pití/vlastní → příjem ve financích s rozpisem v poznámce.
  async function settle(how: "qr" | "hotove") {
    if (!year || lines.length === 0) return;
    const merch = lines.filter((l) => l.kind === "merch");
    const rest = lines.filter((l) => l.kind !== "merch");

    if (merch.length > 0) {
      const orderId = uid("mo_");
      await dispatch({
        type: "addMerchOrder",
        yearId: year.id,
        id: orderId,
        name: "Kasa — prodej na místě",
        note: `markoval(a): ${me}${how === "hotove" ? " · hotově" : " · QR platba"}`,
        items: merch.map((l) => ({ productId: l.productId!, name: l.name, price: l.price, qty: l.qty })),
      });
      await dispatch({ type: "toggleMerchOrderDone", yearId: year.id, orderId });
    }
    if (rest.length > 0) {
      const amount = rest.reduce((s, l) => s + l.price * l.qty, 0);
      const onlyBar = rest.every((l) => l.kind === "bar");
      await dispatch({
        type: "addFinance",
        yearId: year.id,
        kind: "prijem",
        label: "Kasa — prodej na místě",
        amount,
        category: onlyBar ? "bar" : "kasa",
        who: me,
        paid: true,
        date: todayISO(),
        note: rest.map((l) => `${l.qty}× ${l.name}`).join(", ") + (how === "hotove" ? " · hotově" : " · QR platba"),
      });
    }
    setLines([]);
    setQrOpen(false);
    flash(`Zaplaceno ${fmtCZK(total)} — zapsáno do systému`, "💰");
  }

  if (!canEditCurrentYear) {
    return (
      <div className="card p-6 text-center text-sm text-ink-soft">
        Kasa je jen pro aktuální ročník — uzamčené ročníky se prohlížejí.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5 tabular-nums">
      <div>
        <h1 className="font-display text-[28px] font-bold tracking-tight">Kasa</h1>
        <p className="mt-0.5 text-sm text-ink-soft">Namarkuj, ukaž QR, po zaplacení zapiš — sklad i finance se srovnají samy.</p>
      </div>

      {/* Účet pro platby — nastavuje správce, kasa ho jen používá. */}
      {isAdmin(me) ? (
        <AccountSettings account={account} yearId={year.id} />
      ) : !accountOk ? (
        <p className="card p-3 text-sm text-amber-700">⚠️ Správce zatím nenastavil účet pro QR platby — zatím vybírej hotově.</p>
      ) : null}

      {/* Nabídka — merch / bar / kuchyně / vlastní položka */}
      <ItemGrid title="Merch" items={merchItems.map((p) => ({ id: p.id, name: p.name, price: p.price! }))} onAdd={(i) => add("merch", i.name, i.price, i.id)} />
      <ItemGrid title="Pití (bar)" items={barItems.map((d) => ({ id: d.id, name: d.name, price: d.price! }))} onAdd={(i) => add("bar", i.name, i.price)} />
      <ItemGrid title="Jídlo (kuchyně)" items={foodItems.map((d) => ({ id: d.id, name: d.name, price: d.price! }))} onAdd={(i) => add("kuchyne", i.name, i.price)} />

      <section className="card space-y-2 p-4">
        <h2 className="font-display text-[20px] font-semibold">Vlastní položka</h2>
        <div className="flex flex-wrap items-center gap-2">
          <input className="input min-w-[140px] flex-1" placeholder="Co prodáváš?" value={customName} onChange={(e) => setCustomName(e.target.value)} />
          <input className="input w-28" placeholder="Kč" inputMode="numeric" value={customPrice} onChange={(e) => setCustomPrice(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addCustom()} />
          <button className="btn-secondary px-4" onClick={addCustom} disabled={!customName.trim() || !customPrice.trim()}>
            + Přidat
          </button>
        </div>
      </section>

      {/* Účtenka */}
      <section className="card p-4">
        <h2 className="font-display text-[20px] font-semibold">Účtenka</h2>
        {lines.length === 0 ? (
          <p className="mt-2 text-sm text-ink-soft">Zatím prázdná — ťukni nahoře na položky.</p>
        ) : (
          <div className="mt-2 divide-y divide-ink/[0.06]">
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
          <p className="mt-2 text-xs text-ink-soft">QR platba se odemkne, jakmile správce nastaví účet.</p>
        )}
      </section>

      {/* QR platba — zákazník skenuje, kasař po zaplacení potvrdí zápis. */}
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
    </div>
  );
}

// Dlaždice položek k namarkování — velké ťukací plochy pro rychlou obsluhu.
function ItemGrid({ title, items, onAdd }: { title: string; items: { id: string; name: string; price: number }[]; onAdd: (i: { id: string; name: string; price: number }) => void }) {
  if (items.length === 0) return null;
  return (
    <section className="card p-4">
      <h2 className="font-display text-[20px] font-semibold">{title}</h2>
      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {items.map((i) => (
          <button
            key={i.id}
            onClick={() => onAdd(i)}
            className="flex min-h-11 items-center justify-between gap-2 rounded-lg bg-paper2 px-3 py-2.5 text-left transition hover:bg-gold-100 active:scale-[0.98]"
          >
            <span className="min-w-0 truncate text-[15px] font-medium">{i.name}</span>
            <span className="shrink-0 text-sm font-semibold text-ink-soft">{fmtCZK(i.price)}</span>
          </button>
        ))}
      </div>
    </section>
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
    await dispatch({ type: "updateYear", yearId, patch: { paymentAccount: value.trim() } });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    flash("Účet pro platby uložen", "🏦");
  }

  return (
    <section className="card space-y-2 p-4">
      <h2 className="font-display text-[20px] font-semibold">🏦 Účet pro QR platby</h2>
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
      {!value.trim() && <p className="text-sm text-ink-soft">Zadej účet, na který mají chodit platby z kasy i online objednávek merche.</p>}
    </section>
  );
}
