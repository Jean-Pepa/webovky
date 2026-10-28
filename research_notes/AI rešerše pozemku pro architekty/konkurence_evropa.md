# Evropská konkurence (mimo ČR a US/UK/AU): automatizovaná prověrka pozemku a „co se tu dá postavit“

> Metodická poznámka (28. 10. 2026): Po 19 vyhledáváních se vyčerpal sdílený limit WebSearch pro tento běh (200 dotazů na jeden turn pro všechny agenty dohromady). WebFetch byl v sandboxu blokovaný pro domény blog.ongeo.pl, pricehubble.com a scout24.com (síťový allowlist). Fakta níže proto pocházejí ze shrnutí výsledků vyhledávání s URL zdrojů, ne z plného přečtení stránek. U některých čísel nešlo ověřit, ze které konkrétní stránky pocházejí; je to u nich poznamenáno. Neověřené body ze sekcí NL, severské země, Pobaltí a ES/IT, ceníky Kel Foncier, Geoportal.gov.pl a vstup do ČR jsou v sekcích Gaps a jsou označené **NEOVĚŘENO**. Ve finální zprávě se nesmí uvádět jako fakt.

## 1. Polsko: onGeo.pl, „Landvanced“, Geoportal.gov.pl, reportovací služby nad daty o parcelách, AI „analiza działki“

### Takeaway
onGeo.pl je v Evropě nejbližší obdoba „reportu o pozemku na klik“. Nabízí modulární automatický „Raport o terenie“: MPZP, stavební povolení v okolí, sítě a půdy. Stojí zhruba 10–200 zł, jeden modul od 22 zł, a k tomu slevy a předplacené balíčky bodů. Cílí na kupce, makléře, architekty a investory. Firmu „Landvanced“ jsem nedohledal. Nenašel jsem ani žádný AI-nativní polský startup „analiza działki“, který by měl veřejně doloženou trakci.

### Cited Findings
**onGeo.pl (Raport o terenie)**
- onGeo provozuje společnost ONGEO A. ŁABAJ sp.k. — [aplikuj.pl](https://www.aplikuj.pl/pracodawca/126559/ongeo-a-labaj-sp-k/opinie)
- „Raport o terenie“ je online služba, která pozemek automaticky „diagnostikuje“. Obsahuje mj. miejscowe plany (MPZP) na pozemku a v okolí, rejstřík stavebních povolení v okolí, napojení na sítě (uzbrojenie terenu) a analýzu úrodnosti půdy. Placené reporty se liší rozsahem a cena závisí na počtu zvolených témat a na výměře pozemku — [onGeo blog: informacje o działce](https://blog.ongeo.pl/informacje-o-dzialce); [onGeo blog: co powinieneś wiedzieć o działce](https://blog.ongeo.pl/co-powinienes-wiedziec-o-dzialce)
- Když MPZP pokrývá pozemek jen částečně nebo pozemek leží na hranici několika plánů, report uvádí procentní a plošný podíl každého plánu — [onGeo blog: jak znaleźć MPZP dla działki](https://www.blog.ongeo.pl/jak-znalezc-mpzp-dla-dzialki)
- Ceník podle blogových příspěvků onGeo (vendor marketing, může být zastaralý):
  - cena podle zvolených dat cca 10–200 zł;
  - standardní cena jednoho modulu od 22 zł;
  - při výběru všech témat sleva 20 %;
  - doplněk „balíček GIS dat“ za 50 % ceny reportu;
  - dřívější podzimní akce −50 % na plný report;
  - předplacené „pakiety punktów“ pro levnější reporty.

  Zdroje: [onGeo blog: ile zaoszczędzisz zamawiając raport o terenie](https://blog.ongeo.pl/ile-zaoszczedzisz-zamawiajac-raport-o-terenie); [onGeo blog: pakiet punktów](https://www.blog.ongeo.pl/pakiet-punktow-na-koncie-ongeo-jak-placic-mniej-za-raporty); [onGeo blog: oszczędź 50 proc. na pełnym raporcie](https://www.blog.ongeo.pl/oszczedz-50-proc-na-pelnym-raporcie-o-terenie). Které číslo pochází z kterého příspěvku, nešlo ověřit, protože fetch byl blokovaný.
- Cílové segmenty podle obsahu blogu:
  - realitní makléři ([„Raport o terenie – narzędzie dla pośredników“](https://www.blog.ongeo.pl/raport-o-terenie-narzedzie-dla-posrednikow));
  - architekti ([„geoportal dla architektów“](https://blog.ongeo.pl/geoportal-dla-architektow));
  - investoři ([„ocena potencjału inwestycyjnego“](https://www.blog.ongeo.pl/ocena-potencjalu-inwestycyjnego));
  - realitní trh obecně ([„raport o terenie dla rynku nieruchomości“](https://www.blog.ongeo.pl/raport-o-terenie-dla-rynku-nieruchomosci)).
- Blog onGeo má i štítek „analiza chłonności“ (analýza kapacity a zastavitelnosti území) — [onGeo blog: tag analiza chłonności](https://blog.ongeo.pl/tag/analiza-chlonnosci?page=null)
- Další datové obsahy a produkty onGeo:
  - průměrné ceny pozemků ([średnie ceny działek](https://blog.ongeo.pl/srednie-ceny-dzialek));
  - mapa cen bytů ([mapa cen mieszkań](https://blog.ongeo.pl/mapa-cen-mieszkan));
  - report cen zemědělské půdy ([ceny gruntów rolnych – raport onGeo](https://www.blog.ongeo.pl/aktualne-ceny-gruntow-rolnych-raport-ongeo));
  - texty o Rejestru cen nieruchomości ([RCN](https://blog.ongeo.pl/rejestr-cen-nieruchomosci)).

**Další polští hráči kolem pozemků**
- Hectares vydal s portálem Otodom report „Nieruchomości gruntowe w Polsce 2025“ (PDF z prosince 2025). Co Hectares jako firma dělá, jsem neověřil — [Otodom/Hectares PDF](https://www.otodom.pl/wiadomosci/wp-content/uploads/2025/12/RAPORT_Hectares_Otodom_Nieruchomosci_gruntowe_w_Polsce_2025_v1.pdf)
- GruntGuru publikuje analýzy trhu s pozemky, např. rezidenční investice v Krakově — [gruntguru.pl](https://www.gruntguru.pl/publikacje/inwestycje-mieszkaniowe-w-krakowie-stan-obecny-i-perspektywy)
- PewnyLokal vydává příručku „audyt działki“ (prověrka pozemku) — [poradnik audyt działki (PDF)](https://static.pewnylokal.pl/poradnik_audyt_dzialki.pdf)

### Inferences
- onGeo je princip „GIS overlay + PDF“, ne AI-nativní produkt. Cenotvorba po modulech, podle výměry, přes body a s opakovanými akcemi −50 % ukazuje na nízkou ochotu B2C zákazníků platit. Zároveň firma tlačí na opakované B2B uživatele (makléře).
- Orientační přepočet: 10–200 zł je zhruba 2–47 EUR, tedy cca 57–1 150 Kč (kurz ~5,7 Kč/PLN). To je rozumný cenový strop pro B2C variantu v ČR.
- Mezera na polském trhu: interpretace textu MPZP (parametry zástavby) a automatický výpočet kapacity (chłonność). onGeo téma zná, ale nenašel jsem doklad, že by výpočet byl automatizovaný nebo dělaný přes AI.

### Gaps
- „Landvanced“: dvě vyhledávání (s doplňujícími slovy i v uvozovkách) nevrátila žádnou firmu tohoto jména. Může jít o překlep nebo jiný název.
- Objemy onGeo (počet reportů, uživatelů), tržby, rok založení, sídlo a financování jsem nenašel. Stránka blog.ongeo.pl/o-nas existuje, ale fetch byl blokovaný.
- Geoportal.gov.pl jsem v této session neověřil kvůli limitu. **NEOVĚŘENO** z předchozích znalostí:
  - provozuje ho GUGiK;
  - služba KIMPZP agreguje miejscowe plany;
  - reforma plánování z roku 2023 zavádí „plan ogólny gminy“ s termínem kolem roku 2026 a digitální „Rejestr urbanistyczny“.

  Termíny je potřeba ověřit.
- Reportovací služby nad e-mapa.net, geoportal360 a ULDK jsem neověřil, cílené hledání se nestihlo.
- AI startupy „analiza działki“: dotaz „analiza działki AI raport MPZP startup“ vracel hlavně onGeo, žádný AI startup se neobjevil.
- Ceny a modely Hectares, GruntGuru a PewnyLokal neznám.

## 2. Slovensko: automatické reporty o parcele nad ZBGIS / Katastrálnym portálom, startupy

### Takeaway
Nenašel jsem žádnou soukromou službu, která by automaticky generovala report o parcele nad ZBGIS nebo Katastrálnym portálom, ani relevantní startup. Veřejné nástroje umí vyhledat parcelu, zobrazit detail, přibližně měřit a vytvořit informativní kopii katastrální mapy. Pro český produkt je to pravděpodobně nejsnazší exportní trh, ale malý.

### Cited Findings
- Co umí mapový klient ZBGIS:
  - vyhledá pozemek podle katastrálního území a parcelního čísla, čísla LV nebo súpisného čísla;
  - po kliknutí na parcelu zobrazí detail;
  - funkce „Meranie“ je jen přibližná (na celé metry) a nehodí se pro hraniční spory;
  - umí vytvořit informativní kopii z katastrální mapy;
  - vlastnické vztahy a právní stav jsou na katastrálním portálu skgeodesy.sk.

  Zdroje: [ddadsstornala.sk – ZBGIS a Katastrálny portál](https://ddadsstornala.sk/aktuality/zbgis-katastralny-portal/); [ddadsstornala.sk – informatívna kópia](https://ddadsstornala.sk/aktuality/informativna-kopia-z-mapy-vytvorena-cez-katastralny-portal/); [slovensko.sk – mapový klient](https://www.slovensko.sk/sk/zivotne-situacie/zivotna-situacia/_mapovy-klient/). Pozor: ddadsstornala.sk je málo spolehlivý, patrně AI-generovaný web. Jediný oficiální zdroj je slovensko.sk, a z něj se zobrazil jen krátký úryvek.

### Inferences
- Slovensko má podobnou datovou výchozí pozici jako ČR: katastr a mapový klient, bez soukromé nadstavby typu „co se tu dá postavit“. Je tam tedy volné místo na trhu. Český produkt by na Slovensko mohl expandovat levně díky jazykové blízkosti a podobnému katastrálnímu dědictví. Napřed je ale potřeba zmapovat nové slovenské stavební právo.

### Gaps
- Automatický report: dotaz „ZBGIS kataster automatický report pozemku služba“ nevrátil žádnou takovou službu, jen návody.
- Slovenské startupy a proptech: druhé cílené hledání se kvůli limitu neuskutečnilo.
- **NEOVĚŘENO**: nový zákon o územním plánování (č. 200/2022 Z. z., účinný od 1. 4. 2024) a nový stavební zákon (č. 25/2025 Z. z., od 1. 4. 2025) s informačním systémem územního plánování a výstavby. Je třeba ověřit, zda tím vzniká veřejný „one-stop shop“ srovnatelný s ÖREB.
- Podmínky API a strojového přístupu k datům ÚGKK SR a ceny výpisů jsem neověřil.

## 3. Německo a Rakousko: GeoMap, on-geo, Sprengnetter, 21st Real Estate, PriceHubble DACH, XPlanung, AI pro stavební povolení

### Takeaway
V DACH dominují B2B datové a oceňovací platformy pro banky, znalce a portály: on-geo (Tinsa), Sprengnetter (Scout24) včetně 21st Real Estate, PriceHubble a GeoMap. Specializované nástroje „co se tu dá postavit“ tu převládající nejsou a trh se silně konsoliduje. AI analýza B-Planů (GRZ/GFZ apod.) přichází hlavně od poradenských a menších hráčů. Veřejná AI v povolování je zatím jen kontrola úplnosti podání (Durynsko od 2025, Vídeň BRISE 2019–2023).

### Cited Findings
**GeoMap (Lipsko)**
- GeoMap je online databáze pro profesionální rešerši německého realitního trhu, zaměřená na rezidenční nemovitosti k prodeji a pronájmu. Cena je na vyžádání, k dispozici je 3denní trial bez platebních údajů (stav listingu k 3/2025) — [OMR Reviews – GeoMap pricing](https://omr.com/en/reviews/product/geomap/pricing); [OMR Reviews DE](https://omr.com/de/reviews/product/geomap); [builtworld – GeoMap](https://builtworld.com/company/geomap)
- Tisková zpráva z roku 2020 popisuje asistenta, do kterého uživatel nahraje vlastní data o nemovitostech a porovná je s tržními daty. Přiřazení k URL je podle shrnutí vyhledávače — [konii.de](https://www.konii.de/?p=61908)

**on-geo GmbH**
- Tinsa převzala on-geo GmbH, „vedoucího poskytovatele softwaru pro oceňování nemovitostí v Německu“ (zpráva z 6. 6. 2019) — [konii.de](https://www.konii.de/?p=57951)
- Historie: kolem roku 2009 vznikl JV „Hypoport on-geo GmbH“. Platforma LORA je základem full-service oceňování. Banky přes ni vedle zástavní hodnoty určí i pojistnou hodnotu a pojištěnou obytnou plochu a předají je rovnou pojišťovacímu partnerovi — [hypoport.de](https://hypoport.de/?p=1007); [hypoport.de](https://hypoport.de/?p=5462)
- Produkty: geoport, STmate, AVM, LORA value indication — [ensun.io](https://ensun.io/company/on-geo-649c361d2298c0295dc51fca); [craft.co](https://craft.co/on-geo)
- Trakce: přes datový shop geoport se měsíčně stáhne cca 160 000 tržních a geodatových záznamů (tisková zpráva bulwiengesa a on-geo, 2025) — [bulwiengesa PM 2025 (PDF)](https://live.bulwiengesa.de/sites/default/files/2025-04/pm_bulwiengesa_ongeo_2025_final_neu.pdf)
- AI:
  - partnerství se smartextract na AI zpracování dokumentů (2025) — [on-geo.de](https://www.on-geo.de/en/news/data/partnership-smartextractai-and-on-geo);
  - AI funkce pro zkrácené posudky, která je zrychluje o 70 % (konii, 15. 6. 2026) — [konii.de – tag on-geo](https://www.konii.de/news/tag/on-geo/).
- Zákazníci a partneři:
  - klient LBBW (case study) — [on-geo.de](https://www.on-geo.de/en/campus/software/success-stories-interview-with-gabriele-auge-lbbw);
  - kooperace se Skendata v oceňování — [cash-online](https://www.cash-online.de/a/on-geo-und-skendata-kooperieren-in-der-immobilienbewertung-552065/);
  - kooperace s fino na dokumentech k reformě Grundsteuer (2022) — [konii.de](https://www.konii.de/news/on-geo-und-fino-kooperieren-fur-eine-schnellere-bereitstellung-notwendiger-dokumente-im-zuge-der-grundsteuerreform-202210133429/).

**Sprengnetter / 21st Real Estate / Scout24**
- Scout24 převzala skupinu Sprengnetter, „vedoucího poskytovatele realitních dat a ocenění v Německu“. Sprengnetter se zjednodušení a digitalizaci oceňování věnuje od roku 1978 — [Scout24](https://www.scout24.com/en/news-media/news/detail/scout24-uebernimmt-sprengnetter-gruppe-einen-fuehrenden-anbieter-von-immobiliendaten-und-bewertungen-in-deutschland); [onlinemarketplaces.com](https://www.onlinemarketplaces.com/?p=100262)
- Sprengnetter, už jako dceřiná firma Scout24, koupil berlínskou 21st Real Estate za nezveřejněnou částku (leden 2024, podle agregátoru uzavřeno 2. 1.).
  - 21st nabízí cenové a lokační analýzy rezidenčních i komerčních nemovitostí.
  - Firma se do Sprengnetteru začleňuje postupně.
  - CEO Heike Gündling ve vedení pokračuje.

  Zdroje: [onlinemarketplaces.com](https://www.onlinemarketplaces.com/?p=101950); [konii.de – tag 21st Real Estate](https://www.konii.de/news/tag/21st-real-estate/); [Dealroom – Sprengnetter](https://app.dealroom.co/companies/sprengnetter)
- Jan Sprengnetter je od roku 2025 členem představenstva bulwiengesa AG. bulwiengesa ve stejném roce vydala tiskovou zprávu s on-geo — [bulwiengesa](https://bulwiengesa.de/en/about-us/jan-sprengnetter)

**PriceHubble (Curych, DACH)**
- Series B 34 mil. USD (červenec 2021), CEO Julien Schillewaert — [PriceHubble blog](https://www.pricehubble.com/uk/blog/pricehubble-ceo-julien-schillewaert-b-round/); [Kyodo PR Wire](https://kyodonewsprwire.jp/index.php/release/202107197865); [Seedtable](https://seedtable.com/startups/PriceHubble-8AX3EPX)
- Podle CB Insights získal celkem 42,39 mil. USD v 10 kolech. Poslední kolo je ze září 2024 a je označené jako „accelerator“ (neověřeno) — [CB Insights](https://www.cbinsights.com/company/pricehubble/financials)
- Akvizice:
  - Realtify (6/2021, podle výpisu agregátoru);
  - Dataloft a WhenFresh (UK);
  - Urbanease (FR, 11/2023), podle PriceHubble šestá akvizice.

  Zdroje: [CB Insights](https://www.cbinsights.com/company/pricehubble/financials); [startupticker.ch](https://startupticker.ch/en/news/a-further-acquisition-bolters-pricehubble-s-european-foothold)

**AI nad B-Plany a analýza pozemku (menší a poradenští hráči)**
- ki-syndikat.de popisuje AI, která vyhodnocuje závazné prvky B-Planu (GRZ, GFZ, Traufhöhe, Baugrenzen) a odvozuje z nich maximální objem zástavby a scénáře dohuštění. Grundbuch, služebnosti (Dienstbarkeiten) a ekologické zátěže (Altlasten) výslovně uvádí jako ruční práci, kterou AI nepřebírá. U skenovaných plánů AI neověří, zda sedí měřítko, a každé tvrzení o regulativech je nutné zkontrolovat proti originálu — [ki-syndikat: Grundstücksanalyse](https://www.ki-syndikat.de/usecases/architektur/03-grundstuecksanalyse/); [ki-syndikat: Baugenehmigungsunterlagen](https://www.ki-syndikat.de/usecases/architektur/01-baugenehmigungsunterlagen/)
- Cenová kotva: jeden z poskytovatelů ve výsledcích uvádí potenciálovou analýzu (GRZ/GFZ vs. B-Plan) „od 350 € za pozemek“. Pravděpodobně jde o [ki-syndikat](https://www.ki-syndikat.de/usecases/architektur/03-grundstuecksanalyse/), případně o [MTR Legal wiki](https://www.mtrlegal.com/wiki/bebaubarkeit/); přesné přiřazení je nejisté a pochází ze shrnutí vyhledávače.
- „Land Atlas“: služba, která pro každý pozemek automaticky analyzuje kvalitu půdy a povodňové riziko. Původ a země nejsou ověřené — [zeli.app](https://zeli.app/de/story/48891334)
- Kolín nad Rýnem publikuje své Bebauungspläne jako otevřená data — [open.nrw](https://prod.ckan259.open.nrw.de/sl/dataset/bebauungsplane-koln-bauungsplane-k)

**Veřejný sektor: digitální Bauantrag a AI pro stavební povolení**
- Durynsko: okresy Greiz a Saalfeld-Rudolstadt od podzimu 2025 testují AI při kontrole žádostí o stavební povolení. Pilot se jmenuje „Automatisierte Entscheidungsunterstützung in kommunalen Baugenehmigungsverfahren“.
  - AI kontroluje úplnost podkladů a konzistenci dat.
  - Dalším krokem má být určení druhu řízení.
  - Ostrý provoz závisí na napojení na digitální Bauantrag, které Durynsko plánuje do roku 2027.

  Zdroj: [kommunal.de](https://kommunal.de/ki-prueft-bauantraege-thueringen)
- Kiel spustil v září 2025 online portál pro žádosti o stavební povolení. Bauaufsicht a další dotčené orgány v něm zpracovávají podklady souběžně. Požární ochrana a statika jdou přes samostatný portál ELBA — [AIK-SH (PDF)](https://www.aik-sh.de/wp-content/uploads/2025/09/LH-Kiel_Bauantrag-digital.pdf)

**Rakousko**
- BRISE-Vienna je výzkumný projekt Města Vídně financovaný EU, který navázal na digitální podání v PDF.
  - Cílem je stavební povolení na bázi openBIM.
  - Začal v 9/2019 a trval zhruba 3 roky, do začátku roku 2023.
  - Kombinuje BIM, AI a AR. AI má automaticky kontrolovat plausibilitu, správnost a úplnost podání.
  - Vedoucí projektu za město uvedl, že „povolení stisknutím tlačítka“ nebude, protože stavební právo je příliš složité.
  - AI funguje jen nad strukturovaným (BIM) podáním.
  - ORF očekával ostrý provoz v letech 2024/2025.

  Zdroje: [TU Wien – BRISE-Vienna 1 (dokončené projekty)](https://www.tuwien.at/en/cee/ibb/zdb/research/completed-research-projects/brise-vienna-1); [ORF Wien](https://wien.orf.at/stories/3153084/); [BRISE Vienna Management Summary (PDF)](https://digitales.wien.gv.at/wp-content/uploads/sites/47/2021/07/BRISE_Vienna_Management_Summary.pdf); [Jarolim, Austrian Standards 2020 (PDF)](https://cdn.austrian-standards.at/asset/dokumente/Themengebiete/Bau%20%26%20Immobilien/jahrestagung-bau/2020/5_Jahrestagung_Bau_2020_Jarolim.pdf)
- TU Wien vede kromě dokončeného „BRISE-Vienna 1“ i stránku „BRISE-Vienna“ mezi probíhajícími projekty, což naznačuje navazující fázi — [TU Wien – ongoing](https://tuwien.at/en/cee/ibb/zdb/research/ongoing-research-projects/brise-vienna); [TU Wien news](https://www.tuwien.at/alle-news/news/schnellere-bauverfahren-durch-digitalisierung)

### Inferences
- Peníze v DACH tečou hlavně do B2B dat a oceňování pro banky (zástavní hodnota, AVM) a do portálů. Nástroje „co se tu dá postavit“ jsou okrajové: buď poradenské (ki-syndikat), nebo funkce větších platforem. Pro český startup z toho plyne, že banky a znalci (přes API) jsou přirozený druhý segment vedle architektů a developerů.
- Typickou exitovou cestou je akvizice datovým či oceňovacím hráčem nebo portálem: Tinsa koupila on-geo, Scout24 Sprengnetter a Sprengnetter 21st Real Estate.
- Veřejná AI v povolování kontroluje úplnost podání, nerozhoduje. Soukromý prostor je proto v přípravě podkladů a předběžné prověrce na straně architekta a stavebníka a v napojení na digitální podání.
- BRISE i ki-syndikat ukazují, že bez strukturovaných dat (BIM, strojově čitelné plány) AI nefunguje spolehlivě. Kvalita a strukturovanost zdrojových dat bude hlavním rizikem i v ČR.

### Gaps
- Služby typu „Grundstücks-check“ nebo „Bauland-check“ (konkrétní značky a ceny) jsem neověřil, cílené hledání se kvůli limitu neuskutečnilo.
- XPlanung (**NEOVĚŘENO**): jde o povinný standard pro výměnu územních plánů s přechodným obdobím do roku 2023 a existují nad ním veřejné platformy (např. DiPlanung). Konkrétní soukromé služby nad XPlanung jsem nenašel.
- Digitální Bauantrag (EfA služba, standard XBau) a další AI piloty (Bavorsko, Hamburk) jsem neověřil.
- Nenalezeno:
  - ceník GeoMap;
  - tržby on-geo a jeho současné vlastnictví (zda je stále pod Tinsou);
  - kupní cena a přesné datum převzetí Sprengnetteru Scout24 (podle pořadí článků na onlinemarketplaces pravděpodobně 2. pol. 2023);
  - tržby PriceHubble a jeho klienti v DACH.
- Rakouští soukromí hráči a AI piloty v dalších spolkových zemích nejsou ověřeni. Ve výsledcích se objevil PDF „Lageexposé“ na asset.dibeo.at, poskytovatel i míra automatizace jsou neznámé.

## 4. Švýcarsko: ÖREB-Kataster, Archilyse, Nomoko, Wüest Partner, PriceHubble, startupy pro stavební práva a proveditelnost

### Takeaway
Švýcarsko má nejvyspělejší veřejný „one-stop shop“. ÖREB-Kataster dává ke každé parcele standardizovaný výpis právně závazných veřejnoprávních omezení: územní plán, hluk, ochrana vod, kontaminace, les a další (v kantonu Basel-Landschaft 19 témat). Výpis je dynamický i v PDF, v Basel-Stadt zdarma. Soukromí hráči nad tím stavějí:
- výpočty a vyhledávání potenciálu: Popety.io s AI, PORT, kalkulačka v projektu Raiffeisen „RAUMPIONIERE“;
- digitální dvojčata a analytiku: Nomoko, Archilyse;
- oceňování: PriceHubble.

Financování je spíše skromné: Archilyse získal kolo A ve výši 4 mil. CHF.

### Cited Findings
**ÖREB-Kataster (veřejný one-stop shop)**
- ÖREB-Kataster ukazuje, jaké užívací podmínky platí pro konkrétní pozemek. Omezení (ÖREB) jsou pro vlastníky závazná. Katastr obsahuje spolehlivé informace o pravomocných omezeních a zpřístupňuje je veřejnosti — [Kanton Solothurn](https://so.ch/services/auszug-aus-dem-kataster-der-oeffentlich-rechtliche-eigentumsbeschraenkungen-beziehen/); [Kanton Zürich – návod](https://www.zh.ch/de/planen-bauen/geoinformation/kataster/oeffentlich-rechtliche-eigentumsbeschraenkungs-kataster/anleitung-oereb-kataster-auszug.html); [swisstopo – brožura (PDF)](https://www.swisstopo.admin.ch/dam/de/sd-web/MAKEWsBCZela/Broschuere-OEREB-Kataster-DE.pdf)
- Výpis se získá přes kantonální geoportály podle čísla pozemku, adresy nebo souřadnic. Kantony rozlišují dynamický online výpis a statický PDF výpis; statický má pro každé omezení samostatnou stranu s plánem a legendou — [Kanton Aargau – uživatelská příručka (PDF)](https://www.ag.ch/media/kanton-aargau/dvi/dokumente/arp/vermessungsamt/oerebk/benutzeranleitung-oereb-kataster.pdf); [Kanton Zürich](https://www.zh.ch/de/planen-bauen/geoinformation/kataster/oeffentlich-rechtliche-eigentumsbeschraenkungs-kataster/anleitung-oereb-kataster-auszug.html)
- Příkladový výpis z kantonu Uri je členěný podle témat, např. obecní územní plánování, ochranná pásma vod a stupně citlivosti na hluk. Uvádí i témata, která se pozemku netýkají. Další omezení mohou být poznamenaná v pozemkové knize (Grundbuch). Ve výsledcích se objevil výpis jako příloha inzerátu na Homegate; že jde přesně o tento výpis, je pravděpodobné, ne ověřené — [Homegate – dokument k inzerátu (PDF)](https://media2.homegate.ch/listings/v2/hgonif/4003261261/document/2f289629ee8b11162fd0099a4e28bed1.pdf)
- Kanton Basel-Landschaft uvádí, že katastr aktuálně vede 19 různých ÖREB — [Basel-Landschaft](https://www.baselland.ch/politik-und-behorden/direktionen/volkswirtschafts-und-gesundheitsdirektion/medienmitteilungen/der-oereb-kataster-ein-digitales-angebot-des-amtes-fuer-geoinformation)
- Další kantony:
  - Basel-Stadt v roce 2020: „nový a bezplatný přístup k informacím o pozemcích“ — [bs.ch](https://www.bs.ch/medienmitteilungen/bvd/2020-neuer-und-kostenloser-zugang-zu-grundstuecksinformationen);
  - Freiburg: k ÖREB katastru „několika kliky“ — [fr.ch](https://www.fr.ch/de/raum-planung-und-bau/karten-plaene-kataster-und-geomatik/ab-sofort-mit-wenigen-klicks-zum-oereb-kataster-des-kantons-freiburg).
- Lichtenštejnsko (stejný model): když katastr odporuje pravomocným rozhodnutím o omezení, mají přednost rozhodnutí. Katastr je tedy informativní, ne konstitutivní — [gesetze.li](https://www.gesetze.li/konso/pdf/2018081000?version=4)

**Soukromí hráči: potenciál parcely a stavební práva**
- Popety.io (Ženeva, založen 2019) kombinuje agregovaná data s AI a hledá parcely s potenciálem. Kde data chybí, AI odhadne vhodnost parcely. Institucionálním investorem je pojišťovna Vaudoise — [Moneycab](https://www.moneycab.com/dossiers/popety-io-beschleunigt-planung-von-bauvorhaben/amp/)
- PORT je platforma, která spojuje zonální plán, Ausnützungsziffer a tržní ceny pro rozhodování o nemovitostech. Podle shrnutí vyhledávače pochází z článku Bilanz — [Bilanz](https://www.bilanz.ch/unternehmen/was-ein-grundstueck-wert-ist-und-was-es-wirklich-kann/vbh3qh8)
- Projekt Raiffeisen „RAUMPIONIERE“ zmiňuje kalkulačku potenciálu pro fond budov, bez detailů — [Raiffeisen](https://www.raiffeisen.ch/rch/de/wissen/wohnen/interview-raumpioniere.html)
- Makléř Properti publikuje „Potenzialanalyse“ (04/2024) — [Properti (PDF)](https://properti.com/ch/wp-content/uploads/assets/insights/2404_Potenzialanalyse.pdf)
- Princip výpočtu: maximální hrubá podlažní plocha (Bruttogeschossfläche) = plocha pozemku × maximální Ausnützungsziffer. Od plochy pozemku se odečítá plocha potřebná pro dopravní napojení. Některé obce používají jiné ukazatele, např. Überbauungs- a Freiflächenziffer (Unteriberg, Einsiedeln), takže výpočet musí znát pravidla konkrétní obce a kantonu — [Kanton Schwyz (PDF)](https://sz.ch/public/upload/assets/6882/I_Ausnuetzungsziffer.pdf?fp=1); [neho.ch](https://neho.ch/de/blog/ausnutzungsziffer); [comparis](https://www.comparis.ch/immobilien/verkaufen/vertragsabschlussphase/ausnuetzungsziffer)
- Bakalářská práce FHNW z roku 2025 (obor geomatika) se věnuje tématu „Nutzungsziffern“ — [FHNW (PDF)](https://www.fhnw.ch/++api++/de/studium/architektur-bau-geomatik/bachelor-studiengang-geomatik/bachelor-thesis-2025/bth21_youssef_shamoun_nutzungsziffern.pdf/@@inline-file/file)

**Archilyse, Nomoko, PriceHubble**
- Archilyse (Curych):
  - kolo A 4 mil. CHF, první closing 3 mil. CHF v únoru 2020;
  - vedla ho PropTech1 Ventures, spoluvedoucí byli SIX FinTech Ventures a Swiss Immo Lab;
  - předtím 1,2 mil. CHF v letech 2017 a 2018;
  - investovala i Ringier Digital Ventures;
  - celkem cca 4,3 mil. USD, poslední zaznamenané kolo z roku 2020;
  - CEO Matthias Standfest;
  - PropTech1 ho nazývá „švýcarským nožem pro analýzu realitních dat“.

  Zdroje: [startupticker](https://startupticker.ch/en/news/archilyse-raises-chf-4-million); [EQS / PropTech1](https://eqs-news.com/news/corporate/proptech1-ventures-invests-in-archilyse-the-swiss-army-knife-for-real-estate-data-analysis/1108483); [Ringier](https://www.ringier.com/ringier-digital-ventures-invests-in-swiss-proptech-start-up-archilyse/); [CB Insights](https://www.cbinsights.com/company/archilyse/financials); [Latka](https://getlatka.com/companies/archilyse-ag)
- Nomoko (sídlo Curych, pobočky Lucemburk a Madrid) staví platformu digitálního dvojčete pro data o nemovitostech — [builtworld](https://www.builtworld.com/company/nomoko)
- PriceHubble: viz sekce 3 (financování, akvizice) a sekce 5 (Urbanease).
- Kanton Curych: dokument vlády z roku 2025 zmiňuje potenciál AI a automatizace ve stavebním řízení, bez konkrétního pilotu. Ze tří PDF ve výsledcích není jisté, o který přesně jde — [Kantonsrat ZH (PDF)](https://parlzhcdws.cmicloud.ch/parlzh5/cdws//Files/8e6ebcb5d0fd499da7faab2e1679dce1-332/1/pdf)

### Inferences
- ÖREB je vzor veřejné služby, která z agregace dat dělá bezplatnou komoditu. Hodnota soukromých hráčů se pak přesouvá do výpočtu (Ausnützungsziffer → podlažní plocha a objem), do tržních dat, do AI hodnocení potenciálu a do vyhledávání parcel (Popety). Kde podobný veřejný výpis chybí, je samotná agregace obhajitelná hodnota. Ohrožuje ji ale možnost, že stát podobnou službu později spustí zdarma.
- Mezi investory jsou pojišťovny a finanční instituce (Vaudoise, SIX FinTech Ventures; Raiffeisen má vlastní projekt). To potvrzuje, že finanční sektor je přirozený kupec nebo partner.
- Skromná kola (Archilyse kolem 4 mil. CHF) naznačují úzký trh s omezenou škálou v rámci jedné země. Firmy pak potřebují víc zemí nebo B2B datový model.

### Gaps
- Wüest Partner (produkty, ceny, AI) jsem neověřil, cílené hledání se nestihlo.
- Nomoko: financování a stav v letech 2023–2026 (případná insolvence) jsem nenašel.
- Popety.io: ceník, zákazníci a objem jsou neznámé.
- ÖREB: statistiky používání, národní webová služba nebo API a poplatky v jednotlivých kantonech jsem neověřil. Ověřené je jen „zdarma“ v Basel-Stadt od roku 2020.
- Další švýcarské startupy pro výpočet stavebních práv a studie proveditelnosti jsem kvůli limitu nehledal.

## 5. Francie: Kel Foncier, Urbanease, Géoportail de l'urbanisme, další SaaS pro „prospection foncière“

### Takeaway
Francie má nejrozvinutější trh SaaS pro „prospection foncière“ developerů.
- **Urbanease** (založen 2018/2019, CEO Valentin Peersman) koupil v listopadu 2023 PriceHubble, který ho už integroval.
- **Kel Foncier** se prezentuje jako největší pozemková databáze ve Francii. Hledá pozemky s vysokým stavebním potenciálem a identifikuje vlastníky. Nabízí 5denní zkušební verzi a mobilní aplikaci.

Ceny ani počty zákazníků se ověřit nepodařilo.

### Cited Findings
- PriceHubble koupil Urbanease (oznámeno v 11/2023):
  - PriceHubble ho popisuje jako lídra v řešeních pro „land sourcing“ a data územního plánování;
  - jde o francouzskou B2B SaaS s analytickými a prospekčními nástroji pro realitní profesionály;
  - zakladatel a CEO je Valentin Peersman;
  - cílem akvizice jsou hyperlokální data a kvalitativní analýza pozemků;
  - podle PriceHubble jde o jeho šestou akvizici, po britských Dataloft a WhenFresh.

  Zdroje: [PriceHubble](https://www.pricehubble.com/en/pricehubble-news/pricehubble-acquires-urbanease); [Insurance Edge](https://insurance-edge.net/2023/11/06/deals-pricehubble-buys-data-analaytics-company-urbanease/); [startupticker](https://startupticker.ch/en/news/a-further-acquisition-bolters-pricehubble-s-european-foothold); [PropTechBuzz](https://www.proptechbuzz.com/news/pricehubble-expands-presence-with-urbanease-acquisition-reinforcing-growth-in-france-and-europe)
- PriceHubble při transakci radila kancelář Fidal (právní a daňové aspekty) — [Fidal](https://fidal.com/en/node/14376)
- Rok založení Urbanease se ve zdrojích liší: 2019 podle PriceHubble, 2018 podle CB Insights — [PriceHubble](https://www.pricehubble.com/en/pricehubble-news/pricehubble-acquires-urbanease); [CB Insights](https://www.cbinsights.com/company/urbanease)
- PriceHubble oznámil dokončení integrace Urbanease. Jako zákaznické reference uvádí Urbatys a „Mon analyse foncière“ — [PriceHubble FR – integrace dokončena](https://www.pricehubble.com/fr/pricehubble-news/urbanease-integration-complete); [reference Urbatys](https://www.pricehubble.com/fr/ebooks-webinars-cas-clients/urbatys); [reference Mon analyse foncière](https://www.pricehubble.com/fr/ebooks-webinars-cas-clients/mon-analyse-fonciere)
- Kel Foncier se popisuje jako „největší databáze o pozemcích ve Francii“. Umožňuje najít pozemky s vysokým stavebním potenciálem, identifikovat vlastníky a připravit developerský projekt. Nabízí 5denní bezplatný test (kelfoncier.com/test-gratuit) a aplikaci pro iOS — [Motherbase](https://beta.motherbase.ai/startup/8623-kel-foncier/); [App Store](https://apps.apple.com/us/app/id1495257814)
- Géofoncier je portál profesní komory zeměměřičů (Ordre des géomètres-experts) — [Géofoncier CGU (PDF)](https://public.geofoncier.fr/ressources/CGU/CGU_GEOFONCIER_PORTAIL.pdf)
- Signál poptávky: developeři nabírají pozice „prospecteur foncier“ a „chargé(e) de prospection et négociation foncière“ (inzeráty 2026). Je tedy jasné, kdo je kupcem prospekčních nástrojů — [France Travail](https://candidat.francetravail.fr/offres/recherche/detail/191KBFB); [Michael Page](https://www.michaelpage.fr/job-detail/prospecteur-foncier-fh/ref/jn-042026-6989351)

### Inferences
- Francouzský model je developerský SaaS pro sourcing pozemků: najít parcelu s potenciálem, spočítat potenciál, dohledat vlastníka a oslovit ho. Peníze nese opakované předplatné prospekčního týmu, ne jednorázový report.
- Urbanease ukazuje exit přes panevropskou datovou platformu. PriceHubble tím získal modul pro práci s pozemky, který může přenášet do dalších zemí, potenciálně i do CEE.

### Gaps
- Ceníky Kel Foncier a Urbanease, počty klientů, tržby a cenu akvizice jsem nenašel. Dotaz na ceník Kel Foncier vrátil nerelevantní výsledky a fetch pricehubble.com byl blokovaný.
- Géoportail de l'urbanisme (GPU), **NEOVĚŘENO**:
  - od roku 2023 je zveřejnění PLU na GPU podmínkou jeho vykonatelnosti;
  - pokrytí obcí;
  - API (API Carto).

  Vše je potřeba ověřit.
- Další francouzské SaaS pro „prospection foncière“ (jména, ceny) jsem kvůli limitu nehledal.

## 6. Ostatní významní hráči: Nizozemsko (DSO), severské země, Pobaltí, Španělsko/Itálie (a Rumunsko)

### Takeaway
Tuto část se kvůli vyčerpanému limitu vyhledávání nepodařilo ověřit. Jediný ověřený nález je rumunská iO Partners, která v 11/2025 spustila AI výběr pozemků. Vodítka z předchozích znalostí jsou v Gaps a jsou neověřená.

### Cited Findings
- Poradenská firma iO Partners spustila v listopadu 2025 „AI-powered land selection solution“ (podle rumunského Business Forum) — [Business Forum](https://www.businessforum.ro/real-estate/20251103/io-partners-launches-ai-powered-land-selection-solution-2495)

### Inferences
- I ve střední a východní Evropě (Rumunsko) se objevují AI nástroje pro výběr pozemků, a to od poradenských firem jako kombinace služby a nástroje. Regionální trh CEE se otevírá, ale zatím na něm není dominantní produktový hráč.

### Gaps
- Všechny body níže jsou **NEOVĚŘENO** z předchozích znalostí a je potřeba je ověřit před použitím.
- Nizozemsko:
  - Omgevingswet platí od 1. 1. 2024;
  - Digitaal Stelsel Omgevingswet (DSO) zahrnuje Omgevingsloket s funkcemi „Regels op de kaart“ a „Vergunningcheck“;
  - na začátku byly hlášené problémy se spolehlivostí.
- Norsko: Autodesk koupil Spacemaker (Oslo) koncem roku 2020 za zhruba 240 mil. USD a přejmenoval ho na Autodesk Forma (2023). Aktuální ceník Forma je třeba ověřit.
- Švédsko: u Finch3D (generativní návrh dispozic) jsem neověřil financování. U „Hektar“ jsem nedokázal ověřit, o jakou firmu jde.
- Dánsko: Plandata.dk je národní registr plánů (lokalplaner, kommuneplaner); rozsah a API jsem neověřil.
- Estonsko: e-ehitis (registr staveb a elektronická povolení) a piloty kontroly povolení přes BIM/AI.
- Finsko (Lupapiste, Ryhti) nebylo v zadání, ale může být relevantní.
- Startupy nad katastrem ve Španělsku (Catastro) a v Itálii (Catasto) jsem nezkoumal.

## 7. Vstup do ČR, udržitelné obchodní modely a co si z toho vzít pro český startup

### Takeaway
Nenašel jsem důkaz, že by některý z profilovaných hráčů vstoupil na český trh nebo vstup ohlásil. Cílené hledání se ale kvůli limitu neuskutečnilo.

Napříč trhy vycházejí jako nejudržitelnější dva B2B modely:
- data a API pro banky, znalce a pojišťovny (on-geo, Sprengnetter, PriceHubble);
- developerský SaaS pro sourcing pozemků (Urbanease, Kel Foncier).

B2C report za jednotlivý pozemek (onGeo, 10–200 zł) je levný, závislý na akcích a slouží spíš jako akviziční kanál. Trh se konsoliduje přes akvizice, což je pro český startup realistická exitová cesta.

### Cited Findings
- Konsolidace trhu:
  - Tinsa → on-geo (2019) — [konii.de](https://www.konii.de/?p=57951);
  - Scout24 → Sprengnetter — [Scout24](https://www.scout24.com/en/news-media/news/detail/scout24-uebernimmt-sprengnetter-gruppe-einen-fuehrenden-anbieter-von-immobiliendaten-und-bewertungen-in-deutschland);
  - Sprengnetter → 21st Real Estate (01/2024) — [onlinemarketplaces.com](https://www.onlinemarketplaces.com/?p=101950);
  - PriceHubble → Urbanease (11/2023, šestá akvizice PriceHubble) — [startupticker](https://startupticker.ch/en/news/a-further-acquisition-bolters-pricehubble-s-european-foothold).
- Objem v B2B:
  - přes on-geo geoport se měsíčně stáhne ~160 000 datových záznamů — [bulwiengesa PM 2025](https://live.bulwiengesa.de/sites/default/files/2025-04/pm_bulwiengesa_ongeo_2025_final_neu.pdf);
  - LORA předává pojistnou hodnotu z bankovního ocenění rovnou pojišťovně — [hypoport.de](https://hypoport.de/?p=5462).
- Cenová hladina B2C: onGeo 10–200 zł, modul od 22 zł, slevy 20–50 %, balíčky bodů — [onGeo blog](https://www.blog.ongeo.pl/pakiet-punktow-na-koncie-ongeo-jak-placic-mniej-za-raporty)
- Profesní cenová hladina v Německu: potenciálová analýza „od 350 € za pozemek“, přiřazení zdroje nejisté — [ki-syndikat](https://www.ki-syndikat.de/usecases/architektur/03-grundstuecksanalyse/)
- Developerský SaaS:
  - Kel Foncier (pozemky s potenciálem, identifikace vlastníků, trial) — [Motherbase](https://beta.motherbase.ai/startup/8623-kel-foncier/);
  - Urbanease jako B2B SaaS pro realitní profesionály — [PriceHubble](https://www.pricehubble.com/en/pricehubble-news/pricehubble-acquires-urbanease).
- Veřejný sektor:
  - buduje bezplatné „one-stop shopy“, např. ÖREB zdarma v Basel-Stadt od 2020 — [bs.ch](https://www.bs.ch/medienmitteilungen/bvd/2020-neuer-und-kostenloser-zugang-zu-grundstuecksinformationen);
  - AI nasazuje jen na kontrolu úplnosti (Durynsko, BRISE) — [kommunal.de](https://kommunal.de/ki-prueft-bauantraege-thueringen); [ORF Wien](https://wien.orf.at/stories/3153084/).
- Limity AI: nad skenovanými plány neověří měřítko, každý výstup je nutné zkontrolovat proti originálu a Grundbuch, služebnosti a zátěže zůstávají ruční prací — [ki-syndikat](https://www.ki-syndikat.de/usecases/architektur/01-baugenehmigungsunterlagen/); [ki-syndikat](https://www.ki-syndikat.de/usecases/architektur/03-grundstuecksanalyse/)

### Inferences
**Souhrnná matice (odvozeno jen z citovaných nálezů výše; „n/a“ = nenalezeno)**

| Hráč | Země | Typ modelu | Segment | AI | Cena | Financování / trakce |
|---|---|---|---|---|---|---|
| onGeo.pl | PL | report za pozemek (moduly, body) | kupci, makléři, architekti, investoři | nedoloženo (GIS overlay) | 10–200 zł; modul od 22 zł | n/a |
| on-geo (Tinsa) | DE | B2B platforma, datový shop, AVM | banky, znalci (→ pojišťovny přes LORA) | AI zkrácené posudky (−70 % času), smartextract | n/a | ~160 000 záznamů/měsíc |
| Sprengnetter + 21st | DE | B2B data a oceňování | banky, znalci, portál | n/a | n/a | koupen Scout24; 21st koupen 01/2024 |
| PriceHubble + Urbanease | CH/FR/DACH | B2B SaaS | realitní profesionálové | n/a | n/a | B 34 mil. USD (2021); celkem ~42 mil. USD; 6 akvizic do 11/2023 |
| GeoMap | DE | B2B předplatné (cena na dotaz) | realitní profesionálové | n/a | na dotaz; 3denní trial | n/a |
| Kel Foncier | FR | developerský SaaS | developeři | n/a | n/a; 5denní trial | n/a |
| Popety.io | CH | SaaS pro potenciál parcel | n/a | ano (AI odhad vhodnosti) | n/a | investor Vaudoise |
| Archilyse | CH | data a analytika | n/a | n/a | n/a | 4 mil. CHF, kolo A (2020) |
| ÖREB-Kataster | CH | veřejný výpis | všichni | ne | zdarma (Basel-Stadt) | 19 témat (Basel-Landschaft) |
| BRISE-Vienna | AT | veřejný pilot | úřad a žadatelé | AI kontrola úplnosti | – | 2019–2023 |
| Durynsko, pilot | DE | veřejný pilot | úřad | AI kontrola úplnosti | – | od podzimu 2025 |

**Kdo by mohl přijít do ČR** (podle schopností, ne podle nalezených oznámení):
1. PriceHubble: panevropská expanze přes akvizice, nově s modulem pro pozemky z Urbanease.
2. Tinsa/on-geo a Sprengnetter/Scout24: spíše na straně bank a znalců.
3. onGeo: produktově nejbližší analog, ale bez náznaků expanze.
4. Autodesk Forma (bývalý Spacemaker): globální software; jeho dostupnost v ČR jsem neověřil.

Nikdo z nich nemá doložené lokální know-how o českém územním plánování a regulativech. Hlavní bariérou vstupu je tedy lokální právo a data, a to je zároveň obranný val českého startupu.

**Doporučený model pro ČR: hybrid**
- levný nebo freemium report jako akviziční kanál pro architekty a kupce (cenová kotva onGeo ≈ 57–1 150 Kč);
- předplatné pro developery: sourcing pozemků a kapacitní studie podle vzoru Urbanease, Kel Foncier a Popety;
- API pro banky a pojišťovny: předběžná prověrka zástavy, povodňové riziko, pojistná hodnota podle vzoru on-geo/LORA.

Cenová kotva pro profesionální analýzu je ~350 € (≈ 8 500 Kč) za pozemek v Německu.

**Ponaučení**
- Výstup má citovat zdroje a nést právní výhradu. ÖREB je informativní, rozhodnutí mají přednost, a ki-syndikat doporučuje kontrolu proti originálu.
- Jádrem hodnoty je výpočet kapacity (koeficienty × plocha → podlažní plocha a objem), ne samotná mapa.
- Identifikace vlastníka a generování leadů dělá ze SaaS nástroj, který se používá opakovaně (Kel Foncier). V ČR je ale nutné to posoudit z pohledu GDPR.
- Je třeba počítat s tím, že stát může agregaci zpřístupnit zdarma, jako to udělalo ÖREB. Proto stavět na interpretaci, workflow a napojení na digitální podání.
- Slovensko je logický první exportní trh.

### Gaps
- Vstup do ČR: cílené dotazy typu „PriceHubble Česko“, „Autodesk Forma Česko“, „Tinsa Czech“ a „onGeo Czech“ se kvůli limitu neuskutečnily.
- Unit economics (ARPU, churn, CAC) žádného z hráčů jsem nenašel a tržby nejsou veřejné.
- Omezení metodiky: limit WebSearch se vyčerpal po 19 dotazech a WebFetch byl blokovaný pro blog.ongeo.pl, pricehubble.com a scout24.com. Pro doplnění je potřeba povolit tyto domény v síťovém nastavení session nebo pokračovat navazující zprávou.
