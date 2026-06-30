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

// Kategorie nákladů na cestu.
export type ExpenseCategory = "benzin" | "myto" | "parkovne" | "ubytovani" | "jidlo" | "ostatni";

// Jedna útrata v rámci cesty (benzín, dálnice/mýtné, parkovné…).
export interface Expense {
  id: string;
  amount: number; // částka v Kč
  category: ExpenseCategory;
  paidBy: string; // kdo zaplatil (jméno)
  car?: string; // do/za které auto (volitelné)
  note?: string;
  date: string; // ISO datum
  createdAt: string; // ISO datetime
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
  // útraty na cestu (benzín, mýtné, …)
  expenses: Expense[];
  // zamčený finální termín (když se parta dohodla)
  locked: { start: string; end: string; place?: string } | null;
}

export interface DB {
  trips: Trip[];
}
