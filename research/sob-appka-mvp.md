# Appka: co už je obsazené, co je volné, a MVP na 90 dní

> Doplněk k [analýze děr v AI](./sob-ai-dira.md). Otázka: „a co vytvořit appku, když je volný trh?" Odpověď: trh pozemkových reportů už volný NENÍ — volná zůstává vrstva nad ním. Tady je mapa a konkrétní plán.

---

## 1. Nejdřív studená sprcha: co už v ČR existuje

| Nástroj | Co dělá | Co to znamená pro tebe |
|---|---|---|
| [Pozemkov.cz](https://pozemkov.cz/) | katastr + územní plán + sítě + rizika na jednom místě | „pozemkový report" je obsazený |
| [GeoPas.cz](https://www.geopas.cz/) | data o 22 mil. parcel, rizika a příležitosti | dtto |
| [NemoReport](https://www.nemoreport.cz/) (prodává i [Bezrealitky od 690 Kč](https://www.bezrealitky.com/service-centre/nemo-report)) | prověření nemovitosti před koupí | důkaz, že lidi za reporty platí — ale niku drží oni |
| OnGeo, [PozemeCheck](https://pozemecheck.cz/) | reporty limitů / ruční prověření | dtto |
| [DevCheck](https://devcheck.pl/) (PL) | „co tady jde postavit?" — HPP, KPP, parkování, záplavy | polský vzor přesně té feasibility appky; hrozí vstup do ČR |
| [JEDNOTKA.PRO](https://jednotka.pro/) | „automatická AI územně analytická jednotka" | první český pokus o AI vrstvu nad ÚP |
| [UtilityReport (Mawis)](https://mawis.eu/) | hromadné žádosti o vyjádření správců sítí | kus povolovacího procesu už řeší |
| [Národní geoportál územního plánování](https://uzemniplanovani.gov.cz/) | státní agregace územních plánů | zdroj dat, ne konkurent |

**Závěr:** surová data o parcele = červený oceán. Volné zůstávají dvě vrstvy NAD daty:
1. **Interpretace pro profíky** — z regulativů spočítat, co přesně lze postavit (obálka, HPP, výtěžnost, proforma) — český TestFit. Konkurence se blíží (DevCheck, Jednotka), okno ~1–2 roky.
2. **Proces povolení** — provést stavebníka/projektanta chaosem řízení do 2030. Tam nedělá nikdo nic (UtilityReport řeší jen sítě).

---

## 2. Doporučená appka: „Povolovák" — AI kompletátor stavebního řízení

**Proč tahle a ne feasibility:** (a) je skutečně prázdná; (b) žádné geodata-plumbing — LLM-native práce s texty (zákon, vyhlášky, metodiky — vše veřejné), přesně tvůj skill-set Next.js + AI API; (c) zákazníci jsou tvoje síť (ateliéry, spolužáci v praxi, malí stavitelé); (d) všechno, co se naučíš, použiješ pro SOB i development (povolování je jejich úzké hrdlo); (e) stát právě přiznal, že do 2030 pořádek neudělá.

### Co appka dělá (v pořadí vývoje)
1. **Wizard záměru → checklist**: vyberu typ záměru (RD, přístavba, garáž, vrt…) a obec → dostanu přesný seznam dokladů, dotčených orgánů a vyjádření, které potřebuju, s odkazy a šablonami. (Čistě pravidlový základ + AI vysvětlování.)
2. **Kontrola úplnosti**: nahraju PDF dokumentace a vyjádření → AI zkontroluje, co chybí, co expiruje, co si úřad nejspíš vyžádá. („Předodevzdávková kontrola" — tohle šetří měsíce vracených žádostí.)
3. **Lhůty a podání**: hlídání lhůt ze zákona, generování průvodních zpráv a podání, stav řízení na jednom místě.
4. (Později) API na Portál stavebníka / datovku, until pak import vyjádření z UtilityReportu.

### MVP za 90 dní (při škole, večery)
- **Týden 1–2: validace bez kódu.** Nabídni 10 lidem (ateliéry, stavitelé RD z FB skupin „Stavíme svépomocí") ruční službu „zkompletuju a zkontroluju vám dokladovku za 2 000 Kč". Když si to 5 lidí koupí, stavíš. Když ne, víš to za dva týdny zadarmo.
- **Týden 3–8: checklist wizard + AI kontrola PDF** (Next.js + LLM API + úložiště; žádná mapa, žádná geodata).
- **Týden 9–12: prvních 20 platících.** Cena: 490 Kč/projekt nebo 990–2 900 Kč/měs. pro ateliéry. Obsah-marketing: „jak na stavební povolení 2026" — chaos generuje obrovský search traffic; piš odpovědi, které nikdo neumí.
- **Náklady:** ~0 Kč kromě času (LLM API v řádu stokorun/měs., hosting zdarma tier).

### Poctivý strop
Česká profesní nika: 1 000–3 000 platících = **1–5 mil. Kč ARR do 2–3 let** při 1–2 lidech. Není to unicorn — je to výborná první appka: cash, jméno v oboru, a znalost povolování, kterou pak zúročíš v SOB i developmentu. (A kdyby přišel stát nebo velký hráč — malý SaaS s uživateli je koupitelný.)

### Rizika
- Stát dodá funkční systém dřív (nepravděpodobné — odklad na 2030 si právě odhlasovali; a i funkční portál neřeší „co mám doložit", jen „kam to nahrát").
- Odpovědnost: appka je asistent, ne právní služba — disclaimer + finální kontrola člověkem; neprodávej „garanci povolení".
- Fragmentace úřadů: začni typovými záměry (RD a drobné stavby), ne bytovkami.

---

## 3. Varianta B (pokud tě táhne mapa víc než proces): „Feasibility PRO"

Český TestFit pro profíky: parcela → obálka zástavby z regulativů + HPP/KPP + hrubá výtěžnost a proforma. Rozdíl proti Pozemkov/GeoPas: oni **vypisují** data, ty **počítáš** co lze postavit a co to vynese.
- Data: [ČÚZK REST API katastru](https://api-kn.cuzk.gov.cz/), RÚIAN (SHP týdně), [IPR Praha open data](https://www.iprpraha.cz/clanek/1313/otevrena-data-open-data), standardizované nové ÚP (metodika 2023 → strojově čitelnější).
- MVP: jen Praha (digitální plán) + výpočet obálky a HPP + PDF studie za 1 990 Kč pro investory/realitky.
- Pozor: DevCheck a JEDNOTKA.PRO ti dýchají na záda; okno je kratší než u Povolováku. A geodata-plumbing je 70 % práce.

**Vyber jednu. Nedělej obě.** Můj tip je Povolovák (prázdnější trh, rychlejší validace, větší synergie) — ale pokud tě jako architekta víc baví geometrie a mapy, Feasibility PRO má taky smysl; rozhodni podle toho, u čeho vydržíš 18 měsíců.

---

## 4. Jak to zapadá do celku

- **Teď (škola):** Povolovák jako večerní appka = cash engine č. 2 vedle SOB Lab; validace za 2 týdny, MVP za 90 dní.
- **Rok 2–3:** Povolovák ti platí účty a učí tě povolování; SOB Lab jede podle [plánu](./sob-plan-5-let.md).
- **Rok 4+:** Povolovák + feasibility + SOB tisk = skládají se do „domu na klik" ([vize](./sob-ai-dira.md)). Appka není odbočka — je to první díl skládačky, který se dá postavit z pokoje na koleji.

*Verze 1.0, červenec 2026.*
