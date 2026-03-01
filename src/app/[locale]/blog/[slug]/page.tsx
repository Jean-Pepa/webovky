import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MarkdownContent from "@/components/blog/MarkdownContent";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const supabase = await createClient();
  const t = await getTranslations("blog");
  const isEn = locale === "en";

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!post) {
    notFound();
  }

  const title = isEn ? post.title_en : post.title_cs;
  const content = isEn ? post.content_en : post.content_cs;

  return (
    <>
      <Header />
      <article className="py-20">
        <div className="mx-auto max-w-[800px] px-5">
          <Link
            href={`/${locale}/blog`}
            className="text-[0.85rem] text-secondary uppercase tracking-[1px] mb-8 inline-block"
          >
            &larr; {t("backToBlog")}
          </Link>

          <h1 className="text-[2rem] md:text-[2.5rem] mb-4">{title}</h1>

          {post.published_at && (
            <p className="text-secondary text-sm mb-8">
              {new Date(post.published_at).toLocaleDateString(
                locale === "en" ? "en-US" : "cs-CZ",
                { year: "numeric", month: "long", day: "numeric" }
              )}
            </p>
          )}

          <div className="prose max-w-none">
            <MarkdownContent content={content} />
          </div>
        </div>
      </article>
      <Footer />
    </>
  );
}
