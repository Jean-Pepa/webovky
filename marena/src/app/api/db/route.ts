import { NextResponse } from "next/server";
import { readDB, applyActionAtomic, isConfigured } from "@/lib/server-db";
import type { Action } from "@/lib/actions";
import { isAuthed } from "@/lib/auth";
import { sendToNames } from "@/lib/push";
import { sameName } from "@/lib/names";
import { ADMIN_NAME } from "@/lib/admin";
import { roleById } from "@/lib/roles";
import type { DB } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Po některých akcích rozešle push. Běží server-side, takže nezávisí na tom,
// jestli má odesílatel otevřený prohlížeč. Selhání pushe nikdy neshodí zápis.
//  • addAnnouncement → vybraným lidem (mimo autora)
//  • addMember (approved:false) / requestRole / addFinance (výdaj) → SPRÁVCI,
//    ať mu na mobil cinkne cokoli, co čeká na schválení.
async function pushForAction(action: Action, db: DB): Promise<void> {
  try {
    if (action.type === "addAnnouncement") {
      const a = action as { yearId: string; text: string; createdBy: string; audience: { all?: boolean; roles?: string[]; people?: string[] } };
      const year = db.years.find((y) => y.id === a.yearId);
      if (!year) return;
      const aud = a.audience || {};
      const names = year.members
        .filter((m) => m.approved !== false && !sameName(m.name, a.createdBy))
        .filter((m) => aud.all || aud.people?.some((p) => sameName(p, m.name)) || (aud.roles?.length ? m.roleIds.some((r) => aud.roles!.includes(r)) : false))
        .map((m) => m.name);
      if (!names.length) return;
      const body = a.text.length > 160 ? a.text.slice(0, 157) + "…" : a.text;
      await sendToNames(names, { title: "📣 Nové oznámení", body, url: "/zazemi", tag: "marena-oznameni" });
      return;
    }

    // Správcovské notifikace — cokoli, co čeká na schválení, cinkne správci.
    let adminBody: string | null = null;
    if (action.type === "addMember") {
      const a = action as { name: string; approved?: boolean };
      if (a.approved === false && !sameName(a.name, ADMIN_NAME)) adminBody = `🆕 Nový účet ke schválení: ${a.name}`;
    } else if (action.type === "requestRole") {
      const a = action as { name: string; roleId: string };
      if (!sameName(a.name, ADMIN_NAME)) adminBody = `🎭 ${a.name} žádá o roli ${roleById(a.roleId)?.name ?? a.roleId}`;
    } else if (action.type === "addFinance") {
      const a = action as { kind: string; who?: string; paid?: boolean; amount: number };
      if (a.kind === "vydaj" && !a.paid && a.who?.trim()) adminBody = `💸 ${a.who} chce proplatit ${a.amount} Kč`;
    }
    if (adminBody) {
      await sendToNames([ADMIN_NAME], { title: "Mařena — ke schválení", body: adminBody, url: "/zazemi", tag: "marena-schvaleni" });
    }
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
  await pushForAction(action, next);
  return NextResponse.json({ db: next });
}
