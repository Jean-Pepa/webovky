# Trénink modelu na počítání desek (RF-DETR, Apache – bez licenčního poplatku)

Celý postup od fotek k běžícímu modelu. Trénuje se **v cloudu** (Colab/GPU), **ne na Macu**.

## Postup krok za krokem

### 1. Nasbírej a nafoť data
Podle `../docs/foceni-desky.md`. **Tohle je nejdůležitější krok** — bez dobrých fotek nepomůže nic.

### 2. Anotuj v Roboflow (zdarma pro start)
1. [roboflow.com](https://roboflow.com) → **Create Project** → *Object Detection*.
2. Nahraj fotky, použij **SAM‑asistované značení** (Label Assist) pro rychlost.
3. Třída: **`deska`**. Orámuj každou viditelnou hranu.
4. **Train/Valid/Test split** — děl po stozích (ne náhodně).
5. **Generate** → **Export** → formát **COCO** → *show download code*.

### 3. Natrénuj (Google Colab s GPU – zdarma)
1. Otevři [colab.research.google.com](https://colab.research.google.com) → nový notebook → Runtime → GPU.
2. Nahraj `train_rfdetr.py` (nebo zkopíruj jeho obsah do buněk).
3. Na začátek vlož **download code z Roboflow** (krok 2) a nastav `DATASET_DIR`.
4. Spusť. Na konci uvidíš **MAE / MAPE** (počítací chybu) — tvoji skutečnou metriku úspěchu.

### 4. Zapoj model do backendu
Máš dvě možnosti:

**A) Rychlá (PyTorch váhy) — doporučeno pro první test:**
1. Z `./output/` stáhni natrénované váhy (`*.pth`).
2. Zkopíruj je do `pocitadlo-stavebnin/backend/model.pth`.
3. Doinstaluj: `pip install rfdetr supervision`
4. Restartuj backend. Hotovo — `run_model()` je rovnou použije a appka počítá naostro.

**B) Produkční (ONNX + CoreML na Macu) — později, kvůli rychlosti:**
- Použij vyexportovaný `model.onnx`, spusť přes `onnxruntime` s `CoreMLExecutionProvider`.
- Pro husté stohy přidej **SAHI** (dlaždice, licence MIT).

## Důležité
- **Neměř jen mAP, ale MAE/MAPE počtu** — model může mít dobré mAP a špatně počítat.
- **Začni s jednou tloušťkou desky.** Víc typů = víc tříd = víc dat (až později).
- **V produktu nepoužívej `ultralytics` (AGPL).** RF‑DETR / ONNX / SAHI jsou Apache/MIT — čisté.

## Cíl 1. kola
MAPE pod ~5 % na tvých fotkách → škálujeme (víc desek, další materiály, Mac, produkce).
Když to nevyjde → doladíme focení / přidáme segmentaci / SAHI. A stálo to víkend.
