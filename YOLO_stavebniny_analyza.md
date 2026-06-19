# Vlastní AI na počítání stavebnin z fotky (YOLO + Mac Mini + databáze)

**Hloubková analýza a plán stavby — červen 2026**
Use-case: lokální systém, který na fotce spočítá počet kusů stavebního materiálu (překližky/desky, tyče/armatura/profily, cihly, pytle) a zapíše počty do databáze. Běží lokálně na Mac Mini (kvůli nákladům za cloud API). Cíl je z toho udělat produkt → řeší se i licence.

---

## 0. TL;DR — shrnutí a doporučení

1. **YOLO je správný nástroj.** Pro počítání objektů je vyhrazený detektor (YOLO) řádově spolehlivější i levnější než multimodální LLM (GPT‑4o/Claude přes API mají na přesné počítání jen ~35–39 % úspěšnost a platí se za každý obrázek). Tvoje úvaha „lokálně kvůli drahým tokenům" je **správná** — viz ekonomika v sekci 6.

2. **Verze (2026):** Vyvíjej a prototypuj na **Ultralytics YOLO11** nebo **YOLO26** (nejnovější, NMS‑free, dělaný i pro malé/husté objekty). Skvělé nástroje, export do CoreML jedním příkazem.

3. **POZOR na licenci (klíčové pro produkt!):** Ultralytics YOLO (v5/v8/v11/YOLO26) je **AGPL‑3.0**. Pro komerční produkt to znamená buď **otevřít celý zdroják** produktu, nebo koupit **Ultralytics Enterprise licenci**. Prototypovat na něm můžeš, ale **před prodejem** se rozhodni: koupit licenci, nebo přejít na model s Apache/MIT licencí (RT‑DETR od Baidu, YOLOX, RF‑DETR Nano–Large). Detaily v sekci 2.

4. **Jádro problému = naskládané/husté stavebniny.** Tady buď realista: z jedné fotky spolehlivě spočítáš jen **viditelnou vrstvu** (čelo stohu). Co je schované, model nevidí. Řešení: kontrolovaný úhel záběru, počítání čela × známý vzor skládání, nebo více fotek. Pro husté malé objekty pomáhá **SAHI (dlaždicová inference)** a u dotýkajících se kusů **instanční segmentace**. Sekce 3.

5. **Hardware:** Mac Mini **M4 Pro 24–48 GB** (ideál), minimum **M4 base 24 GB**. **Trénuj v cloudu** (pronájem NVIDIA GPU za pár $/hod), **nasaď a počítej na Macu** přes **CoreML/Neural Engine**. Trénink přímo na Macu nedoporučuji (pomalý a má tiché chyby). Sekce 5.

6. **Architektura produktu:** Python + **FastAPI** (upload endpoint) + YOLO inference + **SQLite** (start) → PostgreSQL (až poroste). Sekce 7. Roadmapa v sekci 8.

---

## 1. Jak YOLO funguje a výběr verze (2026)

### 1.1 Princip
YOLO = **jednoprůchodový (one‑stage) detektor**: v jednom průchodu sítí (backbone → neck → head) předpoví bounding boxy + třídy. To je rozdíl proti dvoufázovým (Faster R‑CNN), které nejdřív navrhují regiony a pak klasifikují → YOLO je rychlejší, vhodný pro lokální/real‑time běh.
- Od **YOLOv8 je anchor‑free** (odpadly předdefinované „kotvy", jednodušší a robustnější).
- Neck je obvykle **FPN+PAN** (detekce na více měřítkách → P3/P4/P5), což pomáhá různě velkým objektům.
- Historicky se na konci dělá **NMS** (potlačení duplicit). Novější YOLOv10 a YOLO26 jsou **NMS‑free** (rychlejší, méně závislé na ladění prahů).

### 1.2 Verze a kdo je dělá
| Verze | Rok | Autor | Pozn. |
|---|---|---|---|
| YOLOv5, v8, YOLO11, **YOLO26** | 2020–2026 | **Ultralytics** | AGPL‑3.0; nejlepší tooling |
| YOLOv9 (PGI, GELAN) | 2024 | akademický (WongKinYiu) | GPL‑3.0 |
| YOLOv10 (NMS‑free) | 2024 | Tsinghua | — |
| YOLO12 (attention‑centric) | 2025 | akademický, ale distribuovaný i přes Ultralytics | — |
| „YOLOv13" | — | **neexistuje** (k 6/2026) | číslování skočilo na YOLO26 (= rok) |

### 1.3 Přesnost vs. rychlost (COCO mAP, orientačně)
- YOLO11: n=39,5 % → x ~54 % mAP; YOLO11m má srovnatelnou přesnost s YOLOv8m, ale o **22 % méně parametrů**.
- YOLO12: n=40,6 % @ 1,64 ms (T4), x=55,2 %.
- **YOLO26** (T4, TensorRT): n=40,9 %, s=48,6 %, m=53,1 %, l=55,0 %, x=57,5 %; na CPU je **~43 % rychlejší** než YOLO11n díky NMS‑free hlavě. Obsahuje **STAL** (small‑target‑aware label assignment) → cíleně lepší na malé/husté objekty.
- Pozor: studie **ODverse33** (2025) ukázala, že „novější ≠ vždy lepší" pro konkrétní doménu — vždy nutno empiricky ověřit na vlastních datech.

### 1.4 Doporučení verze pro tebe
Začni s **YOLO11s/m** nebo **YOLO26s/m**. Pro malé/husté objekty zvaž přidání **P2 hlavy** (detekce velmi malých objektů) nebo **SAHI** při inferenci (sekce 3). Pokud se kusy hodně dotýkají/překrývají, použij **segmentační variantu (`-seg`)**.

*Zdroje: [YOLO11 vs předchozí (Ultralytics)](https://www.ultralytics.com/blog/comparing-ultralytics-yolo11-vs-previous-yolo-models), [YOLO26 arXiv 2509.25164](https://arxiv.org/html/2509.25164v4), [YOLO12 arXiv 2502.12524](https://arxiv.org/abs/2502.12524), [ODverse33 arXiv 2502.14314](https://arxiv.org/abs/2502.14314), [Ultralytics evoluce arXiv 2510.09653](https://arxiv.org/pdf/2510.09653).*

---

## 2. Licence — nejdůležitější věc, když z toho děláš produkt

> Tohle není právní rada, ale fakta z licenčních souborů. Před komerčním spuštěním to probereš s právníkem.

### 2.1 Ultralytics = AGPL‑3.0
- Ultralytics YOLO (v5/v8/v11/YOLO26) je **AGPL‑3.0** ([LICENSE](https://github.com/ultralytics/ultralytics/blob/main/LICENSE)).
- AGPL uzavírá tzv. „SaaS mezeru": povinnost zveřejnit zdrojový kód se spustí **i když software jen poskytuješ přes síť/web** (ne jen při distribuci binárky).
- Mapování spouštěčů:
  - **Interní nástroj** (jen pro tebe/firmu, bez vnějších uživatelů): copyleft se obvykle nespustí — ale Ultralytics oficiálně tvrdí, že i firemní interní použití vyžaduje Enterprise licenci. (FSF výklad je mírnější; Ultralytics je přísnější jako poskytovatel.)
  - **Distribuovaná desktop appka** (např. nativní Mac app, kterou prodáváš): copyleft **se spustí** → musíš dodat zdroják.
  - **Hostovaný/SaaS** (uživatel se připojí přes web): copyleft **se spustí**.
- **Enterprise licence existuje** ([stránka](https://www.ultralytics.com/legal/enterprise-software-license)) — uzavřená komerční licence bez copyleftu, **cena na vyžádání** (jedna anekdota zmiňuje ~5 000 $/rok, ale není to oficiální číslo).

### 2.2 Licenčně přívětivé alternativy (komerčně OK)
| Model | Licence | Komerčně? |
|---|---|---|
| **YOLOX** (Megvii) | Apache‑2.0 | ✅ ANO |
| **RT‑DETR** (originál Baidu, lyuwenyu) | Apache‑2.0 | ✅ ANO |
| **RF‑DETR** Nano–Large (Roboflow) | Apache‑2.0 | ✅ ANO |
| **MMDetection** (OpenMMLab) | MIT | ✅ ANO |
| **PaddleDetection** (Baidu) | Apache‑2.0 | ✅ ANO |
| Ultralytics YOLO (v5/v8/v11/26) | AGPL‑3.0 | ⚠️ jen open‑source NEBO Enterprise |
| RT‑DETR **port v Ultralytics** | AGPL‑3.0 | ⚠️ (originál Baidu je ale Apache!) |
| **YOLO‑NAS** váhy (Deci) | nekomerční | ❌ NE |
| YOLOv7 | GPL‑3.0 | ⚠️ jen open‑source |

### 2.3 Praktické doporučení
1. **Fáze vývoje/prototypu:** klidně Ultralytics YOLO11/YOLO26 — nejlepší nástroje, rychlý postup. (Vývoj a testování ti AGPL neblokuje.)
2. **Před komerčním spuštěním** se rozhodni:
   - **Cesta A (nejrychlejší):** koupit **Ultralytics Enterprise** licenci a zůstat na YOLO11/26.
   - **Cesta B (bez licenčního poplatku):** přenést řešení na **Apache‑licencovaný model** (RT‑DETR Baidu / RF‑DETR Nano‑Large / YOLOX). Vlastní natrénované váhy jsou pak čistě tvoje.
- Vlastní natrénované váhy = tvoje, ale **framework** určuje licenci → proto pozor na to, na čem trénuješ a co distribuuješ.

*Zdroje: [AGPL/SaaS mezera (Mend.io)](https://www.mend.io/blog/the-saas-loophole-in-gpl-open-source-licenses/), [Ultralytics diskuse #1260](https://github.com/orgs/ultralytics/discussions/1260), [YOLOX LICENSE](https://github.com/Megvii-BaseDetection/YOLOX/blob/main/LICENSE), [RT‑DETR LICENSE](https://github.com/lyuwenyu/RT-DETR/blob/main/LICENSE), [RF‑DETR LICENSE](https://github.com/roboflow/rf-detr/blob/develop/LICENSE), [YOLO‑NAS váhy](https://github.com/Deci-AI/super-gradients/blob/master/YOLONAS.md).*

---

## 3. Jádro problému: počítání naskládaných / hustých stavebnin

Tohle je technicky nejtěžší část a rozhoduje o úspěchu projektu.

### 3.1 Brutálně upřímné omezení
Z **jedné fotky** spočítáš spolehlivě jen to, co je **vidět**. U stohu cihel / hromady pytlů / svazku tyčí jsou zadní kusy schované → žádný 2D model je „nedopočítá". Možnosti:
- **Kontrolovaný záběr** (např. čelo palety kolmo) + **počítání viditelné vrstvy × počet vrstev** (známý vzor skládání).
- **Více fotek / více úhlů** (multi‑view), případně odhad geometrie/hloubky.
- U sypkých/dvourozměrných scén (cihly v jedné vrstvě, tyče z čela) je to naopak velmi dobře řešitelné.

### 3.2 Srovnání přístupů
| Přístup | Kdy použít | Realita |
|---|---|---|
| **Detekce + počítání boxů** (YOLO) | středně husté, oddělené kusy | NMS selhává při překryvu boxů >50–70 % (cihly, tyče z čela) — buď duplikáty, nebo vynechání |
| **SAHI** (dlaždicová inference) | malé/husté objekty na velké fotce | +5–7 % AP (bez tréninku), +12–14 % se sliced fine‑tuningem; u malých objektů i násobně. **ALE pomalé**: ~16× compute na 4×4 mřížku, reálně i 240× pomalejší než holý model. Vhodné pro **dávkové** zpracování fotek, ne real‑time. |
| **Instanční segmentace** (`-seg`, Mask R‑CNN) | dotýkající se / překrývající se kusy | +3–12 % proti boxům při okluzi; pixelově oddělí slepené objekty |
| **Density‑map** (crowd counting) | extrémní hustota (>50–100 ks) | lepší než detekce u velmi hustých scén; nevrací jednotlivé boxy, jen počet |

### 3.3 Reálné nasazené systémy na stavebniny (důkaz, že to jde)
- **Armatura/tyče (rebar):** YOLOv3 AP 99,7 % na čele svazku; **MaskID** (Mask R‑CNN) F1 > 0,99; YOLOv10‑PVT počítací přesnost ~86 % z dronu. Průmyslové linky (DBM, LMM) mají chybu **0,008–0,05 %** — ale s řízeným IR osvětlením a kamerou, ne z běžné fotky.
- **Více materiálů (tyče, trubky, profily, I‑nosníky):** vylepšený YOLOv4, **MAE 4,07**, AP 91,4 %, nasazeno jako mobilní app.
- **Cihly:** U‑Net pro výpočet množství ve zdivu.
- **Datasety k dispozici:** **MACO** (4 426 fotek, 7 kategorií stavebnin, 563 595 objektů, mAP až 91,6 %), **SODA** (cihla AP 90,9 %, rebar 73 % u YOLOv4) — dobré pro předtrénink/inspiraci.

### 3.4 Doporučení pro tvůj případ
1. Pro **oddělené/řídké** kusy: čistá detekce YOLO + počítání boxů.
2. Pro **malé husté** (cihly, tyče z čela na velké fotce): YOLO + **SAHI** dávkově.
3. Pro **dotýkající se** kusy: **YOLO‑seg**.
4. Vždy **standardizuj focení** (úhel, vzdálenost, světlo) — zlepší přesnost víc než výměna modelu.

*Zdroje: [SAHI arXiv 2202.06934](https://arxiv.org/abs/2202.06934), [MaskID PLOS ONE](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0271051), [Automated Counting of Steel Materials (Buildings 2024)](https://www.mdpi.com/2075-5309/14/6/1661), [MACO dataset (ASCE)](https://ascelibrary.org/doi/abs/10.1061/JCEMD4.COENG-17693), [SODA dataset arXiv 2202.09554](https://arxiv.org/abs/2202.09554), [Counting Stacked Objects arXiv 2411.19149](https://arxiv.org/abs/2411.19149).*

---

## 4. Vlastní dataset a trénink

### 4.1 Kolik dat
- Ultralytics doporučuje pro produkční model **≥ 1 500 fotek a ≥ 10 000 instancí na třídu**. Roboflow říká, že **50–100 fotek stačí na první funkční verzi**.
- U hustých scén platí: **na počtu instancí záleží víc než na počtu fotek** (200 fotek × 20+ objektů = 4 000+ instancí).
- **Realistický start:** 200–500 fotek na druh materiálu, focené v reálných podmínkách (různé světlo, úhly, vzdálenosti, částečný překryv).

### 4.2 Anotace
- **Roboflow** (hostované, SAM‑2 asistované předznačení; zdarma do ~1 000 auto‑label obrázků/job) — nejrychlejší pro jednotlivce.
- **CVAT** (open‑source, self‑host, zdarma) nebo **Label Studio** — když chceš data u sebe.
- Vždy **zkontroluj auto‑labely** — SAM míjí zakryté/naskládané kusy.

### 4.3 Trénink
- **Transfer learning z COCO vah** (ne od nuly): `model.train(data=custom.yaml, model=yolo11n.pt, epochs=100, imgsz=640, batch=16)`.
- Augmentace: `mosaic=1.0` (zap.), pro řídké třídy zapni `copy_paste=0.3`; `close_mosaic=20` na konci.
- Pro fixní úhel focení zvaž vypnout `flipud`.

### 4.4 Měření přesnosti — důležité!
- **Detekční mAP ≠ přesnost počítání.** Falešně pozitivní a falešně negativní se můžou navzájem vyrušit → dobré mAP, ale špatný počet (nebo naopak).
- Vyhodnocuj **OBOJÍ**: mAP@0.5 a zároveň **počítací MAE/RMSE** a **% chybu počtu** na vlastní validaci.
- **Děl data podle scény/focení**, ne náhodně po fotce (jinak únik dat a nadhodnocené metriky).

*Zdroje: [Ultralytics tipy pro trénink](https://docs.ultralytics.com/yolov5/tutorials/tips-for-best-training-results), [Roboflow: kolik dat](https://blog.roboflow.com/how-much-training-data/), [Ultralytics augmentace](https://github.com/ultralytics/ultralytics/blob/main/docs/en/guides/yolo-data-augmentation.md), [fruitlet counting mAP vs MAE arXiv 2407.12040](https://arxiv.org/abs/2407.12040).*

---

## 5. Nasazení na Mac Mini (Apple Silicon)

### 5.1 Klíčové pravidlo: trénuj v cloudu, počítej na Macu
- **MPS (Metal) inference** je 3–13× rychlejší než CPU. ✅
- **Trénink přes MPS na Macu NEDOPORUČUJI**: je pomalý (někdy pomalejší než CPU), má **tiché chyby** (špatné loss/souřadnice), memory leaky; řada bugů zavřená jako „not planned". ❌
- **Pro nasazení použij CoreML export** → běží na **Neural Engine (ANE)**, výrazně rychlejší a stabilnější než MPS.

### 5.2 Reálná čísla (640px, detekce)
| Konfigurace | Model | Rychlost |
|---|---|---|
| M4, PyTorch | YOLO11 | ~21 FPS |
| **M4, CoreML (ANE)** | YOLO11 | **~85 FPS** (~4× proti PyTorch) |
| M4 Pro, PyTorch‑MPS | YOLOv8n | ~92 FPS |
| M3 Air, CoreML | YOLO11m | ~25 FPS |
| M1 Pro, CPU vs MPS | YOLOv8m | 3 FPS → 42 FPS (12,7×) |
| M4 Pro, MLX | yolo26n | 170 FPS |

> Pozor na známý bug: MPS někdy **tiše poškodí souřadnice boxů** (issue #23140). Proto pro produkci **CoreML**, a po exportu ověř boxy proti CPU.

### 5.3 Doporučená konfigurace Mac Mini
- **Inference samotná:** M4 base **16 GB** stačí, ale...
- **Doporučení pro tebe (SAHI dlaždice + případně víc modelů + DB + web):** **M4 Pro, 24–48 GB**. Když rozpočet napjatý: **M4 base, 24 GB**.
- Trénink: pronajmi cloud GPU (A100/H100 na Lambda/RunPod/Vast.ai, pár $/hod) — na Macu by to byly dny místo hodin.
- Bonus: Mac Mini bere ~30–40 W (vs. 350+ W u NVIDIA stanice) → ~25 $/rok na elektřině.

### 5.4 Export
```bash
# CoreML pro Mac/ANE (doporučeno pro nasazení)
yolo export model=best.pt format=coreml int8=True
# nebo ONNX (cross‑platform)
yolo export model=best.pt format=onnx opset=17 simplify=True
```

*Zdroje: [Ultralytics CoreML](https://docs.ultralytics.com/integrations/coreml), [Bringing YOLO11 to Apple via CoreML](https://www.ultralytics.com/blog/bringing-ultralytics-yolo11-to-apple-devices-via-coreml), [Roboflow M4 test](https://blog.roboflow.com/putting-the-new-m4-macs-to-the-test/), [MPS bbox bug #23140](https://github.com/ultralytics/ultralytics/issues/23140), [yolo‑mlx](https://github.com/thewebAI/yolo-mlx).*

---

## 6. Ekonomika: lokálně vs. cloud (potvrzuje tvou úvahu)

### 6.1 Cena cloudových vision API (za 1 000 obrázků)
- **Google Cloud Vision** (object localization): 2,25 $ → 1,50 $.
- **AWS Rekognition:** 1,00 $ → 0,25 $ (podle objemu).
- **Azure AI Vision:** ~1,00 $ → 0,65 $.
- **LLM vision (GPT‑4o ~1,9 $/1000, Claude ~3–4,5 $/1000)** — a navíc **nespolehlivé na přesné počítání** (35–39 % úspěšnost). Pro počítání nevhodné.

### 6.2 Lokální běh
- Po jednorázovém tréninku je **marginální cena ≈ elektřina** (~0,00002 $/obrázek).
- **Bod zlomu:** lokální setup za ~50 $/měs. se vyplatí od ~**22 000–50 000 obrázků/měsíc** proti cloudu.
- **Závěr: tvoje úvaha „lokálně kvůli nákladům" je správná** — při jakémkoli reálném objemu lokální běh drtivě vyhrává a navíc máš data u sebe.

*Zdroje: [Google Vision pricing](https://cloud.google.com/vision/pricing), [AWS Rekognition pricing](https://aws.amazon.com/rekognition/pricing/), [LLM počítání arXiv 2506.22146](https://arxiv.org/pdf/2506.22146).*

---

## 7. Doporučená architektura produktu (MVP)

```
Fotka ──▶ [Vstup] ──▶ [Inference YOLO] ──▶ [Výpočet počtů] ──▶ [Databáze] ──▶ [Dashboard]
            │
            ├─ Web upload (FastAPI UploadFile)
            ├─ Sledování složky (watchdog) – nahodíš fotky do ./inbox/
            └─ REST API z telefonu (POST /upload)
```

**Stack:**
- **Python + FastAPI** — endpointy `POST /upload` (vrátí 202) a `GET /results/{id}`.
- **Model** načtený jednou při startu (`@app.on_event("startup")`), sdílený mezi requesty. Na Macu varianta **CoreML**.
- **Databáze:** start **SQLite** (nulová správa) → **PostgreSQL** až přibudou paralelní workeři.
- **Fronta:** malý objem = `BackgroundTasks`; vyšší = **Celery/RQ + Redis**.
- **Ukládání:** originál do `./images/{datum}/{uuid}.jpg`, do DB jen cesta + výsledky.

**Schéma DB (zjednodušené):**
```sql
images(id, path, taken_at, status)
detections(id, image_id, class_name, count, confidence, bbox_json, created_at)
```

*Zdroje: [SQLite vs PostgreSQL](https://www.datacamp.com/blog/sqlite-vs-postgresql-detailed-comparison), [watchdog](https://github.com/gorakhargosh/watchdog), [FastAPI BackgroundTasks vs Celery](https://dev.to/uaslimcreate/fastapi-background-tasks-vs-celery-for-ai-feature-processing-when-to-queue-and-when-to-345l).*

---

## 8. Roadmapa krok za krokem

**Fáze 1 — Proof of concept (1–2 týdny)**
1. Nasbírej 100–200 fotek jednoho druhu materiálu (nejjednodušší, např. pytle na paletě nebo cihly v jedné vrstvě).
2. Anotuj v Roboflow (SAM asist.).
3. Fine‑tune YOLO11n/s z COCO vah (zdarma cloud GPU, Colab).
4. Změř mAP **i** počítací MAE. Cíl: ověřit, že to pro tvůj materiál vůbec dává smysl.

**Fáze 2 — MVP pipeline (2–4 týdny)**
5. FastAPI: upload fotky → inference → počty → SQLite.
6. Export modelu do **CoreML**, ověř běh na Macu (půjčený/testovací) a rychlost.
7. Jednoduchý web dashboard (tabulka: fotka, materiál, počet, čas).

**Fáze 3 — Rozšíření na víc materiálů (1–2 měsíce)**
8. Rozšiř dataset na všechny druhy (cíl ≥ 1 000–1 500 fotek / druh pro produkční kvalitu).
9. Přidej **SAHI** pro husté/malé objekty, případně `-seg` pro dotýkající se.
10. Standardizuj focení (návod pro uživatele: úhel, vzdálenost, světlo).

**Fáze 4 — Produkt (před prodejem)**
11. **Vyřeš licenci** (Ultralytics Enterprise, nebo přechod na Apache model).
12. Zpevni: autentizace, fronta (Celery), PostgreSQL, zálohy, logging přesnosti.
13. Kup Mac Mini (M4 Pro 24–48 GB), nasaď jako lokální server.

---

## 9. Realistická očekávání a rizika

- **Největší riziko = naskládané/zakryté kusy.** Vyřeš to standardizací focení a/nebo počítáním viditelné vrstvy × vzor. Nečekej, že model „uvidí" do středu hromady.
- **Přesnost:** u dobře oddělených kusů reálně 95–99 %; u hustých/překrytých klesá. Měř počítací chybu, ne jen mAP.
- **Trénink na Macu ne** — jen inference. Trénink cloud.
- **Licence vyřeš dřív, než začneš prodávat** — AGPL u Ultralytics není „detail".
- **Standardizace vstupu** zlepší výsledek víc než honba za nejnovější verzí modelu.

---

## 10. Klíčové zdroje
- YOLO/verze: [Ultralytics docs](https://docs.ultralytics.com/), [YOLO26 arXiv 2509.25164](https://arxiv.org/html/2509.25164v4), [ODverse33 arXiv 2502.14314](https://arxiv.org/abs/2502.14314)
- Licence: [Ultralytics LICENSE (AGPL)](https://github.com/ultralytics/ultralytics/blob/main/LICENSE), [Enterprise](https://www.ultralytics.com/legal/enterprise-software-license), [YOLOX Apache](https://github.com/Megvii-BaseDetection/YOLOX/blob/main/LICENSE), [RT‑DETR Apache](https://github.com/lyuwenyu/RT-DETR/blob/main/LICENSE)
- Husté počítání: [SAHI arXiv 2202.06934](https://arxiv.org/abs/2202.06934) + [obss/sahi](https://github.com/obss/sahi), [MaskID rebar PLOS ONE](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0271051)
- Stavebniny: [Steel materials counting (Buildings 2024)](https://www.mdpi.com/2075-5309/14/6/1661), [MACO dataset](https://ascelibrary.org/doi/abs/10.1061/JCEMD4.COENG-17693), [SODA](https://arxiv.org/abs/2202.09554)
- Apple Silicon: [Ultralytics CoreML](https://docs.ultralytics.com/integrations/coreml), [Roboflow M4 test](https://blog.roboflow.com/putting-the-new-m4-macs-to-the-test/)
- Ekonomika: [Google Vision pricing](https://cloud.google.com/vision/pricing), [AWS Rekognition](https://aws.amazon.com/rekognition/pricing/)
- Architektura: [FastAPI](https://fastapi.tiangolo.com/), [watchdog](https://github.com/gorakhargosh/watchdog)
