# Mečovačka — šermování, mečem je telefon

Souboje s pěnovými meči na molu nad rybníkem. **Hra běží v prohlížeči na PC** (nejlíp na velké
obrazovce nebo televizi) a **mečem je telefon**: co uděláš rukou, udělá meč ve hře — natočení 1:1
z gyroskopu. Nic se neinstaluje: PC otevře web, telefon naskenuje QR kód.

Postavy (zvířátka z TurboKár), aréna i režimy jsou vlastní, nejde o kopii žádné existující hry.

## Jak hrát

1. Na PC otevři hru (Chrome nebo Edge, klávesa `F` = celá obrazovka).
2. Na telefonu naskenuj QR kód (nebo otevři `…/pad` a zadej čtyřpísmenný kód). Vyber si šermíře.
   Druhý hráč se připojí stejně — jinak bojuješ s počítačem.
3. Hráč 1 (👑) zvolí hru a dá **START**.
4. **Drž telefon jako rukojeť meče:** na výšku, horní hrana míří jako čepel, palec na displeji.
5. Na začátku každého kola **namiř telefon na obrazovku a podrž KRYT** — tím se meč vyrovná.

**Souboj:** švihem zasáhneš soupeře a odhodíš ho dozadu. Kdo přepadne přes konec mola, žbluňkne do vody
a kolo je pryč. **KRYT** (podrž palcem) + meč do cesty soupeřově ráně = vykrytí: soupeř se odrazí
a chvíli se nemůže bránit — hned udeř, je to **PROTIÚTOK** a odhodí nejvíc. Proti ráně z boku drž meč
svisle, proti ráně shora vodorovně. Rychlá rána (přes ~38 km/h) je **silná** a odhodí dál. Počítač
mrkne špičkou meče, než udeří. Hraje se na 1, 2 nebo 3 vítězná kola, kolo trvá minutu (pak vyhraje
ten, kdo má víc místa za zády).

**Krájení:** z rybníka vyskakují věci se šipkou — rozsekni je švihem ve směru šipky. Kombo zvyšuje body,
zlaté jablko jde seknout jakkoli, **ježka nech být**. Sám hraješ na rekord, ve dvou stojíte zády k sobě.

**Trénink:** slaměný panák, který tě provede vším: švih, zásah, silná rána, kryt, protiútok.

**Postavy** se liší silou rány, váhou (těžkého jen tak neodhodíš) a délkou meče.

Telefon vibruje při zásahu a krytu (na iPhonu vibrace nejsou). Tlačítko **⟲ Vyrovnat** kdykoli srovná
meč (telefon přitom miř na obrazovku). Hráč 1 má na telefonu ⏸ pauzu.

**Bez telefonu:** v lobby klávesa `M` přidá hráče s myší (pohyb myši = kam míří meč, levé tlačítko
nebo `mezerník` = KRYT). `1`/`2`/`3` hra, `Enter` start, `Esc` pauza.

## Jak to funguje

- **PC** (`index.html`, `src/game/`) vykresluje 3D scénu (three.js) a počítá souboj: čepel je úsečka
  podle natočení telefonu, ruka se k meči dopočítá (inverzní kinematika), srážky meč × meč (kryt, střet)
  a meč × tělo (zásah) se kontrolují v několika krocích mezi snímky, síla rány = rychlost místa na čepeli.
- **Telefon** (`pad.html`, `src/pad/`) posílá ~60× za sekundu natočení (kvaternion z gyroskopu)
  a jestli držíš KRYT. Na PC se mezi vzorky natočení dopočítá podle úhlové rychlosti, ať meč neškube.
- **Spojení:** WebRTC přes [PeerJS](https://peerjs.com). Signalizační server je potřeba jen na navázání,
  data tečou přímo telefon ↔ PC po Wi-Fi. Pohyb jde neseřazeným kanálem (ztracený paket nezdrží další).
- Zvuky a hudba se generují v prohlížeči (Web Audio): svist meče sedí na rychlost švihu.
- Kontrakt zpráv je v `src/shared/protocol.ts` a popis v `AGENTS.md`.

## Vývoj

```bash
cd mecovacka
npm install
npm run dev:https  # https://<IP-PC>:5173 — telefon přijme varování o certifikátu, pak senzory fungují
npm run dev        # http — telefon jen míří prstem (senzory chtějí https)
npm run build      # kontrola typů a produkční build do dist/
npm run e2e        # automatický test: PC + simulovaný telefon (sám si spustí preview a signalizaci)
npm run peer       # samostatný lokální signalizační server na :9000
```

**Test s telefonem doma:** PC i telefon na stejné Wi-Fi. Na PC otevři adresu **Network** z výpisu
`npm run dev:https` (ne `localhost`, jinak QR kód povede na telefon samotný).

Ladění: `?mouse` rovnou přidá hráče s myší, v konzoli `__mc.state()`.

## Grafika

Veškerý design dělá Codex (modely, obrázky, logo, ikony) — zadání, názvy souborů a pravidla modelů jsou
v `AGENTS.md`. Hra zatím kreslí náhrady z tvarů a soubory od Codexu (`public/models/`, `public/img/`)
použije sama, jakmile existují.

## Nasazení

Mečovačka běží na **stejném webu jako TurboKáry** (Vercel projekt s Root Directory `turbokary`):
na `/` je volba hry, Mečovačka na `/mece/`, meč v telefonu na `/mece/pad`.

Nasazuje se jen na výslovný pokyn (viz `CLAUDE.md` v kořeni repa). Před nasazením:

```bash
cd mecovacka
npm run build:kary   # build s adresou /mece/ do ../turbokary/public/mece/
```

a výsledek v `turbokary/public/mece/` commitnout — Vercel při buildu TurboKár nevidí soubory mimo
složku `turbokary`, takže si Mečovačku sám nesestaví. Https z Vercelu je potřeba pro pohybové senzory.
