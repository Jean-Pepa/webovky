"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { optStr, reqStr } from "@/lib/formdata";
import type { FormState } from "@/lib/forms";

export async function transferProperty(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const propertyId = reqStr(formData, "propertyId");
  const toEmail = reqStr(formData, "toEmail").toLowerCase();
  const note = optStr(formData, "note");

  const property = await prisma.property.findFirst({
    where: { id: propertyId, ownerId: user.id },
  });
  if (!property) return { error: "Nemovitost nenalezena nebo nejste její vlastník." };
  if (!toEmail) return { error: "Zadejte e-mail nového majitele." };
  if (toEmail === user.email.toLowerCase()) return { error: "Tuto nemovitost už vlastníte." };

  const target = await prisma.user.findUnique({ where: { email: toEmail } });
  if (!target) {
    return {
      error:
        "Uživatel s tímto e-mailem zatím nemá účet. Požádejte ho, ať se nejdřív zaregistruje, a převod pak zopakujte.",
    };
  }

  await prisma.$transaction([
    prisma.property.update({
      where: { id: propertyId },
      data: { ownerId: target.id, shareEnabled: false, shareToken: null },
    }),
    prisma.transferLog.create({
      data: {
        propertyId,
        fromUserId: user.id,
        toUserId: target.id,
        fromEmail: user.email,
        toEmail: target.email,
        note,
      },
    }),
    prisma.access.deleteMany({ where: { propertyId, userId: target.id } }),
  ]);

  redirect("/prehled");
}
