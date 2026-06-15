export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("cs-CZ", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).format(d);
}

export function formatCurrency(czk: number): string {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  }).format(czk);
}

export function formatFileSize(bytes: number): string {
  if (!bytes) return "—";
  const units = ["B", "kB", "MB", "GB"];
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

// dd.mm.yyyy -> hodnota pro <input type="date">
export function toDateInputValue(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString().slice(0, 10);
}

export function addressLine(p: {
  street?: string | null;
  city?: string | null;
  zip?: string | null;
}): string {
  const parts = [p.street, [p.zip, p.city].filter(Boolean).join(" ")].filter(Boolean);
  return parts.join(", ") || "Adresa neuvedena";
}

function pluralDays(n: number): string {
  if (n === 1) return "den";
  if (n >= 2 && n <= 4) return "dny";
  return "dní";
}

// Stav termínu připomínky vůči dnešku.
export function dueStatus(dueDate: string): { overdue: boolean; soon: boolean; label: string } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(`${dueDate}T00:00:00`);
  const diff = Math.round((due.getTime() - today.getTime()) / 86_400_000);
  if (diff < 0) {
    const n = Math.abs(diff);
    return { overdue: true, soon: false, label: `Po termínu o ${n} ${pluralDays(n)}` };
  }
  if (diff === 0) return { overdue: false, soon: true, label: "Termín dnes" };
  if (diff <= 30) return { overdue: false, soon: true, label: `Za ${diff} ${pluralDays(diff)}` };
  return { overdue: false, soon: false, label: formatDate(dueDate) };
}
