"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { DeleteButton } from "@/components/DeleteButton";
import type { LinkItem } from "@/lib/types";

// Doporučené pořadí složek; cokoliv navíc se zařadí za ně, prázdné jako „Ostatní".
const FOLDER_ORDER = ["Fakulta", "Město a úřady", "Klub Fléda", "Dodavatelé", "Sponzoři", "Kapely a DJs", "Tiskárny", "Interní", "Ostatní"];

function slug(s: string): string {
  return "f-" + s.toLowerCase().replace(/[^a-z0-9]+/gi, "-");
}

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
  const [folder, setFolder] = useState("");
  const [note, setNote] = useState("");
  const [open, setOpen] = useState(false);

  const year = currentYear;
  const links = useMemo(() => year?.links ?? [], [year]);

  // Seskupení podle složky + seřazení složek dle FOLDER_ORDER.
  const folders = useMemo(() => {
    const map = new Map<string, LinkItem[]>();
    for (const l of links) {
      const key = l.folder?.trim() || "Ostatní";
      const arr = map.get(key) || [];
      arr.push(l);
      map.set(key, arr);
    }
    const keys = [...map.keys()].sort((a, b) => {
      const ia = FOLDER_ORDER.indexOf(a);
      const ib = FOLDER_ORDER.indexOf(b);
      return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib) || a.localeCompare(b);
    });
    return keys.map((k) => [k, map.get(k)!] as const);
  }, [links]);

  if (!year) return null;

  async function add() {
    if (!label.trim() || !value.trim() || !year) return;
    await dispatch({ type: "addLink", yearId: year.id, label, value, folder: folder || undefined, note });
    setLabel("");
    setValue("");
    setNote("");
    setOpen(false);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Kontakty &amp; odkazy — {year.label}</h1>
          <p className="text-sm text-ink-soft">Důležité kontakty roztříděné do složek. Vpravo se mezi nimi rychle proklikáš.</p>
        </div>
        <button className="btn-primary" onClick={() => setOpen((v) => !v)}>
          {open ? "Zavřít" : "+ Přidat kontakt"}
        </button>
      </div>

      <datalist id="folder-list">
        {FOLDER_ORDER.map((f) => (
          <option key={f} value={f} />
        ))}
      </datalist>

      {open && (
        <div className="card space-y-2 p-4">
          <div className="grid gap-2 sm:grid-cols-2">
            <input className="input" placeholder="Název (např. Fléda, sponzor, tiskárna)" value={label} onChange={(e) => setLabel(e.target.value)} />
            <input className="input" list="folder-list" placeholder="Složka (Fakulta, Úřady, Sponzoři…)" value={folder} onChange={(e) => setFolder(e.target.value)} />
            <input className="input sm:col-span-2" placeholder="Odkaz / e-mail / telefon" value={value} onChange={(e) => setValue(e.target.value)} />
            <input className="input sm:col-span-2" placeholder="Poznámka (nepovinné)" value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
          <button className="btn-primary" onClick={add}>
            Uložit kontakt
          </button>
        </div>
      )}

      {links.length === 0 ? (
        <div className="card grid place-items-center p-10 text-center text-sm text-ink-soft">
          Zatím žádné kontakty. Přidej ty důležité a zařaď je do složek.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_220px]">
          {/* Hlavní obsah — složky pod sebou */}
          <div className="order-2 space-y-8 lg:order-1">
            {folders.map(([name, items]) => (
              <section key={name} id={slug(name)} className="scroll-mt-28">
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-lg">📁</span>
                  <h2 className="font-display text-lg font-semibold">{name}</h2>
                  <span className="chip">{items.length}</span>
                </div>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {items.map((l) => {
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
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>

          {/* Pravá navigace — složky odshora dolů */}
          <aside className="order-1 lg:order-2">
            <nav className="sticky top-28 space-y-1">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-soft">Složky</p>
              {folders.map(([name, items]) => (
                <a key={name} href={`#${slug(name)}`} className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-ink-soft transition hover:bg-paper2 hover:text-ink">
                  <span className="truncate">📁 {name}</span>
                  <span className="ml-2 shrink-0 rounded-full bg-paper2 px-2 text-xs">{items.length}</span>
                </a>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </div>
  );
}
