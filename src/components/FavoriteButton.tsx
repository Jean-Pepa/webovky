"use client";

import { useFavorites } from "@/context/FavoritesContext";
import { HeartIcon } from "./Icons";

export default function FavoriteButton({
  slug,
  className = "",
}: {
  slug: string;
  className?: string;
}) {
  const { has, toggle } = useFavorites();
  const active = has(slug);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      aria-label={active ? "Odebrat z oblíbených" : "Přidat do oblíbených"}
      className={`grid place-items-center rounded-full bg-white/90 backdrop-blur border border-[var(--color-border)] transition hover:scale-105 ${
        active ? "text-[var(--color-accent)]" : "text-[var(--color-ink-soft)]"
      } ${className}`}
    >
      <HeartIcon className="w-4.5 h-4.5" filled={active} />
    </button>
  );
}
