// Kompletní archiv Mařeny do PDF. Sestaví čistý dokument se VŠEMI informacemi
// (všechny ročníky, seřazené dle dokumentace) + almanach, a otevře tiskový
// dialog prohlížeče, kde stačí zvolit „Uložit jako PDF". Diakritika je v pořádku,
// protože renderuje prohlížeč (žádná externí knihovna).

import type { DB, Year } from "./types";
import { fmtDate, fmtCZK } from "./format";
import { roleById } from "./roles";
import { KINDS } from "./kinds";
import { ALMANACH } from "./almanach";

const INTEREST: Record<string, string> = {
  nevim: "nevím",
  ceka: "čeká na odpověď",
  ano: "má zájem",
  ne: "nemá zájem",
};

function esc(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function rolesNames(ids: string[]): string {
  return ids.map((id) => roleById(id)?.name ?? id).join(", ");
}

function section(title: string, inner: string): string {
  if (!inner.trim()) {
    return `<h2>${esc(title)}</h2><p class="muted">— žádné záznamy —</p>`;
  }
  return `<h2>${esc(title)}</h2>${inner}`;
}

// ---- jednotlivé sekce ročníku -------------------------------------------------

function renderOverview(y: Year): string {
  const rows: [string, string][] = [
    ["Ročník", y.label],
    ["Téma", y.theme ?? "—"],
    ["Termín průvodu / Flédy", y.fledaDate ? fmtDate(y.fledaDate) : "—"],
    ["Plánovaný počet lidí", y.plannedPeople != null ? String(y.plannedPeople) : "—"],
    ["Třídní vklad / osoba", y.deposit != null ? fmtCZK(y.deposit) : "—"],
    ["Založeno", y.createdAt ? fmtDate(y.createdAt) : "—"],
  ];
  return `<table>${rows
    .map(([k, v]) => `<tr><th style="width:34%">${esc(k)}</th><td>${esc(v)}</td></tr>`)
    .join("")}</table>`;
}

function renderTeam(y: Year): string {
  if (!y.members.length) return "";
  return `<table>
    <tr><th>Jméno</th><th>Funkce</th><th>E-mail</th><th>Telefon</th><th>Poznámka</th></tr>
    ${y.members
      .map(
        (m) =>
          `<tr><td>${esc(m.name)}</td><td>${esc(rolesNames(m.roleIds)) || "—"}</td><td>${esc(m.email ?? "")}</td><td>${esc(
            m.phone ?? "",
          )}</td><td>${esc(m.note ?? "")}</td></tr>`,
      )
      .join("")}
  </table>`;
}

function renderBoard(y: Year): string {
  if (!y.posts.length) return "";
  const sorted = [...y.posts].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.createdAt.localeCompare(a.createdAt);
  });
  return sorted
    .map((p) => {
      const role = p.roleId ? roleById(p.roleId)?.name : "";
      const meta = [p.author, role].filter(Boolean).join(" · ");
      return `<div class="item">
        <strong>${p.pinned ? "📌 " : ""}${esc(p.title)}</strong>
        <div class="muted">${esc(meta)} — ${esc(fmtDate(p.createdAt))}</div>
        <div>${esc(p.body).replace(/\n/g, "<br>")}</div>
      </div>`;
    })
    .join("");
}

function renderPolls(y: Year): string {
  if (!y.polls.length) return "";
  return y.polls
    .map((poll) => {
      const opts = poll.options
        .map(
          (o) =>
            `<li>${esc(o.label)} — <strong>${o.voters.length}</strong>${
              o.voters.length ? ` (${esc(o.voters.join(", "))})` : ""
            }</li>`,
        )
        .join("");
      return `<div class="item">
        <strong>${esc(poll.question)}</strong> ${poll.closed ? '<span class="muted">(uzavřeno)</span>' : ""}
        <div class="muted">založil/a ${esc(poll.author)} — ${esc(fmtDate(poll.createdAt))}${
          poll.multi ? " · vícevýběr" : ""
        }</div>
        <ul>${opts}</ul>
      </div>`;
    })
    .join("");
}

function renderCalendar(y: Year): string {
  if (!y.events.length) return "";
  const sorted = [...y.events].sort(
    (a, b) => (a.date || "").localeCompare(b.date || "") || (a.time || "").localeCompare(b.time || ""),
  );
  return `<table>
    <tr><th>Datum</th><th>Čas</th><th>Událost</th><th>Typ</th><th>Poznámka</th></tr>
    ${sorted
      .map((e) => {
        const date = e.endDate && e.endDate !== e.date ? `${fmtDate(e.date)} – ${fmtDate(e.endDate)}` : fmtDate(e.date);
        return `<tr><td>${esc(date)}</td><td>${esc(e.time ?? "")}</td><td>${esc(e.title)}</td><td>${esc(
          KINDS[e.kind]?.label ?? e.kind,
        )}</td><td>${esc(e.note ?? "")}</td></tr>`;
      })
      .join("")}
  </table>`;
}

function renderProgram(y: Year): string {
  const invites = y.invites ?? [];
  if (!invites.length) return "";
  const byCat = new Map<string, typeof invites>();
  for (const i of invites) {
    const k = i.category || "Ostatní";
    if (!byCat.has(k)) byCat.set(k, []);
    byCat.get(k)!.push(i);
  }
  return [...byCat.entries()]
    .map(([cat, list]) => {
      const rows = [...list]
        .sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999))
        .map(
          (i) =>
            `<tr><td>${esc(i.name)}</td><td>${i.contacted ? "ano" : "ne"}</td><td>${esc(
              INTEREST[i.interest] ?? i.interest,
            )}</td><td>${esc(i.availability ?? "")}</td><td>${esc(i.price ?? "")}</td><td>${esc(
              i.confirmedDate ?? "",
            )}</td><td>${esc(i.note ?? "")}</td></tr>`,
        )
        .join("");
      return `<h3>${esc(cat)}</h3><table>
        <tr><th>Kdo</th><th>Osloveno</th><th>Zájem</th><th>Kdy může</th><th>Cena</th><th>Potvrzeno</th><th>Pozn.</th></tr>
        ${rows}
      </table>`;
    })
    .join("");
}

function renderTasks(y: Year): string {
  if (!y.tasks.length) return "";
  return `<table>
    <tr><th>Stav</th><th>Úkol</th><th>Funkce</th><th>Kdo</th><th>Termín</th></tr>
    ${y.tasks
      .map(
        (t) =>
          `<tr><td>${t.done ? "✅ hotovo" : "☐ otevřené"}</td><td>${esc(t.title)}</td><td>${esc(
            t.roleId ? roleById(t.roleId)?.name ?? "" : "",
          )}</td><td>${esc(t.assignee ?? "")}</td><td>${esc(t.due ? fmtDate(t.due) : "")}</td></tr>`,
      )
      .join("")}
  </table>`;
}

function renderShifts(y: Year): string {
  const shifts = y.shifts ?? [];
  if (!shifts.length) return "";
  return `<table>
    <tr><th>Oblast</th><th>Co</th><th>Datum</th><th>Od–do</th><th>Obsazení</th><th>Lidé</th><th>Pozn.</th></tr>
    ${shifts
      .map((s) => {
        const cap = s.capacity > 0 ? `${s.people.length}/${s.capacity}` : `${s.people.length}`;
        const time = [s.from, s.to].filter(Boolean).join("–");
        return `<tr><td>${esc(s.area)}</td><td>${esc(s.title ?? "")}</td><td>${esc(
          s.date ? fmtDate(s.date) : "",
        )}</td><td>${esc(time)}</td><td>${esc(cap)}</td><td>${esc(s.people.join(", "))}</td><td>${esc(
          s.note ?? "",
        )}</td></tr>`;
      })
      .join("")}
  </table>`;
}

function renderFinance(y: Year): string {
  const fin = y.finances ?? [];
  if (!fin.length) return "";
  let prijmy = 0;
  let vydaje = 0;
  for (const f of fin) {
    if (f.kind === "prijem") prijmy += f.amount;
    else vydaje += f.amount;
  }
  const rows = [...fin]
    .sort((a, b) => (b.date || b.createdAt).localeCompare(a.date || a.createdAt))
    .map(
      (f) =>
        `<tr><td>${f.kind === "prijem" ? "Příjem" : "Výdaj"}</td><td>${esc(f.label)}</td><td>${esc(
          f.category ?? "",
        )}</td><td>${esc(f.who ?? "")}</td><td>${esc(f.date ? fmtDate(f.date) : "")}</td><td>${
          f.paid ? "ano" : "ne"
        }</td><td style="text-align:right">${f.kind === "prijem" ? "+" : "−"}${esc(fmtCZK(f.amount))}</td></tr>`,
    )
    .join("");
  return `<table>
    <tr><th>Druh</th><th>Popis</th><th>Kategorie</th><th>Kdo</th><th>Datum</th><th>Zapl.</th><th style="text-align:right">Částka</th></tr>
    ${rows}
    <tr><th colspan="6">Příjmy celkem</th><th style="text-align:right">${esc(fmtCZK(prijmy))}</th></tr>
    <tr><th colspan="6">Výdaje celkem</th><th style="text-align:right">${esc(fmtCZK(vydaje))}</th></tr>
    <tr><th colspan="6">Bilance</th><th style="text-align:right">${esc(fmtCZK(prijmy - vydaje))}</th></tr>
  </table>`;
}

function renderContacts(y: Year): string {
  const links = y.links ?? [];
  if (!links.length) return "";
  const byFolder = new Map<string, typeof links>();
  for (const l of links) {
    const k = l.folder || "Ostatní";
    if (!byFolder.has(k)) byFolder.set(k, []);
    byFolder.get(k)!.push(l);
  }
  return [...byFolder.entries()]
    .map(
      ([folder, list]) =>
        `<h3>${esc(folder)}</h3><ul>${list
          .map(
            (l) =>
              `<li><strong>${esc(l.label)}</strong>: ${esc(l.value)}${l.note ? ` <span class="muted">(${esc(l.note)})</span>` : ""}</li>`,
          )
          .join("")}</ul>`,
    )
    .join("");
}

function renderYear(y: Year): string {
  return `<section class="year">
    <h1>${esc(y.label)}</h1>
    ${section("Přehled ročníku", renderOverview(y))}
    ${section("Tým a role", renderTeam(y))}
    ${section("Nástěnka", renderBoard(y))}
    ${section("Hlasování", renderPolls(y))}
    ${section("Kalendář", renderCalendar(y))}
    ${section("Program (přednášející, kapely)", renderProgram(y))}
    ${section("Úkoly", renderTasks(y))}
    ${section("Provoz a směny", renderShifts(y))}
    ${section("Finance", renderFinance(y))}
    ${section("Kontakty", renderContacts(y))}
  </section>`;
}

function renderAlmanach(): string {
  const chapters = ALMANACH.map(
    (s) => `<div class="item">
      <h3>${esc(s.emoji)} ${esc(s.title)}</h3>
      <p>${esc(s.intro)}</p>
      ${s.tips.length ? `<ul>${s.tips.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
      ${s.callouts
        .map((c) => `<p><strong>${esc(c.kind === "pozor" ? "Pozor" : c.kind === "kontakt" ? "Kontakt" : "Tip")}:</strong> ${esc(c.text)}</p>`)
        .join("")}
    </div>`,
  ).join("");
  return `<section class="year"><h1>Almanach — manuál Mařeny</h1>${chapters}</section>`;
}

function buildArchiveHtml(db: DB, stamp: string): string {
  const years = [...db.years].sort((a, b) => a.id.localeCompare(b.id, "cs", { numeric: true }));
  const obsah = years.map((y) => `<li>${esc(y.label)}</li>`).join("");
  const body = years.map(renderYear).join("");

  return `<!doctype html>
<html lang="cs"><head><meta charset="utf-8">
<title>Marena_archiv_${esc(stamp)}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, "Segoe UI", Roboto, Arial, sans-serif; color:#1d1d1f; margin:0; line-height:1.5; font-size:12px; }
  .wrap { max-width: 800px; margin: 0 auto; padding: 24px; }
  h1 { font-size: 24px; margin: 0 0 4px; }
  h2 { font-size: 17px; color:#c20e2c; border-bottom:2px solid #c20e2c; padding-bottom:3px; margin:22px 0 8px; }
  h3 { font-size: 14px; margin:14px 0 4px; }
  p { margin: 4px 0; }
  .muted { color:#6e6e73; font-size: 11px; }
  table { border-collapse: collapse; width:100%; font-size:11px; margin:4px 0 10px; }
  th, td { border:1px solid #ddd; padding:4px 6px; text-align:left; vertical-align:top; }
  th { background:#f5f5f7; }
  ul { margin:4px 0; padding-left:18px; }
  .item { margin:6px 0; padding-bottom:6px; border-bottom:1px solid #eee; }
  .cover { text-align:center; padding:60px 24px 30px; }
  .cover .big { font-size:34px; font-weight:700; color:#c20e2c; letter-spacing:.04em; }
  .toolbar { position: sticky; top:0; background:#fff; border-bottom:1px solid #eee; padding:10px 24px; display:flex; gap:12px; align-items:center; }
  .btn { background:#c20e2c; color:#fff; border:none; border-radius:999px; padding:8px 16px; font-size:13px; cursor:pointer; }
  .year { page-break-before: always; }
  @page { size: A4; margin: 16mm; }
  @media print { .toolbar { display:none; } .wrap { max-width:none; padding:0; } }
</style></head>
<body>
  <div class="toolbar">
    <button class="btn" onclick="window.print()">Uložit jako PDF / Vytisknout</button>
    <span class="muted">V dialogu zvolte cíl „Uložit jako PDF". Tento dokument slouží k úschově na další roky.</span>
  </div>
  <div class="wrap">
    <div class="cover">
      <div class="big">MAŘENA</div>
      <h1>Kompletní archiv</h1>
      <p class="muted">Vygenerováno ${esc(stamp)} · Fakulta architektury VUT</p>
      <p>Obsah (ročníky):</p>
      <ul style="display:inline-block; text-align:left">${obsah}</ul>
    </div>
    ${body}
    ${renderAlmanach()}
  </div>
</body></html>`;
}

// Otevře nové okno s archivem a spustí tisk (→ Uložit jako PDF).
export function downloadArchive(db: DB): void {
  const now = new Date();
  const stamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const html = buildArchiveHtml(db, stamp);
  const w = window.open("", "_blank");
  if (!w) {
    alert("Pro stažení PDF prosím povolte vyskakovací okna (pop-up) pro tento web a zkuste to znovu.");
    return;
  }
  w.document.open();
  w.document.write(html);
  w.document.close();
  w.focus();
  // Počkat na vykreslení, pak otevřít tiskový dialog.
  setTimeout(() => {
    try {
      w.print();
    } catch {
      /* uživatel může použít tlačítko v okně */
    }
  }, 500);
}
