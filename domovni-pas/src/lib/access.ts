import type { Property, Role } from "./store";

export const ROLE_LABELS: Record<Role, string> = {
  ARCHITECT: "Architekt",
  CLIENT: "Klient / majitel",
  CREATOR: "Tvůrce (admin)",
};

export const ROLE_INITIALS: Record<Role, string> = {
  ARCHITECT: "AR",
  CLIENT: "KL",
  CREATOR: "TV",
};

// Kdo vidí kterou nemovitost
export function canSeeProperty(p: Property, role: Role): boolean {
  if (role === "CREATOR") return true; // tvůrce vidí vše
  if (role === "ARCHITECT") return p.createdByRole === "ARCHITECT"; // jen své projekty
  // klient: vlastní (vytvořené) nebo přeposlané (předané)
  const created = p.createdByRole ?? "CLIENT";
  return created === "CLIENT" || !!p.handedOver;
}

// Kdo smí nemovitost upravovat (měnit a mazat existující, měnit nastavení)
export function canEditProperty(p: Property, role: Role): boolean {
  if (role === "CREATOR") return true;
  if (role === "ARCHITECT") return p.createdByRole === "ARCHITECT" && !p.handedOver; // po předání zámek
  return canSeeProperty(p, role); // klient edituje, co vidí
}

// Kdo smí přidávat nový obsah (dokumenty, fotky, systémy, záznamy).
// Architekt smí přidávat i PO předání (nad rámec projektu), ale ne měnit/mazat původní.
export function canContributeToProperty(p: Property, role: Role): boolean {
  if (role === "ARCHITECT") return p.createdByRole === "ARCHITECT";
  return canEditProperty(p, role);
}
