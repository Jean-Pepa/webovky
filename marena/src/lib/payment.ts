// QR Platba (český standard SPD od ČBA) — z účtu a částky vyrobí řetězec,
// který po zakódování do QR přečte každá česká bankovní aplikace.

// Převod „papírového" čísla účtu (předčíslí-číslo/kód banky) na IBAN.
// Kontrola: mod 11 s váhami ČNB pro předčíslí i číslo + mod 97 pro IBAN.

const NUM_WEIGHTS = [6, 3, 7, 9, 10, 5, 8, 4, 2, 1]; // pro 10místné číslo účtu
const PRE_WEIGHTS = [10, 5, 8, 4, 2, 1]; // pro 6místné předčíslí

function mod11ok(digits: string, weights: number[]): boolean {
  const padded = digits.padStart(weights.length, "0");
  const sum = [...padded].reduce((s, ch, i) => s + Number(ch) * weights[i], 0);
  return sum % 11 === 0;
}

// mod 97 přes BigInt-free postupné dělení (IBAN může mít 24+ číslic).
function mod97(numeric: string): number {
  let rem = 0;
  for (const ch of numeric) rem = (rem * 10 + Number(ch)) % 97;
  return rem;
}

function ibanChecksumOk(iban: string): boolean {
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  const numeric = [...rearranged].map((c) => (/[A-Z]/.test(c) ? String(c.charCodeAt(0) - 55) : c)).join("");
  return mod97(numeric) === 1;
}

export type ParsedAccount = { iban: string; display: string } | { error: string };

// Přijme „123456789/0800", „19-123456789/0800" i hotový IBAN („CZ65 0800 …").
export function parseAccount(input: string): ParsedAccount {
  const raw = input.trim();
  if (!raw) return { error: "Zadej číslo účtu." };

  // IBAN napřímo (s mezerami i bez)
  const compact = raw.replace(/\s+/g, "").toUpperCase();
  if (/^CZ\d{22}$/.test(compact)) {
    if (!ibanChecksumOk(compact)) return { error: "IBAN nesedí (překlep v číslici?)." };
    return { iban: compact, display: compact.replace(/(.{4})/g, "$1 ").trim() };
  }

  // Český formát: [předčíslí-]číslo/kód banky
  const m = raw.replace(/\s+/g, "").match(/^(?:(\d{1,6})-)?(\d{2,10})\/(\d{4})$/);
  if (!m) return { error: "Formát: 123456789/0800, případně s předčíslím 19-123456789/0800, nebo IBAN." };
  const [, pre = "", num, bank] = m;
  if (!mod11ok(num, NUM_WEIGHTS)) return { error: "Číslo účtu nesedí (kontrolní součet) — zkontroluj číslice." };
  if (pre && !mod11ok(pre, PRE_WEIGHTS)) return { error: "Předčíslí účtu nesedí (kontrolní součet)." };

  const bban = bank + pre.padStart(6, "0") + num.padStart(10, "0");
  const check = 98 - mod97([...(`${bban}CZ00`)].map((c) => (/[A-Z]/.test(c) ? String(c.charCodeAt(0) - 55) : c)).join(""));
  const iban = `CZ${String(check).padStart(2, "0")}${bban}`;
  return { iban, display: `${pre ? `${pre}-` : ""}${num}/${bank}` };
}

// Zpráva pro příjemce: bez diakritiky a hvězdiček (zakázané ve formátu SPD).
function sanitizeMsg(msg: string): string {
  return msg
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\*/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase()
    .slice(0, 60);
}

// Řetězec QR Platby. Částka v Kč (zaokrouhlí se na koruny — tak účtuje kasa).
export function spdString(opts: { iban: string; amount: number; message?: string }): string {
  const parts = [`SPD*1.0*ACC:${opts.iban}`, `AM:${Math.max(0, Math.round(opts.amount)).toFixed(2)}`, "CC:CZK"];
  const msg = opts.message ? sanitizeMsg(opts.message) : "";
  if (msg) parts.push(`MSG:${msg}`);
  return parts.join("*");
}
