"use client";

import "leaflet/dist/leaflet.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  BASE_LAYERS,
  OVERLAYS,
  type Locale,
  type OverlayDef,
} from "@/lib/geo/layers";
import type {
  Map as LeafletMap,
  Layer,
  CircleMarker,
  LeafletMouseEvent,
  LatLng,
} from "leaflet";

type InfoState =
  | { status: "idle" }
  | { status: "loading"; lat: number; lng: number }
  | { status: "done"; lat: number; lng: number; text: string }
  | { status: "empty"; lat: number; lng: number }
  | { status: "error"; lat: number; lng: number };

// Sestaví WMS 1.3.0 GetFeatureInfo URL pro kliknuté místo.
function buildGetFeatureInfoUrl(
  map: LeafletMap,
  latlng: LatLng,
  overlay: OverlayDef
): string {
  const size = map.getSize();
  const point = map.latLngToContainerPoint(latlng);
  const crs = map.options.crs!;
  const bounds = map.getBounds();
  const sw = crs.project(bounds.getSouthWest());
  const ne = crs.project(bounds.getNorthEast());
  // EPSG:3857 má osy (east, north) → bbox = minx,miny,maxx,maxy
  const bbox = [sw.x, sw.y, ne.x, ne.y].join(",");

  const params = new URLSearchParams({
    SERVICE: "WMS",
    VERSION: "1.3.0",
    REQUEST: "GetFeatureInfo",
    LAYERS: overlay.layers,
    QUERY_LAYERS: overlay.queryLayers ?? overlay.layers,
    CRS: "EPSG:3857",
    BBOX: bbox,
    WIDTH: String(size.x),
    HEIGHT: String(size.y),
    I: String(Math.round(point.x)),
    J: String(Math.round(point.y)),
    INFO_FORMAT: "text/html",
    FEATURE_COUNT: "10",
    FORMAT: overlay.format,
  });
  return `${overlay.url}?${params.toString()}`;
}

// Hrubé odstranění HTML značek z odpovědi GetFeatureInfo.
function htmlToText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<\/(tr|p|div|table|li|h\d)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/[ \t]+/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

export default function ParcelMap() {
  const t = useTranslations("mapa");
  const locale = useLocale() as Locale;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const LRef = useRef<typeof import("leaflet") | null>(null);
  const baseLayersRef = useRef<Record<string, Layer>>({});
  const overlayLayersRef = useRef<Record<string, Layer>>({});
  const markerRef = useRef<CircleMarker | null>(null);

  const [ready, setReady] = useState(false);
  const [activeBase, setActiveBase] = useState("osm");
  const [activeOverlays, setActiveOverlays] = useState<Set<string>>(
    () => new Set(OVERLAYS.filter((o) => o.defaultOn).map((o) => o.key))
  );
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [info, setInfo] = useState<InfoState>({ status: "idle" });

  const handleMapClick = useCallback(async (e: LeafletMouseEvent) => {
    const L = LRef.current;
    const map = mapRef.current;
    if (!L || !map) return;

    const overlay = OVERLAYS.find((o) => o.queryable);
    if (!overlay) return;

    if (markerRef.current) markerRef.current.remove();
    markerRef.current = L.circleMarker(e.latlng, {
      radius: 7,
      color: "#111",
      weight: 2,
      fillColor: "#fff",
      fillOpacity: 1,
    }).addTo(map);

    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    setInfo({ status: "loading", lat, lng });

    try {
      const gfiUrl = buildGetFeatureInfoUrl(map, e.latlng, overlay);
      const res = await fetch(
        `/api/geo/featureinfo?url=${encodeURIComponent(gfiUrl)}`
      );
      const body = await res.text();
      const text = htmlToText(body);
      const looksEmpty =
        !res.ok ||
        text.length < 3 ||
        /serviceexception|not queryable|<\?xml/i.test(body.slice(0, 200));
      if (looksEmpty) {
        setInfo({ status: "empty", lat, lng });
      } else {
        setInfo({ status: "done", lat, lng, text });
      }
    } catch {
      setInfo({ status: "error", lat, lng });
    }
  }, []);

  // Inicializace mapy (Leaflet se načítá dynamicky až na klientu).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const mod = await import("leaflet");
      const L = (mod.default ?? mod) as typeof import("leaflet");
      if (cancelled || !containerRef.current || mapRef.current) return;
      LRef.current = L;

      const map = L.map(containerRef.current, {
        center: [49.82, 15.47],
        zoom: 8,
        zoomControl: false,
        minZoom: 7,
      });
      mapRef.current = map;

      L.control.zoom({ position: "bottomright" }).addTo(map);
      L.control.scale({ imperial: false, position: "bottomleft" }).addTo(map);

      for (const b of BASE_LAYERS) {
        const layer =
          b.type === "tile"
            ? L.tileLayer(b.url, {
                attribution: b.attribution,
                maxZoom: b.maxZoom,
                subdomains: b.subdomains ?? "abc",
              })
            : L.tileLayer.wms(b.url, {
                layers: b.layers,
                format: b.format,
                version: "1.3.0",
                maxZoom: b.maxZoom,
                attribution: b.attribution,
              });
        baseLayersRef.current[b.key] = layer;
      }
      baseLayersRef.current["osm"]?.addTo(map);

      for (const o of OVERLAYS) {
        const layer = L.tileLayer.wms(o.url, {
          layers: o.layers,
          format: o.format,
          transparent: true,
          version: "1.3.0",
          opacity: o.opacity ?? 1,
          attribution: o.attribution,
        });
        overlayLayersRef.current[o.key] = layer;
        if (o.defaultOn) layer.addTo(map);
      }

      map.on("click", handleMapClick);
      setReady(true);
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [handleMapClick]);

  function selectBase(key: string) {
    const map = mapRef.current;
    if (!map) return;
    for (const [k, layer] of Object.entries(baseLayersRef.current)) {
      if (k === key) {
        if (!map.hasLayer(layer)) layer.addTo(map);
      } else if (map.hasLayer(layer)) {
        map.removeLayer(layer);
      }
    }
    // Překryvy musí zůstat nad podkladem.
    for (const layer of Object.values(overlayLayersRef.current)) {
      if (map.hasLayer(layer) && "bringToFront" in layer) {
        (layer as Layer & { bringToFront: () => void }).bringToFront();
      }
    }
    setActiveBase(key);
  }

  function toggleOverlay(key: string) {
    const map = mapRef.current;
    const layer = overlayLayersRef.current[key];
    if (!map || !layer) return;
    setActiveOverlays((prev) => {
      const next = new Set(prev);
      if (map.hasLayer(layer)) {
        map.removeLayer(layer);
        next.delete(key);
      } else {
        layer.addTo(map);
        if ("bringToFront" in layer) {
          (layer as Layer & { bringToFront: () => void }).bringToFront();
        }
        next.add(key);
      }
      return next;
    });
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q || !mapRef.current) return;
    setSearching(true);
    setSearchError(false);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=cz&q=${encodeURIComponent(
          q
        )}`,
        { headers: { Accept: "application/json" } }
      );
      const data: Array<{ lat: string; lon: string }> = await res.json();
      if (data?.[0]) {
        mapRef.current.setView(
          [parseFloat(data[0].lat), parseFloat(data[0].lon)],
          18
        );
      } else {
        setSearchError(true);
      }
    } catch {
      setSearchError(true);
    } finally {
      setSearching(false);
    }
  }

  const label = (l: { cs: string; en: string }) => l[locale] ?? l.cs;

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="absolute inset-0 z-0 bg-neutral-100" />

      {!ready && (
        <div className="absolute inset-0 z-[1200] flex items-center justify-center bg-white/70 text-sm tracking-wide text-neutral-500">
          {t("loading")}
        </div>
      )}

      {/* Horní lišta: zpět + hledání */}
      <div className="absolute left-3 right-3 top-3 z-[1000] flex flex-wrap items-center gap-2">
        <Link
          href="/"
          className="flex h-10 items-center gap-2 rounded-full bg-white/95 px-4 text-sm font-normal text-neutral-700 shadow-md ring-1 ring-black/5 backdrop-blur transition hover:bg-white"
        >
          <span aria-hidden>←</span>
          <span className="hidden sm:inline">{t("back")}</span>
        </Link>

        <form
          onSubmit={handleSearch}
          className="flex h-10 min-w-0 flex-1 items-center overflow-hidden rounded-full bg-white/95 shadow-md ring-1 ring-black/5 backdrop-blur sm:max-w-md"
        >
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearchError(false);
            }}
            placeholder={t("search")}
            className="h-full min-w-0 flex-1 bg-transparent px-4 text-sm text-neutral-800 outline-none placeholder:text-neutral-400"
          />
          <button
            type="submit"
            disabled={searching}
            className="h-full shrink-0 px-4 text-sm font-medium text-neutral-700 transition hover:text-black disabled:opacity-50"
          >
            {searching ? "…" : t("searchBtn")}
          </button>
        </form>
      </div>

      {searchError && (
        <div className="absolute left-3 top-16 z-[1000] rounded-md bg-white/95 px-3 py-1.5 text-xs text-red-600 shadow ring-1 ring-black/5">
          {t("searchEmpty")}
        </div>
      )}

      {/* Panel vrstev */}
      <div className="absolute right-3 top-16 z-[1000] w-44 rounded-xl bg-white/95 p-3 text-sm shadow-md ring-1 ring-black/5 backdrop-blur sm:top-16">
        <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-neutral-400">
          {t("baseLayer")}
        </p>
        <div className="mb-3 flex gap-1">
          {BASE_LAYERS.map((b) => (
            <button
              key={b.key}
              onClick={() => selectBase(b.key)}
              className={`flex-1 rounded-md px-2 py-1.5 text-xs transition ${
                activeBase === b.key
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {label(b.label)}
            </button>
          ))}
        </div>

        <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-neutral-400">
          {t("layers")}
        </p>
        <div className="flex flex-col gap-1.5">
          {OVERLAYS.map((o) => (
            <label
              key={o.key}
              className="flex cursor-pointer items-center gap-2 text-xs text-neutral-700"
            >
              <input
                type="checkbox"
                checked={activeOverlays.has(o.key)}
                onChange={() => toggleOverlay(o.key)}
                className="h-3.5 w-3.5 accent-neutral-900"
              />
              {label(o.label)}
            </label>
          ))}
        </div>
      </div>

      {/* Panel informací o parcele */}
      {info.status !== "idle" && (
        <div className="absolute bottom-8 left-3 z-[1000] max-h-[45vh] w-[min(22rem,calc(100vw-1.5rem))] overflow-auto rounded-xl bg-white/97 p-4 shadow-lg ring-1 ring-black/5 backdrop-blur">
          <div className="mb-2 flex items-start justify-between gap-2">
            <h2 className="text-sm font-medium text-neutral-800">
              {t("parcelInfo")}
            </h2>
            <button
              onClick={() => {
                setInfo({ status: "idle" });
                markerRef.current?.remove();
                markerRef.current = null;
              }}
              className="-mt-1 -mr-1 p-1 text-lg leading-none text-neutral-400 hover:text-neutral-700"
              aria-label="×"
            >
              ×
            </button>
          </div>

          {info.status === "loading" && (
            <p className="text-sm text-neutral-500">{t("loading")}</p>
          )}
          {info.status === "empty" && (
            <p className="text-sm text-neutral-500">{t("noInfo")}</p>
          )}
          {info.status === "error" && (
            <p className="text-sm text-red-600">{t("fetchError")}</p>
          )}
          {info.status === "done" && (
            <pre className="whitespace-pre-wrap break-words font-sans text-[13px] leading-relaxed text-neutral-700">
              {info.text}
            </pre>
          )}

          {"lat" in info && (
            <div className="mt-3 border-t border-neutral-100 pt-2 text-xs text-neutral-500">
              <p className="mb-1">
                {t("coords")}: {info.lat.toFixed(5)}, {info.lng.toFixed(5)}
              </p>
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                <a
                  href={`https://mapy.cz/zakladni?x=${info.lng}&y=${info.lat}&z=18&source=coor&id=${info.lng}%2C${info.lat}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-700 underline decoration-neutral-300 underline-offset-2 hover:text-black"
                >
                  {t("openMapy")}
                </a>
                <a
                  href="https://nahlizenidokn.cuzk.gov.cz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-700 underline decoration-neutral-300 underline-offset-2 hover:text-black"
                >
                  {t("openKn")}
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {info.status === "idle" && ready && (
        <div className="pointer-events-none absolute bottom-8 left-1/2 z-[1000] -translate-x-1/2 rounded-full bg-black/55 px-4 py-1.5 text-xs text-white/90 backdrop-blur">
          {t("clickHint")}
        </div>
      )}
    </div>
  );
}
