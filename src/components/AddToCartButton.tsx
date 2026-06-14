"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/data/catalog";

export default function AddToCartButton({
  product,
  withQty = false,
}: {
  product: Product;
  withQty?: boolean;
}) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    add(
      {
        slug: product.slug,
        name: product.name,
        sku: product.sku,
        unit: product.unit,
        price: product.price,
      },
      qty
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  return (
    <div className="flex items-stretch gap-2">
      {withQty && (
        <div className="flex items-center border border-[var(--color-border)] rounded-md overflow-hidden">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-3 text-lg text-[var(--color-ink-soft)] hover:bg-[var(--color-bg)]"
            aria-label="Méně"
          >
            −
          </button>
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
            className="w-12 text-center outline-none"
          />
          <button
            onClick={() => setQty((q) => q + 1)}
            className="px-3 text-lg text-[var(--color-ink-soft)] hover:bg-[var(--color-bg)]"
            aria-label="Více"
          >
            +
          </button>
          <span className="px-2 text-sm text-[var(--color-ink-soft)] border-l border-[var(--color-border)]">
            {product.unit}
          </span>
        </div>
      )}
      <button
        onClick={handleAdd}
        className="flex-1 px-4 py-2 rounded-md text-sm font-semibold text-white transition active:scale-[0.98]"
        style={{ background: added ? "var(--color-success)" : "var(--color-accent)" }}
      >
        {added ? "✓ Přidáno" : "Do košíku"}
      </button>
    </div>
  );
}
