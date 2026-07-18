# Kde je díra: AI a automatizace ve stavebnictví a architektuře (07/2026)

> Doplněk k [alternativám výdělku](./sob-alternativy-a-realne-vydelky.md). Otázka: kde dnešní AI a automatizace nechává mezery, které může využít architekt-podnikatel, co umí programovat.

---

## 1. Nejdřív rámec: co AI žere a co nedokáže vzít

**Co AI komoditizuje (hodnota padá k nule — tady nepodnikej):**
- Vizualizace a rendery (Veras, LookX a spol. — z dnů na minuty).
- Rutinní kreslení a CAD outsourcing.
- Rané objemové studie „obecně" (Autodesk Forma od $185/měs., TestFit od $250/měs. to dělají v reálném čase; 94 % AEC firem používajících AI chce užití zvýšit — [přehled nástrojů](https://visiomake.com/en/blog/ki-software-fuer-architekten-2026-vergleich), [aec+tech](https://www.aecplustech.com/blog/top-generative-design-tools-aec-how-far-have-they-come)).
- Generické „AI wrappery" bez vlastních dat.

**Co AI vzít nemůže (tady se koncentruje hodnota):**
1. **Právní odpovědnost** — razítko, autorizace, ručení. AI radí, nepodepisuje.
2. **Fyzická realizace** — beton musí někdo vylít; roboti na hrubou stavbu existují (3DCP), na řemesla skoro ne.
3. **Lokální data a integrace** — české územní plány (PDF po šuplících obcí), katastr, DTM, ČSN za paywallem, cenová soustava ÚRS. Světové nástroje tohle neumí a pro malý jazykový trh to dělat nebudou.
4. **Důvěra a distribuce** — vztah s obcemi, developery, úřady.

Globální kontext: do contech AI tečou rekordní peníze — 4,4 mld. $ jen za Q3 2025 (+66 % meziročně), AI = 46 % všech contech investic, robotika +125 % ([Buildcheck](https://buildcheck.ai/insights-case-studies/ai-investment-booms-50b-surge-in-construction-tech-growth)). Ale skoro vše míří na velké generální dodavatele v USA (Buildots: $121M celkem, Series D 2025; Dusty Robotics; Built Robotics — [přehled](https://openasset.com/resources/ai-construction-companies/)). **Malé firmy a střední Evropa jsou obsluhované mizerně — to je strukturální díra.**

---

## 2. Díra č. 1 (česká, časově ohraničená, největší bolest): povolovací chaos do 2030

Fakta ([Česká justice](https://www.ceska-justice.cz/2025/12/vlada-odklada-digitalizaci-stavebniho-rizeni-do-roku-2030/), [ISVS](https://www.isvs.cz/digitalizace-stavebniho-rizeni-se-zlepsuje-potize-ale-pretrvavaji/), [MMR](https://mmr.gov.cz/cs/ostatni/web/novinky/stav-digitalizace-stavebniho-rizeni-na-zacatku-lis)):
- Vláda v prosinci 2025 **odložila plnou digitalizaci stavebního řízení na rok 2030** („z objektivních důvodů není možné připravit informační systémy do 31. 12. 2027").
- Portál stavebníka od startu 2024 trpí: **dvě třetiny úřadů přiznávají potíže** — ztráty dokumentů, složité přihlašování; úřady hodnotí ISSŘ známkou **4,56/10**.
- 429 z 652 stavebních úřadů jede na ISSŘ s obezličkami, 223 na starých systémech; **DTM není plně napojená, územní plány se teprve připravují**.
- Novela zákona od 1. 8. 2025 mění pravidla za pochodu; MMR samo začalo experimentovat s AI (11/2025).

**Co postavit: „Copilot stavebního řízení"** — AI asistent, který: (a) pro daný záměr a úřad řekne, co přesně doložit; (b) zkontroluje kompletnost dokumentace proti požadavkům; (c) vygeneruje podání a hlídá lhůty a změny legislativy. Zákazníci: tisíce malých ateliérů a projektantů, stavební firmy, obce. Proč ty: rozumíš dokumentaci (architekt) i kódu; zahraniční SaaS česky a podle českého zákona nikdy nepojede. Riziko: stát to jednou dodělá — ale okno je min. do 2030 a track record státu mluví za vše. Model: 1–3 tis. Kč/měs./licence; 1 000 zákazníků = 12–36 mil. Kč/rok ARR.

## 3. Díra č. 2: „český TestFit" — okamžitá proveditelnost pozemku

TestFit a Forma dělají feasibility v USA v reálném čase; **v ČR neexistuje nástroj, který by přečetl územní plán, regulativy, ochranná pásma a katastr a řekl: na téhle parcele lze postavit tohle, s touto výtěžností**. Data jsou roztroušená v nestrojových PDF po obcích — přesně ten druh špinavé práce, který nikdo nechce dělat, a proto je to příkop.

Zákazníci: developeři (platí dnes za feasibility studie desítky tisíc za kus), investoři, realitní fondy, obce. **Bonus: je to zároveň tvoje vlastní zbraň pro development** — systematicky najdeš podhodnocené pozemky dřív než trh. Model: SaaS + per-report; později data-byznys (index využitelnosti pozemků).

## 4. Díra č. 3: renovační vlna — pasporty, energetika, dotace

EU směrnice EPBD žene Evropu do renovací; ČR má statisíce budov bez dokumentace (SVJ, obce). AI + LiDAR v telefonu → **pasport budovy + energetické posouzení + automatizovaná žádost o dotaci** (Nová zelená úsporám a nástupci). Opakované příjmy z reportingu. (Pozn.: v repu už máš složku `domovni-pas` — evidentně to cítíš taky; tohle je validní směr s reálným trhem.)

## 5. Díra č. 4: AI na stavbě pro malé firmy (a pro SOB)

- **Buildots pro malé**: sledování postupu z fotek/360° záběrů proti rozpočtu a harmonogramu, automatická kontrola soupisu provedených prací a víceprací. Enterprise nástroje míří na velké GC; 95 % českého trhu jsou malé firmy bez čehokoliv. Zákazník platí, protože kontrola faktur = okamžitá úspora.
- **SOB software mozek („SOB OS")** — pro tebe nejdůležitější průsečík hardware×AI:
  1. **Vision QA vrstev**: kamera sleduje housenku, AI detekuje vady (trhliny, propady, studené spoje) a automaticky loguje protokol podle ISO/ASTM 52939 → z QA boxu z plánu se stává AI produkt prodejný VŠEM provozovatelům tiskáren, ne jen tobě.
  2. **AI slicer pro beton**: optimalizace drah, časování vrstev podle tuhnutí (data z tisků = učící se smyčka, kterou konkurence bez provozu nemá).
  3. **Printability check**: nahraješ DWG/IFC → AI přechroustá návrh na tisknutelný (tloušťky, přesahy, dutiny, předběžná statika) → odpadá inženýrské hrdlo každé 3DCP zakázky.
- **Roboti na dokončovací řemesla** (malování, omítky, sádrokarton — Okibo, Canvas aj.): největší neobsazená díra stavební automatizace vůbec (stěny jsou jen ~20 % domu, drahá práce jsou řemesla). Vlastní vývoj je nad tvoje síly, ale **CEE integrátor/půjčovna stavebních robotů** (import, servis, obsluha, pronájem firmám bez lidí) je reálný nízko-R&D byznys — a přesně tak začínal Alquist s KUKou na přívěsu.

---

## 6. Co z toho vybrat (doporučení)

| Hraješ na | Vyber | Proč |
|---|---|---|
| Rychlé SaaS peníze při škole | **Díra 1 (povolovací copilot)** | největší akutní bolest, okno do 2030, nulový CAPEX |
| Synergii s developmentem | **Díra 2 (feasibility)** | nástroj si zaplatí trh a tobě hledá pozemky |
| Synergii se SOB | **Díra 4 (SOB OS / vision QA)** | z tiskárny dělá datový byznys; licence ostatním |
| Nejnižší riziko | Díra 3 (pasporty/dotace) | menší strop, ale jistá poptávka; navazuje na `domovni-pas` |

**Nedělej:** vizualizační studio, generické AI wrappery, souboj s ÚRS o cenovou soustavu (ÚRS už AI nasazuje do porovnávání nabídek a výkazů — [cs-urs.cz](https://www.cs-urs.cz/ai-v-ocenovani-staveb/); existují i RozpočetPRO a RychlýRozpočet — rozpočtová díra se právě zavírá).

**Konvergence (vize na 10 let):** tvoje tři aktiva — architektura, kód, SOB — se potkávají v jednom produktu: **„dům na klik"**. AI zautomatizuje měkké náklady (projekce + inženýring + povolování ≈ 10–15 % ceny domu a měsíce času), SOB zlevní hrubou stavbu, feasibility engine najde pozemek. Nikdo v ČR nedrží celý řetězec pozemek → povolení → tisk. Každá z děr výše je samostatný byznys — a zároveň jeden díl této skládačky.

*Verze 1.0, červenec 2026.*
