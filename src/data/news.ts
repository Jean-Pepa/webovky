import type { Lang } from "@/i18n/messages";

type L = { cs: string; en: string; de: string };

export type Article = {
  slug: string;
  date: string; // ISO
  badge?: L;
  title: L;
  excerpt: L;
  body: L; // odstavce oddělené prázdným řádkem
};

export const ARTICLES: Article[] = [
  {
    slug: "doprava-do-15-km-zdarma",
    date: "2026-05-20",
    badge: { cs: "Akce", en: "Offer", de: "Aktion" },
    title: {
      cs: "Doprava do 15 km zdarma",
      en: "Free delivery within 15 km",
      de: "Kostenlose Lieferung bis 15 km",
    },
    excerpt: {
      cs: "Objednejte hutní materiál nebo zboží ze železářství a my vám ho dovezeme po Znojmě a okolí do 15 km zdarma.",
      en: "Order metal material or hardware goods and we will deliver them around Znojmo within 15 km for free.",
      de: "Bestellen Sie Hüttenmaterial oder Eisenwaren und wir liefern bis 15 km rund um Znojmo kostenlos.",
    },
    body: {
      cs: "Víme, že doprava materiálu na stavbu nebo do dílny umí pořádně prodražit nákup. Proto vám materiál dovezeme vlastní dopravou po Znojmě a okolí do 15 km zcela zdarma.\n\nU větších vzdáleností nebo nadrozměrných zakázek vám rádi připravíme dopravu na míru – ozvěte se nám a domluvíme termín i cenu.",
      en: "We know that transporting material to a site or workshop can make a purchase significantly more expensive. That is why we deliver material with our own transport around Znojmo within 15 km completely free.\n\nFor longer distances or oversized orders we are happy to arrange tailored transport – contact us and we will agree on a date and price.",
      de: "Wir wissen, dass der Transport von Material zur Baustelle oder Werkstatt einen Einkauf deutlich verteuern kann. Deshalb liefern wir Material mit eigenem Transport bis 15 km rund um Znojmo völlig kostenlos.\n\nFür größere Entfernungen oder Übergrößen organisieren wir gern einen maßgeschneiderten Transport – kontaktieren Sie uns.",
    },
  },
  {
    slug: "velky-vyprodej-skladovych-zasob",
    date: "2026-04-08",
    badge: { cs: "Výprodej", en: "Sale", de: "Ausverkauf" },
    title: {
      cs: "Velký výprodej skladových zásob",
      en: "Big clearance of stock",
      de: "Großer Lagerausverkauf",
    },
    excerpt: {
      cs: "Vybrané položky hutního materiálu a železářství nyní za zvýhodněné ceny – do vyprodání zásob.",
      en: "Selected metal material and hardware items now at discounted prices – while stocks last.",
      de: "Ausgewählte Artikel aus Hüttenmaterial und Eisenwaren jetzt zu Sonderpreisen – solange der Vorrat reicht.",
    },
    body: {
      cs: "Uvolňujeme skladové kapacity a pouštíme vybrané položky za zvýhodněné ceny. Najdete mezi nimi profily, jekly, plechy i spojovací materiál.\n\nNabídka platí do vyprodání zásob. Pro aktuální dostupnost a ceny nás kontaktujte nebo se zastavte na pobočce.",
      en: "We are freeing up warehouse capacity and offering selected items at discounted prices, including profiles, square tubes, sheets and fasteners.\n\nThe offer is valid while stocks last. For current availability and prices, contact us or visit a branch.",
      de: "Wir schaffen Lagerkapazität und bieten ausgewählte Artikel zu Sonderpreisen – Profile, Vierkantrohre, Bleche und Verbindungselemente.\n\nDas Angebot gilt, solange der Vorrat reicht. Für aktuelle Verfügbarkeit und Preise kontaktieren Sie uns.",
    },
  },
  {
    slug: "vse-pro-vinohradnictvi-na-novou-sezonu",
    date: "2026-03-03",
    badge: { cs: "Sezóna", en: "Season", de: "Saison" },
    title: {
      cs: "Vše pro vinohradnictví na novou sezónu",
      en: "Everything for viticulture for the new season",
      de: "Alles für den Weinbau für die neue Saison",
    },
    excerpt: {
      cs: "Sloupky, dráty, vázací materiál i nářadí – připravte svou vinici na novou sezónu s EIKA.",
      en: "Posts, wires, tying material and tools – get your vineyard ready for the new season with EIKA.",
      de: "Pfosten, Drähte, Bindematerial und Werkzeug – machen Sie Ihren Weinberg mit EIKA fit.",
    },
    body: {
      cs: "S příchodem jara máme naskladněné vše potřebné pro vinohradníky – pozinkované sloupky, vázací dráty, napínáky i drobné nářadí.\n\nPotřebujete poradit s množstvím nebo kompletací? Rádi vám pomůžeme vybrat a připravíme nabídku na míru vaší vinici.",
      en: "With spring arriving, we have everything vine-growers need in stock – galvanised posts, tying wires, tensioners and small tools.\n\nNeed advice on quantities or assembly? We are happy to help you choose and prepare an offer tailored to your vineyard.",
      de: "Zum Frühling haben wir alles für Winzer auf Lager – verzinkte Pfosten, Bindedrähte, Spanner und Kleinwerkzeug.\n\nBrauchen Sie Beratung zu Mengen? Wir helfen gern bei der Auswahl und erstellen ein Angebot für Ihren Weinberg.",
    },
  },
  {
    slug: "darkovy-poukaz-eika",
    date: "2026-01-15",
    badge: { cs: "Novinka", en: "News", de: "Neu" },
    title: {
      cs: "Dárkový poukaz EIKA",
      en: "EIKA gift voucher",
      de: "EIKA-Geschenkgutschein",
    },
    excerpt: {
      cs: "Nevíte, jaký dárek vybrat? Pořiďte dárkový poukaz EIKA v libovolné hodnotě.",
      en: "Not sure what gift to choose? Get an EIKA gift voucher of any value.",
      de: "Unsicher bei der Geschenkwahl? Holen Sie sich einen EIKA-Geschenkgutschein.",
    },
    body: {
      cs: "Dárkový poukaz EIKA je ideální tip pro kutily, řemeslníky i vinaře. Vyberete hodnotu, obdarovaný si pak sám zvolí zboží z našeho sortimentu.\n\nPoukaz zakoupíte na pobočce. Pro více informací nás neváhejte kontaktovat.",
      en: "An EIKA gift voucher is an ideal tip for DIY enthusiasts, craftsmen and winemakers. You choose the value, the recipient then picks goods from our range.\n\nVouchers are available at our branches. For more information, do not hesitate to contact us.",
      de: "Ein EIKA-Geschenkgutschein ist ideal für Heimwerker, Handwerker und Winzer. Sie wählen den Wert, der Beschenkte wählt die Ware aus unserem Sortiment.\n\nGutscheine erhalten Sie in unseren Filialen. Für weitere Informationen kontaktieren Sie uns.",
    },
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export type LocArticle = {
  slug: string;
  date: string;
  badge?: string;
  title: string;
  excerpt: string;
  paragraphs: string[];
};

export function locArticle(a: Article, lang: Lang): LocArticle {
  return {
    slug: a.slug,
    date: a.date,
    badge: a.badge?.[lang],
    title: a.title[lang],
    excerpt: a.excerpt[lang],
    paragraphs: a.body[lang].split("\n\n"),
  };
}

export function locArticles(lang: Lang): LocArticle[] {
  return [...ARTICLES]
    .sort((x, y) => (x.date < y.date ? 1 : -1))
    .map((a) => locArticle(a, lang));
}
