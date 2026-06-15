"use client";

import Link from "@/components/LocLink";
import { useFavorites } from "@/context/FavoritesContext";
import { getProducts } from "@/data/catalog";
import ProductCard from "@/components/ProductCard";
import { HeartIcon } from "@/components/Icons";
import { useI18n } from "@/i18n/context";

export default function FavoritesPage() {
  const { slugs } = useFavorites();
  const { t } = useI18n();
  const products = getProducts(slugs);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold flex items-center gap-3">
        <HeartIcon className="w-7 h-7 text-[var(--color-accent)]" filled />
        {t("fav.title")}
      </h1>

      {products.length === 0 ? (
        <div className="py-16 text-center text-[var(--color-ink-soft)]">
          <p className="text-lg">{t("fav.empty")}</p>
          <p className="mt-1 text-sm">{t("fav.emptyHint")}</p>
          <Link
            href="/katalog"
            className="inline-block mt-6 px-6 py-3 rounded-md font-semibold text-white"
            style={{ background: "var(--color-accent)" }}
          >
            {t("cart.browse")}
          </Link>
        </div>
      ) : (
        <>
          <p className="text-[var(--color-ink-soft)] mt-1 mb-8">
            {products.length} {t("count.products")}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
