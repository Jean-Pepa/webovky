#!/usr/bin/env python3
"""Zprávy do WhatsAppu, SMS a Messengeru: připraví odkaz, ze kterého zprávu odešleš ty.

    agent-zpravy whatsapp --cislo +420777123456 --text "Ahoj, …"
    agent-zpravy sms --cislo 777123456 --text "…"
    agent-zpravy messenger --uzivatel jmeno.prijmeni --text "…"

Nic neodesílá a nikam se nepřipojuje. Odkaz otevře v iPhonu aplikaci s hotovou zprávou
pro daného člověka a ty ji jedním klepnutím odešleš (nebo ještě upravíš). Do tvých chatů
ve WhatsAppu ani v Messengeru agent nevidí a nikdo ti kvůli tomu účet nezablokuje:
odkazy wa.me a sms: jsou oficiální způsob, jak zprávu předvyplnit.
Messenger předvyplnit zprávu neumí, odkaz jen otevře konverzaci a text zkopíruješ.
"""

from __future__ import annotations

import argparse
import re
import sys
import urllib.parse

MAX_TEXT = 4000


class ZpravyError(Exception):
    """Chyba, kterou umíme srozumitelně vysvětlit."""


def phone(text: str) -> str:
    """Číslo ve tvaru +420777123456. Devět číslic bez předvolby bere jako české."""
    digits = re.sub(r"[\s().-]", "", text.strip())
    if digits.startswith("00"):
        digits = "+" + digits[2:]
    if re.fullmatch(r"\d{9}", digits):
        digits = "+420" + digits
    if not re.fullmatch(r"\+\d{8,15}", digits):
        raise ZpravyError(f"„{text}“ nevypadá jako telefonní číslo. Piš ho třeba jako +420 777 123 456.")
    return digits


def pretty(number: str) -> str:
    if number.startswith("+420") and len(number) == 13:
        return f"+420 {number[4:7]} {number[7:10]} {number[10:]}"
    return number


def message(text: str) -> str:
    text = text.strip()
    if not text:
        raise ZpravyError("Zpráva je prázdná.")
    if len(text) > MAX_TEXT:
        raise ZpravyError(f"Zpráva má {len(text)} znaků, nejvýš {MAX_TEXT}. Dlouhé věci pošli mailem.")
    return text


def link(channel: str, text: str, number: str | None = None, user: str | None = None) -> tuple[str, str]:
    """(komu, odkaz) pro daný kanál."""
    text = message(text)
    if channel == "whatsapp":
        n = phone(number or "")
        return f"WhatsApp {pretty(n)}", f"https://wa.me/{n[1:]}?text={urllib.parse.quote(text)}"
    if channel == "sms":
        n = phone(number or "")
        # iPhone čte text zprávy za „&body=", číslo zůstává s plusem.
        return f"SMS {pretty(n)}", f"sms:{n}&body={urllib.parse.quote(text)}"
    if channel == "messenger":
        name = (user or "").strip().lstrip("@")
        name = re.sub(r"^https?://(www\.)?(m\.me|facebook\.com|messenger\.com/t)/", "", name).strip("/")
        if not re.fullmatch(r"[A-Za-z0-9.]{3,50}", name):
            raise ZpravyError("U Messengeru napiš uživatelské jméno z odkazu na profil, třeba jan.novak.")
        return f"Messenger {name}", f"https://m.me/{name}"
    raise ZpravyError(f"Neznámý kanál {channel}.")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="agent-zpravy",
                                     description="Odkaz s hotovou zprávou pro WhatsApp, SMS a Messenger.")
    sub = parser.add_subparsers(dest="kanal", required=True)
    for name in ("whatsapp", "sms"):
        p = sub.add_parser(name)
        p.add_argument("--cislo", required=True)
        p.add_argument("--text", required=True)
    p = sub.add_parser("messenger")
    p.add_argument("--uzivatel", required=True)
    p.add_argument("--text", required=True)
    args = parser.parse_args(argv)
    try:
        who, url = link(args.kanal, args.text, getattr(args, "cislo", None), getattr(args, "uzivatel", None))
    except ZpravyError as exc:
        print(f"Chyba: {exc}", file=sys.stderr)
        return 1
    print(f"Zpráva pro {who}:")
    print(message(args.text))
    print()
    if args.kanal == "messenger":
        print(f"Messenger předvyplnit zprávu neumí. Zkopíruj text a klepni na odkaz: {url}")
    else:
        print(f"Klepni na odkaz, zkontroluj zprávu a odešli ji: {url}")
    print("Nic jsem neodeslal. Odešleš ji ty.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
