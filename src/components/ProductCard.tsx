import Link from "next/link";
import type { Product } from "@/data/catalog";
import { formatCZK } from "@/lib/format";
import ProductThumb from "./ProductThumb";
import AddToCartButton from "./AddToCartButton";
import Stars from "./Stars";
import Badges, { discountPercent } from "./Badges";
import FavoriteButton from "./FavoriteButton";

export default function ProductCard({ product }: { product: Product }) {
  const inStock = product.stock > 0;
  const discount = discountPercent(product.price, product.originalPrice);

  return (
    <div className="group relative bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden flex flex-col hover:shadow-lg hover:border-[var(--color-steel-200)] transition">
      {/* Top overlay: badges + favorite */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-start justify-between">
        <Badges badges={product.badges} />
        <FavoriteButton slug={product.slug} className="w-8 h-8 shrink-0" />
      </div>

      <Link href={`/produkt/${product.slug}`} className="block">
        <ProductThumb category={product.category} className="aspect-[4/3]" />
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <span className="text-[11px] uppercase tracking-wide text-[var(--color-ink-soft)]">
          {product.brand}
        </span>
        <Link href={`/produkt/${product.slug}`}>
          <h3 className="mt-0.5 font-semibold leading-snug line-clamp-2 min-h-[2.6em] group-hover:text-[var(--color-accent)] transition">
            {product.name}
          </h3>
        </Link>

        <div className="mt-1.5">
          <Stars rating={product.rating} count={product.ratingCount} />
        </div>

        <div
          className={`mt-2 inline-flex items-center gap-1.5 text-xs font-medium ${
            inStock ? "text-[var(--color-success)]" : "text-[var(--color-warning)]"
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${inStock ? "bg-[var(--color-success)]" : "bg-[var(--color-warning)]"}`} />
          {inStock ? `Skladem ${product.stock} ${product.unit}` : "Na dotaz"}
        </div>

        <div className="mt-auto pt-3">
          <div className="flex items-end gap-2">
            <span className="text-xl font-extrabold">{formatCZK(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-[var(--color-ink-soft)] line-through mb-0.5">
                {formatCZK(product.originalPrice)}
              </span>
            )}
            {discount && (
              <span className="mb-0.5 px-1.5 py-0.5 rounded text-[11px] font-bold text-white bg-[var(--color-accent)]">
                −{discount}%
              </span>
            )}
          </div>
          <div className="text-[11px] text-[var(--color-ink-soft)]">
            za {product.unit} · bez DPH
          </div>

          <div className="mt-3">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
