import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";
import { getSessionUserId } from "./session";

// cache() => jeden dotaz na uživatele za request
export const getCurrentUser = cache(async () => {
  const uid = await getSessionUserId();
  if (!uid) return null;
  return prisma.user.findUnique({ where: { id: uid } });
});

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/prihlaseni");
  return user;
}

// Načte nemovitost a ověří, že k ní má uživatel přístup (vlastník nebo udělený Access).
export async function getOwnedProperty(propertyId: string, userId: string) {
  return prisma.property.findFirst({
    where: {
      id: propertyId,
      OR: [{ ownerId: userId }, { accesses: { some: { userId } } }],
    },
  });
}
