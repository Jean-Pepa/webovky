// TARS – logika v prohlížeči: zápisník (poznámky + soubory) a chat.

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
const entriesHint = document.getElementById("entriesHint");

// chat
const chatEl = document.getElementById("chat");
const emptyEl = document.getElementById("empty");
const formEl = document.getElementById("composer");
const inputEl = document.getElementById("input");
const sendEl = document.getElementById("send");

// ==================== ZÁLOŽKY ====================
const views = {
  notes: document.getElementById("view-notes"),
  chat: document.getElementById("view-chat"),
};
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    const which = tab.dataset.view;
    for (const [name, el] of Object.entries(views)) el.hidden = name !== which;
    document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t === tab));
    if (which === "chat") inputEl.focus();
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

// ==================== ZÁPISNÍK ====================

// hezký formát data/času
function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString("cs-CZ", {
    day: "numeric",
    month: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function fmtSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + " kB";
  return (bytes / 1024 / 1024).toFixed(1) + " MB";
}

// vykresli jeden záznam (poznámka nebo soubor)
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
  del.title = "Smazat";
  del.addEventListener("click", () => deleteEntry(e, row));

  row.appendChild(ico);
  row.appendChild(body);
  row.appendChild(del);
  return row;
}

// načti seznam ze serveru a vykresli
async function loadEntries() {
  try {
    const { entries } = await (await fetch("/api/entries")).json();
    entriesEl.innerHTML = "";
    if (!entries.length) {
      const p = document.createElement("p");
      p.className = "hint";
      p.textContent = "Zatím nic uloženého. Napiš poznámku nebo přidej soubor.";
      entriesEl.appendChild(p);
      return;
    }
    for (const e of entries) entriesEl.appendChild(renderEntry(e));
  } catch {
    entriesEl.innerHTML = "";
    const p = document.createElement("p");
    p.className = "hint";
    p.textContent = "Nepodařilo se načíst uložené (běží server?).";
    entriesEl.appendChild(p);
  }
}
loadEntries();

// ulož poznámku
saveNoteBtn.addEventListener("click", async () => {
  const text = noteInput.value.trim();
  if (!text) {
    noteInput.focus();
    return;
  }
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

// tlačítko "+ Soubor" otevře výběr souborů
attachBtn.addEventListener("click", () => fileInput.click());

// nahraj vybrané soubory (jeden po druhém, raw tělo – bez knihoven)
fileInput.addEventListener("change", async () => {
  const files = Array.from(fileInput.files || []);
  if (!files.length) return;
  uploading.hidden = false;

  let done = 0;
  for (const file of files) {
    uploading.textContent = "Nahrávám " + (done + 1) + "/" + files.length + ": " + file.name + "…";
    try {
      const res = await fetch("/api/upload?name=" + encodeURIComponent(file.name), {
        method: "POST",
        body: file, // raw obsah souboru
      });
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

// smaž záznam
async function deleteEntry(e, row) {
  if (!confirm("Smazat " + (e.type === "note" ? "poznámku" : e.name) + "?")) return;
  try {
    const res = await fetch("/api/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: e.type, id: e.id }),
    });
    if (!res.ok) throw new Error("chyba");
    row.remove();
    if (!entriesEl.querySelector(".entry")) loadEntries();
  } catch {
    alert("Nepodařilo se smazat.");
  }
}

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
          const obj = JSON.parse(line);
          if (obj.message && obj.message.content) {
            answer += obj.message.content;
            bot.textContent = answer;
            chatEl.scrollTop = chatEl.scrollHeight;
          }
        } catch {
          /* neúplný řádek */
        }
      }
    }

    bot.classList.remove("pending");
    if (answer.trim()) {
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
