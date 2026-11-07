import React from 'react';

export interface ActivityStepIllustrationProps {
  activityId?: string;
  stepNumber: number;
  type?: string;
  highlightDetail?: string;
  title?: string;
  instruction?: string;
  topic?: string;
  materials?: string[];
  className?: string;
}

export const ActivityStepIllustration: React.FC<ActivityStepIllustrationProps> = ({
  activityId,
  stepNumber,
  type,
  highlightDetail,
  title,
  instruction = '',
  topic = '',
  materials = [],
  className = 'w-full h-44',
}) => {
  const normId = (activityId || '').toLowerCase();
  const normTopic = topic.toLowerCase();
  const normInstruction = instruction.toLowerCase();
  const allMatText = materials.join(' ').toLowerCase();

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-50 to-amber-50/40 border-2 border-amber-200/80 p-2 flex flex-col items-center justify-center select-none shadow-xs ${className}`}>
      <svg
        viewBox="0 0 320 180"
        className="w-full h-full max-h-40 drop-shadow-xs"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft Background Classroom Wall */}
        <rect width="320" height="180" rx="16" fill="#F8FAFC" />

        {/* Pastel Wall Bunting Banner */}
        <circle cx="24" cy="20" r="10" fill="#FEF08A" opacity="0.6" />
        <circle cx="296" cy="24" r="8" fill="#BAE6FD" opacity="0.7" />
        <path d="M 40 12 Q 160 28 280 12" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="4 4" />
        <polygon points="70,16 80,28 90,16" fill="#FCA5A5" />
        <polygon points="110,18 120,30 130,18" fill="#93C5FD" />
        <polygon points="150,19 160,31 170,19" fill="#86EFAC" />
        <polygon points="190,18 200,30 210,18" fill="#FDE047" />
        <polygon points="230,16 240,28 250,16" fill="#D8B4FE" />

        {/* Classroom Floor Base Line */}
        <rect x="0" y="142" width="320" height="38" fill="#F1F5F9" />
        <line x1="0" y1="142" x2="320" y2="142" stroke="#E2E8F0" strokeWidth="2" />

        {/* ========================================================================= */}
        {/* 1. LETTER SOUND HUNT (act-alphabet-sound-hunt)                             */}
        {/* ========================================================================= */}
        {normId.includes('sound-hunt') && (
          <g id="scene-sound-hunt">
            {stepNumber === 1 && (
              // Step 1: Big Letter 'B' card & woven basket on rug
              <g>
                <ellipse cx="160" cy="142" rx="120" ry="24" fill="#E2E8F0" />
                {/* Woven Basket */}
                <path d="M 60 110 L 70 142 L 120 142 L 130 110 Z" fill="#D97706" stroke="#92400E" strokeWidth="2" />
                <path d="M 62 110 Q 95 120 128 110" stroke="#B45309" strokeWidth="2" fill="none" />
                <path d="M 75 110 Q 95 70 115 110" stroke="#92400E" strokeWidth="3" fill="none" />
                {/* Large Letter 'B' Display Card */}
                <rect x="150" y="55" width="120" height="85" rx="8" fill="#FFFFFF" stroke="#0284C7" strokeWidth="3" />
                <rect x="158" y="63" width="104" height="69" rx="4" fill="#F0F9FF" />
                <text x="188" y="112" fill="#0369A1" fontSize="42" fontWeight="900" fontFamily="sans-serif">B</text>
                {/* Cute Bear & Ball on the card */}
                <circle cx="232" cy="85" r="12" fill="#B45309" />
                <circle cx="224" cy="74" r="4" fill="#78350F" />
                <circle cx="240" cy="74" r="4" fill="#78350F" />
                <circle cx="232" cy="115" r="9" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
                {/* Sparkle */}
                <text x="135" y="60" fontSize="16">✨</text>
              </g>
            )}

            {stepNumber === 2 && (
              // Step 2: Teacher Emma holding B card, touching lips showing /b/ sound to Leo
              <g>
                {/* Teacher Emma */}
                <path d="M 50 142 C 50 108 90 108 90 142 Z" fill="#0284C7" />
                <polygon points="65,112 70,122 75,112" fill="#FFFFFF" />
                <circle cx="70" cy="84" r="17" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                <path d="M 54 80 C 54 66 86 66 86 80 C 80 72 60 72 54 80 Z" fill="#78350F" />
                <circle cx="70" cy="62" r="7" fill="#78350F" />
                <circle cx="65" cy="84" r="2" fill="#1E293B" />
                <circle cx="75" cy="84" r="2" fill="#1E293B" />
                {/* Mouth touching gesture */}
                <path d="M 66 92 Q 70 95 74 92" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
                <path d="M 85 118 Q 78 100 74 93" stroke="#FED7AA" strokeWidth="5" strokeLinecap="round" />
                {/* Letter B Card Held in other hand */}
                <rect x="110" y="65" width="70" height="55" rx="6" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2.5" />
                <text x="145" y="105" textAnchor="middle" fill="#0369A1" fontSize="30" fontWeight="900">B</text>
                <path d="M 85 125 L 115 105" stroke="#FED7AA" strokeWidth="5" strokeLinecap="round" />
                {/* Speech Bubble /b/ */}
                <rect x="120" y="32" width="65" height="24" rx="12" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
                <text x="152" y="48" textAnchor="middle" fill="#854D0E" fontSize="12" fontWeight="bold">/b/ /b/ 🎵</text>
                {/* Child Leo Listening */}
                <path d="M 230 142 C 230 118 265 118 265 142 Z" fill="#10B981" />
                <circle cx="248" cy="94" r="15" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                <path d="M 235 90 C 235 76 260 76 260 90 Z" fill="#9A3412" />
                <circle cx="243" cy="94" r="1.5" fill="#1E293B" />
                <circle cx="251" cy="94" r="1.5" fill="#1E293B" />
                <path d="M 244 100 Q 247 103 250 100" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
              </g>
            )}

            {stepNumber === 3 && (
              // Step 3: Child Leo holding woven basket, picking up ball and book
              <g>
                {/* Child Leo crouching & picking up */}
                <path d="M 120 142 C 120 115 155 115 155 142 Z" fill="#10B981" />
                <circle cx="138" cy="92" r="15" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                <path d="M 125 88 C 125 74 150 74 150 88 Z" fill="#9A3412" />
                <circle cx="134" cy="92" r="1.5" fill="#1E293B" />
                <circle cx="142" cy="92" r="1.5" fill="#1E293B" />
                <path d="M 135 98 Q 138 102 141 98" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
                {/* Leo holding basket with one hand */}
                <path d="M 128 120 L 105 125" stroke="#FED7AA" strokeWidth="5" strokeLinecap="round" />
                <path d="M 75 115 L 82 142 L 120 142 L 128 115 Z" fill="#D97706" stroke="#92400E" strokeWidth="2" />
                {/* Inside basket: Bear toy */}
                <circle cx="102" cy="120" r="8" fill="#B45309" />
                {/* Leo reaching other hand to pick up red ball */}
                <path d="M 148 120 L 195 130" stroke="#FED7AA" strokeWidth="5" strokeLinecap="round" />
                <circle cx="205" cy="132" r="12" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
                {/* Blue Book on Floor nearby */}
                <rect x="235" y="128" width="30" height="15" rx="3" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1.5" />
                <text x="245" y="139" fill="#FFFFFF" fontSize="9" fontWeight="bold">B</text>
                <text x="180" y="105" fill="#EAB308" fontSize="16">✨</text>
              </g>
            )}

            {stepNumber >= 4 && (
              // Step 4: Leo pulls red ball out of basket in circle to show Teacher Emma
              <g>
                {/* Teacher Emma Sitting */}
                <path d="M 60 142 C 60 115 95 115 95 142 Z" fill="#0284C7" />
                <circle cx="78" cy="92" r="15" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                <path d="M 66 88 C 66 75 90 75 90 88 Z" fill="#78350F" />
                <circle cx="78" cy="70" r="6" fill="#78350F" />
                {/* Child Leo presenting ball */}
                <path d="M 220 142 C 220 115 255 115 255 142 Z" fill="#10B981" />
                <circle cx="238" cy="92" r="15" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                <path d="M 225 88 C 225 74 250 74 250 88 Z" fill="#9A3412" />
                {/* Reaching arm holding high the red ball */}
                <path d="M 230 118 L 175 95" stroke="#FED7AA" strokeWidth="6" strokeLinecap="round" />
                <circle cx="165" cy="90" r="14" fill="#EF4444" stroke="#B91C1C" strokeWidth="2.5" />
                {/* Speech Banner: /b/ Ball! */}
                <rect x="120" y="45" width="90" height="26" rx="13" fill="#DCFCE7" stroke="#16A34A" strokeWidth="2" />
                <text x="165" y="62" textAnchor="middle" fill="#15803D" fontSize="12" fontWeight="black">/b/ BALL! ⚽</text>
                {/* Basket on Floor */}
                <path d="M 195 125 L 202 142 L 235 142 L 242 125 Z" fill="#D97706" stroke="#92400E" strokeWidth="1.5" />
                <text x="100" y="80" fontSize="18">🌟</text>
              </g>
            )}
          </g>
        )}

        {/* ========================================================================= */}
        {/* 2. COUNT & MATCH (act-count-and-match)                                    */}
        {/* ========================================================================= */}
        {normId.includes('count-and-match') && (
          <g id="scene-count-match">
            {stepNumber === 1 && (
              // Step 1: Number 3 card with 3 empty target dots & bowl of colorful buttons on table
              <g>
                {/* Wooden Craft Table */}
                <rect x="40" y="105" width="240" height="40" rx="6" fill="#FED7AA" stroke="#F97316" strokeWidth="2" />
                {/* Number 3 Mat */}
                <rect x="60" y="65" width="110" height="65" rx="8" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="3" />
                <text x="90" y="112" fill="#1D4ED8" fontSize="42" fontWeight="900">3</text>
                {/* 3 Empty Target Dots */}
                <circle cx="135" cy="80" r="8" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="2" strokeDasharray="3 3" />
                <circle cx="135" cy="100" r="8" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="2" strokeDasharray="3 3" />
                <circle cx="155" cy="90" r="8" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="2" strokeDasharray="3 3" />
                {/* Wooden Bowl of Round Buttons */}
                <ellipse cx="225" cy="100" rx="35" ry="16" fill="#FEF3C7" stroke="#D97706" strokeWidth="2.5" />
                <circle cx="212" cy="96" r="6" fill="#EF4444" stroke="#B91C1C" strokeWidth="1" />
                <circle cx="225" cy="94" r="6" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1" />
                <circle cx="238" cy="96" r="6" fill="#EAB308" stroke="#CA8A04" strokeWidth="1" />
                <circle cx="220" cy="102" r="5.5" fill="#10B981" stroke="#047857" strokeWidth="1" />
              </g>
            )}

            {stepNumber === 2 && (
              // Step 2: Teacher Emma pointing index finger directly at dots 1, 2, 3 on card
              <g>
                <rect x="40" y="115" width="240" height="30" rx="6" fill="#FED7AA" stroke="#F97316" strokeWidth="2" />
                {/* Teacher Emma */}
                <path d="M 50 142 C 50 108 90 108 90 142 Z" fill="#0284C7" />
                <circle cx="70" cy="84" r="17" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                <path d="M 54 80 C 54 66 86 66 86 80 Z" fill="#78350F" />
                <circle cx="70" cy="62" r="7" fill="#78350F" />
                {/* Number Card on Table */}
                <rect x="135" y="70" width="110" height="60" rx="6" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="2.5" />
                <text x="160" y="112" fill="#1D4ED8" fontSize="36" fontWeight="900">3</text>
                <circle cx="195" cy="85" r="7" fill="#EF4444" />
                <circle cx="195" cy="105" r="7" fill="#3B82F6" />
                <circle cx="215" cy="95" r="7" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="3 3" />
                {/* Teacher Pointing Arm */}
                <path d="M 85 115 Q 140 100 190 85" stroke="#FED7AA" strokeWidth="6" strokeLinecap="round" />
                {/* Speech Bubble: "1... 2... 3!" */}
                <rect x="110" y="32" width="95" height="26" rx="13" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
                <text x="157" y="49" textAnchor="middle" fill="#854D0E" fontSize="12" fontWeight="black">"1... 2... 3!" 🔢</text>
              </g>
            )}

            {stepNumber === 3 && (
              // Step 3: Child Leo placing 3 colorful buttons directly on the 3 dots
              <g>
                <rect x="30" y="115" width="260" height="30" rx="6" fill="#FED7AA" stroke="#F97316" strokeWidth="2" />
                {/* Child Leo */}
                <path d="M 60 142 C 60 115 95 115 95 142 Z" fill="#10B981" />
                <circle cx="78" cy="92" r="15" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                <path d="M 65 88 C 65 74 90 74 90 88 Z" fill="#9A3412" />
                {/* Number Card */}
                <rect x="125" y="65" width="120" height="65" rx="8" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="2.5" />
                <text x="155" y="110" fill="#1D4ED8" fontSize="38" fontWeight="900">3</text>
                {/* 3 Buttons Placed on the 3 dots */}
                <circle cx="195" cy="80" r="9" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
                <circle cx="195" cy="104" r="9" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1.5" />
                <circle cx="218" cy="92" r="9" fill="#EAB308" stroke="#CA8A04" strokeWidth="1.5" />
                {/* Child Hand placing the 3rd yellow button */}
                <path d="M 90 120 Q 150 110 210 95" stroke="#FED7AA" strokeWidth="5" strokeLinecap="round" />
                <text x="210" y="60" fontSize="16">✨</text>
              </g>
            )}

            {stepNumber >= 4 && (
              // Step 4: Teacher Emma & Child Leo counting 3 buttons together with counting star
              <g>
                {/* Teacher Emma Left */}
                <path d="M 40 142 C 40 112 75 112 75 142 Z" fill="#0284C7" />
                <circle cx="58" cy="88" r="15" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                <path d="M 46 84 C 46 72 70 72 70 84 Z" fill="#78350F" />
                {/* Child Leo Right */}
                <path d="M 245 142 C 245 118 280 118 280 142 Z" fill="#10B981" />
                <circle cx="262" cy="92" r="15" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                <path d="M 250 88 C 250 74 275 74 275 88 Z" fill="#9A3412" />
                {/* Center Completed Card with Gold Star */}
                <rect x="100" y="70" width="120" height="65" rx="8" fill="#FFFFFF" stroke="#10B981" strokeWidth="3" />
                <text x="130" y="112" fill="#059669" fontSize="36" fontWeight="900">3</text>
                <circle cx="170" cy="85" r="8" fill="#EF4444" />
                <circle cx="170" cy="105" r="8" fill="#3B82F6" />
                <circle cx="190" cy="95" r="8" fill="#EAB308" />
                {/* Gold Star Overhead */}
                <polygon points="160,25 166,38 180,38 168,48 172,62 160,52 148,62 152,48 140,38 154,38" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
                <text x="160" y="47" textAnchor="middle" fill="#78350F" fontSize="9" fontWeight="bold">⭐</text>
              </g>
            )}
          </g>
        )}

        {/* ========================================================================= */}
        {/* 3. COLOR SORTING (act-color-sorting)                                      */}
        {/* ========================================================================= */}
        {normId.includes('color-sorting') && (
          <g id="scene-color-sorting">
            {stepNumber === 1 && (
              // Step 1: 4 Colored Baskets (Red, Blue, Yellow, Green) in a row with center tray of toys
              <g>
                <ellipse cx="160" cy="142" rx="140" ry="25" fill="#E2E8F0" />
                {/* Red Basket */}
                <path d="M 30 95 L 38 135 L 72 135 L 80 95 Z" fill="#FEE2E2" stroke="#EF4444" strokeWidth="2.5" />
                <text x="55" y="122" textAnchor="middle" fill="#B91C1C" fontSize="10" fontWeight="bold">RED</text>
                {/* Blue Basket */}
                <path d="M 95 95 L 103 135 L 137 135 L 145 95 Z" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2.5" />
                <text x="120" y="122" textAnchor="middle" fill="#1D4ED8" fontSize="10" fontWeight="bold">BLUE</text>
                {/* Yellow Basket */}
                <path d="M 175 95 L 183 135 L 217 135 L 225 95 Z" fill="#FEF9C3" stroke="#EAB308" strokeWidth="2.5" />
                <text x="201" y="122" textAnchor="middle" fill="#A16207" fontSize="9" fontWeight="bold">YELLOW</text>
                {/* Green Basket */}
                <path d="M 240 95 L 248 135 L 282 135 L 290 95 Z" fill="#DCFCE7" stroke="#10B981" strokeWidth="2.5" />
                <text x="265" y="122" textAnchor="middle" fill="#15803D" fontSize="9" fontWeight="bold">GREEN</text>
                {/* Mixed Center Toy Tray */}
                <ellipse cx="160" cy="68" rx="40" ry="16" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2" />
                <circle cx="148" cy="66" r="6" fill="#EF4444" />
                <rect x="156" y="60" width="10" height="10" rx="2" fill="#3B82F6" />
                <polygon points="172,60 178,72 166,72" fill="#EAB308" />
              </g>
            )}

            {stepNumber === 2 && (
              // Step 2: Teacher Emma holding Red basket and red apple toy, prompting color name
              <g>
                <path d="M 60 142 C 60 108 100 108 100 142 Z" fill="#0284C7" />
                <circle cx="80" cy="84" r="17" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                <path d="M 64 80 C 64 66 96 66 96 80 Z" fill="#78350F" />
                <circle cx="80" cy="62" r="7" fill="#78350F" />
                {/* Teacher holding Red Basket */}
                <path d="M 130 90 L 138 125 L 167 125 L 175 90 Z" fill="#FEE2E2" stroke="#EF4444" strokeWidth="2.5" />
                <text x="152" y="112" textAnchor="middle" fill="#B91C1C" fontSize="9" fontWeight="bold">RED</text>
                {/* Holding Red Apple Toy */}
                <path d="M 95 110 L 140 85" stroke="#FED7AA" strokeWidth="5" strokeLinecap="round" />
                <circle cx="150" cy="78" r="10" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
                <path d="M 150 68 L 152 64" stroke="#15803D" strokeWidth="2" />
                {/* Speech Bubble: "What color is this?" */}
                <rect x="140" y="32" width="140" height="26" rx="13" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
                <text x="210" y="49" textAnchor="middle" fill="#854D0E" fontSize="11" fontWeight="black">"What color is this? RED!" 🍎</text>
              </g>
            )}

            {stepNumber === 3 && (
              // Step 3: Child Mia placing red apple toy into the Red Basket
              <g>
                {/* Red Basket on floor */}
                <path d="M 180 95 L 188 138 L 222 138 L 230 95 Z" fill="#FEE2E2" stroke="#EF4444" strokeWidth="2.5" />
                <text x="205" y="122" textAnchor="middle" fill="#B91C1C" fontSize="10" fontWeight="bold">RED</text>
                {/* Child Mia */}
                <path d="M 70 142 C 70 115 105 115 105 142 Z" fill="#FBBF24" />
                <circle cx="88" cy="92" r="15" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                <path d="M 75 88 C 75 74 100 74 100 88 Z" fill="#374151" />
                {/* Purple hair bows */}
                <circle cx="74" cy="80" r="4" fill="#A855F7" />
                <circle cx="102" cy="80" r="4" fill="#A855F7" />
                {/* Reaching arm depositing red apple into red basket */}
                <path d="M 100 120 Q 150 95 195 105" stroke="#FED7AA" strokeWidth="5" strokeLinecap="round" />
                <circle cx="205" cy="108" r="9" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
                <text x="200" y="75" fontSize="18">✨</text>
              </g>
            )}

            {stepNumber >= 4 && (
              // Step 4: All 4 baskets filled correctly, Teacher Emma & Mia smiling
              <g>
                <path d="M 30 105 L 36 138 L 64 138 L 70 105 Z" fill="#FEE2E2" stroke="#EF4444" strokeWidth="2" />
                <circle cx="50" cy="115" r="5" fill="#EF4444" />
                <circle cx="50" cy="126" r="5" fill="#EF4444" />

                <path d="M 80 105 L 86 138 L 114 138 L 120 105 Z" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2" />
                <rect x="95" y="112" width="9" height="9" rx="2" fill="#3B82F6" />

                <path d="M 130 105 L 136 138 L 164 138 L 170 105 Z" fill="#FEF9C3" stroke="#EAB308" strokeWidth="2" />
                <polygon points="150,112 155,122 145,122" fill="#EAB308" />

                <path d="M 180 105 L 186 138 L 214 138 L 220 105 Z" fill="#DCFCE7" stroke="#10B981" strokeWidth="2" />
                <circle cx="200" cy="118" r="5" fill="#10B981" />

                {/* Child Mia & Teacher Emma celebrating */}
                <path d="M 250 142 C 250 118 285 118 285 142 Z" fill="#FBBF24" />
                <circle cx="268" cy="94" r="14" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                <text x="140" y="60" fontSize="22">🎉</text>
                <text x="110" y="45" fill="#16A34A" fontSize="11" fontWeight="black">ALL SORTED! ✔</text>
              </g>
            )}
          </g>
        )}

        {/* ========================================================================= */}
        {/* 4. SHAPE HUNT (act-shape-hunt)                                            */}
        {/* ========================================================================= */}
        {normId.includes('shape-hunt') && (
          <g id="scene-shape-hunt">
            {stepNumber === 1 && (
              // Step 1: Cardboard magnifying frame and 4 shape cards on table
              <g>
                <rect x="40" y="105" width="240" height="40" rx="6" fill="#FED7AA" stroke="#F97316" strokeWidth="2" />
                {/* 4 Shape Cutouts */}
                <circle cx="75" cy="85" r="14" fill="#F43F5E" />
                <rect x="110" y="72" width="26" height="26" rx="3" fill="#3B82F6" />
                <polygon points="165,70 178,98 152,98" fill="#EAB308" />
                <rect x="200" y="76" width="34" height="20" rx="2" fill="#10B981" />
                {/* Cardboard Detective Magnifying Glass Frame */}
                <circle cx="255" cy="80" r="16" fill="#F8FAFC" stroke="#D97706" strokeWidth="3" />
                <line x1="266" y1="92" x2="280" y2="108" stroke="#D97706" strokeWidth="5" strokeLinecap="round" />
              </g>
            )}

            {stepNumber === 2 && (
              // Step 2: Teacher Emma tracing a circle in the air with index finger
              <g>
                <path d="M 50 142 C 50 108 90 108 90 142 Z" fill="#0284C7" />
                <circle cx="70" cy="84" r="17" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                <path d="M 54 80 C 54 66 86 66 86 80 Z" fill="#78350F" />
                {/* Arm tracing circle in air */}
                <path d="M 85 110 Q 130 75 165 70" stroke="#FED7AA" strokeWidth="6" strokeLinecap="round" />
                {/* Dotted circle in the air being traced */}
                <circle cx="180" cy="70" r="22" stroke="#3B82F6" strokeWidth="3" strokeDasharray="5 4" fill="none" />
                <polygon points="180,48 186,54 180,60" fill="#3B82F6" />
                {/* Speech Bubble: "Round like a circle!" */}
                <rect x="120" y="26" width="150" height="24" rx="12" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
                <text x="195" y="42" textAnchor="middle" fill="#854D0E" fontSize="11" fontWeight="bold">"Round like a circle!" ⭕</text>
              </g>
            )}

            {stepNumber === 3 && (
              // Step 3: Child Leo looking through round magnifying frame at round wall clock
              <g>
                {/* Round Wall Clock on classroom wall */}
                <circle cx="230" cy="65" r="22" fill="#FFFFFF" stroke="#0284C7" strokeWidth="3" />
                <line x1="230" y1="65" x2="230" y2="52" stroke="#0284C7" strokeWidth="2.5" />
                <line x1="230" y1="65" x2="242" y2="65" stroke="#0284C7" strokeWidth="2" />
                {/* Child Leo holding magnifying glass frame up to the clock */}
                <path d="M 70 142 C 70 115 105 115 105 142 Z" fill="#10B981" />
                <circle cx="88" cy="92" r="15" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                <path d="M 75 88 C 75 74 100 74 100 88 Z" fill="#9A3412" />
                {/* Reaching arm with magnifying glass aimed at clock */}
                <path d="M 98 115 L 175 78" stroke="#FED7AA" strokeWidth="5" strokeLinecap="round" />
                <circle cx="185" cy="72" r="18" fill="none" stroke="#D97706" strokeWidth="3" />
                <line x1="175" y1="78" x2="162" y2="92" stroke="#D97706" strokeWidth="5" strokeLinecap="round" />
                <text x="150" y="45" fill="#EAB308" fontSize="16">✨ CIRCLE SPOTTED!</text>
              </g>
            )}

            {stepNumber >= 4 && (
              // Step 4: Child Leo holding square book next to square template & earning Detective star badge
              <g>
                <path d="M 80 142 C 80 115 115 115 115 142 Z" fill="#10B981" />
                <circle cx="98" cy="92" r="15" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                <path d="M 85 88 C 85 74 110 74 110 88 Z" fill="#9A3412" />
                {/* Square Book Held */}
                <rect x="135" y="75" width="36" height="36" rx="4" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
                <path d="M 108 115 L 135 95" stroke="#FED7AA" strokeWidth="5" strokeLinecap="round" />
                {/* Gold Detective Badge on shirt */}
                <polygon points="98,118 101,124 108,124 102,128 104,135 98,130 92,135 94,128 88,124 95,124" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
                <rect x="180" y="45" width="120" height="30" rx="8" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
                <text x="240" y="64" textAnchor="middle" fill="#854D0E" fontSize="11" fontWeight="bold">SHAPE DETECTIVE! 🔍⭐</text>
              </g>
            )}
          </g>
        )}

        {/* ========================================================================= */}
        {/* 5. POM-POM TRANSFER (act-pom-pom-transfer)                                */}
        {/* ========================================================================= */}
        {normId.includes('pom-pom') && (
          <g id="scene-pompom">
            {stepNumber === 1 && (
              // Step 1: Egg carton, bowl of colorful pom-poms, and jumbo yellow tweezers on table
              <g>
                <rect x="30" y="105" width="260" height="40" rx="6" fill="#FED7AA" stroke="#F97316" strokeWidth="2" />
                {/* Egg carton (6 dimple cups) */}
                <rect x="50" y="80" width="110" height="35" rx="6" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
                <circle cx="68" cy="97" r="8" fill="#FDE68A" stroke="#D97706" strokeWidth="1" />
                <circle cx="88" cy="97" r="8" fill="#FDE68A" stroke="#D97706" strokeWidth="1" />
                <circle cx="108" cy="97" r="8" fill="#FDE68A" stroke="#D97706" strokeWidth="1" />
                <circle cx="128" cy="97" r="8" fill="#FDE68A" stroke="#D97706" strokeWidth="1" />
                <circle cx="148" cy="97" r="8" fill="#FDE68A" stroke="#D97706" strokeWidth="1" />
                {/* Bowl with fluffy pom-poms */}
                <ellipse cx="205" cy="95" rx="28" ry="14" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2" />
                <circle cx="195" cy="90" r="7" fill="#F43F5E" />
                <circle cx="210" cy="88" r="7" fill="#3B82F6" />
                <circle cx="202" cy="96" r="6" fill="#EAB308" />
                {/* Jumbo Yellow Plastic Tweezers */}
                <path d="M 245 75 L 260 105 M 245 75 L 268 105" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
              </g>
            )}

            {stepNumber === 2 && (
              // Step 2: Teacher hand demonstrating pinching jumbo tweezer onto a fuzzy yellow pom-pom
              <g>
                {/* Teacher Hand Modeling */}
                <path d="M 60 142 L 140 100" stroke="#FED7AA" strokeWidth="14" strokeLinecap="round" />
                {/* Jumbo Yellow Tweezers pinching pom-pom */}
                <path d="M 140 95 L 180 80 M 140 95 L 180 98" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round" />
                <circle cx="184" cy="89" r="10" fill="#EAB308" stroke="#CA8A04" strokeWidth="1.5" />
                {/* Speech Bubble: "Pinch tight, lift up!" */}
                <rect x="120" y="30" width="160" height="26" rx="13" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
                <text x="200" y="47" textAnchor="middle" fill="#854D0E" fontSize="11" fontWeight="bold">"Squeeze tight, lift up!" 🤏</text>
              </g>
            )}

            {stepNumber === 3 && (
              // Step 3: Child Mia using jumbo tweezers to lift blue pom-pom into egg carton cup
              <g>
                <rect x="40" y="115" width="240" height="30" rx="6" fill="#FED7AA" stroke="#F97316" strokeWidth="2" />
                {/* Egg carton */}
                <rect x="140" y="90" width="130" height="35" rx="6" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
                <circle cx="160" cy="107" r="7" fill="#F43F5E" />
                <circle cx="185" cy="107" r="7" fill="#EAB308" />
                <circle cx="210" cy="107" r="7" fill="#FDE68A" stroke="#D97706" strokeWidth="1" />
                {/* Child Mia holding tweezers dropping blue pom-pom */}
                <path d="M 60 142 C 60 115 95 115 95 142 Z" fill="#FBBF24" />
                <circle cx="78" cy="92" r="15" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                <path d="M 65 88 C 65 74 90 74 90 88 Z" fill="#374151" />
                <circle cx="64" cy="80" r="4" fill="#A855F7" />
                <circle cx="92" cy="80" r="4" fill="#A855F7" />
                <path d="M 90 118 L 175 90" stroke="#FED7AA" strokeWidth="5" strokeLinecap="round" />
                <path d="M 175 88 L 205 78 M 175 88 L 205 96" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
                <circle cx="210" cy="87" r="8" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1.5" />
                <text x="215" y="60" fontSize="16">🎯</text>
              </g>
            )}

            {stepNumber >= 4 && (
              // Step 4: Egg carton completely filled with colorful pom-poms, Mia smiling with thumbs up
              <g>
                <rect x="40" y="115" width="240" height="30" rx="6" fill="#FED7AA" stroke="#F97316" strokeWidth="2" />
                {/* Filled Egg carton */}
                <rect x="110" y="85" width="160" height="40" rx="8" fill="#FEF3C7" stroke="#D97706" strokeWidth="2.5" />
                <circle cx="130" cy="105" r="9" fill="#F43F5E" />
                <circle cx="155" cy="105" r="9" fill="#3B82F6" />
                <circle cx="180" cy="105" r="9" fill="#EAB308" />
                <circle cx="205" cy="105" r="9" fill="#10B981" />
                <circle cx="230" cy="105" r="9" fill="#A855F7" />
                <circle cx="255" cy="105" r="9" fill="#FB923C" />
                {/* Child Mia Thumbs Up */}
                <path d="M 45 142 C 45 115 80 115 80 142 Z" fill="#FBBF24" />
                <circle cx="62" cy="92" r="15" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                <path d="M 50 88 C 50 74 75 74 75 88 Z" fill="#374151" />
                <circle cx="48" cy="80" r="4" fill="#A855F7" />
                <circle cx="76" cy="80" r="4" fill="#A855F7" />
                <path d="M 75 115 L 90 95" stroke="#FED7AA" strokeWidth="5" strokeLinecap="round" />
                <text x="95" y="95" fontSize="18">👍</text>
                <text x="140" y="55" fill="#047857" fontSize="12" fontWeight="bold">TRAY FILLED! ⭐</text>
              </g>
            )}
          </g>
        )}

        {/* ========================================================================= */}
        {/* 6. NATURE LEAF COLLAGE (act-nature-collage)                               */}
        {/* ========================================================================= */}
        {normId.includes('nature-collage') && (
          <g id="scene-nature-collage">
            {stepNumber === 1 && (
              // Step 1: White cardstock sheet, tray of autumn leaves/petals, and glue stick
              <g>
                <rect x="40" y="105" width="240" height="40" rx="6" fill="#FED7AA" stroke="#F97316" strokeWidth="2" />
                {/* Cardstock Sheet */}
                <rect x="60" y="70" width="90" height="55" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
                {/* Leaf Tray */}
                <ellipse cx="195" cy="95" rx="35" ry="16" fill="#DCFCE7" stroke="#16A34A" strokeWidth="2" />
                <path d="M 180 95 C 180 85 195 85 195 95 C 190 98 185 98 180 95 Z" fill="#22C55E" />
                <path d="M 200 95 C 200 80 215 80 215 95 C 210 98 205 98 200 95 Z" fill="#F97316" />
                {/* Purple Glue Stick */}
                <rect x="250" y="80" width="12" height="26" rx="3" fill="#8B5CF6" stroke="#6D28D9" strokeWidth="1.5" />
              </g>
            )}

            {stepNumber === 2 && (
              // Step 2: Teacher Emma and Child Leo holding a large green oak leaf and touching leaf veins
              <g>
                <path d="M 50 142 C 50 108 90 108 90 142 Z" fill="#0284C7" />
                <circle cx="70" cy="84" r="17" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                <path d="M 54 80 C 54 66 86 66 86 80 Z" fill="#78350F" />
                {/* Large Green Leaf Held in center */}
                <path d="M 140 105 C 140 60 185 60 185 105 C 165 110 150 110 140 105 Z" fill="#22C55E" stroke="#15803D" strokeWidth="2" />
                <line x1="162" y1="65" x2="162" y2="108" stroke="#166534" strokeWidth="2" />
                <line x1="162" y1="80" x2="150" y2="90" stroke="#166534" strokeWidth="1.5" />
                <line x1="162" y1="90" x2="175" y2="98" stroke="#166534" strokeWidth="1.5" />
                {/* Child Leo right touching leaf */}
                <path d="M 230 142 C 230 118 265 118 265 142 Z" fill="#10B981" />
                <circle cx="248" cy="94" r="15" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                <path d="M 235 90 C 235 76 260 76 260 90 Z" fill="#9A3412" />
                <path d="M 235 120 L 180 95" stroke="#FED7AA" strokeWidth="5" strokeLinecap="round" />
                <rect x="120" y="24" width="140" height="24" rx="12" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
                <text x="190" y="40" textAnchor="middle" fill="#854D0E" fontSize="11" fontWeight="bold">"Feel the smooth leaf veins!" 🌿</text>
              </g>
            )}

            {stepNumber === 3 && (
              // Step 3: Child Leo applying glue stick to cardstock and pressing leaves onto it
              <g>
                <rect x="40" y="115" width="240" height="30" rx="6" fill="#FED7AA" stroke="#F97316" strokeWidth="2" />
                {/* Child Leo */}
                <path d="M 60 142 C 60 115 95 115 95 142 Z" fill="#10B981" />
                <circle cx="78" cy="92" r="15" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                <path d="M 65 88 C 65 74 90 74 90 88 Z" fill="#9A3412" />
                {/* Cardstock with glued leaves */}
                <rect x="130" y="70" width="120" height="65" rx="6" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
                <path d="M 145 95 C 145 80 160 80 160 95 Z" fill="#22C55E" />
                <path d="M 180 100 C 180 85 200 85 200 100 Z" fill="#F97316" />
                {/* Leo hand pressing leaf with glue stick */}
                <path d="M 90 118 L 175 90" stroke="#FED7AA" strokeWidth="5" strokeLinecap="round" />
                <rect x="175" y="80" width="10" height="20" rx="2" fill="#8B5CF6" />
                <text x="210" y="60" fontSize="16">🍁</text>
              </g>
            )}

            {stepNumber >= 4 && (
              // Step 4: Finished leaf collage pinned to clothesline with wooden pegs
              <g>
                {/* Clothesline wire */}
                <line x1="20" y1="40" x2="300" y2="40" stroke="#94A3B8" strokeWidth="2" />
                <polygon points="60,35 65,45 70,35" fill="#D97706" />
                <polygon points="135,35 140,45 145,35" fill="#D97706" />
                {/* Artwork 1 */}
                <rect x="55" y="45" width="85" height="65" rx="4" fill="#FFFFFF" stroke="#64748B" strokeWidth="2" />
                <path d="M 70 85 C 70 65 95 65 95 85 Z" fill="#22C55E" />
                <path d="M 100 90 C 100 70 120 70 120 90 Z" fill="#F97316" />
                <circle cx="120" cy="65" r="8" fill="#FDE047" />
                {/* Artwork 2 */}
                <rect x="180" y="45" width="85" height="65" rx="4" fill="#FFFFFF" stroke="#64748B" strokeWidth="2" />
                <path d="M 200 85 C 200 68 220 68 220 85 Z" fill="#EAB308" />
                <path d="M 225 90 C 225 75 245 75 245 90 Z" fill="#EF4444" />
                <text x="160" y="145" textAnchor="middle" fill="#0369A1" fontSize="12" fontWeight="bold">NATURE ART GALLERY! 🖼️✨</text>
              </g>
            )}
          </g>
        )}

        {/* ========================================================================= */}
        {/* 7. ANIMAL & FOOD MATCH (act-animal-food-match)                            */}
        {/* ========================================================================= */}
        {normId.includes('animal-food') && (
          <g id="scene-animal-food">
            {stepNumber === 1 && (
              // Step 1: Pocket chart with animal cards on left, empty slots on right, and food bowl
              <g>
                <rect x="50" y="45" width="140" height="95" rx="8" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2.5" />
                {/* Row 1: Bunny */}
                <rect x="60" y="55" width="55" height="22" rx="4" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1" />
                <text x="88" y="70" textAnchor="middle" fontSize="12">🐰 Bunny</text>
                <rect x="125" y="55" width="55" height="22" rx="4" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 3" />
                {/* Row 2: Monkey */}
                <rect x="60" y="82" width="55" height="22" rx="4" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1" />
                <text x="88" y="97" textAnchor="middle" fontSize="12">🐵 Monkey</text>
                <rect x="125" y="82" width="55" height="22" rx="4" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 3" />
                {/* Row 3: Dog */}
                <rect x="60" y="109" width="55" height="22" rx="4" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1" />
                <text x="88" y="124" textAnchor="middle" fontSize="12">🐶 Dog</text>
                <rect x="125" y="109" width="55" height="22" rx="4" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 3" />
                {/* Food card bowl on right */}
                <ellipse cx="245" cy="115" rx="35" ry="16" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
                <text x="235" y="112" fontSize="12">🥕</text>
                <text x="252" y="112" fontSize="12">🍌</text>
                <text x="242" y="122" fontSize="12">🦴</text>
              </g>
            )}

            {stepNumber === 2 && (
              // Step 2: Teacher Emma making bunny ears with hands and holding carrot card
              <g>
                <path d="M 70 142 C 70 108 110 108 110 142 Z" fill="#0284C7" />
                <circle cx="90" cy="84" r="17" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                <path d="M 74 80 C 74 66 106 66 106 80 Z" fill="#78350F" />
                {/* Bunny ears gesture */}
                <ellipse cx="82" cy="55" rx="5" ry="14" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                <ellipse cx="98" cy="55" rx="5" ry="14" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                {/* Holding Carrot card in front */}
                <rect x="140" y="70" width="50" height="40" rx="6" fill="#FFFFFF" stroke="#EA580C" strokeWidth="2" />
                <text x="165" y="96" textAnchor="middle" fontSize="20">🥕</text>
                <rect x="130" y="24" width="160" height="26" rx="13" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
                <text x="210" y="41" textAnchor="middle" fill="#854D0E" fontSize="11" fontWeight="bold">"Who loves crunchy carrots?" 🐰</text>
              </g>
            )}

            {stepNumber === 3 && (
              // Step 3: Child Mia sliding the Carrot card into the pocket chart next to Bunny
              <g>
                <rect x="30" y="50" width="140" height="85" rx="8" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2" />
                <rect x="40" y="60" width="55" height="22" rx="4" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1" />
                <text x="68" y="75" textAnchor="middle" fontSize="12">🐰 Bunny</text>
                {/* Target slot where carrot is being inserted */}
                <rect x="105" y="60" width="55" height="22" rx="4" fill="#FFFFFF" stroke="#EA580C" strokeWidth="2" />
                <text x="132" y="76" textAnchor="middle" fontSize="14">🥕</text>
                {/* Child Mia sliding the card */}
                <path d="M 210 142 C 210 115 245 115 245 142 Z" fill="#FBBF24" />
                <circle cx="228" cy="92" r="15" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                <path d="M 215 88 C 215 74 240 74 240 88 Z" fill="#374151" />
                <circle cx="214" cy="80" r="4" fill="#A855F7" />
                <circle cx="242" cy="80" r="4" fill="#A855F7" />
                <path d="M 220 120 L 155 76" stroke="#FED7AA" strokeWidth="5" strokeLinecap="round" />
                <text x="175" y="45" fontSize="16">✨</text>
              </g>
            )}

            {stepNumber >= 4 && (
              // Step 4: Completed matching pocket chart with Bunny-Carrot, Monkey-Banana, Dog-Bone
              <g>
                <rect x="60" y="35" width="200" height="105" rx="10" fill="#DCFCE7" stroke="#16A34A" strokeWidth="3" />
                <rect x="75" y="45" width="80" height="25" rx="4" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1" />
                <text x="115" y="62" textAnchor="middle" fontSize="13">🐰 Rabbit</text>
                <rect x="165" y="45" width="80" height="25" rx="4" fill="#FFFFFF" stroke="#EA580C" strokeWidth="1.5" />
                <text x="205" y="62" textAnchor="middle" fontSize="13">🥕 Carrot ✔</text>

                <rect x="75" y="75" width="80" height="25" rx="4" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1" />
                <text x="115" y="92" textAnchor="middle" fontSize="13">🐵 Monkey</text>
                <rect x="165" y="75" width="80" height="25" rx="4" fill="#FFFFFF" stroke="#CA8A04" strokeWidth="1.5" />
                <text x="205" y="92" textAnchor="middle" fontSize="13">🍌 Banana ✔</text>

                <rect x="75" y="105" width="80" height="25" rx="4" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1" />
                <text x="115" y="122" textAnchor="middle" fontSize="13">🐶 Dog</text>
                <rect x="165" y="105" width="80" height="25" rx="4" fill="#FFFFFF" stroke="#65A30D" strokeWidth="1.5" />
                <text x="205" y="122" textAnchor="middle" fontSize="13">🦴 Bone ✔</text>
                <text x="160" y="24" textAnchor="middle" fill="#15803D" fontSize="12" fontWeight="black">ALL ANIMALS FED! 🎉</text>
              </g>
            )}
          </g>
        )}

        {/* ========================================================================= */}
        {/* 8. BIG & SMALL SORTING (act-big-small-sort)                                */}
        {/* ========================================================================= */}
        {normId.includes('big-small') && (
          <g id="scene-big-small">
            {stepNumber === 1 && (
              // Step 1: Big Basket (Bear icon) and Small Basket (Mouse icon) on floor
              <g>
                {/* Giant Big Basket */}
                <path d="M 40 70 L 52 138 L 138 138 L 150 70 Z" fill="#DBEAFE" stroke="#2563EB" strokeWidth="3" />
                <text x="95" y="105" textAnchor="middle" fill="#1D4ED8" fontSize="16" fontWeight="black">BIG 🐻</text>
                {/* Tiny Small Basket */}
                <path d="M 195 105 L 202 138 L 248 138 L 255 105 Z" fill="#FEE2E2" stroke="#DC2626" strokeWidth="2" />
                <text x="225" y="126" textAnchor="middle" fill="#B91C1C" fontSize="10" fontWeight="black">SMALL 🐭</text>
              </g>
            )}

            {stepNumber === 2 && (
              // Step 2: Teacher Emma stretching arms wide ("BIG!") and Leo stretching too
              <g>
                {/* Teacher Emma Arms Wide */}
                <path d="M 50 142 C 50 108 90 108 90 142 Z" fill="#0284C7" />
                <circle cx="70" cy="84" r="17" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                <path d="M 54 80 C 54 66 86 66 86 80 Z" fill="#78350F" />
                <path d="M 70 105 L 25 75 M 70 105 L 115 75" stroke="#FED7AA" strokeWidth="7" strokeLinecap="round" />
                {/* Leo Arms Wide */}
                <path d="M 230 142 C 230 118 265 118 265 142 Z" fill="#10B981" />
                <circle cx="248" cy="94" r="15" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                <path d="M 235 90 C 235 76 260 76 260 90 Z" fill="#9A3412" />
                <path d="M 248 115 L 210 90 M 248 115 L 285 90" stroke="#FED7AA" strokeWidth="5" strokeLinecap="round" />
                {/* Speech Banner */}
                <rect x="110" y="30" width="120" height="26" rx="13" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
                <text x="170" y="47" textAnchor="middle" fill="#854D0E" fontSize="12" fontWeight="black">"BIG LIKE A BEAR!" 🏔️</text>
              </g>
            )}

            {stepNumber === 3 && (
              // Step 3: Child Leo placing big teddy into BIG basket and small teddy into SMALL basket
              <g>
                {/* BIG basket left */}
                <path d="M 30 75 L 42 140 L 118 140 L 130 75 Z" fill="#DBEAFE" stroke="#2563EB" strokeWidth="2.5" />
                <text x="80" y="110" textAnchor="middle" fill="#1D4ED8" fontSize="14" fontWeight="bold">BIG</text>
                {/* Giant Teddy inside */}
                <circle cx="80" cy="85" r="18" fill="#B45309" stroke="#78350F" strokeWidth="1.5" />
                <circle cx="70" cy="72" r="6" fill="#78350F" />
                <circle cx="90" cy="72" r="6" fill="#78350F" />
                {/* SMALL basket right */}
                <path d="M 210 105 L 216 140 L 254 140 L 260 105 Z" fill="#FEE2E2" stroke="#DC2626" strokeWidth="2" />
                <text x="235" y="125" textAnchor="middle" fill="#B91C1C" fontSize="9" fontWeight="bold">SMALL</text>
                {/* Tiny Teddy */}
                <circle cx="235" cy="100" r="7" fill="#B45309" />
                {/* Leo holding items */}
                <path d="M 140 142 C 140 115 175 115 175 142 Z" fill="#10B981" />
                <circle cx="158" cy="92" r="15" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                <path d="M 145 88 C 145 74 170 74 170 88 Z" fill="#9A3412" />
                <path d="M 150 118 L 100 95 M 165 118 L 225 105" stroke="#FED7AA" strokeWidth="5" strokeLinecap="round" />
              </g>
            )}

            {stepNumber >= 4 && (
              // Step 4: Both baskets accurately sorted, Teacher Emma & Leo high-five
              <g>
                <path d="M 50 75 L 60 140 L 130 140 L 140 75 Z" fill="#DBEAFE" stroke="#2563EB" strokeWidth="2.5" />
                <circle cx="95" cy="85" r="15" fill="#B45309" />
                <circle cx="95" cy="115" r="12" fill="#EF4444" />
                <text x="95" y="135" textAnchor="middle" fill="#1D4ED8" fontSize="11" fontWeight="black">BIG ITEMS ✔</text>

                <path d="M 180 100 L 186 140 L 244 140 L 250 100 Z" fill="#FEE2E2" stroke="#DC2626" strokeWidth="2" />
                <circle cx="215" cy="112" r="6" fill="#B45309" />
                <circle cx="215" cy="126" r="5" fill="#EF4444" />
                <text x="215" y="136" textAnchor="middle" fill="#B91C1C" fontSize="9" fontWeight="black">SMALL ✔</text>
                <text x="160" y="45" textAnchor="middle" fill="#15803D" fontSize="13" fontWeight="bold">PERFECT SIZE SORTING! 🌟</text>
              </g>
            )}
          </g>
        )}

        {/* ========================================================================= */}
        {/* 9. PICTURE MEMORY (act-picture-memory)                                    */}
        {/* ========================================================================= */}
        {normId.includes('picture-memory') && (
          <g id="scene-picture-memory">
            {stepNumber === 1 && (
              // Step 1: 12 cards face down in neat 3x4 grid on table
              <g>
                <rect x="40" y="55" width="240" height="90" rx="8" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2" />
                {/* 3 rows of 4 face-down cards (purple with star pattern) */}
                {[0, 1, 2].map((r) =>
                  [0, 1, 2, 3].map((c) => (
                    <g key={`${r}-${c}`} transform={`translate(${55 + c * 55}, ${65 + r * 26})`}>
                      <rect width="45" height="22" rx="3" fill="#8B5CF6" stroke="#6D28D9" strokeWidth="1.5" />
                      <circle cx="22" cy="11" r="3" fill="#EDE9FE" />
                    </g>
                  ))
                )}
              </g>
            )}

            {stepNumber === 2 && (
              // Step 2: Teacher Emma flipping 1 card revealing a red apple, explaining rules
              <g>
                <path d="M 40 142 C 40 108 80 108 80 142 Z" fill="#0284C7" />
                <circle cx="60" cy="84" r="17" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                <path d="M 44 80 C 44 66 76 66 76 80 Z" fill="#78350F" />
                {/* Card Table */}
                <rect x="110" y="70" width="170" height="70" rx="6" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2" />
                {/* Flipped Card showing Apple */}
                <rect x="125" y="80" width="45" height="25" rx="3" fill="#FFFFFF" stroke="#EF4444" strokeWidth="2" />
                <text x="147" y="98" textAnchor="middle" fontSize="14">🍎</text>
                {/* Face down cards */}
                <rect x="175" y="80" width="45" height="25" rx="3" fill="#8B5CF6" />
                <rect x="225" y="80" width="45" height="25" rx="3" fill="#8B5CF6" />
                {/* Teacher arm pointing to apple */}
                <path d="M 75 110 L 125 90" stroke="#FED7AA" strokeWidth="5" strokeLinecap="round" />
                <rect x="130" y="28" width="150" height="24" rx="12" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
                <text x="205" y="44" textAnchor="middle" fill="#854D0E" fontSize="11" fontWeight="bold">"Flip 2 cards to find a pair!" 🎴</text>
              </g>
            )}

            {stepNumber === 3 && (
              // Step 3: Child Leo flipping second card revealing matching identical red apple
              <g>
                {/* Card Table */}
                <rect x="30" y="70" width="170" height="70" rx="6" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2" />
                {/* Card 1: Apple */}
                <rect x="45" y="80" width="45" height="25" rx="3" fill="#FFFFFF" stroke="#EF4444" strokeWidth="2" />
                <text x="67" y="98" textAnchor="middle" fontSize="14">🍎</text>
                {/* Card 2: Matching Apple being flipped! */}
                <rect x="100" y="80" width="45" height="25" rx="3" fill="#FFFFFF" stroke="#EF4444" strokeWidth="2" />
                <text x="122" y="98" textAnchor="middle" fontSize="14">🍎</text>
                {/* Child Leo Smiling */}
                <path d="M 230 142 C 230 118 265 118 265 142 Z" fill="#10B981" />
                <circle cx="248" cy="94" r="15" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                <path d="M 235 90 C 235 76 260 76 260 90 Z" fill="#9A3412" />
                <path d="M 235 120 L 145 92" stroke="#FED7AA" strokeWidth="5" strokeLinecap="round" />
                <text x="145" y="55" fontSize="18">✨ A MATCH!</text>
              </g>
            )}

            {stepNumber >= 4 && (
              // Step 4: Child Leo with matched pairs collected beside him, smiling proudly
              <g>
                <path d="M 70 142 C 70 115 105 115 105 142 Z" fill="#10B981" />
                <circle cx="88" cy="92" r="15" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                <path d="M 75 88 C 75 74 100 74 100 88 Z" fill="#9A3412" />
                {/* Collected Pairs Stack */}
                <g transform="translate(130, 75)">
                  <rect x="0" y="0" width="40" height="25" rx="3" fill="#FFFFFF" stroke="#EF4444" strokeWidth="1.5" />
                  <text x="20" y="17" textAnchor="middle" fontSize="12">🍎</text>
                  <rect x="45" y="0" width="40" height="25" rx="3" fill="#FFFFFF" stroke="#EF4444" strokeWidth="1.5" />
                  <text x="65" y="17" textAnchor="middle" fontSize="12">🍎</text>

                  <rect x="0" y="30" width="40" height="25" rx="3" fill="#FFFFFF" stroke="#EAB308" strokeWidth="1.5" />
                  <text x="20" y="47" textAnchor="middle" fontSize="12">⭐</text>
                  <rect x="45" y="30" width="40" height="25" rx="3" fill="#FFFFFF" stroke="#EAB308" strokeWidth="1.5" />
                  <text x="65" y="47" textAnchor="middle" fontSize="12">⭐</text>
                </g>
                <text x="210" y="50" fontSize="22">🏆</text>
                <text x="210" y="75" fill="#0369A1" fontSize="11" fontWeight="bold">MEMORY CHAMPION!</text>
              </g>
            )}
          </g>
        )}

        {/* ========================================================================= */}
        {/* 10. MOVE LIKE AN ANIMAL (act-animal-movement)                             */}
        {/* ========================================================================= */}
        {normId.includes('animal-movement') && (
          <g id="scene-movement">
            {stepNumber === 1 && (
              // Step 1: Teacher Emma holding tambourine and Frog picture card on open carpet
              <g>
                <ellipse cx="160" cy="142" rx="140" ry="25" fill="#E2E8F0" />
                {/* Teacher Emma */}
                <path d="M 60 142 C 60 108 100 108 100 142 Z" fill="#0284C7" />
                <circle cx="80" cy="84" r="17" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                <path d="M 64 80 C 64 66 96 66 96 80 Z" fill="#78350F" />
                {/* Holding Tambourine */}
                <circle cx="135" cy="85" r="16" fill="#FBBF24" stroke="#D97706" strokeWidth="3" />
                <circle cx="135" cy="85" r="8" fill="#FDE68A" />
                <path d="M 95 110 L 125 90" stroke="#FED7AA" strokeWidth="5" strokeLinecap="round" />
                {/* Frog Card */}
                <rect x="180" y="60" width="70" height="50" rx="6" fill="#FFFFFF" stroke="#16A34A" strokeWidth="2.5" />
                <text x="215" y="92" textAnchor="middle" fontSize="26">🐸</text>
                <text x="215" y="105" textAnchor="middle" fill="#15803D" fontSize="8" fontWeight="black">FROG</text>
              </g>
            )}

            {stepNumber === 2 && (
              // Step 2: Teacher Emma squatting low demonstrating frog leap posture
              <g>
                <path d="M 120 142 C 120 110 160 110 160 142 Z" fill="#0284C7" />
                <circle cx="140" cy="88" r="16" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                <path d="M 126 84 C 126 70 154 70 154 84 Z" fill="#78350F" />
                {/* Squatting Hands on floor */}
                <path d="M 125 115 L 105 138 M 155 115 L 175 138" stroke="#FED7AA" strokeWidth="6" strokeLinecap="round" />
                {/* Speech Bubble: "Ribbit! Squat down low!" */}
                <rect x="90" y="28" width="160" height="26" rx="13" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
                <text x="170" y="45" textAnchor="middle" fill="#854D0E" fontSize="11" fontWeight="bold">"Ribbit! Squat low & leap!" 🐸</text>
              </g>
            )}

            {stepNumber === 3 && (
              // Step 3: Child Leo leaping high in the air with musical rhythm notes
              <g>
                {/* Hopping Child Leo in Mid-Air */}
                <g transform="translate(130, 35)">
                  <circle cx="35" cy="35" r="15" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                  <path d="M 22 32 C 22 18 48 18 48 32 Z" fill="#9A3412" />
                  {/* Leaping body */}
                  <path d="M 20 85 L 35 50 L 50 85 Z" fill="#10B981" />
                  {/* Joyful raised arms */}
                  <path d="M 35 55 L 12 35 M 35 55 L 58 35" stroke="#FED7AA" strokeWidth="5" strokeLinecap="round" />
                  {/* Motion swirl under feet */}
                  <path d="M 15 90 Q 35 100 55 90" stroke="#CBD5E1" strokeWidth="2.5" strokeDasharray="3 3" />
                </g>
                {/* Music notes & Drum beats */}
                <text x="60" y="60" fontSize="22">🎵</text>
                <text x="240" y="65" fontSize="22">🎶</text>
                <text x="165" y="155" textAnchor="middle" fill="#0284C7" fontSize="12" fontWeight="black">DRUM BEATS = HOP! STOP = FREEZE! 🥁</text>
              </g>
            )}

            {stepNumber >= 4 && (
              // Step 4: Teacher Emma & Leo sitting criss-cross peacefully with hands on belly
              <g>
                {/* Teacher sitting criss-cross */}
                <path d="M 70 142 C 70 115 105 115 105 142 Z" fill="#0284C7" />
                <circle cx="88" cy="92" r="15" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                <path d="M 76 88 C 76 75 100 75 100 88 Z" fill="#78350F" />
                <path d="M 88 118 L 88 126" stroke="#FED7AA" strokeWidth="5" strokeLinecap="round" />
                {/* Leo sitting criss-cross */}
                <path d="M 215 142 C 215 118 250 118 250 142 Z" fill="#10B981" />
                <circle cx="232" cy="94" r="14" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                <path d="M 220 90 C 220 78 244 78 244 90 Z" fill="#9A3412" />
                {/* Peaceful Turtle Breaths Speech */}
                <rect x="110" y="35" width="130" height="26" rx="13" fill="#DCFCE7" stroke="#16A34A" strokeWidth="1.5" />
                <text x="175" y="52" textAnchor="middle" fill="#15803D" fontSize="11" fontWeight="bold">"Breathe like a turtle..." 🐢💨</text>
              </g>
            )}
          </g>
        )}

        {/* ========================================================================= */}
        {/* 11. SENSORY MYSTERY BOX (act-sensory-mystery-box)                         */}
        {/* ========================================================================= */}
        {normId.includes('mystery-box') && (
          <g id="scene-mystery-box">
            {stepNumber === 1 && (
              // Step 1: Purple mystery box with felt armholes and texture cards on easel
              <g>
                {/* Mystery Box */}
                <rect x="60" y="70" width="120" height="72" rx="12" fill="#E0E7FF" stroke="#4F46E5" strokeWidth="2.5" />
                <ellipse cx="90" cy="106" rx="14" ry="18" fill="#6366F1" opacity="0.9" />
                <ellipse cx="150" cy="106" rx="14" ry="18" fill="#6366F1" opacity="0.9" />
                <text x="120" y="86" textAnchor="middle" fill="#3730A3" fontSize="10" fontWeight="black">? MYSTERY ?</text>
                {/* Texture Cards Easel */}
                <rect x="210" y="55" width="75" height="75" rx="6" fill="#FFFFFF" stroke="#D97706" strokeWidth="2" />
                <text x="247" y="74" textAnchor="middle" fill="#B45309" fontSize="10" fontWeight="bold">SOFT 🪶</text>
                <text x="247" y="94" textAnchor="middle" fill="#B45309" fontSize="10" fontWeight="bold">ROUGH 🪵</text>
                <text x="247" y="114" textAnchor="middle" fill="#B45309" fontSize="10" fontWeight="bold">SMOOTH 🪨</text>
              </g>
            )}

            {stepNumber === 2 && (
              // Step 2: Teacher Emma sliding hands through felt sleeves without looking
              <g>
                <path d="M 40 142 C 40 108 80 108 80 142 Z" fill="#0284C7" />
                <circle cx="60" cy="84" r="17" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                <path d="M 44 80 C 44 66 76 66 76 80 Z" fill="#78350F" />
                {/* Mystery Box */}
                <rect x="120" y="75" width="130" height="67" rx="10" fill="#E0E7FF" stroke="#4F46E5" strokeWidth="2.5" />
                <ellipse cx="150" cy="108" rx="14" ry="18" fill="#6366F1" />
                <ellipse cx="210" cy="108" rx="14" ry="18" fill="#6366F1" />
                {/* Teacher Arms Reaching Inside */}
                <path d="M 75 110 L 150 108" stroke="#FED7AA" strokeWidth="6" strokeLinecap="round" />
                <rect x="110" y="28" width="160" height="26" rx="13" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
                <text x="190" y="45" textAnchor="middle" fill="#854D0E" fontSize="11" fontWeight="bold">"It feels fuzzy and soft!" 🪶</text>
              </g>
            )}

            {stepNumber === 3 && (
              // Step 3: Child Mia reaching hands into mystery box with thinking expression
              <g>
                <path d="M 50 142 C 50 115 85 115 85 142 Z" fill="#FBBF24" />
                <circle cx="68" cy="92" r="15" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                <path d="M 55 88 C 55 74 80 74 80 88 Z" fill="#374151" />
                <circle cx="54" cy="80" r="4" fill="#A855F7" />
                <circle cx="82" cy="80" r="4" fill="#A855F7" />
                {/* Mystery Box */}
                <rect x="130" y="75" width="130" height="67" rx="10" fill="#E0E7FF" stroke="#4F46E5" strokeWidth="2.5" />
                <ellipse cx="160" cy="108" rx="14" ry="18" fill="#6366F1" />
                <ellipse cx="220" cy="108" rx="14" ry="18" fill="#6366F1" />
                {/* Mia arms inside box */}
                <path d="M 80 118 L 160 108" stroke="#FED7AA" strokeWidth="5" strokeLinecap="round" />
                <rect x="120" y="28" width="160" height="26" rx="13" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
                <text x="200" y="45" textAnchor="middle" fill="#854D0E" fontSize="11" fontWeight="bold">"I think it's a soft feather!" 💭</text>
              </g>
            )}

            {stepNumber >= 4 && (
              // Step 4: Child Mia holds soft yellow feather pulled into light next to SOFT card
              <g>
                <path d="M 80 142 C 80 115 115 115 115 142 Z" fill="#FBBF24" />
                <circle cx="98" cy="92" r="15" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                <path d="M 85 88 C 85 74 110 74 110 88 Z" fill="#374151" />
                <circle cx="84" cy="80" r="4" fill="#A855F7" />
                <circle cx="112" cy="80" r="4" fill="#A855F7" />
                {/* Mia raising feather into light */}
                <path d="M 110 115 L 165 85" stroke="#FED7AA" strokeWidth="6" strokeLinecap="round" />
                <text x="175" y="85" fontSize="30">🪶</text>
                {/* Matching "SOFT" card */}
                <rect x="210" y="65" width="75" height="40" rx="6" fill="#DCFCE7" stroke="#16A34A" strokeWidth="2" />
                <text x="247" y="90" textAnchor="middle" fill="#15803D" fontSize="12" fontWeight="black">SOFT ✔</text>
                <text x="160" y="35" textAnchor="middle" fill="#0369A1" fontSize="12" fontWeight="bold">TACTILE GUESS CORRECT! ⭐</text>
              </g>
            )}
          </g>
        )}

        {/* ========================================================================= */}
        {/* 12. PUPPET STORY THEATER (act-puppet-story-theater)                       */}
        {/* ========================================================================= */}
        {normId.includes('puppet') && (
          <g id="scene-puppet">
            {stepNumber === 1 && (
              // Step 1: Tabletop puppet theater stage with red curtains and basket with puppets
              <g>
                {/* Stage */}
                <rect x="70" y="55" width="140" height="85" rx="8" fill="#FEE2E2" stroke="#DC2626" strokeWidth="2.5" />
                <rect x="85" y="70" width="110" height="55" rx="4" fill="#1E293B" />
                <path d="M 70 55 Q 95 85 85 125 L 70 125 Z" fill="#DC2626" />
                <path d="M 210 55 Q 185 85 195 125 L 210 125 Z" fill="#DC2626" />
                {/* Puppet Basket */}
                <ellipse cx="255" cy="115" rx="30" ry="14" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
                <circle cx="245" cy="108" r="8" fill="#FBCFE8" />
                <circle cx="265" cy="108" r="8" fill="#B45309" />
              </g>
            )}

            {stepNumber === 2 && (
              // Step 2: Teacher Emma holding Bunny puppet next to toy car
              <g>
                <rect x="90" y="60" width="140" height="80" rx="8" fill="#FEE2E2" stroke="#DC2626" strokeWidth="2" />
                <rect x="105" y="75" width="110" height="50" rx="4" fill="#1E293B" />
                {/* Bunny puppet */}
                <circle cx="140" cy="100" r="10" fill="#FED7AA" stroke="#F97316" strokeWidth="1" />
                <ellipse cx="136" cy="88" rx="2.5" ry="6" fill="#FBCFE8" />
                <ellipse cx="144" cy="88" rx="2.5" ry="6" fill="#FBCFE8" />
                {/* Toy car prop */}
                <rect x="170" y="102" width="22" height="12" rx="3" fill="#3B82F6" />
                <circle cx="175" cy="115" r="3.5" fill="#1E293B" />
                <circle cx="187" cy="115" r="3.5" fill="#1E293B" />
                <rect x="80" y="24" width="160" height="24" rx="12" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
                <text x="160" y="40" textAnchor="middle" fill="#854D0E" fontSize="10" fontWeight="bold">"How can Bunny share the car?" 🚗</text>
              </g>
            )}

            {stepNumber === 3 && (
              // Step 3: Child Leo (Bear) & Mia (Bunny) acting out sharing on stage
              <g>
                <rect x="90" y="60" width="140" height="80" rx="8" fill="#FEE2E2" stroke="#DC2626" strokeWidth="2" />
                <rect x="105" y="75" width="110" height="50" rx="4" fill="#1E293B" />
                {/* Bunny Puppet Left */}
                <circle cx="135" cy="100" r="10" fill="#FED7AA" />
                <ellipse cx="131" cy="88" rx="2.5" ry="6" fill="#FBCFE8" />
                <ellipse cx="139" cy="88" rx="2.5" ry="6" fill="#FBCFE8" />
                {/* Bear Puppet Right */}
                <circle cx="180" cy="100" r="11" fill="#B45309" />
                <circle cx="174" cy="92" r="3.5" fill="#78350F" />
                <circle cx="186" cy="92" r="3.5" fill="#78350F" />
                {/* Toy Car Shared in Middle */}
                <rect x="150" y="105" width="18" height="10" rx="2" fill="#3B82F6" />
                <text x="160" y="45" textAnchor="middle" fill="#854D0E" fontSize="11" fontWeight="bold">"You can drive it first!" 🐻🐰</text>
              </g>
            )}

            {stepNumber >= 4 && (
              // Step 4: Both puppets taking a bow to applause and stars
              <g>
                <rect x="90" y="60" width="140" height="80" rx="8" fill="#FEE2E2" stroke="#DC2626" strokeWidth="2" />
                <rect x="105" y="75" width="110" height="50" rx="4" fill="#1E293B" />
                {/* Bowing puppets */}
                <circle cx="145" cy="108" r="9" fill="#FED7AA" />
                <circle cx="175" cy="108" r="10" fill="#B45309" />
                <text x="160" y="90" textAnchor="middle" fontSize="16">✨</text>
                <text x="60" y="130" fontSize="22">👏</text>
                <text x="250" y="130" fontSize="22">👏</text>
                <text x="160" y="38" textAnchor="middle" fill="#0369A1" fontSize="12" fontWeight="black">KINDNESS STORY COMPLETE! 🌟</text>
              </g>
            )}
          </g>
        )}

        {/* ========================================================================= */}
        {/* 13. DYNAMIC ACTION-AWARE GENERATED & CUSTOM ACTIVITY STEP SCENE           */}
        {/* ========================================================================= */}
        {(!normId.includes('sound-hunt') &&
          !normId.includes('count-and-match') &&
          !normId.includes('color-sorting') &&
          !normId.includes('shape-hunt') &&
          !normId.includes('texture-walk') &&
          !normId.includes('playdough-sculpting') &&
          !normId.includes('scissor-snips') &&
          !normId.includes('water-pour') &&
          !normId.includes('freeze-dance') &&
          !normId.includes('blocks-tower') &&
          !normId.includes('mystery-box') &&
          !normId.includes('puppet')) && (() => {
          const normType = (type || '').toLowerCase();
          const isColorSort = normType.includes('sort') || normType.includes('basket') || normInstruction.includes('sort') || normInstruction.includes('basket') || normInstruction.includes('bowl') || normInstruction.includes('bin') || normTopic.includes('sort') || normTopic.includes('color') || normTopic.includes('match') || allMatText.includes('basket');
          const isCounting = normType.includes('count') || normInstruction.includes('count') || normInstruction.includes('number') || normInstruction.includes('1-10') || normInstruction.includes('1... 2') || normInstruction.includes('1–5') || normTopic.includes('count') || normTopic.includes('number') || normTopic.includes('math');
          const isScissorCraft = normType.includes('scissor') || normType.includes('snip') || normType.includes('collage') || normInstruction.includes('cut') || normInstruction.includes('scissor') || normInstruction.includes('snip') || normInstruction.includes('paste') || allMatText.includes('scissor') || normTopic.includes('cut') || normTopic.includes('scissor');
          const isPlaydough = normType.includes('dough') || normInstruction.includes('dough') || normInstruction.includes('clay') || normInstruction.includes('roll') || normInstruction.includes('knead') || allMatText.includes('dough') || allMatText.includes('clay') || normTopic.includes('dough') || normTopic.includes('clay');
          const isSensoryWater = normType.includes('sensory') || normType.includes('water') || normType.includes('pour') || normInstruction.includes('water') || normInstruction.includes('sand') || normInstruction.includes('pour') || normInstruction.includes('scoop') || normInstruction.includes('funnel') || allMatText.includes('water') || allMatText.includes('sand') || normTopic.includes('sensory') || normTopic.includes('water');
          const isBlocks = normType.includes('block') || normType.includes('tower') || normInstruction.includes('block') || normInstruction.includes('tower') || normInstruction.includes('build') || normInstruction.includes('stack') || allMatText.includes('block') || normTopic.includes('block') || normTopic.includes('build');
          const isNature = normType.includes('nature') || normInstruction.includes('leaf') || normInstruction.includes('leaves') || normInstruction.includes('petal') || normInstruction.includes('twig') || allMatText.includes('leaf') || normTopic.includes('nature') || normTopic.includes('leaf');
          const isMovement = normType.includes('movement') || normType.includes('dance') || normInstruction.includes('jump') || normInstruction.includes('dance') || normInstruction.includes('sway') || normInstruction.includes('freeze') || normTopic.includes('movement') || normTopic.includes('dance') || normTopic.includes('jump') || normTopic.includes('music');
          const isDrawColor = normType.includes('draw') || normType.includes('paint') || normInstruction.includes('crayon') || normInstruction.includes('marker') || normInstruction.includes('paint') || normInstruction.includes('draw') || allMatText.includes('crayon') || allMatText.includes('paint') || normTopic.includes('draw') || normTopic.includes('paint');
          const isShape = normType.includes('shape') || normInstruction.includes('circle') || normInstruction.includes('triangle') || normInstruction.includes('square') || normTopic.includes('shape') || normTopic.includes('geometric');

          // --- A. COLOR SORTING ARCHETYPE ---
          if (isColorSort) {
            return (
              <g id="gen-color-sort-scene">
                {stepNumber === 1 && (
                  // Step 1: Place red, blue, and yellow objects & baskets on table
                  <g>
                    <rect x="25" y="112" width="270" height="32" rx="6" fill="#FED7AA" stroke="#F97316" strokeWidth="2" />
                    {/* 3 Colored Baskets */}
                    {/* Red Basket */}
                    <path d="M 50 100 L 56 128 L 88 128 L 94 100 Z" fill="#FEE2E2" stroke="#EF4444" strokeWidth="2" />
                    <circle cx="72" cy="114" r="5" fill="#EF4444" />
                    <text x="72" y="96" textAnchor="middle" fill="#EF4444" fontSize="9" fontWeight="black">RED</text>
                    {/* Blue Basket */}
                    <path d="M 134 100 L 140 128 L 172 128 L 178 100 Z" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2" />
                    <circle cx="156" cy="114" r="5" fill="#3B82F6" />
                    <text x="156" y="96" textAnchor="middle" fill="#3B82F6" fontSize="9" fontWeight="black">BLUE</text>
                    {/* Yellow Basket */}
                    <path d="M 218 100 L 224 128 L 256 128 L 262 100 Z" fill="#FEF9C3" stroke="#EAB308" strokeWidth="2" />
                    <circle cx="240" cy="114" r="5" fill="#EAB308" />
                    <text x="240" y="96" textAnchor="middle" fill="#CA8A04" fontSize="9" fontWeight="black">YELLOW</text>
                    {/* Mixed blocks scattered on table */}
                    <rect x="98" y="118" width="12" height="12" rx="2" fill="#EF4444" stroke="#B91C1C" strokeWidth="1" />
                    <rect x="114" y="120" width="12" height="12" rx="2" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1" />
                    <rect x="184" y="119" width="12" height="12" rx="2" fill="#EAB308" stroke="#A16207" strokeWidth="1" />
                    <rect x="200" y="121" width="12" height="12" rx="2" fill="#EF4444" stroke="#B91C1C" strokeWidth="1" />
                    <text x="160" y="45" textAnchor="middle" fill="#0369A1" fontSize="11" fontWeight="bold">ARRANGE BASKETS & BLOCKS ON TABLE 🧺</text>
                  </g>
                )}
                {stepNumber === 2 && (
                  // Step 2: Child Leo reaches down and PICKS UP the RED block in hand
                  <g>
                    <rect x="25" y="112" width="270" height="32" rx="6" fill="#FED7AA" stroke="#F97316" strokeWidth="2" />
                    {/* Baskets in background */}
                    <path d="M 45 102 L 50 128 L 78 128 L 83 102 Z" fill="#FEE2E2" stroke="#EF4444" strokeWidth="1.5" />
                    <path d="M 235 102 L 240 128 L 268 128 L 273 102 Z" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5" />
                    {/* Child Leo bending & holding red block up */}
                    <path d="M 85 142 C 85 115 120 115 120 142 Z" fill="#10B981" />
                    <circle cx="103" cy="92" r="15" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                    <path d="M 90 88 C 90 74 115 74 115 88 Z" fill="#9A3412" />
                    {/* Leo's arm lifting RED block */}
                    <path d="M 115 118 L 155 85" stroke="#FED7AA" strokeWidth="6" strokeLinecap="round" />
                    {/* RED block gripped in hand with sparkle and motion lift lines */}
                    <rect x="155" y="75" width="20" height="20" rx="3" fill="#EF4444" stroke="#991B1B" strokeWidth="2" />
                    <path d="M 165 102 L 165 112" stroke="#EF4444" strokeWidth="2" strokeDasharray="2 2" />
                    <text x="185" y="80" fontSize="14">✨</text>
                    {/* Teacher Emma in background pointing to red block */}
                    <path d="M 200 142 C 200 115 230 115 230 142 Z" fill="#0284C7" />
                    <circle cx="215" cy="94" r="13" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                    <path d="M 204 90 C 204 78 226 78 226 90 Z" fill="#78350F" />
                    <circle cx="215" cy="76" r="5" fill="#78350F" />
                    {/* Speech bubble */}
                    <rect x="100" y="24" width="160" height="24" rx="12" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
                    <text x="180" y="40" textAnchor="middle" fill="#854D0E" fontSize="10" fontWeight="bold">"I picked up the RED block!" 🟥</text>
                  </g>
                )}
                {stepNumber === 3 && (
                  // Step 3: Child Leo drops the RED block directly INTO the RED basket
                  <g>
                    <rect x="25" y="112" width="270" height="32" rx="6" fill="#FED7AA" stroke="#F97316" strokeWidth="2" />
                    {/* Large Red Basket in focus */}
                    <path d="M 130 90 L 138 132 L 182 132 L 190 90 Z" fill="#FEE2E2" stroke="#EF4444" strokeWidth="2.5" />
                    <ellipse cx="160" cy="90" rx="30" ry="8" fill="#FECACA" stroke="#EF4444" strokeWidth="2" />
                    <text x="160" y="115" textAnchor="middle" fill="#DC2626" fontSize="11" fontWeight="black">RED 🧺</text>
                    {/* Blue basket on right */}
                    <path d="M 235 102 L 240 128 L 268 128 L 273 102 Z" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5" />
                    {/* Child Leo's hand placing RED block into basket */}
                    <path d="M 50 142 C 50 115 85 115 85 142 Z" fill="#10B981" />
                    <circle cx="68" cy="92" r="15" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                    <path d="M 55 88 C 55 74 80 74 80 88 Z" fill="#9A3412" />
                    <path d="M 80 118 L 140 82" stroke="#FED7AA" strokeWidth="6" strokeLinecap="round" />
                    {/* Motion curve dropping into basket */}
                    <path d="M 145 80 Q 160 70 160 85" stroke="#EF4444" strokeWidth="2.5" strokeDasharray="3 3" fill="none" />
                    <rect x="150" y="76" width="18" height="18" rx="3" fill="#EF4444" stroke="#991B1B" strokeWidth="2" />
                    {/* Green checkmark */}
                    <circle cx="195" cy="75" r="10" fill="#22C55E" />
                    <path d="M 191 75 L 194 78 L 199 72" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                    <text x="160" y="35" textAnchor="middle" fill="#15803D" fontSize="11" fontWeight="bold">MATCHING: RED BLOCK INTO RED BASKET! ✔</text>
                  </g>
                )}
                {stepNumber === 4 && (
                  // Step 4: Child Leo sorts the remaining Blue and Yellow blocks into Blue & Yellow baskets
                  <g>
                    <rect x="25" y="112" width="270" height="32" rx="6" fill="#FED7AA" stroke="#F97316" strokeWidth="2" />
                    {/* Red Basket Already Filled */}
                    <path d="M 45 96 L 50 128 L 80 128 L 85 96 Z" fill="#FEE2E2" stroke="#EF4444" strokeWidth="1.5" />
                    <rect x="55" y="90" width="10" height="10" fill="#EF4444" />
                    <circle cx="65" cy="115" r="4" fill="#22C55E" />
                    {/* Blue Basket Receiving Blue Block */}
                    <path d="M 115 92 L 122 130 L 158 130 L 165 92 Z" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2" />
                    <text x="140" y="114" textAnchor="middle" fill="#1D4ED8" fontSize="9" fontWeight="black">BLUE</text>
                    {/* Blue block entering basket */}
                    <path d="M 125 70 Q 140 60 140 85" stroke="#3B82F6" strokeWidth="2" strokeDasharray="2 2" fill="none" />
                    <rect x="132" y="76" width="14" height="14" rx="2" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1.5" />
                    {/* Yellow Basket Receiving Yellow Block */}
                    <path d="M 195 92 L 202 130 L 238 130 L 245 92 Z" fill="#FEF9C3" stroke="#EAB308" strokeWidth="2" />
                    <text x="220" y="114" textAnchor="middle" fill="#A16207" fontSize="9" fontWeight="black">YELLOW</text>
                    {/* Yellow block entering basket */}
                    <path d="M 205 70 Q 220 60 220 85" stroke="#EAB308" strokeWidth="2" strokeDasharray="2 2" fill="none" />
                    <rect x="212" y="76" width="14" height="14" rx="2" fill="#EAB308" stroke="#CA8A04" strokeWidth="1.5" />
                    {/* Child Leo reaching with both hands to guide blocks */}
                    <path d="M 260 142 C 260 115 295 115 295 142 Z" fill="#10B981" />
                    <circle cx="278" cy="92" r="14" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                    <path d="M 265 88 C 265 74 290 74 290 88 Z" fill="#9A3412" />
                    <path d="M 268 115 L 225 75" stroke="#FED7AA" strokeWidth="5" strokeLinecap="round" />
                    <text x="160" y="35" textAnchor="middle" fill="#0369A1" fontSize="11" fontWeight="bold">SORTING REMAINING BLUE & YELLOW BLOCKS 🧩</text>
                  </g>
                )}
                {stepNumber >= 5 && (
                  // Step 5: All 3 baskets filled with matched objects & Leo + Emma cheering
                  <g>
                    <rect x="25" y="112" width="270" height="32" rx="6" fill="#FED7AA" stroke="#F97316" strokeWidth="2" />
                    {/* 3 Filled Baskets */}
                    {/* Red Basket (Full) */}
                    <path d="M 80 96 L 85 128 L 115 128 L 120 96 Z" fill="#FEE2E2" stroke="#EF4444" strokeWidth="2" />
                    <rect x="90" y="90" width="10" height="10" fill="#EF4444" />
                    <rect x="100" y="88" width="10" height="10" fill="#EF4444" />
                    <circle cx="100" cy="115" r="6" fill="#22C55E" />
                    <path d="M 98 115 L 100 117 L 103 113" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
                    {/* Blue Basket (Full) */}
                    <path d="M 140 96 L 145 128 L 175 128 L 180 96 Z" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2" />
                    <rect x="150" y="90" width="10" height="10" fill="#3B82F6" />
                    <rect x="160" y="88" width="10" height="10" fill="#3B82F6" />
                    <circle cx="160" cy="115" r="6" fill="#22C55E" />
                    <path d="M 158 115 L 160 117 L 163 113" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
                    {/* Yellow Basket (Full) */}
                    <path d="M 200 96 L 205 128 L 235 128 L 240 96 Z" fill="#FEF9C3" stroke="#EAB308" strokeWidth="2" />
                    <rect x="210" y="90" width="10" height="10" fill="#EAB308" />
                    <rect x="220" y="88" width="10" height="10" fill="#EAB308" />
                    <circle cx="220" cy="115" r="6" fill="#22C55E" />
                    <path d="M 218 115 L 220 117 L 223 113" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
                    {/* Child Leo left cheering */}
                    <path d="M 30 142 C 30 115 65 115 65 142 Z" fill="#10B981" />
                    <circle cx="48" cy="92" r="14" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                    <path d="M 36 88 C 36 74 60 74 60 88 Z" fill="#9A3412" />
                    <path d="M 48 108 L 40 85" stroke="#FED7AA" strokeWidth="4" strokeLinecap="round" />
                    {/* Teacher Emma right clapping */}
                    <path d="M 255 142 C 255 110 290 110 290 142 Z" fill="#0284C7" />
                    <circle cx="272" cy="86" r="14" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                    <path d="M 260 82 C 260 70 284 70 284 82 Z" fill="#78350F" />
                    {/* Celebration Stars */}
                    <text x="160" y="35" textAnchor="middle" fill="#0369A1" fontSize="12" fontWeight="black">ALL COLORS SORTED PERFECTLY! ⭐🎉</text>
                  </g>
                )}
              </g>
            );
          }

          // --- B. COUNTING & MATH ARCHETYPE ---
          if (isCounting) {
            return (
              <g id="gen-counting-scene">
                {stepNumber === 1 && (
                  // Step 1: 5 counting objects lined up on table with number labels
                  <g>
                    <rect x="25" y="112" width="270" height="32" rx="6" fill="#FED7AA" stroke="#F97316" strokeWidth="2" />
                    {/* 5 Counting Apples/Objects in row */}
                    {[1, 2, 3, 4, 5].map((num, i) => {
                      const cx = 60 + i * 50;
                      return (
                        <g key={num}>
                          <circle cx={cx} cy="100" r="14" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
                          <path d={`M ${cx} 86 Q ${cx + 4} 80 ${cx + 8} 82`} stroke="#15803D" strokeWidth="2" />
                          <rect x={cx - 10} y="120" width="20" height="14" rx="3" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.5" />
                          <text x={cx} y="131" textAnchor="middle" fill="#0369A1" fontSize="10" fontWeight="bold">{num}</text>
                        </g>
                      );
                    })}
                    <text x="160" y="45" textAnchor="middle" fill="#0369A1" fontSize="11" fontWeight="bold">5 OBJECTS LINED UP FOR COUNTING 🔢</text>
                  </g>
                )}
                {stepNumber === 2 && (
                  // Step 2: Child Leo touches object #3 with index finger, counting out loud
                  <g>
                    <rect x="25" y="112" width="270" height="32" rx="6" fill="#FED7AA" stroke="#F97316" strokeWidth="2" />
                    {/* 5 Objects on table */}
                    {[1, 2, 3, 4, 5].map((num, i) => {
                      const cx = 50 + i * 45;
                      return (
                        <circle key={num} cx={cx} cy="120" r="12" fill={i === 2 ? '#F59E0B' : '#EF4444'} stroke="#991B1B" strokeWidth="1.5" />
                      );
                    })}
                    {/* Child Leo pointing finger touching #3 */}
                    <path d="M 170 142 C 170 115 205 115 205 142 Z" fill="#10B981" />
                    <circle cx="188" cy="92" r="15" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                    <path d="M 175 88 C 175 74 200 74 200 88 Z" fill="#9A3412" />
                    {/* Outstretched pointing arm */}
                    <path d="M 180 115 L 142 118" stroke="#FED7AA" strokeWidth="5" strokeLinecap="round" />
                    <circle cx="140" cy="118" r="4" fill="#FED7AA" />
                    {/* Speech bubble counting */}
                    <rect x="60" y="25" width="200" height="26" rx="13" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
                    <text x="160" y="42" textAnchor="middle" fill="#854D0E" fontSize="11" fontWeight="bold">"One... Two... THREE! 👆"</text>
                  </g>
                )}
                {stepNumber === 3 && (
                  // Step 3: Child gathers all 5 items into the central counting bowl
                  <g>
                    <rect x="25" y="112" width="270" height="32" rx="6" fill="#FED7AA" stroke="#F97316" strokeWidth="2" />
                    {/* Large Counting Bowl */}
                    <ellipse cx="160" cy="120" rx="45" ry="18" fill="#DBEAFE" stroke="#2563EB" strokeWidth="2.5" />
                    {/* 5 objects inside bowl */}
                    <circle cx="140" cy="115" r="9" fill="#EF4444" />
                    <circle cx="155" cy="112" r="9" fill="#EF4444" />
                    <circle cx="170" cy="115" r="9" fill="#EF4444" />
                    <circle cx="148" cy="122" r="9" fill="#EF4444" />
                    <circle cx="164" cy="122" r="9" fill="#EF4444" />
                    {/* Child Leo's hands holding both sides of bowl */}
                    <path d="M 50 142 C 50 115 85 115 85 142 Z" fill="#10B981" />
                    <circle cx="68" cy="92" r="15" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                    <path d="M 55 88 C 55 74 80 74 80 88 Z" fill="#9A3412" />
                    <path d="M 80 118 L 125 120" stroke="#FED7AA" strokeWidth="5" strokeLinecap="round" />
                    <text x="160" y="40" textAnchor="middle" fill="#1D4ED8" fontSize="11" fontWeight="bold">GROUPING 5 ITEMS INTO THE BOWL 🥣</text>
                  </g>
                )}
                {stepNumber === 4 && (
                  // Step 4: Child reveals number 5 flashcard and matches with 5 tokens
                  <g>
                    <rect x="25" y="112" width="270" height="32" rx="6" fill="#FED7AA" stroke="#F97316" strokeWidth="2" />
                    {/* Number 5 Flashcard on table */}
                    <rect x="125" y="60" width="70" height="75" rx="8" fill="#FFFFFF" stroke="#0284C7" strokeWidth="3" />
                    <text x="160" y="112" textAnchor="middle" fill="#0369A1" fontSize="48" fontWeight="900">5</text>
                    {/* 5 star tokens beside */}
                    <circle cx="215" cy="85" r="7" fill="#F59E0B" />
                    <circle cx="230" cy="85" r="7" fill="#F59E0B" />
                    <circle cx="245" cy="85" r="7" fill="#F59E0B" />
                    <circle cx="222" cy="102" r="7" fill="#F59E0B" />
                    <circle cx="238" cy="102" r="7" fill="#F59E0B" />
                    {/* Child Leo pointing finger to 5 */}
                    <path d="M 45 142 C 45 115 80 115 80 142 Z" fill="#10B981" />
                    <circle cx="63" cy="92" r="15" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                    <path d="M 50 88 C 50 74 75 74 75 88 Z" fill="#9A3412" />
                    <path d="M 75 115 L 120 95" stroke="#FED7AA" strokeWidth="5" strokeLinecap="round" />
                    <text x="160" y="32" textAnchor="middle" fill="#0369A1" fontSize="11" fontWeight="bold">MATCHING QUANTITY TO NUMERAL 5 ⭐</text>
                  </g>
                )}
                {stepNumber >= 5 && (
                  // Step 5: Holding up large Number 5 card with celebration stars
                  <g>
                    {/* Large Number 5 Golden Card */}
                    <rect x="115" y="45" width="90" height="95" rx="10" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="3.5" />
                    <rect x="123" y="53" width="74" height="79" rx="6" fill="#FEF3C7" />
                    <text x="160" y="112" textAnchor="middle" fill="#B45309" fontSize="56" fontWeight="900">5</text>
                    {/* Child Leo holding card left */}
                    <path d="M 40 142 C 40 115 75 115 75 142 Z" fill="#10B981" />
                    <circle cx="58" cy="92" r="15" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                    <path d="M 45 88 C 45 74 70 74 70 88 Z" fill="#9A3412" />
                    <path d="M 70 115 L 115 95" stroke="#FED7AA" strokeWidth="5" strokeLinecap="round" />
                    {/* Teacher Emma right praising */}
                    <path d="M 245 142 C 245 110 280 110 280 142 Z" fill="#0284C7" />
                    <circle cx="262" cy="86" r="14" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                    <path d="M 250 82 C 250 70 274 70 274 82 Z" fill="#78350F" />
                    <text x="160" y="28" textAnchor="middle" fill="#0369A1" fontSize="12" fontWeight="black">COUNTED ALL 5 OBJECTS! ⭐</text>
                  </g>
                )}
              </g>
            );
          }

          // --- C. SCISSOR CUTTING & CRAFT ARCHETYPE ---
          if (isScissorCraft) {
            return (
              <g id="gen-scissors-scene">
                {stepNumber === 1 && (
                  // Step 1: Arrange paper strips, scissors, glue on table
                  <g>
                    <rect x="25" y="112" width="270" height="32" rx="6" fill="#FED7AA" stroke="#F97316" strokeWidth="2" />
                    {/* Paper Strips */}
                    <rect x="60" y="85" width="20" height="40" fill="#EF4444" />
                    <rect x="85" y="85" width="20" height="40" fill="#3B82F6" />
                    <rect x="110" y="85" width="20" height="40" fill="#EAB308" />
                    {/* Safety Scissors */}
                    <circle cx="165" cy="100" r="7" stroke="#DC2626" strokeWidth="2" fill="none" />
                    <circle cx="178" cy="100" r="7" stroke="#DC2626" strokeWidth="2" fill="none" />
                    <line x1="165" y1="105" x2="185" y2="125" stroke="#94A3B8" strokeWidth="3" />
                    <line x1="178" y1="105" x2="160" y2="125" stroke="#94A3B8" strokeWidth="3" />
                    {/* Glue Stick */}
                    <rect x="215" y="90" width="14" height="30" rx="3" fill="#8B5CF6" />
                    <rect x="218" y="82" width="8" height="8" rx="1" fill="#C4B5FD" />
                    <text x="160" y="45" textAnchor="middle" fill="#0369A1" fontSize="11" fontWeight="bold">PAPER STRIPS & SAFETY SCISSORS READY ✂️</text>
                  </g>
                )}
                {stepNumber === 2 && (
                  // Step 2: Child holds scissors and cuts paper along lines
                  <g>
                    <rect x="25" y="112" width="270" height="32" rx="6" fill="#FED7AA" stroke="#F97316" strokeWidth="2" />
                    {/* Child Leo with scissors */}
                    <path d="M 60 142 C 60 115 95 115 95 142 Z" fill="#10B981" />
                    <circle cx="78" cy="92" r="15" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                    <path d="M 65 88 C 65 74 90 74 90 88 Z" fill="#9A3412" />
                    {/* Hands holding scissors cutting paper */}
                    <path d="M 90 115 L 140 100" stroke="#FED7AA" strokeWidth="5" strokeLinecap="round" />
                    {/* Red paper being cut */}
                    <rect x="150" y="80" width="40" height="25" fill="#EF4444" />
                    <line x1="170" y1="75" x2="170" y2="110" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="3 3" />
                    {/* Scissor Blades actively snipping */}
                    <line x1="135" y1="92" x2="170" y2="92" stroke="#64748B" strokeWidth="3" />
                    <line x1="135" y1="102" x2="170" y2="92" stroke="#64748B" strokeWidth="3" />
                    <circle cx="130" cy="92" r="6" stroke="#DC2626" strokeWidth="2" fill="none" />
                    <circle cx="130" cy="104" r="6" stroke="#DC2626" strokeWidth="2" fill="none" />
                    {/* Cut falling pieces */}
                    <polygon points="210,95 220,85 225,100" fill="#3B82F6" />
                    <rect x="205" y="115" width="14" height="14" fill="#EAB308" />
                    <text x="160" y="38" textAnchor="middle" fill="#DC2626" fontSize="11" fontWeight="bold">SNIP-SNIP! CUTTING CAREFULLY ✂️</text>
                  </g>
                )}
                {stepNumber === 3 && (
                  // Step 3: Child applies glue and sticks cut shapes on cardstock
                  <g>
                    <rect x="25" y="112" width="270" height="32" rx="6" fill="#FED7AA" stroke="#F97316" strokeWidth="2" />
                    {/* White Cardstock Base */}
                    <rect x="110" y="70" width="120" height="65" rx="6" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
                    {/* Pasted Cut Shapes */}
                    <rect x="125" y="80" width="22" height="22" fill="#EF4444" />
                    <polygon points="175,78 190,105 160,105" fill="#3B82F6" />
                    <circle cx="205" cy="95" r="12" fill="#EAB308" />
                    {/* Child Leo holding glue stick pressing down */}
                    <path d="M 45 142 C 45 115 80 115 80 142 Z" fill="#10B981" />
                    <circle cx="63" cy="92" r="15" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                    <path d="M 50 88 C 50 74 75 74 75 88 Z" fill="#9A3412" />
                    <path d="M 75 115 L 125 100" stroke="#FED7AA" strokeWidth="5" strokeLinecap="round" />
                    {/* Purple Glue stick in hand */}
                    <rect x="125" y="90" width="10" height="20" rx="2" fill="#8B5CF6" />
                    <text x="160" y="35" textAnchor="middle" fill="#7C3AED" fontSize="11" fontWeight="bold">PASTING SHAPES WITH GLUE STICK 🎨</text>
                  </g>
                )}
                {stepNumber >= 4 && (
                  // Step 4: Holding up finished colorful shape collage
                  <g>
                    {/* Finished Collage Frame */}
                    <rect x="105" y="45" width="110" height="85" rx="8" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="3" />
                    <rect x="118" y="58" width="22" height="22" fill="#EF4444" />
                    <polygon points="175,56 190,82 160,82" fill="#3B82F6" />
                    <circle cx="195" cy="100" r="12" fill="#EAB308" />
                    <rect x="135" y="95" width="30" height="15" fill="#10B981" />
                    {/* Child Leo holding collage */}
                    <path d="M 35 142 C 35 115 70 115 70 142 Z" fill="#10B981" />
                    <circle cx="53" cy="92" r="14" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                    <path d="M 40 88 C 40 74 65 74 65 88 Z" fill="#9A3412" />
                    <path d="M 65 115 L 105 90" stroke="#FED7AA" strokeWidth="5" strokeLinecap="round" />
                    {/* Teacher Emma praising */}
                    <path d="M 250 142 C 250 110 285 110 285 142 Z" fill="#0284C7" />
                    <circle cx="268" cy="86" r="14" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                    <path d="M 256 82 C 256 70 280 70 280 82 Z" fill="#78350F" />
                    <text x="160" y="28" textAnchor="middle" fill="#0369A1" fontSize="12" fontWeight="black">SHAPE COLLAGE COMPLETE! ⭐</text>
                  </g>
                )}
              </g>
            );
          }

          // --- D. PLAYDOUGH & CLAY ARCHETYPE ---
          if (isPlaydough) {
            return (
              <g id="gen-playdough-scene">
                {stepNumber === 1 && (
                  // Step 1: Lay out colorful playdough balls & rolling pin on mat
                  <g>
                    <rect x="25" y="112" width="270" height="32" rx="6" fill="#FED7AA" stroke="#F97316" strokeWidth="2" />
                    <ellipse cx="80" cy="100" rx="16" ry="14" fill="#F59E0B" />
                    <ellipse cx="125" cy="100" rx="16" ry="14" fill="#06B6D4" />
                    <ellipse cx="170" cy="100" rx="16" ry="14" fill="#EC4899" />
                    {/* Wooden Rolling Pin */}
                    <rect x="210" y="98" width="55" height="12" rx="3" fill="#D97706" />
                    <circle cx="205" cy="104" r="3" fill="#B45309" />
                    <circle cx="270" cy="104" r="3" fill="#B45309" />
                    <text x="160" y="45" textAnchor="middle" fill="#0369A1" fontSize="11" fontWeight="bold">PLAYDOUGH BALLS & ROLLING PIN READY 🟤</text>
                  </g>
                )}
                {stepNumber === 2 && (
                  // Step 2: Child uses rolling pin with both hands to flatten dough
                  <g>
                    <rect x="25" y="112" width="270" height="32" rx="6" fill="#FED7AA" stroke="#F97316" strokeWidth="2" />
                    {/* Flattened Dough on mat */}
                    <ellipse cx="160" cy="120" rx="40" ry="12" fill="#F59E0B" />
                    {/* Rolling pin on top of dough */}
                    <rect x="130" y="112" width="60" height="10" rx="3" fill="#D97706" />
                    {/* Child Leo leaning over with both hands on handles */}
                    <path d="M 135 142 C 135 115 185 115 185 142 Z" fill="#10B981" />
                    <circle cx="160" cy="78" r="15" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                    <path d="M 148 74 C 148 60 172 60 172 74 Z" fill="#9A3412" />
                    <path d="M 148 100 L 125 114" stroke="#FED7AA" strokeWidth="5" strokeLinecap="round" />
                    <path d="M 172 100 L 195 114" stroke="#FED7AA" strokeWidth="5" strokeLinecap="round" />
                    <text x="160" y="35" textAnchor="middle" fill="#B45309" fontSize="11" fontWeight="bold">ROLLING & FLATTENING THE DOUGH 🟤</text>
                  </g>
                )}
                {stepNumber === 3 && (
                  // Step 3: Child presses shape cutters into dough
                  <g>
                    <rect x="25" y="112" width="270" height="32" rx="6" fill="#FED7AA" stroke="#F97316" strokeWidth="2" />
                    {/* Flattened Dough */}
                    <ellipse cx="160" cy="120" rx="45" ry="14" fill="#F59E0B" />
                    {/* Cut Out Shapes in dough */}
                    <polygon points="145,110 148,118 156,118 150,123 152,130 145,126 138,130 140,123 134,118 142,118" fill="#06B6D4" stroke="#0891B2" strokeWidth="1" />
                    <circle cx="180" cy="120" r="9" fill="#EC4899" stroke="#BE185D" strokeWidth="1" />
                    {/* Hand pressing cookie cutter */}
                    <path d="M 75 142 C 75 115 110 115 110 142 Z" fill="#10B981" />
                    <circle cx="93" cy="92" r="15" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                    <path d="M 80 88 C 80 74 105 74 105 88 Z" fill="#9A3412" />
                    <path d="M 105 115 L 145 115" stroke="#FED7AA" strokeWidth="5" strokeLinecap="round" />
                    <text x="160" y="38" textAnchor="middle" fill="#0891B2" fontSize="11" fontWeight="bold">PRESSING STAR & CIRCLE SHAPE CUTTERS ⭐</text>
                  </g>
                )}
                {stepNumber >= 4 && (
                  // Step 4: Display plate of sculpted playdough creations
                  <g>
                    <rect x="25" y="112" width="270" height="32" rx="6" fill="#FED7AA" stroke="#F97316" strokeWidth="2" />
                    {/* Display Tray */}
                    <ellipse cx="160" cy="115" rx="60" ry="20" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="2.5" />
                    {/* Sculpted models */}
                    <polygon points="135,102 138,110 146,110 140,115 142,122 135,118 128,122 130,115 124,110 132,110" fill="#F59E0B" />
                    <circle cx="165" cy="112" r="12" fill="#06B6D4" />
                    <path d="M 185 115 Q 195 105 200 118 Q 205 108 210 116" stroke="#EC4899" strokeWidth="5" fill="none" strokeLinecap="round" />
                    {/* Cheering Child Leo */}
                    <path d="M 40 142 C 40 115 75 115 75 142 Z" fill="#10B981" />
                    <circle cx="58" cy="92" r="14" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                    <path d="M 45 88 C 45 74 70 74 70 88 Z" fill="#9A3412" />
                    <text x="160" y="35" textAnchor="middle" fill="#0369A1" fontSize="12" fontWeight="black">PLAYDOUGH CREATIONS DISPLAYED! 🌟</text>
                  </g>
                )}
              </g>
            );
          }

          // --- E. SENSORY WATER & POURING ARCHETYPE ---
          if (isSensoryWater) {
            return (
              <g id="gen-sensory-scene">
                {stepNumber === 1 && (
                  <g>
                    <rect x="25" y="112" width="270" height="32" rx="6" fill="#FED7AA" stroke="#F97316" strokeWidth="2" />
                    {/* Sensory Water Tub */}
                    <rect x="70" y="80" width="130" height="45" rx="8" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2.5" />
                    <path d="M 75 95 Q 135 105 195 95 L 195 120 L 75 120 Z" fill="#38BDF8" opacity="0.7" />
                    {/* Cups & Funnel */}
                    <path d="M 220 90 L 230 120 L 245 120 L 255 90 Z" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2" />
                    <polygon points="215,82 225,82 220,95" fill="#EAB308" />
                    <text x="160" y="45" textAnchor="middle" fill="#0369A1" fontSize="11" fontWeight="bold">SENSORY WATER TUB & CUPS READY 🫧</text>
                  </g>
                )}
                {stepNumber === 2 && (
                  <g>
                    <rect x="25" y="112" width="270" height="32" rx="6" fill="#FED7AA" stroke="#F97316" strokeWidth="2" />
                    <rect x="110" y="85" width="120" height="40" rx="8" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2" />
                    <path d="M 115 95 Q 170 105 225 95 L 225 120 L 115 120 Z" fill="#38BDF8" opacity="0.7" />
                    {/* Child scooping water */}
                    <path d="M 45 142 C 45 115 80 115 80 142 Z" fill="#10B981" />
                    <circle cx="63" cy="92" r="15" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                    <path d="M 50 88 C 50 74 75 74 75 88 Z" fill="#9A3412" />
                    <path d="M 75 115 L 135 95" stroke="#FED7AA" strokeWidth="5" strokeLinecap="round" />
                    {/* Filled scoop lifting */}
                    <ellipse cx="145" cy="92" rx="12" ry="8" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1.5" />
                    <circle cx="150" cy="85" r="2.5" fill="#38BDF8" />
                    <circle cx="155" cy="82" r="2" fill="#38BDF8" />
                    <text x="160" y="38" textAnchor="middle" fill="#0284C7" fontSize="11" fontWeight="bold">DIPPING SCOOP & LIFTING WATER 💧</text>
                  </g>
                )}
                {stepNumber === 3 && (
                  <g>
                    <rect x="25" y="112" width="270" height="32" rx="6" fill="#FED7AA" stroke="#F97316" strokeWidth="2" />
                    {/* Receiving Cup */}
                    <rect x="175" y="95" width="30" height="35" rx="4" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2" />
                    {/* Funnel on top */}
                    <polygon points="170,80 210,80 190,95" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
                    {/* Liquid Stream pouring down */}
                    <path d="M 135 65 Q 160 65 185 85" stroke="#38BDF8" strokeWidth="4" fill="none" strokeLinecap="round" />
                    {/* Child hands holding pouring scoop */}
                    <path d="M 45 142 C 45 115 80 115 80 142 Z" fill="#10B981" />
                    <circle cx="63" cy="92" r="15" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                    <path d="M 50 88 C 50 74 75 74 75 88 Z" fill="#9A3412" />
                    <path d="M 75 115 L 125 70" stroke="#FED7AA" strokeWidth="5" strokeLinecap="round" />
                    <text x="160" y="35" textAnchor="middle" fill="#0284C7" fontSize="11" fontWeight="bold">POURING STREAM THROUGH FUNNEL 🌊</text>
                  </g>
                )}
                {stepNumber >= 4 && (
                  <g>
                    <rect x="25" y="112" width="270" height="32" rx="6" fill="#FED7AA" stroke="#F97316" strokeWidth="2" />
                    {/* 3 Cups filled to different lines */}
                    <rect x="90" y="95" width="25" height="32" rx="3" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" />
                    <rect x="91" y="115" width="23" height="11" fill="#38BDF8" />
                    <rect x="135" y="95" width="25" height="32" rx="3" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" />
                    <rect x="136" y="105" width="23" height="21" fill="#38BDF8" />
                    <rect x="180" y="95" width="25" height="32" rx="3" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" />
                    <rect x="181" y="98" width="23" height="28" fill="#38BDF8" />
                    {/* Cheerful celebration */}
                    <path d="M 35 142 C 35 115 70 115 70 142 Z" fill="#10B981" />
                    <circle cx="53" cy="92" r="14" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                    <path d="M 40 88 C 40 74 65 74 65 88 Z" fill="#9A3412" />
                    <text x="160" y="35" textAnchor="middle" fill="#0369A1" fontSize="12" fontWeight="black">CAREFUL POURING CELEBRATED! 🫧⭐</text>
                  </g>
                )}
              </g>
            );
          }

          // --- F. BUILDING BLOCKS ARCHETYPE ---
          if (isBlocks) {
            return (
              <g id="gen-blocks-scene">
                {stepNumber === 1 && (
                  <g>
                    <rect x="20" y="130" width="280" height="20" rx="4" fill="#86EFAC" />
                    {/* Blocks scattered on carpet */}
                    <rect x="70" y="115" width="20" height="20" fill="#EF4444" />
                    <rect x="95" y="115" width="20" height="20" fill="#3B82F6" />
                    <polygon points="135,115 145,95 155,115" fill="#EAB308" />
                    <rect x="170" y="115" width="20" height="20" fill="#10B981" />
                    <rect x="200" y="115" width="30" height="15" fill="#8B5CF6" />
                    <text x="160" y="45" textAnchor="middle" fill="#0369A1" fontSize="11" fontWeight="bold">WOODEN BLOCKS READY ON CARPET 🧱</text>
                  </g>
                )}
                {stepNumber === 2 && (
                  <g>
                    <rect x="20" y="130" width="280" height="20" rx="4" fill="#86EFAC" />
                    {/* Sturdy base 3 blocks side by side */}
                    <rect x="130" y="110" width="22" height="22" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
                    <rect x="152" y="110" width="22" height="22" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1.5" />
                    <rect x="174" y="110" width="22" height="22" fill="#10B981" stroke="#047857" strokeWidth="1.5" />
                    {/* Child Leo laying blocks */}
                    <path d="M 55 142 C 55 115 90 115 90 142 Z" fill="#10B981" />
                    <circle cx="73" cy="92" r="15" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                    <path d="M 60 88 C 60 74 85 74 85 88 Z" fill="#9A3412" />
                    <path d="M 85 115 L 130 115" stroke="#FED7AA" strokeWidth="5" strokeLinecap="round" />
                    <text x="160" y="38" textAnchor="middle" fill="#1D4ED8" fontSize="11" fontWeight="bold">BUILDING A STURDY BASE FOUNDATION 🧱</text>
                  </g>
                )}
                {stepNumber === 3 && (
                  <g>
                    <rect x="20" y="130" width="280" height="20" rx="4" fill="#86EFAC" />
                    {/* Tower stacked high */}
                    <rect x="150" y="110" width="24" height="20" fill="#3B82F6" />
                    <rect x="150" y="90" width="24" height="20" fill="#10B981" />
                    <rect x="150" y="70" width="24" height="20" fill="#8B5CF6" />
                    {/* Child balancing roof triangle */}
                    <polygon points="148,70 162,50 176,70" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
                    <path d="M 70 142 C 70 115 105 115 105 142 Z" fill="#10B981" />
                    <circle cx="88" cy="85" r="14" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                    <path d="M 75 81 C 75 67 100 67 100 81 Z" fill="#9A3412" />
                    <path d="M 100 105 L 150 62" stroke="#FED7AA" strokeWidth="5" strokeLinecap="round" />
                    <text x="160" y="30" textAnchor="middle" fill="#DC2626" fontSize="11" fontWeight="bold">GENTLY BALANCING ROOF ON TOWER 🔺</text>
                  </g>
                )}
                {stepNumber >= 4 && (
                  <g>
                    <rect x="20" y="130" width="280" height="20" rx="4" fill="#86EFAC" />
                    {/* Tall Complete Tower */}
                    <rect x="145" y="110" width="30" height="20" fill="#3B82F6" />
                    <rect x="148" y="90" width="24" height="20" fill="#10B981" />
                    <rect x="148" y="70" width="24" height="20" fill="#8B5CF6" />
                    <polygon points="145,70 160,48 175,70" fill="#EF4444" />
                    {/* Cheering Leo with hands in air */}
                    <path d="M 40 142 C 40 115 75 115 75 142 Z" fill="#10B981" />
                    <circle cx="58" cy="92" r="14" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                    <path d="M 45 88 C 45 74 70 74 70 88 Z" fill="#9A3412" />
                    <path d="M 58 108 L 48 80" stroke="#FED7AA" strokeWidth="4" strokeLinecap="round" />
                    <path d="M 58 108 L 75 80" stroke="#FED7AA" strokeWidth="4" strokeLinecap="round" />
                    <text x="160" y="25" textAnchor="middle" fill="#0369A1" fontSize="12" fontWeight="black">TALL BLOCK TOWER STANDING! 🏰⭐</text>
                  </g>
                )}
              </g>
            );
          }

          // --- G. DRAWING & PAINTING ARCHETYPE ---
          if (isDrawColor) {
            return (
              <g id="gen-draw-paint-scene">
                {stepNumber === 1 && (
                  <g>
                    <rect x="25" y="112" width="270" height="32" rx="6" fill="#FED7AA" stroke="#F97316" strokeWidth="2" />
                    {/* Paint palette & brush */}
                    <ellipse cx="90" cy="95" rx="35" ry="20" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
                    <circle cx="75" cy="92" r="5" fill="#EF4444" />
                    <circle cx="90" cy="88" r="5" fill="#3B82F6" />
                    <circle cx="105" cy="92" r="5" fill="#EAB308" />
                    <circle cx="95" cy="102" r="5" fill="#10B981" />
                    <rect x="150" y="70" width="100" height="50" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
                    <line x1="200" y1="120" x2="230" y2="85" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
                    <text x="160" y="45" textAnchor="middle" fill="#0369A1" fontSize="11" fontWeight="bold">PAINT PALETTE & CANVAS PAPER READY 🎨</text>
                  </g>
                )}
                {stepNumber === 2 && (
                  <g>
                    <rect x="25" y="112" width="270" height="32" rx="6" fill="#FED7AA" stroke="#F97316" strokeWidth="2" />
                    <ellipse cx="70" cy="100" rx="25" ry="15" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
                    <circle cx="65" cy="98" r="4" fill="#EF4444" />
                    <circle cx="75" cy="98" r="4" fill="#3B82F6" />
                    {/* Child dipping brush */}
                    <path d="M 120 142 C 120 115 155 115 155 142 Z" fill="#10B981" />
                    <circle cx="138" cy="92" r="15" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                    <path d="M 125 88 C 125 74 150 74 150 88 Z" fill="#9A3412" />
                    <path d="M 135 115 L 85 100" stroke="#FED7AA" strokeWidth="5" strokeLinecap="round" />
                    <line x1="85" y1="100" x2="70" y2="98" stroke="#78350F" strokeWidth="3.5" />
                    <circle cx="68" cy="98" r="3" fill="#EF4444" />
                    <text x="160" y="38" textAnchor="middle" fill="#B45309" fontSize="11" fontWeight="bold">DIPPING BRUSH INTO BRIGHT COLOR 🖌️</text>
                  </g>
                )}
                {stepNumber === 3 && (
                  <g>
                    <rect x="25" y="112" width="270" height="32" rx="6" fill="#FED7AA" stroke="#F97316" strokeWidth="2" />
                    {/* Easel/Paper */}
                    <rect x="120" y="60" width="120" height="65" rx="6" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2" />
                    {/* Painted strokes */}
                    <path d="M 135 80 Q 160 65 185 85" stroke="#EF4444" strokeWidth="5" fill="none" strokeLinecap="round" />
                    <path d="M 150 100 Q 180 90 210 105" stroke="#3B82F6" strokeWidth="5" fill="none" strokeLinecap="round" />
                    {/* Child Leo painting */}
                    <path d="M 45 142 C 45 115 80 115 80 142 Z" fill="#10B981" />
                    <circle cx="63" cy="92" r="15" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                    <path d="M 50 88 C 50 74 75 74 75 88 Z" fill="#9A3412" />
                    <path d="M 75 115 L 135 80" stroke="#FED7AA" strokeWidth="5" strokeLinecap="round" />
                    <line x1="135" y1="80" x2="148" y2="78" stroke="#78350F" strokeWidth="3" />
                    <text x="160" y="35" textAnchor="middle" fill="#0284C7" fontSize="11" fontWeight="bold">PAINTING COLORFUL STROKES 🎨</text>
                  </g>
                )}
                {stepNumber >= 4 && (
                  <g>
                    <rect x="105" y="45" width="110" height="85" rx="8" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="3" />
                    <path d="M 120 70 Q 145 55 170 75 Q 195 60 200 80" stroke="#EF4444" strokeWidth="4" fill="none" />
                    <circle cx="160" cy="95" r="15" fill="#FEF08A" stroke="#F59E0B" strokeWidth="2" />
                    <path d="M 130 110 Q 160 95 190 110" stroke="#10B981" strokeWidth="4" fill="none" />
                    <path d="M 35 142 C 35 115 70 115 70 142 Z" fill="#10B981" />
                    <circle cx="53" cy="92" r="14" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                    <path d="M 40 88 C 40 74 65 74 65 88 Z" fill="#9A3412" />
                    <path d="M 65 115 L 105 90" stroke="#FED7AA" strokeWidth="5" strokeLinecap="round" />
                    <path d="M 250 142 C 250 110 285 110 285 142 Z" fill="#0284C7" />
                    <circle cx="268" cy="86" r="14" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                    <path d="M 256 82 C 256 70 280 70 280 82 Z" fill="#78350F" />
                    <text x="160" y="28" textAnchor="middle" fill="#0369A1" fontSize="12" fontWeight="black">COLORFUL PAINTING COMPLETE! ⭐</text>
                  </g>
                )}
              </g>
            );
          }

          // --- H. SHAPES ARCHETYPE ---
          if (isShape) {
            return (
              <g id="gen-shape-scene">
                {stepNumber === 1 && (
                  <g>
                    <rect x="25" y="112" width="270" height="32" rx="6" fill="#FED7AA" stroke="#F97316" strokeWidth="2" />
                    <circle cx="70" cy="95" r="16" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
                    <rect x="110" y="80" width="28" height="28" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1.5" />
                    <polygon points="175,78 192,108 158,108" fill="#EAB308" stroke="#CA8A04" strokeWidth="1.5" />
                    <rect x="220" y="85" width="40" height="22" fill="#10B981" stroke="#047857" strokeWidth="1.5" />
                    <text x="160" y="45" textAnchor="middle" fill="#0369A1" fontSize="11" fontWeight="bold">GEOMETRIC SHAPE CUTOUTS ON TABLE 🔺</text>
                  </g>
                )}
                {stepNumber === 2 && (
                  <g>
                    <rect x="25" y="112" width="270" height="32" rx="6" fill="#FED7AA" stroke="#F97316" strokeWidth="2" />
                    <polygon points="175,78 192,108 158,108" fill="#EAB308" stroke="#CA8A04" strokeWidth="2" />
                    {/* Child tracing triangle edge */}
                    <path d="M 60 142 C 60 115 95 115 95 142 Z" fill="#10B981" />
                    <circle cx="78" cy="92" r="15" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                    <path d="M 65 88 C 65 74 90 74 90 88 Z" fill="#9A3412" />
                    <path d="M 85 115 L 160 90" stroke="#FED7AA" strokeWidth="5" strokeLinecap="round" />
                    <circle cx="160" cy="90" r="4" fill="#FED7AA" />
                    <text x="160" y="38" textAnchor="middle" fill="#854D0E" fontSize="11" fontWeight="bold">TRACING 3 SIDES OF THE TRIANGLE 📐</text>
                  </g>
                )}
                {stepNumber === 3 && (
                  <g>
                    <rect x="25" y="112" width="270" height="32" rx="6" fill="#FED7AA" stroke="#F97316" strokeWidth="2" />
                    {/* Sorting Board with slots */}
                    <rect x="110" y="70" width="130" height="60" rx="6" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2" />
                    <circle cx="135" cy="100" r="12" fill="#EF4444" />
                    <polygon points="175,85 190,110 160,110" fill="#EAB308" />
                    <rect x="205" y="88" width="22" height="22" fill="#3B82F6" />
                    <path d="M 45 142 C 45 115 80 115 80 142 Z" fill="#10B981" />
                    <circle cx="63" cy="92" r="15" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                    <path d="M 50 88 C 50 74 75 74 75 88 Z" fill="#9A3412" />
                    <path d="M 75 115 L 130 100" stroke="#FED7AA" strokeWidth="5" strokeLinecap="round" />
                    <text x="160" y="35" textAnchor="middle" fill="#0369A1" fontSize="11" fontWeight="bold">MATCHING SHAPES INTO SLOTS 🧩</text>
                  </g>
                )}
                {stepNumber >= 4 && (
                  <g>
                    <circle cx="160" cy="90" r="45" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="3" />
                    <polygon points="160,55 170,80 195,80 175,95 182,120 160,105 138,120 145,95 125,80 150,80" fill="#F59E0B" />
                    <path d="M 35 142 C 35 115 70 115 70 142 Z" fill="#10B981" />
                    <circle cx="53" cy="92" r="14" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                    <path d="M 40 88 C 40 74 65 74 65 88 Z" fill="#9A3412" />
                    <text x="160" y="28" textAnchor="middle" fill="#0369A1" fontSize="12" fontWeight="black">SHAPE DETECTIVE MASTER! 🌟</text>
                  </g>
                )}
              </g>
            );
          }

          // --- I. GENERAL / FALLBACK ACTION ENGINE ---
          return (
            <g id="gen-fallback-scene">
              {stepNumber === 1 && (
                // Step 1: Teacher Emma distributing supplies on table
                <g>
                  <rect x="25" y="112" width="270" height="32" rx="6" fill="#FED7AA" stroke="#F97316" strokeWidth="2" />
                  <path d="M 40 142 C 40 108 80 108 80 142 Z" fill="#0284C7" />
                  <circle cx="60" cy="84" r="17" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                  <path d="M 44 80 C 44 66 76 66 76 80 Z" fill="#78350F" />
                  <circle cx="60" cy="62" r="7" fill="#78350F" />
                  <rect x="110" y="95" width="120" height="20" rx="4" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" />
                  <rect x="120" y="82" width="30" height="20" rx="3" fill="#EF4444" />
                  <rect x="155" y="82" width="30" height="20" rx="3" fill="#3B82F6" />
                  <circle cx="205" cy="92" r="8" fill="#EAB308" />
                  <path d="M 75 110 L 115 92" stroke="#FED7AA" strokeWidth="5" strokeLinecap="round" />
                  <text x="160" y="45" textAnchor="middle" fill="#0369A1" fontSize="11" fontWeight="bold">SUPPLIES READY FOR {topic.toUpperCase()} 🎨</text>
                </g>
              )}
              {stepNumber === 2 && (
                // Step 2: Child Leo holding and exploring the primary material
                <g>
                  <rect x="25" y="112" width="270" height="32" rx="6" fill="#FED7AA" stroke="#F97316" strokeWidth="2" />
                  <path d="M 60 142 C 60 115 95 115 95 142 Z" fill="#10B981" />
                  <circle cx="78" cy="92" r="15" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                  <path d="M 65 88 C 65 74 90 74 90 88 Z" fill="#9A3412" />
                  <path d="M 90 115 L 145 90" stroke="#FED7AA" strokeWidth="5" strokeLinecap="round" />
                  <circle cx="155" cy="85" r="14" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
                  <text x="175" y="80" fontSize="16">✨</text>
                  <rect x="100" y="24" width="160" height="24" rx="12" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
                  <text x="180" y="40" textAnchor="middle" fill="#854D0E" fontSize="10" fontWeight="bold">"Let's explore {topic}!" 🔍</text>
                </g>
              )}
              {stepNumber === 3 && (
                // Step 3: Hands-on manipulation & active creation
                <g>
                  <rect x="25" y="112" width="270" height="32" rx="6" fill="#FED7AA" stroke="#F97316" strokeWidth="2" />
                  <rect x="120" y="75" width="110" height="55" rx="6" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
                  <circle cx="150" cy="98" r="10" fill="#EF4444" />
                  <line x1="140" y1="110" x2="190" y2="90" stroke="#3B82F6" strokeWidth="3" />
                  <polygon points="185,85 195,100 175,100" fill="#10B981" />
                  <path d="M 50 142 C 50 115 85 115 85 142 Z" fill="#10B981" />
                  <circle cx="68" cy="92" r="15" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                  <path d="M 55 88 C 55 74 80 74 80 88 Z" fill="#9A3412" />
                  <path d="M 80 118 L 140 95" stroke="#FED7AA" strokeWidth="5" strokeLinecap="round" />
                  <text x="160" y="38" textAnchor="middle" fill="#0369A1" fontSize="11" fontWeight="bold">HANDS-ON CREATION IN PROGRESS 🛠️</text>
                </g>
              )}
              {stepNumber >= 4 && (
                // Step 4: Holding up finished project
                <g>
                  <rect x="110" y="50" width="105" height="75" rx="8" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="3" />
                  <circle cx="140" cy="80" r="14" fill="#F43F5E" />
                  <polygon points="180,68 192,92 168,92" fill="#3B82F6" />
                  <rect x="145" y="96" width="35" height="16" rx="3" fill="#10B981" />
                  <path d="M 35 142 C 35 115 70 115 70 142 Z" fill="#10B981" />
                  <circle cx="53" cy="92" r="14" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                  <path d="M 40 88 C 40 74 65 74 65 88 Z" fill="#9A3412" />
                  <path d="M 65 115 L 110 90" stroke="#FED7AA" strokeWidth="5" strokeLinecap="round" />
                  <path d="M 250 142 C 250 110 285 110 285 142 Z" fill="#0284C7" />
                  <circle cx="268" cy="86" r="14" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
                  <path d="M 256 82 C 256 70 280 70 280 82 Z" fill="#78350F" />
                  <text x="160" y="28" textAnchor="middle" fill="#0369A1" fontSize="12" fontWeight="black">{topic.toUpperCase()} MASTERPIECE COMPLETE! ⭐</text>
                </g>
              )}
            </g>
          );
        })()}
      </svg>

      {/* Visual Step Sub-Badge */}
      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
        <span className="bg-amber-500 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase shadow-xs">
          Step {stepNumber}
        </span>
      </div>

      {highlightDetail && (
        <div className="absolute bottom-1.5 inset-x-2 text-center bg-white/90 backdrop-blur-xs py-0.5 px-2 rounded-lg border border-amber-200/70 text-[10px] font-bold text-amber-900 truncate">
          {highlightDetail}
        </div>
      )}
    </div>
  );
};
