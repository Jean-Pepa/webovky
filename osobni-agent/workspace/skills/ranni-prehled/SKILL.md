---
name: ranni-prehled
description: Ranní přehled dne na požádání – spánek, co dnes udělat, termíny a úkoly, maily a s čím může agent pomoct. Použij, když napíšu „přehled", „ranní přehled" nebo „co mě dnes čeká".
---

# Ranní přehled

1. Projdi `ukoly.md`: dnešní a zítřejší termíny, úkoly po termínu.
2. Projdi včerejší a dnešní deník: otevřené věci, sliby, sekce „Čeká na tebe" a „Z nočního
   přemýšlení" a maily „Do přehledu".
3. **Maily** jen tehdy, když je pošta nastavená: spusť dovednost `hlidani-mailu`. Když
   `agent-mail` hlásí, že přihlášení není vyplněné, maily vynech a nic o nich nepiš.
4. **Spánek** jen tehdy, když existuje složka `zdravi/data/`: postupuj podle dovednosti
   `zdravi` (`agent-zdravi den`).
5. Napiš mi přehled rovnou do chatu, nejvýš 12 řádků, v tomhle pořadí:
   - spánek a zotavení, nejvýš 3 řádky (upozornění ze skriptu vždycky celé),
   - 3 nejdůležitější věci na dnešek a proč,
   - termíny,
   - maily, které čekají na odpověď (od koho, o co jde),
   - co můžeš udělat za mě (koncepty, rešerše, nákup).

   Co nemáš z čeho zjistit, vynech. Nic si nedomýšlej.
6. Přehled ulož do dnešního deníku pod nadpis „Ranní přehled". Když tam dnešní přehled už
   je, nahraď ho novým.
