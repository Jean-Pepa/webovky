"""Testy pro zpravy.py: odkazy s předvyplněnou zprávou, nic se neodesílá."""

import importlib.util
import io
import sys
import unittest
import urllib.parse
from contextlib import redirect_stderr, redirect_stdout
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent))  # nástroje sdílejí zaklad.py


def load(name, file):
    spec = importlib.util.spec_from_file_location(name, HERE.parent / file)
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


zpravy = load("zpravy", "zpravy.py")


class ZpravyTests(unittest.TestCase):
    def cli(self, *args):
        out, err = io.StringIO(), io.StringIO()
        with redirect_stdout(out), redirect_stderr(err):
            code = zpravy.main(list(args))
        return code, out.getvalue(), err.getvalue()

    def test_phone_numbers(self):
        for text in ("777 123 456", "+420 777 123 456", "00420777123456", "(+420) 777-123-456"):
            self.assertEqual(zpravy.phone(text), "+420777123456", text)
        self.assertEqual(zpravy.phone("+49 151 2345 6789"), "+4915123456789")
        for bad in ("", "12345", "777 123 45a", "petr"):
            with self.assertRaises(zpravy.ZpravyError, msg=bad):
                zpravy.phone(bad)

    def test_whatsapp_link_keeps_czech_text(self):
        text = "Ahoj Petře, zítra v 18:00 & díky! Ověř prosím rozměry (č. 3)."
        who, url = zpravy.link("whatsapp", text, number="777 123 456")
        self.assertEqual(who, "WhatsApp +420 777 123 456")
        parts = urllib.parse.urlsplit(url)
        self.assertEqual((parts.scheme, parts.netloc, parts.path), ("https", "wa.me", "/420777123456"))
        self.assertEqual(urllib.parse.parse_qs(parts.query)["text"], [text])

    def test_sms_and_messenger(self):
        who, url = zpravy.link("sms", "Dorazím za 10 minut.", number="+420777123456")
        self.assertEqual(url, "sms:+420777123456&body=Doraz%C3%ADm%20za%2010%20minut.")
        who, url = zpravy.link("messenger", "Ahoj", user="https://www.facebook.com/jan.novak/")
        self.assertEqual(url, "https://m.me/jan.novak")
        with self.assertRaises(zpravy.ZpravyError):
            zpravy.link("messenger", "Ahoj", user="jan novak; rm -rf")

    def test_cli_never_sends(self):
        code, out, _ = self.cli("whatsapp", "--cislo", "777123456", "--text", "Ahoj")
        self.assertEqual(code, 0)
        self.assertIn("https://wa.me/420777123456?text=Ahoj", out)
        self.assertIn("Nic jsem neodeslal", out)
        code, _, err = self.cli("sms", "--cislo", "123", "--text", "Ahoj")
        self.assertEqual(code, 1)
        code, _, err = self.cli("whatsapp", "--cislo", "777123456", "--text", "x" * 5000)
        self.assertEqual(code, 1)
        code, out, _ = self.cli("messenger", "--uzivatel", "jan.novak", "--text", "Ahoj")
        self.assertIn("zkopíruj", out.lower())


if __name__ == "__main__":
    unittest.main()
