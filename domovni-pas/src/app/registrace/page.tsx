"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { AuthShell, AUTH_FIELD } from "@/components/AuthShell";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { signUpEmail, fetchMyRole, type AccountRole } from "@/lib/auth";

export default function RegisterPage() {
  const supa = isSupabaseConfigured();
  const { applyRole } = useStore();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "").trim();
    const password = String(fd.get("password") || "");
    const role = (String(fd.get("role") || "client") as AccountRole) || "client";
    const fullName = String(fd.get("name") || "").trim();

    const { data, error: err } = await signUpEmail(email, password, role, fullName);
    if (err) {
      setError(
        /already|registered|exists/i.test(err.message)
          ? "Účet s tímto e-mailem už existuje."
          : "Registrace se nezdařila. Zkuste to prosím znovu.",
      );
      setBusy(false);
      return;
    }
    if (data.session) {
      const r = await fetchMyRole();
      applyRole(r ?? (role === "architect" ? "ARCHITECT" : "CLIENT"));
      router.push("/prehled");
    } else {
      setInfo("Hotovo! Zkontrolujte e-mail a potvrďte registraci, pak se přihlaste.");
      setBusy(false);
    }
  }

  return (
    <AuthShell>
      <h1 className="text-xl font-semibold">Registrace</h1>
      <p className="mt-1 text-sm text-white/70">Služba pro majitele domů a architekty.</p>

      {!supa ? (
        <p className="mt-4 rounded-lg bg-white/10 px-3 py-2.5 text-sm text-white/80">
          Registrace bude dostupná po zapnutí Supabase (klíče v <code>.env.local</code>). Zatím se
          přihlaste demo heslem.
        </p>
      ) : info ? (
        <p className="mt-4 rounded-lg bg-emerald-500/20 px-3 py-2.5 text-sm text-emerald-50">{info}</p>
      ) : (
        <form onSubmit={submit} className="mt-5 space-y-3">
          <input name="name" placeholder="Jméno (volitelné)" className={AUTH_FIELD} />
          <input name="email" type="email" required placeholder="E-mail" className={AUTH_FIELD} />
          <input
            name="password"
            type="password"
            required
            minLength={6}
            placeholder="Heslo (min. 6 znaků)"
            className={AUTH_FIELD}
          />
          <select name="role" defaultValue="client" className={`${AUTH_FIELD} text-stone-900`}>
            <option value="client">Jsem majitel / klient</option>
            <option value="architect">Jsem architekt</option>
          </select>
          {error && <p className="rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-100">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg bg-brass px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#9c4732] disabled:opacity-50"
          >
            {busy ? "Zakládám účet…" : "Vytvořit účet"}
          </button>
        </form>
      )}

      <p className="mt-4 text-center text-sm text-white/70">
        Máte účet?{" "}
        <Link href="/prihlaseni" className="font-medium text-white underline">
          Přihlásit se
        </Link>
      </p>
    </AuthShell>
  );
}
