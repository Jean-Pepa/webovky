import type { Metadata } from "next";
import Link from "@/components/LocLink";
import BackButton from "@/components/BackButton";
import { getLang } from "@/i18n/server";
import { t } from "@/i18n/messages";
import { altLinks } from "@/i18n/seo";
import { locArticles } from "@/data/news";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return {
    title: t(lang, "news.title"),
    description: t(lang, "news.intro"),
    alternates: altLinks(lang, "/novinky"),
  };
}

export default async function NewsPage() {
  const lang = await getLang();
  const articles = locArticles(lang);
  const locale = lang === "cs" ? "cs-CZ" : lang === "de" ? "de-DE" : "en-GB";

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center gap-3 mb-5">
        <BackButton />
        <nav className="text-sm text-[var(--color-ink-soft)]">
          <Link href="/" className="hover:text-[var(--color-accent)]">{t(lang, "crumb.home")}</Link>
          <span className="mx-2">/</span>
          <span>{t(lang, "news.title")}</span>
        </nav>
      </div>

      <h1 className="text-4xl font-extrabold">{t(lang, "news.title")}</h1>
      <p className="mt-3 text-lg text-[var(--color-ink-soft)]">{t(lang, "news.intro")}</p>

      <div className="mt-8 grid sm:grid-cols-2 gap-5">
        {articles.map((a) => (
          <Link key={a.slug} href={`/novinky/${a.slug}`} className="group bg-white border border-[var(--color-border)] rounded-2xl p-6 hover:shadow-md transition flex flex-col">
            <div className="flex items-center gap-3">
              {a.badge && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold text-white" style={{ background: "var(--color-accent)" }}>{a.badge}</span>
              )}
              <time className="text-xs text-[var(--color-ink-soft)]">{new Date(a.date).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" })}</time>
            </div>
            <h2 className="mt-3 text-xl font-bold group-hover:text-[var(--color-accent)] transition">{a.title}</h2>
            <p className="mt-2 text-sm text-[var(--color-ink-soft)] leading-relaxed flex-1">{a.excerpt}</p>
            <span className="mt-4 text-sm font-semibold text-[var(--color-accent)]">{t(lang, "news.readMore")} →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
