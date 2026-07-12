"use client";

import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { Modal } from "@/components/Modal";
import { flash } from "@/components/Flash";
import {
  registerSW,
  fetchPushConfig,
  pushSupported,
  isIOS,
  isStandalone,
  notifPermission,
  currentSubscription,
  enablePush,
} from "@/lib/push-client";

// Stav upozornění na tomhle zařízení:
//  on         – zapnuto (nic neukazujeme)
//  prompt     – ještě se nerozhodl → vynutíme velkou výzvu po přihlášení
//  denied     – zakázal v prohlížeči → poradíme, jak to zapnout v nastavení
//  iosInstall – iPhone v Safari (ne na ploše) → push nejde, dokud si to nepřidá
//  off        – nepodporováno / backend bez VAPID → nic neřešíme
type St = "loading" | "on" | "prompt" | "denied" | "iosInstall" | "off";

export function PushGate() {
  const { authed, me } = useStore();
  const [st, setSt] = useState<St>("loading");
  const [dismissed, setDismissed] = useState(false); // výzvu zavřel → jen pruh
  const [guide, setGuide] = useState(false); // iOS návod otevřený
  const [busy, setBusy] = useState(false);
  const evaluated = useRef(false);

  useEffect(() => {
    if (!authed || !me || evaluated.current) return;
    evaluated.current = true;
    (async () => {
      const cfg = await fetchPushConfig();
      if (!cfg.enabled) return setSt("off"); // backend bez VAPID → feature vypnutá

      if (!pushSupported()) {
        // iPhone v Safari (ne na ploše) push neumí — nabídneme přidání na plochu
        return setSt(isIOS() && !isStandalone() ? "iosInstall" : "off");
      }
      await registerSW();
      const perm = notifPermission();
      if (perm === "granted") {
        // Povoleno, ale odběr mohl vypršet/chybět → tiše obnovíme
        const sub = await currentSubscription();
        if (!sub) await enablePush(me);
        return setSt("on");
      }
      if (perm === "denied") return setSt("denied");
      return setSt("prompt");
    })();
  }, [authed, me]);

  async function turnOn() {
    setBusy(true);
    const r = await enablePush(me);
    setBusy(false);
    if (r === "ok") {
      setSt("on");
      flash("Upozornění zapnutá — teď ti nic neuteče 🔔", "🔔");
    } else if (r === "denied") {
      setSt("denied");
    } else if (r === "unsupported") {
      setSt(isIOS() && !isStandalone() ? "iosInstall" : "off");
    } else {
      flash("Upozornění se nepodařilo zapnout, zkus to prosím znovu.", "⚠️");
    }
  }

  if (st === "loading" || st === "on" || st === "off") return null;

  // ---- Vynucená výzva (než se rozhodne) — velké okno přes obrazovku ----
  if (st === "prompt" && !dismissed) {
    return (
      <div className="fixed inset-0 z-[65] grid place-items-center bg-ink/60 px-4 backdrop-blur-sm">
        <div className="marena-pop w-full max-w-md rounded-2xl bg-surface px-6 py-6 text-center shadow-2xl ring-2 ring-gold-500/60">
          <div className="text-4xl">🔔</div>
          <h2 className="mt-2 font-display text-xl font-bold">Zapni si upozornění</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
            Ať ti neuteče žádné důležité oznámení (sraz, změna, deadline) — cinkne ti to na mobil, i když zrovna nemáš Mařenu otevřenou.
          </p>
          <button className="btn-primary mt-5 w-full py-2.5" onClick={turnOn} disabled={busy}>
            {busy ? "Zapínám…" : "🔔 Zapnout upozornění"}
          </button>
          <button className="btn-ghost mt-1 w-full py-2 text-sm" onClick={() => setDismissed(true)} disabled={busy}>
            Teď ne
          </button>
        </div>
      </div>
    );
  }

  // ---- Slim pruh (zavřená výzva / zakázáno / iOS instalace) ----
  const bar = (text: string, cta: string, onClick: () => void) => (
    <button
      type="button"
      onClick={onClick}
      className="readonly-pulse flex w-full items-center gap-2.5 rounded-xl border-2 border-gold-500 bg-gold-50 px-3 py-2.5 text-left"
    >
      <span className="text-lg leading-none">🔔</span>
      <span className="min-w-0 flex-1 text-sm font-medium text-ink">{text}</span>
      <span className="shrink-0 text-xs font-bold text-gold-700">{cta}</span>
    </button>
  );

  return (
    <div className="mb-3">
      {st === "prompt" && bar("Zapni si upozornění, ať ti nic neuteče.", "Zapnout →", () => setDismissed(false))}
      {st === "denied" &&
        bar("Upozornění máš vypnutá. Zapni je v nastavení telefonu u Mařeny.", "Jak na to →", () => setGuide(true))}
      {st === "iosInstall" &&
        bar("Na iPhonu přidej Mařenu na plochu, ať ti chodí upozornění.", "Návod →", () => setGuide(true))}

      <Modal open={guide} onClose={() => setGuide(false)} title={st === "denied" ? "Zapnout upozornění" : "📲 Přidat na plochu"}>
        {st === "denied" ? (
          <ol className="space-y-2 text-sm text-ink-soft">
            <li>1. Otevři <strong className="text-ink">Nastavení</strong> telefonu.</li>
            <li>2. Najdi <strong className="text-ink">Mařenu</strong> (nebo prohlížeč) a <strong className="text-ink">Oznámení</strong>.</li>
            <li>3. Přepni <strong className="text-ink">Povolit oznámení</strong> na zapnuto.</li>
            <li>4. Vrať se sem a načti stránku znovu.</li>
          </ol>
        ) : (
          <ol className="space-y-2 text-sm text-ink-soft">
            <li>1. Ťukni dole na <strong className="text-ink">Sdílet</strong> (čtvereček se šipkou nahoru).</li>
            <li>2. Vyber <strong className="text-ink">Přidat na plochu</strong>.</li>
            <li>3. Potvrď <strong className="text-ink">Přidat</strong>.</li>
            <li>4. Spusť Mařenu z <strong className="text-ink">ikony na ploše</strong> a zapni upozornění.</li>
          </ol>
        )}
        <button className="btn-primary mt-4 w-full py-2.5" onClick={() => setGuide(false)}>
          Rozumím
        </button>
      </Modal>
    </div>
  );
}
