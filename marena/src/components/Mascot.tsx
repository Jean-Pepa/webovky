// Maskot Mařeny — „Mařenka". Folklórní figurína (à la Morana), kterou prváci nesou
// v průvodu až na Flédu, oblečená do oranžové vesty organizátora. Originální SVG,
// žádné externí obrázky. Škáluje se přes prop `size`.

export function Mascot({
  size = 220,
  className,
  wave = true,
}: {
  size?: number;
  className?: string;
  wave?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size * (260 / 220)}
      viewBox="0 0 220 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Maskot Mařeny — folklórní figurína v oranžové vestě"
    >
      <defs>
        <linearGradient id="dress" x1="0" y1="120" x2="0" y2="250" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f08a2b" />
          <stop offset="1" stopColor="#d65d12" />
        </linearGradient>
        <linearGradient id="burlap" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#f1ddc0" />
          <stop offset="1" stopColor="#e8cda3" />
        </linearGradient>
        <radialGradient id="cheek" cx="0.5" cy="0.5" r="0.5">
          <stop stopColor="#f4977f" />
          <stop offset="1" stopColor="#f4977f" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* tyč, na které je figurína nesena */}
      <rect x="105" y="40" width="10" height="205" rx="5" fill="#8a5a33" />
      <rect x="105" y="40" width="5" height="205" rx="2.5" fill="#a06f43" />

      {/* sláma vykukující ze spodku sukně */}
      <g stroke="#e0a93f" strokeWidth="4" strokeLinecap="round">
        <path d="M70 232 l-10 18" />
        <path d="M90 236 l-4 18" />
        <path d="M110 238 l2 18" />
        <path d="M132 236 l8 18" />
        <path d="M150 232 l12 17" />
      </g>

      {/* tělo / sukně (trapéz) */}
      <path d="M110 118 C150 122 168 150 178 232 L42 232 C52 150 70 122 110 118 Z" fill="url(#dress)" />
      {/* spodní vínový lem se vzorem */}
      <path d="M44 214 L176 214 C178 222 179 227 180 232 L40 232 C41 227 42 222 44 214 Z" fill="#5b2139" />
      <g fill="#f9c189">
        <circle cx="62" cy="224" r="3" />
        <circle cx="86" cy="225" r="3" />
        <circle cx="110" cy="225" r="3" />
        <circle cx="134" cy="225" r="3" />
        <circle cx="158" cy="224" r="3" />
      </g>

      {/* křížkové stehy na sukni (hadrová panenka) */}
      <g stroke="#5b2139" strokeWidth="2.2" strokeLinecap="round" opacity="0.7">
        <path d="M96 168 l8 8 M104 168 l-8 8" />
        <path d="M120 184 l8 8 M128 184 l-8 8" />
        <path d="M80 192 l8 8 M88 192 l-8 8" />
      </g>

      {/* oranžová vesta organizátora se sešikmenými pruhy */}
      <path d="M82 124 C92 120 128 120 138 124 L150 176 C130 184 90 184 70 176 Z" fill="#f5a14f" opacity="0.96" />
      <path d="M82 124 C92 120 128 120 138 124 L150 176 C130 184 90 184 70 176 Z" fill="none" stroke="#b14a12" strokeWidth="2" />
      <g stroke="#fbf6ec" strokeWidth="5" opacity="0.85">
        <path d="M80 150 L140 142" />
        <path d="M82 164 L146 156" />
      </g>

      {/* paže rozpažené na přivítání */}
      <g stroke="url(#burlap)" strokeWidth="13" strokeLinecap="round" fill="none">
        <path d="M86 138 C64 142 50 150 38 168" />
        <path d={wave ? "M134 138 C160 138 176 128 186 110" : "M134 138 C160 144 176 152 188 170"} />
      </g>
      {/* ruce */}
      <circle cx="36" cy="170" r="9" fill="#ecd2a8" stroke="#caa977" strokeWidth="2" />
      <circle cx={wave ? 188 : 190} cy={wave ? 108 : 172} r="9" fill="#ecd2a8" stroke="#caa977" strokeWidth="2" />

      {/* praporek v pravé ruce */}
      <g>
        <rect x="186" y="60" width="4" height="52" rx="2" fill="#8a5a33" />
        <path d="M190 62 L222 72 L190 84 Z" fill="#8d3458" />
        <text x="200" y="78" fontFamily="Fraunces, serif" fontSize="13" fontWeight="700" fill="#fbf6ec">M</text>
      </g>

      {/* krk */}
      <rect x="100" y="98" width="20" height="22" rx="8" fill="#ecd2a8" />

      {/* hlava */}
      <circle cx="110" cy="74" r="40" fill="url(#burlap)" stroke="#d8b98a" strokeWidth="2" />

      {/* sláma / vlasy kolem hlavy */}
      <g stroke="#e0a93f" strokeWidth="5" strokeLinecap="round">
        <path d="M74 58 l-16 -8" />
        <path d="M72 70 l-18 -1" />
        <path d="M74 84 l-17 7" />
        <path d="M146 58 l16 -8" />
        <path d="M148 70 l18 -1" />
        <path d="M146 84 l17 7" />
        <path d="M96 40 l-6 -16" />
        <path d="M124 40 l6 -16" />
        <path d="M110 38 l0 -18" />
      </g>

      {/* květinový věneček */}
      <g>
        <path d="M70 50 C84 36 136 36 150 50" stroke="#5c7a3a" strokeWidth="4" fill="none" strokeLinecap="round" />
        {[
          [74, 48],
          [92, 40],
          [110, 37],
          [128, 40],
          [146, 48],
        ].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="6" fill={i % 2 ? "#e8701a" : "#8d3458"} />
            <circle cx={x} cy={y} r="2.4" fill="#fbf6ec" />
          </g>
        ))}
      </g>

      {/* obličej */}
      <circle cx="95" cy="74" r="8" fill="url(#cheek)" />
      <circle cx="125" cy="74" r="8" fill="url(#cheek)" />
      {/* oči */}
      <g fill="#2a1d14">
        <circle cx="96" cy="68" r="4.4" />
        <circle cx="124" cy="68" r="4.4" />
      </g>
      <circle cx="97.4" cy="66.6" r="1.4" fill="#fff" />
      <circle cx="125.4" cy="66.6" r="1.4" fill="#fff" />
      {/* nos – stitch */}
      <path d="M110 74 l0 6" stroke="#caa977" strokeWidth="2.4" strokeLinecap="round" />
      {/* úsměv */}
      <path d="M98 86 C106 95 114 95 122 86" stroke="#a8466f" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}
