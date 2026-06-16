"use client";

import { useState } from "react";
import { useStore, type Reminder, type ReminderType } from "@/lib/store";
import { REMINDER_TYPES } from "@/lib/enums";
import { dueStatus } from "@/lib/format";
import { IconTrash, IconCheck, IconPlus } from "@/components/Icons";

export function ReminderSection({
  propertyId,
  reminders,
  editable = true,
}: {
  propertyId: string;
  reminders: Reminder[];
  editable?: boolean;
}) {
  const { addReminder, toggleReminder, deleteReminder } = useStore();
  const [open, setOpen] = useState(false);

  const sorted = [...reminders].sort(
    (a, b) => Number(a.done) - Number(b.done) || a.dueDate.localeCompare(b.dueDate),
  );

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const title = String(fd.get("title") || "").trim();
    const dueDate = String(fd.get("dueDate") || "");
    if (!title || !dueDate) return;
    addReminder(propertyId, {
      title,
      type: String(fd.get("type") || "INSPECTION") as ReminderType,
      dueDate,
    });
    form.reset();
    setOpen(false);
  }

  return (
    <section className="card p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-stone-900">Připomínky</h2>
        {editable && (
          <button onClick={() => setOpen((o) => !o)} className="btn-ghost btn-sm text-teal-700">
            <IconPlus className="h-4 w-4" />
            Přidat
          </button>
        )}
      </div>

      {sorted.length > 0 ? (
        <ul className="mt-2 divide-y divide-stone-100">
          {sorted.map((r) => {
            const st = dueStatus(r.dueDate);
            return (
              <li key={r.id} className="flex items-start gap-2.5 py-2.5">
                {editable ? (
                  <button
                    onClick={() => toggleReminder(propertyId, r.id)}
                    className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border transition ${
                      r.done
                        ? "border-teal-600 bg-teal-600 text-white"
                        : "border-stone-300 text-transparent hover:border-teal-500"
                    }`}
                    aria-label="Označit jako splněné"
                  >
                    <IconCheck className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <span
                    className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border ${
                      r.done
                        ? "border-teal-600 bg-teal-600 text-white"
                        : "border-stone-300 text-transparent"
                    }`}
                  >
                    <IconCheck className="h-3.5 w-3.5" />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm font-medium ${
                      r.done ? "text-stone-400 line-through" : "text-stone-800"
                    }`}
                  >
                    {r.title}
                  </p>
                  <p className="text-xs">
                    <span className="text-stone-400">{REMINDER_TYPES[r.type]} · </span>
                    {r.done ? (
                      <span className="text-stone-400">splněno</span>
                    ) : (
                      <span
                        className={
                          st.overdue
                            ? "font-medium text-red-600"
                            : st.soon
                              ? "font-medium text-amber-600"
                              : "text-stone-500"
                        }
                      >
                        {st.label}
                      </span>
                    )}
                  </p>
                </div>
                {editable && (
                  <button
                    onClick={() => {
                      if (confirm("Smazat připomínku?")) deleteReminder(propertyId, r.id);
                    }}
                    className="btn-ghost btn-sm text-stone-400 hover:text-red-600"
                    aria-label="Smazat"
                  >
                    <IconTrash className="h-4 w-4" />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        !open && (
          <p className="mt-2 text-sm text-stone-500">
            Žádné připomínky. Nastavte si termín příští revize nebo konce záruky.
          </p>
        )
      )}

      {open && (
        <form onSubmit={submit} className="mt-3 space-y-2 border-t border-stone-100 pt-3">
          <input name="title" required className="input" placeholder="Např. Revize kotle" />
          <div className="grid grid-cols-2 gap-2">
            <select name="type" className="input" defaultValue="INSPECTION">
              {Object.entries(REMINDER_TYPES).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
            <input name="dueDate" type="date" required className="input" />
          </div>
          <button className="btn-secondary w-full" type="submit">
            Uložit připomínku
          </button>
        </form>
      )}
    </section>
  );
}
