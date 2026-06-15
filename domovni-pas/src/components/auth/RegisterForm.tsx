"use client";

import { useActionState } from "react";
import { registerAction } from "@/app/(auth)/actions";
import type { AuthState } from "@/lib/forms";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function RegisterForm() {
  const [state, action] = useActionState<AuthState, FormData>(registerAction, {});

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="label" htmlFor="name">
          Jméno / název
        </label>
        <input id="name" name="name" required className="input" placeholder="Jana Nováková" />
      </div>
      <div>
        <label className="label" htmlFor="email">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="input"
          placeholder="vas@email.cz"
        />
      </div>
      <div>
        <label className="label" htmlFor="password">
          Heslo
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          className="input"
          placeholder="alespoň 6 znaků"
        />
      </div>

      <fieldset>
        <legend className="label">Typ účtu</legend>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-stone-300 p-3 text-sm has-[:checked]:border-teal-600 has-[:checked]:bg-teal-50/50">
            <input type="radio" name="role" value="OWNER" defaultChecked className="mt-0.5" />
            <span>
              <span className="block font-medium text-stone-800">Majitel</span>
              <span className="text-xs text-stone-500">Vlastním nemovitost</span>
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-stone-300 p-3 text-sm has-[:checked]:border-teal-600 has-[:checked]:bg-teal-50/50">
            <input type="radio" name="role" value="PROFESSIONAL" className="mt-0.5" />
            <span>
              <span className="block font-medium text-stone-800">Odborník</span>
              <span className="text-xs text-stone-500">Architekt / stavební firma</span>
            </span>
          </label>
        </div>
      </fieldset>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}

      <SubmitButton className="btn-primary w-full" pendingText="Vytvářím účet…">
        Vytvořit účet
      </SubmitButton>
    </form>
  );
}
