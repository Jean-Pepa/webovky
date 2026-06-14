import Link from "next/link";
import { notFound } from "next/navigation";
import {
  PRODUCTS,
  getProduct,
  getCategory,
  productsByCategory,
} from "@/data/catalog";
import { formatCZK, withVat } from "@/lib/format";
import ProductThumb from "@/components/ProductThumb";
import ProductCard from "@/components/ProductCard";
import ProductTabs from "@/components/ProductTabs";
import AddToCartButton from "@/components/AddToCartButton";
import FavoriteButton from "@/components/FavoriteButton";
import Stars from "@/components/Stars";
import Badges, { discountPercent } from "@/components/Badges";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = getCategory(product.category)!;
  const related = productsByCategory(product.category)
    .filter((p) => p.slug !== product.slug)
    .slice(0, 4);
  const inStock = product.stock > 0;
  const discount = discountPercent(product.price, product.originalPrice);
  const brnoStock = Math.ceil(product.stock * 0.6);
  const znojmoStock = product.stock - brnoStock;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <nav className="text-sm text-[var(--color-ink-soft)] mb-5">
        <Link href="/" className="hover:text-[var(--color-accent)]">Úvod</Link>
        <span className="mx-2">/</span>
        <Link href="/katalog" className="hover:text-[var(--color-accent)]">Katalog</Link>
        <span className="mx-2">/</span>
        <Link href={`/katalog/${category.slug}`} className="hover:text-[var(--color-accent)]">{category.name}</Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--color-ink)]">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8">
        {/* LEFT: gallery + info */}
        <div>
          <div className="grid sm:grid-cols-[88px_1fr] gap-3">
            {/* Thumbnails */}
            <div className="hidden sm:flex flex-col gap-3 order-1">
              {[0, 1, 2].map((i) => (
                <ProductThumb
                  key={i}
                  category={product.category}
                  className="aspect-square rounded-lg border border-[var(--color-border)]"
                />
              ))}
            </div>
            {/* Main image */}
            <div className="relative order-2">
              <div className="absolute top-3 left-3 z-10">
                <Badges badges={product.badges} />
              </div>
              <FavoriteButton slug={product.slug} className="absolute top-3 right-3 z-10 w-10 h-10" />
              <ProductThumb category={product.category} className="aspect-square rounded-2xl" />
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-8">
            <ProductTabs
              description={product.description}
              params={product.params}
              rating={product.rating}
              ratingCount={product.ratingCount}
            />
          </div>
        </div>

        {/* RIGHT: purchase box (sticky) */}
        <div className="lg:sticky lg:top-28 h-fit space-y-4">
          <div>
            <span className="text-xs uppercase tracking-wide text-[var(--color-ink-soft)]">
              {product.brand} · {product.subcategory}
            </span>
            <h1 className="mt-1 text-2xl font-extrabold leading-tight">{product.name}</h1>
            <div className="mt-2 flex items-center gap-3">
              <Stars rating={product.rating} count={product.ratingCount} />
              <span className="text-xs text-[var(--color-ink-soft)]">Kód: {product.sku}</span>
            </div>
          </div>

          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5">
            <div className="flex items-end gap-2">
              <span className="text-3xl font-extrabold">{formatCZK(product.price)}</span>
              {product.originalPrice && (
                <span className="text-base text-[var(--color-ink-soft)] line-through mb-1">
                  {formatCZK(product.originalPrice)}
                </span>
              )}
              {discount && (
                <span className="mb-1.5 px-2 py-0.5 rounded text-xs font-bold text-white bg-[var(--color-accent)]">
                  −{discount}%
                </span>
              )}
            </div>
            <div className="text-sm text-[var(--color-ink-soft)]">
              {formatCZK(withVat(product.price))} s DPH · za {product.unit}
            </div>

            <div className="mt-3 flex items-center gap-2 text-sm p-2.5 rounded-lg bg-[var(--color-bg)]">
              <span className="font-bold text-[var(--color-accent)]">
                Firemní cena {formatCZK(product.priceB2B)}
              </span>
              <span className="text-[var(--color-ink-soft)] text-xs">pro firmy a živnostníky</span>
            </div>

            <div
              className={`mt-4 inline-flex items-center gap-2 text-sm font-semibold ${
                inStock ? "text-[var(--color-success)]" : "text-[var(--color-warning)]"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${inStock ? "bg-[var(--color-success)]" : "bg-[var(--color-warning)]"}`} />
              {inStock ? `Skladem ${product.stock} ${product.unit}` : "Na dotaz"}
            </div>

            <div className="mt-4">
              <AddToCartButton product={product} withQty />
            </div>
          </div>

          {/* Branch availability */}
          {inStock && (
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5">
              <h3 className="text-sm font-semibold mb-3">Dostupnost na pobočkách</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Pobočka Brno</span>
                  <span className="text-[var(--color-success)] font-medium">{brnoStock} {product.unit} skladem</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Pobočka Znojmo</span>
                  <span className="text-[var(--color-success)] font-medium">{znojmoStock} {product.unit} skladem</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Související zboží</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
