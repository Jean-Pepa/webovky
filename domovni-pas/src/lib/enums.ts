// Výčtové hodnoty + jejich české popisky a barvy (SQLite nemá nativní enumy).

export const PROPERTY_TYPES = {
  HOUSE: "Dům",
  APARTMENT: "Byt",
  OTHER: "Jiné",
} as const;
export type PropertyType = keyof typeof PROPERTY_TYPES;

export const ENTRY_TYPES = {
  REPAIR: "Oprava",
  DEFECT: "Závada",
  INSPECTION: "Revize",
  RENOVATION: "Rekonstrukce",
  OTHER: "Jiné",
} as const;
export type EntryType = keyof typeof ENTRY_TYPES;

// Barevné varianty pro Badge (viz components/ui/Badge.tsx)
export const ENTRY_TYPE_COLORS = {
  REPAIR: "blue",
  DEFECT: "red",
  INSPECTION: "violet",
  RENOVATION: "emerald",
  OTHER: "gray",
} as const satisfies Record<EntryType, string>;

export const DOCUMENT_CATEGORIES = {
  PLAN: "Projekt / plány",
  CERTIFICATE: "Certifikát / revize",
  ENERGY_LABEL: "Energetický štítek (PENB)",
  INVOICE: "Faktura / doklad",
  OTHER: "Ostatní",
} as const;
export type DocumentCategory = keyof typeof DOCUMENT_CATEGORIES;

export const USER_ROLES = {
  OWNER: "Majitel",
  PROFESSIONAL: "Odborník (architekt / firma)",
} as const;
export type UserRole = keyof typeof USER_ROLES;

export const MEDIA_TYPES = {
  PHOTO: "Foto",
  VIDEO: "Video",
  PANORAMA: "360° panorama",
  FILE: "Soubor",
} as const;
export type MediaType = keyof typeof MEDIA_TYPES;

export function mediaTypeFromMime(mime: string): MediaType {
  if (mime.startsWith("image/")) return "PHOTO";
  if (mime.startsWith("video/")) return "VIDEO";
  return "FILE";
}

export function isEntryType(v: string): v is EntryType {
  return v in ENTRY_TYPES;
}
export function isPropertyType(v: string): v is PropertyType {
  return v in PROPERTY_TYPES;
}
export function isDocumentCategory(v: string): v is DocumentCategory {
  return v in DOCUMENT_CATEGORIES;
}
