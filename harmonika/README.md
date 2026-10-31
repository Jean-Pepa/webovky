# Harmonika — trenažér chromatické harmoniky

Webová appka podle iPadové aplikace *Chromatic Harmonica PRO* — stejné rozložení obrazovek a stejné
funkce, kód je napsaný od nuly. Jméno a ikona jsou vlastní (**Chromatic Harp Trainer**), protože ty
původní patří autorovi originálu. Ovládání je anglicky jako v originálu.

Nejlíp se ovládá na iPadu na šířku. V Safari jde přes **Sdílet → Přidat na plochu** přidat na plochu:
pak se otevírá přes celou obrazovku a po prvním načtení funguje i offline.

## Co umí

- **Jen 12dírková chromatika** (v C rozsah C4–D7). Čip „Holes 12“ zůstává jako v originálu, jen bez výběru.
  Na nejvyšší dírce dává tah se šoupátkem D, jako u skutečných nástrojů.
- **Mřížka harmoniky** — řádky Slide / Blow / čísla dírek / Draw / Slide, svislé čáry mezi oktávami.
  Základní tón je oranžově, ostatní tóny stupnice modře, zbytek šedě. Ťuknutím na dírku zazní tón.
- **Harmonica** — ladění nástroje v libovolné tónině (C, G, Bb …), přepočítá celou mřížku.
- **Scale | Arpeggios | Songs** — 41 stupnic (durové módy, mollové, jazzové módy melodické molly, pentatoniky
  a blues, bebop, symetrické, exotické) a 27 arpeggií (kvintakordy, septakordy, nóny, undecimy, tercdecimy).
- **Key** — všech 17 názvů tónin. Pravopis je vždy správně (F dur = Bb, ne A#).
- Lišta **Note** (tóny stupnice) a **Degrees** (intervaly P1 M2 M3 …). Při přehrávání se hraný tón zvýrazní.
- **▶ Play** — přehraje stupnici či arpeggio po mřížce (zvýrazňuje hranou dírku, volí polohu bez
  šoupátka a co nejblíž předchozí dírce).
- **Metronom** — samostatný klik i klik během přehrávání.
- **Ladička** (ladička na horní liště) — mikrofon, algoritmus YIN: Confidence, Note, Hz, Cents a Zone
  (Perfect ±5, Good ±15, Fair ±25, Poor). Pravítko −50…+50 centů a čárka přímo v dírce, kterou hraješ
  (nahoře = vysoko, dole = nízko).
- **Menu**
  - *Playback Options* — Direction (Forward / Reverse / Both), Time (kolečko BPM), Metronome,
    Range & Repetitions (Start hole, End hole, Repetitions, Apply).
  - *My Routines* — uložení cvičení a jeho spuštění jedním ťuknutím.
  - *Harmonica & Sound* — ladění Solo / Diminished, popisky Notes / Degrees, ladění A4, hlasitost,
    reset postupu.
- **Songs** — 15 písniček na trénink (jen melodie volné k užití: lidové, klasika, vlastní cvičení):
  Twinkle Twinkle, When the Saints, Jingle Bells, Óda na radost, Bratře Kubo, Happy Birthday, Largo
  (Dvořák), Amazing Grace, Tichá noc, Menuet G dur, Vltava (Smetana), Greensleeves, Pro Elišku,
  Blues for Harp a ii–V–I etuda. Rozdělené na Easy / Melodies / Slide practice / Jazz & Blues.
  - Lišta s tabulaturou nad mřížkou: `4` = foukni do 4. dírky, `-4` = táhni, `<` = se šoupátkem.
  - **▶** zahraje písničku v rytmu (s metronomem napřed jeden takt předtaktí), zvýrazňuje dírku i notu.
    Přepínač **Melody / Play-along** — bez melodie hraješ sám podle zvýraznění.
  - **🎤 Practice** — appka poslouchá mikrofonem a na každý tón počká, dokud ho nezahraješ správně
    (±40 centů). Opakovaný stejný tón se uzná až po novém nasazení. Na konci ukáže, kolik procent
    jsi trefil napoprvé, a nejlepší výsledek si zapamatuje.
  - **Key** písničku převede do jiné tóniny (se správným pravopisem a do rozsahu harmoniky).
  - Ťuknutím na notu v liště se začne hrát / procvičovat od ní.
- **Learning** — „All Lessons | 0 of 8 completed“, lekce 1–3 odemčené, další se odemykají po dokončení
  předchozích. U lekcí se počítá čas a interakce. Každá lekce má interaktivní ukázky (klávesnice,
  mřížka, kvintový kruh, přehrávače intervalů, akordů a ii–V–I) a kvíz na konci.

Nastavení, rutiny a postup v lekcích jsou jen v prohlížeči (`localStorage`), žádný server ani databáze.
Zvuk je syntetizovaný (Web Audio), takže appka nepotřebuje žádné zvukové soubory.

## Vývoj

```bash
cd harmonika
npm install
npm run dev        # http://localhost:3000
npm run build      # kontrola produkčního buildu
npm run lint
```

### E2E test (proklikání všech funkcí)

```bash
npm run build && npm run start      # v jednom terminálu
npm run e2e                         # v druhém
```

Viewport jde změnit přes `E2E_W` / `E2E_H`. S `E2E_TONE=/cesta/k/tonu.wav` dostane prohlížeč WAV jako
falešný mikrofon a test ověří i ladičku a procvičování písničky (stačí tón C4, první nota „Twinkle“).

## Nasazení na Vercel

Nasazuje se jen na výslovný pokyn (viz `CLAUDE.md` v kořeni repa). Postup:

1. Vercel → **Add New → Project** → repozitář `webovky`.
2. **Root Directory = `harmonika`**, framework Next.js.
3. Deploy. Žádné proměnné prostředí nejsou potřeba.

Mikrofon (ladička) funguje jen přes HTTPS, což Vercel splňuje.
