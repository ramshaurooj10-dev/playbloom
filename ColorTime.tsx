import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, ArrowLeft, ArrowRight, Sparkles, Star, Check } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface ColorTimeProps {
  onCollectStar: () => void;
  onNavigateHome?: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  isActivityCompleted?: boolean;
}

interface ColorButton {
  name: string;
  hex: string;
  bgClass: string;
  borderClass: string;
}

const COLOR_BUTTONS: ColorButton[] = [
  { name: 'Red', hex: '#EF4444', bgClass: 'bg-red-500', borderClass: 'border-red-700' },
  { name: 'Yellow', hex: '#EAB308', bgClass: 'bg-yellow-400', borderClass: 'border-yellow-600' },
  { name: 'Blue', hex: '#3B82F6', bgClass: 'bg-blue-500', borderClass: 'border-blue-700' },
  { name: 'Green', hex: '#22C55E', bgClass: 'bg-green-500', borderClass: 'border-green-700' },
  { name: 'Purple', hex: '#A855F7', bgClass: 'bg-purple-500', borderClass: 'border-purple-700' },
  { name: 'Orange', hex: '#F97316', bgClass: 'bg-orange-500', borderClass: 'border-orange-700' },
];

// SVG Outline Components with Thick 2D Vector Strokes

const AppleOutline = ({ color }: { color: string }) => (
  <svg viewBox="0 0 200 200" className="w-56 h-56 sm:w-80 sm:h-80 drop-shadow-xl">
    {/* Stem */}
    <path
      d="M100 50 C95 30 110 20 115 15"
      fill="none"
      stroke="#1E293B"
      strokeWidth="9"
      strokeLinecap="round"
    />
    {/* Leaf */}
    <path
      d="M105 32 C125 20 135 35 120 42 C110 45 105 35 105 32 Z"
      fill="#4ADE80"
      stroke="#1E293B"
      strokeWidth="7"
      strokeLinejoin="round"
    />
    {/* Apple Body */}
    <path
      d="M100 55 C60 50 30 80 30 120 C30 165 70 185 100 170 C130 185 170 165 170 120 C170 80 140 50 100 55 Z"
      fill={color}
      stroke="#1E293B"
      strokeWidth="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Inner Shine Detail */}
    <path
      d="M55 85 C50 100 52 115 50 125"
      fill="none"
      stroke="rgba(255,255,255,0.7)"
      strokeWidth="7"
      strokeLinecap="round"
    />
  </svg>
);

const BananaOutline = ({ color }: { color: string }) => (
  <svg viewBox="0 0 200 200" className="w-56 h-56 sm:w-80 sm:h-80 drop-shadow-xl">
    {/* Banana Stem Top */}
    <path d="M40 55 C45 40 55 42 50 58" fill="#78350F" stroke="#1E293B" strokeWidth="6" />
    {/* Curved Banana Body */}
    <path
      d="M45 55 C80 50 170 80 160 155 C120 175 60 140 45 55 Z"
      fill={color}
      stroke="#1E293B"
      strokeWidth="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Bottom Tip */}
    <path d="M160 155 C163 162 155 168 150 162 Z" fill="#78350F" stroke="#1E293B" strokeWidth="6" />
    {/* Inner Curve Detail Line */}
    <path
      d="M58 75 C85 75 140 100 138 145"
      fill="none"
      stroke="rgba(30, 41, 59, 0.2)"
      strokeWidth="6"
      strokeLinecap="round"
    />
  </svg>
);

const OrangeOutline = ({ color }: { color: string }) => (
  <svg viewBox="0 0 200 200" className="w-56 h-56 sm:w-80 sm:h-80 drop-shadow-xl">
    {/* Leaf on top */}
    <path
      d="M100 40 C120 25 130 40 115 48 C105 50 100 42 100 40 Z"
      fill="#4ADE80"
      stroke="#1E293B"
      strokeWidth="7"
      strokeLinejoin="round"
    />
    {/* Small Stem */}
    <circle cx="100" cy="45" r="5" fill="#78350F" stroke="#1E293B" strokeWidth="4" />
    {/* Orange Circle Body */}
    <circle
      cx="100"
      cy="110"
      r="65"
      fill={color}
      stroke="#1E293B"
      strokeWidth="10"
    />
    {/* Texture Shine */}
    <path
      d="M60 85 C55 100 58 115 56 125"
      fill="none"
      stroke="rgba(255,255,255,0.7)"
      strokeWidth="7"
      strokeLinecap="round"
    />
  </svg>
);

const LeafOutline = ({ color }: { color: string }) => (
  <svg viewBox="0 0 200 200" className="w-56 h-56 sm:w-80 sm:h-80 drop-shadow-xl">
    {/* Leaf Stem & Center Vein */}
    <path
      d="M40 165 C70 145 110 105 160 35"
      fill="none"
      stroke="#1E293B"
      strokeWidth="9"
      strokeLinecap="round"
    />
    {/* Leaf Main Body */}
    <path
      d="M40 165 C30 110 80 40 160 35 C155 115 95 175 40 165 Z"
      fill={color}
      stroke="#1E293B"
      strokeWidth="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Side Veins */}
    <path d="M75 130 C85 120 95 122 95 122" fill="none" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" />
    <path d="M100 100 C112 90 122 92 122 92" fill="none" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" />
    <path d="M85 118 C75 110 70 105 70 105" fill="none" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" />
  </svg>
);

const FlowerOutline = ({ color }: { color: string }) => (
  <svg viewBox="0 0 200 200" className="w-56 h-56 sm:w-80 sm:h-80 drop-shadow-xl">
    {/* Stem */}
    <path
      d="M100 130 Q100 175 90 190"
      fill="none"
      stroke="#16A34A"
      strokeWidth="11"
      strokeLinecap="round"
    />
    {/* Leaf */}
    <path
      d="M95 160 C75 150 65 165 85 175 Z"
      fill="#4ADE80"
      stroke="#1E293B"
      strokeWidth="6"
    />
    {/* Petals */}
    <g fill={color} stroke="#1E293B" strokeWidth="9" strokeLinejoin="round">
      <circle cx="100" cy="50" r="28" />
      <circle cx="145" cy="75" r="28" />
      <circle cx="145" cy="125" r="28" />
      <circle cx="100" cy="150" r="28" />
      <circle cx="55" cy="125" r="28" />
      <circle cx="55" cy="75" r="28" />
    </g>
    {/* Center */}
    <circle
      cx="100"
      cy="100"
      r="28"
      fill="#FDE047"
      stroke="#1E293B"
      strokeWidth="9"
    />
  </svg>
);

const FishOutline = ({ color }: { color: string }) => (
  <svg viewBox="0 0 200 200" className="w-56 h-56 sm:w-80 sm:h-80 drop-shadow-xl">
    {/* Tail Fin */}
    <path
      d="M150 100 L185 60 C180 100 180 100 185 140 Z"
      fill={color}
      stroke="#1E293B"
      strokeWidth="9"
      strokeLinejoin="round"
    />
    {/* Main Fish Body */}
    <path
      d="M150 100 C130 45 60 45 25 100 C60 155 130 155 150 100 Z"
      fill={color}
      stroke="#1E293B"
      strokeWidth="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Top Fin */}
    <path
      d="M85 60 C95 35 115 40 105 63"
      fill={color}
      stroke="#1E293B"
      strokeWidth="8"
    />
    {/* Eye */}
    <circle cx="55" cy="88" r="10" fill="#FFFFFF" stroke="#1E293B" strokeWidth="7" />
    <circle cx="53" cy="88" r="4" fill="#1E293B" />
    {/* Smile */}
    <path d="M25 100 Q18 102 25 106" fill="none" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" />
  </svg>
);

interface ColorObject {
  id: string;
  name: string;
  emoji: string;
  targetColorName: string;
  targetColorHex: string;
  render: (col: string) => React.ReactNode;
}

const OBJECTS: ColorObject[] = [
  { id: 'apple', name: 'Apple', emoji: '🍎', targetColorName: 'Red', targetColorHex: '#EF4444', render: (col) => <AppleOutline color={col} /> },
  { id: 'banana', name: 'Banana', emoji: '🍌', targetColorName: 'Yellow', targetColorHex: '#EAB308', render: (col) => <BananaOutline color={col} /> },
  { id: 'orange', name: 'Orange', emoji: '🍊', targetColorName: 'Orange', targetColorHex: '#F97316', render: (col) => <OrangeOutline color={col} /> },
  { id: 'leaf', name: 'Leaf', emoji: '🍃', targetColorName: 'Green', targetColorHex: '#22C55E', render: (col) => <LeafOutline color={col} /> },
  { id: 'flower', name: 'Flower', emoji: '🌸', targetColorName: 'Purple', targetColorHex: '#A855F7', render: (col) => <FlowerOutline color={col} /> },
  { id: 'fish', name: 'Fish', emoji: '🐟', targetColorName: 'Blue', targetColorHex: '#3B82F6', render: (col) => <FishOutline color={col} /> },
];

export const ColorTime: React.FC<ColorTimeProps> = ({
  onCollectStar,
  onNavigateHome,
  onNavigateNext,
  onNavigatePrev,
  isActivityCompleted,
}) => {
  const [objectIndex, setObjectIndex] = useState(0);
  const [colorButtons, setColorButtons] = useState<ColorButton[]>(COLOR_BUTTONS);
  const [selectedColor, setSelectedColor] = useState<ColorButton>(COLOR_BUTTONS[0]);
  const [objectColors, setObjectColors] = useState<Record<string, string>>({
    apple: '#FFFFFF',
    banana: '#FFFFFF',
    orange: '#FFFFFF',
    leaf: '#FFFFFF',
    flower: '#FFFFFF',
    fish: '#FFFFFF',
  });
  const [showCelebration, setShowCelebration] = useState(false);
  const [bounceCount, setBounceCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    shuffleColorButtons();
  }, []);

  const shuffleColorButtons = () => {
    let shuffled = [...COLOR_BUTTONS].sort(() => Math.random() - 0.5);
    if (colorButtons.length > 0) {
      const prevNames = colorButtons.map((c) => c.name).join(',');
      let attempts = 0;
      while (shuffled.map((c) => c.name).join(',') === prevNames && attempts < 20) {
        shuffled = [...COLOR_BUTTONS].sort(() => Math.random() - 0.5);
        attempts++;
      }
    }
    setColorButtons(shuffled);
  };

  const currentObj = OBJECTS[objectIndex];
  const currentColorHex = objectColors[currentObj.id] || '#FFFFFF';

  const checkCompletion = (newColors: Record<string, string>) => {
    const coloredCount = Object.values(newColors).filter((c) => c !== '#FFFFFF').length;
    if (coloredCount === OBJECTS.length && !isCompleted) {
      setIsCompleted(true);
      onCollectStar();
      soundManager.playSuccess();
    }
  };

  // Apply color to current object
  const applyColor = (color: ColorButton) => {
    soundManager.playPop();
    setSelectedColor(color);
    setBounceCount((prev) => prev + 1);

    // Check if selected color matches the natural real-world color for this object
    if (color.name === currentObj.targetColorName) {
      const updatedColors = { ...objectColors, [currentObj.id]: color.hex };
      setObjectColors(updatedColors);

      soundManager.speak(`${color.name} ${currentObj.name}!`);
      setShowCelebration(true);

      checkCompletion(updatedColors);

      setTimeout(() => {
        setShowCelebration(false);
        setObjectIndex((prev) => (prev < OBJECTS.length - 1 ? prev + 1 : prev));
      }, 1400);
    } else {
      // Gentle audio prompt to teach correct color without coloring object wrong color
      soundManager.speak(`${currentObj.name}s are ${currentObj.targetColorName}! Try ${currentObj.targetColorName}!`);
      setShowCelebration(false);
    }
  };

  // Direct tap on object -> colors it with its natural real-world color!
  const handleTapObjectDirect = () => {
    soundManager.playPop();
    setBounceCount((prev) => prev + 1);

    const matchingColorBtn = COLOR_BUTTONS.find((c) => c.name === currentObj.targetColorName) || COLOR_BUTTONS[0];
    setSelectedColor(matchingColorBtn);

    const updatedColors = { ...objectColors, [currentObj.id]: currentObj.targetColorHex };
    setObjectColors(updatedColors);

    soundManager.speak(`${currentObj.targetColorName} ${currentObj.name}!`);
    setShowCelebration(true);

    checkCompletion(updatedColors);

    setTimeout(() => {
      setShowCelebration(false);
      setObjectIndex((prev) => (prev < OBJECTS.length - 1 ? prev + 1 : prev));
    }, 1400);
  };

  // Previous Object - step by step
  const handlePrev = () => {
    soundManager.playPop();
    setShowCelebration(false);
    if (isCompleted) {
      setIsCompleted(false);
      setObjectIndex(OBJECTS.length - 1);
    } else if (objectIndex > 0) {
      setObjectIndex((prev) => prev - 1);
    } else {
      if (onNavigatePrev) {
        onNavigatePrev();
      }
    }
  };

  // Next Object
  const handleNext = () => {
    soundManager.playPop();
    setShowCelebration(false);
    setObjectIndex((prev) => (prev + 1) % OBJECTS.length);
  };

  return (
    <div id="activity-color-time" className="w-full max-w-4xl mx-auto p-3 sm:p-6 flex flex-col items-center">
      {/* Top Navigation & Header Bar */}
      <div className="w-full flex items-center justify-between gap-3 mb-4 bg-white/95 p-4 rounded-3xl border-4 border-pink-300 shadow-md">
        {/* Home Button & Title */}
        <div className="flex items-center gap-3">
          {onNavigateHome && (
            <button
              type="button"
              onClick={() => {
                soundManager.playPop();
                onNavigateHome();
              }}
              className="flex items-center gap-1.5 bg-[#6BCB77] hover:bg-emerald-600 text-white font-black px-4 py-2 rounded-2xl border-b-4 border-[#16A34A] active:border-b-0 active:translate-y-1 shadow-sm transition-all cursor-pointer text-sm sm:text-base uppercase"
            >
              <Home className="w-5 h-5 stroke-[3]" />
              <span>HOME</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <span className="text-3xl sm:text-4xl">🎨</span>
            <h2 className="text-2xl sm:text-3xl font-black text-pink-950 uppercase tracking-wide">
              COLOR TIME
            </h2>
          </div>
        </div>

        {/* Progress Counter */}
        <div className="flex items-center gap-2 bg-pink-100 px-4 py-2 rounded-2xl border-2 border-pink-300 shadow-inner">
          <Star className="w-5 h-5 fill-amber-400 text-amber-500 animate-bounce" />
          <span className="font-black text-pink-950 text-sm sm:text-base">
            {objectIndex + 1} / {OBJECTS.length}
          </span>
        </div>
      </div>

      {/* Main 2D Cartoon Learning Scene Canvas */}
      <div className="relative w-full rounded-3xl bg-gradient-to-b from-sky-100 via-pink-50 to-amber-50 border-8 border-white shadow-2xl p-6 sm:p-10 flex flex-col items-center justify-center min-h-[420px] overflow-hidden">
        {/* Soft Playful Background Decorations */}
        <div className="absolute top-4 left-6 text-3xl opacity-60 animate-bounce">☁️</div>
        <div className="absolute top-5 right-8 text-3xl opacity-60 animate-pulse">☁️</div>
        <div className="absolute top-3 right-1/3 text-2xl opacity-50">✨</div>
        <div className="absolute top-4 left-1/3 text-2xl opacity-50">⭐</div>

        {/* CENTER: One Large Black-and-White Outline Object */}
        <div className="relative z-10 flex flex-col items-center my-2">
          <motion.div
            key={`color-obj-${currentObj.id}-${bounceCount}`}
            initial={{ scale: 0.9, y: -5 }}
            animate={{ scale: [1, 1.08, 1], y: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            onClick={handleTapObjectDirect}
            className="cursor-pointer group relative flex flex-col items-center"
            title={`Tap to color ${currentObj.name} ${currentObj.targetColorName}`}
          >
            {/* Render vector outline with filled color interior */}
            {currentObj.render(currentColorHex)}

            {/* Tap instruction hint */}
            <div className="mt-2 bg-white/90 text-slate-800 font-extrabold text-base sm:text-xl px-6 py-2 rounded-full border-4 border-pink-300 shadow-md flex items-center gap-2 group-hover:scale-105 transition-transform">
              <span>{currentObj.emoji}</span>
              <span>{currentObj.name} is {currentObj.targetColorName}!</span>
            </div>
          </motion.div>

          {/* Sparkles & Great Job Celebration Banner */}
          <AnimatePresence>
            {showCelebration && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="mt-4 bg-amber-400 text-amber-950 font-black text-xl sm:text-3xl px-8 py-3 rounded-full border-4 border-amber-600 shadow-xl flex items-center gap-3 animate-pulse"
              >
                <Sparkles className="w-7 h-7 text-amber-900 animate-spin" />
                <span>Great Job! 🎉</span>
                <Sparkles className="w-7 h-7 text-amber-900 animate-spin" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* BOTTOM: Large Round Color Buttons */}
      <div className="w-full mt-6 bg-white/90 p-4 sm:p-5 rounded-3xl border-4 border-pink-200 shadow-lg flex flex-col items-center gap-3">
        <span className="text-xs sm:text-sm font-black text-pink-900 uppercase tracking-wider flex items-center gap-1.5">
          <span>🎨</span> Pick {currentObj.targetColorName} for {currentObj.name}:
        </span>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
          {colorButtons.map((col) => {
            const isSelected = selectedColor.name === col.name;

            return (
              <button
                key={col.name}
                type="button"
                onClick={() => applyColor(col)}
                className={`w-14 h-14 sm:w-18 sm:h-18 rounded-full ${col.bgClass} border-4 ${col.borderClass} shadow-lg transition-all cursor-pointer flex items-center justify-center transform active:scale-90 ${
                  isSelected
                    ? 'scale-115 ring-8 ring-pink-300/80 z-10'
                    : 'hover:scale-110 opacity-95'
                }`}
                title={`Paint ${col.name}`}
              >
                {isSelected && (
                  <Check className="w-7 h-7 text-white stroke-[3.5] drop-shadow-md" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* NAVIGATION: Large Child-Friendly PREVIOUS, HOME, and NEXT Buttons */}
      <div className="w-full max-w-2xl mt-6 grid grid-cols-3 gap-3 sm:gap-6">
        {/* Previous Button */}
        <button
          type="button"
          onClick={handlePrev}
          className="flex items-center justify-center gap-2 bg-[#4D96FF] hover:bg-blue-500 text-white font-black py-4 px-3 sm:px-6 rounded-3xl border-b-8 border-[#2563EB] shadow-xl active:border-b-2 active:translate-y-1.5 transition-all cursor-pointer text-base sm:text-xl uppercase"
        >
          <ArrowLeft className="w-6 h-6 stroke-[3]" />
          <span>PREV</span>
        </button>

        {/* Home Button */}
        <button
          type="button"
          onClick={() => {
            soundManager.playPop();
            if (onNavigateHome) onNavigateHome();
          }}
          className="flex items-center justify-center gap-2 bg-[#F7D060] hover:bg-amber-400 text-amber-950 font-black py-4 px-3 sm:px-6 rounded-3xl border-b-8 border-[#CA8A04] shadow-xl active:border-b-2 active:translate-y-1.5 transition-all cursor-pointer text-base sm:text-xl uppercase"
        >
          <Home className="w-6 h-6 stroke-[3]" />
          <span>HOME</span>
        </button>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => {
            if (isCompleted || isActivityCompleted) {
              soundManager.playPop();
              if (onNavigateNext) onNavigateNext();
            } else {
              soundManager.playPop();
              soundManager.speak('Finish coloring all objects to unlock next!');
            }
          }}
          className={`flex items-center justify-center gap-2 font-black py-4 px-3 sm:px-6 rounded-3xl shadow-xl transition-all text-base sm:text-xl uppercase ${
            isCompleted || isActivityCompleted
              ? 'bg-[#6BCB77] hover:bg-emerald-500 text-white border-b-8 border-[#16A34A] active:border-b-2 active:translate-y-1.5 cursor-pointer'
              : 'bg-slate-300 text-slate-500 border-b-4 border-slate-400 cursor-not-allowed opacity-70'
          }`}
        >
          <span>NEXT</span>
          <ArrowRight className="w-6 h-6 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};

