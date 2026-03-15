import { getTranslations } from "next-intl/server";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BackArrow from "@/components/blog/BackArrow";
import ArchStories from "@/components/blog/ArchStories";
import BlogCard from "@/components/blog/BlogCard";
import { createAdminClient } from "@/lib/supabase/admin";

export const revalidate = 0;

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

  const allPosts = posts ?? [];
  const storyPosts = allPosts.filter(
    (p: Record<string, unknown>) => p.story_data != null
  );

  return (
    <>
      <Header showNav={false} showIntro={false} showLogo={false} />
      <BackArrow locale={locale} />

      <section className="py-20">
        <div className="mx-auto max-w-[1200px] px-5">
          <h1 className="text-center mt-[120px] text-[3rem] font-light">
            {t("title")}
          </h1>

          {/* Arch Stories viewer */}
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

          {/* All posts — single grid */}
          {allPosts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allPosts.map((post) => (
                <BlogCard
                  key={post.id}
                  post={post}
                  locale={locale}
                  readMoreText={t("readMore")}
                />
              ))}
            </div>
          )}

          {allPosts.length === 0 && (
            <p className="text-center mt-10 text-black/40">{t("noPosts")}</p>
          )}
        </div>
      </section>
      <Footer showNovinky={false} />
    </>
  );
}
