"use client";

import { useEffect, useState } from "react";
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
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

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
      if (e.key === "Escape") {
        if (lightboxSrc) {
          setLightboxSrc(null);
        } else {
          onClose();
        }
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose, lightboxSrc]);

  if (!project) return null;

  const title = isEn ? project.title_en : project.title_cs;
  const description = isEn ? project.description_en : project.description_cs;
  const detail = isEn ? project.detail_en : project.detail_cs;

  const buildingTypes: Record<string, { cs: string; en: string }> = {
    "hotel-podhoran": { cs: "Polyfunkční dům", en: "Mixed-use building" },
    "rekonstrukce-bitov": { cs: "Rekreační budova", en: "Recreational building" },
    "nevideny-zlin": { cs: "Polyfunkční dům", en: "Mixed-use building" },
    "rodinny-dum-kladky": { cs: "Rodinný dům", en: "Family house" },
  };
  const buildingType = project.slug && buildingTypes[project.slug]
    ? (isEn ? buildingTypes[project.slug].en : buildingTypes[project.slug].cs)
    : null;

  return (
    <>
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
            {/* Title — large, bold, uppercase */}
            <h2 className="uppercase tracking-[0.03em] leading-[1.15]" style={{ fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: 600, marginBottom: 30 }}>
              {title}
            </h2>

            {/* Two-column: description left, metadata right */}
            <div className="flex flex-col md:flex-row md:gap-12" style={{ marginBottom: 35 }}>
              {/* Left column — description ~65% */}
              <div className="md:w-[65%]">
                <p className="text-[15px] leading-[1.9] font-light text-secondary" style={{ marginBottom: 16 }}>
                  {description}
                </p>
                {detail && (
                  <p className="text-[15px] leading-[1.9] font-light text-secondary">
                    {detail}
                  </p>
                )}
              </div>

              {/* Right column — metadata ~35% */}
              {(buildingType || project.subcategory || project.year) && (
                <div className="md:w-[35%] mt-8 md:mt-0 md:border-l md:border-black/10 md:pl-10 flex flex-col gap-6">
                  {(buildingType || project.subcategory) && (
                    <div>
                      <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted" style={{ marginBottom: 4 }}>
                        {isEn ? "Type" : "Typ"}
                      </div>
                      <div className="text-[14px] font-light">{buildingType ?? project.subcategory}</div>
                    </div>
                  )}
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
            </div>

            {/* Gallery — full-width images stacked */}
            {project.images && project.images.length > 0 && (
              <div className="flex flex-col gap-4" style={{ marginTop: 10 }}>
                {project.images.map((img, i) => (
                  <Image
                    key={i}
                    src={img}
                    alt={`${title} - ${i + 1}`}
                    width={900}
                    height={600}
                    className="w-full object-cover cursor-pointer transition-opacity hover:opacity-90"
                    style={{ aspectRatio: "3/2" }}
                    onClick={() => setLightboxSrc(img)}
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
                <span>DETAIL</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox — outside modal to avoid backdrop-blur containment */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/85 cursor-pointer animate-[fadeIn_0.3s_ease]"
          onClick={() => setLightboxSrc(null)}
        >
          <button
            onClick={() => setLightboxSrc(null)}
            className="absolute top-5 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/15 text-white text-[26px] font-extralight cursor-pointer z-10 border-none transition-opacity hover:opacity-70 leading-none"
          >
            &times;
          </button>
          <Image
            src={lightboxSrc}
            alt={title}
            width={1600}
            height={1000}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
