"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/(auth)/actions";
import type { AuthState } from "@/lib/forms";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function LoginForm() {
  const [state, action] = useActionState<AuthState, FormData>(loginAction, {});

  return (
    <form action={action} className="space-y-4">
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
          autoComplete="current-password"
          required
          className="input"
          placeholder="••••••••"
        />
      </div>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}

      <SubmitButton className="btn-primary w-full" pendingText="Přihlašuji…">
        Přihlásit se
      </SubmitButton>
    </form>
  );
}
