"""Testy pro mail.py bez skutečného serveru (falešný IMAP)."""

import importlib.util
import json
import os
import sys
import tempfile
import unittest
from email.message import EmailMessage
from pathlib import Path
from unittest import mock

HERE = Path(__file__).resolve().parent


def load_module():
    spec = importlib.util.spec_from_file_location("mail", HERE.parent / "mail.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def make_raw(subject="Faktura", body="Dobrý den,\nposílám fakturu.", html=None, attachment=False):
    msg = EmailMessage()
    msg["From"] = "Jan Novák <jan@example.cz>"
    msg["To"] = "ja@example.cz"
    msg["Subject"] = subject
    msg["Date"] = "Tue, 27 Oct 2026 10:00:00 +0100"
    msg["Message-ID"] = "<abc@example.cz>"
    if html is None:
        msg.set_content(body)
    else:
        msg.set_content(html, subtype="html")
    if attachment:
        msg.add_attachment(b"%PDF-1.4", maintype="application", subtype="pdf", filename="faktura.pdf")
    return msg.as_bytes()


class FakeIMAP:
    def __init__(self, messages, validity=7, list_lines=None):
        self.messages = messages  # uid -> raw bytes
        self.validity = validity
        self.list_lines = list_lines or [b'(\\HasNoChildren) "/" "INBOX"',
                                         b'(\\HasNoChildren \\Drafts) "/" "[Gmail]/Koncepty"']
        self.appended = []
        self.readonly = None
        self.selected = None

    def status(self, mailbox, items):
        nxt = max(self.messages) + 1 if self.messages else 1
        return "OK", [f"INBOX (UIDVALIDITY {self.validity} UIDNEXT {nxt})".encode()]

    def select(self, mailbox, readonly=False):
        self.readonly = readonly
        self.selected = mailbox
        return "OK", [b"1"]

    def uid(self, command, *args):
        args = [a for a in args if a is not None]
        if command == "SEARCH":
            crit = args[0]
            if crit.startswith("UID "):
                start = int(crit.split()[1].split(":")[0])
                uids = [u for u in self.messages if u >= start] or [max(self.messages)]
            else:
                uids = list(self.messages)
            return "OK", [" ".join(str(u) for u in sorted(uids)).encode()]
        if command == "FETCH":
            assert "PEEK" in args[1], "fetch must not mark messages as read"
            uid = int(args[0])
            if uid not in self.messages:
                return "OK", [None]
            return "OK", [(f"1 (UID {uid} BODY[] {{10}}".encode(), self.messages[uid]), b")"]
        raise AssertionError(command)

    def list(self):
        return "OK", self.list_lines

    def append(self, mailbox, flags, date_time, message):
        self.appended.append((mailbox, flags, message))
        return "OK", [b"APPEND completed"]

    def logout(self):
        return "BYE", [b""]


class MailTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        os.environ["AGENT_STATE_DIR"] = self.tmp.name
        self.mail = load_module()
        self.cfg = {"IMAP_HOST": "imap.example.cz", "IMAP_USER": "ja@example.cz", "IMAP_PASSWORD": "x"}

    def tearDown(self):
        self.tmp.cleanup()
        os.environ.pop("AGENT_STATE_DIR", None)

    def test_summary_plain_and_attachment(self):
        info = self.mail.summarize(5, make_raw(attachment=True), 4000)
        self.assertEqual(info["predmet"], "Faktura")
        self.assertIn("Jan Novák", info["od"])
        self.assertIn("posílám fakturu", info["text"])
        self.assertEqual(info["prilohy"], ["faktura.pdf"])

    def test_summary_html_only(self):
        html = "<html><head><style>p{}</style></head><body><p>Ahoj&nbsp;světe</p><script>x()</script><p>Druhý</p></body></html>"
        info = self.mail.summarize(1, make_raw(html=html), 4000)
        self.assertEqual(info["text"], "Ahoj světe\nDruhý")

    def test_summary_truncates(self):
        info = self.mail.summarize(1, make_raw(body="a" * 50), 10)
        self.assertTrue(info["text"].startswith("a" * 10))
        self.assertIn("zkráceno", info["text"])

    def test_encoded_subject(self):
        raw = b"From: a@b.cz\r\nSubject: =?utf-8?q?P=C5=99=C3=ADpravy_na_st=C5=99echu?=\r\n\r\nText\r\n"
        self.assertEqual(self.mail.summarize(1, raw, 100)["predmet"], "Přípravy na střechu")

    def test_nove_first_run_then_incremental(self):
        fake = FakeIMAP({10: make_raw(subject="A"), 11: make_raw(subject="B")})
        with mock.patch.object(self.mail, "connect", return_value=fake):
            first = self.mail.cmd_nove(self.cfg, 20, 2, 4000)
            self.assertTrue(first["prvni_kontrola"])
            self.assertEqual([m["predmet"] for m in first["nove"]], ["A", "B"])
            self.assertTrue(fake.readonly)
            # Nic nového: server vrací poslední UID i pro rozsah 12:*, skript ho musí odfiltrovat.
            again = self.mail.cmd_nove(self.cfg, 20, 2, 4000)
            self.assertEqual(again["nove"], [])
            fake.messages[12] = make_raw(subject="C")
            third = self.mail.cmd_nove(self.cfg, 20, 2, 4000)
            self.assertEqual([m["predmet"] for m in third["nove"]], ["C"])
        state = json.loads((Path(self.tmp.name) / "mail-stav.json").read_text())
        self.assertEqual(state["last_uid"], 12)

    def test_nove_respects_max_and_uidvalidity_reset(self):
        fake = FakeIMAP({u: make_raw(subject=str(u)) for u in range(1, 8)})
        with mock.patch.object(self.mail, "connect", return_value=fake):
            res = self.mail.cmd_nove(self.cfg, 3, 2, 4000)
            self.assertEqual([m["uid"] for m in res["nove"]], [5, 6, 7])
            self.assertEqual(res["preskoceno_starsich"], 4)
            fake.validity = 99  # schránka se na serveru přestavěla
            res = self.mail.cmd_nove(self.cfg, 3, 2, 4000)
            self.assertTrue(res["prvni_kontrola"])

    def test_find_drafts_folder(self):
        lines = [b'(\\HasNoChildren) "/" "INBOX"', b'(\\HasNoChildren \\Drafts) "/" "[Gmail]/Koncepty"']
        self.assertEqual(self.mail.find_drafts_folder(lines), "[Gmail]/Koncepty")
        self.assertEqual(self.mail.find_drafts_folder([b'(\\HasNoChildren) "." "INBOX.Drafts"']), "INBOX.Drafts")
        self.assertEqual(self.mail.find_drafts_folder([b'(\\HasNoChildren) "/" Koncepty']), "Koncepty")
        self.assertIsNone(self.mail.find_drafts_folder([b'(\\HasNoChildren) "/" "INBOX"']))

    def test_koncept_reply(self):
        fake = FakeIMAP({3: make_raw(subject="Dotaz")})
        with mock.patch.object(self.mail, "connect", return_value=fake):
            res = self.mail.cmd_koncept(self.cfg, "jan@example.cz", "Re: Dotaz", "Díky, ozvu se.", 3)
        self.assertEqual(res["slozka"], "[Gmail]/Koncepty")
        mailbox, flags, message = fake.appended[0]
        self.assertEqual(mailbox, '"[Gmail]/Koncepty"')
        self.assertEqual(flags, "(\\Draft)")
        self.assertIn(b"In-Reply-To: <abc@example.cz>", message)

    def test_koncept_rejects_bad_address(self):
        with self.assertRaises(self.mail.MailError):
            self.mail.build_draft("ja@example.cz", "neni-adresa", "x", "y")

    def test_config_parsing_and_quotes(self):
        path = Path(self.tmp.name) / "mail.env"
        path.write_text('# komentář\nIMAP_HOST=imap.seznam.cz\nIMAP_USER="ja@seznam.cz"\nIMAP_PASSWORD=ab #cd\n')
        path.chmod(0o600)
        cfg = self.mail.load_config(path)
        self.assertEqual(cfg["IMAP_USER"], "ja@seznam.cz")
        self.assertEqual(cfg["IMAP_PASSWORD"], "ab #cd")

    def test_folder_names_with_diacritics(self):
        self.assertEqual(self.mail.imap_utf7_encode("Odeslané"), "Odeslan&AOk-")
        self.assertEqual(self.mail.imap_utf7_encode("Odeslaná pošta"), "Odeslan&AOE- po&AWE-ta")
        self.assertEqual(self.mail.imap_utf7_decode("[Gmail]/Odeslan&AOE- po&AWE-ta"), "[Gmail]/Odeslaná pošta")
        self.assertEqual(self.mail.imap_utf7_decode("Tom &- Jerry"), "Tom & Jerry")
        for text in ["Rozepsané", "Přijaté/Účty", "Sent"]:
            self.assertEqual(self.mail.imap_utf7_decode(self.mail.imap_utf7_encode(text)), text)

    def test_find_sent_folder(self):
        flagged = [b'(\\HasNoChildren) "/" "INBOX"', b'(\\HasNoChildren \\Sent) "/" "[Gmail]/Odeslan&AOE- po&AWE-ta"']
        self.assertEqual(self.mail.find_sent_folder(flagged), "[Gmail]/Odeslan&AOE- po&AWE-ta")
        by_name = [b'(\\HasNoChildren) "/" "INBOX"', b'(\\HasNoChildren) "/" "Odeslan&AOk-"']
        self.assertEqual(self.mail.find_sent_folder(by_name), "Odeslan&AOk-")
        self.assertEqual(self.mail.find_sent_folder([b'(\\HasNoChildren) "." "INBOX.Sent"']), "INBOX.Sent")
        self.assertIsNone(self.mail.find_sent_folder([b'(\\HasNoChildren) "/" "INBOX"']))
        # Koncepty s diakritikou se teď najdou i bez příznaku \\Drafts.
        self.assertEqual(self.mail.find_drafts_folder([b'(\\HasNoChildren) "/" "Rozepsan&AOk-"']), "Rozepsan&AOk-")

    def test_own_text_strips_quotes(self):
        gmail = ("Dobrý den, pane Nováku,\n\nposílám upravenou studii.\n\nS pozdravem\nPetr\n\n"
                 "Dne po 27. 10. 2026 v 10:00 Jan Novák <jan@example.cz>\nnapsal(a):\n> Můžete poslat studii?\n")
        self.assertEqual(self.mail.own_text(gmail), "Dobrý den, pane Nováku,\n\nposílám upravenou studii.\n\nS pozdravem\nPetr")
        outlook = "Díky, beru.\n\nOd: Jan Novák <jan@example.cz>\nOdesláno: pondělí 27. října 2026\nKomu: ja\n\nStarý text"
        self.assertEqual(self.mail.own_text(outlook), "Díky, beru.")
        separator = "Ahoj,\nviz níže.\n\n-------- Původní zpráva --------\nPředmět: x"
        self.assertEqual(self.mail.own_text(separator), "Ahoj,\nviz níže.")
        english = "Sounds good.\n\nOn Tue, 27 Oct 2026 at 10:00, Jan <jan@example.cz> wrote:\n> hi"
        self.assertEqual(self.mail.own_text(english), "Sounds good.")
        self.assertEqual(self.mail.own_text("Od: zítřka beru dovolenou.\nPetr"), "Od: zítřka beru dovolenou.\nPetr")

    def test_odeslane_reads_sent_folder_read_only(self):
        reply = make_raw(subject="Re: Studie", body="Posílám studii.\n\nDne 27. 10. 2026 Jan napsal(a):\n> Pošlete studii?")
        quoted_only = make_raw(subject="Fwd", body="> jen citace")
        fake = FakeIMAP({5: reply, 6: quoted_only}, list_lines=[
            b'(\\HasNoChildren) "/" "INBOX"', b'(\\HasNoChildren \\Sent) "/" "Odeslan&AOk-"'])
        with mock.patch.object(self.mail, "connect", return_value=fake):
            res = self.mail.cmd_odeslane(self.cfg, 10, 365, 3000)
        self.assertTrue(fake.readonly)
        self.assertEqual(fake.selected, '"Odeslan&AOk-"')
        self.assertEqual(res["slozka"], "Odeslané")
        self.assertEqual([m["text"] for m in res["zpravy"]], ["Posílám studii."])
        self.assertEqual(res["pocet_v_obdobi"], 2)
        self.assertEqual(fake.appended, [])

    def test_imap_date_format(self):
        self.assertEqual(self.mail.imap_date(0, now=1793174400), "28-Oct-2026")


if __name__ == "__main__":
    unittest.main()
