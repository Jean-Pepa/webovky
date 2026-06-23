# Hlasový programátorský agent

Mluvíš na svůj počítač česky, řeč se lokálně přepíše (Whisper) a pošle do
Clauda postaveného na **Claude Agent SDK**. Agent čte a upravuje soubory,
spouští příkazy a pracuje na tvých projektech. Každá konverzace se ukládá
do `logs/`.

```
mikrofon ──► Whisper (lokálně) ──► Claude Agent SDK ──► úpravy v projektu
                                          │
                                          └──► log konverzace (Markdown + JSONL)
```

Tohle je **MVP / startovní kostra**. Funguje to, ale je to základ, na kterém
budeme stavět (viz [Další kroky](#další-kroky)).

---

## Co budeš potřebovat

- **Windows** s mikrofonem
- **Python 3.10+** – <https://www.python.org/downloads/> (při instalaci zaškrtni *Add Python to PATH*)
- **Node.js 18+** – <https://nodejs.org/> (Claude Agent SDK pod kapotou používá Claude Code CLI)
- **API klíč** z <https://platform.claude.com/> → *Settings → API Keys*

---

## Instalace (PowerShell)

```powershell
# 1) přejdi do složky agenta
cd hlasovy-agent

# 2) virtuální prostředí
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# 3) python závislosti
pip install -r requirements.txt

# 4) Claude Code CLI (potřebuje Agent SDK)
npm install -g @anthropic-ai/claude-code

# 5) konfigurace
Copy-Item env.example .env
notepad .env       # vyplň ANTHROPIC_API_KEY a PROJECT_DIR
```

> Kdyby `Activate.ps1` skončil chybou o zásadách spouštění skriptů, jednou spusť:
> `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`

---

## Konfigurace (`.env`)

| Proměnná | Význam | Výchozí |
|---|---|---|
| `ANTHROPIC_API_KEY` | API klíč (povinné) | – |
| `AGENT_MODEL` | Model Clauda | `claude-sonnet-4-6` |
| `PROJECT_DIR` | Složka projektu, na které agent pracuje | aktuální složka |
| `WHISPER_MODEL` | `tiny`/`base`/`small`/`medium`/`large-v3` | `small` |
| `WHISPER_DEVICE` | `auto`/`cpu`/`cuda` | `auto` |
| `WHISPER_COMPUTE` | `int8` (CPU) / `float16` (GPU) | `int8` |
| `STT_LANGUAGE` | jazyk přepisu | `cs` |
| `LOG_DIR` | kam ukládat logy | `logs` |

**Tipy:**
- Přesnější čeština → `WHISPER_MODEL=medium` (ideálně `large-v3` s NVIDIA GPU
  a `WHISPER_COMPUTE=float16`).
- Na nejtěžší úlohy přepni `AGENT_MODEL=claude-opus-4-8`.

---

## Spuštění

```powershell
python main.py
```

Ovládání ve smyčce:

| Klávesa | Akce |
|---|---|
| `Enter` | začni mluvit; dalším `Enter` nahrávání ukončíš |
| `t` | napsat zadání ručně (bez mikrofonu) |
| `q` | konec |

Příklad: stiskneš `Enter`, řekneš *„Přidej do README sekci o instalaci“*,
stiskneš `Enter`, agent to udělá a napíše, co změnil.

---

## Bezpečnost

- Agent smí sahat jen do složky `PROJECT_DIR`.
- Úpravy souborů (`Edit`/`Write`) se schvalují automaticky; každý spouštěný
  shell příkaz se vypíše do terminálu (`▶ shell: ...`).
- Zjevně nebezpečné příkazy (mazání, formátování, vypnutí…) jsou blokované
  – viz `DANGEROUS_PATTERNS` v `agent.py`.
- `.env` s klíčem se **necommituje** (je v `.gitignore`).

---

## Struktura

| Soubor | Co dělá |
|---|---|
| `main.py` | hlavní smyčka (mikrofon → přepis → agent → log) |
| `audio.py` | nahrávání z mikrofonu |
| `stt.py` | přepis řeči (faster-whisper) |
| `agent.py` | obal nad Claude Agent SDK + oprávnění |
| `conversation_logger.py` | ukládání konverzací |
| `config.py` | konfigurace z `.env` |

---

## Další kroky

Nápady, kam to posunout (řekni, co chceš jako další):

1. **Hlas zpět (TTS)** – ať ti agent odpovídá nahlas.
2. **Klíčové slovo / push-to-talk** – aktivace klávesovou zkratkou nebo „Hej Claude“ místo Enteru.
3. **Streamovaný přepis** – přepis za běhu (např. Whisper streaming / VAD).
4. **GUI nebo system tray** – místo terminálu malé okno / ikona v liště.
5. **Více projektů** – přepínání mezi projekty hlasem.
6. **Paměť napříč sezeními** – shrnutí předchozích konverzací do kontextu.
