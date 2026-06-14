import { formatCZK } from "@/lib/format";
import { RECENT_ORDERS, STATUS_COLORS } from "@/data/stats";

// Rozšířený demo seznam objednávek pro provozní pohled.
const ORDERS = [
  ...RECENT_ORDERS,
  { ref: "EIKA-204810", customer: "Truhlářství Horák", type: "Živnostník", total: 9320, status: "Hotovo" },
  { ref: "EIKA-204809", customer: "MěÚ Znojmo", type: "Firma", total: 54100, status: "Expedováno" },
  { ref: "EIKA-204808", customer: "Anna Marková", type: "Koncový", total: 760, status: "Hotovo" },
];

export default function AdminOrdersPage() {
  const statuses = ["Vše", "Nová", "Vyřizuje se", "Expedováno", "Hotovo"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Objednávky</h1>
        <p className="text-[var(--color-ink-soft)] text-sm">
          Správa a stavy objednávek
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {statuses.map((s, i) => (
          <button
            key={s}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition ${
              i === 0
                ? "text-white border-transparent"
                : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-accent)]"
            }`}
            style={i === 0 ? { background: "var(--color-steel-800)" } : undefined}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--color-ink-soft)] bg-[var(--color-bg)]">
                <th className="px-4 py-3 font-medium">Číslo</th>
                <th className="px-4 py-3 font-medium">Zákazník</th>
                <th className="px-4 py-3 font-medium">Typ</th>
                <th className="px-4 py-3 font-medium text-right">Částka</th>
                <th className="px-4 py-3 font-medium text-right">Stav</th>
                <th className="px-4 py-3 font-medium text-right">Akce</th>
              </tr>
            </thead>
            <tbody>
              {ORDERS.map((o) => (
                <tr key={o.ref} className="border-t border-[var(--color-border)] hover:bg-[var(--color-bg)]">
                  <td className="px-4 py-3 font-medium whitespace-nowrap">{o.ref}</td>
                  <td className="px-4 py-3">{o.customer}</td>
                  <td className="px-4 py-3 text-[var(--color-ink-soft)]">{o.type}</td>
                  <td className="px-4 py-3 text-right font-semibold">{formatCZK(o.total)}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[o.status]}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button className="text-[var(--color-ink-soft)] hover:text-[var(--color-accent)] font-medium">
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs text-[var(--color-ink-soft)]">
        Demo Fáze 1 — objednávky jsou ukázkové. Ve Fázi 2 se sem propíšou reálné
        objednávky z webu.
      </p>
    </div>
  );
}
