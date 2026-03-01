import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ProjectForm from "@/components/admin/ProjectForm";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (!project) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl mb-8">Upravit projekt</h1>
      <ProjectForm project={project} />
    </div>
  );
}
