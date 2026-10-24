// Jednoduchý mock Upstash Redis REST API pro e2e testy (v paměti).
// Spuštění: node e2e/mock-upstash.mjs [port]  → UPSTASH_REDIS_REST_URL=http://127.0.0.1:<port>, TOKEN=test
import http from "node:http";

const port = Number(process.argv[2] ?? 8079);
const store = new Map(); // key → { type: "string" | "hash", value, expiresAt? }

const enc = (v) => (v == null ? null : Buffer.from(String(v), "utf8").toString("base64"));

function live(key) {
  const e = store.get(key);
  if (!e) return undefined;
  if (e.expiresAt && e.expiresAt <= Date.now()) {
    store.delete(key);
    return undefined;
  }
  return e;
}

function exec([rawCmd, ...args]) {
  const cmd = String(rawCmd).toUpperCase();
  const key = args[0] != null ? String(args[0]) : "";
  switch (cmd) {
    case "PING":
      return "PONG";
    case "GET": {
      const e = live(key);
      return e?.type === "string" ? enc(e.value) : null;
    }
    case "SET": {
      let ex, nx = false, xx = false, get = false;
      for (let i = 2; i < args.length; i++) {
        const o = String(args[i]).toUpperCase();
        if (o === "EX") ex = Number(args[++i]) * 1000;
        else if (o === "PX") ex = Number(args[++i]);
        else if (o === "EXAT") ex = Number(args[++i]) * 1000 - Date.now();
        else if (o === "NX") nx = true;
        else if (o === "XX") xx = true;
        else if (o === "GET") get = true;
      }
      const old = live(key);
      if ((nx && old) || (xx && !old)) return null;
      store.set(key, { type: "string", value: String(args[1]), expiresAt: ex ? Date.now() + ex : undefined });
      return get ? enc(old?.value) : "OK";
    }
    case "SETNX":
      if (live(key)) return 0;
      store.set(key, { type: "string", value: String(args[1]) });
      return 1;
    case "DEL":
    case "UNLINK": {
      let n = 0;
      for (const k of args) if (live(String(k)) && store.delete(String(k))) n++;
      return n;
    }
    case "EXISTS":
      return args.filter((k) => live(String(k))).length;
    case "EXPIRE":
    case "PEXPIRE":
    case "EXPIREAT": {
      const e = live(key);
      if (!e) return 0;
      const n = Number(args[1]);
      e.expiresAt = cmd === "EXPIRE" ? Date.now() + n * 1000 : cmd === "PEXPIRE" ? Date.now() + n : n * 1000;
      return 1;
    }
    case "TTL": {
      const e = live(key);
      if (!e) return -2;
      return e.expiresAt ? Math.ceil((e.expiresAt - Date.now()) / 1000) : -1;
    }
    case "INCR":
    case "INCRBY":
    case "DECR": {
      const e = live(key);
      const by = cmd === "INCRBY" ? Number(args[1]) : cmd === "DECR" ? -1 : 1;
      const n = Number(e?.value ?? 0) + by;
      store.set(key, { type: "string", value: String(n), expiresAt: e?.expiresAt });
      return n;
    }
    case "HSET":
    case "HMSET": {
      const e = live(key) ?? { type: "hash", value: new Map() };
      let added = 0;
      for (let i = 1; i + 1 < args.length; i += 2) {
        if (!e.value.has(String(args[i]))) added++;
        e.value.set(String(args[i]), String(args[i + 1]));
      }
      store.set(key, e);
      return cmd === "HMSET" ? "OK" : added;
    }
    case "HSETNX": {
      const e = live(key) ?? { type: "hash", value: new Map() };
      if (e.value.has(String(args[1]))) return 0;
      e.value.set(String(args[1]), String(args[2]));
      store.set(key, e);
      return 1;
    }
    case "HGET": {
      const e = live(key);
      return e?.type === "hash" ? enc(e.value.get(String(args[1]))) : null;
    }
    case "HMGET": {
      const e = live(key);
      return args.slice(1).map((f) => (e?.type === "hash" ? enc(e.value.get(String(f))) : null));
    }
    case "HGETALL": {
      const e = live(key);
      if (!e || e.type !== "hash") return [];
      return [...e.value.entries()].flatMap(([k, v]) => [enc(k), enc(v)]);
    }
    case "HKEYS": {
      const e = live(key);
      return e?.type === "hash" ? [...e.value.keys()].map(enc) : [];
    }
    case "HVALS": {
      const e = live(key);
      return e?.type === "hash" ? [...e.value.values()].map(enc) : [];
    }
    case "HLEN": {
      const e = live(key);
      return e?.type === "hash" ? e.value.size : 0;
    }
    case "HEXISTS": {
      const e = live(key);
      return e?.type === "hash" && e.value.has(String(args[1])) ? 1 : 0;
    }
    case "HDEL": {
      const e = live(key);
      if (!e || e.type !== "hash") return 0;
      let n = 0;
      for (const f of args.slice(1)) if (e.value.delete(String(f))) n++;
      if (!e.value.size) store.delete(key);
      return n;
    }
    case "MGET":
      return args.map((k) => {
        const e = live(String(k));
        return e?.type === "string" ? enc(e.value) : null;
      });
    case "KEYS": {
      const re = new RegExp("^" + key.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\?/g, ".") + "$");
      return [...store.keys()].filter((k) => live(k) && re.test(k)).map(enc);
    }
    case "FLUSHALL":
    case "FLUSHDB":
      store.clear();
      return "OK";
    default:
      throw new Error(`ERR mock: unsupported command ${cmd}`);
  }
}

function run(cmd) {
  try {
    return { result: exec(cmd) };
  } catch (e) {
    return { error: e instanceof Error ? e.message : String(e) };
  }
}

http
  .createServer((req, res) => {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      if (req.headers.authorization !== "Bearer test") {
        res.writeHead(401, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: "Unauthorized" }));
        return;
      }
      let parsed;
      try {
        parsed = JSON.parse(body || "null");
      } catch {
        res.writeHead(400, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: "bad json" }));
        return;
      }
      const path = (req.url ?? "/").split("?")[0];
      let out;
      if (path === "/pipeline" || path === "/multi-exec") out = parsed.map(run);
      else if (Array.isArray(parsed)) out = run(parsed);
      else out = { error: "ERR mock: bad request" };
      res.writeHead(out.error && !Array.isArray(out) ? 400 : 200, { "content-type": "application/json" });
      res.end(JSON.stringify(out));
    });
  })
  .listen(port, "127.0.0.1", () => console.log(`mock-upstash na http://127.0.0.1:${port}`));
