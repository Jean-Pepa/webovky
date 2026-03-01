"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";

const IDLE_TIMEOUT = 15_000;
const IDLE_TRANSITION = 2_000;

interface HeaderProps {
  showLogo?: boolean;
  showNav?: boolean;
}

export default function Header({ showLogo = true, showNav = true }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [heroOpacity, setHeroOpacity] = useState(1);
  const [idle, setIdle] = useState(false);
  const [idleExiting, setIdleExiting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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

  const resetIdle = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      // Don't trigger idle when a modal is open (body overflow hidden)
      if (document.body.style.overflow === "hidden") return;
      setIdle(true);
    }, IDLE_TIMEOUT);
  }, []);

  // Restore scroll position after locale switch
  useEffect(() => {
    const saved = sessionStorage.getItem("scrollRestore");
    if (saved) {
      sessionStorage.removeItem("scrollRestore");
      window.scrollTo(0, parseInt(saved, 10));
    }
  }, []);

  // Scroll effect
  useEffect(() => {
    function handleScroll() {
      const wrapper = document.querySelector(".headline-wrapper");
      if (!wrapper) return;
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
    }

    // Initialize immediately based on current scroll position
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        top: scrolled ? "33px" : "70px",
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
      {/* Idle white overlay */}
      <div className={`idle-fade${idle ? " visible" : ""}`} />

      {/* Fixed nav — desktop inline, mobile hamburger */}
      {showNav && (
        <>
          <nav
            className="fixed top-[10px] sm:top-[19px] left-0 right-0 flex items-center justify-center gap-4 sm:gap-8 px-4 sm:px-7 py-5 flex-wrap z-10 transition-[background] duration-300"
            style={{
              fontFamily: '"Montserrat", sans-serif',
              background: "transparent",
              backdropFilter: "none",
              WebkitBackdropFilter: "none",
              opacity: scrolled ? 1 : heroOpacity,
            }}
          >
            {/* Desktop nav links */}
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hidden sm:inline text-xs font-normal uppercase tracking-[0.1em] transition-opacity hover:opacity-40 text-black"
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

      {/* KVIN Logo */}
      {showLogo && (
        <div
          className="fixed top-[70px] left-0 right-0 text-center px-4 sm:px-7 pt-[30px] pb-[10px] z-10 pointer-events-none transition-all duration-400"
          style={logoStyle}
        >
          <svg
            className="inline-block w-[180px] h-[53px] sm:w-[240px] sm:h-[70px]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="5 0 186 80"
          >
            <path d="M8 8 L8 72" stroke="#222" strokeWidth="2" fill="none" />
            <path d="M8 40 L38 8" stroke="#222" strokeWidth="2" fill="none" />
            <path d="M24 24 L42 72" stroke="#222" strokeWidth="2" fill="none" />
            <path d="M60 8 L82 72 L104 8" stroke="#222" strokeWidth="2" fill="none" strokeLinejoin="miter" />
            <path d="M124 8 L124 72" stroke="#222" strokeWidth="2" fill="none" />
            <path d="M148 72 L148 8 L188 72 L188 8" stroke="#222" strokeWidth="2" fill="none" strokeLinejoin="miter" />
          </svg>
        </div>
      )}
    </>
  );
}
