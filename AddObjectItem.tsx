import React from 'react';

export type ObjectType = 'ice_cream' | 'teddy' | 'toy_car' | 'candy' | 'lollipop';

interface AddObjectItemProps {
  type: ObjectType;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AddObjectItem: React.FC<AddObjectItemProps> = ({
  type,
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-14 h-14 sm:w-16 sm:h-16',
    md: 'w-18 h-18 sm:w-22 sm:h-22',
    lg: 'w-22 h-22 sm:w-26 sm:h-26',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${sizeClasses[size]} ${className}`}
    >
      {type === 'ice_cream' && (
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-md overflow-visible"
        >
          <defs>
            <radialGradient id="aiPinkScoop" cx="38%" cy="32%" r="65%">
              <stop offset="0%" stopColor="#FDA4AF" />
              <stop offset="60%" stopColor="#F43F5E" />
              <stop offset="100%" stopColor="#9F1239" />
            </radialGradient>
            <radialGradient id="aiMintScoop" cx="38%" cy="32%" r="65%">
              <stop offset="0%" stopColor="#7DD3FC" />
              <stop offset="60%" stopColor="#0EA5E9" />
              <stop offset="100%" stopColor="#0369A1" />
            </radialGradient>
            <linearGradient id="aiCone" x1="50" y1="48" x2="50" y2="92" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FDE68A" />
              <stop offset="0.6" stopColor="#F59E0B" />
              <stop offset="1" stopColor="#B45309" />
            </linearGradient>
          </defs>

          {/* Cone */}
          <polygon points="28,52 72,52 50,94" fill="url(#aiCone)" stroke="#78350F" strokeWidth="2.5" />
          {/* Cone Waffle Lines */}
          <line x1="36" y1="52" x2="56" y2="78" stroke="#78350F" strokeWidth="1.6" opacity="0.6" strokeLinecap="round" />
          <line x1="48" y1="52" x2="60" y2="67" stroke="#78350F" strokeWidth="1.6" opacity="0.6" strokeLinecap="round" />
          <line x1="64" y1="52" x2="44" y2="78" stroke="#78350F" strokeWidth="1.6" opacity="0.6" strokeLinecap="round" />
          <line x1="52" y1="52" x2="40" y2="67" stroke="#78350F" strokeWidth="1.6" opacity="0.6" strokeLinecap="round" />

          {/* Bottom Scoop (Mint) */}
          <ellipse cx="50" cy="50" rx="26" ry="14" fill="url(#aiMintScoop)" stroke="#075985" strokeWidth="2" />
          <circle cx="33" cy="52" r="6" fill="#38BDF8" />
          <circle cx="50" cy="54" r="6" fill="#38BDF8" />
          <circle cx="67" cy="52" r="6" fill="#38BDF8" />

          {/* Top Scoop (Strawberry) */}
          <circle cx="50" cy="33" r="22" fill="url(#aiPinkScoop)" stroke="#881337" strokeWidth="2.5" />
          <ellipse cx="43" cy="24" rx="7" ry="3.5" fill="#FFFFFF" opacity="0.6" />

          {/* Sprinkles */}
          <rect x="42" y="22" width="5" height="2" rx="1" fill="#FDE047" transform="rotate(25 42 22)" />
          <rect x="58" y="24" width="5" height="2" rx="1" fill="#86EFAC" transform="rotate(-35 58 24)" />
          <rect x="50" y="36" width="5" height="2" rx="1" fill="#FFFFFF" transform="rotate(10 50 36)" />

          {/* Cherry on Top */}
          <circle cx="50" cy="12" r="7" fill="#DC2626" stroke="#991B1B" strokeWidth="1.8" />
          <circle cx="47.5" cy="9.5" r="2" fill="#FFFFFF" />
          <path d="M50 8 Q58 -2 64 2" stroke="#15803D" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      )}

      {type === 'teddy' && (
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-md overflow-visible"
        >
          <defs>
            <radialGradient id="aiTeddyFur" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="60%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </radialGradient>
            <radialGradient id="aiTeddyEarInner" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FBCFE8" />
              <stop offset="100%" stopColor="#F472B6" />
            </radialGradient>
          </defs>

          {/* Left Ear */}
          <circle cx="28" cy="24" r="13" fill="url(#aiTeddyFur)" stroke="#78350F" strokeWidth="2.2" />
          <circle cx="28" cy="24" r="7" fill="url(#aiTeddyEarInner)" />

          {/* Right Ear */}
          <circle cx="72" cy="24" r="13" fill="url(#aiTeddyFur)" stroke="#78350F" strokeWidth="2.2" />
          <circle cx="72" cy="24" r="7" fill="url(#aiTeddyEarInner)" />

          {/* Body / Paws */}
          <ellipse cx="50" cy="74" rx="25" ry="20" fill="url(#aiTeddyFur)" stroke="#78350F" strokeWidth="2.5" />
          <circle cx="50" cy="74" r="12" fill="#FEF3C7" stroke="#D97706" strokeWidth="1" />
          {/* Feet */}
          <circle cx="28" cy="85" r="9" fill="url(#aiTeddyFur)" stroke="#78350F" strokeWidth="2" />
          <circle cx="28" cy="85" r="4.5" fill="#FBCFE8" />
          <circle cx="72" cy="85" r="9" fill="url(#aiTeddyFur)" stroke="#78350F" strokeWidth="2" />
          <circle cx="72" cy="85" r="4.5" fill="#FBCFE8" />

          {/* Head */}
          <circle cx="50" cy="45" r="26" fill="url(#aiTeddyFur)" stroke="#78350F" strokeWidth="2.5" />

          {/* Snout */}
          <ellipse cx="50" cy="52" rx="13" ry="10" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
          {/* Nose */}
          <polygon points="46,47 54,47 50,52" fill="#78350F" stroke="#451A03" strokeWidth="1" />
          <path d="M50 52 L50 56 M46 56 Q50 59 54 56" stroke="#78350F" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* Eyes */}
          <circle cx="39" cy="40" r="3.8" fill="#1E1B4B" />
          <circle cx="37.5" cy="38.5" r="1.4" fill="#FFFFFF" />
          <circle cx="61" cy="40" r="3.8" fill="#1E1B4B" />
          <circle cx="59.5" cy="38.5" r="1.4" fill="#FFFFFF" />

          {/* Cheeks */}
          <circle cx="33" cy="48" r="4" fill="#FDA4AF" opacity="0.75" />
          <circle cx="67" cy="48" r="4" fill="#FDA4AF" opacity="0.75" />

          {/* Cute Red Bow */}
          <g transform="translate(50, 67)">
            <ellipse cx="-7" cy="0" rx="6" ry="4" fill="#EF4444" stroke="#991B1B" strokeWidth="1.2" />
            <ellipse cx="7" cy="0" rx="6" ry="4" fill="#EF4444" stroke="#991B1B" strokeWidth="1.2" />
            <circle cx="0" cy="0" r="3" fill="#FBBF24" stroke="#B45309" strokeWidth="1" />
          </g>
        </svg>
      )}

      {type === 'toy_car' && (
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-md overflow-visible"
        >
          <defs>
            <linearGradient id="aiCarRed" x1="10" y1="25" x2="90" y2="75" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F87171" />
              <stop offset="0.5" stopColor="#EF4444" />
              <stop offset="1" stopColor="#B91C1C" />
            </linearGradient>
            <linearGradient id="aiCarWindow" x1="30" y1="30" x2="70" y2="50" gradientUnits="userSpaceOnUse">
              <stop stopColor="#E0F2FE" />
              <stop offset="1" stopColor="#7DD3FC" />
            </linearGradient>
          </defs>

          {/* Car Body (Rounded Bubble Car) */}
          {/* Main Cabin & Hood */}
          <path
            d="M12 64 C12 55 18 52 26 52 L34 32 C38 24 64 24 70 32 L82 52 C90 52 94 56 94 65 C94 72 88 74 82 74 L18 74 C13 74 12 70 12 64 Z"
            fill="url(#aiCarRed)"
            stroke="#7F1D1D"
            strokeWidth="2.5"
          />

          {/* Front / Back Bumpers */}
          <rect x="8" y="66" width="6" height="7" rx="3" fill="#CBD5E1" stroke="#475569" strokeWidth="1.2" />
          <rect x="90" y="66" width="6" height="7" rx="3" fill="#CBD5E1" stroke="#475569" strokeWidth="1.2" />

          {/* Windows */}
          <path
            d="M37 35 C40 28 50 28 50 35 L50 49 L32 49 Z"
            fill="url(#aiCarWindow)"
            stroke="#0284C7"
            strokeWidth="1.5"
          />
          <path
            d="M54 35 C54 28 64 28 67 35 L76 49 L54 49 Z"
            fill="url(#aiCarWindow)"
            stroke="#0284C7"
            strokeWidth="1.5"
          />

          {/* Headlights */}
          <circle cx="89" cy="58" r="4.5" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
          <circle cx="15" cy="58" r="3.5" fill="#FDA4AF" stroke="#E11D48" strokeWidth="1" />

          {/* Yellow Star Decal on Door */}
          <path
            d="M52 56 L53.5 59.5 L57 60 L54.5 62.5 L55 66 L52 64.5 L49 66 L49.5 62.5 L47 60 L50.5 59.5 Z"
            fill="#FDE047"
            stroke="#CA8A04"
            strokeWidth="0.8"
          />

          {/* Wheels */}
          {/* Back Wheel */}
          <circle cx="28" cy="74" r="12" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
          <circle cx="28" cy="74" r="6" fill="#94A3B8" stroke="#475569" strokeWidth="1.5" />
          <circle cx="28" cy="74" r="2" fill="#F8FAFC" />

          {/* Front Wheel */}
          <circle cx="74" cy="74" r="12" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
          <circle cx="74" cy="74" r="6" fill="#94A3B8" stroke="#475569" strokeWidth="1.5" />
          <circle cx="74" cy="74" r="2" fill="#F8FAFC" />
        </svg>
      )}

      {type === 'candy' && (
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-md overflow-visible"
        >
          <defs>
            <radialGradient id="aiCandyGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#F472B6" />
              <stop offset="60%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#9D174D" />
            </radialGradient>
            <linearGradient id="aiCandyWrapperL" x1="10" y1="20" x2="30" y2="80" gradientUnits="userSpaceOnUse">
              <stop stopColor="#A78BFA" />
              <stop offset="1" stopColor="#7C3AED" />
            </linearGradient>
            <linearGradient id="aiCandyWrapperR" x1="70" y1="20" x2="90" y2="80" gradientUnits="userSpaceOnUse">
              <stop stopColor="#A78BFA" />
              <stop offset="1" stopColor="#7C3AED" />
            </linearGradient>
          </defs>

          {/* Left Wrapper Fan */}
          <polygon
            points="32,50 8,24 16,50 8,76"
            fill="url(#aiCandyWrapperL)"
            stroke="#5B21B6"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Right Wrapper Fan */}
          <polygon
            points="68,50 92,24 84,50 92,76"
            fill="url(#aiCandyWrapperR)"
            stroke="#5B21B6"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Center Sweet Round / Pillow */}
          <ellipse cx="50" cy="50" rx="26" ry="20" fill="url(#aiCandyGrad)" stroke="#831843" strokeWidth="2.5" />

          {/* White Candy Stripes */}
          <path
            d="M38 32 Q42 50 38 68"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M50 30 Q54 50 50 70"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M62 32 Q66 50 62 68"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Sparkle on Candy */}
          <circle cx="45" cy="40" r="2.5" fill="#FFFFFF" />
          <circle cx="55" cy="44" r="1.5" fill="#FFFFFF" />
        </svg>
      )}

      {type === 'lollipop' && (
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-md overflow-visible"
        >
          <defs>
            <radialGradient id="aiLollipopHead" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="45%" stopColor="#F59E0B" />
              <stop offset="85%" stopColor="#EA580C" />
              <stop offset="100%" stopColor="#9A3412" />
            </radialGradient>
          </defs>

          {/* White Plastic Stick */}
          <rect x="46" y="48" width="8" height="46" rx="4" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.8" />

          {/* Cute Ribbon Bow on Stick */}
          <g transform="translate(50, 54)">
            <ellipse cx="-8" cy="0" rx="7" ry="4" fill="#06B6D4" stroke="#0891B2" strokeWidth="1.2" />
            <ellipse cx="8" cy="0" rx="7" ry="4" fill="#06B6D4" stroke="#0891B2" strokeWidth="1.2" />
            <circle cx="0" cy="0" r="3" fill="#FDE047" stroke="#D97706" strokeWidth="1" />
          </g>

          {/* Big Round Swirl Lollipop Head */}
          <circle cx="50" cy="32" r="26" fill="url(#aiLollipopHead)" stroke="#7C2D12" strokeWidth="2.5" />

          {/* Rainbow / White Swirls */}
          <path
            d="M50 32 Q62 20 50 12 Q36 20 50 32 Q64 44 50 52 Q34 44 50 32"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M50 32 Q42 24 50 20 Q58 24 50 32 Q42 40 50 44 Q58 40 50 32"
            stroke="#EF4444"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="50" cy="32" r="4" fill="#FFFFFF" />

          {/* Glossy Reflection Highlight */}
          <ellipse cx="40" cy="22" rx="7" ry="3.5" fill="#FFFFFF" opacity="0.65" transform="rotate(-30 40 22)" />
        </svg>
      )}
    </div>
  );
};
