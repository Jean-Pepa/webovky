# Doplnění: API KN, ceny ČÚZK, portály správců sítí, DMVS/DTM (SEMAFOR) a komerční katastrální API – stav k říjnu 2026

> **Metodická poznámka pro autora zprávy:** Doplňuje soubor `cz_katastr_site_digitalizace.md` a opakuje z něj jen nezbytný kontext.
>
> - **Omezení nástrojů:** limit 35 volání WebSearch jsem vyčerpal celý. WebFetch i curl na cuzk.gov.cz, api-kn.cuzk.gov.cz, dmvs.cuzk.gov.cz, dtm.zlinskykraj.cz a parcelgps.com selhaly (ENOTFOUND / proxy 403), takže citace z webu stojí jen na souhrnech vyhledávače.
> - **Nejpevnější podklady** jsou dva soubory stažené z GitHubu (raw.githubusercontent.com):
>   - doslovná kopie OpenAPI specifikace API KN v1.0 (`swagger.json`, 41 cest), uložená v cizím repozitáři;
>   - OpenAPI specifikace parcelgps.com, verze 2026-10-05, stažená katalogem jentic 12. 10. 2026.
> - **Doplňkové podklady:** dokumentace nezávislých vývojářů API KN z roku 2026: open-source „Hlídač ČÚZK“ (ověřeno 13.–14. 9. 2026) a referenční příručka pluginu „katastr“ firmy ATLAS GROUP (Codexis). Jde o sekundární zdroje, ne o text ČÚZK.
> - **Ověření:** částky, data a podmínky je před publikací nutné ověřit na uvedených URL.

## 1. ČÚZK API KN (od 1. 7. 2024): endpointy a pole, limity, podmínky užití, registrace, rozdíl oproti WSDP a změny 2025–2026

### Takeaway
API KN v1.0 má 41 čistě čtecích (GET) endpointů:
- **Vrací:** parcely, stavby, jednotky, práva stavby, řízení, sousední parcely a číselníky. U parcely vrací **BPEJ (kód + výměra), způsoby ochrany, plomby (`rizeniPlomby`), právo stavby, číslo LV a definiční bod**.
- **Nevrací:** vlastníky, vlastnické podíly, věcná břemena ani zástavní práva a nemá endpoint pro obsah LV. Geometrii parcely nedává (jen definiční bod).

ČÚZK v odpovědi z 21. 10. 2024 uvádí limit **500 volání/den** pro fyzickou osobu (přihlášení přes NIA) a **1 000 volání/den** pro právnickou osobu (účet DP). Klíč má omezenou platnost a nesmí se sdílet ani vkládat do klientských aplikací. Výslovné povolení či zákaz komerčního užití jsem nenašel.

Samotné REST API se v letech 2025–2026 viditelně neměnilo. Měnilo se okolí: WSDP 3.1, omezení zobrazení vlastníků v Nahlížení (2025) a nové verze IS DMVS.

### Cited Findings

#### 1A. Specifikace a seznam endpointů
- **Specifikace:** API KN publikuje OpenAPI 3.0.1 „REST API dálkového přístupu k datům KN“, verze `v1.0`, s odkazem na podmínky `/podminkyuzivani` a podporu `https://podpora.cuzk.gov.cz`. Autentizace je HTTP hlavičkou `ApiKey` — [kopie swagger.json (GitHub, ondyn/Solomon)](https://github.com/ondyn/Solomon/blob/main/swagger.json)
- **URL specifikace:** strojová specifikace je na `https://api-kn.cuzk.gov.cz/swagger/v1.0/swagger.json`. Cesta `v1` vrací 404 — [ATLAS GROUP, plugin katastr – api.md](https://github.com/atlasgroupcz/codexis-marketplace/blob/main/plugins/katastr/skills/katastr/references/api.md)
- **Počet cest:** specifikace má 41 cest, všechny GET. Nezávislý vývojář ji ověřil 13. 9. 2026 a uvádí stejný počet — [swagger.json](https://github.com/ondyn/Solomon/blob/main/swagger.json); [Hlídač ČÚZK – výzkum WSDP/SSZ](https://github.com/petrleocompel/hlidac-cuzk/blob/main/docs/cuzk-successors-wsdp-research.md)
- **Skupiny endpointů** — [swagger.json](https://github.com/ondyn/Solomon/blob/main/swagger.json):
  - `AplikacniSluzby`: CiselnikZprav, AktualnostDat, ProvozniInformace, **StavUctu**, Health;
  - `CiselnikyISKN`: DruhyPozemku, ZpusobyUrceniVymery, TypyJednotky, TypyStavby, ZpusobyVyuzitiParcely/Stavby/Jednotky, **ZpusobyOchrany**, Pracoviste;
  - `CiselnikyUzemnichJednotek`: Obce, CastiObci, KatastralniUzemi, Okresy, Kraje;
  - `Parcely`:
    - `/{id}`;
    - `/Vyhledani` s parametry KodKatastralnihoUzemi, TypParcely PKN/PZE, DruhCislovaniParcely (1 = stavební, 2 = pozemková), KmenoveCisloParcely, PoddeleniCislaParcely, PuvodParcelyZE;
    - `/Polygon`;
    - `/SousedniParcely/{id}`;
  - `Stavby`: `/{id}`, `/Vyhledani` (KodCastiObce, TypStavby, CisloDomovni), `/AdresniMisto/{kod}`, `/Polygon`;
  - `Jednotky`: `/{id}`, `/Vyhledani` (+ CisloJednotky);
  - `PravaStavby`: `/{id}`, `/Parcela/{id}`, `/Stavba/{id}`;
  - `Rizeni`: `/{id}`, `/Vyhledani` (TypRizeni, Cislo, Rok, KodPracoviste), `/PrijateDne`.
- **Polygonové dotazy:**
  - parametr `SeznamSouradnic` je JSON pole bodů x, y v EPSG:5514 nebo 5513 s nejvýše dvěma desetinnými místy a délkou nejvýše 2000 znaků;
  - hledá se nad definičními body, ne nad hranicemi.

  Zdroj: [swagger.json](https://github.com/ondyn/Solomon/blob/main/swagger.json)
- **Limit plochy polygonu:** ČÚZK omezuje plochu polygonu na 5 000 m². Při překročení vrací HTTP 400 „Maximum surface area for polygon is 5000 m^2“, prakticky tedy funguje čtverec o poloměru nejvýše ~35 m — [ATLAS GROUP api.md](https://github.com/atlasgroupcz/codexis-marketplace/blob/main/plugins/katastr/skills/katastr/references/api.md)
- **Sousední parcely:** `SousedniParcely` vrací topologicky sousední parcely. V území bez digitální mapy vrátí HTTP 200 s prázdným výsledkem — [swagger.json](https://github.com/ondyn/Solomon/blob/main/swagger.json)
- **Obálka odpovědi:**
  - pole: `data`, `zpravy` (kód, `typZavaznosti` Informace/Varovani/Chyba, text), `aktualnostDatK` a `provedenoVolani` (běžící počet volání klíče);
  - ve zprávě s kódem 201 ČÚZK hlásí blížící se konec platnosti ApiKey (příklad „Blíží se konec platnosti ApiKey [12.08.2026 05:40:35]“).

  Zdroje: [swagger.json](https://github.com/ondyn/Solomon/blob/main/swagger.json); [ATLAS GROUP api.md](https://github.com/atlasgroupcz/codexis-marketplace/blob/main/plugins/katastr/skills/katastr/references/api.md)

#### 1B. Pole objektů (co API skutečně vrací)
- **Parcela** — [swagger.json](https://github.com/ondyn/Solomon/blob/main/swagger.json):
  - identifikace: `id` (ISKN), `typParcely` (PKN/PZE), `druhCislovaniParcely`, `kmenoveCisloParcely`, `poddeleniCislaParcely`, `dilParcely`;
  - území: `katastralniUzemi` (kód, název), `katastralniUzemiPuvodni`, `zdrojParcelyZE` (3 = evidence nemovitostí, 4 = pozemkový katastr, 6 = přídělový plán);
  - výměra a mapa: `vymera` (m²), `zpusobUrceniVymery`, `mapovyList`;
  - vazby: `lv` (id, číslo, k. ú.), `stavba`, `pravoStavby` (id, datum ukončení);
  - poloha: `definicniBod` (x, y v EPSG:5514);
  - popis a omezení:
    - `druhPozemku`, `zpusobVyuziti` (kód, název);
    - **`zpusobyOchrany`** (kód, název);
    - **`bpej`** (pole položek: kód BPEJ a výměra v m²);
    - **`rizeniPlomby`** („Seznam řízení, ve kterých je objekt dotčen změnou právního vztahu“).
- **Stavba** — [swagger.json](https://github.com/ondyn/Solomon/blob/main/swagger.json):
  - `typStavby`, `cislaDomovni`, `castObce`, `obec`, `docasna`, `lv`, `definicniBod`, `zpusobVyuziti`, `zpusobyOchrany`, `rizeniPlomby`;
  - `typyVazby`: PostavenaNaPozemku / JeSoucastiPozemku (§ 506 NOZ) / JeSoucastiPravaStavby;
  - `pravoStavby`, `jednotky`, `parcely` a `adresniMista` (kódy RÚIAN).
- **Jednotka:** `cisloJednotky`, `typJednotky`, `zpusobVyuziti`, `zpusobyOchrany`, `podilNaSpolecnychCastechDomu` (čitatel/jmenovatel), `lv`, `vymezenaVeStavbe`, `rizeniPlomby` — [swagger.json](https://github.com/ondyn/Solomon/blob/main/swagger.json)
- **Řízení** — [swagger.json](https://github.com/ondyn/Solomon/blob/main/swagger.json):
  - typ (V vklad, Z záznam, PGP potvrzení GP, PD podací deník, ZPV pomocné řízení V), pořadové číslo, rok, pracoviště, datum přijetí;
  - `stav` (jen u některých typů);
  - `stavUhrady` (O osvobozeno / U uhrazeno / N neuhrazeno);
  - `provedeneOperace` (vracejí se jen vybrané operace, „jako v interaktivním Nahlížení“);
  - `navazanaRizeni` (u PD) a `poznamky` (např. upozornění na skartaci).
- **Řízení přijatá za den:** server u `/Rizeni/PrijateDne` přijímá jen typy V, Z a PGP. Na PD a ZPV odpoví HTTP 400, ačkoli je specifikace uvádí — [ATLAS GROUP api.md](https://github.com/atlasgroupcz/codexis-marketplace/blob/main/plugins/katastr/skills/katastr/references/api.md)
- **Detail řízení po plombě:** jak dlouho je detail řízení dostupný po odebrání plomby, ČÚZK nedokumentuje — [Hlídač ČÚZK – self-hosting.cs.md](https://github.com/petrleocompel/hlidac-cuzk/blob/main/docs/self-hosting.cs.md)
- **Právo stavby:** obsahuje účely, datum přijetí a ukončení, LV, parcely, stavby, způsoby ochrany a plomby — [swagger.json](https://github.com/ondyn/Solomon/blob/main/swagger.json). Vyhledat ho lze jen přes ISKN id z detailu parcely nebo stavby — [Hlídač ČÚZK – self-hosting.cs.md](https://github.com/petrleocompel/hlidac-cuzk/blob/main/docs/self-hosting.cs.md)
- **Číselník způsobů ochrany:** obsahuje kód, název, `typOchrany` a `platnostDo` — [swagger.json](https://github.com/ondyn/Solomon/blob/main/swagger.json)
- **StavUctu:** vrací `idSluzby`, `aktualniObdobi`, `provedenoVolani`, `limitVolani` a `expiraceApiKey` — [swagger.json](https://github.com/ondyn/Solomon/blob/main/swagger.json); [Hlídač ČÚZK – self-hosting.md](https://github.com/petrleocompel/hlidac-cuzk/blob/main/docs/self-hosting.md)

#### 1C. Co API KN nevrací
- **Vlastníci:** objekt `LVDef` obsahuje jen `id`, `cislo` a `katastralniUzemi`, tedy žádné vlastníky — [swagger.json](https://github.com/ondyn/Solomon/blob/main/swagger.json). Shodně: „This API has no owners… there is no LV endpoint in this API“ — [ATLAS GROUP api.md](https://github.com/atlasgroupcz/codexis-marketplace/blob/main/plugins/katastr/skills/katastr/references/api.md). A také: „současná REST specifikace nemá LV endpoint ani vyhledání podle LV“ — [Hlídač ČÚZK](https://github.com/petrleocompel/hlidac-cuzk/blob/main/docs/self-hosting.cs.md)
- **Věcná břemena, zástavní práva a další omezení vlastnického práva:** „not available from this API; needs an official LV extract“ — [ATLAS GROUP api.md](https://github.com/atlasgroupcz/codexis-marketplace/blob/main/plugins/katastr/skills/katastr/references/api.md)
- **Podíly:** jediný podíl ve specifikaci je `podilNaSpolecnychCastechDomu` u jednotky. Vlastnické podíly na LV API nevrací — [swagger.json](https://github.com/ondyn/Solomon/blob/main/swagger.json)
- **Geometrie:**
  - API vrací jen definiční bod;
  - sousední parcely přicházejí jako základní definice bez geometrie;
  - mapová aplikace nezávislého vývojáře bere polygony z WFS 2.0 INSPIRE CP a podklad z WMS KN mimo kvótu API.

  Zdroj: [Hlídač ČÚZK – self-hosting.md](https://github.com/petrleocompel/hlidac-cuzk/blob/main/docs/self-hosting.md)
- **Historie:** API nemá historii ani vazbu předchůdce a nástupce parcely. Odpověď 404 tedy neprokazuje zánik parcely — [Hlídač ČÚZK – výzkum](https://github.com/petrleocompel/hlidac-cuzk/blob/main/docs/cuzk-successors-wsdp-research.md)
- **Rozpor v komunitě:** dva veřejné projekty tvrdí, že REST API KN poskytuje vlastníky:
  - „REST API KN – vlastník + detaily omezení (živě)“ — [kdestojim README](https://github.com/DOBJAN/kdestojim);
  - „ownership… details“ — [parcel-map-Jicin-okres README](https://github.com/ListerStellar/parcel-map-Jicin-okres).

  Specifikace to vyvrací — [swagger.json](https://github.com/ondyn/Solomon/blob/main/swagger.json)

#### 1D. Limity volání
- **Úřední limity:** bezplatné webové služby dálkového přístupu mají omezený počet volání:
  - fyzická osoba ověřená přes NIA: **500 volání denně**;
  - právnická osoba ověřená účtem DP: **1 000 volání denně**.

  Prováděcí vyhláška podle souhrnu umožňuje úřadu zasáhnout proti uživatelům, kteří přetěžují infrastrukturu, zneužívají dálkový přístup nebo porušují podmínky šíření dat. Opora je v § 55 odst. 3 katastrálního zákona. Jde o odpověď ČÚZK podle zákona č. 106/1999 Sb. z 21. 10. 2024 (souhrn vyhledávače) — [ČÚZK: Limity a omezení dálkového přístupu k datům katastru](https://cuzk.gov.cz/Urady/Cesky-urad-zememericky-a-katastralni/Casto-hledane-informace/Poskytovani-informaci-106-1999-Sb/Zverejneni-obsahu-informaci-poskytnutych-na-za-(1)/2024/Limity-a-omezeni-dalkoveho-pristupu-k-datum-katast.aspx)
- **Praxe nezávislých klientů:** oba klienti pracují s 500 voláními denně.
  - Hlídač ČÚZK drží rozpočet 500 pokusů za kalendářní den (Europe/Prague) a výslovně uvádí, že nejde o tvrzení, že všichni zákazníci ČÚZK mají stejnou kvótu;
  - Hlídač čte účet přes `StavUctu`, respektuje `Retry-After` a OpenAPI dokumentuje HTTP 429;
  - Codexis píše o „500-call daily quota“.

  Zdroje: [Hlídač ČÚZK – self-hosting.md](https://github.com/petrleocompel/hlidac-cuzk/blob/main/docs/self-hosting.md); [ATLAS GROUP api.md](https://github.com/atlasgroupcz/codexis-marketplace/blob/main/plugins/katastr/skills/katastr/references/api.md); [swagger.json](https://github.com/ondyn/Solomon/blob/main/swagger.json)
- **Geokódování mimo kvótu:** adresní geokódování přes RÚIAN (`ags.cuzk.gov.cz/arcgis/rest/services/RUIAN/MapServer`) je bez klíče a mimo kvótu KN — [Hlídač ČÚZK – .env.example](https://github.com/petrleocompel/hlidac-cuzk/blob/main/.env.example); [ATLAS GROUP api.md](https://github.com/atlasgroupcz/codexis-marketplace/blob/main/plugins/katastr/skills/katastr/references/api.md)

#### 1E. Registrace a podmínky užití
- **Postup registrace:**
  1. Na [registrace.cuzk.gov.cz](https://registrace.cuzk.gov.cz/) zvolit službu „REST API dat katastru nemovitostí“.
  2. Fyzická osoba se přihlásí Identitou občana (bankovní identita, eObčanka, Mobilní klíč eGovernmentu), právnická osoba účtem Dálkového přístupu do KN.
  3. Přečíst podmínky na `https://api-kn.cuzk.gov.cz/PodminkyUzivani` a zkopírovat přidělený klíč.

  Zdroj: [Hlídač ČÚZK – self-hosting.cs.md](https://github.com/petrleocompel/hlidac-cuzk/blob/main/docs/self-hosting.cs.md)
- **Podmínky podle parafráze vývojáře:**
  - užívání je zdarma, ale ČÚZK stanovuje maximální počet volání;
  - klíč se nesmí sdílet s jinými osobami ani vkládat do klientských aplikací;
  - zneužití údajů je přestupek;
  - klíč má omezenou platnost a obnovuje se v registraci.

  Zdroj: [Hlídač ČÚZK – self-hosting.cs.md](https://github.com/petrleocompel/hlidac-cuzk/blob/main/docs/self-hosting.cs.md)
- **Komerční užití:** přímé znění provozních podmínek ani výslovnou zmínku o komerčním užití jsem nenašel. ČÚZK uvádí jen, že API „mohou využít informační systémy a aplikace pro on-line přístup k datům katastru nemovitostí“ — [ČÚZK na X](https://x.com/CUZK_CZ/status/1879450023659794586); [ČÚZK: Nové API pro přístup k údajům KN](https://cuzk.gov.cz/Aplikace-DP-do-KN/Aplikace-DP-do-KN/Archiv-DP/419139.aspx)
- **Účet DP:** zřizovat ho mohou jen právnické osoby a podnikající fyzické osoby. Zřízení i vedení účtu je zdarma, platí se jen za odebrané výstupy — [ČÚZK: FAQ Dálkový přístup](https://cuzk.gov.cz/Je-dobre-vedet/Zivotni-situace/FAQ-Dalkovy-pristup.aspx)

#### 1F. API KN × WSDP × SSZ
- **WSDP je samostatná služba:**
  - vyžaduje samostatný zákaznický účet, který účet DP ani REST ApiKey nenahrazuje;
  - poskytuje LV a další výstupy v PDF nebo XML přes SOAP (WSDL/XSD, přílohy MTOM).

  Zdroj: [Hlídač ČÚZK – výzkum WSDP](https://github.com/petrleocompel/hlidac-cuzk/blob/main/docs/cuzk-successors-wsdp-research.md), opřeno o [ČÚZK: Webové služby dálkového přístupu](https://www.cuzk.gov.cz/Katastr-nemovitosti/Poskytovani-udaju-z-KN/Dalkovy-pristup/Webove-sluzby-dalkoveho-pristupu.aspx)
- **Kontrakt WSDP 3.1:**
  - operace `generujLV` přijímá `lvId`, volitelně `datumK`, `format` a `verze`;
  - `seznamSestav` vrací stav a cenu sestavy;
  - **`vratSestavu(idSestavy)` účtuje dosud nezaplacenou sestavu**;
  - při dávkovém zpracování je nutný rozestup alespoň 2 s;
  - `datumK` musí být alespoň 20 minut v minulosti.

  Zdroj: [Hlídač ČÚZK – výzkum](https://github.com/petrleocompel/hlidac-cuzk/blob/main/docs/cuzk-successors-wsdp-research.md), opřeno o [ČÚZK: WSDP 3.1, balík z 13. 2. 2026](https://www.cuzk.gov.cz/Katastr-nemovitosti/Poskytovani-udaju-z-KN/Dalkovy-pristup/Webove-sluzby-dalkoveho-pristupu/WSDP_10_3_1_20260213.aspx)
- **Zkušební prostředí:** trial `wsdptrial.cuzk.gov.cz` poskytuje bezplatně fiktivní nebo anonymizované údaje ze vzorku Prachatic se simulovaným účtováním — [ČÚZK: WSDP na zkoušku](https://www.cuzk.gov.cz/Katastr-nemovitosti/Poskytovani-udaju-z-KN/Dalkovy-pristup/Webove-sluzby-DP-na-zkousku.aspx) (citováno přes [Hlídač ČÚZK – výzkum](https://github.com/petrleocompel/hlidac-cuzk/blob/main/docs/cuzk-successors-wsdp-research.md))
- **Úřední váha:** elektronickou veřejnou listinou je jen elektronicky označené PDF. Importovaný JSON v aplikaci jí není — [Hlídač ČÚZK – výzkum](https://github.com/petrleocompel/hlidac-cuzk/blob/main/docs/cuzk-successors-wsdp-research.md)
- **Sledování změn (SSZ):**
  - pro koho: osoby s právem k nemovitosti a účastníci řízení, s prokázáním totožnosti;
  - doručení do 24 h po události;
  - cena: zdarma do 20 nemovitostí, od 21. nemovitosti 10 Kč za **každou** nemovitost a rok (u WS o 20 % méně). Příklad: 100 nemovitostí přes WS = 800 Kč/rok;
  - aktuální verze: SSZ 2.9.

  Zdroj: [Hlídač ČÚZK – výzkum](https://github.com/petrleocompel/hlidac-cuzk/blob/main/docs/cuzk-successors-wsdp-research.md), opřeno o [ČÚZK: SSZ – základní informace](https://cuzk.gov.cz/ssz/zakladni-informace) a [ČÚZK: Sazebník SSZ](https://www.cuzk.gov.cz/Katastr-nemovitosti/Poplatky/Sledovani-zmen.aspx)

#### 1G. Změny 2025–2026
- **REST API KN:** oznámení nové verze jsem nenašel (souhrn vyhledávače). OpenAPI v1.0 se 41 cestami ověřil nezávislý vývojář 13. 9. 2026 — [Hlídač ČÚZK – self-hosting.md](https://github.com/petrleocompel/hlidac-cuzk/blob/main/docs/self-hosting.md)
- **WSDP 3.1:** zdroje se v datech rozcházejí.
  - Podle stránky ČÚZK aktualizované 24. 4. 2026 platí WSDP 3.1 od 24. 11. 2025 a verze 2.9 končí v září 2026 — [Hlídač ČÚZK – výzkum](https://github.com/petrleocompel/hlidac-cuzk/blob/main/docs/cuzk-successors-wsdp-research.md).
  - Jiný souhrn stránek ČÚZK uvádí „WSDP 2.9 – platné od dubna 2024, termín ukončení 16. 10. 2026“ a „WSDP 3.1 – platné od května 2026“ — [ČÚZK: Webové služby dálkového přístupu](https://www.cuzk.gov.cz/Katastr-nemovitosti/Poskytovani-udaju-z-KN/Dalkovy-pristup/Webove-sluzby-dalkoveho-pristupu.aspx).
- **Nová struktura LV „NTŘ“:** je stále koncept, aktualizovaný 16. 4. 2026 — [Hlídač ČÚZK – výzkum](https://github.com/petrleocompel/hlidac-cuzk/blob/main/docs/cuzk-successors-wsdp-research.md)
- **Nahlížení do KN:** v roce 2025 ČÚZK omezil zobrazení vlastníků jen na přihlášené uživatele (např. přes Identitu občana). Zdůvodnil to nárůstem přístupů, které porušují provozní podmínky. Přesné datum se ze souhrnu nedalo přečíst — [ČÚZK: Přihlašování do aplikace Nahlížení (2025)](https://cuzk.gov.cz/Urady/Cesky-urad-zememericky-a-katastralni/Casto-hledane-informace/Poskytovani-informaci-106-1999-Sb/Zverejneni-obsahu-informaci-poskytnutych-na-za-(1)/2025/Prihlasovani-do-aplikace-Nahlizeni-do-katastru.aspx); [controlis.cz – „dočasně jen po přihlášení“](https://www.controlis.cz/novinky/120/cuzk-udaje-o-vlastnikovi-v-nahlizeni-do-kn-docasne-jen-po-prihlaseni)
- **Klienti nad API KN v roce 2026:**
  - open-source Hlídač ČÚZK (AGPL-3.0), první veřejné vydání 0.1.0 ze 6. 10. 2026 — [CHANGELOG](https://github.com/petrleocompel/hlidac-cuzk/blob/main/CHANGELOG.md);
  - proprietární plugin „katastr“ 1.8.0 pro Codexis (ATLAS GROUP) — [plugin.json](https://github.com/atlasgroupcz/codexis-marketplace/blob/main/plugins/katastr/.claude-plugin/plugin.json).

### Inferences
- **Co API KN v reportu pokryje zdarma:**
  - identifikace parcely, výměra, druh pozemku a způsob využití;
  - **BPEJ** s výměrami (podklad pro třídu ochrany ZPF a odvody);
  - **způsob ochrany** (např. ZPF, památková ochrana) jako kód a název;
  - **plomby** s detailem řízení (typ, stav, úhrada);
  - existence práva stavby, číslo LV, stavba na pozemku a sousední parcely.

  Vlastníky, podíly, věcná břemena (včetně služebnosti cesty pro přístup) a zástavní práva musí produkt brát z placeného WSDP. Uživatel je jinak musí zjistit sám (Nahlížení po přihlášení).
- **Kapacita jednoho klíče:** jeden report spotřebuje řádově 3–15 volání:
  - vyhledání parcely, případně druhý pokus s jiným `DruhCislovaniParcely`;
  - seznam sousedů a detail každého souseda;
  - detail stavby a každého řízení.

  Klíč právnické osoby s 1 000 voláními denně tak obslouží zhruba 70–300 reportů denně. Škálování za tuto hranici by vyžadovalo dohodu s ČÚZK. Více klíčů je pravděpodobně v rozporu se zákazem sdílení klíčů (neověřeno).
- **Doporučená architektura:**
  - geometrie: INSPIRE CP WFS / otevřená data (mimo kvótu);
  - „živé“ právní signály: API KN (BPEJ, ochrana, plomby);
  - LV: WSDP (placeně, jen na výslovnou žádost uživatele);
  - geokódování: RÚIAN ArcGIS (mimo kvótu).

  Klíč se volá jen ze serveru, nikdy z prohlížeče.
- **Nespolehlivé tvrzení na trhu:** chybné tvrzení dvou veřejných projektů o „vlastnících z API KN“ ukazuje, že konkurenti a dodavatelé mohou tuto schopnost přeceňovat. Při hodnocení dodavatelů je dobré to ověřit.

### Gaps
- **Neověřeno – podmínky API KN** (stránka `api-kn.cuzk.gov.cz/PodminkyUzivani` nebyla dostupná):
  - doslovné znění;
  - výslovná pravidla pro komerční užití, zobrazování dat třetím osobám a ukládání (cache);
  - SLA.
- **Limity:** zda se limit 500/1 000 volání denně od roku 2024 změnil a jaké je přesné „období“ (`aktualniObdobi`). Lze ověřit voláním `StavUctu` s vlastním klíčem.
- **Platnost ApiKey:** jak dlouho klíč platí (příklad expirace 12. 8. 2026 ukazuje, že klíče vyprší, ne délku platnosti).
- **WSDP:** který termín ukončení verze 2.9 platí (září vs. 16. 10. 2026) a od kdy přesně platí 3.1 (24. 11. 2025 vs. květen 2026).

## 2. Ceny placených výstupů ČÚZK (DP, WSDP, CzechPOINT) podle vyhlášky č. 358/2013 Sb. ve znění vyhlášky č. 50/2024 Sb.

### Takeaway
Od 1. 7. 2024 (novela č. 50/2024 Sb.) stojí výpis z KN přes Dálkový přístup i WSDP **100 Kč za výstup**, tedy za jedno LV bez ohledu na počet stran. „Informace o parcele“ stojí **10 Kč za parcelu**.
- **XML přes WSDP:**
  - informace o stavbě, jednotce a právu stavby po 10 Kč;
  - evidence práv pro osobu a přehled vlastnictví po 150 Kč;
  - přehled vlastnictví s nemovitostmi 200 Kč.
- **CzechPOINT:** 100 Kč za první a 50 Kč za každou další stranu.
- **Účet DP** je zdarma, platí se už za zobrazení výstupu.

Část souhrnů uvádí jiné částky (50 Kč a 75 Kč). Rozpor jsem nevyřešil.

### Cited Findings
- **Novela:** vyhláška č. 50/2024 Sb. mění vyhlášku č. 358/2013 Sb., o poskytování údajů z KN. Podle ČÚZK nabyla účinnosti 1. 7. 2024, tedy ve stejný den jako spuštění API KN — [ČÚZK – Archiv DP (oznámení 418439)](https://cuzk.gov.cz/Aplikace-DP-do-KN/Aplikace-DP-do-KN/Archiv-DP/418439.aspx?feed=RSS); [ČÚZK – Archiv DP (417890)](https://cuzk.gov.cz/Aplikace-DP-do-KN/Aplikace-DP-do-KN/Archiv-DP/417890.aspx?feed=RSS); [epravo.cz – 50/2024 Sb.](https://www.epravo.cz/top/zakony/sbirka-zakonu/sb/2024/50); [pravniprostor.cz](https://pravniprostor.cz/zmeny-v-legislative/vyslo-ve-sbirce-zakonu/novela-vyhlasky-o-poskytovani-udaju-z-katastru-nemovitosti2)
- **Měrná jednotka u DP:** ČÚZK v odpovědi podle zákona č. 106/1999 Sb. (2024) píše: „Měrnou jednotkou za výpis z katastru nemovitostí poskytnutý dálkovým přístupem bude výstup a úplata za něj 100 Kč.“ — [ČÚZK: Různá cena za výpis na přepážce a dálkovým přístupem (2024)](https://cuzk.gov.cz/Urady/Cesky-urad-zememericky-a-katastralni/Casto-hledane-informace/Poskytovani-informaci-106-1999-Sb/Zverejneni-obsahu-informaci-poskytnutych-na-za-(1)/2024/Ruzna-cena-za-poskytnuti-vypisu-z-KN-na-prepazce-k.aspx)
- **Ceník ČÚZK** (příloha č. 4 DP PDF/HTML a příloha č. 5 WSDP XML):
  - položka 4001 (DP) a 5001 (WSDP): výpis z KN **100 Kč** za výstup;
  - položka 4002 (DP) a 5002 (WSDP): informace o parcelách **10 Kč** za parcelu.

  Zdroj: [ČÚZK: Účtování výstupů z KN poskytovaných DP a WSDP](https://cuzk.gov.cz/Katastr-nemovitosti/Poskytovani-udaju-z-KN/Dalkovy-pristup/Uctovani-vystupu-z-KN-poskytovanych-DP-A-WSDP.aspx); [ČÚZK: Poplatky – Ceník](https://cuzk.gov.cz/Katastr-nemovitosti/Poplatky/Uctovani-vystupu-z-KN-poskytovanych-DP-A-WSDP.aspx)
- **Sazby XML (příloha 5):**

  | XML výstup | Sazba |
  |---|---:|
  | Výpis z KN | 100 Kč / LV |
  | Informace o parcele, stavbě, jednotce nebo právu stavby | 10 Kč / objekt |
  | Evidence práv pro osobu; přehled vlastnictví | 150 Kč / výstup |
  | Přehled vlastnictví s nemovitostmi | 200 Kč / výstup |

  PDF/HTML má jiné měrné jednotky. U podporovaných PDF/HTML výstupů se přidáním XML cena nezvyšuje — [Hlídač ČÚZK – výzkum (cituje přílohu 5 na webu ČÚZK)](https://github.com/petrleocompel/hlidac-cuzk/blob/main/docs/cuzk-successors-wsdp-research.md)
- **Rozpor (oznámení ČÚZK k novele podle souhrnu vyhledávače):**
  - výpis „zůstává 50 Kč“;
  - evidence práv pro osobu se zvyšuje z 50 na 75 Kč;
  - nově přehled vlastnictví s nemovitostmi za 100 Kč;
  - ověřené kopie listin ze sbírky listin zůstávají 10 Kč.

  Měrnou jednotku (strana nebo výstup) ani kanál souhrn neuvádí. Tyto částky jsou v rozporu se 100 Kč za výstup výše — [ČÚZK – Archiv DP 418439](https://cuzk.gov.cz/Aplikace-DP-do-KN/Aplikace-DP-do-KN/Archiv-DP/418439.aspx?feed=RSS); [ČÚZK – Archiv DP 417890](https://cuzk.gov.cz/Aplikace-DP-do-KN/Aplikace-DP-do-KN/Archiv-DP/417890.aspx?feed=RSS)
- **Starší sazba:** 50 Kč za stránku podle souhrnu odpovídá dřívější úpravě (vyhláška č. 457/2006 Sb.), která už neplatí. Starší tabulky na finance.cz ceny míchají — [epravo.cz – vyhláška č. 457/2006 Sb.](https://www.epravo.cz/top/zakony/sbirka-zakonu/sb/2006/457); [is.muni.cz – ISKN (2012)](https://is.muni.cz/el/sci/podzim2012/Z8105/um/ISKN.pdf?lang=cs); [finance.cz](https://www.finance.cz/517482-jak-si-vyridit-vypis-z-katastru-nemovitosti-online)
- **Účtování za zobrazení:** účtuje se již zobrazení výstupu, tedy nahlédnutí na stránku výstupu. Účet DP je zdarma — [ČÚZK: FAQ k dálkovému přístupu](https://cuzk.gov.cz/Katastr-nemovitosti/Poskytovani-udaju-z-KN/Dalkovy-pristup/Casto-kladene-dotazy-k-dalkovemu-pristupu-(FAQ).aspx); [ČÚZK: FAQ – Dálkový přístup](https://cuzk.gov.cz/Je-dobre-vedet/Zivotni-situace/FAQ-Dalkovy-pristup.aspx)
- **Přístup bez účtu:** fyzická osoba bez účtu DP může podobné výstupy získat bez registrace přes platební portál (e-shop) ČÚZK — [ČÚZK: FAQ – Dálkový přístup](https://cuzk.gov.cz/Je-dobre-vedet/Zivotni-situace/FAQ-Dalkovy-pristup.aspx); [ČÚZK: Platební portál – základní informace](https://cuzk.gov.cz/Katastr-nemovitosti/Poskytovani-udaju-z-KN/Platebni-portal/Zakladni-informace.aspx)
- **CzechPOINT (metodika 08/2026):** výpis i snímek katastrální mapy za 100 Kč za první stránku a 50 Kč za každou další — [CzechPOINT: Katastr nemovitostí (08/2026)](https://www.czechpoint.gov.cz/public/wp-content/uploads/2026/08/Katastr_nemovitosti.pdf)
- **Hromadný nákup dat ISKN (příklad ČÚZK, 2024):** pro okres Brno-město (191 925 LV) činila celková cena 19 192 500 Kč, tedy asi 100 Kč za LV. Aktualizace se účtují procentem základní úplaty (příklad: 3 % za první aktualizaci ve stejném roce) — [ČÚZK: Nákup dat z ISKN (2024)](https://cuzk.gov.cz/Urady/Cesky-urad-zememericky-a-katastralni/Casto-hledane-informace/Poskytovani-informaci-106-1999-Sb/Zverejneni-obsahu-informaci-poskytnutych-na-za-(1)/2024/Nakup-dat-z-informacniho-systemu-katastru-nemovito.aspx)
- **Modelový výpočet (XML LV):** jednorázově 10 LV = 1 000 Kč; měsíční aktualizace 10 LV = 12 000 Kč/rok; denní = 365 000 Kč/rok. Jde o výpočet nezávislého vývojáře (počet nových výpisů × sazba), ne o nabídku ČÚZK — [Hlídač ČÚZK – výzkum](https://github.com/petrleocompel/hlidac-cuzk/blob/main/docs/cuzk-successors-wsdp-research.md)

### Inferences
- **Náklady na report (WSDP):** report s úředním LV cílové parcely stojí na datech ČÚZK **~100–110 Kč** (LV 100 Kč + informace o parcele 10 Kč). Varianta s LV všech sousedů, např. kvůli služebnosti cesty nebo kontaktu na sousedy, stojí řádově **500–1 000 Kč** (5–10 sousedních LV). Opakované obnovy násobí cenu, protože každý nový výpis se účtuje znovu.
- **Účtování za zobrazení:** produkt nesmí výstup „zobrazit“ ani stáhnout bez souhlasu uživatele s cenou. Model ze zdroje „cena zobrazená před objednávkou + rezervace rozpočtu“ je pro SaaS nutný.

### Gaps
- **Přesné znění příloh 3–5** ve znění č. 50/2024 Sb.: e-Sbírka ani zakonyprolidi nebyly dostupné. Rozpor 50/75/100 Kč oproti 100/150/200 Kč tak zůstává nevyřešen. Ověřit na https://www.e-sbirka.cz/sb/2024/50 a na ceníku ČÚZK.
- **Znalost z pozadí – NEOVĚŘENO (střední–nízká jistota):** výstup „Informace o parcele“ za 10 Kč by v DP mohl obsahovat i vlastníky a „omezení vlastnického práva“, podobně jako stránka parcely v Nahlížení. Pak by byl 10× levnější než LV. Před použitím ověřit na vzorovém výstupu ve WSDP trialu (XSD „informace o objektech“).
- **Ceny ostatních výstupů:** snímek mapy, sbírka listin, výstupy k datu v minulosti. Nezjištěny.

## 3. Portály distributorů a správců pro „vyjádření/sdělení o existenci sítí“, poplatky a lhůty; agregátory a hromadná podání

### Takeaway
Velcí energetici a CETIN provozují vlastní online portály a vyjádření o existenci vydávají většinou **zdarma**. GasNet generuje informativní PDF automaticky. ČEZ vyřizuje žádosti online a vyjádření posílá e-mailem; zda automaticky, zdroj neuvádí.
- **Portály:**
  - ČEZ Distribuce: Geoportál;
  - EG.D: egd.cz;
  - GasNet: „Distribuce plynu online“;
  - PPD: e-Portal;
  - CETIN: online formulář, 0 Kč;
  - T-Mobile: ochranasiti.t-mobile.cz;
  - Vodafone: zadostovyjadreni.cz;
  - SčVK: zadosti.scvk.cz, včetně DGN.
- **Zpoplatněno** podle dostupných zdrojů: menší telekomunikační sítě (Coprosys 300 Kč bez DPH, České Radiokomunikace, StarNet). U PVK a BVK jsem portál ani poplatek ověřit nemohl.
- **Lhůty a platnost:** zákonná lhůta je podle jednoho zdroje 30 dnů, platnost vyjádření typicky 12–24 měsíců.
- **Agregace:** hlavní agregátor je **UtilityReport (portál MAWIS, HRDLIČKA spol. s r.o.)**. Ze zakresleného území vygeneruje seznam správců a hromadně připraví žádosti; přes spolupráci s kraji nabízí 3 hromadné žádosti ročně zdarma. Ceny placených tarifů jsem nenašel.
- **Nový stavební zákon:** výstupy energetiků jsou dnes výslovně jen „sdělení“. Souhlas s činností v ochranném pásmu a podmínky připojení jsou samostatné žádosti.

### Cited Findings

#### 3A. Elektřina
- **ČEZ Distribuce:**
  - **Služby:** web ČEZ uvádí mezi službami „Sdělení o existenci elektrických nebo komunikačních sítí na pozemcích pro účely stavby“, vedle vytyčení kabelů a přeložek — [cez.cz – technické záležitosti](https://www.cez.cz/cs/podpora/technicke-zalezitosti)
  - **Geoportál:** ČEZ Distribuce provozuje internetový Geoportál od roku 2012. Informace o poloze sítí poskytuje „zdarma, online a v digitální formě“, vyjádření přijde na zadaný e-mail — [ČEZ TZ: „vyžádejte si zdarma a online informace o poloze energetických sítí“](https://www.cez.cz/cs/pro-media/tiskove-zpravy/energetici-radi-nez-kopnete-do-zeme-vyzadejte-si-zdarma-a-online-informace-o-poloze-energetickych-siti-81975); [ČEZ TZ: od 2012 přes milion požadavků](https://www.cez.cz/cs/pro-media/tiskove-zpravy/informace-o-existenci-energetickych-siti-si-vyzada-denne-pres-pet-set-klientu.-od-roku-2012-vyridila-cez-distribuce-pres-milion-pozadavku-43528)
  - **Objem:** v roce 2018 zpracoval přes 184 000 požadavků a denně přes 500 klientů — [epravo.cz](https://www.epravo.cz/top/aktualne/geoportal-cez-distribuce-slouzi-uz-sestym-rokem-denne-si-informace-o-energetickych-sitich-vyzada-pres-500-lidi-109098.html)
  - **Rozhraní pro externí portály:** Geoportál má rozhraní pro příjem požadavků z externích portálů, které zjednodušuje podání „pro více vlastníků technické infrastruktury“ — [ČEZ TZ: Geoportál pomáhá stovkám tisíc uživatelů](https://www.cez.cz/cs/pro-media/tiskove-zpravy/geoportal-pomaha-stovkam-tisic-uzivatelu-95678) (souhrn nerozlišil přesnou tiskovou zprávu)
  - **Adresa a sdílení:** `https://geoportal.cezdistribuce.cz/geoportal.ses/ves.aspx`. Stejný formulář slouží i pro ČEZ ICT Services a Telco Pro Services — [neoficiální checklist projektanta (GitHub)](https://github.com/bedjan/ssstp_duchcov_unofficial/blob/main/projekce/README.md)
  - **Ceník:** ceník ČEZ Distribuce účinný v roce 2026 tuto službu neobsahuje, cenu jsem nepotvrdil — [cezdistribuce.cz – ceníky](https://www.cezdistribuce.cz/pro-zakazniky/potrebuji-vyresit/ceny-a-podminky/ceniky)
- **ČEZ Teplárenská:** zákonná lhůta 30 dnů se podle souhrnu týká vyjádření k teplárenským sítím — [ČEZ TZ – vyjadřovací portál ČEZ Teplárenská](https://www.cez.cz/nextcez/cs/pro-media/tiskove-zpravy/cez-teplarenska-vyjadrovaci-portal-opet-o-neco-vice-zvysuje-dosavadni-komfort-sluzeb-43603). Její portál podle checklistu umožňuje zadat „pouze 1 polygon“ — [checklist projektanta](https://github.com/bedjan/ssstp_duchcov_unofficial/blob/main/projekce/README.md)
- **ČEZ Energetické služby:** elektronická vyjádření jsou zdarma (sesterská firma, ne distributor) — [ČEZ ES: Geoportál](https://www.cez.cz/cezes/cs/o-spolecnosti/aktuality/cez-energeticke-sluzby-spousteji-geoportal-92727)
- **EG.D** (vzorové „Sdělení o existenci zařízení distribuční soustavy“ z úřední desky obce, 2025):
  - sdělení výslovně **není vyjádřením pro řízení o povolení záměru**;
  - souhlas se stavbou či činností v ochranném pásmu se žádá zvlášť, elektronicky na www.egd.cz („Souhlas s činností a stavbou v ochranném pásmu“);
  - připojení se řeší také zvlášť;
  - kontaktem je útvar „Poskytování informací k sítím“ v Jihlavě.

  Zdroj: [EG.D sdělení – příloha úřední desky Osová Bítýška (2025)](https://www.osovabityska.cz/storage/content/Uredni_deska/2025/Priloha-c.3-EG.D-sdeleni.pdf)
- **PRE Distribuce:** standardní balíček tvoří dokument „Informace o existenci zařízení elektrické energie“ a situační výkres s trasami sítí a prvky distribuční soustavy. Postup ani poplatek zdroj neuvádí — [PRE: TZ „PREdi – rychlejší informace o energetické síti v Praze“](https://www.pre.cz/Files/profil-spolecnosti/media/tiskove-zpravy/tz-predi-rychlejsi-informace-o-energeticke-siti-v-praze)
- **Platnost u připojení:** podle pravidel připojení platí písemné vyjádření nejméně 180 kalendářních dnů od doručení žadateli. Týká se vyjádření k připojení, ne nutně sdělení o existenci. Souhrn nerozlišil přesný zdroj, nejpravděpodobněji jde o vyhlášku č. 16/2016 Sb. o podmínkách připojení — [vyhláška č. 16/2016 Sb. (znění 2026, cezdistribuce.cz)](https://www.cezdistribuce.cz/file/edee/distribuce/legislativa/16_2016_sb._2026.pdf)

#### 3B. Plyn
- **GasNet:**
  - **Online a zdarma:** stanovisko i vytyčení plynovodu jsou zdarma, přes portál „Distribuce plynu online“. Formulář je na gasnet.cz/cs/zadost-o-stanovisko/. Informativní PDF se generuje automaticky a nese QR kód — [GasNet: Projednání stavební činnosti](https://www.gasnet.cz/-/media/GasNet/Files/Gasnet/stavari/GasNet_Projednani_stavebni_cinnosti_A4.pdf); [oenergetice.cz](https://oenergetice.cz/rychle-zpravy/gasnet-doporucuje-stavebnikum-nechte-si-vytycit-plynovody-usetrite-statisice-korun); [ČESKÉSTAVBY](https://www.ceskestavby.cz/clanky/naruseni-plynovodu-se-muze-prodrazit-nehode-predejdete-vytycenim-vybizi-stavebniky-gasnet-32150.html)
  - **Vytyčení:** provádí se jen na základě platného stanoviska a doporučuje se objednat aspoň 5 dní před zahájením stavby. Povinnost získat souhlas distributora plyne z energetického zákona — [GasNet: Projednání stavební činnosti](https://www.gasnet.cz/-/media/GasNet/Files/Gasnet/stavari/GasNet_Projednani_stavebni_cinnosti_A4.pdf)
  - **Adresa formuláře:** `https://dpo.gasnet.cz/zadost-o-stanovisko` (GasNet Služby) — [checklist projektanta](https://github.com/bedjan/ssstp_duchcov_unofficial/blob/main/projekce/README.md)
- **Pražská plynárenská Distribuce (PPD):** e-Portal `e-portal.ppdistribuce.cz` zpracovává:
  - žádosti o vyjádření k existenci sítí a k projektové dokumentaci;
  - žádosti o připojení;
  - žádosti o vytyčení.

  Systém „Vyjádření třetím stranám“ je od ledna 2023 integrován se službou UtilityReport — [Asseco: produktový list PPD](https://ce.asseco.com/files/ce/products/product_sheets/23_PP_CS_A4_cz.pdf)

#### 3C. Telekomunikace
- **CETIN:** vydává „Vyjádření o poloze sítě elektronických komunikací“.
  - **Cena a podání:** cena **0,00 Kč**, podání elektronicky a zdarma přes online formulář — [CETIN: Vyjádření o poloze sítě](https://banana.cetin.cz/about-us/cetin-network/statement-on-the-existence-of-electronic-communinacations-networks)
  - **Nordic Telecom:** od 1. 4. 2025 už nelze žádat u Nordic Telecom a vyjádření CETIN pokrývá obě sítě — [CETIN: Vyjádření o poloze sítě](https://banana.cetin.cz/about-us/cetin-network/statement-on-the-existence-of-electronic-communinacations-networks)
  - **Obsah:** vzor cituje jako právní základ § 101 zákona č. 127/2005 Sb. a obsahuje všeobecné podmínky ochrany SEK — [vzor vyjádření CETIN (nabidkamajetku.gov.cz)](https://nabidkamajetku.gov.cz/api/Property/Attachment/add0ff4f-fb46-4974-af34-3fbb8ad3e129)
- **T-Mobile a Vodafone:** oba mají elektronické podání, poplatek ani lhůtu jsem nezjistil:
  - T-Mobile: `https://ochranasiti.t-mobile.cz/vyjadreni/` (registrace žadatele);
  - Vodafone: `https://www.zadostovyjadreni.cz/vodafone/`.

  Zdroj: [checklist projektanta](https://github.com/bedjan/ssstp_duchcov_unofficial/blob/main/projekce/README.md); stáří záznamu je neznámé.
- **Další správci podle téhož checklistu** — [checklist projektanta](https://github.com/bedjan/ssstp_duchcov_unofficial/blob/main/projekce/README.md):
  - elektronicky: ČD-Telematika (`vyjadreni.cdt.cz`), ELTODO (`ezadost.eltodo.cz`, poplatek nejasný), Veolia Energie (`zadosti.vecr.cz`);
  - zpoplatněno: České Radiokomunikace (`cra.cz/vyjadreni-o-existenci-siti`), Coprosys, StarNet.
- **Coprosys:** účtuje 300 Kč bez DPH za samostatné PDF vyjádření (viz předchozí poznámky) — [coprosys.cz](https://www.coprosys.cz/vyjadreni-k-existenci-siti/)

#### 3D. Vodárny
- **PVK (Praha) a BVK (Brno):** vyhledávání nevrátilo žádnou stránku pvk.cz ani bvk.cz o vyjádření k existenci sítí, ani jejich poplatky. Zdroje dávají jen obecný kontext — [souhrn vyhledávání – banky.cz](https://www.banky.cz/clanky/zasitovani-pozemku-vodovodni-a-kanalizacni-pripojka/)
- **Platnost:** vyjádření provozovatelů vodovodů a kanalizací bývají časově omezená, typicky na zhruba 12 měsíců — [banky.cz](https://www.banky.cz/clanky/zasitovani-pozemku-vodovodni-a-kanalizacni-pripojka/)
- **VAK Pardubice (příklad vyjádření):**
  - obsahuje přibližný zákres sítí v území;
  - platí 24 měsíců (v příkladu do 3. 4. 2027);
  - platí jen pro zakreslené zájmové území a uvedený účel a pozbývá platnosti při změně území či účelu.

  Zdroj: [VAK Pardubice – vyjádření (pardubice.eu)](https://pardubice.eu/data/files/1d/c99/1e830f46c680ecbf2abf97a77057355104c/11-vak.pdf)
- **VHOS Litomyšl:**
  - vyjádření obsahuje zákres a umožňuje vytyčení sítí na místě před zpracováním PD;
  - nenahrazuje vyjádření ani souhlas provozovatele k projektové dokumentaci;
  - podle jiného vzoru zákres nemusí obsahovat všechny přípojky.

  Zdroje: [VHOS – úřední deska Litomyšl](https://www.litomysl.cz/soubor/17863619705428262_mesto_litomysl_uredni_deska_vhos.pdf); [vzor zákresu – příloha DP ČVUT](https://dspace.cvut.cz/bitstream/handle/10467/99228/F3-DP-2022-Ruzicka-Vojtech-priloha-Vyjadreni%20k%20existenci%20siti.pdf)
- **SčVK (Severočeské vodovody a kanalizace):** elektronický formulář `zadosti.scvk.cz` má i samostatnou volbu „dgn soubory“, tedy vektorový výdej sítí — [checklist projektanta](https://github.com/bedjan/ssstp_duchcov_unofficial/blob/main/projekce/README.md)
- **Vytyčení za úplatu:** vlastník vodovodu nebo kanalizace může za úplatu vyznačit směr a hloubku potrubí v PD nebo je vytyčit na místě. Souhrn neidentifikoval přesný předpis, pravděpodobně jde o zákon č. 274/2001 Sb. — [zákon č. 274/2001 Sb. (epravo.cz)](https://www.epravo.cz/top/zakony/sbirka-zakonu/zakon-ze-dne-10-cervence-2001-o-vodovodech-a-kanalizacich-pro-verejnou-potrebu-a-o-zmene-nekterych-zakonu-zakon-o-vodovodech-a-kanalizacich-2654.html)
- **Letiště Praha:** vydává vyjádření o existenci sítí zdarma — [prg.aero](https://www.prg.aero/en/statement-network-existence)

#### 3E. Agregátory a platformy pro hromadné podání
- **UtilityReport:**
  - **Postup:** uživatel se registruje na webovém portálu MAWIS, zadá údaje o sobě a stavbě a zakreslí zájmové území na mapě. Aplikace vygeneruje seznam všech dotčených správců a hromadně připraví žádosti (PDF); údaje se vyplňují jen jednou — [TZB-info: UtilityReport je snadnou… cestou](https://www.tzb-info.cz/facility-management/19016-utilityreport-je-snadnou-rychlou-a-on-line-cestou-k-vyjadreni-k-existenci-siti); [TZB-info: UtilityReport přichází s novinkami](https://www.tzb-info.cz/facility-management/20806-utilityreport-online-nastroj-pro-vyjadreni-k-existenci-siti-prichazi-s-novinkami); [estav.cz](https://www.estav.cz/cz/7584.utilityreport-nastroj-ktery-setri-cas-kupujicim-i-majitelum-pozemku)
  - **Napojení:** na podatelnu skupiny ČEZ — [estav.cz](https://www.estav.cz/cz/7584.utilityreport-nastroj-ktery-setri-cas-kupujicim-i-majitelum-pozemku) — a na systém PPD — [Asseco](https://ce.asseco.com/files/ce/products/product_sheets/23_PP_CS_A4_cz.pdf)
  - **Zdarma:** díky spolupráci s krajskými úřady lze podat až **3 hromadné žádosti ročně zdarma** se základními funkcemi. Jiný zdroj uvádí, že veřejná správa může službu nabízet veřejnosti zdarma. Zdroje jsou pravděpodobně starší a ceny placených tarifů neuvádějí — [TZB-info 19016](https://www.tzb-info.cz/facility-management/19016-utilityreport-je-snadnou-rychlou-a-on-line-cestou-k-vyjadreni-k-existenci-siti); [TZB-info 20806](https://www.tzb-info.cz/facility-management/20806-utilityreport-online-nastroj-pro-vyjadreni-k-existenci-siti-prichazi-s-novinkami)
  - **Varianta pro města:** existuje jako „UtilityReport pro Města“ (`mawis.eu/utilityreport/mesta/`) — [checklist projektanta](https://github.com/bedjan/ssstp_duchcov_unofficial/blob/main/projekce/README.md)
- **MAWIS:** službu provozuje HRDLIČKA spol. s r.o. (+420 251 618 458, info@mawis.eu). Veřejný ceník jsem nenašel. Firma Mawis Trade s.r.o. (IČ 28635248) je jiný subjekt — [MU – seznam dotčených operátorů (zakázka)](https://zakazky.muni.cz/document_128232/ff3d6bcbd60be634fc083c84ee6c9ef5-sezam-dotcenych-operatoru-a-vlastniku-docx); [podnikatel.cz](https://www.podnikatel.cz/rejstrik/mawis-trade-s-r-o-28635248/)
- **CAD Studio – „Vyjadřovací portál“:** software pro **správce** sítí, ne pro žadatele. Podle zprávy vyřizuje desetitisíce žádostí ročně, mezi referencemi je ELTODO — [CADforum](https://www.cadforum.cz/forum-archive/forum-posts/vyjadrovaci-portal-od-cad-studia-vyridi-desetitisi-25211.html); [CAD Studio – reference ELTODO](https://www.cadstudio.cz/dl/CADstudio_reference_ELTODO.pdf)
- **Zákonná lhůta:** podle jednoho zdroje z okruhu UtilityReport je to 30 dnů. Předpis zdroj nespecifikuje — [estav.cz](https://www.estav.cz/cz/7584.utilityreport-nastroj-ktery-setri-cas-kupujicim-i-majitelum-pozemku)

#### 3F. Souhrnná tabulka (z citovaných zdrojů výše)

| Správce | Kanál | Poplatek | Forma a lhůta |
|---|---|---|---|
| ČEZ Distribuce (+ ČEZ ICT, Telco Pro) | Geoportál `geoportal.cezdistribuce.cz` | zdarma (TZ ČEZ) | online, e-mail; lhůta neověřena |
| EG.D | www.egd.cz (sdělení; souhlas v OP zvlášť) | neověřeno | „sdělení“ není vyjádřením pro řízení |
| PRE Distribuce | neověřeno | neověřeno | informace o existenci + situace |
| GasNet | „Distribuce plynu online“ (`dpo.gasnet.cz`) | zdarma, vč. vytyčení | automaticky generované PDF |
| PPD | `e-portal.ppdistribuce.cz` (napojen na UtilityReport) | neověřeno | neověřeno |
| CETIN (vč. Nordic Telecom od 4/2025) | online formulář | 0,00 Kč | elektronicky |
| T-Mobile | `ochranasiti.t-mobile.cz/vyjadreni/` | neověřeno | elektronicky |
| Vodafone | `zadostovyjadreni.cz/vodafone/` | neověřeno | elektronicky |
| PVK, BVK | neověřeno | neověřeno | neověřeno |
| VAK Pardubice (příklad) | neověřeno | neověřeno | platnost 24 měsíců |
| SčVK | `zadosti.scvk.cz` (vč. DGN) | neověřeno | elektronicky |
| Coprosys, České Radiokomunikace, StarNet | web/formulář | zpoplatněno (Coprosys 300 Kč bez DPH) | — |

### Inferences
- **Automatizace podání:** podání lze z velké části automatizovat:
  - většina velkých správců má webový formulář;
  - ČEZ přijímá požadavky z externích portálů;
  - UtilityReport už hromadné podání nabízí a je napojen na ČEZ a PPD.

  Strojová API pro žadatele (REST) jsem ale u žádného distributora nenašel. Produkt by podání buď robotizoval přes webové formuláře (křehké, s možným rozporem s podmínkami portálů), nebo by spolupracoval s UtilityReport či MAWIS jako přímým konkurentem nebo partnerem.
- **Konkurence a partnerství:** UtilityReport je přímý konkurent v kroku „seznam správců → hromadná žádost“ a má výhodu kanálu přes kraje (3 žádosti zdarma). Prostor pro odlišení je ve vytěžení došlých PDF (podmínky, ochranná pásma, body napojení), propojení s KN/DTM a hlídání lhůt a platnosti (12–24 měsíců).
- **Odlišné výstupy podle nového stavebního zákona:** výstupy se rozpadají na tři typy:
  - (a) informativní sdělení o existenci (zdarma a rychle);
  - (b) souhlas s činností v ochranném pásmu (zvláštní žádost);
  - (c) podmínky připojení (žádost o připojení).

  Report musí uživateli jasně říct, který typ dokladu má a který ještě potřebuje.

### Gaps
- **Neověřeno – distributoři a vodárny:**
  - portál, poplatek a lhůta PVK, BVK a obecně velkých vodáren (SmVaK, VAS, VaK Jižní Čechy aj.);
  - poplatky a lhůty EG.D, PRE, PPD, T-Mobile a Vodafone;
  - zda „zadostovyjadreni.cz“ je platforma třetí strany, kdo ji provozuje a zda obsluhuje i jiné správce.
- **Neověřeno – UtilityReport/MAWIS:** placené tarify a ceny, aktuální počet napojených správců, API pro partnery.
- **Lhůty:** přesný zákonný základ 30denní lhůty pro vyjádření vlastníků technické infrastruktury podle zákona č. 283/2021 Sb. a důsledek jejího nedodržení.
- **Srovnání se Slovenskem:** Slovensko má státní e-službu „Žiadosť o vyjadrenie k existencii sietí“ (NASES). Viděl jsem jen titulek výsledku, obsah jsem neověřil — [nases.gov.sk](https://nases.gov.sk/en/sluzby/ziadost-o-vyjadrenie-k-existencii-seti)

## 4. Portál DMVS / DTM krajů v roce 2026: co projektant získá, API (WMS/WFS), služba R49 a nástroj „SEMAFOR“

### Takeaway
DTM běží v produkčním provozu ve všech krajích od 1. 7. 2024.
- **Veřejné rastrové služby:** IS DMVS je publikuje celostátně, bez přihlášení a zdarma: WMS a WMTS `dtm_ti_ver` (technická infrastruktura) a `dtm_di_ver` (dopravní infrastruktura) na `dmvs.cuzk.gov.cz/api/…`. Podle vývojáře třetí strany vrací GetFeatureInfo typ sítě a správce. **WFS pro data DTM neexistuje**, WFS je jen pro evidenční data DMVS.
- **Vektorová data:** projektant je získá z veřejných datových sad v JVF DTM. Neveřejnou část dostane na žádost s doložením oprávnění a schválením krajem. Webové služby R20a/R20b slouží k výdeji neveřejných dat.
- **Změny 2026:** od 5. 1. 2026 se data o TI včetně neveřejné části, ochranných pásem a záměrů vydávají i „autorizovaným osobám“. Automatické ověření autorizace přes registry ČKA a ČKAIT je zatím plán.
- **SEMAFOR:** společná náhrada nefunkčního „zjištění území správců DTI“, které stavělo na částech DTI v DMVS. Algoritmus porovnává území s daty DTI v DTM a výstup má tři stavy, např. správce se skutečnou sítí v DTM, správce jen s ochranným pásmem. Zda už běží v produkci, nevím: verze 2.0.0 šla 1. 10. 2026 jen na integrační prostředí.

Architekt tedy dnes automaticky získá veřejný rastr a seznam správců (R49). Vektorovou neveřejnou geometrii zatím ne bez žádosti a schválení.

### Cited Findings

#### 4A. Stav DTM a veřejné mapové služby
- **Produkční provoz:** DTM je v produkčním provozu od 1. 7. 2024 ve všech krajích — [Zlínský kraj: DTM z pohledu projektanta (6. 6. 2025)](https://dtm.zlinskykraj.cz/portal/media/dokumenty/prezentace/02_DTM_Seminar_projektanti_062025_Krekova.pdf). Středočeský kraj 4. 6. 2026 oficiálně ukončil projekt DTM 1 — [Středočeský kraj – DTM](https://stredoceskykraj.cz/web/odbor-digitalizace/digitalne-technicka-mapa)
- **Služby IS DMVS (prezentace ČÚZK, 5. 6. 2025):**
  - provozuje WMS 1.3.0, WMTS 1.0.0 a WFS 2.0.0;
  - WFS jen pro evidenční data (`https://dmvs.cuzk.gov.cz/api/wfs/evidence-dmvs`), samotná data DTM se přes WFS neposkytují;
  - systém přebírá WMS/WMTS krajských mapových serverů a skládá je pro celou ČR;
  - veřejné služby fungují bez přihlášení (příklad WMTS `https://dmvs.cuzk.gov.cz/api/wmts/dtm_zps_plochy_seda`);
  - seznam adres služeb uvádí stránka „Poskytování dat DTM z IS DMVS“.

  Zdroje: [ČÚZK: DMVS_wms_20250605](https://cuzk.gov.cz/DMVS/O-IS-DMVS/Seminare,-skoleni/Prezentace-20250605/DMVS_wms_20250605.aspx); [ČÚZK: Poskytování dat DTM z IS DMVS](https://www.cuzk.gov.cz/DMVS/Poskytovani-dat.aspx)
- **Konkrétní veřejné vrstvy (ověřil vývojář třetí strany):**
  - WMS `https://dmvs.cuzk.gov.cz/api/wms/dtm_ti_ver` (TI) a `…/dtm_di_ver` (DI, podvrstvy `siln_dopr`, `dr_dopr`, `vod_dopr`, `let_dopr`…);
  - WMTS `…/api/wmts/dtm_ti_ver`;
  - CORS `*`, GetFeatureInfo vrací typ sítě a správce;
  - mapový portál `https://dmvs.cuzk.gov.cz/mapovy-portal`.

  Vývojář výslovně upozorňuje, že pokrytí a aktualizace závisí na kraji, nejsou zde všechny sítě ani hloubky a nejde o náhradu dotazu u operátora — [evidence-stromu-2: maplibre-research.md](https://github.com/mvappshub/evidence-stromu-2/blob/main/docs/maplibre-research.md); [map-wms-definitions.ts](https://github.com/mvappshub/evidence-stromu-2/blob/main/src/lib/map-wms-definitions.ts)
- **Veřejná data od 1. 1. 2026:** změny v DMVS 1.16.1 souvisejí s novelou účinnou od 1. 1. 2026. Ve službě veřejných datových sad přibyl nový přístup k otevřeným datům a jedna operace už nevydává datové sady TI — [ČÚZK: Přehled změn IS DMVS 1.16.1](https://cuzk.gov.cz/DMVS/Portal-DMVS/Prehled-zmen-IS-DMVS-ve-verzi-1-16-1.aspx)

#### 4B. Výdej vektorových dat a webové služby
- **Struktura výdeje na Portálu DMVS:** veřejné datové sady, žádosti o neveřejná data, žádosti v zájmovém území, přehled žádostí a JVF DTM — [ČÚZK: Uživatelská příručka Portálu DMVS](https://www.cuzk.gov.cz/DMVS/Portal-DMVS/CUZK_DMVS_Portal_Uzivatelska-prirucka.aspx)
- **Žádost o neveřejná data:**
  - musí uvést účel užití, právní ustanovení a doklad o oprávnění;
  - veřejná data se vydávají automaticky, neveřejná až po schválení krajem.

  Zdroj: [Karlovarský kraj: metodická porada ÚP (20. 6. 2024)](https://kr-karlovarsky.cz/system/files/2024-06/24_06_20_Metodick%C3%A1_porada_UP_08_DTM_UAP_MH_w.pdf)
- **Webové služby výdeje:** existují služby R20a/R20b (výdej neveřejných dat) a R18a (čtení vyjadřovatelů) a ČÚZK prezentoval výdej dat přes webové služby (5. 6. 2025) — [ČÚZK: R20a](https://cuzk.gov.cz/DMVS/Popis-rozhrani/Popis-sluzeb/CUZK_DMVS_dokumentace_sluzby_R20aVydejNeverejn-(2).aspx); [ČÚZK: R20b](https://www.cuzk.gov.cz/DMVS/Popis-rozhrani/Popis-sluzeb/CUZK_DMVS_dokumentace_sluzby_R20bVydejNeverejnychD.aspx); [ČÚZK: R18a](https://www.cuzk.gov.cz/DMVS/Popis-rozhrani/Popis-sluzeb/CUZK_DMVS_dokumentace_sluzby_R18aCteniVyjadrovatel.aspx); [ČÚZK: Výdeje dat přes WS (5. 6. 2025)](https://cuzk.gov.cz/DMVS/O-IS-DMVS/Seminare,-skoleni/Prezentace-20250605/DMVS_Vydeje-dat-pres-WS_20250605.aspx); [ČÚZK: Popis služeb (5. 6. 2025)](https://cuzk.gov.cz/DMVS/O-IS-DMVS/Seminare,-skoleni/Prezentace-20250605/DMVS_PopisSluzeb_20250605.aspx)
- **Vlastníci dotčených nemovitostí:** verze IS DMVS 1.17.1 rozšířila okruh oprávněných žadatelů o neveřejná data i o ně — [ČÚZK: Přehled změn 1.17.1](https://cuzk.gov.cz/DMVS/Portal-DMVS/Prehled-zmen-IS-DMVS-ve-verzi-1_17_1.aspx)
- **Plzeňský kraj:** poskytuje registrovaným uživatelům (projektantům, urbanistům) výřezy dat DTM pro projekční a plánovací činnost — [Plzeňský kraj – služba pro projektanty](https://www.plzensky-kraj.cz/Framework/Document.ashx?ID=4863)
- **Jihočeský kraj:** projektant má podle zákona o zeměměřictví nárok na kompletní údaje o infrastruktuře, včetně neveřejné části. Prohlížečka JVF měla být dostupná zhruba v polovině října 2026 — [DTM Jihočeského kraje – aktuality](https://jck.krajdtm.cz/portal-jck/aktuality)

#### 4C. Změny výdeje v roce 2026 (aktualita ČÚZK a seminář Zlínského kraje 20. 5. 2026)
- **Výdej „autorizovaným osobám“:** údaje DTM kraje z neveřejné i veřejné části o objektech a zařízeních TI, jejich ochranných pásmech a záměrech se nově poskytují také „autorizovaným osobám 200/1994 Sb.“. Úprava IS DMVS měla jít do produkce 5. 1. 2026 — [ČÚZK: Úprava výdeje dat z DTM krajů (2026)](https://cuzk.gov.cz/Zememerictvi/Zememericke-cinnosti/Aktuality-pro-zememerice/2026/Uprava-vydeje-dat-z-DTM-kraju.aspx)
- **Plánované zjednodušení pro projektanty a zpracovatele ÚPD (seminář 20. 5. 2026):**
  - standardizovaný formulář žádosti a automatická kontrola autorizace;
  - předpokladem je API na rejstříky, které mají zajistit ČKAIT a ČKA;
  - jako dílčí řešení zmiňuje zákonnou možnost vydat neveřejná data DTM i osobám bez autorizace (souhrn nejasný);
  - výdej ve formátu DGN má být ve střednědobém horizontu ukončen.

  Zdroje: [ČÚZK (Binová): seminář pro projektanty, 20. 5. 2026](https://dtm.zlinskykraj.cz/portal/media/dokumenty/prezentace/05_CUZK_Binova_ZLK_seminar_pro_projektanty_20052026.pdf); [Zlínský kraj (Křeková): seminář 20. 5. 2026](https://dtm.zlinskykraj.cz/portal/media/dokumenty/prezentace/02_DTM_Seminar_projektanti_20052026_Krekova.pdf)
- **Novela vyhlášky a JVF (seminář 20. 5. 2026):**
  - JVF DTM 1.5.0.1 má být nasazen v listopadu 2026;
  - odstraní se režim kritické infrastruktury;
  - přibydou objekty PSPI a GIA;
  - nařízení GIA je účinné od 12. 5. 2026, produkční prostředí pro GIA je plánováno na listopad 2026.

  Zdroj: [ČÚZK (Binová), 20. 5. 2026](https://dtm.zlinskykraj.cz/portal/media/dokumenty/prezentace/05_CUZK_Binova_ZLK_seminar_pro_projektanti_20052026.pdf)
- **Semináře ČKAIT pro projektanty:** České Budějovice 26. 2. 2026 a Zlín 20. 5. 2026 — [DTM JčK – aktuality](https://jck.krajdtm.cz/portal-jck/aktuality); [ČKAIT: DTM z pohledu projektanta](https://www.ckait.cz/digitalni-technicka-mapa-z-pohledu-projektanta-1)

#### 4D. R49 („Zjištění území správců DTI“) a SEMAFOR
- **R49:** webová služba R49 je od verze 1.17.1 dostupná všem registrovaným subjektům. Území lze zadat seznamem parcel nebo polygonem (viz předchozí poznámky) — [ČÚZK: Přehled změn 1.17.1](https://cuzk.gov.cz/DMVS/Portal-DMVS/Prehled-zmen-IS-DMVS-ve-verzi-1_17_1.aspx); [ČÚZK: dokumentace R49](https://cuzk.gov.cz/DMVS/Popis-rozhrani/Popis-sluzeb/CUZK_DMVS_dokumentace_sluzby_R49ZjisteniUzemiSprav.aspx)
- **Verze 1.18:** rozšířila PDF výstup „Zjištění území správců DTI“ o mapu se zájmovým polygonem a dotčenými sítěmi. Formulář žádosti o výdej dat dostal další pole — [ČÚZK: Přehled změn IS DMVS 1.18](https://cuzk.gov.cz/DMVS/Portal-DMVS/Prehled-zmen-IS-DMVS-ve-verzi-1_18.aspx)
- **Verze 1.18.2:** do produkce 26. 6. 2026 (úpravy mapového okna v dialogu žádosti o správce, nové logo) — [ČÚZK: Portál DMVS](https://cuzk.gov.cz/DMVS/Portal-DMVS.aspx); [ČÚZK: Novinky DMVS](https://www.cuzk.gov.cz/DMVS/Novinky.aspx)
- **SEMAFOR (Jihočeský kraj, 1. 10. 2025):** připravuje se úprava zjišťování okruhu vlastníků sítí. Výstup se doplní o tzv. **semafor**, který rozliší:
  - vlastníka, který má v území skutečnou síť v DTM;
  - vlastníka, který má v území jen ochranné nebo bezpečnostní pásmo bez sítě v DTM.

  Zdroj: [DTM Jihočeského kraje – Aktuality DTM (1. 10. 2025)](https://geoportal.kraj-jihocesky.gov.cz/portal/media/Soubory/porady/su/2025/251001_3_Aktuality_DTM.pdf)
- **SEMAFOR (ČÚZK, 20. 5. 2026):**
  - zjištění správců podle částí DTI vymezených v DMVS se ukázalo jako nefunkční;
  - SEMAFOR je společná funkce, jejíž algoritmus porovnává území z DMVS s daty DTI v DTM;
  - výstup má tři stavy (jejich přesné názvy souhrn neuvádí).

  Zdroj: [ČÚZK (Binová), seminář pro projektanty 20. 5. 2026](https://dtm.zlinskykraj.cz/portal/media/dokumenty/prezentace/05_CUZK_Binova_ZLK_seminar_pro_projektanty_20052026.pdf)
- **Verze 2.0.0:** ČÚZK oznámil, že IS DMVS 2.0.0 se nainstaluje na integrační prostředí INTEG1 1. 10. 2026. Obsah změn souhrn neuvádí a nespojuje ho výslovně se SEMAFOREM — [Portál DMVS – úvod](https://dmvs.cuzk.gov.cz/); [ČÚZK: Přehled změn IS DMVS 2.0.0](https://cuzk.gov.cz/DMVS/Portal-DMVS/Prehled-zmen-IS-DMVS-ve-verzi-2_0_0.aspx)

### Inferences
- **Může architekt získat geometrii TI automaticky? (říjen 2026)**
  - **Ano, jako veřejný rastr:** WMS/WMTS `dtm_ti_ver` je zdarma, bez přihlášení, s GetFeatureInfo a CORS. Report tak může automaticky vložit mapový výřez sítí a seznam správců, které GetFeatureInfo vrátí.
  - **Seznam správců:** přes R49 po registraci. Do nasazení SEMAFORU v produkci je ale spolehlivost seznamu omezená (ČÚZK sám přiznal nefunkčnost).
  - **Vektorová geometrie:**
    - veřejná část: z veřejných datových sad (JVF DTM);
    - neveřejná část: jen jménem oprávněného projektanta, přes žádost s účelem a dokladem a se schválením kraje (lhůta neznámá). Formálně existují webové služby R20a/R20b. Plně automatický výdej projektantům čeká na API registrů ČKA/ČKAIT, které v květnu 2026 bylo jen plánem.
  - **Ani úplná DTM nenahrazuje vyjádření správců:** neuvádí kapacitu, hloubky ani všechny přípojky.
- **Kdy začít automatizovat:** nástup SEMAFORU (2.0.0 je na testu od 1. 10. 2026) a ukončení výdeje v DGN jsou signálem, že výdej se během 2026–2027 posouvá ke strojovému zpracování a JVF. Produkt by měl stavět na JVF DTM a na WMS, ne na DGN.

### Gaps
- **Neověřeno – SEMAFOR:**
  - přesné názvy tří stavů;
  - zda je SEMAFOR součástí verze 2.0.0 a kdy jde do produkce;
  - zda ho vrací i webová služba R49, nebo jen PDF/portál.
- **Neověřeno – výdej neveřejných dat:**
  - kdo jsou „autorizované osoby 200/1994 Sb.“ (souhrn je nejasný: autorizovaní architekti a inženýři podle zákona č. 360/1992 Sb., nebo ÚOZI);
  - zda je výdej neveřejných dat DTM zpoplatněn (zdroje to neuvádějí; v předchozích poznámkách „pravděpodobně zdarma“) a jaká je lhůta schválení krajem;
  - podmínky licence a dalšího šíření vydaných neveřejných dat.
- **Neověřeno – služby:** úplný seznam vrstev a URL krajských WMS a stránka „Poskytování dat DTM z IS DMVS“ (fetch nefungoval).

## 5. parcelgps.com a další komerční katastrální API pro ČR: co přeprodávají a za kolik

### Takeaway
**parcelgps.com** (Catastro GPS / Parcel GPS) je evropský agregátor parcel se zaměřením na Španělsko. Pro Česko vrací jen referenci parcely, GPS bod, obrys a výměru, hledá podle čísla, souřadnic nebo adresy (RÚIAN). Žádné vlastníky, LV, BPEJ ani omezení. Analytické endpointy (`/solar`, `/agro`, `/score`) ČR nepokrývají.

Ceny (vč. DPH):

| Tarif | Cena | Jednotek měsíčně |
|---|---|---|
| Free | 0 € | 250 |
| Developer | 19 € | 5 000 |
| Startup | 49 € | 15 000 |
| Growth | 99 € | 50 000 |
| Enterprise | od 300 € | dle smlouvy |

Pro ČR jde nejspíš o přebalení bezplatných otevřených dat ČÚZK. Zdroj geometrie pro ČR specifikace výslovně neuvádí, jen adresní vyhledávání přes RÚIAN.

Další nalezené české produkty:
- proprietární plugin „katastr“ pro Codexis (nad API KN a RÚIAN);
- open-source Hlídač ČÚZK;
- konektory WSDP na integrační platformě Integray;
- import z KN v SW DOMSYS.

Veřejný ceník komerčního API s vlastníky či LV jsem nenašel.

### Cited Findings
- **Identita a zdroje:** API se jmenuje „Catastro GPS API“, popis „Public API of Catastro GPS / Parcel GPS“. Server je `https://api.parcelgps.com`, autentizace `X-API-Key`. Španělská data pocházejí z vlastní kopie Dirección General del Catastro. Specifikace má verzi 2026-10-05, katalog jentic ji stáhl 12. 10. 2026 z `https://api.parcelgps.com/api/openapi.json` — [parcelgps OpenAPI (jentic-public-apis)](https://github.com/jentic/jentic-public-apis/blob/main/apis/openapi/parcelgps.com/main/2026-10-05/openapi.json); [meta.json](https://github.com/jentic/jentic-public-apis/blob/main/apis/openapi/parcelgps.com/main/2026-10-05/meta/meta.json)
- **Pokrytí ČR (měřeno proti produkci 1. 10. 2026):**
  - Czechia `CZ`: podle reference ano, podle souřadnic ano, podle adresy ano (RÚIAN), extra data „—“;
  - všechny země vracejí referenci, GPS bod (`latitud`, `longitud`), obrys (`poligono`) a výměru (`superficieParcela`).

  Zdroj: [parcelgps OpenAPI](https://github.com/jentic/jentic-public-apis/blob/main/apis/openapi/parcelgps.com/main/2026-10-05/openapi.json)
- **Analytické a doplňkové endpointy:**
  - `/solar`, `/agro`, `/score` pokrývají jen ES, PV, NA, PT, FR, IT a DE, ostatní země dostanou 422 `CNV_COVERAGE`;
  - `/terrain` (Copernicus DEM GLO-30, Natura 2000/EEA, ERA5-Land) funguje i mimo tyto země, ale vyžaduje `lat`/`lng`;
  - `/ground-motion` (EGMS, EEA-39) stojí 1 jednotku.

  Zdroj: [parcelgps OpenAPI](https://github.com/jentic/jentic-public-apis/blob/main/apis/openapi/parcelgps.com/main/2026-10-05/openapi.json)
- **Ceník (měsíčně, vč. DPH; kvóta na organizaci):**

  | Tarif | Cena | Jednotek/měsíc | Požadavků/min | Navýšení za 1 000 jednotek (+21 % DPH) |
  |---|---|---|---|---|
  | Free | 0 € | 250 | 10 | 10 € |
  | Developer | 19 € | 5 000 | 60 | 5 € |
  | Startup | 49 € | 15 000 | 120 | 4 € |
  | Growth | 99 € | 50 000 | 300 | 2,50 € |
  | Enterprise | od 300 € | dle smlouvy | 300+ | dle smlouvy |

  - **Účtování jednotek:** jednotky se účtují jen za úspěšné odpovědi (2xx) s daty. Kvóta se resetuje 1. den měsíce.
  - **Po vyčerpání:** pokračuje se z předplaceného kreditu (dobití 5–1 000 €). Bez kreditu API vrací 429 `KEY_AUTH_004`.

  Zdroj: [parcelgps OpenAPI](https://github.com/jentic/jentic-public-apis/blob/main/apis/openapi/parcelgps.com/main/2026-10-05/openapi.json)
- **Katalog public-apis:** uvádí ParcelGPS jako „European cadastral parcels by reference or point: coordinates, area, land use and geometry“ s autentizací `apiKey` — [public-apis README](https://github.com/public-apis/public-apis)
- **Codexis – plugin „katastr“:** ATLAS GROUP, verze 1.8.0, licence PROPRIETARY, závisí na Codexis. Obaluje API KN a RÚIAN, tedy parcely, stavby, jednotky, řízení, sousedy a okolí. Výslovně uvádí, že API nemá vlastníky a pro vlastnictví odkazuje na úřední výpis LV. Cenu jsem nezjistil — [plugin.json](https://github.com/atlasgroupcz/codexis-marketplace/blob/main/plugins/katastr/.claude-plugin/plugin.json); [api.md](https://github.com/atlasgroupcz/codexis-marketplace/blob/main/plugins/katastr/skills/katastr/references/api.md)
- **Hlídač ČÚZK:** open-source (AGPL-3.0), provozuje se na vlastním serveru s vlastním bezplatným klíčem API KN. Hlídá plomby, změny LV, BPEJ a ochrany u parcel, staveb, jednotek a práv stavby. Upozorňuje, že není oficiální službou ČÚZK — [Hlídač ČÚZK – úvod](https://github.com/petrleocompel/hlidac-cuzk/blob/main/site/uvod.md)
- **Integray:** integrační platforma nabízí konektory na služby ČÚZK, např. `CuzkDocumentRequest` 3.0, `CuzkPropertyOverviewRequest` 3.1 a `CuzkCadastralTerritoriesReader` 3.0 (podle názvů nad WSDP). Ceny ani podmínky jsem nečetl — [Integray – CuzkDocumentRequest](https://learn.integray.app/connectoracademy/connectors/CuzkDocumentRequest/3.0/); [Integray – CuzkPropertyOverviewRequest](https://learn.integray.app/connectoracademy/connectors/CuzkPropertyOverviewRequest/3.1)
- **DOMSYS:** SW pro správu domů má funkci importu z katastru nemovitostí — [DOMSYS – podpora](https://podpora.domsys.cz/dalsi-uzitecne-funkce/domsys-cuzk)
- **Předplatné API výpisů:** vyhledávání nenašlo žádnou předplatnou API službu, která by automaticky stahovala výpisy LV podle parcel, ani její ceník. Doloženy jsou jen kanály ČÚZK: DP/WSDP, e-shop a CzechPOINT — [souhrn vyhledávání; ČÚZK: Výstupy z KN poskytované prostřednictvím DP](https://www.cuzk.gov.cz/Katastr-nemovitosti/Poskytovani-udaju-z-KN/Dalkovy-pristup/Vystupy-z-KN-poskytovane-prostrednictvim-DP.aspx)
- **Další weby:** v checklistu projektantů figuruje i ikatastr.cz („mapa, info z katastru nemovitostí“) — [checklist projektanta](https://github.com/bedjan/ssstp_duchcov_unofficial/blob/main/projekce/README.md). Soukromý web aikatastr.cz viz předchozí poznámky.

### Inferences
- **Hodnota parcelgps pro český report:** pro ČR nepřidává nic, co by nebylo zdarma z ČÚZK (INSPIRE CP WFS / otevřená data, RÚIAN), jen jednotné celoevropské rozhraní. Jeho EU vrstvy (Copernicus DEM, Natura 2000, EGMS, ERA5) jsou také volně dostupné z původních zdrojů. Jako dodavatel by dával smysl jen při expanzi mimo ČR.
- **Trh s vlastnickými daty:** veřejně oceněný komerční přeprodej vlastnických dat a LV přes API v ČR prakticky neexistuje. Kombinace placeného WSDP (100 Kč za LV), zákazu sdílení klíčů API KN, GDPR a zákazu vytěžování Nahlížení drží vlastnická data u ČÚZK. Vlastnická data proto nejsou konkurenční výhodou, kterou by šlo levně koupit. Produkt je musí brát z WSDP na účet uživatele (nebo provozovatele s přeúčtováním).
- **Hlavní konkurence:** na úrovni dat jsou to integrátoři (Codexis, Integray) a hlídací služby. Na úrovni sítí je to UtilityReport/MAWIS (sekce 3).

### Gaps
- **Neověřeno – jiné produkty:** ceny pluginu Codexis „katastr“, konektorů Integray a importu DOMSYS; zda některý z nich vrací vlastníky (přes WSDP) a za kolik.
- **Neověřeno – parcelgps:** podmínky (zda v ČR uvádí atribuci ČÚZK a pod jakou licencí přebírá data) a aktuální ceník na `parcelgps.com/developers`. Web byl blokovaný, ceník mám jen ze specifikace.
- **Nevyhledáno (limit vyčerpán):** další české služby typu „report o pozemku“ (např. realitní datové firmy, cenové mapy) a jejich API.
