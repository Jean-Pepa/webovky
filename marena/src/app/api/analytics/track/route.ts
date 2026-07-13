import { NextResponse } from "next/server";
import { recordEvents, type IncomingEvent } from "@/lib/analytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Příjem událostí z prohlížeče (i od nepřihlášených návštěvníků). Volá se přes
// navigator.sendBeacon, takže tělo čteme jako text a rozparsujeme ručně. IP a
// User-Agent bereme ze serverových hlaviček (klient je neposílá).
export async function POST(req: Request) {
  let body: { events?: IncomingEvent[] } | null = null;
  try {
    body = JSON.parse(await req.text());
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const events = body?.events;
  if (!Array.isArray(events)) return NextResponse.json({ ok: false }, { status: 400 });

  const fwd = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "";
  const ip = fwd.split(",")[0].trim() || "0.0.0.0";
  const ua = req.headers.get("user-agent") || "";

  await recordEvents(events, ip, ua);
  return NextResponse.json({ ok: true });
}
