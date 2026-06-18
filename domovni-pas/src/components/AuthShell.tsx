"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

// Sdílený vzhled přihlašovacích stránek (video pozadí + karta).
export const AUTH_FIELD =
  "w-full rounded-lg border border-white/20 bg-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-white/50 outline-none transition focus:border-brass focus:ring-2 focus:ring-brass/30";

export function AuthShell({ children }: { children: React.ReactNode }) {
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
        <div className="rounded-2xl bg-white/10 p-7 ring-1 ring-white/15 backdrop-blur-md">{children}</div>
      </div>
    </div>
  );
}
