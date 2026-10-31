# Harmonika — trenažér chromatické harmoniky

Webová appka podle iPadové aplikace *Chromatic Harmonica PRO* — stejné rozložení obrazovek a stejné
funkce, kód je napsaný od nuly. Jméno a ikona jsou vlastní (**Chromatic Harp Trainer**), protože ty
původní patří autorovi originálu. Ovládání je anglicky jako v originálu.

Nejlíp se ovládá na iPadu na šířku. V Safari jde přes **Sdílet → Přidat na plochu** přidat na plochu:
pak se otevírá přes celou obrazovku a po prvním načtení funguje i offline.

## Co umí

- **Mřížka harmoniky** — řádky Slide / Blow / čísla dírek / Draw / Slide, svislé čáry mezi oktávami.
  Základní tón je oranžově, ostatní tóny stupnice modře, zbytek šedě. Ťuknutím na dírku zazní tón.
- **Holes** 10 / 12 / 14 / 16 (G3–Db6, C4–D7, G3–D7, C3–D7). Na nejvyšší dírce dává tah se šoupátkem
  D, jako u skutečných 12–16dírkových chromatik.
- **Harmonica** — ladění nástroje v libovolné tónině (C, G, Bb …), přepočítá celou mřížku.
- **Scale | Arpeggios** — 41 stupnic (durové módy, mollové, jazzové módy melodické molly, pentatoniky
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
falešný mikrofon a test ověří i ladičku.

## Nasazení na Vercel

Nasazuje se jen na výslovný pokyn (viz `CLAUDE.md` v kořeni repa). Postup:

1. Vercel → **Add New → Project** → repozitář `webovky`.
2. **Root Directory = `harmonika`**, framework Next.js.
3. Deploy. Žádné proměnné prostředí nejsou potřeba.

Mikrofon (ladička) funguje jen přes HTTPS, což Vercel splňuje.
