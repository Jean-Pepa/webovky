---
name: ranni-prehled
description: Ranní přehled dne na požádání – spánek, co dnes udělat, termíny a úkoly, maily a s čím může agent pomoct. Použij, když napíšu „přehled", „ranní přehled" nebo „co mě dnes čeká".
---

# Ranní přehled

1. Začni z `prehled.md` (mapa z nočního úklidu). Pak projdi `ukoly.md`: dnešní a zítřejší
   termíny, úkoly po termínu.
2. Projdi včerejší a dnešní deník: otevřené věci, sliby, sekce „Čeká na tebe" a „Z nočního
   přemýšlení" a maily „Do přehledu".
3. **Maily** jen tehdy, když je pošta nastavená: spusť dovednost `hlidani-mailu`. Když
   `agent-mail` hlásí, že přihlášení není vyplněné, maily vynech a nic o nich nepiš.
4. **Spánek** jen tehdy, když existuje složka `zdravi/data/`: postupuj podle dovednosti
   `zdravi` (`agent-zdravi den`).
5. **Kalendář:** `agent-kalendar udalosti`. Když hlásí, že nejsi přihlášený, kalendář vynech.
   **Architektura:** z dnešního `novinky/RRRR-MM-DD.md` vyber 1–3 nejdůležitější body, změnu
   předpisů vždycky. Když soubor chybí, vynech to.
   **Svět:** z dnešního `svet/RRRR-MM-DD.md` opiš 3 body ze sekce „Nejdůležitější".
   **Noční průzkum:** když existuje dnešní `pruzkum/RRRR-MM-DD.md`, u každého dotazu jedna věta
   s odpovědí.
   **Soubory a bezpečnost:** když `agent-soubory historie --dni 1` ukazuje akce, napiš jednou
   větou, co jsem s nimi dělal (když hlásí chybu, vynech to). Každé POZOR
   z `bezpecnost/kontrola.md` napiš vždycky.
6. Napiš mi přehled rovnou do chatu, nejvýš 16 řádků, v tomhle pořadí:
   - bezpečnost: každé POZOR (když žádné není, vynech),
   - spánek a zotavení, nejvýš 3 řádky (upozornění ze skriptu vždycky celé),
   - 3 nejdůležitější věci na dnešek a proč,
   - dnešní události z kalendáře s časem a termíny z úkolů,
   - svět: 3 body, z architektury 1–3 body, obojí s odkazem na přehled,
   - noční průzkum: odpověď na každý dotaz jednou větou,
   - maily, které čekají na odpověď (od koho, o co jde),
   - co můžeš udělat za mě (koncepty, rešerše, nákup).

   Co nemáš z čeho zjistit, vynech. Nic si nedomýšlej.
7. Přehled ulož do dnešního deníku pod nadpis „Ranní přehled". Když tam dnešní přehled už
   je, nahraď ho novým.
