import { getRedis, inboxKey } from "@/lib/redis";
import {
  json,
  jsonError,
  notConfigured,
  parseSubmission,
  requireOwner,
} from "@/lib/server-auth";
import { ID_RE } from "@/lib/submission-proposal";
import type { Submission } from "@/lib/submission";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Zápisy od řemeslníků čekající na potvrzení (jen metadata, nejnovější první)
export async function GET(req: Request, { params }: { params: Promise<{ propertyId: string }> }) {
  const { propertyId } = await params;
  const redis = getRedis();
  if (!redis) return notConfigured();
  if (!ID_RE.test(propertyId)) return jsonError(404, "not_found");
  try {
    const denied = await requireOwner(req, redis, propertyId);
    if (denied) return denied;
    const all = (await redis.hgetall<Record<string, unknown>>(inboxKey(propertyId))) ?? {};
    const submissions = Object.values(all)
      .map(parseSubmission)
      .filter((s): s is Submission => !!s)
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    return json({ submissions });
  } catch {
    return jsonError(500, "server_error");
  }
}
