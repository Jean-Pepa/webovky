// Výživové výpočty pro body recomposition (hubnutí + nabírání svalů).
// Zdroj přístupu: mírný deficit + vysoký příjem bílkovin (1,6–2,2 g/kg),
// silový trénink. Detrénovaný člověk s nadváhou = ideální kandidát na recompo.

export type Sex = "m" | "f";
export type Activity = "low" | "mid" | "high";

export const START_WEIGHT = 98; // kg
export const GOAL_WEIGHT = 85; // kg
export const HEIGHT = 185; // cm
export const AGE = 23;

// Aktivitní koeficienty (nad bazální metabolismus).
export const ACTIVITY_FACTORS: Record<Activity, { label: string; f: number }> = {
  low: { label: "Lehká (2–3 tréninky/týden)", f: 1.45 },
  mid: { label: "Střední (4–5 tréninků/týden)", f: 1.6 },
  high: { label: "Vysoká (6+ tréninků/týden)", f: 1.75 },
};

// Mifflin–St Jeor rovnice pro klidový výdej (BMR).
export function bmr(weight: number, height: number, age: number, sex: Sex): number {
  const base = 10 * weight + 6.25 * height - 5 * age;
  return Math.round(sex === "m" ? base + 5 : base - 161);
}

// Celkový denní energetický výdej.
export function tdee(weight: number, height: number, age: number, sex: Sex, activity: Activity): number {
  return Math.round(bmr(weight, height, age, sex) * ACTIVITY_FACTORS[activity].f);
}

// Doporučený denní příjem pro recompo. Deficit ~500 kcal = ~0,5 kg tuku/týden,
// ale ne pod ~1,2× BMR (bezpečné minimum, aby netrpěl výkon a regenerace).
export function targetCalories(tdeeValue: number, bmrValue: number, deficit = 500): number {
  return Math.max(Math.round(tdeeValue - deficit), Math.round(bmrValue * 1.2));
}

// Bílkoviny 2,0 g/kg cílové (libové) hmotnosti — chrání svaly v deficitu a staví nové.
export function proteinGrams(weight: number, perKg = 2.0): number {
  return Math.round(weight * perKg);
}

// Tuky ~0,9 g/kg (hormony, sytost), zbytek kalorií = sacharidy (palivo pro trénink).
export function macros(calories: number, weight: number) {
  const protein = proteinGrams(weight);
  const fat = Math.round(weight * 0.9);
  const proteinKcal = protein * 4;
  const fatKcal = fat * 9;
  const carbs = Math.max(0, Math.round((calories - proteinKcal - fatKcal) / 4));
  return { protein, fat, carbs };
}

// Projekce hmotnosti Září → Únor. Rychlejší úbytek na začátku (větší tukové zásoby,
// nižší objem tréninku), ke konci přechod na udržování kvůli výkonu na závodě.
export function weightProjection(): { week: number; label: string; kg: number }[] {
  // 24 týdnů. Cíl 85 kg dosáhnout kolem 20. týdne, pak držet.
  const points: { week: number; label: string; kg: number }[] = [];
  for (let w = 0; w <= 24; w++) {
    let kg: number;
    if (w <= 20) {
      // plynulý pokles 98 → 85 za 20 týdnů (~0,65 kg/týden)
      kg = START_WEIGHT - ((START_WEIGHT - GOAL_WEIGHT) * w) / 20;
    } else {
      kg = GOAL_WEIGHT; // udržování v peak fázi a taperu
    }
    points.push({ week: w, label: w === 0 ? "Start" : `T${w}`, kg: Math.round(kg * 10) / 10 });
  }
  return points;
}
