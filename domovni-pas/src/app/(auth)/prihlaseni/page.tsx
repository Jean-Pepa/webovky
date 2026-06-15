import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = { title: "Přihlášení — Domovní pas" };

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/prehled");

  return (
    <div className="card p-7">
      <h1 className="text-xl font-semibold text-stone-900">Přihlášení</h1>
      <p className="mt-1 mb-6 text-sm text-stone-500">Vítejte zpět ve svém domovním pasu.</p>

      <LoginForm />

      <p className="mt-6 text-center text-sm text-stone-500">
        Nemáte účet?{" "}
        <Link href="/registrace" className="font-medium text-teal-700 hover:underline">
          Zaregistrujte se
        </Link>
      </p>

      <div className="mt-6 rounded-lg bg-stone-50 px-3 py-2.5 text-center text-xs text-stone-500">
        Demo: <span className="font-medium">majitel@domovnipas.cz</span> · heslo123
      </div>
    </div>
  );
}
