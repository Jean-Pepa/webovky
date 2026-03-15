export interface RssArticle {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  image: string | null;
  sourceFeed: string;
  categories: string[];
}

const FEEDS = [
  { url: "https://www.archdaily.com/feed", name: "archdaily" },
  { url: "https://www.dezeen.com/feed/", name: "dezeen" },
  { url: "https://www.designboom.com/feed/", name: "designboom" },
];

export async function fetchAllFeeds(): Promise<RssArticle[]> {
  const results = await Promise.allSettled(
    FEEDS.map((feed) => fetchFeed(feed.url, feed.name))
  );

  const articles: RssArticle[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      articles.push(...result.value);
    } else {
      console.warn("Feed fetch failed:", result.reason);
    }
  }

  return articles;
}

async function fetchFeed(
  url: string,
  sourceFeed: string
): Promise<RssArticle[]> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Feed ${sourceFeed} returned ${res.status}`);

  const xml = await res.text();
  return parseRssXml(xml, sourceFeed);
}

function parseRssXml(xml: string, sourceFeed: string): RssArticle[] {
  const items: RssArticle[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];
    const title = extractTag(itemXml, "title");
    const link = extractTag(itemXml, "link");
    const description = extractTag(itemXml, "description");
    const pubDate = extractTag(itemXml, "pubDate");

    // Extract categories
    const categories: string[] = [];
    const catRegex = /<category[^>]*>([\s\S]*?)<\/category>/g;
    let catMatch;
    while ((catMatch = catRegex.exec(itemXml)) !== null) {
      const cat = cleanCdata(catMatch[1]).trim();
      if (cat) categories.push(cat);
    }

    // Try to find image from media:content or enclosure
    let image =
      extractAttr(itemXml, "media:content", "url") ||
      extractAttr(itemXml, "enclosure", "url") ||
      null;

    // Fallback: extract first img src from description
    if (!image && description) {
      const imgMatch = description.match(/src=["']([^"']+)["']/);
      if (imgMatch) image = imgMatch[1];
    }

    if (title && link) {
      items.push({
        title: cleanCdata(title),
        link: cleanCdata(link),
        description: cleanHtml(cleanCdata(description)),
        pubDate,
        image,
        sourceFeed,
        categories: categories.slice(0, 5),
      });
    }
  }

  return items;
}

function extractTag(xml: string, tag: string): string {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`);
  const match = xml.match(regex);
  return match ? match[1].trim() : "";
}

function extractAttr(xml: string, tag: string, attr: string): string {
  const regex = new RegExp(`<${tag}[^>]*${attr}=["']([^"']+)["']`);
  const match = xml.match(regex);
  return match ? match[1] : "";
}

function cleanCdata(text: string): string {
  return text.replace(/<!\[CDATA\[/g, "").replace(/\]\]>/g, "").trim();
}

function cleanHtml(text: string): string {
  return text.replace(/<[^>]+>/g, "").trim().slice(0, 300);
}
