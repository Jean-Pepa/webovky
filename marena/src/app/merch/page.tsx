"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { DB } from "@/lib/types";

const LS_DB = "marena_db"; // demo režim (localStorage) — stejný klíč jako ve store

// Veřejný rozcestník — najde nejnovější ročník a přesměruje na jeho merch stránku.
// Díky tomu je odkaz z homepage (/merch) stálý a vždy ukáže aktuální nabídku.
export default function MerchIndexPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "none">("loading");

  useEffect(() => {
    let cancelled = false;
    const newestOf = (years: { id: string }[]) =>
      [...years].sort((a, b) => b.id.localeCompare(a.id, "cs", { numeric: true }))[0];

    (async () => {
      try {
        const res = await fetch("/api/merch", { cache: "no-store" });
        if (res.ok) {
          const j = (await res.json()) as { yearId?: string };
          if (!cancelled && j.yearId) {
            router.replace(`/merch/${j.yearId}`);
            return;
          }
        }
        if (res.status === 404) {
          if (!cancelled) setStatus("none");
          return;
        }
        // 503 → demo režim níže
      } catch {
        /* síť selhala → demo režim */
      }
      try {
        const raw = localStorage.getItem(LS_DB);
        const db = raw ? (JSON.parse(raw) as DB) : null;
        const years = db?.years ?? [];
        if (!years.length) {
          if (!cancelled) setStatus("none");
          return;
        }
        if (!cancelled) router.replace(`/merch/${newestOf(years).id}`);
      } catch {
        if (!cancelled) setStatus("none");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="grid min-h-screen place-items-center bg-paper px-4 text-center text-sm text-ink-soft">
      {status === "loading" ? "Načítám merch…" : "Merch zatím není dostupný."}
    </div>
  );
}
