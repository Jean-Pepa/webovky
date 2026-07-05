// Posty / funkce Mařeny. Vybráno podle manuálu (Mařena manuál + komentáře
// ročníku 2024), v roce 2026 sloučeno do větších celků, ať má tým míň
// škatulek a každá role dává smysl sama o sobě. Každá role má konkrétní
// úkoly a tipy, které appka ukáže člověku, který si roli vezme.

export interface Role {
  id: string;
  emoji: string;
  name: string;
  short: string;
  duties: string[];
}

export const ROLES: Role[] = [
  {
    id: "hlavni",
    emoji: "🎪",
    name: "Hlavní koordinátor & finance",
    short: "Drží tým, harmonogram i peníze pohromadě (Mařena).",
    duties: [
      "Začít plánovat už v letním semestru, finišovat přes prázdniny.",
      "Rozdělit role a hlídat, že má každý úkol majitele — deleguj!",
      "Termín nejčastěji přelom září a října; pozor na souběh akcí.",
      "O důležitých rozhodnutích se hlasuje, zápisy ze schůzí sdílet všem.",
      "Finance řeší jedna důvěryhodná osoba (na kterou je psaný účet).",
      "Třídní vklad cca 1500 Kč/os.; je to polštář — po festivalu se vrací.",
      "Schovávat účtenky, zapisovat výdaje, po Mařeně udělat vyúčtování.",
      "Platby přes QR i hotově — kasa se základem jak v hospodě.",
    ],
  },
  {
    id: "fakulta",
    emoji: "🏛️",
    name: "Komunikace s fakultou",
    short: "Soňa, děkan, tajemník, BOZP.",
    duties: [
      "Nejdůležitější člověk je Soňa Lisoňová — milá, vše pošéfí (tablety, zvukař, banner).",
      "Domluvit s děkanem otevření fakulty do půlnoci+ — musí napsat na vrátnici.",
      "Příjezdy externistů hlásit na vrátnici (e-mail + kopie tajemníkovi).",
      "Organizátoři musí podepsat formulář BOZP (zašle pan Hasala).",
      "Píšeš sám za tým Mařeny, NE za fakultu — je to studentská akce.",
    ],
  },
  {
    id: "kapelnik",
    emoji: "🎸",
    name: "Kapelník / Hudba & DJs",
    short: "Kapely, DJs, ridery, aparatura.",
    duties: [
      "Domlouvá ten, kdo kapelu navrhl / kdo ji zná — zamlouvat co nejdřív.",
      "Pošli ridery (zvukové požadavky) zvukaři, většinou v pohodě.",
      "Fakulta má částečně použitelnou aparaturu + stany pro kapely.",
      "Po 22:00 venku nehrát (noční klid) — dá se to mít v Arše.",
      "Neboj se i jiného večerního programu než jen živá hudba.",
    ],
  },
  {
    id: "program",
    emoji: "🎭",
    name: "Přednášky & doprovodný program",
    short: "Přednášející, aula, workshopy, Vlaštovkiáda, Formát 400.",
    duties: [
      "Zahraniční přednášející piš min. půl roku dopředu, české 2–3 měsíce.",
      "Max 2–3 přednášky denně, nejdřív od 17:00, délka cca 45 min.",
      "Aulu zamluv u Forteho; pohlídej souběh se sborem (Vox Iuvenalis).",
      "Nabídni dopravu/ubytování a příspěvek max 1500 Kč + medailonky.",
      "Vlaštovkiáda — druháci pro prváky, soutěž o nejdál letící vlaštovku.",
      "Formát 400 — přednášky studentů z Erasmu (seznam na studijním).",
      "Workshopy, dílny, promítání, fašák; denní program sdílet i s kantory.",
    ],
  },
  {
    id: "vyzdoba",
    emoji: "🎨",
    name: "Výzdobář",
    short: "Zóny školy, téma, budget, schválení.",
    duties: [
      "Plán výzdoby ukázat ke schválení tajemníkovi / p. Hasalovi.",
      "Nelepit na dveře, okna, rámy, sochy; pozor na barevné izolepy (zůstanou fleky).",
      "Hlídat únikové cesty a průchodnost min. 2 m (hlavně schodiště v budově B).",
      "Rozdělit školu do zón pod společnou ideou — každou zónu jiná skupinka.",
      "Dát každé skupince budget; co je nad budget, jde k diskuzi.",
      "Skladovat se dá v Arše / kotelně (uzamykatelné). Zdobit stačí 1–2 dny předem.",
    ],
  },
  {
    id: "merch",
    emoji: "📣",
    name: "Propagace, grafika & merch",
    short: "Vizuál ročníku, sítě, newsletter, plakáty a merch.",
    duties: [
      "Výběr tématu ať padne brzo; připrav šablony a příspěvky dopředu (CZ i EN).",
      "Začít propagovat cca v červnu v návaznosti na zápis prváků.",
      "Házet program KAŽDÝ DEN (story + příspěvek), newsletter denně.",
      "Plakáty a letáky i po Brně, do kaváren. Vše s předstihem!",
      "Merch: předobjednávky přes appku/eshop, najít levnou tiskárnu.",
      "Shop spustit ~10. září; zdůrazňovat vyzvednutí NA DVOŘE.",
    ],
  },
  {
    id: "sponzoring",
    emoji: "🤝",
    name: "Sponzoring",
    short: "Shánění darů a partnerů.",
    duties: [
      "Psát z mařena e-mailu — je to STUDENTSKÁ, ne fakultní akce.",
      "Nenech se odradit, že 95 % neodpoví. Dají se sehnat fajn věci.",
      "Osvědčení: dřevo na bar, kafe (The Roses), pivní speciály.",
      "The Roses chtěli sponzorovat i další ročník — určitě napsat.",
    ],
  },
  {
    id: "bar",
    emoji: "🍻",
    name: "Kuchyně & bar",
    short: "Bar na dvoře, vaření, nákupy, směny.",
    duties: [
      "Postavit VELKÝ bar na dvoře — náš společný hub (Archa jen jako zázemí).",
      "Půjčit větší pípu (líp chladí = víc piva); sudy berte flexibilně.",
      "Kelímky (nedostatek skla), várnice na svařák/mošt na chladnější dny.",
      "Rozvrh směn za barem i v kuchyni — ať nevaří celý týden jeden.",
      "Velké nákupy v Makru (i jednorázové nádobí). Bez auta ani ránu!",
      "Obědy vydávat venku, zveřejňovat denní menu; vařit cca do 100 porcí.",
      "Začít vařit fakt brzo (klidně v 8); dobré plotýnky, dost nádobí.",
    ],
  },
  {
    id: "prvaci",
    emoji: "🐣",
    name: "Prváci, průvod & křest",
    short: "Nábor prváků, průvod městem, křest na Flédě.",
    duties: [
      "První slovo, které prvák na fakultě uslyší, musí být Mařena.",
      "Pozvat je už na zápisu + úvodní prezentace 1. den; QR na instagram.",
      "Průvod: povolení min. 30 dní předem (odbor dopravy, BKOM, DPMB, policie).",
      "Sepiš trasu ulici po ulici; vesty a megafon u školníků / v Arše.",
      "Prváci nesou maskota v průvodu a klaní se u významných staveb.",
      "Flédu zamluvit CO NEJDŘÍV (pronájem ~30–35 000, smlouvu dodá Fléda).",
      "Lístky od půlky týdne (~150 Kč, na místě ~200 Kč); podium obalit fóliemi.",
      "Pasování: mouka, vločky, kečup… NE ocet a voňavky; prváky předem najíst.",
    ],
  },
  {
    id: "foto",
    emoji: "📸",
    name: "Foto / Dokumentace",
    short: "Fotografové, archiv, almanach.",
    duties: [
      "Sehnat fotografy na celý týden, hlavně na průvod a zakončení na Flédě.",
      "Lze oslovit i VUT (obor marketingu a vnějších vztahů) — zpropagují to.",
      "Dokumentovat průběh, ať je z čeho dělat příští almanach a medailonky.",
    ],
  },
];

// Sloučení rolí (2026): stará ID z dřívějších dat se převádí na nová,
// ať lidem zůstanou jejich funkce, vedoucí i úkoly.
export const LEGACY_ROLE_MAP: Record<string, string> = {
  ekonom: "hlavni", // Ekonom / Finance → Hlavní koordinátor & finance
  prednasky: "program", // Koordinátor přednášek → Přednášky & doprovodný program
  grafik: "merch", // Grafik → Propagace, grafika & merch
  propagace: "merch", // Propagace / Sociální sítě → Propagace, grafika & merch
  kuchyn: "bar", // Kuchyně → Kuchyně & bar
  pruvod: "prvaci", // Průvod městem → Prváci, průvod & křest
  fleda: "prvaci", // Fléda / Křest prváků → Prváci, průvod & křest
};

export const normalizeRoleId = (id: string): string => LEGACY_ROLE_MAP[id] ?? id;

export const roleById = (id?: string): Role | undefined =>
  id ? ROLES.find((r) => r.id === normalizeRoleId(id)) : undefined;
