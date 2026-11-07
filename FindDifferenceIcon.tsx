import React from 'react';

interface FindDifferenceIconProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const FindDifferenceIcon: React.FC<FindDifferenceIconProps> = ({
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
      aria-label="Find the Difference Icon"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md overflow-visible"
      >
        <defs>
          {/* Card 1 Gradient */}
          <linearGradient id="cardLeftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EFF6FF" />
            <stop offset="100%" stopColor="#DBEAFE" />
          </linearGradient>

          {/* Card 2 Gradient */}
          <linearGradient id="cardRightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF2F2" />
            <stop offset="100%" stopColor="#FEE2E2" />
          </linearGradient>

          {/* Magnifier Glass Gradient */}
          <linearGradient id="fdLensGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#BAE6FD" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.8" />
          </linearGradient>

          {/* Magnifier Rim Gradient */}
          <linearGradient id="fdRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>

        {/* Left Picture Frame */}
        <g transform="translate(6, 18) rotate(-6 22 28)">
          <rect
            x="0"
            y="0"
            width="42"
            height="52"
            rx="8"
            fill="url(#cardLeftGrad)"
            stroke="#3B82F6"
            strokeWidth="3.5"
          />
          {/* Sun in Left Frame */}
          <circle cx="12" cy="12" r="5" fill="#FBBF24" />
          {/* Tree / Flower in Left Frame */}
          <circle cx="21" cy="30" r="8" fill="#10B981" />
          <rect x="19" y="32" width="4" height="12" rx="2" fill="#78350F" />
          {/* Red Star in Left Frame */}
          <circle cx="32" cy="16" r="4.5" fill="#EF4444" />
        </g>

        {/* Right Picture Frame */}
        <g transform="translate(48, 14) rotate(4 22 28)">
          <rect
            x="0"
            y="0"
            width="42"
            height="52"
            rx="8"
            fill="url(#cardRightGrad)"
            stroke="#EC4899"
            strokeWidth="3.5"
          />
          {/* Sun in Right Frame */}
          <circle cx="12" cy="12" r="5" fill="#FBBF24" />
          {/* Tree / Flower in Right Frame */}
          <circle cx="21" cy="30" r="8" fill="#10B981" />
          <rect x="19" y="32" width="4" height="12" rx="2" fill="#78350F" />
          {/* DIFFERENT: Yellow Star with Glow instead of Red */}
          <circle cx="32" cy="16" r="5.5" fill="#F59E0B" stroke="#FDE047" strokeWidth="1.5" />
          <circle cx="32" cy="16" r="2" fill="#FFFFFF" />
        </g>

        {/* Magnifying Glass Over the Center/Difference */}
        <g transform="translate(32, 28)">
          {/* Handle */}
          <path
            d="M 28 28 L 44 44"
            stroke="#0284C7"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M 28 28 L 44 44"
            stroke="#38BDF8"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Rim */}
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="url(#fdLensGrad)"
            stroke="url(#fdRimGrad)"
            strokeWidth="4"
          />
          {/* Highlight in Glass */}
          <path
            d="M 10 12 A 10 10 0 0 1 24 10"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.8"
          />
          {/* Sparkle */}
          <polygon
            points="18,12 19.5,16.5 24,18 19.5,19.5 18,24 16.5,19.5 12,18 16.5,16.5"
            fill="#FFFFFF"
          />
        </g>
      </svg>
    </div>
  );
};
