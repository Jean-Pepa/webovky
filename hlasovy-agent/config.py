"""Načtení a centralizace konfigurace z .env."""
import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()


SYSTEM_PROMPT = (
    "Jsi zkušený programátorský asistent, který pracuje přímo na počítači "
    "uživatele. Komunikuješ v češtině. Uživatel s tebou mluví hlasem, takže "
    "v zadání mohou být překlepy z přepisu řeči – snaž se pochopit záměr. "
    "Pracuješ na reálných projektech: čteš a upravuješ soubory a spouštíš "
    "příkazy v terminálu. Před většími zásahy krátce shrň plán. Odpovídej "
    "stručně a věcně, protože odpovědi se zobrazují v terminálu."
)


class Config:
    def __init__(self) -> None:
        self.api_key: str | None = os.environ.get("ANTHROPIC_API_KEY")

        self.model: str = os.environ.get("AGENT_MODEL", "claude-sonnet-4-6")

        project_dir = os.environ.get("PROJECT_DIR", "").strip()
        self.project_dir: Path = Path(project_dir) if project_dir else Path.cwd()

        self.whisper_model: str = os.environ.get("WHISPER_MODEL", "small")
        self.whisper_device: str = os.environ.get("WHISPER_DEVICE", "auto")
        self.whisper_compute: str = os.environ.get("WHISPER_COMPUTE", "int8")
        self.language: str = os.environ.get("STT_LANGUAGE", "cs")

        self.log_dir: Path = Path(os.environ.get("LOG_DIR", "logs"))
        self.samplerate: int = 16000  # Whisper očekává 16 kHz
        self.system_prompt: str = SYSTEM_PROMPT

    def validate(self) -> None:
        if not self.api_key:
            raise SystemExit(
                "Chybí ANTHROPIC_API_KEY. Zkopíruj env.example na .env a vyplň klíč."
            )
        if not self.project_dir.exists():
            raise SystemExit(
                f"Složka projektu neexistuje: {self.project_dir}\n"
                "Oprav PROJECT_DIR v souboru .env."
            )
