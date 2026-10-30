---
name: vecerni-denik
description: Večerní deník z hlasové zprávy nebo textu – co se stalo, rozhodnutí, úkoly a štítky. Použij, když řeknu „deník" nebo večer pošlu hlasovou zprávu o dni.
---

# Večerní deník

1. **Vstup:** přepis hlasové zprávy (přepíše ji Whisper v notebooku) nebo můj text.
   U nejistých jmen, čísel a částek se zeptej.
2. **Zápis do deníku** `memory/RRRR-MM-DD.md` pod nadpis „Večerní deník". Ten zapisuješ
   sám, bez ptaní:
   - co se stalo (krátce, v bodech),
   - co jsem rozhodl a proč,
   - co mě potěšilo a co štvalo,
   - co zůstalo otevřené.
   Piš mými slovy. Nic nepřikrašluj a nic si nedomýšlej.
3. **Štítky pro zdraví** (jen když existuje složka `zdravi/data/`): na konec zápisu přidej
   jeden řádek, ze kterého skript `agent-zdravi` počítá souvislosti se spánkem:
   `Štítky: sport=ano, alkohol=0, kava-po-14=ne, jidlo-po-21=ne, prace-po-22=ano, stres=3`
   - Klíčové štítky:
     - `sport`,
     - `alkohol` (počet sklenic),
     - `kava-po-14` (kofein po 14:00),
     - `jidlo-po-21` (větší jídlo po 21:00),
     - `prace-po-22` (práce nebo obrazovka po 22:00),
     - `stres` (1–5).
   - Hodnoty ber jen z toho, co jsem řekl. Co nevíš, zapiš `?`. „Ne" si nikdy nedomýšlej.
   - Když chybí dva nebo víc klíčových štítků, polož mi jednu otázku: „Pro spánek: sport,
     alkohol, káva po 14, jídlo po 21, práce po 22, stres 1–5?" Je to ta jediná doplňující
     otázka z bodu 6.
   - Další štítky přidej, když se něco stalo: `nemoc`, `cesta`, `oslava`, `pozdni-trenink`.
     Piš je malými písmeny, bez diakritiky a slova spoj pomlčkou.
   - `nemoc` napiš pokaždé, když jsem nemocný. Takové dny se nepočítají do mého normálu.
   - Štítky patří ke dni, o kterém mluvím. Když deník posílám po půlnoci, zapiš je do
     souboru předchozího dne.
4. **Úkoly:** závazky a termíny mi navrhni do `ukoly.md`.
5. **Digitální kopie:** když se objeví něco, co mění to, co o mně víš (nový cíl, změna
   názoru, důležité rozhodnutí s důvodem, nový člověk), navrhni zápis do `ja/` nebo `lide/`.
   Zapiš až po mém „ano". Rozhodnutí s důvody patří do tabulky v
   `ja/hodnoty-a-rozhodovani.md`.
6. **Odpověď:** krátce „Zapsáno" a nanejvýš jedna doplňující otázka, když opravdu pomůže,
   např. „Proč ses nakonec rozhodl pro X?". Žádné rady, pokud o ně nepožádám.
7. **Týdně:** v nedělním týdenním plánu shrň témata deníku za týden a navrhni, co z nich
   zapsat do `ja/`.

Deník je jen pro mě. Nic z něj nedávej do dotazů přes `agent-resers`.
