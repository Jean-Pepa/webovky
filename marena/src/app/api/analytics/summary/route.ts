import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { getSummary, persistAllAnalytics } from "@/lib/analytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Přehled pro správce. Vyžaduje přihlášení do zázemí; samotná stránka je navíc
// schovaná jen správci (isAdmin) na klientu — stejný model jako zbytek appky.
export async function GET(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  // Až 400 dní — archiv do PDF si bere celý ročník.
  const days = Math.min(400, Math.max(1, Number(new URL(req.url).searchParams.get("days")) || 14));
  // Zrušit případné staré expirace (data se nemažou) — nejvýš jednou za hodinu.
  await persistAllAnalytics();
  const summary = await getSummary(days);
  return NextResponse.json(summary);
}
