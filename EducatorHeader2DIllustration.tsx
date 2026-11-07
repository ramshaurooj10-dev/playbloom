import React from 'react';

export const EducatorHeader2DIllustration: React.FC<{ className?: string }> = ({ className = 'w-24 h-24 sm:w-28 sm:h-28' }) => {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background Soft Circle */}
      <circle cx="60" cy="60" r="54" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="3" />
      
      {/* Teacher Body */}
      <path d="M36 102 C36 84 46 76 60 76 C74 76 84 84 84 102 Z" fill="#4F46E5" stroke="#3730A3" strokeWidth="3" />
      {/* Teacher Collar / Shirt */}
      <path d="M52 76 L60 88 L68 76 Z" fill="#FFFFFF" />
      <path d="M58 88 L60 102 L62 88 Z" fill="#F43F5E" />

      {/* Teacher Head */}
      <circle cx="60" cy="50" r="18" fill="#FDE68A" stroke="#D97706" strokeWidth="2.5" />
      
      {/* Hair */}
      <path
        d="M40 50 C40 34 50 30 60 30 C70 30 80 34 80 50 C80 50 78 40 60 40 C42 40 40 50 40 50 Z"
        fill="#92400E"
      />
      {/* Hair Bun / Back */}
      <circle cx="60" cy="27" r="9" fill="#92400E" stroke="#78350F" strokeWidth="2" />

      {/* Glasses */}
      <circle cx="53" cy="50" r="5" fill="#E0F2FE" stroke="#1E293B" strokeWidth="2" />
      <circle cx="67" cy="50" r="5" fill="#E0F2FE" stroke="#1E293B" strokeWidth="2" />
      <line x1="58" y1="50" x2="62" y2="50" stroke="#1E293B" strokeWidth="2" />
      
      {/* Eyes & Smile */}
      <circle cx="53" cy="50" r="1.5" fill="#0F172A" />
      <circle cx="67" cy="50" r="1.5" fill="#0F172A" />
      <path d="M56 58 C58 61 62 61 64 58" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
      {/* Rosy Cheeks */}
      <circle cx="48" cy="55" r="2.5" fill="#FDA4AF" opacity="0.8" />
      <circle cx="72" cy="55" r="2.5" fill="#FDA4AF" opacity="0.8" />

      {/* Floating Apple / Star / Pencil around teacher */}
      {/* Star Left */}
      <g transform="translate(18, 30) scale(0.7)">
        <path d="M12 2 L15 9 L22 10 L17 15 L18 22 L12 18 L6 22 L7 15 L2 10 L9 9 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
      </g>
      {/* Apple Right */}
      <g transform="translate(88, 32) scale(0.75)">
        <circle cx="12" cy="14" r="9" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
        <path d="M12 5 C12 2 14 0 16 -1" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
        <ellipse cx="14" cy="0" rx="3" ry="1.5" fill="#10B981" transform="rotate(-20 14 0)" />
      </g>
      {/* Graduation Cap Top Right */}
      <g transform="translate(76, 12) scale(0.65) rotate(15)">
        <path d="M16 2 L30 8 L16 14 L2 8 Z" fill="#312E81" stroke="#1E1B4B" strokeWidth="1.5" />
        <rect x="8" y="10" width="16" height="8" rx="2" fill="#3730A3" />
        <line x1="28" y1="8" x2="29" y2="18" stroke="#F59E0B" strokeWidth="2" />
        <circle cx="29" cy="19" r="1.5" fill="#F59E0B" />
      </g>
    </svg>
  );
};
