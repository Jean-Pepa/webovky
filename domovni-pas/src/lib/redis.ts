import { Redis } from "@upstash/redis";

// Vrátí klienta Upstash Redis, nebo null když backend není nakonfigurovaný.
// Podporuje názvy z Vercel Storage (KV_*) i přímé Upstash (UPSTASH_*).
export function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export const passportKey = (id: string) => `passport:${id}`;
