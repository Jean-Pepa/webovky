"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Photo } from "@/components/Photo";
import { Icon, type IconName } from "@/components/Icons";

// ⬇️ Až budete mít účet, stačí změnit tenhle jeden řádek na svůj Instagram.
const IG_URL = "https://www.instagram.com/marena2k25";
const IG_HANDLE = "@marena2k25";

type Lang = "cs" | "en" | "de";
const LANGS: Lang[] = ["cs", "en", "de"];

// Fotky a ikonky jsou stejné pro všechny jazyky; texty se berou z překladů.
const LINEUP_MEDIA: { photo: string; icon: IconName }[] = [
  { photo: "/photos/prednasky.jpg", icon: "lecture" },
  { photo: "/photos/obedy.jpg", icon: "food" },
  { photo: "/photos/bar.jpg", icon: "beer" },
  { photo: "/photos/party.jpg", icon: "music" },
  { photo: "/photos/vyzdoba.jpg", icon: "palette" },
  { photo: "/photos/pruvod.jpg", icon: "flag" },
];

interface Strings {
  organizers: string;
  heroKicker: string;
  heroTagline: string;
  heroBadge: string;
  ctaInsta: string;
  ctaScroll: string;
  merchCta: string;
  whatsKicker: string;
  whatsTitle: string;
  whatsIntro: string;
  lineup: { title: string; text: string }[];
  finaleBadge: string;
  finaleTitle: string;
  finaleText: string;
  band: string;
  stepsTitle: string;
  steps: { day: string; text: string }[];
  instaTitle: string;
  instaText: string;
  footerTagline: string;
  footerOrganizers: string;
}

const STRINGS: Record<Lang, Strings> = {
  cs: {
    organizers: "Organizátoři",
    heroKicker: "Fakulta architektury VUT · studentský festival",
    heroTagline:
      "Týden, na který do konce školy nezapomeneš. Přednášky, bar na dvoře, party večery, velký průvod městem a křest prváků na Flédě.",
    heroBadge: "🐣 Jsi prvák? Tohle je tvůj vstup do života na fakultě.",
    ctaInsta: "Sleduj nás na Instagramu →",
    ctaScroll: "Co tě čeká ↓",
    merchCta: "🛍️ Kup si merch Mařeny →",
    whatsKicker: "Na co se těšit",
    whatsTitle: "Co tě na Mařeně čeká",
    whatsIntro:
      "Mařena je týdenní (cca 7–10 dní) festival na přelomu září a října. Celá fakulta ožije — a ty jsi u toho. Tady je, na co se můžeš těšit:",
    lineup: [
      { title: "Přednášky", text: "Špičkoví hosté z architektury a designu — i ze zahraničí. Inspirace, jakou v rozvrhu nenajdeš." },
      { title: "Obědy na dvoře", text: "Každý den teplý oběd (a ráno snídaně) přímo na dvoře fakulty. Najíš se a potkáš všechny." },
      { title: "Bar na dvoře", text: "Srdce festivalu. Pivo, limo, drinky a parta — celý den i večer na jednom místě." },
      { title: "Party večery", text: "Kapely a DJs na dvoře a v Arše. Hraje se, dokud noční klid dovolí (a pak ještě chvíli)." },
      { title: "Vyzdobená škola", text: "Celá fakulta se na týden promění do tématu — chodby, dvůr i aula. Hravě a originálně." },
      { title: "Průvod městem", text: "Legendární průvod centrem Brna s maskotem v čele. Prváci ho nesou až na Flédu." },
    ],
    finaleBadge: "Velké finále",
    finaleTitle: "Křest na Flédě",
    finaleText:
      "Vyvrcholení celého týdne — průvod dorazí do klubu Fléda, kde se pasují prváci a hraje se koncert do brzkého rána. Tady to celé vrcholí.",
    band: "Celá fakulta se na týden promění v jeden velký festival.",
    stepsTitle: "Jak týden probíhá",
    steps: [
      { day: "Přes den", text: "Přednášky, workshopy, obědy a bar na dvoře" },
      { day: "Večer", text: "Kapely, DJs a party na dvoře i v Arše" },
      { day: "Poslední den", text: "Průvod městem v pytlích, s maskotem" },
      { day: "Finále", text: "Křest prváků na Flédě až do rána" },
    ],
    instaTitle: "Všechno ostatní najdeš na Instagramu",
    instaText:
      "Program na každý den, novinky, medailonky hostů, fotky a story z celého týdne. Dej follow, ať ti nic neunikne — tam se to celé děje.",
    footerTagline: "Studentská akce Fakulty architektury VUT · organizují studenti",
    footerOrganizers: "Organizátoři →",
  },
  en: {
    organizers: "Organizers",
    heroKicker: "VUT Faculty of Architecture · student festival",
    heroTagline:
      "A week you won't forget for the rest of your studies. Lectures, a courtyard bar, party nights, a big city parade and the freshmen christening at Fléda.",
    heroBadge: "🐣 A freshman? This is your start to life at the faculty.",
    ctaInsta: "Follow us on Instagram →",
    ctaScroll: "What's in store ↓",
    merchCta: "🛍️ Get the Mařena merch →",
    whatsKicker: "What to look forward to",
    whatsTitle: "What awaits you at Mařena",
    whatsIntro:
      "Mařena is a week-long (about 7–10 days) festival at the turn of September and October. The whole faculty comes alive — and you're part of it. Here's what to look forward to:",
    lineup: [
      { title: "Lectures", text: "Top guests from architecture and design — including from abroad. Inspiration you won't find in your timetable." },
      { title: "Lunches in the courtyard", text: "A warm lunch every day (and breakfast in the morning) right in the faculty courtyard. Eat and meet everyone." },
      { title: "Courtyard bar", text: "The heart of the festival. Beer, lemonade, drinks and good company — all day and evening in one place." },
      { title: "Party nights", text: "Bands and DJs in the courtyard and in Archa. The music plays until quiet hours allow (and a bit longer)." },
      { title: "Decorated school", text: "The whole faculty transforms into the theme for a week — hallways, courtyard and the auditorium. Playful and original." },
      { title: "City parade", text: "The legendary parade through the centre of Brno, led by the mascot. Freshmen carry it all the way to Fléda." },
    ],
    finaleBadge: "Grand finale",
    finaleTitle: "Christening at Fléda",
    finaleText:
      "The climax of the whole week — the parade reaches the Fléda club, where freshmen are initiated and a concert plays until the early morning. This is where it all peaks.",
    band: "For one week the whole faculty turns into one big festival.",
    stepsTitle: "How the week goes",
    steps: [
      { day: "During the day", text: "Lectures, workshops, lunches and the courtyard bar" },
      { day: "In the evening", text: "Bands, DJs and parties in the courtyard and Archa" },
      { day: "Last day", text: "A parade through the city in sacks, with the mascot" },
      { day: "Finale", text: "Freshmen christening at Fléda until morning" },
    ],
    instaTitle: "Everything else is on Instagram",
    instaText:
      "The daily programme, news, guest profiles, photos and stories from the whole week. Give us a follow so you don't miss a thing — that's where it all happens.",
    footerTagline: "A student event of the VUT Faculty of Architecture · organised by students",
    footerOrganizers: "Organizers →",
  },
  de: {
    organizers: "Organisatoren",
    heroKicker: "VUT Fakultät für Architektur · Studentenfestival",
    heroTagline:
      "Eine Woche, die du bis zum Ende des Studiums nicht vergisst. Vorträge, eine Bar im Hof, Partyabende, ein großer Stadtumzug und die Erstsemester-Taufe im Fléda.",
    heroBadge: "🐣 Erstsemester? Das ist dein Einstieg ins Leben an der Fakultät.",
    ctaInsta: "Folge uns auf Instagram →",
    ctaScroll: "Was dich erwartet ↓",
    merchCta: "🛍️ Hol dir den Mařena-Merch →",
    whatsKicker: "Worauf du dich freuen kannst",
    whatsTitle: "Was dich bei Mařena erwartet",
    whatsIntro:
      "Mařena ist ein etwa einwöchiges (ca. 7–10 Tage) Festival an der Wende von September und Oktober. Die ganze Fakultät lebt auf — und du bist dabei. Darauf kannst du dich freuen:",
    lineup: [
      { title: "Vorträge", text: "Top-Gäste aus Architektur und Design — auch aus dem Ausland. Inspiration, die du im Stundenplan nicht findest." },
      { title: "Mittagessen im Hof", text: "Jeden Tag ein warmes Mittagessen (und morgens Frühstück) direkt im Hof der Fakultät. Iss und triff alle." },
      { title: "Bar im Hof", text: "Das Herz des Festivals. Bier, Limo, Drinks und Gesellschaft — den ganzen Tag und Abend an einem Ort." },
      { title: "Partyabende", text: "Bands und DJs im Hof und im Archa. Es wird gespielt, solange die Nachtruhe es erlaubt (und noch ein bisschen länger)." },
      { title: "Geschmückte Schule", text: "Die ganze Fakultät verwandelt sich eine Woche lang in das Thema — Flure, Hof und Aula. Verspielt und originell." },
      { title: "Stadtumzug", text: "Der legendäre Umzug durch das Zentrum von Brünn mit dem Maskottchen an der Spitze. Die Erstsemester tragen es bis zum Fléda." },
    ],
    finaleBadge: "Großes Finale",
    finaleTitle: "Taufe im Fléda",
    finaleText:
      "Der Höhepunkt der ganzen Woche — der Umzug erreicht den Club Fléda, wo die Erstsemester getauft werden und ein Konzert bis in die frühen Morgenstunden spielt. Hier gipfelt alles.",
    band: "Eine Woche lang verwandelt sich die ganze Fakultät in ein großes Festival.",
    stepsTitle: "So läuft die Woche ab",
    steps: [
      { day: "Tagsüber", text: "Vorträge, Workshops, Mittagessen und die Bar im Hof" },
      { day: "Am Abend", text: "Bands, DJs und Partys im Hof und im Archa" },
      { day: "Letzter Tag", text: "Ein Umzug durch die Stadt in Säcken, mit dem Maskottchen" },
      { day: "Finale", text: "Erstsemester-Taufe im Fléda bis zum Morgen" },
    ],
    instaTitle: "Alles Weitere findest du auf Instagram",
    instaText:
      "Das tägliche Programm, Neuigkeiten, Gäste-Porträts, Fotos und Storys aus der ganzen Woche. Folge uns, damit dir nichts entgeht — dort passiert alles.",
    footerTagline: "Eine Studentenveranstaltung der VUT Fakultät für Architektur · organisiert von Studenten",
    footerOrganizers: "Organisatoren →",
  },
};

export default function Home() {
  const [lang, setLang] = useState<Lang>("cs");

  useEffect(() => {
    const saved = localStorage.getItem("marena_lang");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved === "cs" || saved === "en" || saved === "de") setLang(saved);
  }, []);

  function changeLang(l: Lang) {
    setLang(l);
    try {
      localStorage.setItem("marena_lang", l);
    } catch {
      /* ignore */
    }
  }

  const t = STRINGS[lang];

  return (
    <div className="min-h-screen bg-white">
      {/* NAV — na telefonu kompaktní jeden řádek úplně nahoře (logo zmenšené,
          ať se vejde a nepřekrývá hero text) */}
      <header className="absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-black/55 via-black/25 to-transparent pb-6">
        <div className="mx-auto flex max-w-6xl flex-nowrap items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-4 sm:py-5 [text-shadow:0_1px_10px_rgba(0,0,0,0.45)]">
          <span className="shrink-0 [&_*]:text-white">
            <Logo light sizeClass="h-8 sm:h-[1.5cm]" />
          </span>
          <nav className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            {/* Přepínač jazyka */}
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
            <a href={IG_URL} target="_blank" rel="noreferrer" className="btn-primary px-2.5 sm:px-5" aria-label="Instagram">
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
        <Photo src="/photos/hero.jpg" alt="Mařena — průvod městem" label="hero foto — průvod / dvůr Mařeny" className="absolute inset-0 -z-10 h-full w-full" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/65 via-black/55 to-black/85" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.45)_0%,_transparent_65%)]" />

        <div className="mx-auto w-full max-w-3xl px-4 pt-24 text-center [text-shadow:0_2px_20px_rgba(0,0,0,0.55)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white">{t.heroKicker}</p>
          {/* Rozestup písmen je obří jen na velkých displejích; na telefonu by
              nápis přetékal/ořezával, proto tracking škáluje od jemného po 6 cm. */}
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
            <a href={IG_URL} target="_blank" rel="noreferrer" className="btn-primary px-6 py-3 text-base text-white [text-shadow:none]">
              {t.ctaInsta}
            </a>
            <a href="#co-te-ceka" className="rounded-full border border-white/60 bg-black/25 px-6 py-3 text-base font-semibold text-white [text-shadow:none] transition hover:bg-black/40">
              {t.ctaScroll}
            </a>
          </div>

          {/* Velký skákající odkaz na merch */}
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
                <Photo src={m.photo} alt={item.title} label={`foto — ${item.title}`} className="aspect-[4/3] w-full" />
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

        {/* FINÁLE — křest na Flédě (přes celou šířku) */}
        <article className="relative mt-5 overflow-hidden rounded-3xl">
          <Photo src="/photos/finale.jpg" alt={t.finaleTitle} label="finále — koncert na Flédě" className="h-80 w-full md:h-[28rem]" />
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
        <Photo src="/photos/letters.jpg" alt="Nápis MAŘENA před Fakultou architektury VUT" label="MAŘENA před fakultou" className="absolute inset-0 h-full w-full" imgClass="object-bottom" />
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

      {/* INSTAGRAM CTA */}
      <section className="bg-plum-700 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 py-16 text-center md:py-20">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white/10 text-white ring-1 ring-white/15">
            <Icon name="instagram" className="h-9 w-9" />
          </span>
          <h2 className="font-display text-4xl font-bold tracking-tight">{t.instaTitle}</h2>
          <p className="max-w-xl text-white/75">{t.instaText}</p>
          <a href={IG_URL} target="_blank" rel="noreferrer" className="btn-primary px-7 py-3.5 text-base">
            <Icon name="instagram" className="h-5 w-5" /> {IG_HANDLE}
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-black/10 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-8 text-sm text-ink-soft">
          <Logo />
          <p>{t.footerTagline}</p>
          <div className="flex items-center gap-4">
            <a href={IG_URL} target="_blank" rel="noreferrer" className="font-medium text-marigold-700 hover:underline">
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
