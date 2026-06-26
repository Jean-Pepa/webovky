// Správce Mařeny — jediná „identita", která má kontrolu nad vším (může upravovat
// i finance bez funkce ekonom) a vidí v zázemí tlačítko „Stáhnout vše" (kompletní
// archiv do PDF pro úschovu na další roky).
//
// App nemá účty s hesly — identita je jen jméno. Správce je tedy ten, kdo se
// představí tímto jménem (nezáleží na velikosti písmen ani diakritice).
import { sameName } from "./names";

export const ADMIN_NAME = "Mařena";

export function isAdmin(name?: string | null): boolean {
  return sameName(name ?? "", ADMIN_NAME);
}
