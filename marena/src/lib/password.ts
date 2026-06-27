import { getRedis } from "./redis";
import { createHash } from "crypto";
import { isValidPassword } from "./auth";

// Vlastní (změnitelné) heslo do zázemí. Ukládá se mimo hlavní DB pod vlastní
// Redis klíč — ať se nešíří do klienta s daty. Jen hash, ne holé heslo.
export const PWD_KEY = "marena:pwd";

export function hashPwd(pw: string): string {
  return createHash("sha256").update(`marena:pwd:v1:${(pw || "").trim()}`).digest("hex");
}

export async function getStoredPwHash(): Promise<string | null> {
  const redis = getRedis();
  if (!redis) return null;
  return ((await redis.get(PWD_KEY)) as string | null) ?? null;
}

// Master heslo z prostředí (MARENA_PASSWORD) — záchrana, platí vždy.
function isMaster(pw: string): boolean {
  const p = (pw || "").trim();
  return !!process.env.MARENA_PASSWORD && p.toLowerCase() === process.env.MARENA_PASSWORD.toLowerCase();
}

// Ověření hesla při přihlášení:
//  • když je nastavené vlastní heslo → platí jen ono (+ master z env),
//  • jinak výchozí schéma (marena<rok> / master).
export async function verifyPassword(pw: string): Promise<boolean> {
  const stored = await getStoredPwHash();
  if (stored) return isMaster(pw) || hashPwd(pw) === stored;
  return isValidPassword(pw);
}

export async function setStoredPassword(next: string): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return false;
  await redis.set(PWD_KEY, hashPwd(next));
  return true;
}
