import type { CSSProperties } from "react";

// Záblesky ve finálové kartě — bílé světelné čáry a jiskry (jako dlouhá expozice
// na fotce z Flédy), které se objevují a mizí, každá v jiném rytmu. Čistě
// dekorace: pointer-events none, aria-hidden, při „omezit pohyb" jen tlumeně svítí.
type Flash = { d: string; w: number; dur: number; delay: number; dx?: number; dy?: number };

const TRAILS: Flash[] = [
  { d: "M690 330 C 700 250, 640 200, 700 140 S 790 60, 780 -10", w: 5, dur: 4.6, delay: 0, dx: -10, dy: -14 },
  { d: "M560 330 C 620 290, 590 230, 660 200 S 760 190, 800 120", w: 3, dur: 5.4, delay: 1.3, dx: 12, dy: -8 },
  { d: "M780 220 C 720 240, 690 300, 640 330", w: 2, dur: 3.8, delay: 2.4, dx: -8, dy: 6 },
  { d: "M20 -10 C 60 60, 140 40, 170 120 S 120 200, 60 180", w: 2.5, dur: 6.2, delay: 0.8, dx: 6, dy: 10 },
  { d: "M300 330 C 340 280, 420 300, 470 240 S 520 150, 600 130", w: 3, dur: 5, delay: 3.1, dx: -6, dy: -10 },
  { d: "M760 40 C 740 80, 770 110, 730 150", w: 1.5, dur: 3.2, delay: 1.9, dx: 4, dy: 8 },
  { d: "M420 -10 C 400 40, 450 70, 430 120", w: 1.5, dur: 4.4, delay: 4, dx: -4, dy: 6 },
];

// Jiskra — svazek krátkých čar z jednoho bodu.
const SPARKS: { x: number; y: number; r: number; dur: number; delay: number }[] = [
  { x: 730, y: 250, r: 34, dur: 3.6, delay: 0.5 },
  { x: 120, y: 260, r: 22, dur: 4.8, delay: 2.2 },
  { x: 620, y: 70, r: 26, dur: 4.2, delay: 3.4 },
];
const RAYS = [0, 28, 55, 84, 110, 141, 168, 199, 224, 252, 281, 309, 336];

function vars(f: { dur: number; delay: number; dx?: number; dy?: number }): CSSProperties {
  return { "--dur": `${f.dur}s`, "--delay": `${f.delay}s`, "--dx": `${f.dx ?? 0}px`, "--dy": `${f.dy ?? 0}px` } as CSSProperties;
}

export function FinaleFlashes() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 800 320"
      preserveAspectRatio="none"
      fill="none"
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <filter id="finale-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <filter id="finale-soft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
      </defs>
      {/* měkká záře pod čarami */}
      <g filter="url(#finale-glow)" opacity="0.8">
        {TRAILS.map((t, i) => (
          <path key={i} className="finale-flash" style={vars(t)} d={t.d} strokeWidth={t.w * 2.2} />
        ))}
      </g>
      {/* ostré světelné čáry */}
      <g filter="url(#finale-soft)">
        {TRAILS.map((t, i) => (
          <path key={i} className="finale-flash" style={vars(t)} d={t.d} strokeWidth={t.w} />
        ))}
      </g>
      {/* jiskry */}
      {SPARKS.map((s, i) => (
        <g key={i} className="finale-flash" style={vars(s)} filter="url(#finale-soft)" strokeWidth="1.5">
          {RAYS.map((deg) => {
            const a = (deg * Math.PI) / 180;
            const len = s.r * (0.55 + ((deg * 7) % 10) / 20);
            return <line key={deg} x1={s.x} y1={s.y} x2={s.x + Math.cos(a) * len} y2={s.y + Math.sin(a) * len} />;
          })}
          <circle cx={s.x} cy={s.y} r="3" fill="#fff" stroke="none" />
        </g>
      ))}
    </svg>
  );
}
