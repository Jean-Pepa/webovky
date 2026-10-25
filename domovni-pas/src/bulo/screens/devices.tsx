"use client";

import { useState } from "react";
import { Icon } from "../icons";
import { useNav } from "../nav";
import { useOverlay } from "../overlay";
import { chimneyDue, useStore } from "../store";
import { DEVICES, HISTORY, OFFERS, RENEWAL_BASE } from "../data";
import type { Device, Tone } from "../types";
import { DAY, dm, relDays } from "../time";
import { Plan, PlanPin } from "../plan";
import { GlassTab } from "../tabbar";
import { Body, Bottom, Btn, Chevron, Chip, Ic, Label, Nav, Row, RowText, Screen, Title, useNow } from "../ui";
import { Empty, otherData, useHouse, useZapsat } from "./common";

type P = { params: Record<string, unknown> };

// Stav zařízení pro seznam / mapu (podle stavu ukázky).
export function deviceChip(d: Device, s: ReturnType<typeof useStore>["s"], now: number, forTech = false): { text: string; tone: Tone } {
  if (d.id === "kotel") {
    if (!s.serviceDoneAt && s.boiler.serviceNext === "dnes") return { text: forTech ? "servis dnes" : "Servis dnes", tone: "warn" };
    if (s.boiler.flueCheck) return { text: "revize spalin", tone: "warn" };
    return { text: "v pořádku", tone: "ok" };
  }
  if (d.id === "komin") return s.chimneyBooked ? { text: `objednáno ${s.chimneyBooked.slot}`, tone: "ok" } : { text: relDays(chimneyDue(s), now), tone: "warn" };
  if (d.id === "uzaver") {
    if (s.leak?.phase === "closed") return { text: `zavřen ${new Date(s.leak.closedAt ?? now).getHours()}:${String(new Date(s.leak.closedAt ?? now).getMinutes()).padStart(2, "0")}`, tone: "warn" };
    if (s.leak?.phase === "flow") return { text: "otevřen", tone: "bad" };
  }
  return { text: "v pořádku", tone: "ok" };
}

const PIN_COLOR: Record<string, string> = { kotel: "#B5543A", komin: "#A8661A", rozvadec: "#2E7D4F", uzaver: "#2E7D4F" };

// ================= Zařízení (záložka) =================
export function Zarizeni({ params }: P) {
  const house = useHouse(params.id);
  const { s } = useStore();
  const nav = useNav();
  const zapsat = useZapsat(house.id);
  const now = useNow();
  const demo = house.id === "loucky";
  const [view, setView] = useState<"mapa" | "seznam">(demo ? "mapa" : "seznam");
  const [sel, setSel] = useState("kotel");
  const devices = demo ? DEVICES : otherData(house.id).devices;
  const mapped = devices.filter((d) => d.plan);
  const open = (d: Device) => nav.push({ name: "zarizeni-detail", params: { id: house.id, dev: d.id } });

  return (
    <Screen>
      <Body gap={12} tab>
        <Title title="Zařízení" sub={demo ? `${devices.length} zařízení · 1. NP · klepněte na značku` : `${devices.length} zařízení`} />
        {demo && (
          <div className="seg" role="tablist" aria-label="Zobrazení">
            <button type="button" role="tab" aria-selected={view === "mapa"} className={view === "mapa" ? "on" : ""} onClick={() => setView("mapa")}>
              <Icon name="layers" size={16} color={view === "mapa" ? "#141414" : "#6F6A65"} />
              Mapa
            </button>
            <button type="button" role="tab" aria-selected={view === "seznam"} className={view === "seznam" ? "on" : ""} onClick={() => setView("seznam")}>
              Seznam
            </button>
          </div>
        )}
        {!devices.length && <Empty icon="grid" title="Zatím žádná zařízení" sub="Kotel, rozvaděč, uzávěry… Přidá je technik při zápisu nebo architekt z modelu." />}
        {view === "mapa" && demo ? (
          <>
            <div className="card" style={{ padding: "4px 0", display: "flex", justifyContent: "center" }}>
              <Plan label="Půdorys 1. NP chaty se zařízeními">
                {mapped
                  .filter((d) => d.id !== sel)
                  .map((d) => (
                    <PlanPin key={d.id} x={d.plan![0]} y={d.plan![1]} n={d.num} color={d.id === "uzaver" && s.leak?.phase === "closed" ? "#2F7FD8" : PIN_COLOR[d.id] ?? "#2E7D4F"} onClick={() => setSel(d.id)} />
                  ))}
                {mapped
                  .filter((d) => d.id === sel)
                  .map((d) => (
                    <PlanPin key={d.id} x={d.plan![0]} y={d.plan![1]} n={d.num} color={PIN_COLOR[d.id] ?? "#2E7D4F"} big halo label={d.id === "uzaver" ? "Uzávěr" : d.name.replace(" R1", "")} labelSide={d.id === "rozvadec" ? "below" : "right"} onClick={() => open(d)} />
                  ))}
              </Plan>
            </div>
            <div className="card" style={{ overflow: "hidden" }}>
              {mapped.map((d) => {
                const c = deviceChip(d, s, now);
                return (
                  <Row key={d.id} onClick={() => open(d)} style={{ background: sel === d.id ? "#FBF6F3" : undefined }}>
                    <Ic icon={d.icon} tone={d.tone} />
                    <RowText title={d.name} sub={d.room} />
                    <Chip tone={c.tone} icon={c.tone === "ok" ? "check" : undefined}>
                      {c.text}
                    </Chip>
                  </Row>
                );
              })}
            </div>
            <button type="button" className="card press" onClick={() => setView("seznam")} style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}>
              <Ic icon="grid" tone="neutral" />
              <RowText title={`Všech ${devices.length} zařízení`} sub="Vodoměr, zásobník, HUP, elektroměr, hlásič kouře…" />
              <Chevron />
            </button>
          </>
        ) : (
          devices.length > 0 && <DeviceList devices={devices} onOpen={open} />
        )}
      </Body>
      <GlassTab active="zarizeni" houseId={house.id} onZapsat={zapsat} />
    </Screen>
  );
}

function DeviceList({ devices, onOpen }: { devices: Device[]; onOpen: (d: Device) => void }) {
  const { s } = useStore();
  const now = useNow();
  const rooms = [...new Set(devices.map((d) => d.room))];
  return (
    <>
      {rooms.map((r) => (
        <div key={r} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <Label>{r.toUpperCase()}</Label>
          <div className="card" style={{ overflow: "hidden" }}>
            {devices
              .filter((d) => d.room === r)
              .map((d) => {
                const c = deviceChip(d, s, now);
                return (
                  <Row key={d.id} onClick={() => onOpen(d)}>
                    <Ic icon={d.icon} tone={d.tone} />
                    <RowText title={d.id === "kotel" ? `Kotel ${s.boiler.model}` : d.name} sub={d.type} />
                    <Chip tone={c.tone}>{c.text}</Chip>
                  </Row>
                );
              })}
          </div>
        </div>
      ))}
    </>
  );
}

// ================= Detail zařízení =================
export function ZarizeniDetail({ params }: P) {
  const house = useHouse(params.id);
  const { s } = useStore();
  const nav = useNav();
  const now = useNow();
  const tech = s.role === "technik";
  const list = house.id === "loucky" ? DEVICES : otherData(house.id).devices;
  const d = list.find((x) => x.id === params.dev) ?? list[0];
  if (!d) return null;
  const boiler = d.id === "kotel" && house.id === "loucky";
  const b = s.boiler;
  const facts = boiler
    ? [
        { k: "Servis", v: b.serviceNext === "dnes" && !s.serviceDoneAt ? "dnes" : b.serviceNext, c: b.serviceNext === "dnes" && !s.serviceDoneAt ? "#A8661A" : "#141414" },
        { k: "Záruka", v: `do ${b.warranty}`, c: "#141414" },
        { k: "Instalace", v: b.installed, c: "#141414" },
      ]
    : [
        { k: "Servis", v: d.serviceNext ?? (d.id === "komin" ? relDays(chimneyDue(s), now) : "—"), c: d.id === "komin" ? "#A8661A" : "#141414" },
        { k: "Záruka", v: d.warranty ? `do ${d.warranty}` : "—", c: "#141414" },
        { k: "Instalace", v: d.installed ?? "—", c: "#141414" },
      ];
  const word = d.name.split(" ")[0].toLowerCase().slice(0, 5);
  const hist = [
    ...s.records.filter((r) => r.deviceId === d.id || (d.id === "uzaver" && r.kind === "unik") || (boiler && (r.kind === "servis" || r.kind === "vymena"))).map((r) => ({ id: r.id, date: dm(r.at), title: r.title, detail: r.fields[1]?.v ?? "", rec: r.id })),
    ...(house.id === "loucky" ? HISTORY : otherData(house.id).history)
      .filter((h) => h.title.toLowerCase().includes(word) || (d.id === "uzaver" && /vodom|vod/.test(h.title.toLowerCase())))
      .slice(0, 4)
      .map((h) => ({ id: h.id, date: h.date, title: h.title, detail: h.detail, rec: undefined as string | undefined })),
  ];
  const updated = boiler && s.oldBoilers.length > 0;
  const conns = d.connections?.map((c) => (c.name === "Plyn" ? { ...c, icon: "drop" as const } : c));

  return (
    <Screen>
      <Body gap={12} bottom>
        <Nav back={typeof params.back === "string" ? params.back : "Zařízení"} onBack={nav.back} />
        {d.photo && (
          <div style={{ position: "relative", height: 178, borderRadius: 22, overflow: "hidden", flex: "none", marginTop: -4 }}>
            <img src={d.photo} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} alt={d.name} />
            <span style={{ position: "absolute", left: 12, bottom: 12 }}>
              <span className="chip" style={{ background: "rgba(255,255,255,0.94)", color: updated ? "#141414" : "#2E7D4F" }}>
                {!updated && <Icon name="check" size={14} color="#2E7D4F" sw={2.4} />}
                {updated ? `aktualizováno ${dm(s.records.find((r) => r.kind === "vymena")?.at ?? now)}` : "Štítek ověřen fotkou"}
              </span>
            </span>
          </div>
        )}
        <Title title={boiler ? `Kotel` : d.name} sub={boiler ? `Plynový kondenzační · ${b.power} · ${b.model}` : `${d.type} · ${d.room.toLowerCase()}`} />
        <div style={{ display: "flex", gap: 10 }}>
          {facts.map((f) => (
            <div className="fact" key={f.k}>
              <span>{f.k}</span>
              <b style={{ color: f.c }}>{f.v}</b>
            </div>
          ))}
        </div>
        <div className="card" style={{ overflow: "hidden" }}>
          <div className="row">
            <Ic icon="pin" tone="bad" />
            <RowText title="Kde ho najdete" sub={`${d.room}, ${d.where}`} />
          </div>
        </div>
        {conns && (
          <>
            <Label>Napojeno na</Label>
            <div className="card" style={{ overflow: "hidden", marginTop: -6 }}>
              {conns.map((c) => (
                <div className="row" key={c.name}>
                  <Ic icon={c.icon} tone={c.tone} />
                  <RowText title={c.name} sub={c.detail} />
                  <Chip tone={c.acc.startsWith("změřeno") ? "ok" : "muted"}>{c.acc}</Chip>
                </div>
              ))}
            </div>
          </>
        )}
        {boiler && (
          <button type="button" className="card press" onClick={() => nav.push({ name: "vymena", params: { id: house.id } })} style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}>
            <Ic icon="refresh" tone="clay" />
            <RowText title="Nový kotel?" sub="Stačí krátký dokument nebo fotka štítku" />
            <Chevron />
          </button>
        )}
        {hist.length > 0 && (
          <>
            <Label>Minulé zásahy</Label>
            <div className="card" style={{ overflow: "hidden", marginTop: -6 }}>
              {hist.map((h) => (
                <Row key={h.id} onClick={h.rec ? () => nav.push({ name: "zaznam", params: { id: h.rec } }) : undefined}>
                  <Ic icon="history" tone="neutral" />
                  <RowText title={h.title} sub={`${h.date} · ${h.detail}`} />
                  {h.rec && <Chevron />}
                </Row>
              ))}
            </div>
          </>
        )}
      </Body>
      <Bottom>
        {house.id === "loucky" && (d.id === "kotel" || d.id === "uzaver" || d.id === "rozvadec") ? (
          <Btn variant="dark" icon="wall" onClick={() => nav.push({ name: "vezdi", params: { dev: d.id } })}>
            Ve zdi
          </Btn>
        ) : null}
        <Btn icon="camera" onClick={() => nav.modal({ name: "kamera", params: { mode: tech && d.id === "kotel" ? "servis" : "obecny", house: house.id, dev: d.id } })}>
          Zapsat
        </Btn>
      </Bottom>
    </Screen>
  );
}

// ================= Termíny (záložka) =================
export function Terminy({ params }: P) {
  const house = useHouse(params.id);
  const { s, dispatch } = useStore();
  const nav = useNav();
  const ov = useOverlay();
  const zapsat = useZapsat(house.id);
  const now = useNow();
  if (house.id !== "loucky") {
    const dl = otherData(house.id).deadlines;
    return (
      <Screen>
        <Body gap={12} tab>
          <Title title="Termíny" sub="Vznikají samy ze zařízení a zápisů." />
          {dl.length ? (
            <div className="card" style={{ overflow: "hidden" }}>
              {dl.map((d) => (
                <div className="row" key={d.title}>
                  <Icon name="calendar" size={21} color="#6F6A65" sw={1.9} />
                  <RowText title={d.title} sub={d.sub} />
                  <Chip tone={d.tone}>{d.chip}</Chip>
                </div>
              ))}
            </div>
          ) : (
            <Empty icon="calendar" title="Žádné termíny" sub="Objeví se samy, jakmile do pasu přibudou zařízení a revize." />
          )}
        </Body>
        <GlassTab active="terminy" houseId={house.id} onZapsat={zapsat} />
      </Screen>
    );
  }
  const due = chimneyDue(s);
  const booked = s.chimneyBooked;
  const fresh = (t?: number) => !!t && now - t < 7 * DAY;
  const replaced = s.records.find((r) => r.kind === "vymena");
  const rows: { title: string; sub: string; chip?: { t: string; tone: Tone }; tag?: string }[] = [];
  if (s.serviceDoneAt || replaced) rows.push({ title: "Servis kotle", sub: `${s.boiler.serviceNext} · ${replaced && (!s.serviceDoneAt || replaced.at > s.serviceDoneAt) ? "podle nového kotle" : "ze zápisu technika"}`, chip: fresh(Math.max(s.serviceDoneAt ?? 0, replaced?.at ?? 0)) ? { t: "nové", tone: "clay" } : undefined });
  else rows.push({ title: "Servis kotle", sub: "dnes 10:00 · objednal majitel", chip: { t: "objednáno", tone: "ok" } });
  if (s.boiler.flueCheck) rows.push({ title: "Revize spalinové cesty", sub: `${s.boiler.flueCheck} · po výměně kotle`, chip: { t: "nové", tone: "clay" } });
  rows.push({ title: "Kontrola plynu", sub: "3/2027 · doporučená", tag: "Plyn" });
  rows.push({ title: "Revize elektro", sub: "6/2027 · doporučená", tag: "R1" });

  const orderSame = () => {
    dispatch({ t: "bookChimney", who: OFFERS[0].name, slot: OFFERS[0].slot, now: Date.now() });
    ov.toast(`Objednáno: ${OFFERS[0].name}, ${OFFERS[0].slot}`);
  };

  return (
    <Screen>
      <Body tab>
        <Title title="Termíny" sub="Vznikají samy ze zařízení a zápisů." />
        <div className="card" style={{ padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Chip tone={booked ? "ok" : "warn"} icon={booked ? "check" : undefined}>
              {booked ? `objednáno · ${booked.slot}` : relDays(due, now)}
            </Chip>
            <span style={{ fontSize: 13, color: "#6F6A65" }}>povinné</span>
          </div>
          <button type="button" style={{ textAlign: "left" }} onClick={() => nav.push({ name: "nabidky", params: { id: house.id } })}>
            <div style={{ fontSize: 24, fontWeight: 800 }}>Kontrola komína</div>
            <div className="sub">{booked ? `${booked.who} · přístup jen ke kontrole komína` : "1× ročně · vyhl. 34/2016 Sb. · minule 10/2025"}</div>
          </button>
          <div style={{ display: "flex" }}>
            {booked ? (
              <button type="button" className="btn light" style={{ height: 52, background: "#F2F0ED" }} onClick={() => nav.push({ name: "nabidky", params: { id: house.id } })}>
                Změnit termín
              </button>
            ) : (
              <button type="button" className="btn" style={{ height: 52 }} onClick={orderSame}>
                Objednat stejného technika
              </button>
            )}
          </div>
        </div>
        <div className="lbl">Dál v plánu</div>
        <div className="card" style={{ overflow: "hidden", marginTop: -6 }}>
          {rows.map((r) => (
            <div className="row" key={r.title}>
              <Icon name="calendar" size={21} color="#6F6A65" sw={1.9} />
              <RowText title={r.title} sub={r.sub} />
              {r.chip && <Chip tone={r.chip.tone}>{r.chip.t}</Chip>}
              {r.tag && <span style={{ fontSize: 13, color: "#6F6A65" }}>{r.tag}</span>}
            </div>
          ))}
        </div>
      </Body>
      <GlassTab active="terminy" houseId={house.id} onZapsat={zapsat} />
    </Screen>
  );
}

// ================= Nabídky techniků (Připravujeme) =================
export function Nabidky(_: P) {
  const { s, dispatch } = useStore();
  const nav = useNav();
  const ov = useOverlay();
  const [pick, setPick] = useState(OFFERS.find((o) => o.name === s.chimneyBooked?.who)?.id ?? OFFERS[0].id);
  const offer = OFFERS.find((o) => o.id === pick) ?? OFFERS[0];
  const now = useNow();
  return (
    <Screen>
      <Body gap={12} bottom>
        <Nav back="Termíny" onBack={nav.back} right={<span className="chip" style={{ background: "#EEEBE7", color: "#6F6A65" }}>Připravujeme</span>} />
        <Title title="Kontrola komína" sub={`${relDays(chimneyDue(s), now).replace(/^z/, "Z")} · povinná. Technici z okolí vidí termín a nabízejí se sami.`} />
        <div className="card" style={{ overflow: "hidden" }}>
          {OFFERS.map((o) => (
            <Row key={o.id} style={{ padding: "12px 14px" }} onClick={() => setPick(o.id)}>
              <span style={{ width: 44, height: 44, borderRadius: 22, background: o.best ? "#F7F0D0" : "#EEEBE7", fontWeight: 800, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{o.init}</span>
              <RowText title={o.name} sub={o.sub} />
              <span className="chip" style={{ background: pick === o.id ? "#B5543A" : "#EEEBE7", color: pick === o.id ? "#fff" : "#141414" }}>
                {o.slot}
              </span>
            </Row>
          ))}
        </div>
        <div style={{ fontSize: 13, color: "#6F6A65", padding: "0 4px" }}>Vybraný technik dostane přístup jen k tomu, co ke kontrole potřebuje.</div>
      </Body>
      <Bottom fade={false}>
        <Btn
          icon="check"
          onClick={() => {
            dispatch({ t: "bookChimney", who: offer.name, slot: offer.slot, now: Date.now() });
            ov.toast(`Objednáno: ${offer.name}, ${offer.slot}`);
            nav.back();
          }}
        >
          Objednat na {offer.slot}
        </Btn>
      </Bottom>
    </Screen>
  );
}

// ================= Plán obnovy (Připravujeme) =================
export function Obnova(_: P) {
  const { s } = useStore();
  const nav = useNav();
  const year = new Date().getFullYear();
  const replaced = s.oldBoilers.length > 0;
  const instYear = parseInt(s.boiler.installed.split("/")[1] ?? "2024", 10) || 2024;
  const items = [
    replaced
      ? { year, title: `Kotel · nový ${s.boiler.model}`, sub: "výměna zapsána, záruka do " + s.boiler.warranty, now: true, done: true }
      : { year, title: s.serviceDoneAt ? "Kotel · po servisu" : "Kotel · seřídit", sub: s.serviceDoneAt ? "sledujeme, jestli spotřeba klesne" : "spotřeba plynu +18 %", now: true, done: !!s.serviceDoneAt },
    ...RENEWAL_BASE.map((r) => ({ ...r, now: false, done: false })),
    { year: instYear + 12, title: "Kotel · výměna", sub: "životnost 12 let", now: false, done: false },
  ].sort((a, b) => a.year - b.year);
  return (
    <Screen>
      <Body gap={12}>
        <Nav back="Dům" onBack={nav.back} right={<span className="chip" style={{ background: "#EEEBE7", color: "#6F6A65" }}>Připravujeme</span>} />
        <Title title="Plán obnovy" sub="AI plánuje podle stáří, revizí a spotřeby." />
        <div className="card" style={{ padding: "10px 16px" }}>
          {items.map((it) => (
            <div key={`${it.year}-${it.title}`} style={{ display: "flex", gap: 14, alignItems: "flex-start", position: "relative", padding: "8px 0" }}>
              <span style={{ width: 52, fontSize: 15, fontWeight: 800, color: it.now ? "#A8661A" : "#141414", flex: "none", paddingTop: 1 }}>{it.year}</span>
              <span style={{ width: 14, height: 14, borderRadius: 7, background: it.now ? (it.done ? "#2E7D4F" : "#B5543A") : "#FFFFFF", border: `3px solid ${it.now && it.done ? "#2E7D4F" : "#B5543A"}`, flex: "none", marginTop: 3 }} />
              <RowText title={it.title} sub={it.sub} />
            </div>
          ))}
        </div>
        <div className="card" style={{ padding: "12px 14px", display: "flex", gap: 12, alignItems: "center", background: "#F4E4DD" }}>
          <Icon name="sparkle" size={20} color="#B5543A" />
          <span className="rt">
            <b>{replaced ? "Nový kotel ušetří plyn" : s.serviceDoneAt ? "Kotel je po servisu" : "Seřiďte kotel letos"}</b>
            <span style={{ color: "#6E4A3E" }}>{replaced ? "Za rok porovnáme spotřebu se starým kotlem." : s.serviceDoneAt ? "Za měsíc porovnáme spotřebu plynu." : "Vydrží déle a spotřeba klesne."}</span>
          </span>
        </div>
        <div style={{ fontSize: 13, color: "#6F6A65", padding: "0 4px" }}>Odhad. Upřesní se při každém servisu a revizi.</div>
      </Body>
    </Screen>
  );
}

