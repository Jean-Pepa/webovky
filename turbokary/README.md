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
4. Hráč 1 (👑) vybere trať, nebo jako poslední možnost **🏆 Pohár** (všechny 4 tratě za sebou,
   body za umístění). Případně změní počet kol a soupeřů a dá **START**.

**Tratě:** Zelená louka (pro začátek), Písečný kaňon (vracečky, dva skokánky), Ledové jezero
(silnice klouže) a **Šílená hora**: serpentiny do kopce, tunel skrz skálu, most přes vlastní trať,
velký skok z hřebene, horizonty, ze kterých se vyletí, a padající letadla. Kam letadlo dopadne,
ukáže červený kruh na silnici a varování na obrazovce. Hořící trosky pak chvíli zůstanou na trati.

**Zlaté bedny** visí ve vzduchu nad skokánky, sebrat jdou jen výskokem. Nejčastěji z nich padnou
🦅 **Křídla**: pár vteřin letíš nad tratí, jsi rychlejší a nic tě netrefí.

**Všichni jsou stejně rychlí.** Postavičky se liší jen vzhledem a boti mají stejné motokáry jako
hráči, jen někteří z nich řídí hůř (víc ubírají plyn v zatáčkách a méně driftují). Rychlejší tě
udělá jen turbo, drift, závětří, skokánky, kopec dolů a věci.

**Ovládání na telefonu** (drž ho na šířku). Nastavení (náklon nebo dotyk, citlivost, automatický
plyn, vibrace, zrcátko) je v lobby pod **⚙️ Ovládání**, jinak stačí vybrat postavičku.
- **Náklon jako volant:** natáčej telefon doleva a doprava. Funguje jen přes https, na iPhonu je
  potřeba ťuknutím povolit pohybové senzory.
- **Dotykové řízení** (záloha): táhni prstem do stran v levé polovině displeje. Plyn je automatický.
- **PLYN / BRZDA:** brzda při stání couvá. Automatický plyn jde zapnout v nastavení.
- **DRIFT:** podrž v zatáčce. Čím déle driftuješ, tím silnější turbo po puštění dostaneš
  (jiskry: bílé → žluté → tyrkysové → růžové).
- **Skokánky:** ve vzduchu zmáčkni DRIFT a uděláš trik. Po dopadu dostaneš turbo.
- **Turbo start:** dej plyn až při poslední vteřině odpočtu. Kdo drží plyn od začátku, přetočí motor.
- **Závětří:** jeď těsně za soupeřem a po chvíli dostaneš turbo.
- **VĚC:** ťuknutí použije věc ve výchozím směru, **švihnutí nahoru** ji hodí dopředu,
  **švihnutí dolů** za sebe. Věci se sbírají z barevných krystalů:
  - ⚡ **Turbo** zrychlí (trojité jde použít třikrát).
  - 🛢️ **Olej** vyleješ za sebe, nebo ho hodíš dopředu. Kdo do něj vjede, dostane smyk.
  - 🥥 **Kokos** letí rovně (nebo dozadu) a odráží se od bariér.
  - 🚀 **Raketa** se navede na soupeře před tebou, švihnutím dolů na toho za tebou.
  - 🐝 **Roj včel** letí na vedoucího závodníka.
  - 🛡️ **Štít** tě ochrání před jedním zásahem.
  - 🐏 **Beranidlo:** pár sekund jsi rychlejší a nezranitelný a koho trkneš, toho roztočíš.
  - 🦅 **Křídla** (hlavně ze zlaté bedny) — let nad tratí.
  Čím jsi dál vzadu, tím lepší věci padají.
- **Zpětné zrcátko** nahoře uprostřed obrazovky ukazuje, kdo se blíží zezadu. Každý hráč si ho
  může vypnout na telefonu pod ⚙️ Ovládání.
- Telefon vibruje při nárazu, zásahu a v cíli. Na iPhonu vibrace nejsou, Safari je nepodporuje.

**Bez telefonu:** v lobby klávesa `K` přidá hráče na klávesnici (max. dva). Ovládá se šipkami nebo
WASD, drift a trik je `mezerník` / pravý `Shift`, věc `E` / `Enter`, hod opačným směrem `Q` /
pravý `Ctrl`. V lobby `T` mění trať (poslední možnost je pohár), `↑↓` počet kol a `←→`
soupeře. `Backspace` odebere hráče na klávesnici. `Enter` přeskočí průlet kamerou a `Esc` dá pauzu (pokračovat, začít znovu, do lobby).
Pauzu může dát i hráč 1 tlačítkem ⏸ na telefonu.

## Jak to funguje

- **PC** (`kary.html`, `src/game/`) vykresluje 3D scénu (three.js), počítá fyziku, boty, věci
  a pořadí. Obrazovku rozdělí podle počtu hráčů: dva hráči vlevo a vpravo, tři a čtyři do
  čtverce 2×2 (u tří je ve volném čtverci pohled na závod, mapa a průběžné pořadí). Před startem
  proletí kamera nad tratí, při
  výsledcích krouží kolem vítěze. Hudba i zvuky se generují v prohlížeči (Web Audio) a mají
  vlastní melodie pro každou trať.
- **Telefon** (`pad.html`, `src/pad/`) posílá asi 30× za sekundu, jak je natočený a co mačkáš.
- **Spojení:** WebRTC datový kanál přes [PeerJS](https://peerjs.com). PC se na veřejném
  signalizačním serveru zaregistruje pod kódem místnosti. Telefon ho podle kódu najde a pak už data
  tečou **přímo telefon ↔ PC po Wi-Fi** se zpožděním v řádu milisekund. Internet je potřeba jen na
  navázání spojení.
- Kontrakt zpráv je v `src/shared/protocol.ts` a popis v `AGENTS.md`.
- Rekordy trati se ukládají v prohlížeči na PC (`localStorage`). Žádný server ani databáze.

## Web: volba hry

Na webu TurboKár běží i druhá hra, **Mečovačka** (šermování, mečem je telefon — zdroják v `../mecovacka/`):
`/` = volba hry (`index.html`, `src/hub/`), `/kary` = TurboKáry, `/pad` = volant v telefonu,
`/mece/` = Mečovačka, `/mece/pad` = meč v telefonu. Mečovačka je v `public/mece/` jako hotový build
(`npm run build:kary` v `mecovacka/`), Vercel ji jen přibalí.

## Vývoj

```bash
cd turbokary
npm install
npm run dev        # http://localhost:5173 (volba hry), TurboKáry na /kary.html, adresa „Network“ pro telefon
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

Hra si všechno kreslí sama (tvary, textury, emoji). 3D modely motokár a řidičů ve formátu GLB
v `public/models/` (`kart.glb`, `karts/<id>.glb`, `chars/<id>.glb`) nahradí modely z kódu.
Pravidla pro modely jsou v `AGENTS.md`, vzor vyrobí `node scripts/sample-models.mjs`. Obrázky v `public/img/` (portréty postav,
ikony věcí, logo, obloha, reklamní plachty, ikony tlačítek) je automaticky nahradí. Seznam
a rozměry jsou v `AGENTS.md`, oddíl „Zadání grafiky“. Které obrázky existují, zjistí build sám
(modul `virtual:assets` ve `vite.config.ts`).

## Nasazení na Vercel

Nasazuje se jen na výslovný pokyn (viz `CLAUDE.md` v kořeni repa). Postup:

1. Vercel → **Add New → Project** → repozitář `webovky`.
2. **Root Directory = `turbokary`**, framework Vite (nastaví se sám podle `vercel.json`).
3. Deploy. Žádné proměnné prostředí nejsou potřeba.

Https z Vercelu je potřeba pro řízení náklonem.
