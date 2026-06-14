# EIKA – objednávková webová aplikace

Webová aplikace pro firmu **EIKA ZNOJMO, a.s.** (hutní materiál, železářství,
vinohradnictví) — objednávání a provoz pro firmy, živnostníky i koncové
zákazníky.

> Postaveno na Next.js 16 (App Router) + React 19 + Tailwind CSS 4.

## Spuštění

```bash
npm install
npm run dev
```

Aplikace běží na [http://localhost:3000](http://localhost:3000).

## Co je hotové (Fáze 1 – vzhled + katalog)

Veřejná část:

- **Úvod** (`/`) — hero, kategorie, služby, doporučené zboží, B2B blok
- **Katalog** (`/katalog`) — vyhledávání a přehled zboží
- **Kategorie** (`/katalog/[kategorie]`) — hutní materiál / železářství / vinohradnictví
- **Detail produktu** (`/produkt/[slug]`) — cena B2C/B2B, sklad, popis
- **Košík + objednávka** (`/kosik`) — košík v prohlížeči, formulář s poli pro firmy (IČO/DIČ)
- **Kontakt** (`/kontakt`) — pobočky Brno a Znojmo

Provozní část (admin):

- **Přehled** (`/admin`) — statistiky tržeb, top produkty, objednávky dle typu zákazníka
- **Produkty** (`/admin/produkty`) — přehled sortimentu
- **Objednávky** (`/admin/objednavky`) — přehled a stavy objednávek

Data jsou zatím **ukázková** (`src/data/`). 

## Další fáze (plán)

- **Fáze 2** — napojení na databázi (Supabase): produkty, objednávky, zákazníci
- **Fáze 3** — firemní účty, přihlášení, velkoobchodní ceny, historie objednávek
- **Fáze 4** — reálné statistiky a reporty v adminu

## Struktura

```
src/
  app/
    (shop)/        # veřejný web (hlavička + patička)
    admin/         # administrace (vlastní layout)
  components/      # sdílené UI prvky
  context/         # košík (CartContext)
  data/            # demo data (katalog, statistiky)
  lib/             # pomocné funkce (formátování)
```
