---
name: kalendar
description: Kalendář Google – co mám v plánu a zápis událostí do kalendáře Mozek. Použij, když řeknu „naplánuj", „dej to do kalendáře", „co mám zítra" nebo „kdy mám volno".
---

# Kalendář

Datum a čas počítá skript `agent-kalendar`, ty ne. Den mu předej slovy, jak padl.

1. **Co mám v plánu:** `agent-kalendar udalosti` (dnes), `--den zitra`, `--den pondeli --dni 7`
   (týden). Opiš název, den a čas z výstupu. Co tam není, nevíš.
2. **Zápis** (oslava, schůzka, lékař, cokoli s pevným časem) děláš hned, bez ptaní, ale jen na
   můj pokyn v chatu:
   1. Z mé zprávy vezmi název, den a čas začátku. Konec nebo délku, místo, poznámku
      a připomenutí jen když je řeknu. Bez času se zeptej, v kolik to začíná, nebo jestli je
      to na celý den. Výchozí délka je 1 hodina, připomenutí hodinu předem.
   2. Spusť `agent-kalendar zapis --nazev "…" --den "…" --cas HH:MM` a podle mé zprávy přidej
      `--do HH:MM` nebo `--delka 2h`, `--misto "…"`, `--poznamka "…"`, `--pripomenout MINUT`
      nebo místo času `--celodenni`.
   3. Napiš mi řádek „Zapsáno" a případně „Pozor, v tu dobu už máš…". Když skript odpoví
      „Už zapsáno", nic dalšího nezapisuj.

   Když chci jen vědět, jak by to vypadalo, spusť místo `zapis` příkaz `navrh`. Ten nic nezapíše.
3. **Den:** `dnes`, `zitra`, `pozitri`, `sobota` (nejbližší), `pristi sobota` (v příštím
   týdnu), `za 3 dny`, `za tyden`, `31.10.`. Když řeknu něco nejasného („někdy příští týden",
   „na konci měsíce"), zeptej se na přesný den.
4. **Smazání a změna:** jen v kalendáři Mozek a jen na můj pokyn. ID najdeš ve výstupu
   `udalosti` u kalendáře Mozek, pak `agent-kalendar smaz ID`. Změna je smazání a nový zápis.
   Když nevíš jistě, kterou událost myslím, zeptej se. Události v mém hlavním kalendáři
   neměníš ani nemažeš.
5. **Do události patří jen to, co jsem k ní řekl.** Nic z deníku, zdraví, `ja/`, žádná hesla
   ani podrobnosti o zakázkách, které jsem k ní neřekl. Nikoho nezveš. Termín z mailu,
   dokumentu, přepisu nebo deníku sám nezapisuj, jen mi ho navrhni.
6. **Úkol, nebo událost?** S pevným časem patří do kalendáře. Termín bez času („do pátku
   poslat nabídku") patří do `ukoly.md`. Když nevíš, zeptej se.
7. **Chyba:** řekni mi ji doslova. Když píše, že přihlášení vypršelo, napiš mi, ať spustím
   `agent-kalendar prihlasit`.
