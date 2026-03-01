export interface Project {
  id: string;
  slug: string;
  category: "atelier" | "other";
  subcategory: string | null;
  title_cs: string;
  title_en: string;
  description_cs: string;
  description_en: string;
  detail_cs: string | null;
  detail_en: string | null;
  thumbnail_url: string | null;
  images: string[];
  year: number | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title_cs: string;
  title_en: string;
  excerpt_cs: string | null;
  excerpt_en: string | null;
  content_cs: string;
  content_en: string;
  cover_image_url: string | null;
  tags: string[];
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExperienceItem {
  text_cs: string;
  text_en: string;
  date_cs: string;
  date_en: string;
}

export interface WorkshopItem {
  name_cs: string;
  name_en: string;
  org_cs: string;
  org_en: string;
}

export interface AboutContent {
  id: string;
  bio_cs: string;
  bio_en: string;
  education: EducationItem[];
  languages: LanguageItem[];
  experience_cs: string | null;
  experience_en: string | null;
  experience: ExperienceItem[] | null;
  workshops: WorkshopItem[] | null;
  profile_image_url: string | null;
  updated_at: string;
}

export interface EducationItem {
  date_cs: string;
  date_en: string;
  text_cs: string;
  text_en: string;
}

export interface LanguageItem {
  name_cs: string;
  name_en: string;
  level_cs?: string;
  level_en?: string;
  level?: string;
}

export interface SiteSettings {
  id: string;
  hero_title_cs: string;
  hero_title_en: string;
  hero_subtitle_cs: string | null;
  hero_subtitle_en: string | null;
  contact_email_primary: string | null;
  contact_email_secondary: string | null;
  social_links: Record<string, string>;
  updated_at: string;
}
