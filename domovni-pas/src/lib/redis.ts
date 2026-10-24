import { Redis } from "@upstash/redis";
import type { InvitePublic } from "./submission";

// Vrátí klienta Upstash Redis, nebo null když backend není nakonfigurovaný.
// Podporuje názvy z Vercel Storage (KV_*) i přímé Upstash (UPSTASH_*).
export function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export const passportKey = (id: string) => `passport:${id}`;

// --- Pozvánky řemeslníků a inbox zápisů ---------------------------------------

// invite:{token} → { public, ownerKeyHash } (vyprší den po konci platnosti)
export const inviteKey = (token: string) => `invite:${token}`;
// owner:{propertyId} → sha256(ownerKey) hex — první registrace vyhrává
export const ownerHashKey = (propertyId: string) => `owner:${propertyId}`;
// inbox:{propertyId} → hash subId → Submission JSON (bez dataUrl příloh)
export const inboxKey = (propertyId: string) => `inbox:${propertyId}`;
// subfile:{subId}:{fileId} → dataUrl jednoho souboru (vlastní SET, ať je požadavek malý)
export const subFileKey = (subId: string, fileId: string) => `subfile:${subId}:${fileId}`;
// invite-count:{token} → počet odeslaných zápisů přes pozvánku
export const inviteCountKey = (token: string) => `invite-count:${token}`;

export type StoredInvite = { public: InvitePublic; ownerKeyHash: string };

// Přílohy a inbox držíme půl roku (pak je majitel stejně musel vyřídit)
export const SUBMISSION_TTL_SECONDS = 180 * 24 * 60 * 60;
