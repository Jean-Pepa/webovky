---
name: nocni-uklid-pameti
description: Noční úklid paměti – deník, MEMORY.md, lidé, opravy, inspirace, nedotažené věci a mapa Mozku prehled.md. Spouští se ve 3:00 nebo na pokyn „ukliď paměť".
---

# Noční úklid paměti

Cíl: ráno je všechno přehledné a na jakoukoli otázku se odpověď najde rychle v `prehled.md`.

1. Přečti deník za posledních 7 dní, `MEMORY.md`, `ukoly.md` a dosavadní `prehled.md`.
2. Najdi nová trvalá fakta a preference, změny starých faktů, rozhodnutí, opakující se témata,
   nedotažené sliby a úkoly bez termínu.
3. Aktualizuj `MEMORY.md`: každý záznam s datem a zdrojem. Změněný fakt přepiš a starou verzi
   označ „(neplatí od RRRR-MM-DD)". Nic jiného nemaž. `MEMORY.md` drž krátké, nejvýš asi
   100 řádků: podrobnosti přesuň do souboru podle tématu (`ja/`, `lide/`, `projekty/`)
   a v `MEMORY.md` nech jednu větu s odkazem. Sekci „Opravy" přesuň do `opravy.md`.
4. Aktualizuj soubory v `lide/`: nové události do Historie.
4b. **Opravy:** projdi `opravy.md`. Stejné chyby spoj do jednoho řádku a uprav počet. Když má
   chyba 3 a víc, napiš do sekce „Z nočního přemýšlení" návrh pravidla: přesné znění a kam
   patří (dovednost nebo `AGENTS.md`). Zapíšu ho já, sám pravidla neměň.
4c. **Inspirace:** když přibyly záznamy v `inspirace/`, přepiš `inspirace/prehled.md`: co se mi
   opakovaně líbí a proč (mými slovy, s odkazem na záznamy), nejčastější štítky, rozpory.
5. Spusť `agent-zdravi data --ulozit` (uloží přehled zdraví a vypíše řádek se souhrnem za
   7 dní) a `agent-kalendar udalosti --dni 7`. Když některý skončí chybou, jeho část
   v přehledu vynech a napiš proč. Se soubory na počítači ani s internetem v noci nepracuj.
6. Přepiš celý `prehled.md` podle osnovy níž.
   - Jen fakta z Mozku, u každého odkaz na soubor, odkud je. Nic si nedomýšlej.
   - Nejvýš 8 000 znaků. Starší a méně důležité věci zkracuj.
   - U projektů jen název, stav a další krok, žádné údaje o klientech.
7. Do dnešního deníku zapiš sekci „Z nočního přemýšlení" (nejvýš 5 bodů): souvislosti, které
   jsi našel, nedotažené věci a návrhy.
8. Nic neposílej, nekupuj ani neodesílej. Tahle dovednost pracuje jen s poznámkami.

## Osnova `prehled.md`

```
# Přehled Mozku

Aktualizováno RRRR-MM-DD nočním úklidem. Na otázky odpovídej nejdřív odtud.

## Teď řeším
otevřené věci a termíny na 14 dní (z ukoly.md a deníku), u každé zdroj

## Kalendář na 7 dní
den, čas a název (z agent-kalendar)

## Poslední rozhodnutí
za 30 dní: datum, co a proč, odkaz na deník

## Lidé
jméno – kdo to je, poslední kontakt → lide/<soubor>.md

## Projekty
název – stav a další krok → projekty/<název>/projekt.md

## Zdraví
řádek se souhrnem za 7 dní z výstupu agent-zdravi data --ulozit, opsaný přesně
→ zdravi/prehled.md (všechny dny)

## Rozhodnutí k vyhodnocení
rozhodnutí z rozhodnuti/ s termínem „Vyhodnotit" do 14 dní → rozhodnuti/<soubor>.md

## Architektura
nejdůležitější bod z novinek za poslední den → novinky/RRRR-MM-DD.md, knihovna v novinky/clanky/
a znalosti/

## Svět a průzkum
nejdůležitější bod ze svet/RRRR-MM-DD.md (sekce Nejdůležitější), výsledky nočního průzkumu
→ pruzkum/RRRR-MM-DD.md, dotazy čekající ve frontě pruzkum/fronta.md

## Inspirace
jednou větou, co se mi opakovaně líbí → inspirace/prehled.md

## Bezpečnost
každé POZOR z bezpecnost/kontrola.md, opsané přesně, jinak „bez nálezů"

## Kde co je
deník, úkoly, nákupy, MEMORY.md, opravy.md, ja/ (jednou větou, co je v kterém souboru),
lide/, projekty/, rozhodnuti/, inspirace/, podklady/, prichozi/, novinky/, znalosti/, svet/,
pruzkum/
```
