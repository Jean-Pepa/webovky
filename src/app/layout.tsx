import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { I18nProvider } from "@/i18n/context";
import { getLang } from "@/i18n/server";

export const metadata: Metadata = {
  title: "EIKA – hutní materiál a železářství | objednávkový systém",
  description:
    "Objednávková aplikace EIKA ZNOJMO, a.s. – hutní materiál, železářství a vinohradnictví pro firmy, živnostníky i koncové zákazníky.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const lang = await getLang();
  return (
    <html lang={lang}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <I18nProvider initial={lang}>
          <FavoritesProvider>
            <CartProvider>{children}</CartProvider>
          </FavoritesProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
