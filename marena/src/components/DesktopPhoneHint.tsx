"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

// Na PC (velká obrazovka + myš) vyskočí přes celou obrazovku připomínka, že
// Mařena je hlavně do mobilu — s velkým QR kódem, který otevře appku na telefonu.
// Zavíratelné (zapamatuje si to, už neotravuje).
const KEY = "marena_phone_hint_dismissed";

export function DesktopPhoneHint() {
  const [show, setShow] = useState(false);
  const [qr, setQr] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY) === "1") return;
    } catch {
      /* ignore */
    }
    const desktop = window.matchMedia?.("(min-width: 768px) and (pointer: fine)")?.matches;
    if (!desktop) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShow(true);
    QRCode.toDataURL(window.location.origin, { width: 480, margin: 1, color: { dark: "#1d1d1f", light: "#ffffff" } })
      .then(setQr)
      .catch(() => {});
  }, []);

  if (!show) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    setShow(false);
  };

  return (
    <div className="fixed inset-0 z-[68] grid place-items-center bg-ink/60 px-4 backdrop-blur-sm">
      <div className="marena-pop w-full max-w-md rounded-2xl bg-surface px-6 py-7 text-center shadow-2xl ring-2 ring-gold-500/60">
        <div className="text-4xl">📱</div>
        <h2 className="mt-2 font-display text-xl font-bold">Otevři Mařenu na telefonu</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
          Appka je hlavně do mobilu — naskenuj QR kód a otevři si ji na telefonu. Tam ti navíc chodí{" "}
          <strong className="text-ink">upozornění</strong> a máš ji pořád po ruce.
        </p>
        <div className="mx-auto mt-4 w-fit rounded-2xl bg-[#fff] p-3 ring-1 ring-ink/10">
          {qr ? (
            // eslint-disable-next-line @next/next/no-img-element -- QR je data-URL, next/image nedává smysl
            <img src={qr} alt="QR kód — otevřít Mařenu na telefonu" className="h-52 w-52" />
          ) : (
            <div className="h-52 w-52 animate-pulse rounded-lg bg-paper2" />
          )}
        </div>
        <button className="btn-primary mt-5 w-full py-2.5" onClick={dismiss}>
          Rozumím, budu na telefonu
        </button>
        <button className="btn-ghost mt-1 w-full py-2 text-sm" onClick={dismiss}>
          Chci pokračovat na počítači
        </button>
      </div>
    </div>
  );
}
