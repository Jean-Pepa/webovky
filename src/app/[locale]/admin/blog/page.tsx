import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminBlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = createAdminClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 40 }}>
        <h1 className="text-[30px] font-light tracking-wide uppercase">Blog příspěvky</h1>
        <Link
          href={`/${locale}/admin/blog/new`}
          className="border border-black/[0.06] text-[21px] hover:shadow-sm transition-shadow"
          style={{ borderRadius: 20, paddingLeft: 24, paddingRight: 24, paddingTop: 12, paddingBottom: 12, backgroundColor: '#efefef' }}
        >
          + Přidat příspěvek
        </Link>
      </div>

      <div className="border border-black/[0.06] overflow-hidden" style={{ borderRadius: 20, backgroundColor: '#efefef' }}>
        <table className="w-full text-[21px]">
          <thead>
            <tr className="border-b border-black/[0.06] text-left" style={{ backgroundColor: '#e8e8e8' }}>
              <th style={{ padding: "16px 24px" }} className="text-[17px] font-medium uppercase tracking-wider text-black/50">Název</th>
              <th style={{ padding: "16px 24px" }} className="text-[17px] font-medium uppercase tracking-wider text-black/50">Stav</th>
              <th style={{ padding: "16px 24px" }} className="text-[17px] font-medium uppercase tracking-wider text-black/50">Datum</th>
              <th style={{ padding: "16px 24px" }} className="text-[17px] font-medium uppercase tracking-wider text-black/50">Akce</th>
            </tr>
          </thead>
          <tbody>
            {posts && posts.length > 0 ? (
              posts.map((post) => (
                <tr key={post.id} className="border-b border-black/[0.06] last:border-b-0 hover:bg-[#e8e8e8] transition-colors" style={{ backgroundColor: '#efefef' }}>
                  <td style={{ padding: "20px 24px" }}>{post.title_cs}</td>
                  <td style={{ padding: "20px 24px" }}>
                    <span
                      className={`text-lg ${
                        post.is_published
                          ? "bg-green-50 text-green-700"
                          : "bg-yellow-50 text-yellow-700"
                      }`}
                      style={{ borderRadius: 9999, paddingLeft: 16, paddingRight: 16, paddingTop: 6, paddingBottom: 6 }}
                    >
                      {post.is_published ? "Publikováno" : "Koncept"}
                    </span>
                  </td>
                  <td style={{ padding: "20px 24px" }} className="text-black/50">
                    {new Date(post.created_at).toLocaleDateString("cs")}
                  </td>
                  <td style={{ padding: "20px 24px" }}>
                    <div style={{ display: "flex", gap: 16 }}>
                      <Link
                        href={`/${locale}/admin/blog/${post.id}/edit`}
                        className="text-black/50 hover:text-black text-[21px] transition-colors"
                      >
                        Upravit
                      </Link>
                      <DeleteButton
                        endpoint={`/api/admin/blog/${post.id}`}
                        confirmMessage={`Smazat příspěvek "${post.title_cs}"?`}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} style={{ padding: 40 }} className="text-center text-black/40">
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
