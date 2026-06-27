import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { isConfigured } from "@/lib/server-db";
import { verifyPassword, setStoredPassword } from "@/lib/password";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Změna hesla do zázemí. Nutné být přihlášen a znát stávající heslo.
// Funguje jen se sdíleným úložištěm (Redis) — v demo režimu nemá kam uložit.
export async function POST(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false, error: "Nejsi přihlášený." }, { status: 401 });
  }
  if (!isConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Změna hesla jde jen se sdíleným úložištěm (Redis). V demo režimu nelze." },
      { status: 400 },
    );
  }
  const body = await req.json().catch(() => ({}));
  const current = String(body?.current ?? "");
  const next = String(body?.next ?? "").trim();
  if (next.length < 4) {
    return NextResponse.json({ ok: false, error: "Nové heslo musí mít aspoň 4 znaky." }, { status: 400 });
  }
  if (!(await verifyPassword(current))) {
    return NextResponse.json({ ok: false, error: "Stávající heslo nesedí." }, { status: 403 });
  }
  const ok = await setStoredPassword(next);
  if (!ok) {
    return NextResponse.json({ ok: false, error: "Uložení se nepovedlo." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
