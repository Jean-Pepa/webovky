# 08 — SOP, CHECKLIST A PROMPTY

**Provozní příručka pro tvorbu virálních architektonických videí (CZ, faceless/voiceover, YouTube + Reels/Shorts).**

Tento dokument je „operační manuál". Cílem je, abys u každého videa jen otevřel checklist, odškrtával boxy a kopíroval hotové prompty. Žádná teorie — ta je v ostatních dílech balíčku.

> Poznámka k číslům: většina cen je v USD dle ceníků 2025/2026 a může se měnit — před nákupem ověř na webu nástroje. Údaje označené **(neověřeno)** se nepodařilo nezávisle potvrdit (často kvůli blokaci přímého přístupu na stránky nástrojů/YouTube).

---

## OBSAH

1. [Checklist produkce jednoho videa (krok za krokem)](#1-checklist-produkce-jednoho-videa)
2. [Týdenní workflow / batch rozvrh](#2-tydenni-workflow--batch-rozvrh)
3. [Knihovna hotových AI promptů (copy-paste)](#3-knihovna-hotovych-ai-promptu)
4. [KPI a jak je sledovat](#4-kpi-a-jak-je-sledovat)
5. [Časté chyby a jak se jim vyhnout](#5-caste-chyby-a-jak-se-jim-vyhnout)

---

## 1. CHECKLIST PRODUKCE JEDNOHO VIDEA

Jedno dlouhé video (8–12 min) projde 9 fázemi. Reálný čas po zaběhnutí: **2–4 hodiny** čisté práce. Odškrtávej průběžně.

### FÁZE 0 — Výběr námětu (10–15 min)

- [ ] Vyber téma se silným konfliktem/dramatem (zbouraná ikona, tragédie tvůrce, megaprojekt v krizi, selhání inženýrství, mýtoborný úhel). Banka námětů je v dílu o námětech.
- [ ] Ověř, že má **vlastní úhel** (ne generická AI šablona) — kvůli YouTube „inauthentic content" politice z 15. 7. 2025.
- [ ] Zkontroluj dostupnost vizuálu PŘEDEM (viz Fáze 4): má stavba volné/licencovatelné záběry? Pozor na Burj Khalifa (trademark Emaar, jen editorial) a UAE/Saúdskou Arábii (chybí svoboda panoramatu).
- [ ] Zařaď video do existující **série/playlistu** (kvůli session time).

### FÁZE 1 — Research (15–30 min)

- [ ] Perplexity (Free/Pro 20 USD/měs): ověř fakta, datace, jména architektů, rozměry, čísla — **s citacemi**.
- [ ] Trianguluj fakta z min. 2 zdrojů (archiweb.cz, Památkový katalog NPÚ, cs.wikipedia.org).
- [ ] Zapiš si 5–8 tvrdých faktů/čísel, která ponese skript. **Nevymýšlej data.**
- [ ] Ulož zdroje do složky projektu (pro popisek videa + případný appeal).

### FÁZE 2 — Skript (20–40 min)

- [ ] Spusť 4-krokový prompt chaining (viz [sekce 3.2](#32-skript-4-krokovy-chaining)): OUTLINE → HOOK ×5 → SEGMENTY → RETENTION AUDIT.
- [ ] Zkontroluj retenční kostru: hook do 15 s (bez „ahoj"/intra) → setup do 45 s → 3–4 segmenty se setup-development-payoff → mid-video tease v 40–50 % → závěr uzavře hlavní open loop.
- [ ] Ověř, že pattern interrupt je min. každých 60–90 s.
- [ ] **Fakt-check celého skriptu** (AI dělá chyby v letopočtech a jménech).
- [ ] Přepiš do vlastního hlasu (ne syrový AI výstup) — kvůli kvalitě i monetizaci.
- [ ] Délka skriptu: cílově ~130–150 slov/min → pro 9 min ~1 200–1 350 slov.

### FÁZE 3 — Voiceover (10 min)

- [ ] ElevenLabs **Multilingual v2**, hlas Zdenek nebo Iveta (vyber konkrétní hlas přímo ve Voice Library — jména se mění).
- [ ] Vytvoř/aplikuj **výslovnostní slovník** (IPA/alias) na vlastní jména: Mies van der Rohe, Ještěd, Müllerova vila, Le Corbusier, Tugendhat…
- [ ] Vygeneruj komentář, poslechni a oprav místa, kde TTS ujede.
- [ ] Plán: Creator 22 USD/měs ≈ **~100 min/měs na v2** (ne 275 — to platí jen pro Turbo/Flash, nižší kvalita).

### FÁZE 4 — Sběr záběrů (30–60 min)

- [ ] Stock zdarma: Pexels + Pixabay + Mixkit (komerčně, bez atribuce, neredistribuuj surový soubor).
- [ ] Letecký pohled na konkrétní stavbu: Google Earth Studio (zdarma, **nech viditelnou atribuci „Google Earth"**, jen edu/film/neziskově).
- [ ] Ortofoto/mapy: Geoportál ČÚZK (CC BY 4.0, i archivní z 50. let), Mapy.cz screenshoty (CC-BY-SA, jen aktuální ČR).
- [ ] Archivní foto: Wikimedia Commons (ověř licenci u KAŽDÉHO souboru — preferuj PD/CC-BY, vyhni se CC-BY-SA u videa), Kramerius/NDK (jen volné dokumenty).
- [ ] Svoboda panoramatu ČR: vlastní záběry fasád z veřejných prostranství lze i komerčně.
- [ ] AI b-roll jen na atmosféru/koncept (Kling ~$0,10/s), NE na přesnou geometrii budovy (deformace linií, halucinace pater).
- [ ] **Ulož licenční doklad/ID ke každému placenému klipu** do složky projektu.

### FÁZE 5 — Střih (60–90 min)

- [ ] DaVinci Resolve (zdarma) nebo CapCut: srovnej voiceover s obrazem.
- [ ] Ken Burns efekt na statické/archivní fotky.
- [ ] Pattern interrupt: střídej talking-head b-roll / plán-řez / dobovou fotku / animaci / číslo na obrazovce každých 30–45 s.
- [ ] V minutách 3–7 stabilizuj (méně střihů, víc účelného b-rollu).
- [ ] Přidej hudbu (jemná ambient/lo-fi) a přechody.
- [ ] Závěr: 15–20 s před koncem „sbal" video a nasměruj na další díl (end screen).

### FÁZE 6 — Titulky (10 min)

- [ ] **Vypálené (burn-in) titulky** — kvůli +retenci a sledování bez zvuku.
- [ ] Submagic (ceské titulky ~99 %, Starter ~12 USD/rok) nebo Opus Clip. **NE CapCut auto-titulky** — český přepis mluvené řeči je nespolehlivý.
- [ ] Zkontroluj diakritiku a vlastní jména.

### FÁZE 7 — Packaging: thumbnail + titulek (15–20 min)

- [ ] Thumbnail v Canvě (Free/Pro 15 USD): vyber 1 layout (before/after split, wow dron, detail+kruh).
- [ ] Pravidla: 2–3 barvy, subjekt o 30 %+ kontrastnější než pozadí, 3–5 slov bold bezpatkově v HORNÍ části (mimo časovou značku), max 1 šipka/kruh.
- [ ] Zmenši na 160×90 px a ověř čitelnost na mobilu.
- [ ] Titulek: hook + klíčové slovo do prvních 40–50 znaků, celkem 50–60 znaků (viz [sekce 3.4](#34-titulek--thumbnail)).
- [ ] Připrav 2–3 varianty titulku I thumbnailu pro **Test & Compare**.

### FÁZE 8 — Klipy na Reels/Shorts (5–15 min)

- [ ] Opus Clip / Klap: vystřihni 3–5 momentů pod 60 s z nejsilnějších částí (viz [sekce 3.5](#35-rozsekani-na-reels)).
- [ ] Každý klip: 9:16, hook do 1–1,5 s, vypálené titulky, caption s klíčovými slovy, max 5 hashtagů.

### FÁZE 9 — Publikace a distribuce (10 min)

- [ ] SEO popis + tagy (viz [sekce 3.6](#36-seo-popis--hashtagy)): prvních 100 znaků nese keyword.
- [ ] „Zdroje záběrů a dat" na konec popisu (Google Earth, ČÚZK/CENIA, autoři CC, stock platformy, archiweb.cz/NPÚ).
- [ ] Zapni **Test & Compare** (nativní A/B, zdarma, 3 varianty, vyhodnocení dle watch-time).
- [ ] AI disclosure: na YouTube zaškrtni „altered/synthetic content", pokud používáš AI prezentera/syntetický hlas jiné osoby. (Klon VLASTNÍHO hlasu disclosure NEvyžaduje.)
- [ ] Naplánuj long-form na ráno (8–11, ne/út), Shorts/Reels na večer (18–21, čt–so) nebo poledne (12–15).
- [ ] End screen s konkrétním navazujícím videem (cíl 3–7 % prokliku).
- [ ] Připnutý komentář u Shorts → odkaz na dlouhé video/playlist.

---

## 2. TÝDENNÍ WORKFLOW / BATCH ROZVRH

Princip: **netáčej video po videu, dávkuj (batch) stejné činnosti.** Drž kadenci **1 dlouhé video/týden + 3–5 Reels/Shorts/týden**. Konzistence > objem.

### Týdenní rozvrh (model „1 dlouhé video + 4 klipy")

| Den | Blok | Činnost | Nástroje | Čas |
|-----|------|---------|----------|-----|
| **PO** | Research + skript | Fáze 0–2: vyber téma, ověř fakta, napiš skript (prompt chaining) | Perplexity, ChatGPT/Claude | 1–1,5 h |
| **ÚT** | Voiceover + záběry | Fáze 3–4: vygeneruj VO, nasbírej b-roll, vyřeš licence | ElevenLabs, Pexels, Google Earth Studio | 1–1,5 h |
| **ST** | Střih | Fáze 5–6: sestav video, titulky | DaVinci/CapCut, Submagic | 1,5–2 h |
| **ČT** | Packaging + publikace | Fáze 7+9: thumbnail, titulek, popis, naplánuj na ráno; **publikuj dlouhé video** | Canva, YouTube Studio | 1 h |
| **PÁ** | Repurpose | Fáze 8: vystřihni 4 klipy, naplánuj Reels/Shorts na další dny | Opus Clip, Metricool/Buffer | 0,5–1 h |
| **SO/NE** | Volno / zásoba | Případně předtoč research na příští téma (náskok) | — | — |

**Publikační časy (ověř ve svých Insights):**
- Dlouhé video: **čtvrtek ráno 8–11** (rituál „nové video každý čtvrtek" funguje pro retenci).
- Reels/Shorts: **večer 18–21** (čt–so) nebo **poledne 12–15**, rozprostři přes týden (pá, ne, út, st).

### Batch měsíčně (efektivnější varianta)

Když máš proces zaběhnutý, dávkuj po celých fázích pro 4 videa najednou:

| Týden v měsíci | Batch činnost |
|----------------|---------------|
| Týden 1 | Research + skripty pro **4 videa** (1 blok) |
| Týden 2 | Voiceovery + sběr záběrů pro 4 videa |
| Týden 3 | Střih + titulky 4 videí |
| Týden 4 | Packaging + naplánování 4 videí + 16 klipů; vše ve frontě |

Výhoda: méně přepínání kontextu, levnější (jeden „rozjezd" ElevenLabs/Opus Clip), náskok zásoby. Distribuce pak běží automaticky přes scheduler.

### Maximálně automatizovaná varianta (volitelné)

Pro objem lze celý řetězec orchestrovat v **n8n** (self-hosted ~4–7 USD/měs, neomezené executions): Google Sheet s tématy (status „Pending") → LLM skript → ElevenLabs TTS → render (JSON2Video 49 USD/200 min) → titulky → distribuce přes Blotato/Upload-Post na YT/IG/TikTok. Per-video pod 1 USD. **Pozor:** YouTube Data API kvóta = ~6 uploadů/den/projekt; a hlavně drž lidský vstup kvůli „inauthentic" politice.

---

## 3. KNIHOVNA HOTOVÝCH AI PROMPTŮ

Kopíruj a vyplň `[HRANATÉ ZÁVORKY]`. Standardní placeholdery:
`[TÉMA]` `[STAVBA/ARCHITEKT]` `[DÉLKA]` `[PUBLIKUM]` `[TÓN]` `[VOICE REFERENCE]`.

> **VOICE REFERENCE** = vlož 150–200 slov ukázky svého stylu psaní/narace do každého promptu, ať AI drží konzistentní hlas. Doporučený model: **Claude** na tón/naraci, **GPT-4o** na strukturu.

---

### 3.1 Prompt na vygenerování námětů

```
Jsi stratég obsahu pro český YouTube kanál o architektuře a stavbách
(faceless, voiceover, styl vysvětlujícího dokumentu jako The B1M / Stewart Hicks).

Vygeneruj 15 námětů na dlouhé video (8–12 min) na téma [OBLAST: např. pražský
brutalismus / české funkcionalistické vily / světové megaprojekty v krizi].

Pro KAŽDÝ námět vrať tabulku se sloupci:
1. TITULEK (50–60 znaků, vzorec "Proč [stavba] [kontraintuitivní tvrzení]"
   nebo s konkrétním číslem/superlativem)
2. HOOK (1 věta, silná otázka/paradox do 15 slov)
3. ÚHEL (čím je příběh dramatický: konflikt, tragédie, mýtus, selhání)
4. VIZUÁL (jaké záběry půjdou sehnat: archiv / dron / before-after / rendery)
5. VIRÁLNÍ POTENCIÁL (1–5) + 1 věta proč

Priorituj témata se silným dramatem a vlastním úhlem.
Vyhni se generickému megaprojektovému hype a žebříčkům "TOP 10".
Piš česky.
```

---

### 3.2 Skript — 4-krokový chaining

Spouštěj prompty **po sobě**, schvaluj výstup mezi kroky.

**KROK 1 — OUTLINE**
```
Jsi zkušený scenárista dokumentárních YouTube videí o architektuře.
Vytvoř osnovu pro [DÉLKA: 9min] video o [STAVBA/TÉMA] pro [PUBLIKUM:
česká laická veřejnost se zájmem o města a architekturu].

Struktura:
- COLD OPEN (0:00–0:15): nejsilnější moment/paradox hned, curiosity gap, BEZ pozdravu a intra
- SETUP (0:15–0:45): co je v sázce + slib konkrétní odpovědi/payoffu na konci
- 3–4 SEGMENTY: seřaď kauzálně (každý segment „si zaslouží" další),
  ke každému uveď 1 open loop tease na konci
- ZÁVĚR: uzavři hlavní open loop + tease na další video

Tón: [TÓN: klidný, vážný, mírně dramatický].
Vrať jen osnovu s timestampy a jednou větou ke každému bloku. Počkej na schválení.
```

**KROK 2 — HOOK ×5**
```
Napiš 5 variant cold openu (každý ~30 s jako odstavec pro voiceover) pro video
o [STAVBA/TÉMA].

Požadavky:
- vytvoř curiosity gap do prvních 15 slov, BEZ pozdravu
- vyhni se klišé "od nepaměti..." / "už staletí..."
- každá varianta jiný typ hooku: (1) provokativní otázka, (2) bold/kontraintuitivní
  tvrzení, (3) konkrétní šokující číslo, (4) paradox/tajemství, (5) loss-framing
  ("největší chyba / co se nikdy nemělo stát")
- vždy obsahuj 1 konkrétní fakt/číslo

VOICE REFERENCE (napodob tento styl): [VOICE REFERENCE]
Piš česky.
```

**KROK 3 — SEGMENTY (plný skript)**
```
Napiš plný skript pro voiceover podle schválené osnovy a vybraného hooku.

Pravidla retence:
- každý segment: setup (proč tahle část) → development (napětí/info) → payoff (odměna)
- na konci každého segmentu otevři novou smyčku do dalšího ("ale právě tady to začne být zvláštní...")
- pattern interrupt v textu min. každých 60–90 s (překvapivý fakt, přímé oslovení diváka, změna úhlu)
- mid-video re-hook kolem 40–50 % ("za chvíli ukážu část, kterou většina lidí chápe úplně špatně")
- krátké věty, mluvený jazyk, ČÍSLA konkrétní (ne "obrovský", ale "77,5 metru")
- u každého odstavce v [hranatých závorkách] navrhni B-ROLL / archivní foto / animaci / řez

Drž se POUZE faktů, která ti dodám — nevymýšlej data, letopočty ani jména.
Fakta: [SEM VLOŽ 5–8 OVĚŘENÝCH FAKTŮ Z RESEARCHE]
Délka: [DÉLKA]. Tón: [TÓN]. VOICE REFERENCE: [VOICE REFERENCE]. Piš česky.
```

**KROK 4 — RETENTION AUDIT**
```
Projdi tento skript jako editor zaměřený na retenci.
1. Označ každé místo, kde je víc než 90 sekund bez pattern interruptu, a navrhni
   konkrétní interrupt (střih na b-roll, číslo na obrazovce, přímá otázka).
2. Zkontroluj, že cold open vytváří curiosity gap v prvních 15 s.
3. Ověř, že je v 40–50 % videa mid-video tease.
4. Najdi pasáže, kde klesá napětí, a navrhni zkrácení nebo přeskupení.
5. Ověř, že každý segment končí otevřenou smyčkou.
Vrať konkrétní úpravy, ne obecné rady.

[VLOŽ SKRIPT]
```

---

### 3.3 Prompt na titulky / popisky do videa (on-screen text)

```
Z tohoto skriptu vytáhni klíčové on-screen texty (overlay) pro dlouhé video.

Vrať:
1. 8–12 krátkých textových overlayů (3–7 slov) k vypíchnutí na obrazovku
   v momentech, kde padne klíčové číslo nebo tvrzení — uveď, ke které větě patří
2. 5 "kapitol" (chapters) s názvy a timestampy pro YouTube
3. seznam vlastních jmen a názvů, u kterých hrozí chybná výslovnost TTS
   (pro výslovnostní slovník v ElevenLabs)

Piš česky, stručně, údernicky.
[VLOŽ SKRIPT]
```

---

### 3.4 Prompt na titulek + thumbnail

```
Jsi specialista na YouTube packaging pro architektonický kanál (CZ).
Video je o [STAVBA/TÉMA], hlavní hook je [HOOK].

A) Navrhni 6 variant TITULKU:
- 50–60 znaků, hook + klíčové slovo do prvních 40 znaků
- použij osvědčené vzorce: "Proč [X] [kontraintuitivní tvrzení]",
  konkrétní číslo/superlativ, curiosity gap, loss-framing ("největší chyba")
- číslo použij jen když je smysluplné (m², rok, částka)

B) Navrhni 3 koncepty THUMBNAILU:
- vyber layout: before/after split | wow dron | obličej+budova | detail+kruh
- urči: hlavní vizuál, 3–5 slov bold textu (NEZDVOJUJ s titulkem), barvy
  (2–3, kontrast 30 %+), kam dát 1 šipku/kruh
- text patří do HORNÍ části (mimo časovou značku vpravo dole)

Cíl CTR 4–10 %+. Piš česky.
```

---

### 3.5 Prompt na rozsekání na Reels/Shorts

```
Z tohoto skriptu (a časů z videa) vyber 5 momentů na vertikální klipy (9:16, pod 60 s)
pro Instagram Reels / YouTube Shorts / TikTok.

Pro každý klip vrať:
1. ČAS ve videu (od–do, ideálně 15–45 s)
2. HOOK (text na první frame, 3–7 slov) — ukaž výsledek/paradox HNED
3. on-screen TITULKY rozsekané po 1–2 s (text k vypálení)
4. CAPTION (1–2 věty s klíčovými slovy, co problém/proces řeší — funguje jako SEO)
5. 5 hashtagů (max 5, cap od 12/2025), relevantních k architektuře/stavbě
6. CTA do popisu nebo na konec ("celé video na YouTube" / "pošli kamarádovi, co staví")

Priorituj momenty: before/after, šokující číslo, kontroverzní tvrzení, reveal stavby.
Original audio (talking-head), ne trending zvuk. Piš česky.
[VLOŽ SKRIPT + TIMESTAMPY]
```

---

### 3.6 Prompt na SEO popis + hashtagy

```
Napiš YouTube popis pro dlouhé video o [STAVBA/TÉMA].

Struktura:
1. PRVNÍCH 100 ZNAKŮ: hook + hlavní klíčové slovo (zobrazí se ve výsledcích a pod videem)
2. 2–3 odstavce shrnutí (přirozeně proložené klíčovými frázemi, které lidé hledají:
   název stavby, architekt, město, "historie", "proč")
3. KAPITOLY s timestampy (0:00 ...)
4. sekce "ZDROJE ZÁBĚRŮ A DAT:" — placeholder na Google Earth, ČÚZK/CENIA (CC BY 4.0),
   autory CC materiálů, stock platformy, archiweb.cz / Památkový katalog NPÚ
5. odkazy: další díl série / playlist / Instagram
6. 3–5 relevantních hashtagů na konec

Klíčová slova zapracuj i do prvních vět přirozeně (pro search traffic).
Piš česky.
[VLOŽ SKRIPT NEBO OSNOVU]
```

---

## 4. KPI A JAK JE SLEDOVAT

Algoritmus 2025/2026 hodnotí **satisfaction + session time**, ne jen syrové minuty. Sleduj proto tvar křivky a příspěvek k relaci, ne pouze průměr.

### Klíčové metriky a cílové hodnoty

| KPI | Kde měřit | Cílová hodnota | Pozn. |
|-----|-----------|----------------|-------|
| **CTR (míra prokliku)** | YT Studio → Dosah | 4–10 % (nad 10 % silné) | Search 8–15 %, browse 3–7 %. Nový kanál ~3 % OK. |
| **Retence v 1. minutě** | YT Studio → Udržení publika | **70 %+** | ~55 % diváků odejde do 1. minuty (benchmark). |
| **Celková retence (dlouhé video)** | YT Studio → Udržení publika | 35–50 % = silné | Sleduj TVAR křivky, ne jen průměr. |
| **Tvar retenční křivky** | graf udržení | plynulá bez srázů | Sráz v 1. min = slabý hook/zavádějící titulek. Spike >100 % = nejhodnotnější část (dělej víc). |
| **Průměrná doba sledování (AVD)** | YT Studio | roste s kvalitou | Pozor: když CTR roste a AVD klesá = clickbait. |
| **End screen CTR** | YT Studio → Karty/konec | 3–7 % | Vede do session (kredit jde tvému kanálu). |
| **Reels: 3s hold rate** | IG Insights | **60 %+** | Pod 40 % = slabý hook. |
| **Reels: watch time / DM shares** | IG Insights | rostoucí | DM shares = top signál pro dosah na nesledující. |
| **Růst odběratelů** | YT Studio | edu kanál: 3–8 %/měs (zavedený), 8–15 % (střední), 15–25 % (začínající) | Platformový průměr je jen 3,1 % — edu obsah ho překonává. |

### Jak sledovat (rutina)

- [ ] **Po 48 h u každého videa:** zkontroluj CTR + retenci 1. minuty. Pokud CTR nízké → otestuj jiný thumbnail/titulek (Test & Compare). Pokud sráz v 1. min → příště silnější cold open.
- [ ] **Týdně:** projdi retenční křivky posledních videí, hledej opakující se srázy (oprav konkrétní moment) a spiky >100 % (dělej víc toho, co funguje).
- [ ] **Měsíčně:** srovnej růst odběratelů s benchmarkem dle zralosti; vyhodnoť, které série/témata táhnou; uprav publikační časy podle vlastních Insights.
- [ ] Vždy měň **jen jednu proměnnou** na test (titulek NEBO thumbnail), ať víš, co zabralo.

### Cíle k monetizaci (YPP)

- Cesta: **1000 odběratelů + 4000 hodin** za 12 měsíců (pro architekturu reálná cesta; Shorts cesta 10M/90 dní je nereálná).
- Realistický timeline: 6–12 měsíců do monetizace při konzistenci; zlom často až ve 2. roce. **Nekonči před 12. měsícem.**
- Diverzifikace příjmů (reklama bývá jen ~30 %): sponzoring (CAD/viz SW, developeři, stavebniny — real estate CPM ~10–30 USD), affiliate (5–15 %), vlastní produkty (kurzy, šablony, plány domů). CZ RPM je nízké, stav na sponzoring + vlastní produkty.

---

## 5. ČASTÉ CHYBY A JAK SE JIM VYHNOUT

| # | Chyba | Důsledek | Jak se jí vyhnout |
|---|-------|----------|-------------------|
| 1 | **Slabý/dlouhý úvod** ("Ahoj, vítejte na kanále…", channel promo, dlouhý kontext) | ~55 % diváků odejde do 1. minuty | Cold open: nejsilnější moment/paradox do 5–8 s, curiosity gap, BEZ intra. |
| 2 | **Zavádějící titulek/thumbnail** (clickbait) | CTR roste, AVD klesá → algoritmus potrestá | Slib přesně to, co video plní, a zaplať hned v prvních 15 s. |
| 3 | **Žádné vypálené titulky** | nižší retence, 85 % Reels se kouká bez zvuku | Vždy burn-in titulky. Na CZ použij Submagic, NE CapCut auto-captions. |
| 4 | **Čistá AI šablona bez vlastního úhlu** | demonetizace (YouTube „inauthentic content" 7/2025; lednová vlna 2026) | Vlastní research, vlastní úhel, „meaningful variation" mezi videi, lidský přepis skriptu. |
| 5 | **Klonovaný/generický hlas bez disclosure tam, kde je nutný** | label navíc, riziko při kontrole | Klon VLASTNÍHO hlasu disclosure NEvyžaduje; u syntetické cizí osoby zaškrtni „altered/synthetic". |
| 6 | **AI b-roll na přesnou geometrii budovy** | deformované linie, špatný počet pater → odborníci to poznají | AI jen na atmosféru/koncept; přesné záběry ze stocku/vlastní/3D modelu. |
| 7 | **Burj Khalifa / UAE / Saúdská Arábie jako hlavní motiv v monetizovaném videu** | trademark Emaar, chybí svoboda panoramatu → právní riziko | Jen editorial licence (Getty/Pond5) nebo souhlas; nebo ukázat jen jako součást panoramatu. |
| 8 | **Spoléhání na fair use / "no copyright infringement intended"** | Content ID strike (disclaimer neochrání) | Vlastní záběry + CC0/PD + zakoupené royalty-free; veď složku licencí/ID ke každému assetu. |
| 9 | **CC-BY-SA materiál ve videu** | ShareAlike „nakazí" celé video | Preferuj PD/CC-BY; ověř licenci u KAŽDÉHO souboru zvlášť. |
| 10 | **Vymyšlená čísla/letopočty z AI** | ztráta důvěry, chyba u odborného publika | Fakt-check z 2+ zdrojů; do skript-promptu vkládej jen ověřená fakta. |
| 11 | **Denní upload / přetížení** | pokles kvality, vyhoření před zlomem ve 2. roce | Drž 1 dlouhé video/týden + 3–5 klipů; konzistence > objem. |
| 12 | **Optimalizace na dokončení místo session** | mrtvý outro pošle diváka pryč z platformy | 15–20 s před koncem „sbal" video, end screen na navazující díl (cíl 3–7 %). |
| 13 | **Skákání mezi tématy** | horší „topic clarity" → slabší distribuce | Drž úzké téma (architektura/stavby), stav série a playlisty. |
| 14 | **Přecenění minut ElevenLabs** | dojdou kredity uprostřed měsíce | Creator (22 USD) = ~100 min/měs na Multilingual v2 (ne 275). Plánuj dle toho. |
| 15 | **Příliš dlouhý avatar (pokud používáš AI prezentera)** | uncanny valley, drahé na kreditech | Avatar jen jako „kotva" (intro/outro/přechody), zbytek b-roll + voiceover. |
| 16 | **6+ hashtagů na Reels** | od 12/2025 cap 5; navíc už netáhnou dosah | Max 5 hashtagů; dosah řeš keyword SEO v captionu a on-screen textu. |
| 17 | **Zanedbaná YouTube Data API kvóta** (u n8n automatizace) | jen ~6 uploadů/den/projekt | Požádej o navýšení kvóty předem (1–4 týdny); přidej retry/wait uzly. |

---

*Konec dokumentu 08. Navazuje na díly o námětech, packagingu, retenci a produkčním stacku v tomto balíčku.*
