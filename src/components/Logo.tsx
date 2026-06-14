// Logo EIKA – vektorová rekreace značky: nápis "Eika" v ozdobném rámečku (cedulce).
// Pozn.: pro 100% originál nahraj soubor do /public/logo.svg (nebo .png) a použij <img>.
// light=true → bílá varianta pro barevné/tmavé plochy.
export default function Logo({
  light = false,
  className = "h-10",
}: {
  light?: boolean;
  className?: string;
}) {
  const color = light ? "#ffffff" : "var(--color-accent)";
  return (
    <svg
      viewBox="0 0 260 108"
      className={className}
      role="img"
      aria-label="Eika"
      fill="none"
    >
      {/* Vnější ozdobný rámeček (cedulka) */}
      <path
        d="M40 8
           C28 8 22 14 21 26
           C16 34 16 40 18 46
           C16 52 16 58 21 66
           C22 82 28 92 40 100
           C120 96 140 96 220 100
           C232 92 238 82 239 66
           C244 58 244 52 242 46
           C244 40 244 34 239 26
           C238 14 232 8 220 8
           C140 12 120 12 40 8 Z"
        stroke={color}
        strokeWidth="6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Vnitřní linka */}
      <path
        d="M44 18
           C34 18 30 23 29 32
           C25 40 25 44 27 50
           C25 56 25 60 29 68
           C30 81 34 88 44 92
           C120 89 140 89 216 92
           C226 88 230 81 231 68
           C235 60 235 56 233 50
           C235 44 235 40 231 32
           C230 23 226 18 216 18
           C140 21 120 21 44 18 Z"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        opacity="0.85"
      />
      {/* Nápis Eika */}
      <text
        x="130"
        y="72"
        textAnchor="middle"
        fontFamily="'Arial Rounded MT Bold', 'Helvetica Rounded', system-ui, sans-serif"
        fontWeight="900"
        fontSize="50"
        letterSpacing="-1"
        fill={color}
      >
        Eika
      </text>
    </svg>
  );
}
