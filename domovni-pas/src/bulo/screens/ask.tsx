"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "../icons";
import { useNav } from "../nav";
import { useOverlay } from "../overlay";
import { uid, useStore } from "../store";
import { askHouse } from "../ai";
import { CameraScreen, Photo } from "../camera";
import { IMG } from "../data";
import type { ChatMsg } from "../types";
import { hm } from "../time";
import { Body, Chip, Nav, Screen } from "../ui";
import { Rich } from "./common";

type P = { params: Record<string, unknown> };

// ================= Fotoaparát (všechny režimy) =================
const CAM: Record<string, { title: string; hint: string; demo: string; shots: string[]; max: number }> = {
  ask: { title: "Zeptat se domu · Chata Loučky", hint: "Vyfoťte, co vidíte", demo: IMG("img/vf_stain.jpg"), shots: [IMG("img/ph_stain.jpg")], max: 1 },
  servis: { title: "Kotel · Chata Loučky", hint: "Vyfoťte štítek a stav kotle", demo: IMG("img/vf_plate.jpg"), shots: [IMG("img/ph1.jpg"), IMG("img/ph2.jpg")], max: 3 },
  unik: { title: "Únik vody · Chata Loučky", hint: "Vyfoťte místo opravy", demo: IMG("img/vf_stain.jpg"), shots: [IMG("img/ph_s1.jpg"), IMG("img/ph_s2.jpg")], max: 3 },
  obecny: { title: "Zápis · Chata Loučky", hint: "Vyfoťte, co se dělalo", demo: IMG("img/vf_kotel.jpg"), shots: [IMG("img/ph2.jpg")], max: 3 },
  stitek: { title: "Nový kotel · štítek", hint: "Vyfoťte štítek a záruční list", demo: IMG("img/vf_plate.jpg"), shots: [IMG("img/ph1.jpg")], max: 1 },
};

export function Kamera({ params }: P) {
  const nav = useNav();
  const mode = typeof params.mode === "string" && CAM[params.mode] ? params.mode : "obecny";
  const c = CAM[mode];
  const [demo, setDemo] = useState(c.demo);
  return (
    <CameraScreen
      title={c.title}
      hint={c.hint}
      demo={demo}
      demoShots={c.shots}
      max={c.max}
      onClose={nav.back}
      onDone={(photos) => {
        if (mode === "unik" && demo !== IMG("img/vf_sensor.jpg")) setDemo(IMG("img/vf_sensor.jpg"));
        if (mode === "ask") nav.replace({ name: "zeptat", params: { photo: photos[0], house: params.house } }, "up");
        else if (mode === "stitek") {
          nav.pop();
          nav.replace({ name: "vymena", params: { photo: photos[0] } }, "fade");
        } else nav.replace({ name: "zapis", params: { kind: mode, photos, job: params.job, dev: params.dev, house: params.house } }, "up");
      }}
    />
  );
}

// ================= Zeptat se domu =================
// Odpověď ukážeme nejdřív po chvilce, aby „hledání v pasu domu“ nepřeblesklo.
function atLeast<T>(p: Promise<T>, ms: number): Promise<T> {
  return Promise.all([p, new Promise((r) => setTimeout(r, ms))]).then(([v]) => v);
}
const SUGGEST_LEAK = ["Na zdi u vodoměru je mokrá skvrna. Co to je?", "Co vede za touhle zdí?"];
const BACK_LABEL: Record<string, string> = { domy: "Nemovitosti", unik: "Únik vody", hlidace: "Hlídače", zarizeni: "Zařízení", "zarizeni-detail": "Zařízení", terminy: "Termíny", dokumenty: "Dokumenty" };
const SUGGEST = ["Kde je hlavní uzávěr vody?", "Můžu vrtat u kotle?", "Kdy je další kontrola komína?", "Proč je spotřeba plynu vyšší?"];

type SR = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
};

export function useDictation(onText: (t: string, final: boolean) => void) {
  const ov = useOverlay();
  const rec = useRef<SR | null>(null);
  const [on, setOn] = useState(false);
  const cb = useRef(onText);
  useEffect(() => {
    cb.current = onText;
  }, [onText]);
  useEffect(() => () => rec.current?.stop(), []);
  const toggle = () => {
    if (on) {
      rec.current?.stop();
      return;
    }
    const w = window as unknown as { SpeechRecognition?: new () => SR; webkitSpeechRecognition?: new () => SR };
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) {
      ov.toast("Diktování tady nejde. Napište to prosím.");
      return false;
    }
    const r = new Ctor();
    r.lang = "cs-CZ";
    r.interimResults = true;
    r.continuous = false;
    r.onresult = (e) => {
      let text = "";
      let final = false;
      for (let i = 0; i < e.results.length; i++) {
        text += e.results[i][0].transcript;
        final = e.results[i].isFinal;
      }
      cb.current(text, final);
    };
    r.onend = () => setOn(false);
    r.onerror = () => {
      setOn(false);
      ov.toast("Mikrofon není dostupný");
    };
    rec.current = r;
    try {
      r.start();
      setOn(true);
    } catch {
      setOn(false);
    }
    return true;
  };
  return { on, toggle };
}

export function Zeptat({ params }: P) {
  const { s, dispatch } = useStore();
  const nav = useNav();
  const ov = useOverlay();
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState<string | undefined>(typeof params.photo === "string" ? params.photo : undefined);
  const busy = s.chat.some((m) => m.pending);
  const scroller = useRef<HTMLDivElement>(null);
  const dict = useDictation((t) => setText(t));
  const back = BACK_LABEL[nav.stack[nav.stack.length - 2]?.name ?? ""] ?? "Chata Loučky";

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [s.chat.length, busy]);

  const ask = async (q: string, ph?: string) => {
    const question = q.trim();
    if (!question || busy) return;
    const me: ChatMsg = { id: uid("m"), from: "me", text: question, photo: ph };
    const ai: ChatMsg = { id: uid("m"), from: "ai", text: "", pending: true };
    dispatch({ t: "chatAdd", msg: me });
    dispatch({ t: "chatAdd", msg: ai });
    if (ph) dispatch({ t: "leakPhoto", photo: ph });
    setText("");
    setPhoto(undefined);
    const r = await atLeast(askHouse(question, ph, s), 1300);
    dispatch({ t: "chatPatch", id: ai.id, patch: { pending: false, text: r.paragraphs.join("\n\n"), image: r.image, actions: r.actions, source: r.source } });
  };

  const leakOpen = s.leak && s.leak.phase !== "fixed";
  const suggestions = photo || (leakOpen && !s.chat.length) ? SUGGEST_LEAK : SUGGEST;

  return (
    <Screen>
      <Body gap={12} bodyRef={scroller} style={{ paddingBottom: "calc(var(--hb) + 150px)" }}>
        <Nav
          back={back}
          onBack={nav.back}
          right={
            <Chip tone="clay" icon="sparkle">
              zná celý pas domu
            </Chip>
          }
        />
        <div className="lt" style={{ fontSize: 26 }}>
          Zeptat se domu
        </div>
        {!s.chat.length && !photo && (
          <div className="card" style={{ padding: "14px 16px", fontSize: 15, lineHeight: 1.45, color: "#3a3532" }}>
            Zeptejte se na cokoli o domě. BULO zná rozvody z modelu, data z hlídačů, historii zásahů i dokumenty.
          </div>
        )}
        {s.chat.map((m) => (m.from === "me" ? <MeBubble key={m.id} m={m} /> : <AiCard key={m.id} m={m} onAction={(a) => runAction(a)} />))}
        {photo && (
          <div style={{ alignSelf: "flex-end", width: 160, borderRadius: 16, overflow: "hidden", position: "relative", flex: "none" }}>
            <Photo src={photo} style={{ width: 160, height: 110 }} />
            <button type="button" className="round-btn" aria-label="Odebrat fotku" onClick={() => setPhoto(undefined)} style={{ position: "absolute", right: 6, top: 6, width: 28, height: 28 }}>
              <Icon name="close" size={14} color="#fff" sw={2.6} />
            </button>
          </div>
        )}
        {!busy && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "flex-end" }}>
            {suggestions.map((q) => (
              <button key={q} type="button" className="chip" onClick={() => ask(q, photo)} style={{ height: "auto", minHeight: 34, padding: "7px 12px", whiteSpace: "normal", textAlign: "left", background: "#fff", color: "#141414", fontWeight: 500, lineHeight: 1.3 }}>
                {q}
              </button>
            ))}
          </div>
        )}
      </Body>
      <div style={{ position: "absolute", left: 16, right: 16, bottom: "max(calc(var(--hb) + 4px), 14px)", zIndex: 10, display: "flex", gap: 8, alignItems: "center" }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(text, photo);
          }}
          style={{ flex: 1, height: 48, borderRadius: 24, background: "#fff", display: "flex", alignItems: "center", padding: "0 6px 0 16px", boxShadow: "0 4px 14px rgba(40,24,14,0.08)" }}
        >
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder={dict.on ? "Poslouchám…" : "Zeptejte se na cokoli o domě"} aria-label="Otázka" style={{ flex: 1, minWidth: 0, border: 0, outline: "none", background: "transparent", fontSize: 15 }} />
          {text.trim() ? (
            <button type="submit" className="ic" aria-label="Odeslat" style={{ width: 36, height: 36, background: "#B5543A" }} disabled={busy}>
              <Icon name="send" size={18} color="#fff" />
            </button>
          ) : (
            <button type="button" className="ic" aria-label="Diktovat" onClick={dict.toggle} style={{ width: 36, height: 36, background: dict.on ? "#2E7D4F" : "#B5543A", boxShadow: dict.on ? "0 0 0 6px rgba(46,125,79,0.2)" : undefined }}>
              <Icon name="mic" size={18} color="#fff" />
            </button>
          )}
        </form>
      </div>
    </Screen>
  );

  function runAction(a: NonNullable<ChatMsg["actions"]>[number]) {
    if (a === "close_valve") {
      dispatch({ t: "closeValve", now: Date.now(), by: "majitel" });
      ov.toast("Uzávěr zavřen · voda přestala téct");
    } else if (a === "open_model") nav.push({ name: "model", params: { id: "loucky" } });
    else if (a === "open_terminy") nav.reset([{ name: "domy" }, { name: "terminy", params: { id: "loucky" } }], "fade");
    else if (a === "open_spotreba") nav.push({ name: "spotreba", params: { id: "loucky" } });
  }
}

function MeBubble({ m }: { m: ChatMsg }) {
  return (
    <div className="rise" style={{ alignSelf: "flex-end", width: m.photo ? 218 : "auto", maxWidth: "82%", borderRadius: 18, overflow: "hidden", background: "#141414", flex: "none" }}>
      {m.photo && <Photo src={m.photo} style={{ width: "100%", height: 118 }} />}
      <div style={{ color: "#fff", fontSize: 14, lineHeight: 1.35, padding: "9px 12px" }}>{m.text}</div>
    </div>
  );
}

function AiCard({ m, onAction }: { m: ChatMsg; onAction: (a: NonNullable<ChatMsg["actions"]>[number]) => void }) {
  const { s } = useStore();
  const closed = s.leak?.phase === "closed" || s.leak?.phase === "fixed";
  return (
    <div className="card rise" style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8, flex: "none" }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: "#B5543A", display: "flex", alignItems: "center", gap: 5 }}>
        <Icon name="sparkle" size={13} color="#B5543A" sw={2.2} />
        BULO · AI{m.pending && <span style={{ color: "#6F6A65", fontWeight: 500 }}> · hledá v pasu domu…</span>}
      </span>
      {m.pending ? (
        <span style={{ display: "flex", gap: 5, padding: "4px 0" }}>
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ width: 7, height: 7, borderRadius: 4, background: "#CFC8BF", animation: `bulo-fade-out 900ms ${i * 150}ms ease-in-out infinite alternate` }} />
          ))}
        </span>
      ) : (
        <>
          {m.text.split("\n\n").map((p, i) => (
            <p key={i} className="rise" style={{ margin: 0, fontSize: 14, lineHeight: 1.42, animationDelay: `${i * 260}ms` }}>
              <Rich text={p} />
            </p>
          ))}
          {m.image && (
            <img src={m.image} alt="Přívod vody za skvrnou podle modelu domu" className="rise" style={{ width: "100%", borderRadius: 12, display: "block", animationDelay: "700ms" }} />
          )}
          {m.actions?.includes("close_valve") && (
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                className="chip"
                disabled={closed}
                onClick={() => onAction("close_valve")}
                style={{ height: 36, padding: "0 14px", background: closed ? "#2E7D4F" : "#B5543A", color: "#fff", fontSize: 13 }}
              >
                <Icon name={closed ? "check" : "drop"} size={15} color="#fff" sw={2.4} />
                {closed ? `Uzávěr zavřen${s.leak?.closedAt ? ` ${hm(s.leak.closedAt)}` : ""}` : "Zavřít uzávěr"}
              </button>
            </div>
          )}
          {m.actions?.includes("open_model") && (
            <button type="button" className="chip" onClick={() => onAction("open_model")} style={{ height: 34, background: "#F2F0ED", color: "#141414", alignSelf: "flex-start" }}>
              <Icon name="cube" size={14} />
              Ukázat v modelu domu
            </button>
          )}
          {m.actions?.includes("open_terminy") && (
            <button type="button" className="chip" onClick={() => onAction("open_terminy")} style={{ height: 34, background: "#F2F0ED", color: "#141414", alignSelf: "flex-start" }}>
              <Icon name="calendar" size={14} />
              Otevřít termíny
            </button>
          )}
          {m.actions?.includes("open_spotreba") && (
            <button type="button" className="chip" onClick={() => onAction("open_spotreba")} style={{ height: 34, background: "#F2F0ED", color: "#141414", alignSelf: "flex-start" }}>
              <Icon name="bolt" size={14} />
              Otevřít spotřebu
            </button>
          )}
          {m.source === "mistni" && <span style={{ fontSize: 11, color: "#A39D94" }}>Odpověď z dat pasu domu</span>}
        </>
      )}
    </div>
  );
}
