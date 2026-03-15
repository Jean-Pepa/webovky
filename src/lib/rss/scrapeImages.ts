export interface ScrapeResult {
  images: string[];
  captions: string[];
}

/**
 * Scrape project images AND text snippets from an article page.
 * Handles lazy-loaded images (data-src), srcset, og:image, etc.
 */
export async function scrapeArticleImages(
  url: string,
  sourceFeed: string
): Promise<ScrapeResult> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(6000),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });
    if (!res.ok) return { images: [], captions: [] };

    const html = await res.text();
    const images: string[] = [];

    // 1. Extract data-src (lazy-loaded images — ArchDaily, Designboom)
    const dataSrcRegex = /data-src=["']([^"']+)["']/gi;
    let match;
    while ((match = dataSrcRegex.exec(html)) !== null) {
      addIfRelevant(images, match[1], sourceFeed);
    }

    // 2. Extract data-original (another lazy-load pattern)
    const dataOrigRegex = /data-original=["']([^"']+)["']/gi;
    while ((match = dataOrigRegex.exec(html)) !== null) {
      addIfRelevant(images, match[1], sourceFeed);
    }

    // 3. Extract regular src
    const srcRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
    while ((match = srcRegex.exec(html)) !== null) {
      addIfRelevant(images, match[1], sourceFeed);
    }

    // 4. Extract srcset entries
    const srcsetRegex = /srcset=["']([^"']+)["']/gi;
    while ((match = srcsetRegex.exec(html)) !== null) {
      const entries = match[1].split(",");
      for (const entry of entries) {
        const src = entry.trim().split(/\s+/)[0];
        if (src) addIfRelevant(images, src, sourceFeed);
      }
    }

    // 5. Extract og:image meta tag
    const ogRegex =
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/gi;
    while ((match = ogRegex.exec(html)) !== null) {
      addIfRelevant(images, match[1], sourceFeed);
    }

    // For ArchDaily: upgrade to large_jpg resolution
    const upgraded = images.map((img) => upgradeResolution(img, sourceFeed));

    // Deduplicate by base image ID (ignore resolution suffix)
    const unique = deduplicateByBase(upgraded, sourceFeed);

    // 6. Extract text paragraphs for captions
    const captions = extractCaptions(html);

    return { images: unique.slice(0, 10), captions };
  } catch {
    return { images: [], captions: [] };
  }
}

function addIfRelevant(
  images: string[],
  src: string,
  sourceFeed: string
): void {
  if (!isProjectImage(src, sourceFeed)) return;
  const normalized = src.startsWith("//") ? `https:${src}` : src;
  if (!images.includes(normalized)) {
    images.push(normalized);
  }
}

function isProjectImage(src: string, sourceFeed: string): boolean {
  // Skip utility images
  if (
    src.includes("logo") ||
    src.includes("icon") ||
    src.includes("avatar") ||
    src.includes("favicon") ||
    src.includes("pixel") ||
    src.includes("blank") ||
    src.includes("spinner") ||
    src.includes("loading") ||
    src.includes("ad-") ||
    src.includes("banner") ||
    src.includes("widget") ||
    src.includes("data:image") ||
    src.includes("base64")
  )
    return false;

  if (sourceFeed === "archdaily") {
    return src.includes("images.adsttc.com") && src.includes("media/images");
  }
  if (sourceFeed === "dezeen") {
    return src.includes("static.dezeen.com") && src.includes("/uploads/");
  }
  if (sourceFeed === "designboom") {
    return (
      src.includes("designboom.com") &&
      (src.includes("/wp-content/uploads/") || src.includes("/dboriginal/"))
    );
  }

  return false;
}

/**
 * Upgrade ArchDaily image URLs to large_jpg resolution.
 * thumb_jpg → newsletter (good quality, reasonable size)
 */
function upgradeResolution(url: string, sourceFeed: string): string {
  if (sourceFeed === "archdaily") {
    return url
      .replace(/\/thumb_jpg\//, "/newsletter/")
      .replace(/\/medium_jpg\//, "/newsletter/")
      .replace(/\/small_jpg\//, "/newsletter/");
  }
  return url;
}

/**
 * Deduplicate images that are the same photo at different resolutions.
 * ArchDaily uses same hash path with different size suffixes.
 */
function deduplicateByBase(images: string[], sourceFeed: string): string[] {
  if (sourceFeed === "archdaily") {
    const seen = new Set<string>();
    return images.filter((url) => {
      // Extract the hash path (6 hex segments before the resolution folder)
      const hashMatch = url.match(
        /media\/images\/([a-f0-9/]+)\/(newsletter|large_jpg|medium_jpg|thumb_jpg|small_jpg)\//
      );
      const key = hashMatch ? hashMatch[1] : url;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  // For other sources, simple URL dedup
  const seen = new Set<string>();
  return images.filter((url) => {
    if (seen.has(url)) return false;
    seen.add(url);
    return true;
  });
}

/**
 * Extract short text snippets from article for story captions.
 * Tries multiple sources: meta descriptions, JSON-LD schema, visible paragraphs.
 * Splits longer texts into individual sentences.
 */
function extractCaptions(html: string): string[] {
  const rawTexts: string[] = [];

  // 1. Meta description (always available, even behind paywalls)
  const metaDesc = extractMetaContent(html, "description");
  if (metaDesc) rawTexts.push(metaDesc);

  // 2. OG description
  const ogDesc = extractMetaProperty(html, "og:description");
  if (ogDesc && ogDesc !== metaDesc) rawTexts.push(ogDesc);

  // 3. JSON-LD schema description
  const schemaRegex =
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = schemaRegex.exec(html)) !== null) {
    try {
      const data = JSON.parse(match[1]);
      if (data.description && typeof data.description === "string") {
        const desc = cleanText(data.description);
        if (desc && !rawTexts.includes(desc)) rawTexts.push(desc);
      }
      // Also try articleBody
      if (data.articleBody && typeof data.articleBody === "string") {
        const body = cleanText(data.articleBody);
        if (body) rawTexts.push(body);
      }
    } catch {
      // invalid JSON-LD
    }
  }

  // 4. Visible <p> paragraphs (works for Dezeen, Designboom)
  const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  while ((match = pRegex.exec(html)) !== null) {
    const text = cleanText(match[1]);
    if (text.length < 30 || text.length > 400) continue;
    if (isBoilerplate(text)) continue;
    if (!rawTexts.includes(text)) rawTexts.push(text);
  }

  // Split all collected texts into individual sentences
  const sentences: string[] = [];
  for (const text of rawTexts) {
    const split = text.split(/(?<=[.!?])\s+/);
    for (const s of split) {
      const trimmed = s.trim();
      if (trimmed.length >= 25 && trimmed.length <= 160 && !isBoilerplate(trimmed)) {
        if (!sentences.includes(trimmed)) sentences.push(trimmed);
      }
    }
  }

  return sentences.slice(0, 12);
}

function extractMetaContent(html: string, name: string): string {
  const regex = new RegExp(
    `<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`,
    "i"
  );
  const match = html.match(regex);
  return match ? cleanText(match[1]) : "";
}

function extractMetaProperty(html: string, prop: string): string {
  const regex = new RegExp(
    `<meta[^>]+property=["']${prop}["'][^>]+content=["']([^"']+)["']`,
    "i"
  );
  const match = html.match(regex);
  return match ? cleanText(match[1]) : "";
}

function cleanText(text: string): string {
  return text
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function isBoilerplate(text: string): boolean {
  const lower = text.toLowerCase();
  return (
    lower.includes("cookie") ||
    lower.includes("subscribe") ||
    lower.includes("newsletter") ||
    lower.includes("advertisement") ||
    lower.includes("©") ||
    lower.includes("all rights") ||
    lower.includes("read more") ||
    lower.includes("save this") ||
    lower.includes("cite:") ||
    lower.includes("archdaily") ||
    lower.includes("sign up") ||
    lower.includes("log in")
  );
}
