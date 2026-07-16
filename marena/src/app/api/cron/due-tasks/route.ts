import { NextResponse } from "next/server";
import { readDB } from "@/lib/server-db";
import { sendToNames, pushConfigured } from "@/lib/push";
import { sameName, assigneeHas } from "@/lib/names";
import { activeYearId } from "@/lib/years";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Připomínka termínu úkolu — běží každé ráno (Vercel Cron „0 6 * * *" = 6:00 UTC
// = 8:00 v létě / 7:00 v zimě). Kdo má DNES termín u nesplněného úkolu, tomu ráno
// cinkne na mobil. Nic v datech nemění.
// Zabezpečení: když je nastavený CRON_SECRET, musí přijít jako Bearer token.

// Datum v pražském čase (YYYY-MM-DD) — stejný formát, jaký ukládá <input type="date">.
function pragueToday(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Prague" }).format(new Date());
}
function tasksWord(n: number): string {
  return n >= 2 && n <= 4 ? "úkoly" : "úkolů";
}

async function run(): Promise<{ sent: number; people: number }> {
  const db = await readDB();
  if (!db) return { sent: 0, people: 0 };
  const yid = activeYearId(db);
  const year = db.years.find((y) => y.id === yid);
  if (!year) return { sent: 0, people: 0 };

  const today = pragueToday();
  let sent = 0;
  let people = 0;
  for (const m of year.members) {
    if (m.approved === false) continue;
    const roles = m.roleIds ?? [];
    const myZoneIds = (year.decorZones ?? []).filter((z) => z.members.some((n) => sameName(n, m.name))).map((z) => z.id);
    // Nesplněné úkoly, které jsou moje (jméno / role / zóna) a mají termín právě dnes.
    const dueToday = (year.tasks ?? []).filter(
      (t) =>
        !t.done &&
        t.due === today &&
        (assigneeHas(t.assignee, m.name) || (t.roleId && roles.includes(t.roleId)) || (t.zoneId && myZoneIds.includes(t.zoneId))),
    );
    if (dueToday.length === 0) continue;

    people += 1;
    const body =
      dueToday.length === 1
        ? dueToday[0].title
        : `${dueToday.length} ${tasksWord(dueToday.length)} má dnes termín: ${dueToday.map((t) => t.title).join(", ")}`;
    const ok = await sendToNames([m.name], {
      title: "⏰ Dnes máš termín",
      body: body.length > 160 ? body.slice(0, 157) + "…" : body,
      url: "/zazemi/ukoly",
      tag: "marena-due",
    });
    sent += ok;
  }
  return { sent, people };
}

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!pushConfigured()) return NextResponse.json({ ok: true, skipped: "push_not_configured" });
  const res = await run();
  return NextResponse.json({ ok: true, ...res });
}
