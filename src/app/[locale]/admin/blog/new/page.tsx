import BlogPostForm from "@/components/admin/BlogPostForm";

export default async function NewBlogPostPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const sp = await searchParams;

  // Pre-fill from RSS import
  const prefill = sp.title
    ? {
        title: sp.title ?? "",
        content: sp.content ?? "",
        cover: sp.cover ?? "",
        source: sp.source ?? "manual",
        link: sp.link ?? "",
      }
    : undefined;

  return <BlogPostForm prefill={prefill} />;
}
