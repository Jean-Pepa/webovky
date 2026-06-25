import { NextResponse } from "next/server";
import { readDB } from "@/lib/server-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Veřejné — vrátí nejnovější ročník, na který má veřejná stránka /merch zamířit.
export async function GET() {
  const db = await readDB();
  if (!db) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  if (!db.years.length) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const newest = [...db.years].sort((a, b) => b.id.localeCompare(a.id, "cs", { numeric: true }))[0];
  return NextResponse.json({ yearId: newest.id });
}
