"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { useActive, useNav } from "../nav";
import { useStore } from "../store";
import { Icon } from "../icons";
import { Screen } from "../ui";
import { LAYER_INFO, type Layer } from "../model3d";

const Model3D = dynamic(() => import("../model3d"), {
  ssr: false,
  loading: () => (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <img src="/aplikace/scene/model.jpg" alt="" style={{ width: "92%", opacity: 0.5 }} />
    </div>
  ),
});

type P = { params: Record<string, unknown> };
type Lab = { key: string; text: string; x: number; y: number; color: string; vis: boolean };

export function Model({ params }: P) {
  const nav = useNav();
  const active = useActive();
  const { s } = useStore();
  const initial = typeof params.layer === "string" && params.layer in LAYER_INFO ? (params.layer as Layer) : "vse";
  const [layer, setLayer] = useState<Layer | "vse">(initial);
  // Prohlídka jako ve videu: vrstvy se postupně rozsvítí, pak zůstanou všechny. Klepnutí ji ukončí.
  const [tour, setTour] = useState(initial === "vse");
  useEffect(() => {
    if (!active || !tour) return;
    const seq: (Layer | "vse")[] = ["elektro", "voda", "topeni", "plyn", "vse"];
    const ids = seq.map((l, i) =>
      window.setTimeout(() => {
        setLayer(l);
        if (i === seq.length - 1) setTour(false);
      }, 1600 + i * 2200),
    );
    return () => ids.forEach(clearTimeout);
  }, [active, tour]);
  const pickLayer = (l: Layer | "vse") => {
    setTour(false);
    setLayer(l);
  };
  const [labels, setLabels] = useState<Lab[]>([]);
  const onLabels = useCallback((items: Lab[]) => setLabels(items), []);
  const leak = !!s.leak && s.leak.phase !== "fixed";
  const repaired = s.leak?.phase === "fixed";
  const layers = Object.keys(LAYER_INFO) as Layer[];

  return (
    <Screen bg="#ECE8E2">
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 80% at 70% 30%, #F7F5F2 0%, #E6E1DA 70%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: "calc(var(--sb) + 96px)", bottom: 190 }}>
        {active && <Model3D layer={layer} leak={leak} repaired={repaired} onLabels={onLabels} />}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
          {labels
            .filter((l) => l.vis)
            .map((l) => (
              <span key={l.key} style={{ position: "absolute", left: l.x, top: l.y, transform: "translate(-50%,-130%)", display: "flex", alignItems: "center", gap: 6, height: 26, padding: "0 10px 0 8px", borderRadius: 13, background: "rgba(255,255,255,0.95)", boxShadow: "0 3px 10px rgba(40,30,20,0.18)", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", color: "#141414" }}>
                <i style={{ width: 8, height: 8, borderRadius: 4, background: l.color, display: "inline-block" }} />
                {l.text}
              </span>
            ))}
        </div>
      </div>
      <div style={{ position: "absolute", left: 20, right: 20, top: "var(--sb)", paddingTop: 8, display: "flex", flexDirection: "column", gap: 6, pointerEvents: "none" }}>
        <div className="nav" style={{ pointerEvents: "auto" }}>
          <button type="button" className="navb" onClick={nav.back}>
            <Icon name="back" size={24} color="#B5543A" sw={2.4} />
            Dům
          </button>
          <span className="chip" style={{ background: "rgba(255,255,255,0.85)", color: "#141414" }}>
            <Icon name="cube" size={14} />
            BIM · verze 12
          </span>
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: "#B5543A" }}>MODEL DOMU</span>
        <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1 }}>Všechny rozvody na jednom místě.</span>
      </div>
      <div style={{ position: "absolute", left: 10, right: 10, bottom: "max(calc(var(--hb) - 6px), 10px)", background: "rgba(255,255,255,0.96)", borderRadius: 26, padding: "12px 12px 10px", boxShadow: "0 10px 30px rgba(40,24,14,0.14)", display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 4px" }}>
          <span style={{ fontSize: 13, color: "#6F6A65" }}>Z výkresů v ArchiCADu a záběrů ze stavby</span>
          <button type="button" className="chip" onClick={() => pickLayer("vse")} style={{ height: 28, background: layer === "vse" ? "#141414" : "#F2F0ED", color: layer === "vse" ? "#fff" : "#141414" }}>
            Vše
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          {layers.map((k) => {
            const on = layer === k;
            return (
              <button key={k} type="button" onClick={() => pickLayer(on ? "vse" : k)} aria-pressed={on} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "8px 10px", borderRadius: 14, background: on ? "#F4E4DD" : "#F7F5F2", textAlign: "left", opacity: layer === "vse" || on ? 1 : 0.55 }}>
                <span style={{ width: 18, height: 5, borderRadius: 3, background: LAYER_INFO[k].color, marginTop: 7, flex: "none" }} />
                <span style={{ display: "flex", flexDirection: "column", gap: 1, minWidth: 0 }}>
                  <b style={{ fontSize: 14 }}>{LAYER_INFO[k].name}</b>
                  <span style={{ fontSize: 11, color: "#6F6A65", lineHeight: 1.3 }}>{LAYER_INFO[k].sub}</span>
                </span>
              </button>
            );
          })}
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#B5543A", padding: "0 4px" }}>Každá trasa má zdroj a přesnost.</span>
      </div>
    </Screen>
  );
}
