import { NextResponse } from "next/server";

// Server proxy na registr ARES – doplnění firmy podle IČO.
// Běží serverově (např. na Vercelu), takže nevadí CORS.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ico = (searchParams.get("ico") || "").replace(/\s/g, "");
  if (!/^\d{8}$/.test(ico)) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  try {
    const r = await fetch(
      `https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/${ico}`,
      { headers: { Accept: "application/json" }, cache: "no-store" },
    );
    if (!r.ok) return NextResponse.json({ error: "not_found" }, { status: 404 });
    const d = await r.json();
    return NextResponse.json({
      name: d.obchodniJmeno ?? "",
      address: d.sidlo?.textovaAdresa ?? "",
      dic: d.dic ?? "",
    });
  } catch {
    return NextResponse.json({ error: "fetch_failed" }, { status: 502 });
  }
}
