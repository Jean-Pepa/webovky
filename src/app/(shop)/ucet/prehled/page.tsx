import type { Metadata } from "next";
import Link from "@/components/LocLink";
import AccountShell from "@/components/account/AccountShell";
import { ClipboardIcon, HeartIcon, StarBadgeIcon } from "@/components/Icons";
import { getLang } from "@/i18n/server";
import { t } from "@/i18n/messages";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AccountOverviewPage() {
  const lang = await getLang();

  const stats = [
    { icon: ClipboardIcon, label: t(lang, "acc.ordersCount"), value: "3", href: "/ucet/objednavky" },
    { icon: HeartIcon, label: t(lang, "acc.favCount"), value: "5", href: "/oblibene" },
    { icon: StarBadgeIcon, label: t(lang, "acc.b2bStatus"), value: t(lang, "acc.active"), href: "/ucet/udaje" },
  ];

  return (
    <AccountShell active="prehled">
      <h1 className="text-2xl font-extrabold">{t(lang, "acc.welcome")}, Jan 👋</h1>
      <p className="mt-1 text-[var(--color-ink-soft)]">{t(lang, "acc.overviewSub")}</p>

      <div className="mt-6 grid sm:grid-cols-3 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <Link key={i} href={s.href} className="bg-white border border-[var(--color-border)] rounded-2xl p-5 hover:shadow-md transition">
              <span className="w-10 h-10 rounded-xl grid place-items-center text-white" style={{ background: "var(--color-accent)" }}>
                <Icon className="w-5 h-5" />
              </span>
              <div className="mt-3 text-2xl font-extrabold">{s.value}</div>
              <div className="text-sm text-[var(--color-ink-soft)]">{s.label}</div>
            </Link>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/katalog" className="px-5 py-2.5 rounded-full font-semibold text-white" style={{ background: "var(--color-accent)" }}>
          {t(lang, "nav.onlineShop")}
        </Link>
        <Link href="/ucet/objednavky" className="px-5 py-2.5 rounded-full font-semibold border border-[var(--color-border)] hover:border-[var(--color-accent)] transition">
          {t(lang, "acc.orders")}
        </Link>
      </div>
    </AccountShell>
  );
}
