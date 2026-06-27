import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Mascot } from "@/components/Mascot";

export const metadata = { title: "Přihlášeno — Mařena" };

// Sem se dostane člověk po kliknutí na odkaz z e-mailu. Záměrně NEpouští rovnou
// do zázemí — jen potvrdí přihlášení. Dovnitř se dostane v původním okně, kde
// zadával e-mail (to si přihlášení samo pohlídá). „Pokračovat tady" je záloha,
// kdyby původní okno už neměl (např. klikl na odkaz na jiném zařízení).
export default function MagicDonePage() {
  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden px-4">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-plum-700 via-plum-800 to-ink" />
      <div className="paper-grain absolute inset-0 -z-10 opacity-30" />

      <div className="absolute left-4 top-4">
        <Logo light />
      </div>

      <div className="w-full max-w-sm">
        <div className="mb-4 flex justify-center">
          <Mascot size={150} wave />
        </div>
        <div className="rounded-3xl bg-white/10 p-7 text-center text-white ring-1 ring-white/15 backdrop-blur-md">
          <div className="text-5xl">✅</div>
          <h1 className="mt-3 font-display text-2xl font-semibold">Přihlášeno!</h1>
          <p className="mt-2 text-sm text-white/85">
            Vrať se prosím do okna, kde jsi zadával/a e-mail — tam tě to už pustí dovnitř. Tuhle záložku můžeš zavřít.
          </p>
          <Link href="/zazemi" className="btn-primary mt-5 inline-flex w-full justify-center">
            Pokračovat tady →
          </Link>
        </div>
      </div>
    </div>
  );
}
