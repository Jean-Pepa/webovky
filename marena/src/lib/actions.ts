// Čistý reducer nad DB. Stejná logika běží na serveru (Redis) i v prohlížeči
// (localStorage demo režim) — proto je bezstavová a deterministická až na uid().

import type { DB, Year, EventKind, FinanceKind, Task, Invite, MerchOrderItem } from "./types";
import { uid } from "./id";
import { ROLE_TASKS } from "./roleTasks";

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
  | { type: "addMember"; yearId: string; name: string; roleIds: string[]; email?: string; phone?: string; contact?: string; note?: string }
  | { type: "updateMember"; yearId: string; memberId: string; patch: { name?: string; roleIds?: string[]; email?: string; phone?: string; contact?: string; note?: string } }
  | { type: "removeMember"; yearId: string; memberId: string }
  | { type: "addPost"; yearId: string; author: string; roleId?: string; title: string; body: string; pinned?: boolean }
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
  | { type: "updateFinance"; yearId: string; financeId: string; patch: { label?: string; amount?: number; net?: number; category?: string; who?: string; paid?: boolean; date?: string; note?: string; receiptId?: string; receiptIds?: string[] } }
  | { type: "toggleFinancePaid"; yearId: string; financeId: string }
  | { type: "removeFinance"; yearId: string; financeId: string }
  | { type: "addShift"; yearId: string; area: string; title?: string; date?: string; from?: string; to?: string; capacity?: number; note?: string }
  | { type: "signShift"; yearId: string; shiftId: string; name: string }
  | { type: "removeShiftPerson"; yearId: string; shiftId: string; name: string }
  | { type: "removeShift"; yearId: string; shiftId: string }
  | { type: "addInvite"; yearId: string; category: string; name: string; link?: string; priority?: number }
  | { type: "updateInvite"; yearId: string; inviteId: string; patch: Partial<Pick<Invite, "category" | "name" | "link" | "priority" | "contacted" | "interest" | "availability" | "price" | "confirmedDate" | "note">> }
  | { type: "removeInvite"; yearId: string; inviteId: string }
  | { type: "addKitchenFile"; yearId: string; label: string; category: string; blobId: string; fileKind: "image" | "file"; fileName?: string; note?: string; author: string }
  | { type: "removeKitchenFile"; yearId: string; fileId: string }
  // Merch — nabídka produktů (správce / role merch) a objednávky (veřejná stránka).
  | { type: "addMerchProduct"; yearId: string; name: string; price?: number; blobId?: string; note?: string }
  | { type: "updateMerchProduct"; yearId: string; productId: string; patch: { name?: string; price?: number; blobId?: string; note?: string } }
  | { type: "removeMerchProduct"; yearId: string; productId: string }
  | { type: "addMerchOrder"; yearId: string; name: string; phone?: string; email?: string; items: MerchOrderItem[]; note?: string }
  | { type: "removeMerchOrder"; yearId: string; orderId: string }
  // Uvolnění místa: smaže všechny fotky/účtenky ročníku (reference v DB; samotné
  // bloby maže klient zvlášť). Texty (finance, popisy) zůstávají.
  | { type: "clearYearMedia"; yearId: string };

function now(): string {
  return new Date().toISOString();
}

// Vrátí novou DB s aplikovanou změnou na daný ročník.
function mapYear(db: DB, yearId: string, fn: (y: Year) => Year): DB {
  return { ...db, years: db.years.map((y) => (y.id === yearId ? fn(y) : y)) };
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
      return mapYear(db, a.yearId, (y) => ({
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
            createdAt: now(),
          },
        ],
      }));
    case "updateMember":
      return mapYear(db, a.yearId, (y) => ({
        ...y,
        members: y.members.map((m) => (m.id === a.memberId ? { ...m, ...a.patch } : m)),
      }));
    case "removeMember":
      return mapYear(db, a.yearId, (y) => ({ ...y, members: y.members.filter((m) => m.id !== a.memberId) }));

    case "addPost":
      return mapYear(db, a.yearId, (y) => ({
        ...y,
        posts: [
          { id: uid("p_"), author: a.author.trim() || "Anonym", roleId: a.roleId, title: a.title.trim(), body: a.body.trim(), pinned: a.pinned ?? false, createdAt: now() },
          ...y.posts,
        ],
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
          return { ...s, people: [...s.people, name] };
        }),
      }));
    case "removeShiftPerson":
      // Správce odebere konkrétního člověka ze směny.
      return mapYear(db, a.yearId, (y) => ({
        ...y,
        shifts: (y.shifts ?? []).map((s) =>
          s.id === a.shiftId ? { ...s, people: s.people.filter((p) => p !== a.name) } : s,
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
            items: (a.items ?? []).map((it) => ({ productId: it.productId, name: it.name, qty: Math.max(1, Math.round(it.qty || 1)) })),
            note: a.note?.trim() || undefined,
            createdAt: now(),
          },
          ...(y.merchOrders ?? []),
        ],
      }));
    case "removeMerchOrder":
      return mapYear(db, a.yearId, (y) => ({ ...y, merchOrders: (y.merchOrders ?? []).filter((o) => o.id !== a.orderId) }));

    default:
      return db;
  }
}
