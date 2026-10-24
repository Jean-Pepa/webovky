"use client";

import { useState } from "react";
import { useStore, type HouseElement, type Property } from "@/lib/store";
import { DOCUMENT_CATEGORIES, ENTRY_TYPES, REMINDER_TYPES } from "@/lib/enums";
import { elementName } from "@/lib/elements";
import { formatDay } from "@/lib/deadlines";
import { formatDate } from "@/lib/format";
import { IconCheck, IconSearch } from "@/components/Icons";
import { fold, withElementId } from "./element-utils";

type Row = {
  key: string;
  title: string;
  meta: string;
  linked: boolean;
  elsewhere?: string; // termín / vybavení (jen jeden prvek): k čemu je navázané teď
  also?: string; // u záznamů s více prvky: s čím dalším je navázaný
  suggested: boolean;
  onToggle: (on: boolean) => void;
};

// Slova z názvu / druhu / místnosti prvku (bez diakritiky, zkrácená kvůli skloňování)
function hintStems(el: HouseElement): string[] {
  const words = fold([el.name, el.kind, el.room].filter(Boolean).join(" ")).split(/[^a-z0-9]+/);
  const stems = words
    .filter((w) => w.length >= 4)
    .map((w) => w.slice(0, Math.max(4, w.length - 2)));
  return [...new Set(stems)];
}

// Migrace existujících dat na prvky: zaškrtnutím se záznam / doklad / termín / vybavení naváže.
export function LinkRecordsPanel({ property, element }: { property: Property; element: HouseElement }) {
  const { setEntryElements, setDocumentElements, setInventoryElement, updateReminder } = useStore();
  const [query, setQuery] = useState("");
  const pid = property.id;
  const eid = element.id;
  // co bylo navázané při otevření, zůstává nahoře (řádky při klepání neposkakují)
  const [pinned] = useState(
    () =>
      new Set([
        ...property.entries.filter((e) => e.elementIds?.includes(eid)).map((e) => `e:${e.id}`),
        ...property.documents.filter((d) => d.elementIds?.includes(eid)).map((d) => `d:${d.id}`),
        ...property.reminders.filter((r) => r.elementId === eid).map((r) => `r:${r.id}`),
        ...property.inventory.filter((i) => i.elementId === eid).map((i) => `i:${i.id}`),
      ]),
  );
  const stems = hintStems(element);
  const q = fold(query.trim());

  const isSuggested = (text: string) => {
    const t = fold(text);
    return stems.some((s) => t.includes(s));
  };
  const otherNames = (ids?: string[]) =>
    (ids ?? [])
      .filter((x) => x !== eid)
      .map((x) => elementName(property, x))
      .filter(Boolean)
      .join(", ") || undefined;

  const entries: Row[] = [...property.entries]
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""))
    .map((e) => ({
      key: `e:${e.id}`,
      title: e.title,
      meta: `${ENTRY_TYPES[e.type] ?? e.type} · ${formatDay(e.date)}`,
      linked: !!e.elementIds?.includes(eid),
      also: otherNames(e.elementIds),
      suggested: isSuggested(`${e.title} ${e.description ?? ""}`),
      onToggle: (on) => setEntryElements(pid, e.id, withElementId(e.elementIds, eid, on)),
    }));

  const documents: Row[] = property.documents.map((d) => ({
    key: `d:${d.id}`,
    title: d.title,
    meta: [
      DOCUMENT_CATEGORIES[d.category] ?? DOCUMENT_CATEGORIES.OTHER,
      d.fileName,
      d.createdAt && !Number.isNaN(Date.parse(d.createdAt)) ? formatDate(d.createdAt) : undefined,
    ]
      .filter(Boolean)
      .join(" · "),
    linked: !!d.elementIds?.includes(eid),
    also: otherNames(d.elementIds),
    suggested: isSuggested(`${d.title} ${d.fileName ?? ""}`),
    onToggle: (on) => setDocumentElements(pid, d.id, withElementId(d.elementIds, eid, on)),
  }));

  const reminders: Row[] = [...property.reminders]
    .sort((a, b) => Number(a.done) - Number(b.done) || (a.dueDate ?? "").localeCompare(b.dueDate ?? ""))
    .map((r) => ({
      key: `r:${r.id}`,
      title: r.title,
      meta: `${REMINDER_TYPES[r.type] ?? r.type} · ${r.done ? "splněno" : formatDay(r.dueDate)}`,
      linked: r.elementId === eid,
      elsewhere: r.elementId && r.elementId !== eid ? elementName(property, r.elementId) : undefined,
      suggested: isSuggested(`${r.title} ${r.note ?? ""}`),
      onToggle: (on) => updateReminder(pid, r.id, { elementId: on ? eid : undefined }),
    }));

  const inventory: Row[] = property.inventory.map((i) => ({
    key: `i:${i.id}`,
    title: i.name,
    meta: [i.location, i.brand].filter(Boolean).join(" · ") || "Vybavení",
    linked: i.elementId === eid,
    elsewhere: i.elementId && i.elementId !== eid ? elementName(property, i.elementId) : undefined,
    suggested: isSuggested(`${i.name} ${i.location ?? ""} ${i.brand ?? ""}`),
    onToggle: (on) => setInventoryElement(pid, i.id, on ? eid : undefined),
  }));

  const total = entries.length + documents.length + reminders.length + inventory.length;

  return (
    <div>
      <p className="text-sm text-stone-600">
        Zaškrtněte, co k prvku „{element.name}“ patří. Záznam může patřit k více prvkům; termín a
        položka vybavení vždy jen k jednomu.
      </p>

      {total === 0 ? (
        <p className="mt-4 text-sm text-stone-500">V knize domu zatím nejsou žádné záznamy k navázání.</p>
      ) : (
        <>
          {total > 8 && (
            <div className="relative mt-4">
              <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="input pl-9"
                placeholder="Hledat v záznamech, dokladech, termínech…"
                aria-label="Hledat v záznamech"
              />
            </div>
          )}
          <div className="mt-4 space-y-5">
            <Group title="Záznamy v historii" rows={entries} query={q} pinned={pinned} />
            <Group title="Dokumenty" rows={documents} query={q} pinned={pinned} />
            <Group title="Termíny a revize" rows={reminders} query={q} pinned={pinned} />
            <Group title="Vybavení" rows={inventory} query={q} pinned={pinned} />
          </div>
        </>
      )}
    </div>
  );
}

function Group({
  title,
  rows,
  query,
  pinned,
}: {
  title: string;
  rows: Row[];
  query: string;
  pinned: Set<string>;
}) {
  if (rows.length === 0) return null;
  const linkedCount = rows.filter((r) => r.linked).length;
  const filtered = query
    ? rows.filter((r) => fold(`${r.title} ${r.meta}`).includes(query))
    : rows;
  // navázané (při otevření) nahoře, pak návrhy, pak zbytek v původním pořadí
  const top = filtered.filter((r) => pinned.has(r.key));
  const rest = filtered.filter((r) => !pinned.has(r.key));
  const ordered = [...top, ...rest.filter((r) => r.suggested), ...rest.filter((r) => !r.suggested)];

  return (
    <section>
      <h3 className="flex items-baseline justify-between gap-2 text-xs font-semibold uppercase tracking-wide text-stone-400">
        {title}
        <span className="font-normal normal-case tracking-normal">
          navázáno {linkedCount} z {rows.length}
        </span>
      </h3>
      {ordered.length === 0 ? (
        <p className="mt-1 text-sm text-stone-400">Nic neodpovídá hledání.</p>
      ) : (
        <ul className="mt-1 divide-y divide-stone-100 rounded-xl border border-stone-200 bg-white">
          {ordered.map((r) => (
            <li key={r.key}>
              <button
                type="button"
                role="checkbox"
                aria-checked={r.linked}
                onClick={() => r.onToggle(!r.linked)}
                className={`flex min-h-12 w-full items-start gap-3 px-3 py-2.5 text-left transition first:rounded-t-xl last:rounded-b-xl ${
                  r.linked ? "bg-teal-50/60" : "hover:bg-stone-50"
                }`}
              >
                <span
                  className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border ${
                    r.linked
                      ? "border-teal-600 bg-teal-600 text-white"
                      : "border-stone-300 text-transparent"
                  }`}
                  aria-hidden
                >
                  <IconCheck className="h-3.5 w-3.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="break-words text-sm font-medium text-stone-800">{r.title}</span>
                    {!r.linked && r.suggested && (
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                        možná souvisí
                      </span>
                    )}
                  </span>
                  <span className="block break-words text-xs text-stone-400">{r.meta}</span>
                  {r.elsewhere && !r.linked && (
                    <span className="block text-xs text-amber-700">
                      Teď u prvku „{r.elsewhere}“ — zaškrtnutím se přepojí sem.
                    </span>
                  )}
                  {r.also && (
                    <span className="block text-xs text-stone-500">Také u: {r.also}</span>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
