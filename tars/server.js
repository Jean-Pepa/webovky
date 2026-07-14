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
const EMBED_MODEL = process.env.EMBED_MODEL || "nomic-embed-text";
// jak moc musí být poznámka podobná dotazu, aby ji chat použil (0–1). Nižší = ochotnější.
const MEMORY_MIN_SCORE = Number(process.env.MEMORY_MIN_SCORE || 0.5);

const SYSTEM_PROMPT =
  "Jsi TARS, osobní asistent Kristiána. Odpovídáš česky, stručně a k věci. " +
  "Když něco nevíš, řekneš to narovinu. Jsi věcný, klidný a spolehlivý.";

const PUBLIC_DIR = path.join(__dirname, "public");
const DATA_DIR = path.join(__dirname, "data");
const NOTES_DIR = path.join(DATA_DIR, "notes");
const UPLOADS_DIR = path.join(DATA_DIR, "uploads");
const PEOPLE_DIR = path.join(DATA_DIR, "people");

// založ složky na data, když ještě nejsou
for (const dir of [DATA_DIR, NOTES_DIR, UPLOADS_DIR, PEOPLE_DIR]) {
  fs.mkdirSync(dir, { recursive: true });
}

// ==== PAMĚŤ (RAG) ====
// Jednoduchý lokální index: pole záznamů { refType, refId, name, date, chunk, vector }.
// Uložený v jednom souboru data/index.json. Pro osobní objem dat úplně stačí.
const INDEX_FILE = path.join(DATA_DIR, "index.json");
let INDEX = [];
try {
  if (fs.existsSync(INDEX_FILE)) INDEX = JSON.parse(fs.readFileSync(INDEX_FILE, "utf-8"));
} catch {
  INDEX = [];
}
function saveIndex() {
  try {
    fs.writeFileSync(INDEX_FILE, JSON.stringify(INDEX), "utf-8");
  } catch (e) {
    console.warn("  ! nepodařilo se uložit index:", e.message);
  }
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
  ".webmanifest": "application/manifest+json; charset=utf-8",
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

// ==== PAMĚŤ: pomocné funkce ==================================================

// spočítej embedding textu přes Ollamu (model nomic-embed-text).
// kind "document" = ukládaná poznámka, "query" = dotaz. Prefixy doporučuje
// nomic-embed-text a znatelně zlepšují, co se v paměti najde.
async function embed(text, kind = "document") {
  const prefix = kind === "query" ? "search_query: " : "search_document: ";
  const r = await fetch(`${OLLAMA_URL}/api/embeddings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: EMBED_MODEL, prompt: prefix + text }),
  });
  if (!r.ok) throw new Error("embeddings HTTP " + r.status);
  const j = await r.json();
  if (!Array.isArray(j.embedding)) throw new Error("embeddings: chybí vektor");
  return j.embedding;
}

// rozděl delší text na kousky (~800 znaků) s malým překryvem
function chunkText(text, size = 800, overlap = 120) {
  const clean = String(text || "").trim();
  if (clean.length <= size) return clean ? [clean] : [];
  const chunks = [];
  let i = 0;
  while (i < clean.length) {
    chunks.push(clean.slice(i, i + size));
    i += size - overlap;
  }
  return chunks;
}

// kosinová podobnost dvou vektorů
function cosine(a, b) {
  let dot = 0, na = 0, nb = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return na && nb ? dot / (Math.sqrt(na) * Math.sqrt(nb)) : 0;
}

// zaindexuj jeden zdroj (poznámku nebo textový soubor); tiše přeskoč při chybě
async function indexRef({ refType, refId, name, date, text }) {
  const chunks = chunkText(text);
  if (!chunks.length) return { ok: false, reason: "prázdný text" };
  try {
    // nejdřív odeber staré záznamy stejného zdroje (kdyby se přeindexovával)
    removeFromIndex(refType, refId);
    for (const chunk of chunks) {
      const vector = await embed(chunk);
      INDEX.push({ refType, refId, name, date, chunk, vector });
    }
    saveIndex();
    return { ok: true, chunks: chunks.length };
  } catch (e) {
    return { ok: false, reason: e.message };
  }
}

// odeber zdroj z indexu
function removeFromIndex(refType, refId) {
  const before = INDEX.length;
  INDEX = INDEX.filter((x) => !(x.refType === refType && x.refId === refId));
  if (INDEX.length !== before) saveIndex();
}

// najdi nejbližší kousky k dotazu
async function searchIndex(question, k = 5) {
  if (!INDEX.length) return [];
  const qv = await embed(question, "query");
  return INDEX.map((x) => ({ ...x, score: cosine(qv, x.vector) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}

// je soubor textový (umíme z něj číst pro paměť)?
function isTextFile(name) {
  return /\.(txt|md|markdown|csv|log|json)$/i.test(name || "");
}

// --- Tunel do Ollamy: /api/chat (paměť běží automaticky) ---------------------
async function handleChat(req, res) {
  const body = await readBody(req);
  let messages;
  try {
    const parsed = JSON.parse(body || "{}");
    messages = Array.isArray(parsed.messages) ? parsed.messages : [];
  } catch {
    return sendJson(res, 400, { error: "Neplatný JSON." });
  }

  // paměť: k poslednímu dotazu najdi relevantní poznámky (nad prahem podobnosti)
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  let hits = [];
  if (lastUser && INDEX.length) {
    try {
      const found = await searchIndex(String(lastUser.content || ""), 5);
      hits = found.filter((h) => h.score >= MEMORY_MIN_SCORE);
    } catch {
      hits = []; // embed model nedostupný → chat pojede normálně, bez paměti
    }
  }

  let system = SYSTEM_PROMPT;
  if (hits.length) {
    const context = hits
      .map((h, i) => `[${i + 1}] (${h.name}, ${new Date(h.date).toLocaleString("cs-CZ")}):\n${h.chunk}`)
      .join("\n\n");
    system +=
      "\n\nNíže jsou poznámky uživatele, které MOHOU souviset s dotazem. Použij je, " +
      "pokud pomáhají odpovědět; pokud nesouvisí, ignoruj je a odpověz z obecných znalostí.\n\n" +
      "=== POZNÁMKY ===\n" + context;
  }

  const fullMessages = [{ role: "system", content: system }, ...messages];

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
    // když paměť něco našla, pošli nejdřív zdroje (appka je ukáže pod odpovědí)
    if (hits.length) {
      const sources = hits.map((h) => ({
        refType: h.refType,
        refId: h.refId,
        name: h.name,
        date: h.date,
        score: Math.round(h.score * 100) / 100,
        snippet: h.chunk.slice(0, 120),
      }));
      res.write(JSON.stringify({ sources }) + "\n");
    }
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

  // zkus poznámku vložit do paměti (když embed model neběží, poznámka se přesto uloží)
  const mem = await indexRef({
    refType: "note",
    refId: id,
    name: "poznámka",
    date: new Date().toISOString(),
    text,
  });

  sendJson(res, 200, { ok: true, id, memory: mem.ok });
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
  out.on("finish", async () => {
    // textové soubory vložíme do paměti (obrázky/PDF zatím ne – ty umíme jen uložit)
    let memory = false;
    if (isTextFile(original)) {
      try {
        const text = fs.readFileSync(dest, "utf-8");
        const mem = await indexRef({
          refType: "file",
          refId: id,
          name: original,
          date: new Date().toISOString(),
          text,
        });
        memory = mem.ok;
      } catch {
        /* zaindexování je jen bonus – když selže, soubor je stejně uložený */
      }
    }
    sendJson(res, 200, { ok: true, id, name: original, memory });
  });
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
  const dir =
    type === "note" ? NOTES_DIR : type === "file" ? UPLOADS_DIR : type === "person" ? PEOPLE_DIR : null;
  if (!dir) return sendJson(res, 400, { error: "Neznámý typ." });
  const full = insideDir(dir, id);
  if (!full || !fs.existsSync(full)) return sendJson(res, 404, { error: "Nenalezeno." });
  fs.unlinkSync(full);
  removeFromIndex(type, id); // odeber i z paměti
  sendJson(res, 200, { ok: true });
}

// --- Lidé: ulož člověka ------------------------------------------------------
async function handleSavePerson(req, res) {
  const body = await readBody(req);
  let name, info;
  try {
    const j = JSON.parse(body || "{}");
    name = String(j.name || "").trim();
    info = String(j.info || "").trim();
  } catch {
    return sendJson(res, 400, { error: "Neplatný JSON." });
  }
  if (!name) return sendJson(res, 400, { error: "Chybí jméno." });

  const id = stamp() + ".json";
  const date = new Date().toISOString();
  fs.writeFileSync(path.join(PEOPLE_DIR, id), JSON.stringify({ name, info, date }), "utf-8");

  // vlož do paměti (jméno + info), ať se dá na člověka ptát i v chatu
  const mem = await indexRef({
    refType: "person",
    refId: id,
    name: name,
    date,
    text: "Osoba: " + name + "\n" + info,
  });

  sendJson(res, 200, { ok: true, id, memory: mem.ok });
}

// --- Lidé: seznam -----------------------------------------------------------
function handlePeople(req, res) {
  const people = [];
  for (const f of fs.readdirSync(PEOPLE_DIR)) {
    if (!f.endsWith(".json")) continue;
    try {
      const p = JSON.parse(fs.readFileSync(path.join(PEOPLE_DIR, f), "utf-8"));
      people.push({ id: f, name: p.name, info: p.info || "", date: p.date });
    } catch {
      /* poškozený soubor přeskoč */
    }
  }
  people.sort((a, b) => a.name.localeCompare(b.name, "cs"));
  sendJson(res, 200, { people });
}

// --- Přehled: shrň poslední poznámky do denního přehledu ---------------------
async function handleBriefing(req, res) {
  // posbírej poznámky za posledních 24 h; když nic, vezmi posledních 8
  const now = Date.now();
  const DAY = 24 * 60 * 60 * 1000;
  let notes = fs
    .readdirSync(NOTES_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const full = path.join(NOTES_DIR, f);
      const st = fs.statSync(full);
      return { text: fs.readFileSync(full, "utf-8"), date: st.mtime };
    })
    .sort((a, b) => b.date - a.date);

  const recent = notes.filter((n) => now - n.date.getTime() <= DAY);
  const used = recent.length ? recent : notes.slice(0, 8);

  if (!used.length) {
    return sendJson(res, 200, { empty: true, error: "Zatím nemáš žádné poznámky k přehledu." });
  }

  const listing = used
    .map((n) => "- (" + n.date.toLocaleString("cs-CZ") + ") " + n.text.replace(/\s+/g, " ").slice(0, 300))
    .join("\n");

  const sys =
    "Jsi TARS, osobní asistent Kristiána. Z následujících poznámek vytvoř krátký, " +
    "přehledný souhrn dne v češtině: co je důležité, co je potřeba udělat a na co " +
    "nezapomenout. Použij krátké odrážky. Nevymýšlej si nic, co v poznámkách není.";

  try {
    const ollamaRes = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [
          { role: "system", content: sys },
          { role: "user", content: "Mé poznámky:\n" + listing },
        ],
        stream: true,
      }),
    });
    if (!ollamaRes.ok || !ollamaRes.body) {
      return sendJson(res, 502, { error: "Ollama chyba (" + ollamaRes.status + ")." });
    }
    res.writeHead(200, { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-cache" });
    res.write(JSON.stringify({ meta: { count: used.length, span: recent.length ? "24h" : "poslední" } }) + "\n");
    for await (const chunk of ollamaRes.body) res.write(chunk);
    res.end();
  } catch (err) {
    sendJson(res, 502, {
      error: "Nepodařilo se spojit s Ollamou. Detail: " + (err && err.message ? err.message : String(err)),
    });
  }
}

// --- Paměť: přeindexuj všechna už uložená data -------------------------------
async function handleReindex(req, res) {
  INDEX = [];
  let ok = 0, fail = 0;

  for (const f of fs.readdirSync(NOTES_DIR)) {
    if (!f.endsWith(".md")) continue;
    const text = fs.readFileSync(path.join(NOTES_DIR, f), "utf-8");
    const st = fs.statSync(path.join(NOTES_DIR, f));
    const r = await indexRef({ refType: "note", refId: f, name: "poznámka", date: st.mtime.toISOString(), text });
    r.ok ? ok++ : fail++;
  }
  for (const f of fs.readdirSync(UPLOADS_DIR)) {
    const name = f.replace(/^[^_]+__/, "");
    if (!isTextFile(name)) continue;
    const text = fs.readFileSync(path.join(UPLOADS_DIR, f), "utf-8");
    const st = fs.statSync(path.join(UPLOADS_DIR, f));
    const r = await indexRef({ refType: "file", refId: f, name, date: st.mtime.toISOString(), text });
    r.ok ? ok++ : fail++;
  }
  for (const f of fs.readdirSync(PEOPLE_DIR)) {
    if (!f.endsWith(".json")) continue;
    try {
      const p = JSON.parse(fs.readFileSync(path.join(PEOPLE_DIR, f), "utf-8"));
      const r = await indexRef({
        refType: "person",
        refId: f,
        name: p.name,
        date: p.date || new Date().toISOString(),
        text: "Osoba: " + p.name + "\n" + (p.info || ""),
      });
      r.ok ? ok++ : fail++;
    } catch {
      fail++;
    }
  }

  saveIndex();
  sendJson(res, 200, { ok: true, indexed: ok, failed: fail, chunks: INDEX.length });
}

// --- Router ------------------------------------------------------------------
const server = http.createServer((req, res) => {
  const pathname = req.url.split("?")[0];

  if (req.method === "POST" && pathname === "/api/chat") return handleChat(req, res);
  if (req.method === "POST" && pathname === "/api/notes") return handleSaveNote(req, res);
  if (req.method === "POST" && pathname === "/api/upload") return handleUpload(req, res);
  if (req.method === "POST" && pathname === "/api/delete") return handleDelete(req, res);
  if (req.method === "POST" && pathname === "/api/people") return handleSavePerson(req, res);
  if (req.method === "POST" && pathname === "/api/briefing") return handleBriefing(req, res);
  if (req.method === "POST" && pathname === "/api/reindex") return handleReindex(req, res);
  if (req.method === "GET" && pathname === "/api/people") return handlePeople(req, res);
  if (req.method === "GET" && pathname === "/api/entries") return handleEntries(req, res);
  if (req.method === "GET" && pathname === "/api/note") return handleGetNote(req, res);
  if (req.method === "GET" && pathname === "/api/file") return handleGetFile(req, res);
  if (req.method === "GET" && pathname === "/api/health") {
    return sendJson(res, 200, {
      ok: true,
      model: OLLAMA_MODEL,
      ollama: OLLAMA_URL,
      embedModel: EMBED_MODEL,
      memoryChunks: INDEX.length,
    });
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
