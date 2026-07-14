// TARS – logika v prohlížeči: Zápisník, Lidé, Přehled a Chat.

// PWA: zaregistruj service worker (funguje na localhost/https; jinde tiše přeskočí)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}));
}

// ---- odkazy na prvky ----
const statusDot = document.getElementById("statusDot");
const statusText = document.getElementById("statusText");

// zápisník
const noteInput = document.getElementById("noteInput");
const saveNoteBtn = document.getElementById("saveNoteBtn");
const attachBtn = document.getElementById("attachBtn");
const fileInput = document.getElementById("fileInput");
const uploading = document.getElementById("uploading");
const captureResult = document.getElementById("captureResult");
const entriesEl = document.getElementById("entries");
const entrySearch = document.getElementById("entrySearch");

// lidé
const personName = document.getElementById("personName");
const personInfo = document.getElementById("personInfo");
const savePersonBtn = document.getElementById("savePersonBtn");
const peopleEl = document.getElementById("people");

// přehled
const stNotes = document.getElementById("stNotes");
const stFiles = document.getElementById("stFiles");
const stPeople = document.getElementById("stPeople");
const briefBtn = document.getElementById("briefBtn");
const briefingEl = document.getElementById("briefing");
const reindexBtn = document.getElementById("reindexBtn");
const reindexHint = document.getElementById("reindexHint");

// chat
const chatEl = document.getElementById("chat");
const emptyEl = document.getElementById("empty");
const formEl = document.getElementById("composer");
const inputEl = document.getElementById("input");
const sendEl = document.getElementById("send");

// ==================== ZÁLOŽKY ====================
const views = {
  notes: document.getElementById("view-notes"),
  people: document.getElementById("view-people"),
  calendar: document.getElementById("view-calendar"),
  overview: document.getElementById("view-overview"),
  chat: document.getElementById("view-chat"),
};
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    const which = tab.dataset.view;
    for (const [name, el] of Object.entries(views)) el.hidden = name !== which;
    document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t === tab));
    if (which === "chat") inputEl.focus();
    if (which === "notes") loadEntries();
    if (which === "people") loadPeople();
    if (which === "calendar") loadCalendar();
    if (which === "overview") loadStats();
  });
});

// ==================== STAV PŘIPOJENÍ ====================
async function checkHealth() {
  try {
    const j = await (await fetch("/api/health")).json();
    statusDot.className = "dot ok";
    statusText.textContent = j.model || "připraveno";
  } catch {
    statusDot.className = "dot err";
    statusText.textContent = "server neběží";
  }
}
checkHealth();

// ==================== POMOCNÉ ====================
function fmtDate(iso) {
  return new Date(iso).toLocaleString("cs-CZ", {
    day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit",
  });
}
function fmtSize(b) {
  if (b < 1024) return b + " B";
  if (b < 1024 * 1024) return Math.round(b / 1024) + " kB";
  return (b / 1024 / 1024).toFixed(1) + " MB";
}

// obecné čtení NDJSON proudu (řádek = JSON), volá onObj pro každý objekt
async function readNdjson(res, onObj) {
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop();
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        onObj(JSON.parse(line));
      } catch {
        /* neúplný řádek */
      }
    }
  }
}

// ==================== ZÁPISNÍK ====================
function renderEntry(e) {
  const row = document.createElement("div");
  row.className = "entry " + e.type;

  const ico = document.createElement("div");
  ico.className = "ico";
  ico.textContent = e.type === "note" ? "✎" : "📎";

  const body = document.createElement("div");
  body.className = "body";
  const main = document.createElement(e.type === "file" ? "a" : "div");
  main.className = "main";
  if (e.type === "file") {
    main.textContent = e.name;
    main.href = "/api/file?id=" + encodeURIComponent(e.id);
    main.target = "_blank";
    main.rel = "noopener";
  } else {
    main.textContent = e.preview || "(prázdná)";
  }
  const meta = document.createElement("div");
  meta.className = "meta";
  meta.textContent = fmtDate(e.date) + (e.type === "file" ? " · " + fmtSize(e.size) : "");
  body.appendChild(main);
  body.appendChild(meta);
  // tvůj popisek k souboru
  if (e.type === "file" && e.caption) {
    const cp = document.createElement("div");
    cp.className = "meta caption";
    cp.textContent = "📝 " + e.caption;
    body.appendChild(cp);
  }
  // u přečtené fotky ukaž náhled textu
  if (e.type === "file" && e.read && e.readSnippet) {
    const rd = document.createElement("div");
    rd.className = "meta read";
    rd.textContent = "📷 " + e.readSnippet + "…";
    body.appendChild(rd);
  }
  // fotku se nepodařilo přečíst
  if (e.type === "file" && e.readError) {
    const w = document.createElement("div");
    w.className = "meta read-err";
    w.textContent = "⚠ Fotku se nepodařilo přečíst — je stažený model na čtení? (config.json)";
    body.appendChild(w);
  }

  const del = document.createElement("button");
  del.className = "del";
  del.textContent = "✕";
  del.addEventListener("click", () => deleteEntry(e, row, loadEntries));

  row.appendChild(ico);
  row.appendChild(body);
  if (e.type === "note") row.appendChild(reclassifyButton({ type: "note", id: e.id }));
  row.appendChild(del);
  return row;
}

// odstraň diakritiku a malá písmena (kvůli hledání)
function normStr(s) {
  return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// text, ve kterém záznam hledáme (obsah + datum v různých podobách)
function entrySearchText(e) {
  const d = new Date(e.date);
  return normStr(
    [
      e.preview || "",
      e.name || "",
      e.caption || "",
      e.readSnippet || "",
      fmtDate(e.date),
      d.toLocaleDateString("cs-CZ", { day: "numeric", month: "long", year: "numeric" }),
      e.date, // ISO (2026-07-14)
    ].join(" ")
  );
}

let allEntries = [];

function renderEntriesList() {
  const q = normStr(entrySearch.value.trim());
  entriesEl.innerHTML = "";
  if (!allEntries.length) {
    entriesEl.innerHTML = '<p class="hint">Zatím nic uloženého. Nadiktuj něco nebo přidej soubor.</p>';
    return;
  }
  const list = q ? allEntries.filter((e) => entrySearchText(e).includes(q)) : allEntries;
  if (!list.length) {
    entriesEl.innerHTML = '<p class="hint">Nic nenalezeno.</p>';
    return;
  }
  for (const e of list) entriesEl.appendChild(renderEntry(e));
}

async function loadEntries() {
  try {
    const { entries } = await (await fetch("/api/entries")).json();
    allEntries = entries;
    renderEntriesList();
  } catch {
    entriesEl.innerHTML = '<p class="hint">Nepodařilo se načíst uložené (běží server?).</p>';
  }
}
entrySearch.addEventListener("input", renderEntriesList);
loadEntries();

// české skloňování počtu
function plural(n, one, few, many) {
  return n === 1 ? one : n >= 2 && n <= 4 ? few : many;
}

// shrnutí, co chytrý záznam uložil a kam
function summarizeSaved(saved) {
  const notes = saved.filter((s) => s.type === "note").length;
  const people = saved.filter((s) => s.type === "person").map((s) => s.label);
  const events = saved.filter((s) => s.type === "event").map((s) => s.label);
  const parts = [];
  if (notes) parts.push(notes + " " + plural(notes, "poznámka", "poznámky", "poznámek"));
  if (people.length) parts.push("do Lidí: " + people.join(", "));
  if (events.length) parts.push("do Kalendáře: " + events.join(", "));
  return parts.length ? "✓ Uloženo — " + parts.join(" · ") : "Nic k uložení.";
}

// CHYTRÝ ZÁZNAM – fronta: klepneš Ulož, pole se HNED uvolní a zpracování běží
// na pozadí. Můžeš rovnou psát a ukládat další; zpracovává se jedno po druhém.
const captureQueue = [];
let captureWorking = false;
let lastCaptureSummary = "";

function updateCaptureStatus() {
  const pending = captureQueue.length + (captureWorking ? 1 : 0);
  if (pending > 0) {
    captureResult.hidden = false;
    captureResult.textContent =
      "⏳ Ukládám a zařazuji…" + (pending > 1 ? " (" + pending + " ve frontě)" : "");
  } else {
    captureResult.hidden = !lastCaptureSummary;
    captureResult.textContent = lastCaptureSummary || "";
  }
}

async function processCaptureQueue() {
  if (captureWorking) return; // pracuje se – další položky se přiberou z fronty
  captureWorking = true;
  while (captureQueue.length) {
    const text = captureQueue.shift();
    updateCaptureStatus();
    try {
      const res = await fetch("/api/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error || "chyba");
      lastCaptureSummary = summarizeSaved(j.saved || []);
      await loadEntries();
    } catch (err) {
      lastCaptureSummary = "⚠ Nepodařilo se uložit: " + (err.message || err);
    }
  }
  captureWorking = false;
  updateCaptureStatus();
}

saveNoteBtn.addEventListener("click", () => {
  const text = noteInput.value.trim();
  if (!text) return noteInput.focus();
  captureQueue.push(text); // do fronty
  noteInput.value = ""; // pole je hned volné pro další zápis
  noteInput.focus();
  updateCaptureStatus();
  processCaptureQueue(); // rozjede zpracování, když zrovna neběží
});

attachBtn.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", async () => {
  const files = Array.from(fileInput.files || []);
  if (!files.length) return;
  // text napsaný nahoře se přiloží k souboru jako popisek
  const caption = noteInput.value.trim();
  uploading.hidden = false;
  let done = 0;
  let anyReading = false;
  for (const file of files) {
    uploading.textContent = "Nahrávám " + (done + 1) + "/" + files.length + ": " + file.name + "…";
    try {
      const q = "/api/upload?name=" + encodeURIComponent(file.name) + (caption ? "&caption=" + encodeURIComponent(caption) : "");
      const res = await fetch(q, { method: "POST", body: file });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error || "chyba");
      if (j.reading) anyReading = true;
      done++;
    } catch (err) {
      uploading.textContent = "Chyba u " + file.name + ": " + (err.message || err);
      await new Promise((r) => setTimeout(r, 2500));
    }
  }
  fileInput.value = "";
  if (caption) noteInput.value = ""; // popisek se použil, pole uvolníme
  uploading.hidden = true;
  await loadEntries();
  captureResult.hidden = false;
  if (anyReading) {
    captureResult.textContent = caption
      ? "📷 Fotka uložena s popisem — čtu ji na pozadí (později obnov seznam)."
      : "📷 Fotku čtu na pozadí… za chvíli bude text v paměti (později obnov seznam).";
  } else {
    captureResult.textContent = caption ? "✓ Soubor uložen s popisem." : "✓ Soubor uložen.";
  }
});

// smaž záznam (poznámka/soubor/člověk)
async function deleteEntry(e, row, reload) {
  const label = e.type === "note" ? "poznámku" : e.type === "person" ? e.name : e.name;
  if (!confirm("Smazat " + label + "?")) return;
  try {
    const res = await fetch("/api/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: e.type, id: e.id }),
    });
    if (!res.ok) throw new Error("chyba");
    row.remove();
    if (reload && !row.parentElement) reload();
  } catch {
    alert("Nepodařilo se smazat.");
  }
}

// ==================== UČENÍ Z OPRAV (přeřazení) ====================
// Obnov všechny seznamy (položka se přesune mezi Záznamem / Lidmi / Kalendářem)
function refreshAll() {
  loadEntries();
  loadPeople();
  loadCalendar();
  loadStats();
}

const RECLASS_LABELS = { note: "Poznámky", person: "Lidí", event: "Kalendáře" };

// tlačítko „přeřadit" pro položku { type, id }
function reclassifyButton(entry) {
  const b = document.createElement("button");
  b.className = "reclass";
  b.textContent = "↦";
  b.title = "Přeřadit (a naučit TARS)";
  b.addEventListener("click", (ev) => {
    ev.stopPropagation();
    openReclassify(entry, b.closest(".entry, .day-event"));
  });
  return b;
}

function openReclassify(entry, rowEl) {
  document.querySelectorAll(".reclass-panel").forEach((p) => p.remove());
  const panel = document.createElement("div");
  panel.className = "reclass-panel";
  const q = document.createElement("div");
  q.className = "reclass-q";
  q.textContent = "Kam to vlastně patří?";
  panel.appendChild(q);
  const choices = document.createElement("div");
  choices.className = "reclass-choices";
  for (const t of ["note", "person", "event"]) {
    if (t === entry.type) continue;
    const b = document.createElement("button");
    b.className = "reclass-choice";
    b.textContent = "→ " + RECLASS_LABELS[t];
    b.addEventListener("click", () => chooseTarget(entry, t, panel));
    choices.appendChild(b);
  }
  panel.appendChild(choices);
  rowEl.insertAdjacentElement("afterend", panel);
}

function mkOk(fn) {
  const b = document.createElement("button");
  b.className = "reclass-choice ok";
  b.textContent = "OK";
  b.addEventListener("click", fn);
  return b;
}

function chooseTarget(entry, toType, panel) {
  if (toType === "note") return doReclassify(entry, "note", {}, panel);
  panel.innerHTML = "";
  const wrap = document.createElement("div");
  wrap.className = "reclass-form";
  if (toType === "person") {
    const inp = document.createElement("input");
    inp.type = "text";
    inp.placeholder = "Jméno";
    inp.className = "reclass-input";
    wrap.appendChild(inp);
    wrap.appendChild(mkOk(() => (inp.value.trim() ? doReclassify(entry, "person", { name: inp.value.trim() }, panel) : inp.focus())));
    panel.appendChild(wrap);
    inp.focus();
  } else if (toType === "event") {
    const dt = document.createElement("input");
    dt.type = "date";
    dt.className = "reclass-input";
    const tm = document.createElement("input");
    tm.type = "time";
    tm.className = "reclass-input";
    wrap.appendChild(dt);
    wrap.appendChild(tm);
    wrap.appendChild(mkOk(() => (dt.value ? doReclassify(entry, "event", { date: dt.value, time: tm.value }, panel) : dt.focus())));
    panel.appendChild(wrap);
  }
}

async function doReclassify(entry, toType, extra, panel) {
  panel.innerHTML = '<div class="reclass-q">Přeřazuji a učím se…</div>';
  try {
    const res = await fetch("/api/reclassify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromType: entry.type, id: entry.id, toType, ...extra }),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(j.error || "chyba");
    panel.remove();
    refreshAll();
  } catch (err) {
    panel.innerHTML = '<div class="reclass-q">⚠ ' + (err.message || err) + "</div>";
  }
}

// ==================== LIDÉ ====================
function renderPerson(p) {
  const row = document.createElement("div");
  row.className = "entry person";

  const ico = document.createElement("div");
  ico.className = "ico";
  ico.textContent = "👤";

  const body = document.createElement("div");
  body.className = "body";
  const main = document.createElement("div");
  main.className = "main";
  main.textContent = p.name;
  const meta = document.createElement("div");
  meta.className = "meta";
  meta.textContent = p.info ? p.info : "(bez popisu)";
  body.appendChild(main);
  body.appendChild(meta);

  const del = document.createElement("button");
  del.className = "del";
  del.textContent = "✕";
  del.addEventListener("click", () =>
    deleteEntry({ type: "person", id: p.id, name: p.name }, row, loadPeople)
  );

  row.appendChild(ico);
  row.appendChild(body);
  row.appendChild(reclassifyButton({ type: "person", id: p.id }));
  row.appendChild(del);
  return row;
}

async function loadPeople() {
  try {
    const { people } = await (await fetch("/api/people")).json();
    peopleEl.innerHTML = "";
    if (!people.length) {
      peopleEl.innerHTML = '<p class="hint">Zatím žádní lidé. Přidej někoho výše.</p>';
      return;
    }
    for (const p of people) peopleEl.appendChild(renderPerson(p));
  } catch {
    peopleEl.innerHTML = '<p class="hint">Nepodařilo se načíst lidi.</p>';
  }
}

savePersonBtn.addEventListener("click", async () => {
  const name = personName.value.trim();
  const info = personInfo.value.trim();
  if (!name) return personName.focus();
  savePersonBtn.disabled = true;
  try {
    const res = await fetch("/api/people", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, info }),
    });
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "chyba");
    personName.value = "";
    personInfo.value = "";
    await loadPeople();
  } catch (err) {
    alert("Nepodařilo se uložit: " + (err.message || err));
  } finally {
    savePersonBtn.disabled = false;
  }
});

// ==================== KALENDÁŘ ====================
const calGrid = document.getElementById("calGrid");
const calTitle = document.getElementById("calTitle");
const dayPanel = document.getElementById("dayPanel");

function pad2(n) {
  return String(n).padStart(2, "0");
}
function ymd(y, m, d) {
  return y + "-" + pad2(m + 1) + "-" + pad2(d);
}

const _today = new Date();
let calYear = _today.getFullYear();
let calMonth = _today.getMonth(); // 0–11
let calSelected = ymd(_today.getFullYear(), _today.getMonth(), _today.getDate());
let calEvents = [];

document.getElementById("calPrev").addEventListener("click", () => shiftMonth(-1));
document.getElementById("calNext").addEventListener("click", () => shiftMonth(1));
function shiftMonth(delta) {
  calMonth += delta;
  if (calMonth < 0) { calMonth = 11; calYear--; }
  if (calMonth > 11) { calMonth = 0; calYear++; }
  renderCalendar();
}

async function loadCalendar() {
  try {
    const { events } = await (await fetch("/api/events")).json();
    calEvents = events || [];
  } catch {
    calEvents = [];
  }
  renderCalendar();
}

function renderCalendar() {
  const first = new Date(calYear, calMonth, 1);
  calTitle.textContent = first.toLocaleDateString("cs-CZ", { month: "long", year: "numeric" });
  const startWd = (first.getDay() + 6) % 7; // pondělí = 0
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const todayStr = ymd(_today.getFullYear(), _today.getMonth(), _today.getDate());
  const withEvents = new Set(calEvents.map((e) => e.date));

  calGrid.innerHTML = "";
  for (let i = 0; i < startWd; i++) {
    const c = document.createElement("div");
    c.className = "cal-day empty";
    calGrid.appendChild(c);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const ds = ymd(calYear, calMonth, d);
    const cell = document.createElement("div");
    cell.className = "cal-day";
    if (ds === todayStr) cell.classList.add("today");
    if (ds === calSelected) cell.classList.add("selected");
    cell.textContent = d;
    if (withEvents.has(ds)) {
      const dot = document.createElement("span");
      dot.className = "ev-dot";
      cell.appendChild(dot);
    }
    cell.addEventListener("click", () => {
      calSelected = ds;
      renderCalendar();
    });
    calGrid.appendChild(cell);
  }
  renderDayPanel();
}

function renderDayPanel() {
  dayPanel.innerHTML = "";
  const title = document.createElement("div");
  title.className = "day-title";
  title.textContent = new Date(calSelected + "T00:00:00").toLocaleDateString("cs-CZ", {
    weekday: "long", day: "numeric", month: "long",
  });
  dayPanel.appendChild(title);

  const dayEvents = calEvents
    .filter((e) => e.date === calSelected)
    .sort((a, b) => (a.time || "99:99").localeCompare(b.time || "99:99"));

  for (const e of dayEvents) {
    const row = document.createElement("div");
    row.className = "day-event";
    const t = document.createElement("span");
    t.className = "time";
    t.textContent = e.time || "—";
    const ttl = document.createElement("span");
    ttl.className = "ttl";
    ttl.textContent = e.title;
    const del = document.createElement("button");
    del.className = "del";
    del.textContent = "✕";
    del.addEventListener("click", async () => {
      if (!confirm("Smazat událost?")) return;
      await fetch("/api/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "event", id: e.id }),
      }).catch(() => {});
      await loadCalendar();
    });
    row.appendChild(t);
    row.appendChild(ttl);
    row.appendChild(reclassifyButton({ type: "event", id: e.id }));
    row.appendChild(del);
    dayPanel.appendChild(row);
  }

  // formulář pro ruční přidání události k vybranému dni
  const add = document.createElement("div");
  add.className = "add-event";
  const time = document.createElement("input");
  time.type = "time";
  const ttl = document.createElement("input");
  ttl.type = "text";
  ttl.placeholder = "Název události";
  const btn = document.createElement("button");
  btn.textContent = "Přidat";
  btn.addEventListener("click", async () => {
    const t = ttl.value.trim();
    if (!t) return ttl.focus();
    btn.disabled = true;
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: t, date: calSelected, time: time.value }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "chyba");
      ttl.value = "";
      time.value = "";
      await loadCalendar();
    } catch (err) {
      alert("Nepodařilo se přidat: " + (err.message || err));
    } finally {
      btn.disabled = false;
    }
  });
  add.appendChild(time);
  add.appendChild(ttl);
  add.appendChild(btn);
  dayPanel.appendChild(add);
}

// ==================== PŘEHLED ====================
async function loadStats() {
  try {
    const [{ entries }, { people }] = await Promise.all([
      (await fetch("/api/entries")).json(),
      (await fetch("/api/people")).json(),
    ]);
    stNotes.textContent = entries.filter((e) => e.type === "note").length;
    stFiles.textContent = entries.filter((e) => e.type === "file").length;
    stPeople.textContent = people.length;
  } catch {
    stNotes.textContent = stFiles.textContent = stPeople.textContent = "–";
  }
}

briefBtn.addEventListener("click", async () => {
  briefBtn.disabled = true;
  briefingEl.className = "briefing card";
  briefingEl.textContent = "Připravuji přehled…";
  let out = "";
  try {
    const res = await fetch("/api/briefing", { method: "POST" });
    const ctype = res.headers.get("Content-Type") || "";
    if (!res.ok || ctype.includes("application/json")) {
      const j = await res.json().catch(() => ({}));
      throw new Error(j.error || "chyba");
    }
    await readNdjson(res, (obj) => {
      if (obj.message && obj.message.content) {
        out += obj.message.content;
        briefingEl.textContent = out;
      }
    });
    if (!out.trim()) briefingEl.textContent = "Model nevrátil přehled.";
  } catch (err) {
    briefingEl.textContent = "⚠ " + (err.message || err);
  } finally {
    briefBtn.disabled = false;
  }
});

reindexBtn.addEventListener("click", async () => {
  reindexBtn.disabled = true;
  reindexHint.textContent = "Obnovuji paměť…";
  try {
    const j = await (await fetch("/api/reindex", { method: "POST" })).json();
    reindexHint.textContent = "Hotovo: " + j.indexed + " položek v paměti (" + j.chunks + " kousků).";
  } catch {
    reindexHint.textContent = "Nepodařilo se (běží Ollama a embedding model?).";
  } finally {
    reindexBtn.disabled = false;
  }
});

// ==================== CHAT ====================
const history = [];
let busy = false;

function addBubble(role, text) {
  if (emptyEl && emptyEl.parentElement) emptyEl.remove();
  const div = document.createElement("div");
  div.className = "msg " + role;
  div.textContent = text || "";
  chatEl.appendChild(div);
  chatEl.scrollTop = chatEl.scrollHeight;
  return div;
}

function addSources(sources) {
  if (!sources || !sources.length) return;
  const box = document.createElement("div");
  box.className = "sources collapsed"; // ve výchozím stavu sbalené

  // fotky ukážeme jako náhledy (klepnutím se otevřou celé) – bez duplicit
  const seen = new Set();
  const images = sources.filter((s) => s.isImage && s.refId && !seen.has(s.refId) && seen.add(s.refId));
  if (images.length) {
    const imgRow = document.createElement("div");
    imgRow.className = "src-images";
    for (const s of images) {
      const a = document.createElement("a");
      a.href = "/api/file?id=" + encodeURIComponent(s.refId);
      a.target = "_blank";
      a.rel = "noopener";
      a.className = "src-thumb";
      const img = document.createElement("img");
      img.src = "/api/file?id=" + encodeURIComponent(s.refId);
      img.loading = "lazy";
      img.alt = s.name || "fotka";
      a.appendChild(img);
      imgRow.appendChild(a);
    }
    box.appendChild(imgRow);
  }

  const toggle = document.createElement("button");
  toggle.className = "src-toggle";
  toggle.textContent = "📎 Odkud to mám (" + sources.length + ")";
  toggle.addEventListener("click", () => box.classList.toggle("collapsed"));
  box.appendChild(toggle);

  const list = document.createElement("div");
  list.className = "src-list";
  for (const s of sources) {
    const el = document.createElement("div");
    el.className = "source";
    el.innerHTML = "<b></b><span></span>";
    el.querySelector("b").textContent =
      (s.name || "poznámka") + " · " + new Date(s.date).toLocaleDateString("cs-CZ") + " — ";
    el.querySelector("span").textContent = s.snippet + "…";
    list.appendChild(el);
  }
  box.appendChild(list);

  chatEl.appendChild(box);
  chatEl.scrollTop = chatEl.scrollHeight;
}

function autosize() {
  inputEl.style.height = "auto";
  inputEl.style.height = Math.min(inputEl.scrollHeight, 140) + "px";
}
inputEl.addEventListener("input", autosize);
inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    formEl.requestSubmit();
  }
});

formEl.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = inputEl.value.trim();
  if (!text || busy) return;

  busy = true;
  sendEl.disabled = true;
  addBubble("user", text);
  history.push({ role: "user", content: text });
  inputEl.value = "";
  autosize();

  const bot = addBubble("bot", "");
  bot.classList.add("pending");
  let answer = "";
  let sources = null;

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history }),
    });
    const ctype = res.headers.get("Content-Type") || "";
    if (!res.ok || ctype.includes("application/json")) {
      const j = await res.json().catch(() => ({}));
      throw new Error(j.error || "Neznámá chyba serveru.");
    }
    await readNdjson(res, (obj) => {
      if (obj.sources) {
        sources = obj.sources;
      } else if (obj.message && obj.message.content) {
        answer += obj.message.content;
        bot.textContent = answer;
        chatEl.scrollTop = chatEl.scrollHeight;
      }
    });

    bot.classList.remove("pending");
    if (answer.trim()) {
      if (sources) addSources(sources);
      history.push({ role: "assistant", content: answer });
    } else {
      bot.remove();
      addBubble("error", "Model nevrátil žádnou odpověď.");
    }
  } catch (err) {
    bot.remove();
    addBubble("error", "⚠ " + (err.message || String(err)));
    statusDot.className = "dot err";
  } finally {
    busy = false;
    sendEl.disabled = false;
    inputEl.focus();
  }
});
