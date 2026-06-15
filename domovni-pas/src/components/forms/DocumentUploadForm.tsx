"use client";

import { useActionState } from "react";
import { uploadDocument } from "@/lib/actions/document";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { DOCUMENT_CATEGORIES } from "@/lib/enums";
import type { FormState } from "@/lib/forms";

export function DocumentUploadForm({ propertyId }: { propertyId: string }) {
  const [state, action] = useActionState<FormState, FormData>(uploadDocument, {});

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="propertyId" value={propertyId} />

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

      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}

      <SubmitButton className="btn-secondary w-full" pendingText="Nahrávám…">
        Nahrát dokument
      </SubmitButton>
    </form>
  );
}
