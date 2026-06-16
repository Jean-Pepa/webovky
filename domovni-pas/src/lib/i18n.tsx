"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "cs" | "sk" | "pl" | "en" | "de";

export const LANGS: { lang: Lang; country: string; code: string; name: string }[] = [
  { lang: "cs", country: "CZ", code: "CS", name: "Čeština" },
  { lang: "sk", country: "SK", code: "SK", name: "Slovenčina" },
  { lang: "pl", country: "PL", code: "PL", name: "Polski" },
  { lang: "en", country: "GB", code: "EN", name: "English" },
  { lang: "de", country: "DE", code: "DE", name: "Deutsch" },
];

type Item = { title: string; text: string };

export type Dict = {
  nav: { features: string; how: string; forWhom: string; enter: string };
  hero: {
    label: string;
    title1: string;
    title2: string;
    subtitle: string;
    enter: string;
    architect: string;
    chip1: string;
    chip2: string;
  };
  features: { heading: string; sub: string; items: Item[] };
  how: { heading: string; sub: string; steps: Item[] };
  who: { heading: string; items: Item[] };
  cta: { title: string; sub: string; enter: string; handover: string };
  footer: { privacy: string };
  login: {
    title: string;
    sub: string;
    placeholder: string;
    button: string;
    error: string;
    back: string;
  };
  cookies: {
    chip: string;
    zasady: string;
    title: string;
    text: string;
    more: string;
    necessary: string;
    necessaryNote: string;
    necessaryDesc: string;
    statistics: string;
    statisticsDesc: string;
    marketing: string;
    marketingDesc: string;
    acceptAll: string;
    save: string;
  };
};

const cs: Dict = {
  nav: { features: "Co umí", how: "Jak to funguje", forWhom: "Pro koho", enter: "Vstoupit do aplikace" },
  hero: {
    label: "BULO.APP",
    title1: "Digitální pas",
    title2: "vaší nemovitosti",
    subtitle:
      "Dokumentace, opravy, rekonstrukce, vybavení i fotografie. Trvalá historie, která zůstává s nemovitostí po celý její život.",
    enter: "Vstoupit do aplikace",
    architect: "Jsem architekt",
    chip1: "Pro majitele, architekty i kupující",
    chip2: "4 329+ domů",
  },
  features: {
    heading: "Všechno o vašem domě na jednom místě",
    sub: "Konec šanonů, ztracených faktur a „kde jen mám ten záruční list“.",
    items: [
      { title: "Přehledná historie", text: "Časová osa všeho — od revize kotle po rekonstrukci koupelny, s fotkami a náklady." },
      { title: "Vybavení a materiály", text: "„Co je v mém domě“ — baterie, kotel, podlahy… s cenou, zárukou a doklady." },
      { title: "Dokumenty pohromadě", text: "Smlouvy, projekt, energetický štítek, certifikáty i faktury vždy po ruce." },
      { title: "Připomínky", text: "Revize, údržba a záruky — BULO vás upozorní dřív, než vyprší termín." },
      { title: "Převod při prodeji", text: "Celou historii i s reportem předáte novému majiteli jedním krokem." },
      { title: "Report o nemovitosti", text: "Důvěryhodný přehled stavu a péče k tisku či PDF — váš „CarVertical report“." },
    ],
  },
  how: {
    heading: "Jak to funguje",
    sub: "Tři kroky. Žádná složitá administrativa.",
    steps: [
      { title: "Založ pas", text: "Při koupi, rekonstrukci — nebo prostě teď. Nahraješ smlouvu, energetický štítek a pár fotek." },
      { title: "Veď historii", text: "Zapisuj opravy, revize a vybavení. Připomínky tě hlídají, dokumenty máš po ruce." },
      { title: "Předej dál", text: "Při prodeji předáš celý pas i s reportem novému majiteli. Hodnota navíc." },
    ],
  },
  who: {
    heading: "Pro koho je BULO",
    items: [
      { title: "Majitelé", text: "Mějte historii domu po ruce, hlídejte záruky a revize a při prodeji doložte péči." },
      { title: "Architekti a firmy", text: "Profesionální předání projektu klientovi — dokumentace, fotky a materiály místo PDF a WeTransferu." },
      { title: "Kupující a realitky", text: "Důvěryhodný report o stavu a historii nemovitosti. Konec nakupování „kočky v pytli“." },
    ],
  },
  cta: {
    title: "Začněte ještě dnes",
    sub: "Zdarma, hned a bez složitého nastavování. Vyzkoušejte ukázku na vlastní nemovitosti.",
    enter: "Vstoupit do aplikace",
    handover: "Předat projekt",
  },
  footer: { privacy: "Zásady ochrany osobních údajů" },
  login: {
    title: "Přihlášení",
    sub: "Zadejte heslo pro vstup do BULO.",
    placeholder: "Heslo",
    button: "Přihlásit se",
    error: "Nesprávné heslo.",
    back: "← Zpět na úvod",
  },
  cookies: {
    chip: "Cookies",
    zasady: "Zásady",
    title: "Cookies a soukromí",
    text: "Nezbytné cookies jedou vždy, aby web fungoval. Se souhlasem k tomu přidáme vlastní měření návštěvnosti — pomáhá nám web vylepšovat. Změnit nebo odvolat to můžeš kdykoli.",
    more: "Více v zásadách ochrany soukromí →",
    necessary: "Nezbytné",
    necessaryNote: "Vždy zapnuto",
    necessaryDesc: "Provoz webu, bezpečnost, záznam tvé volby. Nelze vypnout.",
    statistics: "Statistiky",
    statisticsDesc: "Naše vlastní měření návštěvnosti (bez třetích stran).",
    marketing: "Marketing",
    marketingDesc: "Měření reklam a interaktivní mapy třetích stran.",
    acceptAll: "Přijmout vše",
    save: "Uložit volbu",
  },
};

const sk: Dict = {
  nav: { features: "Čo dokáže", how: "Ako to funguje", forWhom: "Pre koho", enter: "Vstúpiť do aplikácie" },
  hero: {
    label: "BULO.APP",
    title1: "Digitálny pas",
    title2: "vašej nehnuteľnosti",
    subtitle:
      "Dokumentácia, opravy, rekonštrukcie, vybavenie aj fotografie. Trvalá história, ktorá zostáva s nehnuteľnosťou po celý jej život.",
    enter: "Vstúpiť do aplikácie",
    architect: "Som architekt",
    chip1: "Pre majiteľov, architektov aj kupujúcich",
    chip2: "4 329+ domov",
  },
  features: {
    heading: "Všetko o vašom dome na jednom mieste",
    sub: "Koniec šanónov, stratených faktúr a „kde mám ten záručný list“.",
    items: [
      { title: "Prehľadná história", text: "Časová os všetkého — od revízie kotla po rekonštrukciu kúpeľne, s fotkami a nákladmi." },
      { title: "Vybavenie a materiály", text: "„Čo je v mojom dome“ — batérie, kotol, podlahy… s cenou, zárukou a dokladmi." },
      { title: "Dokumenty pohromade", text: "Zmluvy, projekt, energetický štítok, certifikáty aj faktúry vždy poruke." },
      { title: "Pripomienky", text: "Revízie, údržba a záruky — BULO vás upozorní skôr, než vyprší termín." },
      { title: "Prevod pri predaji", text: "Celú históriu aj s reportom odovzdáte novému majiteľovi jedným krokom." },
      { title: "Report o nehnuteľnosti", text: "Dôveryhodný prehľad stavu a starostlivosti na tlač či PDF — váš „CarVertical report“." },
    ],
  },
  how: {
    heading: "Ako to funguje",
    sub: "Tri kroky. Žiadna zložitá administratíva.",
    steps: [
      { title: "Založ pas", text: "Pri kúpe, rekonštrukcii — alebo jednoducho teraz. Nahráš zmluvu, energetický štítok a pár fotiek." },
      { title: "Veď históriu", text: "Zapisuj opravy, revízie a vybavenie. Pripomienky ťa strážia, dokumenty máš poruke." },
      { title: "Odovzdaj ďalej", text: "Pri predaji odovzdáš celý pas aj s reportom novému majiteľovi. Hodnota navyše." },
    ],
  },
  who: {
    heading: "Pre koho je BULO",
    items: [
      { title: "Majitelia", text: "Majte históriu domu poruke, strážte záruky a revízie a pri predaji doložte starostlivosť." },
      { title: "Architekti a firmy", text: "Profesionálne odovzdanie projektu klientovi — dokumentácia, fotky a materiály namiesto PDF a WeTransferu." },
      { title: "Kupujúci a reality", text: "Dôveryhodný report o stave a histórii nehnuteľnosti. Koniec kupovania „mačky vo vreci“." },
    ],
  },
  cta: {
    title: "Začnite ešte dnes",
    sub: "Zadarmo, hneď a bez zložitého nastavovania. Vyskúšajte ukážku na vlastnej nehnuteľnosti.",
    enter: "Vstúpiť do aplikácie",
    handover: "Odovzdať projekt",
  },
  footer: { privacy: "Zásady ochrany osobných údajov" },
  login: {
    title: "Prihlásenie",
    sub: "Zadajte heslo pre vstup do BULO.",
    placeholder: "Heslo",
    button: "Prihlásiť sa",
    error: "Nesprávne heslo.",
    back: "← Späť na úvod",
  },
  cookies: {
    chip: "Cookies",
    zasady: "Zásady",
    title: "Cookies a súkromie",
    text: "Nevyhnutné cookies bežia vždy, aby web fungoval. So súhlasom k tomu pridáme vlastné meranie návštevnosti — pomáha nám web vylepšovať. Zmeniť alebo odvolať to môžeš kedykoľvek.",
    more: "Viac v zásadách ochrany súkromia →",
    necessary: "Nevyhnutné",
    necessaryNote: "Vždy zapnuté",
    necessaryDesc: "Prevádzka webu, bezpečnosť, záznam tvojej voľby. Nedá sa vypnúť.",
    statistics: "Štatistiky",
    statisticsDesc: "Naše vlastné meranie návštevnosti (bez tretích strán).",
    marketing: "Marketing",
    marketingDesc: "Meranie reklám a interaktívne mapy tretích strán.",
    acceptAll: "Prijať všetko",
    save: "Uložiť voľbu",
  },
};

const pl: Dict = {
  nav: { features: "Co potrafi", how: "Jak to działa", forWhom: "Dla kogo", enter: "Wejdź do aplikacji" },
  hero: {
    label: "BULO.APP",
    title1: "Cyfrowy paszport",
    title2: "Twojej nieruchomości",
    subtitle:
      "Dokumentacja, naprawy, remonty, wyposażenie i zdjęcia. Trwała historia, która zostaje z nieruchomością przez całe jej życie.",
    enter: "Wejdź do aplikacji",
    architect: "Jestem architektem",
    chip1: "Dla właścicieli, architektów i kupujących",
    chip2: "4 329+ domów",
  },
  features: {
    heading: "Wszystko o Twoim domu w jednym miejscu",
    sub: "Koniec segregatorów, zgubionych faktur i „gdzie ja mam tę kartę gwarancyjną“.",
    items: [
      { title: "Przejrzysta historia", text: "Oś czasu wszystkiego — od przeglądu kotła po remont łazienki, ze zdjęciami i kosztami." },
      { title: "Wyposażenie i materiały", text: "„Co jest w moim domu“ — baterie, kocioł, podłogi… z ceną, gwarancją i dokumentami." },
      { title: "Dokumenty razem", text: "Umowy, projekt, świadectwo energetyczne, certyfikaty i faktury zawsze pod ręką." },
      { title: "Przypomnienia", text: "Przeglądy, konserwacja i gwarancje — BULO przypomni, zanim minie termin." },
      { title: "Przekazanie przy sprzedaży", text: "Całą historię wraz z raportem przekażesz nowemu właścicielowi jednym krokiem." },
      { title: "Raport o nieruchomości", text: "Wiarygodny przegląd stanu i dbałości do druku lub PDF — Twój „raport CarVertical“." },
    ],
  },
  how: {
    heading: "Jak to działa",
    sub: "Trzy kroki. Żadnej skomplikowanej administracji.",
    steps: [
      { title: "Załóż paszport", text: "Przy zakupie, remoncie — albo po prostu teraz. Wgrasz umowę, świadectwo energetyczne i kilka zdjęć." },
      { title: "Prowadź historię", text: "Zapisuj naprawy, przeglądy i wyposażenie. Przypomnienia czuwają, dokumenty masz pod ręką." },
      { title: "Przekaż dalej", text: "Przy sprzedaży przekażesz cały paszport z raportem nowemu właścicielowi. Dodatkowa wartość." },
    ],
  },
  who: {
    heading: "Dla kogo jest BULO",
    items: [
      { title: "Właściciele", text: "Miej historię domu pod ręką, pilnuj gwarancji i przeglądów, a przy sprzedaży udokumentuj dbałość." },
      { title: "Architekci i firmy", text: "Profesjonalne przekazanie projektu klientowi — dokumentacja, zdjęcia i materiały zamiast PDF i WeTransfera." },
      { title: "Kupujący i biura nieruchomości", text: "Wiarygodny raport o stanie i historii nieruchomości. Koniec kupowania „kota w worku“." },
    ],
  },
  cta: {
    title: "Zacznij już dziś",
    sub: "Za darmo, od razu i bez skomplikowanej konfiguracji. Wypróbuj demo na własnej nieruchomości.",
    enter: "Wejdź do aplikacji",
    handover: "Przekaż projekt",
  },
  footer: { privacy: "Polityka prywatności" },
  login: {
    title: "Logowanie",
    sub: "Wpisz hasło, aby wejść do BULO.",
    placeholder: "Hasło",
    button: "Zaloguj się",
    error: "Nieprawidłowe hasło.",
    back: "← Powrót na stronę główną",
  },
  cookies: {
    chip: "Cookies",
    zasady: "Zasady",
    title: "Pliki cookie i prywatność",
    text: "Niezbędne pliki cookie działają zawsze, aby strona funkcjonowała. Za zgodą dodamy własny pomiar odwiedzin — pomaga nam ulepszać stronę. Możesz to zmienić lub cofnąć w każdej chwili.",
    more: "Więcej w polityce prywatności →",
    necessary: "Niezbędne",
    necessaryNote: "Zawsze włączone",
    necessaryDesc: "Działanie strony, bezpieczeństwo, zapis Twojego wyboru. Nie można wyłączyć.",
    statistics: "Statystyki",
    statisticsDesc: "Nasz własny pomiar odwiedzin (bez stron trzecich).",
    marketing: "Marketing",
    marketingDesc: "Pomiar reklam i interaktywne mapy stron trzecich.",
    acceptAll: "Zaakceptuj wszystko",
    save: "Zapisz wybór",
  },
};

const en: Dict = {
  nav: { features: "Features", how: "How it works", forWhom: "Who it's for", enter: "Enter the app" },
  hero: {
    label: "BULO.APP",
    title1: "Digital passport",
    title2: "for your property",
    subtitle:
      "Documentation, repairs, renovations, equipment and photos. A lasting history that stays with the property for its whole life.",
    enter: "Enter the app",
    architect: "I'm an architect",
    chip1: "For owners, architects and buyers",
    chip2: "4,329+ homes",
  },
  features: {
    heading: "Everything about your home in one place",
    sub: "No more binders, lost invoices and „where did I put that warranty card“.",
    items: [
      { title: "Clear history", text: "A timeline of everything — from a boiler inspection to a bathroom renovation, with photos and costs." },
      { title: "Equipment and materials", text: "„What's in my home“ — faucets, boiler, floors… with price, warranty and documents." },
      { title: "Documents together", text: "Contracts, plans, energy certificate, certificates and invoices always at hand." },
      { title: "Reminders", text: "Inspections, maintenance and warranties — BULO reminds you before the deadline." },
      { title: "Transfer at sale", text: "Hand over the whole history with a report to the new owner in one step." },
      { title: "Property report", text: "A trustworthy overview of condition and care to print or PDF — your „CarVertical report“." },
    ],
  },
  how: {
    heading: "How it works",
    sub: "Three steps. No complicated paperwork.",
    steps: [
      { title: "Create the passport", text: "At purchase, renovation — or simply now. Upload the contract, energy certificate and a few photos." },
      { title: "Keep the history", text: "Log repairs, inspections and equipment. Reminders watch over you, documents are at hand." },
      { title: "Pass it on", text: "At sale you hand the whole passport with a report to the new owner. Added value." },
    ],
  },
  who: {
    heading: "Who BULO is for",
    items: [
      { title: "Owners", text: "Keep your home's history at hand, track warranties and inspections, and prove care at sale." },
      { title: "Architects and firms", text: "Professional project handover to the client — documentation, photos and materials instead of PDF and WeTransfer." },
      { title: "Buyers and agents", text: "A trustworthy report on the condition and history of a property. No more buying „a pig in a poke“." },
    ],
  },
  cta: {
    title: "Get started today",
    sub: "Free, instantly and with no complex setup. Try the demo on your own property.",
    enter: "Enter the app",
    handover: "Hand over a project",
  },
  footer: { privacy: "Privacy policy" },
  login: {
    title: "Sign in",
    sub: "Enter the password to access BULO.",
    placeholder: "Password",
    button: "Sign in",
    error: "Wrong password.",
    back: "← Back to home",
  },
  cookies: {
    chip: "Cookies",
    zasady: "Privacy",
    title: "Cookies and privacy",
    text: "Necessary cookies always run so the site works. With your consent we add our own visitor analytics — it helps us improve the site. You can change or withdraw this anytime.",
    more: "More in the privacy policy →",
    necessary: "Necessary",
    necessaryNote: "Always on",
    necessaryDesc: "Site operation, security, saving your choice. Cannot be turned off.",
    statistics: "Statistics",
    statisticsDesc: "Our own visitor analytics (no third parties).",
    marketing: "Marketing",
    marketingDesc: "Ad measurement and third-party interactive maps.",
    acceptAll: "Accept all",
    save: "Save choice",
  },
};

const de: Dict = {
  nav: { features: "Funktionen", how: "So funktioniert's", forWhom: "Für wen", enter: "Zur App" },
  hero: {
    label: "BULO.APP",
    title1: "Digitaler Pass",
    title2: "Ihrer Immobilie",
    subtitle:
      "Dokumentation, Reparaturen, Renovierungen, Ausstattung und Fotos. Eine bleibende Historie, die der Immobilie ein Leben lang erhalten bleibt.",
    enter: "Zur App",
    architect: "Ich bin Architekt",
    chip1: "Für Eigentümer, Architekten und Käufer",
    chip2: "4.329+ Häuser",
  },
  features: {
    heading: "Alles über Ihr Haus an einem Ort",
    sub: "Schluss mit Ordnern, verlorenen Rechnungen und „wo ist nur die Garantiekarte“.",
    items: [
      { title: "Übersichtliche Historie", text: "Eine Zeitleiste von allem — von der Kesselprüfung bis zur Badrenovierung, mit Fotos und Kosten." },
      { title: "Ausstattung und Materialien", text: "„Was ist in meinem Haus“ — Armaturen, Kessel, Böden… mit Preis, Garantie und Belegen." },
      { title: "Dokumente beisammen", text: "Verträge, Pläne, Energieausweis, Zertifikate und Rechnungen immer griffbereit." },
      { title: "Erinnerungen", text: "Prüfungen, Wartung und Garantien — BULO erinnert Sie, bevor die Frist abläuft." },
      { title: "Übergabe beim Verkauf", text: "Die gesamte Historie samt Bericht übergeben Sie in einem Schritt dem neuen Eigentümer." },
      { title: "Immobilienbericht", text: "Ein vertrauenswürdiger Überblick über Zustand und Pflege zum Drucken oder als PDF — Ihr „CarVertical-Bericht“." },
    ],
  },
  how: {
    heading: "So funktioniert's",
    sub: "Drei Schritte. Kein komplizierter Papierkram.",
    steps: [
      { title: "Pass anlegen", text: "Beim Kauf, bei der Renovierung — oder einfach jetzt. Laden Sie Vertrag, Energieausweis und ein paar Fotos hoch." },
      { title: "Historie führen", text: "Erfassen Sie Reparaturen, Prüfungen und Ausstattung. Erinnerungen passen auf, Dokumente sind griffbereit." },
      { title: "Weitergeben", text: "Beim Verkauf übergeben Sie den ganzen Pass samt Bericht dem neuen Eigentümer. Ein Mehrwert." },
    ],
  },
  who: {
    heading: "Für wen BULO ist",
    items: [
      { title: "Eigentümer", text: "Haben Sie die Historie Ihres Hauses griffbereit, behalten Sie Garantien und Prüfungen im Blick und belegen Sie beim Verkauf die Pflege." },
      { title: "Architekten und Firmen", text: "Professionelle Projektübergabe an den Kunden — Dokumentation, Fotos und Materialien statt PDF und WeTransfer." },
      { title: "Käufer und Makler", text: "Ein vertrauenswürdiger Bericht über Zustand und Historie der Immobilie. Schluss mit der Katze im Sack." },
    ],
  },
  cta: {
    title: "Starten Sie noch heute",
    sub: "Kostenlos, sofort und ohne komplizierte Einrichtung. Testen Sie die Demo an Ihrer eigenen Immobilie.",
    enter: "Zur App",
    handover: "Projekt übergeben",
  },
  footer: { privacy: "Datenschutzerklärung" },
  login: {
    title: "Anmeldung",
    sub: "Geben Sie das Passwort ein, um BULO zu betreten.",
    placeholder: "Passwort",
    button: "Anmelden",
    error: "Falsches Passwort.",
    back: "← Zurück zur Startseite",
  },
  cookies: {
    chip: "Cookies",
    zasady: "Datenschutz",
    title: "Cookies und Datenschutz",
    text: "Notwendige Cookies laufen immer, damit die Website funktioniert. Mit Ihrer Zustimmung fügen wir eine eigene Besuchsmessung hinzu — das hilft uns, die Website zu verbessern. Sie können dies jederzeit ändern oder widerrufen.",
    more: "Mehr in der Datenschutzerklärung →",
    necessary: "Notwendig",
    necessaryNote: "Immer aktiv",
    necessaryDesc: "Betrieb der Website, Sicherheit, Speichern Ihrer Wahl. Kann nicht deaktiviert werden.",
    statistics: "Statistiken",
    statisticsDesc: "Unsere eigene Besuchsmessung (ohne Dritte).",
    marketing: "Marketing",
    marketingDesc: "Werbemessung und interaktive Karten Dritter.",
    acceptAll: "Alle akzeptieren",
    save: "Auswahl speichern",
  },
};

const DICTS: Record<Lang, Dict> = { cs, sk, pl, en, de };

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: Dict }>({
  lang: "cs",
  setLang: () => {},
  t: cs,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("cs");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("bulo-lang") as Lang | null;
      if (stored && DICTS[stored]) setLangState(stored);
    } catch {
      // ignore
    }
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    try {
      localStorage.setItem("bulo-lang", l);
    } catch {
      // ignore
    }
  }

  return (
    <LangContext.Provider value={{ lang, setLang, t: DICTS[lang] }}>{children}</LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
