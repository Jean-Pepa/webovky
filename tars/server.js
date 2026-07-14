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
// volitelný soubor tars/config.json může přepsat výchozí nastavení (např. model na čtení fotek)
let CONFIG = {};
try {
  const cfgPath = require("path").join(__dirname, "config.json");
  if (require("fs").existsSync(cfgPath)) CONFIG = JSON.parse(require("fs").readFileSync(cfgPath, "utf-8"));
} catch (e) {
  console.warn("  ! config.json se nepodařilo načíst:", e.message);
}

const OLLAMA_MODEL = process.env.OLLAMA_MODEL || CONFIG.OLLAMA_MODEL || "qwen2.5:7b";
const EMBED_MODEL = process.env.EMBED_MODEL || CONFIG.EMBED_MODEL || "nomic-embed-text";
// model, který "vidí" obrázky (čtení textu z fotek). Přepiš v config.json (VISION_MODEL).
const VISION_MODEL = process.env.VISION_MODEL || CONFIG.VISION_MODEL || "llava";
// jak moc musí být poznámka podobná dotazu, aby ji chat použil (0–1). Nižší = ochotnější.
const MEMORY_MIN_SCORE = Number(process.env.MEMORY_MIN_SCORE || CONFIG.MEMORY_MIN_SCORE || 0.3);

const SYSTEM_PROMPT =
  "Jsi TARS, osobní asistent Kristiána. Odpovídáš česky, stručně a k věci. " +
  "Když něco nevíš, řekneš to narovinu. Jsi věcný, klidný a spolehlivý.";

// "třídič" pro chytrý záznam: rozdělí nadiktovaný text na jednotlivé položky
// a každou zařadí buď jako osobu, nebo jako poznámku.
const CLASSIFY_SYS =
  "Jsi třídič poznámek. Uživatel nadiktuje text. Rozděl ho na jednotlivé " +
  "samostatné záznamy a každý zařaď. Vrať POUZE JSON ve tvaru " +
  '{"items":[...]}. Každá položka je buď osoba, nebo poznámka:\n' +
  '- osoba (konkrétní člověk – kdo to je, vztah, kontakt): ' +
  '{"type":"person","name":"jméno","info":"co si o něm pamatovat"}\n' +
  '- událost (má konkrétní datum/čas – schůzka, termín, narozeniny): ' +
  '{"type":"event","title":"název","date":"RRRR-MM-DD","time":"HH:MM"} (time nepovinné)\n' +
  '- poznámka (úkol, myšlenka, cokoliv ostatního): {"type":"note","text":"text poznámky"}\n' +
  "U události převeď relativní datum (dnes, zítra, ve čtvrtek) na konkrétní " +
  "RRRR-MM-DD podle dnešního data, které dostaneš. " +
  "Neztrať žádnou informaci. Zachovej jazyk uživatele (češtinu). " +
  "Když je to jen jedna věc, vrať pole s jednou položkou.";

const PUBLIC_DIR = path.join(__dirname, "public");
const DATA_DIR = path.join(__dirname, "data");
const NOTES_DIR = path.join(DATA_DIR, "notes");
const UPLOADS_DIR = path.join(DATA_DIR, "uploads");
const PEOPLE_DIR = path.join(DATA_DIR, "people");
const EVENTS_DIR = path.join(DATA_DIR, "events");
const OCR_DIR = path.join(DATA_DIR, "ocr"); // přečtený text z fotek (podle id souboru)
const CAPTIONS_DIR = path.join(DATA_DIR, "captions"); // tvůj popisek k souboru (podle id)

// založ složky na data, když ještě nejsou
for (const dir of [DATA_DIR, NOTES_DIR, UPLOADS_DIR, PEOPLE_DIR, EVENTS_DIR, OCR_DIR, CAPTIONS_DIR]) {
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

// ==== UČENÍ Z OPRAV ====
// Když uživatel něco přeřadí (opraví zařazení), uložíme "lekci": text → správný typ.
// Lekce pak vkládáme do třídiče jako příklady, ať se u podobných textů drží tvých oprav.
const LESSONS_FILE = path.join(DATA_DIR, "lessons.json");
let LESSONS = [];
try {
  if (fs.existsSync(LESSONS_FILE)) LESSONS = JSON.parse(fs.readFileSync(LESSONS_FILE, "utf-8"));
} catch {
  LESSONS = [];
}
function saveLessons() {
  try {
    fs.writeFileSync(LESSONS_FILE, JSON.stringify(LESSONS), "utf-8");
  } catch (e) {
    console.warn("  ! nepodařilo se uložit lekce:", e.message);
  }
}

let RECLASS_SEQ = 0; // aby se jména nekřížila ve stejné milisekundě

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

// je soubor obrázek (umíme z něj přečíst text přes vision model)?
function isImageFile(name) {
  return /\.(jpg|jpeg|png|webp|gif|heic)$/i.test(name || "");
}

// přečti text z obrázku „vidoucím" modelem v Ollamě (llava apod.)
async function readImage(filePath) {
  const b64 = fs.readFileSync(filePath).toString("base64");
  const r = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: VISION_MODEL,
      prompt:
        "Přepiš PŘESNĚ všechen text z obrázku, řádek po řádku, tak jak je. Neprekládej, " +
        "nedomýšlej a nic nepřidávej. Zachovej čísla a jednotky. Vrať jen ten text, bez " +
        "úvodu a komentářů. Když na obrázku žádný text není, stručně popiš, co na něm je.",
      images: [b64],
      stream: false,
    }),
  });
  if (!r.ok) throw new Error("vision HTTP " + r.status);
  const j = await r.json();
  return String(j.response || "").trim();
}

// slož text souboru pro paměť: tvůj popisek + (obsah textového souboru NEBO text z fotky)
function fileCombinedText(id, name) {
  const parts = [];
  const cap = path.join(CAPTIONS_DIR, id + ".txt");
  if (fs.existsSync(cap)) parts.push("Popis: " + fs.readFileSync(cap, "utf-8").trim());
  if (isTextFile(name)) {
    const f = insideDir(UPLOADS_DIR, id);
    if (f && fs.existsSync(f)) parts.push(fs.readFileSync(f, "utf-8"));
  } else {
    const ocr = path.join(OCR_DIR, id + ".txt");
    if (fs.existsSync(ocr)) parts.push(fs.readFileSync(ocr, "utf-8"));
  }
  return parts.filter((p) => p && p.trim()).join("\n\n").trim();
}

// zaindexuj soubor (popisek + obsah/OCR) do paměti
async function indexFile(id, name) {
  const text = fileCombinedText(id, name);
  if (!text) return { ok: false };
  return indexRef({ refType: "file", refId: id, name, date: new Date().toISOString(), text });
}

// přečti obrázek, ulož text a přeindexuj (i s popiskem). Běží na pozadí po nahrání.
async function readImageAndIndex(id, name) {
  const filePath = insideDir(UPLOADS_DIR, id);
  if (!filePath || !fs.existsSync(filePath)) return;
  const errPath = path.join(OCR_DIR, id + ".err");
  try {
    const text = await readImage(filePath);
    if (text) fs.writeFileSync(path.join(OCR_DIR, id + ".txt"), text, "utf-8");
    if (fs.existsSync(errPath)) fs.unlinkSync(errPath);
    await indexFile(id, name);
  } catch (e) {
    // zapiš značku „nepřečteno", ať to appka umí ukázat (ne potichu)
    fs.writeFileSync(errPath, String((e && e.message) || e), "utf-8");
    throw e;
  }
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
      const found = await searchIndex(String(lastUser.content || ""), 8);
      hits = found.filter((h) => h.score >= MEMORY_MIN_SCORE);
    } catch {
      hits = []; // embed model nedostupný
    }
  }

  // STRIKTNÍ REŽIM: TARS odpovídá jen z tvých poznámek. Když nic relevantního
  // nenajde, řekne to narovinu – nic si nevymýšlí.
  if (!hits.length) {
    const msg = INDEX.length
      ? "To k tomu ve svých poznámkách nemám. Zkus se zeptat jinak, nebo se mrkni do Záznamu."
      : "Ještě nemáš uložené žádné poznámky. Ulož něco do Záznamu a pak se ptej.";
    res.writeHead(200, { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-cache" });
    res.write(JSON.stringify({ message: { content: msg } }) + "\n");
    res.write(JSON.stringify({ done: true }) + "\n");
    res.end();
    return;
  }

  const context = hits
    .map((h, i) => `[${i + 1}] (${h.name}, ${new Date(h.date).toLocaleString("cs-CZ")}):\n${h.chunk}`)
    .join("\n\n");
  const system =
    SYSTEM_PROMPT +
    "\n\nODPOVÍDEJ POUZE na základě těchto poznámek uživatele. Nedoplňuj nic z " +
    "obecných znalostí a nic si nevymýšlej. Z poznámek MŮŽEŠ vypsat nebo shrnout, co " +
    "v nich je (např. z receptu vypsat suroviny, co koupit), ale NIKDY nedoplňuj " +
    "konkrétní čísla, množství, suroviny ani kroky, které v poznámkách nejsou. " +
    "Pokud poznámky jen zmiňují, že existuje nějaká fotka nebo soubor (třeba jen název " +
    "typu recept na X), ale neobsahují její skutečný obsah, NEPOPISUJ obsah a NEVYMÝŠLEJ " +
    "ho — napiš, že " +
    "obsah té fotky nemáš přečtený. Když je text z poznámek nejasný nebo neúplný, řekni " +
    "to narovinu a nedomýšlej. Když k dotazu v poznámkách nic není, napiš krátce, že o " +
    "tom nemáš data. Čísla, jména a data uváděj přesně tak, jak jsou v poznámkách." +
    "\n\n=== POZNÁMKY ===\n" + context;

  const fullMessages = [{ role: "system", content: system }, ...messages];

  try {
    const ollamaRes = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: fullMessages,
        stream: true,
        options: { temperature: 0.1 }, // co nejmíň „kreativity" = míň vymýšlení
      }),
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
    // nejdřív pošli zdroje (appka je ukáže sbalené, na rozkliknutí)
    const sources = hits.map((h) => ({
      refType: h.refType,
      refId: h.refId,
      name: h.name,
      date: h.date,
      score: Math.round(h.score * 100) / 100,
      snippet: h.chunk.slice(0, 120),
      isImage: h.refType === "file" && isImageFile(h.name),
    }));
    res.write(JSON.stringify({ sources }) + "\n");
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

// --- Chytrý záznam: nadiktuj cokoliv, model to rozřadí do složek --------------
async function handleCapture(req, res) {
  const body = await readBody(req);
  let text;
  try {
    text = String(JSON.parse(body || "{}").text || "").trim();
  } catch {
    return sendJson(res, 400, { error: "Neplatný JSON." });
  }
  if (!text) return sendJson(res, 400, { error: "Prázdný text." });

  // nech model rozdělit a zařadit (JSON režim = spolehlivé parsování)
  let items = null;
  try {
    const r = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        format: "json",
        stream: false,
        messages: [
          {
            role: "system",
            content:
              CLASSIFY_SYS +
              "\nDnes je " +
              new Date().toLocaleDateString("cs-CZ", { weekday: "long", year: "numeric", month: "2-digit", day: "2-digit" }) +
              " (" + new Date().toISOString().slice(0, 10) + ")." +
              lessonsHint(),
          },
          { role: "user", content: text },
        ],
      }),
    });
    if (r.ok) {
      const j = await r.json();
      const parsed = JSON.parse(j.message.content);
      items = Array.isArray(parsed) ? parsed : parsed.items;
    }
  } catch {
    items = null; // model nedostupný / špatný JSON → spadneme na fallback níže
  }

  // pojistka: když třídění selže, ulož celý text jako jednu poznámku (nic neztratit)
  if (!Array.isArray(items) || !items.length) {
    items = [{ type: "note", text }];
  }

  const saved = [];
  let i = 0;
  for (const it of items.slice(0, 20)) {
    const suffix = "-" + i++; // aby se jména souborů nekřížila ve stejné milisekundě
    if (it && it.type === "person" && String(it.name || "").trim()) {
      const id = stamp() + suffix + ".json";
      const date = new Date().toISOString();
      const name = String(it.name).trim();
      const info = String(it.info || "").trim();
      fs.writeFileSync(path.join(PEOPLE_DIR, id), JSON.stringify({ name, info, date }), "utf-8");
      await indexRef({ refType: "person", refId: id, name, date, text: "Osoba: " + name + "\n" + info });
      saved.push({ type: "person", label: name });
    } else if (it && it.type === "event" && String(it.title || "").trim() && /^\d{4}-\d{2}-\d{2}$/.test(it.date || "")) {
      const id = stamp() + suffix + ".json";
      const ev = await saveEvent(id, it.title, it.date, it.time);
      saved.push({ type: "event", label: ev.title + " (" + ev.date + (ev.time ? " " + ev.time : "") + ")" });
    } else {
      // poznámka – i „událost bez data" sem spadne (vezmeme text i title, nic neztratíme)
      const t = String((it && (it.text || it.title)) || "").trim();
      if (!t) continue;
      const id = stamp() + suffix + ".md";
      fs.writeFileSync(path.join(NOTES_DIR, id), t, "utf-8");
      await indexRef({ refType: "note", refId: id, name: "poznámka", date: new Date().toISOString(), text: t });
      saved.push({ type: "note", label: t.slice(0, 60) });
    }
  }

  sendJson(res, 200, { ok: true, saved });
}

// příklady z tvých oprav, které vložíme do třídiče
function lessonsHint() {
  if (!LESSONS.length) return "";
  const items = LESSONS.slice(-12)
    .map((l) => `- "${l.text}" → ${l.type}`)
    .join("\n");
  return (
    "\n\nPOUČENÍ z toho, jak jsi to dříve opravil (u podobných textů se drž " +
    "těchto zařazení):\n" + items
  );
}

// přečti "surový text" položky (pro přeřazení jinam)
function reclassSourceText(type, id) {
  if (type === "note") {
    const p = insideDir(NOTES_DIR, id);
    return p && fs.existsSync(p) ? fs.readFileSync(p, "utf-8") : null;
  }
  if (type === "person") {
    const p = insideDir(PEOPLE_DIR, id);
    if (!p || !fs.existsSync(p)) return null;
    const o = JSON.parse(fs.readFileSync(p, "utf-8"));
    return (o.name || "") + (o.info ? "\n" + o.info : "");
  }
  if (type === "event") {
    const p = insideDir(EVENTS_DIR, id);
    if (!p || !fs.existsSync(p)) return null;
    const o = JSON.parse(fs.readFileSync(p, "utf-8"));
    return o.title || "";
  }
  return null;
}

// --- Učení z oprav: přeřaď položku jinam a zapamatuj si to --------------------
async function handleReclassify(req, res) {
  const body = await readBody(req);
  let fromType, id, toType, name, date, time;
  try {
    const j = JSON.parse(body || "{}");
    fromType = j.fromType;
    id = safeName(j.id);
    toType = j.toType;
    name = String(j.name || "").trim();
    date = String(j.date || "");
    time = String(j.time || "");
  } catch {
    return sendJson(res, 400, { error: "Neplatný JSON." });
  }

  const text = reclassSourceText(fromType, id);
  if (text == null) return sendJson(res, 400, { error: "Zdroj nenalezen." });
  const clean = text.trim();

  // vytvoř cíl
  const nid = stamp() + "-r" + RECLASS_SEQ++;
  let created;
  if (toType === "note") {
    if (!clean) return sendJson(res, 400, { error: "Prázdný text." });
    fs.writeFileSync(path.join(NOTES_DIR, nid + ".md"), clean, "utf-8");
    await indexRef({ refType: "note", refId: nid + ".md", name: "poznámka", date: new Date().toISOString(), text: clean });
    created = { type: "note" };
  } else if (toType === "person") {
    if (!name) return sendJson(res, 400, { error: "Chybí jméno." });
    const d = new Date().toISOString();
    fs.writeFileSync(path.join(PEOPLE_DIR, nid + ".json"), JSON.stringify({ name, info: clean, date: d }), "utf-8");
    await indexRef({ refType: "person", refId: nid + ".json", name, date: d, text: "Osoba: " + name + "\n" + clean });
    created = { type: "person", label: name };
  } else if (toType === "event") {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return sendJson(res, 400, { error: "Chybí datum." });
    const ev = await saveEvent(nid + ".json", clean.split("\n")[0].slice(0, 100), date, time);
    created = { type: "event", label: ev.title };
  } else {
    return sendJson(res, 400, { error: "Neznámý cíl." });
  }

  // smaž původní položku (i z paměti)
  const dir = fromType === "note" ? NOTES_DIR : fromType === "person" ? PEOPLE_DIR : fromType === "event" ? EVENTS_DIR : null;
  if (dir) {
    const p = insideDir(dir, id);
    if (p && fs.existsSync(p)) fs.unlinkSync(p);
    removeFromIndex(fromType, id);
  }

  // zapamatuj si lekci: text → správný typ
  LESSONS.push({ text: clean.replace(/\s+/g, " ").slice(0, 200), type: toType, at: new Date().toISOString() });
  if (LESSONS.length > 60) LESSONS = LESSONS.slice(-60);
  saveLessons();

  sendJson(res, 200, { ok: true, created, lessons: LESSONS.length });
}

// --- Zápisník: nahraj soubor (raw tělo, jméno v ?name=) ----------------------
function handleUpload(req, res) {
  const url = new URL(req.url, "http://x");
  const original = safeName(url.searchParams.get("name") || "soubor");
  const caption = String(url.searchParams.get("caption") || "").trim();
  const id = stamp() + "__" + original;
  const dest = insideDir(UPLOADS_DIR, id);
  if (!dest) return sendJson(res, 400, { error: "Špatné jméno souboru." });

  const out = fs.createWriteStream(dest);
  req.pipe(out);
  out.on("finish", async () => {
    // ulož tvůj popisek (když jsi nějaký napsal)
    if (caption) {
      try {
        fs.writeFileSync(path.join(CAPTIONS_DIR, id + ".txt"), caption, "utf-8");
      } catch {}
    }
    // rovnou zaindexuj popisek + obsah textového souboru (fotku přečteme až na pozadí)
    let memory = false;
    try {
      memory = (await indexFile(id, original)).ok;
    } catch {
      /* index je bonus – soubor je uložený tak jako tak */
    }
    // odpovíme hned; fotku přečteme na pozadí (může to chvíli trvat)
    const reading = isImageFile(original);
    sendJson(res, 200, { ok: true, id, name: original, memory, reading, caption: !!caption });
    if (reading) {
      readImageAndIndex(id, original).catch((e) =>
        console.warn("  ! čtení obrázku selhalo (běží vision model '" + VISION_MODEL + "'?):", e.message)
      );
    }
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
    // je k fotce přečtený text?
    const ocrPath = path.join(OCR_DIR, f + ".txt");
    let read = false;
    let readSnippet = "";
    if (fs.existsSync(ocrPath)) {
      read = true;
      readSnippet = fs.readFileSync(ocrPath, "utf-8").replace(/\s+/g, " ").slice(0, 120);
    }
    // tvůj popisek k souboru?
    let caption = "";
    const capPath = path.join(CAPTIONS_DIR, f + ".txt");
    if (fs.existsSync(capPath)) caption = fs.readFileSync(capPath, "utf-8").trim();
    // nepodařilo se fotku přečíst?
    const readError = fs.existsSync(path.join(OCR_DIR, f + ".err"));
    entries.push({
      type: "file",
      id: f,
      name: f.replace(/^[^_]+__/, ""), // zpět původní jméno (bez časové předpony)
      size: st.size,
      date: st.mtime.toISOString(),
      isImage: isImageFile(f),
      caption,
      read,
      readSnippet,
      readError,
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
    type === "note" ? NOTES_DIR
    : type === "file" ? UPLOADS_DIR
    : type === "person" ? PEOPLE_DIR
    : type === "event" ? EVENTS_DIR
    : null;
  if (!dir) return sendJson(res, 400, { error: "Neznámý typ." });
  const full = insideDir(dir, id);
  if (!full || !fs.existsSync(full)) return sendJson(res, 404, { error: "Nenalezeno." });
  fs.unlinkSync(full);
  removeFromIndex(type, id); // odeber i z paměti
  // u souboru smaž i přečtený text, popisek a značku chyby čtení
  if (type === "file") {
    for (const side of [
      path.join(OCR_DIR, id + ".txt"),
      path.join(OCR_DIR, id + ".err"),
      path.join(CAPTIONS_DIR, id + ".txt"),
    ]) {
      if (fs.existsSync(side)) fs.unlinkSync(side);
    }
  }
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

// --- Kalendář: ulož jednu událost (sdílené pro diktování i ruční přidání) ----
async function saveEvent(id, title, date, time) {
  const ev = {
    title: String(title).trim(),
    date: String(date), // RRRR-MM-DD
    time: /^\d{1,2}:\d{2}$/.test(time || "") ? time : "",
    createdAt: new Date().toISOString(),
  };
  fs.writeFileSync(path.join(EVENTS_DIR, id), JSON.stringify(ev), "utf-8");
  await indexRef({
    refType: "event",
    refId: id,
    name: "událost",
    date: ev.createdAt,
    text: "Událost: " + ev.title + " – " + ev.date + (ev.time ? " " + ev.time : ""),
  });
  return ev;
}

// --- Kalendář: ruční přidání události ----------------------------------------
async function handleSaveEvent(req, res) {
  const body = await readBody(req);
  let title, date, time;
  try {
    const j = JSON.parse(body || "{}");
    title = String(j.title || "").trim();
    date = String(j.date || "");
    time = String(j.time || "");
  } catch {
    return sendJson(res, 400, { error: "Neplatný JSON." });
  }
  if (!title) return sendJson(res, 400, { error: "Chybí název." });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return sendJson(res, 400, { error: "Chybí platné datum." });

  const id = stamp() + ".json";
  const ev = await saveEvent(id, title, date, time);
  sendJson(res, 200, { ok: true, id, event: ev });
}

// --- Kalendář: seznam událostí ----------------------------------------------
function handleEvents(req, res) {
  const events = [];
  for (const f of fs.readdirSync(EVENTS_DIR)) {
    if (!f.endsWith(".json")) continue;
    try {
      const e = JSON.parse(fs.readFileSync(path.join(EVENTS_DIR, f), "utf-8"));
      events.push({ id: f, title: e.title, date: e.date, time: e.time || "" });
    } catch {
      /* přeskoč poškozený */
    }
  }
  // seřaď podle data + času
  events.sort((a, b) => (a.date + (a.time || "99:99")).localeCompare(b.date + (b.time || "99:99")));
  sendJson(res, 200, { events });
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
    const text = fileCombinedText(f, name); // popisek + obsah/OCR
    if (!text) continue;
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
  for (const f of fs.readdirSync(EVENTS_DIR)) {
    if (!f.endsWith(".json")) continue;
    try {
      const e = JSON.parse(fs.readFileSync(path.join(EVENTS_DIR, f), "utf-8"));
      const r = await indexRef({
        refType: "event",
        refId: f,
        name: "událost",
        date: e.createdAt || new Date().toISOString(),
        text: "Událost: " + e.title + " – " + e.date + (e.time ? " " + e.time : ""),
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
  if (req.method === "POST" && pathname === "/api/capture") return handleCapture(req, res);
  if (req.method === "POST" && pathname === "/api/reclassify") return handleReclassify(req, res);
  if (req.method === "POST" && pathname === "/api/upload") return handleUpload(req, res);
  if (req.method === "POST" && pathname === "/api/delete") return handleDelete(req, res);
  if (req.method === "POST" && pathname === "/api/people") return handleSavePerson(req, res);
  if (req.method === "POST" && pathname === "/api/events") return handleSaveEvent(req, res);
  if (req.method === "POST" && pathname === "/api/briefing") return handleBriefing(req, res);
  if (req.method === "POST" && pathname === "/api/reindex") return handleReindex(req, res);
  if (req.method === "GET" && pathname === "/api/people") return handlePeople(req, res);
  if (req.method === "GET" && pathname === "/api/events") return handleEvents(req, res);
  if (req.method === "GET" && pathname === "/api/entries") return handleEntries(req, res);
  if (req.method === "GET" && pathname === "/api/note") return handleGetNote(req, res);
  if (req.method === "GET" && pathname === "/api/file") return handleGetFile(req, res);
  if (req.method === "GET" && pathname === "/api/health") {
    return sendJson(res, 200, {
      ok: true,
      model: OLLAMA_MODEL,
      ollama: OLLAMA_URL,
      embedModel: EMBED_MODEL,
      visionModel: VISION_MODEL,
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
