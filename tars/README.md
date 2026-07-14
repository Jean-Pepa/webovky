# TARS — tvůj lokální záznamník + AI chat

Malá webová appka, co běží **u tebe na PC**. Má dvě obrazovky:

- **Zápisník** — z telefonu rychle zapíšeš poznámku (i hlasem) nebo pošleš
  soubor/fotku a vše se uloží na disk tvého PC.
- **Chat** — povídání s tvojí **Ollamou** (model `qwen2.5:7b`), s možností
  **odpovídat z tvých poznámek** (paměť/RAG).

Otevřeš ji v prohlížeči na počítači i na mobilu (přes Tailscale) a přidáš si
ji na plochu telefonu jako appku. **Nic neodchází na cizí servery** — vše
zůstává lokálně.

Hotovo: chat, zápisník (ukládání na disk), paměť nad poznámkami (RAG) a PWA
(appka na ploše). Dál přijdou přehledy/briefing a nahrávání hlasem.

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

## Zápisník — poznámky a soubory z telefonu

Na obrazovce **Zápisník**:

- **Poznámka:** napiš text a dej *Uložit poznámku*.
- **Hlasem:** na iPhonu klepni na **mikrofon na klávesnici** a mluv — text se
  napíše sám do pole. (Diktování zajišťuje systém Applu, my nic neposíláme ven.)
- **Soubor / fotka:** tlačítko **+ Soubor** → vybereš z telefonu (Fotky,
  Soubory, Vyfotit, Naskenovat dokument). Nahraje se na PC.

Vše se uloží **lokálně na disk PC** do složky `tars/data/`:

```
tars/data/notes/     ← textové poznámky (.md)
tars/data/uploads/   ← nahrané soubory a fotky
```

> 🔒 Složka `tars/data/` je v `.gitignore`, takže se tvoje osobní poznámky a
> soubory **nikdy nenahrají na GitHub**. Zůstávají jen na tvém počítači.

Uložené věci vidíš rovnou v seznamu (nejnovější nahoře), soubor si otevřeš
klepnutím, křížkem ✕ položku smažeš.

---

## Paměť — ptej se nad svými poznámkami (RAG)

Na obrazovce **Chat** je nahoře přepínač **🧠 Odpovídat z mých poznámek**.

- **Vypnutý** = normální povídání s modelem.
- **Zapnutý** = TARS odpoví **jen na základě tvých uložených poznámek a
  textových souborů** a pod odpovědí ukáže, z čeho čerpal („Z poznámek:").

Jak to funguje: každá uložená poznámka se převede na „otisk" (embedding)
modelem **`nomic-embed-text`**, který už máš. Když se zeptáš, TARS najde
nejpodobnější kousky a předá je modelu jako podklad. Vše lokálně.

**Tlačítko ↻ (vpravo nahoře v chatu)** = *přeindexovat paměť*. Použij ho:

- když jsi měl uložené poznámky **ještě předtím**, než paměť existovala,
- nebo když jsi poprvé spustil verzi s pamětí.

> ℹ️ Do paměti jdou zatím **poznámky a textové soubory** (`.txt`, `.md`, `.csv`,
> `.log`, `.json`). Obrázky a PDF se zatím jen ukládají (čtení z nich přidáme
> později).

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

- **Denní briefing / přehledy** — souhrn toho, co sis zapsal
- **Lokální Whisper** — nahrávání hlasu přímo v appce (delší nahrávky)
- **Čtení z PDF a obrázků** do paměti (OCR)
- **Kalendář**
