# health-data – stažení dat z Google Health (Fitbit Air) k vlastní analýze

Dva skripty, žádná služba, žádný server:

| krok | příkaz | co udělá |
|------|--------|----------|
| 1 | `python pull.py` | přihlásí tě Google účtem a stáhne data z Google Health API do `data/raw/` |
| 2 | `python summarize.py` | z raw dat udělá `data/summary/daily.csv`, `sleep.csv`, `exercise.csv`, `hr_hourly.csv` a čitelný `summary.md` |
| 3 | vlož `data/summary/summary.md` (nebo CSV) do chatu | analýza |

Vše zůstává u tebe na disku. Složky `secrets/` a `data/` jsou v `.gitignore`, na GitHub nejdou.

## Co potřebuješ (jednorázově, cca 10 minut)

Google Health API je oficiální nástupce Fitbit Web API. Pro vlastní účet nepotřebuješ
žádné schvalování od Googlu, jen vlastní „aplikaci“ v Google Cloud:

1. **Projekt** – otevři https://console.cloud.google.com/ a vytvoř nový projekt (např. `moje-zdravi`).
2. **Zapni API** – https://console.cloud.google.com/apis/api/health.googleapis.com → *Enable*.
3. **Consent screen** – https://console.cloud.google.com/auth/overview (Google Auth Platform):
   - App name libovolné, e‑mail tvůj.
   - *Audience*: **External**, stav nech **Testing**.
   - *Test users*: přidej **svůj Google účet** (ten, kde máš Fitbit Air / Google Health).
   - *Data access / Scopes*: nemusíš vyplňovat, scopes si skript vyžádá sám.
4. **OAuth klient** – https://console.cloud.google.com/apis/credentials → *Create credentials* →
   *OAuth client ID* → Application type **Desktop app** → *Download JSON*.
5. Stažený soubor ulož jako **`health-data/secrets/client_secret.json`**.

Háček režimu *Testing*: přihlášení (refresh token) platí **7 dní**. Po týdnu `pull.py`
sám znovu otevře prohlížeč a necháš ho přihlásit. Nic víc.

## Instalace a první stažení

```bash
cd health-data
python -m venv .venv && source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt

python pull.py --since 2026-06-01     # první běh otevře prohlížeč → povolit → stáhne
python summarize.py
```

Další dny stačí `python pull.py` bez parametrů: stáhne jen to, co chybí (posledních
pár dní bere vždy znovu, protože náramek synchronizuje se zpožděním).

Užitečné volby:

```bash
python pull.py --list-types                          # co všechno umí stáhnout
python pull.py --types heart-rate,sleep --since 2026-09-01
python pull.py --dry-run --since 2026-09-01          # jen ukáže požadavky, nic nestahuje
python pull.py --tz Europe/Prague                    # hranice dnů (výchozí Europe/Prague)
python pull.py --force --since 2026-09-01            # přepsat už stažené soubory
```

## Co se stahuje

| typ | granularita | poznámka |
|-----|-------------|----------|
| `heart-rate` | vzorek každých pár sekund | největší objem, cca 5 MB/den |
| `heart-rate-variability`, `oxygen-saturation` | jednotlivá měření (noc) | |
| `sleep` | noc + fáze (deep/light/REM/awake) | |
| `exercise` | trénink + souhrn (tep, kcal, vzdálenost) | |
| `daily-resting-heart-rate`, `daily-heart-rate-variability`, `daily-oxygen-saturation`, `daily-respiratory-rate`, `daily-sleep-temperature-derivations`, `daily-vo2-max` | 1 hodnota/den | denní souhrny jako v appce |
| `steps`, `distance`, `floors`, `total-calories`, `active-minutes`, `active-zone-minutes` | denní součty | přes `dailyRollUp`, protože `list` u kroků vrací jen intervaly bez hodnot |

Chybějící den v `steps` apod. znamená „náramek nebyl na ruce“, ne nula.

## Formát dat

`data/raw/<typ>/<datum>.json` je vždy **původní odpověď API** (`{"dataPoints": [...]}` nebo
`{"rollupDataPoints": [...]}`). Stejný tvar vrací oficiální CLI
[`ghealth`](https://github.com/Google-Health-API/google-health-cli) s `--raw -o soubor.json`,
takže když by `pull.py` s něčím nesouhlasil, jde soubory z `ghealth` prostě přihodit do
stejných složek a `summarize.py` je zpracuje:

```bash
ghealth data sleep list --from 2026-09-01 --raw -o data/raw/sleep/2026-09.json
ghealth data steps daily-rollup --from 2026-09-01 --to 2026-09-08 --raw -o data/raw/steps/2026-09.json
```

`data/summary/`:

- `daily.csv` – jeden řádek na den: kroky, vzdálenost, kalorie, klidový tep, tep min/avg/max, HRV, SpO2,
  dechová frekvence, odchylka teploty, spánek (start, konec, minuty, fáze), tréninky.
  Sloupce s tečkou (`hrv.deepRmssdMilliseconds`) jsou další pole, která API vrátilo.
- `sleep.csv` – jedna spánková session na řádek (včetně šlofíků, `is_nap`).
- `exercise.csv` – jeden trénink na řádek.
- `hr_hourly.csv` – tep po hodinách (min/avg/max/počet vzorků).
- `summary.md` – souhrn posledních 14 dní, trend 7 vs. 7 dní, noci, tréninky. **Tohle stačí vložit do chatu.**

## Jak data předat k analýze

- Nejjednodušší: otevři `data/summary/summary.md`, zkopíruj obsah do chatu a napiš, co tě zajímá.
- Na hlubší analýzu přilož i `daily.csv` (pár desítek KB) nebo `hr_hourly.csv`.
- Raw JSON nikam neposílej, není potřeba a je to citlivé.

## Když něco nejde

| hláška | příčina | řešení |
|--------|---------|--------|
| `nenašel jsem secrets/client_secret.json` | chybí OAuth klient | krok 4–5 výše |
| `403 … has not been used / disabled` | není zapnuté API | krok 2 |
| `403 access_denied` / „app not verified“ | tvůj účet není mezi test users | krok 3 |
| `403 … insufficient scopes` | staré přihlášení | smaž `secrets/token.json`, spusť znovu |
| `invalid_grant` / znovu prohlížeč po týdnu | 7denní platnost v režimu Testing | normální, jen se znovu přihlas |
| `400` s popisem filtru | API změnilo filtr | pošli hlášku, upraví se `build_filter` v `pull.py`; mezitím funguje `ghealth --raw` |
