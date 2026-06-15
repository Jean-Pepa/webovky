"use client";

import { useActionState } from "react";
import Link from "next/link";
import { transferProperty } from "@/lib/actions/transfer";
import { SubmitButton } from "@/components/ui/SubmitButton";
import type { FormState } from "@/lib/forms";

export function TransferForm({ propertyId }: { propertyId: string }) {
  const [state, action] = useActionState<FormState, FormData>(transferProperty, {});

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="propertyId" value={propertyId} />

      <div>
        <label className="label" htmlFor="toEmail">
          E-mail nového majitele *
        </label>
        <input
          id="toEmail"
          name="toEmail"
          type="email"
          required
          className="input"
          placeholder="novy.majitel@email.cz"
        />
        <p className="mt-1.5 text-xs text-stone-400">
          Nový majitel musí mít účet v Domovním pasu.
        </p>
      </div>

      <div>
        <label className="label" htmlFor="note">
          Poznámka (volitelné)
        </label>
        <textarea
          id="note"
          name="note"
          className="input"
          placeholder="Např. prodej dle smlouvy ze dne…"
        />
      </div>

      <label className="flex items-start gap-2.5 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
        <input type="checkbox" required className="mt-0.5" />
        Rozumím, že po převodu ztratím přístup k této nemovitosti a celé její historii.
      </label>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}

      <div className="flex gap-3">
        <SubmitButton className="btn-primary" pendingText="Převádím…">
          Převést vlastnictví
        </SubmitButton>
        <Link href={`/nemovitost/${propertyId}`} className="btn-secondary">
          Zrušit
        </Link>
      </div>
    </form>
  );
}
