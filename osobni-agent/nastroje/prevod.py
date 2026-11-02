#!/usr/bin/env python3
"""Převod dokumentů ve složce Mozek: text z PDF a převody mezi Markdownem, Wordem a dalšími.

    agent-prevod pdf SOUBOR.pdf [VYSTUP.txt] [--layout] [--strany 3-10]
        text z PDF vypíše, nebo uloží do VYSTUP.txt
    agent-prevod dokument VSTUP VYSTUP [--sablona podklady/sablony/hlavicka.docx]
        převod podle přípon: md, docx, odt, html, txt (třeba zprava.md → zprava.docx)

Pojistky (proto agent nespouští pdftotext a pandoc napřímo):
- čte i zapisuje jen ve složce Mozek, pravidla agenta, dovednosti, předpisy a šablony nepřepíše,
- pandoc nejdřív v režimu --sandbox přečte dokument do vnitřní podoby (JSON). Skript z ní
  vyhodí surový kód (HTML, OpenXML), obrázky z internetu a ze souborů mimo Mozek a odkazy na
  soubory a sdílené složky. Teprve pak pandoc zapíše výsledek. Převod tak nic nestáhne,
  nevloží do dokumentu cizí soubor a výsledný Word nemůže mít třeba odkaz na vzdálenou šablonu,
- pandoc běží bez filtrů, šablon a dalších voleb, takže nespustí žádný kód.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import urllib.parse
from pathlib import Path

import zaklad

MOZEK = zaklad.MOZEK
MAX_PRINT = 100_000      # tolik znaků textu PDF vypíše, delší ať se uloží do souboru
TIMEOUT = 300
# Soubory a složky, které převod nikdy nepřepíše.
PROTECTED_NAMES = {"agents.md", "soul.md", "user.md", "memory.md", "heartbeat.md", "tools.md", "identity.md",
                   "bootstrap.md"}
PROTECTED_DIRS = ("skills", "podklady/predpisy", "podklady/sablony")
READ_FORMATS = {
    # Markdown bez surového HTML, OpenXML a TeXu: do Wordu jde jen text, ne kód.
    ".md": "markdown-raw_html-raw_attribute-raw_tex",
    ".txt": "markdown-raw_html-raw_attribute-raw_tex",
    ".docx": "docx",
    ".odt": "odt",
    ".html": "html",
    ".htm": "html",
}
WRITE_FORMATS = {".md": "gfm", ".txt": "plain", ".docx": "docx", ".odt": "odt", ".html": "html"}
IMAGE_TYPES = {".png", ".jpg", ".jpeg", ".gif", ".bmp", ".tif", ".tiff", ".emf", ".wmf"}


class PrevodError(Exception):
    """Chyba, kterou umíme srozumitelně vysvětlit."""


def mozek() -> Path:
    return Path(os.path.realpath(MOZEK))


def inside(path: Path, folder: Path) -> bool:
    return path == folder or folder in path.parents


def resolve(text: str, base: Path | None = None) -> Path:
    """Cesta v Mozku. Relativní cesta se bere od aktuální složky, když je v Mozku, jinak od Mozku."""
    root = mozek()
    path = Path(text).expanduser()
    if not path.is_absolute():
        cwd = Path(os.path.realpath(os.getcwd()))
        path = (cwd if inside(cwd, root) else root) / path
    real = Path(os.path.realpath(path))
    if not inside(real, root):
        raise PrevodError(f"{text} je mimo složku Mozek. Převádím jen soubory v Mozku.")
    return real


def source(text: str, suffixes: set[str]) -> Path:
    path = resolve(text)
    if not path.is_file():
        raise PrevodError(f"{text} neexistuje nebo to není soubor.")
    if path.suffix.lower() not in suffixes:
        raise PrevodError(f"{path.name}: umím jen {', '.join(sorted(suffixes))}.")
    return path


def target(text: str, suffixes: set[str]) -> Path:
    path = resolve(text)
    rel = path.relative_to(mozek()).as_posix()
    if path.suffix.lower() not in suffixes:
        raise PrevodError(f"{path.name}: výsledek umím uložit jen jako {', '.join(sorted(suffixes))}.")
    if ("/" not in rel and path.name.lower() in PROTECTED_NAMES) or \
            any(rel == d or rel.startswith(d + "/") for d in PROTECTED_DIRS):
        raise PrevodError(f"{rel} je pravidlo, dovednost, předpis nebo šablona. To převod nepřepíše.")
    if not path.parent.is_dir():
        raise PrevodError(f"Složka {path.parent.relative_to(mozek())} neexistuje.")
    if path.is_dir():
        raise PrevodError(f"{rel} je složka.")
    return path


def run_tool(cmd: list[str], run=subprocess.run, stdin: str | None = None,
             cwd: Path | None = None) -> subprocess.CompletedProcess:
    try:
        result = run(cmd, capture_output=True, text=True, timeout=TIMEOUT, env=clean_env(), input=stdin,
                     cwd=str(cwd) if cwd else None)
    except FileNotFoundError:
        raise PrevodError(f"Chybí program {cmd[0]}. Nainstaluj: sudo apt install -y poppler-utils pandoc") from None
    except subprocess.TimeoutExpired:
        raise PrevodError(f"Převod trval déle než {TIMEOUT // 60} minut, zastavil jsem ho.") from None
    if result.returncode != 0:
        raise PrevodError(f"{cmd[0]} skončil chybou: {(result.stderr or '').strip()[:300]}")
    return result


def clean_env() -> dict[str, str]:
    """pandoc a pdftotext dostanou jen základní proměnné, žádné od agenta."""
    keep = {k: os.environ[k] for k in ("LANG", "LC_ALL", "LC_CTYPE") if k in os.environ}
    return {"PATH": "/usr/bin:/bin", "HOME": str(zaklad.DOMOV), **keep}


def cmd_pdf(src_text: str, out_text: str | None, layout: bool, pages: str | None, run=subprocess.run) -> int:
    src = source(src_text, {".pdf"})
    cmd = ["/usr/bin/pdftotext", "-enc", "UTF-8"]
    if layout:
        cmd.append("-layout")
    if pages:
        m = re.fullmatch(r"(\d+)(?:-(\d+))?", pages.strip())
        if not m:
            raise PrevodError("Strany piš jako 5 nebo 3-10.")
        cmd += ["-f", m[1], "-l", m[2] or m[1]]
    out = target(out_text, {".txt", ".md"}) if out_text else None
    cmd += [str(src), str(out) if out else "-"]
    result = run_tool(cmd, run)
    if out:
        print(f"Uloženo: {out.relative_to(mozek())} ({out.stat().st_size // 1024 or 1} kB)")
        return 0
    text = result.stdout
    if len(text) > MAX_PRINT:
        print(text[:MAX_PRINT])
        print(f"\n… text pokračuje ({len(text)} znaků). Celý ho ulož: agent-prevod pdf {src_text} soubor.txt")
    else:
        print(text)
    return 0


class Cleaner:
    """Projde dokument v podobě JSON z pandocu a nechá v něm jen text a bezpečné obrázky."""

    def __init__(self, base: Path):
        self.base = base
        self.root = mozek()
        self.removed = 0

    def image(self, target: str) -> str | None:
        if re.match(r"^data:image/(png|jpe?g|gif|bmp);base64,", target, re.IGNORECASE):
            return target  # obrázek přímo v dokumentu, nic se nestahuje
        if re.match(r"^[a-z][a-z0-9+.-]*:", target, re.IGNORECASE) or target.startswith(("//", "\\\\")):
            return None  # internet, file:, sdílená složka, disk Windows
        path = Path(urllib.parse.unquote(target))
        real = Path(os.path.realpath(path if path.is_absolute() else self.base / path))
        if inside(real, self.root) and real.is_file() and real.suffix.lower() in IMAGE_TYPES:
            return str(real)
        return None

    def items(self, items: list) -> list:
        out = []
        for x in items:
            kind = x.get("t") if isinstance(x, dict) else None
            if kind in ("RawBlock", "RawInline"):
                self.removed += 1
                continue
            if kind == "Image":
                safe = self.image(x["c"][2][0])
                if safe is None:
                    self.removed += 1
                    out.extend(self.items(x["c"][1]))  # místo obrázku jen jeho popisek
                    continue
                x["c"][2][0] = safe
            if kind == "Link" and not re.match(r"^(https?://|mailto:|#)", x["c"][2][0], re.IGNORECASE):
                self.removed += 1
                out.extend(self.items(x["c"][1]))  # odkaz na soubor nebo složku zůstane jen jako text
                continue
            out.append(self.node(x))
        return out

    def node(self, node):
        if isinstance(node, list):
            return self.items(node)
        if isinstance(node, dict):
            return {k: self.node(v) for k, v in node.items()}
        return node


def cmd_document(src_text: str, out_text: str, template: str | None, run=subprocess.run) -> int:
    src = source(src_text, set(READ_FORMATS))
    out = target(out_text, set(WRITE_FORMATS))
    if src == out:
        raise PrevodError("Vstup a výstup je stejný soubor.")
    # 1. Přečíst v režimu --sandbox: čtení nic nestahuje a nesahá na jiné soubory.
    raw = run_tool(["/usr/bin/pandoc", "--sandbox", "-f", READ_FORMATS[src.suffix.lower()], "-t", "json",
                    str(src)], run).stdout
    try:
        cleaner = Cleaner(src.parent)
        doc = cleaner.node(json.loads(raw))
    except (ValueError, KeyError, IndexError, TypeError, AttributeError):
        raise PrevodError("pandoc vrátil dokument, kterému nerozumím.") from None
    # 2. Zapsat vyčištěný dokument. Word a OpenDocument potřebují výchozí šablonu pandocu,
    #    proto se zapisují bez --sandbox. Dokument už ale nemá nic, co by se stahovalo.
    writer = WRITE_FORMATS[out.suffix.lower()]
    cmd = ["/usr/bin/pandoc", "-f", "json", "-t", writer, "-o", str(out)]
    if writer not in ("docx", "odt"):
        cmd.insert(1, "--sandbox")
    if template:
        ref = resolve(template)
        if not ref.is_file() or ref.suffix.lower() not in (".docx", ".odt") or \
                not inside(ref, mozek() / "podklady" / "sablony"):
            raise PrevodError("Šablona musí být soubor .docx nebo .odt ve složce podklady/sablony/.")
        cmd.append(f"--reference-doc={ref}")
    run_tool(cmd, run, stdin=json.dumps(doc), cwd=src.parent)
    note = f" (vynechal jsem {cleaner.removed}× kód, obrázek z internetu nebo odkaz na soubor)" if cleaner.removed else ""
    print(f"Uloženo: {out.relative_to(mozek())}{note}")
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="agent-prevod", description="Převod dokumentů ve složce Mozek.")
    sub = parser.add_subparsers(dest="cmd", required=True)
    p = sub.add_parser("pdf", help="text z PDF")
    p.add_argument("soubor")
    p.add_argument("vystup", nargs="?")
    p.add_argument("--layout", action="store_true", help="zachovat rozložení (tabulky, sloupce)")
    p.add_argument("--strany", help="jen některé strany, třeba 3-10")
    p = sub.add_parser("dokument", help="převod md, docx, odt, html, txt")
    p.add_argument("vstup")
    p.add_argument("vystup")
    p.add_argument("--sablona", help="šablona Wordu z podklady/sablony/")
    args = parser.parse_args(argv)
    try:
        if args.cmd == "pdf":
            return cmd_pdf(args.soubor, args.vystup, args.layout, args.strany)
        return cmd_document(args.vstup, args.vystup, args.sablona)
    except PrevodError as exc:
        print(f"Chyba: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
