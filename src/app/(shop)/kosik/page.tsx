"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatCZK, withVat } from "@/lib/format";
import { featuredProducts } from "@/data/catalog";
import ProductCard from "@/components/ProductCard";

type CustomerType = "koncovy" | "zivnostnik" | "firma";

export default function CartPage() {
  const { items, total, setQty, remove, clear } = useCart();
  const [type, setType] = useState<CustomerType>("firma");
  const [done, setDone] = useState<string | null>(null);

  const isBusiness = type !== "koncovy";

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // Fáze 1: objednávka se zatím neukládá do databáze – jen potvrzení.
    const ref = "EIKA-" + Math.floor(100000 + Math.random() * 900000);
    setDone(ref);
    clear();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="w-16 h-16 mx-auto rounded-full grid place-items-center text-white text-3xl" style={{ background: "var(--color-success)" }}>
          ✓
        </div>
        <h1 className="mt-6 text-3xl font-extrabold">Objednávka odeslána</h1>
        <p className="mt-2 text-[var(--color-ink-soft)]">
          Děkujeme! Vaše poptávka <strong>{done}</strong> byla přijata. Brzy se
          vám ozveme s potvrzením a termínem dodání.
        </p>
        <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
          (Demo Fáze 1 — objednávka se zatím neukládá do databáze.)
        </p>
        <Link
          href="/katalog"
          className="inline-block mt-8 px-6 py-3 rounded-md font-semibold text-white"
          style={{ background: "var(--color-accent)" }}
        >
          Pokračovat v nákupu
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-3xl font-extrabold">Košík je prázdný</h1>
        <p className="mt-2 text-[var(--color-ink-soft)]">
          Přidejte zboží z katalogu a vraťte se sem pro dokončení objednávky.
        </p>
        <Link
          href="/katalog"
          className="inline-block mt-8 px-6 py-3 rounded-md font-semibold text-white"
          style={{ background: "var(--color-accent)" }}
        >
          Procházet katalog
        </Link>
      </div>
    );
  }

  const vat = withVat(total) - total;
  const inCart = new Set(items.map((i) => i.slug));
  const recommended = featuredProducts()
    .filter((p) => !inCart.has(p.slug))
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-6">Košík a objednávka</h1>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
        {/* Items + form */}
        <div className="space-y-8">
          {/* Items */}
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden">
            {items.map((i) => (
              <div
                key={i.slug}
                className="flex items-center gap-4 p-4 border-b border-[var(--color-border)] last:border-0"
              >
                <div className="flex-1">
                  <Link href={`/produkt/${i.slug}`} className="font-semibold hover:text-[var(--color-accent)]">
                    {i.name}
                  </Link>
                  <div className="text-xs text-[var(--color-ink-soft)]">
                    Kód: {i.sku} · {formatCZK(i.price)} / {i.unit}
                  </div>
                </div>

                <div className="flex items-center border border-[var(--color-border)] rounded-md">
                  <button onClick={() => setQty(i.slug, i.qty - 1)} className="px-2.5 py-1 text-[var(--color-ink-soft)]" aria-label="Méně">−</button>
                  <input
                    type="number"
                    min={1}
                    value={i.qty}
                    onChange={(e) => setQty(i.slug, Math.max(1, Number(e.target.value) || 1))}
                    className="w-12 text-center outline-none py-1"
                  />
                  <button onClick={() => setQty(i.slug, i.qty + 1)} className="px-2.5 py-1 text-[var(--color-ink-soft)]" aria-label="Více">+</button>
                </div>

                <div className="w-24 text-right font-bold">
                  {formatCZK(i.price * i.qty)}
                </div>

                <button
                  onClick={() => remove(i.slug)}
                  className="text-[var(--color-ink-soft)] hover:text-[var(--color-accent)] text-sm"
                  aria-label="Odebrat"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Order form */}
          <form onSubmit={submit} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 space-y-5">
            <h2 className="text-lg font-bold">Údaje objednavatele</h2>

            <div>
              <label className="block text-sm font-medium mb-1.5">Typ zákazníka</label>
              <div className="grid grid-cols-3 gap-2">
                {([
                  ["firma", "Firma"],
                  ["zivnostnik", "Živnostník"],
                  ["koncovy", "Koncový zákazník"],
                ] as [CustomerType, string][]).map(([val, label]) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setType(val)}
                    className={`px-3 py-2 rounded-md text-sm font-medium border transition ${
                      type === val
                        ? "text-white border-transparent"
                        : "border-[var(--color-border)] hover:border-[var(--color-accent)]"
                    }`}
                    style={type === val ? { background: "var(--color-accent)" } : undefined}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label={isBusiness ? "Název firmy / jméno" : "Jméno a příjmení"} required />
              <Field label="E-mail" type="email" required />
              <Field label="Telefon" type="tel" required />
              <Field label="Město / dodací adresa" required />
              {isBusiness && <Field label="IČO" required />}
              {isBusiness && <Field label="DIČ" />}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Způsob dodání</label>
              <select className="w-full px-3 py-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] outline-none focus:border-[var(--color-accent)]">
                <option>Závoz na adresu</option>
                <option>Osobní odběr — pobočka Brno</option>
                <option>Osobní odběr — pobočka Znojmo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Poznámka k objednávce</label>
              <textarea
                rows={3}
                placeholder="Např. požadované dělení materiálu, termín závozu…"
                className="w-full px-3 py-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] outline-none focus:border-[var(--color-accent)]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-md font-semibold text-white"
              style={{ background: "var(--color-accent)" }}
            >
              Odeslat objednávku
            </button>
            <p className="text-xs text-[var(--color-ink-soft)] text-center">
              Odesláním nezávazně poptáváte zboží. Potvrdíme dostupnost, cenu a termín.
            </p>
          </form>
        </div>

        {/* Summary */}
        <aside className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 lg:sticky lg:top-28">
          <h2 className="text-lg font-bold mb-4">Souhrn</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-[var(--color-ink-soft)]">Mezisoučet (bez DPH)</dt>
              <dd className="font-semibold">{formatCZK(total)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--color-ink-soft)]">DPH 21 %</dt>
              <dd className="font-semibold">{formatCZK(vat)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--color-ink-soft)]">Doprava</dt>
              <dd className="font-semibold">dle dohody</dd>
            </div>
          </dl>
          <div className="border-t border-[var(--color-border)] mt-4 pt-4 flex justify-between items-end">
            <span className="font-semibold">Celkem s DPH</span>
            <span className="text-2xl font-extrabold">{formatCZK(withVat(total))}</span>
          </div>
        </aside>
      </div>

      {/* Recommended */}
      {recommended.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Mohlo by se hodit</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recommended.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Field({
  label,
  type = "text",
  required,
}: {
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1.5">
        {label} {required && <span className="text-[var(--color-accent)]">*</span>}
      </span>
      <input
        type={type}
        required={required}
        className="w-full px-3 py-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] outline-none focus:border-[var(--color-accent)]"
      />
    </label>
  );
}
