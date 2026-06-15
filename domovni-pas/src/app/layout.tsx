import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "BULO — historie vaší nemovitosti",
  description:
    "Trvalý záznam stavu a historie vaší nemovitosti — opravy, závady, revize, dokumenty a fotky na jednom místě.",
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
