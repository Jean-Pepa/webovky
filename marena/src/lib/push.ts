import webpush from "web-push";
import { getRedis } from "./redis";
import { normName } from "./names";

// Web Push (notifikace na mobil). Odběry (subscription objekty od prohlížeče)
// se ukládají MIMO hlavní DB — do samostatného Redis hashe, klíč = jméno
// (normalizované), hodnota = pole odběrů (člověk může mít víc zařízení).
// Systém funguje jen když jsou v prostředí VAPID klíče a běží Redis; jinak
// se všechno tiše přeskočí (feature je vypnutá, nic nespadne).

const PUSH_KEY = "marena:push";

export interface PushSub {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}

export function vapidPublicKey(): string | null {
  return process.env.VAPID_PUBLIC_KEY ?? null;
}

// Push je dostupný jen s VAPID klíči + běžícím Redisem.
export function pushConfigured(): boolean {
  return !!(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) && getRedis() !== null;
}

let vapidReady = false;
function ensureVapid(): boolean {
  const pub = process.env.VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  if (!pub || !priv) return false;
  if (!vapidReady) {
    const subject = process.env.VAPID_SUBJECT || "mailto:marena@festival.local";
    webpush.setVapidDetails(subject, pub, priv);
    vapidReady = true;
  }
  return true;
}

function parseList(raw: unknown): PushSub[] {
  if (Array.isArray(raw)) return raw as PushSub[];
  if (typeof raw === "string" && raw.trim()) {
    try {
      const p = JSON.parse(raw);
      return Array.isArray(p) ? (p as PushSub[]) : [];
    } catch {
      return [];
    }
  }
  return [];
}

// Přidá odběr pod jméno (dedup podle endpointu, drží posledních 8 zařízení).
export async function savePushSub(name: string, sub: PushSub): Promise<boolean> {
  const redis = getRedis();
  if (!redis || !sub?.endpoint) return false;
  const field = normName(name);
  if (!field) return false;
  const list = parseList(await redis.hget(PUSH_KEY, field));
  const next = [...list.filter((s) => s.endpoint !== sub.endpoint), sub].slice(-8);
  await redis.hset(PUSH_KEY, { [field]: next });
  return true;
}

// Odebere jeden odběr (podle endpointu). Když člověku nezbyde žádný, smaže pole.
export async function removePushSub(name: string, endpoint: string): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  const field = normName(name);
  const next = parseList(await redis.hget(PUSH_KEY, field)).filter((s) => s.endpoint !== endpoint);
  if (next.length) await redis.hset(PUSH_KEY, { [field]: next });
  else await redis.hdel(PUSH_KEY, field);
}

// Normalizovaná jména všech, kdo mají aspoň jeden odběr (pro přehled správce).
export async function pushNames(): Promise<string[]> {
  const redis = getRedis();
  if (!redis) return [];
  const all = (await redis.hgetall(PUSH_KEY)) as Record<string, unknown> | null;
  if (!all) return [];
  return Object.keys(all).filter((k) => parseList(all[k]).length > 0);
}

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
}

export interface SendReport {
  subs: number; // kolik zařízení bylo uloženo pro daná jména
  sent: number; // kolik z nich push doopravdy přijalo
  fails: { code?: number; body?: string }[]; // chyby od push serveru (kvůli diagnostice)
}

// Jádro rozesílání — vrací podrobný přehled (kolik zařízení, kolik doručeno,
// jaké chyby). Mrtvé odběry (404/410) průběžně vyčistí.
export async function sendToNamesDetailed(names: string[], payload: PushPayload): Promise<SendReport> {
  const redis = getRedis();
  if (!redis || !ensureVapid()) return { subs: 0, sent: 0, fails: [] };
  const fields = [...new Set(names.map(normName).filter(Boolean))];
  if (fields.length === 0) return { subs: 0, sent: 0, fails: [] };

  const lists = await Promise.all(fields.map((f) => redis.hget(PUSH_KEY, f)));
  const body = JSON.stringify(payload);
  const report: SendReport = { subs: 0, sent: 0, fails: [] };

  await Promise.all(
    fields.map(async (field, i) => {
      const subs = parseList(lists[i]);
      report.subs += subs.length;
      const dead: string[] = [];
      await Promise.all(
        subs.map(async (sub) => {
          try {
            await webpush.sendNotification(sub, body);
            report.sent += 1;
          } catch (err: unknown) {
            const e = err as { statusCode?: number; body?: string };
            report.fails.push({ code: e?.statusCode, body: typeof e?.body === "string" ? e.body.slice(0, 300) : undefined });
            if (e?.statusCode === 404 || e?.statusCode === 410) dead.push(sub.endpoint);
          }
        }),
      );
      if (dead.length) {
        const next = subs.filter((s) => !dead.includes(s.endpoint));
        if (next.length) await redis.hset(PUSH_KEY, { [field]: next });
        else await redis.hdel(PUSH_KEY, field);
      }
    }),
  );
  return report;
}

// Pošle notifikaci na všechna zařízení daných jmen. Vrací počet doručení.
export async function sendToNames(names: string[], payload: PushPayload): Promise<number> {
  return (await sendToNamesDetailed(names, payload)).sent;
}
