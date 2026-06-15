import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Domovní pas — historie vaší nemovitosti",
  description:
    "Trvalý, přenositelný záznam stavu a historie vaší nemovitosti. Opravy, závady, revize, dokumenty a fotky na jednom místě — a při prodeji se převede na nového majitele.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  );
}
