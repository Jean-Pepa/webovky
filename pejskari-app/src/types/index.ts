/** Core domain model for Pejskaři. */

export type DogSex = 'male' | 'female';
export type DogSize = 'toy' | 'small' | 'medium' | 'large' | 'giant';

export interface Breed {
  id: string;
  /** Czech breed name. */
  name: string;
  size: DogSize;
  /** 1 (klidné) – 5 (velmi energické). */
  energy: number;
  /** 1 (náročnější výcvik) – 5 (snadno cvičitelné). */
  trainability: number;
  /** Užitková skupina, např. "Pastevecká plemena". */
  group: string;
  /** Krátká charakteristika. */
  note: string;
}

export interface Dog {
  id: string;
  name: string;
  /** Reference na Breed.id (vč. "mix" a "unknown"). */
  breedId: string;
  sex: DogSex;
  /** Přibližný měsíc narození ve formátu "YYYY-MM". */
  birthMonth: string;
  weightKg?: number;
  /** Emoji avatar. */
  avatar: string;
  /** Barva pozadí avataru. */
  color: string;
  createdAt: number;
}

export type LessonCategory =
  | 'zaklady'
  | 'poslusnost'
  | 'socializace'
  | 'voditko'
  | 'doma'
  | 'triky';

export interface Lesson {
  id: string;
  title: string;
  category: LessonCategory;
  /** 1–5, určuje pořadí a obtížnost v plánu. */
  level: number;
  /** Nejnižší rozumný věk pro nácvik (v měsících). */
  minAgeMonths: number;
  /** Doporučená délka jednoho tréninku v minutách. */
  durationMin: number;
  summary: string;
  /** Proč to dělat – motivace. */
  why: string;
  /** Postup krok za krokem. */
  steps: string[];
  tips?: string[];
  /** Doporučené vybavení (místo pro affiliate). */
  gearTip?: { label: string; note: string };
  /** Vyšší číslo = relevantnější pro energická plemena. */
  energyAffinity?: number;
}

export type GuideCategory = 'pece' | 'zdravi' | 'vyziva' | 'plemena' | 'cestovani';

export interface GuideArticle {
  id: string;
  title: string;
  category: GuideCategory;
  readMin: number;
  excerpt: string;
  /** Odstavce oddělené prázdným řádkem. Řádky začínající "• " jsou odrážky. */
  body: string;
  /** Doporučení / affiliate blok. */
  affiliate?: { label: string; note: string };
  /** Zobrazit upozornění "poraďte se s veterinářem". */
  vetNote?: boolean;
}
