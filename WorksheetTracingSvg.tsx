import React from 'react';

// =========================================================================
// VECTOR SVG DOTTED TRACING COMPONENTS FOR PRESCHOOL A4 WORKSHEETS
// All elements use scalable SVG vector paths with dashed/dotted stroke arrays.
// =========================================================================

interface TracingProps {
  className?: string;
}

// -------------------------------------------------------------------------
// 1. DOTTED LETTERS (A, B, C, D, E and lowercase a, b, c, d, e)
// -------------------------------------------------------------------------

/** Dotted Letter A & a on handwriting guide track */
export const SvgDottedLetterA: React.FC<{ size?: number }> = ({ size = 80 }) => (
  <svg width={size * 1.8} height={size} viewBox="0 0 140 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Handwriting 3-line guides */}
    <line x1="0" y1="10" x2="140" y2="10" stroke="#94a3b8" strokeWidth="1" />
    <line x1="0" y1="45" x2="140" y2="45" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />
    <line x1="0" y1="75" x2="140" y2="75" stroke="#94a3b8" strokeWidth="1" />

    {/* Big 'A' Dotted Path */}
    {/* Left slant */}
    <path d="M35 15 L15 75" stroke="#0f172a" strokeWidth="4.5" strokeDasharray="5 7" strokeLinecap="round" />
    {/* Right slant */}
    <path d="M35 15 L55 75" stroke="#0f172a" strokeWidth="4.5" strokeDasharray="5 7" strokeLinecap="round" />
    {/* Crossbar */}
    <path d="M22 50 L48 50" stroke="#0f172a" strokeWidth="4.5" strokeDasharray="5 6" strokeLinecap="round" />
    {/* Start dot indicator */}
    <circle cx="35" cy="15" r="3.5" fill="#db2777" />

    {/* Small 'a' Dotted Path */}
    {/* Round body */}
    <ellipse cx="95" cy="60" rx="14" ry="14" stroke="#0f172a" strokeWidth="4.5" strokeDasharray="5 7" fill="none" />
    {/* Right stem */}
    <path d="M109 46 L109 75" stroke="#0f172a" strokeWidth="4.5" strokeDasharray="5 6" strokeLinecap="round" />
    {/* Start dot indicator */}
    <circle cx="95" cy="46" r="3.5" fill="#db2777" />
  </svg>
);

/** Dotted Letter B & b on handwriting guide track */
export const SvgDottedLetterB: React.FC<{ size?: number }> = ({ size = 80 }) => (
  <svg width={size * 1.8} height={size} viewBox="0 0 140 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="0" y1="10" x2="140" y2="10" stroke="#94a3b8" strokeWidth="1" />
    <line x1="0" y1="45" x2="140" y2="45" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />
    <line x1="0" y1="75" x2="140" y2="75" stroke="#94a3b8" strokeWidth="1" />

    {/* Big 'B' */}
    <path d="M20 15 L20 75" stroke="#0f172a" strokeWidth="4.5" strokeDasharray="5 7" strokeLinecap="round" />
    <path d="M20 15 C45 15, 45 45, 20 45" stroke="#0f172a" strokeWidth="4.5" strokeDasharray="5 7" fill="none" strokeLinecap="round" />
    <path d="M20 45 C50 45, 50 75, 20 75" stroke="#0f172a" strokeWidth="4.5" strokeDasharray="5 7" fill="none" strokeLinecap="round" />
    <circle cx="20" cy="15" r="3.5" fill="#0284c7" />

    {/* Small 'b' */}
    <path d="M85 15 L85 75" stroke="#0f172a" strokeWidth="4.5" strokeDasharray="5 7" strokeLinecap="round" />
    <ellipse cx="102" cy="60" rx="14" ry="14" stroke="#0f172a" strokeWidth="4.5" strokeDasharray="5 7" fill="none" />
    <circle cx="85" cy="15" r="3.5" fill="#0284c7" />
  </svg>
);

/** Dotted Letter C & c on handwriting guide track */
export const SvgDottedLetterC: React.FC<{ size?: number }> = ({ size = 80 }) => (
  <svg width={size * 1.8} height={size} viewBox="0 0 140 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="0" y1="10" x2="140" y2="10" stroke="#94a3b8" strokeWidth="1" />
    <line x1="0" y1="45" x2="140" y2="45" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />
    <line x1="0" y1="75" x2="140" y2="75" stroke="#94a3b8" strokeWidth="1" />

    {/* Big 'C' */}
    <path d="M50 25 C30 10, 15 30, 15 45 C15 60, 30 78, 50 65" stroke="#0f172a" strokeWidth="4.5" strokeDasharray="5 7" fill="none" strokeLinecap="round" />
    <circle cx="50" cy="25" r="3.5" fill="#d97706" />

    {/* Small 'c' */}
    <path d="M110 52 C100 42, 88 52, 88 60 C88 68, 100 78, 110 68" stroke="#0f172a" strokeWidth="4.5" strokeDasharray="5 7" fill="none" strokeLinecap="round" />
    <circle cx="110" cy="52" r="3.5" fill="#d97706" />
  </svg>
);

/** Dotted Letter D & d on handwriting guide track */
export const SvgDottedLetterD: React.FC<{ size?: number }> = ({ size = 80 }) => (
  <svg width={size * 1.8} height={size} viewBox="0 0 140 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="0" y1="10" x2="140" y2="10" stroke="#94a3b8" strokeWidth="1" />
    <line x1="0" y1="45" x2="140" y2="45" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />
    <line x1="0" y1="75" x2="140" y2="75" stroke="#94a3b8" strokeWidth="1" />

    {/* Big 'D' */}
    <path d="M20 15 L20 75" stroke="#0f172a" strokeWidth="4.5" strokeDasharray="5 7" strokeLinecap="round" />
    <path d="M20 15 C55 15, 55 75, 20 75" stroke="#0f172a" strokeWidth="4.5" strokeDasharray="5 7" fill="none" strokeLinecap="round" />
    <circle cx="20" cy="15" r="3.5" fill="#059669" />

    {/* Small 'd' */}
    <ellipse cx="94" cy="60" rx="14" ry="14" stroke="#0f172a" strokeWidth="4.5" strokeDasharray="5 7" fill="none" />
    <path d="M108 15 L108 75" stroke="#0f172a" strokeWidth="4.5" strokeDasharray="5 7" strokeLinecap="round" />
    <circle cx="108" cy="15" r="3.5" fill="#059669" />
  </svg>
);

/** Dotted Letter E & e on handwriting guide track */
export const SvgDottedLetterE: React.FC<{ size?: number }> = ({ size = 80 }) => (
  <svg width={size * 1.8} height={size} viewBox="0 0 140 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="0" y1="10" x2="140" y2="10" stroke="#94a3b8" strokeWidth="1" />
    <line x1="0" y1="45" x2="140" y2="45" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />
    <line x1="0" y1="75" x2="140" y2="75" stroke="#94a3b8" strokeWidth="1" />

    {/* Big 'E' */}
    <path d="M20 15 L20 75" stroke="#0f172a" strokeWidth="4.5" strokeDasharray="5 7" strokeLinecap="round" />
    <path d="M20 15 L50 15" stroke="#0f172a" strokeWidth="4.5" strokeDasharray="5 7" strokeLinecap="round" />
    <path d="M20 45 L45 45" stroke="#0f172a" strokeWidth="4.5" strokeDasharray="5 7" strokeLinecap="round" />
    <path d="M20 75 L50 75" stroke="#0f172a" strokeWidth="4.5" strokeDasharray="5 7" strokeLinecap="round" />
    <circle cx="20" cy="15" r="3.5" fill="#7c3aed" />

    {/* Small 'e' */}
    <path d="M85 60 L115 60 C115 45, 85 45, 85 60 C85 75, 115 75, 115 65" stroke="#0f172a" strokeWidth="4.5" strokeDasharray="5 7" fill="none" strokeLinecap="round" />
    <circle cx="85" cy="60" r="3.5" fill="#7c3aed" />
  </svg>
);

// -------------------------------------------------------------------------
// 2. DOTTED NUMBERS (1, 2, 3, 4, 5)
// -------------------------------------------------------------------------

export const SvgDottedNumber: React.FC<{ num: number; size?: number }> = ({ num, size = 70 }) => {
  return (
    <svg width={size * 0.8} height={size} viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Handwriting guidelines */}
      <line x1="0" y1="8" x2="60" y2="8" stroke="#cbd5e1" strokeWidth="1" />
      <line x1="0" y1="44" x2="60" y2="44" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="0" y1="75" x2="60" y2="75" stroke="#cbd5e1" strokeWidth="1" />

      {num === 1 && (
        <>
          <path d="M20 25 L32 15 L32 75" stroke="#0f172a" strokeWidth="4.5" strokeDasharray="5 7" strokeLinecap="round" />
          <path d="M15 75 L48 75" stroke="#0f172a" strokeWidth="4.5" strokeDasharray="5 6" strokeLinecap="round" />
          <circle cx="20" cy="25" r="3" fill="#db2777" />
        </>
      )}

      {num === 2 && (
        <>
          <path d="M15 26 C15 12, 45 12, 45 28 C45 42, 15 60, 15 75 L48 75" stroke="#0f172a" strokeWidth="4.5" strokeDasharray="5 7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="15" cy="26" r="3" fill="#0284c7" />
        </>
      )}

      {num === 3 && (
        <>
          <path d="M16 16 L44 16 L30 40 C45 40, 48 72, 16 72" stroke="#0f172a" strokeWidth="4.5" strokeDasharray="5 7" fill="none" strokeLinecap="round" />
          <circle cx="16" cy="16" r="3" fill="#d97706" />
        </>
      )}

      {num === 4 && (
        <>
          <path d="M38 15 L14 50 L46 50" stroke="#0f172a" strokeWidth="4.5" strokeDasharray="5 7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M38 15 L38 75" stroke="#0f172a" strokeWidth="4.5" strokeDasharray="5 7" strokeLinecap="round" />
          <circle cx="38" cy="15" r="3" fill="#059669" />
        </>
      )}

      {num === 5 && (
        <>
          <path d="M42 16 L18 16 L18 42 C18 42, 44 36, 44 58 C44 76, 16 75, 14 62" stroke="#0f172a" strokeWidth="4.5" strokeDasharray="5 7" fill="none" strokeLinecap="round" />
          <circle cx="42" cy="16" r="3" fill="#7c3aed" />
        </>
      )}
    </svg>
  );
};

// -------------------------------------------------------------------------
// 3. DOTTED SHAPES (Circle, Square, Triangle, Rectangle)
// -------------------------------------------------------------------------

export const SvgDottedShapesSheet: React.FC<TracingProps> = ({ className = '' }) => (
  <div className={`grid grid-cols-2 gap-5 ${className}`}>
    {/* 1. Dotted Circle */}
    <div className="bg-white border-2 border-slate-300 rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-xs">
      <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="40" stroke="#0f172a" strokeWidth="4" strokeDasharray="6 8" />
        <circle cx="50" cy="10" r="4" fill="#db2777" />
        <text x="50" y="55" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#94a3b8">Start ●</text>
      </svg>
      <span className="text-xs font-black text-slate-800 mt-2">Dotted Circle</span>
    </div>

    {/* 2. Dotted Square */}
    <div className="bg-white border-2 border-slate-300 rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-xs">
      <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
        <rect x="12" y="12" width="76" height="76" rx="2" stroke="#0f172a" strokeWidth="4" strokeDasharray="6 8" />
        <circle cx="12" cy="12" r="4" fill="#0284c7" />
        <text x="50" y="55" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#94a3b8">Start ●</text>
      </svg>
      <span className="text-xs font-black text-slate-800 mt-2">Dotted Square</span>
    </div>

    {/* 3. Dotted Triangle */}
    <div className="bg-white border-2 border-slate-300 rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-xs">
      <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
        <polygon points="50,12 12,88 88,88" stroke="#0f172a" strokeWidth="4" strokeDasharray="6 8" strokeLinejoin="round" />
        <circle cx="50" cy="12" r="4" fill="#d97706" />
        <text x="50" y="65" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#94a3b8">Start ●</text>
      </svg>
      <span className="text-xs font-black text-slate-800 mt-2">Dotted Triangle</span>
    </div>

    {/* 4. Dotted Rectangle */}
    <div className="bg-white border-2 border-slate-300 rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-xs">
      <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
        <rect x="10" y="24" width="80" height="52" rx="2" stroke="#0f172a" strokeWidth="4" strokeDasharray="6 8" />
        <circle cx="10" cy="24" r="4" fill="#059669" />
        <text x="50" y="54" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#94a3b8">Start ●</text>
      </svg>
      <span className="text-xs font-black text-slate-800 mt-2">Dotted Rectangle</span>
    </div>
  </div>
);

// -------------------------------------------------------------------------
// 4. DOTTED PRE-WRITING PATHS (Straight, Wavy, Zigzag)
// -------------------------------------------------------------------------

/** SVG Vector Straight Lines Track */
export const SvgDottedStraightTrack: React.FC<{ startEmoji: string; endEmoji: string; startLabel: string; endLabel: string }> = ({
  startEmoji,
  endEmoji,
  startLabel,
  endLabel,
}) => (
  <div className="bg-white border-2 border-slate-300 rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-3 shadow-2xs">
    <div className="flex items-center gap-2 shrink-0">
      <span className="text-3xl sm:text-4xl">{startEmoji}</span>
      <span className="text-xs font-black text-slate-700 hidden sm:inline">{startLabel}</span>
    </div>

    {/* Full-width SVG Dotted Vector Line */}
    <div className="flex-1 px-2">
      <svg width="100%" height="30" viewBox="0 0 300 30" fill="none" preserveAspectRatio="none">
        <line x1="10" y1="15" x2="285" y2="15" stroke="#0f172a" strokeWidth="4.5" strokeDasharray="8 10" strokeLinecap="round" />
        {/* Arrow head at finish */}
        <path d="M280 8 L295 15 L280 22" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {/* Start dot */}
        <circle cx="10" cy="15" r="4" fill="#db2777" />
      </svg>
    </div>

    <div className="flex items-center gap-2 shrink-0">
      <span className="text-xs font-black text-slate-700 hidden sm:inline">{endLabel}</span>
      <span className="text-3xl sm:text-4xl">{endEmoji}</span>
    </div>
  </div>
);

/** SVG Vector Wavy Lines Track */
export const SvgDottedWavyTrack: React.FC<{ startEmoji: string; endEmoji: string; startLabel: string; endLabel: string }> = ({
  startEmoji,
  endEmoji,
  startLabel,
  endLabel,
}) => (
  <div className="bg-white border-2 border-slate-300 rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-3 shadow-2xs">
    <div className="flex items-center gap-2 shrink-0">
      <span className="text-3xl sm:text-4xl">{startEmoji}</span>
      <span className="text-xs font-black text-slate-700 hidden sm:inline">{startLabel}</span>
    </div>

    <div className="flex-1 px-2">
      <svg width="100%" height="40" viewBox="0 0 300 40" fill="none" preserveAspectRatio="none">
        <path
          d="M10 20 Q35 2 60 20 T110 20 T160 20 T210 20 T260 20 L285 20"
          stroke="#0f172a"
          strokeWidth="4.5"
          strokeDasharray="8 10"
          strokeLinecap="round"
          fill="none"
        />
        <path d="M280 13 L295 20 L280 27" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="10" cy="20" r="4" fill="#0284c7" />
      </svg>
    </div>

    <div className="flex items-center gap-2 shrink-0">
      <span className="text-xs font-black text-slate-700 hidden sm:inline">{endLabel}</span>
      <span className="text-3xl sm:text-4xl">{endEmoji}</span>
    </div>
  </div>
);

/** SVG Vector Zigzag Lines Track */
export const SvgDottedZigzagTrack: React.FC<{ startEmoji: string; endEmoji: string; startLabel: string; endLabel: string }> = ({
  startEmoji,
  endEmoji,
  startLabel,
  endLabel,
}) => (
  <div className="bg-white border-2 border-slate-300 rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-3 shadow-2xs">
    <div className="flex items-center gap-2 shrink-0">
      <span className="text-3xl sm:text-4xl">{startEmoji}</span>
      <span className="text-xs font-black text-slate-700 hidden sm:inline">{startLabel}</span>
    </div>

    <div className="flex-1 px-2">
      <svg width="100%" height="40" viewBox="0 0 300 40" fill="none" preserveAspectRatio="none">
        <path
          d="M10 32 L35 8 L60 32 L85 8 L110 32 L135 8 L160 32 L185 8 L210 32 L235 8 L260 32 L285 8"
          stroke="#0f172a"
          strokeWidth="4.5"
          strokeDasharray="8 10"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path d="M280 2 L295 8 L288 20" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="10" cy="32" r="4" fill="#d97706" />
      </svg>
    </div>

    <div className="flex items-center gap-2 shrink-0">
      <span className="text-xs font-black text-slate-700 hidden sm:inline">{endLabel}</span>
      <span className="text-3xl sm:text-4xl">{endEmoji}</span>
    </div>
  </div>
);
