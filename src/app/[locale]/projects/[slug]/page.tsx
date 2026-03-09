import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BackArrow from "@/components/blog/BackArrow";
import MarkdownContent from "@/components/blog/MarkdownContent";
import ProjectGallery from "@/components/projects/ProjectGallery";
import AdminTab from "@/components/admin/AdminTab";
import AdminBudgetCard from "@/components/admin/AdminBudgetCard";
import DocGallery from "@/components/projects/DocGallery";
import ScrollToTop from "@/components/layout/ScrollToTop";
import VideoPlayer from "@/components/projects/VideoPlayer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("title_cs, title_en, description_cs, description_en")
    .eq("slug", slug)
    .single();

  if (!project) return {};

  const isEn = locale === "en";
  return {
    title: `${isEn ? project.title_en : project.title_cs} | Kristián Vyskočil`,
    description: isEn ? project.description_en : project.description_cs,
  };
}

export default async function ProjectDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { locale, slug } = await params;
  const { preview } = await searchParams;
  const t = await getTranslations("projects");
  const isEn = locale === "en";

  let isPreview = false;
  if (preview === "true") {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (token) {
      try {
        const secret = new TextEncoder().encode(process.env.ADMIN_SECRET);
        await jwtVerify(token, secret);
        isPreview = true;
      } catch { /* not admin */ }
    }
  }

  let project;
  if (isPreview) {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .single();
    project = data;
  } else {
    const supabase = await createClient();
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();
    project = data;
  }

  if (!project) {
    notFound();
  }

  // If project is not active (and not admin preview), show "coming soon" page
  if (!project.is_active && !isPreview) {
    return (
      <>
        <Header showNav={false} showIntro={false} idleTimeout={10_000} logoTop={51} scrollTrigger=".coming-soon-text" />
        <BackArrow locale={locale} />
        <article className="relative z-[1] bg-white min-h-screen flex items-center justify-center px-6 sm:px-12 md:px-[150px]">
          <p className="coming-soon-text text-[clamp(24px,3vw,36px)] font-extralight tracking-[0.04em] text-black/40">
            {isEn ? "Coming soon..." : "Již brzy..."}
          </p>
        </article>
        <ScrollToTop />
        <Footer />
      </>
    );
  }

  const title = isEn ? project.title_en : project.title_cs;
  const description = isEn ? project.description_en : project.description_cs;
  const detail = isEn ? project.detail_en : project.detail_cs;
  const categoryLabel =
    project.category === "atelier" ? "Atelier" : "Design";

  const hasImages =
    (project.images && project.images.length > 0) || project.thumbnail_url;
  const hasDetail = !!detail;

  const tabs = [
    ...(hasImages
      ? [{ id: "fotografie", label: isEn ? "Photos" : "Fotografie" }]
      : []),
    { id: "informace", label: isEn ? "Information" : "Informace" },
    { id: "dokumentace", label: isEn ? "Documentation" : "Dokumentace" },
  ];

  return (
    <>
      {isPreview && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999, backgroundColor: "#fef3c7", color: "#92400e", textAlign: "center", padding: "8px 16px", fontSize: 14, fontWeight: 500 }}>
          Náhled nepublikované stránky
        </div>
      )}
      <Header showNav={false} showIntro={false} idleTimeout={10_000} logoTop={51} scrollTrigger=".detail-title" />
      <BackArrow locale={locale} />

      <article className="relative z-[1] bg-white px-6 sm:px-12 md:px-[150px]">
        {/* Title */}
        <div className="text-center" style={{ paddingTop: 200 }}>
          {project.subcategory && (
            <div className="text-[11px] font-medium uppercase tracking-[0.1em] text-light mb-3">
              {project.subcategory}
            </div>
          )}
          <h1 className="detail-title text-[clamp(26px,3.5vw,42px)] font-extralight leading-[1.15] tracking-[0.02em] mb-2">
            {title}
          </h1>
        </div>

        {/* Tab cards */}
        <div className="flex items-center justify-center mb-0 pb-0" style={{ marginTop: 24 }}>
          {tabs.map((tab, i) => (
            <div key={tab.id} className="flex items-center">
              {i > 0 && (
                <div className="w-px h-4 bg-border-dark" style={{ marginLeft: 11, marginRight: 11 }} />
              )}
              <a
                href={`#${tab.id}`}
                className="text-xs font-medium uppercase tracking-[0.12em] text-muted hover:text-primary transition-colors py-3 border-b-2 border-transparent hover:border-primary -mb-px"
              >
                {tab.label}
              </a>
            </div>
          ))}
          <AdminTab isEn={isEn} />
        </div>

        {/* ── FOTOGRAFIE ── */}
        {hasImages && (
          <>
            <div
              id="fotografie"
              className="pb-4 border-b border-border-dark text-center"
              style={{ paddingTop: 60 }}
            >
              <h3 className="text-xs font-medium uppercase tracking-[0.12em] text-muted">
                {isEn ? "Photos" : "Fotografie"} &bull; Gallery
              </h3>
            </div>

            <div className="pb-[60px]" style={{ paddingTop: 78 }} data-gallery>
              <ProjectGallery
                images={project.images || []}
                title={title}
                thumbnailUrl={project.thumbnail_url ?? undefined}
              />
            </div>
          </>
        )}

        {/* ── INFORMACE ── */}
        <div style={{ paddingLeft: "8%", paddingRight: "8%" }}>
        <div
          id="informace"
          className="pb-4 border-b border-border-dark text-center"
          style={{ paddingTop: 60 }}
        >
          <h3 className="text-xs font-medium uppercase tracking-[0.12em] text-muted">
            {isEn ? "Information" : "Informace"} &bull; Info
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-20 pt-10 pb-[60px]">
          {/* Left — description */}
          <div>
            <p className="text-sm leading-[1.9] font-light text-secondary">
              {description}
            </p>
          </div>

          {/* Right — metadata rows */}
          <div>
            <div className="text-[11px] font-medium uppercase tracking-[0.1em] text-light mb-[10px]">
              {isEn ? "Project details" : "Detail projektu"}
            </div>
            <ul className="list-none">
              <li
                className="flex justify-between border-b border-border text-[13px] font-light"
                style={{ paddingTop: 14, paddingBottom: 14 }}
              >
                Typ
                <span className="text-muted text-xs shrink-0 ml-3">
                  {categoryLabel}
                </span>
              </li>
              {project.year && (
                <li
                  className="flex justify-between border-b border-border text-[13px] font-light"
                  style={{ paddingTop: 14, paddingBottom: 14 }}
                >
                  Rok
                  <span className="text-muted text-xs shrink-0 ml-3">
                    {project.year}
                  </span>
                </li>
              )}
              {project.subcategory && (
                <li
                  className="flex justify-between border-b border-border text-[13px] font-light"
                  style={{ paddingTop: 14, paddingBottom: 14 }}
                >
                  {isEn ? "Category" : "Kategorie"}
                  <span className="text-muted text-xs shrink-0 ml-3">
                    {project.subcategory}
                  </span>
                </li>
              )}
              {project.pdf_files && project.pdf_files.length > 0 && (project.pdf_files as { url: string; label_cs: string; label_en: string }[]).map((pdf, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center border-b border-border text-[13px] font-light"
                  style={{ paddingTop: 14, paddingBottom: 14 }}
                >
                  {isEn ? pdf.label_en : pdf.label_cs}
                  <a
                    href={pdf.url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted text-xs shrink-0 ml-3 hover:text-primary transition-colors underline underline-offset-2"
                  >
                    {isEn ? "Download" : "Ke stažení"}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        </div>

        {/* ── DOKUMENTACE ── */}
        <div
          id="dokumentace"
          className="pb-4 border-b border-border-dark text-center"
          style={{ paddingTop: 60 }}
        >
          <h3 className="text-xs font-medium uppercase tracking-[0.12em] text-muted">
            {isEn ? "Documentation" : "Dokumentace"} &bull; Detail
          </h3>
        </div>

        <div className="pt-10 pb-[60px]">
          <div className="max-w-[800px] mx-auto text-center">
            {detail && <MarkdownContent content={detail} />}
          </div>

          {/* Documentation video (data-driven) */}
          {project.doc_video && (
            <VideoPlayer src={project.doc_video} />
          )}

          {/* Documentation images (data-driven) */}
          {project.doc_images && project.doc_images.length > 0 && (
            <DocGallery images={project.doc_images} />
          )}
        </div>

        {/* ── ROZPOČET (admin only) ── */}
        <AdminBudgetCard isEn={isEn} />
      </article>

      <ScrollToTop />
      <Footer />
    </>
  );
}
