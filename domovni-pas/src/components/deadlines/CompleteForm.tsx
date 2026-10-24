"use client";

import { useId, useState } from "react";
import { useStore, type EntryType, type Property, type Reminder, type ReminderType } from "@/lib/store";
import { INSPECTION_RESULTS, type InspectionResult } from "@/lib/submission";
import { findElement } from "@/lib/elements";
import { ISO_DATE_RE, addMonths, formatDay, intervalLabel, localIsoDate } from "@/lib/deadlines";

// Typ termínu → typ záznamu v historii domu
const ENTRY_TYPE_FOR: Record<ReminderType, EntryType> = {
  INSPECTION: "INSPECTION",
  MAINTENANCE: "REPAIR",
  WARRANTY: "OTHER",
  OTHER: "OTHER",
};

// „Provedeno": zapíše provedení termínu (a volitelně záznam do historie domu).
// Opakovaný termín se posune o lhůtu, jednorázový se přesune mezi splněné.
export function CompleteForm({
  property,
  reminder,
  onDone,
  onCancel,
}: {
  property: Property;
  reminder: Reminder;
  onDone: (message: string) => void;
  onCancel: () => void;
}) {
  const { applyProposal, completeReminder } = useStore();
  const uid = useId();
  const today = localIsoDate();
  const [date, setDate] = useState(today);
  const [result, setResult] = useState<InspectionResult | "">("");
  const [note, setNote] = useState("");
  const [toHistory, setToHistory] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const element = findElement(property, reminder.elementId);
  const interval = reminder.intervalMonths && reminder.intervalMonths > 0 ? reminder.intervalMonths : 0;
  const showResult = reminder.type !== "WARRANTY";
  const validDate = ISO_DATE_RE.test(date);
  const nextDue = interval && validDate ? addMonths(date, interval) : null;

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validDate) return setError("Zadejte datum provedení.");
    if (date > today) return setError("Datum provedení nemůže být v budoucnosti.");
    if (interval && reminder.lastDone && date < reminder.lastDone) {
      return setError(
        `Poslední provedení je zapsané ${formatDay(reminder.lastDone)}. Starší událost přidejte jako záznam do historie.`,
      );
    }
    const res = showResult && result ? result : undefined;
    const text = note.trim() || undefined;

    if (toHistory) {
      // Zápis + provedení termínu v jednom kroku
      applyProposal(property.id, {
        entry: {
          type: ENTRY_TYPE_FOR[reminder.type] ?? "OTHER",
          title: reminder.title,
          description: text,
          date,
          media: [],
          elementIds: element ? [element.id] : undefined,
          result: res,
        },
        deadline: {
          reminderId: reminder.id,
          type: reminder.type,
          title: reminder.title,
          elementId: reminder.elementId,
        },
      });
    } else {
      completeReminder(property.id, reminder.id, { date, result: res, note: text });
    }

    const where = toHistory ? " a zapsáno do historie domu" : "";
    onDone(
      nextDue
        ? `„${reminder.title}“ — provedení uloženo${where}. Další termín: ${formatDay(nextDue)}.`
        : `„${reminder.title}“ je splněno${where}.`,
    );
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="mt-3 space-y-3 rounded-xl border border-teal-100 bg-teal-50/40 p-3"
    >
      <div className="grid gap-3 @md:grid-cols-2">
        <div>
          <label className="label" htmlFor={`${uid}-date`}>
            Kdy se provedlo *
          </label>
          <input
            id={`${uid}-date`}
            type="date"
            className="input"
            value={date}
            max={today}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        {showResult && (
          <div>
            <label className="label" htmlFor={`${uid}-result`}>
              Výsledek
            </label>
            <select
              id={`${uid}-result`}
              className="input"
              value={result}
              onChange={(e) => setResult(e.target.value as InspectionResult | "")}
            >
              <option value="">— neuvádět —</option>
              {Object.entries(INSPECTION_RESULTS).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div>
        <label className="label" htmlFor={`${uid}-note`}>
          Poznámka
        </label>
        <textarea
          id={`${uid}-note`}
          className="input min-h-16"
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Kdo to dělal, co se zjistilo…"
        />
      </div>

      <label className="flex min-h-10 cursor-pointer items-start gap-2.5 text-sm text-stone-700">
        <input
          type="checkbox"
          checked={toHistory}
          onChange={(e) => setToHistory(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-teal-700"
        />
        <span>
          Zapsat do historie domu
          <span className="block text-xs text-stone-500">
            Vznikne záznam{element ? ` u prvku ${element.name}` : ""}. Protokol můžete nahrát i
            přes „Nahrát protokol (AI)“.
          </span>
        </span>
      </label>

      <p className="text-xs text-stone-500">
        {nextDue
          ? `Další termín se posune na ${formatDay(nextDue)} (opakuje se ${intervalLabel(interval)}).`
          : "Termín se přesune mezi splněné."}
      </p>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <button type="submit" className="btn-primary min-h-10 flex-1">
          Uložit provedení
        </button>
        <button type="button" onClick={onCancel} className="btn-ghost min-h-10">
          Zrušit
        </button>
      </div>
    </form>
  );
}
