import React from 'react';

interface EducatorCard2DIconProps {
  type: string;
  className?: string;
}

export const EducatorCard2DIcon: React.FC<EducatorCard2DIconProps> = ({ type, className = 'w-16 h-16' }) => {
  switch (type) {
    case 'assessment':
      return (
        <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Clipboard Base */}
          <rect x="16" y="14" width="48" height="58" rx="8" fill="#F3E8FF" stroke="#9333EA" strokeWidth="3" />
          <rect x="22" y="22" width="36" height="44" rx="4" fill="#FFFFFF" />
          {/* Clip Top */}
          <rect x="30" y="8" width="20" height="10" rx="3" fill="#D8B4FE" stroke="#7E22CE" strokeWidth="2.5" />
          <circle cx="40" cy="13" r="2.5" fill="#581C87" />
          {/* Checklist Items */}
          <rect x="26" y="28" width="6" height="6" rx="1.5" fill="#A855F7" />
          <line x1="36" y1="31" x2="52" y2="31" stroke="#6B21A8" strokeWidth="2.5" strokeLinecap="round" />
          
          <rect x="26" y="38" width="6" height="6" rx="1.5" fill="#10B981" />
          <path d="M27 41 L29 43 L32 39" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="36" y1="41" x2="52" y2="41" stroke="#6B21A8" strokeWidth="2.5" strokeLinecap="round" />
          
          <rect x="26" y="48" width="6" height="6" rx="1.5" fill="#F59E0B" />
          <line x1="36" y1="51" x2="48" y2="51" stroke="#6B21A8" strokeWidth="2.5" strokeLinecap="round" />

          {/* Pencil */}
          <g transform="translate(46, 42) rotate(25)">
            <rect x="0" y="0" width="8" height="24" rx="2" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
            <path d="M0 24 L4 30 L8 24 Z" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5" />
            <path d="M3 28.5 L4 30 L5 28.5 Z" fill="#1E293B" />
            <rect x="0" y="0" width="8" height="6" rx="1" fill="#F43F5E" />
          </g>
        </svg>
      );

    case 'lesson_planner':
      return (
        <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Desk Calendar / Planner */}
          <rect x="14" y="16" width="52" height="52" rx="8" fill="#E0F2FE" stroke="#0284C7" strokeWidth="3" />
          {/* Header Banner */}
          <path d="M14 24 C14 19.5 17.5 16 22 16 L58 16 C62.5 16 66 19.5 66 24 L66 28 L14 28 Z" fill="#0284C7" />
          {/* Binder Rings */}
          <rect x="24" y="10" width="4" height="10" rx="2" fill="#BAE6FD" stroke="#0369A1" strokeWidth="1.5" />
          <rect x="38" y="10" width="4" height="10" rx="2" fill="#BAE6FD" stroke="#0369A1" strokeWidth="1.5" />
          <rect x="52" y="10" width="4" height="10" rx="2" fill="#BAE6FD" stroke="#0369A1" strokeWidth="1.5" />
          {/* Calendar Grid Lines */}
          <rect x="20" y="34" width="8" height="8" rx="2" fill="#BAE6FD" />
          <rect x="32" y="34" width="8" height="8" rx="2" fill="#38BDF8" />
          <rect x="44" y="34" width="8" height="8" rx="2" fill="#BAE6FD" />
          <rect x="52" y="34" width="8" height="8" rx="2" fill="#F43F5E" />

          <rect x="20" y="46" width="8" height="8" rx="2" fill="#BAE6FD" />
          <rect x="32" y="46" width="8" height="8" rx="2" fill="#BAE6FD" />
          <rect x="44" y="46" width="8" height="8" rx="2" fill="#38BDF8" />
          <rect x="52" y="46" width="8" height="8" rx="2" fill="#BAE6FD" />

          {/* Clock badge */}
          <circle cx="56" cy="56" r="10" fill="#FDE047" stroke="#CA8A04" strokeWidth="2" />
          <path d="M56 50 L56 56 L60 56" stroke="#854D0E" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'activity_planner':
      return (
        <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Paint Palette & Activity Blocks */}
          <path
            d="M40 14 C24 14 14 24 14 40 C14 56 26 66 40 66 C46 66 49 61 49 57 C49 54 47 52 47 49 C47 46 50 43 54 43 L58 43 C64 43 66 38 66 32 C66 22 54 14 40 14 Z"
            fill="#FFEDD5"
            stroke="#EA580C"
            strokeWidth="3"
          />
          {/* Paint Drops */}
          <circle cx="28" cy="28" r="4.5" fill="#EF4444" />
          <circle cx="42" cy="24" r="4.5" fill="#F59E0B" />
          <circle cx="54" cy="30" r="4.5" fill="#10B981" />
          <circle cx="28" cy="44" r="4.5" fill="#3B82F6" />
          {/* Thumb hole */}
          <ellipse cx="54" cy="54" rx="4" ry="5" fill="#FFFFFF" stroke="#EA580C" strokeWidth="2" />

          {/* Paint Brush */}
          <g transform="translate(42, 16) rotate(45)">
            <rect x="0" y="0" width="5" height="34" rx="1.5" fill="#78350F" />
            <rect x="-1" y="24" width="7" height="6" rx="1" fill="#CBD5E1" stroke="#64748B" strokeWidth="1" />
            <path d="M-1 30 C-1 36 6 36 6 30 Z" fill="#3B82F6" />
          </g>
        </svg>
      );

    case 'worksheets':
      return (
        <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Background stack sheet */}
          <rect x="22" y="14" width="44" height="54" rx="6" fill="#FCE7F3" stroke="#DB2777" strokeWidth="2" transform="rotate(5 44 41)" />
          {/* Main Worksheet Paper */}
          <rect x="16" y="16" width="46" height="54" rx="6" fill="#FFFFFF" stroke="#BE185D" strokeWidth="3" />
          {/* Header Line */}
          <rect x="22" y="24" width="22" height="4" rx="2" fill="#F472B6" />
          {/* Star Stamp */}
          <path
            d="M52 24 L53.5 27 L57 27.5 L54.5 29.5 L55 33 L52 31.5 L49 33 L49.5 29.5 L47 27.5 L50.5 27 Z"
            fill="#FBBF24"
            stroke="#D97706"
            strokeWidth="1"
          />
          {/* Tracing lines */}
          <line x1="22" y1="36" x2="56" y2="36" stroke="#F9A8D4" strokeWidth="2" strokeDasharray="3 2" />
          <line x1="22" y1="44" x2="56" y2="44" stroke="#F9A8D4" strokeWidth="2" strokeDasharray="3 2" />
          <line x1="22" y1="52" x2="48" y2="52" stroke="#F9A8D4" strokeWidth="2" strokeDasharray="3 2" />

          {/* Letter / Number Tracing Preview */}
          <text x="24" y="62" fontSize="9" fontWeight="900" fill="#BE185D" fontFamily="sans-serif">
            A B C 1 2
          </text>
        </svg>
      );

    case 'teaching_tips':
      return (
        <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Educator Open Book */}
          <path
            d="M18 56 C26 52 34 52 40 55 C46 52 54 52 62 56 L62 68 C54 64 46 64 40 67 C34 64 26 64 18 68 Z"
            fill="#FEF08A"
            stroke="#CA8A04"
            strokeWidth="2.5"
          />
          <path d="M40 55 L40 67" stroke="#CA8A04" strokeWidth="2" />
          
          {/* Lightbulb */}
          <path
            d="M40 14 C31 14 25 20 25 28 C25 33 28 37 31 40 L31 45 C31 46.5 32.5 48 34 48 L46 48 C47.5 48 49 46.5 49 45 L49 40 C52 37 55 33 55 28 C55 20 49 14 40 14 Z"
            fill="#FACC15"
            stroke="#A16207"
            strokeWidth="2.5"
          />
          {/* Lightbulb base */}
          <line x1="34" y1="44" x2="46" y2="44" stroke="#A16207" strokeWidth="2" />
          <path d="M36 48 C36 51 44 51 44 48 Z" fill="#A16207" />

          {/* Glow rays */}
          <line x1="40" y1="8" x2="40" y2="11" stroke="#EAB308" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="22" y1="18" x2="25" y2="21" stroke="#EAB308" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="58" y1="18" x2="55" y2="21" stroke="#EAB308" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="16" y1="30" x2="19" y2="30" stroke="#EAB308" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="64" y1="30" x2="61" y2="30" stroke="#EAB308" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'flash_cards':
      return (
        <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Back Card */}
          <rect x="26" y="16" width="36" height="48" rx="6" fill="#D1FAE5" stroke="#059669" strokeWidth="2" transform="rotate(8 44 40)" />
          {/* Middle Card */}
          <rect x="20" y="18" width="36" height="48" rx="6" fill="#A7F3D0" stroke="#059669" strokeWidth="2" transform="rotate(-6 38 42)" />
          {/* Front Card */}
          <rect x="18" y="20" width="38" height="48" rx="6" fill="#FFFFFF" stroke="#047857" strokeWidth="3" />
          {/* Apple / Letter illustration on card */}
          <text x="24" y="38" fontSize="14" fontWeight="900" fill="#047857" fontFamily="sans-serif">
            A
          </text>
          {/* 2D Mini Apple */}
          <circle cx="42" cy="46" r="8" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
          <path d="M42 38 C42 35 44 33 46 32" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
          <ellipse cx="44" cy="33" rx="2.5" ry="1.5" fill="#10B981" transform="rotate(-20 44 33)" />
        </svg>
      );

    case 'rhyme_resources':
      return (
        <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Open Rhyme Book */}
          <rect x="16" y="18" width="48" height="50" rx="8" fill="#FFE4E6" stroke="#E11D48" strokeWidth="3" />
          <rect x="22" y="24" width="36" height="38" rx="4" fill="#FFFFFF" />
          {/* Musical Notes */}
          <circle cx="32" cy="42" r="3.5" fill="#E11D48" />
          <circle cx="44" cy="38" r="3.5" fill="#E11D48" />
          <path d="M35.5 42 L35.5 28 L47.5 24 L47.5 38" stroke="#E11D48" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M35.5 31 L47.5 27" stroke="#E11D48" strokeWidth="2" />
          
          {/* Lyric lines */}
          <line x1="26" y1="50" x2="54" y2="50" stroke="#FDA4AF" strokeWidth="2" strokeLinecap="round" />
          <line x1="26" y1="55" x2="46" y2="55" stroke="#FDA4AF" strokeWidth="2" strokeLinecap="round" />

          {/* Little Sparkle */}
          <path d="M54 22 L55 24 L57 25 L55 26 L54 28 L53 26 L51 25 L53 24 Z" fill="#F59E0B" />
        </svg>
      );

    default:
      return (
        <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-3xl">
          🌟
        </div>
      );
  }
};
