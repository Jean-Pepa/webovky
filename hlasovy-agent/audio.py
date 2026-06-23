"""Nahrávání z mikrofonu – jednoduché 'stiskni Enter pro konec'."""
import numpy as np
import sounddevice as sd


class Recorder:
    """Nahrává zvuk z mikrofonu do paměti, dokud ho nezastavíš."""

    def __init__(self, samplerate: int = 16000, channels: int = 1) -> None:
        self.samplerate = samplerate
        self.channels = channels
        self._frames: list[np.ndarray] = []
        self._stream: sd.InputStream | None = None

    def _callback(self, indata, frames, time, status):  # noqa: ANN001
        if status:
            # přetečení/podtečení bufferu jen zalogujeme, nahrávání běží dál
            print(f"   (audio: {status})")
        self._frames.append(indata.copy())

    def start(self) -> None:
        self._frames = []
        self._stream = sd.InputStream(
            samplerate=self.samplerate,
            channels=self.channels,
            dtype="float32",
            callback=self._callback,
        )
        self._stream.start()

    def stop(self) -> np.ndarray:
        """Zastaví nahrávání a vrátí audio jako 1-D float32 pole."""
        if self._stream is not None:
            self._stream.stop()
            self._stream.close()
            self._stream = None
        if not self._frames:
            return np.zeros(0, dtype=np.float32)
        return np.concatenate(self._frames, axis=0).flatten().astype(np.float32)
