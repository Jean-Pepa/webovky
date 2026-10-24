"use client";

import { IconFile, IconDownload, IconTrash } from "@/components/Icons";
import { ElementChips } from "@/components/elements/ElementChip";
import { DOCUMENT_CATEGORIES } from "@/lib/enums";
import { useStore, type DocItem } from "@/lib/store";

export function DocumentRow({
  doc,
  onDelete,
  propertyId,
  excludeElementId,
}: {
  doc: DocItem;
  onDelete?: () => void;
  propertyId?: string; // pro štítky navázaných prvků
  excludeElementId?: string; // na stránce prvku nevypisovat ten samý
}) {
  const { getProperty } = useStore();
  const property = propertyId && doc.elementIds?.length ? getProperty(propertyId) : undefined;

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
        {property && (
          <ElementChips
            property={property}
            ids={doc.elementIds}
            excludeId={excludeElementId}
            className="mt-1.5"
          />
        )}
      </div>
      {doc.dataUrl && (
        <a
          href={doc.dataUrl}
          download={doc.fileName ?? doc.title}
          className="btn-ghost btn-sm min-h-10 text-stone-500"
          title="Stáhnout"
          aria-label={`Stáhnout ${doc.title}`}
        >
          <IconDownload className="h-4 w-4" />
        </a>
      )}
      {onDelete && (
        <button
          onClick={() => {
            if (confirm("Opravdu smazat tento dokument?")) onDelete();
          }}
          className="btn-ghost btn-sm min-h-10 text-stone-400 hover:text-red-600"
          aria-label="Smazat dokument"
        >
          <IconTrash className="h-4 w-4" />
        </button>
      )}
    </li>
  );
}
