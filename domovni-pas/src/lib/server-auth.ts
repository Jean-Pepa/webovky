// Jen pro server (API routy): klíč majitele, porovnání hashů, jednotné JSON chyby.
// Nikdy nelogovat klíče ani obsah souborů.

import { createHash, randomUUID, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import type { Redis } from "@upstash/redis";
import { getRedis, inviteKey, ownerHashKey, type StoredInvite } from "./redis";
import { TOKEN_RE } from "./submission-proposal";
import type { Submission } from "./submission";

export const OWNER_HEADER = "x-owner-key";

// Vercel pustí tělo požadavku nejvýš 4,5 MB
export const MAX_BODY_BYTES = 4_500_000;

const NO_STORE = { "cache-control": "no-store" };

export function json(data: unknown, status = 200): NextResponse {
  return NextResponse.json(data, { status, headers: NO_STORE });
}

export function jsonError(status: number, error: string, message?: string): NextResponse {
  return json(message ? { error, message } : { error }, status);
}

export const notConfigured = () => jsonError(503, "not_configured");

export function sha256Hex(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

// Porovnání hashů v konstantním čase
export function sameHash(a: string, b: string): boolean {
  const ba = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

export function isValidOwnerKey(v: unknown): v is string {
  return typeof v === "string" && TOKEN_RE.test(v);
}

// Hodnota z Redis (automatická deserializace může vrátit i číslo) → řetězec
function asString(v: unknown): string | null {
  if (v == null) return null;
  return typeof v === "string" ? v : String(v);
}

// První registrace majitele domu vyhrává; další už musí klíč souhlasit.
export async function registerOwner(redis: Redis, propertyId: string, ownerKey: string): Promise<boolean> {
  const hash = sha256Hex(ownerKey);
  const created = await redis.setnx(ownerHashKey(propertyId), hash);
  if (created) return true;
  const stored = asString(await redis.get(ownerHashKey(propertyId)));
  return !!stored && sameHash(stored, hash);
}

// Ověří hlavičku x-owner-key proti owner:{propertyId}.
// Vrací null (v pořádku) nebo hotovou chybovou odpověď: 401 chybí klíč, 403 nesouhlasí, 404 inbox neexistuje.
export async function requireOwner(
  req: Request,
  redis: Redis,
  propertyId: string,
): Promise<NextResponse | null> {
  const key = req.headers.get(OWNER_HEADER);
  if (!key) return jsonError(401, "unauthorized");
  if (!isValidOwnerKey(key)) return jsonError(403, "forbidden");
  const stored = asString(await redis.get(ownerHashKey(propertyId)));
  if (!stored) return jsonError(404, "no_inbox");
  if (!sameHash(stored, sha256Hex(key))) return jsonError(403, "forbidden");
  return null;
}

// Načte JSON tělo s limitem velikosti. Vrací data nebo chybovou odpověď.
export async function readJsonBody(
  req: Request,
  maxBytes = MAX_BODY_BYTES,
): Promise<{ ok: true; data: unknown } | { ok: false; response: NextResponse }> {
  const declared = Number(req.headers.get("content-length") ?? "0");
  if (declared > maxBytes) {
    return { ok: false, response: jsonError(413, "too_large", "Zápis je příliš velký — uberte prosím přílohy.") };
  }
  let text: string;
  try {
    text = await req.text();
  } catch {
    return { ok: false, response: jsonError(400, "invalid_body") };
  }
  if (text.length > maxBytes) {
    return { ok: false, response: jsonError(413, "too_large", "Zápis je příliš velký — uberte prosím přílohy.") };
  }
  try {
    return { ok: true, data: JSON.parse(text) as unknown };
  } catch {
    return { ok: false, response: jsonError(400, "invalid_json") };
  }
}

// Jednoduchý limit požadavků na IP adresu a hodinu pro veřejné routy (placená AI, zápisy
// bez účtu). Bez Redisu se neomezuje; výpadek Redisu požadavek nezablokuje.
export async function overLimit(req: Request, scope: string, perHour: number): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return false;
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip")?.trim() || "unknown";
  const key = `rate:${scope}:${ip}:${Math.floor(Date.now() / 3_600_000)}`;
  try {
    const n = await redis.incr(key);
    if (n === 1) await redis.expire(key, 3_600);
    return n > perHour;
  } catch {
    return false;
  }
}

// Náhodné id zápisu (UUID bez pomlček)
export function newServerId(): string {
  return randomUUID().replace(/-/g, "");
}

// Unixový čas (s) pro EXPIRE: konec dne `date` + `extraDays` (v UTC, s rezervou)
export function expireAtSeconds(date: string, extraDays: number): number {
  const [y, m, d] = date.split("-").map(Number);
  return Math.floor(Date.UTC(y, m - 1, d + 1 + extraDays) / 1000);
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

// Redis může vrátit už rozparsovaný objekt i řetězec JSON
function parseStoredJson(v: unknown): unknown {
  if (typeof v !== "string") return v;
  try {
    return JSON.parse(v) as unknown;
  } catch {
    return null;
  }
}

export async function loadInvite(redis: Redis, token: string): Promise<StoredInvite | null> {
  const o = parseStoredJson(await redis.get(inviteKey(token)));
  if (!isRecord(o) || !isRecord(o.public) || typeof o.ownerKeyHash !== "string") return null;
  return o as unknown as StoredInvite;
}

// Metadata zápisu z inboxu (bez dataUrl příloh)
export function parseSubmission(v: unknown): Submission | null {
  const o = parseStoredJson(v);
  if (!isRecord(o) || typeof o.id !== "string" || !Array.isArray(o.attachments)) return null;
  const sub = o as unknown as Submission;
  return {
    ...sub,
    attachments: sub.attachments.filter(isRecord).map((a) => ({ ...a, dataUrl: undefined })),
  };
}
