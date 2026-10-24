"use client";

import { useState } from "react";
import type { Property } from "@/lib/store";
import { countDeadlines, deadlineSummaryText } from "@/lib/deadlines";
import {
  requestNotificationPermission,
  showSystemNotification,
  useNotificationPermission,
} from "./notify";
import { IconAlert, IconCheck } from "@/components/Icons";

// „Upozornění v prohlížeči" — povolení jen na klepnutí; jako spolehlivější cestu nabízí .ics
export function NotificationCard({ properties }: { properties: Property[] /* které uživatel vidí */ }) {
  const permission = useNotificationPermission();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function enable() {
    setBusy(true);
    setMessage(null);
    const result = await requestNotificationPermission();
    setBusy(false);
    if (result === "granted") {
      setMessage("Hotovo — při otevření BULO vás jednou denně upozorníme na blížící se termíny.");
    } else if (result === "denied") {
      setMessage("Upozornění jste nepovolili. Termíny si můžete přidat do kalendáře.");
    }
  }

  async function test() {
    const counts = countDeadlines(properties);
    const ok = await showSystemNotification("BULO – termíny a revize", deadlineSummaryText(counts));
    setMessage(
      ok
        ? "Zkušební upozornění odesláno."
        : "Upozornění se nepodařilo zobrazit — tento prohlížeč je tu nepodporuje.",
    );
  }

  return (
    <section className="card p-5">
      <div className="flex items-center gap-2">
        <IconAlert className="h-4 w-4 shrink-0 text-teal-700" />
        <h2 className="text-sm font-semibold text-stone-900">Upozornění v prohlížeči</h2>
      </div>
      <p className="mt-1 text-sm text-stone-500">
        Když se termín blíží nebo propadne, ukážeme vám při otevření BULO nejvýš jednou denně
        upozornění.
      </p>

      <div className="mt-3">
        {permission === "granted" ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700">
              <IconCheck className="h-4 w-4" />
              Upozornění jsou zapnutá
            </span>
            <button type="button" onClick={test} className="btn-ghost btn-sm min-h-10">
              Vyzkoušet
            </button>
          </div>
        ) : permission === "denied" ? (
          <p className="text-sm text-stone-600">
            Upozornění máte v tomto prohlížeči zablokovaná. Povolíte je v nastavení webu (ikona
            zámku vedle adresy).
          </p>
        ) : permission === "unsupported" ? (
          <p className="text-sm text-stone-600">Tento prohlížeč upozornění neumí.</p>
        ) : (
          <button
            type="button"
            onClick={enable}
            disabled={busy}
            className="btn-primary btn-sm min-h-10"
          >
            {busy ? "Čekám na povolení…" : "Zapnout upozornění"}
          </button>
        )}
        {message && (
          <p role="status" className="mt-2 text-xs text-stone-600">
            {message}
          </p>
        )}
      </div>

      <div className="mt-4 rounded-lg bg-stone-50 p-3 text-xs text-stone-600">
        <p>
          <strong className="font-medium text-stone-800">Spolehlivější je kalendář.</strong>{" "}
          Upozornění v prohlížeči přijde jen při otevření BULO a na telefonu často vůbec (iPhone jen
          u aplikace přidané na plochu, Chrome na Androidu je tu neukáže). Tlačítko „Přidat do kalendáře (.ics)“ uloží termíny do kalendáře v telefonu —
          Google Kalendář, iCloud i Outlook — a ten je připomene sám, předem podle nastavení u
          termínu.
        </p>
      </div>
    </section>
  );
}
