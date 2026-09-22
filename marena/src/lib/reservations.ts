// Rezervace lístků na webu — jedno místo pro termín a cenu na místě, sdílené
// veřejnou stránkou (odpočet, zamknutí formuláře) i serverem (odmítnutí po termínu).

// Konec rezervací (pražský čas).
export const RESERVATION_DEADLINE = new Date("2026-09-24T16:00:00+02:00");
// Cena lístku na místě bez rezervace (Kč).
export const ONSITE_PRICE = 350;

export const RESERVATION_DEADLINE_LABEL = "24. 9. 2026 v 16:00";

// Jsou rezervace ještě otevřené?
export function reservationsOpen(now: number = Date.now()): boolean {
  return now < RESERVATION_DEADLINE.getTime();
}
