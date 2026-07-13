"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import { isAdmin } from "@/lib/admin";
import { startAutoTracking, trackPageview, setIdentity, setSuppressed } from "@/lib/analytics-client";

// Napojení první-strana analytiky do celé appky (veřejný web i zázemí). Sleduje
// změny cesty (zobrazení stránek), přebírá přihlášené jméno a zapíná odchyt kliků.
// První zobrazení pošleme až když je store „ready" — tehdy je i jméno (me) hotové,
// takže se přihlášený člověk nezapočítá zbytečně nejdřív jako anonymní návštěvník.
export function AnalyticsTracker() {
  const pathname = usePathname();
  const { me, ready } = useStore();

  useEffect(() => {
    startAutoTracking();
  }, []);

  useEffect(() => {
    // Správce se do statistik nepočítá — vypneme mu sběr dřív, než se cokoli pošle.
    setSuppressed(isAdmin(me));
    setIdentity(me || "");
  }, [me]);

  useEffect(() => {
    if (ready && pathname) trackPageview(pathname);
  }, [pathname, ready]);

  return null;
}
