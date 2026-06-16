"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { canSeeProperty } from "@/lib/access";
import { Loading } from "@/components/Loading";
import { BackLink } from "@/components/BackLink";
import { PrintButton } from "@/components/ui/PrintButton";
import { IconMoney, IconBuilding } from "@/components/Icons";
import { ENTRY_TYPES } from "@/lib/enums";
import { formatCurrency } from "@/lib/format";

const RATES = [
  { key: "eko", label: "Ekonomický", perM2: 45000 },
  { key: "std", label: "Standard", perM2: 60000 },
  { key: "nad", label: "Nadstandard", perM2: 80000 },
];

// Orientační rozpad nákladů na hrubou stavbu rodinného domu
const BREAKDOWN = [
  { label: "Projektová příprava a povolení", pct: 0.06 },
  { label: "Hrubá stavba", pct: 0.42 },
  { label: "Technická zařízení (TZB)", pct: 0.2 },
  { label: "Dokončovací práce", pct: 0.24 },
  { label: "Rezerva", pct: 0.08 },
];

export default function BudgetPage() {
  const { id } = useParams<{ id: string }>();
  const { getProperty, hydrated, role } = useStore();
  const [rateKey, setRateKey] = useState("std");

  if (!hydrated) return <Loading />;

  const property = getProperty(id);
  if (!property || (role && !canSeeProperty(property, role))) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-stone-500">Nemovitost nenalezena.</p>
        <Link href="/prehled" className="btn-secondary mt-4">
          Zpět na přehled
        </Link>
      </div>
    );
  }

  const rate = RATES.find((r) => r.key === rateKey) ?? RATES[1];
  const area = property.floorArea ?? null;
  const estimate = area ? area * rate.perM2 : null;

  // Skutečné náklady ze záznamů
  const costByType = new Map<string, number>();
  for (const e of property.entries) {
    if (e.cost) costByType.set(e.type, (costByType.get(e.type) ?? 0) + e.cost);
  }
  const costRows = [...costByType.entries()].sort((a, b) => b[1] - a[1]);
  const spent = property.entries.reduce((s, e) => s + (e.cost ?? 0), 0);
  const usedPct = estimate ? Math.min(100, Math.round((spent / estimate) * 100)) : null;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="no-print flex items-center justify-between">
        <BackLink href={`/nemovitost/${id}`}>Zpět na nemovitost</BackLink>
        <PrintButton />
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-teal-50 text-teal-700">
          <IconMoney className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-stone-900">
            Rozpočet stavebních nákladů
          </h1>
          <p className="text-sm text-stone-500">{property.name}</p>
        </div>
      </div>

      {/* Odhad */}
      <section className="card mt-6 p-5">
        <h2 className="text-sm font-semibold text-stone-900">Orientační odhad</h2>
        {area ? (
          <>
            <div className="mt-3 flex flex-wrap gap-1.5 no-print">
              {RATES.map((r) => (
                <button
                  key={r.key}
                  onClick={() => setRateKey(r.key)}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                    r.key === rateKey
                      ? "bg-teal-700 text-white"
                      : "border border-stone-200 text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <div className="mt-4 rounded-xl bg-stone-50 p-5">
              <p className="text-xs text-stone-500">
                {area} m² × {formatCurrency(rate.perM2)}/m² · standard „{rate.label}"
              </p>
              <p className="mt-1 text-3xl font-semibold text-stone-900">
                {formatCurrency(estimate!)}
              </p>
            </div>

            <ul className="mt-4 divide-y divide-stone-100">
              {BREAKDOWN.map((b) => (
                <li key={b.label} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="text-stone-600">
                    {b.label} <span className="text-stone-400">· {Math.round(b.pct * 100)} %</span>
                  </span>
                  <span className="font-medium text-stone-800">
                    {formatCurrency(Math.round(estimate! * b.pct))}
                  </span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="mt-3 flex items-start gap-3 rounded-lg bg-amber-50 p-4 text-sm text-amber-900">
            <IconBuilding className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <p>
              Pro odhad doplňte <strong>plochu (m²)</strong> v úpravě nemovitosti. Skutečné náklady
              ze záznamů vidíte níže.
            </p>
          </div>
        )}
      </section>

      {/* Skutečné náklady */}
      <section className="card mt-4 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-stone-900">Skutečné náklady (ze záznamů)</h2>
          <span className="text-sm font-semibold text-stone-700">{formatCurrency(spent)}</span>
        </div>

        {estimate && spent > 0 && (
          <div className="mt-3">
            <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100">
              <div className="h-full rounded-full bg-teal-600" style={{ width: `${usedPct}%` }} />
            </div>
            <p className="mt-1.5 text-xs text-stone-500">
              Vyčerpáno {formatCurrency(spent)} z odhadu {formatCurrency(estimate)} ({usedPct} %).
            </p>
          </div>
        )}

        {costRows.length > 0 ? (
          <ul className="mt-3 divide-y divide-stone-100">
            {costRows.map(([type, total]) => (
              <li key={type} className="flex items-center justify-between py-2.5 text-sm">
                <span className="text-stone-600">{ENTRY_TYPES[type] ?? type}</span>
                <span className="font-medium text-stone-800">{formatCurrency(total)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-stone-500">
            Zatím žádné náklady. Přidávejte je k jednotlivým záznamům (opravy, rekonstrukce…).
          </p>
        )}
      </section>

      <p className="mt-6 text-center text-xs text-stone-400">
        Orientační propočet pro představu o nákladech — nenahrazuje položkový rozpočet rozpočtáře.
      </p>
    </div>
  );
}
