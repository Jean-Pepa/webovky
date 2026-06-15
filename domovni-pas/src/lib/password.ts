import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

// Hashování hesel přes scrypt (vestavěné v Node, žádné nativní závislosti).
// Formát uložené hodnoty: "<salt-hex>:<hash-hex>".

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const hashBuf = Buffer.from(hash, "hex");
  const test = scryptSync(password, salt, 64);
  if (test.length !== hashBuf.length) return false;
  return timingSafeEqual(test, hashBuf);
}
