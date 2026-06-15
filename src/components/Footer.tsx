import Link from "@/components/LocLink";
import { getLang } from "@/i18n/server";
import { t } from "@/i18n/messages";
import { locCategories } from "@/i18n/data";

export default async function Footer() {
  const lang = await getLang();
  const cats = locCategories(lang);
  return (
    <footer className="bg-[var(--color-bg)] text-[var(--color-ink-soft)]">
      <div className="mx-auto max-w-7xl px-5 py-10 text-xs leading-relaxed">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-8 border-b border-[var(--color-border)]">
          <div>
            <h4 className="text-[var(--color-ink)] font-semibold mb-3">{t(lang, "footer.range")}</h4>
            <ul className="space-y-2">
              {cats.map((c) => (
                <li key={c.slug}><Link href={`/katalog/${c.slug}`} className="hover:text-[var(--color-ink)]">{c.name}</Link></li>
              ))}
              <li><Link href="/katalog" className="hover:text-[var(--color-ink)]">{t(lang, "footer.fullCatalog")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[var(--color-ink)] font-semibold mb-3">{t(lang, "footer.shopping")}</h4>
            <ul className="space-y-2">
              <li><Link href="/kosik" className="hover:text-[var(--color-ink)]">{t(lang, "footer.cart")}</Link></li>
              <li><Link href="/oblibene" className="hover:text-[var(--color-ink)]">{t(lang, "nav.favorites")}</Link></li>
              <li><Link href="/admin" className="hover:text-[var(--color-ink)]">{t(lang, "footer.admin")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[var(--color-ink)] font-semibold mb-3">{t(lang, "pd.branch")} Brno</h4>
            <p>Vodařská 10, Horní Heršpice, Brno</p>
            <p className="mt-1"><a href="tel:+420545233742" className="hover:text-[var(--color-ink)]">545 233 742</a></p>
            <p><a href="mailto:brno@eika.cz" className="hover:text-[var(--color-ink)]">brno@eika.cz</a></p>
          </div>
          <div>
            <h4 className="text-[var(--color-ink)] font-semibold mb-3">{t(lang, "pd.branch")} Znojmo</h4>
            <p>Oblekovice, Znojmo</p>
            <p className="mt-1"><a href="mailto:info@eika.cz" className="hover:text-[var(--color-ink)]">info@eika.cz</a></p>
            <p className="mt-2"><Link href="/kontakt" className="hover:text-[var(--color-ink)]">{t(lang, "footer.allContacts")}</Link></p>
          </div>
        </div>
        <p className="pt-6">© {new Date().getFullYear()} EIKA ZNOJMO, a.s.</p>
      </div>
    </footer>
  );
}
