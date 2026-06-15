import type { GuideCategory, LessonCategory } from '@/types';

interface CategoryMeta {
  label: string;
  /** Ionicons name. */
  icon: string;
  /** Akcentová barva kategorie. */
  color: string;
}

export const LESSON_CATEGORIES: Record<LessonCategory, CategoryMeta> = {
  zaklady: { label: 'Základy', icon: 'ribbon-outline', color: '#1E9E5A' },
  poslusnost: { label: 'Poslušnost', icon: 'shield-checkmark-outline', color: '#2F77E0' },
  socializace: { label: 'Socializace', icon: 'people-outline', color: '#E0792F' },
  voditko: { label: 'Na vodítku', icon: 'walk-outline', color: '#8B5CF6' },
  doma: { label: 'Doma', icon: 'home-outline', color: '#0E9AA7' },
  triky: { label: 'Triky', icon: 'sparkles-outline', color: '#E0467C' },
};

export const GUIDE_CATEGORIES: Record<GuideCategory, CategoryMeta> = {
  pece: { label: 'Péče', icon: 'cut-outline', color: '#0E9AA7' },
  zdravi: { label: 'Zdraví', icon: 'medkit-outline', color: '#E5484D' },
  vyziva: { label: 'Výživa', icon: 'nutrition-outline', color: '#1E9E5A' },
  plemena: { label: 'Plemena', icon: 'paw-outline', color: '#E0792F' },
  cestovani: { label: 'Cestování', icon: 'map-outline', color: '#2F77E0' },
};
