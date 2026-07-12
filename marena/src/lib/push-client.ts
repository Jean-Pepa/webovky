// Klientská část web pushe. Běží jen v prohlížeči. Vše je „best effort" —
// když něco není podporované, funkce se tváří neutrálně (nic nespadne).

export function pushSupported(): boolean {
  return typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}

export function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  // iPadOS se hlásí jako Mac s dotykem → doplníme detekci
  return /iphone|ipad|ipod/i.test(ua) || (/(macintosh)/i.test(ua) && "ontouchend" in document);
}

// Běží appka jako nainstalovaná (přidaná na plochu)? Na iOS je to podmínka pro push.
export function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)")?.matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

export function notifPermission(): NotificationPermission | null {
  if (typeof Notification === "undefined") return null;
  return Notification.permission;
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const buffer = new ArrayBuffer(raw.length);
  const arr = new Uint8Array(buffer);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

export async function fetchPushConfig(): Promise<{ enabled: boolean; publicKey: string | null }> {
  try {
    const res = await fetch("/api/push/config", { cache: "no-store" });
    if (!res.ok) return { enabled: false, publicKey: null };
    return (await res.json()) as { enabled: boolean; publicKey: string | null };
  } catch {
    return { enabled: false, publicKey: null };
  }
}

export async function registerSW(): Promise<ServiceWorkerRegistration | null> {
  if (!pushSupported()) return null;
  try {
    return await navigator.serviceWorker.register("/sw.js");
  } catch {
    return null;
  }
}

export async function currentSubscription(): Promise<PushSubscription | null> {
  if (!pushSupported()) return null;
  try {
    const reg = await navigator.serviceWorker.ready;
    return await reg.pushManager.getSubscription();
  } catch {
    return null;
  }
}

export type EnableResult = "ok" | "denied" | "unsupported" | "error";

// Vyžádá povolení, založí odběr a uloží ho na server pod dané jméno.
export async function enablePush(name: string): Promise<EnableResult> {
  if (!pushSupported()) return "unsupported";
  try {
    const perm = await Notification.requestPermission();
    if (perm !== "granted") return "denied";
    const { publicKey } = await fetchPushConfig();
    if (!publicKey) return "error";
    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey) as BufferSource,
      });
    }
    const json = sub.toJSON();
    const res = await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, subscription: { endpoint: json.endpoint, keys: json.keys } }),
    });
    return res.ok ? "ok" : "error";
  } catch {
    return "error";
  }
}

// Zruší odběr v prohlížeči i na serveru.
export async function disablePush(name: string): Promise<void> {
  try {
    const sub = await currentSubscription();
    if (!sub) return;
    const endpoint = sub.endpoint;
    await sub.unsubscribe().catch(() => {});
    await fetch("/api/push/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, endpoint }),
    }).catch(() => {});
  } catch {
    /* ignore */
  }
}
