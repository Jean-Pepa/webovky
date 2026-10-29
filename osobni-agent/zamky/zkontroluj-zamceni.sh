#!/usr/bin/env bash
# Kontrola, že zámky osobního agenta platí. Nic nemění, jen čte.
#   bash ~/osobni-agent/zamky/zkontroluj-zamceni.sh   (v Ubuntu ve WSL)
# Na konci vypíše počet nálezů POZOR. NEVÍM znamená, že to skript nemohl ověřit.
set -uo pipefail

POCET=0
ok()    { printf 'OK      %s\n' "$1"; }
pozor() { printf 'POZOR   %s\n' "$1"; POCET=$((POCET + 1)); }
nevim() { printf 'NEVÍM   %s\n' "$1"; }

if ! command -v openclaw >/dev/null; then
  echo "Chybí příkaz openclaw. Nejdřív nainstaluj OpenClaw (NAVOD.md, krok 6)." >&2
  exit 2
fi

# je <popis> <cesta v nastavení> <podmínka v Pythonu nad hodnotou v>
je() {
  local popis=$1 cesta=$2 podminka=$3 hodnota
  if ! hodnota=$(openclaw config get "$cesta" --json 2>/dev/null); then
    pozor "$popis: $cesta není nastavené"
    return
  fi
  if HODNOTA="$hodnota" python3 -c "import json, os, sys
v = json.loads(os.environ['HODNOTA'])
sys.exit(0 if ($podminka) else 1)" 2>/dev/null; then
    ok "$popis"
  else
    pozor "$popis: $cesta = $(printf '%s' "$hodnota" | tr -d '\n' | cut -c1-100)"
  fi
}

echo "== Nastavení OpenClaw"
if openclaw config validate --json >/dev/null 2>&1; then ok "nastavení je platné"; else pozor "nastavení neprošlo kontrolou (openclaw config validate)"; fi
je "brána poslouchá jen v notebooku" gateway.bind 'v == "loopback"'
case "$(openclaw config get gateway.tailscale.mode --json 2>/dev/null | tr -d '"')" in
  funnel) pozor "brána je přes Tailscale Funnel dostupná z veřejného internetu (nastav serve)" ;;
  serve) ok "vzdálený přístup jen přes soukromou síť Tailscale" ;;
  *) ok "brána je dostupná jen v notebooku (Tailscale zatím vypnutý)" ;;
esac
je "zakázaný web, prohlížeč, telefon, zprávy a samoučení" tools.deny \
  'all(x in v for x in ["group:web", "group:ui", "group:nodes", "group:messaging", "skill_workshop"])'
je "soubory jen ve složce Mozek" tools.fs.workspaceOnly 'v is True'
je "příkazy jen ze seznamu, ostatní ke schválení" tools.exec.mode 'v in ("ask", "allowlist", "deny")'
je "zvýšená oprávnění vypnutá" tools.elevated.enabled 'v is False'
je "hledání v paměti lokálně, bez záložní cloudové služby" memory.search \
  'v.get("provider") in ("ollama", "local") and v.get("fallback") == "none"'
je "hlasové odpovědi bez cloudu" tts \
  'v.get("auto") == "off" and v.get("providers", {}).get("microsoft", {}).get("enabled") is False'
je "ovládání prohlížeče vypnuté" browser.enabled 'v is False'
je "telemetrie vypnutá" telemetry.enabled 'v is False'
je "bez automatických dotazů na aktualizace" update.checkOnStart 'v is False'

if kanaly=$(openclaw config get channels --json 2>/dev/null); then
  KANALY="$kanaly" python3 -c "import json, os
v = json.loads(os.environ['KANALY']) or {}
for name in v:
    print(name)" | while read -r kanal; do
    case "$kanal" in
      signal) ok "kanál signal (šifrovaný end-to-end)" ;;
      *) printf 'POZOR   kanál %s: zprávy jdou přes servery provozovatele\n' "$kanal" ;;
    esac
  done
else
  ok "žádný další kanál (komunikace jen přes aplikaci)"
fi

echo "== Povolené příkazy"
if schvaleni=$(openclaw approvals get --json 2>/dev/null); then
  SCHVALENI="$schvaleni" python3 - <<'PY'
import json, os
d = json.loads(os.environ["SCHVALENI"])
f = d.get("file", {})
defaults = f.get("defaults", {})
def line(ok, text):
    print(("OK      " if ok else "POZOR   ") + text)
line(defaults.get("security") == "allowlist", f"jen seznam povolených příkazů (security = {defaults.get('security')})")
line(defaults.get("ask") in ("on-miss", "always"), f"ostatní příkazy čekají na schválení (ask = {defaults.get('ask')})")
line(defaults.get("askFallback", "deny") == "deny", f"bez odpovědi se příkaz zamítne (askFallback = {defaults.get('askFallback', 'deny')})")
risky = ("bash", "sh", "zsh", "python", "python3", "node", "curl", "wget", "nc", "ssh", "scp", "rsync")
for agent, cfg in (f.get("agents") or {}).items():
    for entry in cfg.get("allowlist", []):
        pattern = entry.get("pattern", "")
        name = pattern.rsplit("/", 1)[-1]
        if name in ("agent-resers", "agent-mail") and not entry.get("argPattern"):
            line(False, f"{pattern} je povolený se všemi argumenty, odeslání by nešlo schvalovat")
        if name in risky or pattern in ("*", "**"):
            line(False, f"{pattern} umí spustit cokoli nebo poslat data ven, z povolených ho vyřaď")
PY
else
  nevim "seznam povolených příkazů (openclaw approvals get)"
fi

echo "== Bezpečnostní audit OpenClaw"
if audit=$(openclaw security audit --json 2>/dev/null); then
  AUDIT="$audit" python3 - <<'PY'
import json, os
d = json.loads(os.environ["AUDIT"])
expected = {"gateway.trusted_proxies_missing", "gateway.tailscale_serve", "summary.attack_surface"}
found = False
for f in d.get("findings", []):
    sev, check = f.get("severity"), f.get("checkId")
    if sev in ("critical", "warn") and check not in expected:
        found = True
        print(f"POZOR   audit {sev}: {check} – {(f.get('detail') or '')[:120]}")
if not found:
    print("OK      audit bez kritických a neočekávaných nálezů")
PY
else
  nevim "audit (openclaw security audit)"
fi

# Příkaz ve Windows, spuštěný z WSL. Vrací výstup bez znaků konce řádku z Windows.
win() { powershell.exe -NoProfile -NonInteractive -Command "$1" 2>/dev/null | tr -d '\r'; }

echo "== Windows"
if command -v powershell.exe >/dev/null; then
  if [[ "$(win "[Environment]::GetEnvironmentVariable('OLLAMA_NO_CLOUD','User')")" == "1" ]]; then
    ok "Ollama bez cloudových modelů"
  else
    pozor "Ollama nemá OLLAMA_NO_CLOUD=1 (krok 4, pak Ollamu restartuj)"
  fi
  adresy=$(win "Get-NetTCPConnection -State Listen -LocalPort 11434 -ErrorAction SilentlyContinue | ForEach-Object LocalAddress")
  if [[ -z "$adresy" ]]; then
    nevim "Ollama zrovna neběží, port 11434 jsem nemohl ověřit"
  elif echo "$adresy" | grep -qvE '^(127\.0\.0\.1|::1)$'; then
    pozor "Ollama je dostupná i ze sítě: $(echo "$adresy" | tr '\n' ' ')(nenastavuj OLLAMA_HOST)"
  else
    ok "Ollama poslouchá jen v notebooku"
  fi
  if schtasks.exe /Query /TN "WSL Boot" >/dev/null 2>&1; then
    ok "WSL se spouští samo po startu Windows (úloha WSL Boot)"
  else
    pozor "chybí naplánovaná úloha WSL Boot, agent po restartu nepoběží (krok 6b)"
  fi
else
  nevim "Windows stranu (z WSL nejde spustit powershell.exe)"
fi
nevim "šifrování disku ověř ručně: Nastavení → Ochrana osobních údajů a zabezpečení → Šifrování zařízení"

echo "== Ubuntu ve WSL"
if [[ "$(ps -p 1 -o comm= 2>/dev/null)" == "systemd" ]]; then ok "systemd běží"; else pozor "WSL běží bez systemd (krok 6b)"; fi
if [[ "$(loginctl show-user "$(id -un)" -p Linger --value 2>/dev/null)" == "yes" ]]; then
  ok "služby běží i bez otevřeného terminálu (linger)"
else
  pozor "chybí loginctl enable-linger (krok 6b)"
fi
if [[ "$(systemctl --user is-enabled openclaw-gateway.service 2>/dev/null)" == "enabled" ]]; then
  ok "brána OpenClaw se spouští automaticky"
else
  pozor "brána OpenClaw není nainstalovaná jako služba (openclaw gateway install)"
fi

if command -v ss >/dev/null; then
  verejne=$(ss -ltnH 2>/dev/null | awk '{print $4}' | grep -E ':18789$' \
    | grep -vE '^(127\.0\.0\.1|\[::1\]|100\.(6[4-9]|[7-9][0-9]|1[01][0-9]|12[0-7])\.[0-9]+\.[0-9]+|\[fd7a:115c:a1e0:[0-9a-f:]*\]):' || true)
  if [[ -z "$verejne" ]]; then
    ok "brána není dostupná z místní sítě ani z internetu"
  else
    pozor "brána naslouchá mimo notebook a Tailscale: $(echo "$verejne" | tr '\n' ' ')"
  fi
else
  nevim "otevřené porty (chybí příkaz ss)"
fi

workspace=$(openclaw config get agents.defaults.workspace --json 2>/dev/null | tr -d '"' || true)
if [[ -n "$workspace" && -f "$workspace/AGENTS.md" ]]; then
  for soubor in AGENTS.md SOUL.md HEARTBEAT.md; do
    if [[ ! -f "$workspace/$soubor" ]]; then
      pozor "$soubor chybí ve složce $workspace"
    elif [[ -w "$workspace/$soubor" ]]; then
      pozor "$soubor jde přepsat, zamkni ho (krok 6b)"
    else
      ok "$soubor zamčený proti přepsání"
    fi
  done
else
  nevim "zámek pravidel (nenašel jsem AGENTS.md ve složce agenta)"
fi

if [[ -n "$workspace" ]]; then
  cloud='onedrive|dropbox|icloud|google ?drive'
  shopt -s nocasematch
  if [[ "$workspace" =~ $cloud ]]; then
    pozor "složka agenta je ve složce, která se nahrává do cloudu ($workspace), přesuň ji do C:\\Users\\<jméno>\\Mozek (krok 5)"
  else
    ok "složka agenta se nenahrává do OneDrivu ani jiného cloudu"
  fi
  shopt -u nocasematch
fi

if [[ "$(openclaw config get gateway.tailscale.mode --json 2>/dev/null | tr -d '"')" == "serve" ]]; then
  if command -v tailscale >/dev/null && tailscale status >/dev/null 2>&1; then
    ok "Tailscale běží"
  else
    pozor "Tailscale neběží nebo není přihlášený, iPhone se nepřipojí (krok 12)"
  fi
fi

echo
if [[ $POCET -eq 0 ]]; then
  echo "Hotovo: žádný nález POZOR."
else
  echo "Hotovo: $POCET× POZOR. Oprav je podle NAVOD.md (kroky 6b a 12)."
fi
[[ $POCET -eq 0 ]]
