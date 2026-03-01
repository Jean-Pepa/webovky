import { getTranslations } from "next-intl/server";
import Footer from "@/components/layout/Footer";
import BackArrow from "@/components/blog/BackArrow";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("blog");

  return (
    <>
      {/* Back arrow — top left */}
      <BackArrow locale={locale} />

      <section className="py-20">
        <div className="mx-auto max-w-[1200px] px-5">
          <h1 className="text-center mt-[57px] text-[3rem] font-light">{t("title")}</h1>
        </div>
      </section>
      <Footer showNovinky={false} showBackToTop={false} />
    </>
  );
}
