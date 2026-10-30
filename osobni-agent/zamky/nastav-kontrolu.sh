#!/usr/bin/env bash
# Nahraje pokyny pravidelné kontroly (každých 30 minut) ze souboru kontrola.md do OpenClaw.
# OpenClaw je od verze 2026.10 drží ve své databázi a soubor HEARTBEAT.md už nečte.
#   bash ~/osobni-agent/zamky/nastav-kontrolu.sh
# Spouštěj se spuštěnou bránou. Po každé změně kontrola.md ho spusť znovu.
set -euo pipefail

POKYNY="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/kontrola.md"

id=$(openclaw automations list --all --json | python3 -c '
import json, sys
jobs = json.load(sys.stdin).get("jobs", [])
ids = [j["id"] for j in jobs if j.get("declarationKey") == "heartbeat:main"]
print(ids[0] if ids else "")')

if [[ -z "$id" ]]; then
  echo "Pravidelnou kontrolu jsem v OpenClaw nenašel. Nejdřív spusť:" >&2
  echo "  openclaw config patch --file ~/osobni-agent/zamky/openclaw-zamceni.json5" >&2
  exit 1
fi
openclaw automations scratch "$id" --file "$POKYNY" >/dev/null
echo "Hotovo. Pravidelná kontrola má pokyny ze souboru $POKYNY."
