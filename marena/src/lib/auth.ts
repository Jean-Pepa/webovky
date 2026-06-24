import { cookies } from "next/headers";
import { createHash } from "crypto";

// Sdílené jednoduché heslo do zázemí. Bez účtů — jen jedno heslo pro celý tým.
// Nastav přes proměnnou prostředí MARENA_PASSWORD (jinak výchozí "marena").
export function correctPassword(): string {
  return process.env.MARENA_PASSWORD || "marena";
}

export const AUTH_COOKIE = "marena_auth";

// Do cookie neukládáme heslo, ale jeho odvozený token (hash). Cookie tak
// neobsahuje znovupoužitelné heslo v plaintextu.
export function authToken(): string {
  return createHash("sha256").update(`marena:v1:${correctPassword()}`).digest("hex");
}

export async function isAuthed(): Promise<boolean> {
  const jar = await cookies();
  return jar.get(AUTH_COOKIE)?.value === authToken();
}
