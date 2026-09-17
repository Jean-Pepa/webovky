"use client";

import { useEffect, useRef } from "react";

// Video se světelnými čarami (light-painting z Instagramu Mařeny) jako pozadí
// finálové karty: černé pozadí videa se „přebarví" na zlatou, bílé čáry zůstanou.
//
// Přebarvení se dělá kreslením do <canvas> (composite „screen"), NE přes CSS
// mix-blend-mode — Safari na iPhonu takové video po ořezu zaoblenými rohy
// vykreslovalo jen jako zaseklý snímek. Video samotné leží pod canvasem.
//
// Značka <video> je vložená jako hotové HTML: React neumí spolehlivě vyrenderovat
// atribut `muted`, a bez něj v HTML Safari/Chrome autoplay zablokují.
const GOLD = "#f8d370"; // stejná jako pozadí karty finále (bg-[#f8d370])
const MARKUP = `<video class="pointer-events-none absolute inset-0 h-full w-full object-cover" autoplay loop muted playsinline preload="auto" disablepictureinpicture disableremoteplayback aria-hidden="true"><source src="/finale-flashes.webm" type="video/webm"><source src="/finale-flashes.mp4" type="video/mp4"></video>`;
const FPS = 30;

export function FinaleVideo() {
  const wrap = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const v = wrap.current?.querySelector("video");
    const c = canvasRef.current;
    const ctx = c?.getContext("2d");
    if (!v || !c || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    v.muted = true;
    v.loop = true;

    // --- kreslení: zlatý podklad + video přes „screen" (černá zmizí, bílá zůstane)
    const draw = () => {
      const W = c.width;
      const H = c.height;
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = GOLD;
      ctx.fillRect(0, 0, W, H);
      const vw = v.videoWidth;
      const vh = v.videoHeight;
      if (!vw || !vh || v.readyState < 2) return;
      // object-fit: cover
      const s = Math.max(W / vw, H / vh);
      const dw = vw * s;
      const dh = vh * s;
      ctx.globalCompositeOperation = "screen";
      ctx.drawImage(v, (W - dw) / 2, (H - dh) / 2, dw, dh);
      ctx.globalCompositeOperation = "source-over";
    };
    const fit = () => {
      const r = c.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = Math.max(1, Math.round(r.width * dpr));
      c.height = Math.max(1, Math.round(r.height * dpr));
      draw();
    };

    let visible = true;
    let raf = 0;
    let last = 0;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden || t - last < 1000 / FPS) return;
      last = t;
      draw();
    };

    // --- přehrávání: prohlížeče video samy zastavují (přepnutí karty, odscrollování,
    // konec smyčky, iOS v úsporném režimu…). Po každém zastavení se znovu rozjede;
    // pojistka proti nekonečnému opakování — v úsporném režimu iOS pustí video až
    // po skutečném gestu (touchend / click), ne po pouhém touchstart.
    let retries = 0;
    const play = () => {
      if (reduce || !visible || document.hidden) return;
      const p = v.play();
      if (p) p.catch(() => {});
    };
    const onPlaying = () => {
      retries = 0;
    };
    const onPause = () => {
      if (visible && !document.hidden && retries++ < 8) setTimeout(play, 300);
    };
    const onEnded = () => {
      v.currentTime = 0;
      play();
    };
    const onVisibility = () => {
      if (!document.hidden) {
        retries = 0;
        play();
      }
    };
    const onGesture = () => {
      retries = 0;
      play();
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          retries = 0;
          play();
          draw();
        }
      },
      { threshold: 0.05 },
    );
    const ro = new ResizeObserver(fit);

    v.addEventListener("playing", onPlaying);
    v.addEventListener("pause", onPause);
    v.addEventListener("ended", onEnded);
    v.addEventListener("loadeddata", draw);
    v.addEventListener("loadeddata", play);
    v.addEventListener("stalled", play);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pageshow", onVisibility);
    window.addEventListener("touchend", onGesture, { passive: true });
    window.addEventListener("pointerup", onGesture, { passive: true });
    window.addEventListener("click", onGesture);
    window.addEventListener("keydown", onGesture);
    io.observe(c);
    ro.observe(c);
    fit();
    if (reduce) {
      v.pause();
    } else {
      play();
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      v.removeEventListener("playing", onPlaying);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("loadeddata", draw);
      v.removeEventListener("loadeddata", play);
      v.removeEventListener("stalled", play);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pageshow", onVisibility);
      window.removeEventListener("touchend", onGesture);
      window.removeEventListener("pointerup", onGesture);
      window.removeEventListener("click", onGesture);
      window.removeEventListener("keydown", onGesture);
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  return (
    <>
      {/* video pod canvasem (canvas ho celý překrývá; video jen dodává snímky) */}
      <div ref={wrap} aria-hidden className="absolute inset-0 overflow-hidden rounded-[inherit]" dangerouslySetInnerHTML={{ __html: MARKUP }} />
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full rounded-[inherit]" />
    </>
  );
}
