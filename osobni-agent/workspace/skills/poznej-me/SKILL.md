---
name: poznej-me
description: Rozhovor „kdo jsem" po jedenácti tématech, ze kterého vzniká moje digitální kopie ve složce ja/ (příběh, hodnoty a rozhodování, jak navrhuju, firma, lidé, běžný den, jak píšu, cíle, co mě baví, názory, co mě formovalo). Použij, když řeknu „poznej mě", „pokračuj v rozhovoru", „rozhovor kdo jsem" nebo pošlu nahrávky odpovědí na otázky.
---

# Rozhovor „kdo jsem"

Cíl: znát mě tak, abys psal mým tónem, znal moje lidi a projekty a věděl, proč se rozhoduju
tak, jak se rozhoduju. Nejcennější je vždycky „proč", ne jen „co".

| Téma | Kam zapisuješ |
|---|---|
| 1 Životní příběh | `ja/pribeh.md` |
| 2 Hodnoty a rozhodování | `ja/hodnoty-a-rozhodovani.md` |
| 3 Proč a jak navrhuju | `ja/navrhovani.md` |
| 4 Firma a klienti | `ja/firma.md` (klienty jen obecně) |
| 5 Lidé kolem mě | `lide/` podle `lide/_sablona.md`, souhrn domácnosti do `USER.md` |
| 6 Běžný den a režim, 9 Co mě baví a co mi bere energii | `ja/zivot.md` |
| 7 Jak píšu a mluvím | `ja/komunikace.md` |
| 8 Cíle | `ja/cile.md` |
| 10 Názory a nápady | `ja/nazory.md` |
| 11 Kdo a co mě formovalo | `ja/formovalo-me.md` |

1. **Kde jsme:** přečti `ja/rozhovor.md`. Navrhni další téma, nebo vezmi to, které chci.
   Řekni, že zabere 30–40 minut a že můžu odpovídat hlasovou zprávou.
2. **Ptej se po jedné otázce**, nanejvýš po dvou. Otázky ber z `ja/otazky.md`, ale drž se
   toho, co říkám. Doptávej se na příklady a důvody: „Proč?", „Dáš příklad?", „Kdy to
   neplatilo?". Neopravuj mě a nehodnoť.
3. **Nahrávky z Diktafonu:** když pošlu nahrávky odpovědí, ulož je do `prichozi/` a přepiš
   `~/.local/bin/agent-prepis prichozi/NAZEV`. Téma a otázku poznáš ze začátku nahrávky.
   Když je tam nenajdeš, zeptej se mě.
4. **Téma 7 (jak píšu):** k rozhovoru projdi moje odeslané maily
   `~/.local/bin/agent-mail odeslane --max 100`. Do `ja/komunikace.md` zapiš jen rozbor
   stylu: oslovení, délku, obraty, tón podle typu adresáta, podpis. Celé maily ani údaje
   adresátů neukládej. Lidi, se kterými si píšu nejčastěji, mi navrhni do `lide/`.
5. **Zápis po tématu:**
   - Ukaž mi návrh, co zapíšeš do `ja/`, `lide/`, `MEMORY.md` a `USER.md`. Zapiš to až po
     mém „ano".
   - Drž se mých formulací. Kde shrnuješ, napiš „(shrnutí)". Ke každému zápisu dej zdroj
     a datum, např. „(rozhovor 3, 2026-11-05)".
   - Do `USER.md` dávej jen to, co máš vědět vždycky, nanejvýš jednu stranu. Podrobnosti
     patří do `ja/`.
6. **Citlivé věci** (zdraví, peníze, rodina, víra, politika) zapisuj, jen když výslovně řeknu,
   že je zapsat máš. Hesla, čísla karet a rodné číslo nikdy.
7. **Rozpory:** když řeknu něco jiného než dřív, upozorni mě a zeptej se, co platí. Starý
   údaj přepiš a změnu zapiš do deníku.
8. **Konec sezení:** ve třech větách shrň, co ses o mně dozvěděl nového, a zeptej se, jestli
   to sedí. Do `ja/rozhovor.md` zapiš stav tématu, datum a co zbývá doptat.

Rozhovor probíhá jen tady, v lokálním agentovi. Nic z něj nedávej do dotazů přes
`agent-resers`.
