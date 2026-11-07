import React from 'react';

interface WhatComesTogetherIconProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const WhatComesTogetherIcon: React.FC<WhatComesTogetherIconProps> = ({
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-20 h-20',
    lg: 'w-24 h-24',
    xl: 'w-28 h-28',
  };

  const dim = sizeMap[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${dim} ${className}`}
      aria-label="What Comes Together Icon"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md overflow-visible"
      >
        <defs>
          {/* Background Badge Gradient */}
          <linearGradient id="wctBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E0F2FE" />
            <stop offset="50%" stopColor="#F0FDF4" />
            <stop offset="100%" stopColor="#FEF3C7" />
          </linearGradient>

          {/* Toothbrush Handle Gradient */}
          <linearGradient id="brushHandleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>

          {/* Toothbrush Grip Rubber */}
          <linearGradient id="brushGripGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FB7185" />
            <stop offset="100%" stopColor="#E11D48" />
          </linearGradient>

          {/* Toothpaste Tube Body Gradient */}
          <linearGradient id="pasteTubeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F472B6" />
            <stop offset="50%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#DB2777" />
          </linearGradient>

          {/* Toothpaste Stripe Gradient */}
          <linearGradient id="pasteStripeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>

          {/* Toothpaste Cap */}
          <linearGradient id="capGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#EAB308" />
          </linearGradient>

          {/* Toothpaste Swirl Gel */}
          <linearGradient id="swirlGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#67E8F9" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>

        {/* Soft Circular Badge Background */}
        <circle cx="50" cy="50" r="46" fill="url(#wctBgGrad)" stroke="#38BDF8" strokeWidth="2.5" />

        {/* Playful dashed pair connection loop */}
        <path
          d="M 36 34 C 42 22, 58 22, 64 34"
          stroke="#F59E0B"
          strokeWidth="2"
          strokeDasharray="3 3"
          strokeLinecap="round"
        />

        {/* Sparkle Star in center top of the pair connection */}
        <path
          d="M 50 18 L 51.5 23 L 56.5 24.5 L 51.5 26 L 50 31 L 48.5 26 L 43.5 24.5 L 48.5 23 Z"
          fill="#F59E0B"
        />
        <circle cx="50" cy="24.5" r="1" fill="#FEF08A" />

        {/* ============================================================ */}
        {/* OBJECT 1: TOOTHBRUSH (Left, tilted playfully) */}
        {/* ============================================================ */}
        <g transform="translate(14, 22) rotate(14 20 30)">
          {/* Toothbrush Head Bristles White Backing */}
          <rect x="15" y="6" width="10" height="15" rx="3" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.2" />
          {/* Bristles Texture Lines */}
          <line x1="18" y1="8" x2="18" y2="19" stroke="#93C5FD" strokeWidth="1" strokeLinecap="round" />
          <line x1="21" y1="8" x2="21" y2="19" stroke="#93C5FD" strokeWidth="1" strokeLinecap="round" />

          {/* Cute Mint/Cyan Toothpaste Swirl on top of bristles */}
          <path
            d="M 16 11 C 17 6, 23 6, 24 9 C 24 12, 17 12, 16 11 Z"
            fill="url(#swirlGrad)"
            stroke="#0891B2"
            strokeWidth="0.8"
          />
          {/* Toothpaste dab highlight */}
          <ellipse cx="20" cy="8.5" rx="2" ry="1" fill="#FFFFFF" opacity="0.8" />

          {/* Toothbrush Neck & Handle */}
          <path
            d="M 18 20 C 18 24, 16 30, 16 36 C 16 46, 17 56, 17 60 C 17 64, 22 64, 22 60 C 22 56, 23 46, 23 36 C 23 30, 21 24, 21 20 Z"
            fill="url(#brushHandleGrad)"
            stroke="#0369A1"
            strokeWidth="1.2"
          />

          {/* Rubber Grip Patch in the middle */}
          <rect x="17.5" y="36" width="4" height="14" rx="2" fill="url(#brushGripGrad)" stroke="#BE123C" strokeWidth="0.6" />
          <line x1="18.5" y1="39" x2="20.5" y2="39" stroke="#FFFFFF" strokeWidth="0.8" strokeLinecap="round" />
          <line x1="18.5" y1="43" x2="20.5" y2="43" stroke="#FFFFFF" strokeWidth="0.8" strokeLinecap="round" />
          <line x1="18.5" y1="47" x2="20.5" y2="47" stroke="#FFFFFF" strokeWidth="0.8" strokeLinecap="round" />

          {/* Glossy highlight line on handle */}
          <path d="M 18 24 L 17.5 34" stroke="#BAE6FD" strokeWidth="0.8" strokeLinecap="round" />
        </g>

        {/* ============================================================ */}
        {/* OBJECT 2: TOOTHPASTE TUBE (Right, tilted towards toothbrush) */}
        {/* ============================================================ */}
        <g transform="translate(48, 22) rotate(-16 20 30)">
          {/* Squeezed Flat Bottom End */}
          <path
            d="M 11 58 L 29 58 L 28 54 L 12 54 Z"
            fill="#9D174D"
            stroke="#831843"
            strokeWidth="1"
          />

          {/* Toothpaste Tube Body */}
          <path
            d="M 12 54 C 13 42, 14 30, 15 22 L 25 22 C 26 30, 27 42, 28 54 Z"
            fill="url(#pasteTubeGrad)"
            stroke="#831843"
            strokeWidth="1.2"
          />

          {/* Diagonal Cheerful Wave Stripe */}
          <path
            d="M 13.5 40 C 18 38, 22 43, 26.5 40 L 27.2 46 C 22.5 49, 18 44, 13 46 Z"
            fill="url(#pasteStripeGrad)"
            stroke="#0891B2"
            strokeWidth="0.6"
          />
          {/* White Accent Stripe */}
          <path
            d="M 14 34 C 18 32, 22 37, 26 34 L 26.3 36.5 C 22.3 39.5, 18 34.5, 13.8 36.5 Z"
            fill="#FFFFFF"
          />

          {/* Cute Smile / Star on Tube */}
          <circle cx="20" cy="48" r="3" fill="#FEF08A" stroke="#EAB308" strokeWidth="0.6" />
          <path d="M 18.5 48 Q 20 50 21.5 48" stroke="#854D0E" strokeWidth="0.6" strokeLinecap="round" />

          {/* Tube Neck / Nozzle */}
          <rect x="17.5" y="17" width="5" height="5" rx="1" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="0.8" />

          {/* Toothpaste Cap */}
          <rect x="16" y="11" width="8" height="6" rx="2" fill="url(#capGrad)" stroke="#B45309" strokeWidth="1" />
          {/* Cap ridges */}
          <line x1="18.5" y1="12" x2="18.5" y2="16" stroke="#FEF08A" strokeWidth="0.6" />
          <line x1="21.5" y1="12" x2="21.5" y2="16" stroke="#FEF08A" strokeWidth="0.6" />

          {/* Toothpaste ribbon coming out towards toothbrush */}
          <path
            d="M 18.5 11 C 18 6, 12 6, 8 8"
            stroke="url(#swirlGrad)"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </g>

        {/* Small floating sparkles around */}
        <circle cx="22" cy="74" r="2" fill="#F43F5E" opacity="0.8" />
        <circle cx="78" cy="72" r="2.5" fill="#38BDF8" opacity="0.8" />
        <circle cx="76" cy="24" r="1.5" fill="#FBBF24" opacity="0.9" />

        {/* Mini Heart / "Belong Together" indicator in bottom center */}
        <path
          d="M 50 78 C 50 78, 44 73, 44 69 C 44 66.5, 46 65, 48 65 C 49.2 65, 50 66, 50 66 C 50 66, 50.8 65, 52 65 C 54 65, 56 66.5, 56 69 C 56 73, 50 78, 50 78 Z"
          fill="#F43F5E"
          stroke="#BE123C"
          strokeWidth="0.8"
        />
      </svg>
    </div>
  );
};
