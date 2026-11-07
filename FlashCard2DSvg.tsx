import React from 'react';

interface FlashCardSvgProps {
  type: string;
  className?: string;
  size?: number;
}

export const FlashCard2DSvg: React.FC<FlashCardSvgProps> = ({ type, size = 160, className = '' }) => {
  const s = size;

  switch (type) {
    // -----------------------------------------------------------------------
    // ABC / FRUITS / OBJECTS
    // -----------------------------------------------------------------------
    case 'apple':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <path d="M60 26 C60 14, 68 8, 74 6" stroke="#5c2d16" strokeWidth="4" strokeLinecap="round" />
          <path d="M62 20 C72 12, 84 16, 86 24 C76 28, 66 26, 62 20 Z" fill="#22c55e" stroke="#15803d" strokeWidth="2.5" />
          <path
            d="M60 32 C50 22, 22 24, 18 48 C14 72, 32 108, 58 110 C60 110, 60 110, 62 110 C88 108, 106 72, 102 48 C98 24, 70 22, 60 32 Z"
            fill="#ef4444"
            stroke="#b91c1c"
            strokeWidth="3.5"
          />
          {/* Gentle Highlight */}
          <path d="M30 46 C28 56, 32 70, 38 80" stroke="#fca5a5" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'ball':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <circle cx="60" cy="60" r="48" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="3.5" />
          {/* Swirl Stripes */}
          <path d="M60 12 C40 32, 40 88, 60 108" fill="#ef4444" stroke="#b91c1c" strokeWidth="3" />
          <path d="M60 12 C80 32, 80 88, 60 108" fill="#eab308" stroke="#ca8a04" strokeWidth="3" />
          <circle cx="60" cy="60" r="14" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" />
          <circle cx="42" cy="40" r="4" fill="#ffffff" opacity="0.8" />
        </svg>
      );

    case 'cat':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          {/* Ears */}
          <polygon points="30,52 24,18 52,38" fill="#f59e0b" stroke="#b45309" strokeWidth="3" strokeLinejoin="round" />
          <polygon points="32,46 28,24 46,38" fill="#fbcfe8" />
          <polygon points="90,52 96,18 68,38" fill="#f59e0b" stroke="#b45309" strokeWidth="3" strokeLinejoin="round" />
          <polygon points="88,46 92,24 74,38" fill="#fbcfe8" />
          {/* Head */}
          <circle cx="60" cy="64" r="38" fill="#fbbf24" stroke="#b45309" strokeWidth="3.5" />
          {/* Eyes */}
          <ellipse cx="46" cy="58" rx="5" ry="7" fill="#0f172a" />
          <circle cx="44" cy="56" r="2" fill="#ffffff" />
          <ellipse cx="74" cy="58" rx="5" ry="7" fill="#0f172a" />
          <circle cx="72" cy="56" r="2" fill="#ffffff" />
          {/* Nose & Mouth */}
          <polygon points="56,68 64,68 60,73" fill="#f43f5e" />
          <path d="M54 75 C57 78, 60 78, 60 74 C60 78, 63 78, 66 75" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
          {/* Whiskers */}
          <line x1="22" y1="66" x2="40" y2="69" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="22" y1="76" x2="40" y2="74" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="98" y1="66" x2="80" y2="69" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="98" y1="76" x2="80" y2="74" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'dog':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          {/* Floppy Ears */}
          <ellipse cx="28" cy="56" rx="14" ry="26" fill="#b45309" stroke="#78350f" strokeWidth="3" transform="rotate(-15 28 56)" />
          <ellipse cx="92" cy="56" rx="14" ry="26" fill="#b45309" stroke="#78350f" strokeWidth="3" transform="rotate(15 92 56)" />
          {/* Head */}
          <circle cx="60" cy="62" r="36" fill="#f59e0b" stroke="#78350f" strokeWidth="3.5" />
          {/* Patch */}
          <ellipse cx="44" cy="54" rx="14" ry="16" fill="#d97706" opacity="0.6" />
          {/* Eyes */}
          <circle cx="44" cy="54" r="5" fill="#0f172a" />
          <circle cx="43" cy="52" r="2" fill="#ffffff" />
          <circle cx="76" cy="54" r="5" fill="#0f172a" />
          <circle cx="75" cy="52" r="2" fill="#ffffff" />
          {/* Snout */}
          <ellipse cx="60" cy="74" rx="16" ry="12" fill="#fef3c7" stroke="#78350f" strokeWidth="2" />
          <ellipse cx="60" cy="68" rx="6" ry="4" fill="#0f172a" />
          <path d="M60 72 L60 78 M54 78 C57 82, 63 82, 66 78" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'elephant':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          {/* Big Ears */}
          <circle cx="28" cy="58" r="24" fill="#94a3b8" stroke="#475569" strokeWidth="3" />
          <circle cx="28" cy="58" r="16" fill="#fbcfe8" />
          <circle cx="92" cy="58" r="24" fill="#94a3b8" stroke="#475569" strokeWidth="3" />
          <circle cx="92" cy="58" r="16" fill="#fbcfe8" />
          {/* Head */}
          <circle cx="60" cy="62" r="34" fill="#cbd5e1" stroke="#475569" strokeWidth="3.5" />
          {/* Trunk */}
          <path
            d="M54 72 C54 88, 62 104, 76 100 C82 98, 80 90, 72 90 C66 90, 62 82, 64 72"
            fill="#cbd5e1"
            stroke="#475569"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Eyes */}
          <circle cx="46" cy="56" r="4.5" fill="#0f172a" />
          <circle cx="45" cy="54" r="1.5" fill="#ffffff" />
          <circle cx="74" cy="56" r="4.5" fill="#0f172a" />
          <circle cx="73" cy="54" r="1.5" fill="#ffffff" />
        </svg>
      );

    case 'fish':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          {/* Tail */}
          <polygon points="20,38 48,60 20,82" fill="#38bdf8" stroke="#0284c7" strokeWidth="3" strokeLinejoin="round" />
          {/* Body */}
          <ellipse cx="68" cy="60" rx="38" ry="26" fill="#0284c7" stroke="#0369a1" strokeWidth="3.5" />
          {/* Stripes */}
          <path d="M60 36 Q68 60 60 84" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M74 38 Q82 60 74 82" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" fill="none" />
          {/* Eye */}
          <circle cx="90" cy="54" r="6" fill="#ffffff" />
          <circle cx="92" cy="54" r="3.5" fill="#0f172a" />
          <circle cx="93" cy="52" r="1.2" fill="#ffffff" />
        </svg>
      );

    case 'grapes':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          {/* Stem & Leaf */}
          <path d="M60 28 C60 14, 66 10, 72 8" stroke="#5c2d16" strokeWidth="4" strokeLinecap="round" />
          <path d="M62 22 C74 16, 84 20, 86 28 C74 30, 66 26, 62 22 Z" fill="#22c55e" stroke="#15803d" strokeWidth="2.5" />
          {/* Grapes cluster */}
          {[
            { cx: 46, cy: 44 },
            { cx: 62, cy: 42 },
            { cx: 76, cy: 46 },
            { cx: 38, cy: 60 },
            { cx: 54, cy: 58 },
            { cx: 70, cy: 58 },
            { cx: 84, cy: 62 },
            { cx: 46, cy: 74 },
            { cx: 62, cy: 74 },
            { cx: 76, cy: 76 },
            { cx: 54, cy: 90 },
            { cx: 68, cy: 90 },
            { cx: 60, cy: 102 },
          ].map((g, i) => (
            <circle key={i} cx={g.cx} cy={g.cy} r="11" fill="#9333ea" stroke="#6b21a8" strokeWidth="2.5" />
          ))}
        </svg>
      );

    case 'hat':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          {/* Brim */}
          <ellipse cx="60" cy="84" rx="48" ry="14" fill="#f59e0b" stroke="#b45309" strokeWidth="3" />
          {/* Crown */}
          <path
            d="M32 80 C34 44, 42 36, 60 36 C78 36, 86 44, 88 80 Z"
            fill="#fbbf24"
            stroke="#b45309"
            strokeWidth="3.5"
          />
          {/* Ribbon */}
          <path d="M33 74 C45 78, 75 78, 87 74 L88 80 C75 84, 45 84, 32 80 Z" fill="#ef4444" />
        </svg>
      );

    case 'igloo':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          {/* Dome */}
          <path d="M20 90 A40 40 0 0 1 100 90 Z" fill="#e0f2fe" stroke="#0284c7" strokeWidth="3.5" />
          {/* Block lines */}
          <path d="M26 72 Q60 62 94 72" stroke="#38bdf8" strokeWidth="2.5" fill="none" />
          <path d="M36 54 Q60 48 84 54" stroke="#38bdf8" strokeWidth="2.5" fill="none" />
          {/* Door */}
          <path d="M48 90 A12 12 0 0 1 72 90 Z" fill="#0f172a" stroke="#0284c7" strokeWidth="3" />
        </svg>
      );

    case 'jellyfish':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          {/* Bell */}
          <path d="M26 62 A34 32 0 0 1 94 62 C88 66, 80 64, 74 62 C68 64, 60 66, 54 62 C48 64, 40 66, 34 62 C30 64, 28 64, 26 62 Z" fill="#f472b6" stroke="#db2777" strokeWidth="3" />
          {/* Cute Eyes */}
          <circle cx="48" cy="48" r="4" fill="#0f172a" />
          <circle cx="72" cy="48" r="4" fill="#0f172a" />
          <path d="M56 54 Q60 58 64 54" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" fill="none" />
          {/* Tentacles */}
          <path d="M36 64 Q32 84 40 104" stroke="#ec4899" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M50 64 Q56 84 48 106" stroke="#f43f5e" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M68 64 Q62 84 70 106" stroke="#f43f5e" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M82 64 Q86 84 78 104" stroke="#ec4899" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'kite':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <polygon points="60,14 96,52 60,94 24,52" fill="#06b6d4" stroke="#0891b2" strokeWidth="3.5" strokeLinejoin="round" />
          <polygon points="60,14 96,52 60,52" fill="#f59e0b" />
          <polygon points="60,52 24,52 60,94" fill="#ef4444" />
          <line x1="60" y1="14" x2="60" y2="94" stroke="#ffffff" strokeWidth="2" />
          <line x1="24" y1="52" x2="96" y2="52" stroke="#ffffff" strokeWidth="2" />
          {/* Tail */}
          <path d="M60 94 Q70 104 64 114" stroke="#0f172a" strokeWidth="2" fill="none" />
          <polygon points="64,104 70,102 68,108" fill="#f43f5e" />
          <polygon points="64,112 58,110 60,116" fill="#eab308" />
        </svg>
      );

    case 'lion':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          {/* Big Mane */}
          <circle cx="60" cy="60" r="44" fill="#d97706" stroke="#92400e" strokeWidth="3" />
          {/* Head */}
          <circle cx="60" cy="62" r="30" fill="#fcd34d" stroke="#b45309" strokeWidth="3" />
          {/* Ears */}
          <circle cx="40" cy="38" r="8" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
          <circle cx="80" cy="38" r="8" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
          {/* Eyes */}
          <circle cx="48" cy="56" r="4.5" fill="#0f172a" />
          <circle cx="72" cy="56" r="4.5" fill="#0f172a" />
          {/* Snout */}
          <polygon points="56,66 64,66 60,71" fill="#78350f" />
          <path d="M55 72 Q60 76 65 72" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'monkey':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          {/* Big Ears */}
          <circle cx="28" cy="60" r="16" fill="#92400e" stroke="#78350f" strokeWidth="3" />
          <circle cx="28" cy="60" r="10" fill="#fed7aa" />
          <circle cx="92" cy="60" r="16" fill="#92400e" stroke="#78350f" strokeWidth="3" />
          <circle cx="92" cy="60" r="10" fill="#fed7aa" />
          {/* Head */}
          <circle cx="60" cy="60" r="34" fill="#a16207" stroke="#78350f" strokeWidth="3.5" />
          {/* Face mask */}
          <ellipse cx="48" cy="54" rx="14" ry="16" fill="#ffedd5" />
          <ellipse cx="72" cy="54" rx="14" ry="16" fill="#ffedd5" />
          <ellipse cx="60" cy="70" rx="22" ry="16" fill="#ffedd5" stroke="#78350f" strokeWidth="2" />
          {/* Eyes & Smile */}
          <circle cx="48" cy="52" r="4.5" fill="#0f172a" />
          <circle cx="72" cy="52" r="4.5" fill="#0f172a" />
          <circle cx="56" cy="66" r="2" fill="#78350f" />
          <circle cx="64" cy="66" r="2" fill="#78350f" />
          <path d="M50 74 Q60 82 70 74" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'nest':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          {/* Eggs */}
          <ellipse cx="50" cy="50" rx="10" ry="14" fill="#bae6fd" stroke="#0284c7" strokeWidth="2" transform="rotate(-15 50 50)" />
          <ellipse cx="70" cy="50" rx="10" ry="14" fill="#bae6fd" stroke="#0284c7" strokeWidth="2" transform="rotate(15 70 50)" />
          <ellipse cx="60" cy="46" rx="9" ry="13" fill="#bae6fd" stroke="#0284c7" strokeWidth="2" />
          {/* Twig Nest Bowl */}
          <path d="M22 60 C22 92, 98 92, 98 60 C86 70, 34 70, 22 60 Z" fill="#92400e" stroke="#78350f" strokeWidth="3" />
          <path d="M20 62 L100 62 M26 72 L94 72 M34 82 L86 82" stroke="#b45309" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'orange':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <circle cx="60" cy="64" r="42" fill="#f97316" stroke="#c2410c" strokeWidth="3.5" />
          {/* Dimple textures */}
          <circle cx="44" cy="52" r="2" fill="#ea580c" />
          <circle cx="76" cy="58" r="2" fill="#ea580c" />
          <circle cx="58" cy="80" r="2" fill="#ea580c" />
          {/* Leaf & Stem */}
          <path d="M60 22 C60 14, 62 10, 64 6" stroke="#5c2d16" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M62 18 C74 12, 84 16, 86 24 C74 26, 64 22, 62 18 Z" fill="#22c55e" stroke="#15803d" strokeWidth="2" />
        </svg>
      );

    case 'pencil':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          {/* Eraser */}
          <rect x="50" y="10" width="20" height="16" rx="4" fill="#fb7185" stroke="#e11d48" strokeWidth="2.5" />
          {/* Metal Band */}
          <rect x="50" y="24" width="20" height="8" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
          {/* Body */}
          <rect x="50" y="32" width="20" height="54" fill="#fbbf24" stroke="#b45309" strokeWidth="2.5" />
          <line x1="57" y1="32" x2="57" y2="86" stroke="#f59e0b" strokeWidth="2" />
          <line x1="63" y1="32" x2="63" y2="86" stroke="#f59e0b" strokeWidth="2" />
          {/* Tip */}
          <polygon points="50,86 70,86 60,110" fill="#fed7aa" stroke="#b45309" strokeWidth="2" />
          <polygon points="56,100 64,100 60,110" fill="#0f172a" />
        </svg>
      );

    case 'queen_crown':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <polygon points="20,84 28,38 48,60 60,28 72,60 92,38 100,84" fill="#eab308" stroke="#a16207" strokeWidth="3.5" strokeLinejoin="round" />
          <rect x="20" y="84" width="80" height="14" rx="4" fill="#ca8a04" stroke="#a16207" strokeWidth="3" />
          {/* Jewels */}
          <circle cx="28" cy="38" r="4" fill="#ef4444" />
          <circle cx="60" cy="28" r="5" fill="#3b82f6" />
          <circle cx="92" cy="38" r="4" fill="#ef4444" />
          <circle cx="40" cy="91" r="3.5" fill="#22c55e" />
          <circle cx="60" cy="91" r="3.5" fill="#ec4899" />
          <circle cx="80" cy="91" r="3.5" fill="#22c55e" />
        </svg>
      );

    case 'rabbit':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          {/* Long Ears */}
          <ellipse cx="44" cy="32" rx="10" ry="24" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" />
          <ellipse cx="44" cy="32" rx="6" ry="18" fill="#fbcfe8" />
          <ellipse cx="76" cy="32" rx="10" ry="24" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" />
          <ellipse cx="76" cy="32" rx="6" ry="18" fill="#fbcfe8" />
          {/* Head */}
          <circle cx="60" cy="68" r="32" fill="#ffffff" stroke="#cbd5e1" strokeWidth="3.5" />
          {/* Eyes */}
          <circle cx="48" cy="62" r="4.5" fill="#0f172a" />
          <circle cx="47" cy="60" r="1.5" fill="#ffffff" />
          <circle cx="72" cy="62" r="4.5" fill="#0f172a" />
          <circle cx="71" cy="60" r="1.5" fill="#ffffff" />
          {/* Nose & Mouth */}
          <polygon points="57,70 63,70 60,74" fill="#f43f5e" />
          <path d="M55 75 Q60 78 65 75" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" fill="none" />
          {/* Whiskers */}
          <line x1="28" y1="70" x2="44" y2="72" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          <line x1="92" y1="70" x2="76" y2="72" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'sun':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <circle cx="60" cy="60" r="30" fill="#f59e0b" stroke="#d97706" strokeWidth="3.5" />
          <circle cx="50" cy="54" r="3.5" fill="#0f172a" />
          <circle cx="70" cy="54" r="3.5" fill="#0f172a" />
          <path d="M52 64 Q60 72 68 64" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Rays */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = 60 + Math.cos(rad) * 36;
            const y1 = 60 + Math.sin(rad) * 36;
            const x2 = 60 + Math.cos(rad) * 52;
            const y2 = 60 + Math.sin(rad) * 52;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#f59e0b" strokeWidth="4.5" strokeLinecap="round" />;
          })}
        </svg>
      );

    case 'tree':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          {/* Trunk */}
          <rect x="52" y="74" width="16" height="36" rx="3" fill="#78350f" stroke="#451a03" strokeWidth="3" />
          {/* Foliage Clouds */}
          <circle cx="60" cy="42" r="28" fill="#22c55e" stroke="#15803d" strokeWidth="3.5" />
          <circle cx="42" cy="58" r="22" fill="#16a34a" stroke="#15803d" strokeWidth="3.5" />
          <circle cx="78" cy="58" r="22" fill="#16a34a" stroke="#15803d" strokeWidth="3.5" />
        </svg>
      );

    case 'umbrella':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          {/* Canopy */}
          <path d="M16 68 A44 40 0 0 1 104 68 C92 72, 80 68, 68 72 C56 68, 44 72, 32 68 C24 72, 18 70, 16 68 Z" fill="#0284c7" stroke="#0369a1" strokeWidth="3.5" />
          <path d="M16 68 A44 40 0 0 1 60 28 Q44 50 32 68 Z" fill="#38bdf8" opacity="0.6" />
          <path d="M104 68 A44 40 0 0 0 60 28 Q76 50 88 68 Z" fill="#38bdf8" opacity="0.6" />
          {/* Stick & Hook */}
          <path d="M60 24 L60 92 C60 102, 48 102, 48 94" stroke="#5c2d16" strokeWidth="4" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'violin':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          {/* Neck */}
          <rect x="56" y="8" width="8" height="42" fill="#78350f" stroke="#451a03" strokeWidth="2" />
          {/* Body */}
          <path
            d="M40 48 C30 54, 30 68, 42 74 C30 80, 30 96, 44 104 C54 110, 66 110, 76 104 C90 96, 90 80, 78 74 C90 68, 90 54, 80 48 Z"
            fill="#d97706"
            stroke="#92400e"
            strokeWidth="3.5"
          />
          {/* F-holes */}
          <circle cx="48" cy="74" r="2.5" fill="#451a03" />
          <circle cx="72" cy="74" r="2.5" fill="#451a03" />
          {/* Strings */}
          <line x1="58" y1="12" x2="58" y2="100" stroke="#fef08a" strokeWidth="1.5" />
          <line x1="62" y1="12" x2="62" y2="100" stroke="#fef08a" strokeWidth="1.5" />
        </svg>
      );

    case 'watermelon':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          {/* Green Rind */}
          <path d="M16 48 A48 48 0 0 0 104 48 Z" fill="#15803d" stroke="#166534" strokeWidth="3.5" />
          {/* White layer */}
          <path d="M22 48 A42 42 0 0 0 98 48 Z" fill="#f0fdf4" />
          {/* Red Flesh */}
          <path d="M26 48 A38 38 0 0 0 94 48 Z" fill="#ef4444" />
          {/* Seeds */}
          <ellipse cx="44" cy="58" rx="2" ry="3.5" fill="#0f172a" />
          <ellipse cx="60" cy="68" rx="2" ry="3.5" fill="#0f172a" />
          <ellipse cx="76" cy="58" rx="2" ry="3.5" fill="#0f172a" />
          <ellipse cx="60" cy="54" rx="2" ry="3.5" fill="#0f172a" />
        </svg>
      );

    case 'xylophone':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          {/* Frame */}
          <polygon points="20,36 100,24 100,94 20,82" fill="#fef3c7" stroke="#b45309" strokeWidth="2.5" />
          {/* Bars */}
          <rect x="24" y="28" width="10" height="60" rx="3" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" />
          <rect x="38" y="32" width="10" height="54" rx="3" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" />
          <rect x="52" y="36" width="10" height="48" rx="3" fill="#eab308" stroke="#a16207" strokeWidth="1.5" />
          <rect x="66" y="40" width="10" height="42" rx="3" fill="#22c55e" stroke="#15803d" strokeWidth="1.5" />
          <rect x="80" y="44" width="10" height="36" rx="3" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1.5" />
          <rect x="94" y="48" width="8" height="30" rx="3" fill="#a855f7" stroke="#7e22ce" strokeWidth="1.5" />
          {/* Mallet */}
          <line x1="30" y1="104" x2="80" y2="70" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
          <circle cx="82" cy="68" r="6" fill="#f43f5e" stroke="#be123c" strokeWidth="2" />
        </svg>
      );

    case 'yoyo':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          {/* String */}
          <path d="M60 14 Q58 36 60 54" stroke="#cbd5e1" strokeWidth="2.5" strokeDasharray="3 3" fill="none" />
          <circle cx="60" cy="14" r="3" fill="#94a3b8" />
          {/* Body */}
          <ellipse cx="60" cy="68" rx="36" ry="34" fill="#0d9488" stroke="#0f766e" strokeWidth="3.5" />
          <ellipse cx="60" cy="68" rx="24" ry="22" fill="#2dd4bf" />
          <circle cx="60" cy="68" r="8" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
        </svg>
      );

    case 'zebra':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          {/* Ears */}
          <polygon points="34,44 32,18 50,34" fill="#ffffff" stroke="#0f172a" strokeWidth="3" />
          <polygon points="86,44 88,18 70,34" fill="#ffffff" stroke="#0f172a" strokeWidth="3" />
          {/* Head */}
          <ellipse cx="60" cy="62" rx="32" ry="36" fill="#ffffff" stroke="#0f172a" strokeWidth="3.5" />
          {/* Zebra Stripes */}
          <path d="M30 50 L46 56 M30 62 L44 66 M90 50 L74 56 M90 62 L76 66 M60 30 L60 44" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
          {/* Eyes */}
          <circle cx="46" cy="56" r="4.5" fill="#0f172a" />
          <circle cx="74" cy="56" r="4.5" fill="#0f172a" />
          {/* Muzzle */}
          <ellipse cx="60" cy="80" rx="16" ry="12" fill="#334155" />
          <circle cx="54" cy="80" r="2" fill="#ffffff" />
          <circle cx="66" cy="80" r="2" fill="#ffffff" />
        </svg>
      );

    // -----------------------------------------------------------------------
    // NUMBERS & COUNTING (1 TO 10 VISUAL ARRAYS)
    // -----------------------------------------------------------------------
    case 'count_1':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <circle cx="60" cy="60" r="32" fill="#ef4444" stroke="#b91c1c" strokeWidth="3.5" />
          <text x="60" y="72" textAnchor="middle" fill="#ffffff" fontSize="36" fontWeight="900">1</text>
        </svg>
      );

    case 'count_2':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <circle cx="40" cy="60" r="22" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="3" />
          <circle cx="80" cy="60" r="22" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="3" />
          <text x="40" y="68" textAnchor="middle" fill="#ffffff" fontSize="20" fontWeight="900">1</text>
          <text x="80" y="68" textAnchor="middle" fill="#ffffff" fontSize="20" fontWeight="900">2</text>
        </svg>
      );

    case 'count_3':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <circle cx="60" cy="36" r="18" fill="#eab308" stroke="#a16207" strokeWidth="2.5" />
          <circle cx="38" cy="78" r="18" fill="#eab308" stroke="#a16207" strokeWidth="2.5" />
          <circle cx="82" cy="78" r="18" fill="#eab308" stroke="#a16207" strokeWidth="2.5" />
          <text x="60" y="43" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="900">1</text>
          <text x="38" y="85" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="900">2</text>
          <text x="82" y="85" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="900">3</text>
        </svg>
      );

    case 'count_4':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <polygon points="38,20 44,34 58,34 47,44 51,58 38,48 26,58 30,44 19,34 33,34" fill="#10b981" stroke="#047857" strokeWidth="2" />
          <polygon points="82,20 88,34 102,34 91,44 95,58 82,48 70,58 74,44 63,34 77,34" fill="#10b981" stroke="#047857" strokeWidth="2" />
          <polygon points="38,64 44,78 58,78 47,88 51,102 38,92 26,102 30,88 19,78 33,78" fill="#10b981" stroke="#047857" strokeWidth="2" />
          <polygon points="82,64 88,78 102,78 91,88 95,102 82,92 70,102 74,88 63,78 77,78" fill="#10b981" stroke="#047857" strokeWidth="2" />
        </svg>
      );

    case 'count_5':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          {[
            { cx: 34, cy: 34 },
            { cx: 86, cy: 34 },
            { cx: 60, cy: 60 },
            { cx: 34, cy: 86 },
            { cx: 86, cy: 86 },
          ].map((pos, i) => (
            <circle key={i} cx={pos.cx} cy={pos.cy} r="14" fill="#a855f7" stroke="#7e22ce" strokeWidth="2.5" />
          ))}
        </svg>
      );

    case 'count_6':
    case 'count_7':
    case 'count_8':
    case 'count_9':
    case 'count_10': {
      const count = parseInt(type.replace('count_', ''), 10);
      const cols = count >= 9 ? 3 : count >= 6 ? 3 : 2;
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          {Array.from({ length: count }).map((_, i) => {
            const row = Math.floor(i / cols);
            const col = i % cols;
            const cx = cols === 3 ? 30 + col * 30 : 40 + col * 40;
            const cy = 25 + row * 24;
            return <circle key={i} cx={cx} cy={cy} r="9" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />;
          })}
        </svg>
      );
    }

    // -----------------------------------------------------------------------
    // SHAPES
    // -----------------------------------------------------------------------
    case 'shape_circle':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <circle cx="60" cy="60" r="44" fill="#f43f5e" stroke="#be123c" strokeWidth="4" />
        </svg>
      );

    case 'shape_square':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <rect x="22" y="22" width="76" height="76" rx="8" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="4" />
        </svg>
      );

    case 'shape_triangle':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <polygon points="60,18 104,96 16,96" fill="#eab308" stroke="#a16207" strokeWidth="4" strokeLinejoin="round" />
        </svg>
      );

    case 'shape_rectangle':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <rect x="16" y="32" width="88" height="56" rx="8" fill="#10b981" stroke="#047857" strokeWidth="4" />
        </svg>
      );

    case 'shape_oval':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <ellipse cx="60" cy="60" rx="34" ry="46" fill="#a855f7" stroke="#7e22ce" strokeWidth="4" />
        </svg>
      );

    case 'shape_star':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <polygon
            points="60,14 73,44 106,46 80,68 88,100 60,82 32,100 40,68 14,46 47,44"
            fill="#fbbf24"
            stroke="#b45309"
            strokeWidth="4"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'shape_heart':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <path
            d="M60 102 C20 72, 14 42, 34 26 C48 14, 58 24, 60 30 C62 24, 72 14, 86 26 C106 42, 100 72, 60 102 Z"
            fill="#ec4899"
            stroke="#be185d"
            strokeWidth="4"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'shape_diamond':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <polygon points="60,14 104,60 60,106 16,60" fill="#06b6d4" stroke="#0891b2" strokeWidth="4" strokeLinejoin="round" />
        </svg>
      );

    // -----------------------------------------------------------------------
    // COLORS
    // -----------------------------------------------------------------------
    case 'color_red':
    case 'color_blue':
    case 'color_yellow':
    case 'color_green':
    case 'color_orange':
    case 'color_purple':
    case 'color_pink':
    case 'color_brown':
    case 'color_black':
    case 'color_white': {
      const colorMap: Record<string, { fill: string; border: string }> = {
        color_red: { fill: '#ef4444', border: '#b91c1c' },
        color_blue: { fill: '#3b82f6', border: '#1d4ed8' },
        color_yellow: { fill: '#eab308', border: '#a16207' },
        color_green: { fill: '#22c55e', border: '#15803d' },
        color_orange: { fill: '#f97316', border: '#c2410c' },
        color_purple: { fill: '#a855f7', border: '#7e22ce' },
        color_pink: { fill: '#ec4899', border: '#be185d' },
        color_brown: { fill: '#854d0e', border: '#533007' },
        color_black: { fill: '#1e293b', border: '#0f172a' },
        color_white: { fill: '#f8fafc', border: '#cbd5e1' },
      };
      const col = colorMap[type] || { fill: '#ef4444', border: '#b91c1c' };
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          {/* Paint Splat / Swatch Disc */}
          <circle cx="60" cy="60" r="42" fill={col.fill} stroke={col.border} strokeWidth="4" />
          <circle cx="46" cy="46" r="8" fill="#ffffff" opacity={type === 'color_white' ? '0' : '0.4'} />
        </svg>
      );
    }

    // -----------------------------------------------------------------------
    // ANIMALS
    // -----------------------------------------------------------------------
    case 'bear':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <circle cx="34" cy="40" r="14" fill="#92400e" stroke="#78350f" strokeWidth="3" />
          <circle cx="34" cy="40" r="8" fill="#fcd34d" />
          <circle cx="86" cy="40" r="14" fill="#92400e" stroke="#78350f" strokeWidth="3" />
          <circle cx="86" cy="40" r="8" fill="#fcd34d" />
          <circle cx="60" cy="66" r="36" fill="#a16207" stroke="#78350f" strokeWidth="3.5" />
          <circle cx="48" cy="58" r="4.5" fill="#0f172a" />
          <circle cx="72" cy="58" r="4.5" fill="#0f172a" />
          <ellipse cx="60" cy="74" rx="16" ry="12" fill="#fef3c7" />
          <ellipse cx="60" cy="70" rx="6" ry="4" fill="#0f172a" />
          <path d="M54 78 Q60 82 66 78" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'cow':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <path d="M28 32 C28 20, 36 22, 40 32" stroke="#d97706" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M92 32 C92 20, 84 22, 80 32" stroke="#d97706" strokeWidth="4" strokeLinecap="round" fill="none" />
          <circle cx="60" cy="58" r="32" fill="#ffffff" stroke="#0f172a" strokeWidth="3.5" />
          <path d="M42 42 Q50 36 56 46 Q46 54 42 42 Z" fill="#0f172a" />
          <circle cx="46" cy="52" r="4" fill="#0f172a" />
          <circle cx="74" cy="52" r="4" fill="#0f172a" />
          <ellipse cx="60" cy="74" rx="22" ry="14" fill="#fbcfe8" stroke="#db2777" strokeWidth="2" />
          <circle cx="52" cy="74" r="3" fill="#be185d" />
          <circle cx="68" cy="74" r="3" fill="#be185d" />
        </svg>
      );

    case 'horse':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <polygon points="40,46 36,20 54,36" fill="#b45309" stroke="#78350f" strokeWidth="2.5" />
          <polygon points="68,46 72,20 54,36" fill="#b45309" stroke="#78350f" strokeWidth="2.5" />
          <ellipse cx="54" cy="62" rx="26" ry="34" fill="#d97706" stroke="#78350f" strokeWidth="3" />
          <ellipse cx="54" cy="80" rx="18" ry="14" fill="#fed7aa" stroke="#78350f" strokeWidth="2" />
          <circle cx="44" cy="54" r="4" fill="#0f172a" />
          <circle cx="64" cy="54" r="4" fill="#0f172a" />
          <circle cx="48" cy="80" r="2.5" fill="#78350f" />
          <circle cx="60" cy="80" r="2.5" fill="#78350f" />
          <path d="M38 32 Q32 50 34 68" stroke="#78350f" strokeWidth="5" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'giraffe':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <line x1="46" y1="36" x2="44" y2="20" stroke="#b45309" strokeWidth="3" strokeLinecap="round" />
          <circle cx="44" cy="18" r="3" fill="#92400e" />
          <line x1="74" y1="36" x2="76" y2="20" stroke="#b45309" strokeWidth="3" strokeLinecap="round" />
          <circle cx="76" cy="18" r="3" fill="#92400e" />
          <ellipse cx="60" cy="54" rx="26" ry="30" fill="#fcd34d" stroke="#b45309" strokeWidth="3" />
          <rect x="52" y="74" width="16" height="38" fill="#fcd34d" stroke="#b45309" strokeWidth="3" />
          <circle cx="56" cy="90" r="4" fill="#b45309" />
          <circle cx="62" cy="102" r="3.5" fill="#b45309" />
          <circle cx="48" cy="48" r="4" fill="#0f172a" />
          <circle cx="72" cy="48" r="4" fill="#0f172a" />
          <ellipse cx="60" cy="66" rx="14" ry="10" fill="#fed7aa" />
          <circle cx="55" cy="66" r="1.5" fill="#78350f" />
          <circle cx="65" cy="66" r="1.5" fill="#78350f" />
        </svg>
      );

    case 'tiger':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <circle cx="32" cy="38" r="12" fill="#ea580c" stroke="#9a3412" strokeWidth="2.5" />
          <circle cx="88" cy="38" r="12" fill="#ea580c" stroke="#9a3412" strokeWidth="2.5" />
          <circle cx="60" cy="62" r="36" fill="#f97316" stroke="#9a3412" strokeWidth="3.5" />
          <path d="M60 28 L60 40 M32 54 L44 58 M88 54 L76 58 M36 68 L48 68 M84 68 L72 68" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
          <circle cx="46" cy="56" r="4.5" fill="#0f172a" />
          <circle cx="74" cy="56" r="4.5" fill="#0f172a" />
          <polygon points="56,66 64,66 60,71" fill="#f43f5e" />
          <path d="M54 74 Q60 78 66 74" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'sheep':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <circle cx="40" cy="46" r="16" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2.5" />
          <circle cx="80" cy="46" r="16" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2.5" />
          <circle cx="60" cy="38" r="16" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2.5" />
          <circle cx="34" cy="68" r="16" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2.5" />
          <circle cx="86" cy="68" r="16" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2.5" />
          <circle cx="60" cy="84" r="16" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2.5" />
          <ellipse cx="60" cy="64" rx="20" ry="24" fill="#fed7aa" stroke="#78350f" strokeWidth="2.5" />
          <circle cx="52" cy="58" r="3.5" fill="#0f172a" />
          <circle cx="68" cy="58" r="3.5" fill="#0f172a" />
          <ellipse cx="60" cy="74" rx="8" ry="5" fill="#fbcfe8" />
        </svg>
      );

    case 'duck':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <circle cx="50" cy="44" r="22" fill="#facc15" stroke="#ca8a04" strokeWidth="3" />
          <path d="M38 56 C28 62, 28 88, 52 92 C78 94, 98 84, 98 68 C98 56, 76 60, 64 56 Z" fill="#fde047" stroke="#ca8a04" strokeWidth="3" />
          <circle cx="44" cy="38" r="4" fill="#0f172a" />
          <path d="M66 42 Q86 46 76 54 Q66 52 66 42 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="2" />
        </svg>
      );

    // -----------------------------------------------------------------------
    // FRUITS & VEGGIES
    // -----------------------------------------------------------------------
    case 'banana':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <path
            d="M32 28 C26 58, 44 94, 88 94 C76 86, 52 68, 50 34 C42 26, 36 24, 32 28 Z"
            fill="#facc15"
            stroke="#ca8a04"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <path d="M32 28 L28 22" stroke="#65a30d" strokeWidth="4" strokeLinecap="round" />
          <path d="M88 94 L94 96" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );

    case 'mango':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <path d="M60 22 C60 14, 64 8, 68 6" stroke="#5c2d16" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M62 16 C72 10, 82 14, 84 20 C74 22, 66 20, 62 16 Z" fill="#22c55e" stroke="#15803d" strokeWidth="2" />
          <path
            d="M60 26 C44 26, 26 44, 28 72 C30 96, 54 106, 76 102 C94 98, 100 74, 94 50 C88 32, 74 26, 60 26 Z"
            fill="#f59e0b"
            stroke="#d97706"
            strokeWidth="3.5"
          />
        </svg>
      );

    case 'strawberry':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <path d="M60 20 L52 10 M60 20 L68 10 M60 20 L60 8" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
          <path d="M40 26 Q60 32 80 26 Q86 36 82 46 Q60 110 60 110 Q38 46 40 26 Z" fill="#ef4444" stroke="#b91c1c" strokeWidth="3.5" />
          <ellipse cx="50" cy="46" rx="1.5" ry="3" fill="#fef08a" />
          <ellipse cx="70" cy="46" rx="1.5" ry="3" fill="#fef08a" />
          <ellipse cx="60" cy="62" rx="1.5" ry="3" fill="#fef08a" />
          <ellipse cx="52" cy="78" rx="1.5" ry="3" fill="#fef08a" />
          <ellipse cx="68" cy="78" rx="1.5" ry="3" fill="#fef08a" />
        </svg>
      );

    case 'pineapple':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <polygon points="60,6 52,36 68,36" fill="#16a34a" stroke="#15803d" strokeWidth="2" />
          <polygon points="44,14 48,38 60,38" fill="#22c55e" stroke="#15803d" strokeWidth="2" />
          <polygon points="76,14 72,38 60,38" fill="#22c55e" stroke="#15803d" strokeWidth="2" />
          <ellipse cx="60" cy="72" rx="30" ry="38" fill="#eab308" stroke="#ca8a04" strokeWidth="3.5" />
          <path d="M40 50 L80 94 M80 50 L40 94 M34 72 L86 72" stroke="#a16207" strokeWidth="2" />
        </svg>
      );

    case 'cherries':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <path d="M60 18 Q46 40 42 72" stroke="#15803d" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M60 18 Q74 40 78 72" stroke="#15803d" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M60 18 C70 12, 80 16, 82 22 C72 24, 64 20, 60 18 Z" fill="#22c55e" stroke="#15803d" strokeWidth="2" />
          <circle cx="42" cy="80" r="18" fill="#dc2626" stroke="#991b1b" strokeWidth="3" />
          <circle cx="78" cy="80" r="18" fill="#dc2626" stroke="#991b1b" strokeWidth="3" />
          <circle cx="36" cy="74" r="4" fill="#ffffff" opacity="0.6" />
          <circle cx="72" cy="74" r="4" fill="#ffffff" opacity="0.6" />
        </svg>
      );

    case 'peach':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <path d="M60 22 C60 14, 64 10, 68 8" stroke="#5c2d16" strokeWidth="3" strokeLinecap="round" />
          <path d="M62 18 C74 12, 84 16, 86 24 C74 26, 64 22, 62 18 Z" fill="#22c55e" stroke="#15803d" strokeWidth="2" />
          <circle cx="60" cy="66" r="38" fill="#fb923c" stroke="#ea580c" strokeWidth="3.5" />
          <path d="M60 28 C66 48, 66 76, 60 102" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'carrot':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <path d="M60 24 L50 8 M60 24 L60 6 M60 24 L70 8" stroke="#16a34a" strokeWidth="3.5" strokeLinecap="round" />
          <polygon points="42,26 78,26 60,110" fill="#f97316" stroke="#c2410c" strokeWidth="3.5" strokeLinejoin="round" />
          <line x1="50" y1="46" x2="68" y2="46" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="52" y1="68" x2="66" y2="68" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'tomato':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <path d="M60 20 L50 14 M60 20 L70 14 M60 20 L60 8" stroke="#15803d" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="60" cy="66" r="40" fill="#ef4444" stroke="#b91c1c" strokeWidth="3.5" />
          <circle cx="44" cy="50" r="6" fill="#ffffff" opacity="0.5" />
        </svg>
      );

    case 'potato':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <ellipse cx="60" cy="60" rx="44" ry="34" fill="#b45309" stroke="#78350f" strokeWidth="3.5" transform="rotate(-8 60 60)" />
          <circle cx="44" cy="52" r="2" fill="#78350f" />
          <circle cx="76" cy="58" r="2" fill="#78350f" />
          <circle cx="58" cy="74" r="2" fill="#78350f" />
        </svg>
      );

    case 'cucumber':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <rect x="24" y="44" width="72" height="32" rx="16" fill="#22c55e" stroke="#15803d" strokeWidth="3.5" transform="rotate(-15 60 60)" />
          <circle cx="44" cy="54" r="2" fill="#15803d" />
          <circle cx="64" cy="60" r="2" fill="#15803d" />
          <circle cx="80" cy="66" r="2" fill="#15803d" />
        </svg>
      );

    case 'corn':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <path d="M42 98 C36 74, 40 44, 46 28 C56 50, 56 80, 42 98 Z" fill="#65a30d" stroke="#4d7c0f" strokeWidth="2.5" />
          <path d="M78 98 C84 74, 80 44, 74 28 C64 50, 64 80, 78 98 Z" fill="#65a30d" stroke="#4d7c0f" strokeWidth="2.5" />
          <rect x="48" y="24" width="24" height="74" rx="12" fill="#eab308" stroke="#ca8a04" strokeWidth="3" />
          <path d="M48 40 L72 40 M48 54 L72 54 M48 68 L72 68 M48 82 L72 82 M60 24 L60 98" stroke="#a16207" strokeWidth="2" />
        </svg>
      );

    case 'peas':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <path d="M20 70 Q60 96 100 50 Q60 58 20 70 Z" fill="#16a34a" stroke="#15803d" strokeWidth="3.5" />
          <circle cx="44" cy="64" r="9" fill="#86efac" stroke="#15803d" strokeWidth="2" />
          <circle cx="62" cy="64" r="9" fill="#86efac" stroke="#15803d" strokeWidth="2" />
          <circle cx="80" cy="60" r="9" fill="#86efac" stroke="#15803d" strokeWidth="2" />
        </svg>
      );

    case 'broccoli':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <rect x="50" y="68" width="20" height="38" rx="4" fill="#86efac" stroke="#15803d" strokeWidth="3" />
          <circle cx="60" cy="40" r="24" fill="#16a34a" stroke="#15803d" strokeWidth="3.5" />
          <circle cx="42" cy="52" r="18" fill="#15803d" stroke="#166534" strokeWidth="2.5" />
          <circle cx="78" cy="52" r="18" fill="#15803d" stroke="#166534" strokeWidth="2.5" />
        </svg>
      );

    case 'eggplant':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <path d="M60 16 L50 28 M60 16 L70 28 M60 16 L60 6" stroke="#15803d" strokeWidth="3.5" strokeLinecap="round" />
          <path
            d="M56 26 C46 26, 38 46, 38 70 C38 96, 52 108, 68 108 C84 108, 92 96, 88 74 C84 46, 72 26, 56 26 Z"
            fill="#7e22ce"
            stroke="#581c87"
            strokeWidth="3.5"
          />
          <circle cx="50" cy="56" r="4" fill="#ffffff" opacity="0.4" />
        </svg>
      );

    // -----------------------------------------------------------------------
    // TOYS & PLAY
    // -----------------------------------------------------------------------
    case 'teddy_bear':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <circle cx="36" cy="42" r="12" fill="#b45309" stroke="#78350f" strokeWidth="2.5" />
          <circle cx="84" cy="42" r="12" fill="#b45309" stroke="#78350f" strokeWidth="2.5" />
          <circle cx="60" cy="62" r="32" fill="#d97706" stroke="#78350f" strokeWidth="3" />
          <circle cx="50" cy="56" r="4" fill="#0f172a" />
          <circle cx="70" cy="56" r="4" fill="#0f172a" />
          <ellipse cx="60" cy="70" rx="14" ry="10" fill="#fef3c7" />
          <circle cx="60" cy="66" r="3" fill="#0f172a" />
          <path d="M56 72 Q60 76 64 72" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" fill="none" />
          <circle cx="60" cy="98" r="16" fill="#b45309" stroke="#78350f" strokeWidth="2.5" />
        </svg>
      );

    case 'doll':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <circle cx="60" cy="38" r="22" fill="#fed7aa" stroke="#ea580c" strokeWidth="2.5" />
          <path d="M38 34 C44 20, 76 20, 82 34" stroke="#78350f" strokeWidth="4" strokeLinecap="round" fill="none" />
          <circle cx="52" cy="36" r="3" fill="#0f172a" />
          <circle cx="68" cy="36" r="3" fill="#0f172a" />
          <path d="M56 44 Q60 48 64 44" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" fill="none" />
          <polygon points="40,102 80,102 60,58" fill="#f472b6" stroke="#db2777" strokeWidth="3" />
        </svg>
      );

    case 'toy_car':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <path d="M22 72 L32 50 Q42 42 62 42 L80 42 L94 60 L102 72 Z" fill="#ef4444" stroke="#b91c1c" strokeWidth="3" />
          <rect x="40" y="48" width="18" height="14" rx="2" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
          <rect x="64" y="48" width="18" height="14" rx="2" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
          <circle cx="38" cy="80" r="12" fill="#1e293b" stroke="#0f172a" strokeWidth="3" />
          <circle cx="38" cy="80" r="5" fill="#e2e8f0" />
          <circle cx="86" cy="80" r="12" fill="#1e293b" stroke="#0f172a" strokeWidth="3" />
          <circle cx="86" cy="80" r="5" fill="#e2e8f0" />
        </svg>
      );

    case 'toy_blocks':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <rect x="22" y="64" width="36" height="36" rx="4" fill="#ef4444" stroke="#b91c1c" strokeWidth="2.5" />
          <text x="40" y="88" textAnchor="middle" fill="#ffffff" fontSize="18" fontWeight="900">A</text>
          <rect x="62" y="64" width="36" height="36" rx="4" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2.5" />
          <text x="80" y="88" textAnchor="middle" fill="#ffffff" fontSize="18" fontWeight="900">B</text>
          <rect x="42" y="24" width="36" height="36" rx="4" fill="#eab308" stroke="#ca8a04" strokeWidth="2.5" />
          <text x="60" y="48" textAnchor="middle" fill="#ffffff" fontSize="18" fontWeight="900">1</text>
        </svg>
      );

    case 'toy_puzzle':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <rect x="24" y="24" width="72" height="72" rx="8" fill="#06b6d4" stroke="#0891b2" strokeWidth="3" />
          <circle cx="60" cy="24" r="8" fill="#06b6d4" stroke="#0891b2" strokeWidth="2" />
          <circle cx="96" cy="60" r="8" fill="#06b6d4" stroke="#0891b2" strokeWidth="2" />
          <circle cx="60" cy="96" r="8" fill="#ffffff" stroke="#0891b2" strokeWidth="2" />
          <circle cx="24" cy="60" r="8" fill="#ffffff" stroke="#0891b2" strokeWidth="2" />
        </svg>
      );

    case 'toy_train':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <rect x="24" y="46" width="46" height="34" rx="4" fill="#10b981" stroke="#047857" strokeWidth="2.5" />
          <rect x="70" y="32" width="28" height="48" rx="4" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2.5" />
          <rect x="76" y="40" width="16" height="16" fill="#e0f2fe" />
          <rect x="36" y="28" width="10" height="18" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" />
          <circle cx="40" cy="88" r="10" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
          <circle cx="62" cy="88" r="10" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
          <circle cx="86" cy="88" r="10" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
        </svg>
      );

    // -----------------------------------------------------------------------
    // CLASSROOM OBJECTS
    // -----------------------------------------------------------------------
    case 'crayon':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <polygon points="60,10 72,30 48,30" fill="#f43f5e" stroke="#be123c" strokeWidth="2" />
          <rect x="48" y="30" width="24" height="74" fill="#fb7185" stroke="#be123c" strokeWidth="2.5" />
          <rect x="48" y="52" width="24" height="26" fill="#be123c" />
          <rect x="48" y="104" width="24" height="8" fill="#f43f5e" stroke="#be123c" strokeWidth="2" />
        </svg>
      );

    case 'book':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <polygon points="60,34 20,44 20,96 60,86" fill="#38bdf8" stroke="#0284c7" strokeWidth="2.5" />
          <polygon points="60,34 100,44 100,96 60,86" fill="#0284c7" stroke="#0369a1" strokeWidth="2.5" />
          <polygon points="60,30 22,40 60,82 98,40" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="60" y1="32" x2="60" y2="86" stroke="#0f172a" strokeWidth="3" />
        </svg>
      );

    case 'scissors':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <line x1="32" y1="32" x2="88" y2="88" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />
          <line x1="88" y1="32" x2="32" y2="88" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />
          <circle cx="60" cy="60" r="4" fill="#0f172a" />
          <circle cx="32" cy="88" r="14" fill="none" stroke="#06b6d4" strokeWidth="5" />
          <circle cx="88" cy="88" r="14" fill="none" stroke="#06b6d4" strokeWidth="5" />
        </svg>
      );

    case 'glue':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <polygon points="56,12 64,12 66,28 54,28" fill="#f97316" stroke="#c2410c" strokeWidth="2" />
          <rect x="42" y="28" width="36" height="14" fill="#f97316" stroke="#c2410c" strokeWidth="2" />
          <rect x="36" y="42" width="48" height="66" rx="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="3" />
          <rect x="42" y="58" width="36" height="24" fill="#3b82f6" rx="4" />
        </svg>
      );

    case 'chair':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <rect x="36" y="24" width="48" height="40" rx="6" fill="#fb923c" stroke="#c2410c" strokeWidth="3" />
          <rect x="30" y="64" width="60" height="12" rx="4" fill="#ea580c" stroke="#c2410c" strokeWidth="3" />
          <line x1="36" y1="76" x2="36" y2="106" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
          <line x1="84" y1="76" x2="84" y2="106" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );

    case 'table':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <rect x="18" y="44" width="84" height="16" rx="4" fill="#10b981" stroke="#047857" strokeWidth="3" />
          <line x1="26" y1="60" x2="26" y2="100" stroke="#047857" strokeWidth="4" strokeLinecap="round" />
          <line x1="94" y1="60" x2="94" y2="100" stroke="#047857" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );

    case 'backpack':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <path d="M34 44 A26 26 0 0 1 86 44 L90 98 A8 8 0 0 1 82 106 L38 106 A8 8 0 0 1 30 98 Z" fill="#0d9488" stroke="#0f766e" strokeWidth="3.5" />
          <rect x="42" y="66" width="36" height="28" rx="6" fill="#14b8a6" stroke="#0f766e" strokeWidth="2.5" />
          <path d="M50 24 Q60 14 70 24" stroke="#0f766e" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'ruler':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <rect x="16" y="48" width="88" height="24" rx="4" fill="#facc15" stroke="#ca8a04" strokeWidth="3" />
          {[28, 40, 52, 64, 76, 88].map((x, i) => (
            <line key={i} x1={x} y1="48" x2={x} y2={i % 2 === 0 ? '62' : '56'} stroke="#78350f" strokeWidth="2" />
          ))}
        </svg>
      );

    case 'paintbrush':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <path d="M48 20 Q60 10 72 20 L68 40 L52 40 Z" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2" />
          <rect x="52" y="40" width="16" height="12" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
          <path d="M56 52 L56 106 C56 110, 64 110, 64 106 L64 52 Z" fill="#b45309" stroke="#78350f" strokeWidth="2" />
        </svg>
      );

    // -----------------------------------------------------------------------
    // OPPOSITES
    // -----------------------------------------------------------------------
    case 'opp_big_elephant':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <circle cx="60" cy="60" r="42" fill="#94a3b8" stroke="#475569" strokeWidth="3.5" />
          <circle cx="48" cy="54" r="4.5" fill="#0f172a" />
          <path d="M60 68 Q64 96 78 88" stroke="#475569" strokeWidth="4" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'opp_small_mouse':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <circle cx="60" cy="74" r="18" fill="#cbd5e1" stroke="#64748b" strokeWidth="2.5" />
          <circle cx="50" cy="58" r="8" fill="#fbcfe8" stroke="#64748b" strokeWidth="2" />
          <circle cx="70" cy="58" r="8" fill="#fbcfe8" stroke="#64748b" strokeWidth="2" />
          <circle cx="56" cy="70" r="2.5" fill="#0f172a" />
          <circle cx="64" cy="70" r="2.5" fill="#0f172a" />
        </svg>
      );

    case 'opp_hot_sun':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <circle cx="60" cy="60" r="32" fill="#f97316" stroke="#c2410c" strokeWidth="3.5" />
          <path d="M50 54 Q60 48 70 54" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none" />
          {[0, 60, 120, 180, 240, 300].map((deg, i) => (
            <line key={i} x1="60" y1="18" x2="60" y2="8" stroke="#f97316" strokeWidth="4" strokeLinecap="round" transform={`rotate(${deg} 60 60)`} />
          ))}
        </svg>
      );

    case 'opp_cold_snowman':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <circle cx="60" cy="42" r="18" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2.5" />
          <circle cx="60" cy="80" r="28" fill="#e0f2fe" stroke="#0284c7" strokeWidth="3" />
          <circle cx="54" cy="38" r="2" fill="#0f172a" />
          <circle cx="66" cy="38" r="2" fill="#0f172a" />
          <polygon points="60,42 70,44 60,46" fill="#f97316" />
          <rect x="46" y="56" width="28" height="8" rx="4" fill="#ef4444" />
        </svg>
      );

    case 'opp_up_balloon':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <polygon points="60,10 70,24 50,24" fill="#10b981" />
          <ellipse cx="60" cy="54" rx="30" ry="36" fill="#10b981" stroke="#047857" strokeWidth="3" />
          <path d="M60 90 Q54 104 62 114" stroke="#64748b" strokeWidth="2" fill="none" />
        </svg>
      );

    case 'opp_down_anchor':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <circle cx="60" cy="24" r="10" stroke="#3b82f6" strokeWidth="4" fill="none" />
          <line x1="60" y1="34" x2="60" y2="100" stroke="#3b82f6" strokeWidth="5" />
          <line x1="38" y1="48" x2="82" y2="48" stroke="#3b82f6" strokeWidth="5" strokeLinecap="round" />
          <path d="M26 74 C26 104, 94 104, 94 74" stroke="#3b82f6" strokeWidth="5" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'opp_fast_cheetah':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <ellipse cx="60" cy="60" rx="36" ry="24" fill="#f59e0b" stroke="#b45309" strokeWidth="3" />
          <circle cx="46" cy="54" r="3" fill="#0f172a" />
          <circle cx="74" cy="54" r="3" fill="#0f172a" />
          <path d="M20 60 L10 60 M24 50 L14 50 M24 70 L14 70" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'opp_slow_turtle':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <path d="M26 72 A34 30 0 0 1 94 72 Z" fill="#15803d" stroke="#166534" strokeWidth="3.5" />
          <circle cx="98" cy="70" r="10" fill="#86efac" stroke="#15803d" strokeWidth="2.5" />
          <circle cx="102" cy="68" r="2" fill="#0f172a" />
          <ellipse cx="40" cy="80" rx="6" ry="4" fill="#86efac" />
          <ellipse cx="80" cy="80" rx="6" ry="4" fill="#86efac" />
        </svg>
      );

    case 'opp_day':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <circle cx="60" cy="60" r="32" fill="#facc15" stroke="#ca8a04" strokeWidth="3.5" />
          <circle cx="50" cy="54" r="3.5" fill="#0f172a" />
          <circle cx="70" cy="54" r="3.5" fill="#0f172a" />
          <path d="M52 64 Q60 70 68 64" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'opp_night':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <path d="M44 26 A36 36 0 1 0 86 86 A44 44 0 0 1 44 26 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="3" />
          <polygon points="86,30 89,38 97,39 91,45 93,53 86,49 79,53 81,45 75,39 83,38" fill="#ffffff" />
        </svg>
      );

    case 'opp_open_door':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <rect x="26" y="24" width="68" height="76" fill="#14b8a6" stroke="#0f766e" strokeWidth="3" />
          <polygon points="26,24 64,36 64,100 26,100" fill="#2dd4bf" stroke="#0f766e" strokeWidth="2.5" />
          <circle cx="58" cy="68" r="3" fill="#fef08a" />
        </svg>
      );

    case 'opp_closed_door':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <rect x="30" y="24" width="60" height="76" fill="#f43f5e" stroke="#be123c" strokeWidth="3.5" />
          <circle cx="40" cy="62" r="4" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
        </svg>
      );

    // -----------------------------------------------------------------------
    // EVERYDAY OBJECTS
    // -----------------------------------------------------------------------
    case 'house':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <polygon points="60,18 102,52 18,52" fill="#ef4444" stroke="#b91c1c" strokeWidth="3.5" strokeLinejoin="round" />
          <rect x="28" y="52" width="64" height="48" fill="#38bdf8" stroke="#0284c7" strokeWidth="3" />
          <rect x="50" y="68" width="20" height="32" fill="#fed7aa" stroke="#78350f" strokeWidth="2" />
          <rect x="34" y="60" width="12" height="12" fill="#ffffff" stroke="#0284c7" strokeWidth="1.5" />
        </svg>
      );

    case 'car':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <path d="M22 68 L32 46 Q44 38 64 38 L78 38 L92 56 L102 68 Z" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="3" />
          <circle cx="38" cy="78" r="12" fill="#1e293b" stroke="#0f172a" strokeWidth="3" />
          <circle cx="86" cy="78" r="12" fill="#1e293b" stroke="#0f172a" strokeWidth="3" />
        </svg>
      );

    case 'bus':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <rect x="18" y="34" width="84" height="46" rx="8" fill="#facc15" stroke="#ca8a04" strokeWidth="3.5" />
          <rect x="26" y="42" width="16" height="16" rx="2" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
          <rect x="48" y="42" width="16" height="16" rx="2" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
          <rect x="70" y="42" width="16" height="16" rx="2" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
          <circle cx="36" cy="84" r="10" fill="#1e293b" stroke="#0f172a" strokeWidth="2.5" />
          <circle cx="84" cy="84" r="10" fill="#1e293b" stroke="#0f172a" strokeWidth="2.5" />
        </svg>
      );

    case 'bed':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <rect x="16" y="34" width="14" height="56" rx="3" fill="#78350f" stroke="#451a03" strokeWidth="2.5" />
          <rect x="90" y="50" width="14" height="40" rx="3" fill="#78350f" stroke="#451a03" strokeWidth="2.5" />
          <rect x="24" y="60" width="70" height="24" fill="#a855f7" stroke="#7e22ce" strokeWidth="2.5" />
          <ellipse cx="38" cy="56" rx="10" ry="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
        </svg>
      );

    case 'cup':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <path d="M34 38 L38 86 C38 96, 74 96, 74 86 L78 38 Z" fill="#14b8a6" stroke="#0f766e" strokeWidth="3.5" />
          <path d="M76 46 C90 46, 90 76, 74 76" stroke="#0f766e" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'spoon':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <ellipse cx="60" cy="38" rx="16" ry="24" fill="#cbd5e1" stroke="#64748b" strokeWidth="3" />
          <rect x="56" y="60" width="8" height="46" rx="4" fill="#cbd5e1" stroke="#64748b" strokeWidth="2.5" />
        </svg>
      );

    case 'shoes':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <path d="M24 74 C24 58, 48 58, 62 68 L88 68 C96 68, 102 78, 102 84 L24 84 Z" fill="#10b981" stroke="#047857" strokeWidth="3" />
          <rect x="20" y="84" width="84" height="8" rx="2" fill="#0f172a" />
        </svg>
      );

    case 'shirt':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <polygon points="40,24 60,32 80,24 100,42 86,52 82,42 82,96 38,96 38,42 34,52 20,42" fill="#06b6d4" stroke="#0891b2" strokeWidth="3" strokeLinejoin="round" />
          <circle cx="60" cy="52" r="2.5" fill="#0891b2" />
          <circle cx="60" cy="68" r="2.5" fill="#0891b2" />
        </svg>
      );

    case 'door':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <rect x="32" y="18" width="56" height="88" rx="4" fill="#f97316" stroke="#c2410c" strokeWidth="3.5" />
          <circle cx="78" cy="64" r="4" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
        </svg>
      );

    case 'window':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <rect x="26" y="26" width="68" height="68" rx="4" fill="#e0f2fe" stroke="#0284c7" strokeWidth="3.5" />
          <line x1="60" y1="26" x2="60" y2="94" stroke="#0284c7" strokeWidth="3" />
          <line x1="26" y1="60" x2="94" y2="60" stroke="#0284c7" strokeWidth="3" />
        </svg>
      );

    case 'clock':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <circle cx="60" cy="60" r="44" fill="#ffffff" stroke="#f43f5e" strokeWidth="4" />
          <circle cx="60" cy="60" r="4" fill="#0f172a" />
          <line x1="60" y1="60" x2="60" y2="34" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="60" y1="60" x2="80" y2="60" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    // -----------------------------------------------------------------------
    // DEFAULT FALLBACK (CLEAN CHILD ICON)
    // -----------------------------------------------------------------------
    default:
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" fill="none" className={className}>
          <circle cx="60" cy="60" r="42" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="3" />
          <text x="60" y="70" textAnchor="middle" fontSize="36">✨</text>
        </svg>
      );
  }
};
