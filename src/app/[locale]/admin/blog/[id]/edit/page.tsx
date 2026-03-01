import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import BlogPostForm from "@/components/admin/BlogPostForm";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();

  if (!post) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl mb-8">Upravit příspěvek</h1>
      <BlogPostForm post={post} />
    </div>
  );
}
