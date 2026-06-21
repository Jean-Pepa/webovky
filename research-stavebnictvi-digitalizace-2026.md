# Kde jsou ve stavebnictví a architektuře ještě díry na trhu (2026)

**Nedigitalizované mezery napříč životním cyklem stavby — pohled pro založení startupu/produktu.**
Zaměření: globální + EU trh. Datum: červen 2026.

> **Jak číst tento report:** Čísla pocházejí z více zdrojů; tam, kde statistika pochází jen z marketingového blogu dodavatele, je to označeno jako „směrové, ověřit". Nejsilnější (nezávislé) kotvy jsou McKinsey, Eurostat, EK/BPIE, akademické studie, S-1 dokumenty firem a doložené kolapsy startupů.

---

## TL;DR — co si odnést

1. **Teze je reálná, ne hype.** Stavebnictví je podle McKinsey **druhé nejméně digitalizované odvětví** (hned za zemědělstvím). Produktivita rostla **~1 % ročně po dvě dekády** (zbytek ekonomiky ~5×), a kdyby dohnala průměr, hodnota by stoupla o **~1,6 bilionu USD/rok**. Díra je obrovská a doložená.

2. **Kapitál se ale stádově žene do AI a robotiky.** V Q1 2025 šlo **55 % peněz** do AI + robotiky. AI takeoff/estimating, GC project management (Procore/Autodesk/Trimble) a generativní design jsou už **přeplněné**. Tam nelez.

3. **Hřbitov je plný hardwaru.** Katerra (~2 mld USD), Veev (~600 mil USD), Mighty Buildings, ICON — všechno vertikálně integrované modulární/3D-tisk plays. Selhaly na capexu a regulaci, **ne na technologii**. Lehké softwarové/datové/fintech plays přežívají. **Marketplace na komoditní materiál je margin past** (Schüttflix: náklady na materiál ~96 % tržeb, ztráta 18,9 mil € v 2024).

4. **Skutečné bílé díry** jsou tam, kam se inkumbenti strukturálně nehrnou: **subdodavatelé a malí řemeslníci (peníze + workflow)**, **EU compliance pro „dlouhý chvost" budov (EPBD/ESG)**, **AI automatizace nestrukturovaných dokumentů** nad existujícími daty, a **lokalizace pro EU** (jazyk/právo/normy) tam, kde americké platformy nefungují.

---

## Část 1 — Proč to pořád není digitalizované (makro)

Tyto bariéry platí napříč celým řetězcem a vysvětlují, proč díry existují i po 20 letech softwaru:

- **Struktura odvětví:** 99 % stavebních firem v EU jsou SME (většinou mikrofirmy). Projektově (ne recurring) založené tržby, marže generálních dodavatelů ~2–5 %, transientní týmy, silná regulace, averze k riziku kvůli odpovědnosti.
- **Nízké IT výdaje:** historicky **< 1 % tržeb** na IT — třetina toho, co automotive/aerospace.
- **Bariéra č. 1 = lidé, ne technologie:** ~70 % firem nemá technologickou roadmapu; ~70 % respondentů uvádí jako hlavní překážku zaškolení/kompetence; dvě třetiny brzdí nejistá návratnost (často > 24 měsíců).
- **Poslední míle = adopce v terénu:** jen ~54 % polních pracovníků má plný mobilní přístup k systémům. Software, který „krmí reporty pro management, ale dělníkovi nic nevrací", se opouští.
- **Datová ztráta stojí jmění:** FMI/Autodesk — odvětví v 2020 ztratilo **1,84 bil. USD** kvůli špatné správě dat; 14 % předělávek kvůli špatným datům; 80 % firem sbírá finanční data, ale jen 33 % je používá k rozhodování. McKinsey: **80 % projektů přejede rozpočet**, 98 % megaprojektů o > 30 %.

*Zdroje: McKinsey „Reinventing Construction"; FMI Big Data Report; Eurostat; EK single-market construction.*

---

## Část 2 — Mezery po fázích životního cyklu

### A) NÁVRH, PROJEKCE, POVOLOVÁNÍ

| Mezera | Proč není vyřešená | Kdo to zkouší (a proč nestačí) | Pain / konkurence |
|---|---|---|---|
| **Statika pořád běží přes Excel.** Inženýr spočítá v ETABS/SAP/Robot a pak **ručně přepisuje** do firemních VBA tabulek pro posudky. | Tabulky jsou auditovatelné, právně přijaté, kódují interní standardy a odpovědnost. Nikdo nevlastní pipeline „model → orazítkovaný posudek". | SkyCiv, ENERCALC, CivilWeb — jen úzké pluginy, neřeší dominantní analytické nástroje. | Vysoký pain (denně), nízká konkurence |
| **Specifikace se píší ve Wordu**, odtržené od BIM modelu. Změna objektu neaktualizuje specifikaci. | Obsah řídí pomalé normotvorné orgány (MasterFormat, Uniclass), je to právně citlivá próza, ne data. Spec-to-BIM obousměrná synchronizace = nevyřešeno. | NBS Chorus, AIA MasterSpec — pořád dokument-centrické. *(MasterFormat v 2026 přešel na předplatné → naštvaní architekti = uzavřená, podsloužená báze.)* | Vysoký pain, nízká konkurence |
| **MEP koordinace / clash detection** semi-automatická; předělávky 5–15 % nákladů projektu. | Auto-detekce vyhází tisíce nízkohodnotných kolizí; řešení vyžaduje lidský úsudek, který není nikde zakódovaný. | Navisworks, Solibri, Revizto — **detekují, ale neřeší**. | Střední konkurence |
| **BIM interoperabilita / IFC round-trip ztrácí data.** Revit→ArchiCAD shodí MEP potrubí, barvy systémů, složitou geometrii. | IFC je *lossy handoff* formát, ne živý kolaborační. Nativní formáty = byznys model vendor lock-inu, ne nedopatření. | buildingSMART (pomalé), Speckle, Bimdex — řeší vrstvu nad chaosem, ne fidelitu exportu. | Strukturální, těžké |
| **Scan-to-BIM je pořád ruční modelování.** Sběr dat zlevnil; **většina nákladů = ruční sémantická interpretace**. Mračno bodů neunese „co to potrubí vede". | Sémantickou vrstvu musí dodat člověk. „Několik founderů to zkusilo, nikdo plně nevyřešil" (Foundamental VC). | NavVis, OpenSpace, Matterport, ClearEdge3D — zrychlí sběr, ne sémantiku. | **Vysoký pain, nízká konkurence** |
| **Povolování: většina jurisdikcí jen „nahraj PDF do portálu".** Skutečná automatická kontrola norem je vzácná, hlavně u složitých komerčních budov. | Předpisy jsou v přirozeném jazyce, lokálně roztříštěné, vágní, stále se mění. Formalizace pravidel = nevyřešené jádro. | GreenLite ($49,5M B), PermitFlow ($54M B) — **balí práci pro lidské recenzenty**, nedělají normu strojově čitelnou. Symbium = jen jednoduché rezidenční (ADU, solár). | Vysoký pain, nízká konkurence na *skutečné automatizaci* |

**EU specifikum povolování:** Estonsko (PDF i IFC, všechny obce) a Finsko (>80 % obcí online, IFC submission se stává povinnou) vedou. **Německo, Francie, Španělsko, Itálie, CEE** zaostávají, většina bez zákonné lhůty. Američtí hráči (GreenLite/PermitFlow) tu nepůsobí → jazyk/právo = příkop i příležitost pro lokálního hráče.

---

### B) REALIZACE NA STAVBĚ

| Mezera | Proč není vyřešená | Kdo to zkouší (a proč nestačí) | Pain / konkurence |
|---|---|---|---|
| **Subdodavatelé + platby = nejširší díra.** ~70 % subů hlásí pravidelné zpoždění plateb; 92 % GC v 2025 zálohovalo náklady; využití penzijních úspor na pokrytí mezery skočilo z 2 % (2021) na 44 % (2025). | **„Sub-side resistance trap":** sub žonglující s několika GC portály odmítá „další login", takže data zůstávají neúplná. GC nástroje fungují jen když je sub najde fakt snadné. | GCPay, BlueClerk, JobTread (GC-centrické). „Rozdíl mezi marketingem a fungujícím produktem je tu nejširší." | **Nejvyšší pain, nejslabší produkt** |
| **Specializovaná řemesla mimo HVAC/instalatér/elektro** nemají svůj „operační systém". | ServiceTitan ovládl HVAC/instalatéry/elektro ($890M tržby 2024), ale trh řemesel je ~1,5 bil USD, 6M pracovníků, enterprise penetrace jen ~25 %, SMB téměř greenfield. | Žádný ServiceTitan pro střechaře, beton, sádrokarton, fasády, sklenáře, slaboproud. | **Vysoký pain, nízká konkurence** |
| **Denní deníky a sledování postupu** — pořád papír/Excel, vyplňované zpětně „na konci týdne, pokud vůbec". | Stavby bez konektivity; logování je vnímáno jako režie bez návratu pro toho, kdo zapisuje. | Procore Daily Log, SafetyCulture, Track3D (kamerový postup, raný, jen velké projekty). | Vysoká konkurence |
| **Rozvrhování / lookahead plánování** — pořád whiteboardy, telefony, SMS večer předem. | Master nástroje (P6, MS Project) jsou kancelářské; denní koordinace je neformální/sociální. Stavbyvedoucí odmítají nástroje, co nesedí jejich dni. | Outbuild, Planera, Hoylu — vrstva je *málo konsolidovaná*, inkumbenti (Procore/ACC) denní polní plánování nevlastní. | Střední, otevřená vrstva |
| **Defekty / punch listy** — selhání je v ruční follow-up; sub tvrdí „nikdo mi neřekl". | Vyřešení závisí na adopci subdodavatele. Když se sub nepřihlásí, GC zase obchází stavbu. | PlanRadar, Fieldwire, Visibuild, Snagmaster — crowded, ale vymáhání uzavření slabé. | Crowded |
| **Sledování času / techniky** — ~10–20 % nepřesnost u honor-system GPS; 24 % hodinových přiznává „nafukování" ~4,5 h/týden. **Nečinná technika je neviditelná.** | GPS appky bez ověření identity; offline režim je fakt těžký. | CrewTracks, Workyard, busybusy, SmartBarrel — labor crowded, **idle techniky podsloužené**. | Labor crowded; technika otevřená |
| **BOZP / EHS** — toolbox talks, JSA, near-miss pořád papír. Inspektoři chtějí *důkaz* zapojení dělníků. | Současné EHS = „digitalizovaný papír", ne workflow-native. | SafetyCulture, SmartQHSE — „mezera mezi bolt-on AI a AI-native designem". | Vysoký pain, EU regulační tailwind |

**Proč inkumbenti selhávají:** Procore = složitost a strmá křivka učení (malé firmy se mu vyhýbají); Fieldwire = není finanční nástroj; Buildertrend = rezidenční. Všechny jsou **GC- a kancelář-centrické**; polní čety opouští appky, co jim nic nevrací.

---

### C) DODAVATELSKÝ ŘETĚZEC, MATERIÁL, ROZPOČTY

| Mezera | Proč není vyřešená | Kdo to zkouší (a proč nestačí) | Pain / konkurence |
|---|---|---|---|
| **Materiál se pořád objednává telefonem, e-mailem, PDF, Excelem.** Finance nevidí závazky v reálném čase. 64 % dodavatelů prý pořád dělá rozpočty v Excelu/na papíře. | Dodavatelé jsou offline, každý kotuje jinak (žádný standard), úvěrové vztahy drží kupce u starých kupců. | Kojo (ex-Agora, ~$94M, >$5 mld materiálu/rok), Cosuno (DE), Field Materials AI, Quotable.ai. | Vysoký pain |
| **B2B marketplace na materiál — tenké, regionální, ztrátové.** | **Materiál je těžký/lokální/nízkomaržový; logistika dominuje ekonomice.** Schüttflix: náklady ~96 % tržeb, ztráta 18,9 mil €. Take-rate model na komoditě nefunguje. | Schüttflix (DE, ztrátový), Infra.Market (IN, ~$2,75 mld — ale vertikálně integrovaný), ManoMano Pro/Bricoman (DIY nálepka). | **PAST — vyhnout se** bez vlastní logistiky/úvěru |
| **AI takeoff hotový, downstream prázdný.** AI přečte plány a spočítá množství → a skončí. **Bid leveling** (srovnání nabídek, mezery ve scope, outliery) a award management pořád v Excelu. | Bid leveling vyžaduje úsudek + čistá historická data; 40 % AI implementací selhává na kvalitě dat. | Togal.AI, Beam, PataBid — *zastaví se u množství*. Cosuno řeší tendering subů. | **Bid leveling = nízká konkurence** |
| **Cenová transparentnost rozbitá.** Cenové knihy se kompilují měsíce a jsou zastaralé. Vstupní ceny v Q1 2026 rostly anualizovaně 12,6 %. | Ceny se kotují per-vztah, nezveřejňují se; volatilita dělá statická data k ničemu. | Field Materials AI, Procore Material Price Tracker, Fastmarkets. | Střední |
| **Logistika / doručení / odpad** — ruční dodací listy, přepis faktur, nadměrné objednávky, dvojí manipulace. | Mnoho nekoordinovaných dodavatelů/staveb; žádná sdílená datová vrstva. | Schüttflix, Geofluxus (odpad), itemit. | Střední |
| **EU veřejné tendery pořád „dokument-centrické"** navzdory eForms. SME pořád znovu vkládají data, co už jsou v registrech. | eForms (2023) digitalizovaly *publikaci* oznámení, workflow zůstalo analogové. 27 roztříštěných národních systémů. | **Scalera** (CH, €5,7M, AI pro veřejné zakázky) — jediný raný hráč. | Nízká konkurence, regulační tailwind (revize zadávání 2026) |

---

### D) PROVOZ, FACILITY MANAGEMENT, ENERGETIKA

| Mezera | Proč není vyřešená | Kdo to zkouší (a proč nestačí) | Pain / konkurence |
|---|---|---|---|
| **Handover gap: as-built/BIM data se do provozu nedostanou.** FM dostane papírové šanony/PDF a **přepisuje** data do CMMS — „člověko-roky práce". | Data tvoří desítky subdodavatelů bez povinnosti/motivace dodat strukturovaná data. COBie se vyplňuje otravně; ten, kdo z toho těží (FM), to nevyplňuje. | Autodesk Tandem, Willow, AkitaBox — **vyžadují čistá data u zdroje**, která neexistují. | **Vysoký pain, „poslední míle BIM"** |
| **Dlouhý chvost budov bez SW vůbec.** Pod trophy/Class-A a enterprise portfolii běží obří fond malých komerčních + rezidenčních budov na Excelu, WhatsAppu, papíře. | Žádný FM personál, malé rozpočty, vysoká heterogenita, rozdělené motivace (majitel platí capex, nájemník energii), jazyk/právo v EU. | Enterprise IWMS (Planon, Maximo, Archibus) = 3–18 měsíců implementace, $100k+/rok — **dlouhý chvost nemůžou obsloužit**. Horizontální SMB CMMS neumí compliance/místní právo. | **Vysoký pain, nízká konkurence** |
| **EU EPBD/ESG compliance — nařízeno, ale nepostavené.** Recast EPBD: digitální EPC do národních databází, transpozice do 29.5.2026, renovační plány do 31.12.2026. CSRD živé, CA SB253 od 2026. | ESG data = „spreadsheet archeologie": ruční sběr faktur, kvartální dumpy měsíce pozdě. EPC nesrovnatelné napříč státy, špatná kvalita dat. ~75 % EU fondu energeticky neefektivní, jen ~11 % renovuje ročně. | Measurabl, Deepki, Dcycle, OneClickLCA — **cílí na velká CRE portfolia**. SMB/rezidenční nemá ani měřáky ani ESG personál. | **Vysoký pain, regulační deadline, tenká konkurence dole** |
| **Smart building / IoT fragmentace.** Budova = záplatovník uzavřených protokolů (BMS, HVAC, měřáky, přístup). FM žongluje s víc platformami. | Legacy OT je uzavřené/proprietární; integrace = per-site middleware; retrofit IoT na staré budovy je bespoke práce, neškáluje do čistých SaaS marží. | Wattsense, Akenza, Metrikus — middleware existuje, protože problém je reálný. | Střední |
| **Prediktivní údržba = z velké části vaporware v budovách.** Built environment je drtivě reaktivní/run-to-failure. | PdM potřebuje přesně tu datovou vrstvu, kterou fragmentace a handover gap upírají. | BuildingsIOT, Facilio — „PdM v budovách je v plenkách". | Závislé na vyřešení dat |

**Nejlepší důkaz, že IoT smart building NENÍ snadný byznys:** **Infogrid** (raised $15,5M Series A, „make any building smart") koupil Buildings IOT + Aquicore, **přejmenoval se na NODA (12/2024), propustil lidi a pivotoval pryč od sensor-led modelu**. Hardware-led vstup do dlouhého chvostu budov je ekonomicky těžký.

---

## Část 3 — Žebříček: nejlepší díry pro nový startup

Seřazeno podle kombinace: vysoký pain × nízká konkurence × regulační tailwind × obhájitelnost × lehký capex × pákový efekt AI × EU-friendly.

### 🥇 Tier 1 — doporučené (nejlepší poměr příležitost/riziko)

**1. EU EPBD/ESG compliance-as-a-service pro „dlouhý chvost" budov**
- *Proč:* tvrdý regulační deadline (transpozice EPBD do 5/2026, renovační plány 12/2026, CSRD, SB253) = **kupující je nucen zákonem**, ne přesvědčován ROI. Nástroje míří na velká portfolia; SMB/rezidenční majitel nemá personál ani software. Silně **AI-pákové** (extrakce z EPC, faktur, automatizace reportů).
- *Zákazník:* malí/střední majitelé komerčních budov, správci, bytová družstva/SVJ, regionální fondy.
- *Riziko:* chybí datová/měřící vrstva dole → produkt musí umět odhad z málo dat. Lokalizace per-stát.
- *EU edge:* roztříštěnost (jazyk, národní EPC schémata, německé WEG právo) je příkop proti US hráčům.

**2. AI vrstva pro automatizaci nestrukturovaných dokumentů — NAD inkumbenty, ne proti nim**
- *Proč:* LLM překročily práh použitelnosti pro dokument-těžké úlohy (specifikace, smlouvy, RFI, submittals, **bid leveling**). Inkumbenti (Procore/Autodesk) drží *strukturovaná* data a integrace, ale ne nestrukturovaná. Jen 27 % firem dnes používá AI, 94 % z nich plánuje rozšířit → runway.
- *Konkrétní podsegmenty s nízkou konkurencí:* **bid leveling / orchestrace nabídek** (downstream od AI takeoff — prázdné), **spec-to-BIM** obousměrná synchronizace, kontrola smluv pro EU smluvní formy.
- *Riziko:* platformní riziko (běžíš na cizích datech); accuracy claims v oboru jsou self-reported, potřeba reálný benchmark.

**3. Sub-first / řemeslo-first operační systém + fintech (pracovní kapitál)**
- *Proč:* nejvyšší pain v celém řetězci (zpoždění plateb 70 %, penzijní úspory na pokrytí mezery 2 %→44 %), a inkumbenti jsou GC-centrické → „sub odmítá další login". **Neutrální nástroj postavený pro řemeslo** (napříč GC) je strukturální díra.
- *Nejčistší úhel:* **specializovaná řemesla, která nemají ServiceTitan** (střechaři, beton, sádrokarton, fasády, sklenáři, slaboproud) + zabudovaný pracovní kapitál/platby.
- *Riziko:* „subdodavatel je white space" je konsensus už ~3 roky → obvyklé vrstvy (deníky, čas) už crowded; defenzivní je **fintech + řemeslo-specifický workflow**, ne generický sub PM.

### 🥈 Tier 2 — solidní, ale buď těžší, nebo užší trh

**4. „Poslední míle BIM": handover data → čistý asset registr v CMMS** — všichni produkují BIM, skoro nikdo ho neoperacionalizuje. Pozor: nevyřešená motivace u zdroje (kdo to vyplní) je hlavní riziko; vyhraje, kdo to vynutí/zautomatizuje *během* stavby.

**5. Povolování/compliance pro složité budovy mimo Nordics (DE/FR/ES/IT/CEE)** — regulační tailwind (revize EU zadávání 2026, EPBD), jazyk/právo = příkop proti US. Pozor: formalizace předpisů je těžké jádro; začni úzce (jeden typ budovy / jedna země).

**6. Sémantické obohacení pro scan-to-BIM** — všichni dělají geometrii, nikdo sémantiku; Foundamental to označuje jako nevyřešený nákladový driver. Pozor: technicky náročné, B2B služby zatím > čistý produkt.

**7. Automatizace EU veřejných tenderů pro SME** — jen jeden raný hráč (Scalera), regulační tailwind. Pozor: 27 roztříštěných systémů = pomalý go-to-market.

**8. Idle-tracking techniky pro self-perform SMB** — labor je crowded, technika ne; úzké, ale konkrétní.

### 🚫 Tier 3 — pasti / vyhnout se

- **Marketplace na komoditní materiál** bez vlastní logistiky/úvěru → margin past (Schüttflix důkaz).
- **Vertikálně integrované modulární / 3D-tisk / prefab** → hřbitov (Katerra, Veev, Mighty Buildings, ICON): capex + regulace zabíjí, ne technologie.
- **Další AI takeoff nástroj** → přeplněné u množství.
- **GC project management** → ovládnuto Procore ($1,32 mld tržeb 2025) / Autodesk / Trimble.
- **Generativní/feasibility design** → TestFit, Autodesk Forma, Hypar relativně dobře financované.
- **Sustainability obecně bez compliance háčku** → financování investorů ochlazuje (z 58 % na 48 %), honí se near-term ROI.

---

## Část 4 — EU vs US: kde je vaše výhoda i hendikep

- **Inkumbentní vrstva je americká** (Procore, Autodesk, Trimble). EU otvor = **lokalizace/regulační fit** (compliance, jazyky, smluvní formy jako FIDIC/národní, formáty nabídek, cost-control struktury).
- **EU ConTech je podkapitalizovaný:** do 10/2025 jen ~194 mil USD ve 27 kolech (pokles YoY); ~3,23 mld USD za 10 let; z 3 788 EU ConTech firem jen 785 financovaných. Širší AI mezera: ~14 mld USD (EU) vs ~146 mld USD (US) v 2025.
- **Důsledek (skeptický):** lokalizace plodí **regionální vítěze, ne globální kategorie-lídry**, protože tatáž roztříštěnost, co tvoří otvor, zároveň stropuje TAM per země. EU founder musí vyhrát na **kapitálové efektivitě**, ne na blitzscalingu.

---

## Část 5 — Pokud bych měl vybrat jeden směr

Pro EU-based founderra s lehkým capexem a AI pákou bych šel po **průniku Tier-1 příležitostí #1 a #2**:

> **AI-nativní compliance + dokumentová platforma pro EU malé/střední majitele a správce budov**, která (a) automatizuje EPBD/ESG reporting z nestrukturovaných dat (EPC, faktury, PDF handover) a (b) z toho samého datového jádra vyrobí použitelný asset registr pro provoz.

Proč to: **zákonný deadline jako akvizliční motor** (ne „přesvědč mě o ROI"), **dlouhý chvost, kam se enterprise ani US hráči nehrnou**, **lokalizace jako příkop**, **lehký capex**, a **AI dělá dříve nemožnou extrakci ekonomicky proveditelnou**. Začni úzce — jedna země, jeden typ budovy (např. německá SVJ/WEG nebo české bytové domy) — a rozšiřuj.

---

## Zdroje (výběr, nejvyšší kredibilita nahoře)

**Makro / trh**
- McKinsey, Reinventing Construction through a Productivity Revolution — https://www.mckinsey.com/capabilities/operations/our-insights/reinventing-construction-through-a-productivity-revolution
- McKinsey, Decoding digital transformation in construction — https://www.mckinsey.com/capabilities/operations/our-insights/decoding-digital-transformation-in-construction
- FMI/Autodesk Big Data Report — https://fmicorp.com/uploads/media/FMI_BigDataReport.pdf
- Eurostat digitalisation 2025 — https://ec.europa.eu/eurostat/web/interactive-publications/digitalisation-2025
- EK, construction single market — https://single-market-economy.ec.europa.eu/sectors/construction_en

**Financování / hřbitov**
- Zacua Ventures ConTech Investor Survey 2025 — https://zacuaventures.com/contech-investor-survey-2025/
- Construction Dive, ConTech funding — https://www.constructiondive.com/news/contech-funding-vc-builtworlds/740990/
- Nymbl Q3 2025 ConTech report — https://www.nymblventures.com/post/q3-2025-contech-market-report
- Katerra — https://www.failory.com/cemetery/katerra ; Veev — https://www.cbinsights.com/research/veev-unicorn-failure/
- Tracxn EU ConTech — https://tracxn.com/d/explore/construction-tech-startups-in-europe/

**Návrh / BIM / povolování**
- BIM interop (IFC round-trip) — https://www.bimdex.com/blogs/bim-interoperability-challenges-and-how-to-overcome/
- ACCORD (EU permit digitalisation state of play) — https://accordproject.eu/state-of-play-in-the-digitalisation-of-building-permit-digitalisation-in-estonia-finland-germany-the-uk-and-spain/
- GreenLite Series B — https://www.prnewswire.com/news-releases/greenlite-raises-49-5m-series-b-to-advance-the-privatization-of-construction-permitting-with-ai-powered-solutions-302555315.html
- Scan-to-BIM (Foundamental) — https://www.foundamental.com/perspectives/scan-to-bim-will-it-ever-be-fully-automated-some-thoughts

**Realizace**
- PYMNTS / subdodavatelé platby (via PermitFlow) — https://www.permitflow.com/blog/subcontractor-management-software
- ServiceTitan trh (Bessemer memo) — https://www.bvp.com/memos/servicetitan
- Sub management resistance — https://palcode.ai/blog/subcontractor-management-software

**Dodavatelský řetězec**
- Schüttflix ztráty — https://www.nw.de/lokal/kreis_guetersloh/guetersloh/24230482_Guetersloher-Unternehmen-Schuettflix-macht-erneut-hohe-Verluste-so-geht-es-dort-weiter-v3.html
- Bid leveling gap — https://www.bidicontracting.com/blog/ai-construction-bidding-software
- Scalera (veřejné zakázky) — https://www.eu-startups.com/2025/05/swiss-startup-scalera-raises-e5-7-million-to-bring-ai-to-public-construction-procurement-and-get-europe-building-again/

**Provoz / FM / energetika**
- EPBD (EK) — https://energy.ec.europa.eu/topics/energy-efficiency/energy-performance-buildings/energy-performance-buildings-directive_en
- BPIE, EPC napříč EU — https://www.bpie.eu/publication/energy-performance-certificates-across-the-eu/
- EK BUILD UP, digitalizace stavebního sektoru — https://build-up.ec.europa.eu/en/resources-and-tools/articles/state-art-digitalisation-building-sector
- COBie / handover (NIBS WBDG) — https://www.wbdg.org/bim/cobie
- Infogrid→Noda pivot (Memoori) — https://memoori.com/nodas-pivot-infogrid-continues-2025-review/

> **Upozornění na rigor:** Část procentuálních statistik („18 % paperless", „64 % Excel", „61 % PdM gap") pochází z marketingových blogů dodavatelů bez doložené metodiky — berte je směrově. Nezávisle silné jsou McKinsey, Eurostat, EK/BPIE, akademické studie, S-1 a doložené kolapsy firem. WebFetch byl u řady primárních zdrojů blokován (403), takže některá čísla jsou z výtahů vyhledávače — před použitím v rozhodovacím dokumentu doporučuji doověřit přímo u primárního zdroje.
