// TARS – malý lokální server, který propojí tvůj mobil s Ollamou na PC.
//
// Co to dělá:
//   1) servíruje webovou appku (složka public/) – to je ten hezký chat
//   2) má jeden "tunel" /api/chat, který posílá tvoje zprávy do Ollamy
//      a zpátky streamuje odpověď modelu
//
// Proč server uprostřed? Prohlížeč na mobilu NEMLUVÍ s Ollamou přímo –
// mluví jen s tímhle serverem (běží na tvém PC) a ten teprve s Ollamou.
// Díky tomu data nikam neodcházejí a odpadají problémy s CORS.
//
// Spuštění:  node server.js
// Nastavení (nepovinné, přes proměnné prostředí):
//   PORT          – port serveru (výchozí 8787)
//   OLLAMA_URL    – kde běží Ollama (výchozí http://localhost:11434)
//   OLLAMA_MODEL  – který model použít (výchozí qwen2.5:7b)

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 8787;
const OLLAMA_URL = (process.env.OLLAMA_URL || "http://localhost:11434").replace(/\/$/, "");
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "qwen2.5:7b";

// Krátká "osobnost" TARS. Klidně si ji uprav podle sebe.
const SYSTEM_PROMPT =
  "Jsi TARS, osobní asistent Kristiána. Odpovídáš česky, stručně a k věci. " +
  "Když něco nevíš, řekneš to narovinu. Jsi věcný, klidný a spolehlivý.";

const PUBLIC_DIR = path.join(__dirname, "public");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".json": "application/json; charset=utf-8",
};

// --- Servírování statických souborů (webová appka) ---------------------------
function serveStatic(req, res) {
  let urlPath = decodeURIComponent(req.url.split("?")[0]);
  if (urlPath === "/") urlPath = "/index.html";

  // bezpečnost: nedovol vylézt ze složky public/
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

// --- Tunel do Ollamy: /api/chat ---------------------------------------------
async function handleChat(req, res) {
  // načteme tělo požadavku (JSON se zprávami)
  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", async () => {
    let messages;
    try {
      const parsed = JSON.parse(body || "{}");
      messages = Array.isArray(parsed.messages) ? parsed.messages : [];
    } catch {
      res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ error: "Neplatný JSON." }));
      return;
    }

    // před historii přidáme systémovou instrukci (osobnost TARS)
    const fullMessages = [{ role: "system", content: SYSTEM_PROMPT }, ...messages];

    try {
      const ollamaRes = await fetch(`${OLLAMA_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          messages: fullMessages,
          stream: true,
        }),
      });

      if (!ollamaRes.ok || !ollamaRes.body) {
        const text = await ollamaRes.text().catch(() => "");
        res.writeHead(502, { "Content-Type": "application/json; charset=utf-8" });
        res.end(
          JSON.stringify({
            error:
              "Ollama odpověděla chybou (" +
              ollamaRes.status +
              "). Běží Ollama? Je stažený model '" +
              OLLAMA_MODEL +
              "'? " +
              text.slice(0, 300),
          })
        );
        return;
      }

      // proudově přeposíláme odpověď Ollamy rovnou do prohlížeče
      res.writeHead(200, {
        "Content-Type": "application/x-ndjson; charset=utf-8",
        "Cache-Control": "no-cache",
      });
      for await (const chunk of ollamaRes.body) {
        res.write(chunk);
      }
      res.end();
    } catch (err) {
      res.writeHead(502, { "Content-Type": "application/json; charset=utf-8" });
      res.end(
        JSON.stringify({
          error:
            "Nepodařilo se spojit s Ollamou na " +
            OLLAMA_URL +
            ". Zkontroluj, že Ollama běží (příkaz: ollama serve). Detail: " +
            (err && err.message ? err.message : String(err)),
        })
      );
    }
  });
}

// --- Router ------------------------------------------------------------------
const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/api/chat") {
    handleChat(req, res);
    return;
  }
  if (req.method === "GET" && req.url === "/api/health") {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ ok: true, model: OLLAMA_MODEL, ollama: OLLAMA_URL }));
    return;
  }
  serveStatic(req, res);
});

// 0.0.0.0 = poslouchej na všech adresách, aby se mobil přes Tailscale připojil
server.listen(PORT, "0.0.0.0", () => {
  console.log("");
  console.log("  TARS běží ✦");
  console.log("  ─────────────────────────────────────────────");
  console.log("  Na PC otevři:      http://localhost:" + PORT);
  console.log("  Z mobilu (Tailscale): http://<adresa-tvého-PC>:" + PORT);
  console.log("  Model:             " + OLLAMA_MODEL);
  console.log("  Ollama:            " + OLLAMA_URL);
  console.log("  ─────────────────────────────────────────────");
  console.log("  Zastavení: Ctrl + C");
  console.log("");
});
