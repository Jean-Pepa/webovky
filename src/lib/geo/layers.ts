// Mapové vrstvy pro průzkum pozemku.
// Dlaždice (GetMap) si stahuje prohlížeč přímo z poskytovatele.
// GetFeatureInfo (klik na parcelu) jde přes náš proxy /api/geo/featureinfo
// kvůli CORS a User-Agentu, který některé služby ČÚZK vyžadují.

export type Locale = "cs" | "en";

export interface BaseLayerDef {
  key: string;
  label: { cs: string; en: string };
  type: "tile" | "wms";
  url: string;
  attribution: string;
  maxZoom?: number;
  subdomains?: string;
  // jen pro type === "wms"
  layers?: string;
  format?: string;
}

export interface OverlayDef {
  key: string;
  label: { cs: string; en: string };
  url: string;
  layers: string;
  format: string;
  attribution: string;
  defaultOn?: boolean;
  opacity?: number;
  // GetFeatureInfo
  queryable?: boolean;
  queryLayers?: string;
}

export const BASE_LAYERS: BaseLayerDef[] = [
  {
    key: "osm",
    label: { cs: "Mapa", en: "Map" },
    type: "tile",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "© OpenStreetMap",
    maxZoom: 19,
    subdomains: "abc",
  },
  {
    key: "ortofoto",
    label: { cs: "Letecká", en: "Aerial" },
    type: "wms",
    url: "https://geoportal.cuzk.cz/WMS_ORTOFOTO_PUB/WMService.aspx",
    layers: "GR_ORTFOTORGB",
    format: "image/png",
    attribution: "© ČÚZK",
    maxZoom: 20,
  },
];

// Překryvné vrstvy (transparentní). Sem se budou přidávat další zdroje:
// záplavová území, radonové riziko, územní plány, geologie…
export const OVERLAYS: OverlayDef[] = [
  {
    key: "cadastre",
    label: { cs: "Katastrální mapa", en: "Cadastral map" },
    url: "https://services.cuzk.cz/wms/inspire-cp-wms.asp",
    layers: "CP.CadastralParcel,CP.CadastralZoning",
    format: "image/png",
    attribution: "© ČÚZK",
    defaultOn: true,
    queryable: true,
    queryLayers: "CP.CadastralParcel",
  },
];

// Hostnames, na které smí proxy GetFeatureInfo posílat dotazy.
export const ALLOWED_WMS_HOSTS = [
  "services.cuzk.cz",
  "services.cuzk.gov.cz",
  "geoportal.cuzk.cz",
];
