"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser, getOwnedProperty } from "@/lib/auth";
import { isEntryType, mediaTypeFromMime } from "@/lib/enums";
import { optInt, optStr, reqStr } from "@/lib/formdata";
import { saveFile, deleteStoredFile } from "@/lib/storage";
import type { FormState } from "@/lib/forms";

export async function createEntry(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const propertyId = reqStr(formData, "propertyId");
  const owned = await getOwnedProperty(propertyId, user.id);
  if (!owned) return { error: "Nemovitost nenalezena." };

  const title = reqStr(formData, "title");
  if (!title) return { error: "Zadejte název záznamu." };

  const typeRaw = reqStr(formData, "type");
  const dateRaw = reqStr(formData, "date");
  const date = dateRaw ? new Date(dateRaw) : new Date();

  const entry = await prisma.entry.create({
    data: {
      propertyId,
      type: isEntryType(typeRaw) ? typeRaw : "OTHER",
      title,
      description: optStr(formData, "description"),
      date,
      cost: optInt(formData, "cost"),
      authorId: user.id,
    },
  });

  const files = formData
    .getAll("files")
    .filter((f): f is File => f instanceof File && f.size > 0);

  for (const file of files) {
    const stored = await saveFile(file);
    await prisma.attachment.create({
      data: {
        entryId: entry.id,
        propertyId,
        storageKey: stored.key,
        fileName: stored.fileName,
        mimeType: stored.mimeType,
        size: stored.size,
        mediaType: mediaTypeFromMime(stored.mimeType),
      },
    });
  }

  redirect(`/nemovitost/${propertyId}`);
}

export async function deleteEntry(formData: FormData): Promise<void> {
  const user = await requireUser();
  const id = reqStr(formData, "id");

  const entry = await prisma.entry.findUnique({
    where: { id },
    include: { attachments: true },
  });
  if (!entry) return;

  const owned = await getOwnedProperty(entry.propertyId, user.id);
  if (!owned) return;

  for (const a of entry.attachments) await deleteStoredFile(a.storageKey);
  await prisma.entry.delete({ where: { id } });

  revalidatePath(`/nemovitost/${entry.propertyId}`);
}
