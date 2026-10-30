---
name: texty-dokumentace
description: Koncepty textů projektové dokumentace podle vyhlášky č. 131/2024 Sb.: průvodní list, souhrnná technická zpráva a technická zpráva D.1.1.1. Použij, když chci napsat některý z nich.
---

# Texty projektové dokumentace

1. **Projekt a fáze.** Najdi `projekty/<název>/projekt.md`. Když neexistuje, zkopíruj
   `projekty/_sablona/projekt.md` a vyptej se mě na údaje (po tématech, ne všechno najednou).
   Fáze určuje osnovu:
   - povolení stavby → `podklady/predpisy/131-2024-priloha-1-povoleni-stavby.md`,
   - provádění rodinného domu → `podklady/predpisy/131-2024-priloha-9-RD-A-B.md`. Části A a B
     se podle vyhlášky přebírají z dokumentace pro povolení a jen se reviduje, hlavně soulad
     s povolením záměru a podmínky závazných stanovisek.
2. **Načti podklady:** osnovu z bodu 1, šablonu z `podklady/sablony/` (`povoleni-A-…`,
   `povoleni-B-…`, `povoleni-D111-…`), `podklady/styl-psani.md`,
   `podklady/sablony/ustalene-formulace.md` a z projektu rešerši pozemku a průzkumy.
3. **Kontrola úplnosti.** Nejlépe na hlubokém modelu; když běžíš na jiném, navrhni mi
   `/model hluboky`. Projdi každý bod osnovy a vypiš, co chybí nebo si odporuje. Příklady:
   koeficient zastavění nad limit územního plánu, jiná zastavěná plocha v A.3 a B.1 j),
   chybí radonový index nebo vyjádření správce sítě. Ulož do
   `projekty/<název>/texty/kontrola-uplnosti.md` a ukaž mi to dřív, než začneš psát.
4. **Psaní.** Nejlépe na hlavním modelu; navrhni mi `/model hlavni`.
   - Vyplň šablonu bod po bodu. Žádný bod osnovy nevynech; když se netýká, napiš jednou větou proč.
   - Čísla a fakta jen z karty projektu, rešerše, průzkumů a vyjádření. Co chybí:
     `[DOPLNIT: co a odkud]`. Nic si nevymýšlej, ani „typické" hodnoty.
   - Tvrzení o souladu s předpisy a územním plánem bez doloženého podkladu: `[OVĚŘIT: proč]`.
   - Drž se `podklady/styl-psani.md` a používej ustálené formulace.
5. **Ulož** do `projekty/<název>/texty/`: `A-pruvodni-list.md`,
   `B-souhrnna-technicka-zprava.md`, `D111-technicka-zprava.md`.
6. **Pro autora.** Na konec každého souboru vypiš všechna `[DOPLNIT]` a `[OVĚŘIT]`, otázky na
   investora a doporučené kontroly.
7. **Shrnutí pro mě:** co je hotové, kolik bodů čeká, tři největší rizika.
8. **Export do Wordu** jen na můj pokyn:
   `pandoc B-souhrnna-technicka-zprava.md -o B-souhrnna-technicka-zprava.docx`.
   Když je v `podklady/sablony/` soubor `hlavicka.docx`, přidej
   `--reference-doc=podklady/sablony/hlavicka.docx`.

Výstup je koncept. Kontroluje, podepisuje a odpovídá za něj autorizovaná osoba.
Údaje o stavebníkovi nepiš do paměti, deníku ani do dotazů ven (`resers-web`).
Když tě opravím, navrhni zapsat opravu do `podklady/styl-psani.md` nebo do ustálených formulací.
