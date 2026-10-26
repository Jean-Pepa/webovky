"use client";

import { useEffect, useState } from "react";
import { Icon } from "../icons";
import { useActive, useNav } from "../nav";
import { useOverlay } from "../overlay";
import { useStore, sensorCount } from "../store";
import { CONSUMPTION, ROOMS, SENSORS, TONES, type Period } from "../data";
import type { SensorId } from "../types";
import { hm, num } from "../time";
import { Plan } from "../plan";
import { Body, Bottom, Btn, Chevron, Ic, Nav, Row, RowText, Screen, Title, useNow } from "../ui";
import { Spark, useTick } from "./common";

type P = { params: Record<string, unknown> };

// ================= Hlídače =================
export function Hlidace({ params }: P) {
  const { s } = useStore();
  const nav = useNav();
  const t = useTick(900);
  const k = t * 2.2;
  const mk = (f: (i: number) => number) => Array.from({ length: 14 }, (_, i) => f(i));
  const leak = s.leak?.phase === "flow";
  const closed = s.leak?.phase === "closed";

  const live: Record<SensorId, { v: string; st: string; tone: "ok" | "warn" | "bad"; spark: number[] }> = {
    teplota: { v: `${num(21.5 + 0.1 * Math.sin(t * 0.9))} °C`, st: "v pořádku", tone: "ok", spark: mk((i) => 21 + 0.5 * Math.sin((i + k) * 0.6)) },
    kour: { v: "bez alarmu", st: "v pořádku", tone: "ok", spark: mk((i) => 1 + 0.05 * Math.sin((i + k) * 1.3)) },
    komin: { v: "64 %", st: "čištění brzy", tone: "warn", spark: mk((i) => 40 + i * 1.8 + Math.sin(i + k)) },
    voda: leak
      ? { v: "0,4 l/min", st: "neobvyklé", tone: "warn", spark: mk((i) => 0.4 + 0.03 * Math.sin(i + k)) }
      : closed
        ? { v: "0,0 l/min", st: "uzávěr zavřen", tone: "warn", spark: mk((i) => (i < 10 ? 0.4 : 0.02)) }
        : { v: "0,0 l/min", st: "v pořádku", tone: "ok", spark: mk((i) => (i % 5 === 1 ? 1.2 : 0.05) + 0.04 * Math.sin(i + k)) },
    elektrina: { v: `${num(1.2 + 0.12 * Math.sin(t * 1.7))} kW`, st: "v pořádku", tone: "ok", spark: mk((i) => 1.1 + 0.35 * Math.sin((i + k) * 0.9) + 0.15 * Math.sin((i + k) * 2.3)) },
    plyn: { v: "0,3 m³/h", st: "v pořádku", tone: "ok", spark: mk((i) => 0.28 + 0.06 * Math.sin((i + k) * 0.8)) },
  };
  const list = SENSORS.filter((x) => x.id !== "voda" || s.water);

  return (
    <Screen>
      <Body gap={12}>
        <Nav back="Dům" onBack={nav.back} right={<span className="chip" style={{ background: TONES.ok.bg, color: TONES.ok.fg }}>{sensorCount(s)} čidel · živě</span>} />
        <Title title="Hlídače" sub="Čidla v domě. Data se ukládají do pasu domu." />
        <div className="card" style={{ overflow: "hidden" }}>
          {list.map((x) => {
            const l = live[x.id];
            const color = TONES[l.tone].fg;
            const onClick = x.id === "voda" && s.leak && s.leak.phase !== "fixed" ? () => nav.push({ name: "unik", params: { back: "Hlídače" } }) : x.id === "komin" ? () => nav.reset([{ name: "domy" }, { name: "terminy", params: { id: params.id ?? "loucky" } }], "none") : undefined;
            return (
              <Row key={x.id} style={{ padding: "11px 14px" }} onClick={onClick}>
                <Ic icon={x.icon} tone={x.tone} />
                <RowText title={x.name} sub={x.place} />
                <Spark values={l.spark} color={TONES[x.tone].fg} />
                <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2, minWidth: 86 }}>
                  <b style={{ fontSize: 16, fontWeight: 700, color: l.tone === "warn" && x.id === "voda" ? color : "#141414" }}>{l.v}</b>
                  <span style={{ fontSize: 12, fontWeight: 600, color }}>{l.st}</span>
                </span>
              </Row>
            );
          })}
        </div>
        <button type="button" className="card press" onClick={() => nav.reset([{ name: "domy" }, { name: "terminy", params: { id: params.id ?? "loucky" } }], "none")} style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}>
          <Ic icon="chimney" tone="clay" />
          <RowText title="Komín vyčistit do 30 dní" sub="Termín přidán, kominík ho uvidí v pasu" />
          <Icon name="chevron" size={20} color="#6F6A65" sw={1.9} />
        </button>
        {!s.water && (
          <button type="button" className="card press" onClick={() => nav.push({ name: "parovani" })} style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}>
            <Ic icon="plus" tone="info" />
            <RowText title="Nový hlídač" sub="Hlídač vody · nacvakne se na trubku u vodoměru" />
            <Icon name="chevron" size={20} color="#6F6A65" sw={1.9} />
          </button>
        )}
      </Body>
    </Screen>
  );
}

// ================= Nový hlídač (párování) =================
const SENSOR_ICON = (
  <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true">
    <rect x="19" y="2" width="6" height="40" rx="3" fill="#C98B4F" />
    <rect x="10" y="12" width="24" height="20" rx="6" fill="#FFFFFF" stroke="#CFC8BF" strokeWidth="1.5" />
    <circle cx="28" cy="17" r="2.2" fill="#2E7D4F" />
    <rect x="14" y="22" width="12" height="4" rx="2" fill="#B5543A" fillOpacity="0.8" />
  </svg>
);

const METER: [number, number] = [250.9, 22.2];

function placeAt(x: number, y: number): { title: string; sub: string; acc: string } {
  if (Math.hypot(x - METER[0], y - METER[1]) < 26) return { title: "Vodoměr, hlavní přívod", sub: "Technická místnost · poznáno z modelu domu", acc: "±2 cm" };
  const room = ROOMS.find((r) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h);
  return { title: room ? room.name : "Mimo dům", sub: "Umístěno ručně v půdorysu", acc: "±30 cm" };
}

export function Parovani(_: P) {
  const { s, dispatch } = useStore();
  const nav = useNav();
  const active = useActive();
  const [found, setFound] = useState(!!s.water);
  const [pos, setPos] = useState<[number, number]>(s.water ? [s.water.x, s.water.y] : METER);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    if (found || !active) return;
    const id = setTimeout(() => setFound(true), 1500);
    return () => clearTimeout(id);
  }, [found, active]);
  const place = placeAt(pos[0], pos[1]);
  const lw = 112;
  const lx = Math.max(4, Math.min(342 - lw, pos[0] - 122));

  const save = () => {
    if (saved) return;
    dispatch({ t: "pairWater", place: place.title, x: pos[0], y: pos[1] });
    setSaved(true);
    setTimeout(() => nav.back(), 1100);
  };

  return (
    <Screen>
      <Body gap={12} bottom>
        <Nav back="Hlídače" onBack={nav.back} />
        <Title title="Nový hlídač" sub={found ? "Telefon našel čidlo poblíž." : "Hledám čidlo poblíž…"} />
        <div className="card" style={{ padding: "14px 16px", display: "flex", gap: 14, alignItems: "center" }}>
          <span style={{ width: 60, height: 60, borderRadius: 18, background: "#EEF2F6", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{SENSOR_ICON}</span>
          <span className="rt">
            <b style={{ fontSize: 17 }}>Hlídač vody</b>
            <span>průtokoměr · 100 %</span>
          </span>
          {found ? (
            <span className="chip rise" style={{ background: TONES.ok.bg, color: TONES.ok.fg }}>
              <Icon name="check" size={14} color={TONES.ok.fg} sw={2.4} />
              připojeno
            </span>
          ) : (
            <span className="spin" style={{ color: "#6F6A65" }} />
          )}
        </div>
        <div className="lbl">Kde je</div>
        <div className="card" style={{ padding: "4px 0", display: "flex", justifyContent: "center", marginTop: -6 }}>
          <Plan label="Půdorys 1. NP s novým hlídačem vody" onPoint={found && !saved ? (x, y) => setPos([x, y]) : undefined}>
            {found && (
              <g className="rise">
                <circle cx={pos[0]} cy={pos[1]} r={22} fill="#2F7FD8" fillOpacity={0.18}>
                  <animate attributeName="r" values="12;30" dur="1.6s" repeatCount="indefinite" />
                  <animate attributeName="fill-opacity" values="0.28;0" dur="1.6s" repeatCount="indefinite" />
                </circle>
                <circle cx={pos[0]} cy={pos[1]} r={12} fill="#2F7FD8" stroke="#FFFFFF" strokeWidth={3} />
                <rect x={lx} y={pos[1] + 16} width={lw} height={26} rx={13} fill="#141414" />
                <text x={lx + lw / 2} y={pos[1] + 33} textAnchor="middle" fontFamily="Inter" fontSize="13" fontWeight="600" fill="#FFFFFF">
                  Hlídač vody
                </text>
              </g>
            )}
          </Plan>
        </div>
        <div className="card" style={{ overflow: "hidden" }}>
          <div className="row">
            <Ic icon="pin" tone="info" />
            <RowText title={found ? place.title : "Zjišťuji polohu…"} sub={found ? place.sub : "Podle signálu a modelu domu"} />
            {found && <span className="chip" style={{ background: TONES.ok.bg, color: TONES.ok.fg }}>{place.acc}</span>}
          </div>
        </div>
        {found && !saved && <div style={{ fontSize: 13, color: "#6F6A65", padding: "0 6px", lineHeight: 1.45 }}>Jinde? Klepněte do půdorysu na místo, kde čidlo je.</div>}
      </Body>
      <Bottom fade={false}>
        <Btn icon="check" variant={saved ? "ok" : undefined} onClick={save} disabled={!found}>
          {saved ? "Uloženo do pasu domu" : "Uložit do pasu domu"}
        </Btn>
      </Bottom>
    </Screen>
  );
}

// ================= Možný únik vody (detail z notifikace) =================
function FlowChart({ closed, closedFrac }: { closed: boolean; closedFrac: number }) {
  const W = 322;
  const H = 150;
  const pts: string[] = [];
  for (let i = 0; i <= 80; i++) {
    const x = i / 80;
    let v = 0.02;
    if (x > 0.08 && x < 0.12) v = 1.6;
    if (x > 0.3 && x < 0.33) v = 0.9;
    if (x > 0.55 && x < 0.57) v = 1.2;
    if (x > 0.8) v = 0.4;
    if (closed && x > closedFrac) v = 0.02;
    pts.push(`${(x * W).toFixed(1)},${(H - 14 - (v / 2) * (H - 24)).toFixed(1)}`);
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", marginTop: 6 }} aria-label="Průtok vody během dne">
      <line x1="0" y1={H - 14} x2={W} y2={H - 14} stroke="#E6E2DD" strokeWidth="1" />
      <rect x={0.8 * W} y="4" width={(closed ? closedFrac - 0.8 : 0.2) * W} height={H - 18} rx="6" fill="#F8ECD8" />
      <polyline points={pts.join(" ")} fill="none" stroke="#2F7FD8" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
      {!closed && (
        <text x={W - 6} y="22" textAnchor="end" fontFamily="Inter" fontSize="12" fontWeight="700" fill="#A8661A">
          40 min bez přestávky
        </text>
      )}
    </svg>
  );
}

export function Unik({ params }: P) {
  const { s, dispatch } = useStore();
  const nav = useNav();
  const ov = useOverlay();
  const leak = s.leak;
  const now = useNow();
  const closed = leak?.phase !== "flow";
  const mins = leak ? 40 + Math.max(0, Math.round((now - leak.detectedAt) / 60000)) : 0;
  const dur = mins < 90 ? `${mins} minut` : `${Math.floor(mins / 60)} h ${mins % 60} min`;
  const close = () => {
    dispatch({ t: "closeValve", now: Date.now(), by: "majitel" });
    ov.toast("Uzávěr vody zavřen");
  };
  return (
    <Screen>
      <Body gap={12} bottom={2}>
        <Nav back={typeof params.back === "string" ? params.back : "Dům"} onBack={nav.back} />
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span className="ic" style={{ width: 52, height: 52, borderRadius: 26, background: closed ? TONES.ok.bg : TONES.warn.bg }}>
            <Icon name="drop" size={26} color={closed ? TONES.ok.fg : TONES.warn.fg} sw={2.2} />
          </span>
          <div>
            <div className="lt" style={{ fontSize: 30 }}>
              {leak?.phase === "fixed" ? "Únik opraven" : "Možný únik vody"}
            </div>
            <div className="sub" style={{ marginTop: 2 }}>
              {!leak ? "Hlídač vody nic neobvyklého nehlásí." : leak.phase === "flow" ? `Průtok 0,4 l/min trvá ${dur}.` : leak.phase === "closed" ? `Uzávěr zavřen v ${hm(leak.closedAt ?? 0)}.` : "Spoj utěsněn, hlídač hlídá dál."}
            </div>
          </div>
        </div>
        <div className="card" style={{ padding: "14px 14px 8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <b style={{ fontSize: 15 }}>Průtok vody dnes</b>
            <span style={{ fontSize: 15, fontWeight: 700, color: closed ? TONES.ok.fg : "#A8661A" }}>{closed ? "0,0 l/min" : "0,4 l/min"}</span>
          </div>
          <FlowChart closed={closed} closedFrac={0.9} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#6F6A65" }}>
            <span>0:00</span>
            <span>2:10</span>
            <span>teď</span>
          </div>
        </div>
        <div className="card" style={{ overflow: "hidden" }}>
          <Row onClick={() => nav.push({ name: "model", params: { id: "loucky", layer: "voda" } })}>
            <Ic icon="pin" tone="info" />
            <RowText title="Kde hledat" sub="Za vodoměrem · trasa ke koupelně v modelu" />
            <Icon name="chevron" size={20} color="#6F6A65" sw={1.9} />
          </Row>
          <Row onClick={() => nav.push({ name: "hlidace", params: { id: "loucky" } })}>
            <Ic icon="shield" tone="neutral" />
            <RowText title="Hlídač vody" sub={`${s.water?.place ?? "Vodoměr, hlavní přívod"} · hlídá nonstop`} />
            <Icon name="chevron" size={20} color="#6F6A65" sw={1.9} />
          </Row>
        </div>
      </Body>
      {leak && <div className="bottom-fade" />}
      {leak?.phase === "flow" ? (
        <div className="bottom" style={{ gap: 10 }}>
          <button type="button" className="btn light" style={{ flex: "none", height: 50 }} onClick={() => nav.modal({ name: "kamera", params: { mode: "ask", house: "loucky" } })}>
            <Icon name="camera" size={20} color="#141414" />
            Vyfotit a zeptat se domu
          </button>
          <button type="button" className="btn" style={{ flex: "none" }} onClick={close}>
            <Icon name="drop" size={22} color="#fff" />
            Zavřít hlavní uzávěr
          </button>
        </div>
      ) : leak ? (
        <div className="bottom">
          <div className="rise" style={{ height: 116, borderRadius: 22, background: TONES.ok.fg, color: "#fff", display: "flex", alignItems: "center", gap: 14, padding: "0 18px" }}>
            <span style={{ width: 48, height: 48, borderRadius: 24, background: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
              <Icon name="check" size={28} color="#fff" sw={3} />
            </span>
            <span style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <b style={{ fontSize: 19 }}>{leak.phase === "fixed" ? "Opraveno" : "Uzávěr zavřen"}</b>
              <span style={{ fontSize: 14, opacity: 0.92 }}>{leak.phase === "fixed" ? "Průtok 0,0 l/min, bez úniku" : "Průtok 0,0 l/min · voda neteče"}</span>
            </span>
          </div>
        </div>
      ) : null}
    </Screen>
  );
}

// ================= Spotřeba =================
export function Spotreba({ params }: P) {
  const { s } = useStore();
  const nav = useNav();
  const [period, setPeriod] = useState<Period>("mesic");
  const rows = CONSUMPTION[period];
  const demo = params.id === undefined || params.id === "loucky";
  return (
    <Screen>
      <Body gap={12}>
        <Nav back="Dům" onBack={nav.back} right={<span className="chip" style={{ background: TONES.ok.bg, color: TONES.ok.fg }}>živě</span>} />
        <Title title="Spotřeba" sub="Elektřina, voda a plyn. AI hlídá, co je neobvyklé." />
        <div className="seg" role="tablist" aria-label="Období">
          {(["tyden", "mesic", "rok"] as Period[]).map((p) => (
            <button
              key={p}
              type="button"
              role="tab"
              aria-selected={period === p}
              className={period === p ? "on" : ""}
              onClick={() => setPeriod(p)}
            >
              {p === "tyden" ? "Týden" : p === "mesic" ? "Měsíc" : "Rok"}
            </button>
          ))}
        </div>
        {demo ? (
          <>
            <div className="card" style={{ overflow: "hidden" }}>
              {rows.map((r) => {
                const mx = Math.max(...r.bars);
                const n = r.bars.length;
                const bw = n > 8 ? 4 : 7;
                const gap = n > 8 ? 2 : 3;
                return (
                  <div className="row" key={`${period}-${r.key}`} style={{ padding: "12px 14px" }}>
                    <Ic icon={r.key === "el" ? "bolt" : r.key === "voda" ? "drop" : "flame"} tone={r.key === "el" ? "orange" : r.key === "voda" ? "info" : "gas"} />
                    <RowText title={r.name} sub={r.delta} subStyle={{ color: TONES[r.tone].fg }} />
                    <svg width={n * (bw + gap)} height="34" viewBox={`0 0 ${n * (bw + gap)} 34`} style={{ flex: "none" }} aria-hidden="true">
                      {r.bars.map((b, i) => {
                        const h = Math.max(3, (b / mx) * 29);
                        return <rect key={i} x={i * (bw + gap)} y={34 - h} width={bw} height={h} rx="1.2" fill={r.color} fillOpacity={i === n - 1 ? 0.95 : 0.55} className="rise" style={{ animationDelay: `${i * 30}ms` }} />;
                      })}
                    </svg>
                    <b style={{ fontSize: 15, fontWeight: 700, minWidth: 58, textAlign: "right", whiteSpace: "nowrap" }}>{r.value}</b>
                  </div>
                );
              })}
            </div>
            <div key={period} className="card rise" style={{ padding: 14, display: "flex", gap: 12, alignItems: "flex-start", background: "#F4E4DD", animationDelay: "900ms" }}>
              <span className="ic" style={{ background: "#fff" }}>
                <Icon name="sparkle" size={20} color="#B5543A" />
              </span>
              <span className="rt">
                <b>{period === "rok" ? "Plyn o 12 % víc než loni" : `Plyn o ${period === "tyden" ? 17 : 18} % víc než loni`}</b>
                <span style={{ color: "#6E4A3E" }}>
                  {s.serviceDoneAt ? "Při stejném počasí. Kotel je po servisu, BULO sleduje, jestli spotřeba klesne." : "Při stejném počasí. Kotel možná potřebuje seřízení, BULO doporučí servis."}
                </span>
              </span>
            </div>
            <button type="button" className="card press" onClick={() => nav.push({ name: "hlidace", params: { id: "loucky" } })} style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}>
              <Icon name="shield" size={22} color="#2E7D4F" />
              <RowText title="Hlídače" sub={`${sensorCount(s)} čidel hlídá dům · vše v pořádku`} />
              <Chevron />
            </button>
          </>
        ) : (
          <div className="card" style={{ padding: "22px 18px", display: "flex", flexDirection: "column", gap: 6 }}>
            <b>Spotřeba zatím není napojená</b>
            <span style={{ color: "#6F6A65", fontSize: 14, lineHeight: 1.45 }}>Připojte elektroměr, vodoměr a plynoměr k hlídačům. Odečty pak přibývají samy a AI hlídá výkyvy.</span>
          </div>
        )}
      </Body>
    </Screen>
  );
}
