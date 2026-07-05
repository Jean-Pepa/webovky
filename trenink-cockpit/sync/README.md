# Garmin sync (bez třetí strany)

Stahuje data z Garminu (Forerunner 965) přes knihovnu **garth** a ukládá je do
Supabase (`cockpit_activities`), odkud je čte cockpit appka. Žádná cizí služba.

## 1) Vygeneruj token (jednou, na svém PC)
```bash
pip install garth
python get-token.py       # zeptá se na email, heslo, MFA → uloží garmin_token.txt
```
Obsah `garmin_token.txt` je **token** (ne heslo). Heslo tvůj počítač neopustí.
Token platí ~rok, pak se generuje znovu.

## 2) Kam token dát
- **Rychlý start:** pošli obsah Claudovi — stáhne data hned.
- **Automat (cron):** vlož ho jako GitHub secret `GARMIN_TOKEN` (+ `SUPABASE_URL`,
  `SUPABASE_SERVICE_ROLE_KEY`). Workflow `.github/workflows/garmin-sync.yml` pak
  stahuje data samo každý den.

## 3) Ruční spuštění (kdekoli, kde jsou env proměnné)
```bash
pip install -r requirements.txt
export GARMIN_TOKEN="…"
export SUPABASE_URL="https://xxx.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="…"
python garmin_sync.py
```

> Pozn.: garth je neoficiální (může se časem rozbít, pak stačí aktualizovat).
> Přihlášení (MFA) je jen při generování tokenu; sync už se jen přihlašuje tokenem.
