#!/usr/bin/env bash
# Nastaví modely agenta v OpenClaw: přezdívky ze souboru modely.json5, okno hlavního modelu
# a odebere rychlý model, který nepoužíváme.
#   bash ~/osobni-agent/zamky/nastav-modely.sh           okno hlavního modelu 64k (65536 tokenů)
#   bash ~/osobni-agent/zamky/nastav-modely.sh 131072    zkusit 128k
#   bash ~/osobni-agent/zamky/nastav-modely.sh 32768     zpátky na 32k
# Ollamu ve Windows nastavovat nemusíš, OpenClaw jí velikost okna posílá s každou zprávou.
set -euo pipefail

OKNO="${1:-65536}"
HLAVNI="gemma4:26b"
SLOZKA="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

case "$OKNO" in
  32768|65536|98304|131072) ;;
  *) echo "Okno zadej jako 32768, 65536, 98304 nebo 131072 tokenů." >&2; exit 1 ;;
esac

# Pořadí modelu v seznamu, který OpenClaw uložil při nastavení (models.providers.ollama.models).
pozice() {
  openclaw config get models.providers.ollama.models --json 2>/dev/null | python3 -c '
import json, sys
try:
    models = json.load(sys.stdin)
except ValueError:
    models = []
for i, m in enumerate(models if isinstance(models, list) else []):
    if isinstance(m, dict) and m.get("id") == sys.argv[1]:
        print(i)
        break' "$1"
}

openclaw config patch --file "$SLOZKA/modely.json5" >/dev/null

i=$(pozice "$HLAVNI")
if [[ -z "$i" ]]; then
  echo "Hlavní model $HLAVNI v nastavení OpenClaw nevidím. Spusť: openclaw models list --provider ollama --refresh" >&2
  exit 1
fi
openclaw config set "models.providers.ollama.models[$i].contextTokens" "$OKNO" --strict-json >/dev/null

j=$(pozice "gemma4:e4b")
if [[ -n "$j" ]]; then
  openclaw config unset "models.providers.ollama.models[$j]" >/dev/null
fi

openclaw config validate >/dev/null
echo "Hotovo. Hlavní model má okno $OKNO tokenů, z toho 8 192 je rezerva na odpověď."
openclaw models list --provider ollama
