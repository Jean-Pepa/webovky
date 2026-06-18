"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { useLang } from "@/lib/i18n";
import { AuthShell, AUTH_FIELD } from "@/components/AuthShell";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { signInEmail, fetchMyRole } from "@/lib/auth";

export default function LoginPage() {
  const supa = isSupabaseConfigured();
  const { login, applyRole } = useStore();
  const { t } = useLang();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Demo přihlášení heslem (když Supabase není nastavené)
  function submitDemo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const ok = login(String(fd.get("password") || ""));
    if (ok) router.push("/prehled");
    else setError(t.login.error);
  }

  // Reálné přihlášení přes Supabase
  async function submitSupa(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const { error: err } = await signInEmail(
      String(fd.get("email") || "").trim(),
      String(fd.get("password") || ""),
    );
    if (err) {
      setError("Přihlášení selhalo — zkontrolujte e-mail a heslo.");
      setBusy(false);
      return;
    }
    const role = await fetchMyRole();
    applyRole(role ?? "CLIENT");
    router.push("/prehled");
  }

  return (
    <AuthShell>
      <h1 className="text-xl font-semibold">{t.login.title}</h1>
      <p className="mt-1 text-sm text-white/70">Pas vašeho domu na jednom místě.</p>

      {supa ? (
        <>
          <form onSubmit={submitSupa} className="mt-5 space-y-3">
            <input name="email" type="email" autoFocus required placeholder="E-mail" className={AUTH_FIELD} onChange={() => setError(null)} />
            <input name="password" type="password" required placeholder="Heslo" className={AUTH_FIELD} onChange={() => setError(null)} />
            {error && <p className="rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-100">{error}</p>}
            <button type="submit" disabled={busy} className="w-full rounded-lg bg-brass px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#9c4732] disabled:opacity-50">
              {busy ? "Přihlašuji…" : "Přihlásit se"}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-white/70">
            Nemáte účet?{" "}
            <Link href="/registrace" className="font-medium text-white underline">
              Zaregistrovat se
            </Link>
          </p>
        </>
      ) : (
        <form onSubmit={submitDemo} className="mt-5 space-y-3">
          <input
            name="password"
            type="password"
            autoFocus
            required
            placeholder={t.login.placeholder}
            onChange={() => setError(null)}
            className={AUTH_FIELD}
          />
          {error && <p className="rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-100">{error}</p>}
          <button type="submit" className="w-full rounded-lg bg-brass px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#9c4732]">
            {t.login.button}
          </button>
        </form>
      )}

      <p className="mt-4 text-center text-xs text-white/50">
        <Link href="/" className="hover:text-white/80">
          {t.login.back}
        </Link>
      </p>
    </AuthShell>
  );
}
