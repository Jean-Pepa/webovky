import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MarkdownContent from "@/components/blog/MarkdownContent";
import ProjectGallery from "@/components/projects/ProjectGallery";

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
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const supabase = await createClient();
  const t = await getTranslations("projects");
  const isEn = locale === "en";

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!project) {
    notFound();
  }

  const title = isEn ? project.title_en : project.title_cs;
  const description = isEn ? project.description_en : project.description_cs;
  const detail = isEn ? project.detail_en : project.detail_cs;

  return (
    <>
      <Header />
      <article className="py-20">
        <div className="mx-auto max-w-[1000px] px-5">
          <Link
            href={`/${locale}/projects`}
            className="text-[0.85rem] text-secondary uppercase tracking-[1px] mb-8 inline-block"
          >
            &larr; {t("backToProjects")}
          </Link>

          {/* Hero image */}
          {project.thumbnail_url && (
            <div className="relative w-full h-[400px] md:h-[500px] mb-10">
              <Image
                src={project.thumbnail_url}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 1000px) 100vw, 1000px"
                priority
              />
            </div>
          )}

          {/* Metadata */}
          <div className="mb-8">
            {project.subcategory && (
              <span className="text-[0.8rem] text-[#999] uppercase tracking-[1px]">
                {project.subcategory}
              </span>
            )}
            <h1 className="text-[2rem] md:text-[2.5rem] mt-2 mb-4">{title}</h1>
            <p className="text-[1.1rem] text-secondary leading-relaxed">
              {description}
            </p>
          </div>

          {/* Detail content (markdown) */}
          {detail && (
            <div className="mb-12">
              <MarkdownContent content={detail} />
            </div>
          )}

          {/* Gallery */}
          {project.images && project.images.length > 0 && (
            <ProjectGallery images={project.images} title={title} />
          )}
        </div>
      </article>
      <Footer />
    </>
  );
}
