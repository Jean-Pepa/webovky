import Link from "next/link";
import { getLang } from "@/i18n/server";
import { t } from "@/i18n/messages";

const BRANCHES = [
  { city: "Brno", address: "Vodařská 10, Horní Heršpice, 619 00 Brno", phone: "545 233 742", tel: "+420545233742", email: "brno@eika.cz" },
  { city: "Znojmo", address: "Oblekovice, 671 81 Znojmo", phone: "—", tel: "", email: "info@eika.cz" },
];

export default async function ContactPage() {
  const lang = await getLang();
  const HOURS: [string, string][] = [
    [t(lang, "contact.mon_fri"), "7:00 – 16:00"],
    [t(lang, "contact.sat"), "8:00 – 11:00"],
    [t(lang, "contact.sun"), t(lang, "contact.closed")],
  ];

  return (
    <div>
      <div className="bg-[var(--color-steel-900)] text-white">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <nav className="text-sm text-[var(--color-steel-400)] mb-4">
            <Link href="/" className="hover:text-white">{t(lang, "crumb.home")}</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{t(lang, "nav.contact")}</span>
          </nav>
          <h1 className="text-4xl font-extrabold">{t(lang, "contact.title")}</h1>
          <p className="mt-3 max-w-xl text-[var(--color-steel-200)]">{t(lang, "contact.intro")}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 grid lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          {BRANCHES.map((b) => (
            <div key={b.city} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
              <h2 className="text-xl font-bold">{t(lang, "pd.branch")} {b.city}</h2>
              <p className="mt-2 text-[var(--color-ink-soft)]">{b.address}</p>
              <div className="mt-3 space-y-1 text-sm">
                {b.tel && (
                  <p>{t(lang, "cart.phone")}: <a href={`tel:${b.tel}`} className="font-semibold text-[var(--color-accent)]">{b.phone}</a></p>
                )}
                <p>{t(lang, "cart.email")}: <a href={`mailto:${b.email}`} className="font-semibold text-[var(--color-accent)]">{b.email}</a></p>
              </div>
            </div>
          ))}

          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
            <h2 className="text-xl font-bold mb-3">{t(lang, "contact.hours")}</h2>
            <dl className="space-y-2 text-sm">
              {HOURS.map(([d, h]) => (
                <div key={d} className="flex justify-between">
                  <dt className="text-[var(--color-ink-soft)]">{d}</dt>
                  <dd className="font-semibold">{h}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 h-fit">
          <h2 className="text-xl font-bold mb-1">{t(lang, "contact.write")}</h2>
          <p className="text-sm text-[var(--color-ink-soft)] mb-5">{t(lang, "contact.formIntro")}</p>
          <form className="space-y-4">
            <input placeholder={t(lang, "cart.companyOrName")} className="w-full px-3 py-2 rounded-md border border-[var(--color-border)] outline-none focus:border-[var(--color-accent)]" />
            <input type="email" placeholder={t(lang, "cart.email")} className="w-full px-3 py-2 rounded-md border border-[var(--color-border)] outline-none focus:border-[var(--color-accent)]" />
            <input type="tel" placeholder={t(lang, "cart.phone")} className="w-full px-3 py-2 rounded-md border border-[var(--color-border)] outline-none focus:border-[var(--color-accent)]" />
            <textarea rows={4} placeholder={t(lang, "cart.note")} className="w-full px-3 py-2 rounded-md border border-[var(--color-border)] outline-none focus:border-[var(--color-accent)]" />
            <button type="button" className="w-full py-3 rounded-full font-semibold text-white" style={{ background: "var(--color-accent)" }}>
              {t(lang, "contact.send")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
