import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Photo } from "@/components/Photo";
import { Icon, type IconName } from "@/components/Icons";

// ⬇️ Až budete mít účet, stačí změnit tenhle jeden řádek na svůj Instagram.
const IG_URL = "https://instagram.com/marena_favut";
const IG_HANDLE = "@marena_favut";

const LINEUP: { photo: string; icon: IconName; title: string; text: string }[] = [
  { photo: "/photos/prednasky.jpg", icon: "lecture", title: "Přednášky", text: "Špičkoví hosté z architektury a designu — i ze zahraničí. Inspirace, jakou v rozvrhu nenajdeš." },
  { photo: "/photos/obedy.jpg", icon: "food", title: "Obědy na dvoře", text: "Každý den teplý oběd (a ráno snídaně) přímo na dvoře fakulty. Najíš se a potkáš všechny." },
  { photo: "/photos/bar.jpg", icon: "beer", title: "Bar na dvoře", text: "Srdce festivalu. Pivo, limo, drinky a parta — celý den i večer na jednom místě." },
  { photo: "/photos/party.jpg", icon: "music", title: "Party večery", text: "Kapely a DJs na dvoře a v Arše. Hraje se, dokud noční klid dovolí (a pak ještě chvíli)." },
  { photo: "/photos/vyzdoba.jpg", icon: "palette", title: "Vyzdobená škola", text: "Celá fakulta se na týden promění do tématu — chodby, dvůr i aula. Hravě a originálně." },
  { photo: "/photos/pruvod.jpg", icon: "flag", title: "Průvod městem", text: "Legendární průvod centrem Brna s maskotem v čele. Prváci ho nesou až na Flédu." },
];

const STEPS = [
  { day: "Přes den", text: "Přednášky, workshopy, obědy a bar na dvoře" },
  { day: "Večer", text: "Kapely, DJs a party na dvoře i v Arše" },
  { day: "Poslední den", text: "Průvod městem v pytlích, s maskotem" },
  { day: "Finále", text: "Křest prváků na Flédě až do rána" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* NAV */}
      <header className="absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-black/55 via-black/25 to-transparent pb-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 [text-shadow:0_1px_10px_rgba(0,0,0,0.45)]">
          <span className="[&_*]:text-white">
            <Logo light />
          </span>
          <nav className="flex items-center gap-2">
            <a href={IG_URL} target="_blank" rel="noreferrer" className="btn-primary">
              <Icon name="instagram" className="h-4 w-4" /> Instagram
            </a>
            <Link href="/prihlaseni" className="rounded-full px-3 py-2 text-sm font-medium text-white transition hover:opacity-80">
              Organizátoři
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative isolate flex min-h-[90vh] items-center justify-center overflow-hidden">
        <Photo src="/photos/hero.jpg" alt="Mařena — průvod městem" label="hero foto — průvod / dvůr Mařeny" className="absolute inset-0 -z-10 h-full w-full" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/65 via-black/55 to-black/85" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.45)_0%,_transparent_65%)]" />

        <div className="mx-auto w-full max-w-3xl px-4 pt-24 text-center [text-shadow:0_2px_20px_rgba(0,0,0,0.55)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white">
            Fakulta architektury VUT · studentský festival
          </p>
          <h1 className="mt-3 font-display text-6xl font-bold leading-[0.95] sm:text-7xl md:text-8xl" style={{ letterSpacing: "0.2em" }}>
            {"MAŘENA".split("").map((ch, i) => (
              <span key={i} className="marena-letter" style={{ animationDelay: `${i * -0.4}s` }}>
                {ch}
              </span>
            ))}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white">
            Týden, na který do konce školy nezapomeneš. Přednášky, bar na dvoře, party večery, velký
            průvod městem a křest prváků na Flédě.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-marigold-600 px-4 py-1.5 text-sm font-semibold text-white [text-shadow:none]">
            🐣 Jsi prvák? Tohle je tvůj vstup do života na fakultě.
          </div>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a href={IG_URL} target="_blank" rel="noreferrer" className="btn-primary px-6 py-3 text-base text-white [text-shadow:none]">
              Sleduj nás na Instagramu →
            </a>
            <a href="#co-te-ceka" className="rounded-full border border-white/60 bg-black/25 px-6 py-3 text-base font-semibold text-white [text-shadow:none] transition hover:bg-black/40">
              Co tě čeká ↓
            </a>
          </div>
        </div>
      </section>

      {/* CO TĚ ČEKÁ */}
      <section id="co-te-ceka" className="mx-auto max-w-6xl scroll-mt-8 px-4 py-16 md:py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-marigold-700">Na co se těšit</p>
          <h2 className="mt-2 font-display text-4xl font-bold tracking-tight">Co tě na Mařeně čeká</h2>
          <p className="mt-3 text-ink-soft">
            Mařena je týdenní (cca 7–10 dní) festival na přelomu září a října. Celá fakulta ožije —
            a ty jsi u toho. Tady je, na co se můžeš těšit:
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {LINEUP.map((item) => (
            <article key={item.title} className="group card overflow-hidden">
              <Photo src={item.photo} alt={item.title} label={`foto — ${item.title}`} className="aspect-[4/3] w-full" />
              <div className="p-5">
                <h3 className="flex items-center gap-2.5 font-display text-lg font-semibold">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-marigold-50 text-marigold-700">
                    <Icon name={item.icon} className="h-5 w-5" />
                  </span>
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-ink-soft">{item.text}</p>
              </div>
            </article>
          ))}
        </div>

        {/* FINÁLE — křest na Flédě (přes celou šířku) */}
        <article className="relative mt-5 overflow-hidden rounded-3xl">
          <Photo src="/photos/finale.jpg" alt="Křest na Flédě — koncert" label="finále — koncert na Flédě (přidej /photos/finale.jpg)" className="h-80 w-full md:h-[28rem]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10" />
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 [text-shadow:0_2px_16px_rgba(0,0,0,0.6)]">
            <span className="inline-flex items-center gap-1 rounded-full bg-marigold-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              Velké finále
            </span>
            <h3 className="mt-3 flex items-center gap-3 font-display text-3xl font-bold tracking-tight text-white md:text-5xl">
              <Icon name="star" className="h-8 w-8 md:h-10 md:w-10" /> Křest na Flédě
            </h3>
            <p className="mt-2 max-w-2xl text-white/90 md:text-lg">
              Vyvrcholení celého týdne — průvod dorazí do klubu Fléda, kde se pasují prváci a hraje se
              koncert do brzkého rána. Tady to celé vrcholí.
            </p>
          </div>
        </article>
      </section>

      {/* MAŘENA BAND */}
      <section className="relative h-[26rem] md:h-[34rem]">
        <Photo src="/photos/letters.jpg" alt="Nápis MAŘENA před Fakultou architektury VUT" label="MAŘENA před fakultou" className="absolute inset-0 h-full w-full" imgClass="object-bottom" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/15 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-6xl items-start px-4 pt-8">
          <p className="max-w-2xl font-display text-2xl font-semibold tracking-tight text-white md:text-4xl [text-shadow:0_2px_18px_rgba(0,0,0,0.65)]">
            Celá fakulta se na týden promění v jeden velký festival.
          </p>
        </div>
      </section>

      {/* JAK TO PROBÍHÁ */}
      <section className="bg-paper">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="font-display text-3xl font-bold tracking-tight">Jak týden probíhá</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <div key={s.day} className="relative rounded-3xl border border-black/[0.06] bg-white p-5">
                <div className="font-display text-3xl font-bold text-marigold-600">{i + 1}</div>
                <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-ink-soft">{s.day}</p>
                <p className="mt-1 text-[15px]">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INSTAGRAM CTA */}
      <section className="bg-plum-700 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 py-16 text-center md:py-20">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white/10 text-white ring-1 ring-white/15">
            <Icon name="instagram" className="h-9 w-9" />
          </span>
          <h2 className="font-display text-4xl font-bold tracking-tight">Všechno ostatní najdeš na Instagramu</h2>
          <p className="max-w-xl text-white/75">
            Program na každý den, novinky, medailonky hostů, fotky a story z celého týdne. Dej follow,
            ať ti nic neunikne — tam se to celé děje.
          </p>
          <a href={IG_URL} target="_blank" rel="noreferrer" className="btn-primary px-7 py-3.5 text-base">
            <Icon name="instagram" className="h-5 w-5" /> {IG_HANDLE}
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-black/10 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-8 text-sm text-ink-soft">
          <Logo />
          <p>Studentská akce Fakulty architektury VUT · organizují studenti</p>
          <div className="flex items-center gap-4">
            <a href={IG_URL} target="_blank" rel="noreferrer" className="font-medium text-marigold-700 hover:underline">
              Instagram
            </a>
            <Link href="/prihlaseni" className="hover:text-ink">
              Organizátoři →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
