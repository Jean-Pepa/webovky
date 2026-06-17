"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { useLang } from "@/lib/i18n";
import { Logo } from "@/components/Logo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function LoginPage() {
  const { login } = useStore();
  const { t } = useLang();
  const router = useRouter();
  const [error, setError] = useState(false);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const ok = login(String(fd.get("password") || ""));
    if (ok) router.push("/prehled");
    else setError(true);
  }

  function quick(pw: string) {
    if (login(pw)) router.push("/prehled");
  }

  const DEMO_ROLES = [
    { pw: "architekt", label: "Architekt" },
    { pw: "klient", label: "Klient / majitel" },
    { pw: "svj", label: "Správce / SVJ" },
    { pw: "vlastnik", label: "Vlastník / rezident" },
  ];

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
      <div className="absolute inset-0 bg-gradient-to-br from-[#2a1d18]/90 via-[#231915]/82 to-[#1b1310]/95" />

      <div className="absolute right-4 top-4 z-10">
        <LanguageSwitcher light />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <Link href="/">
            <Logo light />
          </Link>
        </div>
        <div className="rounded-2xl bg-white/10 p-7 ring-1 ring-white/15 backdrop-blur-md">
          <h1 className="text-xl font-semibold">{t.login.title}</h1>
          <p className="mt-1 text-sm text-white/70">{t.login.sub}</p>
          <form onSubmit={submit} className="mt-5 space-y-3">
            <input
              name="password"
              type="password"
              autoFocus
              required
              placeholder={t.login.placeholder}
              onChange={() => setError(false)}
              className="w-full rounded-lg border border-white/20 bg-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-white/50 outline-none transition focus:border-brass focus:ring-2 focus:ring-brass/30"
            />
            {error && (
              <p className="rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-100">
                {t.login.error}
              </p>
            )}
            <button
              type="submit"
              className="w-full rounded-lg bg-brass px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#9c4732]"
            >
              {t.login.button}
            </button>
          </form>

          <div className="mt-5 border-t border-white/15 pt-4">
            <p className="text-center text-xs text-white/50">Rychlé demo přihlášení</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {DEMO_ROLES.map((d) => (
                <button
                  key={d.pw}
                  type="button"
                  onClick={() => quick(d.pw)}
                  className="rounded-lg border border-white/20 bg-white/5 px-2 py-2 text-xs font-medium text-white/90 transition hover:bg-white/15"
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-white/50">
          <Link href="/" className="hover:text-white/80">
            {t.login.back}
          </Link>
        </p>
      </div>
    </div>
  );
}
