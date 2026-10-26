"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "./icons";
import { useActive } from "./nav";
import { saveImage, useMediaUrl } from "./media";
import { Screen, useMode } from "./ui";
import { useOverlay } from "./overlay";

export function hasCamera() {
  return typeof navigator !== "undefined" && !!navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === "function";
}

// Fotoaparát v aplikaci: na mobilu živá zadní kamera, na počítači ukázkový záběr z návrhu.
// Vždy jde i vybrat fotku z galerie.
export function CameraScreen({
  title,
  hint,
  demo,
  demoShots,
  max = 1,
  onClose,
  onDone,
  doneLabel = "Pokračovat",
}: {
  title: string;
  hint: string;
  demo: string;
  demoShots: string[];
  max?: number;
  onClose: () => void;
  onDone: (photos: string[]) => void;
  doneLabel?: string;
}) {
  const mode = useMode();
  const active = useActive();
  const ov = useOverlay();
  const video = useRef<HTMLVideoElement>(null);
  const file = useRef<HTMLInputElement>(null);
  const [live, setLive] = useState<"off" | "on" | "fail">("off");
  const [wantLive, setWantLive] = useState(mode === "native");
  const [shots, setShots] = useState<string[]>([]);
  const [flash, setFlash] = useState(0);
  const [busy, setBusy] = useState(false);
  const finished = useRef(false);

  useEffect(() => {
    if (!active || !wantLive || !navigator.mediaDevices?.getUserMedia) return;
    let stream: MediaStream | null = null;
    let alive = true;
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: false })
      .then((st) => {
        if (!alive) {
          st.getTracks().forEach((t) => t.stop());
          return;
        }
        stream = st;
        if (video.current) {
          video.current.srcObject = st;
          video.current.play().catch(() => {});
        }
        setLive("on");
      })
      .catch(() => {
        if (alive) setLive("fail");
      });
    return () => {
      alive = false;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [active, wantLive]);

  const useLive = wantLive && live === "on";

  const finish = (list: string[]) => {
    if (finished.current) return;
    finished.current = true;
    onDone(list);
  };

  const shotsRef = useRef<string[]>([]);
  const add = (refs: string[], delay = 380) => {
    const next = [...shotsRef.current, ...refs].slice(0, max);
    shotsRef.current = next;
    setShots(next);
    if (max === 1 && next.length) setTimeout(() => finish(next), delay);
  };

  const shoot = async () => {
    if (busy || shots.length >= max) return;
    setFlash((f) => f + 1);
    if (useLive && video.current && video.current.videoWidth) {
      setBusy(true);
      const v = video.current;
      const c = document.createElement("canvas");
      c.width = v.videoWidth;
      c.height = v.videoHeight;
      c.getContext("2d")?.drawImage(v, 0, 0);
      const blob = await new Promise<Blob | null>((r) => c.toBlob(r, "image/jpeg", 0.88));
      if (blob) add([await saveImage(blob)]);
      setBusy(false);
      return;
    }
    add([demoShots[shots.length % demoShots.length]]);
  };

  const pick = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    const refs: string[] = [];
    for (const f of Array.from(files).slice(0, max - shots.length)) {
      if (f.type.startsWith("image/")) refs.push(await saveImage(f));
    }
    setBusy(false);
    if (!refs.length) return ov.toast("Vyberte fotku");
    add(refs, 200);
  };

  return (
    <Screen dark bg="#000">
      {useLive ? (
        <video ref={video} className="camera-bg" playsInline muted autoPlay />
      ) : (
        <>
          <img src={demo} className="camera-bg" alt="" />
          {wantLive && <video ref={video} style={{ display: "none" }} playsInline muted />}
        </>
      )}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,0.4) 0%,rgba(0,0,0,0) 20%,rgba(0,0,0,0) 62%,rgba(0,0,0,0.6) 100%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", left: 20, right: 20, top: "calc(var(--sb) + 11px)", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 5 }}>
        <button type="button" className="ic" aria-label="Zavřít fotoaparát" style={{ background: "rgba(20,20,20,0.5)", width: 44, height: 44, borderRadius: 22 }} onClick={onClose}>
          <Icon name="close" size={22} color="#fff" sw={2.2} />
        </button>
        <span className="chip" style={{ background: "rgba(20,20,20,0.55)", color: "#fff" }}>
          {title}
        </span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: "calc(var(--sb) + 71px)", display: "flex", justifyContent: "center", zIndex: 5, pointerEvents: "none" }}>
        <span className="chip" style={{ background: "rgba(255,255,255,0.92)", color: "#141414" }}>
          {hint}
        </span>
      </div>
      <div style={{ position: "absolute", left: 20, right: 20, bottom: "calc(var(--hb) + 84px)", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 8, zIndex: 6 }}>
        <span style={{ display: "flex", gap: 8 }}>
          {shots.map((s, i) => (
            <Thumb key={`${s}-${i}`} src={s} />
          ))}
        </span>
        <span style={{ display: "flex", gap: 8 }}>
          {mode === "framed" && hasCamera() && (
            <button type="button" className="glass-chip" onClick={() => setWantLive((w) => !w)}>
              <Icon name="camera" size={15} color="#fff" sw={2.2} />
              {useLive ? "Ukázkový záběr" : "Kamera"}
            </button>
          )}
          <button type="button" className="glass-chip" onClick={() => file.current?.click()}>
            <Icon name="image" size={15} color="#fff" sw={2.2} />
            Galerie
          </button>
        </span>
      </div>
      {live === "fail" && wantLive && (
        <div style={{ position: "absolute", left: 20, right: 20, top: "calc(var(--sb) + 112px)", zIndex: 6, display: "flex", justifyContent: "center" }}>
          <span className="glass-chip">Kamera není dostupná · ukázkový záběr</span>
        </div>
      )}
      {flash > 0 && <div key={flash} style={{ position: "absolute", inset: 0, background: "#fff", zIndex: 9, animation: "bulo-fade-out 320ms ease both", pointerEvents: "none" }} />}
      <input ref={file} type="file" accept="image/*" multiple={max > 1} hidden onChange={(e) => pick(e.target.files)} />
      <div className="bottom">
        <div className="brow">
          <button type="button" className="btn light" onClick={shoot} disabled={busy || shots.length >= max} aria-label="Vyfotit">
            <span style={{ width: 22, height: 22, borderRadius: 11, border: "3px solid #141414" }} />
            Vyfotit
          </button>
          {max > 1 && shots.length > 0 && (
            <button type="button" className="btn" style={{ flex: "none", padding: "0 22px" }} onClick={() => finish(shots)}>
              {doneLabel} · {shots.length}
            </button>
          )}
        </div>
      </div>
    </Screen>
  );
}

function Thumb({ src }: { src: string }) {
  const url = useMediaUrl(src);
  return url ? (
    <img src={url} alt="" className="popin" style={{ width: 56, height: 56, borderRadius: 12, objectFit: "cover", border: "2px solid #fff" }} />
  ) : (
    <span style={{ width: 56, height: 56, borderRadius: 12, background: "#333", border: "2px solid #fff" }} />
  );
}

export function Photo({ src, style, alt = "" }: { src?: string; style?: React.CSSProperties; alt?: string }) {
  const url = useMediaUrl(src);
  if (!url) return <span style={{ display: "block", background: "#E5E1DB", ...style }} />;
  return <img src={url} alt={alt} style={{ objectFit: "cover", display: "block", ...style }} />;
}
