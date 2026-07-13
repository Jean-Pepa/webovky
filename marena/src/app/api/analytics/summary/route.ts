import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { getSummary } from "@/lib/analytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Přehled pro správce. Vyžaduje přihlášení do zázemí; samotná stránka je navíc
// schovaná jen správci (isAdmin) na klientu — stejný model jako zbytek appky.
export async function GET(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const days = Math.min(60, Math.max(1, Number(new URL(req.url).searchParams.get("days")) || 14));
  const summary = await getSummary(days);
  return NextResponse.json(summary);
}
