#!/usr/bin/env bash
# Červené tlačítko: okamžitě zastaví agenta a všechno, co za něj samo chodí na internet.
#   bash ~/osobni-agent/wsl/zastav-agenta.sh --instaluj   tlačítka „Zastav agenta" a „Spusť agenta"
#                                                          do nabídky Start ve Windows
#   bash ~/agent-nastroje/zastav-agenta.sh                zastavit (platí i po restartu počítače)
#   bash ~/agent-nastroje/zastav-agenta.sh --spustit      znovu spustit, co tlačítko zastavilo
#
# Zastaví bránu OpenClaw, tedy chat, pravidelnou kontrolu, noční úklid i příkazy, které agent
# zrovna spustil. K tomu časovače, které stahují z internetu (náramek, novinky, přehled světa,
# noční průzkum).
# Noční záloha Mozku a bezpečnostní kontrola běží dál, nic nemění.
set -uo pipefail

# Zástupce ve Windows spouští skript bez přihlášení do Ubuntu. systemctl --user pak potřebuje
# vědět, kde je tvoje uživatelská relace.
export XDG_RUNTIME_DIR="${XDG_RUNTIME_DIR:-/run/user/$(id -u)}"
STAV="$HOME/.local/state/agent/zastaveno"
JEDNOTKY=(openclaw-gateway.service agent-fitbit.timer agent-novinky.timer agent-svet.timer agent-pruzkum.timer)
OKNO=0

pockej() {
  if (( OKNO )); then
    read -r -t 60 -p "Okno zavřeš klávesou Enter (samo se zavře za minutu). " || true
  fi
}

zastav() {
  mkdir -p "$(dirname "$STAV")"
  : >> "$STAV"
  for jednotka in "${JEDNOTKY[@]}"; do
    if systemctl --user is-enabled "$jednotka" >/dev/null 2>&1 || systemctl --user is-active "$jednotka" >/dev/null 2>&1; then
      grep -qx "$jednotka" "$STAV" || echo "$jednotka" >> "$STAV"
      systemctl --user disable --now "$jednotka" >/dev/null 2>&1
    fi
  done
  # Úlohy, které časovač zrovna spustil.
  systemctl --user stop agent-fitbit.service agent-novinky.service agent-svet.service agent-pruzkum.service >/dev/null 2>&1
  if systemctl --user is-active openclaw-gateway.service >/dev/null 2>&1; then
    echo "POZOR: bránu OpenClaw se nepodařilo zastavit. Spusť v Ubuntu: openclaw gateway stop"
    return 1
  fi
  echo "Agent je zastavený. Nic nedělá, neodpovídá a nic nestahuje, ani po restartu počítače."
  echo "Znovu ho spustíš tlačítkem „Spusť agenta\" v nabídce Start."
}

spust() {
  if [[ ! -s "$STAV" ]]; then
    echo "Agent nebyl zastavený tlačítkem, nic nespouštím."
    systemctl --user is-active openclaw-gateway.service >/dev/null 2>&1 || echo "Brána ale neběží: openclaw gateway start"
    return 0
  fi
  while read -r jednotka; do
    [[ -n "$jednotka" ]] && systemctl --user enable --now "$jednotka" >/dev/null 2>&1
  done < "$STAV"
  rm -f "$STAV"
  sleep 3
  if systemctl --user is-active openclaw-gateway.service >/dev/null 2>&1; then
    echo "Agent zase běží."
  else
    echo "POZOR: brána OpenClaw se nespustila. Spusť v Ubuntu: openclaw gateway status"
    return 1
  fi
}

instaluj() {
  if ! command -v powershell.exe >/dev/null; then
    echo "Nenašel jsem Windows (powershell.exe). Spusť to v Ubuntu ve WSL." >&2
    return 1
  fi
  mkdir -p "$HOME/agent-nastroje"
  install -m 755 "${BASH_SOURCE[0]}" "$HOME/agent-nastroje/zastav-agenta.sh"
  local distribuce="${WSL_DISTRO_NAME:-Ubuntu}" skript
  # Zástupci v nabídce Start (Start → Osobní agent). Na plochu nic nedávám.
  skript=$(cat <<EOF
\$shell = New-Object -ComObject WScript.Shell
\$slozka = Join-Path ([Environment]::GetFolderPath('Programs')) 'Osobní agent'
New-Item -ItemType Directory -Force -Path \$slozka | Out-Null
foreach (\$t in @(@('Zastav agenta', '--okno'), @('Spusť agenta', '--spustit --okno'))) {
  \$z = \$shell.CreateShortcut((Join-Path \$slozka (\$t[0] + '.lnk')))
  \$z.TargetPath = Join-Path \$env:WINDIR 'System32\\wsl.exe'
  \$z.Arguments = '-d $distribuce --cd ~ -e bash agent-nastroje/zastav-agenta.sh ' + \$t[1]
  \$z.Description = \$t[0]
  \$z.Save()
}
Write-Output \$slozka
EOF
)
  local slozka
  slozka=$(powershell.exe -NoProfile -NonInteractive -EncodedCommand "$(printf '%s' "$skript" | iconv -f utf-8 -t utf-16le | base64 -w0)" | tr -d '\r')
  if [[ -z "$slozka" ]]; then
    echo "Zástupce se nepodařilo vytvořit." >&2
    return 1
  fi
  echo "Hotovo. V nabídce Start je složka „Osobní agent\" s tlačítky „Zastav agenta\" a „Spusť agenta\"."
  echo "Zastav agenta si můžeš připnout na hlavní panel (pravým tlačítkem → Připnout na hlavní panel)."
}

akce=zastav
for arg in "$@"; do
  case "$arg" in
    --spustit) akce=spust ;;
    --instaluj) akce=instaluj ;;
    --okno) OKNO=1 ;;
    *) echo "Neznámá volba: $arg" >&2; exit 2 ;;
  esac
done
$akce
vysledek=$?
pockej
exit $vysledek
