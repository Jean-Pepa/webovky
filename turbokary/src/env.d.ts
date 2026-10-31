/// <reference types="vite/client" />

declare module "virtual:assets" {
  /** cesty k obrázkům v public/img, např. "chars/0.png" */
  const files: string[];
  export default files;
}
