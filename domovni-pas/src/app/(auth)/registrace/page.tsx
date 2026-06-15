import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata = { title: "Registrace — Domovní pas" };

export default async function RegisterPage() {
  if (await getCurrentUser()) redirect("/prehled");

  return (
    <div className="card p-7">
      <h1 className="text-xl font-semibold text-stone-900">Vytvořit účet</h1>
      <p className="mt-1 mb-6 text-sm text-stone-500">
        Začněte vést historii své nemovitosti zdarma.
      </p>

      <RegisterForm />

      <p className="mt-6 text-center text-sm text-stone-500">
        Už máte účet?{" "}
        <Link href="/prihlaseni" className="font-medium text-teal-700 hover:underline">
          Přihlaste se
        </Link>
      </p>
    </div>
  );
}
