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

export type ParsedAccount = { iban: string; bic?: string; display: string; warning?: string } | { error: string };

// Přijme „123456789/0800", „19-123456789/0800" i hotový IBAN kterékoli země
// („CZ65 0800 …", „LT34 3250 …" — třeba Revolut). Za IBAN jde připojit BIC
// přes plus: „LT34…5656+REVOLT21" (u SEPA plateb je BIC nepovinný).
export function parseAccount(input: string): ParsedAccount {
  const raw = input.trim();
  if (!raw) return { error: "Zadej číslo účtu." };

  // IBAN napřímo (s mezerami i bez), volitelně +BIC
  const compactAll = raw.replace(/\s+/g, "").toUpperCase();
  const [ibanPart, bicPart] = compactAll.split("+");
  if (/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(ibanPart)) {
    if (!ibanChecksumOk(ibanPart)) return { error: "IBAN nesedí (překlep v číslici?)." };
    if (bicPart && !/^[A-Z0-9]{8}([A-Z0-9]{3})?$/.test(bicPart)) return { error: "BIC/SWIFT má 8 nebo 11 znaků (např. REVOLT21)." };
    // Zahraniční (ne-CZ) IBAN bez BIC → česká banka v QR nedokáže určit banku.
    const foreignNoBic = !bicPart && !ibanPart.startsWith("CZ");
    return {
      iban: ibanPart,
      bic: bicPart || undefined,
      display: ibanPart.replace(/(.{4})/g, "$1 ").trim(),
      warning: foreignNoBic
        ? "Zahraniční účet (IBAN) bez BIC/SWIFT — česká banka ho v QR často nenačte. Přidej za IBAN „+BIC“, u Revolutu +REVOLT21."
        : undefined,
    };
  }

  // Český formát: [předčíslí-]číslo/kód banky
  const m = raw.replace(/\s+/g, "").match(/^(?:(\d{1,6})-)?(\d{2,10})\/(\d{4})$/);
  if (!m) return { error: "Formát: 123456789/0800 (příp. s předčíslím), nebo IBAN — třeba LT34…, volitelně IBAN+BIC." };
  const [, pre = "", num, bank] = m;
  if (!mod11ok(num, NUM_WEIGHTS)) return { error: "Číslo účtu nesedí (kontrolní součet) — zkontroluj číslice." };
  if (pre && !mod11ok(pre, PRE_WEIGHTS)) return { error: "Předčíslí účtu nesedí (kontrolní součet)." };

  const bban = bank + pre.padStart(6, "0") + num.padStart(10, "0");
  const check = 98 - mod97([...(`${bban}CZ00`)].map((c) => (/[A-Z]/.test(c) ? String(c.charCodeAt(0) - 55) : c)).join(""));
  const iban = `CZ${String(check).padStart(2, "0")}${bban}`;
  return { iban, display: `${pre ? `${pre}-` : ""}${num}/${bank}` };
}

// Zpráva pro příjemce: bez diakritiky a hvězdiček (zakázané ve formátu SPD).
// Znaky mimo ASCII (×, pomlčky…) se přepíší, ať zprávu zobrazí každá banka.
function sanitizeMsg(msg: string): string {
  return msg
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/×/g, "X")
    .replace(/[—–·]/g, "-")
    .replace(/\*/g, " ")
    .replace(/[^\x20-\x7e]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase()
    .slice(0, 60);
}

// Řetězec QR Platby. Částka v Kč (zaokrouhlí se na koruny — tak účtuje kasa).
// U zahraničního IBAN (SEPA) se k účtu přidá BIC, pokud je zadaný.
export function spdString(opts: { iban: string; bic?: string; amount: number; message?: string }): string {
  const acc = opts.bic ? `${opts.iban}+${opts.bic}` : opts.iban;
  const parts = [`SPD*1.0*ACC:${acc}`, `AM:${Math.max(0, Math.round(opts.amount)).toFixed(2)}`, "CC:CZK"];
  const msg = opts.message ? sanitizeMsg(opts.message) : "";
  if (msg) parts.push(`MSG:${msg}`);
  return parts.join("*");
}
