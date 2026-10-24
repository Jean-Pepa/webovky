"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore, type Reminder } from "@/lib/store";
import { Badge } from "@/components/ui/Badge";
import { compareDeadlineRows, deadlineState } from "@/lib/deadlines";
import { icsSlug } from "@/lib/ics";
import { DeadlineItem, DoneDeadlines } from "@/components/deadlines/DeadlineItem";
import { DeadlineForm } from "@/components/deadlines/DeadlineForm";
import { IcsExportButton } from "@/components/deadlines/IcsExportButton";
import { IconCalendar, IconClose, IconPlus, IconSparkles } from "@/components/Icons";

// Termíny a revize u nemovitosti: stav, prvek, lhůta, doklad — a „Provedeno" jedním klepnutím.
export function ReminderSection({
  propertyId,
  reminders,
  editable = true,
}: {
  propertyId: string;
  reminders: Reminder[];
  editable?: boolean;
}) {
  const { getProperty, addReminder } = useStore();
  const [adding, setAdding] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const property = getProperty(propertyId);
  if (!property) return null;

  const open = reminders
    .filter((r) => !r.done)
    .map((r) => ({ reminder: r, ...deadlineState(r) }))
    .sort(compareDeadlineRows);
  const done = reminders.filter((r) => r.done).map((r) => ({ reminder: r, property }));
  const overdue = open.filter((o) => o.state === "OVERDUE").length;
  const soon = open.filter((o) => o.state === "SOON").length;

  return (
    <section id="terminy" className="card @container scroll-mt-24 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <IconCalendar className="h-4 w-4 shrink-0 text-teal-700" />
          <h2 className="text-sm font-semibold text-stone-900">Termíny a revize</h2>
        </div>
        {editable && !adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="btn-ghost btn-sm min-h-10 text-teal-700"
          >
            <IconPlus className="h-4 w-4" />
            Přidat termín
          </button>
        )}
      </div>

      {(overdue > 0 || soon > 0) && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {overdue > 0 && <Badge color="red">{overdue} po termínu</Badge>}
          {soon > 0 && <Badge color="amber">{soon} se blíží</Badge>}
        </div>
      )}

      {notice && (
        <div
          role="status"
          className="mt-3 flex items-start gap-2 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-800"
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

      {editable && adding && (
        <div className="mt-3 border-t border-stone-100 pt-3">
          <h3 className="mb-2 text-sm font-medium text-stone-800">Nový termín</h3>
          <DeadlineForm
            property={property}
            submitLabel="Přidat termín"
            onCancel={() => setAdding(false)}
            onSave={(data) => {
              addReminder(propertyId, data);
              setAdding(false);
              setNotice(`Termín „${data.title}“ přidán.`);
            }}
          />
        </div>
      )}

      {open.length > 0 ? (
        <ul className="mt-1 divide-y divide-stone-100">
          {open.map(({ reminder }) => (
            <DeadlineItem
              key={reminder.id}
              property={property}
              reminder={reminder}
              editable={editable}
              onNotice={setNotice}
            />
          ))}
        </ul>
      ) : (
        !adding && (
          <div className="mt-2 text-sm text-stone-500">
            {done.length > 0 ? (
              <p>Všechny termíny jsou splněné.</p>
            ) : editable ? (
              <p>
                Zatím žádné termíny. Přidejte příští revizi, servis nebo konec záruky — upozorníme
                vás předem.
              </p>
            ) : (
              <p>Zatím žádné termíny.</p>
            )}
            {editable && (
              <Link
                href={`/nemovitost/${propertyId}/zaznam/z-dokladu`}
                className="mt-2 inline-flex min-h-10 items-center gap-1.5 text-sm font-medium text-teal-700 hover:underline"
              >
                <IconSparkles className="h-4 w-4" />
                Termín z posledního protokolu (AI)
              </Link>
            )}
          </div>
        )
      )}

      <DoneDeadlines
        rows={done}
        editableFor={() => editable}
        className="mt-2 border-t border-stone-100 pt-2"
      />

      {open.length > 0 && (
        <div className="mt-3 border-t border-stone-100 pt-3">
          <IcsExportButton
            items={open.map(({ reminder }) => ({ reminder, property }))}
            filename={`bulo-terminy-${icsSlug(property.name)}.ics`}
            label="Do kalendáře (.ics)"
            className="btn-ghost btn-sm min-h-10 -ml-3 text-stone-600"
          />
        </div>
      )}
    </section>
  );
}
