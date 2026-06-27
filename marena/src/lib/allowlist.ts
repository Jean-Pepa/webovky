import { readDB } from "./server-db";

// Kdo se smí po ověření e-mailu dostat dovnitř (allowlist):
//  • e-maily v proměnné MARENA_ALLOWED_EMAILS (čárkami; na rozjezd + správce), a
//  • e-maily lidí, které správce zapsal do týmu (member.email v jakémkoli ročníku).
// Tím se brání tomu, aby se přihlásil kdokoli s libovolným mailem.
function norm(e: string): string {
  return (e || "").trim().toLowerCase();
}

export function envAllowed(): Set<string> {
  const raw = process.env.MARENA_ALLOWED_EMAILS ?? "";
  return new Set(
    raw
      .split(/[,\s;]+/)
      .map(norm)
      .filter(Boolean),
  );
}

export async function isEmailAllowed(email: string | null | undefined): Promise<boolean> {
  const e = norm(email ?? "");
  if (!e) return false;
  if (envAllowed().has(e)) return true;
  const db = await readDB();
  if (!db) return false;
  for (const y of db.years) {
    for (const m of y.members) {
      if (norm(m.email ?? "") === e) return true;
    }
  }
  return false;
}
