---
name: zdravi
description: Spánek, zotavení a aktivita z náramku Fitbit Air a souvislosti s deníkem. Na otázku k jedné noci („jak jsem spal před týdnem") spusť rovnou agent-zdravi noc --den "před týdnem". Použij, když se ptám na spánek, únavu, tep, kroky nebo pokus, a při ranním přehledu a týdenním plánu.
---

# Zdraví z náramku

Přesná pravidla a zdroje jsou v `skills/zdravi/METODIKA.md`. Drž se jich.

1. **Čísla jen ze skriptu.** Sám nepočítej nic, ani průměr, rozdíl nebo procento. Spusť:
   - na otázku k jedné noci („jak jsem spal před týdnem", „v noci na sobotu") jen
     `agent-zdravi noc --den "…"` s dnem slovy, jak padl, a nic dalšího nečti,
   - ráno `agent-zdravi den` (když už je hotový `zdravi/RRRR-MM-DD.md`, stačí ho přečíst),
   - v neděli `agent-zdravi tyden`,
   - na pokus `agent-zdravi pokus --nazev "…" --od RRRR-MM-DD --do RRRR-MM-DD --hlavni spanek_min`,
   - když něco nesedí, `agent-zdravi kontrola`.

   Čísla opisuj přesně a uveď soubor, ze kterého jsou. Co ve výstupu není, je „nevím".
   Když skript skončí chybou, řekni mi ji doslova.
2. **Ranní přehled, nejvýš 3 řádky:**
   - jak jsem spal proti svému normálu,
   - stav zotavení a proč,
   - jestli včerejší štítky v deníku podle mých dat souvisí se spánkem. Ber to jen z části
     „Večer … podle deníku".

   Upozornění ze skriptu přidej vždycky a celé, i nad ty 3 řádky.
3. **Týdenní rozbor** dělej na hlubokém modelu (`/model hluboky`). Shrň:
   - spánek a spánkový dluh,
   - pravidelnost,
   - zotavení,
   - aktivitu proti doporučení WHO,
   - souvislosti s deníkem.

   U každé souvislosti uveď počet dní a jestli je „průkazná", nebo jen „naznačená".
4. **Jak mluvit o souvislostech:**
   - Piš „souvisí", nikdy „způsobuje".
   - U naznačené souvislosti vždy dodej „může jít o náhodu".
   - Když se ptám, proč jsem spal špatně, ukaž, co je ve včerejším deníku. Jako možnou
     příčinu jmenuj jen štítek s průkaznou souvislostí. Všechno ostatní označ jako domněnku.
5. **Pokusy:**
   - Když se objeví naznačená souvislost, navrhni pokus:
     - co změním,
     - od kdy do kdy (aspoň 14 dní),
     - hlavní ukazatel.
   - Po mém „ano" ho zapiš do `zdravi/pokusy.md`.
   - Po skončení ho vyhodnoť příkazem `agent-zdravi pokus` se stejným hlavním ukazatelem.
6. **Zdraví a bezpečnost:**
   - Nejsi lékař. Nestanovuj diagnózy a neraď léky ani doplňky stravy.
   - Upozornění ze skriptu předej doslova, i s doporučením lékaře.
   - Když napíšu o bolesti na hrudi, dušnosti, mdlobě, náhlé slabosti nebo poruše řeči,
     odpověz hned: „Volej 155." Nic dalšího nerozebírej.
   - Nepravidelný rytmus srdce hlídá aplikace Google Health. Sám ho neposuzuj.
7. **Soukromí:** data o zdraví a deník nikdy neopustí počítač. Nedávej je do `agent-resers`,
   do mailů ani nikam jinam.
8. **Skóre Googlu:** když jsou ve výstupu (skóre spánku, připravenost), uveď je jako
   „Google: …". Vysvětluj ale podle našeho rozpisu, vzorec Googlu není veřejný.
9. **Fáze spánku** (hluboký, REM) měří náramek méně přesně než délku spánku. Z jedné noci
   o nich nic neusuzuj.
10. **Nastavení mění jen já.** Cíl spánku je řádek `cil_spanku_h: 7.5` v `zdravi/nastaveni.md`.
    Soubory v `zdravi/data/` nikdy neměň, zapisuje je jen stahování dat.
