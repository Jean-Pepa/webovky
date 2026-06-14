"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Logo from "./Logo";
import { CartIcon, SearchIcon, HeartIcon } from "./Icons";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { CATEGORIES } from "@/data/catalog";

export default function Header() {
  const { count } = useCart();
  const { count: favCount } = useFavorites();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/katalog?q=${encodeURIComponent(q)}`);
    setOpen(false);
    setSearchOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[var(--color-border)]/70">
      <div className="mx-auto max-w-5xl px-5 h-12 flex items-center gap-6">
        <Link href="/" aria-label="Eika – domů" className="shrink-0">
          <Logo className="h-7" />
        </Link>

        {/* Center nav links */}
        <nav className="hidden md:flex items-center gap-7 text-[13px] text-[var(--color-ink-soft)] flex-1 justify-center">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={`/katalog/${c.slug}`} className="hover:text-[var(--color-ink)] transition">
              {c.name}
            </Link>
          ))}
          <Link href="/katalog" className="hover:text-[var(--color-ink)] transition">Katalog</Link>
          <Link href="/kontakt" className="hover:text-[var(--color-ink)] transition">Kontakt</Link>
        </nav>

        {/* Right icons */}
        <div className="flex items-center gap-1 ml-auto md:ml-0">
          <button
            onClick={() => setSearchOpen((s) => !s)}
            className="grid place-items-center w-9 h-9 rounded-full hover:bg-[var(--color-bg)] text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
            aria-label="Hledat"
          >
            <SearchIcon className="w-[18px] h-[18px]" />
          </button>

          <Link href="/oblibene" className="relative grid place-items-center w-9 h-9 rounded-full hover:bg-[var(--color-bg)] text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]" aria-label="Oblíbené">
            <HeartIcon className="w-[18px] h-[18px]" />
            {favCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[15px] h-[15px] px-1 grid place-items-center text-[9px] font-semibold text-white rounded-full" style={{ background: "var(--color-accent)" }}>
                {favCount}
              </span>
            )}
          </Link>

          <Link href="/kosik" className="relative grid place-items-center w-9 h-9 rounded-full hover:bg-[var(--color-bg)] text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]" aria-label="Košík">
            <CartIcon className="w-[18px] h-[18px]" />
            {count > 0 && (
              <span className="absolute top-1 right-1 min-w-[15px] h-[15px] px-1 grid place-items-center text-[9px] font-semibold text-white rounded-full" style={{ background: "var(--color-accent)" }}>
                {count}
              </span>
            )}
          </Link>

          <button onClick={() => setOpen((o) => !o)} className="md:hidden grid place-items-center w-9 h-9" aria-label="Menu">
            <div className="w-5 h-0.5 bg-[var(--color-ink)] mb-1" />
            <div className="w-5 h-0.5 bg-[var(--color-ink)]" />
          </button>
        </div>
      </div>

      {/* Search dropdown */}
      {searchOpen && (
        <div className="border-t border-[var(--color-border)]/70 bg-white/95 backdrop-blur-xl">
          <form onSubmit={submitSearch} className="mx-auto max-w-3xl px-5 py-4 flex items-center gap-3">
            <SearchIcon className="w-5 h-5 text-[var(--color-ink-soft)]" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Hledat v sortimentu Eika"
              className="flex-1 bg-transparent text-lg outline-none placeholder:text-[var(--color-ink-soft)]"
            />
            <button type="button" onClick={() => setSearchOpen(false)} className="text-sm text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]">Zavřít</button>
          </form>
        </div>
      )}

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[var(--color-border)]/70 bg-white px-5 py-4 space-y-3">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={`/katalog/${c.slug}`} onClick={() => setOpen(false)} className="block text-sm">
              {c.name}
            </Link>
          ))}
          <Link href="/katalog" onClick={() => setOpen(false)} className="block text-sm">Katalog</Link>
          <Link href="/oblibene" onClick={() => setOpen(false)} className="block text-sm">Oblíbené ({favCount})</Link>
          <Link href="/kontakt" onClick={() => setOpen(false)} className="block text-sm">Kontakt</Link>
        </div>
      )}
    </header>
  );
}
