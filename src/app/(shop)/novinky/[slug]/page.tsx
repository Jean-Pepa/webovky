import type { Metadata } from "next";
import Link from "@/components/LocLink";
import { notFound } from "next/navigation";
import BackButton from "@/components/BackButton";
import { getLang } from "@/i18n/server";
import { t } from "@/i18n/messages";
import { altLinks } from "@/i18n/seo";
import { ARTICLES, getArticle, locArticle } from "@/data/news";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const orig = getArticle(slug);
  if (!orig) return {};
  const lang = await getLang();
  const a = locArticle(orig, lang);
  return {
    title: a.title,
    description: a.excerpt,
    alternates: altLinks(lang, `/novinky/${a.slug}`),
    openGraph: { title: `${a.title} | EIKA ZNOJMO`, description: a.excerpt, type: "article" },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const orig = getArticle(slug);
  if (!orig) notFound();

  const lang = await getLang();
  const a = locArticle(orig, lang);
  const locale = lang === "cs" ? "cs-CZ" : lang === "de" ? "de-DE" : "en-GB";

  const ld = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: a.title,
    datePublished: a.date,
    description: a.excerpt,
    publisher: { "@type": "Organization", name: "EIKA ZNOJMO, a.s." },
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="flex items-center gap-3 mb-5">
        <BackButton />
        <nav className="text-sm text-[var(--color-ink-soft)]">
          <Link href="/" className="hover:text-[var(--color-accent)]">{t(lang, "crumb.home")}</Link>
          <span className="mx-2">/</span>
          <Link href="/novinky" className="hover:text-[var(--color-accent)]">{t(lang, "news.title")}</Link>
          <span className="mx-2">/</span>
          <span className="text-[var(--color-ink)]">{a.title}</span>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        {a.badge && (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold text-white" style={{ background: "var(--color-accent)" }}>{a.badge}</span>
        )}
        <time className="text-sm text-[var(--color-ink-soft)]">{new Date(a.date).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" })}</time>
      </div>
      <h1 className="mt-3 text-4xl font-extrabold leading-tight">{a.title}</h1>

      <article className="mt-6 space-y-4 text-[var(--color-ink-soft)] leading-relaxed">
        {a.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </article>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/poptavka" className="px-6 py-3 rounded-full font-semibold text-white" style={{ background: "var(--color-accent)" }}>
          {t(lang, "nav.inquiry")}
        </Link>
        <Link href="/novinky" className="px-6 py-3 rounded-full font-semibold border border-[var(--color-border)] hover:border-[var(--color-accent)] transition">
          {t(lang, "news.all")}
        </Link>
      </div>
    </div>
  );
}
