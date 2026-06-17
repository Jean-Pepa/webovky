import type { AnnouncementCategory } from "./store";

// Kategorie zpráv na nástěnce — popisek + barva odznaku (dle běžných SVJ aplikací)
export const ANN_CAT: Record<AnnouncementCategory, { label: string; badge: string }> = {
  GENERAL: { label: "Všeobecná informace", badge: "bg-emerald-100 text-emerald-700" },
  IMPORTANT: { label: "Důležitá informace", badge: "bg-rose-100 text-rose-700" },
  INTERNAL: { label: "Interní informace", badge: "bg-amber-100 text-amber-700" },
  MAINTENANCE: { label: "Údržba", badge: "bg-stone-200 text-stone-700" },
};

export const ANN_CAT_ORDER: AnnouncementCategory[] = [
  "GENERAL",
  "IMPORTANT",
  "INTERNAL",
  "MAINTENANCE",
];
