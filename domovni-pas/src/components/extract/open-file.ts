// Otevře soubor uložený jako data URL v nové záložce.
// Prohlížeče blokují přímou navigaci na data: URL, proto přes blob: URL.
// Otevřít smíme jen obrázek nebo PDF — HTML či SVG by v záložce běželo pod naší doménou,
// ostatní soubory se jen stáhnou.
const VIEWABLE_RE = /^data:(?:image\/(?:jpeg|png|webp|gif)|application\/pdf)[;,]/i;

export function openDataUrl(dataUrl: string, fileName?: string) {
  const viewable = VIEWABLE_RE.test(dataUrl);
  const win = viewable ? window.open("", "_blank") : null; // hned v kliknutí — jinak ho zablokuje blokovač oken
  fetch(dataUrl)
    .then((r) => r.blob())
    .then((blob) => {
      const file = viewable ? blob : new Blob([blob], { type: "application/octet-stream" });
      const url = URL.createObjectURL(file);
      if (win) {
        win.location.href = url;
      } else {
        // okno se neotevřelo (nebo jde o jiný soubor) → stáhnout
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName ?? "doklad";
        a.click();
      }
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    })
    .catch(() => win?.close());
}
