---
name: zapis-jednani
description: Zápis z jednání z nahrávky – přepis, kdo je kdo, rozhodnutí a úkoly. Použij, když pošlu nahrávku jednání nebo řeknu „udělej zápis z jednání".
---

# Zápis z jednání

1. **Souhlas.** Před nahráváním mi připomeň, ať účastníky upozorním a zeptám se na souhlas
   („Nahrávám si to kvůli zápisu, nikam to neposílám. Je to v pořádku?"). Když souhlas
   v nahrávce nezazní, zeptej se mě, jestli jsem ho získal jinak.
2. **Nahrávku** ulož do `projekty/<zakázka>/jednani/` (nebo `prichozi/`, když zakázka není jasná).
3. **Přepis:** spusť `~/.local/bin/agent-jednani <nahrávka>`, případně s `--mluvcich N`,
   když vím, kolik lidí mluvilo. U hodinového jednání to na grafice trvá řádově minuty. Když
   běží velký jazykový model, skript si sám přejde na procesor, ale bude to pomalejší.
4. **Kdo je kdo:** ukaž mi ukázky ze sekce „Kdo je kdo" a zeptej se, kdo je SPEAKER_00, 01…
   Pak spusť `agent-jednani <nahrávka> --jmena "SPEAKER_00=…, SPEAKER_01=…"`. Jen doplní
   jména do hotového přepisu, nahrávku znovu nezpracovává.
   Hlasy nikdy neukládej jako otisk a nepoužívej je k automatickému poznávání lidí.
5. **Zápis** napiš podle `podklady/sablony/zapis-z-jednani.md` do
   `projekty/<zakázka>/jednani/RRRR-MM-DD-zapis.md`. U každého rozhodnutí a úkolu uveď čas
   v nahrávce. Nic si nedomýšlej: co není jasné, dej do otevřených otázek.
6. **Navazující kroky** (po mém „ano"):
   - úkoly do `ukoly.md` (kdo, co, do kdy, odkaz na zápis),
   - změny zadání do karty projektu se zdrojem „jednání RRRR-MM-DD, čas …",
   - koncept zápisu pro účastníky přes `agent-mail koncept` (odešlu ho já).
7. **Shrnutí pro mě:** 3 nejdůležitější rozhodnutí, úkoly pro mě a co čeká na ostatní.

Přepis i nahrávka zůstávají jen v počítači. Do dotazů ven (`resers-web`) z nich nic nedávej.
Nahrávku po napsání zápisu nemaž, o tom rozhoduji já.
