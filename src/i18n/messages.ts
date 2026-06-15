export type Lang = "cs" | "en" | "de";
export const LANGS: Lang[] = ["cs", "en", "de"];
export const DEFAULT_LANG: Lang = "cs";
export const LANG_COOKIE = "eika_lang";

type Dict = Record<string, { cs: string; en: string; de: string }>;

// UI texty webu (čeština / angličtina / němčina)
const M: Dict = {
  // Header
  "search.placeholder": {
    cs: "Co hledáte? Např. jekl, vrut, sloupek…",
    en: "What are you looking for? E.g. tube, screw, post…",
    de: "Wonach suchen Sie? Z. B. Rohr, Schraube, Pfahl…",
  },
  "search.button": { cs: "Hledat", en: "Search", de: "Suchen" },
  "account.my": { cs: "Moje Eika", en: "My Eika", de: "Mein Eika" },
  "account.login": { cs: "Přihlásit se", en: "Sign in", de: "Anmelden" },
  "account.account": { cs: "Můj účet", en: "My account", de: "Mein Konto" },
  "nav.deals": { cs: "Cenové hity", en: "Top deals", de: "Top-Angebote" },
  "nav.contact": { cs: "Kontakt", en: "Contact", de: "Kontakt" },
  "nav.catalog": { cs: "Katalog", en: "Catalogue", de: "Katalog" },
  "nav.inquiry": { cs: "Poptávka", en: "Request a quote", de: "Anfrage" },
  "nav.back": { cs: "Zpět", en: "Back", de: "Zurück" },
  "nav.about": { cs: "O nás", en: "About us", de: "Über uns" },
  "nav.onlineShop": { cs: "Online obchod", en: "Online shop", de: "Online-Shop" },
  "badge.tagline": { cs: "Spolehlivý partner", en: "Reliable partner", de: "Zuverlässiger Partner" },
  "badge.since": { cs: "od roku 1991", en: "since 1991", de: "seit 1991" },
  "badge.cta": { cs: "Zjistěte víc", en: "Find out more", de: "Mehr erfahren" },

  // O společnosti
  "about.title": { cs: "O společnosti EIKA", en: "About EIKA", de: "Über EIKA" },
  "about.intro": { cs: "Tradice od roku 1991, tisíce položek skladem a osobní přístup.", en: "Tradition since 1991, thousands of items in stock and a personal approach.", de: "Tradition seit 1991, Tausende Artikel auf Lager und persönlicher Service." },
  "about.historyTitle": { cs: "Naše historie", en: "Our history", de: "Unsere Geschichte" },
  "about.historyText": { cs: "EIKA ZNOJMO, a.s. působí na trhu od roku 1991 a patří k největším dodavatelům hutního materiálu, železářství a potřeb pro vinohradnictví na jižní Moravě. Za více než 30 let jsme si vybudovali pověst spolehlivého partnera firem, živnostníků i koncových zákazníků.", en: "EIKA ZNOJMO, a.s. has been on the market since 1991 and is one of the largest suppliers of metal materials, hardware and viticulture supplies in South Moravia. Over more than 30 years we have built a reputation as a reliable partner for companies, tradespeople and consumers.", de: "EIKA ZNOJMO, a.s. ist seit 1991 am Markt und einer der größten Lieferanten von Hüttenmaterial, Eisenwaren und Weinbaubedarf in Südmähren. In über 30 Jahren haben wir uns den Ruf eines zuverlässigen Partners für Firmen, Gewerbetreibende und Endkunden erarbeitet." },
  "about.offerTitle": { cs: "Co nabízíme", en: "What we offer", de: "Was wir bieten" },
  "about.deliveryTitle": { cs: "Kam dodáváme", en: "Where we deliver", de: "Wohin wir liefern" },
  "about.deliveryText": { cs: "Zboží si odeberete osobně na pobočkách v Brně a Znojmě, nebo vám ho dovezeme. Zajišťujeme závoz materiálu na stavbu i provozovnu podle objemu objednávky – působíme především na jižní Moravě s rozvozem po celé ČR.", en: "You can collect goods in person at our Brno and Znojmo branches, or we will deliver them to you. We arrange delivery of material to your site or premises according to the order volume – we operate mainly in South Moravia with delivery across the country.", de: "Sie holen die Ware persönlich in den Filialen Brno und Znojmo ab, oder wir liefern sie Ihnen. Wir liefern Material je nach Bestellvolumen zur Baustelle und zum Betrieb – wir sind vor allem in Südmähren tätig, mit Lieferung im ganzen Land." },
  "about.branchesTitle": { cs: "Naše pobočky", en: "Our branches", de: "Unsere Filialen" },
  "seo.stockSuffix": { cs: "Skladem, osobní odběr Brno a Znojmo i doprava.", en: "In stock, pickup in Brno and Znojmo or delivery.", de: "Auf Lager, Abholung in Brno und Znojmo oder Lieferung." },

  // Inquiry / Poptávka
  "inq.title": { cs: "Poptávka", en: "Request a quote", de: "Anfrage" },
  "inq.intro": { cs: "Nezávazně poptejte zboží – ozveme se vám s cenou, dostupností a termínem dodání.", en: "Send a non-binding inquiry – we will get back to you with price, availability and delivery date.", de: "Senden Sie eine unverbindliche Anfrage – wir melden uns mit Preis, Verfügbarkeit und Liefertermin." },
  "inq.name": { cs: "Jméno a příjmení / firma", en: "Name / company", de: "Name / Firma" },
  "inq.email": { cs: "Váš e-mail", en: "Your email", de: "Ihre E-Mail" },
  "inq.phone": { cs: "Váš telefon", en: "Your phone", de: "Ihr Telefon" },
  "inq.place": { cs: "Místo dodání zboží", en: "Delivery location", de: "Lieferort" },
  "inq.message": { cs: "Poptáváme", en: "Your request", de: "Ihre Anfrage" },
  "inq.messagePlaceholder": { cs: "Napište, o jaké zboží a množství máte zájem…", en: "Describe the goods and quantity you are interested in…", de: "Beschreiben Sie Ware und Menge, die Sie interessieren…" },
  "inq.submit": { cs: "Odeslat poptávku", en: "Send request", de: "Anfrage senden" },
  "inq.sent": { cs: "Poptávka odeslána", en: "Request sent", de: "Anfrage gesendet" },
  "inq.sentText": { cs: "Děkujeme! Vaši poptávku jsme přijali a brzy se vám ozveme.", en: "Thank you! We have received your request and will contact you soon.", de: "Danke! Wir haben Ihre Anfrage erhalten und melden uns bald." },
  "nav.favorites": { cs: "Oblíbené", en: "Favourites", de: "Favoriten" },
  "nav.orders": { cs: "Objednávky", en: "Orders", de: "Bestellungen" },

  // Home
  "home.banner.title": {
    cs: "Eika dny — slevy na celý sortiment",
    en: "Eika Days — discounts across the range",
    de: "Eika-Tage — Rabatte auf das ganze Sortiment",
  },
  "home.banner.text": {
    cs: "Hutní materiál, železářství a vinohradnictví za zvýhodněné ceny.",
    en: "Metal materials, hardware and viticulture at special prices.",
    de: "Hüttenmaterial, Eisenwaren und Weinbau zu Sonderpreisen.",
  },
  "home.banner.cta": { cs: "Nakoupit se slevou", en: "Shop the deals", de: "Mit Rabatt kaufen" },
  "home.deals": { cs: "Cenové hity", en: "Top deals", de: "Top-Angebote" },
  "home.all": { cs: "Vše ›", en: "All ›", de: "Alle ›" },
  "home.recommended": { cs: "Doporučujeme", en: "We recommend", de: "Empfehlungen" },
  "home.fullCatalog": { cs: "Celý katalog ›", en: "Full catalogue ›", de: "Ganzer Katalog ›" },

  // Hero banner
  "hero.t1": { cs: "Kvalitní materiál", en: "Quality material", de: "Qualitätsmaterial" },
  "hero.t2a": { cs: "Pro", en: "For", de: "Für" },
  "hero.t2b": { cs: "každý projekt", en: "every project", de: "jedes Projekt" },
  "hero.sub": { cs: "Kvalitní železářství, vinohradnické potřeby a hutní materiál pro firmy i profesionály.", en: "Quality hardware, viticulture supplies and metal materials for companies and professionals.", de: "Hochwertige Eisenwaren, Weinbaubedarf und Hüttenmaterial für Firmen und Profis." },
  "hero.retail": { cs: "Maloobchod", en: "Retail", de: "Einzelhandel" },
  "hero.f1t": { cs: "Velké skladové zásoby", en: "Large stock", de: "Großes Lager" },
  "hero.f1s": { cs: "tisíce položek skladem", en: "thousands of items in stock", de: "Tausende Artikel auf Lager" },
  "hero.f2t": { cs: "Rychlé dodání", en: "Fast delivery", de: "Schnelle Lieferung" },
  "hero.f2s": { cs: "po celé ČR", en: "across the country", de: "landesweit" },
  "stat.h1": { cs: "Tradice od roku 1991", en: "Tradition since 1991", de: "Tradition seit 1991" },
  "stat.s1": { cs: "spolehlivý dodavatel pro firmy i živnostníky", en: "a reliable supplier for companies and tradespeople", de: "ein zuverlässiger Lieferant für Firmen und Gewerbe" },
  "stat.h2": { cs: "Tisíce položek skladem", en: "Thousands of items in stock", de: "Tausende Artikel auf Lager" },
  "stat.s2": { cs: "připraveno k odběru na pobočkách Brno a Znojmo", en: "ready to collect at our Brno and Znojmo branches", de: "abholbereit in den Filialen Brno und Znojmo" },
  "stat.h3": { cs: "Doprava až k vám", en: "Delivery to your door", de: "Lieferung bis zu Ihnen" },
  "stat.s3": { cs: "závoz materiálu na stavbu i provozovnu", en: "we deliver material to your site or premises", de: "Materiallieferung zur Baustelle und zum Betrieb" },

  // Promo tiles (4 dlaždice)
  "promo.t1": { cs: "Velkoobchod", en: "Wholesale", de: "Großhandel" },
  "promo.x1": { cs: "Velký výběr hutního materiálu pro firmy a živnostníky po celé ČR.", en: "A large selection of metal materials for companies and tradespeople nationwide.", de: "Große Auswahl an Hüttenmaterial für Firmen und Gewerbe landesweit." },
  "promo.b1": { cs: "Velkoobchod", en: "Wholesale", de: "Großhandel" },
  "promo.t2": { cs: "Železářství", en: "Hardware", de: "Eisenwaren" },
  "promo.x2": { cs: "Široký sortiment najdete i na našich pobočkách v Brně a Znojmě.", en: "Find a wide range also at our branches in Brno and Znojmo.", de: "Breites Sortiment auch in unseren Filialen in Brno und Znojmo." },
  "promo.b2": { cs: "Pobočky", en: "Branches", de: "Filialen" },
  "promo.t3": { cs: "Online", en: "Online", de: "Online" },
  "promo.x3": { cs: "Vyberte si zboží a vytvořte poptávku pohodlně a rychle online.", en: "Pick your goods and create an inquiry quickly and easily online.", de: "Wählen Sie Ware und erstellen Sie bequem und schnell eine Online-Anfrage." },
  "promo.b3": { cs: "Eika online", en: "Eika online", de: "Eika online" },
  "promo.t4": { cs: "Služby", en: "Services", de: "Leistungen" },
  "promo.x4": { cs: "Zboží Vám rozdělíme, nařežeme, certifikujeme i dovezeme.", en: "We will cut, divide, certify and deliver your goods.", de: "Wir teilen, schneiden, zertifizieren und liefern Ihre Ware." },
  "promo.b4": { cs: "Služby", en: "Services", de: "Leistungen" },

  // Product card / common
  "stock.in": { cs: "Skladem", en: "In stock", de: "Auf Lager" },
  "stock.onRequest": { cs: "Na dotaz", en: "On request", de: "Auf Anfrage" },
  "price.perUnit": { cs: "bez DPH", en: "excl. VAT", de: "ohne MwSt." },
  "price.withVat": { cs: "s DPH", en: "incl. VAT", de: "inkl. MwSt." },
  "cart.add": { cs: "Do košíku", en: "Add to cart", de: "In den Warenkorb" },
  "cart.added": { cs: "Přidáno", en: "Added", de: "Hinzugefügt" },
  "code": { cs: "Kód", en: "Code", de: "Code" },

  // Catalog / filters
  "crumb.home": { cs: "Úvod", en: "Home", de: "Start" },
  "catalog.title": { cs: "Katalog zboží", en: "Product catalogue", de: "Produktkatalog" },
  "catalog.resultsFor": { cs: "Výsledky pro", en: "Results for", de: "Ergebnisse für" },
  "catalog.all": { cs: "Vše", en: "All", de: "Alle" },
  "catalog.none": { cs: "Pro hledaný výraz jsme nic nenašli.", en: "We found nothing for your search.", de: "Wir haben nichts gefunden." },
  "filters": { cs: "Filtry", en: "Filters", de: "Filter" },
  "filters.clear": { cs: "Zrušit", en: "Clear", de: "Zurücksetzen" },
  "filters.availability": { cs: "Dostupnost", en: "Availability", de: "Verfügbarkeit" },
  "filters.inStockOnly": { cs: "Pouze skladem", en: "In stock only", de: "Nur auf Lager" },
  "filters.saleOnly": { cs: "Pouze v akci", en: "On sale only", de: "Nur im Angebot" },
  "filters.priceUpTo": { cs: "Cena do", en: "Price up to", de: "Preis bis" },
  "filters.kind": { cs: "Druh zboží", en: "Product type", de: "Warenart" },
  "filters.brand": { cs: "Značka", en: "Brand", de: "Marke" },
  "filters.showN": { cs: "Zobrazit produkty", en: "Show products", de: "Produkte anzeigen" },
  "filters.empty": { cs: "Žádné zboží neodpovídá filtrům.", en: "No products match the filters.", de: "Keine Produkte entsprechen den Filtern." },
  "sort.by": { cs: "Řadit", en: "Sort", de: "Sortieren" },
  "sort.recommended": { cs: "Doporučené", en: "Recommended", de: "Empfohlen" },
  "sort.cheapest": { cs: "Nejlevnější", en: "Cheapest", de: "Günstigste" },
  "sort.expensive": { cs: "Nejdražší", en: "Most expensive", de: "Teuerste" },
  "sort.rating": { cs: "Nejlépe hodnocené", en: "Top rated", de: "Bestbewertet" },
  "sort.name": { cs: "Název A–Z", en: "Name A–Z", de: "Name A–Z" },
  "count.products": { cs: "produktů", en: "products", de: "Produkte" },

  // Category page
  "cat.otherFields": { cs: "Další obory", en: "Other categories", de: "Weitere Kategorien" },

  // Product detail
  "pd.companyPrice": { cs: "Firemní cena", en: "Business price", de: "Firmenpreis" },
  "pd.forBusiness": { cs: "pro firmy a živnostníky", en: "for companies and tradespeople", de: "für Firmen und Gewerbetreibende" },
  "pd.branchAvailability": { cs: "Dostupnost na pobočkách", en: "Availability at branches", de: "Verfügbarkeit in Filialen" },
  "pd.branch": { cs: "Pobočka", en: "Branch", de: "Filiale" },
  "pd.inStockShort": { cs: "skladem", en: "in stock", de: "auf Lager" },
  "pd.tab.desc": { cs: "Popis", en: "Description", de: "Beschreibung" },
  "pd.tab.params": { cs: "Parametry", en: "Specifications", de: "Eigenschaften" },
  "pd.tab.reviews": { cs: "Hodnocení", en: "Reviews", de: "Bewertungen" },
  "pd.ratingsCount": { cs: "hodnocení", en: "reviews", de: "Bewertungen" },
  "pd.related": { cs: "Související zboží", en: "Related products", de: "Ähnliche Produkte" },

  // Cart
  "cart.title": { cs: "Košík a objednávka", en: "Cart & order", de: "Warenkorb & Bestellung" },
  "cart.empty": { cs: "Košík je prázdný", en: "Your cart is empty", de: "Ihr Warenkorb ist leer" },
  "cart.emptyText": { cs: "Přidejte zboží z katalogu a vraťte se sem pro dokončení objednávky.", en: "Add products from the catalogue and come back to finish your order.", de: "Fügen Sie Produkte aus dem Katalog hinzu und schließen Sie hier Ihre Bestellung ab." },
  "cart.browse": { cs: "Procházet katalog", en: "Browse catalogue", de: "Katalog durchsuchen" },
  "cart.continue": { cs: "Pokračovat v nákupu", en: "Continue shopping", de: "Weiter einkaufen" },
  "cart.sent": { cs: "Objednávka odeslána", en: "Order sent", de: "Bestellung gesendet" },
  "cart.sentText": { cs: "Děkujeme! Vaše poptávka byla přijata. Brzy se vám ozveme s potvrzením a termínem dodání.", en: "Thank you! Your request has been received. We will contact you shortly with confirmation and a delivery date.", de: "Danke! Ihre Anfrage ist eingegangen. Wir melden uns in Kürze mit Bestätigung und Liefertermin." },
  "cart.customerData": { cs: "Údaje objednavatele", en: "Customer details", de: "Bestellerdaten" },
  "cart.customerType": { cs: "Typ zákazníka", en: "Customer type", de: "Kundentyp" },
  "cart.company": { cs: "Firma", en: "Company", de: "Firma" },
  "cart.tradesperson": { cs: "Živnostník", en: "Tradesperson", de: "Gewerbetreibender" },
  "cart.consumer": { cs: "Koncový zákazník", en: "Consumer", de: "Endkunde" },
  "cart.companyOrName": { cs: "Název firmy / jméno", en: "Company / name", de: "Firma / Name" },
  "cart.fullName": { cs: "Jméno a příjmení", en: "Full name", de: "Vor- und Nachname" },
  "cart.email": { cs: "E-mail", en: "Email", de: "E-Mail" },
  "cart.phone": { cs: "Telefon", en: "Phone", de: "Telefon" },
  "cart.cityAddress": { cs: "Město / dodací adresa", en: "City / delivery address", de: "Stadt / Lieferadresse" },
  "cart.delivery": { cs: "Způsob dodání", en: "Delivery method", de: "Lieferart" },
  "cart.delivery.toAddress": { cs: "Závoz na adresu", en: "Delivery to address", de: "Lieferung an Adresse" },
  "cart.delivery.pickupBrno": { cs: "Osobní odběr — pobočka Brno", en: "Pickup — Brno branch", de: "Abholung — Filiale Brno" },
  "cart.delivery.pickupZnojmo": { cs: "Osobní odběr — pobočka Znojmo", en: "Pickup — Znojmo branch", de: "Abholung — Filiale Znojmo" },
  "cart.note": { cs: "Poznámka k objednávce", en: "Order note", de: "Bestellnotiz" },
  "cart.notePlaceholder": { cs: "Např. požadované dělení materiálu, termín závozu…", en: "E.g. required cutting, delivery date…", de: "Z. B. gewünschter Zuschnitt, Liefertermin…" },
  "cart.submit": { cs: "Odeslat objednávku", en: "Send order", de: "Bestellung senden" },
  "cart.submitNote": { cs: "Odesláním nezávazně poptáváte zboží. Potvrdíme dostupnost, cenu a termín.", en: "This is a non-binding request. We will confirm availability, price and date.", de: "Unverbindliche Anfrage. Wir bestätigen Verfügbarkeit, Preis und Termin." },
  "cart.summary": { cs: "Souhrn", en: "Summary", de: "Zusammenfassung" },
  "cart.subtotal": { cs: "Mezisoučet (bez DPH)", en: "Subtotal (excl. VAT)", de: "Zwischensumme (ohne MwSt.)" },
  "cart.vat": { cs: "DPH 21 %", en: "VAT 21%", de: "MwSt. 21%" },
  "cart.shipping": { cs: "Doprava", en: "Shipping", de: "Versand" },
  "cart.shippingValue": { cs: "dle dohody", en: "by arrangement", de: "nach Vereinbarung" },
  "cart.totalVat": { cs: "Celkem s DPH", en: "Total incl. VAT", de: "Gesamt inkl. MwSt." },
  "cart.recommended": { cs: "Mohlo by se hodit", en: "You might also like", de: "Könnte Ihnen gefallen" },
  "cart.required": { cs: "povinné pole", en: "required", de: "Pflichtfeld" },

  // Contact
  "contact.title": { cs: "Kontakt a pobočky", en: "Contact & branches", de: "Kontakt & Filialen" },
  "contact.intro": { cs: "Jsme tu pro firmy, živnostníky i koncové zákazníky. Ozvěte se nám – poradíme s výběrem materiálu, cenou i dopravou.", en: "We are here for companies, tradespeople and consumers. Get in touch – we will help with material selection, price and delivery.", de: "Wir sind für Firmen, Gewerbetreibende und Endkunden da. Melden Sie sich – wir beraten zu Material, Preis und Lieferung." },
  "contact.hours": { cs: "Otevírací doba", en: "Opening hours", de: "Öffnungszeiten" },
  "contact.write": { cs: "Napište nám", en: "Write to us", de: "Schreiben Sie uns" },
  "contact.formIntro": { cs: "Poptávka, dotaz na sortiment nebo cenu — odpovíme co nejdříve.", en: "Inquiry about products or price — we will reply as soon as possible.", de: "Anfrage zu Sortiment oder Preis — wir antworten so schnell wie möglich." },
  "contact.send": { cs: "Odeslat zprávu", en: "Send message", de: "Nachricht senden" },
  "contact.mon_fri": { cs: "Pondělí – Pátek", en: "Monday – Friday", de: "Montag – Freitag" },
  "contact.sat": { cs: "Sobota", en: "Saturday", de: "Samstag" },
  "contact.sun": { cs: "Neděle", en: "Sunday", de: "Sonntag" },
  "contact.closed": { cs: "Zavřeno", en: "Closed", de: "Geschlossen" },

  // Footer
  "footer.range": { cs: "Sortiment", en: "Range", de: "Sortiment" },
  "footer.shopping": { cs: "Nákup", en: "Shopping", de: "Einkauf" },
  "footer.cart": { cs: "Košík", en: "Cart", de: "Warenkorb" },
  "footer.admin": { cs: "Administrace", en: "Administration", de: "Verwaltung" },
  "footer.allContacts": { cs: "Všechny kontakty ›", en: "All contacts ›", de: "Alle Kontakte ›" },
  "footer.fullCatalog": { cs: "Celý katalog", en: "Full catalogue", de: "Ganzer Katalog" },

  // Favorites page
  "fav.title": { cs: "Oblíbené", en: "Favourites", de: "Favoriten" },
  "fav.empty": { cs: "Zatím nemáte žádné oblíbené zboží.", en: "You have no favourites yet.", de: "Sie haben noch keine Favoriten." },
  "fav.emptyHint": { cs: "Klikněte na srdíčko u produktu a uložíte si ho sem na později.", en: "Click the heart on a product to save it here for later.", de: "Klicken Sie auf das Herz, um ein Produkt hier zu speichern." },

  // units
  "unit.ks": { cs: "ks", en: "pcs", de: "Stk" },
  "unit.bal": { cs: "bal.", en: "pack", de: "Pck" },
};

export function t(lang: Lang, key: string, vars?: Record<string, string | number>): string {
  const entry = M[key];
  let s = entry ? entry[lang] : key;
  if (vars) {
    for (const k of Object.keys(vars)) s = s.replace(`{${k}}`, String(vars[k]));
  }
  return s;
}

// Překlad měrné jednotky
export function unit(lang: Lang, u: string): string {
  if (lang === "cs") return u;
  if (u === "ks") return t(lang, "unit.ks");
  if (u === "bal.") return t(lang, "unit.bal");
  return u; // m, kg, m² zůstávají
}
