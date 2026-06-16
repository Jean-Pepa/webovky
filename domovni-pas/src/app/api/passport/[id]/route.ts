import { NextResponse } from "next/server";
import { getRedis, passportKey } from "@/lib/redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Veřejný pas nemovitosti uložený na serveru (aby QR / odkaz fungoval pro kohokoli).
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const redis = getRedis();
  if (!redis) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  const data = await redis.get(passportKey(id));
  if (!data) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const redis = getRedis();
  if (!redis) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  const body = await req.json();
  await redis.set(passportKey(id), body);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const redis = getRedis();
  if (!redis) return NextResponse.json({ ok: true });
  await redis.del(passportKey(id));
  return NextResponse.json({ ok: true });
}
