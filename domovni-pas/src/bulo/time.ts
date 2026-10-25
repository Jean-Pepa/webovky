// Pomocné funkce pro čas a data v češtině.

export const DAY = 24 * 60 * 60 * 1000;

export function hm(ts: number): string {
  const d = new Date(ts);
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function dm(ts: number): string {
  const d = new Date(ts);
  return `${d.getDate()}. ${d.getMonth() + 1}.`;
}

export function dmy(ts: number): string {
  const d = new Date(ts);
  return `${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()}`;
}

export function my(ts: number): string {
  const d = new Date(ts);
  return `${d.getMonth() + 1}/${d.getFullYear()}`;
}

/** Další termín: za `months` měsíců, termín se zaokrouhlí na začátek následujícího měsíce. */
export function nextTerm(ts: number, months = 12): string {
  const d = new Date(ts);
  let m = d.getMonth() + months;
  let y = d.getFullYear();
  if (d.getDate() > 15) m += 1;
  y += Math.floor(m / 12);
  m = ((m % 12) + 12) % 12;
  return `${m + 1}/${y}`;
}

export function startOfDay(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/** „za 12 dní“, „zítra“, „dnes“, „před 3 dny“. */
export function relDays(due: number, now: number): string {
  const n = Math.round((startOfDay(due) - startOfDay(now)) / DAY);
  if (n === 0) return "dnes";
  if (n === 1) return "zítra";
  if (n > 1 && n < 5) return `za ${n} dny`;
  if (n >= 5) return `za ${n} dní`;
  if (n === -1) return "včera";
  return `před ${-n} ${-n < 5 ? "dny" : "dny"}`;
}

const WEEKDAYS = ["neděle", "pondělí", "úterý", "středa", "čtvrtek", "pátek", "sobota"];
const MONTHS_GEN = ["ledna", "února", "března", "dubna", "května", "června", "července", "srpna", "září", "října", "listopadu", "prosince"];

export function lockDate(ts: number): string {
  const d = new Date(ts);
  return `${WEEKDAYS[d.getDay()]} ${d.getDate()}. ${MONTHS_GEN[d.getMonth()]}`;
}

export function ago(ts: number, now: number): string {
  const s = Math.max(0, Math.round((now - ts) / 1000));
  if (s < 50) return "teď";
  const m = Math.round(s / 60);
  if (m < 60) return `před ${m} min`;
  const h = Math.round(m / 60);
  if (h < 24) return `před ${h} h`;
  return dm(ts);
}

export function num(n: number, digits = 1): string {
  return n.toFixed(digits).replace(".", ",");
}
