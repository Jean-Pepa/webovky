import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";

export default async function AdminDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = createAdminClient();

  const [
    { count: projectsCount },
    { count: publishedCount },
    { count: blogCount },
    { data: projects },
  ] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("is_published", true),
    supabase.from("blog_posts").select("*", { count: "exact", head: true }),
    supabase.from("projects").select("id, title_cs, is_published, sort_order").order("sort_order"),
  ]);

  const quickLinks = [
    { href: `/${locale}/admin/projects/new`, label: "Nový projekt", subtitle: "Přidat do portfolia" },
    { href: `/${locale}/admin/blog/new`, label: "Nový příspěvek", subtitle: "Napsat článek" },
    { href: `/${locale}/admin/about`, label: "O mně", subtitle: "Upravit profil" },
    { href: `/${locale}/admin/settings`, label: "Nastavení", subtitle: "Konfigurace webu" },
  ];

  const card = { borderRadius: 20 };

  return (
    <div>
      <h1 className="text-[30px] font-light tracking-wide uppercase" style={{ marginBottom: 40 }}>Dashboard</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 40 }}>
        <div className="border border-black/[0.06] hover:shadow-sm transition-shadow" style={{ ...card, padding: 32, backgroundColor: '#efefef' }}>
          <div className="text-[45px] font-bold">{projectsCount ?? 0}</div>
          <div className="text-black/50 text-[21px]" style={{ marginTop: 8 }}>Celkem projektů</div>
        </div>
        <div className="border border-black/[0.06] hover:shadow-sm transition-shadow" style={{ ...card, padding: 32, backgroundColor: '#efefef' }}>
          <div className="text-[45px] font-bold">{publishedCount ?? 0}</div>
          <div className="text-black/50 text-[21px]" style={{ marginTop: 8 }}>Publikovaných</div>
        </div>
        <div className="border border-black/[0.06] hover:shadow-sm transition-shadow" style={{ ...card, padding: 32, backgroundColor: '#efefef' }}>
          <div className="text-[45px] font-bold">{blogCount ?? 0}</div>
          <div className="text-black/50 text-[21px]" style={{ marginTop: 8 }}>Blog příspěvků</div>
        </div>
      </div>

      {/* Projects status */}
      <div className="border border-black/[0.06]" style={{ ...card, padding: 32, marginBottom: 40, backgroundColor: '#efefef' }}>
        <h2 className="text-[20px] font-medium uppercase tracking-wider text-black/50" style={{ marginBottom: 20 }}>Projekty</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {projects?.map((project) => (
            <div key={project.id} className="border-b border-black/[0.04] last:border-b-0" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, paddingBottom: 12 }}>
              <Link
                href={`/${locale}/admin/projects/${project.id}/edit`}
                className="text-[21px] hover:text-black/60 transition-colors"
              >
                {project.title_cs}
              </Link>
              <span
                className="text-lg border"
                style={{
                  borderRadius: 9999,
                  paddingLeft: 16, paddingRight: 16, paddingTop: 6, paddingBottom: 6,
                  backgroundColor: project.is_published ? '#bbf7d0' : '#fecaca',
                  color: project.is_published ? '#14532d' : '#dc2626',
                  borderColor: project.is_published ? '#4ade80' : '#f87171',
                }}
              >
                {project.is_published ? "Publikováno" : "Nepublikováno"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="border border-black/[0.06] hover:shadow-sm transition-shadow"
            style={{ ...card, padding: 28, backgroundColor: '#efefef' }}
          >
            <div className="text-[21px] font-medium">{link.label}</div>
            <div className="text-lg text-black/45" style={{ marginTop: 8 }}>{link.subtitle}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
