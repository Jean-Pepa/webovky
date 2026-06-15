"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/password";
import { createSession, destroySession } from "@/lib/session";
import type { AuthState } from "@/lib/forms";

export async function registerAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const roleRaw = String(formData.get("role") || "OWNER");

  if (!name || !email || !password) return { error: "Vyplňte prosím všechna pole." };
  if (!email.includes("@") || email.length < 5) return { error: "Zadejte platný e-mail." };
  if (password.length < 6) return { error: "Heslo musí mít alespoň 6 znaků." };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "Uživatel s tímto e-mailem už existuje." };

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: hashPassword(password),
      role: roleRaw === "PROFESSIONAL" ? "PROFESSIONAL" : "OWNER",
    },
  });

  await createSession(user.id);
  redirect("/prehled");
}

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) return { error: "Zadejte e-mail i heslo." };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { error: "Nesprávný e-mail nebo heslo." };
  }

  await createSession(user.id);
  redirect("/prehled");
}

export async function logoutAction() {
  await destroySession();
  redirect("/prihlaseni");
}
