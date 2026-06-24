# 00 — SHRNUTÍ A SYSTÉM

> Executive summary + celý doporučený systém na jednom místě. Jádrem je **AI PREZENTER** — digitální „AI člověk" jako stálá tvář a hlas kanálu o architektuře. Tomu je podřízené všechno ostatní.
> Vše čerpá z korpusu zjištění (10+ oblastí researche + ověření faktů). Neověřené údaje jsou značeny **(neověřeno)**. Ceny jsou orientační k červnu 2026, vždy ověř aktuální ceník u nástroje.

---

## 1) TL;DR — co dělat

**Postav český architektonický YouTube + Instagram kanál, jehož stálou tváří a hlasem je jeden konzistentní AI prezenter** (fotorealistický digitální moderátor s vlastním jménem, tváří, hlasem a stylem). Prezenter vypráví dlouhá YouTube videa i krátké reels — vždy stejná persona, aby vznikl parasociální vztah jako u Stewarta Hickse nebo Freda Millse (B1M).

- **Formát videa:** AI avatar jako *talking-head kotva* v intru/outru a u přechodů (reálně mluví ~1,5–3 min z 10min videa), mezi tím architektonický b-roll + voiceover stejným klonovaným hlasem. Důvod: avatar non-stop = drahý na kreditech + uncanny valley (ruce, gesta, dlouhá mluva).
- **Nika:** vzdělávací video-esej „Proč…?" o české/světové architektuře (model Stewart Hicks / B1M, lokalizovaný na ČR). White space: **plně AI-prezentovaný český architektonický kanál neexistuje.**
- **Kadence:** 1 dlouhé video (8–15 min) týdně + 3–5 reels/Shorts týdně (z výstřižků dlouhého videa).
- **Stack (rozumný start, ~50–90 USD/měs):** HeyGen (avatar) + ElevenLabs (klonovaný hlas) + Claude/ChatGPT (skript) + Perplexity (rešerše) + DaVinci/CapCut (střih) + Submagic (titulky) + Canva (thumbnaily).
- **Compliance:** na YouTube i Meta povinně označit AI/syntetický obsah; klon **vlastního** hlasu disclosure nevyžaduje. Drž „meaningful variation" mezi videi (vlastní research, originální úhel), jinak hrozí demonetizace dle inauthentic-content politiky.
- **Cíl prvního roku:** YPP přes watch-hours cestu (1000 odběratelů + 4000 h za 12 měsíců), ne přes Shorts.

---

## 2) Koncept AI prezentera — stálá persona (JÁDRO SYSTÉMU)

Cílem je **digitální moderátor jako značka kanálu**: jedna tvář + jméno + hlas + styl, konzistentní napříč všemi videi i reels. Stálost persony = stejná tvář (HeyGen Digital Twin) + stejný klonovaný hlas (ElevenLabs) + jednotné jméno/branding ve všech výstupech. To je páka na retenci a rozpoznatelnost — funguje to u B1M (Fred Mills), Stewarta Hickse i DamiLee.

### Persona — 4 stavební kameny
| Prvek | Doporučení | Nástroj |
|---|---|---|
| **Tvář** | Vlastní tvář (právně i prakticky nejbezpečnější) NEBO konzistentní fiktivní obličej | HeyGen Digital Twin z 2–5 min videa; fiktivní přes Midjourney V7 `--oref --ow 100–150` **(neověřeno)** → animovat v Hedra/HeyGen |
| **Jméno** | Stálé jméno persony ve všech videích + brandingu | — |
| **Hlas** | Klon vlastního hlasu (1–3 min čistého CZ záznamu), stejný pro avatar i voiceover | ElevenLabs Professional Voice Clone (od Creator plánu); model Multilingual v2 nebo Eleven v3 |
| **Styl** | Konzistentní tón, „voice reference" 200 slov vkládaná do každého skript-promptu | — |

### Doporučený režim výroby videa: avatar jako kotva + b-roll mezi tím
Avatar **nedávej na celých 10 min** — je to drahé na kreditech (Avatar IV = 20 kreditů/min, Creator plán zvládne jen ~10–30 min avatara/měs **(neověřeno — 200 vs 600 kreditů dle zdroje)**) a působí uncanny. Osvědčená struktura:

```
INTRO   (avatar 20–40 s)  → hook, představení tématu, otevření smyčky
SEGMENT 1–4  (b-roll staveb + voiceover)  → každý setup → development → payoff
PŘECHODY  (avatar 5–10 s, volitelně)  → re-hook „za chvíli ukážu…"
OUTRO   (avatar 15–30 s)  → uzavření smyčky + tease dalšího dílu + end screen
```
Avatar reálně mluví do kamery jen ~1,5–3 min z 10min videa. Hlas avatara = **stejný klonovaný hlas** jako voiceover, aby byla persona slyšitelně jednotná. Limity AI tváře (ruce, gesta) se kryjí střihem, b-rollem a sound designem.

### Klíčová slabina a její řešení
- **Výslovnost vlastních jmen** (architekti, názvy staveb) je největší slabina CZ TTS. Řešení: **výslovnostní slovník v ElevenLabs** (IPA/alias) pro „Mies van der Rohe", „Ještěd", „Müllerova vila", „Le Corbusier" atd.
- **Čeština je „použitelná, ne rodilá bez chyby"** — před nákupem otestuj 30s vzorek.

---

## 3) Pozicování / nika a v čem se odlišit (WHITE SPACE)

### Globální benchmark (ověřená čísla, červen 2026)
| Kanál | Odběratelé | Formát | Co převzít |
|---|---|---|---|
| The B1M | **4 mil.** (32 mil. zhlédnutí/měs) | stavební dokument o megaprojektech | dramaturgie, „Why [místo] Is [stav]" |
| DamiLee | **~2,3 mil.** | architektura + popkultura/AI | spojení s každodenním životem |
| Stewart Hicks | **~670 tis.** (93,4 mil. zhlédnutí, 155 videí za 5 let) | video-esej „Why…?" 12–15 min | **nejlepší replikovatelný vzor** — nízkonákladový, jeden hlas |
| Never Too Small | ~3 mil. **(neověřeno; 1,7 mil. doloženo 2023)** | opakovatelné prohlídky malých bytů | binge formát, šablona titulku |

### Česká scéna je mělká
Vede **Adam Gebrian** (kritika/edukace) a **ARCHIZOOM** (rozhovory); DIY drží Stavba od A po Z, Svépomocí.cz; realitně-lokální **Daniel Kotula / „Žít Prahu"**. Chybí česká obdoba B1M, Stewarta Hickse i Never Too Small.

### „YAP" — pozn. k zadání
Kanál jménem „YAP" o architektuře se v 20+ vyhledáváních **nepodařilo dohledat** — jde patrně o interní zkratku / překlep / jiný název. Reálné „YAP" entity jsou jiná témata (Joey Yap = feng-šuej; YAP = Young Architects Program MoMA). Jako žánrové vzory ber B1M / Hicks / DamiLee.

### V čem se odlišit (white space pro CZ)
1. **Plně AI-prezentovaný český architektonický kanál = neobsazený white space.** Stálý digitální moderátor v češtině nikdo nedělá.
2. **Lokalizovaný video-esej „Proč naše města/domy vypadají takhle"** (Hicks model na ČR): „Proč paneláky nejsou špatné", „Proč nové čtvrti nemají duši".
3. **Mýtoborné a dramatické příběhy** (vysoké CTR): zbourané ikony (Hotel Praha, Transgas), tragédie (Stalinův pomník + sebevražda sochaře), kontroverze (Maj, Vltavská filharmonie „kopie?"), debunky (Burj Khalifa fekální kamiony).
4. **Odlišení od Kotuly:** Kotula = on-camera makléř, realitní lead-gen, jen Praha, walk-and-talk. Ty = AI persona, čistá edukace/storytelling, celá ČR + svět, vyšší vizuální produkce. Převezmi od něj: železná pravidelnost (čtvrtek), titulky na zvědavost („co jste netušili"), recyklace 1 natáčení do více formátů.

### Čemu se vyhnout (přesycené 2025/26)
Generický megaprojektový hype (Dubaj/NEOM dokola), AI-slop renderové kompilace bez hlasu/pointy (YouTube maže — leden 2026: ~16 kanálů, 4,7 mld. zhlédnutí), suché fly-through, žebříčky „TOP 10 nejdražších domů".

---

## 4) Cílové KPI

| Metrika | Cíl | Zdroj/benchmark |
|---|---|---|
| **Retence 1. minuta** | 70 %+ | práh agresivního promo |
| **Celková retence (long-form edu)** | 35–50 % | silný výkon v žánru |
| **CTR (organic)** | 4–6 % dobré, 6 %+ výborné, search ~12 % | — |
| **Tvar retenční křivky** | plynulá, bez útesů | důležitější než průměr |
| **3s hold (Reels)** | 60 %+ | 5–10× větší dosah **(neověřeno)** |
| **End screen proklik** | 3–7 % | session contribution |
| **Růst odběratelů (edu, zavedený)** | 3–8 %/měs (střední 8–15 %) | nad platformovým průměrem 3,1 % |
| **YPP milník** | 1000 odb. + 4000 h / 12 měs | watch-hours cesta, ne Shorts |
| **Kadence** | 1 long-form + 3–5 reels týdně | konzistence > objem |
| **Čas na 1 video** | 2–4 h po zaběhnutí | — |
| **Náklady/měs** | 50–90 USD (min. <25 USD) | — |

---

## 5) START ZDE — prvních 7 kroků tento týden

1. **Vytvoř hlas (den 1).** Nahraj 1–3 min čistého českého hlasu → ElevenLabs Professional Voice Clone (Creator plán 22 USD/měs). Založ výslovnostní slovník pro CZ jména staveb/architektů.
2. **Vytvoř AI avatara (den 1–2).** HeyGen Creator (~29 USD/měs): natoč 2–5 min klidného mluvení do kamery (dobré světlo) → Digital Twin (Avatar IV/V) + **natoč povinný on-camera consent**. Vytvoř 2–3 „looks" (pozadí/oblečení). Tohle je stálá tvář pro VŠECHNA videa. (Alternativa fiktivní persony: Midjourney → Hedra.)
3. **Zafixuj personu (den 2).** Jméno + tón + vizuální branding + 200slovní „voice reference" pro skript-prompty.
4. **Připrav skript-systém (den 2–3).** Ulož si 4 řetězené prompty (viz dok. 08): OUTLINE → 5× HOOK → SEGMENTY s open-loops → RETENTION AUDIT. Placeholdery `[TÉMA] [STAVBA] [DÉLKA] [PUBLIKUM] [TÓN]`.
5. **Vyber 5 témat (den 3).** Z dok. 06: začni dramatem se silným hookem — Hotel Praha, Transgas, Stalinův pomník, Tančící dům, Vila Tugendhat. Ověř fakta v Perplexity.
6. **Vyrob pilotní video (den 4–6).** 1 video 8–10 min: Perplexity rešerše → Claude skript → ElevenLabs voiceover → HeyGen avatar (intro/outro) → b-roll (Pexels/Pixabay zdarma + Google Earth Studio s atribucí) → střih DaVinci → Submagic titulky → Canva thumbnail (A/B přes YouTube Test & Compare).
7. **Nastav distribuci a compliance (den 7).** Při uploadu zaškrtni AI/altered-synthetic na YouTube i „AI Info" na Meta. Z videa udělej 3–5 reels (Opus Clip), publikuj přes nativní scheduler / Metricool. Naplánuj pravidelný den vydání.

---

## 6) Balíček dokumentů (01–08 + 04b)

> **Pozn.:** názvy a čísla souborů odpovídají skutečným souborům v této složce (čti je v tomto pořadí, nebo skoč rovnou na `04` + `04b`, což je provozní jádro).

| Dok. | Soubor | Co v něm je |
|---|---|---|
| **00** | `00-SHRNUTI-A-SYSTEM.md` | *(tento dokument)* TL;DR, koncept AI prezentera, pozicování/white space, KPI, prvních 7 kroků |
| **01** | `01-ANALYZA-KONKURENCE.md` | YAP (nedohledán → přenositelný playbook žánru), Daniel Kotula / „Žít Prahu" detailně, tabulka CZ+světových kanálů (B1M, Hicks, DamiLee, Never Too Small…), společné vzorce úspěchu, co je přesycené, **co převzít / co dělat jinak** |
| **02** | `02-VIRAL-MECHANIKA.md` | retenční věda (hook 0–30 s, open loops, re-hooky, pattern interrupts, pacing), YouTube algoritmus 2025/26 (CTR × retence × watch time), packaging — šablony titulků („Why" vzorec, curiosity gap) a thumbnailů (before/after, obličej, kontrast) + checklist, A/B Test & Compare |
| **03** | `03-FORMATY-A-SABLONY.md` | univerzální story struktura + **7 YouTube formátů** (Příběh stavby, „Proč je X…", Before/After, Debunk, Anatomie, Opuštěná stavba…) a **4+ Reels formátů**, každý s časovými značkami a typem vizuálu |
| **04** | `04-AUTOMATIZACE-PIPELINE.md` | **těžiště** — kompletní produkční pipeline krok za krokem (námět→research→skript→AI hlas→AI avatar→b-roll→střih→titulky→thumbnail→publikace→reels), nástroje + ceny ve 3 rozpočtech, český TTS, **n8n/Make automatizace přes API**, čas na 1 video |
| **04b** | `04b-AI-PREZENTER.md` | „AI člověk" detailně — srovnání HeyGen/Synthesia/Captions/Argil/Hedra (fotorealismus, CZ lip-sync, cena), doporučený stack, tvorba stálé persony (Digital Twin / fiktivní tvář, klon hlasu, výslovnostní slovník), uncanny valley + režim kotva, právo/consent, dávková výroba přes API |
| **05** | `05-ZDROJE-OBSAHU-A-PRAVA.md` | legální zdroje záběrů/dat (Pexels/Pixabay, Google Earth Studio + atribuce, ČÚZK/CENIA ortofoto, Mapy.cz, Wikimedia, NPÚ, Kramerius), drony + legislativa CR/EU, **světové stavby a svoboda panoramatu** (Burj Khalifa/NEOM rizikové, Millennium Tower USA OK), anti-copyright-strike pojistka |
| **06** | `06-CONTENT-PLAN-NAMETY.md` | **zásobník 28+ námětů** (Hotel Praha, Transgas, Stalinův pomník, Tugendhat, Baťa, Ještěd, Vltavská filharmonie, Maj, Burj Khalifa, NEOM…) s hookem/úhlem/VP/dostupností vizuálu, **8týdenní kalendář**, recyklace 1 YT → 3–5 reelů, batch produkce |
| **07** | `07-SKRIPT-SABLONY.md` | šablona skriptu pro 8–10min YT + šablona reelu (s placeholdery a poznámkami k vizuálu/časování) + **2 hotové vzorové skripty** k nahrání do TTS (YT: Stalinův pomník; reel: Tančící dům), knihovna hook a CTA frází |
| **08** | `08-SOP-CHECKLIST-A-PROMPTY.md` | provozní SOP: produkční checklist od námětu po publikaci, týdenní batch rozvrh, **knihovna hotových copy-paste AI promptů** (námět, skript s retencí, titulky/popisky, thumbnail, reels, SEO/hashtagy), KPI a jejich sledování, časté chyby |

---

*Celý systém stojí na jednom rozpoznatelném AI moderátorovi (tvář + jméno + hlas + styl) jako stálé značce kanálu. Tomu jsou podřízené formát (kotva + b-roll), nika (CZ video-esej „Proč…?"), produkce (avatar batchovaný do krátkých klipů) i compliance (AI disclosure + meaningful variation). Vše ostatní v dokumentech 01–08 je exekuce tohoto jádra.*
