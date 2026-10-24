"use client";

import Link from "next/link";
import { useId, useState } from "react";
import type { Property, Reminder, ReminderInput, ReminderType } from "@/lib/store";
import { REMINDER_TYPES } from "@/lib/enums";
import { ELEMENT_CATEGORIES, ELEMENT_CATEGORY_ORDER } from "@/lib/elements";
import {
  DEFAULT_NOTIFY_DAYS,
  ISO_DATE_RE,
  NOTIFY_DAYS_OPTIONS,
  addMonths,
  formatDay,
  intervalLabel,
  pluralCs,
} from "@/lib/deadlines";

const MAX_INTERVAL_MONTHS = 600;

// Formulář termínu (nový i úprava). Lhůtu nikdy nenavrhujeme — zadá ji člověk z protokolu.
export function DeadlineForm({
  property,
  initial,
  submitLabel = "Uložit termín",
  onSave,
  onCancel,
}: {
  property: Property;
  initial?: Reminder;
  submitLabel?: string;
  onSave: (data: ReminderInput) => void;
  onCancel: () => void;
}) {
  const uid = useId();
  const elements = property.elements ?? [];
  const initialElement =
    initial?.elementId && elements.some((e) => e.id === initial.elementId) ? initial.elementId : "";

  const [title, setTitle] = useState(initial?.title ?? "");
  const [type, setType] = useState<ReminderType>(initial?.type ?? "INSPECTION");
  const [elementId, setElementId] = useState(initialElement);
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? "");
  const [lastDone, setLastDone] = useState(initial?.lastDone ?? "");
  const [intervalText, setIntervalText] = useState(
    initial?.intervalMonths ? String(initial.intervalMonths) : "",
  );
  const [confirmed, setConfirmed] = useState(!!initial?.intervalConfirmed);
  const [confirmedBy, setConfirmedBy] = useState(initial?.confirmedBy ?? "");
  const [notifyDays, setNotifyDays] = useState(
    String(initial?.notifyDaysBefore ?? DEFAULT_NOTIFY_DAYS),
  );
  const [note, setNote] = useState(initial?.note ?? "");
  const [error, setError] = useState<string | null>(null);

  const notifyOptions: number[] = [...NOTIFY_DAYS_OPTIONS];
  if (initial?.notifyDaysBefore != null && !notifyOptions.includes(initial.notifyDaysBefore)) {
    notifyOptions.push(initial.notifyDaysBefore);
    notifyOptions.sort((a, b) => a - b);
  }

  // Textové pole: type=number by „1,5" tiše vyprázdnil a termín by se uložil jako jednorázový
  const intervalRaw = intervalText.trim();
  const intervalNum = /^\d+$/.test(intervalRaw) ? Number(intervalRaw) : NaN;
  const intervalValid =
    Number.isInteger(intervalNum) && intervalNum >= 1 && intervalNum <= MAX_INTERVAL_MONTHS;
  // Dopočet z posledního provedení + lhůty, kterou zadal člověk (nic nevymýšlíme)
  const computedDue =
    intervalValid && ISO_DATE_RE.test(lastDone) ? addMonths(lastDone, intervalNum) : null;

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const t = title.trim();
    if (!t) return setError("Vyplňte, o jaký termín jde.");
    if (!ISO_DATE_RE.test(dueDate)) return setError("Zadejte datum dalšího termínu.");
    if (lastDone && !ISO_DATE_RE.test(lastDone)) return setError("Datum posledního provedení není platné.");
    if (lastDone && lastDone > dueDate) {
      return setError("Poslední provedení je až po dalším termínu — zkontrolujte data.");
    }
    if (intervalRaw && !intervalValid) {
      return setError(`Lhůta musí být celý počet měsíců (1–${MAX_INTERVAL_MONTHS}).`);
    }
    const notify = Number(notifyDays);
    onSave({
      title: t,
      type,
      dueDate,
      note: note.trim() || undefined,
      elementId: elementId || undefined,
      lastDone: lastDone || undefined,
      intervalMonths: intervalValid ? intervalNum : undefined,
      intervalConfirmed: confirmed || undefined,
      confirmedBy: confirmed ? confirmedBy.trim() || undefined : undefined,
      notifyDaysBefore: Number.isFinite(notify) && notify >= 0 ? notify : DEFAULT_NOTIFY_DAYS,
      documentId: initial?.documentId,
    });
  }

  const byName = (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name, "cs");
  const byCategory = ELEMENT_CATEGORY_ORDER.map((cat) => ({
    key: cat as string,
    label: ELEMENT_CATEGORIES[cat],
    items: elements.filter((el) => el.category === cat).sort(byName),
  }));
  // Prvky s neznámou kategorií (starší data) nesmí ze seznamu zmizet
  byCategory.push({
    key: "other",
    label: "Ostatní",
    items: elements.filter((el) => !ELEMENT_CATEGORY_ORDER.includes(el.category)).sort(byName),
  });
  const groups = byCategory.filter((g) => g.items.length > 0);

  return (
    <form onSubmit={submit} className="space-y-3" noValidate>
      <div>
        <label className="label" htmlFor={`${uid}-title`}>
          Co se má udělat *
        </label>
        <input
          id={`${uid}-title`}
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Např. Revize elektroinstalace"
          required
        />
      </div>

      <div className="grid gap-3 @md:grid-cols-2">
        <div>
          <label className="label" htmlFor={`${uid}-type`}>
            Typ
          </label>
          <select
            id={`${uid}-type`}
            className="input"
            value={type}
            onChange={(e) => setType(e.target.value as ReminderType)}
          >
            {Object.entries(REMINDER_TYPES).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor={`${uid}-element`}>
            Prvek domu
          </label>
          <select
            id={`${uid}-element`}
            className="input"
            value={elementId}
            onChange={(e) => setElementId(e.target.value)}
            disabled={elements.length === 0}
          >
            <option value="">— bez prvku —</option>
            {groups.map((g) => (
              <optgroup key={g.key} label={g.label}>
                {g.items.map((el) => (
                  <option key={el.id} value={el.id}>
                    {el.name}
                    {el.room ? ` (${el.room})` : ""}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          {elements.length === 0 && (
            <p className="mt-1 text-xs text-stone-400">
              Zatím žádné prvky.{" "}
              <Link
                href={`/nemovitost/${property.id}/prvky?nova=1`}
                className="text-teal-700 hover:underline"
              >
                Přidat prvek
              </Link>
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-3 @md:grid-cols-2">
        <div>
          <label className="label" htmlFor={`${uid}-due`}>
            Další termín *
          </label>
          <input
            id={`${uid}-due`}
            type="date"
            className="input"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label" htmlFor={`${uid}-last`}>
            Naposledy provedeno
          </label>
          <input
            id={`${uid}-last`}
            type="date"
            className="input"
            value={lastDone}
            onChange={(e) => setLastDone(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="label" htmlFor={`${uid}-interval`}>
          Lhůta opakování (měsíce)
        </label>
        <input
          id={`${uid}-interval`}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          className="input"
          value={intervalText}
          onChange={(e) => setIntervalText(e.target.value)}
          placeholder="Jednorázový termín — nechte prázdné"
        />
        <p className="mt-1 text-xs text-stone-500">
          Lhůtu neodhadujeme — opište ji z posledního protokolu nebo ji potvrďte s revizním
          technikem.
          {intervalValid && <> Opakuje se {intervalLabel(intervalNum)}.</>}
        </p>
        {computedDue && computedDue !== dueDate && (
          <button
            type="button"
            onClick={() => setDueDate(computedDue)}
            className="mt-1.5 inline-flex min-h-10 items-center text-left text-xs font-medium text-teal-700 hover:underline"
          >
            Další termín podle posledního provedení: {formatDay(computedDue)} — použít
          </button>
        )}
      </div>

      <div className="rounded-lg bg-stone-50 p-3">
        <label className="flex min-h-10 cursor-pointer items-center gap-2.5 text-sm text-stone-700">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="h-4 w-4 shrink-0 accent-teal-700"
          />
          Lhůtu potvrdil revizní technik
        </label>
        {confirmed && (
          <input
            className="input mt-1"
            value={confirmedBy}
            onChange={(e) => setConfirmedBy(e.target.value)}
            placeholder="Jméno, příp. číslo oprávnění"
            aria-label="Kdo lhůtu potvrdil"
          />
        )}
      </div>

      <div className="grid gap-3 @md:grid-cols-2">
        <div>
          <label className="label" htmlFor={`${uid}-notify`}>
            Upozornit předem
          </label>
          <select
            id={`${uid}-notify`}
            className="input"
            value={notifyDays}
            onChange={(e) => setNotifyDays(e.target.value)}
          >
            {notifyOptions.map((d) => (
              <option key={d} value={d}>
                {d} {pluralCs(d, "den", "dny", "dní")} předem
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor={`${uid}-note`}>
            Poznámka
          </label>
          <input
            id={`${uid}-note`}
            className="input"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Např. kontakt na technika"
          />
        </div>
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <button type="submit" className="btn-primary min-h-10 flex-1">
          {submitLabel}
        </button>
        <button type="button" onClick={onCancel} className="btn-ghost min-h-10">
          Zrušit
        </button>
      </div>
    </form>
  );
}
