import { getTranslations } from "next-intl/server";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BackArrow from "@/components/blog/BackArrow";
import ArchStories from "@/components/blog/ArchStories";
import BlogCard from "@/components/blog/BlogCard";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("blog");

  const supabase = createAdminClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  // Separate stories from regular posts
  const storyPosts = (posts ?? []).filter(
    (p: Record<string, unknown>) => p.story_data != null
  );
  const regularPosts = (posts ?? []).filter(
    (p: Record<string, unknown>) => p.story_data == null
  );

  return (
    <>
      <Header showNav={false} showIntro={true} />
      <BackArrow locale={locale} />

      <section className="py-20">
        <div className="mx-auto max-w-[1200px] px-5">
          <h1 className="text-center mt-[180px] text-[3rem] font-light">
            {t("title")}
          </h1>

          {/* Arch Stories viewer — pass stories as props */}
          {storyPosts.length > 0 && (
            <div className="mt-16 mb-20">
              <h2
                className="text-center text-[13px] uppercase tracking-[4px] mb-10"
                style={{ opacity: 0.4 }}
              >
                Arch Stories
              </h2>
              <ArchStories stories={storyPosts} locale={locale} />
            </div>
          )}

          {/* Regular blog posts */}
          {regularPosts.length > 0 && (
            <div>
              {storyPosts.length > 0 && (
                <h2
                  className="text-[13px] uppercase tracking-[4px] mb-6"
                  style={{ opacity: 0.4 }}
                >
                  {locale === "en" ? "Articles" : "Články"}
                </h2>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularPosts.map((post) => (
                  <BlogCard
                    key={post.id}
                    post={post}
                    locale={locale}
                    readMoreText={t("readMore")}
                  />
                ))}
              </div>
            </div>
          )}

          {/* No content */}
          {(!posts || posts.length === 0) && (
            <p className="text-center mt-10 text-black/40">{t("noPosts")}</p>
          )}
        </div>
      </section>
      <Footer showNovinky={false} />
    </>
  );
}
