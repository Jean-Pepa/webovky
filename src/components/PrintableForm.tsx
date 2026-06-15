"use client";

import { useRef, type ReactNode } from "react";

// Obálka formuláře: pole jsou vyplnitelná přímo na webu a tlačítko „Vytisknout"
// otevře čistý tiskový dokument formátu A4 jen s tímto formulářem (i s vyplněnými hodnotami).
export default function PrintableForm({
  children,
  title = "EIKA ZNOJMO – formulář",
}: {
  children: ReactNode;
  title?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function handlePrint() {
    const el = ref.current;
    if (!el) return;

    // Vyplněné hodnoty přeneseme do atributů, aby se objevily v tisku
    el.querySelectorAll("input").forEach((inp) => inp.setAttribute("value", inp.value));

    const win = window.open("", "_blank", "width=820,height=1100");
    if (!win) return;

    win.document.write(`<!doctype html>
<html lang="cs">
<head>
<meta charset="utf-8" />
<title>${title}</title>
<style>
  @page { size: A4; margin: 18mm; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Arial, Helvetica, sans-serif; color: #111827; font-size: 11.5pt; line-height: 1.55; }
  h1, .form-title { font-size: 15pt; font-weight: 700; margin: 0 0 10px; }
  p { margin: 6px 0; }
  strong { font-weight: 700; }
  ul { margin: 6px 0; padding-left: 1.2rem; }
  label { display: block; margin-top: 10px; }
  label > span { margin-right: 8px; }
  input { border: none; border-bottom: 1px solid #555; font: inherit; padding: 2px 4px; min-width: 260px; }
  a { color: #111827; text-decoration: none; }
  .brand { color: #b81f24; font-weight: 800; font-size: 18pt; margin-bottom: 14px; }
</style>
</head>
<body>
  <div class="brand">EIKA ZNOJMO, a.s.</div>
  ${el.innerHTML}
</body>
</html>`);
    win.document.close();
    win.focus();
    // dáme prohlížeči chvíli na vykreslení, pak otevřeme dialog tisku
    win.onload = () => {
      win.print();
      win.close();
    };
    setTimeout(() => {
      try {
        win.print();
      } catch {
        /* už vytištěno přes onload */
      }
    }, 400);
  }

  return (
    <div>
      <div ref={ref} className="rounded-xl border border-[var(--color-border)] bg-white p-5 sm:p-6">
        {children}
      </div>
      <button
        type="button"
        onClick={handlePrint}
        className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-white"
        style={{ background: "var(--color-accent)" }}
      >
        <span aria-hidden>🖨</span> Vytisknout formulář
      </button>
    </div>
  );
}
