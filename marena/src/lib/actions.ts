// Čistý reducer nad DB. Stejná logika běží na serveru (Redis) i v prohlížeči
// (localStorage demo režim) — proto je bezstavová a deterministická až na uid().

import type { DB, Year, Member, EventKind, FinanceKind, Task, Invite, MerchOrderItem } from "./types";
import { uid } from "./id";
import { ROLE_TASKS } from "./roleTasks";
import { sameName } from "./names";

// Vygeneruje výchozí úkoly „rozdané" na jednotlivé role (z manuálu).
export function defaultRoleTasks(createdAt: string): Task[] {
  const out: Task[] = [];
  for (const [roleId, titles] of Object.entries(ROLE_TASKS)) {
    for (const title of titles) {
      out.push({ id: uid("t_"), title, roleId, done: false, createdAt });
    }
  }
  return out;
}

export type Action =
  | { type: "createYear"; id: string; label?: string; theme?: string; fledaDate?: string; copyFromYearId?: string }
  | { type: "updateYear"; yearId: string; patch: Partial<Pick<Year, "label" | "theme" | "fledaDate" | "plannedPeople" | "deposit">> }
  | { type: "deleteYear"; yearId: string }
  | { type: "addMember"; yearId: string; name: string; roleIds: string[]; email?: string; phone?: string; contact?: string; note?: string; approved?: boolean }
  | { type: "approveMember"; yearId: string; memberId: string }
  | { type: "updateMember"; yearId: string; memberId: string; patch: { name?: string; roleIds?: string[]; email?: string; phone?: string; contact?: string; note?: string } }
  | { type: "removeMember"; yearId: string; memberId: string }
  // Kompletní smazání účtu — vždy člena, volitelně i jeho příspěvky, hlasy a směny.
  | { type: "purgeMember"; yearId: string; memberId: string; name: string; opts: { posts?: boolean; votes?: boolean; shifts?: boolean } }
  // Vzít si roli (vytvoří/upraví člena a přidá roli). asLead / první držitel = vedoucí.
  | { type: "takeRole"; yearId: string; memberId?: string; name: string; email?: string; phone?: string; roleId: string; asLead: boolean }
  | { type: "setRoleLead"; yearId: string; roleId: string; memberId: string }
  | { type: "addPost"; yearId: string; author: string; roleId?: string; title: string; body: string; pinned?: boolean }
  | { type: "updatePost"; yearId: string; postId: string; editedBy: string; patch: { title?: string; body?: string; roleId?: string | null } }
  | { type: "togglePin"; yearId: string; postId: string }
  | { type: "removePost"; yearId: string; postId: string }
  | { type: "addPoll"; yearId: string; author: string; question: string; options: string[]; multi?: boolean }
  | { type: "vote"; yearId: string; pollId: string; optionId: string; voter: string }
  | { type: "removeVoter"; yearId: string; pollId: string; optionId: string; voter: string }
  | { type: "closePoll"; yearId: string; pollId: string }
  | { type: "removePoll"; yearId: string; pollId: string }
  | { type: "addEvent"; yearId: string; date: string; endDate?: string; time?: string; title: string; kind: EventKind; note?: string; author: string }
  | { type: "updateEvent"; yearId: string; eventId: string; patch: { title?: string; date?: string; endDate?: string; time?: string; kind?: EventKind; note?: string } }
  | { type: "removeEvent"; yearId: string; eventId: string }
  | { type: "addTask"; yearId: string; title: string; roleId?: string; assignee?: string; due?: string }
  | { type: "toggleTask"; yearId: string; taskId: string }
  | { type: "removeTask"; yearId: string; taskId: string }
  | { type: "addLink"; yearId: string; label: string; value: string; folder?: string; note?: string }
  | { type: "removeLink"; yearId: string; linkId: string }
  | { type: "addFinance"; yearId: string; kind: FinanceKind; label: string; amount: number; net?: number; category?: string; who?: string; paid?: boolean; date?: string; note?: string }
  | { type: "openCashbox"; yearId: string; label?: string; opening: number }
  | { type: "closeCashbox"; yearId: string; cashboxId: string; closing: number }
  | { type: "removeCashbox"; yearId: string; cashboxId: string }
  | { type: "addContribution"; yearId: string; name: string; amount: number }
  | { type: "toggleContributionReturned"; yearId: string; contributionId: string }
  | { type: "updateContribution"; yearId: string; contributionId: string; patch: { name?: string; amount?: number } }
  | { type: "removeContribution"; yearId: string; contributionId: string }
  | { type: "addFreshman"; yearId: string; name: string; email?: string; note?: string }
  | { type: "updateFreshman"; yearId: string; freshmanId: string; patch: { name?: string; email?: string; note?: string } }
  | { type: "removeFreshman"; yearId: string; freshmanId: string }
  | { type: "addDecor"; yearId: string; title: string; who?: string; link?: string; note?: string }
  | { type: "updateDecor"; yearId: string; decorId: string; patch: { title?: string; status?: "napad" | "shani" | "hotovo"; who?: string; link?: string; note?: string } }
  | { type: "removeDecor"; yearId: string; decorId: string }
  | { type: "addSponsor"; yearId: string; name: string; gives?: string; who?: string; link?: string; note?: string }
  | { type: "updateSponsor"; yearId: string; sponsorId: string; patch: { name?: string; gives?: string; status?: "oslovit" | "ceka" | "potvrzeno" | "odmitl"; who?: string; link?: string; note?: string } }
  | { type: "removeSponsor"; yearId: string; sponsorId: string }
  | { type: "addDrink"; yearId: string; name: string; kind: "koktejl" | "panak" | "snidane" | "obed" | "jine"; place: "bar" | "kuchyne"; day?: "po" | "ut" | "st" | "ct" | "pa" | "so" | "ne" }
  | { type: "updateDrink"; yearId: string; drinkId: string; patch: { name?: string; kind?: "koktejl" | "panak" | "snidane" | "obed" | "jine"; day?: "po" | "ut" | "st" | "ct" | "pa" | "so" | "ne" | null; price?: number; note?: string; ingredients?: { name: string; cost: number }[] } }
  | { type: "removeDrink"; yearId: string; drinkId: string }
  | { type: "addMenuEntry"; yearId: string; day: string; meal: "snidane" | "obed" | "jine"; dish: string }
  | { type: "removeMenuEntry"; yearId: string; entryId: string }
  | { type: "addShoppingItem"; yearId: string; name: string; qty?: string; place: "bar" | "kuchyne" }
  | { type: "toggleShoppingBought"; yearId: string; itemId: string }
  | { type: "removeShoppingItem"; yearId: string; itemId: string }
  | { type: "clearBoughtShopping"; yearId: string; place: "bar" | "kuchyne" }
  | { type: "updateFinance"; yearId: string; financeId: string; patch: { label?: string; amount?: number; net?: number; category?: string; who?: string; paid?: boolean; date?: string; note?: string; receiptId?: string; receiptIds?: string[] } }
  | { type: "toggleFinancePaid"; yearId: string; financeId: string }
  | { type: "removeFinance"; yearId: string; financeId: string }
  | { type: "addShift"; yearId: string; area: string; title?: string; date?: string; from?: string; to?: string; capacity?: number; note?: string }
  | { type: "signShift"; yearId: string; shiftId: string; name: string }
  | { type: "signShiftBackup"; yearId: string; shiftId: string; name: string }
  | { type: "removeShiftPerson"; yearId: string; shiftId: string; name: string }
  | { type: "removeShift"; yearId: string; shiftId: string }
  | { type: "addInvite"; yearId: string; category: string; name: string; link?: string; priority?: number }
  | { type: "updateInvite"; yearId: string; inviteId: string; patch: Partial<Pick<Invite, "category" | "name" | "link" | "priority" | "contacted" | "interest" | "availability" | "price" | "confirmedDate" | "note">> }
  | { type: "removeInvite"; yearId: string; inviteId: string }
  | { type: "addKitchenFile"; yearId: string; label: string; category: string; blobId: string; fileKind: "image" | "file"; fileName?: string; note?: string; author: string; place?: "bar" | "kuchyne" }
  | { type: "removeKitchenFile"; yearId: string; fileId: string }
  // Merch — nabídka produktů (správce / role merch) a objednávky (veřejná stránka).
  | { type: "addMerchProduct"; yearId: string; name: string; price?: number; blobId?: string; sizes?: string[]; colors?: string[]; stock?: number; note?: string }
  | { type: "updateMerchProduct"; yearId: string; productId: string; patch: { name?: string; price?: number; blobId?: string; sizes?: string[]; colors?: string[]; stock?: number; note?: string } }
  | { type: "removeMerchProduct"; yearId: string; productId: string }
  | { type: "addMerchOrder"; yearId: string; name: string; phone?: string; email?: string; items: MerchOrderItem[]; note?: string }
  | { type: "toggleMerchOrderDone"; yearId: string; orderId: string }
  | { type: "removeMerchOrder"; yearId: string; orderId: string }
  // Uvolnění místa: smaže všechny fotky/účtenky ročníku (reference v DB; samotné
  // bloby maže klient zvlášť). Texty (finance, popisy) zůstávají.
  | { type: "clearYearMedia"; yearId: string };

function now(): string {
  return new Date().toISOString();
}

// "HH:MM" z ISO časového razítka.
function hhmm(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

// Očistí seznam textů (velikosti, barvy) — ořízne a vyhodí prázdné; prázdný → undefined.
function cleanList(arr?: string[]): string[] | undefined {
  if (!arr) return undefined;
  const out = arr.map((s) => s.trim()).filter(Boolean);
  return out.length ? out : undefined;
}

// Vrátí novou DB s aplikovanou změnou na daný ročník.
function mapYear(db: DB, yearId: string, fn: (y: Year) => Year): DB {
  return { ...db, years: db.years.map((y) => (y.id === yearId ? fn(y) : y)) };
}

// Udrží mapu vedoucích rolí v konzistenci: zahodí neplatné (drží roli nedrží),
// a každé obsazené roli bez vedoucího doplní vedoucího = nejdřív zapsaný člen.
function normalizeLeads(y: Year): Year {
  const leads: Record<string, string> = { ...(y.roleLeads ?? {}) };
  const holdersByRole = new Map<string, Member[]>();
  for (const m of y.members) {
    for (const rid of m.roleIds) {
      const arr = holdersByRole.get(rid) ?? [];
      arr.push(m);
      holdersByRole.set(rid, arr);
    }
  }
  for (const rid of Object.keys(leads)) {
    const holders = holdersByRole.get(rid);
    if (!holders || !holders.some((h) => h.id === leads[rid])) delete leads[rid];
  }
  for (const [rid, holders] of holdersByRole) {
    if (!leads[rid]) leads[rid] = [...holders].sort((a, b) => a.createdAt.localeCompare(b.createdAt))[0].id;
  }
  return { ...y, roleLeads: leads };
}

export function applyAction(db: DB, a: Action): DB {
  switch (a.type) {
    case "createYear": {
      if (db.years.some((y) => y.id === a.id)) return db;
      const t = now();
      // Předání mezi ročníky: kontakty se přenášejí celé, program jen jako
      // shortlist se zresetovaným stavem domlouvání (nový tým začne načisto).
      const src = a.copyFromYearId ? db.years.find((y) => y.id === a.copyFromYearId) : undefined;
      const links = (src?.links ?? []).map((l) => ({ ...l, id: uid("l_"), createdAt: t }));
      const invites = (src?.invites ?? []).map((i) => ({
        id: uid("i_"),
        category: i.category,
        name: i.name,
        link: i.link,
        priority: i.priority,
        contacted: false,
        interest: "nevim" as const,
        createdAt: t,
      }));
      const year: Year = {
        id: a.id,
        label: a.label?.trim() || `Mařena ${a.id}`,
        theme: a.theme?.trim() || undefined,
        fledaDate: a.fledaDate || undefined,
        plannedPeople: src?.plannedPeople ?? 30,
        deposit: src?.deposit ?? 1500,
        members: [],
        posts: [],
        polls: [],
        events: [],
        tasks: defaultRoleTasks(t), // úkoly rozdané dopředu na role
        links,
        finances: [],
        shifts: [],
        invites,
        createdAt: t,
      };
      return { ...db, years: [year, ...db.years] };
    }
    case "updateYear":
      return mapYear(db, a.yearId, (y) => ({ ...y, ...a.patch }));
    case "deleteYear":
      return { ...db, years: db.years.filter((y) => y.id !== a.yearId) };

    case "addMember":
      return mapYear(db, a.yearId, (y) =>
        normalizeLeads({
          ...y,
          members: [
            ...y.members,
            {
              id: uid("m_"),
              name: a.name.trim(),
              roleIds: a.roleIds,
              email: a.email?.trim() || undefined,
              phone: a.phone?.trim() || undefined,
              contact: a.contact?.trim() || undefined,
              note: a.note?.trim() || undefined,
              approved: a.approved,
              createdAt: now(),
            },
          ],
        }),
      );
    case "approveMember":
      return mapYear(db, a.yearId, (y) => ({
        ...y,
        members: y.members.map((m) => (m.id === a.memberId ? { ...m, approved: true } : m)),
      }));
    case "updateMember":
      return mapYear(db, a.yearId, (y) =>
        normalizeLeads({
          ...y,
          members: y.members.map((m) => (m.id === a.memberId ? { ...m, ...a.patch } : m)),
        }),
      );
    case "removeMember":
      return mapYear(db, a.yearId, (y) => normalizeLeads({ ...y, members: y.members.filter((m) => m.id !== a.memberId) }));
    case "purgeMember":
      return mapYear(db, a.yearId, (y) => {
        const next: Year = { ...y, members: y.members.filter((m) => m.id !== a.memberId) };
        if (a.opts.posts) next.posts = next.posts.filter((p) => !sameName(p.author, a.name));
        if (a.opts.votes)
          next.polls = next.polls.map((poll) => ({
            ...poll,
            options: poll.options.map((o) => ({ ...o, voters: o.voters.filter((v) => !sameName(v, a.name)) })),
          }));
        if (a.opts.shifts)
          next.shifts = (y.shifts ?? []).map((s) => ({
            ...s,
            people: s.people.filter((n) => !sameName(n, a.name)),
            backup: (s.backup ?? []).filter((n) => !sameName(n, a.name)),
          }));
        return normalizeLeads(next);
      });
    case "takeRole":
      return mapYear(db, a.yearId, (y) => {
        const name = a.name.trim();
        const wasEmpty = !y.members.some((m) => m.roleIds.includes(a.roleId));
        let members = y.members;
        const target = a.memberId ? members.find((m) => m.id === a.memberId) : members.find((m) => sameName(m.name, name));
        let memberId: string;
        if (target) {
          memberId = target.id;
          members = members.map((m) =>
            m.id === target.id
              ? {
                  ...m,
                  name: name || m.name,
                  email: a.email?.trim() || m.email,
                  phone: a.phone?.trim() || m.phone,
                  roleIds: m.roleIds.includes(a.roleId) ? m.roleIds : [...m.roleIds, a.roleId],
                }
              : m,
          );
        } else {
          memberId = uid("m_");
          members = [
            ...members,
            { id: memberId, name: name || "Anonym", roleIds: [a.roleId], email: a.email?.trim() || undefined, phone: a.phone?.trim() || undefined, createdAt: now() },
          ];
        }
        const leads = { ...(y.roleLeads ?? {}) };
        if (a.asLead || wasEmpty) leads[a.roleId] = memberId; // první držitel nebo výslovná volba = vedoucí
        return normalizeLeads({ ...y, members, roleLeads: leads });
      });
    case "setRoleLead":
      return mapYear(db, a.yearId, (y) => normalizeLeads({ ...y, roleLeads: { ...(y.roleLeads ?? {}), [a.roleId]: a.memberId } }));

    case "addPost":
      return mapYear(db, a.yearId, (y) => ({
        ...y,
        posts: [
          { id: uid("p_"), author: a.author.trim() || "Anonym", roleId: a.roleId, title: a.title.trim(), body: a.body.trim(), pinned: a.pinned ?? false, createdAt: now() },
          ...y.posts,
        ],
      }));
    case "updatePost":
      return mapYear(db, a.yearId, (y) => ({
        ...y,
        // Původní autor a datum vzniku se NEMĚNÍ; zapíše se jen kdo a kdy upravil.
        posts: y.posts.map((p) =>
          p.id === a.postId
            ? {
                ...p,
                title: a.patch.title !== undefined ? a.patch.title.trim() || p.title : p.title,
                body: a.patch.body !== undefined ? a.patch.body.trim() : p.body,
                roleId: a.patch.roleId !== undefined ? (a.patch.roleId ?? undefined) : p.roleId,
                editedBy: a.editedBy.trim() || p.editedBy,
                editedAt: now(),
              }
            : p,
        ),
      }));
    case "togglePin":
      return mapYear(db, a.yearId, (y) => ({
        ...y,
        posts: y.posts.map((p) => (p.id === a.postId ? { ...p, pinned: !p.pinned } : p)),
      }));
    case "removePost":
      return mapYear(db, a.yearId, (y) => ({ ...y, posts: y.posts.filter((p) => p.id !== a.postId) }));

    case "addPoll":
      return mapYear(db, a.yearId, (y) => ({
        ...y,
        polls: [
          {
            id: uid("v_"),
            question: a.question.trim(),
            author: a.author.trim() || "Anonym",
            multi: a.multi ?? false,
            closed: false,
            options: a.options.map((label) => ({ id: uid("o_"), label: label.trim(), voters: [] })).filter((o) => o.label),
            createdAt: now(),
          },
          ...y.polls,
        ],
      }));
    case "vote":
      return mapYear(db, a.yearId, (y) => ({
        ...y,
        polls: y.polls.map((poll) => {
          if (poll.id !== a.pollId || poll.closed) return poll;
          return {
            ...poll,
            options: poll.options.map((o) => {
              if (o.id === a.optionId) {
                const has = o.voters.includes(a.voter);
                return { ...o, voters: has ? o.voters.filter((v) => v !== a.voter) : [...o.voters, a.voter] };
              }
              // jednovýběrová anketa: odeber hlas z ostatních možností
              if (!poll.multi) return { ...o, voters: o.voters.filter((v) => v !== a.voter) };
              return o;
            }),
          };
        }),
      }));
    case "removeVoter":
      // Správce odebere hlas konkrétního člověka u dané možnosti.
      return mapYear(db, a.yearId, (y) => ({
        ...y,
        polls: y.polls.map((poll) =>
          poll.id !== a.pollId
            ? poll
            : {
                ...poll,
                options: poll.options.map((o) =>
                  o.id === a.optionId ? { ...o, voters: o.voters.filter((v) => v !== a.voter) } : o,
                ),
              },
        ),
      }));
    case "closePoll":
      return mapYear(db, a.yearId, (y) => ({
        ...y,
        polls: y.polls.map((p) => (p.id === a.pollId ? { ...p, closed: !p.closed } : p)),
      }));
    case "removePoll":
      return mapYear(db, a.yearId, (y) => ({ ...y, polls: y.polls.filter((p) => p.id !== a.pollId) }));

    case "addEvent":
      return mapYear(db, a.yearId, (y) => ({
        ...y,
        events: [
          ...y.events,
          { id: uid("e_"), date: a.date, endDate: a.endDate && a.endDate > a.date ? a.endDate : undefined, time: a.time || undefined, title: a.title.trim(), kind: a.kind, note: a.note?.trim() || undefined, author: a.author.trim() || "Anonym", createdAt: now() },
        ],
      }));
    case "updateEvent":
      return mapYear(db, a.yearId, (y) => ({
        ...y,
        events: y.events.map((e) => {
          if (e.id !== a.eventId) return e;
          const date = a.patch.date ?? e.date;
          return {
            ...e,
            title: (a.patch.title ?? e.title).trim() || e.title,
            date,
            endDate: a.patch.endDate && a.patch.endDate > date ? a.patch.endDate : undefined,
            time: a.patch.time || undefined,
            kind: a.patch.kind ?? e.kind,
            note: a.patch.note?.trim() || undefined,
          };
        }),
      }));
    case "removeEvent":
      return mapYear(db, a.yearId, (y) => ({ ...y, events: y.events.filter((e) => e.id !== a.eventId) }));

    case "addTask":
      return mapYear(db, a.yearId, (y) => ({
        ...y,
        tasks: [
          ...y.tasks,
          { id: uid("t_"), title: a.title.trim(), roleId: a.roleId, assignee: a.assignee?.trim() || undefined, due: a.due || undefined, done: false, createdAt: now() },
        ],
      }));
    case "toggleTask":
      return mapYear(db, a.yearId, (y) => ({
        ...y,
        tasks: y.tasks.map((t) => (t.id === a.taskId ? { ...t, done: !t.done } : t)),
      }));
    case "removeTask":
      return mapYear(db, a.yearId, (y) => ({ ...y, tasks: y.tasks.filter((t) => t.id !== a.taskId) }));

    case "addLink":
      return mapYear(db, a.yearId, (y) => ({
        ...y,
        links: [
          ...(y.links ?? []),
          { id: uid("l_"), label: a.label.trim(), value: a.value.trim(), folder: a.folder?.trim() || undefined, note: a.note?.trim() || undefined, createdAt: now() },
        ],
      }));
    case "removeLink":
      return mapYear(db, a.yearId, (y) => ({ ...y, links: (y.links ?? []).filter((l) => l.id !== a.linkId) }));

    case "addFinance":
      return mapYear(db, a.yearId, (y) => ({
        ...y,
        finances: [
          ...(y.finances ?? []),
          {
            id: uid("f_"),
            kind: a.kind,
            label: a.label.trim(),
            amount: Number.isFinite(a.amount) ? Math.round(a.amount) : 0,
            net: a.net != null && Number.isFinite(a.net) ? Math.round(a.net) : undefined,
            category: a.category?.trim() || undefined,
            who: a.who?.trim() || undefined,
            paid: a.paid ?? true,
            date: a.date || undefined,
            note: a.note?.trim() || undefined,
            createdAt: now(),
          },
        ],
      }));
    case "updateFinance":
      return mapYear(db, a.yearId, (y) => ({
        ...y,
        finances: (y.finances ?? []).map((f) => {
          if (f.id !== a.financeId) return f;
          const p = a.patch;
          return {
            ...f,
            ...p,
            amount: p.amount !== undefined ? Math.round(p.amount) : f.amount,
            net: "net" in p ? (p.net != null ? Math.round(p.net) : undefined) : f.net,
          };
        }),
      }));
    case "toggleFinancePaid":
      return mapYear(db, a.yearId, (y) => ({
        ...y,
        finances: (y.finances ?? []).map((f) => (f.id === a.financeId ? { ...f, paid: !f.paid } : f)),
      }));
    case "removeFinance":
      return mapYear(db, a.yearId, (y) => ({ ...y, finances: (y.finances ?? []).filter((f) => f.id !== a.financeId) }));

    case "openCashbox":
      return mapYear(db, a.yearId, (y) => ({
        ...y,
        cashboxes: [
          { id: uid("cb_"), label: a.label?.trim() || undefined, opening: Math.round(a.opening), openedAt: now(), createdAt: now() },
          ...(y.cashboxes ?? []),
        ],
      }));
    case "closeCashbox":
      return mapYear(db, a.yearId, (y) => {
        const box = (y.cashboxes ?? []).find((c) => c.id === a.cashboxId);
        if (!box || box.closedAt) return y; // neexistuje nebo už uzavřená
        const closing = Math.round(a.closing);
        const trzba = closing - box.opening; // tržba = večer − ráno
        const closedAt = now();
        const day = box.openedAt.slice(0, 10); // YYYY-MM-DD
        const financeId = uid("f_");
        const lbl = box.label ? ` — ${box.label}` : "";
        const fin = {
          id: financeId,
          kind: (trzba >= 0 ? "prijem" : "vydaj") as FinanceKind,
          label: `Kasa${lbl}`,
          amount: Math.abs(trzba),
          category: "kasa",
          paid: true,
          date: day,
          note: `Kasa${box.label ? " " + box.label : ""}: ráno ${box.opening} Kč (${hhmm(box.openedAt)}) → večer ${closing} Kč (${hhmm(closedAt)}); tržba ${trzba} Kč`,
          createdAt: now(),
        };
        return {
          ...y,
          cashboxes: (y.cashboxes ?? []).map((c) => (c.id === a.cashboxId ? { ...c, closing, closedAt, financeId } : c)),
          finances: [fin, ...(y.finances ?? [])],
        };
      });
    case "removeCashbox":
      return mapYear(db, a.yearId, (y) => {
        const box = (y.cashboxes ?? []).find((c) => c.id === a.cashboxId);
        return {
          ...y,
          cashboxes: (y.cashboxes ?? []).filter((c) => c.id !== a.cashboxId),
          finances: box?.financeId ? (y.finances ?? []).filter((f) => f.id !== box.financeId) : y.finances,
        };
      });

    case "addContribution": {
      const name = a.name.trim();
      const amount = Math.round(a.amount);
      if (!name || amount <= 0) return db;
      return mapYear(db, a.yearId, (y) => ({
        ...y,
        contributions: [...(y.contributions ?? []), { id: uid("ct_"), name, amount, createdAt: now() }],
      }));
    }
    case "toggleContributionReturned":
      return mapYear(db, a.yearId, (y) => ({
        ...y,
        contributions: (y.contributions ?? []).map((c) =>
          c.id === a.contributionId ? { ...c, returned: !c.returned, returnedAt: !c.returned ? now() : undefined } : c,
        ),
      }));
    case "updateContribution":
      return mapYear(db, a.yearId, (y) => ({
        ...y,
        contributions: (y.contributions ?? []).map((c) =>
          c.id === a.contributionId
            ? { ...c, name: a.patch.name?.trim() || c.name, amount: a.patch.amount != null ? Math.round(a.patch.amount) : c.amount }
            : c,
        ),
      }));
    case "removeContribution":
      return mapYear(db, a.yearId, (y) => ({
        ...y,
        contributions: (y.contributions ?? []).filter((c) => c.id !== a.contributionId),
      }));

    case "addFreshman": {
      const name = a.name.trim();
      if (!name) return db;
      return mapYear(db, a.yearId, (y) => ({
        ...y,
        freshmen: [...(y.freshmen ?? []), { id: uid("fr_"), name, email: a.email?.trim() || undefined, note: a.note?.trim() || undefined, createdAt: now() }],
      }));
    }
    case "updateFreshman":
      return mapYear(db, a.yearId, (y) => ({
        ...y,
        freshmen: (y.freshmen ?? []).map((f) =>
          f.id === a.freshmanId
            ? { ...f, name: a.patch.name?.trim() || f.name, email: a.patch.email !== undefined ? a.patch.email.trim() || undefined : f.email, note: a.patch.note !== undefined ? a.patch.note.trim() || undefined : f.note }
            : f,
        ),
      }));
    case "removeFreshman":
      return mapYear(db, a.yearId, (y) => ({
        ...y,
        freshmen: (y.freshmen ?? []).filter((f) => f.id !== a.freshmanId),
      }));

    case "addDecor": {
      const title = a.title.trim();
      if (!title) return db;
      return mapYear(db, a.yearId, (y) => ({
        ...y,
        decor: [
          ...(y.decor ?? []),
          {
            id: uid("dc_"),
            title,
            status: "napad" as const,
            who: a.who?.trim() || undefined,
            link: a.link?.trim() || undefined,
            note: a.note?.trim() || undefined,
            createdAt: now(),
          },
        ],
      }));
    }
    case "updateDecor":
      return mapYear(db, a.yearId, (y) => ({
        ...y,
        decor: (y.decor ?? []).map((d) =>
          d.id === a.decorId
            ? {
                ...d,
                title: a.patch.title?.trim() || d.title,
                status: a.patch.status ?? d.status,
                who: a.patch.who !== undefined ? a.patch.who.trim() || undefined : d.who,
                link: a.patch.link !== undefined ? a.patch.link.trim() || undefined : d.link,
                note: a.patch.note !== undefined ? a.patch.note.trim() || undefined : d.note,
              }
            : d,
        ),
      }));
    case "removeDecor":
      return mapYear(db, a.yearId, (y) => ({
        ...y,
        decor: (y.decor ?? []).filter((d) => d.id !== a.decorId),
      }));

    case "addSponsor": {
      const name = a.name.trim();
      if (!name) return db;
      return mapYear(db, a.yearId, (y) => ({
        ...y,
        sponsors: [
          ...(y.sponsors ?? []),
          {
            id: uid("sp_"),
            name,
            status: "oslovit" as const,
            gives: a.gives?.trim() || undefined,
            who: a.who?.trim() || undefined,
            link: a.link?.trim() || undefined,
            note: a.note?.trim() || undefined,
            createdAt: now(),
          },
        ],
      }));
    }
    case "updateSponsor":
      return mapYear(db, a.yearId, (y) => ({
        ...y,
        sponsors: (y.sponsors ?? []).map((s) =>
          s.id === a.sponsorId
            ? {
                ...s,
                name: a.patch.name?.trim() || s.name,
                gives: a.patch.gives !== undefined ? a.patch.gives.trim() || undefined : s.gives,
                status: a.patch.status ?? s.status,
                who: a.patch.who !== undefined ? a.patch.who.trim() || undefined : s.who,
                link: a.patch.link !== undefined ? a.patch.link.trim() || undefined : s.link,
                note: a.patch.note !== undefined ? a.patch.note.trim() || undefined : s.note,
              }
            : s,
        ),
      }));
    case "removeSponsor":
      return mapYear(db, a.yearId, (y) => ({
        ...y,
        sponsors: (y.sponsors ?? []).filter((s) => s.id !== a.sponsorId),
      }));

    case "addDrink": {
      const name = a.name.trim();
      if (!name) return db;
      return mapYear(db, a.yearId, (y) => ({
        ...y,
        bar: [...(y.bar ?? []), { id: uid("dr_"), place: a.place, name, kind: a.kind, day: a.day, ingredients: [], createdAt: now() }],
      }));
    }
    case "updateDrink":
      return mapYear(db, a.yearId, (y) => ({
        ...y,
        bar: (y.bar ?? []).map((d) =>
          d.id === a.drinkId
            ? {
                ...d,
                name: a.patch.name?.trim() || d.name,
                kind: a.patch.kind ?? d.kind,
                day: a.patch.day !== undefined ? (a.patch.day ?? undefined) : d.day,
                price: a.patch.price !== undefined ? (a.patch.price > 0 ? Math.round(a.patch.price) : undefined) : d.price,
                note: a.patch.note !== undefined ? a.patch.note.trim() || undefined : d.note,
                ingredients: a.patch.ingredients
                  ? a.patch.ingredients
                      .filter((i) => i.name.trim())
                      .map((i) => ({ name: i.name.trim(), cost: Math.max(0, Math.round(i.cost) || 0) }))
                  : d.ingredients,
              }
            : d,
        ),
      }));
    case "removeDrink":
      return mapYear(db, a.yearId, (y) => ({
        ...y,
        bar: (y.bar ?? []).filter((d) => d.id !== a.drinkId),
      }));

    case "addMenuEntry": {
      const dish = a.dish.trim();
      const day = a.day.trim();
      if (!dish || !day) return db;
      return mapYear(db, a.yearId, (y) => ({
        ...y,
        menu: [...(y.menu ?? []), { id: uid("mn_"), day, meal: a.meal, dish, createdAt: now() }],
      }));
    }
    case "removeMenuEntry":
      return mapYear(db, a.yearId, (y) => ({ ...y, menu: (y.menu ?? []).filter((m) => m.id !== a.entryId) }));
    case "addShoppingItem": {
      const name = a.name.trim();
      if (!name) return db;
      return mapYear(db, a.yearId, (y) => ({
        ...y,
        shopping: [...(y.shopping ?? []), { id: uid("sh_"), place: a.place, name, qty: a.qty?.trim() || undefined, createdAt: now() }],
      }));
    }
    case "toggleShoppingBought":
      return mapYear(db, a.yearId, (y) => ({
        ...y,
        shopping: (y.shopping ?? []).map((s) => (s.id === a.itemId ? { ...s, bought: !s.bought } : s)),
      }));
    case "removeShoppingItem":
      return mapYear(db, a.yearId, (y) => ({ ...y, shopping: (y.shopping ?? []).filter((s) => s.id !== a.itemId) }));
    case "clearBoughtShopping":
      return mapYear(db, a.yearId, (y) => ({ ...y, shopping: (y.shopping ?? []).filter((s) => !(s.bought && (s.place ?? "kuchyne") === a.place)) }));

    case "addShift":
      return mapYear(db, a.yearId, (y) => ({
        ...y,
        shifts: [
          ...(y.shifts ?? []),
          {
            id: uid("s_"),
            area: a.area.trim() || "Ostatní",
            title: a.title?.trim() || undefined,
            date: a.date || undefined,
            from: a.from || undefined,
            to: a.to || undefined,
            capacity: a.capacity && a.capacity > 0 ? Math.round(a.capacity) : 0,
            people: [],
            note: a.note?.trim() || undefined,
            createdAt: now(),
          },
        ],
      }));
    case "signShift":
      return mapYear(db, a.yearId, (y) => ({
        ...y,
        shifts: (y.shifts ?? []).map((s) => {
          if (s.id !== a.shiftId) return s;
          const name = a.name.trim() || "Anonym";
          if (s.people.includes(name)) return { ...s, people: s.people.filter((p) => p !== name) };
          // plno → nepřidávat (kapacita 0 = neomezeně)
          if (s.capacity > 0 && s.people.length >= s.capacity) return s;
          // při přihlášení do směny vypadne ze zálohy (nemůže být v obou)
          return { ...s, people: [...s.people, name], backup: (s.backup ?? []).filter((p) => p !== name) };
        }),
      }));
    case "signShiftBackup":
      return mapYear(db, a.yearId, (y) => ({
        ...y,
        shifts: (y.shifts ?? []).map((s) => {
          if (s.id !== a.shiftId) return s;
          const name = a.name.trim() || "Anonym";
          const backup = s.backup ?? [];
          if (backup.includes(name)) return { ...s, backup: backup.filter((p) => p !== name) };
          // jako záloha vypadne z hlavních přihlášených
          return { ...s, backup: [...backup, name], people: s.people.filter((p) => p !== name) };
        }),
      }));
    case "removeShiftPerson":
      // Správce odebere konkrétního člověka ze směny (z přihlášených i ze zálohy).
      return mapYear(db, a.yearId, (y) => ({
        ...y,
        shifts: (y.shifts ?? []).map((s) =>
          s.id === a.shiftId ? { ...s, people: s.people.filter((p) => p !== a.name), backup: (s.backup ?? []).filter((p) => p !== a.name) } : s,
        ),
      }));
    case "removeShift":
      return mapYear(db, a.yearId, (y) => ({ ...y, shifts: (y.shifts ?? []).filter((s) => s.id !== a.shiftId) }));

    case "addInvite":
      return mapYear(db, a.yearId, (y) => ({
        ...y,
        invites: [
          ...(y.invites ?? []),
          {
            id: uid("i_"),
            category: a.category.trim() || "Ostatní",
            name: a.name.trim(),
            link: a.link?.trim() || undefined,
            priority: a.priority && a.priority > 0 ? Math.round(a.priority) : undefined,
            contacted: false,
            interest: "nevim",
            createdAt: now(),
          },
        ],
      }));
    case "updateInvite":
      return mapYear(db, a.yearId, (y) => ({
        ...y,
        invites: (y.invites ?? []).map((i) => (i.id === a.inviteId ? { ...i, ...a.patch } : i)),
      }));
    case "removeInvite":
      return mapYear(db, a.yearId, (y) => ({ ...y, invites: (y.invites ?? []).filter((i) => i.id !== a.inviteId) }));

    case "addKitchenFile":
      return mapYear(db, a.yearId, (y) => ({
        ...y,
        kitchen: [
          {
            id: uid("k_"),
            place: a.place ?? "kuchyne",
            label: a.label.trim() || a.fileName?.trim() || "Bez názvu",
            category: a.category.trim() || "Ostatní",
            blobId: a.blobId,
            fileKind: a.fileKind,
            fileName: a.fileName?.trim() || undefined,
            note: a.note?.trim() || undefined,
            author: a.author.trim() || "Anonym",
            createdAt: now(),
          },
          ...(y.kitchen ?? []),
        ],
      }));
    case "removeKitchenFile":
      return mapYear(db, a.yearId, (y) => ({ ...y, kitchen: (y.kitchen ?? []).filter((k) => k.id !== a.fileId) }));
    case "clearYearMedia":
      return mapYear(db, a.yearId, (y) => ({
        ...y,
        finances: (y.finances ?? []).map((f) => ({ ...f, receiptId: undefined, receiptIds: undefined })),
        kitchen: [],
      }));

    case "addMerchProduct":
      return mapYear(db, a.yearId, (y) => ({
        ...y,
        merch: [
          ...(y.merch ?? []),
          {
            id: uid("mp_"),
            name: a.name.trim() || "Bez názvu",
            price: Number.isFinite(a.price) ? a.price : undefined,
            blobId: a.blobId,
            sizes: cleanList(a.sizes),
            colors: cleanList(a.colors),
            stock: Number.isFinite(a.stock) ? a.stock : undefined,
            note: a.note?.trim() || undefined,
            createdAt: now(),
          },
        ],
      }));
    case "updateMerchProduct":
      return mapYear(db, a.yearId, (y) => ({
        ...y,
        merch: (y.merch ?? []).map((p) => {
          if (p.id !== a.productId) return p;
          const q = a.patch;
          return {
            ...p,
            ...q,
            name: q.name !== undefined ? q.name.trim() || p.name : p.name,
            price: "price" in q ? (Number.isFinite(q.price) ? q.price : undefined) : p.price,
            sizes: "sizes" in q ? cleanList(q.sizes) : p.sizes,
            colors: "colors" in q ? cleanList(q.colors) : p.colors,
            stock: "stock" in q ? (Number.isFinite(q.stock) ? q.stock : undefined) : p.stock,
            note: "note" in q ? q.note?.trim() || undefined : p.note,
          };
        }),
      }));
    case "removeMerchProduct":
      return mapYear(db, a.yearId, (y) => ({ ...y, merch: (y.merch ?? []).filter((p) => p.id !== a.productId) }));
    case "addMerchOrder":
      return mapYear(db, a.yearId, (y) => ({
        ...y,
        merchOrders: [
          {
            id: uid("mo_"),
            name: a.name.trim() || "—",
            phone: a.phone?.trim() || undefined,
            email: a.email?.trim() || undefined,
            items: (a.items ?? []).map((it) => ({
              productId: it.productId,
              name: it.name,
              size: it.size?.trim() || undefined,
              color: it.color?.trim() || undefined,
              price: Number.isFinite(it.price) ? it.price : undefined,
              qty: Math.max(1, Math.round(it.qty || 1)),
            })),
            note: a.note?.trim() || undefined,
            done: false,
            createdAt: now(),
          },
          ...(y.merchOrders ?? []),
        ],
      }));
    case "toggleMerchOrderDone":
      return mapYear(db, a.yearId, (y) => {
        const order = (y.merchOrders ?? []).find((o) => o.id === a.orderId);
        if (!order) return y;
        if (!order.done) {
          // vyřízeno → zapiš tržbu objednávky jako příjem do financí
          const total = order.items.reduce((sum, it) => {
            const price = it.price ?? (y.merch ?? []).find((p) => p.id === it.productId)?.price ?? 0;
            return sum + price * it.qty;
          }, 0);
          const financeId = uid("f_");
          const itemsText = order.items
            .map((it) => `${it.qty}× ${it.name}${[it.size, it.color].filter(Boolean).length ? ` (${[it.size, it.color].filter(Boolean).join(" · ")})` : ""}`)
            .join(", ");
          const fin = {
            id: financeId,
            kind: "prijem" as FinanceKind,
            label: `Merch — ${order.name}`,
            amount: total,
            category: "merch",
            paid: true,
            date: order.createdAt.slice(0, 10),
            note: itemsText,
            createdAt: now(),
          };
          return {
            ...y,
            merchOrders: (y.merchOrders ?? []).map((o) => (o.id === a.orderId ? { ...o, done: true, financeId } : o)),
            finances: [fin, ...(y.finances ?? [])],
          };
        }
        // zpět na „čeká" → odeber navázaný příjem
        return {
          ...y,
          merchOrders: (y.merchOrders ?? []).map((o) => (o.id === a.orderId ? { ...o, done: false, financeId: undefined } : o)),
          finances: order.financeId ? (y.finances ?? []).filter((f) => f.id !== order.financeId) : y.finances,
        };
      });
    case "removeMerchOrder":
      return mapYear(db, a.yearId, (y) => {
        const order = (y.merchOrders ?? []).find((o) => o.id === a.orderId);
        return {
          ...y,
          merchOrders: (y.merchOrders ?? []).filter((o) => o.id !== a.orderId),
          finances: order?.financeId ? (y.finances ?? []).filter((f) => f.id !== order.financeId) : y.finances,
        };
      });

    default:
      return db;
  }
}
