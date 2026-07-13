"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import { startAutoTracking, trackPageview, setIdentity } from "@/lib/analytics-client";

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
    setIdentity(me || "");
  }, [me]);

  useEffect(() => {
    if (ready && pathname) trackPageview(pathname);
  }, [pathname, ready]);

  return null;
}
