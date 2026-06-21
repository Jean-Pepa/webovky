"""
Trénink modelu na počítání desek (RF-DETR, licence Apache-2.0) + export.

Tohle se spouští v Google Colabu nebo na cloud GPU (NE na Macu).
Vstup = dataset z Roboflow ve formátu COCO (train/valid/test + _annotations.coco.json).

Postup:
  1) V Roboflow vytvoř projekt "Object Detection", nahraj fotky, anotuj (třída `deska`).
  2) Generate → Export → formát "COCO" → "show download code" → zkopíruj sem.
  3) Spusť tenhle skript (Colab s GPU).
  4) Výstup: natrénované váhy + vyhodnocení počítací chyby (MAE).
"""

# === 0) Instalace (v Colabu) ===
# !pip install rfdetr supervision

import os, json, glob, statistics

# === 1) Stažení datasetu z Roboflow ===
# Nahraď tímhle kódem z Roboflow (Export → COCO → show download code):
#
#   from roboflow import Roboflow
#   rf = Roboflow(api_key="TVUJ_KLIC")
#   project = rf.workspace("...").project("desky")
#   dataset = project.version(1).download("coco")
#   DATASET_DIR = dataset.location
#
DATASET_DIR = os.environ.get("DATASET_DIR", "desky-1")  # složka s train/valid/test

# === 2) Trénink ===
from rfdetr import RFDETRBase

model = RFDETRBase()  # předtrénované váhy (COCO) → transfer learning
model.train(
    dataset_dir=DATASET_DIR,
    epochs=50,            # u malého datasetu klidně 30–60
    batch_size=4,         # podle paměti GPU
    grad_accum_steps=4,
    lr=1e-4,
)
print("✅ Trénink hotov. Váhy jsou v ./output/")

# === 3) Vyhodnocení POČÍTACÍ chyby (MAE) na testovací sadě ===
# Pozn.: dobré mAP ještě neznamená dobré počítání. Tohle je tvoje skutečná metrika.
def count_eval(model, test_dir, conf=0.4):
    ann = json.load(open(os.path.join(test_dir, "_annotations.coco.json")))
    gt = {}
    for a in ann["annotations"]:
        gt[a["image_id"]] = gt.get(a["image_id"], 0) + 1
    id2file = {im["id"]: im["file_name"] for im in ann["images"]}
    errs, perc = [], []
    for img_id, true_n in gt.items():
        path = os.path.join(test_dir, id2file[img_id])
        det = model.predict(path, threshold=conf)
        pred_n = len(det)
        errs.append(abs(pred_n - true_n))
        if true_n:
            perc.append(abs(pred_n - true_n) / true_n * 100)
        print(f"{id2file[img_id]}: skutečnost={true_n}  model={pred_n}")
    print("\n=== VÝSLEDEK POČÍTÁNÍ ===")
    print(f"MAE  (prům. absolutní chyba): {statistics.mean(errs):.2f} kusů")
    print(f"MAPE (prům. % chyba):        {statistics.mean(perc):.1f} %")
    print("Cíl pro 1. kolo: MAPE pod ~5 %.")

test_dir = os.path.join(DATASET_DIR, "test")
if os.path.isdir(test_dir):
    count_eval(model, test_dir)

# === 4) Export ===
# A) ONNX – pro produkční nasazení na Macu přes onnxruntime + CoreML/Neural Engine:
try:
    model.export()   # vytvoří ONNX ve ./output/
    print("✅ Export do ONNX hotov (./output/).")
except Exception as e:
    print("Export ONNX přeskočen:", e)

# B) Pro rychlé zapojení do backendu stačí natrénované váhy (.pth) z ./output/.
#    Zkopíruj je do backendu jako:  pocitadlo-stavebnin/backend/model.pth
#    a restartuj server – run_model() je rovnou použije (viz training/README.md).
