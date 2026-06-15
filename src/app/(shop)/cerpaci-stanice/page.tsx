import type { Metadata } from "next";
import Link from "@/components/LocLink";
import BackButton from "@/components/BackButton";
import { FuelIcon, WashIcon } from "@/components/Icons";
import { getLang } from "@/i18n/server";
import { t } from "@/i18n/messages";
import { altLinks } from "@/i18n/seo";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return {
    title: t(lang, "fuel.title"),
    description: t(lang, "fuel.intro"),
    alternates: altLinks(lang, "/cerpaci-stanice"),
  };
}

export default async function FuelPage() {
  const lang = await getLang();

  const cards = [
    { icon: FuelIcon, title: t(lang, "fuel.stationTitle"), desc: t(lang, "fuel.stationDesc") },
    { icon: WashIcon, title: t(lang, "fuel.washTitle"), desc: t(lang, "fuel.washDesc") },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-center gap-3 mb-5">
        <BackButton />
        <nav className="text-sm text-[var(--color-ink-soft)]">
          <Link href="/" className="hover:text-[var(--color-accent)]">{t(lang, "crumb.home")}</Link>
          <span className="mx-2">/</span>
          <Link href="/sluzby" className="hover:text-[var(--color-accent)]">{t(lang, "nav.services")}</Link>
          <span className="mx-2">/</span>
          <span>{t(lang, "nav.fuel")}</span>
        </nav>
      </div>

      <h1 className="text-4xl font-extrabold">{t(lang, "fuel.title")}</h1>
      <p className="mt-3 text-lg text-[var(--color-ink-soft)] max-w-3xl">{t(lang, "fuel.intro")}</p>

      <div className="mt-8 grid sm:grid-cols-2 gap-5">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="bg-white border border-[var(--color-border)] rounded-2xl p-6">
              <span className="w-12 h-12 rounded-xl grid place-items-center text-white" style={{ background: "var(--color-accent)" }}>
                <Icon className="w-6 h-6" />
              </span>
              <h2 className="mt-4 text-lg font-bold">{c.title}</h2>
              <p className="mt-2 text-sm text-[var(--color-ink-soft)] leading-relaxed">{c.desc}</p>
              <div className="mt-4 pt-4 border-t border-[var(--color-border)] text-sm">
                <span className="font-semibold">{t(lang, "contact.hours")}: </span>
                <span className="text-[var(--color-ink-soft)]">{t(lang, "fuel.hoursPlaceholder")}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Umístění */}
      <section className="mt-10 bg-white border border-[var(--color-border)] rounded-2xl p-6">
        <h2 className="text-xl font-bold">{t(lang, "fuel.locationTitle")}</h2>
        <p className="mt-2 text-[var(--color-ink-soft)]">{t(lang, "fuel.locationDesc")}</p>
        <div className="mt-4">
          <Link href="/kontakt" className="inline-flex items-center px-5 py-2.5 rounded-full font-semibold text-white" style={{ background: "var(--color-accent)" }}>
            {t(lang, "nav.contact")}
          </Link>
        </div>
      </section>
    </div>
  );
}
