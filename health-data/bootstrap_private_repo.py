#!/usr/bin/env python3
"""
bootstrap_private_repo.py – naplní SOUKROMÝ GitHub repo tímhle nástrojem a workflow,
aby stahování běželo samo každé ráno v GitHub Actions.

Zdravotní data nesmí do veřejného repa (webovky je veřejné), proto zvlášť.

Použití (spouštěj ze složky health-data):

  A) máš nainstalované gh CLI (https://cli.github.com) a jsi přihlášený (gh auth login):
       python bootstrap_private_repo.py
     → sám založí soukromý repo <tvůj-účet>/health-data, pushne obsah,
       nahraje secret HEALTH_TOKEN_JSON ze secrets/token.json a spustí první běh.

  B) bez gh CLI:
       1. založ soukromý repo na https://github.com/new (Name: health-data, Private, bez README)
       2. python bootstrap_private_repo.py https://github.com/<ucet>/health-data.git
       3. v repu Settings → Secrets and variables → Actions → New repository secret:
          Name HEALTH_TOKEN_JSON, Secret = celý obsah secrets/token.json
       4. Actions → „Health data – denní stažení“ → Run workflow

Co se do repa nahraje: pull.py, summarize.py, requirements.txt, README.md,
.github/workflows/pull.yml, .gitignore (secrets/ se ignoruje, data/ se commitují)
a případně už stažená data/ (pokud tu jsou).
"""

from __future__ import annotations

import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
FILES = ["pull.py", "summarize.py", "requirements.txt", "README.md"]
GITIGNORE = """# OAuth tajemství – nikdy necommitovat. Data se commitují (repo je soukromé).
secrets/
.venv/
__pycache__/
*.pyc
*.tmp
"""


def run(cmd: list[str], cwd: Path | None = None, check: bool = True, capture: bool = False) -> subprocess.CompletedProcess:
    print("  $ " + " ".join(cmd))
    return subprocess.run(cmd, cwd=cwd, check=check, text=True, capture_output=capture)


def have(cmd: str) -> bool:
    return shutil.which(cmd) is not None


def build_tree(dest: Path, with_data: bool) -> None:
    for name in FILES:
        shutil.copy2(HERE / name, dest / name)
    wf = dest / ".github" / "workflows"
    wf.mkdir(parents=True)
    shutil.copy2(HERE / "workflow" / "pull.yml", wf / "pull.yml")
    (dest / ".gitignore").write_text(GITIGNORE, encoding="utf-8")
    (dest / "data").mkdir()
    (dest / "data" / ".gitkeep").write_text("", encoding="utf-8")
    if with_data and (HERE / "data").is_dir():
        shutil.copytree(HERE / "data", dest / "data", dirs_exist_ok=True)
        print(f"  přidána i už stažená data z {HERE / 'data'}")


def main(argv: list[str]) -> int:
    if not have("git"):
        print("CHYBA: chybí git (https://git-scm.com).", file=sys.stderr)
        return 1
    remote = argv[1] if len(argv) > 1 else None
    use_gh = remote is None and have("gh")
    if remote is None and not use_gh:
        print("Zadej URL soukromého repa (viz nápověda nahoře), nebo nainstaluj gh CLI.", file=sys.stderr)
        return 1

    token_file = HERE / "secrets" / "token.json"
    if not token_file.exists():
        print("Pozor: secrets/token.json neexistuje – spusť nejdřív `python pull.py --auth-only`,\n"
              "jinak nebude co dát do secretu HEALTH_TOKEN_JSON.\n")

    tmp = Path(tempfile.mkdtemp(prefix="health-data-"))
    print(f"Skládám repo v {tmp}")
    build_tree(tmp, with_data=True)

    run(["git", "init", "-b", "main"], cwd=tmp)
    run(["git", "add", "-A"], cwd=tmp)
    run(["git", "-c", "user.name=health-data", "-c", "user.email=health-data@localhost",
         "commit", "-q", "-m", "Health data: nástroj + workflow"], cwd=tmp)

    if use_gh:
        login = run(["gh", "api", "user", "-q", ".login"], capture=True).stdout.strip()
        full = f"{login}/health-data"
        print(f"\nZakládám soukromý repo {full} přes gh…")
        run(["gh", "repo", "create", full, "--private", "--source", str(tmp), "--remote", "origin", "--push"])
        if token_file.exists():
            print("Nahrávám secret HEALTH_TOKEN_JSON…")
            with token_file.open("rb") as fh:
                subprocess.run(["gh", "secret", "set", "HEALTH_TOKEN_JSON", "--repo", full], stdin=fh, check=True)
            print("Spouštím první běh workflow…")
            subprocess.run(["gh", "workflow", "run", "pull.yml", "--repo", full], check=False)
        print(f"\nHotovo: https://github.com/{full}")
        if not token_file.exists():
            print("Ještě nahraj secret: gh secret set HEALTH_TOKEN_JSON --repo", full, "< secrets/token.json")
    else:
        run(["git", "remote", "add", "origin", remote], cwd=tmp)
        run(["git", "push", "-u", "origin", "main"], cwd=tmp)
        print(f"\nHotovo, obsah je v {remote}\nZbývá:\n"
              "  1. Settings → Secrets and variables → Actions → New repository secret\n"
              "     Name: HEALTH_TOKEN_JSON   Secret: celý obsah secrets/token.json\n"
              "  2. Actions → „Health data – denní stažení“ → Run workflow")
    print("\nKlon repa pro místní práci: git clone <url> a v něm `python summarize.py` nad data/.")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
