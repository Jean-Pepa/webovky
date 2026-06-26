// Přístup k sekci Merch: vidí ji jen správce (Mařena) a člověk, který má
// v týmu roli „Merch". Identita je jen jméno, role se berou z členů ročníku.

import type { Year } from "./types";
import { isAdmin } from "./admin";

export const MERCH_ROLE_ID = "merch";

function sameName(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

export function hasMerchRole(year: Year | null | undefined, me: string): boolean {
  if (!year || !me.trim()) return false;
  return year.members.some((m) => sameName(m.name, me) && m.roleIds.includes(MERCH_ROLE_ID));
}

export function canSeeMerch(year: Year | null | undefined, me: string): boolean {
  return isAdmin(me) || hasMerchRole(year, me);
}
