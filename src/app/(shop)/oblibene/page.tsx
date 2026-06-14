"use client";

import Link from "next/link";
import { useFavorites } from "@/context/FavoritesContext";
import { getProducts } from "@/data/catalog";
import ProductCard from "@/components/ProductCard";
import { HeartIcon } from "@/components/Icons";

export default function FavoritesPage() {
  const { slugs } = useFavorites();
  const products = getProducts(slugs);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold flex items-center gap-3">
        <HeartIcon className="w-7 h-7 text-[var(--color-accent)]" filled />
        Oblíbené
      </h1>

      {products.length === 0 ? (
        <div className="py-16 text-center text-[var(--color-ink-soft)]">
          <p className="text-lg">Zatím nemáte žádné oblíbené zboží.</p>
          <p className="mt-1 text-sm">
            Klikněte na srdíčko u produktu a uložíte si ho sem na později.
          </p>
          <Link
            href="/katalog"
            className="inline-block mt-6 px-6 py-3 rounded-md font-semibold text-white"
            style={{ background: "var(--color-accent)" }}
          >
            Procházet katalog
          </Link>
        </div>
      ) : (
        <>
          <p className="text-[var(--color-ink-soft)] mt-1 mb-8">
            {products.length} {products.length === 1 ? "položka" : "položek"}
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
