/// <reference types="vite/client" />

declare module "virtual:assets" {
  /** cesty k obrázkům v public/img, např. "chars/0.png" */
  const files: string[];
  export default files;
}

declare module "virtual:models" {
  /** cesty k 3D modelům v public/models, např. "kart.glb", "chars/0.glb" */
  const files: string[];
  export default files;
}
