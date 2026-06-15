import type { Metadata } from "next";
import AccountShell from "@/components/account/AccountShell";
import { getLang } from "@/i18n/server";
import { t } from "@/i18n/messages";
import { formatCZK } from "@/lib/format";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AccountOrdersPage() {
  const lang = await getLang();

  // Ukázková data – po nasazení backendu se nahradí reálnými objednávkami
  const orders = [
    { no: "EIKA-240312", date: "12. 3. 2024", total: 18420, state: t(lang, "acc.stDelivered") },
    { no: "EIKA-240128", date: "28. 1. 2024", total: 6540, state: t(lang, "acc.stShipped") },
    { no: "EIKA-231119", date: "19. 11. 2023", total: 31280, state: t(lang, "acc.stDelivered") },
  ];

  return (
    <AccountShell active="objednavky">
      <h1 className="text-2xl font-extrabold">{t(lang, "acc.orders")}</h1>
      <p className="mt-1 text-sm text-[var(--color-ink-soft)]">{t(lang, "acc.ordersDemo")}</p>

      <div className="mt-5 overflow-x-auto bg-white border border-[var(--color-border)] rounded-2xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[var(--color-ink-soft)] border-b border-[var(--color-border)]">
              <th className="px-4 py-3 font-semibold">{t(lang, "acc.orderNo")}</th>
              <th className="px-4 py-3 font-semibold">{t(lang, "acc.orderDate")}</th>
              <th className="px-4 py-3 font-semibold">{t(lang, "acc.orderTotal")}</th>
              <th className="px-4 py-3 font-semibold">{t(lang, "acc.orderState")}</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.no} className="border-b border-[var(--color-border)] last:border-0">
                <td className="px-4 py-3 font-semibold">{o.no}</td>
                <td className="px-4 py-3 text-[var(--color-ink-soft)]">{o.date}</td>
                <td className="px-4 py-3">{formatCZK(o.total)}</td>
                <td className="px-4 py-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--color-bg)]">{o.state}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AccountShell>
  );
}
