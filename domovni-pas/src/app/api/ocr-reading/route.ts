import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6";

const ALLOWED = ["image/jpeg", "image/png", "image/gif", "image/webp"] as const;
type Media = (typeof ALLOWED)[number];

// AI přečtení stavu měřidla z fotky. Bez ANTHROPIC_API_KEY vrací 503 (klient spadne na ruční zadání).
export async function POST(req: Request) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const body = (await req.json().catch(() => ({}))) as { image?: string };
  const image = body.image ?? "";
  const m = /^data:(image\/[a-zA-Z+]+);base64,(.+)$/.exec(image);
  if (!m) return NextResponse.json({ error: "bad_image" }, { status: 400 });
  const mediaType = m[1] as Media;
  const data = m[2];
  if (!ALLOWED.includes(mediaType))
    return NextResponse.json({ error: "unsupported_type" }, { status: 415 });

  const anthropic = new Anthropic({ apiKey: key });
  const prompt =
    "Na fotce je měřidlo (elektroměr, vodoměr, plynoměr nebo střídač FVE). " +
    "Přečti hlavní číselný stav (kumulativní počítadlo). " +
    "Vrať POUZE číslo — jen číslice a případně desetinnou tečku, bez jednotek, mezer a textu. " +
    "Když stav nelze spolehlivě přečíst, vrať přesně UNKNOWN.";

  try {
    const msg = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 50,
      messages: [
        {
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mediaType, data } },
            { type: "text", text: prompt },
          ],
        },
      ],
    });
    const raw = msg.content
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("")
      .trim();
    const cleaned = raw.replace(",", ".").replace(/[^0-9.]/g, "");
    const value = cleaned ? Number(cleaned) : NaN;
    return NextResponse.json({
      value: Number.isFinite(value) ? value : null,
      raw,
    });
  } catch (e) {
    return NextResponse.json(
      { error: "ai_failed", message: e instanceof Error ? e.message : "Neznámá chyba" },
      { status: 502 },
    );
  }
}
