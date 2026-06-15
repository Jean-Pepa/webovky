/**
 * Plemena s reálnými fotkami z The Dog API (https://thedogapi.com).
 * Načte se jednou a cachuje (paměť + AsyncStorage). Když je síť/API nedostupné,
 * spadne to na lokální kurátorovaný seznam (`@/data/breeds`), ať appka funguje.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import { BREEDS } from '@/data/breeds';

export interface BreedOption {
  id: string;
  name: string;
  group: string;
  temperament?: string;
  origin?: string;
  photoUrl?: string;
  /** 1–5 */
  energy: number;
  /** 1–5 */
  trainability: number;
}

const CACHE_KEY = 'pejskari/breeds/v2';
const ENDPOINT = 'https://api.thedogapi.com/v1/breeds';

/** Odhad energie/cvičitelnosti podle užitkové skupiny plemene. */
const GROUP_TRAITS: Record<string, { energy: number; trainability: number }> = {
  Herding: { energy: 5, trainability: 5 },
  Sporting: { energy: 5, trainability: 4 },
  Working: { energy: 4, trainability: 4 },
  Terrier: { energy: 5, trainability: 3 },
  Hound: { energy: 4, trainability: 3 },
  Toy: { energy: 3, trainability: 3 },
  'Non-Sporting': { energy: 3, trainability: 3 },
};

function traitsFor(group?: string) {
  return (group && GROUP_TRAITS[group]) || { energy: 3, trainability: 3 };
}

interface ApiBreed {
  id: number;
  name: string;
  breed_group?: string;
  temperament?: string;
  origin?: string;
  reference_image_id?: string;
  image?: { url?: string };
}

function mapApi(b: ApiBreed): BreedOption {
  const t = traitsFor(b.breed_group);
  const photoUrl =
    b.image?.url ||
    (b.reference_image_id ? `https://cdn2.thedogapi.com/images/${b.reference_image_id}.jpg` : undefined);
  return {
    id: `api-${b.id}`,
    name: b.name,
    group: b.breed_group || 'Neuvedeno',
    temperament: b.temperament,
    origin: b.origin || undefined,
    photoUrl,
    energy: t.energy,
    trainability: t.trainability,
  };
}

const LOCAL_OPTIONS: BreedOption[] = BREEDS.map((b) => ({
  id: b.id,
  name: b.name,
  group: b.group,
  energy: b.energy,
  trainability: b.trainability,
}));

let memoryCache: BreedOption[] | null = null;

export async function loadBreeds(): Promise<BreedOption[]> {
  if (memoryCache) return memoryCache;

  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as BreedOption[];
      if (Array.isArray(parsed) && parsed.length) {
        memoryCache = parsed;
        return parsed;
      }
    }
  } catch {
    // ignore cache errors
  }

  try {
    const res = await fetch(ENDPOINT);
    if (res.ok) {
      const data = (await res.json()) as ApiBreed[];
      if (Array.isArray(data) && data.length) {
        const mapped = data
          .map(mapApi)
          .filter((b) => b.name)
          .sort((a, b) => a.name.localeCompare(b.name));
        memoryCache = mapped;
        AsyncStorage.setItem(CACHE_KEY, JSON.stringify(mapped)).catch(() => {});
        return mapped;
      }
    }
  } catch {
    // network/API unavailable → fallback below
  }

  memoryCache = LOCAL_OPTIONS;
  return LOCAL_OPTIONS;
}

function norm(s: string): string {
  try {
    return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  } catch {
    return s.toLowerCase();
  }
}

export function searchBreeds(list: BreedOption[], query: string): BreedOption[] {
  const q = norm(query.trim());
  if (!q) return list;
  return list.filter((b) => norm(b.name).includes(q));
}
