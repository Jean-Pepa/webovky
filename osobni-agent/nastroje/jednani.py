#!/usr/bin/env python3
"""Přepis jednání s rozlišením mluvčích, celé lokálně.

    agent-jednani nahravka.m4a                      přepis a rozlišení mluvčích
    agent-jednani nahravka.m4a --mluvcich 3         když víš, kolik lidí mluvilo
    agent-jednani nahravka.m4a --jmena "SPEAKER_00=Petr, SPEAKER_01=Jana"
                                                    doplní jména do hotového přepisu
    agent-jednani nahravka.m4a --cpu                bez grafiky (pomalejší)

Výstup vznikne vedle nahrávky: `nahravka.prepis.md` (čitelný přepis) a `nahravka.prepis.json`
(pro agenta). Hlasy se nikam neukládají ani neodesílají a nevytváří se žádné hlasové otisky:
mluvčí jsou jen SPEAKER_00, SPEAKER_01… a kdo je kdo, určíš ty podle ukázek v přepisu.

Model pro rozlišení mluvčích (pyannote community-1) se při prvním spuštění jednou stáhne
s tokenem z ~/.config/agent/huggingface.env (HF_TOKEN=...). Po prvním úspěšném běhu skript
pracuje bez internetu a na Hugging Face se neptá ani na aktualizace.
"""

from __future__ import annotations

import argparse
import gc
import json
import os
import sys
import time
import warnings
from dataclasses import asdict, dataclass
from pathlib import Path

# Telemetrie pyannote je vypnutá, ať nic neodchází ven.
os.environ.setdefault("PYANNOTE_METRICS_ENABLED", "0")

CONFIG_DIR = Path(os.environ.get("AGENT_CONFIG_DIR", Path.home() / ".config/agent"))
STATE_DIR = Path(os.environ.get("AGENT_STATE_DIR", Path.home() / ".local/state/agent"))
MODELS_MARK = STATE_DIR / "jednani-modely.txt"  # modely jsou stažené, další běhy bez internetu
WHISPER_MODEL = os.environ.get("AGENT_WHISPER_MODEL", "large-v3-turbo")
DIARIZATION_MODEL = "pyannote/speaker-diarization-community-1"
SAMPLE_RATE = 16000  # oba modely pracují s 16 kHz mono
PAUSE_SPLIT = 1.5  # delší pauza než tohle začne novou repliku i u stejného mluvčího
UNKNOWN = "NEZNAMY"


class MeetingError(Exception):
    """Chyba, kterou umíme uživateli srozumitelně vysvětlit."""


@dataclass
class Word:
    start: float
    end: float
    text: str


@dataclass
class Turn:
    start: float
    end: float
    speaker: str


@dataclass
class Utterance:
    start: float
    end: float
    speaker: str
    text: str


def speaker_for(word: Word, turns: list[Turn]) -> str:
    """Mluvčí s největším časovým překryvem se slovem; jinak nejbližší do 1 s."""
    best, best_overlap = None, 0.0
    for turn in turns:
        overlap = min(word.end, turn.end) - max(word.start, turn.start)
        if overlap > best_overlap:
            best, best_overlap = turn.speaker, overlap
    if best is not None:
        return best
    middle = (word.start + word.end) / 2
    nearest, distance = None, 1.0
    for turn in turns:
        gap = min(abs(middle - turn.start), abs(middle - turn.end))
        if gap <= distance:
            nearest, distance = turn.speaker, gap
    return nearest or UNKNOWN


def merge(words: list[Word], turns: list[Turn], pause: float = PAUSE_SPLIT) -> list[Utterance]:
    """Složí slova do replik podle mluvčích a pauz."""
    utterances: list[Utterance] = []
    for word in words:
        speaker = speaker_for(word, turns)
        last = utterances[-1] if utterances else None
        if last and last.speaker == speaker and word.start - last.end <= pause:
            last.text += word.text
            last.end = word.end
        else:
            utterances.append(Utterance(word.start, word.end, speaker, word.text))
    for utterance in utterances:
        utterance.text = " ".join(utterance.text.split())
    return [u for u in utterances if u.text]


def parse_names(value: str | None) -> dict[str, str]:
    names: dict[str, str] = {}
    for part in (value or "").split(","):
        if "=" in part:
            key, name = part.split("=", 1)
            if key.strip() and name.strip():
                names[key.strip()] = name.strip()
    return names


def labels(utterances: list[Utterance], names: dict[str, str]) -> dict[str, str]:
    """SPEAKER_xx → jméno, jinak „Mluvčí 1, 2…" v pořadí, jak se poprvé ozvali."""
    result: dict[str, str] = {}
    for utterance in utterances:
        if utterance.speaker in result:
            continue
        if utterance.speaker in names:
            result[utterance.speaker] = names[utterance.speaker]
        elif utterance.speaker == UNKNOWN:
            result[utterance.speaker] = "Nerozpoznáno"
        else:
            result[utterance.speaker] = f"Mluvčí {sum(1 for k in result if k != UNKNOWN) + 1}"
    return result


def timestamp(seconds: float) -> str:
    seconds = int(seconds)
    return f"{seconds // 3600:02d}:{seconds % 3600 // 60:02d}:{seconds % 60:02d}"


def samples(utterances: list[Utterance], per_speaker: int = 2, min_words: int = 5) -> dict[str, list[Utterance]]:
    found: dict[str, list[Utterance]] = {}
    for utterance in utterances:
        bucket = found.setdefault(utterance.speaker, [])
        if len(bucket) < per_speaker and len(utterance.text.split()) >= min_words:
            bucket.append(utterance)
    return found


def to_markdown(source: Path, utterances: list[Utterance], names: dict[str, str], duration: float) -> str:
    label = labels(utterances, names)
    lines = [
        f"# Přepis jednání: {source.name}",
        "",
        f"- Délka nahrávky: {timestamp(duration)}",
        f"- Počet mluvčích: {len([k for k in label if k != UNKNOWN])}",
        f"- Vytvořeno: {time.strftime('%Y-%m-%d %H:%M')}, lokálně (faster-whisper + pyannote)",
        "",
        "## Kdo je kdo",
        "Podle ukázek urči jména a spusť příkaz znovu s `--jmena \"SPEAKER_00=…, SPEAKER_01=…\"`",
        "(jen doplní jména, nahrávka se znovu nezpracovává), nebo je řekni agentovi.",
        "",
    ]
    for speaker, items in samples(utterances).items():
        lines.append(f"- **{speaker}** ({label.get(speaker, speaker)}):")
        lines.extend(f"  - [{timestamp(u.start)}] {u.text[:160]}" for u in items)
    lines += ["", "## Přepis", ""]
    for utterance in utterances:
        lines.append(f"**[{timestamp(utterance.start)}] {label.get(utterance.speaker, utterance.speaker)}:** {utterance.text}")
        lines.append("")
    return "\n".join(lines).rstrip() + "\n"


def _load_token() -> str | None:
    if os.environ.get("HF_TOKEN"):
        return os.environ["HF_TOKEN"]
    path = CONFIG_DIR / "huggingface.env"
    try:
        for line in path.read_text(encoding="utf-8").splitlines():
            if line.strip().startswith("HF_TOKEN="):
                return line.split("=", 1)[1].strip().strip('"').strip("'") or None
    except FileNotFoundError:
        pass
    return None


def _gpu_available() -> bool:
    try:
        import torch
        return torch.cuda.is_available()
    except ImportError:
        return False


def _out_of_memory(exc: Exception) -> bool:
    return "out of memory" in str(exc).lower()


def _missing_model(exc: Exception) -> bool:
    """Model v počítači není a stáhnout se nepodařilo (internet, token, podmínky)."""
    return any(cls.__name__ in {"LocalEntryNotFoundError", "HfHubHTTPError", "OfflineModeIsEnabled"}
               for cls in type(exc).__mro__)


def _models_downloaded() -> bool:
    try:
        return MODELS_MARK.read_text(encoding="utf-8").split() == [WHISPER_MODEL, DIARIZATION_MODEL]
    except OSError:
        return False


def load_audio(path: Path):
    """Nahrávka jednou dekódovaná pro oba kroky. Dekóduje PyAV z faster-whisper, systémové FFmpeg netřeba."""
    try:
        from faster_whisper import decode_audio
    except ImportError:
        raise MeetingError("Chybí faster-whisper. Spusť instalaci s volbou --jednani (NAVOD.md, krok 16).") from None
    try:
        return decode_audio(str(path), sampling_rate=SAMPLE_RATE)
    except Exception as exc:  # noqa: BLE001 – poškozený nebo nepodporovaný soubor
        raise MeetingError(f"Nahrávku {path.name} se nepodařilo přečíst ({exc}).") from exc


def transcribe(audio, use_gpu: bool) -> tuple[list[Word], float]:
    from faster_whisper import WhisperModel
    if use_gpu:
        model = WhisperModel(WHISPER_MODEL, device="cuda", compute_type="float16")
    else:
        model = WhisperModel(WHISPER_MODEL, device="cpu", compute_type="int8")
    segments, info = model.transcribe(audio, language="cs", vad_filter=True, word_timestamps=True, beam_size=5)
    words = [Word(w.start, w.end, w.word) for segment in segments for w in (segment.words or [])]
    del model
    gc.collect()
    return words, float(info.duration)


def diarize(audio, use_gpu: bool, num: int | None, low: int | None, high: int | None) -> list[Turn]:
    try:
        import torch
        with warnings.catch_warnings():
            # Zvuk dostává pyannote už dekódovaný, jeho vlastní čtení souborů (torchcodec) netřeba.
            warnings.filterwarnings("ignore", message=r"\s*torchcodec")
            from pyannote.audio import Pipeline
    except ImportError:
        raise MeetingError("Chybí pyannote.audio. Spusť instalaci s volbou --jednani (NAVOD.md, krok 16).") from None
    token = _load_token()
    pipeline = Pipeline.from_pretrained(DIARIZATION_MODEL, token=token)
    if pipeline is None:
        raise MeetingError(
            "Model pro rozlišení mluvčích se nenačetl. Přijmi podmínky na "
            "huggingface.co/pyannote/speaker-diarization-community-1 a vlož token do "
            f"{CONFIG_DIR / 'huggingface.env'}."
        )
    if use_gpu:
        pipeline.to(torch.device("cuda"))
    options = {key: value for key, value in
               (("num_speakers", num), ("min_speakers", low), ("max_speakers", high)) if value}
    waveform = torch.from_numpy(audio).unsqueeze(0)  # (kanál, vzorky)
    output = pipeline({"waveform": waveform, "sample_rate": SAMPLE_RATE}, **options)
    # Varianta bez překryvů se lépe páruje s časy slov z přepisu.
    annotation = getattr(output, "exclusive_speaker_diarization", None) or output.speaker_diarization
    turns = [Turn(float(turn.start), float(turn.end), str(speaker)) for turn, speaker in annotation]
    del pipeline
    gc.collect()
    if use_gpu:
        torch.cuda.empty_cache()
    return turns


def _run_stage(name: str, function, audio, use_gpu: bool, *extra):
    print(f"→ {name} ({'grafika' if use_gpu else 'procesor'})…", file=sys.stderr)
    try:
        return function(audio, use_gpu, *extra)
    except MeetingError:
        raise
    except Exception as exc:  # noqa: BLE001 – při nedostatku paměti grafiky zkusíme procesor
        if use_gpu and _out_of_memory(exc):
            print("  Grafika nemá dost paměti (běží velký model?), zkouším procesor.", file=sys.stderr)
            return function(audio, False, *extra)
        raise


def _process(args) -> tuple[list[Utterance], float] | None:
    """Přepis a rozlišení mluvčích. Při chybě vypíše vysvětlení a vrátí None."""
    offline = _models_downloaded()
    if offline:
        # Modely jsou stažené: na Hugging Face se neptáme ani na aktualizace.
        os.environ["HF_HUB_OFFLINE"] = "1"
    use_gpu = not args.cpu and _gpu_available()
    try:
        audio = load_audio(args.nahravka)
        words, duration = _run_stage("Přepis řeči", transcribe, audio, use_gpu)
        turns = _run_stage("Rozlišení mluvčích", diarize, audio, use_gpu,
                           args.mluvcich, args.nejmene, args.nejvice)
    except MeetingError as exc:
        print(f"Chyba: {exc}", file=sys.stderr)
        return None
    except Exception as exc:
        if not _missing_model(exc):
            raise
        MODELS_MARK.unlink(missing_ok=True)
        if offline:
            print("Chyba: stažený model se v počítači nenašel. Spusť příkaz znovu s internetem, "
                  "model se stáhne znovu.", file=sys.stderr)
        else:
            print(f"Chyba: model se nepodařilo stáhnout ({type(exc).__name__}). Zkontroluj internet, "
                  f"token v {CONFIG_DIR / 'huggingface.env'} a přijetí podmínek na "
                  f"huggingface.co/{DIARIZATION_MODEL} (NAVOD.md, krok 16).", file=sys.stderr)
        return None
    if not offline:
        STATE_DIR.mkdir(parents=True, exist_ok=True, mode=0o700)
        MODELS_MARK.write_text(f"{WHISPER_MODEL}\n{DIARIZATION_MODEL}\n", encoding="utf-8")
    return merge(words, turns), duration


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="agent-jednani", description="Lokální přepis jednání s rozlišením mluvčích.")
    parser.add_argument("nahravka", type=Path)
    parser.add_argument("--mluvcich", type=int, help="přesný počet mluvčích, když ho víš")
    parser.add_argument("--min", type=int, dest="nejmene", help="nejméně mluvčích")
    parser.add_argument("--max", type=int, dest="nejvice", help="nejvíc mluvčích")
    parser.add_argument("--jmena", help='mapování, např. "SPEAKER_00=Petr, SPEAKER_01=Jana"')
    parser.add_argument("--cpu", action="store_true", help="nepoužívat grafiku")
    args = parser.parse_args(argv)

    if not args.nahravka.exists():
        print(f"Chyba: soubor {args.nahravka} neexistuje.", file=sys.stderr)
        return 2
    base = args.nahravka.with_suffix("")
    md_path = Path(f"{base}.prepis.md")
    json_path = Path(f"{base}.prepis.json")
    names = parse_names(args.jmena)
    if names and json_path.exists():
        # Přepis je hotový, jen se doplní jména. Nahrávka se znovu nezpracovává.
        data = json.loads(json_path.read_text(encoding="utf-8"))
        utterances = [Utterance(**item) for item in data["repliky"]]
        duration = float(data["delka_s"])
    else:
        result = _process(args)
        if result is None:
            return 2
        utterances, duration = result

    md_path.write_text(to_markdown(args.nahravka, utterances, names, duration), encoding="utf-8")
    json_path.write_text(json.dumps({
        "nahravka": args.nahravka.name,
        "delka_s": round(duration, 1),
        "jmena": labels(utterances, names),
        "repliky": [asdict(u) for u in utterances],
    }, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({"prepis": str(md_path), "data": str(json_path), "replik": len(utterances),
                      "mluvcich": len({u.speaker for u in utterances if u.speaker != UNKNOWN})},
                     ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
