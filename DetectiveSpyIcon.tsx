import React from 'react';

interface DetectiveSpyIconProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const DetectiveSpyIcon: React.FC<DetectiveSpyIconProps> = ({
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
      aria-label="Cute Detective Spy Icon"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md overflow-visible"
      >
        <defs>
          {/* Background Soft Glow */}
          <linearGradient id="detBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ECFDF5" />
            <stop offset="100%" stopColor="#D1FAE5" />
          </linearGradient>

          {/* Detective Cap Gradients */}
          <linearGradient id="capCrownGrad" x1="10%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="40%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
          <linearGradient id="capBrimGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
          <linearGradient id="capBandGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#047857" />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#065F46" />
          </linearGradient>

          {/* Skin & Face Gradient */}
          <linearGradient id="faceGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF1E6" />
            <stop offset="60%" stopColor="#FED7AA" />
            <stop offset="100%" stopColor="#FDBA74" />
          </linearGradient>

          {/* Hair Gradient */}
          <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#78350F" />
            <stop offset="100%" stopColor="#451A03" />
          </linearGradient>

          {/* Trench Coat / Collar Gradient */}
          <linearGradient id="coatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="60%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          {/* Magnifying Glass Bezel & Rim (Shiny Gold) */}
          <linearGradient id="mgRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="30%" stopColor="#FBBF24" />
            <stop offset="70%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          {/* Magnifying Glass Lens (Crystal Aqua Blue) */}
          <linearGradient id="mgLensGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#7DD3FC" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0.9" />
          </linearGradient>

          {/* Handle Gradient */}
          <linearGradient id="mgHandleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0D9488" />
            <stop offset="50%" stopColor="#0F766E" />
            <stop offset="100%" stopColor="#115E59" />
          </linearGradient>

          {/* Star Sparkle */}
          <linearGradient id="sparkleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="50%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>

        {/* 1. Subtle Circular Backdrop Plate */}
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="url(#detBgGrad)"
          stroke="#34D399"
          strokeWidth="2.5"
          strokeDasharray="4 3"
          opacity="0.85"
        />

        {/* 2. Sparkles in background */}
        <path
          d="M16 26 L17.5 22 L19 26 L23 27.5 L19 29 L17.5 33 L16 29 L12 27.5 Z"
          fill="url(#sparkleGrad)"
        />
        <path
          d="M84 20 L85.5 17 L87 20 L90 21.5 L87 23 L85.5 26 L84 23 L81 21.5 Z"
          fill="url(#sparkleGrad)"
        />

        {/* 3. Detective Body & Coat Collar */}
        <g id="detective-body">
          {/* Coat Shoulder Base */}
          <path
            d="M20 90 C20 74 30 70 42 70 L58 70 C70 70 80 74 80 90 Z"
            fill="url(#coatGrad)"
            stroke="#92400E"
            strokeWidth="2"
          />

          {/* Collar Flaps */}
          <path
            d="M32 70 L44 84 L38 88 L26 76 Z"
            fill="#FEF3C7"
            stroke="#B45309"
            strokeWidth="1.5"
          />
          <path
            d="M68 70 L56 84 L62 88 L74 76 Z"
            fill="#FEF3C7"
            stroke="#B45309"
            strokeWidth="1.5"
          />

          {/* Cute Emerald Bowtie */}
          <g transform="translate(50, 75)">
            <path
              d="M-8 -4 L0 -1 L-8 3 Z"
              fill="#059669"
              stroke="#064E3B"
              strokeWidth="1.2"
            />
            <path
              d="M8 -4 L0 -1 L8 3 Z"
              fill="#059669"
              stroke="#064E3B"
              strokeWidth="1.2"
            />
            <circle cx="0" cy="-0.5" r="2.8" fill="#10B981" stroke="#064E3B" strokeWidth="1.2" />
          </g>
        </g>

        {/* 4. Detective Head & Face */}
        <g id="detective-head">
          {/* Cute Round Ears */}
          <circle cx="28" cy="52" r="6" fill="#FED7AA" stroke="#EA580C" strokeWidth="1.5" />
          <circle cx="28" cy="52" r="3.2" fill="#FDBA74" />
          <circle cx="72" cy="52" r="6" fill="#FED7AA" stroke="#EA580C" strokeWidth="1.5" />
          <circle cx="72" cy="52" r="3.2" fill="#FDBA74" />

          {/* Chubby Cheerful Face */}
          <ellipse
            cx="50"
            cy="52"
            rx="23"
            ry="21"
            fill="url(#faceGrad)"
            stroke="#EA580C"
            strokeWidth="2"
          />

          {/* Hair Tufts peeking under hat */}
          <path
            d="M31 38 C32 44 29 48 26 50 C29 46 34 44 36 38 Z"
            fill="url(#hairGrad)"
          />
          <path
            d="M69 38 C68 44 71 48 74 50 C71 46 66 44 64 38 Z"
            fill="url(#hairGrad)"
          />
          <path
            d="M44 36 C47 41 53 41 56 36 Z"
            fill="url(#hairGrad)"
          />

          {/* Rosy Cheeks */}
          <ellipse cx="36" cy="57" rx="4.5" ry="3" fill="#FDA4AF" opacity="0.8" />
          <ellipse cx="64" cy="57" rx="4.5" ry="3" fill="#FDA4AF" opacity="0.8" />

          {/* Left Eye (Curious / Big Cartoon Eye) */}
          <g transform="translate(39, 48)">
            <ellipse cx="0" cy="0" rx="4.5" ry="5.5" fill="#1E293B" />
            <ellipse cx="0" cy="0" rx="3.5" ry="4.5" fill="#047857" />
            <circle cx="0" cy="0" r="2.5" fill="#0F172A" />
            <circle cx="-1.2" cy="-1.8" r="1.5" fill="#FFFFFF" />
            <circle cx="1.2" cy="1.5" r="0.8" fill="#FFFFFF" />
          </g>

          {/* Right Eye (Peering / Winking with Delight through the Magnifying area) */}
          <g transform="translate(61, 48)">
            <ellipse cx="0" cy="0" rx="4.5" ry="5.5" fill="#1E293B" />
            <ellipse cx="0" cy="0" rx="3.5" ry="4.5" fill="#047857" />
            <circle cx="0" cy="0" r="2.5" fill="#0F172A" />
            <circle cx="-1.2" cy="-1.8" r="1.5" fill="#FFFFFF" />
            <circle cx="1.2" cy="1.5" r="0.8" fill="#FFFFFF" />
          </g>

          {/* Cute Button Nose */}
          <ellipse cx="50" cy="53.5" rx="2" ry="1.5" fill="#FB923C" />

          {/* Happy Confident Smile */}
          <path
            d="M45 57 Q50 63 55 57"
            stroke="#9A3412"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
          {/* Tongue/Smile Depth */}
          <path
            d="M47 58 Q50 62 53 58"
            fill="#F43F5E"
          />
        </g>

        {/* 5. Detective Hat / Deerstalker Cap */}
        <g id="detective-hat">
          {/* Hat Crown */}
          <path
            d="M26 36 C26 18 36 12 50 12 C64 12 74 18 74 36 Z"
            fill="url(#capCrownGrad)"
            stroke="#78350F"
            strokeWidth="2.2"
          />

          {/* Deerstalker Crown Seam */}
          <path
            d="M50 12 L50 36"
            stroke="#92400E"
            strokeWidth="1.8"
            strokeDasharray="2 1.5"
          />

          {/* Cap Ribbon Band */}
          <path
            d="M25 32 C33 35 67 35 75 32 L74.5 37 C67 40 33 40 25.5 37 Z"
            fill="url(#capBandGrad)"
            stroke="#064E3B"
            strokeWidth="1.2"
          />

          {/* Front Visor Brim */}
          <path
            d="M22 36 C32 44 68 44 78 36 C70 41 30 41 22 36 Z"
            fill="url(#capBrimGrad)"
            stroke="#78350F"
            strokeWidth="2"
          />

          {/* Hat Top Button / Bow Knot */}
          <ellipse cx="50" cy="12" rx="4.5" ry="3" fill="#B45309" stroke="#78350F" strokeWidth="1.5" />
          <circle cx="50" cy="11.5" r="1.8" fill="#FDE68A" />
        </g>

        {/* 6. Foreground Playful Magnifying Glass (Held by Detective) */}
        <g id="magnifying-glass" transform="translate(4, 4)">
          {/* Handle */}
          <g transform="rotate(-38 68 68)">
            <rect
              x="62"
              y="60"
              width="10"
              height="26"
              rx="5"
              fill="url(#mgHandleGrad)"
              stroke="#042F2E"
              strokeWidth="2"
            />
            {/* Grip Rings */}
            <line x1="63" y1="67" x2="71" y2="67" stroke="#5EEAD4" strokeWidth="1.5" />
            <line x1="63" y1="72" x2="71" y2="72" stroke="#5EEAD4" strokeWidth="1.5" />
            <line x1="63" y1="77" x2="71" y2="77" stroke="#5EEAD4" strokeWidth="1.5" />
            {/* Golden End Cap */}
            <circle cx="67" cy="84" r="4.5" fill="#FBBF24" stroke="#B45309" strokeWidth="1.5" />
          </g>

          {/* Golden Frame / Rim */}
          <circle
            cx="58"
            cy="52"
            r="21"
            fill="url(#mgRimGrad)"
            stroke="#78350F"
            strokeWidth="2.8"
          />

          {/* Crystal Glass Lens */}
          <circle
            cx="58"
            cy="52"
            r="16.5"
            fill="url(#mgLensGrad)"
            stroke="#0284C7"
            strokeWidth="1.2"
          />

          {/* Inside Lens: Mini Hidden Rocket/Star Clue Discovery */}
          <g transform="translate(54, 47) scale(0.65)">
            <path
              d="M8 0 C11 4 14 10 14 16 L2 16 C2 10 5 4 8 0 Z"
              fill="#EF4444"
              stroke="#991B1B"
              strokeWidth="1.5"
            />
            <circle cx="8" cy="10" r="2.8" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1" />
            {/* Rocket Fins */}
            <path d="M2 12 L-2 18 L3 16 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
            <path d="M14 12 L18 18 L13 16 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
            {/* Jet Fire */}
            <polygon points="5,16 8,21 11,16" fill="#FDE047" />
          </g>

          {/* Lens Specular Curved Highlight */}
          <path
            d="M46 44 C48 39 53 37 59 37"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.9"
          />
          <circle cx="44" cy="49" r="1.5" fill="#FFFFFF" opacity="0.9" />

          {/* Little Detective Hand Holding the Rim */}
          <ellipse
            cx="40"
            cy="63"
            rx="5.5"
            ry="4.5"
            fill="#FED7AA"
            stroke="#EA580C"
            strokeWidth="1.5"
          />
          <circle cx="43" cy="62" r="2" fill="#FDBA74" />
        </g>

        {/* 7. Golden Discovery Star Twinkle on Top Right of Lens */}
        <g transform="translate(68, 30) scale(0.7)">
          <path
            d="M10 0 L12.5 7.5 L20 10 L12.5 12.5 L10 20 L7.5 12.5 L0 10 L7.5 7.5 Z"
            fill="#FEF08A"
            stroke="#D97706"
            strokeWidth="1.2"
          />
          <circle cx="10" cy="10" r="2" fill="#FFFFFF" />
        </g>
      </svg>
    </div>
  );
};
