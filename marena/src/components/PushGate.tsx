"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { flash } from "@/components/Flash";
import { PushSettings } from "@/components/PushSettings";
import {
  registerSW,
  fetchPushConfig,
  pushSupported,
  isIOS,
  isStandalone,
  notifPermission,
  currentSubscription,
  enablePush,
  isDesktop,
} from "@/lib/push-client";

// Stav upozornění na tomhle zařízení:
//  on         – zapnuto (nic neukazujeme)
//  prompt     – ještě se nerozhodl → vynutíme velkou výzvu (po přihlášení / hned po schválení)
//  denied     – zakázal v prohlížeči → poradíme, jak to zapnout
//  iosInstall – iPhone v Safari (ne na ploše) → push nejde, dokud si to nepřidá
//  off        – nepodporováno / backend bez VAPID / čeká na schválení → nic neřešíme
type St = "loading" | "on" | "prompt" | "denied" | "iosInstall" | "off";

export function PushGate() {
  const { authed, me, pendingApproval } = useStore();
  const [st, setSt] = useState<St>("loading");
  const [settings, setSettings] = useState(false); // otevřené okno nastavení
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // Dokud čekáš na schválení, upozornění neřešíme — výzva vyskočí až budeš schválený.
    if (!authed || !me || pendingApproval) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSt("off");
      return;
    }
    let alive = true;
    (async () => {
      const cfg = await fetchPushConfig();
      if (!alive) return;
      if (!cfg.enabled) return setSt("off");
      if (!pushSupported()) return setSt(isIOS() && !isStandalone() ? "iosInstall" : "off");
      await registerSW();
      const perm = notifPermission();
      // Na PC nevnucujeme notifikace — místo toho pruh „otevři na telefonu"
      // (DesktopPhoneHint). Ruční zapnutí přes hamburger 🔔 pořád funguje.
      if (isDesktop()) {
        const sub = perm === "granted" ? await currentSubscription() : null;
        // Když už odběr je, ulož ho pod AKTUÁLNÍ jméno — po přepnutí identity
        // (třeba na správce „Mařena") jinak zůstane zařízení jen u starého jména
        // a notifikace „ke schválení" (chodí na Mařenu) nikam nedorazí.
        if (sub) await enablePush(me);
        if (alive) setSt(sub ? "on" : "off");
        return;
      }
      if (perm === "granted") {
        // Vždy (re)registruj tohle zařízení pod aktuální jméno — i když už odběr
        // v prohlížeči existuje (jinak by přepnutí na správce nechalo Mařenu bez zařízení).
        await enablePush(me);
        if (alive) setSt("on");
        return;
      }
      if (!alive) return;
      setSt(perm === "denied" ? "denied" : "prompt");
    })();
    return () => {
      alive = false;
    };
  }, [authed, me, pendingApproval]);

  async function turnOn() {
    setBusy(true);
    const r = await enablePush(me);
    setBusy(false);
    if (r === "ok") {
      setSt("on");
      flash("Upozornění zapnutá — teď ti nic neuteče 🔔", "🔔");
    } else if (r === "denied") setSt("denied");
    else if (r === "unsupported") setSt(isIOS() && !isStandalone() ? "iosInstall" : "off");
    else flash("Upozornění se nepodařilo zapnout, zkus to prosím znovu.", "⚠️");
  }

  const settingsModal = <PushSettings open={settings} onClose={() => setSettings(false)} />;

  if (st === "loading" || st === "on" || st === "off") return settingsModal;

  // ---- Vynucená výzva — velké okno přes obrazovku, dokud si upozornění nezapne ----
  if (st === "prompt") {
    return (
      <>
        {settingsModal}
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
          </div>
        </div>
      </>
    );
  }

  // ---- Slim pruh (zakázáno / iOS instalace) → otevře nastavení s návodem ----
  const barText =
    st === "denied"
      ? "Upozornění máš vypnutá. Zapni je v nastavení telefonu."
      : "Na iPhonu přidej Mařenu na plochu, ať ti chodí upozornění.";

  return (
    <div className="mb-3">
      <button
        type="button"
        onClick={() => setSettings(true)}
        className="readonly-pulse flex w-full items-center gap-2.5 rounded-xl border-2 border-gold-500 bg-gold-50 px-3 py-2.5 text-left"
      >
        <span className="text-lg leading-none">🔔</span>
        <span className="min-w-0 flex-1 text-sm font-medium text-ink">{barText}</span>
        <span className="shrink-0 text-xs font-bold text-gold-700">Návod →</span>
      </button>
      {settingsModal}
    </div>
  );
}
