# TARS — tvůj lokální záznamník + AI chat

Malá webová appka, co běží **u tebe na PC**. Dole se přepínají **čtyři obrazovky**:

- **Záznam** — jedno místo, kam **nadiktuješ cokoliv** (poznámku, člověka, úkol)
  nebo přidáš soubor/fotku. TARS text sám **rozřadí do správných složek**.
- **Lidé** — kdo je kdo: přidáš člověka + info a můžeš se na něj ptát.
- **Kalendář** — měsíční mřížka; události přidáš ručně, nebo vzniknou samy
  z diktování (viz Záznam).
- **Přehled** — počty uložených věcí a **denní přehled** tvých poznámek jedním
  klepnutím. Je tu i tlačítko *Obnovit paměť*.
- **Chat** — povídání s tvojí **Ollamou** (model `qwen2.5:7b`). Paměť běží
  **automaticky** — TARS bere v potaz tvoje poznámky a ukáže, z čeho čerpal.

Otevřeš ji v prohlížeči na počítači i na mobilu (přes Tailscale) a přidáš si
ji na plochu telefonu jako appku. **Nic neodchází na cizí servery** — vše
zůstává lokálně.

---

## Co potřebuješ

- **Node.js** (máš, když ti funguje `node --version`)
- **Běžící Ollamu** s modelem `qwen2.5:7b` (to už máš postavené)

Nic se neinstaluje, žádný `npm install`. Je to jeden soubor `server.js`.

---

## Jak to spustit (na PC)

1. Otevři příkazový řádek (PowerShell / Terminál).
2. Přejdi do složky s appkou:
   ```
   cd cesta\k\webovky\tars
   ```
3. Ujisti se, že běží Ollama. V jiném okně můžeš ověřit:
   ```
   ollama run qwen2.5:7b
   ```
   (a to okno pak nech běžet, nebo Ollamu spusť jak jsi zvyklý)
4. Spusť TARS:
   ```
   node server.js
   ```
5. Uvidíš nápis „TARS běží ✦". Otevři v prohlížeči:
   **http://localhost:8787**

Dole přepínáš mezi **Zápisníkem** a **Chatem**. Napiš zprávu v Chatu →
měl by ti odpovědět tvůj model. Hotovo. 🎉

**Zastavení:** ve stejném okně stiskni `Ctrl + C`.

> 💡 **Nechceš spouštět ručně pokaždé?** Ve složce `windows/` je návod, jak
> zařídit, aby se TARS **spouštěl sám při startu Windows a běžel skrytě na
> pozadí** — stačí dvakrát kliknout na `windows/install.bat`. Viz
> [`windows/README.md`](windows/README.md).

---

## Záznam — nadiktuj cokoliv, TARS to zařadí

Na obrazovce **Záznam** je jedno velké pole. Napiš nebo **nadiktuj** cokoliv —
klidně víc věcí v jedné větě — a dej **Ulož**. Model text rozdělí a **sám
zařadí**:

- konkrétní člověk (kdo to je, vztah, kontakt) → do **Lidí**,
- událost s datem/časem (schůzka, termín) → do **Kalendáře**,
- všechno ostatní (úkol, myšlenka…) → do **poznámek**.

> Příklad: *„koupit mléko, soused František má psa Rexe a ve čtvrtek v 15:00
> schůzka s architektem"* → **koupit mléko** jako poznámka, **František** k
> Lidem a **schůzka** do Kalendáře. TARS ti napíše, co kam dal.

- **Hlasem:** na iPhonu klepni na **mikrofon na klávesnici** a mluv — text se
  napíše sám do pole. (Diktování zajišťuje systém Applu, my nic neposíláme ven.)
- **Soubor / fotka:** tlačítko **+ Soubor** → vybereš z telefonu (Fotky,
  Soubory, Vyfotit, Naskenovat dokument). Nahraje se na PC.
- **Popisek k souboru:** když **před** klepnutím na *+ Soubor* napíšeš text do
  horního pole (např. „recept na guláš"), přiloží se k souboru jako popisek a
  jde se na něj ptát. (Text se použije jako popisek a pole se uvolní.)
- **Čtení z fotek:** když nahraješ **fotku** (dokument, tabule, účtenka…),
  TARS z ní na pozadí **přečte text** a spolu s popiskem vloží do paměti — pak
  se na obsah fotky můžeš ptát v Chatu (třeba *„co musím koupit na ten recept?"*).
  Popisek i přečtený text se ukážou i pod fotkou v seznamu. (Vyžaduje stažený
  „vidoucí" model — viz níže `VISION_MODEL`.)

> ℹ️ Když si model záznamem není jistý (nebo zrovna neběží Ollama), uloží ho
> celý jako jednu poznámku — **nikdy nic neztratíš**.

Vše se uloží **lokálně na disk PC** do složky `tars/data/`:

```
tars/data/notes/     ← poznámky (.md)
tars/data/people/    ← lidé (.json)
tars/data/events/    ← události v kalendáři (.json)
tars/data/uploads/   ← nahrané soubory a fotky
tars/data/ocr/       ← text přečtený z fotek
```

> 🔒 Složka `tars/data/` je v `.gitignore`, takže se tvoje osobní data
> **nikdy nenahrají na GitHub**. Zůstávají jen na tvém počítači.

Uložené poznámky a soubory vidíš rovnou v seznamu pod polem; křížkem ✕ položku
smažeš. Nad seznamem je **vyhledávací pole** — hledá v obsahu i podle **data**
(napiš třeba `14.7`, `červenec` nebo `2026`).

Špatně zařazeno? Tlačítkem **↦** u položky ji **přeřadíš** (a TARS si to
zapamatuje — viz „Učení z oprav" níže).

---

## Lidé — kdo je kdo

Na obrazovce **Lidé** přidáš člověka (jméno + info: kdo to je, kontext, co si
pamatovat). Uloží se na disk a **rovnou i do paměti**, takže se na něj můžeš
ptát v Chatu („co vím o Františkovi?"). Křížkem ✕ člověka smažeš.

---

## Kalendář — události

Na obrazovce **Kalendář** je měsíční mřížka (šipkami ‹ › přepínáš měsíce). Dny
s událostí mají tečku, dnešek je zvýrazněný. Klepnutím na den uvidíš jeho
události a přidáš novou (čas + název → **Přidat**).

Události vznikají i **samy z diktování** v Záznamu — když řekneš „schůzka ve
čtvrtek v 15:00", TARS z toho udělá událost (relativní datum jako „čtvrtek"
převede na konkrétní den). Křížkem ✕ událost smažeš.

---

## Přehled — počty a denní souhrn

Na obrazovce **Přehled**:

- nahoře vidíš **počty** (poznámek / souborů / lidí),
- tlačítko **☀ Vytvoř denní přehled** vezme tvoje dnešní (nebo poslední)
  poznámky a model z nich udělá krátký souhrn — co je důležité a co udělat,
- tlačítko **🧠 Obnovit paměť z poznámek** *přeindexuje* vše uložené. Použij ho,
  když jsi měl poznámky uložené ještě předtím, než paměť existovala, nebo po
  prvním spuštění verze s pamětí.

---

## Paměť — ptej se nad svými poznámkami (RAG)

Paměť běží v Chatu **automaticky** — žádné přepínání. TARS odpovídá
**pouze z tvých uložených věcí** (poznámky, lidé, události, přečtené fotky) a
**nic si nevymýšlí**. Když k dotazu nic relevantního nenajde, řekne narovinu, že
to v poznámkách nemá (místo aby si domýšlel). Pod odpovědí je decentní odkaz
**„📎 Odkud to mám (N)"** — po rozkliknutí uvidíš, z čeho čerpal.

> Když ti chat říká „to nemám", i když věc uloženou máš, sniž práh
> `MEMORY_MIN_SCORE` (níže) — např. na `0.3`. Vyšší = přísnější.

Jak to funguje: každá uložená věc se převede na „otisk" (embedding) modelem
**`nomic-embed-text`**, který už máš. Vše lokálně.

> ℹ️ Do paměti jdou **poznámky, lidé, události, textové soubory a text přečtený
> z fotek**.

---

## Učení z oprav

Když TARS něco zařadí špatně, u položky (poznámka / člověk / událost) klepni na
**↦ Přeřadit** a vyber, kam to vlastně patří. Položka se přesune do správné
složky a TARS si to **zapamatuje jako příklad** — u podobných textů se pak drží
tvých oprav. Model se sice nemění, ale appka ho tvými opravami navádí. Vše
lokálně (uloženo v `data/lessons.json`).

---

## Appka na ploše telefonu (PWA)

Appku si přidáš na plochu iPhonu, ať se chová jako opravdová appka
(vlastní ikona, celá obrazovka, bez adresního řádku):

1. Otevři TARS v **Safari** na iPhonu (přes Tailscale).
2. Klepni na **Sdílet** (ikonka se šipkou) → **Přidat na plochu**.
3. Potvrď. Na ploše se objeví ikona **TARS** (zlatý monolit).

Od teď stačí klepnout na ikonu a máš svůj záznamník po ruce jako appku.

---

## Jak se připojit z mobilu (Tailscale)

Tvoje PC má přes Tailscale adresu (uváděl jsi `100.120.51.2`).
Na mobilu (připojeném do Tailscale) otevři v prohlížeči:

```
http://100.120.51.2:8787
```

Appka je dělaná hlavně pro telefon. Později z ní uděláme PWA
(„Přidat na plochu"), aby vypadala jako opravdová appka — to je Krok 4.

---

## Nastavení (nepovinné)

Když budeš chtít něco změnit, spusť server s proměnnou navíc:

| Proměnná       | K čemu je                       | Výchozí                  |
| -------------- | ------------------------------- | ------------------------ |
| `PORT`         | port serveru                    | `8787`                   |
| `OLLAMA_URL`   | kde běží Ollama                 | `http://localhost:11434` |
| `OLLAMA_MODEL` | který model použít (chat)       | `qwen2.5:7b`             |
| `EMBED_MODEL`  | model pro paměť (embeddingy)    | `nomic-embed-text`       |
| `VISION_MODEL` | model pro čtení textu z fotek   | `llava`                  |
| `MEMORY_MIN_SCORE` | práh, kdy chat použije poznámku (0–1) | `0.3`             |

Tyhle věci jde nastavit i bez proměnných — v souboru **`tars/config.json`**
(např. `{"VISION_MODEL": "qwen2.5vl:3b"}`). Po změně restartuj server.

> Čtení fotek potřebuje „vidoucí" model. Doporučený (dobrý na český text,
> sedne do 6 GB): `ollama pull qwen2.5vl:3b`. Který model se použije, je v
> souboru **`tars/config.json`** (klíč `VISION_MODEL`) — stačí přepsat a
> restartovat. Alternativy: `minicpm-v` (nejlepší čtení, ~5,5 GB), `llava`
> (základní, na češtinu slabší).

Příklady:

```
# jiný port
PORT=9000 node server.js

# jiný model
OLLAMA_MODEL=llama3.1:8b node server.js
```

Na Windows v PowerShellu se proměnná nastavuje takhle:

```
$env:OLLAMA_MODEL="llama3.1:8b"; node server.js
```

Osobnost TARS (jak odpovídá) se dá upravit v `server.js` — hledej
`SYSTEM_PROMPT`.

---

## Když něco nefunguje

- **„server neběží" v appce** → nespustil se `node server.js`, nebo běží na
  jiném portu.
- **„Nepodařilo se spojit s Ollamou"** → neběží Ollama. Spusť ji
  (`ollama serve` nebo `ollama run qwen2.5:7b`).
- **„Ollama odpověděla chybou… model qwen2.5:7b"** → model není stažený.
  Stáhni ho: `ollama pull qwen2.5:7b`.
- **Z mobilu se nepřipojím** → zkontroluj, že je mobil i PC v Tailscale a že
  používáš správnou adresu PC a port `:8787`.

---

## Jak je to postavené (pro zvědavost)

```
mobil / prohlížeč  ──►  server.js (na tvém PC)  ──►  Ollama (na tvém PC)
   (jen zobrazení)         (tunel /api/chat)          (model qwen2.5:7b)
```

Prohlížeč nikdy nemluví s Ollamou přímo — jen s `server.js`, a ten teprve
s Ollamou. Díky tomu data neopouští počítač a nejsou problémy s CORS.

Soubory:

- `server.js` — server + tunel do Ollamy
- `public/index.html` — kostra stránky
- `public/styles.css` — vzhled
- `public/app.js` — logika chatu v prohlížeči

---

## Co bude dál

- **Lokální Whisper** — nahrávání hlasu přímo v appce (delší nahrávky)
- **Čtení z PDF** do paměti (fotky už umíme)
