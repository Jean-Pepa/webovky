import type { Metadata, Viewport } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "Dovča — kdy spolu vyrazíme",
  description:
    "Společný plánovač dovolené pro partu. Každý naklikáš, kdy nemůžeš, a appka najde termíny, kdy se vás sejde nejvíc.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0c7e8e",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
