import Link from "next/link";
import { Logo } from "@/components/Logo";
import { BackLink } from "@/components/BackLink";

export const metadata = { title: "Ochrana osobních údajů — BULO" };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/">
            <Logo />
          </Link>
          <Link href="/" className="btn-secondary btn-sm">
            Domů
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <BackLink href="/">Zpět na úvod</BackLink>

        <p className="mt-4 text-xs font-semibold tracking-[0.2em] text-brass">GDPR</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-stone-900">
          Ochrana osobních údajů
        </h1>

        {/* Provozovatel */}
        <div className="card mt-6 grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
          <Info label="Provozovatel" value="BULO" />
          <Info label="Kontakt" value="info@bulo.app" />
          <Info label="Sídlo" value="[doplňte adresu sídla]" />
          <Info label="IČ / DIČ" value="[doplňte IČ a DIČ]" />
          <Info label="Poslední aktualizace" value="16. 6. 2026" />
        </div>

        <div className="mt-3 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Toto je vzorový text zásad. Před ostrým provozem doplňte své právní údaje a nechte
          dokument zkontrolovat.
        </div>

        {/* Obsah */}
        <div className="mt-8 space-y-8">
          <Section title="1. Kdo zpracovává vaše údaje">
            <p>
              Správcem osobních údajů je provozovatel služby BULO (dále jen „my"). Tyto zásady
              popisují, jaké údaje zpracováváme, proč a jaká máte práva.
            </p>
          </Section>

          <Section title="2. Jaké údaje zpracováváme">
            <ul className="list-disc space-y-1 pl-5">
              <li>Identifikační a kontaktní údaje (jméno, e-mail) při založení účtu.</li>
              <li>Údaje o nemovitosti, které sami vložíte (adresa, historie, dokumenty, fotky).</li>
              <li>Technické údaje nezbytné pro provoz a bezpečnost (např. záznam vaší volby cookies).</li>
            </ul>
          </Section>

          <Section title="3. Účel a právní základ">
            <ul className="list-disc space-y-1 pl-5">
              <li>Poskytování služby (plnění smlouvy).</li>
              <li>Zabezpečení a provoz (oprávněný zájem).</li>
              <li>Měření návštěvnosti a marketing pouze s vaším souhlasem.</li>
            </ul>
          </Section>

          <Section title="4. Cookies">
            <p>
              Nezbytné cookies používáme vždy, aby web fungoval (provoz, bezpečnost, záznam vaší
              volby). Statistické a marketingové cookies nasazujeme jen s vaším souhlasem, který
              můžete kdykoli změnit přes panel „Cookies" vlevo dole.
            </p>
          </Section>

          <Section title="5. Doba uchování">
            <p>
              Údaje uchováváme po dobu trvání účtu a poté po dobu vyžadovanou právními předpisy. Pas
              nemovitosti je navržen jako trvalý záznam — při převodu přechází na nového majitele.
            </p>
          </Section>

          <Section title="6. Vaše práva">
            <p>
              Máte právo na přístup, opravu, výmaz, omezení zpracování, přenositelnost údajů a právo
              vznést námitku. Souhlas s cookies můžete kdykoli odvolat. V případě dotazů nás
              kontaktujte na <span className="font-medium text-stone-700">info@bulo.app</span>.
            </p>
          </Section>

          <Section title="7. Dozorový úřad">
            <p>
              Máte právo podat stížnost u Úřadu pro ochranu osobních údajů (uoou.gov.cz).
            </p>
          </Section>
        </div>

        <p className="mt-10 text-center text-sm text-stone-400">
          © {new Date().getFullYear()} BULO · Pracovní ukázka
        </p>
      </main>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-stone-400">{label}</p>
      <p className="mt-0.5 font-medium text-stone-800">{value}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-stone-900">{title}</h2>
      <div className="mt-2 text-sm leading-relaxed text-stone-600">{children}</div>
    </section>
  );
}
