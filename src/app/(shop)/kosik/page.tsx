"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatCZK, withVat } from "@/lib/format";
import { featuredProducts } from "@/data/catalog";
import ProductCard from "@/components/ProductCard";
import { useI18n } from "@/i18n/context";

type CustomerType = "koncovy" | "zivnostnik" | "firma";

export default function CartPage() {
  const { items, total, setQty, remove, clear } = useCart();
  const { t, unit } = useI18n();
  const [type, setType] = useState<CustomerType>("firma");
  const [done, setDone] = useState<string | null>(null);

  const isBusiness = type !== "koncovy";

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const ref = "EIKA-" + Math.floor(100000 + Math.random() * 900000);
    setDone(ref);
    clear();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="w-16 h-16 mx-auto rounded-full grid place-items-center text-white text-3xl" style={{ background: "var(--color-success)" }}>✓</div>
        <h1 className="mt-6 text-3xl font-extrabold">{t("cart.sent")}</h1>
        <p className="mt-2 text-[var(--color-ink-soft)]">
          <strong>{done}</strong> — {t("cart.sentText")}
        </p>
        <Link href="/katalog" className="inline-block mt-8 px-6 py-3 rounded-full font-semibold text-white" style={{ background: "var(--color-accent)" }}>
          {t("cart.continue")}
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-3xl font-extrabold">{t("cart.empty")}</h1>
        <p className="mt-2 text-[var(--color-ink-soft)]">{t("cart.emptyText")}</p>
        <Link href="/katalog" className="inline-block mt-8 px-6 py-3 rounded-full font-semibold text-white" style={{ background: "var(--color-accent)" }}>
          {t("cart.browse")}
        </Link>
      </div>
    );
  }

  const vat = withVat(total) - total;
  const inCart = new Set(items.map((i) => i.slug));
  const recommended = featuredProducts().filter((p) => !inCart.has(p.slug)).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-6">{t("cart.title")}</h1>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
        <div className="space-y-8">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden">
            {items.map((i) => (
              <div key={i.slug} className="flex items-center gap-4 p-4 border-b border-[var(--color-border)] last:border-0">
                <div className="flex-1">
                  <Link href={`/produkt/${i.slug}`} className="font-semibold hover:text-[var(--color-accent)]">{i.name}</Link>
                  <div className="text-xs text-[var(--color-ink-soft)]">{t("code")}: {i.sku} · {formatCZK(i.price)} / {unit(i.unit)}</div>
                </div>
                <div className="flex items-center border border-[var(--color-border)] rounded-md">
                  <button onClick={() => setQty(i.slug, i.qty - 1)} className="px-2.5 py-1 text-[var(--color-ink-soft)]" aria-label="−">−</button>
                  <input type="number" min={1} value={i.qty} onChange={(e) => setQty(i.slug, Math.max(1, Number(e.target.value) || 1))} className="w-12 text-center outline-none py-1" />
                  <button onClick={() => setQty(i.slug, i.qty + 1)} className="px-2.5 py-1 text-[var(--color-ink-soft)]" aria-label="+">+</button>
                </div>
                <div className="w-24 text-right font-bold">{formatCZK(i.price * i.qty)}</div>
                <button onClick={() => remove(i.slug)} className="text-[var(--color-ink-soft)] hover:text-[var(--color-accent)] text-sm" aria-label="✕">✕</button>
              </div>
            ))}
          </div>

          <form onSubmit={submit} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 space-y-5">
            <h2 className="text-lg font-bold">{t("cart.customerData")}</h2>
            <div>
              <label className="block text-sm font-medium mb-1.5">{t("cart.customerType")}</label>
              <div className="grid grid-cols-3 gap-2">
                {([
                  ["firma", t("cart.company")],
                  ["zivnostnik", t("cart.tradesperson")],
                  ["koncovy", t("cart.consumer")],
                ] as [CustomerType, string][]).map(([val, label]) => (
                  <button key={val} type="button" onClick={() => setType(val)}
                    className={`px-3 py-2 rounded-md text-sm font-medium border transition ${type === val ? "text-white border-transparent" : "border-[var(--color-border)] hover:border-[var(--color-accent)]"}`}
                    style={type === val ? { background: "var(--color-accent)" } : undefined}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label={isBusiness ? t("cart.companyOrName") : t("cart.fullName")} required req={t("cart.required")} />
              <Field label={t("cart.email")} type="email" required req={t("cart.required")} />
              <Field label={t("cart.phone")} type="tel" required req={t("cart.required")} />
              <Field label={t("cart.cityAddress")} required req={t("cart.required")} />
              {isBusiness && <Field label="IČO" required req={t("cart.required")} />}
              {isBusiness && <Field label="DIČ" req={t("cart.required")} />}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">{t("cart.delivery")}</label>
              <select className="w-full px-3 py-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] outline-none focus:border-[var(--color-accent)]">
                <option>{t("cart.delivery.toAddress")}</option>
                <option>{t("cart.delivery.pickupBrno")}</option>
                <option>{t("cart.delivery.pickupZnojmo")}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">{t("cart.note")}</label>
              <textarea rows={3} placeholder={t("cart.notePlaceholder")} className="w-full px-3 py-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] outline-none focus:border-[var(--color-accent)]" />
            </div>
            <button type="submit" className="w-full py-3 rounded-full font-semibold text-white" style={{ background: "var(--color-accent)" }}>
              {t("cart.submit")}
            </button>
            <p className="text-xs text-[var(--color-ink-soft)] text-center">{t("cart.submitNote")}</p>
          </form>
        </div>

        <aside className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 lg:sticky lg:top-28">
          <h2 className="text-lg font-bold mb-4">{t("cart.summary")}</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-[var(--color-ink-soft)]">{t("cart.subtotal")}</dt><dd className="font-semibold">{formatCZK(total)}</dd></div>
            <div className="flex justify-between"><dt className="text-[var(--color-ink-soft)]">{t("cart.vat")}</dt><dd className="font-semibold">{formatCZK(vat)}</dd></div>
            <div className="flex justify-between"><dt className="text-[var(--color-ink-soft)]">{t("cart.shipping")}</dt><dd className="font-semibold">{t("cart.shippingValue")}</dd></div>
          </dl>
          <div className="border-t border-[var(--color-border)] mt-4 pt-4 flex justify-between items-end">
            <span className="font-semibold">{t("cart.totalVat")}</span>
            <span className="text-2xl font-extrabold">{formatCZK(withVat(total))}</span>
          </div>
        </aside>
      </div>

      {recommended.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">{t("cart.recommended")}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recommended.map((p) => (<ProductCard key={p.slug} product={p} />))}
          </div>
        </section>
      )}
    </div>
  );
}

function Field({ label, type = "text", required, req }: { label: string; type?: string; required?: boolean; req?: string }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1.5">
        {label} {required && <span className="text-[var(--color-accent)]" title={req}>*</span>}
      </span>
      <input type={type} required={required} className="w-full px-3 py-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] outline-none focus:border-[var(--color-accent)]" />
    </label>
  );
}
