import { PRODUCTS, getCategory } from "@/data/catalog";
import { formatCZK } from "@/lib/format";

export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Produkty</h1>
          <p className="text-[var(--color-ink-soft)] text-sm">
            {PRODUCTS.length} položek v katalogu
          </p>
        </div>
        <button
          className="px-4 py-2 rounded-md font-semibold text-white text-sm"
          style={{ background: "var(--color-accent)" }}
        >
          + Přidat produkt
        </button>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--color-ink-soft)] bg-[var(--color-bg)]">
                <th className="px-4 py-3 font-medium">Kód</th>
                <th className="px-4 py-3 font-medium">Název</th>
                <th className="px-4 py-3 font-medium">Kategorie</th>
                <th className="px-4 py-3 font-medium text-right">Cena B2C</th>
                <th className="px-4 py-3 font-medium text-right">Cena B2B</th>
                <th className="px-4 py-3 font-medium text-right">Sklad</th>
                <th className="px-4 py-3 font-medium text-right">Akce</th>
              </tr>
            </thead>
            <tbody>
              {PRODUCTS.map((p) => (
                <tr key={p.slug} className="border-t border-[var(--color-border)] hover:bg-[var(--color-bg)]">
                  <td className="px-4 py-3 font-medium whitespace-nowrap">{p.sku}</td>
                  <td className="px-4 py-3">{p.name}</td>
                  <td className="px-4 py-3 text-[var(--color-ink-soft)]">
                    {getCategory(p.category)?.name}
                  </td>
                  <td className="px-4 py-3 text-right">{formatCZK(p.price)}</td>
                  <td className="px-4 py-3 text-right text-[var(--color-accent)] font-semibold">
                    {formatCZK(p.priceB2B)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={p.stock < 50 ? "text-[var(--color-warning)] font-semibold" : ""}>
                      {p.stock} {p.unit}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button className="text-[var(--color-ink-soft)] hover:text-[var(--color-accent)] font-medium">
                      Upravit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs text-[var(--color-ink-soft)]">
        Demo Fáze 1 — úpravy se zatím neukládají. Ve Fázi 2 napojíme na databázi.
      </p>
    </div>
  );
}
