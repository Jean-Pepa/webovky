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
  themeOf,
  type HomeContent,
} from "@/lib/homepage";

// Sdílené vlastnosti pro obě témata webu.
type HomeView = {
  t: ReturnType<typeof mergeStrings>;
  lang: Lang;
  changeLang: (l: Lang) => void;
  igUrl: string;
  igHandle: string;
  news: NonNullable<HomeContent["news"]>;
  content: HomeContent | null;
};

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

  const view: HomeView = {
    t: mergeStrings(lang, content?.text?.[lang]),
    lang,
    changeLang,
    igUrl: igUrlOf(content),
    igHandle: igHandleOf(content),
    news: content?.news ?? [],
    content,
  };

  // Téma vybírá správce ve „Správě webu"; každý ročník může mít jiné.
  return themeOf(content) === "normal" ? <NormalHome {...view} /> : <VegasHome {...view} />;
}

// Přepínač jazyka (stejný v obou tématech).
function LangSwitch({ lang, changeLang }: { lang: Lang; changeLang: (l: Lang) => void }) {
  return (
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
  );
}

/* ============================ TÉMA: LAS VEGAS ============================ */
function VegasHome({ t, lang, changeLang, igUrl, igHandle, news, content }: HomeView) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0713] text-white">
      {/* Vegas pozadí — čisté: jemná světla + teplá zlatá záře shora.
          absolute (ne fixed) — fixed + mix-blend-mode dělá v Chromiu chybu vykreslení. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 vegas-stars opacity-40" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(255,180,45,0.12),_transparent_62%)]"
      />

      {/* HERO — Las Vegas Strip. Desktop = foto přes celou plochu; mobil = celý
          obrázek jako banner (aby bylo vidět celé okolí, nic se neořízne). */}
      <section className="relative isolate flex flex-col overflow-hidden bg-[#0b0713] sm:min-h-screen">
        {/* Desktop: foto přes celou plochu (cover) + ztmavení */}
        <Photo
          src={content?.photos?.hero?.trim() || "/photos/vegas-hero.jpg"}
          alt="Mařena — Las Vegas"
          label="Las Vegas Strip v noci"
          className="absolute inset-0 -z-10 hidden h-full w-full sm:block"
        />
        <div className="absolute inset-0 -z-10 hidden bg-gradient-to-r from-black/90 via-black/40 to-black/10 sm:block" />
        <div className="absolute inset-0 -z-10 hidden bg-gradient-to-t from-[#0b0713] via-transparent to-black/50 sm:block" />

        {/* Horní lišta: logo (kačenka + MAŘENA / Las Vegas) + nav */}
        <div className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:py-6">
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/duck.png" alt="" aria-hidden className="h-12 w-12 shrink-0 object-contain sm:h-16 sm:w-16" />
            <div className="leading-none">
              <div className="font-display text-2xl font-extrabold tracking-wide vegas-neon-gold sm:text-3xl">MAŘENA</div>
              <div className="-mt-0.5 font-display text-sm font-semibold italic text-pink-400 [text-shadow:0_0_10px_rgba(255,80,190,0.7)] sm:text-base">Las Vegas</div>
            </div>
          </div>
          <nav className="flex shrink-0 items-center gap-1.5 sm:gap-2 [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]">
            <LangSwitch lang={lang} changeLang={changeLang} />
            <Link href="/prihlaseni" className="rounded-full px-2 py-1.5 text-xs font-medium text-white transition hover:opacity-80 sm:px-3 sm:py-2 sm:text-sm" aria-label={t.organizers}>
              <span className="hidden min-[420px]:inline">{t.organizers}</span>
              <Icon name="users" className="h-5 w-5 min-[420px]:hidden" />
            </Link>
          </nav>
        </div>

        {/* Mobil: celý Vegas obrázek jako banner (na desktopu skryté) */}
        <div className="relative sm:hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={content?.photos?.hero?.trim() || "/photos/vegas-hero.jpg"}
            alt="Mařena — Las Vegas Strip"
            className="aspect-[3/2] w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b0713] via-transparent to-transparent" />
        </div>

        {/* Obsah — na desktopu dole vlevo přes foto, na mobilu pod bannerem */}
        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 items-end px-4 pb-12 pt-8 sm:pb-20 sm:pt-0">
          <div className="max-w-2xl [text-shadow:0_2px_20px_rgba(0,0,0,0.85)]">
            <span className="marquee-sign">🎰 56. ročník</span>
            <h1 className="sr-only">Mařena — Las Vegas, 56. ročník studentského festivalu Fakulty architektury VUT</h1>
            <p className="mt-4 max-w-xl text-lg font-medium text-white sm:text-2xl">{t.heroTagline}</p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff2ea6] to-[#a020f0] px-4 py-1.5 text-sm font-semibold text-white shadow-[0_0_18px_rgba(255,46,166,0.7)] [text-shadow:none]">
              {t.heroBadge}
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-3 [text-shadow:none]">
              <Link
                href="/merch"
                className="merch-pulse vegas-btn inline-flex items-center rounded-full bg-gradient-to-r from-[#ff2ea6] to-[#a020f0] px-7 py-3.5 font-display text-xl font-extrabold text-white ring-2 ring-white/40 hover:from-[#ff49b6] hover:to-[#b53aff] sm:text-2xl"
              >
                {t.merchCta}
              </Link>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3 [text-shadow:none]">
              <a href={igUrl} target="_blank" rel="noreferrer" className="btn-vegas vegas-btn px-6 py-3 text-base">
                <Icon name="instagram" className="h-4 w-4" /> {t.ctaInsta}
              </a>
              <a href="#co-te-ceka" className="rounded-full border border-white/50 bg-black/30 px-6 py-3 text-base font-semibold text-white transition hover:bg-black/50">
                {t.ctaScroll}
              </a>
            </div>
          </div>
        </div>

        {/* Běžící žárovky na spodní hraně hero */}
        <div aria-hidden className="vegas-bulbs absolute inset-x-0 bottom-0" />
      </section>

      {/* CO TĚ ČEKÁ */}
      <section id="co-te-ceka" className="mx-auto max-w-6xl scroll-mt-8 px-4 py-16 md:py-20">
        <div className="max-w-2xl">
          <span className="marquee-sign">{t.whatsKicker}</span>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight vegas-neon-gold">{t.whatsTitle}</h2>
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
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 text-amber-300 ring-1 ring-amber-400/40">
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

      {/* Neonová cedule s kačenkou — téma ročníku beze slov (ať si to každý domyslí).
          Obrázek má černé pozadí = sekce je také černá, takže není potřeba mix-blend
          (fixed/mix-blend spolu dělaly v Chromiu chybu vykreslení). */}
      <section className="relative bg-black py-14 md:py-16">
        <div aria-hidden className="vegas-bulbs absolute inset-x-0 top-0" />
        <div className="mx-auto flex max-w-6xl justify-center px-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/marena-vegas.png" alt="Mařena Las Vegas" className="w-[22rem] max-w-full sm:w-[30rem]" />
        </div>
        <div aria-hidden className="vegas-bulbs absolute inset-x-0 bottom-0" />
      </section>

      {/* MAŘENA BAND */}
      <section className="relative h-[26rem] md:h-[34rem]">
        <Photo src={photoOf(content, "letters")} alt="Nápis MAŘENA před Fakultou architektury VUT" label="MAŘENA před fakultou" className="absolute inset-0 h-full w-full" imgClass="object-bottom" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0713]/85 via-black/30 to-[#0b0713]" />
        <div className="relative mx-auto flex h-full max-w-6xl items-start px-4 pt-8">
          <p className="max-w-2xl font-display text-2xl font-semibold tracking-tight text-white md:text-4xl [text-shadow:0_0_18px_rgba(255,180,40,0.55),0_2px_18px_rgba(0,0,0,0.65)]">
            {t.band}
          </p>
        </div>
      </section>

      {/* JAK TO PROBÍHÁ */}
      <section>
        <div className="mx-auto max-w-6xl px-4 py-16">
          <span className="marquee-sign">Týden</span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight vegas-neon-gold">{t.stepsTitle}</h2>
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
            <span className="marquee-sign">Aktuálně</span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight vegas-neon-gold">{t.newsTitle}</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {news.map((n) => (
                <article key={n.id} className="vegas-card overflow-hidden rounded-3xl">
                  {n.photo && <Photo src={n.photo} alt={n.title} label={`novinka — ${n.title}`} className="aspect-[16/9] w-full" />}
                  <div className="p-5">
                    {n.date && <p className="text-xs font-semibold uppercase tracking-wide vegas-neon-gold">{n.date}</p>}
                    <h3 className="mt-1 font-display text-lg font-semibold text-white">{n.title}</h3>
                    <p className="mt-1 whitespace-pre-line text-sm text-white/70">{n.text}</p>
                    {n.link && (
                      <a href={n.link} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-medium text-amber-300 hover:underline">
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
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white/10 text-white ring-1 ring-amber-300/40 shadow-[0_0_24px_rgba(255,180,40,0.35)]">
            <Icon name="instagram" className="h-9 w-9" />
          </span>
          <span className="marquee-sign">Sleduj</span>
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

/* ============================ TÉMA: NORMÁLNÍ ============================ */
/* Čistý web ve fakultních barvách — jak homepage vypadala před Las Vegas. */
function NormalHome({ t, lang, changeLang, igUrl, igHandle, news, content }: HomeView) {
  return (
    <div className="min-h-screen bg-white">
      {/* NAV */}
      <header className="absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-black/55 via-black/25 to-transparent pb-6">
        <div className="mx-auto flex max-w-6xl flex-nowrap items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-4 sm:py-5 [text-shadow:0_1px_10px_rgba(0,0,0,0.45)]">
          <span className="shrink-0 [&_*]:text-white">
            <Logo light sizeClass="h-8 sm:h-[1.5cm]" />
          </span>
          <nav className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <LangSwitch lang={lang} changeLang={changeLang} />
            <a href={igUrl} target="_blank" rel="noreferrer" className="btn-primary px-2.5 sm:px-5" aria-label="Instagram">
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
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/65 via-black/55 to-black/85" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.45)_0%,_transparent_65%)]" />

        <div className="mx-auto w-full max-w-3xl px-4 pt-24 text-center [text-shadow:0_2px_20px_rgba(0,0,0,0.55)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white">{t.heroKicker}</p>
          <h1 className="mt-3 font-display text-[3.5rem] font-bold leading-[0.95] tracking-[0.08em] sm:text-[6.75rem] sm:tracking-[1.5cm] md:text-[9rem] md:tracking-[4cm] lg:tracking-[6cm]">
            {"MAŘENA".split("").map((ch, i) => (
              <span key={i} className="marena-letter" style={{ animationDelay: `${i * -0.06}s` }}>
                {ch}
              </span>
            ))}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white">{t.heroTagline}</p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-marigold-600 px-4 py-1.5 text-sm font-semibold text-white [text-shadow:none]">
            {t.heroBadge}
          </div>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a href={igUrl} target="_blank" rel="noreferrer" className="btn-primary px-6 py-3 text-base text-white [text-shadow:none]">
              {t.ctaInsta}
            </a>
            <a href="#co-te-ceka" className="rounded-full border border-white/60 bg-black/25 px-6 py-3 text-base font-semibold text-white [text-shadow:none] transition hover:bg-black/40">
              {t.ctaScroll}
            </a>
          </div>

          <div className="mt-9">
            <Link
              href="/merch"
              className="merch-pulse inline-block rounded-full bg-marigold-600 px-8 py-4 font-display text-2xl font-extrabold text-white shadow-2xl ring-2 ring-white/40 [text-shadow:none] hover:bg-marigold-700 sm:text-3xl"
            >
              {t.merchCta}
            </Link>
          </div>
        </div>
      </section>

      {/* CO TĚ ČEKÁ */}
      <section id="co-te-ceka" className="mx-auto max-w-6xl scroll-mt-8 px-4 py-16 md:py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-marigold-700">{t.whatsKicker}</p>
          <h2 className="mt-2 font-display text-4xl font-bold tracking-tight">{t.whatsTitle}</h2>
          <p className="mt-3 text-ink-soft">{t.whatsIntro}</p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {LINEUP_MEDIA.map((m, i) => {
            const item = t.lineup[i];
            return (
              <article key={i} className="group card overflow-hidden">
                <Photo src={lineupPhotoOf(content, i)} alt={item.title} label={`foto — ${item.title}`} className="aspect-[4/3] w-full" />
                <div className="p-5">
                  <h3 className="flex items-center gap-2.5 font-display text-lg font-semibold">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-marigold-50 text-marigold-700">
                      <Icon name={m.icon} className="h-5 w-5" />
                    </span>
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-ink-soft">{item.text}</p>
                </div>
              </article>
            );
          })}
        </div>

        {/* FINÁLE — křest na Flédě */}
        <article className="relative mt-5 overflow-hidden rounded-3xl">
          <Photo src={photoOf(content, "finale")} alt={t.finaleTitle} label="finále — koncert na Flédě" className="h-80 w-full md:h-[28rem]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10" />
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 [text-shadow:0_2px_16px_rgba(0,0,0,0.6)]">
            <span className="inline-flex items-center gap-1 rounded-full bg-marigold-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              {t.finaleBadge}
            </span>
            <h3 className="mt-3 flex items-center gap-3 font-display text-3xl font-bold tracking-tight text-white md:text-5xl">
              <Icon name="star" className="h-8 w-8 md:h-10 md:w-10" /> {t.finaleTitle}
            </h3>
            <p className="mt-2 max-w-2xl text-white/90 md:text-lg">{t.finaleText}</p>
          </div>
        </article>
      </section>

      {/* MAŘENA BAND */}
      <section className="relative h-[26rem] md:h-[34rem]">
        <Photo src={photoOf(content, "letters")} alt="Nápis MAŘENA před Fakultou architektury VUT" label="MAŘENA před fakultou" className="absolute inset-0 h-full w-full" imgClass="object-bottom" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/15 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-6xl items-start px-4 pt-8">
          <p className="max-w-2xl font-display text-2xl font-semibold tracking-tight text-white md:text-4xl [text-shadow:0_2px_18px_rgba(0,0,0,0.65)]">
            {t.band}
          </p>
        </div>
      </section>

      {/* JAK TO PROBÍHÁ */}
      <section className="bg-paper">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="font-display text-3xl font-bold tracking-tight">{t.stepsTitle}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.steps.map((s, i) => (
              <div key={i} className="relative rounded-3xl border border-black/[0.06] bg-white p-5">
                <div className="font-display text-3xl font-bold text-marigold-600">{i + 1}</div>
                <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-ink-soft">{s.day}</p>
                <p className="mt-1 text-[15px]">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NOVINKY */}
      {news.length > 0 && (
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-4 py-8 pb-16">
            <h2 className="font-display text-3xl font-bold tracking-tight">{t.newsTitle}</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {news.map((n) => (
                <article key={n.id} className="card overflow-hidden">
                  {n.photo && <Photo src={n.photo} alt={n.title} label={`novinka — ${n.title}`} className="aspect-[16/9] w-full" />}
                  <div className="p-5">
                    {n.date && <p className="text-xs font-semibold uppercase tracking-wide text-marigold-700">{n.date}</p>}
                    <h3 className="mt-1 font-display text-lg font-semibold">{n.title}</h3>
                    <p className="mt-1 whitespace-pre-line text-sm text-ink-soft">{n.text}</p>
                    {n.link && (
                      <a href={n.link} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-medium text-marigold-700 hover:underline">
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
      <section className="bg-plum-700 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 py-16 text-center md:py-20">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white/10 text-white ring-1 ring-white/15">
            <Icon name="instagram" className="h-9 w-9" />
          </span>
          <h2 className="font-display text-4xl font-bold tracking-tight">{t.instaTitle}</h2>
          <p className="max-w-xl text-white/75">{t.instaText}</p>
          <a href={igUrl} target="_blank" rel="noreferrer" className="btn-primary px-7 py-3.5 text-base">
            <Icon name="instagram" className="h-5 w-5" /> {igHandle}
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-black/10 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-8 text-sm text-ink-soft">
          <Logo />
          <p>{t.footerTagline}</p>
          <div className="flex items-center gap-4">
            <a href={igUrl} target="_blank" rel="noreferrer" className="font-medium text-marigold-700 hover:underline">
              Instagram
            </a>
            <Link href="/prihlaseni" className="hover:text-ink">
              {t.footerOrganizers}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
