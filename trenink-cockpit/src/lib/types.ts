// Datové typy sdílené appkou i ingest skriptem.

export interface Activity {
  id: string; // Garmin activityId (nebo vlastní)
  date: string; // YYYY-MM-DD (lokální datum aktivity)
  type: string; // running | cycling | skiing | strength | walking | other
  name: string;
  distanceKm: number | null;
  durationS: number | null; // trvání v sekundách
  paceSPerKm: number | null; // tempo v s/km (běh) — u kola dává smysl rychlost
  avgHr: number | null;
  maxHr: number | null;
  vo2max: number | null;
  trainingEffect: number | null; // aerobní training effect (0–5)
  elevationGainM: number | null;
  calories: number | null;
}

export type Author = "user" | "claude";
export type JournalKind = "note" | "analysis" | "plan" | "question";

export interface JournalEntry {
  id: string;
  author: Author;
  kind: JournalKind;
  body: string;
  createdAt: string; // ISO timestamp
}

// Mapování řádku z DB (snake_case) na Activity (camelCase).
export interface ActivityRow {
  id: string;
  date: string;
  type: string | null;
  name: string | null;
  distance_km: number | null;
  duration_s: number | null;
  pace_s_per_km: number | null;
  avg_hr: number | null;
  max_hr: number | null;
  vo2max: number | null;
  training_effect: number | null;
  elevation_gain_m: number | null;
  calories: number | null;
}

export function rowToActivity(r: ActivityRow): Activity {
  return {
    id: r.id,
    date: r.date,
    type: r.type ?? "other",
    name: r.name ?? "",
    distanceKm: r.distance_km,
    durationS: r.duration_s,
    paceSPerKm: r.pace_s_per_km,
    avgHr: r.avg_hr,
    maxHr: r.max_hr,
    vo2max: r.vo2max,
    trainingEffect: r.training_effect,
    elevationGainM: r.elevation_gain_m,
    calories: r.calories,
  };
}
