# Technická proveditelnost a rizika AI rešerše pozemku pro RD v ČR: metody, validace, právo, náklady

Stav k 28. 10. 2026. **Omezení této rešerše (pro autora výsledné zprávy):** limit WebSearch pro tento běh (sdílený všemi agenty) se vyčerpal po zhruba 15 dotazech. WebFetch síťová politika blokovala pro většinu domén (sám jsem narazil na urban.org, arxiv.org, ar5iv.labs.arxiv.org a gibsondunn.com; proxy log ukazuje blokaci i pro zakonyprolidi.cz, e-sbirka.cz, mmr.gov.cz, uur.cz, uzemniplanovani.gov.cz a pravniprostor.cz). Dostupné byly jen GitHub / raw.githubusercontent.com a lokální referenční skill Claude API (ceny Anthropic, stav k 6. 10. 2026). Proto:
- Body označené **[NEOVĚŘENO V SESSION]** vycházejí z mé znalosti textu předpisů a odkazují na kanonické znění. Obsah jsem v této session nenačetl, takže je před publikací ověřte.
- Fakta převzatá jen ze souhrnu vyhledávače (plný text jsem neviděl) jsou označena „(dle souhrnu vyhledávání)“.

---

## 1. Jaké jsou zdokumentované přístupy a precedenty LLM/ML extrakce regulativů (zoning) z nestrukturovaných dokumentů a jakou přesnost uvádějí?

### Takeaway
Nejlépe zdokumentované precedenty jsou z USA. Uvádějí zhruba 85–96 % přesnosti u jednoduchých (hlavně binárních) otázek nad textem regulativů a znatelně horší výsledky u spojitých, numerických a vícehodnotových položek. Projekt s nejvyšší laťkou přesnosti (National Zoning Atlas) plnou automatizaci po dvou pilotech odmítl a volí hybridní model člověk + stroj. Komerční hráči (Archistar) do produktu zabudovávají krok human-in-the-loop. Nezávislé evaluace komerčních nástrojů jsem nenašel.

### Cited Findings
**Akademické a veřejné projekty (USA):**
- **Bartik, Gupta, Milo (NYU Stern / UIUC): „The Costs of Housing Regulation: Evidence from Generative Regulatory Measurement“ (working paper 2024).**
  - LLM zakódovaly přibližně 6 000 zoning codes, které pokrývají 63 % populace žijící v municipalitách.
  - Uvádějí 96% přesnost u binárních klasifikací a korelaci 0,87 u spojitých veličin. — [Dan Milo CV](https://dmilo75.github.io/dan_milo_cv.pdf) (dle souhrnu vyhledávání)
- **Pipeline k témuž projektu podle veřejného repozitáře.** Text vyhlášek se dělí na sekce a embeduje. Modul „context building“ skládá kontext k otázce. Na dotazy odpovídají modely OpenAI (GPT-3.5, GPT-4) a otázky jsou dvojího typu, „binary and numerical“. Repozitář obsahuje dávkování a počítání tokenů a paralelizaci dvojic otázka × obec přes SLURM. README neuvádí žádná čísla validace ani nákladů. — [GitHub dmilo75/ai-zoning](https://github.com/dmilo75/ai-zoning)
- **NREL, Buster et al. 2024 (Energy and AI, sv. 18, čl. 100431; arXiv 2403.12924).**
  - Extrakce pravidel pro umisťování větrných a solárních elektráren (vč. odstupů / setbacks) z místních vyhlášek pomocí GPT-4 řízeného rozhodovacím stromem („decision tree embedded with knowledge of the subject matter“) dosáhla přesnosti 85–90 %.
  - Výstupy jsou podle autorů použitelné přímo v kvantitativním modelování.
  - Každý krok stromu je menší prompt. Strom umožňuje označit nejednoznačné vyhlášky k lidské kontrole. — [Supporting Energy Policy Research with LLMs (arXiv)](https://arxiv.org/pdf/2403.12924); [Energy and AI (DOAJ)](https://doaj.org/article/05dd5ec1e1954578aaf684d31e534fce) (dle souhrnu vyhledávání)
- **NREL, starší srovnání ze slidů G. Bustera (11/2023).**
  - Přesnost: ručně vedená databáze vyhlášek 82 %, LLM s jedním promptem 86 %, LLM s rozhodovacím stromem 90 %.
  - Část „chyb“ databáze podle slidů odráží novely vyhlášek přijaté po uzávěrce databáze (duben 2022). — [NREL slides (energy.gov)](https://www.energy.gov/sites/default/files/2023-11/9.%20Buster%20-%20llm_20231101_v2.pdf) (dle souhrnu vyhledávání)
- **NREL, další zjištění.** Klíčovým krokem pro přesnost byla „content distillation“ (zhuštění relevantního obsahu). Modely s dlouhým kontextem mají nízkou přesnost, když mají vytáhnout informaci ze středu dlouhého dokumentu. — [arXiv 2403.12924 v1](https://arxiv.org/pdf/2403.12924v1.pdf) (dle souhrnu vyhledávání)
- **NREL, nástroj ELM.**
  - Pipeline: převod PDF na text přes poppler/pdftotext, volitelné OCR přes pytesseract, vyhledávání a stahování vyhlášek z webu přes Playwright, extrakce rozhodovacím stromem. — [NREL ELM ords README](https://github.com/NREL/elm/blob/main/elm/ords/README.md); [ELM README](https://github.com/NREL/elm)
  - Autoři varují, že zpracování všech 85 okresů z ukázkového CSV „can cost $700–$1000 in API calls“. — [ELM ordinance_gpt example](https://github.com/NREL/elm/blob/main/examples/ordinance_gpt/README.rst)
- **Urban Institute (2023), Axelrod, Lo, Bronin: „Automating Zoning Data Collection“.**
  - Pilot pro National Zoning Atlas na textech Connecticutu. Jako benchmark sloužila ručně sebraná data Connecticut Zoning Atlasu.
  - Pipeline začíná zpřístupněním a prohledatelností dokumentů a pokračuje algoritmickou identifikací názvů zón.
  - Proces se nepodařilo plně automatizovat. Autoři to připisují chybějící standardizaci dokumentů a vysoké laťce přesnosti, kterou úloha vyžaduje. Doporučují hybridní model, kde automatizace snižuje lidskou práci. — [Urban Institute](https://www.urban.org/research/publication/automating-zoning-data-collection); [APA knowledgebase](https://planning.org/knowledgebase/resource/9305920) (dle souhrnu vyhledávání; plný text byl blokován)
- **National Zoning Atlas, aktuální postoj.** Po práci s Urban Institute a s Cornell Tech tým došel k závěru, že algoritmy zatím nezvládají nuance dlouhých a složitých zoning codes s požadovanou přesností. Atlas proto dál stojí na ruční metodice. — [NZA FAQ](https://www.zoningatlas.org/faqs); [NZA „How we make“](https://www.zoningatlas.org/how) (dle souhrnu vyhledávání)
- **National Zoning Atlas, 2. fáze.** Spolupráce s prof. Alexandrem Rushem (Cornell Tech) na extrakci strukturovaných dat ze širšího vzorku kódů. Cíle jsou „accuracy and attribution within the original codes“ a fázi financuje mj. NSF. Čísla přesnosti zatím nejsou publikována. — [NZA research](https://zoningatlas.org/research); [Cornell Legal Constructs Lab](https://labs.aap.cornell.edu/legal-constructs-lab/current-research/can-machine-learn-read-zoning-codes)
- **Repozitář zoning-gpt (NZA × Cornell), pipeline.** OCR přes AWS Textract, vyhledávání přes Elasticsearch s tezaurem pojmů (FAISS/embeddingy jen jako navržená alternativa), prompty pro GPT-3.5/GPT-4 a metody `map` a `tournament_reduce`. Ground truth `ground_truth.csv` má ke každé položce odpověď i číslo strany. Metriky jsou „page accuracy“ a „page recall@10“. README výsledná čísla neuvádí. — [GitHub National-Zoning-Atlas/zoning-gpt](https://github.com/National-Zoning-Atlas/zoning-gpt)
- **Chybové módy podle zoning-gpt:**
  - Špatný recall vyhledávání, typicky kvůli neúplnému tezauru.
  - Složité tabulky, kde jsou popisky „Minimum“ a „Lot Size“ rozdělené do buněk. Podle README chybuje i GPT-4.
  - Odpovědi skryté v odkazovaných přílohách.
  - Neobvyklé formulace.
  - Vícehodnotové odpovědi, kdy model vrátí jen jednu hodnotu.
  - Chyby vyhodnocovače u neobvyklých jednotek. — [zoning-gpt README](https://github.com/National-Zoning-Atlas/zoning-gpt)
- **Mleczko & Desmond (Urban Studies 60(13), 2023, s. 2564–2584).** NLP nad veřejnými administrativními daty k sestavení „National Zoning and Land Use Database“, kód i data jsou veřejné. — [RePEc/EconPapers](https://econpapers.repec.org/RePEc:sae:urbstu:v:60:y:2023:i:13:p:2564-2584)
- **Salazar-Miranda & Talen (arXiv 2502.00008, leden 2025; dle Yale publikováno v Nature Cities).** NLP analýza zoning codes ve více než 2 000 místech USA. Kvůli přesnosti autoři porovnali tematické výstupy NLP se subjektivním hodnocením lidských kodérů. — [arXiv 2502.00008](https://web3.arxiv.org/abs/2502.00008); [Yale Livable City Lab – Code Shift](https://livablecitylab.yale.edu/projects/code-shift) (dle souhrnu vyhledávání)
- **NBER conference paper (autory se nepodařilo ověřit, může jít o verzi práce Bartik/Gupta/Milo).** Kategorie regulace generované LLM byly validovány proti ručně kódovaným datům Pioneer Institute (Massachusetts). GPT-4 Turbo podle práce dosáhl „near-human rates of precision“. Korelace u predikce minimální velikosti pozemku je 0,9. — [NBER conf. paper](https://conference.nber.org/conf_papers/f205452/f205452.pdf) (dle souhrnu vyhledávání)
- **Diplomová práce MIT (2025).** Uvádí 85–95% přesnost identifikace a standardizace složitých regulatorních požadavků z municipal codes v Kalifornii. — [MIT DSpace 1721.1/164571](https://dspace.mit.edu/handle/1721.1/164571) (dle souhrnu vyhledávání)
- **Minneapolis, pilot RAG (březen 2026).** Testy LLM nad 467stránkovým zoning code. RAG podle souhrnu GovLab zlepšil relevanci odpovědí, úředníci však zůstávají opatrní kvůli přesnosti. — [Pulse/GovLab digest](https://www.pulse.bot/govtech/news/could-retrieval-augmented-generation-with-large-language-models-help-make-local-zoning-codes-easier-f920b889-cc3e-4fa5-862b-374cd2107970/) (sekundární agregátor)

**Komerční precedenty:**
- **Archistar AI PreCheck (dříve eCheck), Austrálie.**
  - Deklaruje kombinaci generativní AI, počítačového vidění a ML pro kontrolu souladu návrhu s územními a stavebními předpisy. Ve výčtu funkcí uvádí krok „human-in-the-loop review“.
  - Vendor tvrdí až 55% zkrácení cyklů posuzování. Jde o marketingové tvrzení bez nezávislé evaluace. — [Archistar AI PreCheck](https://www.archistar.ai/aiprecheck/); [Archistar pro samosprávy](https://www.archistar.ai/aiprecheck/government/)
- **Nasazení Archistaru:**
  - City of Surrey (Kanada) uzavřelo tříletou smlouvu na plné nasazení. — [Archistar blog – Surrey](https://www.archistar.ai/blog/city-of-surrey-partners-with-archistar-to-fully-deploy-ai-powered-echeck-for-zoning-compliance-and-enhanced-permitting-process/)
  - LA County spustil v červenci 2025 pilot eCheck AI pro obnovu RD v zónách postižených požáry. — [LA County Recovery](https://recovery.lacounty.gov/2025/07/15/la-county-launches-echeck-ai-pilot-as-part-of-express-lane-for-faster-rebuilding/)
- **Menší projekty:** Zoning Pal (Toronto) parsuje PDF vyhlášek, identifikuje kódy zón a jejich přípony, dohledá relevantní sekce a generuje souhrn. Podrobnosti jsou jen pro členy. — [AI Tinkerers](https://panama.aitinkerers.org/talks/rsvp_ds5x0vZeaDI)

### Inferences
- **Na co se lze v ČR odvolat.** Přenositelné jsou hlavně dvě věci. Za prvé struktura úlohy: binární otázky typu „je RD v ploše X hlavní/přípustné využití?“ jsou nejsnazší, numerické a podmíněné regulativy (výšková hladina, KZP, min. výměra, „podmíněně přípustné za podmínky…“) jsou nejtěžší. Za druhé zjištění, že rozhodovací strom s malými prompty plus označování nejistých případů k lidské kontrole přidal NREL zhruba 4 p. b. oproti jednomu promptu.
- **Strukturovanější vstup než v USA.** Český ÚP má díky prováděcí vyhlášce předepsanou strukturu (plochy s rozdílným způsobem využití; hlavní / přípustné / podmíněně přípustné / nepřípustné využití; podmínky prostorového uspořádání). To pravděpodobně zvyšuje dosažitelnou přesnost oproti heterogenním US zoning codes. **[NEOVĚŘENO V SESSION]**, ověřit u výzkumníků datových zdrojů, zejména podíl ÚP v jednotném (vektorovém) standardu.
- **Nevěřit agregovaným číslům.** 96 % u binárních otázek je průměr přes mnoho položek. Pro jednotlivou zprávu, kde rozhoduje jedna chybná položka (např. přehlédnuté ochranné pásmo), je relevantní chybovost té nejhorší kritické položky, ne průměr.
- **Doporučená cesta.** Precedenty podporují model „AI připraví, člověk ověří“: NZA hybrid, NREL flagování, Archistar HITL. Autonomní model „AI rozhodne“ precedenty nepodporují.

### Gaps
- Metody a přesnost **Zoneomics** jsem nedohledal (vyčerpaný limit vyhledávání).
- Čísla přesnosti po položkách v reportu Urban Institute (urban.org byl blokován) a výsledky 2. fáze NZA / Cornell (nejsou publikovány).
- Ve výsledcích vyhledávání se objevilo tvrzení o studii School of Cities (Toronto) se 72–92 % u binárních a 40–70 % u spojitých otázek. Zdroj se nepodařilo identifikovat, tvrzení považuji za **neověřené**.
- Evropský nebo český precedent (např. extrakce z německých Bebauungspläne) jsem nehledal kvůli limitu vyhledávání. Stejně tak práce Stanford RegLab a další MIT práce nad rámec výše uvedené diplomové práce.

---

## 2. Jak technicky zpracovat rastrové/PDF mapy ÚP a prostorový průnik parcely s vrstvami? (georeferencování, vektorizace, legenda a VLM; GetFeatureInfo vs WFS; open-source stack; české knihovny a S-JTSK)

### Takeaway
Spolehlivý výsledek pro konkrétní parcelu má stát na **deterministickém GIS průniku vektorových dat** v nativním S-JTSK (EPSG:5514): data se načtou přes WFS / OGC API Features nebo se harvestují do PostGIS. WMS GetFeatureInfo je jen bodová sonda nad vykreslenou mapou a hodí se jako fallback. Plně automatické georeferencování a vektorizace skenovaných map jsou podle soutěže DARPA/USGS zatím nespolehlivé (medián RMSE 1,1 km; F1 polygonů 0,77 i s lidským vstupem) a vision-language modely mají v mapových benchmarcích systematické mezery. Rastrové ÚP proto vyžadují poloautomatický postup s lidskou kontrolou a tolerančními zónami na hranicích ploch.

### Cited Findings
**Georeferencování a vektorizace map (ML):**
- **Soutěž DARPA / USGS / NASA JPL / MITRE „AI for Critical Mineral Assessment“ (2022–2023).** Dvanáctitýdenní soutěž měla dvě úlohy: automatické georeferencování historických map a automatickou extrakci prvků z map. — [DARPA – The Competition](https://criticalminerals.darpa.mil/The-Competition); [DARPA news](https://www.darpa.mil/news/2022/critical-minerals-competition)
- **Výsledky soutěže (Goldman et al. 2025, Applied Computing and Geosciences, doi 10.1016/j.acags.2025.100274):**
  - Extrakce řízená promptem (s uživatelským vstupem) z geologických map dosáhla mediánu F1 0,77 u polygonů, 0,56 u linií a 0,35 u bodů.
  - Automatické pipeline georeferencování dosáhly mediánu RMSE 1,1 km. — [USGS publikace](https://www.usgs.gov/publications/extracting-data-maps-lessons-learned-artificial-intelligence-critical-mineral); [ScienceDirect](https://www.sciencedirect.com/science/article/pii/S2590197425000564) (dle souhrnu vyhledávání)
- **Data soutěže** (trénovací a validační data pro extrakci prvků podle legendy) jsou veřejná. — [data.gov katalog](https://catalog.data.gov/dataset/map-feature-extraction-challenge-training-and-validation-data)

**Vision-language modely nad mapami (benchmarky 2025–2026):**
- **FRIEDA (ICLR 2026)** testuje vícekrokové kartografické uvažování (sladění legendy, měřítka, orientace, popisů a geometrií) a autoři uvádějí přetrvávající mezeru. — [arXiv 2512.08016](https://arxiv.org/abs/2512.08016v1) (dle souhrnu vyhledávání)
- **CartoMapQA (2025):** modely často selhávají v mapově specifické sémantice, mají omezené geoprostorové uvažování a jsou náchylné k chybám OCR. — [arXiv 2512.03558](https://arxiv.org/html/2512.03558v1) (dle souhrnu vyhledávání)
- **PlanBench-V (červen 2026)** je benchmark nad mapami prostorového plánování: 223 map a 1 629 dvojic otázka–odpověď. Qwen3.6-Plus překonává GPT-4o o 27 %, ale všechny modely mají potíže s úlohami vyžadujícími hodnoticí úsudek. — [arXiv 2606.05744](https://arxiv.org/html/2606.05744) (dle souhrnu vyhledávání)
- **MapBench (březen 2025):** více než 1 600 úloh hledání cesty v pixelovém prostoru nad 100 mapami. — [arXiv 2503.14607](https://web3.arxiv.org/abs/2503.14607) (dle souhrnu vyhledávání)

**WMS GetFeatureInfo a vektorové dotazy:**
- **Podstata GetFeatureInfo.** Dokumentace QGIS Server ho definuje jako dotaz, který „retrieves data (geometry and values) for a pixel location“. Standardní parametry jsou I/J (sloupec a řádek pixelu; ve WMS 1.1.1 X/Y), FEATURE_COUNT (maximum vrácených prvků) a INFO_FORMAT. — [QGIS Server docs – WMS](https://github.com/qgis/QGIS-Documentation/blob/master/docs/server_manual/services/wms.rst)
- **Rozšíření QGIS Serveru:**
  - Tolerance v pixelech pro bodové, liniové a polygonové vrstvy (FI_POINT_TOLERANCE, FI_LINE_TOLERANCE, FI_POLYGON_TOLERANCE).
  - FILTER_GEOM, což je WKT geometrie, se kterou musí prvky protínat.
  - WITH_GEOMETRY, které vyžaduje zapnout v projektu „Add geometry to feature response“.
  - Atributové vyhledávání přes FILTER bez X/Y.
  - Jde o vendor-specific rozšíření, ne o obecný standard. — [QGIS Server docs – WMS](https://github.com/qgis/QGIS-Documentation/blob/master/docs/server_manual/services/wms.rst)

**Open-source stack:**
- **OWSLib** je Python klient pro OGC webové služby (WMS, WFS a další) se společným API pro metadata služeb. — [GitHub geopython/OWSLib](https://github.com/geopython/OWSLib)
- **pygeoapi** je serverová implementace sady OGC API v Pythonu (OpenAPI, GeoJSON, HTML), vzniklá v roce 2018, s licencí MIT. — [GitHub geopython/pygeoapi](https://github.com/geopython/pygeoapi)
- **Extrakce textu v existujících pipeline:** zoning-gpt používá OCR AWS Textract — [zoning-gpt](https://github.com/National-Zoning-Atlas/zoning-gpt). NREL ELM používá pdftotext a volitelně pytesseract — [ELM ords README](https://github.com/NREL/elm/blob/main/elm/ords/README.md).

**Česká specifika:**
- **GDAL ovladač VFK** čte data ve „Czech cadastral exchange data format“ (výměnný formát katastru) jako zdroj s více vrstvami. Body, linie a hranice i plochy jsou samostatné typy geometrií a ovladač vyžaduje GDAL se SQLite. — [GDAL VFK driver doc](https://github.com/OSGeo/gdal/blob/master/doc/source/drivers/vector/vfk.rst)
- **gdal-vfr (ČVUT, GeoForAll Lab)** je „full VFR (Výměnný formát RÚIAN) support in GDAL library“, tj. konverzní skripty, např. pro import RÚIAN do PostGIS. — [GitHub ctu-geoforall-lab/gdal-vfr](https://github.com/ctu-geoforall-lab/gdal-vfr)
- **PROJ-data, gridy ČÚZK (© ČÚZK, licence CC BY 4.0):**
  - `cz_cuzk_table_-y-x_3_v1710.tif` transformuje S-JTSK / Krovak East North (EPSG:5514) do S-JTSK/05 / Modified Krovak East North (EPSG:5516) s posunem −5 000 000 m.
  - `cz_cuzk_CR-2005.tif` je výškový grid (geoid CR-2005) pro převod Bpv / Baltic 1957 (EPSG:8357) na elipsoidické výšky ETRS89 (EPSG:4937).
  - Přesnost gridů repozitář neuvádí. — [GitHub OSGeo/PROJ-data/cz_cuzk](https://github.com/OSGeo/PROJ-data/tree/master/cz_cuzk)

### Inferences
- **Hierarchie zdrojů pro průnik parcely, od nejspolehlivějšího:**
  1. Vektorová data ÚP (jednotný standard / WFS / OGC API Features / soubor ke stažení) harvestovaná do PostGIS a verzovaná. Průnik se počítá přes `ST_Intersection` a `ST_Area`, z toho podíl každé plochy na výměře parcely.
  2. Živý WFS dotaz s filtrem BBOX/Intersects na geometrii parcely.
  3. WMS GetFeatureInfo jako vícebodová sonda: mřížka bodů uvnitř parcely, případně QGIS FILTER_GEOM, kde server je QGIS.
  4. Rastrový nebo PDF výkres po georeferencování a klasifikaci barev.

  GetFeatureInfo nedává plošné podíly. Závisí na měřítku vykreslení, stylu, toleranci a limitu FEATURE_COUNT a může přehlédnout malé překryvy, např. úzké pásy ochranného pásma. Pro závazné závěry se nehodí.
- **Doporučený postup pro rastrové ÚP (odvozeno z DARPA výsledků a z praxe GIS):**
  1. Rasterizace PDF ve 300–400 dpi.
  2. Poloautomatické georeferencování s vlícovacími body na katastrální mapě (lomové body hranic parcel, rohy budov) přes GDAL (`gdal_translate -gcp`, `gdalwarp` s polynomem 1. nebo 2. řádu či TPS) nebo QGIS Georeferencer. Automatické párování (feature matching vůči vykreslené KM nebo ortofotu) slouží jen jako návrh a vlícovací body schvaluje člověk.
  3. Zápis RMSE v metrech jako metadata vrstvy.
  4. Vytěžení legendy: ořez legendy, kterou přečte VLM, se převede na paletu kód / barva / šrafa.
  5. Klasifikace pixelů nejbližší barvou v prostoru CIELAB s ošetřením šraf a popisků, potom `gdal_polygonize`, topologické čištění a odstranění šumu.
  6. VLM použít jen jako druhý názor nebo kontrolu („souhlasí kód plochy pod parcelou s legendou?“), ne jako primární zdroj.
- **Medián RMSE 1,1 km je pro parcely nepoužitelný.** Měřítko je řádově horší, než by bylo potřeba: pixel výkresu 1 : 5 000 při 300 dpi odpovídá přibližně 0,42 m. Automatické georeferencování bez lidské kontroly vlícovacích bodů proto pro parcelní úroveň nedoporučuji.
- **Hraniční nejistota.** Kolem hranic ploch vytvořit buffer rovný RMSE georeferencování plus kartografické nepřesnosti. Pokud parcela zasahuje do bufferu, označit závěr jako „nejistý, ověřit ve výkrese / u úřadu“. Malé „sliver“ průniky pod prahem (např. < 1 % výměry nebo < 5 m²) reportovat zvlášť.
- **Souřadnicové systémy.** Vše držet v EPSG:5514. Katastr i ÚP jsou nativně v S-JTSK, takže zbytečná transformace jen přidává chybu. Typické chyby vznikají záměnou EPSG:5514 (East-North, záporné souřadnice) a EPSG:2065 / „Krovak“ s jinou orientací os. Při převodu do ETRS89 nebo WGS84 pro webovou mapu používat přesnou ČÚZK transformaci přes PROJ a pyproj, ne obecný 7parametrový Helmert. Konkrétní volbu transformační cesty ověřit v `pyproj.TransformerGroup`.

### Gaps
- Specifikace OGC/INSPIRE (WMS 1.3.0, WFS 2.0, OGC API Features, INSPIRE download services / Atom) jsem nenačetl, citace stojí jen na dokumentaci QGIS a na README projektů.
- Benchmark klasifikace legendy a barev přímo na výkresech územních plánů jsem nenašel. PlanBench-V míří na plánovací mapy, ale per-category čísla nebyla k dispozici.
- Další české knihovny a projekty nejsou ověřené: QGIS pluginy pro RÚIAN a katastr, Python klienti RÚIAN, nástroje pro ÚP v jednotném standardu.
- Polohová přesnost transformace S-JTSK ↔ ETRS89 (ČÚZK grid) není v repozitáři uvedena.

---

## 3. Jaké architektonické vzory se hodí? (RAG s citacemi, rule engine pro numerické kontroly, HITL autorizovaným architektem, cache po obcích, monitoring změn ÚP)

### Takeaway
Nejlépe podložený vzor je **„extrahuj jednou za obec, počítej pro každou parcelu“**:
1. Offline extrakce regulativů ÚP do typovaného schématu. Každá položka nese citaci strany nebo odstavce a doslovný úryvek, je ověřená člověkem a verzovaná podle změn ÚP.
2. Pro každou parcelu deterministický GIS průnik a rule engine pro numerické kontroly (KZP, výška, min. výměra, odstupy).
3. LLM jen pro syntézu a vysvětlení s citacemi.
4. HITL kontrola autorizovaným architektem řízená prahy jistoty.
5. Monitoring změn ÚP s invalidací cache.

### Cited Findings
- **Nativní citace v Claude API.** Na `document` blocích se zapne `citations: {enabled: true}`. Odpověď pak obsahuje `cited_text`, index dokumentu a u PDF `page_location` (čísla stran). Citace **nejsou kompatibilní se strukturovaným výstupem** (`output_config.format` vrací chybu 400), takže je potřeba dvoukrokový návrh: extrakce s citacemi, potom strukturování. — [Anthropic docs – Citations](https://platform.claude.com/docs/en/build-with-claude/citations) (přes referenční skill Claude API)
- **Limity vstupu PDF v Claude API:** 32 MB na požadavek a 600 stran, u modelů s kontextem 200k jen 100 stran. — [Anthropic docs – Models overview](https://platform.claude.com/docs/en/about-claude/models/overview) (přes referenční skill Claude API)
- **Prompt caching** funguje jako shoda prefixu. Zápis do cache stojí zhruba 1,25× cenu vstupu, čtení zhruba 0,1×. Výchozí TTL je 5 minut, volitelně 1 hodina. **Batch API** zpracovává asynchronně za 50 % ceny. — [Anthropic docs – Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching); [Batch processing](https://platform.claude.com/docs/en/build-with-claude/batch-processing) (přes referenční skill Claude API)
- **Rozhodovací strom a flagování.** Rozhodovací strom s doménovými znalostmi (série malých promptů) zlepšil přesnost oproti jednomu promptu (86 % → 90 %) a umožnil označit nejednoznačné případy k lidské kontrole. — [NREL slides](https://www.energy.gov/sites/default/files/2023-11/9.%20Buster%20-%20llm_20231101_v2.pdf); [arXiv 2403.12924](https://arxiv.org/pdf/2403.12924) (dle souhrnu vyhledávání)
- **Distilace kontextu.** Zhuštění relevantního obsahu před extrakcí bylo pro přesnost důležité, dlouhý kontext trpí efektem „ztráty uprostřed dokumentu“. — [arXiv 2403.12924 v1](https://arxiv.org/pdf/2403.12924v1.pdf) (dle souhrnu vyhledávání)
- **Atribuce na úrovni strany.** Ground truth i metriky zoning-gpt pracují se stranou, kde odpověď leží („page accuracy“, „page recall@10“). Retrieval stál na tezauru pojmů. — [zoning-gpt](https://github.com/National-Zoning-Atlas/zoning-gpt)
- **NZA.** „Accuracy and attribution within the original codes“ je explicitní cíl 2. fáze. — [NZA research](https://zoningatlas.org/research)
- **Archistar** uvádí krok human-in-the-loop review jako součást produktu. — [Archistar AI PreCheck](https://www.archistar.ai/aiprecheck/) (dle souhrnu vyhledávání)
- **Aktuálnost dat.** Část rozdílů mezi ručně vedenou databází a skutečností byla způsobena novelami vyhlášek po uzávěrce dat. — [NREL slides](https://www.energy.gov/sites/default/files/2023-11/9.%20Buster%20-%20llm_20231101_v2.pdf) (dle souhrnu vyhledávání)
- **RAG v praxi.** RAG zlepšil relevanci odpovědí nad 467stránkovým zoning code (Minneapolis 2026), úředníci jsou ale stále opatrní. — [Pulse/GovLab](https://www.pulse.bot/govtech/news/could-retrieval-augmented-generation-with-large-language-models-help-make-local-zoning-codes-easier-f920b889-cc3e-4fa5-862b-374cd2107970/)

### Inferences
- **Vrstvy systému:**
  - **A. Ingest a registr dokumentů (po obcích).** Úplné znění ÚP po poslední změně, výkresy, regulační plány, územní studie a dotčené limity. U každého dokumentu evidovat hash, URL, datum účinnosti, číslo změny a stav (platný / zrušený soudem).
  - **B. Extrakce regulativů (offline, Batch API).** Schéma: `{obec, ÚP_verze, kód_plochy, typ_regulativu (hlavní/přípustné/podmíněné/nepřípustné využití, KZP, KZ, výška, podlažnost, min_výměra, stavební čára, …), hodnota, jednotka, podmínka (text), zdroj_dokument, strana, doslovný_úryvek, jistota, ověřil, datum_ověření}`.
  - Úryvek se deterministicky ověří řetězcovou shodou `cited_text` se zdrojovým textem jako ochrana proti halucinacím. Neověřitelné položky jdou do fronty k člověku.
  - **C. GIS jádro.** PostGIS v EPSG:5514 s harvestovanými vrstvami (ÚP plochy, limity / ochranná pásma, katastr, adresy), průnik parcely s výpočtem plošných podílů a snapshot verzí vrstev ke každé zprávě kvůli auditu.
  - **D. Rule engine.** Deterministické kontroly (např. KZP = zastavěná plocha / výměra pozemku; min. výměra z KN vs. regulativ; výšková hladina) v kódu. Možnosti jsou Python a pravidla jako data (JSON), případně JSON Logic nebo OPA. **LLM nikdy nepočítá čísla.** Interpretuje jen text podmínek a výsledek zařazuje do kategorií splněno / nesplněno / nejisté.
  - **E. Syntéza zprávy (LLM s citacemi).** Každé tvrzení musí mít odkaz na zdroj (dokument + strana, nebo vrstva + verze). Tvrzení bez zdroje se nesmí objevit.
  - **F. HITL.** Autorizovaný architekt kontroluje: (1) každou novou extrakci obce nebo změny ÚP, (2) každou zprávu v MVP, (3) později jen zprávy s nízkou jistotou, hraničními průniky, podmíněnými regulativy nebo neshodou dvou modelů, plus náhodný vzorek.
  - **G. Monitoring aktuálnosti.** Pravidelně kontrolovat zdroje: hash a ETag dokumentů, GetCapabilities a metadata služeb, úřední desky a evidenci územně plánovací činnosti, Atom feedy INSPIRE download služeb. Při změně se invaliduje cache obce, přegeneruje extrakce a znovu ji schválí člověk. Do zprávy uvádět „stav dat k datu“ a verze zdrojů.
- **Cache po obcích je ekonomický i kvalitativní klíč.** Kontext obce (schválené regulativy + relevantní kapitoly) je stabilní prefix, a tak dává vysokou míru zásahů prompt cache. Hlavně ale lidská kontrola probíhá jednou na obec a verzi ÚP, ne jednou na zprávu.
- **Směrování modelů podle úlohy.** Levný model (Haiku-class) pro klasifikaci stránek a routing, střední nebo silný model (Sonnet/Opus-class) pro extrakci a syntézu, nezávislý druhý model nebo druhý běh jako „second opinion“. Neshoda modelů slouží jako signál k lidské kontrole.
- **RAG jen jako doplněk.** RAG nad celým dokumentem je méně spolehlivý než strukturovaná extrakce. Hodí se jako fallback pro dotazy mimo schéma (chat nad ÚP), vždy s citacemi.

### Gaps
- Publikovanou českou ani evropskou referenční architekturu pro takový produkt jsem nenašel.
- Empirická data o vhodných prazích jistoty pro HITL (jaký podíl zpráv lze bezpečně neposílat ke kontrole) chybí.
- Mechanismy notifikace změn ÚP v ČR (zda národní geoportál územního plánování poskytuje API nebo feed změn) jsem neověřil. Patří to výzkumníkům datových zdrojů.

---

## 4. Jak měřit a zajistit přesnost? (validační přístupy)

### Takeaway
Literatura validuje proti **ručně kódované referenci** (data atlasu, Pioneer Institute, Connecticut Zoning Atlas, lidští kodéři) a používá metriky podle typu položky: přesnost u binárních, korelaci u spojitých, F1 u mapových prvků, RMSE u georeferencování a recall@k u vyhledání strany. Pro český produkt je nutná vlastní „zlatá sada“ anotovaná autorizovanými architekty, s metrikami po položkách a asymetrickým hodnocením chyb. Klíčové je, aby systém nepřehlédl limity (vysoký recall); falešně pozitivní varování je menší problém.

### Cited Findings
- Bartik et al. uvádějí 96 % u binárních a korelaci 0,87 u spojitých položek, tedy různé metriky pro různé typy položek. — [Dan Milo CV](https://dmilo75.github.io/dan_milo_cv.pdf) (dle souhrnu vyhledávání)
- NBER conference paper validoval proti datům Pioneer Institute (Massachusetts) a uvádí korelaci 0,9 u minimální velikosti pozemku. — [NBER conf. paper](https://conference.nber.org/conf_papers/f205452/f205452.pdf) (dle souhrnu vyhledávání)
- Urban Institute použil jako benchmark Connecticut Zoning Atlas. Laťka přesnosti úlohy byla podle autorů tak vysoká, že plnou automatizaci nedoporučili. — [Urban Institute](https://www.urban.org/research/publication/automating-zoning-data-collection) (dle souhrnu vyhledávání)
- **Vyhodnocení v zoning-gpt:**
  - Reference obsahuje odpověď i stranu. Vyhodnocuje se zvlášť nalezení strany (page accuracy / recall@10) a správnost odpovědi.
  - Numerické odpovědi se porovnávají regexem a vícehodnotové „LLM-based comparison“.
  - Vyhodnocovač může chybně označit správnou odpověď v neobvyklém formátu nebo jednotce. — [zoning-gpt](https://github.com/National-Zoning-Atlas/zoning-gpt)
- U NREL vycházela ručně vedená databáze hůř (82 %) než LLM s rozhodovacím stromem (90 %), protože část referenčních dat byla zastaralá. I referenční data tedy stárnou a je potřeba je datovat. — [NREL slides](https://www.energy.gov/sites/default/files/2023-11/9.%20Buster%20-%20llm_20231101_v2.pdf) (dle souhrnu vyhledávání)
- Salazar-Miranda & Talen porovnali výstupy NLP s hodnocením lidských kodérů. — [arXiv 2502.00008](https://web3.arxiv.org/abs/2502.00008) (dle souhrnu vyhledávání)
- U map: DARPA/USGS měřili F1 po typech prvků a RMSE georeferencování (mediány 0,77 / 0,56 / 0,35; 1,1 km). — [USGS](https://www.usgs.gov/publications/extracting-data-maps-lessons-learned-artificial-intelligence-critical-mineral) (dle souhrnu vyhledávání)
- Archistar uvádí výsledky (až 55% zkrácení cyklů) bez nezávislé evaluace. Jde o vendor claim. — [Archistar](https://www.archistar.ai/aiprecheck/) (dle souhrnu vyhledávání)

### Inferences
- **Zlatá sada (návrh pro MVP).**
  - 30–50 obcí stratifikovaných podle formy ÚP (vektorový jednotný standard / georeferencovaný rastr / PDF sken / starší ÚPN SÚ), velikosti obce a počtu změn. V každé obci 5–10 parcel (hraniční, uvnitř plochy, v ochranném pásmu, v záplavovém území, v památkové zóně).
  - Anotují dva autorizovaní architekti nezávisle a měří se mezi-anotátorská shoda. Kde se neshodnou ani lidé, není správné, aby systém tvrdil jistotu.
- **Metriky po položkách:**
  - Přesnost zařazení parcely do plochy a podílů ploch, s tolerancí v m².
  - Přesnost binárních otázek (RD přípustné?).
  - Exact match numerických regulativů po normalizaci jednotek.
  - Recall limitů a ochranných pásem.
  - Přesnost citací (úryvek existuje a stránka sedí).
  - Míra abstence („nejisté, ověřit“).
  - Kalibrace jistoty: předpovězená jistota vs. skutečná chybovost.
- **Asymetrické náklady chyb.** Falešné „lze stavět“ nebo přehlédnutý limit je řádově horší než falešné „nejisté“. Prahy proto nastavit tak, aby chybovost kritických položek po lidské kontrole byla blízká nule. Uvažovaný cíl: recall limitů ≥ 99 %, a co nelze ověřit, jde k člověku.
- **Provozní validace:**
  - Regresní sada spuštěná při každé změně modelu, promptu nebo dat.
  - Průběžný náhodný audit hotových zpráv.
  - Taxonomie chyb (retrieval / OCR / interpretace / GIS / zastaralá data).
  - Evidence reklamací jako tvrdá metrika kvality.
- **Signály nejistoty:**
  - Neshoda dvou modelů nebo dvou běhů (self-consistency).
  - Neověřitelný citovaný úryvek.
  - Parcela v hraničním bufferu.
  - Podmíněně přípustné využití.
  - Dokument starší než poslední evidovaná změna ÚP.

### Gaps
- Veřejná česká referenční sada ani data o shodě architektů při výkladu ÚP neexistují (nebo jsem je nenašel).
- Literaturu o kalibraci jistoty LLM v právních a regulatorních extrakcích jsem kvůli limitu vyhledávání nehledal.

---

## 5. Jaká jsou právní rizika? (odpovědnost, profesní regulace, licence dat / PSI / HVD, GDPR, autorské právo k ÚP, AI Act)

### Takeaway
- **Odpovědnost.** Placená rešerše je odborná informace za úplatu, takže se uplatní § 2950 OZ a smluvní odpovědnost. Plošné disclaimery vůči spotřebitelům ani pro hrubou nedbalost nefungují. Klíčové je přesně vymezit předmět plnění (informativní podklad, ne úřední informace, závazné stanovisko ani projekt), zdroje a „stav k datu“, a mít pojištění odpovědnosti.
- **Autorizace.** Rešerše zřejmě není „vybranou činností ve výstavbě“, takže autorizace podle zákona 360/1992 Sb. se k ní pravděpodobně nevyžaduje. Nesmí se ale prezentovat jako projektová dokumentace, autorizovaný výstup ani znalecký posudek.
- **Autorské právo a data.** ÚP vydaný jako opatření obecné povahy je úřední dílo bez autorskoprávní ochrany. Údaje o vlastnících jsou osobní údaje.
- **AI Act.** Nástroj nespadá do přílohy III, není tedy vysoce rizikový. Relevantní jsou čl. 50 (transparentnost a strojové označení AI výstupů, použitelný od 2. 8. 2026) a čl. 4 (AI gramotnost).

### Cited Findings
**Odpovědnost za chybnou informaci:**
- **§ 2950 OZ (89/2012 Sb.).** Kdo se hlásí k určitému stavu nebo povolání jako odborník, nahradí škodu způsobenou neúplnou nebo nesprávnou informací nebo škodlivou radou danou za odměnu v záležitosti svého vědění nebo dovednosti. Jinak se hradí jen škoda způsobená informací nebo radou vědomě. — [OZ § 2950](https://www.zakonyprolidi.cz/cs/2012-89#p2950) **[NEOVĚŘENO V SESSION]**
- **§ 2898 OZ.** Nepřihlíží se k ujednání, které vylučuje nebo omezuje povinnost nahradit újmu na přirozených právech člověka nebo újmu způsobenou úmyslně či z hrubé nedbalosti. Totéž platí pro ujednání omezující náhradu újmy slabší strany. — [OZ § 2898](https://www.zakonyprolidi.cz/cs/2012-89#p2898) **[NEOVĚŘENO V SESSION]**
- **Spotřebitelské smlouvy.** Jsou zakázána ujednání, která odchylně od zákona vylučují nebo omezují práva spotřebitele z vadného plnění nebo na náhradu škody (§ 1813–1814 OZ). U B2C prodeje (stavebník RD) proto smluvní limitace odpovědnosti prakticky nefunguje. — [OZ § 1814](https://www.zakonyprolidi.cz/cs/2012-89#p1814) **[NEOVĚŘENO V SESSION]**
- **Nová směrnice o odpovědnosti za vadné výrobky (EU) 2024/2853.**
  - Software včetně AI systémů je „výrobek“.
  - Kryje smrt a újmu na zdraví, škodu na majetku a zničení nebo poškození dat, která nejsou používána k profesním účelům. **Čistou ekonomickou ztrátu nekryje** (např. koupi nezastavitelného pozemku).
  - Lhůta pro transpozici je 9. 12. 2026. — [Directive (EU) 2024/2853](https://eur-lex.europa.eu/eli/dir/2024/2853/oj) **[NEOVĚŘENO V SESSION]**
- **Směrnice o odpovědnosti za AI (AILD).** Komise ohlásila v pracovním programu na rok 2025 (únor 2025) stažení návrhu. Zvláštní AI režim odpovědnosti v EU tedy není a platí obecné národní právo. — [Commission work programme 2025](https://commission.europa.eu/strategy-and-policy/strategy-documents/commission-work-programme/commission-work-programme-2025_en) **[NEOVĚŘENO V SESSION]**

**Profesní regulace (ČKA / ČKAIT, zákon 360/1992 Sb.):**
- **Rozsah zákona.** Zákon upravuje postavení, práva a povinnosti autorizovaných architektů, inženýrů a techniků, udělování autorizace, komory a podmínky výkonu vybraných činností ve výstavbě. Autorizace v daném oboru opravňuje k výkonu vybraných činností. Podnikatelé podle jiných předpisů smějí vybrané činnosti vykonávat jen tehdy, zajišťují-li je autorizovanými osobami. — [360/1992 Sb. (epravo)](https://www.epravo.cz/top/zakony/sbirka-zakonu/sb/1992/360); [tzb-info](https://www.tzb-info.cz/pravni-predpisy/zakon-c-360-1992-sb-o-vykonu-povolani-autorizovanych-architektu-a-o-vykonu-povolani-autorizovanych-inzenyru-a-techniku-cinnych-ve-vystavbe) (dle souhrnu vyhledávání)
- **Novelizace.** Poslední novela uvedená ve výsledcích je zákon 284/2021 Sb., účinná od 1. 1. 2024. Pozdější novely jsem neověřil. — [dauc.cz – 360/1992 Sb.](https://www.dauc.cz/predpisy/2268/360-1992-sb); [epravo – 360/1992 Sb.](https://www.epravo.cz/top/zakony/sbirka-zakonu/sb/1992/360) (dle souhrnu vyhledávání; ze kterého z výsledků údaj pochází, není jasné)
- **Definice vybraných činností.** Podle starého stavebního zákona (§ 158 zák. 183/2006 Sb.) jsou vybranými činnostmi ty, jejichž výsledek ovlivňuje ochranu veřejných zájmů, a smějí je vykonávat jen fyzické osoby s autorizací podle 360/1992 Sb. — [diplomová práce (theses.cz)](https://theses.cz/id/wbcit5/Diplomova_prace.pdf) (dle souhrnu vyhledávání; mezi výsledky byla i [další diplomová práce](https://theses.cz/id/23ns8c/Klra_ubrtov_-_dipl._prce_Archive.pdf), kterou z nich souhrn citoval, není jisté). Že jde o projektovou činnost ve výstavbě a odborné vedení provádění stavby, je text § 158 SZ 183/2006 Sb. **[NEOVĚŘENO V SESSION]**; ekvivalentní ustanovení nového SZ 283/2021 Sb. také **[NEOVĚŘENO V SESSION]**
- **Znalecký posudek** je regulovaný výstup podle zákona 254/2019 Sb. o znalcích. Rešerše se tak nesmí označovat. — [zákon 254/2019 Sb.](https://www.zakonyprolidi.cz/cs/2019-254) **[NEOVĚŘENO V SESSION]**
- **Živnostenské oprávnění.** „Projektová činnost ve výstavbě“ je vázaná živnost navázaná na autorizaci. „Poradenská a konzultační činnost, zpracování odborných studií a posudků“ je obor volné živnosti. — [živnostenský zákon 455/1991 Sb.](https://www.zakonyprolidi.cz/cs/1991-455) **[NEOVĚŘENO V SESSION]**

**Autorské právo k územním plánům:**
- **§ 3 písm. a) autorského zákona (121/2000 Sb.).** Ochrana se nevztahuje na úřední dílo, jímž je mj. právní předpis, rozhodnutí, **opatření obecné povahy**, veřejná listina, a také na **úřední návrh úředního díla a jinou přípravnou úřední dokumentaci**. — [AZ 121/2000 Sb. (epravo)](https://www.epravo.cz/top/zakony/sbirka-zakonu/sb/2000/121) (dle souhrnu vyhledávání)
- **Forma ÚP.** Územní plán se vydává formou opatření obecné povahy podle správního řádu (§§ 171–174). — [epravo: ÚP podle starého SZ jako OOP](https://www.epravo.cz/top/clanky/uzemni-plan-podle-stareho-stavebniho-zakona-jako-opatreni-obecne-povahy-56044.html); [ZČU: Využití OOP při územním plánování](https://dspace5.zcu.cz/handle/11025/23924?locale=en) (dle souhrnu vyhledávání; přesné přiřazení k jednotlivým výsledkům není jisté). Pořizování ÚP jako OOP předpokládá i metodika [MMR – vedení spisu při pořizování OOP (2022)](https://www.mmr.cz/getmedia/ad7c8f97-6a98-4c3a-8f29-e71f191f071d/MMR_44549_2022_81-Vedeni-spisu-pri-porizovani-OOP-2022-07-26.pdf.aspx?ext=.pdf). Zachování formy OOP v novém SZ 283/2021 Sb. **[NEOVĚŘENO V SESSION]**
- **Odborný výklad.** Prezentace z Kartografického dne (Severa, 2009) uvádí „Územní plán je úřední dílo“. — [Severa (UP Olomouc)](https://kartografickyden.upol.cz/old/prezentace/3_rocnik/01-severa.pdf)
- **Komunitní výklad.** Diskuse OSM-CZ tvrdí, že ÚPD je z ochrany vyloučena jako úřední dílo, resp. jako přípravná úřední dokumentace. Tvrzení, že ji AZ jmenuje „výslovně“, je podle mě sporné, protože aktuální znění jmenuje OOP, ne ÚPD. — [OSM talk-cz 2011](https://lists.openstreetmap.org/pipermail/talk-cz/2011-December/006987.html); [OSM talk-cz 2018](https://lists.openstreetmap.org/pipermail/talk-cz/2018-April/018966.html)

**Opakované užití informací veřejného sektoru a HVD:**
- **Směrnice o otevřených datech (EU) 2019/1024, čl. 1 odst. 6.** Subjekty veřejného sektoru nesmějí uplatňovat zvláštní právo pořizovatele databáze tak, aby bránily opakovanému užití. — [Directive (EU) 2019/1024](https://eur-lex.europa.eu/eli/dir/2019/1024/oj) **[NEOVĚŘENO V SESSION]**. V ČR se transponuje do zákona 106/1999 Sb. — [106/1999 Sb.](https://www.zakonyprolidi.cz/cs/1999-106) **[NEOVĚŘENO V SESSION]**
- **Prováděcí nařízení (EU) 2023/138 (HVD), použitelné od 9. 6. 2024.**
  - Kategorie „geoprostorové údaje“ zahrnuje mj. katastrální parcely, budovy, adresy, správní jednotky a zeměpisná jména.
  - HVD musí být zdarma, strojově čitelné, přes API a hromadné stažení, pod CC BY 4.0 nebo méně restriktivní licencí. — [Implementing Regulation (EU) 2023/138](https://eur-lex.europa.eu/eli/reg_impl/2023/138/oj) **[NEOVĚŘENO V SESSION]**
- **Ověřený příklad licencování ČÚZK:** transformační a geoidové gridy jsou publikovány s „© ČÚZK“ pod CC BY 4.0. — [PROJ-data cz_cuzk](https://github.com/OSGeo/PROJ-data/tree/master/cz_cuzk)

**GDPR a údaje z listu vlastnictví:**
- **Veřejnost katastru.** Katastr je veřejný seznam a údaje z něj lze získat výpisem nebo nahlížením. — [zákon 256/2013 Sb. o katastru nemovitostí](https://www.zakonyprolidi.cz/cs/2013-256) **[NEOVĚŘENO V SESSION]**
- **GDPR i nad veřejnými daty:**
  - Právní titul: smlouva s klientem (čl. 6 odst. 1 písm. b), jde-li o jeho pozemek) nebo oprávněný zájem (písm. f) s balančním testem, např. u vlastníků sousedních pozemků.
  - Účelové omezení a minimalizace (čl. 5 odst. 1 písm. b, c).
  - Informační povinnost při získání údajů jinak než od subjektu (čl. 14). Výjimka pro nepřiměřené úsilí (čl. 14 odst. 5 písm. b) vyžaduje náhradní opatření, např. zveřejnění informací.
  - Zpracovatelská smlouva s dodavatelem LLM (čl. 28) a pravidla předávání do třetích zemí (kap. V). — [GDPR (EU) 2016/679](https://eur-lex.europa.eu/eli/reg/2016/679/oj) **[NEOVĚŘENO V SESSION]**

**EU AI Act (nařízení (EU) 2024/1689) a digitální omnibus:**
- **Omnibus, termíny podle sekundárních zdrojů:**
  - Přijatý text je nařízení (EU) 2026/1744.
  - Povinnosti pro samostatné vysoce rizikové systémy (příloha III) se posouvají na 2. 12. 2027, pro systémy podle přílohy I (regulované výrobky) na 2. 8. 2028.
  - Povinnosti transparentnosti podle čl. 50 se uplatňují od 2. 8. 2026. Pro strojově čitelné označení obsahu (čl. 50 odst. 2) platí odklad do 2. 12. 2026, ale jen pro systémy uvedené na trh před 2. 8. 2026. Nové systémy musí vyhovět ihned. — [AIActo](https://www.aiacto.eu/en/blog/digital-omnibus-ai-act-report-2027); [Jones Walker](https://www.joneswalker.com/en/insights/blogs/ai-law-blog/yes-august-2-still-matters-the-eu-approved-a-high-risk-ai-delay-but-most-trans.html); [Praxikon](https://www.praxikon.com/en/posts/digital-omnibus-high-risk-postponement-december-2027); [Cooley](https://cdp.cooley.com/digital-ai-omnibus-delays-key-deadlines-introduces-new-rules/); [Gibson Dunn](https://www.gibsondunn.com/eu-ai-act-omnibus-agreement-postponed-high-risk-deadlines-and-other-key-changes/) (dle souhrnu vyhledávání)
- **Rozpor mezi zdroji.** Část zdrojů popisuje omnibus jako dosud „provisional agreement“, jiné jako přijatý a účinný od 27. 7. 2026. Jeden snippet Usercentrics dokonce tvrdí, že AI Act „nebyl formálně odložen“, ale stejná stránka jinde odklad potvrzuje. — [Usercentrics](https://usercentrics.com/knowledge-hub/eu-ai-act-high-risk-delay-article-50-transparency-consent/); [Dastra](https://www.dastra.eu/en/blog/simpler-safer-stricter-where-it-counts-inside-the-eu-ai-omnibus-deal/60025); [Winston Taylor](https://www.winstontaylor.com/insights/ai-act-rules-on-high-risk-ai-delayed-as-ai-digital-omnibus-agreed)
- **Příloha III** vymezuje vysoce rizikové oblasti: biometrie, kritická infrastruktura, vzdělávání, zaměstnání, přístup k základním soukromým a veřejným službám (veřejné dávky, úvěruschopnost, ceny životního a zdravotního pojištění, tísňová volání), vymáhání práva, migrace a hranice, justice a demokratické procesy. Územní plánování ani informace o stavebních pozemcích tam nejsou. — [AI Act 2024/1689, příloha III](https://eur-lex.europa.eu/eli/reg/2024/1689/oj) **[NEOVĚŘENO V SESSION]**
- **Čl. 50 odst. 1 a 2.** Poskytovatel musí uživatele informovat, že komunikuje s AI systémem (např. chat nad ÚP), pokud to není zřejmé. Poskytovatelé systémů generujících syntetický text musí zajistit strojově čitelné označení výstupů. Výjimka platí pro asistivní funkci běžné editace nebo pro výstupy, které podstatně nemění vstup. — [AI Act čl. 50](https://eur-lex.europa.eu/eli/reg/2024/1689/oj) **[NEOVĚŘENO V SESSION]**
- **Čl. 50 odst. 4.** Povinnost uživatele označit AI text zveřejněný za účelem informování veřejnosti o věcech veřejného zájmu se nepoužije, pokud text prošel lidskou kontrolou a nese za něj redakční odpovědnost fyzická nebo právnická osoba. Individuální zpráva pro klienta zřejmě „zveřejněním“ není. — [AI Act čl. 50](https://eur-lex.europa.eu/eli/reg/2024/1689/oj) **[NEOVĚŘENO V SESSION]**
- **Čl. 4 (AI gramotnost, použitelný od 2. 2. 2025).** Poskytovatelé a uživatelé (deployeři) zajistí dostatečnou AI gramotnost svých pracovníků. — [AI Act čl. 4](https://eur-lex.europa.eu/eli/reg/2024/1689/oj) **[NEOVĚŘENO V SESSION]**
- **Povinnosti pro GPAI modely (čl. 53 an.)** nesou poskytovatelé modelů (Anthropic, OpenAI…). Integrátor se poskytovatelem GPAI modelu stává až při podstatné modifikaci; pokyny Komise (07/2025) uvádějí orientační práh více než 1/3 výpočetního objemu původního tréninku. — [Pokyny Komise ke GPAI](https://digital-strategy.ec.europa.eu/en/library/guidelines-scope-obligations-providers-general-purpose-ai-models-under-ai-act) **[NEOVĚŘENO V SESSION]**

### Inferences
- **Vymezení produktu a smlouvy (nejúčinnější nástroj).**
  - Rešerši vymezit jako „informativní podklad z veřejných zdrojů ke dni X“, který nenahrazuje informace a vyjádření úřadu územního plánování nebo stavebního úřadu, závazná stanoviska dotčených orgánů ani projektovou dokumentaci.
  - Vyjmenovat, co prověřeno nebylo: inženýrské sítě v terénu, geologie, nezapsaná věcná břemena, soukromoprávní omezení, budoucí změny ÚP.
  - U každého závěru uvádět stupeň jistoty a zdroj.
  - Doporučit kroky k oficiálnímu potvrzení (dotaz na úřad, předběžná informace).
  - Smysl: zúžit „co bylo slíbeno“. Limitace odpovědnosti vůči spotřebiteli i pro hrubou nedbalost (absence kontroly) by stejně neobstála.
- **B2B vs. B2C.** Prodej architektům a projektantům (B2B) umožňuje smluvní limitaci odpovědnosti, např. do výše ceny nebo pojistného plnění, s výhradou § 2898. Při prodeji stavebníkům (B2C) je třeba počítat s plnou odpovědností podle § 2950 a se spotřebitelskou ochranou. **Prodej přes architekty, kteří výstup sami ověří a převezmou, výrazně snižuje riziko.**
- **Autorizace.** Výstup by neměl obsahovat návrh stavby ani „posouzení souladu konkrétního projektu“, které by se blížily projektové činnosti. Pokud zprávu reviduje autorizovaný architekt, je vhodné, aby ji podepsal jako odborný konzultant v rámci svého oprávnění a pojištění. Dodavatel softwaru by neměl sám tvrdit „autorizovaný výstup“. Formální stanovisko ČKA k AI rešerším jsem nenašel, viz Gaps.
- **Pojištění.** Pojištění profesní odpovědnosti (IT, poradenství, „errors & omissions“) s krytím čisté finanční škody je pro tento model zásadní. PLD čistou ekonomickou škodu nekryje, takže hlavní expozice je smluvní a podle § 2950.
- **Audit trail jako obrana.** Uchovávat verze zdrojových dokumentů a vrstev, prompty, verzi modelu, výstup extrakce, záznam lidské kontroly a „stav dat k datu“. Při sporu to prokazuje odbornou péči a umožňuje rozlišit chybu zdroje od chyby zpracování.
- **Data:**
  - Text a výkresy ÚP vydaného jako OOP lze přebírat a strojově zpracovávat bez licence autora (úřední dílo). Opatrnost je na místě u podkladů, které OOP nejsou (územní studie, některé analýzy) a mohou být autorskými díly. Platí i podmínky jednotlivých portálů (rate limiting, zákaz scrapování) a licence podkladových map třetích stran (komerční mapové dlaždice nepoužívat bez licence).
  - Otevřená data ČÚZK pod CC BY 4.0 vyžadují uvedení zdroje ve zprávě.
- **GDPR v praxi:**
  - Jména vlastníků nevkládat do promptů LLM. Pracovat s pseudonymy nebo jen s typem vlastníka (fyzická / právnická osoba, SJM, podíly).
  - Jména zobrazit jen tam, kde to účel vyžaduje (např. seznam sousedů jako potenciálních účastníků řízení), a s krátkou retencí.
  - Vést záznamy o zpracování a balanční test.
  - Vybrat LLM dodavatele se zpracovatelskou smlouvou a EU zpracováním nebo s platným mechanismem předávání.
- **AI Act:**
  - Produkt je minimální či omezené riziko.
  - Praktické povinnosti: informace o AI v UI, strojové označení AI generovaného textu ve výstupu (metadata PDF / content credentials) od 2. 8. 2026, resp. do 2. 12. 2026 u systému uvedeného na trh dříve.
  - Interní AI gramotnost (školení recenzentů).
  - Netvrdit „AI rozhodne o zastavitelnosti“.
  - Pokud by nástroj začal používat stavební úřad k rozhodování, posoudit klasifikaci znovu.

### Gaps
- Oficiální stanovisko ČKA nebo ČKAIT k AI rešerším a k tomu, zda je „rešerše pozemku“ činností vyhrazenou autorizovaným osobám, jsem nenašel (vyčerpaný limit vyhledávání). Totéž platí pro aktuální znění § 17–18 zákona 360/1992 Sb. (rozsah oprávnění včetně poradenství) a pro číslo ustanovení o vybraných činnostech v novém SZ 283/2021 Sb.
- Judikatura NS k § 2950 OZ u placených informačních posudků není rešeršovaná.
- Nevím, zda HVD kategorie zahrnují i plánované využití území (INSPIRE téma Land use, tedy ÚP). Neověřeno, proto netvrdím.
- Stanoviska ÚOOÚ k obchodnímu užití údajů o vlastnících z KN a aktuální podmínky dálkového přístupu ČÚZK k nakládání s údaji nejsou ověřené.
- Povinné pojištění autorizovaných osob podle 360/1992 Sb. a skupinové pojištění ČKA (limity), stejně jako tržní ceny pojištění profesní odpovědnosti pro takový startup, nejsou ověřené.
- Stav české transpozice PLD 2024/2853 neznám.
- Nevím, zda omnibus 2026/1744 změnil čl. 4 (AI gramotnost). Návrh z 11/2025 ji měl oslabit; finální znění jsem neověřil. Status kodexu praxe k označování AI obsahu (čl. 50) také neznám.
- Autorskoprávní status územních studií a dalších územně plánovacích podkladů (nejsou OOP) jsem neověřil.

---

## 6. Jaké jsou náklady a pracnost? (tokeny LLM, GIS hosting, data, tým, harmonogram MVP)

### Takeaway
LLM tokeny nebudou hlavní nákladovou položkou. Při cenách z 10/2026 (Claude Sonnet 5.5 $2 / $10, Opus 5.5 $4 / $20 za milion tokenů vstup / výstup; Batch −50 %; čtení z cache zhruba 0,1×) vychází syntéza jedné zprávy řádově na $0,2–1. Jednorázová extrakce regulativů jedné obce a verze ÚP vychází na řádově $1–3. NREL v roce 2024 uváděl $700–1 000 za 85 okresů včetně vyhledání dokumentů. Dominantní náklady budou:
- lidská kontrola architektem,
- pořízení a údržba dat (zejména rastrové ÚP a změny),
- placené údaje z KN,
- právní a pojistné náklady.

Realistické MVP vychází na 3–5 lidí po 4–6 měsíců pro pilotní region. Jde o odhad bez ověřených srovnání startupů.

### Cited Findings
**Ceny LLM (10/2026):**
- **Anthropic (first-party API, cache k 6. 10. 2026), vstup / výstup za milion tokenů:**
  - Claude Opus 5.5: $4 / $20.
  - Claude Sonnet 5.5: $2 / $10.
  - Claude Haiku 5.5: $0,10 / $0,50 pro prompty do 100k tokenů, nad 100k $0,50 / $2,50.
  - Claude Fable 5.1 (nejvýkonnější): $10 / $50.
  - Opus 5.5 a Sonnet 5.5 mají 1M kontext a 128k výstup.
  - Čtení z cache u Opus 5.5 je $0,20. Batch API běží za 50 % ceny. — [Anthropic pricing](https://platform.claude.com/docs/en/about-claude/pricing); [Models overview](https://platform.claude.com/docs/en/about-claude/models/overview) (přes referenční skill Claude API)
- **Křížová kontrola v komunitním ceníku LiteLLM (stav repozitáře k 28. 10. 2026):**
  - Opus 5.5: Batch $2 / $10, zápis do cache $5, čtení $0,20.
  - Sonnet 5.5: Batch $1 / $5, zápis do cache $2,50.
  - Haiku 5.5: Batch $0,05 / $0,25, čtení z cache $0,01.
  - **Rozpor:** LiteLLM uvádí čtení z cache u Sonnet 5.5 za $0,10, skill Anthropic za $0,20. Platí zdroj Anthropic. — [LiteLLM model_prices_and_context_window.json](https://github.com/BerriAI/litellm/blob/main/model_prices_and_context_window.json)
- **OpenAI, Google, Mistral (komunitní ceník LiteLLM, nutno ověřit na stránkách dodavatelů), vstup / výstup za milion tokenů:**
  - gpt-5.6: $4 / $20 (Batch $2 / $10).
  - gpt-5.5: $5 / $30.
  - gpt-5.4: $2,50 / $15.
  - gpt-5.4-mini: $0,75 / $4,50.
  - gpt-5-mini: $0,25 / $2.
  - gpt-5: $1,25 / $10.
  - gemini-3.1-pro-preview: $2 / $12.
  - gemini-2.5-pro: $1,25 / $10.
  - gemini-2.5-flash: $0,30 / $2,50.
  - mistral-large-latest: $0,50 / $1,50. — [LiteLLM ceník](https://github.com/BerriAI/litellm/blob/main/model_prices_and_context_window.json)
- **Precedent nákladů extrakce.** NREL ELM: celý ukázkový běh přes 85 okresů (vyhledání, stažení a extrakce vyhlášek přes Azure OpenAI) „can cost $700–$1000 in API calls“, tj. zhruba $8–12 na okres při cenách 2024. — [ELM ordinance_gpt README](https://github.com/NREL/elm/blob/main/examples/ordinance_gpt/README.rst)
- **Další náklady.** zoning-gpt upozorňuje i na náklady OCR (AWS Textract) vedle nákladů na OpenAI. — [zoning-gpt](https://github.com/National-Zoning-Atlas/zoning-gpt)
- **Kapacita vstupu.** Claude přijímá PDF přímo, až 600 stran nebo 32 MB na požadavek, takže u textových PDF odpadá samostatné OCR. — [Anthropic docs](https://platform.claude.com/docs/en/about-claude/models/overview) (přes referenční skill Claude API)

### Inferences
**Modelový výpočet tokenů na jednu zprávu.** Vše jsou odhady; předpoklady jsou uvedené v prvním sloupci.

| Krok | Předpoklad | Sonnet 5.5 | Opus 5.5 |
|---|---|---|---|
| Kontext obce z cache (schválené regulativy, relevantní kapitoly ÚP, obecné požadavky) | 40k tokenů × čtení z cache $0,20/M | $0,008 | $0,008 |
| Data parcely (JSON průniku, limity, KN pseudonymizovaně) a 5 výřezů map (~1,5k tokenů na obrázek) | ~27,5k čerstvých vstupních tokenů | $0,055 | $0,11 |
| Výstup včetně uvažování (thinking) | ~15k tokenů | $0,15 | $0,30 |
| Zápis do cache při nízkém provozu (může připadnout na každou zprávu) | 40k × 1,25× | +$0,10 | +$0,20 |
| Kontrolní běh druhým modelem | ~1 běh Sonnet | +$0,2 | +$0,2 |
| **Celkem za zprávu** (dolní mez bez zápisu do cache a bez kontrolního běhu) | | **≈ $0,2–0,5** | **≈ $0,4–0,8** |

- **Extrakce za obec a verzi ÚP (offline, Batch):** při ~300k vstupních a ~40k výstupních tokenů na Opus 5.5 Batch ≈ $0,6 + $0,4 ≈ $1. Při trojnásobné redundanci kvůli self-consistency ≈ $3.
- **Plošné pokrytí republiky:** při řádově 6 250 obcích (počet neověřen v session) jednorázově ≈ $6–20 tis., plus průběžné přepočty změn. Řádově to sedí s precedentem NREL po korekci na nižší ceny v roce 2026.
- **Opravdové náklady na zprávu:**
  - Lidská kontrola: v MVP 30–60 min autorizovaného architekta na zprávu (odhad; sazby jsem nezjišťoval, ty mají výzkumníci trhu), plus jednorázové schválení extrakce každé obce (1–3 h podle složitosti ÚP).
  - Data z KN (výpisy LV a údaje přes dálkový přístup) jen tam, kde jsou nutné. Preferovat otevřená data (HVD).
  - Rastrové ÚP: georeferencování a kontrola vlícovacích bodů může být nejdražší jednorázová položka za obec (desítky minut až hodiny GIS práce).
- **GIS hosting (řádový odhad, neověřený cenami poskytovatelů):**
  - PostGIS a aplikační server (pygeoapi / QGIS Server / vlastní API) na 1–2 VM se 4–8 vCPU a 16–32 GB RAM.
  - Objektové úložiště pro rastry a PDF ÚP. Pro celou ČR to mohou být jednotky TB, pokud se archivují všechny verze.
  - Pro MVP řádově desítky až nízké stovky EUR měsíčně. Náklady rostou hlavně s archivací verzí a s výpočtem georeferencování a vektorizace, ne s počtem zpráv.
- **Tým MVP (odhad):**
  - GIS / datový inženýr (PostGIS, GDAL, OGC služby, S-JTSK, harvest a verzování), 1 FTE.
  - LLM / ML inženýr (extrakční pipeline, schémata, evaluace, regresní sady), 1 FTE.
  - Full-stack vývojář (objednávka, platby, generování PDF zprávy, workflow recenze), 1 FTE.
  - Autorizovaný architekt jako doménový lead, recenzent a autor anotací zlaté sady, 0,5–1 FTE.
  - Externě: právník (smluvní dokumentace, GDPR, AI Act) a pojišťovací makléř.
  - Celkem 3,5–5 FTE.
- **Harmonogram (odhad):**
  - Fáze 0 (4–6 týdnů): právní a datový audit, výběr pilotního regionu (ideálně obce s vektorovým ÚP), zlatá sada.
  - Fáze 1 (3–4 měsíce): MVP pro vektorové ÚP s plnou lidskou kontrolou každé zprávy.
  - Fáze 2 (3–6 měsíců): poloautomatická pipeline pro rastrové a PDF ÚP, monitoring změn, výběrová kontrola podle prahů jistoty.
- **Nejlevnější páka kvality i nákladů:** vhodně zúžený rozsah MVP. Například jen RD, jen obce s vektorovým ÚP, výstup typu „semafor + důvody + citace + doporučené dotazy na úřad“ místo verdiktu „lze stavět“.

### Gaps
- Aktuální poplatky ČÚZK za dálkový přístup a WSDP v roce 2026 (výpis z LV, informace o parcele; vyhláška 358/2013 Sb. a ceník) nejsou ověřené. Data nejsou ani v této rešerši, ani v dostupných zdrojích.
- Ceny GIS hostingu (např. Hetzner, OVH, AWS RDS s PostGIS) jsem nenačetl. Uvedené částky jsou jen řádové odhady.
- Personální obsazení srovnatelných startupů v době MVP (Archistar, Zoneomics, Symbium, LandTech/LandInsight, Searchland, Spacemaker) jsem kvůli vyčerpanému limitu vyhledávání nerešeršoval.
- Hodinové sazby autorizovaných architektů (rozhodující pro cenu recenze) nejsou zjištěné; patří do rešerše trhu.
- Ceny OpenAI, Google a Mistral pocházejí z komunitního ceníku LiteLLM, ne přímo z ceníků dodavatelů. Ceníky dodavatelů jsem nenačetl.
