import { NextResponse } from "next/server";
import { getSiteOff } from "@/lib/maintenance";
import { isAdminAuthed } from "@/lib/auth";
import { readDB } from "@/lib/server-db";
import { getRedis, receiptKey } from "@/lib/redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Veřejné (bez přihlášení) — nabídka merche pro objednávkovou stránku z QR kódu.
// Vrací jen produkty daného ročníku a jejich fotky (nic jiného z DB se neodhalí).
export async function GET(_req: Request, { params }: { params: Promise<{ yearId: string }> }) {
  const { yearId } = await params;
  // Vypnutý veřejný web → nabídka se nevydá (správce projde).
  if ((await getSiteOff()) && !(await isAdminAuthed())) return NextResponse.json({ error: "site_off" }, { status: 503 });
  const db = await readDB();
  if (!db) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  const year = db.years.find((y) => y.id === yearId);
  if (!year) return NextResponse.json({ error: "not_found" }, { status: 404 });

  // Kolik kusů je už objednáno (na produkt) — kvůli „vyprodáno".
  const soldByProduct = new Map<string, number>();
  for (const o of year.merchOrders ?? []) {
    for (const it of o.items) soldByProduct.set(it.productId, (soldByProduct.get(it.productId) ?? 0) + it.qty);
  }

  const redis = getRedis();
  // Jen položky, které správce pustil na web (onWeb; chybí = ano u starších položek).
  const products = await Promise.all(
    (year.merch ?? []).filter((p) => p.onWeb !== false).map(async (p) => {
      let image: string | null = null;
      if (p.blobId && redis) image = (await redis.get(receiptKey(p.blobId))) as string | null;
      const sold = soldByProduct.get(p.id) ?? 0;
      return {
        id: p.id,
        name: p.name,
        price: p.price ?? null,
        sizes: p.sizes ?? [],
        colors: p.colors ?? [],
        note: p.note ?? null,
        soldOut: p.stock != null && p.stock - sold <= 0,
        image,
      };
    }),
  );
  return NextResponse.json({ label: year.label, products });
}
