import { NextResponse } from "next/server";
import { readDB, applyActionAtomic, isConfigured } from "@/lib/server-db";
import type { Action } from "@/lib/actions";
import { isAuthed } from "@/lib/auth";
import { sendToNames } from "@/lib/push";
import { sameName } from "@/lib/names";
import type { DB } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Po vzniku oznámení rozešle push notifikaci vybraným lidem (mimo autora).
// Běží server-side, takže nezávisí na tom, jestli má správce otevřený prohlížeč.
// Selhání pushe nikdy neshodí uložení oznámení.
async function pushForAnnouncement(action: Action, db: DB): Promise<void> {
  if (action.type !== "addAnnouncement") return;
  const a = action as { yearId: string; text: string; createdBy: string; audience: { all?: boolean; roles?: string[]; people?: string[] } };
  const year = db.years.find((y) => y.id === a.yearId);
  if (!year) return;
  const aud = a.audience || {};
  const names = year.members
    .filter((m) => m.approved !== false && !sameName(m.name, a.createdBy))
    .filter(
      (m) =>
        aud.all ||
        aud.people?.some((p) => sameName(p, m.name)) ||
        (aud.roles?.length ? m.roleIds.some((r) => aud.roles!.includes(r)) : false),
    )
    .map((m) => m.name);
  if (!names.length) return;
  const body = a.text.length > 160 ? a.text.slice(0, 157) + "…" : a.text;
  try {
    await sendToNames(names, { title: "📣 Nové oznámení", body, url: "/zazemi", tag: "marena-oznameni" });
  } catch {
    /* push je best-effort */
  }
}

// GET — celá DB. 503 = backend (Redis) není nastavený → klient jede z localStorage.
export async function GET() {
  if (!isConfigured()) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  if (!(await isAuthed())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const db = await readDB();
  return NextResponse.json({ db });
}

// POST — atomicky aplikuje jednu akci (optimistický zámek) a vrátí novou DB.
export async function POST(req: Request) {
  if (!isConfigured()) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  if (!(await isAuthed())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const action = (await req.json().catch(() => null)) as Action | null;
  if (!action || typeof action.type !== "string") {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const next = await applyActionAtomic(action);
  if (!next) return NextResponse.json({ error: "conflict" }, { status: 409 });
  await pushForAnnouncement(action, next);
  return NextResponse.json({ db: next });
}
