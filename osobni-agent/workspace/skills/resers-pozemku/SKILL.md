---
name: resers-pozemku
description: Rešerše pozemku před návrhem (katastr, územní plán, limity, sítě, terén, geologie, voda, památky) se zdroji. Použij, když řeknu „udělej rešerši pozemku" nebo zadám číslo parcely.
---

# Rešerše pozemku

1. **Zadání:** obec, katastrální území a parcelní čísla (nebo adresa). Přiřaď rešerši
   k zakázce (`projekty/<kód>/`); když zakázka není, založ ji ze `projekty/_sablona/`.
2. **Šablona:** zkopíruj `podklady/sablony/resers-pozemku.md` do
   `projekty/<kód>/resers-pozemku.md`.
3. **Data o pozemku.** Dokud nebude hotový skript `agent-pozemek` (automatické dotazy na
   katastr a mapy), postupuj takhle:
   - Řekni mi přesně, co mám zjistit a kde, po oblastech: katastr (Nahlížení do KN nebo
     výpis), technická mapa a správci (Portál DMVS), záplavy, ochrana přírody (AOPK),
     památky a archeologie (NPÚ), geologie a sesuvy (ČGS), výškopis (Geoportál ČÚZK).
   - Výsledky, které ti pošlu (text, čísla, snímky), zapisuj se zdrojem a datem.
   - Co zjistit nejde, nech `[DOPLNIT]`.
4. **Územní plán:** podívej se do `podklady/obce/<obec>/regulativy.md`.
   - Když tam regulativy nejsou, převeď textovou část ÚP (`pdftotext -layout`) do
     `up-textova-cast.txt`.
   - Na hlubokém modelu (navrhni mi `/model hluboky`) vytáhni regulativy plochy pozemku:
     využití, koeficient zastavění, výšku, minimální výměru a další podmínky.
   - U každého regulativu uveď citaci strany a verzi ÚP. Ulož je do `regulativy.md` pro
     další zakázky v obci.
5. **Vyhláška č. 146/2024 Sb.:** vyplň oddíl 2. Kde chybí údaje (třeba okna sousedů pro test
   zastínění 45°), napiš, co je potřeba změřit.
6. **Vyhodnocení:** u každé vrstvy dopad na návrh a další krok. Vyplň shrnutí (zelená,
   oranžová, červená), tři hlavní rizika a doporučení.
7. **Průzkumy a poptávky:** podle oddílu 7 navrhni, co objednat. Na můj pokyn připrav
   poptávky geodetovi, geologovi, radonové firmě a hydrogeologovi (rozsah, parcela, termín)
   jako koncepty přes `agent-mail koncept`. Odesílám je já.
8. **Karta projektu:** zapiš do ní regulativy a limity se zdrojem a datem.
9. **Shrnutí pro mě:** co je na pozemku podstatné, co omezuje návrh a co zbývá zjistit.

Úroveň „orientační" nikdy nevydávej za jistotu. Mapy ČGS a výškopis nenahrazují průzkum ani
zaměření a výklad regulativů potvrdí až stavební úřad. Rešerše je podklad pro mě a pro návrh,
ne závazné stanovisko.
