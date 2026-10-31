# Mařena — pokyny pro práci v tomto repu

## ⛔️ Nasazování (DŮLEŽITÉ)

**Výchozí stav: nahrávej JEN na GitHub (pracovní větev). NIKDY nenasazuj na Vercel sám od sebe.**

- Veškerou práci commituj a pushuj jen na pracovní větev `claude/busy-gauss-t83y4w`.
- Na produkci (Vercel) nasazuj **pouze tehdy, když to uživatel výslovně napíše** — např. „nasaď na vercel", „dej to na vercel", „nahraj to na vercel". Bez takové věty se na `main` ani na Vercel NESAHÁ.
- Vercel staví **jen větev `main`** (Ignored Build Step = build jen produkce). Push na pracovní větev tedy NIKDY nespustí nasazení — proto je bezpečný a je to výchozí chování.
- Nenavrhuj nasazení proaktivně. Po dokončení práce jen pushni na pracovní větev a napiš, že je to na větvi; nasazení nech na uživateli.

### Když uživatel výslovně řekne „nasaď na vercel"
Bezpečný postup (squash deploy do `main`):
1. `git fetch origin`, zkontroluj rozdíl `origin/main` vs pracovní větev.
2. `git checkout main && git pull origin main`
3. `git checkout <pracovní-větev> -- .` (strom = pracovní větev)
4. `npm run build` v `marena/` (pojistka, že produkce projde)
5. `git commit -m "... (deploy)"` (jeden squash commit)
6. `git push origin main`
7. `git checkout <pracovní-větev>` (návrat)

## Hry s telefonem (TurboKáry + Mečovačka) — jeden web
- Vercel projekt s Root Directory `turbokary` hostí obě hry: `/` = volba hry (`turbokary/index.html`,
  `turbokary/src/hub/`), `/kary` = TurboKáry, `/mece/` = Mečovačka.
- Mečovačka (zdroják v `mecovacka/`) je na webu jako **hotový build** v `turbokary/public/mece/`
  (Vercel při buildu nevidí soubory mimo `turbokary/`). Před nasazením změn Mečovačky:
  `cd mecovacka && npm run build:kary` a commitnout i `turbokary/public/mece/`.
- Kdo nasazuje TurboKáry squash postupem, musí mít ve větvi aktuální `main` (`git merge origin/main`),
  jinak `git checkout <větev> -- .` vrátí rozcestník a build Mečovačky na starou verzi.

## Data
- Data jsou v **Upstash Redis** (členové, finance, role, merch, výběr…). Nasazení kódu se jich nedotýká.
- Demo režim bez Redisu běží přes `localStorage` (heslo `marena<rok>`, např. `marena2026`).

## Vývoj
- Aplikace je v `marena/` (Next.js 16 App Router + React 19 + Tailwind v4).
- `npm run dev` (lokální), `npm run build` (kontrola), `npm run lint`.
- `npm run e2e` — proklikání všech funkcí; viewport přes `E2E_W`/`E2E_H` (telefon/tablet/desktop).
- Commit messages nesmí obsahovat identifikátor modelu.
