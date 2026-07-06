// Přístup k sekci Merch: vidí ji jen správce (Mařena) a člověk, který má
// v týmu roli „Merch". Identita je jen jméno, role se berou z členů ročníku.

import type { Year, MerchProduct } from "./types";
import { isAdmin } from "./admin";

export const MERCH_ROLE_ID = "merch";

// Klíč varianty (velikost|barva) pro sklad po velikostech/barvách.
export function variantKey(size?: string, color?: string): string {
  return `${size ?? ""}|${color ?? ""}`;
}

// Má produkt varianty (velikosti nebo barvy)? Pak se sklad zadává po variantách.
export function hasVariants(p: Pick<MerchProduct, "sizes" | "colors">): boolean {
  return (p.sizes?.length ?? 0) > 0 || (p.colors?.length ?? 0) > 0;
}

// Všechny varianty produktu (kartézský součin velikostí × barev). Když chybí
// velikosti nebo barvy, bere se jako jediná „prázdná" hodnota.
export function productVariants(p: Pick<MerchProduct, "sizes" | "colors">): { size?: string; color?: string; key: string; label: string }[] {
  const sizes = p.sizes?.length ? p.sizes : [undefined];
  const colors = p.colors?.length ? p.colors : [undefined];
  const out: { size?: string; color?: string; key: string; label: string }[] = [];
  for (const s of sizes) for (const c of colors) {
    out.push({ size: s, color: c, key: variantKey(s, c), label: [s, c].filter(Boolean).join(" · ") || "—" });
  }
  return out;
}

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
