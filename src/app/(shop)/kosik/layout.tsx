import type { Metadata } from "next";

// Košík je transakční stránka – nemá smysl ji indexovat.
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
