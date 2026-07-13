import { getRedis } from "./redis";
import { parseUA } from "./ua";
import { isAdmin } from "./admin";

// První-strana analytika. Ukládá se do Redisu, odděleně od hlavní DB:
//  - unikátní uživatelé (DAU/WAU/MAU) přes HyperLogLog (paměťově levné počítání)
//  - přehledy (stránky, kliky, zařízení, funnel, boti) přes denní hashe
//  - „živý" feed posledních událostí + adresář uživatelů (jméno/token/IP)
// Vše je best-effort: když Redis není, tiše se nic neděje.

const TTL = 60 * 60 * 24 * 70; // denní klíče se samy smažou po ~70 dnech

// Datum v pražském čase (YYYY-MM-DD) — správné hranice dne pro festival.
export function pragueDate(d: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Prague" }).format(d);
}
function lastDates(n: number, end: Date = new Date()): string[] {
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    const d = new Date(end.getTime() - i * 86400000);
    out.push(pragueDate(d));
  }
  return out; // [dnes, včera, …]
}

export type IncomingEvent =
  | { type: "pageview"; path: string; name?: string; sid?: string }
  | { type: "click"; label: string; path?: string; name?: string; sid?: string }
  | { type: "funnel"; step: string; name?: string; sid?: string };

// Klíč unikátního uživatele: přihlášené jméno > anonymní token (cookie) > IP.
function userKey(name: string | undefined, sid: string | undefined, ip: string): string {
  const n = (name || "").trim();
  if (n) return `u:${n.toLowerCase()}`;
  if (sid) return `s:${sid}`;
  return `ip:${ip}`;
}

export async function recordEvents(events: IncomingEvent[], ip: string, ua: string): Promise<void> {
  const redis = getRedis();
  if (!redis || !Array.isArray(events) || events.length === 0) return;
  const info = parseUA(ua);
  const today = pragueDate();
  const p = redis.pipeline();
  const touched = new Set<string>();
  const touch = (k: string) => touched.add(k);

  for (const ev of events.slice(0, 40)) {
    const name = "name" in ev ? ev.name : undefined;
    if (isAdmin(name)) continue; // správce se do statistik nezapočítává
    const sid = "sid" in ev ? ev.sid : undefined;
    const uk = userKey(name, sid, ip);
    const loggedIn = !!(name && name.trim());

    // ---- Boti: jen se spočítají (nekazí lidské metriky, šetří zápisy) ----
    if (info.bot) {
      p.hincrby(`av:day:${today}`, "bot", 1);
      p.hincrby(`av:botname:${today}`, info.botName || "bot", 1);
      p.lpush("av:recent", JSON.stringify({ t: Date.now(), kind: "bot", label: info.botName, path: "path" in ev ? ev.path : undefined, ua: ua.slice(0, 120), ip }));
      touch(`av:day:${today}`);
      touch(`av:botname:${today}`);
      continue;
    }

    // ---- Lidé ----
    p.pfadd(`av:u:${today}`, uk);
    p.pfadd(`av:u:${loggedIn ? "in" : "out"}:${today}`, uk);
    touch(`av:u:${today}`);
    touch(`av:u:${loggedIn ? "in" : "out"}:${today}`);

    if (ev.type === "pageview") {
      p.hincrby(`av:day:${today}`, "pv", 1);
      p.hincrby(`av:day:${today}`, "human", 1);
      p.hincrby(`av:path:${today}`, ev.path || "(neznámá)", 1);
      p.hincrby(`av:dev:${today}`, `dev:${info.device}`, 1);
      p.hincrby(`av:dev:${today}`, `os:${info.os}`, 1);
      p.hincrby(`av:dev:${today}`, `br:${info.browser}`, 1);
      p.hincrby("av:hits", uk, 1); // počet zobrazení na uživatele
      p.sadd(`av:uip:${uk}`, ip);
      p.expire(`av:uip:${uk}`, TTL);
      p.hset("av:users", {
        [uk]: JSON.stringify({ name: name?.trim() || null, anon: !loggedIn, dev: info.device, os: info.os, br: info.browser, ip, last: Date.now() }),
      });
      p.lpush("av:recent", JSON.stringify({ t: Date.now(), kind: "pv", who: name?.trim() || `návštěvník`, anon: !loggedIn, path: ev.path, dev: info.device, os: info.os, ip }));
      touch(`av:day:${today}`);
      touch(`av:path:${today}`);
      touch(`av:dev:${today}`);
    } else if (ev.type === "click") {
      p.hincrby(`av:day:${today}`, "click", 1);
      p.hincrby(`av:click:${today}`, (ev.label || "(bez popisku)").slice(0, 60), 1);
      touch(`av:day:${today}`);
      touch(`av:click:${today}`);
    } else if (ev.type === "funnel") {
      p.hincrby(`av:funnel:${today}`, ev.step, 1);
      p.lpush("av:recent", JSON.stringify({ t: Date.now(), kind: "funnel", who: name?.trim() || "návštěvník", step: ev.step, ip }));
      touch(`av:funnel:${today}`);
    }
  }

  p.ltrim("av:recent", 0, 400);
  for (const k of touched) p.expire(k, TTL);
  await p.exec().catch(() => {});
}

// ---------- Čtení / agregace pro přehled správce ----------

const num = (v: unknown) => (typeof v === "number" ? v : Number(v) || 0);

function sumHashes(list: (Record<string, unknown> | null)[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const h of list) {
    if (!h) continue;
    for (const [k, v] of Object.entries(h)) out[k] = (out[k] || 0) + num(v);
  }
  return out;
}
const topN = (rec: Record<string, number>, n: number) =>
  Object.entries(rec).sort((a, b) => b[1] - a[1]).slice(0, n).map(([label, count]) => ({ label, count }));

export interface AnalyticsSummary {
  enabled: boolean;
  dau: number;
  wau: number;
  mau: number;
  uniquesInPeriod: number;
  loggedInUniques: number;
  visitorUniques: number;
  pageviews: number;
  humans: number;
  bots: number;
  series: { date: string; pv: number }[];
  topPages: { label: string; count: number }[];
  topClicks: { label: string; count: number }[];
  devices: { label: string; count: number }[];
  os: { label: string; count: number }[];
  browsers: { label: string; count: number }[];
  botNames: { label: string; count: number }[];
  funnel: { step: string; label: string; count: number }[];
  recent: RecentItem[];
  users: UserRow[];
  periodDays: number;
}

export interface RecentItem {
  t: number;
  kind: string;
  who?: string;
  anon?: boolean;
  path?: string;
  step?: string;
  label?: string;
  dev?: string;
  os?: string;
  ip?: string;
}
export interface UserRow {
  key: string;
  name: string | null;
  anon: boolean;
  dev?: string;
  os?: string;
  br?: string;
  hits: number;
  last: number;
  ips: string[];
}

// Kroky funnelu merche v pořadí (pro hezké zobrazení a % dokončení).
const FUNNEL_STEPS: [string, string][] = [
  ["merch_view", "Otevřel nabídku"],
  ["merch_add", "Přidal do košíku"],
  ["merch_submit", "Klikl Objednat"],
  ["merch_success", "Dokončil objednávku"],
];

export async function getSummary(periodDays = 14): Promise<AnalyticsSummary> {
  const redis = getRedis();
  const empty: AnalyticsSummary = {
    enabled: false, dau: 0, wau: 0, mau: 0, uniquesInPeriod: 0, loggedInUniques: 0, visitorUniques: 0,
    pageviews: 0, humans: 0, bots: 0, series: [], topPages: [], topClicks: [], devices: [], os: [],
    browsers: [], botNames: [], funnel: [], recent: [], users: [], periodDays,
  };
  if (!redis) return empty;

  const d1 = lastDates(1);
  const d7 = lastDates(7);
  const d30 = lastDates(30);
  const dP = lastDates(periodDays);

  // 1) Unikáty přes HyperLogLog (union více klíčů = jedno volání).
  const tuple = (arr: string[]) => arr as [string, ...string[]]; // klíčů je vždy ≥1
  const uni = redis.pipeline();
  uni.pfcount(`av:u:${d1[0]}`);
  uni.pfcount(...tuple(d7.map((d) => `av:u:${d}`)));
  uni.pfcount(...tuple(d30.map((d) => `av:u:${d}`)));
  uni.pfcount(...tuple(dP.map((d) => `av:u:${d}`)));
  uni.pfcount(...tuple(dP.map((d) => `av:u:in:${d}`)));
  uni.pfcount(...tuple(dP.map((d) => `av:u:out:${d}`)));
  const [dau, wau, mau, uniquesInPeriod, loggedInUniques, visitorUniques] = (await uni.exec()) as number[];

  // 2) Denní přehledy přes pipeline (jeden request na skupinu).
  const readGroup = async (prefix: string, dates: string[]) => {
    const pp = redis.pipeline();
    for (const d of dates) pp.hgetall(`${prefix}:${d}`);
    return (await pp.exec()) as (Record<string, unknown> | null)[];
  };
  const [days, paths, clicks, devs, funnels, botnames] = await Promise.all([
    readGroup("av:day", dP),
    readGroup("av:path", dP),
    readGroup("av:click", dP),
    readGroup("av:dev", dP),
    readGroup("av:funnel", dP),
    readGroup("av:botname", dP),
  ]);

  const dayTotals = sumHashes(days);
  const devAll = sumHashes(devs);
  const split = (pre: string) =>
    topN(Object.fromEntries(Object.entries(devAll).filter(([k]) => k.startsWith(pre)).map(([k, v]) => [k.slice(pre.length), v])), 12);

  const series = dP.map((date, i) => ({ date, pv: num((days[i] || {})["pv"]) })).reverse();

  const funnelSum = sumHashes(funnels);
  const funnel = FUNNEL_STEPS.map(([step, label]) => ({ step, label, count: funnelSum[step] || 0 }));

  // 3) Feed + adresář uživatelů (+ IP množiny pro top uživatele).
  const recentRaw = (await redis.lrange("av:recent", 0, 120)) as unknown[];
  const recent: RecentItem[] = recentRaw
    .map((r) => { try { return typeof r === "string" ? JSON.parse(r) : (r as RecentItem); } catch { return null; } })
    .filter(Boolean) as RecentItem[];

  const usersHash = ((await redis.hgetall("av:users")) as Record<string, unknown> | null) || {};
  const hits = ((await redis.hgetall("av:hits")) as Record<string, unknown> | null) || {};
  const parsed: UserRow[] = Object.entries(usersHash).map(([key, v]) => {
    let o: Partial<UserRow> & { last?: number } = {};
    try { o = typeof v === "string" ? JSON.parse(v) : (v as UserRow); } catch { /* ignore */ }
    return { key, name: o.name ?? null, anon: !!o.anon, dev: o.dev, os: o.os, br: o.br, last: num(o.last), hits: num(hits[key]), ips: [] };
  });
  parsed.sort((a, b) => b.last - a.last);
  const top = parsed.slice(0, 60);
  if (top.length) {
    const ipPipe = redis.pipeline();
    for (const u of top) ipPipe.smembers(`av:uip:${u.key}`);
    const ipSets = (await ipPipe.exec()) as (string[] | null)[];
    top.forEach((u, i) => { u.ips = (ipSets[i] || []).slice(0, 8); });
  }

  return {
    enabled: true,
    dau: num(dau), wau: num(wau), mau: num(mau),
    uniquesInPeriod: num(uniquesInPeriod), loggedInUniques: num(loggedInUniques), visitorUniques: num(visitorUniques),
    pageviews: dayTotals["pv"] || 0, humans: dayTotals["human"] || 0, bots: dayTotals["bot"] || 0,
    series,
    topPages: topN(sumHashes(paths), 15),
    topClicks: topN(sumHashes(clicks), 15),
    devices: split("dev:"), os: split("os:"), browsers: split("br:"),
    botNames: topN(sumHashes(botnames), 12),
    funnel,
    recent,
    users: top,
    periodDays,
  };
}
