import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { readStoredFile } from "@/lib/storage";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;

  const attachment = await prisma.attachment.findFirst({
    where: { storageKey: key },
    include: { property: true, entry: { include: { property: true } } },
  });
  const document = attachment
    ? null
    : await prisma.document.findFirst({ where: { storageKey: key }, include: { property: true } });

  const property = attachment?.property ?? attachment?.entry?.property ?? document?.property;
  if (!property) return new Response("Soubor nenalezen", { status: 404 });

  const mimeType = attachment?.mimeType ?? document?.mimeType ?? "application/octet-stream";
  const fileName = attachment?.fileName ?? document?.fileName ?? "soubor";

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

  const buf = await readStoredFile(key);
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
