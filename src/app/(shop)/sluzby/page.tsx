import type { Metadata } from "next";
import Link from "@/components/LocLink";
import BackButton from "@/components/BackButton";
import {
  BeamIcon,
  TruckIcon,
  FuelIcon,
  WashIcon,
  ShieldIcon,
  GrapeIcon,
  BoxesIcon,
} from "@/components/Icons";
import { getLang } from "@/i18n/server";
import { t } from "@/i18n/messages";
import { altLinks } from "@/i18n/seo";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return {
    title: t(lang, "sluzby.title"),
    description: t(lang, "sluzby.intro"),
    alternates: altLinks(lang, "/sluzby"),
  };
}

export default async function ServicesPage() {
  const lang = await getLang();

  const services = [
    { icon: BeamIcon, title: t(lang, "sluzby.cutTitle"), desc: t(lang, "sluzby.cutDesc") },
    { icon: TruckIcon, title: t(lang, "sluzby.transportTitle"), desc: t(lang, "sluzby.transportDesc") },
    { icon: FuelIcon, title: t(lang, "sluzby.fuelTitle"), desc: t(lang, "sluzby.fuelDesc"), href: "/cerpaci-stanice" },
    { icon: WashIcon, title: t(lang, "sluzby.washTitle"), desc: t(lang, "sluzby.washDesc"), href: "/cerpaci-stanice" },
    { icon: ShieldIcon, title: t(lang, "sluzby.adviceTitle"), desc: t(lang, "sluzby.adviceDesc") },
    { icon: GrapeIcon, title: t(lang, "sluzby.viticultureTitle"), desc: t(lang, "sluzby.viticultureDesc") },
    { icon: BoxesIcon, title: t(lang, "sluzby.b2bTitle"), desc: t(lang, "sluzby.b2bDesc") },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center gap-3 mb-5">
        <BackButton />
        <nav className="text-sm text-[var(--color-ink-soft)]">
          <Link href="/" className="hover:text-[var(--color-accent)]">{t(lang, "crumb.home")}</Link>
          <span className="mx-2">/</span>
          <span>{t(lang, "sluzby.title")}</span>
        </nav>
      </div>

      <h1 className="text-4xl font-extrabold">{t(lang, "sluzby.title")}</h1>
      <p className="mt-3 text-lg text-[var(--color-ink-soft)] max-w-3xl">{t(lang, "sluzby.intro")}</p>

      <div className="mt-8 grid sm:grid-cols-2 gap-5">
        {services.map((s, i) => {
          const Icon = s.icon;
          const inner = (
            <>
              <span className="w-12 h-12 rounded-xl grid place-items-center text-white" style={{ background: "var(--color-accent)" }}>
                <Icon className="w-6 h-6" />
              </span>
              <h2 className="mt-4 text-lg font-bold group-hover:text-[var(--color-accent)] transition">{s.title}</h2>
              <p className="mt-2 text-sm text-[var(--color-ink-soft)] leading-relaxed">{s.desc}</p>
              {s.href && <span className="mt-3 inline-block text-sm font-semibold text-[var(--color-accent)]">{t(lang, "footer.allContacts")}</span>}
            </>
          );
          const cls = "group bg-white border border-[var(--color-border)] rounded-2xl p-6 hover:shadow-md transition";
          return s.href ? (
            <Link key={i} href={s.href} className={cls}>{inner}</Link>
          ) : (
            <div key={i} className={cls}>{inner}</div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="mt-12 rounded-2xl bg-[var(--color-steel-900)] text-white p-8 text-center">
        <h2 className="text-2xl font-bold">{t(lang, "sluzby.ctaTitle")}</h2>
        <p className="mt-2 text-[var(--color-steel-200)]">{t(lang, "sluzby.ctaDesc")}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/poptavka" className="px-6 py-3 rounded-full font-semibold text-white" style={{ background: "var(--color-accent)" }}>
            {t(lang, "nav.inquiry")}
          </Link>
          <Link href="/kontakt" className="px-6 py-3 rounded-full font-semibold bg-white text-[var(--color-ink)]">
            {t(lang, "nav.contact")}
          </Link>
        </div>
      </div>
    </div>
  );
}
