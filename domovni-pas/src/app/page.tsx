"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLang } from "@/lib/i18n";
import {
  IconArrowRight,
  IconCalendar,
  IconBox,
  IconFile,
  IconShield,
  IconTransfer,
  IconSparkles,
  IconBuilding,
  IconHome,
} from "@/components/Icons";

const FEATURE_ICONS = [IconCalendar, IconBox, IconFile, IconShield, IconTransfer, IconSparkles];
const WHO_ICONS = [IconHome, IconBuilding, IconShield];

export default function HomePage() {
  const { t } = useLang();

  return (
    <div className="bg-[#f5f1e8]">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden text-white">
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
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d2a31]/85 via-[#123c45]/72 to-[#0d2a31]/90" />

        <div className="relative">
          <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
            <Logo light />
            <nav className="hidden items-center gap-8 text-sm font-medium text-white/85 md:flex">
              <a href="#funkce" className="hover:text-white">
                {t.nav.features}
              </a>
              <a href="#jak" className="hover:text-white">
                {t.nav.how}
              </a>
              <a href="#proKoho" className="hover:text-white">
                {t.nav.forWhom}
              </a>
            </nav>
            <div className="flex items-center gap-3">
              <LanguageSwitcher light />
              <Link
                href="/prihlaseni"
                className="rounded-lg bg-brass px-4 py-2 text-sm font-medium text-white transition hover:bg-[#a07a40]"
              >
                {t.nav.enter}
              </Link>
            </div>
          </header>

          <div className="mx-auto max-w-4xl px-6 pb-24 pt-16 text-center sm:pt-24">
            <p className="text-xs font-semibold tracking-[0.3em] text-white/55">{t.hero.label}</p>
            <h1 className="mt-5 text-5xl font-extrabold uppercase leading-[1.02] tracking-tight sm:text-7xl">
              {t.hero.title1}
              <span className="mt-1 block italic text-brass">{t.hero.title2}</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
              {t.hero.subtitle}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/prihlaseni"
                className="inline-flex items-center gap-2 rounded-xl bg-brass px-6 py-3.5 text-base font-medium text-white shadow-lg shadow-black/20 transition hover:bg-[#a07a40]"
              >
                <IconArrowRight className="h-5 w-5" />
                {t.hero.enter}
              </Link>
              <Link
                href="/prihlaseni"
                className="rounded-xl border border-white/30 px-6 py-3.5 text-base font-medium text-white transition hover:bg-white/10"
              >
                {t.hero.architect}
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <div className="inline-flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-2.5 ring-1 ring-white/15 backdrop-blur">
                <span className="flex -space-x-2">
                  {[
                    ["JN", "bg-[#b58b4b]"],
                    ["AK", "bg-[#2d7081]"],
                    ["PS", "bg-[#8a6d3b]"],
                  ].map(([txt, c]) => (
                    <span
                      key={txt}
                      className={`grid h-7 w-7 place-items-center rounded-full text-[10px] font-semibold text-white ring-2 ring-[#16454f] ${c}`}
                    >
                      {txt}
                    </span>
                  ))}
                </span>
                <span className="text-sm text-white/85">{t.hero.chip1}</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 ring-1 ring-white/15 backdrop-blur">
                <span className="text-brass">★★★★★</span>
                <span className="text-sm text-white/85">{t.hero.chip2}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FUNKCE ===== */}
      <section id="funkce" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
            {t.features.heading}
          </h2>
          <p className="mt-3 text-stone-600">{t.features.sub}</p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.features.items.map((it, i) => {
            const Icon = FEATURE_ICONS[i] ?? IconFile;
            return (
              <div key={i} className="card p-6">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-teal-50 text-teal-700">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-stone-900">{it.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-stone-600">{it.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== JAK TO FUNGUJE ===== */}
      <section id="jak" className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
              {t.how.heading}
            </h2>
            <p className="mt-3 text-stone-600">{t.how.sub}</p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {t.how.steps.map((s, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-teal-700 text-lg font-semibold text-white">
                  {i + 1}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-stone-900">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-stone-600">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRO KOHO ===== */}
      <section id="proKoho" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
            {t.who.heading}
          </h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {t.who.items.map((it, i) => {
            const Icon = WHO_ICONS[i] ?? IconHome;
            return (
              <div key={i} className="card p-6">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-amber-50 text-amber-700">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-stone-900">{it.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-stone-600">{it.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="bg-[#184e5a]">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center text-white">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t.cta.title}</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/80">{t.cta.sub}</p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/prihlaseni"
              className="inline-flex items-center gap-2 rounded-xl bg-brass px-6 py-3.5 text-base font-medium text-white shadow-lg shadow-black/20 transition hover:bg-[#a07a40]"
            >
              <IconArrowRight className="h-5 w-5" />
              {t.cta.enter}
            </Link>
            <Link
              href="/prihlaseni"
              className="rounded-xl border border-white/30 px-6 py-3.5 text-base font-medium text-white transition hover:bg-white/10"
            >
              {t.cta.handover}
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-stone-200 bg-[#f5f1e8] py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 text-sm text-stone-400 sm:flex-row">
          <Logo />
          <div className="flex items-center gap-4">
            <Link href="/zasady" className="transition hover:text-stone-600">
              {t.footer.privacy}
            </Link>
            <p>© {new Date().getFullYear()} BULO</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
