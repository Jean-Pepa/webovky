import type { Metadata, Viewport } from "next";
import { BuloLoader } from "../../aplikace/BuloLoader";
import "../../aplikace/bulo.css";

export const metadata: Metadata = {
  title: "BULO · Přihlášení k domu",
  description: "Kód domu z cedulky u vchodu přihlásí technika k pasu domu.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F2F0ED",
};

// Odkaz z QR kódu na zdi u vchodu: /q/LOU-0127
export default async function KodDomuPage({ params }: { params: Promise<{ kod: string }> }) {
  const { kod } = await params;
  return <BuloLoader code={decodeURIComponent(kod)} />;
}
