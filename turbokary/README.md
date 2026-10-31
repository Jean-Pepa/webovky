# TurboKáry — závody motokár, ovladačem je telefon

Vlastní závodní hra s motokárami. **Hra běží v prohlížeči na PC** (nejlíp na velké obrazovce nebo
televizi) a **ovladače jsou telefony hráčů**. Nic se neinstaluje: PC otevře web, telefon naskenuje
QR kód a je z něj volant.

Postavy (zvířátka), trať i věci jsou vlastní, nejde o kopii žádné existující hry.

## Jak hrát

1. Na PC otevři hru (Chrome nebo Edge, ideálně přes celou obrazovku, klávesa `F`).
2. Na telefonu naskenuj QR kód z obrazovky. Případně otevři `…/pad` a zadej čtyřpísmenný kód.
3. Na telefonu si vyber postavičku a napiš jméno. Hrát můžou **až 4 hráči**, zbytek startovního pole
   doplní boti.
4. Hráč 1 (👑) nastaví počet kol a soupeřů a dá **START**.

**Ovládání na telefonu** (drž ho na šířku):
- **Náklon jako volant:** natáčej telefon doleva a doprava. Funguje jen přes https, na iPhonu je
  potřeba ťuknutím povolit pohybové senzory.
- **Dotykové řízení** (záloha): táhni prstem do stran v levé polovině displeje. Plyn je automatický.
- **PLYN / BRZDA:** brzda při stání couvá. Automatický plyn jde zapnout v nastavení.
- **DRIFT:** podrž v zatáčce. Čím déle driftuješ, tím silnější turbo po puštění dostaneš
  (jiskry: bílé → žluté → tyrkysové).
- **VĚC:** použije sebranou věc. Věci se sbírají z barevných krystalů na trati:
  - ⚡ **Turbo** zrychlí (trojité turbo jde použít třikrát).
  - 🛢️ **Olej** vyleješ za sebe, kdo do něj vjede, dostane smyk.
  - 🚀 **Raketa** letí na soupeře před tebou.
  - 🛡️ **Štít** tě ochrání před jedním zásahem.
- Telefon vibruje při nárazu, zásahu a v cíli. Na iPhonu vibrace nejsou, Safari je nepodporuje.

**Bez telefonu:** v lobby klávesa `K` přidá hráče na klávesnici (max. dva). Ovládá se šipkami nebo
WASD, drift je `mezerník` / pravý `Shift`, věc `E` / `Enter`. Klávesa `Esc` ukončí závod.

## Jak to funguje

- **PC** (`index.html`, `src/game/`) vykresluje 3D scénu (three.js), počítá fyziku, boty, věci
  a pořadí. Pro 2–4 hráče rozdělí obrazovku.
- **Telefon** (`pad.html`, `src/pad/`) posílá asi 30× za sekundu, jak je natočený a co mačkáš.
- **Spojení:** WebRTC datový kanál přes [PeerJS](https://peerjs.com). PC se na veřejném
  signalizačním serveru zaregistruje pod kódem místnosti. Telefon ho podle kódu najde a pak už data
  tečou **přímo telefon ↔ PC po Wi-Fi** se zpožděním v řádu milisekund. Internet je potřeba jen na
  navázání spojení.
- Kontrakt zpráv je v `src/shared/protocol.ts` a popis v `AGENTS.md`.
- Rekordy trati se ukládají v prohlížeči na PC (`localStorage`). Žádný server ani databáze.

## Vývoj

```bash
cd turbokary
npm install
npm run dev        # http://localhost:5173 a adresa „Network“ pro telefon
npm run build      # kontrola typů a produkční build do dist/
npm run e2e        # automatický test (sám si spustí preview a lokální signalizační server)
npm run peer       # samostatný lokální signalizační server na :9000
```

**Test s telefonem doma:** PC i telefon na stejné Wi-Fi. Na PC otevři adresu **Network** z výpisu
`npm run dev`, ne `localhost`, jinak QR kód povede na telefon samotný. Přes http funguje jen
dotykové řízení, náklon až přes https (Vercel).

Vlastní signalizační server: `?peer=host:port`, např. `http://192.168.1.10:5173/?peer=192.168.1.10:9000`
s `npm run peer`. Hra pak běží i bez internetu. Parametr se sám předá do QR kódu pro telefony.

Užitečné pro ladění: `?speed=2` zrychlí čas, `?autopilot` nechá za hráče řídit počítač,
v konzoli `__tk.state()`.

`node scripts/check-tracks.ts` zkontroluje geometrii tratí (poloměry zatáček, překryvy) a vykreslí
náhled do `e2e/out/tracks.html`.

## Grafika

Hra si všechno kreslí sama (tvary, textury, emoji). Obrázky v `public/img/` (portréty postav,
ikony věcí, logo, obloha, reklamní plachty, ikony tlačítek) je automaticky nahradí. Seznam
a rozměry jsou v `AGENTS.md`, oddíl „Zadání grafiky“. Které obrázky existují, zjistí build sám
(modul `virtual:assets` ve `vite.config.ts`).

## Nasazení na Vercel

Nasazuje se jen na výslovný pokyn (viz `CLAUDE.md` v kořeni repa). Postup:

1. Vercel → **Add New → Project** → repozitář `webovky`.
2. **Root Directory = `turbokary`**, framework Vite (nastaví se sám podle `vercel.json`).
3. Deploy. Žádné proměnné prostředí nejsou potřeba.

Https z Vercelu je potřeba pro řízení náklonem.
