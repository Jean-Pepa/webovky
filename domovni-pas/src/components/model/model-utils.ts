// Podklady modelu (půdorysy) — skupiny podle názvu, verze, výchozí podklad.

import type { HouseElement, HouseModel, Property } from "@/lib/store";
import { ISO_DATE_RE, formatDay, localIsoDate } from "@/lib/deadlines";

// Rozměr podkladu, když chybí (starší data)
export const DEFAULT_PLAN_W = 1000;
export const DEFAULT_PLAN_H = 700;

export function planDims(m: Pick<HouseModel, "width" | "height">): { w: number; h: number } {
  return {
    w: m.width && m.width > 0 ? m.width : DEFAULT_PLAN_W,
    h: m.height && m.height > 0 ? m.height : DEFAULT_PLAN_H,
  };
}

export type PlanGroup = { title: string; latest: HouseModel; older: HouseModel[] };

export function floorplans(property: Property): HouseModel[] {
  return (property.models ?? []).filter((m) => m.kind === "FLOORPLAN");
}

// Podle názvu („Přízemí", „1. NP"); v pořadí, v jakém podklady přibyly. Starší verze sestupně.
export function groupPlans(models: HouseModel[]): PlanGroup[] {
  const map = new Map<string, HouseModel[]>();
  for (const m of models) map.set(m.title, [...(map.get(m.title) ?? []), m]);
  return [...map.entries()].map(([title, list]) => {
    const sorted = [...list].sort(
      (a, b) => (b.version ?? 0) - (a.version ?? 0) || (b.createdAt ?? "").localeCompare(a.createdAt ?? ""),
    );
    return { title, latest: sorted[0], older: sorted.slice(1) };
  });
}

// Prvek má polohu na tomto podkladu
export function isOnModel(el: HouseElement, modelId?: string): boolean {
  return !!modelId && el.plan?.modelId === modelId && el.plan.points.length > 0;
}

export function modelVersionLabel(m: Pick<HouseModel, "title" | "version">): string {
  return `${m.title} · verze ${m.version}`;
}

// „1. června 2009" (místní datum); neplatné / chybějící datum → „neuvedeno"
export function formatPlanDate(date?: string): string {
  if (!date || !ISO_DATE_RE.test(date)) return "neuvedeno";
  return formatDay(date);
}

// Dnešek jako YYYY-MM-DD (místní čas)
export function todayIso(): string {
  return localIsoDate();
}

export function formatBytes(n: number): string {
  if (n >= 1024 * 1024) return `${(n / 1024 / 1024).toLocaleString("cs-CZ", { maximumFractionDigits: 1 })} MB`;
  return `${Math.max(1, Math.round(n / 1024))} kB`;
}

// Česká množná čísla: 1 prvek, 2–4 prvky, 5+ prvků
export function plural(n: number, one: string, few: string, many: string): string {
  if (n === 1) return `${n} ${one}`;
  if (n >= 2 && n <= 4) return `${n} ${few}`;
  return `${n} ${many}`;
}

export function elementPageHref(propertyId: string, elementId: string): string {
  return `/nemovitost/${propertyId}/prvek/${elementId}`;
}

export function newEntryHref(propertyId: string, elementId: string): string {
  return `/nemovitost/${propertyId}/zaznam/novy?prvek=${encodeURIComponent(elementId)}`;
}
