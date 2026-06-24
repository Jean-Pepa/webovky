import { NextResponse } from "next/server";
import { getRedis, receiptKey } from "@/lib/redis";
import { isAuthed } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Účtenka (foto jako data URL) uložená zvlášť pod vlastním klíčem.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const redis = getRedis();
  if (!redis) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  if (!(await isAuthed())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const dataUrl = (await redis.get(receiptKey(id))) as string | null;
  if (!dataUrl) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ dataUrl });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const redis = getRedis();
  if (!redis) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  if (!(await isAuthed())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const dataUrl = body?.dataUrl;
  // Účtenky jsou obrázky, kuchyně může mít i jiné soubory (PDF…) — bereme libovolný data: URL.
  if (typeof dataUrl !== "string" || !dataUrl.startsWith("data:")) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  await redis.set(receiptKey(id), dataUrl);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const redis = getRedis();
  if (!redis) return NextResponse.json({ ok: true });
  if (!(await isAuthed())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  await redis.del(receiptKey(id));
  return NextResponse.json({ ok: true });
}
