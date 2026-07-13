import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { sendToNamesDetailed, pushConfigured } from "@/lib/push";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Testovací notifikace — pošle „to funguje" push danému jménu. Spustí ji buď
// přihlášený uživatel (tlačítko v nastavení upozornění, na svoje jméno), nebo
// někdo s CRON_SECRET (Bearer) na libovolné jméno (pro rychlý test správce).
export async function POST(req: Request) {
  const secret = process.env.CRON_SECRET;
  const bySecret = !!secret && req.headers.get("authorization") === `Bearer ${secret}`;
  if (!bySecret && !(await isAuthed())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!pushConfigured()) return NextResponse.json({ ok: false, error: "push_not_configured" }, { status: 400 });
  const body = (await req.json().catch(() => null)) as { name?: string } | null;
  const name = body?.name?.trim();
  if (!name) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  const report = await sendToNamesDetailed([name], {
    title: "🔔 Testovací notifikace",
    body: "Funguje to! Takhle ti budou chodit upozornění z Mařeny.",
    url: "/zazemi",
    tag: "marena-test",
  });
  return NextResponse.json({ ok: true, ...report });
}
