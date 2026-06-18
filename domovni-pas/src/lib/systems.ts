import type { ComponentType } from "react";
import { IconSun, IconBolt, IconDrop, IconThermo, IconWrench, IconBox } from "@/components/Icons";
import type { HouseSystemKind, SystemSpec } from "@/lib/store";

export const SYSTEM_KINDS: Record<
  HouseSystemKind,
  { label: string; Icon: ComponentType<{ className?: string }>; accent: string }
> = {
  solar: { label: "Solár / FVE", Icon: IconSun, accent: "bg-amber-50 text-amber-600" },
  electricity: { label: "Elektřina", Icon: IconBolt, accent: "bg-yellow-50 text-yellow-700" },
  water: { label: "Voda", Icon: IconDrop, accent: "bg-sky-50 text-sky-600" },
  heating: { label: "Topení / teplota", Icon: IconThermo, accent: "bg-red-50 text-red-600" },
  ventilation: { label: "Vzduchotechnika", Icon: IconWrench, accent: "bg-teal-50 text-teal-700" },
  other: { label: "Jiné", Icon: IconBox, accent: "bg-stone-100 text-stone-600" },
};

export const SYSTEM_KIND_ORDER: HouseSystemKind[] = [
  "solar",
  "electricity",
  "water",
  "heating",
  "ventilation",
  "other",
];

export function parseSpecs(text: string): SystemSpec[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const i = l.indexOf(":");
      if (i === -1) return { label: l, value: "" };
      return { label: l.slice(0, i).trim(), value: l.slice(i + 1).trim() };
    })
    .filter((s) => s.label);
}

export function specsToText(specs: SystemSpec[]): string {
  return specs.map((s) => (s.value ? `${s.label}: ${s.value}` : s.label)).join("\n");
}
