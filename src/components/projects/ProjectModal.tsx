"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Project } from "@/types/database";

interface ProjectModalProps {
  project: Project | null;
  locale: string;
  onClose: () => void;
}

export default function ProjectModal({
  project,
  locale,
  onClose,
}: ProjectModalProps) {
  const isEn = locale === "en";

  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [project]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!project) return null;

  const title = isEn ? project.title_en : project.title_cs;
  const description = isEn ? project.description_en : project.description_cs;
  const detail = isEn ? project.detail_en : project.detail_cs;

  return (
    <div
      className="flex fixed inset-0 z-[1000] justify-center items-start px-4 md:px-[60px] overflow-y-auto bg-black/50 backdrop-blur-[4px] animate-[fadeIn_0.6s_ease]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-[900px] relative mx-auto animate-[scaleIn_0.6s_cubic-bezier(0.22,1,0.36,1)]" style={{ marginTop: 38, marginBottom: 38 }}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-5 w-9 h-9 flex items-center justify-center rounded-full bg-black/60 text-white text-[22px] font-extralight cursor-pointer z-10 border-none transition-opacity hover:opacity-70 leading-none"
        >
          &times;
        </button>

        {/* Hero image — full width, no border radius */}
        {project.thumbnail_url && (
          <div className="w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
            <Image
              src={project.thumbnail_url}
              alt={title}
              width={900}
              height={506}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content area */}
        <div style={{ padding: "40px 40px 50px" }}>
          {/* Bilingual subcategory */}
          {project.subcategory && (
            <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted" style={{ marginBottom: 10 }}>
              {project.subcategory}
              {isEn ? "" : ` · ${project.subcategory}`}
            </div>
          )}

          {/* Title — large, bold, uppercase */}
          <h2 className="uppercase tracking-[0.03em] leading-[1.15]" style={{ fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: 600, marginBottom: 30 }}>
            {title}
          </h2>

          {/* Description */}
          <p className="text-[15px] leading-[1.9] font-light text-secondary" style={{ maxWidth: 680, marginBottom: 16 }}>
            {description}
          </p>
          {detail && (
            <p className="text-[15px] leading-[1.9] font-light text-secondary" style={{ maxWidth: 680, marginBottom: 16 }}>
              {detail}
            </p>
          )}

          {/* Info items — TYP, STATUS/ROK side by side */}
          {project.subcategory && (
            <div className="flex flex-wrap" style={{ gap: 40, marginTop: 35, paddingTop: 25, borderTop: "1px solid #eee" }}>
              <div>
                <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted" style={{ marginBottom: 4 }}>
                  {isEn ? "Type" : "Typ"}
                </div>
                <div className="text-[14px] font-light">{project.subcategory}</div>
              </div>
              {project.year && (
                <div>
                  <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted" style={{ marginBottom: 4 }}>
                    {isEn ? "Status" : "Status"}
                  </div>
                  <div className="text-[14px] font-light">
                    {isEn ? "In process" : "V procesu"}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Gallery — 2 columns */}
          {project.images && project.images.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" style={{ marginTop: 35 }}>
              {project.images.map((img, i) => (
                <Image
                  key={i}
                  src={img}
                  alt={`${title} - ${i + 1}`}
                  width={440}
                  height={330}
                  className="w-full object-cover"
                  style={{ aspectRatio: "4/3" }}
                />
              ))}
            </div>
          )}

          {/* View more button */}
          <div className="flex justify-center" style={{ marginTop: 45 }}>
            <a
              href={`/${locale}/projects/${project.slug}`}
              className="flex flex-col items-center justify-center rounded-full border border-black/15 text-[8px] font-medium uppercase tracking-[0.12em] text-black transition-opacity hover:opacity-50 text-center leading-[1.4]"
              style={{ width: 80, height: 80, fontFamily: '"Montserrat", sans-serif' }}
            >
              <span>{isEn ? "View" : "Zobrazit"}</span>
              <span>{isEn ? "more" : "více"}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
