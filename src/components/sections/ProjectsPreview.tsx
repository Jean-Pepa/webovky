"use client";

import { useTranslations } from "next-intl";
import ProjectCard from "../projects/ProjectCard";
import { Project } from "@/types/database";

interface ProjectsPreviewProps {
  projects: Project[] | null;
  locale: string;
}

export default function ProjectsPreview({
  projects,
  locale,
}: ProjectsPreviewProps) {
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
        style={{ paddingLeft: 120, paddingRight: 120 }}
      >
        {displayed.map((project) => {
          const title = isEn ? project.title_en : project.title_cs;
          const href = `/${locale}/projects/${project.slug}`;

          return project.slug === "rezidence-1923" ? (
            <a
              key={project.id}
              href={href}
              className="flex items-center justify-center cursor-pointer bg-[rgba(80,90,170,0.08)] transition-all hover:bg-[rgba(215,155,120,0.12)]"
              style={{ aspectRatio: "1/1" }}
            >
              <h3 className="text-[clamp(14px,1.8vw,18px)] font-light uppercase tracking-[0.12em] text-black/50">
                {title}
              </h3>
            </a>
          ) : (
            <ProjectCard
              key={project.id}
              image={project.thumbnail_url ?? "/images/placeholder.jpg"}
              title={title}
              subtitle={project.subcategory ?? title}
              href={href}
              aspectRatio="1/1"
            />
          );
        })}
      </div>

      {hasMore && (
        <div className="relative z-[1] bg-white pb-9 text-center" style={{ paddingLeft: 120, paddingRight: 120 }}>
          <a
            href={`/${locale}/projects`}
            className="inline-block text-xs font-medium uppercase tracking-[0.12em] text-primary transition-opacity hover:opacity-40"
          >
            {t("moreProjects")} &rarr;
          </a>
        </div>
      )}
    </>
  );
}
