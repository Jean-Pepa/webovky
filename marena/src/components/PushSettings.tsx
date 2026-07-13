"use client";

import { useEffect, useState } from "react";
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
  disablePush,
} from "@/lib/push-client";

type PS = "loading" | "unconfigured" | "canEnable" | "on" | "denied" | "iosInstall";

// Nastavení upozornění — jedno okno pro zapnutí/vypnutí i návody. Otevírá se
// z hamburgeru („🔔 Upozornění") i kliknutím na připomínací pruh.
export function PushSettings({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { me } = useStore();
  const [ps, setPs] = useState<PS>("loading");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPs("loading");
    (async () => {
      const cfg = await fetchPushConfig();
      if (!cfg.enabled) return setPs("unconfigured");
      if (!pushSupported()) return setPs(isIOS() && !isStandalone() ? "iosInstall" : "unconfigured");
      await registerSW();
      const perm = notifPermission();
      if (perm === "denied") return setPs("denied");
      const sub = await currentSubscription();
      setPs(perm === "granted" && sub ? "on" : "canEnable");
    })();
  }, [open]);

  async function turnOn() {
    setBusy(true);
    const r = await enablePush(me);
    setBusy(false);
    if (r === "ok") {
      setPs("on");
      flash("Upozornění zapnutá 🔔", "🔔");
    } else if (r === "denied") setPs("denied");
    else if (r === "unsupported") setPs(isIOS() && !isStandalone() ? "iosInstall" : "unconfigured");
    else flash("Nepodařilo se zapnout, zkus to znovu.", "⚠️");
  }

  async function turnOff() {
    setBusy(true);
    await disablePush(me);
    setBusy(false);
    setPs("canEnable");
    flash("Upozornění vypnutá.", "🔕");
  }

  return (
    <Modal open={open} onClose={onClose} title="🔔 Upozornění na mobil">
      {ps === "loading" && <p className="text-sm text-ink-soft">Načítám…</p>}

      {ps === "unconfigured" && (
        <p className="text-sm text-ink-soft">Upozornění zatím nejsou na serveru zapnutá. Ozvi se správci.</p>
      )}

      {ps === "canEnable" && (
        <div className="space-y-4">
          <p className="text-[15px] leading-relaxed text-ink-soft">
            Zapni si upozornění a nic ti neuteče — důležité zprávy ti cinknou na mobil, i když zrovna nemáš Mařenu otevřenou.
          </p>
          <button className="btn-primary w-full py-2.5" onClick={turnOn} disabled={busy}>
            {busy ? "Zapínám…" : "🔔 Zapnout upozornění"}
          </button>
        </div>
      )}

      {ps === "on" && (
        <div className="space-y-4">
          <p className="flex items-center gap-2 text-[15px] font-semibold text-leaf-700">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-leaf/15">✓</span>
            Upozornění máš zapnutá.
          </p>
          <p className="text-sm text-ink-soft">Na tomhle zařízení ti chodí oznámení. Můžeš je kdykoliv vypnout.</p>
          <button className="btn-secondary w-full py-2.5" onClick={turnOff} disabled={busy}>
            {busy ? "Vypínám…" : "🔕 Vypnout upozornění"}
          </button>
        </div>
      )}

      {ps === "iosInstall" && (
        <div className="space-y-3">
          <p className="text-[15px] text-ink-soft">
            Na iPhonu chodí upozornění, jen když máš Mařenu <strong className="text-ink">přidanou na ploše</strong>:
          </p>
          <ol className="space-y-2 text-sm text-ink-soft">
            <li>1. Ťukni dole na <strong className="text-ink">Sdílet</strong> (čtvereček se šipkou nahoru).</li>
            <li>2. Vyber <strong className="text-ink">Přidat na plochu</strong>.</li>
            <li>3. Potvrď <strong className="text-ink">Přidat</strong>.</li>
            <li>4. Spusť Mařenu z <strong className="text-ink">ikony na ploše</strong> a tady zapni upozornění.</li>
          </ol>
        </div>
      )}

      {ps === "denied" && (
        <div className="space-y-3">
          <p className="text-[15px] text-ink-soft">Upozornění máš pro Mařenu zakázaná. Zapni je v telefonu:</p>
          <ol className="space-y-2 text-sm text-ink-soft">
            <li>1. Otevři <strong className="text-ink">Nastavení</strong> telefonu.</li>
            <li>2. Najdi <strong className="text-ink">Mařenu</strong> (nebo prohlížeč) → <strong className="text-ink">Oznámení</strong>.</li>
            <li>3. Zapni <strong className="text-ink">Povolit oznámení</strong>.</li>
            <li>4. Vrať se sem a načti stránku znovu.</li>
          </ol>
        </div>
      )}
    </Modal>
  );
}
