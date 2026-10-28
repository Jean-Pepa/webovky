# Czech (and Slovak) market for plot due diligence and pre-design site research: players, how architects work, demand (as of October 2026)

## 1. Existing Czech/Slovak services for plot checks ("prověření / prověrka / rešerše / analýza pozemku") and adjacent proptech and data players

### Takeaway
Yes, several Czech companies already sell automated or semi-automated plot reports. Examples: AIkatastr.cz (99 Kč, PDF in under 5 min), NEMO Report (135 / 740 / 2 790 Kč), Pozemkov.cz (349 Kč per report or 590 Kč/month) and "TH Prověření pozemku online" (899 Kč in 48 h). At least ten more manual expert or lawyer checks sit between about 1 100 and 20 000 Kč. All of them are aimed at plot buyers and realtors. None found is sold to architects as pre-design site research, meaning interpretation of ÚP regulations, buildable envelope and podklady for a study. In Slovakia I found only early AI offers (Landai.sk at 49 €, OverNehnutelnost.sk in free beta) and no commercial service explicitly built on ZBGIS.

### Cited Findings

**A. Automated / semi-automated online reports (CZ)**
- **AIkatastr.cz**, "Kontrola nemovitosti před koupí", **99 Kč**. A PDF report covering floods, radon, landslides, protection zones (ochranná pásma), utility networks and the územní plán, delivered "do 5 minut" and based on "oficiální data ČÚZK". It also offers a web app with an **"AI copilot" for realtors (makléři) and investors**. — [AIkatastr – kontrola před koupí](https://aikatastr.cz/reseni/kontrola-pred-koupi)
  - AIkatastr runs a content "poradna" (SEO pages) on cenové mapy, cadastre fees and online LV extracts. — [AIkatastr – cenové mapy](https://aikatastr.cz/poradna/cenove-mapy-jak-zjistit-hodnotu-pozemku); [AIkatastr – poplatky katastr](https://aikatastr.cz/poradna/spravni-poplatky-katastr-nemovitosti-ceniky); [AIkatastr – výpis z katastru online](https://aikatastr.cz/poradna/vypis-z-katastru-online)
- **NEMO Report** (operator NEMO Report s.r.o., Nymburk). Official prices: **STANDARD 740 Kč, KOMPLET 2 790 Kč, standalone flood-risk report 135 Kč**. KOMPLET is meant for **building projects (stavební záměry)**. It contains everything in STANDARD plus map materials, **detailed information from the územní plán**, comments and contacts to the sources. — [NEMO Report – služby a ceny](https://www.nemoreport.cz/sluzby-a-ceny); operator named in [Bezrealitky – NEMO report terms](https://www.bezrealitky.com/information/smluvni-podminky/nemo-report)
  - Price conflicts: reseller dum123.cz lists KOMPLET at **2 490 Kč incl. VAT, delivered 2–3 working days after payment**, and STANDARD at 690 Kč. — [dum123.cz – NEMO Report Komplet](https://www.dum123.cz/sluzby-specialistu/nemo-report-komplet/). At launch, STANDARD cost 890 Kč incl. VAT. — [RETREND](https://retrend.cz/facility-a-technologie-budov/nemo-report/); [S-IC](https://s-ic.cz/cs/lide-kupujici-nemovitost-maji-nyni-k-dispozici-novy-nastroj-na-overeni-rizik-spojenych-s-jeji-koupi/)
  - One search summary described a 135 Kč report generated "zhruba do 15 minut". This most likely refers to the flood-risk report, not STANDARD. — [NEMO Report](https://www.nemoreport.cz/sluzby-a-ceny)
  - Founder Záhora: "Prověření nemovitosti se vyplácí, našim zákazníkům dokážeme ušetřit i statisíce korun." — [Euro.cz](https://www.euro.cz/clanky/provereni-nemovitosti-se-vyplaci-nasim-zakaznikum-dokazeme-usetrit-i-statisice-korun-rika-zakladatel-nemo-report-zahora/)
  - B2B: NEMO markets owner and property-risk checks plus CRM data links to real-estate agencies. It says agents of M&M Reality (the largest Czech agency) and individual brokers use it. — [NEMO Report – partner](https://www.nemoreport.cz/partner)
- **Pozemkov.cz**. You enter an address or parcel number and get a report combining cadastral data, zoning, utility network locations, risks and ownership. A sample report is free. The price list shows a **one-off report at 349 Kč** (rendered as "349 499 Kč", probably a formatting error) and a **subscription at 590 Kč/month**. The company claims utility-network data covers about 85 % of areas (its own claim). — [Pozemkov.cz](https://pozemkov.cz/)
- **TH Prověření pozemku online** (proverenipozemku.cz). The **basic check costs 899 Kč and is delivered within 48 h**. It covers future buildability (zastavitelnost), whether utility networks exist and their connection conditions, and road access. A **detailed check starts at 1 999 Kč and takes 30–60 days**. — [proverenipozemku.cz](https://www.proverenipozemku.cz/)
- **Odhad.cz** (odhad-ceny-zdarma.cz) gives a free price estimate. Its "AI analýzy" section (yield indicators, price prediction) requires login. — [Odhad.cz](https://odhad-ceny-zdarma.cz/)
- **Hubenya – ARCHIPEDIA** is a **free** online calculator, "analýza pozemku pro stavbu domu". It gives five-step advice on sun orientation, the most advantageous house shape, height, roof and distance from the boundary. Inputs are plot size, sun exposure, slope and rural vs. urban, and it cites norms for professionals. It is one of about 30 calculators, including a "kalkulačka zastavěnosti pozemku". No price was found. — [Hubenya – analýza pozemku](https://hubenya.com/archipedia-analyza-pozemku-pro-stavbu-domu/); [ARCHIPEDIA](https://hubenya.com/archipedia/); [kalkulačka zastavěnosti](https://hubenya.com/archipedia-kalkulacka-zastavenosti-pozemku/)
- A blog round-up, "5 online nástrojů pro analýzu pozemku", exists, but its content was not retrieved. — [STROMYvPOLI](https://www.stromyvpoli.cz/blog/5-online-nastroju-pro-analyzu-pozemku/)

**B. Manual / expert / lawyer plot checks (CZ)**
- **PozemeCheck**: standard analysis **3 890 Kč (≤10 working days)**, express **5 490 Kč (≤3 days)**. Covers due diligence, legal and planning (územně-plánovací) analysis, cadastre, easements (věcná břemena), protection zones and flood zones. — [pozemecheck.cz](https://pozemecheck.cz/)
- **Visidoo – Kontrola pozemků**: **from 1 990 Kč, ≤3 days**. Two tiers: a preliminary analysis and a deep analysis called "KRTEK". If you upgrade, you pay only the difference. Visidoo is best known for free alerts on new listings across portals. — [Visidoo – kontrola pozemků](https://www.visidoo.cz/en/service/kontrola-pozemku); [Visidoo – služby](https://www.visidoo.cz/sluzby); [Earch.cz on Visidoo](https://www.earch.cz/technologie/clanek/o-nove-nabidce-domu-ci-bytu-se-muzete-dozvedet-za-minutu). Visidoo also has a "Dokumentace – Report" docs page (title only; may be an API). — [Visidoo docs](https://www.visidoo.cz/docs/report)
- **Rozborpozemku.cz** (an individual author): a "rozbor (ne)stavebního pozemku" from **1 100 Kč** (elsewhere on the site "od 1 000 Kč" depending on complexity). Cadastre extracts and attachments cost extra. A site visit, negotiation with neighbours or authorities, and project documentation are paid add-ons. — [rozborpozemku.cz](https://www.rozborpozemku.cz/)
- **Audit pozemku** (auditpozemku.cz): tiers from about **3 000 Kč to 10 000 Kč**. The base tier covers utility networks, easements from the cadastre, ÚP compliance (including height and % buildability), protection zones and flood zones. Higher tiers add noise and air-quality maps, geology, information from the building and water authorities, and **obtaining the ÚPI from the building office**. — [auditpozemku.cz](https://www.auditpozemku.cz/sluzby/provereni-pozemku/). *Conflict:* another search summary gave **20 000 Kč** for the same site, without a breakdown (possibly the top tier).
- **vyjadrovacky.cz**: a similar plot-check offer, prices "od 1 000 Kč" and 10 000 Kč. It also includes historical aerial photos back to 1930. — [vyjadrovacky.cz](http://www.vyjadrovacky.cz/sluzby/provereni-pozemku/)
- **Bezvadný pozemek**: a check by a real-estate lawyer **from 4 900 Kč, ≤5 working days**. Higher packages add owner verification and a draft contract. — [bezvadny-pozemek.cz](https://www.bezvadny-pozemek.cz/)
- **Nemoinspekt**: plot-check report **from 10 000 Kč**, one-off, ≤10 working days. Its general property inspections start "od 5 000 Kč". — [Nemoinspekt](https://www.nemoinspekt.cz/en/)
- **Inspekce POZEMKU (inspekcelukes.cz)**: a visual site survey plus analysis of public documents, **from 11 990 Kč for plots ≤500 m²**. Larger plots are priced individually. — [inspekcelukes.cz](https://www.inspekcelukes.cz/inspekce-pozemku/)
- **Landcheck.cz**: three levels of check. The basic one is an initial assessment that includes a check of the ÚPD. Price depends on the requirements for the plot, how often the client is updated and the search scope, so plot search is offered too. Landcheck notes that the cadastre does **not** say what a plot may be used for; it serves to verify owner, area, easements and ownership of neighbouring plots, especially the access road. — [Landcheck – služby](https://landcheck.cz/nase-sluzby/); [Landcheck – cadastre how-to](https://landcheck.cz/en/other/cadastre_how_to/)
- **Lawyers**: Modernipravnik.cz quotes about **7 000–15 000 Kč** for due diligence on a regular flat or house, and about 40 000–130 000 Kč excl. VAT for apartment or industrial buildings. A technical inspection is extra. — [Modernipravnik – DD nemovitosti](https://modernipravnik.cz/for-investors-cs/real-estate-cs/due-diligence-nemovitosti/). Its packages run from 7 999 Kč (introductory price) to 19 999 Kč. — [Modernipravnik – tarify](https://modernipravnik.cz/sluzby-pro-kupujici-investicni-byt/)
- **Other providers that appeared in results** (details not retrieved): Smart stavby "Prověření pozemku před nákupem" [smartstavby.cz](https://www.smartstavby.cz/provereni-pozemku/); Petramax "Prověření pozemku" [petramax.cz](https://www.petramax.cz/provereni-pozemku/); Proengineers studio (inspekce nemovitostí) [proengineers.cz](https://www.proengineers.cz/sluzby/inspekce-nemovitosti); a PURLIVE blog post [purlive.cz](https://www.purlive.cz/cz/o-nas/blog-purlive/124-provereni-pozemku-pred-jeho-nakupem-ci-vystavbou-je-zasadni).
- **Architects** also do pre-purchase checks. One architect blog: "Taktéž se setkáváme se situací, kdy u nás investor poptává kontrolu nebo rešerši parcely, ještě před samotnou koupí pozemku." The quote came up in search; I could not confirm which of these two blogs it is from: [master-design.cz](https://www.master-design.cz/blog/obecne/pruzkumy-parcely-pred-projektem) or [krouzel.cz](https://krouzel.cz/stavebni-pozemek/).

**C. Adjacent proptech, data and GIS players (CZ)**
- **Valuo** (automated valuation): PROFI plans Start / Expert / Business at **500 / 750 / 1 000 Kč per month excl. VAT**. Business adds a yield calculator and mark-to-market of a portfolio. The **API** comes as Starter 500 Kč/month (20 estimates), Growth 2 500 Kč (250) and Scale 10 000 Kč (2 500). The **widget** costs 500 Kč/month (20 estimates) or 750 Kč (40). Valuo **cannot value commercial properties** because it uses the comparative method. — [Valuo ceník](https://www.valuo.cz/prices); [Valuo PROFI](https://www.valuo.cz/valuo-profi); [Valuo API](https://www.valuo.cz/valuo-api); [Valuo widget](https://www.valuo.cz/valuo-widget). *Conflict:* another Valuo page lists Start at 449 Kč incl. VAT (359 Kč with annual billing). — [Valuo odhadce](https://www.valuo.cz/odhadce)
- **Reas.cz**: a free "Atlas cen" of **actual sale prices from the cadastre**, a free online price estimate (an exact valuation needs an in-person visit), free "Nahlížení do katastru", "Jediná Cenová mapa Zdarma – prodané nemovitosti", free price alerts and free agent matching (reply usually within 24 h). No paid tier was found. — [Reas – Atlas cen](https://www.reas.cz/blog/atlas-cen-zverejnuje-realne-prodejni-ceny-nemovitosti); [Reas – cenová mapa](https://www.reas.cz/cenova-mapa); [Reas – pro makléře](https://www.reas.cz/pro-maklere); [Reas – nahlížení](https://www.reas.cz/nahlizeni-do-katastru-nemovitosti)
- **iKatastr.cz**: all functions free (per a blog from about 2024). It shows cadastral maps with address search; a long press on a parcel shows cadastre information, and there are layers such as flood maps and contaminated sites. It is developed by StoneApp / Stanislav Šumbera and started at Mendel University in Brno. — [Maplo blog – iKatastr](https://blog.maplo.cz/lide-a-nastroje/ikatastr); [Geobusiness – iKatastr mobilní verze](https://www.geobusiness.cz/ikatastr-cz-nova-mobilni-verze/)
- **Other cadastre map apps**: pzmk.cz, "Katastrální mapa: prodeje, kolaudace, povodně" (title only). — [pzmk.cz](https://pzmk.cz/). Also the iOS app "Měření Mapy & Katastr Navigace". — [App Store](https://apps.apple.com/cz/app/m%C4%9B%C5%99en%C3%AD-mapy-katastr-navigace/id1556584402?l=cs)
- **Cenové mapy**: the Ministry of Finance keeps a "Přehled cenových map" (an overview of official price maps of building land). — [MF – přehled cenových map](https://mf.gov.cz/cs/kontrola-a-regulace/ocenovani-majetku/prehled-cenovych-map). ČÚZK/Nemoforum ran a seminar on building-plot prices online. — [ČÚZK – Ceny stavebních pozemků na internetu](https://cuzk.gov.cz/O-resortu/Nemoforum/Akce-Nemofora/Seminare/Ceny-stavebnich-pozemku-na-internetu.aspx)
- **Flat Zone** (data for developers; linked to Trigema):
  - Data is collected **daily** from several hundred websites of developers, investors and portals across the country.
  - A project card shows price per m², share of available units, monthly sales volume and price-trend charts. Raw data is available only in a premium "Surová data" package.
  - Plans: **PRO** (30 reports, unlimited users, no raw data; "covers most needs of medium and smaller developers") and **Enterprise** (reports as needed, raw data included). "Připravované projekty" is a paid add-on.
  - An archived per-analysis price list: content analysis 500 Kč incl. VAT; locality analysis 150 Kč (environment), 170 Kč (population), 300 Kč (whole).
  - A Slovak version exists, and Flat Zone publishes on "realitní due diligence".
  - Sources: [Flat Zone help – karta projektu](https://help.flatzone.cz/cs/article/karta-projektu-a4n84x/); [připravované projekty](https://help.flatzone.cz/cs/article/pripravovane-projekty-vse-co-potrebujete-vedet-10wiulw/); [old ceník](https://www.flatzone.cz/analyzy-trhu-old/cenik/); [pricing](https://en.b2b.flatzone.cz/pricing); [Trigema – Flat Zone](https://www.trigema.cz/flatzone/); [flatzone.sk](https://flatzone.sk/); [Flat Zone – Realitní Due Diligence](https://b2b.flatzone.cz/blog/realitni-due-diligence)
- **GIS / geodesy software (GEPRO)**:
  - MISYS is a modular GIS covering cadastre, technical infrastructure, transport and building management; it reads the VFK cadastral exchange format. KOKEŠ is a geodesy package.
  - Indicative prices: GEPRO Premium web geoportal from **4 000 Kč/year**; MISYS desktop OBEC/MĚSTO/PROFI from **19 200 Kč**, STANDARD **45 600 Kč**, SPRÁVCE from **48 000 Kč**; the MISYS VIEW viewer is free for non-commercial use, VIEW-PROFI costs 3 600 Kč; KOKEŠ STANDARD 36 000 Kč, VEKTOR 31 200 Kč; rental is 25 % of the base price per year.
  - Sources: [GEPRO ceník](https://www.gepro.cz/cenik/); [GEPRO produkty](https://www.gepro.cz/produkty/)
- **Official planning data portal**: NGÚP (Národní geoportál územního plánování) exists; only its FAQ page came up. — [NGÚP – časté dotazy](https://uzemniplanovani.gov.cz/caste-dotazy)
- **Portals**: Bezrealitky sells a **"NEMO report" service** delivered through NEMO Report s.r.o., with Bezrealitky as joint data controller. — [Bezrealitky – NEMO report](https://www.bezrealitky.com/information/smluvni-podminky/nemo-report). I found **no evidence of a Sreality report partnership**; results only showed older items about Sreality's dispute with agencies over its terms. — [Hypoindex](https://www.hypoindex.cz/clanky/srealitycz-jsou-v-pasti-skonci-bez-realit/)
- **Czech AI / startup signals 2023–2026** (none dedicated to architects' pre-design was found):
  - Jan Antonín Kolář's database of "forgotten plots" (CzechCrunch, April 2025): AI to find rightful owners, with a commission on court cases. More than 50 people got in touch after the new version launched. — [CzechCrunch](https://cc.cz/rozjel-nekolik-startupu-ale-neuspel-nevzdal-se-a-ted-se-snazi-zachranit-zapomenute-pozemky/)
  - Alice Technologies (Czech-American founder; AI construction planning; CzechCrunch headline says it raised over 700 million Kč). — [CzechCrunch](https://cc.cz/cechoamerican-uci-svet-planovat-stavby-s-umelou-inteligenci-na-svuj-projekt-ziskal-pres-700-milionu/)
  - International benchmark: US startup Blueprints AI claims permit-ready drawings in minutes (TechCrunch, 12 Oct 2026). — [TechCrunch](https://techcrunch.com/2026/10/12/this-ai-startup-says-it-can-generate-permit-ready-blueprints-in-minutes/)

**D. Slovakia**
- **Landai.sk** (SK and CZ) is closer to a plot valuation than a risk report. It gives an "expertná AI analýza" with a sell / rent / wait recommendation. The **basic report costs 49 € and arrives within 24 h**. — [Landai.sk](https://landai.sk/)
- **OverNehnutelnost.sk** presents itself as an **AI platform for buying, selling and verifying property**. Verification was **free during the BETA**; no later price is stated. — [OverNehnutelnost](https://www.overnehnutelnost.sk/); [overenie](https://www.overnehnutelnost.sk/overenie.html)
- An informative LV extract is free on katasterportal.sk; an official extract at the cadastral office costs **8 €**. A pre-purchase checklist lists ÚP, access, utility networks, regulations, area limits, legal status and budget. — [projekt-stavby.sk](https://www.projekt-stavby.sk/pages/blog-co-overit-pred-kupou-pozemku-a-stavbou-domu.html)
- Real Estate Radar: median asking price 76 €/m² across 50 174 listings; **building plots 89 €/m²**. These are asking prices, not transaction prices. — [realityradar.eu](https://realityradar.eu/ceny-pozemkov)
- Flat Zone also operates in SK. — [flatzone.sk](https://flatzone.sk/)

### Inferences
- **The "automated plot report from public data" category exists and is cheap**: 99–349 Kč for automated reports, 740–2 790 Kč at NEMO and 899–1 999 Kč at TH. A newcomer cannot stand out by merely combining ČÚZK / ÚP / utility-network data. Differentiation would have to come from **interpreting regulations for design**: zastavěnost, podlažnost and height, odstupy, uliční čára, roof shape, a buildable envelope and massing. Today this appears only in free calculators (Hubenya), in NEMO KOMPLET ("detailní info z ÚP") and in manual work.
- **Every provider found sells to buyers and realtors.** The architect segment, meaning podklady for a study, white-label reports an architect can resell, or time saved in the "přípravná fáze", looks unserved by a dedicated product. This rests on limited searching, so it is not a proof of absence.
- **The slow part is official data.** TH's detailed check takes 30–60 days and Černošice's ÚPI target is 30 days (see section 4). Automation can collapse the public-data part to minutes (AIkatastr ≤5 min), but statements from authorities and utility owners remain the bottleneck.
- **NEMO Report is the best-placed incumbent.** It already has B2C distribution (Bezrealitky, dum123), a large realtor network (M&M Reality) and a product aimed at building projects (KOMPLET). AIkatastr is the most "AI-native" competitor (copilot for makléři).
- auditpozemku.cz and vyjadrovacky.cz use the same URL path (/sluzby/provereni-pozemku/) and similar price ranges, so they may share an operator. This is unverified.

### Gaps
- **Method limitations (apply to all five sections):**
  - WebFetch was blocked for every Czech provider domain tried (pozemecheck.cz, proverenipozemku.cz, nemoreport.cz, aikatastr.cz are outside this session's allowed network domains).
  - The shared WebSearch budget (200 calls per turn across all agents) ran out after about 40 searches.
  - All findings therefore come from search-engine result summaries, not full-page reads. Prices and claims should be re-checked on the live pages before they go into a final report. Several quotes could not be pinned to one URL, and this is flagged inline.
- For most providers I did not find operator details (company name, IČO), launch dates or volumes such as reports sold. NEMO is the exception for the operator.
- **Banks' valuation tools** (online estimators of ČS, KB, ČSOB, Raiffeisen; valuation companies) were not researched because the budget ran out.
- **GIS firms T-MAPY, Arcdata Praha, Hrdlička, Gisoft, Berit**: no information was retrieved, only GEPRO.
- **Czech AI-for-architecture startups from 2023–2026**: none focused on plot or pre-design research turned up in the few searches made. This does not show they don't exist.
- **Sreality**: no report product or partnership was found.
- **Slovak ZBGIS-based services**: none found.
- **Flat Zone**: current PRO / Enterprise prices not found.
- Suggested follow-up queries: "Česká spořitelna odhad ceny nemovitosti online", "T-MAPY / Arcdata / Hrdlička GIS pro architekty", "startup AI územní plán regulativy", "ZBGIS aplikácia analýza parcely", "nemoreport partner banka".

## 2. How Czech architects handle the pre-design phase today

### Takeaway
ČKA's service standards put surveys and analyses ("průzkumy a rozbory") in the preparation phase. There the architect decides which surveys and expert inputs the project needs. For territorial plans, "Doplnění průzkumů a rozborů a přípravné práce" is a separate phase. The ČKA fee calculator was updated for vyhláška 131/2024, and its phase percentages were agreed with ČKAIT; offices price work as estimated hours × their own hourly rate. Family-house fees published online:
- study about 40–150 k Kč
- permit and construction documentation about 170–260 k Kč
- total about 10 % of construction cost (about 600 k Kč for a 6 M Kč house)

Site research is usually folded into the study or sold as a separate pre-purchase "rešerše parcely". I found no source giving the hours it takes.

### Cited Findings
- **ČKA standard, preparation phase**: early on, the architect should provisionally determine which surveys and analyses are needed, plus any verifying specialist studies or expert opinions. — [ČKA – Standardy služeb architekta pro navrhování, projektování a dozorování staveb (PDF)](https://www.cka.cz/++api++/sluzby/clenum/standardy-vykonu-a-dokumentace/standardy-sluzeb-architekta-pro-navrhovani-projektovani-a-dozorovani-staveb.pdf/@@download/file)
- **Survey catalogue in the ČKA standard (pozemní stavby)**: zaměření budov, inženýrsko-geologický průzkum, hydrogeologický průzkum, pedologický a radonový průzkum, archaeological survey, traffic counts, noise measurement and archival research. — [ČKA – Standard služeb architekta – pozemní stavby](https://www.cka.cz/++api++/svet-architektury/publikace/publikace-cka/standard-sluzeb-architekta-pozemni-stavby/@@download/file). The interior standard adds a geodetic survey of the interior (pasport stavby). — [ČKA – Standard – interiér](https://www.cka.cz/++api++/svet-architektury/publikace/publikace-cka/standard-sluzeb-architekta-interier/@@download/file)
- **Standard for territorial and regulation plans**: "Doplnění průzkumů a rozborů a přípravné práce" is its own phase, with standard and additional services listed separately. — [ČKA – Standard služeb – ÚP a RP](https://www.cka.cz/++api++/svet-architektury/publikace/publikace-cka/standard-sluzeb-architekta-projektanta-uzemniho-a-regulacniho-planu/@@download/file)
- **2025 standards tables**: ČKA's calculator section hosts the ČKAIT 2025 standards tables (e.g. "Tab. 1.2 FÁZE SLUŽEB FS2"), which include a "Průzkumy" category. — [ČKA – Standardy ČKAIT 2025 Tab 1.2 FS2](https://www.cka.cz/kalkulacky/Standardy-CKAIT-2025-Tab-1-2-FS2-DNS.pdf); ČKAIT standards: [Profesis ČKAIT A-4-1-1](https://profesis.ckait.cz/dokumenty-ckait/a-4-1/a-4-1-1/), [A-4-1-2](https://profesis.ckait.cz/dokumenty-ckait/a-4-1/a-4-1-2/). Older vintages of the standards exist (e.g. a copy attached to an Ostrava tender), so wording may differ between editions. — [Ostrava – Standard služeb architekta](https://verejnezakazky.ostrava.cz/files/cfc748049e45d87/5bf7f72a95dd5standard-sluzeb-architekta.pdf)
- **ČKA calculator "Pozemní a krajinářské stavby"**: offices take the calculator's estimated working time and multiply it by their own hourly rate. The calculator was updated to vyhláška č. 131/2024 Sb., and ČKA and ČKAIT agreed the percentage for each phase. The search snapshot showed only empty input fields, so no computed example was available. — [ČKA – kalkulačka pozemní a krajinářské stavby](https://www.cka.cz/sluzby/clenum/kalkulacky/pozemni-a-krajinarske-stavby); [ČKA – kalkulačka interiéry](https://www.cka.cz/sluzby/clenum/kalkulacky/interiery)
- **No official price list** sets architects' fees today. For a family house with a **6 M Kč budget the architect's fee is about 600 000 Kč**, depending on scope. — [Czech Deco Team blog – Kolik stojí architekt v roce 2026](https://blog.czechdecoteam.cz/kolik-stoji-architekt-v-roce-2026-a-z-ceho-se-cena-sklada/) (attribution from the search summary)
- An architecture studio: a family-house **study about 80–150 k Kč**, the **project about 170–260 k Kč** (a commercial offer). The search summary named neither of the two candidate pages: [archwilczek.com – Kolik stojí projekt RD](https://archwilczek.com/kolik-stoji-projekt-rodinneho-domu/) or [jankabelka.com – FAQ](https://www.jankabelka.com/faq).
- Another office's calculation comes to **about 10.5 % of construction cost** for design, project and post-project services. Attribution is unclear between [architekt-hladik.cz – ceník](https://www.architekt-hladik.cz/cenik/) and [h.cz – ceny](http://www.h.cz/architekti/ceny.php). One office still quotes an example from the 1997 ČKA fee schedule (a house costing 2.75 M Kč), which is clearly outdated.
- **Čtrnáctý architekt**: a study costs about 50 000 Kč (the page also says "od 40 tis."). The study **checks the regulativy that can set the number of floors, built-up area and % greenery**, and includes a **preliminary consultation with the authorities**. — [ctrnactyarchitekt.com – služby](https://www.ctrnactyarchitekt.com/slu%C5%BEby-architekta)
- **Per-m² pricing**: one architect charges 200 Kč per m² of the designed building (minimum 15 000 Kč) for a study that leads into the project, or 1 350 Kč/m² (minimum 100 000 Kč) for a higher variant; a standalone study carries a 20 % surcharge. This is probably [DJS architecture – ceník](https://www.djsarchitecture.cz/cenik-sluzieb), per the search summary.
- One source gives architects' hourly rates as "zpravidla 400–1 200 Kč/h". That looks low next to lawyers (section 4) and may be old or Slovak. Attribution is unclear among [stavimbydlim.cz](https://stavimbydlim.cz/architektonicka-studie-rodinneho-domu/), [povolstav.cz](https://povolstav.cz/blog/co-obsahuje-architektonicka-studie) and [kovacarchitekt.sk](https://www.kovacarchitekt.sk/cenn%C3%ADk).
- **Svépomocí.cz**: an architectural study costs 0–100 000 Kč depending on who you choose; a **plot analysis costs 5 000–10 000 Kč**. — [svepomoci.cz](https://svepomoci.cz/clanek/9236-jaka-je-cena-projektu-pro-stavebni-povoleni)
- **Surveys before design**: a new family house needs a geodetic survey and radon, hydrogeological and engineering-geological surveys. Some are required by the building office; others are needed for an economical design. — [master-design.cz](https://www.master-design.cz/blog/obecne/pruzkumy-parcely-pred-projektem)
- **Municipalities** buy plot and locality studies too. The public contract register contains a price offer for a "Zastavovací studie lokality". — [smlouvy.gov.cz – CN zastavovací studie](https://smlouvy.gov.cz/smlouva/soubor/25953847/CN%20ZS%20LK.pdf?backlink=6hqno)
- **Pain points and quotes from architects and the sector:**
  - "Je možné, že právě váš vysněný dům na daném pozemku nepůjde postavit z důvodu regulací. Územní regulace mohou určovat povolenou zastavěnou plochu, sklon střechy, umístění na pozemek, tvarové řešení, typy použitých materiálů…" The quote came up in search; it is from one of [architekturazivota.cz](https://architekturazivota.cz/navrh-rodinneho-domu/) or [projektovna.cz](https://www.projektovna.cz/blog/co-udelat-pred-stavbou-domu), unconfirmed which.
  - "Levný pozemek může být nejdražší část celého záměru" (difficult foundations and terrain work). Also: "Architekta vybírejte před pozemkem". Probably from [krouzel.cz – Stavební pozemek nad zlato](https://krouzel.cz/stavebni-pozemek/); attribution not confirmed.
  - The cadastre does not say what a plot may be used for. — [Landcheck](https://landcheck.cz/en/other/cadastre_how_to/)
  - In Slovakia, the built-up-area index (index zastavanosti), number of floors (podlažnosť) and setbacks (odstupy) come from the municipality, so they should be requested in advance. — [kovacarchitekt.sk – cenník](https://www.kovacarchitekt.sk/cenn%C3%ADk)
  - Permitting time: Damir Špoljarič says permitting in CZ takes "from half a year to forever". — [CzechCrunch](https://cc.cz/jak-se-stavi-ai-datacentra-pozemky-ocenujeme-podle-elektriny-ne-podle-hektaru-rika-damir-spoljaric/). A ČKAIT 2026 headline, based on two surveys: "Jen 5 % staveb se nepovolí do roka a půl" (headline only). — [Zprávy ČKAIT 2026/02](https://zpravy.ckait.cz/vydani/2026-02/jen-5-staveb-se-nepovoli-do-roka-a-pul-vyplyva-ze-dvou-pruzkumu-ckait/)
  - The rules keep changing. In February 2026, ČKA and ČKAIT issued a joint memorandum on the amendment of the building act under discussion (sněmovní tisk 67/0). — [Zprávy ČKAIT](https://zpravy.ckait.cz/vydani/2026-02/spolecne-memorandum-ckait-a-cka-k-projednavane-novele-stavebniho-zakona-tisk-67-0/). e-Sbírka shows a consolidated version of zákon 283/2021 Sb. dated 11 June 2026. — [e-Sbírka 283/2021](https://e-sbirka.gov.cz/sb/2021/283)

### Inferences
- The ČKA calculator is time-based (hours × rate). Any hours saved in preparation and analysis go straight to margin or a lower client price, so the value to architects can be expressed in Kč per hour saved. Lawyer rates run 1 200–3 200 Kč/h (section 4); the only architect rate found, 400–1 200 Kč/h, is questionable.
- Site research is currently either **bundled** into a study priced around 40–150 k Kč (Čtrnáctý architekt includes the regulation check and consultation with authorities) or **sold separately** before purchase (a "rešerše parcely" request; plot analysis 5–10 k Kč per Svépomocí.cz). This points to two product angles:
  - an internal productivity tool for architects and engineer-designers
  - a white-label pre-purchase report that architects resell to their clients
- The most-cited pain points are regulations unknowable from the cadastre, terrain and foundation surprises, slow official inputs and frequent changes to the building law. A tool that gives a provisional reading of ÚP regulations plus the relevant risk layers, with links to sources, would address the first two directly.

### Gaps
- **Typical hours spent on site research for a family house** and **whether it is billed separately**: no source found.
- **The exact percentage of the fee for the preparation phase / průzkumy a rozbory** in the 2024–2025 ČKA/ČKAIT tables was not retrieved, because the PDFs could not be fetched.
- **Forum pain points** (modrastrecha.cz, estav.cz, LinkedIn, ČKA events) were not searched; the budget ran out before this round.
- ČKA's current hourly-rate guidance was not found.

## 3. Market size (professionals, construction volumes, transactions; CZ + SK)

### Takeaway
CZ professionals:
- **4 288 authorised architects** (ČKA, 1 Jan 2026)
- **over 32 000 ČKAIT authorised persons**, including **17 124 in pozemní stavby** (Jan 2025)

CZ construction volumes:
- about **13–15 thousand dwellings a year started in new family houses**: 13 071 in 2024 (−10.2 %), about 14.6 k implied for 2023
- total dwelling starts: **35 704 (2023), 36 612 (2024), 35 819 (2025)**
- a strong **2026 rebound**: 22 785 starts in H1 2026, about +40 % y/y; August 2026 +42.3 %, including family houses

I did not find national counts of building-plot transactions, architecture offices, developers or building permits. Slovakia started about 15 100 dwellings in 2025.

### Cited Findings
**Professionals (CZ)**
- **ČKA**: as of 1 Jan 2026, **4 288 authorised architects** (3 071 men, 1 217 women) and 207 emeritus members. — [ČKA – základní informace](https://www.cka.cz/komora/o-komore/zakladni-informace). *Other figures:* the February 2026 ČKA–ČKAIT memorandum says ČKA represents 4 226 authorised architects and urbanists. — [Zprávy ČKAIT](https://zpravy.ckait.cz/vydani/2026-02/spolecne-memorandum-ckait-a-cka-k-projednavane-novele-stavebniho-zakona-tisk-67-0/). Wikipedia gives 3 946 (undated). — [Wikipedia – ČKA](https://cs.wikipedia.org/wiki/%C4%8Cesk%C3%A1_komora_architekt%C5%AF). A public register of authorised architects exists. — [ČKA – seznam](https://www.cka.cz/sluzby/verejne-sprave/seznam-autorizovanych-architektu)
- In 2025 ČKA confirmed **72 architectural competitions** as regular, the highest number since it began keeping records. — [ASB portal](https://www.asb-portal.cz/aktualne/v-roce-2025-bylo-vyhlaseno-rekordni-mnozstvi-architektonickych-soutezi)
- **ČKAIT**: "více jak 32 tisíc autorizovaných inženýrů a techniků". — [ČKAIT – O nás](https://www.ckait.cz/o-nas). As of 14 Jan 2025, authorisations by field, which overlap because one person can hold several:

  | Field | Authorised persons |
  |---|---|
  | **Pozemní stavby (PS)** | **17 124** |
  | Technologická zařízení staveb (TZS) | 4 122 |
  | Technika prostředí staveb (TPS) | 3 799 |
  | Dopravní stavby (DS) | 3 685 |
  | Vodní hospodářství a krajinné inženýrství (VS) | 3 108 |
  | Mosty a inženýrské konstrukce (MIK) | 1 289 |
  | Statika a dynamika staveb (SaD) | 1 147 |
  | Zkoušení a diagnostika (ZaD) | 109 |
  | Stavby pro plnění funkce lesa (LS) | 55 |

  — [Zprávy ČKAIT 2025/01](https://zpravy.ckait.cz/vydani/2025-01/profesni-aktivy-a-komise-ckait-pracovaly-v-zajmu-autorizovanych-osob/). An older source says "více jak 22 tisíc" (outdated). — [ČESKÉSTAVBY.cz](https://www.ceskestavby.cz/clanky/ckait-ceska-komora-autorizovanych-inzenyru-techniku-cinnych-ve-vystavbe-203.html). In December 2021 there were 32 345 actively working authorised persons and 1 222 with suspended authorisation. This is probably from [Wikipedia – ČKAIT](https://cs.wikipedia.org/wiki/%C4%8Cesk%C3%A1_komora_autorizovan%C3%BDch_in%C5%BEen%C3%BDr%C5%AF_a_technik%C5%AF_%C4%8Dinn%C3%BDch_ve_v%C3%BDstavb%C4%9B), per the search summary.

**Housing starts (ČSÚ, CZ)**
- **2023**: 35 704 dwellings started, −15.5 % y/y. — [ČSÚ – Výstavba bytů v roce 2023](https://csu.gov.cz/produkty/vystavba-bytu-v-roce-2023-mirne-klesla). The page title says construction "mírně klesla" (fell slightly), which probably refers to completions. Family-house figures for 2023 are in ČSÚ's Table M.2. — [ČSÚ Tab. M.2 2023](https://csu.gov.cz/docs/107508/76fcbceb-f21a-1a62-5e99-1cbcbedede4d/33010923q4m2.pdf?version=1.0)
- **2024**: **13 071 dwellings started in new family houses, −10.2 % y/y** (preliminary). That implies about 14 556 in 2023 (my calculation; verify against Tab. M.2). Total starts were 36 612 (+2.5 %), with growth coming from apartment buildings. — [TZB-info](https://stavba.tzb-info.cz/28572-dokoncovani-bytove-vystavby-vazlo); [Časopis Stavebnictví – Bytová výstavba v roce 2024](https://www.casopisstavebnictvi.cz/clanky-bytova-vystavba-v-roce-2024.html). *Conflict:* other sources give 36 477 (+2.2 %), probably an earlier preliminary figure.
- **2025**: **35 819 dwellings started, −2.2 % (−793)**; eight regions grew year on year. — [ČSÚ – Plzeňský kraj 2025](https://csu.gov.cz/plk/bytova-vystavba-v-plzenskem-kraji-v-roce-2025). Another summary gives −795. Family-house starts fell **15.9 % y/y in Q1 2025**. — [ČSÚ – stavební produkce Q1 2025 (komentář)](https://csu.gov.cz/docs/107532/34380fae-f327-f956-3d03-06f959518c7f/csta050725_komentar.pdf)
- **2025 regional starts in new family houses**:
  - Jihočeský 886 (+4.2 %, 32.3 % of the region's starts) — [ČSÚ JHČ](https://csu.gov.cz/jhc/bytova-vystavba-v-jihoceskem-kraji-v-roce-2025)
  - Plzeňský about 930 (−5.0 %, −49) — [ČSÚ PLK](https://csu.gov.cz/plk/bytova-vystavba-v-plzenskem-kraji-v-roce-2025). *Conflict:* another passage gives 74; this is unresolved.
  - Zlínský 783 (−17) — [ČSÚ ZLK](https://csu.gov.cz/zlk/bytova-vystavba-ve-zlinskem-kraji-v-roce-2025)
  - Moravskoslezský 1 038 (−18.1 %) — [ČSÚ MSK](https://csu.gov.cz/msk/bytova-vystavba-v-moravskoslezskem-kraji-v-roce-2025)
  - Praha 536 (7.3 % of Prague's starts) — [ČSÚ Praha](https://csu.gov.cz/pha/prazska-bytova-vystavba-v-roce-2025)
  - Středočeský: family houses' share fell to 50.2 % — [Kurzy.cz / ČSÚ STČ](https://zpravy.kurzy.cz/849645-bytova-vystavba-ve-stredoceskem-kraji-v-roce-2025/)
  - Královéhradecký: family houses 39.1 % of starts, ahead of apartment buildings at 33.6 % — [ČSÚ HKK](https://csu.gov.cz/hkk/bytova-vystavba-v-kralovehradeckem-kraji-v-roce-2025)
  - The MSK release also says family-house starts fell in five other regions, most in Jihomoravský (−23.2 %). It lists increases in Karlovarský (+27.7 %), Pardubický (+23.0 %) and Praha (+22.1 %), but the summary is ambiguous about whether these are family-house or total starts.
- **2026**:
  - **22 785 dwellings started in H1 2026, about +40 % y/y**.
  - Monthly: June 4 013, July 2 935, **August 3 922 (+42.3 % y/y)**. ČSÚ said the August growth "zahrnoval rodinné i bytové domy". Data published 7 Oct 2026.
  - Source: [Realita kroku – DEK / ČSÚ](https://www.realitakroku.cz/aktuality/dek-oziveni-bytove-vystavby-2026-zahajene-dokoncene-byty-csu)
- **H1 2026 regional starts in new family houses**:
  - Jihočeský 522 (+28.6 %) — [ČSÚ JHČ H1 2026](https://csu.gov.cz/jhc/bytova-vystavba-v-jihoceskem-kraji-v-1-az-2-ctvrtleti-2026)
  - Olomoucký 391 (48.9 % of starts) — [ČSÚ OLK H1 2026](https://csu.gov.cz/olk/bytova-vystavba-v-olomouckem-kraji-v-1-pololeti-2026)
  - Královéhradecký 407 vs. 319 a year earlier — [e-finance.eu](https://www.e-finance.eu/blog/vystavba-bytu-kralovehradecky-kraj-24065/)
  - Liberecký 246 — [ČSÚ LBK H1 2026](https://csu.gov.cz/lbk/bytova-vystavba-v-libereckem-kraji-v-1-az-2-ctvrtleti-2026)
- **Building permits**: ČSÚ publishes a time series, "Bytová a nebytová výstavba a stavební povolení – časové řady", but no figures were retrieved. — [ČSÚ – časové řady](https://csu.gov.cz/produkty/bvz_cr). Zprávy ČKAIT (2025/03) headline: "Počet povolených bytů převýšil počet kolaudací". — [Zprávy ČKAIT](https://zpravy.ckait.cz/vydani/2025-03/pocet-povolenych-bytu-prevysil-pocet-kolaudaci/)

**Plot transactions (CZ)**
- ČÚZK has published quarterly statistics on selected transactions since 2008, with parcel counts. **Since 2015 only a limited set has been published** (statistics on vklady práv and poznámky), so there is no official national count of building-plot sales. — [ČÚZK – statistické údaje o transakcích](https://cuzk.gov.cz/Katastr-nemovitosti/Statisticke-udaje-o-transakcich/Statisticke-udaje-o-vybranych-transakcich-s-ne-(1).aspx)
- REMAX: the number of plots sold "last year" fell 30 % compared with 2021. The article's date is unclear (probably 2022 or 2023 data) and it covers one network only. — [REMAX Prestige](https://www.remax-prestige.cz/ceny-stavebnich-pozemku-sleduji-trend-ostatnich-nemovitosti/)

**Slovakia**
- **2025**: about **15 100 dwellings started** and 14 300 completed (completions −19 % y/y). Family houses were only **35 % of starts** in Q4 2025 but 68 % of completions in that quarter. ŠÚ SR marks Q3–Q4 2025 data as **preliminary** because of a switch to a new data source. Sources conflict on whether 2025 starts were +2 % or −26 % against the ten-year average. — [Finsider](https://www.finsider.sk/spravy/vystavba-bytov-na-slovensku-v-roku-2025-vyrazne-spomalila/); [Stavebný magazín](https://stavebnymagazin.sk/bytova-vystavba-v-roku-2025-vyrazne-spomalila-pocet-dokoncenych-bytov-klesol-o-19/); [SME Index](https://www.sme.sk/index/c/bytovej-vystavbe-sa-vlani-nedarilo-pocet-dokoncenych-bytov-klesol-o-19-percent)
- The Slovak Chamber of Architects (SKA, founded 1 June 1992, no state subsidies) keeps the register of authorised architects. It announced three exam dates for 2025. Its member count was not found. — [komarch.sk – o komore](https://komarch.sk/o-komore); [archinfo.sk](https://www.archinfo.sk/diskusia/blog/vykon-povolania/autorizacne-skusky-2025.html)
- SKSI's 2025 annual report gives **1 256** "autorizovaní stavební inžinieri" as of 31 Dec 2025, but **1 304** elsewhere in the same report. The figure looks low for SKSI's total membership, so it may cover only one category. — [SKSI výročná správa 2025](https://www.sksi.sk/buxus/docs/Vyrocna_sprava_SKSI_2025_final.pdf)

### Inferences
- **CZ family-house funnel**: about 13–15 k new family-house dwellings start each year (2023–2024; the national 2025 figure is missing). With the 2026 rebound, 2026 will probably exceed 2025. Each start is preceded by checking one or more plots, and some evaluated plots are never bought.
- **Illustrative B2C ceiling** (assumptions, not data): 13–15 k projects × 1–3 plots checked × 1 000–3 000 Kč ≈ **13–135 M Kč a year** for paid plot checks tied to family houses, before developers, investors and agricultural or recreational plots.
- **Professional B2B base**: 4 288 architects plus 17 124 PS engineers, with overlap and many family houses designed by ČKAIT "projektanti" rather than architects. That suggests a few thousand realistic seats. *Illustrative* (assumed 10–25 % adoption among the 4 288 architects at Valuo-like 500–1 000 Kč/month): about **2.6–12.9 M Kč a year**. The engineer-designer segment could be larger than the architect one.
- Timing: housing starts were flat from 2023 to 2025, and family houses fell in 2024 and Q1 2025. 2026 shows a broad recovery including family houses, which is favourable for a launch in late 2026 or 2027.

### Gaps
- The **national 2025 count of dwellings started in family houses** was not found, only regional figures and the total. It should be taken from ČSÚ's open data ("Zahájené byty v ČR").
- **Building permits per year**: not retrieved.
- **Building-plot transactions per year**: no official count after 2015 was found. Possible proxies are ČÚZK vklad statistics, portal data (Sreality, Reas) and Deloitte or REMAX reports.
- **Number of architecture offices** (CZ-NACE 71.11 / RES) and **number of developers**: not searched because the budget ran out.
- **Slovak figures**: the count of authorised architects and the 2025 family-house starts were not found.

## 4. Willingness-to-pay signals

### Takeaway
The prices found fall into a clear ladder:
- official data: free to 100 Kč (ÚPI is free but takes up to about 30 days; an LV extract costs 50–100 Kč)
- automated reports: 99–349 Kč
- semi-automated reports: 740–2 790 Kč
- manual expert checks: 1 100–5 490 Kč
- lawyer and inspection checks: 4 900–20 000 Kč
- architect studies: 40–150 k Kč

Professional data subscriptions cluster around 500–1 000 Kč a month (Valuo PROFI, Pozemkov 590 Kč/month), with APIs up to 10 000 Kč a month and GIS desktop licences of about 19–48 k Kč.

### Cited Findings
**Official fees**
- **Územně plánovací informace (ÚPI)** is **free of charge**. Černošice: "vydání územně plánovací informace není zpoplatněno", with a 30-day target for simpler cases. — [Černošice – ÚPI](https://www.mestocernosice.cz/prakticke-informace/potrebuji-si-zaridit-/agendy-mestskeho-uradu/agendy-stavebniho-uradu/uzemne-planovaci-informace/). The Ombudsman's guide also says it is free. — [Domek polopatě (ochrance.cz)](https://domek.ochrance.cz/uzemni-plan/uzemne-planovaci-informace/). A realtor's site adds that it is valid for one year (less authoritative). — [realitni-makler.eu](https://realitni-makler.eu/uzemne-planovaci-informace/). Brno also handles "předběžná informace" requests (fee not retrieved). — [Brno](https://www.brno.cz/w/zadost-o-vydani-predbezne-informace)
- **LV / cadastre extract**:
  - Czech POINT: **100 Kč for the first page, 50 Kč for each further page** (methodology dated May 2026). — [Czech POINT metodika katastr](https://www.czechpoint.gov.cz/public/wp-content/uploads/2026/05/Metodika-CzP_Katastr-nemovitosti.pdf)
  - Dálkový přístup ČÚZK: about **50 Kč per PDF extract**. Finance.cz says 50 Kč per A4 page and 100 Kč for an XML LV; the ČÚZK methodology summary says 50 Kč regardless of page count. This conflict is unresolved, and Finance.cz also gives 40 Kč for further Czech POINT pages, which is outdated. — [Finance.cz](https://www.finance.cz/clanky/533000-kolik-stoji-vypis-z-katastru-nemovitosti/)
  - "Nahlížení do katastru" is free but has no legal force.
  - Czech POINT posted a notice on 16 Oct 2026 about an outage of Dálkový přístup and its web services. — [Czech POINT](https://www.czechpoint.gov.cz/public/)
- **Building-permit fees** of 5 000 / 10 000 Kč come from a low-authority calculator site, unverified. — [rulecalc.com](https://rulecalc.com/spotrebitel/povoleni-stavby)

**Price ladder of comparable services (CZ unless noted)**

| Service | Price | Turnaround | Source |
|---|---|---|---|
| AIkatastr.cz automated plot report (PDF) | 99 Kč | ≤5 min | [AIkatastr](https://aikatastr.cz/reseni/kontrola-pred-koupi) |
| NEMO flood-risk report | 135 Kč | ~15 min (per summary) | [NEMO](https://www.nemoreport.cz/sluzby-a-ceny) |
| Pozemkov.cz one-off report / subscription | 349 Kč / 590 Kč per month | n/a | [Pozemkov](https://pozemkov.cz/) |
| NEMO STANDARD | 740 Kč (690 at reseller; 890 at launch) | n/a | [NEMO](https://www.nemoreport.cz/sluzby-a-ceny); [dum123](https://www.dum123.cz/sluzby-specialistu/nemo-report-komplet/) |
| TH Prověření pozemku basic / detailed | 899 Kč / from 1 999 Kč | 48 h / 30–60 days | [proverenipozemku.cz](https://www.proverenipozemku.cz/) |
| Rozborpozemku.cz | 1 000–1 100 Kč + extras | n/a | [rozborpozemku.cz](https://www.rozborpozemku.cz/) |
| Visidoo Kontrola pozemků | from 1 990 Kč | ≤3 days | [Visidoo](https://www.visidoo.cz/en/service/kontrola-pozemku) |
| NEMO KOMPLET (for building projects) | 2 790 Kč (2 490 at dum123) | 2–3 working days | [NEMO](https://www.nemoreport.cz/sluzby-a-ceny); [dum123](https://www.dum123.cz/sluzby-specialistu/nemo-report-komplet/) |
| Audit pozemku | ~3 000–10 000 Kč (one summary: 20 000) | n/a | [auditpozemku.cz](https://www.auditpozemku.cz/sluzby/provereni-pozemku/) |
| PozemeCheck standard / express | 3 890 / 5 490 Kč | ≤10 working days / ≤3 days | [pozemecheck.cz](https://pozemecheck.cz/) |
| Bezvadný pozemek (lawyer) | from 4 900 Kč | ≤5 working days | [bezvadny-pozemek.cz](https://www.bezvadny-pozemek.cz/) |
| Plot analysis by an architect / designer (article estimate) | 5 000–10 000 Kč | n/a | [svepomoci.cz](https://svepomoci.cz/clanek/9236-jaka-je-cena-projektu-pro-stavebni-povoleni) |
| Lawyer DD of a regular house or flat | ~7 000–15 000 Kč; packages 7 999–19 999 Kč | n/a | [Modernipravnik](https://modernipravnik.cz/for-investors-cs/real-estate-cs/due-diligence-nemovitosti/); [tarify](https://modernipravnik.cz/sluzby-pro-kupujici-investicni-byt/) |
| Nemoinspekt plot report | from 10 000 Kč | ≤10 working days | [Nemoinspekt](https://www.nemoinspekt.cz/en/) |
| Inspekce POZEMKU (on-site, ≤500 m²) | from 11 990 Kč | n/a | [inspekcelukes.cz](https://www.inspekcelukes.cz/inspekce-pozemku/) |
| Architectural study of a family house | ~40–50 k Kč (Čtrnáctý) up to 80–150 k Kč (another studio) | n/a | [ctrnactyarchitekt.com](https://www.ctrnactyarchitekt.com/slu%C5%BEby-architekta); [archwilczek.com](https://archwilczek.com/kolik-stoji-projekt-rodinneho-domu/) (attribution unclear) |
| Feasibility study for an apartment building | tens to low hundreds of thousands of Kč | n/a | [PM architekti](https://www.pm-a.cz/sluzby/bytove-domy/) |
| SK: Landai.sk AI plot report | 49 € | ≤24 h | [Landai.sk](https://landai.sk/) |
| SK: official LV extract | 8 € | n/a | [projekt-stavby.sk](https://www.projekt-stavby.sk/pages/blog-co-overit-pred-kupou-pozemku-a-stavbou-domu.html) |

**Lawyers' hourly rates (excl. VAT unless noted)**

| Firm | Rate | Source |
|---|---|---|
| AK Nožka | 1 200–1 500 Kč/h | [ak-nozka.cz](https://www.ak-nozka.cz/cenik-pravnich-sluzeb) |
| AK Dvořák & Křiváček | 1 800–2 500 Kč | [dvorak-krivacek.cz](https://www.dvorak-krivacek.cz/) |
| ATREUM K2 LEGAL | 2 400 Kč (discounted, beyond packages) / 3 200 Kč (base) | [k2legal.cz](https://www.k2legal.cz/nemovitosti/) |
| Ilona Černochová | 3 000 Kč + VAT | [ilonacernochova.cz](https://ilonacernochova.cz/pravni-sluzby-oblasti-nemovitosti/) |
| Michal Kalenský | 3 200 Kč | [ak-kalensky.cz](https://www.ak-kalensky.cz/cenik/) |

**B2B data and software subscriptions**
- **Valuo**:
  - PROFI: 500 / 750 / 1 000 Kč per month excl. VAT
  - API: 500 Kč (20 estimates) / 2 500 Kč (250) / 10 000 Kč (2 500) per month
  - Widget: 500 / 750 Kč per month
  - Sources: [Valuo ceník](https://www.valuo.cz/prices); [Valuo API](https://www.valuo.cz/valuo-api); [Valuo widget](https://www.valuo.cz/valuo-widget)
- **Pozemkov.cz**: 590 Kč per month. — [Pozemkov](https://pozemkov.cz/)
- **GEPRO**: web geoportal from 4 000 Kč/year; MISYS desktop 19 200–48 000 Kč; KOKEŠ 31 200–36 000 Kč; rental 25 % a year. — [GEPRO ceník](https://www.gepro.cz/cenik/)
- **Flat Zone**: archived per-analysis prices of 150–500 Kč; current plan prices not found. — [Flat Zone old ceník](https://www.flatzone.cz/analyzy-trhu-old/cenik/)
- **Free tools** set the price floor for basic map and cadastre views: iKatastr, Reas Atlas cen and nahlížení, Hubenya calculators. — [Maplo – iKatastr](https://blog.maplo.cz/lide-a-nastroje/ikatastr); [Reas](https://www.reas.cz/cenova-mapa); [Hubenya](https://hubenya.com/archipedia/)

**Slovakia, other transaction costs**: notarised signature 2.87 € each, notary escrow 23–166 €, contract drafted by a lawyer 200–500 €. This is probably from [aksamec.sk – Prevod pozemku 2026](https://www.aksamec.sk/prevod-pozemku-postup-2026/) (attribution from the search summary).

### Inferences
- Czech plot buyers already pay for checks, and the price band is wide. The most crowded band is **about 1–3 k Kč** (NEMO KOMPLET, TH detailed, Visidoo, Rozbor), with a premium band of **4–6 k Kč** (PozemeCheck, Bezvadný pozemek) and an expert band of **10–20 k Kč**.
- Against a family house costing millions of Kč, or a 600 k Kč architect fee, a report at 0.5–3 k Kč is trivial. WTP is limited less by budget than by trust and by awareness that a check is needed.
- For professionals the reference points are **500–1 000 Kč per user per month** (Valuo PROFI, Pozemkov), metered API pricing (Valuo) and roughly 1 Kč of automated report per 1 Kč of LV extract (99–135 Kč automated vs. 50–100 Kč for an LV).
- An architect-oriented tool could be priced at about 300–1 000 Kč per report or about 500–1 500 Kč per month. Architects could then resell a "rešerše parcely" to clients in the 5–10 k Kč range that Svépomocí.cz quotes for a plot analysis.
- Speed is valuable in itself. The official ÚPI is free but can take up to 30 days, while automated reports take minutes.

### Gaps
- No **WTP survey** of Czech architects or designers was found. There is also no data on **volumes or conversion** for existing report vendors (how many NEMO or AIkatastr reports are sold).
- **Bank valuation fees** (odhad pro hypotéku) and banks' report purchasing were not researched.
- **ČÚZK cenové údaje / bulk data prices** for B2B were not retrieved; another researcher's data-source notes may cover them.

## 5. Potential channels and partners

### Takeaway
The channels already proven in CZ for automated property and plot reports are:
- portals (Bezrealitky resells NEMO report)
- large realtor networks (M&M Reality's contract gives more than 2 000 brokers NEMO flood-risk data)
- house-builder and self-build portals (dum123.cz resells NEMO KOMPLET)
- listing-alert services (Visidoo bundles plot checks)
- B2B embedding (Valuo widget and API)

ČKA (4 288 architects) and ČKAIT (over 32 000) reach professionals through their standards and fee calculators. I found no evidence of report partnerships with Sreality, banks, mortgage brokers or prefab-house companies; searches on those were cut short.

### Cited Findings
- **Bezrealitky ↔ NEMO Report**: Bezrealitky offers the "NEMO report" service, operated by NEMO Report s.r.o., with joint data control. — [Bezrealitky – NEMO report](https://www.bezrealitky.com/information/smluvni-podminky/nemo-report). Bezrealitky formed a joint venture with Germany's Ohne-Makler and planned European expansion and multi-portal listing (CzechCrunch, about 2023). — [CzechCrunch](https://cc.cz/bezrealitky-se-spojuji-s-nemeckym-konkurentem-a-chteji-do-evropy-inzerat-nove-poslou-na-vsechny-portaly/)
- **Realtor networks**: M&M reality holding signed a contract with NEMO Report giving **more than 2 000 brokers** automated online access to flood-risk data for Czech properties. — [NEMO – M&M Reality](https://www.nemoreport.cz/mm-reality-holding-podepsal-smlouvu-s-nemo-report-ktera-umozni-vice-nez-2-000-realitnich-makleru-pristup-k-informacim-o-povodnovem-riziku-pro-ceske-nemovitosti). NEMO offers agencies CRM data links. — [NEMO – partner](https://www.nemoreport.cz/partner)
- **House-builder / self-build portal**: dum123.cz lists NEMO Report KOMPLET among its specialist services. — [dum123.cz – služby specialistů](https://www.dum123.cz/sluzby-specialistu/)
- **Listing-alert service**: Visidoo pairs free alerts on new listings with paid plot checks (from 1 990 Kč) and contract checks. — [Visidoo – služby](https://www.visidoo.cz/sluzby); [Visidoo – kontrola smluv](https://www.visidoo.cz/sluzby/kontrola-smluv)
- **Free-tool aggregator**: Reas.cz uses free cadastre and price tools to generate seller leads for agents (agent matching, in-person valuation). — [Reas – pro makléře](https://www.reas.cz/pro-maklere)
- **B2B embedding**: Valuo sells a widget for partners' websites and a metered API, a model for distributing reports through partners (banks, brokers, portals). — [Valuo widget](https://www.valuo.cz/valuo-widget); [Valuo API](https://www.valuo.cz/valuo-api)
- **Developers**:
  - Flat Zone is the established data channel to developers (PRO plan aimed at medium and smaller developers; a due-diligence blog). — [Flat Zone pricing](https://en.b2b.flatzone.cz/pricing); [Flat Zone DD blog](https://b2b.flatzone.cz/blog/realitni-due-diligence)
  - Building-materials chain DEK reports developers returning in 2026. — [Realita kroku](https://www.realitakroku.cz/aktuality/dek-oziveni-bytove-vystavby-2026-zahajene-dokoncene-byty-csu)
- **Professional chambers**:
  - ČKA publishes the service standards and fee calculators for its members (4 288 architects). — [ČKA – kalkulačky](https://www.cka.cz/sluzby/clenum/kalkulacky/pozemni-a-krajinarske-stavby); [ČKA – základní informace](https://www.cka.cz/komora/o-komore/zakladni-informace)
  - ČKAIT publishes standards on Profesis (more than 32 000 members) and runs the "Zprávy ČKAIT" news site. — [Profesis ČKAIT](https://profesis.ckait.cz/dokumenty-ckait/a-4-1/a-4-1-1/); [ČKAIT – O nás](https://www.ckait.cz/o-nas)
  - The two chambers act jointly on building-law policy (February 2026 memorandum). — [Zprávy ČKAIT](https://zpravy.ckait.cz/vydani/2026-02/spolecne-memorandum-ckait-a-cka-k-projednavane-novele-stavebniho-zakona-tisk-67-0/)
- **Typical-project catalogues and house-design portals**: projektovna.cz publishes "Co udělat před stavbou domu" for pre-build buyers (title only). — [Projektovna](https://www.projektovna.cz/blog/co-udelat-pred-stavbou-domu)
- **Municipalities**: municipalities commission "zastavovací studie" for localities. — [smlouvy.gov.cz](https://smlouvy.gov.cz/smlouva/soubor/25953847/CN%20ZS%20LK.pdf?backlink=6hqno). GEPRO's MISYS editions OBEC and MĚSTO show municipalities already buy GIS software. — [GEPRO ceník](https://www.gepro.cz/cenik/)
- **Sreality**: no report partnership found; results only showed older reports of Sreality's dispute with agencies over its terms. — [Hypoindex](https://www.hypoindex.cz/clanky/srealitycz-jsou-v-pasti-skonci-bez-realit/)

### Inferences
- **The B2B2C path is proven.** The leading automated vendor (NEMO) grew through a portal (Bezrealitky), a large franchise network (M&M) and a self-build portal (dum123). An architect-focused product could use the same pattern with ČKA/ČKAIT members, typical-project catalogues, house builders, Visidoo-type alert services and Reas-type lead generators.
- **Chambers are better at awareness than distribution.** ČKA's calculators and standards are where architects price the preparation phase, so being cited in or linked from ČKA calculator or standards materials, or offering a member discount, would reach the professional segment. No evidence was found that ČKA endorses commercial tools.
- **Two segments look open**:
  - Developers are served by Flat Zone for market data, but no developer-oriented automated plot-feasibility product was found.
  - Municipalities already buy zastavovací studie and GIS.

### Gaps
- **Mortgage brokers** (e.g. Hypoteční centrum, Golem, Swiss Life Select), **banks** (valuation departments, online estimators) and **prefab or house-builder companies** (e.g. RD Rýmařov and other suppliers of montované / dřevostavby): no data, because these searches did not run before the budget ran out. Their partnership models and volumes (houses a year) remain unknown.
- **Sreality's openness** to third-party report integrations is unknown.
- There is no evidence on **ČKA's policy** toward commercial partners or member benefits.
- **Slovak channels** (SKA, Nehnuteľnosti.sk / Topreality.sk portals, Slovak banks) were not researched.
