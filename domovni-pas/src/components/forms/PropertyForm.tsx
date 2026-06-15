"use client";

import { useActionState } from "react";
import Link from "next/link";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { PROPERTY_TYPES } from "@/lib/enums";
import type { FormState } from "@/lib/forms";

type PropertyValues = {
  id?: string;
  name?: string;
  type?: string;
  street?: string | null;
  city?: string | null;
  zip?: string | null;
  cadastralArea?: string | null;
  parcelNumber?: string | null;
  yearBuilt?: number | null;
  description?: string | null;
};

export function PropertyForm({
  action,
  initial,
  submitLabel,
}: {
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
  initial?: PropertyValues;
  submitLabel: string;
}) {
  const [state, formAction] = useActionState<FormState, FormData>(action, {});

  return (
    <form action={formAction} className="space-y-5">
      {initial?.id && <input type="hidden" name="id" value={initial.id} />}

      <div>
        <label className="label" htmlFor="name">
          Název nemovitosti *
        </label>
        <input
          id="name"
          name="name"
          required
          className="input"
          defaultValue={initial?.name ?? ""}
          placeholder="Např. Rodinný dům Říčany"
        />
      </div>

      <div>
        <label className="label" htmlFor="type">
          Typ
        </label>
        <select id="type" name="type" className="input" defaultValue={initial?.type ?? "HOUSE"}>
          {Object.entries(PROPERTY_TYPES).map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label" htmlFor="street">
            Ulice a číslo
          </label>
          <input id="street" name="street" className="input" defaultValue={initial?.street ?? ""} />
        </div>
        <div>
          <label className="label" htmlFor="zip">
            PSČ
          </label>
          <input id="zip" name="zip" className="input" defaultValue={initial?.zip ?? ""} />
        </div>
        <div>
          <label className="label" htmlFor="city">
            Obec
          </label>
          <input id="city" name="city" className="input" defaultValue={initial?.city ?? ""} />
        </div>
        <div>
          <label className="label" htmlFor="cadastralArea">
            Katastrální území
          </label>
          <input
            id="cadastralArea"
            name="cadastralArea"
            className="input"
            defaultValue={initial?.cadastralArea ?? ""}
          />
        </div>
        <div>
          <label className="label" htmlFor="parcelNumber">
            Parcela / č. popisné
          </label>
          <input
            id="parcelNumber"
            name="parcelNumber"
            className="input"
            defaultValue={initial?.parcelNumber ?? ""}
          />
        </div>
        <div>
          <label className="label" htmlFor="yearBuilt">
            Rok výstavby
          </label>
          <input
            id="yearBuilt"
            name="yearBuilt"
            type="number"
            min={1500}
            max={2100}
            className="input"
            defaultValue={initial?.yearBuilt ?? ""}
          />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="description">
          Popis
        </label>
        <textarea
          id="description"
          name="description"
          className="input"
          defaultValue={initial?.description ?? ""}
          placeholder="Stručný popis nemovitosti…"
        />
      </div>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}

      <div className="flex gap-3">
        <SubmitButton className="btn-primary" pendingText="Ukládám…">
          {submitLabel}
        </SubmitButton>
        <Link
          href={initial?.id ? `/nemovitost/${initial.id}` : "/prehled"}
          className="btn-secondary"
        >
          Zrušit
        </Link>
      </div>
    </form>
  );
}
