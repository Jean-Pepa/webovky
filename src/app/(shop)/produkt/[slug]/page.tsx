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
import AddToCartButton from "@/components/AddToCartButton";

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

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="text-sm text-[var(--color-ink-soft)] mb-6">
        <Link href="/" className="hover:text-[var(--color-accent)]">Úvod</Link>
        <span className="mx-2">/</span>
        <Link href="/katalog" className="hover:text-[var(--color-accent)]">Katalog</Link>
        <span className="mx-2">/</span>
        <Link href={`/katalog/${category.slug}`} className="hover:text-[var(--color-accent)]">
          {category.name}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--color-ink)]">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10">
        <ProductThumb
          category={product.category}
          className="aspect-square rounded-2xl"
        />

        <div>
          <span className="text-xs uppercase tracking-wide text-[var(--color-ink-soft)]">
            {product.subcategory}
          </span>
          <h1 className="mt-1 text-3xl font-extrabold">{product.name}</h1>

          <div className="mt-3 flex items-center gap-3 text-sm">
            <span className="text-[var(--color-ink-soft)]">Kód: {product.sku}</span>
            <span
              className={`px-2 py-0.5 rounded-full font-medium ${
                inStock
                  ? "text-[var(--color-success)] bg-green-50"
                  : "text-[var(--color-warning)] bg-amber-50"
              }`}
            >
              {inStock ? `Skladem ${product.stock} ${product.unit}` : "Na dotaz"}
            </span>
          </div>

          <div className="mt-6 p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
            <div className="flex items-end gap-3">
              <span className="text-3xl font-extrabold">{formatCZK(product.price)}</span>
              <span className="text-sm text-[var(--color-ink-soft)] mb-1">
                / {product.unit} · bez DPH
              </span>
            </div>
            <div className="text-sm text-[var(--color-ink-soft)] mt-1">
              {formatCZK(withVat(product.price))} s DPH
            </div>

            <div className="mt-3 flex items-center gap-2 text-sm p-3 rounded-lg bg-[var(--color-bg)]">
              <span className="font-semibold text-[var(--color-accent)]">
                Firemní cena {formatCZK(product.priceB2B)}
              </span>
              <span className="text-[var(--color-ink-soft)]">/ {product.unit} — pro firmy a živnostníky po přihlášení</span>
            </div>

            <div className="mt-5">
              <AddToCartButton product={product} withQty />
            </div>
          </div>

          <div className="mt-6">
            <h2 className="font-semibold mb-2">Popis</h2>
            <p className="text-[var(--color-ink-soft)] leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
              <div className="text-[var(--color-ink-soft)]">Měrná jednotka</div>
              <div className="font-semibold">{product.unit}</div>
            </div>
            <div className="p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
              <div className="text-[var(--color-ink-soft)]">Kategorie</div>
              <div className="font-semibold">{category.name}</div>
            </div>
          </div>
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
