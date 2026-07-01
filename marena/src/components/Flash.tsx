"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";

// Malé vyskakovací okénko (toast) s informací, co uživatel právě udělal.
// Použití: obal stránku do <FlashProvider> a v tlačítkách volej `flash("text", "🎉")`.
type FlashState = { id: number; text: string; emoji?: string } | null;

const FlashCtx = createContext<(text: string, emoji?: string) => void>(() => {});

export function useFlash() {
  return useContext(FlashCtx);
}

export function FlashProvider({ children }: { children: React.ReactNode }) {
  const [msg, setMsg] = useState<FlashState>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idRef = useRef(0);

  const flash = useCallback((text: string, emoji?: string) => {
    idRef.current += 1;
    setMsg({ id: idRef.current, text, emoji });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMsg(null), 2600);
  }, []);

  return (
    <FlashCtx.Provider value={flash}>
      {children}
      {msg && (
        <div className="pointer-events-none fixed inset-x-0 top-3 z-[60] flex justify-center px-4">
          <div
            key={msg.id}
            className="marena-pop flex max-w-[calc(100vw-2rem)] items-center gap-2.5 rounded-2xl bg-ink px-4 py-3 text-sm font-medium text-white shadow-2xl ring-1 ring-white/10"
          >
            {msg.emoji && <span className="shrink-0 text-lg leading-none">{msg.emoji}</span>}
            <span className="min-w-0">{msg.text}</span>
          </div>
        </div>
      )}
    </FlashCtx.Provider>
  );
}
