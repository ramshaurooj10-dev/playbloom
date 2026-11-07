import React from 'react';

interface SortItFunIconProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const SortItFunIcon: React.FC<SortItFunIconProps> = ({
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${sizeMap[size]} ${className}`}
      aria-label="Sort It Fun Icon"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm overflow-visible"
      >
        <defs>
          {/* Circular Badge Background Gradient - Soft Lavender/Pinkish Backdrop */}
          <linearGradient id="sifBgGrad" x1="15" y1="10" x2="85" y2="90" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FDF2F8" />
            <stop offset="0.5" stopColor="#FCE7F3" />
            <stop offset="1" stopColor="#FBCFE8" />
          </linearGradient>

          {/* Left Basket (Cool Sky Blue / Cyan) */}
          <linearGradient id="sifLeftBasketGrad" x1="20" y1="52" x2="45" y2="90" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38BDF8" />
            <stop offset="0.7" stopColor="#0284C7" />
            <stop offset="1" stopColor="#0369A1" />
          </linearGradient>
          <linearGradient id="sifLeftRimGrad" x1="16" y1="50" x2="48" y2="58" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7DD3FC" />
            <stop offset="1" stopColor="#0284C7" />
          </linearGradient>

          {/* Right Basket (Sunny Amber / Golden Orange) */}
          <linearGradient id="sifRightBasketGrad" x1="55" y1="52" x2="80" y2="90" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FBBF24" />
            <stop offset="0.7" stopColor="#F59E0B" />
            <stop offset="1" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="sifRightRimGrad" x1="52" y1="50" x2="84" y2="58" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FDE68A" />
            <stop offset="1" stopColor="#F59E0B" />
          </linearGradient>

          {/* Red Apple Gradient */}
          <radialGradient id="sifAppleGrad" cx="38%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#FDA4AF" />
            <stop offset="55%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#991B1B" />
          </radialGradient>

          {/* Red Ball Gradient */}
          <radialGradient id="sifRedBallGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FECDD3" />
            <stop offset="50%" stopColor="#F43F5E" />
            <stop offset="100%" stopColor="#BE123C" />
          </radialGradient>

          {/* Yellow Banana Gradient */}
          <linearGradient id="sifBananaGrad" x1="55" y1="18" x2="78" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FEF08A" />
            <stop offset="0.6" stopColor="#FACC15" />
            <stop offset="1" stopColor="#CA8A04" />
          </linearGradient>

          {/* Yellow Ball Gradient */}
          <radialGradient id="sifYellowBallGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FEF9C3" />
            <stop offset="55%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#D97706" />
          </radialGradient>

          {/* Basket Weave Shadow Pattern */}
          <linearGradient id="sifBasketInnerShadow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0F172A" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 1. Backdrop circle with playful border */}
        <circle cx="50" cy="50" r="46" fill="url(#sifBgGrad)" stroke="#FFFFFF" strokeWidth="3.5" />
        <circle cx="50" cy="50" r="43.5" fill="none" stroke="#F472B6" strokeWidth="1" strokeDasharray="3 2" />

        {/* Background Sparkles / Joy dots */}
        <circle cx="16" cy="24" r="2" fill="#EC4899" />
        <circle cx="84" cy="22" r="2.5" fill="#3B82F6" />
        <circle cx="86" cy="72" r="1.8" fill="#F59E0B" />
        <circle cx="14" cy="68" r="2" fill="#8B5CF6" />
        <path d="M48 10 L50 13 L53 14 L50 15 L48 18 L46 15 L43 14 L46 13 Z" fill="#FFFFFF" opacity="0.9" />

        {/* ========================================================================= */}
        {/* 2. BASKETS (Left: Red/Apple-Red Target & Right: Yellow/Banana-Yellow Target)*/}
        {/* ========================================================================= */}

        {/* LEFT CONTAINER (Blue bucket with Red Tag icon) */}
        <g id="sif-left-basket">
          {/* Basket Body */}
          <path
            d="M17 56 L22 84 C22.5 87 25 89 28 89 L38 89 C41 89 43.5 87 44 84 L49 56 Z"
            fill="url(#sifLeftBasketGrad)"
            stroke="#0369A1"
            strokeWidth="1.8"
          />
          {/* Weave Lines */}
          <path d="M22 66 Q33 70 44 66" stroke="#BAE6FD" strokeWidth="1.2" fill="none" opacity="0.6" strokeLinecap="round" />
          <path d="M24 76 Q33 80 42 76" stroke="#BAE6FD" strokeWidth="1.2" fill="none" opacity="0.6" strokeLinecap="round" />
          {/* Basket Rim */}
          <ellipse cx="33" cy="56" rx="16" ry="5.5" fill="url(#sifLeftRimGrad)" stroke="#0369A1" strokeWidth="1.8" />
          <ellipse cx="33" cy="56" rx="12" ry="3.5" fill="#0284C7" />
          {/* Small Category Badge on Front (Red Circle icon) */}
          <circle cx="33" cy="73" r="5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="32" cy="71.5" r="1.2" fill="#FFFFFF" />
        </g>

        {/* RIGHT CONTAINER (Yellow/Golden basket with Yellow Tag icon) */}
        <g id="sif-right-basket">
          {/* Basket Body */}
          <path
            d="M51 56 L56 84 C56.5 87 59 89 62 89 L72 89 C75 89 77.5 87 78 84 L83 56 Z"
            fill="url(#sifRightBasketGrad)"
            stroke="#B45309"
            strokeWidth="1.8"
          />
          {/* Weave Lines */}
          <path d="M56 66 Q67 70 78 66" stroke="#FEF08A" strokeWidth="1.2" fill="none" opacity="0.7" strokeLinecap="round" />
          <path d="M58 76 Q67 80 76 76" stroke="#FEF08A" strokeWidth="1.2" fill="none" opacity="0.7" strokeLinecap="round" />
          {/* Basket Rim */}
          <ellipse cx="67" cy="56" rx="16" ry="5.5" fill="url(#sifRightRimGrad)" stroke="#B45309" strokeWidth="1.8" />
          <ellipse cx="67" cy="56" rx="12" ry="3.5" fill="#D97706" />
          {/* Small Category Badge on Front (Yellow Circle icon) */}
          <circle cx="67" cy="73" r="5" fill="#FACC15" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="66" cy="71.5" r="1.2" fill="#FFFFFF" />
        </g>

        {/* ========================================================================= */}
        {/* 3. SORTING TRAJECTORY ARROWS & MOTION TRAILS                              */}
        {/* ========================================================================= */}
        {/* Left sorting motion trail (Red object sorting to left) */}
        <path
          d="M36 28 Q27 34 29 48"
          stroke="#EF4444"
          strokeWidth="2"
          strokeDasharray="2.5 2.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.85"
        />
        <polygon points="27,47 31,52 33,46" fill="#EF4444" />

        {/* Right sorting motion trail (Yellow object sorting to right) */}
        <path
          d="M64 26 Q74 34 71 48"
          stroke="#F59E0B"
          strokeWidth="2"
          strokeDasharray="2.5 2.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.85"
        />
        <polygon points="69,46 71,52 75,47" fill="#F59E0B" />

        {/* ========================================================================= */}
        {/* 4. SORTED OBJECTS (Inside / Landing in baskets)                           */}
        {/* ========================================================================= */}

        {/* Red Ball already in Left Basket */}
        <g id="sif-red-ball-in-basket" transform="translate(23, 44)">
          <circle cx="8" cy="8" r="7" fill="url(#sifRedBallGrad)" stroke="#9F1239" strokeWidth="1.2" />
          <circle cx="6" cy="5.5" r="2" fill="#FFFFFF" opacity="0.75" />
          {/* Star decal on ball */}
          <polygon points="8,5 9,7 11,7.5 9.5,9 10,11 8,10 6,11 6.5,9 5,7.5 7,7" fill="#FDE047" />
        </g>

        {/* Yellow Ball already in Right Basket */}
        <g id="sif-yellow-ball-in-basket" transform="translate(68, 45)">
          <circle cx="8" cy="8" r="7" fill="url(#sifYellowBallGrad)" stroke="#B45309" strokeWidth="1.2" />
          <circle cx="6" cy="5.5" r="2" fill="#FFFFFF" opacity="0.8" />
          {/* Star decal on ball */}
          <polygon points="8,5 9,7 11,7.5 9.5,9 10,11 8,10 6,11 6.5,9 5,7.5 7,7" fill="#EF4444" />
        </g>

        {/* ========================================================================= */}
        {/* 5. ACTIVE OBJECTS BEING SORTED (In Air / Sorting)                        */}
        {/* ========================================================================= */}

        {/* TOP LEFT: RED SHINY APPLE (Sorting into Left basket) */}
        <g id="sif-red-apple" transform="translate(18, 14)">
          {/* Apple Body */}
          <path
            d="M14 6 C10 1 4 2 2 8 C0 14 3 22 10 24 C12 24.5 14 23 14 23 C14 23 16 24.5 18 24 C25 22 28 14 26 8 C24 2 18 1 14 6 Z"
            fill="url(#sifAppleGrad)"
            stroke="#7F1D1D"
            strokeWidth="1.5"
          />
          {/* Apple Stem */}
          <path d="M14 6 Q16 1 19 0" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          {/* Apple Green Leaf */}
          <path d="M14 5 Q19 3 20 6 Q17 8 14 5 Z" fill="#22C55E" stroke="#15803D" strokeWidth="1" />
          {/* Glossy Highlight */}
          <ellipse cx="7" cy="10" rx="3" ry="5.5" fill="#FFFFFF" opacity="0.6" transform="rotate(-20 7 10)" />
        </g>

        {/* TOP RIGHT: YELLOW SWEET BANANA (Sorting into Right basket) */}
        <g id="sif-yellow-banana" transform="translate(56, 12)">
          {/* Banana Curved Body */}
          <path
            d="M3 24 C8 24 22 22 26 8 C27 4 25 1 23 2 C18 10 10 16 2 19 C0 19.5 0 23.5 3 24 Z"
            fill="url(#sifBananaGrad)"
            stroke="#854D0E"
            strokeWidth="1.4"
          />
          {/* Banana Stem Tip */}
          <rect x="23" y="1" width="3" height="3" rx="1" fill="#65A30D" stroke="#3F6212" strokeWidth="0.8" />
          {/* Banana Bottom Tip */}
          <circle cx="2" cy="21.5" r="1.5" fill="#713F12" />
          {/* Highlight line */}
          <path d="M7 19 Q15 15 21 8" stroke="#FEF9C3" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.75" />
        </g>

        {/* Center Top Floating Sort Sparkle Icon */}
        <g transform="translate(43, 24)">
          <circle cx="7" cy="7" r="6.5" fill="#FFFFFF" stroke="#EC4899" strokeWidth="1.5" />
          {/* Small 2-way sorting arrows icon */}
          <path d="M4 6 L2.5 7.5 L4 9 M2.5 7.5 L11.5 7.5 M10 6 L11.5 7.5 L10 9" stroke="#DB2777" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
};
