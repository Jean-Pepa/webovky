import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Model lze přepnout proměnnou prostředí (např. levnější claude-haiku-5-5 podle cenového modelu).
const MODEL = process.env.BULO_AI_MODEL ?? "claude-opus-5-5";
// Když hlavní model požadavek odmítne, API ho v tomtéž volání dokončí na záložním modelu.
const FALLBACK_MODEL = process.env.BULO_AI_FALLBACK ?? "claude-opus-4-8";

const SYSTEM = `Jsi BULO, asistent digitálního pasu domu. Znáš jen data z pasu domu, která dostaneš v JSON (zařízení, rozvody ve zdi s přesností, hlídače a jejich hodnoty, historie zásahů, termíny, dokumenty).
Pravidla:
- Piš česky, krátce a věcně, jako zkušený technik, který dům zná. Žádné úvody ani omluvy.
- Nikdy si nevymýšlej naměřené hodnoty, čísla ani termíny. Používej jen údaje z dat, z věty technika nebo z přiložených dokumentů. Když údaj chybí, napiš „—“ nebo že ho pas nemá.
- Klíčové údaje (místo, hodnota, čas) obal do **dvou hvězdiček**.
- Neposkytuješ právní ani bezpečnostní záruky; u plynu a elektřiny doporuč odborníka.`;

type Task = "ask" | "zapis" | "kotel";

interface Img {
  media: string;
  data: string;
}

function splitDataUrl(u?: string | null): Img | null {
  if (!u || typeof u !== "string") return null;
  const m = u.match(/^data:([^;]+);base64,(.+)$/);
  return m ? { media: m[1], data: m[2] } : null;
}

const SCHEMAS: Record<Task, Record<string, unknown>> = {
  ask: {
    type: "object",
    properties: {
      paragraphs: { type: "array", items: { type: "string" } },
      actions: { type: "array", items: { type: "string", enum: ["close_valve", "open_model", "open_terminy", "open_spotreba"] } },
      showOverlay: { type: "boolean" },
    },
    required: ["paragraphs", "actions", "showOverlay"],
    additionalProperties: false,
  },
  zapis: {
    type: "object",
    properties: {
      title: { type: "string" },
      fields: {
        type: "array",
        items: {
          type: "object",
          properties: { k: { type: "string" }, v: { type: "string" }, note: { type: "string" } },
          required: ["k", "v", "note"],
          additionalProperties: false,
        },
      },
    },
    required: ["title", "fields"],
    additionalProperties: false,
  },
  kotel: {
    type: "object",
    properties: {
      model: { type: "string" },
      power: { type: "string" },
      serial: { type: "string" },
      warranty: { type: "string" },
      installed: { type: "string" },
      flueCheck: { type: "string" },
      found: { type: "boolean" },
    },
    required: ["model", "power", "serial", "warranty", "installed", "flueCheck", "found"],
    additionalProperties: false,
  },
};

function instruction(task: Task, body: Record<string, unknown>): string {
  const ctx = JSON.stringify(body.context ?? {}, null, 1);
  if (task === "ask") {
    return `DATA PASU DOMU (JSON):\n${ctx}\n\nOTÁZKA MAJITELE: ${String(body.question ?? "")}\n${body.photo ? "Majitel přiložil fotku (výše)." : ""}
Odpověz v 1–3 krátkých odstavcích (pole "paragraphs"). Když jde o vodu na zdi nebo únik a hlídač hlásí průtok a uzávěr není zavřený, přidej akci "close_valve". "open_model" přidej, když pomůže model rozvodů; "open_terminy" u termínů; "open_spotreba" u spotřeby. "showOverlay" = true, když odpověď popisuje rozvod za stěnou na fotce.`;
  }
  if (task === "zapis") {
    const kind = String(body.kind ?? "obecny");
    const labels =
      kind === "servis"
        ? `pole přesně v pořadí: "Úkon" (např. Servis kotle), "Výsledek", "Naměřeno" (jen hodnoty z věty nebo dokumentu, např. "CO 12 ppm"), "Další termín" (měsíc/rok o 12 měsíců později než dnešek ${String(body.today ?? "")}; note "vytvoří se sám")`
        : kind === "unik"
          ? `pole přesně v pořadí: "Úkon" (Oprava úniku vody), "Výsledek" (např. Spoj utěsněn), "Naměřeno" (hodnoty z protokolu, note "z protokolu" když jsou z dokumentu), "Další krok"`
          : `pole: "Úkon", "Výsledek", "Kde"`;
    return `DATA PASU DOMU (JSON):\n${ctx}\n\nTECHNIK NADIKTOVAL: „${String(body.sentence ?? "")}“\nPŘILOŽENÉ DOKUMENTY: ${JSON.stringify(body.docNames ?? [])}
Připrav návrh zápisu do pasu domu. "title" = krátký název zápisu. "fields" = ${labels}. Hodnoty piš stručně (max 5 slov). U pole bez poznámky dej note "".`;
  }
  return `SOUČASNÝ KOTEL (JSON): ${JSON.stringify(body.current ?? {})}\nDNEŠNÍ DATUM: ${String(body.today ?? "")}
Z přiloženého dokumentu (protokol o instalaci nebo fotka štítku) vyčti nový kotel: "model", "power" (např. "28 kW"), "serial" (výrobní číslo), "warranty" (do kdy, formát M/RRRR), "installed" (M/RRRR), "flueCheck" (revize spalinové cesty, typicky "do 30 dní" po instalaci). "found" = false, když dokument kotel neobsahuje. Nic si nevymýšlej; chybějící údaj = "—".`;
}

const configured = () => !!(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);

// Klient se nejdřív zeptá, jestli je AI zapnutá; bez klíče rovnou odpovídá z dat pasu domu.
export async function GET() {
  return NextResponse.json({ enabled: configured() });
}

export async function POST(req: Request) {
  if (!configured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const task = body.task as Task;
  if (!["ask", "zapis", "kotel"].includes(task)) return NextResponse.json({ error: "bad_task" }, { status: 400 });

  const content: Anthropic.Beta.BetaContentBlockParam[] = [];
  const images = [body.photo, ...(Array.isArray(body.photos) ? body.photos : [])].map((p) => splitDataUrl(p as string)).filter(Boolean) as Img[];
  for (const im of images.slice(0, 4)) {
    if (/^image\/(jpeg|png|webp|gif)$/.test(im.media)) {
      content.push({ type: "image", source: { type: "base64", media_type: im.media as "image/jpeg", data: im.data } });
    }
  }
  const docs = (Array.isArray(body.docs) ? body.docs : []).map((d) => splitDataUrl(d as string)).filter(Boolean) as Img[];
  for (const d of docs.slice(0, 2)) {
    if (d.media === "application/pdf") content.push({ type: "document", source: { type: "base64", media_type: "application/pdf", data: d.data } });
    else if (d.media.startsWith("image/")) content.push({ type: "image", source: { type: "base64", media_type: d.media as "image/jpeg", data: d.data } });
  }
  content.push({ type: "text", text: instruction(task, body) });

  const client = new Anthropic();
  try {
    const msg = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 8000,
      system: SYSTEM,
      output_config: { effort: task === "ask" ? "low" : "medium", format: { type: "json_schema", schema: SCHEMAS[task] } },
      betas: ["server-side-fallback-2026-06-01"],
      fallbacks: [{ model: FALLBACK_MODEL }],
      messages: [{ role: "user", content }],
    });
    if (msg.stop_reason === "refusal") return NextResponse.json({ error: "refusal" }, { status: 422 });
    const text = msg.content.map((b) => (b.type === "text" ? b.text : "")).join("");
    const data = JSON.parse(text) as Record<string, unknown>;
    return NextResponse.json({ ...data, model: msg.model });
  } catch (e) {
    if (e instanceof Anthropic.RateLimitError) return NextResponse.json({ error: "rate_limited" }, { status: 429 });
    if (e instanceof Anthropic.AuthenticationError) return NextResponse.json({ error: "auth" }, { status: 503 });
    if (e instanceof Anthropic.APIError) return NextResponse.json({ error: "api", status: e.status, message: e.message }, { status: 502 });
    if (e instanceof SyntaxError) return NextResponse.json({ error: "bad_json" }, { status: 502 });
    return NextResponse.json({ error: "failed" }, { status: 502 });
  }
}
