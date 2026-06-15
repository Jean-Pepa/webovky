"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/lib/store";

export function TransferForm({ propertyId }: { propertyId: string }) {
  const { transferProperty } = useStore();
  const router = useRouter();
  const [pending, setPending] = useState(false);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const toName = String(fd.get("toName") || "").trim();
    if (!toName) return;
    setPending(true);
    transferProperty(propertyId, toName, String(fd.get("note") || "").trim() || undefined);
    router.push(`/nemovitost/${propertyId}`);
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="label" htmlFor="toName">
          Jméno / e-mail nového majitele *
        </label>
        <input id="toName" name="toName" required className="input" placeholder="Např. Petr Svoboda" />
      </div>
      <div>
        <label className="label" htmlFor="note">
          Poznámka (volitelné)
        </label>
        <textarea id="note" name="note" className="input" placeholder="Např. prodej dle smlouvy ze dne…" />
      </div>

      <label className="flex items-start gap-2.5 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
        <input type="checkbox" required className="mt-0.5" />
        Rozumím, že tím nemovitost i s celou historií předávám novému majiteli.
      </label>

      <div className="flex gap-3">
        <button type="submit" className="btn-primary" disabled={pending}>
          Předat nemovitost
        </button>
        <Link href={`/nemovitost/${propertyId}`} className="btn-secondary">
          Zrušit
        </Link>
      </div>
    </form>
  );
}
