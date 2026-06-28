import { cookies } from "next/headers";
import { createHash } from "crypto";

// Jedno společné heslo pro celou partu (jako v Mařeně). Lze přebít přes
// DOVCA_PASSWORD; bez nastavení je výchozí „dovca" (fajn pro vyzkoušení).
export const AUTH_COOKIE = "dovca_auth";

function secret(): string {
  return process.env.DOVCA_PASSWORD || "dovca";
}

export function isValidPassword(pw: string): boolean {
  return (pw || "").trim().toLowerCase() === secret().toLowerCase();
}

// Do cookie neukládáme heslo, ale odvozený token (hash) — znamená jen
// „přihlášen".
export function authToken(): string {
  return createHash("sha256").update(`dovca:auth:v1:${secret()}`).digest("hex");
}

export async function isAuthed(): Promise<boolean> {
  const jar = await cookies();
  return jar.get(AUTH_COOKIE)?.value === authToken();
}
