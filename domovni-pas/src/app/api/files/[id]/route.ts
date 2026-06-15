import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { readStoredFile } from "@/lib/storage";

// Servíruje přílohu/dokument podle ID záznamu. Soubor (lokální disk nebo Vercel Blob)
// čteme na serveru a streamujeme až po ověření přístupu – aby vypnutí sdílení
// skutečně odřízlo i přímý přístup k souborům.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const attachment = await prisma.attachment.findUnique({
    where: { id },
    include: { property: true, entry: { include: { property: true } } },
  });
  const document = attachment
    ? null
    : await prisma.document.findUnique({ where: { id }, include: { property: true } });

  const property = attachment?.property ?? attachment?.entry?.property ?? document?.property;
  if (!property) return new Response("Soubor nenalezen", { status: 404 });

  const storageKey = attachment?.storageKey ?? document?.storageKey;
  const mimeType = attachment?.mimeType ?? document?.mimeType ?? "application/octet-stream";
  const fileName = attachment?.fileName ?? document?.fileName ?? "soubor";
  if (!storageKey) return new Response("Soubor nenalezen", { status: 404 });

  // Autorizace: veřejně sdílená nemovitost, vlastník nebo uživatel s přístupem.
  let authorized = property.shareEnabled;
  if (!authorized) {
    const user = await getCurrentUser();
    if (user) {
      if (property.ownerId === user.id) {
        authorized = true;
      } else {
        const access = await prisma.access.findFirst({
          where: { propertyId: property.id, userId: user.id },
        });
        authorized = !!access;
      }
    }
  }
  if (!authorized) return new Response("Přístup odepřen", { status: 403 });

  const buf = await readStoredFile(storageKey);
  if (!buf) return new Response("Soubor nenalezen", { status: 404 });

  const inline =
    mimeType.startsWith("image/") || mimeType.startsWith("video/") || mimeType === "application/pdf";

  return new Response(new Uint8Array(buf), {
    headers: {
      "Content-Type": mimeType,
      "Content-Disposition": `${inline ? "inline" : "attachment"}; filename*=UTF-8''${encodeURIComponent(fileName)}`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
