import React from 'react';

interface AddCountFunIconProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const AddCountFunIcon: React.FC<AddCountFunIconProps> = ({
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
      aria-label="Add & Count Fun Icon"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm overflow-visible"
      >
        <defs>
          {/* Circular Badge Background Gradient */}
          <linearGradient id="acfBgGrad" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FEF08A" />
            <stop offset="0.5" stopColor="#FDE047" />
            <stop offset="1" stopColor="#F59E0B" />
          </linearGradient>

          {/* Ice Cream Scoop Pink Gradient */}
          <radialGradient id="acfPinkScoop" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FDA4AF" />
            <stop offset="60%" stopColor="#F43F5E" />
            <stop offset="100%" stopColor="#BE123C" />
          </radialGradient>

          {/* Ice Cream Scoop Blue/Mint Gradient */}
          <radialGradient id="acfMintScoop" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#7DD3FC" />
            <stop offset="60%" stopColor="#0EA5E9" />
            <stop offset="100%" stopColor="#0369A1" />
          </radialGradient>

          {/* Waffle Cone Gradient */}
          <linearGradient id="acfConeGrad" x1="45" y1="52" x2="65" y2="86" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FDE68A" />
            <stop offset="0.5" stopColor="#F59E0B" />
            <stop offset="1" stopColor="#B45309" />
          </linearGradient>

          {/* Lollipop Swirl Red/White */}
          <radialGradient id="acfLollipopGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FCA5A5" />
            <stop offset="50%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#B91C1C" />
          </radialGradient>

          {/* Toy Duck / Bear Yellow/Orange Gradient */}
          <radialGradient id="acfToyGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="55%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#D97706" />
          </radialGradient>

          {/* Plus Sign Badge Gradient */}
          <radialGradient id="acfPlusGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#C4B5FD" />
            <stop offset="70%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#6D28D9" />
          </radialGradient>
        </defs>

        {/* 1. Backdrop circle with playful border */}
        <circle cx="50" cy="50" r="46" fill="url(#acfBgGrad)" stroke="#FFFFFF" strokeWidth="3.5" />
        <circle cx="50" cy="50" r="43.5" fill="none" stroke="#FBBF24" strokeWidth="1" strokeDasharray="3 2" />

        {/* Sparkles / Confetti Dots in Background */}
        <circle cx="20" cy="22" r="2.5" fill="#EC4899" />
        <circle cx="82" cy="24" r="2.5" fill="#3B82F6" />
        <circle cx="86" cy="62" r="2" fill="#10B981" />
        <circle cx="16" cy="68" r="2" fill="#8B5CF6" />
        <path d="M78 14 L80 18 L84 20 L80 22 L78 26 L76 22 L72 20 L76 18 Z" fill="#FFFFFF" opacity="0.9" />

        {/* ========================================================================= */}
        {/* 2. LOLLIPOP & CANDY (Left/Back Layer)                                      */}
        {/* ========================================================================= */}
        <g id="acf-lollipop" transform="translate(14, 26) rotate(-12)">
          {/* White Stick */}
          <rect x="15" y="24" width="4" height="26" rx="2" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1" />
          {/* Round Lollipop Head */}
          <circle cx="17" cy="15" r="14" fill="url(#acfLollipopGrad)" stroke="#FFFFFF" strokeWidth="1.8" />
          {/* Swirl lines on Lollipop */}
          <path d="M17 15 Q23 9 17 5 Q11 9 17 15" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M17 15 Q11 21 17 25 Q23 21 17 15" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <circle cx="17" cy="15" r="3" fill="#FFFFFF" />
          {/* Little Ribbon Bow on Stick */}
          <ellipse cx="14" cy="29" rx="3.5" ry="2" fill="#EC4899" />
          <ellipse cx="20" cy="29" rx="3.5" ry="2" fill="#EC4899" />
          <circle cx="17" cy="29" r="1.5" fill="#FDE047" />
        </g>

        {/* Wrapped Candy (Bottom Left) */}
        <g id="acf-wrapped-candy" transform="translate(10, 64) rotate(15)">
          <polygon points="4,9 0,4 0,14" fill="#A855F7" stroke="#7E22CE" strokeWidth="0.8" />
          <polygon points="18,9 22,4 22,14" fill="#A855F7" stroke="#7E22CE" strokeWidth="0.8" />
          <rect x="4" y="4" width="14" height="10" rx="5" fill="#C084FC" stroke="#7E22CE" strokeWidth="1" />
          <line x1="9" y1="4" x2="9" y2="14" stroke="#FFFFFF" strokeWidth="1.5" />
          <line x1="13" y1="4" x2="13" y2="14" stroke="#FFFFFF" strokeWidth="1.5" />
        </g>

        {/* ========================================================================= */}
        {/* 3. CUTE TOY (Cute Rubber Duckie / Teddy Toy - Center Left)                 */}
        {/* ========================================================================= */}
        <g id="acf-toy" transform="translate(18, 40)">
          {/* Duck Body */}
          <path
            d="M8 20 C8 12 18 10 26 14 C32 16 35 21 34 26 C33 31 28 34 20 34 C12 34 8 28 8 20 Z"
            fill="url(#acfToyGrad)"
            stroke="#B45309"
            strokeWidth="1.5"
          />
          {/* Duck Wing */}
          <path
            d="M16 22 C18 18 24 18 26 23 C24 26 18 26 16 22 Z"
            fill="#F59E0B"
            stroke="#B45309"
            strokeWidth="1"
          />
          {/* Duck Head */}
          <circle cx="28" cy="11" r="9" fill="url(#acfToyGrad)" stroke="#B45309" strokeWidth="1.5" />
          {/* Eye with sparkle */}
          <circle cx="30" cy="9.5" r="2.2" fill="#0F172A" />
          <circle cx="29.2" cy="8.5" r="0.8" fill="#FFFFFF" />
          {/* Cute Smile / Beak */}
          <path d="M35 11 Q41 12 36 15 Q34 14 35 11 Z" fill="#EA580C" stroke="#9A3412" strokeWidth="1" />
          {/* Little Top-Tuft */}
          <path d="M28 2 Q27 -1 25 1 Q26 3 28 3" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
        </g>

        {/* ========================================================================= */}
        {/* 4. DELICIOUS DOUBLE-SCOOP ICE CREAM CONE (Right Layer)                     */}
        {/* ========================================================================= */}
        <g id="acf-ice-cream" transform="translate(48, 16)">
          {/* Waffle Cone */}
          <polygon points="20,40 38,40 29,72" fill="url(#acfConeGrad)" stroke="#92400E" strokeWidth="1.5" />
          {/* Cone Waffle Grid Lines */}
          <line x1="23" y1="46" x2="33" y2="60" stroke="#78350F" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
          <line x1="26" y1="42" x2="31" y2="50" stroke="#78350F" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
          <line x1="35" y1="46" x2="25" y2="60" stroke="#78350F" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
          <line x1="32" y1="42" x2="27" y2="50" stroke="#78350F" strokeWidth="1" strokeLinecap="round" opacity="0.6" />

          {/* Bottom Mint Scoop */}
          <path
            d="M17 38 C17 28 41 28 41 38 C42 42 38 43 36 41 C34 43 30 43 28 41 C26 43 22 43 20 41 C18 43 16 41 17 38 Z"
            fill="url(#acfMintScoop)"
            stroke="#0284C7"
            strokeWidth="1.5"
          />

          {/* Top Strawberry Scoop */}
          <circle cx="29" cy="22" r="13" fill="url(#acfPinkScoop)" stroke="#9F1239" strokeWidth="1.5" />
          <ellipse cx="25" cy="18" rx="4" ry="2" fill="#FFFFFF" opacity="0.55" />

          {/* Drizzled Chocolate/Topping & Sprinkles */}
          <path d="M22 17 Q25 24 29 20 Q33 26 37 19" stroke="#BE123C" strokeWidth="2" strokeLinecap="round" fill="none" />
          <rect x="22" y="14" width="3" height="1.5" rx="0.7" fill="#FDE047" transform="rotate(20 22 14)" />
          <rect x="31" y="14" width="3" height="1.5" rx="0.7" fill="#FFFFFF" transform="rotate(-30 31 14)" />
          <rect x="27" y="24" width="3" height="1.5" rx="0.7" fill="#86EFAC" transform="rotate(45 27 24)" />

          {/* Cherry on Top */}
          <circle cx="29" cy="8" r="4.5" fill="#DC2626" stroke="#991B1B" strokeWidth="1.2" />
          <circle cx="27.5" cy="6.5" r="1.2" fill="#FFFFFF" />
          <path d="M29 6 Q34 0 38 3" stroke="#15803D" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </g>

        {/* ========================================================================= */}
        {/* 5. PLAYFUL COUNTING / ADD BADGES: "1 + 2 = 3" Bubble Badge (Bottom Right) */}
        {/* ========================================================================= */}
        <g id="acf-count-math-badge" transform="translate(52, 60)">
          {/* Rounded Math Pill */}
          <rect
            x="0"
            y="0"
            width="38"
            height="22"
            rx="11"
            fill="#FFFFFF"
            stroke="#7C3AED"
            strokeWidth="2.5"
            className="drop-shadow-md"
          />
          {/* Numbers: 1 + 2 */}
          <text
            x="7"
            y="15"
            fontSize="12"
            fontFamily="sans-serif"
            fontWeight="900"
            fill="#E11D48"
          >
            1
          </text>
          <text
            x="16"
            y="14"
            fontSize="10"
            fontFamily="sans-serif"
            fontWeight="900"
            fill="#7C3AED"
          >
            +
          </text>
          <text
            x="24"
            y="15"
            fontSize="12"
            fontFamily="sans-serif"
            fontWeight="900"
            fill="#0284C7"
          >
            2
          </text>
        </g>
      </svg>
    </div>
  );
};
