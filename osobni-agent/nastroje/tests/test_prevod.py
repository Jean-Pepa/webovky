"""Testy pro prevod.py: převody jen ve složce Mozek, pandoc bez internetu a bez cizích souborů."""

import http.server
import importlib.util
import io
import os
import shutil
import subprocess
import sys
import tempfile
import threading
import unittest
import zipfile
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


prevod = load("prevod", "prevod.py")
HAS_TOOLS = bool(shutil.which("pandoc") and shutil.which("pdftotext"))
PNG = bytes.fromhex("89504e470d0a1a0a0000000d4948445200000001000000010806000000"
                    "1f15c4890000000d49444154789c6360000002000154a24f5d0000000049454e44ae426082")


def minimal_pdf(text: str) -> bytes:
    """Nejmenší platné PDF s jedním řádkem textu (bez diakritiky)."""
    stream = f"BT /F1 18 Tf 72 720 Td ({text}) Tj ET".encode("ascii")
    objects = [b"<< /Type /Catalog /Pages 2 0 R >>",
               b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
               b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R "
               b"/Resources << /Font << /F1 5 0 R >> >> >>",
               b"<< /Length %d >>\nstream\n" % len(stream) + stream + b"\nendstream",
               b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"]
    out, offsets = bytearray(b"%PDF-1.4\n"), []
    for n, body in enumerate(objects, 1):
        offsets.append(len(out))
        out += b"%d 0 obj\n" % n + body + b"\nendobj\n"
    xref = len(out)
    out += b"xref\n0 %d\n0000000000 65535 f \n" % (len(objects) + 1)
    out += b"".join(b"%010d 00000 n \n" % o for o in offsets)
    out += b"trailer\n<< /Size %d /Root 1 0 R >>\nstartxref\n%d\n%%%%EOF\n" % (len(objects) + 1, xref)
    return bytes(out)


class Hits(http.server.BaseHTTPRequestHandler):
    count = 0

    def log_message(self, *args):
        pass

    def do_GET(self):
        Hits.count += 1
        self.send_response(200)
        self.send_header("Content-Type", "image/png")
        self.end_headers()


class PrevodTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        root = Path(self.tmp.name)
        self.mozek = root / "Mozek"
        (self.mozek / "podklady" / "vzory").mkdir(parents=True)
        (self.mozek / "podklady" / "sablony").mkdir(parents=True)
        (self.mozek / "projekty" / "dum" / "texty").mkdir(parents=True)
        (self.mozek / "skills" / "x").mkdir(parents=True)
        self.outside = root / "jinde"
        self.outside.mkdir()
        self.saved = prevod.MOZEK
        prevod.MOZEK = self.mozek
        self.pdf = self.mozek / "podklady" / "vzory" / "zprava.pdf"
        self.pdf.write_bytes(minimal_pdf("Technicka zprava rodinneho domu"))
        (self.outside / "cizi.pdf").write_bytes(minimal_pdf("Cizi soubor"))
        self.cwd = os.getcwd()
        os.chdir(self.mozek)

    def tearDown(self):
        os.chdir(self.cwd)
        prevod.MOZEK = self.saved
        self.tmp.cleanup()

    def cli(self, *args):
        out, err = io.StringIO(), io.StringIO()
        with redirect_stdout(out), redirect_stderr(err):
            code = prevod.main(list(args))
        return code, out.getvalue(), err.getvalue()

    def test_paths_only_in_mozek(self):
        bashrc = Path(self.tmp.name) / ".bashrc"
        for args in (("pdf", str(self.outside / "cizi.pdf")),
                     ("pdf", "podklady/vzory/zprava.pdf", str(bashrc.with_suffix(".txt"))),
                     ("pdf", "podklady/vzory/zprava.pdf", "../jinde/x.txt"),
                     ("pdf", "podklady/vzory/zprava.pdf", "AGENTS.md"),
                     ("pdf", "podklady/vzory/zprava.pdf", "skills/x/SKILL.md"),
                     ("pdf", "podklady/vzory/zprava.pdf", "podklady/sablony/x.txt"),
                     ("pdf", "podklady/vzory/zprava.pdf", "podklady/vzory/x.sh"),
                     ("dokument", "podklady/vzory/zprava.pdf", "x.docx"),
                     ("dokument", "a.md", "b.exe")):
            code, _, err = self.cli(*args)
            self.assertEqual(code, 1, args)
            self.assertIn("Chyba", err)

    def test_symlink_escape(self):
        (self.mozek / "odkaz").symlink_to(self.outside)
        code, _, err = self.cli("pdf", "odkaz/cizi.pdf")
        self.assertEqual(code, 1)
        self.assertIn("mimo složku Mozek", err)
        code, _, err = self.cli("pdf", "podklady/vzory/zprava.pdf", "odkaz/vystup.txt")
        self.assertEqual(code, 1)
        self.assertFalse((self.outside / "vystup.txt").exists())

    def test_clean_env_and_fixed_args(self):
        calls = []

        def fake(cmd, **kw):
            calls.append((cmd, kw["env"]))
            return subprocess.CompletedProcess(cmd, 0, '{"pandoc-api-version":[1,23,1],"meta":{},"blocks":[]}', "")

        os.environ["AGENT_PODVRH"] = "1"
        try:
            (self.mozek / "a.md").write_text("# A\n", encoding="utf-8")
            prevod.cmd_document("a.md", "a.docx", None, run=fake)
        finally:
            del os.environ["AGENT_PODVRH"]
        (read, env), (write, _) = calls
        self.assertEqual(read[:2], ["/usr/bin/pandoc", "--sandbox"])
        self.assertIn("markdown-raw_html-raw_attribute-raw_tex", read)
        self.assertEqual(write[:5], ["/usr/bin/pandoc", "-f", "json", "-t", "docx"])
        self.assertNotIn("AGENT_PODVRH", env)
        self.assertFalse(any("filter" in a or "template" in a or "defaults" in a for a in read + write))

    @unittest.skipUnless(HAS_TOOLS, "chybí pandoc nebo pdftotext")
    def test_pdf_text(self):
        code, out, err = self.cli("pdf", "podklady/vzory/zprava.pdf", "--layout")
        self.assertEqual(code, 0, err)
        self.assertIn("Technicka zprava rodinneho domu", out)
        code, out, err = self.cli("pdf", "podklady/vzory/zprava.pdf", "podklady/vzory/zprava.txt")
        self.assertEqual(code, 0, err)
        self.assertIn("Technicka", (self.mozek / "podklady" / "vzory" / "zprava.txt").read_text(encoding="utf-8"))

    @unittest.skipUnless(HAS_TOOLS, "chybí pandoc nebo pdftotext")
    def test_word_export_is_sealed(self):
        server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), Hits)
        threading.Thread(target=server.serve_forever, daemon=True).start()
        Hits.count = 0
        secret = self.outside / "tajne.png"
        secret.write_bytes(b"\x89PNG tajny obsah")
        md = self.mozek / "projekty" / "dum" / "texty" / "B.md"
        (self.mozek / "projekty" / "dum" / "texty" / "situace.png").write_bytes(PNG)
        md.write_text(
            "# Souhrnná technická zpráva\n\nText zprávy.\n\n"
            f"![obr](http://127.0.0.1:{server.server_port}/unik?data=MEMORY)\n\n"
            f"![obr2]({secret})\n\n![Situace](situace.png)\n\n"
            "[odkaz na sdílenou složku](file://server/sdileno) a [web](https://example.cz)\n\n"
            '```{=openxml}\n<w:p><w:r><w:t>VLOZENY-KOD</w:t></w:r></w:p>\n```\n\n'
            "<div>SUROVE-HTML</div>\n", encoding="utf-8")
        try:
            code, out, err = self.cli("dokument", "projekty/dum/texty/B.md", "projekty/dum/texty/B.docx")
        finally:
            server.shutdown()
            server.server_close()
        self.assertEqual(code, 0, err)
        self.assertEqual(Hits.count, 0)  # nic nestáhl z internetu
        with zipfile.ZipFile(self.mozek / "projekty" / "dum" / "texty" / "B.docx") as z:
            names = z.namelist()
            body = z.read("word/document.xml").decode("utf-8")
            blobs = b"".join(z.read(n) for n in names)
        self.assertIn("Souhrnná technická zpráva", body)
        self.assertNotIn(b"tajny obsah", blobs)        # cizí soubor se do dokumentu nedostal
        self.assertNotIn("<w:t>VLOZENY-KOD</w:t>", body)  # surové OpenXML neprošlo jako kód
        self.assertNotIn("<div>", body)
        self.assertTrue(any(n.startswith("word/media/") for n in names))  # obrázek z Mozku zůstal
        rels = zipfile.ZipFile(self.mozek / "projekty" / "dum" / "texty" / "B.docx").read(
            "word/_rels/document.xml.rels").decode("utf-8")
        self.assertIn("https://example.cz", rels)
        self.assertNotIn("file://", rels)
        self.assertIn("vynechal jsem", out)

    @unittest.skipUnless(HAS_TOOLS, "chybí pandoc nebo pdftotext")
    def test_template_only_from_sablony(self):
        ref = subprocess.run(["pandoc", "--print-default-data-file", "reference.docx"], capture_output=True).stdout
        (self.mozek / "podklady" / "sablony" / "hlavicka.docx").write_bytes(ref)
        (self.outside / "cizi.docx").write_bytes(ref)
        (self.mozek / "a.md").write_text("# A\n", encoding="utf-8")
        code, _, err = self.cli("dokument", "a.md", "a.docx", "--sablona", str(self.outside / "cizi.docx"))
        self.assertEqual(code, 1)
        code, out, err = self.cli("dokument", "a.md", "a.docx", "--sablona", "podklady/sablony/hlavicka.docx")
        self.assertEqual(code, 0, err)
        self.assertTrue((self.mozek / "a.docx").exists())
        code, out, err = self.cli("dokument", "a.docx", "a2.md")
        self.assertEqual(code, 0, err)
        self.assertIn("# A", (self.mozek / "a2.md").read_text(encoding="utf-8"))


if __name__ == "__main__":
    unittest.main()
