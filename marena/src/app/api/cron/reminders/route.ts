import { NextResponse } from "next/server";
import { readDB } from "@/lib/server-db";
import { sendToNames, pushConfigured } from "@/lib/push";
import { sameName, assigneeHas } from "@/lib/names";
import { isPollClosed } from "@/lib/poll";
import { activeYearId } from "@/lib/years";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Denní připomínka (spouští Vercel Cron ~ve 12:00). Každému, kdo má nesplněný
// úkol nebo neodhlasovanou anketu, cinkne na mobil. Nic dalšího nemění.
// Zabezpečení: když je nastavený CRON_SECRET, musí přijít jako Bearer token.

function taskLabel(n: number): string {
  if (n === 1) return "1 nesplněný úkol";
  if (n >= 2 && n <= 4) return `${n} nesplněné úkoly`;
  return `${n} nesplněných úkolů`;
}
function pollLabel(n: number): string {
  if (n === 1) return "1 anketu k hlasování";
  if (n >= 2 && n <= 4) return `${n} ankety k hlasování`;
  return `${n} anket k hlasování`;
}

async function run(): Promise<{ sent: number; people: number }> {
  const db = await readDB();
  if (!db) return { sent: 0, people: 0 };
  const yid = activeYearId(db);
  const year = db.years.find((y) => y.id === yid);
  if (!year) return { sent: 0, people: 0 };

  let sent = 0;
  let people = 0;
  for (const m of year.members) {
    if (m.approved === false) continue;
    const roles = m.roleIds ?? [];
    const myZoneIds = (year.decorZones ?? []).filter((z) => z.members.some((n) => sameName(n, m.name))).map((z) => z.id);
    const undone = (year.tasks ?? []).filter(
      (t) => !t.done && (assigneeHas(t.assignee, m.name) || (t.roleId && roles.includes(t.roleId)) || (t.zoneId && myZoneIds.includes(t.zoneId))),
    ).length;
    const openPolls = (year.polls ?? []).filter(
      (p) => !isPollClosed(p) && (p.tag !== "vyzdoba" || roles.includes("vyzdoba")) && !p.options.some((o) => o.voters.some((v) => sameName(v, m.name))),
    ).length;
    if (undone === 0 && openPolls === 0) continue;

    const parts: string[] = [];
    if (undone > 0) parts.push(taskLabel(undone));
    if (openPolls > 0) parts.push(pollLabel(openPolls));
    people += 1;
    const ok = await sendToNames([m.name], {
      title: "⏰ Připomínka",
      body: `Máš ${parts.join(" a ")}. Mrkni na Mařenu.`,
      url: "/zazemi",
      tag: "marena-reminder",
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
