"use client";

import { useEffect, useState } from "react";

// Malé vyskakovací okénko (toast) s informací, co uživatel právě udělal.
// Globální: <FlashHost /> je jednou v layoutu zázemí a kdekoli se zavolá
// `flash("text", "🎉")`. Není potřeba žádný provider ani obalování stránek.
type FlashMsg = { id: number; text: string; emoji?: string };

let listeners: Array<(m: FlashMsg) => void> = [];
let counter = 0;

export function flash(text: string, emoji?: string) {
  counter += 1;
  const msg = { id: counter, text, emoji };
  listeners.forEach((l) => l(msg));
}

export function FlashHost() {
  const [msg, setMsg] = useState<FlashMsg | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const on = (m: FlashMsg) => {
      setMsg(m);
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => setMsg(null), 2600);
    };
    listeners.push(on);
    return () => {
      listeners = listeners.filter((l) => l !== on);
      if (timer) clearTimeout(timer);
    };
  }, []);

  if (!msg) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-[60] grid place-items-center px-4">
      <div
        key={msg.id}
        className="marena-pop flex max-w-[calc(100vw-2rem)] items-center gap-4 rounded-xl bg-ink px-8 py-6 text-lg font-semibold text-white shadow-2xl ring-1 ring-white/10"
      >
        {msg.emoji && <span className="shrink-0 text-4xl leading-none">{msg.emoji}</span>}
        <span className="min-w-0">{msg.text}</span>
      </div>
    </div>
  );
}
