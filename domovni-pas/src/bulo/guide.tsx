"use client";

import { useNav } from "./nav";
import { useOverlay } from "./overlay";
import { useStore } from "./store";
import { CHAPTERS, STEPS, stepFor } from "./scenario";
import { clearBlobs } from "./media";
import { switchRole } from "./screens/common";

// Na užší obrazovce je průvodce pod telefonem: po výběru scény telefon posuneme do záběru.
function revealDevice() {
  const el = document.querySelector(".bulo .phone");
  if (!el) return;
  const r = el.getBoundingClientRect();
  if (r.top < 0 || r.bottom > window.innerHeight) el.scrollIntoView({ behavior: "smooth", block: "center" });
}

// Průvodce vedle telefonu (desktop): kapitoly a scény jako ve videu.
export function Guide() {
  const { s, dispatch } = useStore();
  const nav = useNav();
  const ov = useOverlay();
  const cur = stepFor(nav.top, s);
  const ch = CHAPTERS.find((c) => c.id === cur?.ch);

  return (
    <aside className="guide" aria-label="Průvodce ukázkou">
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span className="gmark">BULO</span>
        <h1>Digitální pas domu</h1>
        <p className="gsub">Celý dům na jednom místě. AI hlídá, vy jen víte. Funkční prototyp, klikejte přímo v telefonu.</p>
      </div>

      <div className="gnow" aria-live="polite">
        <span className="eyebrow">{cur ? `${cur.ch} · ${ch?.name}` : s.role === "technik" ? "Technik" : "Vlastník"}</span>
        <b>{cur?.caption ?? (s.role === "technik" ? "Technik vidí jen to, co potřebuje." : "Celý dům na jednom místě.")}</b>
        <span>{cur?.sub ?? "Vyberte scénu níže, nebo prozkoumejte aplikaci sami."}</span>
      </div>

      <div className="gtools">
        <button type="button" className={s.role === "vlastnik" ? "on" : ""} onClick={() => s.role !== "vlastnik" && switchRole(s, dispatch, nav, "vlastnik")}>
          Vlastník
        </button>
        <button type="button" className={s.role === "technik" ? "on" : ""} onClick={() => s.role !== "technik" && switchRole(s, dispatch, nav, "technik")}>
          Technik
        </button>
        <button
          type="button"
          onClick={() => {
            dispatch({ t: "reset", now: Date.now() });
            clearBlobs();
            nav.reset([{ name: "domy" }], "fade");
            ov.toast("Ukázka je jako nová");
          }}
        >
          Obnovit ukázku
        </button>
      </div>

      {CHAPTERS.map((c) => (
          <div className="gch" key={c.id}>
            <h2>
              {c.id} · {c.name}
            </h2>
            {STEPS.filter((x) => x.ch === c.id).map((x) => (
              <button key={x.id} type="button" className={`gstep ${cur?.id === x.id ? "on" : ""}`} onClick={() => (x.run(s, dispatch, nav), revealDevice())}>
                <span>{x.title}</span>
                {c.id === "5" && <small>připravujeme</small>}
              </button>
            ))}
          </div>
        ))}

      <p className="gfoot">
        Data se ukládají jen v tomto prohlížeči. „Zeptat se domu“, AI zápis a čtení dokumentů odpovídají z dat pasu domu; s klíčem Claude API na serveru čte AI i fotky a PDF. Ukázková data: Chata Loučky, Bítov.
      </p>
    </aside>
  );
}
