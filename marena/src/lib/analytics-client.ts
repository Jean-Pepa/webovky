// Klientský sběr analytiky. Drží trvalý anonymní token v cookie (spojí návštěvy
// jednoho zařízení i před přihlášením), sbírá zobrazení stránek a kliky a posílá
// je dávkově přes navigator.sendBeacon (funguje i při zavírání karty). Vše je
// best-effort — když cokoli selže, tiše se přeskočí.

const SID_COOKIE = "marena_sid";
let identity = ""; // aktuální přihlášené jméno (prázdné = návštěvník)
let queue: Record<string, unknown>[] = [];
let started = false;

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : null;
}

// Trvalý token zařízení — vytvoří se hned při prvním otevření (i pro návštěvníka).
// „Podepíše" cookie, díky které jde návštěvníka sledovat napříč návštěvami.
export function ensureSid(): string {
  let sid = readCookie(SID_COOKIE);
  if (!sid) {
    sid = (crypto?.randomUUID?.() || String(Math.random()).slice(2) + Date.now().toString(36));
    // 1 rok, celý web, SameSite=Lax
    document.cookie = `${SID_COOKIE}=${sid}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  }
  return sid;
}

export function setIdentity(name: string) {
  identity = (name || "").trim();
}

function enqueue(ev: Record<string, unknown>) {
  const sid = ensureSid();
  queue.push({ ...ev, sid, name: identity || undefined });
  if (queue.length >= 12) flush();
}

export function trackPageview(path: string) {
  enqueue({ type: "pageview", path });
}
export function trackClick(label: string, path?: string) {
  enqueue({ type: "click", label, path });
}
// Krok trychtýře (funnel) — pošle se hned, ať se neztratí při odchodu.
export function trackFunnel(step: string) {
  enqueue({ type: "funnel", step });
  flush();
}

export function flush() {
  if (typeof navigator === "undefined" || queue.length === 0) return;
  const events = queue;
  queue = [];
  try {
    const blob = new Blob([JSON.stringify({ events })], { type: "application/json" });
    if (navigator.sendBeacon && navigator.sendBeacon("/api/analytics/track", blob)) return;
  } catch {
    /* fallback níže */
  }
  // Fallback, když sendBeacon není / selže.
  fetch("/api/analytics/track", { method: "POST", body: JSON.stringify({ events }), keepalive: true }).catch(() => {});
}

// Krátký popisek klikaného prvku pro přehled „na co se kliká".
function labelFor(el: Element): string {
  const tagged = el.closest("[data-ev]") as HTMLElement | null;
  if (tagged?.dataset.ev) return tagged.dataset.ev.slice(0, 60);
  const target = el.closest("a,button,[role='button'],summary,input[type='submit']") as HTMLElement | null;
  if (!target) return "";
  const aria = target.getAttribute("aria-label") || target.getAttribute("title");
  const text = (aria || target.textContent || "").replace(/\s+/g, " ").trim();
  const tag = target.tagName.toLowerCase();
  const href = target.getAttribute("href");
  const base = text || href || tag;
  const prefix = tag === "a" ? "🔗 " : "";
  return (prefix + base).slice(0, 60) || tag;
}

// Jednorázové globální posluchače (kliky + odchod ze stránky). Voláno z komponenty.
export function startAutoTracking() {
  if (started || typeof window === "undefined") return;
  started = true;
  ensureSid();

  document.addEventListener(
    "click",
    (e) => {
      const el = e.target as Element | null;
      if (!el || !(el instanceof Element)) return;
      const interactive = el.closest("a,button,[role='button'],summary,input[type='submit'],[data-ev]");
      if (!interactive) return;
      const label = labelFor(el);
      if (label) trackClick(label, location.pathname);
    },
    { capture: true },
  );

  const flushNow = () => flush();
  window.addEventListener("pagehide", flushNow);
  window.addEventListener("beforeunload", flushNow);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flush();
  });
  // Pojistka — pravidelný flush každých 12 s.
  setInterval(flush, 12000);
}
