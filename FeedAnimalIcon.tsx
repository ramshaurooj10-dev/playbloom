import React from 'react';

interface FeedAnimalIconProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const FeedAnimalIcon: React.FC<FeedAnimalIconProps> = ({
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
      aria-label="Feed the Animal Icon"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm overflow-visible"
      >
        <defs>
          <linearGradient id="feedBunnyGrad" x1="20" y1="20" x2="60" y2="80" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="0.7" stopColor="#F1F5F9" />
            <stop offset="1" stopColor="#E2E8F0" />
          </linearGradient>
          <linearGradient id="feedEarInner" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#FDA4AF" />
            <stop offset="1" stopColor="#FB7185" />
          </linearGradient>
          <linearGradient id="feedCarrotGrad" x1="45" y1="45" x2="90" y2="90" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FB923C" />
            <stop offset="1" stopColor="#EA580C" />
          </linearGradient>
          <linearGradient id="feedLeafGrad" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#4ADE80" />
            <stop offset="1" stopColor="#16A34A" />
          </linearGradient>
          <linearGradient id="feedHeartGrad" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#F43F5E" />
            <stop offset="1" stopColor="#E11D48" />
          </linearGradient>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Soft Circular Background Glow */}
        <circle cx="50" cy="50" r="46" fill="#EFF6FF" stroke="#93C5FD" strokeWidth="2.5" strokeDasharray="4 3" opacity="0.85" />

        {/* Rabbit Left Ear */}
        <path
          d="M26 38 C20 18, 26 8, 33 12 C39 16, 36 28, 33 38 Z"
          fill="url(#feedBunnyGrad)"
          stroke="#94A3B8"
          strokeWidth="2"
        />
        <path
          d="M27 34 C23 20, 27 13, 31 16 C34 19, 33 26, 31 34 Z"
          fill="url(#feedEarInner)"
          opacity="0.85"
        />

        {/* Rabbit Right Ear */}
        <path
          d="M44 38 C42 16, 49 6, 56 10 C62 14, 56 26, 50 38 Z"
          fill="url(#feedBunnyGrad)"
          stroke="#94A3B8"
          strokeWidth="2"
        />
        <path
          d="M45 34 C44 20, 48 12, 53 15 C56 18, 53 25, 48 34 Z"
          fill="url(#feedEarInner)"
          opacity="0.85"
        />

        {/* Rabbit Head */}
        <circle
          cx="38"
          cy="54"
          r="24"
          fill="url(#feedBunnyGrad)"
          stroke="#94A3B8"
          strokeWidth="2.2"
        />

        {/* Cute Cheeks */}
        <ellipse cx="23" cy="58" rx="4.5" ry="3" fill="#FDA4AF" opacity="0.65" />
        <ellipse cx="51" cy="58" rx="4.5" ry="3" fill="#FDA4AF" opacity="0.65" />

        {/* Happy Eyes (curved arcs or cute dots) */}
        <circle cx="29" cy="49" r="3.2" fill="#1E293B" />
        <circle cx="30" cy="47.5" r="1.1" fill="#FFFFFF" />
        
        <circle cx="45" cy="49" r="3.2" fill="#1E293B" />
        <circle cx="46" cy="47.5" r="1.1" fill="#FFFFFF" />

        {/* Cute Pink Nose */}
        <polygon points="37,55 35,53 39,53" fill="#FB7185" />

        {/* Happy Smiling Mouth */}
        <path
          d="M34 57 Q37 60 40 57"
          stroke="#334155"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Whiskers */}
        <path d="M21 54 L12 52 M21 57 L13 59" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M53 54 L62 52 M53 57 L61 59" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />

        {/* Carrot (offered to animal) */}
        <g transform="rotate(-25 68 62)">
          {/* Carrot Greens / Leaves */}
          <path d="M78 40 C75 32, 70 34, 68 42 Z" fill="url(#feedLeafGrad)" stroke="#15803D" strokeWidth="1.2" />
          <path d="M82 38 C84 28, 88 32, 80 43 Z" fill="url(#feedLeafGrad)" stroke="#15803D" strokeWidth="1.2" />
          <path d="M85 43 C92 38, 93 45, 83 47 Z" fill="url(#feedLeafGrad)" stroke="#15803D" strokeWidth="1.2" />

          {/* Carrot Body */}
          <path
            d="M68 44 C72 41, 84 45, 83 50 L56 86 C54 88, 51 86, 52 83 L68 44 Z"
            fill="url(#feedCarrotGrad)"
            stroke="#C2410C"
            strokeWidth="2"
          />

          {/* Carrot Detail Lines */}
          <path d="M64 54 Q68 56 74 53" stroke="#EA580C" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M60 64 Q64 66 69 63" stroke="#EA580C" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M57 73 Q60 75 64 73" stroke="#EA580C" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Little Floating Love Heart */}
        <g transform="translate(68, 14) scale(0.9)">
          <path
            d="M10 3 C8 0, 3 0, 1 4 C-1 9, 7 15, 10 18 C13 15, 21 9, 19 4 C17 0, 12 0, 10 3 Z"
            fill="url(#feedHeartGrad)"
            stroke="#BE123C"
            strokeWidth="1.2"
          />
        </g>

        {/* Little Sparkles */}
        <path
          d="M86 68 L88 64 L90 68 L94 70 L90 72 L88 76 L86 72 L82 70 Z"
          fill="#FBBF24"
        />
        <path
          d="M15 28 L16.5 25 L18 28 L21 29.5 L18 31 L16.5 34 L15 31 L12 29.5 Z"
          fill="#38BDF8"
        />
      </svg>
    </div>
  );
};
