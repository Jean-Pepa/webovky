import type { Metadata } from "next";

// Zákaznický účet se neindexuje.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return children;
}
