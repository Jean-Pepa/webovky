// Mock Claude Messages API pro e2e testy (žádné skutečné volání, žádný klíč).
// Spuštění: node e2e/mock-anthropic.mjs [port] → ANTHROPIC_BASE_URL=http://127.0.0.1:<port>, ANTHROPIC_API_KEY=test
// Poslední požadavek uloží do souboru z MOCK_ANTHROPIC_LOG (pro kontrolu tvaru požadavku).
import http from "node:http";
import fs from "node:fs";

const port = Number(process.argv[2] ?? 8078);
const log = process.env.MOCK_ANTHROPIC_LOG;

function extraction(body) {
  const text = JSON.stringify(body.messages ?? []);
  const ids = [...text.matchAll(/\\?"id\\?":\s*\\?"([A-Za-z0-9_-]+)\\?"/g)].map((m) => m[1]);
  const elementId = ids.includes("demo-el-kotel") ? "demo-el-kotel" : (ids[0] ?? null);
  return {
    docKind: "PROTOCOL",
    workType: "INSPECTION",
    title: "Revize plynového kotle",
    summary: "Roční servisní prohlídka kotle. Zařízení je schopné bezpečného provozu.",
    date: "2026-10-20",
    result: "OK",
    device: "Plynový kotel",
    elementId,
    nextDueDate: "2027-10-20",
    intervalMonths: 12,
    cost: 1900,
    supplier: "TermoInstal s.r.o.",
    technician: "Ing. Petr Novák, ev. č. 123/2020",
    defects: [],
    confidence: "HIGH",
    warnings: [],
  };
}

http
  .createServer((req, res) => {
    let raw = "";
    req.on("data", (c) => (raw += c));
    req.on("end", () => {
      if (req.method !== "POST" || !(req.url ?? "").startsWith("/v1/messages")) {
        res.writeHead(404, { "content-type": "application/json" });
        res.end(JSON.stringify({ type: "error", error: { type: "not_found_error", message: "mock" } }));
        return;
      }
      let body = {};
      try {
        body = JSON.parse(raw);
      } catch {
        // ignore
      }
      if (log) {
        try {
          fs.writeFileSync(log, JSON.stringify({ url: req.url, headers: req.headers, body }, null, 2));
        } catch {
          // ignore
        }
      }
      const props = body.output_config?.format?.schema?.properties ?? {};
      const out = "answer" in props
        ? {
            answer:
              "Plynový kotel je v technické místnosti, poslední revize proběhla 12. 10. 2025. Polohu vedení vždy ověřte detektorem.",
            elementIds: ["demo-el-kotel"],
          }
        : extraction(body);
      res.writeHead(200, { "content-type": "application/json", "request-id": "req_mock" });
      res.end(
        JSON.stringify({
          id: "msg_mock",
          type: "message",
          role: "assistant",
          model: body.model ?? "mock",
          content: [{ type: "text", text: JSON.stringify(out) }],
          stop_reason: "end_turn",
          stop_sequence: null,
          stop_details: null,
          usage: { input_tokens: 100, output_tokens: 50 },
        }),
      );
    });
  })
  .listen(port, "127.0.0.1", () => console.log(`mock-anthropic na http://127.0.0.1:${port}`));
