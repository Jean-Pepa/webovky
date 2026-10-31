// Ukázkové GLB modely podle kontraktu v AGENTS.md (motokára + řidič) — vzor pro Codexe a test načítání.
// node scripts/sample-models.mjs [cílová složka]   (výchozí e2e/out/sample-models)
// Pro zkoušku ve hře: node scripts/sample-models.mjs public/models && npm run build (a pak modely zase smaž).
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { writeFileSync, mkdirSync } from "node:fs";
globalThis.FileReader = class {
  readAsArrayBuffer(b) { b.arrayBuffer().then((r) => { this.result = r; this.onload?.({ target: this }); this.onloadend?.({ target: this }); }); }
  readAsDataURL(b) { b.arrayBuffer().then((r) => { this.result = "data:application/octet-stream;base64," + Buffer.from(r).toString("base64"); this.onload?.({ target: this }); this.onloadend?.({ target: this }); }); }
};
const mat = (name, color) => Object.assign(new THREE.MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.1 }), { name });
const kart = new THREE.Group(); kart.name = "kart";
const body = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.45, 2.4), mat("paint", 0xffffff)); body.position.set(0, 0.45, 0); kart.add(body);
const fin = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.9, 0.9), mat("accent", 0xffffff)); fin.position.set(0, 1.1, -0.9); kart.add(fin);
const tireGeo = new THREE.CylinderGeometry(0.33, 0.33, 0.32, 12).rotateZ(Math.PI / 2);
for (const [n, x, z] of [["wheel_fl", 0.85, 0.85], ["wheel_fr", -0.85, 0.85], ["wheel_rl", 0.85, -0.85], ["wheel_rr", -0.85, -0.85]]) {
  const w = new THREE.Mesh(tireGeo, mat("tire", 0x111111)); w.name = n; w.position.set(x, 0.33, z); kart.add(w);
}
for (const [n, p] of [["seat", [0, 0.68, -0.3]], ["exhaust_l", [0.3, 0.6, -1.25]], ["exhaust_r", [-0.3, 0.6, -1.25]]]) {
  const e = new THREE.Object3D(); e.name = n; e.position.set(...p); kart.add(e);
}
const drv = new THREE.Group(); drv.name = "driver";
const torso = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.55, 0.4), mat("shirt", 0x00c2a8)); torso.position.set(0, 0.3, 0); drv.add(torso);
const head = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.5, 0.5), mat("fur", 0xff00ff)); head.name = "head"; head.position.set(0, 0.85, 0); drv.add(head);
const ex = new GLTFExporter();
const out = process.argv[2] || new URL("../e2e/out/sample-models", import.meta.url).pathname;
mkdirSync(out + "/chars", { recursive: true });
for (const [obj, file] of [[kart, out + "/kart.glb"], [drv, out + "/chars/0.glb"]]) {
  const buf = await ex.parseAsync(obj, { binary: true });
  writeFileSync(file, Buffer.from(buf));
  console.log("ok", file, buf.byteLength);
}
