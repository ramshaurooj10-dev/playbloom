import React from 'react';

interface ColorFunIconProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const ColorFunIcon: React.FC<ColorFunIconProps> = ({
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
      aria-label="Color Fun Icon"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm overflow-visible"
      >
        <defs>
          <linearGradient id="paletteGrad" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFBEB" />
            <stop offset="1" stopColor="#FEF3C7" />
          </linearGradient>
          <linearGradient id="brushGrad" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#F59E0B" />
            <stop offset="1" stopColor="#B45309" />
          </linearGradient>
        </defs>

        {/* Outer Circular Portal */}
        <circle cx="50" cy="50" r="46" fill="#F0FDF4" stroke="#86EFAC" strokeWidth="3" />

        {/* Wooden Artist Palette */}
        <path
          d="M22 46 C22 28, 38 18, 56 18 C74 18, 86 30, 84 48 C82 64, 70 76, 54 78 C46 79, 42 72, 38 72 C32 72, 30 78, 22 74 C16 70, 22 58, 22 46 Z"
          fill="url(#paletteGrad)"
          stroke="#D97706"
          strokeWidth="2.5"
        />

        {/* Palette Thumb Hole */}
        <ellipse cx="68" cy="58" rx="5" ry="7" fill="#F0FDF4" stroke="#D97706" strokeWidth="2" />

        {/* Primary Color Paint Blobs on Palette */}
        {/* Red */}
        <circle cx="36" cy="30" r="7" fill="#EF4444" stroke="#991B1B" strokeWidth="1.5" />
        <circle cx="34.5" cy="28.5" r="2" fill="#FFFFFF" opacity="0.6" />

        {/* Yellow */}
        <circle cx="54" cy="26" r="7" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
        <circle cx="52.5" cy="24.5" r="2" fill="#FFFFFF" opacity="0.6" />

        {/* Blue */}
        <circle cx="72" cy="34" r="7" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1.5" />
        <circle cx="70.5" cy="32.5" r="2" fill="#FFFFFF" opacity="0.6" />

        {/* Green */}
        <circle cx="34" cy="50" r="6" fill="#22C55E" stroke="#15803D" strokeWidth="1.5" />

        {/* Purple */}
        <circle cx="44" cy="64" r="6" fill="#A855F7" stroke="#7E22CE" strokeWidth="1.5" />

        {/* Paint Brush Dipping Across */}
        <g transform="rotate(-35 50 50)">
          {/* Handle */}
          <path d="M48 90 L52 90 L51 45 L49 45 Z" fill="url(#brushGrad)" stroke="#78350F" strokeWidth="1.2" />
          {/* Metal Ferrule */}
          <rect x="48" y="36" width="4" height="9" fill="#94A3B8" stroke="#475569" strokeWidth="1" rx="1" />
          {/* Bristles */}
          <path d="M48 36 C48 26, 52 26, 52 36 Z" fill="#EF4444" stroke="#991B1B" strokeWidth="1.2" />
          <path d="M48 30 C49 26, 51 26, 52 30" fill="#FCA5A5" />
        </g>

        {/* Sparkle */}
        <path
          d="M80 18 L81.5 14 L83 18 L87 19.5 L83 21 L81.5 25 L80 21 L76 19.5 Z"
          fill="#F59E0B"
        />
      </svg>
    </div>
  );
};
