import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Volume2, Star as StarIcon, Sparkles, ArrowRight, Check } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { ActivityBottomNav } from './ActivityBottomNav';

interface ColorMixingProps {
  onCollectStar: () => void;
  onNavigateHome?: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  isActivityCompleted?: boolean;
}

export type PrimaryColor = 'red' | 'yellow' | 'blue';
export type SecondaryColor = 'orange' | 'green' | 'purple';

export interface PrimaryColorInfo {
  id: PrimaryColor;
  name: string;
  emoji: string;
  bgClass: string;
  borderClass: string;
  shadowClass: string;
  textClass: string;
  hex: string;
}

export interface TargetColorInfo {
  id: SecondaryColor;
  name: string;
  emoji: string;
  bgClass: string;
  borderClass: string;
  shadowClass: string;
  textClass: string;
  hex: string;
  validPairs: [PrimaryColor, PrimaryColor][];
  formulaText: string;
}

const PRIMARY_COLORS: Record<PrimaryColor, PrimaryColorInfo> = {
  red: {
    id: 'red',
    name: 'Red',
    emoji: '🔴',
    bgClass: 'bg-red-500',
    borderClass: 'border-red-700',
    shadowClass: 'shadow-red-700/50',
    textClass: 'text-white',
    hex: '#EF4444',
  },
  yellow: {
    id: 'yellow',
    name: 'Yellow',
    emoji: '🟡',
    bgClass: 'bg-amber-400',
    borderClass: 'border-amber-600',
    shadowClass: 'shadow-amber-600/50',
    textClass: 'text-amber-950',
    hex: '#FBBF24',
  },
  blue: {
    id: 'blue',
    name: 'Blue',
    emoji: '🔵',
    bgClass: 'bg-blue-500',
    borderClass: 'border-blue-700',
    shadowClass: 'shadow-blue-700/50',
    textClass: 'text-white',
    hex: '#3B82F6',
  },
};

const SECONDARY_COLORS: Record<SecondaryColor, TargetColorInfo> = {
  orange: {
    id: 'orange',
    name: 'Orange',
    emoji: '🟠',
    bgClass: 'bg-orange-500',
    borderClass: 'border-orange-700',
    shadowClass: 'shadow-orange-700/50',
    textClass: 'text-white',
    hex: '#F97316',
    validPairs: [
      ['red', 'yellow'],
      ['yellow', 'red'],
    ],
    formulaText: 'RED + YELLOW = ORANGE',
  },
  green: {
    id: 'green',
    name: 'Green',
    emoji: '🟢',
    bgClass: 'bg-emerald-500',
    borderClass: 'border-emerald-700',
    shadowClass: 'shadow-emerald-700/50',
    textClass: 'text-white',
    hex: '#10B981',
    validPairs: [
      ['yellow', 'blue'],
      ['blue', 'yellow'],
    ],
    formulaText: 'YELLOW + BLUE = GREEN',
  },
  purple: {
    id: 'purple',
    name: 'Purple',
    emoji: '🟣',
    bgClass: 'bg-purple-500',
    borderClass: 'border-purple-700',
    shadowClass: 'shadow-purple-700/50',
    textClass: 'text-white',
    hex: '#A855F7',
    validPairs: [
      ['red', 'blue'],
      ['blue', 'red'],
    ],
    formulaText: 'RED + BLUE = PURPLE',
  },
};

export interface ColorChallenge {
  id: string;
  targetColor: SecondaryColor;
  availableOptions: PrimaryColor[]; // Shuffled order of ['red', 'yellow', 'blue']
}

// Fisher-Yates array shuffle
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Generate 7 balanced, engaging challenges
const generateChallenges = (): ColorChallenge[] => {
  const targets: SecondaryColor[] = [
    'orange',
    'green',
    'purple',
    'orange',
    'purple',
    'green',
    'orange',
  ];

  return targets.map((target, idx) => ({
    id: `color_c_${idx}_${Math.random().toString(36).substring(2, 6)}`,
    targetColor: target,
    availableOptions: shuffleArray<PrimaryColor>(['red', 'yellow', 'blue']),
  }));
};

const GRADIENTS = [
  'from-indigo-100 via-purple-50 to-pink-100',
  'from-sky-100 via-teal-50 to-amber-100',
  'from-rose-100 via-orange-50 to-purple-100',
  'from-teal-100 via-sky-50 to-indigo-100',
  'from-amber-100 via-rose-50 to-sky-100',
];

export const ColorMixing: React.FC<ColorMixingProps> = ({
  onCollectStar,
  onNavigateHome,
  onNavigateNext,
  onNavigatePrev,
  isActivityCompleted = false,
}) => {
  const [challenges, setChallenges] = useState<ColorChallenge[]>(generateChallenges);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [bgGradient, setBgGradient] = useState(GRADIENTS[0]);

  // Selected 2 colors: [slot1, slot2]
  const [color1, setColor1] = useState<PrimaryColor | null>(null);
  const [color2, setColor2] = useState<PrimaryColor | null>(null);

  // Animation and status states
  const [isMixing, setIsMixing] = useState(false);
  const [mixingStep, setMixingStep] = useState<0 | 1 | 2 | 3>(0); // 0: Idle, 1: Pouring, 2: Swirling, 3: Transformed
  const [mixedColorResult, setMixedColorResult] = useState<SecondaryColor | null>(null);
  const [isWrongCombo, setIsWrongCombo] = useState(false);
  const [isChallengeSuccess, setIsChallengeSuccess] = useState(false);
  const [isAllFinished, setIsAllFinished] = useState(false);

  const currentChallenge = challenges[currentChallengeIndex] || challenges[0];
  const targetInfo = SECONDARY_COLORS[currentChallenge.targetColor];

  // Voice instruction on challenge change
  useEffect(() => {
    if (isAllFinished) return;
    soundManager.speak(`Can you make ${targetInfo.name.toLowerCase()}?`);
    // Reset selections
    setColor1(null);
    setColor2(null);
    setIsMixing(false);
    setMixingStep(0);
    setMixedColorResult(null);
    setIsWrongCombo(false);
    setIsChallengeSuccess(false);
    setBgGradient(GRADIENTS[currentChallengeIndex % GRADIENTS.length]);
  }, [currentChallengeIndex, isAllFinished]);

  // Handle color selection (fills slot 1 first, then slot 2)
  const handleSelectColor = (selected: PrimaryColor) => {
    if (isMixing || isChallengeSuccess || isAllFinished) return;

    soundManager.playPop();
    soundManager.speak(PRIMARY_COLORS[selected].name);

    if (!color1) {
      setColor1(selected);
    } else if (!color2) {
      if (color1 === selected) {
        // Child picked same color twice -> replace or allow pick another
        soundManager.speak(`You have ${PRIMARY_COLORS[selected].name}. Pick another color to mix!`);
        return;
      }
      setColor2(selected);
    } else {
      // If both filled, replace slot 2 or reset slot 2 with new pick
      if (color1 === selected) {
        return;
      }
      setColor2(selected);
    }
  };

  // Clear a specific slot
  const handleClearSlot = (slotNum: 1 | 2) => {
    if (isMixing || isChallengeSuccess || isAllFinished) return;
    soundManager.playPop();
    if (slotNum === 1) {
      setColor1(null);
    } else {
      setColor2(null);
    }
  };

  // Determine mixed color from two primary colors
  const calculateMix = (c1: PrimaryColor, c2: PrimaryColor): SecondaryColor | null => {
    const pair = [c1, c2].sort().join('+');
    if (pair === 'red+yellow' || pair === 'yellow+red') return 'orange';
    if (pair === 'blue+yellow' || pair === 'yellow+blue') return 'green';
    if (pair === 'blue+red' || pair === 'red+blue') return 'purple';
    return null;
  };

  // Handle MIX button tap
  const handleMixColors = () => {
    if (!color1 || !color2 || isMixing || isChallengeSuccess || isAllFinished) return;

    setIsMixing(true);
    soundManager.playPop();
    soundManager.speak('Mixing colors!');

    // Step 1: Pouring colors into bowl
    setMixingStep(1);

    // Step 2: Swirling colors
    setTimeout(() => {
      setMixingStep(2);
      soundManager.playPop();
    }, 600);

    // Step 3: Reveal combined color
    setTimeout(() => {
      const result = calculateMix(color1, color2);
      setMixedColorResult(result);
      setMixingStep(3);

      const isCorrect = result === currentChallenge.targetColor;

      if (isCorrect) {
        // CORRECT COMBINATION!
        soundManager.playCelebration();
        soundManager.speak(`Great job! You made ${targetInfo.name.toLowerCase()}!`);
        setIsChallengeSuccess(true);

        setTimeout(() => {
          if (currentChallengeIndex + 1 >= challenges.length) {
            // All challenges finished!
            onCollectStar();
            setIsAllFinished(true);
            soundManager.speak('You mixed all the colors! Great job!');
          } else {
            // Automatically advance to next challenge
            setCurrentChallengeIndex((prev) => prev + 1);
          }
        }, 2200);
      } else {
        // WRONG COMBINATION
        soundManager.playPop();
        soundManager.speak('Try again!');
        setIsWrongCombo(true);

        setTimeout(() => {
          setIsWrongCombo(false);
          setIsMixing(false);
          setMixingStep(0);
          setMixedColorResult(null);
          setColor1(null);
          setColor2(null);
        }, 1200);
      }
    }, 1200);
  };

  // Full Replay / Play Again
  const handlePlayAgain = () => {
    soundManager.speak("Let's mix colors again!");
    setChallenges(generateChallenges());
    setCurrentChallengeIndex(0);
    setColor1(null);
    setColor2(null);
    setIsMixing(false);
    setMixingStep(0);
    setMixedColorResult(null);
    setIsWrongCombo(false);
    setIsChallengeSuccess(false);
    setIsAllFinished(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-2 sm:p-4">
      {/* Top Banner Header */}
      <div className="w-full flex items-center justify-between bg-white border-4 border-indigo-300 rounded-3xl px-4 sm:px-6 py-2.5 shadow-md mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl sm:text-3xl">🧪</span>
          <div>
            <h1 className="text-base sm:text-lg font-black text-indigo-950 tracking-tight leading-tight">
              COLOR MIXING
            </h1>
            <p className="text-[11px] sm:text-xs font-bold text-indigo-700">
              Challenge: {currentChallengeIndex + (isAllFinished ? 1 : 0)} / {challenges.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-indigo-100 border-2 border-indigo-300 px-3 py-1 rounded-full text-indigo-900 font-black text-xs">
          <StarIcon className="w-4 h-4 fill-amber-400 text-amber-500" />
          <span>{isActivityCompleted || isAllFinished ? '⭐ STAR EARNED' : '1 STAR'}</span>
        </div>
      </div>

      {/* Main Play Area Card */}
      <div
        className={`w-full bg-gradient-to-br ${bgGradient} border-4 border-indigo-400 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col items-center relative overflow-hidden min-h-[530px] justify-between transition-colors duration-500`}
      >
        {/* Instruction Banner with Target Goal */}
        <div className="text-center mt-1 mb-2">
          <div className="inline-flex items-center gap-2 bg-white px-5 sm:px-7 py-2 rounded-full border-4 border-indigo-300 shadow-md mb-1.5">
            <button
              type="button"
              onClick={() => soundManager.speak(`Can you make ${targetInfo.name.toLowerCase()}?`)}
              className="text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
              title="Repeat instruction"
            >
              <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <h2 className="text-base sm:text-xl font-black text-indigo-950 tracking-wide flex items-center gap-2">
              <span>Can you make</span>
              <span
                className={`px-3 py-0.5 rounded-full text-white font-black shadow-xs ${targetInfo.bgClass} ${targetInfo.borderClass} border-2`}
              >
                {targetInfo.name.toUpperCase()} {targetInfo.emoji}
              </span>
              <span>?</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-black text-slate-600 uppercase tracking-wide">
            Select 2 primary colors below and tap MIX!
          </p>
        </div>

        {/* INTERACTIVE COLOR LAB / MIXING FLASK WORKSPACE */}
        <div className="w-full max-w-2xl flex flex-col items-center my-auto py-2">
          {/* Top 2 Color Source Slots with connecting tubes/pipes to the bowl */}
          <div className="w-full flex items-center justify-center gap-6 sm:gap-12 relative mb-2">
            {/* Slot 1: First Selected Color */}
            <div className="flex flex-col items-center">
              <span className="text-[11px] sm:text-xs font-black text-indigo-950 uppercase tracking-wider mb-1">
                Color 1
              </span>
              <div
                onClick={() => color1 && handleClearSlot(1)}
                className={`relative w-20 h-22 sm:w-26 sm:h-28 rounded-3xl border-4 flex flex-col items-center justify-center transition-all cursor-pointer select-none ${
                  color1
                    ? `${PRIMARY_COLORS[color1].bgClass} ${PRIMARY_COLORS[color1].borderClass} ${PRIMARY_COLORS[color1].shadowClass} border-b-6 shadow-xl scale-105`
                    : 'bg-white/80 border-dashed border-indigo-300 shadow-inner hover:border-indigo-400 hover:bg-white'
                }`}
              >
                {color1 ? (
                  <motion.div
                    initial={{ scale: 0.5, y: -10 }}
                    animate={{ scale: 1, y: 0 }}
                    className="flex flex-col items-center justify-center"
                  >
                    <span className="text-3xl sm:text-4xl drop-shadow-sm">
                      {PRIMARY_COLORS[color1].emoji}
                    </span>
                    <span
                      className={`text-xs sm:text-sm font-black mt-1 ${PRIMARY_COLORS[color1].textClass}`}
                    >
                      {PRIMARY_COLORS[color1].name}
                    </span>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-indigo-300">
                    <span className="text-2xl sm:text-3xl font-black opacity-50">?</span>
                    <span className="text-[10px] font-black text-indigo-400 uppercase mt-1">
                      Pick Color
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Middle Plus Sign */}
            <div className="flex flex-col items-center justify-center">
              <span className="text-3xl sm:text-4xl font-black text-indigo-950/70 bg-white/70 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-indigo-300 shadow-sm flex items-center justify-center mt-5">
                +
              </span>
            </div>

            {/* Slot 2: Second Selected Color */}
            <div className="flex flex-col items-center">
              <span className="text-[11px] sm:text-xs font-black text-indigo-950 uppercase tracking-wider mb-1">
                Color 2
              </span>
              <div
                onClick={() => color2 && handleClearSlot(2)}
                className={`relative w-20 h-22 sm:w-26 sm:h-28 rounded-3xl border-4 flex flex-col items-center justify-center transition-all cursor-pointer select-none ${
                  color2
                    ? `${PRIMARY_COLORS[color2].bgClass} ${PRIMARY_COLORS[color2].borderClass} ${PRIMARY_COLORS[color2].shadowClass} border-b-6 shadow-xl scale-105`
                    : 'bg-white/80 border-dashed border-indigo-300 shadow-inner hover:border-indigo-400 hover:bg-white'
                }`}
              >
                {color2 ? (
                  <motion.div
                    initial={{ scale: 0.5, y: -10 }}
                    animate={{ scale: 1, y: 0 }}
                    className="flex flex-col items-center justify-center"
                  >
                    <span className="text-3xl sm:text-4xl drop-shadow-sm">
                      {PRIMARY_COLORS[color2].emoji}
                    </span>
                    <span
                      className={`text-xs sm:text-sm font-black mt-1 ${PRIMARY_COLORS[color2].textClass}`}
                    >
                      {PRIMARY_COLORS[color2].name}
                    </span>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-indigo-300">
                    <span className="text-2xl sm:text-3xl font-black opacity-50">?</span>
                    <span className="text-[10px] font-black text-indigo-400 uppercase mt-1">
                      Pick Color
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Central Mixing Bowl / Cauldron Stage */}
          <div className="flex flex-col items-center relative my-2">
            {/* The Big Mixing Cauldron / Bowl Container */}
            <div
              className={`relative w-36 h-32 sm:w-48 sm:h-38 rounded-b-[48px] rounded-t-2xl border-4 sm:border-6 border-indigo-400 bg-white/90 shadow-2xl p-2 flex flex-col items-center justify-end overflow-hidden transition-all duration-300 ${
                isWrongCombo ? 'animate-shake border-red-500' : ''
              }`}
            >
              {/* Bowl Rim */}
              <div className="absolute top-0 inset-x-0 h-4 bg-indigo-200 border-b-2 border-indigo-300 rounded-t-xl" />

              {/* Liquid Contents & Animations */}
              {mixingStep === 0 && (
                <div className="flex flex-col items-center justify-center my-auto text-center opacity-40">
                  <span className="text-3xl sm:text-4xl">🥣</span>
                  <span className="text-[11px] font-black text-indigo-900 uppercase mt-1">
                    Mixer Bowl
                  </span>
                </div>
              )}

              {/* Step 1: Pouring Stream Animation */}
              {mixingStep === 1 && color1 && color2 && (
                <div className="w-full h-full relative flex items-center justify-center">
                  <motion.div
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="absolute inset-x-2 bottom-0 h-14 rounded-b-[40px] flex items-center justify-center overflow-hidden"
                  >
                    <div
                      className={`w-1/2 h-full ${PRIMARY_COLORS[color1].bgClass} animate-pulse`}
                    />
                    <div
                      className={`w-1/2 h-full ${PRIMARY_COLORS[color2].bgClass} animate-pulse`}
                    />
                  </motion.div>
                </div>
              )}

              {/* Step 2: Swirling Liquids */}
              {mixingStep === 2 && color1 && color2 && (
                <div className="w-full h-full relative flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                    className="w-24 h-24 rounded-full border-4 border-dashed border-white flex items-center justify-center overflow-hidden shadow-inner"
                    style={{
                      background: `conic-gradient(${PRIMARY_COLORS[color1].hex}, ${PRIMARY_COLORS[color2].hex}, ${PRIMARY_COLORS[color1].hex})`,
                    }}
                  >
                    <Sparkles className="w-6 h-6 text-white animate-spin" />
                  </motion.div>
                </div>
              )}

              {/* Step 3: Transformed Secondary Color Liquid */}
              {mixingStep === 3 && mixedColorResult && (
                <motion.div
                  initial={{ scale: 0.7, y: 15 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 18 }}
                  className={`w-full h-full rounded-b-[40px] flex flex-col items-center justify-center shadow-inner ${SECONDARY_COLORS[mixedColorResult].bgClass} ${SECONDARY_COLORS[mixedColorResult].textClass}`}
                >
                  <span className="text-4xl sm:text-5xl drop-shadow-md">
                    {SECONDARY_COLORS[mixedColorResult].emoji}
                  </span>
                  <span className="text-sm sm:text-base font-black tracking-wider uppercase drop-shadow-sm mt-0.5">
                    {SECONDARY_COLORS[mixedColorResult].name}
                  </span>
                </motion.div>
              )}
            </div>

            {/* MIX COLORS Action Button */}
            <div className="mt-3">
              <button
                type="button"
                onClick={handleMixColors}
                disabled={!color1 || !color2 || isMixing || isChallengeSuccess}
                className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl font-black text-base sm:text-lg uppercase tracking-wide transition-all shadow-xl select-none cursor-pointer ${
                  color1 && color2 && !isMixing && !isChallengeSuccess
                    ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 text-white border-b-6 border-rose-700 hover:scale-105 active:border-b-2 active:translate-y-1 animate-pulse'
                    : 'bg-slate-200 text-slate-400 border-b-4 border-slate-300 cursor-not-allowed opacity-75'
                }`}
              >
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                <span>MIX COLORS</span>
              </button>
            </div>
          </div>

          {/* Educational Formula Reveal Bar (Appears on Success) */}
          <AnimatePresence>
            {isChallengeSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="mt-2 bg-white border-4 border-emerald-400 px-6 py-2 rounded-2xl shadow-lg flex items-center gap-2 text-emerald-950 font-black text-sm sm:text-base"
              >
                <Check className="w-5 h-5 text-emerald-600 stroke-[3]" />
                <span>{targetInfo.formulaText}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* PRIMARY COLOR SELECTION TRAY (BOTTOM AREA) */}
        <div className="w-full max-w-2xl flex flex-col items-center mt-2 mb-1">
          <div className="text-xs sm:text-sm font-black text-indigo-950 uppercase tracking-wider mb-2 select-none">
            Choose 2 Colors to Mix
          </div>

          <div className="w-full flex items-center justify-center gap-4 sm:gap-6 p-3 bg-white/70 backdrop-blur-xs rounded-3xl border-3 border-indigo-200 shadow-inner">
            {currentChallenge.availableOptions.map((primaryId) => {
              const info = PRIMARY_COLORS[primaryId];
              const isSelected1 = color1 === primaryId;
              const isSelected2 = color2 === primaryId;
              const isSelected = isSelected1 || isSelected2;

              return (
                <button
                  key={`pick_${primaryId}`}
                  type="button"
                  onClick={() => handleSelectColor(primaryId)}
                  disabled={isMixing || isChallengeSuccess}
                  className={`relative flex flex-col items-center justify-center w-22 h-24 sm:w-28 sm:h-30 rounded-3xl border-b-6 sm:border-b-8 shadow-xl transition-all select-none cursor-pointer active:scale-95 touch-none ${
                    info.bgClass
                  } ${info.borderClass} ${info.shadowClass} ${info.textClass} ${
                    isSelected
                      ? 'ring-4 ring-white ring-offset-3 ring-offset-indigo-500 scale-105'
                      : 'hover:scale-105 active:scale-95'
                  }`}
                >
                  <span className="text-3xl sm:text-4xl drop-shadow-md">{info.emoji}</span>
                  <span className="font-black text-sm sm:text-base tracking-wide mt-1 uppercase">
                    {info.name}
                  </span>

                  {/* Number Badge if selected */}
                  {isSelected1 && (
                    <span className="absolute -top-2 -left-2 bg-white text-indigo-900 border-2 border-indigo-400 rounded-full w-6 h-6 flex items-center justify-center font-black text-xs shadow-md">
                      1
                    </span>
                  )}
                  {isSelected2 && (
                    <span className="absolute -top-2 -right-2 bg-white text-indigo-900 border-2 border-indigo-400 rounded-full w-6 h-6 flex items-center justify-center font-black text-xs shadow-md">
                      2
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* SINGLE CHALLENGE SUCCESS OVERLAY */}
        <AnimatePresence>
          {isChallengeSuccess && !isAllFinished && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 z-30 flex items-center justify-center bg-black/20 backdrop-blur-xs p-4"
            >
              <div className="bg-white border-6 border-indigo-400 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center animate-bounce">
                <div className="text-5xl mb-2">{targetInfo.emoji}</div>
                <h3 className="text-2xl sm:text-3xl font-black text-indigo-950 uppercase tracking-wide">
                  Great Job!
                </h3>
                <p className="text-base sm:text-lg font-black text-indigo-800 mt-1">
                  You made {targetInfo.name}!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ALL CHALLENGES FINISHED CELEBRATION OVERLAY */}
        <AnimatePresence>
          {isAllFinished && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 z-40 flex items-center justify-center bg-white/95 backdrop-blur-sm p-4"
            >
              <div className="bg-gradient-to-b from-indigo-50 to-purple-50 border-8 border-indigo-400 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center max-w-md w-full">
                <div className="text-6xl sm:text-7xl mb-2 animate-bounce">🎨</div>
                <h3 className="text-2xl sm:text-3xl font-black text-indigo-950 tracking-tight">
                  COLOR MIXING MASTER!
                </h3>
                <p className="text-sm sm:text-base font-bold text-indigo-800 mt-2 mb-4">
                  You discovered all secondary colors by mixing red, yellow, and blue!
                </p>

                <div className="flex items-center gap-2 bg-indigo-200 border-2 border-indigo-400 px-4 py-2 rounded-full font-black text-indigo-950 text-base mb-6">
                  <StarIcon className="w-6 h-6 fill-amber-400 text-amber-600" />
                  <span>STAR EARNED!</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <button
                    type="button"
                    onClick={handlePlayAgain}
                    className="flex-1 flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-black py-3.5 px-6 rounded-2xl border-b-6 border-indigo-700 shadow-lg active:border-b-2 active:translate-y-1 transition-all cursor-pointer text-base uppercase"
                  >
                    <RotateCcw className="w-5 h-5 stroke-[3]" />
                    <span>Play Again</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigateNext) onNavigateNext();
                      else if (onNavigateHome) onNavigateHome();
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black py-3.5 px-6 rounded-2xl border-b-6 border-emerald-700 shadow-lg active:border-b-2 active:translate-y-1 transition-all cursor-pointer text-base uppercase"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-5 h-5 stroke-[3]" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Standard Bottom Navigation: [ PREV ] [ HOME ] [ NEXT ] */}
      <ActivityBottomNav
        onNavigatePrev={onNavigatePrev}
        onNavigateHome={onNavigateHome}
        onNavigateNext={onNavigateNext}
        isNextUnlocked={isActivityCompleted || isAllFinished}
      />
    </div>
  );
};
