"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

// Na PC (velká obrazovka + myš) připomene, že Mařena je hlavně do mobilu —
// s QR kódem, který otevře appku na telefonu. Zavíratelné (pamatuje si to).
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
    QRCode.toDataURL(window.location.origin, { width: 240, margin: 1, color: { dark: "#1d1d1f", light: "#ffffff" } })
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
    <div className="mb-3 flex items-center gap-4 rounded-2xl border-2 border-gold-500 bg-gold-50 px-4 py-3">
      {qr ? (
        // eslint-disable-next-line @next/next/no-img-element -- QR je data-URL, next/image nedává smysl
        <img src={qr} alt="QR kód — otevřít Mařenu na telefonu" className="h-20 w-20 shrink-0 rounded-lg bg-[#fff] p-1 ring-1 ring-ink/10" />
      ) : (
        <div className="h-20 w-20 shrink-0 rounded-lg bg-[#fff] ring-1 ring-ink/10" />
      )}
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-bold text-ink">📱 Mařena je hlavně do mobilu</p>
        <p className="mt-0.5 text-sm text-ink-soft">
          Otevři si ji na telefonu — naskenuj QR kód. Tam ti navíc chodí <strong className="text-ink">upozornění</strong> a máš ji pořád po ruce.
        </p>
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Zavřít"
        title="Zavřít"
        className="shrink-0 rounded-full p-1.5 text-lg leading-none text-ink-soft transition hover:bg-ink/10"
      >
        ✕
      </button>
    </div>
  );
}
