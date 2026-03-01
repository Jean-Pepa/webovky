import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminProjectsPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order");

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl">Projekty</h1>
        <Link
          href="/admin/projects/new"
          className="bg-accent text-white px-6 py-3 text-sm uppercase tracking-[1px] hover:bg-primary transition-colors"
        >
          Nový projekt
        </Link>
      </div>

      <div className="bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="p-4 font-semibold">Název</th>
              <th className="p-4 font-semibold">Kategorie</th>
              <th className="p-4 font-semibold">Stav</th>
              <th className="p-4 font-semibold">Pořadí</th>
              <th className="p-4 font-semibold">Akce</th>
            </tr>
          </thead>
          <tbody>
            {projects?.map((project) => (
              <tr key={project.id} className="border-b border-border">
                <td className="p-4">{project.title_cs}</td>
                <td className="p-4 text-secondary">
                  {project.category === "atelier"
                    ? "Ateliérová tvorba"
                    : "Ostatní tvorba"}
                </td>
                <td className="p-4">
                  <span
                    className={`text-xs uppercase tracking-[1px] px-2 py-1 ${
                      project.is_published
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {project.is_published ? "Publikováno" : "Koncept"}
                  </span>
                </td>
                <td className="p-4 text-secondary">{project.sort_order}</td>
                <td className="p-4">
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className="text-accent hover:text-secondary mr-4"
                  >
                    Upravit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
