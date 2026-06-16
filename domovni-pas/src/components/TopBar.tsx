"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { IconFile } from "@/components/Icons";

export function TopBar() {
  return (
    <header className="no-print sticky top-0 z-20 flex h-14 items-center gap-2 border-b border-stone-200 bg-white/90 px-4 backdrop-blur sm:px-6">
      {/* BULO na horní liště (na desktopu je v postranním panelu) */}
      <Link href="/prehled" className="lg:hidden" aria-label="BULO">
        <Logo />
      </Link>
      <button
        onClick={() => window.dispatchEvent(new Event("bulo-open-docs"))}
        className="btn-secondary btn-sm ml-auto"
        title="Dokumentace projektu"
      >
        <IconFile className="h-4 w-4" />
        <span className="hidden sm:inline">Dokumentace</span>
      </button>
    </header>
  );
}
