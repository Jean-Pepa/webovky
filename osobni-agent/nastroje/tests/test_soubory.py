"""Testy pro soubory.py: práce se soubory jen v povolených složkách, nic se nemaže ani nepřepíše."""

import importlib.util
import io
import os
import sys
import tempfile
import unittest
from contextlib import redirect_stderr, redirect_stdout
from datetime import datetime
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent))  # nástroje sdílejí zaklad.py


def load(name, file):
    spec = importlib.util.spec_from_file_location(name, HERE.parent / file)
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


soubory = load("soubory", "soubory.py")


def files_under(*folders):
    out = set()
    for folder in folders:
        for base, _, names in os.walk(folder):
            out |= {os.path.join(base, n) for n in names}
    return out


class Base(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        t = Path(self.tmp.name)
        self.t = t
        self.plocha = t / "win" / "OneDrive" / "Plocha"
        self.dokumenty = t / "win" / "OneDrive" / "Dokumenty"
        self.stazene = t / "win" / "Downloads"
        self.kos = t / "win" / "Koš agenta"
        self.mozek = t / "Mozek"
        for d in (self.plocha, self.dokumenty, self.stazene, self.mozek):
            d.mkdir(parents=True)
        config = t / "config"
        config.mkdir()
        (config / "soubory.txt").write_text(
            "# povolené složky\n"
            f"plocha = {self.plocha}\n"
            f"dokumenty = {self.dokumenty}\n"
            f"stazene = {self.stazene}\n"
            f"kos = {self.kos}\n", encoding="utf-8")
        self.patch = {"CONFIG_DIR": config, "STATE_DIR": t / "state" / "soubory", "MOZEK": self.mozek}
        self.saved = {k: getattr(soubory, k) for k in self.patch}
        for k, v in self.patch.items():
            setattr(soubory, k, v)
        (self.plocha / "Nabídka.pdf").write_text("pdf", encoding="utf-8")
        (self.plocha / "desktop.ini").write_text("ini", encoding="utf-8")
        (self.plocha / "Projekt X").mkdir()
        (self.plocha / "Projekt X" / "studie.dwg").write_text("dwg", encoding="utf-8")
        (self.stazene / "instalacka.zip").write_text("zip", encoding="utf-8")
        (self.stazene / "Nabídka.pdf").write_text("jiná pdf", encoding="utf-8")
        (self.stazene / "fotka.jpg").write_text("jpg", encoding="utf-8")
        (self.stazene / "sken.pdf").write_text("pdf2", encoding="utf-8")
        self.cfg = soubory.load_config()

    def tearDown(self):
        for k, v in self.saved.items():
            setattr(soubory, k, v)
        self.tmp.cleanup()

    def run_cli(self, *args):
        out, err = io.StringIO(), io.StringIO()
        with redirect_stdout(out), redirect_stderr(err):
            code = soubory.main(list(args))
        return code, out.getvalue(), err.getvalue()


class ConfigTest(Base):
    def test_windows_paths(self):
        self.assertEqual(soubory.from_windows(r"C:\Users\krist\Desktop"), Path("/mnt/c/Users/krist/Desktop"))
        self.assertEqual(soubory.to_windows(Path("/mnt/c/Users/krist/Koš agenta")), r"C:\Users\krist\Koš agenta")
        self.assertTrue(soubory.inside(Path("/mnt/c/users/KRIST/desktop/a"), Path("/mnt/c/Users/krist/Desktop")))
        self.assertFalse(soubory.inside(Path("/home/a/B"), Path("/home/a/b")))

    def test_forbidden_roots(self):
        for path in ("/mnt/c", "/mnt/c/Users", "/mnt/c/Users/krist", "/mnt/c/Windows/System32",
                     "/mnt/c/Users/krist/AppData/Roaming", "/", str(Path.home())):
            self.assertIsNotNone(soubory.forbidden_root(Path(path)), path)
        for path in ("/mnt/c/Users/krist/Desktop", "/mnt/d/Projekty", "/mnt/c/Users/krist/OneDrive/Plocha"):
            self.assertIsNone(soubory.forbidden_root(Path(path)), path)

    def test_config_refuses_whole_profile(self):
        (self.patch["CONFIG_DIR"] / "soubory.txt").write_text("profil = C:\\Users\\krist\n", encoding="utf-8")
        with self.assertRaises(soubory.SouboryError) as ctx:
            soubory.load_config()
        self.assertIn("povolit nejde", str(ctx.exception))

    def test_cloud_detected(self):
        roots = {r.alias: r.cloud for r in self.cfg.roots}
        self.assertEqual(roots, {"plocha": True, "dokumenty": True, "stazene": False})

    def test_folders_listing(self):
        code, out, _ = self.run_cli("slozky")
        self.assertEqual(code, 0)
        self.assertIn("plocha:", out)
        self.assertIn("nahrává se do cloudu", out)
        self.assertIn("kos:", out)


class ResolveTest(Base):
    def test_alias_forms(self):
        target = self.plocha / "Projekt X"
        for text in ("plocha:Projekt X", "Plocha:Projekt X", "plocha/Projekt X", "plocha:\\Projekt X",
                     str(target)):
            self.assertEqual(soubory.resolve(self.cfg, text), target, text)
        self.assertEqual(soubory.resolve(self.cfg, "Stažené:sken.pdf"), self.stazene / "sken.pdf")
        self.assertEqual(soubory.resolve(self.cfg, "plocha:"), self.plocha)

    def test_outside_and_traversal(self):
        for text in (str(self.t / "jinde.txt"), "plocha:../Downloads/sken.pdf", "Projekt X", "~/Mozek",
                     str(self.mozek / "MEMORY.md")):
            with self.assertRaises(soubory.SouboryError, msg=text):
                soubory.resolve(self.cfg, text)

    def test_protected_inside_root(self):
        # Mozek uvnitř povolené složky: vypsat složku jde, hýbat s Mozkem ani s ní ne.
        inner = self.dokumenty / "Osobní" / "Mozek"
        inner.mkdir(parents=True)
        soubory.MOZEK = inner
        cfg = soubory.load_config()
        code, out, _ = self.run_cli("vypis", "dokumenty:Osobní")
        self.assertEqual(code, 0)
        for text in ("dokumenty:Osobní/Mozek", "dokumenty:Osobní"):
            with self.assertRaises(soubory.SouboryError, msg=text):
                soubory.item(cfg, text)
            code, _, err = self.run_cli("presun", text, "plocha:")
            self.assertEqual(code, 1)
            self.assertIn("Mozek", err)
        self.assertTrue(inner.is_dir())

    def test_hint_for_typo(self):
        with self.assertRaises(soubory.SouboryError) as ctx:
            soubory.existing(self.cfg, "plocha:nabidka.pdf")
        self.assertIn("Nabídka.pdf", str(ctx.exception))


class MoveTest(Base):
    def test_move_and_undo(self):
        code, out, err = self.run_cli("presun", "plocha:Projekt X", "dokumenty:")
        self.assertEqual(code, 0, err)
        self.assertTrue((self.dokumenty / "Projekt X" / "studie.dwg").exists())
        self.assertFalse((self.plocha / "Projekt X").exists())
        self.assertIn("akce 1", out)
        code, out, _ = self.run_cli("vrat")
        self.assertEqual(code, 0)
        self.assertTrue((self.plocha / "Projekt X" / "studie.dwg").exists())
        self.assertFalse((self.dokumenty / "Projekt X").exists())
        code, _, err = self.run_cli("vrat", "1")
        self.assertEqual(code, 1)
        self.assertIn("už je vrácená", err)

    def test_never_overwrites(self):
        code, out, err = self.run_cli("presun", "stazene:Nabídka.pdf", "plocha:", "--do-cloudu")
        self.assertEqual(code, 0, err)
        self.assertEqual((self.plocha / "Nabídka.pdf").read_text(encoding="utf-8"), "pdf")
        self.assertEqual((self.plocha / "Nabídka (2).pdf").read_text(encoding="utf-8"), "jiná pdf")
        self.assertIn("už tam bylo", out)

    def test_same_names_from_two_folders(self):
        (self.t / "win" / "Downloads" / "x").mkdir()
        (self.stazene / "x" / "sken.pdf").write_text("třetí", encoding="utf-8")
        target = self.stazene / "Archiv"
        target.mkdir()
        code, _, err = self.run_cli("presun", "stazene:sken.pdf", "stazene:x/sken.pdf", "stazene:Archiv")
        self.assertEqual(code, 0, err)
        self.assertEqual(sorted(p.name for p in target.iterdir()), ["sken (2).pdf", "sken.pdf"])

    def test_wildcard(self):
        target = self.stazene / "PDF"
        target.mkdir()
        code, out, err = self.run_cli("presun", "stazene:*.PDF", "stazene:PDF")
        self.assertEqual(code, 0, err)
        self.assertEqual(sorted(p.name for p in target.iterdir()), ["Nabídka.pdf", "sken.pdf"])
        self.assertTrue((self.stazene / "fotka.jpg").exists())

    def test_destination_must_exist(self):
        code, _, err = self.run_cli("presun", "plocha:Nabídka.pdf", "dokumenty:Archiv")
        self.assertEqual(code, 1)
        self.assertIn("agent-soubory slozka", err)
        self.assertTrue((self.plocha / "Nabídka.pdf").exists())

    def test_into_itself_and_whole_roots(self):
        for args in (("presun", "plocha:Projekt X", "plocha:Projekt X"),
                     ("presun", "plocha:", "dokumenty:"),
                     ("presun", "plocha:desktop.ini", "dokumenty:"),
                     ("presun", "plocha:Nabídka.pdf", "plocha:"),
                     ("presun", "plocha:Nabídka.pdf", "kos:")):
            code, _, err = self.run_cli(*args)
            self.assertEqual(code, 1, args)

    def test_cloud_needs_flag(self):
        code, _, err = self.run_cli("presun", "stazene:sken.pdf", "dokumenty:")
        self.assertEqual(code, 1)
        self.assertIn("--do-cloudu", err)
        self.assertTrue((self.stazene / "sken.pdf").exists())
        code, out, err = self.run_cli("presun", "stazene:sken.pdf", "dokumenty:", "--do-cloudu")
        self.assertEqual(code, 0, err)
        self.assertIn("nahrává do cloudu", out)
        # Mezi dvěma složkami v cloudu volba potřeba není.
        code, _, err = self.run_cli("presun", "plocha:Nabídka.pdf", "dokumenty:")
        self.assertEqual(code, 0, err)


class CopyRenameFolderTest(Base):
    def test_copy_and_undo_keeps_everything(self):
        code, _, err = self.run_cli("kopiruj", "plocha:Projekt X", "plocha:Nabídka.pdf", "stazene:")
        self.assertEqual(code, 0, err)
        self.assertTrue((self.stazene / "Projekt X" / "studie.dwg").exists())
        self.assertTrue((self.plocha / "Projekt X" / "studie.dwg").exists())
        self.assertTrue((self.stazene / "Nabídka (2).pdf").exists())
        code, out, err = self.run_cli("vrat")
        self.assertEqual(code, 0, err)
        self.assertFalse((self.stazene / "Projekt X").exists())
        # Kopie se nesmazala, je v Koši agenta.
        trashed = files_under(self.kos)
        self.assertEqual(len(trashed), 2)
        self.assertTrue(any(p.endswith("studie.dwg") for p in trashed))

    def test_copy_limit(self):
        saved = soubory.COPY_LIMIT
        soubory.COPY_LIMIT = 2
        try:
            code, _, err = self.run_cli("kopiruj", "plocha:Nabídka.pdf", "stazene:")
        finally:
            soubory.COPY_LIMIT = saved
        self.assertEqual(code, 1)
        self.assertIn("nekopíruji", err)

    def test_rename(self):
        for bad in ("CON.txt", "a:b.pdf", "konec.", "x/y.pdf", ""):
            code, _, _ = self.run_cli("prejmenuj", "plocha:Nabídka.pdf", bad)
            self.assertEqual(code, 1, bad)
        code, _, err = self.run_cli("prejmenuj", "stazene:sken.pdf", "fotka.jpg")
        self.assertEqual(code, 1)
        self.assertIn("už existuje", err)
        code, out, err = self.run_cli("prejmenuj", "plocha:Nabídka.pdf", "Nabídka 2026.pdf")
        self.assertEqual(code, 0, err)
        self.assertTrue((self.plocha / "Nabídka 2026.pdf").exists())
        code, _, _ = self.run_cli("vrat")
        self.assertTrue((self.plocha / "Nabídka.pdf").exists())

    def test_mkdir_and_undo_only_empty(self):
        code, out, err = self.run_cli("slozka", "dokumenty:Projekty/2026/Nový")
        self.assertEqual(code, 0, err)
        self.assertTrue((self.dokumenty / "Projekty" / "2026" / "Nový").is_dir())
        code, _, _ = self.run_cli("vrat")
        self.assertFalse((self.dokumenty / "Projekty").exists())
        self.run_cli("slozka", "dokumenty:Archiv")
        (self.dokumenty / "Archiv" / "dulezite.txt").write_text("x", encoding="utf-8")
        code, out, _ = self.run_cli("vrat")
        self.assertEqual(code, 1)
        self.assertIn("není prázdná", out)
        self.assertTrue((self.dokumenty / "Archiv" / "dulezite.txt").exists())


class TrashTest(Base):
    def test_trash_never_deletes(self):
        before = files_under(self.plocha, self.dokumenty, self.stazene, self.kos)
        now = datetime(2026, 11, 2, 14, 0)
        code = soubory.cmd_trash(self.cfg, ["stazene:instalacka.zip", "plocha:Projekt X"], now=now)
        self.assertEqual(code, 0)
        moved = self.kos / "2026-11-02" / "stazene" / "instalacka.zip"
        self.assertTrue(moved.exists())
        self.assertTrue((self.kos / "2026-11-02" / "plocha" / "Projekt X" / "studie.dwg").exists())
        after = files_under(self.plocha, self.dokumenty, self.stazene, self.kos)
        self.assertEqual(len(before), len(after))
        code, out, err = self.run_cli("vrat")
        self.assertEqual(code, 0, err)
        self.assertTrue((self.stazene / "instalacka.zip").exists())
        self.assertTrue((self.plocha / "Projekt X" / "studie.dwg").exists())
        self.assertEqual(files_under(self.plocha, self.dokumenty, self.stazene, self.kos), before)

    def test_trash_limit(self):
        for i in range(31):
            (self.stazene / f"f{i}.txt").write_text("x", encoding="utf-8")
        code, _, err = self.run_cli("kos", "stazene:f*.txt")
        self.assertEqual(code, 1)
        self.assertIn("nejvýš smím 30", err)

    def test_undo_since_reverses_in_order(self):
        (self.dokumenty / "Archiv").mkdir()
        self.run_cli("presun", "plocha:Nabídka.pdf", "dokumenty:Archiv")
        self.run_cli("prejmenuj", "dokumenty:Archiv/Nabídka.pdf", "Stará nabídka.pdf")
        self.run_cli("kos", "dokumenty:Archiv")
        code, out, err = self.run_cli("vrat", "--od", "2000-01-01")
        self.assertEqual(code, 0, err + out)
        self.assertTrue((self.plocha / "Nabídka.pdf").exists())
        self.assertEqual(list((self.dokumenty / "Archiv").iterdir()), [])
        code, out, _ = self.run_cli("historie")
        self.assertIn("vráceno záznamem", out)


class OpenFindTest(Base):
    def test_open_only_documents(self):
        calls = []

        def fake_run(cmd, env=None, **kw):
            calls.append((cmd, env))

            class R:
                returncode, stdout, stderr = 0, "", ""
            return R()

        (self.stazene / "virus.exe").write_text("x", encoding="utf-8")
        (self.stazene / "zastupce.lnk").write_text("x", encoding="utf-8")
        (self.stazene / "makro.docm").write_text("x", encoding="utf-8")
        for name in ("virus.exe", "zastupce.lnk", "makro.docm"):
            with self.assertRaises(soubory.SouboryError):
                soubory.cmd_open(self.cfg, f"stazene:{name}", run=fake_run)
        self.assertEqual(calls, [])
        soubory.cmd_open(self.cfg, "stazene:sken.pdf", run=fake_run)
        soubory.cmd_open(self.cfg, "plocha:Projekt X", run=fake_run)
        cmd, env = calls[0]
        self.assertEqual(env["AGENT_CESTA"], str(self.stazene / "sken.pdf"))
        self.assertIn("AGENT_CESTA", env["WSLENV"])
        self.assertNotIn("sken", " ".join(cmd))  # cesta jde proměnnou, ne textem příkazu

    def test_find(self):
        code, out, _ = self.run_cli("najdi", "nabidka")
        self.assertEqual(code, 0)
        self.assertIn("plocha:Nabídka.pdf", out)
        self.assertIn("stazene:Nabídka.pdf", out)
        code, out, _ = self.run_cli("najdi", "--typ", "dwg")
        self.assertIn("plocha:Projekt X/studie.dwg", out)
        self.assertNotIn("desktop.ini", out)
        code, out, _ = self.run_cli("najdi", "sken", "--kde", "plocha:")
        self.assertIn("Nalezeno 0", out)

    def test_list_hides_system_files(self):
        code, out, _ = self.run_cli("vypis", "plocha:")
        self.assertEqual(code, 0)
        self.assertIn("Nabídka.pdf", out)
        self.assertIn("složka  Projekt X", out)
        self.assertNotIn("desktop.ini", out)

    def test_history_days(self):
        self.run_cli("slozka", "dokumenty:A")
        code, out, _ = self.run_cli("historie", "--dni", "0")
        self.assertIn("slozka", out)
        self.assertIn("dokumenty:A", out)


if __name__ == "__main__":
    unittest.main()
