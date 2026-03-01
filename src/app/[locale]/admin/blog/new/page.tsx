import BlogPostForm from "@/components/admin/BlogPostForm";

export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="text-2xl mb-8">Nový příspěvek</h1>
      <BlogPostForm />
    </div>
  );
}
