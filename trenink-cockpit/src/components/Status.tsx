"use client";

import { dataSource } from "@/lib/store";

export default function Status() {
  const cloud = dataSource === "supabase";
  return (
    <div className="space-y-4">
      <div className={`rounded-2xl border p-4 ${cloud ? "border-green/30 bg-green-050" : "border-orange/30 bg-orange-050"}`}>
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${cloud ? "bg-green" : "bg-orange"}`} />
          <span className="font-semibold">{cloud ? "Cloud režim (Supabase)" : "Lokální režim (jen tento prohlížeč)"}</span>
        </div>
        <p className="mt-1 text-sm text-ink-soft">
          {cloud
            ? "Data i deník jsou v databázi — sdílené mezi zařízeními a Claude do nich vidí. ✅"
            : "Appka běží bez backendu, data zůstávají jen tady v prohlížeči. Pro obousměrné sdílení připoj Supabase (níže)."}
        </p>
      </div>

      <div className="rounded-2xl border border-line bg-card p-4">
        <h3 className="mb-2 text-sm font-semibold">Jak zapnout cloud (jednorázově)</h3>
        <ol className="list-decimal space-y-1.5 pl-5 text-sm text-ink-soft">
          <li>Na <strong>supabase.com</strong> založ projekt (free tier stačí).</li>
          <li>V <strong>SQL Editoru</strong> spusť obsah souboru <code className="rounded bg-paper2 px-1">supabase-schema.sql</code> (vytvoří tabulky).</li>
          <li>Z <strong>Project Settings → API</strong> zkopíruj Project URL, anon key a service_role key.</li>
          <li>Vlož je do <code className="rounded bg-paper2 px-1">.env.local</code> (viz <code className="rounded bg-paper2 px-1">.env.example</code>) a na Vercelu do Environment Variables.</li>
          <li>Řekni Claudovi klíče (nebo je dej do prostředí) — pak z Garminu naplní aktivity a uvidí tvoje zápisy.</li>
        </ol>
      </div>

      <div className="rounded-2xl border border-line bg-card p-4">
        <h3 className="mb-2 text-sm font-semibold">Jak sem tečou data</h3>
        <p className="text-sm text-ink-soft">
          Garmin (Forerunner 965) → <strong>Claude</strong> přes MCP konektor (<code className="rounded bg-paper2 px-1">garmin.slajs.eu</code>) →
          zapíše aktivity do Supabase → tahle appka je zobrazí a vyhodnotí. Deník je obousměrný: ty píšeš, Claude odpovídá analýzami.
          Do budoucna může Clauda nahradit tvůj vlastní bot na PC — píše do stejné databáze.
        </p>
      </div>
    </div>
  );
}
