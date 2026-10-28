# AI nástroje a automatizace v architektonické kanceláři podle fází projektu a činností (stav k 28. 10. 2026)

> Poznámka k metodě: Nástroj WebFetch byl v této relaci zablokovaný síťovým allowlistem (riba.org, chaos.com ani architosh.com nešly otevřít). Během práce se navíc vyčerpal sdílený rozpočet vyhledávání. Všechna zjištění proto vycházejí ze souhrnů výsledků vyhledávání, ne z plných textů. Čísla z průzkumů RIBA a Chaos pocházejí ze sekundárních shrnutí a před publikací je dobré je ověřit v originálních PDF. Kde se zdroje rozcházejí, je to uvedeno přímo u položky.

---

## 1. Jaké nástroje existují pro jednotlivé fáze v roce 2026, co přesně dělají a v jakém jsou stavu

### Takeaway
Ke konci roku 2026 se nabídka dělí na dvě části. První jsou AI vrstvy velkých platforem: Autodesk Assistant a Forma, Archicad AI Assistant s MCP v plánu Archicad Max, AI funkce Vectorworks a ALLPLAN, AI asistent v Solibri a Bluebeam Max. Ty jsou většinou stále v tech preview nebo v betě. Druhou jsou specializované startupy, které míří hlavně na americký trh a na bytové domy (TestFit, ArkDesign, Higharc, UpCodes, CodeComply, Togal). Nejzralejší a nejlevnější jsou vizualizační nástroje (Veras, D5 Render 3.0, Enscape AI Enhancer, Midjourney V8, Gendo, Krea). Kontrola předpisů, koordinovaná dokumentace a rozpočty v českém prostředí naopak hotové AI řešení nemají.

### Cited Findings

#### 1.1 AI vrstvy velkých platforem (zasahují do více fází)

**Autodesk (Revit, Forma, Autodesk Assistant)**
- Revit 2027 (duben 2026) přináší první AI funkce v podobě **Autodesk Assistant** ve stavu *Tech Preview*. Podle recenzí jde o zadávání BIM úkonů textem, například vyhledání a označení (tagging) prvků nebo generování pohledů a výkazů (schedules). — [Symetri](https://www.symetri.co.uk/insights/blog/what-s-new-in-revit-2027-a-guide-to-the-latest-features/); [Autodesk Help – Autodesk Assistant (Tech Preview) Enhancements](https://help.autodesk.com/cloudhelp/2027/ENU/Revit-WhatsNew/files/GUID-51526618-271B-4331-B9E6-FB1D9FC14FBD.htm)
- Autodesk 22. 4. 2026 představil Assistant v Revitu jako tech preview s pevně danou sadou podporovaných postupů („defined set of supported workflows“). — [Autodesk blog](https://www.autodesk.com/blogs/aec/2026/04/22/autodesk-assistant-in-revit-tech-preview/)
- Revit 2027 podporuje **Model Context Protocol (MCP)**. Obecný AI klient, například Claude, se k Revitu připojí přes doplněk „Public MCP Server“. — [BIM Pure](https://www.bimpure.com/blog/revit-2027); [Arkance – Entering the Agentic AI Era](https://arkance.world/gb-en/resources/read/blogs/autodesk-aec-family-2027-entering-the-agentic-ai-era)
- Recenze BIM Pure: nástroj míří spíš na začátečníky než na pokročilé uživatele a BIM manažery. Výstupy je třeba pečlivě kontrolovat a nástroj „should not be relied upon for business‑critical tasks“. — [BIM Pure](https://www.bimpure.com/blog/revit-2027)
- Revit 2027.1 a 2027.2 Assistanta dál vylepšily. Podrobnosti jsem nezjistil. — [BIM Pure](https://www.bimpure.com/blog/top-5-new-features-in-revit-2027-1-and-revit-2027-2)
- Na AU 2026 (tisková zpráva z 15. 9. 2026) Autodesk předvedl „next-generation“ Autodesk Assistant s funkcemi Personal Pulse, Assistant Spaces a Assistant Builder (připojování dalších agentů a nástrojů). Podle Autodesku zatím „not yet generally available“ a „planned to begin rolling out in 2027“. — [Autodesk Investor Relations](https://investors.autodesk.com/news-releases/news-release-details/autodesk-advances-agentic-ai-its-three-industry-clouds)
- Oznámení z AU 2026 zmiňují v Revitu „AI-powered room and documentation workflows“. — [Autodesk News](https://adsknews.autodesk.com/en/news/autodesk-forma-ai-aec-connected-workflows-2026/)
- AEC Magazine čte tento krok tak, že se Assistant stává vrstvou nad aplikacemi: uživatel zadá cíl a systém sám vybere nástroje. Návrh, analýzy, koordinace a dokumentace se podle časopisu postupně přesunou do Formy a Revit bude jejím „Forma Connected Client“. Jde o výklad média, ne o oficiální roadmapu. — [AEC Magazine](https://aecmag.com/ai/autodesk-beyond-the-seat-the-meter/)
- **Forma Building Design** byl spuštěn v dubnu 2026. Je to cloudový nástroj pro fázi studie (schematic design) a návrh se z něj přenese do Revitu bez ruční výměny souborů. Všichni předplatitelé Revitu mají přístup k Forma Site Design, Forma Building Design, Forma Board a Forma Data Management Essentials. — [IT Brief](https://itbrief.com.au/story/autodesk-launches-forma-building-design-for-revit-links); [Architosh](https://architosh.com/2026/04/autodesk-intros-new-forma-building-design/)
- Další novinky z AU 2026:
  - Forma Site Design odpovídá na dotazy v přirozeném jazyce přes Autodesk Assistant.
  - **Building Layout Explorer** generuje a porovnává varianty dispozic bytových domů (multifamily).
  - Byl ohlášen Forma Street Design.
  - Autodesk Construction Cloud se přesouvá do Formy a Revit je jejím prvním „Forma Connected Client“.

  — [Autodesk (japonská tisková zpráva)](https://digitalpr.jp/r/143600); [Autodesk – AU 2026 announcements](https://www.autodesk.com/solutions/autodesk-university-2026-product-announcements)
- Autodesk uvádí pět „Trust Principles“ pro AI, certifikaci ISO/IEC 42001 a „AI Transparency Cards“. — [Autodesk blog](https://www.autodesk.com/blogs/construction/autodesks-blueprint-for-trusted-ai-in-construction/)

**Graphisoft / Nemetschek (Archicad, ALLPLAN, Vectorworks, Solibri, Bluebeam)**
- Portfolio Graphisoftu pro rok 2026 přináší:
  - MCP konektivitu,
  - aktualizaci AI Visualizer s výběrem obrazových modelů včetně „Nano Banana Pro“,
  - rozšíření MEP Designer,
  - nové předplatné **Archicad Max**. Nabídka plánů je nyní Archicad Studio, Archicad Collaborate a Archicad Max.

  — [Engineering.com](https://www.engineering.com/graphisoft-updates-archicad-portfolio-with-ai-capabilities/); [Graphisoft Community](https://community.graphisoft.com/t5/Graphisoft-Insights/What-s-new-in-our-2026-Product-Portfolio/ba-p/716314)
- **AI Assistant (Beta)** v Archicadu umí jednat jako agent přes **Archicad MCP (Beta)** se strukturovaným přístupem k projektovým datům a BIM modelu. „Public Archicad MCP (Beta) Server“ zpřístupní model i desktopovým AI aplikacím třetích stran. — [Graphisoft Community](https://community.graphisoft.com/t5/Graphisoft-Insights/What-s-new-in-our-2026-Product-Portfolio/ba-p/716314); [Graphisoft Help – MCP Tech Preview](https://help.graphisoft.com/.beta2026/en/AI_Assistant_NewTopics/mcptechpreview.html)
- „AI Assistant Spaces“ mají asistenta ukotvit ve vlastních kancelářských standardech, knihovnách detailů a projektové dokumentaci. — [Architosh – Archicad 30 & Nemetschek Creator](https://architosh.com/2026/10/graphisoft-unveils-archicad-30-nemetschek-creator/)
- Archicad Max obsahuje agentního asistenta, veřejný MCP server a AI Visualizer. — [Graphisoft – Archicad Max](https://www.graphisoft.com/en-us/plans-and-products/archicad-max/)
- **Nemetschek Creator** je cloudová platforma pro rané fáze návrhu. Předplatitelé Max mají early access, plné komerční vydání teprve přijde. — [Architosh – IGNITE 2026](https://architosh.com/2026/10/graphisoft-ignite-2026-archicad-max-nemetschek-creator-cloud-innovation/)
- Zdroje se rozcházejí ve stavu MCP: Architosh a Engineering.com ho popisují jako plánovaný, stránky Graphisoftu jako beta, případně tech preview. — [Engineering.com](https://www.engineering.com/graphisoft-updates-archicad-portfolio-with-ai-capabilities/); [Graphisoft Help](https://help.graphisoft.com/.beta2026/en/AI_Assistant_NewTopics/mcptechpreview.html)
- Archicad AI Visualizer vznikl v roce 2023 jako experimentální doplněk pro Archicad 27 postavený na Stable Diffusion a vyžadoval GPU NVIDIA nebo Apple Silicon. Od Archicadu 28 se instaluje automaticky a běží v cloudu. — [AEC Magazine](https://aecmag.com/news/graphisoft-launches-archicad-ai-visualiser/); [Graphisoft – AI Visualizer download](https://graphisoft.com/my/downloads/archicad-ai-visualizer)
- Jedna stránka Graphisoftu uvádí, že AI Visualizer „currently works in English“. Datum stránky je nejisté. — [Graphisoft HK – AI Visualizer](https://graphisoft.com/hk/downloads/archicad-ai-visualizer)
- **Nemetschek AI Assistant** skupina představila na BAU 2025 pro ALLPLAN a Archicad jako svou první technologii založenou na AI agentech. Navazuje na „AI layer“ ohlášenou v říjnu 2024 a dostupný je od podzimu 2025. Později ho Nemetschek rozšířil do Vectorworks a postupně do všech svých značek. — [PBC Today](https://www.pbctoday.co.uk/news/digital-construction-news/construction-software-news/nemetschek-group-unveils-ai-assistant-integration-into-allplan-and-archicad/147401/); [Construction Management](https://constructionmanagement.co.uk/nemetschek-rolls-out-ai-assistant-across-its-software-brands); [Nemetschek – digitalBAU 2026](https://www.nemetschek.com/en/digitalbau-2026)
- ALLPLAN na digitalBAU 2026 předvádí AI Visualizer V2, AI Coder a Python API s podporou AI. — [Nemetschek – digitalBAU 2026](https://www.nemetschek.com/en/digitalbau-2026)
- Česká pobočka ALLPLAN v české tiskové zprávě popisuje ALLPLAN 2025 jako verzi s vizualizacemi řízenými AI pro rané i pozdější fáze. — [ALLPLAN Česko](https://www.allplan.com/cz/tiskove-zpravy/detail-zpravy/allplan-2025-revoluce-v-navrhovani-a-vystavbe-pomoci-nastroju-s-umelou-inteligenci-a-spoluprace-v-realnem-case/)
- **Vectorworks 2026** má dvě AI funkce:
  - AI Visualizer (od roku 2024). Zásadně ho vylepšil 2026 Update 3: model lépe drží hrany kompozice („edge-following“) a podporuje negativní prompty.
  - AI Assistant (Preview) v nápovědě, poprvé ve Vectorworks 2025 Update 5. Dřív byl popisován jako postavený na ChatGPT API, podle Architosh nyní běží na proprietárním datasetu.

  Vectorworks spolupracuje i s Veras. — [Architosh](https://architosh.com/2025/12/product-review-vectorworks-architect-2026/); [Vectorworks – 2026 Update 3](https://www.vectorworks.net/newsroom/2026-update-3); [Vectorworks Help](https://app-help.vectorworks.net/2026/eng/VW2026_Guide/LandingPage/New_features.htm); [AEC Magazine](https://aecmag.com/news/vectorworks-launches-ai-assistant-preview/); [RIBAJ](https://ribaj.com/products/vectorworks-design-day); [PBC Today – Veras partnership](https://www.pbctoday.co.uk/news/digital-construction-news/bim-news/vectorworks-inc-strengthens-ai-capabilities-veras-partnership/139042/)
- **Solibri 26.6** (červen 2026) má v desktopu AI asistenta v betě. Rozumí dotazům v přirozeném jazyce a provádí úkony přímo v otevřené relaci. Podle FAQ je dostupný jen v Solibri Premium, podle help centra v Premium i Enterprise. Součástí je i Solibri MCP Server. — [Solibri release notes June 2026](https://www.solibri.com/articles/solibri-release-notes-june-2026); [Solibri AI assistant](https://www.solibri.com/solutions/bim-quality-assurance/solibri-ai-powered-assistant); [Solibri Help](https://help.solibri.com/hc/en-us/articles/42109674663959-AI-Chatbot-Beta); [Solibri Help – AI](https://help.solibri.com/hc/en-us/sections/42109672644247-AI)
- **Bluebeam Max** (prémiové předplatné Revu) je globálně dostupný od 19. 5. 2026. Obsahuje:
  - Smart Review (preview), který má hledat chybějící popisky, chyby v návrhu a mezery v rozsahu prací,
  - „Magic Markup“,
  - MCP integraci, která vyžaduje Claude Desktop; od června 2026 i GitHub Copilot CLI a AnythingLLM.

  Desktopové Revu běží jen na Windows. Bluebeam koupil startup mbue. — [Bluebeam Press](https://press.bluebeam.com/2026/05/bluebeam-max-launches-globally-bringing-ai-powered-productivity-to-aec-teams-everywhere/); [Novedge](https://novedge.com/products/buy-bluebeam-max); [ATG USA](https://atgusa.com/whats-new-in-bluebeam-june-2026/); [Geo Week News](https://www.geoweeknews.com/?p=43402)

#### 1.2 Akvizice a nabídky
- Joist AI se 2. 6. 2026 přejmenoval na **Kantiv**. Uvádí 200 klientů z AEC, mezi nimi každou pátou firmu z ENR Top 50 design firms (údaj firmy). — [Simplify – Kantiv](https://simplify.jobs/c/Kantiv)
- Joist/Kantiv rozebírá RFP, vytahuje z nich požadavky a pomocí AI k nim páruje referenční projekty. Marketing slibuje „75% faster proposal creation“. — [Joist.ai](https://www.joist.ai/)
- OpenAsset **Shred.ai** dostal v lednu 2026 velkou aktualizaci: rychle dohledá obsah z minulých nabídek, pomáhá psát a upravovat a vkládá fotografie projektů. Podle třetí strany umí i Go/No-Go analýzu RFP a kontrolu požadavků. — [Construction Dive](https://constructiondive.com/press-release/20260114-openasset-launches-major-shredai-updates-to-accelerate-aec-proposal-develo); [SoftwareOne](https://platform.softwareone.com/product/shredai/PCP-5035-2083)
- Srovnání od OpenAsset (tedy zaujaté) uvádí Shred, Kantiv, Loopio, AutogenAI a Unanet GrowthStudio. — [OpenAsset](https://openasset.com/resources/best-ai-proposal-writing-tools-aec/)
- Na rychlé studie proveditelnosti v nabídkové fázi: TestFit má Generative Design s „Custom Pricing“ a Forma Site Design je v předplatném Revitu. — [TestFit](https://testfit.io/product/product-comparison); [IT Brief](https://itbrief.com.au/story/autodesk-launches-forma-building-design-for-revit-links)

#### 1.3 Zadání a komunikace s klientem
- **Beey** (česká firma NEWTON Technologies) používá Poslanecká sněmovna od září 2024 k přepisům jednání. Stenografové teď strojový přepis hlavně upravují. — [PSP ČR](https://psp.cz/zprava/19978)
- Beey umí rozpoznat, kdo mluví. — [Lupa.cz](https://www.lupa.cz/clanky/ondrej-klimes-newton-technologie-beey-dokaze-rozpoznat-ktery-poslanec-mluvi/)
- V základním modelu stojí Beey 3 Kč + DPH za minutu nahrávky. Firmy mají individuální profily. — [CzechCrunch](https://cc.cz/umela-inteligence-konecne-umi-to-v-co-jsme-doufali-vyresila-bolehlav-novinaru/)
- Justice používá Beey k přepisům soudních jednání (projekt z NPO). Výstup jde exportovat do DOCX či PDF i s časovými značkami mluvčích. — [kvalitavs.gov.cz](https://kvalitavs.gov.cz/evt_file.php?file=772)
- Zápis z porady jde vytvořit běžným chatbotem z přepisu a pokynů. Výstup je ale nutné zkontrolovat. — [FlowHunt (cs)](https://www.flowhunt.io/cs/akademie/meeting-minutes/)

#### 1.4 Průzkum místa
- Forma Site Design je v předplatném Revitu a od AU 2026 odpovídá na dotazy v přirozeném jazyce přes Autodesk Assistant. — [IT Brief](https://itbrief.com.au/story/autodesk-launches-forma-building-design-for-revit-links); [Autodesk (JP)](https://digitalpr.jp/r/143600)
- TestFit podle agregátoru stojí cca 833 USD měsíčně za Site Solver a 1 250 USD měsíčně za Site Solver Portfolio. — [PricingSaaS](https://pricingsaas.com/companies/testfit)
- České datové zdroje k pozemkům mapuje samostatná rešerše v tomto repu (`research_notes/AI rešerše pozemku pro architekty/`). Přístup k právním předpisům rozebírá oddíl 5.

#### 1.5 Koncept a hmota
- **Hypar** (AEC Magazine, 28. 4. 2026) sází na „lightweight, inference-first approach, leveraging large-language models to understand and generate building elements on the fly“. Zda se tento přístup uchytí, mají ukázat piloty na NXT BLD 2026. — [Pulse (převzato z AEC Magazine)](https://www.pulse.bot/ai/news/hypars-big-bet-against-schema-3a747488-bb52-4f5c-8d69-a02a4e14343c/)
- Hypar je freemium a katalog ho řadí do kategorie „Copilot (human-in-loop)“ (aktualizace 31. 7. 2026). — [CO/AI](https://getcoai.com/tool-detail/hypar/164177/)
- Newsletter z června 2026 píše, že praktici vidí reálnou úsporu času. Jako slabiny uvádí nevyřešenou odpovědnost a slabé navrhování přes chat. Citace uživatele: „Hypar isn't about replacing design judgment; it's about removing friction.“ — [The Seam](https://buttondown.com/Theseamnews/archive/the-seam-special-edition-june-1-2026/)
- **Snaptrude** podle AEC Magazine (3. 3. 2026) investuje do AI pro konceptuální a schematickou fázi. Series A ve výši 14 mil. USD (Foundamental, Accel) přišla po seedu 6,6 mil. USD. Nové kolo z roku 2026 jsem nenašel. — [AEC Magazine](https://aecmag.com/featured/snaptrude-on-ai/); [Foundamental](https://www.foundamental.com/perspectives/building-design-startup-snaptrude-raises-14-million-led-by-foundamental-accel)
- **Arcol** je BIM v prohlížeči („Figma for BIM“), oficiálně spuštěný v červnu 2025. V dubnu 2026 přidal agenty pro odhady nákladů pro generální dodavatele („Consigliere model“). Má případovou studii se SERA Architects. — [Nomic](https://www.nomic.ai/glossary/arcol); [AEC Magazine](https://aecmag.com/bim/arcol-unleashed-bim-2-0/); [Pulse – GC](https://www.pulse.bot/construction/news/arcols-play-for-general-contractors-d9a234fb-1143-4138-9f14-2286dd57ce67/); [Pulse – SERA](https://www.pulse.bot/proptech/news/arcol-helps-sera-architects-boost-collaboration-d3d0629b-1c24-4d37-82c0-6d0e3c238bc2/)
- **Motif** založili v roce 2023 Amar Hanspal a Brian Mathews, oba bývalí lidé z Autodesku, a získali 46 mil. USD. Streamuje modely z Revitu a Rhina do sdíleného cloudového plátna s AI renderem. V roce 2026 představil **Motif Design** jako „the first agent-native building design software platform“ (vlastní označení). — [TechCrunch](https://techcrunch.com/2025/01/30/ex-autodesk-execs-snag-46m-to-build-the-next-gen-of-architecture-design); [Business Wire](https://www.businesswire.com/news/home/20250326740027/en); [01net](https://www.01net.it/motif-introduces-motif-design-the-first-agent-native-building-design-software-platform/)
- Průzkum BuiltWorlds 2026 pro rané fáze uvádí: „Test Fit Technology shows the strongest traction with 42.9% of respondents using it on several or more projects“. Není jasné, zda jde o kategorii nástrojů, nebo o značku TestFit. — [BuiltWorlds](https://builtworlds.com/insights/2026-building-tech-early-concept-feasibility-stage-tech-specialty-report/)
- **ArkDesign** automatizuje studie a ověření proveditelnosti bytových a smíšených domů podle amerických předpisů. Prováděcí dokumentaci nedělá. Je freemium, podle třetí strany cca 50 USD za uživatele měsíčně. — [ArkDesign FAQ](https://arkdesign.ai/faq/); [Nomic](https://www.nomic.ai/compare/arkdesign-alternatives)
- Podle ESTAV se v ateliérech stále častěji objevují Midjourney, Stable Diffusion a DALL·E na převod textu do obrazu. — [ESTAV](https://www.estav.cz/cz/14311.ai-a-architektura-jak-umela-inteligence-meni-komplexni-obor-na-pomezi-umeni-a-techniky)

#### 1.6 Dispozice (layout planning)
- **Finch3D** vznikl v roce 2019. Automaticky generuje půdorysy, dává zpětnou vazbu a optimalizuje návrh vzhledem k předpisům. Generate Floor Plate 2.0 z roku 2024 zohledňuje hloubku traktu a podíl oboustranně orientovaných bytů. — [Nomic](https://www.nomic.ai/glossary/finch3d); [Architosh 2024](https://architosh.com/2024/09/finch3d-advances-ai-based-floor-plan-generator/)
- Recenze Finch z roku 2026 popisuje centrální „Plan Library“ se standardy firmy a AI agenta „Archie“ na kontrolu souladu. Enterprise verze má stát 14 500 EUR ročně za 3 licence; tento údaj je jen z jednoho zdroje třetí strany. Finch má návody pro Revit a Archicad a „AI Co-Pilot“ pro kreslení půdorysů. — [Tooliverse](https://tooliverse.ai/tools/finch3d); [Finch docs](https://docs.finch3d.com/courses/workflows/drawing-and-generating-floor-plans-in-finch/drawing-a-floor-plan-with-ai-co-pilot)
- **Maket** generuje půdorysy rodinných domů ze zadání v přirozeném jazyce. V červnu 2026 přidal funkci Auto-Complete, která dokončí rozpracovaný půdorys a zachová už umístěné místnosti. Ceny se mezi zdroji liší (cca 20–30 USD měsíčně). Firma získala 3,4 mil. USD. — [Maket blog](https://www.maket.ai/blog/how-to-use-maket); [TestingCatalog](https://www.testingcatalog.com/maket-debuts-auto-complete-for-generating-residential-floor-plans.md); [Illustrarch](https://illustrarch.com/articles/design-softwares/73352-maket-ai-review.html); [BetaKit](https://betakit.com/?p=395893)
- Vlastní průvodce Maketu přiznává, že žádný AI generátor půdorysů dnes nevytváří výkresy, které by stavební úřad přijal do povolovacího řízení. Recenze doporučuje kontrolovat návaznosti místností ručně a zmiňuje čekací listinu na v2 (začátek 2026). — [Maket – guide 2026](https://www.maket.ai/blog/ai-floor-plan-generator-guide-2026); [Tooliverse](https://tooliverse.ai/tools/maket)
- **Higharc** (americký trh, developeři rodinných domů) získal 30. 6. 2026 Series C ve výši 95 mil. USD vedenou Insight Partners; celkem už přes 170 mil. USD. SiliconANGLE psal o 90 mil. USD. Platforma ukládá domy jako prostorové databáze. Nástroj AutoTranslate převádí 2D půdorys na 3D model a AI Estimating generuje výkazy materiálu pro distributory (první partner US LBM). Higharc je ve Fast Company Most Innovative 2026 a na 517. místě Inc. 5000. — [Higharc](https://higharc.com/newsroom/higharc-95m-series-c-for-homebuilding-ai); [SiliconANGLE](https://siliconangle.com/2026/07/01/homebuilding-ai-startup-higharc-bags-90m-series-c-funding/); [Higharc – Inc. 5000](https://www.higharc.com/newsroom/higharc-rapid-growth-earns-the-517-spot-on-the-2026-inc-5000)
- Forma Building Layout Explorer (AU 2026) generuje varianty dispozic, ale jen pro bytové domy. — [Autodesk (JP)](https://digitalpr.jp/r/143600)

#### 1.7 Vizualizace a prezentace
- **Veras**: Chaos koupil 20. 2. 2025 EvolveLAB a získal tím Veras. EvolveLAB dělal AI nástroje pro vizualizaci, generativní návrh, dokumentaci a interoperabilitu. — [CGChannel](https://www.cgchannel.com/tag/glyph); [Jon Peddie](https://www.jonpeddie.com/news/chaos-acquires-aec-ai-toolmaker-evolvelab/)
- Ceny Veras: Pro cca 29 USD měsíčně při ročním placení (348 USD), britský prodejce nabízí měsíční plán za 48 GBP a recenze z poloviny 2026 odhaduje 30–70 USD měsíčně. Chaos Credits se čerpají za Veras, AI Upscaler, AI Enhancer i cloudový rendering a s předplatným se každý měsíc obnovují. — [AI Tools Atlas](https://aitoolsatlas.ai/tools/veras/pricing); [CAD Software Direct](https://www.cadsoftwaredirect.com/?p=9503); [AI Tools Bakery](https://aitoolsbakery.com/blog/veras-review/); [NTI – Chaos credits](https://www.nti-group.com/ie/products/other-products/chaos/credits/)
- Článek z 29. 5. 2026 s titulkem „Chaos puts Veras everywhere“ naznačuje, že Chaos Veras integruje do dalších produktů. Detaily jsem nezískal. — [Digital Production](https://digitalproduction.com/2026/05/29/chaos-puts-veras-everywhere/)
- **Enscape**: Chaos AI Enhancer je v Enscape od verze 4.1 a vylepšuje hlavně postavy a zeleň. Funguje jen s neztrialovou licencí, maximálně v rozlišení 2048×2048. Ve verzi 4.2.1 jde výstupy spravovat v Chaos Cloud. Článek z ledna 2026 ho ještě uvádí jako preview, což odporuje dokumentaci. — [AEC Magazine](https://aecmag.com/visualisation/enscape-4-1-launches-with-chaos-ai-enhancer/); [Enscape blog](https://blog.enscape3d.com/introducing-chaos-ai-enhancer); [Enscape Learn](https://learn.enscape3d.com/?p=63408); [Novedge](https://novedge.com/blogs/design-news/elevate-your-enscape-visuals-with-chaos-ai-enhancer-experience-enhanced-realism-in-preview)
- **D5 Render 3.0** (leden 2026) přináší tyto AI funkce:
  - image-to-3D (navazuje na text-to-3D z verze 2.7),
  - AI Agent pro sladění scény a doporučení assetů,
  - AI Atmosphere pro popis prostředí přirozeným jazykem,
  - AI Smart Scatter, který rozmísťuje stromy, lidi a auta podle kontextu,
  - AI Super Resolution až do 4K/8K.

  Community verze je zdarma, Pro stojí 38 USD měsíčně nebo 360 USD ročně. — [CGChannel](https://www.cgchannel.com/?p=173279); [D5 Render](https://www.d5render.com/posts/d5-render-3-0-ai-rendering-design-workflow); [CGPress](https://cgpress.org/archives/d5-render-3-0-introduces-ocean-simulation-volumetric-clouds-ai-tools-and-more.html)
- **Gendo** je AI rendering v prohlížeči, určený pro architekty, s týmovou spoluprací. V roce 2026 získal Architizer Award za nejlepší AI nástroj pro iterace návrhu. Materiály mění jedním kliknutím. Podle třetí strany přidal v srpnu 2026 Canvas a video a v červnu 2026 integraci Material Bank (16 000 materiálů od 50 značek); v únoru 2026 nabízel „unlimited rendering“. Gendo založili v roce 2022 George Proud a Will Jones a v roce 2024 získal seed 5,1 mil. EUR. — [Gendo vs Enscape](https://gendo.ai/gendo-vs-enscape.md); [Gendo – Architizer](https://www.gendo.ai/architizer); [NeuronFeed](https://neuronfeed.com/startups/gendo); [Gendo – press](https://www.gendo.ai/resources/press)
- **LookX** stojí na modelu GEN-3. Firma tvrdí, že jde o první model, který prošel „Architect Turing Test“ (neověřené tvrzení firmy). Umožňuje trénovat vlastní modely. Pluginy má pro SketchUp a Rhino, pro Revit, Archicad ani Vectorworks ne. Spoluzakladatelka a CEO je Wanyu He a LookX je sesterskou firmou Xkool. — [LookX V3.0](https://lookx.notion.site/LookX-AI-V3-0-is-released-146610be128d80f9aa3fc79d9111a191); [Knowara](https://knowara.com/ai-tools/image/lookx-ai-review/); [Dezeen](https://www.dezeen.com/2023/07/14/lookx-wanyu-he-ai-interview-aitopia/)
- **Krea** vydal v říjnu 2025 model Krea Realtime 14B pro generování videa v reálném čase. Funkce Realtime Edit umožňuje malovat na plátno nebo streamovat webkameru či obrazovku a živě je upravovat pomocí AI. — [Krea blog](https://krea.ai/blog)
- **Midjourney** vydal 17. 3. 2026 alfa verzi V8. Verze V8.1 je stabilní od 14. 4. 2026 a obecně dostupná od 30. 4. a přidala HD výstup. V8.2 je nyní výchozí a popisuje se jako „aesthetics-and-personalization“ release. The Decoder: „5x faster generation but charges 4x more for its best features“. — [Wikipedia](https://en.wikipedia.org/wiki/Midjourney); [The Decoder](https://the-decoder.com/midjourney-v8-rolls-out-with-5x-faster-generation-but-charges-4x-more-for-its-best-features/); [Medium](https://medium.com/@inchristiely/midjourney-v8-2-is-now-the-default-five-things-that-changed-30c8dffcc492)
- Pražské MA Studio vyvíjí přes svůj start-up **Rendero** vlastní AI aplikaci na rychlé renderování architektonických vizualizací. — [MA Studio](https://www.ma-studio.cz/en/clanek/rendero-ai-our-ai-solution/); [HN](https://archiv.hn.cz/c1-67699740-ai-pomaha-vytvaret-navrhy-domu-musi-se-na-ni-ale-dohlizet)

#### 1.8 BIM modelování
- Autodesk Assistant (Revit 2027, tech preview) a Archicad AI Assistant s MCP (beta) popisuje oddíl 1.1.
- **ArchiLabs** (Y Combinator) začínal jako AI co-pilot přímo v Revitu, který spouštěl automatizační skripty v Pythonu. Dnes se podle vlastního blogu prezentuje jako samostatná webová parametrická CAD platforma postavená na kódu, „not a plugin“. Zaměřuje se na datová centra. Na G2 neměl v době hledání žádné recenze. — [Y Combinator](https://www.ycombinator.com/launches/MIO-archilabs-ai-copilot-for-architects); [ArchiLabs](https://archilabs.ai/posts/revit-alternatives-for-2026-data-center-bim-managers); [F4 Fund](https://f4.fund/startups/archilabs-7ab6); [G2](https://www.g2.com/products/archilabs/reviews)
- **Constriq** je první spin-off Fakulty stavební ČVUT (únor 2026). Jeho Cloud2BIM převádí mračna bodů ze skenování budov na IFC modely a AI verze se připravuje. — [Feedit](https://www.feedit.cz/2026/02/02/fakulta-stavebni-cvut-ma-prvni-spin-off-spolecnost-constriq-se-zameri-na-automatizaci-digitalizace-existujicich-budov-pomoci-umele-inteligence-a-podstatne-usnadni-preddemolicni-audity-i-pripravu-reko/)
- Higharc AutoTranslate převádí 2D půdorys na 3D prostorový model. — [Higharc](https://higharc.com/newsroom/higharc-95m-series-c-for-homebuilding-ai)
- **RMind BIM** se prezentuje jako BIM platforma s AI vrstvou pro analýzu půdorysů, kontrolu kolizí a výkazy výměr, vyvinutá v ČR. Jde jen o tvrzení výrobce. — [RMind BIM](https://bim.rmind.ai/)
- Podle ESTAV dnes model dokáže sám zvládnout dřív ruční činnosti v BIM, jako je doplňování dat, kontrola kolizí a přepis výstupů. — [ESTAV](https://www.estav.cz/cz/14311.ai-a-architektura-jak-umela-inteligence-meni-komplexni-obor-na-pomezi-umeni-a-techniky)

#### 1.9 Výkresy a dokumentační sady
- **Swapp** automatizuje tvorbu prováděcí dokumentace (construction documents) s napojením na Revit a umí změny promítnout napříč celým modelem. Učí se na projektech konkrétní firmy a zvládá rozsah od schémat po kompletní sady výkresů. — [Nomic](https://www.nomic.ai/glossary/swapp); [AEC+Tech](https://www.aecplustech.com/blog/swapp-the-ai-co-pilot-for-construction-documentation)
- Financování Swappu: Archinect píše o kole 11,5 mil. USD a celkem 18,5 mil. USD. Startupová databáze uvádí celkem 21,3 mil. USD s posledním kolem Series A v květnu 2023 a firmu vede pod adresou „buildos“. Zprávy z roku 2026 jsem nenašel. — [Archinect](https://archinect.com/news/article/150350727/swapp-raises-11-5-million-for-tool-that-offers-ai-powered-construction-documents-in-minutes); [Startupim](https://startupim.com/company/buildos)
- Portfolio EvolveLAB, dnes součást Chaos, zahrnovalo i „automated AI documentation“. Stav produktu Glyph v roce 2026 jsem nezjistil. — [Jon Peddie](https://www.jonpeddie.com/news/chaos-acquires-aec-ai-toolmaker-evolvelab/)
- Revit Assistant umí popisky, pohledy a výkazy. AU 2026 ohlásil „AI-powered room and documentation workflows“. — [Symetri](https://www.symetri.co.uk/insights/blog/what-s-new-in-revit-2027-a-guide-to-the-latest-features/); [Autodesk News](https://adsknews.autodesk.com/en/news/autodesk-forma-ai-aec-connected-workflows-2026/)
- Bluebeam Max Smart Review (preview) hledá ve výkresech chybějící popisky a mezery v rozsahu. — [Novedge](https://novedge.com/products/buy-bluebeam-max)

#### 1.10 Specifikace a technické zprávy
- **Deltek Specpoint** je cloudový systém s AIA MasterSpec a přes 900 předpřipravenými oddíly specifikací. Asistent „Ask Dela“ odpovídá na dotazy ke specifikacím a výrobkům a funkce „Best Practices“ uplatňuje interní standardy a požadavky investora. Deltek cituje firmu MEA Consulting Engineers, která prý píše specifikace za méně než 75 % původního času (neověřeno). Word verze SpecText končí 30. 6. 2026 a od 1. 7. 2026 jsou aktualizace jen ve Specpointu. — [AIA](https://www.aia.org/resource-center/shaping-future-six-key-benefits-ai-specifications); [Deltek – AIA26](https://www.deltek.com/en/blog/specpoint-aia26)
- Výzkum spojený s AIA uvádí, že přes 50 % firem zkoumá AI pro specifikace. — [Deltek – AI in specs](https://www.deltek.com/en/blog/ai-in-specs)
- **UpCodes Specifications** (31. 3. 2026) propojuje předpisy se specifikacemi (code-to-spec) a cílí na americký trh. — [Pulse](https://www.pulse.bot/proptech/news/upcodes-unveils-ainative-specifications-tool-to-cut-us-construction-compliance-risks-31e7b681-9316-4271-a8af-8e7354c6dac0)
- **QIK Dokumentace** (ČR) pomáhá projektantům předvyplnit technické zprávy z nahraných podkladů a pracuje s dokumentací podle vyhlášky 131/2024 Sb. Zatím se soustředí hlavně na technické zprávy. Zdroj je jediný. — [Stavitel](https://stavitel.cz/ekonomika/projektant-ma-projektovat-rutinu-muze-prevzit-umela-inteligence/)

#### 1.11 Kontrola souladu s předpisy
- **UpCodes Copilot** má podle vlastního testu „93% weighted accuracy across major code families“ (interní benchmark výrobce). V prosinci 2025 přišel Copilot Intelligence jako „first project-aware AI built for the AEC industry“. Odpovědi odkazují na konkrétní přijaté paragrafy a nástroj umí generovat kontrolní seznamy. — [UpCodes Copilot](https://cms-v2.up.codes/features/copilot); [Building Enclosure](https://www.buildingenclosureonline.com/articles/94432-upcodes-unveils-copilot-intelligence); [UpCodes AI](https://cms-v2.up.codes/features/ai)
- **Archistar eCheck** kontroluje soulad se stavebními a územními předpisy z 2D a 3D podání a používá ho přes 25 samospráv, mimo jiné Vancouver, Austin a Los Angeles. Austin po tříměsíčním pilotu podepsal pětiletou smlouvu jako první americké město. ICC spolupracuje s Archistar a navazuje na pilot s 11 americkými městy. Computronix eCheck integruje do systému POSSE PLS. Tvrzení o zkrácení posuzování „až o 90 %“ je neověřené. — [Archistar](https://www.archistar.ai/for-government/); [GovLaunch](https://govlaunch.com/projects/austin-tx-evaluates-the-impacts-of-archistars-echeck-assessment-tool-on-permit-review-times); [SmartCitiesWorld](https://www.smartcitiesworld.net/planning-and-redevelopment/austin-uses-ai-to-automate-building-permit-process-10822); [ICC](https://www.iccsafe.org/about/periodicals-and-newsroom/international-code-council-collaborates-with-archistar-to-modernize-permitting-and-accelerate-housing-development); [Newswire](https://www.newswire.com/news/computronix-and-archistar-announce-strategic-partnership-22192739)
- **CodeComply.Ai** spolupracuje s CivicPlus od 19. 3. 2026. Hodnotí soulad pomocí AI, porovnává verze, spravuje připomínky a dělá předkontrolu podle IBC, IMC, IPC, IRC, ADA a NFPA. Je to podpůrný nástroj, kvalifikovaným posuzovatelům má zachovat jejich odborné rozhodování. Výrobce slibuje zkrácení posuzování „z měsíců na minuty“. Firma je v kooperativním kontraktu TXShare a objevuje se v průvodci Florida League of Cities (srpen 2026). — [CivicPlus](https://www.civicplus.com/news/nn/civicplus-brings-ai-building-plan-review-codecomply-ai/); [TXShare](https://txshare.nctcog.org/available-contracts/artificial-intelligence-ai-building-and-plan-review-software/codecomply-ai); [FLCities](https://www.flcities.com/wp-content/uploads/2026/08/Buyers-Guide-AI-Tools-for-Building-Permitting.pdf)
- Solibri (pravidlová kontrola IFC modelů) má od 26.6 AI asistenta v betě (viz 1.1). Finch3D má AI agenta „Archie“ na kontrolu souladu (viz 1.6).

#### 1.12 Rozpočet a výkaz výměr
- **Togal.AI**: recenze opakují tvrzení výrobce o „98% accuracy“ a pětkrát rychlejších výkazech. Nezávislý benchmark jsem nenašel. Přesnější je nad CAD výkresy než nad skeny. Problémy má se složitými výkresy TZB a s nestandardními značkami. Agregátory uvádějí 199–299 USD za uživatele měsíčně, případně 1 999 a 2 999 USD ročně; jiný odhad je 3 600–5 000 USD. — [B2B Sales Tools](https://b2bsalestools-com.pages.dev/tools/togal-ai/); [Construction AI Tools – AI vs manual](https://constructionaitools.pages.dev/estimation/ai-vs-manual-takeoff-comparison); [ConstructionPlacements](https://www.constructionplacements.com/best-quantity-takeoff-software/); [Construction AI Tools – pricing](https://constructionaitools.pages.dev/estimation/construction-ai-pricing-guide)
- Higharc AI Estimating generuje výkazy materiálu z výkresových sad stavebníků pro distributory. Arcol nabízí generálním dodavatelům agenty pro odhady. RMind BIM (ČR) uvádí výkazy výměr. — [Higharc](https://higharc.com/newsroom/higharc-95m-series-c-for-homebuilding-ai); [Pulse – Arcol](https://www.pulse.bot/construction/news/arcols-play-for-general-contractors-d9a234fb-1143-4138-9f14-2286dd57ce67/); [RMind BIM](https://bim.rmind.ai/)
- V ČR je KROS (ÚRS Praha) nejrozšířenějším systémem pro oceňování stavebních prací a cenová soustava ÚRS má přes 170 000 položek. O AI funkcích v KROS/ÚRS jsem nic nenašel. — [VŠTE – studijní opora](https://is.vstecb.cz/do/vste/pr/IPV/rs/zp/opora.pdf?kod=ACJ_1)

#### 1.13 Koordinace a kontrola kolizí
- **Revizto** automaticky seskupuje kolize: stovky souvisejících kolizí sloučí do jednoho issue, sám issue zakládá a sleduje. — [Revizto](https://revizto.com/product/collaborative-clash-automation)
- **Navisworks** seskupuje kolize podle pravidel a tolerancí; další automatické seskupování přidávají doplňky. — [Symetri US](https://www.symetri.us/insights/blog/next-generation-clash-detection); [Newforma Konekt](https://konekt.help.newforma.com/?p=26106)
- Nomic uvádí příklad, kdy AI klasifikátor zredukoval 45 000 kolizí na 312 řešitelných položek, ale bez nezávislého zdroje. Tvrzení, že AI kolize i navrhne vyřešit, pocházejí od výrobců. — [Nomic](https://www.nomic.ai/glossary/ai-clash-detection)
- **Augmenta** (elektroinstalace, Toronto) vydala 17. 6. 2026 ACP 2.0 jako obecně dostupnou verzi s podzemním vedením tras. ENR popsal školní projekt, kde trasy elektrických chrániček navrhla a koordinovala AI Augmenty. Poslední financování, které jsem našel, je seed extension 11,75 mil. USD. Akvizici jsem nenašel. — [Augmenta ACP 2.0](https://lifestyle.mmminimal.com/story/723854/augmenta-releases-acp-2-0-the-complete-ai-native-design-environment-built-to-multiply-electrical-vdc-team-output-and-capacity/); [ENR](https://www.enr.com/articles/62433-augmenta-ai-helps-organize-electrical-work-on-school-jobs); [The Logic](https://thelogic.co/briefing/toronto-based-augmenta-raises-us11-75m-in-seed-extension/)

#### 1.14 Výběr zhotovitele (tendering) a smlouvy
- **Document Crunch**: produkt Contract CoPilot (engine CrunchAI) hledá v kontraktech rizikové klauzule a překládá je do srozumitelné řeči. Výrobce uvádí zkrácení revize „až o 80 %“. Trimble ohlásil převzetí firmy; datum ani dokončení jsem neověřil. Mezi investory je Nemetschek. — [Nomic](https://www.nomic.ai/glossary/document-crunch); [For Construction Pros](https://www.forconstructionpros.com/business/labor-workforce-development/article/22963945/trimble-solutions-usa-trimble-to-acquire-document-crunch-to-expand-ai-risk-management-in-construction); [Simplify](https://simplify.jobs/c/Document-Crunch)
- Procore Contract Review agent (květen 2026) popisuje oddíl 1.15.

#### 1.15 Stavba, technický a autorský dozor, kontrolní dny
- **Procore** v květnu 2026 představil agenty Deep Search, Submittals, RFI, Daily Log a Contract Review, postavené na koupené firmě Datagrid. Spouštějí se automaticky při událostech, jako je nový submittal, RFI nebo změnový list. Submittal Reviewer kontroluje dodávky proti specifikacím. Podle Pulse jsou agenti v private betě a širší nasazení má přijít později v roce 2026. Datagrid se sám označuje jako „a Procore Company“. — [Business Wire](https://www.businesswire.com/news/home/20260521183451/en/New-Procore-AI-Experience-Embeds-Datagrid-into-Procore); [Procore](https://www.procore.com/press/new-procore-ai-experience-embeds-datagrid-into-procore); [Datagrid](https://datagrid.com/blog/automate-ineight-document-version-project-controls-specialists); [Pulse](https://www.pulse.bot/proptech/news/procore-deploys-ai-workflow-agents-to-automate-rfis-submittals-and-daily-logs-6def3197-9118-40ff-8b4c-dc20e148314f/)
- RFI Creation Agent ohlásil Procore už na Groundbreak 2025. CTO Buro Happold odhaduje, že AI zkrátí tvorbu a odpovědi na RFI i revizi submittalů o 50 %; jde o odhad partnera, ne o měření. — [Business Wire 2025](https://www.businesswire.com/news/home/20251015796723/en/Procore-Advances-the-Future-of-Construction-with-New-AI-Innovations-at-Groundbreak-2025); [Pulse](https://www.pulse.bot/proptech/news/procore-deploys-agentic-ai-in-its-common-data-environment-to-cut-rfi-work-by-50-33e7d3ba-825c-4f8e-9575-73ede1bff844/)
- **PlanRadar** připíná závady a úkoly přímo do výkresů a BIM modelů s fotkami, videem i hlasovými poznámkami a generuje z nich reporty. AI Assistant na tvorbu reportů přišel v lednu 2025. Zákaznický příběh výrobce slibuje „Defect reports: 10 minutes instead of 2 hours“. — [Yespress](https://yespress.io/planradar); [PlanRadar](https://planradar.com/?p=458047)
- ALICE Technologies (plánování výstavby s AI, zakladatel Čechoameričan) přesunula celý vývojový tým do ČR. Zdroj je z roku 2023. — [CzechCrunch](https://cc.cz/cechoamerican-uci-svet-planovat-stavby-s-umelou-inteligenci-na-svuj-projekt-ziskal-pres-700-milionu/)
- Na přepis kontrolních dnů lze použít Beey (viz 1.3).

#### 1.16 Administrativa kanceláře
- Podle RIBA 2026 používá AI k řízení praxe (practice management) 32 % uživatelů AI. — [Project Flux](https://www.projectflux.ai/p/riba-ai-report-2026-74-of-practices-now-use-ai); [Beale & Co](https://beale-law.com/article/riba-ai-report-2026-charts-the-growing-role-of-artificial-intelligence-in-architectural-practice/)
- AI VESTA (ČR) nabízí projektantům a architektům hlavně školení a pomoc s pracovními postupy, ne vlastní produkt. — [AI VESTA](https://www.aivesta.cz/)

#### 1.17 Přehled stavu vybraných nástrojů k 10/2026

| Nástroj | Fáze | Stav | Cena (pokud známa) | Trh / jazyk | Zdroj |
|---|---|---|---|---|---|
| Autodesk Assistant (Revit 2027) | BIM, dokumentace | Tech Preview; nová generace předvedena na AU 2026, nasazení od 2027 | součást Revitu | globální; čeština neověřena | [Autodesk](https://www.autodesk.com/blogs/aec/2026/04/22/autodesk-assistant-in-revit-tech-preview/), [Autodesk IR](https://investors.autodesk.com/news-releases/news-release-details/autodesk-advances-agentic-ai-its-three-industry-clouds) |
| Autodesk Forma (Site/Building Design, Board) | místo, koncept | aktivní a rozšiřuje se; Building Design od 4/2026 | v předplatném Revitu | globální | [IT Brief](https://itbrief.com.au/story/autodesk-launches-forma-building-design-for-revit-links) |
| Archicad AI Assistant + MCP | BIM | beta / tech preview, v plánu Archicad Max | nezjištěno | jazyk neověřen | [Graphisoft](https://community.graphisoft.com/t5/Graphisoft-Insights/What-s-new-in-our-2026-Product-Portfolio/ba-p/716314) |
| Archicad AI Visualizer | vizualizace | aktivní, v cloudu od AC28, nové modely 2026 | v Archicadu / Max | „currently works in English“ | [Graphisoft](https://graphisoft.com/hk/downloads/archicad-ai-visualizer) |
| Nemetschek Creator | koncept | early access (Max) | nezjištěno | – | [Architosh](https://architosh.com/2026/10/graphisoft-ignite-2026-archicad-max-nemetschek-creator-cloud-innovation/) |
| Vectorworks AI Visualizer / AI Assistant | vizualizace, nápověda | aktivní / Preview | nezjištěno | – | [Architosh](https://architosh.com/2025/12/product-review-vectorworks-architect-2026/) |
| Hypar | koncept | aktivní, přechod na přístup „inference-first“ s LLM | freemium | – | [Pulse](https://www.pulse.bot/ai/news/hypars-big-bet-against-schema-3a747488-bb52-4f5c-8d69-a02a4e14343c/) |
| TestFit | proveditelnost | aktivní | Custom; Site Solver cca 833 USD/měs. (agregátor) | US | [TestFit](https://testfit.io/product/product-comparison) |
| Finch3D | dispozice | aktivní (Plan Library, agent Archie) | cca 14 500 EUR/rok za 3 licence (třetí strana) | – | [Tooliverse](https://tooliverse.ai/tools/finch3d) |
| Snaptrude | koncept, BIM | aktivní | nezjištěno | – | [AEC Magazine](https://aecmag.com/featured/snaptrude-on-ai/) |
| Arcol | koncept, BIM | aktivní (od 6/2025) | nezjištěno | – | [AEC Magazine](https://aecmag.com/bim/arcol-unleashed-bim-2-0/) |
| Motif | koncept, spolupráce | aktivní, Motif Design 2026 | nezjištěno | – | [01net](https://www.01net.it/motif-introduces-motif-design-the-first-agent-native-building-design-software-platform/) |
| Maket | dispozice rodinných domů | aktivní (Auto-Complete 6/2026, čekací listina na v2) | cca 20–30 USD/měs. (zdroje se liší) | US | [TestingCatalog](https://www.testingcatalog.com/maket-debuts-auto-complete-for-generating-residential-floor-plans.md) |
| Higharc | RD pro developery (US) | aktivní, Series C 95 mil. USD (6/2026) | enterprise | US | [Higharc](https://higharc.com/newsroom/higharc-95m-series-c-for-homebuilding-ai) |
| ArkDesign | bytové domy | aktivní, bez novinek v roce 2026 | freemium, cca 50 USD/uživatel/měs. | US předpisy | [ArkDesign](https://arkdesign.ai/faq/) |
| Swapp | dokumentace | nejasný (žádné zprávy z 2026, v databázi jako „buildos“) | nezjištěno | – | [Startupim](https://startupim.com/company/buildos) |
| Augmenta | elektro, koordinace | aktivní, nezávislý (ACP 2.0 6/2026) | nezjištěno | US/CA | [Augmenta](https://lifestyle.mmminimal.com/story/723854/augmenta-releases-acp-2-0-the-complete-ai-native-design-environment-built-to-multiply-electrical-vdc-team-output-and-capacity/) |
| ArchiLabs | automatizace | aktivní, z pluginu pro Revit se stala samostatná webová CAD platforma (datová centra) | nezjištěno | – | [ArchiLabs](https://archilabs.ai/posts/revit-alternatives-for-2026-data-center-bim-managers) |
| Veras | vizualizace | aktivní, patří Chaos (akvizice EvolveLAB 2/2025) | cca 29 USD/měs. (ročně) | – | [AI Tools Atlas](https://aitoolsatlas.ai/tools/veras/pricing) |
| Chaos AI Enhancer (Enscape) | vizualizace | aktivní (stav preview se v zdrojích liší) | v licenci + Chaos Credits | – | [Enscape Learn](https://learn.enscape3d.com/?p=63408) |
| D5 Render 3.0 | vizualizace | aktivní (1/2026) | zdarma / Pro 360 USD/rok | – | [CGChannel](https://www.cgchannel.com/?p=173279) |
| Gendo | vizualizace | aktivní (Architizer Award 2026) | „unlimited rendering“ (2/2026) | – | [Gendo](https://www.gendo.ai/architizer) |
| LookX | vizualizace | aktivní (GEN-3) | nezjištěno | – | [LookX](https://lookx.notion.site/LookX-AI-V3-0-is-released-146610be128d80f9aa3fc79d9111a191) |
| Krea | obraz, video v reálném čase | aktivní (Realtime 14B) | nezjištěno | – | [Krea](https://krea.ai/blog) |
| Midjourney | koncept, nálada | aktivní (V8 / V8.1 / V8.2) | nejlepší funkce „4x“ dražší | – | [The Decoder](https://the-decoder.com/midjourney-v8-rolls-out-with-5x-faster-generation-but-charges-4x-more-for-its-best-features/) |
| UpCodes | předpisy | aktivní (Copilot Intelligence 12/2025, Specifications 3/2026) | nezjištěno | US | [Building Enclosure](https://www.buildingenclosureonline.com/articles/94432-upcodes-unveils-copilot-intelligence) |
| Archistar eCheck | předpisy (úřady) | aktivní, přes 25 samospráv | – | AU/US/CA | [Archistar](https://www.archistar.ai/for-government/) |
| Solibri | kontrola modelu | aktivní, AI asistent v betě (26.6) | Premium | IFC, globální | [Solibri](https://www.solibri.com/articles/solibri-release-notes-june-2026) |
| CodeComply.Ai | předpisy (úřady) | aktivní (CivicPlus 3/2026) | – | US předpisy | [CivicPlus](https://www.civicplus.com/news/nn/civicplus-brings-ai-building-plan-review-codecomply-ai/) |
| Togal.AI | výkaz výměr | aktivní | 199–299 USD/uživatel/měs. (agregátor) | US | [ConstructionPlacements](https://www.constructionplacements.com/best-quantity-takeoff-software/) |
| Bluebeam Max | revize výkresů | aktivní od 5/2026, Smart Review v preview | nezjištěno | Windows | [Bluebeam](https://press.bluebeam.com/2026/05/bluebeam-max-launches-globally-bringing-ai-powered-productivity-to-aec-teams-everywhere/) |
| Deltek Specpoint | specifikace | aktivní; SpecText (Word) končí 30. 6. 2026 | nezjištěno | US (MasterSpec) | [Deltek](https://www.deltek.com/en/blog/specpoint-aia26) |
| Kantiv (dříve Joist AI) | nabídky | přejmenováno 6/2026 | nezjištěno | US | [Simplify](https://simplify.jobs/c/Kantiv) |
| Procore agenti (Datagrid) | stavba | private beta (5/2026) | nezjištěno | – | [Pulse](https://www.pulse.bot/proptech/news/procore-deploys-ai-workflow-agents-to-automate-rfis-submittals-and-daily-logs-6def3197-9118-40ff-8b4c-dc20e148314f/) |
| Document Crunch | smlouvy | ohlášené převzetí firmou Trimble (datum nepotvrzeno) | nezjištěno | US | [For Construction Pros](https://www.forconstructionpros.com/business/labor-workforce-development/article/22963945/trimble-solutions-usa-trimble-to-acquire-document-crunch-to-expand-ai-risk-management-in-construction) |
| EvolveLAB Glyph | dokumentace | nejasný (EvolveLAB koupil Chaos) | – | – | [Jon Peddie](https://www.jonpeddie.com/news/chaos-acquires-aec-ai-toolmaker-evolvelab/) |

### Inferences

**Klasifikace činností architektonické kanceláře (stav 2026, pohled malého ateliéru v ČR).** Kategorie jsou tři: *převážně automatizovatelné* (stroj udělá většinu, člověk kontroluje), *AI-asistované* (AI zrychlí části práce, řídí člověk) a *pouze lidské* (AI nanejvýš pomůže s rešerší).

| Činnost | Klasifikace | Konkrétní nástroje | Zralost | Použitelnost v ČR a v češtině |
|---|---|---|---|---|
| Akvizice a nabídky | AI-asistované. Texty nabídek, anotace a reference jsou převážně automatizovatelné; cenu, go/no-go a vztah s klientem řeší člověk | obecné LLM; Kantiv, OpenAsset Shred | střední | obecné LLM ano; specializované AEC nástroje jsou stavěné na americká RFP, v ČR spíše ne |
| Zadání a komunikace s klientem | Přepis a zápis z jednání převážně automatizovatelné; porozumění potřebám a vyjednávání lidské | Beey, LLM | vysoká (přepis) | ano, Beey je česky za 3 Kč/min |
| Průzkum místa | AI-asistované | Forma Site Design; LLM na vytěžení územního plánu | střední | částečně, česká data je třeba dodat |
| Koncept a hmota | AI-asistované | Midjourney, Krea, Veras, LookX, Gendo; Forma Building Design, Hypar, Snaptrude, Arcol, Motif, Nemetschek Creator, TestFit, ArkDesign | obrazy vysoká; generátory hmot pro RD nízká až střední | obrazové nástroje ano (prompty obvykle anglicky); hmotové nástroje míří hlavně na americké bytové domy |
| Dispozice | AI-asistované pro varianty; finální řešení lidské | Finch3D, Maket, Higharc, Forma Building Layout Explorer | nízká až střední | omezeně, české normy a zvyklosti v nástrojích nejsou |
| Vizualizace a prezentace | Koncepční a atmosférické obrázky převážně automatizovatelné; přesné finální vizualizace AI-asistované | Veras, Enscape AI Enhancer, D5 Render 3.0, AI Visualizer v Archicadu, Vectorworks a ALLPLAN, Gendo, Krea, Midjourney | vysoká | ano |
| BIM modelování | AI-asistované pro opakované úkony přes Assistant a MCP; jádro modelu lidské | Autodesk Assistant (preview), Archicad AI Assistant s MCP (beta), Snaptrude, Arcol, Motif; Constriq Cloud2BIM pro zaměření | nízká až střední (preview/beta) | částečně; jazyk asistentů neověřen |
| Výkresy a dokumentační sady | AI-asistované pro rutinu (popisky, pohledy, výkazy, listy); koordinovaná dokumentace pouze lidská | Revit Assistant, Swapp, Bluebeam Max Smart Review | nízká | omezeně |
| Specifikace a technické zprávy | AI-asistované. Koncept textu převážně automatizovatelný; obsah a odpovědnost lidské | QIK Dokumentace, LLM; Deltek Specpoint, UpCodes Specifications | střední | ano přes LLM a QIK; americké systémy ne |
| Kontrola souladu s předpisy | Pouze lidské; AI jen na rešerši a předkontrolu | Solibri s AI asistentem (beta); UpCodes, Archistar, CodeComply jen pro US/AU | pro ČR nízká | ne, hotový nástroj pro české předpisy jsem nenašel |
| Rozpočet a výkaz výměr | Výkaz z BIM modelu převážně automatizovatelný (deterministicky, bez AI); ocenění AI-asistované až lidské | Togal.AI, Higharc AI Estimating (US); RMind BIM (ČR, neověřeno); ÚRS/KROS bez AI | nízká až střední | částečně |
| Koordinace a kolize | Detekce automatizovaná pravidly; seskupování AI-asistované; řešení lidské | Revizto, Navisworks, Solibri, Augmenta | střední | ano, nástroje nad IFC na jazyku nezávisí |
| Výběr zhotovitele | AI-asistované (porovnání nabídek, kontrola úplnosti, rizikové klauzule) | LLM; Document Crunch, Procore Contract Review | nízká až střední | LLM ano; americké nástroje ne |
| Stavba a dozor, kontrolní dny | Zápisy převážně automatizovatelné; kontrola na místě a rozhodování lidské | Beey s LLM, PlanRadar, Procore agenti (beta) | střední | přepis ano; jazykovou podporu PlanRadaru jsem neověřil |
| Administrativa kanceláře | Rutinní e-maily, šablony a souhrny převážně automatizovatelné; řízení AI-asistované | LLM, Deltek | střední | ano |

Další závěry:
- **Klíčový trend roku 2026 je MCP jako standardní rozhraní.** Podporují ho Revit 2027, Archicad (beta), Solibri a Bluebeam Max. Obecní agenti typu Claude se tak mohou napojit přímo na BIM model. Pro malý ateliér je to levnější cesta než specializované startupy, ale všechna rozhraní jsou zatím v preview nebo v betě. Navazuje na to úloha o automatickém BIM modelu (agent a Revit) v tomto repu.
- **Trh se konsoliduje a přeznačuje.** Chaos koupil EvolveLAB/Veras, Trimble přebírá Document Crunch, Procore koupil Datagrid, Bluebeam koupil mbue, Joist se přejmenoval na Kantiv a Deltek ukončil SpecText ve Wordu. Některé startupy mění zaměření: ArchiLabs přešel na datová centra a vlastní CAD, Hypar na LLM. Nástroj vybraný dnes se může do roka změnit.
- **Startupy pro dispozice a proveditelnost míří hlavně na americké bytové domy a developery** (TestFit, ArkDesign, Higharc, Forma Building Layout Explorer). Pro český ateliér rodinných domů mají omezený přínos.

### Gaps
- Nepodařilo se ověřit:
  - jazykovou podporu (češtinu) Autodesk Assistant, Archicad AI Assistant, Vectorworks AI Assistant a PlanRadaru,
  - ceny Archicad Max, Snaptrude, Arcol, Motif, LookX, Krea, Midjourney V8 a Bluebeam Max (stránky výrobců šly otevřít jen přes výsledky vyhledávání),
  - stav produktu Glyph (EvolveLAB/Chaos) a to, zda se Swapp přejmenoval (záznam „buildos“ je jen nepřímá stopa).
- Nástroje pro administrativu kanceláře (timesheety, fakturace, projektové řízení s AI), které by nebyly obecnými LLM, jsem kvůli vyčerpanému rozpočtu vyhledávání necílil.
- U Document Crunch chybí datum a stav dokončení akvizice firmou Trimble.

---

## 2. Co říkají průzkumy a studie o adopci, úsporách času a případech užití (a co je měření a co jen tvrzení)

### Takeaway
Adopce rychle roste. RIBA uvádí 41 % praxí (2024), 59 % (2025) a 74 % (2026); Deltek 53 % (2025) a 70 % (2026) amerických A&E firem. Téměř vše je ale sebehodnocení respondentů z nenáhodných vzorků. Měřitelný dopad na podnikání uvádí jen 38 % firem (Deltek) a lepší návrhy díky AI jen 17 % (RIBA). Nezávislé kontrolované měření úspory času v architektonické praxi jsem nenašel. Konkrétní procenta úspor (50–80 %, 98 % přesnost) pocházejí od výrobců.

### Cited Findings

#### Průzkumy (sebehodnocení)

**RIBA AI Report 2024 / 2025 / 2026 (Spojené království)**
- Podíl praxí používajících AI byl 41 % v roce 2024 a 59 % v roce 2025. — [RIBA](https://www.riba.org/news/second-riba-ai-report-shows-surge-in-usage-among-uk-architects/)
- V roce 2025 to bylo přes 80 % u velkých praxí a 48 % u malých ateliérů (sekundární shrnutí). — [Toffu](https://toffu.co/blogs/news/riba-ai-report-2025-59-of-architecture-practices-now-use-ai)
- V roce 2025 investovala do výzkumu a vývoje méně než pětina praxí a formální AI politiku mělo jen 15 %. Do dvou let ji čeká 53 % a investice do výzkumu a vývoje 47 %. — [RIBA AI Report 2025](https://www.riba.org/work/insights-and-resources/professional-features/ai-professional-features/riba-ai-report-2025/); [Workplace Insight](https://workplaceinsight.net/uk-architects-embrace-ai-more-and-more-although-concerns-about-creativity-remain/)
- V roce 2025 si jen 4 % myslela, že AI odstraní potřebu kreativity, a 18 % čekalo ztrátu pracovních míst přímo kvůli AI. — [Workplace Insight](https://workplaceinsight.net/uk-architects-embrace-ai-more-and-more-although-concerns-about-creativity-remain/)
- V roce 2026 je to 74 % praxí oproti 59 % v roce 2025. Formulace tiskové zprávy zní „using AI for most projects“, jiné shrnutí ale číslo uvádí jako celkovou adopci. — [RIBA](https://www.riba.org/news/ai-adoption-reaches-tipping-point-across-uk-architecture/); [Specification Online](https://specificationonline.co.uk/articles/2026-07-23/ai-adoption-reaches-tipping-point-across-uk-architecture-but-human-judgement-remains-critical)
- Podle velikosti v roce 2026: praxe s 10–49 lidmi 84 %, s 1–9 lidmi 63 % (sekundární shrnutí). — [Project Flux](https://www.projectflux.ai/p/riba-ai-report-2026-74-of-practices-now-use-ai); [Beale & Co](https://beale-law.com/article/riba-ai-report-2026-charts-the-growing-role-of-artificial-intelligence-in-architectural-practice/)
- Případy užití 2026 (podíl uživatelů AI) podle sekundárních shrnutí:
  - vizualizace raných fází 56 %,
  - kontrola norem a předpisů 40 %,
  - řízení praxe 32 %,
  - specifikace a technický návrh 24 %.

  — [Beale & Co](https://beale-law.com/article/riba-ai-report-2026-charts-the-growing-role-of-artificial-intelligence-in-architectural-practice/); [Project Flux](https://www.projectflux.ai/p/riba-ai-report-2026-74-of-practices-now-use-ai)
- Další výsledky RIBA 2026:
  - 73 % uživatelů AI hlásí vyšší produktivitu,
  - 57 % z těch, kdo hodnotí návratnost, uvádí kladnou ROI,
  - jen 17 % souhlasí, že jejich návrhy jsou díky AI „lepší“,
  - 59 % čeká, že AI povede ke snižování stavů v profesi,
  - 61 % má obavu, že se začínající architekti hůř naučí základní dovednosti.

  — [RIBA](https://www.riba.org/news/ai-adoption-reaches-tipping-point-across-uk-architecture/)
- RIBA chystá AI Overlay k RIBA Plan of Work a politiku odpovědného používání AI. 1. 12. 2026 v Hongkongu vydá první asijskou edici zprávy. — [RIBA](https://www.riba.org/news/ai-adoption-reaches-tipping-point-across-uk-architecture/); [RIBA Asia](https://www.riba.org/news/riba-asia-ai-in-architecture-summit-2026/)
- RIBA sama upozorňuje, že respondenti se přihlásili sami a ne všichni odpověděli na všechny otázky. Výsledky jsou podle ní „a good indication“, ne definitivní obraz. — [RIBA AI Report 2026](https://www.riba.org/work/insights-and-resources/ai-report/)
- Vedoucí výzkumu RIBA: AI umožňuje dělat existující úkoly rychleji, například iterace raných fází nebo vizualizace pro klienty. — [RIBA – Adrian Malleson](https://www.riba.org/work/insights-and-resources/ai-report/ribas-adrian-malleson-responds-to-the-2026-ai-report/)
- Na RIBA AI Summit 2026 jeden řečník odhadl, že AI zvyšuje produktivitu při programování dvacetkrát, ale při psaní jen o 50 %. Jde o názor jednoho člověka, ne o výsledek průzkumu. — [RIBAJ](https://www.ribaj.com/intelligence/ai-in-architectural-workflows-and-practice/)

**AIA, „Artificial Intelligence Adoption in Architecture Firms: Opportunities & Risks“ (prosinec 2024, USA)**
- AI nasadilo 8 % firem a dalších 20 % na nasazení pracuje. Pravidelně ji používá 6 % profesionálů, 53 % experimentuje. — [AIA](https://www.aia.org/about-aia/press/new-research-explores-perceptions-and-opportunities-artificial-intelligence); [AIA Architect](https://www.aia.org/aia-architect/article/architects-are-excited-about-potential-ai-concerns-abound); [Construction Owners](https://constructionowners.com/news/only-6-of-architects-use-ai-regularly-new-report-finds)
- Podle velikosti: u firem nad 50 zaměstnanců 43 % (13 % nasazeno, 30 % se nasazuje). U firem s 10–49 zaměstnanci 22 % (19 % a 3 %; poměr působí podezřele, ale převzat je tak, jak ho uvádí zdroj). Asi tři čtvrtiny firem, které AI nasadily, chtějí hlavně snížit režii a zvýšit produktivitu. Bariérami jsou přesnost, bezpečnost a transparentnost. — [ConstructionLinks](https://constructionlinks.ca/news/ai-in-architecture-aia-study-reveals-opportunities-risks-and-adoption-trends/)
- Kritika metodiky: z 10 000 oslovených kontaktů AIA odpovědělo 541, takže hrozí zkreslení samovýběrem. — [Dan Cumberland Labs](https://dancumberlandlabs.com/blog/will-ai-take-over-architecture)

**Chaos / Architizer**
- Průzkum z roku 2024 (1 227 respondentů, 29. 1.–9. 2. 2024): AI už používala téměř polovina, hlavně v raných fázích. 86 % čeká, že AI bude v budoucnu architektury hrát významnou roli. — [Chaos blog](https://www.chaos.com/blog/the-state-of-ai-in-architecture-new-insights-from-1200-architects); [Architizer](https://architizer.com/blog/practice/tools/ai-reshaping-architecture-survey-chaos-enscape/)
- Zpráva 2026 vychází ze čtvrtého průzkumu z listopadu 2025: téměř 800 respondentů, z toho 50 % ze Severní Ameriky. — [Chaos](https://www.chaos.com/ai-in-architecture-report-2026)
- Výsledky podle sekundárního shrnutí (blog výrobce vizualizací):
  - 86 % uživatelů AI šetří čas při návrhu a vizualizaci,
  - největší úsporu vidí v konceptu a ideaci (48 %) a ve vylepšování obrázků (40 %),
  - 40 % respondentů AI zatím nepoužívá; brzdí je cena, nedostatek času a integrace.

  — [Rendervi](https://rendervi.com/blog/ai-rendering-in-architecture-research-2026)
- Sponzorovaný článek ArchDaily ke zprávě Chaos: obavy má téměř 30 % architektů, 75 % věří, že AI může přinést inovace, a téměř 80 % chce jasná etická pravidla. Bílá kniha Chaos varuje před přílišným spoléháním na výstupy AI a před rostoucí vizuální uniformitou. — [ArchDaily](https://www.archdaily.com/1035931/the-role-of-responsible-ai-in-transforming-architectural-practices-and-design); [ArchDaily – white paper](https://www.archdaily.com/1035718/chaos-white-paper-reveals-how-ai-is-transforming-roles-risks-and-skills-in-architecture)

**Deltek Clarity A&E 2026 (47. ročník, vydáno 12. 5. 2026, 896 firem)**
- Použití AI vzrostlo meziročně z 53 % na 70 %, generativní AI z 64 % na 78 %. Není jasné, jak definice spolu souvisejí. — [Deltek](https://www.deltek.com/en/about/media-center/press-releases/2026/the-latest-deltek-clarity-industry-studies-highlight-ai-challenges)
- Měřitelný kladný dopad na podnikání uvádí jen 38 %. Hlavní překážky:
  - kde a jak AI použít (62 %),
  - integrace systémů (56 %),
  - data a kybernetická bezpečnost (52 %).

  Firmy čekají růst tržeb o 9,5 %, ale počet zaměstnanců vzrostl jen o 1,2 % a fluktuace je přes 13 %. — [Deltek](https://www.deltek.com/en/about/media-center/press-releases/2026/the-latest-deltek-clarity-industry-studies-highlight-ai-challenges); [For Construction Pros](https://www.forconstructionpros.com/business/labor-workforce-development/article/22967001/deltek-deltek-report-finds-labor-and-ai-challenges-reshaping-ae-industry)

**Autodesk State of Design & Make 2026**
- Alespoň jeden AI nástroj používá 98 % lídrů, 81 % firem zvýšilo investice do AI a 60 % považuje bezpečnost za největší obavu. — [Arkance – AI Pulse](https://hello.arkance.world/autodesk-state-of-design-make-2026-report-ai-pulse)
- Důvěra v AI: Verdantix uvádí 67 %. Fast Company píše o 65 % s poklesem ze 76 %, ale není jisté, zda jde o vydání 2025, nebo 2026. — [Verdantix](https://www.verdantix.com/venture/blog/autodesk-university-2026-highlights-the-rise-of-project-intelligence-across-the-industrial-life-cycle); [Fast Company ME](https://fastcompanyme.com/?p=38092)

#### Akademické studie a nezávislé signály skutečného užívání
- Madireddy et al. (Electronics, 2025) propojili LLM (GPT, Claude, Gemini, Llama) s Revitem tak, aby z textu předpisu generovaly kontrolní skripty v Pythonu. Případové studie (bytový a kancelářský projekt) ukazují úsporu času. Úspěšnost se ale mezi modely a úlohami výrazně liší; u některých úloh je kolem 25 %, jinde 100 %. — [DOI 10.3390/electronics14112146](https://doi.org/10.3390/electronics14112146); [ResearchGate](https://www.researchgate.net/publication/393022105_Large_Language_Model-Driven_Code_Compliance_Checking_in_Building_Information_Modeling)
- Sekundární blog uvádí přesnost 97,37 % a úplnost 95,88 % při převodu 51 požadavků IBC 2015 na logické klauzule. Originální studii jsem neověřil. — [StudioMatrx](https://www.studiomatrx.org/blog/ai-building-code-checking)
- Další výzkumné směry: detekce dveří kombinovaná s LLM pro výčet zařízení při kontrole souladu a atribuční analýza LLM pro automatickou kontrolu předpisů (2026). Výsledky jsem nezískal. — [arXiv 2509.17283](https://arxiv.org/pdf/2509.17283); [arXiv 2604.15589](https://arxiv.org/pdf/2604.15589)
- Nezávislé doklady skutečného užívání (nejde o měření úspor):
  - Austin po pilotu podepsal s Archistar pětiletou smlouvu,
  - ENR popsal školní projekt s elektro trasami navrženými AI Augmenty,
  - Poslanecká sněmovna a soudy používají Beey,
  - BuiltWorlds 2026 uvádí 42,9 % respondentů s nástroji typu test-fit na více projektech.

  — [SmartCitiesWorld](https://www.smartcitiesworld.net/planning-and-redevelopment/austin-uses-ai-to-automate-building-permit-process-10822); [ENR](https://www.enr.com/articles/62433-augmenta-ai-helps-organize-electrical-work-on-school-jobs); [PSP ČR](https://psp.cz/zprava/19978); [BuiltWorlds](https://builtworlds.com/insights/2026-building-tech-early-concept-feasibility-stage-tech-specialty-report/)

#### Tvrzení výrobců (neověřená)
- UpCodes: „93% weighted accuracy“ (interní test). — [UpCodes](https://cms-v2.up.codes/features/copilot)
- Togal.AI: „98% accuracy“ a pětkrát rychlejší výkazy. — [B2B Sales Tools](https://b2bsalestools-com.pages.dev/tools/togal-ai/)
- Joist/Kantiv: „75% faster proposal creation“. — [Joist.ai](https://www.joist.ai/)
- Document Crunch: revize smluv rychlejší „až o 80 %“. — [Nomic](https://www.nomic.ai/glossary/document-crunch)
- Deltek: MEA píše specifikace za méně než 75 % času. — [Deltek](https://www.deltek.com/en/blog/specpoint-aia26)
- CivicPlus/CodeComply: posuzování „z měsíců na minuty“. — [CivicPlus](https://www.civicplus.com/news/nn/civicplus-brings-ai-building-plan-review-codecomply-ai/)
- Procore / Buro Happold: RFI a submittaly o 50 % rychleji. — [Pulse](https://www.pulse.bot/proptech/news/procore-deploys-agentic-ai-in-its-common-data-environment-to-cut-rfi-work-by-50-33e7d3ba-825c-4f8e-9575-73ede1bff844/)
- PlanRadar: „Defect reports: 10 minutes instead of 2 hours“. — [PlanRadar](https://planradar.com/?p=458047)
- LookX: „Architect Turing Test“. — [LookX](https://lookx.notion.site/LookX-AI-V3-0-is-released-146610be128d80f9aa3fc79d9111a191)
- Swapp: „construction documents in minutes“ (titulek). — [Archinect](https://archinect.com/news/article/150350727/swapp-raises-11-5-million-for-tool-that-offers-ai-powered-construction-documents-in-minutes)

### Inferences
- Rozdíl mezi 6 % pravidelných uživatelů (AIA, konec 2024) a 74 % praxí (RIBA, 2026) vyplývá z odlišné jednotky (jednotlivec vs. praxe), definice („jakékoli užití“ vs. „pravidelné“), trhu a doby. Obě čísla jsou správná, ale nejsou porovnatelná.
- Produktivitu zvyšuje 73 % respondentů, kvalitu návrhů jen 17 %. AI tedy v praxi hlavně zrychluje existující úkoly (obrázky, texty), nemění kvalitu ani podstatu návrhu.
- Nejčastější užití je stále vizualizace (56 %). Druhá nejčastější je kontrola norem a předpisů (40 %), přestože pro ni neexistují spolehlivé nástroje mimo US/AU. Část respondentů tak nejspíš používá obecné chatboty na regulatorní otázky, a to je riziko (viz oddíl 3).
- Na rozhodování o investicích chybí tvrdá data: úspory jsou deklarované, ne měřené. Malá kancelář si je musí ověřit sama, například krátkým A/B pilotem na vlastních zakázkách.

### Gaps
- Analýzy McKinsey a BCG k AI v AEC, novější data AIA (2025/2026) a obecné kontrolované studie produktivity generativní AI ve znalostní práci jsem nestihl dohledat (vyčerpaný rozpočet vyhledávání). Nejsou proto citovány.
- Plné texty RIBA 2026 a Chaos 2026 jsem nečetl (blokovaný přístup). Případy užití podle velikosti praxe jsem nezískal.
- Nezávislé studie měřící skutečnou úsporu času u architektů (nikoli sebehodnocení) jsem nenašel.

---

## 3. Kde AI stále selhává nebo nese vysoké riziko

### Takeaway
AI selhává tam, kde musí být výstup přesný, koordinovaný a právně závazný: dokumentace k povolení a provedení, soulad s předpisy, konstrukční a stavební logika, výkazy ze složitých výkresů. Výrobci sami uvádějí, že výstupy nejsou připravené pro úřady ani pro „business‑critical“ úkoly. Pojistitelé v roce 2026 začínají AI vylučovat z profesních pojistek. V ČR navíc AI obrázky podle soudu nejsou autorským dílem.

### Cited Findings
- Maket přiznává, že žádný AI generátor půdorysů dnes nevytváří výkresy, které by stavební úřad přijal do povolovacího řízení. Recenze doporučuje návaznosti místností kontrolovat ručně. — [Maket](https://www.maket.ai/blog/ai-floor-plan-generator-guide-2026); [Tooliverse](https://tooliverse.ai/tools/maket)
- Autodesk Assistant „should not be relied upon for business‑critical tasks“ a jeho výstupy je třeba pečlivě kontrolovat. — [BIM Pure](https://www.bimpure.com/blog/revit-2027)
- U Hyparu zůstává nevyřešená odpovědnost a slabé navrhování přes chat. — [The Seam](https://buttondown.com/Theseamnews/archive/the-seam-special-edition-june-1-2026/)
- Kontrola předpisů pomocí LLM: úspěšnost se mezi modely a úlohami výrazně liší, u některých úloh je kolem 25 %. — [Madireddy et al. 2025](https://doi.org/10.3390/electronics14112146)
- Výkazy: Togal má problémy se složitými výkresy TZB a s nestandardními značkami; nad skeny a ručně kreslenými výkresy je přesnost nižší. — [Construction AI Tools](https://constructionaitools.pages.dev/estimation/ai-vs-manual-takeoff-comparison); [B2B Sales Tools](https://b2bsalestools-com.pages.dev/tools/togal-ai/)
- Spolehlivost software: uživatel s RTX 5090 hlásí, že po aktualizaci na D5 3.0 nefungují AI funkce. Digital Production doporučuje testovat D5 3.0 na nekritických projektech. — [D5 forum](https://forum.d5render.com/t/d5-3-0-can-t-use-ai-material-snap-or-other-ai-features/69153); [Digital Production](https://digitalproduction.com/2026/01/19/ocean-clouds-and-splats-d5-render-3-0-sets-sail)
- Kvalita a dovednosti: jen 17 % vidí lepší návrhy a 61 % se obává o učení začínajících architektů. Chaos varuje před přílišným spoléháním na AI a vizuální uniformitou. — [RIBA](https://www.riba.org/news/ai-adoption-reaches-tipping-point-across-uk-architecture/); [ArchDaily](https://www.archdaily.com/1035718/chaos-white-paper-reveals-how-ai-is-transforming-roles-risks-and-skills-in-architecture)
- Obchodní přínos: měřitelný kladný dopad uvádí jen 38 % firem a 52 % řeší data a kybernetickou bezpečnost. Podle Autodesku má 60 % lídrů jako hlavní obavu bezpečnost. AIA mezi bariérami uvádí přesnost, bezpečnost a transparentnost. — [Deltek](https://www.deltek.com/en/about/media-center/press-releases/2026/the-latest-deltek-clarity-industry-studies-highlight-ai-challenges); [Arkance](https://hello.arkance.world/autodesk-state-of-design-make-2026-report-ai-pulse); [ConstructionLinks](https://constructionlinks.ca/news/ai-in-architecture-aia-study-reveals-opportunities-risks-and-adoption-trends/)
- Pojištění (USA, leden 2026, tisková zpráva s nižší spolehlivostí): Philadelphia Insurance a Hamilton Select už do profesních pojistek (E&O) projektantů přidaly výluky pro AI. Berkley, AIG a Great American o ně požádaly regulátory. Šíří se standardní formuláře Verisk CG 40 47 a CG 40 48. — [News Channel Nebraska](https://central.newschannelnebraska.com/story/53389688/insurance-carriers-add-ai-exclusions-to-design-professional-eo-policies)
- Většina profesních pojistek AI zatím nevylučuje, ale při obnovách v roce 2026 se dá čekat nové znění. Underwriteři Lloyd's považují profesní pojištění (PI) za nejvíc ohrožené AI škodní událostí. — [Insurance Journal](https://www.insurancejournal.com/magazines/mag-features/2025/08/04/834120.htm); [Intelligent Insurer](https://www.intelligentinsurer.com/professional-indemnity-faces-biggest-impact-from-ai-loss-event-say-underwriters); [Lockton](https://global.lockton.com/apac/en/news-insights/how-architects-and-engineers-can-manage-risks-associated-with-ai-adoption)
- Úřední posuzování: i výrobce CodeComply nástroj staví jako podporu rozhodování, která má posuzovatelům zachovat jejich odborné rozhodování. — [CivicPlus](https://www.civicplus.com/news/nn/civicplus-brings-ai-building-plan-review-codecomply-ai/)
- Autorské právo v ČR: Městský soud v Praze (10 C 13/2023-16, 11. 10. 2023) rozhodl, že obrázek vytvořený AI (DALL-E) není autorským dílem podle § 2 autorského zákona a prompt je jen námět či myšlenka. Žalobce navíc neprokázal, jak obrázek vznikl. Rozsudek je pravomocný a k říjnu 2026 jde podle komentářů o jediné takové české rozhodnutí. — [MSP – rozsudek](https://msp.gov.cz/documents/14569/1865919/10C_13_2023_10); [epravo.cz](https://www.epravo.cz/top/clanky/mestsky-soud-v-praze-o-umele-inteligenci-a-autorskem-pravu-117318.html); [Právní prostor](https://www.pravniprostor.cz/clanky/pravo-it/otazka-autorstvi-ke-grafice-vytvorene-umelou-inteligenci-prvni-judikatura)
- Ve většině velkých platforem jsou AI agenti a MCP stále v preview nebo v betě: Autodesk Assistant, Archicad MCP, Solibri AI asistent, Bluebeam Smart Review. — [Autodesk](https://www.autodesk.com/blogs/aec/2026/04/22/autodesk-assistant-in-revit-tech-preview/); [Graphisoft](https://help.graphisoft.com/.beta2026/en/AI_Assistant_NewTopics/mcptechpreview.html); [Solibri](https://www.solibri.com/articles/solibri-release-notes-june-2026); [Novedge](https://novedge.com/products/buy-bluebeam-max)

### Inferences
- **Koordinovaná dokumentace (DSP, DPS):** vysoké riziko. Hotový nástroj z jednoho zadání nevyrobí konzistentní sadu; Swapp se musí učit na projektech firmy a je bez zpráv z roku 2026. AI zatím zvládá jen jednotlivé rutinní úkony.
- **Předpisy:** vysoké riziko, v ČR ještě vyšší. Předpisy se často mění (437/2024 Sb., 87/2025 Sb., 330/2025 Sb., 91/2026 Sb., viz oddíl 5). Obecné LLM proto mohou odpovídat podle starého zákona 183/2006 Sb. nebo neplatných vyhlášek. Placené ČSN v jejich znalostech pravděpodobně chybí. Každou odpověď je třeba ověřit proti aktuálnímu znění.
- **Statika a stavební logika:** žádný zjištěný nástroj pro architekty neřeší konstrukční návaznosti ani proveditelnost. Generátory dispozic a hmot pracují s geometrií, ne s konstrukcí, a odpovědnost zůstává na autorizované osobě.
- **Odpovědnost:** autorizovaný architekt odpovídá za dokumentaci bez ohledu na nástroj. U českých pojistitelů jsem výluky pro AI neověřil. Americký trend naznačuje, že je vhodné se na ně při obnově pojistky výslovně zeptat.
- **Vizualizace pro klienta:** AI obrázky se mohou odchýlit od skutečného modelu (materiály, proporce). Mohou tak u klienta vyvolat očekávání, která projekt nesplní. Zároveň nejsou chráněné autorským právem.

### Gaps
- Nenašel jsem doložené případy škod ani soudních sporů kvůli chybě AI v projektové dokumentaci. Jeden zdroj uvádí, že v USA zatím žádný takový spor o pojištění neproběhl.
- Postoj českých pojišťoven (profesní pojištění přes ČKA) k užívání AI jsem nezjistil.
- Kvantitativní data o chybovosti AI vizualizací nebo AI výkazů v reálných projektech jsem nenašel.

---

## 4. Které fáze nabízejí malému ateliéru rodinných domů největší úsporu času

### Takeaway
Pro malý ateliér rodinných domů jsou v roce 2026 největší a nejlépe doložené úspory ve **vizualizacích a ideaci**, v **psaní** (nabídky, technické zprávy, e-maily) a v **přepisu a zápisech z jednání**. Všechny tyto nástroje jsou zralé, levné a fungují v češtině nebo na jazyku nezávisí. Automatizace BIM a dokumentace přes Assistant a MCP je slibná, ale zatím v betě. Generátory dispozic, kontrola předpisů a rozpočty dnes českému ateliéru rodinných domů přínos nepřinášejí, protože jsou stavěné pro americké bytové domy nebo pro jiné předpisy.

### Cited Findings
- AI používá 63 % mikropraxí s 1–9 lidmi oproti 84 % praxí s 10–49 lidmi (RIBA 2026, sekundární shrnutí). — [Project Flux](https://www.projectflux.ai/p/riba-ai-report-2026-74-of-practices-now-use-ai)
- Nejčastější použití je vizualizace raných fází (56 %), dále předpisy (40 %), řízení praxe (32 %) a specifikace (24 %). — [Beale & Co](https://beale-law.com/article/riba-ai-report-2026-charts-the-growing-role-of-artificial-intelligence-in-architectural-practice/)
- Největší úsporu času vidí respondenti Chaos v konceptu a ideaci (48 %) a ve vylepšování obrázků (40 %); jde o sekundární shrnutí. — [Rendervi](https://rendervi.com/blog/ai-rendering-in-architecture-research-2026)
- Iterace raných fází a vizualizace pro klienty se díky AI dělají rychleji (RIBA). — [RIBA – Malleson](https://www.riba.org/work/insights-and-resources/ai-report/ribas-adrian-malleson-responds-to-the-2026-ai-report/)
- Psaní je s AI zhruba o 50 % produktivnější (odhad jednoho řečníka). — [RIBAJ](https://www.ribaj.com/intelligence/ai-in-architectural-workflows-and-practice/)
- Ceny nástrojů pro vizualizaci a přepis:
  - Veras cca 29 USD měsíčně při ročním placení,
  - D5 Render Community zdarma, Pro 360 USD ročně,
  - Beey 3 Kč + DPH za minutu,
  - Forma Site Design a Building Design v předplatném Revitu.

  — [AI Tools Atlas](https://aitoolsatlas.ai/tools/veras/pricing); [CGChannel](https://www.cgchannel.com/?p=173279); [CzechCrunch](https://cc.cz/umela-inteligence-konecne-umi-to-v-co-jsme-doufali-vyresila-bolehlav-novinaru/); [IT Brief](https://itbrief.com.au/story/autodesk-launches-forma-building-design-for-revit-links)
- Dispoziční a hmotové nástroje míří na bytové domy (Forma Building Layout Explorer, ArkDesign, TestFit) nebo na americké developery rodinných domů (Higharc). Maket na rodinné domy existuje, ale není připraven na povolení. — [Autodesk (JP)](https://digitalpr.jp/r/143600); [ArkDesign](https://arkdesign.ai/faq/); [Higharc](https://higharc.com/newsroom/higharc-95m-series-c-for-homebuilding-ai); [Maket](https://www.maket.ai/blog/ai-floor-plan-generator-guide-2026)
- Praxe MA Studio (Praha): AI využívá při návrzích, ale podle hlavního architekta Dana Merty zatím žádný AI program neumí navrhnout celý dům. AI je pomocník, který potřebuje dohled. — [HN](https://archiv.hn.cz/c1-67699740-ai-pomaha-vytvaret-navrhy-domu-musi-se-na-ni-ale-dohlizet)
- QIK Dokumentace předvyplňuje technické zprávy podle vyhlášky 131/2024 Sb. — [Stavitel](https://stavitel.cz/ekonomika/projektant-ma-projektovat-rutinu-muze-prevzit-umela-inteligence/)

### Inferences
Pořadí fází podle očekávané úspory pro ateliér rodinných domů s 1–5 lidmi (kvalitativní odhad z citovaných dat; hodiny se neměřily):
1. **Vizualizace a prezentace** (koncepty, materiálové varianty, atmosféra, vylepšení renderu). Největší a nejjistější úspora; zralé nástroje za desítky USD měsíčně (Veras, D5, Enscape AI Enhancer, Archicad AI Visualizer, Midjourney, Krea).
2. **Psaní** (nabídky, průvodní a technické zprávy, e-maily, smlouvy jako koncept). Velká úspora; LLM a pro ČR QIK Dokumentace. Odpovědnost za obsah zůstává na projektantovi.
3. **Přepis a zápisy z jednání s klientem, s úřady a z kontrolních dnů.** Prakticky automatizovatelné. Například 10 hodin nahrávek měsíčně (600 minut) vyjde v Beey zhruba na 1 800 Kč + DPH, pak zbývá jen kontrola zápisu.
4. **Rešerše předpisů a podkladů.** Úspora existuje, ale jen s povinným ověřením proti e-Sbírce. V ČR je riziko vysoké (viz oddíly 3 a 5).
5. **Rutinní úkony v BIM** (popisky, výkazy, pohledy, přejmenování, kontrola dat). Potenciál je vysoký, ale v letech 2026–2027 je zralost nízká (Autodesk Assistant v preview, Archicad MCP v betě). Vyplatí se pilotovat přes MCP s obecným agentem.
6. **Nízký přínos:** generátory dispozic pro rodinné domy (bez českých norem a zvyklostí), kontrola předpisů (pro ČR neexistuje), rozpočty (ÚRS/KROS bez AI). Koordinace u rodinných domů má malý rozsah, takže automatizace kolizí ušetří málo.
- Pro ateliér v Archicadu (Graphisoft) je logickým krokem Archicad Max (AI Visualizer, AI Assistant, MCP). Pro ateliér v Revitu mají Forma a Assistant tu výhodu, že jsou už v předplatném.

### Gaps
- Nenašel jsem žádné měření úspory hodin u malých ateliérů rodinných domů (ani v zahraničí). Pořadí výše je odhad.
- Cenu Archicad Max, aktuální ceny LLM předplatných a Midjourney V8 jsem nezjistil.

---

## 5. České specifikum: čeština, regulatorní data, české a středoevropské startupy, české ateliéry

### Takeaway
Česko má hotová česká řešení hlavně pro přepis řeči (Beey) a začínající lokální nástroje (QIK Dokumentace, Constriq Cloud2BIM, RMind BIM). Chybí ale AI nástroj na kontrolu souladu s českými předpisy. Brání tomu dvě věci. Za prvé je API e-Sbírky uzavřené (registrace a schválení přes datovou schránku) a ČSN jsou placené. Za druhé se stavební právo v letech 2024–2026 opakovaně mění, včetně nového zákona 330/2025 Sb. o informačním modelu stavby. Veřejně doložené užívání AI v českém ateliéru jsem našel jen u MA Studio (Rendero). Česká komora architektů veřejný postoj k AI podle dostupných zdrojů nemá.

### Cited Findings

#### Podpora češtiny
- Archicad AI Visualizer „currently works in English“ (jedna stránka Graphisoftu, datum nejisté). — [Graphisoft HK](https://graphisoft.com/hk/downloads/archicad-ai-visualizer)
- Beey je česká technologie na přepis češtiny; používá ji Poslanecká sněmovna a soudy. — [PSP ČR](https://psp.cz/zprava/19978); [kvalitavs.gov.cz](https://kvalitavs.gov.cz/evt_file.php?file=772)
- QIK Dokumentace (technické zprávy podle vyhlášky 131/2024 Sb.) a RMind BIM („vyvinuto v ČR“) cílí na český trh. — [Stavitel](https://stavitel.cz/ekonomika/projektant-ma-projektovat-rutinu-muze-prevzit-umela-inteligence/); [RMind BIM](https://bim.rmind.ai/)
- ALLPLAN Česko komunikuje AI funkce česky. O lokalizaci samotného AI asistenta to nic neříká. — [ALLPLAN Česko](https://www.allplan.com/cz/tiskove-zpravy/detail-zpravy/allplan-2025-revoluce-v-navrhovani-a-vystavbe-pomoci-nastroju-s-umelou-inteligenci-a-spoluprace-v-realnem-case/)
- Americké nástroje pro předpisy jsou postavené na amerických předpisech, takže pro ČR nejsou použitelné. UpCodes cílí na americký trh, CodeComply kontroluje IBC, IMC, IPC, IRC, ADA a NFPA, ArkDesign pracuje s americkými předpisy a Archistar s municipalitami v AU, US a CA. — [Pulse – UpCodes](https://www.pulse.bot/proptech/news/upcodes-unveils-ainative-specifications-tool-to-cut-us-construction-compliance-risks-31e7b681-9316-4271-a8af-8e7354c6dac0); [CivicPlus](https://www.civicplus.com/news/nn/civicplus-brings-ai-building-plan-review-codecomply-ai/); [ArkDesign](https://arkdesign.ai/faq/); [Archistar](https://www.archistar.ai/for-government/)

#### Dostupnost českých regulatorních dat
- API e-Sbírky je podle Lupa.cz uzavřené jen pro registrované a schválené uživatele. Žádost se posílá Ministerstvu vnitra datovou schránkou a musí obsahovat účel použití a předpokládaný počet dotazů. Lupa.cz také kritizuje, že otevřená data neodpovídají požadavkům na registraci v NKOD a chybí jim dokumentace. — [Lupa.cz](https://www.lupa.cz/clanky/e-sbirka-ukazuje-jak-neotevirat-data/)
- MV doporučuje produkční napojení na REST API a otevřená data „až po 15. 1. 2026“. Strukturovaná data k nově vyhlášeným aktům se doplňují zhruba 15 pracovních dní. — [MV ČR](https://mv.gov.cz/webpm/clanek/omezeni-e-sbirky-spojene-s-postupnym-spoustenim-e-legislativy-do-ostreho-provozu.aspx)
- ČSN: novela zákona o technických požadavcích na výrobky zrušila ve stavebním zákoně ustanovení o bezplatném přístupu k některým normám. Nejvyšší správní soud dříve rozhodl, že normy závazné podle stavebního zákona musí být dostupné bezplatně. Online přístup ke všem cca 36 000 ČSN stál podle dokumentu z roku 2020 3 000 Kč na uživatele bez možnosti tisku. Aktuální stav k roku 2026 jsem nepotvrdil. — [TZB-info](https://www.tzb-info.cz/118718-za-pristup-ke-vsem-technickym-stavebnim-normam-se-bude-bez-vyjimky-platit); [TZB-info – NSS](https://www.tzb-info.cz/12781-nejvyssi-spravni-soud-technicke-normy-ve-stavebnictvi-musi-byt-poskytnuty-bezplatne); [Strategie rozvoje technické normalizace (2020)](https://agenturacas.gov.cz/wp-content/uploads/2020/04/Strategie-rozvoje-technick%C3%A9-normalizace-v-%C4%8CR.pdf)
- Právní AI v ČR: Ústavní soud spustil chatbot nad judikaturou NALUS, který výslovně nedává „právní poradenství“. Wolters Kluwer nabízí ASPI AI, která hledá v ASPI a formuluje odpovědi. AI nasazenou přímo na stavebních úřadech jsem nenašel. — [Dostupný advokát](https://dostupnyadvokat.cz/en/blog/constitutional-court-launches-ai-chatbot-new-way-to-access-case-law-in-nalus-but-without-legal-advice); [Wolters Kluwer](https://www.wolterskluwer.com/cs-cz/news/rok-2024-ve-svete-aspi)

#### Právní rámec, který ovlivňuje AI nástroje
- Nový stavební zákon 283/2021 Sb. platí od 1. 1. 2024 pro vyhrazené stavby a od 1. 7. 2024 pro ostatní a zavádí digitalizaci stavebního řízení. — [MMR](https://www.mmr.cz/getmedia/997a8adf-04d0-43e8-be6c-f322e2c97010/stavebni-zakon-Online.pdf.aspx)
- Novela 437/2024 Sb. zavedla dočasný „bypass“ digitalizace (§ 334b) s přechodným obdobím do 31. 12. 2027 pro stavební řízení. Žádat přes Portál stavebníka lze, ale není to povinné. — [Právní prostor](https://www.pravniprostor.cz/clanky/spravni-pravo/novy-stavebni-zakon-odkladaci-novela-bypass-se-snazi-resit-nesvary-digitalizace); [BusinessInfo](https://www.businessinfo.cz/clanky/senat-schvalil-bypass-digitalizace-stavebniho-rizeni/)
- Od 1. 8. 2025 platí tři novely, které mění i nový stavební zákon, mimo jiné 87/2025 Sb. (Lex OZE III) se změnami požadavků na dokumentaci. — [Právní prostor](https://www.pravniprostor.cz/clanky/spravni-pravo/novela-stavebniho-zakona-od-1-srpna-2025-co-se-meni-kde-si-dat-pozor)
- Od 1. 1. 2026 platí část zákona 330/2025 Sb. o správě informací o stavbě a vystavěném prostředí, která má veřejným investorům uložit povinnost pořizovat informační modely. Zdroj je jediný a rozsah povinnosti jsem neověřil. — [ESTAV – přehled novel](https://www.estav.cz/cz/14146.velky-prehled-co-prinesly-novely-stavebniho-prava-a-jak-ovlivni-praxi)
- 11. 6. 2026 nabyla účinnosti novela stavebního zákona 91/2026 Sb. Obsah jsem nezjistil. — [Právní prostor](https://www.pravniprostor.cz/zmeny-v-legislative/vyslo-ve-sbirce-zakonu/novela-stavebniho-zakona-2)
- Autorské právo: AI obrázek není autorským dílem (Městský soud v Praze, 10 C 13/2023-16). — [epravo.cz](https://www.epravo.cz/top/clanky/mestsky-soud-v-praze-o-umele-inteligenci-a-autorskem-pravu-117318.html)

#### České a středoevropské AI startupy a iniciativy pro AEC
- **Constriq** (spin-off FSv ČVUT, 2026): Cloud2BIM převádí mračna bodů na IFC; AI verze se připravuje. Využití má v předdemoličních auditech a přípravě rekonstrukcí. — [Feedit](https://www.feedit.cz/2026/02/02/fakulta-stavebni-cvut-ma-prvni-spin-off-spolecnost-constriq-se-zameri-na-automatizaci-digitalizace-existujicich-budov-pomoci-umele-inteligence-a-podstatne-usnadni-preddemolicni-audity-i-pripravu-reko/)
- **QIK Dokumentace**: technické zprávy a projektová dokumentace. — [Stavitel](https://stavitel.cz/ekonomika/projektant-ma-projektovat-rutinu-muze-prevzit-umela-inteligence/)
- **RMind BIM**: BIM platforma s AI pro analýzu půdorysů, kolize a výkazy výměr (tvrzení výrobce). — [RMind BIM](https://bim.rmind.ai/)
- **Validorix (DigiStav Group)**: podle webu firmy kontroluje stavební dokumentaci, generuje checklisty a analyzuje BIM data. Nezávislé zdroje jsem nenašel; profil DigiStav na portálu řemeslníků AI nezmiňuje. — [DigiStav](https://digistav.cz/ai-ve-stavebnictvi); [Nejřemeslníci](https://www.nejremeslnici.cz/profil/453737-digistav-group-s-r-o)
- **Homeplot**: český 3D plánovač domu, interiéru a zahrady s AI vizualizací, určený hlavně laikům. — [ESTAV](https://www.estav.cz/cz/15012.dum-interier-i-zahrada-v-jednom-cesky-3d-planovac-nabizi-i-ai-vizualizaci); [TZB-info](https://stavba.tzb-info.cz/30464-dum-interier-i-zahrada-v-jednom-cesky-3d-planovac-nabizi-i-ai-vizualizaci)
- **Rendero** (MA Studio): AI renderování. — [MA Studio](https://www.ma-studio.cz/en/clanek/rendero-ai-our-ai-solution/)
- **ALICE Technologies**: AI plánování výstavby s vývojovým týmem v ČR; projekt získal přes 700 mil. Kč (článek z roku 2023). — [CzechCrunch](https://cc.cz/cechoamerican-uci-svet-planovat-stavby-s-umelou-inteligenci-na-svuj-projekt-ziskal-pres-700-milionu/)
- **AI VESTA**: školení a zavádění AI ve stavebnictví. — [AI VESTA](https://www.aivesta.cz/)
- Stavební skupina **PSG** a platforma **ZLIN.AI** zvou české AI startupy z oboru stavebnictví, aby technologie testovaly na projektu Prospect ve Zlíně. CAMEB provozuje program o využití AI ve stavebnictví. — [Česká asociace umělé inteligence](https://asociace.ai/stavebni-skupina-psg-nabizi-spolupraci-zacinajicim-ai-startupum/); [CAMEB](https://www.cameb.cz/conai)
- Ze střední Evropy je nejsilnějším hráčem skupina **Nemetschek** (Graphisoft, ALLPLAN, Solibri, Bluebeam, Vectorworks) se společným AI Assistant nasazovaným od roku 2025. Nemetschek investoval i do Document Crunch. — [Nemetschek – digitalBAU 2026](https://www.nemetschek.com/en/digitalbau-2026); [Simplify](https://simplify.jobs/c/Document-Crunch)

#### České ateliéry, školy a instituce
- **MA Studio (Praha)** využívá AI při návrzích staveb a vyvíjí vlastní aplikaci (Rendero). Hlavní architekt Dan Merta: AI zatím neumí navrhnout celý dům a musí se na ni dohlížet. — [HN](https://archiv.hn.cz/c1-67699740-ai-pomaha-vytvaret-navrhy-domu-musi-se-na-ni-ale-dohlizet)
- **FA ČVUT** vystavila ateliérové práce „AI in architectural practice“ a porovnávala návrhy studentů s návrhy AI na stejné zadání. VUT vydalo diplomovou práci o GAN (CycleGAN, Pix2pix) v architektuře (2022). — [FA ČVUT](https://fa.cvut.cz/en/gallery/studio-projects/74451-ai-in-architectural-practice); [ESTAV](https://www.estav.cz/cz/12528.umela-inteligence-v-dile-budoucich-architektu); [VUT](https://dspace.vut.cz/items/c11f1cd5-a4aa-46dd-94c2-c20107ab859f)
- **ARCHIP** pořádal v březnu 2026 workshopy o tom, jak AI zasahuje do navrhování. — [ARCHIP](https://www.archip.eu/wp-content/uploads/2026/03/PR_2026_03_24_learnfromthe-best.docx)
- **Česká komora architektů**: veřejný postoj ani metodiku k AI jsem nenašel. Předsedou byl 30. 4. 2026 znovu zvolen Jan Kasl. — [Archiweb](https://www.archiweb.cz/en/news/predsedou-ceske-komory-architektu-byl-opet-zvolen-jan-kasl)
- **czBIM / buildingSMART CZ** měl na slovinské konferenci 25. 9. 2026 v Lublani přednášku s názvem v překladu „BIM v bodě obratu: umělá inteligence už je tady“. — [GZS – program](https://www.gzs.si/Portals/159/25%209%202026%20KON%C4%8CNI%20PROGRAM.pdf)
- ESTAV popisuje vizi ateliérů, kde jeden AI agent generuje koncepty, druhý zpracovává statiku a třetí analyzuje rozpočet nebo uhlíkovou stopu. Jde o vizi, ne o realitu. — [ESTAV](https://www.estav.cz/cz/14311.ai-a-architektura-jak-umela-inteligence-meni-komplexni-obor-na-pomezi-umeni-a-techniky)
- ASB připomíná, že Zaha Hadid Architects používají DALL-E 2 a Midjourney k hledání nápadů. — [ASB](https://www.asb-portal.cz/architektura/ai-v-architekture-zasadni-prinos-nebo-zivotni-ohrozeni-profese)

### Inferences
- **Největší česká mezera je kontrola souladu s předpisy.** Neexistuje česká obdoba UpCodes. Realistická cesta je vlastní LLM asistent nad texty z e-Sbírky (stavební zákon, vyhlášky 131/2024 Sb. a další), s povinnými citacemi paragrafů a datem účinnosti. Data lze získat přes schválené API. Bez ČSN, které jsou placené a licencované, bude asistent vždy neúplný.
- **Čeština nevadí tam, kde se pracuje s obrazem a geometrií** (vizualizace, IFC kontrola, kolize). **Vadí tam, kde se pracuje s textem a předpisy**, kde jsou americké nástroje nepoužitelné. Pro přepis jsou české nástroje (Beey) na úrovni státních institucí.
- **Časté novely stavebního práva** (2024–2026) a nový zákon o informačním modelu (330/2025 Sb.) znamenají, že AI odpovědi „z paměti“ modelu jsou pro ČR obzvlášť nespolehlivé. Zákon 330/2025 Sb. zároveň může u veřejných zakázek zvýšit poptávku po BIM a tedy i po automatizaci BIM.
- **Konkurenční mezera:** v českých médiích je veřejných zmínek o tom, že ateliéry používají AI, málo (jen MA Studio). Ateliér, který zdokumentuje vlastní AI postupy, by se mohl odlišit. To je inference, ne zjištění.
- Výstupy AI vizualizací nejsou podle českého soudu autorskými díly. U smluv s klienty je proto vhodné řešit licence a autorství obrázků jinak než u klasických vizualizací.

### Gaps
- Nepodařilo se systematicky projít Earch.cz, Archiweb, ASB, CzBIM, Lupa.cz a CzechCrunch kvůli zablokovanému WebFetch a vyčerpanému rozpočtu vyhledávání. Další české ateliéry s veřejně popsaným užitím AI (například velká pražská a brněnská studia) proto mohou existovat.
- Nezjistil jsem, zda Autodesk Assistant, Archicad AI Assistant, Vectorworks AI Assistant, Solibri AI asistent a PlanRadar podporují češtinu.
- Nezjistil jsem, zda RTS (BUILDpower) nebo ÚRS (KROS 4) mají AI funkce.
- Nevím, zda ČKA, ČKAIT nebo MMR připravují metodiku užívání AI v projektování.
- Aktuální podmínky přístupu k ČSN (2026) a rozsah povinnosti podle zákona 330/2025 Sb. je třeba ověřit v primárních zdrojích.
- Validorix a RMind BIM jsou ověřené jen z webů výrobců.
