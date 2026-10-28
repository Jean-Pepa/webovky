"""Testy pro jednani.py: párování slov s mluvčími a výstup (bez modelů)."""

import importlib.util
import io
import json
import os
import sys
import tempfile
import unittest
from contextlib import redirect_stderr, redirect_stdout
from pathlib import Path
from unittest import mock

HERE = Path(__file__).resolve().parent


def load_module():
    spec = importlib.util.spec_from_file_location("jednani", HERE.parent / "jednani.py")
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module  # dataclasses potřebují modul v sys.modules
    spec.loader.exec_module(module)
    return module


class MergeTests(unittest.TestCase):
    def setUp(self):
        self.j = load_module()
        W, T = self.j.Word, self.j.Turn
        self.words = [
            W(0.0, 0.4, " Dobrý"), W(0.4, 0.8, " den,"), W(0.9, 1.3, " začneme"), W(1.3, 1.8, " pozemkem."),
            W(2.5, 2.9, " Souhlasím,"), W(3.0, 3.4, " parcela"), W(3.4, 3.9, " je"), W(3.9, 4.3, " svažitá."),
            W(7.0, 7.4, " Takže"), W(7.4, 7.9, " sedlová"), W(7.9, 8.3, " střecha."),
        ]
        self.turns = [T(0.0, 2.0, "SPEAKER_00"), T(2.4, 4.5, "SPEAKER_01"), T(6.9, 8.5, "SPEAKER_00")]
        state = tempfile.TemporaryDirectory()
        self.addCleanup(state.cleanup)
        self.j.STATE_DIR = Path(state.name)
        self.j.MODELS_MARK = Path(state.name) / "jednani-modely.txt"
        env = mock.patch.dict(os.environ)
        env.start()
        self.addCleanup(env.stop)
        os.environ.pop("HF_HUB_OFFLINE", None)

    def run_main(self, transcribe):
        with tempfile.TemporaryDirectory() as tmp:
            audio = Path(tmp) / "porada.m4a"
            audio.write_bytes(b"fake")
            with mock.patch.object(self.j, "load_audio", return_value="zvuk"), \
                 mock.patch.object(self.j, "transcribe", side_effect=transcribe), \
                 mock.patch.object(self.j, "diarize", return_value=self.turns), \
                 mock.patch.object(self.j, "_gpu_available", return_value=False):
                return self.j.main([str(audio)])

    def test_merge_by_speaker_and_pause(self):
        utts = self.j.merge(self.words, self.turns)
        self.assertEqual([u.speaker for u in utts], ["SPEAKER_00", "SPEAKER_01", "SPEAKER_00"])
        self.assertEqual(utts[0].text, "Dobrý den, začneme pozemkem.")
        self.assertEqual(utts[1].text, "Souhlasím, parcela je svažitá.")
        self.assertAlmostEqual(utts[2].start, 7.0)

    def test_long_pause_splits_same_speaker(self):
        T = self.j.Turn
        turns = [T(0.0, 20.0, "SPEAKER_00")]
        W = self.j.Word
        words = [W(0.0, 0.5, " Jedna"), W(5.0, 5.5, " Dva")]
        self.assertEqual(len(self.j.merge(words, turns)), 2)

    def test_word_outside_turns(self):
        W, T = self.j.Word, self.j.Turn
        self.assertEqual(self.j.speaker_for(W(10.0, 10.2, " x"), [T(10.5, 12.0, "SPEAKER_03")]), "SPEAKER_03")
        self.assertEqual(self.j.speaker_for(W(30.0, 30.2, " x"), [T(10.5, 12.0, "SPEAKER_03")]), self.j.UNKNOWN)

    def test_labels_and_names(self):
        utts = self.j.merge(self.words, self.turns)
        self.assertEqual(self.j.labels(utts, {}), {"SPEAKER_00": "Mluvčí 1", "SPEAKER_01": "Mluvčí 2"})
        names = self.j.parse_names("SPEAKER_01 = Jana, chyba, SPEAKER_00=Petr")
        self.assertEqual(self.j.labels(utts, names), {"SPEAKER_00": "Petr", "SPEAKER_01": "Jana"})

    def test_markdown(self):
        utts = self.j.merge(self.words, self.turns)
        md = self.j.to_markdown(Path("jednani.m4a"), utts, {"SPEAKER_00": "Petr"}, 3725)
        self.assertIn("Délka nahrávky: 01:02:05", md)
        self.assertIn("**[00:00:00] Petr:** Dobrý den, začneme pozemkem.", md)
        self.assertIn("**[00:00:02] Mluvčí 2:** Souhlasím, parcela je svažitá.", md)
        self.assertIn("SPEAKER_01", md)  # ukázka pro určení, kdo je kdo

    def test_main_with_mocked_models(self):
        with tempfile.TemporaryDirectory() as tmp:
            audio = Path(tmp) / "porada.m4a"
            audio.write_bytes(b"fake")
            with mock.patch.object(self.j, "load_audio", return_value="zvuk"), \
                 mock.patch.object(self.j, "transcribe", return_value=(self.words, 9.0)), \
                 mock.patch.object(self.j, "diarize", return_value=self.turns), \
                 mock.patch.object(self.j, "_gpu_available", return_value=False):
                code = self.j.main([str(audio), "--jmena", "SPEAKER_00=Petr"])
            self.assertEqual(code, 0)
            data = json.loads((Path(tmp) / "porada.prepis.json").read_text())
            self.assertEqual(data["jmena"]["SPEAKER_00"], "Petr")
            self.assertEqual(len(data["repliky"]), 3)
            self.assertTrue((Path(tmp) / "porada.prepis.md").exists())

    def test_names_added_without_new_processing(self):
        with tempfile.TemporaryDirectory() as tmp:
            audio = Path(tmp) / "porada.m4a"
            audio.write_bytes(b"fake")
            with mock.patch.object(self.j, "load_audio", return_value="zvuk"), \
                 mock.patch.object(self.j, "transcribe", return_value=(self.words, 9.0)), \
                 mock.patch.object(self.j, "diarize", return_value=self.turns), \
                 mock.patch.object(self.j, "_gpu_available", return_value=False), \
                 redirect_stderr(io.StringIO()), redirect_stdout(io.StringIO()):
                self.assertEqual(self.j.main([str(audio)]), 0)
            with mock.patch.object(self.j, "transcribe", side_effect=AssertionError("znovu přepisuje")), \
                 redirect_stdout(io.StringIO()):
                self.assertEqual(self.j.main([str(audio), "--jmena", "SPEAKER_01=Jana"]), 0)
            md = (Path(tmp) / "porada.prepis.md").read_text()
            self.assertIn("**[00:00:02] Jana:** Souhlasím, parcela je svažitá.", md)
            self.assertIn("**[00:00:00] Mluvčí 1:** Dobrý den, začneme pozemkem.", md)

    def test_gpu_out_of_memory_falls_back_to_cpu(self):
        calls = []

        def stage(path, use_gpu):
            calls.append(use_gpu)
            if use_gpu:
                raise RuntimeError("CUDA failed: out of memory")
            return "ok"

        self.assertEqual(self.j._run_stage("test", stage, Path("x"), True), "ok")
        self.assertEqual(calls, [True, False])

    def test_after_first_download_runs_offline(self):
        seen = []

        def transcribe(path, use_gpu):
            seen.append(os.environ.get("HF_HUB_OFFLINE"))
            return self.words, 9.0

        with redirect_stderr(io.StringIO()):
            self.assertEqual(self.run_main(transcribe), 0)
            self.assertTrue(self.j.MODELS_MARK.exists())
            self.assertEqual(self.run_main(transcribe), 0)
        self.assertEqual(seen, [None, "1"])

    def test_missing_cached_model_is_downloaded_next_time(self):
        class LocalEntryNotFoundError(FileNotFoundError):
            pass

        def transcribe(path, use_gpu):
            raise LocalEntryNotFoundError("outgoing traffic has been disabled")

        self.j.MODELS_MARK.write_text(f"{self.j.WHISPER_MODEL}\n{self.j.DIARIZATION_MODEL}\n")
        err = io.StringIO()
        with redirect_stderr(err):
            self.assertEqual(self.run_main(transcribe), 2)
        self.assertFalse(self.j.MODELS_MARK.exists())
        self.assertIn("s internetem", err.getvalue())

    def test_missing_file(self):
        self.assertEqual(self.j.main(["/neexistuje.m4a"]), 2)


if __name__ == "__main__":
    unittest.main()
