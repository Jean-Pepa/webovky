"use client";

import { useState } from "react";
import { useStore, type Property, type SvjInfo } from "@/lib/store";
import { formatDate } from "@/lib/format";
import { IconBuilding, IconMoney, IconPencil } from "@/components/Icons";

export function SvjDetailSection({ property }: { property: Property }) {
  const { setSvjInfo, role } = useStore();
  const manage = role === "CREATOR";
  const svj = property.svj ?? {};
  const [edit, setEdit] = useState(false);

  const units = property.units ?? [];
  const monthly = units.reduce((s, u) => s + (u.monthlyFee ?? 0), 0);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const balance = Number(fd.get("fundBalance"));
    const data: SvjInfo = {
      ico: String(fd.get("ico") || "").trim() || undefined,
      sidlo: String(fd.get("sidlo") || "").trim() || undefined,
      founded: String(fd.get("founded") || "").trim() || undefined,
      manager: String(fd.get("manager") || "").trim() || undefined,
      bankAccount: String(fd.get("bankAccount") || "").trim() || undefined,
      fundBalance: Number.isFinite(balance) && balance >= 0 ? balance : undefined,
      fundNote: String(fd.get("fundNote") || "").trim() || undefined,
    };
    setSvjInfo(property.id, data);
    setEdit(false);
  }

  return (
    <div className="space-y-4">
      {/* Identita SVJ */}
      <section className="card p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconBuilding className="h-4 w-4 text-teal-700" />
            <h2 className="text-sm font-semibold text-stone-900">Detail společenství</h2>
          </div>
          {manage && !edit && (
            <button onClick={() => setEdit(true)} className="btn-ghost btn-sm text-teal-700">
              <IconPencil className="h-4 w-4" />
              Upravit
            </button>
          )}
        </div>

        {edit ? (
          <form onSubmit={submit} className="mt-3 grid gap-2 sm:grid-cols-2">
            <input name="ico" defaultValue={svj.ico} className="input" placeholder="IČO" />
            <input name="founded" type="date" defaultValue={svj.founded} className="input" />
            <input name="sidlo" defaultValue={svj.sidlo} className="input sm:col-span-2" placeholder="Sídlo" />
            <input name="manager" defaultValue={svj.manager} className="input" placeholder="Správce" />
            <input name="bankAccount" defaultValue={svj.bankAccount} className="input" placeholder="Bankovní účet (fond oprav)" />
            <input name="fundBalance" type="number" min="0" step="1" defaultValue={svj.fundBalance} className="input" placeholder="Zůstatek fondu oprav (Kč)" />
            <input name="fundNote" defaultValue={svj.fundNote} className="input" placeholder="Poznámka k fondu (k datu…)" />
            <div className="flex gap-2 sm:col-span-2">
              <button type="submit" className="btn-primary btn-sm">Uložit</button>
              <button type="button" onClick={() => setEdit(false)} className="btn-ghost btn-sm">Zrušit</button>
            </div>
          </form>
        ) : (
          <dl className="mt-3 grid gap-2.5 text-sm sm:grid-cols-2">
            <Row label="IČO" value={svj.ico} />
            <Row label="Vznik" value={svj.founded ? formatDate(svj.founded) : undefined} />
            <Row label="Sídlo" value={svj.sidlo} wide />
            <Row label="Správce" value={svj.manager} />
            <Row label="Bankovní účet" value={svj.bankAccount} />
            <Row label="Počet jednotek" value={String(units.length)} />
          </dl>
        )}
      </section>

      {/* Fond oprav */}
      <section className="card p-5">
        <div className="flex items-center gap-2">
          <IconMoney className="h-4 w-4 text-teal-700" />
          <h2 className="text-sm font-semibold text-stone-900">Fond oprav</h2>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3">
          <Stat label="Zůstatek" value={svj.fundBalance != null ? `${svj.fundBalance.toLocaleString("cs-CZ")} Kč` : "—"} />
          <Stat label="Příspěvky / měsíc" value={monthly > 0 ? `${monthly.toLocaleString("cs-CZ")} Kč` : "—"} />
          <Stat label="Příspěvky / rok" value={monthly > 0 ? `${(monthly * 12).toLocaleString("cs-CZ")} Kč` : "—"} />
        </div>
        {svj.fundNote && <p className="mt-2 text-xs text-stone-400">{svj.fundNote}</p>}
        <p className="mt-2 text-xs text-stone-400">
          Měsíční příspěvky se sčítají z evidence jednotek (Vlastníci a jednotky).
        </p>
      </section>
    </div>
  );
}

function Row({ label, value, wide }: { label: string; value?: string; wide?: boolean }) {
  return (
    <div className={`flex justify-between gap-3 ${wide ? "sm:col-span-2" : ""}`}>
      <dt className="shrink-0 text-stone-400">{label}</dt>
      <dd className="text-right font-medium text-stone-700">{value || "—"}</dd>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-stone-200 p-3 text-center">
      <p className="text-base font-semibold text-stone-900">{value}</p>
      <p className="mt-0.5 text-[11px] text-stone-500">{label}</p>
    </div>
  );
}
