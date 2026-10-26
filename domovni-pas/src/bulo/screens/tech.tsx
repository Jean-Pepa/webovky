"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import jsQR from "jsqr";
import { Icon } from "../icons";
import { useActive, useNav } from "../nav";
import { useOverlay } from "../overlay";
import { houseByCode, uid, useStore } from "../store";
import { DEMO_DOC, DEMO_SENTENCE, DEVICES, HOUSE_CODE, IMG, PLAN_ENTRY, PLAN_ROUTE, TONES } from "../data";
import type { Job, WorkRecord, ZapisPrefill } from "../types";
import { draftRecord } from "../ai";
import { saveFile, saveImage, fileMeta } from "../media";
import { dm, hm, lockDate } from "../time";
import { ArView, WallView, type ArMode } from "../ar";
import { Photo, hasCamera } from "../camera";
import { Plan, PlanPin } from "../plan";
import { Body, Bottom, Btn, Chevron, Chip, Ic, Nav, Row, RowText, Screen, Title, useMode, useNow, useNowLabel } from "../ui";
import { useAccount } from "./common";
import { deviceChip } from "./devices";
import { DoneScreen, FieldsCard } from "./history";
import { useDictation } from "./ask";

type P = { params: Record<string, unknown> };

const JOB_INFO: Record<Job["id"], { title: string; sub: string; target: "kotel" | "uzaver" }> = {
  servis: { title: "Servis kotle", sub: "Chata Loučky · Bítov · objednal majitel", target: "kotel" },
  unik: { title: "Únik vody", sub: "Chata Loučky · Bítov · objednal majitel", target: "uzaver" },
};

function useJob(id: unknown) {
  const { s } = useStore();
  return s.jobs.find((j) => j.id === id) ?? s.jobs[0];
}

// ================= Zakázky (domů technika) =================
export function Zakazky(_: P) {
  const { s } = useStore();
  const nav = useNav();
  const account = useAccount();
  const open = s.jobs.filter((j) => j.status === "open");
  const done = s.jobs.filter((j) => j.status === "done");
  return (
    <Screen>
      <Body gap={14}>
        <div className="nav">
          <button type="button" onClick={account} aria-label="Účet a ukázka" style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.32em", color: "#B5543A", padding: "8px 0" }}>
            BULO
          </button>
          <button type="button" className="ic" style={{ background: "#FFFFFF", width: 40, height: 40 }} onClick={() => nav.push({ name: "skener" })} aria-label="Přihlásit se k domu kódem">
            <Icon name="qr" size={20} color="#141414" />
          </button>
        </div>
        <Title title="Zakázky" sub="Instalatérství Novák · dnes" />
        <div className="card" style={{ overflow: "hidden" }}>
          {open.map((j) => (
            <Row key={j.id} onClick={() => nav.push({ name: "zakazka", params: { job: j.id } })} style={{ padding: "12px 14px" }}>
              <Ic icon={j.id === "unik" ? "drop" : "flame"} tone={j.id === "unik" ? "info" : "clay"} />
              <RowText title={j.title} sub={JOB_INFO[j.id].sub} />
              <Chip tone="clay">{j.when.replace("Dnes ", "")}</Chip>
            </Row>
          ))}
          {!open.length && (
            <div className="row">
              <Ic icon="check" tone="ok" />
              <RowText title="Na dnes je hotovo" sub="Nové zakázky přijdou od majitelů a správců" />
            </div>
          )}
        </div>
        {done.length > 0 && (
          <>
            <div className="lbl">Hotové</div>
            <div className="card" style={{ overflow: "hidden", marginTop: -6 }}>
              {done.map((j) => (
                <Row key={j.id} onClick={() => nav.push({ name: "zakazka", params: { job: j.id } })}>
                  <Ic icon="check" tone="ok" sw={2.6} />
                  <RowText title={j.title} sub={`Chata Loučky · ${j.doneAt ? hm(j.doneAt) : ""} · zápis podepsán`} />
                  <Chevron />
                </Row>
              ))}
            </div>
          </>
        )}
        <button type="button" className="card press" onClick={() => nav.push({ name: "skener" })} style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}>
          <Ic icon="qr" tone="neutral" />
          <RowText title="Přihlásit se k domu" sub="Naskenujte kód na zdi u vchodu" />
          <Chevron />
        </button>
        <div style={{ fontSize: 13, lineHeight: 1.45, color: "#6F6A65", padding: "0 6px" }}>
          Technik vidí jen to, co k zakázce potřebuje. Zápis podepíše a majitel ho má hned v pasu domu.
        </div>
      </Body>
    </Screen>
  );
}

// ================= Zakázka =================
export function Zakazka({ params }: P) {
  const job = useJob(params.job);
  const { s } = useStore();
  const nav = useNav();
  const ov = useOverlay();
  const info = JOB_INFO[job.id];
  const loggedIn = s.techIn.includes("loucky");
  const leak = s.leak;
  const rec = s.records.find((r) => r.kind === (job.id === "unik" ? "unik" : "servis"));
  const target = job.id === "unik" ? [256.9, 22.2] : [223.3, 43.9];
  const route = [...PLAN_ROUTE, job.id === "unik" ? [250, 30] : [226, 44]];
  const ownerPhoto = leak?.photo ?? IMG("img/ph_stain.jpg");
  const showOwner = () =>
    ov.sheet(() => (
      <>
        <h3>Od majitele · ráno</h3>
        <p className="sh-sub">Fotka a dotaz, které majitel poslal přes „Zeptat se domu“.</p>
        <div className="card" style={{ overflow: "hidden" }}>
          <Photo src={ownerPhoto} style={{ width: "100%", height: 180 }} />
          <div style={{ padding: "12px 14px", fontSize: 15 }}>{s.chat.find((m) => m.from === "me")?.text ?? "Na zdi u vodoměru je mokrá skvrna. Co to je?"}</div>
        </div>
      </>
    ));
  return (
    <Screen>
      <Body bottom>
        <Nav back="Zakázky" onBack={nav.back} right={<Chip tone={job.status === "done" ? "ok" : "clay"}>{job.status === "done" ? "hotovo" : job.when}</Chip>} />
        <Title title={info.title} sub={info.sub} />
        <div className="card">
          {job.id === "servis" ? (
            <>
              <div className="row">
                <Ic icon="key" tone="neutral" />
                <RowText title="Klíč" sub="Box u vstupu, kód vám pošle majitel" />
              </div>
              <div className="row">
                <Ic icon="pin" tone="clay" />
                <RowText title="Kotel" sub="Technická místnost, z chodby druhé dveře vlevo" />
              </div>
              <div className="row">
                <Ic icon="history" tone="neutral" />
                <RowText title="Minule" sub={`Servis ${s.boiler.serviceLast === "11/2025" ? "11/2025 · výměna těsnění, bez závad" : s.boiler.serviceLast}`} />
              </div>
            </>
          ) : (
            <>
              <div className="row">
                <Ic icon="pin" tone="bad" />
                <RowText title="Místo" sub="Technická místnost, u vodoměru, z chodby druhé dveře vlevo" />
              </div>
              <div className="row">
                <Ic icon="drop" tone="info" />
                <RowText title="Hlídač" sub={leak ? `0,4 l/min od ${leak.since} · ${leak.phase === "flow" ? "uzávěr otevřen" : leak.phase === "closed" ? `uzávěr zavřen ${hm(leak.closedAt ?? 0)}` : "opraveno"}` : "bez hlášení"} />
              </div>
              <Row onClick={showOwner}>
                <Photo src={ownerPhoto} style={{ width: 40, height: 40, borderRadius: 10, flex: "none" }} />
                <RowText title="Od majitele" sub="Fotka skvrny a dotaz z rána" />
                <Chevron />
              </Row>
            </>
          )}
        </div>
        <div className="card" style={{ padding: "8px 4px", display: "flex", justifyContent: "center" }}>
          <Plan label="Cesta od vstupu do technické místnosti">
            <polyline points={route.map((p) => p.join(",")).join(" ")} fill="none" stroke="#B5543A" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={job.id === "unik" ? "2 6" : undefined} pathLength={job.id === "unik" ? undefined : 1} className={job.id === "unik" ? undefined : "route-draw"} />
            <circle cx={PLAN_ENTRY[0]} cy={PLAN_ENTRY[1]} r={7} fill="#FFFFFF" stroke="#141414" strokeWidth={2.5} />
            <text x={PLAN_ENTRY[0] - 12} y={PLAN_ENTRY[1] - 12} textAnchor="end" fontFamily="Inter" fontSize="12" fontWeight="600" fill="#141414">
              Vstup
            </text>
            <PlanPin x={target[0]} y={target[1]} n={1} color="#B5543A" halo />
          </Plan>
        </div>
        {rec && (
          <button type="button" className="card press" onClick={() => nav.push({ name: "zaznam", params: { id: rec.id } })} style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}>
            <Ic icon="sign" tone="ok" />
            <RowText title="Zápis podepsán" sub={`${dm(rec.at)} ${hm(rec.at)} · majitel dostal zprávu`} />
            <Chevron />
          </button>
        )}
      </Body>
      <div className="bottom-fade" />
      <div className="bottom" style={{ gap: 8 }}>
        {loggedIn ? (
          <Btn icon="grid" onClick={() => nav.push({ name: "zarizeni-dum", params: { job: job.id } })}>
            Zařízení v domě
          </Btn>
        ) : (
          <Btn icon="qr" onClick={() => nav.push({ name: "skener", params: { job: job.id } })}>
            Přihlásit se k domu
          </Btn>
        )}
        <span style={{ textAlign: "center", fontSize: 13, color: "#6F6A65" }}>{loggedIn ? "Přihlášeno kódem domu LOU-0127." : "Kód domu je na zdi u vchodu."}</span>
      </div>
    </Screen>
  );
}

// ================= Skener kódu domu =================
const QR_BOX: [number, number][] = [
  [99.1, 342.1],
  [211.9, 342.4],
  [211.6, 454],
  [100.9, 459.1],
];

export function Skener({ params }: P) {
  const { s, dispatch } = useStore();
  const nav = useNav();
  const ov = useOverlay();
  const mode = useMode();
  const active = useActive();
  const video = useRef<HTMLVideoElement>(null);
  const [live, setLive] = useState<"off" | "on" | "fail">("off");
  const [wantLive, setWantLive] = useState(mode === "native");
  const [found, setFound] = useState<null | { house: string; name: string }>(null);
  const [lock, setLock] = useState(0);
  const doneRef = useRef(false);
  const job = typeof params.job === "string" ? params.job : s.jobs.find((j) => j.status === "open")?.id ?? "servis";

  const succeed = (houseId: string) => {
    if (doneRef.current) return;
    doneRef.current = true;
    const h = s.houses.find((x) => x.id === houseId);
    setFound({ house: houseId, name: h?.name ?? "Pas domu" });
    if (navigator.vibrate) navigator.vibrate(30);
    setTimeout(() => {
      dispatch({ t: "techLogin", houseId });
      if (houseId === "loucky") nav.replace({ name: "zarizeni-dum", params: { job } }, "fade");
      else {
        dispatch({ t: "role", role: "vlastnik" });
        nav.reset([{ name: "domy" }, { name: "dum", params: { id: houseId } }], "fade");
      }
    }, 1000);
  };

  // Události z efektů (vždy s aktuálním stavem, bez restartu kamery).
  const onFound = useEffectEvent((houseId: string) => succeed(houseId));
  const findHouse = useEffectEvent((code: string) => houseByCode(s.houses, code));
  const notOurs = useEffectEvent(() => ov.toast("Tohle není kód domu BULO"));

  // Ukázka: zaměřovač „najde“ cedulku na zdi.
  useEffect(() => {
    if (!active || (wantLive && live !== "fail")) return;
    const t0 = performance.now();
    let raf = 0;
    const loop = (now: number) => {
      const x = (now - t0) / 1000;
      setLock(Math.min(1, Math.max(0, (x - 1.2) / 0.4)));
      if (x > 1.8) onFound("loucky");
      else raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active, wantLive, live]);

  // Živá kamera + čtení QR (jsQR).
  useEffect(() => {
    if (!active || !wantLive || !navigator.mediaDevices?.getUserMedia) return;
    let stream: MediaStream | null = null;
    let alive = true;
    let timer = 0;
    const c = document.createElement("canvas");
    const scan = () => {
      const v = video.current;
      if (!alive || !v || !v.videoWidth) {
        timer = window.setTimeout(scan, 300);
        return;
      }
      const w = 480;
      const h = Math.round((v.videoHeight / v.videoWidth) * w);
      c.width = w;
      c.height = h;
      const ctx = c.getContext("2d", { willReadFrequently: true });
      if (ctx) {
        ctx.drawImage(v, 0, 0, w, h);
        const img = ctx.getImageData(0, 0, w, h);
        const code = jsQR(img.data, w, h, { inversionAttempts: "dontInvert" });
        if (code?.data) {
          const m = code.data.match(/([A-Z]{3}-\d{4})/i);
          const house = m ? findHouse(m[1]) : null;
          if (house) {
            setLock(1);
            onFound(house.id);
            return;
          }
          notOurs();
        }
      }
      timer = window.setTimeout(scan, 250);
    };
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false })
      .then((st) => {
        if (!alive) return st.getTracks().forEach((t) => t.stop());
        stream = st;
        if (video.current) {
          video.current.srcObject = st;
          video.current.play().catch(() => {});
        }
        setLive("on");
        scan();
      })
      .catch(() => alive && setLive("fail"));
    return () => {
      alive = false;
      clearTimeout(timer);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [active, wantLive]);

  const enterCode = () =>
    ov.sheet((close) => <CodeSheet close={close} onCode={(code) => {
      const h = houseByCode(s.houses, code);
      if (!h) return false;
      close();
      setLock(1);
      succeed(h.id);
      return true;
    }} />);

  const useLive = wantLive && live === "on";
  // zaměřovač
  const xs = QR_BOX.map((p) => p[0]);
  const ys = QR_BOX.map((p) => p[1]);
  const e = lock < 0.5 ? 4 * lock ** 3 : 1 - Math.pow(-2 * lock + 2, 3) / 2;
  const L = (a: number, b: number) => a + (b - a) * e;
  const x0 = L(75, Math.min(...xs) - 14);
  const x1 = L(315, Math.max(...xs) + 14);
  const y0 = L(250, Math.min(...ys) - 14);
  const y1 = L(520, Math.max(...ys) + 14);
  const cl = L(34, 22);
  const col = lock >= 1 ? "#34C759" : "#FFFFFF";

  return (
    <Screen dark bg="#000">
      {useLive ? <video ref={video} className="camera-bg" playsInline muted autoPlay /> : <img src={IMG("img/feed_dum.jpg")} className="camera-bg" alt="Cedulka s kódem domu u vchodu" />}
      {wantLive && !useLive && <video ref={video} style={{ display: "none" }} playsInline muted />}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,0.45) 0%,rgba(0,0,0,0) 22%,rgba(0,0,0,0) 66%,rgba(0,0,0,0.6) 100%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", left: 20, right: 20, top: "calc(var(--sb) + 11px)", display: "flex", alignItems: "center", gap: 10, zIndex: 5 }}>
        <button type="button" className="ic" aria-label="Zavřít" onClick={nav.back} style={{ background: "rgba(20,20,20,0.5)", width: 44, height: 44, borderRadius: 22 }}>
          <Icon name="close" size={22} color="#fff" sw={2.2} />
        </button>
        <span style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>Přihlásit se k domu</span>
        {mode === "framed" && hasCamera() && (
          <button type="button" className="glass-chip" style={{ marginLeft: "auto" }} onClick={() => setWantLive((w) => !w)}>
            {useLive ? "Ukázka" : "Kamera"}
          </button>
        )}
      </div>
      {!useLive && (
        <svg width="390" height="844" viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 6, pointerEvents: "none" }}>
          {[`M${x0} ${y0 + cl}V${y0}H${x0 + cl}`, `M${x1 - cl} ${y0}H${x1}V${y0 + cl}`, `M${x1} ${y1 - cl}V${y1}H${x1 - cl}`, `M${x0 + cl} ${y1}H${x0}V${y1 - cl}`].map((d) => (
            <path key={d.slice(0, 8)} d={d} fill="none" stroke={col} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
          ))}
          {lock >= 1 && <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} rx={10} fill="#34C759" fillOpacity={0.12} />}
        </svg>
      )}
      {useLive && (
        <div style={{ position: "absolute", left: "50%", top: "45%", width: 230, height: 230, transform: "translate(-50%,-50%)", border: `4px solid ${lock >= 1 ? "#34C759" : "rgba(255,255,255,0.9)"}`, borderRadius: 24, zIndex: 6, pointerEvents: "none" }} />
      )}
      {found && (
        <div className="rise" style={{ position: "absolute", left: 0, right: 0, top: useLive ? "62%" : `calc(${((y1 + 18) / 844) * 100}%)`, display: "flex", justifyContent: "center", zIndex: 7 }}>
          <span className="chip" style={{ height: 40, padding: "0 16px", borderRadius: 20, background: "#fff", color: "#141414", fontSize: 15 }}>
            <Icon name="check" size={18} color="#2E7D4F" sw={2.6} />
            {found.name} · pas domu
          </span>
        </div>
      )}
      <div style={{ position: "absolute", left: 20, right: 20, bottom: "calc(var(--hb) + 10px)", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, color: "#fff", zIndex: 5 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 17, fontWeight: 600 }}>Naskenujte kód domu na zdi u vchodu</div>
          <div style={{ fontSize: 14, opacity: 0.8, marginTop: 4 }}>{live === "fail" && wantLive ? "Kamera není dostupná · zadejte kód" : "Každý dům má vlastní kód"}</div>
        </div>
        <button type="button" className="chip" onClick={enterCode} style={{ height: 40, borderRadius: 20, background: "rgba(255,255,255,0.16)", color: "#fff", fontSize: 15, border: "1px solid rgba(255,255,255,0.35)" }}>
          nebo zadejte kód {HOUSE_CODE}
        </button>
      </div>
    </Screen>
  );
}

function CodeSheet({ close, onCode }: { close: () => void; onCode: (c: string) => boolean }) {
  const [v, setV] = useState("");
  const [err, setErr] = useState(false);
  return (
    <>
      <h3>Kód domu</h3>
      <p className="sh-sub">Najdete ho na cedulce u vchodu, např. {HOUSE_CODE}.</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!onCode(v)) setErr(true);
        }}
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
        <input
          className="field"
          autoFocus
          value={v}
          onChange={(e) => {
            setV(e.target.value.toUpperCase());
            setErr(false);
          }}
          placeholder={HOUSE_CODE}
          aria-label="Kód domu"
          style={{ fontSize: 20, letterSpacing: "0.12em", textAlign: "center", fontWeight: 700 }}
        />
        {err && <span style={{ color: TONES.bad.fg, fontSize: 14, textAlign: "center" }}>Tento kód neznám. Zkuste {HOUSE_CODE}.</span>}
        <div style={{ display: "flex", gap: 10 }}>
          <button type="button" className="btn light" onClick={close} style={{ height: 50 }}>
            Zrušit
          </button>
          <button type="submit" className="btn" style={{ height: 50 }}>
            Přihlásit
          </button>
        </div>
      </form>
    </>
  );
}

// ================= Zařízení v domě (technik) =================
export function ZarizeniDum({ params }: P) {
  const { s } = useStore();
  const nav = useNav();
  const job = useJob(params.job);
  const now = useNow();
  const leakMode = job.id === "unik" && s.leak?.phase !== "fixed";
  const list = DEVICES.filter((d) => ["kotel", "rozvadec", "uzaver"].includes(d.id));
  const sub: Record<string, string> = { kotel: "Technická místnost · 2. dveře vlevo", rozvadec: "Chodba u vstupu", uzaver: "Technická místnost · u okna" };
  return (
    <Screen>
      <Body gap={12} bottom={2}>
        <Nav back="Zakázka" onBack={nav.back} right={<Chip tone="ok" icon="check">Přihlášeno k domu</Chip>} />
        <Title title="Zařízení v domě" sub={`Chata Loučky · ${DEVICES.length} zařízení · kde je najdete`} />
        <div className="card" style={{ padding: "4px 0", display: "flex", justifyContent: "center" }}>
          <Plan label="Půdorys 1. NP se zařízeními">
            <PlanPin x={223.6} y={12.2} n={2} color="#A8661A" />
            <PlanPin x={180.2} y={81.2} n={3} color="#2E7D4F" />
            {leakMode ? (
              <>
                <PlanPin x={223.3} y={43.9} n={1} color="#B5543A" />
                <PlanPin x={256.9} y={22.2} n={4} color="#2F7FD8" big halo label="Vodoměr" labelSide="below" />
              </>
            ) : (
              <>
                <PlanPin x={256.9} y={22.2} n={4} color="#2E7D4F" />
                <PlanPin x={223.3} y={43.9} n={1} color="#B5543A" big halo label="Kotel" />
              </>
            )}
          </Plan>
        </div>
        <div className="card" style={{ overflow: "hidden" }}>
          {list.map((d) => {
            const c = deviceChip(d, s, now, true);
            return (
              <Row key={d.id} onClick={() => nav.push({ name: "zarizeni-detail", params: { id: "loucky", dev: d.id, back: "Zařízení" } })}>
                <Ic icon={d.icon} tone={d.tone} />
                <RowText title={d.name} sub={sub[d.id]} />
                <Chip tone={c.tone}>{c.text}</Chip>
              </Row>
            );
          })}
        </div>
        <div style={{ fontSize: 13, color: "#6F6A65", padding: "0 6px", lineHeight: 1.45 }}>Údaje se při každé změně přepíšou, předchozí stav zůstane v historii.</div>
      </Body>
      <Bottom>
        <Btn icon="target" onClick={() => nav.push({ name: "ar", params: { mode: leakMode ? "unik" : "kotel", job: job.id } })}>
          Najít v AR
        </Btn>
      </Bottom>
    </Screen>
  );
}

// ================= AR =================
export function ArScreen({ params }: P) {
  const { s } = useStore();
  const nav = useNav();
  const mode: ArMode = params.mode === "unik" ? "unik" : "kotel";
  const [stage, setStage] = useState<"find" | "card" | "routes">(params.stage === "routes" ? "routes" : params.stage === "card" ? "card" : "find");
  const [filter, setFilter] = useState("vse");
  const [gyro, setGyro] = useState(false);
  const [hint, setHint] = useState<{ m: number; dir: string }>({ m: mode === "unik" ? 3.2 : 1.9, dir: mode === "unik" ? "vpravo" : "vlevo" });
  const job = typeof params.job === "string" ? params.job : mode === "unik" ? "unik" : "servis";
  const b = s.boiler;
  const leak = s.leak;
  const serviceToday = !s.serviceDoneAt && b.serviceNext === "dnes";
  const zapsat = () => nav.modal({ name: "kamera", params: { mode: mode === "unik" ? "unik" : "servis", job, house: "loucky" } });
  const gyroToggle = async () => {
    if (gyro) return setGyro(false);
    const D = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
    try {
      if (typeof D.requestPermission === "function") {
        const r = await D.requestPermission();
        if (r !== "granted") return;
      }
      setGyro(true);
    } catch {
      setGyro(false);
    }
  };
  const chips = [
    { k: "vse", t: mode === "unik" ? "Vše · 4" : "Vše · 3" },
    { k: "topeni", t: "Topení" },
    { k: "voda", t: mode === "unik" ? "Voda · únik" : "Voda" },
    { k: "pozar", t: "Požár" },
  ];
  const fmt = (m: number) => m.toFixed(1).replace(".", ",");
  const hintText = hint.dir === "před vámi" ? (mode === "unik" ? `${fmt(hint.m)} m · u vodoměru, u kolena` : `${fmt(hint.m)} m před vámi · levá stěna`) : `${fmt(hint.m)} m · otočte se ${hint.dir}`;

  return (
    <Screen dark bg="#000">
      <ArView mode={mode} stage={stage} filter={filter} onMain={() => setStage("card")} gyro={gyro} onDistance={(m, dir) => setHint({ m, dir })} />
      <div style={{ position: "absolute", left: 20, right: 20, top: "calc(var(--sb) + 11px)", display: "flex", alignItems: "center", gap: 10, zIndex: 9 }}>
        <button type="button" className="ic" aria-label="Zpět" onClick={() => (stage === "find" ? nav.back() : setStage("find"))} style={{ background: "rgba(20,20,20,0.5)", width: 44, height: 44, borderRadius: 22 }}>
          <Icon name="back" size={22} color="#fff" sw={2.4} />
        </button>
        <span className="chip" style={{ height: 36, borderRadius: 18, background: "rgba(20,20,20,0.55)", color: "#fff", fontSize: 14 }}>
          <span style={{ width: 8, height: 8, borderRadius: 4, background: "#6EE7B7" }} />
          Ukotveno k modelu domu · ±2 cm
        </span>
      </div>
      <div style={{ position: "absolute", left: 20, right: 20, top: "calc(var(--sb) + 65px)", display: "flex", gap: 8, zIndex: 9, flexWrap: "wrap" }}>
        {chips.map((c) => (
          <button key={c.k} type="button" className="chip" onClick={() => setFilter(c.k)} style={{ height: 32, borderRadius: 16, background: filter === c.k ? "#fff" : "rgba(20,20,20,0.5)", color: filter === c.k ? "#141414" : "#fff" }}>
            {c.t}
          </button>
        ))}
        <button type="button" className="chip" onClick={gyroToggle} aria-pressed={gyro} style={{ height: 32, borderRadius: 16, background: gyro ? "#6EE7B7" : "rgba(20,20,20,0.5)", color: gyro ? "#0b3b22" : "#fff" }}>
          <Icon name="refresh" size={14} color={gyro ? "#0b3b22" : "#fff"} />
          {gyro ? "Pohyb telefonem" : "Otáčet telefonem"}
        </button>
      </div>
      {stage === "find" && (
        <button type="button" onClick={() => setStage("card")} style={{ position: "absolute", left: 16, right: 16, bottom: "max(calc(var(--hb) + 0px), 16px)", padding: "13px 14px", borderRadius: 22, background: "rgba(255,255,255,0.96)", display: "flex", alignItems: "center", gap: 12, zIndex: 8, textAlign: "left" }}>
          <span className="ic" style={{ background: mode === "unik" ? "#C0392B" : "#B5543A" }}>
            <Icon name={mode === "unik" ? "excl" : "flame"} size={20} color="#fff" sw={2.4} />
          </span>
          <RowText title={mode === "unik" ? "Možný únik" : "Kotel"} sub={hintText} />
          <span style={{ fontSize: 13, fontWeight: 600, color: "#B5543A", textAlign: "right", lineHeight: 1.25 }}>
            Klepněte
            <br />
            na ikonu
          </span>
        </button>
      )}
      {stage === "card" && (
        <ArSheet onClose={() => setStage("find")}>
          {mode === "kotel" ? (
            <>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <img src={IMG("img/kotel_photo.jpg")} style={{ width: 62, height: 62, borderRadius: 16, objectFit: "cover", flex: "none" }} alt="" />
                <RowText title="Kotel" sub={`Plynový kondenzační · ${b.power} · levá stěna`} titleStyle={{ fontSize: 21, fontWeight: 800 }} />
                <Chip tone={serviceToday ? "warn" : "ok"}>{serviceToday ? "servis dnes" : "v pořádku"}</Chip>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <div className="fact" style={{ background: "#F2F0ED" }}>
                  <span>Servis</span>
                  <b style={{ color: serviceToday ? "#A8661A" : "#141414" }}>{serviceToday ? "dnes" : b.serviceNext}</b>
                </div>
                <div className="fact" style={{ background: "#F2F0ED" }}>
                  <span>Záruka</span>
                  <b>do {b.warranty}</b>
                </div>
                <div className="fact" style={{ background: "#F2F0ED" }}>
                  <span>Instalace</span>
                  <b>{b.installed}</b>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#6F6A65" }}>
                <Icon name="history" size={18} color="#6F6A65" />
                Minule {b.serviceLast === "11/2025" ? "11/2025 · výměna těsnění" : `${b.serviceLast} · servis bez závad`}
              </div>
            </>
          ) : (
            <>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span className="ic" style={{ width: 62, height: 62, borderRadius: 16, background: "#F8E1DE" }}>
                  <Icon name="drop" size={30} color="#C0392B" sw={2.2} />
                </span>
                <RowText title="Možný únik" sub="Koleno přívodu vody za vodoměrem" titleStyle={{ fontSize: 21, fontWeight: 800 }} />
                <Chip tone="warn">70 cm</Chip>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <div className="fact" style={{ background: "#F2F0ED" }}>
                  <span>Průtok</span>
                  <b style={{ color: leak?.phase === "flow" ? "#A8661A" : "#2E7D4F" }}>{leak?.phase === "flow" ? "0,4 l/min" : "0,0 l/min"}</b>
                </div>
                <div className="fact" style={{ background: "#F2F0ED" }}>
                  <span>Ve zdi</span>
                  <b>4 cm</b>
                </div>
                <div className="fact" style={{ background: "#F2F0ED" }}>
                  <span>Změřeno</span>
                  <b>±2 cm</b>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#6F6A65" }}>
                <Icon name="history" size={18} color="#6F6A65" />
                {leak?.phase === "closed" ? `Uzávěr zavřel majitel v ${hm(leak.closedAt ?? 0)}` : leak?.phase === "flow" ? "Uzávěr je otevřený · voda teče" : "Poslední zásah: výměna vodoměru 3/2024"}
              </div>
            </>
          )}
          <div style={{ display: "flex", gap: 10 }}>
            <Btn variant="dark" icon="route" onClick={() => setStage("routes")}>
              Rozvody
            </Btn>
            <Btn icon="camera" onClick={zapsat}>
              Zapsat
            </Btn>
          </div>
        </ArSheet>
      )}
      {stage === "routes" && (
        <ArSheet onClose={() => setStage("card")} delay={1700}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 21, fontWeight: 800 }}>Rozvody kolem vás</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#2E7D4F" }}>změřeno při stavbě</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {[
              ["#F2C21B", "Plyn", "85 cm nad podlahou", "±2 cm"],
              ["#E0791A", "Elektro F7", "ze stropu k zásuvce", "±1 cm"],
              ["#C0392B", "Topení", "v podlaze ke koupelně", "±2 cm"],
              ["#2F7FD8", "Voda", "od vodoměru ke kotli", "±2 cm"],
            ].map(([c, n, d, a]) => (
              <div key={n} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15 }}>
                <span style={{ width: 22, height: 6, borderRadius: 3, background: c, flex: "none" }} />
                <b style={{ fontWeight: 600, width: 84, flex: "none" }}>{n}</b>
                <span style={{ color: "#6F6A65", flex: 1, fontSize: 14 }}>{d}</span>
                <Chip tone="ok">{a}</Chip>
              </div>
            ))}
          </div>
          <div style={{ padding: "10px 12px", borderRadius: 14, background: "#F8ECD8", color: "#A8661A", fontSize: 14, fontWeight: 600 }}>
            {mode === "unik" ? "Únik nejspíš u kolena za vodoměrem, 70 cm nad podlahou" : "Nevrtejte v označených pásech ±5 cm"}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {mode === "kotel" && (
              <Btn variant="dark" icon="wall" onClick={() => nav.push({ name: "vezdi", params: { dev: "kotel", from: "ar", job } })}>
                Ve zdi
              </Btn>
            )}
            <Btn icon="camera" onClick={zapsat}>
              {mode === "unik" ? "Zapsat opravu" : "Zapsat servis"}
            </Btn>
          </div>
        </ArSheet>
      )}
    </Screen>
  );
}

function ArSheet({ children, onClose, delay = 0 }: { children: React.ReactNode; onClose: () => void; delay?: number }) {
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "12px 20px calc(max(var(--hb), 10px) + 20px)", borderRadius: "28px 28px 0 0", background: "#fff", display: "flex", flexDirection: "column", gap: 12, zIndex: 10, animation: `bulo-in-up 460ms ${delay}ms cubic-bezier(0.32,0.72,0,1) both` }}>
      <button type="button" onClick={onClose} aria-label="Skrýt kartu" style={{ alignSelf: "center", width: 60, height: 14, display: "flex", alignItems: "center", justifyContent: "center", marginTop: -4 }}>
        <span style={{ width: 36, height: 5, borderRadius: 3, background: "#E6E2DD" }} />
      </button>
      {children}
    </div>
  );
}

// ================= Ve zdi =================
export function VeZdi(_: P) {
  const nav = useNav();
  return (
    <Screen dark bg="#000">
      <WallView />
      <div style={{ position: "absolute", left: 20, right: 20, top: "calc(var(--sb) + 11px)", display: "flex", alignItems: "center", gap: 10, zIndex: 5 }}>
        <button type="button" className="ic" aria-label="Zpět" onClick={nav.back} style={{ background: "rgba(20,20,20,0.5)", width: 44, height: 44, borderRadius: 22 }}>
          <Icon name="back" size={22} color="#fff" sw={2.4} />
        </button>
        <span className="chip" style={{ height: 36, borderRadius: 18, background: "rgba(20,20,20,0.55)", color: "#fff", fontSize: 14 }}>
          <span style={{ width: 8, height: 8, borderRadius: 4, background: "#6EE7B7" }} />
          Ukotveno k modelu domu · ±2 cm
        </span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "12px 20px calc(max(var(--hb), 10px) + 24px)", borderRadius: "28px 28px 0 0", background: "#fff", display: "flex", flexDirection: "column", gap: 10, zIndex: 8, animation: "bulo-in-up 460ms 900ms cubic-bezier(0.32,0.72,0,1) both" }}>
        <span style={{ alignSelf: "center", width: 36, height: 5, borderRadius: 3, background: "#E6E2DD" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 22, fontWeight: 800 }}>Ve zdi u kotle</span>
          <Chip tone="ok" icon="check">
            změřeno při stavbě
          </Chip>
        </div>
        {[
          ["#F2C21B", "Plyn", "85 cm nad podlahou · ±2 cm"],
          ["#E0791A", "Elektro", "svisle nad zásuvkou · ±1 cm"],
        ].map(([c, n, d]) => (
          <div key={n} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15 }}>
            <span style={{ width: 22, height: 6, borderRadius: 3, background: c, flex: "none" }} />
            <b style={{ fontWeight: 600 }}>{n}</b>
            <span style={{ color: "#6F6A65", fontSize: 14 }}>{d}</span>
          </div>
        ))}
        <div style={{ padding: "10px 12px", borderRadius: 14, background: "#F8ECD8", color: "#A8661A", fontSize: 14, fontWeight: 600 }}>Nevrtejte v označeném pásu ±5 cm</div>
      </div>
    </Screen>
  );
}

// ================= Nový zápis (AI) =================
export function Zapis({ params }: P) {
  const { s, dispatch } = useStore();
  const nav = useNav();
  const ov = useOverlay();
  const kind = params.kind === "unik" ? "unik" : params.kind === "servis" ? "servis" : "obecny";
  const dev = DEVICES.find((d) => d.id === params.dev);
  // Průvodce může obrazovku otevřít rovnou vyplněnou (stav jako na konci scény ve videu).
  const prefill = (params.prefill ?? null) as ZapisPrefill | null;
  const [photos, setPhotos] = useState<string[]>(Array.isArray(params.photos) ? (params.photos as string[]) : []);
  const [docs, setDocs] = useState<{ id: string; name: string; meta: string; src?: string }[]>(prefill?.docs ?? []);
  const [docProg, setDocProg] = useState(1);
  const [sentence, setSentence] = useState(prefill?.sentence ?? "");
  const [draft, setDraft] = useState<ZapisPrefill["draft"] | null>(prefill?.draft ?? null);
  const [drafting, setDrafting] = useState(false);
  const docInput = useRef<HTMLInputElement>(null);
  const photoInput = useRef<HTMLInputElement>(null);
  const lastDrafted = useRef(prefill ? `${prefill.sentence}|${prefill.docs.map((d) => d.name).join(",")}` : "");
  const makeDraft = async (text = sentence) => {
    const t = text.trim();
    if (t.length < 6 || drafting) return;
    const key = `${t}|${docs.map((d) => d.name).join(",")}`;
    if (key === lastDrafted.current) return;
    lastDrafted.current = key;
    setDrafting(true);
    const r = await draftRecord(kind, t, docs, photos, s, Date.now(), dev?.name);
    setDraft(r);
    setDrafting(false);
  };

  const dict = useDictation((t, final) => {
    setSentence(t);
    if (final) void makeDraft(t);
  });

  const addDoc = async (f?: File) => {
    if (!f) return;
    const src = f.type.startsWith("image/") ? await saveImage(f, 2000, 0.85) : await saveFile(f);
    setDocProg(0);
    setDocs((d) => [...d, { id: uid("d"), name: f.name, meta: `${fileMeta(f)} · přiloženo k zápisu`, src }]);
    animateDoc();
  };
  const addDemoDoc = () => {
    setDocProg(0);
    setDocs((d) => [...d, { id: uid("d"), ...DEMO_DOC[kind] }]);
    animateDoc();
  };
  const animateDoc = () => {
    const t0 = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / 800);
      setDocProg(p);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const addPhotos = async (files: FileList | null) => {
    if (!files) return;
    const refs: string[] = [];
    for (const f of Array.from(files).slice(0, 4)) if (f.type.startsWith("image/")) refs.push(await saveImage(f));
    setPhotos((p) => [...p, ...refs].slice(0, 6));
  };

  const sign = () =>
    ov.sheet((close) => (
      <SignSheet
        name={kind === "unik" ? "Petr Novák · Instalatérství Novák" : "Petr Novák · servisní technik"}
        onSign={() => {
          close();
          if (!draft) return;
          const now = Date.now();
          const rec: WorkRecord = {
            id: uid("r"),
            at: now,
            kind,
            title: draft.title,
            deviceId: kind === "servis" ? "kotel" : kind === "unik" ? "uzaver" : dev?.id,
            houseId: "loucky",
            who: kind === "unik" ? "Instalatérství Novák" : kind === "servis" ? "Topení Bítov · P. Novák" : s.role === "technik" ? "Technik" : "Majitel",
            sentence: sentence.trim(),
            fields: draft.fields,
            photos,
            docs: docs.map((d) => ({ id: d.id, name: d.name, meta: d.meta })),
            ai: draft.source,
          };
          dispatch({ t: "sign", record: rec, now });
          nav.replace({ name: "ulozeno", params: { id: rec.id } }, "push");
        }}
      />
    ));

  const backLabel = kind === "unik" ? "Únik vody" : kind === "servis" ? "Kotel" : dev?.name ?? "Zpět";
  return (
    <Screen>
      <Body gap={12} bottom={2}>
        <Nav back={backLabel} onBack={nav.back} right={<span className="chip" style={{ background: "#FFFFFF", color: "#141414", border: "1px solid #E6E2DD" }}>Chata Loučky · {HOUSE_CODE}</span>} />
        <Title title="Nový zápis" sub="Fotky, dokumenty a jedna věta. Zbytek připraví AI." />
        <div style={{ display: "flex", gap: 10, flex: "none", overflowX: "auto", paddingBottom: 2 }}>
          {photos.map((p, i) => (
            <Photo key={`${p}-${i}`} src={p} style={{ width: 100, height: 100, borderRadius: 18, flex: "none" }} />
          ))}
          <button type="button" aria-label="Přidat fotku" onClick={() => photoInput.current?.click()} style={{ width: 100, height: 100, borderRadius: 18, border: "1.5px dashed #C8C1B8", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
            <Icon name="plus" size={26} color="#8D8781" />
          </button>
          <input ref={photoInput} type="file" accept="image/*" capture="environment" multiple hidden onChange={(e) => addPhotos(e.target.files)} />
        </div>
        {docs.map((d, i) => (
          <div key={d.id} className="card rise" style={{ padding: "9px 14px", display: "flex", alignItems: "center", gap: 12, flex: "none" }}>
            <Ic icon="doc" tone="clay" />
            <RowText title={d.name} sub={i === docs.length - 1 && docProg < 1 ? "Nahrávám…" : d.meta} titleStyle={{ fontSize: 15 }} />
            {i === docs.length - 1 && docProg < 1 ? (
              <span style={{ width: 54, height: 6, borderRadius: 3, background: "#E6E2DD", position: "relative", flex: "none" }}>
                <span style={{ position: "absolute", left: 0, top: 0, height: 6, borderRadius: 3, background: "#B5543A", width: `${docProg * 100}%` }} />
              </span>
            ) : (
              <Chip tone="muted">PDF</Chip>
            )}
          </div>
        ))}
        <div style={{ display: "flex", gap: 8, alignItems: "stretch", flex: "none" }}>
          <button type="button" onClick={() => docInput.current?.click()} style={{ flex: 1, minHeight: 52, borderRadius: 16, border: "1.5px dashed #C8C1B8", display: "flex", alignItems: "center", gap: 10, padding: "0 14px", color: "#6F6A65", fontSize: 15, fontWeight: 600, textAlign: "left" }}>
            <Icon name="doc" size={20} color="#6F6A65" />
            <span>
              Přidat dokument <span style={{ fontWeight: 500, fontSize: 13 }}>· revize, protokol, faktura</span>
            </span>
          </button>
          {!docs.some((d) => d.name === DEMO_DOC[kind].name) && (
            <button type="button" onClick={addDemoDoc} className="chip" style={{ height: "auto", background: "#fff", color: "#141414", whiteSpace: "normal", lineHeight: 1.2, maxWidth: 120, fontSize: 12, padding: "6px 10px" }}>
              Ukázkový {kind === "unik" ? "protokol" : kind === "servis" ? "revizní zpráva" : "doklad"}
            </button>
          )}
          <input ref={docInput} type="file" accept="application/pdf,image/*" hidden onChange={(e) => addDoc(e.target.files?.[0])} />
        </div>
        <div className="card" style={{ padding: 14, display: "flex", gap: 12, alignItems: "flex-start", minHeight: 84 }}>
          <button type="button" aria-label={dict.on ? "Zastavit diktování" : "Diktovat"} onClick={dict.toggle} style={{ width: 40, height: 40, borderRadius: 20, background: dict.on ? "#2E7D4F" : "#B5543A", display: "flex", alignItems: "center", justifyContent: "center", flex: "none", boxShadow: dict.on ? "0 0 0 8px rgba(46,125,79,0.18)" : "none", transition: "box-shadow 300ms" }}>
            <Icon name="mic" size={20} color="#fff" />
          </button>
          <textarea
            value={sentence}
            onChange={(e) => setSentence(e.target.value)}
            onBlur={() => makeDraft()}
            placeholder={dict.on ? "Poslouchám…" : "Řekněte nebo napište jednou větou, co jste udělal."}
            rows={3}
            aria-label="Věta k zápisu"
            style={{ flex: 1, minWidth: 0, border: 0, outline: "none", resize: "none", background: "transparent", fontSize: 16, lineHeight: 1.45 }}
          />
        </div>
        {!sentence && (
          <button type="button" className="chip" onClick={() => { setSentence(DEMO_SENTENCE[kind]); void makeDraft(DEMO_SENTENCE[kind]); }} style={{ height: "auto", padding: "8px 12px", whiteSpace: "normal", background: "#fff", color: "#141414", fontWeight: 500, lineHeight: 1.35, textAlign: "left", alignSelf: "flex-start" }}>
            Ukázka: „{DEMO_SENTENCE[kind]}“
          </button>
        )}
        {sentence.trim().length >= 6 && !draft && !drafting && (
          <button type="button" className="chip" onClick={() => makeDraft()} style={{ height: 36, background: "#F4E4DD", color: "#B5543A", alignSelf: "flex-start" }}>
            <Icon name="sparkle" size={14} color="#B5543A" />
            Připravit návrh zápisu
          </button>
        )}
        {drafting && (
          <div className="card" style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 10, color: "#6F6A65", fontSize: 14 }}>
            <span className="spin" style={{ color: "#B5543A" }} />
            AI připravuje zápis z věty{docs.length ? " a dokumentu" : ""}…
          </div>
        )}
        {draft && !drafting && (
          <div className="rise">
            <FieldsCard fields={draft.fields} badge="připravila AI" />
            {draft.source === "mistni" && <div style={{ fontSize: 11, color: "#A39D94", padding: "6px 4px 0" }}>Návrh z věty a pasu domu (bez připojené AI).</div>}
          </div>
        )}
      </Body>
      <div className="bottom-fade" />
      <div className="bottom" style={{ gap: 8 }}>
        <Btn icon="check" onClick={sign} disabled={!draft || drafting}>
          Potvrdit a podepsat
        </Btn>
        <span style={{ textAlign: "center", fontSize: 13, color: "#6F6A65" }}>Uloží se do pasu domu, majitel dostane PDF.</span>
      </div>
    </Screen>
  );
}

function SignSheet({ name, onSign }: { name: string; onSign: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [has, setHas] = useState(false);
  const pos = (e: React.PointerEvent) => {
    const c = canvas.current!;
    const r = c.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * c.width, ((e.clientY - r.top) / r.height) * c.height];
  };
  return (
    <>
      <h3>Podpis technika</h3>
      <p className="sh-sub">{name}</p>
      <canvas
        ref={canvas}
        width={680}
        height={260}
        style={{ width: "100%", height: 130, background: "#fff", borderRadius: 16, touchAction: "none", border: "1px solid #E6E2DD" }}
        onPointerDown={(e) => {
          drawing.current = true;
          (e.currentTarget as HTMLCanvasElement).setPointerCapture(e.pointerId);
          const ctx = canvas.current!.getContext("2d")!;
          const [x, y] = pos(e);
          ctx.beginPath();
          ctx.moveTo(x, y);
        }}
        onPointerMove={(e) => {
          if (!drawing.current) return;
          const ctx = canvas.current!.getContext("2d")!;
          ctx.lineWidth = 5;
          ctx.lineCap = "round";
          ctx.strokeStyle = "#141414";
          const [x, y] = pos(e);
          ctx.lineTo(x, y);
          ctx.stroke();
          if (!has) setHas(true);
        }}
        onPointerUp={() => (drawing.current = false)}
      />
      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <button
          type="button"
          className="btn light"
          style={{ height: 50 }}
          onClick={() => {
            const c = canvas.current!;
            c.getContext("2d")!.clearRect(0, 0, c.width, c.height);
            setHas(false);
          }}
        >
          Smazat
        </button>
        <button type="button" className="btn" style={{ height: 50 }} onClick={onSign} disabled={!has}>
          <Icon name="sign" size={20} color="#fff" />
          Podepsat
        </button>
      </div>
    </>
  );
}

// ================= Uloženo do pasu domu =================
export function Ulozeno({ params }: P) {
  const { s } = useStore();
  const nav = useNav();
  const r = s.records.find((x) => x.id === params.id);
  const done = () => (s.role === "technik" ? nav.reset([{ name: "zakazky" }], "fade") : nav.reset([{ name: "domy" }, { name: "dum", params: { id: "loucky" } }], "fade"));
  if (!r) return <DoneScreen title="Uloženo do pasu domu" items={[]} onDone={done} />;
  const next = r.fields.find((f) => f.k === "Další termín")?.v;
  const items =
    r.kind === "unik"
      ? [
          { icon: "check" as const, tone: "ok" as const, title: "Majitel dostal zprávu", sub: `Zápis a ${r.docs[0]?.name.replace(/\.pdf$/i, "").toLowerCase() ?? "fotky opravy"}` },
          { icon: "drop" as const, tone: "info" as const, title: "Uzávěr znovu otevřen", sub: "Průtok 0,0 l/min, bez úniku" },
          { icon: "cube" as const, tone: "neutral" as const, title: "Zapsáno do modelu domu", sub: `Oprava u kolena za vodoměrem · ${dm(r.at)}` },
        ]
      : r.kind === "servis"
        ? [
            { icon: "check" as const, tone: "ok" as const, title: "Majitel dostal zprávu", sub: "Zápis a PDF se servisním listem" },
            { icon: "calendar" as const, tone: "clay" as const, title: `Další servis ${next ?? ""}`, sub: "Přidáno do termínů, připomene se samo" },
          ]
        : [
            { icon: "check" as const, tone: "ok" as const, title: "Zápis v historii domu", sub: r.title },
            { icon: "doc" as const, tone: "neutral" as const, title: `${r.photos.length} fotky · ${r.docs.length} dokumenty`, sub: "Uloženo v pasu domu" },
          ];
  return <DoneScreen title="Uloženo do pasu domu" items={items} onDone={done} />;
}

// ================= Zamčená obrazovka (zpráva majiteli) =================
export function Zamek(_: P) {
  const { s, dispatch } = useStore();
  const nav = useNav();
  const time = useNowLabel();
  const now = useNow();
  const ids = s.lockQueue.length ? s.lockQueue : s.notifs.filter((n) => n.role === "vlastnik").slice(0, 1).map((n) => n.id);
  const list = s.notifs.filter((n) => ids.includes(n.id));
  const open = (n: (typeof list)[number]) => {
    dispatch({ t: "lockShown" });
    dispatch({ t: "readNotif", id: n.id });
    nav.reset(n.go?.length ? n.go : [{ name: "domy" }], "fade");
  };
  return (
    <Screen dark bg="#000">
      <img src={IMG("img/wall.jpg")} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.72)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: "calc(var(--sb) + 45px)", textAlign: "center", color: "#fff" }}>
        <div style={{ fontSize: 20, fontWeight: 600, opacity: 0.92 }}>{lockDate(now)}</div>
        <div style={{ fontSize: 92, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1 }}>{time}</div>
      </div>
      <div style={{ position: "absolute", left: 12, right: 12, top: "calc(var(--sb) + 253px)", display: "flex", flexDirection: "column", gap: 10, zIndex: 6 }}>
        {list.map((n, i) => (
          <button key={n.id} type="button" className="rise" onClick={() => open(n)} style={{ padding: 14, borderRadius: 22, background: "rgba(250,248,245,0.93)", display: "flex", gap: 12, textAlign: "left", animationDelay: `${300 + i * 120}ms` }}>
            <span className="appicon">B</span>
            <span style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6F6A65" }}>
                <b style={{ color: "#141414", fontWeight: 600 }}>BULO</b>
                teď
              </span>
              <b style={{ fontSize: 15, fontWeight: 600 }}>{n.title}</b>
              <span style={{ fontSize: 15, lineHeight: 1.35 }}>{n.body}</span>
            </span>
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => {
          dispatch({ t: "lockShown" });
          nav.reset([{ name: "domy" }], "fade");
        }}
        style={{ position: "absolute", left: 0, right: 0, bottom: "calc(var(--hb) + 18px)", color: "#fff", fontSize: 14, fontWeight: 600, opacity: 0.85, textAlign: "center" }}
      >
        Odemknout
      </button>
    </Screen>
  );
}

