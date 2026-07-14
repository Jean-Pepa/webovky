// TARS – logika chatu v prohlížeči.
// Drží historii konverzace a mluví se serverem přes /api/chat.

const chatEl = document.getElementById("chat");
const emptyEl = document.getElementById("empty");
const formEl = document.getElementById("composer");
const inputEl = document.getElementById("input");
const sendEl = document.getElementById("send");
const statusDot = document.getElementById("statusDot");
const statusText = document.getElementById("statusText");

// celá historie konverzace – posílá se pokaždé, aby si model pamatoval kontext
const history = [];
let busy = false;

// --- pomocné: přidání bubliny do chatu ---
function addBubble(role, text) {
  if (emptyEl) emptyEl.remove();
  const div = document.createElement("div");
  div.className = "msg " + role;
  div.textContent = text || "";
  chatEl.appendChild(div);
  scrollDown();
  return div;
}

function scrollDown() {
  chatEl.scrollTop = chatEl.scrollHeight;
}

// --- automatická výška pole na psaní ---
function autosize() {
  inputEl.style.height = "auto";
  inputEl.style.height = Math.min(inputEl.scrollHeight, 140) + "px";
}
inputEl.addEventListener("input", autosize);

// Enter = odeslat, Shift+Enter = nový řádek (na desktopu).
inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    formEl.requestSubmit();
  }
});

// --- kontrola, jestli je server + Ollama naživu ---
async function checkHealth() {
  try {
    const r = await fetch("/api/health");
    const j = await r.json();
    statusDot.className = "dot ok";
    statusText.textContent = j.model || "připraveno";
  } catch {
    statusDot.className = "dot err";
    statusText.textContent = "server neběží";
  }
}
checkHealth();

// --- odeslání zprávy ---
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

    // server mohl vrátit chybu jako JSON (Ollama neběží apod.)
    const ctype = res.headers.get("Content-Type") || "";
    if (!res.ok || ctype.includes("application/json")) {
      const j = await res.json().catch(() => ({}));
      throw new Error(j.error || "Neznámá chyba serveru.");
    }

    // čteme proud odpovědi (NDJSON – jeden JSON na řádek)
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n");
      buffer = lines.pop(); // poslední (možná neúplný) řádek necháme do příště

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const obj = JSON.parse(line);
          if (obj.message && obj.message.content) {
            answer += obj.message.content;
            bot.textContent = answer;
            scrollDown();
          }
        } catch {
          /* neúplný řádek ignorujeme */
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
