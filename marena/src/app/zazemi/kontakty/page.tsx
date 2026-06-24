"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { fmtRelative } from "@/lib/format";
import { DeleteButton } from "@/components/DeleteButton";

// Z hodnoty se pokusíme udělat klikací odkaz (web / e-mail / telefon).
function hrefFor(value: string): string | null {
  const v = value.trim();
  if (/^https?:\/\//i.test(v)) return v;
  if (/^www\./i.test(v)) return `https://${v}`;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return `mailto:${v}`;
  if (/^\+?[\d ]{7,}$/.test(v)) return `tel:${v.replace(/\s/g, "")}`;
  return null;
}

export default function KontaktyPage() {
  const { currentYear, dispatch } = useStore();
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [note, setNote] = useState("");
  const [open, setOpen] = useState(false);

  const year = currentYear;
  if (!year) return null;
  const links = year.links ?? [];

  async function add() {
    if (!label.trim() || !value.trim() || !year) return;
    await dispatch({ type: "addLink", yearId: year.id, label, value, note });
    setLabel("");
    setValue("");
    setNote("");
    setOpen(false);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Kontakty &amp; odkazy — {year.label}</h1>
          <p className="text-sm text-ink-soft">Důležité kontakty, odkazy a přístupy na jednom místě.</p>
        </div>
        <button className="btn-primary" onClick={() => setOpen((v) => !v)}>
          {open ? "Zavřít" : "+ Přidat"}
        </button>
      </div>

      {open && (
        <div className="card space-y-2 p-4">
          <input className="input" placeholder="Název (např. Fléda, sponzor, tiskárna, Google Disk)" value={label} onChange={(e) => setLabel(e.target.value)} />
          <input className="input" placeholder="Odkaz / e-mail / telefon / poznámka" value={value} onChange={(e) => setValue(e.target.value)} />
          <input className="input" placeholder="Doplňující poznámka (nepovinné)" value={note} onChange={(e) => setNote(e.target.value)} />
          <button className="btn-primary" onClick={add}>
            Uložit kontakt
          </button>
        </div>
      )}

      {links.length === 0 ? (
        <div className="card grid place-items-center p-10 text-center text-sm text-ink-soft">
          Zatím žádné kontakty. Přidej ty důležité (Soňa, Fléda, sponzoři, tiskárna…).
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {links.map((l) => {
            const href = hrefFor(l.value);
            return (
              <li key={l.id} className="card flex flex-col p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-base font-semibold">{l.label}</h3>
                  <DeleteButton onConfirm={() => dispatch({ type: "removeLink", yearId: year.id, linkId: l.id })} />
                </div>
                {href ? (
                  <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="mt-0.5 break-words text-sm font-medium text-marigold-700 hover:underline">
                    {l.value}
                  </a>
                ) : (
                  <p className="mt-0.5 break-words text-sm text-ink-soft">{l.value}</p>
                )}
                {l.note && <p className="mt-1 text-xs text-ink-soft">{l.note}</p>}
                <p className="mt-auto pt-2 text-[11px] text-ink-soft/70">{fmtRelative(l.createdAt)}</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
