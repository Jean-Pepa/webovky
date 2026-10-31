"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";

// Appka běží jen v prohlížeči (Web Audio, mikrofon, localStorage).
const HarmonicaApp = dynamic(() => import("@/components/HarmonicaApp"), {
  ssr: false,
  loading: () => <div className="boot" />,
});

export default function AppLoader() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);
  return <HarmonicaApp />;
}
