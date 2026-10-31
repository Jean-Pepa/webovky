// 3D modely od Codexu (public/models, formát GLB). Když chybí, hra si postaví náhradu z tvarů v kódu.
// Pravidla pro modely (osy, uzly, materiály) jsou v AGENTS.md.
import type * as THREE from "three";
import files from "virtual:models";

const BASE = import.meta.env.BASE_URL;

export const MODELS = {
  /** šermíř: fighters/<id>.glb (0–7), cvičný panák: fighters/dummy.glb */
  fighters: new Map<string, THREE.Object3D>(),
  /** společný pěnový meč (přebarví se podle postavy) */
  sword: null as THREE.Object3D | null,
  /** vlastní meč jen pro postavu: swords/<id>.glb */
  swords: new Map<string, THREE.Object3D>(),
  /** aréna (molo, okolí): arenas/<id>.glb */
  arenas: new Map<string, THREE.Object3D>(),
  /** věci na krájení: slice/<jméno>.glb (poloviny half_a / half_b) */
  slice: new Map<string, THREE.Object3D>(),
};

export const hasModels = () => files.length > 0;

/** Načte všechny modely, které existují. Vrací true, když se něco načetlo. */
export async function loadModels(): Promise<boolean> {
  if (!files.length) return false;
  const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
  const loader = new GLTFLoader();
  let any = false;
  await Promise.all(
    files.map(async (f) => {
      const m = /^(?:(fighters|swords|arenas|slice)\/([\w-]+)|(sword))\.(?:glb|gltf)$/i.exec(f);
      if (!m) return;
      try {
        const gltf = await loader.loadAsync(`${BASE}models/${f}`);
        const scene = gltf.scene;
        scene.traverse((o) => {
          const mesh = o as THREE.Mesh;
          if (mesh.isMesh) {
            mesh.castShadow = true;
            mesh.receiveShadow = true;
          }
        });
        if (m[3]) MODELS.sword = scene;
        else {
          const kind = m[1].toLowerCase() as "fighters" | "swords" | "arenas" | "slice";
          MODELS[kind].set(m[2].toLowerCase(), scene);
        }
        any = true;
      } catch (e) {
        console.warn("3D model se nenačetl:", f, e);
      }
    }),
  );
  return any;
}

/** Najde uzel podle jména (bez ohledu na velikost písmen). */
export function findNode(root: THREE.Object3D, name: string): THREE.Object3D | null {
  let hit: THREE.Object3D | null = null;
  const want = name.toLowerCase();
  root.traverse((o) => {
    if (!hit && o.name.toLowerCase() === want) hit = o;
  });
  return hit;
}
