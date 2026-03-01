import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: projectsCount },
    { count: publishedCount },
    { count: blogCount },
  ] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("is_published", true),
    supabase.from("blog_posts").select("*", { count: "exact", head: true }),
  ]);

  return (
    <div>
      <h1 className="text-2xl mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6">
          <div className="text-3xl font-bold">{projectsCount ?? 0}</div>
          <div className="text-secondary text-sm mt-1">Celkem projektů</div>
        </div>
        <div className="bg-white p-6">
          <div className="text-3xl font-bold">{publishedCount ?? 0}</div>
          <div className="text-secondary text-sm mt-1">Publikovaných</div>
        </div>
        <div className="bg-white p-6">
          <div className="text-3xl font-bold">{blogCount ?? 0}</div>
          <div className="text-secondary text-sm mt-1">Blog příspěvků</div>
        </div>
      </div>

      <div className="flex gap-4">
        <Link
          href="/admin/projects/new"
          className="bg-accent text-white px-6 py-3 text-sm uppercase tracking-[1px] hover:bg-primary transition-colors"
        >
          Nový projekt
        </Link>
        <Link
          href="/admin/blog/new"
          className="bg-accent text-white px-6 py-3 text-sm uppercase tracking-[1px] hover:bg-primary transition-colors"
        >
          Nový příspěvek
        </Link>
      </div>
    </div>
  );
}
