// Porovnání jmen napříč appkou. Identita je jen jméno, takže drobné rozdíly
// (velikost písmen, diakritika, mezery) by neměly zakládat duplicitní účty.
// „Emma Džurbanová" == „emma dzurbanova".

export function normName(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, " ");
}

export function sameName(a: string, b: string): boolean {
  const na = normName(a);
  return na !== "" && na === normName(b);
}

// Úkol může mít víc řešitelů — jména oddělená čárkou („Petr, Jana").
// Vrátí true, když je `me` mezi nimi.
export function assigneeHas(assignee: string | undefined, me: string): boolean {
  if (!assignee) return false;
  return assignee.split(",").some((n) => sameName(n, me));
}

// Odhad pohlaví z českého jména (jen orientační počítadlo holky / kluci).
// Příjmení na „-ová" nebo přídavné na „-á" (Veselá) → holka; křestní jméno
// na „-a" / „-ie" → holka (kromě mužských výjimek jako Honza, Kuba, Jirka);
// mužské přídavné příjmení na „-ý" (Veselý, Novotný) → kluk; ostatní → kluk.
// Pár neutrálních jmen (Nikola, Saša, René) → „?". Pořadí jméno/příjmení nevadí.
export type GenderGuess = "f" | "m" | "?";
const MALE_A = new Set(["honza", "jirka", "kuba", "pepa", "mira", "luka", "standa", "franta", "tonda", "ondra", "vojta", "vasa", "jara", "pista", "ota", "jindra"]);
const FEMALE_OTHER = new Set(["dagmar", "miriam", "ester", "ingrid", "karin", "nikol", "noemi", "rut", "ruth", "judit", "dita", "michaela", "beata", "eliska", "carmen", "doris", "iris", "abigail"]);
const UNISEX = new Set(["nikola", "sasa", "rene", "alex", "robin", "misa", "lada"]);
export function guessGender(name: string): GenderGuess {
  const words = normName(name).split(" ").filter(Boolean);
  if (words.length === 0) return "?";
  // Příjmení rozhoduje nejspolehlivěji.
  if (words.some((w) => w.length >= 5 && w.endsWith("ova"))) return "f";
  if (words.some((w) => w.length >= 4 && /(k|n|l|r|t|v|h|d|s|z|c)y$/.test(w))) return "m";
  const first = words[0];
  if (UNISEX.has(first)) return "?";
  if (MALE_A.has(first)) return "m";
  if (FEMALE_OTHER.has(first)) return "f";
  if (first.endsWith("a") || first.endsWith("ie")) return "f";
  // Přídavné ženské příjmení na dlouhé „-á" (Veselá, Černá, Nová). Krátké „-a"
  // (Sýkora, Procházka, Kučera) je i mužské, proto se kontroluje před odstraněním diakritiky.
  const raw = name.trim().toLowerCase().split(/\s+/);
  if (raw.length > 1 && raw.slice(1).some((w) => w.length >= 4 && w.endsWith("á"))) return "f";
  return "m";
}
