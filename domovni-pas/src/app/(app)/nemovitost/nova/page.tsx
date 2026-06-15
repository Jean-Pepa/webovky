"use client";

import { PropertyForm } from "@/components/forms/PropertyForm";
import { BackLink } from "@/components/BackLink";

export default function NewPropertyPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <BackLink href="/prehled">Zpět na přehled</BackLink>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-stone-900">Nová nemovitost</h1>
      <p className="mt-1 text-sm text-stone-500">
        Stačí název, zbytek můžete doplnit kdykoli později.
      </p>
      <div className="card mt-6 p-6">
        <PropertyForm />
      </div>
    </div>
  );
}
