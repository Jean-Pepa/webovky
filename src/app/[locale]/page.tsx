import { createClient } from "@/lib/supabase/server";
import Header from "@/components/layout/Header";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import ProjectsPreview from "@/components/sections/ProjectsPreview";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const isEn = locale === "en";

  const [{ data: projects }, { data: about }, { data: settings }] =
    await Promise.all([
      supabase
        .from("projects")
        .select("*")
        .eq("is_published", true)
        .order("sort_order"),
      supabase.from("about_content").select("*").single(),
      supabase.from("site_settings").select("*").single(),
    ]);

  const heroTitle = isEn
    ? (settings?.hero_title_en ?? "Houses. Spaces. Places. Design.")
    : (settings?.hero_title_cs ?? "Domy. Prostory. Místa. Design.");

  return (
    <>
      <Header idleTimeout={10_000} />
      <Hero title={heroTitle} />
      <ProjectsPreview projects={projects} locale={locale} />
      <About about={about} locale={locale} />
      <Contact settings={settings} locale={locale} />
      <Footer />
    </>
  );
}
