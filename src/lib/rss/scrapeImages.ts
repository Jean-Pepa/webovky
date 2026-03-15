/**
 * Scrape project images from an article page.
 * Tries to extract multiple high-quality photos from the article HTML.
 */
export async function scrapeArticleImages(
  url: string,
  sourceFeed: string
): Promise<string[]> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(6000),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });
    if (!res.ok) return [];

    const html = await res.text();
    const images: string[] = [];

    // Extract all img src attributes
    const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
    let match;

    while ((match = imgRegex.exec(html)) !== null) {
      const src = match[1];
      if (isProjectImage(src, sourceFeed)) {
        // Normalize URL
        const normalized = src.startsWith("//") ? `https:${src}` : src;
        if (!images.includes(normalized)) {
          images.push(normalized);
        }
      }
    }

    // Also check srcset for higher res images
    const srcsetRegex = /srcset=["']([^"']+)["']/gi;
    while ((match = srcsetRegex.exec(html)) !== null) {
      const entries = match[1].split(",");
      for (const entry of entries) {
        const src = entry.trim().split(/\s+/)[0];
        if (src && isProjectImage(src, sourceFeed)) {
          const normalized = src.startsWith("//") ? `https:${src}` : src;
          if (!images.includes(normalized)) {
            images.push(normalized);
          }
        }
      }
    }

    return images.slice(0, 8);
  } catch {
    return [];
  }
}

function isProjectImage(src: string, sourceFeed: string): boolean {
  // Skip small/utility images
  if (
    src.includes("logo") ||
    src.includes("icon") ||
    src.includes("avatar") ||
    src.includes("favicon") ||
    src.includes("1x1") ||
    src.includes("pixel") ||
    src.includes("blank") ||
    src.includes("spinner") ||
    src.includes("loading") ||
    src.includes("ad-") ||
    src.includes("banner") ||
    src.includes("widget")
  )
    return false;

  // Source-specific: only keep images from known project CDNs
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
