import Link from "next/link";
import { Logo } from "@/components/Logo";
import {
  IconShield,
  IconTransfer,
  IconFile,
  IconCalendar,
  IconShare,
  IconSparkles,
} from "@/components/Icons";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Logo />
        <Link href="/prehled" className="btn-primary">
          Otevřít aplikaci
        </Link>
      </header>

      <section className="mx-auto max-w-6xl px-6 pt-12 pb-20 text-center sm:pt-20">
        <span className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-600">
          <IconSparkles className="h-3.5 w-3.5 text-teal-600" />
          Digitální stavební deník pro každou nemovitost
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-stone-900 sm:text-5xl">
          Trvalý záznam o historii vaší nemovitosti
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-stone-600">
          Opravy, závady, revize, rekonstrukce, dokumenty a fotky na jednom místě. Záznam provází
          dům či byt celým životem — a&nbsp;při prodeji ho předáte novému majiteli.
        </p>
        <p className="mt-3 text-sm text-stone-400">Jako CarVertical, ale pro dům či byt.</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/prehled" className="btn-primary px-6 py-3 text-base">
            Vyzkoušet ukázku
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-5 sm:grid-cols-3">
          <Feature
            icon={<IconCalendar className="h-6 w-6" />}
            title="Přehledná historie"
            text="Časová osa všeho, co se s nemovitostí dělo — od revize kotle po rekonstrukci koupelny, s fotkami a náklady."
          />
          <Feature
            icon={<IconTransfer className="h-6 w-6" />}
            title="Připraveno na prodej"
            text="Záznam přežije změnu majitele. Při prodeji předáte novému vlastníkovi celou historii nemovitosti."
          />
          <Feature
            icon={<IconFile className="h-6 w-6" />}
            title="Dokumenty pohromadě"
            text="Projektová dokumentace, energetický štítek, certifikáty a faktury — konec šanonů a ztracených mailů."
          />
          <Feature
            icon={<IconShare className="h-6 w-6" />}
            title="Bezpečné sdílení"
            text="Vytvořte read-only náhled pro kupujícího nebo řemeslníka. Kdykoli ho zase vypnete."
          />
          <Feature
            icon={<IconShield className="h-6 w-6" />}
            title="Důvěryhodný report"
            text="Vygenerujete přehledný report o stavu a péči — doklad, který zvyšuje hodnotu nemovitosti."
          />
          <Feature
            icon={<IconSparkles className="h-6 w-6" />}
            title="Brutálně jednoduché"
            text="Žádná složitá administrativa. Otevřete, kliknete, zapíšete. Hotovo."
          />
        </div>
      </section>

      <footer className="border-t border-stone-200 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 text-sm text-stone-400 sm:flex-row">
          <Logo />
          <p>© {new Date().getFullYear()} Domovní pas · Pracovní ukázka</p>
        </div>
      </footer>
    </div>
  );
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="card p-6">
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-teal-50 text-teal-700">
        {icon}
      </div>
      <h3 className="mt-4 text-base font-semibold text-stone-900">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-stone-600">{text}</p>
    </div>
  );
}
