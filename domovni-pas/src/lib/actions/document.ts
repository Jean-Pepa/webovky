"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser, getOwnedProperty } from "@/lib/auth";
import { isDocumentCategory } from "@/lib/enums";
import { reqStr } from "@/lib/formdata";
import { saveFile, deleteStoredFile } from "@/lib/storage";
import type { FormState } from "@/lib/forms";

export async function uploadDocument(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const propertyId = reqStr(formData, "propertyId");
  const owned = await getOwnedProperty(propertyId, user.id);
  if (!owned) return { error: "Nemovitost nenalezena." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "Vyberte soubor k nahrání." };

  const category = reqStr(formData, "category");
  const title = reqStr(formData, "title");
  const stored = await saveFile(file);

  await prisma.document.create({
    data: {
      propertyId,
      category: isDocumentCategory(category) ? category : "OTHER",
      title: title || stored.fileName,
      storageKey: stored.key,
      fileName: stored.fileName,
      mimeType: stored.mimeType,
      size: stored.size,
    },
  });

  redirect(`/nemovitost/${propertyId}`);
}

export async function deleteDocument(formData: FormData): Promise<void> {
  const user = await requireUser();
  const id = reqStr(formData, "id");

  const doc = await prisma.document.findUnique({ where: { id } });
  if (!doc) return;

  const owned = await getOwnedProperty(doc.propertyId, user.id);
  if (!owned) return;

  await deleteStoredFile(doc.storageKey);
  await prisma.document.delete({ where: { id } });

  revalidatePath(`/nemovitost/${doc.propertyId}`);
}
