"use client";

import { useEffect, useRef } from "react";

// Video se světelnými čarami (light-painting z Instagramu Mařeny) jako pozadí
// finálové karty. Přes mix-blend-mode: screen se černé pozadí videa „přebarví"
// na zlatou karty a bílé čáry zůstanou bílé. Bez zvuku, ve smyčce, jen dekorace.
//
// Značka <video> je vložená jako hotové HTML: React neumí spolehlivě vyrenderovat
// atribut `muted`, a bez něj v HTML Safari/Chrome autoplay zablokují.
// Zaoblení i na videu samotném: Safari (hlavně iOS) neořezává video podle
// zaobleného rámu rodiče, a v rozích se pak objevovalo černé pozadí videa.
const MARKUP = `<video class="pointer-events-none absolute inset-0 h-full w-full rounded-[inherit] object-cover mix-blend-screen" autoplay loop muted playsinline preload="auto" disablepictureinpicture disableremoteplayback aria-hidden="true"><source src="/finale-flashes.webm" type="video/webm"><source src="/finale-flashes.mp4" type="video/mp4"></video>`;

export function FinaleVideo() {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const v = wrap.current?.querySelector("video");
    if (!v) return;
    // Při „omezit pohyb" video stojí na prvním snímku.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.pause();
      return;
    }
    v.muted = true;
    v.loop = true;

    // Prohlížeče video samy zastavují (přepnutí karty, odscrollování pryč, konec
    // smyčky, iOS v úsporném režimu…) a po návratu ho nespustí. Tady se po každém
    // takovém zastavení znovu rozjede — s pojistkou proti nekonečnému opakování,
    // kdyby ho prohlížeč pouštět odmítal (úsporný režim → rozjede se po prvním dotyku).
    let visible = true;
    let retries = 0;
    const play = () => {
      if (!visible || document.hidden) return;
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
        }
      },
      { threshold: 0.05 },
    );

    v.addEventListener("playing", onPlaying);
    v.addEventListener("pause", onPause);
    v.addEventListener("ended", onEnded);
    v.addEventListener("loadeddata", play);
    v.addEventListener("stalled", play);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pageshow", onVisibility);
    window.addEventListener("touchstart", onGesture, { passive: true });
    window.addEventListener("click", onGesture);
    io.observe(v);
    play();

    return () => {
      v.removeEventListener("playing", onPlaying);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("loadeddata", play);
      v.removeEventListener("stalled", play);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pageshow", onVisibility);
      window.removeEventListener("touchstart", onGesture);
      window.removeEventListener("click", onGesture);
      io.disconnect();
    };
  }, []);

  return <div ref={wrap} aria-hidden className="absolute inset-0 overflow-hidden rounded-[inherit]" dangerouslySetInnerHTML={{ __html: MARKUP }} />;
}
