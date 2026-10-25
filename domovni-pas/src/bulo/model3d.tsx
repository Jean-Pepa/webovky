"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { PLAN_PATHS, PLAN_RECTS } from "./data";

// 3D model chaty z půdorysu 1. NP (souřadnice půdorysu 346 × 271 → metry).
// Rozvody: elektro, voda, topení, plyn. Každá trasa má zdroj a přesnost.

export type Layer = "elektro" | "voda" | "topeni" | "plyn";
export const LAYER_INFO: Record<Layer, { name: string; sub: string; color: string; acc: string }> = {
  elektro: { name: "Elektro", sub: "z rozvaděče R1 do místností", color: "#F28C1B", acc: "±1 cm" },
  voda: { name: "Voda", sub: "od vodoměru ke koupelně a kuchyni", color: "#2F7FD8", acc: "±2 cm" },
  topeni: { name: "Topení", sub: "z kotle k radiátorům", color: "#E2483D", acc: "±2 cm" },
  plyn: { name: "Plyn", sub: "z přípojky přímo ke kotli", color: "#F2C21B", acc: "±2 cm" },
};

const S = 11.58 / 287; // m na jednotku půdorysu
const CX = 155;
const CZ = 135;
const H = 2.55; // výška stěn
const P = (u: number, h: number, v: number) => new THREE.Vector3((u - CX) * S, h, (v - CZ) * S);

type Pt = [number, number, number];
const ROUTES: Record<Layer, Pt[][]> = {
  elektro: [
    [[180, 1.6, 81], [180, 2.42, 81], [150, 2.42, 81], [150, 2.42, 100], [110, 2.42, 100], [110, 0.4, 100]],
    [[180, 2.42, 81], [282, 2.42, 81], [282, 2.42, 58], [236, 2.42, 58], [236, 1.3, 58]],
    [[200, 2.42, 81], [200, 2.42, 150], [200, 0.4, 150]],
    [[262, 2.42, 81], [262, 2.42, 150], [262, 0.4, 150]],
    [[150, 2.42, 92], [60, 2.42, 92], [60, 2.42, 150], [60, 0.4, 150]],
  ],
  voda: [
    [[270, 0.3, 19], [257, 0.7, 22], [250, 0.7, 30], [215, 0.7, 30], [200, 0.7, 26]],
    [[215, 0.7, 30], [160, 0.7, 30], [160, 0.7, 60], [176, 0.9, 62]],
    [[160, 0.7, 60], [152, 0.7, 76], [100, 0.7, 80], [100, 0.9, 120]],
    [[250, 0.7, 30], [242, 0.7, 30], [242, 1.2, 30]],
  ],
  topeni: [
    [[223, 1.1, 44], [223, 0.08, 46], [223, 0.08, 95], [200, 0.08, 95], [200, 0.08, 203], [200, 0.4, 206]],
    [[223, 0.08, 95], [262, 0.08, 95], [262, 0.08, 203], [262, 0.4, 206]],
    [[200, 0.08, 95], [130, 0.08, 95], [130, 0.08, 203], [130, 0.4, 206]],
    [[130, 0.08, 95], [40, 0.08, 95], [40, 0.08, 203], [40, 0.4, 206]],
  ],
  plyn: [[[330, 0.3, 38], [298, 0.3, 38], [292, 0.85, 38], [236, 0.85, 38], [227, 0.85, 44]]],
};

// Popisky se nesmí překrývat: důležitější (v pořadí pole) vyhrávají, ostatní se skryjí.
type LabelItem = { key: string; text: string; x: number; y: number; color: string; vis: boolean };
function declutter(items: LabelItem[]): LabelItem[] {
  const placed: [number, number, number, number][] = [];
  return items.map((it) => {
    if (!it.vis) return it;
    const w = it.text.length * 7 + 34;
    const box: [number, number, number, number] = [it.x - w / 2 - 3, it.y - 36, it.x + w / 2 + 3, it.y - 6];
    const hit = placed.some((b) => box[0] < b[2] && box[2] > b[0] && box[1] < b[3] && box[3] > b[1]);
    if (hit) return { ...it, vis: false };
    placed.push(box);
    return it;
  });
}

export const LABELS: { text: string; layer: Layer; at: Pt }[] = [
  { text: "Kotel", layer: "elektro", at: [236, 1.4, 58] },
  { text: "Vodoměr a uzávěr", layer: "voda", at: [257, 0.8, 22] },
  { text: "Rozvaděč R1", layer: "elektro", at: [180, 1.7, 81] },
  { text: "Přípojka plynu", layer: "plyn", at: [330, 0.5, 38] },
  { text: "Kotel", layer: "topeni", at: [223, 1.3, 44] },
  { text: "Kotel", layer: "plyn", at: [227, 1.2, 44] },
  { text: "Zásobník", layer: "voda", at: [242, 1.4, 30] },
  { text: "Dřez", layer: "voda", at: [100, 1.0, 120] },
  { text: "Sprcha", layer: "voda", at: [200, 0.8, 26] },
  { text: "Zásuvky v kuchyni", layer: "elektro", at: [110, 0.5, 100] },
  { text: "Radiátor", layer: "topeni", at: [200, 0.6, 206] },
  { text: "Radiátor", layer: "topeni", at: [130, 0.6, 206] },
  { text: "Radiátor", layer: "topeni", at: [262, 0.6, 206] },
  { text: "Pokoj", layer: "elektro", at: [60, 0.5, 150] },
];

export interface ModelHandle {
  setLayer: (l: Layer | "vse") => void;
}

export default function Model3D({
  layer,
  leak,
  repaired,
  onLabels,
}: {
  layer: Layer | "vse";
  leak: boolean;
  repaired: boolean;
  onLabels?: (items: { key: string; text: string; x: number; y: number; color: string; vis: boolean }[]) => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const layerRef = useRef(layer);
  const leakRef = useRef({ leak, repaired });
  const labelsCb = useRef(onLabels);
  useEffect(() => {
    layerRef.current = layer;
  }, [layer]);
  useEffect(() => {
    leakRef.current = { leak, repaired };
  }, [leak, repaired]);
  useEffect(() => {
    labelsCb.current = onLabels;
  }, [onLabels]);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      el.innerHTML = '<div style="padding:24px;color:#6F6A65;font:15px Inter,sans-serif">Tento prohlížeč neumí 3D zobrazení.</div>';
      return;
    }
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.touchAction = "none";

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(36, 1, 0.1, 200);
    cam.position.set(9.5, 11.5, 12.5);
    const controls = new OrbitControls(cam, renderer.domElement);
    controls.target.set(0.6, 0.6, -0.4);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 5;
    controls.maxDistance = 30;
    controls.maxPolarAngle = Math.PI * 0.47;
    controls.autoRotate = false;
    controls.update();

    scene.add(new THREE.HemisphereLight(0xffffff, 0xd9d0c4, 1.6));
    const sun = new THREE.DirectionalLight(0xfff4e6, 2.2);
    sun.position.set(-6, 12, 7);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -10;
    sun.shadow.camera.right = 10;
    sun.shadow.camera.top = 10;
    sun.shadow.camera.bottom = -10;
    sun.shadow.bias = -0.0006;
    sun.shadow.radius = 6;
    scene.add(sun);

    const mat = (color: number, o: THREE.MeshStandardMaterialParameters = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0, ...o });
    const box = (w: number, h: number, d: number, x: number, y: number, z: number, m: THREE.Material, shadow = true) => {
      const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
      b.position.set(x, y, z);
      b.castShadow = shadow;
      b.receiveShadow = true;
      scene.add(b);
      return b;
    };
    const planBox = (u: number, v: number, w: number, d: number, h: number, y0: number, m: THREE.Material, shadow = true) =>
      box(w * S, h, d * S, (u + w / 2 - CX) * S, y0 + h / 2, (v + d / 2 - CZ) * S, m, shadow);

    // podklad
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.ShadowMaterial({ opacity: 0.16 }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.21;
    ground.receiveShadow = true;
    scene.add(ground);
    planBox(8, 7, 293, 212, 0.2, -0.2, mat(0xe9e4dd));
    // terasa (dřevo) a zábradlí
    const wood = mat(0xc49a6c, { roughness: 0.9 });
    planBox(48, 216, 290, 50, 0.18, -0.2, wood);
    const rail = mat(0x2b2724, { roughness: 0.6 });
    for (let u = 52; u <= 334; u += 23.5) planBox(u, 262, 1.6, 1.6, 1.0, 0, rail);
    for (const hh of [0.45, 0.95]) planBox(50, 262.4, 286, 0.8, 0.05, hh, rail);

    // podlahy místností
    const floorM = mat(0xf3efea, { roughness: 0.95 });
    PLAN_RECTS.filter((r) => r[4] === "#F7F5F2").forEach(([x, y, w, d]) => planBox(x, y, w, d, 0.02, 0, floorM, false));

    // stěny (černé obdélníky půdorysu) s tmavší korunou jako na renderu
    const wallM = mat(0xfbfaf7, { roughness: 0.92 });
    const capM = mat(0x5a524b, { roughness: 0.8 });
    PLAN_RECTS.filter((r) => r[4] === "#141414").forEach(([x, y, w, d]) => {
      planBox(x, y, w, d, H, 0, wallM);
      planBox(x, y, w, d, 0.05, H, capM, false);
    });
    // okna: parapet, sklo, nadpraží
    const glass = new THREE.MeshStandardMaterial({ color: 0xa9c8de, transparent: true, opacity: 0.38, roughness: 0.1, metalness: 0.1 });
    PLAN_PATHS.filter((p) => p[1] === "#9FB7C4").forEach(([d]) => {
      const m = d.match(/M([\d.]+) ([\d.]+)H([\d.]+)/);
      if (!m) return;
      const x1 = +m[1];
      const y = +m[2];
      const x2 = +m[3];
      const th = 6;
      planBox(x1, y - th / 2, x2 - x1, th, 0.9, 0, wallM);
      planBox(x1, y - th / 2, x2 - x1, th, 0.35, H - 0.35, wallM);
      planBox(x1, y - 0.6, x2 - x1, 1.2, H - 1.25, 0.9, glass, false);
    });

    // nábytek
    const white = mat(0xffffff, { roughness: 0.7 });
    const oak = mat(0xc8a274, { roughness: 0.8 });
    const dark = mat(0x3a3430, { roughness: 0.6 });
    // postele
    for (const u of [180, 242]) {
      planBox(u, 150, 42, 54, 0.32, 0, oak);
      planBox(u + 1, 151, 40, 52, 0.18, 0.32, white);
      planBox(u + 3, 152, 15, 8, 0.1, 0.5, white);
      planBox(u + 24, 152, 15, 8, 0.1, 0.5, white);
    }
    // kuchyňská linka + stůl
    planBox(98, 84, 15, 100, 0.88, 0, white);
    planBox(97.5, 84, 16, 100, 0.05, 0.88, dark);
    planBox(122, 135, 34, 22, 0.05, 0.74, oak);
    for (const [a, b] of [[123, 136], [153, 136], [123, 154], [153, 154]]) planBox(a, b, 1.6, 1.6, 0.74, 0, dark);
    // schodiště v obývacím pokoji
    for (let i = 0; i < 10; i++) planBox(22 + i * 3.6, 80, 3.6, 22, 0.25 * (i + 1), 0, oak);
    // gauč
    planBox(30, 180, 50, 18, 0.42, 0, mat(0xd9d2c8));
    // koupelna: sprcha, WC, umyvadlo
    planBox(196, 20, 16, 16, 0.08, 0, white);
    planBox(155, 22, 9, 12, 0.42, 0, white);
    planBox(170, 58, 12, 9, 0.85, 0, white);
    // technická místnost: kotel, zásobník, vodoměr, komín
    const kotel = planBox(217, 39, 12, 10, 0.75, 0.9, mat(0xf4f1ec, { roughness: 0.5 }));
    kotel.castShadow = true;
    const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 1.3, 24), mat(0xffffff, { roughness: 0.5 }));
    tank.position.copy(P(242, 0.65, 30));
    tank.castShadow = true;
    scene.add(tank);
    planBox(252, 18, 9, 8, 0.16, 0.62, mat(0x2f7fd8, { roughness: 0.4 }));
    planBox(218, 8, 13, 13, 5.2, 0, mat(0xcfc8bf, { roughness: 0.9 }));
    planBox(217, 7, 15, 15, 0.12, 5.2, capM);

    // rozvody
    const groups: Record<Layer, THREE.Group> = { elektro: new THREE.Group(), voda: new THREE.Group(), topeni: new THREE.Group(), plyn: new THREE.Group() };
    const glows: Record<Layer, THREE.MeshBasicMaterial> = {} as Record<Layer, THREE.MeshBasicMaterial>;
    const cores: Record<Layer, THREE.MeshStandardMaterial> = {} as Record<Layer, THREE.MeshStandardMaterial>;
    (Object.keys(ROUTES) as Layer[]).forEach((k) => {
      const c = new THREE.Color(LAYER_INFO[k].color);
      cores[k] = new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.55, roughness: 0.4, transparent: true });
      glows[k] = new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.22, depthWrite: false, blending: THREE.AdditiveBlending });
      const g = groups[k];
      for (const path of ROUTES[k]) {
        const pts = path.map(([u, h, v]) => P(u, h, v));
        for (let i = 1; i < pts.length; i++) {
          const a = pts[i - 1];
          const b = pts[i];
          const len = a.distanceTo(b);
          if (len < 1e-3) continue;
          const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
          const mid = a.clone().add(b).multiplyScalar(0.5);
          const core = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, len, 10), cores[k]);
          core.position.copy(mid);
          core.quaternion.copy(q);
          g.add(core);
          const glow = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, len, 10), glows[k]);
          glow.position.copy(mid);
          glow.quaternion.copy(q);
          g.add(glow);
        }
        for (const p of pts.slice(1, -1)) {
          const s = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), cores[k]);
          s.position.copy(p);
          g.add(s);
        }
      }
      scene.add(g);
    });
    // radiátory
    for (const u of [182, 112, 244, 22]) planBox(u, 206, 34, 2.5, 0.55, 0.15, white);

    // únik / oprava u kolena za vodoměrem
    const leakM = new THREE.MeshBasicMaterial({ color: 0xe5533d, transparent: true, opacity: 0.9 });
    const leakS = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 12), leakM);
    leakS.position.copy(P(250, 0.7, 30));
    scene.add(leakS);
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.16, 0.22, 32), new THREE.MeshBasicMaterial({ color: 0xe5533d, transparent: true, opacity: 0.6, side: THREE.DoubleSide, depthWrite: false }));
    ring.position.copy(P(250, 0.7, 30));
    scene.add(ring);

    // velikost
    const resize = () => {
      const w = el.clientWidth || 390;
      const h = el.clientHeight || 600;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = `${w}px`;
      renderer.domElement.style.height = `${h}px`;
      cam.aspect = w / Math.max(1, h);
      cam.fov = cam.aspect < 0.8 ? 46 : 36;
      cam.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    const v3 = new THREE.Vector3();
    let raf = 0;
    let t0 = performance.now();
    let frame = 0;
    const loop = (now: number) => {
      const t = (now - t0) / 1000;
      const L = layerRef.current;
      (Object.keys(groups) as Layer[]).forEach((k) => {
        const on = L === "vse" || L === k;
        cores[k].emissiveIntensity = on ? 0.55 + 0.25 * Math.sin(t * 3) : 0.05;
        cores[k].opacity = on ? 1 : 0.25;
        glows[k].opacity = on ? 0.22 + 0.08 * Math.sin(t * 3) : 0.0;
      });
      const lk = leakRef.current;
      leakS.visible = lk.leak || lk.repaired;
      ring.visible = lk.leak;
      leakM.color.set(lk.repaired && !lk.leak ? 0x2e7d4f : 0xe5533d);
      const ph = (t * 0.9) % 1;
      ring.scale.setScalar(1 + ph * 3);
      (ring.material as THREE.MeshBasicMaterial).opacity = 0.7 * (1 - ph);
      ring.lookAt(cam.position);
      controls.update();
      renderer.render(scene, cam);
      // popisky (každý druhý snímek)
      if (labelsCb.current && frame++ % 2 === 0) {
        const r = el.getBoundingClientRect();
        const w = r.width;
        const h = r.height;
        const items = LABELS.map((lb, i) => {
          v3.copy(P(lb.at[0], lb.at[1], lb.at[2])).project(cam);
          const vis = (L === "vse" ? lb.text !== "Kotel" || lb.layer === "elektro" : lb.layer === L) && v3.z < 1 && Math.abs(v3.x) < 1.05 && Math.abs(v3.y) < 1.05;
          return { key: `${lb.text}-${i}`, text: lb.text, x: ((v3.x + 1) / 2) * w, y: ((1 - v3.y) / 2) * h, color: LAYER_INFO[lb.layer].color, vis };
        });
        if (lk.leak || lk.repaired) {
          v3.copy(P(250, 0.95, 30)).project(cam);
          items.unshift({ key: "leak", text: lk.leak ? "Možný únik · koleno" : "Opraveno · koleno", x: ((v3.x + 1) / 2) * w, y: ((1 - v3.y) / 2) * h, color: lk.leak ? "#E5533D" : "#2E7D4F", vis: L === "vse" || L === "voda" });
        }
        labelsCb.current(declutter(items));
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else {
        t0 = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
      ro.disconnect();
      controls.dispose();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        const mm = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mm)) mm.forEach((x) => x.dispose());
        else mm?.dispose();
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={host} style={{ position: "absolute", inset: 0 }} />;
}
