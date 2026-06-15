/** Drobné formátovací a datové pomocníky (čeština). */

/** Česká množná čísla: 1 → one, 2–4 → few, jinak → many. */
export function pluralCz(n: number, one: string, few: string, many: string): string {
  if (n === 1) return one;
  if (n >= 2 && n <= 4) return few;
  return many;
}

/** Věk z "YYYY-MM" v měsících k danému datu. */
export function ageInMonths(birthMonth: string, now: Date = new Date()): number {
  const [y, m] = birthMonth.split('-').map(Number);
  if (!y || !m) return 0;
  return Math.max(0, (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m));
}

/** Lidsky čitelný věk, např. "1 rok 3 měsíce". */
export function formatAgeMonths(total: number): string {
  const years = Math.floor(total / 12);
  const months = total % 12;
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} ${pluralCz(years, 'rok', 'roky', 'let')}`);
  if (months > 0 || years === 0) {
    parts.push(`${months} ${pluralCz(months, 'měsíc', 'měsíce', 'měsíců')}`);
  }
  return parts.join(' ');
}

/** "YYYY-MM" odpovídající psovi starému X let a Y měsíců. */
export function birthMonthFrom(years: number, months: number, now: Date = new Date()): string {
  const total = years * 12 + months;
  const d = new Date(now.getFullYear(), now.getMonth() - total, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/** Rozloží celkové měsíce na { years, months }. */
export function splitMonths(total: number): { years: number; months: number } {
  return { years: Math.floor(total / 12), months: total % 12 };
}
