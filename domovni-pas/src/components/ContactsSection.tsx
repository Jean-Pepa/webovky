"use client";

import { useState } from "react";
import { useStore, type Contact, type ContactKind } from "@/lib/store";
import { IconPhone, IconPlus, IconTrash } from "@/components/Icons";

const KIND_LABEL: Record<ContactKind, string> = {
  VYBOR: "Výbor",
  SPRAVCE: "Správce",
  DODAVATEL: "Dodavatelé",
};
const KIND_ORDER: ContactKind[] = ["VYBOR", "SPRAVCE", "DODAVATEL"];

export function ContactsSection({
  propertyId,
  contacts,
}: {
  propertyId: string;
  contacts: Contact[];
}) {
  const { addContact, deleteContact } = useStore();
  const [open, setOpen] = useState(false);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    if (!name) return;
    addContact(propertyId, {
      name,
      kind: (String(fd.get("kind")) as ContactKind) || "VYBOR",
      position: String(fd.get("position") || "").trim() || undefined,
      phone: String(fd.get("phone") || "").trim() || undefined,
      email: String(fd.get("email") || "").trim() || undefined,
    });
    e.currentTarget.reset();
    setOpen(false);
  }

  return (
    <section className="card p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconPhone className="h-4 w-4 text-teal-700" />
          <h2 className="text-sm font-semibold text-stone-900">Kontakty</h2>
          {contacts.length > 0 && <span className="text-xs text-stone-400">· {contacts.length}</span>}
        </div>
        <button onClick={() => setOpen((o) => !o)} className="btn-ghost btn-sm text-teal-700">
          <IconPlus className="h-4 w-4" />
          Přidat
        </button>
      </div>

      {open && (
        <form onSubmit={submit} className="mt-3 grid gap-2 border-b border-stone-100 pb-4 sm:grid-cols-2">
          <input name="name" required className="input" placeholder="Jméno / firma" />
          <select name="kind" className="input" defaultValue="VYBOR">
            <option value="VYBOR">Výbor</option>
            <option value="SPRAVCE">Správce</option>
            <option value="DODAVATEL">Dodavatel</option>
          </select>
          <input name="position" className="input" placeholder="Funkce / obor (předseda, instalatér…)" />
          <input name="phone" className="input" placeholder="Telefon" />
          <input name="email" type="email" className="input sm:col-span-2" placeholder="E-mail" />
          <button className="btn-secondary sm:col-span-2" type="submit">
            Přidat kontakt
          </button>
        </form>
      )}

      {contacts.length === 0 ? (
        !open && <p className="mt-2 text-sm text-stone-500">Zatím žádné kontakty.</p>
      ) : (
        <div className="mt-3 space-y-4">
          {KIND_ORDER.filter((k) => contacts.some((c) => c.kind === k)).map((kind) => (
            <div key={kind}>
              <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                {KIND_LABEL[kind]}
              </p>
              <ul className="mt-1.5 divide-y divide-stone-100">
                {contacts
                  .filter((c) => c.kind === kind)
                  .map((c) => (
                    <li key={c.id} className="flex items-center justify-between gap-3 py-2.5">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-stone-800">{c.name}</p>
                        {c.position && <p className="truncate text-xs text-stone-400">{c.position}</p>}
                      </div>
                      <div className="flex shrink-0 items-center gap-3 text-sm">
                        {c.phone && (
                          <a href={`tel:${c.phone.replace(/\s/g, "")}`} className="font-medium text-teal-700 hover:underline">
                            {c.phone}
                          </a>
                        )}
                        {c.email && (
                          <a href={`mailto:${c.email}`} className="text-stone-500 hover:text-teal-700" title={c.email}>
                            @
                          </a>
                        )}
                        <button
                          onClick={() => {
                            if (confirm("Smazat kontakt?")) deleteContact(propertyId, c.id);
                          }}
                          className="text-stone-300 hover:text-red-600"
                          aria-label="Smazat"
                        >
                          <IconTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
