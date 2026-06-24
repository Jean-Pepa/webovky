import type { Metadata, Viewport } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "Mařena — studentský festival Fakulty architektury VUT",
  description:
    "Mařena je týdenní studentský festival na Fakultě architektury VUT v Brně. Přednášky, bar na dvoře, party večery, průvod městem a křest prváků na Flédě. Sleduj nás na Instagramu.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      {/* Používáme systémový font (SF Pro / Segoe UI / Roboto) — žádné externí načítání. */}
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
