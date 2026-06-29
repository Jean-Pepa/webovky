// Jednoduché vyhledávání bez ohledu na velikost písmen a diakritiku.
export function norm(s: string): string {
  return (s || "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

// Vrátí true, když dotaz (po normalizaci) je obsažen v některém z polí.
// Prázdný dotaz = projde vše.
export function matchesQuery(query: string, ...fields: (string | number | null | undefined)[]): boolean {
  const q = norm(query);
  if (!q) return true;
  const hay = fields.map((f) => norm(String(f ?? ""))).join("  ");
  return q.split(/\s+/).every((part) => hay.includes(part));
}
