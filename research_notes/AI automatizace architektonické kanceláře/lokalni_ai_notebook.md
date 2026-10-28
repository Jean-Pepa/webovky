# Lokální AI na notebooku ASUS Zenbook Pro 16X OLED (UX7602BZ: RTX 4080 Laptop 12 GB, 32 GB RAM): inference a dotrénování pro architektonický ateliér, stav k 28. 10. 2026

Poznámka k metodice a značení (čtěte dřív, než použijete čísla):
- U každého čísla je v hranatých závorkách uvedeno, na jaké GPU bylo naměřeno nebo odhadnuto, např. [RTX 3060 12 GB desktop]. Na cílovém notebooku (RTX 4080 Laptop 12 GB) ani na desktopové RTX 4080 16 GB jsem pro AI úlohy nenašel jediné měření. Nejbližší proxy jsou komunitní měření na RTX 3060 12 GB a RTX 4070 12 GB (desktop). Převod na notebook je v sekci 6.
- Přímé čtení stránek huggingface.co a unsloth.ai bylo v této session zablokované síťovou politikou (proxy vrací 403). Během práce se navíc vyčerpal sdílený limit webového vyhledávání. Část čísel z modelových karet a z dokumentace Unsloth proto pochází ze shrnutí vyhledávače, ne z přímého čtení stránky. U takových údajů je to uvedeno. Před rozhodnutím je ověřte na primárních stránkách.
- Mnoho zdrojů jsou SEO a agregátorové blogy (specpicks, localaimaster, dev.to, gpuprix aj.). Jejich čísla jsou orientační a často si odporují. Rozpory vyznačuji.

## 1. LLM na 12 GB: lokální inference, dotrénování LoRA/QLoRA (Unsloth), doba tréninku na ~1 000 příkladech, a kdy fine-tuning porazí RAG + few-shot

### Takeaway
Celé na GPU běží modely do zhruba 8–14B v Q4 (Gemma 4 E4B, Qwen3-VL-8B ~6 GB). MoE modely Gemma 4 26B-A4B a Qwen3.6-35B-A3B běží jen s odložením expertů do RAM (llama.cpp `--n-cpu-moe`), a to rychlostí ~15–23 tok/s [RTX 3060 12 GB / GTX 1080 8 GB desktop]. Hustý ThinkingCap-Qwen3.6-27B se do 12 GB nevejde (Q4_K_M ~15,5–19,5 GB) a poběží jednociferně (~4–6 tok/s, odhad).

QLoRA přes Unsloth je na 12 GB reálná do ~14B (oficiální minimum 8,5 GB) a pro Gemma 4 E4B (10 GB). Gemma 4 31B (QLoRA 22 GB), Gemma 4 26B-A4B (LoRA >40 GB) a Qwen3.6-27B (≥24 GB) patří do cloudu.

Pro napodobení stylu technických zpráv je rozumné začít RAG + few-shot. LoRA přidat až tehdy, když slepý test ukáže stylový deficit. Studie ukazují, že fine-tuning dává nejvyšší stylovou věrnost (experti ho preferovali 8× častěji), ale hrozí ztráta plynulosti a přeučení na styl korpusu.

### Cited Findings

#### Inference: co se vejde a jak rychle
- Gemma 4 vyšla 2. nebo 3. 4. 2026 (zdroje se v datu liší) pod licencí Apache 2.0 — [MindStudio](https://www.mindstudio.ai/blog/gemma-4-apache-2-license-commercial-use); [noze.it](https://www.noze.it/en/insights/gemma-new-release/).
- Velikosti Gemma 4: E2B, E4B, 26B-A4B (MoE) a 31B (dense). Google uvádí, že všechny varianty nativně zpracují obraz i video s proměnným rozlišením a že jsou silné v OCR a v čtení grafů — [lushbinary](https://lushbinary.com/blog/gemma-4-developer-guide-benchmarks-architecture-local-deployment-2026); [WaveSpeed](https://wavespeed.ai/blog/posts/what-is-google-gemma-4/) (sekundární zdroje).
- Údaje o E4B se rozcházejí: jeden zdroj uvádí 4,5B efektivních, 8B celkových parametrů a kontext 128K, jiný jen „4.5B effective“ — [localllmmodels blog](https://localllmmodels.blogspot.com/2026/04/google-gemma-4-models-explained-specs.html); [lushbinary](https://lushbinary.com/blog/gemma-4-developer-guide-benchmarks-architecture-local-deployment-2026).
- Gemma 4 26B-A4B se bez offloadu do 12GB karet (RTX 3060/4070) nevejde: „26B-A4B: overflows (19 GB), avoid“ [12 GB desktop] — [runaihome via dev.to](https://dev.to/jovan_chan_9500711396d4e6/google-gemma-4-for-local-ai-which-size-fits-your-gpu-2026-guide-4l4b).
- S expertními vrstvami v RAM (`--n-cpu-moe` v llama.cpp) běží 26B-A4B i na staré GTX 1080 rychlostí ~16 tok/s [GTX 1080 8 GB desktop] — [dev.to/mdda](https://dev.to/mdda/running-gemma-4-26b-on-an-old-gtx-1080-with-llamacpp-4fi5).
- Uživatel r/LocalLLaMA hlásí 26B-A4B v kvantizaci UD-Q3_K_M s kontextem 70k na RTX 3060 non-Ti rychlostí ~14,5 tok/s [RTX 3060 12 GB desktop] — [r/LocalLLaMA snapshot](https://reddit.sentinel-team.org/posts/1sfmyt5/snapshots/2026-04-09T18%3A31%3A04.843601Z). Údaj je ze shrnutí vyhledávače a přiřazení ke konkrétnímu vláknu je nejisté.
- Na RTX 4090 dosahuje 26B-A4B v Q4 ~58 tok/s (měření) nebo ~85 tok/s (odhad); headline ~149 tok/s na téže kartě je bez metodiky [RTX 4090 24 GB desktop] — [vantaige](https://vantaige.io/blog/gemma-4-rtx-4090-tokens-per-sec-vram-benchmark).
- Qwen3.6-27B je hustý multimodální model (text, obraz, video, kontext 262 144 tokenů) — [OpenRouter (Helicone mirror)](https://openrouter.helicone.ai/qwen/qwen3.6-27b).
- Qwen3.6-35B-A3B je MoE s 35B celkových a ~3B aktivních parametrů, nativně multimodální — [OpenRouter](https://openrouter.ai/models/qwen/qwen3.6-35b-a3b).
- Oba modely Qwen3.6 vyšly v dubnu 2026 (22. 4. nebo 27. 4. podle zdroje) pod Apache 2.0 — [OpenRouter](https://openrouter.ai/models/qwen/qwen3.6-35b-a3b); [OfficeChai](https://officechai.com/ai/qwen3-6-35b-a3b-benchmarks/).
- Podle OfficeChai Qwen3.6-35B-A3B „v mnoha benchmarcích poráží Gemma 4 31B“ (titulek článku) — [OfficeChai](https://officechai.com/ai/qwen3-6-35b-a3b-benchmarks/).
- Velikost Qwen3.6-27B v Q4_K_M se ve zdrojích liší: ~15,5 GB ([gpuprix](https://gpuprix.com/best-gpu-for-local-llm/qwen3.6-27b)), ~17 GB (Reddit) a ~19,5 GB ([willitrunai](https://willitrunai.com/can-run/qwen-3.6-27b-on-rtx-3060-12gb)). Do 12 GB se tedy nevejde.
- I Qwen3.6-27B v Q3_K_M (~12,5 GB) přetéká a vynucuje částečný offload. Ten stojí 40–60 % rychlosti na kartě se 192bit sběrnicí a vychází ~4–6 tok/s [RTX 3060 12 GB, odhad, ne měření] — [specpicks](https://specpicks.com/reviews/qwen-3-6-27b-rtx-3060-12gb-2026).
- Komentující na Redditu doporučují na 12 GB spíš MoE 35B-A3B, protože offload hustému modelu škodí víc — [specpicks / Reddit (shrnutí)](https://specpicks.com/reviews/qwen-3-6-27b-rtx-3060-12gb-2026).
- Pro inferenci Qwen3.6-27B uvádí Unsloth konfiguraci s 18 GB paměti — [Unsloth Qwen3.6 (JP docs)](https://unsloth.ai/docs/jp/moderu/qwen3.6.md) (ze shrnutí vyhledávače).
- Qwen3.6-35B-A3B s `-ncmoe` (MoE experti v systémové RAM) jde „z OOM na 23 tok/s“ [RTX 3060 12 GB desktop] — [jeanfbrito.github.io](https://jeanfbrito.github.io/posts/running-qwen3.6-35b-moe-rtx3060-ncmoe/).
- Další údaje k Qwen3.6-35B-A3B na 12 GB pocházejí z několika článků SpecPicks a nelze je přesně přiřadit konkrétní stránce [RTX 3060 12 GB] — [specpicks](https://specpicks.com/reviews/qwen-36-35b-a3b-rtx-3060-12gb-local-2026); [specpicks MTP](https://specpicks.com/reviews/qwen3-6-35b-a3b-12gb-gpu-mtp-2026):
  - s multi-token prediction (MTP): 20–28 tok/s při kontextu 8K a 14–18 tok/s při 32K;
  - tvrzení o ~80 tok/s s MTP (neověřitelné, marketingově laděné);
  - klasický offload vrstev (`--n-gpu-layers`): 8–15 tok/s.
- ThinkingCap-Qwen3.6-27B (BottleCap AI, Praha) je Qwen3.6-27B dotrénovaný online RL. Zkracuje „thinking“ tokeny v průměru o ~50 %, v nejlepších případech o >90 %, při zachované nebo lepší přesnosti — [Opper](https://opper.ai/bottlecap-ai/thinkingcap-qwen3-6-27b); [HF FP8 karta](https://huggingface.co/bottlecapai/ThinkingCap-Qwen3.6-27B-FP8).
- Na GSM8K ThinkingCap ubral 74,1 % thinking tokenů a přesnost vzrostla z 93,3 % na 96,5 % — [AI Weekly](https://aiweekly.co/alerts/bottlecap-ais-thinkingcap-qwen-fine-tune-halves-thinking-tokens).
- ThinkingCap je k dispozici v bf16, FP8, NVFP4 a GGUF (pro llama.cpp, Ollama a LM Studio). Uvádí se kontext 256K a tool calling; Interfaze ho popisuje jako multimodální obraz–text — [HF NVFP4](https://huggingface.co/bottlecapai/ThinkingCap-Qwen3.6-27B-NVFP4); [Interfaze GGUF](https://interfaze.ai/models/bottlecapaithinkingcap-qwen36-27b-gguf); [Requesty](https://www.requesty.ai/models/sference/thinkingcap-qwen3.6-27b); [Interfaze](https://interfaze.ai/models/bottlecapaithinkingcap-qwen36-27b).

#### Dotrénování: VRAM minima podle Unsloth
- Oficiální tabulka minimální VRAM ve formátu QLoRA 4bit / LoRA 16bit — [Unsloth Requirements](https://www.unsloth.ai/docs/get-started/fine-tuning-for-beginners/unsloth-requirements); [vrlatech](https://vrlatech.com/how-much-vram-do-you-need-for-llm-fine-tuning-in-2026/) (ze shrnutí vyhledávače; řádek 27B pochází ze shrnutí ke Qwen3.5):
  - 3B: 3,5 / 8 GB
  - 8B: 6 / 22 GB
  - 14B: 8,5 / 33 GB
  - 27B: 22 / 64 GB
  - 32B: 26 / 76 GB
  - 70B: 41 / 164 GB
- Unsloth píše, že jde o absolutní minimum a některé modely potřebují víc. Při OOM doporučuje snížit batch size na 1–3 — [Unsloth Requirements](https://www.unsloth.ai/docs/get-started/fine-tuning-for-beginners/unsloth-requirements).
- Kopie tabulky na HF uvádí 7B 5 / 19 GB a 405B 237 / 950 GB (méně spolehlivý zdroj) — [HF dataset maghrane/unsloth-qwen](https://huggingface.co/datasets/maghrane/unsloth-qwen).
- Gemma 4 podle průvodce Unsloth: E2B se trénuje na 8 GB a E4B na 10 GB. Jinde na téže stránce stojí E4B LoRA 17 GB, takže stránka si odporuje — [Unsloth Gemma 4 Fine-tuning Guide](https://unsloth.ai/docs/models/gemma-4/train).
- Pro větší Gemma 4 uvádí Unsloth 31B QLoRA 22 GB a 26B-A4B LoRA >40 GB. Notebooky pro 26B-A4B a 31B vyžadují A100. Unsloth doporučuje trénovat E4B přes QLoRA spíš než E2B přes LoRA, protože rozdíl v přesnosti kvantizace je malý — [Unsloth Gemma 4](https://unsloth.ai/docs/models/gemma-4/train).
- VESSL odhaduje E4B QLoRA na 18–22 GB (A100, jiné nastavení) — [VESSL](https://docs.cloud.vessl.ai/examples/fine-tuning-gemma-4).
- Qwen3.5 podle Unsloth, bf16 LoRA — [Unsloth Qwen3.5 Fine-tune](https://unsloth.ai/docs/models/qwen3.5/fine-tune):
  - 0,8B: 3 GB
  - 2B: 5 GB
  - 4B: 10 GB
  - 9B: 22 GB
  - 27B: 56 GB
  - 35B-A3B: 74 GB
- K tomu Unsloth uvádí: QLoRA u MoE nedoporučuje, ukázka pro dense 27B používá 16bit LoRA a Qwen3.5 trénuje 1,5× rychleji s 50 % méně VRAM než sestavy s FA2 — [Unsloth Qwen3.5 Fine-tune](https://unsloth.ai/docs/models/qwen3.5/fine-tune).
- Pro trénink Qwen3.6-27B Unsloth oficiální čísla nezveřejnil. QLoRA s krátkým kontextem a malým batchem se podle jednoho článku „těsně“ vejde do 24 GB a komfortní je od 48 GB. Článek ale mluví o „Qwen 3.8 27B“ — [Yotta Labs, 8/2026](https://www.yottalabs.ai/post/how-to-fine-tune-qwen-3-8-27b-with-unsloth-2026).
- Existuje Unsloth Studio, lokální UI pro fine-tuning — [Vast.ai docs](https://docs.vast.ai/examples/ai-ml-frameworks/unsloth-studio).

#### Doba tréninku (~1 000 příkladů)
- Blogové odhady bez uvedené metodiky; jde o shrnutí vyhledávače a přesné přiřazení čísel ke stránkám je nejisté — [toolhalla](https://toolhalla.ai/blog/fine-tune-llm-locally-guide-2026); [promptquorum](https://www.promptquorum.com/local-llms/fine-tuning-local-llms-lora); [petronellatech](https://petronellatech.com/ai/unsloth/):
  - Qwen3 8B na 1 000 příkladech ~15 min [RTX 4090];
  - Llama 3.1 8B, 1k příkladů, 3 epochy, QLoRA ~2 h, na RTX 4090 zhruba polovina [GPU neuvedena];
  - stejný 8B fine-tuning trvá 9,4 h v „raw PyTorch“ a 0,8 h s Unsloth [GPU neuvedena].
- Pro RTX 3060 12 GB jsem našel jen tabulku „QLoRA 7B se vejde“, bez času. Měřený čas na 12GB GPU jsem nenašel — [promptquorum](https://www.promptquorum.com/local-llms/fine-tuning-local-llms-lora).

#### Fine-tuning vs. RAG/few-shot při napodobování stylu
- Findings EMNLP 2025 (arXiv 2509.14543): i pár ukázek (few-shot) zlepšuje stylovou shodu proti zero-shot. Současné LLM ale „stále těžko reprodukují nuancovaný osobní styl“, zvlášť v neformálních a stylově pestrých doménách — [arXiv 2509.14543](https://arxiv.org/html/2509.14543v1); [ACL Anthology](https://aclanthology.org/2025.findings-emnlp.532.pdf).
- Chakrabarty et al. (shrnutí The Decoder): po dotrénování na dílech autorů volili experti AI texty 8× častěji kvůli stylu a 2× častěji kvůli kvalitě. Detektory AI označily 97 % běžných výstupů, ale jen 3 % výstupů dotrénovaného modelu — [The Decoder](https://the-decoder.com/ai-models-can-mimic-famous-authors-writing-styles-using-just-two-books-for-training/).
- arXiv 2610.03163 (2026): LoRA fine-tuning dosáhl nejvyšší stylové přesnosti, ale preference výstupů prudce klesla kvůli ztrátě plynulosti (častá opakování). Shrnutí autorů: „fine-tuning buys most of the available style signal but forfeits fluency“ — [arXiv 2610.03163](https://arxiv.org/html/2610.03163).
- arXiv 2509.24930: strategie promptování má na stylovou věrnost větší vliv než velikost modelu a few-shot je lepší než zero-shot — [arXiv 2509.24930](https://arxiv.org/pdf/2509.24930).
- arXiv 2511.01454 (překlad latiny): fine-tuning se přeučil na styl trénovacího korpusu, kdežto RAG zachoval obecné schopnosti — [arXiv 2511.01454](https://arxiv.org/pdf/2511.01454).

### Inferences
- **Převod na notebook.** Generování tokenů je omezené propustností paměti. Notebooková RTX 4080 má 432 GB/s, desktopová RTX 4080 717 GB/s (sekce 6). U modelu celého ve VRAM tedy čekejte zhruba 60 % tok/s desktopové RTX 4080. Komunitní čísla z RTX 3060 12 GB jsou pro notebook spíš konzervativní dolní mez (3060 má nižší propustnost; spec ~360 GB/s, v této session neověřeno). U MoE s offloadem rozhoduje hlavně propustnost RAM (LPDDR5) a kolik expertů zůstane na GPU.
- **Doporučené rozdělení modelů**, které má uživatel v Ollama:

  | Úloha | Model | Kde běží | Rychlost |
  |---|---|---|---|
  | Rychlé úlohy (sumarizace, e-maily, přepisy schůzek) | Gemma 4 E4B | Celý v GPU | Desítky tok/s, neměřeno |
  | „Pracovní kůň“ (zprávy, RAG) | Qwen3.6-35B-A3B nebo Gemma 4 26B-A4B v Q3–Q4, llama.cpp/llama-server s `--n-cpu-moe` | GPU + RAM | ~15–23 tok/s (proxy RTX 3060) |
  | Nejvyšší kvalita a uvažování | ThinkingCap-Qwen3.6-27B | GPU + RAM, offload | ~4–6 tok/s (odhad); kratší uvažování to částečně kompenzuje |

  Uvedené rychlosti MoE jsou pro llama.cpp s `--n-cpu-moe`. Jak efektivně totéž dělá Ollama, jsem neověřil.
- **Co lze dotrénovat lokálně (12 GB):**
  - Gemma 4 E4B přes QLoRA: minimum 10 GB, s režií Windows na hraně. Nutná sekvence ~1–2k tokenů, batch 1 a gradient accumulation.
  - Qwen3.5-4B přes bf16 LoRA (10 GB).
  - Modely 8–9B přes QLoRA: ~6–7 GB, interpolace řádků 8B a 14B.
  - Modely do 14B přes QLoRA: 8,5 GB minimum.
- **Co patří do cloudu:** Gemma 4 26B-A4B a 31B, Qwen3.6-27B a Qwen3.6-35B-A3B. Hotový adaptér lze potom provozovat lokálně s offloadem.
- **Odhad doby tréninku** (vlastní výpočet, explicitní předpoklady):
  - Data: 1 000 příkladů × ~600 tokenů × 3 epochy ≈ 1,8 M tokenů.
  - Výpočet: LoRA s gradient checkpointingem stojí ~6–8 FLOP na parametr a token.
  - Výkon: efektivní výkon RTX 4080 Laptop v QLoRA odhaduji na 8–15 TFLOPS (předpoklad, neověřeno).
  - Výsledek: model 4B ~0,5–1,5 h, 8B ~1–3 h, 14B ~2–5 h. Řádově to sedí s blogovými odhady (~2 h pro 8B a 3 epochy).
- **Postup pro styl technických zpráv:**
  1. Začít bez tréninku: RAG nad vlastními zprávami ateliéru (fakta, formulace, struktura kapitol). K tomu 3–5 vzorových pasáží jako few-shot a „stylový manuál“, který LLM vytáhne z korpusu (délka vět, terminologie, obraty, struktura). Je to levné, jde to průběžně aktualizovat a fakticky to model nezkazí.
  2. Slepý A/B test: architekt hodnotí ~20 odstavců, aniž ví, odkud pocházejí.
  3. LoRA nasadit, jen když baseline neprojde a existuje alespoň několik set kvalitních ukázek. Lokálně na 4–14B modelu, v cloudu na 27–31B. Pro styl obvykle stačí nižší rank a 1–3 epochy. RAG pro fakta zůstává.
- **Rizika fine-tuningu:** opakování a ztráta plynulosti (2610.03163) a přeučení na styl korpusu (2511.01454). Fine-tuning dává smysl hlavně pro velmi konzistentní, opakující se textové formy.
- **Dataset:** ~1 000 příkladů lze získat rozsekáním ~50–100 starších zpráv na oddíly. Z nich se udělají páry „zadání (body, fakta) → odstavec ve stylu autora“.

### Gaps
- Na cílovém notebooku ani na desktopové RTX 4080 16 GB jsem nenašel žádné měření tok/s pro Gemma 4 nebo Qwen3.6.
- Nenašel jsem měřený čas QLoRA tréninku ~1 000 příkladů na 12GB GPU; časy výše jsou odhady.
- Kvalita češtiny u malých modelů (Gemma 4 E4B, Qwen3.6, ThinkingCap) není benchmarkovaná. Je potřeba vlastní test.
- Neexistuje přímá studie RAG vs. fine-tuning pro napodobení autorského stylu. Nejbližší jsou srovnání few-shot vs. fine-tuning.
- Neověřené náznaky novějších modelů, které by mohly být relevantní:
  - Gemma 4 12B: zmíněna v titulku srovnávacího článku [techyon](https://techyon.pages.dev/posts/new-google-gemma-4-12b-claims-near-26b-performance---we-tested-both.html). 12B dense by se do 12 GB vešel a šel by trénovat přes QLoRA.
  - „Qwen 3.8 27B“: Yotta Labs, 8/2026.
  - „Qwen3.8 Max“: srovnání na Roboflow.
- Licenci ThinkingCap-Qwen3.6-27B jsem neověřil (základ Qwen3.6 je Apache 2.0).
- Neověřil jsem, zda Unsloth na Windows 11 běží nativně nebo jen ve WSL2, ani export LoRA do GGUF pro Ollama (vyčerpaný limit vyhledávání; unsloth.ai je zablokovaný).

## 2. Generování a úpravy obrázků na 12 GB: modely a kvantizace (GGUF/NF4/FP8), rychlost, trénink stylové LoRA, ControlNet a editační modely pro sketch-to-render a massing-to-render

### Takeaway
Na 12 GB jsou nejrychlejší Z-Image Turbo (6B; ~2–4 s na obrázek dle komunitních odhadů, FP8 ~8 GB) [RTX 4070 12 GB desktop] a FLUX.2 [klein] 4B (Apache 2.0; ~8–13 GB). Qwen-Image a Qwen-Image-Edit (20B) běží jen jako GGUF Q4 (~10–12 GB): ~45 s na 30 kroků, nebo ~8 s se 4krokovou Lightning LoRA [RTX 4070 12 GB, neověřený návod]. FLUX.1 [dev] v FP8 trvá ~25 s na obrázek 1024 px [RTX 4070 12 GB]. FLUX.2 [dev] (32B) je při 12 GB VRAM a 32 GB RAM nepraktický.

Stylovou LoRA lze pohodlně trénovat na SDXL a Z-Image. FLUX.1 jde na hraně (8bit optimizér, block swap) a trvá hodiny, podle uživatelů až ~8–10 h. Qwen-Image jde jen s FP8 a block swap (musubi-tuner). Na styl je potřeba 50–100+ konzistentních snímků.

Pro sketch-to-render a massing-to-render: ControlNet depth + lineart (SDXL, FLUX, Qwen-Image Union), nebo editační modely Qwen-Image-Edit-2509/2511 (multi-image, Lightning 4 kroky). FLUX.1 Kontext [dev] se v FP8 do 12 GB vejde, ale má nekomerční licenci.

### Cited Findings

#### Modely, VRAM a rychlost na ~12 GB
- FLUX.1 [dev] (12B) v FP8 zabírá ~11 GB v ComfyUI a jeden obrázek 1024 px trvá ~25 s [RTX 4070 12 GB desktop]. GGUF Q8 zabírá ~10 GB a trvá ~28 s [12GB karta] — [localaimaster](https://localaimaster.com/vram/best-flux-model-12gb-vram).
- Jiný návod pro 12GB karty (GGUF Q5_K_S + FP8 T5) uvádí 60–80 s na obrázek. Soubor Q8 má ~12,7 GB a může přetéct — [hardware-corner](https://hardware-corner.net/guides/gpu-for-flux-1-image-model) (ze shrnutí, přiřazení nejisté).
- Starší srovnání z roku 2024 na notebookové RTX 4070 8 GB: dev ~2,5 min, GGUF ~1:30, FP8 ~1:20, NF4 ~60 s. Autor si nebyl jistý, která karta patří ke kterému testu [laptop RTX 4070 8 GB] — [r/FluxAI](https://redlib.hbubli.cc/r/FluxAI/comments/1ff5soy/comparison_between_various_flux_dev_variants).
- FLUX.1 Kontext [dev] (12B, editace) potřebuje v BF16 24 GB, v FP8 přes TensorRT 12 GB a v FP4 7 GB — [Gigazine/NVIDIA](https://wbgsv0a.gigazine.net/gsc_news/en/20250703-nvidia-flux-1-kontext-vram-tensorrt).
- FP8 checkpoint Kontextu se do 12 GB vejde s rezervou 0–2 GB a je ~2× rychlejší než BF16. Pro 8–12GB karty se doporučuje GGUF Q4–Q8 (QuantStack) — [dev.to](https://dev.to/jovan_chan_9500711396d4e6/flux1-kontext-dev-for-local-ai-in-2026-image-editing-on-consumer-gpus-without-the-api-bills-3nd3).
- FLUX.2 [klein] vyšel v lednu 2026 ve velikostech 4B a 9B a umí generovat i upravovat obrázky na spotřebitelských GPU — [The Decoder](https://the-decoder.com/flux-2-small-brings-ai-image-generation-and-editing-to-consumer-graphics-cards/); [Gigazine](https://www.gigazine.net/gsc_news/en/20260116-flux2-klein); [TestingCatalog](https://www.testingcatalog.com/black-forest-labs-launches-flux-2-klein-ai-models); [all-ai.de](https://www.all-ai.de/news/news26top/flux2-klein-release.md):
  - 4B potřebuje ~13 GB (konzervativně, s režií pipeline) nebo ~8,4 GB (distilovaná verze podle benchmarku);
  - 9B potřebuje 19,6 GB, resp. ~24 GB;
  - verze FP8 a NVFP4 snižují VRAM o ~55 %.
- FLUX.2 [dev] (32B, text encoder Mistral) — [InsiderLLM](https://insiderllm.com/guides/flux-locally-complete-guide/); [RunAIHome](https://runaihome.com/blog/flux-2-self-hosting-vram-gguf-guide-2026/); [Apatero](https://apatero.com/blog/comfyui-dynamic-vram-guide-flux-2-8gb); [LocalAIMaster](https://localaimaster.com/blog/flux-2-local-setup-guide) (souhrn, čísla se liší):
  - GGUF Q4 má ~19 GB, takže pro pohodlný provoz je potřeba karta 24 GB;
  - 16 GB (Q3) je na hraně;
  - některé zdroje berou 12 GB jako praktické minimum s FP8 nebo kvantizací a offloadem;
  - systémová RAM: minimum 32 GB, doporučeno 64 GB;
  - jakmile se vrstvy přelijí do RAM, čas generování se násobí; ComfyUI „Dynamic VRAM“ pomáhá;
  - doporučuje se FP8 text encoder místo BF16.
- Qwen-Image (20B MMDiT), verze 2512, v GGUF Q4_K_M: obrázek 1024² na 30 kroků ~45 s, na 4 kroky s Lightning LoRA ~8 s [RTX 4070 12 GB desktop; neověřený komunitní návod] — [dev.to](https://dev.to/gary_yan_86eb77d35e0070f5/qwen-image-2512-gguf-complete-guide-to-running-ai-image-generation-on-consumer-hardware-1l6c).
- Na RTX 5090 trvá krok Qwen-Image-2512 GGUF ~1,2 s, tedy ~24 s na 20 kroků s CFG [RTX 5090] — [byteshape GGUF](https://huggingface.co/byteshape/Qwen-Image-2512-GGUF) (přiřazení dle shrnutí).
- Qwen-Image 2.1 v sestavě Q4_K_M GGUF + Q4_K_M text encoder + VAE zabírá 9,91 GB a vejde se do 12 GB (1024², batch 1); rychlost na 12 GB zatím nikdo nepublikoval — [OpenClawDC](https://openclawdc.com/blog/can-i-run-qwen-image-2-1-locally/).
- Na RTX 4060 Ti 16 GB v INT8 trvá Qwen-Image 2.1 ~20 s na obrázek se špičkou ~15 GB [RTX 4060 Ti 16 GB] — [OpenClawDC](https://openclawdc.com/blog/can-i-run-qwen-image-2-1-locally/). GGUF od leejet existuje — [Spheron](https://www.spheron.network/tools/gpu-recommender/leejet/Qwen-Image-2.1-GGUF/).
- Qwen-Image 2.0 se popisuje jako jediný ~7B model, který sjednocuje generování a editaci, s 8B Qwen3-VL encoderem a maximem 2048×2048 — [Qubrid](https://qubrid.com/blog/qwen-image-2-0-qwen-image-edit-2-0-explained-architecture-benchmarks-api-on-qubrid-ai); [lablab](https://lablab.ai/tech/qwen/qwen-image-2.0); [WaveSpeed](https://wavespeed.ai/blog/posts/blog-what-is-qwen-image-2-0-features-benchmarks).
- Stav licence a vah Qwen-Image 2.0 je sporný. Agregátory uvádějí Apache 2.0, HowAIWorks ho vede jako proprietární model bez závazku vydat váhy — [llm-stats](https://llm-stats.com/models/qwen-image-2.0); [HowAIWorks](https://howaiworks.ai/models/qwen-image).
- Qwen-Image-Edit-2511 — [Kombitz](https://www.kombitz.com/2025/12/23/how-to-use-qwen-image-edit-2511-gguf-in-comfyui/); [Comfy.org hub](https://comfy.org/hub/models/local/qwen-image-edit-2511-lightning-4steps-v1-0-bf16/); [comfyui-mcp model-settings](https://cdn.jsdelivr.net/npm/comfyui-mcp@0.9.4/model-settings.json):
  - plný model má 40,9 GB, pro 12 GB je GGUF Q4_0 (11,9 GB);
  - text encoder je qwen_2.5_vl_7b_fp8_scaled;
  - s Lightning LoRA stačí 4 kroky (cfg 1.0, euler, simple), referenční nastavení je 40 kroků s true-CFG 4.0.
- „Rapid AIO“ merge s vestavěnými Lightning LoRA běží na mnoha 12GB kartách s offloadem — [TechTactician](https://techtactician.com/?p=47602).
- Z-Image Turbo (6B, Alibaba Tongyi) — [dev.to](https://dev.to/gary_yan_86eb77d35e0070f5/z-image-turbo-quantized-complete-guide-to-running-professional-ai-image-generation-on-low-vram-gpus-45fb); [nevercodealone](https://nevercodealone.de/de/glossare/ki-tools-2026/z-image-turbo-alibaba-open-source-bildgenerator-2026); [Reddit snapshot](https://reddit.sentinel-team.org/posts/1qq6qvu/snapshots/2026-01-30T02%3A20%3A19.736808Z); [Codersera](https://codersera.com/blog/z-image-turbo-install-guide-and-flux-vs-dall-e-comparison); [Decrypt](https://decrypt.co/350572/chinas-z-image-dethrones-flux-king-of-ai-art):
  - komunitní odhady: 2–3 s, resp. 3–4 s na obrázek [RTX 4070 12 GB desktop];
  - jiný uživatel naměřil 2,63 s/it × 25 kroků, tedy ~1 min na obrázek, s nestandardním workflow [RTX 4070 12 GB];
  - FP8 verze se vejde do ~8 GB VRAM;
  - ~2,3 s na 1024² [RTX 4090], oficiálně pod 1 s [H800];
  - Decrypt: „Z-Image dethrones Flux“.
- Pro SDXL, SD 3.5 a HiDream jsem v této session nezískal měřené rychlosti ani VRAM (viz Gaps).

#### Trénink LoRA na 12 GB
- FLUX:
  - ai-toolkit (Ostris) je uváděn s 16 GB pro FLUX.1/FLUX.2 a 13 GB pro Klein 4B — [ai-tools-finder](https://ai-tools-finder.pages.dev/tools/ai-toolkit);
  - OneTrainer s 12–16 GB — [ai-tools-finder](https://ai-tools-finder.pages.dev/tools/onetrainer);
  - FluxGym (UI nad Kohya sd-scripts) podporuje 12, 16 i 20 GB — [FluxGym README](https://huggingface.co/spaces/VideoAditor/FluxGym/raw/main/fluxgym-main/README.md);
  - Kohya trénuje FLUX LoRA i na 12 GB s gradient checkpointing a 8bit optimizéry. Jiné zdroje naopak tvrdí, že FLUX LoRA chce 24 GB (rozpor) — [tech-insider](https://tech-insider.org/train-custom-ai-image-lora-2026/); [Apatero](https://apatero.com/blog/flux-lora-training-comfyui-complete-guide-2025).
- Parametry: 10–30 obrázků a 1 000–2 000 kroků. Použitelné výsledky bývají už po 500–1 000 krocích. Pro jednodušší styl stačí rank 8–16 — [tech-insider](https://tech-insider.org/train-custom-ai-image-lora-2026/); [artificial-intelligence-wiki](https://artificial-intelligence-wiki.com/best-ai-tools/ai-image-and-video-generators/flux-lora-training-guide/); [Apatero](https://apatero.com/blog/flux-lora-training-comfyui-complete-guide-2025).
- Časy FLUX LoRA na 12 GB se ve zdrojích výrazně liší:
  - uživatelské reporty: ~10 h na 46 obrázků [RTX 3060 12 GB] a ~8 h [12GB notebooková GPU] — [Civitai: Training Flux optimal settings for a RTX 3060](https://civitai-proxy.pages.dev/articles/7619/training-flux-optimal-settings-for-a-rtx-3060); [r/StableDiffusion](https://redlib.hbubli.cc/r/StableDiffusion/comments/1etszmo/finetuning_flux1dev_lora_on_yourself_lessons/lihg3l4/?context=3) (přiřazení nejisté);
  - odhad 45–60 min na 1 000 kroků [RTX 3060 12 GB] a 25–35 min [RTX 4070 Ti Super], v rozporu s uživatelskými reporty — [dev.to](https://dev.to/thurmon_demich/best-gpu-for-fluxgym-in-2026-5-picks-for-flux-lora-training-pp6);
  - na cloudové H100 se FLUX přes ai-toolkit doladí „za méně než hodinu“ — [Paperspace/DigitalOcean](https://blog.paperspace.com/fine-tune-flux-schnell-dev/).
- Z-Image Turbo LoRA přes ai-toolkit se vejde pod 12 GB — [lilys.ai (AI shrnutí videa)](https://lilys.ai/en/notes/training-lora-20260208/ultimate-free-lora-z-image-turbo-12gb-vram); [lilys.ai](https://lilys.ai/en/notes/training-lora-20260209/train-z-image-turbo-lora-ai-toolkit); [RunComfy](https://www.runcomfy.com/trainer/ai-toolkit/z-image-turbo-lora-training):
  - zapnout Low VRAM a Layer Offloading (100 % pro text encoder) a trénovat v rozlišení 512;
  - výchozí rank je 32;
  - minimum 10–15 obrázků s trigger slovem;
  - doporučuje se „Z-Image V Turbo“ (de-distilovaná verze od Ostrise);
  - příkladový job má 3 000 kroků.
- SDXL LoRA:
  - Kohya uvádí, že SDXL LoRA jde trénovat s 12 GB; jiný průvodce dává 12 GB jako minimum a 24 GB jako doporučení — [vrlatech](https://vrlatech.com/stable-diffusion-lora-training-hardware-requirements/);
  - nedoložený odhad: ~55 min na 1 500 kroků [RTX 3060 12 GB] a ~20 min [RTX 4070 Ti Super 16 GB], obojí při 1024 px s cache — [dev.to](https://dev.to/thurmon_demich/best-gpu-for-kohyass-lora-training-in-2026-ranked-k2k).
- Qwen-Image LoRA:
  - musubi-tuner (kohya-ss) doporučuje pro trénink obrázků ~12 GB a podporuje FP8 i block swapping; revize kvantovaných modulů snížila potřebu VRAM pro Qwen-Image LoRA o ~5 GB — [SourcePulse/musubi-tuner](https://www.sourcepulse.org/projects/1841384);
  - 12GB recept pro příbuzný model Krea 2: `--fp8_base --fp8_scaled --blocks_to_swap 20` plus gradient checkpointing. FP8 a block swap jsou pro vejití do 12 GB důležitější než rank — [CivArchive](https://civarchive.com/articles/32566/how-to-train-a-krea-2-lora-on-a-12gb-gpu).
- Kolik obrázků na stylovou LoRA: komunitní průvodce na Civitai 50–100; jiný minimum 50 a ideálně 300–500; Zsky 50–200; obecný průvodce pro Z-Image 20–30. Konzistence stylu napříč různými motivy je stejně důležitá jako počet — [Civitai komunitní články](https://civitai-proxy.pages.dev/articles/3522); [Zsky](https://zsky.ai/blog/lora-training-guide); [dev.to Z-Image](https://dev.to/gary_yan_86eb77d35e0070f5/best-practices-for-training-lora-models-with-z-image-complete-2026-guide-4p7h); [fal.ai](https://blog.fal.ai/training-flux-style-lora-on-fal-ai).

#### Sketch-to-render a massing-to-render
- Runflow (6/2026) uvádí architektonické hmotové skici jako typický případ pro render přes ControlNet. Zašmodrchané linie ale dávají modelu prostor hádat — [Runflow](https://www.runflow.io/blog/comfyui-sketch-to-image).
- Podle dokumentace ComfyUI se depth mapy dělají custom balíkem comfyui_controlnet_aux. Pro architekturu se doporučuje depth kombinovat s lineart: zachová prostorové vztahy a zpevní obrysy — [docs.comfy.org](https://docs.comfy.org/tutorials/controlnet/depth-controlnet.md).
- Váhy ControlNet pro SD1.5, SDXL a FLUX nejsou zaměnitelné — [eastondev](https://eastondev.com/blog/en/posts/ai/20260719-comfyui-controlnet-guide/) (přiřazení dle shrnutí).
- ControlNet pro Qwen-Image: InstantX Qwen-Image-ControlNet-Union (canny, soft edge, depth, pose); ComfyUI šablony ControlNet patch (canny, depth, inpaint) a Union Control LoRA (canny, depth, lineart, softedge, normal, openpose) — [HF InstantX](https://huggingface.co/InstantX/Qwen-Image-ControlNet-Union/blob/main/README.md?code=true); [Comfy.org patch](https://comfy.org/templates/image_qwen_image_controlnet_patch); [Comfy.org union LoRA](https://comfy.org/templates/image_qwen_image_union_control_lora).
- Qwen-Image-Edit-2509 přinesla vícevstupovou editaci (spojování obrázků) a nativně podporuje ControlNet keypoint mapy (pozice postav). Vestavěný depth, canny nebo sketch kontrolér oficiálně potvrzený není; recenze ale ukazuje i případ sketch-to-image — [dev.to](https://dev.to/czmilo/qwen-image-edit-2509-complete-review-guide-revolutionary-upgrade-in-ai-image-editing-4e0).
- How To Rhino nabízí workshop „ComfyUI for Architects“ — [howtorhino](https://howtorhino.com/premium/workshops/comfyui-for-architects/).

### Inferences
- **Licenčně čistá sestava pro tento notebook** (licence viz sekce 5):
  - Z-Image Turbo na rychlé varianty a náhledy (licenci jsem neověřil);
  - FLUX.2 [klein] 4B (Apache 2.0);
  - Qwen-Image-Edit-2511 v GGUF Q4 s Lightning LoRA na úpravy fotek a převod skica/hmota → render;
  - Qwen-Image s ControlNet Union pro přesné vedení geometrií.
- FLUX.1 [dev], Kontext [dev], FLUX.2 [dev] a [klein] 9B jen na interní nekomerční pokusy, nebo po zakoupení licence BFL.
- **Převod rychlostí:** notebooková RTX 4080 při 140 W je výkonem zhruba mezi desktopovou RTX 4070 a 4070 Ti (čip AD104; ~35 % pomaleji než desktop RTX 4080, viz sekce 6). Čísla z desktopové RTX 4070 12 GB tedy berte jako ±20% přiblížení.
- **Očekávané časy na obrázek na notebooku** (odhad):
  - Z-Image Turbo ~3–6 s;
  - Qwen-Image-Edit-2511 v GGUF Q4 + Lightning (4 kroky) ~10–20 s (8 s pro Qwen-Image na RTX 4070 plus režie vision encoderu u editace);
  - FLUX.1 [dev] v FP8 ~25–35 s;
  - FLUX.1 [schnell] (stejných 12B, 1–4 kroky) zhruba 4–6× rychleji než dev na 20 kroků. To je neměřený odhad z počtu kroků.
- **Plán stylové LoRA z vlastních projektů:**
  - 50–150 vybraných vlastních obrázků (rendery a fotky realizací) s různými motivy, stejným rukopisem a popisky obsahu (ne stylu) plus trigger slovo;
  - lokálně přes noc SDXL nebo Z-Image, odhadem ~1–3 h;
  - FLUX nebo Qwen-Image v 1024 px raději v cloudu: ~1 h na 24–80GB GPU místo ~8–10 h lokálně.
- **Massing-to-render:**
  - Lepší než odhadovat hloubku z obrázku je exportovat z Revitu, Rhina nebo SketchUpu přímo depth/lineart nebo „clay“ pohled. Ten pak vede ControlNet depth + lineart.
  - Alternativa: Qwen-Image-Edit-2511 se screenshotem pohledu a referenčním obrázkem materiálu.
  - Pro technicky přesné výstupy (fasády, rozměry) je nutná kontrola. Modely geometrii „domýšlejí“ (Runflow).
- **Daň za 12 GB:** 20B modely jen v Q4 (ztrátu kvality jsem neměřil) a střídání text encoderu s difuzním modelem mezi RAM a VRAM, což přidává čas. FLUX.2 [dev] s 24B encoderem vyžaduje 32–64 GB RAM, takže při 32 GB RAM a souběžném Revitu nepřichází v úvahu.

### Gaps
- Nenašel jsem žádné měření obrazových modelů na RTX 4080 Laptop 12 GB ani na desktopové RTX 4080 16 GB.
- SDXL, SD 3.5 a HiDream: rychlost a VRAM na 12 GB jsem neověřil (vyčerpaný limit vyhledávání). HiDream jsem nezkoumal vůbec.
- IP-Adapter, FLUX Redux a multi-reference editaci FLUX.2 jsem nepokryl.
- Neověřeno: licence Z-Image a existence ControlNetu pro Z-Image; licence a rychlost FLUX.1 [schnell].
- Chybí kvalitativní srovnání modelů na architektonických renderech (věrnost geometrie, materiály).
- Licence Qwen-Image 2.0/2.1 je sporná. 2.1 má údajně nekomerční research licenci (sekce 5).
- Model „Krea 2“ se objevuje v článku o 12GB tréninku LoRA, ale jeho licenci ani dostupnost vah jsem neověřil.

## 3. Vision-language modely: co se vejde do 12 GB, měřená přesnost na výkresech a půdorysech, OCR češtiny

### Takeaway
Plně do 12 GB se vejdou Qwen3-VL-8B (Q4_K_M ~6,1 GB, „komfortně 12–16 GB“) a Gemma 4 E4B. Qwen3-VL-30B-A3B (~20 GB ve 4 bitech), Gemma 4 26B-A4B a Qwen3.6 (27B i 35B-A3B, nativně multimodální) jen s offloadem.

„Výkresová gramotnost“ je slabá i u nejlepších cloudových modelů. V benchmarku AECV-Bench (1/2026) dosáhly v otázkách nad výkresy:

| Model | QA nad výkresy |
|---|---|
| Gemini 3 Pro | 0,854 |
| GPT-5.2 | 0,792 |
| Claude 4.5 | 0,719 |
| GLM-4.6V (open-source) | 0,604 |

Dveře a okna v půdorysech modely spočítají jen s exact match ~0,09–0,39 (MAPE 20–50 %). OCR a textové dotazy fungují, symboly a prostorové uvažování ne. Pro OCR češtiny jsem nenašel žádný měřený benchmark, takže je nutný vlastní test.

### Cited Findings
- AECV-Bench (arXiv 2601.04819, leden 2026) — [arXiv 2601.04819](https://www.arxiv.org/pdf/2601.04819); [Emergent Mind](https://api.emergentmind.com/topics/aecv-bench); [Moonlight review](https://www.themoonlight.io/review/aecv-bench-benchmarking-multimodal-models-on-architectural-and-engineering-drawings-understanding):
  - Počítání objektů na 120 půdorysech: dveře, okna, ložnice, WC. Počítají se jen otočné dveře s obloukem, dvoukřídlé jako dvoje a malá okna WC se započítávají.
  - 192 párů otázka–odpověď nad výkresy: OCR, počítání, prostorové a srovnávací uvažování.
  - Open-source modely v testu: Mistral Large 3, Qwen3 VL 8B Instruct, GLM-4.6V a NVIDIA Nemotron Nano 12B V2 VL.
  - Výsledky QA: Gemini 3 Pro 0,854, GPT-5.2 0,792, Claude 4.5 0,719, GLM-4.6V 0,604, Grok 4.1 0,312.
  - Gemini 3 Pro při počítání: průměrný exact match 0,51, dveře 0,39, okna 0,34, průměrná MAPE 16 %.
  - Obecně: dveře a okna ~0,09–0,39 exact match a 20–50 % MAPE; ložnice a WC ~0,74–0,91.
  - Závěr autorů: modely „fungují dobře jako asistenti pro dokumenty, ale chybí jim robustní výkresová gramotnost“. OCR a textové QA jsou silné, symboly a prostorové uvažování slabé.
  - Kód a data jsou na GitHubu (AECFoundry/AECV-Bench).
- ArchSIBench obsahuje 3 000 otázek s výběrem odpovědí nad půdorysy, řezy a vizualizacemi. Testoval 27 VLM včetně GPT-4o a Qwen3.5 (zero-shot). Lidé s architektonickým vzděláním dosáhli průměrně 89,2 %. Skóre jednotlivých modelů jsem nezískal — [Moonlight review ArchSIBench](https://www.themoonlight.io/en/review/archsibench-benchmarking-the-architectural-spatial-intelligence-of-vision-language-models).
- FloorplanVLM (arXiv 2602.06507) převádí rastrové půdorysy na vektory. Zavádí benchmark FPBench-2K (2 000 půdorysů, pravoúhlé i složité geometrie) a dosahuje 92,52 % IoU vnějšího obrysu. Jde o úlohu rekonstrukce, ne QA — [arXiv 2602.06507](https://arxiv.org/html/2602.06507v1).
- ArchPlanVQA je benchmark VLM nad CAD půdorysy (Journal of Computing in Civil Engineering, 2026). Metriky jsem nezískal — [scite](https://scite.ai/reports/archplanvqa-benchmark-and-comprehensive-evaluation-r60AmAY3).
- PlanQA/FloorplanQA je textový benchmark nad strukturovanými půdorysy. Modely zvládají mělké dotazy, ale selhávají na fyzikálních omezeních — [arXiv 2507.07644](https://arxiv.org/html/2507.07644v1).
- Qwen3-VL — [Codersera](https://codersera.com/blog/qwen3-vl-4b-vs-qwen3-vl-8b-benchmarks-vram-guide/); [HF kolekce Qwen3-VL](https://huggingface.co/collections/Qwen/qwen3-vl); [issoh.co.jp](https://www.issoh.co.jp/md/tech/10073):
  - velikosti 4B, 8B, 30B-A3B (MoE) a 235B-A22B (MoE), GGUF existují pro 4B, 8B a 30B-A3B;
  - 8B v Q4_K_M má ~6,1 GB, minimum je 8 GB VRAM, komfortně 12–16 GB;
  - 30B-A3B ve 4 bitech má ~20 GB a s obrazovými tokeny a KV cache spotřeba roste;
  - v Ollama `qwen3-vl:8b` a `qwen3-vl:4b`. Pozor na tagy: podle jednoho zdroje je tag bez přípony verze Thinking.
- Hugging Face upozorňuje, že Qwen3-VL není optimalizovaný na jeden univerzální OCR prompt a doporučuje s prompty experimentovat. Benchmark olmOCR je jen anglický — [HF blog: Supercharge your OCR Pipelines with Open Models](https://huggingface.co/blog/ocr-open-models).
- Gemma 4 ve vision benchmarcích (sekundární zdroje): MMMU Pro 76,9 % (31B), 73,8 % (26B-A4B), 52,6 % (E4B) a 44,2 % (E2B). OmniDocBench edit distance pro 31B je 0,131 — [lushbinary](https://lushbinary.com/blog/gemma-4-developer-guide-benchmarks-architecture-local-deployment-2026); [WaveSpeed](https://wavespeed.ai/blog/posts/what-is-google-gemma-4/).
- Podle diskuse na HF (citované ve shrnutí) Gemma 4 31B nespolehlivě rozpoznává veškerý text v obrázku a analýza grafů je silnější než OCR dokumentů — [localllmmodels blog](https://localllmmodels.blogspot.com/2026/04/google-gemma-4-models-explained-specs.html) (zprostředkovaně).
- Qwen3.6-27B i 35B-A3B přijímají text, obraz a video — [OpenRouter](https://openrouter.ai/models/qwen/qwen3.6-35b-a3b); [OpenRouter (Helicone)](https://openrouter.helicone.ai/qwen/qwen3.6-27b).
- PaddleOCR-VL (0,9B) podporuje 109 jazyků. Čeština ve shrnutí výslovně uvedená nebyla. Existuje novější PaddleOCR-VL-1.6 — [arXiv 2510.14528](https://arxiv.org/pdf/2510.14528); [HF PaddleOCR-VL](https://huggingface.co/NeuralMetrics/PaddleOCR-VL).
- Studie OCR starořeckých edic měří chybovost Qwen3-VL-2B a 8B zvlášť s diakritikou a bez ní. Metodu lze přenést na češtinu — [arXiv 2605.27750](https://arxiv.org/pdf/2605.27750).
- Existuje studie „Do VLMs Read or Rewrite? On Transcription Faithfulness in VLMs“ o tom, zda VLM přepisují věrně, nebo text „přepisují“. Mám jen název, výsledky jsem nezískal — [arXiv 2607.21617](https://arxiv.org/pdf/2607.21617).

### Inferences
- **Na co VLM používat:**
  - Spolehlivé: čtení rohových razítek a legend, výpis textů a tabulek (výkaz místností), popis fotek staveniště a skic, sumarizace PDF zpráv.
  - Střední spolehlivost: názvy a plochy místností, pokud jsou natištěné.
  - Nespolehlivé (AECV-Bench): počítání symbolů (dveře, okna), čtení kótovacích řetězců, měření v měřítku a porovnávání revizí.
- **PDF z CADu** mají textovou vrstvu. Text je lepší vytáhnout přímo (bez OCR) a VLM nasadit jen na rastrové skeny a fotky.
- **Lokální 8B model** má v AECV-Bench nejspíš výsledek pod GLM-4.6V (0,604). Skóre Qwen3-VL-8B jsem ale nezískal, takže jde o nejistý odhad. U kritických úloh (kontrola projektu) je nutná lidská kontrola, nebo cloudový model se smlouvou o zpracování dat.
- **Test OCR češtiny** (doporučený postup): 20–50 stránek typických dokumentů (skeny zpráv, razítka, ručně psané poznámky). Spočítat CER s diakritikou i bez ní a porovnat Qwen3-VL-8B, Gemma 4 E4B/26B-A4B a PaddleOCR-VL.
- **Paměť na 12 GB:** výkresy ve vysokém rozlišení generují mnoho obrazových tokenů a KV cache roste. Výkresy je lepší dělit na dlaždice (výřezy) a omezit kontext.

### Gaps
- Skóre Qwen3-VL-8B, Nemotron Nano 12B V2 VL a Mistral Large 3 v AECV-Bench jsem nezískal (PDF ani GitHub nebylo možné přímo číst).
- Neexistuje měřený benchmark OCR češtiny (diakritika, technická terminologie) pro žádný VLM.
- Chybí OCR čísla pro Gemma 4 E4B a 26B-A4B.
- Skóre jednotlivých modelů v ArchSIBench a výsledky ArchPlanVQA jsem nezískal.
- Nikdo neměřil Qwen3.5/3.6 (nativně multimodální) na výkresech, ani vliv kvantizace Q4 na přesnost čtení výkresů.

## 4. 3D a BIM: image/text-to-3D (TRELLIS, Hunyuan3D) a jejich skutečný přínos vs. LLM-řízené parametrické modelování (Blender + Bonsai/IfcOpenShell, Grasshopper)

### Takeaway
Image-to-3D modely (TRELLIS.2, Hunyuan3D 2.1) vyrábějí texturované meshe, ne BIM. Na 12 GB běží jen s optimalizacemi: Hunyuan3D tvar ~6–10 GB a textura ~20+ GB, TRELLIS.2 oficiálně ≥24 GB a jen Linux.

Licence jsou pro český ateliér zásadní. Licence Hunyuan3D výslovně vylučuje území EU, tedy i ČR. TRELLIS.2 je pod MIT, ale jeho závislosti nvdiffrast a nvdiffrec mají NVIDIA licenci jen pro výzkum.

Prakticky užitečnější je LLM-řízené parametrické modelování: MCP servery pro Blender s Bonsai/IfcOpenShell (MCP4IFC, Bonsai-MCP), kde LLM generuje IFC Python kódem.

### Cited Findings
- TRELLIS.2 (Microsoft) — [HF README (mirror)](https://hf-2025.pages.dev/microsoft/TRELLIS.2-4B/raw/main/README.md); [projektová stránka](https://microsoft.github.io/TRELLIS.2); [Clore docs](https://docs.clore.ai/guides/3d-generation/trellis-3d); [st-hakky VRAM guide](https://book.st-hakky.com/en/data-science/trellis2-native-vs-legacy-vram-guide):
  - 4B model image-to-3D, model i kód pod licencí MIT;
  - modelová karta vyžaduje NVIDIA GPU s alespoň 24 GB;
  - testováno jen na Linuxu, Windows oficiálně podporované nejsou;
  - komunitní ComfyUI wrapper údajně běží i na 8 GB (neoficiální);
  - časy ~3 s při 512³, ~17 s při 1024³ a ~60 s při 1536³ (HW ve shrnutí jasně uveden nebyl).
- CGWorld upozorňuje, že TRELLIS.2 závisí na NVIDIA nvdiffrast a nvdiffrec pod NVIDIA Source Code License, která omezuje použití na výzkum a hodnocení. Komerční použití tak může být omezené — [CGWorld](https://cgworld.jp/flashnews/01-202601-TRELLIS2.html).
- Hunyuan3D 2.1: tvar potřebuje 10 GB, textura 21 GB, obojí dohromady 29 GB. Model tvaru má 3,3B parametrů, model textury 2B — [HF Space README](https://huggingface.co/spaces/victor/Hunyuan3D-2.1/blob/main/README.md).
- Komunitní uživatel v ComfyUI vygeneroval mesh se 6 GB VRAM, ale doporučuje 10+ GB na mesh a 20+ GB na texturu — [Clore docs](https://docs.clore.ai/guides/3d-generation/hunyuan3d); [tspi.at](https://www.tspi.at/2026/05/01/opensource3dassets.html) (přiřazení nejisté).
- Projekt WinPortable uvádí ≥3 GB VRAM pro geometrii (s maximální optimalizací pro 2.1) a ≥6 GB pro texturu. API verze 2.1 ale optimalizace mmgp nemá. Gradio aplikace má přepínač `--low_vram_mode` — [Hunyuan3D-2-WinPortable](https://gh.hhj520.top/dwongdev/Hunyuan3D-2-WinPortable).
- Podle jiného návodu dokumentace WinPortable uvádí 24 GB jako „floor“, což je v rozporu s předchozím — [Codersera](https://codersera.com/blog/set-up-hunyuan3d-2-on-windows-a-step-by-step-guide/amp/).
- Licence Tencent Hunyuan 3D 2.0 Community License definuje „Territory“ jako celý svět kromě EU, Spojeného království a Jižní Koreje. Použití mimo Territory je podle licence „unlicensed and unauthorized“ — [HF LICENSE Hunyuan3D-2](https://huggingface.co/tencent/Hunyuan3D-2/blob/main/LICENSE); [Wind River license list](https://open.windriver.com/info/uni-license-list/licenses/tencent-hunyuan-3d-2.0-cla.html).
- Pro Hunyuan3D-Omni uvádí DeepWiki stejné výjimky — [DeepWiki](https://deepwiki.com/Tencent-Hunyuan/Hunyuan3D-Omni/6.1-licensing-and-legal).
- MCP4IFC (arXiv 2511.05533) — [arXiv 2511.05533](https://arxiv.org/pdf/2511.05533v1); [MCP4IFC web](https://show2instruct.github.io/mcp4ifc); [Emergent Mind](https://www.emergentmind.com/topics/mcp4ifc):
  - Architektura: MCP klient (např. Claude Desktop), Python MCP server a Blender s Bonsai a IfcOpenShell.
  - IfcOpenShell zajišťuje tvorbu, dotazy, editaci a I/O IFC. Bonsai mapuje IFC entity na meshe v Blenderu.
  - Klíčový nástroj execute_ifc_code_tool nechá LLM generovat Python s IFC operacemi.
  - Podle autorů agent z jediného textového promptu vytvoří složitou IFC geometrii a jde o „první komplexní MCP server pro tvorbu, editaci a dotazy nad IFC“.
- Bonsai-MCP (Show2Instruct / J. D. Rodriguez) propojí MCP klienta (Claude, Cursor, VS Code) s běžícím Blenderem a Bonsai. Vyžaduje Blender 3.6+. Naslouchá jen na 127.0.0.1 bez autentizace a `execute_blender_code` spouští libovolný Python — [Glama](https://glama.ai/mcp/servers/Show2Instruct/bonsai-mcp); [Playbooks](https://playbooks.com/mcp/jotaderodriguez-bonsai-blender-ifc).
- IFC-Bonsai-MCP přidává RAG nástroj nad dokumentací IFC a best practices. Ten pomáhá s voláními IfcOpenShell API, která model nezná — [GitHub ifc-bonsai-mcp](https://github.com/Show2Instruct/ifc-bonsai-mcp).
- Srovnávací tabulka v arXiv článku uvádí jako existující servery Bonsai-MCP a ifcMCP (IfcOpenShell, HTTP). Většina serverů má monolitický návrh — [arXiv 2601.00809](https://arxiv.org/html/2601.00809) (přiřazení tabulky k tomuto článku dle shrnutí).

### Inferences
- **Hunyuan3D v ČR:** podle textu licence není český ateliér licencovaným uživatelem. Hunyuan3D 2.x by neměl používat ani interně bez individuální licence od Tencentu. Na Windows by technicky běžel (WinPortable, nízká VRAM), ale licence to vylučuje.
- **TRELLIS.2 na notebooku:** potřeboval by WSL2 (Linux) a paměťové optimalizace. Před komerčním použitím je nutné prověřit licenci nvdiffrast a nvdiffrec.
- **Reálný přínos 3D generování:**
  - Vhodné: doplňky a entourage (nábytek, plastiky, stromy), rychlá „koncepční hmota“ ze skici pro prezentaci, objekty pro kontextové vizualizace.
  - Nevhodné: projektová dokumentace. Výstupem je mesh bez IFC tříd a parametrických stěn či desek, s nepřesnými rozměry a nutností retopologie.
  - Kvantitativní studii užitečnosti pro architekturu jsem nenašel, jde o úsudek z povahy výstupů.
- **Praktická alternativa:** LLM píše IfcOpenShell nebo Blender Python, který staví parametrické prvky (stěny, desky, otvory, podlaží) z textu nebo tabulek, přes MCP4IFC nebo Bonsai-MCP.
  - Lokálně to může řídit Qwen3.6-35B-A3B nebo ThinkingCap-27B. Spolehlivost lokálních modelů v generování IfcOpenShell kódu jsem nezměřil, takže je nutný člověk ve smyčce.
  - Bezpečnost: Bonsai-MCP bez autentizace spouští libovolný kód, proto ho používat jen lokálně a s důvěryhodnými vstupy.
- Automatizaci Revitu (Revit API, pyRevit, MCP pro Revit) řeší souběžná rešerše o agentech a BIM. Tady ji nepokrývám.

### Gaps
- Nové verze Hunyuan3D (2.5, 3.x), jejich VRAM a licence a měřený běh TRELLIS.2 na 12 GB jsem nedohledal. U časů TRELLIS.2 není jasný HW.
- Chybí měřené hodnocení užitečnosti image-to-3D pro architekturu (přesnost hmoty, použitelnost v BIM).
- Grasshopper/Rhino MCP a LLM-řízený Grasshopper jsem nezkoumal (vyčerpaný limit vyhledávání).
- Přesnost lokálních LLM při generování IfcOpenShell kódu nebyla nalezena.

## 5. Licence: komerční použití výstupů a dotrénovaných derivátů

### Takeaway
Komerčně čisté pro výstupy i dotrénované deriváty jsou:
- Gemma 4 (Apache 2.0, od dubna 2026 bez vlastních Gemma Terms of Use);
- Qwen3.6 (Apache 2.0);
- FLUX.2 [klein] 4B (Apache 2.0);
- pyannote community-1 (CC-BY-4.0, nutné uvést autora);
- SD 3.5 pod Stability Community License, zdarma pro organizace s obratem pod 1 mil. USD ročně.

Problémové jsou:
- FLUX.1 [dev] a Kontext [dev], FLUX.2 [dev] a [klein] 9B: nekomerční licence modelu. Výstupy jsou podle textu licence formálně použitelné komerčně, ale je to sporné. Deriváty (LoRA) jen nekomerčně. Čistá cesta je placená licence BFL.
- Hunyuan3D: území EU je vyloučeno.
- TRELLIS.2: závislosti NVIDIA jen pro výzkum.
- Qwen-Image 2.1: údajně research licence.

### Cited Findings
- Gemma 4 přešla na standardní Apache 2.0 a vypustila vlastní Gemma Terms of Use. Licence povoluje komerční užití, hostované produkty, fine-tuning, sublicencování a redistribuci; podmínkou je uvedení licence a autorství. Ochranné známky Google zůstávají chráněné — [MindStudio](https://www.mindstudio.ai/blog/gemma-4-apache-2-license-commercial-use); [noze.it](https://www.noze.it/en/insights/gemma-new-release/) (sekundární zdroje).
- Jedna analýza tvrdí, že se Gemma Prohibited Use Policy na Gemma 4 přes licenci vah nevztahuje — [vorplabs](https://vorplabs.com/models/gemma-license) (přiřazení nejisté, jediný zdroj).
- Qwen3.6 (27B i 35B-A3B) je pod Apache 2.0 — [OpenRouter](https://openrouter.ai/models/qwen/qwen3.6-35b-a3b); [OpenRouter (Helicone)](https://openrouter.helicone.ai/qwen/qwen3.6-27b).
- FLUX.1 [dev] Non-Commercial License — [Wind River (text licence)](https://open.windriver.com/info/uni-license-list/licenses/flux-1-nc.html); [BFL Help Center](https://help.bfl.ai/articles/9272590838-self-serve-dev-license-overview-pricing); [HF diskuse FLUX.1-dev](https://huggingface.co/black-forest-labs/FLUX.1-dev/discussions/7); [Reddit diskuse](https://redlib.hbubli.cc/r/StableDiffusion/comments/1flm5te/explain_flux_dev_license_to_me):
  - modely smíte používat, vytvářet z nich deriváty a šířit je „solely for your Non-Commercial Purposes“;
  - za komerční se považuje činnost generující příjem nebo přímé interakce s koncovými uživateli;
  - licence uvádí: „We claim no ownership rights in and to the Outputs“, a podle jedné verze „You may use Output for any purpose (including for commercial…“ (úryvek je useknutý);
  - BFL prodává „FLUX [dev] Self-Hosted Commercial License“, která výslovně povoluje komerční užití modelu i výstupů;
  - komunita se ve výkladu přou.
- Balíček FLUX.1 Kontext [dev] NF4 na HF odkazuje na FLUX.1 [dev] License, takže Kontext má zřejmě stejné nekomerční podmínky (neověřeno přímo) — [HF](https://huggingface.co/aniketppanchal/flux.1-kontext-dev-nf4-pkg).
- FLUX.2 [klein] 4B je pod Apache 2.0. [klein] 9B a [dev] jsou pod FLUX Non-Commercial License — [The Decoder](https://the-decoder.com/flux-2-small-brings-ai-image-generation-and-editing-to-consumer-graphics-cards/); [TestingCatalog](https://www.testingcatalog.com/black-forest-labs-launches-flux-2-klein-ai-models).
- Stability AI Community License: organizace s ročním obratem pod 1 mil. USD (bez ohledu na zdroj příjmů) smějí komerčně používat Core Models i deriváty zdarma. Nad touto hranicí je potřeba placená Enterprise licence, výzkum je zdarma — [stability.ai/license](https://stability.ai/license).
- Licence nespecifikuje, zda se hranice 1 mil. USD počítá za entitu, dceřinou společnost, nebo skupinu — [ConductAtlas](https://conductatlas.com/platform/stability-ai/stability-ai-model-license/revenue-based-license-threshold/).
- Qwen-Image 2.1 je údajně pod „Qwen Research License Agreement“ z 20. 9. 2026 a komerční užití vyžaduje samostatnou licenci. U Qwen-Image 2.0 se zdroje rozcházejí (Apache 2.0 vs. proprietární) — [OrcaRouter](https://www.orcarouter.ai/blog/qwen-image-2-1-open-weights-research-license); [HowAIWorks](https://howaiworks.ai/models/qwen-image) (neověřeno u Qwen).
- Hunyuan3D 2.x: Territory vylučuje EU, Spojené království a Jižní Koreu — [HF LICENSE](https://huggingface.co/tencent/Hunyuan3D-2/blob/main/LICENSE).
- TRELLIS.2 je pod MIT, ale nvdiffrast a nvdiffrec jsou pod NVIDIA Source Code License (výzkum a hodnocení) — [CGWorld](https://cgworld.jp/flashnews/01-202601-TRELLIS2.html).
- pyannote speaker-diarization-community-1 — [HF karta](https://huggingface.co/pyannote/speaker-diarization-community-1); [pyannote.ai blog](https://pyannote.ai/blog/community-1); [pyannote.ai models](https://www.pyannote.ai/md/models); [NexaAI Pyannote-NPU README](https://huggingface.co/NexaAI/Pyannote-NPU/blob/main/README.md):
  - váhy jsou pod CC-BY-4.0, ke stažení je ale nutné na HF přijmout podmínky (gated);
  - kód je pod MIT, placený model Precision-2 má komerční licenci;
  - pozor na přebalené verze: např. NPU verze od NexaAI je pod CC BY-NC 4.0.

### Inferences
Shrnutí pro ateliér. Jde o výklad pro technické rozhodování, ne o právní radu.

| Model / nástroj | Licence | Komerční výstupy | Komerční vlastní LoRA/derivát | Ověřeno v této session |
|---|---|---|---|---|
| Gemma 4 (E4B, 26B-A4B, 31B) | Apache 2.0 | Ano | Ano (při šíření uvést licenci a NOTICE) | Sekundární zdroje |
| Qwen3.6 (27B, 35B-A3B) | Apache 2.0 | Ano | Ano | Sekundární zdroje |
| ThinkingCap-Qwen3.6-27B | ? (základ Apache 2.0) | Pravděpodobně ano | ? | Ne |
| FLUX.2 [klein] 4B | Apache 2.0 | Ano | Ano | Ano (sekundární) |
| FLUX.1 [dev], Kontext [dev], FLUX.2 [dev], [klein] 9B | FLUX Non-Commercial | Text licence výstupy nezakazuje, ale generování pro klienta je komerční užití modelu | Ne (deriváty jen nekomerčně) | Ano, výklad sporný |
| SD 3.5 | Stability Community | Ano, pod 1 mil. USD obratu | Ano, pod 1 mil. USD | Ano |
| Qwen-Image 2.1 | Údajně Qwen Research License | Ne bez licence | Ne | Ne (jeden zdroj) |
| Hunyuan3D 2.x | Tencent Community, mimo EU | V ČR nelicencováno | Ne | Ano |
| TRELLIS.2 | MIT + NVIDIA nvdiffrast | Riziko | Riziko | Ano (jeden zdroj) |
| pyannote community-1 | CC-BY-4.0 | Ano, s uvedením autora | Ano, s uvedením autora | Ano |

- Prakticky: stylovou LoRA pro klientské rendery trénovat na komerčně čistém základu (FLUX.2 [klein] 4B, SDXL, SD 3.5, Z-Image nebo Qwen-Image podle ověřené licence), ne na FLUX.1 [dev].
- Autorskoprávní ochrana výstupů AI v EU a ČR je samostatné téma, které tato rešerše nepokrývá.

### Gaps
V této session neověřeno (vyčerpaný limit vyhledávání; HF zablokovaný), ověřit na modelových kartách:
- SDXL (CreativeML Open RAIL++-M a jeho omezení užití);
- FLUX.1 [schnell] (uváděno Apache 2.0);
- Qwen-Image, Qwen-Image-Edit 2509/2511 a 2512 (běžně uváděno Apache 2.0);
- Z-Image Turbo/Base/Edit;
- HiDream-I1/E1;
- Qwen3-VL;
- Whisper a faster-whisper (MIT);
- Parakeet-TDT-0.6B-v3;
- ThinkingCap;
- soubor LICENSE Gemma 4 přímo na HF.

## 6. Praktické limity notebooku (termika, strop 12 GB, souběh s Revitem), řeč a kdy si pronajmout cloudové GPU (ceny, ochrana dat)

### Takeaway
RTX 4080 Laptop má čip AD104, 7 424 shaderů a 12 GB GDDR6 na 192bit sběrnici s propustností 432 GB/s. V tomto notebooku má TGP až 140–150 W. Je ~35 % pomalejší než desktopová RTX 4080 16 GB (717 GB/s, 320 W). CPU (PL1 90 W) a GPU sdílí chlazení 18mm šasi. Tvrdé stropy jsou 12 GB VRAM a 32 GB nerozšiřitelné RAM. Souběh s Revitem vylučuje velké modely s offloadem do RAM.

Do cloudu patří trénink LLM nad ~14B, FLUX nebo Qwen-Image LoRA ve vyšším rozlišení a FLUX.2 [dev]. Orientační ceny (2026):

| GPU | Cena za hodinu |
|---|---|
| RTX 4090 | ~0,14–0,89 USD |
| A100 80 GB | ~1,39–1,79 USD |
| H100 | ~1,49–4,29 USD |

Pro citlivá data RunPod Secure Cloud v EU regionu (SOC 2 Type II, GDPR). Řeč: Whisper large-v3-turbo potřebuje ~1,5–1,6 GB VRAM, pyannote community-1 je pod CC-BY-4.0. Měřené české WER jsem nenašel.

### Cited Findings

#### Hardware a termika
- RTX 4080 Laptop má 7 424 shaderů (desktopová RTX 4070 Ti má 7 680) a paměť na 20 000 MHz se 192bit sběrnicí. Podle Notebookchecku je postavená na čipu AD104, jiný zdroj uvádí AD103 (rozpor) — [Notebookcheck spec](https://www.notebookcheck.net/NVIDIA-GeForce-RTX-4080-Laptop-GPU-Benchmarks-and-Specs.675174.0.html); [gpuprix](https://gpuprix.com/uk/compare/geforce-rtx-4080-vs-geforce-rtx-4080-laptop).
- Desktopová RTX 4080 má 9 728 CUDA jader, 16 GB GDDR6X, 256bit sběrnici, 717 GB/s a limit 320 W. Notebooková má 432 GB/s a limit 150 W — [gpuprix](https://gpuprix.com/uk/compare/geforce-rtx-4080-vs-geforce-rtx-4080-laptop).
- V testech Notebookchecku je mobilní RTX 4080 o ~35 % pomalejší než desktopová — [Notebookcheck](https://www.notebookcheck.net/The-mobile-GeForce-RTX-4080-is-35-percent-slower-than-the-desktop-RTX-4080-and-that-can-be-problematic-for-consumers.691712.0.html).
- Zenbook Pro 16X (UX7602BZ) — [Notebookcheck review](https://www.notebookcheck.net/Zenbook-Pro-16X-2023-review-Maximum-power-from-the-Asus-flagship-at-last.767417.0.html); [Notebookcheck spec](https://www.notebookcheck.net/Asus-ZenBook-Pro-16X-OLED-UX7602BZ.754845.0.html); [Notebookcheck článek](https://www.notebookcheck.net/Significantly-stronger-than-its-predecessor-New-Asus-Zenbook-Pro-16X-is-at-gaming-laptop-performance-level.770070.0.html); [Notebookcheck CN](https://www.notebookcheck-cn.com/Zenbook-Pro-16X-2023.767863.0.html):
  - testovací kus měl GPU s až 140 W, specifikace uvádí TGP 60–150 W plus Dynamic Boost;
  - 140 W podle Notebookchecku „téměř plně využívá potenciál“ GPU v šasi tlustém jen 18 mm;
  - CPU i9-13905H má PL2 126 W a PL1 90 W.
- Automaticky se zvedající klávesnice pomáhá chlazení. Vyšší počet jader RTX 4080 klade na chlazení větší nároky — [ASCII.jp](https://weekly.ascii.jp/elem/000/004/163/4163010/).
- Měření dlouhodobých teplot a throttlingu pod AI zátěží jsem nenašel.

#### Ceny cloudových GPU (2026, čísla se liší podle data a tarifu)
- RunPod:
  - Tracker za týden 5.–12. 10. 2026: H100 SXM 3,99 USD/h, A100 1,79 USD/h a RTX 4090 0,89 USD/h (dříve 3,49, 1,59 a 0,74) — [PricingSaaS 2026W42](https://pricingsaas.com/companies/runpod/diffs/2026W42).
  - V srpnu 2026 zdražilo 9 tarifů (B300, B200, H200 aj.) — [PricingSaaS 2026W34](https://pricingsaas.com/companies/runpod/diffs/2026W34).
  - Vlastní ceník (aktualizace 7/2026): H100 80GB od 1,99 USD/h, účtování po sekundách — [RunPod pricing](https://www.runpod.io/gpu-cloud/pricing).
  - Kolem poloviny 2026: RTX 4090 0,34 USD/h (Community Cloud), A100 80GB 1,39 USD/h, H100 2,89 USD/h. Community stojí zhruba polovinu Secure Cloud — [Hackceleration](https://www.hackceleration.com/labs/runpod-pricing).
  - RTX 4090 od 0,34 USD/h (8/2026) — [ComputePrices](https://computeprices.com/providers/runpod/gpus/rtx4090).
- Vast.ai: RTX 4090 od 0,14 USD/h (9/2026), resp. 0,27–0,36 USD/h (5/2026); H100 ~1,49 USD/h, interruptible od ~1,80 USD/h. Ceny určují jednotliví hostitelé a mění se denně, interruptible instance mohou být přerušeny — [DeployBase](https://deploybase.ai/articles/vast-ai-gpu-cloud-pricing-complete-guide-vs-hr-for-every-gpu); [CostBench](https://costbench.com/software/ai-gpu-cloud/vast-ai/); [dev.to srovnání](https://dev.to/jovan_chan_9500711396d4e6/cloud-gpu-pricing-compared-runpod-vs-vastai-vs-lambda-labs-2026-35bn).
- Lambda RTX 4090 nenabízí. H100 SXM on-demand stojí 3,99–4,29 USD za GPU-hodinu, jiný zdroj z 4/2026 uvádí od 2,49 USD/h — [DeployBase vast.ai vs Lambda](https://deploybase.ai/articles/vast-ai-vs-lambda); [dev.to srovnání](https://dev.to/jovan_chan_9500711396d4e6/cloud-gpu-pricing-compared-runpod-vs-vastai-vs-lambda-labs-2026-35bn).
- RunPod H100 80GB (3/2026): 2,39 USD/h v Secure Cloud, 1,80–2,10 USD/h v Community — [dev.to srovnání](https://dev.to/jovan_chan_9500711396d4e6/cloud-gpu-pricing-compared-runpod-vs-vastai-vs-lambda-labs-2026-35bn).

#### Ochrana dat v cloudu
- RunPod — [RunPod docs Security & Compliance](https://docs.runpod.io/references/security-and-compliance); [RunPod Compliance](https://www.runpod.io/legal/compliance); [RunPod press](https://www.runpod.io/press/runpod-achieves-hipaa-and-gdpr-compliance); [Wyse review](https://wyse.pages.dev/reviews/runpod-review); [RunPod guide](https://www.runpod.io/articles/guides/keep-data-secure-cloud-gpus):
  - má SOC 2 Type II, Trust Center uvádí i SOC 3, HIPAA a GDPR;
  - deklaruje plný soulad s GDPR pro data zpracovaná v evropských regionech, přenosy mimo EU řeší přes rozhodnutí o odpovídající ochraně, standardní smluvní doložky nebo BCR;
  - certifikace platí na úrovni platformy a compliance datacenter se liší podle regionu a poskytovatele;
  - SOC 2 Type II se podle recenze vztahuje na partnery Secure Cloud, ne na Community Cloud;
  - Secure Cloud běží v datacentrech T3/T4 na dedikovaném stroji.
- Zda RunPod trénuje na datech zákazníků, zdroje nezodpověděly. Doporučuje se vyžádat písemně — [TrustAtlas](https://trustatlas.pages.dev/vendors/runpod/procurement-pack).

#### Řeč (faster-whisper, pyannote, alternativy)
- Whisper large-v3-turbo — [GigaGPU](https://gigagpu.com/whisper-turbo-v3-self-hosted/); [Mintlify Whisper docs](https://www.mintlify.com/openai/whisper/resources/performance); [whispernotes](https://whispernotes.app/en/blog/introducing-whisper-large-v3-turbo) (vendorové zdroje, přiřazení čísel nejisté):
  - VRAM v FP16 ~1,6 GB proti ~3,1 GB u large-v3, faster-whisper v int8 ~1,5 GB;
  - na RTX 3060 Laptop 6 GB (int8) trval testovací vzorek 46,1 s sekvenčně a 18,7 s s batchováním po 10 (délka vzorku neuvedena) [RTX 3060 Laptop 6 GB];
  - turbo je ~4× (jinde ~8×) rychlejší než large-v3 za cenu ~1–2 % WER;
  - průměrné multijazyčné WER 12,5 % (large-v3) proti 14,0 % (turbo);
  - pro jazyky s menšími zdroji je lepší plný large-v3;
  - turbo neumí úlohu překladu.
- NVIDIA Parakeet-TDT-0.6B-v3 — [HF Parakeet v3](https://huggingface.co/nvidia/parakeet-tdt-0.6b-v3); [arXiv 2509.14128](https://arxiv.org/pdf/2509.14128); [Spokenly](https://spokenly.app/blog/parakeet-models); [Parakeet Ultra](https://huggingface.co/matenek/parakeet-ultra):
  - průměrné WER na FLEURS (25 evropských jazyků) 12,0 % proti 12,6 % u Whisper large-v3, ale Whisper vede ve většině jednotlivých jazyků (blog třetí strany citující Canary paper);
  - metadata HF karty uvádějí české WER 11,01 pod štítkem „AMI (Meetings test)“, což je podezřelé, protože AMI je anglický korpus;
  - komunitní fine-tune uvádí pro češtinu 10,85 → 9,97 na neuvedeném testu.
- pyannote community-1 je pod CC-BY-4.0 (sekce 5) — [HF karta](https://huggingface.co/pyannote/speaker-diarization-community-1).

### Inferences
- **Rozpočet VRAM.** Z 12 GB fyzické VRAM počítejte pro modely prakticky s ~10,5–11 GB. Odhaduji, že Windows, displej a ostatní aplikace zaberou ~0,5–1,5 GB; neměřeno.
  - Souběžně se vejde přepis řeči (Whisper turbo ~1,5 GB) + pyannote + malé LLM (Gemma 4 E4B nebo Qwen3-VL-8B ~6 GB).
  - Generování obrázků (Qwen-Image-Edit GGUF ~12 GB) vyžaduje předtím uvolnit LLM z VRAM, např. `ollama stop <model>` nebo krátký keep_alive.
- **Souběh s Revitem.** Revit potřebuje GPU pro viewport a hlavně hodně RAM (v této rešerši nekvantifikováno). MoE modely s offloadem (Gemma 4 26B-A4B, Qwen3.6-35B-A3B) drží v RAM ~15–20 GB vah, což se s Revitem v 32 GB RAM srazí.
  - Doporučení: při práci v Revitu jen malé modely celé ve VRAM.
  - Těžké úlohy (LoRA trénink, dávkové rendery, ThinkingCap-27B) spouštět, když je Revit zavřený, například přes noc.
- **WSL2** má ve výchozím stavu omezenou část RAM (obvykle 50 %; v této session neověřeno, kontrolovat `.wslconfig`). Při offloadu MoE ve WSL2 to může být úzké hrdlo. Nativní Windows build llama.cpp nebo Ollama tento limit nemá.
- **Termika.** Dlouhý trénink běží s CPU i GPU v jednom 18mm šasi. Doporučuji napájení ze sítě, výkonový profil, podložení zadní části a sledování teplot (nvidia-smi). Protože throttling není změřen, počítejte s rezervou v časových odhadech.
- **Úložiště.** Modely zabírají hodně místa (Qwen-Image-Edit plný 40,9 GB, GGUF Q4 11,9 GB, LLM GGUF po 5–20 GB). Do jediného M.2 slotu se vyplatí disk 2–4 TB (úvaha).
- **eGPU přes Thunderbolt 4** (desktopová karta s 24–32 GB VRAM) je teoretická cesta k většímu stropu. Propustnost TB4 omezí hlavně načítání modelů a offload; neměřeno, neověřeno.
- **Kdy si pronajmout cloud:**
  1. LoRA nad LLM >14B (Gemma 4 26B-A4B nebo 31B, Qwen3.6-27B nebo 35B-A3B).
  2. FLUX nebo Qwen-Image LoRA v 1024 px (lokálně ~8–10 h, v cloudu ~1 h).
  3. FLUX.2 [dev].
  4. Ladění hyperparametrů (víc běhů).
- **Modelové náklady:**
  - Gemma 4 31B QLoRA (22 GB) na A100 80 GB za 1,39–1,79 USD/h × 1–3 h ≈ 2–6 USD.
  - FLUX LoRA na RTX 4090 za 0,34–0,89 USD/h × 1–2 h ≈ 0,5–2 USD.
  - H100 za 1,99–3,99 USD/h dává smysl jen při větším objemu.
- **Ochrana trénovacích dat:**
  - RunPod Secure Cloud v EU regionu, ne Community. Na Vast.ai jsou za stroji jednotliví hostitelé, takže ne pro důvěrná data.
  - Nahrát jen kurátorovaný dataset, ne celé projektové archivy.
  - Z textů odstranit jména klientů, adresy a parcelní čísla.
  - Šifrovaný přenos a archivy; po tréninku smazat pod i síťový volume a stáhnout jen váhy LoRA.
  - Vyžádat DPA a písemné potvrzení, že poskytovatel netrénuje na datech zákazníků.
  - Pro maximální soukromí trénovat lokálně přes noc (SDXL, Z-Image, Gemma 4 E4B).

### Gaps
- Chybí měření dlouhodobého throttlingu a teplot Zenbooku Pro 16X pod AI zátěží (trénink, dávkové generování).
- Spotřebu VRAM a RAM Revitu a jeho souběh s ComfyUI nebo Ollama jsem nezkoumal (vyčerpaný limit vyhledávání).
- Ceny EU poskytovatelů GPU (Verda/DataCrunch, Scaleway, OVHcloud, Hetzner) a jejich GDPR podmínky jsem nedohledal.
- Česká WER pro Whisper large-v3-turbo a Parakeet v3 z ověřeného zdroje (FLEURS nebo Common Voice cs) chybí. VRAM a rychlost pyannote community-1 také.
- Neověřil jsem výchozí limit paměti WSL2 ani to, zda jde na tomto notebooku omezit výkon GPU (power limit).
- Pro přímé ověření primárních zdrojů je potřeba povolit domény huggingface.co a unsloth.ai v síťovém nastavení session. Zbylé dotazy lze doplnit v navazující práci, protože limit vyhledávání pro tento turn je vyčerpán.
