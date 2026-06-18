"use client";

import { useState } from "react";
import { useStore, type DocCategory, type DocSection } from "@/lib/store";
import { fileToDataUrl } from "@/lib/media";
import { DOCUMENT_CATEGORIES, DOC_SECTIONS, CATEGORY_TO_SECTION, guessDocCategory } from "@/lib/enums";

export function DocumentUploadForm({ propertyId }: { propertyId: string }) {
  const { addDocument } = useStore();
  const [pending, setPending] = useState(false);
  const [category, setCategory] = useState<DocCategory>("PLAN");
  const [section, setSection] = useState<DocSection>("NAVRH");
  const [autoSorted, setAutoSorted] = useState(false);

  // Po výběru souboru se kategorie a sekce zařadí automaticky podle názvu.
  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const cat = guessDocCategory(f.name) as DocCategory;
    setCategory(cat);
    setSection((CATEGORY_TO_SECTION[cat] ?? "BUDOVA") as DocSection);
    setAutoSorted(true);
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const file = fd.get("file");
    if (!(file instanceof File) || file.size === 0) return;

    setPending(true);
    const dataUrl = await fileToDataUrl(file);
    addDocument(propertyId, {
      title: String(fd.get("title") || "").trim() || file.name,
      category,
      section,
      fileName: file.name,
      dataUrl,
    });
    form.reset();
    setCategory("PLAN");
    setSection("NAVRH");
    setAutoSorted(false);
    setPending(false);
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input
        name="file"
        type="file"
        required
        onChange={onFile}
        className="block w-full text-sm text-stone-600 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-teal-700 hover:file:bg-teal-100"
      />

      <div className="grid grid-cols-2 gap-3">
        <select
          name="section"
          className="input"
          value={section}
          onChange={(e) => setSection(e.target.value as DocSection)}
          aria-label="Sekce projektu"
        >
          {Object.entries(DOC_SECTIONS).map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
        <select
          name="category"
          className="input"
          value={category}
          onChange={(e) => setCategory(e.target.value as DocCategory)}
          aria-label="Kategorie"
        >
          {Object.entries(DOCUMENT_CATEGORIES).map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
      </div>

      {autoSorted && (
        <p className="text-xs text-teal-700">
          Zařazeno automaticky podle názvu — můžeš upravit.
        </p>
      )}

      <input name="title" className="input" placeholder="Název dokumentu (volitelné)" />

      <button type="submit" className="btn-secondary w-full" disabled={pending}>
        {pending ? "Nahrávám…" : "Nahrát dokument"}
      </button>
    </form>
  );
}
