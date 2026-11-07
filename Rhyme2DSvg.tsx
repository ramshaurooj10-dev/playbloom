import React from 'react';

interface Rhyme2DSvgProps {
  type: string;
  size?: number;
  className?: string;
}

export const Rhyme2DSvg: React.FC<Rhyme2DSvgProps> = ({ type, size = 120, className = '' }) => {
  const s = size;

  switch (type) {
    // -------------------------------------------------------------------------
    // 1. Alphabet Train
    // -------------------------------------------------------------------------
    case 'train':
      return (
        <svg width={s} height={s} viewBox="0 0 140 140" fill="none" className={className}>
          {/* Steam Cloud */}
          <circle cx="95" cy="30" r="10" fill="#e2e8f0" />
          <circle cx="110" cy="22" r="8" fill="#f1f5f9" />
          {/* Train Body */}
          <rect x="25" y="55" width="85" height="48" rx="10" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="3" />
          {/* Cabin */}
          <rect x="75" y="38" width="35" height="40" rx="6" fill="#ef4444" stroke="#b91c1c" strokeWidth="3" />
          <rect x="83" y="44" width="18" height="16" rx="3" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
          {/* Chimney */}
          <path d="M42 55 L38 35 L52 35 L48 55 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="2.5" />
          {/* Letters on Train */}
          <text x="36" y="85" fill="#ffffff" fontSize="18" fontWeight="900" fontFamily="sans-serif">A</text>
          <text x="52" y="85" fill="#fef08a" fontSize="18" fontWeight="900" fontFamily="sans-serif">B</text>
          <text x="68" y="85" fill="#ffffff" fontSize="18" fontWeight="900" fontFamily="sans-serif">C</text>
          {/* Wheels */}
          <circle cx="45" cy="106" r="14" fill="#334155" stroke="#0f172a" strokeWidth="3" />
          <circle cx="45" cy="106" r="5" fill="#e2e8f0" />
          <circle cx="92" cy="106" r="14" fill="#334155" stroke="#0f172a" strokeWidth="3" />
          <circle cx="92" cy="106" r="5" fill="#e2e8f0" />
          {/* Track */}
          <line x1="15" y1="120" x2="125" y2="120" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    // -------------------------------------------------------------------------
    // 2. Apples in Tree
    // -------------------------------------------------------------------------
    case 'apples':
      return (
        <svg width={s} height={s} viewBox="0 0 140 140" fill="none" className={className}>
          {/* Trunk */}
          <rect x="58" y="80" width="24" height="45" rx="4" fill="#854d0e" stroke="#713f12" strokeWidth="3" />
          {/* Foliage */}
          <circle cx="50" cy="55" r="32" fill="#22c55e" stroke="#15803d" strokeWidth="3" />
          <circle cx="90" cy="55" r="32" fill="#22c55e" stroke="#15803d" strokeWidth="3" />
          <circle cx="70" cy="38" r="30" fill="#4ade80" stroke="#15803d" strokeWidth="3" />
          {/* 5 Apples */}
          <circle cx="48" cy="46" r="9" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" />
          <circle cx="72" cy="35" r="9" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" />
          <circle cx="92" cy="48" r="9" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" />
          <circle cx="58" cy="68" r="9" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" />
          <circle cx="82" cy="68" r="9" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" />
          {/* Apple Stems */}
          <path d="M48 37 Q50 34 52 35" stroke="#5c2d16" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M72 26 Q74 23 76 24" stroke="#5c2d16" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M92 39 Q94 36 96 37" stroke="#5c2d16" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </svg>
      );

    // -------------------------------------------------------------------------
    // 3. Shapes & Colors
    // -------------------------------------------------------------------------
    case 'shapes':
      return (
        <svg width={s} height={s} viewBox="0 0 140 140" fill="none" className={className}>
          {/* Yellow Circle */}
          <circle cx="45" cy="52" r="26" fill="#facc15" stroke="#ca8a04" strokeWidth="3" />
          <circle cx="38" cy="45" r="4" fill="#ffffff" opacity="0.6" />
          {/* Blue Square */}
          <rect x="70" y="60" width="46" height="46" rx="8" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="3" />
          <rect x="76" y="66" width="10" height="10" rx="2" fill="#ffffff" opacity="0.4" />
          {/* Green Triangle */}
          <polygon points="45,80 20,120 70,120" fill="#22c55e" stroke="#15803d" strokeWidth="3" strokeLinejoin="round" />
          {/* Star Sparkle */}
          <path d="M95 30 L98 40 L108 43 L98 46 L95 56 L92 46 L82 43 L92 40 Z" fill="#fb923c" />
        </svg>
      );

    // -------------------------------------------------------------------------
    // 4. Little Bunny
    // -------------------------------------------------------------------------
    case 'bunny':
      return (
        <svg width={s} height={s} viewBox="0 0 140 140" fill="none" className={className}>
          {/* Ears */}
          <ellipse cx="56" cy="38" rx="8" ry="24" fill="#ffffff" stroke="#94a3b8" strokeWidth="3" transform="rotate(-10 56 38)" />
          <ellipse cx="56" cy="38" rx="4" ry="16" fill="#fbcfe8" transform="rotate(-10 56 38)" />
          <ellipse cx="84" cy="38" rx="8" ry="24" fill="#ffffff" stroke="#94a3b8" strokeWidth="3" transform="rotate(10 84 38)" />
          <ellipse cx="84" cy="38" rx="4" ry="16" fill="#fbcfe8" transform="rotate(10 84 38)" />
          {/* Head */}
          <circle cx="70" cy="74" r="28" fill="#ffffff" stroke="#94a3b8" strokeWidth="3" />
          {/* Eyes */}
          <circle cx="60" cy="70" r="3.5" fill="#0f172a" />
          <circle cx="80" cy="70" r="3.5" fill="#0f172a" />
          <circle cx="58.5" cy="68.5" r="1.2" fill="#ffffff" />
          <circle cx="78.5" cy="68.5" r="1.2" fill="#ffffff" />
          {/* Nose & Whiskers */}
          <polygon points="70,76 66,73 74,73" fill="#f472b6" />
          <path d="M70 76 L70 82 M66 82 Q70 85 74 82" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <path d="M52 74 L40 72 M52 78 L38 80" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M88 74 L100 72 M88 78 L102 80" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
          {/* Carrot */}
          <polygon points="70,118 62,94 78,94" fill="#f97316" stroke="#c2410c" strokeWidth="2" strokeLinejoin="round" />
          <path d="M70 94 L68 86 M70 94 L70 84 M70 94 L73 86" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    // -------------------------------------------------------------------------
    // 5. Veggies
    // -------------------------------------------------------------------------
    case 'veggies':
      return (
        <svg width={s} height={s} viewBox="0 0 140 140" fill="none" className={className}>
          {/* Tomato */}
          <circle cx="45" cy="85" r="22" fill="#ef4444" stroke="#b91c1c" strokeWidth="3" />
          <path d="M45 63 L43 56 M45 63 L49 58 M45 63 L41 61 M45 63 L50 63" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="38" cy="78" r="4" fill="#ffffff" opacity="0.5" />
          {/* Carrot */}
          <polygon points="98,115 80,65 96,55" fill="#f97316" stroke="#c2410c" strokeWidth="3" strokeLinejoin="round" />
          <path d="M88 60 L86 48 M88 60 L92 46 M88 60 L96 50" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
          {/* Broccoli Floret */}
          <circle cx="70" cy="55" r="16" fill="#22c55e" stroke="#15803d" strokeWidth="2.5" />
          <circle cx="58" cy="62" r="12" fill="#16a34a" stroke="#15803d" strokeWidth="2" />
        </svg>
      );

    // -------------------------------------------------------------------------
    // 6. Magic Words / Hands
    // -------------------------------------------------------------------------
    case 'magic_words':
      return (
        <svg width={s} height={s} viewBox="0 0 140 140" fill="none" className={className}>
          {/* Magic Wand */}
          <line x1="30" y1="110" x2="95" y2="45" stroke="#475569" strokeWidth="7" strokeLinecap="round" />
          <line x1="80" y1="60" x2="95" y2="45" stroke="#f1f5f9" strokeWidth="7" strokeLinecap="round" />
          {/* Star on tip */}
          <path
            d="M95 45 L102 30 L117 38 L108 52 L118 64 L102 65 L95 80 L88 65 L72 64 L82 52 L73 38 L88 30 Z"
            fill="#facc15"
            stroke="#ca8a04"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Magic Sparkles */}
          <circle cx="45" cy="40" r="4" fill="#38bdf8" />
          <circle cx="115" cy="85" r="5" fill="#fb923c" />
          <circle cx="35" cy="70" r="3" fill="#a855f7" />
          <text x="35" y="130" fill="#6366f1" fontSize="13" fontWeight="900" fontFamily="sans-serif">PLEASE & THANKS</text>
        </svg>
      );

    // -------------------------------------------------------------------------
    // 7. Soap & Bubbles
    // -------------------------------------------------------------------------
    case 'soap_bubbles':
      return (
        <svg width={s} height={s} viewBox="0 0 140 140" fill="none" className={className}>
          {/* Soap Bar */}
          <rect x="35" y="70" width="70" height="42" rx="14" fill="#38bdf8" stroke="#0284c7" strokeWidth="3" />
          <ellipse cx="70" cy="85" rx="24" ry="8" fill="#e0f2fe" opacity="0.6" />
          {/* Water Drops */}
          <path d="M70 30 C70 30, 60 44, 60 50 C60 56, 64 60, 70 60 C76 60, 80 56, 80 50 C80 44, 70 30, 70 30 Z" fill="#0ea5e9" stroke="#0284c7" strokeWidth="2" />
          {/* Bubbles */}
          <circle cx="40" cy="45" r="12" fill="#bae6fd" stroke="#38bdf8" strokeWidth="2" opacity="0.8" />
          <circle cx="36" cy="41" r="3" fill="#ffffff" />
          <circle cx="95" cy="45" r="15" fill="#bae6fd" stroke="#38bdf8" strokeWidth="2" opacity="0.8" />
          <circle cx="90" cy="40" r="4" fill="#ffffff" />
          <circle cx="110" cy="75" r="8" fill="#bae6fd" stroke="#38bdf8" strokeWidth="1.5" opacity="0.8" />
        </svg>
      );

    // -------------------------------------------------------------------------
    // 8. Listening Ears / Gentle Child
    // -------------------------------------------------------------------------
    case 'listening_ears':
      return (
        <svg width={s} height={s} viewBox="0 0 140 140" fill="none" className={className}>
          {/* Left Ear */}
          <circle cx="38" cy="70" r="14" fill="#fed7aa" stroke="#ea580c" strokeWidth="2.5" />
          {/* Right Ear */}
          <circle cx="102" cy="70" r="14" fill="#fed7aa" stroke="#ea580c" strokeWidth="2.5" />
          {/* Head */}
          <circle cx="70" cy="70" r="32" fill="#ffedd5" stroke="#ea580c" strokeWidth="3" />
          {/* Hair */}
          <path d="M42 55 Q70 32 98 55 Q70 42 42 55 Z" fill="#92400e" />
          {/* Eyes with friendly look */}
          <circle cx="58" cy="68" r="3.5" fill="#0f172a" />
          <circle cx="82" cy="68" r="3.5" fill="#0f172a" />
          {/* Gentle Smile */}
          <path d="M60 82 Q70 90 80 82" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Music / sound cues near ears */}
          <path d="M22 62 Q16 70 22 78" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M118 62 Q124 70 118 78" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </svg>
      );

    // -------------------------------------------------------------------------
    // 9. Rain Cloud
    // -------------------------------------------------------------------------
    case 'rain_cloud':
      return (
        <svg width={s} height={s} viewBox="0 0 140 140" fill="none" className={className}>
          {/* Sun peek */}
          <circle cx="45" cy="45" r="20" fill="#facc15" stroke="#ca8a04" strokeWidth="2.5" />
          {/* Cloud */}
          <path
            d="M45 80 C36 80 30 72 32 64 C32 54 42 50 50 52 C54 40 68 38 78 44 C86 42 98 48 98 58 C106 60 110 68 108 76 C106 82 98 84 94 84 Z"
            fill="#93c5fd"
            stroke="#2563eb"
            strokeWidth="3"
          />
          {/* Raindrops */}
          <line x1="45" y1="95" x2="40" y2="115" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
          <line x1="65" y1="95" x2="60" y2="115" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
          <line x1="85" y1="95" x2="80" y2="115" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
          <line x1="102" y1="95" x2="97" y2="115" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    // -------------------------------------------------------------------------
    // 10. Happy Face & Feelings
    // -------------------------------------------------------------------------
    case 'happy_face':
      return (
        <svg width={s} height={s} viewBox="0 0 140 140" fill="none" className={className}>
          <circle cx="70" cy="70" r="48" fill="#fef08a" stroke="#ca8a04" strokeWidth="3.5" />
          {/* Happy Eyes (Arches) */}
          <path d="M48 62 Q56 50 64 62" stroke="#713f12" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M76 62 Q84 50 92 62" stroke="#713f12" strokeWidth="4" strokeLinecap="round" fill="none" />
          {/* Rosy Cheeks */}
          <circle cx="44" cy="76" r="7" fill="#f43f5e" opacity="0.35" />
          <circle cx="96" cy="76" r="7" fill="#f43f5e" opacity="0.35" />
          {/* Big Warm Smile */}
          <path d="M48 76 Q70 106 92 76 Z" fill="#b91c1c" stroke="#713f12" strokeWidth="2.5" />
          <path d="M60 88 Q70 94 80 88" fill="#f87171" />
        </svg>
      );

    // -------------------------------------------------------------------------
    // 11. Sunshine / Morning
    // -------------------------------------------------------------------------
    case 'sunshine':
      return (
        <svg width={s} height={s} viewBox="0 0 140 140" fill="none" className={className}>
          {/* Sun Rays */}
          <g stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round">
            <line x1="70" y1="18" x2="70" y2="30" />
            <line x1="70" y1="110" x2="70" y2="122" />
            <line x1="18" y1="70" x2="30" y2="70" />
            <line x1="110" y1="70" x2="122" y2="70" />
            <line x1="33" y1="33" x2="42" y2="42" />
            <line x1="98" y1="98" x2="107" y2="107" />
            <line x1="33" y1="107" x2="42" y2="98" />
            <line x1="98" y1="42" x2="107" y2="33" />
          </g>
          {/* Sun Core */}
          <circle cx="70" cy="70" r="32" fill="#fde047" stroke="#ea580c" strokeWidth="3" />
          {/* Cheerful Sun Eyes & Smile */}
          <circle cx="58" cy="66" r="3.5" fill="#713f12" />
          <circle cx="82" cy="66" r="3.5" fill="#713f12" />
          <path d="M60 76 Q70 84 80 76" stroke="#713f12" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </svg>
      );

    // -------------------------------------------------------------------------
    // 12. Tidy Toys
    // -------------------------------------------------------------------------
    case 'tidy_toys':
    default:
      return (
        <svg width={s} height={s} viewBox="0 0 140 140" fill="none" className={className}>
          {/* Toy Box */}
          <rect x="25" y="65" width="90" height="50" rx="8" fill="#fb923c" stroke="#c2410c" strokeWidth="3" />
          <path d="M25 65 L70 50 L115 65" fill="#fdba74" stroke="#c2410c" strokeWidth="2.5" />
          {/* Blocks inside */}
          <rect x="38" y="45" width="22" height="22" rx="4" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2" />
          <rect x="75" y="42" width="24" height="24" rx="4" fill="#22c55e" stroke="#15803d" strokeWidth="2" />
          <circle cx="68" cy="38" r="10" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" />
          {/* Star label on box */}
          <polygon points="70,82 73,88 80,89 75,94 76,101 70,97 64,101 65,94 60,89 67,88" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
        </svg>
      );
  }
};
