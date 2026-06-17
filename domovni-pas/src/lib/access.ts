import type { Property, Role } from "./store";

export const ROLE_LABELS: Record<Role, string> = {
  ARCHITECT: "Architekt",
  CLIENT: "Klient / majitel",
  CREATOR: "Správce SVJ",
  OWNER: "Vlastník / rezident",
};

export const ROLE_INITIALS: Record<Role, string> = {
  ARCHITECT: "AR",
  CLIENT: "KL",
  CREATOR: "SV",
  OWNER: "VL",
};

// Kdo vidí kterou nemovitost
export function canSeeProperty(p: Property, role: Role): boolean {
  // Správce SVJ: své bytové domy (a cokoli, co sám založil) — ne celý systém
  if (role === "CREATOR") return p.type === "BUILDING" || p.createdByRole === "CREATOR";
  if (role === "ARCHITECT") return p.createdByRole === "ARCHITECT"; // jen své projekty
  if (role === "OWNER") return p.type === "BUILDING"; // rezident vidí svůj bytový dům (SVJ)
  // klient: vlastní (vytvořené) nebo přeposlané (předané)
  const created = p.createdByRole ?? "CLIENT";
  return created === "CLIENT" || !!p.handedOver;
}

// Kdo smí nemovitost upravovat
export function canEditProperty(p: Property, role: Role): boolean {
  // Správce SVJ edituje vše ve svých domech (stejný SVJ pohled jako rezident, ale s editací)
  if (role === "CREATOR") return canSeeProperty(p, role);
  if (role === "OWNER") return false; // rezident má pas jen ke čtení (hlásí závady, hlasuje)
  if (role === "ARCHITECT") return p.createdByRole === "ARCHITECT" && !p.handedOver; // po předání zámek
  return canSeeProperty(p, role); // klient edituje, co vidí
}
