# BULO — vize a rozvrh funkcí

> Digitální pas budovy pro český mid-market. Lehčí než BIM/CAFM nástroje, hezčí a „asset-first"
> oproti účetním SVJ systémům. Sedí na regulační vlnu EU (Digital Building Logbook / renovační pas,
> povinnost členských států do 2026).

---

## 1. Hlavní myšlenka

**BULO = jeden trvalý záznam budovy, který přežije projekt i majitele.**

Trh má dvě patra a díru mezi nimi:

- **Pro / BIM nástroje** (Revit + BCF, Revizto, BIMcollab, Autodesk Construction Cloud, PlanRadar,
  Procore, Madaster) — řeší *projektovou* fázi, jsou těžké, drahé, BIM-centrické. Končí předáním.
- **SVJ / správa nemovitostí** (SVJsystem, iDES, DOMOVNÍK, Jirra, MojeNájmy) — řeší *provoz*, ale
  jsou účetně-administrativní, ošklivé, ne mobilní, neumí architekta na vstupu ani QR v terénu.
- **Spotřebitelský „Carfax pro domy"** v ČR prakticky neexistuje.

BULO obsadí **lifecycle aktiva**: pas vzniká u architekta, předá se klientovi a **žije dál** —
revize, opravy, náklady, energie, prodej. To pro nástroje nedělají: projektové končí předáním,
SVJ začínají až provozem a nedrží historii vzniku.

**Obchodní motor = B2B2C.** Platí profík (architekt / developer / správce SVJ), který budovu
zakládá a má důvod se vracet; majitel je koncový uživatel. Ne čistě B2C jednotlivý dům (slabá
ochota platit, žádný opakovaný spouštěč).

---

## 2. Mentální model

Pas je páteř. Role do něj „plní" daty přes kanály vázané na fázi života budovy.

```
                         ┌─────────────────────────────────────────┐
   ARCHITEKT  ─────────► │                                         │
   (kartotéka, návrhy)   │            PAS BUDOVY                    │
                         │   identita · dokumentace · vybavení      │
   ŘEMESLNÍK/REVIZÁK ──► │   historie · revize · náklady · energie  │ ──►  PŘEDÁNÍ / PRODEJ
   (QR, bez loginu)      │   komunikace                            │      (kurátorovaný výřez)
                         │                                         │
   MAJITEL / SVJ ──────► │   = trvalý, přenositelný při změně       │ ──►  KUPUJÍCÍ (read-only)
   (provoz, údržba)      │     vlastníka                            │
                         └─────────────────────────────────────────┘
        ▲                                  ▲
        └──────────  AI / boti  ───────────┘
          (čte PDF → plní pas, hlídá lhůty, píše reporty, odpovídá na dotazy)
```

---

## 3. Role (rozšíření dnešních ARCHITECT / CLIENT / CREATOR)

| Role | Kdo | Co dělá | Stav v kódu |
|------|-----|---------|-------------|
| **Architekt / projektant** | ateliér | kartotéka projektu, návrhy, povolení, předání | `ARCHITECT` ✅ |
| **Majitel / klient** | vlastník domu/bytu | vlastní pas, údržba, prodej | `CLIENT` ✅ |
| **Správce / SVJ** | výbor SVJ, BD, správce portfolia | spravuje *více* budov/jednotek, hlídá revize | dnes `CREATOR` → přejmenovat/rozšířit |
| **Řemeslník / revizní technik** | dodavatel v terénu | přes QR bez loginu zapíše práci/revizi + foto + termín další | QR landing `/q/[id]` ✅ |
| **Kupující / zájemce** | při prodeji | read-only sdílený výřez pasu | `/sdileno/[id]` ✅ |

> Hodně už existuje. Jde hlavně o **přerámování** `CREATOR` → `SPRÁVCE/SVJ` a o portfolio vrstvu.

---

## 4. Fáze života budovy (kdo je aktivní kdy)

1. **NÁVRH** — architekt zakládá pas = *kartotéka*: nahraje kompletní dokumentaci, návrhy
   (gallery), milníky, stavební povolení. Projektový kanál s klientem a týmem.
2. **REALIZACE** — výběr firmy (bids), stavební deník (zápisy přes QR od řemeslníků), sledování
   nákladů, komunikace o změnách.
3. **PŘEDÁNÍ** — *handover balíček*: kurátorovaný výřez pasu → klient; start záručních lhůt;
   nalepení QR štítku na dům.
4. **PROVOZ** — majitel / SVJ: plán a evidence revizí, údržba (QR zápisy), náklady, „co hoří"
   widget, energetika.
5. **PRODEJ / PŘEVOD** — report a sdílený pas pro kupujícího; převod vlastnictví, pas zůstává.

---

## 5. Pas budovy — sekce (páteř, trvá celý život)

| Sekce | Obsah | Stav |
|-------|-------|------|
| Identita & katastr | typ, adresa, parcela, vlastník | ✅ |
| Originální dokumentace | projektová dokumentace stavby (ne „složka", ale doložení vzniku) | ✅ |
| Technické vybavení & materiály | kotel, rozvody, okna… → směr k materiálovému pasu | ✅ inventory; + materiály |
| Historie | časová osa všech událostí (opravy, revize, závady) | ✅ entries |
| Revize & údržba | naplánované + provedené revize, zprávy, termíny další | ✅ reminders; + revize report + due |
| Náklady | databáze nákladů + napojené faktury | ✅ costs |
| **Energie & EPC** | EPC, SRI, renovační roadmap (soulad s EU) | ⬜ nové |
| Komunikace | jednotný kanál (viz §8) | ✅ consultations |

---

## 6. SVJ / portfolio vrstva (opakovaný příjem — klíčový wedge)

- **Účet správce drží více budov / jednotek.**
- **Portfolio dashboard:** všechny revize napříč domy, co je po termínu (dnešní „Vyžaduje
  pozornost" widget škálovaný na portfolio).
- **Samoobsluha rezidentů:** vidí svoji jednotku + revize a dokumenty domu (jako SVJsystem, ale
  asset-first a hezké).
- Reuse infrastruktury role `CREATOR`.
- **Pozn.:** multi-user a více budov reálně **vyžaduje backend + light auth** (viz §11).

---

## 7. Revize — terénní smyčka (odlišení od Revizio/INSPECTO)

Revize software (VivaRevize, Revizio, INSPECTO) *vytváří* revizní zprávy. BULO je **aktivum, které
je přijímá** a hlídá termíny:

1. QR na domě → technik naskenuje → **bez loginu** → vybere úkon (Oprava/Výměna/Revize…) ✅
2. připojí foto (`capture="environment"`) ✅ + nahraje revizní zprávu PDF ⬜
3. nastaví **termín další revize** ⬜ → automaticky padne do `reminders` → „co hoří"
4. zapíše se do `historie` pasu ✅

Volitelně později: lehký účet revizního technika na správu jeho zakázek (směr Revizio).

---

## 8. Kanál (komunikace) — jednotný, projekt → klient

Z výzkumu: interní týmový kanál ≠ klientský kanál. Pro nástroje řeší interní (BCF/Revizto),
klientské předání je odfláknuté a **projektově ohraničené**.

- Dnešní **`Konzultace`** povýšit na **„Kanál projektu"**: vlákna, **přílohy**, role, stav,
  svítící indikátor (už hotový). ✅ základ
- **Během projektu:** interní kanál architekt ↔ klient ↔ dodavatelé.
- **Při předání:** kurátorovaný výřez se stane součástí klientského pasu.
- **V provozu:** SVJ ↔ rezidenti ↔ revize.

To je přesně ta díra mezi „chaos e-mail + WeTransfer + Teams" (malá studia) a „těžký Revizto/CDE"
(velké firmy).

---

## 9. AI / boti vrstva (severka: „celá appka řízená botama")

Pas je strukturovaný → AI nad ním dělá vstup dat i triáž:

- **Extrakce z PDF/dokumentů** → datum, náklady, termín další revize, typ dokumentu, materiály →
  auto-plnění pasu. *(„architekt nahraje dokumentaci a AI to zpracuje")*
- **Asistent stavebního povolení** ✅ (`/povoleni`, scaffold)
- **Triáž „co hoří"** — shrnutí pozornosti přirozeným jazykem.
- **Generátor předávacího reportu.**
- **Q&A nad budovou** — „kdy byla poslední revize kotle?"

Závisí na nakonfigurovaném Anthropic klíči (scaffold `/api/permit` hotový).

---

## 10. Interop / příkop (později)

- **Import/export BCF + IFC** → BULO přijímá data z Revitu/ArchiCADu; architekt pracuje ve svém,
  „pas + klientský kanál" řeší v BULO.
- **Soulad schématu s EU Digital Building Logbook / renovačním pasem** → future-proof + marketing.
- **Export materiálového pasu** (Madaster-lite).

---

## 11. Roadmap po horizontech a závislosti

### Fáze 1 — TEĎ (client-only, bez backendu, demo v localStorage)
- Přerámovat dashboardy a sekce na pas/fáze; sjednotit kanál (hotovo) + přílohy.
- `CREATOR` → `SPRÁVCE/SVJ` názvosloví + portfolio přehled (read jen z lokálních dat).
- Energie & EPC sekce (stub).
- Revize: pole „termín další revize" + nahrání zprávy.

### Fáze 2 — BACKEND ON (Upstash + light auth)  ← odemyká multi-user
- Cross-device QR zápisy, sdílení, **reálný kanál**, SVJ více budov a více uživatelů.
- Bez tohohle zůstávají QR/SVJ/sdílení jen same-device demo.

### Fáze 3 — AI / BOTI
- Extrakce z PDF → auto-plnění, AI triáž, předávací report, Q&A nad daty.

### Fáze 4 — INTEROP / PŘÍKOP
- BCF/IFC, schéma dle EU logbooku, export materiálového pasu.

### Upřímná omezení
- **Multi-user, cross-device a SVJ portfolio reálně potřebují backend** (Upstash scaffold hotový,
  zatím nenakonfigurovaný) **a přihlašování**. Dnešní verze je single-device demo na localStorage.
- BULO **nenahrazuje** BCF / 3D koordinaci / clash detection — to je liga Revitu/Revizta. Lane
  BULO je lehká projektová komunikace + datová místnost + předání + doživotní pas.

---

## 12. Mapování na dnešní kód (co znovu použít)

| Cíl | Existující stavební kámen |
|-----|---------------------------|
| Pas = páteř | `Property` + kolekce (entries, documents, reminders, inventory, costs…) |
| Kartotéka architekta | role `ARCHITECT`, designs, milestones, originální dokumentace |
| Kanál | `consultations` (sjednocený chat, svítící stav) |
| Revize terén | `/q/[id]` QR landing (bez loginu) + `reminders` |
| Předání / prodej | `/sdileno/[id]`, transfers, report, „Připravit na prodej" |
| SVJ / portfolio | role `CREATOR` → přejmenovat + portfolio dashboard |
| AI | `/api/permit` scaffold, Anthropic SDK |
| Cross-device | `/api/passport/[id]` + Upstash scaffold |

---

## 13. SVJ ↔ BULO: připojení (BULO jako system of record)

Existující SVJ aplikace (svjaplikace.cz, SVJsystem…) jsou **provozní vrstva** — řeší,
jak SVJ funguje *letos*: zprávy/nástěnka, ankety, diskuze, hlasování, shromáždění,
poplatky, požadavky ke schválení, fotogalerie. Jsou interní pro aktuální výbor a při
změně dodavatele/výboru data mizí nebo zůstávají rukojmím.

**BULO není další SVJ appka — je paměťová vrstva budovy.** Drží se *aktiva*, přenese se
na kupujícího jednotky a přežije změnu výboru i SVJ aplikace.

### Co BULO NEklonuje (nechat provozní appce — komoditní, incumbent zdarma)
Ankety, Diskuze, mechanika Hlasování/Shromáždění, účetnictví poplatků, Požadavky ke
schválení, Fotogalerie.

### Připojení = 5 míst, kde provozní appka „rodí" data pro trvalý pas
| Modul provozní SVJ appky | Připojení do BULO |
|---|---|
| Revize a termíny | revizní zprávy + doživotní historie na aktivu |
| Hlášení a požadavky (závady) | po vyřešení = záznam v historii domu (co/kdy/kdo/kolik/záruka) |
| Dokumenty / adresář kontaktů | trvalý archiv u budovy (stavební dok., PENB, smlouvy, kontakty) |
| Jednotky a místnosti / vlastníci | sdílený registr jednotek → „pas jednotky" pro prodej |
| Poplatky / faktury (fond oprav) | kapitálová historie nákladů na aktivum |

### Architektura — 4 konektory
1. **Import/export** jednotek, vlastníků, kontaktů, dokumentů (CSV/JSON) — bez backendu. ✅ start
2. **QR terénní zápis** (`/q`) — funguje nezávisle na tom, jakou SVJ appku dům používá. ✅
3. **Veřejný pas + report + „pas jednotky"** pro kupujícího (`/sdileno`, report, převod). ✅ z velké části
4. **API / webhooky** (event „revize hotová / závada vyřešena / faktura zaplacena" → zápis do pasu) — Fáze 2 (backend).

### Proč by se SVJ k BULO připojilo
Přenositelný pas jednotky při prodeji (provozní appka nedá) · dům „se narodí" s daty od
architekta/developera · QR zápis z terénu · přežije změnu SVJ aplikace i výboru.

**Jednou větou:** SVJ aplikace = *jak se dům řídí letos*; BULO = *co se s domem stalo za
celý život*.
