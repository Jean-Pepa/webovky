#!/usr/bin/env bash
# Vlastní vyhledávač SearXNG v notebooku pro agent-pruzkum (NAVOD.md, krok 23).
# Běží v kontejneru (podman, bez práv správce) a poslouchá jen na 127.0.0.1:8888. Z místní
# sítě ani z internetu se k němu nikdo nedostane. Dotazy posílá dál do Googlu, Bingu,
# DuckDuckGo, Wikipedie a dalších, každému jen samotný dotaz, bez účtu a bez cookies.
#   bash ~/osobni-agent/wsl/instaluj-hledani.sh
set -euo pipefail

if [[ $EUID -eq 0 ]]; then
  echo "Nespouštěj jako root. Spusť jako svůj uživatel: bash $0" >&2
  exit 1
fi
if [[ "$(ps -p 1 -o comm= 2>/dev/null)" != "systemd" ]]; then
  echo "WSL běží bez systemd. Nejdřív krok 6b, bod 1." >&2
  exit 1
fi

if ! command -v podman >/dev/null; then
  echo "→ Instaluji podman (kontejnery bez práv správce)"
  sudo apt-get update -qq
  sudo apt-get install -y podman
fi
# Kontejner bez práv správce potřebuje vlastní rozsah čísel uživatelů.
if ! grep -q "^$(id -un):" /etc/subuid 2>/dev/null; then
  sudo usermod --add-subuids 100000-165535 --add-subgids 100000-165535 "$(id -un)"
fi

NASTAVENI="$HOME/.config/searxng"
mkdir -p "$NASTAVENI" "$HOME/.config/containers/systemd"
if [[ ! -f "$NASTAVENI/settings.yml" ]]; then
  klic=$(head -c 32 /dev/urandom | od -An -tx1 | tr -d ' \n')
  cat > "$NASTAVENI/settings.yml" <<EOF
# Soukromý vyhledávač osobního agenta. Ostatní nastavení je výchozí:
# https://docs.searxng.org/admin/settings/
use_default_settings: true
general:
  instance_name: "Mozek"
  enable_metrics: false
server:
  secret_key: "$klic"
  limiter: false
  image_proxy: false
  public_instance: false
search:
  safe_search: 0
  autocomplete: ""
  formats:
    - html
    - json
ui:
  default_locale: "cs"
outgoing:
  request_timeout: 4.0
  max_request_timeout: 8.0
EOF
fi
chmod 755 "$NASTAVENI"
chmod 644 "$NASTAVENI/settings.yml"

# Služba pro systemd (Quadlet): spustí se sama po startu notebooku.
cat > "$HOME/.config/containers/systemd/searxng.container" <<'EOF'
[Unit]
Description=SearXNG: soukromý vyhledávač pro agenta (jen v notebooku)

[Container]
Image=docker.io/searxng/searxng:latest
ContainerName=searxng
PublishPort=127.0.0.1:8888:8080
Volume=%h/.config/searxng:/etc/searxng
Environment=SEARXNG_BASE_URL=http://127.0.0.1:8888/
NoNewPrivileges=true

[Service]
Restart=on-failure
TimeoutStartSec=600

[Install]
WantedBy=default.target
EOF

echo "→ Stahuji SearXNG (asi 200 MB, jen poprvé)"
podman pull docker.io/searxng/searxng:latest
systemctl --user daemon-reload
systemctl --user restart searxng.service

echo "→ Čekám, až vyhledávač naběhne"
for _ in $(seq 1 45); do
  if curl -fsS --noproxy '*' "http://127.0.0.1:8888/search?q=architektura&format=json" -o /dev/null 2>/dev/null; then
    echo "Hotovo. Vyhledávač běží na http://127.0.0.1:8888 (funguje i v prohlížeči ve Windows)."
    echo "Další krok: agent-pruzkum zkontroluj"
    exit 0
  fi
  sleep 2
done
echo "Vyhledávač neodpovídá. Co se děje, ukáže: journalctl --user -u searxng -n 50" >&2
exit 1
