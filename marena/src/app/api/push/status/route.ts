import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { pushNames } from "@/lib/push";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Normalizovaná jména všech, kdo mají zapnutá upozornění — pro přehled správce
// v Týmu (kdo to má / nemá). Klient si jména párá přes normName.
export async function GET() {
  if (!(await isAuthed())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({ names: await pushNames() });
}
