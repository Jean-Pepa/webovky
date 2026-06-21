"""
Počítadlo stavebnin – backend (FastAPI).

Tohle je funkční KOSTRA, která:
  • přijme fotku z mobilní appky (POST /api/count),
  • uloží ji na disk,
  • (zatím) vrátí UKÁZKOVÉ počty – místo, kam se zapojí skutečný model, je označené TODO,
  • zapíše výsledek do SQLite,
  • umí vrátit historii (GET /api/history),
  • servíruje i samotnou mobilní appku (složku ../frontend).

Spuštění:
    pip install -r requirements.txt
    uvicorn main:app --host 0.0.0.0 --port 8000
Pak na telefonu (ve stejné WiFi) otevři:  http://<IP-adresa-Macu>:8000
A v appce v ⚙️ nastav stejnou adresu serveru.
"""

import os
import json
import random
import sqlite3
import uuid
from datetime import datetime
from pathlib import Path

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

BASE_DIR = Path(__file__).resolve().parent
FRONTEND_DIR = BASE_DIR.parent / "frontend"
UPLOAD_DIR = BASE_DIR / "uploads"
DB_PATH = BASE_DIR / "data.db"
UPLOAD_DIR.mkdir(exist_ok=True)

MATERIAL_LABELS = {
    "auto": "Materiál",
    "cihly": "Cihly",
    "pytle": "Pytle",
    "tyce": "Tyče / armatura",
    "desky": "Desky / překližky",
    "trubky": "Trubky / profily",
}

app = FastAPI(title="Počítadlo stavebnin")

# Pro vývoj povolíme přístup z appky odkudkoli.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- Databáze ----------
def db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with db() as conn:
        conn.execute(
            """CREATE TABLE IF NOT EXISTS counts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                material TEXT,
                total INTEGER,
                items_json TEXT,
                image_path TEXT,
                created_at TEXT
            )"""
        )


init_db()


# ---------- Model ----------
CONF_THRESHOLD = float(os.environ.get("CONF_THRESHOLD", "0.4"))
MODEL_WEIGHTS = os.environ.get("MODEL_WEIGHTS", str(BASE_DIR / "model.pth"))
_model = None
_model_loaded = False


def _get_model():
    """Líně načte RF-DETR (Apache) z vah, jen jednou. Bez vah → None (demo režim)."""
    global _model, _model_loaded
    if _model_loaded:
        return _model
    _model_loaded = True
    try:
        if not os.path.exists(MODEL_WEIGHTS):
            print(f"[model] Vahy {MODEL_WEIGHTS} nenalezeny -> DEMO rezim.")
            return None
        from rfdetr import RFDETRBase  # licence Apache-2.0
        _model = RFDETRBase(pretrain_weights=MODEL_WEIGHTS)
        print(f"[model] Nacten RF-DETR z {MODEL_WEIGHTS}.")
    except Exception as e:
        print(f"[model] Model se nepodarilo nacist ({e}) -> DEMO rezim.")
        _model = None
    return _model


def run_model(image_path: str, material: str) -> dict:
    """
    TODO: SEM se zapojí skutečný model.

    Reálná verze (RF-DETR / YOLO přes ONNX Runtime) bude vypadat zhruba takhle:

        import onnxruntime as ort
        from PIL import Image
        import numpy as np

        sess = ort.InferenceSession("model.onnx",
                                    providers=["CoreMLExecutionProvider", "CPUExecutionProvider"])
        # 1) načti a předzpracuj obrázek (resize, normalizace)
        # 2) sess.run(...) -> boxy + třídy + skóre
        # 3) odfiltruj podle prahu jistoty (např. 0.4)
        # 4) (volitelně) SAHI dlaždice pro husté/malé objekty
        # 5) spočítej počty boxů na třídu

    Pro husté/naskládané materiály doplň SAHI (knihovna `sahi`, licence MIT)
    a počítej viditelnou vrstvu – viz analýza projektu.
    """
    model = _get_model()
    if model is None:
        # --- DEMO fallback (dokud nemáš natrénované váhy model.pth) ---
        classes = ["cihly", "pytle", "tyce"] if material == "auto" else [material]
        items = [
            {"class": MATERIAL_LABELS.get(c, c), "count": random.randint(5, 45)}
            for c in classes
        ]
        return {"total": sum(i["count"] for i in items), "items": items, "demo": True}

    # --- REÁLNÁ inference (RF-DETR) ---
    import numpy as np
    det = model.predict(image_path, threshold=CONF_THRESHOLD)  # supervision Detections
    class_ids = np.array(getattr(det, "class_id", []) if getattr(det, "class_id", None) is not None else []).tolist()
    if len(set(class_ids)) <= 1:
        # jeden druh materiálu -> celkový počet = počet boxů
        label = MATERIAL_LABELS.get(material, "Desky / překližky")
        n = len(det)
        return {"total": n, "items": [{"class": label, "count": n}], "demo": False}
    # více tříd najednou
    counts = {}
    for cid in class_ids:
        counts[cid] = counts.get(cid, 0) + 1
    items = [{"class": f"třída {cid}", "count": n} for cid, n in sorted(counts.items())]
    return {"total": sum(counts.values()), "items": items, "demo": False}


# ---------- API ----------
@app.post("/api/count")
async def count(image: UploadFile = File(...), material: str = Form("auto")):
    # 1) ulož fotku
    ext = os.path.splitext(image.filename or "")[1] or ".jpg"
    fname = f"{datetime.now():%Y%m%d}_{uuid.uuid4().hex[:8]}{ext}"
    fpath = UPLOAD_DIR / fname
    with open(fpath, "wb") as f:
        f.write(await image.read())

    # 2) spusť model
    result = run_model(str(fpath), material)

    # 3) zapiš do DB
    created = datetime.now().isoformat()
    with db() as conn:
        cur = conn.execute(
            "INSERT INTO counts (material, total, items_json, image_path, created_at) VALUES (?,?,?,?,?)",
            (material, result["total"], json.dumps(result["items"], ensure_ascii=False), f"uploads/{fname}", created),
        )
        rec_id = cur.lastrowid

    # 4) vrať odpověď appce
    return {
        "id": rec_id,
        "total": result["total"],
        "items": result["items"],
        "material": material,
        "demo": result.get("demo", False),
        "timestamp": created,
        "image_url": f"/uploads/{fname}",
    }


@app.get("/api/history")
def history(limit: int = 50):
    with db() as conn:
        rows = conn.execute(
            "SELECT * FROM counts ORDER BY id DESC LIMIT ?", (limit,)
        ).fetchall()
    return JSONResponse([
        {
            "id": r["id"],
            "material": r["material"],
            "materialLabel": MATERIAL_LABELS.get(r["material"], "Materiál"),
            "total": r["total"],
            "items": json.loads(r["items_json"]),
            "timestamp": r["created_at"],
            "image_url": "/" + r["image_path"],
        }
        for r in rows
    ])


@app.get("/api/health")
def health():
    return {"ok": True}


# ---------- Statika: nahrané fotky + samotná appka ----------
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")
if FRONTEND_DIR.exists():
    app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")
