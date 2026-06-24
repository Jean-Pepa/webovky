# Mařena 🧡

Web a organizační zázemí studentského festivalu **Mařena** (fakulta architektury).

- **Veřejná homepage** s informacemi o Mařeně a maskotem.
- **Almanach** — sloučení dvou ročníků manuálu do jednoho dokumentu (příprava, fakulta,
  finance, propagace, program, výzdoba, prváci, merch, bar, průvod, Fléda, BOZP).
- **Zázemí (background)** za jedním společným heslem — bez účtů. Každý si jen řekne jméno
  a vybere si roli (post):
  - **Nástěnka** — důležité info od ostatních
  - **Hlasování** — rozhodování týmu
  - **Kalendář** — termíny, deadliny, schůzky, přednášky, průvod, Fléda
  - **Tým & role** — posty vybrané podle manuálu, každý vidí, co jeho role obnáší
  - **Úkoly** — delegování a sledování postupu
- **Každý ročník zvlášť** — přepínač ročníků nahoře, vlastní tým / nástěnka / hlasování /
  kalendář / úkoly pro každý rok.

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript** + **Tailwind CSS v4**
- Sdílené úložiště: **Upstash Redis** (resp. Vercel KV). Bez konfigurace appka jede
  v **demo režimu** — data se ukládají jen v prohlížeči (localStorage).

## 🚀 Nasazení na Vercel

1. **vercel.com → Add New → Project** a naimportuj repozitář `Jean-Pepa/webovky`.
2. Nastav **Root Directory = `marena`** (appka je v podsložce).
3. (Doporučeno) Přidej úložiště **Upstash Redis** / **Vercel KV** přes
   *Storage → Create*, ať jsou data sdílená pro celý tým. Stačí, aby v prostředí byly
   proměnné `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`
   (nebo `KV_REST_API_URL` + `KV_REST_API_TOKEN`).
4. Nastav heslo do zázemí proměnnou **`MARENA_PASSWORD`** (jinak je výchozí `marena`).
5. **Deploy.**

> Bez úložiště se nasadí i tak — jen poběží v demo režimu (data jen lokálně v prohlížeči),
> což je fajn na vyzkoušení vzhledu.

## 💻 Lokální vývoj

```bash
cd marena
npm install
npm run dev      # http://localhost:3000
```

Pro lokální sdílené úložiště vytvoř `.env.local`:

```bash
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
MARENA_PASSWORD=tajneheslo
```

## Jak to funguje

- **Žádné účty.** Do zázemí se jde přes jedno společné heslo. Uvnitř si každý zadá jméno
  (uloží se v prohlížeči) a podle něj se podepisují příspěvky, hlasy a úkoly.
- **Vše může každý přidávat i odebírat** — je to nástroj pro tým, který si věří.
- **Data** se při nakonfigurovaném Redisu ukládají na server pod klíčem `marena:db` a jsou
  tak sdílená mezi všemi. Bez Redisu se ukládají do `localStorage` daného prohlížeče.

## Skripty

```bash
npm run dev      # vývojový server
npm run build    # produkční build
npm run start    # spuštění buildu
npm run lint     # ESLint
```
