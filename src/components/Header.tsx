"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Logo from "./Logo";
import { CartIcon, SearchIcon } from "./Icons";
import { useCart } from "@/context/CartContext";
import { CATEGORIES } from "@/data/catalog";

export default function Header() {
  const { count } = useCart();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/katalog?q=${encodeURIComponent(q)}`);
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
      {/* Top utility bar */}
      <div className="bg-[var(--color-steel-900)] text-[var(--color-steel-200)] text-xs">
        <div className="mx-auto max-w-6xl px-4 h-9 flex items-center justify-between">
          <span>Prodej hutního materiálu a železářství od roku 1991</span>
          <span className="hidden sm:flex items-center gap-4">
            <a href="tel:+420545233742" className="hover:text-white">
              Brno: 545&nbsp;233&nbsp;742
            </a>
            <span className="text-[var(--color-steel-600)]">|</span>
            <span className="text-[var(--color-accent-light)]">
              Doprava do 15 km zdarma
            </span>
          </span>
        </div>
      </div>

      {/* Main bar */}
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center gap-4">
        <Link href="/" aria-label="EIKA – domů">
          <Logo />
        </Link>

        <form
          onSubmit={submitSearch}
          className="hidden md:flex flex-1 max-w-md ml-4 items-center bg-[var(--color-bg)] rounded-md border border-[var(--color-border)] focus-within:border-[var(--color-accent)] transition"
        >
          <SearchIcon className="w-5 h-5 ml-3 text-[var(--color-ink-soft)]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Hledat zboží, kód, kategorii…"
            className="flex-1 bg-transparent px-3 py-2 text-sm outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 text-sm font-semibold text-white rounded-r-md"
            style={{ background: "var(--color-accent)" }}
          >
            Hledat
          </button>
        </form>

        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium ml-auto">
          <Link href="/katalog" className="hover:text-[var(--color-accent)]">
            Katalog
          </Link>
          <Link href="/kontakt" className="hover:text-[var(--color-accent)]">
            Kontakt
          </Link>
          <Link href="/admin" className="text-[var(--color-ink-soft)] hover:text-[var(--color-accent)]">
            Admin
          </Link>
        </nav>

        <Link
          href="/kosik"
          className="relative ml-auto lg:ml-0 inline-flex items-center gap-2 px-3 py-2 rounded-md border border-[var(--color-border)] hover:border-[var(--color-accent)] transition"
        >
          <CartIcon className="w-5 h-5" />
          <span className="hidden sm:inline text-sm font-medium">Košík</span>
          {count > 0 && (
            <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 grid place-items-center text-[11px] font-bold text-white rounded-full" style={{ background: "var(--color-accent)" }}>
              {count}
            </span>
          )}
        </Link>

        <button
          onClick={() => setOpen((o) => !o)}
          className="lg:hidden p-2"
          aria-label="Menu"
        >
          <div className="w-6 h-0.5 bg-[var(--color-ink)] mb-1.5" />
          <div className="w-6 h-0.5 bg-[var(--color-ink)] mb-1.5" />
          <div className="w-6 h-0.5 bg-[var(--color-ink)]" />
        </button>
      </div>

      {/* Category strip (desktop) */}
      <div className="hidden lg:block border-t border-[var(--color-border)] bg-[var(--color-bg)]">
        <div className="mx-auto max-w-6xl px-4 flex items-center gap-6 h-11 text-sm">
          <span className="font-semibold text-[var(--color-ink-soft)]">Sortiment:</span>
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/katalog/${c.slug}`}
              className="hover:text-[var(--color-accent)] font-medium"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4 space-y-3">
          <form onSubmit={submitSearch} className="flex items-center bg-[var(--color-bg)] rounded-md border border-[var(--color-border)]">
            <SearchIcon className="w-5 h-5 ml-3 text-[var(--color-ink-soft)]" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Hledat zboží…"
              className="flex-1 bg-transparent px-3 py-2 text-sm outline-none"
            />
          </form>
          <Link href="/katalog" onClick={() => setOpen(false)} className="block font-medium">
            Katalog
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/katalog/${c.slug}`}
              onClick={() => setOpen(false)}
              className="block pl-3 text-[var(--color-ink-soft)]"
            >
              {c.name}
            </Link>
          ))}
          <Link href="/kontakt" onClick={() => setOpen(false)} className="block font-medium">
            Kontakt
          </Link>
          <Link href="/admin" onClick={() => setOpen(false)} className="block font-medium">
            Admin
          </Link>
        </div>
      )}
    </header>
  );
}
