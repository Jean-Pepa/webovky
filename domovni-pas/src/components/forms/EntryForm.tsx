"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createEntry } from "@/lib/actions/entry";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { ENTRY_TYPES } from "@/lib/enums";
import { toDateInputValue } from "@/lib/format";
import type { FormState } from "@/lib/forms";

export function EntryForm({ propertyId }: { propertyId: string }) {
  const [state, action] = useActionState<FormState, FormData>(createEntry, {});

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="propertyId" value={propertyId} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="type">
            Typ záznamu
          </label>
          <select id="type" name="type" className="input" defaultValue="REPAIR">
            {Object.entries(ENTRY_TYPES).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="date">
            Datum
          </label>
          <input
            id="date"
            name="date"
            type="date"
            className="input"
            defaultValue={toDateInputValue(new Date())}
          />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="title">
          Název *
        </label>
        <input
          id="title"
          name="title"
          required
          className="input"
          placeholder="Např. Výměna plynového kotle"
        />
      </div>

      <div>
        <label className="label" htmlFor="description">
          Popis
        </label>
        <textarea
          id="description"
          name="description"
          className="input"
          placeholder="Co se dělo, kdo to prováděl…"
        />
      </div>

      <div>
        <label className="label" htmlFor="cost">
          Náklad (Kč)
        </label>
        <input
          id="cost"
          name="cost"
          type="number"
          min={0}
          className="input"
          placeholder="volitelné"
        />
      </div>

      <div>
        <label className="label" htmlFor="files">
          Fotky, videa a přílohy
        </label>
        <input
          id="files"
          name="files"
          type="file"
          multiple
          accept="image/*,video/*,application/pdf"
          className="block w-full text-sm text-stone-600 file:mr-4 file:rounded-lg file:border-0 file:bg-teal-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-teal-700 hover:file:bg-teal-100"
        />
        <p className="mt-1.5 text-xs text-stone-400">
          Foto z telefonu, 360° panorama i video — ukládáme výsledek bez ohledu na zařízení.
        </p>
      </div>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}

      <div className="flex gap-3">
        <SubmitButton className="btn-primary" pendingText="Ukládám…">
          Uložit záznam
        </SubmitButton>
        <Link href={`/nemovitost/${propertyId}`} className="btn-secondary">
          Zrušit
        </Link>
      </div>
    </form>
  );
}
