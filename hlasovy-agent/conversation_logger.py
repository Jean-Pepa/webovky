"""Zápis konverzace do souborů – čitelný Markdown + strojový JSONL."""
import json
from datetime import date, datetime
from pathlib import Path


class ConversationLogger:
    def __init__(self, log_dir: Path) -> None:
        log_dir.mkdir(parents=True, exist_ok=True)
        today = date.today().isoformat()
        self.md_path = log_dir / f"{today}.md"
        self.jsonl_path = log_dir / f"{today}.jsonl"

    def log(self, role: str, text: str) -> None:
        now = datetime.now()
        stamp = now.strftime("%H:%M:%S")
        label = {"user": "🧑 Ty", "assistant": "🤖 Claude"}.get(role, role)

        with self.md_path.open("a", encoding="utf-8") as f:
            f.write(f"**[{stamp}] {label}:**\n\n{text}\n\n---\n\n")

        with self.jsonl_path.open("a", encoding="utf-8") as f:
            record = {"time": now.isoformat(), "role": role, "text": text}
            f.write(json.dumps(record, ensure_ascii=False) + "\n")
