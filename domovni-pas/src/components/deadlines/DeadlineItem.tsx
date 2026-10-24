"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore, type Property, type Reminder, type ReminderCompletion } from "@/lib/store";
import { Badge } from "@/components/ui/Badge";
import { REMINDER_TYPES } from "@/lib/enums";
import { INSPECTION_RESULTS, type InspectionResult } from "@/lib/submission";
import { findElement } from "@/lib/elements";
import {
  DEADLINE_STATE_COLORS,
  DEADLINE_STATE_LABELS,
  DEFAULT_NOTIFY_DAYS,
  deadlineState,
  formatDay,
  intervalLabel,
  pluralCs,
  relativeDueLabel,
  type DeadlineState,
} from "@/lib/deadlines";
import { DeadlineForm } from "./DeadlineForm";
import { CompleteForm } from "./CompleteForm";
import {
  IconCheck,
  IconChevronDown,
  IconDownload,
  IconFile,
  IconSparkles,
  IconTrash,
} from "@/components/Icons";

const RESULT_COLORS = { OK: "emerald", DEFECTS: "amber", FAIL: "red" } as const;

const DUE_TEXT: Record<DeadlineState, string> = {
  OVERDUE: "font-medium text-red-600",
  SOON: "font-medium text-amber-700",
  OK: "text-stone-500",
  DONE: "text-stone-400",
};

function propertyLink(p: Property) {
  return `/nemovitost/${p.id}#terminy`;
}

function elementHref(p: Property, elementId: string) {
  return `/nemovitost/${p.id}/prvek/${elementId}`;
}

// Odkaz na doklad (protokol) — se stažením, když je soubor uložený
function DocLink({ property, documentId }: { property: Property; documentId?: string }) {
  const doc = documentId ? property.documents.find((d) => d.id === documentId) : undefined;
  if (!doc) return null;
  if (!doc.dataUrl) {
    return (
      <span className="inline-flex min-w-0 items-center gap-1 text-stone-600">
        <IconFile className="h-3.5 w-3.5 shrink-0 text-stone-400" />
        <span className="break-words">{doc.title}</span>
      </span>
    );
  }
  return (
    <a
      href={doc.dataUrl}
      download={doc.fileName ?? doc.title}
      className="inline-flex min-w-0 items-center gap-1 text-teal-700 hover:underline"
      title="Stáhnout doklad"
    >
      <IconDownload className="h-3.5 w-3.5 shrink-0" />
      <span className="break-words">{doc.title}</span>
    </a>
  );
}

// Řádek „lhůta: každých 12 měsíců · ✓ potvrdil …" / „lhůta nepotvrzená"
function IntervalInfo({ reminder }: { reminder: Reminder }) {
  const confirmedText = reminder.confirmedBy
    ? `✓ potvrdil revizní technik — ${reminder.confirmedBy}`
    : "✓ potvrdil revizní technik";
  if (reminder.intervalMonths && reminder.intervalMonths > 0) {
    return (
      <>
        <span className="text-stone-700">{intervalLabel(reminder.intervalMonths)}</span>
        <span
          className={`block ${reminder.intervalConfirmed ? "text-emerald-700" : "italic text-stone-400"}`}
        >
          {reminder.intervalConfirmed
            ? confirmedText
            : "lhůta nepotvrzená — ověřte s revizním technikem"}
        </span>
      </>
    );
  }
  return (
    <>
      <span className="text-stone-700">jednorázový termín</span>
      {reminder.intervalConfirmed ? (
        <span className="block text-emerald-700">{confirmedText}</span>
      ) : (
        reminder.type === "INSPECTION" && (
          <span className="block italic text-stone-400">
            lhůtu opakování opište z protokolu revize
          </span>
        )
      )}
    </>
  );
}

// Historie provedení termínu (nejnovější nahoře)
export function HistoryList({
  property,
  history,
}: {
  property: Property;
  history: ReminderCompletion[];
}) {
  if (history.length === 0) return null;
  return (
    <ul className="space-y-2">
      {history.map((h, i) => {
        const entry = h.entryId ? property.entries.find((e) => e.id === h.entryId) : undefined;
        const text = h.note ?? entry?.description;
        return (
          <li key={`${h.date}-${i}`} className="text-xs">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="font-medium text-stone-700">{formatDay(h.date)}</span>
              {h.result && (
                <Badge color={RESULT_COLORS[h.result as InspectionResult] ?? "gray"}>
                  {INSPECTION_RESULTS[h.result as InspectionResult] ?? h.result}
                </Badge>
              )}
              {entry && <span className="text-stone-400">· zapsáno v historii domu</span>}
            </div>
            {text && <p className="mt-0.5 whitespace-pre-line break-words text-stone-500">{text}</p>}
            {h.documentId && (
              <p className="mt-0.5">
                <DocLink property={property} documentId={h.documentId} />
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}

// Jeden otevřený termín: stav, prvek, další/poslední termín, lhůta, doklad a akce
export function DeadlineItem({
  property,
  reminder,
  editable,
  showProperty = false,
  onNotice,
}: {
  property: Property;
  reminder: Reminder;
  editable: boolean;
  showProperty?: boolean;
  onNotice?: (message: string) => void;
}) {
  const { updateReminder, deleteReminder } = useStore();
  const [mode, setMode] = useState<"view" | "complete" | "edit">("view");

  const { state, daysLeft } = deadlineState(reminder);
  const relative = relativeDueLabel(daysLeft); // prázdné u neplatného data (stará data)
  const element = findElement(property, reminder.elementId);
  const history = reminder.history ?? [];
  const notify = reminder.notifyDaysBefore ?? DEFAULT_NOTIFY_DAYS;
  const aiHref =
    `/nemovitost/${property.id}/zaznam/z-dokladu?termin=${encodeURIComponent(reminder.id)}` +
    (element ? `&prvek=${encodeURIComponent(element.id)}` : "");

  return (
    <li className="py-4">
      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1.5">
        <p className="min-w-0 break-words text-sm font-semibold text-stone-900">{reminder.title}</p>
        <Badge color={DEADLINE_STATE_COLORS[state]}>{DEADLINE_STATE_LABELS[state]}</Badge>
      </div>

      <p className="mt-0.5 break-words text-xs text-stone-500">
        {REMINDER_TYPES[reminder.type] ?? REMINDER_TYPES.OTHER}
        {element && (
          <>
            {" · "}
            <Link
              href={elementHref(property, element.id)}
              className="font-medium text-teal-700 hover:underline"
            >
              {element.name}
            </Link>
          </>
        )}
        {showProperty && (
          <>
            {" · "}
            <Link href={propertyLink(property)} className="hover:text-teal-700 hover:underline">
              {property.name}
            </Link>
          </>
        )}
      </p>

      <dl className="mt-2.5 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1.5 text-xs">
        <dt className="text-stone-400">Další termín</dt>
        <dd>
          <span className="font-medium text-stone-800">{formatDay(reminder.dueDate)}</span>
          {relative && <span className={DUE_TEXT[state]}> · {relative}</span>}
        </dd>

        <dt className="text-stone-400">Naposledy</dt>
        <dd className="text-stone-700">{reminder.lastDone ? formatDay(reminder.lastDone) : "—"}</dd>

        <dt className="text-stone-400">Lhůta</dt>
        <dd>
          <IntervalInfo reminder={reminder} />
        </dd>

        {reminder.documentId && property.documents.some((d) => d.id === reminder.documentId) && (
          <>
            <dt className="text-stone-400">Doklad</dt>
            <dd className="min-w-0">
              <DocLink property={property} documentId={reminder.documentId} />
            </dd>
          </>
        )}

        <dt className="text-stone-400">Upozornit</dt>
        <dd className="text-stone-600">
          {notify} {pluralCs(notify, "den", "dny", "dní")} předem
        </dd>
      </dl>

      {reminder.note && (
        <p className="mt-2 whitespace-pre-line break-words text-xs text-stone-500">{reminder.note}</p>
      )}

      {editable && mode === "view" && (
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMode("complete")}
            className="btn-primary btn-sm min-h-10"
          >
            <IconCheck className="h-4 w-4" />
            Provedeno
          </button>
          <Link href={aiHref} className="btn-secondary btn-sm min-h-10">
            <IconSparkles className="h-4 w-4" />
            {reminder.type === "INSPECTION" ? "Nahrát protokol (AI)" : "Nahrát doklad (AI)"}
          </Link>
          <button
            type="button"
            onClick={() => setMode("edit")}
            className="btn-ghost btn-sm min-h-10"
          >
            Upravit
          </button>
          <button
            type="button"
            onClick={() => {
              if (
                confirm(
                  `Smazat termín „${reminder.title}“? Záznamy v historii domu zůstanou.`,
                )
              ) {
                deleteReminder(property.id, reminder.id);
              }
            }}
            className="btn-ghost btn-sm min-h-10 text-stone-400 hover:text-red-600"
            aria-label="Smazat termín"
          >
            <IconTrash className="h-4 w-4" />
          </button>
        </div>
      )}

      {editable && mode === "complete" && (
        <CompleteForm
          property={property}
          reminder={reminder}
          onCancel={() => setMode("view")}
          onDone={(msg) => {
            setMode("view");
            onNotice?.(msg);
          }}
        />
      )}

      {editable && mode === "edit" && (
        <div className="mt-3 rounded-xl border border-stone-200 p-3">
          <DeadlineForm
            property={property}
            initial={reminder}
            submitLabel="Uložit změny"
            onCancel={() => setMode("view")}
            onSave={(data) => {
              updateReminder(property.id, reminder.id, data);
              setMode("view");
            }}
          />
        </div>
      )}

      {history.length > 0 && (
        <details className="group mt-3">
          <summary className="flex min-h-10 cursor-pointer list-none items-center gap-1 text-xs font-medium text-stone-500 hover:text-stone-800 [&::-webkit-details-marker]:hidden">
            <IconChevronDown className="h-3.5 w-3.5 transition group-open:rotate-180" />
            Historie provedení ({history.length})
          </summary>
          <div className="mt-1 border-l-2 border-stone-100 pl-3">
            <HistoryList property={property} history={history} />
          </div>
        </details>
      )}
    </li>
  );
}

// Sbalený seznam splněných (jednorázových) termínů s historií
export function DoneDeadlines({
  rows,
  editableFor,
  showProperty = false,
  className = "",
}: {
  rows: { reminder: Reminder; property: Property }[];
  editableFor: (p: Property) => boolean;
  showProperty?: boolean;
  className?: string;
}) {
  const { toggleReminder, deleteReminder } = useStore();
  if (rows.length === 0) return null;

  const sorted = [...rows].sort((a, b) =>
    (b.reminder.lastDone ?? b.reminder.dueDate ?? "").localeCompare(
      a.reminder.lastDone ?? a.reminder.dueDate ?? "",
    ),
  );

  return (
    <details className={`group ${className}`}>
      <summary className="flex min-h-10 cursor-pointer list-none items-center gap-1.5 text-sm font-medium text-stone-600 hover:text-stone-900 [&::-webkit-details-marker]:hidden">
        <IconChevronDown className="h-4 w-4 transition group-open:rotate-180" />
        Splněné ({rows.length})
      </summary>
      <ul className="mt-1 divide-y divide-stone-100">
        {sorted.map(({ reminder: r, property: p }) => {
          const element = findElement(p, r.elementId);
          const editable = editableFor(p);
          const history = r.history ?? [];
          return (
            <li key={`${p.id}-${r.id}`} className="py-3">
              <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                <p className="min-w-0 break-words text-sm font-medium text-stone-500">{r.title}</p>
                <Badge color={DEADLINE_STATE_COLORS.DONE}>{DEADLINE_STATE_LABELS.DONE}</Badge>
              </div>
              <p className="mt-0.5 break-words text-xs text-stone-400">
                {REMINDER_TYPES[r.type] ?? REMINDER_TYPES.OTHER}
                {element && (
                  <>
                    {" · "}
                    <Link href={elementHref(p, element.id)} className="text-teal-700 hover:underline">
                      {element.name}
                    </Link>
                  </>
                )}
                {showProperty && (
                  <>
                    {" · "}
                    <Link href={propertyLink(p)} className="hover:text-teal-700 hover:underline">
                      {p.name}
                    </Link>
                  </>
                )}
                {" · "}
                {r.lastDone ? `splněno ${formatDay(r.lastDone)}` : `termín byl ${formatDay(r.dueDate)}`}
              </p>
              {r.documentId && history.every((h) => h.documentId !== r.documentId) && (
                <p className="mt-1 text-xs">
                  <DocLink property={p} documentId={r.documentId} />
                </p>
              )}
              {history.length > 0 && (
                <div className="mt-2 border-l-2 border-stone-100 pl-3">
                  <HistoryList property={p} history={history} />
                </div>
              )}
              {editable && (
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => toggleReminder(p.id, r.id)}
                    className="btn-ghost btn-sm min-h-10"
                  >
                    Znovu otevřít
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Smazat termín „${r.title}“? Záznamy v historii domu zůstanou.`)) {
                        deleteReminder(p.id, r.id);
                      }
                    }}
                    className="btn-ghost btn-sm min-h-10 text-stone-400 hover:text-red-600"
                    aria-label="Smazat termín"
                  >
                    <IconTrash className="h-4 w-4" />
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </details>
  );
}
