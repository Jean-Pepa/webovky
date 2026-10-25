"use client";

import dynamic from "next/dynamic";

// Aplikace běží jen v prohlížeči (kamera, úložiště, gesta) — bez vykreslení na serveru.
const BuloApp = dynamic(() => import("@/bulo/App"), {
  ssr: false,
  loading: () => (
    <div style={{ position: "fixed", inset: 0, display: "grid", placeItems: "center", background: "#F2F0ED" }}>
      <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, letterSpacing: "0.32em", color: "#B5543A", fontSize: 15 }}>BULO</span>
    </div>
  ),
});

export function BuloLoader({ code }: { code?: string }) {
  return <BuloApp code={code} />;
}
