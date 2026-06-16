"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore, type Property, type Reminder } from "@/lib/store";
import { Loading } from "@/components/Loading";
import { Badge } from "@/components/ui/Badge";
import { REMINDER_TYPES } from "@/lib/enums";
import { dueStatus, formatDate } from "@/lib/format";
import { canSeeProperty } from "@/lib/access";
import { IconShield, IconCheck } from "@/components/Icons";

type EventKind = "WARRANTY" | "INSPECTION" | "MAINTENANCE" | "OTHER" | "INVENTORY_WARRANTY";

type CalEvent = {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  kind: EventKind;
  property: Property;
  reminder?: Reminder; // jen u připomínek (kvůli odškrtnutí)
};

type Filter = "all" | "warranty" | "inspection";

const KIND_LABEL: Record<EventKind, string> = {
  WARRANTY: "Záruka",
  INSPECTION: "Revize",
  MAINTENANCE: "Údržba",
  OTHER: "Jiné",
  INVENTORY_WARRANTY: "Záruka",
};

const KIND_COLOR = {
  WARRANTY: "amber",
  INSPECTION: "violet",
  MAINTENANCE: "blue",
  OTHER: "gray",
  INVENTORY_WARRANTY: "amber",
} as const;

function monthKey(date: string) {
  return date.slice(0, 7); // YYYY-MM
}

function monthLabel(date: string) {
  const d = new Date(`${date}T00:00:00`);
  const s = new Intl.DateTimeFormat("cs-CZ", { month: "long", year: "numeric" }).format(d);
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function CalendarPage() {
  const { properties, hydrated, role, toggleReminder } = useStore();
  const [filter, setFilter] = useState<Filter>("all");

  if (!hydrated) return <Loading />;

  const visible = role ? properties.filter((p) => canSeeProperty(p, role)) : [];

  // Připomínky (nesplněné) + záruky z vybavení → jeden časový proud
  const events: CalEvent[] = [];
  for (const p of visible) {
    for (const r of p.reminders) {
      if (r.done) continue;
      events.push({ id: r.id, date: r.dueDate, title: r.title, kind: r.type, property: p, reminder: r });
    }
    for (const item of p.inventory) {
      if (!item.warrantyUntil) continue;
      events.push({
        id: `inv-${item.id}`,
        date: item.warrantyUntil,
        title: `Konec záruky: ${item.name}`,
        kind: "INVENTORY_WARRANTY",
        property: p,
      });
    }
  }

  const filtered = events.filter((e) => {
    if (filter === "warranty") return e.kind === "WARRANTY" || e.kind === "INVENTORY_WARRANTY";
    if (filter === "inspection") return e.kind === "INSPECTION";
    return true;
  });
  filtered.sort((a, b) => a.date.localeCompare(b.date));

  const overdue = filtered.filter((e) => dueStatus(e.date).overdue);
  const upcoming = filtered.filter((e) => !dueStatus(e.date).overdue);

  // Skupiny po měsících (jen nadcházející)
  const months: { key: string; label: string; items: CalEvent[] }[] = [];
  for (const e of upcoming) {
    const key = monthKey(e.date);
    let g = months.find((m) => m.key === key);
    if (!g) {
      g = { key, label: monthLabel(e.date), items: [] };
      months.push(g);
    }
    g.items.push(e);
  }

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: "Vše" },
    { key: "warranty", label: "Záruky" },
    { key: "inspection", label: "Revize" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-stone-900">Záruky a revize</h1>
      <p className="mt-1 text-sm text-stone-500">
        Časový přehled záruk a revizí napříč vašimi nemovitostmi — ať vám nic neuteče.
      </p>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
              filter === f.key
                ? "bg-teal-700 text-white"
                : "border border-stone-200 text-stone-600 hover:bg-stone-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card mt-8 flex flex-col items-center px-6 py-16 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-teal-50 text-teal-700">
            <IconShield className="h-7 w-7" />
          </div>
          <p className="mt-4 text-sm font-medium text-stone-800">Nic naplánováno</p>
          <p className="mt-1 max-w-sm text-sm text-stone-500">
            Záruky se sem doplní z vybavení („Co je v mém domě") a revize z připomínek u nemovitostí.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-8">
          {overdue.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-red-600">
                Po termínu / prošlé <span className="text-red-400">· {overdue.length}</span>
              </h2>
              <EventList items={overdue} toggle={toggleReminder} />
            </section>
          )}
          {months.map((m) => (
            <section key={m.key}>
              <h2 className="text-sm font-semibold text-stone-500">
                {m.label} <span className="text-stone-400">· {m.items.length}</span>
              </h2>
              <EventList items={m.items} toggle={toggleReminder} />
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function EventList({
  items,
  toggle,
}: {
  items: CalEvent[];
  toggle: (propertyId: string, reminderId: string) => void;
}) {
  return (
    <ul className="card mt-2 divide-y divide-stone-100 px-5">
      {items.map((e) => {
        const st = dueStatus(e.date);
        const isInvWarranty = e.kind === "INVENTORY_WARRANTY";
        return (
          <li key={e.id} className="flex items-start gap-3 py-3">
            {e.reminder ? (
              <button
                onClick={() => toggle(e.property.id, e.reminder!.id)}
                className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border border-stone-300 text-transparent transition hover:border-teal-500"
                aria-label="Označit jako splněné"
              >
                <IconCheck className="h-3.5 w-3.5" />
              </button>
            ) : (
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md bg-amber-50 text-amber-600">
                <IconShield className="h-3.5 w-3.5" />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium text-stone-800">{e.title}</p>
                <Badge color={KIND_COLOR[e.kind]}>
                  {isInvWarranty ? KIND_LABEL[e.kind] : REMINDER_TYPES[e.kind] ?? KIND_LABEL[e.kind]}
                </Badge>
              </div>
              <p className="truncate text-xs text-stone-400">
                {formatDate(e.date)} ·{" "}
                <Link href={`/nemovitost/${e.property.id}`} className="hover:text-teal-700 hover:underline">
                  {e.property.name}
                </Link>
              </p>
            </div>
            <span
              className={`shrink-0 text-xs font-medium ${
                st.overdue ? "text-red-600" : st.soon ? "text-amber-600" : "text-stone-500"
              }`}
            >
              {isInvWarranty && st.overdue ? "Záruka skončila" : st.label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
