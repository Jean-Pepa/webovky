import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jizerská 50 — příprava bez sněhu",
  description:
    "Osobní 24týdenní plán přípravy na Jizerskou padesátku (klasika, únor 2027) bez běžek: běh, chůze s holemi, imitace, síla a body recomposition 98 → 85 kg.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0071e3",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  );
}
