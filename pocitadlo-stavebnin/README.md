# Počítadlo stavebnin — mobilní appka (PWA) + backend

Mobilní rozhraní pro počítání kusů stavebního materiálu z fotky: **vyfoť → spočítej → ulož do databáze**.
Je to **webová appka (PWA)** — běží na iPhonu i Androidu přes prohlížeč a jde „nainstalovat" na plochu jako normální appka. Žádný App Store, žádný build.

```
pocitadlo-stavebnin/
├── frontend/        # samotná mobilní appka (HTML/CSS/JS, PWA)
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   ├── manifest.json
│   ├── service-worker.js
│   └── icon.svg
├── backend/         # FastAPI server (kostra + SQLite, místo pro model)
│   ├── main.py
│   └── requirements.txt
└── README.md
```

---

## 1. Rychlý start – jen appka (demo režim)

Appku si prohlédneš i bez serveru. Stačí spustit jednoduchý web server ze složky `frontend`:

```bash
cd pocitadlo-stavebnin/frontend
python3 -m http.server 5500
```
Otevři `http://localhost:5500`. V demo režimu se počty vygenerují ukázkově (model neběží) — slouží k vyzkoušení rozhraní.

> Otevření přes `python -m http.server` (ne dvojklikem na soubor) je potřeba kvůli service workeru / PWA.

---

## 2. Plný běh – appka + backend

```bash
cd pocitadlo-stavebnin/backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```
Backend zároveň **servíruje i appku**, takže otevři rovnou `http://localhost:8000`.

### Na telefonu (stejná WiFi jako Mac)
1. Zjisti IP Macu: `ipconfig getifaddr en0` (např. `192.168.0.10`).
2. Na telefonu otevři `http://192.168.0.10:8000`.
3. V appce klepni na **⚙️** a do „Adresa serveru" zadej `http://192.168.0.10:8000`. (Když necháš prázdné, appka jede v demo režimu.)

### Instalace na plochu (vypadá pak jako nativní appka)
- **iPhone (Safari):** Sdílet → *Přidat na plochu*.
- **Android (Chrome):** menu → *Přidat na plochu / Nainstalovat appku*.

---

## 3. Jak zapojit skutečný model (Cesta B – Apache licence, bez poplatku)

Model se zapojuje **na jednom místě** v `backend/main.py` → funkce `run_model()`. Teď vrací ukázkové počty; nahradíš ji reálnou inferencí:

1. Natrénuj detektor (cloud GPU) na **RF‑DETR / RT‑DETR / YOLOX** (vše Apache‑2.0).
2. Vyexportuj do **ONNX**.
3. V backendu odkomentuj v `requirements.txt` `onnxruntime`, `pillow`, `numpy` (a `sahi` pro husté materiály).
4. V `run_model()` načti `model.onnx` přes `onnxruntime` (na Macu využije CoreML/Neural Engine), předzpracuj obrázek, spusť inferenci, spočítej boxy na třídu.

Pro **naskládané/husté** materiály (cihly, pytle, svazky tyčí) přidej **SAHI** (dlaždicová inference, licence MIT) a počítej viditelnou vrstvu. Detaily a čísla jsou v dokumentu `../YOLO_stavebniny_analyza.md`.

> ⚠️ V produktu nepoužívej balíček `ultralytics` (licence AGPL‑3.0). Drž se ONNX + onnxruntime + Apache modelu — viz analýza.

---

## 4. Co appka umí teď
- 📸 Vyfotit přímo z mobilu nebo vybrat z galerie
- 🏗️ Vybrat druh materiálu (nebo „automaticky")
- 🔢 Spočítat a zobrazit počty po třídách + celkem
- 💾 Uložit do databáze (SQLite na backendu; lokální historie v telefonu jako záloha)
- 📋 Historie posledních měření
- 📲 Funguje jako instalovatelná PWA (i offline skořápka)

## 5. Co dodělat (další kroky)
- Zapojit reálný model (sekce 3)
- Anotovaný obrázek s vykreslenými boxy ve výsledku
- Přihlášení / více uživatelů, export do CSV
- Přechod SQLite → PostgreSQL při růstu
