"use client";

// Upozornění v prohlížeči (Notification API). O povolení se nikdy neptáme sami —
// jen když na to uživatel klepne.

import { useSyncExternalStore } from "react";

export type NotifyPermission = NotificationPermission | "unsupported";

// Den (YYYY-MM-DD), kdy jsme naposledy upozornili — nejvýš jednou denně v tomto prohlížeči
export const NOTIFIED_DAY_KEY = "bulo-deadlines-notified";

const PERMISSION_EVENT = "bulo-notify-permission";

export function notificationsSupported(): boolean {
  return typeof window !== "undefined" && typeof Notification !== "undefined";
}

function readPermission(): NotifyPermission {
  return notificationsSupported() ? Notification.permission : "unsupported";
}

function subscribe(onChange: () => void) {
  window.addEventListener(PERMISSION_EVENT, onChange);
  window.addEventListener("focus", onChange);
  let status: PermissionStatus | null = null;
  let cancelled = false;
  try {
    navigator.permissions
      ?.query({ name: "notifications" as PermissionName })
      .then((s) => {
        if (cancelled) return;
        status = s;
        s.addEventListener("change", onChange);
      })
      .catch(() => {});
  } catch {
    // Permissions API nemusí existovat
  }
  return () => {
    cancelled = true;
    window.removeEventListener(PERMISSION_EVENT, onChange);
    window.removeEventListener("focus", onChange);
    status?.removeEventListener("change", onChange);
  };
}

export function useNotificationPermission(): NotifyPermission {
  return useSyncExternalStore(subscribe, readPermission, () => "unsupported");
}

// Zeptá se na povolení (jen z klepnutí uživatele)
export async function requestNotificationPermission(): Promise<NotifyPermission> {
  if (!notificationsSupported()) return "unsupported";
  const result = await new Promise<NotificationPermission>((resolve) => {
    try {
      // starší Safari zná jen callback, novější prohlížeče vrací Promise
      const maybe = Notification.requestPermission((r) => resolve(r));
      if (maybe && typeof maybe.then === "function") {
        maybe.then(resolve, () => resolve(Notification.permission));
      }
    } catch {
      resolve(Notification.permission);
    }
  });
  window.dispatchEvent(new Event(PERMISSION_EVENT));
  return result;
}

// Zobrazí systémové upozornění. Vrací, zda se podařilo.
export async function showSystemNotification(
  title: string,
  body: string,
  onClick?: () => void,
): Promise<boolean> {
  if (!notificationsSupported() || Notification.permission !== "granted") return false;
  const options: NotificationOptions = { body, tag: "bulo-deadlines", lang: "cs" };
  try {
    const n = new Notification(title, options);
    n.onclick = () => {
      window.focus();
      onClick?.();
      n.close();
    };
    return true;
  } catch {
    // Chrome na Androidu umí upozornění jen přes service worker
    try {
      const reg = await navigator.serviceWorker?.getRegistration();
      if (reg) {
        await reg.showNotification(title, options);
        return true;
      }
    } catch {
      // ignore
    }
    return false;
  }
}
