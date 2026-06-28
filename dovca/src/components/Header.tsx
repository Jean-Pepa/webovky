"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";

// Horní lišta — název appky, demo odznak, moje jméno + odhlášení.
export function Header() {
  const { me, configured, setMe, logout } = useStore();

  return (
    <header className="sticky top-0 z-30 border-b border-black/[0.06] bg-paper/85 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-2xl hero-sky text-lg">🏖️</span>
          <span className="font-display text-lg font-semibold">Dovča</span>
        </Link>
        {!configured && (
          <span className="chip bg-maybe-soft text-[11px] text-maybe" title="Data jen v tomhle prohlížeči">
            demo
          </span>
        )}
        <div className="ml-auto flex items-center gap-1">
          {me && (
            <button
              className="btn-ghost px-3 py-1.5 text-xs"
              onClick={() => {
                const n = prompt("Změnit jméno:", me);
                if (n && n.trim()) setMe(n.trim());
              }}
              title="Změnit jméno"
            >
              👤 {me}
            </button>
          )}
          <button className="btn-ghost px-3 py-1.5 text-xs" onClick={() => logout()}>
            Odhlásit
          </button>
        </div>
      </div>
    </header>
  );
}
