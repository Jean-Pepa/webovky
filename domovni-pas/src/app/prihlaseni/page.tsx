"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Logo } from "@/components/Logo";

export default function LoginPage() {
  const { login } = useStore();
  const router = useRouter();
  const [error, setError] = useState(false);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const ok = login(String(fd.get("password") || ""));
    if (ok) router.push("/prehled");
    else setError(true);
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 text-white">
      <video
        autoPlay
        muted
        loop
        playsInline
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d2a31]/90 via-[#123c45]/80 to-[#0d2a31]/95" />

      <div className="relative w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <Link href="/">
            <Logo light />
          </Link>
        </div>
        <div className="rounded-2xl bg-white/10 p-7 ring-1 ring-white/15 backdrop-blur-md">
          <h1 className="text-xl font-semibold">Přihlášení</h1>
          <p className="mt-1 text-sm text-white/70">Zadejte heslo pro vstup do BULO.</p>
          <form onSubmit={submit} className="mt-5 space-y-3">
            <input
              name="password"
              type="password"
              autoFocus
              required
              placeholder="Heslo"
              onChange={() => setError(false)}
              className="w-full rounded-lg border border-white/20 bg-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-white/50 outline-none transition focus:border-brass focus:ring-2 focus:ring-brass/30"
            />
            {error && (
              <p className="rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-100">
                Nesprávné heslo.
              </p>
            )}
            <button
              type="submit"
              className="w-full rounded-lg bg-brass px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#a07a40]"
            >
              Přihlásit se
            </button>
          </form>
        </div>
        <p className="mt-4 text-center text-xs text-white/50">
          <Link href="/" className="hover:text-white/80">
            ← Zpět na úvod
          </Link>
        </p>
      </div>
    </div>
  );
}
