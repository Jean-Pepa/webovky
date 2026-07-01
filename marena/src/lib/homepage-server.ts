import { getRedis } from "./redis";
import type { HomeContent } from "./homepage";

// Obsah homepage (přepisy textů/fotek/novinek) se ukládá mimo hlavní DB pod
// vlastní Redis klíč — je globální (jeden web pro všechny), ne per-ročník.
export const HOMEPAGE_KEY = "marena:homepage";

export async function getHomepage(): Promise<HomeContent | null> {
  const redis = getRedis();
  if (!redis) return null;
  const raw = (await redis.get(HOMEPAGE_KEY)) as HomeContent | null;
  return raw ?? null;
}

export async function setHomepage(content: HomeContent): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return false;
  await redis.set(HOMEPAGE_KEY, content);
  return true;
}
