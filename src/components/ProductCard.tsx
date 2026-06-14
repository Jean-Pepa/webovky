import Link from "next/link";
import type { Product } from "@/data/catalog";
import { formatCZK } from "@/lib/format";
import ProductThumb from "./ProductThumb";
import AddToCartButton from "./AddToCartButton";

export default function ProductCard({ product }: { product: Product }) {
  const inStock = product.stock > 0;
  return (
    <div className="group bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-0.5 transition">
      <Link href={`/produkt/${product.slug}`} className="block">
        <ProductThumb category={product.category} className="aspect-[4/3]" />
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <span className="text-[11px] uppercase tracking-wide text-[var(--color-ink-soft)]">
          {product.subcategory}
        </span>
        <Link href={`/produkt/${product.slug}`}>
          <h3 className="mt-1 font-semibold leading-snug group-hover:text-[var(--color-accent)] transition">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-center gap-2 text-xs">
          <span className="text-[var(--color-ink-soft)]">Kód: {product.sku}</span>
          <span
            className={`ml-auto px-2 py-0.5 rounded-full font-medium ${
              inStock
                ? "text-[var(--color-success)] bg-green-50"
                : "text-[var(--color-warning)] bg-amber-50"
            }`}
          >
            {inStock ? `Skladem ${product.stock} ${product.unit}` : "Na dotaz"}
          </span>
        </div>

        <div className="mt-3 flex items-end justify-between">
          <div>
            <div className="text-xl font-extrabold">
              {formatCZK(product.price)}
            </div>
            <div className="text-[11px] text-[var(--color-ink-soft)]">
              za {product.unit} · bez DPH
            </div>
          </div>
        </div>

        <div className="mt-4">
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
