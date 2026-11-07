import React from 'react';

interface IdentifyItemsCardIconProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const IdentifyItemsCardIcon: React.FC<IdentifyItemsCardIconProps> = ({
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${sizeMap[size]} ${className}`}
      aria-label="Identify The Items Icon"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md overflow-visible"
      >
        <defs>
          {/* Gradients */}
          {/* Ball Gradients */}
          <radialGradient id="ballRed" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FDA4AF" />
            <stop offset="40%" stopColor="#F43F5E" />
            <stop offset="100%" stopColor="#BE123C" />
          </radialGradient>
          <radialGradient id="ballYellow" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="40%" stopColor="#EAB308" />
            <stop offset="100%" stopColor="#CA8A04" />
          </radialGradient>
          <radialGradient id="ballBlue" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#BAE6FD" />
            <stop offset="40%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </radialGradient>

          {/* Book Gradients */}
          <linearGradient id="bookCover" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818CF8" />
            <stop offset="50%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#4338CA" />
          </linearGradient>
          <linearGradient id="bookPages" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F1F5F9" />
          </linearGradient>

          {/* Cup Gradients */}
          <linearGradient id="cupGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDBA74" />
            <stop offset="50%" stopColor="#FB923C" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
          <linearGradient id="cupInside" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FED7AA" />
            <stop offset="100%" stopColor="#F97316" />
          </linearGradient>

          {/* Pencil Gradients */}
          <linearGradient id="pencilWood" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="50%" stopColor="#FACC15" />
            <stop offset="100%" stopColor="#EAB308" />
          </linearGradient>
          <linearGradient id="pencilEraser" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FDA4AF" />
            <stop offset="100%" stopColor="#FB7185" />
          </linearGradient>

          {/* Star Toy / Badge */}
          <radialGradient id="starGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FEF9C3" />
            <stop offset="40%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#D97706" />
          </radialGradient>

          {/* Target / Identify Ring */}
          <linearGradient id="targetRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#7E22CE" />
          </linearGradient>
        </defs>

        {/* Backdrop Soft Glow Platform */}
        <ellipse cx="50" cy="78" rx="42" ry="14" fill="#E0E7FF" opacity="0.65" />
        <ellipse cx="50" cy="78" rx="36" ry="10" fill="#C7D2FE" opacity="0.8" />

        {/* 1. STORYBOOK (Back Left) */}
        <g transform="translate(12, 28) rotate(-8)">
          {/* Book Drop Shadow */}
          <rect x="2" y="3" width="34" height="42" rx="4" fill="#1E1B4B" opacity="0.15" />
          {/* Book Back Cover Spine */}
          <rect x="0" y="0" width="34" height="42" rx="4" fill="url(#bookCover)" stroke="#3730A3" strokeWidth="1.5" />
          {/* Pages block */}
          <rect x="4" y="3" width="27" height="36" rx="2" fill="url(#bookPages)" stroke="#CBD5E1" strokeWidth="1" />
          <line x1="8" y1="10" x2="26" y2="10" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="8" y1="16" x2="22" y2="16" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="8" y1="22" x2="25" y2="22" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
          {/* Bookmark Ribbon */}
          <path d="M18 2 L18 18 L22 14 L26 18 L26 2 Z" fill="#EF4444" />
          {/* Book front corner emblem */}
          <circle cx="23" cy="29" r="4" fill="#FBBF24" stroke="#D97706" strokeWidth="0.8" />
          <text x="23" y="31.5" fontSize="5" fontWeight="900" fill="#78350F" textAnchor="middle">★</text>
        </g>

        {/* 2. CUTE CUP / MUG (Back Right) */}
        <g transform="translate(56, 32)">
          {/* Cup Handle */}
          <path
            d="M24 12 C31 12 31 24 24 24"
            stroke="url(#cupGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M24 12 C31 12 31 24 24 24"
            stroke="#9A3412"
            strokeWidth="1"
            fill="none"
          />
          {/* Cup Body */}
          <path
            d="M6 6 L8 28 C8 32 24 32 24 28 L26 6 Z"
            fill="url(#cupGrad)"
            stroke="#C2410C"
            strokeWidth="1.5"
          />
          {/* Cup Rim Opening */}
          <ellipse cx="16" cy="6" rx="10" ry="3.5" fill="url(#cupInside)" stroke="#C2410C" strokeWidth="1.2" />
          {/* Cup Drink Liquid */}
          <ellipse cx="16" cy="7.5" rx="8" ry="2.2" fill="#78350F" opacity="0.35" />
          {/* Cup cute smiley face */}
          <circle cx="12" cy="18" r="1" fill="#431407" />
          <circle cx="20" cy="18" r="1" fill="#431407" />
          <path d="M14 21 Q16 23 18 21" stroke="#431407" strokeWidth="1" strokeLinecap="round" fill="none" />
          <circle cx="10.5" cy="19.5" r="1" fill="#FB7185" opacity="0.6" />
          <circle cx="21.5" cy="19.5" r="1" fill="#FB7185" opacity="0.6" />
          {/* Steam puffs */}
          <path d="M13 1 Q12 -3 14 -6" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" opacity="0.6" fill="none" />
          <path d="M19 2 Q20 -2 18 -5" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" opacity="0.6" fill="none" />
        </g>

        {/* 3. COLORFUL BOUNCY BALL (Front Left) */}
        <g transform="translate(18, 50)">
          {/* Shadow */}
          <ellipse cx="16" cy="30" rx="15" ry="4.5" fill="#1E1B4B" opacity="0.22" />
          {/* Ball Base Circle */}
          <circle cx="16" cy="16" r="15" fill="#F43F5E" stroke="#9F1239" strokeWidth="1.5" />
          {/* Ball Colored Curved Segments */}
          {/* Yellow Stripe */}
          <path
            d="M4 8 C10 14 10 24 4 28 C9 31 23 31 28 28 C22 24 22 14 28 8 Z"
            fill="url(#ballYellow)"
            stroke="#CA8A04"
            strokeWidth="0.8"
          />
          {/* Blue Stripe */}
          <path
            d="M10 2 C16 12 16 20 10 30 C13 31 19 31 22 30 C16 20 16 12 22 2 Z"
            fill="url(#ballBlue)"
            stroke="#0369A1"
            strokeWidth="0.8"
          />
          {/* Center Seam Stars */}
          <circle cx="16" cy="16" r="3" fill="#FFFFFF" opacity="0.9" />
          {/* 3D Gloss Highlight */}
          <ellipse cx="11" cy="9" rx="4.5" ry="2.5" fill="#FFFFFF" opacity="0.75" transform="rotate(-30 11 9)" />
        </g>

        {/* 4. YELLOW PENCIL (Front Crossing Right) */}
        <g transform="translate(52, 54) rotate(-35)">
          {/* Pencil Shadow */}
          <rect x="2" y="2" width="30" height="7" rx="1.5" fill="#1E1B4B" opacity="0.18" />
          {/* Pencil Body (Yellow) */}
          <rect x="0" y="0" width="28" height="6.5" rx="1" fill="url(#pencilWood)" stroke="#B45309" strokeWidth="1" />
          {/* Longitudinal facet lines */}
          <line x1="0" y1="2.2" x2="28" y2="2.2" stroke="#FEF08A" strokeWidth="0.8" />
          <line x1="0" y1="4.4" x2="28" y2="4.4" stroke="#D97706" strokeWidth="0.8" />
          {/* Ferrule (Metal Ring) */}
          <rect x="23" y="0" width="4.5" height="6.5" fill="#CBD5E1" stroke="#64748B" strokeWidth="0.8" />
          <line x1="25.2" y1="0" x2="25.2" y2="6.5" stroke="#94A3B8" strokeWidth="0.6" />
          {/* Eraser (Pink) */}
          <rect x="27.5" y="0.3" width="4.5" height="5.9" rx="1.5" fill="url(#pencilEraser)" stroke="#BE123C" strokeWidth="0.8" />
          {/* Sharpened Wood Cone Tip */}
          <polygon points="0,0.5 -7,3.25 0,6" fill="#FDE68A" stroke="#B45309" strokeWidth="0.8" />
          {/* Graphite Lead Tip */}
          <polygon points="-4.5,2.25 -7,3.25 -4.5,4.25" fill="#1E293B" />
        </g>

        {/* 5. CUTE STAR TOY (Accent Front Center) */}
        <g transform="translate(48, 68)">
          <path
            d="M0 -8 L2.4 -2.8 L8 -2.4 L3.8 1.6 L5.2 7.2 L0 4.2 L-5.2 7.2 L-3.8 1.6 L-8 -2.4 L-2.4 -2.8 Z"
            fill="url(#starGrad)"
            stroke="#B45309"
            strokeWidth="1.2"
          />
          {/* Sparkle face */}
          <circle cx="-1.8" cy="-0.5" r="0.8" fill="#78350F" />
          <circle cx="1.8" cy="-0.5" r="0.8" fill="#78350F" />
          <path d="M-1 1.8 Q0 2.8 1 1.8" stroke="#78350F" strokeWidth="0.6" strokeLinecap="round" fill="none" />
          {/* Highlight */}
          <circle cx="-2" cy="-4" r="1.2" fill="#FFFFFF" opacity="0.8" />
        </g>

        {/* 6. IDENTIFY / RECOGNIZE TARGET BADGE (Top Center/Right Floating) */}
        <g transform="translate(72, 14)">
          {/* Soft outer glow */}
          <circle cx="8" cy="8" r="9" fill="#F3E8FF" stroke="#A855F7" strokeWidth="1.5" />
          {/* Magnifier / Pointer Pin Accent */}
          <circle cx="7" cy="7" r="4.5" fill="#9333EA" />
          <circle cx="7" cy="7" r="2.5" fill="#FFFFFF" />
          <line x1="10.5" y1="10.5" x2="14" y2="14" stroke="#7E22CE" strokeWidth="2" strokeLinecap="round" />
          {/* Sparkle */}
          <polygon points="15,2 16,5 19,6 16,7 15,10 14,7 11,6 14,5" fill="#FBBF24" />
        </g>
      </svg>
    </div>
  );
};
