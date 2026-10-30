#!/usr/bin/env bash
# Instalace nástrojů osobního agenta ve WSL (Ubuntu).
# Spouštěj jako běžný uživatel, ne přes sudo:
#   bash instaluj-nastroje.sh            maily + rešerše
#   bash instaluj-nastroje.sh --whisper  navíc lokální přepis hlasu (diktát)
#   bash instaluj-nastroje.sh --jednani  navíc přepis jednání s rozlišením mluvčích (obsahuje --whisper)
set -euo pipefail

ZDROJ="$(cd "$(dirname "${BASH_SOURCE[0]}")/../nastroje" && pwd)"
CIL="$HOME/agent-nastroje"
VENV="$HOME/.venv-agent"
KONFIG="$HOME/.config/agent"
BIN="$HOME/.local/bin"
WHISPER=0
JEDNANI=0

for arg in "$@"; do
  case "$arg" in
    --whisper) WHISPER=1 ;;
    --jednani) WHISPER=1; JEDNANI=1 ;;
    *) echo "Neznámá volba: $arg" >&2; exit 1 ;;
  esac
done

if [[ $EUID -eq 0 ]]; then
  echo "Nespouštěj jako root. Spusť jako svůj uživatel: bash $0" >&2
  exit 1
fi
if ! python3 -c "import venv, ensurepip" 2>/dev/null; then
  echo "Chybí python3-venv. Spusť nejdřív: sudo apt update && sudo apt install -y python3-venv python3-pip" >&2
  exit 1
fi

echo "→ Kopíruji skripty do $CIL"
mkdir -p "$CIL" "$BIN"
install -m 755 "$ZDROJ/mail.py" "$ZDROJ/resers.py" "$ZDROJ/prepis.py" "$ZDROJ/jednani.py" \
  "$ZDROJ/zdravi.py" "$ZDROJ/fitbit.py" "$ZDROJ/kalendar.py" "$CIL/"
install -m 644 "$ZDROJ/google_ucet.py" "$CIL/"

echo "→ Připravuji Python prostředí $VENV"
[[ -x "$VENV/bin/python" ]] || python3 -m venv "$VENV"
"$VENV/bin/python" -m pip install --quiet --upgrade pip
"$VENV/bin/python" -m pip install --quiet "anthropic>=2.3"
if [[ $WHISPER -eq 1 ]]; then
  echo "→ Instaluji faster-whisper (přepis hlasu, chvíli to trvá)"
  # PyAV 19 už nepřijímá volbu, kterou faster-whisper 1.2 používá při čtení nahrávek.
  "$VENV/bin/python" -m pip install --quiet "faster-whisper>=1.1" "av>=11,<19"
fi
if [[ $JEDNANI -eq 1 ]]; then
  echo "→ Instaluji pyannote.audio (rozlišení mluvčích, stahuje se i PyTorch, několik GB)"
  # PyTorch 2.10 je poslední s CUDA 12 jako přepis (CTranslate2). Novější má CUDA 13 a jeho
  # knihovny pro grafiku by se s knihovnami přepisu přepisovaly ve stejné složce.
  "$VENV/bin/python" -m pip install --quiet "pyannote.audio>=4.0" \
    "torch>=2.10,<2.11" "torchaudio>=2.10,<2.11" "torchcodec>=0.10,<0.11"
fi

echo "→ Vytvářím příkazy agent-mail, agent-resers, agent-prepis, agent-jednani, agent-zdravi, agent-fitbit a agent-kalendar v $BIN"
for nazev in mail resers prepis jednani zdravi fitbit kalendar; do
  cat > "$BIN/agent-$nazev" <<EOF
#!/usr/bin/env bash
# Knihovny CUDA z Python prostředí, aby přepis běžel i na grafice.
for d in "$VENV"/lib/python3*/site-packages/nvidia/cublas/lib "$VENV"/lib/python3*/site-packages/nvidia/cudnn/lib; do
  [ -d "\$d" ] && LD_LIBRARY_PATH="\$d:\${LD_LIBRARY_PATH:-}"
done
export LD_LIBRARY_PATH
export PYANNOTE_METRICS_ENABLED=0
exec "$VENV/bin/python" "$CIL/$nazev.py" "\$@"
EOF
  chmod 755 "$BIN/agent-$nazev"
done

echo "→ Připravuji konfiguraci v $KONFIG (čitelnou jen pro tebe)"
install -d -m 700 "$KONFIG" "$HOME/.local/state/agent"
umask 077
if [[ ! -f "$KONFIG/mail.env" ]]; then
  cat > "$KONFIG/mail.env" <<'EOF'
# Přihlášení k e-mailu (IMAP). Heslo je „heslo pro aplikace", ne tvoje hlavní heslo.
# Gmail: IMAP_HOST=imap.gmail.com     Seznam: IMAP_HOST=imap.seznam.cz
IMAP_HOST=
IMAP_PORT=993
IMAP_USER=
IMAP_PASSWORD=
# Volitelné: názvy složek konceptů a odeslaných, když je skript nenajde sám
DRAFTS_FOLDER=
SENT_FOLDER=
EOF
fi
if [[ ! -f "$KONFIG/anthropic.env" ]]; then
  printf '%s\n' "# Klíč z platform.claude.com (API Keys). Není to předplatné Claude Pro." "ANTHROPIC_API_KEY=" > "$KONFIG/anthropic.env"
fi
if [[ ! -f "$KONFIG/huggingface.env" ]]; then
  printf '%s\n' "# Token z huggingface.co/settings/tokens (stačí čtení). Jednou potřeba ke stažení modelu pro rozlišení mluvčích." "HF_TOKEN=" > "$KONFIG/huggingface.env"
fi
if [[ ! -f "$KONFIG/citliva-slova.txt" ]]; then
  cat > "$KONFIG/citliva-slova.txt" <<'EOF'
# Slova, která nesmí odejít v rešeršním dotazu. Jedno na řádek.
# Stačí kmen slova, skloňované tvary se skryjí také (Petr → Petra, Petrovi).
# Slova s velkým písmenem se hledají jen s velkým písmenem.
# Příklady (smaž # a uprav):
# Novák
# Vinohradsk
EOF
fi
chmod 600 "$KONFIG"/*

echo
echo "Hotovo. Další krok: vyplň $KONFIG/mail.env a $KONFIG/anthropic.env (NAVOD.md, krok 8)."
[[ $JEDNANI -eq 1 ]] && echo "Pro přepis jednání vyplň i $KONFIG/huggingface.env (NAVOD.md, krok 16)."
case ":$PATH:" in
  *":$BIN:"*) ;;
  *) echo "Pozn.: $BIN zatím není v PATH. Zavři a znovu otevři terminál Ubuntu." ;;
esac
