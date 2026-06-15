"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser, getOwnedProperty } from "@/lib/auth";
import { isPropertyType } from "@/lib/enums";
import { optInt, optStr, reqStr } from "@/lib/formdata";
import { deleteStoredFile } from "@/lib/storage";
import type { FormState } from "@/lib/forms";

export async function createProperty(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const name = reqStr(formData, "name");
  if (!name) return { error: "Zadejte název nemovitosti." };

  const typeRaw = reqStr(formData, "type");
  const property = await prisma.property.create({
    data: {
      name,
      type: isPropertyType(typeRaw) ? typeRaw : "HOUSE",
      street: optStr(formData, "street"),
      city: optStr(formData, "city"),
      zip: optStr(formData, "zip"),
      cadastralArea: optStr(formData, "cadastralArea"),
      parcelNumber: optStr(formData, "parcelNumber"),
      yearBuilt: optInt(formData, "yearBuilt"),
      description: optStr(formData, "description"),
      ownerId: user.id,
    },
  });

  redirect(`/nemovitost/${property.id}`);
}

export async function updateProperty(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const id = reqStr(formData, "id");
  const owned = await getOwnedProperty(id, user.id);
  if (!owned) return { error: "Nemovitost nenalezena." };

  const name = reqStr(formData, "name");
  if (!name) return { error: "Zadejte název nemovitosti." };

  const typeRaw = reqStr(formData, "type");
  await prisma.property.update({
    where: { id },
    data: {
      name,
      type: isPropertyType(typeRaw) ? typeRaw : "HOUSE",
      street: optStr(formData, "street"),
      city: optStr(formData, "city"),
      zip: optStr(formData, "zip"),
      cadastralArea: optStr(formData, "cadastralArea"),
      parcelNumber: optStr(formData, "parcelNumber"),
      yearBuilt: optInt(formData, "yearBuilt"),
      description: optStr(formData, "description"),
    },
  });

  redirect(`/nemovitost/${id}`);
}

export async function deleteProperty(formData: FormData): Promise<void> {
  const user = await requireUser();
  const id = reqStr(formData, "id");

  const property = await prisma.property.findFirst({
    where: { id, ownerId: user.id },
    include: { attachments: true, documents: true },
  });
  if (!property) redirect("/prehled");

  // Smazat soubory z úložiště, pak řádky (kaskáda dořeší vazby)
  for (const a of property.attachments) await deleteStoredFile(a.storageKey);
  for (const d of property.documents) await deleteStoredFile(d.storageKey);
  await prisma.property.delete({ where: { id } });

  revalidatePath("/prehled");
  redirect("/prehled");
}
