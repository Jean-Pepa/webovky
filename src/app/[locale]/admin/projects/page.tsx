import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import ProjectsTable from "@/components/admin/ProjectsTable";

export default async function AdminProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = createAdminClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order");

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 40 }}>
        <h1 className="text-[30px] font-light tracking-wide uppercase">Projekty</h1>
        <Link
          href={`/${locale}/admin/projects/new`}
          className="border border-black/[0.06] text-[21px] hover:shadow-sm transition-shadow"
          style={{ borderRadius: 20, paddingLeft: 24, paddingRight: 24, paddingTop: 12, paddingBottom: 12, backgroundColor: '#efefef' }}
        >
          + Přidat projekt
        </Link>
      </div>

      <ProjectsTable initialProjects={projects ?? []} />
    </div>
  );
}
