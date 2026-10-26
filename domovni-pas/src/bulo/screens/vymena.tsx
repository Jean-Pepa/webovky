"use client";

import { useRef, useState } from "react";
import { Icon } from "../icons";
import { useNav } from "../nav";
import { ActionList, useOverlay } from "../overlay";
import { uid, useStore } from "../store";
import type { Boiler, WorkRecord } from "../types";
import { readBoilerDoc } from "../ai";
import { fileMeta, saveFile, saveImage } from "../media";
import { my } from "../time";
import { Body, Bottom, Btn, Chip, Ic, Nav, RowText, Screen, Title } from "../ui";
import { DoneScreen } from "./history";

type P = { params: Record<string, unknown> };

// ================= Nový kotel — dokument =================
export function Vymena({ params }: P) {
  const { s } = useStore();
  const nav = useNav();
  const ov = useOverlay();
  const input = useRef<HTMLInputElement>(null);
  const [doc, setDoc] = useState<{ name: string; meta: string; src?: string } | null>(
    typeof params.photo === "string" ? { name: "Fotka štítku a záručního listu", meta: "fotka · z telefonu", src: params.photo } : null,
  );
  const [prog, setProg] = useState(doc ? 1 : 0);
  const [reading, setReading] = useState(false);

  const raf = useRef(0);
  // Nahrávání: pruh se plní 1,4 s, pak jde dokument načíst.
  const upload = () => {
    cancelAnimationFrame(raf.current);
    setProg(0);
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.max(0, Math.min(1, (t - t0) / 1400));
      setProg(p);
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  };

  const pick = async (f?: File) => {
    if (!f) return;
    const src = f.type.startsWith("image/") ? await saveImage(f, 2000, 0.85) : await saveFile(f);
    setDoc({ name: f.name.replace(/\.pdf$/i, ""), meta: `${fileMeta(f)} · od instalatéra`, src });
    upload();
  };
  const demo = () => {
    setDoc({ name: "Protokol o instalaci kotle", meta: "1 strana · od instalatéra" });
    upload();
  };
  const read = async () => {
    if (!doc) return input.current?.click();
    setReading(true);
    const r = await readBoilerDoc(doc.src, s, Date.now());
    setReading(false);
    nav.push({ name: "vymena-zmeny", params: { boiler: r.boiler, source: r.source, doc: doc.name, docSrc: doc.src, photo: typeof params.photo === "string" } });
  };
  const mail = () =>
    ov.sheet((close) => (
      <>
        <h3>E-mail do pasu domu</h3>
        <p className="sh-sub">Instalatér pošle protokol na adresu domu. AI ho přečte a zařadí sama.</p>
        <div className="card" style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <Icon name="mail" size={20} color="#B5543A" />
          <b style={{ flex: 1, fontSize: 15 }}>loucky-0127@dum.bulo.cz</b>
        </div>
        <div style={{ height: 10 }} />
        <ActionList
          close={close}
          items={[
            {
              icon: "link",
              label: "Zkopírovat adresu",
              onClick: async () => {
                try {
                  await navigator.clipboard.writeText("loucky-0127@dum.bulo.cz");
                  ov.toast("Adresa zkopírována");
                } catch {
                  ov.toast("loucky-0127@dum.bulo.cz");
                }
              },
            },
          ]}
        />
      </>
    ));

  return (
    <Screen>
      <Body gap={14} bottom>
        <Nav back={typeof params.back === "string" ? params.back : "Kotel"} onBack={nav.back} />
        <Title title="Nový kotel" sub="Stačí poslat krátký dokument. Zbytek doplní pas domu sám." />
        <input ref={input} type="file" accept="application/pdf,image/*" hidden onChange={(e) => pick(e.target.files?.[0])} />
        {doc ? (
          <div className="card" style={{ padding: 16, display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ width: 92, height: 122, borderRadius: 8, background: "#fff", border: "1px solid #E6E2DD", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", padding: "10px 9px", display: "flex", flexDirection: "column", gap: 5, flex: "none" }}>
              <span style={{ height: 7, width: 60, borderRadius: 2, background: "#141414" }} />
              <span style={{ height: 4, width: 70, borderRadius: 2, background: "#CFC8BF" }} />
              <span style={{ height: 4, width: 64, borderRadius: 2, background: "#CFC8BF" }} />
              <span style={{ height: 4, width: 72, borderRadius: 2, background: "#CFC8BF" }} />
              <span style={{ height: 18, width: 72, borderRadius: 3, background: "#EEEBE7", marginTop: 4 }} />
              <span style={{ height: 4, width: 50, borderRadius: 2, background: "#CFC8BF" }} />
              <span style={{ height: 4, width: 66, borderRadius: 2, background: "#CFC8BF" }} />
              <span style={{ marginTop: "auto", fontSize: 10, fontWeight: 800, color: "#B5543A" }}>{doc.src?.startsWith("idb:") && doc.meta.startsWith("fotka") ? "FOTO" : "PDF"}</span>
            </div>
            <span style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
              <b style={{ fontSize: 16, wordBreak: "break-word" }}>{doc.name}</b>
              <span style={{ fontSize: 13, color: "#6F6A65" }}>{doc.meta}</span>
              <span style={{ position: "relative", height: 6, borderRadius: 3, background: "#E6E2DD", marginTop: 6 }}>
                <span style={{ position: "absolute", left: 0, top: 0, height: 6, borderRadius: 3, background: "#B5543A", width: `${Math.round(prog * 100)}%` }} />
              </span>
              <span style={{ fontSize: 13, fontWeight: 600, color: prog >= 1 ? "#2E7D4F" : "#6F6A65" }}>{prog >= 1 ? "Načteno · 1 strana" : "Nahrávám…"}</span>
            </span>
          </div>
        ) : (
          <button type="button" className="card press" onClick={() => input.current?.click()} style={{ padding: "22px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, border: "1.5px dashed #D5CFC7" }}>
            <Ic icon="upload" tone="clay" box={52} size={24} />
            <b style={{ fontSize: 16 }}>Protokol o instalaci kotle</b>
            <span style={{ fontSize: 13, color: "#6F6A65" }}>PDF nebo fotka · od instalatéra</span>
          </button>
        )}
        {!doc && (
          <button type="button" onClick={demo} style={{ fontSize: 14, fontWeight: 600, color: "#B5543A", alignSelf: "center", padding: 4 }}>
            Nemáte ho po ruce? Použijte ukázkový protokol
          </button>
        )}
        <div className="lbl">Nebo jinak</div>
        <div className="card" style={{ overflow: "hidden", marginTop: -6 }}>
          <button type="button" className="row press" onClick={() => nav.modal({ name: "kamera", params: { mode: "stitek", house: "loucky" } })}>
            <Ic icon="camera" tone="neutral" />
            <RowText title="Vyfotit štítek a záruční list" sub="AI z fotky vyčte typ a výrobní číslo" />
            <Icon name="chevron" size={20} color="#6F6A65" sw={1.9} />
          </button>
          <button type="button" className="row press" onClick={mail}>
            <Ic icon="doc" tone="neutral" />
            <RowText title="Poslat e-mailem do pasu domu" sub="Každý dům má vlastní adresu" />
            <Icon name="chevron" size={20} color="#6F6A65" sw={1.9} />
          </button>
        </div>
      </Body>
      <Bottom>
        <Btn icon="check" onClick={read} disabled={reading || (!!doc && prog < 1)}>
          {reading ? "AI čte dokument…" : doc ? "Načíst dokument" : "Vybrat dokument"}
        </Btn>
      </Bottom>
    </Screen>
  );
}

// ================= Co se změní =================
export function VymenaZmeny({ params }: P) {
  const { s, dispatch } = useStore();
  const nav = useNav();
  const nb = params.boiler as Boiler | undefined;
  if (!nb) return null;
  const ob = s.boiler;
  const rows = [
    { k: "Kotel", a: ob.model, b: nb.model },
    { k: "Výkon", a: ob.power, b: nb.power },
    { k: "Výrobní číslo", a: ob.serial, b: nb.serial },
    { k: "Záruka", a: `do ${ob.warranty}`, b: `do ${nb.warranty}` },
    { k: "Revize spalin", a: ob.flueCheck ?? "—", b: nb.flueCheck ?? "—" },
  ];
  const confirm = () => {
    const now = Date.now();
    const rec: WorkRecord = {
      id: uid("r"),
      at: now,
      kind: "vymena",
      title: "Výměna kotle",
      deviceId: "kotel",
      houseId: "loucky",
      who: s.role === "technik" ? "Instalatérství Novák" : "Majitel",
      sentence: "",
      fields: [
        { k: "Úkon", v: `Výměna kotle ${ob.model} → ${nb.model}` },
        { k: "Výkon", v: nb.power },
        { k: "Záruka", v: `do ${nb.warranty}` },
        { k: "Další krok", v: `Revize spalin ${nb.flueCheck ?? "do 30 dní"}` },
      ],
      photos: [],
      docs: [{ id: uid("d"), name: `${String(params.doc ?? "Protokol o instalaci kotle")}.pdf`, meta: "1 strana · od instalatéra" }],
      ai: params.source === "claude" ? "claude" : "mistni",
    };
    dispatch({ t: "replaceBoiler", boiler: nb, now, record: rec });
    nav.replace({ name: "vymena-hotovo", params: { model: nb.model, old: `${ob.model} · ${ob.installed} až ${my(now)}` } }, "push");
  };
  return (
    <Screen>
      <Body gap={12} bottom>
        <Nav back="Nový kotel" onBack={nav.back} right={<Chip tone="clay">připravila AI</Chip>} />
        <Title title="Co se změní" sub={params.photo ? "AI přečetla fotku štítku. Zkontrolujte a potvrďte." : "AI přečetla protokol. Zkontrolujte a potvrďte."} />
        <div className="card" style={{ overflow: "hidden" }}>
          {rows.map((r, i) => (
            <div className="row rise" key={r.k} style={{ padding: "11px 14px", animationDelay: `${i * 140}ms` }}>
              <span style={{ width: 112, fontSize: 14, color: "#6F6A65", flex: "none" }}>{r.k}</span>
              <span style={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
                <s style={{ fontSize: 13, color: "#A39D94" }}>{r.a}</s>
                <b style={{ fontSize: 16, fontWeight: 700 }}>{r.b}</b>
              </span>
            </div>
          ))}
        </div>
        <div className="card rise" style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, animationDelay: "720ms" }}>
          <Ic icon="check" tone="ok" sw={2.6} />
          <RowText title="Napojení beze změny" sub="Plyn, elektro a topení podle modelu domu" />
        </div>
        {params.source === "mistni" && (
          <div style={{ fontSize: 12, color: "#8D8781", padding: "0 4px", lineHeight: 1.45 }}>Bez připojené AI se načetl ukázkový protokol. S klíčem k Claude API čte AI skutečný dokument.</div>
        )}
      </Body>
      <Bottom note="Starý kotel se uloží do historie domu.">
        <Btn icon="check" onClick={confirm}>
          Potvrdit změnu
        </Btn>
      </Bottom>
    </Screen>
  );
}

// ================= Pas domu je aktuální =================
export function VymenaHotovo({ params }: P) {
  const nav = useNav();
  return (
    <DoneScreen
      title="Pas domu je aktuální"
      items={[
        { icon: "check", tone: "ok", title: `Kotel přepsán na ${String(params.model ?? "")}`, sub: "Údaje, záruka a štítek z protokolu" },
        { icon: "history", tone: "neutral", title: "Starý kotel v historii", sub: String(params.old ?? "") },
        { icon: "calendar", tone: "clay", title: "2 termíny upraveny", sub: "Servis kotle a revize spalinové cesty" },
      ]}
      onDone={() => {
        const i = nav.stack.map((e) => e.name).lastIndexOf("vymena");
        if (i > 0) nav.pop(nav.stack.length - i);
        else nav.back();
      }}
    />
  );
}
