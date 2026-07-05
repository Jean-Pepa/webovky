// Nahraje aktivity do Supabase (tabulka cockpit_activities).
// Použití:  node scripts/ingest.mjs data.json
// data.json = pole objektů ve tvaru Activity (camelCase) z Garminu (přes Clauda).
//
// Příklad jednoho objektu:
// {
//   "id": "1234567890", "date": "2026-07-04", "type": "running",
//   "name": "Ranní běh", "distanceKm": 12.4, "durationS": 4020,
//   "paceSPerKm": 324, "avgHr": 152, "maxHr": 171, "vo2max": 52,
//   "trainingEffect": 3.4, "elevationGainM": 180, "calories": 890
// }

import { readFileSync } from "node:fs";
import { admin } from "./_env.mjs";

const file = process.argv[2];
if (!file) {
  console.error("Použití: node scripts/ingest.mjs <soubor.json>");
  process.exit(1);
}

const items = JSON.parse(readFileSync(file, "utf8"));
if (!Array.isArray(items)) {
  console.error("Soubor musí obsahovat POLE aktivit.");
  process.exit(1);
}

const rows = items.map((a) => ({
  id: String(a.id),
  date: a.date,
  type: a.type ?? "other",
  name: a.name ?? null,
  distance_km: a.distanceKm ?? null,
  duration_s: a.durationS ?? null,
  pace_s_per_km: a.paceSPerKm ?? null,
  avg_hr: a.avgHr ?? null,
  max_hr: a.maxHr ?? null,
  vo2max: a.vo2max ?? null,
  training_effect: a.trainingEffect ?? null,
  elevation_gain_m: a.elevationGainM ?? null,
  calories: a.calories ?? null,
  raw: a.raw ?? null,
}));

const db = admin();
const { error, count } = await db
  .from("cockpit_activities")
  .upsert(rows, { onConflict: "id", count: "exact" });

if (error) {
  console.error("Chyba při zápisu:", error.message);
  process.exit(1);
}
console.log(`Hotovo — upsertnuto ${count ?? rows.length} aktivit.`);
