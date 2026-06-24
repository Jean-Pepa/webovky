// Posty / funkce Mařeny. Vybráno přímo podle manuálu (Mařena manuál + komentáře
// ročníku 2024). Každá role má i konkrétní úkoly a tipy, které appka ukáže
// člověku, který si roli vezme, aby věděl, co ho čeká.

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
    name: "Hlavní organizátor / koordinátor",
    short: "Drží celý tým a harmonogram pohromadě.",
    duties: [
      "Začít plánovat už v letním semestru, finišovat přes prázdniny.",
      "Rozdělit role a hlídat, že má každý úkol majitele — deleguj!",
      "Termín nejčastěji přelom září a října (ještě teplo), délka cca 7–10 dní.",
      "Pozor na souběh akcí (Designblok, Hudba z FEKTu, Den architektury, Cena B. Fuchse).",
      "O důležitých rozhodnutích se hlasuje, zápisy ze schůzí sdílet všem.",
    ],
  },
  {
    id: "ekonom",
    emoji: "💰",
    name: "Ekonom / Finance",
    short: "Účet, třídní vklad, vyúčtování.",
    duties: [
      "Finance ať řeší jedna důvěryhodná osoba (na kterou je psaný účet).",
      "Třídní vklad cca 1500 Kč/os., lze posílat na víckrát; dělej 3 upomínací kola.",
      "Vklad je polštář — když festival vydělá, vrací se celý zpátky.",
      "Schovávej účtenky, zapisuj výdaje do tabulky, po Mařeně udělej vyúčtování.",
      "Platby přes QR (AlienPay od p. Vostala) i hotově — kasa se základem jak v hospodě.",
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
    id: "prednasky",
    emoji: "🎓",
    name: "Koordinátor přednášek",
    short: "Obesílání, sloty, aula, doprava a ubytování.",
    duties: [
      "Zahraniční přednášející piš min. půl roku dopředu, české 2–3 měsíce (radši dřív).",
      "Max 2–3 přednášky denně, nejdřív od 17:00, délka cca 45 min.",
      "Aulu zamluv u Forteho, ať to padne do rozvrhu a nikdo místo nevyfoukne.",
      "Pohlídej souběh se sborem (pan Ocetek / Vox Iuvenalis) — dej vědět dopředu.",
      "Nabídni dopravu/ubytování (Austerlitz, Continental, koleje) a příspěvek max 1500 Kč.",
      "Nezapomeň na medailonky přednášejících — lidi chtějí vědět, o koho jde.",
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
    id: "grafik",
    emoji: "🖌️",
    name: "Grafik",
    short: "Vizuál ročníku, šablony, téma.",
    duties: [
      "Výběr tématu ať padne brzo, ať se může začít dělat grafika.",
      "Připrav šablony, do kterých si lidi od socek doplňují obsah.",
      "Připrav co nejvíc příspěvků předem (programy, medailonky) — ušetří nervy.",
      "Vše vizuálně řeš česky i anglicky.",
    ],
  },
  {
    id: "propagace",
    emoji: "📣",
    name: "Propagace / Sociální sítě",
    short: "Instagram, FB, newsletter, plakáty.",
    duties: [
      "Začít propagovat cca v červnu v návaznosti na zápis prváků.",
      "Házet program KAŽDÝ DEN (story + příspěvek na další den) — nevděčné, ale nutné.",
      "Newsletter denně: rekapitulace + pozvánka na další den, česky i anglicky.",
      "Posílat všem studentům, akademikům, vrátnici, školníkům (Soňa ví komu).",
      "Plakáty a letáky i po Brně, do kaváren. Vše s předstihem!",
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
    id: "merch",
    emoji: "👕",
    name: "Merch",
    short: "Eshop, tisk, předobjednávky.",
    duties: [
      "Předobjednávky přes Shopify (levné předplatné), přehledné objednávky.",
      "Najít flexibilní a levnou tiskárnu (styl nabídka–poptávka).",
      "Shop spustit ~10. září, prvních pár dní školy, ať to prváci stihnou.",
      "Zdůrazňovat vyzvednutí NA DVOŘE (lidi čekají zaslání domů).",
      "Udělat zkušební objednávku pro sebe, než se spustí eshop.",
    ],
  },
  {
    id: "bar",
    emoji: "🍺",
    name: "Bar / Archa (zázemí)",
    short: "Velký bar na dvoře, pípa, kasa, směny.",
    duties: [
      "Postavit VELKÝ bar na dvoře — náš společný hub (Archa jen jako zázemí).",
      "Půjčit větší pípu (líp chladí = víc piva); sudy berte flexibilně, vrátí nevytočené.",
      "Kasa na půjčených tabletech ze školy pro přehled tržeb.",
      "Kelímky (nedostatek skla), várnice na svařák/mošt na chladnější dny.",
      "Rozvrh směn za barem — venku o nic nepřijdeš, lidi nevadí být celý večer.",
    ],
  },
  {
    id: "kuchyn",
    emoji: "🍲",
    name: "Kuchyně / Jídlo & pití",
    short: "Snídaně, obědy, nákupy.",
    duties: [
      "Musí si vzít na starost někdo vysoce kompetentní; ať nevaří celý týden jeden.",
      "Velké nákupy v Makru (i jednorázové nádobí). Bez auta ani ránu!",
      "Obědy vydávat venku, zveřejňovat denní menu; vařit cca do 100 porcí + polévka.",
      "Začít vařit fakt brzo (klidně v 8 nebo dřív); dobré plotýnky, dost nádobí.",
      "Oficiálně se ve škole prodávat nesmí — řeš cenu třeba v „žetonech“.",
    ],
  },
  {
    id: "program",
    emoji: "🎭",
    name: "Bavič / Program & doprovodné akce",
    short: "Workshopy, Vlaštovkiáda, Formát 400.",
    duties: [
      "Vlaštovkiáda — druháci pro prváky, soutěž o nejdál letící vlaštovku.",
      "Formát 400 — přednášky studentů z Erasmu (seznam na studijním).",
      "Workshopy, dílny, promítání, fašák (blešák oblečení).",
      "Denní program vždy zveřejnit a sdílet i s kantory.",
      "Školu lze obývat výjimečně do 24–01:00 (jinak do 20–22:00).",
    ],
  },
  {
    id: "pruvod",
    emoji: "🚩",
    name: "Průvod městem",
    short: "Byrokracie, trasa, povolení, vesty.",
    duties: [
      "ZAŘIZUJ S PŘEDSTIHEM — povolení min. 30 dní předem (kulturní akce).",
      "Sepiš trasu ulici po ulici, zajdi na odbor dopravy (Měnínská 4, pí Polánková).",
      "Povolení od každé městské části → BKOM → DPMB → policie nahlásit průvod.",
      "Min. 2 označení organizátoři (oranžové vesty — u školníků nebo v Arše).",
      "Maskot musí doputovat až na Flédu (nesou ho prváci), zastávky u staveb.",
      "Chodit co nejvíc po chodnících! Megafon na hypování (lze půjčit).",
    ],
  },
  {
    id: "fleda",
    emoji: "🌟",
    name: "Fléda / Křest prváků",
    short: "Lístky, pasování, podium, security.",
    duties: [
      "Flédu zamluvit CO NEJDŘÍV; pronájem cca 30–35 000, smlouvu dodá Fléda.",
      "Lístky prodávat od půlky týdne (Archa, knihovna ~150 Kč; na místě ~200 Kč).",
      "Den předem obalit podium i stěny fóliemi (proti špíně a poškození).",
      "Pasování: lije/sype se mouka, vločky, kečup, hořčice, voda — NE ocet a voňavky.",
      "Pod podiem hned sundávat igelity, ať se směs neroznáší po klubu.",
      "Fléda nepouští lidi ven — upozornit prváky, ať se najedí předem.",
    ],
  },
  {
    id: "prvaci",
    emoji: "🐣",
    name: "Koordinátor prváků",
    short: "Nábor, info, pasování, maskot.",
    duties: [
      "První slovo, které prvák na fakultě uslyší, musí být Mařena — valit to ze všech stran.",
      "Pozvat je už na zápisu (přes Forteho / Doubravovou) + úvodní prezentace 1. den.",
      "Cpát jim QR na instagram, opakovat snídaně/obědy/program na dvoře.",
      "Prváci nesou maskota v průvodu a klaní se u významných staveb.",
      "Před Flédou je připravit (najíst se), motivace razítky/odměnami za přednášky.",
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

export const roleById = (id?: string): Role | undefined =>
  id ? ROLES.find((r) => r.id === id) : undefined;
