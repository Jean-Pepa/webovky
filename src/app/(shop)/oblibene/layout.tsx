import type { Metadata } from "next";

// Oblíbené jsou osobní seznam uživatele – neindexovat.
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function FavoritesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
