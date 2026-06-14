"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Logo from "./Logo";
import {
  CartIcon,
  SearchIcon,
  HeartIcon,
  UserIcon,
  ChevronDownIcon,
} from "./Icons";
import { CategoryIcon } from "./Icons";
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
  const [megaOpen, setMegaOpen] = useState(false);

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
            <Link href="/kontakt" className="hover:text-white">Pobočky</Link>
            <span className="text-[var(--color-steel-600)]">|</span>
            <span className="text-[var(--color-accent-light)]">Doprava do 15 km zdarma</span>
          </span>
        </div>
      </div>

      {/* Main bar */}
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center gap-3">
        <Link href="/" aria-label="EIKA – domů">
          <Logo />
        </Link>

        {/* Catalog mega-menu trigger */}
        <div
          className="hidden lg:block relative"
          onMouseEnter={() => setMegaOpen(true)}
          onMouseLeave={() => setMegaOpen(false)}
        >
          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md text-white font-semibold text-sm" style={{ background: "var(--color-accent)" }}>
            <span className="flex flex-col gap-[3px]">
              <span className="w-4 h-0.5 bg-white" />
              <span className="w-4 h-0.5 bg-white" />
              <span className="w-4 h-0.5 bg-white" />
            </span>
            Katalog
            <ChevronDownIcon className="w-4 h-4" />
          </button>

          {megaOpen && (
            <div className="absolute left-0 top-full pt-2 w-[640px]">
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-2xl p-4 grid grid-cols-3 gap-3">
                {CATEGORIES.map((c) => (
                  <div key={c.slug}>
                    <Link
                      href={`/katalog/${c.slug}`}
                      className="flex items-center gap-2 font-bold mb-2 hover:text-[var(--color-accent)]"
                    >
                      <span className="w-8 h-8 rounded-md grid place-items-center text-white" style={{ background: "var(--color-steel-800)" }}>
                        <CategoryIcon icon={c.icon} className="w-4 h-4" />
                      </span>
                      {c.name}
                    </Link>
                    <ul className="space-y-1">
                      {c.subcategories.map((s) => (
                        <li key={s}>
                          <Link
                            href={`/katalog/${c.slug}`}
                            className="text-sm text-[var(--color-ink-soft)] hover:text-[var(--color-accent)] block leading-snug"
                          >
                            {s}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Search */}
        <form
          onSubmit={submitSearch}
          className="hidden md:flex flex-1 items-center bg-[var(--color-bg)] rounded-md border border-[var(--color-border)] focus-within:border-[var(--color-accent)] transition"
        >
          <SearchIcon className="w-5 h-5 ml-3 text-[var(--color-ink-soft)]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Co hledáte? Např. jekl, vrut, sloupek…"
            className="flex-1 bg-transparent px-3 py-2.5 text-sm outline-none"
          />
          <button type="submit" className="px-4 py-2.5 text-sm font-semibold text-white rounded-r-md" style={{ background: "var(--color-accent)" }}>
            Hledat
          </button>
        </form>

        {/* Right actions */}
        <div className="flex items-center gap-1 ml-auto md:ml-0">
          <Link href="/oblibene" className="relative hidden sm:grid place-items-center w-10 h-10 rounded-md hover:bg-[var(--color-bg)]" aria-label="Oblíbené">
            <HeartIcon className="w-5 h-5" />
            {favCount > 0 && (
              <span className="absolute top-1 right-1 min-w-4 h-4 px-1 grid place-items-center text-[10px] font-bold text-white rounded-full" style={{ background: "var(--color-accent)" }}>
                {favCount}
              </span>
            )}
          </Link>

          <Link href="/admin" className="hidden sm:grid place-items-center w-10 h-10 rounded-md hover:bg-[var(--color-bg)]" aria-label="Účet / admin">
            <UserIcon className="w-5 h-5" />
          </Link>

          <Link
            href="/kosik"
            className="relative inline-flex items-center gap-2 pl-3 pr-3 h-10 rounded-md border border-[var(--color-border)] hover:border-[var(--color-accent)] transition"
          >
            <div className="relative">
              <CartIcon className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 grid place-items-center text-[10px] font-bold text-white rounded-full" style={{ background: "var(--color-accent)" }}>
                  {count}
                </span>
              )}
            </div>
            <span className="hidden lg:flex flex-col leading-tight">
              <span className="text-[11px] text-[var(--color-ink-soft)]">Košík</span>
              <span className="text-sm font-bold">{formatCZK(total)}</span>
            </span>
          </Link>

          <button onClick={() => setOpen((o) => !o)} className="lg:hidden p-2 ml-1" aria-label="Menu">
            <div className="w-6 h-0.5 bg-[var(--color-ink)] mb-1.5" />
            <div className="w-6 h-0.5 bg-[var(--color-ink)] mb-1.5" />
            <div className="w-6 h-0.5 bg-[var(--color-ink)]" />
          </button>
        </div>
      </div>

      {/* Category strip (desktop) */}
      <div className="hidden lg:block border-t border-[var(--color-border)] bg-[var(--color-bg)]">
        <div className="mx-auto max-w-6xl px-4 flex items-center gap-6 h-11 text-sm">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={`/katalog/${c.slug}`} className="hover:text-[var(--color-accent)] font-medium">
              {c.name}
            </Link>
          ))}
          <Link href="/katalog?q=" className="text-[var(--color-accent)] font-semibold ml-auto">
            Akční zboží →
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4 space-y-3">
          <form onSubmit={submitSearch} className="flex items-center bg-[var(--color-bg)] rounded-md border border-[var(--color-border)]">
            <SearchIcon className="w-5 h-5 ml-3 text-[var(--color-ink-soft)]" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Hledat zboží…" className="flex-1 bg-transparent px-3 py-2 text-sm outline-none" />
          </form>
          <Link href="/katalog" onClick={() => setOpen(false)} className="block font-medium">Katalog</Link>
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={`/katalog/${c.slug}`} onClick={() => setOpen(false)} className="block pl-3 text-[var(--color-ink-soft)]">
              {c.name}
            </Link>
          ))}
          <Link href="/oblibene" onClick={() => setOpen(false)} className="block font-medium">Oblíbené ({favCount})</Link>
          <Link href="/kontakt" onClick={() => setOpen(false)} className="block font-medium">Kontakt</Link>
          <Link href="/admin" onClick={() => setOpen(false)} className="block font-medium">Admin</Link>
        </div>
      )}
    </header>
  );
}
