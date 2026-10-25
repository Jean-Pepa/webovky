"use client";

import { useRef, useState } from "react";
import { Icon } from "../icons";
import { useNav } from "../nav";
import { useOverlay } from "../overlay";
import { useStore } from "../store";
import { DOCS, DRAWINGS, TONES } from "../data";
import type { DocCat, DocFile, Tone } from "../types";
import { fileMeta, saveFile, saveImage, useMediaUrl } from "../media";
import { dmy } from "../time";
import { GlassTab } from "../tabbar";
import { Body, Bottom, Btn, Chevron, Chip, Ic, Label, Nav, Row, RowText, Screen, Title } from "../ui";
import { Empty, otherData, useHouse, useZapsat } from "./common";

type P = { params: Record<string, unknown> };

const CHIP_TONE: Record<string, Tone> = {
  "z ArchiCADu": "muted",
  aktuální: "ok",
  ověřeno: "ok",
  "z projektu": "muted",
  "1 chybí": "warn",
  čeká: "warn",
  "v pořádku": "ok",
  sken: "muted",
  "12": "muted",
  nahráno: "clay",
};

export function useDocCats(houseId: string): DocCat[] {
  const { s } = useStore();
  const base = houseId === "loucky" ? DOCS : otherData(houseId).docs;
  const mine = s.userDocs.filter((d) => d.houseId === houseId);
  const cats = base.map((c) => ({ ...c, files: [...mine.filter((d) => d.cat === c.id).map((d) => d.file), ...c.files] }));
  const orphan = mine.filter((d) => !base.some((c) => c.id === d.cat));
  if (orphan.length) {
    cats.push({ id: "ostatni", name: "Ostatní", sub: "nahrané dokumenty", icon: "doc", tone: "neutral", chip: "nahráno", files: orphan.map((d) => d.file) });
  }
  return cats;
}

// ================= Dokumenty (záložka) =================
export function Dokumenty({ params }: P) {
  const house = useHouse(params.id);
  const nav = useNav();
  const zapsat = useZapsat(house.id);
  const cats = useDocCats(house.id);
  const { s } = useStore();
  const fresh = s.userDocs.filter((d) => d.houseId === house.id).length;
  const open = (c: DocCat) => {
    if (c.id === "vykresy") nav.push({ name: "vykresy", params: { id: house.id } });
    else nav.push({ name: "kategorie", params: { id: house.id, cat: c.id } });
  };
  return (
    <Screen>
      <Body gap={12} tab>
        <Title title="Dokumenty" sub="Od projektu po kolaudaci, u každého víte, odkud je." />
        {cats.length ? (
          <div className="card" style={{ overflow: "hidden" }}>
            {cats.map((c) => (
              <Row key={c.id} style={{ padding: "10px 14px" }} onClick={() => open(c)}>
                <Ic icon={c.icon} tone={c.tone} />
                <RowText title={c.name} sub={c.id === "bim" ? c.sub : c.sub} />
                <Chip tone={CHIP_TONE[c.chip] ?? "muted"}>{c.chip}</Chip>
              </Row>
            ))}
          </div>
        ) : (
          <Empty icon="doc" title="Zatím žádné dokumenty" sub="Nahrajte projekt, revize nebo záruční listy. AI je roztřídí do složek." />
        )}
        <button type="button" className="card press" onClick={() => nav.push({ name: "dokumenty-nahrat", params: { id: house.id } })} style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}>
          <Ic icon="upload" tone="clay" />
          <RowText title="Nahrát dokument" sub={fresh ? `${fresh} nahráno v této ukázce · AI třídí do složek` : "PDF nebo fotka · AI ho zařadí do správné složky"} />
          <Chevron />
        </button>
      </Body>
      <GlassTab active="dokumenty" houseId={house.id} onZapsat={zapsat} />
    </Screen>
  );
}

// ================= Složka dokumentů =================
export function Kategorie({ params }: P) {
  const house = useHouse(params.id);
  const nav = useNav();
  const cats = useDocCats(house.id);
  const cat = cats.find((c) => c.id === params.cat) ?? cats[0];
  if (!cat) return null;
  const missing = cat.id === "revize" && house.id === "loucky";
  return (
    <Screen>
      <Body gap={12}>
        <Nav back="Dokumenty" onBack={nav.back} right={<Chip tone={CHIP_TONE[cat.chip] ?? "muted"}>{cat.chip}</Chip>} />
        <Title title={cat.name} sub={cat.sub} />
        {cat.id === "bim" && (
          <button type="button" className="card press" onClick={() => nav.push({ name: "model", params: { id: house.id } })} style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}>
            <Ic icon="cube" tone="bim" />
            <RowText title="Otevřít 3D model" sub="Rozvody elektro, vody, topení a plynu" />
            <Chevron />
          </button>
        )}
        <div className="card" style={{ overflow: "hidden" }}>
          {cat.files.map((f) => (
            <Row key={f.id} onClick={() => nav.push({ name: "soubor", params: { id: house.id, cat: cat.id, file: f.id } })}>
              <Ic icon={f.kind === "img" ? "image" : f.kind === "ifc" ? "cube" : "doc"} tone={f.stored ? "clay" : "neutral"} />
              <RowText title={f.name} sub={`${f.meta} · ${f.source}`} titleStyle={{ fontSize: 15 }} />
              <Chevron />
            </Row>
          ))}
          {missing && (
            <div className="row">
              <Ic icon="excl" tone="warn" sw={2.6} />
              <RowText title="Revize spalinové cesty" sub="Chybí · připomenuto technikovi kotle" subStyle={{ color: TONES.warn.fg }} />
            </div>
          )}
          {!cat.files.length && !missing && (
            <div className="row">
              <RowText title="Složka je prázdná" sub="Nahrajte dokument přes tlačítko Zapsat" />
            </div>
          )}
        </div>
      </Body>
    </Screen>
  );
}

// ================= Náhled souboru =================
export function Soubor({ params }: P) {
  const house = useHouse(params.id);
  const nav = useNav();
  const { dispatch } = useStore();
  const ov = useOverlay();
  const cats = useDocCats(house.id);
  const cat = cats.find((c) => c.id === params.cat);
  const file = cat?.files.find((f) => f.id === params.file);
  const url = useMediaUrl(file?.src);
  if (!file) return null;
  const isImg = file.kind === "img" && !!url;
  const isPdf = file.kind === "pdf" && file.stored && !!url;
  return (
    <Screen>
      <Body gap={12} bottom={file.stored}>
        <Nav back={cat?.name ?? "Dokumenty"} onBack={nav.back} />
        <Title title={file.name} sub={`${file.meta} · ${file.source}`} style={{ wordBreak: "break-word" }} />
        {isImg ? (
          <img src={url} alt={file.name} style={{ width: "100%", borderRadius: 18, display: "block" }} />
        ) : isPdf ? (
          <iframe src={url} title={file.name} style={{ width: "100%", height: 460, border: 0, borderRadius: 18, background: "#fff" }} />
        ) : (
          <PaperPreview file={file} />
        )}
        <div className="card" style={{ overflow: "hidden" }}>
          <div className="row">
            <Ic icon="shield" tone="ok" />
            <RowText title="Původ dokumentu" sub={`${file.source}${file.at ? ` · nahráno ${dmy(file.at)}` : ""}`} />
          </div>
        </div>
      </Body>
      {file.stored && (
        <Bottom>
          <Btn
            variant="light"
            icon="trash"
            onClick={() => {
              dispatch({ t: "removeDoc", id: file.id });
              ov.toast("Dokument odebrán z pasu");
              nav.back();
            }}
          >
            Odebrat
          </Btn>
          {url && (
            <Btn icon="download" onClick={() => window.open(url, "_blank")}>
              Otevřít
            </Btn>
          )}
        </Bottom>
      )}
    </Screen>
  );
}

function PaperPreview({ file }: { file: DocFile }) {
  return (
    <div className="card" style={{ padding: 18, display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ background: "#fff", border: "1px solid #E6E2DD", borderRadius: 10, padding: "18px 16px", display: "flex", flexDirection: "column", gap: 8, aspectRatio: "0.72", boxShadow: "0 6px 20px rgba(40,24,14,0.08)" }}>
        <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.3em", color: "#B5543A" }}>BULO · PAS DOMU</span>
        <b style={{ fontSize: 14 }}>{file.name.replace(/\.(pdf|jpg|ifc)$/i, "")}</b>
        <span style={{ fontSize: 11, color: "#6F6A65" }}>{file.meta}</span>
        {Array.from({ length: 11 }, (_, i) => (
          <span key={i} style={{ height: 6, borderRadius: 3, background: "#EEEBE7", width: `${92 - ((i * 37) % 40)}%` }} />
        ))}
      </div>
      <span style={{ fontSize: 13, color: "#6F6A65", lineHeight: 1.45 }}>Ukázkový dokument. V ostré verzi tu bude originál od firmy, která ho do pasu vložila.</span>
    </div>
  );
}

// ================= Nahrát dokument =================
function guessCat(name: string, cats: DocCat[]): string {
  const n = name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const rules: [RegExp, string][] = [
    [/\.ifc$|bim|model/, "bim"],
    [/pudorys|rez|pohled|vykres|\.dwg|situac/, "vykresy"],
    [/revize|revizni|kontrol|spalin|komin/, "revize"],
    [/zaruk|navod|manual|zarucni/, "zaruky"],
    [/povoleni|rozhodnuti|stavebni urad|souhlas/, "povoleni"],
    [/pbr|pozar/, "pbr"],
    [/penb|energet|stitek/, "penb"],
    [/kolaud/, "kolaudace"],
  ];
  for (const [re, id] of rules) if (re.test(n) && cats.some((c) => c.id === id)) return id;
  return cats.some((c) => c.id === "zaruky") ? "zaruky" : cats[0]?.id ?? "ostatni";
}

export function DokumentyNahrat({ params }: P) {
  const house = useHouse(params.id);
  const nav = useNav();
  const ov = useOverlay();
  const { dispatch } = useStore();
  const cats = useDocCats(house.id).filter((c) => c.id !== "ostatni");
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [cat, setCat] = useState<string>("");
  const [busy, setBusy] = useState(false);

  const pick = (f: File | undefined) => {
    if (!f) return;
    setFile(f);
    setCat(guessCat(f.name, cats.length ? cats : DOCS));
  };
  const save = async () => {
    if (!file) return;
    setBusy(true);
    const isImg = file.type.startsWith("image/");
    const src = isImg ? await saveImage(file, 2000, 0.85) : await saveFile(file);
    const doc: DocFile = {
      id: `u-${Date.now().toString(36)}`,
      name: file.name,
      meta: `${fileMeta(file)} · ${dmy(Date.now())}`,
      kind: isImg ? "img" : /\.ifc$/i.test(file.name) ? "ifc" : "pdf",
      src,
      source: "Nahrál majitel",
      stored: true,
      at: Date.now(),
    };
    dispatch({ t: "addDoc", houseId: house.id, cat: cat || "ostatni", file: doc });
    setBusy(false);
    ov.toast(`Uloženo do složky ${cats.find((c) => c.id === cat)?.name ?? "Ostatní"}`);
    nav.back();
  };

  return (
    <Screen>
      <Body gap={14} bottom>
        <Nav back="Zpět" onBack={nav.back} />
        <Title title="Nahrát dokument" sub="PDF nebo fotka. AI ho zařadí do správné složky a pohlídá termíny." />
        <input ref={input} type="file" accept="application/pdf,image/*,.ifc" hidden onChange={(e) => pick(e.target.files?.[0])} />
        <button type="button" className="card press" onClick={() => input.current?.click()} style={{ padding: "22px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, border: "1.5px dashed #D5CFC7" }}>
          <Ic icon={file ? "doc" : "upload"} tone="clay" box={52} size={24} />
          <b style={{ fontSize: 16, wordBreak: "break-word", textAlign: "center" }}>{file ? file.name : "Vybrat soubor"}</b>
          <span style={{ fontSize: 13, color: "#6F6A65" }}>{file ? fileMeta(file) : "z telefonu nebo počítače"}</span>
        </button>
        {file && (
          <>
            <Label>AI NAVRHUJE SLOŽKU</Label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: -6 }}>
              {cats.map((c) => (
                <button key={c.id} type="button" className="chip" onClick={() => setCat(c.id)} style={{ height: 34, background: cat === c.id ? "#141414" : "#fff", color: cat === c.id ? "#fff" : "#141414" }}>
                  {cat === c.id && <Icon name="check" size={14} color="#fff" sw={2.6} />}
                  {c.name}
                </button>
              ))}
            </div>
          </>
        )}
      </Body>
      <Bottom note={file ? "Uloží se do pasu domu v tomto prohlížeči." : undefined}>
        <Btn icon="check" onClick={file ? save : () => input.current?.click()} disabled={busy}>
          {file ? (busy ? "Ukládám…" : "Uložit do pasu") : "Vybrat soubor"}
        </Btn>
      </Bottom>
    </Screen>
  );
}

// ================= Výkresy =================
export function Vykresy({ params }: P) {
  const house = useHouse(params.id);
  const nav = useNav();
  if (house.id !== "loucky")
    return (
      <Screen>
        <Body gap={12}>
          <Nav back="Dům" onBack={nav.back} />
          <Title title="Výkresy" sub="Půdorysy, řezy a pohledy" />
          <Empty icon="layers" title="Výkresy zatím nejsou" sub="Architekt je nahraje rovnou z ArchiCADu nebo Revitu. Ze skenu umí AI vytáhnout místnosti a rozměry." />
        </Body>
      </Screen>
    );
  const [first, ...rest] = DRAWINGS;
  return (
    <Screen>
      <Body gap={12}>
        <Nav back="Dokumenty" onBack={nav.back} />
        <Title title="Výkresy" sub="Z ArchiCADu · u každého víte, odkud je" />
        <button type="button" className="card press" style={{ overflow: "hidden", textAlign: "left" }} onClick={() => nav.push({ name: "vykres", params: { d: first.id } })}>
          <img src={first.img} style={{ width: "100%", height: 214, objectFit: "cover", objectPosition: "50% 40%", display: "block", background: "#fff" }} alt={first.name} />
          <div className="row" style={{ borderTop: "1px solid #E6E2DD" }}>
            <RowText title={first.name} sub={first.sub} />
            <Chip tone="muted">{first.chip}</Chip>
          </div>
        </button>
        <div className="card" style={{ overflow: "hidden" }}>
          {rest.map((d) => (
            <Row key={d.id} style={{ padding: "9px 14px" }} onClick={() => nav.push({ name: "vykres", params: { d: d.id } })}>
              <img src={d.img} style={{ width: 58, height: 42, borderRadius: 8, objectFit: "cover", border: "1px solid #E6E2DD", background: "#fff", flex: "none" }} alt="" />
              <RowText title={d.name} sub={d.sub} titleStyle={{ fontSize: 15 }} />
              <Chip tone="muted">{d.chip}</Chip>
            </Row>
          ))}
        </div>
      </Body>
    </Screen>
  );
}

// ================= Výkres (zoom) =================
export function Vykres({ params }: P) {
  const nav = useNav();
  const d = DRAWINGS.find((x) => x.id === params.d) ?? DRAWINGS[0];
  const [z, setZ] = useState({ k: 1, x: 0, y: 0 });
  const ptrs = useRef(new Map<number, [number, number]>());
  const pinch = useRef<{ d0: number; k0: number } | null>(null);
  const onDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    ptrs.current.set(e.pointerId, [e.clientX, e.clientY]);
    if (ptrs.current.size === 2) {
      const [a, b] = [...ptrs.current.values()];
      pinch.current = { d0: Math.hypot(a[0] - b[0], a[1] - b[1]), k0: z.k };
    }
  };
  const onMove = (e: React.PointerEvent) => {
    const p = ptrs.current.get(e.pointerId);
    if (!p) return;
    const dx = e.clientX - p[0];
    const dy = e.clientY - p[1];
    ptrs.current.set(e.pointerId, [e.clientX, e.clientY]);
    if (ptrs.current.size === 2 && pinch.current) {
      const [a, b] = [...ptrs.current.values()];
      const k = Math.min(5, Math.max(1, (pinch.current.k0 * Math.hypot(a[0] - b[0], a[1] - b[1])) / pinch.current.d0));
      setZ((c) => ({ ...c, k }));
    } else if (ptrs.current.size === 1) setZ((c) => ({ ...c, x: c.x + dx, y: c.y + dy }));
  };
  const onUp = (e: React.PointerEvent) => {
    ptrs.current.delete(e.pointerId);
    if (ptrs.current.size < 2) pinch.current = null;
  };
  return (
    <Screen bg="#FFFFFF">
      <Body gap={10} style={{ paddingBottom: 0 }}>
        <Nav back="Výkresy" onBack={nav.back} right={<Chip tone="muted">{d.chip}</Chip>} />
        <Title title={d.name} sub={`${d.sub} · stáhněte prsty pro přiblížení`} />
        <div
          style={{ position: "relative", flex: 1, minHeight: 360, overflow: "hidden", borderRadius: 18, background: "#fff", border: "1px solid #E6E2DD", touchAction: "none" }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onWheel={(e) => setZ((c) => ({ ...c, k: Math.min(5, Math.max(1, c.k * (1 - e.deltaY * 0.0015))) }))}
          onDoubleClick={() => setZ((c) => (c.k > 1 ? { k: 1, x: 0, y: 0 } : { ...c, k: 2.5 }))}
        >
          <img src={d.img} alt={d.name} draggable={false} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", transform: `translate(${z.x}px, ${z.y}px) scale(${z.k})`, transformOrigin: "50% 50%", userSelect: "none" }} />
        </div>
        <div style={{ display: "flex", gap: 8, paddingBottom: "calc(var(--hb) + 16px)" }}>
          <button type="button" className="chip" style={{ background: "#F2F0ED", color: "#141414", height: 36 }} onClick={() => setZ((c) => ({ ...c, k: Math.min(5, c.k * 1.4) }))}>
            <Icon name="plus" size={14} />
            Přiblížit
          </button>
          <button type="button" className="chip" style={{ background: "#F2F0ED", color: "#141414", height: 36 }} onClick={() => setZ({ k: 1, x: 0, y: 0 })}>
            Celý výkres
          </button>
        </div>
      </Body>
    </Screen>
  );
}
