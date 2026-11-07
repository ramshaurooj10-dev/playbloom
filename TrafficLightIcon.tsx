import React from 'react';

interface TrafficLightIconProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const TrafficLightIcon: React.FC<TrafficLightIconProps> = ({
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
      aria-label="Traffic Light Fun Icon"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm overflow-visible"
      >
        <defs>
          <linearGradient id="tfSkyGrad" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A5FA" />
            <stop offset="0.7" stopColor="#38BDF8" />
            <stop offset="1" stopColor="#0284C7" />
          </linearGradient>

          <linearGradient id="tfBodyGrad" x1="28" y1="12" x2="68" y2="82" gradientUnits="userSpaceOnUse">
            <stop stopColor="#334155" />
            <stop offset="1" stopColor="#0F172A" />
          </linearGradient>

          <radialGradient id="tfRedGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFA4A4" />
            <stop offset="50%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#991B1B" />
          </radialGradient>

          <radialGradient id="tfYellowGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </radialGradient>

          <radialGradient id="tfGreenGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#86EFAC" />
            <stop offset="50%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#15803D" />
          </radialGradient>
        </defs>

        {/* Circular background badge */}
        <circle cx="50" cy="50" r="46" fill="url(#tfSkyGrad)" stroke="#BAE6FD" strokeWidth="3" />

        {/* Clouds & Road in background */}
        <ellipse cx="24" cy="28" rx="14" ry="7" fill="#FFFFFF" opacity="0.85" />
        <ellipse cx="80" cy="24" rx="12" ry="6" fill="#FFFFFF" opacity="0.85" />
        
        {/* Road strip at bottom */}
        <path d="M6 78 C25 76 75 76 94 78 L90 94 L10 94 Z" fill="#475569" />
        <line x1="25" y1="86" x2="40" y2="86" stroke="#FDE047" strokeWidth="2.5" strokeDasharray="4 3" />
        <line x1="60" y1="86" x2="75" y2="86" stroke="#FDE047" strokeWidth="2.5" strokeDasharray="4 3" />

        {/* Traffic Light Post */}
        <rect x="46" y="68" width="8" height="24" rx="3" fill="#64748B" stroke="#1E293B" strokeWidth="1.5" />
        
        {/* Traffic Light Housing */}
        <rect
          x="32"
          y="10"
          width="36"
          height="62"
          rx="12"
          fill="url(#tfBodyGrad)"
          stroke="#E2E8F0"
          strokeWidth="2"
        />

        {/* Sun Visors / hoods on lights */}
        <path d="M37 20 Q50 14 63 20" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M37 41 Q50 35 63 41" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M37 62 Q50 56 63 62" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Red Light */}
        <circle cx="50" cy="23" r="7.5" fill="url(#tfRedGlow)" stroke="#FCA5A5" strokeWidth="1.2" />
        <circle cx="48" cy="20.5" r="2" fill="#FFFFFF" opacity="0.75" />

        {/* Yellow Light */}
        <circle cx="50" cy="41" r="7.5" fill="url(#tfYellowGlow)" stroke="#FDE047" strokeWidth="1.2" />
        <circle cx="48" cy="38.5" r="2" fill="#FFFFFF" opacity="0.75" />

        {/* Green Light */}
        <circle cx="50" cy="59" r="7.5" fill="url(#tfGreenGlow)" stroke="#86EFAC" strokeWidth="1.2" />
        <circle cx="48" cy="56.5" r="2" fill="#FFFFFF" opacity="0.75" />

        {/* Cute Little Red Car next to light */}
        <g transform="translate(10, 64) scale(0.65)">
          <rect x="4" y="12" width="30" height="14" rx="4" fill="#EF4444" stroke="#991B1B" strokeWidth="1.5" />
          <path d="M10 12 L14 4 L26 4 L30 12 Z" fill="#EF4444" stroke="#991B1B" strokeWidth="1.5" />
          <path d="M15 6 L25 6 L28 12 L13 12 Z" fill="#BAE6FD" />
          <circle cx="10" cy="26" r="4.5" fill="#1E293B" stroke="#94A3B8" strokeWidth="1.5" />
          <circle cx="28" cy="26" r="4.5" fill="#1E293B" stroke="#94A3B8" strokeWidth="1.5" />
          <circle cx="32" cy="18" r="2" fill="#FEF08A" />
        </g>

        {/* Sparkles */}
        <path d="M80 18 L82 14 L84 18 L88 20 L84 22 L82 26 L80 22 L76 20 Z" fill="#FDE047" />
        <circle cx="20" cy="52" r="2" fill="#FEF08A" />
      </svg>
    </div>
  );
};
