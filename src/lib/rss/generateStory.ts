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
  images: string[],
  captions: string[] = []
): GeneratedStory {
  const architect = extractArchitect(article.title);
  const year =
    extractYear(article.description) ||
    new Date().getFullYear().toString();
  const projectName = extractProjectName(article.title);

  const sourceLabel =
    {
      archdaily: "ArchDaily",
      dezeen: "Dezeen",
      designboom: "Designboom",
    }[article.sourceFeed] || article.sourceFeed;

  const slug = makeSlug(article.title);
  const now = new Date().toISOString();

  // Build slides: cover + photos + closing
  const slides: StorySlideData[] = [];

  // Slide 1: Cover — main image + headline + architect
  const coverImage = images[0] || article.image || undefined;
  slides.push({
    type: "cover",
    image: coverImage,
    headline: projectName || article.title,
    caption: architect || sourceLabel,
  });

  // Slides 2-N: Photos with text captions from article
  const photoImages = images.slice(1); // skip cover image
  for (let i = 0; i < photoImages.length; i++) {
    // Use scraped article text as caption, fall back to metadata
    const caption = captions[i]
      ? truncate(captions[i], 140)
      : buildPhotoCaption(i, architect, year, article.categories, projectName);
    slides.push({
      type: "photo",
      image: photoImages[i],
      caption,
    });
  }

  // If we have very few photos, add slides with description text
  if (photoImages.length < 2 && article.description) {
    slides.push({
      type: "photo",
      image: coverImage,
      caption: truncate(article.description, 140),
    });
  }

  // Closing slide
  slides.push({
    type: "closing",
    headline: "INN",
    caption: "Link v popisku",
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

/**
 * Build a contextual caption for each photo slide.
 * Rotates between different info to keep it interesting.
 */
function buildPhotoCaption(
  index: number,
  architect: string,
  year: string,
  categories: string[],
  projectName: string
): string {
  const options: string[] = [];

  if (architect) options.push(architect);
  if (year) options.push(year);
  if (projectName) options.push(projectName);
  if (categories.length > 0) options.push(categories.slice(0, 2).join(" / "));

  // Rotate through available captions
  if (options.length === 0) return "";
  return options[index % options.length];
}

/**
 * Extract project name (without architect).
 * "Villa Moerkensheide / Dieter De Vos Architecten" → "Villa Moerkensheide"
 */
function extractProjectName(title: string): string {
  const slashMatch = title.match(/^(.+?)\s*\/\s*/);
  if (slashMatch) return slashMatch[1].trim();
  return title;
}

function extractArchitect(title: string): string {
  const slashMatch = title.match(/\/\s*(.+?)$/);
  if (slashMatch) return slashMatch[1].trim();

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

function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).replace(/\s+\S*$/, "") + "...";
}
