#!/usr/bin/env python3
"""Přepis hlasové poznámky do textu, lokálně přes faster-whisper. Nic neposílá ven.

    agent-prepis nahravka.m4a          přepis na procesoru (výchozí, nezabírá grafiku)
    agent-prepis nahravka.m4a --gpu    přepis na grafice (rychlejší, když neběží velký model)

Model jde změnit proměnnou AGENT_WHISPER_MODEL (výchozí large-v3-turbo).
Při prvním spuštění se model jednou stáhne (asi 1,6 GB), pak už běží bez internetu.
"""

from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path

MODEL = os.environ.get("AGENT_WHISPER_MODEL", "large-v3-turbo")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="agent-prepis", description="Lokální přepis hlasové poznámky.")
    parser.add_argument("soubor", type=Path)
    parser.add_argument("--gpu", action="store_true", help="počítat na grafice (CUDA)")
    parser.add_argument("--jazyk", default="cs")
    args = parser.parse_args(argv)

    if not args.soubor.exists():
        print(f"Chyba: soubor {args.soubor} neexistuje.", file=sys.stderr)
        return 2
    try:
        from faster_whisper import WhisperModel
    except ImportError:
        print("Chyba: chybí faster-whisper. Spusť instalaci s volbou --whisper (NAVOD.md, krok 9).", file=sys.stderr)
        return 2

    if args.gpu:
        model = WhisperModel(MODEL, device="cuda", compute_type="float16")
    else:
        model = WhisperModel(MODEL, device="cpu", compute_type="int8")
    segments, _info = model.transcribe(str(args.soubor), language=args.jazyk, vad_filter=True, beam_size=5)
    print(" ".join(segment.text.strip() for segment in segments).strip())
    return 0


if __name__ == "__main__":
    sys.exit(main())
