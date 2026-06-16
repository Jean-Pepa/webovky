"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Loading } from "@/components/Loading";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, dueStatus } from "@/lib/format";
import { PROPERTY_TYPES } from "@/lib/enums";

export default function StatsPage() {
  const { properties, hydrated, role } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && role && role !== "CREATOR") router.replace("/prehled");
  }, [hydrated, role, router]);

  if (!hydrated) return <Loading />;
  if (role !== "CREATOR") return <Loading label="Přesměrování…" />;

  const total = properties.length;
  const houses = properties.filter((p) => p.type === "HOUSE").length;
  const flats = properties.filter((p) => p.type === "APARTMENT").length;
  const handed = properties.filter((p) => p.handedOver).length;
  const byArchitect = properties.filter((p) => p.createdByRole === "ARCHITECT").length;
  const byClient = properties.filter((p) => (p.createdByRole ?? "CLIENT") === "CLIENT").length;
  const entries = properties.reduce((s, p) => s + p.entries.length, 0);
  const docs = properties.reduce((s, p) => s + p.documents.length, 0);
  const items = properties.reduce((s, p) => s + p.inventory.length, 0);
  const openReminders = properties.flatMap((p) => p.reminders.filter((r) => !r.done));
  const overdue = openReminders.filter((r) => dueStatus(r.dueDate).overdue).length;
  const totalCost = properties.reduce(
    (s, p) => s + p.entries.reduce((a, e) => a + (e.cost ?? 0), 0),
    0,
  );

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-stone-900">Statistiky</h1>
      <p className="mt-1 text-sm text-stone-500">Souhrn celého systému BULO.</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <Stat label="Nemovitostí celkem" value={String(total)} />
        <Stat label="Domy / Byty" value={`${houses} / ${flats}`} />
        <Stat label="Předáno klientovi" value={String(handed)} />
        <Stat label="Od architektů" value={String(byArchitect)} />
        <Stat label="Od majitelů" value={String(byClient)} />
        <Stat label="Záznamů" value={String(entries)} />
        <Stat label="Dokumentů" value={String(docs)} />
        <Stat label="Položek vybavení" value={String(items)} />
        <Stat
          label="Otevřené připomínky"
          value={`${openReminders.length}${overdue ? ` · ${overdue} po termínu` : ""}`}
        />
        <Stat label="Náklady celkem" value={totalCost > 0 ? formatCurrency(totalCost) : "—"} />
      </div>

      <section className="card mt-8 p-5">
        <h2 className="text-sm font-semibold text-stone-900">Všechny nemovitosti</h2>
        {properties.length === 0 ? (
          <p className="mt-2 text-sm text-stone-500">Zatím žádné nemovitosti.</p>
        ) : (
          <ul className="mt-2 divide-y divide-stone-100">
            {properties.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/nemovitost/${p.id}`}
                  className="-mx-1 flex items-center justify-between gap-3 rounded px-1 py-2.5 hover:bg-stone-50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-stone-800">{p.name}</p>
                    <p className="truncate text-xs text-stone-400">
                      {p.ownerName} · {PROPERTY_TYPES[p.type]}
                    </p>
                  </div>
                  {p.createdByRole === "ARCHITECT" ? (
                    p.handedOver ? (
                      <Badge color="amber">Předáno</Badge>
                    ) : (
                      <Badge color="gray">Rozpracováno</Badge>
                    )
                  ) : (
                    <Badge color="teal">Majitel</Badge>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-4">
      <p className="text-xl font-semibold text-stone-900">{value}</p>
      <p className="mt-0.5 text-xs text-stone-500">{label}</p>
    </div>
  );
}
