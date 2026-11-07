import React from 'react';

interface CatchStarsIconProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const CatchStarsIcon: React.FC<CatchStarsIconProps> = ({
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
      aria-label="Catch the Stars Icon"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md overflow-visible"
      >
        <defs>
          {/* Night Sky Gradient */}
          <linearGradient id="nightSkyBg" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1E1B4B" />
            <stop offset="0.5" stopColor="#312E81" />
            <stop offset="1" stopColor="#4338CA" />
          </linearGradient>

          {/* Golden Star Glow */}
          <linearGradient id="starGoldGrad" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FEF08A" />
            <stop offset="0.4" stopColor="#FBBF24" />
            <stop offset="1" stopColor="#F59E0B" />
          </linearGradient>

          {/* Crescent Moon Glow */}
          <linearGradient id="moonGrad" x1="10" y1="10" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFBEB" />
            <stop offset="1" stopColor="#FDE68A" />
          </linearGradient>

          {/* Soft Cloud Gradient */}
          <linearGradient id="skyCloudGrad" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#EEF2FF" stopOpacity="0.9" />
            <stop offset="1" stopColor="#C7D2FE" stopOpacity="0.75" />
          </linearGradient>

          <filter id="starGlowFilter" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Circular Deep Night Sky Badge */}
        <circle cx="50" cy="50" r="46" fill="url(#nightSkyBg)" stroke="#818CF8" strokeWidth="2.5" />

        {/* Tiny Twinkling Background Stars */}
        <circle cx="28" cy="22" r="1.5" fill="#FFFFFF" opacity="0.8" />
        <circle cx="75" cy="25" r="1.2" fill="#FDE047" opacity="0.9" />
        <circle cx="82" cy="65" r="1.5" fill="#FFFFFF" opacity="0.7" />
        <circle cx="20" cy="68" r="1.2" fill="#93C5FD" opacity="0.85" />
        <circle cx="48" cy="18" r="1" fill="#FFFFFF" opacity="0.9" />

        {/* Smiling Crescent Moon in Upper Left */}
        <path
          d="M 38 20 A 18 18 0 0 0 24 46 A 16 16 0 1 1 38 20 Z"
          fill="url(#moonGrad)"
          stroke="#FCD34D"
          strokeWidth="1.2"
        />
        {/* Moon Eye and Cheek */}
        <circle cx="27" cy="34" r="1.5" fill="#78350F" />
        <circle cx="25" cy="38" r="2" fill="#F472B6" opacity="0.6" />

        {/* Gentle Soft Bottom Cloud */}
        <path
          d="M 18 78 C 18 70 28 66 36 71 C 42 64 58 63 64 70 C 72 66 84 71 82 80 C 78 84 22 84 18 78 Z"
          fill="url(#skyCloudGrad)"
        />

        {/* Big Bright Golden Star with Sparkling Aura */}
        <g filter="url(#starGlowFilter)">
          <path
            d="M 58 26 
               L 63 39 
               L 77 40 
               L 66 49 
               L 70 63 
               L 58 55 
               L 46 63 
               L 50 49 
               L 39 40 
               L 53 39 Z"
            fill="url(#starGoldGrad)"
            stroke="#F59E0B"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Star Happy Eyes and Smile */}
          <circle cx="54" cy="46" r="1.8" fill="#451A03" />
          <circle cx="62" cy="46" r="1.8" fill="#451A03" />
          <path
            d="M 55 50 Q 58 53 61 50"
            stroke="#451A03"
            strokeWidth="1.4"
            strokeLinecap="round"
            fill="none"
          />
          {/* Star Cheeks */}
          <circle cx="51.5" cy="49" r="1.5" fill="#F43F5E" opacity="0.6" />
          <circle cx="64.5" cy="49" r="1.5" fill="#F43F5E" opacity="0.6" />
        </g>

        {/* Sparkle Highlights */}
        <path
          d="M 76 28 L 78 22 L 80 28 L 86 30 L 80 32 L 78 38 L 76 32 L 70 30 Z"
          fill="#FEF08A"
        />
        <path
          d="M 36 58 L 37.5 53 L 39 58 L 44 59.5 L 39 61 L 37.5 66 L 36 61 L 31 59.5 Z"
          fill="#67E8F9"
          opacity="0.9"
        />
      </svg>
    </div>
  );
};
