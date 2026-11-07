import React from 'react';

interface BuildGardenIconProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const BuildGardenIcon: React.FC<BuildGardenIconProps> = ({
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-20 h-20',
    lg: 'w-24 h-24',
  };

  const dim = sizeMap[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${dim} ${className}`}
      aria-label="Build a Garden Icon"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md overflow-visible"
      >
        <defs>
          {/* Soil Mound Gradient */}
          <linearGradient id="soilGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#854D0E" />
            <stop offset="100%" stopColor="#451A03" />
          </linearGradient>

          {/* Plant Stem / Leaves Gradient */}
          <linearGradient id="stemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ADE80" />
            <stop offset="100%" stopColor="#16A34A" />
          </linearGradient>

          {/* Sunflower Petals Gradient */}
          <linearGradient id="sunflowerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="50%" stopColor="#FACC15" />
            <stop offset="100%" stopColor="#EAB308" />
          </linearGradient>

          {/* Sunflower Seed Center */}
          <linearGradient id="centerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#92400E" />
            <stop offset="100%" stopColor="#713F12" />
          </linearGradient>

          {/* Cute Watering Can Gradient */}
          <linearGradient id="canGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
        </defs>

        {/* 1. Garden Soil Mound Base */}
        <ellipse cx="50" cy="84" rx="42" ry="14" fill="url(#soilGrad)" stroke="#78350F" strokeWidth="2.5" />
        <ellipse cx="50" cy="82" rx="36" ry="9" fill="#713F12" opacity="0.6" />
        <circle cx="30" cy="85" r="2" fill="#A16207" />
        <circle cx="68" cy="86" r="2.5" fill="#A16207" />
        <circle cx="52" cy="88" r="1.5" fill="#A16207" />

        {/* 2. Sprouting Small Seedling on Left */}
        <g transform="translate(18, 58)">
          <path d="M 10,24 Q 10,14 10,8" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 10,14 C 4,12 2,6 8,4 C 14,4 12,12 10,14 Z" fill="url(#stemGrad)" stroke="#15803D" strokeWidth="1" />
          <path d="M 10,12 C 16,10 18,4 12,2 C 6,2 8,10 10,12 Z" fill="url(#stemGrad)" stroke="#15803D" strokeWidth="1" />
        </g>

        {/* 3. Main Sunflower Stem & Big Lush Leaves */}
        <path
          d="M 50,82 C 48,68 52,50 50,38"
          stroke="url(#stemGrad)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Left Leaf */}
        <path
          d="M 49,60 C 35,58 28,48 32,42 C 42,40 48,54 49,60 Z"
          fill="url(#stemGrad)"
          stroke="#15803D"
          strokeWidth="1.5"
        />
        <path d="M 48,58 Q 40,50 34,44" stroke="#86EFAC" strokeWidth="1" strokeLinecap="round" />

        {/* Right Leaf */}
        <path
          d="M 51,54 C 65,52 72,42 68,36 C 58,34 52,48 51,54 Z"
          fill="url(#stemGrad)"
          stroke="#15803D"
          strokeWidth="1.5"
        />
        <path d="M 52,52 Q 60,44 66,38" stroke="#86EFAC" strokeWidth="1" strokeLinecap="round" />

        {/* 4. Glowing Sunflower Bloom */}
        <g transform="translate(50, 32)">
          {/* 8 Radial Golden Petals */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
            <ellipse
              key={idx}
              cx="0"
              cy="-17"
              rx="5.5"
              ry="10"
              transform={`rotate(${angle})`}
              fill="url(#sunflowerGrad)"
              stroke="#D97706"
              strokeWidth="1"
            />
          ))}

          {/* Cheerful Center Disc */}
          <circle cx="0" cy="0" r="12" fill="url(#centerGrad)" stroke="#78350F" strokeWidth="2" />

          {/* Cute Friendly Face */}
          {/* Left Eye */}
          <circle cx="-4" cy="-2" r="1.8" fill="#FFFFFF" />
          <circle cx="-3.8" cy="-2" r="1.2" fill="#18181B" />
          <circle cx="-4.4" cy="-2.6" r="0.6" fill="#FFFFFF" />

          {/* Right Eye */}
          <circle cx="4" cy="-2" r="1.8" fill="#FFFFFF" />
          <circle cx="4.2" cy="-2" r="1.2" fill="#18181B" />
          <circle cx="3.6" cy="-2.6" r="0.6" fill="#FFFFFF" />

          {/* Cheerful Smile */}
          <path d="M -3,2 Q 0,5 3,2" stroke="#FEF08A" strokeWidth="1.2" strokeLinecap="round" fill="none" />

          {/* Rosy Cheeks */}
          <circle cx="-6" cy="1" r="1.2" fill="#F43F5E" opacity="0.6" />
          <circle cx="6" cy="1" r="1.2" fill="#F43F5E" opacity="0.6" />
        </g>

        {/* 5. Cute Sky Watering Can Floating on Right with Droplets */}
        <g transform="translate(68, 8) scale(0.65)">
          {/* Can Body */}
          <rect x="8" y="14" width="20" height="18" rx="5" fill="url(#canGrad)" stroke="#0369A1" strokeWidth="2" />
          {/* Can Spout */}
          <path d="M 8,24 L -4,16 L -4,22 L 8,28 Z" fill="url(#canGrad)" stroke="#0369A1" strokeWidth="1.5" />
          {/* Can Rose Head */}
          <ellipse cx="-4" cy="19" rx="2" ry="5" fill="#38BDF8" stroke="#0369A1" strokeWidth="1.5" />
          {/* Can Handle */}
          <path d="M 28,16 C 36,16 36,30 28,30" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* Droplets */}
          <circle cx="-10" cy="24" r="1.8" fill="#38BDF8" />
          <circle cx="-14" cy="30" r="2.2" fill="#0284C7" />
          <circle cx="-8" cy="36" r="1.6" fill="#38BDF8" />
        </g>

        {/* 6. Little Friendly Butterfly on Top Left */}
        <g transform="translate(10, 10) scale(0.55)">
          {/* Left Wings */}
          <ellipse cx="6" cy="6" rx="6" ry="4" transform="rotate(-30 6 6)" fill="#F472B6" stroke="#DB2777" strokeWidth="1.2" />
          <ellipse cx="6" cy="14" rx="4.5" ry="3" transform="rotate(30 6 14)" fill="#FB7185" stroke="#E11D48" strokeWidth="1.2" />
          {/* Right Wings */}
          <ellipse cx="18" cy="6" rx="6" ry="4" transform="rotate(30 18 6)" fill="#F472B6" stroke="#DB2777" strokeWidth="1.2" />
          <ellipse cx="18" cy="14" rx="4.5" ry="3" transform="rotate(-30 18 14)" fill="#FB7185" stroke="#E11D48" strokeWidth="1.2" />
          {/* Body */}
          <ellipse cx="12" cy="10" rx="2" ry="7" fill="#831843" />
        </g>
      </svg>
    </div>
  );
};
