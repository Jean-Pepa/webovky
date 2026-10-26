"use client";

import { useState, type ReactNode } from "react";
import { Icon, type IconName } from "../icons";
import { useNav } from "../nav";
import { useStore } from "../store";
import { HISTORY, WALK } from "../data";
import type { Tone } from "../types";
import { dmy, hm } from "../time";
import { Photo } from "../camera";
import { Body, Bottom, Chevron, Chip, Ic, Label, Nav, Row, RowText, Screen, Title } from "../ui";
import { Empty, otherData, useHouse } from "./common";

type P = { params: Record<string, unknown> };

// ================= Historie =================
export function Historie({ params }: P) {
  const house = useHouse(params.id);
  const { s } = useStore();
  const nav = useNav();
  const demo = house.id === "loucky";
  const seed = demo ? HISTORY : otherData(house.id).history;
  const mine = demo
    ? s.records.map((r) => ({
        id: r.id,
        date: dmy(r.at),
        title: r.title,
        detail: r.fields.find((f) => f.k === "Výsledek")?.v ?? r.sentence,
        who: r.who,
        icon: (r.kind === "unik" ? "drop" : r.kind === "servis" ? "flame" : r.kind === "vymena" ? "refresh" : "camera") as IconName,
        tone: (r.kind === "unik" ? "info" : "clay") as Tone,
        record: r.id,
      }))
    : [];
  const all = [...mine, ...seed];
  const years = [...new Set(all.map((h) => h.date.split(". ").pop() ?? ""))];
  return (
    <Screen>
      <Body gap={12}>
        <Nav back="Dům" onBack={nav.back} right={<Chip tone="muted">{all.length} změn</Chip>} />
        <Title title="Historie" sub="Každý zásah, revize a dokument. Nic se nepřepisuje, předchozí stav zůstává." />
        {!all.length && <Empty icon="history" title="Historie je prázdná" sub="Zápisy techniků a nahrané dokumenty se tu řadí samy." />}
        {years.map((y) => (
          <div key={y} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <Label>{y}</Label>
            <div className="card" style={{ overflow: "hidden" }}>
              {all
                .filter((h) => h.date.endsWith(y))
                .map((h) => (
                  <Row key={h.id} onClick={"record" in h && h.record ? () => nav.push({ name: "zaznam", params: { id: h.record } }) : undefined}>
                    <Ic icon={h.icon} tone={h.tone} />
                    <RowText title={h.title} sub={`${h.date.replace(` ${y}`, "")} · ${h.detail} · ${h.who}`} />
                    {"record" in h && h.record ? <Chevron /> : null}
                  </Row>
                ))}
            </div>
          </div>
        ))}
      </Body>
    </Screen>
  );
}

// ================= Procházka (záběry ze stavby) =================
export function Prochazka({ params }: P) {
  const house = useHouse(params.id);
  const nav = useNav();
  const [open, setOpen] = useState<number | null>(null);
  if (house.id !== "loucky")
    return (
      <Screen>
        <Body gap={12}>
          <Nav back="Dům" onBack={nav.back} />
          <Title title="Procházka" sub="Fotky a záběry ze stavby" />
          <Empty icon="walk" title="Zatím bez záběrů" sub="Stavbyvedoucí nahrává fotky rozvodů před zakrytím. AI je zarovná s modelem domu." />
        </Body>
      </Screen>
    );
  const cur = open !== null ? WALK[open] : null;
  return (
    <Screen bg={cur ? "#000" : undefined} dark={!!cur}>
      {cur ? (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", background: "#000" }}>
          <img src={cur.src} alt={cur.title} style={{ width: "100%", maxHeight: "70%", objectFit: "contain" }} />
          <div style={{ color: "#fff", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 4 }}>
            <b style={{ fontSize: 18 }}>{cur.title}</b>
            <span style={{ fontSize: 14, opacity: 0.75 }}>{cur.sub}</span>
          </div>
          <div style={{ position: "absolute", left: 20, right: 20, top: "calc(var(--sb) + 10px)", display: "flex", justifyContent: "space-between" }}>
            <button type="button" className="round-btn" aria-label="Zavřít" onClick={() => setOpen(null)} style={{ width: 44, height: 44, borderRadius: 22 }}>
              <Icon name="close" size={22} color="#fff" />
            </button>
            <span className="glass-chip">
              {open! + 1} / {WALK.length}
            </span>
          </div>
          <div style={{ position: "absolute", left: 20, right: 20, bottom: "calc(var(--hb) + 20px)", display: "flex", gap: 10 }}>
            <button type="button" className="btn light" disabled={open === 0} onClick={() => setOpen((o) => Math.max(0, (o ?? 0) - 1))}>
              Předchozí
            </button>
            <button type="button" className="btn" disabled={open === WALK.length - 1} onClick={() => setOpen((o) => Math.min(WALK.length - 1, (o ?? 0) + 1))}>
              Další
            </button>
          </div>
        </div>
      ) : (
        <Body gap={12}>
          <Nav back="Dům" onBack={nav.back} right={<Chip tone="muted">212 záběrů</Chip>} />
          <Title title="Procházka" sub="Záběry ze stavby a z domu, zarovnané s modelem. Ukázka 10 z 212." />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {WALK.map((w, i) => (
              <button key={w.src} type="button" onClick={() => setOpen(i)} className="card press" style={{ overflow: "hidden", textAlign: "left", display: "flex", flexDirection: "column" }}>
                <img src={w.src} alt="" style={{ width: "100%", height: 110, objectFit: "cover", display: "block" }} />
                <span style={{ padding: "8px 10px 10px", display: "flex", flexDirection: "column", gap: 1 }}>
                  <b style={{ fontSize: 14, fontWeight: 600 }}>{w.title}</b>
                  <span style={{ fontSize: 12, color: "#6F6A65" }}>{w.sub}</span>
                </span>
              </button>
            ))}
          </div>
        </Body>
      )}
    </Screen>
  );
}

// ================= Zápis (detail záznamu) =================
export function Zaznam({ params }: P) {
  const { s } = useStore();
  const nav = useNav();
  const r = s.records.find((x) => x.id === params.id);
  if (!r)
    return (
      <Screen>
        <Body>
          <Nav back="Zpět" onBack={nav.back} />
          <Empty icon="doc" title="Zápis nenalezen" sub="Možná byla ukázková data obnovena." />
        </Body>
      </Screen>
    );
  return (
    <Screen>
      <Body gap={12}>
        <Nav back="Zpět" onBack={nav.back} right={<Chip tone="ok" icon="sign">podepsáno</Chip>} />
        <Title title={r.title} sub={`${dmy(r.at)} v ${hm(r.at)} · ${r.who}`} />
        {r.photos.length > 0 && (
          <div style={{ display: "flex", gap: 10 }}>
            {r.photos.map((p, i) => (
              <Photo key={`${p}-${i}`} src={p} style={{ width: 92, height: 92, borderRadius: 14 }} />
            ))}
          </div>
        )}
        {r.docs.map((d) => (
          <div className="card" key={d.id} style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }}>
            <Ic icon="doc" tone="bad" />
            <RowText title={d.name} sub={d.meta} titleStyle={{ fontSize: 15 }} />
            <Chip tone="muted">PDF</Chip>
          </div>
        ))}
        {r.sentence && (
          <div className="card" style={{ padding: "12px 14px", display: "flex", gap: 12, alignItems: "flex-start" }}>
            <Ic icon="mic" tone="clay" />
            <span style={{ fontSize: 15, lineHeight: 1.4 }}>„{r.sentence}“</span>
          </div>
        )}
        <FieldsCard fields={r.fields} badge={r.ai === "claude" ? "připravila AI · Claude" : "připravila AI"} />
        <div style={{ fontSize: 13, color: "#6F6A65", padding: "0 4px", lineHeight: 1.45 }}>Zápis je uložený v pasu domu a nedá se přepsat. Opravy se přidávají jako nový zápis.</div>
      </Body>
    </Screen>
  );
}

export function FieldsCard({ fields, badge, children }: { fields: { k: string; v: string; note?: string }[]; badge?: string; children?: ReactNode }) {
  return (
    <div className="card" style={{ padding: "6px 14px 8px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#6F6A65" }}>Návrh zápisu</span>
        {badge && <Chip tone="clay">{badge}</Chip>}
      </div>
      {fields.map((f) => (
        <div key={f.k} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderTop: "1px solid #E6E2DD" }}>
          <span style={{ width: 80, fontSize: 13, color: "#6F6A65", flex: "none" }}>{f.k}</span>
          <b style={{ flex: 1, fontSize: 15, fontWeight: 600 }}>{f.v}</b>
          {f.note && <span style={{ fontSize: 11, color: "#6F6A65" }}>{f.note}</span>}
        </div>
      ))}
      {children}
    </div>
  );
}

// ================= Hotovo (zelená fajfka + výsledky) =================
export function DoneScreen({ title, items, onDone, statusTime }: { title: string; items: { icon: IconName; tone: Tone; title: string; sub: string }[]; onDone: () => void; statusTime?: string }) {
  return (
    <Screen bg="#F2F0ED" statusTime={statusTime}>
      <div style={{ position: "absolute", left: 24, right: 24, top: "calc(var(--sb) + 110px)", display: "flex", flexDirection: "column", alignItems: "center", gap: 18, textAlign: "center" }}>
        <span className="popin" style={{ width: 108, height: 108, borderRadius: 54, background: "#2E7D4F", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="check" size={56} color="#fff" sw={3} />
        </span>
        <div className="lt" style={{ fontSize: 30 }}>
          {title}
        </div>
        <div className="card rise" style={{ alignSelf: "stretch", textAlign: "left", overflow: "hidden", animationDelay: "160ms" }}>
          {items.map((it) => (
            <div className="row" key={it.title}>
              <Ic icon={it.icon} tone={it.tone} />
              <RowText title={it.title} sub={it.sub} />
            </div>
          ))}
        </div>
      </div>
      <Bottom fade={false}>
        <button type="button" className="btn light" onClick={onDone}>
          Hotovo
        </button>
      </Bottom>
    </Screen>
  );
}
