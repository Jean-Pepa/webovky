import { getRedis, DB_KEY } from "./redis";
import { seedDB } from "./seed";
import type { DB } from "./types";

// Serverové čtení/zápis celé DB. Pokud Redis není nakonfigurovaný, vrací null —
// API pak odpoví 503 a klient přepne do localStorage demo režimu.
export async function readDB(): Promise<DB | null> {
  const redis = getRedis();
  if (!redis) return null;
  const data = (await redis.get(DB_KEY)) as DB | null;
  if (!data || !Array.isArray(data.years)) {
    const seeded = seedDB();
    await redis.set(DB_KEY, seeded);
    return seeded;
  }
  return data;
}

export async function writeDB(db: DB): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return false;
  await redis.set(DB_KEY, db);
  return true;
}

export function isConfigured(): boolean {
  return getRedis() !== null;
}
