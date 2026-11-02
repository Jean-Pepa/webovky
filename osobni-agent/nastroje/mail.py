#!/usr/bin/env python3
"""E-mail pro osobního agenta: čtení přes IMAP, koncepty a odeslání, které schválíš.

Nic nemaže a nic neoznačuje jako přečtené. Odeslat (odeslat) smí agent jen po tvém schválení
v aplikaci: ten příkaz není v seznamu povolených a ve schválení vidíš celý mail.
Přihlašovací údaje čte z ~/.config/agent/mail.env (KLÍČ=hodnota, práva 600):

    IMAP_HOST=imap.gmail.com
    IMAP_PORT=993
    IMAP_USER=jmeno@gmail.com
    IMAP_PASSWORD=heslo-pro-aplikace
    # volitelné, jinak se složky konceptů a odeslaných najdou samy:
    DRAFTS_FOLDER=
    SENT_FOLDER=
    # volitelné pro odesílání, jinak smtp.<tvůj poskytovatel>, port 465 a stejné heslo:
    SMTP_HOST=
    SMTP_PORT=

Příkazy:
    agent-mail nove [--max N] [--dni D]   nové zprávy od minulé kontroly (JSON)
    agent-mail precti UID                 celý text jedné zprávy (JSON)
    agent-mail hledej "text" [--dni D] [--odeslane]
                                          hledá v doručené (nebo odeslané) poště (JSON)
    agent-mail koncept --komu ADRESA --predmet TEXT --text TEXT [--odpoved-na UID] [--priloha SOUBOR]
                                          uloží koncept do složky Koncepty, odešleš ho ty
    agent-mail odeslat --komu ADRESA [--kopie ADRESA] --predmet TEXT --text TEXT
                       [--odpoved-na UID] [--priloha SOUBOR] [--novy]
                                          odešle mail (jen po tvém schválení v aplikaci)
    agent-mail odeslane [--max N] [--dni D]
                                          tvoje odeslané zprávy bez citací, aby se agent
                                          naučil, jak píšeš (JSON, jen čtení)

Pojistky odesílání: nejvýš 5 příjemců a žádná skrytá kopie. Na adresu, na kterou jsi nikdy
nepsal a ze které nic nepřišlo (a není v lide/), jen s volbou --novy. Přílohy jen z
projekty/, podklady/, prichozi/, pruzkum/, media/inbound/ nebo z povolených složek
agent-soubory, nikdy deník, zdraví, digitální kopie ani pravidla. Nejvýš 30 mailů denně,
každý se zapíše do záznamu, kam agent nevidí.
"""

from __future__ import annotations

import argparse
import base64
import email
import imaplib
import json
import mimetypes
import os
import re
import smtplib
import socket
import ssl
import stat
import sys
import time
from email import policy
from email.message import EmailMessage
from email.utils import formataddr, formatdate, make_msgid, parseaddr
from html.parser import HTMLParser
from pathlib import Path

import zaklad

CONFIG_PATH = zaklad.CONFIG_DIR / "mail.env"
STATE_DIR = zaklad.STATE_DIR
STATE_PATH = STATE_DIR / "mail-stav.json"
SEND_LOG = STATE_DIR / "mail-odeslano.jsonl"
MOZEK = zaklad.MOZEK

DAILY_SEND_LIMIT = 30
MAX_RECIPIENTS = 5
MAX_ATTACHMENTS = 10
MAX_ATTACH_BYTES = 20 * 1024 * 1024
MAX_TEXT = 20000
# Přikládat smíš jen podklady k práci. Deník, zdraví, digitální kopii, lidi ani pravidla nikdy.
ATTACH_DIRS = ("projekty", "podklady", "prichozi", "pruzkum", "media/inbound")
ADDRESS = re.compile(r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$")
ANY_ADDRESS = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+")

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


def load_config(path: Path | None = None) -> dict[str, str]:
    path = path or CONFIG_PATH
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


def addresses(values) -> list[str]:
    """Adresy z argumentů („Jan <jan@x.cz>", čárkou oddělené). Neplatná adresa je chyba."""
    out = []
    for value in ([values] if isinstance(values, str) else values):
        for part in re.split(r"[,;]", value):
            if not part.strip():
                continue
            name, addr = parseaddr(part.strip())
            if not ADDRESS.match(addr or ""):
                raise MailError(f"Adresa příjemce '{part.strip()}' nevypadá jako e-mail.")
            out.append(formataddr((name, addr)) if name else addr)
    return out


def bare(address: str) -> str:
    return parseaddr(address)[1].lower()


def attachment(text: str) -> Path:
    """Příloha z bezpečné složky Mozku, nebo z povolené složky Windows (plocha:…)."""
    raw = text.strip()
    if re.match(r"^[^:\\/]{2,}:", raw):
        import soubory  # zkratky a hranice složek Windows hlídá agent-soubory
        try:
            path = soubory.existing(soubory.load_config(), raw)
        except soubory.SouboryError as exc:
            raise MailError(f"Příloha {raw}: {exc}") from None
    else:
        p = Path(raw).expanduser()
        path = Path(os.path.realpath(p if p.is_absolute() else MOZEK / p))
        root = Path(os.path.realpath(MOZEK))
        if root not in path.parents:
            raise MailError(f"Příloha {raw} je mimo Mozek i mimo povolené složky (agent-soubory slozky).")
        rel = path.relative_to(root).as_posix()
        if not any(rel.startswith(d + "/") for d in ATTACH_DIRS):
            raise MailError(f"Příloha {rel}: přikládat smíš jen soubory z "
                            f"{', '.join(d + '/' for d in ATTACH_DIRS)}. Deník, zdraví, digitální kopii, "
                            "lidi ani pravidla nikdy.")
    if not path.is_file():
        raise MailError(f"Příloha {raw} neexistuje nebo to není soubor.")
    return path


def attachments(texts) -> list[Path]:
    paths = [attachment(t) for t in texts]
    if len(paths) > MAX_ATTACHMENTS:
        raise MailError(f"Nejvýš {MAX_ATTACHMENTS} příloh v jednom mailu.")
    if sum(p.stat().st_size for p in paths) > MAX_ATTACH_BYTES:
        raise MailError("Přílohy mají dohromady přes 20 MB, tolik pošta neunese. Pošli odkaz.")
    return paths


def build_draft(sender: str, to, subject: str, text: str, in_reply_to: str = "", references: str = "",
                cc=(), files=()) -> EmailMessage:
    to_list, cc_list = addresses(to), addresses(list(cc))
    if not to_list:
        raise MailError("Chybí příjemce.")
    msg = EmailMessage()
    msg["From"] = sender
    msg["To"] = ", ".join(to_list)
    if cc_list:
        msg["Cc"] = ", ".join(cc_list)
    msg["Subject"] = subject
    msg["Date"] = formatdate(localtime=True)
    msg["Message-ID"] = make_msgid()
    if in_reply_to:
        msg["In-Reply-To"] = in_reply_to
        msg["References"] = f"{references} {in_reply_to}".strip()
    msg.set_content(text)
    for path in files:
        ctype = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
        maintype, subtype = ctype.split("/", 1)
        msg.add_attachment(path.read_bytes(), maintype=maintype, subtype=subtype, filename=path.name)
    return msg


def reply_headers(imap: imaplib.IMAP4, reply_uid: int | None) -> tuple[str, str]:
    if reply_uid is None:
        return "", ""
    imap.select("INBOX", readonly=True)
    raw = _fetch_raw(imap, reply_uid)
    if raw is None:
        raise MailError(f"Původní zpráva s UID {reply_uid} v INBOX není.")
    original = email.message_from_bytes(raw, policy=policy.default)
    return str(original.get("Message-ID", "")), str(original.get("References", ""))


def cmd_koncept(cfg: dict[str, str], to, subject: str, text: str, reply_uid: int | None,
                cc=(), files=()) -> dict:
    if not text.strip():
        raise MailError("Text konceptu je prázdný (předej ho volbou --text).")
    paths = attachments(files)
    imap = connect(cfg)
    try:
        in_reply_to, references = reply_headers(imap, reply_uid)
        folder = cfg.get("DRAFTS_FOLDER") or find_drafts_folder(imap.list()[1])
        if not folder:
            raise MailError("Složku konceptů jsem nenašel. Doplň DRAFTS_FOLDER do mail.env.")
        msg = build_draft(cfg.get("FROM") or cfg["IMAP_USER"], to, subject, text, in_reply_to, references,
                          cc=cc, files=paths)
        typ, resp = imap.append(quote_mailbox(folder), r"(\Draft)",
                                imaplib.Time2Internaldate(time.time()), msg.as_bytes())
        if typ != "OK":
            raise MailError(f"Server koncept neuložil: {resp}")
        return {"ulozeno": True, "slozka": folder, "komu": msg["To"], "predmet": subject,
                "prilohy": [p.name for p in paths],
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


# ---------- odesílání ----------

def smtp_settings(cfg: dict[str, str]) -> tuple[str, int, str, str]:
    host = cfg.get("SMTP_HOST") or ""
    if not host:
        if not cfg["IMAP_HOST"].startswith("imap."):
            raise MailError("Nevím, kam mail odeslat. Doplň SMTP_HOST do mail.env (NAVOD.md, krok 25).")
        host = "smtp." + cfg["IMAP_HOST"][len("imap."):]
    return (host, int(cfg.get("SMTP_PORT") or 465), cfg.get("SMTP_USER") or cfg["IMAP_USER"],
            cfg.get("SMTP_PASSWORD") or cfg["IMAP_PASSWORD"])


def smtp_send(cfg: dict[str, str], msg: EmailMessage, recipients: list[str], factory=None) -> dict:
    host, port, user, password = smtp_settings(cfg)
    context = ssl.create_default_context()
    try:
        if factory is not None:
            server = factory(host, port)
        elif port == 465:
            server = smtplib.SMTP_SSL(host, port, timeout=60, context=context)
        else:
            server = smtplib.SMTP(host, port, timeout=60)
            server.starttls(context=context)
        try:
            server.login(user, password)
            return server.send_message(msg, to_addrs=recipients) or {}
        finally:
            try:
                server.quit()
            except (smtplib.SMTPException, OSError):
                pass
    except smtplib.SMTPAuthenticationError:
        raise MailError(f"Přihlášení k odesílání ({host}) selhalo. Zkontroluj heslo pro aplikace.") from None
    except smtplib.SMTPRecipientsRefused as exc:
        raise MailError(f"Server odmítl všechny adresy ({', '.join(exc.recipients)}). Nic neodešlo.") from None
    except (smtplib.SMTPException, OSError) as exc:
        raise MailError(f"Mail se nepodařilo odeslat ({exc}). Nic neodešlo.") from None


def lide_addresses() -> set[str]:
    """Adresy lidí, které znáš (soubory v lide/)."""
    found: set[str] = set()
    for path in (MOZEK / "lide").glob("*.md"):
        try:
            found |= {a.lower() for a in ANY_ADDRESS.findall(path.read_text(encoding="utf-8"))}
        except OSError:
            continue
    return found


def unknown_recipients(imap: imaplib.IMAP4, cfg: dict[str, str], recipients: list[str]) -> list[str]:
    """Adresy, na které jsi nikdy nepsal, nic z nich nepřišlo a nejsou v lide/."""
    known = lide_addresses()
    sent = cfg.get("SENT_FOLDER") or find_sent_folder(imap.list()[1])
    unknown = []
    for addr in recipients:
        if addr in known:
            continue
        hit = False
        for folder, key in ((sent, "TO"), (sent, "CC"), ("INBOX", "FROM")):
            if not folder:
                continue
            try:
                if imap.select(quote_mailbox(folder), readonly=True)[0] != "OK":
                    continue
                typ, data = imap.uid("SEARCH", None, key, f'"{addr}"')
            except imaplib.IMAP4.error:
                continue
            if typ == "OK" and data and data[0] and data[0].split():
                hit = True
                break
        if not hit:
            unknown.append(addr)
    return unknown


def load_send_log() -> list[dict]:
    try:
        return [json.loads(line) for line in SEND_LOG.read_text(encoding="utf-8").splitlines() if line.strip()]
    except (OSError, ValueError):
        return []


def save_sent_copy(imap: imaplib.IMAP4, cfg: dict[str, str], msg: EmailMessage) -> bool:
    """Gmail si odeslaný mail uloží sám, jinde ho skript vloží do složky odeslaných."""
    mode = (cfg.get("SENT_COPY") or "auto").lower()
    if mode in ("ne", "no", "0", "false") or (mode == "auto" and "gmail" in smtp_settings(cfg)[0]):
        return False
    try:
        folder = cfg.get("SENT_FOLDER") or find_sent_folder(imap.list()[1])
        if not folder:
            return False
        typ, _ = imap.append(quote_mailbox(folder), r"(\Seen)", imaplib.Time2Internaldate(time.time()),
                             msg.as_bytes())
        return typ == "OK"
    except (imaplib.IMAP4.error, OSError):
        return False


def cmd_odeslat(cfg: dict[str, str], to: list[str], cc: list[str], subject: str, text: str,
                reply_uid: int | None, files: list[str], new_ok: bool, smtp_factory=None) -> dict:
    """Odešle mail. Spouští se jen po tvém schválení v aplikaci (není v seznamu povolených)."""
    if not text.strip():
        raise MailError("Text mailu je prázdný.")
    if len(text) > MAX_TEXT:
        raise MailError(f"Mail má {len(text)} znaků, nejvýš {MAX_TEXT}. Dlouhý text pošli jako přílohu.")
    if not subject.strip():
        raise MailError("Mail nemá předmět.")
    to_list, cc_list = addresses(to), addresses(cc)
    if not to_list:
        raise MailError("Chybí příjemce (--komu).")
    recipients = list(dict.fromkeys(bare(a) for a in to_list + cc_list))
    if len(recipients) > MAX_RECIPIENTS:
        raise MailError(f"Nejvýš {MAX_RECIPIENTS} příjemců v jednom mailu.")
    paths = attachments(files)
    today = time.strftime("%Y-%m-%d")
    if sum(1 for e in load_send_log() if str(e.get("cas", "")).startswith(today)) >= DAILY_SEND_LIMIT:
        raise MailError(f"Dnes už odešlo {DAILY_SEND_LIMIT} mailů, víc nesmím. Pošli je zítra nebo sám.")
    imap = connect(cfg)
    try:
        unknown = unknown_recipients(imap, cfg, recipients)
        if unknown and not new_ok:
            raise MailError(f"Na {', '.join(unknown)} jsi ještě nepsal a nic odtud nepřišlo. Nic neodešlo. "
                            "Zeptej se mě, jestli je adresa správná, a po mém „ano“ spusť příkaz znovu s --novy.")
        in_reply_to, references = reply_headers(imap, reply_uid)
        msg = build_draft(cfg.get("FROM") or cfg["IMAP_USER"], to_list, subject, text, in_reply_to, references,
                          cc=cc_list, files=paths)
        refused = smtp_send(cfg, msg, recipients, smtp_factory)
        STATE_DIR.mkdir(parents=True, exist_ok=True, mode=0o700)
        with SEND_LOG.open("a", encoding="utf-8") as log:
            log.write(json.dumps({"cas": time.strftime("%Y-%m-%dT%H:%M:%S"), "komu": to_list, "kopie": cc_list,
                                  "predmet": subject, "prilohy": [p.name for p in paths],
                                  "zacatek": text[:200], "message_id": msg["Message-ID"],
                                  "odmitnuto": sorted(refused)}, ensure_ascii=False) + "\n")
        copy = save_sent_copy(imap, cfg, msg)
    finally:
        try:
            imap.logout()
        except (imaplib.IMAP4.error, OSError):
            pass
    result = {"odeslano": True, "komu": to_list, "kopie": cc_list, "predmet": subject,
              "prilohy": [p.name for p in paths], "kopie_v_odeslanych": copy or "gmail si ji uloží sám",
              "novi_prijemci": unknown}
    if refused:
        result["odmitnuto"] = sorted(refused)
        result["poznamka"] = "Některé adresy server odmítl, ostatním mail odešel."
    return result


# ---------- hledání v poště ----------

def cmd_hledej(cfg: dict[str, str], query: str, days: int, max_count: int, max_chars: int,
               sent: bool = False) -> dict:
    query = " ".join(query.replace('"', " ").split())
    if not query:
        raise MailError("Napiš, co v poště hledáš.")
    imap = connect(cfg)
    try:
        folder = "INBOX"
        if sent:
            folder = cfg.get("SENT_FOLDER") or find_sent_folder(imap.list()[1])
            if not folder:
                raise MailError("Složku odeslaných jsem nenašel. Doplň SENT_FOLDER do mail.env.")
        if imap.select(quote_mailbox(folder), readonly=True)[0] != "OK":
            raise MailError(f"Složku {folder} se nepodařilo otevřít.")
        try:
            imap.literal = query.encode("utf-8")  # text s diakritikou jde serveru jako literál
            typ, data = imap.uid("SEARCH", "CHARSET", "UTF-8", "SINCE", imap_date(days), "TEXT")
        except imaplib.IMAP4.error:
            imap.literal = None
            if not query.isascii():
                raise MailError("Server neumí hledat s diakritikou. Zkus slovo bez háčků a čárek.") from None
            typ, data = imap.uid("SEARCH", None, "SINCE", imap_date(days), "TEXT", f'"{query}"')
        uids = sorted((int(x) for x in data[0].split()), reverse=True) if typ == "OK" and data and data[0] else []
        messages = []
        for uid in uids[:max_count]:
            raw = _fetch_raw(imap, uid)
            if raw:
                messages.append(summarize(uid, raw, max_chars))
        return {"slozka": "odeslané" if sent else "doručené", "dotaz": query, "nalezeno": len(uids),
                "zpravy": messages,
                "poznamka": "Nejnovější první. Celý text doručené zprávy: agent-mail precti UID."}
    finally:
        try:
            imap.logout()
        except (imaplib.IMAP4.error, OSError):
            pass


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="agent-mail", description="E-mail: čtení, koncepty a schválené odeslání.")
    sub = parser.add_subparsers(dest="prikaz", required=True)
    p_new = sub.add_parser("nove", help="nové zprávy od minulé kontroly")
    p_new.add_argument("--max", type=int, default=20, help="nejvýš kolik zpráv vypsat (nejnovější)")
    p_new.add_argument("--dni", type=int, default=2, help="při první kontrole projít posledních N dní")
    p_new.add_argument("--znaku", type=int, default=4000, help="maximální délka textu jedné zprávy")
    p_read = sub.add_parser("precti", help="celý text jedné zprávy")
    p_read.add_argument("uid", type=int)
    p_read.add_argument("--znaku", type=int, default=20000)
    p_find = sub.add_parser("hledej", help="hledá v doručené nebo odeslané poště")
    p_find.add_argument("text")
    p_find.add_argument("--dni", type=int, default=365, help="za kolik posledních dní")
    p_find.add_argument("--max", type=int, default=10)
    p_find.add_argument("--znaku", type=int, default=2000)
    p_find.add_argument("--odeslane", action="store_true", help="hledat v odeslané poště")
    p_draft = sub.add_parser("koncept", help="uloží koncept do složky Koncepty")
    p_draft.add_argument("--komu", required=True, action="append")
    p_draft.add_argument("--kopie", action="append", default=[])
    p_draft.add_argument("--predmet", required=True)
    p_draft.add_argument("--text", help="text konceptu (jinak ze standardního vstupu)")
    p_draft.add_argument("--odpoved-na", type=int, dest="odpoved_na", help="UID zprávy, na kterou odpovídáš")
    p_draft.add_argument("--priloha", action="append", default=[])
    p_send = sub.add_parser("odeslat", help="odešle mail, jen po tvém schválení v aplikaci")
    p_send.add_argument("--komu", required=True, action="append")
    p_send.add_argument("--kopie", action="append", default=[])
    p_send.add_argument("--predmet", required=True)
    p_send.add_argument("--text", required=True)
    p_send.add_argument("--odpoved-na", type=int, dest="odpoved_na", help="UID zprávy, na kterou odpovídáš")
    p_send.add_argument("--priloha", action="append", default=[])
    p_send.add_argument("--novy", action="store_true", help="smí i na adresu, na kterou jsi ještě nepsal")
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
        elif args.prikaz == "hledej":
            result = cmd_hledej(cfg, args.text, args.dni, args.max, args.znaku, args.odeslane)
        elif args.prikaz == "odeslat":
            result = cmd_odeslat(cfg, args.komu, args.kopie, args.predmet, args.text, args.odpoved_na,
                                 args.priloha, args.novy)
        else:
            text = args.text if args.text is not None else ("" if sys.stdin.isatty() else sys.stdin.read())
            result = cmd_koncept(cfg, args.komu, args.predmet, text, args.odpoved_na, args.kopie, args.priloha)
    except MailError as exc:
        print(f"Chyba: {exc}", file=sys.stderr)
        return 2
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
