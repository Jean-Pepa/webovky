import Link from "next/link";
import { Logo } from "@/components/Logo";
import {
  IconArrowRight,
  IconCalendar,
  IconBox,
  IconFile,
  IconShield,
  IconTransfer,
  IconSparkles,
  IconBuilding,
  IconHome,
} from "@/components/Icons";

export default function HomePage() {
  return (
    <div className="bg-[#f5f1e8]">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1d5e6c] via-[#16454f] to-[#0d2a31]" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />

        <div className="relative">
          {/* NAV */}
          <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
            <Logo light />
            <nav className="hidden items-center gap-8 text-sm font-medium text-white/85 md:flex">
              <a href="#funkce" className="hover:text-white">
                Co umí
              </a>
              <a href="#jak" className="hover:text-white">
                Jak to funguje
              </a>
              <a href="#proKoho" className="hover:text-white">
                Pro koho
              </a>
            </nav>
            <div className="flex items-center gap-3">
              <span className="hidden rounded-full border border-white/25 px-3 py-1.5 text-xs text-white/80 sm:inline">
                CZ
              </span>
              <Link
                href="/prehled"
                className="rounded-lg bg-brass px-4 py-2 text-sm font-medium text-white transition hover:bg-[#a07a40]"
              >
                Vstoupit do aplikace
              </Link>
            </div>
          </header>

          {/* HERO CONTENT */}
          <div className="mx-auto max-w-4xl px-6 pb-24 pt-16 text-center sm:pt-24">
            <p className="text-xs font-semibold tracking-[0.3em] text-white/55">BULO.APP</p>
            <h1 className="mt-5 text-5xl font-extrabold uppercase leading-[1.02] tracking-tight sm:text-7xl">
              Digitální pas
              <span className="mt-1 block italic text-brass">vaší nemovitosti</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
              Opravy, revize, rekonstrukce, dokumenty, vybavení i fotky na jednom místě. Trvalý
              záznam, který dům provází celým životem — a při prodeji ho jedním krokem předáte novému
              majiteli.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/prehled"
                className="inline-flex items-center gap-2 rounded-xl bg-brass px-6 py-3.5 text-base font-medium text-white shadow-lg shadow-black/20 transition hover:bg-[#a07a40]"
              >
                <IconArrowRight className="h-5 w-5" />
                Vstoupit do aplikace
              </Link>
              <Link
                href="/projekt/novy"
                className="rounded-xl border border-white/30 px-6 py-3.5 text-base font-medium text-white transition hover:bg-white/10"
              >
                Jsem architekt
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <div className="inline-flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-2.5 ring-1 ring-white/15 backdrop-blur">
                <span className="flex -space-x-2">
                  {[
                    ["JN", "bg-[#b58b4b]"],
                    ["AK", "bg-[#2d7081]"],
                    ["PS", "bg-[#8a6d3b]"],
                  ].map(([t, c]) => (
                    <span
                      key={t}
                      className={`grid h-7 w-7 place-items-center rounded-full text-[10px] font-semibold text-white ring-2 ring-[#16454f] ${c}`}
                    >
                      {t}
                    </span>
                  ))}
                </span>
                <span className="text-sm text-white/85">Pro majitele, architekty i kupující</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 ring-1 ring-white/15 backdrop-blur">
                <span className="text-brass">★★★★★</span>
                <span className="text-sm text-white/85">Jako CarVertical — ale pro dům či byt</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FUNKCE ===== */}
      <section id="funkce" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
            Všechno o vašem domě na jednom místě
          </h2>
          <p className="mt-3 text-stone-600">
            Konec šanonů, ztracených faktur a „kde jen mám ten záruční list".
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Feature
            icon={<IconCalendar className="h-6 w-6" />}
            title="Přehledná historie"
            text="Časová osa všeho — od revize kotle po rekonstrukci koupelny, s fotkami a náklady."
          />
          <Feature
            icon={<IconBox className="h-6 w-6" />}
            title="Vybavení a materiály"
            text="„Co je v mém domě“ — baterie, kotel, podlahy… s cenou, zárukou a doklady."
          />
          <Feature
            icon={<IconFile className="h-6 w-6" />}
            title="Dokumenty pohromadě"
            text="Smlouvy, projekt, energetický štítek, certifikáty a faktury na jednom místě."
          />
          <Feature
            icon={<IconShield className="h-6 w-6" />}
            title="Připomínky"
            text="Revize, údržba a záruky — BULO vás upozorní dřív, než vyprší termín."
          />
          <Feature
            icon={<IconTransfer className="h-6 w-6" />}
            title="Převod při prodeji"
            text="Celou historii i s reportem předáte novému majiteli jedním krokem."
          />
          <Feature
            icon={<IconSparkles className="h-6 w-6" />}
            title="Report o nemovitosti"
            text="Důvěryhodný přehled stavu a péče k tisku či PDF — váš „CarVertical report“."
          />
        </div>
      </section>

      {/* ===== JAK TO FUNGUJE ===== */}
      <section id="jak" className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
              Jak to funguje
            </h2>
            <p className="mt-3 text-stone-600">Tři kroky. Žádná složitá administrativa.</p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            <Step
              n={1}
              title="Založ pas"
              text="Při koupi, rekonstrukci — nebo prostě teď. Nahraješ smlouvu, energetický štítek a pár fotek."
            />
            <Step
              n={2}
              title="Veď historii"
              text="Zapisuj opravy, revize a vybavení. Připomínky tě hlídají, dokumenty máš po ruce."
            />
            <Step
              n={3}
              title="Předej dál"
              text="Při prodeji předáš celý pas i s reportem novému majiteli. Hodnota navíc."
            />
          </div>
        </div>
      </section>

      {/* ===== PRO KOHO ===== */}
      <section id="proKoho" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
            Pro koho je BULO
          </h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          <Audience
            icon={<IconHome className="h-6 w-6" />}
            title="Majitelé"
            text="Mějte historii domu po ruce, hlídejte záruky a revize a při prodeji doložte péči."
          />
          <Audience
            icon={<IconBuilding className="h-6 w-6" />}
            title="Architekti a firmy"
            text="Profesionální předání projektu klientovi — dokumentace, fotky a materiály místo PDF a WeTransferu."
          />
          <Audience
            icon={<IconShield className="h-6 w-6" />}
            title="Kupující a realitky"
            text="Důvěryhodný report o stavu a historii nemovitosti. Konec nakupování „kočky v pytli“."
          />
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="bg-[#184e5a]">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center text-white">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Začněte vést pas své nemovitosti
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/80">
            Zdarma, hned a bez složitého nastavování. Vyzkoušejte ukázku na vlastní nemovitosti.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/prehled"
              className="inline-flex items-center gap-2 rounded-xl bg-brass px-6 py-3.5 text-base font-medium text-white shadow-lg shadow-black/20 transition hover:bg-[#a07a40]"
            >
              <IconArrowRight className="h-5 w-5" />
              Vstoupit do aplikace
            </Link>
            <Link
              href="/projekt/novy"
              className="rounded-xl border border-white/30 px-6 py-3.5 text-base font-medium text-white transition hover:bg-white/10"
            >
              Předat projekt
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-stone-200 bg-[#f5f1e8] py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 text-sm text-stone-400 sm:flex-row">
          <Logo />
          <p>© {new Date().getFullYear()} BULO · Pracovní ukázka</p>
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

function Step({ n, title, text }: { n: number; title: string; text: string }) {
  return (
    <div className="text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-teal-700 text-lg font-semibold text-white">
        {n}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-stone-900">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-stone-600">{text}</p>
    </div>
  );
}

function Audience({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="card p-6">
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-amber-50 text-amber-700">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-stone-900">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-stone-600">{text}</p>
    </div>
  );
}
