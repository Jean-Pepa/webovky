import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KVIN | Kristián Vyskočil",
  description:
    "Domy. Prostory. Místa. Design. Student Fakulty architektury VUT v Brně.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600&family=Montserrat:wght@100;200;300;400&subset=latin-ext&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
