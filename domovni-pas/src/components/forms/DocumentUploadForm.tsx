"use client";

import { useState } from "react";
import { useStore, type DocCategory } from "@/lib/store";
import { fileToDataUrl } from "@/lib/media";
import { DOCUMENT_CATEGORIES } from "@/lib/enums";

export function DocumentUploadForm({ propertyId }: { propertyId: string }) {
  const { addDocument } = useStore();
  const [pending, setPending] = useState(false);

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
      category: String(fd.get("category") || "OTHER") as DocCategory,
      fileName: file.name,
      dataUrl,
    });
    form.reset();
    setPending(false);
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <select name="category" className="input" defaultValue="PLAN">
        {Object.entries(DOCUMENT_CATEGORIES).map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>

      <input name="title" className="input" placeholder="Název dokumentu (volitelné)" />

      <input
        name="file"
        type="file"
        required
        className="block w-full text-sm text-stone-600 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-teal-700 hover:file:bg-teal-100"
      />

      <button type="submit" className="btn-secondary w-full" disabled={pending}>
        {pending ? "Nahrávám…" : "Nahrát dokument"}
      </button>
    </form>
  );
}
