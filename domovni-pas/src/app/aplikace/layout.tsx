import type { Metadata, Viewport } from "next";
import "./bulo.css";

export const metadata: Metadata = {
  title: "BULO · Pas domu",
  description: "Celý dům na jednom místě: výkresy, dokumenty, 3D model, hlídače, termíny a zápisy techniků.",
  appleWebApp: { capable: true, title: "BULO", statusBarStyle: "default" },
  icons: { apple: "/aplikace/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F2F0ED",
};

export default function AplikaceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
