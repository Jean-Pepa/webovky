# TARS na Windows — spouštět sám na pozadí

Tahle složka zařídí, aby se TARS **spouštěl automaticky při startu Windows**,
běžel **skrytě na pozadí** (žádné černé okno) a byl pořád připravený —
z počítače i z mobilu přes Tailscale.

Nic se nestahuje, vše používá vestavěný **Plánovač úloh** Windows.

---

## Než to zapneš — 3 věci musí být hotové

1. **Node.js nainstalovaný.** Ověř: otevři příkazový řádek a napiš
   `node --version`. Když vypíše číslo, je to OK.
2. **Ollama nainstalovaná** (a spouští se sama s Windows — má ikonku
   v liště u hodin). To už máš.
3. **Tailscale** zapnutý na PC i na telefonu (kvůli přístupu z mobilu).

---

## Zapnutí automatického startu (2 kliknutí)

1. Otevři složku `tars\windows\`.
2. Dvakrát klikni na **`install.bat`**.
3. Otevře se na chvíli okno, napíše „Hotovo" a TARS rovnou nastartuje.

A je to. Od teď se TARS spustí sám pokaždé, když se přihlásíš do Windows.

**Vyzkoušej hned:** v prohlížeči otevři <http://localhost:8787> — měl by se
načíst zápisník.

> Kdyby `install.bat` hlásil chybu, klikni na něj **pravým tlačítkem →
> „Spustit jako správce"**.

---

## Přístup z mobilu

Na telefonu (připojeném do Tailscale) otevři adresu svého PC a port `:8787`,
např.:

```
http://100.120.51.2:8787
```

**Jak zjistíš adresu svého PC v Tailscale:** otevři aplikaci Tailscale na PC
(ikonka v liště) → uvidíš adresu typu `100.x.x.x`. Tu použij místo
`localhost`. Přidej si stránku na plochu iPhonu („Sdílet" → „Přidat na
plochu"), ať ji máš jako appku.

---

## Ať PC neusíná (nepovinné, ale doporučené)

Když je PC uspané, mobil se nedovolá. Dvakrát klikni na **`no-sleep.bat`** —
nastaví, že při napájení ze zásuvky počítač neusíná (displej může zhasnout,
to nevadí, server běží dál).

---

## Ostatní tlačítka

| Soubor            | Co udělá                                              |
| ----------------- | ---------------------------------------------------- |
| `install.bat`     | zapne automatický start + hned spustí TARS           |
| `uninstall.bat`   | vypne automatický start (data zůstávají)             |
| `stop-tars.bat`   | zastaví právě běžící server                          |
| `no-sleep.bat`    | nastaví, aby PC neusínalo ze zásuvky                 |
| `start-tars.vbs`  | (spouští ho Plánovač) — skrytý start serveru         |

Restart serveru (po úpravě appky): `stop-tars.bat`, pak dvakrát
`start-tars.vbs`.

---

## Když něco nefunguje

- **Stránka se nenačte (localhost)** → server neběží. Zkus `stop-tars.bat`
  a pak dvakrát `start-tars.vbs`. Nebo mrkni, jestli je Node nainstalovaný
  (`node --version`).
- **„node se nenašel"** → Node.js není nainstalovaný nebo není v PATH.
  Nainstaluj z <https://nodejs.org> (verze LTS) a restartuj PC.
- **Z mobilu se nepřipojím** → Tailscale musí být zapnutý na PC i telefonu,
  a použij adresu `100.x.x.x`, ne `localhost`.
- **Chat nepíše, ale zápisník ano** → neběží Ollama. Zkontroluj ikonku
  Ollamy v liště, nebo spusť `ollama run qwen2.5:7b`.
- **Chci vidět, co server dělá (ladění)** → nespouštěj přes `.vbs`, ale
  otevři příkazový řádek ve složce `tars\` a napiš `node server.js` —
  uvidíš výpis i případné chyby.
