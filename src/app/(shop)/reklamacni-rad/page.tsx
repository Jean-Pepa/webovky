import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";
import { getLang } from "@/i18n/server";
import { t } from "@/i18n/messages";
import { altLinks } from "@/i18n/seo";
import { complaintsMeta, complaintsSections, complaintsAppendices } from "@/content/legal";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return {
    title: t(lang, "legal.complaints"),
    description:
      "Reklamační řád společnosti EIKA ZNOJMO, a.s. – práva z vadného plnění, průběh reklamace, lhůty a reklamační formulář.",
    alternates: altLinks(lang, "/reklamacni-rad"),
  };
}

export default async function ComplaintsPage() {
  const lang = await getLang();
  return (
    <LegalLayout
      eyebrow="Reklamace"
      title={t(lang, "legal.complaints")}
      home={t(lang, "crumb.home")}
      meta={complaintsMeta}
      sections={complaintsSections}
      appendices={complaintsAppendices}
    />
  );
}
