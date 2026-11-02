"""Testy pro novinky.py s falešným webem a falešnou Ollamou (žádný internet ani model)."""

import http.server
import importlib.util
import io
import json
import sys
import tempfile
import threading
import unittest
import urllib.parse
from contextlib import redirect_stderr, redirect_stdout
from datetime import date
from pathlib import Path

HERE = Path(__file__).resolve().parent


def load(name, file):
    spec = importlib.util.spec_from_file_location(name, HERE.parent / file)
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module  # dataclasses potřebují modul v sys.modules
    spec.loader.exec_module(module)
    return module


novinky = load("novinky", "novinky.py")
TODAY = date(2026, 11, 2)


def rss(items):
    entries = "".join(f"<item><title>{t}</title><link>{u}</link><pubDate>Mon, 02 Nov 2026 08:00:00 GMT</pubDate>"
                      f"<description>&lt;p&gt;Úvod {t}&lt;/p&gt;</description></item>" for t, u in items)
    return f'<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>x</title>{entries}</channel></rss>'


def article(title, body, charset="utf-8"):
    return (f'<html><head><meta charset="{charset}"><title>{title} | Web</title>'
            f'<meta property="og:title" content="{title}"></head><body><nav><a href="/kontakt">Kontakt webu</a></nav>'
            f"<article><h1>{title}</h1><p>{body}</p><p>{body} Druhý odstavec s dalšími podrobnostmi o stavbě.</p>"
            "</article><footer><p>Patička webu, která do textu nepatří, i když je dost dlouhá.</p></footer>"
            "</body></html>")


class FakeWeb(http.server.BaseHTTPRequestHandler):
    base = ""
    feed_a = []
    chats: list = []
    wiki_calls = 0
    ollama_up = True

    def log_message(self, *args):
        pass

    def send(self, status, body, ctype="text/html; charset=utf-8"):
        data = body if isinstance(body, bytes) else body.encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self):
        url = urllib.parse.urlsplit(self.path)
        b = FakeWeb.base
        if url.path == "/robots.txt":
            return self.send(200, "User-agent: *\nDisallow: /tajne\nDisallow: /cs/w/\n", "text/plain")
        if url.path == "/a/feed.xml":
            return self.send(200, rss(FakeWeb.feed_a), "application/rss+xml")
        if url.path.startswith("/a/clanek-"):
            n = url.path.rsplit("-", 1)[-1]
            return self.send(200, article(f"Nový dům číslo {n}", f"Ateliér dokončil dům číslo {n} v Brně."))
        if url.path == "/b/":
            return self.send(200, f'<html><head><link rel="alternate" type="application/rss+xml" href="{b}/b/rss">'
                                  "</head><body>Titulní strana</body></html>")
        if url.path == "/b/rss":
            return self.send(200, rss([("Novela stavebního zákona", f"{b}/b/zakon-2026"),
                                       ("Změna vyhlášky", f"{b}/b/vyhlaska-2026")]), "application/rss+xml")
        if url.path.startswith("/b/"):
            return self.send(200, article("Novela stavebního zákona", "Sněmovna schválila novelu stavebního zákona."))
        if url.path == "/c/novinky":
            links = "".join(f'<a href="/c/novinky/2026/stavba-roku-{n}">Stavba roku {n}: vítěz kategorie</a>'
                            for n in range(1, 6))
            return self.send(200, f'<html><body><nav><a href="/c/o-nas">O nás a o tom, co děláme</a></nav>{links}'
                                  '<a href="/c/tag/drevo">Dřevostavby a všechno o nich</a></body></html>')
        if url.path.startswith("/c/novinky/2026/"):
            body = article("Stavba roku - vítěz", "Porota vybrala vítěze soutěže Stavba roku.", "iso-8859-2")
            return self.send(200, body.encode("iso-8859-2"), "text/html; charset=iso-8859-2")
        if url.path.startswith("/cs/w/api.php") or url.path.startswith("/en/w/api.php"):
            FakeWeb.wiki_calls += 1
            title = urllib.parse.parse_qs(url.query)["titles"][0]
            if title == "Neexistující heslo":
                page = {"-1": {"title": title, "missing": ""}}
            else:
                page = {"1": {"title": title, "extract": f"{title} je směr v architektuře 20. století."}}
            return self.send(200, json.dumps({"query": {"pages": page}}), "application/json")
        return self.send(404, "nenalezeno")

    def do_POST(self):
        body = json.loads(self.rfile.read(int(self.headers["Content-Length"])).decode("utf-8"))
        FakeWeb.chats.append(body)
        if not FakeWeb.ollama_up:
            return self.send(500, "{}", "application/json")
        text = body["messages"][-1]["content"]
        kind = "predpisy" if "zákon" in text or "vyhláš" in text else "souteze" if "Stavba roku" in text else "stavby"
        answer = f"KATEGORIE: {kind}\nSHRNUTÍ: Shrnutí: {text.splitlines()[0][9:]}.\nPROČ: Týká se praxe v ČR."
        return self.send(200, json.dumps({"message": {"content": answer}}), "application/json")


class NovinkyTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), FakeWeb)
        threading.Thread(target=cls.server.serve_forever, daemon=True).start()
        FakeWeb.base = f"http://127.0.0.1:{cls.server.server_port}"
        novinky.OLLAMA_URL = FakeWeb.base
        novinky.WIKI_API = FakeWeb.base + "/{lang}/w/api.php"

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        root = Path(self.tmp.name)
        novinky.MOZEK = root / "Mozek"
        novinky.STATE_DIR = root / "state"
        (novinky.MOZEK / "novinky").mkdir(parents=True)
        FakeWeb.feed_a = [(f"Dům {n}", f"{FakeWeb.base}/a/clanek-{n}") for n in range(5, 0, -1)]
        FakeWeb.chats, FakeWeb.wiki_calls, FakeWeb.ollama_up = [], 0, True
        b = FakeWeb.base
        self.sources(f"- stavby | Web A | {b}/a/feed.xml", f"- Předpisy | Web B | {b}/b/",
                     f"- souteze | Web C | {b}/c/novinky")

    def tearDown(self):
        self.tmp.cleanup()

    def sources(self, *lines):
        (novinky.MOZEK / "novinky" / "zdroje.md").write_text(
            "# Zdroje\n\nPoznámka bez adresy.\n" + "\n".join(lines) + "\n", encoding="utf-8")

    def run_download(self, **kw):
        with redirect_stdout(io.StringIO()):
            path = novinky.cmd_download(40, today=TODAY, web=novinky.Web(delay=0), **kw)
        return path.read_text(encoding="utf-8")

    def test_first_run_reports_latest_and_builds_library(self):
        digest = self.run_download()
        self.assertTrue(digest.startswith("# Architektura: novinky 2. 11. 2026"))
        self.assertIn("Prošel jsem 3 z 3 zdrojů, nových článků: 8.", digest)  # 3 + 2 + 3
        self.assertIn("## Předpisy a legislativa", digest)
        self.assertIn("**Novela stavebního zákona** (Web B): Shrnutí: Novela stavebního zákona.", digest)
        self.assertIn("*Proč: Týká se praxe v ČR.*", digest)
        self.assertIn("## Soutěže a ceny", digest)
        self.assertIn("**Nový dům číslo 5** (Web A)", digest)
        self.assertNotIn("Dům 2", digest)  # při prvním běhu jen 3 nejnovější z každého zdroje
        saved = sorted((novinky.MOZEK / "novinky" / "clanky" / "2026").glob("*.md"))
        self.assertEqual(len(saved), 8)
        text = next(p for p in saved if "novy-dum-cislo-5" in p.name).read_text(encoding="utf-8")
        self.assertIn(f"Zdroj: Web A, {FakeWeb.base}/a/clanek-5", text)
        self.assertIn("Ateliér dokončil dům číslo 5 v Brně.", text)
        self.assertNotIn("Patička webu", text)  # jen text článku, ne okolí stránky
        self.assertNotIn("Kontakt webu", text)

    def test_second_run_reports_only_new_articles(self):
        self.run_download()
        digest = self.run_download()
        self.assertIn("nových článků: 0", digest)
        self.assertIn("Nic nového.", digest)
        FakeWeb.feed_a.insert(0, ("Dům 6", f"{FakeWeb.base}/a/clanek-6"))
        digest = self.run_download()
        self.assertIn("nových článků: 1", digest)
        self.assertIn("**Nový dům číslo 6**", digest)

    def test_model_gets_only_the_article_and_no_tools(self):
        self.run_download()
        chat = FakeWeb.chats[0]
        self.assertNotIn("tools", chat)
        self.assertFalse(chat["think"])
        self.assertIn("jen data", chat["messages"][0]["content"])
        self.assertEqual([m["role"] for m in chat["messages"]], ["system", "user"])

    def test_broken_forbidden_and_model_down(self):
        b = FakeWeb.base
        self.sources(f"- stavby | Web A | {b}/a/feed.xml", f"- obecne | Zakázaný | {b}/tajne/rss",
                     f"- obecne | Chybějící | {b}/neni-tu")
        FakeWeb.ollama_up = False
        digest = self.run_download()
        self.assertIn("Prošel jsem 1 z 3 zdrojů", digest)
        self.assertIn("## Zdroje, které se nepodařilo načíst", digest)
        self.assertIn("Zakázaný: ", digest)
        self.assertIn("zakazuje stahování v robots.txt", digest)
        self.assertIn("Chybějící: ", digest)
        self.assertIn("Lokální model neběžel", digest)
        self.assertIn("**Nový dům číslo 5** (Web A): shrnutí není, model neběžel.", digest)

    def test_older_encodings_keep_czech(self):
        self.run_download()
        saved = [p.read_text(encoding="utf-8") for p in (novinky.MOZEK / "novinky" / "clanky" / "2026").glob("*.md")]
        self.assertTrue(any("Porota vybrala vítěze soutěže Stavba roku." in t for t in saved))
        self.assertFalse(any("O nás" in t for t in saved))

    def test_wikipedia_topics_monthly(self):
        (novinky.MOZEK / "znalosti").mkdir()
        (novinky.MOZEK / "znalosti" / "temata.md").write_text(
            "# Témata\n- Funkcionalismus\n- en: Brutalist architecture\n- Neexistující heslo\n", encoding="utf-8")
        digest = self.run_download()
        folder = novinky.MOZEK / "znalosti" / "wikipedie"
        cs = (folder / "cs-funkcionalismus.md").read_text(encoding="utf-8")
        self.assertIn("Zdroj: Wikipedie, https://cs.wikipedia.org/wiki/Funkcionalismus", cs)
        self.assertIn("licence CC BY-SA 4.0", cs)
        self.assertTrue((folder / "en-brutalist-architecture.md").exists())
        self.assertIn("obnoveno 2 hesel z Wikipedie", digest)
        self.assertIn("„Neexistující heslo“: heslo neexistuje", digest)
        calls = FakeWeb.wiki_calls
        self.run_download()
        self.assertEqual(FakeWeb.wiki_calls, calls)  # do 30 dní se znovu nestahuje

    def test_check_lists_each_source(self):
        self.sources(f"- stavby | Web A | {FakeWeb.base}/a/feed.xml", f"- obecne | Chybějící | {FakeWeb.base}/neni")
        out = io.StringIO()
        with redirect_stdout(out):
            code = novinky.cmd_check(web=novinky.Web(delay=0))
        self.assertEqual(code, 1)
        self.assertRegex(out.getvalue(), r"OK\s+5 článků  Web A")
        self.assertIn("POZOR", out.getvalue())

    def test_sources_file_rules(self):
        self.sources("- divne | Web | https://example.org", "- predpisy | bez adresy |", "* Stavby | Druhý | http://x.cz/")
        found = novinky.load_sources(novinky.MOZEK / "novinky" / "zdroje.md")
        self.assertEqual([(s.category, s.name) for s in found], [("obecne", "Web"), ("stavby", "Druhý")])
        self.sources("jen text")
        with self.assertRaises(novinky.NovinkyError):
            novinky.load_sources(novinky.MOZEK / "novinky" / "zdroje.md")
        err = io.StringIO()
        (novinky.MOZEK / "novinky" / "zdroje.md").unlink()
        with redirect_stderr(err):
            self.assertEqual(novinky.main(["stahni"]), 1)
        self.assertIn("Chybí seznam zdrojů", err.getvalue())

    def test_timer_units(self):
        calls = []
        with redirect_stdout(io.StringIO()):
            novinky.cmd_timer(Path(self.tmp.name) / "units", run=lambda cmd, check: calls.append(cmd))
        service = (Path(self.tmp.name) / "units" / "agent-novinky.service").read_text(encoding="utf-8")
        timer = (Path(self.tmp.name) / "units" / "agent-novinky.timer").read_text(encoding="utf-8")
        self.assertIn("ExecStart=%h/.local/bin/agent-novinky stahni", service)
        self.assertIn("OnCalendar=*-*-* 02:10:00", timer)
        self.assertEqual(calls[-1], ["systemctl", "--user", "enable", "--now", "agent-novinky.timer"])


if __name__ == "__main__":
    unittest.main()
