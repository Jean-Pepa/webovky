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

// Pošle notifikaci na všechna zařízení daných jmen. Mrtvé odběry (404/410)
// průběžně vyčistí. Vrací počet úspěšně doručených požadavků.
export async function sendToNames(names: string[], payload: PushPayload): Promise<number> {
  const redis = getRedis();
  if (!redis || !ensureVapid()) return 0;
  const fields = [...new Set(names.map(normName).filter(Boolean))];
  if (fields.length === 0) return 0;

  const lists = await Promise.all(fields.map((f) => redis.hget(PUSH_KEY, f)));
  const body = JSON.stringify(payload);
  let ok = 0;

  await Promise.all(
    fields.map(async (field, i) => {
      const subs = parseList(lists[i]);
      const dead: string[] = [];
      await Promise.all(
        subs.map(async (sub) => {
          try {
            await webpush.sendNotification(sub, body);
            ok += 1;
          } catch (err: unknown) {
            const code = (err as { statusCode?: number })?.statusCode;
            if (code === 404 || code === 410) dead.push(sub.endpoint);
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
  return ok;
}
