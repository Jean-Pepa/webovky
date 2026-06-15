// České popisky a barvy výčtových hodnot.

export const PROPERTY_TYPES: Record<string, string> = {
  HOUSE: "Dům",
  APARTMENT: "Byt",
  OTHER: "Jiné",
};

export const ENTRY_TYPES: Record<string, string> = {
  REPAIR: "Oprava",
  DEFECT: "Závada",
  INSPECTION: "Revize",
  RENOVATION: "Rekonstrukce",
  OTHER: "Jiné",
};

export type BadgeColor = "blue" | "red" | "violet" | "emerald" | "gray" | "teal" | "amber";

export const ENTRY_TYPE_COLORS: Record<string, BadgeColor> = {
  REPAIR: "blue",
  DEFECT: "red",
  INSPECTION: "violet",
  RENOVATION: "emerald",
  OTHER: "gray",
};

export const DOCUMENT_CATEGORIES: Record<string, string> = {
  PLAN: "Projekt / plány",
  CERTIFICATE: "Certifikát / revize",
  ENERGY_LABEL: "Energetický štítek (PENB)",
  INVOICE: "Faktura / doklad",
  OTHER: "Ostatní",
};
