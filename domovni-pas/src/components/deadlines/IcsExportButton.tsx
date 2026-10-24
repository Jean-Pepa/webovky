"use client";

import type { Property, Reminder } from "@/lib/store";
import { downloadIcs, remindersToIcs } from "@/lib/ics";
import { pluralCs } from "@/lib/deadlines";
import { IconCalendar } from "@/components/Icons";

// Stáhne otevřené termíny jako .ics (import do Google Kalendáře, iCloudu, Outlooku)
export function IcsExportButton({
  items,
  filename,
  label = "Přidat do kalendáře (.ics)",
  className = "btn-secondary btn-sm min-h-10",
}: {
  items: { reminder: Reminder; property: Property }[];
  filename: string;
  label?: string;
  className?: string;
}) {
  const open = items.filter((i) => !i.reminder.done);

  function download() {
    if (open.length === 0) return;
    const content = remindersToIcs(open, {
      calendarName: "BULO – termíny a revize",
      origin: window.location.origin,
    });
    downloadIcs(filename, content);
  }

  return (
    <button
      type="button"
      onClick={download}
      disabled={open.length === 0}
      className={className}
      title={
        open.length === 0
          ? "Žádné otevřené termíny k exportu"
          : `Stáhnout ${open.length} ${pluralCs(open.length, "termín", "termíny", "termínů")} do kalendáře`
      }
    >
      <IconCalendar className="h-4 w-4" />
      {label}
    </button>
  );
}
