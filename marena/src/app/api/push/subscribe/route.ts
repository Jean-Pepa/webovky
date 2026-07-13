import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { savePushSub, type PushSub } from "@/lib/push";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Uloží odběr (subscription od prohlížeče) pod jméno přihlášeného.
export async function POST(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = (await req.json().catch(() => null)) as { name?: string; subscription?: PushSub } | null;
  const name = body?.name?.trim();
  const sub = body?.subscription;
  if (!name || !sub?.endpoint || !sub?.keys?.p256dh || !sub?.keys?.auth) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const ok = await savePushSub(name, { endpoint: sub.endpoint, keys: sub.keys });
  return NextResponse.json({ ok });
}
