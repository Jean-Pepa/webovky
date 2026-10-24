"use client";

import type { Property } from "@/lib/store";

// STUB — implementuje agent „Model": malý náhled polohy prvku na půdorysu (pro „Vše o prvku").
// Když prvek nemá polohu na podkladu, vrací null.
export function PlanMini({
  property,
  elementId,
  className,
}: {
  property: Property;
  elementId: string;
  className?: string;
}) {
  void property;
  void elementId;
  void className;
  return null;
}
