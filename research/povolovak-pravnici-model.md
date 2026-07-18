# Povolovák + právníci: model „AI připraví, právník potvrdí"

> Doplněk k [plánu appky](./sob-appka-mvp.md). Nápad: spojit Povolovák s kamarády právníky — AI udělá základ, právník potvrdí správnost. Verdikt: **výborný tah, pokud se správně postaví právní konstrukce.**

---

## 1. Proč je to silné

1. **Řeší důvěru** — největší slabinu čistého SaaS od studenta: „zkontrolováno advokátem" prodává úplně jinak než „AI ti poradí".
2. **Řeší odpovědnost** — advokát má profesní pojištění a nese odpovědnost za právní posouzení; ty neseš jen software a kompletaci.
3. **Zvedá cenu 10×** — za AI checklist zaplatí lidi stovky korun; za „připravené podání potvrzené právníkem" jednotky tisíc.
4. **Právníci přinášejí klienty** — jejich klientela řeší nemovitosti a stavby neustále; appka je pro ně i produktivita (stavební agenda 5× rychleji).

**Cenová kotva z trhu:** klasické vyřízení povolení (inženýring) dnes stojí **15–42 tis. Kč za RD** ([stavimbydlim](https://stavimbydlim.cz/kolik-stoji-vyrizeni-stavebniho-povoleni/), [Gareko](https://www.gareko.cz/kolik-stoji-stavebni-povoleni/), [CESPRON](https://www.cespron.cz/ceny-inzenyrskych-cinnosti/)). AI+právník balíček za **4 990–14 990 Kč** je disruptivní cena s lepší zárukou než běžná inženýrská firma.

---

## 2. Právní konstrukce (tady se to láme — udělat hned správně)

Klíčová fakta:
- Právní služby za úplatu smí poskytovat jen advokáti ([zákon č. 85/1996 Sb. o advokacii](https://www.zakonyprolidi.cz/cs/1996-85)); novela výslovně přitvrdila proti „vinklaření" (neoprávněnému poskytování právních služeb). Tvoje s.r.o. tedy **nesmí prodávat „právní kontrolu"** vlastním jménem.
- Advokát **nesmí dělit odměnu za právní služby s neadvokátem** ani platit provize za přivedené klienty (stavovské předpisy ČAK) — model „ty inkasuješ vše a právníkovi pošleš podíl" je cesta ke kárnému řízení jeho i problému tvému.
- ALE: **obstarání stavebního povolení (inženýring) není vyhrazená právní služba** — je to běžná živnost, kterou dělají stovky inženýrských firem. Zastupování v běžném správním řízení jako zmocněnec je standardní praxe.

**Čistá struktura (tři vrstvy):**
| Vrstva | Kdo ji poskytuje | Smlouva klienta s | Tvůj příjem |
|---|---|---|---|
| Software (AI checklist, kompletace, lhůty) | tvoje s.r.o. | s.r.o. | SaaS/per případ |
| Inženýring (obstarání vyjádření, podání, komunikace s úřadem) | tvoje s.r.o. (živnost inženýrská činnost) | s.r.o. | fixní cena za případ |
| Právní posouzení, „potvrzeno advokátem", eskalace (odvolání, sousedé, nečinnost úřadu) | **advokátní kancelář kamarádů** | přímo kancelář | kancelář platí **licenci softwaru** (fixní/měsíční), NE provizi za klienta |

Klient v appce vidí jeden plynulý proces; právně jsou to dva vztahy (s.r.o. + kancelář). Přesné znění ať navrhnou kamarádi — jsou od toho a budou to podepisovat oni.

---

## 3. Produktová patra

1. **Zdarma:** AI checklist „co potřebuju pro svůj záměr" — lead magnet, SEO na povolovací chaos.
2. **990–2 490 Kč:** AI kompletace + kontrola úplnosti (samoobsluha, bez právníka).
3. **4 990–9 990 Kč: „Potvrzeno advokátem"** — AI připraví podání a dokladovku, advokát do 48 h zkontroluje a potvrdí/vrátí s komentářem. Vlajkový produkt.
4. **Individuálně (ceník kanceláře):** zastoupení, odvolání, spory — plná právní služba; appka předává teplý, předpřipravený případ (advokát začíná s hotovým spisem = i pro něj násobně efektivnější).

## 4. Ekonomika vlajkového balíčku (příklad na 7 990 Kč)

- Náklad AI + provoz: ~50–150 Kč.
- Advokátní kontrola díky standardizovanému výstupu: **30–60 min** (ne 8 hodin) → interní náklad kanceláře ~1 500–2 500 Kč, kancelář si účtuje svou část přímo.
- Tvoje hrubá marže z inženýrsko-softwarové části: ~60–75 %.
- Rok 1 cíl: 100–300 případů → **0,7–2,5 mil. Kč** tržeb pro tebe + příjem kanceláři. Standardizací rostou objemy bez růstu času právníka na případ — to je celá pointa.
- **Bottleneck watch:** když právník nestíhá SLA 48 h, přibrat druhou kancelář (software je licencovatelný více kancelářím — z toho časem samostatná B2B legaltech větev: prodej nástroje advokátům a inženýrským firmám, kteří NEJSOU tvoji partneři).

## 5. Kamarádi × byznys (pravidla hygieny)

- **Písemná smlouva od prvního dne** (rozsah, SLA, ceny, licence, exit) — kamarádství ji nenahrazuje, kamarádství ona chrání.
- **Revenue share přes licenci, ne equity hned.** Podíl ve firmě jen pokud budou reálně budovat (a s vestingem). „Kamarád dostal 20 % za víkendovou konzultaci" je klasická chyba č. 1.
- Ověř, že jsou **advokáti** (zapsaní v ČAK), ne koncipienti/absolventi — „potvrzeno advokátem" jinak nefunguje ani marketingově, ani právně.
- Konflikt zájmů a mlčenlivost řeší kancelář dle svých povinností (identifikace klienta atd.) — nech to na nich.

## 6. První kroky (14 dní)

1. Schůzka s kamarády: ukázat trh (inženýring 15–42k, chaos do 2030) a navrhnutou strukturu; ať ji právně doladí.
2. **Jeden pilotní případ ručně end-to-end** (klidně záměr z tvého okolí/školy): AI dokladovka → advokátní kontrola → podání. Změřit čas právníka — to je klíčové číslo celého byznysu.
3. Podle pilotu nacenit balíčky a spustit landing page s objednávkou „Potvrzeno advokátem" (appka může zatím být z půlky ruční — prodej ověří dřív než kód).

*Verze 1.0, červenec 2026.*
