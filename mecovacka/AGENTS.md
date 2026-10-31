# Mečovačka — společné zadání (Claude i Codex)

## Co stavíme
Šermování s pěnovými meči. Hra běží v prohlížeči na PC (velká obrazovka), **mečem je telefon**:
co hráč udělá rukou, udělá meč ve hře (natočení 1:1 z gyroskopu). Souboj na úzkém molu nad
rybníkem — zásahy tlačí soupeře k okraji, až žbluňkne do vody. 1–2 hráči (druhý hráč nebo počítač),
při dvou hráčích rozdělená obrazovka. Nic se neinstaluje: PC otevře web, telefon naskenuje QR kód.

Je to **originální hra**, ne kopie Wii Sports Resort: vlastní postavy (zvířátka z TurboKár), vlastní
aréna, vlastní režimy. Žádné postavy, názvy, grafika, hudba ani zvuky od Nintenda (žádné Mii,
žádný ostrov Wuhu, žádné jejich meče ani nápisy).

## Kde běží
Na stejném webu jako TurboKáry (Vercel projekt s Root Directory `turbokary`):
- `/` — **volba hry** (rozcestník: TurboKáry, nebo Mečovačka),
- `/kary` — TurboKáry, `/pad` — volant v telefonu,
- `/mece/` — Mečovačka na PC, `/mece/pad` — meč v telefonu.

Zdroják Mečovačky je v `mecovacka/`. Do webu TurboKár se dostane hotový build: `npm run build:kary`
(v `mecovacka/`) ho sestaví s adresou `/mece/` do `turbokary/public/mece/` a ten se commitne — Vercel
při buildu TurboKár nevidí soubory mimo svou složku. Build dělá Claude před každým nasazením.

## Jak to funguje
- **PC** (`index.html`, `src/game/`): 3D hra (three.js), lobby s QR kódem, souboj, výsledky.
- **Telefon** (`pad.html`, `src/pad/`): meč. Natočení telefonu → natočení meče, palec drží **KRYT**,
  tlačítko **Vyrovnat** srovná meč na obrazovku. Bez senzorů záložní míření prstem.
- **Spojení**: WebRTC přes PeerJS (signalizace 0.peerjs.com, data přímo telefon ↔ PC po Wi-Fi).
  Každý telefon má dvě spojení: řídicí (spolehlivé) a pohybové (neseřazené, ~60 vzorků/s).
  Kontrakt zpráv: `src/shared/protocol.ts`.

## Rozsah
- **Jedna aréna, ale pořádná:** dřevěné molo na rybníce (`src/game/arena.ts`). Konce mola jsou volné
  (pád do vody), po stranách zábradlí. Na loďkách a na břehu fandí zvířátka, která zrovna nehrají.
- **Režimy** (`MODES` v `src/shared/protocol.ts`):
  - **Souboj** — 1 hráč proti počítači (3 obtížnosti) nebo 2 hráči. Kola na 1/2/3 vítězná, 60 s na kolo.
    Zásah (švih do těla) odhodí soupeře, kryt (podržet KRYT a dát meč do cesty) odrazí útočníka,
    po vykrytí přijde **protiútok** (silnější odhoz), silná rána od ~38 km/h, střet mečů.
  - **Krájení** — z rybníka vyskakují věci se šipkou, rozsekni je švihem v tom směru (kombo, zlaté
    jablko, ježek = nesekat). 1 hráč na rekord, 2 hráči zády k sobě.
  - **Trénink** — slaměný panák, krok za krokem: švih, zásah, silná rána, kryt, protiútok.
- 8 postav (`src/shared/characters.ts`), stejná zvířátka jako v TurboKárách, vlastnosti: síla rány,
  váha (odolnost proti odhozu), délka meče.

## Kdo co dělá
| Část | Kdo | Soubory |
|---|---|---|
| Veškerý kód: hra na PC, meč v telefonu, spojení, fyzika, počítačový soupeř, zvuk, testy | Claude | `src/`, `index.html`, `pad.html`, `e2e/`, `scripts/` |
| **Veškerý design:** 3D modely šermířů, mečů, arény a věcí na krájení, portréty, logo, obloha, ikony, obrázky rozcestníku, návrhy vzhledu obrazovek | Codex | `mecovacka/public/models/`, `mecovacka/public/img/`, `mecovacka/public/icon-*.png`, `mecovacka/public/og.png`, `turbokary/public/img/hub/` |
| Test na skutečném PC a telefonech, hlášení chyb | Codex (s uživatelem) | — |

Do cizích souborů nesahej. Codex nemění kód, Claude nemění obrázky ani modely. Kód je jen načítá podle
názvů níže a **když soubor chybí, hra kreslí náhradu z tvarů** — grafiku jde dodávat postupně. Které
soubory existují, zjistí build sám (moduly `virtual:assets` a `virtual:models` ve `vite.config.ts`),
takže stačí soubor přidat a znovu sestavit.

Vzhled obrazovek (lobby na PC, telefon, HUD, rozcestník) navrhuje Codex jako obrázky v `public/img/design/`
(např. `lobby.png`, `pad-lobby.png`, `pad-game.png`, `hud.png`); Claude je přenese do CSS.

## Pravidla pro Git
- Claude pracuje na své větvi `claude/…` (teď `claude/epic-edison-d4tn7h`), Codex na `codex/mecovacka`
  (založené z `main`). Každý ve vlastní pracovní kopii.
- Malé commity, často push (po každé hotové skupině obrázků / modelů). Spojení dělá Claude
  (`git fetch` + `git merge origin/codex/mecovacka`), pak `npm run build:kary` a nasazení na pokyn uživatele.
- Rozcestník a build Mečovačky jsou ve složce `turbokary/` (`index.html`, `src/hub/`, `public/mece/`).
  **Kdo nasazuje TurboKáry, musí mít ve větvi aktuální `main`** (`git merge origin/main`), jinak squash
  nasazení vrátí rozcestník na starou verzi.
- **Nikdy push do `main` a nikdy nasazení na Vercel bez výslovného pokynu uživatele**
  (viz `CLAUDE.md` v kořeni repa).
- Nové npm závislosti jen když je to nutné; do commitu napiš proč.
- Zprávy commitů bez názvu nebo identifikátoru AI modelu.

## Zadání designu (Codex)

### Společný styl
- Veselý kreslený styl jako v TurboKárách: jednoduchá „low-poly“ zvířátka, tlustá tmavá obrysová linka
  v obrázcích (`#1b1430`), měkké stínování. Meče jsou **pěnové tréninkové** (tlusté, barevné, kulatá
  bílá špička) — nic, co vypadá jako skutečná zbraň, žádná krev.
- Paleta UI: tmavě fialová `#14123a`, žlutá `#ffd21f`, oranžová `#ff7a1a`, červená `#ff4d6d`,
  tyrkysová `#4fd1ff`, zelená `#3ccf4e`, bílá. Fonty: Lilita One (nadpisy), Baloo 2 (text).
- Nic od Nintenda ani z Wii Sports Resort (Mii, Wuhu, jejich meče, loga), žádné skutečné značky.
- PNG s průhledným pozadím (kromě oblohy), sRGB. Když generovat obrázky neumíš, nakresli SVG se stejným
  názvem (přípona `.svg`).
- Ke každému obrázku a modelu zapiš do `public/img/CREDITS.md` / `public/models/CREDITS.md`, čím a jak vznikl.

### Postavy (barvy podle `src/shared/characters.ts`)
| id | postava | srst / hlava | druhá barva | hlavní (vesta, meč) | doplňková | tričko (rukávy) |
|---|---|---|---|---|---|---|
| 0 | Liška Zrzka | `#f27a24` | `#fff6ea` | `#ff7a1a` | `#fff1d6` | `#2b2d42` |
| 1 | Žabák Kvak | `#63d34c` | `#daf7a6` | `#3ccf4e` | `#fff36b` | `#ff6b6b` |
| 2 | Tučňák Frak | `#23272e` | `#ffffff` | `#22b8f0` | `#ffffff` | `#ffb703` |
| 3 | Králík Hop | `#f4f4f4` | `#ffb3c9` | `#ff5fa8` | `#ffffff` | `#7b61ff` |
| 4 | Kocour Mour | `#8d8d9b` | `#f0f0f0` | `#9b4dff` | `#2b2b33` | `#06d6a0` |
| 5 | Medvěd Huňáč | `#8a5a2b` | `#d9a46c` | `#2f6bff` | `#ffd23f` | `#ef476f` |
| 6 | Robot Šroubek | `#c3ccd3` | oči `#4fe3ff` | `#e53935` | `#b0bec5` | `#37474f` |
| 7 | Prasátko Kvík | `#ffa7bb` | `#ff7f9e` | `#ffd21f` | `#ff6f91` | `#118ab2` |

Šermířský „úbor“: čelenka v hlavní barvě, vycpaná vesta v hlavní barvě, pásek v doplňkové barvě,
rukávy v barvě trička, tmavé kalhoty, boty v doplňkové barvě.

### Seznam (v pořadí důležitosti)
Cesty jsou vůči `mecovacka/` (kromě rozcestníku).

1. **Aréna — molo na rybníce** (`public/models/arenas/molo.glb` + `public/img/sky-molo.jpg`).
   Hlavní úkol, má být „super“: jihočeský rybník v odpoledním zlatém světle, dřevěné molo, rákos,
   lekníny, loďky s diváky, les, kostelík na kopečku, kachny. Pravidla modelu níže.
2. **3D šermíři** `public/models/fighters/0.glb` … `7.glb` (číslo = `id`) a cvičný slaměný panák
   `public/models/fighters/dummy.glb`. Pravidla níže (pojmenované klouby — hra jimi hýbe).
3. **Pěnový meč** `public/models/sword.glb` (hra ho přebarví podle postavy), volitelně vlastní meč
   postavy `public/models/swords/<id>.glb`.
4. **Logo** `public/img/logo.png`, asi 1600×560: nápis „Mečovačka“ (s Č), tlusté kreslené písmo,
   žlutá + tyrkysová, tmavý obrys, motiv pěnového meče nebo šplouchnutí. Čitelné na `#14123a` i přes 3D scénu.
5. **Portréty** `public/img/chars/0.png` … `7.png`, 512×512: hlava a ramena v šermířském úboru
   (čelenka, vesta), veselý odhodlaný výraz, stejný styl a velikost hlavy u všech, bez textu.
6. **Věci na krájení** `public/models/slice/<id>.glb` (pravidla níže).
7. **Ikony režimů** `public/img/modes/duel.png`, `slice.png`, `train.png`, 256×256 (zkřížené pěnové
   meče; rozseknutý meloun se šipkou; slaměný panák s terčem).
8. **Telefon:** `public/img/pad/shield.png` 512×512 — velký štít na tlačítko KRYT (světlý, výrazný);
   `public/img/pad/hold.png` asi 300×400 — ruka drží telefon jako rukojeť meče, z horní hrany
   vychází čepel, palec na displeji.
9. **Ikony aplikace** `public/icon-192.png`, `public/icon-512.png` (zkřížené pěnové meče na `#14123a`)
   a `public/og.png` 1200×630 (náhled odkazu: logo, molo, dva šermíři).
10. **Rozcestník (volba hry)** na webu TurboKár — obrázky do `turbokary/public/img/hub/`:
    `kary.png` a `mece.png` (karty her 960×540: motokáry v zatáčce / dva šermíři na molu, bez textu),
    `bg.jpg` (pozadí 1920×1080, klidné, tmavé k okrajům, ať jsou karty čitelné). Logo Mečovačky si
    rozcestník vezme z `mecovacka/public/img/logo.png` (po buildu `/mece/img/logo.png`), logo TurboKár
    z `turbokary/public/img/logo.png`.
11. **Návrhy obrazovek** (volitelně) `public/img/design/*.png` — viz výše.

### Obloha `public/img/sky-molo.jpg`
4096×1024, panorama dokola (levý a pravý okraj navazují bez švu), JPG ~85, do 1,5 MB. Odpolední
obloha (nahoře `#4d8fe8`, u obzoru teplá `#ffe2bd`), kupovité mraky, vzdálené zalesněné kopce
a pole. Spodní okraj přechází do barvy mlhy `#f3dcc0`. Bez slunce, textu a postav.

### Pravidla 3D modelů (GLB, glTF 2.0 binary)
Obecně: jednotky metry, osa **Y nahoru**, předek do **+Z** (standard glTF), pravá strana postavy = **−X**
(levá = +X). Low-poly, ploché stínování, barvy materiálů (PBR roughness 0,6–0,9, metalness ≤ 0,2),
bez textur nebo jen malé. Vzor si můžeš postavit z náhrady v kódu (`src/game/puppet.ts`, `sword.ts`,
`arena.ts`, `slice-mode.ts`) — rozměry tam odpovídají pravidlům.

**Šermíř** `fighters/<id>.glb` — loutka z tuhých dílů, hra natáčí klouby (paže s mečem počítá
inverzní kinematikou podle telefonu):
- Počátek na zemi mezi chodidly. Výška po temeno asi 1,75 m (uši mohou přesahovat), hlava velká
  (vejde se do koule o poloměru ~0,3 m — tak velká je zásahová koule).
- **Klidová póza:** stojí rovně, paže visí podél těla, nohy rovně.
- Klouby jako samostatné uzly (prázdné nebo s geometrií), **počátek uzlu = kloub**, uzly bez vlastního
  natočení a měřítka:

  | uzel | rodič | poloha vůči rodiči (m) | kloub |
  |---|---|---|---|
  | `hips` | kořen | (0, 0,74, 0) | pánev |
  | `torso` | hips | (0, 0,06, 0) | pas |
  | `head` | torso | (0, 0,50, 0) | krk (střed hlavy ~0,27 nad ním) |
  | `upperarm_r` | torso | (−0,29, 0,43, 0) | pravé rameno |
  | `forearm_r` | upperarm_r | (0, −0,27, 0) | loket |
  | `hand_r` | forearm_r | (0, −0,25, 0) | zápěstí |
  | `grip_r` | hand_r | (0, −0,07, 0,02) | **střed pěsti** (prázdný uzel) |
  | `upperarm_l`, `forearm_l`, `hand_l`, `grip_l` | | zrcadlově (+X) | levá ruka |
  | `thigh_r` | hips | (−0,12, −0,06, 0) | kyčel |
  | `shin_r` | thigh_r | (0, −0,36, 0) | koleno (bota je součástí holeně) |
  | `thigh_l`, `shin_l` | | zrcadlově | |

- `grip_r` / `grip_l` jsou jediné uzly **s natočením**: jejich osa **+Y míří tam, kam by z pěsti trčel
  meč** — při visící paži dopředu (+Z), tj. otočení o +90° kolem X (kvaternion x = 0,7071, w = 0,7071).
- Délky paží si hra změří z poloh uzlů (rozumné jsou 0,22–0,32 m na díl).
- Hra dělá vlastního šermíře průhledného (jen v jeho pohledu) — používej běžné materiály.
- Do ~4000 trojúhelníků, soubor do ~600 kB.
- **Panák** `fighters/dummy.glb`: slaměný pytel s hlavou a slaměnýma rukama, stejné uzly
  (v rukou drží meč), místo nohou kůl — `thigh_*` mohou být prázdné.

**Meč** `sword.glb`:
- Počátek = **střed rukojeti** (kde ho drží pěst), čepel míří do **+Y**.
- Prázdný uzel `tip` přesně na špičce (asi 1,16 m od počátku), prázdný uzel `guard` na začátku čepele
  nad záštitou (asi 0,15 m). Hlavice asi 0,13 m pod počátkem.
- Tlustá pěnová čepel (průměr 8–10 cm), kulatá bílá špička, záštita.
- Materiály `foam` (čepel — hra přebarví hlavní barvou postavy) a `accent` (záštita, hlavice — doplňková
  barva). Ostatní (rukojeť) zůstanou, jak je navrhneš. Do ~1500 trojúhelníků.

**Aréna** `arenas/molo.glb`:
- Horní plocha mola v **y = 0**, molo podél osy **Z**. Bojová plocha je **z od −3,6 do +3,6**,
  **x od −1,15 do +1,15**.
- **Konce mola (z = ±3,6) jsou volné:** žádné zábradlí, sloupy ani nic nad y = 0 v prodloužení mola
  aspoň 6 m — tam šermíři padají do vody. Po stranách zábradlí (x ≈ ±1,1, výška ~1 m), ať se nepadá do strany.
- **Hladina vody je v y = −1,5** a kreslí ji hra (vlnky, šplouchání). Vodní plochu nemodeluj, nebo ji
  pojmenuj `water` (hra ji skryje). Břeh, dno u břehu, rákos, lekníny, loďky, stromy atd. ano.
- **Diváci:** prázdné uzly `spectator_1` … `spectator_8` = kde stojí zvířátko (na loďce, na lávce,
  na břehu blízko mola); osa +Z uzlu = kam se dívá (k molu). Hra tam rozestaví 6 postav, které nehrají.
- Kamery: za zády šermířů podél mola (oběma směry, ~2,9 m za šermířem, výška ~2,9 m), boční záběr na
  pád (z boku ~6 m), v lobby kroužení kolem mola (poloměr 8,5 m, výška 3,4 m). Okolí ať je z těchto
  míst hezké; nic vysokého na molu, co by zakrývalo šermíře.
- Stíny počítá hra jen v okruhu ~7 m kolem mola. Celkem do ~60 000 trojúhelníků, soubor do ~3 MB.

**Věci na krájení** `slice/<id>.glb` — počátek ve středu věci, věc je rozdělená rovinou **x = 0** na
dva uzly **`half_a`** (x ≥ 0) a **`half_b`** (x ≤ 0); každá polovina je v místě řezu uzavřená plochou
s materiálem `flesh` (vnitřek). Podlouhlé věci mají dlouhou osu podél X (řez jde napříč).

| id | věc | velikost |
|---|---|---|
| `meloun` | meloun (zelená kůra, červené maso, pecky) | koule r 0,25 |
| `dyne` | dýně | koule r 0,26 (trochu zploštělá) |
| `jablko` | červené jablko | koule r 0,15 |
| `okurka` | okurka | válec r 0,075, délka 0,5 |
| `knedlik` | houskový knedlík | válec r 0,13, délka 0,42 |
| `poleno` | poleno (letokruhy na řezu) | válec r 0,13, délka 0,5 |
| `syr` | kolo sýra (díry na řezu) | válec r 0,22, tloušťka 0,16 |
| `zlate` | zlaté jablko (bonus) | koule r 0,16 |
| `jezek` | ježek — **celý, bez polovin**, obličej do +Z | koule r 0,22 |

Do ~1500 trojúhelníků na věc.

### Test na skutečném zařízení
Až bude co zkoušet, spusť na PC `npm run dev:https` a s uživatelem hru vyzkoušejte s telefony
(PC i telefony na stejné Wi-Fi; telefon musí přijmout varování o certifikátu). Chyby sepiš
(co se dělo, na jakém telefonu) a předej uživateli nebo založ GitHub issue v repu `Jean-Pepa/webovky`.

## Kontrakt spojení (meč ↔ PC)
1. Adresa meče: `/pad?r=KÓD` (ve vývoji `/pad.html?r=KÓD`), volitelně `&peer=host:port`
   (vlastní signalizační server) — tento parametr se předává beze změny.
2. Bez `r` telefon ukáže pole na 4písmenný kód (`normalizeCode`).
3. Řídicí spojení `peer.connect(hostPeerId(kód), CONNECT_OPTIONS)`, po `open` zpráva `hello`
   (`cid` z `localStorage` `mc_cid` — po obnovení stránky se hráč vrátí do stejného slotu).
4. PC odpoví `welcome` + `lobby`; když už hrají dva, přijde `full`. Po `welcome` telefon otevře
   pohybové spojení: `MOTION_OPTIONS`, `label: "m"`, `metadata: { cid }`.
5. Pohyb: zpráva `m` s každým vzorkem senzoru (~60×/s) a aspoň 10×/s i bez pohybu:
   `q` = kvaternion (x, y, z, w) ze souřadnic telefonu do zemských (osa Z nahoru, otočení kolem svislé osy
   libovolné), `g` = drží KRYT, `ts` = čas vzorku v telefonu (ms), `k` = zdroj (`rel` / `ori` / `touch` / `none`).
   PC zahazuje starší vzorky podle `ts` a mezi vzorky natočení dopočítává.
6. Kalibrace: na začátku každého kola hráč namíří telefon na obrazovku a podrží KRYT 0,5 s → PC srovná
   otočení kolem svislé osy (náklon a sklon jsou absolutní podle gravitace). Kdykoli i tlačítkem
   Vyrovnat (zpráva `cal`).
7. `hud` chodí asi 6× za sekundu a při změně (fáze, výzva, skóre, pauza, hostitel), `buzz` = vibrace,
   `results` po zápase. Každou 1 s `ping` → `pong`.
8. Jen hostitel lobby (první připojený telefon) posílá `cmd`: `start`, `mode`, `diff`, `rounds`,
   `next` (odveta), `lobby` (do menu), `pause`, `restart`, `quit`.

## Meč v telefonu: požadavky
- Drží se na výšku jako rukojeť: horní hrana = směr čepele, palec na displeji.
- Natočení: `RelativeOrientationSensor` (Chrome/Android, gyroskop bez kompasu), jinak `deviceorientation`
  (iPhone po ťuknutí `DeviceOrientationEvent.requestPermission()`). Telefon si sám ověří, že obecný
  senzor sedí s `deviceorientation` (směr gravitace), jinak ho nepoužije. **Senzory jen přes https.**
- KRYT = podržet palcem velkou plochu se štítem. Vyrovnat = tlačítko nahoře. Hostitel má ⏸ a menu pauzy.
- Bez senzorů záložní míření prstem (levá plocha) + KRYT vpravo.
- Wake Lock (displej nezhasne), na Androidu celá obrazovka a zámek na výšku, vibrace při zásahu a krytu.
- Lobby: jméno, postava (obsazené zašedlé), pravák / levák, vibrace. Hostitel navíc hra, počítač, délka zápasu, START.

## Vývoj
```bash
npm install
npm run dev:https  # https s vlastním certifikátem — senzory v telefonu fungují i doma
npm run dev        # http (telefon jen míří prstem)
npm run build      # kontrola typů a produkční build
npm run e2e        # automatický test (PC + simulovaný telefon)
npm run peer       # lokální signalizační server na :9000 (pak ?peer=localhost:9000)
```
