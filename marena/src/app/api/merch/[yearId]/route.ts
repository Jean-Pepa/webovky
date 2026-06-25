import { NextResponse } from "next/server";
import { readDB } from "@/lib/server-db";
import { getRedis, receiptKey } from "@/lib/redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Veřejné (bez přihlášení) — nabídka merche pro objednávkovou stránku z QR kódu.
// Vrací jen produkty daného ročníku a jejich fotky (nic jiného z DB se neodhalí).
export async function GET(_req: Request, { params }: { params: Promise<{ yearId: string }> }) {
  const { yearId } = await params;
  const db = await readDB();
  if (!db) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  const year = db.years.find((y) => y.id === yearId);
  if (!year) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const redis = getRedis();
  const products = await Promise.all(
    (year.merch ?? []).map(async (p) => {
      let image: string | null = null;
      if (p.blobId && redis) image = (await redis.get(receiptKey(p.blobId))) as string | null;
      return {
        id: p.id,
        name: p.name,
        price: p.price ?? null,
        sizes: p.sizes ?? [],
        colors: p.colors ?? [],
        note: p.note ?? null,
        image,
      };
    }),
  );
  return NextResponse.json({ label: year.label, products });
}
