import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { CookieConsent } from "@/components/CookieConsent";
import { LanguageProvider } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "BULO — historie vaší nemovitosti",
  description:
    "Trvalý záznam stavu a historie vaší nemovitosti — opravy, závady, revize, dokumenty a fotky na jednom místě.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body>
        <LanguageProvider>
          <StoreProvider>{children}</StoreProvider>
          <CookieConsent />
        </LanguageProvider>
      </body>
    </html>
  );
}
