import { NextResponse } from "next/server";

interface RssItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  image: string | null;
}

export async function GET() {
  try {
    const res = await fetch("https://www.archdaily.com/feed", {
      next: { revalidate: 3600 }, // cache 1 hour
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch RSS feed" },
        { status: 502 }
      );
    }

    const xml = await res.text();
    const items = parseRssXml(xml);

    return NextResponse.json(items);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "RSS fetch failed" },
      { status: 500 }
    );
  }
}

function parseRssXml(xml: string): RssItem[] {
  const items: RssItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];
    const title = extractTag(itemXml, "title");
    const link = extractTag(itemXml, "link");
    const description = extractTag(itemXml, "description");
    const pubDate = extractTag(itemXml, "pubDate");

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
      });
    }
  }

  return items.slice(0, 20);
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
  return text.replace(/<[^>]+>/g, "").trim().slice(0, 200);
}
