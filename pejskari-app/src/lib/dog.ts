/** Pomocníci nad psem s fallbacky pro starší uložená data. */

import { getBreed } from '@/data/breeds';
import { ageInMonths } from '@/lib/format';
import type { Dog } from '@/types';

export function dogBreedName(dog: Dog): string {
  return dog.breedName ?? getBreed(dog.breedId)?.name ?? 'Neznámé plemeno';
}

export function dogEnergy(dog: Dog): number {
  return dog.breedEnergy ?? getBreed(dog.breedId)?.energy ?? 3;
}

export function dogBreedPhoto(dog: Dog): string | undefined {
  return dog.breedPhotoUrl;
}

export function dogAgeMonths(dog: Dog, now: Date = new Date()): number {
  return ageInMonths(dog.birthMonth, now);
}
