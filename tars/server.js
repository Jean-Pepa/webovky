// TARS – malý lokální server, který propojí tvůj mobil s PC (a Ollamou).
//
// Co umí:
//   1) servíruje webovou appku (složka public/) – chat i zápisník
//   2) tunel /api/chat  – posílá zprávy do Ollamy a streamuje odpověď
//   3) zápisník – ukládá poznámky a soubory z telefonu na disk PC:
//        POST /api/notes     – ulož textovou poznámku
//        POST /api/upload    – nahraj soubor (raw tělo, jméno v ?name=)
//        GET  /api/entries   – seznam všeho (poznámky + soubory), nejnovější první
//        GET  /api/note?id=  – celý text jedné poznámky
//        GET  /api/file?id=  – stáhni/zobraz nahraný soubor
//        POST /api/delete    – smaž položku ({type, id})
//
// Vše se ukládá LOKÁLNĚ do složky tars/data/ na tvém počítači.
//
// Spuštění:  node server.js
// Nastavení (nepovinné):
//   PORT (8787), OLLAMA_URL (http://localhost:11434), OLLAMA_MODEL (qwen2.5:7b)

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 8787;
const OLLAMA_URL = (process.env.OLLAMA_URL || "http://localhost:11434").replace(/\/$/, "");
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "qwen2.5:7b";

const SYSTEM_PROMPT =
  "Jsi TARS, osobní asistent Kristiána. Odpovídáš česky, stručně a k věci. " +
  "Když něco nevíš, řekneš to narovinu. Jsi věcný, klidný a spolehlivý.";

const PUBLIC_DIR = path.join(__dirname, "public");
const DATA_DIR = path.join(__dirname, "data");
const NOTES_DIR = path.join(DATA_DIR, "notes");
const UPLOADS_DIR = path.join(DATA_DIR, "uploads");

// založ složky na data, když ještě nejsou
for (const dir of [DATA_DIR, NOTES_DIR, UPLOADS_DIR]) {
  fs.mkdirSync(dir, { recursive: true });
}

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".pdf": "application/pdf",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".mp3": "audio/mpeg",
  ".m4a": "audio/mp4",
  ".wav": "audio/wav",
  ".ico": "image/x-icon",
  ".json": "application/json; charset=utf-8",
};

function sendJson(res, status, obj) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(obj));
}

// vyčistí jméno souboru – žádné lomítka, žádné ".." (ochrana proti úniku ze složky)
function safeName(name) {
  return String(name || "")
    .replace(/[\/\\]/g, "_")
    .replace(/\.\.+/g, "_")
    .replace(new RegExp("[\\x00-\\x1f]", "g"), "")
    .slice(0, 200)
    .trim();
}

// časová značka do jména souboru: 2026-07-14T12-30-05-123Z
function stamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

// ověří, že cílová cesta zůstala uvnitř povolené složky
function insideDir(dir, name) {
  const p = path.join(dir, name);
  return p.startsWith(dir + path.sep) ? p : null;
}

// --- Servírování statických souborů (webová appka) ---------------------------
function serveStatic(req, res) {
  let urlPath = decodeURIComponent(req.url.split("?")[0]);
  if (urlPath === "/") urlPath = "/index.html";
  const filePath = path.join(PUBLIC_DIR, path.normalize(urlPath));
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403).end("Zakázáno");
    return;
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Nenalezeno");
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(data);
  });
}

// načte celé tělo požadavku jako text
function readBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => resolve(body));
  });
}

// --- Tunel do Ollamy: /api/chat ---------------------------------------------
async function handleChat(req, res) {
  const body = await readBody(req);
  let messages;
  try {
    const parsed = JSON.parse(body || "{}");
    messages = Array.isArray(parsed.messages) ? parsed.messages : [];
  } catch {
    return sendJson(res, 400, { error: "Neplatný JSON." });
  }

  const fullMessages = [{ role: "system", content: SYSTEM_PROMPT }, ...messages];

  try {
    const ollamaRes = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: OLLAMA_MODEL, messages: fullMessages, stream: true }),
    });

    if (!ollamaRes.ok || !ollamaRes.body) {
      const text = await ollamaRes.text().catch(() => "");
      return sendJson(res, 502, {
        error:
          "Ollama odpověděla chybou (" + ollamaRes.status + "). Běží Ollama? Je stažený model '" +
          OLLAMA_MODEL + "'? " + text.slice(0, 300),
      });
    }

    res.writeHead(200, {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache",
    });
    for await (const chunk of ollamaRes.body) res.write(chunk);
    res.end();
  } catch (err) {
    sendJson(res, 502, {
      error:
        "Nepodařilo se spojit s Ollamou na " + OLLAMA_URL +
        ". Zkontroluj, že Ollama běží (příkaz: ollama serve). Detail: " +
        (err && err.message ? err.message : String(err)),
    });
  }
}

// --- Zápisník: ulož poznámku -------------------------------------------------
async function handleSaveNote(req, res) {
  const body = await readBody(req);
  let text;
  try {
    text = String(JSON.parse(body || "{}").text || "").trim();
  } catch {
    return sendJson(res, 400, { error: "Neplatný JSON." });
  }
  if (!text) return sendJson(res, 400, { error: "Prázdná poznámka." });

  const id = stamp() + ".md";
  fs.writeFileSync(path.join(NOTES_DIR, id), text, "utf-8");
  sendJson(res, 200, { ok: true, id });
}

// --- Zápisník: nahraj soubor (raw tělo, jméno v ?name=) ----------------------
function handleUpload(req, res) {
  const url = new URL(req.url, "http://x");
  const original = safeName(url.searchParams.get("name") || "soubor");
  const id = stamp() + "__" + original;
  const dest = insideDir(UPLOADS_DIR, id);
  if (!dest) return sendJson(res, 400, { error: "Špatné jméno souboru." });

  const out = fs.createWriteStream(dest);
  req.pipe(out);
  out.on("finish", () => sendJson(res, 200, { ok: true, id, name: original }));
  out.on("error", () => sendJson(res, 500, { error: "Nepodařilo se uložit soubor." }));
}

// --- Zápisník: seznam všeho (poznámky + soubory) -----------------------------
function handleEntries(req, res) {
  const entries = [];

  for (const f of fs.readdirSync(NOTES_DIR)) {
    if (!f.endsWith(".md")) continue;
    const full = path.join(NOTES_DIR, f);
    const st = fs.statSync(full);
    const text = fs.readFileSync(full, "utf-8");
    entries.push({
      type: "note",
      id: f,
      preview: text.replace(/\s+/g, " ").slice(0, 140),
      date: st.mtime.toISOString(),
    });
  }

  for (const f of fs.readdirSync(UPLOADS_DIR)) {
    const full = path.join(UPLOADS_DIR, f);
    const st = fs.statSync(full);
    entries.push({
      type: "file",
      id: f,
      name: f.replace(/^[^_]+__/, ""), // zpět původní jméno (bez časové předpony)
      size: st.size,
      date: st.mtime.toISOString(),
    });
  }

  entries.sort((a, b) => (a.date < b.date ? 1 : -1)); // nejnovější první
  sendJson(res, 200, { entries });
}

// --- Zápisník: celý text jedné poznámky --------------------------------------
function handleGetNote(req, res) {
  const id = safeName(new URL(req.url, "http://x").searchParams.get("id"));
  const full = insideDir(NOTES_DIR, id);
  if (!full || !fs.existsSync(full)) return sendJson(res, 404, { error: "Poznámka nenalezena." });
  sendJson(res, 200, { id, text: fs.readFileSync(full, "utf-8") });
}

// --- Zápisník: stáhni/zobraz nahraný soubor ----------------------------------
function handleGetFile(req, res) {
  const id = safeName(new URL(req.url, "http://x").searchParams.get("id"));
  const full = insideDir(UPLOADS_DIR, id);
  if (!full || !fs.existsSync(full)) {
    res.writeHead(404).end("Nenalezeno");
    return;
  }
  const ext = path.extname(full).toLowerCase();
  res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
  fs.createReadStream(full).pipe(res);
}

// --- Zápisník: smaž položku --------------------------------------------------
async function handleDelete(req, res) {
  const body = await readBody(req);
  let type, id;
  try {
    const j = JSON.parse(body || "{}");
    type = j.type;
    id = safeName(j.id);
  } catch {
    return sendJson(res, 400, { error: "Neplatný JSON." });
  }
  const dir = type === "note" ? NOTES_DIR : type === "file" ? UPLOADS_DIR : null;
  if (!dir) return sendJson(res, 400, { error: "Neznámý typ." });
  const full = insideDir(dir, id);
  if (!full || !fs.existsSync(full)) return sendJson(res, 404, { error: "Nenalezeno." });
  fs.unlinkSync(full);
  sendJson(res, 200, { ok: true });
}

// --- Router ------------------------------------------------------------------
const server = http.createServer((req, res) => {
  const pathname = req.url.split("?")[0];

  if (req.method === "POST" && pathname === "/api/chat") return handleChat(req, res);
  if (req.method === "POST" && pathname === "/api/notes") return handleSaveNote(req, res);
  if (req.method === "POST" && pathname === "/api/upload") return handleUpload(req, res);
  if (req.method === "POST" && pathname === "/api/delete") return handleDelete(req, res);
  if (req.method === "GET" && pathname === "/api/entries") return handleEntries(req, res);
  if (req.method === "GET" && pathname === "/api/note") return handleGetNote(req, res);
  if (req.method === "GET" && pathname === "/api/file") return handleGetFile(req, res);
  if (req.method === "GET" && pathname === "/api/health") {
    return sendJson(res, 200, { ok: true, model: OLLAMA_MODEL, ollama: OLLAMA_URL });
  }
  return serveStatic(req, res);
});

server.listen(PORT, "0.0.0.0", () => {
  console.log("");
  console.log("  TARS běží ✦");
  console.log("  ─────────────────────────────────────────────");
  console.log("  Na PC otevři:         http://localhost:" + PORT);
  console.log("  Z mobilu (Tailscale): http://<adresa-tvého-PC>:" + PORT);
  console.log("  Model:                " + OLLAMA_MODEL);
  console.log("  Data se ukládají do:  " + DATA_DIR);
  console.log("  ─────────────────────────────────────────────");
  console.log("  Zastavení: Ctrl + C");
  console.log("");
});
