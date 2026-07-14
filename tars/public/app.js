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
const entriesEl = document.getElementById("entries");

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
  overview: document.getElementById("view-overview"),
  chat: document.getElementById("view-chat"),
};
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    const which = tab.dataset.view;
    for (const [name, el] of Object.entries(views)) el.hidden = name !== which;
    document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t === tab));
    if (which === "chat") inputEl.focus();
    if (which === "people") loadPeople();
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

  const del = document.createElement("button");
  del.className = "del";
  del.textContent = "✕";
  del.addEventListener("click", () => deleteEntry(e, row, loadEntries));

  row.appendChild(ico);
  row.appendChild(body);
  row.appendChild(del);
  return row;
}

async function loadEntries() {
  try {
    const { entries } = await (await fetch("/api/entries")).json();
    entriesEl.innerHTML = "";
    if (!entries.length) {
      entriesEl.innerHTML = '<p class="hint">Zatím nic uloženého. Napiš poznámku nebo přidej soubor.</p>';
      return;
    }
    for (const e of entries) entriesEl.appendChild(renderEntry(e));
  } catch {
    entriesEl.innerHTML = '<p class="hint">Nepodařilo se načíst uložené (běží server?).</p>';
  }
}
loadEntries();

saveNoteBtn.addEventListener("click", async () => {
  const text = noteInput.value.trim();
  if (!text) return noteInput.focus();
  saveNoteBtn.disabled = true;
  try {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "chyba");
    noteInput.value = "";
    await loadEntries();
  } catch (err) {
    alert("Poznámku se nepodařilo uložit: " + (err.message || err));
  } finally {
    saveNoteBtn.disabled = false;
  }
});

attachBtn.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", async () => {
  const files = Array.from(fileInput.files || []);
  if (!files.length) return;
  uploading.hidden = false;
  let done = 0;
  for (const file of files) {
    uploading.textContent = "Nahrávám " + (done + 1) + "/" + files.length + ": " + file.name + "…";
    try {
      const res = await fetch("/api/upload?name=" + encodeURIComponent(file.name), { method: "POST", body: file });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "chyba");
      done++;
    } catch (err) {
      uploading.textContent = "Chyba u " + file.name + ": " + (err.message || err);
      await new Promise((r) => setTimeout(r, 2500));
    }
  }
  fileInput.value = "";
  uploading.hidden = true;
  await loadEntries();
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
  box.className = "sources";
  const title = document.createElement("div");
  title.className = "src-title";
  title.textContent = "Z poznámek:";
  box.appendChild(title);
  for (const s of sources) {
    const el = document.createElement("div");
    el.className = "source";
    el.innerHTML = "<b></b><span></span>";
    el.querySelector("b").textContent =
      (s.name || "poznámka") + " · " + new Date(s.date).toLocaleDateString("cs-CZ") + " — ";
    el.querySelector("span").textContent = s.snippet + "…";
    box.appendChild(el);
  }
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
