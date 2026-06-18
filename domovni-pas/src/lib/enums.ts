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

// Kategorie nákladů (rozpočet)
export const COST_CATEGORIES: Record<string, string> = {
  MATERIAL: "Materiál",
  PRACE: "Práce",
  PROJEKT: "Projekt a povolení",
  TZB: "Technická zařízení (TZB)",
  VYBAVENI: "Vybavení",
  OSTATNI: "Ostatní",
};

// Sekce/fáze projektu pro dokumentaci
export const DOC_SECTIONS: Record<string, string> = {
  POZEMEK: "Pozemek",
  NAVRH: "Návrh",
  REALIZACE: "Realizace",
  BUDOVA: "Budova",
};

export const DOC_SECTION_ORDER = ["POZEMEK", "NAVRH", "REALIZACE", "BUDOVA"] as const;

// Když dokument nemá explicitní sekci, odvodíme ji z kategorie
export const CATEGORY_TO_SECTION: Record<string, string> = {
  CONTRACT: "POZEMEK",
  PLAN: "NAVRH",
  ENERGY_LABEL: "BUDOVA",
  CERTIFICATE: "BUDOVA",
  INVOICE: "REALIZACE",
  OTHER: "BUDOVA",
};

// Sekce dokumentu (explicitní, nebo odvozená z kategorie)
export function documentSection(doc: { section?: string; category: string }): string {
  return doc.section ?? CATEGORY_TO_SECTION[doc.category] ?? "BUDOVA";
}

// Automatické zařazení dokumentu podle názvu souboru (architekt nahraje → roztřídí se).
export function guessDocCategory(fileName: string): string {
  const n = fileName.toLowerCase();
  if (/penb|energ|štítek|stitek/.test(n)) return "ENERGY_LABEL";
  if (/smlouv|contract/.test(n)) return "CONTRACT";
  if (/faktur|invoice|účtenka|uctenka|paragon|doklad/.test(n)) return "INVOICE";
  if (/reviz|certifik|protokol|atest|zpráva|zprava/.test(n)) return "CERTIFICATE";
  if (/půdorys|pudorys|plán|plan|výkres|vykres|řez|rez|pohled|situac|projekt|\.dwg|\.dxf|\.ifc/.test(n))
    return "PLAN";
  return "OTHER";
}

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
