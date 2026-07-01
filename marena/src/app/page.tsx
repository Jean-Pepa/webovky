"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Photo } from "@/components/Photo";
import { Icon } from "@/components/Icons";
import {
  type Lang,
  LANGS,
  LINEUP_MEDIA,
  mergeStrings,
  igUrlOf,
  igHandleOf,
  photoOf,
  lineupPhotoOf,
  loadLocalHomepage,
  type HomeContent,
} from "@/lib/homepage";

export default function Home() {
  const [lang, setLang] = useState<Lang>("cs");
  const [content, setContent] = useState<HomeContent | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("marena_lang");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved === "cs" || saved === "en" || saved === "de") setLang(saved);
  }, []);

  // Přepisy obsahu od správce — ze serveru (Redis), v demu z localStorage.
  useEffect(() => {
    let alive = true;
    fetch("/api/homepage", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { content?: HomeContent | null }) => {
        if (alive) setContent(d.content ?? loadLocalHomepage());
      })
      .catch(() => {
        if (alive) setContent(loadLocalHomepage());
      });
    return () => {
      alive = false;
    };
  }, []);

  function changeLang(l: Lang) {
    setLang(l);
    try {
      localStorage.setItem("marena_lang", l);
    } catch {
      /* ignore */
    }
  }

  const t = mergeStrings(lang, content?.text?.[lang]);
  const igUrl = igUrlOf(content);
  const igHandle = igHandleOf(content);
  const news = content?.news ?? [];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0713] text-white">
      {/* Vegas pozadí — třpytící se světla + neonová záře. */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 vegas-stars" />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(180,0,255,0.22),_transparent_55%),radial-gradient(ellipse_at_bottom,_rgba(255,20,147,0.16),_transparent_55%)]"
      />

      {/* NAV */}
      <header className="absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-black/70 via-black/30 to-transparent pb-6">
        <div className="mx-auto flex max-w-6xl flex-nowrap items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-4 sm:py-5 [text-shadow:0_1px_10px_rgba(0,0,0,0.45)]">
          <span className="shrink-0 [&_*]:text-white">
            <Logo light sizeClass="h-8 sm:h-[1.5cm]" />
          </span>
          <nav className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <div className="flex items-center gap-0.5 rounded-full bg-white/10 p-1 ring-1 ring-white/20">
              <Icon name="globe" className="ml-1 mr-0.5 hidden h-4 w-4 text-white sm:block" />
              {LANGS.map((l) => (
                <button
                  key={l}
                  onClick={() => changeLang(l)}
                  className={`rounded-full px-1.5 py-1 text-xs font-semibold uppercase transition sm:px-2 ${
                    lang === l ? "bg-white text-ink" : "text-white/80 hover:text-white"
                  }`}
                  aria-label={l === "cs" ? "Čeština" : l === "en" ? "English" : "Deutsch"}
                >
                  {l === "cs" ? "CZ" : l}
                </button>
              ))}
            </div>
            <a href={igUrl} target="_blank" rel="noreferrer" className="btn-vegas vegas-btn px-2.5 sm:px-5" aria-label="Instagram">
              <Icon name="instagram" className="h-4 w-4" /> <span className="hidden sm:inline">Instagram</span>
            </a>
            <Link href="/prihlaseni" className="rounded-full px-2 py-1.5 text-xs font-medium text-white transition hover:opacity-80 sm:px-3 sm:py-2 sm:text-sm" aria-label={t.organizers}>
              <span className="hidden min-[360px]:inline">{t.organizers}</span>
              <Icon name="users" className="h-5 w-5 min-[360px]:hidden" />
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative isolate flex min-h-[90vh] items-center justify-center overflow-hidden">
        <Photo src={photoOf(content, "hero")} alt="Mařena — průvod městem" label="hero foto — průvod / dvůr Mařeny" className="absolute inset-0 -z-10 h-full w-full" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#12001f]/80 via-black/60 to-[#0b0713]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.35)_0%,_transparent_60%)]" />

        <div className="mx-auto w-full max-w-3xl px-4 pt-24 text-center [text-shadow:0_2px_20px_rgba(0,0,0,0.55)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] vegas-neon-cyan">{t.heroKicker}</p>
          <h1 className="vegas-gold-title mt-3 font-display text-[3.5rem] font-bold leading-[0.95] tracking-[0.08em] text-white sm:text-[6.75rem] sm:tracking-[1.5cm] md:text-[9rem] md:tracking-[4cm] lg:tracking-[6cm]">
            {"MAŘENA".split("").map((ch, i) => (
              <span key={i} className="marena-letter" style={{ animationDelay: `${i * -0.06}s` }}>
                {ch}
              </span>
            ))}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/90">{t.heroTagline}</p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff2ea6] to-[#a020f0] px-4 py-1.5 text-sm font-semibold text-white shadow-[0_0_18px_rgba(255,46,166,0.7)] [text-shadow:none]">
            {t.heroBadge}
          </div>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a href={igUrl} target="_blank" rel="noreferrer" className="btn-vegas vegas-btn px-6 py-3 text-base text-white [text-shadow:none]">
              {t.ctaInsta}
            </a>
            <a href="#co-te-ceka" className="rounded-full border border-cyan-300/60 bg-black/25 px-6 py-3 text-base font-semibold text-white shadow-[0_0_16px_rgba(79,240,255,0.4)] [text-shadow:none] transition hover:bg-black/40">
              {t.ctaScroll}
            </a>
          </div>

          <div className="mt-9">
            <Link
              href="/merch"
              className="merch-pulse vegas-btn inline-block rounded-full bg-gradient-to-r from-[#ff2ea6] to-[#a020f0] px-8 py-4 font-display text-2xl font-extrabold text-white ring-2 ring-white/40 [text-shadow:none] hover:from-[#ff49b6] hover:to-[#b53aff] sm:text-3xl"
            >
              {t.merchCta}
            </Link>
          </div>
        </div>

        {/* Běžící žárovky na spodní hraně hero (marquee jako nad kasinem) */}
        <div aria-hidden className="vegas-bulbs absolute inset-x-0 bottom-0" />
      </section>

      {/* CO TĚ ČEKÁ */}
      <section id="co-te-ceka" className="mx-auto max-w-6xl scroll-mt-8 px-4 py-16 md:py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide vegas-neon-cyan">{t.whatsKicker}</p>
          <h2 className="mt-2 font-display text-4xl font-bold tracking-tight vegas-neon-pink">{t.whatsTitle}</h2>
          <p className="mt-3 text-white/70">{t.whatsIntro}</p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {LINEUP_MEDIA.map((m, i) => {
            const item = t.lineup[i];
            return (
              <article key={i} className="vegas-card group overflow-hidden rounded-3xl">
                <Photo src={lineupPhotoOf(content, i)} alt={item.title} label={`foto — ${item.title}`} className="aspect-[4/3] w-full" />
                <div className="p-5">
                  <h3 className="flex items-center gap-2.5 font-display text-lg font-semibold text-white">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 text-fuchsia-300 ring-1 ring-fuchsia-400/40">
                      <Icon name={m.icon} className="h-5 w-5" />
                    </span>
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-white/65">{item.text}</p>
                </div>
              </article>
            );
          })}
        </div>

        {/* FINÁLE — křest na Flédě */}
        <article className="relative mt-5 overflow-hidden rounded-3xl ring-1 ring-marigold-400/30">
          <Photo src={photoOf(content, "finale")} alt={t.finaleTitle} label="finále — koncert na Flédě" className="h-80 w-full md:h-[28rem]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10" />
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 [text-shadow:0_2px_16px_rgba(0,0,0,0.6)]">
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#ff2ea6] to-[#a020f0] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-[0_0_14px_rgba(255,46,166,0.7)]">
              {t.finaleBadge}
            </span>
            <h3 className="mt-3 flex items-center gap-3 font-display text-3xl font-bold tracking-tight vegas-neon-gold md:text-5xl">
              <Icon name="star" className="h-8 w-8 md:h-10 md:w-10" /> {t.finaleTitle}
            </h3>
            <p className="mt-2 max-w-2xl text-white/90 md:text-lg">{t.finaleText}</p>
          </div>
        </article>
      </section>

      {/* MAŘENA BAND */}
      <section className="relative h-[26rem] md:h-[34rem]">
        <Photo src={photoOf(content, "letters")} alt="Nápis MAŘENA před Fakultou architektury VUT" label="MAŘENA před fakultou" className="absolute inset-0 h-full w-full" imgClass="object-bottom" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0713]/85 via-black/30 to-[#0b0713]" />
        <div className="relative mx-auto flex h-full max-w-6xl items-start px-4 pt-8">
          <p className="max-w-2xl font-display text-2xl font-semibold tracking-tight text-white md:text-4xl [text-shadow:0_0_18px_rgba(255,92,198,0.6),0_2px_18px_rgba(0,0,0,0.65)]">
            {t.band}
          </p>
        </div>
      </section>

      {/* JAK TO PROBÍHÁ */}
      <section>
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="font-display text-3xl font-bold tracking-tight vegas-neon-cyan">{t.stepsTitle}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.steps.map((s, i) => (
              <div key={i} className="vegas-card relative rounded-3xl p-5">
                <div className="font-display text-3xl font-bold vegas-neon-gold">{i + 1}</div>
                <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-white/55">{s.day}</p>
                <p className="mt-1 text-[15px] text-white/90">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NOVINKY */}
      {news.length > 0 && (
        <section>
          <div className="mx-auto max-w-6xl px-4 py-8 pb-16">
            <h2 className="font-display text-3xl font-bold tracking-tight vegas-neon-pink">{t.newsTitle}</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {news.map((n) => (
                <article key={n.id} className="vegas-card overflow-hidden rounded-3xl">
                  {n.photo && <Photo src={n.photo} alt={n.title} label={`novinka — ${n.title}`} className="aspect-[16/9] w-full" />}
                  <div className="p-5">
                    {n.date && <p className="text-xs font-semibold uppercase tracking-wide vegas-neon-gold">{n.date}</p>}
                    <h3 className="mt-1 font-display text-lg font-semibold text-white">{n.title}</h3>
                    <p className="mt-1 whitespace-pre-line text-sm text-white/70">{n.text}</p>
                    {n.link && (
                      <a href={n.link} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-medium text-cyan-300 hover:underline">
                        Více →
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* INSTAGRAM CTA */}
      <section className="relative bg-gradient-to-b from-[#1a0b2e] to-[#0b0713]">
        <div aria-hidden className="vegas-bulbs absolute inset-x-0 top-0" />
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 py-16 text-center md:py-20">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white/10 text-white ring-1 ring-pink-400/40 shadow-[0_0_24px_rgba(255,92,198,0.4)]">
            <Icon name="instagram" className="h-9 w-9" />
          </span>
          <h2 className="font-display text-4xl font-bold tracking-tight vegas-neon-gold">{t.instaTitle}</h2>
          <p className="max-w-xl text-white/75">{t.instaText}</p>
          <a href={igUrl} target="_blank" rel="noreferrer" className="btn-vegas vegas-btn px-7 py-3.5 text-base">
            <Icon name="instagram" className="h-5 w-5" /> {igHandle}
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#0b0713]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-8 text-sm text-white/60">
          <span className="[&_*]:text-white">
            <Logo light />
          </span>
          <p>{t.footerTagline}</p>
          <div className="flex items-center gap-4">
            <a href={igUrl} target="_blank" rel="noreferrer" className="font-medium text-pink-300 hover:underline">
              Instagram
            </a>
            <Link href="/prihlaseni" className="hover:text-white">
              {t.footerOrganizers}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
