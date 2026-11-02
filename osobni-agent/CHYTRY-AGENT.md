# Chytrý agent: co všechno jde nastavit

Stav k 2. 11. 2026. Sestava: notebook s RTX 4080 (12 GB) a 32 GB RAM, Ubuntu ve WSL,
OpenClaw 2026.10.9, Ollama. Vychází z toho, co už v Mozku běží, a z toho, co sdílejí ostatní
(odkazy jsou na konci).

## Z čeho se chytrost skládá

| Páka | Co dělá | Jak moc pomůže |
|---|---|---|
| **Model** | strop úsudku, logiky a češtiny | hodně, ale na 12 GB je strop daný |
| **Znalosti o tobě** | digitální kopie, deník, rozhodnutí, inspirace | nejvíc, a roste každý den |
| **Znalosti o světě** | knihovna se zdroji: novinky, předpisy, Wikipedie | hodně v tvém oboru |
| **Postupy** | dovednosti a skripty: čísla a data počítá skript, ne model | spolehlivost |
| **Učení z oprav** | chyba se zapíše a nezopakuje | roste s časem |
| **Okno a rychlost** | kolik toho model najednou udrží a jak rychle odpoví | pohodlí |

Model sám se čtením ani časem nezlepší. Lepší je díky tomu, co mu dáš do souborů, a díky
lepšímu modelu, až nějaký vyjde. Paměť je v souborech, takže model jde vyměnit a nic se
neztratí.

## Co už máš

- Hlavní model `gemma4:26b` (MoE, 32 tokenů/s) s oknem 64k, hluboký ThinkingCap na noc, Claude
  jako nejsilnější úroveň přes `agent-resers` (zatím bez klíče, krok 8).
- Paměť: `MEMORY.md`, deník, mapa Mozku `prehled.md` z nočního úklidu, hledání v paměti přes
  `embeddinggemma` (deník, `ja/`, `lide/`, novinky, knihovna).
- Digitální kopie: rozhovor o 11 tématech (téma 4 o zakládání firmy), večerní deník.
- Zdraví z náramku, kalendář, přepis hlasu, zápisy z jednání, rešerše pozemku, texty
  k dokumentaci podle vyhlášky.
- Archi agent: novinky z architektury každou noc a knihovna (krok 20).
- Přehled světa každé ráno (krok 22), průzkum webu na pokyn i přes noc z večerního deníku
  (krok 23).
- Soubory na počítači: najít, přesunout, přejmenovat, otevřít, bez mazání a se vracením
  (krok 21).
- Rejstřík rozhodnutí, inspirace a učení z oprav (krok 24).
- Bezpečnost: zamčená pravidla, povolené příkazy, zakázané nástroje na posílání ven, jen
  lokální modely, internet čte jen model bez nástrojů, nástroje bez nastavení z proměnných,
  červené tlačítko a kontrola zámků každou noc.

## Co můžeš přidat

Seřazené podle toho, kolik to přinese. U každé věci je odhad práce.

### 1. Znalosti o tobě (největší přínos)

1. **Dokončit rozhovor.** Začni tématem 4 (firma), pak 2 (hodnoty a rozhodování) a 3 (jak
   navrhuješ). Asi 8 sezení po 30–40 minutách.
2. **Rejstřík rozhodnutí** `rozhodnuti/`: u každého důležitého rozhodnutí co, proč, jaké byly
   možnosti a po čase, jak to dopadlo. Agent pak radí podle tvých skutečných výsledků, ne
   obecně. *Hotovo (krok 24).*
3. **Inspirace** `inspirace/`: fotka nebo odkaz a k tomu „líbí se mi, protože…". Noční úklid
   z toho skládá, co se ti opakovaně líbí, tedy tvoje design DNA. *Hotovo (krok 24).*
4. **Pět projektů, na které jsi hrdý,** a proč jsou takové (`ja/navrhovani.md`).
5. **Tvoje staré texty** do `podklady/vzory/`. Agent se z nich naučí styl (dovednost
   `uceni-ze-vzoru`).
6. **Pošta (krok 8).** Agent se z odeslaných mailů naučí, jak píšeš, a píše maily i zprávy
   tvým tónem. Odejdou až po tvém potvrzení (krok 25).

### 2. Znalosti o světě

1. **Ověřit zdroje novinek:** `agent-novinky zkontroluj` a opravit nefunkční adresy.
2. **Předpisy offline:** platná znění stavebního zákona a vyhlášek z e-Sbírky
   do `podklady/predpisy/`, s datem stažení. Agent pak cituje paragraf, ne paměť modelu.
3. **Standardy ČKA a technické listy výrobců,** které používáš, do knihovny.
4. **Koupené normy ČSN** jen pro tebe, do `podklady/`. Volně stáhnout nejdou.
5. **Průzkum webu na jednu větu.** „Zjisti, kolik stojí projekt RD v Praze" a agent sám najde
   zdroje. Lokálně přes vyhledávač SearXNG v notebooku (`agent-pruzkum`, *hotovo, krok 23*),
   nebo v nejlepší kvalitě přes Clauda.
6. **Přehled světa každé ráno** ze zpravodajských webů. *Hotovo (krok 22).*

### 3. Učení z oprav

Podle výzkumu i praxe ostatních platí tři věci:
- oprava se musí zapsat, jinak se chyba zopakuje,
- trvalé pravidlo z ní má vzniknout až po kontrole nebo po opakování,
- doptat se předem je lepší než opravovat potom.

1. **Smyčka učení:** každá tvoje oprava se zapíše do `opravy.md` s datem a souvislostí.
   Když se stejná chyba objeví potřetí, noční úklid ti navrhne nové pravidlo do dovednosti.
   Schválíš ho ty, protože pravidla jsou zamčená. *Hotovo (krok 24).*
2. **Zkouška kopie jednou měsíčně:** 10 otázek, na které znáš odpověď, a počet trefených.
   Pozná se z toho, jestli se agent zlepšuje.
3. **Týdenní opravy v Obsidianu** (10 minut): `ja/`, `MEMORY.md` a mapa Mozku.

### 4. Paměť a hledání

1. **Krátké `MEMORY.md`:** kolem 100 řádků toho nejdůležitějšího, zbytek do souborů podle
   témat. Čte se s každou zprávou, takže kratší znamená rychlejší a přesnější.
2. **Opravit hledání v paměti.** Minule selhalo. Pošli mi výpis `openclaw memory status --deep`.
3. **Active Memory v OpenClaw** (vyzkoušet): hlubší vybavování u otázek typu „co jsme řešili
   minulý měsíc". Zapne se, jen když běžné hledání nestačí. Stojí jedno volání modelu navíc.

### 5. Model a rychlost

1. **Druhá otázka ve stejném chatu:** změř, jak dlouho trvá. Ukáže, jestli model čte celé
   zadání pokaždé znovu.
2. **Zrychlení modelu MoE:** LM Studio nebo llama.cpp umí nechat na grafice důležité části
   a do RAM poslat jen „experty" (krok 13). U MoE na 12 GB bývá znatelně rychlejší.
3. **Zkouška nového modelu:** až vyjde lepší model, pustíme na něj stejných 10 úloh jako
   na dnešní. Přejde se jen, když vyjde líp. Kandidáti, které lidé zkoušejí na 12 GB:
   Qwen3.6-35B-A3B (MoE, uživatelé hlásí 30–50 tokenů/s, spolehlivost ale kolísá) a Gemma 4
   12B (vejde se celá na grafiku, je rychlá, ale slabší). Čísla jsou od výrobců a uživatelů,
   ne změřená u tebe.
4. **Dotrénování (LoRA)** jen na styl psaní a jen když nestačí ukázky. Na 12 GB jde jen na
   malý model (Gemma 4 E4B). Faktům ho to nenaučí, na fakta je knihovna.

### 6. Spolehlivost a bezpečnost

1. **Bezpečnostní kontrola sama každou noc:** kontrolní skript běží z časovače ve 4:40 a POZOR
   ti ukáže v ranním přehledu. *Hotovo (krok 24).*
2. **Záloha Mozku každou noc** (`wsl/zaloha-mozku.sh`). Ověř, že běží.
3. **Po každé aktualizaci OpenClaw** spusť kontrolní skript. Nové verze přidávají nástroje,
   jako se to stalo s `conversations_send`.

### 7. Napojení na další programy

1. **Revit**, až budou zakázky. Autodesk vydal oficiální Revit Public MCP Server pro
   Revit 2027, zatím jako technickou ukázku. Pro starší verze je otevřený
   mcp-servers-for-revit (Revit 2020–2026). Jen úzké úlohy (podlaží, výkazy, kontrola
   parametrů) a změny se schvalováním.
2. **Rohlík** (krok 10), až vyplníš, co nakupujete.
3. **Telefon:** prověřování neznámých volajících v iPhonu (iOS 26) zapni hned. AI telefonista
   jde jen přes cloudovou službu, to až pro firmu a jen na vzkazy.

## Doporučené pořadí

| Kdy | Co |
|---|---|
| **Tento týden** | kroky 21–24, krok 8 (pošta a klíč Claude), ověřit zdroje novinek a světa, výpis hledání v paměti, rozhovor téma 4 |
| **Do měsíce** | plnit rozhodnutí a inspirace, první zkouška kopie |
| **Do 3 měsíců** | předpisy offline, zrychlení MoE, zkouška nového modelu |
| **Později** | Revit, Active Memory, styl přes LoRA, AI telefonista pro firmu |

## Co nedoporučuju

- **Ovládání celého počítače klikáním:** lokální model to neumí spolehlivě a je to největší
  bezpečnostní riziko.
- **Stahování z X přihlášeným účtem:** porušuje podmínky X, hrozí zamčení účtu a agent by
  mohl psát za tebe.
- **AI, které volá lidem za tebe:** pravidla i AI Act chtějí, aby člověk věděl, že mluví
  se strojem.
- **Celá Wikipedie:** lepší je menší knihovna k tvým tématům.
- **Dotrénování na faktech:** fakta patří do knihovny se zdroji.
- **Okno přes 128k:** plné okno by se četlo minuty.

## Odkud to je

- Sdílená nastavení: [TechNickAI/openclaw-config](https://github.com/TechNickAI/openclaw-config)
  (paměť ve třech vrstvách, krátké MEMORY.md, „vratná rozhodnutí sám, nevratná potvrdit"),
  [RobTigerCode/openclaw-workspace](https://github.com/RobTigerCode/openclaw-workspace),
  [GitLaughs/openclaw](https://github.com/GitLaughs/openclaw),
  [gist s Ollamou](https://gist.github.com/iam-veeramalla/9d10f968038ee76d5bc374b44f0cf8bb)
  (v komentářích zkušenosti s lokálními modely).
- Návody: [NVIDIA: OpenClaw na RTX](https://www.nvidia.com/en-gb/geforce/news/open-claw-rtx-gpu-dgx-spark-guide/),
  [freeCodeCamp: bezpečný osobní agent](https://www.freecodecamp.org/news/how-to-build-and-secure-a-personal-ai-agent-with-openclaw/),
  [Vorlux: OpenClaw s Ollamou](https://vorluxai.com/en/blog/openclaw-ollama-local-agent-setup-en/).
- Učení z oprav: [Fast.io: vzor reflexe](https://fast.io/resources/reflection-pattern-self-correcting-agents/),
  [přehled paměti agentů (arXiv)](https://arxiv.org/pdf/2605.06716),
  [kontrolovatelná paměť pro lokální agenty](https://dev.to/ruslan_manov/reviewable-memory-consolidation-for-local-ai-agents-2nd0).
- Modely a dotrénování: [lokální modely pro agenty](https://vdf.ai/blog/best-local-llm-for-agents-tool-calling/),
  [modely pro 12 GB](https://atomic.chat/blog/guides/best-local-llm-12gb),
  [Unsloth: Gemma 4](https://unsloth.ai/docs/de/modelle/gemma-4/train),
  [LoRA vs. RAG](https://www.kunalganglani.com/blog/fine-tune-open-source-llm-lora-qlora).
- Revit: [Autodesk Revit Public MCP Server](https://www.autodesk.com/blogs/aec/2026/06/17/revit-public-mcp-server/),
  [mcp-servers-for-revit](https://www.sourcepulse.org/projects/33683136).
- OpenClaw (dokumentace verze 2026.10.9): Active Memory, Memory provenance, Personal Agent
  Benchmark Pack.
