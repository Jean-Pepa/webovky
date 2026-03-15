import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { createAdminClient } from "@/lib/supabase/admin";
import { scrapeArticleImages } from "@/lib/rss/scrapeImages";
import { generateStory } from "@/lib/rss/generateStory";

export async function POST(request: NextRequest) {
  // Auth check — admin JWT
  const token = request.cookies.get("admin_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const secret = new TextEncoder().encode(process.env.ADMIN_SECRET);
    await jwtVerify(token, secret);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const { url } = await request.json();
  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    // Detect source from URL
    let sourceFeed = "archdaily";
    if (url.includes("dezeen.com")) sourceFeed = "dezeen";
    else if (url.includes("designboom.com")) sourceFeed = "designboom";

    // Fetch article page for title
    const pageRes = await fetch(url, {
      signal: AbortSignal.timeout(8000),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });
    if (!pageRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch article" },
        { status: 502 }
      );
    }

    const html = await pageRes.text();

    // Extract title from page
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const ogTitleMatch = html.match(
      /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i
    );
    const rawTitle = ogTitleMatch?.[1] || titleMatch?.[1] || "Untitled";
    const title = rawTitle.replace(/\s*[|–-]\s*(ArchDaily|Dezeen|designboom).*$/i, "").trim();

    // Extract description
    const descMatch = html.match(
      /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i
    ) || html.match(
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i
    );
    const description = descMatch?.[1]?.replace(/&amp;/g, "&").replace(/&quot;/g, '"').trim() || "";

    // Extract cover image from og:image
    const ogImageMatch = html.match(
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i
    );
    const ogImage = ogImageMatch?.[1] || null;

    // Scrape images + captions
    const scraped = await scrapeArticleImages(url, sourceFeed);

    // Merge images
    const allImages: string[] = [];
    if (ogImage) allImages.push(ogImage);
    for (const img of scraped.images) {
      if (!allImages.includes(img)) allImages.push(img);
    }

    // Build article object
    const article = {
      title,
      link: url,
      description,
      pubDate: new Date().toISOString(),
      image: ogImage,
      sourceFeed,
      categories: [] as string[],
    };

    // Generate story
    const story = generateStory(article, allImages, scraped.captions);

    // Insert to DB
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .insert(story)
      .select("id, slug")
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to save story", detail: error.message },
        { status: 500 }
      );
    }

    // Mark as used
    await supabase.from("used_articles").upsert(
      { url, source_feed: sourceFeed, title },
      { onConflict: "url" }
    );

    return NextResponse.json({
      message: "Story generated",
      id: data.id,
      slug: data.slug,
      title,
      slides: story.story_data.slides.length,
      images: allImages.length,
      captions: scraped.captions.length,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
