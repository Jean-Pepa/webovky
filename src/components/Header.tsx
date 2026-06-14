"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Logo from "./Logo";
import { CartIcon, SearchIcon, HeartIcon, UserIcon } from "./Icons";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { CATEGORIES } from "@/data/catalog";
import { formatCZK } from "@/lib/format";

export default function Header() {
  const { count, total } = useCart();
  const { count: favCount } = useFavorites();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/katalog?q=${encodeURIComponent(q)}`);
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Main row */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-[68px] flex items-center gap-4">
        <Link href="/" aria-label="Eika – domů" className="shrink-0">
          <Logo className="h-9" />
        </Link>

        {/* Search */}
        <form
          onSubmit={submitSearch}
          className="flex flex-1 items-center bg-white rounded-full border-2 border-[var(--color-ink)] overflow-hidden"
        >
          <SearchIcon className="w-5 h-5 ml-4 text-[var(--color-ink-soft)]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Hledat v sortimentu Eika…"
            className="flex-1 bg-transparent px-3 py-2.5 text-sm outline-none"
          />
          <button
            type="submit"
            className="m-1 px-5 py-2 rounded-full text-sm font-semibold text-white"
            style={{ background: "var(--color-accent)" }}
          >
            Hledat
          </button>
        </form>

        {/* Right actions */}
        <div className="flex items-center gap-1 shrink-0">
          <Link href="/admin" className="hidden sm:flex flex-col items-center px-2 py-1 rounded-lg hover:bg-[var(--color-bg)] text-[var(--color-ink-soft)]" aria-label="Účet">
            <UserIcon className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Účet</span>
          </Link>
          <Link href="/oblibene" className="relative hidden sm:flex flex-col items-center px-2 py-1 rounded-lg hover:bg-[var(--color-bg)] text-[var(--color-ink-soft)]" aria-label="Oblíbené">
            <HeartIcon className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Oblíbené</span>
            {favCount > 0 && (
              <span className="absolute top-0 right-1 min-w-[15px] h-[15px] px-1 grid place-items-center text-[9px] font-bold text-white rounded-full" style={{ background: "var(--color-accent)" }}>
                {favCount}
              </span>
            )}
          </Link>
          <Link href="/kosik" className="relative flex flex-col items-center px-2 py-1 rounded-lg hover:bg-[var(--color-bg)] text-[var(--color-ink-soft)]" aria-label="Košík">
            <CartIcon className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">{formatCZK(total)}</span>
            {count > 0 && (
              <span className="absolute top-0 right-1 min-w-[15px] h-[15px] px-1 grid place-items-center text-[9px] font-bold text-white rounded-full" style={{ background: "var(--color-accent)" }}>
                {count}
              </span>
            )}
          </Link>
          <button onClick={() => setOpen((o) => !o)} className="md:hidden grid place-items-center w-9 h-9 ml-1" aria-label="Menu">
            <div className="w-5 h-0.5 bg-[var(--color-ink)] mb-1" />
            <div className="w-5 h-0.5 bg-[var(--color-ink)] mb-1" />
            <div className="w-5 h-0.5 bg-[var(--color-ink)]" />
          </button>
        </div>
      </div>

      {/* Category bar */}
      <div className="hidden md:block border-t border-[var(--color-border)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center gap-6 h-11 text-sm">
          <Link href="/katalog" className="font-semibold text-[var(--color-accent)]">Cenové hity</Link>
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={`/katalog/${c.slug}`} className="text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]">
              {c.name}
            </Link>
          ))}
          <Link href="/kontakt" className="text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] ml-auto">Kontakt</Link>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-white px-4 py-4 space-y-3">
          <Link href="/katalog" onClick={() => setOpen(false)} className="block font-semibold text-[var(--color-accent)]">Cenové hity</Link>
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={`/katalog/${c.slug}`} onClick={() => setOpen(false)} className="block text-sm">{c.name}</Link>
          ))}
          <Link href="/oblibene" onClick={() => setOpen(false)} className="block text-sm">Oblíbené ({favCount})</Link>
          <Link href="/kontakt" onClick={() => setOpen(false)} className="block text-sm">Kontakt</Link>
          <Link href="/admin" onClick={() => setOpen(false)} className="block text-sm">Účet / admin</Link>
        </div>
      )}
    </header>
  );
}
