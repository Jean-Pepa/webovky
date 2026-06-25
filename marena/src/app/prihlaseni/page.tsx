"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Logo } from "@/components/Logo";
import { Mascot } from "@/components/Mascot";

export default function LoginPage() {
  const { login, authed, ready } = useStore();
  const router = useRouter();
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (ready && authed) router.replace("/zazemi");
  }, [ready, authed, router]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const ok = await login(String(fd.get("password") || ""));
    setBusy(false);
    if (ok) router.push("/zazemi");
    else setError(true);
  }

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden px-4">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-plum-700 via-plum-800 to-ink" />
      <div className="paper-grain absolute inset-0 -z-10 opacity-30" />

      <div className="absolute left-4 top-4">
        <Logo light />
      </div>

      <div className="w-full max-w-sm">
        <div className="mb-4 flex justify-center">
          <Mascot size={150} wave />
        </div>
        <div className="rounded-3xl bg-white/10 p-7 text-white ring-1 ring-white/15 backdrop-blur-md">
          <h1 className="font-display text-2xl font-semibold">Vstup do zázemí</h1>
          <form onSubmit={submit} className="mt-5 space-y-3">
            <input
              name="password"
              type="password"
              required
              placeholder="Heslo do zázemí"
              onChange={() => setError(false)}
              className="w-full rounded-xl border border-white/20 bg-white/10 px-3.5 py-2.5 text-base text-white placeholder:text-white/50 outline-none transition focus:border-marigold-300 focus:ring-2 focus:ring-marigold-300/30 sm:text-sm"
              autoFocus
            />
            {error && (
              <p className="rounded-xl bg-red-500/20 px-3 py-2 text-sm text-red-100">
                Špatné heslo. Zkus to znovu.
              </p>
            )}
            <button type="submit" disabled={busy} className="btn-primary w-full">
              {busy ? "Přihlašuji…" : "Vstoupit"}
            </button>
          </form>
        </div>
        <p className="mt-4 text-center text-xs text-white/60">
          <Link href="/" className="hover:text-white">
            ← Zpět na úvod
          </Link>
        </p>
      </div>
    </div>
  );
}
