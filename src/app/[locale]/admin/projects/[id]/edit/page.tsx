import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import ProjectForm from "@/components/admin/ProjectForm";
import ProjectHistory from "@/components/admin/ProjectHistory";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (!project) {
    notFound();
  }

  return (
    <>
      <ProjectForm project={project} />
      <ProjectHistory projectId={id} />
    </>
  );
}
