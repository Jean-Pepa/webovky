// Rolová tlačítka: obsah vidí každý člen, ale akční tlačítka (formuláře,
// úpravy, mazání) má jen ten, kdo drží roli dané sekce — plus správce
// a hlavní organizátor. Gatuje se jen UI kvůli přehlednosti; identita
// je jen jméno, takže nejde o zabezpečení. (Program a Merch mají vlastní
// starší gating ve stejném duchu — merch v lib/merch, program na stránce.)
import { isAdmin } from "./admin";
import { sameName } from "./names";
import type { Year } from "./types";

export const SECTION_ROLES = {
  finance: [], // finance = jen hlavní koordinátor & finance (hlavni) + správce
  sponzori: ["sponzoring"],
  vyzdoba: ["vyzdoba"],
  prvaci: ["prvaci"],
  bar: ["bar"],
  kuchyne: ["bar"], // kuchyně & bar je jedna role
} as const;

export type Section = keyof typeof SECTION_ROLES;

export function myRoleIds(year: Year | null | undefined, me: string): string[] {
  return year?.members.find((m) => sameName(m.name, me))?.roleIds ?? [];
}

export function canEditSection(year: Year | null | undefined, me: string, section: Section): boolean {
  if (isAdmin(me)) return true;
  const roles = myRoleIds(year, me);
  return roles.includes("hlavni") || SECTION_ROLES[section].some((r) => roles.includes(r));
}

// Prodej (pokladna) obsluhuje jen správce a lidé s rolí „jen Prodej" (posOnly).
// Ostatní členové mají prodej jen k náhledu. Brigádníci u stánku (posOnly)
// prodej vidí a ovládají — je to jejich jediná sekce.
export function canEditProdej(year: Year | null | undefined, me: string): boolean {
  if (isAdmin(me)) return true;
  return !!year?.members.find((m) => sameName(m.name, me))?.posOnly;
}
