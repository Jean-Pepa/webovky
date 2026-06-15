/**
 * Globální stav aplikace: psi, aktivní pes a postup ve výcviku.
 * Persistováno lokálně přes AsyncStorage (offline-first, bez backendu).
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import type { Dog } from '@/types';

const STORAGE_KEY = 'pejskari/state/v1';

type DogInput = Omit<Dog, 'id' | 'createdAt'>;

interface PersistShape {
  dogs: Dog[];
  activeDogId: string | null;
  /** dogId → seznam splněných lekcí. */
  progress: Record<string, string[]>;
}

interface DogState extends PersistShape {
  isLoading: boolean;
}

interface DogContextValue extends DogState {
  activeDog: Dog | null;
  addDog: (input: DogInput) => Dog;
  updateDog: (id: string, patch: Partial<DogInput>) => void;
  removeDog: (id: string) => void;
  setActiveDog: (id: string) => void;
  toggleLesson: (lessonId: string, dogId?: string) => void;
  isLessonDone: (lessonId: string, dogId?: string) => boolean;
  completedFor: (dogId?: string) => string[];
  resetProgress: (dogId?: string) => void;
}

const DogContext = createContext<DogContextValue | null>(null);

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function DogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DogState>({
    dogs: [],
    activeDogId: null,
    progress: {},
    isLoading: true,
  });
  const hydrated = useRef(false);

  // Načtení z úložiště při startu.
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as PersistShape;
          setState({
            dogs: parsed.dogs ?? [],
            activeDogId: parsed.activeDogId ?? null,
            progress: parsed.progress ?? {},
            isLoading: false,
          });
        } else {
          setState((s) => ({ ...s, isLoading: false }));
        }
      } catch {
        setState((s) => ({ ...s, isLoading: false }));
      } finally {
        hydrated.current = true;
      }
    })();
  }, []);

  // Uložení při každé změně (až po prvním načtení).
  useEffect(() => {
    if (!hydrated.current) return;
    const persist: PersistShape = {
      dogs: state.dogs,
      activeDogId: state.activeDogId,
      progress: state.progress,
    };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(persist)).catch(() => {});
  }, [state]);

  const addDog = useCallback((input: DogInput): Dog => {
    const dog: Dog = { ...input, id: genId(), createdAt: Date.now() };
    setState((s) => ({ ...s, dogs: [...s.dogs, dog], activeDogId: dog.id }));
    return dog;
  }, []);

  const updateDog = useCallback((id: string, patch: Partial<DogInput>) => {
    setState((s) => ({
      ...s,
      dogs: s.dogs.map((d) => (d.id === id ? { ...d, ...patch } : d)),
    }));
  }, []);

  const removeDog = useCallback((id: string) => {
    setState((s) => {
      const dogs = s.dogs.filter((d) => d.id !== id);
      const progress = { ...s.progress };
      delete progress[id];
      const activeDogId = s.activeDogId === id ? (dogs[0]?.id ?? null) : s.activeDogId;
      return { ...s, dogs, progress, activeDogId };
    });
  }, []);

  const setActiveDog = useCallback((id: string) => {
    setState((s) => ({ ...s, activeDogId: id }));
  }, []);

  const toggleLesson = useCallback((lessonId: string, dogId?: string) => {
    setState((s) => {
      const id = dogId ?? s.activeDogId;
      if (!id) return s;
      const current = s.progress[id] ?? [];
      const next = current.includes(lessonId)
        ? current.filter((x) => x !== lessonId)
        : [...current, lessonId];
      return { ...s, progress: { ...s.progress, [id]: next } };
    });
  }, []);

  const resetProgress = useCallback((dogId?: string) => {
    setState((s) => {
      const id = dogId ?? s.activeDogId;
      if (!id) return s;
      return { ...s, progress: { ...s.progress, [id]: [] } };
    });
  }, []);

  const completedFor = useCallback(
    (dogId?: string): string[] => {
      const id = dogId ?? state.activeDogId;
      return id ? (state.progress[id] ?? []) : [];
    },
    [state.activeDogId, state.progress],
  );

  const isLessonDone = useCallback(
    (lessonId: string, dogId?: string): boolean => completedFor(dogId).includes(lessonId),
    [completedFor],
  );

  const activeDog = useMemo(
    () => state.dogs.find((d) => d.id === state.activeDogId) ?? null,
    [state.dogs, state.activeDogId],
  );

  const value = useMemo<DogContextValue>(
    () => ({
      ...state,
      activeDog,
      addDog,
      updateDog,
      removeDog,
      setActiveDog,
      toggleLesson,
      isLessonDone,
      completedFor,
      resetProgress,
    }),
    [
      state,
      activeDog,
      addDog,
      updateDog,
      removeDog,
      setActiveDog,
      toggleLesson,
      isLessonDone,
      completedFor,
      resetProgress,
    ],
  );

  return <DogContext.Provider value={value}>{children}</DogContext.Provider>;
}

export function useDogs(): DogContextValue {
  const ctx = useContext(DogContext);
  if (!ctx) throw new Error('useDogs musí být použit uvnitř <DogProvider>.');
  return ctx;
}
