import React from 'react';

interface FishHuntingIconProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const FishHuntingIcon: React.FC<FishHuntingIconProps> = ({
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
      aria-label="Fish Hunting Icon"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm overflow-visible"
      >
        <defs>
          <linearGradient id="fishWaterGrad" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38BDF8" />
            <stop offset="0.6" stopColor="#0284C7" />
            <stop offset="1" stopColor="#0369A1" />
          </linearGradient>

          <linearGradient id="fishOrangeGrad" x1="20" y1="25" x2="75" y2="70" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FDBA74" />
            <stop offset="0.3" stopColor="#FB923C" />
            <stop offset="1" stopColor="#EA580C" />
          </linearGradient>

          <linearGradient id="fishFinGrad" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#FED7AA" />
            <stop offset="1" stopColor="#F97316" />
          </linearGradient>

          <linearGradient id="fishBubbleGrad" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="0.5" stopColor="#BAE6FD" stopOpacity="0.7" />
            <stop offset="1" stopColor="#38BDF8" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Circular underwater portal background */}
        <circle cx="50" cy="50" r="46" fill="url(#fishWaterGrad)" stroke="#E0F2FE" strokeWidth="3" />

        {/* Small background sea plants */}
        <path d="M16 88 Q20 68 15 52 Q22 68 24 88" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round" opacity="0.85" />
        <path d="M84 88 Q78 72 82 58 Q88 74 86 88" stroke="#34D399" strokeWidth="3.5" strokeLinecap="round" opacity="0.85" />

        {/* Tail Fin */}
        <path
          d="M24 50 C12 34, 8 42, 12 50 C8 58, 12 66, 24 50 Z"
          fill="url(#fishFinGrad)"
          stroke="#C2410C"
          strokeWidth="1.8"
        />

        {/* Dorsal Fin (Top) */}
        <path
          d="M44 32 C50 20, 62 24, 66 35 Z"
          fill="url(#fishFinGrad)"
          stroke="#C2410C"
          strokeWidth="1.8"
        />

        {/* Ventral Fin (Bottom) */}
        <path
          d="M48 68 C54 78, 62 76, 62 66 Z"
          fill="url(#fishFinGrad)"
          stroke="#C2410C"
          strokeWidth="1.8"
        />

        {/* Main Fish Body (Plump, Cute Oval) */}
        <ellipse
          cx="52"
          cy="50"
          rx="28"
          ry="20"
          fill="url(#fishOrangeGrad)"
          stroke="#C2410C"
          strokeWidth="2.2"
        />

        {/* White decorative belly / stripes */}
        <path
          d="M44 34 C48 42, 48 58, 44 66"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.9"
        />
        <path
          d="M56 32 C60 40, 60 60, 56 68"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* Pectoral Side Fin */}
        <path
          d="M46 52 C52 50, 56 56, 48 60 Z"
          fill="#FED7AA"
          stroke="#EA580C"
          strokeWidth="1.5"
        />

        {/* Big Cute Eye */}
        <circle cx="68" cy="45" r="6.5" fill="#FFFFFF" stroke="#C2410C" strokeWidth="1.5" />
        <circle cx="69.5" cy="45" r="3.8" fill="#1E293B" />
        <circle cx="71" cy="43.5" r="1.5" fill="#FFFFFF" />

        {/* Cute Cheek Blush */}
        <ellipse cx="64" cy="53" rx="3.5" ry="2" fill="#F43F5E" opacity="0.6" />

        {/* Cute Smile / Mouth */}
        <path
          d="M78 50 Q75 53 73 50"
          stroke="#991B1B"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Floating Bubbles */}
        <circle cx="82" cy="36" r="4" fill="url(#fishBubbleGrad)" stroke="#FFFFFF" strokeWidth="1" />
        <circle cx="88" cy="26" r="2.5" fill="url(#fishBubbleGrad)" stroke="#FFFFFF" strokeWidth="0.8" />
        <circle cx="80" cy="18" r="5" fill="url(#fishBubbleGrad)" stroke="#FFFFFF" strokeWidth="1.2" />
        <circle cx="30" cy="22" r="3" fill="url(#fishBubbleGrad)" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.7" />

        {/* Sparkle */}
        <path
          d="M26 30 L27.5 26 L29 30 L33 31.5 L29 33 L27.5 37 L26 33 L22 31.5 Z"
          fill="#FDE047"
        />
      </svg>
    </div>
  );
};
