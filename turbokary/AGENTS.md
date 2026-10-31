# TurboKáry — společné zadání (Claude i Codex)

## Co stavíme
Vlastní závody motokár. Hra běží v prohlížeči na PC (velká obrazovka), ovladače jsou telefony
hráčů. 1–4 hráči + boti, při více hráčích rozdělená obrazovka. Nic se neinstaluje: PC otevře web,
telefon naskenuje QR kód.

Je to **originální hra**, ne kopie Mario Kart: vlastní postavy (zvířátka), vlastní trať, vlastní
věci. Žádné postavy, názvy, grafika, hudba ani zvuky od Nintenda.

## Jak to funguje
- **PC** (`index.html`, `src/game/`): 3D hra (three.js), lobby s QR kódem, závod, výsledky.
- **Telefon** (`pad.html`, `src/pad/`): ovladač. Náklon = volant (gyroskop), tlačítka
  plyn / brzda / drift / věc, záložní dotykové řízení.
- **Spojení**: WebRTC datový kanál přes PeerJS. Signalizace přes veřejný server 0.peerjs.com,
  samotná data jdou přímo telefon ↔ PC po Wi-Fi. Kontrakt zpráv: `src/shared/protocol.ts`.

## Rozsah verze 1
- 1 trať: Zelená louka (`src/game/tracks.ts`). Další tratě později.
- 8 postav (`src/shared/characters.ts`), věci (`src/shared/items.ts`): turbo, trojité turbo,
  olej, raketa, štít.
- 3 kola, boti, drift s turbo bonusem, pořadí, výsledky.

## Kdo co dělá
| Část | Kdo | Soubory |
|---|---|---|
| Hra na PC (3D, fyzika, závod, lobby, zvuk) | Claude | `src/game/`, `src/styles/game.css`, `index.html` |
| Ovladač v telefonu | Codex | `src/pad/`, `src/styles/pad.css`, `pad.html` |
| Společný protokol a nastavení spojení | oba, změny jen po dohodě | `src/shared/` |

Do cizích souborů nesahej. Když potřebuješ změnu protokolu, zapiš ji do sekce „Změny protokolu“
níže (co a proč) a řekni to uživateli, ať to předá druhému.

## Pravidla pro Git
- Claude pracuje na větvi `claude/sharp-allen-iz8adn`, Codex na `codex/ovladac`
  (založené z větve Clauda). Každý ve vlastní pracovní kopii.
- Malé commity, často push. Spojení: druhý si stáhne větev (`git fetch` + `git merge`).
- **Nikdy push do `main` a nikdy nasazení na Vercel bez výslovného pokynu uživatele**
  (viz `CLAUDE.md` v kořeni repa).
- Nové npm závislosti jen když je to nutné; do commitu napiš proč.
- Zprávy commitů bez názvu nebo identifikátoru AI modelu.

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
- Tlačítka: PLYN (držet), BRZDA/COUVAT (držet), DRIFT (držet), VĚC (ťuknout).
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
(zatím žádné)
