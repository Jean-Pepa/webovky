import Link from "next/link";

const BRANCHES = [
  {
    city: "Brno",
    address: "Vodařská 10, Horní Heršpice, 619 00 Brno",
    phone: "545 233 742",
    tel: "+420545233742",
    email: "brno@eika.cz",
  },
  {
    city: "Znojmo",
    address: "Oblekovice, 671 81 Znojmo",
    phone: "—",
    tel: "",
    email: "info@eika.cz",
  },
];

const HOURS = [
  ["Pondělí – Pátek", "7:00 – 16:00"],
  ["Sobota", "8:00 – 11:00"],
  ["Neděle", "Zavřeno"],
];

export default function ContactPage() {
  return (
    <div>
      <div className="bg-[var(--color-steel-900)] text-white">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <nav className="text-sm text-[var(--color-steel-400)] mb-4">
            <Link href="/" className="hover:text-white">Úvod</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Kontakt</span>
          </nav>
          <h1 className="text-4xl font-extrabold">Kontakt a pobočky</h1>
          <p className="mt-3 max-w-xl text-[var(--color-steel-200)]">
            Jsme tu pro firmy, živnostníky i koncové zákazníky. Ozvěte se nám –
            poradíme s výběrem materiálu, cenou i dopravou.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 grid lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          {BRANCHES.map((b) => (
            <div key={b.city} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
              <h2 className="text-xl font-bold">Pobočka {b.city}</h2>
              <p className="mt-2 text-[var(--color-ink-soft)]">{b.address}</p>
              <div className="mt-3 space-y-1 text-sm">
                {b.tel && (
                  <p>
                    Telefon:{" "}
                    <a href={`tel:${b.tel}`} className="font-semibold text-[var(--color-accent)]">
                      {b.phone}
                    </a>
                  </p>
                )}
                <p>
                  E-mail:{" "}
                  <a href={`mailto:${b.email}`} className="font-semibold text-[var(--color-accent)]">
                    {b.email}
                  </a>
                </p>
              </div>
            </div>
          ))}

          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
            <h2 className="text-xl font-bold mb-3">Otevírací doba</h2>
            <dl className="space-y-2 text-sm">
              {HOURS.map(([d, h]) => (
                <div key={d} className="flex justify-between">
                  <dt className="text-[var(--color-ink-soft)]">{d}</dt>
                  <dd className="font-semibold">{h}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Contact form (demo) */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 h-fit">
          <h2 className="text-xl font-bold mb-1">Napište nám</h2>
          <p className="text-sm text-[var(--color-ink-soft)] mb-5">
            Poptávka, dotaz na sortiment nebo cenu — odpovíme co nejdříve.
          </p>
          <form className="space-y-4">
            <input
              placeholder="Jméno / firma"
              className="w-full px-3 py-2 rounded-md border border-[var(--color-border)] outline-none focus:border-[var(--color-accent)]"
            />
            <input
              type="email"
              placeholder="E-mail"
              className="w-full px-3 py-2 rounded-md border border-[var(--color-border)] outline-none focus:border-[var(--color-accent)]"
            />
            <input
              type="tel"
              placeholder="Telefon"
              className="w-full px-3 py-2 rounded-md border border-[var(--color-border)] outline-none focus:border-[var(--color-accent)]"
            />
            <textarea
              rows={4}
              placeholder="Vaše zpráva…"
              className="w-full px-3 py-2 rounded-md border border-[var(--color-border)] outline-none focus:border-[var(--color-accent)]"
            />
            <button
              type="button"
              className="w-full py-3 rounded-md font-semibold text-white"
              style={{ background: "var(--color-accent)" }}
            >
              Odeslat zprávu
            </button>
            <p className="text-xs text-[var(--color-ink-soft)] text-center">
              Demo Fáze 1 — formulář zatím neodesílá e-mail.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
