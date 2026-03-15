"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";

const IDLE_TIMEOUT = 15_000;
const IDLE_TRANSITION = 2_000;

interface HeaderProps {
  showLogo?: boolean;
  showNav?: boolean;
  showIntro?: boolean;
  idleTimeout?: number;
  logoTop?: number;
  scrollTrigger?: string;
}

export default function Header({ showLogo = true, showNav = true, showIntro = true, idleTimeout, logoTop, scrollTrigger }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [heroOpacity, setHeroOpacity] = useState(1);
  const [idle, setIdle] = useState(false);
  const [idleExiting, setIdleExiting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [idleEnabled, setIdleEnabled] = useState(true);
  const [introPhase, setIntroPhase] = useState<"splash" | "transition" | "done">(showLogo && showIntro ? "splash" : "done");
  const [overDark, setOverDark] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  function switchLocale() {
    const newLocale = locale === "cs" ? "en" : "cs";
    const scrollY = window.scrollY;
    const newUrl = `/${newLocale}${pathname}`;
    sessionStorage.setItem("scrollRestore", String(scrollY));
    window.location.href = newUrl;
  }

  const effectiveIdleTimeout = idleTimeout ?? IDLE_TIMEOUT;

  // Read idle preference from sessionStorage (persists across pages, resets on tab close)
  useEffect(() => {
    const saved = sessionStorage.getItem("idleEffect");
    if (saved === "off") setIdleEnabled(false);
  }, []);

  function toggleIdleEffect() {
    setIdleEnabled((prev) => {
      const next = !prev;
      sessionStorage.setItem("idleEffect", next ? "on" : "off");
      if (!next) {
        setIdle(false);
        if (idleTimer.current) clearTimeout(idleTimer.current);
      }
      return next;
    });
  }

  const resetIdle = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    if (!idleEnabled) return;
    idleTimer.current = setTimeout(() => {
      // Don't trigger idle when a modal is open (body overflow hidden)
      if (document.body.style.overflow === "hidden") return;
      setIdle(true);
    }, effectiveIdleTimeout);
  }, [effectiveIdleTimeout, idleEnabled]);

  // Intro animation sequence
  useEffect(() => {
    if (introPhase === "done") return;
    // Splash: show INVENTIO NOVI for 0.9s
    const t1 = setTimeout(() => setIntroPhase("transition"), 900);
    // Transition: move takes 3s, then done
    const t2 = setTimeout(() => setIntroPhase("done"), 3900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Restore scroll position after locale switch
  useEffect(() => {
    const saved = sessionStorage.getItem("scrollRestore");
    if (saved) {
      sessionStorage.removeItem("scrollRestore");
      window.scrollTo(0, parseInt(saved, 10));
    }
  }, []);

  // Scroll effect
  const effectiveLogoTop = logoTop ?? 70;

  useEffect(() => {
    function handleScroll() {
      // Homepage mode: fade based on hero wrapper
      const wrapper = document.querySelector(".headline-wrapper");
      if (wrapper) {
        const wrapperBottom = wrapper.getBoundingClientRect().bottom;
        const windowH = window.innerHeight;
        const fadeZone = windowH * 0.6;

        let opacity: number;
        if (wrapperBottom >= windowH) {
          opacity = 1;
        } else if (wrapperBottom <= windowH - fadeZone) {
          opacity = 0;
        } else {
          opacity = (wrapperBottom - (windowH - fadeZone)) / fadeZone;
        }

        setHeroOpacity(opacity);
        setScrolled(opacity <= 0);
        return;
      }

      // Detail mode: shrink when trigger element scrolls above logo
      if (scrollTrigger) {
        const target = document.querySelector(scrollTrigger);
        if (!target) return;
        const targetTop = target.getBoundingClientRect().top;
        const threshold = effectiveLogoTop + 100;
        setScrolled(targetTop < threshold);
        setHeroOpacity(1);
      }
    }

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollTrigger, effectiveLogoTop]);

  // Detect if nav/logo is over an image (on detail pages, only gallery images count)
  useEffect(() => {
    const isDetailPage = !showNav;

    function checkOverImage(el: HTMLElement | null): boolean {
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      const y = rect.top + rect.height / 2;
      const sampleXs = [
        rect.left + rect.width * 0.3,
        rect.left + rect.width * 0.5,
        rect.left + rect.width * 0.7,
      ];
      for (const x of sampleXs) {
        const elements = document.elementsFromPoint(x, y);
        for (const e of elements) {
          if (el.contains(e)) continue;
          const isImg = e.tagName === "IMG";
          const hasBgImage = (() => {
            const style = window.getComputedStyle(e);
            return style.backgroundImage && style.backgroundImage !== "none" && style.backgroundImage.includes("url(");
          })();
          if (isImg || hasBgImage) {
            // On detail pages, only count images inside [data-gallery]
            if (isDetailPage && !e.closest("[data-gallery]")) break;
            return true;
          }
          const bg = window.getComputedStyle(e).backgroundColor;
          if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") break;
        }
      }
      return false;
    }

    function check() {
      const result = checkOverImage(navRef.current) || checkOverImage(logoRef.current);
      setOverDark(result);
    }

    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check, { passive: true });
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [showNav]);

  // Idle effect
  useEffect(() => {
    function onActivity() {
      if (idle) {
        setIdle(false);
        setIdleExiting(true);
        if (exitTimer.current) clearTimeout(exitTimer.current);
        exitTimer.current = setTimeout(() => setIdleExiting(false), IDLE_TRANSITION);
      }
      resetIdle();
    }

    const events = ["scroll", "mousemove", "touchstart", "touchmove", "keydown", "click"] as const;
    events.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));
    resetIdle();

    return () => {
      events.forEach((e) => window.removeEventListener(e, onActivity));
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (exitTimer.current) clearTimeout(exitTimer.current);
    };
  }, [idle, resetIdle]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Logo style: idle → center/scale2, exiting → back to scroll position with 2s transition
  const logoStyle: React.CSSProperties = idle
    ? {
        top: "50%",
        transform: "translateY(-50%) scale(2)",
        opacity: 1,
        transition: "all 2s ease",
      }
    : {
        top: scrolled ? "33px" : `${logoTop ?? 70}px`,
        transform: scrolled ? "scale(0.55)" : "scale(1)",
        opacity: scrolled ? 0.35 : 1,
        transition: idleExiting ? "all 2s ease" : undefined,
      };

  const navLinks = [
    { href: "#projects", label: `${t("projects")} • Projects` },
    { href: "#about", label: `${t("about")} • About` },
    { href: "#contact", label: `${t("contact")} • Contact` },
  ];

  return (
    <>
      {/* Intro white backdrop */}
      {introPhase !== "done" && (
        <div
          className="fixed inset-0 z-[200] bg-white"
          style={{
            opacity: introPhase === "splash" ? 1 : 0,
            transition: "opacity 1.4s ease",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Idle white overlay */}
      <div className={`idle-fade${idle ? " visible" : ""}`} />

      {/* Fixed nav — desktop inline, mobile hamburger */}
      {showNav && (
        <>
          <nav
            ref={navRef}
            className="fixed top-[10px] sm:top-[19px] left-0 right-0 flex items-center justify-center gap-4 sm:gap-8 px-4 sm:px-7 py-5 flex-wrap z-10 transition-all duration-300"
            style={{
              fontFamily: '"Montserrat", sans-serif',
              background: "transparent",
              backdropFilter: "none",
              WebkitBackdropFilter: "none",
              opacity: introPhase !== "done" ? 0 : (scrolled ? 1 : heroOpacity),
              transition: introPhase === "done" ? undefined : "opacity 1.2s ease 0.3s",
            }}
          >
            {/* Idle effect toggle — left side */}
            <button
              onClick={toggleIdleEffect}
              className="hidden sm:inline absolute left-7 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full border border-black/20 text-xs transition-opacity hover:opacity-40 text-black"
              style={{ fontFamily: '"Montserrat", sans-serif' }}
              aria-label="Toggle idle effect"
            >
              {idleEnabled ? "●" : "○"}
            </button>

            {/* Desktop nav links */}
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hidden sm:inline text-xs font-normal uppercase tracking-[0.1em] hover:opacity-40"
                style={{
                  color: overDark ? "white" : "black",
                  border: overDark ? "1px solid rgba(255,255,255,0.4)" : "1px solid transparent",
                  borderRadius: 9999,
                  padding: "6px 16px",
                  transition: "color 0.3s ease, border-color 0.3s ease, background-color 0.3s ease",
                  backgroundColor: overDark ? "rgba(255,255,255,0.15)" : "transparent",
                }}
              >
                {link.label}
              </a>
            ))}

            {/* Language switcher — right side */}
            <button
              onClick={switchLocale}
              className="hidden sm:inline absolute right-7 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full border border-black/20 text-xs font-normal uppercase tracking-[0.1em] transition-opacity hover:opacity-40 text-black"
              style={{ fontFamily: '"Montserrat", sans-serif' }}
            >
              {locale === "cs" ? "EN" : "CZ"}
            </button>

            {/* Hamburger button — mobile only */}
            <button
              onClick={() => setMenuOpen(true)}
              className="sm:hidden absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-[5px] p-2"
              aria-label="Open menu"
            >
              <span className="block w-5 h-[1.5px] bg-neutral-600" />
              <span className="block w-5 h-[1.5px] bg-neutral-600" />
              <span className="block w-5 h-[1.5px] bg-neutral-600" />
            </button>
          </nav>

          {/* Mobile fullscreen menu */}
          {menuOpen && (
            <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center gap-8 sm:hidden animate-[fadeIn_0.3s_ease]">
              <button
                onClick={() => setMenuOpen(false)}
                className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center text-[28px] font-extralight text-neutral-600"
                aria-label="Close menu"
              >
                &times;
              </button>
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-thin uppercase tracking-[0.15em] text-neutral-600 transition-opacity hover:opacity-40"
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => { switchLocale(); setMenuOpen(false); }}
                className="text-sm font-normal uppercase tracking-[0.15em] text-black transition-opacity hover:opacity-40 mt-4"
              >
                {locale === "cs" ? "EN" : "CZ"}
              </button>
            </div>
          )}
        </>
      )}

      {/* INN Logo */}
      {showLogo && (
        <div
          ref={logoRef}
          className={`fixed top-[70px] left-0 right-0 text-center px-4 sm:px-7 pt-[30px] pb-[10px] transition-all duration-400${!scrolled && !idle ? " cursor-pointer" : ""}`}
          onClick={() => { if (!scrolled && !idle) window.location.href = `/${locale}`; }}
          style={{
            ...logoStyle,
            ...(introPhase === "splash" ? {
              top: "50%",
              transform: "translateY(-50%)",
              opacity: 1,
            } : introPhase === "transition" ? {
              top: `${logoTop ?? 70}px`,
              transform: "scale(1)",
              opacity: 1,
              transition: "all 3s cubic-bezier(0.22, 1, 0.36, 1)",
            } : {}),
            opacity: introPhase === "done" ? logoStyle.opacity : 1,
            zIndex: introPhase !== "done" ? 201 : 10,
          }}
        >
          {/* INN letters — visible during splash (centered, large), then moves up */}
          <svg
            className="inline-block w-[180px] h-[53px] sm:w-[240px] sm:h-[70px]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="5 0 186 80"
            style={{
              transform: introPhase === "splash"
                ? "scale(2.5)"
                : "scale(1)",
              transition: introPhase !== "splash"
                ? "transform 3s cubic-bezier(0.22, 1, 0.36, 1)"
                : undefined,
            }}
          >
            <path d="M36 8 L36 72" stroke={scrolled && overDark && !idle ? "#fff" : "#222"} strokeWidth="2" fill="none" style={{ transition: "stroke 0.3s ease" }} />
            <path d="M58 72 L58 8 L98 72 L98 8" stroke={scrolled && overDark && !idle ? "#fff" : "#222"} strokeWidth="2" fill="none" strokeLinejoin="miter" style={{ transition: "stroke 0.3s ease" }} />
            <path d="M120 72 L120 8 L160 72 L160 8" stroke={scrolled && overDark && !idle ? "#fff" : "#222"} strokeWidth="2" fill="none" strokeLinejoin="miter" style={{ transition: "stroke 0.3s ease" }} />
          </svg>
          {/* INVENTIO NOVI — hidden during splash, fades in after INN moves up */}
          <span
            className="block uppercase tracking-[0.18em]"
            style={{
              color: scrolled && overDark && !idle ? "#fff" : "#222",
              fontFamily: '"Montserrat", sans-serif',
              fontSize: "clamp(7px, 0.9vw, 9px)",
              fontWeight: 300,
              marginTop: 4,
              opacity: introPhase === "splash" ? 0 : 1,
              transition: introPhase !== "splash"
                ? "opacity 1.5s ease 0.5s, color 0.3s ease"
                : "color 0.3s ease",
            }}
          >
            INVENTIO NOVI
          </span>
        </div>
      )}
    </>
  );
}
