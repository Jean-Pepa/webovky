# Jak naučit AI vlastní architektonický styl (stav k 10/2026; malé studio, notebook RTX 4080 Laptop 12 GB VRAM / 32 GB RAM, volitelně cloud GPU)

> **Metodická poznámka pro autora zprávy.** Síťová politika této session blokovala přímé stahování stránek (nedostupné mj. ribaj.com, allplan.com, bimplus.co.uk, parametric-architecture.com, arxiv.org, huggingface.co, papers.cumincad.org, aecmag.com, zakonyprolidi.cz). Zjištění s neoznačeným odkazem proto pocházejí ze **souhrnů vyhledávače (WebSearch) nad uvedenými stránkami**. Citace v uvozovkách jsou tedy „dle souhrnu", ne ověřené proti plnému textu. V polovině rešerše se navíc vyčerpal sdílený limit vyhledávání. Komerční nástroje (Finch3D, Hypar, Snaptrude, TestFit, Higharc), judikatura a studie o stylu psaní proto nebyly dohledány online (viz Gaps). **Položky označené † jsou kanonické zdroje** (primární články, texty předpisů, README repozitářů, karty modelů) citované z obecné znalosti. V této session nebyly otevřeny a před publikací je dobré je ověřit.

## 1. Z čeho se skládá „styl" architekta a kterou AI technikou lze kterou složku zachytit?

### Takeaway
„Styl" není jedna věc. Vizuální jazyk (prezentace, materiály, atmosféra) se dnes dá z vlastních obrázků naučit dobře pomocí LoRA. Dispoziční, hmotovou a konstrukční logiku ale z 20–100 projektů natrénovat nelze. Tu je třeba zachytit explicitně (pravidla, parametrické šablony, knihovny detailů) a doplnit vyhledáváním ve vlastním archivu (retrieval). Velké kanceláře to veřejně dělají právě takto odděleně: LoRA na obraz, analytika a pravidla na dispozice.

### Cited Findings
- MVRDV po tréninku na letech vlastní práce popisuje, že model zachytil opakující se atmosférické vzorce, barevné vztahy a kompoziční tendence studia. V prvním testu na obrazech projektu Valley model věrně opakoval materialitu a tvar projektu — [Parametric Architecture](https://parametric-architecture.com/ai-mvrdv-architectural-representation/)
- ZHA rozkládá vizuální styl na „fasety" a trénuje oddělené LoRA pro exteriéry, master plány, interiéry a grafiku — [Allplan blog](https://www.allplan.com/blog/ai-in-practice-at-zaha-hadid-architects/); [Novatr](https://www.novatr.com/blog/find-out-how-zaha-hadid-architects-built-winner-proposals-with-ai)
- ZHA používá AI i mimo obraz: analytická skupina generovala varianty polohy jádra budovy Infinitus Plaza v Guangzhou — [Archinect](https://archinect.com/news/article/150353676/zaha-hadid-architects-on-using-ai-in-workplace-design)
- BIG popisuje vlastní proces jako rozklad rozhodnutí do diagramů. Ingels: „we break [design decisions] down to diagrams" — [Dezeen 2014](https://www.dezeen.com/2014/07/10/movie-interview-bjarke-ingels-big-designing-with-diagrams/)
- Podle sekundárního komentáře BIG po experimentech s Midjourney (2021–2022) zjistilo, že „just beautiful images" nestačí, protože návrh musí splnit prostorové proporce a statické podmínky. Přešlo proto na řízený workflow, kde obrysy z Rhina slouží jako podklad a AI dodá texturu a světlo — [note.com / XENCE](https://note.com/xence/n/n3941e61f7737?hl=en) (komentář třetí strany, ne vyjádření BIG)
- Heatherwick Studio: Pablo Zamorano (head of geometry and computational design) rozvíjí sochařské tvarosloví studia kombinací AI/ML, Rhina, Revitu a vlastních pluginů pro BIM a vizualizaci — [PA Talks 71](https://parametric-architecture.com/pa-talks-71-pablo-zamorano-heatherwick-studio/)
- Dispoziční zvyklosti jsou regionální. ResPlan (17 000 půdorysů) uvádí, že všechny plány pocházejí z jihoasijského trhu a jejich dispoziční konvence nejsou reprezentativní pro jiné regiony — [ResPlan, GitHub](https://github.com/m-agour/ResPlan)

### Inferences
Syntéza: mapa složek stylu na techniky (počty jsou orientační; zdroje čísel jsou v sekcích 2–7).

| Složka stylu | Co to v praxi je | Nejvhodnější technika | Data potřebná (orientačně) | Realismus pro malé studio |
|---|---|---|---|---|
| Hmota a tvarosloví | proporce, střechy, členění fasád, typické tvary, vztah k terénu | parametrické šablony (Grasshopper/Dynamo) + pravidla + retrieval vlastních modelů; LoRA jen pro 2D „vzhled" | pravidla odvozená z 10–30 projektů | vysoký (pravidla), střední (LoRA) |
| Dispozice a prostorová organizace | vazby místností, orientace, rozměry, jádra, komunikace | psaná pravidla + vlastní půdorysy jako příklady (few-shot/retrieval) + LLM/grafový generátor + automatická kontrola | 20–100 půdorysů pro retrieval; trénink generátoru 1k–10k+ | střední; vlastní trénink nízký |
| Materiály | paleta, textury, kombinace, typické výrobky | LoRA (vizuálně) + strukturovaná knihovna materiálů a specifikací | 15–40 obrázků na fasetu; seznam specifikací | vysoký |
| Detaily a skladby | typické detaily, skladby konstrukcí, napojení | knihovna standardních detailů (DWG/RVT) + retrieval + checklisty; generativní AI zde nespolehlivá | celý archiv detailů | vysoký (retrieval), nízký (generování) |
| Vizuální prezentace | render, koláž, diagram, skica, grafika portfolia | LoRA na každou fasetu + ControlNet z vlastního 3D + IP-Adapter / style reference | 5–40 kurátorovaných obrázků na fasetu | vysoký (nejzralejší oblast) |
| Psaní | technické a průvodní zprávy, soutěžní a portfoliové texty | stylová příručka + few-shot + RAG nad vlastními texty; fine-tune až při 50–100+ párech | 3–10 vzorů; 50–100+ pro fine-tune | vysoký |

- Pořadí podle poměru přínos/náklady pro malé studio: (1) knihovna vlastních precedentů s vyhledáváním, (2) stylová LoRA pro vizualizace + ControlNet, (3) psaná „design DNA" (pravidla + šablony), (4) styl psaní přes příručku a vzory, (5) logování rozhodnutí pro budoucí učení z preferencí. Vlastní generátor dispozic až na konec, a spíš vůbec ne.

### Gaps
- Nenašel jsem akademickou práci, která by „styl architekta" systematicky rozkládala na složky a měřila, kterou z nich která metoda zachytí. Rozklad výše je syntéza.
- Generování 3D hmot nebo BIM ve stylu konkrétního autora (text-to-3D, mesh a BIM generátory) nebylo v této rešerši pokryto.

## 2. Vizuální styl: LoRA / DreamBooth na vlastních renderech a fotkách, ControlNet pro zachování geometrie, počet obrázků, úskalí a které kanceláře to veřejně dělají

### Takeaway
Vizuální styl je nejzralejší oblast. LoRA nad open-source modelem (SDXL, FLUX, Qwen-Image), natrénovaná na jednotkách až desítkách pečlivě vybraných vlastních obrázků na jednu „fasetu" stylu a použitá s ControlNetem z vlastního 3D modelu, je postup, který veřejně popisují ZHA, MVRDV a Henning Larsen. Kvalita a právní čistota datasetu (jen vlastní a licencované obrázky) je důležitější než jeho velikost. LoRA se naučí „jazyk zobrazení" (světlo, materiály, kompozici, grafiku), ne architektonickou logiku. U KPF, SOM a BIG jsem vlastní natrénovaný model nedoložil.

### Cited Findings
**Technika**
- LoRA zmrazí váhy předtrénovaného modelu a trénuje jen malé nízkohodnostní (low-rank) matice vložené do vrstev. Trénink je proto levný a výsledný soubor malý — [Hu et al., LoRA †](https://arxiv.org/abs/2106.09685)
- DreamBooth personalizuje text-to-image model z „just a few images" (typicky 3–5) konkrétního subjektu. Proti přeučení a „language drift" zavádí class-specific prior preservation loss — [Ruiz et al., DreamBooth †](https://arxiv.org/abs/2208.12242). Textual Inversion se učí nový „pojem" z 3–5 obrázků bez změny vah modelu — [Gal et al. †](https://arxiv.org/abs/2208.01618)
- ControlNet přidává k předtrénovanému difuznímu modelu prostorové podmínění (hrany, hloubka, segmentace, póza), takže geometrii určuje vstupní kresba nebo hloubková mapa — [Zhang et al., ControlNet †](https://arxiv.org/abs/2302.05543). Verze 1.1 obsahuje mj. Canny, Depth, Normal, MLSD (přímé čáry, vhodné pro architekturu), Lineart a Seg — [ControlNet 1.1 †](https://github.com/lllyasviel/ControlNet-v1-1-nightly)
- IP-Adapter umožňuje použít obrázek jako „prompt" (např. referenci stylu) s adaptérem o 22M parametrech, bez dotrénování základního modelu — [Ye et al., IP-Adapter †](https://arxiv.org/abs/2308.06721)
- Stejný princip je už vestavěný v BIM softwaru: Archicad AI Visualizer běží na Stable Diffusion — [ArchDaily katalog](https://www.archdaily.com/catalog/us/products/34767/3d-visualization-archicad-ai-visualizer-graphisoft)

**Kolik obrázků (praktická a akademická data)**
- IAAC: tým sestavil 60 obrázků z předních vizualizačních studií a první pokus s DreamBooth selhal. Po návratu k literatuře zjistili, že obrázků je potřeba mnohem méně, a natrénovali Flux LoRA na 5 a 9 obrázcích. Závěr: úzce kurátorovaný set 5–9 kvalitních obrázků překonal větší, zašuměné sady. Pozor, šlo o obrázky cizích studií, ne o vlastní portfolio — [IAAC blog](https://blog.iaac.net/faster-architectural-workflows-with-generative-ai-from-text-prompts-to-custom-loras/)
- eCAADe 2025: dotrénování Stable Diffusion XL pomocí LoRA na vlastním datasetu moderních komerčních a rezidenčních budov pro generování fasád — [CumInCAD, eCAADe 2025](https://papers.cumincad.org/data/works/att/ecaade2025_262.pdf)
- Návod k LoRA pro Qwen-Image (web třetí strany, ne oficiální stránka Qwen) uvádí typicky 10–20 obrázků. Jako případ užití výslovně jmenuje „portfolio of architectural renders" pro zachycení kvality materiálů a práce se světlem — [qwenimage-2.com](https://qwenimage-2.com/blog/qwen-image-lora-training)
- Existují kurzy přímo pro architekty, jak z vlastní práce postavit style LoRA (výběr obrázků, trigger words, platformy) — [June Chow, Gumroad](https://arjunechow.gumroad.com/l/lora). Komunitní architektonické LoRA (např. LAN_Architecture_Visualization na SD 1.5) jsou veřejně na Civitai — [Civitai](https://civitai.com/models/143926/lanarchitecturevisualization)

**Kanceláře: co veřejně uvádějí (ověření tvrzení)**
- **Zaha Hadid Architects: ANO, potvrzeno.** ZHA staví na Stable Diffusion a pro každý nový projekt trénuje LoRA z vlastní obrazové banky. Výpočetní tým popisuje LoRA pro exteriéry, master plány, interiéry a grafiku; trénink jedné trvá 45 min až 1,5 h — [Allplan blog](https://www.allplan.com/blog/ai-in-practice-at-zaha-hadid-architects/); [Novatr](https://www.novatr.com/blog/find-out-how-zaha-hadid-architects-built-winner-proposals-with-ai)
- Patrik Schumacher: firma „kalibruje" Stable Diffusion vlastními datasety projektových obrázků a modely běží na vlastní server farmě. Zároveň tvrdí, že „huge general purpose systems have gobbled up more images from ZHA than from any other architect" (dle souhrnu), a sám upozorňuje, že jeho popis může rychle zastarat — [RIBAJ](https://www.ribaj.com/intelligence/patrik-schumacher-ai-opportunity/)
- V roce 2023 ZHA veřejně používala i obecné nástroje (obrázek ZHA vytvořený v DALL-E 2) — [Dezeen 2023](https://www.dezeen.com/2023/08/30/patrik-schumacher-zaha-hadid-ai-opinion-aitopia/amp/). Na Autodesk University 2024 měla přednášku „Tectonics via AI at Zaha Hadid Architects" — [Autodesk University](https://autodesk.com/autodesk-university/ru/class/Tectonics-via-AI-at-Zaha-Hadid-Architects-2024)
- HP (dodavatel pracovních stanic) v case study uvádí desetinásobné zrychlení raných iterací. Jde o interní analýzu firmy v marketingovém materiálu dodavatele — [HP case study](https://www.hp.com/in-en/workstations/learning-hub/zaha-hadid-architects.html)
- **MVRDV: ANO (jediný sekundární zdroj).** Studio začalo místo generických modelů trénovat vlastní modely na vlastní práci. První proof-of-concept vznikl na obrazech projektu Valley. Studio buduje knihovnu MVRDV LoRA včetně stylu „Collage"; technické detaily (velikost datasetu, základní model) zdroj neuvádí — [Parametric Architecture](https://parametric-architecture.com/ai-mvrdv-architectural-representation/)
- Archivní práce MVRDV předchází generativní AI. Strojové učení (nástroj Rethmanna) bylo trénováno na digitálním archivu MVRDV s více než 300 000 obrázky a vizualizacemi. „MVRDV Cloud" (výstava MVRDVHNI, 2021) mapuje archiv pomocí počítačového vidění a metadat — [Het Nieuwe Instituut, MVRDVHNI tools](https://nieuweinstituut.nl/en/projects/mvrdvhni/tools); [mvrdvhni.hetnieuweinstituut.nl](https://mvrdvhni.hetnieuweinstituut.nl/en/tools). K datům a AI viz také rozhovor s Leo Stuckardtem (MVRDV NEXT) — [MVRDV Stack](https://mvrdv.com/stack-magazine/4425/leo-stuckardt-mvrdv-next-data-ai-metaverse-technology)
- **Henning Larsen: ANO.** Ve spolupráci s Krea trénuje vlastní styly a LoRA výhradně z materiálu, který kurátoruje a vlastní, aby se vyhnulo plagiátorství a problémům s duševním vlastnictvím: „We create our own styles and train our own LoRAs, and we do so on a strict principle: we do not train on or reference other people's work." Zdroj neupřesňuje, zda jde o archiv minulých projektů — [Architizer: Speaking in Images](https://architizer.com/blog/practice/tools/speaking-in-images-krea-henning-larsen/); [Architizer: A New Dawn](https://architizer.com/blog/practice/tools/henning-larsen-krea-ai/). Krea má i vzdělávací program pro architekturu — [Krea Education](https://www.krea.ai/education/ai-for-architecture)
- **Coop Himmelb(l)au: ANO (výzkumný projekt).** DeepHimmelb(l)au (od roku 2017; Wolf D. Prix, Karolin Schmidbaur, Daniel Bolojan) zkoumá, zda AI dokáže interpretovat a generovat nové obrazy budov inspirované projekty kanceláře. Témata: representation learning, domain transfer, cloud augmentation — [coop-himmelblau.at, method](https://coop-himmelblau.at/method/deep-himmelblau); [coop-himmelblau.at, research](https://coop-himmelblau.at/research/deep-himmelblau). Projekt stojí na tréninku na digitalizovaných obrazových bankách — [IEREK ARChive](https://press.ierek.com/index.php/ARChive/article/download/1239/1414/7268). Partner Alexander Ott uvádí „diffusion node" trénovaný na proprietárním obrazovém a textovém datasetu (slabý zdroj, LinkedIn) — [LinkedIn A. Ott](https://at.linkedin.com/in/alexander-ott-278800b). Bolojanovi se připisuje velká část práce s neuronovými sítěmi — [parametricism.com](https://parametricism.com/daniel-bolojan)
- **Foster + Partners: in-house nástroje ANO, trénink na vlastním archivu NEPOTVRZEN.** Skupina Applied R+D (vede ji Martha Tsigkari) postavila vlastní variantu difuzních modelů a plugin nad lokálně hostovaným Stable Diffusion. Tsigkari: „if you do ideation through the applications that are available online, you lose IP and copyright", proto „systems to do ideation in-house with systems hosted on our own servers". Skupina má 24 lidí a vlastní vyhledávací aplikaci nad LLM — [BIMplus](https://bimplus.co.uk/foster-partners-rd-taking-ai-and-digital-twins-to-the-next-stage). Kolaborativní aplikace nad Stable Diffusion umožňuje více lidem sdílet prompty a výsledky a běží na vlastních serverech — [AECbytes, WA100 Live 2024](https://aecbytes.com/newsletter/2024/issue_130.html). Na jakých datech je model trénován, zdroje neuvádějí.
- **Heatherwick Studio: in-house systémy ANO, detaily tréninku NEZNÁMÉ.** Dezeen (srpen 2026) řadí studio mezi ty, které AI aktivně podporují. Studio vytvořilo pravidla pro AI poté, co pracovní skupina zvážila rizika a příležitosti. Patří mezi „more than half" studií s in-house systémy (spolu s Foster + Partners a Hassell) — [Dezeen 2026](https://www.dezeen.com/2026/08/25/architecture-studios-encouraging-ai-feature/). Text-to-image používá hlavně ke srovnání raných konceptů a pro inspiraci. Studio testovalo Stable Diffusion na vlastních skicách, postup ale nebyl přístupný všem v týmu — [AEC+Tech](https://www.aecplustech.com/blog/technology-implementation-stories-dpr-construction-heatherwick-studio-aecom)
- **KPF: vlastní natrénovaný model NEPOTVRZEN.** Computational designer KPF na akci ULI New York uvedl, že firma směřuje k vlastním in-house generativním nástrojům. Dělbu práce popsal tak, že lidé rozpoznávají krásu a počítače iterují a počítají (parafráze) — [KPF news](https://www.kpf.com/news/joe-brennan-showcases-a-practitioners-toolbox-with-uli-new-york). Vizualizační tým používá komerční Runway — [KPF news](https://www.kpf.com/news/andy-christoforou-shares-how-kpf-is-using-ai-to-create-impactful-visuals-with-runway), dále D5 Render AI (sponzorovaný obsah) — [ArchDaily](https://www.archdaily.com/1020298). Platforma Scout od KPF Urban Interface je datová a analytická, ne obrazová — [KPF Scout](https://www.kpf.com/story/from-complexity-to-clarity-scout)
- **SOM: NEPOTVRZENO.** Vyhledávání nenašlo žádný zdroj o vlastním obrazovém modelu SOM. SOM je doloženo jen jako jedno z 26 studií v anketě Dezeenu o AI — [Dezeen 2026](https://www.dezeen.com/2026/08/25/architecture-studios-encouraging-ai-feature/)
- **BIG: NEPOTVRZENO.** Doloženy jsou jen sekundární zmínky o experimentech s Midjourney (2021–2022) a o řízeném workflow Rhino → AI — [note.com / XENCE](https://note.com/xence/n/n3941e61f7737?hl=en)
- **Plošně:** z 26 studií oslovených Dezeenem jich 25 AI nejen používá, ale aktivně podporuje (mj. ZHA, Heatherwick, HOK, OMA, Morphogenesis, Snøhetta, MAD). HOK ji používá v rané fázi návrhu pod celofiremními pravidly, Gensler je zmíněn mezi firmami s in-house systémy. CF Møller je opatrnější: „We are encouraging them to use it, but thoughtfully" — [Dezeen 2026](https://www.dezeen.com/2026/08/25/architecture-studios-encouraging-ai-feature/)

**Úskalí**
- Prolínání cizích stylů: obecné modely znají styly slavných architektů. Midlibrary např. katalogizuje „Bjarke Ingels" jako styl v Midjourney — [Midlibrary](https://midlibrary.io/styles/bjarke-ingels). Schumacher sám uvádí, že velké modely pohltily víc obrázků ZHA než kteréhokoli jiného architekta — [RIBAJ](https://www.ribaj.com/intelligence/patrik-schumacher-ai-opportunity/)
- Přeučení: velký, zašuměný dataset (60 obrázků) v pokusu IAAC selhal, malý kurátorovaný fungoval — [IAAC blog](https://blog.iaac.net/faster-architectural-workflows-with-generative-ai-from-text-prompts-to-custom-loras/). Mechanismus proti přeučení a „language drift" popisuje DreamBooth — [DreamBooth †](https://arxiv.org/abs/2208.12242)
- Data cizích autorů: IAAC trénoval na obrázcích cizích vizualizačních studií, přesně tomu se Henning Larsen výslovně vyhýbá — [IAAC blog](https://blog.iaac.net/faster-architectural-workflows-with-generative-ai-from-text-prompts-to-custom-loras/); [Architizer](https://architizer.com/blog/practice/tools/speaking-in-images-krea-henning-larsen/)

**Hardware a licence základních modelů (pro 12 GB VRAM)**
- FluxGym (webové UI nad kohya sd-scripts) uvádí podporu 12/16/20 GB VRAM pro trénink FLUX LoRA — [FluxGym †](https://github.com/cocktailpeanut/fluxgym). Ostris ai-toolkit uváděl pro trénink FLUX.1 nejméně 24 GB VRAM — [ai-toolkit †](https://github.com/ostris/ai-toolkit). kohya sd-scripts je standard pro LoRA na SD 1.5 a SDXL — [kohya-ss/sd-scripts †](https://github.com/kohya-ss/sd-scripts)
- Licence základních modelů: FLUX.1 [dev] je pod „FLUX.1 [dev] Non-Commercial License" — [HF †](https://huggingface.co/black-forest-labs/FLUX.1-dev). FLUX.1 [schnell] je pod Apache-2.0 — [HF †](https://huggingface.co/black-forest-labs/FLUX.1-schnell). SDXL je pod CreativeML Open RAIL++-M — [HF †](https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0). Qwen-Image (20B MMDiT) je pod Apache-2.0 — [HF †](https://huggingface.co/Qwen/Qwen-Image)

### Inferences
- **Doporučený postup pro malé studio:**
  1. Rozdělit styl na fasety jako ZHA (fotorealistický exteriér, interiér, koláž/diagram, skica) a každou trénovat jako samostatnou LoRA. Na fasetu 15–40 obrázků z co nejvíce různých projektů (ideálně ≥ 5), aby se model nenaučil jednu konkrétní budovu.
  2. Popisky obrázků (captions) mají popisovat obsah (typ stavby, pohled, počasí, zeleň, lidi), ne styl. Styl nese trigger slovo, aby se v promptu dal zapínat a vypínat.
  3. Základní model: SDXL jde trénovat lokálně a má permisivní licenci. FLUX.1 [dev] je kvalitnější, ale licence je nekomerční, takže pro zakázky přichází v úvahu FLUX.1 [schnell], Qwen-Image (Apache-2.0) nebo komerční licence BFL. Qwen-Image (20B) je realisticky jen pro cloud GPU.
  4. Při použití nese geometrii vlastní 3D model (SketchUp, Rhino, Revit → hloubková mapa + lineart/MLSD) přes ControlNet. LoRA dodá světlo, materiály, kompozici a „entourage". Pro jednorázovou referenci bez tréninku stačí IP-Adapter nebo style reference.
  5. Vyhodnocení: slepý test, kdy architekt hodnotí mix skutečných a generovaných obrázků pěti nových projektů. Kontrola memorizace: podobnost výstupů s trénovacími obrázky (CLIP/SigLIP); příliš vysoká shoda znamená přeučenou LoRA.
- **Realistická očekávání:** LoRA zachytí, „jak to vypadá na obrázku", ne „proč je to tak navržené". U typologií, které v trénovacích datech nebyly, se styl rozmělní do průměru základního modelu. Výsledky slouží pro ideaci a komunikaci v rané fázi, ne jako dokumentace.
- **Na notebooku:** LoRA na SDXL je lokálně realistická. FLUX LoRA v 12GB režimu je možná, ale pomalá. Pro FLUX/Qwen ve vyšší kvalitě dává smysl pronájem 24–80GB GPU na několik hodin. ZHA uvádí 45–90 min na LoRA na vlastní serverové farmě, notebook bude pomalejší.

### Gaps
- Nenašel jsem rigorózní studii, kolik vlastních obrázků je optimum pro architektonickou style LoRA. Čísla (5–9, 10–20) jsou z praxe a od dodavatelů.
- U ZHA, MVRDV a Henning Larsen chybí počty obrázků na jednu LoRA, použité základní modely a hodnocení kvality.
- KPF, SOM, BIG: žádný doklad o modelu trénovaném na vlastní práci. Tvrzení o nich bych ve zprávě neuváděl, dokud se nepotvrdí. Stejně tak chybí primární zdroj BIG o používání Midjourney.
- Zdroje k ZHA, F+P a MVRDV bylo možné číst jen přes souhrny vyhledávače. Pro ověření citací je třeba povolit domény www.ribaj.com, www.allplan.com, bimplus.co.uk a parametric-architecture.com v síťovém nastavení session.

## 3. Prostorový a dispoziční styl: výzkum generování půdorysů, datasety a licence, dotrénování na 20–100 projektech, komerční nástroje

### Takeaway
Výzkum (House-GAN++ → HouseDiffusion → ChatHouseDiffusion → přístupy s LLM a grafy 2024–2026) umí generovat věrohodné bytové půdorysy z grafu místností nebo z textu. Modely se ale učí na 10⁴–10⁵ plánech z jednoho trhu (Čína, jižní Asie, Švýcarsko) a i nejnovější práce o „data-efficient" adaptaci počítají s 1 000–10 000 vzorky. Dotrénovat generátor na 20–100 vlastních projektech tedy realisticky nejde. Funkční cesta je LLM nebo grafový generátor + vlastní pravidla + vlastní půdorysy jako vyhledávané příklady (retrieval/few-shot), jak to ukazuje ZURU.

### Cited Findings
**Metody**
- Graph2Plan (SIGGRAPH 2020) vyhledá v databázi půdorysy s jejich grafy dispozice a uživatel zadává počty místností a další omezení — [HouseTune, related work](https://arxiv.org/pdf/2411.12279); [Graph2Plan †](https://arxiv.org/abs/2004.13204)
- House-GAN++ (CVPR 2021): GAN podmíněný grafem místností s iterativním zpřesňováním — [Nauata et al. †](https://arxiv.org/abs/2103.02574)
- HouseDiffusion (CVPR 2023): vektorové půdorysy reprezentované jako 1D polygonální smyčky. Generuje z grafu na půdorys, místnosti jsou uzly a dveře hrany — [CVF Open Access](https://openaccess.thecvf.com/content/CVPR2023/papers/Shabani_HouseDiffusion_Vector_Floorplan_Generation_via_a_Diffusion_Model_With_Discrete_CVPR_2023_paper.pdf)
- Tell2Design (ACL 2023): dataset jazyk → půdorys s omezeními velikostí a vzájemné polohy místností v přirozeném jazyce, baseline je T5 seq2seq — [HouseTune, AAAI](https://ojs.aaai.org/index.php/AAAI/article/download/38417/42379)
- ChatHouseDiffusion (arXiv 10/2024): LLM převede zadání v přirozeném jazyce na strukturovaný JSON, Graphormer kóduje topologii místností a difuzní model generuje půdorys. Lokální úpravy se dělají výměnou attention map s uživatelským prahem rozsahu změn. Na RPLAN vykazuje vyšší IoU než předchozí metody — [arXiv 2410.11908](https://arxiv.org/abs/2410.11908v1)
- DStruct2Design (2024): data a benchmarky pro generování půdorysů řízené datovou strukturou (LLM s numerickými omezeními) — [arXiv 2407.15723](https://arxiv.org/pdf/2407.15723)
- HouseTune (AAAI): dvoustupňový postup, kdy LLM vytvoří počáteční dispozici podle textu a ta se dále zpřesňuje. Autoři jím řeší malou diverzitu Tell2Design — [arXiv 2411.12279](https://arxiv.org/pdf/2411.12279)
- Foster + Partners s University of Leeds: latentní difuzní model generující půdorysy z obrysu budovy a zadání pro různé funkce budov — [arXiv 2412.06859](https://ar5iv.labs.arxiv.org/html/2412.06859)
- 2025: FloorPlan-DeepSeek (vektorová predikce „další místnosti") — [arXiv 2506.21562](https://arxiv.org/pdf/2506.21562). FloorplanMAE (doplnění celého půdorysu z částečného vstupu) — [arXiv 2506.08363](https://arxiv.org/pdf/2506.08363). Sjednocené generování bytových půdorysů z multimodálních vstupů — [Automation in Construction 2025](https://www.sciencedirect.com/science/article/abs/pii/S0926580525004480)
- 2026: HypergraphFormer (hypergrafy odvozené z LLM pro editovatelné půdorysy) — [arXiv 2605.18932](https://arxiv.org/pdf/2605.18932). LLM generující polygony místností v metrických jednotkách, trénovaný pomocí RL s ověřitelnými odměnami (RLVR) — [arXiv 2605.14117](https://arxiv.org/pdf/2605.14117)

**Malá data (klíčové pro otázku 20–100 projektů)**
- arXiv 2607.06483 (07/2026) předtrénuje model na syntetických dispozicích. Při dotrénování na 1 000–10 000 vzorcích překonává inicializaci z reálných dat, v režimu s málo daty až o 40 %. Má i konkurenceschopný zero-shot transfer: u modelu DPFM na datech MagicPlan překonal dokonce plný trénink na cílové doméně — [arXiv 2607.06483](https://arxiv.org/html/2607.06483)
- arXiv 2602.01949 (02/2026): při mírném posunu distribuce se model adaptuje i z několika málo příkladů (výrazné zlepšení FID). Při větším posunu k novému architektonickému stylu výrazně selhává, což autoři připisují závislosti na „priorech" trénovacích dat — [arXiv 2602.01949](https://arxiv.org/pdf/2602.01949)
- FloorDiffusion: parametricky efektivní dotrénování (PEFT) difuzního modelu a podmíněné generování přes inpainting v latentním prostoru — [Journal of Building Engineering](https://www.sciencedirect.com/science/article/abs/pii/S2352710224018886)
- ZURU + AWS: text → půdorys pomocí LLM s prompt engineeringem a dotrénováním. Systém za běhu vyhledává nejrelevantnější příklady (dynamic few-shot) a 30 % nekvalitních dat bylo odfiltrováno metrikou. Titulek uvádí zlepšení přesnosti o 109 % — [AWS ML Blog](https://aws.amazon.com/blogs/machine-learning/how-zuru-improved-the-accuracy-of-floor-plan-generation-by-109-using-amazon-bedrock-and-amazon-sagemaker/); [ZenML LLMOps DB](https://www.zenml.io/llmops-database/text-to-floor-plan-generation-using-llms-with-prompt-engineering-and-fine-tuning)

**Datasety a licence**
- ResPlan (08/2025, Indiana University): 17 000 bytových půdorysů ve vektorově-grafové podobě, 17 tříd, 4 typy hran (via_door, adjacency, direct, via_window), v průměru 8,1 místnosti. Data CC BY 4.0, kód MIT. Rozdělení 13 053 / 1 632 / 1 632 (+683 augmentovaných). Omezení: jen jihoasijský trh, jedno podlaží, bez nábytku a 3D — [arXiv 2508.14006](https://arxiv.org/pdf/2508.14006); [GitHub m-agour/ResPlan](https://github.com/m-agour/ResPlan)
- Swiss Dwellings (Archilyse AG, Zenodo): 2D geometrie stěn, otvorů, místností a zařízení plus simulace (výhled, denní světlo, hluk z dopravy, centralita). Jedna verze obsahuje 42 500 bytů (250 000 místností) v ~3 100 budovách, pozdější aktualizace 45 176 bytů. Data pocházejí od komerčních klientů Archilyse. Licenci se v této rešerši nepodařilo ověřit — [Zenodo 7070952](https://zenodo.org/record/7070952); [Zenodo 7788422](https://zenodo.org/record/7788422)
- MSD, Modified Swiss Dwellings (ECCV 2024): benchmark pro generování půdorysů celých bytových komplexů, vyčištěná a kurátorovaná odvozenina Swiss Dwellings, „Code and data are open" — [arXiv 2407.10121](https://www.arxiv.org/abs/2407.10121v2); [ECCV PDF](https://jvgemert.github.io/pub/MSD_ECCV24.pdf)
- RPLAN: přes 80 000 půdorysů reálných bytů, z projektu „Data-driven Interior Plan Generation for Residential Buildings" (ACM TOG 2019) — [projekt RPLAN †](http://staff.ustc.edu.cn/~fuxm/projects/DeepLayout/index.html). CubiCasa5k: 5 000 obrázků půdorysů anotovaných do více než 80 kategorií objektů — [arXiv 1904.01920 †](https://arxiv.org/abs/1904.01920)

**Praxe**
- ZHA používá AI ke generování variant polohy jádra (Infinitus Plaza) — [Archinect](https://archinect.com/news/article/150353676/zaha-hadid-architects-on-using-ai-in-workplace-design)
- Dezeen (09/2026): studia (mj. JLL Design) používají AI generátor půdorysů laiout ke zrychlení návrhu (k dispozici byl jen titulek) — [Dezeen](https://www.dezeen.com/2026/09/03/laiout-ai-floor-plan-generator-jll-design/)

### Inferences
- **Nepoměr dat:** 20–100 vlastních projektů je o 2–3 řády méně než trénovací sady (13 tis. v ResPlan, 42 tis. bytů ve Swiss Dwellings, 80 tis. v RPLAN) a o 1–2 řády méně než „data-efficient" dotrénování (1–10 tis.). Vlastní styl navíc je „novým stylem", tedy právě případem, kde podle 2602.01949 adaptace selhává.
- **Částečná cesta pro bytové domy:** 100 projektů bytových domů může dát stovky až nízké tisíce bytových jednotek. Po augmentaci (zrcadlení, rotace) se to blíží spodní hranici 1 000 vzorků. Šlo by tedy o dotrénování předtrénovaného modelu (ideálně syntetickým předtréninkem podle 2607.06483), ne o trénink od nuly. U rodinných domů a jedinečných staveb to nedává smysl.
- **Region a licence:** nejbližší středoevropským zvyklostem je Swiss Dwellings/MSD. RPLAN (asijský trh) a ResPlan (jižní Asie) nesou cizí konvence. Pro komerční studio jsou použitelné jen datasety s licencí umožňující komerční užití (ResPlan CC BY 4.0 ano; u ostatních ověřit).
- **Doporučený postup:** (1) vektorizovat vlastní půdorysy do grafové podoby (místnosti, plochy, vazby) podle schématu ResPlan nebo HouseDiffusion; (2) sepsat pravidla (sekce 4); (3) generovat varianty LLM nebo existujícím generátorem s vlastními plány jako few-shot příklady (styl ZURU); (4) automaticky filtrovat pravidly a ČSN; (5) architekt vybírá a volby se logují.

### Gaps
- **Komerční nástroje se nepodařilo ověřit** (vyčerpaný limit vyhledávání): Finch3D, Hypar, Snaptrude, TestFit, Higharc. Z obecné znalosti k ověření: TestFit umí knihovnu vlastních bytových jednotek; Higharc kóduje pravidla a standardy stavitele do parametrického modelu rodinných domů; Hypar nabízí konfigurovatelné „layout" funkce; Finch3D generuje a hodnotí dispozice podle pravidel. U žádného jsem neověřil, zda se „učí" z vlastních půdorysů kanceláře, nebo jen parametrizuje pravidla. Pravděpodobně to pokrývá souběžná rešerše nástrojů podle fází projektu.
- Licence RPLAN, CubiCasa5k a Swiss Dwellings/MSD nebyly ověřeny proti licenčnímu textu. Z obecné znalosti: RPLAN jen pro akademické užití na žádost, CubiCasa5k CC BY-NC 4.0 (nekomerční), Swiss Dwellings pravděpodobně CC BY 4.0. Vše před použitím ověřit.
- Nenašel jsem doložený případ malé kanceláře, která by dotrénovala generátor dispozic na vlastních projektech.
- U laiout a „Avoice" (Dezeen 2026) chybí detaily nad rámec titulků.

## 4. Pravidlová „design DNA": tvarové gramatiky, parametrické šablony, explicitní pravidla a checklisty, učení z preferencí (RLHF/DPO, copiloty logující volby)

### Takeaway
Pro malé studio je explicitní „design DNA" nejúčinnější způsob, jak zachytit dispoziční a hmotový styl z malého počtu projektů: psaná pravidla + parametrické šablony v Grasshopperu nebo Dynamu + automatické kontroly. Nejnovější výzkum jde stejným směrem: LLM generátory s numerickými omezeními (DStruct2Design) a RL s ověřitelnými odměnami (2026) dělají z pravidel trénovací signál. Učit model z přijetí a zamítnutí (RLHF/DPO) je pro jedno studio datově nedosažitelné, logovat rozhodnutí má ale smysl hned od začátku.

### Cited Findings
- Tvarové gramatiky (shape grammars; Stiny & Gips, 1972) jsou pravidlové systémy, které generují tvary opakovaným přepisováním. V architektuře se používají k popisu a generování korpusu konkrétního autora nebo stylu — [Wikipedia: Shape grammar †](https://en.wikipedia.org/wiki/Shape_grammar)
- DStruct2Design pojímá návrh půdorysu jako generování datové struktury s numerickými omezeními, která musí LLM splnit. Pravidla se tak stávají vstupem — [arXiv 2407.15723](https://arxiv.org/pdf/2407.15723)
- RLVR (2026): LLM generující metrické polygony místností je trénovaný odměnami, které lze automaticky ověřit. Pravidla se stávají trénovacím signálem — [arXiv 2605.14117](https://arxiv.org/pdf/2605.14117)
- ChatHouseDiffusion: uživatelský práh určuje, kolik se z původního návrhu při úpravě změní (člověk ve smyčce) — [arXiv 2410.11908](https://arxiv.org/abs/2410.11908v1)
- Graph2Plan: uživatel zadává omezení a systém vychází z vyhledaných existujících půdorysů — [HouseTune, related work](https://arxiv.org/pdf/2411.12279)
- DPO trénuje model přímo na párech preferencí bez explicitního reward modelu — [Rafailov et al. †](https://arxiv.org/abs/2305.18290). Diffusion-DPO dotrénoval SDXL na 851 tisících párových preferencí z datasetu Pick-a-Pic — [Wallace et al. †](https://arxiv.org/abs/2311.12908)
- KPF už v roce 2018 popisovalo workflow lidský vstup → strojové učení → lidské hodnocení (AI agenti testující prostory ve VR) — [Architosh 2018](https://architosh.com/2018/04/gtc-architecture-and-the-future-of-technology-kpf-hks-pw-gensler-and-others/2/). Dnes KPF formuluje dělbu práce tak, že lidé rozpoznávají krásu a počítače iterují (parafráze) — [KPF](https://www.kpf.com/news/joe-brennan-showcases-a-practitioners-toolbox-with-uli-new-york)
- BIG rozkládá návrhová rozhodnutí do diagramů, tedy do implicitní pravidlové struktury — [Dezeen 2014](https://www.dezeen.com/2014/07/10/movie-interview-bjarke-ingels-big-designing-with-diagrams/)
- ZURU odfiltrovalo metrikou 30 % nekvalitních trénovacích dat, tedy pravidlovou kontrolou kvality — [AWS ML Blog](https://aws.amazon.com/blogs/machine-learning/how-zuru-improved-the-accuracy-of-floor-plan-generation-by-109-using-amazon-bedrock-and-amazon-sagemaker/)

### Inferences
- **Jak sestavit design DNA (syntéza):** strukturovaný rozhovor s architektem a rozbor 10–30 vlastních projektů. Výstupem je strojově čitelný soubor pravidel, který slouží zároveň jako prompt pro LLM, jako vstup parametrické šablony a jako automatický checker. Příklad struktury:
  ```yaml
  dispozice:
    vstup: {zadveri_min_m2: 2.5, satna: povinne}
    kuchyn: {orientace: [V, J], vazba: obyvaci_pokoj, ostruvek_od: "3+kk"}
    loznice: {orientace_preferovana: [V, S], min_sirka_m: 3.0}
  hmota:
    strecha: [sedlova_bez_presahu, plocha_zelena]
    pomer_okno_stena_fasada_J: [0.35, 0.50]
  konstrukce:
    nosny_system: zdeny_keramicky
    typicka_skladba_obvodove_steny: OS-01
  zakazano: ["neprosvetlena koupelna bez nuceneho vetrani"]
  ```
  (Hodnoty jsou ilustrativní, ne doporučené.)
- **Parametrické šablony:** typické hmoty a fasádní rastry studia jako definice v Grasshopperu nebo Dynamu s pojmenovanými parametry. AI (LLM) pak nastavuje parametry, ale negeneruje geometrii od nuly. To je robustnější a lépe kontrolovatelné.
- **Učení z preferencí reálně:** Diffusion-DPO potřeboval 851 tisíc párů, studio jich vyprodukuje stovky ročně. Realistické využití logu rozhodnutí: (a) přeladění vah pravidel a skórovací funkce, (b) volba preferovaných presetů (LoRA, váha, prompt), (c) jednoduchý model pořadí (Bradley–Terry nebo logistická regrese nad vlastnostmi variant) při stovkách rozhodnutí.
- **Log rozhodnutí od prvního dne:** `varianta_id, projekt, fáze, parametry, výsledek (přijato/zamítnuto/upraveno), kód důvodu, kdo, datum`. Kódy důvodů (např. „proporce", „orientace", „cena", „klient") jsou cennější než samotné ano/ne.

### Gaps
- Klasické případové studie gramatik konkrétních autorů (Palladio – Stiny & Mitchell 1978; prérijní domy F. L. Wrighta – Koning & Eizenberg 1981; Sizova Malagueira – J. P. Duarte) ani novější práce o učení gramatik z příkladů se kvůli nedostupnosti CumInCAD a vyčerpanému vyhledávání nepodařilo ověřit online.
- Nenašel jsem ověřený případ RLHF/DPO aplikovaného v praxi na preference jednoho architekta ani komerční „design copilot", který by logoval volby a učil se z nich. Toto je potřeba dohledat.

## 5. Retrieval: prohledávatelná knihovna vlastních precedentů (CLIP/SigLIP + textové popisy) jako zdroj návrhů ve vlastním stylu

### Takeaway
Prohledávatelná knihovna vlastních projektů (obrazové embeddingy CLIP/SigLIP + textové popisy + metadata) má pro malé studio nejlepší poměr přínos/náklady. Funguje už od desítek projektů, nevyžaduje trénink, je právně nejčistší (jen vlastní data) a každý návrh lze dohledat ke zdroji. Velké kanceláře mají interní vyhledávání nebo mapování archivu (Foster + Partners, MVRDV). ZURU a Graph2Plan ukazují, že vyhledané vlastní příklady zlepšují i samotné generování dispozic.

### Cited Findings
- CLIP se učí společný prostor obrazu a textu ze 400 milionů párů obraz–text a umožňuje vyhledávat obrázky textovým dotazem — [Radford et al., CLIP †](https://arxiv.org/abs/2103.00020). SigLIP nahrazuje softmax ztrátu sigmoidní a je efektivnější — [Zhai et al., SigLIP †](https://arxiv.org/abs/2303.15343). ColPali vyhledává v dokumentech přímo z obrázků stran PDF, bez OCR pipeline (relevantní pro výkresy a zprávy v PDF) — [Faysse et al., ColPali †](https://arxiv.org/abs/2407.01449)
- Foster + Partners postavilo vlastní vyhledávací aplikaci nad LLM — [BIMplus](https://bimplus.co.uk/foster-partners-rd-taking-ai-and-digital-twins-to-the-next-stage)
- MVRDV: „MVRDV Cloud" mapuje obsah digitálního archivu pomocí počítačového vidění a analýzy metadat. Nástroj strojového učení byl trénován na archivu s více než 300 000 obrázky — [Het Nieuwe Instituut](https://nieuweinstituut.nl/en/projects/mvrdvhni/tools); [mvrdvhni.hetnieuweinstituut.nl](https://mvrdvhni.hetnieuweinstituut.nl/en/tools)
- ZURU za běhu vyhledává nejrelevantnější příklady podle detailů zadání (dynamic few-shot) a tím zlepšuje generování půdorysů LLM — [AWS ML Blog](https://aws.amazon.com/blogs/machine-learning/how-zuru-improved-the-accuracy-of-floor-plan-generation-by-109-using-amazon-bedrock-and-amazon-sagemaker/)
- Graph2Plan staví generování na vyhledání existujících půdorysů a jejich grafů z databáze — [HouseTune, related work](https://arxiv.org/pdf/2411.12279)
- ZHA trénuje projektové LoRA z vlastní obrazové banky, což předpokládá kurátorovanou a prohledávatelnou banku obrázků — [Allplan blog](https://www.allplan.com/blog/ai-in-practice-at-zaha-hadid-architects/)
- Benchmark LaMP ukazuje, že vyhledání položek z uživatelova profilu a jejich vložení do promptu zlepšuje personalizované výstupy LLM — [Salemi et al., LaMP †](https://arxiv.org/abs/2304.11406)

### Inferences
- **Architektura řešení (syntéza):** karta projektu (JSON s metadaty, sekce 7) + obrázky + PNG půdorysů + texty. Obrázky se indexují obrazovým embeddingem (SigLIP/OpenCLIP), texty vícejazyčným textovým embeddingem s podporou češtiny, stránky PDF stylem ColPali. Vše jde do lokální vektorové databáze (např. Qdrant, LanceDB, Chroma) s filtry na metadata (typologie, rok, fáze, materiál). Nad tím LLM navrhne řešení a cituje konkrétní vlastní precedenty („podobně jako RD Dobříš 2019, kde…").
- **Lokálně proveditelné:** embedding modely typu SigLIP se do 12 GB VRAM vejdou s rezervou a indexace tisíců obrázků je otázka minut až desítek minut (odhad). Data neopustí kancelář, což odpovídá postoji Foster + Partners a ZHA k vlastním serverům.
- **Vyhledávání podle dispozice:** pokud se půdorysy převedou na grafy (sekce 7), lze hledat i podle grafové podobnosti („3+kk s kuchyní na jih a oddělenou ložnicovou částí"), nejen podle vzhledu.
- **Vyhodnocení:** architekt napíše cca 30 testových dotazů s očekávanými projekty a měří se precision@5. Levné a opakovatelné po každé změně indexu.

### Gaps
- Nepodařilo se ověřit recenzovanou studii (CAADRIA/eCAADe/ACADIA) s kvantitativním vyhodnocením vyhledávání precedentů v kanceláři ani studii, která by měřila, zda návrhy z retrievalu architekti vnímají jako „ve svém stylu". CumInCAD nebyl dostupný.
- Chybí srovnání obrazových embeddingů (CLIP vs. SigLIP 2 vs. komerční multimodální embeddingy) na architektonických datech.

## 6. Styl psaní: fine-tuning vs. few-shot prompting a stylové příručky pro technické zprávy

### Takeaway
U technických zpráv je struktura daná vyhláškou o dokumentaci staveb a „styl" je hlavně terminologie, míra detailu a ustálené formulace. V roce 2026 pro to stačí kombinace stylové příručky, 3–10 vzorových textů a RAG nad vlastními zprávami s kvalitním LLM. Fine-tuning dává smysl až od desítek až stovek párů „podklady → hotový text" a zlepšuje konzistenci formy, ne správnost faktů.

### Cited Findings
- OpenAI pro dotrénování vyžaduje minimálně 10 příkladů a zřetelné zlepšení obvykle pozoruje při 50–100 trénovacích příkladech — [OpenAI fine-tuning guide †](https://platform.openai.com/docs/guides/fine-tuning)
- Personalizace LLM vyhledáním uživatelových vlastních textů (retrieval augmentation) měřitelně zlepšuje personalizované výstupy — [LaMP †](https://arxiv.org/abs/2304.11406)
- Obsah a členění projektové dokumentace (průvodní zpráva, souhrnná technická zpráva atd.) stanoví prováděcí vyhláška o dokumentaci staveb. Dříve to byla vyhláška č. 499/2006 Sb. — [zakonyprolidi.cz †](https://www.zakonyprolidi.cz/cs/2006-499). S novým stavebním zákonem (od 7/2024) ji podle obecné znalosti nahradila vyhláška č. 131/2024 Sb.; platné číslo předpisu je třeba ověřit.
- Velké kanceláře provozují vlastní nástroje nad LLM na vlastních serverech (Foster + Partners: vyhledávací aplikace nad LLM) — [BIMplus](https://bimplus.co.uk/foster-partners-rd-taking-ai-and-digital-twins-to-the-next-stage)
- Selldorf Architects uvedli, že se v roce 2026 zaměří na využití AI „not as a design tool" (dle souhrnu), ale k zefektivnění úkolů během autorského dozoru a správy stavby — [Dezeen, 01/2026](https://www.dezeen.com/2026/01/07/architecture-profession-predictions-2026/)
- Na trh míří AI agenti na chod architektonických studií (Avoice; k dispozici jen titulek) — [Dezeen, 07/2026](https://www.dezeen.com/2026/07/24/avoice-ai-agents-architecture-studios/)

### Inferences
- **Doporučené pořadí:** (1) stylová příručka na 1–2 strany: terminologie, zakázané obraty, délka vět, jednotky a formátování, osoba a čas, typické formulace pro odstavce vyhlášky; (2) 3–5 nejlepších vlastních zpráv jako vzory podle typologie; (3) šablona kapitol podle vyhlášky; (4) RAG nad archivem zpráv pro opakující se pasáže (skladby, PBŘ, TZB), aby model přebíral ověřené formulace místo vymýšlení; (5) fine-tuning až při stovce a více párů „vstupní podklady → finální text".
- **Čeština:** kvalitní frontier modely přes API (s DPA a ideálně zpracováním v EU) budou v češtině výrazně lepší než lokální 7–8B modely, které se na 12 GB dají dotrénovat přes QLoRA. Lokální fine-tune je spíš pro citlivá data, kde nejde použít cloud (odhad, neověřeno benchmarkem).
- **Riziko:** u technických zpráv je hlavní hrozbou halucinace faktů (hodnoty U, třídy reakce na oheň, normy), ne nevhodný styl. Kontrola faktů a odkazy na zdrojové podklady jsou důležitější než ladění stylu.

### Gaps
- Nepodařilo se ověřit studie srovnávající fine-tuning a few-shot pro napodobení stylu konkrétního autora. Z obecné znalosti existuje práce z roku 2025, podle níž LLM implicitní styl běžných autorů napodobují jen omezeně, ale nebyla dohledána.
- Chybí ověřené srovnání kvality češtiny lokálních modelů dotrénovatelných na 12 GB VRAM a doložený případ kanceláře, která dotrénovala model na vlastních technických zprávách.

## 7. Jak strukturovat a digitalizovat vlastní archiv (DWG, RVT, IFC, PDF, obrázky) a minimální velikosti datasetů pro jednotlivé techniky

### Takeaway
Archiv se vyplatí stavět jako „karta projektu" s metadaty a právy + normalizované exporty (obrázky, PNG a vektor půdorysů, IFC, texty v Markdownu). Prvním krokem je inventura práv, ne technika. Minimální užitečná data se mezi technikami liší o několik řádů: LoRA jednotky až desítky obrázků, retrieval desítky projektů, fine-tune LLM 50–100+ párů, generátor dispozic tisíce plánů, DPO statisíce párů.

### Cited Findings
- MVRDV: digitální archiv s více než 300 000 obrázky a vizualizacemi, mapovaný počítačovým viděním a metadaty (MVRDV Cloud) — [Het Nieuwe Instituut](https://nieuweinstituut.nl/en/projects/mvrdvhni/tools)
- ZHA trénuje LoRA z vlastní obrazové banky pro každý nový projekt, jednu za 45 min až 1,5 h — [Allplan blog](https://www.allplan.com/blog/ai-in-practice-at-zaha-hadid-architects/)
- Coop Himmelb(l)au staví DeepHimmelb(l)au na digitalizovaných obrazových bankách — [IEREK ARChive](https://press.ierek.com/index.php/ARChive/article/download/1239/1414/7268)
- Vzor datového schématu půdorysu: ResPlan používá vektorový graf s 17 třídami prostorů a hranami via_door / adjacency / direct / via_window — [arXiv 2508.14006](https://arxiv.org/pdf/2508.14006). HouseDiffusion reprezentuje místnosti jako polygonální smyčky a dveře jako hrany grafu — [CVF](https://openaccess.thecvf.com/content/CVPR2023/papers/Shabani_HouseDiffusion_Vector_Floorplan_Generation_via_a_Diffusion_Model_With_Discrete_CVPR_2023_paper.pdf). Swiss Dwellings ukládá 2D geometrii stěn, otvorů, místností a zařízení spolu se simulacemi — [Zenodo](https://zenodo.org/record/7070952)
- Kvalita před kvantitou: ZURU odfiltrovalo 30 % nekvalitních dat — [AWS ML Blog](https://aws.amazon.com/blogs/machine-learning/how-zuru-improved-the-accuracy-of-floor-plan-generation-by-109-using-amazon-bedrock-and-amazon-sagemaker/). IAAC: 5–9 kurátorovaných obrázků překonalo 60 zašuměných — [IAAC blog](https://blog.iaac.net/faster-architectural-workflows-with-generative-ai-from-text-prompts-to-custom-loras/)
- Nástroje pro převody: ODA File Converter (DWG → DXF) — [Open Design Alliance †](https://www.opendesign.com/guestfiles/oda_file_converter); ezdxf (čtení DXF v Pythonu) — [ezdxf †](https://ezdxf.readthedocs.io); IfcOpenShell (čtení IFC, např. IfcSpace a materiálů) — [IfcOpenShell †](https://ifcopenshell.org); Speckle (open-source datový hub s konektory pro Revit a Rhino) — [Speckle †](https://speckle.systems)
- Referenční velikosti dat: DreamBooth a Textual Inversion 3–5 obrázků subjektu — [DreamBooth †](https://arxiv.org/abs/2208.12242); [Textual Inversion †](https://arxiv.org/abs/2208.01618). Style LoRA 5–9 (IAAC) až 10–20 (návod třetí strany k Qwen) — [IAAC](https://blog.iaac.net/faster-architectural-workflows-with-generative-ai-from-text-prompts-to-custom-loras/); [qwenimage-2.com](https://qwenimage-2.com/blog/qwen-image-lora-training). Generátory dispozic 13 tis. (trénink ResPlan) až 80 tis. (RPLAN), dotrénování 1–10 tis. — [ResPlan](https://github.com/m-agour/ResPlan); [RPLAN †](http://staff.ustc.edu.cn/~fuxm/projects/DeepLayout/index.html); [arXiv 2607.06483](https://arxiv.org/html/2607.06483). Fine-tune LLM minimálně 10, zřetelně 50–100 — [OpenAI †](https://platform.openai.com/docs/guides/fine-tuning). Diffusion-DPO 851 tis. párů — [Diffusion-DPO †](https://arxiv.org/abs/2311.12908)

### Inferences
- **Navržená struktura archivu:**
  ```
  ARCHIV_AI/
    projekty/
      2019_RD_Dobris/
        projekt.json   # metadata + práva (viz níže)
        obrazy/        # fotky a rendery (JPG/PNG ~2048 px) + .txt popisky pro LoRA
        plany/         # půdorysy PNG (jednotné měřítko, sever nahoru) + vektor (DXF/GeoJSON) + graf (JSON)
        model/         # IFC export z RVT; případně SKP/3DM
        texty/         # technické a průvodní zprávy (DOCX/PDF → Markdown, rozsekané po kapitolách)
        detaily/       # DWG → DXF + PNG náhled + popis skladby
    prava/             # licence fotografů a vizualizátorů, souhlasy klientů, NDA
    indexy/            # vektorové indexy (embeddingy)
    log_rozhodnuti.csv # přijaté/zamítnuté varianty (sekce 4)
  ```
- **`projekt.json` (minimum):** id, název, rok, typologie, obec (ne přesná adresa), fáze (studie/DUR/DSP/DPS), plochy, počet podlaží, konstrukční systém, fasádní materiály, autoři, a pro každý obrázek autor, licence a příznak `smi_do_treninku: ano/ne`. Dále `duverne/NDA`, `osobni_udaje: ano/ne/anonymizovano`, klíčová slova stylu a 3–5 vět „proč" (koncept). Právě text „proč" dělá z archivu zdroj stylu, ne jen galerii.
- **Pipeline:** (1) inventura práv a citlivosti; (2) DWG → DXF (ODA) → ezdxf (vrstvy místností, bloky) → PNG + graf místností. Bez vrstev místností je nutná ruční nebo poloautomatická vektorizace a u 20–100 projektů je ruční doplnění realistické. (3) RVT → IFC z Revitu → IfcOpenShell (IfcSpace, skladby, materiály); (4) PDF → text a rastry stran (pro ColPali-like vyhledávání), skeny → OCR; (5) obrázky: deduplikace, výběr, ořez, automatické popisky VLM s ruční korekcí; (6) indexace (sekce 5).
- **Minimální užitečné velikosti (syntéza):**

| Technika | Minimum, které má smysl | Dobré | Poznámka |
|---|---|---|---|
| Style LoRA (1 faseta) | 5–10 kurátorovaných obrázků | 15–40 z ≥ 5 projektů | kvalita > kvantita |
| IP-Adapter / style reference | 1–5 referencí | — | bez tréninku |
| ControlNet (použití) | 0 (předtrénované) | — | vlastní trénink ControlNetu nedává smysl |
| Retrieval precedentů | ~10–20 projektů | všechny | roste s archivem, bez tréninku |
| Design DNA (pravidla) | 10–30 projektů + rozhovor | — | ruční práce, nejvyšší kontrola |
| Few-shot psaní | 3–5 vzorů + příručka | 10 vzorů + RAG | — |
| Fine-tune LLM na texty | 50–100 párů | stovky | jen pokud je styl konzistentní |
| Generátor dispozic (dotrénování) | ~1 000 jednotek | 10 000+ | pro malé studio v zásadě nedosažitelné |
| Učení z preferencí (DPO) | statisíce párů | — | nedosažitelné; log rozhodnutí využít jinak |

### Gaps
- Nenašel jsem oborový standard metadatového schématu archivu pro AI (např. doporučení ČKA nebo buildingSMART pro tento účel).
- Neověřeno, jak spolehlivě lze bez Revitu číst RVT (např. přes Autodesk Platform Services) a jak kvalitní je automatická vektorizace naskenovaných půdorysů.

## 8. Právní mantinely v EU a ČR: autorské právo k trénovacím datům (vlastním i cizím), ochrana osobních údajů, AI Act

### Takeaway
Trénink na vlastních projektech je právně nejbezpečnější cesta, ale „vlastní" neznamená automaticky „s právy". Fotky od fotografů, vizualizace od externích studií, podklady klientů a osobní údaje v dokumentaci je třeba prověřit. Cizí obrázky z webu do vlastní LoRA nepatří: hrozí výhrada podle čl. 4 směrnice DSM / §39c AZ, riziko napodobení cizího díla i reputační riziko. Podle AI Act je studio zavádějícím subjektem (deployer) s povinností AI gramotnosti a od 2. 8. 2026 s transparenčními povinnostmi u „deep fake" obsahu. Velké kanceláře řeší IP hlavně provozem na vlastních serverech a interními pravidly.

### Cited Findings
- Směrnice DSM: čl. 3 povoluje vytěžování textů a dat (TDM) pro výzkumné organizace. Čl. 4 je obecná výjimka TDM, kterou může nositel práv vyhradit (u online obsahu strojově čitelným způsobem) — [Směrnice (EU) 2019/790 †](https://eur-lex.europa.eu/eli/dir/2019/790/oj)
- ČR: §39c autorského zákona upravuje vytěžování textů a dat, pokud si to autor vhodným způsobem nevyhradil, a §39d vytěžování pro vědecký výzkum (zavedeno novelou č. 429/2022 Sb.). §58 upravuje zaměstnanecké dílo, jehož majetková práva vykonává zaměstnavatel — [zákon č. 121/2000 Sb. †](https://www.zakonyprolidi.cz/cs/2000-121)
- AI Act: čl. 3 bod 60 definuje „deep fake" jako AI vytvořený nebo upravený obraz, zvuk či video, který připomíná existující osoby, předměty, místa, subjekty nebo události a mohl by se falešně jevit jako autentický. Čl. 50 odst. 4 ukládá zavádějícím subjektům takový obsah označit, u zjevně uměleckých nebo kreativních děl v omezené podobě. Čl. 4 ukládá zajistit AI gramotnost personálu (od 2. 2. 2025), čl. 50 se použije od 2. 8. 2026 — [Nařízení (EU) 2024/1689 †](https://eur-lex.europa.eu/eli/reg/2024/1689/oj)
- Osobní údaje v projektové dokumentaci (jména, adresy, podpisy, lidé na fotkách) spadají pod GDPR a český adaptační zákon — [Nařízení (EU) 2016/679 †](https://eur-lex.europa.eu/eli/reg/2016/679/oj); [zákon č. 110/2019 Sb. †](https://www.zakonyprolidi.cz/cs/2019-110)
- Praxe kanceláří: Foster + Partners provozuje ideaci na vlastních serverech kvůli IP a autorským právům — [BIMplus](https://bimplus.co.uk/foster-partners-rd-taking-ai-and-digital-twins-to-the-next-stage). ZHA na vlastní server farmě — [RIBAJ](https://www.ribaj.com/intelligence/patrik-schumacher-ai-opportunity/). Henning Larsen netrénuje na cizí práci ani na ni neodkazuje — [Architizer](https://architizer.com/blog/practice/tools/speaking-in-images-krea-henning-larsen/). Heatherwick má vlastní pravidla pro AI a HOK celofiremní pravidla — [Dezeen 2026](https://www.dezeen.com/2026/08/25/architecture-studios-encouraging-ai-feature/)
- Licence základního modelu je samostatná právní vrstva: FLUX.1 [dev] je pod nekomerční licencí — [HF †](https://huggingface.co/black-forest-labs/FLUX.1-dev)

### Inferences
- **Kontrolní seznam pro studio (syntéza, ne právní rada):**
  1. Práva k vlastním dílům: zaměstnanecká díla jsou v pořádku. U externistů, spoluautorů a subdodavatelů vizualizací je třeba ověřit licenci, která pokrývá i rozmnožení pro trénink nebo TDM.
  2. Fotografie staveb od profesionálních fotografů: autorem je fotograf, licence bývá omezená na publikaci a marketing. Pro trénink je potřeba ji rozšířit nebo použít vlastní fotky.
  3. Cizí obrázky (Pinterest, ArchDaily, soutěže): netrénovat. I kdyby se dalo argumentovat výjimkou TDM, výstup napodobující cizí dílo může být problém a reputační riziko je vysoké. Výjimka pro vědecký výzkum (§39d) se na komerční studio nevztahuje.
  4. Klientské podklady a NDA: příznak `duverne` v metadatech, takové projekty neposílat do cloudových služeb bez smluvního ošetření.
  5. GDPR: před indexací anonymizovat jména a adresy, ořezat nebo rozmazat osoby na fotkách. U cloudových služeb mít DPA a preferovat zpracování v EU.
  6. AI Act: dotrénování LoRA pro interní použití ze studia nedělá poskytovatele obecného modelu (GPAI). Platí povinnost AI gramotnosti, tedy krátké interní školení a pravidla. U fotomontáží AI do fotografií reálného místa určených veřejnosti (prezentace, územní řízení, marketing) zvážit označení „vizualizace vytvořena s pomocí AI", protože definice „deep fake" zahrnuje i místa a předměty. Výklad u architektonických vizualizací je nejistý.
  7. Ochrana výstupů: čistě AI generovaný obrázek nemusí být autorským dílem, proto je dobré dokumentovat lidský tvůrčí vklad (skici, 3D model, výběr, úpravy).
  8. Licence základního modelu ověřit zvlášť (např. FLUX.1 [dev] nekomerční → pro zakázky SDXL, FLUX.1 [schnell], Qwen-Image nebo komerční licence).

### Gaps
- Judikaturu se nepodařilo online ověřit: rozsudek Městského soudu v Praze z roku 2023 (sp. zn. 10 C 13/2023, podle obecné znalosti AI obrázek bez lidského autora není dílem), Kneschke v. LAION (LG Hamburg 2024, odvolání u OLG Hamburg), GEMA v. OpenAI (LG München I, 11/2025, memorizace v modelu). Před citací ve zprávě ověřit.
- Neověřen stav návrhu „Digital Omnibus" (11/2025), který měl odkládat nebo měnit část povinností AI Act (vč. čl. 4 a lhůt pro značení podle čl. 50), ani obsah pokynů Komise k GPAI (práh, kdy se upravovatel modelu stává poskytovatelem).
- Nedohledáno stanovisko České komory architektů k AI a trénování na projektové dokumentaci.

## 9. Co funguje a co je hype (akademické studie a zkušenosti z praxe)

### Takeaway
Funguje: (1) LoRA + ControlNet pro vizuální jazyk a rychlé varianty v rané fázi (ZHA, MVRDV, Henning Larsen), (2) vyhledávání ve vlastním archivu, (3) LLM s příručkou a vzory pro texty, (4) pravidla a parametrické šablony. Hype nebo zatím nedoložené: „AI navrhne dispozici v mém stylu z mých 30 projektů", „model se sám naučí můj vkus z kliknutí" a čísla typu „10× rychleji" z marketingu dodavatelů. I velké firmy jako KPF často používají hotové komerční nástroje místo vlastních modelů.

### Cited Findings
- „10× rychlejší rané iterace" u ZHA pocházejí z case study dodavatele hardwaru a z interní analýzy firmy — [HP](https://www.hp.com/in-en/workstations/learning-hub/zaha-hadid-architects.html)
- Heatherwick: postup se Stable Diffusion nebyl přístupný všem v týmu, což je bariéra adopce — [AEC+Tech](https://www.aecplustech.com/blog/technology-implementation-stories-dpr-construction-heatherwick-studio-aecom)
- BIG (sekundárně): „just beautiful images" nestačí, je potřeba řízený workflow s geometrií z Rhina — [note.com / XENCE](https://note.com/xence/n/n3941e61f7737?hl=en)
- Generátory dispozic výrazně selhávají při posunu k novému architektonickému stylu — [arXiv 2602.01949](https://arxiv.org/pdf/2602.01949). I s chytrým předtréninkem počítají s 1–10 tisíci vzorky — [arXiv 2607.06483](https://arxiv.org/html/2607.06483)
- Metody dispozic se hodnotí podobností s datasetem (např. IoU na RPLAN u ChatHouseDiffusion) — [arXiv 2410.11908](https://arxiv.org/abs/2410.11908v1). Datasety nesou regionální konvence — [ResPlan](https://github.com/m-agour/ResPlan)
- Z 26 studií oslovených Dezeenem 25 AI aktivně podporuje a více než polovina má in-house systémy. CF Møller: „We are encouraging them to use it, but thoughtfully" — [Dezeen 2026](https://www.dezeen.com/2026/08/25/architecture-studios-encouraging-ai-feature/)
- KPF používá pro vizualizace komerční Runway a D5 Render AI — [KPF](https://www.kpf.com/news/andy-christoforou-shares-how-kpf-is-using-ai-to-create-impactful-visuals-with-runway); [ArchDaily](https://www.archdaily.com/1020298)
- Schumacher upozorňuje, že jeho popis stavu může rychle zastarat — [RIBAJ](https://www.ribaj.com/intelligence/patrik-schumacher-ai-opportunity/)
- Akademicky doložená aplikace LoRA na architektonické fasády (SDXL) existuje — [eCAADe 2025](https://papers.cumincad.org/data/works/att/ecaade2025_262.pdf). IAAC: první pokus s DreamBooth selhal, malý kurátorovaný set uspěl — [IAAC blog](https://blog.iaac.net/faster-architectural-workflows-with-generative-ai-from-text-prompts-to-custom-loras/)

### Inferences
- Metriky v článcích o dispozicích (IoU, FID, diverzita) měří podobnost s rozložením datasetu, ne architektonickou kvalitu ani soulad s českými normami (např. ČSN 73 4301 Obytné budovy). „SOTA" výsledky z RPLAN proto nelze přenášet na českou praxi.
- **Realistický plán pro studio na 3–6 měsíců (syntéza):** (1) inventura práv a karta projektu pro 20–50 klíčových projektů; (2) vyhledávání precedentů (lokálně); (3) 2–3 stylové LoRA (exteriér, interiér, koláž) + workflow s ControlNetem; (4) psaná design DNA v YAML + checker; (5) stylová příručka + vzory pro technické zprávy; (6) log rozhodnutí. Generování dispozic jen přes LLM s vlastními příklady a pravidly, bez vlastního tréninku.
- Největší reálný přínos se dá čekat v rané fázi (ideace, komunikace s klientem) a v administrativě a textech, ne v automatickém navrhování dispozic. Odpovídá to i tomu, kam AI nasazují velké kanceláře v anketě Dezeenu.

### Gaps
- Nenašel jsem recenzovanou kontrolovanou studii dopadu vlastní stylové LoRA na produktivitu nebo kvalitu návrhu v praxi. Doklady jsou případové studie a vyjádření firem.
- Konferenční sborníky CAADRIA, eCAADe a ACADIA 2024–2026 nebylo možné systematicky prohledat (CumInCAD nedostupný, vyčerpané vyhledávání). Nalezena byla jen jedna práce z eCAADe 2025. Zbytek je k doplnění.
