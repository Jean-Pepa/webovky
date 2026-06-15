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

  const fuels = [
    t(lang, "fuel.f1"),
    t(lang, "fuel.f2"),
    t(lang, "fuel.f3"),
    t(lang, "fuel.f4"),
    t(lang, "fuel.f5"),
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

      <div className="mt-8 grid lg:grid-cols-2 gap-5">
        {/* Čerpací stanice */}
        <div className="bg-white border border-[var(--color-border)] rounded-2xl p-6">
          <div className="flex items-center justify-between gap-3">
            <span className="w-12 h-12 rounded-xl grid place-items-center text-white" style={{ background: "var(--color-accent)" }}>
              <FuelIcon className="w-6 h-6" />
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{ background: "var(--color-accent)" }}>
              {t(lang, "fuel.nonstop")}
            </span>
          </div>
          <h2 className="mt-4 text-lg font-bold">{t(lang, "fuel.stationTitle")}</h2>
          <p className="mt-2 text-sm text-[var(--color-ink-soft)]">{t(lang, "fuel.stationLead")}</p>
          <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-[var(--color-ink-soft)]">
            {fuels.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-[var(--color-ink-soft)]">{t(lang, "fuel.bottles")}</p>
          <p className="mt-2 text-sm text-[var(--color-ink-soft)]">{t(lang, "fuel.minishop")}</p>
        </div>

        {/* Bezkontaktní myčka */}
        <div className="bg-white border border-[var(--color-border)] rounded-2xl p-6">
          <div className="flex items-center justify-between gap-3">
            <span className="w-12 h-12 rounded-xl grid place-items-center text-white" style={{ background: "var(--color-accent)" }}>
              <WashIcon className="w-6 h-6" />
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{ background: "var(--color-accent)" }}>
              {t(lang, "fuel.nonstop")}
            </span>
          </div>
          <h2 className="mt-4 text-lg font-bold">{t(lang, "fuel.washTitle")}</h2>
          <p className="mt-2 text-sm text-[var(--color-ink-soft)] leading-relaxed">{t(lang, "fuel.washDesc")}</p>
        </div>
      </div>

      {/* Kontakt – provozovna PHM */}
      <section className="mt-8 bg-white border border-[var(--color-border)] rounded-2xl p-6">
        <h2 className="text-xl font-bold">{t(lang, "fuel.locationTitle")}</h2>
        <p className="mt-2 text-[var(--color-ink-soft)]">{t(lang, "fuel.locationDesc")}</p>
        <div className="mt-3 space-y-1 text-sm">
          <p>{t(lang, "fuel.contactPerson")}</p>
          <p>
            {t(lang, "cart.phone")}: <a href="tel:+420515244577" className="font-semibold text-[var(--color-accent)]">515 244 577</a>
            {" · "}
            <a href="tel:+420737285190" className="font-semibold text-[var(--color-accent)]">737 285 190</a>
          </p>
          <p>
            {t(lang, "cart.email")}: <a href="mailto:cseika@eika.cz" className="font-semibold text-[var(--color-accent)]">cseika@eika.cz</a>
          </p>
        </div>
      </section>
    </div>
  );
}
