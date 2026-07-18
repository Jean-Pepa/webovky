# 3D tisk domů — hloubkový research (červenec 2026)

> Zpracováno jako podklad pro rozhodnutí „chci do toho vstoupit s novým typem stroje/přístupu".
> Zdroje jsou odkazované průběžně a shrnuté na konci. Čísla od výrobců ber jako marketing — kde to jde, uvádím i nezávislý pohled.

---

## 1. Shrnutí (TL;DR)

- **Technologie je reálná a funguje** — po světě stojí tisíce vytištěných budov, včetně 100domové čtvrti v Texasu (ICON × Lennar) a 30m věže ve Švýcarsku (Tor Alva). Ale tiskne se prakticky **jen svislá hrubá stavba (stěny)**, což je ~20–30 % ceny domu. Střechy, stropy, instalace, izolace a povrchy se dělají postaru.
- **Reálná úspora celkové ceny domu je dnes 10–30 %**, ne „dům za polovinu", jak zní marketing. Hlavní úspora je práce (až ‑70 % lidí na hrubé stavbě) a rychlost (dny místo týdnů na obálku).
- **Trh roste, ale prochází bolestivou konsolidací**: lídr ICON v březnu 2025 propustil přes 25 % lidí, Mighty Buildings (UV kompozit) šla začátkem 2025 do prodeje. Vydělávají spíš ti, kdo tisknou **infrastrukturu a malé účelové stavby** (obrubníky, šachty, zastávky, bunkry, myčky) než rodinné domy.
- **Česko je překvapivě silné**: ICE Industrial Services (Žďár n. S.) má vlastní patentovanou technologii tisku z běžného transportbetonu a jednu z 10 největších tiskových farem světa; skupina Purposia/Coral chystá v Ostravě první tištěné řadové domy (Rezidence Meandry, ~2027); Scoolpt vytiskl Prvok už 2020; běží akademický projekt 3D STAR (ČVUT + TUL).
- **Největší nevyřešené problémy = příležitosti pro nový stroj**: (1) automatická integrace výztuže, (2) tisk stropů/střech, (3) izolace v jednom průjezdu, (4) levný a rychle postavitelný stroj s velkou obálkou (kabelové systémy jsou bílé místo), (5) QA/certifikační data pro normy (ISO/ASTM 52939), (6) materiál = běžný beton z betonárky, ne drahé suché směsi.
- **Vstupní náklady na stroj**: od ~35 000 USD (MudBots, hobby/malé prvky) přes ~130 000 € (Crane WASP), ~205 000 USD (CyBe robot), až ~385 000 €+ (COBOD BOD2, standard trhu). Existuje už i sekundární trh s ojetými tiskárnami.

---

## 2. Jak to celé funguje

### 2.1 Princip

3D tisk staveb (3DCP — 3D Construction Printing) je v drtivé většině **extruze cementové směsi vrstvu po vrstvě** ([přehled AMFG](https://amfg.ai/2025/05/23/additive-construction-2025-how-and-why-companies-are-3d-printing-buildings/), [Wikipedia](https://en.wikipedia.org/wiki/Construction_3D_printing)):

1. **Návrh** — běžný CAD/BIM model se „naslicuje" na dráhy trysky (obdoba slicování u malých tiskáren).
2. **Míchání a čerpání** — směs se míchá (ze suché pytlované směsi, nebo z běžného betonu) a čerpadlem žene hadicí do tiskové hlavy.
3. **Tisková hlava** — klíčová komponenta. U moderních systémů se **přímo v hlavě dávkuje urychlovač tuhnutí** (akcelerátor), aby směs vytekla tvarovatelná, ale během sekund/minut unesla další vrstvu. Přesně na tom stojí patent českého ICE i systém D.fab od COBOD/Cemex.
4. **Tisk** — stroj jezdí po dráze a klade „housenky" typicky 12–50 mm vysoké. Stěny se tisknou jako dvě skořepiny se spojkami (dutina na izolaci a instalace).
5. **Dokončení** — do dutin se vkládá výztuž a zálivka, vedou instalace, fouká izolace; stropy, střecha, okna, povrchy konvenčně.

### 2.2 Typy strojů (tohle je pro tebe klíčová kapitola)

| Typ | Jak funguje | Zástupci | Silné stránky | Slabiny |
|---|---|---|---|---|
| **Portál (gantry)** | rám X/Y/Z nad celou stavbou, jako obří CNC | COBOD BOD2, ICON Vulcan, Total Kustom, BetAbram | velké stavby, přesnost, rychlost, tisk „přes celý půdorys" | doprava a montáž rámu (dny), omezení výškou rámu, kotvení |
| **Robotické rameno** | 6osý průmyslový robot (často KUKA/ABB) na podstavci či pásech | CyBe RC 3Dp, Apis Cor, ICE Coral, 3D STAR (ČVUT/TUL) | mobilita, složité geometrie, rychlé nasazení | menší dosah — na dům se musí přeskládávat, dražší řízení |
| **Jeřábový/modulární (crane)** | lehká příhradová věž s rameny, moduly lze spojovat | Crane WASP | levný, lehký, škálovatelný do „roje" více tiskáren | menší tuhost, pomalejší |
| **Kabelový (cable-driven)** | tisková hlava zavěšená na lanech mezi stožáry | zatím jen výzkum ([Springer](https://link.springer.com/article/10.1007/s41693-022-00082-3), [ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S2214860415000263)) | obrovská obálka, minimální hmotnost a cena konstrukce | řízení kmitání, přesnost — **komerčně neobsazené** |
| **Stříkání (shotcrete/RSP)** | robot nastřikuje beton na předem svázaný armokoš | Aeditive (KUKA, [popis](https://www.robotic-hitechsolutions.com/the-new-era-of-construction-kuka-and-aeditive-and-their-revolution-with-robotics-and-3d-technology/)) | **plně vyztužené prvky** = nosné konstrukce dle norem | zatím hlavně prefa výroba v hale |
| **Prefa tisk v hale + montáž** | díly se vytisknou v továrně a svezou na stavbu | Serendix (JP), Winsun (CN), Tor Alva (ETH), Mighty Buildings | kontrolované prostředí, počasí nevadí, kvalita | doprava dílů, jeřáb, spoje |
| **Exotika** | roje dronů (Aerial-AM, [Imperial/Empa](https://www.sciencedaily.com/releases/2022/09/220922103202.htm)), „impact printing" hlíny (ETH), tisk pěn ([geopolymerní pěna](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10880652/)) | výzkum | inspirace pro nové přístupy | roky od komerce |

Dobré srovnání portál vs. rameno: [Vertico wiki](https://www.vertico.com/wiki/robotic-arms-vs-gantry-systems-3d-concrete-printing), [COBOD](https://cobod.com/robotic-arm-vs-gantry-3d-concrete-printer/), akademicky [MDPI review](https://www.mdpi.com/2075-5309/12/11/2023).

### 2.3 Materiály — kde se láme ekonomika

- **Suché pytlované směsi** (Sika, Baumit, „inkousty" výrobců): spolehlivé, certifikovanější, ale **700–900 €/m³** — 5–10× dražší než beton z betonárky ([VoxelMatters o D.fab](https://www.voxelmatters.com/d-fab-promises-90-cost-reduction-in-concrete-3d-printing-materials/)).
- **Běžný transportbeton + admixtury dávkované v hlavě**: COBOD × Cemex **D.fab** srazil materiál na **60–90 €/m³** (−90 %), centrálně se dodává <1 % objemu směsi ([COBOD](https://cobod.com/the-concrete-revolution/)). Stejnou cestou jde česká **ICE** — patentovaná hlava s akcelerací umí tisknout z běžného betonu: písek 0–4 mm, libovolný cement CEM I–III, kavitační čerpadlo do zrna 8 mm ([ICE](https://www.ice.cz/cs/stavebnictvi/ICE-CORAL-mobilni-3D-tiskarna-betonu)). **Pro nového hráče je tohle povinnost — na drahých směsích byznys nepostavíš.**
- **Nízkouhlíkové a alternativní směsi**: ICON CarbonX; hlína/země — WASP **TECLA**: dům z místní zeminy, 60 m², 200 h tisku, 350 vrstev po 12 mm, spotřeba tisku jen 6 kWh ([WASP](https://www.3dwasp.com/en/3d-printed-house-tecla/), [Wikipedia](https://en.wikipedia.org/wiki/Tecla_house)); ETH „impact printing" z hlíny s minimem pojiv ([3DPI](https://3dprintingindustry.com/news/is-eth-zurichs-unique-impact-printing-construction-method-a-sustainable-alternative-to-3d-printing-234021/)); geopolymerní pěny na izolační prvky.
- **UV kompozit** — Mighty Buildings (Light Stone Material tvrzený UV světlem, [popis](https://uvebtech.com/articles/2022/mighty-buildings-3d-printed-sustainable-homes/)) — technologicky zajímavé, komerčně to firmu nezachránilo (viz kap. 5).

### 2.4 Výztuž — technicky nejtěžší problém oboru

Extrudovaný beton má slabé spoje vrstev a bez výztuže neunese tah — proto se dnes většinou tisknou jen nízkopodlažní stavby a výztuž se vkládá ručně (svislé pruty do dutin + zálivka, vodorovně spony/vlákna). Přehled metod: [review MDPI/PMC](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11766683/). Špičkové přístupy:

- **Mesh Mould (ETH Zürich)** — robot ohýbá a svařuje síť z prutů do 12 mm, která je zároveň bednění i výztuž; Swiss Technology Award ([ETH](https://kaufmann.ibk.ethz.ch/research/selected-research-projects/mesh-mould-prefabrication.html)).
- **„Rostoucí výztuž" na Tor Alva** — do vrstev se průběžně vkládají prstence a svislé pruty, vyvinuto ETH + spin-off Mesh; díky tomu jsou tištěné sloupy **nosné bez bednění** ([ETH news](https://ethz.ch/en/news-and-events/eth-news/news/2025/05/from-confectioners-to-robots-tor-alva-in-mulegns-is-unveiled.html)).
- **Aeditive RSP** — nastřikování na hotový armokoš → prvek splní normy jako klasický železobeton.

### 2.5 Co se dnes NEtiskne

Stropy, střechy, základy (většinou), schodiště, instalace, okna/dveře, povrchy, izolace. Výjimky: ICON **Phoenix** (představen 2024) cílí na vícepodlažní tisk včetně systému pro střechy/základy ([Dezeen](https://www.dezeen.com/2024/03/12/icon-phoenix-3d-printer-multi-story-structures/)); ETH tiskla stropní desku Smart Slab přes tištěné bednění. Jinak platí: **tiskne se obálka, zbytek je klasická stavařina.**

---

## 3. Firmy a jejich systémy

### 3.1 Globální lídři

**COBOD (Dánsko)** — de facto standard trhu, prodává tiskárny (neprovádí stavby).
- Modulární portál **BOD2**: pojezd až ~1 000 mm/s, 1 m² dvojité stěny za ~5 min, konfigurace až ~15 m šířka × 50 m délka × 8 m výška, cena **od ~385 000 €** (plus čerpadla, doprava, školení — reálně ~0,5–1 M€); od objednávky k samostatnému provozu ~5 měsíců; obsluha 3–4 lidi ([specifikace](https://cobod.com/solution/bod2/specifications/), [Aniwaa](https://www.aniwaa.com/product/3d-printers/cobod-bod2/)).
- Partneři: **PERI** (podíl od 2018), **Cemex** (D.fab), GE (věže větrníků), zákazníci v 50+ zemích. Větší model **BODXL**.
- Byznys model: prodej strojů + materiálová admixtura + školení/servis (COBOD Connect/Care).

**ICON (USA, Austin)** — vertikálně integrovaný stavitel, stroje neprodává.
- Portál **Vulcan** → čtvrť **Wolf Ranch** (Georgetown, TX): 100 přízemních domů s Lennarem, návrh BIG; prodejní ceny 450–600 k$, později od ~475 k$ ([New Atlas](https://newatlas.com/architecture/wolf-ranch-icon-texas-nears-completion/), [ICON](https://www.iconbuild.com/newsroom/icon-and-lennar-announce-community-of-3d-printed-homes-is-now-underway-in-georgetown-tx)).
- Nová generace **Phoenix** (vícepodlažní) + nízkouhlíkový materiál **CarbonX** + architektonická AI Vitruvius ([Designboom](https://www.designboom.com/architecture/icon-3d-printed-architecture-phoenix-vitruvius-codex-carbonx-03-12-2024/)).
- Soutěž **Initiative 99** (dům do 99 k$). Vojenské zakázky, vývoj pro NASA.
- **Pozor:** v únoru 2025 sice získal 56 M$ (celkem >500 M$), ale v březnu 2025 **propustil 114 lidí (~25 %+)** a přeostřil na Phoenix ([3DPrint.com](https://3dprint.com/316367/icon-secures-56m-amid-construction-3d-printing-sectors-growing-pains/), [CREtech](https://www.cretech.com/news/3d-printing-startup-icon-lays-off-114-employees-amid-strategic-restructuring/)).

**PERI 3D Construction (Německo)** — největší evropský „tiskový dodavatel staveb" (na strojích COBOD). První německý tištěný dům **Beckum** (2020–21, 2×80 m²) — povolen individuálně ve spolupráci s ministerstvem NRW, zkoušky TU Mnichov, dotace programu „Innovatives Bauen" ([PERI](https://www.peri3dconstruction.com/en/einfamilienhaus-in-beckum)); první tištěný bytový dům světa (Wallenhausen, 5 bytů) ([3DPI](https://3dprintingindustry.com/news/peri-uses-cobod-printer-to-build-worlds-first-on-site-3d-printed-apartment-building-179376/)).

**CyBe Construction (Nizozemsko)** — mobilní pásový robot **RC 3Dp**: obálka ~⌀5 × 4,5 m, tisk až 500 mm/s, **od ~205 000 $** — nejrozšířenější „levnější mobilní" řešení ([Aniwaa guide](https://www.aniwaa.com/buyers-guide/3d-printers/house-3d-printer-construction/)).

**WASP (Itálie)** — modulární **Crane WASP** od ~132 000 €, více jednotek umí tisknout synchronně; unikátní práce s hlínou (TECLA) ([3DPI](https://3dprintingindustry.com/news/wasp-and-mca-pave-way-for-3d-printed-sustainable-global-habitats-with-completed-tecla-eco-house-188961/)).

**Apis Cor (USA/FL)** — kompaktní rameno „Frank", tiskne dům <200 m²; postavila největší tištěnou budovu světa (úřad v Dubaji, ~640 m²); ceny neveřejné ([Aniwaa](https://www.aniwaa.com/product/3d-printers/apis-cor-3d-printer/)).

**Black Buffalo 3D (USA)** — portál NEXCON; **první, kdo prošel ICC-ES AC509** (certifikace tiskárny i „inkoustu") — ukazuje, že certifikace je konkurenční zbraň ([Applied Testing o AC509](https://www.appliedtesting.com/standards/icc-es-ac509-3d-automated-construction-technology-for-3d-concrete-walls)).

**SQ4D (USA)** — systém ARCS, lokální materiály, patentovaná tryska; proslavili se prvním tištěným domem v realitní inzerci v USA.

**Alquist 3D (USA, Greeley CO)** — nejzajímavější byznys pivot: od domů k **infrastruktuře a licencování**. Mobilní tiskárna = KUKA robot na přívěsu (s RIC Technologies); tisknou obrubníky, květníky, opěrné zdi, prvky pro **Walmart**; s Aims Community College vytvořili výukový kurz 3DCP (30 h, 250 $) a školí pracovní sílu ([Additive Manufacturing](https://www.additivemanufacturing.media/articles/alquist-3d-looks-toward-a-carbon-sequestering-future-with-3d-printed-infrastructure-), [Denver Gazette 2026](https://www.denvergazette.com/2026/02/14/greeley-based-alquist-emerges-as-leading-3d-construction-printing-company/), [Hoodline 2026](https://hoodline.com/2026/02/greeley-3d-printing-upstart-snags-walmart-building-spree/)).

**Aeditive (Německo)** — robotické stříkání betonu (RSP) na armokoše, prefa díly plně dle norem ([3Dnatives](https://www.3dnatives.com/en/aeditive-startup-of-month-101120204/)).

**Serendix (Japonsko)** — radikální low-cost prefa: kulový domek **Sphere** (10 m²) vytištěn a smontován **za <24 h, cena <3 M ¥ (~25 500 $)**; větší **Fujitsubo** (~50 m²) za 44,5 h — stěny tištěné po dílech, střecha CNC panely, splňuje japonské seismické normy ([3DPI](https://3dprintingindustry.com/news/serendix-partners-3d-prints-spherical-home-in-affordable-futuristic-living-first-206112/), [Singularity Hub](https://singularityhub.com/2023/08/24/this-3d-printed-house-goes-up-in-2-days-and-costs-the-same-as-a-car/)).

**Levný segment strojů**: MudBots od **~35–38 k$**; Total Kustom StroyBot 6.2 od ~300 k$ (portál 10×20×6 m); slovinský BetAbram (portál 16 m, cena neveřejná) ([PrintableConcrete srovnání](https://www.printableconcrete.com/best-3d-concrete-printers-reviewed/), [MudBots](https://www.mudbots.com/concrete-3d-printers.php)). Existuje i **bazar** — např. [Automate Construction](https://automateconstruction.com/pre-owned-printer/) prodává ojeté BOD2.

**Výzkumné majáky**: **Tor Alva** (Mulegns, CH) — nejvyšší tištěná stavba světa, ~30 m, 32 nosných tištěných sloupů, otevřena 20. 5. 2025; tisk 5 měsíců v hale ETH, montáž z dílů ([ETH](https://ethz.ch/en/news-and-events/eth-news/news/2025/05/from-confectioners-to-robots-tor-alva-in-mulegns-is-unveiled.html), [Dezeen](https://www.dezeen.com/2025/05/21/worlds-tallest-3d-printed-tower-tor-alva/)); drony Aerial-AM (Imperial/Empa); kabelové roboty (viz 2.2).

### 3.2 Česko a Slovensko (tvůj domácí trh)

| Kdo | Co dělá | Detaily |
|---|---|---|
| **ICE Industrial Services** (Žďár n. S.) | vlastní patentovaná technologie + tisková farma + služby | Mobilní pásová tiskárna **ICE Coral** (diesel/elektro podvozek), patentovaná hlava s dávkováním akcelerátoru → **tiskne z běžného transportbetonu** (písek 0–4 mm, CEM I–III, čerpadlo do zrna 8 mm). Tvrdí ~5× rychlejší hrubou stavbu a až 70 % úspory materiálu vs. lití do bednění. Největší tisková farma v ČR (top 10 světově). Tiskli **bunkry pro Ukrajinu i AČR**, s **Skanskou** první tisk přímo na stavbě bytového domu v ČR (Modřanský cukrovar — místnost za 2 h na terase 4. NP). Plán: tištěná škola „Na Radosti" ve Žďáru. ([ICE](https://www.ice.cz/cs/stavebnictvi/ICE-CORAL-mobilni-3D-tiskarna-betonu), [BusinessInfo](https://www.businessinfo.cz/clanky/3d-tisk-budoucnosti-stavebnictvi-ice-coral-tiskne-i-bunkry-pro-ukrajinu/), [Skanska](https://www.skanska.cz/kdo-jsme/media/archiv-tiskovych-zprav/274214/3D-tisk-z-betonu-poprve-na-stavbe-bytoveho-domu-v-CR,-robot-vytiskl-mistnost-za-dve-hodiny), [ASB](https://www.asb-portal.cz/stavebnictvi/prulomova-technologie-z-ceska-coral-meni-pravidla-hry-ve-stavebnictvi-diky-3d-tisku-betonu)) |
| **Coral Construction Technologies + Antracit (Purposia Group)** | developer + technologie | **Rezidence Meandry Výškovice, Ostrava** — první tištěné řadové domy v ČR, dokončení ~**2027**, stavba ~1 rok místo 2. Spojení se skupinou **MTX** — ambice expandovat do světa. ([Patriot](https://www.patriotmagazin.cz/ostrava-bude-mit-novou-rezidenci-vytvori-ji-prvni-radove-domy-z-3d-tisku), [e15](https://www.e15.cz/byznys/v-cesku-vzniknou-prvni-radove-domy-vytvorene-pomoci-3d-tisku-stoji-za-nimi-ostravska-purposia-1430004), [iMaterialy](https://imaterialy.cz/rubriky/aktuality/spojeni-purposia-a-mtx-unikatni-3d-tisk-betonu-miri-z-ceska-do-sveta/)) |
| **Scoolpt** (Michal Trpák, Č. Budějovice) | ateliér, průkopník | **Prvok** (2020) — první český tištěný dům (43 m², tisk 22 h, ~17 t betonu), s Buřinkou (Stavební spořitelna ČS). Stavební povolení chytře obešli: dům je plovoucí → řešili to se **Státní plavební správou**, ne stavebním úřadem. ([Scoolpt](https://www.scoolpt.com/prvok/), [CzechCrunch](https://cc.cz/cesko-vstupuje-do-nove-ery-stavebnictvi-revoluci-zazehava-3d-tisk-a-vubec-prvni-dum-z-tiskarny-zvany-prvok/), [Peak](https://www.peak.cz/ceska-revoluce-ve-stavebnictvi-17-tun-betonu-22-hodin-3d-tisku-a-novy-typ-domu-je-na-svete/23923/)) |
| **3D STAR** (TU Liberec + Kloknerův ústav ČVUT + Červenka Consulting) | výzkum | Mobilní robotické rameno pro tisk **vícepodlažních budov přímo na místě** + vývoj cementových kompozitů; výzkum na KÚ běží od 2016. Ideální partner pro certifikaci nového stroje. ([ČKAIT](https://www.ckait.cz/technicky-ctvrtek-experimentalni-vyvoj-3d-tisku-v-ramci-projektu-3d-star), [EARCH](https://www.earch.cz/technologie/clanek/vytiskni-a-bydli-odbornici-z-cvut-a-tul-posouvaji-moznosti-3d-tisku-budov-1), [Kloknerův ústav](https://klok.cvut.cz/en/3d-printing-in-construction/)) |
| **Weber (Saint-Gobain)** | materiály + centrum | Centrum 3D tisku v Praze — bungalovy, mostní prvky, zastávky ([Pražský deník](https://prazsky.denik.cz/zpravy_region/praha-stavba-3d-tiskarna-weber.html)) |
| **Ostatní** | | Print4D (arch. Luai Kurdi); SK: **3D-C PRO** prefa domky od 2020; **HSF System** — první tištěná automyčka na Slovensku (Žilina) ([Stavitel](https://stavitel.cz/infoservis/stavebni-skupina-hsf-system-postavila-prvni-3d-tistenou-automycku-na-slovensku/)); Baumit **BauMinator** (AT) v regionu ([Ebeton přehled](https://www.ebeton.cz/clanky/2022_1_4_3d-tisk-z-betonu-ve-stavebnim-prumyslu/)) |

---

## 4. Ekonomika — čísla, se kterými počítat

**Stroj (CAPEX):**
- MudBots: 35–60 k$ (malé, spíš prvky/experimenty)
- Crane WASP: od 132 k€
- CyBe RC 3Dp: od 205 k$
- StroyBot: 300–950 k$
- COBOD BOD2: od 385 k€ (kompletní provozuschopná sestava reálně víc; ojetá k mání)

**Materiál:** suché směsi 700–900 €/m³ vs. **běžný beton s admixturou 60–90 €/m³** (D.fab / přístup ICE). Na domu se stěnami ~25–40 m³ je to rozdíl řádově **20 000–30 000 €** — proto lokální beton rozhoduje o konkurenceschopnosti.

**Cena domu:** tisk skořepiny v USA ~100–150 $/sqft s úsporou 20–30 % na stěnách; **stěny jsou ale jen ~20 % ceny domu → celková úspora 10–30 %**. Kompletní dům 1 500 sqft (~140 m²) vychází 140–180 k$. Hrubá stavba potřebuje ~70 % méně práce a je hotová za dny. ([Under the Hard Hat](https://underthehardhat.org/cost-of-3d-printing-a-house/), [build-news](https://www.build-news.com/uncategorized/3d-printed-houses-real-construction-costs-revealed-in-2024/), [Constructions-3D blog](https://www.constructions-3d.com/en/blog/how-much-does-a-3-d-printed-house-cost))

**Pozor na marketing:** domy z Wolf Ranch se prodávají za 450–600 k$ — tisk sám o sobě z domu „levné bydlení" nedělá; rozhoduje pozemek, sítě, dokončovací práce.

**Provoz:** posádka tiskárny 3–4 lidi; limitem bývá počasí (teplota, vítr, déšť u tisku venku), logistika betonu a čištění systému.

---

## 5. Trh 2024–2026: růst + konsolidace zároveň

- **Velikost trhu**: odhady se řádově rozcházejí (agentury uvádějí 1–2,5 mld. $ v 2025 a CAGR 60–98 %; [Grand View](https://www.grandviewresearch.com/industry-analysis/3d-printing-constructions-market): 1,58 mld. $ 2024 → 54,6 mld. $ 2030; extrémní projekce Precedence ~1,8 bil. $ 2035 ber s velkou rezervou). Realita: celosvětově jde zatím o **tisíce vytištěných staveb** — trh je malý, ale zdvojnásobuje se.
- **Regionálně**: Severní Amerika ~46 % (2024), rychlý růst Asie (Čína), Blízký východ tlačí regulací — **Dubaj: dekret 24/2021 a cíl 25 % nových budov tiskem do 2030** ([u.ae](https://u.ae/en/about-the-uae/strategies-initiatives-and-awards/strategies-plans-and-visions/industry-science-and-technology/dubai-3d-printing-strategy)).
- **Konsolidace (důležitý signál)**: ICON −25 % zaměstnanců (03/2025) navzdory čerstvým 56 M$; **Mighty Buildings na prodej** (01–02/2025, prodej řídí Rock Creek Advisors) ([3DPI](https://3dprintingindustry.com/news/mighty-buildings-up-for-sale-following-headcount-reduction-235813/)). Poučení: **prodávat „levné domy" je těžké; vydělává prodej strojů (COBOD), služby, infrastruktura a nika s rychlým cash-flow (Alquist, ICE bunkry).**
- **Kde se reálně točí peníze teď**: prvky infrastruktury (obrubníky, šachty, opěrky, mobiliář), účelové stavby (myčky, zastávky, trafostanice), vojenské aplikace (bunkry, kasárna), prefa díly pro developery, výukové/výzkumné instalace.

---

## 6. Regulace a certifikace

**Mezinárodní normy (nové, konečně existují):**
- **ISO/ASTM 52939:2023** — kvalifikační principy pro aditivní výstavbu (nosné i nenosné prvky): řízení procesu, ověřování materiálu, dokumentace ([ISO](https://www.iso.org/standard/81177.html), [3DPI](https://3dprintingindustry.com/news/iso-astm-529392023-published-a-new-standard-for-construction-3d-printing-226929/)).
- **ICC-ES AC509** (USA) — akceptační kritéria pro tištěné betonové stěny (materiál, statika, proces, požár) — první certifikát drží Black Buffalo; **UL 3401** — hodnocení tištěných budov. ([Applied Testing AC509](https://www.appliedtesting.com/standards/icc-es-ac509-3d-automated-construction-technology-for-3d-concrete-walls), [UL 3401](https://www.appliedtesting.com/standards/ul-3401-3d-printed-building-construction))
- Bezpečnost robotů na stavbě: ISO 10218 + ISO/TS 15066 ([přehled](https://sixdegreesofrobotics.substack.com/p/robots-are-printing-buildings-the)).

**EU/Německo:** harmonizovaná evropská norma pro tištěné konstrukce zatím **neexistuje** — stavby se povolují **individuálně** (Beckum: souhlas ministerstva NRW + zkoušky TU Mnichov). Eurokódy tištěný beton neřeší; kdo si nechá systém posoudit „an sich" (typové posouzení/ETA), získá obrovskou výhodu.

**ČR:** individuální posuzování stavebním úřadem; přesně proto Prvok „utekl" pod Státní plavební správu a Skanska tiskla nenosnou místnost. Cesta pro nového hráče: **zkoušky s Kloknerovým ústavem/TZÚS, statika přes uznávané kanceláře (Červenka Consulting dělá v 3D STAR), první realizace jako nenosné/účelové stavby** → reference → nosné systémy.

---

## 7. Slabiny dnešních systémů = mapa příležitostí

Seřazeno podle toho, jak moc to obor bolí (a jak málo hráčů to řeší):

1. **Výztuž integrovaná do tisku** — svatý grál. Dnes: ruční vkládání. Řeší jen ETH (Mesh Mould, „rostoucí výztuž" na Tor Alva) a Aeditive (sprej na armokoš). Kdo vymyslí spolehlivé **inline kladení drátu/lanka/mřížky mezi vrstvy** (nebo tisk kolem předem nataženého lanového předpětí), otevře vícepodlažní nosné stavby podle norem.
2. **Stropy a střechy** — tiskne se jen obálka. Příležitost: tištěné **ztracené bednění** stropů, žebrové desky, případně hybridní stroj co tiskne stěny **a osazuje prefa stropní dílce** (jeden stroj = celá hrubá stavba).
3. **Izolace v jednom průjezdu** — dnes dvojitá stěna + ruční foukání. Příležitost: **ko-extruze izolační pěny** (pěnobeton, geopolymerní pěna, minerální pěna) druhou tryskou současně se stěnou → hotová zateplená stěna. Výzkum existuje ([geopolymer foam printing](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10880652/)), komerčně nikdo.
4. **Vodotěsnost a spoje vrstev** („cold joints", zatékání, smršťovací trhliny — častá reklamační bolest, viz [Engineering Uncle](https://www.engineeringuncle.com/3d-printing-houses-pros-cons-leakage-problems-future-engineering-guide/)): inline hlazení/hutnění vrstvy, řízené vlhčení, monitoring. CyBe má základní hlazení, prostor pro lepší řešení.
5. **Levný stroj s velkou obálkou a rychlým postavením** — portály se montují dny a vozí kamiony. **Kabelové (cable-driven) tiskárny jsou komerčně neobsazené bílé místo**: lehké stožáry + lana = obálka přes celý pozemek za zlomek hmotnosti a ceny portálu. Rizika (kmitání, přesnost) jsou řešitelná moderním řízením — akademické prototypy fungují.
6. **QA / certifikační „černá skříňka"** — ISO/ASTM 52939 vyžaduje dokumentaci procesu. Modul (senzory průtoku, teploty, vlhkosti, kamera vrstvy + automatický protokol) prodejný **všem** výrobcům/provozovatelům je málo sexy, ale výborný B2B byznys s okamžitou poptávkou.
7. **Multifunkční hlava (tool-changer)** — tisk, hlazení, frézování drážek pro instalace, nástřik izolace/omítky jedním strojem. Směr, kam ukazují ICON Phoenix i další, ale hotové to nemá nikdo.
8. **Materiálová nezávislost** — stroj postavený od začátku na běžném transportbetonu s dávkováním akcelerátoru v hlavě (jako ICE/D.fab), ne na vlastní drahé směsi.

---

## 8. Doporučení: jak do toho vstoupit

**A. Nejrychlejší cesta k tržbám (nízké riziko):** mobilní tisková jednotka (robot na pásech/přívěsu) + běžný beton → **prvky infrastruktury a účelové stavby pro obce a firmy** (opěrné zdi, šachty, mobiliář, zastávky, myčky, trafostanice, protihlukové prvky). Rychlá certifikace (často nenosné/výrobkové posouzení), krátký prodejní cyklus, žádný boj o stavební povolení domů. Přesně tam pivotoval Alquist a vydělává tam i ICE (bunkry). Služby > prodej strojů na začátku.

**B. Střední hra (diferenciace strojem):** vyvinout **jeden** z bodů 1/3/5 z kapitoly 7 — nejsilnější kombinace pro nový stroj podle tohoto researche:
> **kabelový tiskový systém s velkou obálkou + hlava na běžný beton + ko-extruze izolační pěny + QA modul dle ISO/ASTM 52939.**
Nikdo na trhu tuhle kombinaci nemá; každá její část má samostatnou hodnotu (dá se licencovat zvlášť).

**C. Dlouhá hra (nejvyšší bariéra i odměna):** automatizovaná výztuž → typové posouzení nosného systému v EU → vícepodlažní bytovky. Partneři: Kloknerův ústav / TUL (3D STAR), statika Červenka Consulting, materiálovka Weber/Master Builders. Tohle je cesta k „českému COBODu", ale na roky a s investorem (vývoj BOD2-třídy stroje = jednotky až desítky M Kč, plus zkoušky).

**Čeho se vyvarovat (poučení z trhu):**
- Neprodávat sen „levného domu" koncovým zákazníkům — na tom vykrvácely Mighty Buildings i část ICONu.
- Nestavět na proprietární drahé suché směsi.
- Nepodcenit, že tisk je ~20 % stavby — partner se stavební firmou (model ICE×Skanska, PERI×COBOD) je nutnost.
- Počítat s individuálním povolováním staveb v ČR/EU — certifikační strategie je součást produktu, ne dodatek.

---

## 9. Hlavní zdroje

**Technologie:** [AMFG — Additive Construction 2025](https://amfg.ai/2025/05/23/additive-construction-2025-how-and-why-companies-are-3d-printing-buildings/) · [MDPI review gantry vs. arm](https://www.mdpi.com/2075-5309/12/11/2023) · [Vertico wiki](https://www.vertico.com/wiki/robotic-arms-vs-gantry-systems-3d-concrete-printing) · [Wikipedia — Construction 3D printing](https://en.wikipedia.org/wiki/Construction_3D_printing) · [Výztuž — přehled metod](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11766683/) · [Kabelové roboty](https://link.springer.com/article/10.1007/s41693-022-00082-3) · [Drony Aerial-AM](https://www.sciencedaily.com/releases/2022/09/220922103202.htm)

**Firmy:** [COBOD BOD2](https://cobod.com/solution/bod2/specifications/) · [Aniwaa BOD2](https://www.aniwaa.com/product/3d-printers/cobod-bod2/) · [D.fab −90 % materiál](https://www.voxelmatters.com/d-fab-promises-90-cost-reduction-in-concrete-3d-printing-materials/) · [ICON × Lennar Wolf Ranch](https://newatlas.com/architecture/wolf-ranch-icon-texas-nears-completion/) · [ICON Phoenix](https://www.dezeen.com/2024/03/12/icon-phoenix-3d-printer-multi-story-structures/) · [ICON restrukturalizace](https://3dprint.com/316367/icon-secures-56m-amid-construction-3d-printing-sectors-growing-pains/) · [PERI Beckum](https://www.peri3dconstruction.com/en/einfamilienhaus-in-beckum) · [WASP TECLA](https://www.3dwasp.com/en/3d-printed-house-tecla/) · [Aeditive](https://www.3dnatives.com/en/aeditive-startup-of-month-101120204/) · [Serendix](https://singularityhub.com/2023/08/24/this-3d-printed-house-goes-up-in-2-days-and-costs-the-same-as-a-car/) · [Mighty Buildings na prodej](https://3dprintingindustry.com/news/mighty-buildings-up-for-sale-following-headcount-reduction-235813/) · [Alquist 3D](https://www.additivemanufacturing.media/articles/alquist-3d-looks-toward-a-carbon-sequestering-future-with-3d-printed-infrastructure-) · [Srovnání cen tiskáren](https://www.printableconcrete.com/best-3d-concrete-printers-reviewed/) · [Bazar tiskáren](https://automateconstruction.com/pre-owned-printer/) · [Tor Alva (ETH)](https://ethz.ch/en/news-and-events/eth-news/news/2025/05/from-confectioners-to-robots-tor-alva-in-mulegns-is-unveiled.html)

**ČR/SK:** [ICE Coral](https://www.ice.cz/cs/stavebnictvi/ICE-CORAL-mobilni-3D-tiskarna-betonu) · [BusinessInfo — ICE](https://www.businessinfo.cz/clanky/3d-tisk-budoucnosti-stavebnictvi-ice-coral-tiskne-i-bunkry-pro-ukrajinu/) · [Skanska × ICE Modřany](https://www.skanska.cz/kdo-jsme/media/archiv-tiskovych-zprav/274214/3D-tisk-z-betonu-poprve-na-stavbe-bytoveho-domu-v-CR,-robot-vytiskl-mistnost-za-dve-hodiny) · [Prvok — Scoolpt](https://www.scoolpt.com/prvok/) · [CzechCrunch — Prvok](https://cc.cz/cesko-vstupuje-do-nove-ery-stavebnictvi-revoluci-zazehava-3d-tisk-a-vubec-prvni-dum-z-tiskarny-zvany-prvok/) · [Meandry Ostrava](https://www.patriotmagazin.cz/ostrava-bude-mit-novou-rezidenci-vytvori-ji-prvni-radove-domy-z-3d-tisku) · [Purposia × MTX](https://imaterialy.cz/rubriky/aktuality/spojeni-purposia-a-mtx-unikatni-3d-tisk-betonu-miri-z-ceska-do-sveta/) · [3D STAR — ČKAIT](https://www.ckait.cz/technicky-ctvrtek-experimentalni-vyvoj-3d-tisku-v-ramci-projektu-3d-star) · [Kloknerův ústav](https://klok.cvut.cz/en/3d-printing-in-construction/) · [Weber Praha](https://prazsky.denik.cz/zpravy_region/praha-stavba-3d-tiskarna-weber.html) · [HSF myčka SK](https://stavitel.cz/infoservis/stavebni-skupina-hsf-system-postavila-prvni-3d-tistenou-automycku-na-slovensku/) · [Ebeton — přehled](https://www.ebeton.cz/clanky/2022_1_4_3d-tisk-z-betonu-ve-stavebnim-prumyslu/)

**Trh a normy:** [Grand View Research](https://www.grandviewresearch.com/industry-analysis/3d-printing-constructions-market) · [MarketsandMarkets](https://www.marketsandmarkets.com/Market-Reports/3d-printing-construction-market-84104178.html) · [ISO/ASTM 52939](https://www.iso.org/standard/81177.html) · [ICC-ES AC509](https://www.appliedtesting.com/standards/icc-es-ac509-3d-automated-construction-technology-for-3d-concrete-walls) · [UL 3401](https://www.appliedtesting.com/standards/ul-3401-3d-printed-building-construction) · [Dubaj 25 % do 2030](https://u.ae/en/about-the-uae/strategies-initiatives-and-awards/strategies-plans-and-visions/industry-science-and-technology/dubai-3d-printing-strategy) · [Ekonomika staveb](https://underthehardhat.org/cost-of-3d-printing-a-house/) · [Slabiny/vady](https://www.engineeringuncle.com/3d-printing-houses-pros-cons-leakage-problems-future-engineering-guide/)
