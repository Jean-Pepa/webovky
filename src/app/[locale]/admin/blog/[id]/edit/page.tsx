import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import BlogPostForm from "@/components/admin/BlogPostForm";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();

  if (!post) {
    notFound();
  }

  return <BlogPostForm post={post} />;
}
