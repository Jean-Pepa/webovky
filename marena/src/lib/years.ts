// Pravidla ročníků: měnit se smí jen AKTUÁLNÍ (nejnovější) ročník. Starší ročníky
// jsou uzamčené — dají se přepnout a prohlížet, ale ne měnit. Správce (Pan_Vyskočil)
// má kontrolu nad vším, takže může editovat kterýkoliv ročník.

import type { DB } from "./types";
import { isAdmin } from "./admin";

// Nejnovější ročník = ten s nejvyšším id (čísla roků porovnáme numericky).
export function activeYearId(db: DB | null): string | null {
  if (!db || db.years.length === 0) return null;
  return [...db.years].sort((a, b) => b.id.localeCompare(a.id, "cs", { numeric: true }))[0].id;
}

// Smí daný člověk měnit tento ročník?
export function isYearEditable(db: DB | null, yearId: string | null | undefined, me: string): boolean {
  if (isAdmin(me)) return true; // správce může vždy
  if (!db || !yearId) return false;
  return yearId === activeYearId(db); // jinak jen nejnovější ročník
}
