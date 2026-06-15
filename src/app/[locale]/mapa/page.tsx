import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ParcelMap from "@/components/map/ParcelMap";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "mapa" });
  return {
    title: `${t("title")} | INN`,
    description: t("subtitle"),
  };
}

export default function MapaPage() {
  return (
    <main className="h-[100dvh] w-full overflow-hidden">
      <ParcelMap />
    </main>
  );
}
