"use client";

import type { Property } from "@/lib/store";
import { IconMoney } from "@/components/Icons";

export function FeesSection({ property }: { property: Property }) {
  const units = [...(property.units ?? [])].sort((a, b) => a.label.localeCompare(b.label));
  const monthly = units.reduce((s, u) => s + (u.monthlyFee ?? 0), 0);
  const fund = property.svj?.fundBalance;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Příspěvky / měsíc" value={monthly > 0 ? `${monthly.toLocaleString("cs-CZ")} Kč` : "—"} />
        <Stat label="Příspěvky / rok" value={monthly > 0 ? `${(monthly * 12).toLocaleString("cs-CZ")} Kč` : "—"} />
        <Stat label="Fond oprav" value={fund != null ? `${fund.toLocaleString("cs-CZ")} Kč` : "—"} />
      </div>

      <section className="card p-5">
        <div className="flex items-center gap-2">
          <IconMoney className="h-4 w-4 text-teal-700" />
          <h2 className="text-sm font-semibold text-stone-900">Předpis příspěvků po jednotkách</h2>
        </div>
        {units.length === 0 ? (
          <p className="mt-2 text-sm text-stone-500">
            Zatím žádné jednotky. Přidejte je v sekci „Jednotky a místnosti".
          </p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 text-left text-xs text-stone-400">
                  <th className="py-2 pr-3 font-medium">Jednotka</th>
                  <th className="py-2 pr-3 font-medium">Vlastník</th>
                  <th className="py-2 pr-3 text-right font-medium">Měsíčně</th>
                  <th className="py-2 text-right font-medium">Ročně</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {units.map((u) => (
                  <tr key={u.id}>
                    <td className="py-2 pr-3 font-medium text-stone-800">{u.label}</td>
                    <td className="py-2 pr-3 text-stone-700">{u.ownerName}</td>
                    <td className="py-2 pr-3 text-right text-stone-700">
                      {u.monthlyFee ? `${u.monthlyFee.toLocaleString("cs-CZ")} Kč` : "—"}
                    </td>
                    <td className="py-2 text-right text-stone-700">
                      {u.monthlyFee ? `${(u.monthlyFee * 12).toLocaleString("cs-CZ")} Kč` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-stone-200 font-semibold text-stone-900">
                  <td className="py-2 pr-3" colSpan={2}>
                    Celkem
                  </td>
                  <td className="py-2 pr-3 text-right">{monthly.toLocaleString("cs-CZ")} Kč</td>
                  <td className="py-2 text-right">{(monthly * 12).toLocaleString("cs-CZ")} Kč</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
        <p className="mt-3 text-xs text-stone-400">
          Výše příspěvků se přebírá z evidence jednotek. Sledování úhrad a dluhů řeší účetní/provozní
          systém SVJ.
        </p>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-4 text-center">
      <p className="text-lg font-semibold text-stone-900">{value}</p>
      <p className="mt-0.5 text-[11px] text-stone-500">{label}</p>
    </div>
  );
}
