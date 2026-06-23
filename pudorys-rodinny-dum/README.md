# Půdorys rodinného domu 10,0 × 8,5 m — dvoupodlažní s garáží

Dispoziční studie (2D půdorys) rodinného domu o půdorysném rozměru **10,0 × 8,5 m**
(zastavěná plocha 85 m²), dvoupodlažní, s **integrovanou garáží pro 1 osobní automobil**.

Soubory:
- **`pudorys.svg`** — vektorová kresba (lze otevřít v prohlížeči, dále upravovat ve Figmě / Inkscape / AutoCADu).
- **`pudorys.png`** — rastrový náhled.
- **`generate_plan.py`** — generátor kresby (Python). Spuštění: `python3 generate_plan.py`
  (vyžaduje `cairosvg` jen pro export PNG; SVG se vytvoří vždy).

## Návrhové podklady (normy)

Návrh respektuje doporučené architektonické rozměry a tyto ČSN:

| Norma | Oblast |
|-------|--------|
| ČSN 73 4301 | Obytné budovy — minimální plochy a šířky místností, světlé výšky |
| ČSN 73 6058 | Jednotlivé, řadové a hromadné garáže — stání pro osobní automobil |
| ČSN 73 4130 | Schodiště a šikmé rampy |
| ČSN 73 4108 | Hygienická zařízení a šatny |

## Konstrukční předpoklady

- Obvodové zdivo **300 mm**, vnitřní nosná zeď **300 mm**, příčky **150 mm**.
- Konstrukční výška podlaží **3,0 m**, světlá výška obytných místností **min. 2,6 m**.
- Schodiště **dvouramenné**, šířka ramene **0,95 m**, **17 stupňů 176 × 270 mm**
  (2h + b = 622 mm — v doporučeném rozmezí ČSN 73 4130).
- Garážové stání **3,5 × 5,65 m** (sekční vrata 2,5 m) — nad doporučené minimum jednotlivé garáže.
- Měřítko výkresu **1:100**.

## Dispozice

### Přízemí (1. NP)
| Místnost | Plocha |
|----------|-------:|
| Obývací pokoj + kuchyně + jídelna | 21,6 m² |
| Schodiště | 9,2 m² |
| Zádveří + chodba | 8,9 m² |
| Technická místnost | 7,4 m² |
| Spíž | 1,7 m² |
| WC | 1,4 m² |
| Garáž (1 automobil) | 19,8 m² |

Vstup je v čele domu vlevo (zádveří se botníkem), garážová vrata vpravo. Z garáže
je možný přímý vstup do domu a do technické místnosti (kotel, příprava TV).

### Patro (2. NP)
| Místnost | Plocha |
|----------|-------:|
| Ložnice (rodičovská) | 18,7 m² |
| Pokoj | 14,0 m² |
| Pokoj | 10,0 m² |
| Koupelna + WC | 8,4 m² |
| Chodba | 6,0 m² |
| Schodiště | 8,8 m² |
| Šatna | 3,3 m² |

Patro je vyneseno nad celým půdorysem (i nad garáží), proto poskytuje 3 pokoje,
prostornou koupelnu s WC a šatnu. Všechny místnosti jsou přístupné z centrální chodby.

## Legenda
- Tmavá výplň = nosné / dělící zdivo
- Dvojitá čára s modrým pruhem = okno
- Oblouk = otevírání dveří
- Světle šedé obrysy = zařízení / nábytek (zákres pro představu)

> Jde o **dispoziční studii**, nikoli o prováděcí dokumentaci. Pro stavbu je nutný
> projekt autorizovaného projektanta (statika, TZB, požárně bezpečnostní řešení,
> průkaz energetické náročnosti, osazení na konkrétní pozemek apod.).
