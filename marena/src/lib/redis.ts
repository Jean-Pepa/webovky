import { Redis } from "@upstash/redis";

// Vrátí klienta Upstash Redis, nebo null když backend není nakonfigurovaný.
// Podporuje názvy z Vercel Storage (KV_*) i přímé Upstash (UPSTASH_*).
export function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export const DB_KEY = "marena:db";

// Účtenky (fotky) se ukládají mimo hlavní DB — každá pod vlastním klíčem,
// ať se velký base64 obrázek nepřepisuje při každé akci.
export const receiptKey = (id: string) => `marena:receipt:${id}`;
