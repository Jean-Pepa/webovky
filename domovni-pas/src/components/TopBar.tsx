"use client";

import { IconFile } from "@/components/Icons";

export function TopBar() {
  return (
    <header className="no-print sticky top-0 z-20 flex h-14 items-center justify-end gap-2 border-b border-stone-200 bg-white/90 px-4 backdrop-blur sm:px-6">
      <button
        onClick={() => window.dispatchEvent(new Event("bulo-open-docs"))}
        className="btn-secondary btn-sm"
        title="Dokumentace projektu"
      >
        <IconFile className="h-4 w-4" />
        <span className="hidden sm:inline">Dokumentace</span>
      </button>
    </header>
  );
}
