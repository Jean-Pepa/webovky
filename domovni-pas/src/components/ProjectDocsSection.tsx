"use client";

import { useState } from "react";
import { useStore, type DocItem, type DocCategory, type DocSection } from "@/lib/store";
import { DOC_SECTIONS, DOC_SECTION_ORDER, documentSection, DOCUMENT_CATEGORIES } from "@/lib/enums";
import { DocumentRow } from "@/components/DocumentRow";
import { DocumentUploadForm } from "@/components/forms/DocumentUploadForm";
import { IconFile, IconPlus } from "@/components/Icons";

export function ProjectDocsSection({
  propertyId,
  documents,
  editable = true,
  canAdd,
}: {
  propertyId: string;
  documents: DocItem[];
  editable?: boolean;
  canAdd?: boolean;
}) {
  const { deleteDocument } = useStore();
  const add = canAdd ?? editable;
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

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
        {add && (
          <button onClick={() => setOpen((o) => !o)} className="btn-ghost btn-sm text-teal-700">
            <IconPlus className="h-4 w-4" />
            Nahrát dokument
          </button>
        )}
      </div>

      {add && open && (
        <div className="mt-3 border-b border-stone-100 pb-4">
          <DocumentUploadForm propertyId={propertyId} />
        </div>
      )}
      {/* DocEditRow je definovaný níže */}

      {documents.length === 0 && !open ? (
        <p className="mt-2 text-sm text-stone-500">
          {add
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
                    {docs.map((doc) =>
                      editId === doc.id ? (
                        <DocEditRow
                          key={doc.id}
                          propertyId={propertyId}
                          doc={doc}
                          onDone={() => setEditId(null)}
                        />
                      ) : (
                        <DocumentRow
                          key={doc.id}
                          doc={doc}
                          onEdit={editable ? () => setEditId(doc.id) : undefined}
                          onDelete={editable ? () => deleteDocument(propertyId, doc.id) : undefined}
                        />
                      ),
                    )}
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

function DocEditRow({
  propertyId,
  doc,
  onDone,
}: {
  propertyId: string;
  doc: DocItem;
  onDone: () => void;
}) {
  const { updateDocument } = useStore();
  const [title, setTitle] = useState(doc.title);
  const [category, setCategory] = useState<DocCategory>(doc.category);
  const [section, setSection] = useState<DocSection>(
    (doc.section ?? "BUDOVA") as DocSection,
  );

  function save() {
    if (!title.trim()) return;
    updateDocument(propertyId, doc.id, { title: title.trim(), category, section });
    onDone();
  }

  return (
    <li className="space-y-2 py-3">
      <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
      <div className="grid grid-cols-2 gap-2">
        <select className="input" value={section} onChange={(e) => setSection(e.target.value as DocSection)}>
          {Object.entries(DOC_SECTIONS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <select className="input" value={category} onChange={(e) => setCategory(e.target.value as DocCategory)}>
          {Object.entries(DOCUMENT_CATEGORIES).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <button onClick={save} className="btn-secondary btn-sm">Uložit</button>
        <button onClick={onDone} className="btn-ghost btn-sm text-stone-500">Zrušit</button>
      </div>
    </li>
  );
}
