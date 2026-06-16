// České popisky a barvy výčtových hodnot.

export const PROPERTY_TYPES: Record<string, string> = {
  HOUSE: "Dům",
  APARTMENT: "Byt",
  OTHER: "Jiné",
};

export const ENTRY_TYPES: Record<string, string> = {
  PURCHASE: "Koupě",
  HANDOVER: "Převzetí",
  REPAIR: "Oprava",
  DEFECT: "Závada",
  INSPECTION: "Revize",
  RENOVATION: "Rekonstrukce",
  INSURANCE: "Pojistná událost",
  OTHER: "Jiné",
};

export type BadgeColor = "blue" | "red" | "violet" | "emerald" | "gray" | "teal" | "amber";

export const ENTRY_TYPE_COLORS: Record<string, BadgeColor> = {
  PURCHASE: "teal",
  HANDOVER: "amber",
  REPAIR: "blue",
  DEFECT: "red",
  INSPECTION: "violet",
  RENOVATION: "emerald",
  INSURANCE: "amber",
  OTHER: "gray",
};

export const DOCUMENT_CATEGORIES: Record<string, string> = {
  CONTRACT: "Smlouva",
  PLAN: "Projekt / plány",
  ENERGY_LABEL: "Energetický štítek (PENB)",
  CERTIFICATE: "Certifikát / revize",
  INVOICE: "Faktura / doklad",
  OTHER: "Ostatní",
};

export const REMINDER_TYPES: Record<string, string> = {
  INSPECTION: "Revize",
  MAINTENANCE: "Údržba",
  WARRANTY: "Záruka",
  OTHER: "Jiné",
};

// Návrhy místností / oblastí pro vybavení (datalist)
export const ROOM_SUGGESTIONS = [
  "Kuchyně",
  "Koupelna",
  "WC",
  "Obývací pokoj",
  "Ložnice",
  "Dětský pokoj",
  "Chodba",
  "Kotelna",
  "Technická místnost",
  "Garáž",
  "Sklep",
  "Půda",
  "Střecha",
  "Fasáda",
  "Zahrada",
  "Terasa",
];

// Energetická třída (PENB)
export const ENERGY_CLASSES = ["A", "B", "C", "D", "E", "F", "G"];
