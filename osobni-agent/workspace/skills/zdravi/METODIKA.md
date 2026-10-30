# Metodika: jak vyhodnocuju data z náramku

Přesná pravidla pro skript `agent-zdravi` a pro agenta. Čísla v hranatých závorkách odkazují
na zdroje na konci.

## 1. Zásady

1. **Čísla počítá skript, ne jazykový model.** Agent opisuje jen čísla z výstupu skriptu
   a uvádí soubor, ze kterého jsou. Co ve výstupu není, je „nevím".
2. **Srovnávám tě hlavně s tebou.** Měřítkem je tvůj vlastní normál z posledních 28 dní.
   Obecná doporučení pro dospělé uvádím jen jako souvislost a se zdrojem.
3. **Rozlišuju vím, odhad a nevím:**
   - naměřená hodnota a srovnání s normálem: vím,
   - stav zotavení a souvislosti s deníkem: odhad podle pevných pravidel,
   - chybějící data nebo normál z méně než 14 dní: nevím.
4. **Žádné diagnózy.** Při upozornění skript i agent doporučí lékaře.
5. **Souvislost není příčina.** Příčinu ověří až pokus (bod 9).

## 2. Data

Jeden den je jeden soubor `zdravi/data/RRRR-MM-DD.json`. Zapisuje ho stahování dat, nikdy
agent. Den D obsahuje:
- **noc, která skončila ráno dne D** (`spanek`): začátek a konec, čas v posteli, spánek,
  fáze (lehký, hluboký, REM), bdění, usínání, případně efektivitu,
- **ranní hodnoty dne D**: klidový tep, HRV (RMSSD, Google ho počítá ze spánku [5]), dech ve
  spánku, průměrné SpO2 v noci, odchylku teploty kůže,
- **aktivitu za celý den D**: kroky, aktivní minuty, kolik hodin byl náramek nošen.

Aktivní minuty jsou minuty střední intenzity, minuta vysoké intenzity se počítá dvakrát.
Stejně počítají „minuty v aktivní zóně" u Fitbitu [15] i doporučení WHO [4].

Pole `google` může nést vlastní skóre Googlu (skóre spánku, připravenost). Skript je jen
ukáže a do výpočtů je nebere.

Ukázka:
```json
{
  "datum": "2026-11-12",
  "spanek": {
    "zacatek": "2026-11-11T23:41:00+01:00", "konec": "2026-11-12T07:02:00+01:00",
    "v_posteli_min": 441, "spanek_min": 402, "lehky_min": 220, "hluboky_min": 78,
    "rem_min": 104, "bdeni_min": 39, "latence_min": 12
  },
  "tep_klidovy": 54, "hrv_rmssd_ms": 48.2, "dech_za_min": 14.1,
  "spo2_prumer_pct": 96.1, "teplota_odchylka_c": 0.2,
  "kroky": 8432, "aktivni_min": 34, "noseni_h": 22.5,
  "google": { "skore_spanku": 78, "pripravenost": 64 }
}
```

## 3. Kvalita dat

- **Nevěrohodná hodnota se vyřadí** a zapíše do části „Kvalita dat". Příklady: klidový tep
  mimo 25–150, HRV mimo 3–300 ms, SpO2 mimo 60–100 %, spánek nad 16 h.
- **Noc kratší než 3 hodiny** není hlavní noc a do normálu se nepočítá. Google pro většinu
  ukazatelů také potřebuje aspoň 3 hodiny spánku [6].
- **Fáze spánku** se použijí jen tehdy, když jejich součet sedí na délku spánku (±10 %).
- **Aktivita** se do normálu počítá jen ze dnů, kdy byl náramek nošen aspoň 14 hodin. Stejnou
  hranici používá Google u připravenosti [6].
- **Nemoc:** den se štítkem `nemoc` a noc po něm se do normálu ani do srovnání nepočítají,
  aby nemoc neposunula tvůj normál.

## 4. Tvůj normál

- **Normál** je medián z posledních 28 dní před hodnoceným dnem, z nejméně 14 platných dní.
  S méně dny je výsledek „nevím, normál se teprve učí". Google také uvádí, že přesnější
  normál má až po 2 týdnech nošení [6].
- **Pásmo normálu** je normál ± jeden robustní rozptyl (1,4826 × medián odchylek od mediánu).
  Medián a tento rozptyl jsou odolné proti jednotlivým extrémům.
- **Nejmenší šířka pásma**, aby se drobné výkyvy nehlásily jako odchylka. Je to moje volba,
  ne převzatá hodnota:

  | Ukazatel | ± nejméně |
  |---|---|
  | spánek, začátek, konec a střed spánku | 15 min |
  | hluboký spánek, REM, bdění | 8 min |
  | usínání | 5 min |
  | efektivita | 2 procentní body |
  | klidový tep | 1,5 tepu/min |
  | HRV | 5 % |
  | dech | 0,3 /min |
  | SpO2 | 0,5 bodu |
  | teplota kůže | 0,15 °C |
  | kroky | 800 |
  | aktivní minuty | 8 min |

- **Hodnocení:** v pásmu „v normálu", do dvojnásobku pásma „mimo normál", dál „výrazně mimo
  normál". U ukazatelů se směrem skript připíše „příznivě" nebo „nepříznivě" (vyšší HRV
  příznivě, vyšší klidový tep nepříznivě). Časy spánku směr nemají.
- **HRV** se počítá v logaritmu (ln RMSSD), jak je zvykem při sledování HRV ve sportu [8].
  Ukazuje se v milisekundách a rozdíly v procentech.

## 5. Noc

- **Spánek, efektivita, usínání a bdění** proti tvému normálu.
- **Cíl spánku** je 7 hodin, jak doporučují AASM a SRS dospělým [1]. Změníš ho řádkem
  `cil_spanku_h: 7.5` v `zdravi/nastaveni.md`.
- **Spánkový dluh** za 7 nocí je součet toho, co chybělo do cíle. Noci nad cílem dluh
  nesnižují.
- **Pravidelnost** je směrodatná odchylka středu spánku za 7 nocí (aspoň 5 nocí).
- **Efektivita** (spánek ÷ čas v posteli): NSF považuje 85 % a víc za znak dobré kvality
  spánku [2]. Skript to uvede jen u týdenního průměru.
- **Fáze spánku** měří spotřebitelská zařízení méně spolehlivě než délku spánku. Lehký spánek
  obvykle nadhodnocují [3]. Proto je hodnotím jen proti tvému normálu a z jedné noci
  neusuzuju nic.

## 6. Zotavení

**Stav zotavení** je odhad skriptu podle pevných bodů. Není to skóre Googlu:

| Signál | Body |
|---|---|
| HRV pod pásmem (výrazně) | 1 (2) |
| klidový tep nad pásmem (výrazně) | 1 (2) |
| spánek o víc než 60 (120) minut pod cílem | 1 (2) |
| dech ve spánku výrazně nad pásmem | 1 |
| teplota kůže výrazně nad pásmem | 1 |

0 bodů = dobré, 1–2 = snížené, 3 a víc = nízké. Bez HRV i klidového tepu = nevím.

**HRV za týden:** 7denní průměr ln RMSSD z nejméně 3 měření [8] proti normálu z 28 dní před
tímto týdnem. Pásmo je normál ± 0,5 rozptylu. Sedmidenní průměry s nejmenší významnou
změnou doporučují pokyny Australského institutu sportu [7]. Násobek 0,5 je běžná volba
v praxi, přesnou hodnotu jsem ve zdrojích neověřil a jde změnit.

## 7. Aktivita

- **Kroky a aktivní minuty** včerejšího dne proti tvému normálu. Ráno je dnešní den ještě
  neúplný.
- **Týden:** součet aktivních minut za 7 celých dní proti doporučení WHO 150–300 minut
  střední intenzity týdně [4].

## 8. Upozornění

- **Možná zátěž organismu:** výrazně mimo normál jsou aspoň dva z ukazatelů klidový tep
  (nahoru), HRV (dolů), dech (nahoru) a teplota (nahoru). Nebo je výrazně zvýšený klidový tep
  dva dny po sobě. Zvýšený klidový tep z nositelných zařízení předcházel u části lidí
  příznakům nemoci [9][10]. Skript to hlásí jako možnou zátěž (nemoc, únava, alkohol, stres),
  ne jako diagnózu.
- **Lékař:**
  - klidový tep nad 100 tepů/min aspoň 3 dny ze 7. Nad 100 tepů/min v klidu se mluví
    o tachykardii [11],
  - průměrné SpO2 v noci pod 90 % aspoň 2 noci ze 7. WHO bere SpO2 pod 90 % jako
    hypoxémii [12]. SpO2 z náramku je jen orientační.
- **Hned volat 155:** bolest na hrudi, dušnost, mdloba, náhlá slabost nebo porucha řeči.
  To hlídá agent v rozhovoru, skript ne.
- **Nepravidelný rytmus srdce** hlídá aplikace Google Health. Skript ani agent ho
  neposuzují.

## 9. Deník a souvislosti

**Štítky.** Večerní deník končí řádkem, např.:
`Štítky: sport=ano, alkohol=2, kava-po-14=ne, jidlo-po-21=ne, prace-po-22=ano, stres=4`

| Štítek | Význam | Hodnoty |
|---|---|---|
| `sport` | cvičil jsem | ano / ne |
| `alkohol` | počet sklenic | 0, 1, 2… |
| `kava-po-14` | káva nebo jiný kofein po 14:00 | ano / ne |
| `jidlo-po-21` | větší jídlo po 21:00 | ano / ne |
| `prace-po-22` | práce nebo obrazovka po 22:00 | ano / ne |
| `stres` | jak stresující byl den | 1–5 |
| `nemoc` | jsem nemocný | ano |
| další (`cesta`, `oslava`…) | co se stalo | ano |

- `?` znamená „nevím". Klíčový štítek, který v deníku chybí, se nepočítá ani jako ano, ani
  jako ne. U ostatních štítků je den se štítky, ale bez tohoto štítku „ne".
- **Stres** 4–5 je „ano", 1–2 „ne", 3 se nepočítá.
- **Srovnání:** večery se štítkem proti večerům bez něj za posledních 90 dní. Porovnává se
  následující noc a ráno: spánek, efektivita, hluboký a REM spánek, bdění, HRV a klidový tep.
  Do srovnání nejdou dny nemoci ani neplatné noci.
- **Podmínka:** aspoň 5 večerů se štítkem a 5 bez něj.
- **Statistika:**
  - rozdíl průměrů,
  - permutační test (2 000 přeskupení, opakovatelný výsledek),
  - 95% interval metodou bootstrap (2 000 opakování),
  - oprava na mnoho srovnání najednou podle Benjaminiho a Hochberga s hranicí 10 % [13].
- **Výsledek:**
  - „průkazná souvislost" = projde opravou,
  - „naznačená, může jít o náhodu" = p pod 0,05 bez opravy,
  - jinak se souvislost nehlásí,
  - hlásí se jen rozdíly, které mají smysl (např. aspoň 10 min spánku, 5 min hlubokého spánku,
    3 % HRV, 1 tep/min).
- **Štítky, které chodí spolu** (třeba alkohol a pozdní jídlo), skript vyznačí. Jejich vliv
  nejde oddělit.

## 10. Pokusy

1. **Předem** se určí, co měníš, od kdy do kdy (aspoň 14 dní) a hlavní ukazatel. Agent to
   zapíše do `zdravi/pokusy.md`.
2. **Srovnání** je stejně dlouhé období těsně před pokusem, nebo období, které zadáš.
3. **Hlavní ukazatel** je průkazný při p pod 0,05. Ostatní ukazatele jsou doplňkové a platí
   pro ně oprava na počet srovnání.
4. **Pokus není slepý.** Výsledek může ovlivnit i práce, nemoc nebo počasí. Spolehlivější je
   ho zopakovat: pokus, pauza, pokus.

## 11. Co je jinak než u Googlu

- **Skóre spánku Googlu** se skládá z délky spánku, hlubokého a REM spánku a zotavení (tep ve
  spánku proti klidovému tepu a neklid). Přesný vzorec Google nezveřejnil [14].
- **Připravenost** porovnává HRV, klidový tep a nedávný spánek s tvým normálem [6].
- **Tady** je každý krok vidět a spočítaný z tvých dat. Navíc se data propojují s tím, co
  řekneš do deníku. Skóre Googlu, když jsou v datech, se ukážou vedle pro srovnání.

## Zdroje

1. Watson NF a kol. Recommended Amount of Sleep for a Healthy Adult: A Joint Consensus
   Statement of the AASM and SRS. J Clin Sleep Med 2015;11(6).
   https://www.aasm.org/resources/pdf/adultsleepdurationconsensus.pdf
2. Ohayon M a kol. National Sleep Foundation's sleep quality recommendations: first report.
   Sleep Health 2017;3(1):6–19. doi:10.1016/j.sleh.2016.11.006
3. Chinoy ED a kol. Performance of seven consumer sleep-tracking devices compared with
   polysomnography. Sleep 2021. https://doi.org/10.1093/sleep/zsaa291
4. Bull FC a kol. World Health Organization 2020 guidelines on physical activity and sedentary
   behaviour. Br J Sports Med 2020. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7719906/
5. Google Health: HRV a další hodnoty. https://support.google.com/googlehealth/answer/14236917
6. Google: Daily Readiness (nošení aspoň 14 h, 3 h spánku, normál za 2 týdny).
   https://support.google.com/fitbit/answer/14236710
7. Australian Institute of Sport: Heart rate variability, best practice guidelines (2023).
   https://www.ais.gov.au/__data/assets/pdf_file/0013/1130260/HRV-BPG_FINAL.pdf
8. Plews DJ a kol. Monitoring training with heart-rate variability: how much compliance is
   needed for valid assessment? Int J Sports Physiol Perform 2014.
9. Mishra T a kol. Pre-symptomatic detection of COVID-19 from smartwatch data. Nat Biomed Eng
   2020.
10. Alavi A a kol. Real-time alerting system for COVID-19 and other stress events using
    wearable data. Nat Med 2022. https://www.nature.com/articles/s41591-021-01593-2
11. Harvard Health: Tachycardia. https://www.drugs.com/health-guide/tachycardia.html
12. WHO: Oxygen therapy for children (2016).
    https://www.who.int/westernpacific/publications/i/item/9789241549554
13. Benjamini Y, Hochberg Y. Controlling the false discovery rate. J R Stat Soc B 1995;57(1).
14. Google: Jak se počítá skóre spánku. https://support.google.com/fitbit/answer/14236513
15. Google Health: Active Zone Minutes. https://support.google.com/googlehealth/answer/14236509
