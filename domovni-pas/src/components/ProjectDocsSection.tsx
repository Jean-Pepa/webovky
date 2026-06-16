"use client";

import { useState } from "react";
import { useStore, type DocItem } from "@/lib/store";
import { DOC_SECTIONS, DOC_SECTION_ORDER, documentSection } from "@/lib/enums";
import { DocumentRow } from "@/components/DocumentRow";
import { DocumentUploadForm } from "@/components/forms/DocumentUploadForm";
import { IconFile, IconPlus } from "@/components/Icons";

export function ProjectDocsSection({
  propertyId,
  documents,
  editable = true,
}: {
  propertyId: string;
  documents: DocItem[];
  editable?: boolean;
}) {
  const { deleteDocument } = useStore();
  const [open, setOpen] = useState(false);

  return (
    <section className="card mt-8 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconFile className="h-4 w-4 text-teal-700" />
          <h2 className="text-sm font-semibold text-stone-900">Originální dokumentace stavby</h2>
          {documents.length > 0 && (
            <span className="text-xs text-stone-400">· {documents.length}</span>
          )}
        </div>
        {editable && (
          <button onClick={() => setOpen((o) => !o)} className="btn-ghost btn-sm text-teal-700">
            <IconPlus className="h-4 w-4" />
            Nahrát dokument
          </button>
        )}
      </div>

      {editable && open && (
        <div className="mt-3 border-b border-stone-100 pb-4">
          <DocumentUploadForm propertyId={propertyId} />
        </div>
      )}

      {documents.length === 0 && !open ? (
        <p className="mt-2 text-sm text-stone-500">
          {editable
            ? "Zatím žádné dokumenty. Nahrajte výkresy, studie, stavební povolení, technické zprávy nebo vizualizace."
            : "Zatím žádná dokumentace."}
        </p>
      ) : (
        <div className="mt-4 space-y-5">
          {DOC_SECTION_ORDER.map((s) => {
            const docs = documents.filter((d) => documentSection(d) === s);
            return (
              <div key={s}>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                  {DOC_SECTIONS[s]}
                </h3>
                {docs.length > 0 ? (
                  <ul className="mt-1 divide-y divide-stone-100">
                    {docs.map((doc) => (
                      <DocumentRow
                        key={doc.id}
                        doc={doc}
                        onDelete={editable ? () => deleteDocument(propertyId, doc.id) : undefined}
                      />
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-sm text-stone-400">—</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
