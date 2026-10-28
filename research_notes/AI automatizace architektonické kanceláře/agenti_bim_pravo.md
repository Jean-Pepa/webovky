# Agenti, automatizace BIM a právní mantinely pro malý architektonický ateliér (ČR/EU, stav k 28. 10. 2026)

> **Metodická poznámka pro autora zprávy.** V tomto prostředí byl přímý přístup (WebFetch/curl) k většině webů zablokován síťovou politikou relace (mj. autodesk.com, mcneel.github.io, arxiv.org, eur-lex.europa.eu, koncepcebim.gov.cz, agenturacas.gov.cz, cka.cz, graphisoft.com, e-sbirka.gov.cz, zakonyprolidi.cz). **Přímo přečtené a ověřené jsou jen stránky GitHubu (README repozitářů).** Ostatní zjištění vycházejí ze souhrnů výsledků vyhledávače; u každého je odkaz na původní stránku, kterou vyhledávač citoval. Sekundární, marketingové a nejisté zdroje jsou označené. Sdílený limit webového vyhledávání se vyčerpal dřív, než šlo pokrýt Pražské stavební předpisy, ČSN 73 08xx, GDPR, pojištění profesní odpovědnosti, Solibri, Dynamo, Motif a Rhino.Compute (viz Gaps v jednotlivých oddílech).

## 1. Integrace agentů s CAD/BIM (MCP servery a API: Revit, Archicad, Rhino/Grasshopper, Blender + Bonsai + IfcOpenShell, Speckle): vyspělost a lokální provoz

### Takeaway
Do konce roku 2026 nabídli všichni tři velcí výrobci vlastní MCP jako technologický náhled:
- **Autodesk:** Revit Public MCP Server, jen pro Revit 2027.2+.
- **Graphisoft:** Archicad MCP v betě pro Archicad 30, jen v plánech Collaborate a Max.
- **McNeel:** open-source RhinoAI / Rhino MCP, které výslovně podporuje i lokální modely.

Vedle nich existují desítky komunitních MCP serverů. Většinou mají licenci MIT, běží lokálně přes stdio a jsou ve stavu alfa nebo pre-release. Nejotevřenější a nejsnáze plně lokální cestou je ekosystém IFC v IfcOpenShell: verze 0.9.0 už obsahuje vlastní `ifcmcp` vedle `ifctester`, `ifcdiff`, `ifccsv`, `bcf` a dalších, s Blenderem a Bonsai jako GUI. Lokální LLM lze připojit přes MCP hosty typu ollmcp. Téměř žádný BIM MCP projekt ale lokální modely netestuje; výjimkou je blender-open-mcp a dokumentace McNeel RhinoAI.

### Cited Findings

#### Revit (Autodesk)
- **Revit 2027 a plán MCP:** Revit 2027 vyšel 7. 4. 2026 spolu s AI asistentem. Autodesk podle zdroje plánuje podporovat lokální i cloudové MCP servery — [Barvea (sekundární blog)](https://barvea.com/en/blog/revit-2027-ai-assistant-mcp-new-features).
- **Revit Public MCP Server:** Autodesk ho představil 17. 6. 2026 („A Trusted Foundation for AI-Powered Workflows“) — [Autodesk AEC blog](https://www.autodesk.com/blogs/aec/2026/06/17/revit-public-mcp-server/). Stránku nešlo stáhnout, obsah je jen ze souhrnu vyhledávače.
  - Je to Tech Preview a lokální MCP server přes STDIO.
  - Citace: „During the Technical Preview, the Revit Public MCP Servers are supported only on Revit 2027.2 and later versions. Support for Revit 2026 and earlier versions is still under evaluation“ — [Autodesk Community – MCP Server for Revit Tech Preview Launch](https://forums.autodesk.com/t5/revit-architecture-forum/mcp-server-for-revit-tech-preview-launch/td-p/14262009).
  - Komunitní příspěvek popisuje oficiální Revit MCP jako rozdělený na úrovně „read, write and experimental“, lokální stdio, jen Revit 2027.2 — [Autodesk Community – Revit Model MCP](https://forums.autodesk.com/t5/revit-api-forum/revit-model-mcp-open-source-mcp-server-for-revit-2022-2027-read/td-p/14267211). Sekundární, přesné znění neověřeno.
- **Autodesk Assistant v Revitu 2027:** stále je označen jako tech preview.
  - Popisuje se jako „agentic design-and-make partner“ (produktová nápověda, otázky nad modelem, automatizace úloh promptem).
  - Běží jako chatovací panel a každé volání nástroje je vidět na obrazovce.
  - Podle nápovědy podporuje 6 skupin MCP nástrojů: dotazy na model, správa listů (sheets), místnosti, výkazy, exporty, operace s prvky.
  - Zdroje: [Autodesk Revit 2027 Help](https://help.autodesk.com/view/RVT/2027/ENU/?guid=GUID-620ECD98-53F7-47F1-B700-EEE84F15EBF7); [goto.archi](https://goto.archi/blog/post/whats-new-in-revit-2027); [BIMsmith](https://blog.bimsmith.com/Revit-2027-How-Autodesk-Assistant-Bridges-the-Gap-Between-Intent-and-Execution).
  - Japonský vývojářský blog Autodesku pokrývá totéž — [Autodesk Developer Blog](https://blog.autodesk.io/revit-2027-and-autodesk-assistant-release-announcement/).
- **Spolehlivost a audit Assistantu:**
  - Praktická recenze uvádí, že jednoduché a dobře vymezené dotazy fungují spolehlivě, kdežto složité úlohy „frequently fail“. V několika případech Assistant hlásil úspěch, ač se v modelu nic nezměnilo — [Micrographics](https://mgfx.co.za/blog/autodesk/revit-2027-3-autodesk-assistant-what-can-ai-actually-do-in-your-revit-model/). Přiřazení ke konkrétnímu zdroji je ze souhrnu vyhledávače, nejpravděpodobněji jde o tuto recenzi.
  - Od verze 2027.1 se každá akce Assistantu loguje do Revit journalu a běžící akci lze přerušit tlačítkem Stop — podle jednoho ze zdrojů ve výsledcích ([goto.archi](https://goto.archi/blog/post/whats-new-in-revit-2027) / [FetchBIM](https://blog.fetchbim.com/revit-2027)), přiřazení nejisté.
- **Komunitní Revit MCP servery** (GitHub, nevetované Autodeskem):
  - **Revit Model MCP (sharafutdinovdi/revit-model-mcp)** — [GitHub README](https://github.com/sharafutdinovdi/revit-model-mcp):
    - Licence MIT, Revit 2022–2027 na Windows; add-in pro .NET 4.8, .NET 8 a .NET 10.
    - Čtecí nástroje: dotazy, varování, „model health“, exporty obrázků.
    - Zápisové nástroje: přesun, rotace, kopie a mazání prvků, parametry, stěny a MEP, rodiny, pohledy a listy, uložení a synchronizace, export, spuštění C# (`revit_execute_code`), undo.
    - Každá změna je jedna pojmenovaná položka undo. Nástroje měnící model mají `dry_run`.
    - Nevratné kroky (uložení, sync, odstranění linků, C#, smazání více než 500 prvků) vyžadují jednorázový potvrzovací token platný 5 minut.
    - README varuje: „a client that confirms by itself can send it back“ a pro bezobslužné běhy doporučuje read-only.
    - Lokálně běží přes stdio, vzdáleně přes SSH. Testováno s Claude Desktop a Claude Code. Buildy nejsou podepsané, repozitář má 7 hvězd.
    - **Rozpor mezi zdroji:** README dnes říká „Actions are on by default“. Titulek vlákna na fóru a souhrn vyhledávače naopak uvádějí „read-only by default“, v0.5.0, 18 čtecích a 9 akčních nástrojů, které uživatel výslovně zapíná — [Autodesk Community](https://forums.autodesk.com/t5/revit-api-forum/revit-model-mcp-open-source-mcp-server-for-revit-2022-2027-read/td-p/14267211); [sharafutdinov.online](https://sharafutdinov.online/revit-mcp). Zřejmě jde o změnu mezi verzemi.
  - **AEC Model Bridge (Sam-AEC):** pre-release. Zápisové nástroje jsou blokované, dokud uživatel neschválí plán. Stránka uvádí, že zatím nic „has been verified in a live Revit session“ — [GitHub](https://github.com/Sam-AEC/Autodesk-Revit-MCP-Server); [PulseMCP](https://www.pulsemcp.com/servers/sam-aec-autodesk-revit).
  - **Horizun revit-mcp:** Apache-2.0, Revit 2023–2027, Windows instalátor včetně runtime — [GitHub](https://github.com/HorizunGroup/horizun-revit-mcp).
  - **UV-Tech revit-claude-mcp:** MIT, 40 lokálních nástrojů (čtení, úpravy, export, audit, koordinace) — [GitHub](https://github.com/UV-Tech/revit-claude-mcp).
  - **Demolinator/revit-mcp-server:** jde přes pyRevit, 48 nástrojů včetně dokumentace a kolizí, Revit 2024–2027 — [GitHub](https://github.com/Demolinator/revit-mcp-server).
  - **LuDattilo/revit-mcp-server („mcp-servers-for-revit“):** Revit 2023–2026. Titulek uvádí 80+ nástrojů, popis 138 — [GitHub](https://github.com/LuDattilo/revit-mcp-server).
  - **schauh11/revit-mcp-server:** chatovací panel přímo v Revitu 2026, 53+ nástrojů, vyžaduje API klíč (tedy cloudové LLM) — [GitHub](https://github.com/schauh11/revit-mcp-server).
- **pyRevit:** „Rapid Application Development (RAD) Environment for Autodesk Revit®“. Licence GPL-3.0, skripty v IronPythonu, CPythonu, C# a VB.Net, k tomu CLI pro nasazení nástrojů a telemetrický server pro týmy — [GitHub pyRevit](https://github.com/pyrevitlabs/pyRevit).

#### Archicad (Graphisoft)
- **Archicad MCP od Graphisoftu:** je v betě pro Archicad 30 a má dvě části.
  - Agentní AI Assistant uvnitř Archicadu.
  - Public MCP Server pro externí desktopové AI nástroje (dokumentace uvádí Claude Desktop a Cursor). Nastavuje se v Options odkazem na konfigurační soubor klienta; ověření dotazem „Get Archicad instances“.
  - Je dostupný jen v plánech Archicad Collaborate a Archicad Max.
  - Dokumentace ho označuje jako Technology Preview v rámci Beta Update programu 2026.
  - Zdroje: [Graphisoft Help – Public MCP Connection](https://help.graphisoft.com/.beta2026/en/AI_Assistant_NewTopics/public_mcp_connection.html); [Graphisoft Help – Archicad MCP Tech Preview](https://help.graphisoft.com/.beta2026/en/AI_Assistant_NewTopics/mcptechpreview.html); [Graphisoft – AI Solutions](https://www.graphisoft.com/en-us/plans-and-products/ai-solutions/).
- **AI Assistant (Beta):** odpovídá na otázky, spouští dotazy, kontroluje model a dělá dávkové úpravy, které uživatel schválí. **Vyžaduje připojení k internetu** — [Graphisoft – AI Solutions](https://www.graphisoft.com/en-us/plans-and-products/ai-solutions/); [Archicad 30 Help – AI Assistant (Beta)](https://help.graphisoft.com/AC/30/INT/Topics/001_GettingHelp/AI_Assistant/ai_assistant_Introduction.html).
- **Tapir (ENZYME-APD):** open-source add-on (MIT), který „registers several new JSON commands on top of the official commands provided by Graphisoft“.
  - K tomu Grasshopper plugin; je rozpracovaný a v Rhino Package Manageru se jmenuje „tapir“.
  - Ke stažení pro Archicad 25–29 (Windows i macOS).
  - Heslo projektu: „The easiest way to use the JSON/Python API from Archicad without knowing how to code“ — [GitHub Tapir](https://github.com/ENZYME-APD/tapir-archicad-automation).
- **tapir-archicad-MCP (SzamosiMate)** — [GitHub](https://github.com/SzamosiMate/tapir-archicad-MCP):
  - „dynamically generates a comprehensive set of 191+ MCP tools from the combined API schemas“ (Tapir a oficiální JSON API).
  - Nástroje objevuje postupně (`archicad_list_commands`, `archicad_get_command_schema`), což „avoids flooding the model's context window“.
  - Transporty stdio, sse a streamable-http, volitelný bearer token. Umí řídit více instancí Archicadu.
  - Dlouhé příkazy vrací job handle.
  - Varování: „Cancelling a request does not stop a command already started, and retrying it may duplicate changes.“
  - Stav „alpha“, licence MIT, Python 3.12+. Doporučení: „treat installing it like handing your client your Archicad seat.“
  - Verze 0.5.0 na PyPI uváděla 137 nástrojů — [PyPI](https://pypi.org/project/tapir-archicad-mcp/0.5.0/).
- **Další komunitní servery:**
  - Boti-Ormandi/archicad-mcp: lokální stdio, oficiální JSON API a volitelně Tapir, vícekrokové Python workflow — [GitHub](https://github.com/Boti-Ormandi/archicad-mcp).
  - archicad-mcp-aberto: pre-alpha, 9 nástrojů jen pro čtení, Archicad 25+ s Tapirem — [GitHub](https://github.com/vitormartins-arq/archicad-mcp-aberto).
  - mgnnbv/archicad-server: stěny, desky, okna, dveře, zóny. Bez otevřeného projektu Archicad odpoví na každý příkaz chybou 4001 — [GitHub](https://github.com/mgnnbv/archicad-server).
  - Společné požadavky podle výpisů: běžící Archicad s otevřeným projektem na stejném stroji, JSON API na lokálních portech 19723–19743 — [souhrn výpisů / GitHub Boti-Ormandi](https://github.com/Boti-Ormandi/archicad-mcp). Ověřit v README.

#### Rhino a Grasshopper (McNeel)
- **McNeel RhinoAI:** oficiální open-source projekt (MIT) „An AI Integration for Rhino3d“, viditelná větev `rhino-9.x` — [GitHub mcneel/RhinoAI](https://github.com/mcneel/RhinoAI).
  - Dokumentace pokrývá nastavení pro Claude Desktop, Claude Code, GitHub Copilot, OpenAI Codex, Gemini CLI „and local models“.
  - Stav (beta/WIP) ani Grasshopper stránka neuvádí.
  - Web projektu: „Rhino MCP Platform is a free MCP from McNeel… connects our software to AI assistants like Claude, GitHub Copilot, Codex, Gemini, and Local LLMs“ — [mcneel.github.io/RhinoAI](https://mcneel.github.io/RhinoAI/). Jen ze souhrnu vyhledávače, stránka nešla stáhnout.
- **RhinoMCP (jingcheng-chen)** — [GitHub](https://github.com/jingcheng-chen/rhinomcp):
  - Architektura: Python MCP server (stdio) → TCP `127.0.0.1:1999` → RhinoCommon C# plugin.
  - Jen Rhino 8 (Windows, macOS).
  - Asi 30 nástrojů pro Grasshopper: komponenty, propojení, slidery, řešení, dávkové sestavení celého grafu.
  - Nástroje pro spouštění kódu (`run_command`, `execute_rhinoscript_python_code`, `execute_rhinocommon_csharp_code`) lze vypnout proměnnými prostředí.
  - Spojení je neautentizované a dává modelu „an open execution surface inside Rhino“. README radí: „Do not expose it beyond the loopback interface without adding authentication.“
  - MIT, asi 1,2k hvězd. Projekt „is not made by McNeel“. Uvádí jen hostované klienty, lokální modely nezmiňuje.
- Rhino.Compute se ve výsledcích vyhledávání neobjevil (viz Gaps).

#### Blender + Bonsai + IfcOpenShell (otevřený IFC ekosystém)
- **IfcOpenShell v0.9.0** — [GitHub IfcOpenShell](https://github.com/IfcOpenShell/IfcOpenShell). Obsahuje mimo jiné:
  - `ifcmcp` („MCP server for querying and editing IFC models“);
  - `ifctester` (knihovna, CLI a webová aplikace pro audit modelu podle IDS);
  - `ifcdiff` (porovnání změn mezi modely), `ifccsv` (export a import výkazů), `ifcclash` (kolize);
  - `bcf` (BCF-XML a OpenCDE BCF-API);
  - `ifcpatch`, `ifcquery`, `ifcedit`;
  - `ifc5d` (náklady), `ifc4d` (harmonogramy), `ifcfm` (předání pro správu), `bsdd`.

  Jádro má licenci LGPL-3.0-or-later, Bonsai GPL-3.0-or-later. Parsuje IFC2x3 TC1, IFC4 Add2 TC1, IFC4x1, IFC4x2 a IFC4x3 Add2; plnou geometrickou podporu má pro IFC2x3 a IFC4.
- **BlenderMCP (ahujasid)** — [GitHub](https://github.com/ahujasid/blender-mcp):
  - MIT, asi 32,6k hvězd. Add-on se socket serverem v Blenderu a MCP server, komunikace JSON přes TCP.
  - 9 nástrojů včetně `execute_blender_code`.
  - Telemetrie je zapnutá ve výchozím stavu (minimální anonymní záznam, vypíná se `DISABLE_TELEMETRY=true`); data mohou sloužit mimo jiné „to train AI models“.
  - „the addon's socket server has no authentication or encryption“. Safe mode je ve výchozím stavu vypnutý.
  - „Use with caution in production environments“. Lokální modely v dokumentaci nejsou.
- **blender-open-mcp (dhakalnirajan)** — [GitHub](https://github.com/dhakalnirajan/blender-open-mcp):
  - „Local-first Model Context Protocol (MCP) server for controlling a live Blender session from AI agents“.
  - „Default LLM backend is Ollama at http://localhost:11434, model llama3.2“, přepnout lze na LM Studio nebo llama.cpp.
  - Testy mockují Blender i LLM, add-on tedy nebyl ověřen end-to-end. MIT, 121 hvězd.
- **Bonsai_mcp (JotaDeRodriguez)** — [GitHub](https://github.com/JotaDeRodriguez/Bonsai_mcp):
  - Fork BlenderMCP s IFC nástroji, např. `get_ifc_spatial_structure`, `get_ifc_quantities`, `export_drawing_png`, `georeference_ifc_model`, `export_bc3_budget`.
  - Má MCP prompt `Technical_building_report`.
  - Docker nasazení vystavuje nástroje jako REST/OpenAPI. Dokumentuje nastavení pro Claude Desktop a Open WebUI.
  - MIT, 66 hvězd. Varování: „Complex IFC models may require breaking down operations into smaller steps.“
  - Počet nástrojů je v README nekonzistentní: „Eleven IFC tools“, ale seznam má 15 položek.
- **ifc-bonsai-mcp (Show2Instruct, MCP4IFC)** — [GitHub](https://github.com/Show2Instruct/ifc-bonsai-mcp):
  - „over 50 MCP tools“: parametrické stěny, střechy, desky, dveře, okna a schodiště, IFC dotazy, styly.
  - RAG nad dokumentací IfcOpenShell (lokální ChromaDB a all-MiniLM-L6-v2).
  - Obecný nástroj pro kód „behaves unpredictably with IFC operations“ a „cannot save changes back to the model consistently“.
  - Blender 4.4+, Bonsai 0.8.2+. MIT, 68 hvězd, 7 commitů; „not an official Blender, Bonsai or IfcOpenShell project“.
- **Článek MCP4IFC:** popisuje lokální MCP server nad IfcOpenShell a Bonsai s nástroji pro dotazy na scénu (JSON souhrny), parametrickými nástroji a RAG. Autoři uvádějí, že „an LLM using our framework can successfully perform complex tasks, from building a simple house to querying and editing existing IFC data“ — [arXiv 2511.05533](https://arxiv.org/abs/2511.05533); [stránka projektu](https://show2instruct.github.io/mcp4ifc/).

#### Speckle jako datový hub
- **Oficiální MCP server od Speckle se nenašel.**
- **bimgeek/speckle-mcp:** postavený na FastMCP a SpecklePy. Umí výpis a hledání projektů, verze modelů a dotazy na vlastnosti objektů. Vyžaduje `SPECKLE_TOKEN`, výchozí server je app.speckle.systems — [LobeHub](https://lobehub.com/mcp/bimgeek-speckle-mcp).
  - Bezpečnostní skener ho vede jako nástroj jen pro čtení — [AgentSeal](https://agentseal.org/mcp/speckle-mcp).
  - Repozitář má 14 hvězd, žádné releasy a licence na stránce není vidět — [GitHub](https://github.com/bimgeek/speckle-mcp).
- **Daviidro/speckle-mcp:** přenos dat nechává nativním konektorům Speckle, sám poskytuje jen instrukce a metadata — [Glama](https://glama.ai/mcp/servers/Daviidro/speckle-mcp).
- **IDS validace ve forku speckle-serveru:** fork přidává validaci přes ifctester 0.9.0 v Python workeru. Je označen „NÃO MERGEAR“ a nebyl ověřen na reálných exportech z Revitu a Archicadu — [GitHub PR](https://github.com/JoseARVargas/speckle-server/pull/4).

#### Lokální modely: MCP hosty
- **ollmcp (mcp-client-for-ollama)** — [GitHub](https://github.com/jonigl/mcp-client-for-ollama):
  - TUI, které připojí lokální Ollama modely k jednomu nebo více MCP serverům (STDIO, SSE, Streamable HTTP).
  - „The following Ollama models work well with tool use:“ gemma4, qwen3.5, lfm2.5-thinking, llama3.2, mistral.
  - Schvalování nástrojů člověkem (HIL) je „enabled by default for safety“.
  - MIT, 834 hvězd, verze v0.27.0. Ne-Ollama poskytovatelé jsou „experimental“.
- **MCPHost (mark3labs):** podporoval Claude, OpenAI, Gemini i Ollama, ale „Active development on MCPHost has been stopped“. Repozitář je archivovaný, nástupcem je Kit — [GitHub](https://github.com/mark3labs/mcphost).

### Inferences
- **Přehled vyspělosti** (k 10/2026, syntéza výše uvedených zdrojů):

| Platforma | Oficiální agent / MCP | Stav | Komunitní MCP | Lokální LLM |
|---|---|---|---|---|
| Revit | Autodesk Assistant + Revit Public MCP (stdio) | Tech preview, jen 2027.2+ | Mnoho (MIT/Apache), alfa a pre-release | Lze přes stdio a lokální host; výrobci netestováno |
| Archicad | AI Assistant + Public MCP Server | Beta / Technology Preview, jen Collaborate a Max, Assistant vyžaduje internet | Tapir MCP (alfa, 191+ nástrojů) a další | Tapir MCP přes stdio a lokální host; netestováno |
| Rhino/GH | McNeel RhinoAI (MIT, větev Rhino 9) | Stav neuveden | RhinoMCP (Rhino 8, 1,2k hvězd) | McNeel výslovně uvádí „local models“ |
| Blender/Bonsai/IFC | `ifcmcp` přímo v IfcOpenShell 0.9.0 | Open-source, nejvíce lokální | BlenderMCP, Bonsai_mcp, MCP4IFC, blender-open-mcp | blender-open-mcp má Ollama jako výchozí |
| Speckle | Nenalezeno | – | Malé projekty, převážně jen čtení | Závisí na hostu |

- **Co je realisticky plně lokální:**
  - Větev IFC: IfcOpenShell (`ifcmcp`, `ifctester`, `ifcdiff`) a Bonsai, s lokálním LLM přes ollmcp nebo jiný MCP host.
  - Archicad 25–29 s Tapirem a Tapir MCP; samotné API je lokální, cloudový je jen Graphisoft AI Assistant.
  - Revit s komunitním MCP přes stdio.
- **Hlavní slabina lokálních modelů je spolehlivost volání nástrojů.** Žádný BIM MCP projekt nepublikuje testy s lokálními modely. Sady se 100+ nástroji přetíží kontext menších modelů; proto Tapir MCP zavedl postupné objevování nástrojů. Pro lokální modely je vhodnější úzká sada vysokoúrovňových, typovaných nástrojů („vytvoř stěnu“, „vypiš místnosti“) než obecné spouštění Pythonu nebo C#, které i autoři MCP4IFC označují za nespolehlivé.
- **Bezpečnost:** většina mostů (BlenderMCP, RhinoMCP) je neautentizované TCP na localhostu s možností spouštět libovolný kód. Platí tedy: jen loopback, kde to jde vypnout nástroje pro spouštění kódu, pro bezobslužné běhy režim jen pro čtení, potvrzovací tokeny a dry-run (vzorem je Revit Model MCP). Vypnout telemetrii (BlenderMCP), aby data klienta neodcházela.
- **Na čem stavět:** stabilním základem jsou samotná API (Revit API, pyRevit, Archicad JSON API s Tapirem, RhinoCommon/Grasshopper, IfcOpenShell). MCP vrstvy se mění měsíc od měsíce, takže ateliér by měl mít vlastní tenkou adaptérovou vrstvu (viz referenční architektura v oddílu 5).

### Gaps
- **Rhino.Compute** (bezhlavé spouštění Grasshopperu přes REST): výsledky ho nepokryly. Neověřeno licencování ani vztah k RhinoAI.
- **Datové toky Autodesk Assistantu a Graphisoft AI Assistantu:** nezjištěno, zda zpracovávají data v cloudu, s jakým LLM a v jakém regionu (podstatné pro GDPR a mlčenlivost). U Graphisoftu je jen informace, že vyžaduje internet.
- **Licenční podmínky Revit Public MCP** (předplatné, AEC Collection): stránka Autodesku nebyla dostupná.
- **Oficiální Python API Archicadu** (balíček `archicad`) a vztah Graphisoft Public MCP k JSON API nejsou podrobně ověřené.
- **Chybí nezávislé benchmarky** spolehlivosti těchto MCP serverů s lokálními modely, například Qwen nebo Gemma přes Ollamu.
- **Vlastnosti `ifcmcp`** (nástroje, stav): známe jen jednovětý popis z README IfcOpenShell.

## 2. Automatizace dokumentace z BIM (výkresy, pohledy, výkazy, popisky, kóty, technické zprávy) a vazba na vyhlášku č. 131/2024 Sb.

### Takeaway
Výkresovou část (pohledy, listy, výkazy, popisky a kóty) lze z modelu automatizovat:
- nativními asistenty: Autodesk Assistant umí pohledy, listy, výkazy a PDF export; Graphisoft AI Assistant dávkové úpravy se schválením;
- komerčními nástroji: SWAPP s asistentem „Frank“ vyžadujícím schválení, ArchiLabs s chatem generovanými workflow;
- skripty: pyRevit, Tapir, IfcOpenShell (`ifccsv`, výkresy a výkazy z Bonsai).

Spolehlivost u složitých úloh je ale zatím nízká a čísla výkonnosti jsou převážně marketingová. Vyhláška 131/2024 Sb. stanoví jen obsah a členění dokumentace, BIM nevyžaduje. Formáty pro podání určuje vyhláška 190/2024 Sb.: PDF/A-3 a IFC 4+. Technické zprávy lze generovat z dat modelu do šablony podle příloh vyhlášky, ale odpovídá za ně projektant.

### Cited Findings
- **Autodesk Assistant:** umí vytvářet, spravovat a exportovat výkazy, pohledy a listy.
  - Příklad z nápovědy řetězí půdorys, šablonu pohledu, popis místností, vytvoření listu, pojmenování a PDF export přes více podlaží — [Autodesk Revit 2027 Help](https://help.autodesk.com/view/RVT/2027/ENU/?guid=GUID-620ECD98-53F7-47F1-B700-EEE84F15EBF7).
  - Sekundární zdroje uvádějí, že vytváření listů řeší číslování, titulky a umístění pohledů — [BIMsmith](https://blog.bimsmith.com/Revit-2027-Key-Things-to-Know-About-the-Latest-Release-of-Autodesk-Revit); [Pirros](https://www.pirros.com/blog/whats-new-in-revit). Přiřazení ke konkrétnímu zdroji je nejisté.
  - Složité úlohy podle praktické recenze často selhávají, včetně falešného hlášení úspěchu — [Micrographics](https://mgfx.co.za/blog/autodesk/revit-2027-3-autodesk-assistant-what-can-ai-actually-do-in-your-revit-model/).
- **SWAPP (swapp.ai):**
  - Podle vlastního webu automatizuje „up to 80%“ dokumentačních úloh (kóty, popisky, pohledy, listy). AI asistent „Frank“ pracuje v živém modelu Revitu a změny provádí až po schválení uživatelem.
  - Web uvádí certifikaci ISO 27001 a „104,300+“ ušetřených produkčních hodin za dva roky; obojí je self-reported — [SWAPP](https://swapp.ai/).
  - Integrace s Revitem a Archicadem — [SWAPP Integrations](https://swapp.ai/integrations/).
  - aec+tech popisuje výstupy (kóty, popisky, pohledy, listy, výkazy, QA) „grounded in a firm's own standards“ — [aec+tech](https://www.aecplustech.com/tools/swapp).
  - Data-Driven AEC tvrdí, že se učí z minulých projektů kanceláře a převádí studii na prováděcí sadu „in days rather than weeks“ — [Data-Driven AEC](https://datadrivenaec.com/tools/swapp-ai). Marketingové tvrzení, neověřené.
- **ArchiLabs:**
  - Automatizace Revitu chatem: uživatel popíše úlohu a AI sestaví workflow, které lze předem prohlédnout a spustit bez Dynama či skriptování. Umí dávkové pohledy, tvorbu a rozvržení listů, popis místností, parametry a výkazy — [ArchiLabs](https://archilabs.ai/posts/ai-revit-automation-for-residential-architecture-archilabs).
  - Hodnocení 6,7/10 — [Zekai](https://zekaiwork.com/ai-tools/archilabs/).
  - V roce 2025 byl nástroj v betě s nejasnými cenami — [AI Agents List](https://aiagentslist.com/agents/archilabs).
- **Komunitní MCP pro Revit** mají nástroje pro tvorbu pohledů a listů a exporty — [Revit Model MCP](https://github.com/sharafutdinovdi/revit-model-mcp); [Demolinator/revit-mcp-server](https://github.com/Demolinator/revit-mcp-server).
- **Otevřená IFC cesta:**
  - `ifccsv` exportuje a importuje výkazy, `ifc5d` reportuje náklady, `ifcfm` připravuje předání pro správu — [IfcOpenShell](https://github.com/IfcOpenShell/IfcOpenShell).
  - Bonsai_mcp má `export_drawing_png`, `get_ifc_quantities`, `export_bc3_budget` a hotový MCP prompt `Technical_building_report` — [Bonsai_mcp](https://github.com/JotaDeRodriguez/Bonsai_mcp).
- **Vyhláška č. 131/2024 Sb., o dokumentaci staveb:**
  - Vyhláška MMR ze 17. 5. 2024, účinná od 1. 7. 2024. § 1 vymezuje druhy dokumentace (mj. pro povolení stavby, rámcové povolení, odstranění), přílohy určují podrobný obsah — [Zákony pro lidi](https://www.zakonyprolidi.cz/cs/2024-131); [epravo.cz](https://www.epravo.cz/top/zakony/sbirka-zakonu/vyhlaska-ze-dne-17-kvetna-2024-o-dokumentaci-staveb-25239.html); [PROFESIS ČKAIT](https://profesis.ckait.cz/aktuality/ve-sbirce-zakonu-vysla-vyhlaska-o-dokumentaci-staveb/); [ČKA – text vyhlášky (PDF)](https://www.cka.cz/sluzby/legislativa/pravni-predpisy/provadeci-vyhlasky/vyhlaska-c-1312024-sb-vyhlaska-o-dokumentaci-staveb.pdf).
  - Komentář Digistav: vyhláška dává jen základní rámec obsahu. Další požadavky mohou plynout ze smluv, standardů investora, veřejných zakázek a BIM požadavků. Pasport stavby není automaticky totéž co podrobná dokumentace skutečného provedení nebo BIM model pro správu — [Digistav](https://digistav.cz/validorix/clanky/vyhlaska-131-2024-dokumentace-staveb).
  - Ve výsledcích se nenašlo žádné ustanovení vyhlášky, které by vyžadovalo BIM model (tamtéž).
- **Vyhláška č. 190/2024 Sb.** o provozu informačních systémů stavební správy:
  - Pro informační model stavby vkládaný do IS stavební správy předepisuje formát **IFC verze 4 a vyšší**.
  - Pro ostatní dokumenty a elektronické výkresy **PDF/A-3**.
  - Nahrávat lze přes webové rozhraní portálu nebo datové rozhraní.
  - Zdroje: [Zákony pro lidi – 190/2024 Sb.](https://www.zakonyprolidi.cz/cs/2024-190); [Sagit](https://www.sagit.cz/info/sb24190).

### Inferences
- **Realistická pipeline pro malý ateliér:**
  1. Model (Archicad, Revit nebo Bonsai).
  2. Automatické pohledy a listy podle šablon kanceláře (Assistant nebo pyRevit v Revitu, Tapir nebo vlastní skripty v Archicadu, Bonsai drawings v IFC). Výkazy místností, ploch, oken a dveří (nativně nebo `ifccsv`).
  3. Technické zprávy. Agent vyplňuje šablonu členěnou podle příloh vyhlášky 131/2024 (průvodní a souhrnná technická zpráva, situační výkresy, dokumentace objektů, dokladová část — členění A–E podle zvyklostí je nutné ověřit v textu příloh). Data bere z IFC (plochy, objemy, počty, materiály, U-hodnoty, pokud jsou v modelu), z rešerše pozemku a z kontrolních protokolů. Ke každé číselné hodnotě připojí odkaz na zdroj: GUID prvku, výpočet nebo citaci předpisu.
  4. Export do PDF/A-3 a IFC 4 pro podání podle vyhlášky 190/2024.
  5. Revize a autorizace člověkem.
- **Generování popisků a kót je pro asistenty nejobtížnější** (kolize, čitelnost) a nástroje zatím vyžadují schválení. Nejvyšší návratnost mají opakovatelné úlohy: listy, pojmenování, výkazy, exporty, popisy místností.
- **Textové zprávy z LLM** by měly vznikat jen nad strukturovanými daty z modelu a nad citovanými předpisy (RAG), ne volným psaním. Jinak hrozí nekontrolovatelné „halucinované“ parametry.
- **SWAPP a podobné cloudové služby:** pro malou kancelář je třeba ověřit umístění dat, smluvní podmínky k tréninku na datech kanceláře a dostupnost v EU.

### Gaps
- **Dynamo** (vizuální skriptování v Revitu) se ve výsledcích neobjevilo, nemáme tedy citovatelné údaje o aktuálním stavu (Dynamo 3.x, Dynamo Player a AI asistence).
- **Přesné znění příloh vyhlášky 131/2024** (povinné části technických zpráv, měřítka, obsah situací) se nepodařilo stáhnout. Členění A–E je nutné ověřit v e-Sbírce.
- **České šablony a nástroje pro dokumentaci** (CZ šablony Archicadu a Revitu, české knihovny) nebyly zkoumány.
- **Kvalita, cena a dostupnost** SWAPP a ArchiLabs v ČR/EU a jejich zpracování dat nejsou nezávisle ověřené. Nezávislé srovnání přesnosti a úspory času vyhledávání nenašlo.

## 3. Automatizovaná kontrola souladu s předpisy (pravidlové kontroly, IDS, výzkum s LLM; proveditelnost pro vyhl. 146/2024 Sb., PSP a ČSN 73 08xx)

### Takeaway
Spolehlivě automatizovatelná je dnes hlavně **kontrola informační úplnosti modelu** podle IDS. K tomu slouží `ifctester` z IfcOpenShell, lokálně a open-source, a český DSS umí IDS exportovat. Pravidlové kontroly typu Solibri se ve výzkumu používají jako „checker“ v agentních smyčkách. **Geometricko-sémantické kontroly předpisů zůstávají ve výzkumné fázi.** Přístupy s LLM (2025–2026) dosahují „semi-automated“ úrovně a trpí halucinacemi, takže výsledek musí potvrdit člověk. Vyhláška 146/2024 obsahuje kvantifikovatelné požadavky (např. manipulační kruh 1,5 m), které lze zakódovat. PSP a ČSN 73 08xx nebylo možné prozkoumat.

### Cited Findings
- **IfcTester:** umožňuje „author and read Information Delivery Specification (IDS) files“, validovat IFC modely proti IDS a generovat reporty ve více formátech. Běží jako CLI, Python knihovna i webová aplikace — [IfcOpenShell docs – IfcTester](https://docs.ifcopenshell.org/ifctester.html).
  - Ve verzi 0.9.0 je ifctester „Library, CLI, and webapp for IDS model auditing“ — [GitHub IfcOpenShell](https://github.com/IfcOpenShell/IfcOpenShell).
- **Signály zralosti ifctesteru:**
  - Chyba #9856: IDS hodnota „FALSE“ velkými písmeny se četla jako True — [GitHub issue #9856](https://github.com/IfcOpenShell/IfcOpenShell/issues/9856).
  - Správci odmítli duplikovat sémantické kontroly IDS souborů s tím, že patří do „buildingSMART IDS Audit Tool“ — [GitHub PR #9837](https://github.com/IfcOpenShell/IfcOpenShell/pull/9837).
- **IDS (buildingSMART):** „Computer interpretable XML based standard from buildingSMART to define IFC based Information Delivery Specifications“. Repozitář sbírá use-cases, vyvíjí a publikuje XSD s příklady — [GitHub buildingSMART/IDS](https://github.com/buildingSMART/IDS).
  - Projekt flo2-ifc obaluje ifctester 0.9.0 a kontroluje IDS soubory proti IDS 1.0 XSD — [GitHub flo2-ifc PR](https://github.com/flo2-connector/flo2-ifc/pull/7).
  - Existuje i komunitní „IDS MCP Server“ — [Glama – ifc-ids-mcp](https://glama.ai/mcp/servers/@vinnividivicci/ifc-ids-mcp/blob/198583a8916c9d036fdcefd919e661ba0d5dffdb/DESIGN_SPECIFICATION.md) — a IDS validace v IFC-Lite — [IFC-Lite docs](https://ifclite.dev/docs/guide/ids/).
- **DSS a IDS:**
  - Webový nástroj comBIMe (prohlizecka.koncepcebim.gov.cz) aplikuje DSS na projekt a exportuje požadavky do XLSX, CSV nebo **IDS**, který je „strojově čitelný a umožňuje automatickou validaci BIM modelů“ — [ÚRS – DSS a nástroj comBIMe](https://www.cs-urs.cz/jak-sjednotit-informace-o-stavbe-napric-profesemi-pomuze-datovy-standard-stavby/).
  - Dokument „Architektura datového standardu staveb“ (verze 0.9, datace prosinec 2025, zveřejněno v únoru 2026) popisuje tvorbu DSS v comBIMe z datového slovníku na platformě TermIt. Požadavky se do smluv, návrhových a validačních nástrojů přenášejí přes otevřené formáty IFC a IDS — [Koncepce BIM – Architektura DSS (PDF)](https://koncepcebim.gov.cz/wp-content/uploads/2026/02/architektura-datoveho-standardu-staveb-a-prilohy.pdf).
- **Text2BIM:** do agentní smyčky zapojuje pravidlový model checker a jako kontrolní nástroj používá **Solibri Office**. Vyžaduje licenci Vectorworks 2024/2025 a Solibri Office — [GitHub Text2BIM](https://github.com/dcy0577/Text2BIM); [arXiv 2408.08054](https://arxiv.org/abs/2408.08054).
- **Madireddy et al.** („Large Language Model-Driven Code Compliance Checking in BIM“, arXiv 2506.20551, publikováno v *Electronics* 2025):
  - Spojuje LLM (GPT, Claude, Gemini, Llama) s Revitem. Modely interpretují předpisy, generují Python skripty a provádějí „semi-automated compliance checks“.
  - Případové studie: rodinný dům a kancelářská budova. Autoři uvádějí úsporu času a vyšší přesnost — [arXiv 2506.20551](https://arxiv.org/pdf/2506.20551).
- **Další výzkum:**
  - arXiv 2509.17283 spojuje detekci dveří na půdorysech s LLM uvažováním (Chain-of-Thought) pro výčet zařízení při kontrole souladu — [arXiv 2509.17283](https://arxiv.org/pdf/2509.17283).
  - arXiv 2607.00015 (AI kontrola půdorysů bytových domů) uvádí jako nevýhodu LLM „hallucinations“ a jako doplněk RAG — [arXiv 2607.00015](https://arxiv.org/pdf/2607.00015).
  - Grafové sémantické uvažování pro geometricky náročné kontroly (arXiv 2606.12065) a případová studie automatické revize podle předpisů (arXiv 2510.02634) — známe jen názvy — [arXiv 2606.12065](https://arxiv.org/pdf/2606.12065); [arXiv 2510.02634](https://arxiv.org/pdf/2510.02634).
- **Graphisoft AI Assistant** umí „check the model“, ve výsledcích ale nejsou podrobnosti o rozsahu kontrol — [Graphisoft – AI Solutions](https://www.graphisoft.com/en-us/plans-and-products/ai-solutions/).
- **Vyhláška č. 146/2024 Sb., o požadavcích na výstavbu:**
  - Ze dne 31. 5. 2024, účinná od 1. 7. 2024. e-Sbírka vede informativní znění k 1. 7. 2026, vyhláška tedy byla novelizována — [e-Sbírka](https://e-sbirka.gov.cz/sb/2024/146); [Zákony pro lidi](https://www.zakonyprolidi.cz/cs/2024-146); [TZB-info (PDF)](https://www.tzb-info.cz/docu/predpisy/download/V146-2024.pdf).
  - Příklad strojově kontrolovatelných pravidel: „Byt pro osoby s těžkým pohybovým postižením v bezbariérovém standardu musí mít manipulační prostor o velikosti kruhu o průměru minimálně 1,5 m ve všech místnostech.“ Ve specifickém standardu se vyžaduje 1,8 m.
  - Další pravidla: minimální počty bezbariérových sprch, van a záchodových kabin v prostorech pro veřejnost.
  - Vyhláška odkazuje na ČSN 73 4001 Přístupnost a bezbariérové užívání, platnou od 1. 7. 2024.
  - Zdroje: [Zákony pro lidi](https://www.zakonyprolidi.cz/cs/2024-146); [SONS ČR](https://www.sons.cz/Vyhlaska-146-2024-a-CSN-P4019971.html).
  - Ustanovení o odstupech staveb se ve výsledcích nenašla (viz Gaps).
- **Kdo smí co autorizovat:** společné stanovisko ČKA a MMR (listopad 2024) se týká rozsahu oprávnění autorizovaného architekta po novele autorizačního zákona účinné od 1. 1. 2024. Řeší i povinnost přizvat specialistu na složitější části projektu — [Společné stanovisko ČKA a MMR (PDF)](https://mmr.gov.cz/getattachment/6ec3d6f0-8182-4f06-a30d-04006895208c/2024_Stanovisko-CKA-a-MMR_opravneni-AA.pdf.aspx?lang=cs-CZ&ext=.pdf). To je relevantní například pro požárně bezpečnostní řešení.

### Inferences
- **Pravidla mají tři třídy podle automatizovatelnosti:**
  1. **Informační požadavky** (povinné vlastnosti, klasifikace, LOI podle DSS nebo smlouvy): plně automatizovatelné lokálně. DSS → IDS → `ifctester`, výstup v BCF.
  2. **Kvantitativní a geometrické požadavky** (plochy, světlé výšky a šířky, manipulační kruhy podle vyhl. 146/2024, počty bezbariérových zařízení, počty stání, vzdálenosti): automatizovatelné skripty nad geometrií IFC (IfcOpenShell). Zakódování pravidel je ale ruční práce a vyžaduje dobře strukturovaný model.
  3. **Interpretační požadavky** (charakter území, „vhodnost“, kvalitativní ustanovení územních a pražských předpisů, logika PBŘ podle ČSN 73 0802/0804 včetně požárních úseků a odstupových vzdáleností): LLM může pomáhat vyhledat ustanovení, sestavit checklist a navrhnout výklad, ale rozhoduje člověk. U PBŘ je to typicky specialista s příslušnou autorizací (viz stanovisko ČKA a MMR).
- **Agent pro kontroly by nikdy neměl hlásit jen „vyhovuje“.** Měl by vracet důkazy: GUID prvků, změřené hodnoty, citaci ustanovení a verzi předpisu, a nálezy jako BCF issues k lidské revizi. Výzkum (Madireddy; 2607.00015) i praxe (falešné hlášení úspěchu u Autodesk Assistantu) ukazují, že výstup LLM nelze brát jako potvrzení souladu.
- **Strojová čitelnost předpisů:** texty vyhlášek jsou volně v e-Sbírce. U ČSN je pravděpodobné omezení licencí a autorským právem (neověřeno). Rozumné je proto kódovat vlastní pravidla s odkazem na číslo článku a nevkládat plné texty norem do RAG bez licence.

### Gaps
- **Pražské stavební předpisy:** aktuální znění nařízení hl. m. Prahy, novely 2025/2026 a vztah k vyhl. 146/2024 nebyly zjištěny, protože došel vyhledávací limit.
- **ČSN 73 08xx** (ČSN 73 0802, 73 0804, 73 0810, 73 0833 a další): nebyla zjištěna existence českých nástrojů pro automatizovanou kontrolu PBŘ nad BIM ani licenční podmínky a dostupnost ČSN (zda jsou bezplatně přístupné).
- **Solibri 2026:** podpora IDS, API, AI funkce a české rulesety nebyly zkoumány.
- **Odstupy staveb, parkování, oslunění a denní osvětlení** ve vyhl. 146/2024: konkrétní ustanovení se nepodařilo dohledat.
- **Česká iniciativa pro automatickou kontrolu souladu dokumentace s předpisy** v rámci DSŘ nebo ČAS (mimo DSS/IDS) nebyla nalezena.
- **Provoz automatické kontroly DSS/IDS u úřadů:** žádný nalezený zdroj nepotvrdil, že by už plně fungovala.

## 4. Český BIM a digitální povolování (Koncepce BIM, ČAS, DSS, povinnost BIM, DSŘ, Portál stavebníka, EED, podání IFC)

### Takeaway
**Zákon č. 330/2025 Sb.** („zákon o BIM“) zavádí od **1. 1. 2027** povinnost BIM u nadlimitních veřejných zakázek na stavební práce u vybraných zadavatelů. Obec takovou povinnou osobou podle zdrojů automaticky není. Modely musí odpovídat **Datovému standardu stavby (DSS)**, který spravuje **ČAS**; v červenci 2026 byl rozšířen a umí exportovat IDS.

Digitální povolování jde přes Portál stavebníka a Evidenci elektronických dokumentací. Vyhláška 190/2024 předepisuje IFC 4+ a PDF/A-3. Systémy ale podle MMR poběží v **údržbovém režimu do konce roku 2030** a připravuje se jejich převod pod **Úřad rozvoje území (1. 1. 2028)**.

Malý soukromý ateliér zákon o BIM přímo nezavazuje. Veřejní investoři ale budou DSS/IFC vyžadovat.

### Cited Findings
- **Zákon o BIM:** zákon o správě informací o stavbě a vystavěném prostředí (tzv. zákon o BIM) prošel legislativním procesem a bude účinný od 1. 1. 2027 — [Portál o veřejných zakázkách (MMR)](https://portal-vz.cz/info-forum-vzdelavani/aktuality/zakon-o-sprave-informaci-o-stavbe-a-vystavenem-prostredi-a-o-zmene-nekterych-dalsich-zakonu-tzv-zakon-o-bim-prosel-legislativnim-procesem-a-bude-ucinny-od-1-1-2027/). Číslo zákona 330/2025 Sb. uvádějí [ADEON](https://www.adeon.cz/bim-zakon/) a [Accace](https://accace.cz/bim-povinne-pro-velke-verejne-stavby/).
- **Rozsah povinnosti** (sekundární zdroj):
  - Týká se veřejných zakázek na stavební práce v nadlimitním režimu.
  - Nevzniká automaticky každému veřejnému zadavateli ani u každé zakázky; obec není automaticky povinnou osobou. Povinnými jsou hlavně státní organizace, kraje a příspěvkové organizace.
  - U zakázek zadaných před účinností zákona nová povinnost nevzniká.
  - Prováděcí vyhláška podle zdroje nebyla v době psaní článku finálně zveřejněna.
  - Zdroj: [ADEON](https://www.adeon.cz/bim-zakon/).
- **Finanční limit:** zdroje se rozcházejí. Jeden uvádí 134 764 000 Kč bez DPH (2026–2027), jiný 135 348 000 Kč bez DPH (2024/25) — [ADEON](https://www.adeon.cz/bim-zakon/); [Accace](https://accace.cz/bim-povinne-pro-velke-verejne-stavby/). Je nutné ověřit aktuální nařízení vlády o limitech.
- **Historie:**
  - Koncepce z roku 2017 počítala s povinností BIM od roku 2022 — [Zprávy ČKAIT 2017](https://zpravy.ckait.cz/vydani/2017-05/bim-bude-povinny-u-nadlimitnich-zakazek/).
  - Existuje aktualizace Koncepce zavádění metody BIM z února 2024 — [ČKA – Aktualizace Koncepce BIM (PDF)](https://www.cka.cz/++api++/sluzby/legislativa/navrh-stavebni-zakon/koncepce-zavadeni-metody-bim-v-ceske-republice.pdf/@@download/file).
  - Diskuse o používání BIM od ledna 2027 — [Zeměměřič](https://www.zememeric.cz/pouzivani-metody-bim-od-ledna-2027-diskuze/).
- **Role ČAS:** Česká agentura pro standardizaci je hlavním technickým a metodickým garantem digitalizace a odpovídá za DSS a metodiky. Odbor Koncepce BIM realizuje opatření Koncepce schválené vládou v roce 2017 — [ČAS – About us BIM](https://agenturacas.gov.cz/en/bim-concept-department/about-us-bim/).
- **DSS v roce 2026:**
  - ČAS v červenci 2026 rozšířila DSS o minimální standard pro **provádění staveb** napříč profesemi (od zemních prací a konstrukcí po TZB a elektroinstalace). Rozšíření vyžaduje zákon o BIM.
  - DSS bude od počátku roku 2027 zákonem vyžadován pro digitální modely povinných osob ve vybraných veřejných zakázkách.
  - Zdroje: [ČAS](https://agenturacas.gov.cz/cas-rozsirila-datovy-standard-stavby-a-dokoncila-dalsi-milnik-zavadeni-bim-v-cesku/); [TZB-info](https://stavba.tzb-info.cz/30186-cas-rozsirila-datovy-standard-stavby-a-dokoncila-dalsi-milnik-zavadeni-bim-v-cesku); [Stavitel](https://stavitel.cz/ekonomika/cas-rozsirila-datovy-standard-stavby/); [Zeměměřič](https://www.zememeric.cz/minimalni-datovy-standard-pro-provadeni-staveb/).
- **Další části DSS:**
  - Minimální DSS **pro povolení a kolaudaci staveb** byl zveřejněn k praktickému ověření a zpětné vazbě — [Koncepce BIM](https://koncepcebim.gov.cz/zverejneni-minimalniho-datoveho-standardu-stavby-pro-povoleni-a-kolaudaci-staveb-pro-prakticke-overeni-a-zpetnou-vazbu/).
  - V polovině října 2026 ČAS zveřejnila podle souhrnu vyhledávače další část DSS pro dílčí model k předání, užívání a údržbě, opět ke sběru zpětné vazby — [Koncepce BIM](https://koncepcebim.gov.cz/cas-zverejnila-dalsi-cast-datoveho-standardu-stavby/). Datace a přiřazení jsou odhad ze souhrnu.
  - DSS je dostupný na dss.koncepcebim.gov.cz — [Koncepce BIM – DSS on-line](https://koncepcebim.gov.cz/dss-on-line-dalsi-krok-ke-spolecnemu-digitalnimu-jazyku/); [Koncepce BIM – kategorie DSS](https://koncepcebim.gov.cz/kategorie/datovy-standard-staveb/).
- **Verze IFC v DSS:**
  - Starší datový standard SFDI (2022) připouštěl IFC 2x3 a vyšší, konkrétní verzi měl určit BEP — [SFDI (PDF)](https://sfdi.gov.cz/wp-content/uploads/2024/05/2022-03-datovy-standard-1.pdf).
  - Prezentace z roku 2024 ukazuje aplikaci IFC 4.3.2 nad obsahem DSS — [Koncepce BIM – prezentace SFDI 2024 (PDF)](https://koncepcebim.gov.cz/wp-content/uploads/2024/11/sfdi_20241023_final.pdf).
  - Verzi IFC povinnou pro DSS 2026 se zjistit nepodařilo.
- **Vyhláška č. 190/2024 Sb.:**
  - Upravuje IS stavební správy, mezi které patří Portál stavebníka, evidence stavebních postupů a Evidence elektronických dokumentací (EED).
  - Nahrávat lze přes webové rozhraní nebo datové rozhraní. Formát informačního modelu stavby je IFC 4 a vyšší, dokumentů a výkresů PDF/A-3.
  - Zdroje: [Zákony pro lidi – 190/2024 Sb.](https://www.zakonyprolidi.cz/cs/2024-190); [Sagit](https://www.sagit.cz/info/sb24190).
- **Portál stavebníka:** běží na portal.stavebnisprava.gov.cz, uživatelská dokumentace je ve verzi 1.13 z 16. 12. 2025 — [Portál stavební správy – dokumentace (PDF)](https://portal.stavebnisprava.gov.cz/doc/uzivatelska_dokumentace_v1_13.pdf).
  - Spuštění v létě 2024 provázely výpadky (podle titulku zpočátku jen 11 odeslaných žádostí) — [Aktuálně.cz](https://zpravy.aktualne.cz/domaci/pres-portal-stavebnika-se-odeslalo-zatim-11-zadosti-system-j/r~eec856c4378711ef80bfac1f6b220ee8/).
- **Oficiální harmonogram MMR:**
  - Portál stavebníka a Informační systém stavebního řízení poběží **v údržbovém režimu do konce roku 2030**.
  - Integrace stávajícího softwaru, evidenčních služeb a archivů do struktury **Úřadu rozvoje území** se plánuje k **1. 1. 2028**.
  - MMR uvádí, že se chce vyhnout opakování nepřipravených digitálních spuštění.
  - Zdroj: [novystavebnizakon.gov.cz – Harmonogram a milníky](https://novystavebnizakon.gov.cz/sekce-nejen-pro-uredniky/implementace/aktualni-harmonogram/).
- **Přechodné období („bypass“, § 334b stavebního zákona):** během přechodu lze používat jiné informační systémy. Podle pozdějšího zdroje platí pro Národní geoportál územního plánování do 30. 6. 2026 a pro ostatní systémy stavební správy do 31. 12. 2027 — [TZB-info](https://stavba.tzb-info.cz/27924-prechodne-obdobi-pro-digitalizaci-stavebniho-rizeni); [Zprávy ČKAIT 2024](https://zpravy.ckait.cz/vydani/2024-05/jake-zmeny-prinasi-navrhovana-novela-stavebniho-zakona-tzv-castecny-bypass/).
  - SPČR uvádí, že povinnost nahrávat dokumentaci do EED v přechodném období trvá. Zdroj je asi 2 roky starý — [SPČR](https://www.spcr.cz/digitalizace-stavebniho-rizeni).
- **Novela stavebního zákona 2026:**
  - Komerční zdroje uvádějí účinnost změn od 1. 7. 2026 a organizační změny od 1. 1. 2027 — [ČESKÉSTAVBY.cz](https://www.ceskestavby.cz/clanky/velky-tresk-na-stavebnich-uradech-od-1-7-co-se-meni-pro-bezne-stavebniky-a-kde-jsou-skryte-hacky-36151.html); [Můj právník](https://muj-pravnik.cz/novela-stavebniho-zakona/).
  - Jiný zdroj tvrdí, že reálné legislativní změny přijdou nejdříve od 1. 1. 2027 a digitalizace se výrazně odkládá a reorganizuje.
  - Jeden zdroj uvádí, že od srpna 2025 lze žádosti podávat elektronicky přes Portál stavebníka a že experti nečekají plně stabilní systémy před rokem 2031 — [prostor-ad.cz](https://prostor-ad.cz/novy-stavebni-zakon-2026-co-se-zmeni-pro-stavebniky/); [AirHouse](https://airhouse.cz/novy-stavebni-zakon-a-jeho-zmeny-co-ceka-stavebniky-v-roce-2026/). Přiřazení ke konkrétnímu zdroji je nejisté a údaj o srpnu 2025 je v rozporu se spuštěním portálu v roce 2024.
  - Vše sekundární a neověřené proti Sbírce zákonů.

### Inferences
- **Pro malý ateliér:** zákon o BIM ho nezavazuje přímo. Jakmile ale pracuje pro kraj, státní organizaci nebo příspěvkovou organizaci na nadlimitní zakázce, musí dodat model podle DSS. Ten je možné ověřit lokálně: export IDS z comBIMe a kontrola `ifctester`.
- **„Agent pro podání“** může připravit balík PDF/A-3 a IFC 4 podle vyhl. 190/2024, zkontrolovat úplnost a pojmenování a validovat IFC proti IDS. **Podpis elektronickým autorizačním razítkem, kvalifikovaný podpis a samotné podání ale dělá člověk** (viz oddíl 6).
- **Integrace s datovým rozhraním Portálu se nevyplatí.** Systémy jsou do roku 2030 v údržbovém režimu a před převodem pod Úřad rozvoje území se nevyplatí stavět hluboké automatické napojení. Rozumnější je ruční upload podle checklistu.
- **Kontrola informačních požadavků (DSS → IDS) je nejbližší státem standardizovaná automatická kontrola v ČR.** Jde o validaci dat, ne o kontrolu souladu s hmotným právem (146/2024, územní plán).

### Gaps
- **Prováděcí vyhláška k zákonu č. 330/2025 Sb.:** text, stav a obsah požadavků (LOD/LOI, formáty, CDE) nejsou zjištěné.
- **Novela stavebního zákona 2026:** číslo zákona, účinnost a zřízení a působnost „Úřadu rozvoje území“ nebyly ověřeny v primárním zdroji.
- **Povinnost odevzdávat IFC v soukromých povolovacích řízeních:** nezjištěno, zda (a odkdy) je povinná. Vyhláška 190/2024 určuje formát, ne povinnost modelu.
- **Verze IFC vyžadovaná DSS 2026** a stav IDS exportu pro „DSS pro povolení a kolaudaci“ nejsou ověřené.
- **Rozpor ohledně dřívější povinnosti:** jeden výsledek zmiňoval usnesení vlády č. 298/2023. Není ověřeno a je v rozporu s ostatními zdroji.

## 5. Multi-agentní vzory (orchestrátor + specialisté, human-in-the-loop, verzování, evaluace) a návrh praktického „AI ateliéru“

### Takeaway
Výzkum ukazuje dvě architektury:
- **multi-agentní pipeline**, která generuje kód proti API BIM nástroje se smyčkou kontrolního checkeru (Text2BIM, Sketch2BIM);
- **jediný ReAct agent** nad modulárními, API-agnostickými MCP servery v sandboxu (Heimig-Elschner et al. 2026).

Průmysl konverguje ke vzoru **„agent navrhne → člověk schválí → nástroj provede s logem a undo“**: Autodesk Assistant s journalem a tlačítkem Stop, Graphisoft s dávkovými úpravami „that you approve“, SWAPP Frank se schválením, ArchiLabs s náhledem workflow. Evaluace je zatím na úrovni studií proveditelnosti; objevují se první benchmarky (IFCMemoryBench).

### Cited Findings
- **Text2BIM** (Du, Esser, Nousias, Borrmann; arXiv 2408.08054, verze v2 z 11. 7. 2025; *Journal of Computing in Civil Engineering* 40(2), 2026):
  - „orchestrates multiple LLM agents to collaborate and reason“ a převádí text na imperativní kód volající API BIM nástroje.
  - Generuje obálku, vnitřní dispozice a sémantické informace.
  - Pravidlový model checker s doménovými znalostmi vede agenty k opravám.
  - Prototyp běží ve Vectorworks — [arXiv 2408.08054](https://arxiv.org/abs/2408.08054).
  - Podle README byly původní experimenty na „gpt-4o-2024-05-13“, později přibyly Claude-4, o4-mini a Gemini-2.5-pro. Checker je Solibri Office, licence MIT (kromě `web_palette`) — [GitHub Text2BIM](https://github.com/dcy0577/Text2BIM).
- **BIMgent** (arXiv 2506.07217): multimodální LLM agenti, kteří simulací práce v GUI stavějí BIM modely — [arXiv 2506.07217](https://arxiv.org/pdf/2506.07217).
- **Sketch2BIM** (arXiv 2510.20838): „A Multi-Agent Human-AI Collaborative Pipeline to Convert Hand-Drawn Floor Plans to 3D BIM“ — [arXiv 2510.20838](https://arxiv.org/pdf/2510.20838).
- **Referenční architektura MCP pro BIM** (Heimig-Elschner, Du, Scheuvens, Borrmann, Beetz; arXiv 2601.00809, 12/2025, revize 3/2026):
  - Mikroservisní architektura s explicitním „adapter contract“, který odděluje MCP rozhraní od konkrétních BIM API, aby byla interakce API-agnostická, izolovaná a reprodukovatelná.
  - Prototyp nad IfcOpenShell. Zjednodušený Text2BIM reimplementuje jako single-agent ReAct.
  - Zdroje: [arXiv 2601.00809](https://arxiv.org/abs/2601.00809); [arXiv HTML v2](https://arxiv.org/html/2601.00809v2).
  - Nezávislé shrnutí: kód měnící model izoluje v „sandboxed, stateless execution service“. Evaluace měla 30 běhů v šesti generačních úlohách a jde o studii proveditelnosti, ne o důkaz širších tvrzení — [Pith](https://pith.science/paper/2601.00809).
  - Podle souhrnu vyhledávače tato práce uvádí MCP4IFC jako jediný framework svého druhu publikovaný ve vědecké literatuře (k datu článku) — [arXiv 2601.00809](https://arxiv.org/html/2601.00809v2).
- **Další práce 2026** (známe jen názvy, obsah neověřen):
  - „IFCMemoryBench: Evaluating Long-Term Memory of LLM-Based Agents in BIM Information Retrieval“ — [arXiv 2607.26072](https://arxiv.org/pdf/2607.26072).
  - „A Building as a Repository: KIR, a Typed Intermediate Representation for Agent-Authored Building Information Models“ — [arXiv 2609.14578](https://arxiv.org/pdf/2609.14578).
- **Průmysl, schvalování a audit:**
  - Autodesk Assistant zobrazuje každé volání nástroje. Od 2027.1 má podle jednoho zdroje log v journalu a tlačítko Stop — [goto.archi](https://goto.archi/blog/post/whats-new-in-revit-2027).
  - Graphisoft AI Assistant provádí „batch edits that you approve“ — [Graphisoft – AI Solutions](https://www.graphisoft.com/en-us/plans-and-products/ai-solutions/).
  - SWAPP Frank provádí změny až po schválení — [SWAPP](https://swapp.ai/).
  - ArchiLabs nabízí „previewable, runnable workflow“ — [ArchiLabs](https://archilabs.ai/posts/ai-revit-automation-for-residential-architecture-archilabs).
- **Další firmy (sekundární přehledy):**
  - AI funkce Snaptrude byly podle přehledů spuštěny v říjnu 2025 jako „modular agents rather than end-to-end automation“ — [Techvernia – Snaptrude review](https://techvernia.com/pages/reviews/architecture/snaptrude.html). Přiřazení zdroje je nejisté.
  - Hypar je generativní výpočetní platforma, kde se logika budovy (konstrukce, jádra, fasády, dispozice) píše jako znovupoužitelné funkce, s vazbou na Revit a podporou IFC — [Gitnux](https://gitnux.org/best/architecture-ai-software/); [Studiomatrx](https://www.studiomatrx.org/guides/ai-architecture-software). Jde o listicle s nízkou důvěryhodností.
- **Prvky HITL a bezpečnosti v nástrojích:**
  - Revit Model MCP: potvrzovací tokeny pro nevratné kroky, `dry_run`, každá změna jako pojmenovaná položka undo, read-only režim — [GitHub](https://github.com/sharafutdinovdi/revit-model-mcp).
  - AEC Model Bridge: zápis až po schválení plánu — [GitHub](https://github.com/Sam-AEC/Autodesk-Revit-MCP-Server).
  - ollmcp: schvalování nástrojů je ve výchozím stavu zapnuté — [GitHub](https://github.com/jonigl/mcp-client-for-ollama).
  - Tapir MCP: retry může duplikovat změny, operace tedy nejsou idempotentní — [GitHub](https://github.com/SzamosiMate/tapir-archicad-MCP).
- **Verzování a issue management:**
  - `ifcdiff` porovnává změny mezi IFC modely, `bcf` čte a zapisuje BCF a OpenCDE BCF-API — [IfcOpenShell](https://github.com/IfcOpenShell/IfcOpenShell).
  - Speckle MCP pracuje s „model versions“ — [LobeHub – speckle-mcp](https://lobehub.com/mcp/bimgeek-speckle-mcp).
  - Tapir MCP umí Teamwork send/receive v Archicadu — [GitHub](https://github.com/SzamosiMate/tapir-archicad-MCP).

### Inferences: návrh praktického „AI ateliéru“ (syntéza; architekt rozhoduje)

**Principy**
1. Orchestrátor plus specialisté s úzkými sadami nástrojů. Specialisté nemají přímý zápis do modelu bez schválení.
2. Každá změna modelu probíhá jako „návrh → dry-run nebo náhled → schválení → zápis → diff a log“.
3. Výstupy, které nesou odpovědnost (výkresy a zprávy k podpisu), vždy prochází lidskou revizí.
4. Local-first: citlivá data klienta zpracovává lokální LLM, cloud jen s anonymizovanými daty a se smlouvou o zpracování.
5. Vlastní adaptérová vrstva mezi agenty a BIM nástroji podle referenční architektury arXiv 2601.00809, aby šlo vyměnit Revit, Archicad nebo IFC bez přepisování agentů.

**Role agentů**

| Agent | Úloha | Nástroje (příklady z rešerše) | Výstup / předávka |
|---|---|---|---|
| Orchestrátor („vedoucí zakázky“) | Rozpad zadání na úlohy podle fáze projektu, řízení stavu, volání specialistů; sám do modelu nezapisuje | MCP host (lokálně ollmcp nebo jiný), stavový log projektu | Plán úloh ke schválení architektem |
| Rešeršní agent (pozemek) | Sběr dat o pozemku a limitech (pokrývají jiné části rešerše) | Veřejné datové zdroje, RAG | „Site brief“ (JSON + PDF) s citacemi zdrojů |
| Regulační agent | Převod ÚP, vyhl. 146/2024, PSP a smluvních standardů na strojová pravidla a checklist | RAG nad e-Sbírkou, DSS → IDS (comBIMe), vlastní pravidla v Pythonu | Sada pravidel (IDS + skripty) s odkazy na ustanovení, ke schválení výkladu architektem |
| Modelovací agent (BIM) | Tvorba a úpravy modelu podle schválené varianty | Tapir MCP / Archicad MCP, Revit MCP, `ifcmcp` / Bonsai | Návrh změn (dry-run), po schválení zápis a `ifcdiff` / verze |
| Kontrolní agent (QA a soulad) | Validace IDS, geometrické kontroly, kolize; neopravuje sám | `ifctester`, IfcOpenShell skripty, `ifcclash`, případně Solibri | BCF issues s GUID prvků a naměřenými hodnotami |
| Dokumentační agent | Pohledy, listy, výkazy; technické zprávy podle příloh vyhl. 131/2024 z dat modelu | Autodesk Assistant / pyRevit, Tapir, `ifccsv`, Bonsai výkresy, šablony zpráv | Návrh výkresové sady a zpráv, každé číslo s odkazem na zdroj |
| Agent pro podání a archiv | Balík PDF/A-3 + IFC 4, kontrola úplnosti, IDS validace | Validátory PDF/A a IFC, `ifctester` | Balík připravený k podpisu a podání (podepisuje a podává člověk) |
| Provenance a záznam (deterministická služba, ne LLM) | Logování promptů, verzí modelů LLM, volání nástrojů, diffů a schválení | Git pro texty a IFC + `ifcdiff`, Speckle verze, Revit journal | Auditní stopa pro odpovědnost projektanta, autorská práva a AI Act |

**Schvalovací body architekta (HITL)**
- **H1 – zadání a plán.** Architekt potvrdí program, rozsah a postup.
- **H2 – výklad regulativů.** Potvrdí, jak se ustanovení převádějí na pravidla.
- **H3 – koncept a volba variant.** Tvůrčí rozhodnutí patří člověku; kromě odpovědnosti je to klíčové i pro autorskoprávní ochranu (oddíl 6).
- **H4 – zápisy do modelu.** Schvaluje každý zápis nad dohodnutou mez (dávkové změny, mazání, uložení, synchronizace), podle vzoru tokenů a dry-run.
- **H5 – vydání dokumentace.** Revize výkresů a zpráv, autorizace razítkem a kvalifikovaným podpisem.
- **H6 – komunikace navenek.** Klient, úřady a dotčené orgány.

**Provenance**
- Ke každému artefaktu ukládat: kdo nebo co ho vytvořilo (agent, model, verze), z jakých vstupů (hash IFC, citace zdrojů), kdo a kdy schválil, a diff proti předchozí verzi.
- Vizualizace a texty vytvořené AI a určené veřejnosti označovat (Art. 50 AI Act, viz oddíl 6).
- Auditní stopa zároveň dokládá lidský tvůrčí vklad a lidskou kontrolu.

**Evaluace**
- Sada referenčních mini-projektů (např. rodinný dům, malý bytový dům) se „zlatými“ IFC.
- Metriky: podíl úspěšných úloh, podíl IDS kontrol, které projdou, shoda `ifcdiff` s očekávanou změnou, počet falešných hlášení úspěchu (problém známý z Autodesk Assistantu) a čas architekta na revizi.
- Opakovat při každé změně modelu LLM nebo MCP serveru. Výzkum zatím ukazuje jen studie proveditelnosti (např. 30 běhů v šesti úlohách).

**Nasazení**
- Zápisové nástroje spouštět jen na kopii nebo pracovní větvi modelu, ne na „master“ souboru.
- Kvůli neidempotentním operacím (Tapir MCP) mít před dávkami zálohu nebo snapshot.

### Gaps
- **Motif** (nový BIM nástroj): ve výsledcích nebyly žádné informace.
- **Další produkty Autodesku a Graphisoftu** (Forma, „Project Bernini“ / neural CAD, AI Visualizer, Nemetschek AI layer) nebyly zkoumány.
- **Frameworky pro orchestraci** (LangGraph, CrewAI, Claude Agent SDK) a jejich HITL mechanismy nebyly v této rešerši ověřené.
- **Obsah IFCMemoryBench a KIR** (výsledky, metriky) neznáme, jen názvy.
- **Praktické zkušenosti malých kanceláří** s multi-agentními systémy (případové studie z ČR/EU) se nenašly.

## 6. Právní a profesní mantinely (autorizovaná osoba, stavební zákon, ČKA, AI Act, autorské právo, TDM, GDPR, pojištění)

### Takeaway
Odpovědnost zůstává plně na autorizované osobě a projektantovi:
- osobní výkon činnosti;
- odpovědnost za odbornou úroveň, správnost, úplnost a bezpečnost;
- výpočty musí být kontrolovatelné;
- podpis a autorizační razítko, i elektronické s kvalifikovaným podpisem;
- povinné pojištění odpovědnosti.

AI na tom nic nemění. ČKA nemá formální stanovisko k AI; nalezeno bylo jen vzdělávací heslo „Jak mít AI jako pomocníka, ne rozhodovací autoritu“.

Podle AI Actu je ateliér **zavádějícím subjektem (deployer)** systémů, které nejsou vysoce rizikové. Týká se ho:
- **čl. 4 (AI gramotnost)**, který nařízení (EU) 2026/1744 zmírnilo na povinnost „přijmout opatření na podporu“;
- **čl. 50 (transparentnost)**, platný od 2. 8. 2026.

Čistě AI výstup není autorským dílem (Městský soud v Praze, 10 C 13/2023). Licence pro vytěžování textů a dat (§ 39c) dovoluje i komerční vytěžování, pokud nositel práv nevyslovil výhradu; OSA ji vyslovila. GDPR a pojištění nebylo možné ověřit.

### Cited Findings

#### Autorizovaná osoba a projektant
- **Projektant** podle § 159 stavebního zákona odpovídá za „správnost, celistvost, úplnost a bezpečnost“ stavby provedené podle jeho dokumentace, za její proveditelnost a za technickou a ekonomickou úroveň technologických projektů včetně vlivů na životní prostředí.
  - Pokud část dokumentace nemůže zpracovat sám, musí přizvat osobu s příslušnou autorizací; jeho odpovědnost za celek tím není dotčena.
  - Statické a jiné výpočty musí být zpracovány tak, aby byly kontrolovatelné.
  - Zdroje: [Práce pro právníky – § 159](https://www.pracepropravniky.cz/zakony/stavebni-zakon-uplne-zneni/paragraf-159/); [ČKA – Odpovědnost projektanta (FAQ)](https://www.cka.cz/sluzby/legislativa/caste-dotazy-faq/odpovednost-projektanta); [PROFESIS ČKAIT – MP 1](https://profesis.ckait.cz/dokumenty-ckait/mp-1/); [sbirkazakonu.info](http://sbirkazakonu.info/stavebni-zakon/projektova-cinnost-ve-vystavbe.html).
  - **Pozor:** zdroje se rozcházejí v číslování odstavců a část z nich může citovat starý zákon č. 183/2006 Sb. Pro zákon č. 283/2021 Sb. ověřit v e-Sbírce.
- **Zákon č. 360/1992 Sb.:**
  - Autorizovaná osoba vykonává činnost osobně, případně ve spolupráci s jinými autorizovanými osobami nebo s fyzickými osobami pod svým vedením — [e-Sbírka (historické znění)](https://e-sbirka.gov.cz/sb/1992/360/1992-07-07).
  - Odpovídá za odbornou úroveň činností, k nimž má autorizaci, „odpovědnost podle obecných předpisů“ zůstává nedotčena — [Sagit – úplné znění](https://www.sagit.cz/info/sb04150); [ČKAIT – Odpovědnost autorizovaných osob](https://www.ckait.cz/odpovednost-autorizovanych-osob).
  - Musí mít po celou dobu výkonu pojištění odpovědnosti za škodu a předložit o něm doklad objednateli — [Česká asociace pojišťoven](https://www.cap.cz/slovnikenc/15641-item-421); [Salvia Krajta](https://krajta.slv.cz/1992/360/par_20-odst_1). ČAP uvádí § 16, SLV § 20; ověřit aktuální číslování.
  - Dokumenty opatřuje podpisem a autorizačním razítkem, podle novější úpravy i **elektronickým autorizačním razítkem s kvalifikovaným elektronickým podpisem**. Razítka vydávají komory — [TZB-info – zákon 360/1992](https://www.tzb-info.cz/pravni-predpisy/zakon-c-360-1992-sb-o-vykonu-povolani-autorizovanych-architektu-a-o-vykonu-povolani-autorizovanych-inzenyru-a-techniku-cinnych-ve-vystavbe).
- **Rozsah oprávnění:** společné stanovisko ČKA a MMR (listopad 2024) k rozsahu oprávnění autorizovaného architekta po novele účinné od 1. 1. 2024 a k povinnosti přizvat specialistu na složitější části — [MMR (PDF)](https://mmr.gov.cz/getattachment/6ec3d6f0-8182-4f06-a30d-04006895208c/2024_Stanovisko-CKA-a-MMR_opravneni-AA.pdf.aspx?lang=cs-CZ&ext=.pdf).
  - ČKAIT (2017) zastává názor, že architekt neprovádí statické a dynamické výpočty — [Zprávy ČKAIT](https://zpravy.ckait.cz/vydani/2017-03/smi-architekti-provadet-staticke-a-dynamicke-vypocty-staveb/). Starší stanovisko, ověřit platnost.

#### ČKA a umělá inteligence
- **Formální stanovisko ČKA k AI vyhledávání nenašlo.**
- Článek ČKA „Digitální transformace architektury“: „Umělá inteligence rozšiřuje možnosti návrhu i analýzy, ale zároveň mění samotnou podstatu profese. O to důležitější je hájit lidský rozměr disciplíny a reflektovat odpovědnost, etiku a transparentnost výstupů digitální tvorby.“ — [ČKA](https://www.cka.cz/svet-architektury/aktualne/novinky/digitalni-transformace-architektury).
- Workshop ČKA v rámci celoživotního vzdělávání 2025 „AI pro projektanty a architekty“ (etika práce s daty, profesní odpovědnost) s heslem „Jak mít AI jako pomocníka, ne rozhodovací autoritu.“ — [ČKA](https://www.cka.cz/sluzby/clenum/celozivotni-vzdelavani/vzdelavaci-akce-czv-v-roce-2025/ai-pro-projektanty-a-architekty-on-line-workshop).
- Webinářová série 2026 „AI pro stavební inženýry a techniky“: asistenti nad firemními archivy, bezpečnost a licence — [ČKA](https://www.cka.cz/sluzby/clenum/celozivotni-vzdelavani/vzdelavaci-akce-czv-v-roce-2026/ai-pro-stavebni-inzenyry-a-techniky-blok-1-3-webinar).
- Evropská rada architektů (ACE) v roce 2023 vypsala výzvu k výzkumu AI jako podklad pro svou politiku a komunikaci se zákonodárci — [ČKA](https://www.cka.cz/svet-architektury/aktualne/novinky/a-i-call-for-research-experts-and-young-talents).
- Pro srovnání: Česká advokátní komora vydala stanovisko k AI ve 2023 a nové 20. 10. 2026, pro advokáty, ne pro architekty — [ČAK 2026 (PDF)](https://www.cak.cz/storage/files/stanovisko-cak-umela-inteligence-ai-20-10-2026.pdf); [ČAK 2023 (PDF)](https://www.cak.cz/cs/download/priloha_4_2023_09_-ai_stanovisko.pdf).

#### EU AI Act (nařízení 2024/1689) po „Digital Omnibus“ (nařízení 2026/1744)
- **Omnibus:** nařízení (EU) 2026/1744 vyšlo v Úředním věstníku 24. 7. 2026 a nabylo účinnosti 27. 7. 2026 — [EUR-Lex – Regulation (EU) 2026/1744](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ%3AL_202601744); [Cooley](https://cdp.cooley.com/digital-ai-omnibus-delays-key-deadlines-introduces-new-rules/); [NicFab](https://www.nicfab.eu/en/posts/digital-omnibus-ai-official-journal/).
  - Zdroje se rozcházejí v datech procedurálních kroků (hlasování EP 16. 6. 2026, datum nařízení 8. 7. 2026) — [Orrick](https://www.orrick.com/en/Insights/2026/07/EU-AI-Act-Update-Digital-Omnibus-Finalizes-8-Compliance-Changes); [aiacto](https://www.aiacto.eu/en/blog/digital-omnibus-ai-act-report-2027).
- **Posunuté termíny:**
  - Vysoce rizikové systémy podle **přílohy III** z 2. 8. 2026 na **2. 12. 2027** (příklady oblastí: zaměstnání, vzdělávání, vymáhání práva, úvěry, biometrie).
  - Podle **přílohy I** (AI v regulovaných výrobcích, např. zdravotnické prostředky, strojní zařízení) z 2. 8. 2027 na **2. 8. 2028**.
  - Zdroj: [Cooley](https://cdp.cooley.com/digital-ai-omnibus-delays-key-deadlines-introduces-new-rules/).
- **Čl. 50 (transparentnost)** se neposunul a platí od 2. 8. 2026. Výjimkou je přechodné období pro označování (čl. 50 odst. 2) do 2. 12. 2026, jen pro generativní systémy uvedené na trh před 2. 8. 2026 — [aiacto](https://www.aiacto.eu/en/blog/digital-omnibus-ai-act-report-2027); [Gibson Dunn](https://www.gibsondunn.com/eu-ai-act-omnibus-agreement-postponed-high-risk-deadlines-and-other-key-changes/).
- **Čl. 4 (AI gramotnost)** po Omnibusu:
  - Povinnost „zajistit dostatečnou úroveň“ AI gramotnosti se změnila na povinnost přijmout opatření, která její rozvoj podporují; komentátoři to popisují jako posun od povinnosti výsledku k povinnosti úsilí.
  - Nevyžaduje se zaručit konkrétní úroveň u jednotlivců.
  - Stále se vztahuje na všechny deployery bez ohledu na velikost a riziko, a to na personál i na osoby jednající jejich jménem (např. externisty).
  - Nový odstavec ukládá Komisi a členským státům podporu, zejména pro MSP.
  - Dozor národních orgánů podle zdrojů začal v srpnu 2026.
  - Zdroje: [Law & Technology](https://lawandtechnology.eu/en/ai-literacy-digital-omnibus-article-4-ai-act/); [Trainyng](https://www.trainyng.be/en/blog/ai-act-article-4-digital-omnibus-2026); [WeCallShotgun](https://wecallshotgun.com/blog/digital-omnibus-ai-act-2026-what-changed); [EUR-Lex 2026/1744](https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ%3AL_202601744). Převážně komentáře; přesné znění ověřit v EUR-Lex.
  - Čl. 4 platí od 2. 2. 2025 (kapitoly I a II podle čl. 113) — [EUR-Lex – nařízení 2024/1689](https://eur-lex.europa.eu/eli/reg/2024/1689/oj). V této relaci nestaženo.
- **Nový zákaz:** Omnibus přidává zákaz AI systémů generujících nekonsensuální intimní snímky nebo CSAM s účinností od 2. 12. 2026 — [Cooley](https://cdp.cooley.com/digital-ai-omnibus-delays-key-deadlines-introduces-new-rules/). Pro ateliér irelevantní, uvedeno pro úplnost.

#### Autorské právo (zákon č. 121/2000 Sb.)
- **Městský soud v Praze, 10 C 13/2023 (rozsudek z 11. 10. 2023):**
  - Žalobu na určení autorství obrázku vygenerovaného AI podle promptu žalobce soud zamítl.
  - AI nemůže být autorem, autorem může být jen fyzická osoba. Obrázek není dílem podle § 2, protože není „jedinečným výsledkem tvůrčí činnosti“ fyzické osoby.
  - Prompt soud posoudil jako pouhý námět či myšlenku.
  - Rozsudek je pravomocný.
  - Zdroje: [msp.gov.cz – text rozsudku](https://msp.gov.cz/documents/14569/1865919/10C_13_2023_10/108cad3e-d9e8-454f-bfac-d58e1253c83a); [Peterka & Partners](https://blog.peterkapartners.com/grafika-vytvorena-prostrednictvim-umele-inteligence-jako-autorske-dilo/); [Lupa.cz](https://www.lupa.cz/aktuality/umela-inteligence-nemuze-vytvorit-autorske-dilo-konstatoval-soud/); [EY](https://www.ey.com/cs_cz/technical/tax/tax-alerts/2024/04/zacatek-soudniho-rozhodovani-o-umele-inteligenci).
  - Část komentátorů považuje úvahu o autorství za obiter dictum — [Právní prostor](https://www.pravniprostor.cz/clanky/pravo-it/otazka-autorstvi-ke-grafice-vytvorene-umelou-inteligenci-prvni-judikatura).
- **§ 39c (vytěžování textů a dat):**
  - Zákonná licence k rozmnožování děl pro automatizovanou analýzu textů a dat k jakémukoli účelu, včetně komerčního. Rozmnoženiny lze uchovat jen po dobu nezbytnou. Podmínkou je i tříkrokový test (§ 29).
  - Nositel práv může užití výslovně vyhradit (§ 39c odst. 2); podle komentářů u online obsahu strojově čitelným způsobem, např. metadaty.
  - Pro výzkumné organizace a instituce kulturního dědictví platí § 39d bez možnosti výhrady.
  - Zdroje: [Zákony pro lidi – blog TDM](https://www.zakonyprolidi.cz/blog/text-data-mining-autorsky-zakon-opt-out-ai.htm); [Advokátní deník](https://advokatnidenik.cz/2024/11/21/komparativni-hlediska-vytezovani-dat-podle-tdm-vyjimek/); [Salvia Krajta – § 39c](https://krajta.slv.cz/2000/121/par_39c-odst_1); [epravo.cz](https://www.epravo.cz/top/aktualne/vytezovani-verejne-dostupnych-autorskych-del-pro-ucely-trenovani-umele-inteligence-118625.html).
- **OSA** veřejně vyhradila užití děl jí zastupovaných nositelů práv pro komerční vytěžování textů a dat a vyzvala poskytovatele AI k jednání o licencích — [OSA](https://www.osa.cz/aktuality/vyhrada-prav-z-vyjimky-pro-vytezovani-textu-a-dat-pro-komercni-ucely/).

#### Data a důvěrnost (nepřímé signály)
- **Graphisoft AI Assistant** vyžaduje připojení k internetu — [Graphisoft](https://www.graphisoft.com/en-us/plans-and-products/ai-solutions/).
- **BlenderMCP** sbírá ve výchozím stavu anonymní telemetrii, kterou lze použít mimo jiné „to train AI models“ (vypíná se `DISABLE_TELEMETRY=true`) — [GitHub BlenderMCP](https://github.com/ahujasid/blender-mcp).
- **SWAPP** deklaruje ISO 27001 — [SWAPP](https://swapp.ai/).

### Inferences
- **Odpovědnost:** AI je z pohledu práva nástroj, ne účastník. Každý výstup, který autorizovaná osoba podepíše, musí projít její odbornou kontrolou („osobní výkon“, odpovědnost za správnost a úplnost). Požadavek kontrolovatelnosti výpočtů se přirozeně promítá do požadavku na provenance: kdo nebo co spočítalo, z jakých vstupů a kdo ověřil.
  - Nekontrolovaný AI výstup (falešné „hotovo“ u Assistantu, halucinace v kontrolách souladu) je typický zdroj profesní vady.
  - Kde AI připravuje části mimo oprávnění architekta (statika, PBŘ, TZB), musí je dál zpracovat a autorizovat příslušný specialista.
- **AI Act, kvalifikace použití:** ateliér je deployer obecných nástrojů (LLM, generátory obrázků, asistenti v CAD).
  - Návrh budov nespadá do vyjmenovaných oblastí přílohy III (podle zdrojů zaměstnání, vzdělávání, vymáhání práva, úvěry, biometrie a další) a návrhové nástroje nejsou bezpečnostní komponentou výrobků podle přílohy I. Použití tedy pravděpodobně **není vysoce rizikové** a povinnosti deployerů vysoce rizikových systémů (čl. 26) se neuplatní. Doporučeno ověřit úplný výčet přílohy III, např. bod o kritické infrastruktuře, pokud by AI řídila provoz staveb.
  - Zbývá **čl. 4**: vést záznam o školení a pravidlech používání AI v kanceláři, včetně externistů. Po Omnibusu jde o povinnost úsilí.
  - Zbývá **čl. 50**: zveřejňuje-li ateliér fotorealistické AI vizualizace reálných míst, které by mohly působit jako autentické („deep fake“ ve smyslu čl. 3), nebo AI texty pro informování veřejnosti, je vhodné je označovat. Výklad, zda architektonická vizualizace je „deep fake“, je nejistý.
  - Označování výstupů (čl. 50 odst. 2) je primárně povinnost poskytovatelů nástrojů.
- **Autorské právo:**
  - Aby návrh požíval ochrany jako architektonické dílo, musí obsahovat tvůrčí vklad fyzické osoby. Prompt sám nestačí (10 C 13/2023).
  - Dokumentované lidské rozhodování (výběr, úpravy, kompozice; schvalovací bod H3 v oddílu 5) je tedy i autorskoprávní nutnost.
  - Je třeba kontrolovat licenční podmínky AI nástrojů: vlastnictví výstupů a použití dat ateliéru k tréninku.
- **Trénink a ladění na datech:**
  - Vlastní archiv kanceláře (díla zaměstnanců a společníků) lze typicky využít.
  - U cizích dat (podklady klientů, katalogy výrobců, publikované projekty) je nutné respektovat výhrady podle § 39c, smluvní mlčenlivost a licence.
  - Výzkumná výjimka § 39d se na komerční ateliér nevztahuje.
  - Zda by doladění modelu udělalo z ateliéru „poskytovatele“ podle AI Actu (pravidla pro GPAI), je třeba ověřit v pokynech Komise; u malého LoRA ladění je to nepravděpodobné, ale neověřeno.
- **GDPR** (obecná znalost, v této rešerši neověřeno):
  - Dokumentace a rešerše obsahují osobní údaje (vlastníci podle katastru, sousedé, kontakty klientů).
  - Při použití cloudových LLM je potřeba smlouva o zpracování (čl. 28 GDPR), posouzení předávání mimo EU a minimalizace dat.
  - Lokální modely riziko podstatně snižují; telemetrie nástrojů (např. BlenderMCP) se má vypnout.
- **Pojištění:** povinné pojištění odpovědnosti trvá. Doporučeno informovat pojistitele o používání AI, ověřit případné výluky a doložit proces lidské kontroly (auditní stopa). Konkrétní postoj českých pojistitelů je neznámý (viz Gaps).

### Gaps
- **ČKA:** formální stanovisko ani doporučení k AI nebylo nalezeno. Neověřeny byly i Profesní a etický řád ČKA (ustanovení relevantní pro AI) a postoj ACE (pozice z let 2024–2026).
- **Pojištění profesní odpovědnosti:** podmínky skupinového pojištění členů ČKA a ČKAIT, výluky pro AI a doporučení pojistitelů nebylo možné vyhledat (vyčerpaný limit).
- **GDPR a ÚOOÚ:** metodiky Úřadu pro ochranu osobních údajů k AI ani stanoviska EDPB nebyly v této rešerši ověřeny.
- **Český dozorový orgán podle AI Actu** (adaptační zákon, určení orgánu dozoru nad trhem) nebyl zjištěn.
- **Přesné znění** čl. 4 a čl. 50 po Omnibusu: primární text EUR-Lex nešel stáhnout, údaje vycházejí z komentářů.
- **Číslování paragrafů:** aktuální číslování § 159 zákona č. 283/2021 Sb. po novelách 2024–2026 a aktuální číslování zákona 360/1992 Sb. (pojištění § 16 vs. § 20) ověřit v e-Sbírce.
- **Autorství u architektonických návrhů s podílem AI:** žádná česká judikatura specificky k architektuře se nenašla; jediným precedentem je obrázek ve věci 10 C 13/2023.
