import type { Metadata } from "next";
import MultiLegalLayout, { type LegalGroup } from "@/components/MultiLegalLayout";
import { getLang } from "@/i18n/server";
import { t } from "@/i18n/messages";
import { altLinks } from "@/i18n/seo";
import {
  privacyMeta,
  privacySections,
  termsSections,
  termsAppendices,
  complaintsSections,
  complaintsAppendices,
} from "@/content/legal";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return {
    title: t(lang, "legal.privacy"),
    description:
      "Zásady ochrany osobních údajů, obchodní podmínky a reklamační řád společnosti EIKA ZNOJMO, a.s. – kompletní právní dokumenty a formuláře.",
    alternates: altLinks(lang, "/ochrana-osobnich-udaju"),
  };
}

export default async function PrivacyPage() {
  const lang = await getLang();

  const groups: LegalGroup[] = [
    {
      id: "ochrana-osobnich-udaju",
      heading: "Ochrana osobních údajů (GDPR)",
      intro: "Jak zpracováváme a chráníme vaše osobní údaje podle nařízení GDPR.",
      sections: privacySections,
    },
    {
      id: "obchodni-podminky",
      heading: "Obchodní podmínky",
      intro: "Pravidla pro objednávky, ceny, dodání, platbu a odstoupení od smlouvy.",
      sections: termsSections,
      appendices: termsAppendices,
    },
    {
      id: "reklamacni-rad",
      heading: "Reklamační řád",
      intro: "Práva z vadného plnění, průběh reklamace a reklamační formulář.",
      sections: complaintsSections,
      appendices: complaintsAppendices,
    },
  ];

  return (
    <MultiLegalLayout
      eyebrow="Zásady a dokumenty"
      title="Ochrana osobních údajů, obchodní podmínky a reklamační řád"
      home={t(lang, "crumb.home")}
      meta={privacyMeta}
      groups={groups}
    />
  );
}
