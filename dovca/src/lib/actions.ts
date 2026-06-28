import type { DB, Trip, Proposal, AvailStatus, VoteValue } from "./types";

// Akce = jediný způsob, jak měnit DB. applyAction je čistá funkce a běží
// stejně na klientovi (demo režim) i na serveru (atomicky pod zámkem), takže
// nesmí používat nic z prohlížeče. ID a časy se generují tam, kde se akce
// zakládá, a posílají se v akci — reducer je tím deterministický.

export type Action =
  | { type: "addTrip"; trip: Trip }
  | { type: "removeTrip"; tripId: string }
  | {
      type: "updateTrip";
      tripId: string;
      patch: Partial<Pick<Trip, "name" | "horizonStart" | "horizonEnd" | "lengthDays" | "minPeople">>;
    }
  | { type: "joinTrip"; tripId: string; person: string }
  | { type: "leaveTrip"; tripId: string; person: string }
  | { type: "paintAvailability"; tripId: string; person: string; dates: string[]; status: AvailStatus | null }
  | { type: "clearAvailability"; tripId: string; person: string }
  | { type: "addProposal"; tripId: string; proposal: Proposal }
  | { type: "removeProposal"; tripId: string; proposalId: string }
  | { type: "voteProposal"; tripId: string; proposalId: string; person: string; vote: VoteValue | null }
  | { type: "lockTrip"; tripId: string; start: string; end: string; place?: string }
  | { type: "unlockTrip"; tripId: string };

function mapTrip(db: DB, tripId: string, fn: (t: Trip) => Trip): DB {
  return { ...db, trips: db.trips.map((t) => (t.id === tripId ? fn(t) : t)) };
}

export function applyAction(db: DB, action: Action): DB {
  switch (action.type) {
    case "addTrip":
      return { ...db, trips: [action.trip, ...db.trips] };

    case "removeTrip":
      return { ...db, trips: db.trips.filter((t) => t.id !== action.tripId) };

    case "updateTrip":
      return mapTrip(db, action.tripId, (t) => ({ ...t, ...action.patch }));

    case "joinTrip":
      return mapTrip(db, action.tripId, (t) =>
        t.members.includes(action.person) ? t : { ...t, members: [...t.members, action.person] },
      );

    case "leaveTrip":
      return mapTrip(db, action.tripId, (t) => {
        const availability = { ...t.availability };
        delete availability[action.person];
        return {
          ...t,
          members: t.members.filter((m) => m !== action.person),
          availability,
        };
      });

    case "paintAvailability":
      return mapTrip(db, action.tripId, (t) => {
        const members = t.members.includes(action.person) ? t.members : [...t.members, action.person];
        const mine = { ...(t.availability[action.person] ?? {}) };
        for (const d of action.dates) {
          if (action.status === null) delete mine[d];
          else mine[d] = action.status;
        }
        return { ...t, members, availability: { ...t.availability, [action.person]: mine } };
      });

    case "clearAvailability":
      return mapTrip(db, action.tripId, (t) => ({
        ...t,
        availability: { ...t.availability, [action.person]: {} },
      }));

    case "addProposal":
      return mapTrip(db, action.tripId, (t) => ({ ...t, proposals: [...t.proposals, action.proposal] }));

    case "removeProposal":
      return mapTrip(db, action.tripId, (t) => ({
        ...t,
        proposals: t.proposals.filter((p) => p.id !== action.proposalId),
      }));

    case "voteProposal":
      return mapTrip(db, action.tripId, (t) => ({
        ...t,
        proposals: t.proposals.map((p) => {
          if (p.id !== action.proposalId) return p;
          const votes = { ...p.votes };
          if (action.vote === null) delete votes[action.person];
          else votes[action.person] = action.vote;
          return { ...p, votes };
        }),
      }));

    case "lockTrip":
      return mapTrip(db, action.tripId, (t) => ({
        ...t,
        locked: { start: action.start, end: action.end, place: action.place },
      }));

    case "unlockTrip":
      return mapTrip(db, action.tripId, (t) => ({ ...t, locked: null }));

    default:
      return db;
  }
}
