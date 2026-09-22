import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { isConfigured } from "@/lib/server-db";
import { getMaintenance, setMaintenance, getSiteOff, setSiteOff } from "@/lib/maintenance";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Stav údržby si čte i přihlašovací stránka (veřejně) — proto GET bez přihlášení.
export async function GET() {
  const [maintenance, siteOff] = await Promise.all([getMaintenance(), getSiteOff()]);
  return NextResponse.json({ maintenance, siteOff });
}

// Přepnutí údržby — jen přihlášený (správce; tlačítko je v zázemí jen pro něj).
// Funguje jen se sdíleným úložištěm (Redis); v demo režimu nemá kam uložit.
export async function POST(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false, error: "Nejsi přihlášený." }, { status: 401 });
  }
  if (!isConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Vypínač jde jen se sdíleným úložištěm (Redis). V demo režimu nelze." },
      { status: 400 },
    );
  }
  const body = (await req.json().catch(() => ({}))) as { on?: unknown; all?: unknown };
  // „all" = vypnout/zapnout zázemí i veřejný web najednou (tlačítko „Vypnout web").
  if (typeof body?.all === "boolean") {
    const off = body.all;
    const ok = (await setMaintenance(off)) && (await setSiteOff(off));
    if (!ok) return NextResponse.json({ ok: false, error: "Uložení se nepovedlo." }, { status: 500 });
    return NextResponse.json({ ok: true, maintenance: off, siteOff: off });
  }
  const on = !!body?.on;
  const ok = await setMaintenance(on);
  if (!ok) {
    return NextResponse.json({ ok: false, error: "Uložení se nepovedlo." }, { status: 500 });
  }
  return NextResponse.json({ ok: true, maintenance: on, siteOff: await getSiteOff() });
}
