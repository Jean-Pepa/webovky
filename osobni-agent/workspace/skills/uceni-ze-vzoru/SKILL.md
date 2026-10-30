---
name: uceni-ze-vzoru
description: Naučí se můj styl psaní ze starších textů a navrhne pravidla stylu. Použij, když řeknu „nauč se můj styl" nebo přidám nové vzory.
---

# Učení ze vzorů

1. **Vzory** jsou v `podklady/vzory/`. Soubory PDF a DOCX nejdřív převeď na text (ve složce
   vzorů):
   - `pdftotext -layout soubor.pdf soubor.txt`
   - `pandoc soubor.docx -t gfm -o soubor.md`
2. **Rozbor** dělej na hlubokém modelu; když běžíš na jiném, navrhni mi `/model hluboky`.
   U každého vzoru zjisti:
   - členění a pořadí kapitol a jak se liší od osnovy vyhlášky,
   - podrobnost (délka jednotlivých částí) a tón,
   - typické formulace a opakující se odstavce (radon, záplavy, ZPF, BOZP, přípojky…),
   - jak odkazuje na výkresy, předpisy a podklady,
   - co vždy zmiňuje a co naopak vynechává.
3. **Návrh** zapiš do `podklady/styl-psani-navrh.md`:
   - část „Můj styl" (body jako v `styl-psani.md`),
   - nové ustálené formulace s hodnotami v hranatých závorkách.
4. **Žádná data klientů:** do návrhu nikdy nepřenášej jména, adresy, parcelní čísla, ceny ani
   jiné údaje konkrétních zakázek. Jen styl a obecné formulace.
5. **Ukaž mi návrh.** Po mém „ano" ho přenes do `podklady/styl-psani.md` (část „Můj styl")
   a do `podklady/sablony/ustalene-formulace.md`, pak návrh smaž.
6. **Učení za pochodu:** když v textu z jiné dovednosti opravím formulaci nebo strukturu,
   navrhni zapsat opravu sem, ať ji příště použiješ.
