import { RssArticle } from "./fetchFeeds";
import { translateTags } from "./translations";

const STYLES = ["dark", "light", "orange", "blueprint", "minimal"] as const;

export interface GeneratedStory {
  slug: string;
  title_cs: string;
  title_en: string;
  excerpt_cs: string;
  excerpt_en: string;
  content_cs: string;
  content_en: string;
  cover_image_url: string | null;
  tags: string[];
  is_published: boolean;
  published_at: string;
  source: "rss";
  story_data: {
    style: (typeof STYLES)[number];
    subtitle: string;
    architect: string;
    year: string;
    stat1_label: string;
    stat1_value: string;
    stat2_label: string;
    stat2_value: string;
    tags: string[];
  };
}

export function generateStory(
  article: RssArticle,
  index: number
): GeneratedStory {
  const architect = extractArchitect(article.title);
  const year = extractYear(article.description) || new Date().getFullYear().toString();
  const style = STYLES[index % STYLES.length];

  const sourceLabel = {
    archdaily: "ArchDaily",
    dezeen: "Dezeen",
    designboom: "Designboom",
  }[article.sourceFeed] || article.sourceFeed;

  // Tags: use RSS categories, translate for CZ display
  const rawTags = article.categories.length > 0
    ? article.categories.slice(0, 4)
    : guessTagsFromTitle(article.title);
  const czTags = translateTags(rawTags);

  const slug = makeSlug(article.title);
  const now = new Date().toISOString();

  return {
    slug,
    title_cs: article.title,
    title_en: article.title,
    excerpt_cs: article.description,
    excerpt_en: article.description,
    content_cs: `${article.description}\n\n[Celý článek na ${sourceLabel}](${article.link})`,
    content_en: `${article.description}\n\n[Full article on ${sourceLabel}](${article.link})`,
    cover_image_url: article.image,
    tags: rawTags,
    is_published: true,
    published_at: now,
    source: "rss",
    story_data: {
      style,
      subtitle: sourceLabel,
      architect,
      year,
      stat1_label: "Source",
      stat1_value: sourceLabel,
      stat2_label: "Year",
      stat2_value: year,
      tags: czTags,
    },
  };
}

function extractArchitect(title: string): string {
  // Common pattern: "Project Name / Architect Name"
  const slashMatch = title.match(/\/\s*(.+?)$/);
  if (slashMatch) return slashMatch[1].trim();

  // Pattern: "Project Name by Architect Name"
  const byMatch = title.match(/\bby\s+(.+?)$/i);
  if (byMatch) return byMatch[1].trim();

  return "";
}

function extractYear(text: string): string {
  const match = text.match(/(19|20)\d{2}/);
  return match ? match[0] : "";
}

function guessTagsFromTitle(title: string): string[] {
  const keywords = [
    "house", "museum", "library", "school", "tower", "bridge",
    "pavilion", "chapel", "hotel", "office", "villa", "apartment",
    "renovation", "extension", "residential", "cultural",
  ];
  const lower = title.toLowerCase();
  return keywords.filter((k) => lower.includes(k)).slice(0, 3);
}

function makeSlug(title: string): string {
  const date = new Date().toISOString().slice(0, 10);
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 60);
  return `${base}-${date}`;
}
