import React from 'react';

interface SpyHiddenObjectsIconProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const SpyHiddenObjectsIcon: React.FC<SpyHiddenObjectsIconProps> = ({
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
      aria-label="Spy Hidden Objects Icon"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md overflow-visible"
      >
        <defs>
          {/* Glass Lens Gradient */}
          <linearGradient id="lensGlassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#BAE6FD" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#7DD3FC" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.95" />
          </linearGradient>

          {/* Shiny Lens Rim Gradient */}
          <linearGradient id="lensRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          {/* Magnifying Glass Handle Gradient */}
          <linearGradient id="handleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0EA5E9" />
            <stop offset="50%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#0369A1" />
          </linearGradient>

          {/* Star Sparkle Gradient */}
          <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="50%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>

        {/* 1. Background Discovery Clues / Floating Hidden Objects */}
        {/* Floating Mini Star */}
        <g transform="translate(14, 16) scale(0.65)">
          <path
            d="M 12,0 L 15.5,7.5 L 24,8.5 L 18,14.5 L 19.5,23 L 12,19 L 4.5,23 L 6,14.5 L 0,8.5 L 8.5,7.5 Z"
            fill="url(#starGrad)"
            stroke="#D97706"
            strokeWidth="1.5"
          />
        </g>

        {/* Floating Mini Red Apple */}
        <g transform="translate(68, 14) scale(0.6)">
          <circle cx="12" cy="14" r="10" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
          <path d="M 12,4 Q 13,0 16,1" stroke="#15803D" strokeWidth="2" strokeLinecap="round" fill="none" />
          <ellipse cx="14" cy="2" rx="3" ry="1.5" fill="#22C55E" />
          <circle cx="8" cy="11" r="2.5" fill="#FCA5A5" />
        </g>

        {/* Floating Mini Leaf */}
        <g transform="translate(10, 64) scale(0.65)">
          <path
            d="M 2,18 C 2,18 4,6 18,2 C 18,2 20,14 6,18 Z"
            fill="#10B981"
            stroke="#047857"
            strokeWidth="1.5"
          />
          <path d="M 4,16 Q 10,10 16,4" stroke="#065F46" strokeWidth="1.2" strokeLinecap="round" />
        </g>

        {/* 2. Magnifying Glass Handle */}
        <g>
          {/* Wooden / Teal Rubberized Grip */}
          <rect
            x="58"
            y="58"
            width="14"
            height="32"
            rx="7"
            transform="rotate(-45 58 58)"
            fill="url(#handleGrad)"
            stroke="#0369A1"
            strokeWidth="2.5"
          />
          {/* Handle Grip Ribs */}
          <line
            x1="66"
            y1="68"
            x2="74"
            y2="76"
            stroke="#BAE6FD"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="71"
            y1="73"
            x2="79"
            y2="81"
            stroke="#BAE6FD"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Handle Base Cap */}
          <circle cx="84" cy="84" r="5" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
        </g>

        {/* 3. Magnifying Glass Rim (Golden Bezel) */}
        <circle
          cx="42"
          cy="42"
          r="32"
          fill="url(#lensRimGrad)"
          stroke="#B45309"
          strokeWidth="3.5"
        />

        {/* 4. Glass Lens Core */}
        <circle
          cx="42"
          cy="42"
          r="26"
          fill="url(#lensGlassGrad)"
          stroke="#0284C7"
          strokeWidth="2"
        />

        {/* 5. In-Lens Discovery / Curious Searching Eyes */}
        <g transform="translate(24, 28)">
          {/* Left Eye */}
          <ellipse cx="11" cy="14" rx="6.5" ry="8" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
          <ellipse cx="12" cy="14" rx="3.8" ry="4.5" fill="#0284C7" />
          <circle cx="12" cy="14" r="2.5" fill="#0F172A" />
          <circle cx="10" cy="11.5" r="1.8" fill="#FFFFFF" />
          <circle cx="13" cy="15.5" r="0.8" fill="#FFFFFF" />

          {/* Right Eye */}
          <ellipse cx="25" cy="14" rx="6.5" ry="8" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
          <ellipse cx="26" cy="14" rx="3.8" ry="4.5" fill="#0284C7" />
          <circle cx="26" cy="14" r="2.5" fill="#0F172A" />
          <circle cx="24" cy="11.5" r="1.8" fill="#FFFFFF" />
          <circle cx="27" cy="15.5" r="0.8" fill="#FFFFFF" />

          {/* Cheerful Smile under eyes */}
          <path
            d="M 14,23 Q 18,27 22,23"
            stroke="#0369A1"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Rosy Cheeks */}
          <circle cx="6" cy="20" r="2" fill="#F43F5E" opacity="0.6" />
          <circle cx="30" cy="20" r="2" fill="#F43F5E" opacity="0.6" />
        </g>

        {/* 6. Lens Specular Light Reflection Arc */}
        <path
          d="M 22,34 C 22,23 31,18 42,18"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.9"
        />
        <circle cx="20" cy="40" r="2" fill="#FFFFFF" opacity="0.9" />

        {/* 7. Bright Golden Sparkle Twinkles */}
        <g transform="translate(64, 46) scale(0.6)">
          <path
            d="M 10,0 L 12,7 L 19,9 L 12,11 L 10,18 L 8,11 L 1,9 L 8,7 Z"
            fill="#FBBF24"
            stroke="#D97706"
            strokeWidth="1"
          />
        </g>
        <g transform="translate(6, 30) scale(0.5)">
          <path
            d="M 10,0 L 12,7 L 19,9 L 12,11 L 10,18 L 8,11 L 1,9 L 8,7 Z"
            fill="#FBBF24"
            stroke="#D97706"
            strokeWidth="1"
          />
        </g>
      </svg>
    </div>
  );
};
