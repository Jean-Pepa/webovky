# TurboKáry — společné zadání (Claude i Codex)

## Co stavíme
Vlastní závody motokár. Hra běží v prohlížeči na PC (velká obrazovka), ovladače jsou telefony
hráčů. 1–4 hráči + boti, při více hráčích rozdělená obrazovka. Nic se neinstaluje: PC otevře web,
telefon naskenuje QR kód.

Je to **originální hra**, ne kopie Mario Kart: vlastní postavy (zvířátka), vlastní trať, vlastní
věci. Žádné postavy, názvy, grafika, hudba ani zvuky od Nintenda.

## Jak to funguje
- **PC** (`kary.html`, `src/game/`): 3D hra (three.js), lobby s QR kódem, závod, výsledky.
- **Volba hry** (`index.html`, `src/hub/`): rozcestník na `/` — TurboKáry (`/kary`), nebo Mečovačka
  (`/mece/`, hotový build v `public/mece/` z `../mecovacka`, viz `mecovacka/AGENTS.md`).
- **Telefon** (`pad.html`, `src/pad/`): ovladač. Náklon = volant (gyroskop), tlačítka
  plyn / brzda / drift / věc, záložní dotykové řízení.
- **Spojení**: WebRTC datový kanál přes PeerJS. Signalizace přes veřejný server 0.peerjs.com,
  samotná data jdou přímo telefon ↔ PC po Wi-Fi. Kontrakt zpráv: `src/shared/protocol.ts`.

## Rozsah
- 4 tratě (`src/game/tracks.ts`): Zelená louka, Písečný kaňon, Ledové jezero (klouže) a Šílená
  hora (výškové rozdíly, serpentiny, tunel skrz skálu, most přes trať, velký skok, padající
  letadla s hořícími troskami). Jeden závod nebo pohár ze všech tratí s body. 3 rychlosti,
  1–5 kol, 0–7 botů.
- Zlaté bedny (visí nad skokánky, sebrat jdou jen výskokem): nejčastěji **křídla** — pár vteřin
  let nad tratí (rychlejší, nic tě netrefí).
- 8 postav s vlastnostmi (lehké / střední / těžké — `src/shared/characters.ts`).
- Věci (`src/shared/items.ts`): turbo, trojité turbo, olej (vylít za sebe / hodit dopředu),
  kokos (letí rovně a odráží se), raketa (navádí se dopředu i dozadu), roj včel (letí na
  vedoucího), štít, beranidlo (krátká nezranitelnost a trkání), křídla (let).
- Jízda: drift se 3 stupni turba, turbo start, závětří, skokánky s triky (turbo po dopadu),
  turbo pásy, bariéry, srážky podle váhy.

## Kdo co dělá
| Část | Kdo | Soubory |
|---|---|---|
| Veškerý kód: hra na PC, ovladač v telefonu, spojení, zvuk, volba hry | Claude | `src/`, `index.html`, `kary.html`, `pad.html`, `e2e/`, `scripts/`, `public/mece/` (build Mečovačky) |
| Grafika a design: 3D modely postav a motokár, portréty, ikony, logo, obloha, plachty, ikony aplikace | Codex | `public/models/`, `public/img/`, `public/icon-*.png`, `public/og.png` |
| Test na skutečném PC a telefonu, hlášení chyb | Codex (s uživatelem) | — |

Do cizích souborů nesahej. Codex nemění kód, Claude nemění obrázky ani modely. Kód je jen načítá
podle názvů níže. Když obrázek nebo model chybí, hra použije náhradu (emoji / kreslení v kódu), takže
grafiku jde dodávat postupně.

## Pravidla pro Git
- Claude pracuje na větvi `claude/sharp-allen-iz8adn`, Codex na `codex/grafika`
  (založené z větve Clauda). Každý ve vlastní pracovní kopii.
- Malé commity, často push (po každé hotové skupině obrázků). Spojení dělá Claude
  (`git fetch` + `git merge origin/codex/grafika`).
- **Nikdy push do `main` a nikdy nasazení na Vercel bez výslovného pokynu uživatele**
  (viz `CLAUDE.md` v kořeni repa).
- Nové npm závislosti jen když je to nutné; do commitu napiš proč.
- Zprávy commitů bez názvu nebo identifikátoru AI modelu.

## Zadání grafiky (Codex)

### Společný styl
- Veselý kreslený styl, tlustá tmavá obrysová linka (`#1b1430`), měkké stínování, jednoduché
  tvary. Ve 3D jsou postavy jednoduchá „low-poly“ zvířátka, obrázky k nim mají sedět.
- Paleta UI: tmavě fialová `#160f33` (pozadí), žlutá `#ffd21f`, oranžová `#ff7a1a`,
  červená `#ff4d6d`, tyrkysová `#7cf3ff`, bílá. Fonty v UI: Lilita One (nadpisy), Baloo 2 (text).
- Nic, co připomíná Nintendo / Mario Kart (postavy, houby, krunýře, otazníkové kostky), žádné
  skutečné značky ani loga.
- PNG s průhledným pozadím (kromě oblohy), sRGB, rozumná velikost souboru (portrét do ~300 kB).
  Když generovat obrázky neumíš, nakresli je jako SVG se stejným názvem (přípona `.svg`).
- Ke každému obrázku zapiš do `public/img/CREDITS.md`, čím a jak vznikl.

### Seznam (v pořadí důležitosti)
1. **Portréty postav** — `public/img/chars/0.png` … `7.png` (číslo = `id` v
   `src/shared/characters.ts`), 512×512. Hlava a ramena zepředu (lehce z boku), veselý výraz,
   stejný styl a velikost hlavy u všech. Tričko v barvě „tričko“, na krku šátek nebo na čele
   závodní brýle v barvě motokáry. Bez textu.

   | id | postava | srst / hlava | druhá barva | motokára | tričko |
   |---|---|---|---|---|---|
   | 0 | Liška Zrzka (liška) | `#f27a24` | `#fff6ea` | `#ff7a1a` | `#2b2d42` |
   | 1 | Žabák Kvak (žába) | `#63d34c` | `#daf7a6` | `#3ccf4e` | `#ff6b6b` |
   | 2 | Tučňák Frak (tučňák) | `#23272e` | `#ffffff` | `#22b8f0` | `#ffb703` |
   | 3 | Králík Hop (králík) | `#f4f4f4` | `#ffb3c9` | `#ff5fa8` | `#7b61ff` |
   | 4 | Kocour Mour (kocour) | `#8d8d9b` | `#f0f0f0` | `#9b4dff` | `#06d6a0` |
   | 5 | Medvěd Huňáč (medvěd) | `#8a5a2b` | `#d9a46c` | `#2f6bff` | `#ef476f` |
   | 6 | Robot Šroubek (robot) | `#c3ccd3` | oči `#4fe3ff` | `#e53935` | `#37474f` |
   | 7 | Prasátko Kvík (prasátko) | `#ffa7bb` | `#ff7f9e` | `#ffd21f` | `#118ab2` |

2. **Ikony věcí** — `public/img/items/turbo.png`, `turbo3.png`, `oil.png`, `coconut.png`,
   `rocket.png`, `bees.png`, `shield.png`, `ram.png`, `wings.png`, 256×256, čitelné i ve 48 px.
   Turbo = žlutooranžový blesk nebo láhev nitra, trojité turbo = tři blesky, olej = černý
   kanystr se žlutým pruhem a kapkou, kokos = hnědý kokos s „očičkama“, raketa = červenobílá
   raketa s plamenem, roj včel = tři veselé včelky, štít = modrá průhledná bublina,
   beranidlo = zlaté zatočené beraní rohy se září, křídla = dvě bílá křídla s barevnými konci.
3. **Logo** — `public/img/logo.png`, asi 1600×560. Nápis „TurboKáry“ (s Á), tlustá kreslená
   písmena, přechod žlutá → oranžová → červená, tmavý obrys, malá šachovnicová vlajka nebo
   motokára. Musí být čitelné na `#160f33` i přes 3D scénu.
4. **Obloha pro každou trať** — 4096×1024, panorama kolem dokola (levý a pravý okraj musí
   navazovat bez švu), bez slunce, JPG kvalita ~85, do 1,5 MB. Spodní okraj přechází do barvy
   mlhy dané trati:
   - `public/img/sky-meadow.jpg` — modrá obloha (`#3a8dff`), kupovité mraky, modrošedé hory se
     sněhem a zelené kopce, spodek `#d6eeff`.
   - `public/img/sky-desert.jpg` — sytě modrá až broskvová obloha, stolové hory z červenohnědého
     pískovce, spodek `#ffe3b8`.
   - `public/img/sky-ice.jpg` — chladná modrofialová obloha, zasněžené štíty, spodek `#e3ecff`.
   - `public/img/sky-crazy.jpg` — dramatický západ slunce (nahoře fialová `#4b3ab8`, dole
     broskvová), skalnaté štíty, spodek `#ffb68a`.
5. **Reklamní plachty kolem trati** — `public/img/banners/1.png` … `4.png`, 1024×256,
   vymyšlení sponzoři s vtipnými českými názvy (např. „Turbo Knedlík“, „Pneu Hop“,
   „Benzínka U Žabáka“, „Koblihy Zrzka“). Výrazné barvy, velké čitelné písmo.
6. **Brána start/cíl** — `public/img/start-banner.png`, 2048×256, nápis „START · CÍL“
   a šachovnice.
7. **Ikony tlačítek ovladače** — `public/img/pad/gas.png`, `brake.png`, `drift.png`,
   `item.png`, 256×256, světlé piktogramy (pedál plynu, pedál brzdy, smyk se šipkou,
   krystal). Pozadí tlačítek kreslí kód.
8. **Ikony aplikace** — `public/icon-192.png`, `public/icon-512.png` (motokára nebo „TK“
   na `#160f33`) a `public/og.png` 1200×630 (náhled odkazu: logo a motokáry).
9. **Náhledy tratí do lobby** — `public/img/tracks/louka.png`, `kanon.png`, `jezero.png`, `hora.png`,
   640×360, ilustrace trati (pohled shora nebo ze startu), bez textu.

### 3D modely postav a motokár (GLB)
Hra má zatím vlastní jednoduché modely poskládané v kódu. Když do `public/models/` přidáš
soubory **GLB** (glTF 2.0 binary), hra je sama použije místo nich. V kódu se nic nemění.

Soubory:
- `public/models/kart.glb` — jedna motokára pro všechny postavy (hra ji přebarví podle postavy).
- `public/models/karts/<id>.glb` — volitelně vlastní motokára jen pro postavu `<id>` (má přednost).
- `public/models/chars/<id>.glb` — řidič (postavička) `<id>` = 0–7 podle tabulky výše, bez motokáry.

Pravidla (musí sedět, jinak se model zobrazí špatně):
- Jednotky metry, osa **Y nahoru**, předek motokáry i řidiče míří do **+Z** (standard glTF).
- **Motokára:** počátek na zemi pod středem motokáry. Délka 2,4–2,8 m, šířka i s koly do 2 m,
  výška do 1,2 m (bez řidiče).
- 4 kola jako samostatné uzly `wheel_fl`, `wheel_fr`, `wheel_rl`, `wheel_rr` (f = přední,
  r = zadní; l = levé = +X, r = pravé = −X). Počátek uzlu ve středu kola, osa kola podél X, uzel
  bez vlastního natočení. Hra kola točí kolem X a přední natáčí kolem Y.
- Prázdné uzly (empty): `seat` = kam si sedne řidič (spodek pánve na sedačce, cca 0,5–0,6 m
  nad zemí), `exhaust_l` a `exhaust_r` = konce výfuků (odtud šlehají plameny turba).
- Materiály pojmenuj `paint` (hlavní barva, hra ji obarví barvou motokáry z tabulky) a `accent`
  (doplňková barva). Ostatní materiály si nech v barvách, jak je navrhneš.
- **Řidič:** počátek = místo sezení (spodek pánve), dívá se do +Z. Od sedačky po vršek hlavy
  (i s ušima) asi 1,0–1,3 m. Ruce natažené dopředu k volantu (asi 0,6 m před a 0,3 m nad
  počátkem). Hlava je samostatný uzel `head` (počátek u krku), aby ji hra mohla naklánět.
  Barvy podle tabulky postav (srst, druhá barva, tričko, šátek v barvě motokáry).
- Styl low-poly, ploché stínování, veselé tvary, stejně jako obrázky. Bez textur, jen barvy
  materiálů. PBR materiál: roughness 0,6–0,9, metalness nejvýš 0,2.
- Do ~4000 trojúhelníků na motokáru a ~3000 na řidiče, soubor do ~600 kB.
- Vzorové soubory podle těchto pravidel vyrobí `node scripts/sample-models.mjs`
  (krabicová motokára a řidič do `e2e/out/sample-models/`). Můžeš z nich vyjít nebo si je
  otevřít v Blenderu.
- Zkouška ve hře: zkopíruj modely do `public/models/`, pak `npm run build && npm run preview`.

Když 3D modely dělat neumíš: nakresli návrhy jako obrázky `public/img/design/kart.png`
a `public/img/design/char-<id>.png` (pohled zepředu, z boku a zezadu, barvy podle tabulky).
Claude podle nich upraví modely v kódu.

### Test na skutečném zařízení
Až bude hra hratelná (Claude dá vědět přes uživatele), spusť ji na PC (`npm run dev`)
a s uživatelem ji vyzkoušejte s telefonem. Chyby sepiš (co se dělo, na jakém telefonu)
a předej uživateli nebo založ GitHub issue v repu `Jean-Pepa/webovky`.

## Kontrakt spojení (ovladač ↔ PC)
1. Adresa ovladače: `/pad?r=KÓD` (ve vývoji `/pad.html?r=KÓD`), volitelně `&peer=host:port`
   (vlastní signalizační server) — tento parametr předávej beze změny.
2. Bez `r` ukaž pole na 4písmenný kód (`normalizeCode` z `protocol.ts`).
3. `new Peer(peerOptions())`, pak `peer.connect(hostPeerId(kód), CONNECT_OPTIONS)` (`src/shared/net.ts`).
4. Po `open` pošli `hello`. `cid` = náhodné ID uložené v `localStorage` pod `tk_cid`, aby se hráč
   po výpadku nebo obnovení stránky vrátil do stejného slotu.
5. PC odpoví `welcome` + `lobby`. Když je plno (4 hráči), přijde `full`.
6. Během odpočtu a závodu posílej `in` 30× za sekundu a vždy při změně. Jinak posílej každou
   1 s `ping` (PC vrací `pong`, z rozdílu je latence).
7. Při ztrátě spojení zkoušej znovu každé 2 s se stejným `cid`.
8. `hud` chodí asi 6× za sekundu a při změně, `buzz` = vibrace (`navigator.vibrate`),
   `results` po závodě.
9. Jen hostitel lobby (`lobby.host === true`) posílá `cmd`: `start`, `track` (v = index),
   `laps` (v = 1–5), `bots` (v = 0…maxBots), `lobby` (z výsledků zpět do lobby).

## Ovladač: požadavky
- Na šířku. Na výšku ukaž výzvu „Otoč telefon“.
- Náklon jako volant: úhel natočení z `deviceorientation` (beta/gamma) přepočtený podle
  `screen.orientation.angle`. ±30° = plný rejd, mrtvá zóna 3°. Na iOS
  `DeviceOrientationEvent.requestPermission()` po ťuknutí. Náklon funguje jen přes HTTPS.
- Dotykové řízení jako záloha: levá polovina displeje, táhnutí do stran.
- Tlačítka: PLYN (držet), BRZDA/COUVAT (držet), DRIFT (držet, ve vzduchu = trik),
  VĚC (ťuknout = výchozí směr, švihnout nahoru = dopředu, dolů = za sebe).
  Volba „automatický plyn“.
- Multi-touch přes pointer events, `touch-action: none`, žádný zoom ani označování textu.
- Wake Lock (displej nezhasne), na Androidu celá obrazovka.
- Lobby: jméno, výběr postavy (obsazené zašedlé). Hostitel navíc trať, kola, boti a START.
- Výsledky: tvoje místo a tabulka. Hostitel má tlačítko „Další závod“.

## Vývoj
```bash
npm install
npm run dev        # vite --host, vypíše i adresu „Network“ pro telefon
npm run build      # kontrola typů a produkční build
npm run peer       # lokální signalizační server na :9000 (pak ?peer=localhost:9000)
npm run e2e        # automatický test
```
Test s telefonem doma: PC i telefon na stejné Wi-Fi, na PC otevři adresu „Network“ z výpisu Vite
(ne `localhost`, jinak QR kód povede na telefon samotný). Přes http funguje jen dotykové řízení,
náklon až přes HTTPS (Vercel).

## Změny protokolu
- v2: `item` má volitelné `dir` (1 = dopředu, -1 = za sebe, 0 = výchozí směr věci).
- v2: `cmd` navíc `next` (další závod poháru / zpět do lobby), `mode` (v = 0 jeden závod,
  1 pohár), `speed` (v = index rychlosti).
- v2: `lobby` navíc `mode`, `speed`, `speeds`, `cupRound`; `results` navíc `cup` (tabulka poháru).
- v2: `hud.drift` je -1 (nedriftuje) až 3 (třetí stupeň); `hud` navíc `pause` a `host`;
  `cmd` navíc `pause`, `restart`, `quit` (pauza z telefonu hostitele).
- v2: `me` má volitelné `mirror` (zapnutí/vypnutí zpětného zrcátka hráče).
