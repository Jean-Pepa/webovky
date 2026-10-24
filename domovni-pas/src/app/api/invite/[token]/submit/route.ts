import type { Redis } from "@upstash/redis";
import {
  SUBMISSION_TTL_SECONDS,
  getRedis,
  inboxKey,
  inviteCountKey,
  subFileKey,
} from "@/lib/redis";
import {
  expireAtSeconds,
  json,
  jsonError,
  loadInvite,
  newServerId,
  notConfigured,
  overLimit,
  readJsonBody,
} from "@/lib/server-auth";
import {
  MAX_SUBMISSIONS_PER_INVITE,
  TOKEN_RE,
  isInviteExpired,
  validateSubmissionPayload,
} from "@/lib/submission-proposal";
import { SUBMISSION_LIMITS, type Submission } from "@/lib/submission";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Soubor ukládáme po částech — jeden požadavek na Upstash má omezenou velikost
const FILE_CHUNK_CHARS = 700_000;

async function storeFile(redis: Redis, key: string, dataUrl: string) {
  await redis.set(key, dataUrl.slice(0, FILE_CHUNK_CHARS), { ex: SUBMISSION_TTL_SECONDS });
  for (let i = FILE_CHUNK_CHARS; i < dataUrl.length; i += FILE_CHUNK_CHARS) {
    await redis.append(key, dataUrl.slice(i, i + FILE_CHUNK_CHARS));
  }
}

// Řemeslník odešle zápis přes pozvánku (bez účtu). Uloží se do inboxu majitele,
// do knihy se dostane až po jeho potvrzení.
export async function POST(req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const redis = getRedis();
  if (!redis) return notConfigured();
  if (!TOKEN_RE.test(token)) return jsonError(404, "not_found");
  if (await overLimit(req, "submit", 60)) {
    return jsonError(429, "rate_limited", "Z tohoto připojení teď přišlo moc zápisů. Zkuste to prosím později.");
  }

  try {
    const stored = await loadInvite(redis, token);
    if (!stored) {
      return jsonError(404, "not_found", "Pozvánka neexistuje nebo ji majitel zrušil.");
    }
    const invite = stored.public;
    if (isInviteExpired(invite)) {
      return jsonError(410, "expired", "Platnost pozvánky skončila. Požádejte majitele o novou.");
    }

    const body = await readJsonBody(req);
    if (!body.ok) return body.response;
    const v = validateSubmissionPayload(body.data, invite);
    if (!v.ok) return jsonError(400, v.error, v.message);

    const propertyId = invite.propertyId;
    const pending = await redis.hlen(inboxKey(propertyId));
    if (pending >= SUBMISSION_LIMITS.maxPendingPerProperty) {
      return jsonError(
        429,
        "inbox_full",
        "Majitel má teď moc nevyřízených zápisů. Zkuste to prosím později.",
      );
    }

    const countKey = inviteCountKey(token);
    const count = await redis.incr(countKey);
    if (count === 1) await redis.expireat(countKey, expireAtSeconds(invite.expiresAt, 1));
    if (count > MAX_SUBMISSIONS_PER_INVITE) {
      return jsonError(
        429,
        "invite_limit",
        "Přes tuto pozvánku už bylo odesláno moc zápisů. Požádejte majitele o novou.",
      );
    }

    const id = newServerId();
    const fileKeys = v.value.attachments.map((a) => subFileKey(id, a.id));
    try {
      // Soubory zvlášť, metadata až potom
      await Promise.all(v.value.attachments.map((a, i) => storeFile(redis, fileKeys[i], a.dataUrl ?? "")));
      const meta: Submission = {
        ...v.value,
        id,
        token,
        propertyId,
        createdAt: new Date().toISOString(),
        attachments: v.value.attachments.map((a) => ({ ...a, dataUrl: undefined })),
      };
      await redis.hset(inboxKey(propertyId), { [id]: JSON.stringify(meta) });
      await redis.expire(inboxKey(propertyId), SUBMISSION_TTL_SECONDS);
    } catch (e) {
      // nepovedené uložení nesmí zabírat místo ani limit pozvánky
      if (fileKeys.length) await redis.del(...fileKeys).catch(() => 0);
      await redis.decr(countKey).catch(() => 0);
      throw e;
    }
    return json({ ok: true, id });
  } catch {
    return jsonError(500, "server_error", "Zápis se nepodařilo uložit. Zkuste to prosím znovu.");
  }
}
