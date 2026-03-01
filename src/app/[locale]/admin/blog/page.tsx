import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminBlogPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl">Blog příspěvky</h1>
        <Link
          href="/admin/blog/new"
          className="bg-accent text-white px-6 py-3 text-sm uppercase tracking-[1px] hover:bg-primary transition-colors"
        >
          Nový příspěvek
        </Link>
      </div>

      <div className="bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="p-4 font-semibold">Název</th>
              <th className="p-4 font-semibold">Stav</th>
              <th className="p-4 font-semibold">Datum</th>
              <th className="p-4 font-semibold">Akce</th>
            </tr>
          </thead>
          <tbody>
            {posts && posts.length > 0 ? (
              posts.map((post) => (
                <tr key={post.id} className="border-b border-border">
                  <td className="p-4">{post.title_cs}</td>
                  <td className="p-4">
                    <span
                      className={`text-xs uppercase tracking-[1px] px-2 py-1 ${
                        post.is_published
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {post.is_published ? "Publikováno" : "Koncept"}
                    </span>
                  </td>
                  <td className="p-4 text-secondary">
                    {new Date(post.created_at).toLocaleDateString("cs")}
                  </td>
                  <td className="p-4">
                    <Link
                      href={`/admin/blog/${post.id}/edit`}
                      className="text-accent hover:text-secondary"
                    >
                      Upravit
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-8 text-center text-secondary">
                  Zatím žádné příspěvky.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
