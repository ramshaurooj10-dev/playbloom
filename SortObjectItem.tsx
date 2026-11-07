import React from 'react';

export type SortObjectCategory =
  | 'fruit'
  | 'flower'
  | 'toy'
  | 'food'
  | 'animal'
  | 'vehicle'
  | 'color_red'
  | 'color_yellow'
  | 'color_blue'
  | 'color_green'
  | 'color_pink'
  | 'color_orange'
  | 'big_object'
  | 'small_object';

export type SortObjectType =
  | 'apple'
  | 'banana'
  | 'orange'
  | 'strawberry'
  | 'watermelon'
  | 'grapes'
  | 'flower'
  | 'tulip'
  | 'sunflower'
  | 'rose'
  | 'teddy'
  | 'toy_car'
  | 'ball'
  | 'robot'
  | 'duck'
  | 'blocks'
  | 'ice_cream'
  | 'candy'
  | 'cupcake'
  | 'donut'
  | 'pizza'
  | 'dog'
  | 'cat'
  | 'bunny'
  | 'lion'
  | 'frog'
  | 'bus'
  | 'train'
  | 'plane'
  | 'star';

export interface SortObjectData {
  id: string;
  name: string;
  type: SortObjectType;
  category: SortObjectCategory;
  colorName?: string;
  colorHex?: string;
  sizeCategory?: 'big' | 'small';
}

interface SortObjectItemProps {
  item: SortObjectData;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSizeScale?: boolean;
  className?: string;
}

export const SortObjectItem: React.FC<SortObjectItemProps> = ({
  item,
  size = 'md',
  showSizeScale = true,
  className = '',
}) => {
  const baseSizeMap = {
    sm: 'w-12 h-12',
    md: 'w-18 h-18 sm:w-20 sm:h-20',
    lg: 'w-24 h-24 sm:w-28 sm:h-28',
    xl: 'w-32 h-32 sm:w-36 sm:h-36',
  };

  const scaleClass =
    showSizeScale && item.sizeCategory === 'big'
      ? 'scale-120 sm:scale-125'
      : showSizeScale && item.sizeCategory === 'small'
      ? 'scale-80 sm:scale-85'
      : '';

  const renderSvg = () => {
    switch (item.type) {
      // ----------------------------------------------------------------------
      // FRUITS
      // ----------------------------------------------------------------------
      case 'apple': {
        const isGreen = item.colorName === 'green';
        const isYellow = item.colorName === 'yellow';
        const main = isGreen ? '#22C55E' : isYellow ? '#FACC15' : '#EF4444';
        const dark = isGreen ? '#15803D' : isYellow ? '#CA8A04' : '#B91C1C';
        const light = isGreen ? '#86EFAC' : isYellow ? '#FEF08A' : '#FCA5A5';
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <radialGradient id={`appleGrad-${item.id}`} cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor={light} />
                <stop offset="60%" stopColor={main} />
                <stop offset="100%" stopColor={dark} />
              </radialGradient>
            </defs>
            <path d="M50 24 Q54 10 62 8" stroke="#78350F" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <path d="M52 20 Q66 12 70 20 Q62 26 52 20 Z" fill="#22C55E" stroke="#15803D" strokeWidth="1.5" />
            <path
              d="M50 26 C36 12 16 16 10 36 C4 56 16 86 44 92 C48 93 52 93 56 92 C84 86 96 56 90 36 C84 16 64 12 50 26 Z"
              fill={`url(#appleGrad-${item.id})`}
              stroke={dark}
              strokeWidth="2.5"
            />
            <ellipse cx="28" cy="40" rx="8" ry="15" fill="#FFFFFF" opacity="0.45" transform="rotate(-25 28 40)" />
            <circle cx="24" cy="30" r="3.5" fill="#FFFFFF" opacity="0.75" />
          </svg>
        );
      }

      case 'banana': {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id={`bananaGrad-${item.id}`} x1="10" y1="80" x2="90" y2="20">
                <stop stopColor="#FEF08A" />
                <stop offset="0.6" stopColor="#FACC15" />
                <stop offset="1" stopColor="#EAB308" />
              </linearGradient>
            </defs>
            <path
              d="M15 82 C32 86 78 78 90 30 C94 16 88 6 82 8 C64 36 34 58 10 68 C2 71 4 80 15 82 Z"
              fill={`url(#bananaGrad-${item.id})`}
              stroke="#854D0E"
              strokeWidth="2.5"
            />
            <rect x="80" y="6" width="9" height="7" rx="3" fill="#65A30D" stroke="#3F6212" strokeWidth="1.5" />
            <circle cx="8" cy="74" r="4" fill="#713F12" />
            <path d="M22 68 Q52 54 74 28" stroke="#FEF9C3" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.8" />
          </svg>
        );
      }

      case 'orange': {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <radialGradient id={`orangeGrad-${item.id}`} cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#FED7AA" />
                <stop offset="55%" stopColor="#FB923C" />
                <stop offset="100%" stopColor="#EA580C" />
              </radialGradient>
            </defs>
            <path d="M50 20 Q54 10 60 8" stroke="#78350F" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M52 18 Q65 12 68 18 Q62 24 52 18 Z" fill="#22C55E" stroke="#15803D" strokeWidth="1.5" />
            <circle cx="50" cy="54" r="38" fill={`url(#orangeGrad-${item.id})`} stroke="#C2410C" strokeWidth="2.5" />
            {/* Texture dots */}
            <circle cx="36" cy="46" r="1.5" fill="#C2410C" opacity="0.6" />
            <circle cx="44" cy="58" r="1.5" fill="#C2410C" opacity="0.6" />
            <circle cx="62" cy="50" r="1.5" fill="#C2410C" opacity="0.6" />
            <circle cx="54" cy="68" r="1.5" fill="#C2410C" opacity="0.6" />
            {/* Shine */}
            <ellipse cx="34" cy="38" rx="8" ry="12" fill="#FFFFFF" opacity="0.45" transform="rotate(-30 34 38)" />
          </svg>
        );
      }

      case 'strawberry': {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <defs>
              <radialGradient id={`strawGrad-${item.id}`} cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#FCA5A5" />
                <stop offset="55%" stopColor="#EF4444" />
                <stop offset="100%" stopColor="#B91C1C" />
              </radialGradient>
            </defs>
            {/* Crown Leaves */}
            <path d="M50 24 L50 10" stroke="#15803D" strokeWidth="4" strokeLinecap="round" />
            <path d="M30 28 Q40 18 50 26 Q60 18 70 28 Q50 32 30 28 Z" fill="#22C55E" stroke="#15803D" strokeWidth="2" />
            {/* Strawberry Heart Body */}
            <path
              d="M50 28 C26 28 16 48 24 70 C30 84 46 94 50 96 C54 94 70 84 76 70 C84 48 74 28 50 28 Z"
              fill={`url(#strawGrad-${item.id})`}
              stroke="#991B1B"
              strokeWidth="2.5"
            />
            {/* Yellow Seeds */}
            {[
              [36, 44], [50, 42], [64, 44],
              [30, 58], [44, 56], [58, 56], [70, 58],
              [38, 72], [50, 70], [62, 72],
              [44, 82], [54, 82]
            ].map(([x, y], i) => (
              <ellipse key={i} cx={x} cy={y} rx="1.8" ry="2.8" fill="#FEF08A" stroke="#CA8A04" strokeWidth="0.8" />
            ))}
            <ellipse cx="32" cy="42" rx="5" ry="10" fill="#FFFFFF" opacity="0.5" transform="rotate(-20 32 42)" />
          </svg>
        );
      }

      case 'watermelon': {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Green Outer Rind */}
            <path d="M12 40 Q50 96 88 40 Z" fill="#22C55E" stroke="#15803D" strokeWidth="3" strokeLinejoin="round" />
            {/* Light Green Layer */}
            <path d="M16 40 Q50 90 84 40 Z" fill="#BBF7D0" />
            {/* Red Flesh */}
            <path d="M20 40 Q50 84 80 40 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
            {/* Seeds */}
            {[
              [36, 48], [50, 48], [64, 48],
              [42, 60], [58, 60],
              [50, 70]
            ].map(([x, y], i) => (
              <ellipse key={i} cx={x} cy={y} rx="2" ry="3.5" fill="#1E293B" transform={`rotate(${i % 2 === 0 ? 15 : -15} ${x} ${y})`} />
            ))}
            {/* Top Cut Edge */}
            <line x1="12" y1="40" x2="88" y2="40" stroke="#15803D" strokeWidth="3" strokeLinecap="round" />
          </svg>
        );
      }

      case 'grapes': {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Stem & Leaf */}
            <path d="M50 18 Q52 8 60 6" stroke="#78350F" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M52 16 Q68 10 70 18 Q60 26 52 16 Z" fill="#22C55E" stroke="#15803D" strokeWidth="1.5" />
            {/* Grapes Bunch */}
            {[
              // Top row
              [36, 32], [50, 30], [64, 32],
              // Second row
              [30, 46], [44, 44], [58, 44], [70, 46],
              // Third row
              [38, 58], [50, 58], [62, 58],
              // Fourth row
              [44, 72], [56, 72],
              // Bottom
              [50, 84]
            ].map(([x, y], i) => (
              <g key={i}>
                <circle cx={x} cy={y} r="10" fill="#9333EA" stroke="#6B21A8" strokeWidth="1.8" />
                <circle cx={x - 3} cy={y - 3} r="3" fill="#E9D5FF" opacity="0.75" />
              </g>
            ))}
          </svg>
        );
      }

      // ----------------------------------------------------------------------
      // FLOWERS
      // ----------------------------------------------------------------------
      case 'flower': {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {[0, 60, 120, 180, 240, 300].map((deg, i) => (
              <circle
                key={i}
                cx={50 + Math.cos((deg * Math.PI) / 180) * 24}
                cy={50 + Math.sin((deg * Math.PI) / 180) * 24}
                r="17"
                fill="#F472B6"
                stroke="#DB2777"
                strokeWidth="2"
              />
            ))}
            <circle cx="50" cy="50" r="18" fill="#FDE047" stroke="#CA8A04" strokeWidth="2.5" />
            <circle cx="44" cy="46" r="2.8" fill="#78350F" />
            <circle cx="56" cy="46" r="2.8" fill="#78350F" />
            <path d="M45 54 Q50 59 55 54" stroke="#78350F" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          </svg>
        );
      }

      case 'tulip': {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Stem & Leaves */}
            <path d="M50 56 L50 92" stroke="#16A34A" strokeWidth="5" strokeLinecap="round" />
            <path d="M50 78 Q30 68 24 54 Q40 60 50 74 Z" fill="#22C55E" stroke="#15803D" strokeWidth="1.5" />
            <path d="M50 72 Q70 62 76 48 Q60 54 50 68 Z" fill="#22C55E" stroke="#15803D" strokeWidth="1.5" />
            {/* Tulip Petals */}
            <path d="M50 18 Q36 34 34 56 Q50 64 50 64 Q50 64 66 56 Q64 34 50 18 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="2.5" />
            <path d="M26 30 Q16 48 34 58 Q40 46 26 30 Z" fill="#F87171" stroke="#B91C1C" strokeWidth="2" />
            <path d="M74 30 Q84 48 66 58 Q60 46 74 30 Z" fill="#F87171" stroke="#B91C1C" strokeWidth="2" />
            <ellipse cx="44" cy="38" rx="4" ry="10" fill="#FFFFFF" opacity="0.45" transform="rotate(-15 44 38)" />
          </svg>
        );
      }

      case 'sunflower': {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Golden Petals */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
              <ellipse
                key={i}
                cx={50 + Math.cos((deg * Math.PI) / 180) * 28}
                cy={50 + Math.sin((deg * Math.PI) / 180) * 28}
                rx="14"
                ry="8"
                fill="#FACC15"
                stroke="#CA8A04"
                strokeWidth="1.5"
                transform={`rotate(${deg} ${50 + Math.cos((deg * Math.PI) / 180) * 28} ${50 + Math.sin((deg * Math.PI) / 180) * 28})`}
              />
            ))}
            {/* Dark Seed Center */}
            <circle cx="50" cy="50" r="22" fill="#78350F" stroke="#451A03" strokeWidth="2.5" />
            <circle cx="50" cy="50" r="16" fill="#92400E" />
            {/* Happy Face */}
            <circle cx="43" cy="46" r="3" fill="#FEF08A" />
            <circle cx="57" cy="46" r="3" fill="#FEF08A" />
            <path d="M44 54 Q50 60 56 54" stroke="#FEF08A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </svg>
        );
      }

      case 'rose': {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Leaves */}
            <path d="M50 60 L50 92" stroke="#16A34A" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M50 75 Q32 66 26 52 Q42 58 50 71 Z" fill="#22C55E" stroke="#15803D" strokeWidth="1.5" />
            {/* Rose Blossom Petals Layered */}
            <circle cx="50" cy="42" r="26" fill="#DC2626" stroke="#991B1B" strokeWidth="2.5" />
            <circle cx="44" cy="38" r="18" fill="#EF4444" />
            <circle cx="56" cy="40" r="16" fill="#F87171" />
            <circle cx="50" cy="44" r="11" fill="#DC2626" />
            {/* Center Swirl */}
            <path d="M44 42 Q50 36 56 42 Q54 48 48 46 Q46 44 48 42" stroke="#FEF2F2" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
        );
      }

      // ----------------------------------------------------------------------
      // TOYS
      // ----------------------------------------------------------------------
      case 'teddy': {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <circle cx="26" cy="24" r="13" fill="#B45309" stroke="#78350F" strokeWidth="2" />
            <circle cx="26" cy="24" r="6" fill="#FEF3C7" />
            <circle cx="74" cy="24" r="13" fill="#B45309" stroke="#78350F" strokeWidth="2" />
            <circle cx="74" cy="24" r="6" fill="#FEF3C7" />
            <ellipse cx="50" cy="70" rx="26" ry="22" fill="#B45309" stroke="#78350F" strokeWidth="2" />
            <ellipse cx="50" cy="72" rx="16" ry="12" fill="#FEF3C7" />
            <circle cx="50" cy="42" r="26" fill="#B45309" stroke="#78350F" strokeWidth="2" />
            <ellipse cx="50" cy="48" rx="13" ry="10" fill="#FEF3C7" stroke="#78350F" strokeWidth="1" />
            <polygon points="50,44 45,41 55,41" fill="#1E293B" />
            <path d="M50 44 L50 49 M46 48 Q50 52 54 48" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
            <circle cx="39" cy="38" r="4" fill="#1E293B" />
            <circle cx="38" cy="37" r="1.3" fill="#FFFFFF" />
            <circle cx="61" cy="38" r="4" fill="#1E293B" />
            <circle cx="60" cy="37" r="1.3" fill="#FFFFFF" />
            <circle cx="32" cy="46" r="3" fill="#F43F5E" opacity="0.5" />
            <circle cx="68" cy="46" r="3" fill="#F43F5E" opacity="0.5" />
          </svg>
        );
      }

      case 'toy_car': {
        const isRed = item.colorName === 'red';
        const main = isRed ? '#EF4444' : '#0284C7';
        const dark = isRed ? '#991B1B' : '#0369A1';
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <path d="M26 48 Q35 24 55 24 Q75 24 80 48 Z" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2.5" />
            <path d="M30 46 Q38 28 54 28 Q68 28 74 46 Z" fill="#BAE6FD" />
            <line x1="52" y1="26" x2="52" y2="48" stroke="#0284C7" strokeWidth="2" />
            <path
              d="M10 50 C10 44 14 42 20 42 L80 42 C88 42 94 46 94 54 L94 68 C94 72 90 75 86 75 L14 75 C10 75 6 71 6 66 L6 54 Z"
              fill={main}
              stroke={dark}
              strokeWidth="2.5"
            />
            <circle cx="90" cy="54" r="4.5" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
            <circle cx="10" cy="54" r="4" fill="#F87171" stroke="#991B1B" strokeWidth="1.5" />
            <circle cx="28" cy="74" r="14" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
            <circle cx="28" cy="74" r="6" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
            <circle cx="72" cy="74" r="14" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
            <circle cx="72" cy="74" r="6" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
          </svg>
        );
      }

      case 'ball': {
        const isRed = item.colorName === 'red';
        const isBlue = item.colorName === 'blue';
        const isYellow = item.colorName === 'yellow';
        const main = isRed ? '#EF4444' : isBlue ? '#3B82F6' : isYellow ? '#FACC15' : '#22C55E';
        const dark = isRed ? '#991B1B' : isBlue ? '#1E40AF' : isYellow ? '#A16207' : '#15803D';
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <circle cx="50" cy="50" r="40" fill={main} stroke={dark} strokeWidth="2.5" />
            <path d="M12 50 Q50 34 88 50 Q50 66 12 50 Z" fill="#FEF08A" stroke="#FFFFFF" strokeWidth="1.5" />
            <polygon points="50,42 52.5,47 58,47.5 54,51.5 55.5,57 50,54 44.5,57 46,51.5 42,47.5 47.5,47" fill="#FFFFFF" />
            <ellipse cx="36" cy="30" rx="8" ry="5" fill="#FFFFFF" opacity="0.65" transform="rotate(-30 36 30)" />
          </svg>
        );
      }

      case 'robot': {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Antenna */}
            <line x1="50" y1="12" x2="50" y2="24" stroke="#475569" strokeWidth="3" />
            <circle cx="50" cy="10" r="4.5" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
            {/* Ears */}
            <rect x="18" y="32" width="6" height="12" rx="2" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
            <rect x="76" y="32" width="6" height="12" rx="2" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
            {/* Head */}
            <rect x="24" y="24" width="52" height="30" rx="8" fill="#38BDF8" stroke="#0284C7" strokeWidth="2.5" />
            <circle cx="38" cy="38" r="5" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
            <circle cx="62" cy="38" r="5" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
            <line x1="38" y1="47" x2="62" y2="47" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" />
            {/* Body */}
            <rect x="28" y="58" width="44" height="32" rx="6" fill="#818CF8" stroke="#4F46E5" strokeWidth="2.5" />
            <circle cx="42" cy="72" r="4" fill="#34D399" />
            <circle cx="58" cy="72" r="4" fill="#F43F5E" />
          </svg>
        );
      }

      case 'duck': {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <ellipse cx="48" cy="62" rx="32" ry="22" fill="#FACC15" stroke="#CA8A04" strokeWidth="2.5" />
            <path d="M34 62 Q50 52 58 64 Q46 74 34 62 Z" fill="#EAB308" />
            <circle cx="68" cy="38" r="19" fill="#FACC15" stroke="#CA8A04" strokeWidth="2.5" />
            <path d="M84 38 Q96 42 86 48 Q82 46 82 38 Z" fill="#F97316" stroke="#C2410C" strokeWidth="1.5" />
            <circle cx="73" cy="33" r="3.5" fill="#1E293B" />
            <circle cx="71.5" cy="31.5" r="1.2" fill="#FFFFFF" />
            <circle cx="66" cy="42" r="3" fill="#F43F5E" opacity="0.6" />
          </svg>
        );
      }

      case 'blocks': {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Bottom Left Red Block */}
            <rect x="18" y="50" width="30" height="30" rx="5" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
            <text x="33" y="72" textAnchor="middle" fill="#FFFFFF" fontSize="18" fontWeight="bold" fontFamily="sans-serif">A</text>
            {/* Bottom Right Blue Block */}
            <rect x="52" y="50" width="30" height="30" rx="5" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
            <text x="67" y="72" textAnchor="middle" fill="#FFFFFF" fontSize="18" fontWeight="bold" fontFamily="sans-serif">B</text>
            {/* Top Yellow Block */}
            <rect x="35" y="18" width="30" height="30" rx="5" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
            <text x="50" y="40" textAnchor="middle" fill="#78350F" fontSize="18" fontWeight="bold" fontFamily="sans-serif">C</text>
          </svg>
        );
      }

      // ----------------------------------------------------------------------
      // FOOD / SWEETS
      // ----------------------------------------------------------------------
      case 'ice_cream': {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <polygon points="50,92 28,48 72,48" fill="#F59E0B" stroke="#B45309" strokeWidth="2.5" />
            <line x1="36" y1="52" x2="62" y2="78" stroke="#D97706" strokeWidth="1.8" />
            <line x1="44" y1="50" x2="56" y2="86" stroke="#D97706" strokeWidth="1.8" />
            <circle cx="50" cy="38" r="26" fill="#F472B6" stroke="#DB2777" strokeWidth="2.5" />
            <circle cx="50" cy="14" r="6.5" fill="#EF4444" stroke="#991B1B" strokeWidth="1.5" />
            <path d="M50 14 Q54 6 58 4" stroke="#78350F" strokeWidth="2" fill="none" strokeLinecap="round" />
            <line x1="38" y1="30" x2="44" y2="28" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="56" y1="32" x2="62" y2="35" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        );
      }

      case 'candy': {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <polygon points="50,50 15,22 10,48 18,72" fill="#C084FC" stroke="#7E22CE" strokeWidth="2" strokeLinejoin="round" />
            <polygon points="50,50 85,22 90,48 82,72" fill="#C084FC" stroke="#7E22CE" strokeWidth="2" strokeLinejoin="round" />
            <circle cx="50" cy="50" r="26" fill="#EC4899" stroke="#BE185D" strokeWidth="2.5" />
            <path d="M32 38 Q50 50 68 62" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.8" />
            <path d="M38 62 Q50 50 62 38" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.8" />
            <circle cx="44" cy="42" r="3.5" fill="#FFFFFF" opacity="0.75" />
          </svg>
        );
      }

      case 'cupcake': {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <polygon points="26,54 74,54 66,88 34,88" fill="#FDE047" stroke="#CA8A04" strokeWidth="2.2" />
            <line x1="42" y1="54" x2="40" y2="88" stroke="#CA8A04" strokeWidth="1.5" />
            <line x1="50" y1="54" x2="50" y2="88" stroke="#CA8A04" strokeWidth="1.5" />
            <line x1="58" y1="54" x2="60" y2="88" stroke="#CA8A04" strokeWidth="1.5" />
            <path d="M20 54 Q35 34 50 34 Q65 34 80 54 Z" fill="#F472B6" stroke="#DB2777" strokeWidth="2.5" />
            <circle cx="50" cy="28" r="16" fill="#F472B6" stroke="#DB2777" strokeWidth="2" />
            <circle cx="50" cy="14" r="6.5" fill="#EF4444" stroke="#991B1B" strokeWidth="1.5" />
          </svg>
        );
      }

      case 'donut': {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <circle cx="50" cy="50" r="38" fill="#FBBF24" stroke="#D97706" strokeWidth="2.5" />
            <circle cx="50" cy="50" r="34" fill="#F472B6" />
            <circle cx="50" cy="50" r="14" fill="#FFFFFF" stroke="#D97706" strokeWidth="2.5" />
            {/* Sprinkles */}
            <line x1="30" y1="36" x2="36" y2="34" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="64" y1="34" x2="70" y2="38" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="68" y1="62" x2="62" y2="66" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="32" y1="64" x2="38" y2="68" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        );
      }

      case 'pizza': {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Crust */}
            <polygon points="50,92 14,24 86,24" fill="#F59E0B" stroke="#B45309" strokeWidth="2.5" />
            <path d="M14 24 Q50 16 86 24" stroke="#B45309" strokeWidth="5" fill="none" strokeLinecap="round" />
            {/* Cheese */}
            <polygon points="50,86 20,28 80,28" fill="#FDE047" />
            {/* Pepperonis */}
            <circle cx="42" cy="42" r="5.5" fill="#EF4444" stroke="#991B1B" strokeWidth="1" />
            <circle cx="60" cy="46" r="5.5" fill="#EF4444" stroke="#991B1B" strokeWidth="1" />
            <circle cx="50" cy="66" r="5.5" fill="#EF4444" stroke="#991B1B" strokeWidth="1" />
            <circle cx="48" cy="34" r="4.5" fill="#EF4444" stroke="#991B1B" strokeWidth="1" />
          </svg>
        );
      }

      // ----------------------------------------------------------------------
      // ANIMALS
      // ----------------------------------------------------------------------
      case 'dog': {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Ears */}
            <ellipse cx="22" cy="46" rx="9" ry="20" fill="#92400E" stroke="#78350F" strokeWidth="2" transform="rotate(-15 22 46)" />
            <ellipse cx="78" cy="46" rx="9" ry="20" fill="#92400E" stroke="#78350F" strokeWidth="2" transform="rotate(15 78 46)" />
            {/* Head */}
            <circle cx="50" cy="50" r="32" fill="#D97706" stroke="#92400E" strokeWidth="2.5" />
            {/* Muzzle */}
            <ellipse cx="50" cy="60" rx="16" ry="12" fill="#FEF3C7" stroke="#92400E" strokeWidth="1" />
            <ellipse cx="50" cy="54" rx="5" ry="3.5" fill="#1E293B" />
            <path d="M50 56 L50 62 M46 62 Q50 66 54 62" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
            {/* Eyes */}
            <circle cx="38" cy="44" r="4" fill="#1E293B" />
            <circle cx="37" cy="43" r="1.3" fill="#FFFFFF" />
            <circle cx="62" cy="44" r="4" fill="#1E293B" />
            <circle cx="61" cy="43" r="1.3" fill="#FFFFFF" />
            {/* Cheeks */}
            <circle cx="30" cy="54" r="3.5" fill="#F43F5E" opacity="0.5" />
            <circle cx="70" cy="54" r="3.5" fill="#F43F5E" opacity="0.5" />
          </svg>
        );
      }

      case 'cat': {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Pointy Ears */}
            <polygon points="24,20 18,50 44,38" fill="#F97316" stroke="#C2410C" strokeWidth="2" />
            <polygon points="26,26 22,46 40,38" fill="#FDBA74" />
            <polygon points="76,20 82,50 56,38" fill="#F97316" stroke="#C2410C" strokeWidth="2" />
            <polygon points="74,26 78,46 60,38" fill="#FDBA74" />
            {/* Head */}
            <circle cx="50" cy="54" r="32" fill="#F97316" stroke="#C2410C" strokeWidth="2.5" />
            {/* Whiskers */}
            <line x1="20" y1="58" x2="36" y2="60" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="20" y1="66" x2="36" y2="64" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="80" y1="58" x2="64" y2="60" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="80" y1="66" x2="64" y2="64" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" />
            {/* Nose & Mouth */}
            <polygon points="50,60 46,56 54,56" fill="#F43F5E" />
            <path d="M46 62 Q50 66 54 62" stroke="#78350F" strokeWidth="2" strokeLinecap="round" fill="none" />
            {/* Big Eyes */}
            <circle cx="38" cy="48" r="4.5" fill="#1E293B" />
            <circle cx="37" cy="46.5" r="1.5" fill="#FFFFFF" />
            <circle cx="62" cy="48" r="4.5" fill="#1E293B" />
            <circle cx="61" cy="46.5" r="1.5" fill="#FFFFFF" />
          </svg>
        );
      }

      case 'bunny': {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Long Ears */}
            <ellipse cx="36" cy="24" rx="8" ry="20" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="2" transform="rotate(-10 36 24)" />
            <ellipse cx="36" cy="24" rx="4" ry="14" fill="#F472B6" transform="rotate(-10 36 24)" />
            <ellipse cx="64" cy="24" rx="8" ry="20" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="2" transform="rotate(10 64 24)" />
            <ellipse cx="64" cy="24" rx="4" ry="14" fill="#F472B6" transform="rotate(10 64 24)" />
            {/* Head */}
            <circle cx="50" cy="60" r="28" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="2.5" />
            {/* Nose */}
            <circle cx="50" cy="62" r="3" fill="#F43F5E" />
            <path d="M46 66 Q50 70 54 66" stroke="#64748B" strokeWidth="2" strokeLinecap="round" fill="none" />
            {/* Eyes */}
            <circle cx="40" cy="54" r="3.5" fill="#1E293B" />
            <circle cx="60" cy="54" r="3.5" fill="#1E293B" />
            {/* Cheeks */}
            <circle cx="34" cy="62" r="3" fill="#F43F5E" opacity="0.5" />
            <circle cx="66" cy="62" r="3" fill="#F43F5E" opacity="0.5" />
          </svg>
        );
      }

      case 'lion': {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Big Orange Mane */}
            <circle cx="50" cy="50" r="38" fill="#EA580C" stroke="#C2410C" strokeWidth="2" />
            {/* Ears */}
            <circle cx="28" cy="28" r="10" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
            <circle cx="72" cy="28" r="10" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
            {/* Face */}
            <circle cx="50" cy="52" r="26" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
            {/* Muzzle */}
            <ellipse cx="50" cy="58" rx="11" ry="8" fill="#FEF3C7" />
            <polygon points="50,54 46,50 54,50" fill="#78350F" />
            <path d="M50 54 L50 59 M47 59 Q50 63 53 59" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            {/* Eyes */}
            <circle cx="41" cy="46" r="3.5" fill="#1E293B" />
            <circle cx="59" cy="46" r="3.5" fill="#1E293B" />
          </svg>
        );
      }

      case 'frog': {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Bulging Eyes Base */}
            <circle cx="32" cy="34" r="14" fill="#22C55E" stroke="#15803D" strokeWidth="2" />
            <circle cx="68" cy="34" r="14" fill="#22C55E" stroke="#15803D" strokeWidth="2" />
            <circle cx="32" cy="34" r="7" fill="#FFFFFF" />
            <circle cx="32" cy="34" r="4" fill="#1E293B" />
            <circle cx="68" cy="34" r="7" fill="#FFFFFF" />
            <circle cx="68" cy="34" r="4" fill="#1E293B" />
            {/* Face Body */}
            <ellipse cx="50" cy="58" rx="36" ry="26" fill="#22C55E" stroke="#15803D" strokeWidth="2.5" />
            {/* Big Friendly Smile */}
            <path d="M28 60 Q50 78 72 60" stroke="#15803D" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            {/* Rosy Cheeks */}
            <circle cx="28" cy="56" r="4" fill="#F43F5E" opacity="0.6" />
            <circle cx="72" cy="56" r="4" fill="#F43F5E" opacity="0.6" />
          </svg>
        );
      }

      // ----------------------------------------------------------------------
      // VEHICLES
      // ----------------------------------------------------------------------
      case 'bus': {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Bus Body */}
            <rect x="10" y="24" width="80" height="48" rx="10" fill="#FACC15" stroke="#CA8A04" strokeWidth="2.5" />
            {/* Roof / Stripe */}
            <line x1="10" y1="52" x2="90" y2="52" stroke="#EAB308" strokeWidth="3" />
            {/* Windows */}
            <rect x="18" y="32" width="18" height="15" rx="3" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" />
            <rect x="41" y="32" width="18" height="15" rx="3" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" />
            <rect x="64" y="32" width="18" height="15" rx="3" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" />
            {/* Headlights */}
            <circle cx="86" cy="58" r="3.5" fill="#FFFFFF" stroke="#CA8A04" strokeWidth="1" />
            {/* Wheels */}
            <circle cx="28" cy="72" r="12" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
            <circle cx="28" cy="72" r="5" fill="#E2E8F0" />
            <circle cx="72" cy="72" r="12" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
            <circle cx="72" cy="72" r="5" fill="#E2E8F0" />
          </svg>
        );
      }

      case 'train': {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Smokestack */}
            <rect x="70" y="20" width="10" height="16" fill="#475569" stroke="#1E293B" strokeWidth="1.5" />
            <ellipse cx="75" cy="18" rx="8" ry="4" fill="#64748B" stroke="#1E293B" strokeWidth="1.5" />
            {/* Cabin */}
            <rect x="14" y="28" width="36" height="42" rx="5" fill="#EF4444" stroke="#B91C1C" strokeWidth="2.5" />
            <rect x="22" y="34" width="20" height="16" rx="3" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" />
            {/* Boiler */}
            <rect x="48" y="36" width="38" height="34" rx="4" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2.5" />
            {/* Wheels */}
            <circle cx="28" cy="74" r="11" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
            <circle cx="54" cy="74" r="11" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
            <circle cx="76" cy="74" r="11" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
          </svg>
        );
      }

      case 'plane': {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Wings */}
            <ellipse cx="50" cy="50" rx="38" ry="12" fill="#60A5FA" stroke="#2563EB" strokeWidth="2" transform="rotate(-20 50 50)" />
            {/* Fuselage */}
            <ellipse cx="50" cy="50" rx="14" ry="42" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2.5" transform="rotate(45 50 50)" />
            {/* Cockpit Window */}
            <ellipse cx="68" cy="32" rx="6" ry="8" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5" transform="rotate(45 68 32)" />
            {/* Tail Fin */}
            <polygon points="26,74 20,88 38,82" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
          </svg>
        );
      }

      case 'star': {
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <polygon
              points="50,8 62,34 92,38 70,59 76,88 50,74 24,88 30,59 8,38 38,34"
              fill="#FACC15"
              stroke="#CA8A04"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <circle cx="41" cy="48" r="3.8" fill="#1E293B" />
            <circle cx="59" cy="48" r="3.8" fill="#1E293B" />
            <path d="M44 56 Q50 62 56 56" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <circle cx="34" cy="54" r="3" fill="#F43F5E" opacity="0.6" />
            <circle cx="66" cy="54" r="3" fill="#F43F5E" opacity="0.6" />
          </svg>
        );
      }

      default:
        return (
          <div className="w-full h-full flex items-center justify-center text-3xl">
            ⭐
          </div>
        );
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none transition-transform ${baseSizeMap[size]} ${scaleClass} ${className}`}
      aria-label={item.name}
    >
      {renderSvg()}
    </div>
  );
};
