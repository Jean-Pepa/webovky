import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6";

const SYSTEM =
  "Jsi zkušený autorizovaný architekt a odborník na povolování staveb v ČR (dokumentace pro stavební povolení dle vyhlášky 499/2006 Sb.). Pomáháš architektovi připravit a zkontrolovat podklady. Piš česky, věcně a strukturovaně. Upozorni, že nejde o právně závazné podání.";

// AI příprava podkladů pro stavební povolení.
// Bez ANTHROPIC_API_KEY vrací 503 a klient spadne na šablonu.
export async function POST(req: Request) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const ctx = await req.json().catch(() => ({}));
  const anthropic = new Anthropic({ apiKey: key });

  const prompt = `Na základě údajů o projektu a seznamu nahraných dokumentů posuď připravenost pro stavební povolení a navrhni podklady.

DATA PROJEKTU (JSON):
${JSON.stringify(ctx, null, 2)}

Vrať POUZE platný JSON (bez markdownu) v tomto tvaru:
{
  "summary": "stručné shrnutí připravenosti (2–4 věty)",
  "missing": [{"item": "název chybějící části", "why": "proč je potřeba", "how": "jak doplnit"}],
  "recommendations": ["doporučení 1", "doporučení 2"],
  "draft": "návrh textu Průvodní zprávy (část A) v prostém textu"
}`;

  try {
    const msg = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 2500,
      system: SYSTEM,
      messages: [{ role: "user", content: prompt }],
    });
    const text = msg.content.map((b) => (b.type === "text" ? b.text : "")).join("").trim();
    let data: unknown;
    try {
      const json = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
      data = JSON.parse(json);
    } catch {
      data = { summary: text, missing: [], recommendations: [], draft: "" };
    }
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { error: "ai_failed", message: e instanceof Error ? e.message : "Neznámá chyba" },
      { status: 502 },
    );
  }
}
