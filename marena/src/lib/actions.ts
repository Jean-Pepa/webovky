// Čistý reducer nad DB. Stejná logika běží na serveru (Redis) i v prohlížeči
// (localStorage demo režim) — proto je bezstavová a deterministická až na uid().

import type { DB, Year, EventKind, FinanceKind } from "./types";
import { uid } from "./id";

export type Action =
  | { type: "createYear"; id: string; label?: string; theme?: string; fledaDate?: string }
  | { type: "updateYear"; yearId: string; patch: Partial<Pick<Year, "label" | "theme" | "fledaDate">> }
  | { type: "deleteYear"; yearId: string }
  | { type: "addMember"; yearId: string; name: string; roleIds: string[]; contact?: string; note?: string }
  | { type: "updateMember"; yearId: string; memberId: string; patch: { name?: string; roleIds?: string[]; contact?: string; note?: string } }
  | { type: "removeMember"; yearId: string; memberId: string }
  | { type: "addPost"; yearId: string; author: string; roleId?: string; title: string; body: string; pinned?: boolean }
  | { type: "togglePin"; yearId: string; postId: string }
  | { type: "removePost"; yearId: string; postId: string }
  | { type: "addPoll"; yearId: string; author: string; question: string; options: string[]; multi?: boolean }
  | { type: "vote"; yearId: string; pollId: string; optionId: string; voter: string }
  | { type: "closePoll"; yearId: string; pollId: string }
  | { type: "removePoll"; yearId: string; pollId: string }
  | { type: "addEvent"; yearId: string; date: string; time?: string; title: string; kind: EventKind; note?: string; author: string }
  | { type: "removeEvent"; yearId: string; eventId: string }
  | { type: "addTask"; yearId: string; title: string; roleId?: string; assignee?: string; due?: string }
  | { type: "toggleTask"; yearId: string; taskId: string }
  | { type: "removeTask"; yearId: string; taskId: string }
  | { type: "addLink"; yearId: string; label: string; value: string; note?: string }
  | { type: "removeLink"; yearId: string; linkId: string }
  | { type: "addFinance"; yearId: string; kind: FinanceKind; label: string; amount: number; category?: string; who?: string; paid?: boolean; date?: string; note?: string }
  | { type: "updateFinance"; yearId: string; financeId: string; patch: { label?: string; amount?: number; category?: string; who?: string; paid?: boolean; date?: string; note?: string } }
  | { type: "toggleFinancePaid"; yearId: string; financeId: string }
  | { type: "removeFinance"; yearId: string; financeId: string };

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
      const year: Year = {
        id: a.id,
        label: a.label?.trim() || `Mařena ${a.id}`,
        theme: a.theme?.trim() || undefined,
        fledaDate: a.fledaDate || undefined,
        members: [],
        posts: [],
        polls: [],
        events: [],
        tasks: [],
        createdAt: now(),
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
          { id: uid("m_"), name: a.name.trim(), roleIds: a.roleIds, contact: a.contact?.trim() || undefined, note: a.note?.trim() || undefined, createdAt: now() },
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
          { id: uid("e_"), date: a.date, time: a.time || undefined, title: a.title.trim(), kind: a.kind, note: a.note?.trim() || undefined, author: a.author.trim() || "Anonym", createdAt: now() },
        ],
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
          { id: uid("l_"), label: a.label.trim(), value: a.value.trim(), note: a.note?.trim() || undefined, createdAt: now() },
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
        finances: (y.finances ?? []).map((f) =>
          f.id === a.financeId
            ? { ...f, ...a.patch, amount: a.patch.amount !== undefined ? Math.round(a.patch.amount) : f.amount }
            : f,
        ),
      }));
    case "toggleFinancePaid":
      return mapYear(db, a.yearId, (y) => ({
        ...y,
        finances: (y.finances ?? []).map((f) => (f.id === a.financeId ? { ...f, paid: !f.paid } : f)),
      }));
    case "removeFinance":
      return mapYear(db, a.yearId, (y) => ({ ...y, finances: (y.finances ?? []).filter((f) => f.id !== a.financeId) }));

    default:
      return db;
  }
}
