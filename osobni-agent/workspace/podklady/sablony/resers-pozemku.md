# Rešerše pozemku: [obec], k. ú. [název], parc. č. [číslo]

- Datum rešerše: [RRRR-MM-DD] – stav dat k tomuto dni
- Zakázka: [kód] · Zpracoval: agent, zkontroloval: [jméno]
- Úrovně dat: **úřední** (z úředního zdroje), **měřeno** (průzkum, zaměření), **orientační**
  (mapový podklad, odhad – nestačí pro povolení)

Každý řádek: co platí, odkud a k jakému datu, jak spolehlivé to je, co to znamená pro návrh
a co je dál potřeba. Co není zjištěné: `[DOPLNIT]`, co je nejisté: `[OVĚŘIT]`.

## 0. Identifikace pozemku
| Údaj | Hodnota | Zdroj a datum | Úroveň |
|---|---|---|---|
| Výměra | | katastr (API KN / výpis) | úřední |
| Druh pozemku, způsob využití | | katastr | úřední |
| Způsob ochrany (ZPF, les, památka…) | | katastr | úřední |
| BPEJ (u zemědělské půdy) | | katastr / RÚIAN | úřední |
| Číslo LV, plomby (probíhající řízení) | | katastr | úřední |
| Věcná břemena, zástavy, předkupní práva | | výpis z LV (placený) | úřední |

## 1. Územní plán a regulativy
| Údaj | Hodnota | Zdroj (dokument, strana, verze ÚP) | Úroveň |
|---|---|---|---|
| Funkční plocha | | | úřední |
| Hlavní / přípustné / podmíněně přípustné / nepřípustné využití | | | úřední |
| Koeficient zastavění (nebo jiná míra využití) | | | úřední |
| Výšková regulace (výška, podlažnost) | | | úřední |
| Minimální výměra pozemku | | | úřední |
| Stavební čára, další prostorové podmínky | | | úřední |
| Platnost a změny ÚP, soudní zrušení, stavební uzávěra | | | úřední |

Výklad regulativů je potřeba potvrdit. Jistotu dá předběžná informace stavebního úřadu
(§ 174 zákona č. 283/2021 Sb., poplatek 1 000 Kč, do 30 dnů, není závazná).

## 2. Požadavky vyhlášky č. 146/2024 Sb. (ve znění vyhlášky č. 97/2026 Sb.)
| Požadavek | Co to znamená pro pozemek | Zdroj |
|---|---|---|
| Odstup od hranice pozemku nejméně 2 m (kromě hranice s veřejným prostranstvím) | | § 11 odst. 2 |
| Zastínění oken sousedních budov – odstupový úhel 45° | potřeba poloh oken sousedů (zaměření) | příloha č. 4 |
| Parkování – 1 stání na 120 m² podlahové plochy (ÚP může upravit) | | § 7, příloha č. 1 |
| Okna nejméně 1/10 podlahové plochy místnosti | | § 20 odst. 1 |
| Hospodaření se srážkovou vodou | | § 140 odst. 3 písm. c) stavebního zákona, § 5 odst. 3 vodního zákona |
| Připojení na veřejnou komunikaci a sítě | | stavební zákon |

## 3. Limity a ochrana území
| Vrstva | Zjištění | Zdroj a datum | Úroveň | Dopad na návrh | Další krok |
|---|---|---|---|---|---|
| Ochranná pásma sítí a komunikací | | technická mapa (DTM), ÚAP | úřední / orientační | | vyjádření správců |
| Dráha, letiště, zájmy MO (např. radioreléové trasy) | | ÚAP, ÚCL | úřední | | stanovisko MO |
| Les do 30 m od okraje | | katastr, ZABAGED | úřední | | závazné stanovisko lesů |
| Ochrana přírody (MZCHÚ a pásmo 50 m, CHKO a zóny, Natura 2000, památné stromy, VKP, ÚSES) | | AOPK ČR, ÚP, ORP | úřední | | stanovisko orgánu ochrany přírody |
| Památková ochrana (památka, rezervace, zóna, ochranné pásmo) | | NPÚ | úřední | | závazné stanovisko ORP |
| Archeologie (ÚAN I–IV) | | NPÚ | úřední | | oznámení přes AMČR (mimo ÚAN IV) |
| Záplavové území a aktivní zóna (Q100), mapy povodňového nebezpečí | | DIBAVOD / POVIS | úřední | | vodoprávní úřad |
| Ochranná pásma vodních zdrojů, CHOPAV | | ÚAP, VÚV | úřední | | |
| Sesuvy, poddolování, chráněná ložisková území | | ČGS | orientační | | inženýrskogeologický průzkum |
| Hluk (strategické hlukové mapy) | | MZd | orientační | | prázdný výsledek neznamená ticho |
| Kontaminace (SEKM), brownfield | | SEKM | orientační | | |

## 4. Sítě a přístup
| Údaj | Zjištění | Zdroj a datum | Úroveň | Další krok |
|---|---|---|---|---|
| Správci sítí v území | | Portál DMVS (R49 / SEMAFOR) | úřední | žádosti o vyjádření |
| Poloha sítí (voda, kanalizace, elektro, plyn, komunikace) | | DTM – veřejná mapa | orientační | vyjádření s podmínkami napojení |
| Přístup na veřejnou komunikaci | | katastr (sousední parcely, druh), LV | orientační | ověřit právní kategorii cesty, služebnost |

## 5. Terén a podloží
| Údaj | Zjištění | Zdroj a datum | Úroveň | Další krok |
|---|---|---|---|---|
| Sklon a převýšení pozemku | | DMR 5G (±0,18 m v otevřeném terénu) | orientační | zaměření geodetem |
| Geologie, vrty v okolí | | ČGS (mapa 1 : 50 000, Geofond) | orientační | inženýrskogeologický průzkum |
| Radon | | mapa ČGS (jen orientačně) | orientační | radonový průzkum – povinný (§ 98 odst. 1 atomového zákona) |
| Vsakování srážkové vody | | regionální mapy, vrty | orientační | hydrogeologický posudek |
| Zemědělský půdní fond, třída ochrany | | katastr, BPEJ | úřední | souhlas s odnětím, odvod |

## 6. Shrnutí
| Oblast | Stav | Proč |
|---|---|---|
| Územní plán | zelená / oranžová / červená | |
| Limity a ochrana | | |
| Sítě a přístup | | |
| Terén a podloží | | |

Tři hlavní rizika a doporučení: …

## 7. Co objednat a zajistit
| Co | Proč | Orientační cena a lhůta (ověř) |
|---|---|---|
| Polohopisné a výškopisné zaměření | podklad pro návrh a koordinační situaci | řádově tisíce Kč, podle velikosti pozemku |
| Vytyčení hranic | jistota odstupů od hranice | řádově tisíce Kč na 100 m hranice |
| Radonový průzkum | povinný pro novou stavbu s obytnými místnostmi | zhruba 3–6 tis. Kč |
| Inženýrskogeologický průzkum | založení stavby | kolem 15 tis. Kč, 2–4 týdny |
| Hydrogeologický posudek | vsakování srážkových vod | kolem 6,5 tis. Kč bez DPH |
| Dendrologický průzkum | kácení dřevin | podle počtu stromů |
| Předběžná informace stavebního úřadu | potvrzení výkladu regulativů | 1 000 Kč, do 30 dnů |
| Vyjádření správců sítí | podmínky napojení a ochranná pásma | často zdarma, platnost omezená |

## 8. Zdroje
Seznam všech použitých zdrojů s datem (portál, dokument, verze).
