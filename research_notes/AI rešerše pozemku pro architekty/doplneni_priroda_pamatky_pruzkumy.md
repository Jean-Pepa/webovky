# Remaining Czech desk-research layers for a family-house plot (příroda a krajina, památky a archeologie, environmentální rizika, ochranná pásma, les, klimatická zatížení) and 2025–2026 prices of field surveys — state as of October 2026

> **Method note: read this first.**
> - **Most Czech hosts were unreachable.** The network policy blocked direct access with HTTP 403. Blocked hosts included nature.cz, npu.cz, aiscr.cz, mzcr.cz, sekm.cz, chmi.cz, caa.gov.cz, uhul.cz, cuzk.gov.cz, smlouvy.gov.cz, estav.cz, nejremeslnici.cz, muj-pravnik.cz, ceskestavby.cz, tzb-info.cz and web.archive.org.
> - **The 35-call WebSearch budget is fully used.** Bullets marked *(search summary)* rest on the search engine's summary of the linked page. The page itself was not opened.
> - **GitHub was reachable, and four kinds of source there carry most of the verification:**
>   1. **Recent third-party checks of endpoints.** [vfosnar/osm-research](https://github.com/vfosnar/osm-research) checked AOPK and NPÚ services on 2026-09-27. [papricek/historie](https://github.com/papricek/historie) queried NPÚ services on 2026-07-23.
>   2. **Capability snapshots.** The catalogue [jendahorak/mdwiki](https://github.com/jendahorak/mdwiki) lists layers from GetCapabilities. Its snapshots are undated.
>   3. **AMČR's own source code and API documentation** (ARUP-CAS repositories).
>   4. **Consolidated law texts mirrored from e-Sbírka.** [flatiocom/czech-law-md](https://github.com/flatiocom/czech-law-md) and [legalize-dev/legalize-cz](https://github.com/legalize-dev/legalize-cz) carry the e-Sbírka ELI of each version. Laws are cited below with the e-Sbírka ELI and the mirror file that was read.
> - **No endpoint was called live in this session.** Re-check each endpoint once before production use.
> - **Correction to the earlier notes** (`cz_prirodni_fyzicke_podminky.md`, Q6): the forest-edge distance in § 14 odst. 2 lesního zákona has been **30 m since 1 January 2024**, not 50 m. Details are in Q8.

## Q1: AOPK ČR — open data and WMS/WFS for NATURA 2000 (EVL, ptačí oblasti), CHKO and their zones, ZCHÚ, památné stromy and registered VKP; licence

### Takeaway
- **Everything except registered VKP is free open data.** AOPK publishes NATURA 2000, CHKO and NP with their zones, MZCHÚ with ochranná pásma, and památné stromy under **CC BY 4.0** (attribution "© AOPK ČR"). Channels:
  - SHP downloads on data.nature.cz;
  - an ArcGIS Hub with GeoJSON, CSV and KML;
  - ArcGIS REST MapServers and OGC WMS/WFS on gis.nature.cz;
  - INSPIRE Protected Sites WMS and ATOM.
- **Registered VKP have no national layer.** The ORP keep them, and they enter the ÚAP as jev 13.
- **The legal rules from the earlier notes were checked against the consolidated zákon 114/1992 Sb. (version of 1 Oct 2025).** All but one are confirmed:
  - the statutory 50 m ochranné pásmo of MZCHÚ;
  - the 10 × trunk-diameter ochranné pásmo of a památný strom;
  - the Natura screening stanovisko within 30 days;
  - biologické hodnocení at the investor's cost when the authority asks for it.
- **Two corrections.** For VKP, the law now requires a *souhlas* rather than a závazné stanovisko. In a CHKO, no consent is issued for building in the zastavěné území within zone IV.

### Cited Findings

#### Services, downloads and record counts (ZCHÚ, CHKO, NATURA 2000)
- **SHP downloads** in S-JTSK: MZCHÚ `https://data.nature.cz/ds/1/download`, VZCHÚ `…/ds/3/download`, EVL `…/ds/8/download`. A GeoJSON of the MZCHÚ layer on the ArcGIS Hub `gis-aopkcr.opendata.arcgis.com` was verified on 2026-09-27 — [vfosnar/osm-research: AOPK ZCHÚ + Natura 2000](https://github.com/vfosnar/osm-research/blob/HEAD/candidates/aopk-zvlaste-chranena-uzemi.md)
- **ArcGIS REST:** `https://gis.nature.cz/arcgis/rest/services/UzemniOchrana/ChranUzemi/MapServer` and `…/UzemniOchrana/Natura2000/MapServer` (layer 0 = PO, 1 = EVL) — [vfosnar/osm-research](https://github.com/vfosnar/osm-research/blob/HEAD/candidates/aopk-zvlaste-chranena-uzemi.md)
- **WFS:** `https://gis.nature.cz/arcgis/services/UzemniOchrana/ChranUzemi/MapServer/WFSServer` and `…/Natura2000/MapServer/WFSServer`. The older path under `/arcgis/rest/services/…/WFSServer` returns HTTP 400 — [vfosnar/osm-research](https://github.com/vfosnar/osm-research/blob/HEAD/candidates/aopk-zvlaste-chranena-uzemi.md)
- **Record counts (REST, 2026-09-27):** MZCHÚ 2 687 (PP 1 621, PR 830, NPP 126, NPR 110); VZCHÚ 33 (NP + CHKO); klidová území NP 23; ptačí oblasti 42; EVL 1 111 — [vfosnar/osm-research](https://github.com/vfosnar/osm-research/blob/HEAD/candidates/aopk-zvlaste-chranena-uzemi.md)
- **Feature types in the ChranUzemi WFS:**
  - MZCHÚ (polygon and point);
  - Ochranné pásmo MZCHÚ;
  - Dílčí plochy MZCHÚ;
  - Arondace v zóně NP;
  - Klidové území NP;
  - **Zonace velkoplošného ZCHÚ**, i.e. the NP and CHKO zones;
  - Velkoplošné ZCHÚ;
  - Smluvně chráněné území.
  Source: [mdwiki – WFS Chráněná území (capabilities snapshot)](https://github.com/jendahorak/mdwiki/blob/HEAD/content/gis.nature.cz/WFS%20Chr%C3%A1n%C4%9Bn%C3%A1%20%C3%BAzem%C3%AD.md)
- **Feature types in the Natura2000 WFS:** Ptačí oblast, Evropsky významná lokalita, and "Forma ochrany EVL – stav k NV 207/2016 (1. 7. 2016)" — [mdwiki – WFS Soustava území Natura 2000](https://github.com/jendahorak/mdwiki/blob/HEAD/content/gis.nature.cz/WFS%20Soustava%20%C3%BAzem%C3%AD%20Natura%202000.md)
- **One bundled WFS** (`Aplikace/Opendata/MapServer/WFSServer`) offers 27 feature types. They include VZCHÚ, zonace VZCHÚ, MZCHÚ, OP MZCHÚ, four památné-strom layers, EVL, ptačí oblasti, biosférické rezervace, "ÚSES – koncepční vymezení nadregionálních biocenter", lokality národně významných druhů and biotop zvláště chráněných druhů velkých savců — [mdwiki – WFS Opendata](https://github.com/jendahorak/mdwiki/blob/HEAD/content/gis.nature.cz/WFS%20Opendata.md). A research project uses this WFS to fetch EVL — [jonasgaigr/InvazMapCZ config.R](https://github.com/jonasgaigr/InvazMapCZ/blob/HEAD/config.R)
- **ÚAP service.** AOPK's "údaje o území" service (`UzemneAnalytickePodklady/UdajeOUzemi`, WMS and WFS) has 20 layers. Among them: ÚSES nadregionální biocentra (koncepce), EVL, PO, OP MZCHÚ, MZCHÚ, klidová území NP, zonace VZCHÚ, "VZCHÚ a jejich ochranná pásma" and památné stromy — [mdwiki – WMS Údaje o území](https://github.com/jendahorak/mdwiki/blob/HEAD/content/gis.nature.cz/WMS%20%C3%9Adaje%20o%20%C3%BAzem%C3%AD.md)
- **Biotope mapping WMS** (`Biotopy/PrirBiotopHabitat`): layers "Habitat – aktualizace 2007–2023" and "Habitat – mapování 2001–2005" — [mdwiki – WMS Přírodní biotopy a habitaty](https://github.com/jendahorak/mdwiki/blob/HEAD/content/gis.nature.cz/WMS%20P%C5%99%C3%ADrodn%C3%AD%20biotopy%20a%20habitaty.md)
- **INSPIRE services.** The INSPIRE ProtectedSites WMS on gis.nature.cz and the ATOM feed `http://gis.nature.cz/inspire/atom/atom.xml` both passed the 2024 INSPIRE accessibility check — [INSPIRE-MIF mr-tools, 2024 CZ log](https://github.com/INSPIRE-MIF/mr-tools/blob/HEAD/dataset-accessibility/2024/geonetwork-logs/09_CZ_Simplification.csv)
- **Viewer.** The ÚSOP register (detail pages of ZCHÚ and památné stromy) is at `https://drusop.aopk.gov.cz/` — [vfosnar/osm-research](https://github.com/vfosnar/osm-research/blob/HEAD/candidates/aopk-zvlaste-chranena-uzemi.md)

#### Památné stromy
- **Downloads:** `https://data.nature.cz/ds/56/download`, `…/57/…` and `…/58/…` (SHP, S-JTSK), plus GeoJSON in WGS84 via the ArcGIS Hub — [vfosnar/osm-research: Památné stromy](https://github.com/vfosnar/osm-research/blob/HEAD/candidates/known-aopk-pamatne-stromy.md)
- **ArcGIS REST** `https://gis.nature.cz/arcgis/rest/services/PamatneStromy/PamatneStromy/MapServer` has layers 0 objekty, 1 jedinci, 2 linie, 3 polygony and 6 centroidy, with a matching WFSServer — [vfosnar/osm-research](https://github.com/vfosnar/osm-research/blob/HEAD/candidates/known-aopk-pamatne-stromy.md)
- **Conflict on the service name.** An older capabilities snapshot names the service `PamatneStromy/PamStrom/MapServer` — [mdwiki – WMS Památné stromy](https://github.com/jendahorak/mdwiki/blob/HEAD/content/gis.nature.cz/WMS%20Pam%C3%A1tn%C3%A9%20stromy.md). The 2026-verified name should take precedence.
- **Counts (2026-09-27):** 5 359 protected objects, 16 972 individual trees, 80 alleys without individual positions (lines), 39 groups without positions (polygons) and 5 478 centroids. Data are dated 10 Sept 2026.
- **Attributes** include `KOD` (ÚSOP code), `OP_TYP` and `URL_USOP`. The species is not in the geometry layer; it is on the ÚSOP detail page.
- **Lag and duplicates.** Dead trees leave the register with a delay. Brno, Ostrava and Plzeň publish duplicate city sets.
  The counts, attributes and lag notes all come from [vfosnar/osm-research](https://github.com/vfosnar/osm-research/blob/HEAD/candidates/known-aopk-pamatne-stromy.md).

#### Licence
- **Terms.** CC BY 4.0 with attribution "(c) AOPK ČR", stated on the data.nature.cz dataset pages. The NKOD entries carry no terms-of-use specification. MZCHÚ are updated quarterly (per NKOD) and other layers irregularly — [vfosnar/osm-research](https://github.com/vfosnar/osm-research/blob/HEAD/candidates/aopk-zvlaste-chranena-uzemi.md); [vfosnar/osm-research – památné stromy](https://github.com/vfosnar/osm-research/blob/HEAD/candidates/known-aopk-pamatne-stromy.md)
- **QGIS plugin.** The "Czech and Slovak free geodata" plugin labels the AOPK ChranUzemi WMS as "Creative Commons Uveďte původ 4.0", linking to data.nature.cz/ds/4 — [OpenGeoLabs/czech_slovak_freegeodata – AOPK_ChranUzemi](https://github.com/OpenGeoLabs/czech_slovak_freegeodata/blob/HEAD/data_sources/AOPK_ChranUzemi/metadata.ini)

#### Registered VKP
- **VKP ze zákona.** Under § 3 odst. 1 písm. b) zákona 114/1992 Sb., forests, peat bogs, watercourses, ponds, lakes and floodplains are VKP by law. Other parts of the landscape become VKP when the orgán ochrany přírody registers them under § 6, e.g. mokřady, stepní trávníky, remízy, meze and trvalé travní plochy — [e-Sbírka 114/1992 Sb., version 1. 10. 2025](https://e-sbirka.gov.cz/eli/cz/sb/1992/114/2025-10-01) (read via [flatiocom mirror](https://github.com/flatiocom/czech-law-md/blob/HEAD/zakony/1992/114-1992.md))
- **Consent, not závazné stanovisko.** § 4 odst. 2 (current text): interventions that could damage a VKP require a "**souhlas** orgánu ochrany přírody". The listed interventions include "umisťování staveb, pozemkové úpravy, změny druhu nebo způsobu využití pozemků … odvodňování" — [e-Sbírka 114/1992 Sb.](https://e-sbirka.gov.cz/eli/cz/sb/1992/114/2025-10-01) (via [flatiocom](https://github.com/flatiocom/czech-law-md/blob/HEAD/zakony/1992/114-1992.md)). This corrects the earlier unverified "závazné stanovisko".
- **ORP maintain the layers.** For example, a 2022 thesis updated the digital VKP map data for the Tišnov environmental department and found small boundary corrections were needed in almost every VKP *(search summary)* — [theses.cz – registrované VKP Tišnov](https://theses.cz/id/57etur?lang=en)
- **ÚAP.** The list of ÚAP sledované jevy in vyhláška 157/2024 Sb. includes jev 13 "významný krajinný prvek", jev 11 "památný strom a jeho ochranné pásmo", jev 15 (ZCHÚ, NP and CHKO zones, klidová území, OP ZCHÚ) and jev 16 "EVL, ptačí oblast" — [e-Sbírka 157/2024 Sb.](https://e-sbirka.gov.cz/eli/cz/sb/2024/157/2026-01-01) (via [legalize-cz mirror](https://github.com/legalize-dev/legalize-cz/blob/HEAD/cz/SB-2024-157.md))

#### Legal rules, checked against the consolidated zákon 114/1992 Sb. (version of 1. 10. 2025)
All six rules below come from [e-Sbírka 114/1992 Sb.](https://e-sbirka.gov.cz/eli/cz/sb/1992/114/2025-10-01), read via the [flatiocom mirror](https://github.com/flatiocom/czech-law-md/blob/HEAD/zakony/1992/114-1992.md).
- **§ 37 odst. 1 (MZCHÚ buffer):** "Pokud se ochranné pásmo národní přírodní rezervace, národní přírodní památky, přírodní rezervace nebo přírodní památky nevyhlásí, je jím území do vzdálenosti 50 m od hranic zvláště chráněného území."
- **§ 46 odst. 3 (památný strom):** where no OP has been declared, "má každý strom základní ochranné pásmo ve tvaru kruhu o poloměru desetinásobku průměru kmene měřeného ve výši 130 cm nad zemí". Inside it, harmful activity such as "výstavba, terénní úpravy, odvodňování, chemizace" is not permitted.
- **§ 44 (NP and CHKO):**
  - odst. 1: no stavba may be permitted on the territory of a NP or CHKO without the souhlas of the orgán ochrany přírody;
  - odst. 3: the souhlas "se nevydává" for záměry in the zastavěné území of a municipality in **zone IV of a CHKO**, nor in zastavěné území or zastavitelné plochy where the územní plán sets prvky regulačního plánu or a regulační plán exists.
- **§ 45i odst. 1–2 (NATURA 2000):** a záměr is submitted to the orgán ochrany přírody for a stanovisko on possible significant impact on an EVL or ptačí oblast, which must be issued within 30 days. If the impact is not excluded, the záměr is assessed under the EIA law.
- **§ 45j (authorisation):** the assessment under § 45i odst. 2 and the hodnocení under § 67 may be done only by holders of a zvláštní autorizace.
- **§ 67 odst. 1 (biologické hodnocení):** the investor must arrange a přírodovědný průzkum and biologické hodnocení at their own cost, if the authority responsible for the intervention decides it is necessary.

#### Felling (relevant to the dendrologický průzkum in Q10)
- **The permit duty.** § 8 odst. 1: "Ke kácení dřevin je nezbytné povolení orgánu ochrany přírody, není-li dále stanoveno jinak" — [e-Sbírka 114/1992 Sb.](https://e-sbirka.gov.cz/eli/cz/sb/1992/114/2025-10-01)
- **Exemptions under vyhláška 189/2013 Sb.** (version of 1 Apr 2019): no permit is needed for
  - trees with a trunk circumference up to 80 cm at 130 cm height;
  - zapojené porosty up to 40 m² in total;
  - fruit trees in the zastavěné území on parcels recorded as "zahrada" or "zastavěná plocha a nádvoří".
  Source: [e-Sbírka 189/2013 Sb.](https://e-sbirka.gov.cz/eli/cz/sb/2013/189/2019-04-01) (via [legalize-cz](https://github.com/legalize-dev/legalize-cz/blob/HEAD/cz/SB-2013-189.md)). The government portal confirms the 80 cm rule, except for trees in an alley, a VKP or a replacement planting *(search summary)* — [Portál veřejné správy – Povolení kácení dřevin rostoucích mimo les](https://portal.gov.cz/sluzby-vs/S7222)

### Inferences
- **AOPK is the easiest provider to automate.** Point-in-polygon queries against the ChranUzemi, Natura2000 and PamatneStromy REST services answer "is the plot in a ZCHÚ, CHKO zone, EVL or PO, or in an OP". Commercial use is allowed with "© AOPK ČR" attribution.
- **Two buffers must be computed, not just looked up:**
  - **MZCHÚ:** a 50 m buffer around every MZCHÚ that has no declared OP (compare with the "Ochranné pásmo MZCHÚ" layer).
  - **Památné stromy:** a 10 × DBH circle around each tree without a declared OP. DBH is not in the geometry layer, so either read the ÚSOP detail or flag a conservative radius, e.g. 15–20 m for large trees (an assumption, not a sourced figure).
- **CHKO zone IV changes the procedure.** A family house in the zastavěné území in zone IV needs no § 44 souhlas. Elsewhere in a CHKO it does. The check needs the CHKO zonation intersected with the zastavěné území from the územní plán, which is outside this note's scope.
- **VKP ze zákona can be approximated from existing geometry:** forests, watercourses, ponds and floodplains from ZABAGED or DIBAVOD (see the earlier notes). Registered VKP require ORP or ÚAP data.

### Gaps
- **No live check.** GetCapabilities was not called live. Service paths come from third-party checks in 2026 and undated snapshots.
- **Licence coverage.** The CC BY 4.0 statement was seen for specific datasets (ds/1, ds/4, ds/58). That it applies to every service, e.g. biotope mapping, is assumed, not verified.
- **NDOP** (species records): access terms were not checked in this pass.
- **Upcoming text.** The mirror lists a next version of zákon 114/1992 Sb. effective 1 Jan 2027. Its content was not checked.

## Q2: ÚSES — where do the data live (ÚP/ÚAP, AOPK, kraje)?

### Takeaway
- **No single national ÚSES dataset exists.** The binding delineation sits in spatial-planning documentation: nadregionální and regionální prvky in the kraj's ZÚR, lokální prvky in the obec's územní plán.
- **ÚAP collect both** as jev 12 under vyhláška 157/2024 Sb.
- **AOPK has only a conceptual layer** of nadregionální biocentra (open WFS/WMS, CC BY 4.0). The 1996 ÚTP "Regionální a nadregionální ÚSES ČR" is historical background.

### Cited Findings
- **The AOPK layer.** AOPK publishes "ÚSES – koncepční vymezení nadregionálních biocenter" in its Opendata WFS. Layer 0 of the AOPK ÚAP service is "Územní systém ekologické stability – nadregionální biocentra – koncepce" — [mdwiki – WFS Opendata](https://github.com/jendahorak/mdwiki/blob/HEAD/content/gis.nature.cz/WFS%20Opendata.md); [mdwiki – WMS Údaje o území](https://github.com/jendahorak/mdwiki/blob/HEAD/content/gis.nature.cz/WMS%20%C3%9Adaje%20o%20%C3%BAzem%C3%AD.md)
- **ÚAP jev 12.** "Územní systém ekologické stability" is ÚAP sledovaný jev 12 under vyhláška 157/2024 Sb. o územně analytických podkladech, územně plánovací dokumentaci a jednotném standardu — [e-Sbírka 157/2024 Sb.](https://e-sbirka.gov.cz/eli/cz/sb/2024/157/2026-01-01) (via [legalize-cz](https://github.com/legalize-dev/legalize-cz/blob/HEAD/cz/SB-2024-157.md))
- **An informal ZÚR data schema.** It defines a layer "USES_ZUR_p: Nadregionální a regionální ÚSES vymezený v ZÚR", with element type (NRBC, NRBK, RBC, RBK), time horizon (funkční / k založení) and the ZÚR version's validity date *(search summary; a shared Google document, not an official specification)* — [schema document](https://docs.google.com/document/d/1nAIvVtlZbZobFjF4OAoiH1f3MSaXx7y8/export?format=pdf)
- **The ÚTP and how local ÚSES are planned.** University course material lists the ÚTP "Regionální a nadregionální ÚSES ČR" (1996, 1 : 50 000, passed to districts), the ZÚR and the ÚAP as inputs for local ÚSES. Local biocentres are placed inside the regional and supra-regional biocorridors *(search summary)* — [MUNI – Postup návrhu ÚSES](https://is.muni.cz/el/sci/podzim2018/Z7000/Postup_navrhu_USES.pdf); [MUNI – prezentace ÚSES](https://is.muni.cz/el/sci/podzim2014/Z7000/um/prezentace_uses2.pdf)
- **Who is responsible.** Supra-regional ÚSES fall under MŽP and regional ÚSES under the kraje. Municipal ÚSES documents often predate the 1997 regional and supra-regional framework and differ from it *(search summary)* — [uses.cz conference paper (Kocian)](https://www.uses.cz/wp-content/uploads/2022/07/2_kocian.pdf); [uses.cz conference paper (Glos)](https://www.uses.cz/wp-content/uploads/2022/07/9_Glos.pdf)
- **ZÚR services exist.** Some kraje publish their ZÚR as INSPIRE WMS/WFS, e.g. Jihočeský kraj `VyuzitiUzemiZUR` (WMS and WFS) and Plzeňský kraj `ZUR_INSPIRE` (WMS). Both passed the 2024 INSPIRE check — [INSPIRE-MIF 2024 CZ log](https://github.com/INSPIRE-MIF/mr-tools/blob/HEAD/dataset-accessibility/2024/geonetwork-logs/09_CZ_Simplification.csv)

### Inferences
- **Order of checks for a plot:**
  1. the local územní plán (lokální biocentrum or biokoridor, usually as an unbuildable plocha or koridor);
  2. the kraj's ZÚR service (regional and supra-regional elements);
  3. the AOPK conceptual layer, only as a hint.
- **The jednotný standard of 157/2024 Sb.** should make ÚP data machine-readable over time. How far ÚSES is already harmonised nationally is not known (see Gaps).

### Gaps
- **No national dataset found.** No harmonised ÚSES dataset or download was found. The national spatial-planning portal (uzemniplanovani.gov.cz) was blocked by the proxy.
- **ZÚR content not checked.** Whether the ZÚR INSPIRE services above actually contain ÚSES layers was not verified.

## Q3: NPÚ — does the Památkový katalog have an API or open data? Geodata for památkové rezervace, zóny and ochranná pásma; licence

### Takeaway
- **Open data — yes:**
  - **monthly CSV exports** of the ÚSKP (KP, NKP, PR, PZ, OP and two further files), **CC BY 4.0** per NKOD;
  - **ATOM/GML** spatial identification of monuments by kraj, where the licence is unclear (CC BY-SA 4.0 in NKOD vs CC-BY 4.0 in the feed);
  - **ArcGIS REST/WMS services** on geoportal.npu.cz. The `CP_UAP_PVO` service holds polygons of NKP, KP, World Heritage sites and buffer zones, památkové rezervace, památkové zóny, krajinné památkové zóny and ochranná pásma.
- **API — only an undocumented one.** The Památkový katalog web application uses a JSON endpoint (`/api/legal-state/{id}`) with no public documentation found.
- **Legal effect.** Any stavba or terénní úprava in a rezervace, zóna or OP needs a závazné stanovisko of the ORP (§ 14 odst. 2 zákona 20/1987 Sb.). OP are declared by opatření obecné povahy (§ 17).

### Cited Findings
- **CSV open data:**
  - URLs: `https://www.pamatkovykatalog.cz/opendata/npu_opendata_KP.csv`, plus `_NKP`, `_PR`, `_PZ`, `_OP`, `_SD` and `_NZ.csv`;
  - licence: CC BY 4.0 per the NKOD terms specification;
  - update: monthly;
  - content: address-only, with no coordinates;
  - size: KP 39 161 rows (objekt 25 924, areál 12 194, soubor 985); PZ 503 and PR 114 rows.
  Source: [vfosnar/osm-research: NPÚ ÚSKP](https://github.com/vfosnar/osm-research/blob/HEAD/candidates/npu-uskp-pamatky.md)
- **ATOM spatial identification:**
  - feeds: `https://geoportal.npu.cz/opendata/atom/NPU_USKP_DefinicniBod/npu.xml`, plus `NPU_USKP_Centroid` and `NPU_USKP_Polygon`;
  - format: GML 3, EPSG:5514, 14 files (one per kraj);
  - size: 39 357 definition points (checked 2026-09-27); the feed was last updated 2025-11-21;
  - linking: each point carries the RÚIAN building code (`KodStavObjRUIAN`), filled for 56 % of points in Prague.
  Source: [vfosnar/osm-research](https://github.com/vfosnar/osm-research/blob/HEAD/candidates/npu-uskp-pamatky.md). The same feeds and the WMS `Tematicke/CP_UAP_BI` and `Tematicke/CP_UAP_PVO` are registered in NKOD — [kokes/nkod-data – geoportal.npu.cz](https://github.com/kokes/nkod-data/blob/HEAD/datasets/geoportal.npu.cz.json)
- **Licence conflict.** For the ÚSKP spatial identification, the NKOD specification says CC BY-SA 4.0 while the ATOM `<rights>` say "CC-BY 4.0" — [vfosnar/osm-research](https://github.com/vfosnar/osm-research/blob/HEAD/candidates/npu-uskp-pamatky.md)
- **REST services queried by plot envelope on 2026-07-23:**
  - layers 0–9 of `CP_UAP_PVO`: NKP, KP, statky světového dědictví and their nárazníkové zóny, parts of protected areas, rezervace, zóny, krajinné památkové zóny, ochranná pásma;
  - the `CP_PrvekP` polygon service of Památkový katalog elements;
  - the paGIS base identifiers `CP_PIP_basic`.
  A negative result means only the public state of those services on that day — [papricek/historie – Památková a archeologická evidence NPÚ (23. 7. 2026)](https://github.com/papricek/historie/blob/HEAD/prameny_online/pamatkova_pece/2026/README.md)
- **NKP and full-text queries.** A 2026 data-journalism script downloads all NKP from `geoportal.npu.cz/arcgis/rest/services/Tematicke/CP_PaKaOchreNKP/MapServer/0/query` — [DataRozhlas/divnovylety](https://github.com/DataRozhlas/divnovylety/blob/HEAD/049_nkp_stazeni_znovu_a_lepe.py). Another site queries `CP_PaKaSextc/MapServer/12` by name and gets `KatCislo` and `urlExt` — [csh-cz/web](https://github.com/csh-cz/web/blob/HEAD/apps/hodinarium-eu/public/admin/csh-link-picker.js)
- **JSON API (undocumented).** In July 2026 the JSON API `https://pamatkovykatalog.cz/api/legal-state/147883` was used together with the CSV in its "stav dat 2. 7. 2026" — [papricek/historie – zjištění 2026-07-31](https://github.com/papricek/historie/blob/HEAD/prameny_online/reserse/2026-07-31_soucasny_stav/zjisteni.md). The open-data page is `pamatkovykatalog.cz/openData` — [DataRozhlas/divnovylety 048](https://github.com/DataRozhlas/divnovylety/blob/HEAD/048_nkp_geocoding.py). The catalogue itself is a JavaScript application that a simple fetch cannot scrape — [papricek/historie – zjištění (novější historie)](https://github.com/papricek/historie/blob/HEAD/prameny_online/reserse/2026-07-31_novejsi_historie/zjisteni.md)
- **MIS documents.** Licences on NPÚ MIS photo documents (iispp.npu.cz) vary. Most are "neurčena"; one photo is CC BY-NC-ND 4.0 — [papricek/historie](https://github.com/papricek/historie/blob/HEAD/prameny_online/pamatkova_pece/2026/README.md)
- **INSPIRE services.** An INSPIRE Protected Sites (cultural heritage) WFS exists at `geoportal.npu.cz/arcgis/services/INSPIRE/ProtectedSites/MapServer/WFSServer` — [mdwiki](https://github.com/jendahorak/mdwiki/blob/HEAD/content/geoportal.npu.cz/INSPIRE%20mapov%C3%A1%20slu%C5%BEba%20pro%20t%C3%A9ma%20Chr%C3%A1n%C4%9Bn%C3%A1%20%C3%BAzem%C3%AD%20-%20kulturn%C3%AD%20d%C4%9Bdictv%C3%AD.md). In the 2024 INSPIRE check the ATOM `https://inspire.npu.cz/atom/npu.xml` passed, while the WMS timed out, as it already had in 2023 — [INSPIRE-MIF 2024 log](https://github.com/INSPIRE-MIF/mr-tools/blob/HEAD/dataset-accessibility/2024/geonetwork-logs/09_CZ_Simplification.csv); [INSPIRE-MIF 2023 failed requests](https://github.com/INSPIRE-MIF/mr-tools/blob/HEAD/dataset-accessibility/2023/link-checker_script/view/View_CZ_failed_requests.log)
- **Legal effect (version of 1. 7. 2025).** All points below are from [e-Sbírka 20/1987 Sb., version 1. 7. 2025](https://e-sbirka.gov.cz/eli/cz/sb/1987/20/2025-07-01) (via [flatiocom](https://github.com/flatiocom/czech-law-md/blob/HEAD/zakony/1987/20-1987.md)).
  - **§ 14 odst. 1:** the owner of a KP must obtain a rozhodnutí or závazné stanovisko of the ORP (of the kraj for an NKP) before any obnova.
  - **§ 14 odst. 2:** the same applies to a non-monument nemovitost in a památková rezervace, památková zóna or OP before "zamýšlené stavbě, změně stavby, terénní úpravě … odstranění stavby, úpravě dřevin".
  - **§ 17 odst. 1:** the ORP declares an ochranné pásmo by opatření obecné povahy, after the opinion of the odborná organizace.
- **ÚAP.** Jevy 4 (KP, NKP and their OP), 5 (památkově chráněné území and its OP) and 6 (území s archeologickými nálezy) are ÚAP sledované jevy — [e-Sbírka 157/2024 Sb.](https://e-sbirka.gov.cz/eli/cz/sb/2024/157/2026-01-01) (via [legalize-cz](https://github.com/legalize-dev/legalize-cz/blob/HEAD/cz/SB-2024-157.md))
- **Permit documentation.** Vyhláška 131/2024 Sb. o dokumentaci staveb requires:
  - the technical report to state compliance with "požadavky na ochranu kulturně historických, architektonických, archeologických a urbanistických hodnot" and the "stávající ochrana území a stavby podle jiných právních předpisů";
  - the koordinační situační výkres at 1 : 200 for a monument or for a stavba in a rezervace or zóna.
  Source: [e-Sbírka 131/2024 Sb.](https://e-sbirka.gov.cz/eli/cz/sb/2024/131/2024-07-01) (via [legalize-cz](https://github.com/legalize-dev/legalize-cz/blob/HEAD/cz/SB-2024-131.md))

### Inferences
- **Automation path:**
  1. Intersect the plot polygon with `CP_UAP_PVO` (rezervace, zóna, OP, KP).
  2. Join monument attributes from the CSV via `PrStavId` and the RÚIAN building code.
  3. Link out to pamatkovykatalog.cz.
- **Licences for a commercial product.** CSV attributes are CC BY 4.0. The spatial ATOM layers should be treated as possibly CC BY-SA until NPÚ resolves the conflict, because share-alike could reach a derived database. No licence statement was found for the REST services.
- **No new heritage code by the latest checked version.** The 1. 7. 2025 consolidated version of zákon 20/1987 Sb. shows no announced future version in the mirror's metadata, unlike 114/1992 Sb. and 289/1995 Sb., which list 1. 1. 2027 versions. So no replacement heritage code with a set effective date seems to have been adopted as of that version. This is weak evidence and remains unverified.

### Gaps
- **No API documentation** for the Památkový katalog was found; the API is undocumented and may change.
- **No licence statement** was found for the geoportal.npu.cz ArcGIS services as such.
- **Unclear file suffixes.** The meaning of the `_SD` and `_NZ` CSV files was not given in the source; they are presumably světové dědictví and nárazníkové zóny.

## Q4: Archeologický ústav / AMČR — is the ÚAN layer available as WMS or download, and to whom? How does a builder learn a plot's ÚAN category?

### Takeaway
- **The ÚAN layer is NPÚ's, not AMČR's.** The ÚAN polygons belong to NPÚ's Státní archeologický seznam (SAS ČR). The public can view and query them through:
  - the NPÚ Geoportál ArcGIS service `CP_UAN`, with layers ÚAN I, ÚAN II, "pásmo ÚAN II" and ÚAN IV;
  - the ISAD application.
  Bulk download goes through an NPÚ order portal with "otherRestrictions"; the licence is unclear.
- **AMČR offers an API and the notification form.** AMČR is run by ARÚP and ARÚB within AIS CR. Its OAI-PMH API is published under **CC BY-NC 4.0**, and commercial use needs a prior written agreement. Builders also file the § 22 odst. 2 notification online through AMČR.
- **For a builder the category hardly matters.** ÚAN III is everything not classed I, II or IV and is not drawn as a polygon, so the notification duty applies almost everywhere except ÚAN IV.

### Cited Findings
- **The `CP_UAN` service.** A point query on 2026-07-23 against the four layers of `https://geoportal.npu.cz/arcgis/rest/services/Tematicke/CP_UAN/MapServer` returned a single hit: layer 1, ÚAN II "Zahrádka.", ID SAS 21475, state "Platný". The layers ÚAN I, "pásmo ÚAN II" and ÚAN IV returned nothing. The ISAD record (`https://isad.npu.cz/zahradka-21475`) gives:
  - type: vesnice, intravilán;
  - accuracy: about ±50 m;
  - approved 18. 4. 2001, updated 9. 6. 2023;
  - a public xlsx export.
  Source: [papricek/historie – NPÚ evidence (23. 7. 2026)](https://github.com/papricek/historie/blob/HEAD/prameny_online/pamatkova_pece/2026/README.md)
- **NPÚ metadata.** The record for "Území s archeologickými nálezy – vymezení rozsahu" describes polygon data for the SAS ČR, with a WMS and a download service. Access constraints are "otherRestrictions", and the download link leads to the NPÚ order portal (ProductDetail, productId=31) *(search summary)* — [NPÚ metadata record](https://geoportal.npu.cz/metadataserver/en/record/full/F4947102-BFD2-4F53-B6A2-FA8A6775A360?dlang=cze)
- **The four ÚAN categories** *(search summary)*:
  - **ÚAN I:** finds positively proven — [Muzeum Příbram – informace pro stavebníky](https://muzeum-pribram.cz/userfiles/pdf/informace-pro-stavebniky-rozvoj.pdf); [SAS database](https://isadtest.npu.cz)
  - **ÚAN II:** finds reasonably presumed, given in one source as a 51–100 % probability — [MUNI 2004 course text](https://is.muni.cz/el/phil/jaro2004/AEA_06/TT_2_J04.pdf?kod=AJ2101)
  - **ÚAN III:** the rest of the inhabitable territory, about a 50 % probability; the methodology applies it to the whole state except ÚAN IV — [MUNI – UAN](https://is.muni.cz/el/phil/jaro2019/KLBcA54/um/UAN.docx?lang=cs); [Muzeum Příbram](https://muzeum-pribram.cz/userfiles/pdf/informace-pro-stavebniky-rozvoj.pdf)
  - **ÚAN IV:** quarried or fully investigated land (doly, lomy, cihelny, pískovny) — [MUNI – UAN](https://is.muni.cz/el/phil/jaro2019/KLBcA54/um/UAN.docx?lang=cs)
- **ÚAN III in GIS.** It is not mapped as a separate polygon, while ÚAN IV is drawn like ÚAN I *(search summary)* — [NPÚ IISPP/ISAD presentation 2021](https://pagis.npu.cz/wordpress/wp-content/uploads/2021/10/IISPP_ISAD_20211005.pdf)
- **The law does not define ÚAN.** AÚ material treats the whole of ČR as území s archeologickými nálezy *(search summary)* — [MUNI – Archeologická památková péče 2019](https://is.muni.cz/el/phil/jaro2019/KLBcA54/um/ArchPamPece_2019.pdf)
- **The notification duty in current law.** § 22 odst. 2 zákona 20/1987 Sb. (version of 1. 7. 2025): on území s archeologickými nálezy, stavebníci must notify the Archeologický ústav "již od doby přípravy záměru podle stavebního zákona, odstranění stavby nebo odstranění terénní úpravy". They must also allow záchranný archeologický výzkum. The cost rule already recorded in the earlier notes is unchanged — [e-Sbírka 20/1987 Sb.](https://e-sbirka.gov.cz/eli/cz/sb/1987/20/2025-07-01) (via [flatiocom](https://github.com/flatiocom/czech-law-md/blob/HEAD/zakony/1987/20-1987.md))
- **The AMČR confirmation letter.** AMČR has an online "Oznámení projektu stavebníkem" module. Its confirmation letter is titled "Potvrzení o splnění oznamovací povinnosti dle § 22 odst. 2 zák. č. 20/1987 Sb." and states:
  - the builder must allow the AÚ or an authorised organisation to carry out záchranný výzkum;
  - the builder is told automatically which organisation is interested, or that the project was cancelled because no research is needed;
  - the confirmation does not prove that research was done and is not a document for a dodatečné stavební povolení.
  Source: [ARUP-CAS/aiscr-webamcr – doc_utils.py](https://github.com/ARUP-CAS/aiscr-webamcr/blob/HEAD/webclient/projekt/doc_utils.py); [AMČR notification tests](https://github.com/ARUP-CAS/aiscr-webamcr/blob/HEAD/webclient/oznameni/tests/test_selenium.py)
- **The "Poučení" in the same letter adds:**
  - research proceeds under a dohoda between the stavebník and the AÚ or an authorised organisation, and the builder may choose any organisation authorised for the area (listed at `oao.aiscr.cz`);
  - without agreement, the krajský úřad sets the conditions (§ 22 odst. 1);
  - the standard form is a dohled nad zemními pracemi, or a plošný terénní výzkum ahead of or alongside construction;
  - § 266 of stavební zákon 283/2021 Sb. obliges the builder to report unexpected finds to the stavební úřad, stop work at the spot and record it in the stavební deník, whether or not research took place.
  Source: [aiscr-webamcr – doc_utils.py](https://github.com/ARUP-CAS/aiscr-webamcr/blob/HEAD/webclient/projekt/doc_utils.py); [ARUP-CAS/aiscr-oao README](https://github.com/ARUP-CAS/aiscr-oao/blob/HEAD/README.md)
- **The two institutes as joint controllers.** Archeologický ústav AV ČR, Praha (IČ 67985912) and Archeologický ústav AV ČR, Brno (IČ 68081758) are joint controllers of the notification data — [aiscr-webamcr – doc_utils.py](https://github.com/ARUP-CAS/aiscr-webamcr/blob/HEAD/webclient/projekt/doc_utils.py)
- **The AMČR web map** loads NPÚ's WMS `geoportal.npu.cz/arcgis/services/Experimental/TM_proAMCR/MapServer/WMSServer` (layers 2,3,4,5,7,8,10,11) as a "npuOchrana" overlay — [aiscr-webamcr – mapa_settings_jtsk.js](https://github.com/ARUP-CAS/aiscr-webamcr/blob/HEAD/webclient/static/js/mapa_settings_jtsk.js)
- **The AMČR API:**
  - **Interfaces:** OAI-PMH at `https://api.aiscr.cz/oai`, which since Dec 2025 points to the latest version (v2.2, schema of 2025-06-18); plus a File API, an Authentication API and an AMCR-PAS API — [aiscr-api-home – index](https://github.com/ARUP-CAS/aiscr-api-home/blob/HEAD/index.qmd); [OAI-PMH docs](https://github.com/ARUP-CAS/aiscr-api-home/blob/HEAD/oai-pmh/index.qmd); [changelog 2025-12-19](https://github.com/ARUP-CAS/aiscr-api-home/blob/HEAD/changelogs/2025-12-19.qmd)
  - **Size:** about 1.04 million records in a harvest on 2026-10-04 — [miku/metha OAI report](https://github.com/miku/metha/blob/HEAD/extra/repodata/report-2026-10-04.md)
  - **Licence:** CC BY-NC 4.0 unless stated otherwise; "Use of the AMCR API for commercial purposes is permissible only upon the execution of a prior written agreement" — [aiscr-api-home – index](https://github.com/ARUP-CAS/aiscr-api-home/blob/HEAD/index.qmd)
- **Access roles in the API.** The roles are A (anonymous), B (registered researcher), C (archaeologist of a licensed organisation) and D (archivist). Visibility of each record depends on role and processing state:
  - anonymous users see a PIAN (spatial unit) only in state 2, and a projekt only in state 6;
  - the oznamovatel is hidden from roles A and B;
  - "chranene_udaje" elements are protected per record.
  Source: [OAI-PMH docs](https://github.com/ARUP-CAS/aiscr-api-home/blob/HEAD/oai-pmh/index.qmd); [access1.csv](https://github.com/ARUP-CAS/aiscr-api-home/blob/HEAD/oai-pmh/tabs/access1.csv); [access2.csv](https://github.com/ARUP-CAS/aiscr-api-home/blob/HEAD/oai-pmh/tabs/access2.csv)
- **Other AIS CR interfaces.** The public Digital Archive is at `digiarchiv.aiscr.cz` and the help at `amcr-help.aiscr.cz` — [ARUP-CAS/aiscr-digiarchiv-2 README](https://github.com/ARUP-CAS/aiscr-digiarchiv-2/blob/HEAD/README.md)

### Inferences
- **How a builder or an automated report finds the category:**
  1. Query `CP_UAN` by plot point or polygon. A hit in ÚAN I, ÚAN II or the ÚAN II zone means a known or likely site. ÚAN IV means no duty.
  2. No hit means ÚAN III, so the duty still applies.
  3. Show the ISAD card link. The ÚAP (jev 6) at the ORP is an alternative.
  4. Advise filing the AMČR notification at the záměr preparation stage. The AMČR notification form is the practical gate, and it works whatever the category.
- **Licence consequences for a commercial plot-report product:**
  - **AMČR data:** must not be redistributed without a written agreement (CC BY-NC).
  - **NPÚ ÚAN polygons:** the terms are unclear. Showing a link and the category is lower risk than copying the geometry.
- **Time, not money.** As established earlier, a private non-business builder of a family house does not pay for the research. It costs time, mainly a watching brief during excavation.

### Gaps
- **CP_UAN details.** The full layer list and attributes of `CP_UAN`, and the meaning of "pásmo ÚAN II", come from one 2026 example and were not confirmed from capabilities.
- **No licence** was found for ÚAN polygons, whether through the services or the order portal.
- **ISAD API.** Whether ISAD has a machine API was not checked.
- **Advance-notice period.** Whether any minimum notice period applies to the AMČR notification was not found in the sources read.

## Q5: Noise and air — strategické hlukové mapy (4th round, 2022) from MZd: is there a WMS? Air-quality maps from ČHMÚ

### Takeaway
- **Noise:** yes. MZd publishes the 4th-round strategické hlukové mapy (SHM 2022) on geoportal.mzcr.cz, published 6 Nov 2023. There is an INSPIRE WFS and an ImageServer WMS per source and indicator, in 5 dB bands of Ldvn and Ln.
  - Coverage: 7 agglomerations, main roads with over 3 million vehicles a year, main railways with over 30 000 trains a year, and Letiště Praha-Ruzyně.
  - Next round: the 5th round is scheduled for 2027.
  - Licence: not found.
- **Air:** ČHMÚ publishes five-year average concentration maps on a 1 × 1 km grid every year, the latest found being 2019–2023. They come as files and as the CENIA GeoServer WMS `chmu_ovzdusi`.

### Cited Findings
- **SHM 2022 WFS** `https://geoportal.mzcr.cz/server/services/SHM2022/INSPIRE/MapServer/WFSServer` has layers for agglomerations (total, roads, railways, airports, industry) and for main roads, main railways and the main airport, each in Ldvn and Ln.
  - Layer abstracts give the coverage: 7 agglomerations (Praha, Brno, Ostrava, Ústí nad Labem–Teplice, Liberec, Plzeň, Olomouc), roads with more than 3 000 000 vehicles a year, railways with more than 30 000 trains a year, and Letiště Praha Ruzyně.
  - Source: [mdwiki – SHM 2022 (capabilities snapshot)](https://github.com/jendahorak/mdwiki/blob/HEAD/content/geoportal.mzcr.cz/Strategick%C3%A9%20hlukov%C3%A9%20mapy%202022.md)
- **Per-layer WMS** run on ImageServer, e.g. `https://geoportal.mzcr.cz/server/services/SHM2022/Silnice_Ln/ImageServer/WMSServer` ("Hlukový ukazatel Ln pro hlavní silnice v 5dB pásmech"). Analogous services exist for Silnice_Ldvn, Zeleznice_*, Letiste_* and Aglomerace_*_*. 3rd-round (SHM 2017) services also remain — [mdwiki – SHM 2022 Hlavní silnice (Ln)](https://github.com/jendahorak/mdwiki/blob/HEAD/content/geoportal.mzcr.cz/Strategick%C3%A9%20hlukov%C3%A9%20mapy%202022%20-%20Hlavn%C3%AD%20silnice%20%28Ln%29.md)
- **The 4th round** ran in 2018–2022 under the CNOSSOS-EU methodology. It was due by 30. 6. 2022, with reporting to the European Commission by the end of 2022 *(search summary)* — [MZd – Základní popis 4. kola SHM](https://mzd.gov.cz/?p=130414)
- **Publication.** MZd published Hluková mapa 2022 on its geoportal on 6. 11. 2023, with the map application at `geoportal.mzcr.cz/SHM2022` *(search summary)* — [MZd – hlukové mapy](https://mzd.gov.cz/category/agendy-ministerstva/hlukove-mapy/); [MZd – Nová mapová aplikace 2022](https://mzd.gov.cz/nova-mapova-aplikace-2022/); [MZd presentation 2024](https://mzd.gov.cz/wp-content/uploads/2024/02/Strategicke-hlukove-mapy.pdf)
- **Outputs and cycle.** The results are 5 dB band maps plus tables of exposed persons, dwellings, schools and hospitals. Mapping runs in a five-year cycle: 2007, 2012, 2017, 2022, 2027 *(search summary)* — [MZd presentation 2024](https://mzd.gov.cz/wp-content/uploads/2024/02/Strategicke-hlukove-mapy.pdf); [Junek et al., Hygiena 2020](https://hygiena.szu.cz/pdfs/hyg/2020/02/06.pdf)
- **Air-quality maps** *(search summary)*. ČHMÚ publishes five-year averages for 2019–2023 on a 1 × 1 km grid:
  - coordinates: UTM33N since 2018, with outputs also in S-JTSK;
  - legal basis: maps are published annually under § 11 odst. 5 a 6 zákona 201/2012 Sb.;
  - pollutants: annual means of NO2, PM10, PM2.5, benzene, BaP, As, Pb, Ni and Cd, plus the 36th highest 24-hour PM10 and the 4th highest SO2 value.
  Source: [ČHMÚ – pětileté průměry 2019–2023](https://chmi.cz/files/portal/docs/uoco/isko/ozko/23petileti/23petileti.pdf)
- **Passports for ÚAP.** MŽP passports for the ÚAP describe the five-year average maps as published yearly as 1 × 1 km shapefiles in S-JTSK and WGS84 *(search summary)* — [MŽP pasport B35a](https://www.mzp.gov.cz/system/files/2024-10/OOO-Pasport_B35a_2020-20200127_0.pdf); [MŽP pasport A65](https://www.mzp.gov.cz/system/files/2024-10/OOO-Pasport_A65_2020-20200127.pdf)
- **Service metadata.** Metadata of the service "Imise – pětileté průměry v síti 1 x 1 km" mention the periods 2017–2021 and 2016–2020 *(search summary)* — [INSPIRE Geoportal record](https://inspire-geoportal.ec.europa.eu/srv/api/records/5c77dc16-e214-4341-a077-462cc0a80153)
- **WMS** `https://gis.cenia.cz/geoserver/chmu_ovzdusi/wms` includes layers such as "koncentrace látek znečišťujících ovzduší v gridu 1x1 km za rok 2022" and imisní limity layers — [mdwiki – Kvalita ovzduší v ČR (WMS)](https://github.com/jendahorak/mdwiki/blob/HEAD/content/gis.cenia.cz/Kvalita%20ovzdu%C5%A1%C3%AD%20v%20%C4%8CR%20%28WMS%29.md). It passed the 2024 INSPIRE check, together with an ATOM GeoPackage of the 2023 measuring stations — [INSPIRE-MIF 2024 log](https://github.com/INSPIRE-MIF/mr-tools/blob/HEAD/dataset-accessibility/2024/geonetwork-logs/09_CZ_Simplification.csv)
- **Older service.** An older ArcGIS INSPIRE service `geoportal.gov.cz/arcgis/services/INSPIRE/III_5_7_8_CHMU_ovzdusi` is still listed in the QGIS plugin, with empty terms of use — [OpenGeoLabs – CHMU_kvalita_ovzdusi](https://github.com/OpenGeoLabs/czech_slovak_freegeodata/blob/HEAD/data_sources/CHMU_kvalita_ovzdusi/metadata.ini)
- **ÚAP jevy.** "Stacionární zdroj znečišťování ovzduší" is jev 55 and "hluková zóna obce" is jev 56 — [e-Sbírka 157/2024 Sb.](https://e-sbirka.gov.cz/eli/cz/sb/2024/157/2026-01-01)

### Inferences
- **What SHM can and cannot do.** SHM give a 5 dB band from the major sources only. Outside the mapped roads, railways and agglomerations they say nothing, so a missing hit does not mean the plot is quiet. They can flag plots inside Ldvn ≥ 55–60 dB bands next to motorways, class I roads and main railways.
- **The air grid only screens.** At 1 × 1 km, the air-quality data serve for screening and for the ÚAP "území s překročenými imisními limity", not for a plot-level assessment.

### Gaps
- **Licence** of the MZd geoportal SHM data was not found.
- **Thresholds and studies.** The noise limits in nařízení vlády 272/2011 Sb., and when a KHS asks for a noise study for a family house, were not verified.
- **Latest air set.** Whether a newer 2020–2024 five-year set was published in 2025–2026 is unknown.

## Q6: SEKM (kontaminovaná místa) and brownfields (CzechInvest)

### Takeaway
- **SEKM** is MŽP's public database of contaminated and potentially contaminated sites. It runs as SEKM 3, a web and mobile application at sekm.cz, with points and approved polygons and ORP-level exports (xlsx/json). It feeds ÚAP jev 52.
  - Completeness is limited: the CENIA inventory (NIKM) found many more candidate sites.
  - Interfaces: no current public WMS or API was verified, although an older CENIA WMS existed.
- **Brownfields:** CzechInvest's Národní databáze brownfieldů at brownfieldy.gov.cz shows only sites whose owners agreed to publication. It has been merged into the wider Databáze nemovitostí (databaze-nemovitosti.gov.cz). Brownfield is ÚAP jev 3.

### Cited Findings
- **Public access.** SEKM is reachable at sekm.cz and is described as MŽP's complete public database, available to state administration, professionals and the lay public *(search summary)* — [BusinessInfo – SEKM](https://www.businessinfo.cz/navody/system-evidence-kontaminovanych-mist/)
- **Architecture** *(search summary; attributed to MŽP Věstník documents)*. SEKM 3 has a web and a mobile client. A lokalita must be defined by at least one point in JTSK or WGS-84, and an approved lokalita must have a polygon — [MŽP Věstník leden 2021, příloha 2](https://www.mzp.gov.cz/system/files/2024-09/SOTPR-Vestnik_leden_2021_priloha2-210127.pdf); [MŽP Věstník leden 2021](https://mzp.gov.cz/system/files/2024-11/OOO-Vestnik_leden_2021-20210101.pdf)
- **Details and exports.** Details of each lokalita are looked up in SEKM. The summary table of contaminated-site records per ORP can be exported as .xlsx and .json *(search summary)* — [CENIA NIKM2 poster – ORP Středočeského kraje](https://cenia.gov.cz/wp-content/uploads/2022/03/Distribuce-kontaminovanych-mist-v-ORP-Stredoceskeho-kraje-poster.pdf)
- **Incompleteness.** A 2025 project aims to identify contaminated sites that the current register does not contain, and a regional study found far more potentially risky sites than SEKM records *(search summary)* — [MUNI project 3402](https://www.muni.cz/en/research/projects/3402); [CENIA 2025 – Suchánek](https://cenia.gov.cz/wp-content/uploads/2025/10/Suchanek_CZ_abstrakt_ZPPZ_2025.pdf)
- **ISVS entry.** SEKM is an integrated database of landfills, waste facilities and staré ekologické zátěže with a map interface, and is a source for ÚAP — [ISVS entry (dia_mapa)](https://github.com/dan-pavlacka/dia_mapa/blob/HEAD/platforma/src/data/ISVS.json)
- **Historical WMS.** An older WMS `geoportal.gov.cz/ArcGIS/services/CENIA/cenia_sekm/MapServer/WMSServer` appears in old code; it may no longer exist — [StoneApp/WhateverMap sample definition](https://github.com/StoneApp/WhateverMap-2.0-Framework/blob/HEAD/WhateverMap_Framework/UMD-ToolBox/sample_definition.txt)
- **ÚAP jevy.** Jev 52 is "stará zátěž území a kontaminovaná plocha" and jev 3 is "brownfield" — [e-Sbírka 157/2024 Sb.](https://e-sbirka.gov.cz/eli/cz/sb/2024/157/2026-01-01)
- **Brownfields** *(search summary)*:
  - the NDB was launched in 2008, and the current portal brownfieldy.gov.cz gives entry to its public part;
  - the non-public part holds sites whose owners did not consent to publication;
  - registration is free for private owners and municipalities;
  - size: "more than 4 000" sites, or 4 458 at the end of the previous year (undated figures);
  - subsidy registration moved to "Program Nemovitosti" at brownfieldy-dotace.czechinvest.gov.cz;
  - the NDB was merged with the business property database into the Databáze nemovitostí.
  Sources: [BusinessInfo – MPO a CzechInvest spustily nový web](https://www.businessinfo.cz/clanky/jak-vyuzit-brownfieldy-mpo-a-czechinvest-spustily-novy-web/); [Manuál pro vkládání lokalit do NDB 2025](https://brownfieldy.gov.cz/app/uploads/2025/02/manual-pro-vkladani-lokalit-do-ndb-2025.pdf); [Časopis pro města a obce 2026 – CzechInvest spustil Databázi nemovitostí](https://brownfieldy.gov.cz/app/uploads/2026/03/casopis-pro-mesta-a-obce-czechinvest-spustil-databazi-nemovitosti.pdf); [Databáze nemovitostí – manuál](https://databaze-nemovitosti.gov.cz/docs/dn_manual.pdf); [BusinessInfo – nová databáze pro OP PIK](https://www.businessinfo.cz/clanky/spusteni-nove-databaze-brownfieldu-pro-potreby-op-pik/)

### Inferences
- **What SEKM means for a family-house plot.** A SEKM hit nearby is a red flag that calls for a contamination check before purchase. No hit does not prove clean land, given the documented incompleteness, so combine SEKM with archive orthophotos (earlier notes, Q1) to spot former landfills or industrial use.
- **The brownfield database helps little here.** It exists to market sites and is opt-in, so it is a weak screening layer for family houses.

### Gaps
- **SEKM access details.** Whether sekm.cz offers anonymous map viewing, a WMS or an API in 2026, and under what licence, was not confirmed.
- **Brownfield data.** No public API or open-data export of the brownfield or Databáze nemovitostí data was found.

## Q7: Protection zones — ÚCL data on ochranná pásma letišť; Ministry of Defence zájmová / vymezená území (ÚAP)

### Takeaway
- **ÚCL:** ochranná pásma letišť a leteckých staveb are declared by opatření obecné povahy (OOP).
  - Since 2021 ÚCL lists them online as PDFs with drawings, sometimes a "zákres do ÚP"; older ones are available on request.
  - No machine-readable dataset was found. The data reach a plot through the ÚAP, jev 72.
- **MO:** its territory is ÚAP jev 77 in vyhláška 157/2024 Sb., but 2026 MO statements still use the old jev numbers:
  - **119:** the whole territory is a zájmové území for listed structure types (wind turbines, roads, etc.);
  - **102a:** airspace with height limits set by ŘLP's ATCSMA;
  - **82a:** radio-relay corridors, where *any* above-ground construction needs an MO závazné stanovisko.

### Cited Findings
- **How ÚCL declares an OP.** ÚCL may set an ochranné pásmo by opatření obecné povahy after consultation with the úřad územního plánování. The types of OP are: zákaz staveb, výškové omezení staveb, protection against dangerous and deceptive lights, zákaz laserových zařízení, and limits on high-voltage overhead lines *(search summary)* — [Portál veřejné správy – Zřizování ochranného pásma leteckých staveb](https://portal.gov.cz/sluzby-vs/zrizovani-ochranneho-pasma-leteckych-staveb-S2049)
- **The ÚCL list.** ÚCL publishes the OOP on OP issued since 2021 (the exact start date was missing from the snippet). For older OOP, ÚCL or the issuing body must be asked. Individual OOP have annexes with drawings, výškové překážky and sometimes a "zákres do ÚP", e.g. Skuteč, Bohuňovice, Klatovy *(search summary)* — [ÚCL – Ochranná pásma](https://www.caa.gov.cz/en/aerodromes/ochranna-pasma/); [ÚCL – OOP Skuteč](https://www.caa.gov.cz/en/?p=53455); [ÚCL – OOP Klatovy](https://www.caa.gov.cz/en/?p=52505)
- **How the height limit works.** In a height-limit zone, new structures may not exceed the defined surfaces unless they are shielded by an existing structure or terrain. An obstacle may exceptionally be allowed after ÚCL's letecko-provozní posouzení *(search summary of OOP texts)* — [OOP example, Klatovy 2025](https://www.klatovy.cz/mukt/user/deska/2025-12/74305.pdf)
- **Military airfields.** MO issues its own OOP, e.g. for the Náměšť airbase (title only seen) — [oouzsod.army.cz – OOP ochranná pásma Náměšť](https://oouzsod.army.cz/sites/oouzsod/files/dokumenty/zakladni-stranka/oop_ochranna_pasma_namest.pdf)
- **MO statements in 2026** *(search summary)*:
  - **Jev 119:** MO asserts its zájmové území for whole municipalities or ORP, matching the data provided in "textový pasport 186/2024", and assesses only listed structure types, incl. wind turbines, motorways and class I and II roads. Typical wording: "Celé správní území je zájmovým územím Ministerstva obrany z hlediska povolování vyjmenovaných druhů staveb".
  - **Jev 102a:** the height limit follows the ATCSMA set by ŘLP.
  - **Jev 82a** (RR corridors): "lze umístit a povolit nadzemní výstavbu jen na základě závazného stanoviska Ministerstva obrany".
  - **Legal basis:** § 175 zákona 183/2006 Sb. and the transitional § 317 odst. 2 zákona 283/2021 Sb.
  Sources: [MO – zájmová území, Pelhřimov (2026)](https://statnisluzba.mo.gov.cz/sites/statnisluzba/files/2026-01/Za%CC%81jmova%CC%81%20u%CC%81zemi%CC%81%20MO-Pelhr%CC%8Cimov.pdf); [uzemniplanovani.gov.cz – stanovisko MO ČR](https://uzemniplanovani.gov.cz/documents/d/guest/stanovisko-mo-cr)
- **New ÚAP numbering.** Under vyhláška 157/2024 Sb., jev 72 is "letiště, letecká stavba a jejich ochranné pásmo a zájmové území", jev 77 is "území vymezené Ministerstvem obrany pro zajišťování obrany státu, objekty důležité pro obranu státu a jejich ochranná pásma", and jev 63 is "elektronická komunikace, její ochranné pásmo a zájmové území" — [e-Sbírka 157/2024 Sb.](https://e-sbirka.gov.cz/eli/cz/sb/2024/157/2026-01-01) (via [legalize-cz](https://github.com/legalize-dev/legalize-cz/blob/HEAD/cz/SB-2024-157.md))

### Inferences
- **Most family houses escape both regimes,** with two exceptions:
  - an OP letiště with a zákaz staveb or a low height-limit surface near an airfield;
  - an MO radio-relay corridor (jev 82a), where even an ordinary house needs MO's závazné stanovisko.
  Both are obtainable only through the ÚAP of the ORP or kraj, or from OOP PDFs. Automation needs ÚAP data access, which is out of scope here.
- **A numbering mismatch.** The old jev numbers (82a, 102a, 119) still appear in 2026 MO documents while 157/2024 Sb. has its own numbering. A product must map both.

### Gaps
- **No ÚCL dataset.** No GIS dataset or service of ÚCL OP was found, and the ŘLP AIM/AIP obstacle data were not examined.
- **MO data access.** MO geodata are not public. Access terms for the textový pasport and ÚAP data were not checked.

## Q8: Forest — PUPFL and forest-boundary data (ÚHÚL, ZABAGED) for checking the distance rule in § 14 odst. 2 lesního zákona

### Takeaway
- **The rule is 30 m, not 50 m.** Since 1 Jan 2024 (zákon č. 149/2023 Sb.), § 14 odst. 2 lesního zákona requires the forest authority's závazné stanovisko for "dotčení pozemků do vzdálenosti **30 m** od okraje lesa". 50 m survives only as the ban on open fires (§ 20 odst. 2). ÚAP jev 25 is literally "les, jeho kategorizace a vzdálenost 30 m od okraje lesa".
- **Provider:** ÚHÚL's functions now sit with the **Národní lesnický institut** (NLI), a správní úřad under MZe since 1 Jan 2026 (zákon 251/2025 Sb.).
  - From 1 Jan 2028, forest categories and soubory lesních typů are to be published in RÚIAN as účelové územní prvky, with NLI as editor.
  - Current ÚHÚL/NLI open-data terms were not verified. Historically some layers were free WMS, while PUPFL data were sold.

### Cited Findings
- **Current text of § 14 odst. 2** (version of 1. 1. 2026): "Toto závazné stanovisko je třeba i k dotčení pozemků do vzdálenosti 30 m od okraje lesa" — [e-Sbírka 289/1995 Sb., version 1. 1. 2026](https://e-sbirka.gov.cz/eli/cz/sb/1995/289/2026-01-01) (via [flatiocom](https://github.com/flatiocom/czech-law-md/blob/HEAD/zakony/1995/289-1995.md)); also reproduced in a 2026 commentary — [Komentar-LesZ-289-1995](https://github.com/LexaurinTheDog/Komentar-LesZ-289-1995/blob/HEAD/01-obecna-pozemky-hospodareni.md)
- **The amending act.** The wording was introduced by zákon č. 149/2023 Sb. (the act accompanying the zákon o jednotném environmentálním stanovisku), Čl. V bod 2. The act took effect on **1 January 2024**, except for some points of part two, which took effect on 1 January 2025. The same act inserted § 14 odst. 3: no závazné stanovisko is issued for záměry that need a jednotné environmentální stanovisko — [e-Sbírka 149/2023 Sb.](https://e-sbirka.gov.cz/eli/cz/sb/2023/149/2025-01-01) (via [legalize-cz](https://github.com/legalize-dev/legalize-cz/blob/HEAD/cz/SB-2023-149.md))
- **The former 50 m rule.** Earlier texts used 50 m: zákon 186/2006 Sb. ("souhlas k vydání rozhodnutí o umístění stavby nebo využití území do 50 m od okraje lesa") and the old ÚAP jev 37a "lesy, jejich kategorizace a vzdálenost 50 m od okraje lesa" in vyhláška 500/2006 Sb. — [legalize-cz – 186/2006](https://github.com/legalize-dev/legalize-cz/blob/HEAD/cz/SB-2006-186.md); [legalize-cz – 500/2006](https://github.com/legalize-dev/legalize-cz/blob/HEAD/cz/SB-2006-500.md). The new list in 157/2024 Sb. has jev 25 "les, jeho kategorizace a vzdálenost 30 m od okraje lesa" — [e-Sbírka 157/2024 Sb.](https://e-sbirka.gov.cz/eli/cz/sb/2024/157/2026-01-01)
- **Open fires remain at 50 m.** § 20 odst. 2: "Rozdělávat nebo udržovat otevřené ohně je zakázáno také do vzdálenosti 50 m od okraje lesa" — [e-Sbírka 289/1995 Sb.](https://e-sbirka.gov.cz/eli/cz/sb/1995/289/2026-01-01). The 2025 amendment keeps a fine for an open fire within 50 m — [e-Sbírka 250/2025 Sb.](https://e-sbirka.gov.cz/eli/cz/sb/2025/250/2026-01-01) (via [legalize-cz](https://github.com/legalize-dev/legalize-cz/blob/HEAD/cz/SB-2025-250.md))
- **Conflicting secondary sources** *(search summary)*. Secondary sources disagree on the history. One attributes the 50→30 m change to the building-law package and cites the consolidated text from 1. 1. 2026, while noting that 50 m now applies only to fires. Karviná's magistrát states 30 m — [Můj právník – ochranné pásmo lesa](https://muj-pravnik.cz/ochranne-pasmo-lesa/); [Můj právník](https://muj-pravnik.cz/?p=30270); [Magistrát Karviná](https://spark.karvina.cz/file/9636_1_1). The primary texts above resolve this: the change took effect on 1 Jan 2024.
- **Practice details** *(search summary)*:
  - the distance is measured from the boundary of the pozemek určený k plnění funkcí lesa, not from the trunk of the last tree;
  - the ORP usually issues the stanovisko within 30 days (60 in complex cases);
  - a územní plán may add its own conditions, e.g. "výjimku z ochranného pásma lesa lze vydat jen do vzdálenosti 25 m". The exact meaning in that ÚP was not checked.
  Sources: [Můj právník](https://muj-pravnik.cz/ochranne-pasmo-lesa/); [ÚP Zdislava – regulativy](https://docs.liberec.cz/Odb_HA/1_UP/VYDANE/Zdislava/Regulativy/556.pdf)
- **No waiver of damages as a condition.** A June 2026 article reports that a building permit may not be conditional on giving up compensation for damage. The headline title was the only part seen, and a related article says the authority may not demand that you waive damages in advance for a stavba u lesa — [Advokátní deník, 12. 6. 2026](https://advokatnidenik.cz/2026/06/12/povoleni-stavby-nesmi-zaviset-na-tom-zda-se-vzdate-nahrady-skody/); [Dostupný advokát – Stavba u lesa](https://dostupnyadvokat.cz/blog/stavba-u-lesa)
- **PUPFL definition.** § 3 lesního zákona: PUPFL are lesní pozemky and "jiné pozemky" serving the forest. In doubt the forest authority decides (§ 3 odst. 3), and decisions are sent to the katastrální úřad (§ 3 odst. 5) — [e-Sbírka 289/1995 Sb.](https://e-sbirka.gov.cz/eli/cz/sb/1995/289/2026-01-01)
- **The NLI.** Zákon 251/2025 Sb. establishes the Národní lesnický institut, from 1 Jan 2026, as a správní úřad under MZe seated in Brandýs nad Labem–Stará Boleslav. Its tasks include OPRL, the typological system, LHP/LHO and forest inventory. Under the transitional provisions it succeeds the earlier NLI organizační složka, and employees' service counts time "v Ústavu pro hospodářskou úpravu lesů a Národním lesnickém institutu" — [e-Sbírka 251/2025 Sb.](https://e-sbirka.gov.cz/eli/cz/sb/2025/251/2026-01-01) (via [legalize-cz](https://github.com/legalize-dev/legalize-cz/blob/HEAD/cz/SB-2025-251.md))
- **RÚIAN from 2028.** Zákon 250/2025 Sb. sets out that:
  - forest categories are kept in a non-public informační systém kategorizace lesů run by NLI;
  - forest categories and soubory lesních typů are to be recorded in RÚIAN as účelové územní prvky, with NLI as editor;
  - these provisions take effect on 1 Jan 2028 under Čl. VI písm. b). That covers § 6 odst. 2–3 (forest categories), inserted by Čl. I bod 21, and § 23c (informační systém lesnické typologie and soubory lesních typů in RÚIAN), inserted by bod 66.
  Source: [e-Sbírka 250/2025 Sb.](https://e-sbirka.gov.cz/eli/cz/sb/2025/250/2026-01-01) (via [legalize-cz](https://github.com/legalize-dev/legalize-cz/blob/HEAD/cz/SB-2025-250.md))
- **ÚHÚL services in the past:**
  - An OPRL WMS was listed at `https://geoportal.uhul.cz/wms_oprl/service.svc/get` (listing undated) — [GISMentors – seznam WMS/WFS](https://github.com/GISMentors/qgis-zacatecnik/blob/HEAD/webove_sluzby/wms_wfs_list.rst)
  - In 2007 ÚHÚL said its WMS carried only data it could release freely, since much of its data came from forest owners *(search summary)* — [talk-cz 2007](https://lists.openstreetmap.org/pipermail/talk-cz/2007-September/000157.html)
  - A ÚHÚL data-supply contract lists PUPFL among the delivered layers, priced under ÚHÚL's ceník at 141 760 Kč for that bundle (date not seen) *(search summary)* — [smlouvy.gov.cz – Smlouva o výdeji dat VÚKOZ–ÚHÚL](https://smlouvy.gov.cz/smlouva/soubor/23750019/Smlouva%20o%20v%C3%BDdeji%20dat%20V%C3%9AKOZ_%C3%9AH%C3%9AL%20pro%20RS.pdf)

### Inferences
- **Desk check:**
  1. Take forest parcels from the katastr (druh pozemku "lesní pozemek"), which is the authoritative PUPFL proxy. This is out of scope here and needs verifying, because "jiné pozemky" can also be PUPFL.
  2. Use ZABAGED forest polygons (open CC BY 4.0, see earlier notes Q1) as a cross-check.
  3. Buffer by 30 m. If a planned house, fence, driveway or connection falls inside, add the forest authority's závazné stanovisko to the permit checklist.
  4. Note the 50 m fire ban for barbecue or fireplace siting.
- **Automated reports must not reuse 50 m.** Older guides and pre-2024 ÚP or ÚAP materials still say 50 m.
- **From 2028, RÚIAN will help.** Forest categories (ochranný les, les zvláštního určení), which can tighten conditions, will be available from RÚIAN.

### Gaps
- **NLI data terms.** NLI's current geoportal URL and open-data licence (ex-ÚHÚL OPRL, LHP boundaries) in 2026 were not verified, since uhul.cz was blocked.
- **No 2026 practice data.** No 2026 statistics or methodology on the minimum house distance forest authorities accept were found.
- **Unexplained MZe reference.** One 2024 MZe document reportedly still mentioned 50 m *(search summary)* — [MZe 2024 potvrzení (D6)](https://mdcr.cz/getattachment/Ministerstvo/Uredni-deska/Uzemni-rizeni,-D6-Karlovy-Vary-Olsova-Vrata-–/MZE-20349_2024-16211-(potvrzeni-les).pdf.aspx). This is possibly a transitional case under the old law; not checked.

## Q9: Climatic loads — are the snow and wind zone maps (ČSN EN 1991-1-3 / 1-4 národní příloha) open or licensed? Online tools?

### Takeaway
- **Licensed, not open.** Both maps exist only as figures in the Czech národní přílohy of ČSN EN 1991-1-3 (snow) and ČSN EN 1991-1-4 (wind). ČSN content is licensed: paid ČSN online or e-shop, with free full text only for selected standards through a sponsored-access portal.
- **No official online lookup tool** was found for the Czech maps.
- **A new snow standard is coming.** The snow map was amended several times. ČSN EN 1991-1-3 ed. 3 (October 2025, second-generation Eurocode) runs in parallel and fully replaces the old edition from 31 March 2028.

### Cited Findings
- **Snow-map history** *(search summary)*. The national annex to ČSN EN 1991-1-3 contains the snow-region map of ČR. Amendment Z1 replaced the original map, and amendment Z5 corrected Figure 5.7 and the Annex C map. ČSN EN 1991-1-3 ed. 3 (73 0035), published October 2025, will fully replace the standard from 31 March 2028 — [tzb-info – ČSN EN 1991-1-3:2005](https://www.tzb-info.cz/normy/csn-en-1991-1-3-2005-06)
- **Wind map** *(search summary)*. The výchozí základní rychlost větru is taken from the wind-zone map in the national annex to ČSN EN 1991-1-4. The map basis, a 10-minute mean wind-speed map with altitude effects and gust correction, was produced by ČVUT and ČHMÚ — [TA ČR Starfos – ČVUT result](https://starfos.tacr.cz/en/vysledky-vyzkumu/RIV%2F68407700%3A21610%2F06%3A07127487); [tzb-info – ČSN EN 1991-1-4 ed. 2 (2013)](https://www.tzb-info.cz/normy/csn-en-1991-1-4-ed-2-2013-04); [tzb-info – ČSN EN 1991-1-4 ed. 2 (2020)](https://www.tzb-info.cz/normy/csn-en-1991-1-4-ed-2-2020-11). A ČVUT teaching sheet reproduces the map only as a figure — [ČVUT – ZAT_VITR.pdf](https://people.fsv.cvut.cz/~hanzlhan/pomucky/ZAT_VITR.pdf)
- **No Czech online tool** *(search summary)*. Dlubal's online snow and wind zone service covers German national annexes, not Czech — [Dlubal knowledge base](https://www.dlubal.com/cs/podpora-a-skoleni/podpora/databaze-znalosti/001554)
- **Access to ČSN** *(search summary)*. Full texts of some ČSN are free after registration at sponzorpristup.agentura-cas.cz, while full ČSN Online access is paid (MZK guide, 2022) — [MZK – normy 2022](https://www.mzk.cz/sites/default/files/2025-04/normy_2022.pdf). ÚNMZ's 2025 annual report mentions free bibliographic ČSN databases and sales through the e-shop — [ÚNMZ výroční zpráva 2025](https://unmz.gov.cz/wp-content/uploads/unmz_rocni_zprava_2025_170x170_48stran-1.pdf). Earlier reporting says an amendment of the stavební zákon removed the clause that made legally required standards free — [tzb-info – Za přístup ke všem technickým stavebním normám se bude bez výjimky platit](https://www.tzb-info.cz/118718-za-pristup-ke-vsem-technickym-stavebnim-normam-se-bude-bez-vyjimky-platit)

### Inferences
- **A product cannot ship the zone maps.** Without a licence from ÚNMZ or the agency, the map figures cannot be reproduced or digitised from ČSN. Options are a licence, the designer's own lookup, or vendors that bundle Czech NA zones in structural software (not verified).
- **Projects will soon need to name the edition.** Between October 2025 and March 2028 two editions of the snow standard coexist, so documentation should state which one is used.

### Gaps
- **Zone values not verified.** The regional values recalled earlier (snow regions I–VIII, about 0.7–4.0 kN/m²; wind regions I–V, vb,0 about 22.5–36 m/s) were not verified in this pass. Whether ed. 3 changes the snow map is unknown.
- **Unverified tool.** Whether "snehovamapa.cz" or a ČHMÚ tool exists was not verified.
- **Standards access policy** for 2026 is unclear: whether harmonised or Eurocode ČSN are now free in ČR after the 2024 EU court ruling on access to harmonised standards was not verified.

## Q10: Survey prices 2025–2026 for a family-house plot (geodetické zaměření, vytyčení hranic, geometrický plán, inženýrsko-geologický průzkum, radonový průzkum, hydrogeologický posudek pro vsakování, dendrologický průzkum) — and the legal hooks verified

### Takeaway
- **Only one price source is dated: a 2025 surveying price list attached to a public contract.** It gives:
  - polohopis + výškopis mapping: 4 490 Kč/ha without VAT;
  - vytyčení hranic: 3 490 Kč per 100 m of boundary without, and 4 490 Kč with, projednání with neighbours.
  These are framework-contract rates, not retail prices.
- **All other figures are undated consumer or marketplace data.** For a typical plot they indicate:

  | Survey | Indicative price |
  |---|---|
  | Zaměření | about 2 200–6 500 Kč |
  | Vytyčení | about 3 600–10 000 Kč |
  | Geometrický plán | about 3 700–4 100 Kč (listings) |
  | Inženýrsko-geologický průzkum | about 7 000–15 000 Kč, "up to tens of thousands" |
  | Radonový průzkum | about 2 500–6 000 Kč |
  | Hydrogeologický posudek pro vsak | about 6 500 Kč + VAT, or 6–9 thousand Kč |

  No Czech price for a dendrologický průzkum was found; Slovak municipal contracts show 18–36 EUR per tree.
- **The legal need is confirmed in the 2024 decrees and the atomový zákon:**
  - the permit documentation must show "stávající výškopis a polohopis" and list the "výčet a závěry průzkumů";
  - the radon index is mandatory unless one of two design exemptions applies.

### Cited Findings

#### Geodesy (zaměření, vytyčení, geometrický plán)
- **2025 price list** *(search summary)*. The GeoProperty Plus "ceník geodetických služeb 2025", annex 2.1 to a public contract (I. část, ZKV), gives:
  - tematická mapa s polohopisem a výškopisem: 4 490 Kč/ha without VAT (built-up or forested and open land alike), 3 390 Kč/ha under water;
  - vytyčení hranic pozemku podle KN: 3 490 Kč per 100 m without projednání, 4 490 Kč per 100 m with projednání.
  Source: [smlouvy.gov.cz – ceník 2025](https://smlouvy.gov.cz/smlouva/soubor/39027968/rprilohac.2.1geopropertypluscenikgeodetickychsluzeb2025proi.castzkv.pdf)
- **Conflicting reading** *(search summary)*. A second summary of the same 2025 list showed only "Záznam podrobného měření změn … 100 m nové hranice pozemku 490". For the 2024 version of the list it gave vytyčení at 3 500 Kč per 100 m without and 900 Kč per 100 m with projednání. Treat the projednání surcharge as unverified — [smlouvy.gov.cz – ceník 2024](https://smlouvy.gov.cz/smlouva/soubor/33826771/Prilohac.2.1Cenikgeodetickychsluzeb2024proI.castZKV.pdf)
- **Marketplace prices** (nejremeslnici.cz, undated, some without VAT) *(search summary)*:
  - polohopisné a výškopisné zaměření about 2 200–6 500 Kč, e.g. 2 500 Kč (Rokycany) and 4 500 Kč (Praha);
  - one vytyčení hranice at 7 000 Kč, others 3 600–10 000 Kč.
  Sources: [nejremeslnici – výškopis, Rokycany](https://www.nejremeslnici.cz/t/5362-vyskopis/plzen/rokycany); [nejremeslnici – výškopis, Štětí](https://www.nejremeslnici.cz/t/5362-vyskopis/usti-nad-labem/steti); [nejremeslnici – vytyčení hranice pozemku](https://www.nejremeslnici.cz/reference/716210-vytyceni-hranice-pozemku); [nejremeslnici – vytyčení pro plot](https://www.nejremeslnici.cz/reference/958269-vytyceni-hranice-pozemku)
- **Geometrický plán prices** *(search summary)*. Listings show a GP for a new build at 3 700 Kč, a GP plus garage survey at 4 100 Kč, and a plot-and-house survey at 5 000 Kč. No official 2025–2026 GP price was found — [nejremeslnici – geometrický plán](https://www.nejremeslnici.cz/reference/724675-geometricky-plan); [nejremeslnici – geometrický plán (2)](https://www.nejremeslnici.cz/reference/852086-geometricky-plan); [nejremeslnici – geodetické práce Brno](https://www.nejremeslnici.cz/t/138-geodeticke-prace/brno)
- **GP timing and cost drivers** *(search summary)*:
  - a GP must be confirmed by the katastrální úřad, so order it several weeks ahead;
  - a distant firm adds travel costs;
  - at the permit stage for dividing a plot, a copy of the cadastral map with the division drawn in is enough, without a GP.
  Sources: [České stavby – K čemu potřebujete geometrický plán](https://www.ceskestavby.cz/clanky/k-cemu-potrebujete-geometricky-plan-21646.html); [eSTAV 9208](https://www.estav.cz/cz/9208)
- **Legal hook.** In vyhláška 131/2024 Sb. o dokumentaci staveb, příloha č. 1 (obsah dokumentace pro povolení stavby) requires:
  - in the koordinační situační výkres (max. 1 : 200): "stávající výškopis a polohopis", the elevation of the ground floor (± 0,00) and of the finished terrain, and plot boundaries;
  - in the technical report: B.1 d) "výčet a závěry průzkumů", B.1 b) the position relative to the záplavové and poddolované území, and B.1 g) requirements for kácení dřevin.
  Source: [e-Sbírka 131/2024 Sb.](https://e-sbirka.gov.cz/eli/cz/sb/2024/131/2024-07-01) (via [legalize-cz](https://github.com/legalize-dev/legalize-cz/blob/HEAD/cz/SB-2024-131.md))

#### Inženýrsko-geologický průzkum
- **Price and share of budget** *(search summary)*. A survey of the subsoil of an ordinary new build costs about 15 000 Kč, roughly 0.5 % of the total budget (undated). The work usually takes 2–4 weeks, and large industrial buildings can need investments up to millions — [České stavby – Proč se nevyplatí podceňovat geologický průzkum podloží](https://www.ceskestavby.cz/clanky/proc-se-nevyplati-podcenovat-geologicky-pruzkum-podlozi-24465.html); [České stavby – Geologický průzkum ochrání vaši investici](https://ceskestavby.cz/clanky-foto/geologicky-pruzkum-ochrani-vase-investice-20206.html)
- **No legal duty** *(search summary)*. "Dosud neexistuje jakákoli zákonná povinnost vedoucí k nezbytnému průzkumu podloží staveb". Where there is no public sewer, however, an infiltration assessment may be required, and it needs geological input — [České stavby – průzkum podloží a stavební zákon](https://ceskestavby.cz/clanky-foto/pruzkum-podlozi-stavebni-zakon-4861.html?photo=2)
- **Prices already in the earlier notes** (not repeated): 7 000–11 000 Kč (eSTAV), "thousands to tens of thousands", and 7 700 Kč combined with radon.
- **No 2026 retail price** was found. The only 2026 figures came from public contracts for larger jobs and are not comparable *(search summary)*.

#### Radonový průzkum
- **Duty and exemptions in current law.** § 98 odst. 1 atomového zákona (version of 1. 1. 2026): "Každý, kdo žádá o povolení nové stavby nebo přístavby s obytnými nebo pobytovými místnostmi, je povinen zajistit stanovení radonového indexu pozemku." Under § 98 odst. 3 the index need not be determined if:
  - all perimeter structures are separated from the subsoil by a freely ventilated air layer; or
  - a preventive anti-radon measure based on venting radon from the subsoil outside the building is designed.
  Source: [e-Sbírka 263/2016 Sb., version 1. 1. 2026](https://e-sbirka.gov.cz/eli/cz/sb/2016/263/2026-01-01) (via [flatiocom](https://github.com/flatiocom/czech-law-md/blob/HEAD/zakony/2016/263-2016.md)). This resolves the earlier gap on exemptions.
- **Price and duration** *(search summary)*. A standard measurement of the radonový index pozemku costs 3 000–6 000 Kč, depending on plot size, location and access. Field work takes 2–4 hours, and the protocol usually arrives within a few working days — [Můj právník – Radonový index pozemku](https://muj-pravnik.cz/radonovy-index-pozemku/)
- **Supplier offers** *(search summary)*. One firm offers 2 500 Kč (not a VAT payer, travel included), and marketplace reviews show about 2 500–2 600 Kč — [České stavby – firmy měření radonu](https://www.ceskestavby.cz/firmy/mereni-radonu/); [nejremeslnici – měření radonu](https://www.nejremeslnici.cz/reference/248908-mereni-radonu)

#### Hydrogeologický posudek pro vsakování
- **Infiltration-specific prices** *(search summary)*:
  - a hydrogeologický posudek with an excavated pit (bagrovaná sonda) and an infiltration test costs about 6 500 Kč + VAT (from an article on small wastewater plants) — [České stavby – I ČOV vyžaduje hydrogeologický posudek](https://www.ceskestavby.cz/clanky/posudky-pro-umisteni-cistiren-21712.html)
  - a rainwater-infiltration survey, often done together with the geological survey, costs 6–9 thousand Kč (undated) — [eSTAV 7304](https://www.estav.cz/cz/7304.jake-pruzkumy-pozemku-si-zajistit-pred-stavbou-rodinneho-domu)
- **Hourly and well-related rates** *(search summary)*. Hydrogeologists charge from 400 Kč/h, and a pumping test costs from 3 000 Kč (well context) — [TZB-info – Orientační ceny za vlastní vodu](https://www.tzb-info.cz/107170-orientacni-ceny-za-vlastni-vodu)
- **Legal hooks.** Vyhláška 146/2024 Sb. o požadavcích na výstavbu, § 8, requires that a stavba "musí být navržena a provedena tak, aby splňovala požadavky na hospodaření se srážkovými vodami … v souladu s normou", that runoff does not threaten the plot or its surroundings, and that rainwater is linked with vegetation where technically possible — [e-Sbírka 146/2024 Sb.](https://e-sbirka.gov.cz/eli/cz/sb/2024/146/2024-07-01) (via [legalize-cz](https://github.com/legalize-dev/legalize-cz/blob/HEAD/cz/SB-2024-146.md))
- **Burden of proof** *(search summary)*. A law firm states that the burden of proof lies with the builder, who must submit a hydrogeologický posudek showing why infiltration is not possible. Infiltration has priority over retention and discharge — [ARROWS – Nakládání s dešťovými vodami](https://arws.cz/novinky-v-arrows/nakladani-s-destovymi-vodami)

#### Dendrologický průzkum
- **No Czech price found.** No Czech per-tree or per-plot price was found *(search summary)*.
- **Slovak municipal contracts** (Pezinok) *(search summary)*:
  - 60 dendrologické posudky at 18 EUR each (1 080 EUR);
  - 23 trees for 828 EUR in total (about 36 EUR per tree);
  - a survey and evaluation of 50 trees for 1 200 EUR (24 EUR per tree).
  Source: [openstats.city – Pezinok contractor](https://openstats.city/en/contractors/77711)
- **Catalogue prices overstate real prices** *(search summary)*. A Czech thesis found tender catalogue prices for arboricultural work too high, with winning bids around 40 % of catalogue prices (thesis about 2014) — [theses.cz – závěrečná práce](https://theses.cz/id/ja163s/zaverecna_prace.pdf?lang=en)
- **Typical scope** *(search summary)*. A dendrologický průzkum in a Czech tender covers an inventory of trees, species, health condition and proposed treatment or replacement planting, e.g. Kralupy nad Vltavou 2023, which also prices felling — [zakazky.kr-stredocesky.cz – Kralupy dendrologický průzkum](https://zakazky.kr-stredocesky.cz/document_151556/8a562189e43760910732854b8dff612f-2023-12-10-kralupy_dendrolog-pruzkum-pdf)
- **Legal trigger:** a felling permit is needed above an 80 cm trunk circumference (with the exemptions in Q1), and the permit documentation has to state the requirements for kácení dřevin — see Q1 and vyhláška 131/2024 Sb. above.

### Inferences
- **Indicative 2026 budget for a typical 800–1 200 m² greenfield plot** (inference from undated listings plus the 2025 framework list; treat as a lower bound, since 2024–2026 price inflation is not captured):

  | Survey | Indicative budget |
  |---|---|
  | Geodetic survey | about 3 000–7 000 Kč |
  | Vytyčení | about 3 500–8 000 Kč, depending on boundary length and neighbours |
  | GP, if needed | about 4 000–10 000 Kč, plus katastrální úřad time |
  | Inženýrsko-geologický průzkum | about 10 000–20 000 Kč |
  | Radon | about 2 500–6 000 Kč |
  | Hydrogeological infiltration assessment with test | about 6 500–10 000 Kč |
  | Dendrology, few trees | about 450–900 Kč per tree, converted from 18–36 EUR at about 25 Kč/EUR (own conversion, Slovak data) |

- **Combine the field jobs.** Radon, engineering geology and infiltration can share one site visit. One earlier-sourced listing shows geology plus radon at 7 700 Kč.

### Gaps
- **No independent dated prices.** Apart from the framework list, no dated 2025–2026 ceník from survey firms could be read, because the price-list hosts were blocked.
- **Missing dendrology and GP data.** A Czech dendrology price per tree and a 2025–2026 retail price for a geometrický plán are still missing.
- **ÚOZI requirement.** The requirement that vytyčení and GP be done by an ÚOZI (zákon 200/1994 Sb.) was not re-verified in this pass.
- **Inženýrsko-geologický průzkum: legal status.** Its position under zákon 62/1988 Sb. and Eurocode 7 categories for family houses was not re-verified.
