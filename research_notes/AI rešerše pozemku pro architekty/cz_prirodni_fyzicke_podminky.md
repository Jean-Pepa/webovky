# Czech natural, environmental and physical-condition data for a family-house plot: desk-research layers and the field surveys that remain unavoidable (as of October 2026)

> **Method note: read this first.** Web access in this research session was badly limited. WebFetch could not resolve any Czech host (geoportal.cuzk.gov.cz, estav.cz and muj-pravnik.cz all returned ENOTFOUND). Direct curl got proxy 403 for geoportal.cuzk.gov.cz, geology.cz and estav.cz. The shared WebSearch budget (200 calls per turn across all agents) ran out after 22 successful searches.
> - **The sources were never opened in full.** Every "Cited Findings" bullet below comes from the search engine's summaries and snippets of the linked documents. Spot-check the numbers before publishing.
> - **Q6–Q8 and most of Q9 could not be searched at all.** That covers nature, heritage registers, environmental hazards and climate, and the legal basis and price of most surveys. For these, the Gaps sections hold entries tagged **[UNVERIFIED – background knowledge]**. They are meant as a checklist for verification and must not be presented as sourced facts.
> - **Finishing the verification needs network access.** These hosts must be allowed in the session's network settings: geoportal.cuzk.gov.cz, cuzk.gov.cz, cgs.gov.cz, mapy.geology.cz, sujb.gov.cz, dibavod.cz, heis.vuv.cz, povis2.mzp.gov.cz, chmi.cz, vumop.cz, eagri.cz, nature.cz, npu.cz, pamatkovykatalog.cz, aiscr.cz, mzcr.cz, sekm.cz, caa.gov.cz, e-sbirka.gov.cz and zakonyprolidi.cz.
> - **Agency domains have moved to `*.gov.cz`.** The sources found use cuzk.gov.cz, cgs.gov.cz, sujb.gov.cz, mzp.gov.cz and mze.gov.cz. Older links on cuzk.cz, geology.cz or sujb.cz may only redirect, or may break.

## Q1: Terrain and imagery (ČÚZK). DMR 5G, DMP 1G, Ortofoto ČR and ZABAGED: accuracy, free access, API options, and can they replace a geodetic survey for early design?

### Takeaway
- **All ČÚZK terrain and imagery products are free open data.** Since 1 July 2023, DMR 4G, DMR 5G, DMP 1G, Ortofoto ČR and ZABAGED are published under CC BY 4.0 on Geoportál ČÚZK, with ATOM, WFS and ArcGIS REST services.
- **They are good enough for site analysis and early massing.** DMR 5G has a declared *úplná střední chyba výšky* of 0.18 m in open terrain and 0.30 m in forest. Ortofoto has a 12.5 cm pixel, roughly 0.2 m positional error and a two-year cycle.
- **They do not replace a polohopisné a výškopisné zaměření.** Permit and construction documentation still needs a survey, especially under trees, for small terrain features, and where the terrain changed after the laser scan. DMP 1G has never been updated.

### Cited Findings

#### Licence and access (all ČÚZK products)
- **Open data since 1 July 2023.** Following an amendment of zákon č. 200/1994 Sb., Zeměměřický úřad publishes as open data: ZABAGED® (including výškopis), Ortofoto ČR, the state map series (státní mapové dílo), the geographic names database and survey control points (bodová pole) — [MUNI lecture "Mapové zdroje", 19 Oct 2023](https://is.muni.cz/el/sci/podzim2023/Z8105/um/Mapove_zdroje_prednaska_4_-_19_10_2023_ZABAGED.pdf); [ČÚZK – Otevřená data – základní informace](https://cuzk.gov.cz/Uvod/Produkty-a-sluzby/Otevrena-data/Otevrena-data-zakladni-informace.aspx)
- **Height data are now free too.** The laser-scanning (LLS) height products DMR 4G, DMR 5G and DMP 1G, which used to be paid, moved into the open-data group. They can be downloaded free of charge for any area of ČR directly from Geoportál ČÚZK — [MUNI lecture 2023](https://is.muni.cz/el/sci/podzim2023/Z8105/um/Mapove_zdroje_prednaska_4_-_19_10_2023_ZABAGED.pdf); [ČÚZK – Otevřená data](https://cuzk.gov.cz/Uvod/Produkty-a-sluzby/Otevrena-data/Otevrena-data-zakladni-informace.aspx). Background: [Dvořáček (ČÚZK), DIA, Dec 2023](https://www.dia.gov.cz/wp-content/uploads/2023/12/Nova-rada-statniho-mapoveho-dila-Dvoracek.pdf); [Dvořáček, GIS Day 2023](https://storm.fsv.cvut.cz/data/files/Konference/GISday/2023_GISday_prednasky/02_CUZK_petr_dvoracek.pdf)
- **Licence.** Open-data spatial data, including metadata, are free of charge under Creative Commons CC BY 4.0 — [ČÚZK – Otevřená data](https://cuzk.gov.cz/Uvod/Produkty-a-sluzby/Otevrena-data/Otevrena-data-zakladni-informace.aspx). The general terms are in [Podmínky poskytování prostorových dat ČÚZK](https://cuzk.gov.cz/Predpisy/Podminky-poskytovani-prostor-dat-a-sitovych-sluzeb/Podminky-poskytovani-prostorovych-dat-CUZK.aspx) and the English [Podminky_EN.pdf](https://geoportal.cuzk.gov.cz/Dokumenty/Podminky_EN.pdf)
- **Access methods.** The ZABAGED vector data come through ATOM download services in selected formats under CC BY 4.0. WFS and ArcGIS REST services are also offered. Downloads sit on the "Data" tab of Geoportál ČÚZK — [MUNI lecture 2023](https://is.muni.cz/el/sci/podzim2023/Z8105/um/Mapove_zdroje_prednaska_4_-_19_10_2023_ZABAGED.pdf); [ČÚZK – Otevřená data](https://cuzk.gov.cz/Uvod/Produkty-a-sluzby/Otevrena-data/Otevrena-data-zakladni-informace.aspx)
- **Reuse in OpenStreetMap.** In July 2023 the OSM community first judged CC BY 4.0 incompatible with the OSM licence — [talk-cz, July 2023](https://lists.openstreetmap.org/pipermail/talk-cz/2023-July/025686.html). The OSM wiki later states that from November 2023 all ČÚZK sources under CC BY 4.0 may be used for OSM — [OSM wiki Cs:Česko/freemap](https://wiki.openstreetmap.org/wiki/Cs:Česko/freemap). The ortofoto open-data thread is [talk-cz, April 2023](https://lists.openstreetmap.org/pipermail/talk-cz/2023-April/025421.html)

#### DMR 5G (Digitální model reliéfu ČR 5. generace)
- **Provider and documentation.** ČÚZK / Zeměměřický úřad; official documentation is the [Technická zpráva DMR 5G](https://geoportal.cuzk.gov.cz/Dokumenty/TECHNICKA_ZPRAVA_DMR_5G.pdf) (not opened in this session).
- **Content.** DMR 5G is an irregular triangulated network (TIN) of the bare terrain. It is built from discrete laser points in the thinned ground class, with heights in Bpv — [VŠB lecture ZGI_09_DMR](https://geoinformatika-1.vsb.cz/zgi/prednasky/ZGI_09_DMR.pdf); [Dušánek, NPÚ/PAGIS presentation, 16 Oct 2025](https://pagis.npu.cz/wordpress/wp-content/uploads/2025/10/20251016_DUSANEK_ZU_NPU_Becov.pdf)
- **Declared accuracy.** The úplná střední chyba výšky is 0.18 m in open terrain and 0.30 m in forested terrain — [Bárta, VUT GNSS seminar 2026](https://geodesy.fce.vutbr.cz/wp-content/uploads/sites/34/files/GNSS/Prezentace2026/07_Barta.pdf); [VUT thesis](https://dspace.vut.cz/bitstreams/748049d3-8de2-4b96-a8a2-2dbbdb143040/download); [VŠB lecture](https://geoinformatika-1.vsb.cz/zgi/prednasky/ZGI_09_DMR.pdf)
- **Independent check in Brno.** A standard deviation of 21 cm was measured, consistent with the declared accuracy. The same study found DMR 5G not detailed enough to model the channels of small watercourses, which need local refinement — [Vystavěl, VUT GNSS seminar 2025](https://geodesy.fce.vutbr.cz/wp-content/uploads/sites/34/files/GNSS/Prezentace2025/20_Vystavel.pdf)
- **Check on forest roads.** DMR 5G showed a mean deviation of 0.71 m, against 0.06 m for UAV LiDAR. The authors recommend combining UAV and airborne scanning on terrain with obstacles. This uses a different metric and context from the declared parameters — [Forests 2025, 16, 729 (MDPI)](https://mdpi-res.com/d_attachment/forests/forests-16-00729/article_deploy/forests-16-00729.pdf)
- **Updates.** "Od roku 2016 probíhá letecké laserové skenování pro aktualizaci DMR 5G a DMR 4G." The combined technical report was revised on 30 Sept 2025 — [ČÚZK Technická zpráva DMR 4G a 5G](https://geoportal.cuzk.gov.cz/Dokumenty/TECHNICKA_ZPRAVA_DMR_4G_a_5G.pdf)
- **Coverage (likely outdated statement).** An undated ČÚZK page says DMR 4G covers the whole of ČR, while DMR 5G and DMP 1G cover only part because processing was still ongoing — [ČÚZK – Analýzy výškopisu](https://cuzk.gov.cz/Aktuality-resort/Aktuality-WEB/Analyza-vyskopisu.aspx). This conflicts with the 2023 open-data material stating DMR 5G can be downloaded for any area of ČR — [MUNI lecture 2023](https://is.muni.cz/el/sci/podzim2023/Z8105/um/Mapove_zdroje_prednaska_4_-_19_10_2023_ZABAGED.pdf)

#### DMR 4G
- **Content and documentation.** A 5 × 5 m grid interpolated from DMR 5G — [Dušánek, NPÚ 2025](https://pagis.npu.cz/wordpress/wp-content/uploads/2025/10/20251016_DUSANEK_ZU_NPU_Becov.pdf). Technical report: [TZ DMR 4G](https://geoportal.cuzk.gov.cz/Dokumenty/TECHNICKA_ZPRAVA_DMR_4G.pdf)
- **Accuracy.** 0.3 m in open terrain and 1 m in forested areas — [VŠB lecture](https://geoinformatika-1.vsb.cz/zgi/prednasky/ZGI_09_DMR.pdf)

#### DMP 1G (Digitální model povrchu 1. generace)
- **A surface model that has never been updated.** DMP 1G includes buildings and vegetation, and an October 2025 presentation states it has been "nikdy neaktualizován" (never updated) — [Dušánek, NPÚ 2025](https://pagis.npu.cz/wordpress/wp-content/uploads/2025/10/20251016_DUSANEK_ZU_NPU_Becov.pdf). Technical report: [TZ DMP 1G](https://geoportal.cuzk.gov.cz/Dokumenty/TECHNICKA_ZPRAVA_DMP_1G.pdf)

#### Ortofoto ČR
- **Resolution.** The ground resolution was increased from 0.20 m to 0.125 m, among other things through new digital metric cameras — [ČÚZK Technická zpráva Ortofoto ČR](https://geoportal.cuzk.gov.cz/Dokumenty/TZ_Ortofoto_CR.pdf)
- **Update cycle.** A ČÚZK presentation gives a two-year interval of digital aerial imaging since 2012 — [Šíma, Nemoforum seminar](https://cuzk.gov.cz/O-resortu/Nemoforum/Akce-Nemofora/Seminare/Digitalni-mapa-verejne-spravy/12-Sima.aspx); [Šíma, Telč](https://svk-telc.fsv.cvut.cz/contribution/b/sima.pdf)
- **Figures as of 2022 (OSM wiki).** Pixel 0.125 m; since 2012 half of ČR has been re-flown each year, which amounts to a two-year cycle; mean positional error 0.19–0.20 m — [OSM wiki Cs:Česko/freemap](https://wiki.openstreetmap.org/wiki/Cs:Česko/freemap)
- **ČÚZK answers per-area questions.** For example, a 2026 response on katastrální mapa and ortofoto availability for one cadastral area — [ČÚZK 106/1999 response, 2026](https://cuzk.gov.cz/Urady/Cesky-urad-zememericky-a-katastralni/Casto-hledane-informace/Poskytovani-informaci-106-1999-Sb/Zverejneni-obsahu-informaci-poskytnutych-na-za-(1)/2026/Dostupnost-katastralni-mapy-a-ortofota-pro-k-u-Sme.aspx)

#### ZABAGED® (Základní báze geografických dat)
- **Open data since 1 July 2023,** with ATOM, WFS and ArcGIS REST access — [MUNI lecture 2023](https://is.muni.cz/el/sci/podzim2023/Z8105/um/Mapove_zdroje_prednaska_4_-_19_10_2023_ZABAGED.pdf)
- **Refinement using laser-scanning data.** ČÚZK has a project report on making ZABAGED more accurate with LLS data (only the title was seen) — [Závěrečná zpráva Zpřesnění ZABAGED s využitím LLS](https://geoportal.cuzk.gov.cz/Dokumenty/ZAVERECNA_ZPRAVA_Zpresneni_ZABAGED_s_vyuzitim_LLS.pdf)

### Inferences
- **DMR 5G is good enough for early design on open plots.** With a vertical error of about 0.18–0.21 m, it supports:
  - slope and aspect maps;
  - rough 0.5–1 m contour sketches;
  - approximate cut-and-fill and drainage-direction analysis;
  - massing studies.
  At roughly two standard deviations, individual heights can be off by about ±0.4 m.
- **DMR 5G is weak in several situations:**
  - under tree cover (0.30 m declared, and much worse on linear features such as roads, at 0.71 m);
  - for small features such as retaining walls, ditches, terraces and kerbs;
  - wherever the terrain changed after the scan date of the tile.
- **DMP 1G is stale.** Because it has never been updated, it can still be used for rough horizon and shading analysis. Current trees and neighbouring buildings must be checked against the latest ortofoto.
- **Ortofoto is for context, not measurement.** With a 12.5 cm pixel, about 0.2 m positional error and imagery at most about two years old, it is fine for reading the site, its vegetation and its access. It is not suitable for setting out the building or measuring boundary distances.
- **Conclusion on the geodetic survey.** Desk terrain data can replace a survey for a feasibility study or architectural concept (studie). They cannot replace it for permit or construction documentation, which needs centimetre-level existing heights:
  - at the boundaries;
  - at the road and connection points;
  - at trees and neighbouring structures.
- **Fit for automated plot reports.** All four products are free for commercial reuse with the attribution "© ČÚZK, CC BY 4.0" and are available through machine-readable services.

### Gaps
- **Limited verification.** See the method note at the top: no source in this section was read in full.
- **[UNVERIFIED – background knowledge] Service endpoints for the height and imagery products.** The expected access is ČÚZK ArcGIS Server services (ags.cuzk.gov.cz) offering WMS/WCS/ImageServer for DMR 5G, DMP 1G and ortofoto. ATOM feeds should provide DMR 5G and DMP 1G as LAZ point-cloud tiles by SM5 map sheet (about 2.5 × 2 km), plus DMR 4G grids. Confirm the exact URLs on Geoportál ČÚZK.
- **[UNVERIFIED – background knowledge] Scan dates.** The original nationwide laser scanning ran from about 2009 to 2013 (ČÚZK with MZe and the Ministry of Defence). Scan dates differ by tile, so check the acquisition date for each tile. The extent of the post-2016 re-scanning by area was not found.
- **[UNVERIFIED – background knowledge] ZABAGED's level of detail.** ZABAGED is the national vector topographic database at the detail of Základní mapa ČR 1:10 000, with 100+ feature types and continuous updating. The exact refresh cycle was not verified.
- **Ortofoto for a given area.** The current flight year and pixel size for a given area were not verified; Geoportál publishes a flight plan. One search summary gave an older pixel history (25 cm from 2009, 20 cm from 2016) without an identifiable source.
- **[UNVERIFIED – background knowledge] Historical imagery.** Archive orthophotos by year, including the 1950s orthophoto, are offered as WMS. They help reveal earlier land use such as former ponds, landfills and quarries. Not verified.
- **No accuracy test of DMP 1G** from 2025 or 2026 was found.

## Q2: Geology and geohazards. ČGS geological maps, the Geofond borehole database (vrty), svahové nestability, poddolovaná území, CHLÚ, dobývací prostory, hydrogeology, and suitability for rainwater infiltration (vsakování)

### Takeaway
- **ČGS publishes free map services on mapy.geology.cz,** mostly as ArcGIS REST, some as WMS and ATOM. They cover:
  - the 1:50 000 geological map (GEOČR50);
  - the Geofond database of geologically documented objects (boreholes);
  - the registr svahových nestabilit;
  - mining data (důlní díla);
  - the Surovinový informační systém (SurIS), with CHLÚ and dobývací prostory.
- **Licences are mixed.** Some data are open, some are released only on written request under a price list.
- **There is no national ČGS map of infiltration suitability.** Only a VÚV/GEOtest 2012 map of potential infiltration exists, plus maps for Prague. Infiltration capacity still has to be tested in the field.

### Cited Findings

#### Geologická mapa ČR 1:50 000 (GEOČR50)
- **Service.** A raster WMS of GEOČR50 runs from an ArcGIS endpoint on mapy.geology.cz, using WMS 1.3.0 and EPSG:5514 (S-JTSK) — [ČGS Micka metadata](https://micka.geology.cz/en/record/full/68122b73-73d8-4e14-8e9a-57240a010852?dlang=cze); [Micka record](https://micka.geology.cz/en/record/full/6819dac9-ee50-4140-9b9c-53d10a010852?dlang=cze)
- **Inconsistent licence conditions.** The metadata of the index-sheet WMS say no conditions apply (INSPIRE "bez podmínek"). The record for the map symbols says "Copyright (All Rights Reserved)" and, at the same time, "no limitations to public access" — [Micka record](https://micka.geology.cz/record/basic/681b6f5f-600c-47ae-bf27-48b80a010e57?dlang=eng); [Micka record](https://micka.geology.cz/en/record/full/68122b73-73d8-4e14-8e9a-57240a010852?dlang=cze)
- **Partly on request (2021, older).** A ČGS presentation said some data are downloadable through download services, while others are released only on written request under the ČGS price list (ceník) — [ČGS presentation 2021](https://is.muni.cz/el/sci/podzim2021/Z8105/um/CGS.pdf)
- **Domain.** ČGS now uses the cgs.gov.cz domain — [ČGS news: Radon risk maps 1 : 50 000 accessible on the CGS Portal](https://cgs.gov.cz/en/about-us/current-events/radon-risk-maps-1-50-000-accessible-on-the-cgs-portal). A search summary named https://cgs.gov.cz/mapy-a-data/webove-sluzby as the list of web services; that page was not opened.

#### Boreholes: Geofond database of geologically documented objects (GDO, "vrty")
- **What the map application shows.** Basic information on boreholes and other works registered in the GDO database, which also holds hydrogeological and geophysical data. The Czech version was relaunched in December 2017, and the metadata say currency must always be checked with the database administrator — [ČGS Micka metadata](https://micka.geology.cz/en/record/full/52b19cf2-6ec8-40ce-8818-05e40a010817?dlang=cze); [Micka](https://micka.geology.cz/en/record/full/20031400-1400-1003-b891-be28e7d5d03d?dlang=cze); [national geoportal copy](https://geoportal.gov.cz/php/micka/record/basic/52b19cf2-6ec8-40ce-8818-05e40a010817?dlang=eng)
- **Record content.** Records hold basic object data and, for about 89 %, a formalised description of the geological profile. The borehole database is linked to the database of hydrogeological objects — [ČGS Micka metadata](https://micka.geology.cz/en/record/full/52b19cf2-6ec8-40ce-8818-05e40a010817?dlang=cze)
- **Size and growth.** The database has been filled since 1976, with recent annual growth of about 10 000–15 000 boreholes — [Micka](https://micka.geology.cz/en/record/full/74d49890-9890-14d4-b75e-c88088beb3f3?dlang=cze); [Micka](https://micka.geology.cz/en/record/full/52b19cf2-6ec8-40ce-8818-05e40a010817?dlang=cze). It held 220 984 records on 31 Dec 2011 (old figure) — [Geofond text, annual report 2011](https://cgs.gov.cz/system/files/2023-09/geofond-text-z-vyrocni-zpravy2011.pdf)
- **Viewer.** The ČGS general map viewer is at mapy.geology.cz/geo (per the search summary of the Micka records).
- **Core store.** The register of ČGS mapping and documentation boreholes covers cores stored in Lužná u Rakovníka. The material is being re-catalogued into the Geofond system and is temporarily unavailable for study — [Micka](https://micka.geology.cz/en/record/full/74d49890-9890-14d4-b75e-c88088beb3f3?dlang=cze)

#### Svahové nestability (landslides)
- **Registry content.** The registr svahových nestabilit holds basic data on recorded and field-verified slope instabilities (sesuvy, proudy, řícení). Outlines are verified in the field at 1:10 000 and come with a structured description and photos. Activity classes are aktivní, dočasně uklidněné and uklidněné — [ČGS Micka](https://micka.geology.cz/en/record/full/6a0dd06e-65d0-463c-bfdc-6b760a010e57?dlang=cze); [Micka](https://micka.geology.cz/en/record/full/680fa331-4df4-408f-ab98-53ea0a010852?dlang=cze). Methodology: [RENS metodika dokumentace (2023)](https://rens.geology.cz/sites/default/files/2023-02/RENS_metodika-dokumentace_0.pdf)
- **ArcGIS REST services** on mapy.geology.cz:
  - [Geohazardy/svahove_nestability](https://mapy.geology.cz/arcgis/rest/services/Geohazardy/svahove_nestability/MapServer);
  - [Geohazardy/svahove_deformace](https://mapy.geology.cz/arcgis/rest/services/Geohazardy/svahove_deformace/MapServer), mapped slope deformations across ČR;
  - [Prozkoumanost/prehled_mapovani_svahove_deformace](https://mapy.geology.cz/arcgis/rest/services/Prozkoumanost/prehled_mapovani_svahove_deformace/MapServer), an overview of where slope instabilities have been mapped.
- **The viewer combines several layers:** ČGS engineering-geological mapping at 1:10 000, revised Geofond registry records, DMR 5G, geological-geomorphological units, engineering-geological districts (rajony) and a susceptibility map — [ČGS Micka](https://micka.geology.cz/en/record/full/6a0dd06e-65d0-463c-bfdc-6b760a010e57?dlang=cze)
- **History.** Systematic mapping has run since 1997, after extreme rainfall in July of that year triggered many hundreds of landslides. Some documentation dates from the 1960s — [ČGS Micka](https://micka.geology.cz/en/record/full/680fa331-4df4-408f-ab98-53ea0a010852?dlang=cze). Context: [ČGS information on the 2013 floods (MV ČR)](https://mv.gov.cz/clanek/informace-ceske-geologicke-sluzby-k-povodnim-2013.aspx)

#### Poddolovaná území / důlní díla (undermined areas, mine workings)
- **A service exists, but its content is unknown.** An ArcGIS service "Dulni_Dila/Udaje_o_uzemi" is on mapy.geology.cz — [MapServer JSON](https://mapy.geology.cz/arcgis/rest/services/Dulni_Dila/Udaje_o_uzemi/MapServer?f=pjson). The search results did not describe its layers.

#### CHLÚ, dobývací prostory and the Surovinový informační systém (SurIS)
- **Content.** The SurIS map service shows:
  - deposits and prognostic resources;
  - chráněná ložisková území (CHLÚ);
  - chráněná území pro zvláštní zásahy do zemské kůry;
  - průzkumná území;
  - dobývací prostory.
  A second service covers deposits, resources and CHLÚ. Both output JSON, GeoJSON or PBF in EPSG:5514 — [SurIS MapServer](https://mapy.geology.cz/arcgis/rest/services/Suroviny/Surovinovy_informacni_system/MapServer); [chlu_loziska_zdroje MapServer](https://mapy.geology.cz/arcgis/rest/services/Suroviny/chlu_loziska_zdroje/MapServer); metadata [EGDI 50334920](https://egdi.geology.cz/record/full/50334920-464c-4994-b012-0da40a010817), [EGDI 564f1b6b](https://egdi.geology.cz/record/full/564f1b6b-6a18-47a5-9d60-27380a010852)
- **Use in building permitting.** The metadata say SurIS data are used in building permitting and list dobývací prostory, CHLÚ and the protected areas for special interventions. The reference is to the old stavební zákon 183/2006 Sb. — [EGDI metadata](https://egdi.geology.cz/record/full/50334920-464c-4994-b012-0da40a010817)
- **Legal sequence.** Mining builds on prior approval of a CHLÚ, followed by a dobývací prostor — [MUNI law course, Právní režim pozemků s nerosty, 2019](https://is.muni.cz/el/law/jaro2019/BN605Zk/um/BN605Zk_-_Pravni_rezim_pozemku_s_nerosty_-_jaro_2019_-_IS.pdf?lang=en)

#### Hydrogeology and suitability for infiltration (vsakování)
- **Groundwater objects.** The ČGS borehole database is linked to the hydrogeological objects database — [ČGS Micka](https://micka.geology.cz/en/record/full/52b19cf2-6ec8-40ce-8818-05e40a010817?dlang=cze)
- **National potential-infiltration map.** The "mapa potenciálního vsaku" by VÚV TGM and GEOtest (2012) divides ČR into 5 categories of infiltration potential. It is a national dataset, but not a ČGS product — [Moravskoslezský kraj presentation on risky infiltration, 19 Mar 2024](https://www.msk.cz/assets/temata/uzemni_planovani/20240319_us_rizikova_vsakovani_msk.pdf)
- **VÚV project portal (Prague area).** A VÚV project map portal on adaptation measures for the Prague area carries groundwater layers on infiltration potential and infiltration capacity — [VÚV mapový portál](https://heis.vuv.cz/data/webmap/datovesady/projekty/polrustu2adaptacniopatreni/docpublicita/zaverecny_seminar/mapovy_portal.pdf)
- **Prague.** The vsakovací mapy of IPR Praha, in the Atlas životního prostředí Prahy, sort land into categories of suitability for rainwater infiltration — [CENIA PKZN presentation, May 2023](https://cenia.gov.cz/wp-content/uploads/2023/05/PKZN_JKenvi_Kral_Frank.pdf)
- **What drives infiltration.** Rainfall infiltration depends on geological, hydrogeological and climatic conditions, terrain morphology and human influences — [CENIA PKZN abstract, Apr 2023](https://cenia.gov.cz/wp-content/uploads/2023/04/PKZN_Abstrakt_Kral.pdf)
- **No ČGS infiltration layer found.** A 2023 MUNI hydrogeology lecture on electronic data sources points to ČGS map applications without any infiltration layer (per the search summary) — [MUNI MHGV_6](https://is.muni.cz/el/sci/podzim2023/G7401/um/MHGV_6_Elektronicke_zdroje_dat.pdf?lang=en)

### Inferences
- **Archive boreholes are the most useful free geology layer** for early foundation thinking. Nearby GDO boreholes indicate the depth to bedrock and to groundwater. Their age and quality vary, though, so they inform the investigation rather than replace it.
- **A registered landslide near the plot effectively mandates an engineering-geological survey.** That applies to active and dočasně uklidněné landslides alike. The registry only includes field-verified outlines in mapped areas, so the coverage layer should be checked: absence of a record does not prove the slope is stable.
- **CHLÚ and dobývací prostor are early red flags.** Both appear in SurIS. The permitting consequences are listed under Gaps and are unverified.
- **Desk layers do not establish infiltration capacity.** They give only regional potential, while the design rules for vsakovací zařízení need a site-specific infiltration coefficient, so a field infiltration test is needed.
- **The ČGS ArcGIS REST endpoints can be queried directly** (identify/query by point or polygon). That makes them usable in automated plot reports, but the licence must be checked service by service.

### Gaps
- **[UNVERIFIED – background knowledge] Other ČGS map products:**
  - Geologická mapa 1:25 000, which covers only part of the country;
  - Hydrogeologická mapa ČR 1:50 000, also partial, plus 1:500 000;
  - engineering-geological maps for some cities;
  - separate ČGS-Geofond registers of "poddolovaná území" and "hlavní důlní díla" with WMS.
  None of these was verified, and the current list of applications on cgs.gov.cz was not seen.
- **[UNVERIFIED – background knowledge] Permitting consequences of mining-related zones.**
  - In a CHLÚ, buildings unrelated to mining need a binding opinion (závazné stanovisko) under the horní zákon 44/1988 Sb. (§ 18–19).
  - In dobývací prostory, the mining organisation's statement is needed.
  - On undermined land, foundations are designed per ČSN 73 0039.
  The competent authority under the new stavební zákon 283/2021 Sb. must be verified.
- **ČGS licence status in 2026 not verified.** There may be a general move to CC BY open data; the metadata found are contradictory.
- **Hydrogeologické rajony.** The VÚV/ČGS layer, also distributed in DIBAVOD, was not verified.
- **Update frequency.** None found for GEOČR50 (a static compilation) or for the landslide registry beyond "continuous".

## Q3: Radon. Radon risk maps (ČGS/SÚJB), the legal obligation of a radonový průzkum for new buildings (atomový zákon 263/2016 Sb. and its decree), and typical price

### Takeaway
- **Radon is the one survey the law requires for every new family house.** Under § 98 odst. 1 of the atomový zákon 263/2016 Sb., the stavebník must have the radonový index pozemku determined for any building with obytná or pobytová místnost.
- **Who and when.** An SÚJB-authorised firm must do it, by the time the project documentation is being prepared, following the SÚJB methodology.
- **The maps are only a pre-screen.** ČGS radon maps at 1:50 000 are free (ArcGIS, INSPIRE WMS and ATOM), but their metadata state they cannot be used to read a parcel's radon index for building purposes.
- **Price.** Listings put it at roughly 2 000–4 000 CZK; the date of these figures is uncertain.

### Cited Findings
- **The duty.** Under § 98 odst. 1 zákona č. 263/2016 Sb., the stavebník of a building with an obytná or pobytová místnost must arrange determination of the radonový index pozemku — [SÚJB seminar slides 2017](https://sujb.gov.cz/fileadmin/sujb/docs/radiacni-ochrana/seminare/NAZ_PZZ_26042017/170426_Seminar_pro_DP_RIP_OAR.pdf); [Můj právník](https://muj-pravnik.cz/radonovy-index-pozemku/), which describes it as a duty before construction starts.
- **Timing.** SÚJB material says the index must be available at the latest when the project documentation is prepared, so the radon protection can be designed. The slides also cite the predecessor rule, § 6 odst. 4 zákona 18/1997 Sb. — [SÚJB seminar 2017](https://sujb.gov.cz/fileadmin/sujb/docs/radiacni-ochrana/seminare/NAZ_PZZ_26042017/170426_Seminar_pro_DP_RIP_OAR.pdf)
- **Who may measure.** Determination must be done by a subject holding the appropriate SÚJB authorisation (per the search summary) — [SÚJB slides: měření a hodnocení přírodního ozáření, RN index pozemku](https://sujb.gov.cz/fileadmin/sujb/docs/radiacni-ochrana/seminare/NAZ_PZZ_26042017/mereni_hodncoceni_prirod_ozar_stavby_RN_index_pozemek.pdf); [ceskestavby.cz – Radon a ochrana před ním](https://www.ceskestavby.cz/clanky/radon-a-ochrana-pred-nim-27034.html)
- **Existing buildings.** Under § 98 odst. 2, a change to a completed building that creates obytné místnosti requires measuring the radon concentration inside the building. If it is elevated, protective measures follow, for example per ČSN 73 0601 (per the search summary) — [ceskestavby.cz](https://www.ceskestavby.cz/clanky/radon-a-ochrana-pred-nim-27034.html); [Můj právník](https://muj-pravnik.cz/radonovy-index-pozemku/)
- **Reference level.** Since 1 Jan 2017 the reference level for radon in buildings has been 300 Bq/m³, set in vyhláška 422/2016 Sb. — [ceskestavby.cz](https://www.ceskestavby.cz/clanky/radon-a-ochrana-pred-nim-27034.html); [SÚJB Doporučení – Stanovení radonového indexu pozemku](https://sujb.gov.cz/fileadmin/sujb/docs/radiacni-ochrana/PZIZ/doporuceni/171128_Doporuceni_RIP_final.pdf)
- **Building authorities.** In a February 2025 answer, SÚJB said the atomový zákon does not oblige building authorities to demand design changes when the reference level is exceeded (per the search summary) — [SÚJB, odpověď na žádost, 6 Feb 2025](https://sujb.gov.cz/fileadmin/sujb/docs/styk-s-verejnosti/2025/2025-02-06-zadost-odpoved.pdf)
- **Method.**
  - The basis is the SÚJB Doporučení "Stanovení radonového indexu pozemku" (Nov 2017) — [SÚJB](https://sujb.gov.cz/fileadmin/sujb/docs/radiacni-ochrana/PZIZ/doporuceni/171128_Doporuceni_RIP_final.pdf)
  - Soil-gas samples are taken from probes about 0.8 m deep, typically 15 probes in a regular grid (secondary source) — [Můj právník](https://muj-pravnik.cz/radonovy-index-pozemku/)
  - Gas permeability is assessed at every point, and the third quartile of the measured set is used for classification — [Liberec: Jak se měří radon](https://docs.liberec.cz/Odb_HA/GSWeb/Radonov%C3%A9%20sondy/Jak%20se%20m%C4%9B%C5%99%C3%AD%20radon.pdf)
  - Categories: radon potential RP < 10 means nízký index, 10 ≤ RP < 35 means střední — [SÚJB Doporučení](https://sujb.gov.cz/fileadmin/sujb/docs/radiacni-ochrana/PZIZ/doporuceni/171128_Doporuceni_RIP_final.pdf)
- **Protocol.** The protocol contents follow příloha 19 vyhlášky 422/2016 Sb. A public-tender protocol example cites the SÚJB Doporučení as its basis (per the search summary) — [example protocol, e-zakazky](https://www.e-zakazky.cz/stazenisouboru/9829beb9-7612-4d28-8f76-167dcee6eefc)
- **ČGS radon map 1:50 000.** The Mapa radonového indexu ČR 1:50 000 is a statistical processing of measurements over the vectorised geological map 1:50 000 (GEOČR50). It is offered as an ArcGIS Server service, an INSPIRE view service (WMS) and an INSPIRE download service (ATOM) — [ČGS Micka: Radon index map 1:50 000](https://micka.geology.cz/record/basic/f2435e00-5e00-1243-b989-52caa6446ca8?dlang=eng); [EGDI 56f3b3f2](https://egdi.geology.cz/record/full/56f3b3f2-c258-40c8-87cb-335c0a010852?dlang=cze); [EGDI 5cf8cda1](https://egdi.geology.cz/record/full/5cf8cda1-e5fc-4b8d-b4fb-49f70a010852?dlang=cze); [ČGS news](https://cgs.gov.cz/en/about-us/current-events/radon-risk-maps-1-50-000-accessible-on-the-cgs-portal)
- **Not for parcels.** Per the metadata, the radon index for building on a specific parcel cannot be derived from the regional map — [ČGS Micka/EGDI radon records](https://egdi.geology.cz/record/full/56f3b3f2-c258-40c8-87cb-335c0a010852?dlang=cze)
- **Historical radon map.** The historical Mapa radonového indexu geologického podloží 1:50 000 consists of scanned sheets from mapping in 1999–2005. It was formerly sold on CD-ROM and can be ordered via the ČGS e-shop — [Micka 51bf1543](https://micka.geology.cz/en/record/full/51bf1543-92ac-467d-a60e-4a8c0a010817?dlang=cze); [Micka 528b605c](https://micka.geology.cz/en/record/full/528b605c-1008-4711-bdaf-04a00a010817)
- **Komplexní radonová informace.** This application generates a PDF for municipality centres from the 1:50 000 and 1:500 000 geological maps and is aimed at obecní úřady — [ČGS Micka radon records](https://micka.geology.cz/en/record/full/51bf1543-92ac-467d-a60e-4a8c0a010817?dlang=cze)
- **Access restrictions vary.** Some records restrict access by contract with private firms in the Asociace radonové riziko, while others state no public-access limits — [ČGS Micka/EGDI records](https://egdi.geology.cz/record/full/5cf8cda1-e5fc-4b8d-b4fb-49f70a010852)
- **Price (undated).**
  - About 2 000–4 000 CZK; the same article calls the survey mandatory and required by the building authority — [estav.cz – Jaké průzkumy pozemku si zajistit](https://www.estav.cz/cz/7304.jake-pruzkumy-pozemku-si-zajistit-pred-stavbou-rodinneho-domu)
  - Contractor listings: one radon survey at 2 700 CZK, and geology plus radon together at 7 700 CZK — [nejremeslnici.cz – radonový průzkum](https://www.nejremeslnici.cz/t/1669-radonovy-pruzkum); [nejremeslnici.cz – geologický průzkum a měření radonu](https://www.nejremeslnici.cz/reference/68936-geologicky-pruzkum-a-mereni-radonu)

### Inferences
- **The high category is RP ≥ 35,** which follows from the SÚJB thresholds for low and medium.
- **When to measure.** The survey is cheap compared with the cost of protective measures, and its result decides the protection designed under ČSN 73 0601 (membrane class, ventilated sub-floor). It belongs right after the footprint is roughly fixed and before the documentation for the permit.
- **Use of the maps.** The ČGS radon maps serve as an early risk flag for budgeting. They can never be used to show compliance.

### Gaps
- **Exemptions from § 98 odst. 1.** No search result discussed any exemption. [UNVERIFIED – background knowledge] I recall exceptions, for example when protection matching the high-index category is designed anyway; verify the current text of § 98 in e-Sbírka.
- **Which section of the decree.** The section of vyhláška 422/2016 Sb. on determining the radonový index pozemku (possibly § 94) was not verified.
- **Form of SÚJB authorisation.** It is probably registrace for a "služba významná z hlediska radiační ochrany". Neither this nor SÚJB's public list of authorised firms was verified.
- **Radon programme.** radonovy-program.cz and the national radon action plan were not checked.
- **2026 prices and duration** were not verified; the 2 000–4 000 CZK range comes from an undated article. [UNVERIFIED – background knowledge] Field measurement takes about a day, the protocol follows in about 1–2 weeks, and measurement is not possible in frozen or waterlogged soil.
- **[UNVERIFIED – background knowledge] ČSN 73 0601:2019** ("Ochrana staveb proti radonu z podloží") governs the protective design by index category. Its detailed rules were not verified.

## Q4: Water. Záplavová území and aktivní zóny (Q5/Q20/Q100), mapy povodňového nebezpečí a rizik, POVIS, DIBAVOD, ochranná pásma vodních zdrojů, CHOPAV, manipulační pásmo, and groundwater-level data

### Takeaway
- **Flood information is official and free, in two layers.**
  - Legally binding: záplavová území and aktivní zóny, declared by the vodoprávní úřad. They are stored in the DIBAVOD flood-area store at VÚV TGM and shown in POVIS2 (MŽP).
  - Informative: mapy povodňového nebezpečí a povodňových rizik for Q5/Q20/Q100/Q500, with extent, depth and velocity. These were last updated in 2025, in the 3rd cycle of the EU Floods Directive.
- **Groundwater-level data exist only at ČHMÚ observation boreholes,** downloadable as CSV. The water table at a particular plot needs field work.
- **Not verified in this session:** the manipulační pásmo widths, OPVZ and CHOPAV.

### Cited Findings

#### Záplavová území (ZÚ) and aktivní zóny (AZ)
- **How a záplavové území is declared.** The správce toku prepares the proposal and the vodoprávní úřad declares (stanoví) it. The documents go to MŽP and then VÚV TGM, which stores them in the flood-area data store that is part of DIBAVOD. MŽP records them in POVIS — [MUNI law course 2018 – záplavová území](https://is.muni.cz/el/law/podzim2018/MV931K/um/zaplavova_uzemi.pdf); [DIBAVOD poster – mapy nebezpečí](https://dibavod.cz:443/data/poster_mapy_nebezpeci.pdf)
- **Aktivní zóna.** The AZ is set by an opatření obecné povahy. The technical rules are in vyhláška č. 79/2018 Sb. ("o způsobu a rozsahu zpracování návrhu a stanovování záplavových území a jejich dokumentace"), which replaced vyhláška 236/2002 Sb. — [Vyhláška 79/2018 (VÚV copy)](https://heis.vuv.cz/data/webmap/datovesady/dokumenty/legislativa/cz/Vyhlaska_79_2018.pdf); [epravo 79/2018](https://www.epravo.cz/top/zakony/sbirka-zakonu/sb/2018/79); [old 236/2002](https://www.epravo.cz/top/zakony/sbirka-zakonu/vyhlaska-ministerstva-zivotniho-prostredi-ze-dne-24-kvetna-2002-o-zpusobu-a-rozsahu-zpracovavani-navrhu-a-stanovovani-zaplavovych-uzemi-3387.html)
- **DIBAVOD (2009 source, may be outdated).** DIBAVOD is published by VÚV TGM in cooperation with Zeměměřický úřad. It holds a central register of záplavová území, offers selected data as ESRI shapefile downloads, and has a web map viewer at dibavod.cz — [VÚV seminar 2009 (Nováková)](https://heis.vuv.cz/data/webmap/datovesady/dokumenty/seminarevuv/vuv_20091119_Novakova.pdf). An example of AZ documentation: [AZÚ Jizera 2007](https://www.dibavod.cz/data/download/azu_2007_Jizera.pdf)

#### Mapy povodňového nebezpečí a povodňových rizik
- **Content.** Hazard maps cover the Q5, Q20, Q100 and Q500 scenarios with flood extent, depth and flow velocity. Risk maps divide flooded land into 4 intensity categories — [VÚV metadata PovodRizika](https://heis.vuv.cz/xmicka/record/xml/PovodRizika); [DIBAVOD poster](https://dibavod.cz:443/data/poster_mapy_nebezpeci.pdf)
- **Where to view them.** A national portal run by MŽP and MZe hosts the digital hazard and risk maps for the whole of ČR — [MŽP CDS report](https://cds.mzp.cz/stretches/report/301). INSPIRE WFS of the areas of potentially significant flood risk: [INSPIRE Geoportal record](https://inspire-geoportal.ec.europa.eu/srv/api/records/CZ-VUV-MD-WFS-Inspire-FD_APSFR)
- **Cycle.** The maps must be reviewed every six years under the EU Floods Directive. The latest update was finished in 2025, and the 3rd planning cycle ends in 2027 — [Povodí Odry, draft plan dated 31 Aug 2026 (souhrnná zpráva)](https://www.pod.cz/planovani/cz/navrh_PDP_HOD-20260831/_DOsVPR/HOD_Souhrn_zprava_DOsVPR.pdf). Methodology for the preliminary flood-risk assessment: [VÚV, Drbal 2018](https://www.vuv.cz/wp-content/uploads/2021/10/Drbal_Metodika_predbezneho_vyhodnoceni_povodnovych_rizik_2018.pdf)
- **Conflicting dates for the next plan period.** Drafts of the next river-basin and flood plans, dated 31 Aug 2026, have been published, for example for the Danube. The search summary gave the period as 2027–2033 in one place and 2028–2033 in another — [MŽP OOV DUNAJ 20260831](https://mzp.gov.cz/system/files/2026-08/OOV-DUNAJ-20260831.pdf)
- **Insurers use their own flood zones.** An article on how insurers are changing their flood maps (title only seen) — [ceskestavby.cz – Jak pojišťovny mění povodňové mapy](https://www.ceskestavby.cz/clanky/jak-pojistovny-meni-povodnove-mapy-co-to-znamena-pro-vas-dum-a-penezenku-36213.html)

#### POVIS / POVIS2 (MŽP)
- **Map module.** According to the MŽP user guide, the POVIS2 map module shows flood maps for Q5, Q20, Q100 and Q500 — [POVIS2 příručka](https://povis2.mzp.gov.cz/Napoveda/Prirucka/Index/85ac46b7a1074b01a93a7dd114a694d0)
- **Purpose and governance.** POVIS holds the data for flood plans of obce, ORP and kraje, with MŽP as guarantor — [Plzeňský kraj document](https://www.plzensky-kraj.cz/Framework/Document.ashx?ID=117652). POVIS2 is a completely new system with data migrated from the original POVIS — [MZe presentation, Tesařík](https://mze.gov.cz/public/portal/mze/-a84034---AL_SCtHF/povodnovy-informacni-system-ii-ing.-tesarik)

#### Manipulační pásmo (riverside strip)
- **The width is defined in the vodní zákon.** Vyhláška 178/2012 Sb. defines pobřežní pozemky "ve smyslu § 49 odst. 2 vodního zákona" and requires břehové porosty to be maintained "v šířce podle § 49 odst. 2". The snippet does not state the widths — [epravo 178/2012](https://www.epravo.cz/top/zakony/sbirka-zakonu/sb/2012/178)

#### Groundwater level (ČHMÚ)
- **ISVS Voda.** In the ISVS Voda portal (isvs.chmi.cz), you pick an observation borehole, open "Časové řady" and download a zip containing a CSV — [MUNI lecture GEV III, 2024](https://is.muni.cz/el/sci/jaro2024/GE321/um/GEV_III_Stav_podzemnich_vod_vybrane_lokality.pdf?lang=en)
- **ČHMÚ open data.** An ArcGIS open-data hub (open-data-chmi.hub.arcgis.com) has filters for boreholes (vrty) and springs (prameny), and a WFS runs on gis.cenia.cz in the chmu_voda workspace — [INSPIRE Geoportal record](https://inspire-geoportal.ec.europa.eu/srv/api/records/5898879c-bbf8-429c-8cc4-0d56c0a80138)
- **Hlásná síť podzemních vod.** This ČHMÚ network provides current data, with a separate database for history; the stated scale is 1:2 500 000 — [geoportal.gov.cz Micka](https://geoportal.gov.cz/php/micka/record/basic/57ee59af-14e8-4fab-bfa5-13a5c0a80137)
- **Where the boreholes are (2004, old).** Most observation boreholes measure levels in riverside zones and terraces, and some monitor deeper aquifers — [ČHMÚ Hydrologická ročenka 2004, opendata.chmi.cz](https://opendata.chmi.cz/hydrology/product/data/hydrological_yearbook/hydroyearbook2004.pdf)
- **Weekly situation reports** summarise shallow-borehole levels — [MZe hydrological report, 17 Jul 2024](https://mze.gov.cz/public/portal/mze/-a50000---YIQ9RmsO/informacni-zprava-o-hydrologicke-situaci-k-17.-7.-2024)

### Inferences
- **Recommended order of checks:**
  1. Declared ZÚ/AZ (binding) from DIBAVOD/POVIS2 or the vodoprávní úřad.
  2. Hazard maps (informative). They show Q500 extent, and depth and velocity at Q100, which helps set floor level even outside a declared ZÚ.
  3. Insurers' flood zones, which affect insurability.
- **Groundwater.** State boreholes sit mostly in river corridors and cannot give the water table at a particular plot. Use nearby Geofond archive boreholes as a hint, then confirm with a probe pit or borehole during the engineering-geological survey.
- **Distances to a watercourse** are measured from the břehová čára. ZABAGED or DIBAVOD watercourse lines are approximate, so a plot near a stream needs the line surveyed.

### Gaps
- **[UNVERIFIED – background knowledge] Manipulační pásmo.** § 49 odst. 2 vodního zákona 254/2001 Sb. lets the správce toku use land up to 8 m from the břehová čára of a významný vodní tok and up to 6 m for a drobný vodní tok, and in practice building there needs the správce's consent. An MZe commentary page exists ([MZe výklad vodního zákona](https://mze.gov.cz/public/portal/mze/-q357681---Fim0kCpO/zakon-voda-vyklad-18)) but was not read.
- **[UNVERIFIED – background knowledge] Building restrictions in flood zones.** § 67 vodního zákona: in the aktivní zóna, buildings may not be sited or permitted, with narrow exceptions. Outside the AZ, the vodoprávní úřad may set restrictions, and a consent or binding opinion is needed (§ 17).
- **Ochranná pásma vodních zdrojů (OPVZ) and CHOPAV.** No results were found. [UNVERIFIED – background knowledge]
  - OPVZ are set under § 30 vodního zákona at I. and II. stupeň. They are partly in DIBAVOD; the authoritative data are at the vodoprávní úřad. Restrictions can affect discharge of treated wastewater or infiltration.
  - CHOPAV were declared by nařízení vlády 1978–1981 and are available as a DIBAVOD layer. They restrict mainly large interventions, such as drainage and mining, and rarely affect a single house.
- **Current DIBAVOD and POVIS2 access** (download formats, WMS, licence) was not verified; the DIBAVOD source dates from 2009.
- **Cycle dates conflict.** The exact 2025 publication date of the updated maps and the next plan period (2027–2033 vs 2028–2033) need checking on MŽP's page.

## Q5: Soil and agriculture. BPEJ (VÚMOP / SPÚ), zemědělský půdní fond and odnětí ze ZPF (fees, třídy ochrany), erosion maps, LPIS

### Takeaway
- **The BPEJ code decides whether and how expensively a plot can leave ZPF.** It sets the třída ochrany, which drives both the feasibility and the cost of odnětí ze ZPF.
- **Where BPEJ data live now.** SPÚ maintains BPEJ under vyhláška 227/2018 Sb. and updates them annually. Since 1 Jan 2025 they are recorded in RÚIAN, and the export to the cadastral exchange format ended on 1 Jul 2025.
- **How the fee works.** The orgán ochrany ZPF sets the odvod by decision, and it is paid once within 30 days of the decision taking effect.
- **What was not found:** the 2026 rates, the exemptions for family houses, the VÚMOP services, the erosion maps and LPIS.

### Cited Findings
- **BPEJ database and legal basis.** BPEJ are recorded uniformly in numeric and map form in a nationwide database of soil quality. Keeping and updating them is governed by vyhláška č. 227/2018 Sb. ("o charakteristice bonitovaných půdně ekologických jednotek a postupu pro jejich vedení a aktualizaci") — [Sagit – vyhláška 227/2018](https://www.sagit.cz/info/sb98327); [Nemoforum seminar "BPEJ a pozemkové úpravy"](https://cuzk.gov.cz/O-resortu/Nemoforum/Akce-Nemofora/Seminare/BPEJ-a-pozemkove-upravy.aspx)
- **Annual update.** Updates run every year on a plan prepared by the SPÚ soil-service department. The proposed corrected map is put out for public review for 30 days, then enters the nationwide database and the cadastre — [Nemoforum seminar](https://cuzk.gov.cz/O-resortu/Nemoforum/Akce-Nemofora/Seminare/BPEJ-a-pozemkove-upravy.aspx) (per the search summary)
- **BPEJ now come through RÚIAN.** From 1 Jan 2025 BPEJ are recorded in RÚIAN as special territorial elements. The export of BPEJ to the VF ISKN exchange format ended on 1 Jul 2025, and BPEJ are now obtained from the RÚIAN exchange format (VFR) — [ČÚZK note 30 Apr 2025 – Ukončení exportu BPEJ do VF](https://cuzk.gov.cz/Katastr-nemovitosti/Poskytovani-udaju-z-KN/Vymenny-format-KN/Podrobne-informace-VF-ISKN/Archiv-podrobnych-informaci/20250430-–-Ukonceni-exportu-BPEJ-do-VF.aspx?feed=RSS); see also [ČÚZK news for surveyors 2025](https://cuzk.gov.cz/Zememerictvi/Zememericke-cinnosti/Aktuality-pro-zememerice/2025.aspx)
- **Code list.** The ČÚZK code list of BPEJ, last updated 17 Jul 2026, holds the code, the tabular price per m² and a description — [ČÚZK číselník BPEJ](https://cuzk.gov.cz/Katastr-nemovitosti/Poskytovani-udaju-z-KN/Ciselniky-ISKN/Ciselniky-k-nemovitosti-%281%29/Ciselnik-bonitovanych-pudne-ekologickych-jednotek.aspx)
- **The fee decision.** The odvod for permanent odnětí is set by the orgán ochrany ZPF, paid once and due within 30 days after the decision becomes final — [Portál veřejné správy – Rozhodnutí o odvodech za trvalé odnětí půdy](https://portal.gov.cz/sluzby-vs/rozhodnuti-o-odvodech-za-trvale-odneti-pudy-S10469)
- **Basis and timing of the fee.** The fee depends on soil quality (BPEJ) and třída ochrany coefficients and is decided only after construction starts — [estav.cz – převod zemědělské půdy na stavební pozemek](https://www.estav.cz/cz/5604.prevod-zemedelske-pudy-na-stavebni-pozemek-jak-zazadat-a-jake-jsou-poplatky)
- **Procedure since 1 Jul 2024.** The stavební úřad decides on the building, the ZPF authority issues a binding consent, and the fee is still set under § 11 unless the law waives it — [Můj právník – vyjmutí pozemku z půdního fondu](https://muj-pravnik.cz/vyjmuti-pozemku-z-pudniho-fondu/)
- **When consent is not needed (verify).** One secondary source says no consent to odnětí is issued or needed for a structure within the zastavěné území up to 25 m², or for a public-benefit building in a gap site (proluka) up to 0.5 ha — [estav.cz 5604](https://www.estav.cz/cz/5604)
- **History of the family-house exemption (per the search summary).**
  - From 1 Apr 2015 the exemption for residential building in built-up areas was removed, so fees began to apply to family houses. A later amendment reduced those fees — [estav.cz 5604](https://www.estav.cz/cz/5604); [NSS case on a family-house plot](https://vyhledavac.nssoud.cz/DokumentOriginal/Index/439009)
  - A 1999 version of the law waived fees for housing on land designated in the územní plán — [epravo 98/1999](https://www.epravo.cz/top/zakony/sbirka-zakonu-new/sb/1999/98)
- **Historical fee formula (pre-2015 only, not current).** The 402/2010 Sb. version computed the odvod as base rate × environmental factors × class coefficient (I = 9, II = 6, III = 4, IV = 2, V = 2) — [epravo 402/2010](https://www.epravo.cz/top/zakony/sbirka-zakonu/sb/2010/402). In a 2010 example, 26.85 Kč/m² × 2 gave 53.70 Kč/m² — [NSS document](https://vyhledavac.nssoud.cz/DokumentOriginal/Index/533740)
- **Unreliable calculator figures.** A third-party calculator quotes 15.72 Kč/m² for class I and 1.62 Kč/m² for class V without a verifiable source, and the figures do not match the law — [rulecalc](https://rulecalc.com/cs/dan/odvod-za-odneti-zemedelske-pudy). Do not use them.
- **Further sources** (not read in detail): the annexes of the ZPF act — [podnikatel.cz – Zákon o ochraně ZPF – přílohy](https://businesscenter.podnikatel.cz/pravo/zakony/ozpf/f1430525/); an MŽP presentation on the ZPF reform — [MŽP final_ppt_ZPF](https://mzp.gov.cz/sites/default/files/tiskove-zpravy/final_ppt_ZPF.pdf); an NSS decision on the approximate fee amount — [Sbírka NSS 2/2015](https://sbirka.nssoud.cz/cz/ochrana-zemedelskeho-pudniho-fondu-odvod-za-odneti-pudy-orientacni-vyse-odvodu.p3153.html)

### Inferences
- **Practical rule.** If the plot is ZPF (orná půda, zahrada, TTP, etc.), expect a consent procedure and a fee for odnětí, unless an exemption applies. Plots with BPEJ in třída ochrany I or II are hard to take out of ZPF. That makes the BPEJ code one of the first layers an automated report should show.
- **BPEJ are machine-readable through RÚIAN.** That helps automation, though linking BPEJ to parcels touches cadastre data, which is out of scope here.

### Gaps
- **Current rates and exemptions.** The current annex rates after 2015/2016 and the exemptions or reductions specific to family houses (§ 11a zákona 334/1992 Sb.) were not verified. The question was searched, but the search budget ran out. Check the current text in e-Sbírka.
- **[UNVERIFIED – background knowledge] Třídy ochrany.**
  - The five classes are defined by vyhláška 48/2011 Sb.
  - Under § 4 odst. 3 zákona 334/1992 Sb., land in classes I and II may be taken out only where another public interest significantly outweighs ZPF protection.
  - The 5-digit BPEJ code encodes the climatic region (1st digit), main soil unit (2nd–3rd), slope and exposure (4th), and depth and stoniness (5th).
- **[UNVERIFIED – background knowledge] VÚMOP and other agricultural services.**
  - VÚMOP's "eKatalog BPEJ" lets you look up a parcel's BPEJ, třída ochrany and price.
  - VÚMOP's geoportal or SOWAC-GIS carries erosion maps (potential threat from water and wind erosion) and the Monitoring eroze zemědělské půdy.
  - MZe's public LPIS (eagri.cz) shows farm-block parts, crops and some agri-environmental limits, with WMS.
  URLs, licences and update frequency were not verified.

## Q6: Nature and landscape. AOPK ČR data (NATURA 2000, CHKO zones, ZCHÚ, ÚSES, VKP, památné stromy), the 50 m rule from the forest edge, and PUPFL

### Takeaway
- **Nothing in this topic could be verified.** The search budget ran out just as these queries were sent.
- **What the expected picture is.** All points below are background knowledge flagged as unverified:
  - AOPK ČR publishes the nature-protection layers through its geoportal and open-data services;
  - building near a forest triggers the 50 m consent rule under the lesní zákon;
  - památné stromy carry an automatic ochranné pásmo;
  - in protected areas, the authority can require a biologické hodnocení.

### Cited Findings
- None. No sources could be retrieved for this topic.

### Inferences
- None that rest on cited findings. Treat this whole topic as unverified and re-run the research once search or fetch access is restored.

### Gaps
- **[UNVERIFIED – background knowledge] AOPK ČR data.**
  - A map viewer (e.g. mapy.nature.cz), open-data downloads (e.g. data.nature.cz) and ArcGIS/WMS/WFS services (e.g. gis.nature.cz).
  - The Ústřední seznam ochrany přírody (ÚSOP, drusop.nature.cz) lists ZCHÚ, památné stromy and other protected items.
  - Layers include:
    - velkoplošná ZCHÚ (NP, CHKO) and CHKO zones I–IV;
    - maloplošná ZCHÚ (NPR, PR, NPP, PP) and their ochranná pásma;
    - NATURA 2000: EVL and ptačí oblasti;
    - přírodní parky;
    - vrstva mapování biotopů.
  - The Nálezová databáze ochrany přírody (NDOP) has species records; detailed records need registration and sensitive species are hidden.
  - Licence, likely CC BY 4.0, and update frequency (ZCHÚ continuous, biotope mapping periodic) were not verified.
- **[UNVERIFIED – background knowledge] Legal rules under zákon 114/1992 Sb.:**
  - **ZCHÚ buffer:** a maloplošné ZCHÚ without a declared ochranné pásmo has a statutory 50 m buffer from its boundary (§ 37).
  - **Památný strom:** without a declared ochranné pásmo, it has a circle of radius 10× the trunk diameter measured 130 cm above ground (§ 46 odst. 3).
  - **VKP ze zákona** (§ 3 odst. 1 písm. b): lesy, rašeliniště, vodní toky, rybníky, jezera and údolní nivy. Interventions that could damage them need a závazné stanovisko of the orgán ochrany přírody (§ 4 odst. 2). Registered VKP are kept by the ORP, with no complete national layer.
  - **CHKO:** building in a CHKO needs a závazné stanovisko of the správa CHKO, and zone I is strictly restrictive.
  - **NATURA 2000:** for EVL and PO, the authority first issues a statement on possible significant impact (§ 45i). If impact cannot be excluded, an autorizovaná osoba prepares a naturové hodnocení.
  - **Biologické hodnocení:** the authority may request one for interventions that could affect protected interests (§ 67).
  - **Protected species:** affecting zvláště chráněné druhy requires an exemption (§ 56).
  - **ÚSES:** elements are defined in the územní plán (out of scope here); AOPK holds the supra-regional ÚSES.
- **[UNVERIFIED – background knowledge] Tree felling.** Felling needs a permit under § 8 zákona 114/1992 Sb. and vyhláška 189/2013 Sb. The usual threshold is a trunk circumference of more than 80 cm at 130 cm height, or contiguous shrubs over 40 m², with garden exceptions in some cases.
- **[UNVERIFIED – background knowledge] The 50 m rule from the forest edge.**
  - § 14 odst. 2 zákona 289/1995 Sb. (lesní zákon): "Dotčení pozemků do vzdálenosti 50 m od okraje lesa vyžaduje též souhlasu orgánu státní správy lesů". Within the building procedure this is given as a závazné stanovisko.
  - In practice, many forest authorities ask that new houses sit at least about 25–30 m (roughly tree height) from the forest edge. This is unverified and varies by ORP.
- **[UNVERIFIED – background knowledge] PUPFL.** Pozemky určené k plnění funkcí lesa (§ 3 lesního zákona) can be taken out only with a decision or binding opinion and a fee (§ 13–17). ÚHÚL publishes forest data such as OPRL and LHP/LHO boundaries through its map services (uhul.cz). URLs and licences were not verified.

## Q7: Heritage and archaeology. NPÚ Památkový katalog, památkové rezervace, zóny and ochranná pásma, ÚAN I–IV / AMČR, and the builder's duty to allow archaeological research

### Takeaway
- **Who pays for archaeology.** Under § 22 odst. 2 zákona 20/1987 Sb., the stavebník pays for záchranný archeologický výzkum only if it is a legal entity, or a natural person whose business gave rise to the research. A private person building their own family house therefore does not pay, and the research organisation bears the cost.
- **What the research looks like.** For small buildings such as family houses, it is usually a watching brief over the earthworks (dohled nad zemními pracemi).
- **Not verified in this session:** the heritage registers (Památkový katalog, rezervace, zóny, ochranná pásma) and the ÚAN categories.

### Cited Findings
- **Who pays.** Under § 22 odst. 2 zákona č. 20/1987 Sb., the costs of záchranný archeologický výzkum fall on the stavebník if it is a legal entity, or a natural person whose business gave rise to the research. Otherwise the organisation carrying out the research pays — [Charles University course material](https://dl1.cuni.cz/mod/resource/view.php?id=355522); [Ministerstvo kultury document, 2019](https://mk.gov.cz/doc/cms_library/20190204-vyzkum-10127.pdf)
- **Private builders of a family house.** The Archeologický ústav AV ČR Praha's guidance on family houses says the costs then pass to the authorised organisation doing the research — [ARÚP – ZAV a rodinné domky (web archive, c. 2010)](https://webarchiv.lib.cas.cz/wayback/20101106012526/http:/www.arup.cas.cz/cz/pamatkovaochrana/files/ZAVrodinnedomky.pdf). An older law-school presentation says the cost is borne by whoever the research benefits, typically the state, the kraj or a research fund — [MUNI presentation 2010](https://is.muni.cz/el/law/podzim2010/CNV103K/um/Archeologicke_vyzkumy1.pdf?lang=cs)
- **Form of the research.** For smaller buildings such as family houses, rescue research is normally a watching brief over the earthworks rather than an area excavation — [ARÚB – Informace pro stavebníky (web archive, 2023)](https://webarchiv.lib.cas.cz:443/wayback/20230701001545/https://www.arub.cz/wp-content/uploads/Informace_pro_stavebniky.pdf)
- **AMČR request form.** The AMČR methodology hosts a request form for a statement from the Archeologický ústav AV ČR — [AMČR help – Žádost o stanovisko AÚ (docx)](https://amcr-help.aiscr.cz/metodika/docs/BAV_vyjadreni.docx)
- **Guidance from Prague and a municipality.** Information for builders and investors on protecting archaeological heritage — [Praha (MHMP)](https://eba.praha.eu/documents/d/pamatky_en/1403212_263013__1024238_140342_archeologie_mhmp_opp); [Tachov – Povinnosti stavebníka v souvislosti s ochranou archeologického dědictví](https://www.tachov-mesto.cz/rfile/2097/)
- **Authorised organisations.** Ministerstvo kultury grants authorisations to carry out archaeological research — [MK – oprávnění k archeologickým výzkumům](https://www.mk.gov.cz/doc/cms_library/21-o-926.doc)
- **NPÚ's GIS presence.** NPÚ runs a GIS site on pagis.npu.cz, which hosts presentations on terrain-data use in heritage care, e.g. 2025 — [NPÚ/PAGIS](https://pagis.npu.cz/wordpress/wp-content/uploads/2025/10/20251016_DUSANEK_ZU_NPU_Becov.pdf). Its map-service catalogue was not seen.

### Inferences
- **For a private family-house builder, the duty is mainly about time.** They must notify and allow the research, but the cost is not theirs. The schedule should allow for an archaeologist's watching brief during excavation.
- **Projects with a business element are different.** A developer or a company would bear the cost.

### Gaps
- **[UNVERIFIED – background knowledge] Notification duty.** § 22 odst. 2 zákona 20/1987 Sb.: from the preparation stage, builders must notify the Archeologický ústav of their intention to build on an "území s archeologickými nálezy" and allow it, or an authorised organisation, to carry out záchranný archeologický výzkum. The notification can be filed online through AMČR (amcr.aiscr.cz).
- **[UNVERIFIED – background knowledge] ÚAN categories in the Státní archeologický seznam ČR (SAS, NPÚ):**
  - ÚAN I: presence of finds positively proven;
  - ÚAN II: not proven, but indications suggest finds (probability above 50 %);
  - ÚAN III: the rest of the inhabitable territory, where finds are possible;
  - ÚAN IV: no real probability of finds, e.g. fully quarried land.
  Because ÚAN III covers practically all of ČR, the notification duty applies almost everywhere.
- **[UNVERIFIED – background knowledge] Archeologická mapa ČR (AMČR).**
  - Run by ARÚP and ARÚB within AIS CR (aiscr.cz).
  - Public access is limited; full detail needs registration.
  - There is a public digital archive (digiarchiv.aiscr.cz).
  - Licence and API were not verified.
- **[UNVERIFIED – background knowledge] Heritage registers.**
  - The NPÚ Památkový katalog (pamatkovykatalog.cz) lists kulturní památky, NKP, památkové rezervace, památkové zóny and ochranná pásma, with a map. NPÚ also has a geoportal with WMS.
  - Works on a kulturní památka, or in a rezervace, zóna or ochranné pásmo, need a závazné stanovisko of the ORP heritage authority (§ 14 and § 17 zákona 20/1987 Sb.).
  - Licence, API and update frequency were not verified.
  - Whether a new heritage law (a long-planned rekodifikace) had been adopted by October 2026 is unknown.

## Q8: Environment and hazards. Strategické hlukové mapy, air quality (ČHMÚ), SEKM, brownfields, airport and military protection zones and height limits, climatic loads (snow and wind per ČSN EN 1991), and solar/orientation data

### Takeaway
- **Nothing in this topic could be verified.** The search budget ran out before these queries ran.
- **The only confirmed fact is that ČHMÚ runs open-data channels:** opendata.chmi.cz and an ArcGIS open-data hub. Whether they carry climate or air-quality data was not verified.
- **Everything else is unverified background:** noise maps, SEKM, brownfields, airport and military zones, snow and wind regions, and solar tools.

### Cited Findings
- **ČHMÚ open-data channels.** ČHMÚ publishes on opendata.chmi.cz (e.g. hydrological yearbooks) — [opendata.chmi.cz](https://opendata.chmi.cz/hydrology/product/data/hydrological_yearbook/hydroyearbook2004.pdf). It also runs an ArcGIS open-data hub (open-data-chmi.hub.arcgis.com) — [INSPIRE record](https://inspire-geoportal.ec.europa.eu/srv/api/records/5898879c-bbf8-429c-8cc4-0d56c0a80138). Whether these channels also carry climate or air-quality datasets was not verified.
- No sources were retrieved for noise, SEKM, brownfields, airport or military zones, snow and wind loads, or solar data.

### Inferences
- None that rest on cited findings.

### Gaps
- **[UNVERIFIED – background knowledge] Strategické hlukové mapy.**
  - Made by Ministerstvo zdravotnictví under § 81 zákona 258/2000 Sb. and EU Directive 2002/49/ES; web app probably hlukovemapy.mzcr.cz.
  - Rounds in 2007, 2012, 2017 and 2022 (4th round, 2021 data); the 5th round is due in 2027.
  - Coverage: agglomerations over 100 000 inhabitants, roads with over 3 million vehicles a year, railways with over 30 000 trains a year, and airports with over 50 000 movements a year. Indicators are Lden and Ln.
  - They cannot be used for a single plot. Compliance is judged against the limits in nařízení vlády 272/2011 Sb. The KHS may require a noise study for a house near a busy road or railway.
- **[UNVERIFIED – background knowledge] Air quality.** ČHMÚ publishes maps of five-year rolling averages on a 1 × 1 km grid (PM10, PM2.5, NO2, benzo[a]pyren, benzen), updated yearly. This is mainly a spatial-planning input; exact URL and licence not verified.
- **[UNVERIFIED – background knowledge] Contaminated land and brownfields.**
  - SEKM (Systém evidence kontaminovaných míst, MŽP, sekm.cz) has a public map of contaminated and potentially contaminated sites with priority categories.
  - CzechInvest runs the Národní databáze brownfieldů (URL not verified).
  - For a family-house plot, the archive orthophotos (Q1) are another way to spot former landfills or industrial use.
- **[UNVERIFIED – background knowledge] Airport and military protection zones.**
  - Ochranná pásma letišť are declared by ÚCL (zákon 49/1997 Sb.). They include height-limit zones and the approach and take-off zones, plus noise protection zones around major airports.
  - The Ministry of Defence asserts "vymezená území" (radar, airfields, low-flying areas), and its interest across the whole territory mainly concerns tall structures such as masts and wind turbines.
  - Both mostly reach architects through the ÚAP limits, which is spatial planning and out of scope. An ordinary family house is rarely affected, except inside height-limit zones.
- **[UNVERIFIED – background knowledge] Climatic loads.**
  - **Snow:** the snow-region map in the Czech national annex to ČSN EN 1991-1-3 has regions I–VIII, with characteristic ground snow load from about 0.7 kN/m² (I) to 4.0 kN/m² (VII) and above (VIII, set individually). ČHMÚ runs an interactive map (snehovamapa.cz).
  - **Wind:** the national annex to ČSN EN 1991-1-4 has wind regions I–V, with basic wind speed vb,0 of about 22.5 / 25 / 27.5 / 30 / 36 m/s.
  - **Second-generation Eurocodes:** CEN is publishing them in 2025–2027, but the Czech adoption and transition dates were not verified.
- **[UNVERIFIED – background knowledge] Solar and orientation.**
  - PVGIS (EU JRC, re.jrc.ec.europa.eu/pvg_tools) is free, with an API, irradiation, horizon and PV yield.
  - Global Solar Atlas (World Bank) is another free source.
  - DMP 1G (Q1) can be used for horizon and shading, with the caveat that it has never been updated.
  - ČHMÚ climate normals 1991–2020 and the Atlas podnebí Česka (2007) are further references.
- **CENIA "Atlas životního prostředí".** Its status in 2026 (still running, or replaced by the map client of the Národní geoportál INSPIRE, geoportal.gov.cz) was not verified.

## Q9: Field surveys that desk data cannot replace. Geodetické zaměření, inženýrskogeologický průzkum, radonový průzkum, hydrogeologický posudek (vsakování, studna), dendrologický průzkum, biologické hodnocení, stavebně-technický průzkum: when each is legally required for a family house, with typical prices and timelines

### Takeaway
- **Only one survey is required by law for every new family house:** the radonový průzkum (stanovení radonového indexu pozemku, § 98 odst. 1 atomového zákona), at roughly 2 000–4 000 CZK.
- **The engineering-geological survey is the main recommended one.** A consumer source describes it as not legally mandatory but recommended for every family house, at about 7 000–11 000 CZK. Another source says "thousands up to tens of thousands" of CZK.
- **A geodetic survey is needed in practice,** because DMR 5G accuracy (0.18–0.30 m) is not enough for permit documentation (see Q1).
- **The other surveys are conditional:** dendrologický průzkum (trees, felling), biologické hodnocení (protected areas or species), stavebně-technický průzkum (existing building) and hydrogeologické posouzení (infiltration, well). Their legal bases and prices could not be verified.

### Cited Findings
- **Radonový průzkum** (legal basis and method in Q3).
  - Mandatory and required by the building authority, for new builds and for reconstructions, at about 2 000–4 000 CZK — [estav.cz (undated)](https://www.estav.cz/cz/7304.jake-pruzkumy-pozemku-si-zajistit-pred-stavbou-rodinneho-domu)
  - Contractor listing: 2 700 CZK — [nejremeslnici.cz](https://www.nejremeslnici.cz/t/1669-radonovy-pruzkum)
  - The index must be known by the time the documentation is prepared — [SÚJB seminar 2017](https://sujb.gov.cz/fileadmin/sujb/docs/radiacni-ochrana/seminare/NAZ_PZZ_26042017/170426_Seminar_pro_DP_RIP_OAR.pdf)
- **Inženýrskogeologický průzkum.**
  - Not mandatory, but recommended for every family house, at about 7 000–11 000 CZK (per the search summary) — [estav.cz](https://www.estav.cz/cz/7304.jake-pruzkumy-pozemku-si-zajistit-pred-stavbou-rodinneho-domu)
  - For a standard family house, ground investigation generally costs "thousands, at most tens of thousands" of CZK, and far more for larger buildings — [ceskestavby.cz – průzkum podloží a stavební zákon](https://ceskestavby.cz/clanky-foto/pruzkum-podlozi-stavebni-zakon-4861.html?photo=2)
  - Combined geology and radon job: 7 700 CZK — [nejremeslnici.cz reference](https://www.nejremeslnici.cz/reference/68936-geologicky-pruzkum-a-mereni-radonu)
- **Hydrogeologický průzkum for a well.** About 2 000–5 000 CZK, depending on the planned well depth (per the search summary; the attribution is unclear) — [estav.cz](https://www.estav.cz/cz/7304.jake-pruzkumy-pozemku-si-zajistit-pred-stavbou-rodinneho-domu). A 2025 MUNI lecture on hydrogeological survey exists but was not read — [MUNI MJPV1](https://is.muni.cz/el/sci/podzim2025/G7981/um/MJPV1_hydrogeologicky_pruzkum_yht2w.pdf)
- **Archaeology (Q7).** A private non-entrepreneur builder does not pay for záchranný archeologický výzkum, which for a family house is usually a watching brief over the earthworks — [MK 2019](https://mk.gov.cz/doc/cms_library/20190204-vyzkum-10127.pdf); [ARÚB](https://webarchiv.lib.cas.cz:443/wayback/20230701001545/https://www.arub.cz/wp-content/uploads/Informace_pro_stavebniky.pdf)
- **The case for a geodetic survey.** DMR 5G accuracy is 0.18 m in open terrain and 0.30 m in forest, it misses small watercourse channels, and it deviates by up to 0.71 m on forest roads — [Bárta 2026](https://geodesy.fce.vutbr.cz/wp-content/uploads/sites/34/files/GNSS/Prezentace2026/07_Barta.pdf); [Vystavěl 2025](https://geodesy.fce.vutbr.cz/wp-content/uploads/sites/34/files/GNSS/Prezentace2025/20_Vystavel.pdf); [Forests 2025](https://mdpi-res.com/d_attachment/forests/forests-16-00729/article_deploy/forests-16-00729.pdf)

### Inferences
- **Minimum set of field work for a typical greenfield family-house plot,** in order:
  1. Geodetic survey (polohopis and výškopis, trees, neighbouring structures, connection points).
  2. Radon index, which is required by law.
  3. Engineering-geological survey, combined with an infiltration test so it doubles as the basis for vsakování.
- **When the conditional surveys apply:**
  - dendrologický průzkum: when trees will be felled or construction comes within their root zone;
  - biologické hodnocení: in or next to a CHKO, ZCHÚ or NATURA 2000 site, or where protected species are likely;
  - stavebně-technický průzkum: when an existing building is reused;
  - hydrogeologické vyjádření: when a well is planned.
- **Cost.** The sourced prices are undated and probably from before 2024. Treat them as a lower bound for 2026 and confirm with current quotes.
- **Timeline.** Seasonal constraints matter most: biological surveys need the growing season, and radon cannot be measured in frozen ground. They can dominate the schedule more than the price does.

### Gaps
- **Geodetic survey price.** No sourced price or timeline was found for a polohopisné a výškopisné zaměření of a family-house plot. [UNVERIFIED – background knowledge]
  - There is no statutory requirement to make a survey for design as such.
  - The documentation must show existing heights (vyhláška o dokumentaci staveb under the new law, possibly 131/2024 Sb.; not verified).
  - Setting out the building (vytyčení) must be done by an úředně oprávněný zeměměřický inženýr (ÚOZI).
- **[UNVERIFIED – background knowledge] Engineering-geological survey: legal framing.**
  - Design follows ČSN EN 1997-1 and -2 (Eurokód 7). The investigation scales with the geotechnical category, and simple family houses are often category 1.
  - Under zákon 62/1988 Sb. o geologických pracích, the survey is geologická práce. It needs a person with odborná způsobilost, and the results go to ČGS-Geofond.
  - Its exact legal status for a family house under stavební zákon 283/2021 Sb. was not verified.
  - [UNVERIFIED estimate – do not publish without a source] Typical duration is a few weeks, from field work to report.
- **[UNVERIFIED – background knowledge] Hydrogeology.**
  - **Infiltration:** the requirements on building (under the new law, possibly vyhláška 146/2024 Sb. o požadavcích na výstavbu) prioritise vsakování of rainwater. ČSN 75 9010 requires the infiltration capacity to be established, typically by a field infiltration test.
  - **Well:** a permit to abstract groundwater may be issued only on the basis of a statement from a person with professional qualification (hydrogeolog) under § 9 odst. 1 vodního zákona. Whether a household well needs a permit depends on the current wording of § 8 vodního zákona.
  - No sourced price for an infiltration assessment was found.
- **[UNVERIFIED – background knowledge] Dendrologický průzkum.** Not required by statute as such. It is effectively needed when felling requires a permit (§ 8 zákona 114/1992 Sb., vyhláška 189/2013 Sb.) or when the authority asks for documentation of the trees. Trees are protected during construction per ČSN 83 9061. No sourced price.
- **[UNVERIFIED – background knowledge] Biologické hodnocení.** Required only when the orgán ochrany přírody requests it (§ 67 zákona 114/1992 Sb.). The NATURA 2000 assessment under § 45i needs an autorizovaná osoba. Both are seasonal and can take months. No sourced price.
- **[UNVERIFIED – background knowledge] Stavebně-technický průzkum.** Needed when an existing building is changed or reused, per ČSN 73 0038 and ČSN ISO 13822. It may come with mycological, damp or moisture, and asbestos surveys, the latter before demolition or reconstruction. No sourced price.
- **No published survey-firm price list (ceník) was retrievable.** The search found only consumer articles and contractor listings, all undated. A follow-up pass should collect 2025–2026 price lists from several firms.
