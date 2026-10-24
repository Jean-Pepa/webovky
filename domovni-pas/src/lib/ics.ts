// Export termínů do kalendáře (iCalendar, RFC 5545).
// Celodenní události s připomenutím předem — funguje s Google Kalendářem, iCloudem i Outlookem.

import type { Property, Reminder } from "./store";
import { REMINDER_TYPES } from "./enums";
import { formatDateShort } from "./format";
import {
  DEFAULT_NOTIFY_DAYS,
  ISO_DATE_RE,
  addDays,
  intervalLabel,
} from "./deadlines";

export type IcsDeadline = {
  uid: string; // „<reminderId>@bulo"
  date: string; // YYYY-MM-DD
  summary: string;
  description?: string;
  url?: string;
  notifyDaysBefore?: number;
};

const CRLF = "\r\n";

// Escapování TEXT hodnot (backslash, středník, čárka, nový řádek)
export function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r\n|\r|\n/g, "\\n");
}

function utf8Length(codePoint: number): number {
  if (codePoint < 0x80) return 1;
  if (codePoint < 0x800) return 2;
  if (codePoint < 0x10000) return 3;
  return 4;
}

// Zalomení řádku po 75 oktetech (UTF-8); pokračování začíná mezerou. Nerozdělí vícebajtový znak.
export function foldIcsLine(line: string): string {
  const out: string[] = [];
  let current = "";
  let bytes = 0;
  for (const ch of line) {
    const len = utf8Length(ch.codePointAt(0) ?? 0);
    if (bytes + len > 75) {
      out.push(current);
      current = " ";
      bytes = 1;
    }
    current += ch;
    bytes += len;
  }
  out.push(current);
  return out.join(CRLF);
}

function icsDate(date: string): string {
  return date.replace(/-/g, "");
}

function icsTimestamp(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export function buildIcs(
  events: IcsDeadline[],
  opts: { calendarName?: string; now?: Date } = {},
): string {
  const stamp = icsTimestamp(opts.now ?? new Date());
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//BULO//Kniha domu//CS",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];
  if (opts.calendarName) lines.push(`X-WR-CALNAME:${escapeIcsText(opts.calendarName)}`);

  for (const ev of events) {
    if (!ISO_DATE_RE.test(ev.date)) continue;
    const days = Math.max(0, Math.round(ev.notifyDaysBefore ?? DEFAULT_NOTIFY_DAYS));
    lines.push(
      "BEGIN:VEVENT",
      `UID:${ev.uid}`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${icsDate(ev.date)}`,
      `DTEND;VALUE=DATE:${icsDate(addDays(ev.date, 1))}`,
      `SUMMARY:${escapeIcsText(ev.summary)}`,
    );
    if (ev.description) lines.push(`DESCRIPTION:${escapeIcsText(ev.description)}`);
    if (ev.url) lines.push(`URL:${ev.url}`);
    lines.push(
      "TRANSP:TRANSPARENT",
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      `DESCRIPTION:${escapeIcsText(ev.summary)}`,
      days > 0 ? `TRIGGER:-P${days}D` : "TRIGGER:PT0S",
      "END:VALARM",
      "END:VEVENT",
    );
  }

  lines.push("END:VCALENDAR");
  return lines.map(foldIcsLine).join(CRLF) + CRLF;
}

// Termín → událost kalendáře
export function reminderToIcsEvent(
  reminder: Reminder,
  property: Property,
  origin?: string,
): IcsDeadline {
  const element = reminder.elementId
    ? property.elements?.find((e) => e.id === reminder.elementId)
    : undefined;
  const desc: string[] = [];
  desc.push(`${REMINDER_TYPES[reminder.type] ?? "Termín"} · ${property.name}`);
  if (element) desc.push(`Prvek: ${element.name}`);
  if (reminder.intervalMonths && reminder.intervalMonths > 0) {
    const confirmed = reminder.intervalConfirmed
      ? reminder.confirmedBy
        ? ` (potvrdil: ${reminder.confirmedBy})`
        : " (potvrdil revizní technik)"
      : " (lhůta nepotvrzená — ověřte s revizním technikem)";
    desc.push(`Opakování: ${intervalLabel(reminder.intervalMonths)}${confirmed}`);
  }
  if (reminder.lastDone && ISO_DATE_RE.test(reminder.lastDone)) {
    desc.push(`Naposledy provedeno: ${formatDateShort(`${reminder.lastDone}T00:00:00`)}`);
  }
  if (reminder.note) desc.push(`Poznámka: ${reminder.note}`);
  desc.push("Z aplikace BULO – kniha domu");

  return {
    uid: `${reminder.id}@bulo`,
    date: reminder.dueDate,
    summary: `${reminder.title} — ${property.name}`,
    description: desc.join("\n"),
    url: origin ? `${origin}/nemovitost/${encodeURIComponent(property.id)}` : undefined,
    notifyDaysBefore: reminder.notifyDaysBefore,
  };
}

// Otevřené termíny zadaných nemovitostí → obsah .ics
export function remindersToIcs(
  items: { reminder: Reminder; property: Property }[],
  opts: { calendarName?: string; origin?: string; now?: Date } = {},
): string {
  const events = items
    .filter(({ reminder }) => !reminder.done)
    .map(({ reminder, property }) => reminderToIcsEvent(reminder, property, opts.origin));
  return buildIcs(events, { calendarName: opts.calendarName, now: opts.now });
}

// „Rodinný dům Říčany" → „rodinny-dum-ricany"
export function icsSlug(text: string): string {
  return (
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // diakritika
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "terminy"
  );
}

// Stažení souboru v prohlížeči (jen na klientovi)
export function downloadIcs(filename: string, content: string): void {
  if (typeof window === "undefined") return;
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".ics") ? filename : `${filename}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Safari potřebuje URL ještě chvíli po kliknutí
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
