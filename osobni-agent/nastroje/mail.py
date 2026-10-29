#!/usr/bin/env python3
"""Hlídání e-mailu pro osobního agenta: jen čtení přes IMAP a ukládání konceptů.

Skript nic neodesílá, nic nemaže a nic neoznačuje jako přečtené.
Přihlašovací údaje čte z ~/.config/agent/mail.env (KLÍČ=hodnota, práva 600):

    IMAP_HOST=imap.gmail.com
    IMAP_PORT=993
    IMAP_USER=jmeno@gmail.com
    IMAP_PASSWORD=heslo-pro-aplikace
    # volitelné, jinak se složky konceptů a odeslaných najdou samy:
    DRAFTS_FOLDER=
    SENT_FOLDER=

Příkazy:
    agent-mail nove [--max N] [--dni D]   nové zprávy od minulé kontroly (JSON)
    agent-mail precti UID                 celý text jedné zprávy (JSON)
    agent-mail koncept --komu ADRESA --predmet TEXT [--odpoved-na UID] < text
                                          uloží koncept do složky Koncepty
    agent-mail odeslane [--max N] [--dni D]
                                          tvoje odeslané zprávy bez citací, aby se agent
                                          naučil, jak píšeš (JSON, jen čtení)
"""

from __future__ import annotations

import argparse
import base64
import email
import imaplib
import json
import os
import re
import socket
import stat
import sys
import time
from email import policy
from email.message import EmailMessage
from email.utils import formatdate, make_msgid, parseaddr
from html.parser import HTMLParser
from pathlib import Path

CONFIG_PATH = Path(os.environ.get("AGENT_MAIL_CONFIG", Path.home() / ".config/agent/mail.env"))
STATE_DIR = Path(os.environ.get("AGENT_STATE_DIR", Path.home() / ".local/state/agent"))
STATE_PATH = STATE_DIR / "mail-stav.json"

# IMAP vyžaduje anglické zkratky měsíců bez ohledu na jazyk systému.
MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
DRAFT_NAMES = ["Drafts", "Koncepty", "INBOX.Drafts", "INBOX/Drafts", "Concepts", "Rozepsané"]
SENT_NAMES = ["Sent", "Odeslané", "Odeslaná pošta", "Sent Items", "Sent Mail", "INBOX.Sent", "INBOX/Sent"]
# Začátek citované zprávy v odpovědi (Gmail, Seznam, Outlook, Apple Mail).
REPLY_HEADER = re.compile(r"^\s*(Dne|On)\b.{0,300}\b(napsal|napsala|napsal\(a\)|wrote)\s*:\s*$", re.I | re.S)
REPLY_SEPARATOR = re.compile(r"^\s*-{2,}\s*(Původní zpráva|Původní e-mail|Přeposlaná zpráva|Original Message|"
                             r"Forwarded message)\s*-{2,}", re.I)
HEADER_START = re.compile(r"^\s*(Od|From)\s*:\s*\S", re.I)
HEADER_NEXT = re.compile(r"^\s*(Odesláno|Sent|Datum|Date|Komu|To)\s*:", re.I)
LIST_LINE = re.compile(rb'^\((?P<flags>[^)]*)\) (?P<delim>"(?:[^"\\]|\\.)*"|NIL) (?P<name>.+)$')


class MailError(Exception):
    """Chyba, kterou umíme uživateli srozumitelně vysvětlit."""


def load_config(path: Path = CONFIG_PATH) -> dict[str, str]:
    if not path.exists():
        raise MailError(f"Chybí soubor s přihlášením {path}. Vytvoř ho podle NAVOD.md (krok 8).")
    if path.stat().st_mode & (stat.S_IRWXG | stat.S_IRWXO):
        print(f"Varování: {path} mohou číst i jiní uživatelé. Spusť: chmod 600 {path}", file=sys.stderr)
    cfg: dict[str, str] = {}
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        value = value.strip()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in "\"'":
            value = value[1:-1]
        cfg[key.strip()] = value
    missing = [k for k in ("IMAP_HOST", "IMAP_USER", "IMAP_PASSWORD") if not cfg.get(k)]
    if missing:
        raise MailError(f"V {path} chybí: {', '.join(missing)}")
    return cfg


def connect(cfg: dict[str, str]) -> imaplib.IMAP4:
    try:
        imap = imaplib.IMAP4_SSL(cfg["IMAP_HOST"], int(cfg.get("IMAP_PORT") or 993), timeout=60)
        imap.login(cfg["IMAP_USER"], cfg["IMAP_PASSWORD"])
    except imaplib.IMAP4.error as exc:
        raise MailError(f"Přihlášení k {cfg['IMAP_HOST']} selhalo: {exc}. Zkontroluj heslo pro aplikace.") from exc
    except (OSError, socket.timeout) as exc:
        raise MailError(f"Nepodařilo se spojit s {cfg['IMAP_HOST']}: {exc}") from exc
    return imap


def load_state() -> dict:
    try:
        return json.loads(STATE_PATH.read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError):
        return {}


def save_state(state: dict) -> None:
    STATE_DIR.mkdir(parents=True, exist_ok=True, mode=0o700)
    tmp = STATE_PATH.with_suffix(".tmp")
    tmp.write_text(json.dumps(state, ensure_ascii=False, indent=2), encoding="utf-8")
    tmp.replace(STATE_PATH)


class _TextExtractor(HTMLParser):
    SKIP = {"script", "style", "head", "title"}
    BLOCK = {"p", "div", "br", "li", "tr", "table", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote"}

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.parts: list[str] = []
        self._skip = 0

    def handle_starttag(self, tag, attrs):
        if tag in self.SKIP:
            self._skip += 1
        elif tag in self.BLOCK:
            self.parts.append("\n")

    def handle_endtag(self, tag):
        if tag in self.SKIP:
            self._skip = max(0, self._skip - 1)
        elif tag in self.BLOCK:
            self.parts.append("\n")

    def handle_data(self, data):
        if not self._skip:
            self.parts.append(data)


def html_to_text(markup: str) -> str:
    parser = _TextExtractor()
    parser.feed(markup)
    parser.close()
    text = "".join(parser.parts)
    text = re.sub(r"[ \t\r\f\v\xa0]+", " ", text)
    text = re.sub(r" *\n[ \n]*", "\n", text)
    return text.strip()


def _part_text(part) -> str:
    try:
        content = part.get_content()
    except (LookupError, UnicodeDecodeError, AssertionError):
        payload = part.get_payload(decode=True) or b""
        content = payload.decode("utf-8", "replace")
    if not isinstance(content, str):
        return ""
    return html_to_text(content) if part.get_content_type() == "text/html" else content.strip()


def summarize(uid: int, raw: bytes, max_chars: int) -> dict:
    msg = email.message_from_bytes(raw, policy=policy.default)
    body = msg.get_body(preferencelist=("plain", "html"))
    text = _part_text(body) if body is not None else ""
    attachments = [part.get_filename() for part in msg.iter_attachments() if part.get_filename()]
    shortened = len(text) > max_chars
    return {
        "uid": uid,
        "od": str(msg.get("From", "")),
        "komu": str(msg.get("To", "")),
        "predmet": str(msg.get("Subject", "")),
        "datum": str(msg.get("Date", "")),
        "message_id": str(msg.get("Message-ID", "")),
        "prilohy": attachments,
        "text": text[:max_chars] + ("\n[…zkráceno]" if shortened else ""),
    }


def _raw_from_fetch(data) -> bytes | None:
    for item in data or []:
        if isinstance(item, tuple) and len(item) >= 2 and isinstance(item[1], bytes):
            return item[1]
    return None


def _fetch_raw(imap: imaplib.IMAP4, uid: int) -> bytes | None:
    typ, data = imap.uid("FETCH", str(uid), "(BODY.PEEK[])")
    if typ != "OK":
        return None
    return _raw_from_fetch(data)


def imap_date(days_back: int, now: float | None = None) -> str:
    moment = time.gmtime((now if now is not None else time.time()) - days_back * 86400)
    return f"{moment.tm_mday:02d}-{MONTHS[moment.tm_mon - 1]}-{moment.tm_year}"


def cmd_nove(cfg: dict[str, str], max_count: int, days: int, max_chars: int) -> dict:
    state = load_state()
    imap = connect(cfg)
    try:
        typ, data = imap.status("INBOX", "(UIDVALIDITY UIDNEXT)")
        if typ != "OK" or not data or not data[0]:
            raise MailError("Server nevrátil stav schránky INBOX.")
        validity = int(re.search(rb"UIDVALIDITY (\d+)", data[0]).group(1))
        uidnext = int(re.search(rb"UIDNEXT (\d+)", data[0]).group(1))
        imap.select("INBOX", readonly=True)

        last = state.get("last_uid") if state.get("uidvalidity") == validity else None
        if last is None:
            typ, data = imap.uid("SEARCH", None, f"SINCE {imap_date(days)}")
        else:
            typ, data = imap.uid("SEARCH", None, f"UID {last + 1}:*")
        found = sorted(int(x) for x in (data[0].split() if typ == "OK" and data and data[0] else []))
        if last is not None:
            found = [uid for uid in found if uid > last]

        selected = found[-max_count:] if max_count > 0 else []
        messages = []
        for uid in selected:
            raw = _fetch_raw(imap, uid)
            if raw:
                messages.append(summarize(uid, raw, max_chars))

        new_last = max(found) if found else (last if last is not None else uidnext - 1)
        save_state({
            "uidvalidity": validity,
            "last_uid": new_last,
            "posledni_kontrola": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
        })
        return {
            "nove": messages,
            "pocet_novych": len(found),
            "preskoceno_starsich": len(found) - len(selected),
            "prvni_kontrola": last is None,
        }
    finally:
        try:
            imap.logout()
        except (imaplib.IMAP4.error, OSError):
            pass


def cmd_precti(cfg: dict[str, str], uid: int, max_chars: int) -> dict:
    imap = connect(cfg)
    try:
        imap.select("INBOX", readonly=True)
        raw = _fetch_raw(imap, uid)
        if raw is None:
            raise MailError(f"Zpráva s UID {uid} v INBOX není.")
        return summarize(uid, raw, max_chars)
    finally:
        try:
            imap.logout()
        except (imaplib.IMAP4.error, OSError):
            pass


def _unquote(name: bytes) -> str:
    text = name.decode("utf-8", "replace").strip()
    if len(text) >= 2 and text[0] == '"' and text[-1] == '"':
        text = re.sub(r'\\(.)', r"\1", text[1:-1])
    return text


def imap_utf7_decode(name: str) -> str:
    """Název složky z kódování IMAP (modified UTF-7, RFC 3501) na běžný text."""
    def decode(match):
        chunk = match.group(1)
        if not chunk:
            return "&"
        chunk = chunk.replace(",", "/")
        chunk += "=" * (-len(chunk) % 4)
        return base64.b64decode(chunk).decode("utf-16-be")
    try:
        return re.sub(r"&([A-Za-z0-9+,]*)-", decode, name)
    except (ValueError, UnicodeDecodeError):
        return name


def imap_utf7_encode(name: str) -> str:
    """Běžný text na název složky v kódování IMAP (pro SENT_FOLDER s diakritikou)."""
    out, pending = [], []

    def flush():
        if pending:
            data = base64.b64encode("".join(pending).encode("utf-16-be")).decode().rstrip("=")
            out.append("&" + data.replace("/", ",") + "-")
            pending.clear()

    for char in name:
        if 0x20 <= ord(char) <= 0x7E:
            flush()
            out.append("&-" if char == "&" else char)
        else:
            pending.append(char)
    flush()
    return "".join(out)


def _find_folder(list_lines, flag: bytes, candidates: list[str], suffixes: tuple[str, ...]) -> str | None:
    """Najde složku podle příznaku (např. \\Drafts), jinak podle obvyklých názvů.

    Vrací název tak, jak ho poslal server, aby šel rovnou použít v SELECT nebo APPEND.
    """
    names = []
    for line in list_lines or []:
        if not isinstance(line, bytes):
            continue
        match = LIST_LINE.match(line)
        if not match:
            continue
        name = _unquote(match.group("name"))
        if flag in match.group("flags").lower():
            return name
        names.append(name)
    readable = {imap_utf7_decode(n).lower(): n for n in names}
    for candidate in candidates:
        if candidate.lower() in readable:
            return readable[candidate.lower()]
    for text, name in readable.items():
        if text.endswith(suffixes):
            return name
    return None


def find_drafts_folder(list_lines) -> str | None:
    return _find_folder(list_lines, b"\\drafts", DRAFT_NAMES, ("/drafts", "/koncepty", ".drafts"))


def find_sent_folder(list_lines) -> str | None:
    return _find_folder(list_lines, b"\\sent", SENT_NAMES,
                        ("/sent", "/sent mail", "/sent items", "/odeslané", "/odeslaná pošta", ".sent"))


def own_text(text: str) -> str:
    """Jen to, co napsal sám odesílatel: bez citované zprávy, na kterou odpovídá."""
    lines = text.replace("\r\n", "\n").split("\n")
    kept = []
    for i, line in enumerate(lines):
        two = line + " " + (lines[i + 1] if i + 1 < len(lines) else "")
        if REPLY_SEPARATOR.match(line) or REPLY_HEADER.match(line) or REPLY_HEADER.match(two.strip()):
            break
        if HEADER_START.match(line) and any(HEADER_NEXT.match(nxt) for nxt in lines[i + 1:i + 4]):
            break
        if line.lstrip().startswith(">"):
            continue
        kept.append(line.rstrip())
    result = "\n".join(kept).strip()
    return re.sub(r"\n{3,}", "\n\n", result)


def quote_mailbox(name: str) -> str:
    return '"' + name.replace("\\", "\\\\").replace('"', '\\"') + '"'


def build_draft(sender: str, to: str, subject: str, text: str,
                in_reply_to: str = "", references: str = "") -> EmailMessage:
    if "@" not in parseaddr(to)[1]:
        raise MailError(f"Adresa příjemce '{to}' nevypadá jako e-mail.")
    msg = EmailMessage()
    msg["From"] = sender
    msg["To"] = to
    msg["Subject"] = subject
    msg["Date"] = formatdate(localtime=True)
    msg["Message-ID"] = make_msgid()
    if in_reply_to:
        msg["In-Reply-To"] = in_reply_to
        msg["References"] = f"{references} {in_reply_to}".strip()
    msg.set_content(text)
    return msg


def cmd_koncept(cfg: dict[str, str], to: str, subject: str, text: str, reply_uid: int | None) -> dict:
    if not text.strip():
        raise MailError("Text konceptu je prázdný (předej ho na standardní vstup).")
    imap = connect(cfg)
    try:
        in_reply_to = references = ""
        if reply_uid is not None:
            imap.select("INBOX", readonly=True)
            raw = _fetch_raw(imap, reply_uid)
            if raw is None:
                raise MailError(f"Původní zpráva s UID {reply_uid} v INBOX není.")
            original = email.message_from_bytes(raw, policy=policy.default)
            in_reply_to = str(original.get("Message-ID", ""))
            references = str(original.get("References", ""))
        folder = cfg.get("DRAFTS_FOLDER") or find_drafts_folder(imap.list()[1])
        if not folder:
            raise MailError("Složku konceptů jsem nenašel. Doplň DRAFTS_FOLDER do mail.env.")
        msg = build_draft(cfg.get("FROM") or cfg["IMAP_USER"], to, subject, text, in_reply_to, references)
        typ, resp = imap.append(quote_mailbox(folder), r"(\Draft)",
                                imaplib.Time2Internaldate(time.time()), msg.as_bytes())
        if typ != "OK":
            raise MailError(f"Server koncept neuložil: {resp}")
        return {"ulozeno": True, "slozka": folder, "komu": to, "predmet": subject,
                "poznamka": "Koncept čeká ve schránce, odeslat ho musíš sám."}
    finally:
        try:
            imap.logout()
        except (imaplib.IMAP4.error, OSError):
            pass


def cmd_odeslane(cfg: dict[str, str], max_count: int, days: int, max_chars: int) -> dict:
    imap = connect(cfg)
    try:
        configured = cfg.get("SENT_FOLDER", "")
        folder = imap_utf7_encode(configured) if configured else find_sent_folder(imap.list()[1])
        if not folder:
            raise MailError("Složku odeslaných jsem nenašel. Doplň SENT_FOLDER do mail.env.")
        typ, _ = imap.select(quote_mailbox(folder), readonly=True)
        if typ != "OK":
            raise MailError(f"Složku {imap_utf7_decode(folder)} se nepodařilo otevřít.")
        typ, data = imap.uid("SEARCH", None, f"SINCE {imap_date(days)}")
        found = sorted(int(x) for x in (data[0].split() if typ == "OK" and data and data[0] else []))
        messages = []
        for uid in found[-max_count:] if max_count > 0 else []:
            raw = _fetch_raw(imap, uid)
            if not raw:
                continue
            item = summarize(uid, raw, max_chars=10**6)
            text = own_text(item["text"])
            if not text:
                continue
            messages.append({
                "uid": uid,
                "komu": item["komu"],
                "predmet": item["predmet"],
                "datum": item["datum"],
                "text": text[:max_chars] + ("\n[…zkráceno]" if len(text) > max_chars else ""),
            })
        return {"slozka": imap_utf7_decode(folder), "zpravy": messages, "pocet_v_obdobi": len(found)}
    finally:
        try:
            imap.logout()
        except (imaplib.IMAP4.error, OSError):
            pass


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="agent-mail", description="Hlídání e-mailu: jen čtení a koncepty.")
    sub = parser.add_subparsers(dest="prikaz", required=True)
    p_new = sub.add_parser("nove", help="nové zprávy od minulé kontroly")
    p_new.add_argument("--max", type=int, default=20, help="nejvýš kolik zpráv vypsat (nejnovější)")
    p_new.add_argument("--dni", type=int, default=2, help="při první kontrole projít posledních N dní")
    p_new.add_argument("--znaku", type=int, default=4000, help="maximální délka textu jedné zprávy")
    p_read = sub.add_parser("precti", help="celý text jedné zprávy")
    p_read.add_argument("uid", type=int)
    p_read.add_argument("--znaku", type=int, default=20000)
    p_draft = sub.add_parser("koncept", help="uloží koncept odpovědi (text ze stdin)")
    p_draft.add_argument("--komu", required=True)
    p_draft.add_argument("--predmet", required=True)
    p_draft.add_argument("--odpoved-na", type=int, dest="odpoved_na", help="UID zprávy, na kterou odpovídáš")
    p_sent = sub.add_parser("odeslane", help="tvoje odeslané zprávy bez citací (jen čtení)")
    p_sent.add_argument("--max", type=int, default=50, help="nejvýš kolik zpráv (nejnovější)")
    p_sent.add_argument("--dni", type=int, default=365, help="za kolik posledních dní")
    p_sent.add_argument("--znaku", type=int, default=3000, help="maximální délka textu jedné zprávy")
    args = parser.parse_args(argv)

    try:
        cfg = load_config()
        if args.prikaz == "nove":
            result = cmd_nove(cfg, args.max, args.dni, args.znaku)
        elif args.prikaz == "precti":
            result = cmd_precti(cfg, args.uid, args.znaku)
        elif args.prikaz == "odeslane":
            result = cmd_odeslane(cfg, args.max, args.dni, args.znaku)
        else:
            result = cmd_koncept(cfg, args.komu, args.predmet, sys.stdin.read(), args.odpoved_na)
    except MailError as exc:
        print(f"Chyba: {exc}", file=sys.stderr)
        return 2
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
