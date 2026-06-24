# 04b — AI PREZENTER: tvář a hlas kanálu (kompletní návod)

> Hloubkový návod na **AI moderátora / fotorealistického AI prezentera** jako stálou tvář a hlas architektonického kanálu pro YouTube i Reels/Shorts.
> Vše je **konkrétní a připravené k použití**: ceny, názvy nástrojů, reálné URL, hotové kroky, šablony, výslovnostní slovník.
> Kde je údaj neověřený, je označen **(neověřeno)**. Ceny jsou orientační k červnu 2026 — před nákupem ověř aktuální ceník přímo u nástroje.

---

## 1) Cíl: co vlastně stavíme

Cílem je **jedna konzistentní, fotorealistická persona** — stejná tvář + stejný hlas + stejné jméno/branding ve **všech** videích napříč YouTube (16:9) i Reels/Shorts/TikTok (9:16). Tato persona dělá kanálu rozpoznatelnou „značku obličeje" a buduje **parasociální vztah**, který v této nice (Stewart Hicks, Fred Mills/The B1M, DamiLee) táhne retenci víc než produkční rozpočet.

**Co znamená „konzistentní prezenter" v praxi:**
- **Stejná tvář** napříč scénami, pozadími a měsíci (avatar natočený v lednu vypadá stejně jako v červnu).
- **Stejný klonovaný český hlas** — i ve voiceoveru přes b-roll, ne jen když mluví avatar (jednotná zvuková identita).
- **Stejné jméno + vizuální styl** (oblečení, barevná paleta, intro/outro grafika).

**Klíčové realistické rozhodnutí hned na začátku:** AI prezenter NENÍ určen na to, aby mluvil do kamery celých 8–10 min. To je drahé na kreditech a spadne do uncanny valley (viz sekce 5). Cílový model je **avatar jako „kotva"** v intru/outru a u přechodů (~1,5–3 min z 10min videa), zbytek = architektonický b-roll s voiceoverem stejným klonovaným hlasem.

---

## 2) Srovnávací tabulka nástrojů (2026)

| Nástroj | Fotorealismus | Český lip-sync / hlas | Max délka | Cena (vstup) | Vodoznak | K čemu se hodí |
|---|---|---|---|---|---|---|
| **HeyGen** (Avatar IV / V „Digital Twin") | **Nejvyšší** „raw" realismus (mikrovýrazy, gesta řízená audiem) | Čeština + lip-sync (175+ jaz.); plynulá, přízvuk slabina u vlastních jmen **(neověřeno přesně)** | Creator klipy do několika min; reálně limit přes kredity | Creator **29 USD/měs** (24 ročně) | Free má vodoznak (3 videa, 1 min, 720p); placené bez | **Doporučený** — fotorealistická stálá tvář kanálu |
| **Synthesia** | Vysoký, ale záměrně neutrální; **max konzistence** | Čeština pro avatary i voice cloning | Starter **10 min/měs** | Starter **~29 USD/měs** (18–22 ročně) | Placené bez | Korporát, max stabilita/compliance; pro tvůrce méně flexibilní |
| **Captions AI** | Dobrý (AI Twin, AI actors) | Podporuje, kvalita CZ neověřena **(neověřeno)** | Kreditový systém | Max **24,99 USD/měs** | Free export bez vodoznaku, ale bez AI funkcí; Pro/Max/Scale bez | Reels/Shorts, vertikální formát, rychlé klipy |
| **Argil** | Dobrý, UGC/founder-led styl | Klon z vlastního videa; CZ neověřena **(neověřeno)** | Classic ~25 min/měs | **Classic 39 USD/měs** (ne 27) | Placené bez | „Founder-led" persona, UGC; klon z vlastního videa |
| **Arcads** | „NeAI vypadající" UGC herci | EN-orientované; pro CZ architekturu nevhodné | dle kreditů | **Starter 110 USD/měs** | — | UGC reklamy; **pro architekturu spíš ne** (drahé, off-topic) |
| **D-ID** | Střední (talking-photo/lip-sync) | Podporuje; CZ kvalita neověřena **(neověřeno)** | dle planu | **~4,7–5,9 USD/měs** (Lite) | **Vodoznak až do ~196 USD/měs Advanced** (Pro ~49) | Levný vstup pro talking-photo; vodoznak je háček |
| **Hedra** (Character-3) | Dobrý na **statickou foto-personu** | ~15+ jaz. reálný lip-sync; **čeština neověřena** **(neověřeno)** | Creator ~11 min/měs | **Creator 30 USD/měs** (Basic 15, Pro 75) | Free vodoznak; placené bez | Animace mluvící tváře z **fotky** (fiktivní persona) |

**Poznámky k cenám a kreditům (důležité):**
- **HeyGen kredity jsou sporné:** oficiální Help Center uvádí **600 kreditů** na Creatoru (= ~30 min Avatar IV), část recenzí z 2026 jen **200 „premium" kreditů** (= ~10 min). **Avatar IV/V stojí 20 kreditů/min** (1 kredit / 3 s). Počítej s rizikem, že reálně dostaneš jen ~10 min/měs. Dokup ~300 kreditů za ~15 USD (~5 USD/min). Přes API: ~4 USD/min (1080p), 5 USD/min (4K).
- **Synthesia:** vlastní avatar vlastní podoby reálně až u vyššího ročního plánu (~53 USD/měs ročně) + 15min natáčení; Express avatar add-on ~1000 USD/rok.
- Žádný plán nedává neomezený fotorealistický avatar — proto avatar **dávkuj** do krátkých klipů (viz sekce 5).

---

## 3) Doporučený stack + proč

### Jádro
| Vrstva | Nástroj | Cena | Proč |
|---|---|---|---|
| **Avatar / tvář** | **HeyGen** Avatar IV/V Digital Twin | Creator 29 USD/měs | Nejvyšší fotorealismus na trhu + čeština s lip-syncem + konzistentní napříč videi |
| **Hlas** | **ElevenLabs** Multilingual v2 (+ Professional voice clone) | Creator 22 USD/měs (Free 10k kreditů na test) | Nejlepší český AI hlas; klonování vlastního hlasu; výslovnostní slovník na jména staveb |
| **Střih / sestavení** | DaVinci Resolve (zdarma) nebo CapCut | 0 / 9,99–19,99 USD | Složení avatara s b-rollem, Ken Burns, hudba |
| **Titulky** | **Submagic** (ne CapCut na CZ auto-titulky) | ~12–23 USD/měs ročně | Spolehlivé české titulky ~99 %; CapCut auto-titulky z české mluvené řeči nespolehlivé |
| **Shorts/Reels přestřih** | OpusClip / Captions | 15–29 USD / 24,99 USD | Vertikální klipy z long-formu |

### Proč právě tahle kombinace (a ne end-to-end generátor)
1. **Modulární > monolit.** End-to-end generátory (Pictory/InVideo/Fliki) dají horší českou kvalitu a menší kontrolu nad záběry. Pro stálou personu potřebuješ kontrolu nad tváří (HeyGen) a hlasem (ElevenLabs) zvlášť.
2. **HeyGen = realismus + flexibilita.** Nezávislé recenze 2026 dávají Avatar IV/V vrch v „raw" realismu před Synthesií. Pro tvůrčí kanál (ne korporát) je to správná volba.
3. **ElevenLabs = nejlepší čeština + výslovnostní slovník.** Jediný způsob, jak donutit hlas správně říkat „Mies van der Rohe", „Ještěd", „Müllerova vila".
4. **Submagic místo CapCut na titulky** — CapCut auto-rozpoznávání české mluvené řeči je nespolehlivé; Submagic má češtinu nativně ~99 %.

### Minimální start (pod ~25 USD/měs)
Jen **ElevenLabs Creator (22 USD)** na hlas + HeyGen Free (test, vodoznak) + zbytek free verze (DaVinci, Pexels, YouTube scheduler). Plný rozumný stack: **~50–90 USD/měs**.

---

## 4) Krok-za-krokem: jak vytvořit stálou personu

### KROK 0 — Rozhodnutí: vlastní tvář vs. fiktivní persona

| | **Vlastní tvář** (doporučeno) | **Fiktivní persona** |
|---|---|---|
| Právně | Bezpečné — je to tvoje tvář, on-camera consent natočíš sám | Riziko, pokud připomíná reálnou osobu; musíš mít práva |
| Realismus | Nejvyšší (Digital Twin z reálného videa) | Nižší (animace z fotky) |
| Postup | 2–5 min klidného mluvení do kamery + dobré světlo | Vygeneruj konzistentní obličej v Midjourney V7 (`--oref`, `--ow 100–150`) **(parametry neověřeny)**, animuj v Hedra/HeyGen |

> **Doporučení:** pokud nemáš silný důvod skrýt se, použij **vlastní tvář** — je to právně i prakticky bezpečnější a realističtější.

### KROK 1 — Naklonuj český hlas (ElevenLabs)
1. Nahraj **1–3 min čistého českého hlasu** (tichá místnost, kvalitní mikrofon, přirozená narace).
2. V ElevenLabs vytvoř **Professional Voice Clone** (vyžaduje Creator plán, 22 USD/měs).
3. Použij model **Multilingual v2** (nejvyšší kvalita pro naraci) nebo **Eleven v3** (nativní IPA pro 70+ jazyků vč. češtiny).
4. **Tip:** tentýž klon používej i pro voiceover přes b-roll — ať je persona slyšitelně jednotná.

#### Výslovnostní slovník — hotová tabulka pro architekturu
V ElevenLabs Studiu vytvoř **Pronunciation Dictionary** a vlož problematická jména (IPA na modelech `eleven_flash_v2`/`eleven_v3`, jinak alias = náhradní hláskování). Toto je hlavní páka proti tomu, aby hlas komolil názvy staveb:

| Slovo / jméno | Problém | Řešení (alias / náhradní hláskování) |
|---|---|---|
| Mies van der Rohe | cizí jméno | „Mís fan der Róé" |
| Le Corbusier | francouzština | „Le Korbyzié" |
| Ludwig Mies | DE | „Ludvik Mís" |
| Ještěd | háčky | (ověř, jinak alias „Ještěd" foneticky) |
| Müllerova vila | přehláska | „Mýlerova vila" |
| Tugendhat | DE jméno | „Túgendhat" |
| Baťa / Baťův | ť | „Baťa" / „Baťuv" |
| Gehry (Tančící dům) | EN | „Géry" |
| Kaplický | y | „Kaplickí" |
| Bjarke Ingels (BIG) | DK/EN | „Bjarke Ingls" |
| Ryugyong | korejština | „Rjugjong" |
| NEOM | akronym | „Neom" |

> Vždy si vygeneruj **30s test** s těmito jmény a poslechni, než vyrobíš celé video.

### KROK 2 — Vytvoř avatar (HeyGen Digital Twin)
1. Natoč **2–5 min** klidného mluvení do kamery (čelní pozice, do ~45°, jeden mluvčí na záběr, dobré světlo).
2. Natoč **povinné on-camera consent video** (předepsaný text HeyGenu, do 30 s) — bez něj avatar nevytvoříš.
3. HeyGen z toho udělá **Digital Twin** (Avatar IV/V), znovupoužitelný napříč projekty. Avatar V umí twin i z kratšího ~15s reference.
4. Vytvoř **2–3 „looks"** (jiné pozadí/oblečení) pro vizuální pestrost — z jednoho avatara lze odvodit více looků (princip potvrzen; „až 100 looks" = **(neověřeno)**).

### KROK 3 — Branding persony (stálost)
Stálost = **stejná tvář + stejný klonovaný hlas + jednotný branding**. Zafixuj:
- **Jméno** prezentera (vymyšlené nebo tvoje), opakuj ho v intru.
- **Vizuální styl:** barevná paleta, intro/outro grafika, font titulků, stejné pozadí/look.
- **Tón hlasu:** klidný, vysvětlující („VSauce architektury").

### KROK 4 — Skript se strukturou pro avatar-kotvu
Piš na strukturu, kde avatar mluví jen ~1,5–3 min z 10 min:
```
INTRO (avatar, 20–40 s)  → hook + slib
SEKCE 1–4 (b-roll staveb + voiceover stejným klonovaným hlasem)
  └ přechody: krátký avatar klip (5–15 s) jako „kotva" mezi sekcemi
OUTRO (avatar, 15–30 s)  → uzavření smyčky + CTA na další video
```

### KROK 5 — Produkce
- Vygeneruj avatar klipy v HeyGen (intro/outro/přechody).
- Zbytek vyprávěj **ElevenLabs voiceoverem** přes architektonický b-roll (vlastní záběry, Pexels/Pixabay, Google Earth Studio, případně AI render z Kling).
- **Hlídej jednotu:** hlas avatara = stejný klon jako voiceover.

### KROK 6 — Střih a export
- Slož v DaVinci/CapCut, přidej **burned-in titulky** (Submagic, CZ ~99 %), sound design a hudbu (kompenzuje limity AI tváře).
- Exportuj **16:9** pro YouTube a zvlášť **9:16** pro Reels/Shorts (OpusClip/Captions).

### KROK 7 — Compliance (viz sekce 7).

---

## 5) Realistická omezení, uncanny valley a osvědčený kompromis

### Kde AI avatar pořád selhává (2026)
- **Ruce a složitá gesta** — Avatar IV má často „náhodnou/nekontrolovanou" gestikulaci; Avatar V je hladší, ale pořád ne na úrovni natočeného člověka.
- **Celopostavové záběry** — většina avatarů má minimální pohyb pod obličejem.
- **Dlouhá nepřetržitá mluva** — close-up emoce při 8–10 min nepřetržité řeči padají do uncanny valley a jsou nudné.

### Osvědčený kompromis: avatar jako KOTVA + b-roll
| Část videa | Co běží | Proč |
|---|---|---|
| Intro (20–40 s) | Avatar mluví do kamery | Naváže parasociální vztah, „tvář kanálu" |
| Tělo (sekce) | **B-roll staveb + voiceover** (stejný klon. hlas) | Levnější (méně kreditů), realističtější, vizuálně zajímavější |
| Přechody (5–15 s) | Krátký avatar klip | „Kotva" mezi sekcemi, drží personu |
| Outro (15–30 s) | Avatar uzavírá + CTA | Posílá diváka dál (session time) |

**Výhody:** šetří kredity (avatar drahý — 20 kr./min), obejde uncanny valley, dělá video pestřejší. Cinematickým střihem, sound designem a titulky se limity AI tváře schovají.

---

## 6) Český jazyk — co reálně funguje vs. co zatím ne

### Funguje
- **Český TTS / voiceover (ElevenLabs)** — produkční kvalita, Multilingual v2 / Eleven v3, správná diakritika, přízvuk na první slabice.
- **Lip-sync v HeyGen** — čeština jako výstupní jazyk funguje plynně.
- **České titulky (Submagic)** — ~99 %, nativní podpora češtiny.

### Slabiny / co zatím nefunguje spolehlivě
- **Vlastní jména** (architekti, názvy staveb) — generický TTS je komolí. **Řešení: výslovnostní slovník** (sekce 4, KROK 1).
- **Přízvuk u dlouhých textů** — občas „ujede"; čeština je „lower-traffic" jazyk, nemusí dosahovat kvality EN/ES/FR/DE. Tvrzení „přízvuk minimální" je **(neověřeno)** — udělej vlastní 30s test.
- **CapCut auto-titulky z české mluvené řeči** — nespolehlivé / často chybí. Překladové titulky CapCut zvládne, ale **na český voiceover použij Submagic**, ne CapCut.
- **CZ podpora u Hedra / Captions / Akool / D-ID** — **(neověřeno)**, otestuj na free tieru před nákupem.

### Jak řešit výslovnost českých/cizích názvů — postup
1. Vytvoř **Pronunciation Dictionary** v ElevenLabs (IPA nebo alias).
2. Vlož všechna jména z tabulky v sekci 4 + svá témata.
3. Vygeneruj **30s test** se jmény, poslechni, dolaď alias.
4. U opravdu problémových slov rozděl foneticky (např. „Mís fan der Róé").

---

## 7) Právní a etické: povinné označení AI obsahu

### YouTube
- **Povinné označení** „altered/synthetic content" při uploadu, jakmile jde o **fotorealistickou osobu mluvící syntetickým/klonovaným hlasem** (přesně AI prezenter). Long-form: label pod přehrávačem nad popisem; Shorts: overlay na videu.
- **Od 27. 5. 2026** YouTube **automaticky** aplikuje AI label na videa s významným fotorealistickým AI použitím i bez disclosure — tento auto-label **nelze odstranit**.
- **Důležité upřesnění:** samotný disclosure label **NEMÁ vliv** na doporučování ani monetizaci. Riziko je **„AI slop" politika** (nízkohodnotný masově generovaný obsah) a opakovaná NE-disclosure → eskalace až k odebrání videa a vyloučení z Partner Programu.
- **Nehlásí se** AI použité jen na scénář / nápady / titulky.
- **Monetizace (od 15. 7. 2025):** obsah musí mít „meaningful variation" a doložitelný lidský vstup (vlastní research, komentář, originální vhled). Klonování **vlastního** hlasu disclosure NEVYŽADUJE.

### Meta (Instagram / Facebook)
- Label **„AI Info" / „Made with AI"** pro realistický AI obsah (přes C2PA metadata i ruční zaškrtnutí při uploadu). Pro reels s AI avatarem **zaškrtni AI disclosure**.
- EU vynucuje povinné označení od **srpna 2026**.
- Tvrzení „downrank až −80 % dosahu" za neoznačený klamavý obsah je **(neověřeno)** — ber jako orientační riziko.

### Práva na tvář a hlas
- **HeyGen:** custom/Digital Twin avatar jen s **on-camera consent** (natočení consent statementu). Tvořit avatar **cizí** osoby bez souhlasu = porušení podmínek a zrušení účtu.
- **Stock avatary:** jen licence na použití, avatar nevlastníš.
- **Voice cloning:** klonovat smíš **jen vlastní hlas** nebo s prokazatelným povolením.
- Uživatel si ponechává vlastnictví custom avatara, ale musí mít práva k podobě a respektovat removal requesty.

---

## 8) Pokročilé: automatizace přes API (dávková výroba)

Pro škálovanou výrobu lze celý řetězec orchestrovat v **n8n** (self-hosted ~4–7 USD/měs VPS, neomezené executions) s avatarovou variantou v pipeline.

### Avatar pipeline přes API
```
Google Sheet (témata, status "Pending")
  → LLM (skript + výslovnostní poznámky)
  → ElevenLabs API (voiceover, vlastní klon)        ~0,30 USD/1000 znaků
  → HeyGen API (avatar klipy intro/outro)           ~4 USD/min (1080p), 5 USD/min (4K)
  → render/sestavení (JSON2Video / FFmpeg) + b-roll
  → titulky (Submagic / Whisper)
  → distribuce (Blotato / Upload-Post → YT/IG/TikTok)
```

### Klíčová API a náklady
- **ElevenLabs API** — nativní n8n node; ~0,30 USD/1000 znaků (~1 min narace ≈ 1000 kreditů).
- **HeyGen API** — avatar generování ~4 USD/min (1080p), 5 USD/min (4K). **Hlavní skrytý náklad** — drž avatar klipy krátké (kotva).
- **Render:** JSON2Video 49 USD/200 min Full HD (TTS v ceně) nebo FFmpeg zdarma.
- **Avatarová varianta** (GPT-4o-mini + HeyGen + FFmpeg) uváděna ~0,03 USD/reel **(neověřeno, odhad z blogu)**.

### Rizika a limity
- **YouTube Data API kvóta:** 10 000 jednotek/den, `videos.insert` = 1600 → jen **~6 uploadů/den/projekt**. Navýšení přes Google Cloud trvá 1–4 týdny — vyřeš předem.
- **„Inauthentic content" politika:** čistě syntetická dávková výroba bez lidského vstupu se demonetizuje. Drž **meaningful variation** + originální research + vlastní editorský vstup.
- **Hotové n8n templates** (kostra k úpravě, ne od nuly): #3442 (full auto + multi-platform), #12392 (skript + ElevenLabs + Pixabay + Shotstack), #5674 (Perplexity research). Vše na `n8n.io/workflows/`.

> **Doporučený postup automatizace:** začni s `n8n` templatem #3442, nahraď stock-avatar uzel za **HeyGen API** s vlastním Digital Twinem, ElevenLabs na hlas, distribuci přes **Blotato/Upload-Post** (1 uzel = 9 platforem). Rozpočet provozu ~35–70 USD/měs + HeyGen kredity navrch.

---

## Rychlý checklist k spuštění
- [ ] Rozhodnuto: vlastní tvář vs. fiktivní persona (doporučeno vlastní)
- [ ] ElevenLabs Creator — naklonovaný český hlas + **výslovnostní slovník** (jména staveb)
- [ ] HeyGen Digital Twin + **on-camera consent** + 2–3 looks
- [ ] Skript se strukturou **avatar-kotva + b-roll** (avatar ~1,5–3 min z 10)
- [ ] Stejný klonovaný hlas pro avatar i voiceover
- [ ] Burned-in CZ titulky (Submagic, ne CapCut)
- [ ] Export 16:9 (YouTube) + 9:16 (Reels/Shorts)
- [ ] YouTube: zaškrtnuto „altered/synthetic content"; Meta: „AI Info"
- [ ] 30s test výslovnosti jmen před každým videem
- [ ] Rozpočet: ~50–90 USD/měs (min. start pod ~25 USD)
