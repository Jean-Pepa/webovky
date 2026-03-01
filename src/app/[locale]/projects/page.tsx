"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectModal from "@/components/projects/ProjectModal";
import { Project } from "@/types/database";

export default function ProjectsPage() {
  const params = useParams();
  const locale = (params.locale as string) ?? "cs";
  const isEn = locale === "en";
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("projects")
        .select("*")
        .eq("is_published", true)
        .order("sort_order");
      if (data) setProjects(data);
    }
    load();
  }, []);

  return (
    <>
      <Header />
      <div className="pt-[120px] sm:pt-[180px] pb-20 px-4 sm:px-7 md:px-[54px] relative z-[1] bg-white">
        <h1 className="text-xs font-medium uppercase tracking-[0.12em] text-muted mb-10">
          {isEn ? "All Projects" : "Všechny projekty"}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              image={project.thumbnail_url ?? ""}
              title={isEn ? project.title_en : project.title_cs}
              subtitle={project.subcategory ?? ""}
              onClick={() => setActiveProject(project)}
            />
          ))}
        </div>
      </div>
      <Footer />

      <ProjectModal
        project={activeProject}
        locale={locale}
        onClose={() => setActiveProject(null)}
      />
    </>
  );
}
