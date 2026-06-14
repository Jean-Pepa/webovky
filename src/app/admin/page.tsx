import { formatCZK } from "@/lib/format";
import { PRODUCTS } from "@/data/catalog";
import {
  REVENUE_BY_MONTH,
  TOP_PRODUCTS,
  CUSTOMER_SPLIT,
  RECENT_ORDERS,
  STATUS_COLORS,
} from "@/data/stats";

export default function AdminDashboard() {
  const maxRevenue = Math.max(...REVENUE_BY_MONTH.map((m) => m.value));
  const thisMonth = REVENUE_BY_MONTH[REVENUE_BY_MONTH.length - 1].value;
  const lowStock = PRODUCTS.filter((p) => p.stock < 50).length;

  const kpis = [
    { label: "Tržby tento měsíc", value: formatCZK(thisMonth), sub: "+12 % vs. minulý" },
    { label: "Objednávky (měsíc)", value: "184", sub: "+8 %" },
    { label: "Průměrná objednávka", value: formatCZK(3625), sub: "+3 %" },
    { label: "Skladem málo položek", value: String(lowStock), sub: "vyžaduje doplnění" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Přehled provozu</h1>
        <p className="text-[var(--color-ink-soft)] text-sm">
          Souhrn objednávek, tržeb a sortimentu (demo data)
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5">
            <div className="text-sm text-[var(--color-ink-soft)]">{k.label}</div>
            <div className="mt-1 text-2xl font-extrabold">{k.value}</div>
            <div className="mt-1 text-xs font-medium text-[var(--color-success)]">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
          <h2 className="font-bold">Tržby podle měsíců</h2>
          <div className="mt-6 flex items-end gap-4 h-52">
            {REVENUE_BY_MONTH.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="text-[11px] font-semibold text-[var(--color-ink-soft)]">
                  {Math.round(m.value / 1000)}k
                </div>
                <div className="w-full bg-[var(--color-bg)] rounded-t-md flex items-end" style={{ height: "100%" }}>
                  <div
                    className="w-full rounded-t-md transition-all"
                    style={{
                      height: `${(m.value / maxRevenue) * 100}%`,
                      background: "var(--color-accent)",
                    }}
                  />
                </div>
                <div className="text-xs text-[var(--color-ink-soft)]">{m.month}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer split */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
          <h2 className="font-bold">Objednávky dle zákazníka</h2>
          <div className="mt-5 space-y-4">
            {CUSTOMER_SPLIT.map((c) => (
              <div key={c.type}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{c.type}</span>
                  <span className="text-[var(--color-ink-soft)]">{c.share} %</span>
                </div>
                <div className="h-2.5 rounded-full bg-[var(--color-bg)] overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${c.share}%`, background: c.color }} />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs text-[var(--color-ink-soft)]">
            Většinu obratu tvoří firmy a živnostníci — proto je objednávání pro
            ně optimalizováno (firemní ceny, opakování objednávek).
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
          <h2 className="font-bold mb-4">Poslední objednávky</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[var(--color-ink-soft)] border-b border-[var(--color-border)]">
                  <th className="pb-2 font-medium">Číslo</th>
                  <th className="pb-2 font-medium">Zákazník</th>
                  <th className="pb-2 font-medium">Typ</th>
                  <th className="pb-2 font-medium text-right">Částka</th>
                  <th className="pb-2 font-medium text-right">Stav</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_ORDERS.map((o) => (
                  <tr key={o.ref} className="border-b border-[var(--color-border)] last:border-0">
                    <td className="py-3 font-medium">{o.ref}</td>
                    <td className="py-3">{o.customer}</td>
                    <td className="py-3 text-[var(--color-ink-soft)]">{o.type}</td>
                    <td className="py-3 text-right font-semibold">{formatCZK(o.total)}</td>
                    <td className="py-3 text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[o.status]}`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top products */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
          <h2 className="font-bold mb-4">Nejprodávanější</h2>
          <ul className="space-y-3">
            {TOP_PRODUCTS.map((p, idx) => (
              <li key={p.sku} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded grid place-items-center text-xs font-bold text-white shrink-0" style={{ background: "var(--color-steel-700)" }}>
                  {idx + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{p.name}</div>
                  <div className="text-xs text-[var(--color-ink-soft)]">{p.sku}</div>
                </div>
                <div className="text-sm font-semibold whitespace-nowrap">
                  {p.sold} {p.unit}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
