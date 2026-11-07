import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Volume2, Sparkles, Star as StarIcon } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { ActivityBottomNav } from './ActivityBottomNav';
import { CatchStarsIcon } from '../common/CatchStarsIcon';

interface CatchTheStarsProps {
  onCollectStar: () => void;
  onNavigateHome?: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  isActivityCompleted?: boolean;
}

export type StarColor = 'yellow' | 'blue' | 'pink' | 'green' | 'purple' | 'orange' | 'red';
export type GameMode = 'color' | 'number';

export interface StarColorDef {
  id: StarColor;
  name: string;
  voiceName: string;
  fill: string;
  stroke: string;
  glow: string;
  badgeBg: string;
  textColor: string;
}

export const STAR_COLORS: Record<StarColor, StarColorDef> = {
  yellow: {
    id: 'yellow',
    name: 'Yellow',
    voiceName: 'yellow',
    fill: 'url(#yellowStarGrad)',
    stroke: '#CA8A04',
    glow: 'rgba(250, 204, 21, 0.65)',
    badgeBg: 'bg-amber-400 text-amber-950 border-amber-500',
    textColor: 'text-amber-950',
  },
  blue: {
    id: 'blue',
    name: 'Blue',
    voiceName: 'blue',
    fill: 'url(#blueStarGrad)',
    stroke: '#0284C7',
    glow: 'rgba(56, 189, 248, 0.65)',
    badgeBg: 'bg-sky-400 text-white border-sky-600',
    textColor: 'text-sky-950',
  },
  pink: {
    id: 'pink',
    name: 'Pink',
    voiceName: 'pink',
    fill: 'url(#pinkStarGrad)',
    stroke: '#DB2777',
    glow: 'rgba(244, 114, 182, 0.65)',
    badgeBg: 'bg-pink-400 text-white border-pink-600',
    textColor: 'text-pink-950',
  },
  green: {
    id: 'green',
    name: 'Green',
    voiceName: 'green',
    fill: 'url(#greenStarGrad)',
    stroke: '#16A34A',
    glow: 'rgba(74, 222, 128, 0.65)',
    badgeBg: 'bg-emerald-400 text-white border-emerald-600',
    textColor: 'text-emerald-950',
  },
  purple: {
    id: 'purple',
    name: 'Purple',
    voiceName: 'purple',
    fill: 'url(#purpleStarGrad)',
    stroke: '#9333EA',
    glow: 'rgba(192, 132, 252, 0.65)',
    badgeBg: 'bg-purple-400 text-white border-purple-600',
    textColor: 'text-purple-950',
  },
  orange: {
    id: 'orange',
    name: 'Orange',
    voiceName: 'orange',
    fill: 'url(#orangeStarGrad)',
    stroke: '#EA580C',
    glow: 'rgba(251, 146, 60, 0.65)',
    badgeBg: 'bg-orange-400 text-white border-orange-600',
    textColor: 'text-orange-950',
  },
  red: {
    id: 'red',
    name: 'Red',
    voiceName: 'red',
    fill: 'url(#redStarGrad)',
    stroke: '#DC2626',
    glow: 'rgba(248, 113, 113, 0.65)',
    badgeBg: 'bg-red-400 text-white border-red-600',
    textColor: 'text-red-950',
  },
};

export interface FloatingStar {
  id: string;
  color: StarColor;
  number?: number;
  isTarget: boolean;
  isCaught: boolean;
  isWobbling: boolean;
  // Natural layout coordinates (in percentage of game area)
  x: number;
  y: number;
  size: number;
  // Unique float animation timing parameters
  floatDuration: number;
  floatDelay: number;
  floatYRange: number;
  floatXRange: number;
}

export interface CatchSparkle {
  id: string;
  x: number;
  y: number;
  color: string;
  symbol: string;
}

// 9 spatial anchor zones across the play canvas (ensuring natural, spacious spread)
const SPATIAL_ZONES = [
  { name: 'upper-left', x: 14, y: 15 },
  { name: 'upper-middle', x: 48, y: 13 },
  { name: 'upper-right', x: 82, y: 16 },
  { name: 'middle-left', x: 15, y: 44 },
  { name: 'center', x: 50, y: 46 },
  { name: 'middle-right', x: 83, y: 45 },
  { name: 'lower-left', x: 18, y: 76 },
  { name: 'lower-middle', x: 50, y: 79 },
  { name: 'lower-right', x: 81, y: 75 },
];

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const COLOR_TARGET_LIST: StarColor[] = ['yellow', 'blue', 'pink', 'green', 'purple', 'orange', 'red'];
const NUMBER_TARGET_LIST = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const TOTAL_ROUNDS = 5;

export const CatchTheStars: React.FC<CatchTheStarsProps> = ({
  onCollectStar,
  onNavigateHome,
  onNavigateNext,
  onNavigatePrev,
  isActivityCompleted = false,
}) => {
  const [gameMode, setGameMode] = useState<GameMode>('color');
  const [roundLevel, setRoundLevel] = useState(1); // 1 to TOTAL_ROUNDS
  const [targetColor, setTargetColor] = useState<StarColor>('yellow');
  const [targetNumber, setTargetNumber] = useState<number>(3);
  const [targetCount, setTargetCount] = useState<number>(2);
  const [caughtCount, setCaughtCount] = useState<number>(0);
  const [stars, setStars] = useState<FloatingStar[]>([]);
  const [sparkles, setSparkles] = useState<CatchSparkle[]>([]);
  const [isRoundWon, setIsRoundWon] = useState(false);
  const [isRoundTransitioning, setIsRoundTransitioning] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [instructionText, setInstructionText] = useState('');
  const [sessionNonce, setSessionNonce] = useState(1);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const transitionTimerRef = useRef<any>(null);
  const celebrationAudioTimerRef = useRef<any>(null);

  // Generate a completely fresh, randomized star sky board
  const generateBoard = useCallback(
    (mode: GameMode, level: number) => {
      soundManager.stopSpeech();

      let reqCount = Math.min(2 + (level - 1), 5); // 2, 3, 3, 4, 5
      let chosenColor: StarColor = 'yellow';
      let chosenNum: number = 3;
      let prompt = '';

      if (mode === 'color') {
        const shuffledColors = shuffleArray(COLOR_TARGET_LIST);
        chosenColor = shuffledColors[0];
        setTargetColor(chosenColor);
        setTargetCount(reqCount);
        setCaughtCount(0);
        setIsRoundWon(false);
        setIsRoundTransitioning(false);
        setShowCelebration(false);

        const colorDef = STAR_COLORS[chosenColor];
        prompt =
          reqCount === 1
            ? `Catch the ${colorDef.name.toLowerCase()} star!`
            : `Catch ${reqCount} ${colorDef.name.toLowerCase()} stars!`;
        setInstructionText(prompt);

        // Prepare star pool
        const shuffledZones = shuffleArray(SPATIAL_ZONES);
        const totalStars = Math.max(reqCount + 4, 7); // 7 to 9 stars on screen
        const generatedStars: FloatingStar[] = [];

        // Add target stars
        for (let i = 0; i < reqCount; i++) {
          const zone = shuffledZones[i];
          const jitterX = (Math.random() - 0.5) * 8; // +/- 4%
          const jitterY = (Math.random() - 0.5) * 8; // +/- 4%
          generatedStars.push({
            id: `star_target_${i}_${Date.now()}_${Math.random()}`,
            color: chosenColor,
            isTarget: true,
            isCaught: false,
            isWobbling: false,
            x: Math.max(10, Math.min(88, zone.x + jitterX)),
            y: Math.max(12, Math.min(85, zone.y + jitterY)),
            size: 78 + Math.floor(Math.random() * 12),
            floatDuration: 3.6 + Math.random() * 2.0,
            floatDelay: Math.random() * 1.5,
            floatYRange: 8 + Math.random() * 8,
            floatXRange: 5 + Math.random() * 6,
          });
        }

        // Add distractor other colored stars
        const distractorColors = COLOR_TARGET_LIST.filter((c) => c !== chosenColor);
        const shuffledDistractors = shuffleArray(distractorColors);

        for (let i = reqCount; i < totalStars; i++) {
          const zone = shuffledZones[i % shuffledZones.length];
          const jitterX = (Math.random() - 0.5) * 8;
          const jitterY = (Math.random() - 0.5) * 8;
          const distColor = shuffledDistractors[(i - reqCount) % shuffledDistractors.length];

          generatedStars.push({
            id: `star_dist_${i}_${Date.now()}_${Math.random()}`,
            color: distColor,
            isTarget: false,
            isCaught: false,
            isWobbling: false,
            x: Math.max(10, Math.min(88, zone.x + jitterX)),
            y: Math.max(12, Math.min(85, zone.y + jitterY)),
            size: 76 + Math.floor(Math.random() * 10),
            floatDuration: 3.6 + Math.random() * 2.0,
            floatDelay: Math.random() * 1.5,
            floatYRange: 8 + Math.random() * 8,
            floatXRange: 5 + Math.random() * 6,
          });
        }

        // Shuffle the stars array so DOM order is randomized
        setStars(shuffleArray(generatedStars));
      } else {
        // Mode = 'number'
        const shuffledNums = shuffleArray(NUMBER_TARGET_LIST);
        chosenNum = shuffledNums[0];
        // In number mode, target count is 1 for initial levels, 2 for later levels
        reqCount = level <= 2 ? 1 : 2;
        setTargetNumber(chosenNum);
        setTargetCount(reqCount);
        setCaughtCount(0);
        setIsRoundWon(false);
        setIsRoundTransitioning(false);
        setShowCelebration(false);

        prompt =
          reqCount === 1
            ? `Catch number ${chosenNum}!`
            : `Catch ${reqCount} stars with number ${chosenNum}!`;
        setInstructionText(prompt);

        const shuffledZones = shuffleArray(SPATIAL_ZONES);
        const totalStars = 7;
        const generatedStars: FloatingStar[] = [];

        // Choose appealing star colors
        const availableColors = shuffleArray(COLOR_TARGET_LIST);

        // Add target number stars
        for (let i = 0; i < reqCount; i++) {
          const zone = shuffledZones[i];
          const jitterX = (Math.random() - 0.5) * 8;
          const jitterY = (Math.random() - 0.5) * 8;
          generatedStars.push({
            id: `num_target_${i}_${Date.now()}_${Math.random()}`,
            color: availableColors[i % availableColors.length],
            number: chosenNum,
            isTarget: true,
            isCaught: false,
            isWobbling: false,
            x: Math.max(10, Math.min(88, zone.x + jitterX)),
            y: Math.max(12, Math.min(85, zone.y + jitterY)),
            size: 80 + Math.floor(Math.random() * 10),
            floatDuration: 3.8 + Math.random() * 1.8,
            floatDelay: Math.random() * 1.5,
            floatYRange: 8 + Math.random() * 8,
            floatXRange: 5 + Math.random() * 6,
          });
        }

        // Add distractor other numbers
        const otherNums = NUMBER_TARGET_LIST.filter((n) => n !== chosenNum);
        const shuffledOtherNums = shuffleArray(otherNums);

        for (let i = reqCount; i < totalStars; i++) {
          const zone = shuffledZones[i % shuffledZones.length];
          const jitterX = (Math.random() - 0.5) * 8;
          const jitterY = (Math.random() - 0.5) * 8;
          const distNum = shuffledOtherNums[(i - reqCount) % shuffledOtherNums.length];
          const color = availableColors[i % availableColors.length];

          generatedStars.push({
            id: `num_dist_${i}_${Date.now()}_${Math.random()}`,
            color: color,
            number: distNum,
            isTarget: false,
            isCaught: false,
            isWobbling: false,
            x: Math.max(10, Math.min(88, zone.x + jitterX)),
            y: Math.max(12, Math.min(85, zone.y + jitterY)),
            size: 78 + Math.floor(Math.random() * 10),
            floatDuration: 3.8 + Math.random() * 1.8,
            floatDelay: Math.random() * 1.5,
            floatYRange: 8 + Math.random() * 8,
            floatXRange: 5 + Math.random() * 6,
          });
        }

        setStars(shuffleArray(generatedStars));
      }

      // Play intro prompt voice with small initial delay
      setTimeout(() => {
        soundManager.speak(prompt);
      }, 180);
    },
    []
  );

  // Initialize or re-shuffle game on mode, level, or session nonce changes
  useEffect(() => {
    generateBoard(gameMode, roundLevel);
  }, [gameMode, roundLevel, sessionNonce, generateBoard]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
      if (celebrationAudioTimerRef.current) {
        clearTimeout(celebrationAudioTimerRef.current);
      }
      soundManager.stopSpeech();
    };
  }, []);

  // Handle star tap
  const handleStarClick = (star: FloatingStar, e?: React.MouseEvent | React.TouchEvent) => {
    if (star.isCaught || isRoundWon || isRoundTransitioning) return;

    if (star.isTarget) {
      // 1. Play crystal glockenspiel star catch sound
      soundManager.playStarCatch();

      // 2. Spawn sparkle particles
      const sparkleId = `sparkle_${Date.now()}_${Math.random()}`;
      const newSparkle: CatchSparkle = {
        id: sparkleId,
        x: star.x,
        y: star.y,
        color: STAR_COLORS[star.color].stroke,
        symbol: '✨',
      };
      setSparkles((prev) => [...prev, newSparkle]);
      setTimeout(() => {
        setSparkles((prev) => prev.filter((s) => s.id !== sparkleId));
      }, 700);

      // 3. Mark star as caught so it flies smoothly
      setStars((prev) =>
        prev.map((s) => (s.id === star.id ? { ...s, isCaught: true } : s))
      );

      const nextCaught = caughtCount + 1;
      setCaughtCount(nextCaught);

      if (nextCaught < targetCount) {
        // Intermediate star caught
        const praises = ['Great job!', 'You caught it!', 'Super star!', 'Wonderful!'];
        const p = praises[Math.floor(Math.random() * praises.length)];
        soundManager.speak(p);
      } else {
        // Target count reached for this round!
        if (roundLevel < TOTAL_ROUNDS) {
          // INTERMEDIATE ROUND COMPLETION:
          // Play success feedback, say "Good job!", and AUTOMATICALLY advance without any click
          setIsRoundTransitioning(true);
          soundManager.speak('Good job!');

          if (transitionTimerRef.current) {
            clearTimeout(transitionTimerRef.current);
          }

          // Wait 850-1000ms, then automatically load next round
          transitionTimerRef.current = setTimeout(() => {
            setRoundLevel((prev) => prev + 1);
            setSessionNonce((prev) => prev + 1);
          }, 950);
        } else {
          // FINAL ROUND COMPLETION (Whole Activity Completed):
          setIsRoundWon(true);
          onCollectStar();
          soundManager.speak('Good job!');

          celebrationAudioTimerRef.current = setTimeout(() => {
            setShowCelebration(true);
            soundManager.playCelebration();
            soundManager.speak('Great job! You caught all the stars!');
          }, 650);
        }
      }
    } else {
      // Wrong Star Clicked - Gentle preschool feedback without penalty
      soundManager.playError();

      // Set gentle wobble animation on this star
      setStars((prev) =>
        prev.map((s) => (s.id === star.id ? { ...s, isWobbling: true } : s))
      );
      setTimeout(() => {
        setStars((prev) =>
          prev.map((s) => (s.id === star.id ? { ...s, isWobbling: false } : s))
        );
      }, 500);

      if (gameMode === 'color') {
        soundManager.speak(`Oops! Try the ${STAR_COLORS[targetColor].name.toLowerCase()} star.`);
      } else {
        soundManager.speak(`Try again! Catch number ${targetNumber}!`);
      }
    }
  };

  // Replay completely reshuffles everything back to Round 1
  const handleReplay = () => {
    soundManager.playPop();
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    if (celebrationAudioTimerRef.current) clearTimeout(celebrationAudioTimerRef.current);
    setRoundLevel(1);
    setSessionNonce((prev) => prev + 1);
  };

  // Repeat current spoken prompt
  const handleRepeatVoice = () => {
    soundManager.playPop();
    soundManager.speak(instructionText);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center select-none px-2 sm:px-4 py-2">
      {/* SVG Global Gradients for Star Renderings */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          {/* Yellow Star Gradient */}
          <linearGradient id="yellowStarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="45%" stopColor="#FACC15" />
            <stop offset="100%" stopColor="#EAB308" />
          </linearGradient>

          {/* Blue Star Gradient */}
          <linearGradient id="blueStarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#BAE6FD" />
            <stop offset="45%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>

          {/* Pink Star Gradient */}
          <linearGradient id="pinkStarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBCFE8" />
            <stop offset="45%" stopColor="#F472B6" />
            <stop offset="100%" stopColor="#DB2777" />
          </linearGradient>

          {/* Green Star Gradient */}
          <linearGradient id="greenStarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#BBF7D0" />
            <stop offset="45%" stopColor="#4ADE80" />
            <stop offset="100%" stopColor="#16A34A" />
          </linearGradient>

          {/* Purple Star Gradient */}
          <linearGradient id="purpleStarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E9D5FF" />
            <stop offset="45%" stopColor="#C084FC" />
            <stop offset="100%" stopColor="#9333EA" />
          </linearGradient>

          {/* Orange Star Gradient */}
          <linearGradient id="orangeStarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FED7AA" />
            <stop offset="45%" stopColor="#FB923C" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>

          {/* Red Star Gradient */}
          <linearGradient id="redStarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FECACA" />
            <stop offset="45%" stopColor="#F87171" />
            <stop offset="100%" stopColor="#DC2626" />
          </linearGradient>
        </defs>
      </svg>

      {/* Top Header Card */}
      <div className="w-full bg-white/90 backdrop-blur-md rounded-3xl p-3 sm:p-4 shadow-xl border-4 border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-3 mb-3">
        {/* Title & Mode Switcher */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-900 rounded-2xl flex items-center justify-center border-2 border-amber-400 shadow-md">
            <CatchStarsIcon size="md" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-wide flex items-center gap-1.5">
              CATCH THE STARS <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400 animate-pulse" />
            </h1>
            <p className="text-xs sm:text-sm font-bold text-slate-500">
              Tap the floating night stars to catch them!
            </p>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-300">
          <button
            type="button"
            onClick={() => {
              if (gameMode !== 'color') {
                soundManager.playPop();
                setGameMode('color');
                setRoundLevel(1);
              }
            }}
            className={`px-3 py-1.5 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer ${
              gameMode === 'color'
                ? 'bg-amber-400 text-amber-950 shadow-md border-b-2 border-amber-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🎨</span>
            <span>Color Stars</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (gameMode !== 'number') {
                soundManager.playPop();
                setGameMode('number');
                setRoundLevel(1);
              }
            }}
            className={`px-3 py-1.5 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer ${
              gameMode === 'number'
                ? 'bg-indigo-600 text-white shadow-md border-b-2 border-indigo-900'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🔢</span>
            <span>Number Stars</span>
          </button>
        </div>
      </div>

      {/* Spoken Voice Instruction & Collection Ribbon */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-center mb-3">
        {/* Active Target Banner */}
        <div className="sm:col-span-2 bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-950 text-white p-3 rounded-2xl border-2 border-amber-400 shadow-md flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleRepeatVoice}
              aria-label="Repeat voice prompt"
              className="w-10 h-10 bg-amber-400 hover:bg-amber-300 text-amber-950 rounded-full flex items-center justify-center shadow-md active:scale-95 transition-transform cursor-pointer shrink-0"
            >
              <Volume2 className="w-5 h-5 stroke-[2.5]" />
            </button>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300 block">
                Target Objective
              </span>
              <span className="text-base sm:text-lg font-black text-white leading-tight">
                {instructionText}
              </span>
            </div>
          </div>

          {/* Visual Target Pill */}
          <div className="shrink-0 flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-full border border-white/25">
            {gameMode === 'color' ? (
              <>
                <span className="text-xl leading-none">⭐</span>
                <span className="text-sm font-black uppercase text-amber-300">
                  {STAR_COLORS[targetColor].name}
                </span>
              </>
            ) : (
              <>
                <span className="text-xl leading-none">⭐</span>
                <span className="text-base font-black text-amber-300">
                  #{targetNumber}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Collection Area (Cute Star Counter) */}
        <div className="bg-gradient-to-r from-amber-100 to-yellow-50 p-2.5 rounded-2xl border-2 border-amber-400 shadow-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-amber-400 rounded-xl flex items-center justify-center shadow-xs text-xl">
              ⭐
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-amber-800 block">
                Stars Caught
              </span>
              <span className="text-lg font-black text-amber-950 leading-none">
                {caughtCount} / {targetCount}
              </span>
            </div>
          </div>

          {/* Mini Star Fill Indicator */}
          <div className="flex items-center gap-1">
            {Array.from({ length: targetCount }).map((_, i) => (
              <span
                key={i}
                className={`text-lg transition-transform ${
                  i < caughtCount ? 'text-amber-500 scale-110 drop-shadow-xs' : 'text-slate-300 opacity-60'
                }`}
              >
                ⭐
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Night Sky Playable Scene */}
      <div
        ref={containerRef}
        className="w-full relative h-[460px] sm:h-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 border-indigo-400/80 bg-gradient-to-b from-[#0B1120] via-[#1E1B4B] to-[#312E81] select-none"
      >
        {/* Background Atmosphere - Twinkling Micro Stars */}
        <div className="absolute inset-0 pointer-events-none opacity-70">
          <span className="absolute top-[8%] left-[10%] text-white text-xs animate-pulse">✦</span>
          <span className="absolute top-[22%] left-[25%] text-amber-200 text-sm animate-pulse" style={{ animationDelay: '0.6s' }}>★</span>
          <span className="absolute top-[12%] left-[65%] text-white text-xs animate-pulse" style={{ animationDelay: '1.2s' }}>✦</span>
          <span className="absolute top-[35%] left-[88%] text-sky-200 text-sm animate-pulse" style={{ animationDelay: '0.3s' }}>★</span>
          <span className="absolute top-[60%] left-[8%] text-pink-200 text-xs animate-pulse" style={{ animationDelay: '0.9s' }}>✦</span>
          <span className="absolute top-[78%] left-[30%] text-white text-sm animate-pulse" style={{ animationDelay: '1.5s' }}>★</span>
          <span className="absolute top-[68%] left-[70%] text-amber-100 text-xs animate-pulse" style={{ animationDelay: '0.4s' }}>✦</span>
          <span className="absolute top-[85%] left-[90%] text-white text-sm animate-pulse" style={{ animationDelay: '1.1s' }}>★</span>
        </div>

        {/* Gentle Smiling Crescent Moon in Upper Sky */}
        <div className="absolute top-4 right-6 pointer-events-none opacity-90">
          <svg width="68" height="68" viewBox="0 0 100 100" fill="none">
            <path
              d="M 68 15 A 38 38 0 0 0 35 68 A 34 34 0 1 1 68 15 Z"
              fill="#FEF08A"
              stroke="#FBBF24"
              strokeWidth="2.5"
            />
            <circle cx="44" cy="42" r="3" fill="#78350F" />
            <path d="M 42 50 Q 47 55 52 50" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <circle cx="39" cy="48" r="3.5" fill="#F472B6" opacity="0.6" />
          </svg>
        </div>

        {/* Translucent Soft Floating Night Clouds */}
        <div className="absolute -bottom-6 -left-8 w-64 h-24 bg-indigo-300/15 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-8 -right-8 w-80 h-28 bg-purple-300/15 rounded-full blur-xl pointer-events-none" />
        <div className="absolute top-1/3 -left-12 w-48 h-20 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />

        {/* Floating Interactive Stars */}
        <AnimatePresence>
          {stars.map((star) => {
            if (star.isCaught) return null;

            return (
              <motion.div
                key={star.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  y: [0, -star.floatYRange, 0, star.floatYRange * 0.7, 0],
                  x: [0, star.floatXRange, 0, -star.floatXRange, 0],
                  rotate: star.isWobbling ? [-12, 12, -8, 8, 0] : [-3, 3, -3],
                }}
                exit={{
                  scale: [1, 1.3, 0],
                  opacity: [1, 1, 0],
                  y: -120,
                  transition: { duration: 0.45, ease: 'easeOut' },
                }}
                transition={{
                  scale: { duration: 0.35 },
                  opacity: { duration: 0.35 },
                  y: {
                    repeat: Infinity,
                    duration: star.floatDuration,
                    delay: star.floatDelay,
                    ease: 'easeInOut',
                  },
                  x: {
                    repeat: Infinity,
                    duration: star.floatDuration * 1.2,
                    delay: star.floatDelay,
                    ease: 'easeInOut',
                  },
                  rotate: star.isWobbling
                    ? { duration: 0.4 }
                    : {
                        repeat: Infinity,
                        duration: star.floatDuration * 1.5,
                        ease: 'easeInOut',
                      },
                }}
                style={{
                  position: 'absolute',
                  top: `${star.y}%`,
                  left: `${star.x}%`,
                  transform: 'translate(-50%, -50%)',
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                }}
                className="cursor-pointer select-none touch-manipulation flex items-center justify-center group"
                onClick={(e) => handleStarClick(star, e)}
              >
                {/* Generous Invisible Touch Boundary (Minimum 88x88px) */}
                <div className="absolute -inset-4 rounded-full bg-transparent" />

                {/* Soft Star Glow Halo */}
                <div
                  className="absolute inset-0 rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{
                    backgroundColor: STAR_COLORS[star.color].glow,
                    transform: 'scale(1.15)',
                  }}
                />

                {/* Custom SVG Star Artwork with Cute Friendly Preschool Face */}
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full drop-shadow-lg filter transition-transform group-hover:scale-105 active:scale-95"
                >
                  {/* 5-pointed Rounded Star Body */}
                  <path
                    d="M 50 8 
                       L 61 33 
                       L 89 36 
                       L 68 56 
                       L 74 83 
                       L 50 69 
                       L 26 83 
                       L 32 56 
                       L 11 36 
                       L 39 33 Z"
                    fill={STAR_COLORS[star.color].fill}
                    stroke={STAR_COLORS[star.color].stroke}
                    strokeWidth="3.5"
                    strokeLinejoin="round"
                  />

                  {/* Sparkle Highlight Top Left */}
                  <circle cx="42" cy="26" r="3.5" fill="#FFFFFF" opacity="0.8" />
                  <circle cx="36" cy="33" r="2" fill="#FFFFFF" opacity="0.6" />

                  {/* Star Face Details */}
                  {gameMode === 'color' || star.number === undefined ? (
                    <>
                      {/* Happy Sparkling Eyes */}
                      <circle cx="41" cy="48" r="3.8" fill="#1E1B4B" />
                      <circle cx="59" cy="48" r="3.8" fill="#1E1B4B" />
                      {/* Eye Glint */}
                      <circle cx="39.5" cy="46.5" r="1.5" fill="#FFFFFF" />
                      <circle cx="57.5" cy="46.5" r="1.5" fill="#FFFFFF" />

                      {/* Sweet Smiling Mouth */}
                      <path
                        d="M 43 56 Q 50 63 57 56"
                        stroke="#1E1B4B"
                        strokeWidth="3"
                        strokeLinecap="round"
                        fill="none"
                      />

                      {/* Rosy Cheeks */}
                      <circle cx="34" cy="55" r="3.5" fill="#F43F5E" opacity="0.55" />
                      <circle cx="66" cy="55" r="3.5" fill="#F43F5E" opacity="0.55" />
                    </>
                  ) : (
                    <>
                      {/* Number Mode: Big Clear Friendly Preschool Number */}
                      <text
                        x="50"
                        y="58"
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="font-black select-none pointer-events-none"
                        style={{
                          fontSize: '34px',
                          fontWeight: 900,
                          fill: '#1E1B4B',
                          filter: 'drop-shadow(0 1px 1px rgba(255,255,255,0.8))',
                        }}
                      >
                        {star.number}
                      </text>
                    </>
                  )}
                </svg>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Dynamic Sparkle Particles on Successful Star Catch */}
        {sparkles.map((sp) => (
          <motion.div
            key={sp.id}
            initial={{ scale: 0, opacity: 1, y: 0 }}
            animate={{ scale: 2, opacity: 0, y: -40 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: `${sp.y}%`,
              left: `${sp.x}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className="pointer-events-none text-2xl font-black select-none z-30"
          >
            ✨🌟💫
          </motion.div>
        ))}

        {/* Temporary Smooth Round Completion Feedback Banner */}
        <AnimatePresence>
          {isRoundTransitioning && (
            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-900/90 backdrop-blur-md text-amber-300 px-6 py-3 rounded-3xl border-3 border-amber-400 shadow-2xl z-30 flex items-center gap-2 pointer-events-none"
            >
              <span className="text-2xl animate-bounce">⭐</span>
              <span className="text-xl sm:text-2xl font-black tracking-wide text-white">
                Good job!
              </span>
              <span className="text-2xl animate-bounce">✨</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Celebration Overlay when WHOLE Activity is Completed */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 bg-indigo-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 z-40 text-center"
            >
              {/* Gold Trophy & Star Burst */}
              <div className="relative mb-3">
                <div className="w-24 h-24 bg-gradient-to-tr from-amber-400 to-yellow-200 rounded-full flex items-center justify-center border-4 border-amber-300 shadow-2xl animate-bounce">
                  <StarIcon className="w-14 h-14 text-amber-950 fill-amber-500" />
                </div>
                <span className="text-3xl absolute -top-2 -left-2 animate-spin-slow">✨</span>
                <span className="text-3xl absolute -top-2 -right-2 animate-spin-slow">🌟</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-amber-300 mb-1 tracking-wide">
                WONDERFUL!
              </h2>
              <p className="text-base sm:text-lg font-black text-white mb-6">
                You caught all the stars!
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={handleReplay}
                  className="bg-[#F7D060] hover:bg-amber-400 text-amber-950 font-black py-3.5 px-8 rounded-2xl border-b-6 border-[#CA8A04] shadow-xl active:border-b-2 active:translate-y-1 transition-all cursor-pointer text-base sm:text-lg flex items-center gap-2 uppercase tracking-wide"
                >
                  <RotateCcw className="w-5 h-5 stroke-[2.5]" />
                  <span>Play Again</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Activity Control Bar (Round Info) */}
      <div className="w-full flex items-center justify-end mt-3 px-1">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-slate-600 bg-white/80 px-3.5 py-1.5 rounded-full border border-slate-300 shadow-xs">
          <span>Mode: {gameMode === 'color' ? 'Colors' : 'Numbers'}</span>
          <span>•</span>
          <span>Round {roundLevel} of {TOTAL_ROUNDS}</span>
        </div>
      </div>

      {/* Standard Activity Bottom Navigation */}
      <ActivityBottomNav
        onNavigatePrev={onNavigatePrev}
        onNavigateHome={onNavigateHome}
        onNavigateNext={onNavigateNext}
        isNextUnlocked={isActivityCompleted || isRoundWon}
      />
    </div>
  );
};
