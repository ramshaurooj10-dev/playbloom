import React from 'react';

interface CleanRoomIconProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const CleanRoomIcon: React.FC<CleanRoomIconProps> = ({
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
      aria-label="Clean the Room Icon"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md overflow-visible"
      >
        <defs>
          {/* Room Background Gradient */}
          <linearGradient id="cleanRoomBg" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FDF2F8" />
            <stop offset="0.5" stopColor="#EEF2FF" />
            <stop offset="1" stopColor="#E0E7FF" />
          </linearGradient>

          {/* Wooden Floor Gradient */}
          <linearGradient id="floorWoodGrad" x1="0" y1="65" x2="0" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FDE68A" />
            <stop offset="1" stopColor="#D97706" />
          </linearGradient>

          {/* Bed Gradient */}
          <linearGradient id="bedCoverGrad" x1="10" y1="40" x2="45" y2="75" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38BDF8" />
            <stop offset="1" stopColor="#0284C7" />
          </linearGradient>

          {/* Toy Box Gradient */}
          <linearGradient id="toyBoxGrad" x1="55" y1="50" x2="90" y2="85" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FBBF24" />
            <stop offset="1" stopColor="#D97706" />
          </linearGradient>

          {/* Window Sky Gradient */}
          <linearGradient id="windowSky" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#7DD3FC" />
            <stop offset="1" stopColor="#BAE6FD" />
          </linearGradient>
        </defs>

        {/* Circular Room Badge Outline */}
        <circle cx="50" cy="50" r="46" fill="url(#cleanRoomBg)" stroke="#818CF8" strokeWidth="2.5" />

        {/* Room Floor */}
        <path
          d="M 6 68 Q 50 64 94 68 L 92 88 A 46 46 0 0 1 8 88 Z"
          fill="url(#floorWoodGrad)"
          stroke="#B45309"
          strokeWidth="1.2"
        />

        {/* Cozy Arched Window */}
        <rect x="36" y="16" width="28" height="24" rx="12" fill="url(#windowSky)" stroke="#93C5FD" strokeWidth="1.5" />
        <line x1="50" y1="16" x2="50" y2="40" stroke="#FFFFFF" strokeWidth="1.2" />
        <line x1="36" y1="28" x2="64" y2="28" stroke="#FFFFFF" strokeWidth="1.2" />
        <circle cx="56" cy="22" r="3" fill="#FBBF24" opacity="0.9" />

        {/* Cozy Bed (Left) */}
        {/* Headboard */}
        <rect x="14" y="44" width="8" height="24" rx="2" fill="#92400E" stroke="#78350F" strokeWidth="1" />
        {/* Pillow */}
        <rect x="22" y="48" width="10" height="7" rx="3.5" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.8" />
        {/* Mattress & Blanket */}
        <path
          d="M 20 54 L 46 54 L 46 66 L 20 66 Z"
          fill="url(#bedCoverGrad)"
          stroke="#0369A1"
          strokeWidth="1"
        />
        {/* Bed Post Left/Right */}
        <line x1="20" y1="66" x2="20" y2="72" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="46" y1="66" x2="46" y2="72" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" />

        {/* Open Cute Toy Box (Right) */}
        {/* Open Lid tilted */}
        <path
          d="M 54 48 L 84 42 L 85 45 L 55 51 Z"
          fill="#F59E0B"
          stroke="#B45309"
          strokeWidth="1"
        />
        {/* Box Body */}
        <rect x="56" y="52" width="28" height="18" rx="3" fill="url(#toyBoxGrad)" stroke="#B45309" strokeWidth="1.2" />
        {/* Box Front Stripe */}
        <rect x="58" y="59" width="24" height="4" fill="#FEF3C7" opacity="0.9" />
        {/* Teddy Bear peeking from Box */}
        <circle cx="66" cy="46" r="6" fill="#D97706" />
        <circle cx="62" cy="41" r="2.2" fill="#B45309" />
        <circle cx="70" cy="41" r="2.2" fill="#B45309" />
        <circle cx="64.5" cy="45.5" r="0.9" fill="#1E1B4B" />
        <circle cx="67.5" cy="45.5" r="0.9" fill="#1E1B4B" />
        <circle cx="66" cy="48" r="1.8" fill="#FDE68A" />
        <circle cx="66" cy="47.5" r="0.8" fill="#1E1B4B" />

        {/* Star/Ball near the box */}
        <circle cx="80" cy="48" r="4" fill="#EC4899" stroke="#BE185D" strokeWidth="0.8" />
        <path d="M 78 48 Q 80 45 82 48" stroke="#FFFFFF" strokeWidth="0.8" fill="none" />

        {/* Cleaning Magic Sparkles ✨ */}
        <path
          d="M 44 38 L 45.5 33 L 47 38 L 52 39.5 L 47 41 L 45.5 46 L 44 41 L 39 39.5 Z"
          fill="#FACC15"
        />
        <path
          d="M 28 32 L 29 28 L 30 32 L 34 33 L 30 34 L 29 38 L 28 34 L 24 33 Z"
          fill="#38BDF8"
        />
        <path
          d="M 82 24 L 83 20 L 84 24 L 88 25 L 84 26 L 83 30 L 82 26 L 78 25 Z"
          fill="#F472B6"
        />
      </svg>
    </div>
  );
};
