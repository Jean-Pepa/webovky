"""Přepis řeči na text pomocí lokálního Whisperu (faster-whisper)."""
import numpy as np
from faster_whisper import WhisperModel


class Transcriber:
    def __init__(
        self,
        model_size: str = "small",
        device: str = "auto",
        compute_type: str = "int8",
        language: str = "cs",
    ) -> None:
        # Model se při prvním spuštění stáhne a uloží do cache.
        self.model = WhisperModel(model_size, device=device, compute_type=compute_type)
        self.language = language

    def transcribe(self, audio: np.ndarray) -> str:
        if audio.size == 0:
            return ""
        segments, _info = self.model.transcribe(
            audio,
            language=self.language,
            beam_size=5,
            vad_filter=True,  # odfiltruje ticho na začátku/konci
        )
        return " ".join(seg.text.strip() for seg in segments).strip()
