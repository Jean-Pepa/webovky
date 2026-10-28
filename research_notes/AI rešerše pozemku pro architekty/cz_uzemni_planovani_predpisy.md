# Czech spatial-planning documents and building rules for a plot: where the binding rules are, and how machine-readable they are (state as of 28 Oct 2026)

> **Research conditions (read first).** This session ran 17 web searches before the shared per-turn search budget was exhausted. Direct page fetches were blocked for every key host tried: WebFetch failed on DNS, and the egress proxy returned HTTP 403 for mmr.gov.cz, uur.cz, uzemniplanovani.gov.cz, e-sbirka.cz, zakonyprolidi.cz, pravniprostor.cz, ceska-justice.cz and krajta.slv.cz. **Every "Cited Finding" below therefore comes from search-engine summaries or snippets of the linked pages. None of the pages was read in full.** I could not check the paragraph-level wording of the decrees (146/2024, 157/2024, 457/2025). Statements that rest on the researcher's prior knowledge are marked **[unverified – prior knowledge]** and appear only under Gaps or Inferences. When a search summary drew on several pages without saying which, all candidate pages are cited and the citation is flagged.

## 1. Územní plány (ÚP): coverage, where they are published, jednotný standard, regional mosaics, content of the textová část

### Takeaway
Valid municipal ÚPD covers almost all of Czechia: 96.71 % of the territory at 31 Dec 2023, per ÚÚR. Even so, in Oct 2026 there is still no single authoritative, machine-readable national layer of ÚP plochy.

The "jednotný standard" (JS) has been mandatory for newly procured ÚPs since 1 Jan 2023. It was introduced by vyhl. č. 418/2022 Sb., which amended 500/2006 Sb. It is now set by **vyhl. č. 157/2024 Sb.**, as amended by **vyhl. č. 457/2025 Sb.** (in force 1 Jan 2026). The stavební zákon sets **no deadline** for converting existing ÚPs. Conversion is triggered only by a new ÚP or by the next change of an existing one. Mandatory use of the Národní geoportál územního plánování (NGÚP) is being postponed by one year, to 30 Jun 2027. I found no published count of ÚPs in JS, or of ÚPs available only as PDF or raster.

### Cited Findings
**Coverage and the official evidence**
- ÚÚR's Ročenka 2023 is the 24th edition. Its data are as of 31 Dec 2023, i.e. before the new act's rules applied to the evidence. It states that valid municipal ÚPD covers **96.71 % of the territory of ČR**. This is a share of area, not a count of municipalities. — [ÚÚR, Evidence územně plánovací činnosti – ročenka 2023](https://www.uur.cz/media/i4zbs3ds/evidence_územně_plánovací_činnosti_ročenka_2023.pdf)
- ÚÚR keeps the evidence of územně plánovací činnost on behalf of MMR. The yearbook has appeared since 2001, and annually since 2005. The 2023 edition points to an online export tool at eupc.uur.cz. — [ÚÚR ročenka 2023](https://www.uur.cz/media/i4zbs3ds/evidence_územně_plánovací_činnosti_ročenka_2023.pdf)
- In 2022 the legacy iLAS/iKAS applications were replaced. The new "Evidence územně plánovací činnosti" system went live in September 2022. The 2022 and 2020 yearbooks contain tables of municipalities with valid ÚPD and with ÚP under 183/2006, but the numbers were not visible in the snippets. — [ÚÚR ročenka 2022](https://www.uur.cz/media/xjkfcdpl/evidence_územně_plánovací_činnosti_ročenka_2022.pdf)
- Historical comparator: on 30 Jun 2012, 1,931 municipalities had a valid ÚP under 183/2006 and 4,372 did not. — an ÚÚR document surfaced by search, exact file not verified: [ÚÚR 02_stav](https://www.uur.cz/media/msenhqym/02_stav.pdf) / [ÚÚR 14_vyvoj-uzemne](https://www.uur.cz/media/hoklwhsk/14_vyvoj-uzemne.pdf)
- No Ročenka for 2024 or 2025 surfaced. ÚÚR's annual report (výroční zpráva) for 2025 exists. — [ÚÚR výroční zpráva 2025](https://www.uur.cz/media/w5ilj554/vyrocni-zprava-uur-2025-celek.pdf)

**Where ÚPs are published (all channels run in parallel)**
- **NGÚP** (uzemniplanovani.gov.cz) is the official information system for územní plánování. A 2021 MMR presentation describes it as three things: an agenda system for planning authorities, the place where planning outputs are published, and a source of data on the territory. The competent planning authority enters the data. — [ÚÚR: Vrbová, Národní geoportál územního plánování](https://www.uur.cz/media/cwvje4gj/15up-1-10-vrbová_národní-geoportál-územního-plánování.pdf); [ÚÚR 02-územní plánování](https://www.uur.cz/media/digjklfn/02-územniplanov.pdf); [NGÚP home (EN)](https://uzemniplanovani.gov.cz/en/)
- NGÚP has a public map viewer with a user manual; per the search summary, version 2.0 is dated 5 Feb 2025. — [NGÚP – příručka mapová prohlížečka](https://uzemniplanovani.gov.cz/documents/d/guest/prirucka_mapova_prohlizecka); [NGÚP portál – příručka v1.2](https://uzemniplanovani.gov.cz/documents/d/guest/ngup_portal_v1-2)
- In 2025 NGÚP published a **control tool for ÚPs in JS delivered as DXF**. — [Portál ÚP Kraje Vysočina – aktuality](https://pupo.kr-vysocina.cz/aktuality). An MMR document on ETL checks, dated 27 Sep 2024, is hosted on NGÚP. — [NGÚP: mmr-66819_2024_81 kontrola ETL](https://uzemniplanovani.gov.cz/documents/d/guest/mmr-66819_2024_81_kontrola-etl-2024-09-27)
- The technical specification for implementing NGÚP is published in the Registr smluv. — [smlouvy.gov.cz – NGÚP technická specifikace](https://smlouvy.gov.cz/smlouva/soubor/35376356/Smlouva_Implementace_P1_Technick%C3%A1%20specifikace.pdf)
- In spring 2026 NGÚP was described as "functional, but some key parts not fully tested". Some functions, including uploading ÚAP and user notifications, did not yet fully work, and mandatory use was postponed as a result (see §5). — [Právní prostor](https://www.pravniprostor.cz/aktuality/odklad-povinneho-pouzivani-geoportalu-uzemniho-planovani-vlada-schvalila); [archiweb](https://www.archiweb.cz/n/domaci/odklad-povinneho-pouzivani-geoportalu-uzemniho-planovani-vlada-schvalila); [TZB-info](https://stavba.tzb-info.cz/134478-odklad-povinneho-pouzivani-geoportalu-uzemniho-planovani-vlada-v-pondeli-schvalila)
- The **Informační web územního plánování** (IWÚP, portal.uur.cz, formerly "Portál územního plánování") is a separate ÚÚR link directory, not NGÚP. It has a section "ÚPD a ÚPP obcí", a municipality list and a "Digitalizace, GIS a data" page. — [ÚÚR – IWÚP](https://www.uur.cz/uzemni-planovani/informacni-web-uzemniho-planovani/); [IWÚP – ÚPD a ÚPP obcí](https://portal.uur.cz/nastroje-uzemniho-planovani-v-ceske-republice/upd-a-upp-obci.asp); [IWÚP – obce](https://portal.uur.cz/spravni-usporadani-cr-organy-uzemniho-planovani/obce.asp); [IWÚP – digitalizace, GIS, data](https://portal.uur.cz/obecne-informace-o-uzemi/digitalizace-geograficke-informacni-systemy-data.asp)
- Regional ÚP portals that surfaced:
  - Kraj Vysočina: "Portál územního plánování", with a list of documentations. — [pupo.kr-vysocina.cz – seznam dokumentací](https://pupo.kr-vysocina.cz/napoveda/o-portalu/UP)
  - Zlínský kraj: "Územní plány obcí Zlínského kraje". — [zlinskykraj.cz](https://zlinskykraj.cz/uzemni-plany-obci-zlinskeho-kraje)
  - Moravskoslezský kraj: "Územní plány obcí (aplikace)". — [msk.cz](https://www.msk.cz/cs/temata/mapy/uzemni-plany-obci-aplikace-432/)
  - Plzeňský kraj: its geoportal hosts the MMR metodický pokyn "Standard vybraných částí územního plánu". — [geoportal.plzensky-kraj.cz](https://geoportal.plzensky-kraj.cz/portal/metodicky-pokyn-standard-vybranych-casti-uzemniho-planu)
  - Karlovarský kraj: methodical meeting on ÚP digitalization, June 2024. — [kr-karlovarsky.cz](https://kr-karlovarsky.cz/system/files/2024-06/24%2006%2020%20Metodick%C3%A1%20porada%20%C3%9AP%20-%2006%20-%20Digitalizace_L%C5%A0_w.pdf)

**Jednotný standard (JS): legal basis, decree numbers and "deadlines"**
- Under the old act, the statutory basis was **§ 20a zákona č. 183/2006 Sb.** The detailed JS requirements took effect on **1 Jan 2023** through **vyhláška č. 418/2022 Sb.**, which amended vyhl. 500/2006 Sb. Its transitional provisions set out when JS must be used. — [MMR – odůvodnění vyhl. 418/2022](https://mmr.cz/getmedia/e16a05b7-089d-4b2c-9791-59af4bfb9ff6/Vyhlaska-418-2022-oduvodneni.pdf.aspx?ext=.pdf); [MMR – normativní text vyhl. 418/2022](https://mmr.cz/getmedia/40086c13-b859-4057-a71d-a35d3cf9c7e6/Vyhlaska-418-2022-normativni-text.pdf.aspx?ext=.pdf); [ÚÚR 01-úvod (1. 1. 2025)](https://www.uur.cz/media/kasgtjih/01-uvod-01012025-final.pdf)
- MMR's Q&A sets out how the JS obligation works:
  - ÚPs procured from 1 Jan 2023 must be in JS.
  - An older ÚP must be brought fully into JS at its first change whose pořizování started after the end of 2022.
  - **The stavební zákon sets no deadline by which a municipality must convert an existing ÚP.** The municipality may convert it on its own or together with the next substantive change.
  - Any conflict with superior ÚPD (§ 54(6)) must be resolved at the same time as the conversion.
  — [MMR: Standard ÚP – vybrané otázky a odpovědi (2023-01-04)](https://mmr.gov.cz/getmedia/15b3a9f3-9d35-4346-8299-803cad52113e/Standard-UP-vybrane-otazky-a-odpovedi-2023-01-04.pdf.aspx?ext=.pdf); [Kraj Vysočina copy (2023-01-25)](https://pupo.kr-vysocina.cz/media/Standardizace/06-standard-up-vybrane-otazky-a-odpovedi-2023-01-25.pdf); [MMR web: Jednotný standard územního plánu (283/2021)](https://mmr.gov.cz/cs/ministerstvo/stavebni-pravo/stanoviska-a-metodiky/uzemni-planovani/9-zakon-c-283-2021-sb/jednotny-standard-uzemniho-planu); [MMR web: Jednotný standard ÚPD (stanovisko)](https://mmr.gov.cz/cs/ministerstvo/stavebni-pravo/stanoviska-a-metodiky/stanoviska-odboru-uzemniho-planovani-mmr/2-uzemne-planovaci-dokumentace-a-jejich-zmeny/jednotny-standard-uzemne-planovaci-dokumentace)
- Under the new act, JS is set by **vyhláška č. 157/2024 Sb. o územně analytických podkladech, územně plánovací dokumentaci a jednotném standardu**. It was approved 10 Jun 2024 and took effect **1 Jul 2024**. It defines the content of JS and the vymezení zastavěného území, and it sets **format requirements for machine-readable územní studie**. — [TZB-info – vyhl. 157/2024](https://www.tzb-info.cz/pravni-predpisy/vyhlaska-c-157-2024-sb-o-uzemne-analytickych-podkladech-uzemne-planovaci-dokumentaci-a-jednotnem-standardu); [Právní prostor](https://www.pravniprostor.cz/zmeny-v-legislative/vyslo-ve-sbirce-zakonu/vyhlaska-o-uzemne-analytickych-podkladech-uzemne-planovaci-dokumentaci-jednotnem-standardu); [epravo – Sb. 157/2024](https://www.epravo.cz/top/zakony/sbirka-zakonu/sb/2024/157)
- 157/2024 was amended by **vyhláška č. 457/2025 Sb.**, in force **1 Jan 2026**. In the amended text, "požadavky na strukturu standardizovaných jevů územního plánu jsou stanoveny v příloze č. 10". — [epravo – Sb. 457/2025](https://www.epravo.cz/top/zakony/sbirka-zakonu/sb/2025/457); [MMR – 157/2024 ve znění od 1. 1. 2026](https://mmr.gov.cz/getmedia/be18d7d9-6314-43af-9951-648f452fff70/157_2024-Sb-_1-1-2026_aktualni_zmeny_e-sbirka.pdf.aspx?ext=.pdf); [Právní prostor – novela vyhlášky o ÚPD](https://pravniprostor.cz/zmeny-v-legislative/vyslo-ve-sbirce-zakonu/novela-vyhlasky-o-uzemne-planovaci-dokumentaci)
- On **30 Jan 2026** ÚÚR updated the JS catalogues, model data structures and styles to match the amendment. MMR intends to standardize all ÚPD, but **detailed JS requirements currently exist only for ÚP**. — [ÚÚR – Standardizace územního plánování](https://www.uur.cz/uzemni-planovani/standardizace-uzemniho-planovani/)
- Transitional rules of the new act (§ 323 zákona 283/2021 Sb.):
  - Procedures already under way continue under the old rules.
  - The rules distinguish the procurement phases: zadání, návrh, společné jednání and veřejné projednání.
  - For such cases a fragment reads "Požadavky na jednotný standard podle § 20a zákona č. 183/2006 Sb. se neuplatní".
  — [Frank Bold in Právní prostor](https://pravniprostor.cz/clanky/spravni-pravo/jak-na-pripravu-uzemne-planovaci-dokumentace-od-cervence-plati-prechodna-opatreni); [ÚÚR 01-úvod (1. 1. 2025)](https://www.uur.cz/media/kasgtjih/01-uvod-01012025-final.pdf) (the fragment's exact source page was not identified)
- A practitioner reading (D. Zahumenský, May 2024): if a municipality had not started the veřejné projednání of a prepared change by the end of June 2024, it must convert the whole ÚP to JS before issuing that change. — [davidzahumensky.cz](https://www.davidzahumensky.cz/2024/05/24/prechodna-ustanoveni-noveho-stavebniho-zakona-a-jednotny-standard-uzemniho-planu/)
- One search summary said the duty to deliver a ÚP in JS remains, but that a breach **cannot be sanctioned as a přestupek during the transitional period**. — the page was not identified; candidates: [ÚÚR 01-úvod](https://www.uur.cz/media/kasgtjih/01-uvod-01012025-final.pdf), [ÚÚR 02-prováděcí vyhlášky](https://www.uur.cz/media/qxifwioa/02-provadecivyhl.pdf)

**Uptake of JS**
- ÚÚR keeps an up-to-date overview of municipalities whose ÚP is in JS, using the 183/2006 terminology. Since **May 2025** an interactive map shows the state of územní plánování in each municipality. — [Portál ÚP Kraje Vysočina – aktuality](https://pupo.kr-vysocina.cz/aktuality)
- ÚÚR's map portal lists such an overview, but says its applications are for internal purposes only. — [ÚÚR – mapový portál](https://www.uur.cz/mapovy-portal/)
- Subsidies for conversion:
  - Kraj Vysočina announced the programme "Jednotný standard územních plánů 2026" on 16 Feb 2026. — [pupo aktuality](https://pupo.kr-vysocina.cz/aktuality)
  - An MMR national subsidy supports conversion for municipalities of up to 5,000 inhabitants. Search results gave its programme number as "11755"; this needs checking. — [ISVS.cz – MMR: Podpora jednotného standardu ÚP](https://www.isvs.cz/mmr-podpora-jednotneho-standardu-uzemnich-planu/); [Komunální ekologie](https://www.komunalniekologie.cz/info/podpora-jednotneho-standardu-uzemnich-planu)
- Explanatory material exists but could not be read here: MMR's "Zkušenosti z aplikace jednotného standardu" slides and leaflets aimed at municipalities. — [MMR – Morkus, zkušenosti s JS](https://mmr.cz/getmedia/b29bcadf-957f-4e86-a87d-0e65c0da1df5/1-Morkus-Zkusenosti-z-aplikace-jednotneho-standardu.pdf.aspx?ext=.pdf); [ÚÚR leták JS ÚP (2023)](https://www.uur.cz/media/irhnbcul/jednotny-standard-up_letak-2023-03-17.pdf); [SMO ČR – Co přinese JS obcím? (2023)](https://www.smocr.cz/Shared/Clanky/13275/jednotny-standard-up-letak-cerven-2023.pdf); [ÚÚR – Vrbová 2023, standardizace ÚPD](https://www.uur.cz/media/dlvd0jrk/02_vrbová_2023_standardizace_upd.pdf)

**Regional "mozaika ÚP" as WMS/WFS**
- Search found no authoritative, current list of regional ÚP mosaic services. The only hit is dated: a 2011 OSM-CZ mailing-list thread pointing to Moravskoslezský kraj open data as a WMS source of planning data. It warned that ÚP data taken out of context are not the legal document. — [OSM talk-cz, Dec 2011](https://lists.openstreetmap.org/pipermail/talk-cz/2011-December/006951.html)

### Inferences
- Only ÚPs in JS are reliably machine-readable for the binding question "which plocha is this parcel in". They carry vector geometry with standardized plocha types and codes, and DXF is accepted, as the NGÚP check tool shows. For every other ÚP the PDF or raster výkresy must be georeferenced and vectorized, or a regional mosaic used where a kraj has redrawn them.
- Conversion depends on the next change and has no deadline, and NGÚP is not mandatory before mid-2027. So in Oct 2026 no national authoritative ÚP layer exists. An AI system has to combine NGÚP, kraj portals and mosaics, and municipal websites. It must also check each plan's legal status (účinnost, změny, úplné znění po změně) against the ÚÚR evidence (EÚPČ).
- Even a ÚP in JS keeps the regulatory content as prose tied to plocha codes: podmínky využití and podmínky prostorového uspořádání. Each municipality chooses its own metrics and thresholds. Interpretation therefore needs LLM extraction into a per-ÚP schema, using the plocha codes as anchors, plus human validation.
- The 96.71 % figure is area coverage, so the municipalities without valid ÚPD are probably few and mostly small. The count still has to be checked in EÚPČ.
- **Cross-document automation readiness (synthesis; partly prior knowledge, verify before publishing):**

| Document | Binding? | Where (Oct 2026) | Typical format | Automated retrieval | Automated interpretation |
|---|---|---|---|---|---|
| ÚP in JS | yes (opatření obecné povahy) | NGÚP (if uploaded), kraj portal, obec web | vector (DXF and others) + PDF text | medium–high | geometry high; regulatory text medium (LLM) |
| ÚP not in JS | yes | obec web, kraj mosaic | PDF/raster, sometimes SHP | low–medium | low (georeferencing + LLM) |
| ZÚR | yes, for ÚP and decisions | kraj web/GIS | vector + PDF; JS methodology since Aug 2025 | medium | medium (corridors and plochy of supra-local importance) |
| Regulační plán | yes | obec web; listed in EÚPČ | PDF | low | low (rare, very detailed) |
| Územní studie | podklad, not binding [prior knowledge] | EÚPČ index + obec web | PDF; 157/2024 requires machine-readable format | low–medium | low–medium |
| Územní opatření (stavební uzávěra) | yes | úřední deska | PDF | very low; no register found | low |
| ÚAP / limity | podklad; the limits come from other laws | ORP/kraj portals; NGÚP upload not fully working | WMS/SHP/PDF | medium, fragmented | medium (jevy renumbered) |
| vyhl. 146/2024 | yes, national | e-Sbírka | legal text | high | high (codifiable once) |
| PSP (Prague only) | yes | e-Sbírka / Prague | legal text | high | high |
| Předběžná informace | individual, non-binding | on request, 30 days, 1,000 Kč | letter | not automatable | n/a (AI can only prepare the request) |

### Gaps
- **Counts not found:**
  - how many of the ~6,250 municipalities have a valid ÚP in Oct 2026;
  - how many have their ÚP in JS;
  - how many ÚPs have been uploaded to NGÚP;
  - what share exists only as PDF or raster.
  
  The ÚÚR map apps are internal, no 2024 or 2025 ročenka surfaced, and ÚÚR and NGÚP pages could not be fetched. To close this, check eupc.uur.cz, the ÚÚR overview of municipalities with ÚP in JS, and NGÚP.
- **Regional WMS/WFS mosaics: not verified.** [unverified – prior knowledge] Several kraje have long run "mozaika ÚP" on their geoportals, for example Středočeský, Jihomoravský, Plzeňský, Moravskoslezský, Vysočina, Zlínský and Olomoucký. These are mostly WMS, with some WFS or downloads. Service URLs, licences and how current they are must be checked kraj by kraj.
- **Textová část content and standardization: not verified this session.** [unverified – prior knowledge]
  - Vyhl. 500/2006 Sb. příloha č. 7 required the výrok to contain: "stanovení podmínek pro využití ploch s rozdílným způsobem využití s určením převažujícího účelu využití (hlavní využití), … přípustného využití, nepřípustného využití, popřípadě … podmíněně přípustného využití … a stanovení podmínek prostorového uspořádání, včetně základních podmínek ochrany krajinného rázu (například výškové regulace zástavby, charakteru a struktury zástavby, stanovení rozmezí výměry pro vymezování stavebních pozemků a intenzity jejich využití)".
  - Plocha types follow §§ 4–19 vyhl. 501/2006: bydlení, rekreace, občanské vybavení, veřejná prostranství, smíšené obytné, dopravní and technická infrastruktura, výroba a skladování, smíšené výrobní, vodní a vodohospodářské, zemědělské, lesní, přírodní, smíšené nezastavěného území, těžba nerostů, specifické.
  - Metrics typically used in practice: max. výška (in metres or podlaží); koeficient zastavění (KZP, "intenzita zastavění"); koeficient zeleně or a minimum share of unpaved area; min./max. výměra stavebního pozemku; sometimes a stavební or uliční čára. Their names and definitions differ by municipality.
  - Not verified: whether 157/2024 or 457/2025 changed this template, and whether JS standardizes any of these metrics or only plocha types, graphics and the data structure.
- Which data formats JS accepts besides DXF (e.g., SHP or GeoPackage): not verified.
- Fate of pre-2007 plans (ÚPO/ÚPN SÚ under zákon 50/1976): [unverified – prior knowledge] under § 188 of 183/2006 they lapsed by 31 Dec 2022, subject to extension rules. Whether any are still valid in 2026 was not verified.
- Number of the 2020 amendment that inserted § 20a into 183/2006, believed to be zákon č. 403/2020 Sb.: [unverified – prior knowledge].

## 2. ÚAP and limity využití území: the tracked jevy, who maintains them, services, completeness

### Takeaway
ÚAP, and the limity využití území they collect, are now governed by **vyhl. č. 157/2024 Sb.** Its příloha č. 1 lists the sledované jevy, renumbered compared with vyhl. 500/2006. They feed a central ÚAP database kept by MMR. In spring 2026, ÚAP upload into NGÚP was reported as not fully working. In practice, ÚAP data must still be collected ORP by ORP and kraj by kraj. No authoritative statistics on completeness, currency or WMS/WFS availability were found.

### Cited Findings
- 157/2024 replaced 500/2006 from 1 Jul 2024. — [TZB-info – vyhl. 157/2024](https://www.tzb-info.cz/pravni-predpisy/vyhlaska-c-157-2024-sb-o-uzemne-analytickych-podkladech-uzemne-planovaci-dokumentaci-a-jednotnem-standardu)
- MMR keeps a **central ÚAP database** containing the "sledované jevy podle přílohy č. 1". The jevy fall into three groups: "údaje o území, zjištění vyplývající z průzkumů území a další dostupné informace o území". — [epravo – Sb. 157/2024 (PDF)](https://www.epravo.cz/_dataPublic/sbirky/2024/Sb_2024_157_PZZ.pdf); [ČKA – text vyhl. 157/2024](https://www.cka.cz/++api++/sluzby/legislativa/pravni-predpisy/provadeci-vyhlasky/vyhlaska-c-1572024-sb-o-uzemne-analytickych-podkladech-uzemne-planovaci-dokumentaci-a-jednotnem-standardu.pdf/@@download/file)
- **The jevy were renumbered.** Commentary notes that "každá ze 3 vyhlášek má jiné členění a číslování jednotlivých sledovaných jevů". ČSÚ, which supplies statistical data for ÚAP, notes that "novelizací vyhlášky bylo upraveno číslování ukazatelů". — exact ÚÚR file not identified: [ÚÚR 02-vyhláška](https://www.uur.cz/media/vuri5pvp/02-vyhlaska.pdf) / [ÚÚR 02-aktualizace](https://www.uur.cz/media/neqj1yrl/02-aktualizace.pdf); [ČSÚ a územně analytické podklady](https://csu.gov.cz/statistika/csu_a_uzemne_analyticke_podklady)
- Example of how data providers apply the list: NPÚ, as poskytovatel údajů for heritage jevy, published "Sledované jevy ÚAP Kolín 2024". — [NPÚ – Sledované jevy ÚAP Kolín 2024](https://pagis.npu.cz/wordpress/wp-content/uploads/2024/09/Sledovane_jevy_UAP_Kolin_2024.pdf)
- ÚÚR maintains the national-level ÚAP ČR. — [ÚÚR – Územně analytické podklady ČR](https://www.uur.cz/uzemni-planovani/uzemne-analyticke-podklady-cr/)
- Kraj and ORP practice that surfaced:
  - Středočeský kraj publishes ÚAP methodology meetings on its GIS server. — [Porada ÚAP prosinec 2021](https://gis.kr-stredocesky.cz/docs/REG/DOKUMENTACE/Porady_USR/Porada_%DA%DAP_prosinec_2021.pdf)
  - Ústí nad Labem publishes ORP ÚAP documentation (rozbor udržitelného rozvoje území) on its map server. — [mapy.usti.cz](https://mapy.usti.cz/PRILOHY/UAP/UAP_DOKUMENTACE/2012/2012_RURU_ORP_USTI.pdf)
  - ÚÚR has material on ÚAP in Jihočeský kraj. — [ÚÚR 05-úap-v-jčk](https://www.uur.cz/media/111fo552/05-úap-v-jčk.pdf)
- Spring 2026: uploading ÚAP into NGÚP was among the functions that did not yet fully work. — [Právní prostor](https://www.pravniprostor.cz/aktuality/odklad-povinneho-pouzivani-geoportalu-uzemniho-planovani-vlada-schvalila)

### Inferences
- ÚAP are a discovery layer, not a legal source. They are podklady, and the legal effect of a limit comes from the underlying act or register: ochranná pásma, chráněná území, památková ochrana and so on. An AI system should treat a ÚAP jev as a pointer and confirm it against the source authority.
- Data from ORPs on different update cycles may use the 500/2006 numbering or the 157/2024 / 457/2025 numbering. Merging them needs a crosswalk of jev codes.
- Expect heterogeneity. Each ORP and kraj publishes through its own GIS vendor, as a mix of WMS, downloadable vector data and PDF výkresy (výkres limitů, výkres hodnot, problémový výkres). NGÚP does not yet aggregate ÚAP reliably.

### Gaps
- The number and full list of jevy in příloha č. 1 to 157/2024, as amended by 457/2025, were not obtained. [unverified – prior knowledge] The old 500/2006 příloha č. 1 část A listed 119 jevů, for example zastavěné území, památkové rezervace and zóny, ochranná pásma, záplavová území, ložiska, poddolovaná území and the TI networks.
- Who maintains ÚAP under 283/2021: [unverified – prior knowledge] the úřad územního plánování (ORP) for its správní obvod, the krajský úřad for the kraj, and MMR/ÚÚR for ČR, with poskytovatelé údajů obliged to supply data. The update cycle under the new act was not verified; under the old act a full update was due every 2 years.
- WMS/WFS versus download availability, completeness and currency per kraj or ORP: no data found.

## 3. Regulační plány, územní studie, ZÚR and územní opatření (e.g., stavební uzávěra): where to find them, and whether there is central evidence

### Takeaway
Regulační plány and územní studie are recorded in ÚÚR's **Evidence územně plánovací činnosti** (EÚPČ, new system since Sept 2022) and signposted on IWÚP under "ÚPD a ÚPP obcí". 157/2024 adds format requirements for machine-readable územní studie. MMR issued a JS methodology for ZÚR in Aug 2025, but detailed binding JS exists only for ÚP. **No central evidence of územní opatření** such as a stavební uzávěra was found. ÚÚR, which hosts EÚPČ and IWÚP, ceases to exist on **31 Dec 2026**, and its agenda moves to the new **Úřad rozvoje území České republiky**.

### Cited Findings
- New EÚPČ system since Sept 2022. — [ÚÚR ročenka 2022](https://www.uur.cz/media/xjkfcdpl/evidence_územně_plánovací_činnosti_ročenka_2022.pdf)
- Export tool at eupc.uur.cz. — [ÚÚR ročenka 2023](https://www.uur.cz/media/i4zbs3ds/evidence_územně_plánovací_činnosti_ročenka_2023.pdf)
- Signposting on IWÚP under "ÚPD a ÚPP obcí", where ÚPP includes územní studie. — [IWÚP – ÚPD a ÚPP obcí](https://portal.uur.cz/nastroje-uzemniho-planovani-v-ceske-republice/upd-a-upp-obci.asp)
- 157/2024 sets format requirements for **machine-readable územní studie**. — [Právní prostor – vyhl. 157/2024](https://www.pravniprostor.cz/zmeny-v-legislative/vyslo-ve-sbirce-zakonu/vyhlaska-o-uzemne-analytickych-podkladech-uzemne-planovaci-dokumentaci-jednotnem-standardu)
- MMR published "**Standard ZÚR – metodika**" dated 18 Aug 2025. — [MMR – Standard ZÚR metodika 2025-08-18](https://mmr.gov.cz/getmedia/822811f0-bb3d-489e-b5bd-b461167fbc6a/Standard_ZUR_metodika_2025_08-18.pdf.aspx?ext=.pdf)
- "Aktuálně jsou stanoveny podrobnější požadavky jednotného standardu pouze pro územní plány"; MMR plans to standardize all ÚPD. — [ÚÚR – Standardizace](https://www.uur.cz/uzemni-planovani/standardizace-uzemniho-planovani/)
- Under the big 2026 amendment, "Úřad rozvoje území České republiky … vzniká a svou působnost … začíná vykonávat dnem 1. ledna 2027". Dopravní a energetický stavební úřad and Ústav územního rozvoje cease on 31 Dec 2026, and their agendas pass to the new Úřad. — [novystavebnizakon.gov.cz – úplné znění](https://novystavebnizakon.gov.cz/legislativa/uplne-zneni-zakona/); [MMR – školení SÚ podzim 2026 (15 Oct 2026)](https://novystavebnizakon.gov.cz/media/y3keegzx/%C5%A1kolen%C3%AD-s%C3%BA_podzim-2026_15102026.pdf) (via search summary)

### Inferences
- EÚPČ gives a document index: which RP or ÚS exists and its status. The content itself must be retrieved and parsed from PDFs on municipal websites. Regulační plány are rare but very detailed. Územní studie matter in practice because a ÚP can make "prověření územní studií" a condition for decisions in a given plocha. An AI system must therefore check the ÚP text for such conditions and then find the ÚS.
- ÚS processed after 157/2024 should become machine-readable, but adoption is unknown.
- Územní opatření such as a stavební uzávěra or asanace území are opatření obecné povahy announced on the úřední deska. With no central register, an automated tool must crawl úřední desky, many of them on vendor platforms. The risk of missing a valid uzávěra is high, so this layer needs explicit "not checked" flags.
- The move from ÚÚR to the Úřad rozvoje území may change the URLs and APIs of EÚPČ, IWÚP and the JS catalogues during 2027. This is an integration risk.

### Gaps
- Not found:
  - the number of valid RP and ÚS;
  - whether ÚS are uploaded to NGÚP;
  - whether the 2026 amendment changes the RP, ÚS or územní opatření regimes;
  - per-kraj ZÚR formats and services.
- [unverified – prior knowledge]
  - Under 283/2021, územní opatření o stavební uzávěře and o asanaci území are issued as opatření obecné povahy, typically by the rada obce or the kraj.
  - No national register of them is known.
  - All 14 kraje have ZÚR (Prague's are the Zásady územního rozvoje hl. m. Prahy), usually published on kraj geoportals with vector data.

## 4. Building rules for a family house: vyhláška č. 146/2024 Sb., Pražské stavební předpisy, and the územně plánovací / předběžná informace

### Takeaway
**Vyhláška č. 146/2024 Sb. o požadavcích na výstavbu** is the national rulebook. It is dated 31 May 2024 and has been in force since 1 Jul 2024. A consolidated version "ve znění od 1. 7. 2026" exists, so it was amended in 2026. I could not verify its paragraph wording on distances, minimum plot size, parking, rainwater infiltration (vsakování) or utility connections. The widely quoted 7 m / 2 m / 4 m distance rules come from the repealed vyhl. 501/2006 (§ 25).

The formal way to get an authoritative reading for a plot is the **předběžná informace** under **§ 174 zákona 283/2021 Sb.** The request uses the form under vyhl. 149/2024 Sb. The answer is issued within 30 days, the správní poplatek is **1,000 Kč**, and the result is non-binding. No 2025–2026 information on the **Pražské stavební předpisy** surfaced.

### Cited Findings
- 146/2024 is "vyhláška ze dne 31. května 2024 o požadavcích na výstavbu", in force from 1 Jul 2024. — [kurzy.cz – Sbírka](https://zpravy.kurzy.cz/774033-146-vyhlaska-ze-dne-31-kvetna-2024-o-pozadavcich-na-vystavbu/); [SZÚ – text vyhl. 146/2024](https://szu.cz/wp-content/uploads/2024/07/stavebni_146_2024_sb.pdf); [ČKA – text vyhl. 146/2024](https://www.cka.cz/++api++/sluzby/legislativa/pravni-predpisy/provadeci-vyhlasky/vyhlaska-c-146_2024-sb-vyhlaska-o-pozadavcich-na-vystavbu.pdf/@@download/file)
- A legal-library catalogue lists a consolidated version "ve znění od 01.07.2026", which implies an amendment effective 1 Jul 2026. — [krajta.slv.cz – 146/2024](https://krajta.slv.cz/2024/146)
- The Government's RIA overview for 2025 lists a draft decree amending 146/2024. — [RIA – Souhrn vyhlášek 2025](https://ria.gov.cz/wp-content/uploads/Souhrn-vyhlasek_2025.pdf). The same search returned EU TRIS notifications that probably concern the decree or its amendment (not verified). — [TRIS 25581](https://technical-regulation-information-system.ec.europa.eu/cs/notification/25581/text/F/CS); [TRIS 27602](https://technical-regulation-information-system.ec.europa.eu/mt/notification/27602/text/D/CS)
- **Distances:** Czech Q&A sources give these rules but tie them to the old vyhl. 501/2006 (§ 25), not to 146/2024:
  - family houses at least 7 m apart;
  - a family house at least 2 m from the plot boundary;
  - the house-to-house distance may drop to 4 m if no habitable-room windows face each other;
  - garages at least 2 m from shared plot boundaries.
  — [pracepropravniky – § 25 vyhl. 501/2006](https://www.pracepropravniky.cz/zakony/vyhlaska-o-obecnych-pozadavcich-na-vyuzivani-uzemi/paragraf-25/); [poradte.cz](https://www.poradte.cz/spolecnost/84818-vzdalenost-obytne-stavby-od-hranice-pozemku.html); [ceskestavby.cz – odstupy RD](https://www.ceskestavby.cz/poradna/odstupy-stavby-rd-150.html)
- A forum answer says "v prováděcí vyhlášce č. 146/2024 Sb. … není moc informací na odstup" and that the 2 m boundary rule is in the statute. This is non-authoritative, conflicts with the sources above, and is unverified. — [ceskestavby.cz poradna](https://www.ceskestavby.cz/poradna/stavby-domu/107/)
- **Předběžná informace** (successor to the old územně plánovací informace route):
  - issued on request **within 30 days** under **§ 174 of 283/2021**;
  - issued by the stavební úřad or the dotčený orgán;
  - requested on the **form under vyhl. č. 149/2024 Sb.**;
  - no longer has a fixed one-year validity, though the authority may limit it;
  - lapses if conflicting legislation takes effect or the circumstances change.
  — [Portál ÚP Kraje Vysočina – Předběžná informace](https://pupo.kr-vysocina.cz/vystavba/uzemne-planovaci-informace); [Hypoindex – žádost o povolení a předběžná informace](https://www.hypoindex.cz/clanky/novy-stavebni-zakon-zadost-o-povoleni-a-predbezna-informace/)
- **Fee:** "za vydání předběžné informace je stanoven poplatek ve výši 1 000,- Kč". — [Portál veřejné správy – Vydání předběžné informace](https://portal.gov.cz/sluzby-vs/vydani-predbezne-informace-S47329); [Portál ÚP Kraje Vysočina](https://pupo.kr-vysocina.cz/vystavba/uzemne-planovaci-informace)
- **Binding force:** described as a non-binding, orientation tool for both the authority and the applicant. — [Portál veřejné správy](https://portal.gov.cz/sluzby-vs/vydani-predbezne-informace-S47329). A municipal Q&A addresses "Je předběžná informace závazná?"; its answer was not visible. — [Poradna pro obce](https://www.poradnaproobce.cz/odpoved-na-dotaz/kdo-vydava-predbeznou-informaci-je-predbezna-informace-zavazna-qi4455)
- The Vysočina page's URL and title still say "územně plánovací informace", but its content covers only the předběžná informace. — [Portál ÚP Kraje Vysočina](https://pupo.kr-vysocina.cz/vystavba/uzemne-planovaci-informace)
- **Permit fees** (secondary source, updated Feb 2026): položka 18 sazebníku zákona 634/2004 Sb. sets RD 5,000 Kč and bytový dům 10,000 Kč. The fee act was amended by 284/2021 Sb. — [RuleCalc](https://rulecalc.com/cs/spotrebitel/povoleni-stavby). Echo24 reports higher fees for chaty, studny and garáže. — [Echo24](https://www.echo24.cz/a/HdxT6/zpravy-domov-tisice-navic-chata-studna-garaz-kolik-zaplatite-nove-stavby)

### Inferences
- The rules form three layers:
  - 146/2024: national, codifiable once into a rule engine;
  - the municipal ÚP: may add or tighten rules on výška, KZP/zeleň, min. výměra, odstupy and stavební čára, and must be extracted per municipality;
  - in Prague, the PSP: replace parts of the national rules.
  
  An automated check must apply them in that precedence and show where each rule comes from.
- The separate "územně plánovací informace" of the old act (§ 21 of 183/2006) seems to have been absorbed into the předběžná informace (§ 174). This rests on the Vysočina page; the statute was not checked. The only formal confirmation for an architect therefore costs 1,000 Kč, takes up to 30 days and is non-binding. AI output can at most support the decision, or prepare the request.

### Gaps
- **Verified text of 146/2024 on every point:**
  - [unverified – prior knowledge] 146/2024 merged the former vyhl. 501/2006 (obecné požadavky na využívání území), 268/2009 (technické požadavky na stavby) and 398/2009 (bezbariérové užívání).
  - The 501/2006 rules are believed largely carried over, but neither their paragraph numbers in 146/2024 nor the 2026 changes could be confirmed. Those rules are:
    - 2 m from the boundary and 7 m between RD (4 m reduced);
    - at least 0.4 (detached) or 0.3 (semi-detached or row) of the RD plot "schopná vsakování dešťových vod" (501/2006 § 21(3));
    - napojení na pozemní komunikaci and technická infrastruktura;
    - odstavná stání per ČSN 73 6110.
- No national minimum plot size for an RD was found. It is typically set by the ÚP. Unverified.
- The required number of parking spaces for an RD under 146/2024 was not found.
- What the amendment effective 1 Jul 2026 changed, and its number, are unknown. A file "Sb_2026_97" on epravo surfaced in a 146/2024 search, possibly vyhláška č. 97/2026 Sb. Unverified. — [epravo – Sb. 2026/97 (PDF)](https://www.epravo.cz/_dataPublic/sbirky/2026/Sb_2026_97_PZZ.pdf)
- **Pražské stavební předpisy:** no sources surfaced in this session. [unverified – prior knowledge] They are nařízení č. 10/2016 Sb. hl. m. Prahy, effective 1 Oct 2016 and amended in 2018, and Prague's special authorization was kept in 283/2021. Not verified: whether Prague amended or re-issued the PSP in 2024–2026 to match 146/2024, and the 2026 status of the Metropolitní plán.
- The fee and timing of the old ÚPI were not verified, nor whether a stand-alone ÚPI survives in 283/2021.
- Echo24 mentions a transitional period to 30 Jun 2027 during which "projects can still be filed under the old rules". The context is unclear and was not verified.

## 5. The new building law in 2026 (283/2021 Sb., novela 152/2023 Sb., amendments after the Oct 2025 election) and what changed for planning data and digitalization

### Takeaway
Zákon 283/2021 Sb. has been in full effect since 1 Jul 2024, via novela 152/2023. After the Oct 2025 election, the coalition passed two amendments. MMR is headed by minister Zuzana Mrázová (ANO).

- **Small amendment:** postpones mandatory NGÚP use by one year, to **30 Jun 2027**. The government approved it in Apr 2026 and the Sněmovna passed it 123:0 in May 2026. Its final enactment was not confirmed.
- **Large coalition amendment:** creates a centralized state building administration.
  - The Senate rejected it in Aug 2026, and the Sněmovna overrode the veto on **9 Sep 2026** (104:53).
  - The President signed it on **17 Sep 2026**, and it was reportedly sent to the Sbírka on 19 Oct 2026.
  - Its main effect starts **1 Jan 2027**, with the full system from **1 Jan 2028**.
  - ÚÚR and DESÚ are abolished at the end of 2026 and replaced by the **Úřad rozvoje území ČR**.

None of the found sources mentions a statutory deadline for JS conversion or new rules for old ÚPs in the 2026 changes.

### Cited Findings
- 283/2021 Sb. in full effect from 1 Jul 2024. ÚPD and permits issued earlier remain valid. — [Právní prostor – Účinnost nového stavebního zákona](https://www.pravniprostor.cz/clanky/spravni-pravo/ucinnost-noveho-stavebniho-zakona)
- 152/2023 Sb. moved effectiveness to 1 Jan 2024, with a transitional period from 1 Jan to 30 Jun 2024. Sources variously give 1 Jan or 1 Jul 2024 as "the" effective date. — [ÚÚR – zákon 152/2023](https://www.uur.cz/media/3m0fg1pr/01-zakon152-2023.pdf)
- **Small amendment (NGÚP postponement):**
  - In April 2026 the government approved extending the transitional period without mandatory NGÚP use by one year, **to 30 Jun 2027**. Per the reporting, the previous end date was 30 Jun 2026.
  - The stated reason: the geoportal works, but key parts are not fully tested.
  - Minister **Zuzana Mrázová** warned that a premature launch could complicate planning processes.
  - Building offices may keep using their original systems until the end of 2027.
  — [TZB-info](https://stavba.tzb-info.cz/134478-odklad-povinneho-pouzivani-geoportalu-uzemniho-planovani-vlada-v-pondeli-schvalila); [archiweb](https://www.archiweb.cz/n/domaci/odklad-povinneho-pouzivani-geoportalu-uzemniho-planovani-vlada-schvalila); [ČTK / České noviny](https://www.ceskenoviny.cz/zpravy/odklad-povinneho-pouzivani-geoportalu-uzemniho-planovani-vlada-schvalila/2814848); [remspace](https://www.remspace.cz/novinky/vlada-schvalila-odklad-povinneho-pouzivani-geoportalu-uzemniho-planovani/); [Právní prostor](https://www.pravniprostor.cz/aktuality/odklad-povinneho-pouzivani-geoportalu-uzemniho-planovani-vlada-schvalila)
- The Sněmovna passed the small amendment in accelerated mode: **123 MPs from all clubs for, none against**. At the time of reporting it still needed the Senate and the President. — [iRozhlas (URL dated 6 May 2026)](https://www.irozhlas.cz/zpravy-domov/snemovna-schvalila-malou-novelu-stavebniho-zakona-odlozila-povinne-pouzivani_2605062059_med); [HN](https://byznys.hn.cz/c1-67874580-snemovna-schvalila-rocni-odklad-povinneho-pouzivani-narodniho-geoportalu); [CNN Prima NEWS](https://cnn.iprima.cz/dalsi-potize-stavebniho-zakona-snemovna-odlozila-povinne-pouzivani-narodniho-geoportalu-511407); [Deník N](https://denikn.cz/minuta/2056724)
- **Large coalition amendment:** a deputies' bill ("kterou předložili zástupci vládní koalice"), sent to third reading in June 2026, with minister Mrázová as co-sponsor. In Jan 2026 ČKAIT published a legal analysis of the "13. novela nového stavebního zákona", apparently this bill. — [MMR aktualita – novela postoupila do závěrečného schvalování](https://mmr.gov.cz/cs/ministerstvo/stavebni-pravo/stavebni-zakon-2026/aktuality/novela-stavebniho-zakona-postoupila-ve-snemovne-do); [ČKAIT – právní analýza 13. novely (2026-01)](https://zpravy.ckait.cz/vydani/2026-01/pravni-analyza-13-novely-noveho-stavebniho-zakona-opravdu-neni-cas-ztracet-cas/)
- Stated aims of the large amendment:
  - it "zavádí jednotnou a centralizovanou státní stavební správu s jasnou odpovědností, jednotnými pravidly a jedním řízením";
  - faster permits where construction is already prepared;
  - per MMR, no new grounds for expropriation in favour of developers;
  - a new category of "**vyhrazené stavby**", which includes residential buildings over 10,000 m² and gives them "statut výstavby ve veřejném zájmu";
  - in Mrázová's words, to "odstranit zbytečné řetězení řízení";
  - transition 2026–2028, with large buildings first and small buildings in 2028.
  — [MMR – Co přinese novela](https://mmr.gov.cz/cs/ministerstvo/stavebni-pravo/stavebni-zakon-2026/aktuality/co-prinese-novela-stavebniho-zakona-a-jake-jsou-je); [novystavebnizakon.gov.cz](https://novystavebnizakon.gov.cz/); [MMR prezentace „Stavební zákon – Státní stavební správa", duben 2026](https://mmr.gov.cz/getmedia/10d239cf-1acd-4cdc-b6d7-119f16c698d3/Prezentace-MMR_final_nSZ_dopis_obce_final.pdf.aspx?ext=.pdf); [novystavebnizakon.gov.cz – změnový zákon](https://novystavebnizakon.gov.cz/legislativa/zmenovy-zakon/)
- The Senate rejected the bill in Aug 2026. The Sněmovna overrode the veto on **9 Sep 2026**: 104 coalition MPs for, 53 opposition MPs against. — [Advokátní deník](https://advokatnidenik.cz/2026/09/09/snemovna-prehlasovala-senat-a-stvrdila-koalicni-novelu-stavebniho-zakona/); [Deník](https://www.denik.cz/cesko/novela-stavebniho-zakona-prosla-snemovna-prehlasovala-senat/); [CNN Prima NEWS](https://cnn.iprima.cz/snemovna-stvrdila-novelu-stavebniho-zakona-vladni-koalice-prehlasovala-senatni-veto-521402); [Echo24](https://m.echo24.cz/a/HYZsW/zpravy-domov-snemovna-prehlasovala-senat-stavebni-zakon); [Deník N](https://denikn.cz/minuta/2179831)
- The President signed it on **17 Sep 2026**, despite openly stated reservations. — [SME Union](https://www.sme-union.cz/prezident-podepsal-velkou-novelu-stavebniho-zakona-jedno-razitko-u-haly-nebo-dilny-prijde-az-v-roce-2028/); [AQE academy](https://www.aqeacademy.cz/novela-stavebniho-zakona-2026-je-podepsana-co-ted-ceka-uredniky-stavebnich-uradu/)
- **Promulgation:**
  - Per ČKAIT (exact page not identified), the law was sent for publication in the Sbírka on 19 Oct 2026.
  - Another source says that as of 18 Oct 2026 it had not yet been promulgated.
  - Some provisions, including the shorter objection period and the longer permit validity, take effect on the first day of the month after promulgation (čl. LXXXV).
  - EnviWeb and Arnika say the rules "may change as early as November".
  — [ČKAIT – Rekodifikace stavebního práva](https://www.ckait.cz/rekodifikace-stavebniho-prava-novy-stavebni-zakon-a-jeho-novely); [MMR – školení SÚ podzim 2026 (15 Oct 2026)](https://novystavebnizakon.gov.cz/media/y3keegzx/%C5%A1kolen%C3%AD-s%C3%BA_podzim-2026_15102026.pdf); [EnviWeb](https://www.enviweb.cz/134711); [Arnika](https://arnika.org/o-nas/tiskove-zpravy/pravidla-povolovani-staveb-se-mohou-zmenit-uz-od-listopadu-novela-stavebniho-zakona-oslabi-prava-lidi-ve-prospech-vystavby)
- **Effective dates and institutions:**
  - Main effectiveness is **1 Jan 2027**: the Úřad rozvoje území ČR starts operating on that date.
  - DESÚ and ÚÚR cease on 31 Dec 2026, and their agendas pass to the new Úřad.
  - The new system "má začít plně fungovat od 1. ledna 2028". Ordinary business buildings move to one office and one stamp from Jan 2028.
  - Proceedings already started finish under the old rules, so 2027 runs under a dual regime.
  — [novystavebnizakon.gov.cz – úplné znění](https://novystavebnizakon.gov.cz/legislativa/uplne-zneni-zakona/); [SME Union](https://www.sme-union.cz/prezident-podepsal-velkou-novelu-stavebniho-zakona-jedno-razitko-u-haly-nebo-dilny-prijde-az-v-roce-2028/); [Hypoindex](https://www.hypoindex.cz/clanky/pul-roku-do-ucinnosti-novely-stavebniho-zakona-co-rozhodne-o-hladkem-nabehu/); [akosmik](https://www.akosmik.cz/%C4%8Dl%C3%A1nky/nov%C3%BD-stavebn%C3%AD-z%C3%A1kon-jak%C3%A9-zrychlen%C3%AD-a-zm%C4%9Bny-p%C5%99inese-novela-od-ledna-2027)
- **Main procedural changes:**
  - fikce povolení for simple buildings;
  - stricter rules for neighbours' objections;
  - the stavební úřad, rather than the dotčené orgány, assesses public interests.
  — [Frank Bold Advokáti – 10 hlavních změn](https://www.fbadvokati.cz/cs/clanky/10320-novela-stavebniho-zakona-2026-10-nbsp-hlavnich-zmen-ktere-navrh-prinasi); [Bezrealitky – novela přehledně](https://www.bezrealitky.cz/blog/novela-stavebniho-zakona-2026-prehledne)
- **Conflicting or outdated:** an earlier blog post says the amendment was "schválená 30. ledna 2026, nabývá účinnosti 1. července 2026". This was superseded; 1 Jul 2026 was the original bill's proposed effective date. — [Bezrealitky (older post)](https://www.bezrealitky.cz/blog/novela-stavebniho-zakona-2026)

### Inferences
- For spatial-planning data, the 2026 changes concern institutions and timing rather than data standards:
  1. NGÚP becomes mandatory on 30 Jun 2027, provided the small amendment was enacted.
  2. ÚÚR is abolished, so its EÚPČ, IWÚP and JS-catalogue roles presumably pass to the Úřad rozvoje území on 1 Jan 2027.
  3. The JS content itself was updated by 457/2025 (1 Jan 2026), and the ÚÚR catalogues followed on 30 Jan 2026.
  4. None of the sources mentions a statutory JS conversion deadline in the 2024–2026 changes.
- Under the large amendment the stavební úřad assesses public interests itself instead of the dotčené orgány. That should raise pressure in 2027–2028 to have all limits available to building offices in one system: NGÚP plus ÚAP and the technical map. Data completeness should improve, but only gradually.
- For an AI product, 2027 is a moving-target year. Institutions, URLs and procedures change, and two procedural regimes run in parallel.

### Gaps
- The Sbírka numbers of both 2026 amendments were not found.
- It was not confirmed whether the small NGÚP amendment cleared the Senate and the President before 30 Jun 2026. If it did not, NGÚP use would have become mandatory on 1 Jul 2026; the status is unclear.
- It was not found whether the large amendment changes ÚP-related provisions: JS, NGÚP, ÚAP, předběžná informace or územní opatření.
- The Fiala-era amendments between 152/2023 and the 2025 election were not covered. ČKAIT's numbering implies 12 earlier amendments.
- [unverified – prior knowledge] 152/2023 abandoned the original single-state-administration concept of 283/2021 and kept the mixed model. The 2026 amendment brings back centralization.

## 6. Existing tools that let you click a parcel and see its ÚP functional area

### Takeaway
This session confirmed four kinds of tool:
- the NGÚP public map viewer, which is national but covers only documents uploaded to it;
- Moravskoslezský kraj's "Územní plány obcí" application;
- Kraj Vysočina's Portál územního plánování and Zlínský kraj's ÚP pages;
- the Plzeňský kraj geoportal.

ÚÚR's own map apps are partly internal. The IPR Praha geoportal, Mapy.cz, iKatastr and vendor tools (GEPRO, T-MAPY and similar) could not be checked.

### Cited Findings
- NGÚP public map viewer (mapová prohlížečka), with a user manual. — [NGÚP – příručka mapová prohlížečka](https://uzemniplanovani.gov.cz/documents/d/guest/prirucka_mapova_prohlizecka)
- Moravskoslezský kraj – "Územní plány obcí (aplikace)". — [msk.cz](https://www.msk.cz/cs/temata/mapy/uzemni-plany-obci-aplikace-432/)
- Kraj Vysočina – Portál územního plánování, with a list of documentations. — [pupo.kr-vysocina.cz](https://pupo.kr-vysocina.cz/napoveda/o-portalu/UP)
- Zlínský kraj – "Územní plány obcí Zlínského kraje". — [zlinskykraj.cz](https://zlinskykraj.cz/uzemni-plany-obci-zlinskeho-kraje)
- Plzeňský kraj – geoportal. — [geoportal.plzensky-kraj.cz](https://geoportal.plzensky-kraj.cz/portal/metodicky-pokyn-standard-vybranych-casti-uzemniho-planu)
- ÚÚR map portal; some applications are for internal use only. — [ÚÚR – mapový portál](https://www.uur.cz/mapovy-portal/)
- For the parcel side of the overlay, ČÚZK publishes a free WMS of the katastrální mapa covering the whole of ČR. — [ČÚZK WMS KM – metadata](https://h4e.focal.cesnet.cz/micka/record/basic/CZ-00025712-CUZK_WMS-MD_KM)

### Inferences
- Technically, "click a parcel, get the plocha" is a spatial join of ČÚZK parcel geometry with ÚP plochy polygons. That is straightforward wherever JS or mosaic vectors exist.
- Legally, ÚP výkresy are drawn at about 1:5,000 and plochy boundaries do not follow parcel boundaries. A tool must flag parcels that straddle two or more plochy, and parcels where the vector source differs from the vydané (legally issued) výkres.
- A national tool cannot rely on NGÚP alone in 2026–2027, because uploads are incomplete and mandatory use starts only in mid-2027. It would combine NGÚP, kraj mosaics and municipal portals, and say for each result which source and version was used.

### Gaps
- IPR Praha geoportal: [unverified – prior knowledge] geoportalpraha.cz offers the valid Územní plán sídelního útvaru hl. m. Prahy (1999, with its changes) as a viewer and as open data. This includes funkční využití and the míra využití území (KPP) codes, in formats such as SHP/GeoJSON/WMS. The 2026 status of the Metropolitní plán (Prague's new ÚP) is unknown.
- Mapy.cz: [unverified] it has a cadastral layer, but no ÚP layer is known.
- iKatastr: [unverified] a parcel viewer; whether it shows ÚP plochy is unknown.
- Vendors: [unverified – prior knowledge] GEPRO (MISYS / MISYS-WEB), T-MAPY and Geovap (Marushka) power many municipal and ORP map portals that include ÚP layers. Coverage, currency and APIs were not checked.
- Commercial parcel-intelligence tools that already show ÚP plochy are not covered here; another researcher handles the market.
