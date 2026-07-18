# BULO → systém pro celý životní cyklus stavby: strategie

> Reakce na nápad „rozpracovat BULO pro celý archi trh a vytvořit celý systém, kde bude vše v rámci stavby". Stav dnes: BULO = frontendové demo „trvalý záznam historie nemovitosti" (časová osa oprav/závad/revizí, dokumenty, sdílení, QR, PDF report; localStorage, bez backendu). Navazuje na [analýzu děr](./sob-ai-dira.md) a [plán appky](./sob-appka-mvp.md).

---

## 0. ⚠️ Nejdřív jméno: BULO vs. BULDO

V ČR existuje stavební aplikace **BULDO** ([buldo.cz](https://www.buldo.cz/stavebni-denik-od-historie-k-digitalizaci/)) — elektronický stavební deník a řízení staveb. Jeden znak rozdílu, stejný obor, stejná země = riziko zaměnitelnosti (ochranné známky, SEO, doslova si vás budou plést zákazníci). **Než investuješ do značky: zkontroluj rejstřík ÚPV a vážně zvaž přejmenování** (nebo ověř, že třídy a služby nekolidují a že to riziko vědomě bereš). Udělej to teď — přejmenování za dva roky bude bolet stonásobně.

---

## 1. Hlavní teze: vize správná, pořadí rozhoduje

„Vše v rámci stavby v jednom systému" je správná **desetiletá vize** — ale jako strategie prvního roku je to past. Všechny platformy, které to dokázaly, začaly jedním úzkým klínem: PlanRadar vadami a nedodělky, Procore projektovým řízením. Naopak sólo zakladatelé, co stavěli „vše pro všechny" hned, umřeli na šířku: 10 modulů × polovičatě > nikdo neplatí.

**Klíčový insight z konkurenční mapy:** stavební fáze je obsazená ([PlanRadar](https://www.planradar.com/cs/software-pro-rizeni-stavebnich-projektu/) — vady, předávky, kontroly; BULDO — deník; Stavario a další). Ale **nikdo nedrží data budovy PO předání**. PlanRadar končí kolaudací; facility systémy (FaMa+, Chastia, INSIO) jsou enterprise pro velké areály; SVJ, majitelé RD a malí developeři nemají nic. **BULO stojí přesně na téhle hraně — moment předání je vstupní brána k celoživotním datům budovy.** To je tvůj klín, a mimochodem přesně to, co už máš postavené (časová osa, dokumenty, sdílení).

Regulatorní vítr do zad: elektronický stavební deník už je povinný u nadlimitních veřejných zakázek (zákon 283/2021 Sb., vyhláška 131/2024 Sb. — [elegis](https://www.elegis.cz/novinky/elektronicky-stavebni-denik-zakon), [epravo](https://www.epravo.cz/top/aktualne/stavebni-denik-z-pohledu-legislativy-a-moznosti-jeho-vedeni-online-112923.html)), deník se archivuje 10 let po kolaudaci a EU tlačí koncept „digital building logbook" / renovačních pasů (EPBD). Digitální záznam budovy přestává být nice-to-have.

---

## 2. Kdo platí (a kdo ne) — „archi trh" po fázích

| Fáze | Kdo drží peníze | Co koupí |
|---|---|---|
| Návrh + povolení | stavebník, ateliér | Povolovák (viz [appka MVP](./sob-appka-mvp.md)) — jiný produkt, později větev systému |
| Realizace | GC, TDI, developer | deník, vady, kontroly — **obsazeno** (PlanRadar, BULDO) — sem až naposled |
| **Předání** | **developer / stavitel / TDI** | **protokoly, vady, dokumentace — tvůj klín č. 1** |
| **Záruka (2–5 let)** | **developer (reklamace ho bolí)** | **řízení reklamací — klín č. 2** |
| **Provoz (50 let)** | SVJ, majitel, správce | pasport, revize, údržba — dnešní BULO, klín č. 3 |
| Prodej nemovitosti | majitel, realitka | report historie (Carfax moment — tady B2C zaplatí) |

Pozor na čistý B2C („Carfax pro domy" pro majitele): lidi neplatí за vedení záznamů dobrovolně — platí v momentech (předání, reklamace, prodej). Proto správný motor je **B2B2C**: developer/stavitel zaplatí předání, majitel dostane pas bytu zdarma → a zůstane v něm bydlet.

---

## 3. Plán po klínech

### Krok 0 (hned, 2–4 týdny): základy
- **Backend**: Supabase (auth, DB, storage) — z demo reálná multi-user appka (stack už znáš, v repu je).
- **Jméno**: vyřešit kolizi BULDO (rejstřík ÚPV, rozhodnutí, případný rebrand).
- **Právní kostra předávacího protokolu**: dle NOZ — soupis zjevných vad a nedodělků, podpisy, lhůty ([právní rámec převzetí stavby](https://radekmotzke.cz/stavebni-smlouvy/predani-stavby/)).

### Klín 1 (měsíc 1–6): Digitální předání jednotky/domu
Modul pro developery, stavitele RD a TDI:
- předávací protokol s el. podpisem, soupis vad s fotkami, odpovědnostmi a lhůtami,
- předání kompletní dokumentace (kolaudace, revize, záruční listy, návody) do pasu jednotky,
- QR kód bytu/domu → kupující dostává „rodný list" nemovitosti (tvoje dnešní BULO!).
**Cena**: per předaná jednotka (190–490 Kč) nebo balíček; developer s 60 byty = 12–30 tis. Kč — no-brainer proti dnešnímu Excelu a šanonům.
**Prodej**: 10 malých developerů a stavitelů RD z tvojí sítě; TDI jako multiplikátor (předávají desítky staveb ročně).

### Klín 2 (měsíc 6–18): Záruka a reklamace
- Majitel klikne vadu v pasu → letí zhotoviteli; developer vidí přehled reklamací všech projektů, lhůty, statistiky vad (zlato pro jeho další stavby).
- Tím se BULO stává denně používaným nástrojem obou stran — retence.
**Cena**: předplatné developera (990–4 990 Kč/měs. dle počtu jednotek v záruce).

### Klín 3 (měsíc 12–24): Provoz
- Plán revizí (elektro, plyn, komín, kotel) s notifikacemi, údržba, náklady — dnešní BULO funkce, teď s reálnými uživateli.
- Balíček pro SVJ (výbor spravuje dům, doklady pro schůze) a pro správce menších portfolií.
- **Report při prodeji** (Carfax moment): kompletní historie = vyšší důvěra kupce; 490–990 Kč/report, případně partnerství s realitkami (Bezrealitky prodávají NemoReport od 690 Kč — trh na reporty existuje).

### Klín 4 (rok 2+): teprve teď šířka
- Zpětně do realizace (fotodokumentace průběhu, kontrolní dny — střet s PlanRadarem už se zákaznickou základnou a odlišením „my držíme data i po kolaudaci").
- Dopředu: pasport + energetika + dotace (díra 3 z [AI analýzy](./sob-ai-dira.md)), Povolovák jako sesterská větev (díra 1).
- **Synergie SOB**: každá stavba/prvek od SOB dostane BULO pas automaticky (QA data z tisku rovnou v pasu — unikátní prodejní argument obou firem).

---

## 4. Čísla (poctivě)

- Klín 1 solo: 1 000–3 000 předaných jednotek/rok × ~300 Kč + pár developerských předplatných = **první stovky tisíc až ~1,5 mil. Kč/rok** — appka na úrovni „platí mi školu".
- Klín 1+2+3 s 2–3 lidmi do 3 let: **2–8 mil. Kč ARR** realistické, když se chytne aspoň 30–50 developerů/stavitelů; strop v ČR vyšší při expanzi na SK/PL.
- Strategická hodnota > ARR: kdo drží data budov, je zajímavý pro realitky, banky, pojišťovny i stát (digital building logbook). To je exit/partnership opce.
- Kill-kritérium: pokud po 6 měsících aktivního prodeje nemáš 5 platících developerů/stavitelů, klín nefunguje — vrať se k Povolováku nebo přeskoč rovnou na SVJ/revize.

---

## 5. Shrnutí

1. Vize „vše v rámci stavby" ano — ale jako sekvence klínů, každý si na sebe vydělá.
2. Tvůj unikátní klín není stavba (obsazeno), ale **předání a život budovy po něm** — přesně tam už BULO míří.
3. Motor je B2B2C: platí developer/stavitel, majitel dostává pas zdarma a zůstává.
4. Hned vyřeš: backend (Supabase), kolizi jména s BULDO, právně správný protokol.
5. Prvních 5 platících developerů/stavitelů > jakýkoli další feature.

*Verze 1.0, červenec 2026.*
