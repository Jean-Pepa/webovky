#!/usr/bin/env bash
# Záloha Mozku do jednoho souboru na disk Windows. Nechává posledních 14 záloh.
#   bash ~/osobni-agent/wsl/zaloha-mozku.sh --instaluj   zálohovat každou noc ve 2:30
#   bash ~/agent-nastroje/zaloha-mozku.sh                zálohovat hned
# Zálohy jsou mimo Mozek, takže je agent nevidí a nemůže je smazat. Na disku C: je šifruje
# BitLocker. Proti krádeži nebo poruše notebooku je jednou týdně zkopíruj na externí disk.
set -euo pipefail

MOZEK="${MOZEK:-$HOME/Mozek}"
NASTAVENI="$HOME/.config/agent/zaloha.env"
PONECHAT="${PONECHAT:-14}"

if [[ "${1:-}" == "--instaluj" ]]; then
  profil=$(cmd.exe /c 'echo %USERPROFILE%' 2>/dev/null | tr -d '\r' || true)
  if [[ -z "$profil" ]] || ! slozka=$(wslpath -u "$profil" 2>/dev/null); then
    echo "Nenašel jsem tvou složku ve Windows (cmd.exe). Spusť skript v Ubuntu ve WSL." >&2
    exit 1
  fi
  mkdir -p "$(dirname "$NASTAVENI")" "$HOME/agent-nastroje" "$HOME/.config/systemd/user"
  printf 'ZALOHY=%s/ZalohyMozku\n' "$slozka" > "$NASTAVENI"
  install -m 755 "${BASH_SOURCE[0]}" "$HOME/agent-nastroje/zaloha-mozku.sh"
  cat > "$HOME/.config/systemd/user/zaloha-mozku.service" <<'EOF'
[Unit]
Description=Záloha Mozku

[Service]
Type=oneshot
ExecStart=/bin/bash %h/agent-nastroje/zaloha-mozku.sh
EOF
  cat > "$HOME/.config/systemd/user/zaloha-mozku.timer" <<'EOF'
[Unit]
Description=Záloha Mozku každou noc

[Timer]
OnCalendar=*-*-* 02:30:00
Persistent=true

[Install]
WantedBy=timers.target
EOF
  systemctl --user daemon-reload
  systemctl --user enable --now zaloha-mozku.timer
  echo "Hotovo. Zálohy budou každou noc ve 2:30 ve složce $slozka/ZalohyMozku."
  echo "Když je notebook ve 2:30 vypnutý, záloha proběhne po jeho zapnutí."
  echo "Zálohu hned teď spustíš příkazem: systemctl --user start zaloha-mozku.service"
  exit 0
fi

ZALOHY="${ZALOHY:-}"
if [[ -z "$ZALOHY" && -f "$NASTAVENI" ]]; then
  ZALOHY=$(sed -n 's/^ZALOHY=//p' "$NASTAVENI")
fi
if [[ -z "$ZALOHY" ]]; then
  echo "Není nastavená složka pro zálohy. Spusť nejdřív: bash ~/osobni-agent/wsl/zaloha-mozku.sh --instaluj" >&2
  exit 1
fi
shopt -s nocasematch
if [[ "$ZALOHY" =~ onedrive|dropbox|icloud|google\ ?drive ]]; then
  echo "Složka $ZALOHY se nahrává do cloudu. Zálohy Mozku tam patří jen zašifrované, nezálohuju." >&2
  exit 1
fi
shopt -u nocasematch
if [[ ! -d "$MOZEK" ]]; then
  echo "Nenašel jsem Mozek ($MOZEK)." >&2
  exit 1
fi

mkdir -p "$ZALOHY"
soubor="$ZALOHY/mozek-$(date +%Y-%m-%d_%H%M).tar.gz"
tar -czf "$soubor.part" -C "$(dirname "$MOZEK")" "$(basename "$MOZEK")"
mv -f "$soubor.part" "$soubor"
echo "Záloha hotová: $soubor ($(du -h "$soubor" | cut -f1))"

# Starší zálohy nad limit smaže. Jiných souborů ve složce se nedotkne.
mapfile -t zalohy < <(ls -1t "$ZALOHY"/mozek-*.tar.gz 2>/dev/null)
for stara in "${zalohy[@]:$PONECHAT}"; do
  rm -f -- "$stara"
done
