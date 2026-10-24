"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore, type Property, type Reminder } from "@/lib/store";
import { Loading } from "@/components/Loading";
import { Badge } from "@/components/ui/Badge";
import { REMINDER_TYPES } from "@/lib/enums";
import { dueStatus } from "@/lib/format";
import { canEditProperty, canSeeProperty } from "@/lib/access";
import { findElement } from "@/lib/elements";
import {
  DEADLINE_STATE_COLORS,
  DEADLINE_STATE_LABELS,
  deadlineState,
  formatDay,
  relativeDueLabel,
  type DeadlineState,
} from "@/lib/deadlines";
import { CompleteForm } from "@/components/deadlines/CompleteForm";
import { IcsExportButton } from "@/components/deadlines/IcsExportButton";
import { IconShield, IconCheck, IconCalendar, IconClose } from "@/components/Icons";

type EventKind = "WARRANTY" | "INSPECTION" | "MAINTENANCE" | "OTHER" | "INVENTORY_WARRANTY";

type CalEvent = {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  kind: EventKind;
  property: Property;
  reminder?: Reminder; // jen u termínů (kvůli „Provedeno")
  state?: DeadlineState; // stav termínu (respektuje „upozornit předem")
  overdue: boolean;
  label: string;
  elementId?: string;
  elementName?: string;
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

const STATE_TEXT: Record<DeadlineState, string> = {
  OVERDUE: "text-red-600",
  SOON: "text-amber-700",
  OK: "text-stone-500",
  DONE: "text-stone-400",
};

function monthKey(date: string) {
  return date.slice(0, 7); // YYYY-MM
}

function monthLabel(date: string) {
  const d = new Date(`${date}T00:00:00`);
  if (Number.isNaN(d.getTime())) return date;
  const s = new Intl.DateTimeFormat("cs-CZ", { month: "long", year: "numeric" }).format(d);
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function CalendarPage() {
  const { properties, hydrated, role } = useStore();
  const [filter, setFilter] = useState<Filter>("all");
  const [notice, setNotice] = useState<string | null>(null);

  if (!hydrated) return <Loading />;

  const visible = role ? properties.filter((p) => canSeeProperty(p, role)) : [];
  const editableFor = (p: Property) => (role ? canEditProperty(p, role) : false);

  // Termíny (nesplněné) + záruky z vybavení → jeden časový proud
  const events: CalEvent[] = [];
  const openReminders: { reminder: Reminder; property: Property }[] = [];
  for (const p of visible) {
    for (const r of p.reminders) {
      if (r.done || !r.dueDate) continue;
      const { state, daysLeft } = deadlineState(r);
      const el = findElement(p, r.elementId);
      openReminders.push({ reminder: r, property: p });
      events.push({
        id: r.id,
        date: r.dueDate,
        title: r.title,
        kind: r.type,
        property: p,
        reminder: r,
        state,
        overdue: state === "OVERDUE",
        label: relativeDueLabel(daysLeft),
        elementId: el?.id,
        elementName: el?.name,
      });
    }
    for (const item of p.inventory) {
      if (!item.warrantyUntil) continue;
      const st = dueStatus(item.warrantyUntil);
      const el = findElement(p, item.elementId);
      events.push({
        id: `inv-${item.id}`,
        date: item.warrantyUntil,
        title: `Konec záruky: ${item.name}`,
        kind: "INVENTORY_WARRANTY",
        property: p,
        overdue: st.overdue,
        label: st.overdue ? "Záruka skončila" : st.label,
        elementId: el?.id,
        elementName: el?.name,
      });
    }
  }

  const filtered = events.filter((e) => {
    if (filter === "warranty") return e.kind === "WARRANTY" || e.kind === "INVENTORY_WARRANTY";
    if (filter === "inspection") return e.kind === "INSPECTION";
    return true;
  });
  filtered.sort((a, b) => a.date.localeCompare(b.date));

  const overdue = filtered.filter((e) => e.overdue);
  const upcoming = filtered.filter((e) => !e.overdue);

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

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`min-h-10 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                filter === f.key
                  ? "bg-teal-700 text-white"
                  : "border border-stone-200 text-stone-600 hover:bg-stone-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        {openReminders.length > 0 && (
          <IcsExportButton items={openReminders} filename="bulo-terminy.ics" />
        )}
      </div>

      {notice && (
        <div
          role="status"
          className="mt-4 flex items-start gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800"
        >
          <p className="min-w-0 flex-1 break-words">✓ {notice}</p>
          <button
            type="button"
            onClick={() => setNotice(null)}
            className="-m-2 grid h-10 w-10 shrink-0 place-items-center text-emerald-700 hover:text-emerald-900"
            aria-label="Zavřít"
          >
            <IconClose className="h-4 w-4" />
          </button>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="card mt-8 flex flex-col items-center px-6 py-16 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-teal-50 text-teal-700">
            <IconShield className="h-7 w-7" />
          </div>
          <p className="mt-4 text-sm font-medium text-stone-800">Nic naplánováno</p>
          <p className="mt-1 max-w-sm text-sm text-stone-500">
            Záruky se sem doplní z vybavení („Co je v mém domě“) a revize z termínů u nemovitostí.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-8">
          {overdue.length > 0 && (
            <section className="@container">
              <h2 className="text-sm font-semibold text-red-600">
                Po termínu / prošlé <span className="text-red-400">· {overdue.length}</span>
              </h2>
              <EventList items={overdue} editableFor={editableFor} onNotice={setNotice} />
            </section>
          )}
          {months.map((m) => (
            <section key={m.key} className="@container">
              <h2 className="text-sm font-semibold text-stone-500">
                {m.label} <span className="text-stone-400">· {m.items.length}</span>
              </h2>
              <EventList items={m.items} editableFor={editableFor} onNotice={setNotice} />
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function EventList({
  items,
  editableFor,
  onNotice,
}: {
  items: CalEvent[];
  editableFor: (p: Property) => boolean;
  onNotice: (message: string) => void;
}) {
  return (
    <ul className="card mt-2 divide-y divide-stone-100 px-4 sm:px-5">
      {items.map((e) => (
        <EventRow
          key={`${e.property.id}-${e.id}`}
          e={e}
          editable={!!e.reminder && editableFor(e.property)}
          onNotice={onNotice}
        />
      ))}
    </ul>
  );
}

function EventRow({
  e,
  editable,
  onNotice,
}: {
  e: CalEvent;
  editable: boolean;
  onNotice: (message: string) => void;
}) {
  const [completing, setCompleting] = useState(false);
  const isInvWarranty = e.kind === "INVENTORY_WARRANTY";
  const tone = e.state
    ? STATE_TEXT[e.state]
    : e.overdue
      ? "text-red-600"
      : dueStatus(e.date).soon
        ? "text-amber-700"
        : "text-stone-500";

  return (
    <li className="py-3">
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md ${
            isInvWarranty ? "bg-amber-50 text-amber-600" : "bg-teal-50 text-teal-700"
          }`}
        >
          {isInvWarranty ? <IconShield className="h-3.5 w-3.5" /> : <IconCalendar className="h-3.5 w-3.5" />}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="min-w-0 break-words text-sm font-medium text-stone-800">{e.title}</p>
            <Badge color={KIND_COLOR[e.kind]}>
              {isInvWarranty ? KIND_LABEL[e.kind] : (REMINDER_TYPES[e.kind] ?? KIND_LABEL[e.kind])}
            </Badge>
            {e.state && (
              <Badge color={DEADLINE_STATE_COLORS[e.state]}>{DEADLINE_STATE_LABELS[e.state]}</Badge>
            )}
          </div>
          <p className="break-words text-xs text-stone-400">
            {formatDay(e.date)}
            {e.elementId && e.elementName && (
              <>
                {" · "}
                <Link
                  href={`/nemovitost/${e.property.id}/prvek/${e.elementId}`}
                  className="text-teal-700 hover:underline"
                >
                  {e.elementName}
                </Link>
              </>
            )}
            {" · "}
            <Link
              href={`/nemovitost/${e.property.id}${e.reminder ? "#terminy" : ""}`}
              className="hover:text-teal-700 hover:underline"
            >
              {e.property.name}
            </Link>
          </p>
          <p className={`mt-0.5 text-xs font-medium ${tone}`}>{e.label}</p>
        </div>
        {editable && !completing && (
          <button
            type="button"
            onClick={() => setCompleting(true)}
            className="btn-ghost btn-sm min-h-10 shrink-0 text-teal-700"
            aria-label={`Označit „${e.title}“ jako provedené`}
          >
            <IconCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Provedeno</span>
          </button>
        )}
      </div>
      {editable && completing && e.reminder && (
        <CompleteForm
          property={e.property}
          reminder={e.reminder}
          onCancel={() => setCompleting(false)}
          onDone={(msg) => {
            setCompleting(false);
            onNotice(msg);
          }}
        />
      )}
    </li>
  );
}
