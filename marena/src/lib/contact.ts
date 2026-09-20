// Kontrola kontaktních údajů ve veřejných formulářích (objednávka merche/lístků).
// Používá se na klientu (okamžitá zpětná vazba) i na serveru (nic nejde obejít).

// E-mail musí mít tvar neco@domena.xx — tedy „@" a tečku v doméně.
export function isValidEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
}

// Telefon: do pole jdou psát jen číslice, mezery a „+" na začátku (písmena
// a jiné znaky se při psaní rovnou zahodí).
export function sanitizePhone(v: string): string {
  const s = v.replace(/[^\d+\s]/g, "");
  const plus = s.startsWith("+") ? "+" : "";
  return plus + s.replace(/\+/g, "").replace(/\s{2,}/g, " ").trimStart();
}

// Platný = 7–15 číslic (mezinárodní formát E.164 i s předvolbou; české číslo
// s +420 má 12). Přesnější kontrola podle předvolby je v dialcodes.ts (klient).
export function isValidPhone(v: string): boolean {
  const digits = v.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

export const PHONE_ERR = "Zadej platný telefon — jen číslice (české číslo má 9, např. 777 123 456).";
export const EMAIL_ERR = "Zadej platný e-mail s @ (např. jmeno@email.cz).";
