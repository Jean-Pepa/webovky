---
name: nocni-uklid-pameti
description: Noční úklid paměti – deník, MEMORY.md, lidé, nedotažené věci a mapa Mozku prehled.md. Spouští se ve 3:00 nebo na pokyn „ukliď paměť".
---

# Noční úklid paměti

Cíl: ráno je všechno přehledné a na jakoukoli otázku se odpověď najde rychle v `prehled.md`.

1. Přečti deník za posledních 7 dní, `MEMORY.md`, `ukoly.md` a dosavadní `prehled.md`.
2. Najdi nová trvalá fakta a preference, změny starých faktů, rozhodnutí, opakující se témata,
   nedotažené sliby a úkoly bez termínu.
3. Aktualizuj `MEMORY.md`: každý záznam s datem a zdrojem. Změněný fakt přepiš a starou verzi
   označ „(neplatí od RRRR-MM-DD)". Nic jiného nemaž.
4. Aktualizuj soubory v `lide/`: nové události do Historie.
5. Spusť `agent-zdravi data --ulozit` (uloží přehled zdraví a vypíše řádek se souhrnem za
   7 dní) a `agent-kalendar udalosti --dni 7`. Když některý skončí chybou, jeho část
   v přehledu vynech a napiš proč.
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

## Kde co je
deník, úkoly, nákupy, MEMORY.md, ja/ (jednou větou, co je v kterém souboru), lide/,
projekty/, podklady/, prichozi/
```
