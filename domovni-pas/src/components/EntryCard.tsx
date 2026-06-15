"use client";

import { Badge } from "@/components/ui/Badge";
import { AttachmentThumb } from "@/components/AttachmentThumb";
import { IconMoney, IconTrash } from "@/components/Icons";
import { ENTRY_TYPES, ENTRY_TYPE_COLORS } from "@/lib/enums";
import { formatDate, formatCurrency } from "@/lib/format";
import type { Entry } from "@/lib/store";

const DOT: Record<string, string> = {
  blue: "bg-blue-500",
  red: "bg-red-500",
  violet: "bg-violet-500",
  emerald: "bg-emerald-500",
  teal: "bg-teal-500",
  amber: "bg-amber-500",
  gray: "bg-stone-400",
};

export function EntryCard({ entry, onDelete }: { entry: Entry; onDelete?: () => void }) {
  const color = ENTRY_TYPE_COLORS[entry.type] ?? "gray";

  return (
    <li className="relative">
      <span
        className={`absolute -left-[1.95rem] top-5 h-3.5 w-3.5 rounded-full ring-4 ring-[#f5f1e8] ${DOT[color]}`}
        aria-hidden
      />
      <div className="card p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge color={color}>{ENTRY_TYPES[entry.type]}</Badge>
            <time className="text-xs text-stone-400">{formatDate(entry.date)}</time>
          </div>
          {onDelete && (
            <button
              onClick={() => {
                if (confirm("Opravdu smazat tento záznam?")) onDelete();
              }}
              className="btn-ghost btn-sm text-stone-400 hover:text-red-600"
              aria-label="Smazat záznam"
            >
              <IconTrash className="h-4 w-4" />
            </button>
          )}
        </div>

        <h3 className="mt-2 text-base font-semibold text-stone-900">{entry.title}</h3>
        {entry.description && (
          <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-stone-600">
            {entry.description}
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
      </div>
    </li>
  );
}
