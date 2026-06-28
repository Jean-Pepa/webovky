// Datový model appky „Dovča".
//
// Filozofie značení: výchozí stav je „MŮŽU". Každý si vyznačí jen dny, kdy
// nemůže (povinně) nebo kdy je to nejisté (možná). Nejmíň klikání — lidi znají
// hlavně svoje překážky (práce, jiná dovča).

// Stav jednoho dne u jednoho člověka. Když záznam chybí → „můžu".
export type AvailStatus = "out" | "maybe";

// Hlas u konkrétního návrhu termínu.
export type VoteValue = "yes" | "no" | "maybe";

export interface Proposal {
  id: string;
  start: string; // ISO datum (včetně)
  end: string; // ISO datum (včetně)
  place: string; // kam (např. „Chorvatsko – Pag")
  note?: string;
  link?: string; // odkaz (Booking, chata, …)
  author: string;
  createdAt: string; // ISO datetime
  votes: Record<string, VoteValue>; // jméno → hlas
}

export interface Trip {
  id: string;
  name: string; // např. „Léto 2026"
  horizonStart: string; // ISO datum — první den, který jde vybírat
  horizonEnd: string; // ISO datum — poslední den
  lengthDays: number; // požadovaná délka dovču vcelku (dny)
  minPeople: number; // kolik nás musí minimálně být
  createdBy: string;
  createdAt: string; // ISO datetime
  members: string[]; // kdo se účastní (jména)
  // dostupnost: jméno → { datumISO: stav }. Chybějící den = „můžu".
  availability: Record<string, Record<string, AvailStatus>>;
  proposals: Proposal[];
  // zamčený finální termín (když se parta dohodla)
  locked: { start: string; end: string; place?: string } | null;
}

export interface DB {
  trips: Trip[];
}
