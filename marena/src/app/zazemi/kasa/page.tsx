"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { SaleBox } from "@/components/SaleBox";
import { parseAccount } from "@/lib/payment";
import { isAdmin } from "@/lib/admin";
import { flash } from "@/components/Flash";

// Kasa = obecná pokladna (vstupné, kelímky, cokoliv mimo nabídky) a nastavení
// účtu pro QR platby. Merch se markuje v sekci Merch, jídlo a pití v sekci
// Kuchyně & bar — prodej se tvoří přímo na svém místě, finance dostanou
// zápis až po zaplacení.
export default function KasaPage() {
  const { currentYear, me, canEditCurrentYear } = useStore();
  const year = currentYear;
  if (!year) return null;

  const account = year.paymentAccount ?? "";
  const accountOk = account && !("error" in parseAccount(account));

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
        <p className="mt-0.5 text-sm text-ink-soft">
          Obecná pokladna na cokoliv mimo nabídky. Merch se markuje v sekci{" "}
          <Link href="/zazemi/merch" className="font-medium text-gold-700 underline underline-offset-2">
            Merch
          </Link>
          , jídlo a pití v{" "}
          <Link href="/zazemi/kuchyne" className="font-medium text-gold-700 underline underline-offset-2">
            Kuchyně &amp; bar
          </Link>
          .
        </p>
      </div>

      {/* Účet pro platby — nastavuje správce, QR ho pak používá všude. */}
      {isAdmin(me) ? (
        <AccountSettings account={account} yearId={year.id} />
      ) : !accountOk ? (
        <p className="card p-3 text-sm text-amber-700">⚠️ Správce zatím nenastavil účet pro QR platby — zatím vybírej hotově.</p>
      ) : null}

      {/* key: při přepnutí ročníku se účtenka vyprázdní (ať se prodej
          nezapíše do jiného ročníku, než ve kterém byl namarkovaný) */}
      <SaleBox key={year.id} sources={[]} allowCustom label="Kasa — prodej na místě" />
    </div>
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
      {!value.trim() && <p className="text-sm text-ink-soft">Zadej účet, na který mají chodit platby z prodeje i online objednávek merche.</p>}
    </section>
  );
}
