import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  // Verify JWT
  const token = request.cookies.get("admin_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const secret = new TextEncoder().encode(process.env.ADMIN_SECRET);
    await jwtVerify(token, secret);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const results: string[] = [];

  // Test if doc_images column exists by trying to select it
  const { error: testError } = await supabase
    .from("projects")
    .select("doc_images")
    .limit(1);

  if (testError && testError.message.includes("doc_images")) {
    // Column doesn't exist — we need to add it via SQL
    // Since we can't run raw SQL via PostgREST, we'll handle this differently
    results.push("doc_images column needs to be added manually in Supabase Dashboard SQL Editor");
    results.push("Run: ALTER TABLE projects ADD COLUMN doc_images jsonb DEFAULT '[]'::jsonb;");
    results.push("Run: ALTER TABLE projects ADD COLUMN doc_video text DEFAULT NULL;");
  } else {
    results.push("doc_images column already exists or was just created");
  }

  // Try to update projects with doc data (will work if columns exist)
  try {
    // Podhoran doc images
    const { error: podhoranErr } = await supabase
      .from("projects")
      .update({
        doc_images: [
          { src: "/images/podhoran-doc/zluts.png", alt: "Širší situace" },
          { src: "/images/podhoran-doc/pozemek.png", alt: "Situace pozemku" },
          { src: "/images/podhoran-doc/reziky.png", alt: "Řezy okolím" },
          { src: "/images/podhoran-doc/axo.png", alt: "Axonometrie okolí" },
          { src: "/images/podhoran-doc/budo.png", alt: "Axonometrie budovy" },
          { src: "/images/podhoran-doc/hmota.png", alt: "Hmotová studie" },
          { src: "/images/podhoran-doc/1pp.jpg", alt: "1. PP" },
          { src: "/images/podhoran-doc/1np.jpg", alt: "1. NP" },
          { src: "/images/podhoran-doc/2np.jpg", alt: "2. NP" },
          { src: "/images/podhoran-doc/3np.jpg", alt: "3. NP" },
          { src: "/images/podhoran-doc/4np.jpg", alt: "4. NP" },
          { src: "/images/podhoran-doc/rez-a.jpg", alt: "Řez A" },
          { src: "/images/podhoran-doc/rez-b.jpg", alt: "Řez B" },
        ],
      })
      .eq("slug", "hotel-podhoran");

    results.push(podhoranErr ? `Podhoran: ${podhoranErr.message}` : "Podhoran: OK");

    // Bítov doc images + video
    const { error: bitovErr } = await supabase
      .from("projects")
      .update({
        doc_images: [
          { src: "/images/bitov-doc/demolice-krb.jpg", alt: "Demolice krbu" },
          { src: "/images/bitov-doc/zaklady-armatura.jpg", alt: "Základy — armatura" },
          { src: "/images/bitov-doc/stavba-zdi.jpg", alt: "Stavba zdí" },
          { src: "/images/bitov-doc/stavba-strecha.jpg", alt: "Stavba — střecha" },
          { src: "/images/bitov-doc/interier-krb.jpg", alt: "Interiér — krb" },
          { src: "/images/bitov-doc/interier-schodiste.jpg", alt: "Interiér — schodiště" },
          { src: "/images/bitov-doc/ocelove-schodiste.jpg", alt: "Ocelové schodiště" },
          { src: "/images/bitov-doc/interier-loznice.jpg", alt: "Interiér — ložnice" },
        ],
        doc_video: "/videos/bitov-rekonstrukce.mp4",
      })
      .eq("slug", "rekonstrukce-bitov");

    results.push(bitovErr ? `Bítov: ${bitovErr.message}` : "Bítov: OK");

    // Zlín doc images
    const { error: zlinErr } = await supabase
      .from("projects")
      .update({
        doc_images: [
          { src: "/images/zlin-doc/00-katastr.png", alt: "Katastrální mapa" },
        ],
      })
      .eq("slug", "nevideny-zlin");

    results.push(zlinErr ? `Zlín: ${zlinErr.message}` : "Zlín: OK");
  } catch (err) {
    results.push(`Migration error: ${err}`);
  }

  return NextResponse.json({ results });
}
