import React from 'react';

interface KiteCountIconProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const KiteCountIcon: React.FC<KiteCountIconProps> = ({
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
      aria-label="Kite Count & Take Away Icon"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm overflow-visible"
      >
        <defs>
          <linearGradient id="kiteSkyGrad" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7DD3FC" />
            <stop offset="0.7" stopColor="#38BDF8" />
            <stop offset="1" stopColor="#0EA5E9" />
          </linearGradient>

          <linearGradient id="kiteRedGrad" x1="20" y1="15" x2="60" y2="55" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FDA4AF" />
            <stop offset="0.3" stopColor="#F43F5E" />
            <stop offset="1" stopColor="#E11D48" />
          </linearGradient>

          <linearGradient id="kiteYellowGrad" x1="45" y1="35" x2="85" y2="75" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FEF08A" />
            <stop offset="0.3" stopColor="#FBBF24" />
            <stop offset="1" stopColor="#F59E0B" />
          </linearGradient>

          <linearGradient id="kitePurpleGrad" x1="10" y1="40" x2="45" y2="75" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E879F9" />
            <stop offset="0.4" stopColor="#C084FC" />
            <stop offset="1" stopColor="#9333EA" />
          </linearGradient>
        </defs>

        {/* Sky round disc */}
        <circle cx="50" cy="50" r="46" fill="url(#kiteSkyGrad)" stroke="#BAE6FD" strokeWidth="3" />

        {/* Fluffy white clouds */}
        <ellipse cx="28" cy="74" rx="14" ry="8" fill="#FFFFFF" opacity="0.9" />
        <ellipse cx="38" cy="72" rx="12" ry="9" fill="#FFFFFF" opacity="0.9" />
        <ellipse cx="74" cy="30" rx="12" ry="7" fill="#FFFFFF" opacity="0.85" />
        <ellipse cx="82" cy="32" rx="10" ry="6" fill="#FFFFFF" opacity="0.85" />

        {/* Gentle wind swirls */}
        <path d="M14 36 Q32 30 46 38" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.6" strokeDasharray="3 3" />
        <path d="M50 78 Q68 72 86 80" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.6" strokeDasharray="3 3" />

        {/* Main Red Diamond Kite */}
        <g transform="translate(18, 14) rotate(-8)">
          {/* Diamond Body */}
          <polygon
            points="22,4 40,24 22,44 4,24"
            fill="url(#kiteRedGrad)"
            stroke="#9F1239"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Cross Spars */}
          <line x1="22" y1="4" x2="22" y2="44" stroke="#FFE4E6" strokeWidth="1.6" />
          <line x1="4" y1="24" x2="40" y2="24" stroke="#FFE4E6" strokeWidth="1.6" />
          {/* Cute Face */}
          <circle cx="17" cy="20" r="2.2" fill="#1E293B" />
          <circle cx="27" cy="20" r="2.2" fill="#1E293B" />
          <circle cx="17.7" cy="19.2" r="0.8" fill="#FFFFFF" />
          <circle cx="27.7" cy="19.2" r="0.8" fill="#FFFFFF" />
          <path d="M18 26 Q22 30 26 26" stroke="#9F1239" strokeWidth="1.6" strokeLinecap="round" fill="none" />
          <circle cx="14" cy="24" r="1.8" fill="#FECDD3" opacity="0.8" />
          <circle cx="30" cy="24" r="1.8" fill="#FECDD3" opacity="0.8" />

          {/* Tail string & bows */}
          <path d="M22 44 Q28 54 22 62 Q16 70 24 78" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" fill="none" />
          {/* Bow 1 */}
          <path d="M24 53 L28 50 L28 56 Z M24 53 L20 50 L20 56 Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="0.8" />
          {/* Bow 2 */}
          <path d="M19 65 L23 62 L23 68 Z M19 65 L15 62 L15 68 Z" fill="#4ADE80" stroke="#16A34A" strokeWidth="0.8" />
          {/* Bow 3 */}
          <path d="M24 76 L28 73 L28 79 Z M24 76 L20 73 L20 79 Z" fill="#F43F5E" stroke="#BE123C" strokeWidth="0.8" />
        </g>

        {/* Small Yellow Companion Kite in background */}
        <g transform="translate(56, 38) rotate(14)">
          <polygon
            points="14,2 26,16 14,30 2,16"
            fill="url(#kiteYellowGrad)"
            stroke="#B45309"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <line x1="14" y1="2" x2="14" y2="30" stroke="#FEF3C7" strokeWidth="1.2" />
          <line x1="2" y1="16" x2="26" y2="16" stroke="#FEF3C7" strokeWidth="1.2" />
          {/* Small tail */}
          <path d="M14 30 Q18 36 14 42" stroke="#FDE047" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <circle cx="16" cy="36" r="1.5" fill="#EC4899" />
          <circle cx="14" cy="42" r="1.5" fill="#3B82F6" />
        </g>

        {/* Small cute sparkles */}
        <path d="M20 22 L22 17 L24 22 L29 24 L24 26 L22 31 L20 26 L15 24 Z" fill="#FDE047" />
        <circle cx="82" cy="62" r="2.5" fill="#FEF08A" />
      </svg>
    </div>
  );
};
