import { getRedis, inviteCountKey, inviteKey, type StoredInvite } from "@/lib/redis";
import {
  OWNER_HEADER,
  expireAtSeconds,
  isValidOwnerKey,
  json,
  jsonError,
  loadInvite,
  notConfigured,
  overLimit,
  readJsonBody,
  registerOwner,
  sameHash,
  sha256Hex,
} from "@/lib/server-auth";
import { TOKEN_RE, isInviteExpired, todayIso, validateInvitePublic } from "@/lib/submission-proposal";
import { addDays } from "@/lib/deadlines";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ token: string }> };

// Pozvánka může platit nejvýš dva roky
const MAX_INVITE_DAYS = 731;

// Veřejné údaje pozvánky pro stránku řemeslníka (nikdy ne hash klíče majitele)
export async function GET(_req: Request, { params }: Ctx) {
  const { token } = await params;
  const redis = getRedis();
  if (!redis) return notConfigured();
  if (!TOKEN_RE.test(token)) return jsonError(404, "not_found");
  try {
    const stored = await loadInvite(redis, token);
    if (!stored) return jsonError(404, "not_found");
    if (isInviteExpired(stored.public)) return jsonError(410, "expired");
    return json(stored.public);
  } catch {
    return jsonError(500, "server_error");
  }
}

// Majitel zveřejní / aktualizuje pozvánku. Tělo: { invite: InvitePublic, ownerKey }
export async function PUT(req: Request, { params }: Ctx) {
  const { token } = await params;
  const redis = getRedis();
  if (!redis) return notConfigured();
  if (!TOKEN_RE.test(token)) return jsonError(400, "invalid_token");
  if (await overLimit(req, "invite", 120)) return jsonError(429, "rate_limited");

  const body = await readJsonBody(req, 512_000);
  if (!body.ok) return body.response;
  const data = body.data as { invite?: unknown; ownerKey?: unknown } | null;
  if (!data || typeof data !== "object") return jsonError(400, "invalid_body");
  if (!isValidOwnerKey(data.ownerKey)) return jsonError(400, "invalid_owner_key");

  const v = validateInvitePublic(data.invite);
  if (!v.ok) return jsonError(400, v.error, v.message);
  const invite = v.value;
  if (invite.token !== token) return jsonError(400, "token_mismatch");

  const today = todayIso();
  if (isInviteExpired(invite, today)) {
    return jsonError(400, "expired", "Platnost pozvánky už skončila.");
  }
  if (invite.expiresAt > addDays(today, MAX_INVITE_DAYS)) {
    return jsonError(400, "invalid_date", "Pozvánka může platit nejvýš dva roky.");
  }

  try {
    const hash = sha256Hex(data.ownerKey);
    // Token už existuje → smí ho měnit jen stejný majitel a pro stejný dům
    const existing = await loadInvite(redis, token);
    if (
      existing &&
      (!sameHash(existing.ownerKeyHash, hash) || existing.public.propertyId !== invite.propertyId)
    ) {
      return jsonError(403, "forbidden");
    }
    if (!(await registerOwner(redis, invite.propertyId, data.ownerKey))) {
      return jsonError(403, "forbidden");
    }
    const stored: StoredInvite = { public: invite, ownerKeyHash: hash };
    await redis.set(inviteKey(token), stored, { exat: expireAtSeconds(invite.expiresAt, 1) });
    return json({ ok: true });
  } catch {
    return jsonError(500, "server_error");
  }
}

// Zrušení pozvánky (hlavička x-owner-key). Neexistující pozvánka = už zrušená.
export async function DELETE(req: Request, { params }: Ctx) {
  const { token } = await params;
  const redis = getRedis();
  if (!redis) return notConfigured();
  const key = req.headers.get(OWNER_HEADER);
  if (!key) return jsonError(401, "unauthorized");
  if (!TOKEN_RE.test(token)) return jsonError(404, "not_found");
  try {
    const stored = await loadInvite(redis, token);
    if (!stored) return json({ ok: true });
    if (!isValidOwnerKey(key) || !sameHash(stored.ownerKeyHash, sha256Hex(key))) {
      return jsonError(403, "forbidden");
    }
    await redis.del(inviteKey(token), inviteCountKey(token));
    return json({ ok: true });
  } catch {
    return jsonError(500, "server_error");
  }
}
