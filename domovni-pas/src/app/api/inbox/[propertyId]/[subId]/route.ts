import { getRedis, inboxKey, subFileKey } from "@/lib/redis";
import {
  json,
  jsonError,
  notConfigured,
  parseSubmission,
  requireOwner,
} from "@/lib/server-auth";
import { ID_RE } from "@/lib/submission-proposal";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ propertyId: string; subId: string }> };

// Jeden soubor zápisu: ?file=<fileId> → { dataUrl }
export async function GET(req: Request, { params }: Ctx) {
  const { propertyId, subId } = await params;
  const redis = getRedis();
  if (!redis) return notConfigured();
  if (!ID_RE.test(propertyId) || !ID_RE.test(subId)) return jsonError(404, "not_found");
  const fileId = new URL(req.url).searchParams.get("file");
  if (!fileId || !ID_RE.test(fileId)) return jsonError(400, "invalid_file");
  try {
    const denied = await requireOwner(req, redis, propertyId);
    if (denied) return denied;
    // soubor musí patřit zápisu z inboxu právě tohoto domu
    const sub = parseSubmission(await redis.hget(inboxKey(propertyId), subId));
    if (!sub || !sub.attachments.some((a) => a.id === fileId)) return jsonError(404, "not_found");
    const dataUrl = await redis.get(subFileKey(subId, fileId));
    if (typeof dataUrl !== "string" || !dataUrl) return jsonError(404, "file_missing");
    return json({ dataUrl });
  } catch {
    return jsonError(500, "server_error");
  }
}

// Vyřízení zápisu (potvrzen do knihy / odmítnut) — smaže metadata i soubory
export async function DELETE(req: Request, { params }: Ctx) {
  const { propertyId, subId } = await params;
  const redis = getRedis();
  if (!redis) return notConfigured();
  if (!ID_RE.test(propertyId) || !ID_RE.test(subId)) return jsonError(404, "not_found");
  try {
    const denied = await requireOwner(req, redis, propertyId);
    if (denied) return denied;
    const sub = parseSubmission(await redis.hget(inboxKey(propertyId), subId));
    if (sub && sub.attachments.length > 0) {
      await redis.del(...sub.attachments.map((a) => subFileKey(subId, a.id)));
    }
    await redis.hdel(inboxKey(propertyId), subId);
    return json({ ok: true });
  } catch {
    return jsonError(500, "server_error");
  }
}
