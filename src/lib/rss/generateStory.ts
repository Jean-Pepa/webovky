import { RssArticle } from "./fetchFeeds";
import { StorySlideData } from "@/types/database";

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
    style: "dark";
    architect: string;
    year: string;
    source_url: string;
    source_name: string;
    slides: StorySlideData[];
  };
}

export function generateStory(
  article: RssArticle,
  images: string[]
): GeneratedStory {
  const architect = extractArchitect(article.title);
  const year =
    extractYear(article.description) ||
    new Date().getFullYear().toString();

  const sourceLabel =
    {
      archdaily: "ArchDaily",
      dezeen: "Dezeen",
      designboom: "Designboom",
    }[article.sourceFeed] || article.sourceFeed;

  const slug = makeSlug(article.title);
  const now = new Date().toISOString();

  // Build slides
  const slides: StorySlideData[] = [];

  // Slide 1: Cover — main image + headline
  const coverImage = article.image || images[0] || undefined;
  slides.push({
    type: "cover",
    image: coverImage,
    headline: article.title,
    caption: architect || sourceLabel,
  });

  // Slides 2-N: Photos from scraped images
  const photoImages = images.filter((img) => img !== coverImage);
  for (const img of photoImages) {
    slides.push({
      type: "photo",
      image: img,
    });
  }

  // Info slide: facts about the building
  const facts: { label: string; value: string }[] = [];
  if (architect) facts.push({ label: "Architect", value: architect });
  facts.push({ label: "Year", value: year });
  facts.push({ label: "Source", value: sourceLabel });
  if (article.categories.length > 0) {
    facts.push({ label: "Category", value: article.categories.slice(0, 2).join(", ") });
  }

  slides.push({
    type: "info",
    headline: article.title,
    facts,
  });

  // Closing slide
  slides.push({
    type: "closing",
    headline: "INN",
    caption: `Link v popisku`,
  });

  return {
    slug,
    title_cs: article.title,
    title_en: article.title,
    excerpt_cs: article.description,
    excerpt_en: article.description,
    content_cs: `${article.description}\n\n[Celý článek na ${sourceLabel}](${article.link})`,
    content_en: `${article.description}\n\n[Full article on ${sourceLabel}](${article.link})`,
    cover_image_url: coverImage || null,
    tags: article.categories.slice(0, 4),
    is_published: true,
    published_at: now,
    source: "rss",
    story_data: {
      style: "dark",
      architect,
      year,
      source_url: article.link,
      source_name: sourceLabel,
      slides,
    },
  };
}

function extractArchitect(title: string): string {
  // "Project Name / Architect Name"
  const slashMatch = title.match(/\/\s*(.+?)$/);
  if (slashMatch) return slashMatch[1].trim();

  // "Project Name by Architect Name"
  const byMatch = title.match(/\bby\s+(.+?)$/i);
  if (byMatch) return byMatch[1].trim();

  return "";
}

function extractYear(text: string): string {
  const match = text.match(/(19|20)\d{2}/);
  return match ? match[0] : "";
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
