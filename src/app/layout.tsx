import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { I18nProvider } from "@/i18n/context";
import { getLang } from "@/i18n/server";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.eika.cz"),
  title: {
    default: "EIKA ZNOJMO – hutní materiál, železářství a vinohradnictví | Brno a Znojmo",
    template: "%s | EIKA ZNOJMO",
  },
  description:
    "EIKA ZNOJMO, a.s. – hutní materiál, železářství a potřeby pro vinohradnictví pro firmy, živnostníky i koncové zákazníky. Pobočky Brno a Znojmo, tisíce položek skladem.",
  keywords: [
    "hutní materiál",
    "železářství",
    "vinohradnictví",
    "betonářská ocel",
    "jekly",
    "profily",
    "trapézové plechy",
    "Brno",
    "Znojmo",
    "EIKA",
  ],
  openGraph: {
    type: "website",
    locale: "cs_CZ",
    siteName: "EIKA ZNOJMO",
    title: "EIKA ZNOJMO – hutní materiál, železářství a vinohradnictví",
    description:
      "Hutní materiál, železářství a vinohradnictví pro firmy, živnostníky i koncové zákazníky. Pobočky Brno a Znojmo.",
  },
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
