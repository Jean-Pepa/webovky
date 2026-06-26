// Pravidla ročníků: měnit se smí jen AKTUÁLNÍ (nejnovější) ročník. Starší ročníky
// jsou uzamčené — dají se přepnout a prohlížet, ale ne měnit. Správce (Mařena)
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

// Heslo ke každému ročníku je „marena" + rok (marena2026, marena2027, …) — bez
// horní hranice (do nekonečna). Heslo na rok ale platí teprve, až správce ten
// ročník založí (kontroluje se na serveru). (Klientsky bezpečné — bez server kódu.)
export const PASSWORD_MIN_YEAR = 2026;

// Z hesla „marenaYYYY" vrátí ročník (string), jinak null.
export function yearFromPassword(pw: string): string | null {
  const m = /^marena\s*(\d{4})$/.exec((pw || "").trim().toLowerCase());
  if (!m) return null;
  const y = parseInt(m[1], 10);
  if (y >= PASSWORD_MIN_YEAR) return String(y);
  return null;
}

export function isYearPassword(pw: string): boolean {
  return yearFromPassword(pw) !== null;
}
