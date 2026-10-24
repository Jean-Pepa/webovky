"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore, type Property } from "@/lib/store";
import { Loading } from "@/components/Loading";
import { canEditProperty, canSeeProperty } from "@/lib/access";
import { collectDeadlines, type DeadlineRow } from "@/lib/deadlines";
import { DeadlineItem, DoneDeadlines } from "@/components/deadlines/DeadlineItem";
import { IcsExportButton } from "@/components/deadlines/IcsExportButton";
import { NotificationCard } from "@/components/deadlines/NotificationCard";
import { IconCalendar, IconClose } from "@/components/Icons";

export default function RemindersPage() {
  const { properties, hydrated, role } = useStore();
  const [notice, setNotice] = useState<string | null>(null);

  if (!hydrated) return <Loading />;

  const visible = role ? properties.filter((p) => canSeeProperty(p, role)) : [];
  const editableFor = (p: Property) => (role ? canEditProperty(p, role) : false);
  const rows = collectDeadlines(visible, { includeDone: true });
  const open = rows.filter((r) => r.state !== "DONE");
  const overdue = open.filter((r) => r.state === "OVERDUE");
  const soon = open.filter((r) => r.state === "SOON");
  const ok = open.filter((r) => r.state === "OK");
  const done = rows.filter((r) => r.state === "DONE");

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-stone-900">Termíny a revize</h1>
      <p className="mt-1 text-sm text-stone-500">
        Revize, servis a záruky napříč vašimi nemovitostmi. „Blíží se“ podle toho, kolik dní předem
        chcete u termínu upozornit.
      </p>

      {open.length > 0 && (
        <div className="mt-4">
          <IcsExportButton items={open} filename="bulo-terminy.ics" />
        </div>
      )}

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

      {rows.length === 0 ? (
        <div className="card mt-8 flex flex-col items-center px-6 py-16 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-teal-50 text-teal-700">
            <IconCalendar className="h-7 w-7" />
          </div>
          <p className="mt-4 text-sm font-medium text-stone-800">Žádné termíny</p>
          <p className="mt-1 max-w-sm text-sm text-stone-500">
            Termíny přidáte u konkrétní nemovitosti — třeba příští revizi kotle nebo konec záruky.
            Nejrychleji z nahraného protokolu.
          </p>
          <Link href="/prehled" className="btn-secondary mt-6">
            Na přehled nemovitostí
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-8">
          {open.length === 0 && (
            <p className="card p-5 text-sm text-stone-600">
              Všechny termíny jsou splněné. Nové přidáte u konkrétní nemovitosti.
            </p>
          )}
          <Group title="Po termínu" tone="text-red-600" rows={overdue} editableFor={editableFor} onNotice={setNotice} />
          <Group title="Blíží se" tone="text-amber-700" rows={soon} editableFor={editableFor} onNotice={setNotice} />
          <Group title="V pořádku" tone="text-stone-500" rows={ok} editableFor={editableFor} onNotice={setNotice} />
          {done.length > 0 && (
            <div className="card px-4 py-2 sm:px-5">
              <DoneDeadlines rows={done} editableFor={editableFor} showProperty />
            </div>
          )}
        </div>
      )}

      <div className="mt-8">
        <NotificationCard properties={visible} />
      </div>
    </div>
  );
}

function Group({
  title,
  tone,
  rows,
  editableFor,
  onNotice,
}: {
  title: string;
  tone: string;
  rows: DeadlineRow[];
  editableFor: (p: Property) => boolean;
  onNotice: (message: string) => void;
}) {
  if (rows.length === 0) return null;
  return (
    <section className="@container">
      <h2 className={`text-sm font-semibold ${tone}`}>
        {title} <span className="text-stone-400">· {rows.length}</span>
      </h2>
      <ul className="card mt-2 divide-y divide-stone-100 px-4 sm:px-5">
        {rows.map(({ reminder, property }) => (
          <DeadlineItem
            key={`${property.id}-${reminder.id}`}
            property={property}
            reminder={reminder}
            editable={editableFor(property)}
            showProperty
            onNotice={onNotice}
          />
        ))}
      </ul>
    </section>
  );
}
