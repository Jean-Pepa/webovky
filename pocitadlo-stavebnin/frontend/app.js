/* ===== Počítadlo stavebnin – logika mobilní appky =====
 * Funguje ve dvou režimech:
 *  - DEMO (prázdná adresa serveru): počty se vygenerují náhodně, ať je appka vidět.
 *  - OSTRÝ (vyplněná adresa serveru): fotka se pošle na FastAPI backend, který
 *    spustí YOLO/RF-DETR model a vrátí skutečné počty.
 */

const MATERIAL_LABELS = {
  auto: "Materiál",
  cihly: "Cihly",
  pytle: "Pytle",
  tyce: "Tyče / armatura",
  desky: "Desky / překližky",
  trubky: "Trubky / profily",
};

const state = {
  apiBase: localStorage.getItem("apiBase") || "",
  file: null,
  lastResult: null,
};

/* ---------- Pomocné prvky ---------- */
const $ = (id) => document.getElementById(id);
const preview = $("preview");
const placeholder = $("placeholder");
const countBtn = $("countBtn");
const resultBox = $("result");

/* ---------- Přepínání obrazovek (taby) ---------- */
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
    document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
    tab.classList.add("active");
    $("view-" + tab.dataset.view).classList.add("active");
    if (tab.dataset.view === "history") renderHistory();
  });
});

/* ---------- Pořízení fotky ---------- */
$("cameraBtn").addEventListener("click", () => $("cameraInput").click());
$("galleryBtn").addEventListener("click", () => $("galleryInput").click());
$("cameraInput").addEventListener("change", onPhotoPicked);
$("galleryInput").addEventListener("change", onPhotoPicked);

function onPhotoPicked(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  state.file = file;
  const url = URL.createObjectURL(file);
  preview.src = url;
  preview.hidden = false;
  placeholder.hidden = true;
  countBtn.disabled = false;
  resultBox.hidden = true;
}

/* ---------- Spočítání ---------- */
countBtn.addEventListener("click", async () => {
  if (!state.file) return;
  const material = $("materialSelect").value;
  setLoading(true);
  try {
    const result = state.apiBase
      ? await countViaApi(state.file, material)
      : await countDemo(material);
    state.lastResult = result;
    renderResult(result);
  } catch (err) {
    toast("Chyba: " + err.message);
  } finally {
    setLoading(false);
  }
});

/* Ostrý režim – pošle fotku na backend */
async function countViaApi(file, material) {
  const fd = new FormData();
  fd.append("image", file);
  fd.append("material", material);
  const res = await fetch(state.apiBase.replace(/\/$/, "") + "/api/count", {
    method: "POST",
    body: fd,
  });
  if (!res.ok) throw new Error("server vrátil " + res.status);
  return await res.json(); // { total, items:[{class,count}], material, timestamp, image_url? }
}

/* Demo režim – vymyslí počty, ať je appka funkční bez serveru */
async function countDemo(material) {
  await new Promise((r) => setTimeout(r, 700)); // ať je vidět spinner
  const classes =
    material === "auto"
      ? ["cihly", "pytle", "tyce"]
      : [material];
  const items = classes.map((c) => ({
    class: MATERIAL_LABELS[c] || c,
    count: 5 + Math.floor(Math.random() * 40),
  }));
  const total = items.reduce((s, i) => s + i.count, 0);
  return {
    total,
    items,
    material,
    demo: true,
    timestamp: new Date().toISOString(),
    image: preview.src,
  };
}

/* ---------- Vykreslení výsledku ---------- */
function renderResult(r) {
  $("resultTotal").textContent = r.total;
  const list = $("resultList");
  list.innerHTML = "";
  (r.items || []).forEach((it) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${it.class}</span><span class="cnt">${it.count}</span>`;
    list.appendChild(li);
  });
  $("resultMeta").textContent = r.demo
    ? "⚠️ Demo režim – počty jsou ukázkové (model neběží)."
    : "Spočítáno modelem • " + formatTime(r.timestamp);
  resultBox.hidden = false;
  resultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/* ---------- Uložení / nová fotka ---------- */
$("saveBtn").addEventListener("click", async () => {
  if (!state.lastResult) return;
  const rec = {
    id: Date.now(),
    material: state.lastResult.material,
    materialLabel: MATERIAL_LABELS[state.lastResult.material] || "Materiál",
    total: state.lastResult.total,
    items: state.lastResult.items,
    timestamp: state.lastResult.timestamp,
    image: state.lastResult.image || preview.src,
  };
  // V ostrém režimu backend ukládá sám; tady navíc držíme lokální historii.
  saveHistoryLocal(rec);
  toast("Uloženo ✓");
});

$("againBtn").addEventListener("click", resetForm);

function resetForm() {
  state.file = null;
  state.lastResult = null;
  preview.hidden = true;
  placeholder.hidden = false;
  countBtn.disabled = true;
  resultBox.hidden = true;
  $("cameraInput").value = "";
  $("galleryInput").value = "";
}

/* ---------- Historie ---------- */
function saveHistoryLocal(rec) {
  const list = getHistoryLocal();
  list.unshift(rec);
  localStorage.setItem("history", JSON.stringify(list.slice(0, 100)));
}
function getHistoryLocal() {
  try { return JSON.parse(localStorage.getItem("history") || "[]"); }
  catch { return []; }
}

async function renderHistory() {
  let items = [];
  if (state.apiBase) {
    try {
      const res = await fetch(state.apiBase.replace(/\/$/, "") + "/api/history");
      if (res.ok) items = await res.json();
    } catch { /* spadneme na lokální */ }
  }
  if (!items.length) items = getHistoryLocal();

  const list = $("historyList");
  list.innerHTML = "";
  $("historyEmpty").hidden = items.length > 0;

  items.forEach((rec) => {
    const li = document.createElement("li");
    li.className = "history-item";
    li.innerHTML = `
      <img class="history-thumb" src="${rec.image || rec.image_url || "icon.svg"}" alt="" />
      <div class="history-info">
        <div class="h-mat">${rec.materialLabel || MATERIAL_LABELS[rec.material] || "Materiál"}</div>
        <div class="h-time">${formatTime(rec.timestamp)}</div>
      </div>
      <div class="history-count">${rec.total}</div>`;
    list.appendChild(li);
  });
}

/* ---------- Nastavení (adresa serveru) ---------- */
const dialog = $("settingsDialog");
$("settingsBtn").addEventListener("click", () => {
  $("apiBaseInput").value = state.apiBase;
  dialog.showModal();
});
$("closeSettingsBtn").addEventListener("click", () => dialog.close());
$("saveSettingsBtn").addEventListener("click", () => {
  state.apiBase = $("apiBaseInput").value.trim();
  localStorage.setItem("apiBase", state.apiBase);
  dialog.close();
  toast(state.apiBase ? "Server nastaven ✓" : "Demo režim");
});

/* ---------- Drobnosti ---------- */
function setLoading(on) {
  countBtn.disabled = on;
  countBtn.innerHTML = on ? '<span class="spinner"></span>Počítám…' : "Spočítat";
}
function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => (t.hidden = true), 2200);
}
function formatTime(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString("cs-CZ", { day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch { return ""; }
}

/* ---------- PWA service worker ---------- */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  });
}
