# Katastr, vlastnictví, přístup k pozemku, inženýrské sítě a státní digitální stavební služby v ČR – zdroje a jejich strojová dostupnost (stav k říjnu 2026)

> **Metodická poznámka pro autora zprávy:** WebFetch v této session neotevřel žádnou externí doménu (DNS „ENOTFOUND“ u cuzk.gov.cz, api-kn.cuzk.gov.cz, stavba.tzb-info.cz a www.bezrealitky.cz). Sdílený limit WebSearch (200 dotazů na tah pro všechny agenty) se navíc vyčerpal po 16 mých dotazech.
>
> - **Cited Findings** proto stojí na souhrnech, které vyhledávač vytvořil z uvedených stránek. Celé stránky jsem nečetl. Částky, data a citace je před publikací nutné ověřit na uvedených URL.
> - **Gaps** obsahují i znalosti z pozadí (do pol. 2026), které jsem nemohl ověřit. Každá položka má odhad jistoty a nesmí se citovat jako ověřený fakt.

## 1. Katastr nemovitostí a vlastnictví (ČÚZK): co je v roce 2026 zdarma a co placené, co přinesly HVD a otevírání dat 2023–2024 a co může zablokovat komerční produkt

### Takeaway
Zdarma jsou v roce 2026 data o parcelách bez osobních údajů:
- otevřená data ČÚZK pod CC BY 4.0 (katastrální mapa ve VFK/SHP/DXF/DGN/VKM, ZABAGED, ortofoto aj.);
- od 1. 7. 2024 bezúplatné REST **API KN** (JSON, ApiKey, registrace). Pokrývá parcely, stavby, jednotky, práva stavby a řízení, ale není určené k hromadnému vytěžování.

Placené zůstávají úřední výstupy s vlastníky a právy: výpis z LV a výstupy z Dálkového přístupu/WSDP (PDF/XML s elektronickou pečetí) podle příloh 3–5 vyhlášky č. 358/2013 Sb. Automatizované vytěžování Nahlížení do KN je zakázáno a jména vlastníků jsou tam od roku 2021 za captchou nebo přihlášením.

### Cited Findings

#### 1A. Nahlížení do katastru nemovitostí (ČÚZK) – https://nahlizenidokn.cuzk.gov.cz/
- **Přístup:** jen webová aplikace pro interaktivní práci. Automatizované vytěžování dat je zakázáno a pro automatizovaný přístup ČÚZK odkazuje na REST API — [Nahlížení do KN](https://nahlizenidokn.cuzk.gov.cz/)
- **Cena:** nahlížení je zdarma. Základní informace o nemovitosti lze zjistit zdarma, oficiální výpis vyžaduje dálkový přístup (e-občanka, bankovní identita apod.) a poplatek — [finance.cz](https://www.finance.cz/517482-vypis-z-katastru-nemovitosti-online/)
- **Osobní údaje:** od června 2021 je pro zobrazení vlastníka pozemku nutné opsat kód z obrázku (captcha), nebo se přihlásit Identitou občana či účtem dálkového přístupu — [finance.cz](https://www.finance.cz/517482-vypis-z-katastru-nemovitosti-online/); [top.cz](https://www.top.cz/jak-ziskat-vypis-z-katastru-nemovitosti-nabizime-navod-krok-za-krokem) (souhrn vyhledávače, mezi těmito dvěma stránkami nerozlišeno)
- **Časový rozsah:** Nahlížení ukazuje jen aktuální stav. Údaje k datu v minulosti jsou dostupné jen přes placený dálkový přístup — [ČÚZK – informace dle zák. 106/1999 Sb. (2024)](https://cuzk.gov.cz/Urady/Cesky-urad-zememericky-a-katastralni/Casto-hledane-informace/Poskytovani-informaci-106-1999-Sb/Zverejneni-obsahu-informaci-poskytnutych-na-za-(1)/2024/Nahlizeni-do-katastru-na-udaje-k-urcitemu-datu-v-m.aspx)
- **Sporný bod:** uživatelská diskuse tvrdí, že zákaz automatizace odporuje zákonu a že ČÚZK zavedl ochranu proti přetěžování. Jde o názor uživatelů, ne o výklad úřadu — [portalsvj.cz](https://www.portalsvj.cz/diskuse/cuzk-porusuje-zakon)

#### 1B. API KN – „REST API k datům KN“ (bezúplatná webová služba dálkového přístupu) – https://api-kn.cuzk.gov.cz/
- **Spuštění:** ČÚZK oznámil provoz nového bezplatného API od 1. 7. 2024 — [ČÚZK: Nové API pro přístup k údajům KN](https://cuzk.gov.cz/Aplikace-DP-do-KN/Aplikace-DP-do-KN/Archiv-DP/419139.aspx)
- **Vymezení ČÚZK:** „API KN ČÚZK poskytuje pro přístup k vybraným údajům katastru nemovitostí bezplatné REST API, které mohou využít informační systémy a aplikace pro on-line přístup k datům katastru nemovitostí.“ — [ČÚZK na X (15. 1. 2025)](https://x.com/CUZK_CZ/status/1879450023659794586)
- **Obsah:** číselníky KN, číselníky územních jednotek, jednotky, parcely, řízení, stavby, práva stavby — [REST API k datům KN](https://api-kn.cuzk.gov.cz/)
- **Technika:** REST, jen metoda HTTP GET, ApiKey v HTTP hlavičce každého požadavku, výstup JSON — [REST API k datům KN](https://api-kn.cuzk.gov.cz/); [ČÚZK na X](https://x.com/CUZK_CZ/status/1879450023659794586)
- **Registrace:** aplikace „Registrace ke službám ČÚZK“, sekce „API dat katastru nemovitostí“. Fyzická osoba se ověřuje Identitou občana, právnická osoba účtem Dálkového přístupu — [registrace.cuzk.gov.cz](https://registrace.cuzk.gov.cz/)
- **Omezení užití:** API slouží k napojení externích systémů a aplikací pro online přístup, ne k hromadnému vytěžování či stahování dat — [REST API k datům KN](https://api-kn.cuzk.gov.cz/)
- **Cena:** zdarma (ČÚZK ho uvádí jako bezplatnou službu vedle placeného DP/WSDP) — [ČÚZK: Dálkový přístup – základní informace](https://www.cuzk.gov.cz/dp/zakladni-informace)

#### 1C. Dálkový přístup (DP) a Webové služby dálkového přístupu (WSDP) – https://www.cuzk.gov.cz/dp/zakladni-informace
- **Co to je:** WSDP je placená služba. Registrovaným právnickým a fyzickým osobám a OSVČ dává online přístup k údajům KN „jako ověřené výstupy s elektronickou pečetí“. Stránka odkazuje na ceník výstupů ve formátech PDF a XML — [ČÚZK: DP – základní informace](https://www.cuzk.gov.cz/dp/zakladni-informace)
- **Napojení:** WSDP napojuje vlastní systém uživatele na systém ČÚZK. ČÚZK jako příklady uvádí CzechPOINT a různé GIS a softwarové produkty — [ČÚZK: FAQ Dálkový přístup](https://cuzk.gov.cz/Je-dobre-vedet/Zivotni-situace/FAQ-Dalkovy-pristup.aspx); [FAQ: Zřízení DP pro firmu](https://cuzk.gov.cz/Je-dobre-vedet/Zivotni-situace/FAQ-Dalkovy-pristup/2-Zrizeni-Dalkoveho-pristupu-do-KN-pro-firmu.aspx)
- **Lhůta:** zákaznický účet je obvykle použitelný asi 10 dní poté, co ČÚZK obdrží žádost — [ČÚZK: Založení zákaznického účtu pro DP](https://cuzk.gov.cz/Je-dobre-vedet/Zivotni-situace/Vybrane-zivotni-situace-katastr-nemovitosti/Zalozeni-zakaznickeho-uctu-pro-dalkovy-pristup-(1).aspx)
- **Oddělené služby:** placený DP, WSDP a bezplatné API KN jsou samostatné služby. ČÚZK uvádí i službu sledování změn — [ČÚZK: Dálkový přístup k údajům KN ČR](https://cuzk.gov.cz/Katastr-nemovitosti/Poskytovani-udaju-z-KN/Dalkovy-pristup/Dalkovy-pristup-k-udajum-KN-CR.aspx)

#### 1D. Ceník: vyhláška č. 358/2013 Sb., o poskytování údajů z katastru nemovitostí
- **Struktura:**
  - § 11: úplatný dálkový přístup, buď aplikací, nebo webovou službou (pro každou formu zvláštní žádost);
  - příloha č. 3: úplaty za výstupy a kopie;
  - příloha č. 4: DP s výstupy PDF/HTML;
  - příloha č. 5: webové služby s výstupy XML;
  - § 13: bezúplatný dálkový přístup.

  Zdroje: [zakonyprolidi.cz](https://www.zakonyprolidi.cz/cs/2013-358); [esipa.cz – konsolidované znění](https://esipa.cz/sbirka/sbsrv.dll/sb?DR=AZ&CP=2013s358-2024s050)
- **Novela z roku 2024:** konsolidované znění na esipa.cz je označeno „2013s358-2024s050“, tedy obsahuje změnu publikovanou v roce 2024. Obsah změny ani aktuální částky jsem neověřil — [esipa.cz](https://esipa.cz/sbirka/sbsrv.dll/sb?DR=AZ&CP=2013s358-2024s050)
- **Výpis z LV:** na CzechPOINTu podle tabulky finance.cz stojí 100 Kč. Jiný zdroj uvádí „50 Kč za stranu“, údaje se tedy rozcházejí. K žádosti je potřeba katastrální území a číslo LV nebo parcelní číslo — [finance.cz](https://www.finance.cz/517482-vypis-z-katastru-nemovitosti-online/); [finance.cz – návod](https://www.finance.cz/517482-jak-si-vyridit-vypis-z-katastru-nemovitosti-online)
- **CzechPOINT:** v květnu a srpnu 2026 vydal aktualizované metodiky k agendě KN (obsah nepřečten) — [Metodika CzP – Katastr nemovitostí (05/2026)](https://www.czechpoint.gov.cz/public/wp-content/uploads/2026/05/Metodika-CzP_Katastr-nemovitosti.pdf); [Katastr nemovitostí (08/2026)](https://www.czechpoint.gov.cz/public/wp-content/uploads/2026/08/Katastr_nemovitosti.pdf)

#### 1E. Otevřená data ČÚZK (Geoportál ČÚZK, ags.cuzk.gov.cz/opendata)
- **Licence:** od roku 2020 poskytuje ČÚZK prostorová data jako otevřená data zdarma pod jednotnou licencí CC BY 4.0. Výjimkou jsou letecké měřické snímky a archiválie — [Geoportál ČÚZK – Otevřená data](https://geoportal.cuzk.cz/(S(3ulvz4m5hf2m3zsnuh0s0qxq))/Default.aspx?head_tab=sekce-05-gp&mode=TextMeta&text=data_uvod&menu=50&news=yes)
- **Od července 2023:** zdarma jsou i ZABAGED®, Ortofoto ČR, státní mapová díla, Geonames a bodová pole — [Geoportál ČÚZK – Otevřená data](https://geoportal.cuzk.cz/(S(3ulvz4m5hf2m3zsnuh0s0qxq))/Default.aspx?head_tab=sekce-05-gp&mode=TextMeta&text=data_uvod&menu=50&news=yes); [Otevřená data Zeměměřického úřadu](https://ags.cuzk.gov.cz/opendata/)
- **Katastrální mapa:** jako otevřená data ve VFK a v redukovaných verzích DGN, DXF, SHP a VKM, členěná po katastrálních územích. Aktualizace podle souhrnu stránky: VFK měsíčně, VKM čtvrtletně, SHP týdně, DGN a DXF denně — [Geoportál ČÚZK – Katastrální mapy](https://geoportal.cuzk.cz/(S(mn43ycgddltbgsmfy3yrslyd))/Default.aspx?lng=CZ&mode=TextMeta&side=katastr_map&text=mapa.katastralni_uvod&head_tab=sekce-02-gp)
- **Katalog:** všechna otevřená data ČÚZK jsou registrována v Národním katalogu otevřených dat (NKOD) — [Geoportál ČÚZK – Datové sady](https://geoportal.cuzk.gov.cz/Default.aspx?mode=TextMeta&side=data_uvod&text=data_sady&head_tab=sekce-05-gp&menu=52&news=yes)
- **Služby:** mapové a stahovací služby ČÚZK běží na doméně services.cuzk.gov.cz — [services.cuzk.gov.cz](https://services.cuzk.gov.cz/). Podmínky užití (anglicky) jsou v PDF, obsah jsem nepřečetl — [Podminky_EN.pdf](https://geoportal.cuzk.gov.cz/Dokumenty/Podminky_EN.pdf)

#### 1F. Nařízení (EU) 2023/138 – datové sady s vysokou hodnotou (HVD) a stav v ČR
- **Cíl:** zpřístupnit veřejná data s nejvyšším socioekonomickým potenciálem k opakovanému použití s minimem právních a technických omezení a bezplatně — [EUR-Lex 2023/138](https://eur-lex.europa.eu/eli/reg_impl/2023/138/oj)
- **Plnění v ČR (INSPIRE Country Fiche 2025):** požadavky nařízení 2023/138 jsou splněny a metadata HVD publikována v NKOD. ČÚZK spravuje RÚIAN a v roce 2023 zpřístupnil celou ZABAGED jako otevřená data — [INSPIRE CZ Country fiche 2025](https://inspire-mif.github.io/INSPIRE-in-your-Country/CZ/Country_fiches/CZ-Country_fiche-2025.html)
- **Role DIA:** agendu HVD a NKOD metodicky vede Digitální a informační agentura (školení „HVD“ z 20. 2. 2024; obsah nepřečten) — [DIA – HVD (2024)](https://oha02.dia.gov.cz/p%C5%99%C3%ADlohy/vzd%C4%9Bl%C3%A1v%C3%A1n%C3%AD/2024-02-20%20-%20HVD%20-%20Kub%C3%A1%C5%88.pdf); [data.gov.cz – analýza HVD](https://data.gov.cz/kodi/v%C3%BDstupy/C1V6.pdf)

#### 1G. Soukromé služby nad daty KN (už na trhu)
- **parcelgps.com:** nabízí „API katastru nemovitostí (Česko): parcela podle čísla, souřadnic a adresy“, tedy komerční nadstavbu. Podmínky ani ceny jsem nečetl — [parcelgps.com](https://www.parcelgps.com/cs/api-katastru/cesko)
- **aikatastr.cz:** soukromý web zaměřený na informace o pozemku, s poradnou „Digitální technická mapa (DTM): co zjistíte o pozemku“. Je to potenciální konkurent — [aikatastr.cz](https://aikatastr.cz/poradna/digitalni-technicka-mapa-co-zjistite-o-pozemku)
- **Portál katastru a zeměměřictví:** ČT24 informovala, že „začal fungovat digitalizovaný Portál katastru a zeměměřictví“. Datum, obsah ani případnou novou službu pro veřejnost jsem neověřil — [ČT24](https://ct24.ceskatelevize.cz/clanek/domaci/zacal-fungovat-digitalizovany-portal-katastru-a-zememericstvi-358901)

### Inferences
- **Dotazy po jedné parcele:** produkt, který se na parcelu ptá až na žádost uživatele, může z bezplatného API KN a otevřených dat (CC BY 4.0) zdarma získat identifikaci, geometrii a základní popis parcely. Doložka „ne pro hromadné vytěžování“ míří na zrcadlení databáze, ne na dotazy po jednotlivých parcelách. Celostátní geometrii je proto vhodné brát z hromadných otevřených dat (SHP/VFK po k. ú.), ne z API.
- **Vlastnická data:** vlastníky, kompletní LV (věcná břemena, zástavní a předkupní práva, poznámky) a výstupy s úřední vahou lze automatizovat jen přes placené WSDP, nebo je uživatel nahlédne sám ručně. Scraping Nahlížení je zakázán a brzdí ho captcha. Otevřená otázka: vrací API KN i vlastníky? (viz Gaps)
- **Účet DP i pro bezplatné API:** právnická osoba potřebuje účet Dálkového přístupu už k registraci do bezplatného API KN. Komerční provozovatel tedy musí být zákazníkem ČÚZK a zřízení účtu trvá asi 10 dní.
- **Licence:** CC BY 4.0 umožňuje komerční odvozené reporty s uvedením zdroje. Licence otevřených dat produkt neblokuje. Omezení plynou z podmínek API KN, ze zákazu automatizace Nahlížení a z GDPR u jmen vlastníků. Jméno vlastníka v reportu, který se ukládá nebo přeprodává, by z provozovatele udělalo správce osobních údajů.
- **Otevírání dat 2023–2024:**
  - červenec 2023: uvolnění topografických a mapových dat (ZABAGED, ortofoto, státní mapová díla);
  - červenec 2024: bezplatné API KN;
  - HVD (EU 2023/138): podle INSPIRE Fiche 2025 jen formálně potvrdily už existující bezplatný režim.

  Datum účinnosti HVD (9. 6. 2024) ani to, že HVD nezahrnují vlastníky, jsem neověřil (viz Gaps).
- **Domény:** ČÚZK přešel na doménu cuzk.gov.cz; ve výsledcích se zároveň objevují starší odkazy na cuzk.cz. Integrace je vhodné psát proti .gov.cz.

### Gaps
- **Neověřeno (fetch nefungoval, limit vyhledávání vyčerpán):**
  - datový model API KN: zda vrací vlastníky/LV, BPEJ, způsob ochrany, omezení vlastnického práva a plomby u parcely;
  - kvóty a rate-limity API KN, podmínky komerčního užití a ukládání, SLA;
  - přesné částky v přílohách 3–5 vyhlášky č. 358/2013 Sb. a obsah novely z roku 2024;
  - zda je výpis z LV k vlastním nemovitostem zdarma (Portál občana / „Portál katastru a zeměměřictví“);
  - zda bezplatný VFK obsahuje osobní údaje. Nejmenovaný komentátor ve výsledcích tvrdí, že osobní údaje má jen placená verze; ČÚZK to v nalezených výsledcích nepotvrdil;
  - cena a podmínky služby sledování změn.
- **Znalosti z pozadí – NEOVĚŘENO, ověřit před použitím:**
  - (vysoká jistota) **Obsah Nahlížení do KN u parcely:**
    - k. ú., parcelní číslo (KN/ZE), výměra, druh pozemku, způsob využití, způsob ochrany nemovitosti, seznam BPEJ s výměrami;
    - číslo LV a vlastníci (jméno, adresa; za captchou);
    - „omezení vlastnického práva“ (věcná břemena, zástavní práva, předkupní práva aj.) a „jiné zápisy“;
    - upozornění na probíhající řízení (plomba).

    Výstup je jen informativní. Ověřit na https://nahlizenidokn.cuzk.gov.cz/
  - (střední) **Cena výpisu z KN na kontaktním místě/CzechPOINT:** 100 Kč za první stranu + 50 Kč za každou další. Přes DP odlišná sazba za stranu. Ověřit v přílohách 3 a 4 vyhlášky č. 358/2013 Sb.
  - (vysoká) **Kdo smí výpis získat:** KN je veřejný seznam, výpis z LV může získat kdokoli bez prokazování zájmu. (střední) Vyhledávání „podle osoby“ (přehled nemovitostí osoby) je vyhrazeno oprávněným subjektům (soudy, notáři, exekutoři, orgány veřejné moci) a dotčené osobě.
  - (střední–vysoká) **RÚIAN:**
    - přístup: VDP https://vdp.cuzk.gov.cz/, výměnný formát VFR přes ATOM (stavová i změnová data), WMS/WFS;
    - obsah: parcely (druh pozemku, způsob využití, výměra, definiční bod, hranice), stavební objekty, adresní místa, ulice, k. ú., obce; bez vlastníků;
    - licence a aktualizace: CC BY 4.0, denní aktualizace z ISKN;
    - identifikátory: kódy RÚIAN parcely, adresního místa a stavebního objektu.
  - (střední) **INSPIRE Cadastral Parcels:** WMS/WFS na services.cuzk.gov.cz a ATOM (GML po k. ú.). Atributy: ID, geometrie, národní katastrální reference, výměra, label. Neobsahuje druh pozemku ani vlastníky.
  - (vysoká) **Rozsah HVD:** HVD (EU 2023/138) se uplatňují od 9. 6. 2024. Geoprostorová kategorie zahrnuje mj. katastrální parcely, budovy, adresy, administrativní jednotky a zeměpisné názvy. Podmínky: bezplatnost, CC BY 4.0 nebo volnější licence, API a hromadné stahování. (střední) Vlastnické údaje do HVD nepatří.
  - (vysoká) **Druhy pozemku a způsob ochrany:**
    - druhy pozemku podle katastrální vyhlášky č. 357/2013 Sb.: orná půda, chmelnice, vinice, zahrada, ovocný sad, trvalý travní porost, lesní pozemek, vodní plocha, zastavěná plocha a nádvoří, ostatní plocha;
    - u ostatní plochy jsou mezi způsoby využití mj. „dálnice“, „silnice“, „ostatní komunikace“ a „manipulační plocha“;
    - „způsob ochrany nemovitosti“ (ZPF, PUPFL, památková či přírodní ochrana) je atribut KN.
  - (střední) **BPEJ:** pětimístný kód, v KN evidovaný u zemědělských pozemků. Odborně ji vede VÚMOP, v.v.i., aktualizaci zajišťuje Státní pozemkový úřad. Je podkladem tříd ochrany ZPF a odvodů za odnětí. Strojový kanál (WMS VÚMOP/SPÚ, API KN) neověřen.
  - (vysoká) **Plomba:** upozornění, že nemovitost je dotčena probíhajícím řízením (vklad, záznam, poznámka), které mění zapsané údaje.
  - (nízká–střední) **Digitalizace katastrálních map:** převod analogových map do DKM/KMD měl být celostátně dokončen kolem let 2024–2025. Mapy KMD z map 1 : 2880 mají nižší polohovou přesnost, což je důležité pro výpočty sousedství.

## 2. Právní přístup k pozemku: lze automaticky zjistit napojení na veřejnou komunikaci a jaká data existují o kategoriích komunikací?

### Takeaway
Přístup k veřejné komunikaci lze automaticky jen předběžně prověřit (screening):
- z otevřené katastrální mapy se spočítají sousední parcely;
- z API KN se zjistí jejich druh a způsob využití (např. „ostatní plocha – silnice / ostatní komunikace“);
- Portál DMVS (služba R49) vrátí seznam správců dopravní a technické infrastruktury (DTI) v území, tedy i správců komunikací.

Právní kategorii komunikace (silnice I.–III. třídy, místní, účelová) ani služebnost cesty žádný ověřený otevřený zdroj jednoznačně nedává. Datové zdroje ŘSD a pasporty komunikací jsem nemohl ověřit.

### Cited Findings
- **DTM a doprava:** DTM je digitální mapa zaměřená na technickou **i dopravní** infrastrukturu. Kraje ji vedou z dat, která předávají správci — [Wikipedie: Digitální technická mapa](https://cs.wikipedia.org/wiki/Digit%C3%A1ln%C3%AD_technick%C3%A1_mapa)
- **Registr IS DMVS:** jednotný autoritativní registr vlastníků, provozovatelů a správců DTI. Stavební úřady z něj získají údaje o průběhu DTI včetně plánovaných a neveřejných informací i údaje o územích jednotlivých správců — [ČÚZK: O IS DMVS](https://cuzk.gov.cz/DMVS/O-IS-DMVS.aspx)
- **Funkce „Zjištění území správců DTI“** (Portál DMVS, sekce „Dopravní a technická infrastruktura“) vrací seznam správců DTI pro vymezené území — [coprosys.cz](https://www.coprosys.cz/vyjadreni-k-existenci-siti/). Vývoj podle verzí:
  - v. 1.12: území se zadává seznamem parcel — [Přehled změn IS DMVS 1.12](https://cuzk.gov.cz/DMVS/Portal-DMVS/Prehled-zmen-IS-DMVS-ve-verzi-1_12.aspx)
  - v. 1.16: území lze nakreslit polygonem — [Přehled změn 1.16](https://cuzk.gov.cz/DMVS/Portal-DMVS/Prehled-zmen-IS-DMVS-ve-verzi-1-16.aspx)
  - v. 1.17.1: přibyla webová služba R49 pro všechny registrované subjekty — [Přehled změn 1.17.1](https://cuzk.gov.cz/DMVS/Portal-DMVS/Prehled-zmen-IS-DMVS-ve-verzi-1_17_1.aspx); [Dokumentace služby R49](https://cuzk.gov.cz/DMVS/Popis-rozhrani/Popis-sluzeb/CUZK_DMVS_dokumentace_sluzby_R49ZjisteniUzemiSprav.aspx)
- **Postup stavebního úřadu:** DTMwiki popisuje, jak úřad zjistí okruh vlastníků DTI ve vybraném území — [DTMwiki 2.3.2](https://dtmwiki.cuzk.gov.cz/02_sprava/03_informace_pro_su/02_zjisteni_vlastniku_dti)
- **Vyjádření vlastníka komunikace:** žádost o vyjádření vlastníka veřejné **dopravní** nebo technické infrastruktury (§ 180 odst. 2 stavebního zákona) nelze v přechodném období podat přes Portál stavebníka. Žádá se přímo u vlastníka komunikace — [TZB-info](https://stavba.tzb-info.cz/27924-prechodne-obdobi-pro-digitalizaci-stavebniho-rizeni)
- **Podklady pro výpočet sousedství:**
  - API KN poskytuje parcely a řízení po jednotlivých dotazech — [REST API k datům KN](https://api-kn.cuzk.gov.cz/)
  - otevřená katastrální mapa (SHP aktualizovaný týdně) obsahuje polygony parcel po k. ú. — [Geoportál ČÚZK – Katastrální mapy](https://geoportal.cuzk.cz/(S(mn43ycgddltbgsmfy3yrslyd))/Default.aspx?lng=CZ&mode=TextMeta&side=katastr_map&text=mapa.katastralni_uvod&head_tab=sekce-02-gp)
- **ZABAGED:** od července 2023 je zdarma jako otevřená data — [Geoportál ČÚZK – Otevřená data](https://geoportal.cuzk.cz/(S(3ulvz4m5hf2m3zsnuh0s0qxq))/Default.aspx?head_tab=sekce-05-gp&mode=TextMeta&text=data_uvod&menu=50&news=yes). Že ZABAGED obsahuje silnice a cesty jako topografické objekty, je znalost z pozadí.
- **Obce:** zveřejňují přehledy vlastníků DTI (příklad: Svitavy; obsah nepřečten) — [svitavy.cz](https://www.svitavy.cz/odbor/odbor-vystavby/vlastnici-dopravni-technicke-infrastruktury-dti)

### Inferences
- **Algoritmus screeningu (realizovatelný z ověřených zdrojů):**
  1. Polygon cílové parcely z otevřených dat nebo z API KN.
  2. Sousední parcely = parcely se společnou hranicí. Topologie se počítá nad SHP/VFK daného k. ú.; u hranice k. ú. je nutné načíst i sousední k. ú.
  3. Pro každou sousední parcelu načíst z API KN druh pozemku a způsob využití. Zda API vrací i vlastníka, není ověřeno.
  4. Přes R49 ověřit, zda v území působí správce komunikace (obec, kraj nebo jeho správa silnic, ŘSD).
  5. Klasifikace:
     - (a) přímá hranice s parcelou „silnice/dálnice/ostatní komunikace“ ve veřejném vlastnictví = pravděpodobný přístup;
     - (b) přístup jen přes soukromou parcelu = nutná služebnost nebo dohoda (ověřit na LV, zda má cílová parcela oprávnění z věcného břemene);
     - (c) bez kontaktu s komunikací = riziko.
- **Limity:**
  - „způsob využití“ v KN není právní kategorie podle zákona o pozemních komunikacích;
  - parcela „ostatní komunikace“ ve vlastnictví obce může být místní i účelová komunikace a účelová komunikace může být veřejně přístupná i na soukromém pozemku;
  - nepřesné mapy KMD mohou vytvářet falešné „mezery“ nebo falešné „dotyky“ parcel.

  Výstup proto musí být pravděpodobnostní hodnocení s doporučením, jaký doklad si vyžádat, ne právní závěr.
- **Co R49 neřekne:** R49 vrací jen seznam správců komunikací v území, ne kategorii konkrétní cesty. Závazné potvrzení dává až vyjádření vlastníka komunikace (§ 180), které se v roce 2026 podává mimo Portál stavebníka.

### Gaps
- **Neověřeno:**
  - ŘSD: silniční databanka a data silniční sítě ČR (obsah, licence, formát, API);
  - data krajských správ silnic (silnice II. a III. třídy);
  - pasporty místních komunikací. Podle všeho existují jen na obcích, v PDF nebo GIS a v různé kvalitě;
  - účelové komunikace: zda vůbec existuje jejich evidence;
  - zda veřejná vrstva DTM krajů obsahuje plochy komunikací a jejich správce.
- **Znalosti z pozadí – NEOVĚŘENO:**
  - (vysoká) Zákon č. 13/1997 Sb., o pozemních komunikacích, rozlišuje dálnice, silnice I.–III. třídy, místní komunikace a účelové komunikace. Dálnice a silnice I. třídy vlastní stát (spravuje ŘSD), silnice II. a III. třídy kraje (krajské správy a údržby silnic), místní komunikace obce. Účelové komunikace může vlastnit kdokoli.
  - (střední) Obce vedou pasport místních komunikací podle prováděcí vyhlášky č. 104/1997 Sb.
  - (vysoká) Občanský zákoník upravuje služebnost stezky, průhonu a cesty (§ 1274 a násl.) a nezbytnou cestu povolovanou soudem (§ 1029 a násl.). Služebnost se zapisuje na LV jako věcné břemeno.
  - (střední) ŘSD poskytuje data silniční sítě (silniční databanka, mapové služby) jako otevřená data. Licenci a formát je nutné ověřit.

## 3. Inženýrské sítě: jak architekt v roce 2026 zjišťuje existenci sítí a možnosti napojení, jaké existují agregátory, co umí DTM/IS DMVS (zákon č. 47/2020 Sb.) a zda funguje „jednotné vyjádření“

### Takeaway
Podle nového stavebního zákona se existence sítí zjišťuje ze dvou zdrojů: z DTM krajů (průběh sítí) a z Portálu DMVS (seznam správců v území). Vyjádření s podmínkami ochrany a napojení ale dál vydává každý vlastník sítě zvlášť. Jednotná cesta přes Portál stavebníka (§ 180 odst. 2) je do konce roku 2027 vypnutá, takže „jednotné vyjádření“ zatím nefunguje.

- **Přístup k datům:** veřejná vrstva DTM je zdarma a bez registrace, neveřejná data DTI dostávají jen zákonem vymezení uživatelé (veřejná správa, projektanti). DMVS má pro registrované subjekty webovou službu R49. ČÚZK však v květnu 2026 podle souhrnu uvedl, že zjišťování správců bylo nefunkční, a zavádí nástroj „SEMAFOR“.
- **Mimo stát:** existují komerční služby hromadného podání (např. MAWIS). Portály jednotlivých distributorů jsem ověřit nemohl.

### Cited Findings

#### 3A. Digitální technické mapy krajů (DTM krajů)
- **Definice:** DTM je digitální mapa technické a dopravní infrastruktury. Vedou ji kraje z dat předávaných správci sítí — [Wikipedie](https://cs.wikipedia.org/wiki/Digit%C3%A1ln%C3%AD_technick%C3%A1_mapa); [MSK: Co je to DTM](https://www.msk.cz/cs/temata/mapy/co-je-to-digitalni-technicka-mapa--13630/)
- **Veřejný obsah:** DTM krajů „zpřístupňuje veřejnosti jednotnou formou a zdarma údaje o vybraných přírodních, stavebních, inženýrských a technických objektech a zařízeních“ — [ČESKÉSTAVBY](https://www.ceskestavby.cz/clanky/digitalni-technicka-mapa-kraju-usetri-spoustu-penez-a-casu-uz-funguje-ale-data-se-stale-plni-33589.html); [BusinessInfo – Jihočeský kraj](https://www.businessinfo.cz/clanky/jihocesky-kraj-spustil-digitalni-technickou-mapu/) (citace ze souhrnu výsledků, autorství mezi zdroji nerozlišeno)
- **Bez registrace:** „V případě prohlížení veřejných mapových služeb není třeba provádět registraci a přihlašování“ (příklad Jihočeského kraje) — [BusinessInfo – Jihočeský kraj](https://www.businessinfo.cz/clanky/jihocesky-kraj-spustil-digitalni-technickou-mapu/)
- **Neveřejná data:** „Některé informace o sítích dopravní a technické infrastruktury jsou neveřejnými daty, k nimž je přístup omezen pro zákonem definovaný okruh uživatelů (např. pro veřejnou správu, projektanty staveb a územně plánovacích dokumentací aj.)“ — [BusinessInfo](https://www.businessinfo.cz/clanky/jihocesky-kraj-spustil-digitalni-technickou-mapu/); [ČESKÉSTAVBY](https://www.ceskestavby.cz/clanky/digitalni-technicka-mapa-kraju-usetri-spoustu-penez-a-casu-uz-funguje-ale-data-se-stale-plni-33589.html)
- **Stav naplnění:** DTM „už funguje, ale data se stále plní“ (titulek) — [ČESKÉSTAVBY](https://www.ceskestavby.cz/clanky/digitalni-technicka-mapa-kraju-usetri-spoustu-penez-a-casu-uz-funguje-ale-data-se-stale-plni-33589.html)
- **Hotové kraje:** podle údajů ČÚZK měly v době psaní zdroje DTM hotovou Praha, Plzeňský, Karlovarský, Liberecký a Zlínský kraj a Vysočina. Datum zdroje jsem neověřil, pravděpodobně jde o roky 2023–2024 — [BusinessInfo – kraje investují stovky milionů](https://www.businessinfo.cz/clanky/digitalni-technicka-mapa-ulehci-praci-verejne-sprave-i-investorum-kraje-do-porizeni-investuji-stovky-milionu/); [ČESKÉSTAVBY](https://www.ceskestavby.cz/clanky/digitalni-technicka-mapa-kraju-usetri-spoustu-penez-a-casu-uz-funguje-ale-data-se-stale-plni-33589.html)
- **Spuštění v krajích:**
  - Jihočeský, Olomoucký a Středočeský kraj DTM spustily — [BusinessInfo – Jihočeský](https://www.businessinfo.cz/clanky/jihocesky-kraj-spustil-digitalni-technickou-mapu/); [BusinessInfo – Olomoucký](https://www.businessinfo.cz/clanky/olomoucky-kraj-spustil-novou-mapu-ukazuje-kudy-vedou-inzenyrske-site/); [BusinessInfo – Středočeský](https://www.businessinfo.cz/clanky/stredocesky-kraj-spustil-system-digitalni-technicke-mapy/)
  - Kraj Vysočina „zpřístupnil zdarma data nejen o inženýrských sítích“ — [Kraj Vysočina (TZ)](https://www.kr-vysocina.cz/digitalni-technicka-mapa-kraj-vysocina-zpristupnil-zdarma-data-nejen-o-inzenyrskych-sitich-zjednodusi-a-zrychli-stavebni-rizeni/d-4129790)
  - Praha — [Geoportál Praha – DTM](https://geoportalpraha.cz/data-a-sluzby/clanky-a-projekty/dtm)
  - Plzeňský kraj má na geoportálu sekci „Vyjádření o existenci sítí (Digitální technická mapa)“ — [Geoportál Plzeňského kraje](https://geoportal.plzensky-kraj.cz/portal/vyjadreni-o-existenci-siti)
  - Správa železnic se připojuje ke krajským DTM — [Ekonomický deník](https://ekonomickydenik.cz/sprava-zeleznic-se-pripoji-ke-krajskym-digitalnim-technickym-mapam-presne-popisi-inzenyrske-site-a-souvisejici-prvky-technicke-infrastruktury/)
- **Společný software:** IS DTM pro část krajů vznikl jako „společná realizace vybraných krajů“ podle společné technické specifikace s ČÚZK — [ČÚZK: Společná technická specifikace IS DTM krajů (2021)](https://cuzk.gov.cz/DMVS/Podklady-IS-DTM/20211220_Spolecna-technicka-specifikace-IS-DTM-kra.aspx)
- **Co DTM nenahradí:** DTM ukazuje sítě na parcele a v okolí jen orientačně. Neuvádí kapacitu, možnost připojení ani ochranná pásma, a vyjádření správců proto nenahrazuje — [aikatastr.cz](https://aikatastr.cz/poradna/digitalni-technicka-mapa-co-zjistite-o-pozemku)
- **Praha (THMP):** pražský správce výslovně uvádí, že informace o existenci sítí nelze použít v rámci stavebního či územního řízení — [THMP – Digitální podklady](https://thmp.cz/jak-si-zaridit/digitalni-podklady/)
- **Výdej dat 2026:** ČÚZK v roce 2026 upravil výdej dat z DTM krajů. Podle souhrnu budou oprávněným osobám vydávána i data z neveřejné části — [ČÚZK: Úprava výdeje dat z DTM krajů (2026)](https://cuzk.gov.cz/Zememerictvi/Zememericke-cinnosti/Aktuality-pro-zememerice/2026/Uprava-vydeje-dat-z-DTM-kraju.aspx?feed=RSS)
- **Návrh SP ČR:** v připomínkách k novele vyhlášky o DTM (2023) navrhoval Svaz průmyslu a dopravy podmínit i veřejný přístup předchozí registrací. Šlo jen o návrh — [SP ČR – stanovisko 2023](https://www.spcr.cz/images/Stanovisko_SP_CR_novela_vyhlasky_DTM_2023_fin.pdf)

#### 3B. IS DMVS / Portál DMVS (ČÚZK) – centrální komponenta
- **Registr:** jednotný autoritativní registr vlastníků, provozovatelů a správců DTI. Stavební úřady z něj čerpají i plánované a neveřejné údaje — [ČÚZK: O IS DMVS](https://cuzk.gov.cz/DMVS/O-IS-DMVS.aspx)
- **Role subjektů:**
  - „vyjadřovatel“ = subjekt odpovědný za vyjádření o existenci dané části DTI;
  - „oprávněný žadatel“ = registrovaný subjekt oprávněný žádat neveřejná data DTI.

  Zdroj: [ČÚZK: Registr subjektů IS DMVS (2023)](https://www.cuzk.gov.cz/DMVS/O-IS-DMVS/Prezentace/Formanek__Registr_subjektu_IS_DMVS_20230201.aspx)
- **Nový stavební zákon:** vyjádření vlastníka sítě již nemusí obsahovat potvrzení o existenci sítí. Existence se zjišťuje z Portálu DMVS (dotaz na území správců) a z DTM kraje (poloha sítí) — [DTMwiki](https://dtmwiki.cuzk.gov.cz/02_sprava/03_informace_pro_su/02_zjisteni_vlastniku_dti)
- **Neuvedení vlastníci:** stavební úřad nemusí ověřovat ani dohledávat vyjádření vlastníků, kteří nejsou uvedeni v DTM/DMVS — [DTMwiki 2.3.3](https://dtmwiki.cuzk.gov.cz/02_sprava/03_informace_pro_su/03_postup_su)
- **„Zjištění území správců DTI“ podle verzí:**
  - v. 1.12: zásadní přepracování; výsledek u každého správce rozlišuje „validní/nevalidní“; území se zadává seznamem parcel — [Přehled změn 1.12](https://cuzk.gov.cz/DMVS/Portal-DMVS/Prehled-zmen-IS-DMVS-ve-verzi-1_12.aspx)
  - v. 1.16: zadání polygonem — [Přehled změn 1.16](https://cuzk.gov.cz/DMVS/Portal-DMVS/Prehled-zmen-IS-DMVS-ve-verzi-1-16.aspx)
  - v. 1.17.1: webová služba R49 pro všechny registrované subjekty — [Přehled změn 1.17.1](https://cuzk.gov.cz/DMVS/Portal-DMVS/Prehled-zmen-IS-DMVS-ve-verzi-1_17_1.aspx); [R49](https://cuzk.gov.cz/DMVS/Popis-rozhrani/Popis-sluzeb/CUZK_DMVS_dokumentace_sluzby_R49ZjisteniUzemiSprav.aspx)
  - existují i další služby, např. R51a „Zjištění informací“ — [Popis služeb DMVS](https://cuzk.gov.cz/DMVS/Popis-rozhrani/Popis-sluzeb.aspx); [R51a](https://cuzk.gov.cz/DMVS/Popis-rozhrani/Popis-sluzeb/CUZK_DMVS_dokumentace_sluzby_R51aZjisteniInformaci.aspx)
  - postup popisuje uživatelská příručka, kap. 4.4.1 — [Příručka Portálu DMVS](https://www.cuzk.gov.cz/DMVS/Portal-DMVS/CUZK_DMVS_Portal_Uzivatelska-prirucka.aspx)
- **Validace:** podle souhrnu výstup u každého správce uvádí, zda je v území přítomno ochranné pásmo. Stav „Nevalidní“ má nastat, když správce v území nemá síť ani ochranné pásmo. Interpretace souhrnu je nejistá — [ČÚZK: Validace částí DTI](https://cuzk.gov.cz/DMVS/Portal-DMVS/Validace-casti-DTI_upozorneni-pro-subjekty_v1.aspx)
- **SEMAFOR (2026):** prezentace ČÚZK na semináři Zlínského kraje pro projektanty (20. 5. 2026) podle souhrnu uvádí, že funkce zjištění území správců DTI se ukázala nefunkční. Jako společnou náhradu zavádí nástroj „SEMAFOR“. Prezentaci jsem nečetl — [ČÚZK (Binová), seminář ZLK 20. 5. 2026](https://dtm.zlinskykraj.cz/portal/media/dokumenty/prezentace/05_CUZK_Binova_ZLK_seminar_pro_projektanty_20052026.pdf)

#### 3C. Vyjádření vlastníků a správců sítí
- **Portál stavebníka:** v přechodném období zůstává k podávání žádostí, ale ne pro žádost o vyjádření vlastníka veřejné dopravní nebo technické infrastruktury (§ 180 odst. 2) — [TZB-info](https://stavba.tzb-info.cz/27924-prechodne-obdobi-pro-digitalizaci-stavebniho-rizeni)
- **Příklad poplatku (Coprosys, vlastník telekomunikační sítě):** za samostatné PDF „vyjádření o existenci sítí“ účtuje 300 Kč bez DPH. Uvádí, že tím jde nad zákonnou povinnost, protože primárním zdrojem je DMVS — [coprosys.cz](https://www.coprosys.cz/vyjadreni-k-existenci-siti/)
- **Zákon 106/1999 Sb.:** vlastník telekomunikační infrastruktury není povinným subjektem podle zákona č. 106/1999 Sb. — [coprosys.cz](https://www.coprosys.cz/vyjadreni-k-existenci-siti/)

#### 3D. Komerční agregátory
- **MAWIS:** nabízí hromadné podání žádostí o vyjádření k existenci sítí. Jde o komerční, neoficiální postup; ceny ani lhůty nezjištěny — [MAWIS (blog)](https://mawis.eu/blog/digitalni-technicka-mapa-a-jeji-vyznam-pro-moderni-stavebnictvi/)

#### 3E. Aktuální agenda 2026 (odborná školení)
- **Témata 2026:**
  - vyjadřování vlastníků sítí po zavedení DTM krajů;
  - povinnost stavebníka aktualizovat obsah DTM po dokončení stavby;
  - evidence plánovaných stavebních prací pro urychlení výstavby gigabitových sítí.

  Zdroje: [AQE Academy – DTM krajů máme, co dál](https://www.aqeacademy.cz/digitalni-technicke-mapy-kraju-mame-a-co-dal/); [AQE Academy – školení 2026](https://www.aqeacademy.cz/skoleni/digitalni-technicke-mapy-povinnosti-obci-a-dalsich-subjektu/)

### Inferences
- **„Jednotné vyjádření“ v říjnu 2026:** nefunguje jako jedna závazná odpověď státu. Funguje jen „jednotné zjištění“: seznam správců (DMVS) a polohopis sítí (DTM). Žádosti o samotná vyjádření (podmínky, ochranná pásma, napojení) se dál podávají u každého vlastníka zvlášť, přes jeho portál nebo přes agregátor. Plánovaná státní cesta (§ 180 odst. 2 přes Portál stavebníka) je odložená nejméně do konce roku 2027.
- **Co je strojově k dispozici:**
  - seznam správců přes R49 (po registraci);
  - veřejné prohlížecí mapové služby DTM (zdarma);
  - pro oprávněné uživatele (projektanti, zeměměřiči) neveřejná data DTI.

  Vektorovou geometrii neveřejných sítí nelze volně přebírat do veřejného produktu. Produkt pro architekty, kteří jsou oprávněnými projektanty, ji může získávat jen jejich jménem. Licenční podmínky a pravidla dalšího šíření jsem neověřil.
- **Spolehlivost:** DTM ještě není naplněná, ČÚZK sám v roce 2026 přiznal nefunkčnost zjišťování správců a THMP v Praze výslovně varuje. Výstup z DTM/DMVS proto nesmí být prezentován jako úplný. Produkt má vždy doporučit vyjádření od všech vlastníků uvedených v DMVS i od místně obvyklých subjektů (vodárny, obec). Na správce označené „nevalidní“ má upozornit zvlášť.
- **Rozpor DTMwiki × THMP:** DTMwiki říká, že existence sítí se bere z DMVS/DTM; THMP říká, že informace o existenci nelze použít v řízení. Nejspíš jde o rozdílné typy výstupů (informativní výpis z pražského portálu oproti zákonnému režimu DMVS), ale je třeba to ověřit.
- **Obchodní mezera:** stát do konce roku 2027 nepokryje agregaci podání u desítek správců podle R49, sledování lhůt a vytěžení PDF vyjádření (podmínky, ochranná pásma, body napojení).

### Gaps
- **Neověřeno (omezení nástrojů):**
  - portály distributorů: přesná URL, cena, lhůta, platnost vyjádření, automatické generování, API;
  - jména a ceny dalších agregátorů kromě MAWIS;
  - zda DTM krajů veřejně nabízejí WMS/WFS či API;
  - přesné termíny zákona č. 47/2020 Sb. (spuštění DTM a IS DMVS, lhůty pro předání dat vlastníky DTI) a jejich posuny;
  - co přesně je „SEMAFOR“.
- **Znalosti z pozadí – NEOVĚŘENO, ověřit:**
  - (střední–vysoká) **Zákon č. 47/2020 Sb.** novelizoval zákon č. 200/1994 Sb., o zeměměřictví, a zavedl DMVS, tedy IS DMVS (ČÚZK) a 14 DTM krajů. Podrobnosti upravuje vyhláška č. 393/2020 Sb., o digitální technické mapě kraje, novelizovaná v roce 2023. Ostrý provoz IS DMVS a DTM krajů přibližně od 1. 7. 2023.
  - (střední) **ČEZ Distribuce** (https://www.cezdistribuce.cz): online žádost přes portál/geoportál a automaticky generované „sdělení o existenci energetického zařízení“, zdarma. Vyjádření k PD nebo napojení mívá lhůtu do 30 dnů.
  - (střední) **EG.D** (https://www.egd.cz; elektřina na jihu Čech a Moravy, plyn na jihu): online portál, zdarma.
  - (střední) **PRE Distribuce** (https://www.predistribuce.cz; Praha a Roztoky): online žádost.
  - (střední) **GasNet** (https://www.gasnet.cz; většina plynárenské distribuce): online portál, zdarma. Prahu obsluhuje Pražská plynárenská Distribuce (https://www.ppdistribuce.cz).
  - (střední–vysoká) **CETIN** (https://www.cetin.cz): online, automaticky generované vyjádření o existenci SEK, zdarma.
  - (střední) **Další telekomunikace:** každý operátor zvlášť (T-Mobile, Vodafone, Nordic Telecom, místní kabelové sítě).
  - (nízká–střední) **Vodárny:** desítky provozovatelů (např. PVK, BVK, SčVK, SmVaK, VAS, skupina Veolia) s různými formuláři; část z nich účtuje poplatek. Vlastník vodovodu a kanalizace je často jiný subjekt než provozovatel (obec).
  - (nízká–střední) **Teplárny:** např. Pražská teplárenská, Veolia Energie, Teplárny Brno.
  - (střední) **Lhůty:** typicky do 30 dnů od podání, u některých správců okamžitě. (střední) Kapacitu a připojení řeší až žádost o připojení nebo o technické podmínky u distributora, ne vyjádření o existenci.

## 4. Státní digitální služby ve stavebním řízení (zákon č. 283/2021 Sb. a novely 2024–2026): Portál stavebníka, ISSŘ, EED, MMR/DIA – údaje o pozemku přes API, plánovaná služba „informace o pozemku“, co se zpozdilo či zrušilo

### Takeaway
Digitalizace podle zákona č. 283/2021 Sb. byla po špatném startu částečně odložena:
- **„Bypass“ novela** (Sněmovna 6. 11. 2024, účinnost od 1. 1. 2025): úřady smějí do 31. 12. 2027 místo ISSŘ používat vlastní systémy; Portál stavebníka nepřijímá žádosti o vyjádření vlastníků infrastruktury; nahrávání PD do EED zůstává povinné.
- **„Malá novela“** (květen 2026): odložila povinné používání NGÚP.
- **Velká novela vlády ANO (2026):** podle jediného sekundárního zdroje podepsána 17. 9. 2026, hlavní část účinná od 1. 1. 2027. Zavádí Úřad rozvoje území ČR (2027) a krajské úřady rozvoje území (2028). Její digitální harmonogram je nejasný (zdroje uvádějí konec 2027 i 2030).

Nenašel jsem doklad, že by Portál stavebníka, ISSŘ nebo EED nabízely API s údaji o pozemku, ani státní plán jednotné služby „informace o pozemku“.

### Cited Findings

#### 4A. „Bypass“ novela (2024)
- **Návrh:** předložil ho Martin Kupka a další poslanci. Stanoví dvě přechodná období: do poloviny roku 2025 pro územní plánování a NGÚP a do konce roku 2027 pro digitalizaci stavebního řízení — [ČT24 (2024)](https://ct24.ceskatelevize.cz/clanek/domaci/zive-poslanci-maji-zrychlene-schvalovat-novelu-stavebniho-zakona-355076)
- **Schválení:** Senát novelu schválil. MMR uvedlo účinnost od 1. 1. 2025 (po podpisu prezidenta) a přechodné období do konce roku 2027 — [MMR: Senát schválil bypass](https://mmr.gov.cz/cs/ostatni/web/novinky/senat-schvalil-bypass-digitalizace-stavebniho-rize); [kurzy.cz](https://zpravy.kurzy.cz/793732-senat-schvalil-bypass-digitalizace-stavebniho-rizeni-prechodne-obdobi-potrva-do-konce-roku-2027/); [isvs.cz](https://www.isvs.cz/prechodne-obdobi-dsr-potrva-do-konce-roku-2027/)
- **Sněmovna:** přijala novelu 6. listopadu (2024) — [isvs.cz](https://www.isvs.cz/prechodne-obdobi-dsr-potrva-do-konce-roku-2027/); [kurzy.cz](https://zpravy.kurzy.cz/793732-senat-schvalil-bypass-digitalizace-stavebniho-rizeni-prechodne-obdobi-potrva-do-konce-roku-2027/)
- **Přechodné období do 31. 12. 2027:**
  - Portál stavebníka zůstává k podávání žádostí, kromě žádosti o vyjádření vlastníka veřejné dopravní nebo technické infrastruktury (§ 180 odst. 2);
  - Evidence elektronických dokumentací zůstává a nahrávání projektové dokumentace do ní je dál povinné.

  Zdroje: [TZB-info](https://stavba.tzb-info.cz/27924-prechodne-obdobi-pro-digitalizaci-stavebniho-rizeni); [SP ČR](https://www.spcr.cz/digitalizace-stavebniho-rizeni)
- **Další rozbory:** [Frank Bold: Odkládací novela a bypass](https://www.fbadvokati.cz/cs/clanky/9909-novy-stavebni-zakon-odkladaci-novela-a-bypass-se-snazi-resit-nesvary-digitalizace); [ČKAIT (05/2024): částečný bypass](https://zpravy.ckait.cz/vydani/2024-05/jake-zmeny-prinasi-navrhovana-novela-stavebniho-zakona-tzv-castecny-bypass/); [i117.cz](https://i117.cz/digitalizacestavebniho-rizeni-issr/)

#### 4B. „Malá novela“ (květen 2026)
- **Obsah:** Sněmovna schválila malou novelu stavebního zákona, která odložila povinné používání Národního geoportálu územního plánování. ISSŘ úřady nemusejí povinně používat až do konce roku 2027 — [iROZHLAS (6. 5. 2026, datum dle URL)](https://www.irozhlas.cz/zpravy-domov/snemovna-schvalila-malou-novelu-stavebniho-zakona-odlozila-povinne-pouzivani_2605062059_med)

#### 4C. Velká novela 2026 (vláda vedená ANO)
- **Starší očekávání:** část zdrojů z 1. poloviny roku 2026 počítala s účinností od 1. 7. 2026. Jeden zmiňuje novelu „schválenou 30. ledna 2026“, nejspíš jde o fázi legislativního procesu. Tento údaj je překonaný — [provozovatel-budovy.cz](https://provozovatel-budovy.cz/aktualita/novela-stavebniho-zakona-od-1-7-2026-ma-zrychlit-povolovani-staveb-ocekavani-jsou-vysoka-rozhodne-ale-praxe/); [rowan.legal](https://rowan.legal/aktualne/pripravovana-novela-stavebniho-zakona-povolovani-staveb/)
- **Obsah podle ČESKÉSTAVBY:**
  - jednotné řízení s jedním rozhodnutím;
  - lhůta 30 dnů pro závazná stanoviska;
  - námitky sousedů jen v jedné určené fázi;
  - přechodné období se podle článku „oficiálně prodlužuje až do konce roku 2030“. Jiné zdroje toto tvrzení nepotvrdily.

  Zdroj: [ČESKÉSTAVBY](https://www.ceskestavby.cz/clanky/velky-tresk-na-stavebnich-uradech-od-1-7-co-se-meni-pro-bezne-stavebniky-a-kde-jsou-skryte-hacky-36151.html)
- **Nové úřady:** vznikne Úřad rozvoje území ČR (podle jednoho zdroje od ledna 2027) a krajské úřady rozvoje území (od ledna 2028) — [rowan.legal](https://rowan.legal/aktualne/pripravovana-novela-stavebniho-zakona-povolovani-staveb/); [endors.cz](https://www.endors.cz/blog/novela-stavebniho-zakona); [novystavebnizakon.cz](https://novystavebnizakon.cz/post/novela-stavebniho-zakona-2026-10-hlavnich-zmen-ktere-navrh-prinasi) (konkrétní zdroj z této skupiny souhrn neidentifikoval)
- **Sněmovna (asi červenec 2026):** poslanci novelu schválili. Celý rok 2027 se počítá jako přechodné období, kdy stávající stavební úřady fungují už podle nových pravidel. Nová soustava stavební správy se má naplno rozjet od 1. 1. 2028. Návrh poté mířil do Senátu — [Česká infrastruktura](https://www.ceskainfrastruktura.cz/zpravy/poslanci-schvalili-novelu-stavebniho-zakona/)
- **Senát, přehlasování a podpis (jediný sekundární zdroj):** Senát novelu v srpnu zamítl, Sněmovna ji 9. 9. přehlasovala a prezident ji 17. 9. podepsal. Účinnost nastává ve třech vlnách, hlavní část od 1. 1. 2027 — [bezrealitky.cz – „A je rozhodnuto“](https://www.bezrealitky.cz/blog/novela-stavebniho-zakona-2026-prehledne) (pravděpodobný zdroj, souhrn ho jednoznačně neuvedl)
- **Úplné znění:** stát ho publikuje na webu „Nový stavební zákon 2026“ — [novystavebnizakon.gov.cz](https://novystavebnizakon.gov.cz/legislativa/uplne-zneni-zakona/)

#### 4D. Provoz systémů
- **Průzkum MMR:** digitalizace se pozvolna zlepšuje. Podle 48 % zástupců měst, obcí, krajů a stavebních úřadů je Portál stavebníka funkčnější než loni, dvě třetiny úřadů ale hlásí potíže s provozem. Datum průzkumu neověřeno (2025 nebo 2026) — [isvs.cz](https://www.isvs.cz/digitalizace-stavebniho-rizeni-se-zlepsuje-potize-ale-pretrvavaji/)
- **Státní rozcestník** k digitalizaci stavebního řízení a územního plánování (obsah nepřečten) — [egovernment.cz](https://www.egovernment.cz/inpage/stavebni-rizeni/)

### Inferences
- **Stav k říjnu 2026:**
  - Portál stavebníka a EED fungují pro podání a ukládání dokumentace;
  - úřady smějí do konce roku 2027 obcházet ISSŘ vlastními systémy;
  - funkce, která měla být státním one-stop pro vyjádření správců sítí a komunikací (§ 180 odst. 2), je vypnutá.

  Velká novela 2026 reorganizuje úřady (Úřad rozvoje území) a digitalizaci pravděpodobně dál posouvá (2028, podle ČESKÉSTAVBY až 2030). Do konce dekády tedy nehrozí, že by stát nabídl komplexní „informace o pozemku“ pro architekty.
- **API na úrovni pozemku:** žádný ověřený zdroj neuvádí veřejné API Portálu stavebníka, ISSŘ ani EED s údaji o pozemku. Strojová státní data o parcele dnes dávají ČÚZK (API KN, otevřená data, DMVS R49) a kraje (DTM). Konkurenční riziko pro soukromý produkt proto plyne spíš z rozvoje DMVS/DTM (sítě) než ze stavebních portálů MMR.
- **Odpovědnost za systémy:** kdo za ně odpovídá (MMR, DIA, od roku 2027 nový Úřad rozvoje území), je nejisté. Prokazatelně vede DIA jen otevřená data a HVD (NKOD); její roli ve stavebních systémech jsem neověřil.

### Gaps
- **Neověřeno:**
  - číslo velké novely 2026 ve Sbírce zákonů a její ustanovení o digitalizaci: osud Portálu stavebníka, ISSŘ a EED a zda prodlužuje přechodné období až do roku 2030;
  - kdo systémy provozuje (MMR nebo DIA) v letech 2025–2026 a od roku 2027;
  - zda Portál stavebníka ukazuje mapu nebo údaje o pozemku a zda má API;
  - zda stát připravuje službu typu „informace o pozemku/území“.
- **Znalosti z pozadí – NEOVĚŘENO:**
  - (vysoká) Zákon č. 283/2021 Sb. ve znění zákona č. 152/2023 Sb. nabyl účinnosti 1. 1. 2024 pro vyhrazené stavby (Dopravní a energetický stavební úřad) a 1. 7. 2024 pro ostatní stavby.
  - (vysoká) MMR 1. 7. 2024 spustilo systémy DSŘ (Portál stavebníka, ISSŘ, EED, NGÚP, IS identifikačního čísla stavby) s rozsáhlými výpadky.
  - (vysoká) Premiér Fiala kvůli tomu v září 2024 odvolal ministra pro místní rozvoj Ivana Bartoše.
  - (nízká) Adresa Portálu stavebníka (pravděpodobně portal.stavebnionline.cz) a role DIA při převzetí provozu DSŘ.

## 5. Kroky, které stále vyžadují člověka nebo autorizovaného profesionála (zaměření, vytyčení hranic, geometrický plán), a typické ceny

### Takeaway
Polohopisné a výškopisné zaměření, vytyčení hranic a geometrický plán jsou terénní a úřední úkony, které data nenahradí. Vytyčení a GP ověřuje ÚOZI a GP potvrzuje katastrální úřad. Agenda DTM navíc ukládá stavebníkovi po dokončení stavby aktualizovat DTM, což vyžaduje další zaměření. Ceny 2025–2026 jsem nemohl ověřit; orientační rozpětí z pozadí jsou v Gaps a jsou neověřená.

### Cited Findings
- **Po dokončení stavby:** stavebník musí aktualizovat obsah DTM (téma odborných školení v roce 2026) — [AQE Academy](https://www.aqeacademy.cz/digitalni-technicke-mapy-kraju-mame-a-co-dal/)
- **Data DTM pro zeměměřiče:** ČÚZK v roce 2026 upravil výdej dat z DTM krajů. V rubrice pro zeměměřiče uvádí, že oprávněným osobám budou vydávána i data z neveřejné části. Pro zeměměřiče jsou podkladem k zaměření — [ČÚZK: Úprava výdeje dat z DTM krajů (2026)](https://cuzk.gov.cz/Zememerictvi/Zememericke-cinnosti/Aktuality-pro-zememerice/2026/Uprava-vydeje-dat-z-DTM-kraju.aspx?feed=RSS)
- **Limity DTM:** neukazuje kapacitu, možnosti připojení ani ochranná pásma — [aikatastr.cz](https://aikatastr.cz/poradna/digitalni-technicka-mapa-co-zjistite-o-pozemku)
- **Úřední výstupy:** výstupy s úřední vahou (s elektronickou pečetí) se vydávají placeně přes DP/WSDP. Informativní data (Nahlížení, API KN) úřední výstup nenahrazují — [ČÚZK: DP – základní informace](https://www.cuzk.gov.cz/dp/zakladni-informace)

### Inferences
- **Povinné lidské milníky** zůstávají i při plně automatizovaném sběru dat:
  - zaměření pozemku (polohopis a výškopis jako podklad projektu);
  - vytyčení hranic (u map KMD prakticky nutné před návrhem odstupů);
  - po stavbě zaměření skutečného provedení, GP a aktualizace DTM.

  Produkt může připravit podklady (výřez KN, seznam bodů, DTM, kontakty na sousedy), ne tyto úkony nahradit.
- **Odborné posouzení:** vyhodnocení vyjádření správců, střetů s ochrannými pásmy a právního přístupu je práce projektanta (autorizovaného architekta nebo inženýra). Ve sporných případech je potřeba advokát.

### Gaps
- **Ceny 2025–2026 neověřeny.** Následující orientační rozpětí jsou z pozadí s nízkou až střední jistotou. NEPUBLIKOVAT bez ověření v cenících několika geodetických firem:
  - polohopisné a výškopisné zaměření pozemku pro RD (do cca 1 000–1 500 m²): řádově 5–15 tis. Kč;
  - vytyčení hranic pozemku: řádově 5–12 tis. Kč za první body a zhruba 0,5–1,5 tis. Kč za každý další bod;
  - geometrický plán (oddělení části pozemku nebo vyznačení budovy): řádově 6–15 tis. Kč.
- **Znalosti z pozadí – NEOVĚŘENO:**
  - (střední–vysoká) Úředně ověřovat výsledky zeměměřických činností (vytyčení, GP) smí jen úředně oprávněný zeměměřický inženýr (ÚOZI) podle zákona č. 200/1994 Sb.
  - (vysoká) GP musí před použitím potvrdit katastrální úřad.
  - (vysoká) O vytyčení hranic se pořizuje protokol a vlastníci sousedních pozemků se k vytyčení zvou.

## 6. Souhrnné hodnocení: co lze pro danou parcelu plně automatizovat, co částečně a co vyžaduje člověka

### Takeaway
- **Plně automatizovatelné:**
  - zdarma: identifikace a geometrie parcely, sousední parcely a základní popis z KN;
  - placeně přes WSDP, bez scrapingu: úřední LV s vlastníky a věcnými břemeny;
  - technicky: seznam správců sítí v území (jeho spolehlivost ale ČÚZK v roce 2026 sám zpochybnil).
- **Částečně automatizovatelné:** screening přístupu ke komunikaci, mapový přehled sítí a hromadné podání a vytěžení vyjádření.
- **Vyžaduje člověka:** terénní geodézie, vytyčení, GP, právní posouzení přístupu, kapacita připojení a odpovědnost projektanta.

### Cited Findings
- **API KN:** zdarma pro online přístup, ne pro hromadné vytěžování — [REST API k datům KN](https://api-kn.cuzk.gov.cz/)
- **Otevřená data ČÚZK:** licence CC BY 4.0 — [Geoportál ČÚZK – Otevřená data](https://geoportal.cuzk.cz/(S(3ulvz4m5hf2m3zsnuh0s0qxq))/Default.aspx?head_tab=sekce-05-gp&mode=TextMeta&text=data_uvod&menu=50&news=yes)
- **WSDP:** placené ověřené výstupy s elektronickou pečetí — [ČÚZK: DP – základní informace](https://www.cuzk.gov.cz/dp/zakladni-informace)
- **Nahlížení:** automatizované vytěžování je zakázáno — [Nahlížení do KN](https://nahlizenidokn.cuzk.gov.cz/)
- **DMVS R49:** dostupná registrovaným subjektům — [ČÚZK: Přehled změn 1.17.1](https://cuzk.gov.cz/DMVS/Portal-DMVS/Prehled-zmen-IS-DMVS-ve-verzi-1_17_1.aspx). Podle prezentace ČÚZK z roku 2026 nahrazuje nefunkční funkci nástroj SEMAFOR — [ČÚZK, seminář ZLK 2026](https://dtm.zlinskykraj.cz/portal/media/dokumenty/prezentace/05_CUZK_Binova_ZLK_seminar_pro_projektanty_20052026.pdf)
- **Portál stavebníka:** podání podle § 180 odst. 2 je do konce roku 2027 vypnuté — [TZB-info](https://stavba.tzb-info.cz/27924-prechodne-obdobi-pro-digitalizaci-stavebniho-rizeni)

### Inferences
Souhrnná tabulka je syntéza. „(neověř.)“ = opřeno jen o znalosti z pozadí, viz Gaps v sekcích 1–5.

| # | Krok | Zdroj / kanál | Strojový přístup | Cena / licence | Potřebný identifikátor | Úroveň automatizace |
|---|---|---|---|---|---|---|
| 1 | Adresa nebo bod → parcela (k. ú. + parc. č.) | RÚIAN (neověř.) / API KN | API, ATOM, WFS (neověř.) | zdarma | adresa → kód adresního místa → parcela (neověř.) | Plná |
| 2 | Hranice parcely a sousedé | katastrální mapa – otevřená data (SHP týdně, VFK měsíčně) | hromadné stažení po k. ú. | zdarma, CC BY 4.0 | kód k. ú. | Plná (pozor na přesnost KMD, neověř.) |
| 3 | Výměra, druh pozemku, způsob využití, ochrana | API KN – parcely | REST/JSON, ApiKey | zdarma | k. ú. + parc. č. (formát neověř.) | Plná, pokud API atributy vrací (neověř.) |
| 4 | Vlastníci, LV, věcná břemena, zástavní a předkupní práva | WSDP (XML, pečeť); Nahlížení jen ručně | webová služba přes účet DP | placené (příl. 5 vyhl. 358/2013 Sb.) | k. ú. + LV nebo parc. č. | Plná za úplatu; zdarma jen ručně |
| 5 | Probíhající řízení (plomby) | API KN – řízení | REST | zdarma | parcela / číslo řízení (neověř.) | Částečná (vazba řízení na parcelu neověř.) |
| 6 | BPEJ | KN / VÚMOP (neověř.) | neověř. | neověř. | parcela | Neověřeno |
| 7 | Screening přístupu ke komunikaci | kroky 2 + 3 + DMVS R49 + LV | kombinace | zdarma, LV přes WSDP placeně | parcela + sousedé | Částečná (pravděpodobnostní) |
| 8 | Právní kategorie komunikace | ŘSD, kraje, pasport MK obce (neověř.); vyjádření vlastníka (§ 180) | převážně ručně | — | — | Ručně / částečně |
| 9 | Seznam správců sítí a komunikací v území | Portál DMVS / R49 / „SEMAFOR“ | webová služba (registrace) | neověř. (pravděpodobně zdarma) | seznam parcel nebo polygon | Technicky plná, spolehlivost omezená |
| 10 | Průběh sítí | DTM kraje: veřejná vrstva; neveřejná data jen pro oprávněné | prohlížecí služby (WMS neověř.) | zdarma | poloha | Částečná (data se plní, omezení u neveřejných dat) |
| 11 | Vyjádření správců (podmínky, ochranná pásma, napojení) | portály správců (neověř.) / agregátor (MAWIS) | formuláře, e-mail; výstupy v PDF | většinou zdarma (neověř.); výjimky (Coprosys 300 Kč bez DPH) | parcely / polygon | Částečná (podání a vytěžení PDF) |
| 12 | Kapacita a technické podmínky připojení | žádost o připojení u distributora | formální žádost | neověř. | — | Ručně s podporou |
| 13 | Zaměření, vytyčení hranic, GP | geodet / ÚOZI, potvrzení KÚ | terén | tisíce až desetitisíce Kč (neověř.) | — | Člověk |
| 14 | Podání žádosti a uložení PD | Portál stavebníka, EED | web; API neověř. | zdarma | — | Částečná (podává stavebník nebo projektant) |

- **Čím může produkt přidat hodnotu nad stát** (dovozeno z kroků 3–11):
  - jedním dotazem sloučit KN (API KN + WSDP), sousedy, DMVS R49 a DTM;
  - ze seznamu R49 automaticky připravit a odeslat (nebo předat agregátoru) žádosti o vyjádření a hlídat lhůty;
  - z doručených PDF vytěžit podmínky, ochranná pásma a body napojení.

  Stát to podle zjištěných termínů nezajistí dřív než po roce 2027.
- **Právní rizika pro byznys model:**
  - zákaz automatizace Nahlížení: nutno používat API KN nebo WSDP;
  - doložka API KN proti hromadnému vytěžování: dotazovat jen na žádost uživatele, nezrcadlit;
  - GDPR u jmen vlastníků: jména zobrazovat jen přechodně, nebo je v produktu vůbec neukládat;
  - omezení neveřejných dat DTI na oprávněné uživatele: data přebírat jen jménem oprávněného projektanta a nepublikovat je.
- **Úroveň automatizace:** plnou automatizaci (bez člověka) lze tvrdit jen u kroků 1–3 a placeně u kroku 4. Ostatní kroky jsou nanejvýš „asistované“.

### Gaps
- Tabulka obsahuje několik neověřených položek (označeno). Nejdůležitější k dalšímu ověření:
  - datový model a limity API KN (zda vrací vlastníky, BPEJ, omezení, plomby);
  - přílohy 3–5 vyhlášky č. 358/2013 Sb. (ceny WSDP a výpisu);
  - portály a ceníky distributorů a vodáren;
  - existence a licence dat ŘSD a pasportů MK;
  - ceny geodetických prací 2025–2026;
  - ustanovení velké novely 2026 o digitalizaci (konec 2027, nebo 2030?);
  - co přesně je ČÚZK „SEMAFOR“.
- Ověření vyžaduje povolit v síťovém nastavení session tyto domény: cuzk.gov.cz, api-kn.cuzk.gov.cz, stavba.tzb-info.cz a www.bezrealitky.cz. Zároveň je potřeba nový tah s nevyčerpaným limitem WebSearch.
