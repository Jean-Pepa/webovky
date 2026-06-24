import { NextResponse } from "next/server";
import { readDB, writeDB, isConfigured } from "@/lib/server-db";
import { applyAction, type Action } from "@/lib/actions";
import { isAuthed } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET — celá DB. 503 = backend (Redis) není nastavený → klient jede z localStorage.
export async function GET() {
  if (!isConfigured()) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  if (!(await isAuthed())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const db = await readDB();
  return NextResponse.json({ db });
}

// POST — aplikuje jednu akci a vrátí aktualizovanou DB (read-modify-write).
export async function POST(req: Request) {
  if (!isConfigured()) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  if (!(await isAuthed())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const action = (await req.json().catch(() => null)) as Action | null;
  if (!action || typeof action.type !== "string") {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const current = await readDB();
  if (!current) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const next = applyAction(current, action);
  await writeDB(next);
  return NextResponse.json({ db: next });
}
