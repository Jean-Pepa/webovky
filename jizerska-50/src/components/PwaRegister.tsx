"use client";

import { useEffect } from "react";

// Registrace service workeru (offline režim). Běží jen v prohlížeči, po načtení.
export default function PwaRegister() {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    const onLoad = () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {
        /* SW selže mimo zabezpečený kontext (http mimo localhost) — appka i tak funguje online */
      });
    };
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return null;
}
