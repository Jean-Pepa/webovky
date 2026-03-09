import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MarkdownContent from "@/components/blog/MarkdownContent";

export default async function BlogPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { locale, slug } = await params;
  const { preview } = await searchParams;
  const t = await getTranslations("blog");
  const isEn = locale === "en";

  let isPreview = false;
  if (preview === "true") {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (token) {
      try {
        const secret = new TextEncoder().encode(process.env.ADMIN_SECRET);
        await jwtVerify(token, secret);
        isPreview = true;
      } catch { /* not admin */ }
    }
  }

  let post;
  if (isPreview) {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .single();
    post = data;
  } else {
    const supabase = await createClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();
    post = data;
  }

  if (!post) {
    notFound();
  }

  const title = isEn ? post.title_en : post.title_cs;
  const content = isEn ? post.content_en : post.content_cs;

  return (
    <>
      {isPreview && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999, backgroundColor: "#fef3c7", color: "#92400e", textAlign: "center", padding: "8px 16px", fontSize: 14, fontWeight: 500 }}>
          Náhled nepublikované stránky
        </div>
      )}
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
