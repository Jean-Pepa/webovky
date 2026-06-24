import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "Mařena — zázemí studentského festivalu",
  description:
    "Domovská stránka a organizační zázemí Mařeny — nejlepší, nejšílenější a nejnáročnější studentské akce na fakultě architektury. Role, nástěnka, hlasování, kalendář a almanach na jednom místě.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      {/* Používáme systémový font (SF Pro / Segoe UI / Roboto) — žádné externí načítání. */}
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
