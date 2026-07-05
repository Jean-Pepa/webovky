#!/usr/bin/env python3
"""Jednorazove vygenerovani Garmin tokenu (garth) na TVEM pocitaci.

Spusteni:
    pip install garth
    python get-token.py

Prihlasi se ke Garmin Connect (email + heslo, pripadne MFA kod), a ulozi
token do souboru garmin_token.txt. Obsah toho souboru posli Claudovi
(pripadne vloz do GitHub secret GARMIN_TOKEN). HESLO nikam neposilas.
"""
import garth

email = input("Garmin email: ").strip()
password = input("Garmin heslo: ").strip()

# Kdyz je zapnute dvoufazove overeni, garth se zepta: "MFA code:" -> zadas kod z SMS/appky.
garth.login(email, password)

token = garth.client.dumps()
with open("garmin_token.txt", "w") as f:
    f.write(token)

print("\n=== HOTOVO ===")
print("Token je ulozeny v souboru: garmin_token.txt")
print("Posli jeho obsah Claudovi (nebo vloz do GitHub secret GARMIN_TOKEN).")
print("Heslo nikam neputovalo, jen token.")
