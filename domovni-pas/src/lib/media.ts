import { newId } from "./id";
import type { Media } from "./store";

// Obrázky zmenšíme do data URL (kvůli velikosti localStorage), ostatní soubory uložíme jen názvem.
export async function fileToMedia(file: File): Promise<Media> {
  if (file.type.startsWith("image/")) {
    try {
      const dataUrl = await downscaleImage(file, 1280, 0.72);
      return { id: newId(), name: file.name, kind: "image", dataUrl };
    } catch {
      return { id: newId(), name: file.name, kind: "file" };
    }
  }
  return { id: newId(), name: file.name, kind: "file" };
}

function downscaleImage(file: File, maxDim: number, quality: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > height && width > maxDim) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      } else if (height > maxDim) {
        width = Math.round((width * maxDim) / height);
        height = maxDim;
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("no canvas context"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("image load error"));
    };
    img.src = url;
  });
}

// Pro dokumenty: malé soubory uložíme jako data URL (lze stáhnout), velké jen podle názvu.
export function fileToDataUrl(file: File, maxBytes = 1_500_000): Promise<string | undefined> {
  if (file.size > maxBytes) return Promise.resolve(undefined);
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : undefined);
    reader.onerror = () => resolve(undefined);
    reader.readAsDataURL(file);
  });
}
