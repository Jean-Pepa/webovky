import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { fetchAllFeeds } from "@/lib/rss/fetchFeeds";
import { scrapeArticleImages } from "@/lib/rss/scrapeImages";
import { generateStory } from "@/lib/rss/generateStory";

const AUTO_UNPUBLISH_DAYS = 30;

export async function GET(request: NextRequest) {
  // Verify authorization
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  const adminSecret = process.env.ADMIN_SECRET;
  const urlSecret = request.nextUrl.searchParams.get("secret");

  const isAuthorized =
    (cronSecret && authHeader === `Bearer ${cronSecret}`) ||
    (adminSecret && urlSecret === adminSecret);

  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();

    // 1. Fetch all RSS feeds
    const articles = await fetchAllFeeds();
    if (articles.length === 0) {
      return NextResponse.json({
        message: "No articles from feeds",
        generated: 0,
      });
    }

    // 2. Get already used URLs
    const { data: usedRows } = await supabase
      .from("used_articles")
      .select("url");
    const usedUrls = new Set((usedRows || []).map((r) => r.url));

    // 3. Filter out used articles, prefer those with images
    const fresh = articles
      .filter((a) => !usedUrls.has(a.link))
      .sort((a, b) => (b.image ? 1 : 0) - (a.image ? 1 : 0));

    if (fresh.length === 0) {
      return NextResponse.json({
        message: "All articles already used",
        generated: 0,
      });
    }

    // 4. Pick 1 article (shuffle top candidates for variety)
    const topCandidates = fresh.slice(0, 10);
    const selected =
      topCandidates[Math.floor(Math.random() * topCandidates.length)];

    // 5. Scrape images from article page
    const scrapedImages = await scrapeArticleImages(
      selected.link,
      selected.sourceFeed
    );

    // Merge: RSS image + scraped images (deduplicated)
    const allImages: string[] = [];
    if (selected.image) allImages.push(selected.image);
    for (const img of scrapedImages) {
      if (!allImages.includes(img)) allImages.push(img);
    }

    // 6. Generate multi-slide story
    const story = generateStory(selected, allImages);

    // 7. Insert blog post
    const { error: blogError } = await supabase
      .from("blog_posts")
      .insert(story);

    if (blogError) {
      console.error("Blog insert error:", blogError);
      return NextResponse.json(
        { error: "Failed to insert story", detail: blogError.message },
        { status: 500 }
      );
    }

    // 8. Mark article as used (upsert to handle duplicates)
    const { error: usedError } = await supabase
      .from("used_articles")
      .upsert(
        {
          url: selected.link,
          source_feed: selected.sourceFeed,
          title: selected.title,
        },
        { onConflict: "url" }
      );
    if (usedError) {
      console.error("used_articles upsert error:", usedError);
    }

    // 9. Auto-unpublish old RSS stories
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - AUTO_UNPUBLISH_DAYS);

    const { data: unpublished } = await supabase
      .from("blog_posts")
      .update({ is_published: false })
      .eq("source", "rss")
      .eq("is_published", true)
      .lt("published_at", cutoff.toISOString())
      .select("id");

    return NextResponse.json({
      message: "Story generated successfully",
      generated: 1,
      slides: story.story_data.slides.length,
      images_total: allImages.length,
      images_scraped: scrapedImages.length,
      images_rss: selected.image ? 1 : 0,
      source: selected.sourceFeed,
      title: selected.title,
      url: selected.link,
      fresh_count: fresh.length,
      used_count: usedUrls.size,
      unpublished: unpublished?.length || 0,
      used_error: usedError?.message || null,
    });
  } catch (err) {
    console.error("Cron error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
