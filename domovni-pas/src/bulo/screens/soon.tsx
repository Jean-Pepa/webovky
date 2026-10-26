"use client";

import { useState } from "react";
import { Icon } from "../icons";
import { useNav } from "../nav";
import { useStore } from "../store";
import { AGENT_DEADLINES, AGENT_FEED, AGENT_ROLES, TONES } from "../data";
import { Body, Chip, Nav, Screen, Title, useTablet } from "../ui";
import { useTick } from "./common";

type P = { params: Record<string, unknown> };

// Diagram: pas domu uprostřed, profese kolem, podklady tečou dovnitř.
function AgentDiagram({ w = 350, h = 300 }: { w?: number; h?: number }) {
  const t = useTick(60);
  const cx = w / 2;
  const cy = h / 2;
  const R = Math.min(w, h) * 0.4;
  const nodes = AGENT_ROLES.map((r, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / AGENT_ROLES.length;
    return { ...r, x: cx + Math.cos(a) * R * 1.12, y: cy + Math.sin(a) * R };
  });
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: "auto", display: "block" }} role="img" aria-label="Agent projektu: podklady od všech profesí tečou do pasu domu">
      {nodes.map((n, i) => {
        const p = (t * 0.35 + i * 0.13) % 1;
        return (
          <g key={n.k}>
            <line x1={n.x} y1={n.y} x2={cx} y2={cy} stroke="#D9D2C9" strokeWidth={1.2} strokeDasharray="2 5" />
            <circle cx={n.x + (cx - n.x) * p} cy={n.y + (cy - n.y) * p} r={3.2} fill={n.c} opacity={1 - p * 0.6} />
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={R * 0.42} fill="#B5543A" />
      <circle cx={cx} cy={cy} r={R * 0.42 + 6 + 4 * Math.sin(t * 2)} fill="none" stroke="#B5543A" strokeOpacity={0.25} strokeWidth={2} />
      <text x={cx} y={cy - 12} textAnchor="middle" fontFamily="Inter" fontSize="8" fontWeight="800" letterSpacing="2.4" fill="#F4E4DD">
        BULO
      </text>
      <text x={cx} y={cy + 6} textAnchor="middle" fontFamily="Inter" fontSize="15" fontWeight="700" fill="#fff">
        Pas domu
      </text>
      <text x={cx} y={cy + 21} textAnchor="middle" fontFamily="Inter" fontSize="9" fill="#F4E4DD">
        Chata Loučky
      </text>
      {nodes.map((n) => {
        const lw = n.k.length * 6.2 + 34;
        return (
          <g key={`n-${n.k}`}>
            <rect x={n.x - lw / 2} y={n.y - 12} width={lw} height={24} rx={12} fill="#fff" stroke="#E6E2DD" />
            <circle cx={n.x - lw / 2 + 12} cy={n.y} r={6} fill={n.c} fillOpacity={0.18} />
            <circle cx={n.x - lw / 2 + 12} cy={n.y} r={2.5} fill={n.c} />
            <text x={n.x - lw / 2 + 22} y={n.y + 4} fontFamily="Inter" fontSize="10.5" fontWeight="600" fill="#141414">
              {n.k}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function Summary() {
  return (
    <div className="card" style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 8 }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: "#B5543A", display: "flex", alignItems: "center", gap: 6 }}>
        <Icon name="sparkle" size={14} color="#B5543A" />
        Shrnutí od agenta
      </span>
      <span style={{ fontSize: 17, lineHeight: 1.45 }}>Dnes přišly 3 nové podklady. Jeden protokol čeká na podpis, hlídám ho. Tento týden jsou 2 termíny.</span>
    </div>
  );
}

function Deadlines() {
  return (
    <div className="card" style={{ padding: "14px 18px", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: 6 }}>
        <b style={{ fontSize: 15 }}>Termíny</b>
        <span style={{ fontSize: 12, color: "#6F6A65" }}>hlídá agent</span>
      </div>
      {AGENT_DEADLINES.map((d) => (
        <div key={d.title} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 8px", borderTop: "1px solid #E6E2DD", background: d.hot ? "#F8ECD8" : undefined, borderRadius: d.hot ? 8 : 0 }}>
          <span className="chip" style={{ width: 82, justifyContent: "center", background: d.hot ? "transparent" : TONES[d.tone].bg, color: d.hot ? "#A8661A" : TONES[d.tone].fg, flex: "none" }}>
            {d.when}
          </span>
          <span className="rt">
            <b style={{ fontSize: 14 }}>{d.title}</b>
            <span style={{ fontSize: 12 }}>{d.who}</span>
          </span>
        </div>
      ))}
      <div style={{ borderTop: "1px solid #E6E2DD", marginTop: 8, paddingTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <b style={{ fontSize: 14 }}>Pas domu připraven</b>
          <b style={{ fontSize: 14, color: "#2E7D4F" }}>92 %</b>
        </div>
        <span style={{ height: 6, borderRadius: 3, background: "#E6E2DD", position: "relative" }}>
          <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "92%", borderRadius: 3, background: "#2E7D4F" }} />
        </span>
        <span style={{ fontSize: 12, color: "#6F6A65", lineHeight: 1.4 }}>Chybí: podepsaný protokol tlakové zkoušky, revize spalinové cesty.</span>
      </div>
    </div>
  );
}

function Feed() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {AGENT_FEED.map((f, i) => (
        <button key={f.title} type="button" onClick={() => setOpen(open === f.title ? null : f.title)} className="card press rise" style={{ padding: "12px 14px", display: "flex", gap: 12, alignItems: "flex-start", textAlign: "left", opacity: i === AGENT_FEED.length - 1 ? 0.85 : 1, animationDelay: `${i * 80}ms` }}>
          <span style={{ width: 36, height: 36, borderRadius: 18, background: `${f.c}1F`, color: f.c, fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{f.i}</span>
          <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontSize: 12, color: "#6F6A65" }}>
              <b style={{ color: f.c, fontWeight: 600 }}>{f.who}</b> {f.ago}
            </span>
            <b style={{ fontSize: 15, fontWeight: 600 }}>{f.title}</b>
            <span style={{ fontSize: 13, color: "#3a3532", display: "flex", gap: 6 }}>
              <Icon name="sparkle" size={13} color="#B5543A" style={{ marginTop: 2 }} />
              {f.note}
            </span>
            {open === f.title && <span style={{ fontSize: 12, color: "#6F6A65", marginTop: 4 }}>Agent dokument zařadil do pasu domu, porovnal s modelem a upozornil, koho se změna týká.</span>}
          </span>
          <Chip tone={f.tone}>{f.chip}</Chip>
        </button>
      ))}
    </div>
  );
}

// Úvod na tabletu: diagram „Hlídá celý projekt“, pak se rozplyne do přehledu (jako ve videu).
function TabletIntro() {
  const [on, setOn] = useState(true);
  if (!on) return null;
  return (
    <button
      type="button"
      aria-label="Přeskočit úvod"
      onClick={() => setOn(false)}
      onAnimationEnd={(e) => e.target === e.currentTarget && setOn(false)}
      style={{ position: "absolute", inset: 0, zIndex: 20, background: "#F2F0ED", display: "flex", alignItems: "center", gap: 40, padding: "0 60px", textAlign: "left", animation: "bulo-fade-out 600ms 2600ms ease both" }}
    >
      <span style={{ display: "flex", flexDirection: "column", gap: 10, width: 300, flex: "none" }}>
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: "#B5543A" }}>PŘIPRAVUJEME · AGENT PROJEKTU</span>
        <span style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1 }}>Hlídá celý projekt.</span>
        <span style={{ fontSize: 17, color: "#6F6A65", lineHeight: 1.45 }}>Podklady od všech profesí a termíny na jednom místě.</span>
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <AgentDiagram w={600} h={430} />
      </span>
    </button>
  );
}

export function Agent(_: P) {
  const nav = useNav();
  const tablet = useTablet();
  const { s } = useStore();
  if (tablet) {
    return (
      <Screen noStatus bg="#F2F0ED">
        <TabletIntro />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
          <div style={{ height: 64, display: "flex", alignItems: "center", gap: 16, padding: "0 28px", background: "#FBFAF8", borderBottom: "1px solid #E6E2DD", flex: "none" }}>
            <button type="button" onClick={nav.back} aria-label="Zpět" style={{ display: "flex", alignItems: "center", color: "#B5543A" }}>
              <Icon name="back" size={22} color="#B5543A" sw={2.4} />
            </button>
            <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.32em", color: "#B5543A" }}>BULO</span>
            <b style={{ fontSize: 17 }}>Chata Loučky · rekonstrukce</b>
            <span className="chip" style={{ marginLeft: "auto", background: "#E4F1E8", color: "#2E7D4F" }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: "#2E7D4F" }} />
              Agent hlídá projekt
            </span>
            <span className="soon">Připravujeme</span>
          </div>
          <div style={{ flex: 1, minHeight: 0, display: "grid", gridTemplateColumns: "380px 1fr", gap: 22, padding: 22 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, overflowY: "auto" }}>
              <Summary />
              <Deadlines />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, overflowY: "auto", minHeight: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <b style={{ fontSize: 22 }}>Podklady od profesí</b>
                <span style={{ fontSize: 13, color: "#6F6A65" }}>6 dnes · vše na jednom místě</span>
              </div>
              <Feed />
            </div>
          </div>
        </div>
      </Screen>
    );
  }
  return (
    <Screen>
      <Body gap={12}>
        <Nav back="Dům" onBack={nav.back} right={<span className="chip" style={{ background: "#EEEBE7", color: "#6F6A65" }}>Připravujeme</span>} />
        <Title title="Agent projektu" sub="Hlídá celý projekt. Podklady od všech profesí a termíny na jednom místě." />
        <div className="card" style={{ padding: "8px 6px" }}>
          <AgentDiagram />
        </div>
        <Summary />
        <Deadlines />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 4 }}>
          <b style={{ fontSize: 18 }}>Podklady od profesí</b>
          <span style={{ fontSize: 12, color: "#6F6A65" }}>6 dnes</span>
        </div>
        <Feed />
        <div style={{ fontSize: 13, color: "#6F6A65", padding: "0 4px" }}>{s.records.length ? `V pasu domu přibylo ${s.records.length} zápisů z této ukázky.` : "Ukázková data rekonstrukce."}</div>
      </Body>
    </Screen>
  );
}
