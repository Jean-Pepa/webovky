"""Testy pro resers.py: filtr osobních údajů a skládání odpovědi (bez volání API)."""

import importlib.util
import json
import os
import sys
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace as NS
from unittest import mock

HERE = Path(__file__).resolve().parent


def load_module():
    spec = importlib.util.spec_from_file_location("resers", HERE.parent / "resers.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


class RedactTests(unittest.TestCase):
    def setUp(self):
        self.r = load_module()

    def check(self, text, expected, words=()):
        cleaned, _ = self.r.redact(text, list(words))
        self.assertEqual(cleaned, expected)

    def test_email_phone(self):
        self.check("napiš na jan.novak@seznam.cz nebo +420 777 123 456",
                   "napiš na [e-mail] nebo [telefon]")
        self.check("volej 777123456", "volej [telefon]")

    def test_birth_number_and_account(self):
        self.check("RČ 855101/1234", "RČ [číslo účtu]")  # tvar účtu i RČ, hlavně že zmizí
        self.check("RČ 8551011234", "RČ [rodné číslo]")
        self.check("účet 19-2000145399/0800", "účet [číslo účtu]")

    def test_iban_and_card(self):
        self.check("IBAN CZ65 0800 0000 1920 0014 5399", "IBAN [IBAN]")
        self.check("karta 4111 1111 1111 1111", "karta [platební karta]")
        # 16 číslic, které neprojdou Luhnovou kontrolou, kartou nejsou
        self.check("kód 1234 5678 9012 3456", "kód 1234 5678 9012 3456")

    def test_keeps_ordinary_numbers(self):
        self.check("vysavač do 10 000 Kč, rok 2026, 120 m2", "vysavač do 10 000 Kč, rok 2026, 120 m2")
        self.check("IČO 27082440", "IČO 27082440")

    def test_sensitive_words_with_declension(self):
        self.check("dárek pro Petru a Petrovi", "dárek pro [skryto] a [skryto]", words=["Petr"])
        self.check("nová střecha pro Novou", "nová střecha pro [skryto]", words=["Nov"])
        self.check("ulice vinohradská 12", "ulice [skryto] 12", words=["vinohradsk"])


class FlowTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        os.environ["AGENT_STATE_DIR"] = self.tmp.name
        os.environ["AGENT_CONFIG_DIR"] = self.tmp.name
        self.r = load_module()
        key = Path(self.tmp.name) / "anthropic.env"
        key.write_text("ANTHROPIC_API_KEY=sk-test\n")
        key.chmod(0o600)

    def tearDown(self):
        self.tmp.cleanup()
        os.environ.pop("AGENT_STATE_DIR", None)
        os.environ.pop("AGENT_CONFIG_DIR", None)

    def fake_response(self, stop="end_turn"):
        cit = NS(url="https://example.cz/test", title="Test vysavačů", cited_text="...")
        return NS(
            stop_reason=stop,
            model="claude-opus-5-5",
            content=[
                NS(type="server_tool_use"),
                NS(type="web_search_tool_result", content=[NS(url="https://example.cz/test", title="Test vysavačů"),
                                                           NS(url="https://jiny.cz", title="Jiný")]),
                NS(type="text", text="Nejlépe vychází model X", citations=[cit]),
                NS(type="text", text=" (stav 10/2026).", citations=None),
            ],
            usage=NS(input_tokens=1000, output_tokens=200,
                     server_tool_use=NS(web_search_requests=2, web_fetch_requests=1)),
        )

    def test_prepare_send_log(self):
        prepared = self.r.cmd_priprav("nejlepší vysavač do 10 000 Kč, piš na ja@x.cz")
        self.assertEqual(prepared["odchozi_dotaz"], "nejlepší vysavač do 10 000 Kč, piš na [e-mail]")
        self.assertEqual(prepared["skryto"], ["e-mail"])
        with mock.patch.object(self.r, "ask_claude", return_value=([self.fake_response()], self.fake_response())) as ask:
            result = self.r.cmd_odeslat(prepared["id"])
        sent_query, sent_key = ask.call_args[0]
        self.assertEqual(sent_query, prepared["odchozi_dotaz"])
        self.assertEqual(sent_key, "sk-test")
        self.assertEqual(result["odpoved"], "Nejlépe vychází model X (stav 10/2026).")
        self.assertEqual(result["zdroje"], [{"url": "https://example.cz/test", "nazev": "Test vysavačů"}])
        self.assertEqual(result["vyhledavani"], 2)
        log = self.r.cmd_log(5)["odeslano"]
        self.assertEqual(log[0]["odchozi_dotaz"], prepared["odchozi_dotaz"])
        # Druhé odeslání stejného ID už neprojde
        with self.assertRaises(self.r.ResearchError):
            self.r.cmd_odeslat(prepared["id"])

    def test_tampered_pending_is_refused(self):
        prepared = self.r.cmd_priprav("obecný dotaz")
        path = Path(self.tmp.name) / "resers" / "ke-schvaleni" / f"{prepared['id']}.json"
        data = json.loads(path.read_text())
        data["dotaz"] = "obecný dotaz, volej 777 123 456"
        path.write_text(json.dumps(data))
        with mock.patch.object(self.r, "ask_claude") as ask:
            with self.assertRaises(self.r.ResearchError):
                self.r.cmd_odeslat(prepared["id"])
            ask.assert_not_called()

    def test_refusal(self):
        prepared = self.r.cmd_priprav("obecný dotaz")
        refused = NS(stop_reason="refusal", stop_details=NS(explanation="test"), content=[], usage=None)
        with mock.patch.object(self.r, "ask_claude", return_value=([refused], refused)):
            with self.assertRaises(self.r.ResearchError):
                self.r.cmd_odeslat(prepared["id"])

    def test_bad_id(self):
        with self.assertRaises(self.r.ResearchError):
            self.r.cmd_odeslat("../../etc/passwd")

    def test_search_error_block(self):
        resp = NS(stop_reason="end_turn", content=[NS(type="web_search_tool_result",
                                                      content=NS(error_code="max_uses_exceeded")),
                                                   NS(type="text", text="Nic.", citations=None)], usage=None)
        answer = self.r.collect_answer([resp])
        self.assertEqual(answer["chyby_nastroju"], ["max_uses_exceeded"])


if __name__ == "__main__":
    unittest.main()
