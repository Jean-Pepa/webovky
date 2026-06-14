import Link from "next/link";
import BackButton from "@/components/BackButton";
import { StarBadgeIcon, BoxesIcon, TruckIcon, CategoryIcon } from "@/components/Icons";
import { getLang } from "@/i18n/server";
import { t } from "@/i18n/messages";
import { locCategories } from "@/i18n/data";

const BRANCHES = [
  { city: "Brno", address: "Vodařská 10, Horní Heršpice, 619 00 Brno", phone: "545 233 742", tel: "+420545233742", email: "brno@eika.cz" },
  { city: "Znojmo", address: "Oblekovice, 671 81 Znojmo", phone: "", tel: "", email: "info@eika.cz" },
];

export default async function AboutPage() {
  const lang = await getLang();
  const cats = locCategories(lang);

  const stats = [
    { icon: StarBadgeIcon, h: t(lang, "stat.h1"), s: t(lang, "stat.s1") },
    { icon: BoxesIcon, h: t(lang, "stat.h2"), s: t(lang, "stat.s2") },
    { icon: TruckIcon, h: t(lang, "stat.h3"), s: t(lang, "stat.s3") },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-center gap-3 mb-5">
        <BackButton />
        <nav className="text-sm text-[var(--color-ink-soft)]">
          <Link href="/" className="hover:text-[var(--color-accent)]">{t(lang, "crumb.home")}</Link>
          <span className="mx-2">/</span>
          <span>{t(lang, "about.title")}</span>
        </nav>
      </div>

      <h1 className="text-4xl font-extrabold">{t(lang, "about.title")}</h1>
      <p className="mt-3 text-lg text-[var(--color-ink-soft)]">{t(lang, "about.intro")}</p>

      {/* Statistiky */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((st, i) => {
          const Icon = st.icon;
          return (
            <div key={i} className="bg-white border border-[var(--color-border)] rounded-2xl p-5 text-center">
              <Icon className="w-10 h-10 mx-auto text-[var(--color-accent)]" />
              <div className="mt-2 font-bold text-[var(--color-accent)]">{st.h}</div>
              <div className="text-sm text-[var(--color-ink-soft)] mt-0.5">{st.s}</div>
            </div>
          );
        })}
      </div>

      {/* Historie */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold">{t(lang, "about.historyTitle")}</h2>
        <p className="mt-3 text-[var(--color-ink-soft)] leading-relaxed">{t(lang, "about.historyText")}</p>
      </section>

      {/* Co nabízíme */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-5">{t(lang, "about.offerTitle")}</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {cats.map((c) => (
            <Link key={c.slug} href={`/katalog/${c.slug}`} className="group bg-white border border-[var(--color-border)] rounded-2xl p-5 hover:shadow-md transition">
              <span className="w-12 h-12 rounded-xl grid place-items-center text-white" style={{ background: "var(--color-accent)" }}>
                <CategoryIcon icon={c.icon} className="w-6 h-6" />
              </span>
              <h3 className="mt-3 font-bold group-hover:text-[var(--color-accent)] transition">{c.name}</h3>
              <p className="mt-1 text-sm text-[var(--color-ink-soft)]">{c.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Kam dodáváme */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold">{t(lang, "about.deliveryTitle")}</h2>
        <p className="mt-3 text-[var(--color-ink-soft)] leading-relaxed">{t(lang, "about.deliveryText")}</p>
      </section>

      {/* Pobočky */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-5">{t(lang, "about.branchesTitle")}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {BRANCHES.map((b) => (
            <div key={b.city} className="bg-white border border-[var(--color-border)] rounded-2xl p-6">
              <h3 className="text-xl font-bold">{t(lang, "pd.branch")} {b.city}</h3>
              <p className="mt-2 text-[var(--color-ink-soft)]">{b.address}</p>
              <div className="mt-2 text-sm">
                {b.tel && (
                  <p>{t(lang, "cart.phone")}: <a href={`tel:${b.tel}`} className="font-semibold text-[var(--color-accent)]">{b.phone}</a></p>
                )}
                <p>{t(lang, "cart.email")}: <a href={`mailto:${b.email}`} className="font-semibold text-[var(--color-accent)]">{b.email}</a></p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="mt-12 flex flex-wrap gap-3">
        <Link href="/katalog" className="px-6 py-3 rounded-full text-white font-semibold" style={{ background: "var(--color-accent)" }}>
          {t(lang, "cart.browse")}
        </Link>
        <Link href="/kontakt" className="px-6 py-3 rounded-full font-semibold border border-[var(--color-border)] hover:border-[var(--color-accent)] transition">
          {t(lang, "nav.contact")}
        </Link>
      </div>
    </div>
  );
}
