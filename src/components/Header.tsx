"use client";

import Link from "@/components/LocLink";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Logo from "./Logo";
import {
  CartIcon,
  SearchIcon,
  HeartIcon,
  UserIcon,
  ClipboardIcon,
  ChevronDownIcon,
  PhoneIcon,
  MailIcon,
} from "./Icons";
import LanguageSwitcher from "./LanguageSwitcher";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useI18n } from "@/i18n/context";
import { locCategories } from "@/i18n/data";

const BRANCHES = [
  { city: "Znojmo", phone: "515 244 662", tel: "+420515244662", email: "eika@eika.cz" },
  { city: "Brno", phone: "545 233 742", tel: "+420545233742", email: "brno@eika.cz" },
];

export default function Header() {
  const { count } = useCart();
  const { count: favCount } = useFavorites();
  const { t, lang } = useI18n();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const cats = locCategories(lang);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(`${lang === "cs" ? "" : "/" + lang}/katalog?q=${encodeURIComponent(q)}`);
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Main row */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-[72px] flex items-center gap-4 lg:gap-6">
        <Link href="/" aria-label="Eika" className="shrink-0">
          <Logo className="h-[58px]" />
        </Link>

        <form
          onSubmit={submitSearch}
          className="flex flex-1 items-center bg-white rounded-lg border border-[var(--color-border)] focus-within:border-[var(--color-accent)] focus-within:ring-2 focus-within:ring-[var(--color-accent-soft)] transition overflow-hidden"
        >
          <SearchIcon className="w-5 h-5 ml-3.5 text-[var(--color-ink-soft)]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("search.placeholder")}
            className="flex-1 bg-transparent px-3 py-3 text-sm outline-none"
          />
          <button type="submit" className="self-stretch px-5 text-sm font-semibold text-white" style={{ background: "var(--color-accent)" }}>
            {t("search.button")}
          </button>
        </form>

        <div className="flex items-center gap-2 lg:gap-3 shrink-0">
          <Link href="/admin" className="hidden md:flex items-center gap-2 px-1.5 py-1 rounded-lg hover:bg-[var(--color-bg)]">
            <span className="w-8 h-8 rounded-full grid place-items-center bg-[var(--color-bg)] text-[var(--color-ink-soft)]">
              <UserIcon className="w-5 h-5" />
            </span>
            <span className="flex flex-col leading-tight text-left">
              <span className="text-[13px] font-semibold text-[var(--color-ink)]">{t("account.my")}</span>
              <span className="text-[11px] text-[var(--color-ink-soft)]">{t("account.login")}</span>
            </span>
            <ChevronDownIcon className="w-3.5 h-3.5 text-[var(--color-ink-soft)]" />
          </Link>

          <span className="hidden md:block w-px h-7 bg-[var(--color-border)]" />

          <Link href="/admin/objednavky" className="hidden sm:grid place-items-center w-10 h-10 rounded-lg hover:bg-[var(--color-bg)] text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]" aria-label={t("nav.orders")}>
            <ClipboardIcon className="w-[22px] h-[22px]" />
          </Link>

          <Link href="/oblibene" className="relative grid place-items-center w-10 h-10 rounded-lg hover:bg-[var(--color-bg)] text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]" aria-label={t("nav.favorites")}>
            <HeartIcon className="w-[22px] h-[22px]" />
            {favCount > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 grid place-items-center text-[10px] font-bold text-white rounded-full" style={{ background: "var(--color-accent)" }}>{favCount}</span>
            )}
          </Link>

          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          <Link href="/kosik" className="relative grid place-items-center w-10 h-10 rounded-lg hover:bg-[var(--color-bg)] text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]" aria-label={t("footer.cart")}>
            <CartIcon className="w-[22px] h-[22px]" />
            {count > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 grid place-items-center text-[10px] font-bold text-white rounded-full" style={{ background: "var(--color-accent)" }}>{count}</span>
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
      <div className="hidden md:block">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center gap-6 min-h-11 py-2 text-sm">
          {cats.map((c) => (
            <Link key={c.slug} href={`/katalog/${c.slug}`} className="text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]">{c.name}</Link>
          ))}
          <Link href="/sluzby" className="text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]">{t("nav.services")}</Link>
          <Link href="/o-nas" className="text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]">{t("nav.about")}</Link>

          {/* Kontaktní údaje poboček */}
          <div className="ml-auto flex flex-col justify-center gap-1 text-[13px] leading-tight">
            {BRANCHES.map((b) => (
              <div key={b.city} className="flex items-center gap-3">
                <span className="w-14 font-bold text-[var(--color-accent)]">{b.city}</span>
                <a href={`tel:${b.tel}`} className="flex items-center gap-1.5 text-[var(--color-ink)] hover:text-[var(--color-accent)] transition">
                  <PhoneIcon className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                  {b.phone}
                </a>
                <a href={`mailto:${b.email}`} className="flex items-center gap-1.5 text-[var(--color-ink)] hover:text-[var(--color-accent)] transition">
                  <MailIcon className="w-4 h-4 text-[var(--color-accent)]" />
                  {b.email}
                </a>
              </div>
            ))}
          </div>

          <Link
            href="/poptavka"
            className="inline-flex items-center px-3.5 py-1.5 rounded-md font-semibold hover:opacity-90 transition"
            style={{ background: "var(--color-accent)", color: "#ffffff" }}
          >
            {t("nav.inquiry")}
          </Link>
          <Link href="/kontakt" className="text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]">{t("nav.contact")}</Link>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-white px-4 py-4 space-y-3">
          {cats.map((c) => (
            <Link key={c.slug} href={`/katalog/${c.slug}`} onClick={() => setOpen(false)} className="block text-sm">{c.name}</Link>
          ))}
          <Link href="/oblibene" onClick={() => setOpen(false)} className="block text-sm">{t("nav.favorites")} ({favCount})</Link>
          <Link href="/sluzby" onClick={() => setOpen(false)} className="block text-sm">{t("nav.services")}</Link>
          <Link href="/o-nas" onClick={() => setOpen(false)} className="block text-sm">{t("nav.about")}</Link>
          <Link href="/poptavka" onClick={() => setOpen(false)} className="inline-flex items-center px-3.5 py-1.5 rounded-md font-semibold" style={{ background: "var(--color-accent)", color: "#ffffff" }}>{t("nav.inquiry")}</Link>
          <Link href="/kontakt" onClick={() => setOpen(false)} className="block text-sm">{t("nav.contact")}</Link>
          <Link href="/admin" onClick={() => setOpen(false)} className="block text-sm">{t("account.account")}</Link>
          <div className="pt-2"><LanguageSwitcher /></div>
        </div>
      )}
    </header>
  );
}
