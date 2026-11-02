#!/usr/bin/env python3
"""Práce se soubory ve Windows pro osobního agenta: najít, přesunout, kopírovat, přejmenovat,
založit složku, vyhodit do koše a otevřít. Jen ve složkách ze ~/.config/agent/soubory.txt.

Nikdy nic nemaže a nic nepřepíše. Co má agent „vyhodit", přesune do Koše agenta, který
vysypeš ty. Každá akce se zapíše do historie a jde vrátit. Historie je mimo Mozek, agent
ji nemůže upravit.

    agent-soubory slozky                          povolené složky a jejich zkratky
    agent-soubory vypis "plocha:"                 co je ve složce
    agent-soubory najdi "smlouva" [--kde "dokumenty:"] [--typ pdf]
    agent-soubory presun "plocha:Projekt X" "dokumenty:Projekty"    do existující složky
    agent-soubory presun "plocha:*.pdf" "dokumenty:PDF"             hvězdička = víc souborů
    agent-soubory kopiruj "plocha:Nabídka.pdf" "dokumenty:Archiv"
    agent-soubory prejmenuj "plocha:a.pdf" "Nabídka 2026.pdf"
    agent-soubory slozka "dokumenty:Projekty/Nový projekt"
    agent-soubory kos "stazene:instalacka.zip"    do Koše agenta, nic se nemaže
    agent-soubory vrat [ČÍSLO | --od RRRR-MM-DD[THH:MM]]   vrátí akci (bez čísla poslední)
    agent-soubory historie [--pocet N] [--dni N]
    agent-soubory otevri "dokumenty:Projekty/Nabídka.pdf"  složku v Průzkumníku, dokument v jeho programu
    agent-soubory nastav [--znovu]                (spouštíš ty) najde tvoje složky ve Windows

Do složky, která se nahrává do cloudu (OneDrive), přesune nebo zkopíruje soubor zvenku jen
s volbou --do-cloudu. Ta v seznamu povolených příkazů není, takže ji vždycky schvaluješ ty.
"""

from __future__ import annotations

import argparse
import difflib
import errno
import fcntl
import fnmatch
import json
import os
import re
import shutil
import subprocess
import sys
import time
import unicodedata
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from pathlib import Path

import zaklad  # noqa: E402

CONFIG_DIR = zaklad.CONFIG_DIR
STATE_DIR = zaklad.STATE_DIR / "soubory"
MOZEK = zaklad.MOZEK

COPY_LIMIT = 5 * 1024**3      # nejvýš 5 GB na jedno kopírování
FREE_RESERVE = 10 * 1024**3   # na disku musí po kopírování zůstat aspoň 10 GB
MAX_ITEMS = 100               # nejvýš tolik položek v jednom příkazu
MAX_TRASH = 30                # do koše nejvýš tolik položek najednou
LIST_LIMIT = 200
FIND_LIMIT = 50
FIND_SECONDS = 30
FIND_DEPTH = 8
HIDDEN = {"desktop.ini", "thumbs.db", ".ds_store"}
SKIP_DIRS = {"node_modules", ".git", "$recycle.bin", "appdata", "system volume information"}
CLOUD = re.compile(r"(^|/)(onedrive|dropbox|google ?drive|icloud ?drive)", re.IGNORECASE)
# Co smí otevřít: složky a dokumenty. Nikdy programy, skripty, zástupce, archivy, weby ani
# dokumenty s makry (docm, xlsm, staré doc a xls).
OPEN_TYPES = {
    "pdf", "txt", "md", "docx", "xlsx", "pptx", "odt", "ods", "odp",
    "jpg", "jpeg", "png", "gif", "webp", "heic", "heif", "bmp", "tif", "tiff",
    "dwg", "dxf", "rvt", "rfa", "ifc", "pln", "skp", "3dm",
    "mp4", "mov", "mp3", "m4a", "wav",
}
RESERVED = re.compile(r"^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\..*)?$", re.IGNORECASE)
BAD_CHARS = re.compile(r'[<>:"/\\|?*\x00-\x1f]')
SYSTEM_DIRS = {"windows", "program files", "program files (x86)", "programdata", "users"}


class SouboryError(Exception):
    """Chyba, kterou umíme srozumitelně vysvětlit."""


def key(text: str) -> str:
    t = unicodedata.normalize("NFKD", text.strip().lower())
    return "".join(c for c in t if not unicodedata.combining(c))


# ---------- cesty Windows a Ubuntu ----------

def from_windows(text: str) -> Path:
    """C:\\Users\\x → /mnt/c/Users/x. Cesty z Ubuntu nechá být."""
    m = re.match(r"^([A-Za-z]):[\\/]*(.*)$", text.strip())
    if m:
        rest = [p for p in re.split(r"[\\/]+", m[2]) if p]
        return Path("/mnt", m[1].lower(), *rest)
    return Path(text.strip())


def to_windows(path: Path) -> str:
    parts = path.parts
    if len(parts) >= 3 and parts[1] == "mnt" and len(parts[2]) == 1:
        return parts[2].upper() + ":\\" + "\\".join(parts[3:])
    return str(path)


def parts_of(path: Path) -> tuple[str, ...]:
    """Na disku Windows (/mnt/…) nezáleží na velikosti písmen, jinde ano."""
    return tuple(p.casefold() for p in path.parts) if path.parts[1:2] == ("mnt",) else path.parts


def inside(path: Path, folder: Path) -> bool:
    a, b = parts_of(path), parts_of(folder)
    return a[: len(b)] == b


def rel_text(path: Path, base: Path) -> str:
    return "/".join(path.parts[len(base.parts):])


def exists(path: Path) -> bool:
    return os.path.lexists(path)


def size_text(n: int) -> str:
    for unit, step in (("GB", 1024**3), ("MB", 1024**2), ("kB", 1024)):
        if n >= step:
            return f"{n / step:.1f} {unit}".replace(".", ",")
    return f"{n} B"


def day_text(ts: float) -> str:
    d = datetime.fromtimestamp(ts)
    return f"{d.day}. {d.month}. {d.year}"


# ---------- povolené složky ----------

@dataclass
class Root:
    alias: str
    path: Path
    cloud: bool


@dataclass
class Config:
    roots: list[Root]
    trash: Path | None = None
    protected: list[Path] = field(default_factory=list)

    def root_of(self, path: Path) -> Root | None:
        best = None
        for root in self.roots:
            if inside(path, root.path) and (best is None or len(root.path.parts) > len(best.path.parts)):
                best = root
        return best

    def show(self, path: Path) -> str:
        if self.trash and inside(path, self.trash):
            base, alias = self.trash, "kos"
        else:
            root = self.root_of(path)
            if root is None:
                return to_windows(path)
            base, alias = root.path, root.alias
        return f"{alias}:" + rel_text(path, base)

    def is_cloud(self, path: Path) -> bool:
        root = self.root_of(path)
        return bool(root and root.cloud)


def forbidden_root(path: Path) -> str | None:
    """Kořen disku, celý profil, systémové složky a tvůj domov v Ubuntu povolit nejde."""
    parts = [p.lower() for p in path.parts]
    if path == Path("/") or inside(zaklad.DOMOV, path):
        return "je to celý disk nebo tvůj domov"
    if len(parts) >= 3 and parts[1] == "mnt" and len(parts[2]) == 1:
        if len(parts) == 3:
            return "je to celý disk"
        if parts[3] in SYSTEM_DIRS and (parts[3] != "users" or len(parts) <= 5):
            return "je to systémová složka nebo celý profil uživatele"
        if "appdata" in parts:
            return "je to nastavení programů (AppData)"
    return None


def load_config(path: Path | None = None) -> Config:
    path = path or CONFIG_DIR / "soubory.txt"
    if not path.exists():
        raise SouboryError(f"Chybí seznam povolených složek {path}. Spusť: agent-soubory nastav (NAVOD.md, krok 21).")
    cfg = Config([])
    for n, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        m = re.match(r"^([^=]+?)\s*=\s*(.+)$", line)
        if not m:
            raise SouboryError(f"{path}, řádek {n}: čekám „zkratka = cesta“.")
        alias, value = key(m[1]), m[2].strip().strip('"')
        target = Path(os.path.realpath(from_windows(value)))
        if alias == "kos":
            cfg.trash = target
            continue
        if not re.fullmatch(r"[a-z0-9-]{2,}", alias):
            raise SouboryError(f"{path}, řádek {n}: zkratka „{m[1]}“ smí mít jen písmena, číslice a pomlčku.")
        reason = forbidden_root(target)
        if reason:
            raise SouboryError(f"{path}, řádek {n}: {value} povolit nejde, {reason}. Povol jen konkrétní složku.")
        cfg.roots.append(Root(alias, target, bool(CLOUD.search(target.as_posix()))))
    if not cfg.roots:
        raise SouboryError(f"V {path} není žádná složka. Spusť: agent-soubory nastav")
    # Mozek, zálohy a nastavení agenta jsou nedotknutelné, i kdyby ležely v povolené složce.
    cfg.protected = [Path(os.path.realpath(MOZEK)), Path(os.path.realpath(CONFIG_DIR)),
                     Path(os.path.realpath(STATE_DIR.parent))]
    try:
        for line in (CONFIG_DIR / "zaloha.env").read_text(encoding="utf-8").splitlines():
            if line.startswith("ZALOHY="):
                cfg.protected.append(Path(os.path.realpath(line.split("=", 1)[1].strip())))
    except OSError:
        pass
    return cfg


# ---------- výběr cesty z argumentu ----------

def resolve(cfg: Config, text: str) -> Path:
    """„plocha:Projekt X“, „plocha/Projekt X“, „C:\\Users\\…“ nebo „/mnt/c/…“ → cesta."""
    raw = text.strip()
    m = re.match(r"^([^:\\/]{2,}):(.*)$", raw) or re.match(r"^([^:\\/]{2,})(?:[\\/](.*))?$", raw)
    base = None
    if m and (key(m[1]) == "kos" or any(r.alias == key(m[1]) for r in cfg.roots)):
        if key(m[1]) == "kos":
            if not cfg.trash:
                raise SouboryError("Koš agenta není nastavený (řádek „kos = …“ v soubory.txt).")
            base = cfg.trash
        else:
            base = next(r.path for r in cfg.roots if r.alias == key(m[1]))
        rel = m[2] or ""
    elif re.match(r"^[A-Za-z]:[\\/]", raw) or raw.startswith("/"):
        rel = raw
    else:
        aliases = ", ".join(f"{r.alias}:" for r in cfg.roots)
        raise SouboryError(f"Nevím, kde je „{raw}“. Piš cestu se zkratkou složky, třeba „{cfg.roots[0].alias}:Projekt“. "
                           f"Zkratky: {aliases}")
    parts = [p for p in re.split(r"[\\/]+", rel) if p not in ("", ".")]
    if ".." in parts:
        raise SouboryError("V cestě nesmí být „..“.")
    if base is not None:
        path = base.joinpath(*parts)
    else:
        path = from_windows(raw) if re.match(r"^[A-Za-z]:", raw) else Path("/", *parts)
    if path.parent != path:
        path = Path(os.path.realpath(path.parent)) / path.name
    if base is not None and not parts:
        path = base
    if cfg.root_of(path) is None and not (cfg.trash and inside(path, cfg.trash)):
        aliases = ", ".join(f"{r.alias}:" for r in cfg.roots)
        raise SouboryError(f"„{raw}“ je mimo povolené složky ({aliases}). Jinde se soubory nepracuji.")
    if any(inside(path, p) for p in cfg.protected):
        raise SouboryError(f"„{raw}“ je Mozek, záloha nebo nastavení agenta. Na to nesahám.")
    return path


def hint(path: Path) -> str:
    """Podobná jména ve stejné složce, když se agent přepíše nebo vynechá diakritiku."""
    try:
        names = [e.name for e in os.scandir(path.parent)]
    except OSError:
        return ""
    wanted = key(path.name)
    close = [n for n in names if wanted and (wanted in key(n) or key(n) in wanted)]
    if not close:
        close = difflib.get_close_matches(path.name, names, n=3, cutoff=0.6)
    return (" Nemyslíš: " + ", ".join(f"„{n}“" for n in close[:3]) + "?") if close else ""


def existing(cfg: Config, text: str) -> Path:
    path = resolve(cfg, text)
    if not exists(path):
        raise SouboryError(f"{cfg.show(path)} neexistuje.{hint(path)}")
    return path


def item(cfg: Config, text: str) -> Path:
    """Existující soubor nebo složka, se kterou se smí hýbat (ne celá povolená složka)."""
    path = existing(cfg, text)
    for root in cfg.roots:
        if inside(root.path, path):
            raise SouboryError(f"{cfg.show(path)} je celá povolená složka, s tou nehýbu.")
    if cfg.trash and inside(cfg.trash, path):
        raise SouboryError("S Košem agenta jako celkem nehýbu.")
    if any(inside(p, path) for p in cfg.protected):
        raise SouboryError(f"Ve {cfg.show(path)} je Mozek, záloha nebo nastavení agenta. S tím nehýbu.")
    if path.name.lower() in HIDDEN:
        raise SouboryError(f"{path.name} je systémový soubor Windows, nechám ho být.")
    return path


def expand(cfg: Config, texts: list[str], limit: int = MAX_ITEMS) -> list[Path]:
    """Položky z argumentů. Hvězdička v posledním jméně vybere víc souborů v jedné složce."""
    out: list[Path] = []
    for text in texts:
        name = re.split(r"[\\/:]", text.strip())[-1]
        if "*" in name or "?" in name:
            folder = existing(cfg, text.strip()[: len(text.strip()) - len(name)] or text)
            if not folder.is_dir():
                raise SouboryError(f"{cfg.show(folder)} není složka.")
            found = sorted(Path(e.path) for e in os.scandir(folder)
                           if fnmatch.fnmatch(key(e.name), key(name)) and e.name.lower() not in HIDDEN
                           and not e.name.startswith((".", "~$")))
            if not found:
                raise SouboryError(f"V {cfg.show(folder)} nic neodpovídá „{name}“.")
            out += [item(cfg, cfg.show(p)) for p in found]
        else:
            out.append(item(cfg, text))
    unique = list(dict.fromkeys(out))
    if len(unique) > limit:
        raise SouboryError(f"To je {len(unique)} položek najednou, nejvýš smím {limit}. Rozděl to na menší části.")
    return unique


def valid_name(name: str) -> str:
    name = name.strip()
    if not name or name in (".", "..") or len(name) > 200:
        raise SouboryError("Jméno je prázdné nebo moc dlouhé.")
    if BAD_CHARS.search(name):
        raise SouboryError(f"Jméno „{name}“ obsahuje znak, který Windows nedovolí (< > : \" / \\ | ? *).")
    if name.endswith((".", " ")):
        raise SouboryError(f"Jméno „{name}“ nesmí končit tečkou ani mezerou.")
    if RESERVED.match(name):
        raise SouboryError(f"„{name}“ je ve Windows vyhrazené jméno.")
    return name


def free_path(folder: Path, name: str, is_dir: bool, taken: set[str] | None = None) -> Path:
    """Volné jméno ve složce. Když už tam stejné je, přidá (2), (3)… Nic nepřepíše."""
    taken = taken or set()
    target = folder / name
    if not exists(target) and str(target).casefold() not in taken:
        return target
    stem, suffix = (name, "") if is_dir or "." not in name[1:] else (name.rsplit(".", 1)[0], "." + name.rsplit(".", 1)[1])
    for i in range(2, 1000):
        target = folder / f"{stem} ({i}){suffix}"
        if not exists(target) and str(target).casefold() not in taken:
            return target
    raise SouboryError(f"Ve složce {folder} je moc položek se jménem {name}.")


def same_disk(a: Path, b: Path) -> bool:
    try:
        return os.stat(a).st_dev == os.stat(b).st_dev
    except OSError:
        return False


def explain(exc: OSError, what: str) -> SouboryError:
    if exc.errno in (errno.EACCES, errno.EPERM, errno.EBUSY, errno.ETXTBSY):
        return SouboryError(f"{what}: soubor je asi otevřený v jiném programu, nebo na něj nemáš práva. Zavři ho a zkus to znovu.")
    if exc.errno == errno.EXDEV:
        return SouboryError(f"{what}: přesun mezi disky neumím bezpečně vrátit. Použij kopiruj.")
    if exc.errno == errno.ENOSPC:
        return SouboryError(f"{what}: na disku není místo.")
    return SouboryError(f"{what}: {exc.strerror or exc}")


# ---------- historie ----------

def history_path() -> Path:
    return STATE_DIR / "historie.jsonl"


def load_history() -> list[dict]:
    try:
        lines = history_path().read_text(encoding="utf-8").splitlines()
    except FileNotFoundError:
        return []
    out = []
    for line in lines:
        try:
            out.append(json.loads(line))
        except ValueError:
            continue
    return out


def record(command: str, text: str, steps: list[dict], **extra) -> int:
    STATE_DIR.mkdir(parents=True, exist_ok=True)
    with open(history_path(), "a+", encoding="utf-8") as f:
        fcntl.flock(f, fcntl.LOCK_EX)
        f.seek(0)
        ids = [json.loads(line).get("id", 0) for line in f.read().splitlines() if line.strip().startswith("{")]
        number = max(ids, default=0) + 1
        entry = {"id": number, "cas": datetime.now().isoformat(timespec="seconds"), "prikaz": command,
                 "popis": text, "kroky": steps, **extra}
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")
    return number


def reverted_ids(entries: list[dict]) -> set[int]:
    return {i for e in entries for i in e.get("vraceno", [])}


# ---------- příkazy ----------

def cmd_folders(cfg: Config) -> None:
    print("Povolené složky (měnit je smíš jen ty v ~/.config/agent/soubory.txt):")
    for r in cfg.roots:
        note = [] if r.path.is_dir() else ["složka neexistuje"]
        if r.cloud:
            note.append("nahrává se do cloudu")
        print(f"{r.alias + ':':12} {to_windows(r.path)}" + (f" ({', '.join(note)})" if note else ""))
    if cfg.trash:
        print(f"{'kos:':12} {to_windows(cfg.trash)} (sem dávám, co mám vyhodit; vysypeš ho ty)")


def listing_line(cfg: Config, entry: os.DirEntry, show_path: bool = False) -> str:
    try:
        st = entry.stat()
        is_dir = entry.is_dir()
    except OSError:
        return f"?       {entry.name}"
    name = cfg.show(Path(entry.path)) if show_path else entry.name
    size = "" if is_dir else size_text(st.st_size)
    return f"{'složka' if is_dir else 'soubor'}  {name}" + (f"  {size}" if size else "") + f"  {day_text(st.st_mtime)}"


def visible(entry: os.DirEntry, show_all: bool) -> bool:
    return show_all or not (entry.name.lower() in HIDDEN or entry.name.startswith((".", "~$")))


def cmd_list(cfg: Config, text: str, show_all: bool = False) -> None:
    path = existing(cfg, text)
    if not path.is_dir():
        st = path.stat()
        print(f"soubor  {cfg.show(path)}  {size_text(st.st_size)}  {day_text(st.st_mtime)}  ({to_windows(path)})")
        return
    entries = sorted((e for e in os.scandir(path) if visible(e, show_all)),
                     key=lambda e: (not e.is_dir(), key(e.name)))
    dirs = sum(1 for e in entries if e.is_dir())
    print(f"{cfg.show(path)} ({to_windows(path)}): složek {dirs}, souborů {len(entries) - dirs}")
    for e in entries[:LIST_LIMIT]:
        print(listing_line(cfg, e))
    if len(entries) > LIST_LIMIT:
        print(f"… a dalších {len(entries) - LIST_LIMIT}. Zužuj hledáním: agent-soubory najdi")


def cmd_find(cfg: Config, query: str, where: str | None = None, types: str | None = None,
             seconds: float = FIND_SECONDS) -> None:
    words = key(query).split()
    if not words and not types:
        raise SouboryError("Napiš, co hledáš (část jména), nebo typ souboru (--typ pdf).")
    wanted = {t.strip(". ").lower() for t in (types or "").split(",") if t.strip(". ")}
    starts = [existing(cfg, where)] if where else [r.path for r in cfg.roots if r.path.is_dir()]
    found: list[tuple[float, os.DirEntry]] = []
    deadline = time.monotonic() + seconds
    stopped = False
    stack = [(p, 0) for p in reversed(starts)]
    while stack and not stopped:
        folder, depth = stack.pop()
        try:
            entries = list(os.scandir(folder))
        except OSError:
            continue
        for e in entries:
            if time.monotonic() > deadline:
                stopped = True
                break
            if not visible(e, False):
                continue
            try:
                is_dir = e.is_dir(follow_symlinks=False)
            except OSError:
                continue
            name = key(e.name)
            if all(w in name for w in words) and (not wanted or (not is_dir and name.rsplit(".", 1)[-1] in wanted)):
                try:
                    found.append((e.stat().st_mtime, e))
                except OSError:
                    pass
            if is_dir and depth < FIND_DEPTH and name not in SKIP_DIRS and not any(inside(Path(e.path), p) for p in cfg.protected):
                stack.append((Path(e.path), depth + 1))
    found.sort(key=lambda x: -x[0])
    place = cfg.show(starts[0]) if where else ", ".join(f"{r.alias}:" for r in cfg.roots)
    print(f"Nalezeno {len(found)} (hledal jsem v {place}" + (", hledání jsem po 30 s ukončil, zužuj --kde" if stopped else "") + "):")
    for _, e in found[:FIND_LIMIT]:
        print(listing_line(cfg, e, show_path=True))
    if len(found) > FIND_LIMIT:
        print(f"… a dalších {len(found) - FIND_LIMIT}, nejnovější jsou nahoře.")


def target_folder(cfg: Config, text: str) -> Path:
    folder = resolve(cfg, text)
    if cfg.trash and inside(folder, cfg.trash):
        raise SouboryError("Do Koše agenta dávej věci příkazem kos.")
    if not exists(folder):
        raise SouboryError(f"Složka {cfg.show(folder)} neexistuje. Založ ji: agent-soubory slozka \"{cfg.show(folder)}\"{hint(folder)}")
    if not folder.is_dir():
        raise SouboryError(f"{cfg.show(folder)} je soubor, ne složka. Přejmenovat jde příkazem prejmenuj.")
    return folder


def check_cloud(cfg: Config, sources: list[Path], folder: Path, allowed: bool) -> None:
    if allowed or not cfg.is_cloud(folder):
        return
    outside = [s for s in sources if not cfg.is_cloud(s)]
    if outside:
        raise SouboryError(
            f"{cfg.show(folder)} se nahrává do cloudu (OneDrive). Tím by {len(outside)} položek odešlo z počítače ven. "
            "Zeptej se mě. Když řeknu ano, spusť stejný příkaz s volbou --do-cloudu (schvaluju ho v aplikaci).")


def tree_size(path: Path, limit: int) -> int:
    if not path.is_dir() or path.is_symlink():
        return path.lstat().st_size
    total = 0
    for folder, dirs, files in os.walk(path):
        for name in files:
            try:
                total += os.lstat(os.path.join(folder, name)).st_size
            except OSError:
                pass
            if total > limit:
                return total
    return total


def cmd_move(cfg: Config, sources_text: list[str], dest_text: str, copy: bool = False, cloud_ok: bool = False) -> int:
    sources = expand(cfg, sources_text)
    folder = target_folder(cfg, dest_text)
    check_cloud(cfg, sources, folder, cloud_ok)
    plans: list[tuple[Path, Path]] = []
    taken: set[str] = set()
    for src in sources:
        if src.is_dir() and inside(folder, src):
            raise SouboryError(f"{cfg.show(src)} nejde přesunout do sebe sama.")
        if not copy and src.parent == folder:
            raise SouboryError(f"{cfg.show(src)} už ve složce {cfg.show(folder)} je.")
        if not copy and not same_disk(src.parent, folder):
            raise SouboryError(f"{cfg.show(src)} je na jiném disku než {cfg.show(folder)}. Přesun mezi disky neumím "
                               "bezpečně vrátit, použij kopiruj.")
        dst = free_path(folder, src.name, src.is_dir(), taken)  # i dva stejná jména z různých složek
        taken.add(str(dst).casefold())
        plans.append((src, dst))
    if copy:
        total = sum(tree_size(s, COPY_LIMIT + 1) for s, _ in plans)
        if total > COPY_LIMIT:
            raise SouboryError(f"Kopie by měla přes {size_text(COPY_LIMIT)}, tolik najednou nekopíruji.")
        if shutil.disk_usage(folder).free - total < FREE_RESERVE:
            raise SouboryError(f"Po kopii by na disku zbylo míň než {size_text(FREE_RESERVE)} místa. Nekopíruji.")
    steps, lines, failure = [], [], None
    for src, dst in plans:
        try:
            if copy:
                if src.is_dir() and not src.is_symlink():
                    shutil.copytree(src, dst, symlinks=True)
                else:
                    shutil.copy2(src, dst, follow_symlinks=False)
            else:
                os.rename(src, dst)
        except OSError as exc:
            if copy and exists(dst):  # rozpracovaná kopie: nesmazat, ale uklidit do koše
                steps.append({"akce": "kopie", "z": str(src), "do": str(dst)})
            failure = explain(exc, cfg.show(src))
            break
        steps.append({"akce": "kopie" if copy else "presun", "z": str(src), "do": str(dst)})
        renamed = "" if dst.name == src.name else f" (jméno {src.name} už tam bylo)"
        lines.append(f"{cfg.show(src)} → {cfg.show(dst)}{renamed}")
    if steps:
        number = record("kopiruj" if copy else "presun", f"{len(steps)}× do {cfg.show(folder)}", steps)
        print(("Zkopírováno" if copy else "Přesunuto") + f" (akce {number}, vrátíš: agent-soubory vrat {number}):")
        print("\n".join(lines))
        if cfg.is_cloud(folder) and any(not cfg.is_cloud(s) for s, _ in plans):
            print(f"Pozor: {cfg.show(folder)} se nahrává do cloudu (OneDrive).")
    if failure:
        raise failure
    return 0


def cmd_rename(cfg: Config, text: str, new_name: str) -> int:
    src = item(cfg, text)
    name = valid_name(new_name)
    dst = src.parent / name
    if exists(dst) and not os.path.samefile(src, dst):
        raise SouboryError(f"{cfg.show(dst)} už existuje. Vyber jiné jméno.")
    if src.suffix and not Path(name).suffix and src.is_file():
        name_note = f" Pozor: nové jméno nemá příponu {src.suffix}, Windows ho pak neotevře správným programem."
    else:
        name_note = ""
    try:
        os.rename(src, dst)
    except OSError as exc:
        raise explain(exc, cfg.show(src)) from None
    number = record("prejmenuj", f"{cfg.show(src)} → {name}", [{"akce": "presun", "z": str(src), "do": str(dst)}])
    print(f"Přejmenováno (akce {number}, vrátíš: agent-soubory vrat {number}): {cfg.show(src)} → {cfg.show(dst)}{name_note}")
    return 0


def cmd_mkdir(cfg: Config, text: str) -> int:
    path = resolve(cfg, text)
    if cfg.trash and inside(path, cfg.trash):
        raise SouboryError("V Koši agenta složky nezakládám.")
    if exists(path):
        print(f"{cfg.show(path)} už existuje, nic jsem nezaložil.")
        return 0
    root = cfg.root_of(path)
    new = []
    p = path
    while not exists(p) and p != root.path:
        valid_name(p.name)
        new.append(p)
        p = p.parent
    steps = []
    try:
        for folder in reversed(new):
            folder.mkdir()
            steps.append({"akce": "slozka", "do": str(folder)})
    except OSError as exc:
        if steps:
            record("slozka", cfg.show(path), steps)
        raise explain(exc, cfg.show(path)) from None
    number = record("slozka", cfg.show(path), steps)
    print(f"Založeno (akce {number}, vrátíš: agent-soubory vrat {number}): {cfg.show(path)}")
    return 0


def trash_path(cfg: Config, src: Path, now: datetime) -> Path:
    root = cfg.root_of(src)
    rel = src.parts[len(root.path.parts):]
    folder = cfg.trash.joinpath(now.strftime("%Y-%m-%d"), root.alias, *rel[:-1])
    return free_path(folder, src.name, src.is_dir())


def move_to_trash(cfg: Config, src: Path, now: datetime) -> Path:
    dst = trash_path(cfg, src, now)
    dst.parent.mkdir(parents=True, exist_ok=True)
    os.rename(src, dst)
    return dst


def cmd_trash(cfg: Config, texts: list[str], now: datetime | None = None) -> int:
    if not cfg.trash:
        raise SouboryError("Koš agenta není nastavený. Do soubory.txt patří řádek „kos = C:\\Users\\<jméno>\\Koš agenta“.")
    now = now or datetime.now()
    sources = expand(cfg, texts, limit=MAX_TRASH)
    for src in sources:
        if inside(src, cfg.trash):
            raise SouboryError(f"{cfg.show(src)} už v koši je.")
        if not same_disk(src.parent, cfg.trash.parent if not cfg.trash.exists() else cfg.trash):
            raise SouboryError(f"{cfg.show(src)} je na jiném disku než Koš agenta. Vyhoď ho ručně do koše Windows.")
    cfg.trash.mkdir(parents=True, exist_ok=True)
    steps, lines, failure = [], [], None
    for src in sources:
        try:
            dst = move_to_trash(cfg, src, now)
        except OSError as exc:
            failure = explain(exc, cfg.show(src))
            break
        steps.append({"akce": "kos", "z": str(src), "do": str(dst)})
        lines.append(f"{cfg.show(src)} → {cfg.show(dst)}")
    if steps:
        number = record("kos", f"{len(steps)}× do koše", steps)
        print(f"V Koši agenta (akce {number}, vrátíš: agent-soubory vrat {number}). Nic se nesmazalo:")
        print("\n".join(lines))
    if failure:
        raise failure
    return 0


def undo_step(cfg: Config, step: dict, now: datetime) -> tuple[dict | None, str]:
    """Vrátí jeden krok. Vrací (krok pro historii, popis) nebo vyhodí SouboryError."""
    action = step["akce"]
    dst = Path(step["do"])
    if action in ("presun", "kos"):
        src = Path(step["z"])
        if not exists(dst):
            raise SouboryError(f"{cfg.show(dst)} už tam není, nemám co vracet.")
        if exists(src):
            raise SouboryError(f"Na původním místě {cfg.show(src)} už je jiná položka, vracet ji nebudu.")
        if cfg.root_of(src) is None and not (cfg.trash and inside(src, cfg.trash)):
            raise SouboryError(f"{to_windows(src)} už není v povolených složkách.")
        made = not src.parent.exists()
        src.parent.mkdir(parents=True, exist_ok=True)
        os.rename(dst, src)
        return {"akce": "presun", "z": str(dst), "do": str(src)}, f"{cfg.show(dst)} → {cfg.show(src)}" + \
            (" (původní složku jsem znovu založil)" if made else "")
    if action == "kopie":
        if not exists(dst):
            return None, f"kopie {cfg.show(dst)} už tam není"
        if not cfg.trash:
            raise SouboryError("Koš agenta není nastavený, kopii nemám kam uklidit.")
        cfg.trash.mkdir(parents=True, exist_ok=True)
        moved = move_to_trash(cfg, dst, now)
        return {"akce": "kos", "z": str(dst), "do": str(moved)}, f"kopie {cfg.show(dst)} → {cfg.show(moved)}"
    if action == "slozka":
        if not exists(dst):
            return None, f"složka {cfg.show(dst)} už neexistuje"
        if any(os.scandir(dst)):
            raise SouboryError(f"Složka {cfg.show(dst)} už není prázdná, nechám ji být.")
        dst.rmdir()  # jen prázdnou složku, kterou agent sám založil
        return None, f"prázdná složka {cfg.show(dst)} je pryč"
    raise SouboryError(f"Neznámý krok {action}.")


def cmd_undo(cfg: Config, number: int | None = None, since: str | None = None, now: datetime | None = None) -> int:
    now = now or datetime.now()
    entries = load_history()
    done = reverted_ids(entries)
    actions = [e for e in entries if e.get("prikaz") != "vrat" and e.get("id") not in done]
    if number is not None:
        chosen = [e for e in entries if e.get("id") == number]
        if not chosen:
            raise SouboryError(f"Akci {number} v historii nemám.")
        if number in done:
            raise SouboryError(f"Akce {number} už je vrácená.")
        if chosen[0].get("prikaz") == "vrat":
            raise SouboryError(f"Akce {number} je sama vrácení. Původní stav obnov znovu původním příkazem.")
    elif since is not None:
        try:
            start = datetime.fromisoformat(since)
        except ValueError:
            raise SouboryError("Čas piš jako RRRR-MM-DD nebo RRRR-MM-DDTHH:MM.") from None
        chosen = [e for e in actions if datetime.fromisoformat(e["cas"]) >= start]
        if not chosen:
            raise SouboryError(f"Od {since} jsem se soubory nic neudělal.")
    else:
        if not actions:
            raise SouboryError("Nemám co vracet.")
        chosen = [actions[-1]]
    chosen.sort(key=lambda e: -e["id"])
    steps, lines, problems, ids = [], [], [], []
    for entry in chosen:
        undone = 0
        for step in reversed(entry.get("kroky", [])):
            try:
                new, text = undo_step(cfg, step, now)
            except SouboryError as exc:
                problems.append(f"akce {entry['id']}: {exc}")
                continue
            except OSError as exc:
                problems.append(f"akce {entry['id']}: {explain(exc, cfg.show(Path(step['do'])))}")
                continue
            undone += 1
            if new:
                steps.append(new)
            lines.append(text)
        if undone:  # akce, ze které se nevrátilo nic, zůstává nevrácená
            ids.append(entry["id"])
    if ids:
        number_new = record("vrat", "vráceno " + ", ".join(map(str, ids)), steps, vraceno=ids, chyby=problems)
        print(f"Vráceno (akce {', '.join(map(str, ids))}, záznam {number_new}):")
        print("\n".join(lines))
    else:
        print("Nic se nevrátilo.")
    if problems:
        print("Nešlo vrátit:\n" + "\n".join(problems))
        return 1
    return 0


def cmd_history(cfg: Config, count: int = 10, days: int | None = None, now: datetime | None = None) -> int:
    now = now or datetime.now()
    entries = load_history()
    if days is not None:  # 0 = dnes, 1 = včera a dnes…
        start = (now - timedelta(days=days)).replace(hour=0, minute=0, second=0, microsecond=0)
        entries = [e for e in entries if datetime.fromisoformat(e["cas"]) >= start]
    done = {i: e["id"] for e in entries for i in e.get("vraceno", [])}
    shown = entries[-count:]
    if not shown:
        print("Se soubory jsem zatím nic nedělal." if days is None else "V tom období jsem se soubory nic nedělal.")
        return 0
    for e in shown:
        when = datetime.fromisoformat(e["cas"])
        first = e.get("kroky", [{}])[0] if e.get("kroky") else {}
        detail = e.get("popis", "")
        if first.get("z") and len(e.get("kroky", [])) == 1:
            detail = f"{cfg.show(Path(first['z']))} → {cfg.show(Path(first['do']))}"
        elif first.get("do") and e.get("prikaz") == "slozka":
            detail = cfg.show(Path(e["kroky"][-1]["do"]))
        note = f"  (vráceno záznamem {done[e['id']]})" if e["id"] in done else ""
        print(f"{e['id']:>4}  {when.day}. {when.month}. {when:%H:%M}  {e['prikaz']:9} {detail}{note}")
    return 0


def cmd_open(cfg: Config, text: str, run=subprocess.run) -> int:
    path = existing(cfg, text)
    suffix = path.suffix.lower().lstrip(".")
    if not path.is_dir() and suffix not in OPEN_TYPES:
        raise SouboryError(f"Soubory typu .{suffix or '?'} neotvírám. Otevírám jen složky a dokumenty "
                           "(PDF, Office bez maker, obrázky, výkresy), nikdy programy, skripty, zástupce ani archivy.")
    windows = to_windows(path)
    # Cesta jde do PowerShellu proměnnou prostředí, ne v textu příkazu, takže ani zvláštní
    # znaky ve jméně souboru nic nespustí.
    env = dict(os.environ, AGENT_CESTA=windows)
    env["WSLENV"] = ":".join(x for x in (os.environ.get("WSLENV", ""), "AGENT_CESTA") if x)
    try:
        result = run(["powershell.exe", "-NoProfile", "-NonInteractive", "-Command",
                      "Invoke-Item -LiteralPath $env:AGENT_CESTA"], env=env, capture_output=True, text=True, timeout=60)
    except (OSError, subprocess.TimeoutExpired) as exc:
        raise SouboryError(f"Program ve Windows se nepodařilo spustit ({exc}).") from None
    if result.returncode != 0:
        raise SouboryError(f"Windows soubor neotevřely: {(result.stderr or result.stdout).strip()[:200]}")
    print(f"Otevřeno na počítači: {cfg.show(path)}")
    return 0


DETECT = r"""
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$f = [ordered]@{
  plocha = [Environment]::GetFolderPath('Desktop')
  dokumenty = [Environment]::GetFolderPath('MyDocuments')
  stazene = (New-Object -ComObject Shell.Application).NameSpace('shell:Downloads').Self.Path
  obrazky = [Environment]::GetFolderPath('MyPictures')
  videa = [Environment]::GetFolderPath('MyVideos')
}
foreach ($k in $f.Keys) { "$k=$($f[$k])" }
"profil=$env:USERPROFILE"
"""


def cmd_setup(again: bool = False, run=subprocess.run) -> int:
    path = CONFIG_DIR / "soubory.txt"
    if path.exists() and not again:
        print(f"{path} už existuje, nic jsem neměnil. Uprav ho v editoru, nebo spusť agent-soubory nastav --znovu.")
        return 0
    try:
        out = run(["powershell.exe", "-NoProfile", "-NonInteractive", "-Command", DETECT],
                  capture_output=True, text=True, timeout=120).stdout
    except (OSError, subprocess.TimeoutExpired):
        raise SouboryError("Nenašel jsem Windows (powershell.exe). Spusť to v Ubuntu ve WSL.") from None
    found = dict(line.strip().split("=", 1) for line in out.splitlines() if "=" in line and line.strip())
    profile = found.pop("profil", "")
    if not profile:
        raise SouboryError("Windows nevrátily tvoje složky. Vyplň soubory.txt ručně podle NAVOD.md, krok 21.")
    lines = ["# Složky, ve kterých smí agent pracovat se soubory (agent-soubory). Měnit je smíš jen ty.",
             "# Jedna na řádek: zkratka = cesta. Agent v nich smí hledat, přesouvat, kopírovat,",
             "# přejmenovat, zakládat složky a otevírat dokumenty. Nic nemaže a nic nepřepíše.",
             "# Další složku přidáš řádkem, třeba: projekty = D:\\Projekty", ""]
    lines += [f"{k} = {v}" for k, v in found.items() if v]
    lines += ["", "# Kam agent dává, co má vyhodit. Vysypeš ho ty.", f"kos = {profile}\\Koš agenta", ""]
    CONFIG_DIR.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(lines), encoding="utf-8")
    os.chmod(path, 0o600)
    print(f"Uloženo do {path}:")
    print("\n".join(line for line in lines if line and not line.startswith("#")))
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="agent-soubory", description="Bezpečná práce se soubory ve Windows.")
    sub = parser.add_subparsers(dest="cmd", required=True)
    sub.add_parser("slozky", help="povolené složky a zkratky")
    p = sub.add_parser("vypis", help="co je ve složce")
    p.add_argument("cesta")
    p.add_argument("--vse", action="store_true", help="i skryté a systémové soubory")
    p = sub.add_parser("najdi", help="hledá podle jména")
    p.add_argument("text", nargs="?", default="")
    p.add_argument("--kde")
    p.add_argument("--typ", help="přípony oddělené čárkou, třeba pdf,docx")
    for name in ("presun", "kopiruj"):
        p = sub.add_parser(name, help=f"{name} do existující složky")
        p.add_argument("zdroje", nargs="+")
        p.add_argument("cil")
        p.add_argument("--do-cloudu", action="store_true", help="smí i do složky, která se nahrává do cloudu")
    p = sub.add_parser("prejmenuj")
    p.add_argument("cesta")
    p.add_argument("jmeno")
    p = sub.add_parser("slozka", help="založí složku")
    p.add_argument("cesta")
    p = sub.add_parser("kos", help="přesune do Koše agenta")
    p.add_argument("cesty", nargs="+")
    p = sub.add_parser("vrat", help="vrátí akci")
    p.add_argument("cislo", nargs="?", type=int)
    p.add_argument("--od")
    p = sub.add_parser("historie")
    p.add_argument("--pocet", type=int, default=10)
    p.add_argument("--dni", type=int)
    p = sub.add_parser("otevri", help="otevře složku nebo dokument na počítači")
    p.add_argument("cesta")
    p = sub.add_parser("nastav", help="najde tvoje složky ve Windows (spouštíš ty)")
    p.add_argument("--znovu", action="store_true")
    args = parser.parse_args(argv)
    try:
        if args.cmd == "nastav":
            return cmd_setup(args.znovu)
        cfg = load_config()
        if args.cmd == "slozky":
            cmd_folders(cfg)
            return 0
        if args.cmd == "vypis":
            cmd_list(cfg, args.cesta, args.vse)
            return 0
        if args.cmd == "najdi":
            cmd_find(cfg, args.text, args.kde, args.typ)
            return 0
        if args.cmd in ("presun", "kopiruj"):
            return cmd_move(cfg, args.zdroje, args.cil, copy=args.cmd == "kopiruj", cloud_ok=args.do_cloudu)
        if args.cmd == "prejmenuj":
            return cmd_rename(cfg, args.cesta, args.jmeno)
        if args.cmd == "slozka":
            return cmd_mkdir(cfg, args.cesta)
        if args.cmd == "kos":
            return cmd_trash(cfg, args.cesty)
        if args.cmd == "vrat":
            return cmd_undo(cfg, args.cislo, args.od)
        if args.cmd == "historie":
            return cmd_history(cfg, max(1, args.pocet), args.dni)
        return cmd_open(cfg, args.cesta)
    except SouboryError as exc:
        print(f"Chyba: {exc}", file=sys.stderr)
        return 1
    except OSError as exc:
        print(f"Chyba: {explain(exc, 'soubor')}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
