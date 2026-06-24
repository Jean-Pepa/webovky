// Pomocné formátování datumů v češtině.

const MONTHS = ["led", "úno", "bře", "dub", "kvě", "čvn", "čvc", "srp", "zář", "říj", "lis", "pro"];
const DAYS = ["ne", "po", "út", "st", "čt", "pá", "so"];

export function fmtDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso.length <= 10 ? `${iso}T00:00:00` : iso);
  if (isNaN(d.getTime())) return iso;
  return `${d.getDate()}. ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function fmtDayShort(iso: string): { day: number; dow: string; month: string } {
  const d = new Date(`${iso}T00:00:00`);
  return { day: d.getDate(), dow: DAYS[d.getDay()], month: MONTHS[d.getMonth()] };
}

export function fmtRelative(iso: string): string {
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const min = Math.round(diff / 60000);
  if (min < 1) return "teď";
  if (min < 60) return `před ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `před ${h} h`;
  const d = Math.round(h / 24);
  if (d < 30) return `před ${d} d`;
  return fmtDate(iso);
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}
