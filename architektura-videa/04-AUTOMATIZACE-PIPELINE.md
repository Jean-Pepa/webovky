# 04 — AUTOMATIZACE A PRODUKČNÍ PIPELINE

> Tento dokument je **těžiště celého balíčku**: kompletní produkční pipeline pro tvorbu virálních architektonických videí, krok za krokem, od námětu po repurpose na Reels. Pro každou fázi najdeš **doporučený nástroj + alternativu + cenu + přesný postup + jak to zrychlit/zautomatizovat**.
>
> Pipeline je postavený na **AI prezenterovi** (digitální avatar = stálá tvář kanálu). Detailní rozbor avatara, klonování hlasu a compliance je v samostatném dokumentu **04b-AI-PREZENTER**. Zde řešíme, **jak avatar zapadá do celku** a jak kolem něj postavit celý produkční řetězec.
>
> Ceny jsou k červnu 2026 v USD (ceníky se mění — kde je údaj sporný, je označen **(neověřeno)**). Všechna čísla pocházejí z korpusu researche; nic není domyšleno.

---

## 0. Filozofie pipeline: modulární stack, ne „one-click"

Klíčové zjištění z researche: **neexistuje jeden end-to-end generátor, který udělá kvalitní český 8–10min architektonický dokument na jeden klik.** End-to-end nástroje (Pictory, InVideo, Fliki) zvládnou délku, ale dávají slabší českou lokalizaci a malou kontrolu nad záběry. Proto stavíme **modulární stack**: každou fázi řeší specializovaný nástroj, který je v dané věci nejlepší.

Druhé klíčové zjištění: **YouTube politika z července 2025 proti „inauthentic" obsahu** (přejmenováno z „repetitious", vynucováno od ledna 2026 — smazáno ~16 AI-slop kanálů, 4,7 mld. zhlédnutí). Faceless ani AI obsah **nejsou zakázané** — terčem je jen masově generovaný šablonovitý obsah. Náš pipeline proto vždy obsahuje **vlastní research, vlastní úhel a doložitelný lidský editorský vstup** („meaningful variation" mezi videi). Klonování **vlastního** hlasu a AI na produkci (skript, střih, thumbnail) **nevyžaduje** disclosure; AI prezenter mluvící syntetickým hlasem disclosure **vyžaduje** (viz fáze 10).

---

## 1. Kde avatar zapadá do celku

AI prezenter **není** celé video — je to **kotva** (anchor). Realistické omezení z testů 2026: AI avatary stále selhávají na rukou, gestech a dlouhém detailním pohledu (uncanny valley při 10 min nepřetržité mluvy). Navíc jsou drahé na kreditech (HeyGen Avatar IV = 20 kreditů/min, Creator plán pokryje jen ~10–30 min/měs).

**Osvědčená architektura videa (8–10 min):**

| Pozice | Délka | Co tam je |
|---|---|---|
| Cold open | 0:00–0:08 | nejsilnější záběr/moment (B-roll, žádný avatar) |
| Intro | 0:08–0:45 | **avatar** uvede slib + open loop |
| Segment 1–4 | ~2 min každý | **B-roll staveb + voiceover** (stejný klonovaný hlas jako avatar) |
| Přechody mezi segmenty | 5–10 s | **avatar** jako mikro-hook („ale tady to začne být zajímavé") |
| Outro | posledních ~30 s | **avatar** uzavře smyčku + tease dalšího videa |

Avatar reálně mluví do kamery jen **~1,5–3 min z 10min videa**. Zbytek = architektonický b-roll s voiceoverem. To je levnější (méně kreditů), realističtější a vizuálně zajímavější. **Hlas avatara = stejný klonovaný hlas jako voiceover** (ElevenLabs), aby byla persona slyšitelně jednotná.

---

## 2. Pipeline krok za krokem

Pro každou fázi: doporučený nástroj • alternativa • cena • přesný postup • automatizace.

---

### FÁZE 1 — NÁMĚT

**Doporučený nástroj:** vlastní swipe-file námětů (viz dokument o námětech) + Perplexity na ověření aktuálnosti
**Alternativa:** Google Trends + Perplexity (n8n template #4352)
**Cena:** Perplexity Free stačí; Pro 20 USD/měs (200 USD/rok)

**Přesný postup:**
1. Vyber téma s **vlastním úhlem** (kvůli YouTube policy), ne generický hype.
2. Ověř, že téma má virální vzorec: drama/konflikt, before/after, scale comparison, mýtoborný úhel.
3. Zvol **title pattern** ještě před skriptem (rozhoduje o CTR): nejsilnější je tázací **„Proč [stavba/místo] [kontraintuitivní tvrzení]"** (B1M, Stewart Hicks postavili kanály skoro výhradně na něm).

**Title šablony (vyber 1):**
- `Proč [budova/město] je [superlativ]` → „Proč je tahle věž nejlíp navržená v Praze"
- `Proč [trend] ničí českou architekturu` (negativní/loss-aversion framing často poráží pozitivní)
- Curiosity gap: „Tahle budova skrývá chybu, kterou nikdo nevidí"
- Reverzně inženýruj ověřený hit: „Why New York's Billionaires' Row Is Half Empty" → „Proč [tvé město]'s [čtvrť] Is [provokativní stav]"

**Jak automatizovat:** Perplexity (Sonar Pro) sken trendů za 14 dní → zapsat do Google Sheetu jako frontu (sloupec status „Pending"). Hotový n8n template **#5995** „Create AI news video content ideas with Perplexity & OpenAI".

---

### FÁZE 2 — RESEARCH

**Doporučený nástroj:** Perplexity Pro (citace u každého tvrzení, Deep Research)
**Alternativa:** ChatGPT s web search
**Cena:** Perplexity Free → Pro 20 USD/měs

**Přesný postup:**
1. Perplexity na ověřená fakta o stavbě/architektovi **s citacemi** (datace, jména, rozměry, ceny).
2. **Triangulovat fakta** z více zdrojů — pro CZ stavby: `cs.wikipedia.org`, `archiweb.cz`, Památkový katalog NPÚ (`pamatkovykatalog.cz`).
3. Sporná čísla označit, aby je AI ve skriptu nevydávala za jistá (např. NEOM náklady 500 mld. až 8,8 bil. USD — řádové odhady).

**Čas:** 15–30 min.
**Jak automatizovat:** delegovatelné, ale **nechej lidskou kontrolu faktů** — surový AI výstup má časté chyby v letopočtech. Toto je fáze, kde „meaningful variation" a originalita reálně vznikají.

---

### FÁZE 3 — SKRIPT

**Doporučený nástroj:** Claude (dlouhý souvislý text, přirozený tón) + ChatGPT/GPT-4o (faktová kostra, struktura)
**Alternativa:** vidIQ AI Script Generator (retence v šablonách)
**Cena:** Claude Pro / ChatGPT Plus ~20 USD/měs každý; pro start stačí jeden

**Retenční kostra skriptu (8–10 min):**
```
Hook (0:00–0:15)      curiosity gap, žádné „ahoj, vítejte", cold open tease
Setup (0:15–0:45)     slib konkrétního výsledku + stakes + 1 open loop
Segment 1–4 (~2 min)  každý: setup → development → payoff, konec = open loop tease
  pattern interrupt    každých 45–90 s (změna vizuálu/tónu, fakt na obrazovce)
  mid-video tease      kolem 40–50 % („za chvíli ukážu část, kterou většina dělá špatně")
Payoff + uzavření hlavní smyčky
CTA + tease dalšího videa (posledních 15–20 s = „balení" na session)
```

**Hotové copy-paste prompty (prompt chaining — 4 kroky, čas ze 2–3 h na ~15 min):**

**KROK 1 — OUTLINE:**
```
Vytvoř 7sekční outline pro YouTube dokument o [TÉMA/STAVBA].
Cílová délka [DÉLKA] min, publikum [PUBLIKUM], tón [TÓN].
Struktura: cold open → setup se slibem → 3–5 tematických segmentů
řazených kauzálně (každý segment „si zaslouží" další: příčina→následek),
každý končí open loop tease → payoff → CTA.
Nejdřív mi ukaž jen strukturu ke schválení.
```

**KROK 2 — HOOK (×5):**
```
Napiš 5 různých úvodních hooků (každý do 15 slov, do 30 s mluveného slova)
pro video o [TÉMA]. Žádné pozdravy, žádné „od úsvitu věků".
Každý formátuj jako odstavec pro voiceover.
Vytvoř: 2 curiosity, 1 stakes/následek, 1 konkrétní claim s číslem,
1 kontrariánský („Všechno, co víte o X, je špatně").
```

**KROK 3 — SEGMENTY:**
```
Rozpracuj schválený outline do plného skriptu pro mluvené slovo
(krátké věty, konverzační tón). U KAŽDÉHO odstavce navrhni konkrétní
B-roll / archivní foto / animaci / Google Earth záběr (= shot-list).
Na konci každého segmentu otevři smyčku do dalšího.
Drž se POUZE ověřených čísel z [RESEARCH]. Nevymýšlej data.
Voice reference (napodob tento styl): [200 SLOV UKÁZKY TVÉHO STYLU]
```

**KROK 4 — RETENTION AUDIT:**
```
Projdi skript a označ každé místo, kde je >90 s bez pattern interruptu.
Navrhni konkrétní interrupt (střih na B-roll, číslo na obrazovce,
přímá otázka divákovi). Přidej jeden mid-video tease kolem 40–50 %.
```

**Pro architektonický/dokumentární žánr** přidej tří-aktovou strukturu ~25 % setup / 50 % konfrontace / 25 % rozuzlení a cold open jako mini-film s vlastním obloukem.

**Nastavení modelu:** temperature 0.3–0.5 pro faktickou naraci, 0.7–0.9 pro hooky/přechody. Claude lepší na tón/naraci, GPT-4o na strukturu.
**Čas:** 15–40 min.
**Disclaimer:** AI první draft **vždy fact-checkni a přepiš vlastním hlasem** — kvůli kvalitě i YouTube policy.

---

### FÁZE 4 — AI HLAS (TTS) — KRITICKÉ PRO ČEŠTINU

**Doporučený nástroj:** **ElevenLabs, model Multilingual v2** (nejlepší český AI hlas na trhu)
**Alternativa:** ElevenLabs Turbo/Flash v2.5 (~50 % levnější na znak, nižší kvalita — jen na koncept)
**Cena:** Free 10 000 znaků/měs (~10 min, bez komerčních práv) • **Creator 22 USD/měs** (často 11 USD první měsíc) • Pro 99 USD (voice cloning vlastního hlasu)

**Kvalita českého TTS — co potřebuješ vědět:**
- Čeština je nativně podporovaná v Multilingual v2 (29 jazyků). Výstup je **produkční** — správné háčky, délky, přízvuk na první slabice.
- **Pozor na kredity:** Creator = 100 000 kreditů/měs. Na Multilingual v2 platí **1 znak = 1 kredit**, takže reálně **~100 min audia/měs** (ne 275, jak uvádějí některé zdroje — to platí jen na efektivnějších modelech Turbo/Flash). Pro kvalitní český voiceover na v2 počítej **~100 min/měs**.
- **Hlavní slabina = vlastní jména** (architekti, názvy staveb). Řeší se **výslovnostním slovníkem** (pronunciation dictionary).

**Výslovnostní slovník — povinný krok pro architekturu:**
- Ve Studiu vynutíš výslovnost konkrétních slov přes IPA/CMU fonémy (model eleven_flash_v2, eleven_v3) nebo alias (náhradní hláskování) u ostatních modelů.
- Eleven v3 má nativní IPA pro 70+ jazyků s ~80–90% konzistencí.
- Nahraj sem jména typu „Mies van der Rohe", „Ještěd", „Müllerova vila", „Le Corbusier", aby je hlas nečetl špatně.

**České hlasy:** ve Voice Library jsou potvrzené např. **Zdeněk** (hluboký mužský), **Iveta**, dále Anet, Denisa, Katty, Mirek, Daniel. Jména „Markéta"/„Jana" se nepodařilo ověřit **(neověřeno)** — komunitní knihovna se mění. **Vyber hlas přímo ve Voice Library a otestuj na 30s vzorku před závazkem.**

**Přesný postup:**
1. Nahraj výslovnostní slovník pro jména ve skriptu.
2. Vlož skript, vyber hlas (Multilingual v2), vygeneruj.
3. Poslechni vlastní jména — pokud chybují, doplň do slovníku a přegeneruj danou pasáž.

**Čas:** ~10 min.
**Jak automatizovat:** ElevenLabs má **nativní n8n node**. API ~0,30 USD/1000 znaků (7min skript ≈ 0,50 USD). Plně automatizovatelné: skript → TTS → audio soubor.

---

### FÁZE 5 — AI AVATAR / PREZENTER

> Detailní rozbor v **04b-AI-PREZENTER**. Zde shrnutí pro pipeline.

**Doporučený nástroj:** **HeyGen, Avatar IV / Avatar V (Digital Twin)** — fotorealistický stálý avatar
**Alternativa:** Hedra Character-3 (foto-persona, Creator 30 USD/měs) • Synthesia (max konzistence/korporát)
**Cena:** HeyGen **Creator ~29 USD/měs** (24 ročně). Avatar IV = **20 kreditů/min**. Počet kreditů je sporný: oficiálně 600 kreditů (~30 min/měs), některé recenze 2026 uvádějí jen 200 (~10 min/měs) **(neověřeno — počítej s rizikem 10 min)**. Dokup ~300 kreditů za 15 USD (~5 USD/min).

**Přesný postup:**
1. **Persona:** rozhodni vlastní tvář (jednodušší právně) vs. fiktivní host (Midjourney V7 `--oref --ow 100–150`, pak animovat).
2. **Digital Twin:** v HeyGen vytvoř avatar z 2–5 min vlastního videa. **Natoč povinný on-camera consent** (předepsaný text do 30 s). Vytvoř 2–3 „looks" pro pestrost.
3. **Hlas avatara = stejný ElevenLabs klon** jako voiceover.
4. Generuj avatar klipy **jen pro intro/outro/přechody** (~1,5–3 min celkem), ne na celých 10 min.

**Čeština:** HeyGen podporuje češtinu s lip-syncem (175+ jazyků). Mluví plynně, ale kvalita přízvuku není nezávisle ověřená **(neověřeno)** — otestuj na 30s vzorku.
**Realistické omezení:** ruce, složitá gesta a celopostavové záběry zůstávají slabinou. Proto avatar = kotva, ne hlavní stopáž.
**Jak automatizovat:** HeyGen má API (~4 USD/min 1080p, 5 USD/min 4K). Lze napojit do n8n: skript → HeyGen render → klip.

---

### FÁZE 6 — ZÁBĚRY / B-ROLL

**Doporučený nástroj:** zdarma stock — **Pexels + Pixabay + Mixkit** (komerčně, bez atribuce)
**Alternativa:** placené Artgrid/Storyblocks/Envato • AI záběry Kling/Runway • Google Earth Studio
**Cena:** stock zdarma • Storyblocks 349 USD/rok unlimited • Artgrid Creator 359,90 USD/rok • Kling od 7,99 USD/měs • Runway Standard 15 USD/měs

**Zdroje záběrů (legálně) — co odkud:**

| Zdroj | Co | Licence / pozor |
|---|---|---|
| **Pexels / Pixabay / Mixkit** | drone/architecture 4K klipy | zdarma, komerčně, bez atribuce, neredistribuovat surový soubor |
| **Google Earth Studio** | kinematická letecká kamera nad jakoukoli stavbou | **zdarma, ale jen edu/film/nekomerčně + povinná viditelná atribuce „Google Earth" v obraze** |
| **ČÚZK Geoportál** | Ortofoto ČR i archivní z 50. let | CC BY 4.0, uveď „ČÚZK/CENIA, rok" — ideální na before/after proměnu lokality |
| **Vlastní záběry z ulice** | fasády staveb z veřejných prostranství | **svoboda panoramatu v ČR → i komerčně bez svolení architekta** (nejbezpečnější) |
| **Wikimedia Commons** | archivní foto | ověř licenci u KAŽDÉHO (PD/CC-BY OK, **vyhni se CC-BY-SA u videa**) |
| **Kling / Runway** | AI záběry, když chybí stock | jen koncept/atmosféra, **ne přesná geometrie** |

**AI B-roll — realistické limity (důležité pro architekturu):** AI video (Kling 3.0, Sora 2, Runway Gen-4) deformuje rovné linie, okenní mřížky a sloupy při pohybu kamery; mění počty pater/oken („halucinace geometrie"). **Nepoužívej čistý text-to-video pro konkrétní budovu.** Postup: image-to-video, ideálně „first+last frame" (vyrenderuj 1. a poslední snímek, AI dopočítá mezi), klipy 3–5 s, pomalé pohyby kamery. Cena AI animace ~0,10–0,75 USD/s (Kling ~0,10/s nejlevnější kvalitní) vs. 3000–15000 USD/min u tradičního studia. **Animace řezů/cutaway AI přesně neumí** — vyžadují 3D model.

**Anti-strike pojistka:** veď si u projektu složku s licencemi/ID ke každému assetu. Nikdy nespoléhej na fair use ani disclaimer „no infringement intended" — Content ID rozhoduje automaticky. Pro zahraniční stavby pozor: **Burj Khalifa = trademark Emaaru, zákaz komerčního použití** (editorial přes Getty/Pond5, kontakt mediasales@emaar.ae); UAE/Saúdská Arábie nemají svobodu panoramatu; **Millennium Tower (USA) = bezpečné Commons CC BY-SA**.

**Čas:** 30–60 min.
**Jak automatizovat:** stock přes Pixabay/Pexels API v n8n (klíčová slova ze skriptu → stažení klipů). AI záběry přes Kling/Runway API.

---

### FÁZE 7 — STŘIH

**Doporučený nástroj:** **DaVinci Resolve (zdarma)** — profi color, audio Fairlight, multitrack
**Alternativa:** CapCut (rychlost, mobil) • Eddie AI (auto-sestavení z vlastního materiálu) • Premiere Pro
**Cena:** DaVinci Resolve zdarma (Studio jednorázově 295 USD) • CapCut Pro ~19,99 USD/měs (Standard ~9,99) • Eddie AI Pro ~83 USD/měs

**Přesný postup (manuální):**
1. Polož voiceover jako páteř (A-roll spine).
2. Avatar klipy na intro/outro/přechody.
3. B-roll přes voiceover; archivní foto animuj **Ken Burns** efektem (přímo v DaVinci/CapCut, nebo Pixa/Visla zdarma).
4. Pacing: talking-head 15–25 s na střih, „burst" 5–10 rychlých střihů každé 2–3 min; v minutách 3–7 víc B-rollu, méně střihů.
5. Hudba (jemná ambient/lo-fi) + sound design na zakrytí limitů AI tváře.

**AI auto-střih (nejvíc delegovatelné):**
- **Eddie AI** (heyeddie.ai) — jediný nástroj, který sestaví rough cut z **vlastního** materiálu: loguje B-roll, položí relevantní subklipy přes voiceover páteř, exportuje editovatelnou timeline do Premiere/Resolve/FCP. „Night Shift" zpracuje přes noc. Používá jen reálné záběry (vhodné pro dokument). **Vyžaduje dočištění** — první rough cuty bývají „clunky".
- **Faceless/stock varianta:** Pictory/InVideo AI (auto-matching stock B-rollu ke skriptu), ale matching je „hit or miss" → manuální swapy. B-roll matching běží na sémantice transkriptu, takže **kvalita stojí na přesném českém přepisu** (Sonix/Maestra ~99 %).

**Realita:** žádný nástroj nedělá kompletní český 8–10min dokument „one-click profi". Počítej s hybridem: auto draft + manuální dočištění.
**Čas:** 60–90 min (manuál), méně s Eddie + dočištění.

---

### FÁZE 8 — TITULKY — KRITICKÉ PRO ČEŠTINU

**Doporučený nástroj:** **Submagic** (animované české titulky, ~99 %, 48+ jazyků vč. češtiny)
**Alternativa:** ❌ **NE CapCut** na český mluvený přepis — auto-titulky CapCutu spolehlivě pokrývají jen ~15 jazyků a **čeština mezi nimi není potvrzena** (překlad ano, automatický přepis české řeči nespolehlivý)
**Cena:** Submagic Free 3 videa (watermark) • Starter ~12 USD/měs (ročně) • Pro ~23 USD/měs (ročně)

**Proč titulky vždy (burned-in):** zvyšují retenci o ~15–25 % na YouTube; na Reels je 85 %+ diváků bez zvuku.

**Přesný postup:**
1. Vlož video do Submagic → vygeneruj české titulky.
2. **Zkontroluj českou diakritiku** a vlastní jména.
3. Animovaný styl, vysoký kontrast (bílý text s černým stínem), 1–2 s na frázi.

**Čas:** ~10 min.
**Jak automatizovat:** Submagic v n8n (templates #7992, #7730 — auto-caption + post). Levná open-source cesta: Whisper transkripce + FFmpeg burn-in (~0,006 USD/min).

---

### FÁZE 9 — THUMBNAIL

**Doporučený nástroj:** **Canva** (Magic Media AI, rule-of-thirds grid, šablony)
**Alternativa:** Photoshop (typografie) • AI: Pikzels/NeamX/Thumbmagic
**Cena:** Canva Free stačí • Pro 15 USD/měs

**Thumbnail šablony pro architekturu (vyber 1 layout):**
- **A) Before/After split** — matný/desaturovaný before vlevo vs. živý after vpravo + „PŘEDTÍM/POTOM" (split-screen až +52 % CTR vs. jeden záběr)
- **B) Wow záběr** — dronový/dramatický úhel budovy + 1–2 bold slova
- **C) Obličej+budova** — tvůj/avatarův close-up s emocí (úžas/šok) v jedné třetině + budova ve druhé + šipka na 1 detail (obličej až +30 % CTR)
- **D) Detail+kruh** — jeden zvýrazněný prvek + 2–3 slova

**Pravidla každého thumbnailu:** 2–3 barvy, subjekt o 30 %+ kontrastnější než pozadí, text 3–5 slov bold bezpatkové v **horní** části (mimo časovou značku vpravo dole), max 1 šipka/kruh. **Před publikací zmenši na 160×90 px** a ověř čitelnost na mobilu. Nezdvojuj text v thumbnailu a v titulku — mají se doplňovat.

**Čas:** ~15 min.
**A/B test:** nativní YouTube **Test & Compare** (zdarma, 3 varianty titulku/thumbnailu, vyhodnocení dle watch-time, do 2 týdnů). Hlouběji: TubeBuddy (~27 USD/měs) nebo ThumbnailTest (~29 USD/měs).

---

### FÁZE 10 — PUBLIKACE

**Doporučený nástroj:** **nativní YouTube Studio scheduler (zdarma)**
**Alternativa:** Metricool/Buffer na multiplatformu
**Cena:** YouTube scheduler zdarma • Buffer Essentials 6 USD/kanál • Metricool Free (1 profil), Starter ~20–25 USD/měs **(pozor: ne „6 USD/kanál" — to je Buffer)**

**Přesný postup:**
1. Titul: hlavní keyword (search) + emoční hook do prvních 40–50 znaků, celkem 50–60 znaků (mobil ořezává).
2. Prvních 100 znaků popisu = keywords; přidej zdroje záběrů a dat (Google Earth, ČÚZK/CENIA, licence).
3. **Compliance (povinné):** při uploadu zaškrtni **„Altered/synthetic content"** kvůli AI tváři + syntetickému hlasu. Od 27. 5. 2026 YouTube auto-aplikuje AI label na fotorealistický AI obsah. **Disclosure label sám o sobě NEsnižuje monetizaci ani distribuci** — riziko je „AI slop" politika, ne label.
4. End screen na tematicky navazující video (cíl 3–7 % prokliku, kvůli session time).
5. Naplánuj: long-form ráno 8–11 (ne/út).

**Čas:** ~10 min.
**Jak automatizovat:** YouTube node v n8n (OAuth2 + Data API v3). **Pozor na kvótu:** 10 000 jednotek/den, videos.insert = 1600 jednotek = **jen ~6 uploadů/den/projekt**; navýšení v Google Cloud trvá 1–4 týdny.

---

### FÁZE 11 — REPURPOSE NA REELS / SHORTS / TIKTOK

**Doporučený nástroj:** **Opus Clip** (dlouhé video → vertikální shorts, auto-captions)
**Alternativa:** Klap • Submagic Magic Clips • Vmaker
**Cena:** Opus Clip Free 60 min/měs • Starter 15 USD (150 min) • Pro 29 USD (300 min, AI B-roll, auto-post na 6 platforem)

**Přesný postup:**
1. Z každé minuty long-formu vystřihni **~5 momentů pod 60 s** (silné momenty, payoffy).
2. Přebal do **9:16 (1080×1920)**, nový **hook do 1–1,5 s** (ukaž hotovou stavbu/nejlepší záběr hned), vypálené titulky, platformový caption.
3. Délka 7–30 s (rychlé transformace 7–15 s, edukační 30–60 s), nikdy nad 90 s.
4. Caption = titulek videa s klíčovými slovy (silnější než hashtagy); **max 5 hashtagů** (cap od 12/2025).
5. CTA na DM share/save („pošli kámošovi, co staví") — top signál pro dosah na nenásledovníky.

**Architektonické formáty na rotaci:** before/after (rychlý cut na trending audio), drone timelapse/split-screen, reveal→pullout→orbit záběry, „věděl jsi že" fakta, kontroverzní hot take.
**Čas:** ~5 min (Opus Clip auto).
**Jak automatizovat:** Opus Clip API nebo n8n: nový YT upload → clip → publish na IG/TikTok/Shorts. Distribuce na 9 platforem jedním uzlem přes **Blotato** nebo **Upload-Post**.

---

## 3. Tabulka nástrojů s měsíčními náklady (3 varianty rozpočtu)

| Fáze | Levná (start) | Střední | Pro |
|---|---|---|---|
| Research | Perplexity Free | Perplexity Pro 20 | Perplexity Pro 20 |
| Skript | Claude/ChatGPT 1× 20 | Claude + ChatGPT 40 | Claude + ChatGPT 40 |
| **Český hlas (TTS)** | **ElevenLabs Free 0** | **ElevenLabs Creator 22** | **ElevenLabs Pro 99** |
| **AI avatar** | — (jen voiceover) | **HeyGen Creator 29** | HeyGen Creator 29 (+ dokup kreditů) |
| Záběry/B-roll | Pexels/Pixabay/GEarth 0 | + Kling 7,99 | + Storyblocks 349/rok (~29/měs) + Runway 15 |
| Střih | DaVinci/CapCut Free 0 | DaVinci Free 0 | Eddie AI Pro 83 |
| **České titulky** | Submagic Free 0 | **Submagic Pro ~23** | Submagic Pro ~23 |
| Thumbnail | Canva Free 0 | Canva Pro 15 | Canva Pro 15 |
| Publikace | YouTube scheduler 0 | YouTube scheduler 0 | Metricool ~20 |
| Repurpose | Opus Clip Free 0 | Opus Clip Starter 15 | Opus Clip Pro 29 |
| **CELKEM/měs (orientačně)** | **~20–25 USD** | **~75–95 USD** | **~210–250 USD** |

> Poznámky: ceny v USD, ceníky kolísají **(některé neověřeno)**. „Levná" varianta běží skoro celá na free tierech — limit je ElevenLabs Free 10k znaků (~10 min/měs) a HeyGen vynechán (jen voiceover, bez avatara). „Střední" je realistický stack pro pravidelný kanál 1 video/týden. „Pro" přidává AI auto-střih, placený stock a více kreditů na avatar.

---

## 4. Odhad času na 1 video a kde delegovat/automatizovat nejvíc

| Fáze | Čas (po zaběhnutí) | Delegovatelnost / automatizace |
|---|---|---|
| 1. Námět | 10–15 min | ◑ Perplexity/Trends do fronty |
| 2. Research | 15–30 min | ◔ **lidská kontrola faktů nutná** |
| 3. Skript | 15–40 min | ◑ prompt chaining, ale přepiš vlastním hlasem |
| 4. AI hlas | ~10 min | ● **plně (ElevenLabs API)** |
| 5. AI avatar | ~10 min | ● **plně (HeyGen API)** |
| 6. Záběry/B-roll | 30–60 min | ◑ stock API auto, výběr ručně |
| 7. Střih | 60–90 min | ◑ Eddie AI draft + dočištění |
| 8. Titulky | ~10 min | ● **plně (Submagic)** |
| 9. Thumbnail | ~15 min | ◑ Canva AI + ruční dotažení |
| 10. Publikace | ~10 min | ● **plně (scheduler/API)** |
| 11. Repurpose | ~5 min | ● **plně (Opus Clip auto)** |

**Realný celkový čas na 1 video po zaběhnutí: ~2–4 hodiny** (odhad z workflow, neověřeno přesně).

**Kde se dá automatizovat/delegovat nejvíc (●):** hlas, avatar, titulky, publikace, repurpose — to jsou mechanické kroky s API. **Kde NE (◔):** research a faktická kontrola + finální editorský úsudek nad skriptem — tady vzniká „meaningful variation", která drží kanál monetizovatelný a poráží AI-slop.

---

## 5. Co jde skriptem / AI workflow zautomatizovat úplně (n8n/Make + API)

Pro „minimum práce" lze postavit **end-to-end n8n pipeline**. Kanonická architektura:

```
Perplexity (research témat)
   → Google Sheet (fronta, status „Pending", 1 řádek = 1 video)
   → LLM (OpenAI/Anthropic): skript + popis + caption + image prompty
   → ElevenLabs API: český voiceover (TTS)
   → vizuály: Pixabay/Pexels API stock + AI (Kling/Runway) image-to-video
   → [volitelně HeyGen API: avatar intro/outro]
   → render/sestavení: JSON2Video (TTS v ceně) / Creatomate / Shotstack
   → titulky: JSON2Video burn-in / Submagic / Whisper+FFmpeg
   → distribuce: Blotato / Upload-Post (YT + IG + TikTok + FB + LinkedIn najednou)
```

**Hotové n8n templates (n8n.io/workflows):**
- **#3442** — Fully automated AI video generation & multi-platform publishing (POV shorty, OpenAI captions+prompty, ElevenLabs, publikace na 5 platforem)
- **#12392** — OpenAI skripty + ElevenLabs + Pixabay stock + Shotstack render
- **#6014** — Gemini + ElevenLabs + Leonardo + Shotstack
- **#5674 / #5995** — Perplexity research → video prompty
- **#3044** — burn-in titulky přes JSON2Video

**Konkrétní API napojení:**
- **ElevenLabs** — nativní n8n node, ~0,30 USD/1000 znaků
- **HeyGen** — API ~4 USD/min (1080p), 5 USD/min (4K)
- **JSON2Video** — 49 USD/200 min Full HD, TTS v ceně, nativní n8n integrace přes webhook (nejvýhodnější pro auto pipeline)
- **YouTube Data API v3** — OAuth2, kvóta 10k/den (~6 uploadů)

**Náklady provozu:** orchestrace n8n **self-hosted ~4–7 USD/měs na VPS** (neomezené executions, 1 execution = celý workflow) — výrazně levnější než Make.com (účtuje po krocích, vícekrokové video vyjde dráž). Celkem **35–70 USD/měs**, **per-video pod 1 USD** (0,30–0,80 USD), avatarová varianta i ~0,03 USD/reel (odhady z blogů, neověřeno).

**Co automatizovat NEJDE / pozor:**
- **Plně syntetický „one-click" kanál = riziko demonetizace** (YouTube inauthentic policy 1/2026). Vždy přidej lidskou editaci a originální úhel.
- **YouTube kvóta** — vyřeš navýšení předem (1–4 týdny).
- **Český B-roll matching** stojí na kvalitě přepisu (Sonix/Maestra ~99 %).
- **AI B-roll konkrétní budovy** — nespoléhej na text-to-video, hlídej geometrii.

**Doporučení:** začni s hotovým templatem #3442 nebo #12392 jako kostrou, neStavěj od nuly. Modulárně testuj každý blok zvlášť. Drž **~2–4 kvalitní videa/týden** (vyšší objem = red flag pro „mass production").
