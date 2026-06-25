import { NextResponse } from "next/server";
import { readDB, applyActionAtomic } from "@/lib/server-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Veřejné (bez přihlášení) — přijetí objednávky merche z QR stránky. Zapíše ji
// atomicky do DB. Položky se ověří proti skutečné nabídce ročníku (žádný cizí text).
export async function POST(req: Request, { params }: { params: Promise<{ yearId: string }> }) {
  const { yearId } = await params;
  const body = (await req.json().catch(() => null)) as
    | { name?: unknown; phone?: unknown; email?: unknown; note?: unknown; selections?: unknown }
    | null;
  if (!body) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const name = str(body.name);
  const phone = str(body.phone);
  const email = str(body.email);
  const note = str(body.note);
  const selections = Array.isArray(body.selections) ? body.selections : [];

  if (!name) return NextResponse.json({ error: "name_required" }, { status: 400 });
  // Kupující musí zadat jméno, telefon i e-mail.
  if (!phone || !email) return NextResponse.json({ error: "contact_required" }, { status: 400 });

  const db = await readDB();
  if (!db) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  const year = db.years.find((y) => y.id === yearId);
  if (!year) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const catalog = new Map((year.merch ?? []).map((p) => [p.id, p]));
  const items: { productId: string; name: string; size?: string; color?: string; price?: number; qty: number }[] = [];
  for (const s of selections) {
    const sel = s as { productId?: unknown; qty?: unknown; size?: unknown; color?: unknown };
    const p = catalog.get(String(sel.productId));
    if (!p) continue;
    const qty = Math.max(1, Math.min(99, Math.round(Number(sel.qty) || 1)));
    // Velikost/barva přijmeme jen pokud sedí s nabídkou produktu.
    const size = typeof sel.size === "string" && (!p.sizes?.length || p.sizes.includes(sel.size)) ? sel.size : undefined;
    const color = typeof sel.color === "string" && (!p.colors?.length || p.colors.includes(sel.color)) ? sel.color : undefined;
    items.push({ productId: p.id, name: p.name, size, color, price: p.price ?? undefined, qty });
  }
  if (!items.length) return NextResponse.json({ error: "no_items" }, { status: 400 });

  const next = await applyActionAtomic({
    type: "addMerchOrder",
    yearId,
    name,
    phone: phone || undefined,
    email: email || undefined,
    items,
    note: note || undefined,
  });
  if (!next) return NextResponse.json({ error: "conflict" }, { status: 409 });
  return NextResponse.json({ ok: true });
}
