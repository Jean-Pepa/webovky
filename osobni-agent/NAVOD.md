# Osobní AI agent na tvém notebooku: návod krok po kroku

Na konci budeš mít asistenta, který běží u tebe na notebooku a:

- hlídá maily, třídí je a navrhuje odpovědi jako koncepty (nic sám neodešle),
- vede si deník a dlouhodobou paměť o tobě v obyčejných souborech, které vidíš a opravuješ v Obsidianu,
- hledá v tvých poznámkách a myšlenkách podle významu,
- plánuje: ranní přehled, týdenní plán, připomínky,
- připraví košík na Rohlíku (objednávku potvrzuješ ty),
- na dotazy z internetu se zeptá Clauda, ale ven pošle jen obecnou otázku, kterou předtím schválíš,
- přepíše tvoje hlasové poznámky (česky, lokálně).

Celé to zabere zhruba jeden víkend: 4–6 hodin práce a k tomu stahování.
Nic v návodu nemaže tvoje data. Jediné mazání je dobrovolný úklid v kroku 1.

> **Pozor na verze.** Skripty v tomhle balíčku jsou otestované. Názvy modelů a přesné
> příkazy OpenClaw se ale mění rychle, proto je u nich vždy odkaz, kde si je ověřit.

---

## Sestava v kostce (a proč právě tahle)

Tvůj notebook: ASUS Zenbook Pro 16X (UX7602BZ), Intel i9-13905H, **RTX 4080 s 12 GB**, **32 GB RAM** (nejde rozšířit).

| Část | Co použijeme | Proč |
|---|---|---|
| Mozek (jazykový model) | **Ollama + Gemma 4 26B-A4B** (4bitová verze, ~16 GB) | Nejlepší poměr chytrosti a rychlosti pro 12 GB grafiky. Je to model typu MoE, většina se vejde na grafiku a zbytek do RAM. Dobře zvládá češtinu. |
| Agent | **OpenClaw** ve WSL2 (Linux uvnitř Windows) | Paměť v souborech, pravidelné kontroly (heartbeat), dovednosti, napojení na Rohlík (MCP) |
| Paměť a myšlenky | **Obsidian**, složka `Mozek` | Vidíš a opravíš, co si agent pamatuje |
| Hledání v paměti | lokální model `embeddinggemma` | Hledání podle významu, nic neodchází ven |
| Maily | `agent-mail` (z balíčku) | Jen čtení a koncepty přes IMAP |
| Internet | `agent-resers` (z balíčku) | Claude přes API, filtr osobních údajů, tvoje schválení, záznam všeho odeslaného |
| Nákupy | oficiální MCP server Rohlíku | Agent plní košík, objednáváš ty |
| Diktát | `agent-prepis` (faster-whisper) | Lokální přepis češtiny |

```
 WINDOWS                              WSL2 (Ubuntu)
 +-----------------------------+      +----------------------------------+
 | Ollama + Gemma 4 (RTX 4080) | <--> | OpenClaw (agent, heartbeat)      |
 |   http://127.0.0.1:11434    |      |   workspace = /mnt/c/.../Mozek   |
 | Obsidian: C:\Users\...\Mozek| <--> | agent-mail, agent-resers, ...    |
 +-----------------------------+      +----------------+-----------------+
                                                       |
                              jen tyhle tři cesty ven  v
              e-mail (IMAP)  ·  Rohlík (MCP)  ·  Claude API (po tvém schválení)
```

Co balíček obsahuje:

| Složka | Obsah |
|---|---|
| `windows/` | `kontrola-pc.ps1` (kontrola disku a výkonu, nic nemaže) a `wslconfig.txt` |
| `wsl/` | `instaluj-nastroje.sh` (instalace skriptů ve WSL) |
| `nastroje/` | `mail.py`, `resers.py`, `prepis.py` a testy |
| `workspace/` | šablony paměti a pravidel (`USER.md`, `SOUL.md`, `AGENTS.md`, `HEARTBEAT.md`, `MEMORY.md`, `ukoly.md`, `nakupy.md`, `lide/`) a 7 dovedností v `skills/` |

---

## Krok 0: Záloha a kontrola (15 minut)

1. **Zálohuj, na čem ti záleží** (projekty, fotky) na externí disk. Úklid v kroku 1 je bezpečný, ale záloha se vyplatí vždycky.
2. **Stáhni balíček.** Na GitHubu otevři repozitář `jean-pepa/webovky`, přepni větev na
   `claude/busy-gauss-t83y4w`, klikni na **Code → Download ZIP** a rozbal ho. Složku
   `osobni-agent` zkopíruj do `C:\Users\<tvé jméno>\osobni-agent`.
3. **Spusť kontrolu.** Otevři PowerShell (Start → napiš „PowerShell") a zadej:
   ```powershell
   cd $env:USERPROFILE\osobni-agent\windows
   powershell -ExecutionPolicy Bypass -File .\kontrola-pc.ps1
   ```
   Skript jen čte. Vypíše volné místo, největší složky a programy, ovladač grafiky a stav WSL.
   Výsledek uloží na Plochu do `kontrola-pc.txt`.

---

## Krok 1: Úklid disku (musíš něco mazat?)

**Přeinstalovat Windows nemusíš.** Mazat musíš jen tehdy, když je na disku C: málo místa.

| Co zabere místo | Kolik |
|---|---|
| Hlavní model (Gemma 4 26B, 4bitově) | ~16–17 GB |
| Embedding model a případně další menší model | 1–10 GB |
| WSL2 + Ubuntu + OpenClaw + Python prostředí | ~8 GB |
| Whisper pro diktát (model a knihovny) | ~3 GB |
| Rezerva (aktualizace, odkládací soubor, další modely) | 30+ GB |

**Cíl: aspoň 100 GB volna na C:, ideálně 150 GB.** SSD má mít volných aspoň 15–20 %,
jinak zpomaluje a rychleji stárne.

Když místo chybí, postupuj od nejbezpečnějšího:

1. **Dočasné soubory:** Nastavení → Systém → Úložiště → Dočasné soubory. Zaškrtni vyčištění
   Windows Update, Koš, Dočasné soubory a Miniatury. Složku **Stažené soubory tady nezaškrtávej**,
   tu projdi ručně.
2. Ve stejném místě zapni **Inteligentní úložiště** (Storage Sense).
3. **Stažené soubory:** smaž staré instalačky (`.exe`, `.msi`, `.zip`) a dokumenty, které máš jinde.
4. **Velké programy** (seznam máš v `kontrola-pc.txt`): v Nastavení → Aplikace → Nainstalované
   aplikace odinstaluj, co nepoužíváš. U architekta to bývají hlavně **starší verze Revitu,
   Archicadu nebo AutoCADu** (každá 10–30 GB), knihovny Twinmotionu nebo Lumionu, hry a zkušební
   antiviry předinstalované z výroby. Aktuální verze, se kterými pracuješ, nech.
5. **Fotky, videa a uzavřené projekty** přesuň na externí disk.
6. **Mezipaměti** renderů a Adobe (Media Cache) vyčisti v nastavení daného programu.
7. Největší složky rychle najde zdarma **WizTree**. Používej ho jen k hledání. Do `C:\Windows`
   a `C:\Program Files` nesahej jinak než odinstalací.

**Čistou instalaci Windows** (Nastavení → Systém → Obnovení → Obnovit tento počítač) zvaž jen
tehdy, když je notebook pomalý nebo nestabilní. Předtím zálohuj a ověř si licence Revitu
a Archicadu.

### Kdy koupit SSD

**Koupi SSD potřebuješ jen tehdy, když ani po úklidu nemáš na C: aspoň 150 GB volna.**
Rychlost disku ovlivňuje jen to, jak rychle se model načte (pár sekund). Rychlost
odpovídání určuje grafika a RAM, ne disk.

- **Externí NVMe SSD v rámečku Thunderbolt 4 / USB4** (doporučeno). Notebook má porty
  Thunderbolt 4, takže disk jede rychlostí až kolem 3–3,8 GB/s. Používej ho pro modely
  a zálohy Mozku.
  - Modely na něj přesuneš tak, že ukončíš Ollamu a spustíš
    `setx OLLAMA_MODELS "E:\ollama-models"` (písmeno disku si v Správě disků nastav napevno).
    Pak přesuneš obsah `C:\Users\<jméno>\.ollama\models` a Ollamu spustíš znovu.
  - Zálohy na něm měj šifrované. Na Windows Pro použij BitLocker To Go, na Windows Home třeba
    VeraCrypt.
- **Výměna vnitřního SSD za větší** (2–4 TB, M.2 2280 PCIe 4.0). Notebook má jen **jeden** slot
  M.2, takže jde jen o výměnu s naklonováním disku. Před klonováním pozastav BitLocker.
  Vyplatí se, když ti místo chybí i na práci, ne kvůli agentovi.
- **Na interním disku nech vždycky** `Mozek`, WSL a odkládací soubor Windows. Agent je potřebuje
  pořád a externí disk se dá ztratit.

---

## Krok 2: Aktualizace a nastavení výkonu (30–45 minut)

1. **Windows Update:** nainstaluj všechno a restartuj.
2. **Ovladač grafiky:** stáhni **NVIDIA App** z nvidia.com a nainstaluj ovladač **Studio**
   (stabilnější pro práci, pro AI stačí). Po instalaci v PowerShellu:
   ```powershell
   nvidia-smi
   ```
   Musí ukázat RTX 4080 Laptop GPU a zhruba 12 GB paměti.
3. **MyASUS → Aktualizace systému:** nainstaluj BIOS a ovladače ASUS. Pak v **MyASUS →
   Nastavení zařízení**:
   - **Profil ventilátoru:** Výkon (Performance), když jsi v zásuvce.
   - **Nabíjení pro zdraví baterie:** Vyvážený režim (80 %). Notebook bude často v zásuvce
     a baterie tak vydrží déle.
   - **Režim grafiky (MUX):** nech výchozí. AI výpočty grafika dělá i tak a v klidu se uspí.
4. **Napájení Windows:** Nastavení → Systém → Napájení a baterie → **Režim napájení: Nejlepší výkon**.
   Když má agent hlídat i v noci:
   - **Spánek při napájení ze sítě: Nikdy**,
   - Ovládací panely → Možnosti napájení → Nastavit chování tlačítek napájení →
     **Při zavření víka (v zásuvce): Nedělat nic**.
   Při noční práci nech víko otevřené nebo notebook postav na stojan, ať se dobře chladí.
5. **Programy po spuštění:** Nastavení → Aplikace → Po spuštění. Vypni, co nepotřebuješ.
6. **Grafika:** Nastavení → Systém → Obrazovka → Grafika → **Plánování GPU s hardwarovou
   akcelerací: zapnuto** (bývá výchozí).
7. **Šifrování disku:** Nastavení → Ochrana osobních údajů a zabezpečení → Šifrování zařízení
   (nebo BitLocker): **zapnuto**. Agent bude znát celý tvůj život, takže tohle je povinné.
   Klíč pro obnovení měj uložený v účtu Microsoft.

---

## Krok 3: WSL2 a Ubuntu (20 minut)

1. PowerShell spusť **jako správce** a zadej:
   ```powershell
   wsl --update
   wsl --install
   ```
   Restartuj. Po startu se otevře Ubuntu: zvol uživatelské jméno (malá písmena, bez diakritiky)
   a heslo.
2. Nastav WSL tak, aby vidělo Ollamu ve Windows a nebralo zbytečně paměť (v běžném PowerShellu):
   ```powershell
   Copy-Item $env:USERPROFILE\osobni-agent\windows\wslconfig.txt $env:USERPROFILE\.wslconfig
   wsl --shutdown
   ```
3. Otevři **Ubuntu** (Start → Ubuntu) a nainstaluj základ:
   ```bash
   sudo apt update && sudo apt upgrade -y
   sudo apt install -y python3-venv python3-pip git curl
   ```

---

## Krok 4: Ollama a model (30–60 minut, většinou stahování)

1. Stáhni **Ollama pro Windows** z ollama.com a nainstaluj.
2. **Nastav výkon** (v PowerShellu, jednou):
   ```powershell
   setx OLLAMA_FLASH_ATTENTION 1
   setx OLLAMA_KV_CACHE_TYPE q8_0
   setx OLLAMA_CONTEXT_LENGTH 32768
   setx OLLAMA_KEEP_ALIVE 30m
   setx OLLAMA_MAX_LOADED_MODELS 1
   ```
   Pak Ollamu ukonči (ikona u hodin → Quit) a spusť znovu.

   | Nastavení | Co dělá |
   |---|---|
   | `FLASH_ATTENTION` | rychlejší výpočet a méně paměti |
   | `KV_CACHE_TYPE q8_0` | pracovní paměť modelu zabere polovinu místa, víc se vejde na grafiku |
   | `CONTEXT_LENGTH 32768` | kolik textu model „drží v hlavě" najednou (dlouhodobá paměť je v souborech) |
   | `KEEP_ALIVE 30m` | model zůstane načtený a odpovídá hned, po 30 minutách klidu uvolní grafiku třeba pro Revit |
   | `MAX_LOADED_MODELS 1` | dva velké modely se do 12 GB nevejdou |

3. **Stáhni modely.** Na stránce `ollama.com/library/gemma4` vyber variantu **26B (A4B)** se
   štítkem **tools** a zkopíruj její příkaz `ollama pull …`. Když ji tam nenajdeš, použij verzi
   z Hugging Face (název ověř na huggingface.co):
   ```powershell
   ollama pull hf.co/unsloth/gemma-4-26B-A4B-it-GGUF:UD-Q4_K_M
   ```
   Model pro hledání v paměti:
   ```powershell
   ollama pull embeddinggemma
   ```
4. **Změř rychlost:**
   ```powershell
   ollama run <název modelu> --verbose
   ```
   Zeptej se česky, třeba „Vysvětli třemi větami, proč dělat zálohy". Na konci uvidíš
   `eval rate`, tedy tokeny za sekundu. **Cíl je aspoň 12–15 tokenů/s**, orientačně čekej
   15–30. Příkaz `ollama ps` ukáže, kolik modelu je na grafice a kolik v RAM.
   Když je to pomalé, viz krok 13.

---

## Krok 5: Složka Mozek a Obsidian (15 minut)

1. Vytvoř složku `C:\Users\<tvé jméno>\Mozek`.
2. Zkopíruj do ní **obsah** složky `osobni-agent\workspace`, tedy `USER.md`, `SOUL.md`,
   `AGENTS.md`, `HEARTBEAT.md`, `MEMORY.md`, `ukoly.md`, `nakupy.md` a složky `lide` a `skills`.
   Vytvoř v ní ještě prázdné složky `memory` (deník), `koncepty` a `prichozi`.
3. Nainstaluj **Obsidian** (obsidian.md) → „Otevřít složku jako trezor" → `Mozek`.
4. Volitelně přidej plugin **Smart Connections**, ať můžeš i ty hledat v poznámkách podle
   významu. V jeho nastavení zvol lokální model, ne cloud.

---

## Krok 6: OpenClaw (30 minut)

1. V Ubuntu nainstaluj OpenClaw **podle oficiálního návodu** na docs.openclaw.ai (Install → Linux
   a WSL2). Použij jen tenhle zdroj: existují podvodné kopie s podobnými názvy. NVIDIA má k tomu
   i průvodce pro notebooky s RTX: build.nvidia.com/rtx/openclaw.
2. Spusť průvodce nastavením:
   ```bash
   openclaw onboard
   ```
   - **Poskytovatel modelu:** Ollama, adresa `http://127.0.0.1:11434` (díky nastavení z kroku 3
     WSL vidí Ollamu ve Windows), model z kroku 4.
   - **Workspace:** `/mnt/c/Users/<tvé jméno>/Mozek`
   - **Kanály** (Telegram, WhatsApp): zatím přeskoč.
   - **Brána (gateway):** jen localhost (loopback), s tokenem. Nikdy ji neotvírej do internetu.
   - **Dovednosti z ClawHubu:** žádné neinstaluj. Našlo se v nich stovky škodlivých doplňků.
3. Ověř, že běží:
   ```bash
   openclaw gateway status
   ```
   Ovládací panel otevřeš v prohlížeči ve Windows na `http://localhost:18789`.
4. **Hledání v paměti nastav jen lokálně.** Když to nenastavíš, může OpenClaw pro hledání
   v paměti použít cloudovou službu OpenAI. V `~/.openclaw/openclaw.json` nastav poskytovatele
   na lokální Ollamu, podle docs.openclaw.ai/reference/memory-config. Tvar podle současné
   dokumentace (názvy klíčů si ověř):
   ```json
   "agents": { "defaults": { "memorySearch": { "provider": "ollama", "model": "embeddinggemma" } } }
   ```
   Kontrola, ve výpisu musí být lokální poskytovatel, ne OpenAI:
   ```bash
   openclaw memory status --deep
   ```
5. **Heartbeat** (pravidelná kontrola) zapni s intervalem **30 minut**, viz dokumentace
   OpenClaw → Heartbeat. Agent při něm prochází `HEARTBEAT.md`.

> Když agent nepozná změny, které uděláš v Obsidianu, nech ho znovu načíst paměť
> (`openclaw memory --help`).

---

## Krok 7: První test

V ovládacím panelu napiš:

1. „Přečti si AGENTS.md, SOUL.md a USER.md a shrň mi pravidla, podle kterých pracuješ."
   Musí vyjmenovat, co smí sám, co jen s tvým „ano" a co nikdy.
2. „Zapiš si do deníku, že jsme dnes agenta rozjeli."
   V Obsidianu se objeví soubor `memory/RRRR-MM-DD.md`.

---

## Krok 8: Maily a internet (45 minut)

1. **Nainstaluj nástroje** (v Ubuntu):
   ```bash
   cp -r /mnt/c/Users/<tvé jméno>/osobni-agent ~/osobni-agent
   bash ~/osobni-agent/wsl/instaluj-nastroje.sh --whisper
   ```
   Bez `--whisper` se nenainstaluje diktování. Pak zavři a znovu otevři Ubuntu.
   Když uvidíš chybu s `$'\r'`, spusť `sudo apt install -y dos2unix && dos2unix ~/osobni-agent/wsl/*.sh`.

2. **E-mail** (heslo pro aplikace, ne tvoje hlavní heslo):
   - **Gmail:** zapni dvoufázové ověření, vytvoř **heslo aplikace** (účet Google → Zabezpečení
     → Hesla aplikací) a nastav `IMAP_HOST=imap.gmail.com`.
   - **Seznam:** `IMAP_HOST=imap.seznam.cz`. Pokud máš dvoufázové ověření, vytvoř si v nastavení
     účtu heslo pro aplikaci.
   - **Outlook nebo Hotmail** přihlášení heslem přes IMAP nepovoluje, tenhle skript s nimi zatím
     nefunguje.

   Vyplň údaje a vyzkoušej:
   ```bash
   nano ~/.config/agent/mail.env
   agent-mail nove --dni 1
   ```
   Skript maily jen čte. Nechává je nepřečtené, nic nemaže a nic neodesílá.

3. **Claude pro rešerše:**
   - Na **platform.claude.com** si založ účet, dobij kredit (10 USD vystačí na desítky
     rešerší) a **nastav limit útraty**.
   - Vytvoř klíč (API Keys) a vlož ho do `~/.config/agent/anthropic.env`.
     Předplatné Claude Pro na tohle nestačí, API se platí zvlášť.
   - Do `~/.config/agent/citliva-slova.txt` napiš kmeny slov, která nikdy nesmí odejít:
     příjmení, ulici, firmu, jména blízkých.

   Vyzkoušej:
   ```bash
   agent-resers priprav "aktuální cena elektřiny pro domácnost v ČR"
   agent-resers odeslat <ID z předchozího výstupu>
   agent-resers log
   ```

   Jak rešerše funguje:
   - Skript dotaz nejdřív vyčistí: skryje e-maily, telefony, rodná čísla, čísla účtů, IBAN,
     čísla karet a tvoje citlivá slova.
   - Agent ti dotaz ukáže a odešle ho až po tvém „ano".
   - Výchozí model je **Claude Opus 5.5**, vyjde řádově na jednotky korun za rešerši.
   - Když Claude dotaz odmítne zpracovat, API ho automaticky zkusí na jiném doporučeném modelu.
     Skript to má zapnuté (volba `fallbacks`).
   - Levnější model si zvolíš tak, že do `~/.local/bin/agent-resers` přidáš na druhý řádek
     `export AGENT_CLOUD_MODEL=claude-sonnet-5-5`.

---

## Krok 9: Diktát (volitelné, 10 minut)

Když jsi instaloval s `--whisper`, vyzkoušej přepis nahrávky:

```bash
agent-prepis /mnt/c/Users/<tvé jméno>/Mozek/prichozi/test.m4a
```

Při prvním spuštění se jednou stáhne model, asi 1,6 GB. Pak už běží bez internetu.
Přepis jede na procesoru, aby nebral grafiku jazykovému modelu. U dlouhých nahrávek můžeš
přidat `--gpu`.

Nahrávky z iPhonu dostaneš do `Mozek\prichozi` třeba přes iCloud pro Windows nebo e-mailem.

---

## Krok 10: Rohlík (15 minut)

Připoj oficiální MCP server Rohlíku (přihlášení probíhá přes jejich stránku, heslo agent nevidí):

```bash
openclaw mcp set rohlik '{"url":"https://mcp.rohlik.cz/mcp","auth":"oauth"}'
openclaw mcp login rohlik
openclaw mcp doctor rohlik --probe
```

Když se příkazy ve tvé verzi liší, podívej se do `openclaw mcp --help` a na docs.openclaw.ai/cli/mcp.

Pak vyplň `nakupy.md` (pravidelné položky, oblíbené značky, doručovací okno) a vyzkoušej:
„Najdi na Rohlíku polotučné mléko a dej 2 kusy do košíku."
Na rohlik.cz zkontroluj košík. Objednávku a platbu potvrzuješ vždycky ty, agent to neumí ani nesmí.

---

## Krok 11: Rozhovor „kdo jsem" (1 hodina, nejdůležitější krok)

Agent tě pozná tak, že mu o sobě povíš. Napiš mu (nebo nadiktuj):

> Udělej se mnou úvodní rozhovor, abys mě poznal. Ptej se postupně, vždycky na jednu nebo dvě
> věci: práce a projekty, blízcí lidé (jen co sám řeknu), domácnost a nákupy, jak se
> rozhoduju, co mě štve a jaké mám cíle. Po každém tématu navrhni, co zapíšeš do USER.md,
> MEMORY.md nebo lide/, a zapiš to až po mém souhlasu.

Pak:

- **Každý týden** se ho zeptej „co je nového, co bys měl vědět".
- **Každý týden** si na 10 minut přečti `MEMORY.md` v Obsidianu a oprav nesmysly.
- Když udělá chybu, řekni mu to a nech ho opravu zapsat. Tak se z něj během týdnů stává
  opravdu tvůj asistent.

---

## Krok 12: Mobil (volitelné)

- **Telegram:** v `openclaw onboard` přidej kanál Telegram (bota založíš přes @BotFather) a povol
  jen svůj účet.
  - Zprávy s agentem jdou přes servery Telegramu. Paměť, maily a soubory zůstávají doma.
  - Když chceš, aby z domu neodcházelo nic, používej agenta jen z notebooku.
- Upozornění z heartbeatu pak chodí do mobilu.

---

## Krok 13: Výkon na maximum (až všechno běží)

1. **Měř:** `ollama run <model> --verbose` → `eval rate`, `ollama ps` → rozdělení mezi grafiku a RAM.
2. **Kontext:** když je model pomalý nebo nevejde, sniž `OLLAMA_CONTEXT_LENGTH` na `16384`.
   Když potřebuješ delší rozhovory a rychlost stačí, zkus `65536`.
3. **Grafika je jen jedna:** při práci v Revitu, Twinmotionu nebo Enscape si model s nimi
   konkuruje. Ollama sama uvolní grafiku po 30 minutách klidu. Hned ji uvolníš tak, že Ollamu
   ukončíš ikonou u hodin.
4. **Turbo pro modely MoE:** Ollama dělí model mezi grafiku a RAM po celých vrstvách.
   **LM Studio** (volba „Force Model Expert Weights onto CPU") nebo **llama.cpp** (`--n-cpu-moe`)
   umí nechat na grafice důležité části a do RAM poslat jen „experty". U modelů MoE na 12 GB
   kartě bývá znatelně rychlejší. OpenClaw pak napojíš na adresu LM Studia
   `http://127.0.0.1:1234/v1`. Dělej to, až když ti rychlost Ollamy nestačí.
5. **Jiné modely:**
   - **Qwen3.6-35B-A3B** (~21 GB) je v některých úlohách chytřejší, ale pomalejší.
   - **ThinkingCap-Qwen3.6-27B** od české BottleCap AI (Hugging Face `bottlecapai`, licence
     Apache 2.0) přemýšlí zhruba o polovinu kratčeji než původní Qwen. Je to ale „hustý" model
     27B, takže ve 4bitové verzi (~16–17 GB) se do 12 GB grafiky nevejde celý a poběží
     pomaleji než Gemma 4 MoE.
     - Hodí se jako druhý model na noční a týdenní úlohy, kde na rychlosti nezáleží.
     - Stáhneš ho na huggingface.co/bottlecapai/ThinkingCap-Qwen3.6-27B-GGUF, kde nejdřív
       musíš přijmout podmínky.
     - Verze NVFP4 je jen pro grafiky řady RTX 50, pro tvou RTX 4080 ne.
   - Menší model kolem 8 miliard parametrů je rychlý na třídění mailů.
   - Vždy vybírej variantu se štítkem **tools**, jinak agent neumí používat nástroje.

---

## Krok 14: Bezpečnost a údržba

**Pravidelně:**

- **Týdně:** přečti `MEMORY.md`, projdi `agent-resers log` (co odešlo ven) a zálohuj složku
  `Mozek` na externí disk.
- **Měsíčně:** aktualizuj OpenClaw podle oficiálního návodu. Windows, ovladač NVIDIA a Ollama se
  aktualizují samy nebo přes své aplikace.

**Nikdy:**

- Nedávej do `Mozku` hesla, čísla karet ani rodné číslo.
- Neotvírej bránu OpenClaw do internetu a neinstaluj cizí dovednosti.
- Nesynchronizuj `Mozek` do cloudu bez šifrování. Celá jeho výhoda je, že je jen u tebe.

**Když se agent chová divně:** zastav bránu (`openclaw gateway --help`), podívej se do deníku,
co dělal, a oprav pravidla v `AGENTS.md`.

**Bezpečnostní pojistky v balíčku:**

| Pojistka | Kde |
|---|---|
| Maily jen čte a koncepty ukládá, neodesílá | `nastroje/mail.py` |
| Rešerše: filtr osobních údajů, schválení, kontrola před odesláním, záznam všeho odeslaného | `nastroje/resers.py` |
| Obsah mailů a webu jsou jen data, žádné pokyny | `AGENTS.md` |
| Tabulka „sám / jen po ‚ano' / nikdy" | `AGENTS.md` |
| Rohlík: objednávku potvrzuješ ty na webu | `skills/nakup-rohlik` a podmínky Rohlíku |

---

## Kontrolní seznam: hotovo, když…

- [ ] `nvidia-smi` ukazuje RTX 4080 a 12 GB
- [ ] `ollama run … --verbose` dává aspoň 12 tokenů/s
- [ ] `openclaw gateway status` běží jen na localhostu
- [ ] `openclaw memory status --deep` ukazuje lokální embeddingy
- [ ] `agent-mail nove` vrací tvoje maily
- [ ] `agent-resers` ti před odesláním ukáže dotaz a vrátí odpověď se zdroji
- [ ] košík na Rohlíku se naplnil a objednávku jsi potvrdil sám
- [ ] přišel první ranní přehled
- [ ] šifrování disku je zapnuté a `Mozek` máš zálohovaný

---

## Co je ověřené a co si ověř sám

- **Otestováno:**
  - Skripty `mail.py` a `resers.py` prošly 21 automatickými testy (falešný poštovní server,
    filtr osobních údajů, schvalování).
  - Volání Clauda prošlo zkušebně proti testovacímu serveru s oficiální knihovnou Anthropic.
  - Instalační skript proběhl na čistém Linuxu jako běžný uživatel.
  - `kontrola-pc.ps1` je syntakticky zkontrolovaný.
- **Netestováno naživo:** skutečná schránka Gmail nebo Seznam a skutečné volání API (záleží na
  tvých účtech).
- **Ověř v aktuální dokumentaci:** přesné názvy modelů v knihovně Ollamy, klíče v konfiguraci
  OpenClaw (hledání v paměti, heartbeat) a příkazy `openclaw mcp`. Tyhle věci se mění každých pár
  týdnů.

Testy si můžeš pustit sám (v Ubuntu, po instalaci):

```bash
cd ~/osobni-agent/nastroje && ~/.venv-agent/bin/python -m unittest discover -s tests -v
```
