# Dovča 🏖️

Společný plánovač dovolené pro partu. Řeší věčný problém „nikdy nevíme, kdy můžeme
spolu vyrazit": každý si naklikáš, **kdy nemůžeš**, a appka sama najde a seřadí
termíny, kdy se vás sejde nejvíc.

## Jak to funguje

1. **Založíš výpravu** — období (např. léto 2026), délku dovču (např. 7 dní vcelku)
   a kolik vás musí minimálně být.
2. **Každý značí svůj kalendář** — výchozí stav je „můžu", takže stačí tažením
   vyznačit dny, kdy **nemůžeš** (🔴) nebo kdy je to **na vážkách** (🟡).
3. **Appka spočítá nejlepší okna** — seřazená podle toho, kolik z vás může, plus
   měsíční **heatmapa** (čím tmavší den, tím víc volných).
4. **Návrh termínu + hlasování** — k oknu hodíš konkrétní návrh (místo, cena, odkaz)
   a každý dá 👍 / 🤷 / 👎.
5. **„To je ono"** — termín se zamkne jako domluvený.

## Přihlášení

Žádné účty — jedno **společné heslo** pro partu a uvnitř si každý napíše **jméno**
(uloží se v prohlížeči). Heslo se nastavuje proměnnou `DOVCA_PASSWORD`
(bez nastavení je výchozí `dovca`).

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript** + **Tailwind CSS v4**
- Sdílené úložiště: **Upstash Redis** (resp. Vercel KV). Bez konfigurace jede appka
  v **demo režimu** — data jen v prohlížeči (localStorage), takže si všechno hned
  vyzkoušíš.

## Lokální vývoj

```bash
cd dovca
npm install
npm run dev      # http://localhost:3000
```

Pro sdílené úložiště vytvoř `.env.local` (viz `.env.example`):

```bash
DOVCA_PASSWORD=tajneheslo
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

## Nasazení na Vercel

Samostatný projekt: **Add New → Project**, repo `Jean-Pepa/webovky`,
**Root Directory = `dovca`**. Přidej úložiště Upstash Redis / Vercel KV
(`Storage → Create`) a nastav `DOVCA_PASSWORD`. Bez úložiště se nasadí taky —
poběží jen v demo režimu.

## Skripty

```bash
npm run dev      # vývojový server
npm run build    # produkční build
npm run start    # spuštění buildu
npm run lint     # ESLint
```
