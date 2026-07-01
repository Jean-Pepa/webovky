import type { Metadata, Viewport } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "Mařena — studentský festival Fakulty architektury VUT",
  description:
    "Mařena je týdenní studentský festival na Fakultě architektury VUT v Brně. Přednášky, bar na dvoře, party večery, průvod městem a křest prváků na Flédě. Sleduj nás na Instagramu.",
  applicationName: "Mařena",
  // PWA — po „Přidat na plochu" se z webu stane appka (ikona kačenky, běží na celou obrazovku).
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Mařena",
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  // Kvůli starším iPhonům — ať se po „Přidat na plochu" appka otevře na celou obrazovku.
  other: { "apple-mobile-web-app-capable": "yes" },
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
