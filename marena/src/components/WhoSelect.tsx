"use client";

import { useStore } from "@/lib/store";

// Výběr „kdo to řeší / shání" — rozbalovací seznam členů týmu (jako u Úkolů
// pole „Kdo?"). Nahoře „Já (jméno)", pak ostatní. Ručně zadané jméno, které
// v týmu není (starší záznamy), se zachová jako vybraná možnost, ať nezmizí.
export function WhoSelect({
  value,
  onChange,
  placeholder = "Kdo? (nepovinné)",
  className = "input",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const { currentYear, me } = useStore();
  const members = currentYear?.members ?? [];
  const known = !value || value === me || members.some((m) => m.name === value);
  return (
    <select className={className} value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">{placeholder}</option>
      {me && <option value={me}>Já ({me})</option>}
      {members
        .filter((m) => m.name !== me)
        .map((m) => (
          <option key={m.id} value={m.name}>
            {m.name}
          </option>
        ))}
      {!known && <option value={value}>{value}</option>}
    </select>
  );
}
