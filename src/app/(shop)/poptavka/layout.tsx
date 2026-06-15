import type { Metadata } from "next";
import { getLang } from "@/i18n/server";
import { t } from "@/i18n/messages";
import { altLinks } from "@/i18n/seo";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return {
    title: t(lang, "seo.inquiryTitle"),
    description: t(lang, "seo.inquiryDesc"),
    alternates: altLinks(lang, "/poptavka"),
  };
}

export default function InquiryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
