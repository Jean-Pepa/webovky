// 3D modely motokár a řidičů od Codexe (public/models, formát GLB). Když chybí, hra kreslí
// vlastní modely z tvarů (kart-model.ts).
import type * as THREE from "three";
import files from "virtual:models";

const BASE = import.meta.env.BASE_URL;

export const MODELS = {
  /** společná motokára pro všechny postavy (přebarví se) */
  kart: null as THREE.Object3D | null,
  /** motokára jen pro jednu postavu: karts/<id>.glb */
  karts: new Map<number, THREE.Object3D>(),
  /** řidič: chars/<id>.glb */
  chars: new Map<number, THREE.Object3D>(),
};

export const hasModels = () => files.length > 0;

/** Načte všechny modely (jen pokud nějaké existují). Vrací true, když se něco načetlo. */
export async function loadModels(): Promise<boolean> {
  if (!files.length) return false;
  const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
  const loader = new GLTFLoader();
  let any = false;
  await Promise.all(
    files.map(async (f) => {
      const m = /^(?:(karts|chars)\/(\d+)|kart)\.(?:glb|gltf)$/i.exec(f);
      if (!m) return;
      try {
        const gltf = await loader.loadAsync(`${BASE}models/${f}`);
        const scene = gltf.scene;
        scene.traverse((o) => {
          const mesh = o as THREE.Mesh;
          if (mesh.isMesh) mesh.frustumCulled = true;
        });
        if (!m[1]) MODELS.kart = scene;
        else (m[1] === "karts" ? MODELS.karts : MODELS.chars).set(Number(m[2]), scene);
        any = true;
      } catch (e) {
        console.warn("3D model se nenačetl:", f, e);
      }
    }),
  );
  return any;
}
