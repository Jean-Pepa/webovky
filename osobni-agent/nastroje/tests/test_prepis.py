"""Testy pro prepis.py: stažený model se načte bez internetu (bez skutečného modelu)."""

import importlib.util
import io
import sys
import tempfile
import types
import unittest
from contextlib import redirect_stdout
from pathlib import Path
from unittest import mock

HERE = Path(__file__).resolve().parent


def load_module():
    spec = importlib.util.spec_from_file_location("prepis", HERE.parent / "prepis.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


class FakeModel:
    calls: list[bool] = []
    cached = True

    def __init__(self, name, device, compute_type, local_files_only=False):
        FakeModel.calls.append(local_files_only)
        if local_files_only and not FakeModel.cached:
            raise FileNotFoundError("Cannot find an appropriate cached snapshot folder")

    def transcribe(self, path, **kwargs):
        return [types.SimpleNamespace(text=" Dobrý den.")], None


class PrepisTests(unittest.TestCase):
    def run_prepis(self, cached):
        FakeModel.calls, FakeModel.cached = [], cached
        fake = types.ModuleType("faster_whisper")
        fake.WhisperModel = FakeModel
        with tempfile.TemporaryDirectory() as tmp, mock.patch.dict(sys.modules, {"faster_whisper": fake}):
            audio = Path(tmp) / "poznamka.m4a"
            audio.write_bytes(b"fake")
            out = io.StringIO()
            with redirect_stdout(out):
                code = load_module().main([str(audio)])
        return code, out.getvalue().strip(), FakeModel.calls

    def test_cached_model_loads_without_internet(self):
        self.assertEqual(self.run_prepis(cached=True), (0, "Dobrý den.", [True]))

    def test_first_run_downloads_model(self):
        self.assertEqual(self.run_prepis(cached=False), (0, "Dobrý den.", [True, False]))


if __name__ == "__main__":
    unittest.main()
