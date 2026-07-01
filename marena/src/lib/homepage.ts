// Obsah veřejné homepage (úvodní web) — výchozí texty + typy pro editaci správcem.
// Správce může přepsat texty, nadpisy, fotky (URL), odkaz na Instagram a přidávat
// novinky. Co není přepsané, vezme se z výchozích hodnot níže (podle jazyka).
import type { IconName } from "@/components/Icons";

export type Lang = "cs" | "en" | "de";
export const LANGS: Lang[] = ["cs", "en", "de"];

// Výchozí odkaz na Instagram (dá se přepsat v editaci).
export const DEFAULT_IG_URL = "https://www.instagram.com/marena2k25";
export const DEFAULT_IG_HANDLE = "@marena2k25";

// Fotky + ikonky sekce „Co tě čeká". Fotky jde přepsat; ikonky jsou pevné.
export const LINEUP_MEDIA: { photo: string; icon: IconName }[] = [
  { photo: "/photos/prednasky.jpg", icon: "lecture" },
  { photo: "/photos/obedy.jpg", icon: "food" },
  { photo: "/photos/bar.jpg", icon: "beer" },
  { photo: "/photos/party.jpg", icon: "music" },
  { photo: "/photos/vyzdoba.jpg", icon: "palette" },
  { photo: "/photos/pruvod.jpg", icon: "flag" },
];

export const DEFAULT_PHOTOS = {
  hero: "/photos/hero.jpg",
  finale: "/photos/finale.jpg",
  letters: "/photos/letters.jpg",
};

export interface Strings {
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
  newsTitle: string;
  instaTitle: string;
  instaText: string;
  footerTagline: string;
  footerOrganizers: string;
}

export const STRINGS: Record<Lang, Strings> = {
  cs: {
    organizers: "Organizátoři",
    heroKicker: "Fakulta architektury VUT · studentský festival",
    heroTagline: "Týden, na který do konce školy nezapomeneš.",
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
    newsTitle: "Novinky",
    instaTitle: "Všechno ostatní najdeš na Instagramu",
    instaText:
      "Program na každý den, novinky, medailonky hostů, fotky a story z celého týdne. Dej follow, ať ti nic neunikne — tam se to celé děje.",
    footerTagline: "Studentská akce Fakulty architektury VUT · organizují studenti",
    footerOrganizers: "Organizátoři →",
  },
  en: {
    organizers: "Organizers",
    heroKicker: "VUT Faculty of Architecture · student festival",
    heroTagline: "A week you won't forget for the rest of your studies.",
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
    newsTitle: "News",
    instaTitle: "Everything else is on Instagram",
    instaText:
      "The daily programme, news, guest profiles, photos and stories from the whole week. Give us a follow so you don't miss a thing — that's where it all happens.",
    footerTagline: "A student event of the VUT Faculty of Architecture · organised by students",
    footerOrganizers: "Organizers →",
  },
  de: {
    organizers: "Organisatoren",
    heroKicker: "VUT Fakultät für Architektur · Studentenfestival",
    heroTagline: "Eine Woche, die du bis zum Ende des Studiums nicht vergisst.",
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
    newsTitle: "Neuigkeiten",
    instaTitle: "Alles Weitere findest du auf Instagram",
    instaText:
      "Das tägliche Programm, Neuigkeiten, Gäste-Porträts, Fotos und Storys aus der ganzen Woche. Folge uns, damit dir nichts entgeht — dort passiert alles.",
    footerTagline: "Eine Studentenveranstaltung der VUT Fakultät für Architektur · organisiert von Studenten",
    footerOrganizers: "Organisatoren →",
  },
};

// ---- Přepis obsahu správcem (vše volitelné — prázdné = výchozí) ----

export interface HomeText {
  heroKicker?: string;
  heroTagline?: string;
  heroBadge?: string;
  ctaInsta?: string;
  ctaScroll?: string;
  merchCta?: string;
  whatsKicker?: string;
  whatsTitle?: string;
  whatsIntro?: string;
  lineup?: { title?: string; text?: string }[];
  finaleBadge?: string;
  finaleTitle?: string;
  finaleText?: string;
  band?: string;
  stepsTitle?: string;
  steps?: { day?: string; text?: string }[];
  newsTitle?: string;
  instaTitle?: string;
  instaText?: string;
  footerTagline?: string;
}

export interface HomeNews {
  id: string;
  date?: string;
  title: string;
  text: string;
  photo?: string;
  link?: string;
}

// Vzhled (téma) veřejné homepage — každý ročník může mít jiné.
// Přidání dalšího tématu: dopiš sem ID, přidej položku do THEMES a novou
// větev vykreslení v src/app/page.tsx.
export type ThemeId = "normal" | "vegas";

export const THEMES: { id: ThemeId; name: string; emoji: string; desc: string }[] = [
  { id: "vegas", name: "Las Vegas", emoji: "🎰", desc: "Neonové kasino — zlatý nápis, světla a kačenka. Letošní 56. ročník." },
  { id: "normal", name: "Normální", emoji: "🎓", desc: "Čistý web ve fakultních barvách, jak vypadal dřív." },
];

export interface HomeContent {
  theme?: ThemeId;
  text?: Partial<Record<Lang, HomeText>>;
  photos?: { hero?: string; finale?: string; letters?: string; lineup?: (string | undefined)[] };
  ig?: { url?: string; handle?: string };
  news?: HomeNews[];
  updatedAt?: string;
  updatedBy?: string;
}

// Výchozí téma je Las Vegas (letošní ročník); správce ho může přepnout.
export function themeOf(c: HomeContent | null): ThemeId {
  return c?.theme === "normal" ? "normal" : "vegas";
}

// Přepis přeloží přes výchozí texty daného jazyka (prázdné pole = výchozí).
export function mergeStrings(lang: Lang, ov?: HomeText): Strings {
  const d = STRINGS[lang];
  if (!ov) return d;
  const s = (a: string | undefined, b: string) => (a && a.trim() ? a : b);
  return {
    organizers: d.organizers,
    heroKicker: s(ov.heroKicker, d.heroKicker),
    heroTagline: s(ov.heroTagline, d.heroTagline),
    heroBadge: s(ov.heroBadge, d.heroBadge),
    ctaInsta: s(ov.ctaInsta, d.ctaInsta),
    ctaScroll: s(ov.ctaScroll, d.ctaScroll),
    merchCta: s(ov.merchCta, d.merchCta),
    whatsKicker: s(ov.whatsKicker, d.whatsKicker),
    whatsTitle: s(ov.whatsTitle, d.whatsTitle),
    whatsIntro: s(ov.whatsIntro, d.whatsIntro),
    lineup: d.lineup.map((it, i) => ({
      title: s(ov.lineup?.[i]?.title, it.title),
      text: s(ov.lineup?.[i]?.text, it.text),
    })),
    finaleBadge: s(ov.finaleBadge, d.finaleBadge),
    finaleTitle: s(ov.finaleTitle, d.finaleTitle),
    finaleText: s(ov.finaleText, d.finaleText),
    band: s(ov.band, d.band),
    stepsTitle: s(ov.stepsTitle, d.stepsTitle),
    steps: d.steps.map((st, i) => ({
      day: s(ov.steps?.[i]?.day, st.day),
      text: s(ov.steps?.[i]?.text, st.text),
    })),
    newsTitle: s(ov.newsTitle, d.newsTitle),
    instaTitle: s(ov.instaTitle, d.instaTitle),
    instaText: s(ov.instaText, d.instaText),
    footerTagline: s(ov.footerTagline, d.footerTagline),
    footerOrganizers: d.footerOrganizers,
  };
}

export function igUrlOf(c: HomeContent | null): string {
  return c?.ig?.url?.trim() || DEFAULT_IG_URL;
}
export function igHandleOf(c: HomeContent | null): string {
  return c?.ig?.handle?.trim() || DEFAULT_IG_HANDLE;
}
export function photoOf(c: HomeContent | null, key: "hero" | "finale" | "letters"): string {
  return c?.photos?.[key]?.trim() || DEFAULT_PHOTOS[key];
}
export function lineupPhotoOf(c: HomeContent | null, i: number): string {
  return c?.photos?.lineup?.[i]?.trim() || LINEUP_MEDIA[i].photo;
}

// ---- Demo režim (bez Redisu): úložiště v localStorage tohoto prohlížeče ----
export const LS_HOMEPAGE = "marena_homepage";

export function loadLocalHomepage(): HomeContent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LS_HOMEPAGE);
    return raw ? (JSON.parse(raw) as HomeContent) : null;
  } catch {
    return null;
  }
}
export function saveLocalHomepage(c: HomeContent) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LS_HOMEPAGE, JSON.stringify(c));
  } catch {
    /* ignore */
  }
}
