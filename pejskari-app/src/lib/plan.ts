/** Sestavení personalizovaného výcvikového plánu pro konkrétního psa. */

import { LESSONS } from '@/data/lessons';
import { ageInMonths } from '@/lib/format';
import type { Breed, Dog, Lesson } from '@/types';

export interface PlanLevel {
  level: number;
  lessons: Lesson[];
}

export interface PlanStats {
  total: number;
  completed: number;
  pct: number;
  next?: Lesson;
}

/**
 * Vrátí lekce vhodné pro daného psa, seřazené podle úrovně.
 * U energických plemen upřednostní lekce s vyšší `energyAffinity`
 * (přivolání, práce na vodítku, sebeovládání).
 */
export function buildPlan(dog: Dog, breed: Breed | undefined, now: Date = new Date()): Lesson[] {
  const age = ageInMonths(dog.birthMonth, now);
  const energetic = (breed?.energy ?? 3) >= 4;

  // Lekci ukážeme i o měsíc dřív, ať má štěně co dělat.
  const eligible = LESSONS.filter((l) => age >= l.minAgeMonths - 1);

  return [...eligible].sort((a, b) => {
    if (a.level !== b.level) return a.level - b.level;
    if (energetic) {
      const av = a.energyAffinity ?? 0;
      const bv = b.energyAffinity ?? 0;
      if (av !== bv) return bv - av;
    }
    return 0; // stabilní řazení zachová původní pořadí v rámci úrovně
  });
}

export function groupByLevel(lessons: Lesson[]): PlanLevel[] {
  const map = new Map<number, Lesson[]>();
  for (const lesson of lessons) {
    const bucket = map.get(lesson.level);
    if (bucket) bucket.push(lesson);
    else map.set(lesson.level, [lesson]);
  }
  return [...map.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([level, levelLessons]) => ({ level, lessons: levelLessons }));
}

export function planStats(lessons: Lesson[], completed: string[]): PlanStats {
  const doneSet = new Set(completed);
  const total = lessons.length;
  const done = lessons.filter((l) => doneSet.has(l.id)).length;
  return {
    total,
    completed: done,
    pct: total ? done / total : 0,
    next: lessons.find((l) => !doneSet.has(l.id)),
  };
}

/** Úroveň je odemčená, pokud je předchozí úroveň celá splněná. */
export function levelUnlocked(levels: PlanLevel[], index: number, completed: string[]): boolean {
  if (index <= 0) return true;
  const doneSet = new Set(completed);
  return levels[index - 1].lessons.every((l) => doneSet.has(l.id));
}
