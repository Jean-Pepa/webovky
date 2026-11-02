"""Společné cesty nástrojů osobního agenta.

Cesty se berou z domovské složky podle systému (databáze uživatelů), ne z proměnných
prostředí. OpenClaw dovoluje agentovi přidat k příkazu vlastní proměnné prostředí. Kdyby
nástroje četly nastavení z proměnných, agent by jim mohl podstrčit jiný seznam složek,
jiné přihlášení nebo jiný server, a obejít tak zámky.
"""

import os
import pwd
from pathlib import Path

DOMOV = Path(pwd.getpwuid(os.getuid()).pw_dir)
CONFIG_DIR = DOMOV / ".config" / "agent"        # přihlášení a nastavení, práva 600
STATE_DIR = DOMOV / ".local" / "state" / "agent"  # stav a záznamy, agent sem nevidí
MOZEK = DOMOV / "Mozek"                          # složka agenta
UNITS_DIR = DOMOV / ".config" / "systemd" / "user"
OLLAMA_URL = "http://127.0.0.1:11434"            # lokální model, nikdy jiný počítač

# Proměnné, kterými by šlo knihovnám pro přepis podstrčit jiný server nebo jinou složku
# s modely (model ve formátu pickle může při načtení spustit kód).
MODEL_ENV_PREFIXES = ("HF_", "HUGGINGFACE_", "TRANSFORMERS_", "TORCH_", "PYANNOTE_", "CT2_", "SPEECHBRAIN_")


def clean_model_env() -> None:
    """Smaže proměnné knihoven Hugging Face, PyTorch a pyannote zděděné od agenta."""
    for key in list(os.environ):
        if key.upper().startswith(MODEL_ENV_PREFIXES):
            del os.environ[key]
    os.environ["PYANNOTE_METRICS_ENABLED"] = "0"  # bez telemetrie
