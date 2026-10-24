"use client";

import { Badge } from "@/components/ui/Badge";
import { AttachmentThumb } from "@/components/AttachmentThumb";
import { ElementChips } from "@/components/elements/ElementChip";
import { IconCheck, IconDownload, IconFile, IconMoney, IconTrash } from "@/components/Icons";
import { DOCUMENT_CATEGORIES, ENTRY_TYPES, ENTRY_TYPE_COLORS } from "@/lib/enums";
import { formatDate, formatCurrency } from "@/lib/format";
import { ISO_DATE_RE, formatDay } from "@/lib/deadlines";
import { INSPECTION_RESULTS, type InspectionResult } from "@/lib/submission";
import type { AuthorRole, DocItem, Entry, Property } from "@/lib/store";

const DOT: Record<string, string> = {
  blue: "bg-blue-500",
  red: "bg-red-500",
  violet: "bg-violet-500",
  emerald: "bg-emerald-500",
  teal: "bg-teal-500",
  amber: "bg-amber-500",
  gray: "bg-stone-400",
};

// YYYY-MM-DD bez posunu časového pásma; neplatné datum (např. ze serveru) stránku neshodí
function dateLabel(d?: string): string {
  if (!d) return "";
  if (ISO_DATE_RE.test(d)) return formatDay(d);
  return Number.isNaN(Date.parse(d)) ? d : formatDate(d);
}

const AUTHOR_ROLES: Record<AuthorRole, string> = {
  OWNER: "Majitel",
  CRAFTSMAN: "Řemeslník",
  INSPECTOR: "Revizní technik",
  ARCHITECT: "Architekt",
};

const RESULT_COLORS: Record<InspectionResult, "emerald" | "amber" | "red"> = {
  OK: "emerald",
  DEFECTS: "amber",
  FAIL: "red",
};

export function EntryCard({
  entry,
  property,
  onDelete,
  excludeElementId,
}: {
  entry: Entry;
  property?: Property; // pro názvy navázaných prvků a dokladů
  onDelete?: () => void;
  excludeElementId?: string; // na stránce prvku nevypisovat ten samý prvek
}) {
  const color = ENTRY_TYPE_COLORS[entry.type] ?? "gray";
  const author = entry.author;
  const confirmed = !!(entry.confirmedAt || entry.submissionId);
  const docs: DocItem[] = property
    ? (entry.documentIds ?? [])
        .map((id) => property.documents.find((d) => d.id === id))
        .filter((d): d is DocItem => !!d)
    : [];

  return (
    <li className="relative">
      <span
        className={`absolute -left-[1.95rem] top-5 h-3.5 w-3.5 rounded-full ring-4 ring-[#faf9f7] ${DOT[color]}`}
        aria-hidden
      />
      <div className="card p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge color={color}>{ENTRY_TYPES[entry.type]}</Badge>
            <time className="text-xs text-stone-400">{dateLabel(entry.date)}</time>
          </div>
          {onDelete && (
            <button
              type="button"
              onClick={() => {
                if (confirm("Opravdu smazat tento záznam?")) onDelete();
              }}
              className="btn-ghost btn-sm -mr-2 -mt-2 min-h-10 min-w-10 shrink-0 text-stone-400 hover:text-red-600"
              aria-label="Smazat záznam"
            >
              <IconTrash className="h-4 w-4" />
            </button>
          )}
        </div>

        <h3 className="mt-2 break-words text-base font-semibold text-stone-900">{entry.title}</h3>
        {entry.description && (
          <p className="mt-1 whitespace-pre-line break-words text-sm leading-relaxed text-stone-600">
            {entry.description}
          </p>
        )}

        {entry.result && INSPECTION_RESULTS[entry.result] && (
          <p className="mt-2 flex flex-wrap items-center gap-2 text-xs text-stone-500">
            Výsledek revize:
            <Badge color={RESULT_COLORS[entry.result]}>{INSPECTION_RESULTS[entry.result]}</Badge>
          </p>
        )}

        {entry.cost != null && (
          <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-stone-700">
            <IconMoney className="h-4 w-4 text-stone-400" />
            {formatCurrency(entry.cost)}
          </p>
        )}

        {entry.media.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {entry.media.map((m) => (
              <AttachmentThumb key={m.id} m={m} />
            ))}
          </div>
        )}

        {docs.length > 0 && (
          <ul className="mt-3 space-y-1">
            {docs.map((d) => {
              const label = (
                <>
                  <IconFile className="h-4 w-4 shrink-0 text-stone-400" />
                  <span className="min-w-0 truncate font-medium text-stone-700">{d.title}</span>
                  <span className="hidden shrink-0 text-xs text-stone-400 sm:inline">
                    {DOCUMENT_CATEGORIES[d.category] ?? DOCUMENT_CATEGORIES.OTHER}
                  </span>
                </>
              );
              return (
                <li key={d.id}>
                  {d.dataUrl ? (
                    <a
                      href={d.dataUrl}
                      download={d.fileName ?? d.title}
                      className="flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm transition hover:bg-stone-50"
                      title="Stáhnout"
                    >
                      {label}
                      <IconDownload className="ml-auto h-4 w-4 shrink-0 text-teal-700" />
                    </a>
                  ) : (
                    <span className="flex min-h-10 items-center gap-2 px-2 text-sm">{label}</span>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {property && (
          <ElementChips
            property={property}
            ids={entry.elementIds}
            excludeId={excludeElementId}
            className="mt-3"
          />
        )}

        {(author || confirmed) && (
          <div className="mt-3 space-y-0.5 border-t border-stone-100 pt-3 text-xs text-stone-500">
            {author && (
              <p className="break-words">
                Zapsal:{" "}
                <span className="font-medium text-stone-700">
                  {[author.name, AUTHOR_ROLES[author.role] ?? author.role, author.company]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
                {property && author.phone && (
                  <>
                    {" · "}
                    <a href={`tel:${author.phone.replace(/\s/g, "")}`} className="text-teal-700 hover:underline">
                      {author.phone}
                    </a>
                  </>
                )}
              </p>
            )}
            {confirmed && (
              <p className="inline-flex items-center gap-1 text-emerald-700">
                <IconCheck className="h-3.5 w-3.5" />
                Potvrzeno majitelem{entry.confirmedAt ? ` ${dateLabel(entry.confirmedAt)}` : ""}
              </p>
            )}
          </div>
        )}
      </div>
    </li>
  );
}
