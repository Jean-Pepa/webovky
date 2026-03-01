"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ProjectCard from "../projects/ProjectCard";
import ProjectModal from "../projects/ProjectModal";
import { Project } from "@/types/database";

interface ProjectsPreviewProps {
  projects: Project[] | null;
  locale: string;
}

export default function ProjectsPreview({
  projects,
  locale,
}: ProjectsPreviewProps) {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const isEn = locale === "en";
  const t = useTranslations("projects");

  if (!projects || projects.length === 0) return null;

  const displayed = projects.slice(0, 6);
  const hasMore = projects.length > 6;

  return (
    <>
      <div
        id="projects"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 py-9 relative z-[1] bg-white"
        style={{ paddingLeft: 54, paddingRight: 54 }}
      >
        {displayed.map((project) => (
          <ProjectCard
            key={project.id}
            image={project.thumbnail_url ?? "/images/placeholder.jpg"}
            title={isEn ? project.title_en : project.title_cs}
            subtitle={project.subcategory ?? (isEn ? project.title_en : project.title_cs)}
            onClick={() => setActiveProject(project)}
          />
        ))}
      </div>

      {hasMore && (
        <div className="relative z-[1] bg-white pb-9 text-center" style={{ paddingLeft: 54, paddingRight: 54 }}>
          <a
            href={`/${locale}/projects`}
            className="inline-block text-xs font-medium uppercase tracking-[0.12em] text-primary transition-opacity hover:opacity-40"
          >
            {t("moreProjects")} &rarr;
          </a>
        </div>
      )}

      <ProjectModal
        project={activeProject}
        locale={locale}
        onClose={() => setActiveProject(null)}
      />
    </>
  );
}
