import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";
import { getLang } from "@/i18n/server";
import { t } from "@/i18n/messages";
import { altLinks } from "@/i18n/seo";
import { termsMeta, termsSections, termsAppendices } from "@/content/legal";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return {
    title: t(lang, "legal.terms"),
    description:
      "Obchodní podmínky společnosti EIKA ZNOJMO, a.s. – objednávky, ceny, dodání, platba, odstoupení od smlouvy a reklamace.",
    alternates: altLinks(lang, "/obchodni-podminky"),
  };
}

export default async function TermsPage() {
  const lang = await getLang();
  return (
    <LegalLayout
      eyebrow="Podmínky"
      title={t(lang, "legal.terms")}
      home={t(lang, "crumb.home")}
      meta={termsMeta}
      sections={termsSections}
      appendices={termsAppendices}
    />
  );
}
