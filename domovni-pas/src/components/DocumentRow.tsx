"use client";

import { IconFile, IconDownload, IconTrash, IconPencil } from "@/components/Icons";
import { DOCUMENT_CATEGORIES } from "@/lib/enums";
import type { DocItem } from "@/lib/store";

export function DocumentRow({
  doc,
  onEdit,
  onDelete,
}: {
  doc: DocItem;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  return (
    <li className="flex items-center gap-3 py-2.5">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-stone-100 text-stone-500">
        <IconFile className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-stone-800">{doc.title}</p>
        <p className="truncate text-xs text-stone-400">
          {DOCUMENT_CATEGORIES[doc.category] ?? DOCUMENT_CATEGORIES.OTHER}
          {doc.fileName ? ` · ${doc.fileName}` : ""}
        </p>
      </div>
      {doc.dataUrl && (
        <a
          href={doc.dataUrl}
          download={doc.fileName ?? doc.title}
          className="btn-ghost btn-sm text-stone-500"
          title="Stáhnout"
        >
          <IconDownload className="h-4 w-4" />
        </a>
      )}
      {onEdit && (
        <button
          onClick={onEdit}
          className="btn-ghost btn-sm text-stone-400 hover:text-teal-700"
          aria-label="Upravit dokument"
        >
          <IconPencil className="h-4 w-4" />
        </button>
      )}
      {onDelete && (
        <button
          onClick={() => {
            if (confirm("Opravdu smazat tento dokument?")) onDelete();
          }}
          className="btn-ghost btn-sm text-stone-400 hover:text-red-600"
          aria-label="Smazat dokument"
        >
          <IconTrash className="h-4 w-4" />
        </button>
      )}
    </li>
  );
}
