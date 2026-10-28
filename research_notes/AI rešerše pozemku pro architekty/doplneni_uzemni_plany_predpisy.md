# Doplnění: strojová dostupnost územních plánů a pravidla pro rodinný dům (stav k 28. 10. 2026)

> **Research conditions (read first).**
> - I used 34 WebSearch calls. Every Czech public-sector host I tried was unreachable from this session: e-sbirka.cz, mmr.gov.cz, uur.cz, uzemniplanovani.gov.cz, geoportalpraha.cz, iprpraha.cz, data.brno.cz, gis.brno.cz, regional geoportals and the Micka/INSPIRE catalogues. Only GitHub was reachable.
> - **The legal texts were therefore read in full from public GitHub mirrors of e-Sbírka.** These are `flatiocom/czech-law-md`, whose files carry e-Sbírka ELI metadata and the consolidation date, and `legalize-dev/legalize-cz`, which holds the original 2024 wording. These are the strongest findings in this file.
> - Each legal citation gives the canonical e-Sbírka ELI link and the mirror I actually read. The mirrors are unofficial, so quotations should be checked against e-Sbírka before publication.
> - Everything else comes from search-engine summaries of the linked pages and is weaker. Prior-knowledge statements are marked **[unverified – prior knowledge]**.
> - This file only fills gaps in `cz_uzemni_planovani_predpisy.md`. Facts already sourced there are not repeated unless needed for context.

## 1. Coverage: how many of the ~6,250 municipalities have a valid ÚP, how many ÚP are in jednotný standard (JS), how many are in NGÚP (2026)

### Takeaway
I found no 2025 or 2026 national count of municipalities with a valid ÚP, of ÚPs in JS, or of ÚPs published in NGÚP. The latest hard figures are:
- **92.55 % of 6,258 municipalities** had valid ÚPD in 2018;
- **96.71 % of the territory** was covered by valid municipal ÚPD at 31 Dec 2023 (prior notes).

The statute constrains what "valid ÚP" means in 2026:
- plans approved before 1 Jan 2007 stay valid until replaced, **at the latest until 31 Dec 2028** (§ 322);
- for municipalities without a ÚP, the ORP had to issue a vymezení zastavěného území **by 30 Jun 2026** (§ 325);
- NGÚP upload is not mandatory until **30 Jun 2027** (zákon 91/2026 Sb.), so NGÚP cannot yet serve as a complete register.

JS has a precise machine format under vyhl. 157/2024 (ESRI Shapefile in S-JTSK, fixed layer names and plocha codes). However, it standardizes only the geometry and the plocha types. The height and intensity rules stay in the free text of the ÚP.

### Cited Findings
**Counts (all from search summaries; no 2024/2025 ročenka surfaced)**
- In 2018, 92.55 % of the 6,258 municipalities had a valid územně plánovací dokumentace. The summary added that this was "a rise of about 33 %" over twenty years; the unit, % or p.p., is unclear. — ÚÚR document surfaced by search: [ÚÚR 01_obce.pdf](https://www.uur.cz/media/ey1ddam3/01_obce.pdf); the exact page was not verified, and the candidate companion file is [ÚÚR 14_vyvoj-uzemne.pdf](https://www.uur.cz/media/hoklwhsk/14_vyvoj-uzemne.pdf)
- An undated economic-news article says that of 6,253 municipalities "téměř 90 %" have a územní plán "nebo jeho obdobu". — [Ekonomický deník (rekodifikace stavebního práva III)](https://ekonomickydenik.cz/rekodifikace-stavebniho-prava-iii-mmr-chce-vic-mestskych-architektu-i-dane-podle-vyuziti-uzemi/); possibly the same item: [ekonomickydenik.cz/?p=15402](https://ekonomickydenik.cz/?p=15402)
- Regional comparator: in 2015, 133 of 215 municipalities in Liberecký kraj had a new ÚP. — Liberecký kraj news item (one of): [kraj-lbc.cz item 520501](https://kraj-lbc.cz/aktuality/case:detailPdf/itemId:520501/cgId:15623), [kraj-lbc.cz item 511600](https://www.kraj-lbc.cz/aktuality/case:detailPdf/itemId:511600/cgId:15623)
- No count of ÚPs in JS was found. ÚÚR's overview of municipalities with a ÚP in JS, and its interactive map (since May 2025), are noted in the prior notes, but their numbers could not be read. MMR documents and kraj presentations searched here give funding information, not counts. — [Karlovarský kraj – prezentace ÚPD 2026](https://www.kr-karlovarsky.cz/system/files/2026-01/6_prezentace_UPD_2026.pdf); [Karlovarský kraj – podpora ÚP činnosti obcí (12/2025)](https://www.kr-karlovarsky.cz/system/files/2025-12/7.%20Podpora%20%C3%BAzemn%C4%9B%20pl%C3%A1novac%C3%AD%20%C4%8Dinnosti%20obc%C3%AD_PDFA_0.pdf)
- No count of ÚPs published in NGÚP was found. Liberecký kraj stated in Feb 2026 that the NGÚP functions required by the stavební zákon but not yet available "nelze nahradit poskytováním dat podle zákona č. 106/1999 Sb." — [Liberecký kraj aktualita (2026)](https://www.kraj-lbc.cz/aktuality/case:detailPdf/itemId:587832/cgId:15623)
- NGÚP training material from May 2025 shows that its evidence module separates national, kraj and municipal documents, and both issued and in-progress ÚPD. — [NGÚP – školení EÚP 27. 5. 2025](https://uzemniplanovani.gov.cz/documents/d/guest/20250527_skoleni-eup-pdf)
- NGÚP serves individual documents through REST-style content URLs of the form `/o/rest/ais/contents/{uuid}`. — example: [uzemniplanovani.gov.cz/o/rest/ais/contents/fe8ef655-…](https://uzemniplanovani.gov.cz/o/rest/ais/contents/fe8ef655-9441-4908-bd90-3304f2c779fa)

**JS funding and the obligation in 2026**
- MMR výzva 1/2025 funds new ÚPs in JS or conversion of existing ones to JS. It is open to municipalities whose ÚP was issued after 1 Jan 2007 and is in no version of the standard. — [MMR – výzva 117D55 2025](https://mmr.gov.cz/getmedia/bd4ac073-4f48-498c-bfaf-133cf730f3bc/117D55_2025_Vyzva.pdf.aspx?ext=.pdf) (via search summary)
- MMR says about **600 mil. Kč** from IROP II should fund conversion of existing ÚPs to JS, with a national programme for small municipalities. — [BusinessInfo.cz](https://www.businessinfo.cz/clanky/ministerstvo-pro-mistni-rozvoj-podpori-obce-600-miliony-korun-na-digitalizaci-uzemnich-planu/)
- Karlovarský kraj's 2026 programme gives **140,000 Kč** for adapting a ÚP to JS, for municipalities up to 3,000 inhabitants. Applications ran 23–30 Mar 2026. The kraj's presentation states that the "datový a grafický standard" was a legal duty in 2023–2025 and that "od 1. 1. 2026 – datový standard – zákonná povinnost". — [Karlovarský kraj – prezentace ÚPD 2026](https://www.kr-karlovarsky.cz/system/files/2026-01/6_prezentace_UPD_2026.pdf)

**Legal facts that bound "valid ÚP" in 2026 (read in full)**
- **§ 322(1) zákona 283/2021 Sb.:** ÚPD sídelního útvaru nebo zóny, územní plán obce and regulační plán "schválené přede dnem 1. ledna 2007, pozbývají platnosti dnem nabytí účinnosti nové územně plánovací dokumentace, která je nahrazuje, **nejpozději však 31. prosince 2028**". Under § 322(3), changes to them can be issued until 31 Dec 2028. This closes a gap in the prior notes: pre-2007 plans did not lapse in 2022. — [283/2021 ve znění od 11. 6. 2026 – e-Sbírka](https://e-sbirka.gov.cz/eli/cz/sb/2021/283/2026-06-11) ([mirror](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2021/283-2021.md))
- **§ 325(1)–(2):**
  - The úřad územního plánování "pořídí a vydá vymezení zastavěného území … pro obec, která nemá územní plán nebo vymezené zastavěné území, do 2 let ode dne nabytí účinnosti tohoto zákona". This does not apply where the zastupitelstvo had already decided to procure a ÚP.
  - Until then, the "intravilán", meaning the built-up part as of 1 Sep 1966 shown in the evidence-nemovitostí maps, counts as zastavěné území (§ 325(2); intravilán defined in § 116(2)).
  
  — [283/2021 – e-Sbírka](https://e-sbirka.gov.cz/eli/cz/sb/2021/283/2026-06-11) ([mirror](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2021/283-2021.md))
- MMR's methodical note confirms that the ORP deadline for the vymezení zastavěného území is **30 Jun 2026**. — [MMR-30059/2025-81 (NGÚP)](https://uzemniplanovani.gov.cz/documents/d/guest/mmr-30059_2025_81-vymezeni-zu-samostatnym-postupem-pdf) (via search summary)
- **§ 139(2):** in the zastavěné území of a municipality without a ÚP, one may delimit plots for and permit:
  - stavby pro bydlení and pro rodinnou rekreaci;
  - related and compatible občanské vybavení;
  - DI and TI;
  - veřejná prostranství.
  
  Other buildings are allowed only if they match the character of the area and do not reduce environmental quality. — [283/2021 – e-Sbírka](https://e-sbirka.gov.cz/eli/cz/sb/2021/283/2026-06-11) ([mirror](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2021/283-2021.md))

**What JS actually standardizes: vyhl. 157/2024 Sb. ve znění od 1. 1. 2026 (read in full)**
- **Exchange format for a ÚP (příloha č. 14):**
  - one ZIP;
  - vector data **ESRI Shapefile** (mandatory);
  - texts in PDF/A (optionally TXT/RTF/DOC/DOCX/XLS(X), UTF-8);
  - výkresy in PDF/A, optionally PNG/TIF/BMP georeferenced in S-JTSK;
  - metadata in XML.
  
  Other formats in the same decree:
  - ZÚR: **GML** (příloha č. 9);
  - regulační plán: Shapefile or DXF (příloha č. 18);
  - vymezení zastavěného území: Shapefile, layers `ZastaveneUzemi_p` and `NezastavitelnyPozemek_p` (příloha č. 21);
  - územní opatření: Shapefile, layers `StavebniUzavera_p`, `Asanace_p` and `UzemniOpatreniAO_p` (příloha č. 24);
  - územní studie: a "strojově čitelný formát" (§ 37 + příloha č. 25).
  
  Spatial data are kept in S-JTSK (§ 10(4)). — [157/2024 ve znění od 1. 1. 2026 – e-Sbírka](https://e-sbirka.gov.cz/eli/cz/sb/2024/157/2026-01-01) ([mirror](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2024/157-2024.md))
- **Standardized ÚP layers (příloha č. 10):** `ReseneUzemi_p`, `UzemiPrvkyRP_p`, `ZastaveneUzemi_p`, `ZastavitelneUzemi_p`, `PlochyRZV_p`, `UzemniRezervy_p`, `KoridoryP_p`, `KoridoryN_p`, `Lokality_p`, `PlochyZmen_p`, `PlochyPodm_p`, `VpsVpoAs_p/_l`, `USES_p`, `SystemSidelniZelene_p`, `SystemVerProstr_p`, `PlochaVI_p`, `AkceleracniOblast_p`, `Zpochybneno_p` and others.
  - `PlochyRZV_p` carries `CasH` (1 = stabilizované, 2 = návrhové), `Typ` and `Ident`. `Typ` is a code from a fixed list, e.g. BU/BV/BI/BH (bydlení všeobecné/venkovské/individuální/hromadné), SV (smíšené obytné venkovské), MO/MR/MP (městské obytné/rekreační/produkční).
  - `PlochyPodm_p` flags plochy where decisions are conditional on a plánovací smlouva (PS), regulační plán (RP), územní studie (US) or soutěž (AU), with a deadline date.
  - **No standardized attribute exists for height, KZP/intensity or minimum plot size.**
  
  — [157/2024 – e-Sbírka](https://e-sbirka.gov.cz/eli/cz/sb/2024/157/2026-01-01) ([mirror](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2024/157-2024.md))
- These rules stay in the text. Under **příloha č. 8 zákona 283/2021**, the textová část of a ÚP contains "podmínky pro využití a prostorové uspořádání vymezených ploch s rozdílným způsobem využití" (odst. 1 písm. f)). Where useful, it also contains its own "definice pojmů, které nejsou definovány v tomto zákoně" (odst. 2 písm. k)) and deviating požadavky na výstavbu for parts with prvky regulačního plánu (odst. 2 písm. j)). § 80(2)(f) repeats the duty to set hlavní, přípustné, nepřípustné and podmíněně přípustné využití and "podmínky prostorového uspořádání". — [283/2021 – e-Sbírka](https://e-sbirka.gov.cz/eli/cz/sb/2021/283/2026-06-11) ([mirror](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2021/283-2021.md))
- **Conflict with the prior notes:** the prior notes cite a 2025 NGÚP check tool for ÚPs in JS "delivered as DXF". The decree lists only ESRI Shapefile as the vector format for a ÚP; DXF appears only for regulační plán. This is unresolved, and may reflect CAD-based delivery practice. — [157/2024 příloha č. 14 (mirror)](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2024/157-2024.md); prior note's source: [pupo.kr-vysocina.cz – aktuality](https://pupo.kr-vysocina.cz/aktuality)

### Inferences
- From the 2018 figure, about 6,258 × 7.45 % ≈ **466 municipalities had no valid ÚPD** then. This is my calculation. The 2023 area coverage of 96.71 % suggests the number has fallen since, and the remaining ones are mostly small. An order of magnitude of a few hundred is plausible for 2026, but unverified.
- A "what can be built here" engine must handle three municipal regimes:
  1. **ÚP in JS:** Shapefile with standard plocha codes. Parcel→plocha is automatable, but rules must still be extracted from the text.
  2. **ÚP not in JS:** this includes pre-2007 plans valid until 31 Dec 2028, available as PDF or raster, and needs georeferencing plus LLM extraction.
  3. **No ÚP:** zastavěné území from the 2026 vymezení ZÚ (in JS Shapefile if issued under the new law) or else the 1966 intravilán, plus the statutory § 139(2) whitelist. Outside the ZÚ, building is essentially not possible without a ÚP. That is a legal reading **[unverified – prior knowledge]**.
- Until 30 Jun 2027, the best national index of where each ÚP is published is the EÚPČ metadata. Under § 334b(9) these must include the URL at which the pořizovatel published the documents (see §6). This is more complete than NGÚP uploads.
- Because JS fixes codes such as `BI`, `SV` and `MO`, a pilot can map permitted uses nationally once. Height, KZP and min. výměra remain per-ÚP extraction tasks, since each ÚP defines its own terms under příloha 8 odst. 2 písm. k).

### Gaps
- Not found:
  - national counts for 2024–2026 of municipalities with a valid ÚP, with a ÚP in JS, and with ÚPD published in NGÚP;
  - the share of ÚPs available only as PDF or raster.
- The ÚÚR overview and map, EÚPČ (eupc.uur.cz) and NGÚP statistics could not be opened.
- Whether the ORPs met the 30 Jun 2026 deadline for vymezení zastavěného území is unknown.
- Whether 457/2025 dropped the mandatory "grafický standard" from 1 Jan 2026 is unverified. The Karlovarský kraj slide implies it, but the decree text was not compared.

## 2. Which kraje publish a "mozaika" of digitised ÚP as WMS/WFS or open data (all 14), and are ÚAP limity available as WMS/WFS?

### Takeaway
No kraj was confirmed by a 2026 source to publish a seamless, current vector mosaic of municipal ÚPs as WMS/WFS or open data. The evidence by kraj:
- **Strongest:**
  - **Královéhradecký:** a UPD WMS, an INSPIRE "Využití území" WMS, and MINIS as its recommended digitisation method.
  - **Plzeňský** and **Jihočeský:** per-municipality UPD WMS on kraj ArcGIS servers.
  - **Jihomoravský:** INSPIRE "Využití území" WMS.
  - **Zlínský:** INSPIRE view and download services, but derived from ZÚR, not from municipal ÚPs.
  - **Moravskoslezský:** a viewer with **PDF** downloads.
  - **Vysočina:** the PÚPO portal.
  - **Praha:** IPR open data under CC BY 4.0.
- **No ÚP mosaic service found:** Středočeský, Karlovarský, Ústecký, Liberecký, Pardubický, Olomoucký.

Most service URLs come from an undated, older crowd-sourced WMS list and must be re-checked. ÚAP-type WMS exist from national data providers (AOPK, NPÚ, ČGS) and from Plzeňský kraj and Prague. NGÚP did not reliably aggregate ÚAP in 2026 (prior notes).

### Cited Findings
**Per-kraj evidence.** "Old list" means the undated GitHub list [geosense/WMSchecker `list_complete.json`](https://github.com/geosense/WMSchecker/blob/master/list_complete.json). Its endpoints mostly use `http://`, typical of the 2010s; none was checked live.

| Kraj | What was found | Machine-readable? | Source |
|---|---|---|---|
| Hl. m. Praha | IPR Geoportal open data under CC BY ("data base © IPR Praha"). Old WMS of the then-valid ÚP SÚ hl. m. Prahy at `mpp.praha.eu/arcgis/services/PUP/Uzemni_plan_platny/MapServer/WmsServer`. Archive WMS of historical ÚPs 1955–2009. See §3. | Yes (WMS, open data) | [Geoportal Praha – open data](https://www.geoportalpraha.cz/en/data-and-services/open-data); old list |
| Středočeský | No current ÚP mosaic found. An early-2000s ÚÚR survey said the kraj had scanned all municipal ÚPs for an intranet presentation. ZÚR WMS at `up.webmap.cz/stredocesky/zasady-uzemniho-rozvoje/mapy` (old list). | ZÚR only | [ÚÚR 05_anketa](https://www.uur.cz/media/zx3jf2bg/05_anketa.pdf); old list |
| Jihočeský | Geoportal page "Územní plánování" with links. Per-municipality ÚP WMS on `gis.kraj-jihocesky.gov.cz/arcgis/services/DMVS_upd/UP_<obec>/MapServer/WMSServer`, e.g. UP_Kvilda and UP_Borova_Lada (old list). | Per-municipality WMS | [Geoportál JčK – územní plánování](https://geoportal.kraj-jihocesky.gov.cz/portal/odkazy/uzemni-planovani); old list |
| Plzeňský | Per-municipality UPD WMS on `ags.kr-plzensky.cz/arcgis/services/UPD/<obec>/MapServer/WMSServer`, e.g. Horska_Kvilda and Modrava. ÚAP WMS `ags.kr-plzensky.cz/arcgis/services/UAP/UAP_ORP_vse/MapServer/WMSServer` (old list). The geoportal hosts the MMR JS methodology (prior notes). | Per-municipality WMS + ÚAP WMS | old list; [geoportal.plzensky-kraj.cz](https://geoportal.plzensky-kraj.cz/portal/metodicky-pokyn-standard-vybranych-casti-uzemniho-planu) |
| Karlovarský | Its own digitisation methodology **MINIS-K v2.4**, the 2026 JS subsidy (§1) and digitisation meetings. No mosaic service found. | Unknown | [MINIS-K v2.4](https://wwwtest.kr-karlovarsky.cz/system/files/migrate/region/uzemni/dokumenty/MINIS-K_v24.pdf); [KK prezentace 2026](https://www.kr-karlovarsky.cz/system/files/2026-01/6_prezentace_UPD_2026.pdf) |
| Ústecký | Nothing found. A 2004 survey noted only a plan for a new ÚP VÚC. | Unknown | [ÚÚR 05_anketa](https://www.uur.cz/media/zx3jf2bg/05_anketa.pdf) |
| Liberecký | Digital map system of public administration (DMVS) at `dmvs.kraj-lbc.cz`, online since Nov 2015. No ÚP mosaic confirmed. | Unknown | [kraj-lbc.cz item 520501](https://kraj-lbc.cz/aktuality/case:detailPdf/itemId:520501/cgId:15623) / [511600](https://www.kraj-lbc.cz/aktuality/case:detailPdf/itemId:511600/cgId:15623) (search summary) |
| Královéhradecký | UPD WMS at `up.kr-kralovehradecky.cz/upd/wms/` and `/upd/_mapy/wms.dll` (old list). INSPIRE "Využití území" WMS: `mapy.khk.cz/mapywms/isapi.dll?service=WMS&request=GetCapabilities`. MINIS applied as the recommended ÚP methodology. A 2007 online register of ÚPD at wmap.cz/upd. | WMS (strongest) | old list; Micka record, one of: [5881d223](https://h4e.focal.cesnet.cz/micka/record/full/5881d223-d510-469a-aa44-2340c0a80137), [639833ed](https://h4e.focal.cesnet.cz/micka/record/full/639833ed-9738-478d-955c-2154c0a8017c); [khk.cz MINIS](https://khk.cz/system/files/MINIS.pdf); [thesis abstract](https://invenio.nusl.cz/record/260335?ln=en); [KHK 2007](https://old.khk.cz/assets/26.6.2007_ALDIS_pasportizace.pdf) |
| Pardubický | MINIS, the "Minimální standard pro digitální zpracování ÚP v GIS", originated here in 2006. No service found. | Unknown | [khk.cz – MINIS HK 2011](https://khk.cz/system/files/110622_MINIS_HK.pdf); [khk.cz MINIS](https://khk.cz/system/files/MINIS.pdf) (search summary) |
| Vysočina | PÚPO portal (pupo.kr-vysocina.cz) with a list of documentations and a ZÚR map application. ZÚR WMS `geoportal.kr-vysocina.cz/arcgis/services/ZUR/RozvojoveOblasti/MapServer/WMSServer` (old list). | Portal; ZÚR WMS | [ÚÚR 11-portalvysoc](https://www.uur.cz/media/hw3lk42q/11-portalvysoc.pdf); [pupo.kr-vysocina.cz](https://pupo.kr-vysocina.cz/napoveda/o-portalu/UP); old list |
| Jihomoravský | INSPIRE dataset "Využití území – kraj Jihomoravský" with WMS `mapy2.jmk.cz/ogc/wms/jmk_inspire`; coverage (ZÚR vs municipal ÚP) not stated. A MUNI lecture mentions a map composition "Územní plány v MINISu". | WMS (scope unclear) | [Micka record](https://h4e.focal.cesnet.cz/micka/record/full/584931a5-7b60-4f40-b6c0-5412c0a80138); [MUNI GIS_VS_07](https://is.muni.cz/el/sci/podzim2019/Z7262/um/GIS_VS_07_fin.pdf?lang=cs) |
| Olomoucký | Nothing found. | Unknown | — |
| Zlínský | INSPIRE view service and download service "Využití území – kraj Zlínský". The download data are "odvozena z ploch a koridorů Zásad územního rozvoje"; published 2017-01-16, metadata 2024-10-15. Separate page "Územní plány obcí Zlínského kraje" (prior notes). | ZÚR only (INSPIRE WMS/download) | INSPIRE Geoportal records (exact mapping not identified): [B8BDDDA0](https://inspire-geoportal.ec.europa.eu/srv/api/records/%7BB8BDDDA0-DD2A-4E4A-9CE0-D716F503834F%7D), [3DFD2C9B](https://inspire-geoportal.ec.europa.eu/srv/api/records/%7B3DFD2C9B-7023-4883-B7F5-DBC3C70BC4D4%7D) |
| Moravskoslezský | Geoportal app "Územní plány obcí". Its overview "umožňuje zobrazit a stáhnout územní plány obcí … včetně jejich změn ve formátu **PDF**", shows the výkresy over admin boundaries and parcels, and declares outputs "informativní". The kraj also publishes ÚAP 2025 documents. | Viewer + PDF, not vector | [geoportal.msk.cz – help](https://geoportal.msk.cz/Public/UzemniPlanyObci/PrehledUP/files/help-cs.pdf); [archiweb](https://archiweb.cz/en/n/home/moravskoslezsky-kraj-umistil-na-web-uzemni-plany-obci); [ÚAP MSK 2025](https://geoportal.msk.cz/Public/UAPMSK/2025/Texty/Podklady_RURU_MSK_textova_cast.pdf) |

- A 2004 survey found that only some kraje had or were preparing a methodology for digital ÚP data, so practice has long been uneven. — [ÚÚR 05_anketa](https://www.uur.cz/media/zx3jf2bg/05_anketa.pdf) (via search summary)
- Searches for a national list of kraj mosaic services found none. The INSPIRE "Využití území" (land use) theme is the channel through which at least the JMK, KHK and Zlín records appear. — [INSPIRE Geoportal records as above](https://inspire-geoportal.ec.europa.eu/srv/api/records/%7BB8BDDDA0-DD2A-4E4A-9CE0-D716F503834F%7D)

**ÚAP / limity as WMS**
- WMS services named for ÚAP from national data providers (old list):
  - AOPK ČR: `gis.nature.cz/arcgis/services/UzemneAnalytickePodklady/UdajeOUzemi/MapServer/WMSServer`;
  - NPÚ: `geoportal.npu.cz/arcgis/services/TematickeMapy/CP_UAP_PVO/MapServer/WMSServer`;
  - ČGS: `mapy.geology.cz/arcgis/services/Dulni_Dila/Udaje_o_uzemi/MapServer/WMSServer`.
  
  Kraj and city services:
  - Plzeňský kraj: `ags.kr-plzensky.cz/…/UAP/UAP_ORP_vse`;
  - IPR Praha: `mpp.iprpraha.cz/arcgis/services/UAP/UAP_2014/MapServer/WmsServer`.
  
  — [geosense/WMSchecker list](https://github.com/geosense/WMSchecker/blob/master/list_complete.json)
- IPR Praha publishes its ÚAP on the geoportal. — [Geoportal Praha – ÚAP](https://geoportalpraha.cz/en/data-and-services/articles-and-projects/uap)
- Under vyhl. 157/2024, the graphic part of every údaj o území is supplied "ve vektorové formě" in S-JTSK and Bpv, unless příloha č. 1 says otherwise (§ 4(1)). A poskytovatel may meet the duty through the krajský úřad (§ 4(3)). — [157/2024 – e-Sbírka](https://e-sbirka.gov.cz/eli/cz/sb/2024/157/2026-01-01) ([mirror](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2024/157-2024.md))
- Příloha č. 1 to 157/2024 (version of 1 Jan 2026), "Sledované jevy databáze územně analytických podkladů", lists **113 numbered jevy**. They run from "1 zastavěné území, 2 využití území, 3 brownfield, 4 nemovitá … kulturní památka a jejich ochranné pásmo …, 8 struktura a výška zástavby …" to "112 regionalizace území podle míry ohrožení suchem, 113 další dostupné informace o území". The count comes from my parse of the mirror text. This fills the prior note's gap on the 157/2024 list (the old 500/2006 list had 119). — [157/2024 příloha č. 1 – e-Sbírka](https://e-sbirka.gov.cz/eli/cz/sb/2024/157/2026-01-01) ([mirror](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2024/157-2024.md))

### Inferences
- **Pilot-region implications.** A single-city pilot (Praha or Brno, §§3–4) avoids the kraj-mosaic problem: one ÚP, one data owner, and in Prague a CC BY licence.
- For a kraj pilot, the evidence favours **Královéhradecký**, which has a dedicated UPD WMS server, an INSPIRE land-use WMS and a long MINIS tradition that harmonized ÚP data before JS. Next would be **Plzeňský** or **Jihočeský**, but their per-municipality WMS layers mean no seamless mosaic.
- **Moravskoslezský** is easy for humans but gives only PDFs, so it would need georeferencing and vectorization.
- A WMS gives a picture, not attributes. A parcel→plocha join needs WFS, Shapefile or the JS ZIP. None of the kraj services found is confirmed to offer WFS or a download.
- ÚAP limity exist as WMS from national providers. A practical engine should read these at source (AOPK, NPÚ, ČGS, ČÚZK, etc.) rather than through kraj ÚAP compilations, and treat ÚAP only as a pointer to the binding limit.

### Gaps
- No 2026-verified service URL, licence, update date or WFS/download availability exists for any kraj mosaic. All 14 kraj geoportals and Micka must be checked directly.
- Olomoucký, Ústecký, Pardubický, Liberecký, Středočeský and Karlovarský: no ÚP-mosaic evidence at all in this session.
- Whether the JMK and KHK INSPIRE "Využití území" datasets contain municipal ÚP plochy or only ZÚR is unknown.

## 3. Prague: IPR geoportal and open data, 2026 status of ÚP SÚ hl. m. Prahy and the Metropolitní plán, download formats and licence, validity of the Pražské stavební předpisy

### Takeaway
The **Metropolitní plán**, i.e. the Územní plán hl. m. Prahy, was issued by the Zastupitelstvo HMP on **28 May 2026** (usnesení č. 34/2). It took effect on **1 Sep 2026**, replacing the 1999 Územní plán SÚ hl. m. Prahy. A transitional rule protects proceedings already started. No court annulment was reported in the results.

IPR Praha's open geodata are licensed **CC BY 4.0**, with the attribution "data base © IPR Praha". WMS services existed for the old valid ÚP and for historical plans. **Whether the Metropolitní plán itself is published as open vector data (SHP/GeoJSON/WFS) was not confirmed.**

The old Pražské stavební předpisy (nař. 10/2016 and 14/2018) were **repealed by § 334 of the new stavební zákon**. Prague replaced them with **nařízení hl. m. Prahy č. 12/2024, o požadavcích na výstavbu v hlavním městě Praze (pražské stavební předpisy)**, adopted by the Rada HMP on 24 Jun 2024. It applies in 2026 alongside vyhl. 146/2024 and overrides it where it differs.

### Cited Findings
**Metropolitní plán (MP)**
- Usnesení ZHMP č. 34/2 of 28 May 2026 issues the "Územní plán hlavního města Prahy (Metropolitní plán)". The search summary renders it as approving that the draft "is not subject to the requirement of § 54 par. 2 of Act No. 183/2006 Coll.". The original wording was not visible: either way it cites the **old act** (183/2006), which indicates the plan was completed under the transitional procedural rules. — [praha.eu – usnesení č. 34/2](https://praha.eu/documents/d/praha/usneseni-c-34_2); [příloha 1 usnesení (OOP)](https://praha.eu/documents/d/upn/priloha-1-usneseni-oop-pdf)
- Effective date and replacement: "Praha má nový územní plán, začne platit 1. září a nahradí nynější dokument z roku 1999". Sources give the start of preparation as 2012 or 2013; the summaries did not say which outlet says which. — [ČT24](https://ct24.ceskatelevize.cz/clanek/regiony/hlavni-mesto-praha/praha-ma-novy-uzemni-plan-zacne-platit-od-zari-373990); [kurzy.cz](https://zpravy.kurzy.cz/861422-metropolitni-plan-schvalili-zastupitele-ucinny-bude-od-zari/); [Forbes](https://forbes.cz/praha-schvalila-novy-uzemni-plan-platit-zacne-od-zari/)
- TZB-info confirms "nabýt účinnosti 1. září" 2026. The decisive question for pending projects is whether the permit proceeding was started before the plan took effect. The odůvodnění states that a proceeding "je zahájeno dnem podání žádosti", and the transitional article (čl. 167) also covers appeal, review and court proceedings. — [TZB-info](https://www.tzb-info.cz/30179-schvaleny-metropolitni-plan-hlavniho-mesta-prahy-vyvolava-radu-otazek-od-1-zari-letosniho-roku-ma-nabyt-ucinnosti); [epravo – Metropolitní plán schválen](https://www.epravo.cz/top/clanky/metropolitni-plan-schvalen-je-vas-projekt-v-bezpeci-121251.html)
- Before approval, Estav wrote that the old plan's validity ends in Dec 2028. This matches the § 322(1) backstop for pre-2007 plans; the old plan actually lapses when the MP takes effect. — [estav.cz](https://www.estav.cz/cz/14605.metropolitni-plan-prahy-podle-ceho-se-v-praze-bude-stavet); [283/2021 § 322 (mirror)](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2021/283-2021.md)
- Political risk: Nova reported concerns after approval, and Newstream reported that ANO wants to start reworking the plan immediately. — [TN Nova](https://tn.nova.cz/zpravodajstvi/tema/16869-magistrat/strana-9); [Newstream – štítek MP](https://www.newstream.cz/stitek/metropolitni-plan) (via search summary)
- A legal-commentary article notes the general rule since 2026: in incidental review (incidenční přezkum) of an OOP, where the proposal was filed after the one-year period, the court cannot annul the ÚP. — [epravo – Jak se bránit proti ÚP](https://www.epravo.cz/top/clanky/jak-se-branit-proti-uzemnimu-planu-121537.html?pdf=1) (via search summary; not verified against the statute)

**IPR geoportal / open data**
- Open data licence: "CC BY licence with text: „data base © IPR Praha“". Works built on the data from the GIS Praha data warehouse should cite CC BY 4.0 and include "IPR Prague data source". Data requests go to `vydej@ipr.praha.eu`. — [Geoportal Praha – open data](https://www.geoportalpraha.cz/en/data-and-services/open-data); [Geoportal Praha – licence document](https://geoportalpraha.cz/backend/getdokument/1/en); [How to obtain data](https://geoportalpraha.cz/en/data-and-services/how-to-obtain-data)
- A DCAT-style feed of IPR open data exists at `http://opendata.iprpraha.cz/feed.xml`. — via search summary of [Geoportal Praha – open data](https://www.geoportalpraha.cz/en/data-and-services/open-data)
- IPR's archive WMS of historical ÚP výkresy 1955–2009 is at `https://gs-pub.praha.eu/arcgis/services/arch/uzemni_plany_archiv/MapServer/WmsServer`. — metadata record, one of: [h4e Micka 600e7eaf](https://h4e.focal.cesnet.cz/micka/record/xml/600e7eaf-2264-43c6-9a24-514b0a02080d), [geoportal.gov.cz Micka 2B395D1F](https://geoportal.gov.cz/php/micka/record/turtle/%7B2B395D1F-B2B3-44F4-B064-6235921E0F44%7D)
- An older WMS of the then-valid ÚP SÚ: `http://mpp.praha.eu/arcgis/services/PUP/Uzemni_plan_platny/MapServer/WmsServer`. — [geosense/WMSchecker list](https://github.com/geosense/WMSchecker/blob/master/list_complete.json) (undated)
- Prague's datasets are "freely available as open data", offered as georeporty or open datasets. The source does not mention the MP or SHP specifically. — [Forbes.cz](https://forbes.cz/vime-o-meste-temer-vse-tvrdi-praha-dostala-oceneni-za-to-jak-pri-planovani-spoleha-na-data/)

**Pražské stavební předpisy (PSP) in 2026**
- § 334 of zákon 283/2021 (Zrušovací ustanovení), as amended by 152/2023, lists among the repealed acts item 58, "Nařízení hlavního města Prahy č. 10/2016 Sb. hl. m. Prahy, kterým se stanovují obecné požadavky na využívání území a technické požadavky na stavby v hlavním městě Praze (pražské stavební předpisy)". Item 59 repeals its amendment **č. 14/2018 Sb. hl. m. Prahy**. The same two items appear in the text of 152/2023. — [283/2021 – e-Sbírka](https://e-sbirka.gov.cz/eli/cz/sb/2021/283/2026-06-11) ([mirror](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2021/283-2021.md)); [152/2023 – e-Sbírka](https://e-sbirka.gov.cz/eli/cz/sb/2023/152/2026-07-01) ([mirror](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2023/152-2023.md))
- **Legal basis for a Prague regulation:**
  - § 152(2): "Územní samosprávné celky, které jsou k tomu tímto zákonem zmocněny, mohou stanovit prováděcím právním předpisem podrobné požadavky na výstavbu odchylně od prováděcího právního předpisu podle odstavce 1". This excludes dálnice, silnice, dráhy, civilní letecké stavby and the technical requirements for TI.
  - § 152(3): the national decree applies "nestanoví-li prováděcí právní předpis podle odstavce 2 jinak".
  - § 333(3): "Hlavní město Praha, statutární město Brno a statutární město Ostrava mohou v přenesené působnosti vydat nařízení k provedení § 152 odst. 2."
  
  — [283/2021 – e-Sbírka](https://e-sbirka.gov.cz/eli/cz/sb/2021/283/2026-06-11) ([mirror](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2021/283-2021.md))
- The new regulation is "Nařízení hlavního města Prahy č. 12/2024, o požadavcích na výstavbu v hlavním městě Praze (pražské stavební předpisy)". "Rada hlavního města Prahy se usnesla dne 24. 6. 2024 vydat podle § 44 odst. 2 zákona …". It sets requirements on vymezování pozemků, umisťování staveb and technical requirements. — [praha.eu – nařízení č. 12/2024](https://m.praha.eu/documents/d/praha/narizeni-c-12-2024-o-pozadavcich-na-vystavbu-v-hlavnim-meste-praze); [Sbírka právních předpisů ÚSC – Hl. m. Praha](https://sbirkapp.gov.cz/detail/SPPDFBZDKD366UXQ/text)
- IPR says the Prague regulation applies together with vyhl. 146/2024 ("VPV") on Prague's territory, except where it sets something different under § 152. — [IPR Praha document](https://iprpraha.cz/assets/files/files/99be66fcdf1a34344e37e4682cca26de.pdf) (via search summary)
- MMR's parking methodology (Feb 2025), as summarized: outside Prague, Brno and Ostrava, 146/2024 applies, while within those cities the city regulations take precedence to the extent they regulate. — [MMR metodika parkovací stání (ÚÚR, 02/2025)](https://www.uur.cz/media/tcnpn2mw/16-parkovaci-stani_metodika_mmr_unor_2025.pdf)
- Ostrava has a city regulation "nm č. 17/2024" in its legal register; its title was not visible. — [ostrava.cz – nm č. 17/2024](https://ostrava.cz/cs/urad/pravni-predpisy/prilohy-vyhlasek/nm-c-17-2024); [sbirkapp – Ostrava](https://sbirkapp.gov.cz/detail/SPPF72QZJGSOC4YU/text)
- Parking is the most-discussed PSP topic. The old 2016 PSP split Prague into seven zones with a parking calculation based on hrubá podlažní plocha. Undated reports say Prague wanted to lower minimum parking for new homes, and that councillors approved allowing buildings "i bez parkovacích míst". — [e15](https://www.e15.cz/byznys/reality-a-stavebnictvi/je-to-mala-revoluce-tvrdi-o-prazskych-stavebnich-predpisech-developeri-1108793); [ČT24](https://ct24.ceskatelevize.cz/clanek/regiony/praha-chce-snizit-minimalni-pocty-parkovacich-stani-u-novych-domu-14641); [Echo24](https://echo24.cz/a/SFyUH/zpravy-domaci-parkovani-praha-zmena-stavebnich-predpisu-magistrat-nove-stavby-pirati-radnice-hrib-hlavacek)

### Inferences
- In 2026 a Prague RD check has four layers:
  1. stavební zákon;
  2. 146/2024 as amended by 97/2026;
  3. **nařízení 12/2024**, which overrides 146/2024 where it differs;
  4. the **Metropolitní plán** from 1 Sep 2026.
  
  For proceedings started before 1 Sep 2026, the 1999 ÚP still governs, so the engine needs both plans plus the date of the application.
- The MP was completed under the old procedural regime (the resolution cites 183/2006). It therefore probably was not required to be in the new JS format, a reading consistent with the transitional rules in the prior notes. Its data model is IPR's own. This is an inference.
- CC BY 4.0 permits commercial reuse with attribution. This makes Prague legally the easiest pilot for the ÚP layer, provided the MP vectors are published.

### Gaps
- Not confirmed:
  - whether MP vector data are on the IPR open-data catalogue, in which formats (SHP, GeoJSON, WMS/WFS), and how plochy, lokality and výšková regulace are encoded;
  - whether any návrh na zrušení of the MP was filed after 1 Sep 2026.
- The content of nařízení 12/2024 on odstupy, parking, rainwater, minimum plot size and insolation was not obtained.
- Unknown whether nařízení 12/2024 was amended in 2025–2026, e.g. to follow 97/2026, and its exact effective date (probably 1 Jul 2024 **[unverified]**).
- Whether Brno issued its own regulation under § 333(3) was not found.
- The October 2026 municipal elections, held 9–10 Oct 2026 per the Sbírka announcements in the mirror index, may affect MP revisions; outcome not checked.

## 4. Brno: status of the new Územní plán města Brna (ÚPmB) and whether its data are published

### Takeaway
The new ÚPmB was issued by the Zastupitelstvo města Brna on **10 Dec 2024** as **opatření obecné povahy č. 1/2025**. It took effect on **31 Jan 2025**, replacing the 1994 plan. The Krajský soud v Brně has annulled specific parts on individual applications, for example the locality behind Lužánky, and NSS cassation cases exist. The city maintains the ÚPmB as vector data in **MicroStation DGN**, but no public download or WMS/WFS for the ÚPmB was confirmed. Brno has an open-data portal (data.brno.cz, ArcGIS Hub) and gis.brno.cz.

### Cited Findings
- Issued 10 Dec 2024 as OOP č. 1/2025 and effective 31 Jan 2025; replaces the 1994 plan. — [MUNI publication (2025)](https://is.muni.cz/publication/2497118/cs); [upmb.brno.cz – odůvodnění](https://upmb.brno.cz/wp-content/uploads/2025/02/582786_oduvP4.pdf) (via search summary)
- The Krajský soud v Brně annulled the part of the plan regulating the locality behind Lužánky. — [Právní prostor](https://pravniprostor.cz/aktuality/soud-zrusil-cast-uzemniho-planu-brna-upravovala-vyuziti-lokality-za-luzankami)
- Further rulings on the ÚPmB are hosted on NGÚP (KS Brno 65 A 3/2025-62, 73 A 2/2025-84, 64 A 1/2025-290). The NSS dealt with a KS Brno judgment of 9 Sep 2025, sp. zn. 73 A 4/2025; its outcome was not visible. A search summary also mentions an annulment concerning plocha Z.171 in Líšeň, from an unidentified source. — [NGÚP – 65 A 3/2025](https://uzemniplanovani.gov.cz/documents/d/guest/65_a_3_2025_62_brno-pdf); [NGÚP – 73 A 2/2025](https://uzemniplanovani.gov.cz/documents/d/guest/73_a_2_2025_84_brno__redigovano-pdf); [NGÚP – KS Brno 64 A 1/2025](https://uzemniplanovani.gov.cz/documents/d/guest/ks_brno_64_a_1_2025_290_brno); [NSS vyhledávač](https://vyhledavac.nssoud.cz/DokumentOriginal/Index/740396)
- Data: a city contract annex states "Územní plán města Brna (ÚPmB) je digitálně zpracován a průběžně aktualizován v prostředí Microstation V8i ve formátu DGN". A tender requires the ÚPmB "ve vektorové podobě v úplném znění aktuálním ke dni podpisu Smlouvy vč. metodiky a datového modelu". — [ezak.brno.cz – příloha 3 SoD, digi požadavky](https://ezak.brno.cz/document_audit_23836/4_0_prilohasod_3_sod_digi_pozadavky-pdf); [smlouvy.gov.cz – Příloha 3 Digi požadavky](https://smlouvy.gov.cz/smlouva/soubor/31241795/Priloha_3_Digi_pozadavky.pdf); [zakazky.brno.cz](https://zakazky.brno.cz/file/?fileId=788)
- Open data: data.Brno publishes data without licence restrictions and catalogues them in NKOD. A 2021 article counted "over 110 datasets" on ArcGIS Hub. A 2023 city presentation says "Celkem evidujeme téměř 300 datových sad". The Kancelář architekta města used data.Brno when preparing the new ÚP. — [ÚÚR – Urbanismus a územní rozvoj 2021](https://www.uur.cz/media/d2qj0fe4/06-dikymestskemu.pdf); [DIA – Digitální mapy ve městě Brně](https://www.dia.gov.cz/wp-content/uploads/2023/12/Digitalni-mapy-ve-meste-Brne-Glosova.pdf)
- The plan itself is published on the ÚPmB portal upmb.brno.cz. — [ČT24 (older)](https://ct24.ceskatelevize.cz/clanek/regiony/brno-zverejnilo-navrh-noveho-uzemniho-planu-lide-se-s-nim-mohou-seznamit-na-internetu-52424); [upmb.brno.cz](https://upmb.brno.cz/wp-content/uploads/2025/02/582786_oduvP4.pdf)
- Brno is one of the three cities entitled to issue its own building regulation deviating from 146/2024 (§ 333(3)). — [283/2021 – e-Sbírka](https://e-sbirka.gov.cz/eli/cz/sb/2021/283/2026-06-11) ([mirror](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2021/283-2021.md))

### Inferences
- Brno is a strong single-city pilot:
  - one new ÚP, in force since 2025 under the old act's procedure;
  - authoritative vector data held by the city in DGN, which converts to GIS with a known data model;
  - an established open-data culture.
- The main legal risk is partial court annulments. The engine must apply the ÚPmB "as amended by court rulings" and track NGÚP-hosted rulings.
- If Brno has no § 333(3) regulation, Brno RD checks need only zákon + 146/2024 + ÚPmB, which is simpler than Prague. Whether such a regulation exists is unverified.

### Gaps
- Whether ÚPmB vector data or WMS/WFS are publicly downloadable from data.brno.cz or gis.brno.cz, and under which licence: not confirmed.
- Whether the ÚPmB is in JS: not found.
- The full list and outcomes of the court annulments as of Oct 2026: not compiled.
- Whether Brno issued a regulation under § 333(3): not found.

## 5. Vyhláška 146/2024 Sb. ve znění vyhl. 97/2026 Sb. (od 1. 7. 2026) and the statute: rules that constrain a family house (odstupy, plot size, parking, rainwater, connections, oslunění)

### Takeaway
The amendment is **vyhláška č. 97/2026 Sb. ze dne 3. června 2026**, effective **1 Jul 2026**. Projects whose permit documentation was prepared before that date follow the old wording (čl. II). For a rodinný dům (RD) the binding national rules are short:
- **Distances:** **≥ 2 m from the plot boundary** (§ 11(2)), with listed exceptions. There is **no 7 m house-to-house rule** any more. Instead there is a shading test: a **45° odstupový úhel** from existing neighbouring windows (§ 20(4) + příloha č. 4 from 1 Jul 2026).
- **Plot size:** no national minimum.
- **Parking:** **1 stání per 120 m² podlahové plochy** (§ 7 + příloha č. 1), adjustable by the ÚP.
- **Daylight and insolation:** window area ≥ 1/10 of the floor area (§ 20(1) from 1 Jul 2026), and no proslunění duty for dwellings.
- **Rainwater:** since 1 Jul 2026 the decree has **no stormwater section**, because 97/2026 replaced § 8 "Hospodaření se srážkovými vodami" with bicycle parking. Rainwater is governed by **§ 140(3)(c) stavebního zákona** and **§ 5(3) vodního zákona**.
- **Access and utilities:** dopravní napojení on a "kapacitně vyhovující veřejně přístupnou pozemní komunikaci" (§ 140(2) SZ), napojení na TI (§ 143(2) SZ), and an electronic-communications connection (§ 43(5)).

### Cited Findings
**Sources and versions (read in full)**
- 146/2024 consolidated "ve znění od 1. 7. 2026" (ELI /eli/cz/sb/2024/146/2026-07-01). — [e-Sbírka](https://e-sbirka.gov.cz/eli/cz/sb/2024/146/2026-07-01) ([mirror](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2024/146-2024.md)). Original 2024 wording: [e-Sbírka](https://e-sbirka.gov.cz/eli/cz/sb/2024/146/2024-07-01) ([mirror](https://github.com/legalize-dev/legalize-cz/blob/main/cz/SB-2024-146.md))
- 97/2026 Sb.:
  - "Vyhláška, kterou se mění vyhláška č. 146/2024 Sb., o požadavcích na výstavbu", ze dne 3. června 2026, signed by Mgr. Mrázová.
  - Čl. II: "U staveb, pro které byla dokumentace pro povolení stavby zpracovaná před účinností této vyhlášky, se postupuje podle vyhlášky č. 146/2024 Sb., ve znění účinném přede dnem nabytí účinnosti této vyhlášky."
  - Čl. IV: účinnost 1. července 2026.
  - It implements directive (EU) 2024/1275 (EPBD) on bicycle parking and charging points.
  
  — [e-Sbírka 97/2026](https://e-sbirka.gov.cz/eli/cz/sb/2026/97/2026-07-01) ([mirror](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2026/97-2026.md)); press: [Právní prostor](https://pravniprostor.cz/zmeny-v-legislative/vyslo-ve-sbirce-zakonu/novela-vyhlasky-o-pozadavcich-na-vystavbu), [TZB-info – nové požadavky na výstavbu](https://www.tzb-info.cz/30174-nove-pozadavky-na-vystavbu)
- This closes the prior note's open question: the "Sb_2026_97" file is the amending decree **č. 97/2026 Sb.**. (One search summary wrongly called it a "zákon".) — [e-Sbírka 97/2026](https://e-sbirka.gov.cz/eli/cz/sb/2026/97/2026-07-01)
- Statute: zákon 283/2021 Sb. ve znění od 11. 6. 2026 — [e-Sbírka](https://e-sbirka.gov.cz/eli/cz/sb/2021/283/2026-06-11) ([mirror](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2021/283-2021.md)). Vodní zákon 254/2001 Sb. ve znění od 1. 6. 2026 — [e-Sbírka](https://e-sbirka.gov.cz/eli/cz/sb/2001/254/2026-06-01) ([mirror](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2001/254-2001.md))

**What counts as an RD, and its permit category (statute)**
- § 13 písm. c) SZ: "rodinným domem stavba pro bydlení, ve které více než polovina podlahové plochy slouží bydlení, a která má nejvýše tři samostatné byty, nejvýše dvě nadzemní a jedno podzemní podlaží a podkroví, nebo třetí nadzemní podlaží ustoupené od vnějšího líce obvodové stěny budovy orientované k uliční čáře alespoň o 2 metry". § 13 písm. n) defines podlahová plocha, and písm. p) defines "zastavěná plocha pozemku" as the sum of the zastavěné plochy of all buildings. — [283/2021 – e-Sbírka](https://e-sbirka.gov.cz/eli/cz/sb/2021/283/2026-06-11) ([mirror](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2021/283-2021.md))
- Příloha č. 2 SZ (jednoduché stavby), odst. 1 písm. a): "stavby pro bydlení a rodinnou rekreaci, které mají nejvýše dvě nadzemní a jedno podzemní podlaží a podkroví nebo ustoupené podlaží". — [283/2021 příloha č. 2 (mirror)](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2021/283-2021.md)
- Příloha č. 2 odst. 1 písm. q) SZ covers a secondary dwelling on the RD plot:
  - at most 80 m² zastavěné plochy and 5 m height;
  - one NP, no basement;
  - functionally linked to the RD;
  - placed **≥ 2 m from plot boundaries**;
  - not for business;
  - afterwards at least **50 %** of the plot must remain "schopn[é] vsakovat dešťové vody";
  - the ÚP's roof-slope rules do not apply.
  
  Since 1 Jul 2026, **§ 10(2) vyhl. 146/2024** allows such buildings on an RD plot. — [283/2021 (mirror)](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2021/283-2021.md); [146/2024 § 10 (mirror)](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2024/146-2024.md)

**Odstupy (distances)**
- **§ 11(2):** "Stavba musí být umístěna minimálně 2 m od hranice pozemku vyjma pozemku veřejného prostranství." — [146/2024 (1. 7. 2026)](https://e-sbirka.gov.cz/eli/cz/sb/2024/146/2026-07-01) ([mirror](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2024/146-2024.md))
- **§ 11(3):** § 11(2) does not apply:
  - (a) to a building up to 2 m high;
  - (b) to roads, railways, waterways, aviation structures and technical and green infrastructure — and from 1 Jul 2026 also "odstavných, manipulačních, prodejních, skladových, výstavních a jiných zpevněných ploch";
  - (c) "je-li takový způsob zástavby v místě obvyklý, odpovídá charakteru území nebo vyplývá ze způsobu parcelace".
  
  — [146/2024 (mirror)](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2024/146-2024.md); [97/2026 bod 14 (mirror)](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2026/97-2026.md)
- **§ 11(4):** a building on the boundary may have no stavební otvory in the wall facing the boundary, except towards veřejné prostranství, and must prevent "stékání srážkových vod a spadu sněhu ze stavby na sousední pozemek". — [146/2024 (mirror)](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2024/146-2024.md)
- **§ 11(1):**
  - Placement follows the stavební čára "stanovenou podle převažujícího charakteru zástavby".
  - Since 1 Jul 2026 the second sentence reads: "Umístěním stavby nesmí být znemožněna budoucí zástavba sousedního pozemku nebo ohrožena stávající zástavba sousedního pozemku." It was moved here from § 11(2).
  - § 11(5)–(6) cover předsazené části, with ≥ 4.95 m clearance above the road.
  
  — [146/2024 (mirror)](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2024/146-2024.md); [97/2026 body 12–13 (mirror)](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2026/97-2026.md)
- **§ 11(7), new from 1 Jul 2026:** "Vzdálenosti se měří na nejkratší spojnici mezi hranicí pozemků a vnějšími povrchy obvodových stěn, dále balkonů, teras, lodžií". For objects without walls, the measurement is to the outer faces of vertical structures. — [97/2026 bod 15 (mirror)](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2026/97-2026.md)
- **No national house-to-house minimum:**
  - The consolidated 146/2024 contains no 7 m (or 4 m) distance between RDs. A text search of the mirror found no such rule.
  - The statute says only that "Vzájemné odstupy staveb musí splňovat požadavky urbanistické, architektonické a požadavky stanovené prováděcím právním předpisem a jinými právními předpisy" and "musí umožňovat údržbu staveb" (§ 144).
  - The 7 m / 2 m / 4 m rules in the prior notes belong to the repealed vyhl. 501/2006 § 25.
  
  — [146/2024 (mirror)](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2024/146-2024.md); [283/2021 § 144 (mirror)](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2021/283-2021.md)
- **§ 20(4)–(5), the shading test that replaces a fixed distance:**
  - "Stavba se navrhuje a provádí s ohledem na zastínění obytných a pobytových místností stávající budovy ovlivněné navrhovanou stavbou, s výjimkou pobytové místnosti ve stavbě pro bydlení a bytu v podzemním podlaží."
  - From 1 Jul 2026 a further sentence applies: "Požadavky na zastínění jsou splněny dodržením odstupového úhlu stínění 45o od okna stávající obytné nebo pobytové místnosti podle přílohy č. 4."
  - A building in a stavební proluka is compared instead with a notional continuous development (§ 20(5)).
  - § 20(6), which required calculations to include planned changes in the area, was repealed on 1 Jul 2026.
  
  — [146/2024 (mirror)](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2024/146-2024.md); [97/2026 body 22–23 (mirror)](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2026/97-2026.md)
- **Příloha č. 4 "Odstupový úhel" (from 1 Jul 2026):**
  - The test is met "pokud žádná navržená překážka nezasahuje do volného prostoru, vymezeného nad vertikálním úhlem 45° a v půdorysné výseči (horizontálním úhlu) alespoň 45°".
  - It is measured from a control point at the centre of the existing window, at sill height or 1 m above the floor.
  - The horizontal angle is counted at least 25° from the façade and "nelze jej sčítat z částí".
  - Obstacles include the proposed building, walls and proposed terrain.
  - The annex includes a graphical diagram method.
  - This annex replaced the old příloha č. 4 "Schodiště a šikmá rampa".
  
  — [97/2026 bod 75 (mirror)](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2026/97-2026.md); [original 146/2024 annex list (mirror)](https://github.com/legalize-dev/legalize-cz/blob/main/cz/SB-2024-146.md)

**Minimum plot size**
- Neither 146/2024 nor the statute sets a minimum plot area for an RD.
  - The statute requires functionally that "Stavební pozemek se vždy vymezuje tak, aby svými vlastnostmi, zejména velikostí, polohou, plošným a prostorovým uspořádáním, umožňoval umístění, realizaci a užívání stavby pro navrhovaný účel" (§ 140(2)).
  - Plots "nesmí být děleny tak, aby bylo vyloučeno jejich účelné využití" (§ 140(1)).
  - The phrase "rozmezí výměry pro vymezování stavebních pozemků" from the old vyhl. 500/2006 příloha 7 does not appear in 283/2021 or in 157/2024.
  
  — [283/2021 § 140 (mirror)](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2021/283-2021.md); [157/2024 (mirror)](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2024/157-2024.md); [146/2024 (mirror)](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2024/146-2024.md)

**Parking (parkovací stání)**
- **§ 7(1)–(3):**
  - Parking spaces are designed "v počtu podle přílohy č. 1".
  - They must be part of the building or on its plot.
  - If that is impossible, they go on a plot within 300 m, measured as the shortest line.
  - § 7(5), cycle parking for občanské vybavení, was repealed on 1 Jul 2026.
  
  — [146/2024 (mirror)](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2024/146-2024.md); [97/2026 bod 6 (mirror)](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2026/97-2026.md)
- **Příloha č. 1, tabulka č. 1:**
  - Code **1a "bydlení"**: účelová jednotka = podlahová plocha (§ 13 písm. n) SZ), **120 m² per 1 stání**, 10 % krátkodobých / 90 % dlouhodobých.
  - From 1 Jul 2026, code **1b "dům pro dostupné nájemní bydlení"**: 240 m² per stání.
  - From 1 Jul 2026, "Pro výpočet stání pro bydlení se do podlahové plochy nezapočítává plocha garáží, technických místností a balkonů". In buildings with two or more units, shared corridors and stairs are also excluded.
  - Rounding: ≥ 0.5 rounds up and < 0.5 rounds down, applied only at the end of the calculation (bod 1.3).
  - The ÚP, a ÚP s prvky RP or a RP may set a "procentuální korekce" defining the minimum required and maximum permitted number (bod 1.1).
  
  — [146/2024 příloha č. 1 (mirror)](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2024/146-2024.md); [97/2026 body 70–71 (mirror)](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2026/97-2026.md)
- MMR's methodology: since 1 Jul 2024 a calculation under ČSN 73 6110 is no longer allowed, and a regulační plán may set the number entirely differently. Its example is one stání for a 120 m² byt. — [MMR metodika parkovací stání (02/2025)](https://www.uur.cz/media/tcnpn2mw/16-parkovaci-stani_metodika_mmr_unor_2025.pdf) (via search summary)
- The statute also requires the plot to accommodate "umístění odstavných a parkovacích stání pro účel využití pozemku" (§ 140(3)(a)). — [283/2021 (mirror)](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2021/283-2021.md)
- From 1 Jul 2026:
  - Bicycle parking (§ 8 + příloha č. 2) applies to new non-residential buildings (≥ 15 % of average or 10 % of total capacity) and to bytové domy (2 places per unit), each where the building has more than 5 or more than 3 parking spaces respectively.
  - EV charging (§ 61) covers non-residential buildings and bytové domy.
  - Neither provision mentions rodinné domy.
  
  — [97/2026 body 7, 58, 73 (mirror)](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2026/97-2026.md)

**Rainwater (vsakování / retence)**
- Original § 8 "Hospodaření se srážkovými vodami", in force 1 Jul 2024 – 30 Jun 2026, required:
  - (1) compliance "v souladu s normou";
  - (2) that runoff not endanger the plot or its surroundings;
  - (3) "propojení srážkové vody s vegetací, je-li to technicky možné".
  
  97/2026 bod 7 replaced the whole § 8 with "Parkovací místa pro jízdní kola". Since 1 Jul 2026, 146/2024 keeps only incidental water clauses: § 11(4) (runoff onto the neighbour) and § 41(6) (the sewer connection must drain splaškové and srážkové vody safely). — [original 146/2024 § 8 (mirror)](https://github.com/legalize-dev/legalize-cz/blob/main/cz/SB-2024-146.md); [97/2026 bod 7 (mirror)](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2026/97-2026.md); [146/2024 consolidated (mirror)](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2024/146-2024.md)
- **§ 140(3)(c) SZ:** the stavební pozemek must provide for "hospodaření se srážkovými vodami jejich":
  1. "akumulací a následným využitím, vsakováním nebo výparem, pokud to hydrogeologické poměry, velikost pozemku a jeho výhledové využití umožňují a pokud nejsou vsakováním ohroženy okolní stavby nebo pozemky";
  2. "odváděním do vod povrchových prostřednictvím dešťové kanalizace", if infiltration and accumulation are impossible;
  3. "regulovaným odváděním do jednotné kanalizace", if discharge to surface water is impossible.
  
  § 140(4) allows proving this using other plots. — [283/2021 (mirror)](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2021/283-2021.md)
- **§ 5(3) vodního zákona:** the stavebník must secure:
  - water supply;
  - wastewater disposal: by kanalizace; if unavailable, by direct treatment and discharge; if technically impossible, by a žumpa;
  - limitation of stormwater runoff "akumulací a následným využitím, popřípadě vsakováním na pozemku, výparem, anebo … jejich zadržováním a řízeným odváděním".
  
  "Bez splnění těchto podmínek nesmí být povolena stavba". — [254/2001 ve znění od 1. 6. 2026 – e-Sbírka](https://e-sbirka.gov.cz/eli/cz/sb/2001/254/2026-06-01) ([mirror](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2001/254-2001.md))
- The **0.4 / 0.3 infiltration ratio** from 501/2006 § 21(3) is no longer in the national decree. MŽP's methodical recommendation (2021, republished 11/2024) still quotes it. The statute uses a **50 %** "plocha části pozemku schopného vsakovat dešťové vody" only as a condition for permit-free or simple accessory structures and terrain works on RD plots:
  - Příloha č. 1 SZ ("Drobné stavby"), odst. 1 písm. a) bod 1: a building up to 40 m² and 5 m on an RD plot, ≥ 2 m from the boundaries;
  - § 214(1) písm. e) ("Změny nevyžadující povolení"): terrain modifications affecting infiltration on an RD plot;
  - příloha č. 2 písm. q) (jednoduché stavby): the 80 m² secondary dwelling.
  
  — [MŽP metodické doporučení](https://www.mzp.gov.cz/system/files/2024-11/OOV-Metodicke_doporuceni-20210416.pdf); [283/2021 (mirror)](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2021/283-2021.md)

**Connection to roads and utilities**
- **§ 140(2) SZ:** the stavební pozemek must be delimited so that it is "dopravně napojen na kapacitně vyhovující veřejně přístupnou pozemní komunikaci". — [283/2021 (mirror)](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2021/283-2021.md)
- **§ 143(2) SZ:**
  - Buildings are placed so that "bylo umožněno jejich napojení na sítě technické infrastruktury a pozemní komunikace" and so that fire equipment can reach them.
  - Road connections must be safe and must meet dopravní obslužnost and parking needs.
  - § 143(4): outside the stavební pozemek only zařízení staveniště and connections to TI and PK may be placed.
  
  — [283/2021 (mirror)](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2021/283-2021.md)
- **§ 9(1) vyhl. 146/2024:** the minimum width of a newly delimited veřejné prostranství containing a road leading to an RD plot is **8 m**, or **6.5 m** one-way. For a bytový dům it is 12 m, or 10.5 m one-way. A výsadbový pás must be ≥ 1 m wide, and from 1 Jul 2026 ≥ 1.5 m in streets at least 18 m wide (§ 9(3)). — [146/2024 (mirror)](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2024/146-2024.md)
- **§ 12(1):** TI networks in a zastavitelná plocha and zastavěné území go underground. **§ 13(2):** fences must not restrict visibility at the sjezd. — [146/2024 (mirror)](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2024/146-2024.md)
- **§§ 40–43:**
  - § 40: vodovodní přípojka requirements.
  - § 41: kanalizační přípojka; oddílná vnitřní kanalizace where the public sewer is oddílná.
  - § 42: žumpa — "vodotěsná, bez možnosti odtoku", sized for its users, and designed for later connection to a sewer with ČOV; distance from a well per příloha č. 8 část 10.
  - **§ 43(5):** "Stavba pro bydlení musí být připojena přípojkou elektronických komunikací nebo musí být připojena fyzickou infrastrukturou propojující stavbu pro bydlení s uličním prostranstvím."
  
  — [146/2024 (mirror)](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2024/146-2024.md)

**Daylight, insolation (oslunění) and shading**
- **§ 20(1)**, from 1 Jul 2026: "Požadavky na denní osvětlení jsou splněny, pokud obytný a pobytový prostor je navržen a proveden tak, aby součet ploch stavebních otvorů, kterými se tyto prostory osvětlují, byl alespoň jedna desetina podlahové plochy osvětlovaného prostoru." The 2024 text only required daylight "podle účelu užívání stavby". — [146/2024 (mirror)](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2024/146-2024.md); [97/2026 bod 21 (mirror)](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2026/97-2026.md)
- **§ 20(3):** proslunění is required only for "pobytová místnost ve stavbě pro sociální služby a herna mateřské školy" (except forest kindergartens). **There is no insolation requirement for byty or RDs in 146/2024.** — [146/2024 (mirror)](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2024/146-2024.md)
- Protection of the neighbour's light is through § 20(4) and příloha č. 4, the 45° test described above. — [146/2024 (mirror)](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2024/146-2024.md)

**Other RD-relevant provisions**
- **§ 10:**
  - (1) on the plot of a stavba pro bydlení or rodinnou rekreaci, related buildings, equipment and terrain modifications may also be placed;
  - (2) from 1 Jul 2026, příloha 2 písm. q) dwellings may be placed (see above);
  - (3) one business building up to **40 m²** zastavěné plochy and 5 m height, 1 NP + 1 PP, may be placed.
  
  — [146/2024 (mirror)](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2024/146-2024.md)
- **§ 91, velká sídla:** these are Prague and the kraj seats. Within the zastavěné území, Parts 2 and 3 (§§ 7–15) do not apply to buildings in stavební proluky whose parameters match "úplné souvislé zástavbě stejné výškové úrovně a stejného půdorysného rozsahu". The building must also be safe and comply with the ÚPD. — [146/2024 (mirror)](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2024/146-2024.md)
- **§ 95, výjimky and deviations:**
  - (1) under § 138(1) SZ a výjimka may be granted from, among others, § 7(1) and (3), § 8, § 9(1) and (3), § 10(3), **§ 11(1), (2) and (4)** and § 12(1);
  - (2) in velká sídla also from § 11(5) and § 15;
  - (3) a **regulační plán or a ÚP s prvky RP** may set the requirements of Parts 2 and 3 differently (§ 138(2) SZ).
  
  § 94: listed technical provisions are deemed met by compliance with the ČSN designated in the ÚNMZ věstník. — [146/2024 (mirror)](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2024/146-2024.md)
- **Prague, Brno, Ostrava** may override 146/2024 by their own nařízení (§ 152(2)–(3), § 333(3) SZ; see §3). — [283/2021 (mirror)](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2021/283-2021.md)

**Rule table for an engine (national level, RD, from 1 Jul 2026)**

| Check | Rule | Basis | Who can change it |
|---|---|---|---|
| Distance to plot boundary | ≥ 2 m to every boundary except veřejné prostranství; measured to walls, balconies, terraces and loggias | 146 § 11(2), (7) | exceptions § 11(3); výjimka § 95(1); RP / ÚP s prvky RP § 95(3); Praha/Brno/Ostrava nařízení |
| Wall on the boundary | no openings; no water or snow onto the neighbour | 146 § 11(4) | výjimka § 95(1) |
| Neighbour's future development | must not be prevented, nor existing development endangered | 146 § 11(1) | výjimka § 95(1) |
| House-to-house distance | no fixed metres; urbanistic, architectural and maintenance requirements plus other laws | SZ § 144 | ÚP (prostorové uspořádání) |
| Shading of existing windows | 45° vertical within a ≥ 45° horizontal sector (≥ 25° from the façade) | 146 § 20(4) + příl. 4 | proluka method § 20(5) |
| Min. plot area | none nationally; must be functionally adequate | SZ § 140(1)–(2) | ÚP (podmínky prostorového uspořádání) |
| Access | dopravně napojen on a capacity-adequate veřejně přístupná PK; new street ≥ 8 m (6.5 m one-way) | SZ § 140(2), § 143(2); 146 § 9(1) | výjimka § 95(1) for § 9(1) |
| Parking | podlahová plocha / 120 m², rounded half-up at the end (≥ 0.5 up), excluding garages, technical rooms and balconies; on the plot or ≤ 300 m | 146 § 7 + příl. 1 (1a) | ÚP % korekce (min/max); RP; výjimka § 95(1) |
| Rainwater | 1. accumulation and use / infiltration / evaporation → 2. storm sewer to surface water → 3. regulated discharge to a combined sewer | SZ § 140(3)(c); VZ § 5(3) | ÚP (koeficient zeleně, if set) |
| Wastewater | sewer → own ČOV → žumpa (watertight, ready for later connection) | VZ § 5(3); 146 §§ 41–42 | — |
| Telecom | přípojka or physical infrastructure to the street | 146 § 43(5) | — |
| Daylight | window area ≥ 1/10 of the floor area of each habitable/occupied room | 146 § 20(1) | ČSN via § 94 |
| Insolation | none required for RD | 146 § 20(3) | (Prague nařízení unknown) |
| Extra buildings on the plot | ≤ 40 m² business building; ≤ 80 m² secondary dwelling (příl. 2 q) SZ, ≥ 2 m, ≥ 50 % vsak) | 146 § 10(2)–(3) | — |

Sources for the table: as cited in the bullets above — [146/2024 (1. 7. 2026)](https://e-sbirka.gov.cz/eli/cz/sb/2024/146/2026-07-01), [283/2021 (11. 6. 2026)](https://e-sbirka.gov.cz/eli/cz/sb/2021/283/2026-06-11), [254/2001 (1. 6. 2026)](https://e-sbirka.gov.cz/eli/cz/sb/2001/254/2026-06-01).

### Inferences
- Worked parking examples (my calculation from příloha 1):
  - an RD with 150 m² podlahové plochy needs 150/120 = 1.25 → **1 stání**;
  - 180 m² → 1.5 → **2 stání**;
  - 2 units totalling 230 m² → 1.92 → 2 stání.
  
  The ÚP korekce, e.g. a minimum of 2 per RD as common in practice **[unverified]**, must be applied on top.
- Most national RD rules are geometric and machine-checkable from a parcel polygon (ČÚZK), a footprint and window positions. These are the 2 m boundary distance, the 45° shading cone, parking count, street width and the plocha in JS. The ÚP layer (height, KZP or koeficient zeleně, min. výměra, roof shape, stavební čára) dominates the real "what can be built" answer and must be extracted per municipality.
- 97/2026 made checks *more* automatable: a measurable daylight ratio, a defined distance-measurement rule and a quantitative shading test. It also removed the vague stormwater § 8. The transitional čl. II means both versions remain relevant for designs documented before 1 Jul 2026.
- Fire-safety distances (požárně nebezpečný prostor) also constrain RD spacing under the požární předpisy, via "jiné právní předpisy" in § 144. **[unverified – prior knowledge]**; not covered here.

### Gaps
- Not checked:
  - fire-safety distance rules (vyhl. 23/2008 Sb., ČSN 73 0802/0833);
  - the ČSN designated under § 94 for § 20 and příloha 4.
- **Prague nařízení 12/2024** content for RD (odstupy, parking zones, vsakování, insolation) was not obtained; the same applies to Ostrava 17/2024 and any Brno regulation.
- Which provisions of 146/2024 a ÚP *without* prvky RP may tighten, beyond parking korekce and general podmínky prostorového uspořádání, is a legal-interpretation question I did not research.
- Not compared: the full list of 97/2026 changes to accessibility, ventilation (new § 19), sanitary facilities and wells (příloha 8 bod 10.3) beyond the RD-relevant points above.

## 6. The 2026 amendments: what changed for spatial-planning data, NGÚP and ÚÚR (abolition, new Úřad rozvoje území ČR); Sbírka numbers

### Takeaway
**The "malá novela" is zákon č. 91/2026 Sb. ze dne 27. května 2026**, signed by Okamura, Pavel and Babiš and effective **11 Jun 2026**. Its only change replaces "2026" with "2027" in § 334b(1) SZ. As a result:
- the transitional period without mandatory NGÚP use runs to **30 Jun 2027** for územní plánování (§ 334b(3), (5)–(9));
- for stavební řád information systems it stays **31 Dec 2027**;
- § 334b(8) still literally says that documents published "způsobem umožňujícím dálkový přístup" must be uploaded into NGÚP **by 31 Dec 2026**, an apparent inconsistency.

**The large amendment** is sněmovní tisk 67. It was signed by the President on 17 Sep 2026 (prior notes), but **its Sbírka number was not found**. It is not among e-Sbírka items up to č. 198/2026 (dated 14 Oct 2026). MMR materials from June 2026 describe its institutional effect:
- ÚÚR and DESÚ cease on 31 Dec 2026;
- the **Úřad rozvoje území České republiky** (seat Praha) starts on **1 Jan 2027** and will run NGÚP and insert data into it;
- kraj-level Úřady rozvoje území start on **1 Jan 2028**.

### Cited Findings
**Malá novela — 91/2026 Sb. (read in full)**
- Čl. I: "V § 334b odst. 1 zákona č. 283/2021 Sb., stavební zákon, ve znění zákona č. 437/2024 Sb. a zákona č. 223/2025 Sb., se číslo „2026“ nahrazuje číslem „2027“." Čl. II: effective "dnem následujícím po dni jeho vyhlášení". The e-Sbírka version is dated 11 Jun 2026. — [91/2026 – e-Sbírka](https://e-sbirka.gov.cz/eli/cz/sb/2026/91/2026-06-11) ([mirror](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2026/91-2026.md)); [Právní prostor – Novela stavebního zákona](https://pravniprostor.cz/zmeny-v-legislative/vyslo-ve-sbirce-zakonu/novela-stavebniho-zakona-2); [Advokátní deník 11. 6. 2026](https://advokatnidenik.cz/2026/06/11/zacina-platit-zakon-o-rocnim-odkladu-povinneho-pouzivani-geoportalu/)
- The Senate consented to the one-year postponement; the Sněmovna vote was 123:0 (prior notes). — [Seznam Zprávy – Senát souhlasil](https://www.seznamzpravy.cz/clanek/ekonomika-senat-souhlasil-s-rocnim-odkladem-povinneho-pouzivani-narodniho-geoportalu-307147)
- **History of § 334b** (read in full):
  1. **437/2024 Sb.** (ze dne 11. 12. 2024, effective 21 Dec 2024) inserted § 334b. The transitional period for the IS of územní plánování ran to 30 Jun 2025, and the upload deadline in § 334b(8) was 31 Dec 2025. — [437/2024 – e-Sbírka](https://e-sbirka.gov.cz/eli/cz/sb/2024/437/2024-12-21) ([mirror](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2024/437-2024.md))
  2. **223/2025 Sb.**, Část šestá, čl. X body 4–5 (an energy-law package, ze dne 25. 6. 2025), inserted "a 5" and changed "2025" to "2026" in § 334b(1) and (8). These points took effect the day after promulgation. — [223/2025 – e-Sbírka](https://e-sbirka.gov.cz/eli/cz/sb/2025/223/2026-08-01) ([mirror](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2025/223-2025.md))
  3. **91/2026 Sb.** changed only § 334b(1), so § 334b(8) second sentence still reads "Pořizovatel vloží dokumenty podle věty první do národního geoportálu územního plánování do 31. prosince 2026." — [283/2021 ve znění od 11. 6. 2026 (mirror)](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2021/283-2021.md)
- **§ 334b as in force since 11 Jun 2026** — what the transitional regime means for data:
  - (6) a duty to insert or publish in NGÚP is met by publishing "způsobem umožňujícím dálkový přístup s uvedením data jeho uveřejnění"; the pořizovatel sends the address to the nadřízený orgán;
  - (8) ÚAP, ÚS, ÚPD and its úplné znění, the vymezení ZÚ and its changes, územní opatření and the information on a stavební uzávěra under § 326 are published this way instead of in NGÚP;
  - (9) **MMR keeps the evidence územně plánovací činnosti**, holding metadata on ÚPD, ZÚ, územní opatření and ÚS "včetně průběhu jejich pořizování". The pořizovatel enters the data, and the metadata include the URL where the documents are published;
  - (4) other information systems may be used, but data must be handed to MMR on request.
  
  — [283/2021 § 334b (mirror)](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2021/283-2021.md)

**Large amendment (sněmovní tisk 67)**
- Parliamentary records show tisk 67 ("…stavební zákon, ve znění pozdějších předpisů, a některé další související zákony") went through first reading in Jan 2026, second reading in late May to early June, and third reading on 10 Jul 2026. One search summary calls it a *vládní* návrh. The MMR text cited in the prior notes says it was submitted by coalition deputies. This conflict is unresolved. — [psp.cz – stenozáznamy rejstřík 5700](https://psp.cz/eknih/2025ps/rejstrik/jmenny/5700.html); [psp.cz – rejstřík 6766](https://psp.cz/eknih/2025ps/rejstrik/jmenny/6766.html); [epravo – souhrn událostí (8. 7. 2026)](https://www.epravo.cz/top/clanky/souhrn-vyznamnych-udalosti-ze-sveta-prava-121168.html?pdf=1)
- Senate veto, Sněmovna override on 9 Sep 2026, presidential signature on 17 Sep 2026, and the ČKAIT note "sent for publication 19 Oct 2026": see the prior notes and their sources. — [Advokátní deník 9. 9. 2026](https://advokatnidenik.cz/2026/09/09/snemovna-prehlasovala-senat-a-stvrdila-koalicni-novelu-stavebniho-zakona/); [SME Union](https://www.sme-union.cz/prezident-podepsal-velkou-novelu-stavebniho-zakona-jedno-razitko-u-haly-nebo-dilny-prijde-az-v-roce-2028/)
- **Sbírka number not found.**
  - The e-Sbírka mirror holds 2026 items 1–198 with no gaps; the latest item, č. 198/2026, is dated 14 Oct 2026. Apart from 91/2026, none amends 283/2021.
  - Searches found no promulgation report.
  - Some 2026 acts (e.g. 197/2026) are first published only as PDF, with structured e-Sbírka data added later (usually within 15 working days, up to 30 days). A recent promulgation could therefore be missing from structured mirrors.
  - e-Sbírka also lists a consolidated version of 283/2021 effective **1 Jan 2027** as "už vyhlášené". Which act produces it was not determined.
  
  — [mirror index zakony/2026](https://github.com/flatiocom/czech-law-md/tree/main/zakony/2026); [197/2026 stub (mirror)](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2026/197-2026.md); [283/2021 – next version ELI](https://e-sbirka.gov.cz/eli/cz/sb/2021/283/2027-01-01); [search: Právní prostor listing](https://pravniprostor.cz/zmeny-v-legislative/vyslo-ve-sbirce-zakonu/novela-stavebniho-zakona-2)
- **Institutions (MMR presentations, June 2026):**
  - "Zřizují se Úřad rozvoje území České republiky se sídlem v Praze".
  - ÚÚR and DESÚ cease, and their powers pass to the new Úřad from 1 Jan 2027.
  - "Vznik Úřadu rozvoje území se nadále předpokládá k 1.1.2027 a Úřadů rozvoje území kraje k 1.1.2028".
  - The Úřad "vede národní geoportál územního plánování a vkládá do něj data".
  - When the slides were made (June 2026), the bill was still "v procesu schvalování v PS".
  
  — [MMR prezentace pro KÚ KV 22. 6. 2026](https://www.kr-karlovarsky.cz/system/files/2026-06/26%2006%2022%20-%2001%20-%20Prezentace_MMR_KUKV_22062026.pdf); [MSK – metodický den KÚ 3. 6. 2026](https://www.msk.cz/assets/temata/uzemni_planovani/md-ku_03_06_2026.pdf); [MMR – přechodná ustanovení k návrhu novely](https://novystavebnizakon.gov.cz/media/dajhbljb/p%C5%99echodn%C3%A1-ustanoven%C3%AD_n%C3%A1vrh-novely.docx) (via search summaries)
- Date of ÚÚR's end and the Úřad's start in the enacted text: "Úřad rozvoje území České republiky … vzniká a svou působnost … začíná vykonávat dnem 1. ledna 2027". DESÚ and ÚÚR cease on 31 Dec 2026. — [novystavebnizakon.gov.cz – úplné znění](https://novystavebnizakon.gov.cz/legislativa/uplne-zneni-zakona/) (prior notes, via search summary)

**Other 2026 changes relevant to planning data**
- Vyhl. 157/2024 as amended by **457/2025 Sb.** has been in force since 1 Jan 2026 (prior notes). The structure of standardized ÚP data is in its příloha č. 10 and the exchange format in příloha č. 14 (see §1). — [157/2024 ve znění od 1. 1. 2026 – e-Sbírka](https://e-sbirka.gov.cz/eli/cz/sb/2024/157/2026-01-01) ([mirror](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2024/157-2024.md))
- The 30 Jun 2026 ORP deadline for vymezení ZÚ for municipalities without a ÚP (§ 325) produced a new class of JS data: Shapefile layers `ZastaveneUzemi_p` and `NezastavitelnyPozemek_p` (157/2024 příloha č. 21). — [283/2021 § 325 (mirror)](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2021/283-2021.md); [157/2024 příloha č. 21 (mirror)](https://github.com/flatiocom/czech-law-md/blob/main/zakony/2024/157-2024.md)

### Inferences
- For an engine, the period **1 Jan 2027 – 30 Jun 2027** is the riskiest:
  - ÚÚR, which hosts EÚPČ, IWÚP and the JS catalogues, disappears on 31 Dec 2026, and its agenda moves to the new Úřad, which also takes over NGÚP;
  - NGÚP becomes mandatory only on 1 Jul 2027.
  
  URLs, APIs and data owners will probably change during 2027. Integrations should use the MMR EÚPČ metadata (publication URLs) and municipal and kraj sources in parallel.
- The literal 31 Dec 2026 upload deadline in § 334b(8) conflicts with the 30 Jun 2027 transitional period. Either pořizovatelé must back-fill NGÚP by year-end 2026, or the big amendment changes this. Expect uneven NGÚP completeness in early 2027. This is a legal-reading inference; check the big amendment's text.
- The large amendment changes institutions and procedures (state building administration). None of the found sources says it changes JS content, ÚAP content or the předběžná informace; the JS data model is set by 157/2024 / 457/2025.

### Gaps
- The Sbírka number and promulgation date of the large amendment (tisk 67) were not found.
- Also not found in the enacted text: its provisions on NGÚP, EÚPČ, ÚAP and § 334b(8), and its exact effective dates.
- Which act creates the 283/2021 version effective 1 Jan 2027 that e-Sbírka lists: not determined.
- Whether ÚÚR's data services (EÚPČ export eupc.uur.cz, IWÚP portal.uur.cz, JS catalogues) will keep their URLs under the Úřad rozvoje území: unknown.
