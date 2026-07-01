import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { isConfigured } from "@/lib/server-db";
import { getHomepage, setHomepage } from "@/lib/homepage-server";
import type { HomeContent } from "@/lib/homepage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Obsah homepage si čte veřejný web (bez přihlášení) — proto GET bez autorizace.
export async function GET() {
  return NextResponse.json({ content: await getHomepage() });
}

// Uložení obsahu — jen přihlášený správce. Funguje jen se sdíleným úložištěm
// (Redis); v demu se ukládá do localStorage v prohlížeči (řeší klient).
export async function POST(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false, error: "Nejsi přihlášený." }, { status: 401 });
  }
  if (!isConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Ukládání na server jde jen s Redisem. V demu se uloží jen v prohlížeči." },
      { status: 400 },
    );
  }
  const body = (await req.json().catch(() => null)) as HomeContent | null;
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Neplatná data." }, { status: 400 });
  }
  const ok = await setHomepage(body);
  if (!ok) {
    return NextResponse.json({ ok: false, error: "Uložení se nepovedlo." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
