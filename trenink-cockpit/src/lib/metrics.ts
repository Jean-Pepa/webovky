import type { Activity } from "./types";

// Formátovací a výpočetní pomůcky nad aktivitami.

export function fmtPace(sPerKm: number | null): string {
  if (!sPerKm || !isFinite(sPerKm) || sPerKm <= 0) return "–";
  const m = Math.floor(sPerKm / 60);
  const s = Math.round(sPerKm % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function fmtDuration(s: number | null): string {
  if (!s || s <= 0) return "–";
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")} h`;
  return `${m}:${String(Math.round(s % 60)).padStart(2, "0")} min`;
}

export function fmtKm(km: number | null): string {
  if (km == null) return "–";
  return (Math.round(km * 10) / 10).toString();
}

// ISO týden (pondělí start) jako klíč "YYYY-Www".
export function isoWeekKey(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00Z");
  const day = (d.getUTCDay() + 6) % 7; // Po=0
  d.setUTCDate(d.getUTCDate() - day + 3); // čtvrtek daného týdne
  const firstThu = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const week =
    1 +
    Math.round(
      ((d.getTime() - firstThu.getTime()) / 86400000 -
        3 +
        ((firstThu.getUTCDay() + 6) % 7)) /
        7
    );
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

export interface WeekBucket {
  key: string;
  km: number;
  count: number;
  durationS: number;
}

export function weeklyBuckets(activities: Activity[], weeks = 12): WeekBucket[] {
  const map = new Map<string, WeekBucket>();
  for (const a of activities) {
    const k = isoWeekKey(a.date);
    const b = map.get(k) ?? { key: k, km: 0, count: 0, durationS: 0 };
    b.km += a.distanceKm ?? 0;
    b.count += 1;
    b.durationS += a.durationS ?? 0;
    map.set(k, b);
  }
  return Array.from(map.values())
    .sort((a, b) => a.key.localeCompare(b.key))
    .slice(-weeks);
}

export interface Summary {
  totalKm: number;
  totalCount: number;
  totalDurationS: number;
  thisWeekKm: number;
  thisWeekCount: number;
  latestVo2max: number | null;
  avgHrRuns: number | null;
  longest: Activity | null;
  lastActivity: Activity | null;
}

export function summarize(activities: Activity[], todayIso: string | null): Summary {
  let totalKm = 0,
    totalDurationS = 0;
  let vo2: number | null = null;
  let hrSum = 0,
    hrN = 0;
  let longest: Activity | null = null;
  for (const a of activities) {
    totalKm += a.distanceKm ?? 0;
    totalDurationS += a.durationS ?? 0;
    if (a.vo2max != null && vo2 == null) vo2 = a.vo2max; // aktivity jsou seřazené od nejnovější
    if (a.avgHr != null && (a.type === "running" || a.type === "skiing")) {
      hrSum += a.avgHr;
      hrN += 1;
    }
    if (a.distanceKm != null && (!longest || (longest.distanceKm ?? 0) < a.distanceKm)) longest = a;
  }

  const thisWeek = todayIso ? isoWeekKey(todayIso) : null;
  let thisWeekKm = 0,
    thisWeekCount = 0;
  if (thisWeek) {
    for (const a of activities) {
      if (isoWeekKey(a.date) === thisWeek) {
        thisWeekKm += a.distanceKm ?? 0;
        thisWeekCount += 1;
      }
    }
  }

  return {
    totalKm: Math.round(totalKm * 10) / 10,
    totalCount: activities.length,
    totalDurationS,
    thisWeekKm: Math.round(thisWeekKm * 10) / 10,
    thisWeekCount,
    latestVo2max: vo2,
    avgHrRuns: hrN ? Math.round(hrSum / hrN) : null,
    longest,
    lastActivity: activities[0] ?? null,
  };
}

export const TYPE_META: Record<string, { label: string; color: string; icon: string }> = {
  running: { label: "Běh", color: "#0071e3", icon: "🏃" },
  skiing: { label: "Běžky", color: "#6d4bd8", icon: "🎿" },
  cycling: { label: "Kolo", color: "#0a97a8", icon: "🚴" },
  strength: { label: "Síla", color: "#b8860b", icon: "🏋️" },
  walking: { label: "Chůze", color: "#1f9d55", icon: "🥾" },
  swimming: { label: "Plavání", color: "#0a63cf", icon: "🏊" },
  other: { label: "Jiné", color: "#5b6b80", icon: "•" },
};

export function typeMeta(t: string) {
  return TYPE_META[t] ?? TYPE_META.other;
}
