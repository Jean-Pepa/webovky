import { NextRequest, NextResponse } from "next/server";
import { ALLOWED_WMS_HOSTS } from "@/lib/geo/layers";

// Proxy pro WMS GetFeatureInfo dotazy.
// Prohlížeč nemůže volat WMS služby ČÚZK přímo (chybí CORS hlavičky a některé
// služby vyžadují běžný User-Agent), tak je přeposíláme přes server.
// Whitelist hostů zabraňuje zneužití jako otevřený proxy (SSRF).

export const dynamic = "force-dynamic";

const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/120.0 Safari/537.36";

export async function GET(req: NextRequest) {
  const target = req.nextUrl.searchParams.get("url");
  if (!target) {
    return NextResponse.json({ error: "missing url" }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return NextResponse.json({ error: "invalid url" }, { status: 400 });
  }

  if (parsed.protocol !== "https:" || !ALLOWED_WMS_HOSTS.includes(parsed.hostname)) {
    return NextResponse.json({ error: "host not allowed" }, { status: 403 });
  }

  try {
    const upstream = await fetch(parsed.toString(), {
      headers: { "User-Agent": BROWSER_UA, Accept: "*/*" },
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });

    const body = await upstream.text();
    const contentType =
      upstream.headers.get("content-type") ?? "text/plain; charset=utf-8";

    return new NextResponse(body, {
      status: upstream.ok ? 200 : upstream.status,
      headers: {
        "content-type": contentType,
        "cache-control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "upstream fetch failed" },
      { status: 502 }
    );
  }
}
