# BULO

Trvalý záznam historie nemovitosti — opravy, závady, revize, rekonstrukce, dokumenty a fotky na
jednom místě. *(Analogie: CarVertical/Carfax, ale pro dům či byt.)*

**Ukázková verze:** čistě frontendová appka, data se ukládají v prohlížeči (localStorage).
Žádná databáze, žádný server, žádné přihlašování — slouží k ověření vzhledu a základních funkcí.

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
