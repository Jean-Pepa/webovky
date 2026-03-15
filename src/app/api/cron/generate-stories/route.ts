import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { fetchAllFeeds } from "@/lib/rss/fetchFeeds";
import { generateStory } from "@/lib/rss/generateStory";

const STORIES_PER_RUN = 5;
const AUTO_UNPUBLISH_DAYS = 30;

export async function GET(request: NextRequest) {
  // Verify authorization: Vercel cron secret or admin secret
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
      return NextResponse.json({ message: "No articles from feeds", generated: 0 });
    }

    // 2. Get already used URLs
    const { data: usedRows } = await supabase
      .from("used_articles")
      .select("url");
    const usedUrls = new Set((usedRows || []).map((r) => r.url));

    // 3. Filter out already used articles
    const fresh = articles.filter((a) => !usedUrls.has(a.link));
    if (fresh.length === 0) {
      return NextResponse.json({ message: "All articles already used", generated: 0 });
    }

    // 4. Shuffle for variety across sources
    const shuffled = fresh.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, STORIES_PER_RUN);

    // 5. Generate stories
    const stories = selected.map((article, i) => generateStory(article, i));

    // 6. Insert blog posts
    const { error: blogError } = await supabase
      .from("blog_posts")
      .insert(stories);

    if (blogError) {
      console.error("Blog insert error:", blogError);
      return NextResponse.json(
        { error: "Failed to insert stories", detail: blogError.message },
        { status: 500 }
      );
    }

    // 7. Mark articles as used
    const usedInserts = selected.map((a) => ({
      url: a.link,
      source_feed: a.sourceFeed,
      title: a.title,
    }));

    const { error: usedError } = await supabase
      .from("used_articles")
      .insert(usedInserts);

    if (usedError) {
      console.warn("used_articles insert warning:", usedError.message);
    }

    // 8. Auto-unpublish old RSS stories (older than 30 days)
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
      message: "Stories generated successfully",
      generated: stories.length,
      unpublished: unpublished?.length || 0,
      sources: selected.map((a) => a.sourceFeed),
    });
  } catch (err) {
    console.error("Cron error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
