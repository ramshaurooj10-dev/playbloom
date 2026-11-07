import React from 'react';

// =========================================================================
// CLEAN 2D LINE-ART SVG ILLUSTRATIONS (EMPTY OUTLINES FOR COLORING)
// =========================================================================

interface SvgProps {
  className?: string;
  size?: number;
  strokeWidth?: number;
}

/** 1. Crisp Apple Line-Art (Blank inside for coloring) */
export const SvgAppleOutline: React.FC<SvgProps> = ({ size = 120, strokeWidth = 3, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Stem */}
    <path d="M50 22 C50 12, 58 8, 62 6" stroke="#0f172a" strokeWidth={strokeWidth} strokeLinecap="round" />
    {/* Leaf */}
    <path d="M52 18 C60 12, 70 14, 72 20 C64 24, 56 22, 52 18 Z" fill="#ffffff" stroke="#0f172a" strokeWidth={strokeWidth} strokeLinejoin="round" />
    {/* Apple Body */}
    <path
      d="M50 28 C42 20, 20 22, 16 42 C12 60, 26 88, 48 90 C50 90, 50 90, 52 90 C74 88, 88 60, 84 42 C80 22, 58 20, 50 28 Z"
      fill="#ffffff"
      stroke="#0f172a"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
  </svg>
);

/** 2. Smiling Sun Line-Art (Blank inside for coloring) */
export const SvgSunOutline: React.FC<SvgProps> = ({ size = 120, strokeWidth = 3, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Sun Center Circle */}
    <circle cx="50" cy="50" r="24" fill="#ffffff" stroke="#0f172a" strokeWidth={strokeWidth} />
    {/* Happy Eyes & Smile */}
    <circle cx="42" cy="46" r="2.5" fill="#0f172a" />
    <circle cx="58" cy="46" r="2.5" fill="#0f172a" />
    <path d="M42 54 C46 60, 54 60, 58 54" stroke="#0f172a" strokeWidth={strokeWidth - 0.5} strokeLinecap="round" />
    {/* Rays */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
      const rad = (angle * Math.PI) / 180;
      const x1 = 50 + Math.cos(rad) * 28;
      const y1 = 50 + Math.sin(rad) * 28;
      const x2 = 50 + Math.cos(rad) * 44;
      const y2 = 50 + Math.sin(rad) * 44;
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0f172a" strokeWidth={strokeWidth} strokeLinecap="round" />;
    })}
  </svg>
);

/** 3. Nature Leaf Line-Art */
export const SvgLeafOutline: React.FC<SvgProps> = ({ size = 100, strokeWidth = 3, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M20 80 C20 40, 50 15, 80 15 C80 45, 55 80, 20 80 Z"
      fill="#ffffff"
      stroke="#0f172a"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <path d="M20 80 Q50 50 80 15" stroke="#0f172a" strokeWidth={strokeWidth - 1} strokeLinecap="round" />
    <path d="M40 60 Q55 58 60 50" stroke="#0f172a" strokeWidth={strokeWidth - 1.5} strokeLinecap="round" />
    <path d="M50 45 Q65 42 70 35" stroke="#0f172a" strokeWidth={strokeWidth - 1.5} strokeLinecap="round" />
  </svg>
);

/** 4. Ocean Wave Line-Art */
export const SvgWaveOutline: React.FC<SvgProps> = ({ size = 100, strokeWidth = 3, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M10 65 C25 65, 30 35, 50 35 C70 35, 75 65, 90 65 L90 85 L10 85 Z"
      fill="#ffffff"
      stroke="#0f172a"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <path
      d="M10 45 C25 45, 30 15, 50 15 C70 15, 75 45, 90 45"
      stroke="#0f172a"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </svg>
);

/** 5. Playful Ball Line-Art */
export const SvgBallOutline: React.FC<SvgProps> = ({ size = 100, strokeWidth = 3, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="50" cy="50" r="42" fill="#ffffff" stroke="#0f172a" strokeWidth={strokeWidth} />
    <path d="M12 35 C35 35, 65 65, 65 88" stroke="#0f172a" strokeWidth={strokeWidth - 0.5} />
    <path d="M35 12 C35 35, 65 65, 88 65" stroke="#0f172a" strokeWidth={strokeWidth - 0.5} />
  </svg>
);

/** 6. Butterfly Line-Art (for color by number or symmetrical coloring) */
export const SvgButterflyOutline: React.FC<SvgProps> = ({ size = 120, strokeWidth = 3, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Body */}
    <ellipse cx="50" cy="52" rx="4" ry="24" fill="#ffffff" stroke="#0f172a" strokeWidth={strokeWidth} />
    <circle cx="50" cy="24" r="6" fill="#ffffff" stroke="#0f172a" strokeWidth={strokeWidth} />
    {/* Antennae */}
    <path d="M48 20 C42 12, 34 14, 36 8" stroke="#0f172a" strokeWidth={strokeWidth - 1} strokeLinecap="round" />
    <path d="M52 20 C58 12, 66 14, 64 8" stroke="#0f172a" strokeWidth={strokeWidth - 1} strokeLinecap="round" />
    {/* Left Top Wing */}
    <path d="M46 36 C24 16, 6 36, 20 60 C32 64, 44 56, 46 50 Z" fill="#ffffff" stroke="#0f172a" strokeWidth={strokeWidth} />
    {/* Right Top Wing */}
    <path d="M54 36 C76 16, 94 36, 80 60 C68 64, 56 56, 54 50 Z" fill="#ffffff" stroke="#0f172a" strokeWidth={strokeWidth} />
    {/* Left Bottom Wing */}
    <path d="M46 54 C30 58, 20 74, 32 86 C42 88, 48 76, 48 68 Z" fill="#ffffff" stroke="#0f172a" strokeWidth={strokeWidth} />
    {/* Right Bottom Wing */}
    <path d="M54 54 C70 58, 80 74, 68 86 C58 88, 52 76, 52 68 Z" fill="#ffffff" stroke="#0f172a" strokeWidth={strokeWidth} />
    {/* Wing Pattern Circles (Blank) */}
    <circle cx="28" cy="42" r="5" fill="#ffffff" stroke="#0f172a" strokeWidth={strokeWidth - 1} />
    <circle cx="72" cy="42" r="5" fill="#ffffff" stroke="#0f172a" strokeWidth={strokeWidth - 1} />
    <circle cx="36" cy="74" r="3.5" fill="#ffffff" stroke="#0f172a" strokeWidth={strokeWidth - 1} />
    <circle cx="64" cy="74" r="3.5" fill="#ffffff" stroke="#0f172a" strokeWidth={strokeWidth - 1} />
  </svg>
);

/** 7. Rainbow with Clouds Line-Art */
export const SvgRainbowOutline: React.FC<SvgProps> = ({ size = 140, strokeWidth = 3, className = '' }) => (
  <svg width={size} height={size * 0.7} viewBox="0 0 140 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Rainbow Arches */}
    <path d="M20 70 A50 50 0 0 1 120 70" stroke="#0f172a" strokeWidth={strokeWidth} fill="none" strokeLinecap="round" />
    <path d="M30 70 A40 40 0 0 1 110 70" stroke="#0f172a" strokeWidth={strokeWidth} fill="none" strokeLinecap="round" />
    <path d="M40 70 A30 30 0 0 1 100 70" stroke="#0f172a" strokeWidth={strokeWidth} fill="none" strokeLinecap="round" />
    <path d="M50 70 A20 20 0 0 1 90 70" stroke="#0f172a" strokeWidth={strokeWidth} fill="none" strokeLinecap="round" />
    {/* Left Cloud */}
    <path
      d="M12 76 C12 70, 18 66, 24 68 C28 62, 36 62, 40 68 C46 68, 50 74, 48 80 C48 86, 42 90, 36 90 L18 90 C12 90, 10 82, 12 76 Z"
      fill="#ffffff"
      stroke="#0f172a"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    {/* Right Cloud */}
    <path
      d="M92 76 C92 70, 98 66, 104 68 C108 62, 116 62, 120 68 C126 68, 130 74, 128 80 C128 86, 122 90, 116 90 L98 90 C92 90, 90 82, 92 76 Z"
      fill="#ffffff"
      stroke="#0f172a"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
  </svg>
);

/** 8. Empty Face Oval Outline (For child to draw eyes, nose, smile) */
export const SvgFaceOutline: React.FC<SvgProps> = ({ size = 160, strokeWidth = 3.5, className = '' }) => (
  <svg width={size} height={size * 1.1} viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Ears */}
    <circle cx="16" cy="55" r="9" fill="#ffffff" stroke="#0f172a" strokeWidth={strokeWidth} />
    <circle cx="84" cy="55" r="9" fill="#ffffff" stroke="#0f172a" strokeWidth={strokeWidth} />
    {/* Head Outline */}
    <ellipse cx="50" cy="55" rx="36" ry="44" fill="#ffffff" stroke="#0f172a" strokeWidth={strokeWidth} />
    {/* Simple Hairline Outline */}
    <path d="M22 36 C34 18, 66 18, 78 36" stroke="#0f172a" strokeWidth={strokeWidth} strokeLinecap="round" />
    <path d="M50 11 C42 22, 30 24, 22 36" stroke="#0f172a" strokeWidth={strokeWidth - 1} strokeLinecap="round" />
    <path d="M50 11 C58 22, 70 24, 78 36" stroke="#0f172a" strokeWidth={strokeWidth - 1} strokeLinecap="round" />
  </svg>
);

/** 9. Simple Outline Car */
export const SvgCarOutline: React.FC<SvgProps> = ({ size = 110, strokeWidth = 3, className = '' }) => (
  <svg width={size} height={size * 0.65} viewBox="0 0 100 65" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Body */}
    <path
      d="M10 42 L18 42 L24 22 L58 22 L72 34 L88 34 C92 34, 94 38, 92 44 L90 48 L10 48 Z"
      fill="#ffffff"
      stroke="#0f172a"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    {/* Window */}
    <path d="M28 26 L54 26 L54 36 L24 36 Z" fill="#ffffff" stroke="#0f172a" strokeWidth={strokeWidth - 1} />
    <path d="M58 26 L68 36 L58 36 Z" fill="#ffffff" stroke="#0f172a" strokeWidth={strokeWidth - 1} />
    {/* Wheels */}
    <circle cx="28" cy="48" r="9" fill="#ffffff" stroke="#0f172a" strokeWidth={strokeWidth} />
    <circle cx="28" cy="48" r="4" fill="#0f172a" />
    <circle cx="72" cy="48" r="9" fill="#ffffff" stroke="#0f172a" strokeWidth={strokeWidth} />
    <circle cx="72" cy="48" r="4" fill="#0f172a" />
  </svg>
);

/** 10. Simple Outline Duck */
export const SvgDuckOutline: React.FC<SvgProps> = ({ size = 100, strokeWidth = 3, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Body */}
    <path
      d="M30 45 C30 30, 50 20, 60 30 C66 36, 68 44, 62 48 C78 50, 88 62, 84 76 C80 88, 54 90, 36 84 C20 78, 16 62, 30 45 Z"
      fill="#ffffff"
      stroke="#0f172a"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    {/* Beak */}
    <path d="M64 34 L78 38 L64 42 Z" fill="#ffffff" stroke="#0f172a" strokeWidth={strokeWidth} />
    {/* Eye */}
    <circle cx="54" cy="32" r="2.5" fill="#0f172a" />
    {/* Wing outline */}
    <path d="M38 62 C46 56, 56 58, 62 66 C56 74, 44 74, 38 62 Z" fill="#ffffff" stroke="#0f172a" strokeWidth={strokeWidth - 1} />
  </svg>
);

/** 11. Simple Outline Flower */
export const SvgFlowerOutline: React.FC<SvgProps> = ({ size = 100, strokeWidth = 3, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Stem */}
    <path d="M50 50 L50 92" stroke="#0f172a" strokeWidth={strokeWidth} strokeLinecap="round" />
    {/* Leaf */}
    <path d="M50 72 C62 66, 70 70, 72 76 C66 82, 56 80, 50 72 Z" fill="#ffffff" stroke="#0f172a" strokeWidth={strokeWidth - 1} />
    {/* Petals */}
    <circle cx="50" cy="28" r="12" fill="#ffffff" stroke="#0f172a" strokeWidth={strokeWidth} />
    <circle cx="50" cy="64" r="12" fill="#ffffff" stroke="#0f172a" strokeWidth={strokeWidth} />
    <circle cx="32" cy="46" r="12" fill="#ffffff" stroke="#0f172a" strokeWidth={strokeWidth} />
    <circle cx="68" cy="46" r="12" fill="#ffffff" stroke="#0f172a" strokeWidth={strokeWidth} />
    {/* Center */}
    <circle cx="50" cy="46" r="10" fill="#ffffff" stroke="#0f172a" strokeWidth={strokeWidth} />
  </svg>
);

/** 12. Clean SVG Maze (Puppy to Bone) */
export const SvgPuppyMaze: React.FC<{ size?: number; className?: string }> = ({ size = 260, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Outer boundary */}
    <rect x="10" y="10" width="180" height="180" rx="12" fill="#ffffff" stroke="#0f172a" strokeWidth="4" />
    
    {/* Maze Walls (Wide open corridors for preschool pencil) */}
    {/* Top-left branch */}
    <path d="M10 60 L60 60 L60 110" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
    <path d="M60 35 L110 35 L110 80" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
    
    {/* Middle blockers */}
    <path d="M110 60 L160 60 L160 110" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
    <path d="M35 140 L35 110 L85 110" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
    <path d="M85 140 L85 170 L140 170" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
    <path d="M140 140 L190 140" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
    
    {/* Start and Finish markers */}
    <circle cx="35" cy="35" r="14" fill="#fbcfe8" stroke="#db2777" strokeWidth="2" />
    <text x="35" y="40" textAnchor="middle" fontSize="16">🐶</text>
    <text x="35" y="20" textAnchor="middle" fontSize="9" fontWeight="900" fill="#db2777">START</text>

    <circle cx="165" cy="165" r="14" fill="#dcfce7" stroke="#16a34a" strokeWidth="2" />
    <text x="165" y="170" textAnchor="middle" fontSize="16">🦴</text>
    <text x="165" y="190" textAnchor="middle" fontSize="9" fontWeight="900" fill="#16a34a">FINISH</text>
  </svg>
);

/** 13. Dot-to-Dot Star Outline (Numbered dots 1 to 8, lines uncompleted!) */
export const SvgDotToDotStar: React.FC<{ size?: number; className?: string }> = ({ size = 240, className = '' }) => {
  // 8 points for star dot-to-dot
  const dots = [
    { num: 1, x: 100, y: 20 },
    { num: 2, x: 125, y: 70 },
    { num: 3, x: 180, y: 75 },
    { num: 4, x: 140, y: 115 },
    { num: 5, x: 155, y: 175 },
    { num: 6, x: 100, y: 145 },
    { num: 7, x: 45, y: 175 },
    { num: 8, x: 60, y: 115 },
    { num: 9, x: 20, y: 75 },
    { num: 10, x: 75, y: 70 },
  ];

  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Light guide outline so child knows what to draw, or completely empty dots */}
      {dots.map((dot, idx) => (
        <g key={dot.num}>
          {/* Big touchable dot */}
          <circle cx={dot.x} cy={dot.y} r="5" fill="#0f172a" />
          {/* Number Label */}
          <circle cx={dot.x + (dot.x > 100 ? 12 : -12)} cy={dot.y + (dot.y > 100 ? 12 : -12)} r="9" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
          <text
            x={dot.x + (dot.x > 100 ? 12 : -12)}
            y={dot.y + (dot.y > 100 ? 15 : -9)}
            textAnchor="middle"
            fontSize="10"
            fontWeight="900"
            fill="#0f172a"
          >
            {dot.num}
          </text>
        </g>
      ))}
      <text x="100" y="105" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#94a3b8">
        Draw from 1 → 2 → 3 ... 10!
      </text>
    </svg>
  );
};
