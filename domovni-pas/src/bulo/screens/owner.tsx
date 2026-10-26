"use client";

import { useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Icon, type IconName } from "../icons";
import { useNav } from "../nav";
import { ActionList, useOverlay } from "../overlay";
import { houseStatus, sensorCount, chimneyDue, upcoming, useStore } from "../store";
import { HISTORY, TONES, DEVICES } from "../data";
import type { HouseInfo } from "../types";
import { relDays } from "../time";
import { GlassTab } from "../tabbar";
import { Body, Bottom, Btn, Chevron, Ic, Label, Nav, Row, RowText, Screen, Title, useNow } from "../ui";
import { otherData, useAccount, useHouse, useZapsat, switchRole } from "./common";

type P = { params: Record<string, unknown> };

// ================= Nemovitosti =================
export function Domy(_: P) {
  const { s, dispatch } = useStore();
  const nav = useNav();
  const account = useAccount();
  const [q, setQ] = useState("");
  const now = useNow();
  const list = s.houses.filter((h) => `${h.name} ${h.place} ${h.kind}`.toLowerCase().includes(q.trim().toLowerCase()));

  const status = (h: HouseInfo): { text: string; color: string } => {
    if (h.demo) {
      if (s.leak?.phase === "flow") return { text: "únik vody", color: TONES.bad.fg };
      if (s.leak?.phase === "closed") return { text: "uzávěr zavřen", color: TONES.warn.fg };
      const n = upcoming(s, now).length;
      return n ? { text: n === 1 ? "1 termín" : `${n} termíny`, color: TONES.warn.fg } : { text: "v pořádku", color: TONES.ok.fg };
    }
    if (h.userMade) return { text: "nový pas", color: TONES.muted.fg };
    return { text: otherData(h.id).status, color: TONES.ok.fg };
  };

  return (
    <Screen>
      <Body gap={14} bottom={false}>
        <div className="nav">
          <button type="button" onClick={account} aria-label="Účet a ukázka" style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.32em", color: "#B5543A", padding: "8px 0" }}>
            BULO
          </button>
          <button type="button" className="ic" style={{ background: "#FFFFFF", width: 40, height: 40 }} onClick={() => nav.push("nova-nemovitost")} aria-label="Přidat nemovitost">
            <Icon name="plus" size={20} color="#141414" sw={2.2} />
          </button>
        </div>
        <div className="lt">Nemovitosti</div>
        <label style={{ height: 40, borderRadius: 12, background: "#E5E1DB", display: "flex", alignItems: "center", gap: 8, padding: "0 12px", color: "#8D8781", fontSize: 16, flex: "none" }}>
          <Icon name="search" size={18} color="#8D8781" sw={2.2} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Hledat"
            aria-label="Hledat nemovitost"
            style={{ flex: 1, minWidth: 0, background: "transparent", border: 0, outline: "none", fontSize: 16, color: "#141414" }}
          />
        </label>
        <div className="lbl" style={{ marginTop: 6, letterSpacing: "0.02em" }}>
          VAŠE BUDOVY · {s.houses.length}
        </div>
        <div className="card" style={{ overflow: "hidden", marginTop: -6 }}>
          {list.map((h) => {
            const st = status(h);
            return (
              <Row key={h.id} style={{ padding: "11px 12px 11px 14px" }} onClick={() => nav.push({ name: "dum", params: { id: h.id } })}>
                <span style={{ width: 44, height: 44, borderRadius: 12, background: h.color, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                  <Icon name={h.icon} size={24} color="#fff" sw={2} />
                </span>
                <RowText title={h.name} sub={`${h.place} · ${h.kind}`} titleStyle={{ fontSize: 17 }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: st.color, whiteSpace: "nowrap" }}>{st.text}</span>
                <Chevron />
              </Row>
            );
          })}
          {!list.length && (
            <div className="row">
              <RowText title="Nic nenalezeno" sub={`Žádná budova neodpovídá „${q}“`} />
            </div>
          )}
        </div>
        <div style={{ fontSize: 13, lineHeight: 1.45, color: "#6F6A65", padding: "0 6px" }}>
          Data do pasu vkládají firmy, které se o dům starají: architekt, správce nebo servisní firma.
        </div>
        <button
          type="button"
          className="card press"
          onClick={() => switchRole(s, dispatch, nav, "technik")}
          style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", marginTop: 6, textAlign: "left" }}
        >
          <Ic icon="qr" tone="neutral" />
          <RowText title="Jsem technik" sub="Zakázky a přihlášení kódem domu" />
          <Chevron />
        </button>
      </Body>
    </Screen>
  );
}

// ================= Pas domu =================
export function Dum({ params }: P) {
  const house = useHouse(params.id);
  const { s } = useStore();
  const nav = useNav();
  const ov = useOverlay();
  const zapsat = useZapsat(house.id);
  const now = useNow();
  const demo = !!house.demo;
  const other = otherData(house.id);

  const st = demo ? houseStatus(s, now) : { tone: "ok" as const, title: house.userMade ? "Pas je založený" : "Vše v pořádku", sub: house.userMade ? "Přidejte dokumenty a zařízení" : "Žádný termín se neblíží" };
  const stIcon: IconName = st.tone === "ok" ? "check" : "drop";
  const devCount = demo ? DEVICES.length : other.devices.length;
  const histCount = demo ? HISTORY.length + s.records.length : other.history.length;
  const share = () =>
    ov.sheet((close) => (
      <>
        <h3>Sdílet pas domu</h3>
        <p className="sh-sub">{house.name} · kód {house.code}</p>
        <ActionList
          close={close}
          items={[
            { icon: "qr", label: "Kód domu pro techniky", sub: "QR na zeď u vchodu", onClick: () => nav.push({ name: "kod-domu", params: { id: house.id } }) },
            {
              icon: "link",
              label: "Poslat odkaz na appku",
              sub: "Přes zprávy nebo e-mail",
              onClick: async () => {
                const url = `${window.location.origin}/aplikace`;
                try {
                  if (navigator.share) await navigator.share({ title: `BULO · ${house.name}`, text: `Pas domu ${house.name}`, url });
                  else {
                    await navigator.clipboard.writeText(url);
                    ov.toast("Odkaz zkopírován");
                  }
                } catch {
                  // sdílení zrušeno
                }
              },
            },
            { icon: "download", label: "Stáhnout data domu", sub: "Vše v jednom souboru (JSON)", onClick: () => exportHouse(house, s) },
          ]}
        />
      </>
    ));

  return (
    <Screen>
      <Body gap={14} tab>
        <Nav
          back="Nemovitosti"
          onBack={() => nav.reset([{ name: "domy" }], "pop")}
          right={
            <button type="button" className="ic" style={{ background: "#FFFFFF", width: 40, height: 40 }} onClick={share} aria-label="Sdílet pas domu">
              <Icon name="share" size={20} color="#141414" />
            </button>
          }
        />
        <Title title={house.name} sub={`${house.place} · pas domu`} />
        <div style={{ position: "relative", height: 132, borderRadius: 22, overflow: "hidden", flex: "none", background: house.hero ? undefined : `linear-gradient(135deg, ${house.color}, #2a211e)` }}>
          {house.hero ? (
            <img src={house.hero} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} alt={`${house.name} z venku`} />
          ) : (
            <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name={house.icon} size={56} color="rgba(255,255,255,0.75)" sw={1.6} />
            </span>
          )}
          {demo && (
            <button type="button" style={{ position: "absolute", left: 12, bottom: 12 }} onClick={() => nav.push({ name: "model", params: { id: house.id } })}>
              <span className="chip" style={{ background: "rgba(255,255,255,0.94)", color: "#141414" }}>
                <Icon name="cube" size={14} color="#141414" sw={2.4} />
                3D model
              </span>
            </button>
          )}
        </div>
        <div className="card" style={{ padding: 14, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="ic" style={{ background: TONES[st.tone].bg }}>
              <Icon name={stIcon} size={22} color={TONES[st.tone].fg} sw={2.6} />
            </span>
            <RowText title={st.title} sub={st.sub} titleStyle={{ fontSize: 17, fontWeight: 700 }} />
          </div>
          {demo && s.leak && s.leak.phase !== "fixed" && (
            <button type="button" className="press" onClick={() => nav.push({ name: "unik" })} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 16, background: TONES[s.leak.phase === "flow" ? "bad" : "warn"].bg, textAlign: "left" }}>
              <RowText
                title={s.leak.phase === "flow" ? "Hlídač vody hlásí průtok" : "Uzávěr vody zavřen"}
                sub={s.leak.phase === "flow" ? `0,4 l/min od ${s.leak.since} · nikdo vodu nepouští` : "Instalatér přijde dnes v 16:00"}
                titleStyle={{ fontSize: 15 }}
                subStyle={{ color: TONES[s.leak.phase === "flow" ? "bad" : "warn"].fg }}
              />
              <Icon name="chevron" size={20} color="#6F6A65" sw={1.9} />
            </button>
          )}
          {demo && (
            <button type="button" className="press" onClick={() => nav.reset([{ name: "domy" }, { name: "terminy", params: { id: house.id } }], "none")} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 16, background: "#F2F0ED", textAlign: "left" }}>
              <RowText
                title="Kontrola komína"
                sub={s.chimneyBooked ? `objednáno · ${s.chimneyBooked.slot}` : `${relDays(chimneyDue(s), now)} · povinná`}
                titleStyle={{ fontSize: 15 }}
                subStyle={{ color: s.chimneyBooked ? TONES.ok.fg : "#A8661A" }}
              />
              <Icon name="chevron" size={20} color="#6F6A65" sw={1.9} />
            </button>
          )}
          {demo && (
            <button type="button" className="press" onClick={() => nav.push({ name: "hlidace", params: { id: house.id } })} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 16, background: "#F2F0ED", marginTop: -4, textAlign: "left" }}>
              <Icon name="shield" size={20} color="#2E7D4F" />
              <RowText title="Hlídače" sub={`${sensorCount(s)} čidel hlídá dům · ${s.leak?.phase === "flow" ? "voda teče" : "vše v pořádku"}`} titleStyle={{ fontSize: 15 }} subStyle={{ color: s.leak?.phase === "flow" ? TONES.bad.fg : "#2E7D4F" }} />
              <Icon name="chevron" size={20} color="#6F6A65" sw={1.9} />
            </button>
          )}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Tile icon="grid" title="Zařízení" sub={demo ? `${devCount} · na mapě` : `${devCount} · seznam`} onClick={() => nav.reset([{ name: "domy" }, { name: "zarizeni", params: { id: house.id } }], "none")} />
          <Tile icon="doc" title="Dokumenty" sub={demo ? "BIM, povolení, PBŘ" : `${other.docs.length} složky`} onClick={() => nav.reset([{ name: "domy" }, { name: "dokumenty", params: { id: house.id } }], "none")} />
          <Tile icon="history" title="Historie" sub={`${histCount} změn`} onClick={() => nav.push({ name: "historie", params: { id: house.id } })} />
          <Tile icon="walk" title="Procházka" sub={demo ? "212 záběrů" : "zatím bez záběrů"} onClick={() => nav.push({ name: "prochazka", params: { id: house.id } })} />
          <Tile icon="bolt" title="Spotřeba" sub="elektřina, voda, plyn" onClick={() => nav.push({ name: "spotreba", params: { id: house.id } })} />
          <Tile icon="layers" title="Výkresy" sub="půdorysy, řezy" onClick={() => nav.push({ name: "vykresy", params: { id: house.id } })} />
        </div>
        {demo && (
          <>
            <Label style={{ marginTop: 4 }}>PŘIPRAVUJEME</Label>
            <div className="card" style={{ overflow: "hidden", marginTop: -6 }}>
              <Row onClick={() => nav.push({ name: "obnova", params: { id: house.id } })}>
                <Ic icon="sparkle" tone="clay" />
                <RowText title="Plán obnovy" sub="Co a kdy opravit · AI podle stáří a spotřeby" />
                <Chevron />
              </Row>
              <Row onClick={() => nav.push({ name: "agent", params: { id: house.id } })}>
                <Ic icon="agent" tone="neutral" />
                <RowText title="Agent projektu" sub="Podklady od profesí a termíny rekonstrukce" />
                <Chevron />
              </Row>
            </div>
          </>
        )}
      </Body>
      <GlassTab active="dum" houseId={house.id} onZapsat={zapsat} />
    </Screen>
  );
}

function Tile({ icon, title, sub, onClick }: { icon: IconName; title: string; sub: string; onClick: () => void }) {
  return (
    <button type="button" className="tile" onClick={onClick}>
      <Icon name={icon} size={23} color="#141414" sw={1.9} />
      <span style={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <b>{title}</b>
        <span>{sub}</span>
      </span>
    </button>
  );
}

function exportHouse(house: HouseInfo, s: ReturnType<typeof useStore>["s"]) {
  const data = {
    exportovano: new Date().toISOString(),
    dum: house,
    stav: house.demo ? { kotel: s.boiler, predchoziKotle: s.oldBoilers, hlidacVody: s.water, unik: s.leak, zapisy: s.records } : {},
    historie: house.demo ? HISTORY : otherData(house.id).history,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `BULO-${house.code}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

// ================= Kód domu (QR na zeď) =================
export function KodDomu({ params }: P) {
  const house = useHouse(params.id);
  const nav = useNav();
  const ov = useOverlay();
  const url = useMemo(() => `${typeof window !== "undefined" ? window.location.origin : ""}/q/${house.code}`, [house.code]);
  return (
    <Screen>
      <Body gap={14} bottom>
        <Nav back="Zpět" onBack={nav.back} />
        <Title title="Kód domu" sub="Vytiskněte a dejte na zeď u vchodu. Technik ho naskenuje a uvidí jen to, co k práci potřebuje." />
        <div className="card" style={{ padding: "26px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: "0.32em", color: "#B5543A" }}>BULO</span>
          <span style={{ fontSize: 14, color: "#6F6A65", marginTop: -8 }}>Pas domu</span>
          <QRCodeSVG value={url} size={190} fgColor="#141414" bgColor="#FFFFFF" level="M" />
          <b style={{ fontSize: 18 }}>{house.name}</b>
          <span className="chip" style={{ background: "#F2F0ED", color: "#141414", fontSize: 15 }}>
            kód {house.code}
          </span>
        </div>
        <div style={{ fontSize: 13, color: "#6F6A65", lineHeight: 1.45, padding: "0 6px" }}>
          Odkaz v kódu: {url}
        </div>
      </Body>
      <Bottom>
        <Btn
          variant="light"
          icon="link"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(url);
              ov.toast("Odkaz zkopírován");
            } catch {
              ov.toast(url);
            }
          }}
        >
          Kopírovat
        </Btn>
        <Btn icon="download" onClick={() => window.print()}>
          Vytisknout
        </Btn>
      </Bottom>
    </Screen>
  );
}

// ================= Nová nemovitost =================
const KINDS: { k: string; icon: IconName; color: string }[] = [
  { k: "rodinný dům", icon: "house", color: "#B5543A" },
  { k: "byt", icon: "building", color: "#3E7CB1" },
  { k: "SVJ", icon: "building", color: "#5E7B4C" },
  { k: "chata", icon: "house", color: "#8A6D3B" },
  { k: "firma", icon: "warehouse", color: "#4F7A5A" },
];

export function NovaNemovitost(_: P) {
  const { s, dispatch } = useStore();
  const nav = useNav();
  const [name, setName] = useState("");
  const [place, setPlace] = useState("");
  const [kind, setKind] = useState(KINDS[0]);
  const ok = name.trim().length > 1 && place.trim().length > 1;
  const create = () => {
    const id = `h-${Date.now().toString(36)}`;
    const letters = name
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^A-Za-z]/g, "")
      .slice(0, 3)
      .toUpperCase()
      .padEnd(3, "X");
    const code = `${letters}-${String(1000 + s.houses.length * 37).slice(-4)}`;
    dispatch({ t: "addHouse", house: { id, name: name.trim(), place: place.trim(), kind: kind.k, icon: kind.icon, color: kind.color, code, userMade: true, createdAt: Date.now() } });
    nav.reset([{ name: "domy" }, { name: "dum", params: { id } }], "push");
  };
  return (
    <Screen>
      <Body gap={14} bottom>
        <Nav back="Nemovitosti" onBack={nav.back} />
        <Title title="Nová nemovitost" sub="Založte pas domu. Výkresy a dokumenty pak nahraje architekt nebo správce." />
        <Label>NÁZEV</Label>
        <input className="field" style={{ marginTop: -8 }} value={name} onChange={(e) => setName(e.target.value)} placeholder="např. Dům na Kopečku" />
        <Label>MÍSTO</Label>
        <input className="field" style={{ marginTop: -8 }} value={place} onChange={(e) => setPlace(e.target.value)} placeholder="Obec" />
        <Label>TYP</Label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: -6 }}>
          {KINDS.map((k) => (
            <button
              key={k.k}
              type="button"
              className="chip"
              onClick={() => setKind(k)}
              style={{ height: 36, padding: "0 14px", fontSize: 14, background: kind.k === k.k ? "#141414" : "#FFFFFF", color: kind.k === k.k ? "#fff" : "#141414" }}
            >
              <Icon name={k.icon} size={15} color={kind.k === k.k ? "#fff" : "#141414"} />
              {k.k}
            </button>
          ))}
        </div>
      </Body>
      <Bottom note="Pas dostane vlastní kód domu pro techniky.">
        <Btn icon="check" onClick={create} disabled={!ok}>
          Založit pas domu
        </Btn>
      </Bottom>
    </Screen>
  );
}

