# Automatically generating a basic BIM model (plot + family house) from pre-design data with AI agents: Revit and alternatives, status October 2026

*Method note: every finding below comes from web-search result summaries of the cited pages. WebFetch was blocked in this session for aps.autodesk.com, arxiv.org, architosh.com, goto.archi and 3darchitettura.com, so I could not read those pages in full. Figures from those domains (APS pricing, arXiv numbers, Architosh) should be spot-checked against the primary page before they are published. "[older: YYYY]" marks information that predates 2026.*

---

## 1. Revit automation routes in 2026: how an AI agent can create and modify Revit models, and what it can reliably do

### Takeaway
As of October 2026 there are four workable Revit routes:
1. **A classic C# add-in on the Revit API.** This is the most deterministic route. Revit 2027 runs on .NET 10.
2. **MCP bridges.** Many open-source servers exist. Autodesk's own Revit MCP servers are a Technical Preview on Revit 2027.2, with Read, Write and Experimental tiers.
3. **Autodesk Assistant inside Revit.** It is a Tech Preview. Revit 2027.3 adds DynamoMCP, so the Assistant can build and run Dynamo graphs.
4. **APS Design Automation for Revit.** This is the only sanctioned headless cloud route. It is a rated API: a free monthly allowance, then 2 Flex tokens per processing hour.

LLM agents are good at reading and querying models and at placing simple repetitive elements. Free-form code generation and end-to-end modelling remain unreliable. Research success rates range from about 30% to 80%, and the dominant failure mode is misuse of the API.

### Cited Findings

**Revit platform and API (2026–2027)**
- Revit 2027 runs on .NET 10, and the help documentation says it uses the final .NET 10 runtime for running Revit and building add-ins — [Autodesk Developer Blog: Revit 2027 SDK](https://blog.autodesk.io/revit-2027-sdk-net-10-api-changes-and-additions/); [Revit 2027 help: Migrating to .NET 10](https://help.autodesk.com/cloudhelp/2027/ENU/Revit-WhatsNew/files/GUID-8D7A4715-EAF8-4BD1-BE78-061F900D0BCE.htm)
- Microsoft ends support for .NET 8 on 10 November 2026, so Autodesk is moving Revit 2025 and 2026 to .NET 10 as well. A runtime change is "not just a transparent same-binary update", and most third-party plugins need recompiling — [Revit API forum thread on .NET 10 migration](https://forums.autodesk.com/t5/revit-api-forum/revit-2025-2026-migration-to-net-10-compatibility-and-deployment/m-p/14117812); [Autodesk blog: call for preview testing](https://blog.autodesk.io/call-for-preview-testing-revit-2026-2025-migration-to-net-10/)
- **Floors:** the old `Document.NewFloor` was deprecated in the 2022 API. The current call is `Floor.Create(Document, IList<CurveLoop>, floorTypeId, levelId)`, with an overload for structural and slope parameters, and Autodesk advises validating profiles with BoundaryValidation — [Revit API 2026: Floor.Create](https://help.autodesk.com/cloudhelp/2026/ENU/Revit-API-MainReference/files/html/a9c74a9f-46eb-a1b7-608e-2039f06be579.htm); [forum: Create Floor from Wall](https://forums.autodesk.com/t5/revit-api-forum/create-floor-from-wall/m-p/10383586)
- **Roofs:** `Document.NewFootPrintRoof` takes a footprint, a level, a roof type and an output mapping of footprint curves to model curves — [Revit API 2026: NewFootPrintRoof](https://help.autodesk.com/cloudhelp/2026/ENU/Revit-API-MainReference/files/html/110741bf-b041-9f78-0832-ec9f5892cebc.htm). One developer thread reports a roof that was silently not created even though no error was raised — [Revit API forum: Creating a roof](https://forums.autodesk.com/t5/revit-api-forum/creating-a-roof-using-revit-apis/m-p/12846420)
- **Terrain:**
  - `Toposolid.Create(Document, IList<XYZ>, typeId, levelId)` builds a toposolid from points. A second overload takes planar CurveLoops for the boundary plus points for the top face — [Revit API 2026: Toposolid.Create (points)](https://help.autodesk.com/cloudhelp/2026/ENU/Revit-API-MainReference/files/html/fb528545-b035-bfe2-71da-88baa9a979ff.htm); [Toposolid.Create (curve loops + points)](https://help.autodesk.com/cloudhelp/2026/ENU/Revit-API-MainReference/files/html/0d4cd6ef-eadd-ace6-2999-2270c1317fb1.htm). Both remain in the 2027 API — [rvtdocs 2027](https://rvtdocs.com/2027/Autodesk.Revit.DB.Toposolid.Create(Document,IList[XYZ],ElementId,ElementId))
  - The points-only overload returns the **convex hull** of the points, unlike the boundary the UI produces — [Revit API forum: TopoSolid concave hull](https://forums.autodesk.com/t5/revit-api-forum/create-toposolid-from-a-list-of-point-with-concave-hull/m-p/12576623)
  - The UI "Create from Import" accepts CSV points, and files over 10,000 points are downsampled to 10,000 — [Revit 2026 help: toposolid from import](https://help.autodesk.com/cloudhelp/2026/ENU/Revit-Model/files/GUID-A1E1DE84-29AE-4B99-B377-091C0AC45249.htm)
- **Rhino.Inside.Revit:** McNeel forum replies say Revit 2027 needs Rhino 8.32 or later. Users report that the add-in loads but the ribbon tab sometimes does not appear, and that the 2027 build crashes occasionally — [McNeel forum: RiR v1.36 for Revit 2027](https://discourse.mcneel.com/t/looking-for-rhino-inside-revit-v1-36-rc4-revit-2027-support/218609); [McNeel forum: RiR for Revit 2027 not working](https://discourse.mcneel.com/t/rhino-inside-for-revit-2027-not-working/220627)

**Autodesk's own AI layer: Autodesk Assistant and the official MCP servers**
- **Autodesk Assistant:**
  - It is the first AI feature in Revit 2027, released in April 2026 as a Tech Preview covering "a focused set of workflows", with no commitments or warranties — [Autodesk AEC blog: Assistant in Revit Tech Preview (22 Apr 2026)](https://www.autodesk.com/blogs/aec/2026/04/22/autodesk-assistant-in-revit-tech-preview/); [What's New in Revit 2027 (7 Apr 2026)](https://www.autodesk.com/blogs/aec/2026/04/07/whats-new-in-revit-2027/)
  - Architosh reports that the Assistant is built on MCP and that Revit 2027 is the first version with a built-in MCP server. Its tasks include finding and tagging elements, generating views and organising schedules — [Architosh, Apr 2026](https://architosh.com/2026/04/autodesk-revit-2027-big-new-ai-and-graphics-changes/)
- **Revit 2027.3:** it ships Dynamo 4.2.1 with DynamoMCP, and the Assistant "can now build, run, explain, and tidy up Dynamo graphs for you without leaving Revit" — [DynamoBIM: Dynamo 4.2 in Revit 2027.3](https://dynamobim.org/dynamo-4-2-in-revit-2027-3-autodesk-assistant-dynamo-mcp/)
- **Can the Assistant edit Revit elements directly?** Sources conflict:
  - Hagerman lists element manipulation among its capabilities — [Hagerman blog](https://blog.hagerman.com/revit-2027s-ai-assistant-type-your-way-through-modeling-tasks)
  - HuskyBIM quotes Autodesk saying "no Revit modifications are possible at the moment" for the official MCP server. This is probably the earlier state — [HuskyBIM](https://huskybim.com/learn/revit-mcp)
  - A search summary also surfaced a BIM manager's advice to avoid the Assistant "to avoid unwanted changes inside your projects". I could not pin it to a specific page, so treat it as anecdotal.
- **Official Revit MCP servers:**
  - "Revit Public MCP Servers are currently supported only on Autodesk Revit 2027.2 during the Technical Preview". There are three separate installers: **Read** (does not modify the model), **Write** and **Experimental** (both can modify it). The tool sets "continue to evolve" — [Autodesk MCP Server Help](https://help.autodesk.com/view/ADSKMCP/ENU/?guid=ADSKMCP_RevitMcp_revit_mcp_server_html); [Autodesk Developer Blog: Revit MCP server update](https://blog.autodesk.io/revit-mcp-server-update/)
  - The launch post says Experimental "opens more modification and creation capabilities", is "use-at-your-own-risk", and that tools appear first in Experimental and later move to "Trusted-Write" — [Autodesk Community: Revit MCP Server Tech Preview launch](https://forums.autodesk.com/t5/revit-mep-forum/revit-mcp-server-tech-preview-launch/td-p/14262011)
  - Third-party write-ups (attribution approximate) count 7 read tools in the first (June 2026) read-only release and 8 in the 2027.2 Read installer; neither count is checked against Autodesk's table. Claude Desktop must be configured by hand during the preview. One user reported that Write-tool results did not reach Claude Desktop — [BuildTechScope](https://buildtechscope.com/revit-2027-mcp-server-ai-bim/); [Autodesk MCP setup help](https://help.autodesk.com/view/ADSKMCP/ENU/?guid=ADSKMCP_RevitMcp_setting_up_revit_mcp_server_html)
- **Autodesk University 2026 (September 2026):**
  - Autodesk said design, analysis and documentation will gradually move into Forma, with Revit becoming a "Forma Connected Client". The Assistant was presented as a layer above the applications with an AI Orchestrator, and a standalone agentic Assistant was previewed — [Architosh AU2026](https://architosh.com/2026/09/au2026-autodesk-expands-forma-and-leverages-ai/); [Autodesk press release: agentic AI in three industry clouds](https://adsknews.autodesk.com/en/pressrelease/autodesk-advances-agentic-ai-in-its-three-industry-clouds/)
  - In an AU demo the Assistant in Revit called an external VIKTOR app through MCP. That connection is still on the roadmap, with availability "hoped for early 2027" — [VIKTOR AU 2026 recap](https://www.viktor.ai/blog/263/autodesk-university-2026-recap-civil-3d-viktor-ai)

**Open-source Revit MCP servers (GitHub, 2025–2026)**
- **hungpixi/revit-mcp:** a Node.js MCP server that talks over a local TCP socket to a C# add-in, for Revit 2024 and later — [GitHub](https://github.com/hungpixi/revit-mcp)
- **bimwright/rvt-mcp:** all C#, Revit 2022–2027, developed since March 2026. Its installer registers it in Claude Desktop — [GitHub](https://github.com/bimwright/rvt-mcp)
- **LuDattilo/RevitCortex:** pure C#, Revit 2023–2027, 173 tools, typed errors, session state, "IFC reconstruction". Works with Claude, Codex, Cursor, Gemini and other MCP clients — [GitHub](https://github.com/LuDattilo/RevitCortex)
- **KenLP/RevitMCPServer:** Revit 2025–2027. It can "query, create & edit elements, and run multi-step operations as a single undoable Transaction" — [GitHub](https://github.com/KenLP/RevitMCPServer)
- **Sam-AEC/aec-model-bridge:** reads and edits models with "human approval on every change" — [GitHub](https://github.com/Sam-AEC/Autodesk-Revit-MCP-Server)
- **mcp-servers-for-revit:** a Python/pyRevit-based server for people who prefer Python — [GitHub](https://github.com/mcp-servers-for-revit/mcp-server-for-revit-python). The original revit-mcp is being archived into a monorepo — [GitHub](https://github.com/mcp-servers-for-revit/revit-mcp); [monorepo](https://github.com/mcp-servers-for-revit/mcp-servers-for-revit)
- **Others:** a named-pipes server for Revit 2026 only — [antonhofstader/Revit-2026-MCP-Server](https://github.com/antonhofstader/Revit-2026-MCP-Server); and a documentation-only MCP server that stops LLMs inventing Revit API classes — [Rvt_Docs_MCP](https://glama.ai/mcp/servers/@kaitpw/Rvt_Docs_MCP/blob/e8e22792108335db907f4f38d0a0769bb0eb3ee5/README.md)

**APS Design Automation (Automation API) for Revit: headless cloud Revit**
- **Processing limits:** a Revit WorkItem runs for 10,800 s by default and at most 43,200 s (`limitProcessingTimeSec`), including download and upload time. A job with no "heartbeat" (such as output to stdout) for more than 1 minute is killed — [APS docs: Automation API rate limits](https://aps.autodesk.com/en/docs/design-automation/v3/developers_guide/rate-limits/da-rate-limits)
- **Engine lifecycle:** engines are supported for 4 years after the desktop release, then deprecated for 2 more, then removed. The Revit 2022 engine is removed on 29 March 2027, and a 2027 engine is listed — [APS docs: Engine Lifecycle Policy](https://aps.autodesk.com/en/docs/design-automation/v3/developers_guide/engine-lifecycle/). A debug tool README still says 2018–2024 support, which is outdated [older] — [GitHub: DA Revit local debug tool](https://github.com/Autodesk-Forge/design.automation-csharp-revit.local.debug.tool)
- **No UI:** converting an add-in for Design Automation means removing the RevitAPIUI.dll reference — [APS tutorial: convert add-in](https://aps.autodesk.com/en/docs/design-automation/v3/tutorials/revit/step1-convert-addin). Design Automation can also work with Revit Cloud Models — [APS blog](https://aps.autodesk.com/blog/design-automation-api-supports-revit-cloud-model)
- **New APS business model:**
  - There is a Free tier plus a Paid tier, which is either prepaid Flex tokens or pay-as-you-go. "Rated" APIs (Automation, Model Derivative, Flow Graph Engine, Reality Capture) have monthly usage caps on the Free tier — [APS blog: Business Model Evolution](https://aps.autodesk.com/blog/aps-business-model-evolution)
  - The migration deadline is reported inconsistently: "February 18" in the APS blog versus 16 January 2026 in AECO.digital. AECO.digital also says prices for Model Derivative and for the Automation API for Revit, AutoCAD and Inventor went up — [AECO.digital](https://aeco.digital/autodesk-platform-services-aec/)
- **Flex rate:** Design Automation costs **2 tokens per processing hour**. Model Derivative costs 0.5 token per complex job and 0.1 per simple job. Tokens expire 12 months after purchase — [APS Pricing (Flex tokens)](https://aps.autodesk.com/pricing-flex-tokens). Fusion Automation is listed at 3.0 tokens per hour — [APS Pricing (Pilot)](https://aps.autodesk.com/pricing-pilot)
- **Token price:** about USD 3 list per token, falling to about USD 2.40 at 250,000 or more tokens. The USD 3 figure is the global SRP as of September 2021 [older] — [Redress Compliance](https://redresscompliance.com/autodesk-flex-token-pricing-guide). Desktop Revit on Flex costs 10 tokens per day — [Autodesk Flex rate sheet](https://damassets.autodesk.net/content/dam/autodesk/www/benefits/flex-rate-sheet.pdf)

**Evidence on what LLM agents can and cannot do in Revit**
- **Hands-on case study (May 2026, Revit 2026 + Claude via MCP, Snowdon Towers sample):**
  - Worked: connecting, counting elements, reading areas.
  - Opening a view worked only after the agent fixed its own API call.
  - Two cost estimates for the same floor differed by a factor of two.
  - A Python check of materials on 1,128 walls and a 3D section both failed because the connection dropped.
  - [GitHub: revit-mcp-case-study](https://github.com/meet-rehman/revit-mcp-case-study)
- **Built-in MCP server on a multi-slope roof:** Claude identified three roof planes and estimated solar panels, and wrote nothing to the model. The source is a vendor-adjacent blog — [BIMsmith blog](https://blog.bimsmith.com/Revit-2027-What-the-Built-In-MCP-Server-Actually-Does-in-Practice)
- **MCP server coverage:** some servers handle walls and rooms but offer limited support for families, worksharing and linked models — [Vagon blog](https://vagon.io/blog/how-to-use-revit-with-claude-mcp-computer-use)
- **Practitioner view:** in a July 2026 thread, one firm says it does not use MCP connectors in production and builds smaller AI-assisted Revit tools instead — [RevitForum](https://www.revitforum.org/forum/revit-architecture-forum-rac/architecture-and-general-revit-questions/464685-firms-using-claude-ai-with-revit-what-s-actually-working-for-you)
- **Production-style benchmark:** an MDPI *Buildings* paper tests 10 LLMs inside a commercial Revit 2024 add-in. A study it cites analysed 238 errors across 31 Revit tasks and found **API misuse caused 48.3% of failures**. The year is reported as 2025 in the summary, but the volume/issue suggests 2026 — [MDPI Buildings 16(21):4183](https://www.mdpi.com/2075-5309/16/21/4183)
- **Multi-agent Revit C# pipelines:**
  - Guo et al. reached 78.75% "alignment accuracy", but the code did not always run without fixes.
  - Koh et al. reached 37.50% semantic accuracy (code that both runs and returns the intended result).
  - Neither pipeline fed execution results back to the LLM.
  - [arXiv 2605.01698](https://arxiv.org/pdf/2605.01698)
- **Revit compliance-checking scripts:** of eight LLMs tested, the best (DeepSeek) succeeded in 33.3% of cases. The authors name manual execution and error fixing as limits and propose an agent with direct Revit API access — [arXiv 2506.20551](https://arxiv.org/pdf/2506.20551)
- **ARCBIM (condensed multi-LLM code generation for BIM retrieval):** 1.26 errors per query versus 5.75 for a single-agent baseline, over 80 queries — [ScienceDirect, Automation in Construction](https://www.sciencedirect.com/science/article/pii/S0926580525006259)
- **Multi-agent Revit framework over MCP:** reports large time savings, but the figures are self-reported — [ResearchGate](https://www.researchgate.net/publication/400983065_Orchestrating_LLM-Powered_Workflows_for_Autodesk_Revit_via_Model_Context_Protocol_A_Multi-Agent_Framework_for_Intelligent_BIM_Automation)

### Inferences
- **What an LLM agent can reliably do today:**
  - Read and query models.
  - Call well-defined creation tools with explicit parameters: levels, walls along a polyline, floors from a CurveLoop, simple footprint roofs, toposolids from a point list.
  - Unreliable: free-form Revit API code written at run time. That is the API-misuse failure mode, which accounts for about half of failures.
  - Also fragile: roofs, which can silently fail; toposolid boundaries, which come out as a convex hull unless curve loops are passed; and families, which most MCP servers support poorly.
  - **Design rule for an MVP:** the LLM picks and validates *parameters*, and deterministic, tested code produces the *geometry*.
- **Where each Revit route fits:**
  - MCP and Autodesk Assistant suit the architect's interactive "finishing" session in desktop Revit. Both are Tech Preview or community-grade and need a running desktop Revit.
  - Server-side generation for an automated product should use APS Design Automation, or skip Revit and write IFC (see section 2).
- **Toposolid from DMR 5G:** use the curve-loop + points overload with the plot-plus-buffer polygon as the boundary, and thin the points to well below 10,000. This avoids the convex-hull artefact and the import downsampling.
- **Cost of a Design Automation run:** a 5–10 minute WorkItem would cost about 0.17–0.33 tokens, roughly USD 0.5–1.0 at list price. This is derived from 2 tokens per hour and about USD 3 per token, before any Free-tier allowance.
- **Version risk:** Tech Preview features and the .NET 10 transition mean add-ins must be rebuilt per Revit version. Plan for Revit 2026 and 2027 builds and the matching Design Automation engines.

### Gaps
- The numeric monthly Free-tier caps for the Automation API and Model Derivative did not appear in any search result. The current token price in CZK or EUR was not found either.
- I found no official list of which create/modify tools are in the Revit 2027.2 Write and Experimental MCP servers, and no public success-rate measurements for them.
- The language, region and subscription requirements of Autodesk Assistant were not found.
- No source confirmed the status of pyRevit or RevitPythonShell on Revit 2027 / .NET 10.
- No independent test with repeated runs measures LLM success on creating roofs or toposolids in Revit.

---

## 2. Alternatives without Revit: IFC-first, Archicad, Allplan, Vectorworks, BricsCAD and Speckle, and which tools Czech architects use

### Takeaway
An IFC-first pipeline on IfcOpenShell (Python, LGPL) can generate a georeferenced IFC4 or IFC4X3 model headlessly on Linux with no BIM licence. Every Czech authoring tool can open that file, and it matches the IFC 4+ requirement for the building-permit IT systems (section 6).

Archicad is the main native alternative. The Tapir add-on's JSON commands can create walls, slabs, roofs, openings and so on. Archicad 30 (released 7 October 2026) adds an official MCP in beta, but both routes need a running desktop Archicad with an open project. No reliable recent Czech market-share survey exists. Revit leads among multidisciplinary design firms, and Archicad is strong among architects. That argues for IFC as the primary deliverable.

### Cited Findings

**IFC-first (open source)**
- **IfcOpenShell API:**
  - `project.create_file(version='IFC4')` creates a file, and `ifcopenshell.file(schema="IFC4X3")` creates an IFC4X3 model — [IfcOpenShell docs: api.project](https://docs.ifcopenshell.org/autoapi/ifcopenshell/api/project/index.html)
  - Elements are created with `root.create_entity` and placed with `geometry.edit_object_placement` — [IfcOpenShell docs: geometry creation](https://docs.ifcopenshell.org/ifcopenshell-python/geometry_creation.html)
  - Geometry helpers include `add_wall_representation`, `add_slab_representation` and `create_2pt_wall` — [IfcOpenShell docs: api.geometry](https://docs.ifcopenshell.org/autoapi/ifcopenshell/api/geometry/index.html)
  - No roof-specific API was found. The IfcOpenHouse tutorial creates an `IfcRoof` but reuses a wall representation for its geometry — [IfcOpenHouse tutorial](https://cvillagrasa.github.io/IfcOpenHouse/generation.html)
- **Licences:** most IfcOpenShell components are LGPL-3.0-or-later. The Bonsai Blender add-on is GPL-3.0-or-later — [IfcOpenShell repository README (mirror)](https://github.com/aothms/IfcOpenShell); [PyPI ifcopenshell](https://pypi.org/project/ifcopenshell)
- **web-ifc (That Open Company):** "a javascript library to read and write ifc files, at native speeds" — [GitHub ThatOpen/engine_web-ifc](https://github.com/ThatOpen/engine_web-ifc). A third-party skill package lists `CreateModel`, `CreateIfcEntity` and `SaveModel` for building IFC from scratch, but I could not confirm these in the official docs — [skills.sh thatopen web-ifc](https://skills.sh/openaec-foundation/thatopen-claude-skill-package/thatopen-core-web-ifc)
- **MCP4IFC (arXiv 2511.05533, late 2025):**
  - An MCP framework that lets LLMs read, create and edit IFC through tool calls.
  - It is a Python MCP server plus a Blender add-on, using IfcOpenShell and Bonsai, with an `execute_ifc_code_tool` for generated Python.
  - Code at the project page.
  - [arXiv 2511.05533](https://arxiv.org/abs/2511.05533v1); [project page](https://show2instruct.github.io/mcp4ifc)
  - A 2026 survey of BIM MCP servers notes that MCP4IFC is the only one documented in the scientific literature — [arXiv 2601.00809](https://arxiv.org/html/2601.00809)
- **Other IFC MCP servers:** a Bonsai MCP and an `ifcopenshell-mcp` package also exist — [Bonsai MCP](https://mcpservers.org/id/servers/JotaDeRodriguez/Bonsai_mcp); [PyPI ifcopenshell-mcp](https://pypi.org/project/ifcopenshell-mcp/)

**Archicad (Graphisoft)**
- **Tapir:** it registers extra JSON commands on top of Graphisoft's official JSON API — [GitHub tapir-archicad-automation](https://github.com/ENZYME-APD/tapir-archicad-automation)
  - It can create "most construction elements (walls, columns, beams, slabs, roofs, stairs, meshes, openings)" but not curtain walls; a PR adds CreateCurtainWalls — [Tapir PR #867](https://github.com/ENZYME-APD/tapir-archicad-automation/pull/867)
  - `layerIndex` is missing on CreateWalls, CreateBeams, CreateSlabs and CreateColumns, so a separate SetDetailsOfElements call is needed — [Tapir issue #1043](https://github.com/ENZYME-APD/tapir-archicad-automation/issues/1043)
- **Community MCP servers for Archicad:**
  - Boti-Ormandi/archicad-mcp: local stdio; a script runner for multi-step Python; Archicad must run on the same host — [GitHub](https://github.com/Boti-Ormandi/archicad-mcp)
  - tapir-archicad-mcp: tools generated from the Tapir and official schemas; 137 tools in v0.5.0 and "191+" in a later listing — [PyPI](https://pypi.org/project/tapir-archicad-mcp/0.5.0/); [Glama](https://glama.ai/mcp/servers/SzamosiMate/tapir-archicad-MCP)
  - lgradisar/archicad-mcp: for Archicad 25–29 — [GitHub](https://github.com/lgradisar/archicad-mcp)
  - mgnnbv/archicad-server: walls, slabs, doors, windows and zones. It returns error 4001 if no project is open — [GitHub](https://github.com/mgnnbv/archicad-server)
- **Archicad 30:**
  - Released 7 October 2026 — [Wikipedia: Archicad](https://en.wikipedia.org/wiki/Archicad); [Architosh, Oct 2026](https://architosh.com/2026/10/graphisoft-unveils-archicad-30-nemetschek-creator/)
  - Graphisoft lists the "Archicad MCP and Public Archicad MCP Server" for the Archicad 30 **Collaborate and Max** plans. It describes an agentic AI Assistant that can "get answers, run queries, check your model, and make approved batch edits". The AI Assistant (Beta) for product and domain questions is on the Studio plan — [Graphisoft AI Solutions](https://www.graphisoft.com/en-us/plans-and-products/ai-solutions/)
  - Availability conflicts. The 2026 beta help describes an MCP Technology Preview that connects Archicad to Claude Desktop and Cursor — [Graphisoft help: Archicad MCP Tech Preview](https://help.graphisoft.com/.beta2026/en/AI_Assistant_NewTopics/mcptechpreview.html). Nordic BIM says the MCP and the new Max plan arrive "later this year" — [Nordic BIM, 15 Oct 2026](https://www.nordicbim.com/en/insights/archicad-30). AEC Magazine notes that Graphisoft did not detail how the connectivity works or when it becomes available — [AEC Magazine](https://aecmag.com/bim/graphisoft-unveils-archicad-30-and-shares-ai-roadmap/)
  - Construction Industry AI describes it as "MCP in Beta, a third subscription tier" — [constructionindustry.ai](https://www.constructionindustry.ai/product/graphisoft-archicad-30-mcp-beta-archicad-max/)
- **Archicad 29** [older: 2025]: Graphisoft calls it "the backbone of the next generation of AI-enabled workflows" — [ArchDaily](https://www.archdaily.com/1035178/how-will-bim-ai-assistance-and-integrated-workflows-shape-the-architects-design-experience)

**Allplan, Vectorworks, BricsCAD**
- **Overview:** many AEC vendors have released or announced MCP servers, Graphisoft among them, and third-party servers exist for BricsCAD, Vectorworks and Rhino — [Cadalyst](https://blog.cadalyst.com/architecture-infrastructure-construction-solutions/mcp-a-new-standard-for-connecting-ai-to-aec-software)
- **BricsCAD:** its own AI Assistant arrived in V26.2.03 and does not require a maintenance contract — [Bricsys forum](https://forum.bricsys.com/discussion/40308/ai-assistant). The third-party MultiCAD MCP supports BricsCAD, AutoCAD, ZWCAD and GstarCAD — [GitHub multiCAD-mcp](https://github.com/AnCode666/multiCAD-mcp)
- **Vectorworks:** no official MCP found. A forum user reports creating and editing via an MCP that "needs proper skills" — [Vectorworks forum](https://forum.vectorworks.net/topic/134481-mcp-for-ai-claude/). Vectorworks is the host tool in the TUM research projects Text2BIM and BIMgent (section 5).
- **Allplan:** results only covered Allplan 2025's AI features [older: Dec 2024] — [Nemetschek](https://www.nemetschek.com/en/news-media/design-product-launches). One person demonstrated Claude placing columns, beams and a slab through an "MCP Bridge" (an anecdote, not an official integration) — [X post](https://x.com/KukosCucos/status/2033980892113240307)

**Speckle (interchange and automation layer)**
- **Connectors:** Revit 2023–2027, Windows only — [Speckle docs: Revit](https://docs.speckle.systems/connectors/revit/revit); Archicad 27, 28 and 29 — [Speckle: Archicad](https://speckle.systems/integrations/archicad/)
- **IFC import:** IFC2x3 through IFC4x3, with the size cap raised from 100 MB to 1 GB — [Speckle: IFC](https://speckle.systems/integrations/ifc/)
- **Programmatic access and pricing:** the Python SDK and GraphQL API are the main routes, and Automate sits in Enterprise-oriented tiers. Prices conflict: Team at USD 99/month versus Starter at USD 39/month with Business from USD 500/month (older listing) — [BIM Tools Hub](https://bimtoolshub.com/speckle); [Data Driven AEC](https://datadrivenaec.com/tools/speckle)

**Which BIM tools do Czech architects use? (market-share signals)**
- A Czech blog cites a "National BIM Report 2019" with Revit at 46% and ArchiCAD at 15% of roughly 1,000 firms. That survey is not Czech-specific; it appears to be the UK NBS report [older: 2019] — [ADEON](https://www.adeon.cz/nejpouzivanejsi-bim-sw/)
- A Foresite study commissioned by Autodesk (roughly 2021, vendor-funded) found Revit among the most popular BIM packages in Czech design firms. 70% of the sample were building-design firms — [TZB-info](https://www.tzb-info.cz/bim-informacni-model-budovy/22586-unikatni-vyzkum-jak-si-stoji-digitalizace-v-ceskych-projekcnich-firmach)
- Across European architects (not Czech-specific), 45% use Revit and about a third use Archicad. In Germany Archicad has 27%, and Vectorworks plus Allplan 31% — [USP Research](https://www.usp-research.com/insights/blogs/market-overview-of-bim-and-cad-software-usage-of-european-architects/)
- The state Koncepce BIM site keeps an Archicad page listing Czech architecture firms that use it (A69, OK Plan, Atelier 38, Chválek, Pelčák a partner). This shows presence, not share — [koncepcebim.gov.cz: Archicad](https://koncepcebim.gov.cz/bim/co-je-co-v-bim/dss/podpora-software-dodavatelu/ukazky-software-platforem/archicad/)

### Inferences
- **Output format:** for a Czech product, **IFC4 (or IFC4X3) is the right primary output**. It is tool-neutral, so it serves both the Archicad-heavy architect segment and the Revit-heavy engineering segment, and it matches the state's IFC 4+ requirement. Native .rvt or .pln can be optional add-ons.
- **Archicad automation** (Tapir or Archicad 30 MCP) is attractive for Czech architects. However, it is desktop-bound and needs an open project, so it suits plugin-style "finish in Archicad" work rather than a cloud service. No headless Archicad cloud service comparable to APS Design Automation turned up (see Gaps).
- **Speckle** is a useful optional transport layer for IFC to Revit or Archicad, with Python SDK automation. It is not needed for the MVP.

### Gaps
- No current (2024–2026) Czech survey of BIM software share among architects (ČKA, ČKAIT, ČAS) was found. Allplan's Czech share is unknown.
- I found no headless or cloud Archicad automation service, and no Graphisoft-documented server licence for unattended use.
- The web-ifc licence (believed MPL-2.0) was not verified. No 2026-specific details were found on Allplan 2026 or Vectorworks 2026 AI or MCP.

---

## 3. Building the 3D site context model from Czech geodata

### Takeaway
All the inputs for a site model are free open data in S-JTSK:
- **Terrain:** DMR 5G as ground-classified LAZ point clouds per SM5 sheet. Height error is 0.18 m on open ground and 0.3 m in forest.
- **Parcel boundaries:** the cadastral map as DXF or SHP per cadastral area, CC BY 4.0, with 99.49% digital coverage.
- **Neighbouring footprints:** RÚIAN building polygons with the PocetPodlazi (floor count) and ZastavenaPlocha (built-up area) attributes.
- **Neighbour heights:** DMP 1G surface LAZ (0.4 m error on buildings), but from 2009–2013 laser scanning.

ČÚZK publishes no national LoD1 or LoD2 building dataset. Prague (IPR, CityGML) and Brno (LoD2 OBJ) have city models.

For georeferencing, use EPSG:5514 in IfcProjectedCRS with IfcMapConversion and Bpv heights (EPSG:8357). Revit's IFC export can write these entities, but Revit's IFC import historically ignores IfcMapConversion.

### Cited Findings

**Terrain: DMR 5G**
- **Accuracy and coordinates:** a TIN of X, Y, H points with a total mean height error of 0.18 m on open ground and 0.3 m in forest, in S-JTSK with Bpv heights. It comes from airborne laser scanning (ALS) in 2009–2013 — [ČÚZK technical report DMR 5G](https://geoportal.cuzk.cz/Dokumenty/TECHNICKA_ZPRAVA_DMR_5G.pdf); [ČÚZK metadata DMR 5G](https://geoportal.cuzk.cz/(S(ee40cvpuvplt4js40gmpgsnj))/Default.aspx?lng=CZ&mode=TextMeta&side=vyskopis&metadataID=CZ-CUZK-DMR5G-V&mapid=8&menu=302)
  - An independent thesis found a systematic bias of about +0.18 m (DMR above the real terrain) and an RMSE of about 0.25 m after removing it — [theses.cz](https://theses.cz/id/pfr5hj/zaverecna_prace.pdf)
- **Download:** LAZ through an ATOM download service, free, per SM5 map sheet, zipped. There are variants in S-JTSK and in ETRS89/TM33 — [ATOM DMR5G LAZ S-JTSK](https://geoportal.gov.cz/php/micka/record/basic/CZ-CUZK-ATOM-DMR5G-SJTSK?dlang=eng); [ATOM DMR5G LAZ ETRS89](https://geoportal.gov.cz/php/micka/record/basic/CZ-CUZK-ATOM-DMR5G-ETRS89?dlang=eng). A raster ImageServer also exists — [ags.cuzk.gov.cz dmr5g ImageServer](https://ags.cuzk.gov.cz/arcgis2/rest/services/dmr5g/ImageServer)
- **Point density and updates:** about 1.2 points/m² per a 2024 overview, against 1.6 points/m² in a 2013 thesis based on 2012 data (conflicting, older). The same 2024 overview says ALS updating of DMR 5G has run since 2016, and that ČÚZK has provided orthophoto, DMR 4G, DMR 5G and DMP 1G free of charge since 2023 — [o-news.cz 2024](https://o-news.cz/kam-kraci-mapovani-v-roce-2024/); [Charles University thesis 2013](https://dspace.cuni.cz/bitstream/handle/20.500.11956/67099/BPTX_2013_1_11310_0_353447_0_144452.pdf?sequence=1&isAllowed=y)
- **Getting it into Revit:** the UI CSV point import downsamples to 10,000 points. The API offers `Toposolid.Create` from points, or from curve loops plus points (section 1) — [Revit 2026 help](https://help.autodesk.com/cloudhelp/2026/ENU/Revit-Model/files/GUID-A1E1DE84-29AE-4B99-B377-091C0AC45249.htm)

**Parcel boundaries: cadastral map**
- **DXF:** per cadastral area, in S-JTSK (EPSG:5514), open data under CC BY 4.0, zipped, refreshed daily. The conversion drops point numbers and point-quality codes. As of 10 August 2026 the digital map covers about 99.49% of the Czech Republic — [ČÚZK Geoportal: KM DXF](https://geoportal.cuzk.cz/Default.aspx?mode=TextMeta&side=katastr_map&metadataID=CZ-00025712-CUZK_SERIES-MD_KM-KU-DXF&head_tab=sekce-02-gp&menu=2216)
- **SHP:** per cadastral area, updated weekly. VKM is updated quarterly — [ČÚZK Geoportal: KM SHP ATOM](https://geoportal.cuzk.cz/(S(0ao2zkudeedvpia2pycvj4pb))/Default.aspx?mode=TextMeta&metadataXSL=full&side=WFS.ATOM_KM&metadataID=CZ-00025712-CUZK_ATOM-MD_KM-KU-SHP); [services.cuzk.gov.cz](https://services.cuzk.gov.cz/)

**Neighbouring buildings**
- **RÚIAN stavební objekty (buildings):**
  - They are polygon layers with the attributes `PocetPodlazi` and `ZastavenaPlocha` — [NPÚ ArcGIS layer of RÚIAN buildings](https://geoportal.npu.cz/arcgis/rest/services/GeoportalSystem/ruian_modul_kn/MapServer/3)
  - `PocetPodlazi` is **above- plus below-ground floors combined**. ZastavenaPlocha is in m², measured as the projection of the outer face of all floors — [ČÚZK VFR structure v5.0](https://cuzk.gov.cz/ruian/Poskytovani-udaju-ISUI-RUIAN-VDP/Vymenny-format-RUIAN-(VFR)/DL058RR2-v5-0-Struktura-a-popis-VFR_final.aspx); [ČSÚ methodology 2018](https://csu.gov.cz/docs/107871/4c7e3be8-7ca9-3a94-dbaa-e5a0ecd14055/METODIKA_RSO_01012018_v1fin.pdf?version=1.0)
  - The technical-economic attributes sit in the `DetailniTEA` collection — [same VFR doc](https://cuzk.gov.cz/ruian/Poskytovani-udaju-ISUI-RUIAN-VDP/Vymenny-format-RUIAN-(VFR)/DL058RR2-v5-0-Struktura-a-popis-VFR_final.aspx)
- **DMP 1G (surface model):**
  - LAZ in S-JTSK/Bpv per SM5 sheet. Mean height error is 0.4 m for buildings and 0.7 m for objects without clear outlines, such as forest. From ALS 2009–2013 — [ČÚZK Geoportal DMP 1G](https://geoportal.cuzk.cz/(S(jfzih3jrytd1de2iixywkyvt))/Default.aspx?mode=TextMeta&side=vyskopis&metadataID=CZ-CUZK-DMP1G-V&head_tab=sekce-02-gp&menu=303); [ATOM DMP1G LAZ](https://geoportal.gov.cz/php/micka/record/basic/CZ-CUZK-ATOM-DMP1G-SJTSK?dlang=eng)
  - The GISMentors GRASS course shows how to process DMR and DMP (XYZ, LAS or LAZ) — [GISMentors](https://training.gismentors.cz/grass-gis-pokrocily/lidar/dmr-dmp-cuzk.html)
  - Building height is normally derived as DMP minus DMR, but the ČÚZK pages found do not state this.
- **National 3D buildings:**
  - No ČÚZK nationwide LoD1 or LoD2 building model was found. Poland offers free nationwide LoD1 models for comparison — [GUGiK geoportal.gov.pl](https://www.geoportal.gov.pl/aktualnosci/nowe-modele-budynkow-3d-z-2024-roku-w-standardzie-lod1-dostepne-dla-obszaru-calego-kraju/)
  - **Brno** publishes a LoD2 building model as OBJ, built photogrammetrically since 2020 — [data.brno.cz](https://data.brno.cz/maps/dc95041d63e44e129ba0d9258a1dddb4/about)
  - Masaryk University offers LoD2 models of its campus buildings as KMZ — [geoportal.muni.cz](https://geoportal.muni.cz/podkladova-data/3d-modely-budov)
- **IPR Praha 3D model:**
  - Buildings come as SHP/multipatch, DGN/DWG and, **since 2023, CityGML**, split by 1:5000 map sheets. Bridges are a separate dataset — [Geoportál Praha: model budov a mostů](https://geoportalpraha.cz/data-a-sluzby/clanky-a-projekty/3d-model/3d-model-budovy-mosty); [Open data listing](https://opendata.geoportalpraha.cz/datasets/budovy-3d-buildings-3d-model)
  - Open data under CC BY with the credit line "data base © IPR Praha" — [Geoportál Praha open data](https://geoportalpraha.cz/en/data-and-services/open-data)
- **Autodesk Forma defaults in Europe** [older: Dec 2023]:
  - OSM footprints and EU-DEM terrain at 25 m. OSM buildings without a height get 3 m per level — [Autodesk Forma blog](https://blogs.autodesk.com/forma/2023/12/11/site-context-in-revit-via-forma/)
  - High-quality 1 m ESRI terrain was announced only for Switzerland, Austria, Lithuania, Estonia, Latvia and New Zealand — [Autodesk Forma, LinkedIn](https://www.linkedin.com/posts/autodesk-forma_formaforward-formaforward-autodesk-activity-7132739466825269248-4JMb)
  - Users can import their own terrain (OBJ or IFC) and "convert to terrain", but OSM neighbours do not snap to it — [Autodesk Forma forum](https://forums.autodesk.com/t5/forma-forum/how-can-i-import-terrain-in-next-gen/td-p/11800831)

**Coordinates: S-JTSK / Bpv to Revit and IFC**
- **CRS choice:** EPSG:5514 (S-JTSK / Krovak East North) is the north-oriented GIS variant. The south-oriented EPSG:5513 remains the legal system — [epsg.io 5514](https://epsg.io/5514-1623); [spatialreference.org 5514](https://spatialreference.org/ref/epsg/5514/)
- **Bpv heights:** Bpv corresponds to EPSG:8357 "Baltic 1957 height" (Czechia and Slovakia) — [epsg.io 8357](https://epsg.io/8357). PROJ has a compound "S-JTSK/05 / Modified Krovak + Baltic 1957 height" built on EPSG:5515 + 8357 — [spatialreference.org](https://spatialreference.org/ref/proj/S_JTSK05_BALTIC_HEIGHT/)
- **IFC4 georeferencing:**
  - IfcProjectedCRS names the target CRS, qualified as "EPSG:xxxx", and IfcMapConversion carries Eastings, Northings and OrthogonalHeight (plus rotation and scale) — [Goedertier: How to georeference a BIM model](https://medium.com/@stijngoedertier/how-to-georeference-a-bim-model-1905d5154cfd); [thinkmoult: IFC CRS and Revit](https://thinkmoult.com/ifc-coordinate-reference-systems-and-revit.html)
  - IfcMapConversion takes precedence over TrueNorth — [thinkmoult](https://thinkmoult.com/ifc-coordinate-reference-systems-and-revit.html)
- **Revit IFC export:**
  - "Apply Coordinate System Worldwide" writes IfcProjectedCRS and IfcMapConversion; unchecked, only project coordinates are exported. Revit 2023 with an EPSG code plus the Project Base Point exports correct georeferencing entities — [ArcGIS GeoBIM: georeferencing workflows](https://doc.arcgis.com/en/geobim/latest/get-started/georeferencing-workflows.htm); [ArcGIS GeoBIM tools configuration](https://doc.arcgis.com/en/geobim/11.2/create/geobim-tools-configuration-requirements.htm)
  - Caveat from one source in the results (attribution uncertain, probably bimatic): IfcRigidOperation carries only translation, so grid-north rotation can be lost on export and the model can appear shifted or rotated downstream — [bimatic: IFC georeferencing & LoGeoRef](https://www.bimatic.ch/en/blog/ifc-georeferencing-logeoref)
- **Revit IFC import:** an IFC georeferencing checker's documentation says Revit does not interpret IfcMapConversion on import. That claim is about three years old [older] — [IfcGeoRef documentation](https://github.com/dd-bim/IfcGeoRef/blob/master/Documentation_v3.md)
  - One open-source Revit exporter writes shared coordinates and records the map conversion on IfcSite. Because Revit does not document which way `ProjectLocation.GetTotalTransform()` maps, it tests both directions — [GitHub PR fragments-plugin-revit](https://github.com/michael031288/fragments-plugin-revit/pull/10)
- **Tools:** IFCraft, a converter from DWG, DXF, 3DM and LandXML to IFC4.3, writes S-JTSK / EPSG:5514 georeferencing through IfcMapConversion — [IFCraft](https://ifcraft.checkthebim.com/). TU Delft's ifcgref and georeference-ifc add or repair IFC georeferencing — [GitHub tudelft3d/ifcgref](https://github.com/tudelft3d/ifcgref); [GitHub georeference-ifc](https://github.com/stijngoedertier/georeference-ifc)

### Inferences
**Recommended site-model build**
1. Take the parcel polygon or polygons from the plot report, or from the cadastral DXF/SHP of the cadastral area.
2. Fetch the DMR 5G LAZ sheets covering the plot plus a buffer of 30–100 m.
3. Thin the points to roughly 2,000–5,000 and triangulate them (TIN).
4. Write the terrain one of two ways:
   - **IFC:** `IfcSite` plus `IfcGeographicElement` (PredefinedType TERRAIN) with an `IfcTriangulatedFaceSet`. The entity names are from the IFC4 schema and were not checked in this research.
   - **Revit:** `Toposolid.Create` with the buffer polygon as a CurveLoop.
5. Model neighbours as **LOD1 extrusions**: the RÚIAN polygon at terrain height, extruded to a median or 90th-percentile DMP-minus-DMR height inside the footprint.
6. If that height is unusable (new building or bad data), fall back to (PocetPodlazi − estimated basement) × 3 m, following Forma's 3 m-per-level heuristic.
7. In Prague, use the IPR CityGML instead. In Brno, use the LoD2 OBJ.

**Data currency**
- DMP 1G dates from 2009–2013, so houses built later are missing or wrong.
- Cross-check against RÚIAN (a building present without a matching DMP height) and against the orthophoto. Flag the uncertainty in the model, for example with an `IfcPropertySet` "Pset_SourceQuality".

**Georeferencing practice**
- Keep the model origin near the plot, for example its centroid rounded to 1 m, so geometry avoids large coordinates.
- Put the S-JTSK offset into IfcMapConversion with `IfcProjectedCRS.Name = "EPSG:5514"`, and Bpv as OrthogonalHeight with VerticalDatum "Baltic 1957" / EPSG:8357.
- EPSG:5514 coordinates in Czechia are negative. Test the sign and axis order in the target tool.
- For Revit deliverables, also set the Survey Point (shared coordinates) explicitly through the API, because Revit's IFC import may ignore IfcMapConversion.

**Forma:** it adds little for Czech sites unless DMR 5G is imported, because its European default terrain is coarse (25 m EU-DEM).

### Gaps
- ČÚZK orthophoto resolution and format were not verified (other researchers cover data sources).
- An INSPIRE cadastral-parcel WFS endpoint was not confirmed in these results.
- No ČÚZK plans for a national 3D building model (LoD1/LoD2) were found.
- The IFC4.3 terrain entities and Revit 2026/2027 IFC import georeferencing behaviour were not verified against primary documentation.
- The LOD of the IPR Praha CityGML (LOD1, LOD2 or roofs) was not confirmed.

---

## 4. What scope of "basic model" is realistic: site + allowable building envelope from planning rules + simple massing at LOD 100–200

### Takeaway
A realistic automated "basic model" has three parts:
1. **A georeferenced site** (terrain, parcel, neighbours at LOD1).
2. **An *indicative* buildable envelope** from deterministic rules: a 2 m setback from boundaries except towards public space, plus the height, floor-count and site-coverage limits of the zoning plan (územní plán) taken from the plot report.
3. **One to three simple house massings** at LOD 100–200: levels, generic walls, slabs and a roof.

Layouts, openings, structure and full regulatory compliance (for example the 45° shading rule towards neighbours' windows) cannot be automated reliably from public data and need an architect.

### Cited Findings
- **LOD definitions (BIMForum):**
  - LOD 100: an element "may be graphically represented ... with a symbol or other generic representation", and any information derived from it is approximate.
  - LOD 200: "a generic system, object, or assembly with approximate quantities, size, shape, location, and orientation" (generic placeholders).
  - [BIMcommunity LOD overview](https://bimcommunity.com/news/load/1643/bim-level-of-development-lod-100-200-300-350-400-500); [archgyan LOD guide](https://archgyan.com/understanding-bim-lod-levels/)
- **Setbacks under vyhláška 146/2024 Sb.:**
  - § 11(2): "Stavba musí být umístěna minimálně 2 m od hranice pozemku vyjma pozemku veřejného prostranství" (a building must be at least 2 m from the plot boundary, except towards public space). It does not apply to structures up to 2 m high. This is the consolidated text as of 1 July 2026 — [e-Sbírka 146/2024](https://e-sbirka.gov.cz/sb/2024/146); [zakonyprolidi 146/2024](https://www.zakonyprolidi.cz/cs/2024-146)
  - Exceptions are possible under § 138 of zákon 283/2021 Sb. — [djsarchitecture](https://www.djsarchitecture.cz/odstupy-od-sousednich-staveb)
- **No more 7 m rule:** the new decree no longer sets the 7 m minimum between family houses that vyhláška 501/2006 had, together with 2 m from common boundaries, until 30 June 2024 — [akbecvar.cz](https://akbecvar.cz/odstupova-vzdalenost-mezi-stavbami/); [Havel & Partners blog](https://www.havelpartners.blog/nova-vyhlaska-o-pozadavcich-na-vystavbu-mnohem-liberalnejsi-nez-drivejsi-predpisy)
- **45° shading rule:** a new building must respect a 45° shading angle from the window of an existing habitable room (annex 4) — [zalitobetonem.cz](https://zalitobetonem.cz/blog/odstup-staveb-okna-obytne-mistnosti/)
- **Which paragraph:** the consolidated official text puts the 2 m rule in § 11(2), while one secondary web source cites § 5. Rely on e-Sbírka — [e-Sbírka 146/2024](https://e-sbirka.gov.cz/sb/2024/146)
- **Rules-to-massing research pattern (CAADRIA 2026):** a LangGraph pipeline extracts rules from code text, a deterministic compliance engine checks them, and a Rhino–Grasshopper front end gives real-time feedback on zoning and massing. The authors argue a lightweight AI workflow beats full BIM where BIM adoption is low — [CAADRIA 2026 paper](https://papers.cumincad.org/data/works/att/caadria2026_392.pdf)
- **Commercial pattern:** Snaptrude describes a "buildable-envelope agent" that computes maximum buildable volume and then generates massing options inside it (vendor claim) — [Snaptrude blog](https://www.snaptrude.com/blog/generative-design-architecture-rfp-to-massing-10-minutes)
- **Human verification:** AI zoning tools parse code text into structured rules (height, setbacks, floor-area ratio), but a planner or attorney still verifies the interpretation — [Meltplan glossary](https://www.meltplan.com/glossary/ai-zoning-analysis)
- **Output formats:** an envelope tool outputs an "Envelope Data JSON" with the lot polygon, setbacks and volumes — [ALPA](https://alpa.llc/skills/zoning-envelope/)
- **End-to-end autonomy is still weak:** BIMgent achieves 32% end-to-end success on a 25-task building benchmark and an average design-quality score of 3 out of 5 — [arXiv 2506.07217](https://arxiv.org/html/2506.07217v2)

### Inferences
**Realistic MVP scope (automatable, about LOD 100–200)**
- Terrain TIN with the plot area highlighted.
- Parcel boundary, plus neighbouring parcels as lines or annotation.
- Neighbours as LOD1 volumes.
- The envelope solid: the parcel polygon offset by 2 m (0 m on boundaries with public space or where a building line governs), capped by the zoning-plan height.
- The maximum footprint from the site-coverage coefficient.
- Reporting metrics: buildable area, maximum footprint, maximum built-up and floor area.
- 1–3 massings: a rectangle or L-shape footprint, 1–2 above-ground floors plus an optional basement, about 3.0 m floor-to-floor, a gable or flat roof.
- Modelled as LOD 200 generic `IfcWall` / `IfcSlab` / `IfcRoof`, or Revit generic walls, floors and footprint roofs, with `IfcBuildingStorey` levels.

**Out of scope for automation**
- Room layouts compliant with vyhláška 146/2024 (daylight, minimum dimensions).
- Window placement.
- Checking the 45° shading angle, which needs the window positions of existing neighbouring buildings. Those are not in RÚIAN, DMP or cadastral data and need a site survey.
- Protection zones of utilities beyond the 2D polygons in the plot report.
- Structure, MEP and families or specific products.

**Deterministic first, LLM second:** envelope maths (polygon offsets, intersections, height caps) should be ordinary Shapely/GEOS code. The LLM's role is to turn the zoning-plan text into structured parameters, with human confirmation, and to choose massing variants from the client brief. This mirrors the CAADRIA "LLM extraction + deterministic engine" pattern.

**Labelling:** call the envelope "orientační" (indicative). Exceptions under § 138, local custom ("obvyklé umístění") and the building authority's discretion mean it is not a legal determination.

### Gaps
- How zoning-plan regulatives (height levels, site coverage, building lines) are encoded or made machine-readable in Czech zoning plans was not researched here (other researchers cover zoning-plan data).
- No Czech-specific automated envelope tool or study was found.

---

## 5. Existing products and research that do text/data-to-BIM or rules-to-massing

### Takeaway
Research shows LLM multi-agent systems can generate *simple* native BIM models: Text2BIM in Vectorworks with rule-checked feedback loops. GUI-driving agents remain weak (BIMgent, 32% end-to-end). IFC and MCP frameworks (MCP4IFC) and benchmarks (BIM-Edit, June 2026) appeared in 2025–2026.

Commercially, no product does "Czech plot report → IFC massing" out of the box:
- **Forma:** site context and massing to Revit, but weak Czech default data.
- **Snaptrude, Arcol, Hypar, Finch, TestFit:** massing and space planning in the browser, with export to Revit or IFC.
- **Maket:** 2D residential plans only.
- **ArchiLabs and Swapp:** agents inside Revit for automation or construction documents.
- **Qonic and Motif:** new cloud or agent-native BIM platforms.

### Cited Findings

**Research (2024–2026)**
- **Text2BIM (Du, Esser, Nousias, Borrmann, TUM; arXiv 2408.08054, Aug 2024, revised July 2025; journal version in *J. Computing in Civil Engineering*):**
  - LLM agents (Product Owner, Architect, Programmer, Reviewer) turn natural language into *native* BIM models by calling a BIM authoring tool's API. The case study uses Vectorworks.
  - A rule-based model checker drives iterative fixes.
  - Reported average rule-pass rates are about 99.4% (GPT-4o) and 99.2% (Mistral-Large-2), with Gemini more variable (from a review summary).
  - [arXiv 2408.08054](https://arxiv.org/abs/2408.08054); [Moonlight review](https://themoonlight.io/review/text2bim-generating-building-models-using-a-large-language-model-based-multi-agent-framework)
- **BIMgent (Deng, Du, Nousias, Borrmann; ICML 2025):**
  - A multimodal agent drives the Vectorworks GUI. A design layer turns text or sketches into a floorplan (DeepFloorPlan), and planners and a supervisor carry out and check the steps.
  - Results: 32% end-to-end on 25 tasks versus 0% for baselines; 86.58% and 95.12% success creating walls and openings; design score 3/5.
  - Code at github.com/ZihanDDD/BIMgent.
  - [arXiv 2506.07217](https://arxiv.org/html/2506.07217v2); [ICML 2025](https://icml.cc/virtual/2025/49773)
- **MCP4IFC (arXiv 2511.05533):** LLMs create and edit IFC through an MCP server with IfcOpenShell and Bonsai — [arXiv](https://arxiv.org/abs/2511.05533v1)
- **BIM-Edit (arXiv 2606.20146, June 2026):** 7 LLMs on 324 IFC editing tasks, with a budget of 20 tool calls. The saved IFC is graded on geometry, semantics and topology — [arXiv 2606.20146](https://arxiv.org/pdf/2606.20146)
- **Revit code-generation reliability:** 33–79% success and 48.3% of failures from API misuse (section 1) — [MDPI Buildings](https://www.mdpi.com/2075-5309/16/21/4183); [arXiv 2605.01698](https://arxiv.org/pdf/2605.01698); [arXiv 2506.20551](https://arxiv.org/pdf/2506.20551)
- **Rules-to-massing:** the CAADRIA 2026 LLM zoning and massing prototype (section 4) — [CAADRIA 2026](https://papers.cumincad.org/data/works/att/caadria2026_392.pdf)

**Commercial tools (status Oct 2026; prices vary between sources, so get quotes)**

| Tool | What it generates | Export / integration | Pricing (as found) | Sources |
|---|---|---|---|---|
| **Autodesk Forma** (Site Design, Building Design) | Site context (terrain, OSM buildings, roads), massing and analyses; Building Design does schematic design and sends a geolocated native model to Revit | Add-in "Send to Autodesk Revit" for Revit 2025/2026 (terrain, buildings); Revit 2027+ is a "Forma Connected Client" sharing one data environment | Site Design "from USD 59/month" (Autodesk) vs about USD 185/month in a review; included in the AEC Collection (from USD 307/month); Building Design is in the AEC Collection, Revit subscriptions and the Forma for Buildings bundle | [Autodesk Forma Site Design](https://www.autodesk.com/products/forma-site-design/overview); [Forma add-in for Revit](https://marketplace.autodesk.com/apps/4fb0800c-4ad1-4d29-84be-9c2b1c3b0321); [Forma Building Design blog, Apr 2026](https://blogs.autodesk.com/forma/2026/04/07/introduction-to-forma-building-design/); [AEC Collection](https://www.autodesk.com/collections/architecture-engineering-construction/architects); [illustrarch review](https://illustrarch.com/articles/design-softwares/73363-autodesk-forma-review.html) |
| **Snaptrude** | Browser BIM; AI agents for massing and a "zoning-checked" model (vendor claim) | Native IFC 2x3 / IFC4; basic Revit export on all plans; .rvt import up to 150 MB | Inconsistent vendor pages: Free / Individual USD 60/month / Org USD 100 per user per month, vs "Professional USD 499 / Organization USD 1,199" | [Snaptrude vs Revit](https://www.snaptrude.com/vs/revit); [Snaptrude pricing blog 2026](https://www.snaptrude.com/blog/bim-software-pricing-compared-2026-per-seat-floating-per-project-and-no-contract-plans) |
| **Hypar** | Since 2.0: space planning and test-fit (moved away from its earlier text-to-BIM work [older: about 2025]) | Export to PDF, image, Excel, Revit, Rhino; IFC unconfirmed in 2026 | USD 100 per user per month or USD 1,000 per year (checked Sept 2026) | [ArchPulse](https://www.archpulse.co/tool/hypar); [Hypar docs](https://docs.hypar.io/); [AECplusTech](https://www.aecplustech.com/tools/hypar); [AEC Magazine, older](https://aecmag.com/ai/hypar-text-to-bim-and-beyond/) |
| **Arcol** | Browser massing and early BIM | Revit export (beta, paid plans only) via a .arcol file and a Revit add-in on request; site context arrives as DirectShape, other context as mass, buildings as levels, floors, ceilings and generic walls | Not published in the results | [Arcol help: Exporting to Revit](https://intercom.help/arcol/en/articles/10448031-exporting-to-revit); [Architosh AIA25](https://architosh.com/2025/07/aia25-arcol-makes-big-splash-at-aia-national-boston/) |
| **TestFit** | Site feasibility, parking and unit layouts | Integrations: AutoCAD, Excel, Revit, SketchUp; no public API | Mostly unpublished: from USD 1,500 per user per year (Capterra); Urban Planner USD 400/month; Site Solver from USD 10,000/year | [Capterra](https://www.capterra.com/p/232707/TestFit/); [BIM Tools Hub](https://bimtoolshub.com/testfit) |
| **Finch3D** | Generative floor plans and massing | Live link with Revit 2023/24; BIM export on Enterprise only | Basic EUR 49 or EUR 79/month (conflicting); Enterprise about EUR 1,000/month for 3 seats vs EUR 4,833/month (conflicting) | [Nomic comparison](https://www.nomic.ai/compare/finch3d-alternatives); [illustrarch Finch review](https://illustrarch.com/articles/75056-finch3d-review.html); [Hektar comparison 2026](https://www.hektar.ai/post/comparing-early-stage-feasibility-tools-2026-forma-giraffe-finch-testfit-hektar) |
| **Maket** | AI residential floor plans (2D) | DXF / PDF / JPEG (DWG in one help article); no 3D BIM or IFC found | Free tier; Premium about USD 29–30/month; 50 trial credits | [Maket pricing](https://maket.ai/pricing); [Maket help: export](https://intercom.help/maket-ai/en/articles/13578205-how-do-i-download-export-my-files); [archaitool 2026](https://archaitool.pages.dev/blog/maket-ai-pricing-2026-plans-limits-best-fit) |
| **ArchiLabs** | AI agent and automation inside Revit and AutoCAD; Studio for data-centre layouts | Works in the native Revit model | Desktop from USD 19/month plus usage credits; Studio from USD 299/month; a review scores it 6.7/10 | [archilabs.ai](https://archilabs.ai/); [Zekai review](https://zekaiwork.com/ai-tools/archilabs/) |
| **Swapp** | Construction documents from trained firm standards; agent "Frank" reads and writes the live Revit and Archicad model (dimensions, tags, sheets, schedules) | Native Revit / Archicad | Not published; USD 11.5M Series A | [Swapp Series A](https://swapp.ai/news/swapp-raises-11-5-million-series-a-to-help-architects-with-ai-platform/); [AEC Magazine](https://aecmag.com/ai/swapp-the-algorithmic-assistant); [swapp.ai llms.txt](https://swapp.ai/llms.txt) |
| **Qonic** | Cloud IFC/openBIM modelling and editing; AI IFC classification (98% accuracy, 100+ classes; openBIM Awards 2025); native drawing generation (Apr 2026) | IFC-native | Not published | [buildingSMART](https://www.buildingsmart.org/ai-powered-openbim-classification/); [pulse.bot / AEC Mag](https://www.pulse.bot/construction/news/qonic-introduces-native-drawing-generation-c2ced9b2-8e96-4eb6-8778-175f64babf4b/); [BIM Pure](https://www.bimpure.com/blog/inside-qonic-with-aaron-perry-bim-pure-live-114) |
| **Motif** | Ex-Autodesk founders (Hanspal, Mathews); a collaboration platform (Mar 2025), then an "agent-native BIM authoring platform" (launch date not confirmed) | Streams Revit / Rhino models (third-party description) | Not published; USD 46M seed plus Series A (CapitalG, Redpoint) | [TechCrunch 2025](https://techcrunch.com/2025/01/30/ex-autodesk-execs-snag-46m-to-build-the-next-gen-of-architecture-design); [BusinessWire Mar 2025](https://www.businesswire.com/news/home/20250326740027/en); [AEC Magazine: Inside Motif](https://aecmag.com/bim/inside-motif-the-agent-native-bim-platform/) |

### Inferences
- The closest off-the-shelf match is **Forma**: site, massing, then a geolocated Revit model. For Czech plots, however, it needs DMR 5G imported as terrain, and its envelope has no Czech regulation logic.
- **Snaptrude, Arcol and Finch** produce better-looking massing but are generic, and their Revit or IFC export is gated on paid tiers or in beta.
- The gap a Czech product can fill is **"Czech data + Czech rules → georeferenced IFC/RVT starter model"**, which none of the tools offers.
- Research results support a **tool-calling or rule-checking architecture** (Text2BIM-style generation plus a checker loop) over GUI agents (BIMgent) or unconstrained code generation.

### Gaps
- Arcol, Qonic, Motif and Swapp pricing is not public in the results. The Motif BIM authoring launch date and its export formats are unconfirmed.
- No independent benchmark compares these commercial tools on residential (family house) massing quality.
- Whether Snaptrude, Arcol or Finch handle S-JTSK / EPSG:5514 georeferencing was not found.

---

## 6. Czech BIM requirements, and whether a generated IFC model can be used in permitting documentation

### Takeaway
The BIM law (zákon 330/2025 Sb.) applies from 1 January 2027 and only to above-threshold public works contracts (roughly 135 million CZK and up), not to private family houses. The Data Standard for Construction (Datový standard staveb, DSS, run by ČAS) published a "minimum DSS for permitting and occupancy approval" in April 2026, but for practical testing and feedback.

The building-administration IT systems (Portál stavebníka and the Evidence elektronických dokumentací, EED, the register of electronic documentation) accept drawings and documents as PDF/A-3 and a building information model as **IFC 4 or higher** (vyhláška 190/2024 Sb.). Permitting documentation (DPZ) for a family house must still be prepared and signed by an authorised designer. A generated LOD 100–200 IFC can therefore serve only as a *starting point* or an *attachment adopted by the architect*, never as the documentation itself.

### Cited Findings
- **BIM law, zákon 330/2025 Sb.:**
  - Basic effect from **1 January 2027**, with some parts delayed. It covers the state, regions, state enterprises, state contributory organisations and similar bodies, for buildings recorded in the cadastre or in a regional digital technical map. It was prepared by MPO with ČAS — [ČAS: Zákon o BIM](https://agenturacas.gov.cz/zakon-o-bim-zakladni-legislativni-krok-zavrsen/); [Koncepce BIM news](https://koncepcebim.gov.cz/novy-zakon-zrychli-vystavbu-a-snizi-naklady-poslanecka-snemovna-dala-zelenou-digitalizaci-staveb/)
  - The threshold is about 135 million CZK (one source says above 135,348,000 CZK). Check the current threshold after the 2026 changes — [Accace](https://accace.cz/bim-povinne-pro-velke-verejne-stavby/); [CADBIM](https://cadbim.cz/novy-zakon-o-bim-prehled-zmen-dopadu-a-povinnosti/)
  - One source says implementing DiMS (the digital model of a building) becomes mandatory from 1 January 2030 (unverified) — [CADBIM](https://cadbim.cz/novy-zakon-o-bim-prehled-zmen-dopadu-a-povinnosti/)
- **DSS:**
  - The architecture document is version 0.9, dated December 2025 and posted 12 February 2026. The final version comes after pilot verification — [DSS architecture PDF](https://koncepcebim.gov.cz/wp-content/uploads/2026/02/architektura-datoveho-standardu-staveb-a-prilohy.pdf)
  - Timeline: the user interface launched in January 2026; the minimum DSS for permitting and occupancy approval came in April 2026; the minimum DSS for construction execution in July 2026; the implementing decree and a handover/operations DSS follow in the second half of 2026 — [Koncepce BIM: ČAS rozšířila DSS](https://koncepcebim.gov.cz/cas-rozsirila-datovy-standard-stavby-a-dokoncila-dalsi-milnik-zavadeni-bim-v-cesku/); [Koncepce BIM: minimální DSS pro povolení a kolaudaci](https://koncepcebim.gov.cz/zverejneni-minimalniho-datoveho-standardu-stavby-pro-povoleni-a-kolaudaci-staveb-pro-prakticke-overeni-a-zpetnou-vazbu/)
  - DSS data templates can be viewed and exported as XLS or **IFC** at dss.koncepcebim.gov.cz — [Koncepce BIM: DSS on-line](https://koncepcebim.gov.cz/dss-on-line-dalsi-krok-ke-spolecnemu-digitalnimu-jazyku/)
- **Vyhláška 190/2024 Sb. (effective 1 July 2024):**
  - Electronic drawings and other documents go into the EED as **PDF/A-3**.
  - "Informační model stavby" (the building information model) goes into the building-administration IT systems as **IFC version 4 or higher**.
  - [zakonyprolidi 190/2024](https://www.zakonyprolidi.cz/cs/2024-190); [sagit 190/2024](https://sagit.cz/_texty/sb24190.htm)
- **MMR guidance:**
  - Under the building act (283/2021) and § 7 of decree 190/2024, the applicant uploads permit documentation or project documentation into the EED through the portal or its data interface — [MMR FAQ: Dokumentace](https://mmr.gov.cz/cs/caste-dotazy/digitalizace-stavebniho-rizeni-v-cr-portal-stavebn/dokumentace)
  - The July 2024 methodology says execution-phase documentation is not uploaded — [MMR methodology](https://mmr.gov.cz/cs/ministerstvo/stavebni-pravo/pravo-a-legislativa/novy-stavebni-zakon/metodiky/dokumentace-pro-povoleni-zameru-a-jeji-forma-pro-v)
- **Family-house permit documentation:** prepared by an authorised designer and submitted electronically, with each PDF electronically signed by an authorised person (architect or engineer). The content follows vyhláška 131/2024 Sb., parts A–D plus the supporting documents — [ČESKÉSTAVBY.cz 2026](https://www.ceskestavby.cz/jak-se-stavi-dum/projekt-domu-5087.html)
- **After the permit:** once it becomes final, the building authority verifies the digital documentation and makes it available on the Portál stavebníka — [ČKAIT](https://www.ckait.cz/ckait-vita-portal-stavebnika-a-ocekava-ze-projektanti-ho-budou-moci-otestovat)

### Inferences
- For a private family house, an IFC model is **optional**. The mandatory BIM scope is public above-threshold contracts. If an architect attaches a model, it must be IFC4+, which matches an IFC4 output from IfcOpenShell or Revit or Archicad export.
- A generated LOD 100–200 model **cannot be used as permitting documentation (DPZ) by itself**:
  - The DPZ requires authorised-person responsibility, drawings and reports under vyhláška 131/2024, and a level of detail beyond massing.
  - Its realistic use is as the architect's starting model: imported into Archicad or Revit, verified and developed.
  - It can also serve as an illustrative attachment for client or early pre-application consultations with authorities.
  - The product should say so explicitly.
- **DSS alignment:** tag elements with DSS-compatible property sets where cheap, for example the classification and identifiers from the "minimum DSS for permitting" templates. This is future-proofing only; nothing mandates it for family houses.

### Gaps
- Whether the April 2026 "minimum DSS for permitting" sets a required LOD/LOIN or IFC Model View Definition was not found.
- No guidance was found on whether building authorities in practice accept or ignore IFC attachments for family houses.
- The current statutory above-threshold limit for 2026 should be checked in the regulation.

---

## 7. MVP after the automated plot report: costs, licensing, effort, risks, and a recommended pipeline (Revit vs IFC/open source)

### Takeaway
**Recommended MVP: an IFC-first, open-source pipeline.** Python, IfcOpenShell (LGPL), PDAL/LAZ processing and Shapely rules run headlessly on Linux and produce georeferenced IFC4 plus a web preview (That Open / web-ifc). It needs no BIM licence for the service itself, and every Czech architect's tool can read the output.

Add a **Revit-native output later** through APS Design Automation, at about 2 Flex tokens per processing hour after the free allowance. Running desktop Revit on servers or through MCP is not suitable for unattended production.

The LLM's job is parameter extraction, choosing variants and explaining results. Geometry should come from deterministic tested code with a rule checker. An architect has to finish the design.

### Cited Findings
**Licences and prices (status 2026; verify locally)**
- **Revit:** about USD 380/month or USD 3,005/year — [Renderahouse](https://www.renderahouse.com/blog/revit-pricing). An enterprise guide cites a USD 2,915/year list price for a named user — [Autodesk audits guide](https://autodesksaudits.com/blog/revit-cost-2026-pricing-guide/)
  - A Czech reseller lists "Revit 2026, 1 device, 1 year" at 2,399 CZK. This is implausibly low and likely a different licence type; verify before using — [bomshop.cz](https://www.bomshop.cz/c/250/revit)
- **AEC Collection:** from USD 307/month — [Autodesk](https://www.autodesk.com/collections/architecture-engineering-construction/architects). **Forma Site Design:** from USD 59/month — [Autodesk](https://www.autodesk.com/products/forma-site-design/overview)
- **Archicad:** Studio about USD 2,414/year and Collaborate about USD 2,840/year, annual prepaid excluding tax; MCP requires Collaborate or Max — [MyArchitectAI](https://www.myarchitectai.com/blog/archicad-pricing); [Graphisoft AI Solutions](https://www.graphisoft.com/en-us/plans-and-products/ai-solutions/)
- **APS Design Automation:** 2 Flex tokens per processing hour; Free tier with monthly caps for rated APIs; tokens expire after 12 months; about USD 3 per token list [older SRP] — [APS Flex pricing](https://aps.autodesk.com/pricing-flex-tokens); [APS business model](https://aps.autodesk.com/blog/aps-business-model-evolution); [Redress Compliance](https://redresscompliance.com/autodesk-flex-token-pricing-guide)
- **Autodesk terms of use:**
  - A web-service subscription "does not grant to You a license to the underlying Software used in providing the Web Service".
  - API access is "for Your own authorized internal use" and may not be disclosed to third parties beyond the documentation.
  - Network licence servers are allowed on a LAN.
  - I found nothing explicit on running desktop Revit as a server for third parties.
  - [Autodesk Terms of Use](https://www.autodesk.com/company/terms-of-use/en/offering-types-and-benefits); [Autodesk Special Terms](https://www.autodesk.com/company/terms-of-use/en/special-terms)
- **Open source:** IfcOpenShell is LGPL-3.0-or-later; Bonsai is GPL-3.0-or-later — [IfcOpenShell README](https://github.com/aothms/IfcOpenShell)
- **Tooling for the Revit route:** a Design Automation local debug tool runs DA plugins on a local Revit, so development still needs a desktop Revit seat — [GitHub: DA Revit local debug tool](https://github.com/Autodesk-Forge/design.automation-csharp-revit.local.debug.tool)
- **Speckle** (optional transport): Team about USD 99/month (conflicting listings) — [BIM Tools Hub](https://bimtoolshub.com/speckle)
- **Quality evidence for the risk register:**
  - API misuse caused 48.3% of LLM failures in Revit tasks — [MDPI Buildings](https://www.mdpi.com/2075-5309/16/21/4183)
  - End-to-end agent modelling success is 32% — [BIMgent](https://arxiv.org/html/2506.07217v2)
  - Rule-checked generation passes about 99% of rules on simple buildings — [Text2BIM review](https://themoonlight.io/review/text2bim-generating-building-models-using-a-large-language-model-based-multi-agent-framework)
  - MCP connections drop on large operations — [revit-mcp-case-study](https://github.com/meet-rehman/revit-mcp-case-study)
- **Data risks:**
  - DMP 1G and the original DMR 5G scan date from 2009–2013 — [ČÚZK DMP 1G](https://geoportal.cuzk.cz/(S(jfzih3jrytd1de2iixywkyvt))/Default.aspx?mode=TextMeta&side=vyskopis&metadataID=CZ-CUZK-DMP1G-V&head_tab=sekce-02-gp&menu=303)
  - RÚIAN floor counts mix above- and below-ground floors — [ČÚZK VFR](https://cuzk.gov.cz/ruian/Poskytovani-udaju-ISUI-RUIAN-VDP/Vymenny-format-RUIAN-(VFR)/DL058RR2-v5-0-Struktura-a-popis-VFR_final.aspx)
  - Revit IFC import may ignore IfcMapConversion [older] — [IfcGeoRef](https://github.com/dd-bim/IfcGeoRef/blob/master/Documentation_v3.md)
  - The official Revit and Archicad MCP and AI features are Tech Preview or beta — [Autodesk MCP help](https://help.autodesk.com/view/ADSKMCP/ENU/?guid=ADSKMCP_RevitMcp_revit_mcp_server_html); [AEC Magazine on Archicad 30](https://aecmag.com/bim/graphisoft-unveils-archicad-30-and-shares-ai-roadmap/)

### Inferences

**Recommended pipeline, from the automated plot report (rešerše pozemku) to a basic BIM model**

0. **Input contract.** The plot report emits a `site_context.json`:
   - parcel IDs and the cadastral-area code, with the parcel polygon in EPSG:5514;
   - neighbouring parcels and which boundaries face public space;
   - zoning-plan zone and *structured* regulatives (maximum height or floors, site-coverage coefficient, building line if any), each with a source citation and a "verified by human" flag;
   - protection zones as 2D polygons;
   - the client brief (floors, approximate floor area, roof preference).
1. **Geodata fetch and preparation** (Python with PDAL/laspy, GDAL, Shapely):
   - DMR 5G LAZ sheets covering a 30–100 m buffer, thinned to a TIN (no more than about 5k points);
   - RÚIAN building polygons in the buffer;
   - DMP 1G heights for those footprints (DMP minus DMR, a robust percentile), with a fallback of floors × 3 m;
   - in Prague, the IPR CityGML instead;
   - the orthophoto tile for texture or preview.
2. **Rules engine (deterministic):**
   - envelope polygon = parcel buffered by −2 m on non-public boundaries (vyhláška 146/2024 § 11), intersected with any building-line and protection-zone exclusions;
   - height cap from the zoning plan, giving an envelope solid;
   - maximum footprint = site-coverage coefficient × parcel area;
   - every applied rule logged with its source, for explainability.
3. **Massing generator (deterministic and parametric):** 1–3 variants (rectangle or L-shape, 1–2 floors plus an optional basement, gable or flat roof) that fit the envelope and footprint limits. The ground-floor level is set from the terrain at the footprint, for example the mean or the downhill edge.
4. **LLM agent layer (orchestration only):**
   - extract and normalise the zoning-plan text into regulatives, then show them for human confirmation;
   - map the brief to massing parameters and choose variants;
   - run the checker and explain any violations;
   - write the summary.
   - It calls typed tools (`build_site`, `compute_envelope`, `generate_massing`, `check_rules`, `export_ifc`) and never writes raw geometry or API code at run time.
5. **IFC writer (IfcOpenShell):**
   - IFC4 (or IFC4X3) with IfcProject, IfcSite, IfcBuilding and IfcBuildingStorey;
   - terrain as `IfcGeographicElement` with a TIN;
   - the parcel as annotation or footprint;
   - neighbours as LOD1 `IfcBuildingElementProxy`;
   - the envelope as a translucent proxy or `IfcSpatialZone`;
   - the house as LOD 200 `IfcWall`, `IfcSlab` and `IfcRoof`;
   - `IfcProjectedCRS` "EPSG:5514" plus `IfcMapConversion` (Bpv OrthogonalHeight);
   - property sets for source and quality, and optionally DSS-aligned properties.
6. **Validation:** geometry and rule re-check, plus an IfcOpenShell schema check and an optional georeferencing check (ifcgref). Then a web preview (That Open / web-ifc viewer) and a PDF or HTML summary of the metrics.
7. **Hand-off:**
   - Download the IFC for Archicad or Revit (link or open).
   - *Phase 2:* a Revit-native .rvt through APS Design Automation. A C# app bundle reads the same JSON and creates Levels, a Toposolid (curve-loop overload), Walls, `Floor.Create` floors, `NewFootPrintRoof` roofs and the Survey Point. It saves the .rvt and exports IFC.
   - *Phase 3:* optional "finish with AI" inside the architect's desktop through MCP (Autodesk Revit MCP Write tier, or Archicad 30 MCP or Tapir). This is the architect's own session and licence.

**Comparison of routes for the MVP**

| Criterion | A: IFC-first, open source (recommended) | B: Revit via APS Design Automation | C: Desktop Revit/Archicad + MCP agent |
|---|---|---|---|
| Runs unattended in the cloud | Yes (Linux container) | Yes (Autodesk cloud) | No (needs a running desktop session and an open project) |
| Licences for the service | None for the core (LGPL; keep GPL Bonsai out of the server) | APS Paid tier after the Free caps; one Revit seat for development | The user's own Revit or Archicad (Archicad MCP: Collaborate or Max) |
| Marginal cost per model | Compute only (small) | About 0.17–0.33 tokens for a 5–10 minute job (about USD 0.5–1 list) | The user's time plus LLM tokens |
| Output | IFC4/IFC4X3 (all tools), web preview | Native .rvt + IFC | Native in the user's tool |
| Fit for Czech architects | High (Archicad and Revit both read IFC) | Revit users only | High for the interactive "finish" step |
| Maturity / risk | Mature libraries; roof geometry must be hand-coded | Mature service; .NET and engine version churn; rated-API pricing changes | Tech Preview or community; connection drops; design quality varies |

**Effort (rough estimate, single experienced Python/GIS developer; to verify)**
- Route A MVP: about 6–10 person-weeks:
  - geodata ingestion and TIN, about 1.5–2 weeks;
  - rules engine and massing, about 2–3 weeks;
  - IFC writer with georeferencing, about 1.5–2 weeks;
  - viewer, validation and agent tools, about 1–2 weeks.
- Route B adds about 4–6 person-weeks: a C# add-in, APS auth and app bundle, DA testing per engine version, and georeferencing parity with IFC.

**Running costs (estimate)**
- Route A: a small container or VM plus LLM API usage. A tool-calling agent run with tens of calls is likely cents to a few USD; check the chosen provider's current prices.
- Route B adds APS tokens, roughly USD 3 per token list with volume discounts, plus at least one Revit subscription for development, about USD 3,000/year.

**Key risks and mitigations**
1. **Wrong envelope from misread regulatives.** Mitigate with human confirmation of extracted regulatives, rule-by-rule provenance, and labelling the envelope as indicative.
2. **Stale or incorrect neighbour heights** (DMP from 2009–2013; RÚIAN floors mixed). Mitigate with cross-checks, a confidence flag and a manual override in the UI.
3. **Georeferencing errors** (5514 vs 5513 sign and axes, Revit ignoring IfcMapConversion). Mitigate with automated round-trip tests in Revit, Archicad and BlenderBIM using a known control point.
4. **LLM-generated geometry errors.** Mitigate by keeping geometry deterministic and running a rule checker after every generation (the Text2BIM pattern).
5. **Liability and expectations.** Clear disclaimers: not permitting documentation; the authorised architect develops it.
6. **Vendor churn** (Tech Preview MCP, APS pricing changes, .NET 10). Keep the core vendor-neutral (IFC) and treat native-tool integrations as adapters.

### Gaps
- No numeric APS Free-tier caps were found, and no current EUR/CZK prices for Revit, Archicad or APS tokens. A Czech reseller quote is needed.
- No explicit Autodesk licence clause was found on running desktop Revit unattended on servers for third parties. Get a legal review before any self-hosted Revit automation.
- No public benchmark covers end-to-end "plot data → envelope → massing" quality for residential projects, so effort and quality figures above are judgement, not measured.
- LLM API pricing was not researched here. Verify with the chosen provider.
