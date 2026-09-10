# health-data – automatické stahování dat z Fitbit Air / Google Health

Každé ráno se sama stáhnou nová data z tvého Google Health účtu (tep po sekundách,
spánek s fázemi, HRV, SpO2, kroky, tréninky…), udělá se z nich denní přehled a vše se
uloží do tvého **soukromého** GitHub repa. Ty pak jen analyzuješ: sám v Excelu/pandas,
nebo řekneš Claude „analyzuj data v repu health-data“.

```
Fitbit Air ─Bluetooth─▶ appka Google Health ─▶ cloud Google
                                                   │  Google Health API (OAuth, jen čtení)
                                                   ▼
        GitHub Actions v soukromém repu, denně 07:30:  pull.py ─▶ data/raw/*.json.gz
                                                        summarize.py ─▶ data/summary/*.csv + summary.md
                                                        git commit + push
```

Jednorázově tě to stojí cca 20 minut (kroky 1–3). Potom nula práce.

---

## Krok 1 – Google Cloud: vlastní „aplikace“ (10 min)

Google Health API je oficiální nástupce Fitbit Web API. Pro vlastní účet nepotřebuješ schvalování
od Googlu, jen si založíš OAuth aplikaci ve svém Google Cloud.

1. **Projekt** – https://console.cloud.google.com/projectcreate → název např. `moje-zdravi` → *Create*.
   Nahoře v liště zkontroluj, že je projekt vybraný.
2. **Zapni API** – https://console.cloud.google.com/apis/api/health.googleapis.com → *Enable*.
3. **Consent screen** – https://console.cloud.google.com/auth/overview → *Get started*:
   - App name: `moje-zdravi`, User support email: tvůj e‑mail
   - Audience: **External**
   - Contact e‑mail: tvůj → *Finish* → *Create*
4. **Publikovat** – v levém menu *Audience* → *Publishing status* → **Publish app** → *Confirm*.
   Tohle je klíčové pro automatizaci: ve stavu *Testing* platí přihlášení jen 7 dní, ve stavu
   *In production* neexpiruje. Aplikace není ověřená Googlem, takže při přihlášení jednou
   odklikneš varování „Google hasn't verified this app“ → *Advanced* → *Go to moje-zdravi (unsafe)*.
   Je to tvoje vlastní aplikace, kterou nikdo jiný neuvidí; Google osobní použití výslovně
   vyjímá z povinnosti ověření.
   *Kdyby Google místo varování ukázal „This app is blocked“*, vrať Publishing status na
   *Testing*, přidej svůj účet do *Test users* a použij týdenní obnovu z kapitoly „Provoz“.
5. **OAuth klient** – https://console.cloud.google.com/apis/credentials → *Create credentials* →
   *OAuth client ID* → Application type **Desktop app** → *Create* → **Download JSON**.
6. Stažený soubor ulož jako **`health-data/secrets/client_secret.json`**.

## Krok 2 – Přihlášení na počítači (2 min)

```bash
cd health-data
python -m venv .venv && source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python pull.py --auth-only
```

Otevře se prohlížeč → vyber účet, na kterém máš Fitbit Air / Google Health → varování
„not verified“ → *Advanced* → *Go to …* → povolit vše → „Přihlášení uloženo do secrets/token.json“.

Rychlá kontrola, že data tečou:

```bash
python pull.py --since 2026-09-01
python summarize.py
cat data/summary/summary.md
```

## Krok 3 – Soukromý repo, kde to poběží samo (5 min)

Zdravotní data nesmí do veřejného repa (`webovky` je veřejné), proto zvlášť.

**Varianta A – máš [gh CLI](https://cli.github.com) a `gh auth login`:**

```bash
python bootstrap_private_repo.py
```

Sám založí soukromý repo `<tvůj-účet>/health-data`, nahraje kód, workflow, už stažená data,
secret s tokenem a spustí první běh. Hotovo.

**Varianta B – bez gh CLI:**

1. https://github.com/new → Repository name `health-data`, **Private**, bez README → *Create*.
2. `python bootstrap_private_repo.py https://github.com/<ucet>/health-data.git`
3. V repu: *Settings → Secrets and variables → Actions → New repository secret*
   Name `HEALTH_TOKEN_JSON`, Secret = celý obsah `secrets/token.json`.
4. *Actions → Health data – denní stažení → Run workflow* (do `since` můžeš dát datum,
   od kterého chceš historii, např. `2026-05-19`).

## Krok 4 – Ověření (1 min)

V *Actions* je běh zelený, v záložce *Summary* běhu vidíš přímo `summary.md`, a v repu
přibyla složka `data/`. Od teď se to opakuje každý den bez tebe.

---

## Provoz

- **Kdy:** denně 05:30 UTC (07:30 letního / 06:30 zimního času). Změna: `cron` v `.github/workflows/pull.yml`.
- **Co:** stáhne nová data (poslední 2 dny bere vždy znovu, náramek synchronizuje se zpožděním),
  udělá souhrn, commitne. Bez nových dat žádný commit.
- **Když spadne:** GitHub ti pošle e‑mail. Nejčastější příčina je neplatný token:
  na počítači `python pull.py --auth-only --gh-repo <ucet>/health-data` (nebo bez `--gh-repo`
  a secret vložit ručně). Tohle je i ta „týdenní obnova“, pokud jsi musel zůstat v režimu Testing.
- **Velikost:** tep dělá cca 200 KB/den (gzip), ostatní zanedbatelné; zhruba 70 MB za rok.
- **Historie:** *Run workflow* s `since` = datum, od kterého chceš data (Google Health má
  i přenesenou historii z Fitbitu). Rollupy chodí po 90 dnech, tep po dnech, takže rok
  historie je pár set požadavků, v pohodě.
- **Změna kódu:** upravíš v repu `health-data` (nebo tady ve `webovky/health-data` a přeneseš).

## Analýza

**S Claude:** v claude.ai/code povol GitHub přístup i k repu `health-data`, pak v chatu
napiš např. „přidej repo Jean-Pepa/health-data a analyzuj data/summary za poslední měsíc“.
Claude si repo přečte sám. Bez přístupu stačí vložit obsah `data/summary/summary.md` do chatu.

**Sám:** `git pull` a otevři CSV v Excelu/Numbers, nebo pandas:

```python
import pandas as pd
d = pd.read_csv("data/summary/daily.csv", parse_dates=["date"]).set_index("date")
print(d[["steps", "resting_hr", "hrv", "sleep_minutes"]].rolling(7).mean().tail())
print(d[["resting_hr", "hrv", "sleep_deep", "steps"]].corr())
```

## Alternativa bez GitHubu: cron na vlastním počítači

Když nechceš data mimo svůj počítač, běží to stejně dobře lokálně (jen musí být zapnutý):

```
# Linux/macOS: crontab -e
30 7 * * * cd /cesta/k/health-data && .venv/bin/python pull.py --no-browser && .venv/bin/python summarize.py
```

Windows: *Task Scheduler* → denně 07:30 → `python.exe pull.py --no-browser` ve složce `health-data`,
druhá akce `summarize.py`. Token se obnovuje sám ze `secrets/token.json`.

---

## Co se stahuje

| typ | granularita | poznámka |
|-----|-------------|----------|
| `heart-rate` | vzorek každých pár sekund | největší objem |
| `heart-rate-variability`, `oxygen-saturation` | jednotlivá měření (noc) | |
| `sleep` | noc + fáze (deep/light/REM/awake) | |
| `exercise` | trénink + souhrn (tep, kcal, vzdálenost) | |
| `daily-resting-heart-rate`, `daily-heart-rate-variability`, `daily-oxygen-saturation`, `daily-respiratory-rate`, `daily-sleep-temperature-derivations`, `daily-vo2-max` | 1 hodnota/den | denní souhrny jako v appce |
| `steps`, `distance`, `floors`, `total-calories`, `active-minutes`, `active-zone-minutes` | denní součty | přes `dailyRollUp`, protože `list` u kroků vrací jen intervaly bez hodnot |

Chybějící den u kroků apod. znamená „náramek nebyl na ruce“, ne nula.

## Soubory

- `pull.py` – stažení. `--list-types`, `--since`, `--until`, `--types`, `--dry-run`, `--force`,
  `--auth-only [--gh-repo]`, `--no-browser` (automatický běh, token z `HEALTH_TOKEN_JSON`).
- `summarize.py` – přehled do `data/summary/` (jen standardní knihovna).
- `bootstrap_private_repo.py` – naplnění soukromého repa.
- `workflow/pull.yml` – GitHub Actions workflow (v soukromém repu jako `.github/workflows/pull.yml`).
- `data/raw/<typ>/<datum>.json.gz` – původní odpovědi API (`{"dataPoints": [...]}` nebo
  `{"rollupDataPoints": [...]}`). Stejný tvar dává oficiální CLI
  [`ghealth`](https://github.com/Google-Health-API/google-health-cli) s `--raw -o soubor.json`;
  takové soubory jde do složek přihodit a `summarize.py` je zpracuje.
- `data/summary/daily.csv` – jeden řádek na den: kroky, vzdálenost, kalorie, klidový tep, tep min/avg/max,
  HRV, SpO2, dechová frekvence, odchylka teploty, spánek (start, konec, minuty, fáze), tréninky.
  Sloupce s tečkou (`hrv.deepRmssdMilliseconds`) jsou další pole, která API vrátilo.
- `data/summary/sleep.csv`, `exercise.csv`, `hr_hourly.csv` – detail.
- `data/summary/summary.md` – trend 7 vs. 7 dní, týdenní průměry, posledních 14 dní, noci, tréninky.

## Když něco nejde

| hláška | příčina | řešení |
|--------|---------|--------|
| `nenašel jsem secrets/client_secret.json` | chybí OAuth klient | krok 1.5–1.6 |
| `403 … has not been used / disabled` | není zapnuté API | krok 1.2 |
| `403 access_denied` / „app not verified“ bez tlačítka Advanced | účet není mezi test users (režim Testing) | Audience → Test users, nebo Publish app |
| „This app is blocked“ | Google neověřenou produkční aplikaci s těmito scopes nepustil | zpět na Testing + test users, obnova tokenu týdně (`--auth-only --gh-repo`) |
| `403 … insufficient scopes` | staré přihlášení | smaž `secrets/token.json`, `--auth-only` znovu |
| `invalid_grant` / `přihlášení už neplatí` | token vypršel (7 dní v Testing) nebo odvolán | `python pull.py --auth-only --gh-repo <ucet>/health-data` |
| `400` s popisem filtru | API změnilo filtr | pošli hlášku, upraví se `build_filter` v `pull.py`; mezitím `ghealth --raw` |
| workflow nikdy nespustí sám | workflow není na výchozí větvi repa | musí být v `main` soukromého repa |
