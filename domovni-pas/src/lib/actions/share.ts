"use server";

import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { requireUser, getOwnedProperty } from "@/lib/auth";
import { reqStr } from "@/lib/formdata";

export async function setShareEnabled(formData: FormData): Promise<void> {
  const user = await requireUser();
  const propertyId = reqStr(formData, "propertyId");
  const enable = reqStr(formData, "enable") === "1";

  const owned = await getOwnedProperty(propertyId, user.id);
  if (!owned) return;

  const data: { shareEnabled: boolean; shareToken?: string } = { shareEnabled: enable };
  if (enable && !owned.shareToken) data.shareToken = randomBytes(12).toString("hex");

  await prisma.property.update({ where: { id: propertyId }, data });
  revalidatePath(`/nemovitost/${propertyId}/sdileni`);
}

export async function regenerateShareToken(formData: FormData): Promise<void> {
  const user = await requireUser();
  const propertyId = reqStr(formData, "propertyId");

  const owned = await getOwnedProperty(propertyId, user.id);
  if (!owned) return;

  await prisma.property.update({
    where: { id: propertyId },
    data: { shareToken: randomBytes(12).toString("hex"), shareEnabled: true },
  });
  revalidatePath(`/nemovitost/${propertyId}/sdileni`);
}
