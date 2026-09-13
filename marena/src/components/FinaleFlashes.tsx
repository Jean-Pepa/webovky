import type { CSSProperties } from "react";

// Světelné čáry ve finálové kartě — čisté stopy světla (jako light-painting z
// videa na Instagramu), které se objevují a mizí, každá v jiném rytmu. Bez
// „kouře": jen tenká bílá čára se zlatou září, ať je vidět na zlatavé kartě.
// Čistě dekorace: pointer-events none, aria-hidden, při „omezit pohyb" jen tlumeně svítí.
type Flash = { d: string; w: number; dur: number; delay: number; dx?: number; dy?: number };

const TRAILS: Flash[] = [
  // dlouhá vlnovka přes pravou část
  { d: "M690 330 C 700 250, 640 200, 700 140 S 790 60, 780 -10", w: 2.5, dur: 4.6, delay: 0, dx: -10, dy: -14 },
  // smyčky (kroužení světlem)
  { d: "M540 300 c 20 -40, 60 -40, 60 0 s -40 40, -20 0 s 60 -50, 90 -20 s 10 60, 50 30 s 40 -40, 70 -10", w: 2, dur: 5.4, delay: 1.3, dx: 12, dy: -8 },
  { d: "M760 220 c -30 10, -60 40, -90 60 s -50 30, -40 60", w: 1.5, dur: 3.8, delay: 2.4, dx: -8, dy: 6 },
  // vlevo nahoře — jemná klikatá čára
  { d: "M20 -10 c 30 40, 80 30, 110 80 s -30 70, -70 60 s -20 -40, 10 -50", w: 1.5, dur: 6.2, delay: 0.8, dx: 6, dy: 10 },
  // střed — vlnovka zdola nahoru
  { d: "M300 330 c 30 -50, 90 -30, 140 -80 s 40 -80, 120 -100", w: 2, dur: 5, delay: 3.1, dx: -6, dy: -10 },
  // krátké kudrlinky
  { d: "M760 40 c -20 20, 10 40, -10 60 s -30 20, -20 50", w: 1.2, dur: 3.2, delay: 1.9, dx: 4, dy: 8 },
  { d: "M420 -10 c -20 40, 30 50, 10 90 s -30 30, -10 60", w: 1.2, dur: 4.4, delay: 4, dx: -4, dy: 6 },
  { d: "M120 320 c 20 -30, 50 -10, 60 -40 s 30 -30, 60 -20", w: 1.5, dur: 4.8, delay: 2.9, dx: 8, dy: -6 },
];

// Jiskra — svazek krátkých čar z jednoho bodu.
const SPARKS: { x: number; y: number; r: number; dur: number; delay: number }[] = [
  { x: 730, y: 250, r: 26, dur: 3.6, delay: 0.5 },
  { x: 130, y: 250, r: 18, dur: 4.8, delay: 2.2 },
  { x: 620, y: 70, r: 22, dur: 4.2, delay: 3.4 },
];
const RAYS = [0, 28, 55, 84, 110, 141, 168, 199, 224, 252, 281, 309, 336];

function vars(f: { dur: number; delay: number; dx?: number; dy?: number }): CSSProperties {
  return { "--dur": `${f.dur}s`, "--delay": `${f.delay}s`, "--dx": `${f.dx ?? 0}px`, "--dy": `${f.dy ?? 0}px` } as CSSProperties;
}

const GOLD = "#e0940a"; // sytější zlatá, ať je čára na zlatavé kartě vidět

export function FinaleFlashes() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 800 320"
      preserveAspectRatio="none"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <filter id="finale-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
      </defs>
      {/* zlatá záře pod čarou */}
      <g filter="url(#finale-glow)" stroke={GOLD}>
        {TRAILS.map((t, i) => (
          <path key={i} className="finale-flash" style={vars(t)} d={t.d} strokeWidth={t.w * 3} />
        ))}
      </g>
      {/* čisté bílé jádro čáry */}
      <g stroke="#fff">
        {TRAILS.map((t, i) => (
          <path key={i} className="finale-flash" style={vars(t)} d={t.d} strokeWidth={t.w} />
        ))}
      </g>
      {/* jiskry */}
      {SPARKS.map((s, i) => (
        <g key={i} className="finale-flash" style={vars(s)}>
          <g stroke={GOLD} strokeWidth="3.5" filter="url(#finale-glow)">
            {RAYS.map((deg) => {
              const a = (deg * Math.PI) / 180;
              const len = s.r * (0.55 + ((deg * 7) % 10) / 20);
              return <line key={deg} x1={s.x} y1={s.y} x2={s.x + Math.cos(a) * len} y2={s.y + Math.sin(a) * len} />;
            })}
          </g>
          <g stroke="#fff" strokeWidth="1.2">
            {RAYS.map((deg) => {
              const a = (deg * Math.PI) / 180;
              const len = s.r * (0.55 + ((deg * 7) % 10) / 20);
              return <line key={deg} x1={s.x} y1={s.y} x2={s.x + Math.cos(a) * len} y2={s.y + Math.sin(a) * len} />;
            })}
          </g>
          <circle cx={s.x} cy={s.y} r="2.5" fill="#fff" stroke={GOLD} strokeWidth="1.5" />
        </g>
      ))}
    </svg>
  );
}
