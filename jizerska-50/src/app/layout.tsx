import type { Metadata, Viewport } from "next";
import "./globals.css";
import PwaRegister from "@/components/PwaRegister";

export const metadata: Metadata = {
  title: "Jizerská 50 — příprava bez sněhu",
  description:
    "Osobní 24týdenní plán přípravy na Jizerskou padesátku (klasika, únor 2027) bez běžek: běh, chůze s holemi, imitace, síla a body recomposition 98 → 85 kg.",
  applicationName: "Jizerská 50",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Jizerská 50",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0071e3",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body>
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
