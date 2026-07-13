import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { removePushSub } from "@/lib/push";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Odebere jeden odběr (podle endpointu) — když si člověk upozornění vypne.
export async function POST(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = (await req.json().catch(() => null)) as { name?: string; endpoint?: string } | null;
  const name = body?.name?.trim();
  const endpoint = body?.endpoint;
  if (!name || !endpoint) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  await removePushSub(name, endpoint);
  return NextResponse.json({ ok: true });
}
