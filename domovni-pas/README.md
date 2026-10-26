# BULO

Trvalý záznam historie nemovitosti — opravy, závady, revize, rekonstrukce, dokumenty a fotky na
jednom místě. *(Analogie: CarVertical/Carfax, ale pro dům či byt.)*

**Ukázková verze:** čistě frontendová appka, data se ukládají v prohlížeči (localStorage).
Žádná databáze, žádný server, žádné přihlašování — slouží k ověření vzhledu a základních funkcí.

## Appka BULO — digitální pas domu (`/aplikace`)

Funkční prototyp mobilní appky podle videa „BULO – ukázka aplikace“. Na telefonu běží přes celou
obrazovku (jde přidat na plochu), na počítači je telefon v rámečku a vedle něj průvodce
s kapitolami a scénami z videa.

- **Vlastník:** Nemovitosti → pas domu, výkresy a dokumenty, 3D model rozvodů (three.js),
  spotřeba, nový hlídač, hlídače.
- **Únik vody:** noční hlášení hlídače, fotka skvrny a „Zeptat se domu“, zavření uzávěru.
- **Instalatér / technik:** zakázky, přihlášení kódem domu (QR na zdi, odkaz `/q/LOU-0127`),
  zařízení na mapě, AR (místo úniku, rozvody, ikona na kotli, kde nevrtat), zápis z fotek,
  dokumentu a jedné věty, podpis, zpráva majiteli.
- **Servis a výměna:** zápis servisu s dalším termínem, nový kotel z krátkého dokumentu.
- **Připravujeme:** plán obnovy, nabídky techniků, agent projektu (na desktopu jako tablet).

Data ukázky jsou jen v prohlížeči (localStorage, fotky a soubory v IndexedDB). Kamera, diktování
a čtení QR fungují na telefonu přes HTTPS; bez nich appka použije ukázkové záběry.

**AI (volitelné):** bez klíče odpovídá „Zeptat se domu“, AI zápis i čtení dokumentu z dat pasu
domu. S klíčem na serveru volá `/api/bulo/ai` Claude API (i s fotkami a PDF):

| Proměnná | Význam |
| --- | --- |
| `ANTHROPIC_API_KEY` | klíč ke Claude API (bez něj běží místní odpovědi) |
| `BULO_AI_MODEL` | model, výchozí `claude-opus-5-5` |
| `BULO_AI_FALLBACK` | záložní model při odmítnutí, výchozí `claude-opus-4-8` |

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript** + **Tailwind CSS v4**
- Data v `localStorage` (žádný backend)

## 🚀 Nasazení na Vercel (super jednoduché)

1. **vercel.com → Add New → Project** a naimportuj repozitář `Jean-Pepa/webovky`.
2. Nastav **Root Directory = `domovni-pas`** (appka je v podsložce).
3. **Deploy.** Hotovo — žádná databáze, žádné integrace, žádné proměnné prostředí.

> Vercel nasazuje produkční větev (výchozí `main`). Buď tuhle větev mergni do `main`, nebo
> v projektu nastav produkční větev na `claude/relaxed-galileo-l4gvq1`. Každý push navíc
> vytvoří Preview deployment, takže odkaz dostaneš i bez mergování.

## 💻 Lokální vývoj

```bash
cd domovni-pas
npm install
npm run dev      # http://localhost:3000
```

## Co ukázka umí

- Přehled nemovitostí (dashboard) + zakládání, editace a mazání
- **Časová osa záznamů** — oprava / závada / revize / rekonstrukce, datum, popis, náklad, **fotky**
- **Dokumenty** k nemovitosti (kategorie, název, soubor)
- **Sdílení** — read-only náhled (v ukázce ve stejném prohlížeči)
- **Report** k tisku / uložení do PDF

Demo data se načtou při prvním otevření. Vše běží v prohlížeči — vyčištěním dat prohlížeče se
ukázka vrátí do výchozího stavu.

## Skripty

```bash
npm run dev      # vývojový server
npm run build    # produkční build
npm run start    # spuštění buildu
npm run lint     # ESLint
```
