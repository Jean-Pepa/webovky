# 02 — VIRÁLNÍ MECHANIKA: Mechanika virality a retence pro architektonické video

> Praktická příručka pro tvorbu architektonických/dokumentárních videí (8–10 min) na YouTube v období 2025/2026. Vše je hotové k použití: šablony, čísla, nástroje, URL. Kde je údaj neověřený nebo orientační (typicky procenta z blogů nástrojů, ne z primárních dat YouTube), je označen **(neověřeno)**.

---

## OBSAH
1. [Anatomie hooku (0–30 s)](#1-anatomie-hooku-030-s)
2. [Struktura skriptu pro 8–10min retenci](#2-struktura-skriptu-pro-810min-retenci)
3. [YouTube algoritmus 2025/2026](#3-youtube-algoritmus-20252026)
4. [Packaging — šablony titulků a thumbnailů](#4-packaging--šablony-titulků-a-thumbnailů)
5. [Nástroje na A/B testování](#5-nástroje-na-ab-testování)
6. [Benchmarky a kontrolní seznamy](#6-benchmarky-a-kontrolní-seznamy)

---

## 1. ANATOMIE HOOKU (0–30 s)

### 1.1 Proč na hooku stojí vše
- **~55 % diváků odejde během první minuty**, až **50–60 % odchodů se děje v prvních 3 sekundách**. **(neověřeno)**
- Cíl: **70 % retence v 1. minutě** — tato hodnota silně koreluje s agresivním promováním algoritmem. **(neověřeno)**
- **Pattern interrupt v prvních 5 s = +23 % retence.** **(neověřeno)**
- Vyhni se: intra, channel promo, loga, dlouhého „context-setting", pozdravů („ahoj, vítejte u dalšího videa").

### 1.2 Časová šablona hooku (0–30 s) — aplikovaná na architekturu

| Čas | Funkce | Co konkrétně udělat (architektura) |
|---|---|---|
| **0:00–0:08** | Vizuální cold open (in medias res) | Teasni NEJSILNĚJŠÍ záběr z videa — dramatické odhalení budovy, detail praskliny, demolice, archivní katastrofa. Žádná mluva o sobě. |
| **0:08–0:15** | Potvrď slib + 1 konkrétní hodnota | Divák musí poznat, že video plní, co slíbil titulek+thumbnail. Vlož jedno tvrdé tvrzení: „Proč tahle stavba stála 7 let a zabila svého tvůrce." |
| **0:15–0:30** | Stakes/kontext + otevři open loop | Nadhoď velkou nezavřenou otázku, kterou zodpovíš až v závěru: „A odpověď souvisí s jedním chybným výpočtem — k tomu se dostaneme." |

> Pro dokumentární/vzdělávací žánr je přípustný i delší hook **30–45 s** — divák tu kontext toleruje, protože ho čeká.

### 1.3 Knihovna hook formulí (vyber 1, doplň placeholdery)

| Typ hooku | Vzor | Architektonický příklad |
|---|---|---|
| **Promise** | „Na konci videa pochopíš, proč…" | „Na konci videa pochopíš, proč Praha nestaví mrakodrapy." |
| **Contrarian** | „Všechno, co víš o X, je špatně." | „Paneláky nejsou výmysl komunistů — a hned ti ukážu proč." |
| **Confession / odhalení** | „Tahle budova skrývá chybu, kterou nikdo nevidí." | „Tenhle mrakodrap se naklání 28 palců — a opravit to už nejde." |
| **Open-loop** | „Tahle jedna věc změnila všechno… ale nejdřív…" | „Stála jen 7 let. Než pochopíš proč, musím ti ukázat, kdo ji navrhl." |
| **Bold claim + číslo** | „[Konkrétní číslo] [neočekávaný výsledek]." | „Stavba za 16,5 miliardy, kterou obvinili z toho, že je kopie." |
| **Result-first** (u how-to) | Ukaž výsledek hned | Hotová rekonstrukce → pak „takhle to vypadalo před 6 měsíci." |

**Doporučení:** vygeneruj vždy **3 verze hooku** — jednu vedoucí na zvědavost (curiosity), jednu na stakes/následek, jednu na konkrétní claim/číslo. Pak je A/B testuj (viz sekce 5).

### 1.4 Hotový AI prompt na hooky (copy-paste)
```
Napiš 5 úvodních hooků (každý max 15 slov, určený pro mluvený přednes)
pro architektonické YouTube video o [TÉMA/STAVBA].
Každý hook musí vytvořit zvědavost (curiosity gap) do 15 slov.
Žádné pozdravy, žádné "v tomhle videu".
Vytvoř: 2 varianty curiosity, 2 varianty stakes/následek, 1 variantu s konkrétním číslem.
```

---

## 2. STRUKTURA SKRIPTU PRO 8–10MIN RETENCI

### 2.1 Retenční skelet (celé video)

```
HOOK (0:00–0:30)
  → cold open + slib + open loop #1 (velká smyčka, zodpoví se až v závěru)

CONTEXT BRIDGE (0:30–1:30)
  → proč to má smysl / stakes / co divák získá

SEGMENT 1 (cca 1:30–3:30)   setup → development → payoff + open loop #2
SEGMENT 2 (cca 3:30–5:30)   setup → development → payoff + open loop #3
SEGMENT 3 (cca 5:30–7:30)   setup → development → payoff + open loop #4
SEGMENT 4 (cca 7:30–9:00)   setup → development → payoff

ZÁVĚR (9:00–9:45)
  → zavři velkou open loop #1 (payoff hooku) + pointa

OUTRO/END SCREEN (posledních 15–20 s)
  → "sbal" video a pošli diváka na tematicky navazující video
```

- **3–4 hlavní segmenty**, každý ~2 min, každý s vlastním obloukem **setup (proč tahle část) → development (buduj napětí/info) → payoff (odměna)**.
- **„YouTube Wave":** otevři velkou curiosity gap v hooku (payoff až v závěru), pak série mini-příběhů — každý malé napětí + malý payoff — a hned otevři novou smyčku do další vlny.

### 2.2 Open loops, re-hooky, pattern interrupts — konkrétní pravidla

| Mechanika | Pravidlo | Architektonická aplikace |
|---|---|---|
| **Open loops** | Otevřené otázky zvyšují watch time o **~32 %** **(neověřeno)** | 1 velká smyčka v hooku + 1 malá v každém segmentu (zavři ji v segmentu, hned otevři další) |
| **Pattern interrupt** | Každých **30–45 s** změň tón/vizuál/úhel | Přepínej: talking-head / voiceover ↔ B-roll budovy ↔ půdorys/řez ↔ dobová fotka ↔ animace konstrukce ↔ číslo na obrazovce |
| **Re-hook** | Před každým předělem (= místo největšího odchodu) připomeň, co ještě přijde | „Za chvíli ukážu část, kterou většina lidí dělá úplně špatně." |
| **Předěl = mikro-hook** | Přechod mezi segmenty musí fungovat jako mini-hook | „Ale právě tady to začne být zajímavé." |

> **Předěl mezi segmenty je místo nejvyššího odchodu** — nikdy ho neudělej jako pouhé „a teď k dalšímu bodu".

### 2.3 Pacing a střih (8–10 min, vzdělávací obsah)

| Pásmo videa | Pacing | Vizuál |
|---|---|---|
| **0:00–0:30** | Měň B-roll/vizuál každých **10–15 s** | talking-head → screen share → detail → cutaway |
| **0:30–3:00** | **15–25 s na střih** u talking-head | + „burst" 5–10 rychlých střihů každé 2–3 min |
| **3:00–7:00** | Stabilizuj — méně střihů, **více účelného B-roll** | B-roll ilustruje abstraktní koncepty, brání „talking-head fatigue" |
| **7:00–10:00** | Návrat k vyššímu tempu, příprava závěru | gradace k payoffu |

- **Burned-in (vypálené) titulky vždy** — zvyšují retenci o **15–25 %**. **(neověřeno)**
- Tutorialy/explainery nejlépe fungují **8–15 min** se středně pomalým pacingem.

### 2.4 Dokumentární vyprávěcí techniky
- **Curiosity gap** = mezera mezi tím, co divák ví, a co chce vědět (Vox metoda: nastav otázku na začátku, zodpověz konvenčním koncem).
- Nástroje: voiceover, archiv, re-enactment, animace, montáže.
- **Cold open** (nejsilnější moment/vizuál hned) → představení aktérů → timeline varovných signálů → proč byly ignorovány → následky a poučení.
- Tří-aktová struktura ~**25 % setup / 50 % konfrontace / 25 % rozuzlení**.
- **Architektura > fakta:** podávej stavbu přes lidský příběh (útěk před nacisty u Tugendhat, sebevražda sochaře u Stalinova pomníku, kancelář ve výtahu u Baťova mrakodrapu), ne přes suchou architekturu.

### 2.5 Hotový prompt chaining na celý skript (4 kroky)

**Placeholdery napříč všemi prompty:** `[TÉMA]`, `[STAVBA/ARCHITEKT]`, `[DÉLKA]`, `[PUBLIKUM]`, `[TÓN]`, `[VOICE REFERENCE — 200 slov ukázky stylu]`

**KROK 1 — Outline:**
```
Vytvoř 7sekční osnovu pro architektonické dokumentární YouTube video
o [STAVBA/ARCHITEKT], délka [DÉLKA], publikum [PUBLIKUM].
Seřaď segmenty kauzálně tak, aby každá sekce "earned" tu další
(příčina→následek, problém→řešení, jednoduché→složité).
Nejdřív mi schval strukturu, než budeš psát.
```

**KROK 2 — Hooky:**
```
Napiš 5 různých úvodních hooků (každý ~30 s jako voiceover odstavec)
pro toto video. Vyhni se "od úsvitu věků" otevíráním.
Každý formátuj jako odstavec pro mluvený přednes.
```

**KROK 3 — Segmenty s open loops:**
```
Rozepiš osnovu do plného skriptu. Každou ze 3–6 sekcí ukonči
"open loop tease" do další sekce. Drž tón [TÓN]. Piš pro mluvený
přednes — krátké věty. U každého odstavce navrhni konkrétní B-roll,
archivní foto, animaci nebo řez (vznikne shot-list).
Použij tento voice reference pro tón: [VOICE REFERENCE].
```

**KROK 4 — Retention audit:**
```
Projdi skript a označ každé místo, kde jdu déle než 90 sekund
bez pattern interruptu. Navrhni konkrétní interrupt (střih na B-roll,
číslo na obrazovce, přímá otázka divákovi). Přidej jeden mid-video
tease kolem 40–50 % stopáže.
```

- **Nastavení modelu:** temperature **0.3–0.5** pro faktickou naraci, **0.7–0.9** pro hooky a přechody. Model-fit: Claude pro přirozený tón/naraci, GPT-4o pro strukturu.
- **Disclaimer:** AI první draft **vždy fact-checkni** (zvlášť letopočty a čísla u architektury) a přepiš vlastním hlasem — surový AI výstup bývá plochý a obsahuje faktické chyby.

---

## 3. YOUTUBE ALGORITMUS 2025/2026

### 3.1 Zásadní posun: od watch time k satisfaction + session time
- YouTube přešel od „watch time" k **„satisfaction-weighted"** hodnocení — měří nejen kolik minut divák koukal, ale jestli byl spokojený (post-video ankety, návraty, pokračování v session).
- Tři skórovací signály:
  1. **Engagement** — CTR, watch time, komentáře, sdílení
  2. **Satisfaction** — post-video ankety, návraty, tlačítko „Not Interested"
  3. **Relevance**
- **Session time je nový král.** Video, které udrží diváka a pošle ho do dalšího videa, porazí delší video, po kterém divák appku zavře.

> **Příklad:** 22min video dokoukané na 85 %, ale po kterém divák zavře appku, skóruje **hůř** než 12min video na 60 % retence, které vede diváka do dalších 40 min browsování.

> **Pozn.:** „Retention Delta" a „Loyalty Index" jsou interpretace blogů, **(neověřeno)** jako oficiální termíny YouTube.

### 3.2 Tvar retenční křivky rozhoduje víc než průměr

| Tvar křivky | Co znamená | Akce |
|---|---|---|
| **Plynulá/plochá** | Silný signál → algoritmus promuje agresivně | Cíl |
| **Prudký sráz v prvních 30 s** | Slabý hook nebo zavádějící titulek/thumbnail | Oprav hook/packaging |
| **Sráz v 90. s** | Předpovídá, kde odejdou i budoucí diváci | Oprav konkrétní pasáž/předěl |
| **Spike nad 100 %** | Přetáčení = nejhodnotnější část | Dělej toho víc |
| **Dip s návratem** | Přeskakování | Zkrať/zrychli danou pasáž |

> Hladká 50% křivka **porazí** 50% křivku s 30bodovým útesem — útes předpovídá budoucí odchody.

### 3.3 Benchmarky retence 2025/2026 (orientační)

| Metrika | Hodnota | Pozn. |
|---|---|---|
| Průměrná celková retence | ~**23,7 %** diváků do konce | **(neověřeno)** |
| Odchod během 1. minuty | ~**55 %** | **(neověřeno)** |
| Odchod v prvních 3 s | **50–60 %** | **(neověřeno)** |
| **Cíl** retence v 1. minutě | **70 %+** (= promo práh) | **(neověřeno)** |
| Silná celková retence (dlouhý vzdělávací obsah) | **35–50 %** | **(neověřeno)** |

### 3.4 Traffic sources: browse vs. suggested vs. search

| Zdroj | Co rozhoduje | Architektonická strategie |
|---|---|---|
| **Browse** (homepage, odběr, feed) | Studená distribuce, široké publikum → **thumbnail + titulek + konzistence uploadu** | Silný thumbnail, pravidelný upload (každý čtvrtek funguje — viz Daniel Kotula) |
| **Suggested** (vedle/po videu) | „O divákovi, ne o tobě" — co koukal, co se obvykle kouká dál, co maximalizuje session | Tematická návaznost (další stavba/styl/inženýr), end screeny do série |
| **Search** | Keyword intent, **nejvyšší CTR (~12,5 % organicky)**, nejpředvídatelnější | Keyword v titulku, prvních 100 znaků popisu, captions, klíčové fráze v řeči |

### 3.5 CTR benchmarky a vztah CTR ↔ AVD

| Zdroj/kontext | Dobré CTR |
|---|---|
| Organicky obecně | **4–6 %** (nad 6 % výborné) |
| Nový kanál | ~3 % OK |
| Search | ~**12,5 %** organicky |
| Desktop | ~6,2 % |

> **Pozor na rovnováhu:** když CTR roste, ale AVD (průměrná doba sledování) klesá, je click-quality slabý = clickbait. **Slib přesně to, co video plní, a plať hned.**

### 3.6 Závěr a end screen pro session
- Začni „balit" video **~15–20 s před koncem**, nech prostor pro end-screen prvky.
- Algoritmus odměňuje **session, ne jednotlivé video** — když divák přejde do dalšího videa a kouká dál, kredit jde tvému kanálu.
- Zdravá míra prokliku z end screenu **3–7 %**, nad 8 % u série = složený růst v suggested. **(neověřeno)**
- **Nikdy nekonči mrtvým outrem** bez návaznosti (posílá diváka pryč z platformy).

### 3.7 Poznámka k AI/faceless obsahu (algoritmické riziko 2026)
- Faceless ani AI-asistovaný obsah **nejsou zakázané** a zůstávají monetizovatelné. Cílem politiky je „inauthentic" (mass-produced, šablonovitý) obsah.
- Test YouTube: **„meaningful variation"** — průměrný divák musí poznat, že se videa liší. Vlastní research, vlastní struktura, doložitelný editorský vstup.
- Klonování **vlastního** hlasu a AI na produkci (skript/střih/thumbnail) **nevyžaduje** disclosure; label je nutný jen u realisticky syntetického obsahu zaměnitelného za skutečnost.
- V lednu 2026 YouTube smazal ~16 největších AI-slop kanálů (~35 mil. odběratelů, 4,7 mld. zhlédnutí). **(odhad příjmů ~9,8 mil. USD/rok)**

---

## 4. PACKAGING — ŠABLONY TITULKŮ A THUMBNAILŮ

### 4.1 Šablony titulků pro architekturu (vyber 1 vzorec na video)

Dominantní ověřený vzor celého žánru je **tázací „Proč / Why"** rámec (Stewart Hicks na něm postavil ~670 tis. odběratelů / ~93,4 mil. zhlédnutí; B1M ho používá systematicky).

| # | Vzorec | Český příklad | Ověřený zahraniční vzor |
|---|---|---|---|
| 1 | „Proč [budova/město] je [superlativ]" | „Proč je tahle věž nejlíp navržená v Praze" | *Why Chicago's Skyline is Insanely Well-Designed* (Hicks) |
| 2 | „Proč [místo] [neočekávané sloveso]" | „Proč Praha nestaví mrakodrapy" | *Why Europe Doesn't Build Skyscrapers* (B1M evergreen) |
| 3 | „Proč [místo] je [provokativní stav]" | „Proč je tahle čtvrť napůl prázdná" | *Why New York's Billionaires' Row Is Half Empty* (B1M, 3 mil./5 dní) |
| 4 | Curiosity gap (skryj specifikum) | „Tahle budova skrývá chybu, kterou nikdo nevidí" | — |
| 5 | Negativní / loss-aversion | „Proč tenhle trend ničí českou architekturu" | *The Hidden Agenda Behind Walmart's Architecture* (Hicks) |
| 6 | Metrika + výsledek | „[X] m² byt, který vypadá jako [Y]" | *…35sqm/370sqft Tokyo Apartment* (Never Too Small); hit *Boneca 24sqm* = 17 mil. |
| 7 | Konkrétní velké číslo | „Stavba za 16,5 miliardy, obviněná z kopie" | *Saudi Arabia Built a $16BN Clock Tower* (B1M) |
| 8 | Odhalovací sloveso (cheat/banned/trick) | „Jak architekti podvádějí s výškou budov" | *How Architects Cheat the Height of Buildings* (B1M) |
| 9 | Jméno/celebrita (realitní/interiér) | „Uvnitř [jméno]: byt, jaký jste nečekali" | AD *Open Door*: Jessica Alba ~36,6 mil., Kendall Jenner ~30,76 mil. |

> **Český kontrolní příklad reverzního inženýrství:** *Why New York's Billionaires' Row Is Half Empty* → „Proč je [pražská čtvrť] napůl prázdná".

### 4.2 Pravidla titulku
- **Front-loading:** hook + klíčové slovo do **prvních 40–50 znaků** (mobil ořezává už na 35–55 znacích).
- Celková délka **50–60 znaků** (70 %+ provozu je mobil).
- **Číslo použij jen když je smysluplné** (m², rok, částka). Pozor: ~35 % virálních videí 2025 použilo čísla, ale měla ~11 % méně zhlédnutí — číslo musí být smysluplné, ne násilné. **(neověřeno)** Lichá čísla (5, 7, 11) často překonávají sudá; specifická čísla ($10 427 místo $10 000) působí reálněji.
- **Nezdvojuj** text na thumbnailu a v titulku — mají se **doplňovat**.
- Emoční slova: Secret, Mistake, Why, Proven, Worst, Insanely, Hidden, Largest.

### 4.3 Šablony thumbnailů (vyber 1 layout)

| Layout | Popis | Kdy použít |
|---|---|---|
| **A) Before/After split** | Matný/desaturovaný „před" vlevo vs. živý „po" vpravo + text „PŘEDTÍM/POTOM" | Rekonstrukce, proměny čtvrtí, brownfieldy — **nejsilnější vzorec** |
| **B) Wow záběr** | Dronový/dramatický úhel budovy nebo panoramatu + 1–2 bold slova | Mrakodrapy, ikonické stavby, megaprojekty |
| **C) Obličej + budova** | Tvůj close-up s emocí (úžas/šok) v jedné třetině + budova/render v druhé + šipka na 1 detail | Explainer s tváří/avatarem |
| **D) Detail + kruh** | Jeden zvýrazněný prvek (kolečko/šipka) + 2–3 slova | Odhalení skryté chyby/detailu |

#### Ověřené CTR lifty (orientační, z blogů nástrojů — **(neověřeno)**)
| Prvek | Vliv na CTR |
|---|---|
| Before/After split-screen | až **+52 %** vs. jeden záběr |
| Jasný before/after (obecně) | **+35 %** vs. jen hotový výsledek |
| Lidský obličej s emocí | až **+30 %** |
| Vysoký kontrast / žluté-oranžové tóny | **+20–30 %** |

### 4.4 CHECKLIST thumbnailu (před publikací projeď celý)
- [ ] **2–3 barvy** maximálně, vysoký kontrast
- [ ] Hlavní subjekt o **30 %+ jasnější/tmavší** než pozadí
- [ ] Text **3–5 slov max**, bold bezpatkové písmo
- [ ] Text v **HORNÍ části** (mimo časovou značku vpravo dole)
- [ ] **Jeden** bod pozornosti — max 1 šipka NEBO 1 kruh (ne tři)
- [ ] Rule of thirds — hlavní prvek na pravou/levou třetinu
- [ ] Obličej (pokud je) zabírá **min. 25 %** výšky, dobře nasvícený, jasná emoce
- [ ] **Zmenši náhled na ~160×90 px** a ověř čitelnost na mobilu
- [ ] Text na thumbnailu **nezdvojuje** titulek
- [ ] Benchmark cíle: **CTR 4–10 %+** (nad 10 % silné); sleduj CTR podle zdroje provozu zvlášť (browse vs. search)

### 4.5 Nástroje na tvorbu thumbnailů
| Nástroj | URL | Pozn. |
|---|---|---|
| Canva (AI Thumbnail Maker) | https://www.canva.com/ai-thumbnail-maker/ | Free stačí, Pro 15 USD/měs; Magic Media, rule-of-thirds grid |
| Adobe Express | https://www.adobe.com/express/create/ai/thumbnail | Polished šablony + AI |
| Photoshop | — | 9,99 USD/měs, plná kontrola typografie |
| Pikzels / Thumbmagic / NeamX | https://pikzels.com/ | AI zaměřené na performance; NeamX generuje thumbnail z titulku do 60 s |

---

## 5. NÁSTROJE NA A/B TESTOVÁNÍ

### 5.1 Nativní YouTube „Test & Compare" (první volba, ZDARMA)
- **URL:** https://support.google.com/youtube/answer/16391400
- Nahraješ **až 3 varianty** titulku a/nebo thumbnailu.
- YouTube náhodně servíruje varianty různým divákům; **vítěz se vybírá podle WATCH-TIME SHARE** (ne jen podle CTR) — přitáhneš tedy správného diváka, ne jen klikače.
- Test běží **do 2 týdnů**. Zatím jen **desktop**.
- Od prosince 2025 umí A/B test **titulků i thumbnailů** (dřív jen thumbnaily).

### 5.2 Externí nástroje (až pro hloubku/statistickou signifikanci)

| Nástroj | Cena | Co umí | URL |
|---|---|---|---|
| **TubeBuddy** | ~27 USD/měs (Legend, ročně) | Test titul/thumbnail/popis/tagy do **95 % statistické signifikance**, limit 10 souběžných testů | https://www.tubebuddy.com/tools/youtube-thumbnail-test |
| **ThumbnailTest.com** | ~29 USD/měs (40 % sleva pod 10k odběratelů, 14denní záruka) | Střídá thumbnaily hodinově/denně, vyhodnocuje CTR, neomezené testy | https://thumbnailtest.com/ |
| **vidIQ** | — | **NEMÁ** pravé A/B testování — silný na náměty (Daily Ideas) a analytiku, ne na test | https://vidiq.com/ |

### 5.3 Diagnostika retence (čtení křivky)
- **YouTube Studio → Audience Retention report:** https://support.google.com/youtube/answer/9314415 — hledej prudké srazy (oprav konkrétní moment) a spiky nad 100 % (dělej víc).
- **OpusClip — Retention Graphs Explained:** https://www.opus.pro/blog/youtube-retention-graphs-explained — výklad flat vs. cliff vs. spike.

### 5.4 Pravidla testování (aby měřením něco zjistil)
1. Začni **nativním Test & Compare** na každém novém videu (zdarma).
2. Měň **jen jednu proměnnou** na jeden test (titul NEBO thumbnail), ať víš, co zabralo.
3. Externí nástroj (TubeBuddy/ThumbnailTest) přidej, až budeš chtít statistickou signifikanci nebo testovat starý katalog.
4. vidIQ používej na **náměty a analytiku**, ne na A/B test.
5. Cíl: **CTR 4–10 %+**, ale hlídej, aby CTR nerostl **na úkor AVD**.

---

## 6. BENCHMARKY A KONTROLNÍ SEZNAMY

### 6.1 Referenční kanály žánru (vzory packagingu a struktury)

| Kanál | Odběratelé | Formát / co studovat | URL |
|---|---|---|---|
| **The B1M** | ~4 mil. (oficiální web) | Dokumentární storytelling megaprojektů, „Why…" titulky, wow thumbnaily | https://www.youtube.com/@TheB1M |
| **Stewart Hicks** | ~670 tis. / 93,4 mil. zhlédnutí / 155 videí | Video-esej „Why…?" 12–15 min, příčina-následek, nízkonákladový | https://www.youtube.com/@stewarthicks |
| **DamiLee** | ~2,3 mil. | Architektura + popkultura/AI, storytelling pro laiky | https://www.youtube.com/@DamiLeeArch |
| **Never Too Small** | ~3 mil. **(neověřeno, čerstvě jen 1,7 mil. z 2023)** | Opakovatelná šablona prohlídek malých bytů, metrika v titulku | https://www.youtube.com/@nevertoosmall |
| **Adam Gebrian** (CZ) | — | Nejsilnější český popularizátor/kritik architektury | https://www.youtube.com/@agebrian |
| **Daniel Kotula / Žít Prahu** (CZ) | řádově desítky tisíc **(neověřeno)** | Lokální realitně-architektonický obsah, **každý čtvrtek**, titulky na zvědavost („Největší ostuda Prahy", „Architektonický skandál") | https://www.youtube.com/@DanielKotulaPraha |

### 6.2 Růstové benchmarky (vzdělávací obsah, 2026)
- Platformový průměr: **3,1 %/měsíc.**
- Vzdělávací obsah překonává průměr; dle zralosti kanálu:
  - Začínající edu kanál: **15–25 %/měsíc**
  - Střední: **8–15 %/měsíc**
  - Zavedený: **3–8 %/měsíc**
- Vzdělávací/dokumentární obsah má **2–3× vyšší engagement** než vlogy a **40 %+ CPM prémii** oproti short-only kanálům. **(orientační, z creator-economy blogů — neověřeno)**

### 6.3 MASTER CHECKLIST pro každé architektonické video

**Před natáčením / skript:**
- [ ] Vybrán **1 titulkový vzorec** (sekce 4.1) + 3 varianty hooku (4.3)
- [ ] Skript projel **4krokový prompt chaining** (2.5) včetně retention auditu
- [ ] Hook do **30 s** bez intra; cold open = nejsilnější záběr; 1 velká open loop
- [ ] Lidský příběh > suchá fakta; tří-akt 25/50/25
- [ ] Fakta **fact-checknutá** (letopočty, čísla, jména architektů)

**Střih:**
- [ ] **Pattern interrupt** min. každých 30–45 s; žádná pasáž > 90 s bez interruptu
- [ ] Pacing: 15–25 s/střih + burst každé 2–3 min; v min. 3–7 více B-roll
- [ ] **Vypálené titulky** zapnuté
- [ ] Každý **předěl = mikro-hook** + re-hook před předělem
- [ ] Velká open loop z hooku **zavřená v závěru**
- [ ] Posledních 15–20 s „sbaleno" + **end screen** na navazující video (cíl 3–7 % proklik)

**Packaging:**
- [ ] Titulek: hook + keyword do prvních 40–50 znaků, celkem 50–60
- [ ] Thumbnail projel **checklist 4.4** (2–3 barvy, 3–5 slov, 1 bod pozornosti, test na 160×90 px)
- [ ] Titulek a thumbnail se **doplňují**, nezdvojují
- [ ] Popis: keyword v prvních 100 znacích; klíčové fráze i v řeči/captions (search)

**Po publikaci:**
- [ ] Spuštěn **Test & Compare** (titul/thumbnail)
- [ ] Po 48 h zkontrolována **retenční křivka** (srazy? spiky?) a **CTR podle zdroje provozu**
- [ ] CTR 4–10 %+ a AVD neklesá (kontrola click-quality)
